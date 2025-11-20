import React, { ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LogoIcon } from "./Icons";

type HeaderProps = {
  children?: ReactNode;
};

const Header: React.FC<HeaderProps> = ({ children }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <View style={styles.headerNav}>
        <View style={styles.headerLogoContainer}>
          <LogoIcon style={{ width: 28, height: 28 }} />
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>AI Decorator</Text>
          </View>
        </View>
        <View>{children}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#0F172A", // Match app background for seamless look
    // Removed border for cleaner look, rely on content separation
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
  headerSubtitle: {
    color: "#94A3B8",
    fontSize: 11,
  },
});

export default Header;
