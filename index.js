import { registerRootComponent } from "expo";
import React from "react";
// --- FIX: Import SafeAreaProvider ---
import { SafeAreaProvider } from "react-native-safe-area-context";
import App from "./App";

// --- FIX: Wrap App in the Provider ---
const Root = () => (
  <SafeAreaProvider>
    <App />
  </SafeAreaProvider>
);

registerRootComponent(Root);
