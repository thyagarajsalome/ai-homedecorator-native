import React from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import * as Haptics from "expo-haptics";
import { Colors, Spacing, BorderRadius, Typography } from "../../theme/designTokens";
import { StudioCategory } from "../../types";

// Cross-platform helper to resolve local asset URIs safely on web and native
const getAssetUri = (asset: any): string => {
  if (typeof asset === "string") return asset;
  try {
    return Image.resolveAssetSource(asset)?.uri || "";
  } catch {
    return "";
  }
};

export interface InspirationItem {
  id: string;
  image: any;
  beforeAsset: any;
  label: string;
  discipline: string;
  category: StudioCategory;
}

const INSPIRATION_IMAGES: InspirationItem[] = [
  {
    id: "1",
    image: require("../../assets/images/inspiration/demo_living_hall.jpg"),
    beforeAsset: require("../../assets/images/inspiration/preset_living_hall.jpg"),
    label: "Living Hall",
    discipline: "Interior",
    category: "interior",
  },
  {
    id: "2",
    image: require("../../assets/images/inspiration/demo_house_facade.jpg"),
    beforeAsset: require("../../assets/images/inspiration/preset_house_facade.jpg"),
    label: "House Facade",
    discipline: "Architecture",
    category: "exterior",
  },
  {
    id: "3",
    image: require("../../assets/images/inspiration/demo_backyard_pool.jpg"),
    beforeAsset: require("../../assets/images/inspiration/preset_backyard_pool.jpg"),
    label: "Backyard & Pool",
    discipline: "Landscape",
    category: "landscape",
  },
  {
    id: "4",
    image: require("../../assets/images/inspiration/demo_designer_kitchen.jpg"),
    beforeAsset: require("../../assets/images/inspiration/preset_designer_kitchen.jpg"),
    label: "Modern Kitchen",
    discipline: "Kitchen",
    category: "interior",
  },
];

interface InspirationGalleryProps {
  onSelectPreset: (uri: string, category?: StudioCategory) => void;
}

const InspirationGallery: React.FC<InspirationGalleryProps> = React.memo(({ onSelectPreset }) => {
  const handlePress = (item: InspirationItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const resolvedUri = getAssetUri(item.beforeAsset);
    if (resolvedUri) {
      onSelectPreset(resolvedUri, item.category);
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
            onPress={() => handlePress(item)}
            activeOpacity={0.85}
          >
            <Image source={item.image} style={styles.galleryImg} resizeMode="cover" />
            <View style={styles.disciplineBadge}>
              <Text style={styles.disciplineText}>{item.discipline}</Text>
            </View>
            <View style={styles.galleryOverlay}>
              <Text style={styles.galleryLabel}>{item.label}</Text>
              <Text style={styles.galleryAction}>Tap to try ✦</Text>
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
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  galleryImg: {
    width: "100%",
    height: "100%",
  },
  disciplineBadge: {
    position: "absolute",
    top: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: "rgba(17, 24, 39, 0.8)",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  disciplineText: {
    color: Colors.brand.secondary,
    fontSize: Typography.size.xs - 1,
    fontWeight: Typography.weight.bold,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  galleryOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    backgroundColor: "rgba(10, 10, 10, 0.85)",
  },
  galleryLabel: {
    color: Colors.white,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    textAlign: "center",
  },
  galleryAction: {
    color: Colors.brand.primaryLight,
    fontSize: Typography.size.xs - 1,
    textAlign: "center",
    marginTop: 2,
    fontWeight: Typography.weight.medium,
  },
});

export default InspirationGallery;
