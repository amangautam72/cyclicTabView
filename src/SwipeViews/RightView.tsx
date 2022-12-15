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
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {SheetProps, SheetRefProps} from './types';

export const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} =
  Dimensions.get('window');

const RightView = React.forwardRef<SheetRefProps, SheetProps>(
  ({width, children, shouldCloseOnBackdrop}, ref) => {
    const translateX = useSharedValue(0);
    const active = useSharedValue(false);

    const scrollTo = useCallback((destination: number) => {
      'worklet';
      active.value = destination !== 0;

      translateX.value = withSpring(destination, {damping: 50});
    }, []);

    const isActive = useCallback(() => {
      return active.value;
    }, []);

    useImperativeHandle(ref, () => ({scrollTo, isActive}), [
      scrollTo,
      isActive,
    ]);

    const context = useSharedValue({x: 0});
    const gesture = Gesture.Pan()
      .onStart(() => {
        context.value = {x: translateX.value};
      })
      .onUpdate(event => {
        if (event.translationX > 0) {
          translateX.value = event.translationX + context.value.x;
          //   translateX.value = Math.max(translateX.value, MAX_TRANSLATE_X);
        }
      })
      .onEnd(() => {
        scrollTo(0);
      });

    const rBottomSheetStyle = useAnimatedStyle(() => {
      return {
        transform: [{translateX: translateX.value}],
      };
    });

    return (
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
          <TouchableOpacity
            onPress={() => shouldCloseOnBackdrop && scrollTo(0)}
            activeOpacity={1}
            style={{
              width: (SCREEN_WIDTH * (100 - width)) / 100,
              opacity: 0,
            }}
          />
          <View
            style={{
              width: (SCREEN_WIDTH * width) / 100,
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
    height: SCREEN_HEIGHT,
    position: 'absolute',
    left: SCREEN_WIDTH,
    flexDirection: 'row',
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

export default RightView;
