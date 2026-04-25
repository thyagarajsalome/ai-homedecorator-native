// services/shareService.ts
import { Alert, Platform } from "react-native";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";

export const captureAndShareImage = async (viewRef: React.RefObject<any>) => {
  try {
    const uri = await captureRef(viewRef, {
      format: "jpg",
      quality: 0.9,
      result: "tmpfile",
    });

    if (!(await Sharing.isAvailableAsync())) {
      Alert.alert("Error", "Sharing is not available on this device");
      return null;
    }

    let correctUri = Platform.OS === "android" && !uri.startsWith("file://") 
      ? `file://${uri}` 
      : uri;

    await Sharing.shareAsync(correctUri, {
      mimeType: "image/jpeg",
      dialogTitle: "Share your dream room",
      UTI: "public.jpeg",
    });
    return uri;
  } catch (error: any) {
    Alert.alert("Sharing Error", error.message);
    return null;
  }
};