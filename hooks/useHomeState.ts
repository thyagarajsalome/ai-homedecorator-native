// hooks/useHomeState.ts
import { useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext"; //
import { getUserProfile, getUserDesigns, saveUserDesign } from "../services/userService"; //
import * as geminiService from "../services/geminiService"; //
import { Alert } from "react-native";

export const useHomeState = (navigation: any) => {
  const { session, logout } = useAuth(); //
  
  const [sourceImageUrl, setSourceImageUrl] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [credits, setCredits] = useState(0);
  const [history, setHistory] = useState<any[]>([]);

  const fetchUserData = useCallback(async () => {
    if (!session?.user) return;
    try {
      const profile = await getUserProfile(session.user.id); //
      if (profile) setCredits(profile.generation_credits);

      const designs = await getUserDesigns(5); //
      if (designs) setHistory(designs);
    } catch (err) {
      console.log("Error fetching user data:", err);
    }
  }, [session]);

  const handleDecorate = async (roomType: string, prompt: string, styleName: string, creditCost: number) => {
    if (!session?.user || !sourceImageUrl) return;

    // 1. Credit Check: Ensure the user has enough credits to proceed
    if (credits < creditCost) {
      Alert.alert(
        "Insufficient Credits",
        "You do not have enough credits to generate a new design. Please purchase more.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Buy Credits", onPress: () => navigation.navigate("BuyCredits") }
        ]
      );
      return;
    }

    setIsLoading(true);
    try {
      // 2. Prepare the AI Prompt: Combine the selected style and user instructions
      const fullPrompt = `${styleName} style. ${prompt}`.trim();
      
      // 3. Generate Design: Call the backend service
      const resultImageUrl = await geminiService.decorateRoom(
        sourceImageUrl,
        fullPrompt,
        roomType
      );

      if (resultImageUrl) {
        setGeneratedImageUrl(resultImageUrl);
        
        // 4. Save to Database: The service also manages the 2-image history limit
        const designData = {
          user_id: session.user.id,
          source_url: sourceImageUrl,
          generated_url: resultImageUrl,
          room_type: roomType,
          design_style: styleName,
        };

        await saveUserDesign(designData, session.user.id); //
        
        // 5. Sync State: Refresh the UI with updated credits and history
        await fetchUserData();
      }
    } catch (err: any) {
      console.error("Decoration error:", err);
      Alert.alert("Generation Failed", err.message || "An error occurred while generating your design.");
    } finally {
      setIsLoading(false);
    }
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