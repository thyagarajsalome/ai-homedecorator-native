import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export const useCredits = () => {
  const { session } = useAuth();
  const [credits, setCredits] = useState<number>(0);

  const fetchCredits = useCallback(async () => {
    if (!session?.user) return;

    try {
      // 1. Fetch current credits first to populate the UI instantly
      const { data: initialData, error: fetchError } = await supabase
        .from("user_profiles")
        .select("generation_credits")
        .eq("id", session.user.id)
        .single();

      if (fetchError) throw fetchError;

      if (initialData) {
        setCredits(initialData.generation_credits);
      }

      // 2. Call the secure server-side function to check and claim daily rewards
      const { data: rewardData, error: rpcError } = await supabase.rpc('claim_daily_login');
      
      if (rpcError) throw rpcError;

      // 3. If they were rewarded, update the UI and show the alert
      if (rewardData && rewardData.rewarded) {
        setCredits(rewardData.current_credits);
        Alert.alert(
          "Daily Reward! 🎁", 
          `You received 1 free credit for visiting today! Current Streak: ${rewardData.streak} 🔥`
        );
      }
    } catch (err) {
      console.log("Error fetching or claiming credits:", err);
    }
  }, [session]);

  const deductCredits = (amount: number) => {
    setCredits((prev) => Math.max(0, prev - amount));
  };

  return { credits, fetchCredits, deductCredits };
};