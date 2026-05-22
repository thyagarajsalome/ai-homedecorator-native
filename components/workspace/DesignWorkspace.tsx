import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

import { SelectionCategory, SubCategoryChoice } from "../../types";
import { ELEMENT_CATEGORIES } from "../../constants";
import { RoomTypeBottomSheet } from "../RoomTypeBottomSheet";
import { DecorateIcon, AccordionChevronIcon } from "../Icons";
import { Colors, Spacing, BorderRadius, Typography } from "../../theme/designTokens";

interface DesignWorkspaceProps {
  sourceImage: string;
  credits: number;
  onReset: () => void;
  onGenerate: (prompt: string, roomType: string, cost: number, styleName: string) => void;
}



const CATEGORY_TIPS: Record<string, { title: string; message: string }> = {
  flooring: {
    title: "Flooring Capture Guide 🪵",
    message: "Make sure the photo is covering the maximum floor area possible."
  },
  wall_paint: {
    title: "Wall Paint Capture Guide 🎨",
    message: "Try to take a photo of a wall that is clearly visible in natural daylight."
  },
  windows_blinds: {
    title: "Windows & Blinds Capture Guide 🪟",
    message: "Try to cover only the window and blinds from a good distance."
  },
  lighting_mood: {
    title: "Lighting & Mood Capture Guide 💡",
    message: "Make sure you take the photo from a good distance at eye level."
  },
  outdoor_patio: {
    title: "Outdoor & Patio Capture Guide 🏡",
    message: "Try to capture the entire deck, patio, or outdoor area from a wider angle."
  },
  space_remodel: {
    title: "Kitchen & Bath Capture Guide 🍳",
    message: "Try to take the photo from a corner to capture the full kitchen or bathroom space."
  },
  full_redesign: {
    title: "Full Room Redesign Guide 🌍",
    message: "Try to take a wide-angle photo of the room from a corner or doorway to capture the entire layout."
  }
};

