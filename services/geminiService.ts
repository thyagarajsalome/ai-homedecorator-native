// services/geminiService.ts
import { supabase } from "../lib/supabase";

// REPLACE THIS WITH YOUR ACTUAL DEPLOYED BACKEND URL (e.g. Cloud Run URL)
// Do not use 'localhost' here because your phone cannot see your computer's localhost.
// services/geminiService.ts

// ✅ CORRECT (Use YOUR specific URL)
const BACKEND_URL =
  "https://ai-decorator-backend-358218923651.asia-south1.run.app";

export const decorateRoom = async (
  imageUri: string,
  stylePrompt: string,
  roomType?: string
): Promise<string> => {
  try {
    // 1. Get the current User Token
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (!token) throw new Error("User not authenticated");

    // 2. Create FormData for file upload (Match Backend Expectation)
    const formData = new FormData();

    // Append the image file
    // React Native expects an object with uri, name, and type for files
    formData.append("image", {
      uri: imageUri,
      name: "upload.jpg",
      type: "image/jpeg",
    } as any);

    // Append text fields (Match keys expected by server.js)
    formData.append("designPrompt", stylePrompt);
    formData.append("roomType", roomType || "Room");
    // Native app currently only does 'style' mode based on your UI,
    // but we pass it to match backend logic.
    formData.append("designMode", "style");
    formData.append("roomDescription", roomType || "");

    // 3. Call Backend
    const response = await fetch(`${BACKEND_URL}/api/decorate`, {
      method: "POST",
      headers: {
        // Do NOT set Content-Type to multipart/form-data manually;
        // fetch handles the boundary automatically.
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Backend error: ${response.status}`);
    }

    const result = await response.json();

    // The backend returns { generatedImage: "data:image..." }
    return result.generatedImage;
  } catch (error) {
    console.error("Error in decorateRoom:", error);
    throw error;
  }
};
