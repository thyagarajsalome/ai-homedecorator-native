import { registerRootComponent } from "expo";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

// --- Import the AuthProvider and RootNavigator ---
import { AuthProvider } from "./context/AuthContext";
import RootNavigator from "./navigation/RootNavigator";

// --- Wrap the RootNavigator with the AuthProvider ---
const Root = () => (
  <SafeAreaProvider>
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  </SafeAreaProvider>
);

registerRootComponent(Root);
