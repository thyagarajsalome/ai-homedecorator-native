import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { Camera } from "expo-camera";
import * as Haptics from "expo-haptics";

import { CameraModal } from "../CameraModal";
import { UploadIcon, CameraIcon } from "../Icons";
import { Colors, Spacing, BorderRadius, Typography } from "../../theme/designTokens";

interface ImageUploaderProps {
  onImageSelected: (uri: string) => void;
}

// Compress image before processing: reduces upload size ~60-70%
// which directly speeds up AI generation time.
const compressImage = async (uri: string): Promise<string> => {
  try {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1024 } }],
      { compress: 0.75, format: ImageManipulator.SaveFormat.JPEG }
    );
    return result.uri;
  } catch {
    // Fallback to original if compression fails
    return uri;
  }
};

const ImageUploader: React.FC<ImageUploaderProps> = React.memo(({ onImageSelected }) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const openImageGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Needed",
        "We need access to your photos to continue. Please enable it in Settings.",
        [{ text: "OK" }]
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1, // Keep original quality; we compress below
    });

    if (!result.canceled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const compressedUri = await compressImage(result.assets[0].uri);
      onImageSelected(compressedUri);
    }
  };

  const openCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Needed",
        "We need access to your camera. Please enable it in Settings.",
        [{ text: "OK" }]
      );
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsCameraOpen(true);
  };

  const handlePictureTaken = async (uri: string) => {
    setIsCameraOpen(false);
    const compressedUri = await compressImage(uri);
    onImageSelected(compressedUri);
  };

  return (
    <View style={styles.uploadCard}>
      <CameraModal
        isVisible={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onPictureTaken={handlePictureTaken}
      />

      <View style={styles.uploadIconContainer}>
        <UploadIcon style={{ width: 40, height: 40 }} color={Colors.brand.primaryLight} />
      </View>

      <Text style={styles.uploadTitle}>Start Your Design</Text>
      <Text style={styles.uploadSubtitle}>
        Upload a photo of your room or take a new one to get started.
      </Text>

      <View style={styles.uploadActions}>
        <TouchableOpacity
          onPress={openImageGallery}
          style={[styles.actionButton, styles.primaryButton]}
          activeOpacity={0.8}
        >
          <UploadIcon color={Colors.white} />
          <Text style={styles.btnText}>Upload Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={openCamera}
          style={[styles.actionButton, styles.secondaryButton]}
          activeOpacity={0.8}
        >
          <CameraIcon color={Colors.white} />
          <Text style={styles.btnText}>Use Camera</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  uploadCard: {
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius["4xl"],
    padding: Spacing["3xl"],
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.border.brand,
    borderStyle: "dashed",
    marginTop: Spacing.xl,
  },
  uploadIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(99,102,241,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  uploadTitle: {
    fontSize: Typography.size["2xl"],
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  uploadSubtitle: {
    fontSize: Typography.size.md,
    color: Colors.text.muted,
    textAlign: "center",
    marginBottom: Spacing["2xl"],
    lineHeight: Typography.lineHeight.normal,
  },
  uploadActions: {
    width: "100%",
    gap: Spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: 4,
  },
  primaryButton: { backgroundColor: Colors.brand.primary },
  secondaryButton: { backgroundColor: Colors.background.subtle },
  btnText: {
    color: Colors.white,
    fontWeight: Typography.weight.semiBold,
    fontSize: Typography.size.base,
    marginLeft: Spacing.sm,
  },
});

export default ImageUploader;