const DesignWorkspace: React.FC<DesignWorkspaceProps> = ({
  sourceImage,
  credits,
  onReset,
  onGenerate,
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    ELEMENT_CATEGORIES[0].id
  );
  const [selectedChoice, setSelectedChoice] = useState<SubCategoryChoice | null>(null);
  const [customRefinement, setCustomRefinement] = useState<string>("");
  const [roomType, setRoomType] = useState<string>("");
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  const creditCost = 1;
  const hasEnoughCredits = credits >= creditCost;

  const handleCategorySelect = (id: string) => {
    Haptics.selectionAsync();
    setSelectedCategoryId(id);
    setSelectedChoice(null);
  };

  const handleChoiceSelect = (choice: SubCategoryChoice) => {
    Haptics.selectionAsync();
    setSelectedChoice(choice);
  };

  const handleDecoratePress = () => {
    if (selectedCategoryId === "full_redesign" && !roomType) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert("Select Room Type", "Please select a Room Type to continue.");
      return;
    }

    if (!selectedChoice) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert("Select Preset Style", "Please select a style card from the carousel.");
      return;
    }

    const category = ELEMENT_CATEGORIES.find(c => c.id === selectedCategoryId);
    const choicePrompt = selectedChoice.promptSuffix;
    const refinement = customRefinement.trim();
    const guardrail = category?.guardrail || "";

    // Compiling the final prompt: "Task: Perform an image-to-image modification specializing in home interiors. Target output: [Selected Item Prompt Suffix]." + (optional refinement text) + " Contextual Guardrails: [Category Preservation Prompt Guardrail] High-end, hyper-realistic architectural layout projection presentation."
    let decorationPrompt = `Task: Perform an image-to-image modification specializing in home interiors. Target output: ${choicePrompt}.`;
    if (refinement) {
      decorationPrompt += ` Additional detailed requirements: ${refinement}.`;
    }
    decorationPrompt += ` Contextual Guardrails: ${guardrail} High-end, hyper-realistic architectural layout projection presentation.`;

    const decorationStyleName = `${category?.name || "Design"} - ${selectedChoice.name}`;
    const finalRoomType = selectedCategoryId === "full_redesign" ? roomType : `${category?.name || "Design"} Modification`;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onGenerate(decorationPrompt, finalRoomType, creditCost, decorationStyleName);
  };

  const activeCategory = ELEMENT_CATEGORIES.find(c => c.id === selectedCategoryId);

  return (
    <View style={styles.workspace}>
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

        {selectedCategoryId === "full_redesign" && (
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
        )}
      </View>

      {/* Step 2: Configure Design */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepText}>2</Text>
          </View>
          <Text style={styles.cardTitle}>Configure Design</Text>
        </View>

        {/* Master Category Selector */}
        <Text style={styles.sectionLabel}>Select Element</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {ELEMENT_CATEGORIES.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryTab,
                  isSelected && styles.categoryTabActive,
                ]}
                onPress={() => handleCategorySelect(cat.id)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.categoryText,
                    isSelected && styles.categoryTextActive,
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Dynamic Category Photo Guideline Banner */}
        {activeCategory && CATEGORY_TIPS[selectedCategoryId] && (
          <View style={styles.guideBanner}>
            <View style={styles.guideHeader}>
              <Text style={styles.guideIcon}>💡</Text>
              <Text style={styles.guideBannerTitle}>
                {CATEGORY_TIPS[selectedCategoryId].title}
              </Text>
            </View>
            <Text style={styles.guideBannerText}>
              {CATEGORY_TIPS[selectedCategoryId].message}
            </Text>
          </View>
        )}

        {/* Sub-choice Carousel */}
        <Text style={styles.sectionLabel}>Choose Preset Style</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.choicesCarousel}
        >
          {activeCategory?.choices.map((choice) => {
            const isSelected = selectedChoice?.name === choice.name;
            return (
              <TouchableOpacity
                key={choice.name}
                style={[
                  styles.choiceCard,
                  isSelected && styles.choiceCardActive,
                ]}
                onPress={() => handleChoiceSelect(choice)}
                activeOpacity={0.8}
              >
                {isSelected && (
                  <View style={styles.checkmarkBadge}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
                <View style={styles.choiceTextContainer}>
                  <Text
                    style={[
                      styles.choiceName,
                      isSelected && styles.choiceNameActive,
                    ]}
                    numberOfLines={3}
                  >
                    {choice.name}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Text Refinement */}
        <View style={styles.refinementContainer}>
          <Text style={styles.sectionLabel}>Text Refinement (Optional)</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Add custom details (e.g., 'matte finish, light beige tones, clean finish')"
            placeholderTextColor={Colors.text.disabled}
            multiline
            value={customRefinement}
            onChangeText={setCustomRefinement}
            maxLength={120}
          />
          <Text style={styles.charCount}>{customRefinement.length}/120</Text>
        </View>
      </View>

      {/* Generate Button */}
      <View style={styles.generateSection}>
        <TouchableOpacity
          style={styles.generateBtn}
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
          <Text style={styles.lowCreditText}>⚠️ Out of credits — Click Generate to purchase more</Text>
        ) : (
          <Text style={styles.balanceText}>You have {credits} credits available</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  workspace: {
    gap: Spacing["2xl"]
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
  previewImage: {
    width: "100%",
    height: "100%"
  },
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
  sectionLabel: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semiBold,
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
    marginTop: Spacing.md,
  },
  categoryScroll: {
    paddingVertical: Spacing.xs,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  categoryTab: {
    backgroundColor: Colors.background.input,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    marginRight: Spacing.xs,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryTabActive: {
    backgroundColor: Colors.brand.primary,
    borderColor: Colors.brand.primary,
  },
  categoryText: {
    color: Colors.text.secondary,
    fontSize: Typography.size.sm + 1,
    fontWeight: Typography.weight.medium,
  },
  categoryTextActive: {
    color: Colors.white,
    fontWeight: Typography.weight.bold,
  },
  choicesCarousel: {
    paddingVertical: Spacing.xs,
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  choiceCard: {
    width: 130,
    height: 72,
    backgroundColor: Colors.background.input,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  choiceCardActive: {
    borderColor: Colors.brand.primary,
    backgroundColor: "rgba(99, 102, 241, 0.08)",
  },
  choiceTextContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.brand.primary,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  checkmarkText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: "bold",
  },
  choiceName: {
    color: Colors.text.secondary,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    textAlign: "center",
  },
  choiceNameActive: {
    color: Colors.white,
    fontWeight: Typography.weight.bold,
  },
  refinementContainer: {
    marginTop: Spacing.md,
  },
  textArea: {
    backgroundColor: Colors.background.input,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    color: Colors.text.primary,
    height: 90,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: Colors.border.subtle,
  },
  charCount: {
    color: Colors.text.disabled,
    fontSize: Typography.size.xs,
    textAlign: "right",
    marginTop: Spacing.xs,
  },
  generateSection: {
    marginTop: Spacing.md,
    alignItems: "center",
  },
  generateBtn: {
    width: "100%",
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
  },
  generateBtnInner: {
    width: "100%",
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  generateBtnDisabled: {
    opacity: 0.5,
  },
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
  guideBanner: {
    backgroundColor: "rgba(139, 92, 246, 0.08)",
    borderWidth: 1,
    borderColor: Colors.border.brand,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    marginTop: Spacing.xs,
  },
  guideHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  guideIcon: {
    fontSize: 16,
    marginRight: Spacing.xs,
  },
  guideBannerTitle: {
    color: Colors.brand.primaryLight,
    fontWeight: Typography.weight.bold,
    fontSize: Typography.size.sm + 1,
  },
  guideBannerText: {
    color: Colors.text.secondary,
    fontSize: Typography.size.sm + 1,
    lineHeight: 18,
  },
});

export default DesignWorkspace;
