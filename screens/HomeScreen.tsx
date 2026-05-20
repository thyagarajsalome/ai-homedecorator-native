import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

// Business Logic Hooks
import { useCredits } from "../hooks/useCredits";
import { useRoomGeneration } from "../hooks/useRoomGeneration";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

// UI Components
import Loader from "../components/Loader";
import Header from "../components/Header";
import { CustomAlertModal } from "../components/CustomAlertModal";

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
  // Phase State
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [isCreditAlertVisible, setIsCreditAlertVisible] = useState(false);

  // Premium HD tracking
  const [activeDisplayImage, setActiveDisplayImage] = useState<string | null>(null);
  const [premiumHdBackupUrl, setPremiumHdBackupUrl] = useState<string | null>(null);
  const [hasUnlockedPremiumHd, setHasUnlockedPremiumHd] = useState(false);
  const [generationStyleName, setGenerationStyleName] = useState<string>("Modern");

  // Auth & Business Logic
  const { session, logout } = useAuth();
  const { credits, fetchCredits, deductCredits } = useCredits();
  const { generateDesign, isLoading, error, resetGeneration } = useRoomGeneration();

  // Re-fetch credits every time user navigates back to this screen
  useFocusEffect(
    useCallback(() => {
      fetchCredits();
    }, [fetchCredits])
  );

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
      setIsCreditAlertVisible(true);
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
      setIsCreditAlertVisible(true);
      return false;
    }
    try {
      // Call the secure server-side RPC to check and deduct 1 credit
      const { data, error: rpcError } = await supabase.rpc('secure_deduct_credits', { 
        cost_amount: 1 
      });

      if (rpcError) {
        if (rpcError.message?.includes('Insufficient credits')) {
          setIsCreditAlertVisible(true);
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
        message="You need more credits to continue decorating. Grab a pack now!"
        onCancel={() => setIsCreditAlertVisible(false)}
        onConfirm={() => {
          setIsCreditAlertVisible(false);
          navigation.navigate("BuyCredits");
        }}
        confirmText="GET CREDITS"
      />

      {/* App Header */}
      <Header>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Referral")}
            style={[styles.headerBtn, styles.headerBtnPrimary]}
          >
            <Text style={styles.headerBtnText}>🎁 Free Credits</Text>
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
            onBuyCreditsNavigate={() => navigation.navigate("BuyCredits")}
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
    gap: Spacing.sm,
  },
  headerBtn: {
    backgroundColor: Colors.background.subtle,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
  },
  headerBtnPrimary: {
    backgroundColor: Colors.brand.primary,
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
});

export default HomeScreen;