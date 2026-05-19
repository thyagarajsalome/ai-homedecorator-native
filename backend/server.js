const express = require('express');
const cors = require('cors');
const multer = require('multer');
const dotenv = require('dotenv');
const Replicate = require('replicate');
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const sharp = require('sharp'); // Added for cloud-side image composites

// Load environment variables
dotenv.config();

// ============================================
// CONFIGURATION
// ============================================
const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
const IMAGE_MODEL = process.env.IMAGE_MODEL || 'black-forest-labs/flux-schnell';
const USE_GEMINI_ENHANCEMENT = process.env.USE_GEMINI_ENHANCEMENT !== 'false'; // default: true

// Negative prompt for interior designs to avoid odd artifacts
const NEGATIVE_PROMPT = 'blurry, distorted, deformed, ugly, bad anatomy, bad proportions, extra limbs, ' +
  'missing limbs, fused fingers, watermark, text, signature, low quality, duplicate, mutated, ' +
  'disfigured, poorly drawn, poorly rendered, noisy, grainy, oversaturated, cluttered, messy, ' +
  'unrealistic furniture, floating objects, broken walls, collapsing ceiling';

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Set up Supabase Client for verifying tokens
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Set up Gemini Client for Prompt Enhancement
const geminiApiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(geminiApiKey);

// Configure Multer for processing multipart form data (In-memory storage)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB Limit
});

// Middleware to verify Supabase User Auth Token
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

    req.user = user; // Attach user payload to the request context
    next();
  } catch (err) {
    console.error('Token verification structural exception:', err);
    return res.status(401).json({ error: 'Authentication processing failed' });
  }
};

