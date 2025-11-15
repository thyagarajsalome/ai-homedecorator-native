import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView, // --- ADDED: ScrollView for smaller screens ---
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { LogoIcon } from "../components/Icons";
import Header from "../components/Header";

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleLogin = () => {
    // FIXME: Add real login validation
    if (email && password) {
      login();
    } else {
      alert("Please enter email and password");
    }
  };

  return (
    <SafeAreaView
      style={styles.appContainer}
      edges={["bottom", "left", "right"]}
    >
      <Header />
      {/* --- MODIFIED: Use ScrollView to prevent overflow --- */}
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

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.linkText}>
            Don't have an account? <Text style={styles.link}>Sign Up</Text>
          </Text>
        </TouchableOpacity>

        {/* --- ADDED: Legal links --- */}
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
    flexGrow: 1, // --- MODIFIED: Use flexGrow for ScrollView ---
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20, // --- ADDED: Padding for ScrollView ---
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
  // --- ADDED: Styles for legal links ---
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
