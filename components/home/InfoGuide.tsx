import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const InfoGuide = () => (
  <View style={styles.container}>
    <Text style={styles.title}>How it works</Text>
    <Text style={styles.text}>1. Upload a clear photo of your room.</Text>
    <Text style={styles.text}>2. Select the room type and preferred style.</Text>
    <Text style={styles.text}>3. Our AI will redesign your space instantly!</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#1E293B', borderRadius: 12, marginTop: 20 },
  title: { color: '#F8FAFC', fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  text: { color: '#94A3B8', fontSize: 14, marginBottom: 4 }
});