import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { LogoIcon } from "../components/Icons";

const SignUpScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth(); // Using login for simplicity

  const handleSignUp = () => {
    // FIXME: Add real sign-up logic
    if (email && password) {
      // In a real app, you'd create a user, then log in.
      // For this example, we'll just log in directly.
      login();
    } else {
      alert("Please enter email and password");
    }
  };

  return (
    <SafeAreaView style={styles.appContainer}>
      <View style={styles.container}>
        <LogoIcon style={{ width: 60, height: 60, marginBottom: 20 }} />
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Start your design journey</Text>

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

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.linkText}>
            Already have an account? <Text style={styles.link}>Log In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Duplicating styles for this example.
const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: "#111827",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
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
});

export default SignUpScreen;
