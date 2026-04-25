// screens/HomeScreen.tsx
import React from "react";
import { ScrollView, TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // Changed import to match your original setup
import { useFocusEffect } from "@react-navigation/native";

import { useHomeState } from "../hooks/useHomeState";
import Header from "../components/Header";
import Loader from "../components/Loader";
import { ImageUploader } from "../components/home/ImageUploader";
import { DesignHistory } from "../components/home/DesignHistory";
import { GeneratedImageDisplay } from "../components/home/GeneratedImageDisplay";
import { InfoGuide } from "../components/home/InfoGuide";

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { state, actions } = useHomeState(navigation);

  useFocusEffect(
    React.useCallback(() => {
      actions.fetchUserData();
    }, [actions.fetchUserData])
  );

  if (state.isLoading) return <Loader />;

  // Display the generated image if we have both source and result
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

  // Main UI
  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <Header>
        <TouchableOpacity onPress={actions.logout} style={styles.headerBtn}>
          <Text style={styles.headerBtnText}>Log Out</Text>
        </TouchableOpacity>
      </Header>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {!state.sourceImageUrl ? (
          <>
            {/* Step 1: User hasn't uploaded an image yet */}
            <DesignHistory history={state.history} />
            <ImageUploader onImageSelected={actions.setSourceImageUrl} />
            <InfoGuide />
          </>
        ) : (
          <View style={styles.configurationContainer}>
             {/* Step 2: User uploaded an image, show configuration UI */}
             {/* FIX: Replaced the raw comment with an actual View to satisfy JSX rules */}
             <Text style={styles.configText}>
               Image uploaded! Bring in your RoomTypePicker and Styles here.
             </Text>
             
             {/* Temporary reset button so you don't get stuck */}
             <TouchableOpacity 
               style={styles.cancelBtn} 
               onPress={actions.resetState}
             >
               <Text style={styles.cancelBtnText}>Cancel & Reselect Image</Text>
             </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// Brought back basic layout styles to prevent redlines
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#0F172A" 
  },
  scrollContent: { 
    padding: 16, 
    paddingBottom: 40 
  },
  headerBtn: { 
    backgroundColor: "#334155", 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 8 
  },
  headerBtnText: { 
    color: "#F8FAFC", 
    fontSize: 12, 
    fontWeight: "600" 
  },
  configurationContainer: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#1E293B",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#334155",
  },
  configText: {
    color: "#94A3B8",
    marginBottom: 20,
    textAlign: "center"
  },
  cancelBtn: {
    backgroundColor: "#EF4444",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12
  },
  cancelBtnText: {
    color: "white",
    fontWeight: "bold"
  }
});

export default HomeScreen;