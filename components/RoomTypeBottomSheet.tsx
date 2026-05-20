import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Dimensions, Modal } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  runOnJS 
} from 'react-native-reanimated';
import { ROOM_TYPES } from '../constants';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.6; // Sheet covers 60% of screen height

interface RoomTypeBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  selectedValue: string;
  onSelect: (value: string) => void;
}

export const RoomTypeBottomSheet: React.FC<RoomTypeBottomSheetProps> = ({
  isVisible,
  onClose,
  selectedValue,
  onSelect,
}) => {
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const [modalVisible, setModalVisible] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setModalVisible(true);
      translateY.value = withSpring(SCREEN_HEIGHT - SHEET_HEIGHT, { damping: 15 });
    } else {
      translateY.value = withTiming(SCREEN_HEIGHT, {}, (finished) => {
        if (finished) {
          runOnJS(setModalVisible)(false);
        }
      });
    }
  }, [isVisible, translateY]);

  const closeSheet = () => {
    translateY.value = withTiming(SCREEN_HEIGHT, {}, () => {
      runOnJS(onClose)();
    });
  };

  // Drag down gesture to close sheet natively
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = SCREEN_HEIGHT - SHEET_HEIGHT + event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > 120 || event.velocityY > 500) {
        runOnJS(closeSheet)();
      } else {
        translateY.value = withSpring(SCREEN_HEIGHT - SHEET_HEIGHT, { damping: 15 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Modal
      transparent
      visible={modalVisible}
      animationType="none"
      onRequestClose={closeSheet}
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        {/* Backdrop */}
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1} 
          onPress={closeSheet} 
        />

        {/* Bottom Sheet Card */}
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.sheetContainer, animatedStyle]}>
            {/* Drag Handle Indicator */}
            <View style={styles.dragHandle} />
            
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Select Room Type</Text>
              <TouchableOpacity onPress={closeSheet}>
                <Text style={styles.sheetCloseText}>Done</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={ROOM_TYPES}
              keyExtractor={(item) => item}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.itemRow,
                    item === selectedValue && styles.itemRowActive,
                  ]}
                  onPress={() => {
                    onSelect(item);
                    closeSheet();
                  }}
                >
                  <Text
                    style={[
                      styles.itemText,
                      item === selectedValue && styles.itemTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                  {item === selectedValue && (
                    <View style={styles.checkmark}>
                      <Text style={{ color: 'white', fontSize: 12 }}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              )}
            />
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 99,
  },
  sheetContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: SHEET_HEIGHT,
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: '#334155',
    zIndex: 100,
    paddingTop: 10,
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#475569',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 10,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    backgroundColor: '#0F172A',
  },
  sheetTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
  },
  sheetCloseText: {
    color: '#6366F1',
    fontSize: 15,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 40,
  },
  itemRow: {
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemRowActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
  },
  itemText: {
    color: '#CBD5E1',
    fontSize: 16,
  },
  itemTextActive: {
    color: '#818CF8',
    fontWeight: '700',
  },
  checkmark: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
});