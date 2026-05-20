import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

import { BeforeAfterSlider } from "../components/BeforeAfterSlider";
import { Colors, Spacing, BorderRadius, Typography } from "../theme/designTokens";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Load the generated assets directly
const beforeLivingRoom = require("../assets/images/onboarding/before_living_hall.png");
const afterLivingRoom = require("../assets/images/onboarding/after_living_hall.png");
const beforeBedroom = require("../assets/images/onboarding/before_bedroom.png");
const afterBedroom = require("../assets/images/onboarding/after_bedroom.png");
const beforeKitchen = require("../assets/images/onboarding/before_kitchen.png");
const afterKitchen = require("../assets/images/onboarding/after_kitchen.png");
const beforeBathroom = require("../assets/images/onboarding/before_bathroom.png");
const afterBathroom = require("../assets/images/onboarding/after_bathroom.png");

interface OnboardingScreenProps {
  navigation: any;
}

const TOTAL_SLIDES = 5;

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentSlide < TOTAL_SLIDES - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleCompleteOnboarding("SignUp");
    }
  };

  const handleCompleteOnboarding = async (targetScreen: "Login" | "SignUp") => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    try {
      await AsyncStorage.setItem("has_seen_onboarding", "true");
    } catch (e) {
      console.error("Error saving onboarding state", e);
    }
    navigation.replace(targetScreen);
  };

  const renderSlideContent = () => {
    switch (currentSlide) {
      case 0:
        return (
          <Animated.View
            entering={FadeIn.duration(400)}
            exiting={FadeOut.duration(300)}
            key="slide0"
            style={styles.slideContainer}
          >
            <View style={styles.sliderWrapper}>
              <BeforeAfterSlider
                beforeImage={beforeLivingRoom}
                afterImage={afterLivingRoom}
              />
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.title}>Transform Living Halls</Text>
              <Text style={styles.subtitle}>
                Snap a photo of your main living area and instantly redesign it in 30+ stunning interior design styles.
              </Text>
            </View>
          </Animated.View>
        );
      case 1:
        return (
          <Animated.View
            entering={FadeIn.duration(400)}
            exiting={FadeOut.duration(300)}
            key="slide1"
            style={styles.slideContainer}
          >
            <View style={styles.sliderWrapper}>
              <BeforeAfterSlider
                beforeImage={beforeBedroom}
                afterImage={afterBedroom}
              />
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.title}>Create Cozy Bedrooms</Text>
              <Text style={styles.subtitle}>
                Turn cold, empty bedrooms into warm, beautifully styled sanctuaries that match your aesthetic.
              </Text>
            </View>
          </Animated.View>
        );
      case 2:
        return (
          <Animated.View
            entering={FadeIn.duration(400)}
            exiting={FadeOut.duration(300)}
            key="slide2"
            style={styles.slideContainer}
          >
            <View style={styles.sliderWrapper}>
              <BeforeAfterSlider
                beforeImage={beforeKitchen}
                afterImage={afterKitchen}
              />
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.title}>Design Gourmet Kitchens</Text>
              <Text style={styles.subtitle}>
                Visualize modern marble countertops, sleek cabinets, and gourmet layouts instantly.
              </Text>
            </View>
          </Animated.View>
        );
      case 3:
        return (
          <Animated.View
            entering={FadeIn.duration(400)}
            exiting={FadeOut.duration(300)}
            key="slide3"
            style={styles.slideContainer}
          >
            <View style={styles.sliderWrapper}>
              <BeforeAfterSlider
                beforeImage={beforeBathroom}
                afterImage={afterBathroom}
              />
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.title}>Revitalize Bathrooms</Text>
              <Text style={styles.subtitle}>
                Redesign vanity areas, showers, and washrooms into clean, spa-like luxury environments.
              </Text>
            </View>
          </Animated.View>
        );
      case 4:
        return (
          <Animated.View
            entering={FadeIn.duration(400)}
            exiting={FadeOut.duration(300)}
            key="slide4"
            style={styles.slideContainer}
          >
            <View style={styles.benefitsWrapper}>
              <Text style={styles.benefitsHeader}>Why Choose AI Decorator?</Text>
              
              <View style={styles.benefitRow}>
                <View style={[styles.benefitIconBox, { backgroundColor: "rgba(99, 102, 241, 0.15)" }]}>
                  <Text style={styles.benefitIcon}>👑</Text>
                </View>
                <View style={styles.benefitTextCol}>
                  <Text style={styles.benefitTitle}>Ultra-HD Quality</Text>
                  <Text style={styles.benefitDesc}>Download print-ready, high-resolution clean designs without watermarks.</Text>
                </View>
              </View>

              <View style={styles.benefitRow}>
                <View style={[styles.benefitIconBox, { backgroundColor: "rgba(217, 70, 239, 0.15)" }]}>
                  <Text style={styles.benefitIcon}>⚡</Text>
                </View>
                <View style={styles.benefitTextCol}>
                  <Text style={styles.benefitTitle}>Instant Transformation</Text>
                  <Text style={styles.benefitDesc}>No designer fees, no waiting. Generate your dream room in under 10 seconds.</Text>
                </View>
              </View>

              <View style={styles.benefitRow}>
                <View style={[styles.benefitIconBox, { backgroundColor: "rgba(16, 185, 129, 0.15)" }]}>
                  <Text style={styles.benefitIcon}>🎁</Text>
                </View>
                <View style={styles.benefitTextCol}>
                  <Text style={styles.benefitTitle}>Free Trial Included</Text>
                  <Text style={styles.benefitDesc}>Sign up today to get free credits and transform your first room on us.</Text>
                </View>
              </View>
            </View>
          </Animated.View>
        );
      default:
        return null;
    }
  };

  return (
    <LinearGradient colors={["#0F172A", "#1E293B"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Skip button for the onboarding slides before the last slide */}
        <View style={styles.header}>
          <Image
            source={require("../assets/images/icon.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          {currentSlide < TOTAL_SLIDES - 1 && (
            <TouchableOpacity
              onPress={() => handleCompleteOnboarding("Login")}
              style={styles.skipButton}
            >
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Dynamic Slide Content */}
        <View style={styles.content}>{renderSlideContent()}</View>

        {/* Footer with indicators and CTAs */}
        <View style={styles.footer}>
          {/* Dot Indicators */}
          <View style={styles.indicatorContainer}>
            {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.indicatorDot,
                  currentSlide === i && styles.indicatorDotActive,
                ]}
              />
            ))}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            {currentSlide < TOTAL_SLIDES - 1 ? (
              <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>Continue</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.ctaButtonContainer}>
                <TouchableOpacity
                  style={styles.primaryCta}
                  onPress={() => handleCompleteOnboarding("SignUp")}
                >
                  <LinearGradient
                    colors={["#8B5CF6", "#D946EF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.ctaGradient}
                  >
                    <Text style={styles.ctaText}>Get Started For Free</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryCta}
                  onPress={() => handleCompleteOnboarding("Login")}
                >
                  <Text style={styles.loginText}>
                    Already have an account? <Text style={styles.loginLink}>Sign In</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  skipButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  skipText: {
    color: Colors.text.muted,
    fontSize: Typography.size.sm + 1,
    fontWeight: Typography.weight.semiBold,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  slideContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  sliderWrapper: {
    marginVertical: Spacing.lg,
    width: "100%",
  },
  benefitsWrapper: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    gap: Spacing.xl,
    paddingVertical: Spacing.xl,
  },
  benefitsHeader: {
    color: Colors.text.primary,
    fontSize: Typography.size.xl + 2,
    fontWeight: Typography.weight.extraBold,
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
  },
  benefitIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  benefitIcon: {
    fontSize: 22,
  },
  benefitTextCol: {
    flex: 1,
  },
  benefitTitle: {
    color: Colors.text.primary,
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.bold,
  },
  benefitDesc: {
    color: Colors.text.muted,
    fontSize: Typography.size.sm,
    lineHeight: 18,
    marginTop: 2,
  },
  textWrapper: {
    alignItems: "center",
    marginTop: Spacing.xl,
  },
  title: {
    color: Colors.text.primary,
    fontSize: Typography.size["2xl"],
    fontWeight: Typography.weight.extraBold,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  subtitle: {
    color: Colors.text.muted,
    fontSize: Typography.size.base,
    lineHeight: Typography.lineHeight.normal,
    textAlign: "center",
    paddingHorizontal: Spacing.md,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: Spacing.xl,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  indicatorDotActive: {
    width: 24,
    backgroundColor: "#818CF8",
  },
  actionContainer: {
    width: "100%",
  },
  nextButton: {
    backgroundColor: "#6366F1",
    height: 56,
    borderRadius: BorderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  nextButtonText: {
    color: "#FFF",
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.bold,
  },
  ctaButtonContainer: {
    width: "100%",
    gap: Spacing.md,
  },
  primaryCta: {
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    height: 56,
  },
  ctaGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  ctaText: {
    color: "#FFF",
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.bold,
  },
  secondaryCta: {
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    color: Colors.text.muted,
    fontSize: Typography.size.sm + 1,
  },
  loginLink: {
    color: "#818CF8",
    fontWeight: Typography.weight.bold,
  },
});

export default OnboardingScreen;
