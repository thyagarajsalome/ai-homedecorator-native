import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LogoIcon } from "../components/Icons";

const AboutScreen: React.FC = () => {
  return (
    <SafeAreaView
      style={styles.appContainer}
      edges={["bottom", "left", "right"]}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <LogoIcon style={{ width: 60, height: 60, marginBottom: 20 }} />
        <Text style={styles.title}>AI Home Decorator</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
        <Text style={styles.description}>
          This application uses generative AI to help you visualize new interior
          designs for your space.
        </Text>
        <Text style={styles.description}>
          Simply upload a photo of your room, select a style, and let the AI
          work its magic. You can also provide a custom prompt to get even more
          specific results.
        </Text>
        <Text style={styles.credits}>
          Powered by Expo, React Native, and Google's Gemini AI.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

// Adapted styles
const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: "#111827",
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  version: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: "#D1D5DB",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 24,
  },
  credits: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 32,
  },
});

export default AboutScreen;
