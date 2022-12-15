/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useRef, useState} from 'react';
import {
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import Tablist from './TabList';
import TabView, {ITEM_WIDTH} from './TabView';

export const randomColor = () => {
  return (
    '#' +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0')
      .toUpperCase()
  );
};

export const renderScene = (
  color: string,
  number: number,
  removeTab?: Function,
) => {
  return (
    <View
      key={number.toString()}
      style={{
        width: ITEM_WIDTH,
        backgroundColor: color,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>Tab {number}</Text>

      <TouchableOpacity
        onPress={() => removeTab?.(number)}
        style={{padding: 10, backgroundColor: 'Grey'}}>
        <Text>Remove Tab</Text>
      </TouchableOpacity>
    </View>
  );
};

const initialState = [{name: 'Tab 0'}];

const CyclicTabView = () => {
  const tabScenes = useRef<any>({
    '0': renderScene('white', 0),
  });
  const tabs = useRef(initialState);
  const [index, setIndex] = useState(0);

  const addTab = () => {
    const backDrop = randomColor();

    tabScenes.current[tabs.current.length] = renderScene(
      backDrop,
      tabs.current.length,
      removeTab,
    );
    const tab = {
      name: 'Tab ' + tabs.current.length,
    };
    tabs.current.push(tab);
    setIndex(tabs.current.length - 1);
  };

  const removeTab = (key: any) => {
    delete tabScenes.current[key];
    tabs.current = tabs.current.filter((item, index) => index != key);
    setIndex(0);
  };

  const onTabSelection = (value: number) => {
    setIndex(value);
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={styles.container}>
        <SafeAreaView />
        <StatusBar
          barStyle={'light-content'}
          backgroundColor={Colors.lighter}
        />

        <TouchableOpacity onPress={addTab} style={styles.tabStyle}>
          <Text style={{color: 'white'}}>Add Tab</Text>
        </TouchableOpacity>
        <Tablist tabs={tabs.current} onPress={onTabSelection} current={index} />

        <TabView
          scenes={tabScenes.current}
          length={tabs.current.length}
          current={index}
          onTabChange={onTabSelection}
          cyclic={true}
          animated={true}
        />
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  tabStyle: {
    padding: 10,
    backgroundColor: 'blue',
    margin: 5,
    borderRadius: 6,
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
});

export default CyclicTabView;
