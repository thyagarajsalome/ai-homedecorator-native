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

    // STEP 1: GEMINI PROMPT ENHANCEMENT
    let finalPrompt = `A professionally designed ${roomType || 'room'} matching a ${designPrompt} style, interior architecture visualization, highly detailed, 8k resolution, photorealistic interior design photography`;

    if (USE_GEMINI_ENHANCEMENT && geminiApiKey) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const enhancementSystemInstruction = 
          `You are an elite interior designer. Expand the user's design request into a detailed, descriptive prompt for an image generator. ` +
          `Incorporate complementary color schemes, high-end furniture items, realistic illumination rendering techniques, and spatial material rules. ` +
          `Keep your output description crisp and precise under 150 words. Do not include introductory remarks or meta commentary.`;

        const analyticalPrompt = `Room Type: ${roomType || 'Room'}. Target Structural Style: ${designPrompt}. Context Details: ${roomDescription || 'None'}.`;

        const geminiResult = await model.generateContent([
          { text: enhancementSystemInstruction },
          { text: analyticalPrompt }
        ]);

        const enhancedText = geminiResult.response.text().trim();
        if (enhancedText) finalPrompt = enhancedText;
      } catch (geminiErr) {
        console.error('Gemini enhancement failed, bypassing to default:', geminiErr.message);
      }
    }

    // STEP 2: IMAGE GENERATION (GOOGLE GEMINI MULTIMODAL IMAGE AI)
    let generatedImageBase64 = null;
    let engineUsed = "none";

    if (geminiApiKey) {
      try {
        console.log('⚡ Generating room transformation via Google Gemini Image AI (gemini-3.1-flash-image)...');
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
              text: `Transform and redesign this ${roomType || 'room'} in a ${designPrompt} style. Maintain the architectural layout, walls, windows, and perspective while completely upgrading the interior decor, flooring, furniture, textures, and lighting with high-end photorealistic 8k quality.`
            }
          ]
        });

        const parts = response?.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData && part.inlineData.data) {
            const mime = part.inlineData.mimeType || 'image/jpeg';
            generatedImageBase64 = `data:${mime};base64,${part.inlineData.data}`;
            engineUsed = "google-gemini-image";
            console.log('✅ Google Gemini Image AI successfully generated room transformation!');
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