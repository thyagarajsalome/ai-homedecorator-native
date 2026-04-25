// screens/HomeScreen.tsx
import React, { useState } from "react";
import { 
  ScrollView, 
  TouchableOpacity, 
  Text, 
  View, 
  StyleSheet, 
  Image, 
  TextInput,
  KeyboardAvoidingView,
  Platform 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

import { useHomeState } from "../hooks/useHomeState";
import Header from "../components/Header";
import Loader from "../components/Loader";
import { ImageUploader } from "../components/home/ImageUploader";
import { DesignHistory } from "../components/home/DesignHistory";
import { GeneratedImageDisplay } from "../components/home/GeneratedImageDisplay";
import { InfoGuide } from "../components/home/InfoGuide";

const ROOM_TYPES = ["Living Room", "Bedroom", "Kitchen", "Bathroom", "Office", "Dining Room"];
const DESIGN_STYLES = ["Modern", "Minimalist", "Industrial", "Bohemian", "Scandinavian", "Traditional"];

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { state, actions } = useHomeState(navigation);
  
  const [selectedRoom, setSelectedRoom] = useState(ROOM_TYPES[0]);
  const [selectedStyle, setSelectedStyle] = useState(DESIGN_STYLES[0]);
  const [customPrompt, setCustomPrompt] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      actions.fetchUserData();
    }, [actions.fetchUserData])
  );

  const onGeneratePress = () => {
    // Calls the optimized logic (compression + 2-image limit check)
    actions.handleDecorate(selectedRoom, customPrompt, selectedStyle, 1);
  };

  if (state.isLoading) return <Loader />;

  // Display the Result View if an image was generated
  if (state.generatedImageUrl && state.sourceImageUrl) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
         <Header />
         <ScrollView contentContainerStyle={styles.scrollContent}>
           <GeneratedImageDisplay 
              sourceImage={state.sourceImageUrl} 
              generatedImage={state.generatedImageUrl} 
              onReset={actions.resetState} 
           />
         </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Header>
          <View style={styles.headerRight}>
            <View style={styles.creditBadge}>
              <Text style={styles.creditText}>✨ {state.credits} Credits</Text>
            </View>
            <TouchableOpacity onPress={actions.logout} style={styles.logoutBtn}>
              <Text style={styles.logoutBtnText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </Header>
        
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {!state.sourceImageUrl ? (
            <>
              <DesignHistory history={state.history} />
              <ImageUploader onImageSelected={actions.setSourceImageUrl} />
              <InfoGuide />
            </>
          ) : (
            <View style={styles.configurationContainer}>
               <Text style={styles.stepTitle}>Configure Your Design</Text>
               
               <Image source={{ uri: state.sourceImageUrl }} style={styles.previewImage} />

               <Text style={styles.label}>1. Select Room Type</Text>
               <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsRow}>
                 {ROOM_TYPES.map((type) => (
                   <TouchableOpacity 
                     key={type} 
                     onPress={() => setSelectedRoom(type)}
                     style={[styles.chip, selectedRoom === type && styles.chipSelected]}
                   >
                     <Text style={[styles.chipText, selectedRoom === type && styles.chipTextSelected]}>
                       {type}
                     </Text>
                   </TouchableOpacity>
                 ))}
               </ScrollView>

               <Text style={styles.label}>2. Select Design Style</Text>
               <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsRow}>
                 {DESIGN_STYLES.map((style) => (
                   <TouchableOpacity 
                     key={style} 
                     onPress={() => setSelectedStyle(style)}
                     style={[styles.chip, selectedStyle === style && styles.chipSelected]}
                   >
                     <Text style={[styles.chipText, selectedStyle === style && styles.chipTextSelected]}>
                       {style}
                     </Text>
                   </TouchableOpacity>
                 ))}
               </ScrollView>

               <Text style={styles.label}>3. Additional Instructions (Optional)</Text>
               <TextInput
                 style={styles.textInput}
                 placeholder="e.g. Add a blue sofa, more plants..."
                 placeholderTextColor="#64748B"
                 value={customPrompt}
                 onChangeText={setCustomPrompt}
                 multiline
               />

               <TouchableOpacity 
                 style={styles.generateBtn} 
                 onPress={onGeneratePress}
               >
                 <Text style={styles.generateBtnText}>✨ Generate Design</Text>
               </TouchableOpacity>

               <TouchableOpacity 
                 style={styles.cancelBtn} 
                 onPress={actions.resetState}
               >
                 <Text style={styles.cancelBtnText}>Cancel & Reselect Image</Text>
               </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A" },
  scrollContent: { padding: 16, paddingBottom: 40 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  creditBadge: { backgroundColor: "#1E293B", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: "#334155" },
  creditText: { color: "#F8FAFC", fontSize: 12, fontWeight: "700" },
  logoutBtn: { backgroundColor: "#334155", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  logoutBtnText: { color: "#F8FAFC", fontSize: 12, fontWeight: "600" },
  configurationContainer: { padding: 20, backgroundColor: "#1E293B", borderRadius: 20, borderWidth: 1, borderColor: "#334155", marginTop: 10 },
  stepTitle: { color: "#F8FAFC", fontSize: 20, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  previewImage: { width: "100%", height: 180, borderRadius: 12, marginBottom: 20, resizeMode: "cover" },
  label: { color: "#94A3B8", fontSize: 14, fontWeight: "600", marginBottom: 10, marginTop: 10 },
  optionsRow: { flexDirection: "row", marginBottom: 10 },
  chip: { backgroundColor: "#0F172A", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: "#334155", height: 38 },
  chipSelected: { backgroundColor: "#3B82F6", borderColor: "#3B82F6" },
  chipText: { color: "#94A3B8", fontWeight: "500" },
  chipTextSelected: { color: "#FFFFFF", fontWeight: "bold" },
  textInput: { backgroundColor: "#0F172A", borderRadius: 12, padding: 12, color: "#F8FAFC", borderWidth: 1, borderColor: "#334155", minHeight: 80, textAlignVertical: "top", marginTop: 5 },
  generateBtn: { backgroundColor: "#3B82F6", paddingVertical: 14, borderRadius: 12, alignItems: "center", marginTop: 24, marginBottom: 12 },
  generateBtnText: { color: "white", fontWeight: "bold", fontSize: 16 },
  cancelBtn: { paddingVertical: 12, alignItems: "center" },
  cancelBtnText: { color: "#EF4444", fontWeight: "600", fontSize: 14 }
});

export default HomeScreen;