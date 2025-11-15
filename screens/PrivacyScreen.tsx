import React from "react";
import { Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PrivacyScreen: React.FC = () => {
  return (
    <SafeAreaView
      style={styles.appContainer}
      edges={["bottom", "left", "right"]}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.lastUpdated}>Last updated: [Date]</Text>

        <Text style={styles.heading}>Introduction</Text>
        <Text style={styles.body}>
          Welcome to AI Home Decorator. We respect your privacy and are
          committed to protecting your personal data. This privacy policy will
          inform you as to how we look after your personal data when you use our
          application and tell you about your privacy rights and how the law
          protects you.
        </Text>

        <Text style={styles.heading}>Data We Collect</Text>
        <Text style={styles.body}>
          We may collect, use, store, and transfer different kinds of personal
          data about you which we have grouped together as follows:
        </Text>
        <Text style={styles.body}>
          - Identity Data includes first name, last name, username or similar
          identifier.
        </Text>
        <Text style={styles.body}>- Contact Data includes email address.</Text>
        <Text style={styles.body}>
          - User-Uploaded Content includes images of rooms that you upload for
          decoration.
        </Text>

        <Text style={styles.heading}>How We Use Your Data</Text>
        <Text style={styles.body}>
          We will only use your personal data when the law allows us to. Most
          commonly, we will use your personal data to:
        </Text>
        <Text style={styles.body}>
          - Provide and maintain our service, including processing your images
          with AI models.
        </Text>
        <Text style={styles.body}>
          - Manage your account and provide you with customer support.
        </Text>

        <Text style={styles.heading}>Data Security</Text>
        <Text style={styles.body}>
          We have put in place appropriate security measures to prevent your
          personal data from being accidentally lost, used or accessed in an
          unauthorized way, altered or disclosed.
        </Text>

        {/* FIXME: Add more sections as required by law */}
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles adapted from AboutScreen
const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: "#111827",
  },
  container: {
    flexGrow: 1,
    paddingVertical: 24,
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
    textAlign: "center",
  },
  lastUpdated: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 24,
    textAlign: "center",
  },
  heading: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
    marginTop: 16,
    marginBottom: 8,
  },
  body: {
    fontSize: 16,
    color: "#D1D5DB",
    lineHeight: 24,
    marginBottom: 12,
  },
});

export default PrivacyScreen;
