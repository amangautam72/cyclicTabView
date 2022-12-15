import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useImperativeHandle} from 'react';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {SheetProps, SheetRefProps} from './types';

export const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} =
  Dimensions.get('window');

const BottomSheet = React.forwardRef<SheetRefProps, SheetProps>(
  ({height, children, shouldCloseOnBackdrop}, ref) => {
    const translateY = useSharedValue(0);
    const active = useSharedValue(false);

    const scrollTo = useCallback((destination: number) => {
      'worklet';
      active.value = destination !== 0;

      translateY.value = withSpring(destination, {damping: 50});
    }, []);

    const isActive = useCallback(() => {
      return active.value;
    }, []);

    useImperativeHandle(ref, () => ({scrollTo, isActive}), [
      scrollTo,
      isActive,
    ]);

    const context = useSharedValue({y: 0});
    const gesture = Gesture.Pan()
      .onStart(() => {
        context.value = {y: translateY.value};
      })
      .onUpdate(event => {
        console.log(event.translationY);
        if (event.translationY > 0) {
          translateY.value = event.translationY + context.value.y;
          //   translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
        }
      })
      .onEnd(() => {
        scrollTo(0);
      });

    const rBottomSheetStyle = useAnimatedStyle(() => {
      return {
        transform: [{translateY: translateY.value}],
      };
    });

    return (
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
          <TouchableOpacity
            onPress={() => shouldCloseOnBackdrop && scrollTo(0)}
            activeOpacity={1}
            style={{
              height: (SCREEN_HEIGHT * (100 - (height || 100))) / 100,
              opacity: 0,
            }}
          />
          <View
            style={{
              height: (SCREEN_HEIGHT * (height || 100)) / 100,
            }}>
            {children}
          </View>
        </Animated.View>
      </GestureDetector>
    );
  },
);

const styles = StyleSheet.create({
  bottomSheetContainer: {
    // height: (SCREEN_HEIGHT * 60) / 100,
    width: SCREEN_WIDTH,
    position: 'absolute',
    top: SCREEN_HEIGHT,
  },
  line: {
    width: 75,
    height: 4,
    backgroundColor: 'grey',
    alignSelf: 'center',
    marginVertical: 15,
    borderRadius: 2,
  },
});

export default BottomSheet;
