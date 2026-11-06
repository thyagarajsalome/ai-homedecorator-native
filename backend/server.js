const express = require('express');
const cors = require('cors');
const multer = require('multer');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GoogleGenAI } = require('@google/genai');
const sharp = require('sharp'); 

// Native Node modules for FFmpeg video processing
const { exec } = require('child_process');
const util = require('util');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const execPromise = util.promisify(exec);

dotenv.config();

// ============================================
// CONFIGURATION
// ============================================
const USE_GEMINI_ENHANCEMENT = process.env.USE_GEMINI_ENHANCEMENT !== 'false'; 

const NEGATIVE_PROMPT = 'blurry, distorted, deformed, ugly, bad anatomy, bad proportions, extra limbs, ' +
  'missing limbs, fused fingers, watermark, text, signature, low quality, duplicate, mutated, ' +
  'disfigured, poorly drawn, poorly rendered, noisy, grainy, oversaturated, cluttered, messy, ' +
  'unrealistic furniture, floating objects, broken walls, collapsing ceiling';

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: '15mb' })); // Slightly increased limit for buffer handling

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const geminiApiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(geminiApiKey);
const googleGenAIClient = new GoogleGenAI({ apiKey: geminiApiKey });

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, 
});

const verifySupabaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    req.user = user; 
    next();
  } catch (err) {
    console.error('Token verification structural exception:', err);
    return res.status(401).json({ error: 'Authentication processing failed' });
  }
};

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