// Simple Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Fallback image generator (returns transparent placeholder fallback image)
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
// MAIN GENERATION CONTROLLER ROUTE
// ============================================
app.post('/api/decorate', verifySupabaseToken, upload.single('image'), async (req, res) => {
  try {
    const { designPrompt, roomType, designMode, roomDescription } = req.body;
    const file = req.file;

    if (!designPrompt) {
      return res.status(400).json({ error: 'Missing designPrompt parameter' });
    }
    if (!file) {
      return res.status(400).json({ error: 'Missing uploaded room image snapshot file' });
    }

    console.log(`Processing room design: Type [${roomType || 'Unknown'}], Mode [${designMode || 'style'}] for User ID: ${req.user.id}`);

    // Convert uploaded source file buffer to base64 format for Replicate structural layout consumption
    const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

    // ==========================================================
    // STEP 1: OPTIONAL GEMINI ENHANCEMENT PROMPT INFERENCE
    // ==========================================================
    let finalPrompt = `A professionally designed ${roomType || 'room'} matching a ${designPrompt} style, interior architecture visualization, highly detailed, 8k resolution, photorealistic interior design photography`;

    if (USE_GEMINI_ENHANCEMENT && geminiApiKey) {
      try {
        console.log('Orchestrating Gemini prompt expansion optimization sequence...');
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const enhancementSystemInstruction = 
          `You are an elite interior designer. Expand the user's design request into a detailed, descriptive prompt for an image generator (like Stable Diffusion/Flux). ` +
          `Incorporate complementary color schemes, high-end furniture items, realistic illumination rendering techniques, and spatial material rules. ` +
          `Keep your output description crisp and precise under 150 words. Do not include introductory remarks or meta commentary.`;

        const analyticalPrompt = `Room Type: ${roomType || 'Room'}. Target Structural Style: ${designPrompt}. Context Details: ${roomDescription || 'None'}.`;

        const geminiResult = await model.generateContent([
          { text: enhancementSystemInstruction },
          { text: analyticalPrompt }
        ]);

        const enhancedText = geminiResult.response.text().trim();
        if (enhancedText) {
          finalPrompt = enhancedText;
          console.log('Gemini Prompt successfully formulated:', finalPrompt);
        }
      } catch (geminiErr) {
        console.error('Gemini prompt enhancement exception encountered, bypassing to structural default:', geminiErr.message);
      }
    }

    // ==========================================================
    // STEP 2: EXECUTE REPLICATE GENERATION SCHEME
    // ==========================================================
    let generatedImageBase64 = null;

    if (REPLICATE_API_TOKEN) {
      try {
        const replicate = new Replicate({ auth: REPLICATE_API_TOKEN });

        console.log(`Calling Replicate deployment using target generation model: ${IMAGE_MODEL}`);
        
        // Dynamic payload input configurations optimized for stable interior structures
        const inputOptions = {
          prompt: finalPrompt,
          image: base64Image,
          negative_prompt: NEGATIVE_PROMPT,
          guidance_scale: 3.5,
          prompt_strength: 0.8, // Retains structural layout properties of the original empty space boundary
          num_inference_steps: 28,
          output_format: "webp"
        };

        const output = await replicate.run(IMAGE_MODEL, { input: inputOptions });

        if (output && Array.isArray(output) && output[0]) {
          const imageUrl = output[0];
          console.log('Downloading raw structural asset from Replicate storage nodes...');
          const imageResponse = await fetch(imageUrl);
          const arrayBuffer = await imageResponse.arrayBuffer();
          generatedImageBase64 = `data:image/webp;base64,${Buffer.from(arrayBuffer).toString('base64')}`;
        } else if (output && typeof output === 'string') {
          console.log('Downloading structural asset stream directly via url sequence context...');
          const imageResponse = await fetch(output);
          const arrayBuffer = await imageResponse.arrayBuffer();
          generatedImageBase64 = `data:image/webp;base64,${Buffer.from(arrayBuffer).toString('base64')}`;
        }
      } catch (replicateErr) {
        console.error('Replicate generation processing exception encountered:', replicateErr.message);
      }
    } else {
      console.warn('REPLICATE_API_TOKEN missing within environmental initialization routines. Skipping process execution blocks.');
    }

    // Fallback if generational processes failed
    if (!generatedImageBase64) {
      console.warn('Returning placeholder asset configuration layout metrics.');
      generatedImageBase64 = getFallbackImage(
        'Please configure REPLICATE_API_TOKEN in your backend environment variables'
      );
    }

    // ==========================================================
    // STEP 3: CLOUD-SIDE COMPOSITE & WATERMARK INJECTION
    // ==========================================================
    try {
      console.log('Executing automated sharp cloud composition watermark routine...');
      
      // Isolate clean stream strings into buffer structures
      const cleanRawBuffer = Buffer.from(generatedImageBase64.replace(/^data:image\/\w+;base64,/, ""), 'base64');
      
      // Extract structural asset metadata attributes
      const imageMetadata = await sharp(cleanRawBuffer).metadata();
      const canvasWidth = imageMetadata.width || 1024;
      const canvasHeight = imageMetadata.height || 1024;
      
      // Calculate responsive layout variables (Banner matches 8% of width space)
      const footerStripHeight = Math.round(canvasWidth * 0.08); 
      const fontPixelSize = Math.round(footerStripHeight * 0.35);

      // Create beautiful vector SVG banner template matching app theme profiles
      const brandBannerSvg = `
        <svg width="${canvasWidth}" height="${footerStripHeight}" viewBox="0 0 ${canvasWidth} ${footerStripHeight}" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#0F172A"/>
          <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="600" font-size="${fontPixelSize}px" fill="#94A3B8">
            Transform your room at aihomedecorator.com (Get the app!)
          </text>
        </svg>
      `;

      // Build consolidated final display canvas container
      const cloudProcessedWatermarkedBuffer = await sharp({
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

      // Convert buffers safely to distinct clean string entities
      const outputWatermarkedString = `data:image/jpeg;base64,${cloudProcessedWatermarkedBuffer.toString('base64')}`;
      const outputCleanString = `data:image/jpeg;base64,${cleanRawBuffer.toString('base64')}`;

      // ==========================================================
      // STEP 4: DELIVER PROTECTED PAYLOAD DATA SETS TO THE APP
      // ==========================================================
      console.log('Composition pipeline executed successfully. Dispensing protected payloads.');
      return res.status(200).json({
        generatedImage: outputWatermarkedString, // Watermarked version shown by default
        hdCleanImage: outputCleanString          // High-Res premium unlock asset file
      });

    } catch (sharpProcessingError) {
      console.error('Sharp graphic composition execution failed. Reverting response context to standard values:', sharpProcessingError.message);
      
      // Resilient fallback mechanism provides uninterrupted generation delivery if sharp module fails
      return res.status(200).json({
        generatedImage: generatedImageBase64,
        hdCleanImage: generatedImageBase64
      });
    }

  } catch (error) {
    console.error('Critical transactional breakdown inside decoration routing framework:', error);
    res.status(500).json({ error: 'Failed to process image generation pipeline requests', details: error.message });
  }
});

// Start the server instances
app.listen(port, () => {
  console.log(`Backend production server running cleanly on port ${port}`);
  console.log(`IMAGE_MODEL Core Target Definition: ${IMAGE_MODEL}`);
  console.log(`USE_GEMINI_ENHANCEMENT Status: ${USE_GEMINI_ENHANCEMENT}`);
  console.log(`REPLICATE_API_TOKEN Security Configuration Status: ${REPLICATE_API_TOKEN ? 'CONNECTED / ACTIVE' : 'MISSING'}`);
});