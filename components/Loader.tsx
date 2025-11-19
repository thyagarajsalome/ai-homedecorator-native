import React, { useState, useEffect } from "react";
import { View, Text, Modal, ActivityIndicator, StyleSheet } from "react-native";

const LOADING_MESSAGES = [
  "Analyzing your room structure...",
  "Removing old furniture...",
  "Selecting new decor...",
  "Applying lighting and textures...",
  "Finalizing your design...",
];

const Loader: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    // Cycle through messages every 2.5 seconds to keep the user engaged
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Modal transparent={true} animationType="fade" visible={true}>
      <View style={styles.container}>
        <View style={styles.content}>
          <ActivityIndicator size="large" color="#C084FC" />
          <Text style={styles.title}>Decorating...</Text>
          <Text style={styles.message}>{LOADING_MESSAGES[messageIndex]}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.85)", // Darker, cleaner overlay
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    backgroundColor: "#1F2937", // Dark gray card background
    padding: 32,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#374151",
    minWidth: 280,
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
  },
  message: {
    color: "#9CA3AF", // Light gray for the status text
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
    fontStyle: "italic",
  },
});

export default Loader;
