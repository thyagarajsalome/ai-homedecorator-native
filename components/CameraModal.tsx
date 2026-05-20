import React, { useRef, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { CameraView } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CameraModalProps {
  isVisible: boolean;
  onClose: () => void;
  onPictureTaken: (uri: string) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({ isVisible, onClose, onPictureTaken }) => {
  const cameraRef = useRef<CameraView>(null);
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.75 });
        if (photo) {
          setPreviewUri(photo.uri);
        }
      } catch (err) {
        console.error("Error taking picture:", err);
      }
    }
  };

  const handleConfirm = () => {
    if (previewUri) {
      onPictureTaken(previewUri);
      setPreviewUri(null);
    }
  };

  const handleRetake = () => {
    setPreviewUri(null);
  };

  const handleClose = () => {
    setPreviewUri(null);
    onClose();
  };

  return (
    <Modal animationType="slide" transparent={false} visible={isVisible} onRequestClose={handleClose}>
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        {previewUri ? (
          <View style={StyleSheet.absoluteFill}>
            <Image source={{ uri: previewUri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
            <SafeAreaView style={styles.cameraOverlay} pointerEvents="box-none">
              <TouchableOpacity onPress={handleRetake} style={styles.cameraCloseBtn}>
                <Text style={styles.cameraCloseText}>Retake</Text>
              </TouchableOpacity>
              <View style={styles.cameraBottomBar}>
                <TouchableOpacity onPress={handleConfirm} style={styles.confirmButton} activeOpacity={0.8}>
                  <Text style={styles.confirmButtonText}>✓</Text>
                </TouchableOpacity>
                <Text style={styles.confirmLabel}>Confirm Photo</Text>
              </View>
            </SafeAreaView>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <CameraView style={StyleSheet.absoluteFill} facing="back" ref={cameraRef} />
            <SafeAreaView style={styles.cameraOverlay} pointerEvents="box-none">
              <TouchableOpacity onPress={handleClose} style={styles.cameraCloseBtn}>
                <Text style={styles.cameraCloseText}>Cancel</Text>
              </TouchableOpacity>
              <View style={styles.cameraBottomBar}>
                <TouchableOpacity onPress={takePicture} style={styles.shutterButton} activeOpacity={0.8}>
                  <View style={styles.shutterInner} />
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  cameraOverlay: { flex: 1, justifyContent: "space-between", padding: 20 },
  cameraCloseBtn: { alignSelf: "flex-end", paddingHorizontal: 16, paddingVertical: 8, backgroundColor: "rgba(0,0,0,0.6)", borderRadius: 20 },
  cameraCloseText: { color: "#FFF", fontWeight: "600", fontSize: 14 },
  cameraBottomBar: { alignItems: "center", marginBottom: 20, gap: 10 },
  shutterButton: { width: 72, height: 72, borderRadius: 36, borderWidth: 4, borderColor: "#FFF", alignItems: "center", justifyContent: "center" },
  shutterInner: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#FFF" },
  confirmButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#10B981', // green confirm button
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  confirmLabel: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: 'hidden',
  }
});