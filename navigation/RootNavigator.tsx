import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../context/AuthContext";

import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import OnboardingScreen from "../screens/OnboardingScreen";
import HomeScreen from "../screens/HomeScreen";
import AboutScreen from "../screens/AboutScreen";
import PrivacyScreen from "../screens/PrivacyScreen";
import DisclaimerScreen from "../screens/DisclaimerScreen";
import GalleryScreen from "../screens/GalleryScreen";

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
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem("has_seen_onboarding");
        setHasSeenOnboarding(value === "true");
      } catch {
        setHasSeenOnboarding(false);
      }
    };
    checkOnboarding();
  }, []);

  if (hasSeenOnboarding === null) {
    return <View style={{ flex: 1, backgroundColor: "#0F172A" }} />;
  }

  const initialRoute = isAuthenticated
    ? "Home"
    : (hasSeenOnboarding ? "Login" : "Onboarding");

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        {isAuthenticated ? (
          // App Stack (User is logged in)
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }} // No header for main screen
            />
            <Stack.Screen
              name="Gallery"
              component={GalleryScreen}
              options={{ headerShown: false }}
            />
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
              name="Onboarding"
              component={OnboardingScreen}
              options={{ headerShown: false }}
            />
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
