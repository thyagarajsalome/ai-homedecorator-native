import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export const useCredits = () => {
  const { session } = useAuth();
  const [credits, setCredits] = useState<number>(0);

  const fetchCredits = useCallback(async () => {
    if (!session?.user) return;

    try {
      // Fetch current credits
      const { data, error } = await supabase
        .from("user_profiles")
        .select("generation_credits")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;

      if (data) {
        setCredits(data.generation_credits);
      }
    } catch (err) {
      console.log("Error fetching credits:", err);
    }
  }, [session]);

  const deductCredits = (amount: number) => {
    setCredits((prev) => Math.max(0, prev - amount));
  };

  return { credits, fetchCredits, deductCredits };
};