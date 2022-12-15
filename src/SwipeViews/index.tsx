import React, {useRef, useCallback} from 'react';
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import BottomSheet, {SCREEN_HEIGHT, SCREEN_WIDTH} from './BottomSheet';
import RightView from './RightView';
import LeftView from './LeftView';
import {SheetRefProps} from './types';

const SwipeViews = () => {
  const ref = useRef<SheetRefProps>(null);
  const leftRef = useRef<SheetRefProps>(null);
  const rightRef = useRef<SheetRefProps>(null);

  const onPress = useCallback((viewRef: any, to: number) => {
    const isActive = viewRef?.isActive();
    if (isActive) {
      viewRef?.scrollTo(0);
    } else {
      viewRef?.scrollTo(to);
    }
  }, []);

  const openLeftModal = () => {
    onPress(leftRef.current, SCREEN_WIDTH);
  };

  const openRightModal = () => {
    onPress(rightRef.current, -SCREEN_WIDTH);
  };

  const openBottomModal = () => {
    onPress(ref.current, -SCREEN_HEIGHT);
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={styles.container}>
        <StatusBar />
        <TouchableOpacity style={styles.button} onPress={openBottomModal}>
          <Text style={{color: 'white'}}>Bottom</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: 'green'}]}
          onPress={openLeftModal}>
          <Text style={{color: 'white'}}>Left</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: 'blue'}]}
          onPress={openRightModal}>
          <Text style={{color: 'white'}}>Right</Text>
        </TouchableOpacity>
        <BottomSheet ref={ref} height={50} shouldCloseOnBackdrop={true}>
          <View style={styles.childrenContainer}></View>
        </BottomSheet>
        <LeftView ref={leftRef} width={70} shouldCloseOnBackdrop={false}>
          <View style={styles.childrenContainer}></View>
        </LeftView>

        <RightView ref={rightRef} width={70} shouldCloseOnBackdrop={true}>
          <View style={styles.childrenContainer}></View>
        </RightView>
      </View>
    </GestureHandlerRootView>
  );
};

export default SwipeViews;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  childrenContainer: {
    flex: 1,
    backgroundColor: 'orange',
    borderRadius: 20,
  },
  button: {
    height: 50,
    width: 50,
    borderRadius: 25,
    aspectRatio: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
