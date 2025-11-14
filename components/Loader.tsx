import React from "react";
import { View, Text, Modal, ActivityIndicator, StyleSheet } from "react-native";

const Loader: React.FC<{ message: string }> = ({ message }) => {
  return (
    <Modal transparent={true} animationType="fade" visible={true}>
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.message}>{message}</Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    color: "white",
    fontSize: 18,
    marginTop: 16,
  },
});

export default Loader;
