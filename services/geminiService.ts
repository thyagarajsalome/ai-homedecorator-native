// services/geminiService.ts
import { Platform } from "react-native";
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
    // On Web, we MUST use the native browser window.FormData if available.
    // However, React Native Web polyfills window.FormData globally with its own class.
    // To bypass this polyfill and use the clean native browser FormData (which correctly
    // serializes standard Blobs/Files in fetch requests), we extract it from a clean iframe.
    let FormDataConstructor = FormData;
    if (Platform.OS === "web" && typeof document !== "undefined") {
      try {
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        document.body.appendChild(iframe);
        const iframeFormData = (iframe.contentWindow as any)?.FormData;
        if (iframeFormData) {
          FormDataConstructor = iframeFormData as any;
        }
        document.body.removeChild(iframe);
      } catch (e) {
        console.error("Failed to extract native browser FormData from iframe:", e);
        if (typeof window !== "undefined" && (window as any).FormData) {
          FormDataConstructor = (window as any).FormData;
        }
      }
    }

    const formData = new FormDataConstructor();

    // Append the image file
    if (Platform.OS === "web") {
      let blob: Blob;
      if (imageUri.startsWith("data:")) {
        const parts = imageUri.split(",");
        const contentType = parts[0].split(":")[1].split(";")[0];
        const raw = window.atob(parts[1]);
        const rawLength = raw.length;
        const uInt8Array = new Uint8Array(rawLength);
        for (let i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
        }
        blob = new Blob([uInt8Array], { type: contentType });
      } else {
        const response = await fetch(imageUri);
        blob = await response.blob();
      }
      formData.append("image", blob, "upload.jpg");
    } else {
      // React Native expects an object with uri, name, and type for files
      formData.append("image", {
        uri: imageUri,
        name: "upload.jpg",
        type: "image/jpeg",
      } as any);
    }

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
