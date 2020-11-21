import React, {useContext} from 'react';
import {KeyboardAvoidingView, StyleSheet, ImageBackground} from 'react-native';
import Login from './screens/Login';
import Register from './screens/Register';
import ForgotPassword from './screens/ForgotPassword';
import {w} from '../Utils/Dimensions';
//import {AuthContext} from '../Utils/context';
import {AuthContext, AuthProvider, useAuth} from '../Utils/context';
//import auth from '@react-native-firebase/auth';
//import store from 'react-native-simple-store';
//import {useAuthState} from 'react-firebase-hooks/auth';

const FirebaseLogin = (props) => {
  const {newUser} = useAuth();
  const [useCurrentScreen, setCurrentScreen] = React.useState('login');

  const changeScreen = (screenName) => () => {
    setCurrentScreen(screenName);
  };

  //const {isNewUser} = this.context;
  let screenToShow;
  switch (useCurrentScreen) {
    case 'login':
      screenToShow = <Login change={changeScreen} />;
      break;
    case 'register':
      screenToShow = <Register change={changeScreen} />;
      break;
    case 'forgot':
      screenToShow = <ForgotPassword change={changeScreen} />;
      break;
  }
  return (
    <KeyboardAvoidingView
      behavior="position"
      keyboardVerticalOffset={-w(40)}
      style={styles.container}>
      <ImageBackground
        source={props.background}
        style={styles.background}
        resizeMode="stretch">
        {screenToShow}
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

FirebaseLogin.propTypes = {
  //login: PropTypes.func.isRequired,
};

FirebaseLogin.defaultProps = {
  background: null,
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#555',
  },
  background: {
    width: '100%',
    height: '100%',
  },
});

export default FirebaseLogin;
