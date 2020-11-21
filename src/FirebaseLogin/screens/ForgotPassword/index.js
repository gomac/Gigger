import React, {useEffect, useState, useRef} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import {w, h, totalSize} from '../../../Utils/Dimensions';
import InputField from '../../../components/InputField';
import Firebase from '../../api/Firebase';

const emailImg = require('../../../assets/email.png');

const ForgotPassword = (props) => {
  const [isEmailError, setIsEmailError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [email, setEmail] = useState('');

  const emailRef = useRef();

  // useState updates are async but dont have a callback parameter like
  // setState. useEffect is the custom way
  useEffect(() => {
    if (email !== '') {
      sendEmailWithPassword(email);
    } else {
      setErrorMsg('Enter correct e-mail address');
    }
  }, [email]);

  const sendEmail = () => {
    if (typeof emailRef.current !== 'undefined') {
      setEmail(emailRef.current.getInputValue());

      setIsEmailError(email === '');
    }
  };

  const sendEmailWithPassword = () => {
    Firebase.sendEmailWithPassword(email).then((result) => {
      if (result) {
        props.change('login')();
      }
    });
  };

  const changeInputFocus = (name) => () => {
    if (name === '') {
      setIsEmailError(emailRef.current.getInputValue() === '');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.forgot}>Forgot Your Password?</Text>
      <InputField
        placeholder="Email"
        keyboardType="email-address"
        error={isEmailError}
        errorMsg={errorMsg}
        returnKeyType="done"
        blurOnSubmit={true}
        focus={changeInputFocus}
        ref={emailRef}
        icon={emailImg}
      />
      <TouchableOpacity
        onPress={sendEmail}
        activeOpacity={0.6}
        style={styles.button}>
        <Text style={styles.buttonText}>Send Email</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={props.change('login')}
        style={styles.touchable}>
        <Text style={styles.login}>{'<'} Back To Login</Text>
      </TouchableOpacity>
    </View>
  );
};

ForgotPassword.propTypes = {
  change: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgot: {
    color: 'white',
    fontSize: totalSize(2.5),
    marginBottom: h(5),
    fontWeight: '700',
  },
  button: {
    width: w(85),
    marginTop: h(6),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingVertical: w(1.8),
    borderRadius: w(25),
    borderColor: '#E0E0E0',
    borderWidth: 1,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    paddingVertical: h(1),
    fontSize: totalSize(2),
  },
  login: {
    color: '#ffffffEE',
    fontSize: totalSize(2),
    fontWeight: '700',
  },
  touchable: {
    alignSelf: 'flex-start',
    marginLeft: w(8),
    marginTop: h(4),
  },
});

export default ForgotPassword;
