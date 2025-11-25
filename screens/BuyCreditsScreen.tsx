import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PurchasesPackage } from "react-native-purchases";
import {
  initPurchases,
  getPackages,
  purchasePackage,
} from "../services/purchaseService";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase"; // <--- IMPORT SUPABASE

// --- 1. EXACT IDENTIFIERS FROM YOUR SCREENSHOT ---
const CREDIT_AMOUNTS: { [key: string]: number } = {
  credits_15: 15,
  credits_50: 50,
  credits_120: 120,
};

const BuyCreditsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [loading, setLoading] = useState(false);
  const { session } = useAuth();

  useEffect(() => {
    const setup = async () => {
      await initPurchases();
      loadPackages();
    };
    setup();
  }, []);

  const loadPackages = async () => {
    setLoading(true);
    const packs = await getPackages();
    setPackages(packs);
    setLoading(false);
  };

  const onPurchase = async (pack: PurchasesPackage) => {
    // 1. Check login
    if (!session?.user) {
      Alert.alert("Error", "You must be logged in to buy credits.");
      return;
    }

    try {
      setLoading(true);

      // 2. Perform the transaction via RevenueCat
      await purchasePackage(pack);

      // 3. Calculate Credits to Add
      // We match the pack.product.identifier (e.g., "credits_15") to our mapping
      const creditsToAdd = CREDIT_AMOUNTS[pack.product.identifier] || 15; // Fallback to 15 if ID not found

      // 4. Fulfillment: Update Supabase
      // Fetch current credits first
      const { data: profile, error: fetchError } = await supabase
        .from("user_profiles")
        .select("generation_credits")
        .eq("id", session.user.id)
        .single();

      if (fetchError) {
        console.error("Error fetching profile:", fetchError);
        throw new Error("Could not fetch user profile to add credits.");
      }

      const currentCredits = profile?.generation_credits || 0;
      const newCreditBalance = currentCredits + creditsToAdd;

      // Update the database with the new total
      const { error: updateError } = await supabase
        .from("user_profiles")
        .update({ generation_credits: newCreditBalance })
        .eq("id", session.user.id);

      if (updateError) {
        console.error("Error updating credits:", updateError);
        throw new Error(
          "Payment successful, but failed to save credits to database."
        );
      }

      Alert.alert("Success", `Added ${creditsToAdd} credits to your account!`);
      navigation.goBack(); // Go back to Home to see updated credits
    } catch (e: any) {
      if (!e.userCancelled) {
        console.error(e);
        Alert.alert(
          "Error",
          e.message || "Purchase failed. Please contact support."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Get More Credits</Text>
        <Text style={styles.subtitle}>Choose a pack to continue creating.</Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#6366F1"
            style={{ marginTop: 40 }}
          />
        ) : (
          <FlatList
            data={packages}
            keyExtractor={(item) => item.identifier}
            contentContainerStyle={{ gap: 16, marginTop: 20 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => onPurchase(item)}
                style={styles.card}
              >
                <View style={styles.cardInfo}>
                  <Text style={styles.packTitle}>{item.product.title}</Text>
                  <Text style={styles.packDesc}>
                    {item.product.description}
                  </Text>
                  {/* Optional: Debug text to see the ID you are buying */}
                  {/* <Text style={{color:'#666', fontSize: 10}}>{item.product.identifier}</Text> */}
                </View>
                <View style={styles.buyButton}>
                  <Text style={styles.priceText}>
                    {item.product.priceString}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                No packages found.{"\n"}
                (If testing on emulator, ensure you're a License Tester)
              </Text>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A" },
  header: { paddingHorizontal: 20, paddingTop: 10 },
  backButton: { padding: 8 },
  backText: { color: "#94A3B8", fontSize: 16 },
  content: { padding: 24, flex: 1 },
  title: { fontSize: 32, fontWeight: "800", color: "#F8FAFC", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#94A3B8" },
  card: {
    backgroundColor: "#1E293B",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  cardInfo: { flex: 1, marginRight: 16 },
  packTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    marginBottom: 4,
  },
  packDesc: { fontSize: 14, color: "#94A3B8" },
  buyButton: {
    backgroundColor: "#6366F1",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  priceText: { color: "white", fontWeight: "bold", fontSize: 16 },
  emptyText: {
    color: "#64748B",
    textAlign: "center",
    marginTop: 40,
    lineHeight: 24,
  },
});

export default BuyCreditsScreen;
