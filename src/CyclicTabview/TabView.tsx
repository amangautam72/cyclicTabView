import React, {useEffect, useRef} from 'react';
import {Dimensions, View} from 'react-native';

import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {TabViewProps} from './Types';

export const ITEM_WIDTH = Dimensions.get('window').width;

const TabView = (props: TabViewProps) => {
  const {scenes, length, current, onTabChange, cyclic, animated} = props;
  const transateX = useSharedValue(0);
  let translateSides = -(ITEM_WIDTH * current) - ITEM_WIDTH;
  let shouldAnimate = useRef(animated);

  useEffect(() => {
    if (animated && shouldAnimate.current) {
      transateX.value = withTiming(-(ITEM_WIDTH * current));
    } else {
      shouldAnimate.current = true;
      transateX.value = -(ITEM_WIDTH * current);
    }
  }, [current]);

  const setView = (value: number) => {
    if (value < 0) {
      shouldAnimate.current = false;
      onTabChange(length - 1);
    } else if (value > length - 1) {
      shouldAnimate.current = false;
      onTabChange(0);
    } else {
      onTabChange(value);
    }
  };

  const shouldSwipeLeft = cyclic || (!cyclic && current !== 0);
  const shouldSwipeRight = cyclic || (!cyclic && current !== length - 1);

  const gestureEvent = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>(
    {
      onStart: (event, context) => {
        context.translateX = transateX.value;
      },
      onActive: (event, context) => {
        transateX.value = event.translationX + context.translateX;
      },
      onFinish(event, context) {
        if (
          shouldSwipeRight &&
          event.translationX &&
          event.translationX < -(ITEM_WIDTH / 3)
        ) {
          transateX.value = withTiming(-ITEM_WIDTH * (current + 1), {}, () => {
            runOnJS(setView)(current + 1);
          });
        } else if (
          shouldSwipeLeft &&
          event.translationX &&
          event.translationX > ITEM_WIDTH / 3
        ) {
          transateX.value = withTiming(-ITEM_WIDTH * (current - 1), {}, () => {
            runOnJS(setView)(current - 1);
          });
        } else {
          transateX.value = withTiming(context.translateX);
        }
      },
    },
  );

  const sharedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: transateX.value}],
    };
  });

  return (
    <PanGestureHandler onGestureEvent={gestureEvent} enabled={length > 1}>
      <Animated.View
        style={[
          {
            flex: 1,
            flexDirection: 'row',
          },
          sharedStyle,
        ]}>
        {current === 0 && (
          <View
            style={{marginLeft: translateSides, flex: 1, flexDirection: 'row'}}>
            {scenes[length - 1]}
          </View>
        )}

        <View style={{flex: 1, flexDirection: 'row'}}>
          {Object.keys(scenes).map(item => scenes[item])}
        </View>

        {current === length - 1 && (
          <View style={{marginRight: translateSides, flexDirection: 'row'}}>
            {scenes[0]}
          </View>
        )}
      </Animated.View>
    </PanGestureHandler>
  );
};

export default TabView;
