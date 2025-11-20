import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../lib/supabase";

const SignUpScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        Alert.alert("Sign Up Failed", error.message);
      } else {
        Alert.alert(
          "Account Created",
          "Please check your email to verify your account before logging in.",
          [{ text: "Go to Login", onPress: () => navigation.navigate("Login") }]
        );
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            {/* Updated to use your provided logo */}
            <Image
              source={require("../assets/images/icon.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join the future of home design</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor="#64748B"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Create a strong password"
                placeholderTextColor="#64748B"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSignUp}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>
                {loading ? "Creating..." : "Sign Up"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              style={styles.linkContainer}
            >
              <Text style={styles.linkText}>
                Already have an account?{" "}
                <Text style={styles.linkAccent}>Log In</Text>
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.legalText}>
              By creating an account, you agree to our{" "}
              <Text
                style={styles.legalLink}
                onPress={() => navigation.navigate("Privacy")}
              >
                Privacy Policy
              </Text>{" "}
              and{" "}
              <Text
                style={styles.legalLink}
                onPress={() => navigation.navigate("Disclaimer")}
              >
                Disclaimer
              </Text>
              .
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 24,
    borderRadius: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#F8FAFC",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#94A3B8",
    textAlign: "center",
  },
  form: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#CBD5E1",
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: "#1E293B",
    color: "#F8FAFC",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#334155",
    paddingHorizontal: 16,
    height: 56,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#6366F1",
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    marginBottom: 24,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonDisabled: {
    backgroundColor: "#334155",
    opacity: 0.7,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  linkContainer: {
    alignItems: "center",
    padding: 8,
  },
  linkText: {
    color: "#94A3B8",
    fontSize: 15,
  },
  linkAccent: {
    color: "#818CF8",
    fontWeight: "700",
  },
  footer: {
    marginTop: "auto",
    alignItems: "center",
    paddingTop: 24,
  },
  legalText: {
    color: "#64748B",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },
  legalLink: {
    color: "#94A3B8",
    textDecorationLine: "underline",
  },
});

export default SignUpScreen;
