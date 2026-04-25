// services/userService.ts
import { supabase } from "../lib/supabase";

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("generation_credits")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data;
};

export const getUserDesigns = async (limit: number = 5) => {
  const { data, error } = await supabase
    .from("user_designs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
};

export const saveUserDesign = async (designData: any, userId: string) => {
  // 1. Fetch current designs to check the limit
  const { data: existingDesigns } = await supabase
    .from("user_designs")
    .select("id, generated_url")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  // 2. If user has 2 or more designs, delete the oldest one
  if (existingDesigns && existingDesigns.length >= 2) {
    const oldest = existingDesigns[0];
    
    // Delete from Database
    await supabase.from("user_designs").delete().eq("id", oldest.id);

    // Delete from Storage (Extract filename from URL)
    const filePath = oldest.generated_url.split('room_designs/')[1];
    if (filePath) {
      await supabase.storage.from('room_designs').remove([filePath]);
    }
  }

  // 3. Save the new design
  const { data, error } = await supabase.from("user_designs").insert(designData);
  if (error) throw error;
  return data;
};