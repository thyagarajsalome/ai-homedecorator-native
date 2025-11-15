import React from "react";
import { Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DisclaimerScreen: React.FC = () => {
  return (
    <SafeAreaView
      style={styles.appContainer}
      edges={["bottom", "left", "right"]}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Disclaimer</Text>
        <Text style={styles.lastUpdated}>Last updated: [Date]</Text>

        <Text style={styles.heading}>AI-Generated Content</Text>
        <Text style={styles.body}>
          The "AI Home Decorator" application uses generative artificial
          intelligence (AI) to create new images based on user-provided photos
          and prompts. The generated content is for informational and
          inspirational purposes only.
        </Text>

        <Text style={styles.heading}>No Guarantees</Text>
        <Text style={styles.body}>
          The AI-generated designs are not guaranteed to be accurate, practical,
          or feasible in a real-world scenario. The designs may contain
          artifacts, inaccuracies, or interpretations that do not align with the
          user's intent. We do not warrant the completeness, reliability, or
          accuracy of this information.
        </Text>

        <Text style={styles.heading}>Limitation of Liability</Text>
        <Text style={styles.body}>
          Any action you take upon the information you get from this application
          is strictly at your own risk. We will not be liable for any losses
          and/or damages in connection with the use of our application.
        </Text>

        <Text style={styles.heading}>User Responsibility</Text>
        <Text style={styles.body}>
          Users are solely responsible for the images they upload and must
          ensure they have the necessary rights to use and modify them. Do not
          upload any images that are illegal, offensive, or infringe on the
          privacy or intellectual property of others.
        </Text>
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

export default DisclaimerScreen;
