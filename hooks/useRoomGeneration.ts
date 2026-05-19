import { useState } from 'react';
import { Alert } from 'react-native';
import * as geminiService from '../services/geminiService';
import { useAuth } from '../context/AuthContext';

export const useRoomGeneration = () => {
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  const generateDesign = async (imageUri: string, prompt: string, roomType: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await geminiService.decorateRoom(imageUri, prompt, roomType);
      setGeneratedImageUrl(result);
      return true;
    } catch (e: any) {
      const errorMessage = e.message || "An unknown error occurred.";
      
      // Handle Supabase/Backend token expiration gracefully
      if (
        errorMessage.includes("Invalid or expired token") ||
        errorMessage.includes("JWT")
      ) {
        Alert.alert("Session Expired", "Please log in again.", [
          { text: "Logout", onPress: logout },
        ]);
        setError("Session expired. Please login again.");
      } else {
        setError(errorMessage);
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetGeneration = () => {
    setGeneratedImageUrl(null);
    setError(null); // Clear errors when resetting the workspace
  };

  return { 
    generateDesign, 
    generatedImageUrl, 
    isLoading, 
    error, 
    resetGeneration 
  };
};