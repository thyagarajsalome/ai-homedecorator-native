import React, { useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Business Logic Hooks
import { useCredits } from "../hooks/useCredits";
import { useRoomGeneration } from "../hooks/useRoomGeneration";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

// UI Components
import Loader from "../components/Loader";
import Header from "../components/Header";
import { CustomAlertModal } from "../components/CustomAlertModal";
import { CelebrationModal } from "../components/CelebrationModal";
import { StoreModal } from "../components/StoreModal";

// Workspace Sub-Components (extracted from HomeScreen for clean architecture)
import ImageUploader from "../components/workspace/ImageUploader";
import InspirationGallery from "../components/workspace/InspirationGallery";
import GeneratedImageDisplay from "../components/workspace/GeneratedImageDisplay";
import DesignWorkspace from "../components/workspace/DesignWorkspace";

// Design Tokens
import { Colors, Typography, Spacing, BorderRadius } from "../theme/designTokens";

// ============================================================
// HomeScreen — Root Orchestrator
// Owns no UI state beyond which "phase" the user is in.
// All rendering is delegated to the workspace sub-components.
// ============================================================
const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 375;

  // Phase State
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [isCreditAlertVisible, setIsCreditAlertVisible] = useState(false);
  const [isCelebrationVisible, setIsCelebrationVisible] = useState(false);
  const [isStoreVisible, setIsStoreVisible] = useState(false);

  // Premium HD tracking
  const [activeDisplayImage, setActiveDisplayImage] = useState<string | null>(null);
  const [premiumHdBackupUrl, setPremiumHdBackupUrl] = useState<string | null>(null);
  const [hasUnlockedPremiumHd, setHasUnlockedPremiumHd] = useState(false);
  const [generationStyleName, setGenerationStyleName] = useState<string>("Modern");

  // Auth & Business Logic
  const { session, logout } = useAuth();
  const { credits, fetchCredits, deductCredits, addCredits } = useCredits();
  const { generateDesign, isLoading, error, resetGeneration } = useRoomGeneration();

  // Track previous credits value to watch for drop to 0
  const prevCreditsRef = React.useRef<number | null>(null);

  // Re-fetch credits every time user navigates back to this screen
  useFocusEffect(
    useCallback(() => {
      fetchCredits();
    }, [fetchCredits])
  );

  // Check and trigger sign-in celebration if eligible
  useEffect(() => {
    const checkCelebration = async () => {
      if (session?.user?.id) {
        const celebratedKey = `celebrated_sign_in_${session.user.id}`;
        const hasCelebrated = await AsyncStorage.getItem(celebratedKey);
        if (!hasCelebrated) {
          setIsCelebrationVisible(true);
          await AsyncStorage.setItem(celebratedKey, "true");
        }
      }
    };
    checkCelebration();
  }, [session?.user?.id]);

  // Watch for credits dropping to exactly 0 to notify the user
  useEffect(() => {
    if (prevCreditsRef.current !== null && prevCreditsRef.current > 0 && credits === 0) {
      Alert.alert(
        "Out of Credits 🪙",
        "You have used your last design credit! To keep designing and modifying your rooms, you can buy more credits anytime.",
        [
          { text: "View Pricing", onPress: () => setIsStoreVisible(true) },
          { text: "Dismiss", style: "cancel" }
        ]
      );
    }
    prevCreditsRef.current = credits;
  }, [credits]);

  // ---- Handlers ----

  const handleResetWorkspace = () => {
    setSourceImage(null);
    setActiveDisplayImage(null);
    setPremiumHdBackupUrl(null);
    setHasUnlockedPremiumHd(false);
    resetGeneration();
  };

  const handleGenerate = async (prompt: string, roomType: string, cost: number, styleName: string) => {
    if (credits < cost) {
      setIsStoreVisible(true);
      return;
    }

    setGenerationStyleName(styleName);
    const result = await generateDesign(sourceImage!, prompt, roomType);

    if (result !== false) {
      setActiveDisplayImage(result.generatedImage);
      setPremiumHdBackupUrl(result.hdCleanImage);
      deductCredits(cost);
    }
  };

  const handleRemoveWatermark = async (): Promise<boolean> => {
    if (credits < 1) {
      setIsStoreVisible(true);
      return false;
    }
    try {
      // Call the secure server-side RPC to check and deduct 1 credit
      const { data, error: rpcError } = await supabase.rpc('secure_deduct_credits', { 
        cost_amount: 1 
      });

      if (rpcError) {
        if (rpcError.message?.includes('Insufficient credits')) {
          setIsStoreVisible(true);
        } else {
          throw rpcError;
        }
        return false;
      }

      // Sync local credits state
      if (data && typeof data.current_credits === 'number') {
        fetchCredits(); // Fetch latest from DB to ensure sync
      } else {
        deductCredits(1);
      }

      if (premiumHdBackupUrl) {
        setActiveDisplayImage(premiumHdBackupUrl);
      }
      setHasUnlockedPremiumHd(true);

      Alert.alert(
        "Watermark Removed! ✨",
        "You can now save or share the full HD image."
      );
      return true;
    } catch (err: any) {
      console.error("Remove watermark error:", err);
      Alert.alert("Error", "Failed to remove watermark. Please try again.");
      return false;
    }
  };

  // Show loading overlay during AI generation
  if (isLoading) return <Loader />;

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      {/* Out-of-Credits Modal */}
      <CustomAlertModal
        visible={isCreditAlertVisible}
        title="Out of Credits"
        message="Your free 2-generation registration allowance has been fully exhausted."
        onCancel={() => setIsCreditAlertVisible(false)}
        onConfirm={() => setIsCreditAlertVisible(false)}
        confirmText="OK"
      />

      {/* User Celebration Modal */}
      <CelebrationModal
        isVisible={isCelebrationVisible}
        onClose={() => setIsCelebrationVisible(false)}
      />

      {/* Credit Store Modal */}
      <StoreModal
        isVisible={isStoreVisible}
        onClose={() => setIsStoreVisible(false)}
        onPurchaseSuccess={(addedAmount) => {
          addCredits(addedAmount);
          fetchCredits();
        }}
      />

      {/* App Header */}
      <Header>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => setIsStoreVisible(true)} style={styles.creditsPill}>
            <Text style={styles.creditsText}>
              🪙 {credits} {isSmallScreen ? "" : credits === 1 ? "Credit" : "Credits"}
            </Text>
            <View style={styles.addBtn}>
              <Text style={styles.addBtnText}>+</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={logout} style={styles.headerBtn}>
            <Text style={styles.headerBtnText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </Header>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Error Banner */}
        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Phase 3: Result */}
        {activeDisplayImage && sourceImage ? (
          <GeneratedImageDisplay
            sourceImage={sourceImage}
            generatedImage={activeDisplayImage}
            hasUnlockedHd={hasUnlockedPremiumHd}
            styleName={generationStyleName}
            onReset={handleResetWorkspace}
            onRemoveWatermark={handleRemoveWatermark}
          />
        ) : !sourceImage ? (
          /* Phase 1: Upload */
          <>
            <ImageUploader onImageSelected={setSourceImage} />
            <InspirationGallery onSelectPreset={setSourceImage} />
          </>
        ) : (
          /* Phase 2: Configure */
          <DesignWorkspace
            sourceImage={sourceImage}
            credits={credits}
            onReset={handleResetWorkspace}
            onGenerate={handleGenerate}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.base,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing["4xl"],
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  headerBtn: {
    backgroundColor: Colors.background.subtle,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
  },
  headerBtnText: {
    color: Colors.text.primary,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semiBold,
  },
  errorBanner: {
    backgroundColor: Colors.semantic.errorBg,
    borderColor: Colors.semantic.error,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  errorText: {
    color: Colors.semantic.error,
    textAlign: "center",
    fontSize: Typography.size.base,
  },
  creditsPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    borderRadius: BorderRadius.full,
    paddingLeft: Spacing.sm,
    paddingRight: Spacing.xs,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.25)",
  },
  creditsText: {
    color: Colors.brand.primaryLight,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    marginRight: 6,
  },
  addBtn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.brand.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  addBtnText: {
    color: Colors.white,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    lineHeight: Platform.OS === 'ios' ? 18 : 16,
  },
});

export default HomeScreen;