import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert, // Added Alert
} from "react-native";
// Removed SafeAreaView from react-native
import { SafeAreaView } from "react-native-safe-area-context"; // Added correct SafeAreaView
import { useAuth } from "../context/AuthContext";
import { LogoIcon } from "../components/Icons";
import Header from "../components/Header";
import { supabase } from "../lib/supabase"; // Added Supabase import

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state
  // We don't need to call login() from context manually if we use supabase directly here,
  // the AuthContext listener will handle the state change automatically.

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        Alert.alert("Login Error", error.message);
      }
      // No need to navigate manually; the AuthContext listener in RootNavigator
      // will detect the session change and switch to the App Stack.
    } catch (error: any) {
      Alert.alert("Error", error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={styles.appContainer}
      edges={["bottom", "left", "right"]}
    >
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <LogoIcon style={{ width: 60, height: 60, marginBottom: 20 }} />
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Log in to continue decorating</Text>

        <TextInput
          style={styles.textInput}
          placeholder="Email"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          placeholderTextColor="#9CA3AF"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.linkText}>
            Don't have an account? <Text style={styles.link}>Sign Up</Text>
          </Text>
        </TouchableOpacity>

        <View style={styles.legalContainer}>
          <Text style={styles.legalText}>By logging in, you agree to our</Text>
          <View style={styles.legalLinks}>
            <TouchableOpacity onPress={() => navigation.navigate("Privacy")}>
              <Text style={styles.legalLink}>Privacy Policy</Text>
            </TouchableOpacity>
            <Text style={styles.legalText}> and </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Disclaimer")}>
              <Text style={styles.legalLink}>Disclaimer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: "#111827",
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#9CA3AF",
    marginBottom: 32,
  },
  textInput: {
    width: "100%",
    backgroundColor: "#374151",
    color: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4B5563",
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    width: "100%",
    backgroundColor: "#4F46E5",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 24,
  },
  buttonDisabled: {
    backgroundColor: "#374151",
    opacity: 0.7,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  linkText: {
    color: "#9CA3AF",
    fontSize: 14,
  },
  link: {
    color: "#C084FC",
    fontWeight: "bold",
  },
  legalContainer: {
    marginTop: 48,
    alignItems: "center",
  },
  legalLinks: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  legalText: {
    color: "#6B7280",
    fontSize: 12,
  },
  legalLink: {
    color: "#9CA3AF",
    fontSize: 12,
    textDecorationLine: "underline",
  },
});

export default LoginScreen;
