import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { Colors, Spacing, BorderRadius, Typography } from "../../theme/designTokens";

// Static inspiration images - shown on the upload/landing state
// to inspire users before they take action.
const INSPIRATION_IMAGES = [
  {
    id: "1",
    image: require("../../assets/images/inspiration/living-room.jpg"),
    label: "Living Room",
  },
  {
    id: "2",
    image: require("../../assets/images/inspiration/bedroom.jpg"),
    label: "Bedroom",
  },
  {
    id: "3",
    image: require("../../assets/images/inspiration/kitchen.jpg"),
    label: "Kitchen",
  },
  {
    id: "4",
    image: require("../../assets/images/inspiration/bathroom.jpg"),
    label: "Bathroom",
  },
];

const InspirationGallery: React.FC = React.memo(() => {
  return (
    <View style={styles.gallerySection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Get Inspired</Text>
        <Text style={styles.sectionSubtitle}>See what's possible with AI</Text>
      </View>

      <View style={styles.galleryGrid}>
        {INSPIRATION_IMAGES.map((item) => (
          <View key={item.id} style={styles.galleryCard}>
            <Image source={item.image} style={styles.galleryImg} />
            <View style={styles.galleryOverlay}>
              <Text style={styles.galleryLabel}>{item.label}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
});

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
    marginTop: 2,
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
