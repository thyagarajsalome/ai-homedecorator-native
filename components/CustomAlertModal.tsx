import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface CustomAlertModalProps {
  visible: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmText: string;
}

export const CustomAlertModal: React.FC<CustomAlertModalProps> = ({
  visible,
  title,
  message,
  onCancel,
  onConfirm,
  confirmText,
}) => (
  <Modal transparent visible={visible} animationType="fade">
    <View style={styles.modalOverlay}>
      <View style={styles.customAlertCard}>
        <Text style={styles.alertTitle}>{title}</Text>
        <Text style={styles.alertMessage}>{message}</Text>
        <View style={styles.alertActions}>
          <TouchableOpacity onPress={onCancel} style={styles.alertBtnCancel}>
            <Text style={styles.alertBtnTextCancel}>CANCEL</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onConfirm} style={styles.alertBtnConfirm}>
            <Text style={styles.alertBtnTextConfirm}>{confirmText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  customAlertCard: {
    backgroundColor: "#1E293B",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 340,
    borderWidth: 1,
    borderColor: "#334155",
    alignItems: "center",
  },
  alertTitle: { fontSize: 20, fontWeight: "800", color: "#F8FAFC", marginBottom: 12 },
  alertMessage: { fontSize: 15, color: "#94A3B8", textAlign: "center", marginBottom: 24, lineHeight: 22 },
  alertActions: { flexDirection: "row", width: "100%", justifyContent: "flex-end", gap: 16 },
  alertBtnCancel: { paddingVertical: 10, paddingHorizontal: 12 },
  alertBtnTextCancel: { color: "#6366F1", fontWeight: "700", fontSize: 14 },
  alertBtnConfirm: { paddingVertical: 10, paddingHorizontal: 12 },
  alertBtnTextConfirm: { color: "#6366F1", fontWeight: "700", fontSize: 14 },
});