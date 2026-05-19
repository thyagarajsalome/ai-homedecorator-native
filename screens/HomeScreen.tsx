import React, { useState, useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";

// Core Constants & Types
import { Style } from "../types";
import { ROOM_TYPES, STYLE_CATEGORIES } from "../constants";

// Security & Business Hooks
import { useCredits } from "../hooks/useCredits";
import { useRoomGeneration } from "../hooks/useRoomGeneration";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

// Extracted UI Components
import Loader from "../components/Loader";
import Header from "../components/Header";
import { CustomAlertModal } from "../components/CustomAlertModal";
import { CameraModal } from "../components/CameraModal";
import { BeforeAfterSlider } from "../components/BeforeAfterSlider";
import { RoomTypeBottomSheet } from "../components/RoomTypeBottomSheet";
import {
  UploadIcon,
  CameraIcon,
  DownloadIcon,
  ShareIcon,
  ResetIcon,
  DecorateIcon,
  AccordionChevronIcon,
} from "../components/Icons";

// --- SUB-SYSTEM COMPONENT: IMAGE UPLOADER ---
const ImageUploader: React.FC<{ onImageSelected: (uri: string) => void }> = React.memo(({
  onImageSelected,
}) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const openImageGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "We need access to your photos!");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });
    if (!result.canceled) onImageSelected(result.assets[0].uri);
  };

  const openCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "We need access to your camera!");
      return;
    }
    setIsCameraOpen(true);
  };

  return (
    <View style={styles.uploadCard}>
      <CameraModal
        isVisible={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onPictureTaken={(uri) => {
          setIsCameraOpen(false);
          onImageSelected(uri);
        }}
      />
      <View style={styles.uploadIconContainer}>
        <UploadIcon style={{ width: 40, height: 40 }} color="#818CF8" />
      </View>
      <Text style={styles.uploadTitle}>Start Your Design</Text>
      <Text style={styles.uploadSubtitle}>
        Upload a photo of your room or take a new one to get started.
      </Text>

      <View style={styles.uploadActions}>
        <TouchableOpacity
          onPress={openImageGallery}
          style={[styles.actionButton, styles.primaryButton]}
        >
          <UploadIcon color="#FFF" />
          <Text style={styles.btnText}>Upload Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={openCamera}
          style={[styles.actionButton, styles.secondaryButton]}
        >
          <CameraIcon color="#FFF" />
          <Text style={styles.btnText}>Use Camera</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

// --- SUB-SYSTEM COMPONENT: INSPIRATION GALLERY ---
const INSPIRATION_IMAGES = [
  { id: "1", image: require("../assets/images/inspiration/living-room.jpg"), label: "Living Room" },
  { id: "2", image: require("../assets/images/inspiration/bedroom.jpg"), label: "Bedroom" },
  { id: "3", image: require("../assets/images/inspiration/kitchen.jpg"), label: "Kitchen" },
  { id: "4", image: require("../assets/images/inspiration/bathroom.jpg"), label: "Bathroom" },
];

const InspirationGallery: React.FC = React.memo(() => {
  return (
    <View style={styles.gallerySection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Get Inspired</Text>
        <Text style={styles.sectionSubtitle}>See what's possible</Text>
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

// --- SUB-SYSTEM COMPONENT: GENERATED IMAGE DISPLAY WITH VIRAL SLIDER ---
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
      await onRemoveWatermark();
    } finally {
      setIsRemovingWatermark(false);
    }
  };

  const handleDownload = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission needed", "We need permission to save photos.");
        return;
      }
      
      // Save directly from the current image state URI
      await MediaLibrary.saveToLibraryAsync(generatedImage);
      Alert.alert("Saved!", "Your design has been successfully saved to your library.");
    } catch (error) {
      Alert.alert("Error", "Failed to save image.");
    }
  };

  const handleShare = async () => {
    if (isSharing) return;
    setIsSharing(true);
    try {
      const shareMessage = "Check out this amazing room I designed with AI! 🚀✨\n\nDownload Ai Home Decorator now:\nhttps://play.google.com/store/apps/details?id=com.aihomedecorator.twa";
      
      if (Platform.OS === 'web') {
        if (navigator.share) {
          await navigator.share({
            title: "Share your dream room",
            text: shareMessage,
            url: generatedImage,
          });
        } else {
          Alert.alert("Share", "Sharing is not supported on this browser context.");
        }
      } else {
        const RNShare = require('react-native-share').default;
        await RNShare.open({
          title: "Share your dream room",
          message: shareMessage,
          url: generatedImage,
          type: "image/jpeg",
        });
      }
    } catch (error: any) {
      if (error.message !== "User did not share") console.error("Share error:", error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Animated.View entering={FadeInDown.duration(600).springify()} style={styles.resultContainer}>
      <Text style={styles.resultHeader}>Your New Space</Text>

      <View style={styles.watermarkWrapper}>
        <View style={{ padding: 10 }}>
          <BeforeAfterSlider beforeImage={sourceImage} afterImage={generatedImage} />
        </View>

        {!hasUnlockedHd && (
          <View style={styles.watermarkFooter}>
            <Text style={styles.watermarkText}>
              Transform your room at aihomedecorator.com (Get the app!)
            </Text>
          </View>
        )}
      </View>

      <View style={styles.resultActions}>
        <TouchableOpacity onPress={onReset} style={[styles.actionButton, styles.secondaryButton]}>
          <ResetIcon color="#FFF" />
          <Text style={styles.btnText}>Start Over</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDownload} style={[styles.actionButton, styles.primaryButton]}>
          <DownloadIcon color="#FFF" />
          <Text style={styles.btnText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare} style={[styles.actionButton, styles.accentButton]} disabled={isSharing}>
          <ShareIcon color="#FFF" />
          <Text style={styles.btnText}>{isSharing ? "..." : "Share"}</Text>
        </TouchableOpacity>
      </View>

      {!hasUnlockedHd && (
        <TouchableOpacity style={styles.upsellButton} onPress={handleRemoveWatermarkPress} disabled={isRemovingWatermark} activeOpacity={0.8}>
          <LinearGradient
            colors={["rgba(99, 102, 241, 0.2)", "rgba(217, 70, 239, 0.2)"]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={{ width: "100%", paddingVertical: 14, alignItems: "center", borderRadius: 14 }}
          >
            <Text style={styles.upsellButtonText}>
              {isRemovingWatermark ? "Processing..." : "✨ Remove Watermark & Save HD (1 Credit)"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

// --- SUB-SYSTEM COMPONENT: DESIGN CONFIGURATION WORKSPACE ---
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
  const [activeAccordion, setActiveAccordion] = useState<string | null>(STYLE_CATEGORIES[0].name);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  const handleDecoratePress = () => {
    if (!roomType) {
      Alert.alert("Action Required", "Please select a Room Type to continue.");
      return;
    }
    const decorationPrompt = decorMode === "style" ? selectedStyle?.prompt : customPrompt;
    const creditCost = decorMode === "style" ? 1 : 3;

    if (!decorationPrompt) {
      Alert.alert("Action Required", "Please select a style or enter a custom design description.");
      return;
    }
    onGenerate(decorationPrompt, roomType, creditCost);
  };

  return (
    <View style={styles.workspace}>
      <TouchableOpacity style={styles.homeSaleIndicator} onPress={onBuyCreditsNavigate}>
        <View style={styles.homeSaleTextContainer}>
          <Text style={styles.homeSaleTitle}>FLASH SALE: 50% OFF!</Text>
          <Text style={styles.homeSaleSubtitle}>All credit packs are half price.</Text>
        </View>
        <View style={styles.homeSaleButton}>
          <Text style={styles.homeSaleButtonText}>GET OFFER</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.stepBadge}><Text style={styles.stepText}>1</Text></View>
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
            onPress={() => setIsBottomSheetVisible(true)}
          >
            <Text style={[styles.customPickerText, !roomType && { color: "#94A3B8" }]}>
              {roomType || "Select Room Type..."}
            </Text>
            <AccordionChevronIcon color="#94A3B8" />
          </TouchableOpacity>

          <RoomTypeBottomSheet
            isVisible={isBottomSheetVisible}
            onClose={() => setIsBottomSheetVisible(false)}
            selectedValue={roomType}
            onSelect={setRoomType}
          />
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.stepBadge}><Text style={styles.stepText}>2</Text></View>
          <Text style={styles.cardTitle}>Design Style</Text>
        </View>

        <View style={styles.segmentedControl}>
          <TouchableOpacity style={[styles.segment, decorMode === "style" && styles.segmentActive]} onPress={() => setDecorMode("style")}>
            <Text style={[styles.segmentText, decorMode === "style" && styles.segmentTextActive]}>Presets</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.segment, decorMode === "custom" && styles.segmentActive]} onPress={() => setDecorMode("custom")}>
            <Text style={[styles.segmentText, decorMode === "custom" && styles.segmentTextActive]}>Custom</Text>
          </TouchableOpacity>
        </View>

        {decorMode === "style" ? (
          <View style={styles.styleList}>
            {STYLE_CATEGORIES.map((cat) => (
              <View key={cat.name} style={styles.accordion}>
                <TouchableOpacity style={styles.accordionHeader} onPress={() => setActiveAccordion(activeAccordion === cat.name ? null : cat.name)}>
                  <Text style={styles.accordionTitle}>{cat.name}</Text>
                  <AccordionChevronIcon color="#94A3B8" active={activeAccordion === cat.name} />
                </TouchableOpacity>

                {activeAccordion === cat.name && (
                  <View style={styles.styleGrid}>
                    {cat.styles.map((s) => (
                      <TouchableOpacity key={s.name} style={[styles.styleChip, selectedStyle?.name === s.name && styles.styleChipActive]} onPress={() => setSelectedStyle(s)}>
                        <Text style={[styles.styleChipText, selectedStyle?.name === s.name && styles.styleChipTextActive]}>{s.name}</Text>
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
              <Text style={styles.infoText}>Uses our premium AI model for highly detailed requests. (Costs 3 credits)</Text>
            </View>
            <TextInput
              style={styles.textArea}
              placeholder="Describe your dream room... (e.g. 'Cyberpunk living room with neon lights')"
              placeholderTextColor="#64748B" multiline value={customPrompt} onChangeText={setCustomPrompt} maxLength={250}
            />
            <Text style={styles.charCount}>{customPrompt.length}/250</Text>
          </View>
        )}
      </View>

      <View style={styles.generateSection}>
        <TouchableOpacity
          style={[styles.generateBtn, credits < (decorMode === "style" ? 1 : 3) && styles.generateBtnDisabled]}
          onPress={handleDecoratePress} activeOpacity={0.8}
        >
          <LinearGradient colors={["#6366F1", "#D946EF"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.generateBtnInner}>
            <DecorateIcon style={{ marginRight: 8 }} color="white" />
            <Text style={styles.generateBtnText}>Generate Design</Text>
            <View style={styles.creditBadge}>
              <Text style={styles.creditBadgeText}>{decorMode === "style" ? 1 : 3}</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
        <Text style={styles.balanceText}>You have {credits} credits available</Text>
      </View>
    </View>
  );
};

// --- CORE SYSTEM COMPONENT: HOMESCREEN ARCHITECT ---
const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [isCreditAlertVisible, setIsCreditAlertVisible] = useState(false);
  
  // Track premium high-resolution payload outputs independently
  const [activeDisplayImage, setActiveDisplayImage] = useState<string | null>(null);
  const [premiumHdBackupUrl, setPremiumHdBackupUrl] = useState<string | null>(null);
  const [hasUnlockedPremiumHd, setHasUnlockedPremiumHd] = useState(false);

  const { session, logout } = useAuth();
  const { credits, fetchCredits, deductCredits } = useCredits();
  
  // Destructure custom hook capabilities
  const { generateDesign, isLoading, error, resetGeneration } = useRoomGeneration();

  useFocusEffect(
    useCallback(() => {
      fetchCredits();
    }, [fetchCredits])
  );

  const handleResetWorkspace = () => {
    setSourceImage(null);
    setActiveDisplayImage(null);
    setPremiumHdBackupUrl(null);
    setHasUnlockedPremiumHd(false);
    resetGeneration();
  };

  const handleRemoveWatermarkInternal = async (): Promise<boolean> => {
    if (credits < 1) {
      setIsCreditAlertVisible(true);
      return false;
    }
    try {
      const { data, error: profileError } = await supabase
        .from("user_profiles")
        .select("generation_credits")
        .eq("id", session?.user?.id)
        .single();
        
      if (profileError) throw profileError;
      if (data.generation_credits < 1) {
        setIsCreditAlertVisible(true);
        return false;
      }
      
      const { error: updateError } = await supabase
        .from("user_profiles")
        .update({ generation_credits: data.generation_credits - 1 })
        .eq("id", session?.user?.id);
        
      if (updateError) throw updateError;
      
      deductCredits(1);
      
      // Swap displaying asset with premium non-watermarked buffer url dynamically
      if (premiumHdBackupUrl) {
        setActiveDisplayImage(premiumHdBackupUrl);
      }
      setHasUnlockedPremiumHd(true);
      
      Alert.alert("Success", "Watermark removed! You can now save or share the high-res image.");
      return true;
    } catch (err: any) {
      console.error("Remove watermark error:", err);
      Alert.alert("Error", "Failed to remove watermark. Please try again.");
      return false;
    }
  };

  if (isLoading) return <Loader />;

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <CustomAlertModal
        visible={isCreditAlertVisible}
        title="Out of Credits"
        message="You need more credits to continue decorating."
        onCancel={() => setIsCreditAlertVisible(false)}
        onConfirm={() => {
          setIsCreditAlertVisible(false);
          navigation.navigate("BuyCredits");
        }}
        confirmText="GET CREDITS"
      />

      <Header>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity onPress={() => navigation.navigate("Referral")} style={[styles.headerBtn, { backgroundColor: '#6366F1' }]}>
            <Text style={styles.headerBtnText}>🎁 Free Credits</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={logout} style={styles.headerBtn}>
            <Text style={styles.headerBtnText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {activeDisplayImage && sourceImage ? (
          <GeneratedImageDisplay
            sourceImage={sourceImage}
            generatedImage={activeDisplayImage}
            hasUnlockedHd={hasUnlockedPremiumHd}
            onReset={handleResetWorkspace}
            onRemoveWatermark={handleRemoveWatermarkInternal}
          />
        ) : !sourceImage ? (
          <>
            <ImageUploader onImageSelected={setSourceImage} />
            <InspirationGallery />
          </>
        ) : (
          <DesignWorkspace
            sourceImage={sourceImage}
            credits={credits}
            onReset={handleResetWorkspace}
            onBuyCreditsNavigate={() => navigation.navigate("BuyCredits")}
            onGenerate={async (prompt, roomType, cost) => {
              if (credits < cost) {
                setIsCreditAlertVisible(true);
                return;
              }
              
              // Direct hook call invocation
              const responseData = await generateDesign(sourceImage, prompt, roomType);
              
              if (responseData && typeof responseData === 'object') {
                setActiveDisplayImage(responseData.generatedImage);
                setPremiumHdBackupUrl(responseData.hdCleanImage);
                deductCredits(cost);
              } else if (responseData === true) {
                // Resilient fallback logic for backwards compatible service files
                deductCredits(cost);
              }
            }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// --- SYSTEM STYLING SPECIFICATIONS ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#050505" },
  scrollContent: { padding: 16, paddingBottom: 40 },
  headerBtn: {
    backgroundColor: "#334155",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  headerBtnText: { color: "#F8FAFC", fontSize: 12, fontWeight: "600" },
  customPickerButton: {
    backgroundColor: "#0F172A",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334155",
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 8,
  },
  customPickerText: { color: "#F8FAFC", fontSize: 15, fontWeight: "500" },
  errorBanner: {
    backgroundColor: "rgba(239,68,68,0.15)",
    borderColor: "#EF4444",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorText: { color: "#EF4444", textAlign: "center", fontSize: 14 },
  uploadCard: {
    backgroundColor: "rgba(30, 41, 59, 0.4)",
    borderRadius: 30,
    padding: 32,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(99, 102, 241, 0.4)",
    borderStyle: "dashed",
    marginTop: 20,
  },
  uploadIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(99,102,241,0.1)",
    justifyContext: "center",
    alignItems: "center",
    marginBottom: 16,
    justifyContent: 'center',
  },
  uploadTitle: { fontSize: 22, fontWeight: "700", color: "#F8FAFC", marginBottom: 8 },
  uploadSubtitle: { fontSize: 15, color: "#94A3B8", textAlign: "center", marginBottom: 24, lineHeight: 22 },
  uploadActions: { width: "100%", gap: 12 },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    borderRadius: 14,
    paddingHorizontal: 4,
  },
  primaryButton: { backgroundColor: "#6366F1" },
  secondaryButton: { backgroundColor: "#334155" },
  accentButton: { backgroundColor: "#8B5CF6" },
  btnText: { color: "#FFF", fontWeight: "600", fontSize: 14, marginLeft: 8 },
  gallerySection: { marginTop: 40 },
  sectionHeader: { marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: "#F8FAFC" },
  sectionSubtitle: { fontSize: 14, color: "#94A3B8", marginTop: 2 },
  galleryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  galleryCard: { width: "48%", aspectRatio: 1, borderRadius: 16, overflow: "hidden", backgroundColor: "#1E293B" },
  galleryImg: { width: "100%", height: "100%" },
  galleryOverlay: { position: "absolute", bottom: 0, width: "100%", padding: 8, backgroundColor: "rgba(0,0,0,0.6)" },
  galleryLabel: { color: "#FFF", fontSize: 13, fontWeight: "600", textAlign: "center" },
  workspace: { gap: 24 },
  card: {
    backgroundColor: "rgba(30, 41, 59, 0.4)",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  stepBadge: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#6366F1", justifyContent: "center", alignItems: "center", marginRight: 12 },
  stepText: { color: "#FFF", fontWeight: "bold", fontSize: 14 },
  cardTitle: { fontSize: 18, fontWeight: "700", color: "#F8FAFC" },
  previewContainer: { height: 200, borderRadius: 16, overflow: "hidden", marginBottom: 20, position: "relative" },
  previewImage: { width: "100%", height: "100%" },
  retakeBtn: { position: "absolute", bottom: 12, right: 12, backgroundColor: "rgba(0,0,0,0.7)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  retakeText: { color: "#FFF", fontSize: 12, fontWeight: "600" },
  inputContainer: {},
  inputLabel: { color: "#CBD5E1", fontSize: 14, fontWeight: "600", marginBottom: 8, marginLeft: 4 },
  segmentedControl: { flexDirection: "row", backgroundColor: "#0F172A", padding: 4, borderRadius: 12, marginBottom: 20 },
  segment: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: "center" },
  segmentActive: { backgroundColor: "#334155" },
  segmentText: { color: "#94A3B8", fontWeight: "600" },
  segmentTextActive: { color: "#F8FAFC" },
  styleList: { gap: 12 },
  accordion: { backgroundColor: "#0F172A", borderRadius: 12, overflow: "hidden" },
  accordionHeader: { flexDirection: "row", padding: 16, alignItems: "center", justifyContent: 'space-between' },
  accordionTitle: { color: "#F8FAFC", fontWeight: "600", fontSize: 15 },
  styleGrid: { flexDirection: "row", flexWrap: "wrap", padding: 12, gap: 10, paddingTop: 0 },
  styleChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 100, backgroundColor: "#1E293B", borderWidth: 1, borderColor: "#334155" },
  styleChipActive: { backgroundColor: "#6366F1", borderColor: "#6366F1" },
  styleChipText: { color: "#CBD5E1", fontSize: 13 },
  styleChipTextActive: { color: "#FFF", fontWeight: "700" },
  customInputContainer: {},
  infoBox: { backgroundColor: "rgba(139, 92, 246, 0.1)", padding: 12, borderRadius: 8, marginBottom: 16, borderWidth: 1, borderColor: "rgba(139, 92, 246, 0.3)" },
  infoTitle: { color: "#C4B5FD", fontSize: 14, fontStyle: 'normal', fontWeight: 'bold', marginBottom: 4 },
  infoText: { color: "#A78BFA", fontSize: 13 },
  textArea: { backgroundColor: "#0F172A", borderRadius: 16, padding: 16, color: "#F8FAFC", height: 120, textAlignVertical: "top", borderWidth: 1, borderColor: "#334155" },
  charCount: { color: "#64748B", fontSize: 12, textAlign: "right", marginTop: 8 },
  generateSection: { marginTop: 12, alignItems: "center" },
  generateBtn: { width: "100%", borderRadius: 16, overflow: "hidden" },
  generateBtnInner: { width: "100%", height: 60, flexDirection: "row", alignItems: "center", justifyContent: "center" },
  generateBtnDisabled: { opacity: 0.5 },
  generateBtnText: { color: "#FFF", fontSize: 18, fontWeight: "700" },
  creditBadge: { backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginLeft: 10 },
  creditBadgeText: { color: "#FFF", fontWeight: "bold", fontSize: 12 },
  balanceText: { color: "#94A3B8", marginTop: 16, fontSize: 14 },
  resultContainer: { alignItems: "center", marginTop: 20 },
  resultHeader: { fontSize: 28, fontWeight: "800", color: "#F8FAFC", marginBottom: 24 },
  resultActions: { flexDirection: "row", width: "100%", gap: 12, marginTop: 24 },
  watermarkWrapper: { backgroundColor: "#1E293B", borderRadius: 20, overflow: "hidden", width: "100%" },
  watermarkFooter: { backgroundColor: "#0F172A", paddingVertical: 12, paddingHorizontal: 5, alignItems: "center", justifyContent: "center", width: "100%" },
  watermarkText: { color: "#94A3B8", fontSize: 11, fontWeight: "600", textAlign: "center" },
  upsellButton: { marginTop: 16, overflow: "hidden", borderRadius: 14, width: "100%" },
  upsellButtonText: { color: "#818CF8", fontWeight: "700", fontSize: 15 },
  homeSaleIndicator: { backgroundColor: "rgba(99, 102, 241, 0.15)", borderWidth: 1, borderColor: "#6366F1", borderRadius: 16, padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  homeSaleTextContainer: { flex: 1 },
  homeSaleTitle: { color: "#818CF8", fontWeight: "900", fontSize: 15 },
  homeSaleSubtitle: { color: "#94A3B8", fontSize: 12, marginTop: 2 },
  homeSaleButton: { backgroundColor: "#6366F1", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, marginLeft: 12 },
  homeSaleButtonText: { color: "white", fontWeight: "bold", fontSize: 12 },
});

export default HomeScreen;