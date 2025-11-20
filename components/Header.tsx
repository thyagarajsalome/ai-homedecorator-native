import React, { ReactNode } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type HeaderProps = {
  children?: ReactNode;
};

const Header: React.FC<HeaderProps> = ({ children }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top }]}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#0F172A",
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
