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

<<<<<<< HEAD
  // HELPER FUNCTION: Calculates original price by doubling the current one for the sale effect
  const getOriginalPrice = (priceString: string) => {
=======
  // 👇 HELPER FUNCTION: Calculates original price by doubling the current one
  const getOriginalPrice = (priceString: string) => {
    // Extracts the number, doubles it, and preserves currency symbols/formatting
>>>>>>> 57bd77444fc800e0b92eb6daca17d2f70757d947
    const numericPart = priceString.replace(/[^0-9.]/g, "");
    const numericValue = parseFloat(numericPart);
    if (isNaN(numericValue)) return "";

    const originalValue = numericValue * 2;
<<<<<<< HEAD
=======
    // Replace the old number with the new one in the original string
>>>>>>> 57bd77444fc800e0b92eb6daca17d2f70757d947
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
        ) : packages.length === 0 ? (
          <Text style={styles.emptyText}>No packages found.{"\n"}</Text>
        ) : (
<<<<<<< HEAD
          <View style={styles.packagesContainer}>
            {packages.map((item, index) => {
              // Highlight the middle or most expensive package as "Best Value"
              // Adjust this logic if you want to highlight a specific package ID
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
=======
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

                <View style={styles.buyActionArea}>
                  <View style={styles.priceBadge}>
                    <Text style={styles.priceBadgeText}>50% OFF</Text>
                  </View>

                  {/* 👇 UPDATED: Price area with strikethrough */}
                  <View style={styles.priceContainer}>
                    <Text style={styles.oldPriceText}>
                      {getOriginalPrice(item.product.priceString)}
                    </Text>
                    <View style={styles.buyButton}>
                      <Text style={styles.priceText}>
                        {item.product.priceString}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No packages found.{"\n"}</Text>
            }
          />
>>>>>>> 57bd77444fc800e0b92eb6daca17d2f70757d947
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
<<<<<<< HEAD
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
=======
  subtitle: { fontSize: 16, color: "#94A3B8" },
>>>>>>> 57bd77444fc800e0b92eb6daca17d2f70757d947

  saleBanner: {
    backgroundColor: "rgba(99, 102, 241, 0.15)",
    borderWidth: 1,
    borderColor: "#6366F1",
<<<<<<< HEAD
    borderRadius: 12,
    padding: 14,
    marginTop: 20,
=======
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
>>>>>>> 57bd77444fc800e0b92eb6daca17d2f70757d947
    alignItems: "center",
  },
  saleBannerText: {
    color: "#818CF8",
    fontWeight: "900",
<<<<<<< HEAD
    fontSize: 14,
  },

  packagesContainer: {
    gap: 16,
    marginTop: 20,
    paddingBottom: 40,
  },
=======
    fontSize: 16,
  },
  saleSubtext: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 4,
  },

>>>>>>> 57bd77444fc800e0b92eb6daca17d2f70757d947
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
<<<<<<< HEAD
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
    backgroundColor: "#818CF8",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bestValueText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1,
  },

  cardInfo: { flex: 1, marginRight: 16 },
=======
  cardInfo: { flex: 1, marginRight: 12 },
>>>>>>> 57bd77444fc800e0b92eb6daca17d2f70757d947
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
<<<<<<< HEAD
=======
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

  /* 👇 NEW: STYLES FOR PRICE STRIKETHROUGH */
>>>>>>> 57bd77444fc800e0b92eb6daca17d2f70757d947
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
<<<<<<< HEAD
=======

>>>>>>> 57bd77444fc800e0b92eb6daca17d2f70757d947
  buyButton: {
    backgroundColor: "#6366F1",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    minWidth: 85,
    alignItems: "center",
  },
<<<<<<< HEAD
  bestValueBuyButton: {
    backgroundColor: "#4F46E5",
  },
=======
>>>>>>> 57bd77444fc800e0b92eb6daca17d2f70757d947
  priceText: { color: "white", fontWeight: "bold", fontSize: 15 },
  emptyText: {
    color: "#64748B",
    textAlign: "center",
    marginTop: 40,
    lineHeight: 24,
  },
});

export default BuyCreditsScreen;