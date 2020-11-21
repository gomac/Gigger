import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Badge} from 'react-native-elements';

const styles = StyleSheet.create({
  baseText: {
    fontFamily: 'Cochin',
    fontWeight: 'normal',
    fontSize: 13,
  },
});

export const StatusDisplay = ({
  pendingNum = 0,
  rejectedNum = 0,
  acceptedNum = 0,
  style = {},
}) => (
  <View alignItems="flex-start" flexDirection="row">
    {pendingNum > 0 && (
      <Badge value={pendingNum} status="warning" style={styles.baseText} />
    )}
    {rejectedNum > 0 && (
      <Badge value={rejectedNum} status="error" style={styles.baseText} />
    )}
    {acceptedNum > 0 && (
      <Badge value={acceptedNum} status="success" style={styles.baseText} />
    )}
  </View>
);
