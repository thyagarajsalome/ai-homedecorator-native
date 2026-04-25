import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const InfoGuide = () => (
  <View style={styles.container}>
    <Text style={styles.title}>How it works</Text>
    <Text style={styles.text}>Step 1: Snap or Upload a Room Photo</Text>
    <Text style={styles.text}>Step 2: Choose Your Room Type & Style</Text>
    <Text style={styles.text}>Step 3: Magic! See Your AI Redesign</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#1E293B', borderRadius: 12, marginTop: 20 },
  title: { color: '#F8FAFC', fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  text: { color: '#94A3B8', fontSize: 14, marginBottom: 4 }
});