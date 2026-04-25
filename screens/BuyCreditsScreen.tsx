import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
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

  // HELPER FUNCTION: Calculates original price by doubling the current one for the sale effect
  const getOriginalPrice = (priceString: string) => {
    const numericPart = priceString.replace(/[^0-9.]/g, "");
    const numericValue = parseFloat(numericPart);
    if (isNaN(numericValue)) return "";

    const originalValue = numericValue * 2;
    return priceString.replace(/[0-9.,]+/, originalValue.toLocaleString());
  };

  const onPurchase = async (pack: PurchasesPackage) => {
    if (!session?.user) {
      Alert.alert("Error", "You must be logged in to buy credits.");
      return;
    }

    try {
      setLoading(true);
      await purchasePackage(pack);
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Unlock Premium AI</Text>
        <Text style={styles.subtitle}>
          Transform any room in seconds with our most advanced AI models.
        </Text>

        <View style={styles.benefitsContainer}>
          <View style={styles.benefitRow}>
            <Text style={styles.benefitIcon}>✨</Text>
            <Text style={styles.benefitText}>Remove all watermarks</Text>
          </View>
          <View style={styles.benefitRow}>
            <Text style={styles.benefitIcon}>⚡️</Text>
            <Text style={styles.benefitText}>Faster generation times</Text>
          </View>
          <View style={styles.benefitRow}>
            <Text style={styles.benefitIcon}>📸</Text>
            <Text style={styles.benefitText}>High-resolution downloads</Text>
          </View>
        </View>

        <View style={styles.saleBanner}>
          <Text style={styles.saleBannerText}>
            🔥 FLASH SALE: 50% PRICE DROP! 🔥
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#6366F1"
            style={{ marginTop: 40 }}
          />
        ) : packages.length === 0 ? (
          <Text style={styles.emptyText}>No packages found.{"\n"}</Text>
        ) : (
          <View style={styles.packagesContainer}>
            {packages.map((item, index) => {
              // Highlight the middle or most expensive package as "Best Value"
              const isBestValue = index === 1 || packages.length === 1;

              return (
                <TouchableOpacity
                  key={item.identifier}
                  onPress={() => onPurchase(item)}
                  style={[styles.card, isBestValue && styles.bestValueCard]}
                >
                  {isBestValue && (
                    <View style={styles.bestValueBadge}>
                      <Text style={styles.bestValueText}>MOST POPULAR</Text>
                    </View>
                  )}

                  <View style={styles.cardInfo}>
                    <Text style={styles.packTitle}>{item.product.title}</Text>
                    <Text style={styles.packDesc}>
                      {item.product.description}
                    </Text>
                  </View>

                  <View style={styles.buyActionArea}>
                    <View style={styles.priceContainer}>
                      <Text style={styles.oldPriceText}>
                        {getOriginalPrice(item.product.priceString)}
                      </Text>
                      <View
                        style={[
                          styles.buyButton,
                          isBestValue && styles.bestValueBuyButton,
                        ]}
                      >
                        <Text style={styles.priceText}>
                          {item.product.priceString}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
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
  subtitle: { fontSize: 16, color: "#94A3B8", lineHeight: 24 },

  benefitsContainer: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#334155",
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  benefitIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  benefitText: {
    color: "#F8FAFC",
    fontSize: 15,
    fontWeight: "500",
  },

  saleBanner: {
    backgroundColor: "rgba(99, 102, 241, 0.15)",
    borderWidth: 1,
    borderColor: "#6366F1",
    borderRadius: 12,
    padding: 14,
    marginTop: 20,
    alignItems: "center",
  },
  saleBannerText: {
    color: "#818CF8",
    fontWeight: "900",
    fontSize: 14,
  },

  packagesContainer: {
    gap: 16,
    marginTop: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#1E293B",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
    position: "relative",
  },
  bestValueCard: {
    borderColor: "#818CF8",
    borderWidth: 2,
    backgroundColor: "rgba(99, 102, 241, 0.08)",
  },
  bestValueBadge: {
  position: "absolute",
  top: -12,
  alignSelf: "center",
  left: "40%",
  backgroundColor: "#FBBF24", // Changed to warm gold
  paddingHorizontal: 12,
  paddingVertical: 4,
  borderRadius: 12,
  shadowColor: "#FBBF24",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 5,
},
  bestValueText: {
  color: "#1E293B", // Darker text for contrast on gold
  fontSize: 10,
  fontWeight: "900",
  letterSpacing: 1,
},

  cardInfo: { flex: 1, marginRight: 16 },
  packTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    marginBottom: 4,
  },
  packDesc: { fontSize: 13, color: "#94A3B8" },

  buyActionArea: {
    alignItems: "center",
  },
  priceContainer: {
    alignItems: "center",
    gap: 4,
  },
  oldPriceText: {
    color: "#94A3B8",
    fontSize: 12,
    textDecorationLine: "line-through",
    fontWeight: "500",
  },
  buyButton: {
    backgroundColor: "#6366F1",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    minWidth: 85,
    alignItems: "center",
  },
  bestValueBuyButton: {
    backgroundColor: "#4F46E5",
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