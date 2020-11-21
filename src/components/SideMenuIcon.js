import React from 'react';
import {View, StyleSheet} from 'react-native';
import {testProperties} from '../Utils/TestProperties';

import {colors} from '../Utils/constants';
import {Icon} from 'react-native-elements';

const styles = StyleSheet.create({
  iconContainer: {
    width: 40,
    left: 10,
  },
});

const SideMenuIcon = ({onPress}) => (
  <View style={styles.iconContainer} {...testProperties('Hamburger-screen')}>
    <Icon underlayColor="transparent" onPress={onPress} name="menu" />
  </View>
);

export default SideMenuIcon;
