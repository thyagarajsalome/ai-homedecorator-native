import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  type?: "success" | "error";
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  onClose,
  type = "success",
}) => {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          {/* Icon Circle */}
          <View
            style={[
              styles.iconCircle,
              type === "error" ? styles.errorIcon : styles.successIcon,
            ]}
          >
            <Text style={styles.iconText}>{type === "error" ? "!" : "✓"}</Text>
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <TouchableOpacity
            style={[
              styles.button,
              type === "error" ? styles.errorBtn : styles.successBtn,
            ]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)", // Dark dimmed background
    justifyContent: "center",
    alignItems: "center",
  },
  alertBox: {
    width: Dimensions.get("window").width * 0.8,
    backgroundColor: "#1E293B", // Matches your card/theme color
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  successIcon: { backgroundColor: "rgba(99, 102, 241, 0.2)" }, // Indigo fade
  errorIcon: { backgroundColor: "rgba(239, 68, 68, 0.2)" }, // Red fade
  iconText: { fontSize: 30, color: "#F8FAFC", fontWeight: "bold" },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#F8FAFC",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#94A3B8",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  successBtn: { backgroundColor: "#6366F1" },
  errorBtn: { backgroundColor: "#EF4444" },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});

export default CustomAlert;
