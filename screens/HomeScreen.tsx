import React, { useState, useRef } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { Style, StyleCategory } from "../types";
import { ROOM_TYPES, STYLE_CATEGORIES } from "../constants";
import * as geminiService from "../services/geminiService";
import Loader from "../components/Loader";
import {
  UploadIcon,
  CameraIcon,
  DownloadIcon,
  ShareIcon,
  ResetIcon,
  LogoIcon,
  DecorateIcon,
  AccordionChevronIcon,
} from "../components/Icons";
import { useAuth } from "../context/AuthContext";

// --- IMPORT: The new common Header ---
import Header from "../components/Header";

// Import Native Modules
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import { Camera, CameraView } from "expo-camera";

// --- DELETED: The old Header component definition is removed from here ---

const CameraModal: React.FC<{
  isVisible: boolean;
  onClose: () => void;
  onPictureTaken: (uri: string) => void;
}> = ({ isVisible, onClose, onPictureTaken }) => {
  const cameraRef = useRef<CameraView>(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      if (photo) {
        onPictureTaken(photo.uri);
      }
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: "black" }}>
        <CameraView style={{ flex: 1 }} facing="back" ref={cameraRef} />
        <View style={styles.cameraControls}>
          <TouchableOpacity onPress={onClose} style={styles.cameraButton}>
            <Text style={styles.cameraButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={takePicture}
            style={styles.cameraButtonCapture}
          />
          <View style={{ width: 80 }} />
        </View>
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
      Alert.alert(
        "Permission needed",
        "Sorry, we need camera roll permissions to make this work!"
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      onImageSelected(result.assets[0].uri);
    }
  };

  const openCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Sorry, we need camera permissions to make this work!"
      );
      return;
    }
    setIsCameraOpen(true);
  };

  const onPictureTaken = (uri: string) => {
    setIsCameraOpen(false);
    onImageSelected(uri);
  };

  return (
    <View style={styles.uploaderContainer}>
      <CameraModal
        isVisible={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onPictureTaken={onPictureTaken}
      />
      <Text style={styles.uploaderTitle}>Upload Your Space</Text>
      <Text style={styles.uploaderSubtitle}>
        Start by uploading a photo or taking one.
      </Text>
      <View style={styles.uploaderButtonContainer}>
        <TouchableOpacity
          onPress={openImageGallery}
          style={[styles.button, styles.buttonPrimary]}
        >
          <UploadIcon style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Upload Image</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={openCamera}
          style={[styles.button, styles.buttonSecondary]}
        >
          <CameraIcon style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>
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
      encoding: FileSystem.EncodingType.Base64,
    });
    return filename;
  };

  const handleDownload = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "We need permission to save photos to your gallery."
        );
        return;
      }

      const base64Data = generatedImage.split(",")[1];
      const fileUri = await saveImageToFile(base64Data);

      await MediaLibrary.saveToLibraryAsync(fileUri);
      Alert.alert(
        "Saved!",
        "Your new room has been saved to your photo gallery."
      );
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save image.");
    }
  };

  const handleShare = async () => {
    try {
      const base64Data = generatedImage.split(",")[1];
      const fileUri = await saveImageToFile(base64Data);

      await Share.share({
        title: "Check out my AI-decorated room!",
        url: fileUri,
      });
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.displayContainer}>
      <Text style={styles.displayTitle}>Your Redecorated Room!</Text>
      <View style={styles.displayGrid}>
        <View style={styles.displayColumn}>
          <Text style={styles.displaySubtitle}>Original</Text>
          <Image source={{ uri: sourceImage }} style={styles.displayImage} />
        </View>
        <View style={styles.displayColumn}>
          <Text style={styles.displaySubtitle}>Generated</Text>
          <Image source={{ uri: generatedImage }} style={styles.displayImage} />
        </View>
      </View>
      <View style={styles.displayActions}>
        <TouchableOpacity
          onPress={onReset}
          style={[styles.button, styles.buttonSecondary]}
        >
          <ResetIcon style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Start Over</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleDownload}
          style={[styles.button, styles.buttonPrimary]}
        >
          <DownloadIcon style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Download</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleShare}
          style={[styles.button, styles.buttonPurple]}
        >
          <ShareIcon style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Share</Text>
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
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [decorMode, setDecorMode] = useState<"style" | "custom">("style");
  const [activeAccordion, setActiveAccordion] = useState<string | null>(
    STYLE_CATEGORIES[0].name
  );
  const [credits, setCredits] = useState(119);

  const { logout } = useAuth();

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
      setError("Please upload an image first.");
      return;
    }

    const decorationPrompt =
      decorMode === "style" ? selectedStyle?.prompt : customPrompt;
    const creditCost = decorMode === "style" ? 1 : 3;

    if (!decorationPrompt) {
      setError("Please select a style or enter a custom design.");
      return;
    }
    if (credits < creditCost) {
      setError("Not enough credits to perform this action.");
      return;
    }

    setError(null);
    setIsLoading(true);
    setLoadingMessage("Redecorating your space...");

    try {
      const result = await geminiService.decorateRoom(
        sourceFileUri,
        decorationPrompt,
        roomType
      );
      setGeneratedImageUrl(result);
      setCredits((prev) => prev - creditCost);
    } catch (e: any) {
      setError(e.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  const renderContent = () => {
    if (isLoading) return null;

    if (generatedImageUrl && sourceImageUrl) {
      return (
        <GeneratedImageDisplay
          sourceImage={sourceImageUrl}
          generatedImage={generatedImageUrl}
          onReset={resetState}
        />
      );
    }

    if (!sourceImageUrl) {
      return (
        <View style={styles.uploaderArea}>
          <ImageUploader onImageSelected={handleImageSelect} />
        </View>
      );
    }

    const creditCost = decorMode === "style" ? 1 : 3;
    const isDecorateDisabled =
      (decorMode === "style" && !selectedStyle) ||
      (decorMode === "custom" && !customPrompt);

    return (
      <View style={styles.decorContainer}>
        <View style={styles.decorGrid}>
          <View style={styles.decorColumn}>
            <Text style={styles.decorTitle}>1. Upload & Describe</Text>
            <View>
              <Image
                source={{ uri: sourceImageUrl }}
                style={styles.decorImage}
              />
              <TouchableOpacity
                onPress={() => {
                  setSourceFileUri(null);
                  setSourceImageUrl(null);
                }}
                style={styles.changeImageButton}
              >
                <Text style={styles.changeImageButtonText}>Change</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Describe the room</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={roomType}
                  onValueChange={(itemValue) => setRoomType(itemValue)}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                >
                  <Picker.Item label="-- Select Room Type --" value="" />
                  {ROOM_TYPES.map((type) => (
                    <Picker.Item key={type} label={type} value={type} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>

          <View style={styles.decorColumn}>
            <View style={styles.tabsContainer}>
              <TouchableOpacity
                onPress={() => setDecorMode("style")}
                style={[styles.tab, decorMode === "style" && styles.tabActive]}
              >
                <Text
                  style={[
                    styles.tabText,
                    decorMode === "style" && styles.tabTextActive,
                  ]}
                >
                  Choose a Style
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setDecorMode("custom")}
                style={[styles.tab, decorMode === "custom" && styles.tabActive]}
              >
                <Text
                  style={[
                    styles.tabText,
                    decorMode === "custom" && styles.tabTextActive,
                  ]}
                >
                  Custom Design
                </Text>
              </TouchableOpacity>
            </View>

            {decorMode === "style" ? (
              <View>
                <Text style={styles.decorTitle}>2. Choose a Style</Text>
                <View>
                  {STYLE_CATEGORIES.map((category) => (
                    <View key={category.name} style={styles.accordionItem}>
                      <TouchableOpacity
                        onPress={() =>
                          setActiveAccordion(
                            activeAccordion === category.name
                              ? null
                              : category.name
                          )
                        }
                        style={styles.accordionHeader}
                      >
                        <Text style={styles.accordionHeaderText}>
                          {category.name}
                        </Text>
                        <AccordionChevronIcon
                          style={styles.accordionIcon}
                          active={activeAccordion === category.name}
                        />
                      </TouchableOpacity>
                      {activeAccordion === category.name && (
                        <View style={styles.accordionBody}>
                          {category.styles.map((style) => (
                            <TouchableOpacity
                              key={style.name}
                              onPress={() => setSelectedStyle(style)}
                              style={[
                                styles.styleButton,
                                selectedStyle?.name === style.name &&
                                  styles.styleButtonActive,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.styleButtonText,
                                  selectedStyle?.name === style.name &&
                                    styles.styleButtonTextActive,
                                ]}
                              >
                                {style.name}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              <View>
                <View style={styles.creditsNote}>
                  <Text style={styles.creditsNoteText}>
                    Note: Custom designs require 3 credits per generation.
                  </Text>
                </View>
                <Text style={styles.decorTitle}>2. Describe Your Design</Text>
                <Text style={styles.label}>
                  Be descriptive! "A modern, white kitchen..."
                </Text>
                <TextInput
                  value={customPrompt}
                  onChangeText={setCustomPrompt}
                  placeholder="e.g., Add a red velvet sofa, hardwood floors..."
                  placeholderTextColor="#9CA3AF"
                  style={styles.textInput}
                  multiline={true}
                  numberOfLines={5}
                  maxLength={200}
                />
                <Text style={styles.charCount}>{customPrompt.length}/200</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.footerActions}>
          <TouchableOpacity
            onPress={handleDecorate}
            disabled={isDecorateDisabled}
            style={[
              styles.decorateButton,
              isDecorateDisabled && styles.decorateButtonDisabled,
            ]}
          >
            <DecorateIcon style={styles.decorateButtonIcon} />
            <Text style={styles.decorateButtonText}>
              Decorate ({creditCost} Credit{creditCost > 1 ? "s" : ""})
            </Text>
          </TouchableOpacity>
          <Text style={styles.creditsText}>Credits remaining: {credits}</Text>
        </View>
      </View>
    );
  };

  return (
    // --- MODIFIED: Use `edges` prop to avoid top padding ---
    <SafeAreaView
      style={styles.appContainer}
      edges={["bottom", "left", "right"]}
    >
      {isLoading && <Loader message={loadingMessage} />}
      {/* --- MODIFIED: Use new Header and pass buttons as children --- */}
      <Header>
        <View style={styles.authButtonsContainer}>
          <TouchableOpacity
            style={styles.aboutButton}
            onPress={() => navigation.navigate("About")}
          >
            <Text style={styles.aboutButtonText}>About</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Header>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

// --- STYLES ---
const { width } = Dimensions.get("window");
const isSmallScreen = width < 768;

const styles = StyleSheet.create({
  // --- DELETED: Header styles are moved to components/Header.tsx ---
  // ... (header, headerNav, headerLogoContainer, etc. are gone) ...

  // --- ADDED: Styles for the buttons passed to the header ---
  authButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  aboutButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  aboutButtonText: {
    color: "#D1D5DB",
    fontWeight: "600",
    fontSize: 14,
  },
  logoutButton: {
    backgroundColor: "#DC2626",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },

  // --- All other styles remain the same ---
  cameraControls: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 30,
    paddingVertical: 30,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  cameraButton: {
    padding: 10,
  },
  cameraButtonText: {
    color: "white",
    fontSize: 16,
  },
  cameraButtonCapture: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white",
    borderColor: "#CCC",
    borderWidth: 5,
  },
  appContainer: {
    flex: 1,
    backgroundColor: "#111827",
  },
  scrollContainer: {
    paddingBottom: 48,
    paddingHorizontal: 16,
  },
  uploaderArea: {
    marginTop: 48,
  },
  uploaderContainer: {
    maxWidth: 600,
    alignSelf: "center",
    width: "100%",
    padding: 32,
    borderWidth: 2,
    borderColor: "#4B5563",
    borderStyle: "dashed",
    borderRadius: 16,
    backgroundColor: "rgba(31, 41, 55, 0.5)",
    alignItems: "center",
  },
  uploaderTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "white",
    marginBottom: 8,
  },
  uploaderSubtitle: {
    color: "#9CA3AF",
    marginBottom: 24,
    textAlign: "center",
  },
  uploaderButtonContainer: {
    flexDirection: isSmallScreen ? "column" : "row",
    gap: 16,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  buttonPrimary: {
    backgroundColor: "#4F46E5",
  },
  buttonSecondary: {
    backgroundColor: "#4B5563",
  },
  buttonPurple: {
    backgroundColor: "#7C3AED",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
  buttonIcon: {
    color: "white",
  },
  displayContainer: {
    maxWidth: 1024,
    width: "100%",
    alignSelf: "center",
    marginTop: 32,
  },
  displayTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 24,
  },
  displayGrid: {
    flexDirection: isSmallScreen ? "column" : "row",
    gap: 32,
  },
  displayColumn: {
    flex: 1,
  },
  displaySubtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#D1D5DB",
    textAlign: "center",
    marginBottom: 8,
  },
  displayImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
  },
  displayActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "center",
    marginTop: 32,
  },
  decorContainer: {
    maxWidth: 1152,
    width: "100%",
    alignSelf: "center",
    marginTop: 32,
    backgroundColor: "rgba(31, 41, 55, 0.5)",
    borderRadius: 16,
    padding: isSmallScreen ? 16 : 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  decorGrid: {
    flexDirection: isSmallScreen ? "column" : "row",
    gap: 32,
  },
  decorColumn: {
    flex: 1,
    gap: 16,
  },
  decorTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  decorImage: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 12,
  },
  changeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  changeImageButtonText: {
    color: "white",
    fontSize: 12,
  },
  pickerContainer: {
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#D1D5DB",
    marginBottom: 8,
  },
  pickerWrapper: {
    backgroundColor: "#374151",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4B5563",
    overflow: "hidden",
  },
  picker: {
    color: "white",
    ...Platform.select({
      ios: {
        height: 120,
      },
      android: {
        height: 50,
      },
    }),
  },
  pickerItem: {
    color: "white",
    backgroundColor: "#374151",
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(17, 24, 39, 0.5)",
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
  },
  tabActive: {
    backgroundColor: "#4F46E5",
  },
  tabText: {
    color: "#D1D5DB",
    textAlign: "center",
    fontWeight: "600",
  },
  tabTextActive: {
    color: "white",
  },
  accordionItem: {
    marginBottom: 8,
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "rgba(55, 65, 81, 0.8)",
    borderRadius: 8,
  },
  accordionHeaderText: {
    color: "white",
    fontWeight: "600",
  },
  accordionIcon: {
    color: "white",
  },
  accordionBody: {
    padding: 16,
    backgroundColor: "rgba(17, 24, 39, 0.3)",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  styleButton: {
    backgroundColor: "#4B5563",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  styleButtonActive: {
    backgroundColor: "#4F46E5",
  },
  styleButtonText: {
    color: "#E5E7EB",
    fontSize: 14,
  },
  styleButtonTextActive: {
    color: "white",
  },
  creditsNote: {
    backgroundColor: "rgba(168, 85, 247, 0.1)",
    borderColor: "rgba(168, 85, 247, 0.3)",
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  creditsNoteText: {
    color: "#D8B4FE",
    fontSize: 12,
    textAlign: "center",
  },
  textInput: {
    backgroundColor: "#374151",
    color: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4B5563",
    padding: 12,
    minHeight: 120,
    textAlignVertical: "top",
  },
  charCount: {
    color: "#6B7280",
    fontSize: 12,
    textAlign: "right",
    marginTop: 4,
  },
  footerActions: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderColor: "#374151",
    alignItems: "center",
  },
  decorateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 40,
    backgroundColor: "#4F46E5",
    borderRadius: 8,
    gap: 8,
  },
  decorateButtonDisabled: {
    backgroundColor: "#4B5563",
  },
  decorateButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  decorateButtonIcon: {
    color: "white",
  },
  creditsText: {
    color: "#9CA3AF",
    fontSize: 14,
    marginTop: 12,
  },
  errorBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    borderColor: "rgba(239, 68, 68, 0.5)",
    borderWidth: 1,
    borderRadius: 8,
  },
  errorText: {
    color: "#F87171",
    textAlign: "center",
    fontSize: 14,
  },
});

export default HomeScreen;
