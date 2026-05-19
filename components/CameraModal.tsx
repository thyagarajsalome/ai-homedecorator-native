import React, { useRef } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CameraView } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CameraModalProps {
  isVisible: boolean;
  onClose: () => void;
  onPictureTaken: (uri: string) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({ isVisible, onClose, onPictureTaken }) => {
  const cameraRef = useRef<CameraView>(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.5 });
      if (photo) onPictureTaken(photo.uri);
    }
  };

  return (
    <Modal animationType="slide" transparent={false} visible={isVisible} onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        <CameraView style={StyleSheet.absoluteFill} facing="back" ref={cameraRef} />
        <SafeAreaView style={styles.cameraOverlay} pointerEvents="box-none">
          <TouchableOpacity onPress={onClose} style={styles.cameraCloseBtn}>
            <Text style={styles.cameraCloseText}>Cancel</Text>
          </TouchableOpacity>
          <View style={styles.cameraBottomBar}>
            <TouchableOpacity onPress={takePicture} style={styles.shutterButton}>
              <View style={styles.shutterInner} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  cameraOverlay: { flex: 1, justifyContent: "space-between", padding: 20 },
  cameraCloseBtn: { alignSelf: "flex-end", padding: 10, backgroundColor: "rgba(0,0,0,0.5)", borderRadius: 20 },
  cameraCloseText: { color: "#FFF", fontWeight: "600" },
  cameraBottomBar: { alignItems: "center", marginBottom: 20 },
  shutterButton: { width: 72, height: 72, borderRadius: 36, borderWidth: 4, borderColor: "#FFF", alignItems: "center", justifyContent: "center" },
  shutterInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#FFF" },
});