import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

import { Style } from "../../types";
import { STYLE_CATEGORIES } from "../../constants";
import { RoomTypeBottomSheet } from "../RoomTypeBottomSheet";
import {
  DecorateIcon,
  AccordionChevronIcon,
} from "../Icons";
import { Colors, Spacing, BorderRadius, Typography } from "../../theme/designTokens";

interface DesignWorkspaceProps {
  sourceImage: string;
  credits: number;
  onReset: () => void;
  onBuyCreditsNavigate: () => void;
  onGenerate: (prompt: string, roomType: string, cost: number) => void;
}

const DesignWorkspace: React.FC<DesignWorkspaceProps> = ({
  sourceImage,
  credits,
  onReset,
  onBuyCreditsNavigate,
  onGenerate,
}) => {
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [roomType, setRoomType] = useState<string>("");
  const [selectedStyle, setSelectedStyle] = useState<Style | null>(null);
  const [decorMode, setDecorMode] = useState<"style" | "custom">("style");
  const [activeAccordion, setActiveAccordion] = useState<string | null>(
    STYLE_CATEGORIES[0].name
  );
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  const creditCost = decorMode === "style" ? 1 : 3;
  const hasEnoughCredits = credits >= creditCost;

  const handleDecoratePress = () => {
    if (!roomType) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert("Select Room Type", "Please select a Room Type to continue.");
      return;
    }

    const decorationPrompt =
      decorMode === "style" ? selectedStyle?.prompt : customPrompt;

    if (!decorationPrompt) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert(
        "Choose a Style",
        "Please select a style or enter a custom design description."
      );
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onGenerate(decorationPrompt, roomType, creditCost);
  };

  const toggleAccordion = (catName: string) => {
    Haptics.selectionAsync();
    setActiveAccordion(activeAccordion === catName ? null : catName);
  };

  const selectStyle = (s: Style) => {
    Haptics.selectionAsync();
    setSelectedStyle(s);
  };

  return (
    <View style={styles.workspace}>
      {/* Flash Sale Banner */}
      <TouchableOpacity
        style={styles.homeSaleIndicator}
        onPress={onBuyCreditsNavigate}
        activeOpacity={0.8}
      >
        <View style={styles.homeSaleTextContainer}>
          <Text style={styles.homeSaleTitle}>FLASH SALE: 50% OFF!</Text>
          <Text style={styles.homeSaleSubtitle}>All credit packs are half price.</Text>
        </View>
        <View style={styles.homeSaleButton}>
          <Text style={styles.homeSaleButtonText}>GET OFFER</Text>
        </View>
      </TouchableOpacity>

      {/* Step 1: Your Room */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepText}>1</Text>
          </View>
          <Text style={styles.cardTitle}>Your Room</Text>
        </View>

        <View style={styles.previewContainer}>
          <Image source={{ uri: sourceImage }} style={styles.previewImage} />
          <TouchableOpacity onPress={onReset} style={styles.retakeBtn}>
            <Text style={styles.retakeText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Room Type</Text>
          <TouchableOpacity
            style={styles.customPickerButton}
            onPress={() => {
              Haptics.selectionAsync();
              setIsBottomSheetVisible(true);
            }}
          >
            <Text style={[styles.customPickerText, !roomType && { color: Colors.text.disabled }]}>
              {roomType || "Select Room Type..."}
            </Text>
            <AccordionChevronIcon color={Colors.text.muted} />
          </TouchableOpacity>

          <RoomTypeBottomSheet
            isVisible={isBottomSheetVisible}
            onClose={() => setIsBottomSheetVisible(false)}
            selectedValue={roomType}
            onSelect={setRoomType}
          />
        </View>
      </View>

      {/* Step 2: Design Style */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepText}>2</Text>
          </View>
          <Text style={styles.cardTitle}>Design Style</Text>
        </View>

        <View style={styles.segmentedControl}>
          <TouchableOpacity
            style={[styles.segment, decorMode === "style" && styles.segmentActive]}
            onPress={() => setDecorMode("style")}
          >
            <Text style={[styles.segmentText, decorMode === "style" && styles.segmentTextActive]}>
              Presets
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segment, decorMode === "custom" && styles.segmentActive]}
            onPress={() => setDecorMode("custom")}
          >
            <Text style={[styles.segmentText, decorMode === "custom" && styles.segmentTextActive]}>
              Custom
            </Text>
          </TouchableOpacity>
        </View>

        {decorMode === "style" ? (
          <View style={styles.styleList}>
            {STYLE_CATEGORIES.map((cat) => (
              <View key={cat.name} style={styles.accordion}>
                <TouchableOpacity
                  style={styles.accordionHeader}
                  onPress={() => toggleAccordion(cat.name)}
                >
                  <Text style={styles.accordionTitle}>{cat.name}</Text>
                  <AccordionChevronIcon
                    color={Colors.text.muted}
                    active={activeAccordion === cat.name}
                  />
                </TouchableOpacity>

                {activeAccordion === cat.name && (
                  <View style={styles.styleGrid}>
                    {cat.styles.map((s) => (
                      <TouchableOpacity
                        key={s.name}
                        style={[
                          styles.styleChip,
                          selectedStyle?.name === s.name && styles.styleChipActive,
                        ]}
                        onPress={() => selectStyle(s)}
                      >
                        <Text
                          style={[
                            styles.styleChipText,
                            selectedStyle?.name === s.name && styles.styleChipTextActive,
                          ]}
                        >
                          {s.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.customInputContainer}>
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>🌟 Advanced Custom Design</Text>
              <Text style={styles.infoText}>
                Uses our premium AI model for highly detailed requests. (Costs 3 credits)
              </Text>
            </View>
            <TextInput
              style={styles.textArea}
              placeholder="Describe your dream room... (e.g. 'Cyberpunk living room with neon lights')"
              placeholderTextColor={Colors.text.disabled}
              multiline
              value={customPrompt}
              onChangeText={setCustomPrompt}
              maxLength={250}
            />
            <Text style={styles.charCount}>{customPrompt.length}/250</Text>
          </View>
        )}
      </View>

      {/* Generate Button */}
      <View style={styles.generateSection}>
        <TouchableOpacity
          style={[styles.generateBtn, !hasEnoughCredits && styles.generateBtnDisabled]}
          onPress={handleDecoratePress}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#6366F1", "#D946EF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.generateBtnInner}
          >
            <DecorateIcon style={{ marginRight: Spacing.sm }} color={Colors.white} />
            <Text style={styles.generateBtnText}>Generate Design</Text>
            <View style={styles.creditBadge}>
              <Text style={styles.creditBadgeText}>{creditCost}</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {!hasEnoughCredits ? (
          <Text style={styles.lowCreditText}>⚠️ Not enough credits — tap to buy more</Text>
        ) : (
          <Text style={styles.balanceText}>You have {credits} credits available</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  workspace: { gap: Spacing["2xl"] },
  homeSaleIndicator: {
    backgroundColor: "rgba(99, 102, 241, 0.15)",
    borderWidth: 1,
    borderColor: Colors.brand.primary,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },
  homeSaleTextContainer: { flex: 1 },
  homeSaleTitle: {
    color: Colors.brand.primaryLight,
    fontWeight: Typography.weight.black,
    fontSize: Typography.size.md,
  },
  homeSaleSubtitle: {
    color: Colors.text.muted,
    fontSize: Typography.size.sm,
    marginTop: 2,
  },
  homeSaleButton: {
    backgroundColor: Colors.brand.primary,
    paddingHorizontal: 12,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm + 2,
    marginLeft: Spacing.md,
  },
  homeSaleButtonText: {
    color: Colors.white,
    fontWeight: Typography.weight.bold,
    fontSize: Typography.size.sm,
  },
  card: {
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius["3xl"],
    padding: Spacing["2xl"],
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.brand.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  stepText: {
    color: Colors.white,
    fontWeight: Typography.weight.bold,
    fontSize: Typography.size.base,
  },
  cardTitle: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
  },
  previewContainer: {
    height: 200,
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
    marginBottom: Spacing.xl,
    position: "relative",
  },
  previewImage: { width: "100%", height: "100%" },
  retakeBtn: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: Colors.overlay.dark,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
  },
  retakeText: {
    color: Colors.white,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semiBold,
  },
  inputContainer: {},
  inputLabel: {
    color: Colors.text.secondary,
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semiBold,
    marginBottom: Spacing.sm,
    marginLeft: 4,
  },
  customPickerButton: {
    backgroundColor: Colors.background.input,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
  },
  customPickerText: {
    color: Colors.text.primary,
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.medium,
  },
  segmentedControl: {
    flexDirection: "row",
    backgroundColor: Colors.background.input,
    padding: 4,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xl,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  segmentActive: { backgroundColor: Colors.background.subtle },
  segmentText: { color: Colors.text.muted, fontWeight: Typography.weight.semiBold },
  segmentTextActive: { color: Colors.text.primary },
  styleList: { gap: Spacing.md },
  accordion: {
    backgroundColor: Colors.background.input,
    borderRadius: BorderRadius.md,
    overflow: "hidden",
  },
  accordionHeader: {
    flexDirection: "row",
    padding: Spacing.lg,
    alignItems: "center",
    justifyContent: "space-between",
  },
  accordionTitle: {
    color: Colors.text.primary,
    fontWeight: Typography.weight.semiBold,
    fontSize: Typography.size.md,
  },
  styleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: Spacing.md,
    gap: 10,
    paddingTop: 0,
  },
  styleChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.elevated,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
  },
  styleChipActive: {
    backgroundColor: Colors.brand.primary,
    borderColor: Colors.brand.primary,
  },
  styleChipText: { color: Colors.text.secondary, fontSize: Typography.size.sm + 1 },
  styleChipTextActive: { color: Colors.white, fontWeight: Typography.weight.bold },
  customInputContainer: {},
  infoBox: {
    backgroundColor: Colors.semantic.infoBg,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.semantic.infoBorder,
  },
  infoTitle: {
    color: Colors.brand.accentLight,
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.bold,
    marginBottom: 4,
  },
  infoText: { color: Colors.brand.accent, fontSize: Typography.size.sm + 1 },
  textArea: {
    backgroundColor: Colors.background.input,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    color: Colors.text.primary,
    height: 120,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: Colors.border.subtle,
  },
  charCount: {
    color: Colors.text.disabled,
    fontSize: Typography.size.sm,
    textAlign: "right",
    marginTop: Spacing.sm,
  },
  generateSection: { marginTop: Spacing.md, alignItems: "center" },
  generateBtn: { width: "100%", borderRadius: BorderRadius.xl, overflow: "hidden" },
  generateBtnInner: {
    width: "100%",
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  generateBtnDisabled: { opacity: 0.5 },
  generateBtnText: {
    color: Colors.white,
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
  },
  creditBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 10,
  },
  creditBadgeText: {
    color: Colors.white,
    fontWeight: Typography.weight.bold,
    fontSize: Typography.size.sm,
  },
  balanceText: {
    color: Colors.text.muted,
    marginTop: Spacing.lg,
    fontSize: Typography.size.base,
  },
  lowCreditText: {
    color: Colors.semantic.error,
    marginTop: Spacing.lg,
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semiBold,
  },
});

export default DesignWorkspace;
