import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import * as MediaLibrary from "expo-media-library";
import * as Haptics from "expo-haptics";

import { BeforeAfterSlider } from "../BeforeAfterSlider";
import { DownloadIcon, ShareIcon, ResetIcon } from "../Icons";
import { Colors, Spacing, BorderRadius, Typography } from "../../theme/designTokens";

interface GeneratedImageDisplayProps {
  sourceImage: string;
  generatedImage: string;
  hasUnlockedHd: boolean;
  onReset: () => void;
  onRemoveWatermark: () => Promise<boolean>;
}

const GeneratedImageDisplay: React.FC<GeneratedImageDisplayProps> = ({
  sourceImage,
  generatedImage,
  hasUnlockedHd,
  onReset,
  onRemoveWatermark,
}) => {
  const [isSharing, setIsSharing] = useState(false);
  const [isRemovingWatermark, setIsRemovingWatermark] = useState(false);

  const handleRemoveWatermarkPress = async () => {
    setIsRemovingWatermark(true);
    try {
      const success = await onRemoveWatermark();
      if (success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } finally {
      setIsRemovingWatermark(false);
    }
  };

  const handleDownload = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Needed",
          "We need permission to save photos to your gallery.",
          [{ text: "OK" }]
        );
        return;
      }
      await MediaLibrary.saveToLibraryAsync(generatedImage);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Saved! 🎉", "Your design has been saved to your gallery.");
    } catch (error) {
      Alert.alert("Error", "Failed to save image. Please try again.");
    }
  };

  const handleShare = async () => {
    if (isSharing) return;
    setIsSharing(true);
    try {
      const shareMessage =
        "Check out this amazing room I designed with AI! 🚀✨\n\nDownload AI Home Decorator now:\nhttps://play.google.com/store/apps/details?id=com.aihomedecorator.twa";

      if (Platform.OS === "web") {
        if (navigator.share) {
          await navigator.share({
            title: "My AI Room Design",
            text: shareMessage,
            url: generatedImage,
          });
        } else {
          Alert.alert("Share", "Sharing is not supported in this browser.");
        }
      } else {
        const RNShare = require("react-native-share").default;
        await RNShare.open({
          title: "My AI Room Design",
          message: shareMessage,
          url: generatedImage,
          type: "image/jpeg",
        });
      }
    } catch (error: any) {
      if (error.message !== "User did not share") {
        console.error("Share error:", error);
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Animated.View entering={FadeInDown.duration(600).springify()} style={styles.resultContainer}>
      <Text style={styles.resultHeader}>Your New Space ✨</Text>

      <View style={styles.watermarkWrapper}>
        <View style={{ padding: 10 }}>
          <BeforeAfterSlider beforeImage={sourceImage} afterImage={generatedImage} />
        </View>

        {!hasUnlockedHd && (
          <View style={styles.watermarkFooter}>
            <Text style={styles.watermarkText}>
              Transform your room at aihomedecorator.com — Get the app!
            </Text>
          </View>
        )}
      </View>

      <View style={styles.resultActions}>
        <TouchableOpacity
          onPress={onReset}
          style={[styles.actionButton, styles.secondaryButton]}
          activeOpacity={0.8}
        >
          <ResetIcon color={Colors.white} />
          <Text style={styles.btnText}>Start Over</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDownload}
          style={[styles.actionButton, styles.primaryButton]}
          activeOpacity={0.8}
        >
          <DownloadIcon color={Colors.white} />
          <Text style={styles.btnText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleShare}
          style={[styles.actionButton, styles.accentButton]}
          activeOpacity={0.8}
          disabled={isSharing}
        >
          <ShareIcon color={Colors.white} />
          <Text style={styles.btnText}>{isSharing ? "..." : "Share"}</Text>
        </TouchableOpacity>
      </View>

      {!hasUnlockedHd && (
        <TouchableOpacity
          style={styles.upsellButton}
          onPress={handleRemoveWatermarkPress}
          disabled={isRemovingWatermark}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["rgba(99, 102, 241, 0.2)", "rgba(217, 70, 239, 0.2)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.upsellGradient}
          >
            <Text style={styles.upsellButtonText}>
              {isRemovingWatermark
                ? "Processing..."
                : "✨ Remove Watermark & Save HD (1 Credit)"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  resultContainer: {
    alignItems: "center",
    marginTop: Spacing.xl,
  },
  resultHeader: {
    fontSize: Typography.size["3xl"],
    fontWeight: Typography.weight.extraBold,
    color: Colors.text.primary,
    marginBottom: Spacing["2xl"],
  },
  watermarkWrapper: {
    backgroundColor: Colors.background.elevated,
    borderRadius: BorderRadius["2xl"],
    overflow: "hidden",
    width: "100%",
  },
  watermarkFooter: {
    backgroundColor: Colors.background.input,
    paddingVertical: 12,
    paddingHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  watermarkText: {
    color: Colors.text.muted,
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semiBold,
    textAlign: "center",
  },
  resultActions: {
    flexDirection: "row",
    width: "100%",
    gap: Spacing.md,
    marginTop: Spacing["2xl"],
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
  accentButton: { backgroundColor: Colors.brand.accent },
  btnText: {
    color: Colors.white,
    fontWeight: Typography.weight.semiBold,
    fontSize: Typography.size.base,
    marginLeft: Spacing.sm,
  },
  upsellButton: {
    marginTop: Spacing.lg,
    overflow: "hidden",
    borderRadius: BorderRadius.lg,
    width: "100%",
  },
  upsellGradient: {
    width: "100%",
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: BorderRadius.lg,
  },
  upsellButtonText: {
    color: Colors.brand.primaryLight,
    fontWeight: Typography.weight.bold,
    fontSize: Typography.size.md,
  },
});

export default GeneratedImageDisplay;
