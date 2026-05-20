import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";

const ReferralScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { session } = useAuth();
  const [isSharing, setIsSharing] = useState(false);

  // In a full implementation, you'd generate a short code mapping to the UUID.
  // For now, we use the first 8 chars of their UUID as a referral code.
  const referralCode = session?.user?.id ? session.user.id.substring(0, 8).toUpperCase() : "LOGIN_FIRST";
  
  const shareMessage = `I'm designing my dream home with AI! 🚀 Use my invite code '${referralCode}' to get 3 FREE generations on Ai Home Decorator.\n\nDownload now:\nhttps://play.google.com/store/apps/details?id=com.aihomedecorator.twa`;

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(referralCode);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert("Copied! ✅", "Referral code copied to clipboard.");
  };

  const handleShare = async () => {
    if (isSharing) return;
    setIsSharing(true);
    try {
      if (Platform.OS === 'web') {
        if (navigator.share) {
          await navigator.share({
            title: "Invite Friends, Get Free Credits",
            text: shareMessage,
          }).catch((err) => {
            if (err.name !== 'AbortError') console.error("Web Share error:", err);
          });
        } else {
          Alert.alert("Share", "Sharing is not supported on this browser.");
        }
      } else {
        const RNShare = require('react-native-share').default;
        await RNShare.open({
          title: "Invite Friends, Get Free Credits",
          message: shareMessage,
        });
      }
    } catch (error: any) {
      if (error.message !== "User did not share") {
        console.error(error);
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom", "left", "right"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.heroIcon}>🎁</Text>
        </View>
        <Text style={styles.title}>Refer & Earn</Text>
        <Text style={styles.subtitle}>
          Invite your friends to try Ai Home Decorator. When they sign up using your code, you BOTH get <Text style={styles.highlight}>3 Free Credits!</Text>
        </Text>

        <View style={styles.codeContainer}>
          <Text style={styles.codeLabel}>YOUR INVITE CODE</Text>
          <View style={styles.codeBox}>
            <Text style={styles.codeText}>{referralCode}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity onPress={copyToClipboard} style={[styles.button, styles.secondaryButton]} activeOpacity={0.8}>
            <Text style={styles.buttonText}>📋 Copy Code</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={[styles.button, styles.primaryButton]} activeOpacity={0.8} disabled={isSharing}>
            <Text style={styles.buttonText}>{isSharing ? "Sharing..." : "🚀 Share Link"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.howItWorks}>
          <Text style={styles.howTitle}>How it works</Text>
          <View style={styles.step}>
            <View style={styles.stepNumber}><Text style={styles.stepNumberText}>1</Text></View>
            <Text style={styles.stepText}>Share your code with friends</Text>
          </View>
          <View style={styles.step}>
            <View style={styles.stepNumber}><Text style={styles.stepNumberText}>2</Text></View>
            <Text style={styles.stepText}>They enter it when signing up</Text>
          </View>
          <View style={styles.step}>
            <View style={styles.stepNumber}><Text style={styles.stepNumberText}>3</Text></View>
            <Text style={styles.stepText}>You both get 3 free generations instantly!</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#050505" },
  header: { paddingHorizontal: 20, paddingTop: 10 },
  backButton: { padding: 8 },
  backText: { color: "#94A3B8", fontSize: 16 },
  content: { padding: 24, alignItems: "center" },
  iconContainer: {
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    padding: 20,
    borderRadius: 50,
    marginBottom: 20,
  },
  heroIcon: { fontSize: 48 },
  title: { fontSize: 32, fontWeight: "800", color: "#F8FAFC", marginBottom: 12, textAlign: "center" },
  subtitle: { fontSize: 16, color: "#94A3B8", textAlign: "center", lineHeight: 24, marginBottom: 32, paddingHorizontal: 10 },
  highlight: { color: "#818CF8", fontWeight: "bold" },
  
  codeContainer: {
    width: "100%",
    backgroundColor: "rgba(30, 41, 59, 0.4)",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.4)",
    marginBottom: 24,
    shadowColor: "#6366F1",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 15,
    elevation: 8,
  },
  codeLabel: { color: "#94A3B8", fontSize: 12, fontWeight: "bold", letterSpacing: 1, marginBottom: 12 },
  codeBox: {
    backgroundColor: "#000000",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#D946EF",
    borderStyle: "dashed",
  },
  codeText: { color: "#F8FAFC", fontSize: 24, fontWeight: "800", letterSpacing: 2 },
  
  actions: { flexDirection: "row", gap: 12, width: "100%", marginBottom: 40 },
  button: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  primaryButton: { backgroundColor: "#6366F1" },
  secondaryButton: { backgroundColor: "#334155" },
  buttonText: { color: "#FFF", fontSize: 15, fontWeight: "700" },
  
  howItWorks: { width: "100%", backgroundColor: "rgba(255,255,255,0.03)", padding: 20, borderRadius: 16 },
  howTitle: { color: "#F8FAFC", fontSize: 18, fontWeight: "bold", marginBottom: 16 },
  step: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  stepNumber: { width: 24, height: 24, borderRadius: 12, backgroundColor: "#334155", alignItems: "center", justifyContent: "center", marginRight: 12 },
  stepNumberText: { color: "#94A3B8", fontSize: 12, fontWeight: "bold" },
  stepText: { color: "#CBD5E1", fontSize: 14, flex: 1 },
});

export default ReferralScreen;
