import React, { useState, useRef } from "react";
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
import * as FileSystem from "expo-file-system/src/legacy";
import * as Haptics from "expo-haptics";
import { captureRef } from "react-native-view-shot";

import { BeforeAfterSlider } from "../BeforeAfterSlider";
import { DownloadIcon, ShareIcon, ResetIcon } from "../Icons";
import { Colors, Spacing, BorderRadius, Typography } from "../../theme/designTokens";
import { ViralShareCard } from "../ViralShareCard";

interface GeneratedImageDisplayProps {
  sourceImage: string;
  generatedImage: string;
  hasUnlockedHd: boolean;
  styleName: string;
  onReset: () => void;
  onRemoveWatermark: () => Promise<boolean>;
}

const getAiChangesDescription = (styleName: string): string => {
  const parts = styleName.split(" - ");
  const category = parts[0] || "";
  const choice = parts[1] || "";

  if (category.toLowerCase().includes("flooring")) {
    return `Replaced the floor surface with ${choice}. The original furniture placement, wall color, ceiling details, lighting, and general room perspective have been fully preserved.`;
  }
  if (category.toLowerCase().includes("wall paint") || category.toLowerCase().includes("wall")) {
    return `Updated the wall surface style to ${choice}. The existing flooring, furniture, room layout, ceiling, and window frames have been kept completely intact.`;
  }
  if (category.toLowerCase().includes("window") || category.toLowerCase().includes("blind")) {
    return `Modified the window framing and window treatments to show ${choice}. The core room architecture, flooring, wall paint, and furniture layout have been preserved without modification.`;
  }
  if (category.toLowerCase().includes("lighting") || category.toLowerCase().includes("mood")) {
    return `Transformed the room's lighting atmosphere to ${choice} illumination. All physical elements, furniture placement, structural walls, and floor materials remain unchanged.`;
  }
  if (category.toLowerCase().includes("patio") || category.toLowerCase().includes("outdoor")) {
    return `Redesigned the outdoor patio area with a ${choice} design. The building's exterior architecture, background environment, and structural alignment have been preserved.`;
  }
  if (category.toLowerCase().includes("kitchen") || category.toLowerCase().includes("bath")) {
    return `Remodeled the cabinetry, countertops, and structural fixtures to a ${choice} layout. The room's bounding walls and windows have been maintained for structural consistency.`;
  }
  if (category.toLowerCase().includes("full room") || category.toLowerCase().includes("redesign")) {
    return `Completely redesigned the entire space in a premium ${choice} aesthetic. All furniture, color palettes, flooring, wall designs, and decorative objects have been replaced, maintaining only the original structural boundaries.`;
  }
  return `Applied ${choice} changes to the ${category} element while keeping the rest of the room layout intact.`;
};

const GeneratedImageDisplay: React.FC<GeneratedImageDisplayProps> = ({
  sourceImage,
  generatedImage,
  hasUnlockedHd,
  styleName,
  onReset,
  onRemoveWatermark,
}) => {
  const [isSharing, setIsSharing] = useState(false);
  const [isRemovingWatermark, setIsRemovingWatermark] = useState(false);
  const shareCardRef = useRef<any>(null);

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

      let saveUri = generatedImage;

      // Handle base64 image strings
      if (generatedImage.startsWith("data:image/")) {
        const formatMatch = generatedImage.match(/^data:image\/(\w+);base64,/);
        const format = formatMatch ? formatMatch[1] : "jpeg";
        const base64Data = generatedImage.replace(/^data:image\/\w+;base64,/, "");
        
        const fileUri = `${FileSystem.cacheDirectory}saved_design_${Date.now()}.${format}`;
        await FileSystem.writeAsStringAsync(fileUri, base64Data, {
          encoding: FileSystem.EncodingType.Base64,
        });
        saveUri = fileUri;
      } 
      // Handle remote HTTP/HTTPS images
      else if (generatedImage.startsWith("http://") || generatedImage.startsWith("https://")) {
        const filename = generatedImage.split('/').pop()?.split('?')[0] || "ai_design.jpg";
        const fileUri = `${FileSystem.documentDirectory}${Date.now()}_${filename}`;
        
        const downloadResult = await FileSystem.downloadAsync(generatedImage, fileUri);
        saveUri = downloadResult.uri;
      }

      await MediaLibrary.saveToLibraryAsync(saveUri);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Saved! 🎉", "Your design has been saved to your gallery.");
    } catch (error) {
      console.error("Save image error:", error);
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
        if (!shareCardRef.current) {
          throw new Error("Sharing card ref is not ready.");
        }

        const uri = await captureRef(shareCardRef, {
          format: "jpg",
          quality: 0.95,
          result: "tmpfile",
        });

        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const RNShare = require("react-native-share").default;
        await RNShare.open({
          title: "My AI Room Design",
          message: shareMessage,
          url: uri,
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
      {/* Off-screen post card for capturing */}
      {Platform.OS !== "web" && (
        <View style={styles.hiddenCardContainer} pointerEvents="none">
          <ViralShareCard
            ref={shareCardRef}
            beforeImage={sourceImage}
            afterImage={generatedImage}
            styleName={styleName}
          />
        </View>
      )}

      <Text style={styles.resultHeader}>Your New Space ✨</Text>

      <View style={styles.watermarkWrapper}>
        <View style={{ padding: 10 }}>
          <BeforeAfterSlider beforeImage={{ uri: sourceImage }} afterImage={{ uri: generatedImage }} />
        </View>

        {!hasUnlockedHd && (
          <View style={styles.watermarkFooter}>
            <Text style={styles.watermarkText}>
              Transform your room at aihomedecorator.com — Get the app!
            </Text>
          </View>
        )}
      </View>

      {/* AI Modification Details Card */}
      <View style={styles.detailsCard}>
        <Text style={styles.detailsTitle}>AI Modification Details</Text>
        <Text style={styles.detailsText}>
          {getAiChangesDescription(styleName)}
        </Text>
      </View>

      <View style={styles.resultActions}>
        <View style={styles.actionRow}>
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

        <TouchableOpacity
          onPress={onReset}
          style={[styles.actionButton, styles.secondaryButton, styles.fullWidthButton]}
          activeOpacity={0.8}
        >
          <ResetIcon color={Colors.white} />
          <Text style={styles.btnText}>Start Over</Text>
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
  hiddenCardContainer: {
    position: "absolute",
    top: -9999,
    left: -9999,
    width: 600,
    opacity: 0,
  },
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
    flexDirection: "column",
    width: "100%",
    gap: Spacing.md,
    marginTop: Spacing["2xl"],
  },
  actionRow: {
    flexDirection: "row",
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
  fullWidthButton: {
    flex: undefined,
    width: "100%",
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
  detailsCard: {
    width: "100%",
    backgroundColor: Colors.background.card,
    borderWidth: 1,
    borderColor: Colors.border.default,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginTop: Spacing.xl,
  },
  detailsTitle: {
    color: Colors.text.primary,
    fontWeight: Typography.weight.bold,
    fontSize: Typography.size.base,
    marginBottom: Spacing.xs,
  },
  detailsText: {
    color: Colors.text.secondary,
    fontSize: Typography.size.sm + 1,
    lineHeight: 18,
  },
});

export default GeneratedImageDisplay;
