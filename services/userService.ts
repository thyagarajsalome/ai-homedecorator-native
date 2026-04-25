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

export const saveUserDesign = async (designData: any) => {
  const { data, error } = await supabase.from("user_designs").insert(designData);
  if (error) throw error;
  return data;
};