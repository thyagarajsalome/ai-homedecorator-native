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
import { getPackages, purchasePackage } from "../services/purchaseService";
import { useAuth } from "../context/AuthContext";

const BuyCreditsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [loading, setLoading] = useState(false);
  const { session } = useAuth();

  useEffect(() => {
    loadPackages();
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

      // 3. Success!
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

        {/* --- NEW: SALE BANNER --- */}
        <View style={styles.saleBanner}>
          <Text style={styles.saleBannerText}>
            🔥 LIMITED TIME: 50% PRICE DROP! 🔥
          </Text>
          <Text style={styles.saleSubtext}>
            Get premium designs at half the price.
          </Text>
        </View>

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

                {/* --- UPDATED: BUY ACTION AREA WITH DISCOUNT BADGE --- */}
                <View style={styles.buyActionArea}>
                  <View style={styles.priceBadge}>
                    <Text style={styles.priceBadgeText}>50% OFF</Text>
                  </View>
                  <View style={styles.buyButton}>
                    <Text style={styles.priceText}>
                      {item.product.priceString}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No packages found.{"\n"}</Text>
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

  /* --- NEW: SALE BANNER STYLES --- */
  saleBanner: {
    backgroundColor: "rgba(99, 102, 241, 0.15)",
    borderWidth: 1,
    borderColor: "#6366F1",
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    alignItems: "center",
  },
  saleBannerText: {
    color: "#818CF8",
    fontWeight: "900",
    fontSize: 16,
  },
  saleSubtext: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 4,
  },

  card: {
    backgroundColor: "#1E293B",
    borderRadius: 20,
    padding: 16, // Adjusted padding for balance
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  cardInfo: { flex: 1, marginRight: 12 },
  packTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    marginBottom: 4,
  },
  packDesc: { fontSize: 13, color: "#94A3B8" },

  /* --- NEW: BUY ACTION AREA & BADGE STYLES --- */
  buyActionArea: {
    alignItems: "center",
  },
  priceBadge: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 6,
  },
  priceBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },

  buyButton: {
    backgroundColor: "#6366F1",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    minWidth: 85,
    alignItems: "center",
  },
  priceText: { color: "white", fontWeight: "bold", fontSize: 15 },
  emptyText: {
    color: "#64748B",
    textAlign: "center",
    marginTop: 40,
    lineHeight: 24,
  },
});

export default BuyCreditsScreen;
