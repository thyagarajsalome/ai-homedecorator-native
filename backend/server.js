const express = require('express');
const cors = require('cors');
const multer = require('multer');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Set up Supabase Client for verifying tokens
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Set up Gemini API Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Set up Multer for handling multipart/form-data (image uploads)
const storage = multer.memoryStorage(); // Store uploaded image in memory buffer
const upload = multer({ storage: storage });

/**
 * Authentication Middleware
 * Verifies the JWT token sent from the React Native app
 */
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Missing Authorization header' });
  }

  // Verify the JWT token using Supabase
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }

  // Attach user to request
  req.user = user;
  next();
};

/**
 * Main API Route for Decorating Rooms
 */
app.post('/api/decorate', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Extract form data fields
    const { designPrompt, roomType, designMode, roomDescription } = req.body;
    const imageBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;

    console.log(`Processing decoration request for user: ${req.user.id}`);
    console.log(`Prompt: ${designPrompt}, Room: ${roomType}`);

    // =========================================================================
    // STEP 1: USE GEMINI TO ENHANCE THE PROMPT OR ANALYZE THE ROOM
    // =========================================================================
    /* 
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const imagePart = {
      inlineData: {
        data: imageBuffer.toString("base64"),
        mimeType: mimeType
      }
    };
    const result = await model.generateContent([
      `Analyze this room and improve this interior design prompt: ${designPrompt}`, 
      imagePart
    ]);
    const enhancedPrompt = result.response.text();
    */

    // =========================================================================
    // STEP 2: GENERATE THE NEW IMAGE (e.g., using Replicate, Vertex Imagen, ImageKit)
    // =========================================================================
    // Note: Gemini itself does not output image files. If your previous server 
    // generated a totally new room design image, it likely passed the Gemini-enhanced 
    // prompt to a Stable Diffusion model or ImageKit API.
    
    // For now, we will return the original image back as base64 so the app doesn't crash,
    // simulating a successful generation. You can paste your specific image generation API here.
    const generatedImageBase64 = `data:${mimeType};base64,${imageBuffer.toString('base64')}`;

    // =========================================================================
    // STEP 3: RETURN THE IMAGE TO THE APP
    // =========================================================================
    res.status(200).json({
      generatedImage: generatedImageBase64,
      message: "Room decorated successfully"
    });

  } catch (error) {
    console.error('Error decorating room:', error);
    res.status(500).json({ error: 'Failed to process image', details: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server is running on port ${port}`);
});
