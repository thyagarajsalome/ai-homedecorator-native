// hooks/useHomeState.ts
import { useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserProfile, getUserDesigns, saveUserDesign } from "../services/userService";
import * as geminiService from "../services/geminiService";
import { Alert } from "react-native";

export const useHomeState = (navigation: any) => {
  const { session, logout } = useAuth();
  
  const [sourceImageUrl, setSourceImageUrl] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [credits, setCredits] = useState(0);
  const [history, setHistory] = useState<any[]>([]);

  const fetchUserData = useCallback(async () => {
    if (!session?.user) return;
    try {
      const profile = await getUserProfile(session.user.id);
      if (profile) setCredits(profile.generation_credits);

      const designs = await getUserDesigns(5);
      if (designs) setHistory(designs);
    } catch (err) {
      console.log("Error fetching user data:", err);
    }
  }, [session]);

  const handleDecorate = async (roomType: string, prompt: string, styleName: string, creditCost: number) => {
     // ... Move the logic from HomeScreen.handleDecorate here ...
     // It utilizes geminiService.decorateRoom and saveUserDesign
  };

  const resetState = () => {
    setSourceImageUrl(null);
    setGeneratedImageUrl(null);
  };

  return {
    state: { sourceImageUrl, generatedImageUrl, isLoading, credits, history },
    actions: { setSourceImageUrl, handleDecorate, resetState, fetchUserData, logout }
  };
};