import { Platform, Alert } from "react-native";
import Purchases, { PurchasesPackage } from "react-native-purchases";
import { REVENUECAT_ANDROID_KEY } from "@env";

const API_KEYS = {
  apple: "", // Add iOS key if needed
  google: REVENUECAT_ANDROID_KEY,
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

// 👇 ADD THIS FUNCTION
export const identifyUser = async (userId: string) => {
  try {
    // This links the RevenueCat user to your Supabase User ID
    await Purchases.logIn(userId);
  } catch (e) {
    console.error("Error identifying user to RevenueCat", e);
  }
};

// 👇 ADD THIS FUNCTION
export const logoutUser = async () => {
  try {
    await Purchases.logOut();
  } catch (e) {
    console.error("Error logging out user from RevenueCat", e);
  }
};

export const getPackages = async (): Promise<PurchasesPackage[]> => {
  // ... (keep existing code)
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
  // ... (keep existing code)
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
