import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface Props {
  onImageSelected: (uri: string) => void;
}

export const ImageUploader: React.FC<Props> = ({ onImageSelected }) => {
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      onImageSelected(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
        <Text style={styles.uploadText}>📸 Tap to Upload Room Photo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 20 },
  uploadBox: {
    height: 200,
    borderWidth: 2,
    borderColor: '#334155',
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E293B'
  },
  uploadText: { color: '#94A3B8', fontWeight: '600' }
});