import React from 'react';
import { View, StyleSheet, Dimensions, Image, Text, ImageSourcePropType } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Calculate image size based on screen width minus padding (32 on each side)
const IMAGE_SIZE = SCREEN_WIDTH - 64; 

interface BeforeAfterSliderProps {
  beforeImage: ImageSourcePropType;
  afterImage: ImageSourcePropType;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ beforeImage, afterImage }) => {
  const position = useSharedValue(IMAGE_SIZE / 2);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      // Keep the slider within the image bounds
      if (e.x >= 0 && e.x <= IMAGE_SIZE) {
        position.value = e.x;
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    width: position.value,
  }));

  const sliderStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value - 14 }], // Offset by half the width of the thumb
  }));

  return (
    <View style={[styles.container, { width: IMAGE_SIZE, height: IMAGE_SIZE }]}>
      
      {/* Bottom Image (Before) */}
      <Image source={beforeImage} style={styles.fullImage} />
      <View style={[styles.badge, styles.badgeRight]}>
        <Text style={styles.badgeText}>Original</Text>
      </View>

      {/* Top Image (After - Clipped via Reanimated) */}
      <Animated.View style={[styles.clippedView, animatedStyle]}>
        <Image source={afterImage} style={styles.fullImage} />
        <View style={[styles.badge, styles.badgeLeft]}>
          <Text style={styles.badgeText}>AI Design</Text>
        </View>
      </Animated.View>

      {/* The Draggable Slider */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.sliderContainer, sliderStyle]}>
          <View style={styles.sliderLine} />
          <View style={styles.sliderButton}>
            <Text style={styles.arrows}>{'< >'}</Text>
          </View>
          <View style={styles.sliderLine} />
        </Animated.View>
      </GestureDetector>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#1E293B',
    position: 'relative',
    alignSelf: 'center',
  },
  fullImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    position: 'absolute',
  },
  clippedView: {
    height: IMAGE_SIZE,
    overflow: 'hidden',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  badge: {
    position: 'absolute',
    top: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    zIndex: 10,
  },
  badgeLeft: {
    left: 16,
    backgroundColor: '#6366F1',
  },
  badgeRight: {
    right: 16,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sliderContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  sliderLine: {
    flex: 1,
    width: 3,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  sliderButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  arrows: {
    color: '#6366F1',
    fontWeight: '900',
    fontSize: 10,
    letterSpacing: -1,
  },
});

export default BeforeAfterSlider;