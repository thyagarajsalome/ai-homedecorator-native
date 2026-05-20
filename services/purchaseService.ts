import { Platform, Alert } from "react-native";
import Purchases, { PurchasesPackage } from "react-native-purchases";

const API_KEYS = {
  apple: "", // Add iOS key if needed
  google: "goog_GbwokSEambLYaNwIKSvvPlzBNMS",
};

export const initPurchases = async () => {
  if (Platform.OS === 'web') return;
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
  if (Platform.OS === 'web') return;
  try {
    // This links the RevenueCat user to your Supabase User ID
    await Purchases.logIn(userId);
  } catch (e) {
    console.error("Error identifying user to RevenueCat", e);
  }
};

// 👇 ADD THIS FUNCTION
export const logoutUser = async () => {
  if (Platform.OS === 'web') return;
  try {
    await Purchases.logOut();
  } catch (e) {
    console.error("Error logging out user from RevenueCat", e);
  }
};

export const getPackages = async (): Promise<PurchasesPackage[]> => {
  if (Platform.OS === 'web') {
    return [
      {
        identifier: "starter_pack",
        packageType: "CUSTOM",
        product: {
          identifier: "credits_15",
          description: "15 Generations",
          title: "Starter Pack",
          price: 398.00,
          priceString: "₹398",
          currencyCode: "INR",
          introPrice: null
        }
      },
      {
        identifier: "pro_pack",
        packageType: "CUSTOM",
        product: {
          identifier: "credits_50",
          description: "50 Generations",
          title: "Best Value",
          price: 998.00,
          priceString: "₹998",
          currencyCode: "INR",
          introPrice: null
        }
      },
      {
        identifier: "ultimate_pack",
        packageType: "CUSTOM",
        product: {
          identifier: "credits_120",
          description: "120 Generations",
          title: "Pro Pack",
          price: 1998.00,
          priceString: "₹1998",
          currencyCode: "INR",
          introPrice: null
        }
      }
    ] as any;
  }
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
  if (Platform.OS === 'web') {
    Alert.alert("Not Supported", "In-app purchases are not supported on the web version.");
    return null;
  }
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
