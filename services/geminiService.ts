import { supabase } from "../lib/supabase";
import { BACKEND_URL } from "@env"; 

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

    // 2. Create FormData for file upload
    const formData = new FormData();

    // Append the image file
    // React Native expects an object with uri, name, and type for files
    formData.append("image", {
      uri: imageUri,
      name: "upload.jpg",
      type: "image/jpeg",
    } as any);

    // Append text fields
    formData.append("designPrompt", stylePrompt);
    formData.append("roomType", roomType || "Room");
    formData.append("designMode", "style");
    formData.append("roomDescription", roomType || "");

    // 3. Call Backend using the imported BACKEND_URL
    const response = await fetch(`${BACKEND_URL}/api/decorate`, {
      method: "POST",
      headers: {
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