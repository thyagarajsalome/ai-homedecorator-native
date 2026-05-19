import React from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface DesignItem {
  id: string;
  beforeImage: string;
  afterImage: string;
  styleName: string;
}

const MOCK_DESIGNS: DesignItem[] = [
  {
    id: "1",
    beforeImage: "https://via.placeholder.com/400x400?text=Before+1",
    afterImage: "https://via.placeholder.com/400x400?text=After+1",
    styleName: "Scandinavian",
  },
  {
    id: "2",
    beforeImage: "https://via.placeholder.com/400x400?text=Before+2",
    afterImage: "https://via.placeholder.com/400x400?text=After+2",
    styleName: "Industrial",
  },
  {
    id: "3",
    beforeImage: "https://via.placeholder.com/400x400?text=Before+3",
    afterImage: "https://via.placeholder.com/400x400?text=After+3",
    styleName: "Japandi",
  },
  {
    id: "4",
    beforeImage: "https://via.placeholder.com/400x400?text=Before+4",
    afterImage: "https://via.placeholder.com/400x400?text=After+4",
    styleName: "Cyberpunk",
  },
];

const GalleryScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Community Gallery</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>Explore how others have transformed their spaces</Text>

        <View style={styles.grid}>
          {MOCK_DESIGNS.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: item.beforeImage }} style={styles.image} />
                <View style={styles.vsBadge}>
                  <Text style={styles.vsText}>VS</Text>
                </View>
                <Image source={{ uri: item.afterImage }} style={styles.image} />
              </View>
              <View style={styles.cardFooter}>
                <Text style={styles.styleName}>{item.styleName}</Text>
                <TouchableOpacity style={styles.likeButton}>
                  <Text style={styles.likeText}>❤️</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#050505" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    gap: 16,
  },
  backButton: {
    padding: 8,
    backgroundColor: "#1E293B",
    borderRadius: 10,
  },
  backText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
  title: { color: "#FFF", fontSize: 24, fontWeight: "800" },
  content: { padding: 20 },
  subtitle: { color: "#94A3B8", fontSize: 16, marginBottom: 24, textAlign: "center" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  card: {
    width: "48%",
    backgroundColor: "#0F172A",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 16,
  },
  imageContainer: {
    height: 240,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "50%",
    resizeMode: "cover",
  },
  vsBadge: {
    position: "absolute",
    top: "45%",
    left: "40%",
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    borderWidth: 2,
    borderColor: "#0F172A",
  },
  vsText: { color: "#FFF", fontSize: 10, fontWeight: "bold" },
  cardFooter: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  styleName: { color: "#F8FAFC", fontSize: 14, fontWeight: "600" },
  likeButton: {
    backgroundColor: "#1E293B",
    padding: 6,
    borderRadius: 10,
  },
  likeText: { fontSize: 12 },
});

export default GalleryScreen;
