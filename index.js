import { registerRootComponent } from "expo";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Platform } from "react-native";
import Purchases from "react-native-purchases";
import { REVENUECAT_ANDROID_KEY } from "@env";

// Configure RevenueCat Purchases on startup for Android
if (Platform.OS === "android") {
  try {
    if (REVENUECAT_ANDROID_KEY) {
      Purchases.configure({ apiKey: REVENUECAT_ANDROID_KEY });
      console.log("RevenueCat Purchases configured successfully.");
    } else {
      console.warn("REVENUECAT_ANDROID_KEY is not defined in environment variables!");
    }
  } catch (error) {
    console.error("Failed to configure RevenueCat Purchases:", error);
  }
}

// --- Import the AuthProvider and RootNavigator ---
import { AuthProvider } from "./context/AuthContext";
import RootNavigator from "./navigation/RootNavigator";

import { GestureHandlerRootView } from "react-native-gesture-handler";

// --------------------------------------

const Root = () => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  </GestureHandlerRootView>
);

registerRootComponent(Root);
