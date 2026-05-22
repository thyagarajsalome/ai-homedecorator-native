import React, { useEffect, useRef } from "react";
import {
  Modal,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import { Colors, Spacing, BorderRadius, Typography } from "../theme/designTokens";

interface CelebrationModalProps {
  isVisible: boolean;
  onClose: () => void;
}

// Particle Configuration
const PARTICLE_COUNT = 30;
const COLORS = [
  "#6366F1", // Indigo
  "#D946EF", // Fuchsia
  "#8B5CF6", // Violet
  "#FFD700", // Gold
  "#10B981", // Emerald
  "#FF6B6B", // Coral
  "#06B6D4", // Cyan
];

interface Particle {
  id: number;
  color: string;
  size: number;
  isCircle: boolean;
  left: number;
  anim: Animated.Value;
}

const CONTAINER_HEIGHT = 450;
const CONTAINER_WIDTH = 300;

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isVisible,
  onClose,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const coinPulseAnim = useRef(new Animated.Value(1)).current;

  // Generate particles
  const particles = useRef<Particle[]>(
    Array.from({ length: PARTICLE_COUNT }).map((_, idx) => ({
      id: idx,
      color: COLORS[idx % COLORS.length],
      size: Math.random() * 8 + 6,
      isCircle: Math.random() > 0.5,
      left: Math.random() * CONTAINER_WIDTH,
      anim: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    if (isVisible) {
      // 1. Reset anim values
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
      coinPulseAnim.setValue(1);
      particles.forEach((p) => p.anim.setValue(0));

      // 2. Animate Card Entrance
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => {
        // 3. Start Coin Pulsating
        Animated.loop(
          Animated.sequence([
            Animated.timing(coinPulseAnim, {
              toValue: 1.15,
              duration: 1000,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(coinPulseAnim, {
              toValue: 1.0,
              duration: 1000,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ])
        ).start();
      });

      // 4. Animate Confetti Particles
      const animations = particles.map((p) => {
        // Randomize delay and speed
        const delay = Math.random() * 600;
        const duration = Math.random() * 2000 + 1500;
        return Animated.sequence([
          Animated.delay(delay),
          Animated.timing(p.anim, {
            toValue: 1,
            duration: duration,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]);
      });

      Animated.parallel(animations).start();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        {/* Celebration Container */}
        <Animated.View
          style={[
            styles.celebrationCard,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          {/* Confetti Particle Layer (contained within the card limits) */}
          <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
            {particles.map((p) => {
              // Interpolations for falling confetti
              const translateY = p.anim.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, CONTAINER_HEIGHT + 20],
              });

              // Left/Right Drift translation calculation
              const translateX = p.anim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [
                  0,
                  p.id % 2 === 0 ? 30 : -30,
                  p.id % 2 === 0 ? 15 : -15,
                ],
              });

              const rotate = p.anim.interpolate({
                inputRange: [0, 1],
                outputRange: ["0deg", `${360 + p.id * 45}deg`],
              });

              return (
                <Animated.View
                  key={p.id}
                  style={[
                    styles.particle,
                    {
                      backgroundColor: p.color,
                      width: p.size,
                      height: p.isCircle ? p.size : p.size * 1.6,
                      borderRadius: p.isCircle ? p.size / 2 : 1,
                      left: p.left,
                      transform: [
                        { translateY },
                        { translateX },
                        { rotate },
                      ],
                    },
                  ]}
                />
              );
            })}
          </View>

          {/* Sparkles / Stars backgrounds */}
          <Text style={styles.sparkleEmoji1}>✨</Text>
          <Text style={styles.sparkleEmoji2}>✨</Text>
          <Text style={styles.sparkleEmoji3}>🎉</Text>
          <Text style={styles.sparkleEmoji4}>🎉</Text>

          {/* Title */}
          <Text style={styles.congratsTitle}>CONGRATULATIONS!</Text>

          {/* Giant Glowing Coin Area */}
          <Animated.View
            style={[
              styles.coinWrapper,
              { transform: [{ scale: coinPulseAnim }] },
            ]}
          >
            <View style={styles.outerGlow} />
            <View style={styles.innerGlow} />
            <Text style={styles.coinEmoji}>🪙</Text>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>+2 FREE</Text>
            </View>
          </Animated.View>

          {/* Reward Detail */}
          <Text style={styles.rewardTitle}>2 Free Credits Added!</Text>
          <Text style={styles.rewardSubtitle}>
            Welcome to AI Decorator. We've credited your account with 2 free credits so you can transform your space. Use them to paint walls, change flooring, or completely redesign your rooms!
          </Text>

          {/* CTA button */}
          <TouchableOpacity style={styles.ctaButton} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.ctaButtonText}>Start Decorating ✨</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: Colors.overlay.modal,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  celebrationCard: {
    width: CONTAINER_WIDTH,
    height: CONTAINER_HEIGHT,
    backgroundColor: "#1E1E2E", // Custom rich dark purple/slate background
    borderRadius: BorderRadius["3xl"],
    padding: Spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFD700", // Gold border
    position: "relative",
    overflow: "hidden",
    // Premium drop shadow for native/web
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  particle: {
    position: "absolute",
    top: 0,
    opacity: 0.85,
  },
  sparkleEmoji1: {
    position: "absolute",
    top: Spacing.lg,
    left: Spacing.xl,
    fontSize: 26,
    opacity: 0.85,
  },
  sparkleEmoji2: {
    position: "absolute",
    top: Spacing.xl * 2,
    right: Spacing.lg,
    fontSize: 22,
    opacity: 0.85,
  },
  sparkleEmoji3: {
    position: "absolute",
    bottom: Spacing.xl * 3,
    left: Spacing.lg,
    fontSize: 24,
    opacity: 0.75,
  },
  sparkleEmoji4: {
    position: "absolute",
    bottom: Spacing.xl,
    right: Spacing.xl,
    fontSize: 26,
    opacity: 0.75,
  },
  congratsTitle: {
    color: "#FFD700", // Vibrant gold
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.black,
    letterSpacing: 2,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  coinWrapper: {
    width: 110,
    height: 110,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: Spacing.lg,
    position: "relative",
  },
  outerGlow: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 215, 0, 0.15)",
  },
  innerGlow: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255, 215, 0, 0.25)",
    borderWidth: 1.5,
    borderColor: "rgba(255, 215, 0, 0.6)",
  },
  coinEmoji: {
    fontSize: 60,
  },
  badgeContainer: {
    position: "absolute",
    bottom: -6,
    backgroundColor: "#10B981", // Success green
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: "#F8FAFC",
  },
  badgeText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: Typography.weight.black,
    letterSpacing: 0.5,
  },
  rewardTitle: {
    color: Colors.text.primary,
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    textAlign: "center",
    marginTop: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  rewardSubtitle: {
    color: Colors.text.secondary,
    fontSize: Typography.size.sm,
    lineHeight: 18,
    textAlign: "center",
    paddingHorizontal: Spacing.xs,
    marginBottom: Spacing.xl,
  },
  ctaButton: {
    backgroundColor: Colors.brand.primary,
    width: "100%",
    height: 48,
    borderRadius: BorderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.brand.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaButtonText: {
    color: Colors.white,
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.bold,
  },
});
