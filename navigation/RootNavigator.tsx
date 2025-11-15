import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";

import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import HomeScreen from "../screens/HomeScreen";
import Loader from "../components/Loader"; // Import Loader for a loading state

const Stack = createNativeStackNavigator();

const RootNavigator: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // You can add a loading state in your AuthContext for better UX
  // For now, we'll just use the boolean

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          // App Stack (User is logged in)
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          // Auth Stack (User is not logged in)
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
