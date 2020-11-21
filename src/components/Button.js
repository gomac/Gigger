import React, {forwardRef, useImperativeHandle} from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {w, h, totalSize} from '../Utils/Dimensions';
import LinearGradient from 'react-native-linear-gradient';
const styles = StyleSheet.create({
  button: {
    backgroundColor: 'blue',
    paddingVertical: 5,
    paddingHorizontal: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonLoading: {
    backgroundColor: 'blue',
  },
  text: {
    fontWeight: '500',
    fontSize: 18,
    color: '#fff',
  },
  rowButton: {
    width: '50%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: w(2),
    borderRadius: w(10),
    marginTop: h(6),
  },
  appButtonContainer: {
    elevation: 2,
    backgroundColor: '#009688',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  appButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
    textTransform: 'uppercase',
  },
  small: {
    alignSelf: 'center',
    color: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallText: {
    fontSize: 12,
    color: '#fff',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const Button = forwardRef((props, ref) => {
  const {text, onPress, loading = false, style = {}, type} = props;

  useImperativeHandle(
    ref,

    () => ({
      validate() {
        ref.current.onPress();
      },
    }),
  );

  return (
    <TouchableOpacity onPress={onPress} disabled={loading}>
      <LinearGradient
        colors={['#004d40', '#009688']}
        style={[
          styles.appButtonContainer,
          loading && styles.buttonLoading,
          style,
          type === 'small' && styles.small,
        ]}>
        <Text
          style={[styles.appButtonText, type === 'small' && styles.smallText]}>
          {text}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
});
