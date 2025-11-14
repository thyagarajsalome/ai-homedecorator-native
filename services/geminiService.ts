import { GoogleGenAI, Modality } from "@google/genai";
// --- FIX: Import from legacy API ---
import * as FileSystem from "expo-file-system/legacy";
import { GEMINI_API_KEY } from "@env";

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY as string });

export const fileToBase64 = async (
  fileUri: string
): Promise<{ mimeType: string; data: string }> => {
  try {
    console.log("Reading file from URI:", fileUri);

    // Now using the legacy API, EncodingType should be available
    const data = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    console.log("Successfully read file, data length:", data.length);

    // Infer MIME type from extension
    const extension = fileUri.split(".").pop()?.toLowerCase();
    let mimeType = "image/jpeg"; // default
    if (extension === "png") {
      mimeType = "image/png";
    }

    return { mimeType, data };
  } catch (error) {
    console.error("=== ERROR IN fileToBase64 ===");
    console.error("Error details:", error);
    console.error("Error message:", (error as Error).message);
    console.error("Error stack:", (error as Error).stack);
    throw new Error(
      "Failed to process image file: " + (error as Error).message
    );
  }
};

const getBase64FromResponse = (response: any): string | null => {
  const part = response?.candidates?.[0]?.content?.parts?.[0];
  if (part?.inlineData?.data) {
    return part.inlineData.data;
  }
  return null;
};

export const decorateRoom = async (
  imageUri: string,
  stylePrompt: string,
  roomType?: string
): Promise<string> => {
  try {
    console.log("Starting decoration process...");
    console.log("Image URI:", imageUri);
    console.log("Style prompt:", stylePrompt);
    console.log("Room type:", roomType);

    const { mimeType, data } = await fileToBase64(imageUri);

    console.log("Image converted to base64, mimeType:", mimeType);
    console.log("Base64 data length:", data.length);

    const fullPrompt = `Redecorate this ${
      roomType ? roomType.toLowerCase() : "room"
    } in ${stylePrompt}. Maintain the original room structure and layout but change the furniture, wall color, and decorations to match the new style.`;

    console.log("Sending request to Gemini API...");
    console.log("Full prompt:", fullPrompt);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [{ inlineData: { data, mimeType } }, { text: fullPrompt }],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    console.log("Received response from Gemini API");

    const base64Image = getBase64FromResponse(response);
    if (!base64Image) {
      console.error("No image data in response");
      throw new Error("API did not return an image.");
    }

    console.log("Successfully extracted image from response");
    return `data:image/jpeg;base64,${base64Image}`;
  } catch (error) {
    console.error("=== ERROR IN decorateRoom ===");
    console.error("Error details:", error);
    console.error("Error message:", (error as Error).message);
    throw new Error("Failed to decorate the room: " + (error as Error).message);
  }
};
