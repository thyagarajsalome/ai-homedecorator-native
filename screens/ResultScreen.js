import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import ViewShot, { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing"; // <--- 1. CHANGED IMPORT

const ResultScreen = ({ route, navigation }) => {
  // Replace with actual prop/param logic if needed
  const generatedImageUri =
    "https://via.placeholder.com/600x800.png?text=AI+Decorated+Image";

  const viewShotRef = useRef(null);
  const [finalLocalImageUri, setFinalLocalImageUri] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const generateWatermarkedImage = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const uri = await captureRef(viewShotRef, {
        format: "jpg",
        quality: 0.9,
        result: "tmpfile",
      });

      console.log("Watermarked image saved to:", uri);
      setFinalLocalImageUri(uri);
      await shareFinalImage(uri);
    } catch (error) {
      console.error("Capture failed:", error);
      Alert.alert("Error", "Failed to prepare image for sharing.");
    } finally {
      setIsProcessing(false);
    }
  };

  // --- 2. UPDATED SHARING LOGIC ---
  const shareFinalImage = async (uriToShare) => {
    if (!uriToShare) {
      Alert.alert("Error", "No image to share.");
      return;
    }

    // Check if sharing is available on this device
    if (!(await Sharing.isAvailableAsync())) {
      Alert.alert("Error", "Sharing is not available on this device");
      return;
    }

    try {
      // Expo Sharing handles the file:// prefix automatically in most cases,
      // but ensuring it's there for Android doesn't hurt.
      let correctUri = uriToShare;
      if (Platform.OS === "android" && !correctUri.startsWith("file://")) {
        correctUri = `file://${correctUri}`;
      }

      await Sharing.shareAsync(correctUri, {
        mimeType: "image/jpeg",
        dialogTitle: "Share AI Decor",
        UTI: "public.jpeg", // Helps on iOS
      });
    } catch (error) {
      console.log("Share error:", error);
      // Expo sharing usually doesn't throw on cancel, but just in case
      Alert.alert("Sharing Failed", "Could not open share dialog.");
    }
  };

  return (
    <View style={styles.container}>
      <ViewShot
        ref={viewShotRef}
        options={{ format: "jpg", quality: 0.9 }}
        style={styles.captureContainer}
        collapsable={false}
      >
        <Image
          source={{ uri: generatedImageUri }}
          style={styles.resultImage}
          resizeMode="contain"
        />

        <View style={styles.watermarkContainer}>
          <Text style={styles.watermarkText}>
            This image is decorated by Ai Home Decorator (aihomedecorator.com)
          </Text>
        </View>
      </ViewShot>

      <TouchableOpacity
        style={[styles.shareButton, isProcessing && styles.disabledButton]}
        onPress={generateWatermarkedImage}
        disabled={isProcessing}
      >
        <Text style={styles.shareButtonText}>
          {isProcessing ? "Preparing..." : "Share Image"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  captureContainer: {
    backgroundColor: "white",
    padding: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  resultImage: {
    width: "100%",
    height: 400,
    marginBottom: 10,
  },
  watermarkContainer: {
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    width: "100%",
    alignItems: "center",
  },
  watermarkText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
  },
  shareButton: {
    marginTop: 30,
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  disabledButton: {
    backgroundColor: "#a0a0a0",
  },
  shareButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ResultScreen;
