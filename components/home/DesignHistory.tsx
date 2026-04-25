// components/home/DesignHistory.tsx
import React from "react";
import { View, Text, Image, FlatList, StyleSheet } from "react-native";

export const DesignHistory: React.FC<{ history: any[] }> = ({ history }) => {
  if (history.length === 0) return null;

  // DSA: FlatList optimizes memory by rendering only visible items.
  return (
    <View style={styles.historyContainer}>
      <Text style={styles.sectionTitle}>Your Recent Designs</Text>
      <FlatList
        data={history}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.historyCard}>
            <Image 
              source={{ uri: item.generated_image_url }} 
              style={styles.historyImage} 
            />
            <Text style={styles.historyLabel} numberOfLines={1}>
              {item.room_type} • {item.style_name}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  historyContainer: {
    marginVertical: 20,
    paddingLeft: 20, // Pad left so the first item aligns, but allows scrolling off-screen
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937", // Dark gray text
    marginBottom: 12,
  },
  historyCard: {
    marginRight: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    // Add shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Add elevation for Android
    elevation: 3, 
    paddingBottom: 10,
    width: 140, // Fixed width to keep cards uniform
  },
  historyImage: {
    width: "100%",
    height: 140,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    resizeMode: "cover",
  },
  historyLabel: {
    fontSize: 13,
    color: "#4B5563",
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 8,
    fontWeight: "500",
  },
});