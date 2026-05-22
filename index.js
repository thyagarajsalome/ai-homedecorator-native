import { registerRootComponent } from "expo";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

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
