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

import { SelectionCategory, SubCategoryChoice, StudioCategory } from "../../types";
import { ELEMENT_CATEGORIES, STUDIO_TABS, ATMOSPHERE_OPTIONS } from "../../constants";
import { RoomTypeBottomSheet } from "../RoomTypeBottomSheet";
import { DecorateIcon, AccordionChevronIcon } from "../Icons";
import { Colors, Spacing, BorderRadius, Typography } from "../../theme/designTokens";

interface DesignWorkspaceProps {
  sourceImage: string;
  credits: number;
  onReset: () => void;
  onGenerate: (
    prompt: string,
    roomType: string,
    cost: number,
    styleName: string,
    options?: {
      category?: StudioCategory;
      atmosphere?: "daylight" | "golden_hour" | "evening_2700k" | "twilight";
    }
  ) => void;
}

const CATEGORY_TIPS: Record<string, { title: string; message: string }> = {
  full_redesign: {
    title: "Full Room Design Guide 🛋️",
    message: "Take a wide-angle photo from a corner or doorway to capture the entire layout and perspective."
  },
  exterior_facade: {
    title: "Architecture & Facade Guide 🏡",
    message: "Capture the full front elevation of the house or building straight-on or from a clean 3/4 angle."
  },
  landscape_garden: {
    title: "Landscape & Garden Guide 🌿",
    message: "Capture the entire yard, patio, or lawn from a slightly elevated vantage point to show terrain."
  },
  commercial_spaces: {
    title: "Commercial & Cafe Guide 🏢",
    message: "Capture the storefront or wide open commercial space showing entrance and structural pillars."
  },
  virtual_staging: {
    title: "Virtual Staging Guide 📸",
    message: "Capture the empty room showing wall-to-wall floor space and primary windows for optimal staging."
  },
  kitchen: {
    title: "Kitchen Guide 🍳",
    message: "Capture the kitchen counter, island, and cabinets in natural lighting."
  },
  bathroom: {
    title: "Bathroom Guide 🛁",
    message: "Capture the vanity, mirror, and shower or tub area clearly."
  },
  flooring: {
    title: "Flooring Guide 🪵",
    message: "Make sure the photo covers maximum visible floor plane area."
  },
  wall_paint: {
    title: "Wall Finishes Guide 🎨",
    message: "Ensure the vertical walls are clearly visible in even lighting."
  }
};

