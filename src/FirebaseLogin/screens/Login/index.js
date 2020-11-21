import React, {useState, useRef} from 'react';
import './../../../../global.js';
import {StyleSheet, View, TouchableOpacity, Text, Image} from 'react-native';
import InputField from '../../../components/InputField';
import {w, h, totalSize} from '../../../Utils/Dimensions';
import GetStarted from './GetStarted';
import {userLogin} from '../../api/Firebase';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {testProperties} from '../../../Utils/TestProperties';
import LinearGradient from 'react-native-linear-gradient';
import store from 'react-native-simple-store';

const companyLogo =
  global.appType == 'boss'
    ? require('../../../assets/companylogo_tboss.png')
    : require('../../../assets/companylogo_tjob.png');
const emailImg = require('../../../assets/email.png');
const passwordImg = require('../../../assets/password.png');

const Login = (props) => {
  const [isEmailError, setIsEmailError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);

  const [isLogin, setIsLogin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const emailRef = useRef();
  const passwordRef = useRef();

  const getStarted = () => {
    const email = emailRef.current.getInputValue().trim();
    const password = passwordRef.current.getInputValue();

    if (email !== '' && password !== '') {
      loginToFireBase(email, password);
    } else {
      setErrorMsg('Please fill this field');
    }

    setIsEmailError(false);
    setIsPasswordError(false);
  };

  const changeInputFocus = (name) => () => {
    if (name === '') {
      setIsEmailError(emailRef.current.getInputValue() === '');
      passwordRef.current.getInputValue();
    } else {
      setIsPasswordError(passwordRef.current.getInputValue() === '');
    }
  };

  const loginToFireBase = (email, password) => {
    setIsLogin(true);
    userLogin(email, password).then((reply) => {
      //reply is either an error or a user record
      if (typeof reply === 'string') {
        if (reply.substring(0, 5) === 'Error') {
          setIsLogin(false);
          setIsEmailError(true);
          setErrorMsg(reply);
        } else {
          console.log('unknown error in login');
        }
      } else {
        setIsLogin(false);
      }
    });
  };

  return (
    <LinearGradient
      start={{x: 0.0, y: 0.25}}
      end={{x: 0.5, y: 1.0}}
      colors={['#5692CE', '#5E82E3']}
      style={{flex: 1}}>
      <KeyboardAwareScrollView
        resetScrollToCoords={{x: 0, y: 0}}
        contentContainerStyle={styles.container}
        scrollEnabled={false}
        enableOnAndroid={true}
        {...testProperties('Login-screen')}>
        {global.appType === 'user' && (
          <TouchableOpacity
            onPress={props.change('Home')}
            style={styles.skipText}
            activeOpacity={0.6}>
            <Text style={styles.skipText}>skip</Text>
          </TouchableOpacity>
        )}
        <Image style={styles.icon} resizeMode="contain" source={companyLogo} />
        <InputField
          placeholder="Email"
          {...testProperties('Email')}
          keyboardType="email-address"
          error={isEmailError}
          errorMsg={errorMsg}
          focus={changeInputFocus}
          ref={emailRef}
          icon={emailImg}
        />
        <View style={{marginTop: 25}} />
        <InputField
          placeholder="Password"
          {...testProperties('Password')}
          returnKeyType="done"
          secureTextEntry={true}
          blurOnSubmit={true}
          password={true}
          error={isPasswordError}
          errorMsg={errorMsg}
          ref={passwordRef}
          focus={changeInputFocus}
          icon={passwordImg}
        />
        <GetStarted
          {...testProperties('Login-button')}
          click={getStarted}
          isLogin={isLogin}
        />
        <View style={styles.textContainer}>
          <TouchableOpacity
            onPress={props.change('register')}
            style={styles.touchable}
            activeOpacity={0.6}>
            <Text style={styles.createAccount}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={props.change('forgot')}
            style={styles.touchable}
            activeOpacity={0.6}>
            <Text style={styles.forgotPassword}>Forgot Password</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: w(70),
    height: h(25),
  },
  textContainer: {
    width: w(100),
    flexDirection: 'row',
    marginTop: h(10),
  },
  email: {
    marginBottom: h(4.5),
  },
  touchable: {
    flex: 1,
  },
  createAccount: {
    color: '#ffffffEE',
    textAlign: 'center',
    fontSize: totalSize(2),
    fontWeight: '600',
  },
  forgotPassword: {
    color: '#ffffffEE',
    textAlign: 'center',
    fontSize: totalSize(2),
    fontWeight: '600',
  },
  skipText: {
    alignSelf: 'flex-end',
    color: '#ffffffEE',
    textAlign: 'center',
    marginRight: 20,
    fontSize: totalSize(2),
    fontWeight: '600',
  },
});

export default Login;
