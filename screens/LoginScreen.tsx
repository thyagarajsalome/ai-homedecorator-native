import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
  Image,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LogoIcon } from "../components/Icons";
import Header from "../components/Header";
import { supabase } from "../lib/supabase";

const { width } = Dimensions.get("window");

// --- Hero Slider Component ---
const SLIDER_IMAGES = [
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?q=80&w=1000&auto=format&fit=crop", // Living Room
  "https://images.unsplash.com/photo-1616594039964-40891a9a3c47?q=80&w=1000&auto=format&fit=crop", // Bedroom
  "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1000&auto=format&fit=crop", // Kitchen
  "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop", // Bathroom
];

const HomeDecorSlider = () => {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % SLIDER_IMAGES.length;
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        return nextIndex;
      });
    }, 4000); // Auto-scroll every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.sliderContainer}>
      <FlatList
        ref={flatListRef}
        data={SLIDER_IMAGES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.sliderImage} />
        )}
        getItemLayout={(_, QX) => ({
          length: width,
          offset: width * QX,
          index: QX,
        })}
      />
      <View style={styles.overlay}>
        <Text style={styles.overlayText}>Design Your Dream Home</Text>
      </View>
    </View>
  );
};

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        Alert.alert("Login Error", error.message);
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={styles.appContainer}
      edges={["bottom", "left", "right"]}
    >
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <HomeDecorSlider />

        <View style={styles.formContainer}>
          <View style={styles.headerSection}>
            <LogoIcon style={{ width: 50, height: 50, marginBottom: 16 }} />
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Log in to continue decorating</Text>
          </View>

          <TextInput
            style={styles.textInput}
            placeholder="Email"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.textInput}
            placeholder="Password"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Logging in..." : "Login"}
            </Text>
          </TouchableOpacity>

          {/* Bottom Section */}
          <View style={styles.bottomSection}>
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <Text style={styles.linkText}>
                Don't have an account? <Text style={styles.link}>Sign Up</Text>
              </Text>
            </TouchableOpacity>

            <View style={styles.legalContainer}>
              <Text style={styles.legalText}>
                By logging in, you agree to our
              </Text>
              <View style={styles.legalLinks}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Privacy")}
                >
                  <Text style={styles.legalLink}>Privacy Policy</Text>
                </TouchableOpacity>
                <Text style={styles.legalText}> and </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Disclaimer")}
                >
                  <Text style={styles.legalLink}>Disclaimer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: "#111827",
  },
  scrollContent: {
    flexGrow: 1,
  },
  sliderContainer: {
    height: 250,
    width: "100%",
    position: "relative",
  },
  sliderImage: {
    width: width,
    height: 250,
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "flex-end",
    padding: 20,
  },
  overlayText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  formContainer: {
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: "#111827",
    marginTop: -20, // Overlap slightly with slider
    flex: 1,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#9CA3AF",
  },
  textInput: {
    width: "100%",
    backgroundColor: "#374151",
    color: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#4B5563",
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    width: "100%",
    backgroundColor: "#4F46E5",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: "#374151",
    opacity: 0.7,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  bottomSection: {
    marginTop: "auto",
    alignItems: "center",
    paddingTop: 20,
  },
  linkText: {
    color: "#9CA3AF",
    fontSize: 15,
    marginBottom: 24,
  },
  link: {
    color: "#C084FC",
    fontWeight: "bold",
  },
  legalContainer: {
    alignItems: "center",
  },
  legalLinks: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  legalText: {
    color: "#6B7280",
    fontSize: 12,
  },
  legalLink: {
    color: "#9CA3AF",
    fontSize: 12,
    textDecorationLine: "underline",
  },
});

export default LoginScreen;
