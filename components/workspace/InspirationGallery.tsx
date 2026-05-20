import React from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import * as Haptics from "expo-haptics";
import { Colors, Spacing, BorderRadius, Typography } from "../../theme/designTokens";

// Cross-platform helper to resolve local asset URIs safely on web and native
const getAssetUri = (asset: any): string => {
  if (typeof asset === "string") return asset;
  try {
    return Image.resolveAssetSource(asset)?.uri || "";
  } catch {
    return "";
  }
};

const INSPIRATION_IMAGES = [
  {
    id: "1",
    image: require("../../assets/images/inspiration/living-room.png"),
    beforeAsset: require("../../assets/images/onboarding/before_living_hall.png"),
    label: "Living Hall",
  },
  {
    id: "2",
    image: require("../../assets/images/inspiration/bedroom.png"),
    beforeAsset: require("../../assets/images/onboarding/before_bedroom.png"),
    label: "Bedroom",
  },
  {
    id: "3",
    image: require("../../assets/images/inspiration/kitchen.png"),
    beforeAsset: require("../../assets/images/onboarding/before_kitchen.png"),
    label: "Kitchen",
  },
  {
    id: "4",
    image: require("../../assets/images/inspiration/bathroom.png"),
    beforeAsset: require("../../assets/images/onboarding/before_bathroom.png"),
    label: "Bathroom",
  },
];

interface InspirationGalleryProps {
  onSelectPreset: (uri: string) => void;
}

const InspirationGallery: React.FC<InspirationGalleryProps> = React.memo(({ onSelectPreset }) => {
  const handlePress = (beforeAsset: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const resolvedUri = getAssetUri(beforeAsset);
    if (resolvedUri) {
      onSelectPreset(resolvedUri);
    }
  };

  return (
    <View style={styles.gallerySection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Get Inspired</Text>
        <Text style={styles.sectionSubtitle}>Tap any demo room below to try redesigning it instantly!</Text>
      </View>

      <View style={styles.galleryGrid}>
        {INSPIRATION_IMAGES.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.galleryCard}
            onPress={() => handlePress(item.beforeAsset)}
            activeOpacity={0.8}
          >
            <Image source={item.image} style={styles.galleryImg} />
            <View style={styles.galleryOverlay}>
              <Text style={styles.galleryLabel}>{item.label}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
});
InspirationGallery.displayName = "InspirationGallery";

const styles = StyleSheet.create({
  gallerySection: {
    marginTop: Spacing["4xl"],
  },
  sectionHeader: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
  },
  sectionSubtitle: {
    fontSize: Typography.size.base,
    color: Colors.text.muted,
    marginTop: 4,
  },
  galleryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  galleryCard: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
    backgroundColor: Colors.background.elevated,
  },
  galleryImg: {
    width: "100%",
    height: "100%",
  },
  galleryOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: Spacing.sm,
    backgroundColor: Colors.overlay.dark,
  },
  galleryLabel: {
    color: Colors.white,
    fontSize: Typography.size.sm + 1,
    fontWeight: Typography.weight.semiBold,
    textAlign: "center",
  },
});

export default InspirationGallery;
