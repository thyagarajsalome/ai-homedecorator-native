// services/geminiService.ts
import { supabase } from "../lib/supabase";

// REPLACE THIS WITH YOUR ACTUAL DEPLOYED BACKEND URL (e.g. Cloud Run URL)
// Do not use 'localhost' here because your phone cannot see your computer's localhost.

// ✅ CORRECT (Use YOUR specific URL)
const BACKEND_URL =
  "https://ai-decorator-backend-358218923651.us-central1.run.app";

export interface DecorateRoomResponse {
  generatedImage: string;
  hdCleanImage: string;
  viralVideo: string | null;
}

export const decorateRoom = async (
  imageUri: string,
  stylePrompt: string,
  roomType?: string
): Promise<DecorateRoomResponse> => {
  try {
    // 1. Get/Refresh user session
    let {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      const now = Math.floor(Date.now() / 1000);
      // If token is expired or close to expiring (within 5 minutes / 300 seconds), refresh it
      if (session.expires_at && session.expires_at < now + 300) {
        try {
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
          if (refreshError) throw refreshError;
          if (refreshData.session) {
            session = refreshData.session;
          }
        } catch (refreshErr) {
          console.error("Failed to auto-refresh session, proceeding with existing:", refreshErr);
        }
      }
    }

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

    // The backend returns { generatedImage: "data:image...", hdCleanImage: "data:image...", viralVideo: "data:video..." }
    return result;
  } catch (error) {
    console.error("Error in decorateRoom:", error);
    throw error;
  }
};
