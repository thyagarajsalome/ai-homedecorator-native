import React, { ReactNode } from "react";
import { View, Text, StyleSheet, Image, StatusBar, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";

type HeaderProps = {
  children?: ReactNode;
};

const Header: React.FC<HeaderProps> = ({ children }) => {
  const insets = useSafeAreaInsets();
  const statusBarHeight = insets.top > 0 ? insets.top : (Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 20);

  return (
    <BlurView intensity={80} tint="dark" style={[styles.header, { paddingTop: statusBarHeight }]}>
      <View style={styles.headerNav}>
        <View style={styles.headerLogoContainer}>
          {/* Updated to use your provided logo */}
          <Image
            source={require("../assets/images/icon.png")}
            style={{ width: 32, height: 32, borderRadius: 8 }}
            resizeMode="contain"
          />
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>AI Decorator</Text>
          </View>
        </View>
        <View>{children}</View>
      </View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "rgba(5, 5, 5, 0.6)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  headerNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 60,
    paddingHorizontal: 20,
  },
  headerLogoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerTitleContainer: {
    justifyContent: "center",
  },
  headerTitle: {
    color: "#F8FAFC",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});

export default Header;
