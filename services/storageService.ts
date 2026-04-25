// services/storageService.ts
import { supabase } from "../lib/supabase";

export const uploadImageToStorage = async (
  imageUri: string, 
  userId: string, 
  type: 'original' | 'generated'
): Promise<string> => {
  try {
    // 1. Fetch the local file or Base64 string and convert it to a Blob
    const response = await fetch(imageUri);
    const blob = await response.blob();

    // 2. Generate a unique, organized file name
    const fileName = `${userId}/${type}_${Date.now()}.jpg`;

    // 3. Upload to your Supabase bucket
    const { error } = await supabase.storage
      .from('room_designs')
      .upload(fileName, blob, {
        contentType: 'image/jpeg',
      });

    if (error) throw error;

    // 4. Retrieve and return the permanent public URL
    const { data: urlData } = supabase.storage
      .from('room_designs')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (error) {
    console.error(`Error uploading ${type} image:`, error);
    throw new Error("Failed to upload image to storage");
  }
};