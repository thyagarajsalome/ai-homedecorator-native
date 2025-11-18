import * as FileSystem from "expo-file-system";
import { supabase } from "../lib/supabase"; // We need this to get the JWT token

// Your Cloud Run URL
const BACKEND_URL = "https://your-cloud-run-service-xyz.a.run.app";

export const decorateRoom = async (
  imageUri: string,
  stylePrompt: string,
  roomType?: string
): Promise<string> => {
  try {
    // 1. Get the current User Token to authorize with your Backend
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (!token) throw new Error("User not authenticated");

    // 2. Read file as Base64
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // 3. Call your Cloud Run Backend
    const response = await fetch(`${BACKEND_URL}/api/decorate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Send token for verification
      },
      body: JSON.stringify({
        image: `data:image/jpeg;base64,${base64}`, // Send standard data URI
        prompt: stylePrompt,
        roomType: roomType,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Backend processing failed");
    }

    const result = await response.json();

    // Assuming your backend returns { generatedImage: "base64..." }
    return result.generatedImage;
  } catch (error) {
    console.error("Error in decorateRoom:", error);
    throw error;
  }
};
