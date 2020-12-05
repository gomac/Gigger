import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  KeyboardAvoidingView,
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {w, h, totalSize} from '../../../Utils/Dimensions';
import InputField from '../../../components/InputField';
import Continue from './Continue';
import {createFirebaseAccount} from '../../api/Firebase';
import {CheckBox} from 'react-native-elements';

/* const companyLogo =
  global.appType == 'boss'
    ? require('../../../assets/companylogo_tboss.png')
    : require('../../../assets/companylogo_tjob.png') */
const email = require('../../../assets/email.png');
const password = require('../../../assets/password.png');
const repeat = require('../../../assets/repeat.png');
const person = require('../../../assets/person.png');
const phone = require('../../../assets/phone.png');

export default class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isNameError: false,
      isCompanyError: false,
      isEmailError: false,
      isPasswordError: false,
      isPhoneError: false,
      isRepeatError: false,
      isCreatingAccount: false,
      errorMsg: false,
      checked: false,
    };
    alert('Are you ok with this?');
  }

  createUserAccount = () => {
    const name = this.name.getInputValue();
    let company = '';
    if (global.appType === 'boss') {
      company = this.company.getInputValue();
    }
    const email = this.email.getInputValue();
    const password = this.password.getInputValue();
    const phone = this.phone.getInputValue();
    const repeat = this.repeat.getInputValue();

    if (
      name !== '' &&
      email !== '' &&
      password !== '' &&
      repeat !== '' &&
      repeat === password
    ) {
      if (global.appType === 'boss' && company === '') {
        //bail. compnay is mandatory
      } else {
        this.createFireBasePlusUserAccount(name, company, email, password);
      }
    } else if (repeat !== password) {
      this.setState({
        isCreatingAccount: false,
        isRepeatError: repeat === '' || repeat !== password,
        errorMsg: 'Passwords must be identical',
      });
    } else {
      this.setState({
        isCreatingAccount: false,
        isNameError: name === '',
        isCompanyError: company === '',
        isEmailError: email === '',
        isPasswordError: password === '',
        errorMsg: 'Please fill this field',
      });
    }
  };

  createFireBasePlusUserAccount = (name, company, email, password) => {
    this.setState({isCreatingAccount: true});
    createFirebaseAccount(name, company, email, password).then((result) => {
      if (typeof result === 'string') {
        if (result.substring(0, 5) === 'Error') {
          if (result.toString().substring(7, 15) === 'Password') {
            this.setState({
              isCreatingAccount: false,
              isPasswordError: true,
              errorMsg: result,
            });
          } else if (result.includes('email')) {
            this.setState({
              isCreatingAccount: false,
              isEmailError: true,
              errorMsg: result,
            });
          } else {
            console.log('unknown error in registration');
          }
        } else {
        }
      } else {
        this.props.change('login')();
        this.setState({isCreatingAccount: false});
      }
    });
  };

  changeInputFocus = (name) => () => {
    switch (name) {
      case 'Name':
        this.setState({isNameError: this.name.getInputValue() === ''});
        this.name.input.focus();
        break;
      case 'Company':
        this.setState({isCompanyError: this.company.getInputValue() === ''});
        this.company.input.focus();
        break;
      case 'Email':
        this.setState({isEmailError: this.email.getInputValue() === ''});
        this.password.input.focus();
        break;
      case 'Password':
        this.setState({
          isPasswordError: this.password.getInputValue() === '',
          isRepeatError:
            this.repeat.getInputValue() !== '' &&
            this.repeat.getInputValue() !== this.password.getInputValue(),
        });
        this.repeat.input.focus();
        break;
      case 'Phone':
        this.setState({isPhoneError: this.phone.getInputValue() === ''});
        this.phone.input.focus();
        break;
      default:
        this.setState({
          isRepeatError:
            this.repeat.getInputValue() === '' ||
            this.repeat.getInputValue() !== this.password.getInputValue(),
        });
    }
  };

  render() {
    return (
      <KeyboardAwareScrollView>
        <View style={styles.container}>
          {/*           <Image
            style={styles.icon}
            resizeMode="contain"
            source={companyLogo}
          /> */}
          <Text style={styles.create}>CREATE ACCOUNT</Text>
          <InputField
            placeholder="name"
            autoCapitalize="words"
            error={this.state.isNameError}
            errorMsg={this.state.errorMsg}
            style={styles.input}
            focus={this.changeInputFocus}
            ref={(ref) => (this.name = ref)}
            icon={person}
          />
          {global.appType === 'boss' && (
            <InputField
              placeholder="company"
              autoCapitalize="words"
              error={this.state.isCompanyError}
              errorMsg={this.state.errorMsg}
              style={styles.input}
              focus={this.changeInputFocus}
              ref={(ref) => (this.company = ref)}
              icon={person}
            />
          )}
          <InputField
            placeholder="Email"
            keyboardType="email-address"
            error={this.state.isEmailError}
            errorMsg={this.state.errorMsg}
            style={styles.input}
            focus={this.changeInputFocus}
            ref={(ref) => (this.email = ref)}
            icon={email}
          />
          <InputField
            placeholder="Phone"
            keyboardType="phone-pad"
            error={this.state.isPhoneError}
            errorMsg={this.state.errorMsg}
            style={styles.input}
            focus={this.changeInputFocus}
            ref={(ref) => (this.phone = ref)}
            icon={phone}
          />
          <InputField
            placeholder="Password"
            error={this.state.isPasswordError}
            errorMsg={this.state.errorMsg}
            style={styles.input}
            focus={this.changeInputFocus}
            ref={(ref) => (this.password = ref)}
            secureTextEntry={true}
            icon={password}
          />
          <InputField
            placeholder="Repeat Password"
            error={this.state.isRepeatError}
            errorMsg={this.state.errorMsg}
            style={styles.input}
            secureTextEntry={true}
            returnKeyType="done"
            blurOnSubmit={true}
            focus={this.changeInputFocus}
            ref={(ref) => (this.repeat = ref)}
            icon={repeat}
          />
          <View style={{alignSelf: 'flex-start'}}>
            <CheckBox
              containerStyle={styles.checkboxContainer}
              textStyle={styles.checkboxText}
              title="Send me self promotion tips and offers"
              checked={this.state.checked}
              checkedColor={'lawngreen'}
              onPress={() => this.setState({checked: !this.state.checked})}
            />
          </View>

          <Continue
            isCreating={this.state.isCreatingAccount}
            click={this.createUserAccount}
          />
          <TouchableOpacity
            onPress={this.props.change('login')}
            style={styles.touchable}>
            <Text style={styles.signIn}>{'<'} Sign In</Text>
          </TouchableOpacity>
          <KeyboardAvoidingView />
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

Register.propTypes = {
  change: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  create: {
    color: 'white',
    fontSize: totalSize(2.2),
    fontWeight: '700',
  },
  icon: {
    width: w(65),
    height: h(20),
  },
  signIn: {
    color: '#ffffffEE',
    fontSize: totalSize(2),
    fontWeight: '700',
  },
  touchable: {
    alignSelf: 'flex-start',
    marginLeft: w(8),
    marginTop: h(4),
  },
  input: {
    marginVertical: h(1),
  },
  checkboxContainer: {
    backgroundColor: '#4c69a5',
    borderColor: '#4c69a5',
  },
  checkboxText: {
    fontSize: 10,
    color: '#fff',
  },
});
