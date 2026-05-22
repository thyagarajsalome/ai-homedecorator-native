import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Colors, Spacing, BorderRadius, Typography } from "../theme/designTokens";

interface HelpTutorialModalProps {
  isVisible: boolean;
  onClose: () => void;
}

interface TutorialStep {
  title: string;
  description: string;
  image: any;
  highlight: {
    top: number;
    left: number;
    width: number;
    height: number;
    borderRadius?: number;
  };
  arrow: {
    top: number;
    left: number;
    rotation: string;
  };
}

const HIGHLIGHT_COLOR = "#FF7A00";

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    title: "1. Create Account or Sign In",
    description: "Welcome to AI Decorator! First, sign in with your email or use Google to authenticate. Each new user receives free design credits.",
    image: require("../assets/images/tutorials/1.png"),
    highlight: {
      top: 63.5,
      left: 11,
      width: 78,
      height: 9,
      borderRadius: 12,
    },
    arrow: {
      top: 53.5,
      left: 48,
      rotation: "270deg", // Points down
    },
  },
  {
    title: "2. Upload a Real Room Photo",
    description: "Click 'Upload Photo' to select a picture, or 'Use Camera' to snap one. For the best result, always use real photos of your room, not AI mockups.",
    image: require("../assets/images/tutorials/2.png"),
    highlight: {
      top: 55.5,
      left: 10,
      width: 80,
      height: 14,
      borderRadius: 12,
    },
    arrow: {
      top: 45.5,
      left: 48,
      rotation: "270deg", // Points down
    },
  },
  {
    title: "3. Choose Element & Preset Style",
    description: "Select which room element you want to modify (like Flooring or Wall Paint), then browse and click a style preset card from the carousel.",
    image: require("../assets/images/tutorials/3.png"),
    highlight: {
      top: 59.0,
      left: 6.0,
      width: 26.0,
      height: 5.5,
      borderRadius: 20,
    },
    arrow: {
      top: 50.0,
      left: 13.0,
      rotation: "270deg", // Points down to Flooring tab
    },
  },
  {
    title: "4. Compare and Save your Design",
    description: "Drag the center slider handle left or right to compare your original room with the new AI design. Tap 'Save' to download your creation!",
    image: require("../assets/images/tutorials/4.png"),
    highlight: {
      top: 46.0,
      left: 46.0,
      width: 8.0,
      height: 8.0,
      borderRadius: 999, // Circle spotlight around handle
    },
    arrow: {
      top: 45.5,
      left: 28.0,
      rotation: "180deg", // Points right to the slider handle
    },
  },
];

const TutorialArrow = () => (
  <Svg viewBox="0 0 24 24" style={{ width: 32, height: 32 }}>
    <Path
      d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
      fill={HIGHLIGHT_COLOR}
    />
  </Svg>
);

