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
// Notice: We NO LONGER import supabase here for updating credits!

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
      // The payment happens here. RevenueCat validates it with Apple/Google.
      const { customerInfo } = await purchasePackage(pack);

      // 3. Success!
      // We do NOT update Supabase here. Your new Edge Function does that securely.
      // We wait 2 seconds to give the backend time to process, then alert the user.
      setTimeout(() => {
        Alert.alert(
          "Purchase Successful",
          "Your credits are being added! It may take a moment to appear."
        );
        navigation.goBack();
      }, 2000);
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
