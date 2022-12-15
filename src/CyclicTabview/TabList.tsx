import * as React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {TabListProps, TabViewProps} from './Types';

const Tablist = (props: TabListProps) => {
  const {tabs, onPress, current} = props;

  const renderTabs = () => {
    return tabs.map((item, index) => (
      <TouchableOpacity
        key={item.name}
        onPress={() => onPress(index)}
        style={[
          styles.tabStyle,
          {backgroundColor: current === index ? 'purple' : 'blue'},
        ]}>
        <Text style={{color: 'white'}}>{item.name}</Text>
      </TouchableOpacity>
    ));
  };
  return <View style={styles.container}>{renderTabs()}</View>;
};

export default Tablist;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  tabStyle: {
    flex: 1,
    padding: 10,
    backgroundColor: 'blue',
    margin: 5,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
