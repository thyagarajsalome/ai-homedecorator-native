import React, { useEffect } from "react";
import { View, Text, Modal, StyleSheet, DimensionValue } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  FadeIn,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Colors, Typography, Spacing, BorderRadius } from "../theme/designTokens";

const LOADING_STEPS = [
  { emoji: "🔍", text: "Analyzing your room..." },
  { emoji: "🛋️", text: "Removing old furniture..." },
  { emoji: "🎨", text: "Applying new design..." },
  { emoji: "💡", text: "Adjusting lighting & textures..." },
  { emoji: "✨", text: "Finalizing your design..." },
];

// Skeleton shimmer bar
const SkeletonBar: React.FC<{ width: DimensionValue; height?: number; delay?: number }> = ({
  width,
  height = 14,
  delay = 0,
}) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800 + delay, easing: Easing.ease }),
        withTiming(0.3, { duration: 800 + delay, easing: Easing.ease })
      ),
      -1,
      false
    );
  }, [delay, opacity]);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <View style={{ width: width as DimensionValue, alignItems: 'center' }}>
      <Animated.View
        style={[
          animStyle,
          {
            width: '100%',
            height,
            borderRadius: BorderRadius.full,
            backgroundColor: Colors.background.subtle,
            marginVertical: 5,
          },
        ]}
      />
    </View>
  );
};

// Rotating spinner ring
const SpinnerRing: React.FC = () => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1200, easing: Easing.linear }),
      -1,
      false
    );
  }, [rotation]);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View style={[styles.spinnerRing, spinStyle]}>
      <LinearGradient
        colors={[Colors.brand.primary, Colors.brand.secondary, "transparent"]}
        style={styles.spinnerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
    </Animated.View>
  );
};

// Step ticker
const StepTicker: React.FC = () => {
  const [index, setIndex] = React.useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const step = LOADING_STEPS[index];

  return (
    <Animated.View entering={FadeIn.duration(400)} key={index} style={styles.stepRow}>
      <Text style={styles.stepEmoji}>{step.emoji}</Text>
      <Text style={styles.stepText}>{step.text}</Text>
    </Animated.View>
  );
};

const Loader: React.FC = () => {
  return (
    <Modal transparent animationType="fade" visible statusBarTranslucent>
      <View style={styles.overlay}>
        <Animated.View entering={FadeIn.duration(300)} style={styles.card}>
          {/* Spinner */}
          <View style={styles.spinnerContainer}>
            <SpinnerRing />
            <Text style={styles.spinnerEmoji}>🏠</Text>
          </View>

          <Text style={styles.title}>AI is decorating…</Text>

          {/* Animated step text */}
          <StepTicker />

          {/* Skeleton preview bars to suggest something is building */}
          <View style={styles.skeletonContainer}>
            <SkeletonBar width="90%" height={12} delay={0} />
            <SkeletonBar width="70%" height={12} delay={200} />
            <SkeletonBar width="80%" height={12} delay={400} />
          </View>

          <Text style={styles.tip}>
            💡 Tip: Use the Before/After slider to reveal your transformation!
          </Text>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay.modal,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xl,
  },
  card: {
    backgroundColor: "#111827",
    padding: Spacing["3xl"],
    borderRadius: BorderRadius["3xl"],
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(99,102,241,0.3)",
    width: "100%",
    maxWidth: 340,
    gap: Spacing.lg,
  },
  spinnerContainer: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
  },
  spinnerRing: {
    position: "absolute",
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: "hidden",
  },
  spinnerGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 36,
  },
  spinnerEmoji: {
    fontSize: 28,
  },
  title: {
    color: Colors.text.primary,
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    textAlign: "center",
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  stepEmoji: {
    fontSize: 18,
  },
  stepText: {
    color: Colors.text.muted,
    fontSize: Typography.size.base,
    fontStyle: "italic",
  },
  skeletonContainer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  tip: {
    color: Colors.text.disabled,
    fontSize: Typography.size.sm,
    textAlign: "center",
    lineHeight: Typography.lineHeight.normal,
    borderTopWidth: 1,
    borderTopColor: Colors.border.default,
    paddingTop: Spacing.lg,
    width: "100%",
  },
});

export default Loader;
