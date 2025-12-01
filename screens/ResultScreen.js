import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Alert,
} from "react-native";
import ViewShot, { captureRef } from "react-native-view-shot";
import Share from "react-native-share";

// ... your other imports

const ResultScreen = ({ route, navigation }) => {
  // Assuming you get the AI image URI from route params or redux
  // const { generatedImageUri } = route.params;
  // For testing, I'll use a placeholder. Replace this with your actual variable.
  const generatedImageUri =
    "https://via.placeholder.com/600x800.png?text=AI+Decorated+Image";

  const viewShotRef = useRef(null);
  const [finalLocalImageUri, setFinalLocalImageUri] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- THE WATERMARK & CAPTURE LOGIC ---
  const generateWatermarkedImage = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // captureRef takes a snapshot of the View defined below with ref={viewShotRef}
      const uri = await captureRef(viewShotRef, {
        format: "jpg",
        quality: 0.9,
        result: "tmpfile", // Crucial: saves to a temporary local file
      });

      console.log("Watermarked image saved to:", uri);
      setFinalLocalImageUri(uri);

      // Once captured, immediately trigger sharing
      await shareFinalImage(uri);
    } catch (error) {
      console.error("Capture failed:", error);
      Alert.alert("Error", "Failed to prepare image for sharing.");
    } finally {
      setIsProcessing(false);
    }
  };

  // --- THE SHARING LOGIC (Fixes WhatsApp issue) ---
  const shareFinalImage = async (uriToShare) => {
    if (!uriToShare) {
      Alert.alert("Error", "No image to share.");
      return;
    }

    // Ensure the URI has the file:// prefix for Android if it's missing
    let correctUri = uriToShare;
    if (Platform.OS === "android" && !correctUri.startsWith("file://")) {
      correctUri = `file://${correctUri}`;
    }

    const shareOptions = {
      title: "Share AI Decor",
      message: "Check out my home decorated by AI Home Decorator!", // Optional message
      url: correctUri, // Sharing the LOCAL file URI works with WhatsApp
      type: "image/jpeg",
      failOnCancel: false,
    };

    try {
      await Share.open(shareOptions);
    } catch (error) {
      if (error.message !== "User did not share") {
        console.log("Share error:", error);
        Alert.alert("Sharing Failed", "Could not open share dialog.");
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* This ViewShot container is what gets captured.
          We set collapsable={false} to ensure Android captures it correctly.
          We use a white background so the watermark looks clean.
       */}
      <ViewShot
        ref={viewShotRef}
        options={{ format: "jpg", quality: 0.9 }}
        style={styles.captureContainer}
        collapsable={false}
      >
        {/* The AI Generated Image */}
        <Image
          source={{ uri: generatedImageUri }}
          style={styles.resultImage}
          resizeMode="contain" // or "cover", depending on your layout desires
        />

        {/* THE FOOTER WATERMARK */}
        <View style={styles.watermarkContainer}>
          <Text style={styles.watermarkText}>
            This image is decorated by Ai Home Decorator (aihomedecorator.com)
          </Text>
        </View>
      </ViewShot>

      {/* The Share Button */}
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
  // The container that gets screenshotted
  captureContainer: {
    backgroundColor: "white",
    padding: 10, // Add padding so the image and text aren't right against the edge
    elevation: 5, // Optional shadow for looks
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  resultImage: {
    width: "100%",
    height: 400, // Adjust height as needed for your design
    marginBottom: 10,
  },
  // Watermark Styling
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