function getFallbackImage(message) {
  const svg = `
    <svg width="600" height="800" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#1E293B"/>
      <text x="50%" y="50%" font-family="Arial" font-size="20" fill="#94A3B8" text-anchor="middle" dominant-baseline="middle">
        ${message}
      </text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

// ============================================
// FFMPEG MORPHING ENGINE
// ============================================
async function createMorphVideo(sourceBuffer, generatedBuffer) {
  const sessionId = crypto.randomBytes(16).toString('hex');
  const tempDir = os.tmpdir();
  
  const sourcePath = path.join(tempDir, `source_${sessionId}.jpg`);
  const genPath = path.join(tempDir, `gen_${sessionId}.jpg`);
  const outputPath = path.join(tempDir, `output_${sessionId}.mp4`);

  try {
    await fs.writeFile(sourcePath, sourceBuffer);
    await fs.writeFile(genPath, generatedBuffer);

    // Xfade Wipe Right Transition (3 Seconds Total)
    const ffmpegCommand = `ffmpeg -loop 1 -t 2 -i "${sourcePath}" -loop 1 -t 2 -i "${genPath}" -filter_complex "[0][1]xfade=transition=wiperight:duration=1:offset=1,format=yuv420p" -c:v libx264 -preset veryfast -crf 28 -y "${outputPath}"`;

    console.log(`Starting FFmpeg render for session: ${sessionId}`);
    await execPromise(ffmpegCommand);

    const videoBuffer = await fs.readFile(outputPath);
    return `data:video/mp4;base64,${videoBuffer.toString('base64')}`;
  } catch (err) {
    console.error("FFmpeg rendering failed:", err);
    return null; 
  } finally {
    // Strict Cleanup to prevent container memory exhaustion
    await fs.unlink(sourcePath).catch(() => {});
    await fs.unlink(genPath).catch(() => {});
    await fs.unlink(outputPath).catch(() => {});
  }
}

// ============================================
// MAIN GENERATION CONTROLLER ROUTE
// ============================================
app.post('/api/decorate', verifySupabaseToken, upload.single('image'), async (req, res) => {
  try {
    const { designPrompt, roomType, designMode, roomDescription } = req.body;
    const file = req.file;

    if (!designPrompt) return res.status(400).json({ error: 'Missing designPrompt parameter' });
    if (!file) return res.status(400).json({ error: 'Missing uploaded room image snapshot file' });

    // Enforce Native Mobile App only policy (protect paid mobile API key)
    const origin = req.headers.origin || req.headers.referer || '';
    const clientPlatform = req.headers['x-client-platform'];

    if (origin.includes('aihomedecorator.com') || (origin && clientPlatform !== 'native-mobile')) {
      console.warn(`[Blocked Web Generation] Origin ${origin} attempted to use native mobile API.`);
      return res.status(403).json({
        error: 'AI image generation is exclusively reserved for the native mobile app. Please download the AI Home Decorator app on Google Play to transform your room.'
      });
    }

    console.log(`Processing design: [${roomType}] -> [${designPrompt}] for User ID: ${req.user.id} (Client: ${clientPlatform || 'native'})`);

    // Create user-scoped Supabase client to perform credit validation under user context
    const authHeader = req.headers.authorization;
    const userToken = authHeader.split(' ')[1];
    const userSupabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      },
      auth: {
        persistSession: false
      }
    });

    const cost = 1;

    // 1. Secure Credit Check
    const { data: profile, error: profileError } = await userSupabase
      .from('user_profiles')
      .select('generation_credits')
      .eq('id', req.user.id)
      .single();

    if (profileError || !profile) {
      console.error('Failed to retrieve user profile for credit check:', profileError);
      return res.status(500).json({ error: 'Failed to verify user profile' });
    }

    if (profile.generation_credits < cost) {
      return res.status(403).json({ error: `Insufficient credits. Need ${cost} credits, you have ${profile.generation_credits}.` });
    }

    const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

    // Extract Category & Pro Studio Parameters
    const category = (req.body.category || 'interior').toLowerCase(); // 'interior' | 'exterior' | 'landscape' | 'commercial'
    const atmosphere = req.body.atmosphere || 'daylight'; // 'daylight' | 'golden_hour' | 'evening_2700k' | 'twilight'
    const strength = req.body.transformationStrength || 'balanced'; // 'subtle' | 'balanced' | 'overhaul'

    // STEP 1: GEMINI 3.8 FLASH SPATIAL SCENE BLUEPRINT SYNTHESIS
    let finalPrompt = `A professionally designed ${roomType || 'space'} in a ${designPrompt} style, architectural visualization, photorealistic 8k`;

    if (USE_GEMINI_ENHANCEMENT && geminiApiKey) {
      try {
        console.log(`🧠 Analyzing uploaded space with Gemini 3.8 Flash Vision [Category: ${category}]...`);

        let roleInstruction = '';
        if (category === 'exterior') {
          roleInstruction = 'You are a world-class architectural exterior designer and facade renovation specialist. ' +
            'Inspect the uploaded building photo for roofline geometry, window grid, facade wall proportions, and entrance pathways. ' +
            'Write a precise, vivid visual transformation instruction describing new high-end materials (e.g. limestone, blackened wood slats, smooth stucco, metal finishes, glass railings), ' +
            'while strictly maintaining the building outline, story count, and camera perspective.';
        } else if (category === 'landscape') {
          roleInstruction = 'You are a master landscape architect and luxury outdoor living designer. ' +
            'Inspect the uploaded yard, garden, or patio photo for terrain, existing boundary fences, ground slope, and sunlight exposure. ' +
            'Write a precise, vivid visual transformation instruction describing lush botanical planting, architectural hardscaping (patio pavers, decking, pergolas, fire pits, swimming pools), ' +
            'while strictly maintaining the horizon and property boundaries.';
        } else if (category === 'commercial') {
          roleInstruction = 'You are an elite commercial interior architect and retail/hospitality designer. ' +
            'Inspect the uploaded space for commercial flow, storefront glazing, and structural columns. ' +
            'Write a precise visual transformation instruction describing commercial seating, counters, feature lighting fixtures, luxury hospitality materials, ' +
            'while strictly preserving structural pillars, entries, and spatial boundaries.';
        } else {
          // Interior default
          roleInstruction = 'You are an elite interior architect and luxury interior designer. ' +
            'Inspect the uploaded room photo for ceiling height, structural walls, window positions, and vanishing points. ' +
            'Write a concise, vivid visual transformation instruction describing high-end furniture, flooring (e.g. herringbone oak, microcement), ' +
            'custom millwork, and tactile textures, while strictly preserving the room geometry, windows, and camera vantage point.';
        }

        // Atmosphere / Lighting guidance
        let lightingDirective = 'Natural bright diffused daylight pouring through openings with soft ambient bounce shadows.';
        if (atmosphere === 'golden_hour') {
          lightingDirective = 'Warm low-angle sunset golden hour illumination casting long gentle architectural shadows and warm highlights.';
        } else if (atmosphere === 'evening_2700k') {
          lightingDirective = 'Warm cozy 2700K ambient illumination: concealed indirect LED cove lighting, warm wall sconces, and soft accent pools of light.';
        } else if (atmosphere === 'twilight') {
          lightingDirective = 'Dramatic architectural twilight at blue hour, deep cobalt sky exterior contrasted with warm glowing interior lights.';
        }

        const visionPrompt = `Target Space: ${roomType || 'Space'}. Desired Architectural Style: ${designPrompt}. ` +
          `Atmosphere: ${lightingDirective}. Additional Context: ${roomDescription || 'None'}. ` +
          `Transform this space into the target style. Output a detailed 2 to 3 sentence prompt for an image generator. Do not include markdown, bullet points, or meta commentary.`;

        const visionResponse = await googleGenAIClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            {
              inlineData: {
                mimeType: file.mimetype || 'image/jpeg',
                data: file.buffer.toString('base64')
              }
            },
            {
              text: `${roleInstruction}\n\n${visionPrompt}`
            }
          ]
        });

        const enhancedText = visionResponse.text?.trim();
        if (enhancedText) {
          finalPrompt = enhancedText;
          console.log(`✨ Gemini Vision synthesized custom architectural blueprint: "${finalPrompt.slice(0, 100)}..."`);
        }
      } catch (geminiErr) {
        console.error('Gemini vision blueprint synthesis failed, using fallback:', geminiErr.message);
      }
    }

    // STEP 2: HIGH-FIDELITY IMAGE GENERATION VIA GEMINI 3.1 FLASH IMAGE
    let generatedImageBase64 = null;
    let engineUsed = "none";

    if (geminiApiKey) {
      try {
        console.log(`⚡ Generating high-fidelity transformation via gemini-3.1-flash-image [${category}]...`);

        // Construct master conditioning directive incorporating the synthesized blueprint
        const masterDirective = 
          `Transform and completely redesign this ${category === 'exterior' ? 'house exterior' : category === 'landscape' ? 'outdoor landscape' : category === 'commercial' ? 'commercial space' : 'room'} ` +
          `according to this architectural design blueprint:\n${finalPrompt}\n\n` +
          `CRITICAL STRUCTURAL PRESERVATION RULES:\n` +
          `1. Maintain the exact camera angle, perspective vanishing lines, and viewing elevation of the original photo.\n` +
          `2. Strictly preserve the original structural boundaries: do not change wall positions, window placements, doors, or rooflines.\n` +
          `3. Render in hyper-realistic architectural photography quality, 8k resolution, Hasselblad H6D-100c, f/8, natural material textures, correct physics, zero distortion.\n` +
          `AVOID: ${NEGATIVE_PROMPT}`;

        const response = await googleGenAIClient.models.generateContent({
          model: 'gemini-3.1-flash-image',
          contents: [
            {
              inlineData: {
                mimeType: file.mimetype || 'image/jpeg',
                data: file.buffer.toString('base64')
              }
            },
            {
              text: masterDirective
            }
          ]
        });

        const parts = response?.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData && part.inlineData.data) {
            const mime = part.inlineData.mimeType || 'image/jpeg';
            generatedImageBase64 = `data:${mime};base64,${part.inlineData.data}`;
            engineUsed = "google-gemini-image";
            console.log('✅ Google Gemini Image AI successfully generated high-fidelity transformation!');
            break;
          }
        }
      } catch (geminiGenErr) {
        console.error('❌ Google Gemini Image generation error:', geminiGenErr.message || geminiGenErr);
      }
    }

    if (generatedImageBase64) {
      console.log(`Deducting ${cost} credits for User ID: ${req.user.id}`);
      const { data: deductResult, error: deductError } = await userSupabase.rpc('secure_deduct_credits', {
        cost_amount: cost
      });

      if (deductError) {
        console.error('Database credit deduction failed:', deductError);
        return res.status(402).json({ error: 'Failed to deduct credits. Generation cancelled.' });
      }
    } else {
      return res.status(500).json({ error: 'Generation failed. No credits were deducted.' });
    }

    // STEP 3: CLOUD-SIDE COMPOSITE & WATERMARK
    let outputWatermarkedString = generatedImageBase64;
    let outputCleanString = generatedImageBase64;
    let cloudProcessedWatermarkedBuffer = null;

    try {
      const cleanRawBuffer = Buffer.from(generatedImageBase64.replace(/^data:image\/\w+;base64,/, ""), 'base64');
      const imageMetadata = await sharp(cleanRawBuffer).metadata();
      const canvasWidth = imageMetadata.width || 1024;
      const canvasHeight = imageMetadata.height || 1024;
      
      const footerStripHeight = Math.round(canvasWidth * 0.08); 
      const fontPixelSize = Math.round(footerStripHeight * 0.35);

      const brandBannerSvg = `
        <svg width="${canvasWidth}" height="${footerStripHeight}" viewBox="0 0 ${canvasWidth} ${footerStripHeight}" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#0F172A"/>
          <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="600" font-size="${fontPixelSize}px" fill="#94A3B8">
            Transform your room at aihomedecorator.com (Get the app!)
          </text>
        </svg>
      `;

      cloudProcessedWatermarkedBuffer = await sharp({
        create: {
          width: canvasWidth,
          height: canvasHeight + footerStripHeight,
          channels: 4,
          background: { r: 15, g: 23, b: 42, alpha: 1 }
        }
      })
      .composite([
        { input: cleanRawBuffer, top: 0, left: 0 },
        { input: Buffer.from(brandBannerSvg), top: canvasHeight, left: 0 }
      ])
      .jpeg({ quality: 90 })
      .toBuffer();

      outputWatermarkedString = `data:image/jpeg;base64,${cloudProcessedWatermarkedBuffer.toString('base64')}`;
      outputCleanString = `data:image/jpeg;base64,${cleanRawBuffer.toString('base64')}`;

    } catch (sharpError) {
      console.error('Sharp composition failed:', sharpError.message);
    }

    // STEP 4: GENERATE VIRAL VIDEO & DELIVER PAYLOADS
    let viralVideoBase64 = null;
    const shouldGenerateVideo = req.body.generateVideo === 'true' || req.query.video === 'true';

    if (shouldGenerateVideo) {
      try {
        console.log('Generating viral transition video...');
        
        // We use the watermarked buffer for the video so the brand travels with it
        const videoBufferTarget = cloudProcessedWatermarkedBuffer || Buffer.from(generatedImageBase64.replace(/^data:image\/\w+;base64,/, ""), 'base64');

        // Get target dimensions for matching resolutions in the transition video
        const targetMetadata = await sharp(videoBufferTarget).metadata();

        // Convert source upload to standard jpeg buffer and resize to target dimensions for FFmpeg compatibility
        const sourceJpegBuffer = await sharp(file.buffer)
          .resize(targetMetadata.width, targetMetadata.height, { fit: 'fill' })
          .jpeg()
          .toBuffer();

        viralVideoBase64 = await createMorphVideo(sourceJpegBuffer, videoBufferTarget);
      } catch (videoErr) {
        console.warn('Video rendering skipped or failed:', videoErr.message);
      }
    } else {
      console.log('Skipping viral video generation (not requested by client).');
    }

    console.log('Dispensing complete asset payload.');
    return res.status(200).json({
      generatedImage: outputWatermarkedString,
      hdCleanImage: outputCleanString,         
      viralVideo: viralVideoBase64             
    });

  } catch (error) {
    console.error('Critical backend error:', error);
    res.status(500).json({ error: 'Failed to process image requests', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Backend production server running on port ${port}`);
});