export const HelpTutorialModal: React.FC<HelpTutorialModalProps> = ({
  isVisible,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const pulseValue = useRef(new Animated.Value(1)).current;

  // Pulsating animation for overlays
  useEffect(() => {
    if (isVisible) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseValue, {
            toValue: 1.2,
            duration: 850,
            useNativeDriver: true,
          }),
          Animated.timing(pulseValue, {
            toValue: 1,
            duration: 850,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseValue.setValue(1);
    }
  }, [isVisible, currentStep]);

  if (!isVisible) return null;

  const step = TUTORIAL_STEPS[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      setCurrentStep(0);
      onClose();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <Text style={styles.modalHeaderTitle}>💡 User Guide & Tutorial</Text>

          {/* Screenshot Container with Overlays */}
          <View style={styles.imageOuterWrapper}>
            <View style={styles.imageContainer}>
              <Image
                source={step.image}
                style={styles.screenshot}
                resizeMode="cover"
              />

              {/* Contrast Masks (spotlight effect - dims background) */}
              <View style={[styles.maskSegment, { top: 0, left: 0, right: 0, height: `${step.highlight.top}%` }]} />
              <View style={[styles.maskSegment, { top: `${step.highlight.top + step.highlight.height}%`, left: 0, right: 0, bottom: 0 }]} />
              <View style={[styles.maskSegment, { top: `${step.highlight.top}%`, left: 0, width: `${step.highlight.left}%`, height: `${step.highlight.height}%` }]} />
              <View style={[styles.maskSegment, { top: `${step.highlight.top}%`, left: `${step.highlight.left + step.highlight.width}%`, right: 0, height: `${step.highlight.height}%` }]} />

              {/* Highlighting Box Outline (No background fill, just sharp orange border + glow) */}
              <Animated.View
                style={[
                  styles.highlightBox,
                  {
                    top: `${step.highlight.top}%`,
                    left: `${step.highlight.left}%`,
                    width: `${step.highlight.width}%`,
                    height: `${step.highlight.height}%`,
                    borderRadius: step.highlight.borderRadius ?? BorderRadius.sm,
                    opacity: pulseValue.interpolate({
                      inputRange: [1, 1.2],
                      outputRange: [0.85, 1],
                    }),
                  } as any,
                ]}
              />

              {/* Pointing Arrow Overlay */}
              <Animated.View
                style={[
                  styles.arrowContainer,
                  {
                    top: `${step.arrow.top}%`,
                    left: `${step.arrow.left}%`,
                    transform: [
                      { rotate: step.arrow.rotation },
                      { scale: pulseValue },
                    ],
                  } as any,
                ]}
              >
                <TutorialArrow />
              </Animated.View>
            </View>
          </View>

          {/* Info and Captions */}
          <View style={styles.infoContainer}>
            <Text style={step.highlight.top !== undefined ? styles.stepTitle : styles.stepTitle}>{step.title}</Text>
            <Text style={styles.stepDescription}>{step.description}</Text>
          </View>

          {/* Step Dots Indicators */}
          <View style={styles.dotsRow}>
            {TUTORIAL_STEPS.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i === currentStep && styles.dotActive,
                ]}
              />
            ))}
          </View>

          {/* Action Row */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              onPress={handleBack}
              disabled={isFirstStep}
              style={[
                styles.actionBtn,
                styles.secondaryBtn,
                isFirstStep && styles.disabledBtn,
              ]}
            >
              <Text style={styles.actionBtnText}>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleNext}
              style={[styles.actionBtn, styles.primaryBtn]}
            >
              <Text style={[styles.actionBtnText, { color: Colors.white }]}>
                {isLastStep ? "Finish" : "Next"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Close link */}
          <TouchableOpacity onPress={onClose} style={styles.closeLinkBtn}>
            <Text style={styles.closeLinkText}>Dismiss Guide</Text>
          </TouchableOpacity>
        </View>
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
  modalCard: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: Colors.background.elevated,
    borderRadius: BorderRadius["3xl"],
    padding: Spacing.xl,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border.brand,
  },
  modalHeaderTitle: {
    color: Colors.text.primary,
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    marginBottom: Spacing.md,
  },
  imageOuterWrapper: {
    width: 240,
    height: 438,
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    backgroundColor: Colors.background.input,
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  screenshot: {
    width: "100%",
    height: "100%",
  },
  maskSegment: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.65)",
  },
  highlightBox: {
    position: "absolute",
    borderWidth: 2,
    borderColor: HIGHLIGHT_COLOR,
    backgroundColor: "transparent",
    shadowColor: HIGHLIGHT_COLOR,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1.0,
    shadowRadius: 8,
  },
  arrowContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    marginTop: Spacing.lg,
    alignItems: "center",
    paddingHorizontal: Spacing.xs,
  },
  stepTitle: {
    color: Colors.brand.primaryLight,
    fontWeight: Typography.weight.bold,
    fontSize: Typography.size.base,
    textAlign: "center",
    marginBottom: Spacing.xs,
  },
  stepDescription: {
    color: Colors.text.secondary,
    fontSize: Typography.size.sm + 1,
    lineHeight: 18,
    textAlign: "center",
  },
  dotsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginVertical: Spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.background.subtle,
  },
  dotActive: {
    backgroundColor: HIGHLIGHT_COLOR,
    width: 16,
  },
  actionsRow: {
    flexDirection: "row",
    width: "100%",
    gap: Spacing.md,
  },
  actionBtn: {
    flex: 1,
    height: 46,
    borderRadius: BorderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryBtn: {
    backgroundColor: Colors.brand.primary,
  },
  secondaryBtn: {
    backgroundColor: Colors.background.subtle,
  },
  disabledBtn: {
    opacity: 0.35,
  },
  actionBtnText: {
    color: Colors.text.secondary,
    fontWeight: Typography.weight.semiBold,
    fontSize: Typography.size.base,
  },
  closeLinkBtn: {
    marginTop: Spacing.md,
    padding: Spacing.xs,
  },
  closeLinkText: {
    color: Colors.text.disabled,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    textDecorationLine: "underline",
  },
});
