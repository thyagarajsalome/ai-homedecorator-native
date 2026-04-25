// services/storageService.ts
import { supabase } from "../lib/supabase";
import * as ImageManipulator from 'expo-image-manipulator';

/**
 * Compresses an image to reduce storage usage while maintaining quality
 */
export const compressImage = async (uri: string) => {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 1024 } }], // Resize to a max width of 1024px
    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
  );
  return result.uri;
};

export const uploadGeneratedImage = async (
  imageUri: string, 
  userId: string
): Promise<string> => {
  try {
    // 1. Compress before upload
    const compressedUri = await compressImage(imageUri);
    
    const response = await fetch(compressedUri);
    const blob = await response.blob();

    // 2. Unique name for the generated result
    const fileName = `${userId}/gen_${Date.now()}.jpg`;

    // 3. Upload to Supabase
    const { error } = await supabase.storage
      .from('room_designs')
      .upload(fileName, blob, { contentType: 'image/jpeg' });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('room_designs')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (error) {
    console.error("Error uploading generated image:", error);
    throw new Error("Failed to upload image");
  }
};