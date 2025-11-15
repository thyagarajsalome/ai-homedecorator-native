import React, { ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";
import { LogoIcon } from "./Icons";

type HeaderProps = {
  children?: ReactNode;
};

const Header: React.FC<HeaderProps> = ({ children }) => {
  return (
    <View style={styles.header}>
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
    backgroundColor: "rgba(17, 24, 39, 0.8)",
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
    // This ensures header is inside safe area padding on iOS
    paddingTop: 0,
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
