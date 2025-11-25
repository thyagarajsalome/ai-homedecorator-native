import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";

import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import HomeScreen from "../screens/HomeScreen";
import AboutScreen from "../screens/AboutScreen";
import PrivacyScreen from "../screens/PrivacyScreen";
import DisclaimerScreen from "../screens/DisclaimerScreen";
// --- 1. ADDED: Import the new BuyCredits screen ---
import BuyCreditsScreen from "../screens/BuyCreditsScreen";

const Stack = createNativeStackNavigator();

// Common screen options for legal pages
const legalScreenOptions: any = {
  headerShown: true,
  headerStyle: {
    backgroundColor: "#111827",
  },
  headerTintColor: "#FFFFFF",
  headerTitleStyle: {
    color: "#FFFFFF",
  },
};

const RootNavigator: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isAuthenticated ? (
          // App Stack (User is logged in)
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }} // No header for main screen
            />

            {/* --- 2. ADDED: Buy Credits Screen --- */}
            <Stack.Screen
              name="BuyCredits"
              component={BuyCreditsScreen}
              options={{ headerShown: false }} // It has its own custom header
            />
            {/* ------------------------------------ */}

            <Stack.Screen
              name="About"
              component={AboutScreen}
              options={{ ...legalScreenOptions, title: "About" }}
            />
            <Stack.Screen
              name="Privacy"
              component={PrivacyScreen}
              options={{ ...legalScreenOptions, title: "Privacy Policy" }}
            />
            <Stack.Screen
              name="Disclaimer"
              component={DisclaimerScreen}
              options={{ ...legalScreenOptions, title: "Disclaimer" }}
            />
          </>
        ) : (
          // Auth Stack (User is not logged in)
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Privacy"
              component={PrivacyScreen}
              options={{ ...legalScreenOptions, title: "Privacy Policy" }}
            />
            <Stack.Screen
              name="Disclaimer"
              component={DisclaimerScreen}
              options={{ ...legalScreenOptions, title: "Disclaimer" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
