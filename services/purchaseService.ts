import { Platform, Alert } from "react-native";
import Purchases, { PurchasesPackage } from "react-native-purchases";
import { REVENUECAT_ANDROID_KEY } from "@env"; // <--- Import this

// 🟢 TODO: PASTE YOUR REVENUECAT PUBLIC SDK KEYS HERE
const API_KEYS = {
  apple: "",
  google: REVENUECAT_ANDROID_KEY, // <--- Use the variable here
};

export const initPurchases = async () => {
  try {
    if (Platform.OS === "android") {
      await Purchases.configure({ apiKey: API_KEYS.google });
    } else {
      await Purchases.configure({ apiKey: API_KEYS.apple });
    }
  } catch (e) {
    console.error("Error initializing purchases", e);
  }
};

export const getPackages = async (): Promise<PurchasesPackage[]> => {
  try {
    const offerings = await Purchases.getOfferings();
    if (
      offerings.current !== null &&
      offerings.current.availablePackages.length !== 0
    ) {
      return offerings.current.availablePackages;
    }
  } catch (e) {
    console.error("Error fetching offers", e);
  }
  return [];
};

export const purchasePackage = async (pack: PurchasesPackage) => {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pack);
    return customerInfo;
  } catch (e: any) {
    if (!e.userCancelled) {
      Alert.alert("Error", e.message);
    }
    throw e;
  }
};
