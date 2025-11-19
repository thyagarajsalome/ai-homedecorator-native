import React, { ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LogoIcon } from "./Icons";

type HeaderProps = {
  children?: ReactNode;
};

const Header: React.FC<HeaderProps> = ({ children }) => {
  // Get the safe area insets (this handles the notch/status bar height dynamically)
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <View style={styles.headerNav}>
        <View style={styles.headerLogoContainer}>
          <LogoIcon />
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>AI Home Decorator</Text>
            <Text style={styles.headerSubtitle}>
              See your dream space come to life.
            </Text>
          </View>
        </View>
        {/* This View will hold the buttons if they are passed in */}
        <View>{children}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "rgba(17, 24, 39, 0.95)", // Slightly higher opacity for better readability
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
    // Padding top is handled dynamically via insets in the component
  },
  headerNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 64,
    paddingHorizontal: 16,
  },
  headerLogoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitleContainer: {
    marginLeft: 16,
  },
  headerTitle: {
    color: "#C084FC",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: "#9CA3AF",
    fontSize: 12,
  },
});

export default Header;