const DesignWorkspace: React.FC<DesignWorkspaceProps> = ({
  sourceImage,
  credits,
  onReset,
  onGenerate,
}) => {
  const [activeStudioTab, setActiveStudioTab] = useState<StudioCategory>("interior");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("full_redesign");
  const [selectedChoice, setSelectedChoice] = useState<SubCategoryChoice | null>(null);
  const [selectedAtmosphere, setSelectedAtmosphere] = useState<
    "daylight" | "golden_hour" | "evening_2700k" | "twilight"
  >("daylight");
  const [customRefinement, setCustomRefinement] = useState<string>("");
  const [roomType, setRoomType] = useState<string>("");
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  const creditCost = 1;
  const hasEnoughCredits = credits >= creditCost;

  // Filter categories by the active Studio Tab (Interiors, Architecture, Landscapes, Commercial)
  const filteredCategories = ELEMENT_CATEGORIES.filter(
    (cat) => cat.studioGroup === activeStudioTab || (!cat.studioGroup && activeStudioTab === "interior")
  );

  const handleStudioTabSelect = (tabId: StudioCategory) => {
    Haptics.selectionAsync();
    setActiveStudioTab(tabId);
    const nextCategories = ELEMENT_CATEGORIES.filter(
      (cat) => cat.studioGroup === tabId || (!cat.studioGroup && tabId === "interior")
    );
    if (nextCategories.length > 0) {
      setSelectedCategoryId(nextCategories[0].id);
    }
    setSelectedChoice(null);
  };

  const handleCategorySelect = (id: string) => {
    Haptics.selectionAsync();
    setSelectedCategoryId(id);
    setSelectedChoice(null);
  };

  const handleChoiceSelect = (choice: SubCategoryChoice) => {
    Haptics.selectionAsync();
    setSelectedChoice(choice);
  };

  const handleAtmosphereSelect = (
    atm: "daylight" | "golden_hour" | "evening_2700k" | "twilight"
  ) => {
    Haptics.selectionAsync();
    setSelectedAtmosphere(atm);
  };

  const handleDecoratePress = () => {
    if (activeStudioTab === "interior" && selectedCategoryId === "full_redesign" && !roomType) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert("Select Room Type", "Please select a Room Type to continue.");
      return;
    }

    if (!selectedChoice) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert("Select Preset Style", "Please select a design style card from the carousel.");
      return;
    }

    const category = ELEMENT_CATEGORIES.find((c) => c.id === selectedCategoryId);
    const choicePrompt = selectedChoice.promptSuffix;
    const refinement = customRefinement.trim();
    const guardrail = category?.guardrail || "";

    let decorationPrompt = `Target output: ${choicePrompt}.`;
    if (refinement) {
      decorationPrompt += ` Custom refinement: ${refinement}.`;
    }
    decorationPrompt += ` Contextual Guardrails: ${guardrail}`;

    const studioName = STUDIO_TABS.find((t) => t.id === activeStudioTab)?.name || "Design";
    const decorationStyleName = `${studioName} • ${selectedChoice.name}`;
    
    let finalRoomType = "Space";
    if (activeStudioTab === "interior") {
      finalRoomType = selectedCategoryId === "full_redesign" ? (roomType || "Room") : (category?.name || "Interior Room");
    } else if (activeStudioTab === "exterior") {
      finalRoomType = "House Facade / Exterior Architecture";
    } else if (activeStudioTab === "landscape") {
      finalRoomType = "Backyard / Landscape Grounds";
    } else if (activeStudioTab === "commercial") {
      finalRoomType = selectedCategoryId === "virtual_staging" ? "Virtual Staging Space" : "Commercial Space";
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onGenerate(decorationPrompt, finalRoomType, creditCost, decorationStyleName, {
      category: activeStudioTab,
      atmosphere: selectedAtmosphere,
    });
  };

  const activeCategory = ELEMENT_CATEGORIES.find((c) => c.id === selectedCategoryId) || filteredCategories[0];

  return (
    <View style={styles.workspace}>
      {/* Step 1: Your Space */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepText}>1</Text>
          </View>
          <Text style={styles.cardTitle}>Your Uploaded Space</Text>
        </View>

        <View style={styles.previewContainer}>
          <Image source={{ uri: sourceImage }} style={styles.previewImage} />
          <TouchableOpacity onPress={onReset} style={styles.retakeBtn}>
            <Text style={styles.retakeText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {activeStudioTab === "interior" && selectedCategoryId === "full_redesign" && (
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
                {roomType || "Select Room Type (Living Room, Bedroom...)"}
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

      {/* Step 2: Configure Studio Design */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepText}>2</Text>
          </View>
          <Text style={styles.cardTitle}>Configure Studio Design</Text>
        </View>

        {/* 1. Master Studio Tabs (Interiors, Architecture, Landscapes, Commercial) */}
        <Text style={styles.sectionLabel}>Select Design Discipline</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.studioTabsScroll}
        >
          {STUDIO_TABS.map((tab) => {
            const isSelected = activeStudioTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.studioTab,
                  isSelected && styles.studioTabActive,
                ]}
                onPress={() => handleStudioTabSelect(tab.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.studioTabIcon}>{tab.icon}</Text>
                <Text
                  style={[
                    styles.studioTabText,
                    isSelected && styles.studioTabTextActive,
                  ]}
                >
                  {tab.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* 2. Sub-Category Selector */}
        {filteredCategories.length > 1 && (
          <>
            <Text style={styles.sectionLabel}>Select Feature</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryScroll}
            >
              {filteredCategories.map((cat) => {
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
          </>
        )}

        {/* Category Guideline Banner */}
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

        {/* 3. Preset Style Carousel */}
        <Text style={styles.sectionLabel}>Choose Architectural Style</Text>
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
                {choice.thumbnail ? (
                  <Image source={{ uri: choice.thumbnail }} style={styles.choiceThumbnail} />
                ) : null}
                <View style={styles.choiceTextContainer}>
                  <Text
                    style={[
                      styles.choiceName,
                      isSelected && styles.choiceNameActive,
                    ]}
                    numberOfLines={2}
                  >
                    {choice.name}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* 4. Atmosphere & Lighting Drawer (Gemini Simulation) */}
        <Text style={styles.sectionLabel}>Atmosphere & Lighting</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.atmosphereScroll}
        >
          {ATMOSPHERE_OPTIONS.map((atm) => {
            const isSelected = selectedAtmosphere === atm.id;
            return (
              <TouchableOpacity
                key={atm.id}
                style={[
                  styles.atmospherePill,
                  isSelected && styles.atmospherePillActive,
                ]}
                onPress={() => handleAtmosphereSelect(atm.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.atmosphereIcon}>{atm.icon}</Text>
                <Text
                  style={[
                    styles.atmosphereText,
                    isSelected && styles.atmosphereTextActive,
                  ]}
                >
                  {atm.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Custom Refinement */}
        <View style={styles.refinementContainer}>
          <Text style={styles.sectionLabel}>Custom Details (Optional)</Text>
          <TextInput
            style={styles.textArea}
            placeholder="e.g. Add an olive tree, warm beige linen sofa, brass pendant lights, travertine coffee table..."
            placeholderTextColor={Colors.text.muted}
            value={customRefinement}
            onChangeText={setCustomRefinement}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Primary CTA */}
        <TouchableOpacity
          style={[styles.decorateBtn, !hasEnoughCredits && styles.decorateBtnDisabled]}
          onPress={handleDecoratePress}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={hasEnoughCredits ? ["#EA580C", "#D97706"] : ["#475569", "#334155"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBtn}
          >
            <DecorateIcon color={Colors.white} />
            <Text style={styles.decorateBtnText}>
              {hasEnoughCredits ? "Transform Space • 1 Credit" : "Get Credits to Transform"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  workspace: {
    gap: Spacing.xl,
    paddingBottom: Spacing["4xl"],
  },
  card: {
    backgroundColor: "rgba(38, 28, 22, 0.45)",
    borderRadius: BorderRadius["2xl"],
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#EA580C",
    justifyContent: "center",
    alignItems: "center",
  },
  stepText: {
    color: Colors.white,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
  },
  cardTitle: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: "#FFFBF5",
  },
  previewContainer: {
    position: "relative",
    width: "100%",
    height: 220,
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
    backgroundColor: Colors.background.elevated,
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  retakeBtn: {
    position: "absolute",
    bottom: Spacing.md,
    right: Spacing.md,
    backgroundColor: "rgba(10, 8, 6, 0.8)",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  retakeText: {
    color: "#FFFBF5",
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
  },
  inputContainer: {
    marginTop: Spacing.lg,
  },
  inputLabel: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semiBold,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  customPickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(21, 14, 11, 0.8)",
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  customPickerText: {
    color: Colors.text.primary,
    fontSize: Typography.size.base,
  },
  sectionLabel: {
    fontSize: Typography.size.sm + 1,
    fontWeight: Typography.weight.semiBold,
    color: "#E2D9D2",
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  studioTabsScroll: {
    paddingVertical: Spacing.xs,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  studioTab: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(21, 14, 11, 0.8)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.08)",
    marginRight: Spacing.xs,
    gap: 6,
  },
  studioTabActive: {
    backgroundColor: "rgba(234, 88, 12, 0.18)",
    borderColor: "#EA580C",
  },
  studioTabIcon: {
    fontSize: 16,
  },
  studioTabText: {
    color: "#A89F97",
    fontSize: Typography.size.sm + 1,
    fontWeight: Typography.weight.semiBold,
  },
  studioTabTextActive: {
    color: "#FFFBF5",
    fontWeight: Typography.weight.bold,
  },
  categoryScroll: {
    paddingVertical: Spacing.xs,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  categoryTab: {
    backgroundColor: "rgba(21, 14, 11, 0.6)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    marginRight: Spacing.xs,
  },
  categoryTabActive: {
    backgroundColor: "#EA580C",
    borderColor: "#EA580C",
  },
  categoryText: {
    color: "#A89F97",
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
  },
  categoryTextActive: {
    color: Colors.white,
    fontWeight: Typography.weight.bold,
  },
  guideBanner: {
    backgroundColor: "rgba(234, 88, 12, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(234, 88, 12, 0.25)",
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginVertical: Spacing.sm,
  },
  guideHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginBottom: 4,
  },
  guideIcon: {
    fontSize: 14,
  },
  guideBannerTitle: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    color: "#FB923C",
  },
  guideBannerText: {
    fontSize: Typography.size.xs + 1,
    color: "#E2D9D2",
    lineHeight: 18,
  },
  choicesCarousel: {
    paddingVertical: Spacing.xs,
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  choiceCard: {
    width: 140,
    backgroundColor: "rgba(21, 14, 11, 0.8)",
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.08)",
    overflow: "hidden",
    position: "relative",
  },
  choiceCardActive: {
    borderColor: "#EA580C",
    backgroundColor: "rgba(234, 88, 12, 0.12)",
    shadowColor: "#EA580C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  choiceThumbnail: {
    width: "100%",
    height: 75,
    resizeMode: "cover",
  },
  choiceTextContainer: {
    padding: Spacing.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#EA580C",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    borderWidth: 1,
    borderColor: Colors.white,
  },
  checkmarkText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: "bold",
  },
  choiceName: {
    color: "#E2D9D2",
    fontSize: Typography.size.xs + 1,
    fontWeight: Typography.weight.semiBold,
    textAlign: "center",
  },
  choiceNameActive: {
    color: "#FFFBF5",
    fontWeight: Typography.weight.bold,
  },
  atmosphereScroll: {
    paddingVertical: Spacing.xs,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  atmospherePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(21, 14, 11, 0.7)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    marginRight: Spacing.xs,
    gap: 6,
  },
  atmospherePillActive: {
    borderColor: "#F59E0B",
    backgroundColor: "rgba(245, 158, 11, 0.15)",
  },
  atmosphereIcon: {
    fontSize: 14,
  },
  atmosphereText: {
    color: "#A89F97",
    fontSize: Typography.size.xs + 1,
    fontWeight: Typography.weight.medium,
  },
  atmosphereTextActive: {
    color: "#F59E0B",
    fontWeight: Typography.weight.bold,
  },
  refinementContainer: {
    marginTop: Spacing.xs,
  },
  textArea: {
    backgroundColor: "rgba(21, 14, 11, 0.8)",
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    color: "#FFFBF5",
    height: 75,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    fontSize: Typography.size.sm,
  },
  decorateBtn: {
    height: 56,
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
    marginTop: Spacing.lg,
    shadowColor: "#EA580C",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  decorateBtnDisabled: {
    opacity: 0.6,
  },
  gradientBtn: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
  },
  decorateBtnText: {
    color: Colors.white,
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.bold,
    letterSpacing: 0.3,
  },
});

export default DesignWorkspace;
