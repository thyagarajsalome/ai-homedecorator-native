import React, { useState, useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Share,
  TextInput,
  Dimensions,
  Platform,
  Modal,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "@react-navigation/native";
import { Style } from "../types";
import { ROOM_TYPES, STYLE_CATEGORIES } from "../constants";
import * as geminiService from "../services/geminiService";
import Loader from "../components/Loader";
import {
  UploadIcon,
  CameraIcon,
  DownloadIcon,
  ShareIcon,
  ResetIcon,
  DecorateIcon,
  AccordionChevronIcon,
} from "../components/Icons";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import { supabase } from "../lib/supabase";

import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system/legacy";
import { CameraView, Camera } from "expo-camera";

const { width } = Dimensions.get("window");
const isSmallScreen = width < 768;

// --- Components ---

const CameraModal: React.FC<{
  isVisible: boolean;
  onClose: () => void;
  onPictureTaken: (uri: string) => void;
}> = ({ isVisible, onClose, onPictureTaken }) => {
  const cameraRef = useRef<CameraView>(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.5 });
      if (photo) onPictureTaken(photo.uri);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        <CameraView style={{ flex: 1 }} facing="back" ref={cameraRef} />
        <SafeAreaView style={styles.cameraOverlay}>
          <TouchableOpacity onPress={onClose} style={styles.cameraCloseBtn}>
            <Text style={styles.cameraCloseText}>Cancel</Text>
          </TouchableOpacity>
          <View style={styles.cameraBottomBar}>
            <TouchableOpacity
              onPress={takePicture}
              style={styles.shutterButton}
            >
              <View style={styles.shutterInner} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const ImageUploader: React.FC<{ onImageSelected: (uri: string) => void }> = ({
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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

  const onPictureTaken = (uri: string) => {
    setIsCameraOpen(false);
    onImageSelected(uri);
  };

  return (
    <View style={styles.uploadCard}>
      <CameraModal
        isVisible={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onPictureTaken={onPictureTaken}
      />
      <View style={styles.uploadIconContainer}>
        <UploadIcon style={{ width: 40, height: 40, color: "#818CF8" }} />
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
          <UploadIcon style={styles.btnIcon} />
          <Text style={styles.btnText}>Upload Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={openCamera}
          style={[styles.actionButton, styles.secondaryButton]}
        >
          <CameraIcon style={styles.btnIcon} />
          <Text style={styles.btnText}>Use Camera</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// --- IMAGES ---
// Ensure these files exist in assets/images/inspiration/
const INSPIRATION_IMAGES = [
  {
    id: "1",
    image: require("../assets/images/inspiration/living-room.jpg"),
    label: "Living Room",
  },
  {
    id: "2",
    image: require("../assets/images/inspiration/bedroom.jpg"),
    label: "Bedroom",
  },
  {
    id: "3",
    image: require("../assets/images/inspiration/kitchen.jpg"),
    label: "Kitchen",
  },
  {
    id: "4",
    image: require("../assets/images/inspiration/bathroom.jpg"),
    label: "Bathroom",
  },
];

const InspirationGallery: React.FC = () => {
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
};

const GeneratedImageDisplay: React.FC<{
  sourceImage: string;
  generatedImage: string;
  onReset: () => void;
}> = ({ sourceImage, generatedImage, onReset }) => {
  const saveImageToFile = async (base64Data: string): Promise<string> => {
    const filename = FileSystem.cacheDirectory + `decorated-${Date.now()}.jpg`;
    await FileSystem.writeAsStringAsync(filename, base64Data, {
      encoding: "base64",
    });
    return filename;
  };

  const handleDownload = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission needed", "We need permission to save photos.");
        return;
      }
      const base64Data = generatedImage.split(",")[1];
      const fileUri = await saveImageToFile(base64Data);
      await MediaLibrary.saveToLibraryAsync(fileUri);
      Alert.alert("Saved!", "Your new design has been saved to your gallery.");
    } catch (error) {
      Alert.alert("Error", "Failed to save image.");
    }
  };

  const handleShare = async () => {
    try {
      const base64Data = generatedImage.split(",")[1];
      const fileUri = await saveImageToFile(base64Data);
      await Share.share({ title: "My AI Room Design", url: fileUri });
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.resultContainer}>
      <Text style={styles.resultHeader}>Your New Space</Text>
      <View style={styles.imageComparison}>
        <View style={styles.imageWrapper}>
          <View style={styles.imageBadge}>
            <Text style={styles.badgeText}>Original</Text>
          </View>
          <Image source={{ uri: sourceImage }} style={styles.resultImg} />
        </View>
        <View style={styles.imageWrapper}>
          <View style={[styles.imageBadge, { backgroundColor: "#6366F1" }]}>
            <Text style={styles.badgeText}>AI Design</Text>
          </View>
          <Image source={{ uri: generatedImage }} style={styles.resultImg} />
        </View>
      </View>

      <View style={styles.resultActions}>
        <TouchableOpacity
          onPress={onReset}
          style={[styles.actionButton, styles.secondaryButton]}
        >
          <ResetIcon style={styles.btnIcon} />
          <Text style={styles.btnText}>Start Over</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleDownload}
          style={[styles.actionButton, styles.primaryButton]}
        >
          <DownloadIcon style={styles.btnIcon} />
          <Text style={styles.btnText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleShare}
          style={[styles.actionButton, styles.accentButton]}
        >
          <ShareIcon style={styles.btnIcon} />
          <Text style={styles.btnText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [sourceFileUri, setSourceFileUri] = useState<string | null>(null);
  const [sourceImageUrl, setSourceImageUrl] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(
    null
  );
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [roomType, setRoomType] = useState<string>("");
  const [selectedStyle, setSelectedStyle] = useState<Style | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [decorMode, setDecorMode] = useState<"style" | "custom">("style");
  const [activeAccordion, setActiveAccordion] = useState<string | null>(
    STYLE_CATEGORIES[0].name
  );
  const [credits, setCredits] = useState(0);
  const { session, logout } = useAuth();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchCredits = async () => {
        if (!session?.user) return;
        try {
          const { data } = await supabase
            .from("user_profiles")
            .select("generation_credits")
            .eq("id", session.user.id)
            .single();
          if (data && isActive) setCredits(data.generation_credits);
        } catch (err) {
          console.log("Error fetching credits:", err);
        }
      };
      fetchCredits();
      return () => {
        isActive = false;
      };
    }, [session])
  );

  const handleImageSelect = (uri: string) => {
    setSourceFileUri(uri);
    setSourceImageUrl(uri);
    setGeneratedImageUrl(null);
  };

  const resetState = () => {
    setSourceFileUri(null);
    setSourceImageUrl(null);
    setGeneratedImageUrl(null);
    setCustomPrompt("");
    setSelectedStyle(null);
    setError(null);
    setDecorMode("style");
    setRoomType("");
  };

  const handleDecorate = async () => {
    if (!sourceFileUri) {
      Alert.alert("Action Required", "Please upload an image first.");
      return;
    }

    if (!roomType) {
      Alert.alert(
        "Action Required",
        "Please select a Room Type (e.g., Living Room) to continue."
      );
      return;
    }

    const decorationPrompt =
      decorMode === "style" ? selectedStyle?.prompt : customPrompt;
    const creditCost = decorMode === "style" ? 1 : 3;

    if (!decorationPrompt) {
      Alert.alert(
        "Action Required",
        "Please select a style or enter a custom design description."
      );
      return;
    }

    if (credits < creditCost) {
      Alert.alert(
        "Out of Credits",
        "You need more credits to continue decorating.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Get Credits",
            onPress: () => Linking.openURL("https://aihomedecorator.com/"),
          },
        ]
      );
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const result = await geminiService.decorateRoom(
        sourceFileUri,
        decorationPrompt,
        roomType
      );
      setGeneratedImageUrl(result);
      setCredits((prev) => Math.max(0, prev - creditCost));
    } catch (e: any) {
      const errorMessage = e.message || "An unknown error occurred.";
      if (
        errorMessage.includes("Invalid or expired token") ||
        errorMessage.includes("JWT")
      ) {
        Alert.alert("Session Expired", "Please log in again.", [
          { text: "Logout", onPress: logout },
        ]);
        setError("Session expired. Please login again.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loader />;
  if (generatedImageUrl && sourceImageUrl) {
    return (
      <SafeAreaView
        style={styles.container}
        edges={["bottom", "left", "right"]}
      >
        <Header />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <GeneratedImageDisplay
            sourceImage={sourceImageUrl}
            generatedImage={generatedImageUrl}
            onReset={resetState}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <Header>
        <TouchableOpacity onPress={logout} style={styles.headerBtn}>
          <Text style={styles.headerBtnText}>Log Out</Text>
        </TouchableOpacity>
      </Header>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {!sourceImageUrl ? (
          <>
            <ImageUploader onImageSelected={handleImageSelect} />
            <InspirationGallery />
          </>
        ) : (
          <View style={styles.workspace}>
            {/* Step 1: Image Preview & Type */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepText}>1</Text>
                </View>
                <Text style={styles.cardTitle}>Your Room</Text>
              </View>

              <View style={styles.previewContainer}>
                <Image
                  source={{ uri: sourceImageUrl }}
                  style={styles.previewImage}
                />
                <TouchableOpacity onPress={resetState} style={styles.retakeBtn}>
                  <Text style={styles.retakeText}>Change Photo</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Room Type</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={roomType}
                    onValueChange={setRoomType}
                    style={styles.picker}
                    itemStyle={{ color: "white" }}
                    dropdownIconColor="white"
                  >
                    <Picker.Item
                      label="Select Room Type..."
                      value=""
                      enabled={false}
                    />
                    {ROOM_TYPES.map((t) => (
                      <Picker.Item key={t} label={t} value={t} />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>

            {/* Step 2: Style Selection */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepText}>2</Text>
                </View>
                <Text style={styles.cardTitle}>Design Style</Text>
              </View>

              <View style={styles.segmentedControl}>
                <TouchableOpacity
                  style={[
                    styles.segment,
                    decorMode === "style" && styles.segmentActive,
                  ]}
                  onPress={() => setDecorMode("style")}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      decorMode === "style" && styles.segmentTextActive,
                    ]}
                  >
                    Presets
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.segment,
                    decorMode === "custom" && styles.segmentActive,
                  ]}
                  onPress={() => setDecorMode("custom")}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      decorMode === "custom" && styles.segmentTextActive,
                    ]}
                  >
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
                        onPress={() =>
                          setActiveAccordion(
                            activeAccordion === cat.name ? null : cat.name
                          )
                        }
                      >
                        <Text style={styles.accordionTitle}>{cat.name}</Text>
                        <AccordionChevronIcon
                          style={{ color: "#94A3B8" }}
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
                                selectedStyle?.name === s.name &&
                                  styles.styleChipActive,
                              ]}
                              onPress={() => setSelectedStyle(s)}
                            >
                              <Text
                                style={[
                                  styles.styleChipText,
                                  selectedStyle?.name === s.name &&
                                    styles.styleChipTextActive,
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
                    <Text style={styles.infoText}>
                      ✨ Custom designs cost 3 credits.
                    </Text>
                  </View>
                  <TextInput
                    style={styles.textArea}
                    placeholder="Describe your dream room... (e.g. 'Cyberpunk living room with neon lights')"
                    placeholderTextColor="#64748B"
                    multiline
                    value={customPrompt}
                    onChangeText={setCustomPrompt}
                    maxLength={250}
                  />
                  <Text style={styles.charCount}>
                    {customPrompt.length}/250
                  </Text>
                </View>
              )}
            </View>

            {/* Floating Action Footer */}
            <View style={styles.generateSection}>
              <TouchableOpacity
                style={styles.generateBtn}
                onPress={handleDecorate}
              >
                <DecorateIcon style={{ color: "white", marginRight: 8 }} />
                <Text style={styles.generateBtnText}>Generate Design</Text>
                <View style={styles.creditBadge}>
                  <Text style={styles.creditBadgeText}>
                    {decorMode === "style" ? 1 : 3}
                  </Text>
                </View>
              </TouchableOpacity>
              <Text style={styles.balanceText}>
                You have {credits} credits available
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A" },
  scrollContent: { padding: 16, paddingBottom: 40 },
  headerBtn: {
    backgroundColor: "#334155",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  headerBtnText: { color: "#F8FAFC", fontSize: 12, fontWeight: "600" },

  // Error
  errorBanner: {
    backgroundColor: "rgba(239,68,68,0.15)",
    borderColor: "#EF4444",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorText: { color: "#EF4444", textAlign: "center", fontSize: 14 },

  // Upload Card
  uploadCard: {
    backgroundColor: "#1E293B",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#334155",
    borderStyle: "dashed",
    marginTop: 20,
  },
  uploadIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(99,102,241,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  uploadTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#F8FAFC",
    marginBottom: 8,
  },
  uploadSubtitle: {
    fontSize: 15,
    color: "#94A3B8",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  uploadActions: { width: "100%", gap: 12 },

  // Common Buttons
  actionButton: {
    flex: 1, // --- FIXED: Ensures equal width for all buttons
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
  btnIcon: { color: "#FFF" },

  // Gallery
  gallerySection: { marginTop: 40 },
  sectionHeader: { marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: "#F8FAFC" },
  sectionSubtitle: { fontSize: 14, color: "#94A3B8", marginTop: 2 },
  galleryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  galleryCard: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#1E293B",
  },
  galleryImg: { width: "100%", height: "100%" },
  galleryOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  galleryLabel: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },

  // Workspace
  workspace: { gap: 24 },
  card: {
    backgroundColor: "#1E293B",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#334155",
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  stepText: { color: "#FFF", fontWeight: "bold", fontSize: 14 },
  cardTitle: { fontSize: 18, fontWeight: "700", color: "#F8FAFC" },

  previewContainer: {
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    position: "relative",
  },
  previewImage: { width: "100%", height: "100%" },
  retakeBtn: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  retakeText: { color: "#FFF", fontSize: 12, fontWeight: "600" },

  inputContainer: {},
  inputLabel: {
    color: "#CBD5E1",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 4,
  },
  pickerContainer: {
    backgroundColor: "#0F172A",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334155",
    overflow: "hidden",
  },
  picker: { color: "#FFF", height: Platform.OS === "ios" ? 120 : 50 },

  // Segmented Control
  segmentedControl: {
    flexDirection: "row",
    backgroundColor: "#0F172A",
    padding: 4,
    borderRadius: 12,
    marginBottom: 20,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  segmentActive: { backgroundColor: "#334155" },
  segmentText: { color: "#94A3B8", fontWeight: "600" },
  segmentTextActive: { color: "#F8FAFC" },

  // Style Grid
  styleList: { gap: 12 },
  accordion: {
    backgroundColor: "#0F172A",
    borderRadius: 12,
    overflow: "hidden",
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "center",
  },
  accordionTitle: { color: "#F8FAFC", fontWeight: "600", fontSize: 15 },
  styleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 12,
    gap: 10,
    paddingTop: 0,
  },
  styleChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: "#1E293B",
    borderWidth: 1,
    borderColor: "#334155",
  },
  styleChipActive: { backgroundColor: "#6366F1", borderColor: "#6366F1" },
  styleChipText: { color: "#CBD5E1", fontSize: 13 },
  styleChipTextActive: { color: "#FFF", fontWeight: "700" },

  // Custom Input
  customInputContainer: {},
  infoBox: {
    backgroundColor: "rgba(139, 92, 246, 0.1)",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.3)",
  },
  infoText: { color: "#C4B5FD", fontSize: 13, textAlign: "center" },
  textArea: {
    backgroundColor: "#0F172A",
    borderRadius: 16,
    padding: 16,
    color: "#F8FAFC",
    height: 120,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#334155",
  },
  charCount: {
    color: "#64748B",
    fontSize: 12,
    textAlign: "right",
    marginTop: 8,
  },

  // Generate Footer
  generateSection: { marginTop: 12, alignItems: "center" },
  generateBtn: {
    width: "100%",
    backgroundColor: "#6366F1",
    height: 56,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6366F1",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  generateBtnDisabled: {
    backgroundColor: "#334155",
    shadowOpacity: 0,
    elevation: 0,
  },
  generateBtnText: { color: "#FFF", fontSize: 18, fontWeight: "700" },
  creditBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 10,
  },
  creditBadgeText: { color: "#FFF", fontWeight: "bold", fontSize: 12 },
  balanceText: { color: "#94A3B8", marginTop: 16, fontSize: 14 },

  // Results
  resultContainer: { alignItems: "center", marginTop: 20 },
  resultHeader: {
    fontSize: 28,
    fontWeight: "800",
    color: "#F8FAFC",
    marginBottom: 24,
  },
  imageComparison: { width: "100%", gap: 20 },
  imageWrapper: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#1E293B",
    position: "relative",
  },
  resultImg: { width: "100%", aspectRatio: 1 },
  imageBadge: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    zIndex: 10,
  },
  badgeText: { color: "#FFF", fontSize: 12, fontWeight: "bold" },
  resultActions: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
    marginTop: 24,
  },

  // Camera Modal
  cameraOverlay: { flex: 1, justifyContent: "space-between", padding: 20 },
  cameraCloseBtn: {
    alignSelf: "flex-end",
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
  },
  cameraCloseText: { color: "#FFF", fontWeight: "600" },
  cameraBottomBar: { alignItems: "center", marginBottom: 20 },
  shutterButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFF",
  },
});

export default HomeScreen;
