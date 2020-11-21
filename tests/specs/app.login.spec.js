import LoginScreen from '../screenobjectslogin.screen';
import hamburgerScreen from '../screenobjects/hamburger.screen';
import HomeScreen from '../screenobjects/home.screen';
//import ErrorField from '../screenobjects/components/error.field';
import {expect} from 'chai';
import {getTextOfElement} from '../helpers/utils';
//import {driver} from 'selenium-webdriver/chrome';

const SELECTORS = {
  ERROR_MSG: '~errorMsg',
};

describe('Entering INvalid credentials to login form,', () => {
  beforeEach(() => {
    LoginScreen.waitForIsShown(true);
  });

  it('should not allow login to proceed', () => {
    LoginScreen.email.setValue('xyz@gmail.com');
    LoginScreen.password.setValue('ppppp');

    LoginScreen.loginButton.click();

    //const elem = $('~errorMsg');
    const elem = getTextOfElement($(SELECTORS.ERROR_MSG));

    expect(elem).contain('Error: No record found. You must register first.');
  });
});

describe('Entering valid credentials to login form,', () => {
  beforeEach(() => {
    LoginScreen.waitForIsShown(true);
  });

  it('should be able login successfully', () => {
    LoginScreen.email.setValue('gigger1@gmail.com');
    LoginScreen.password.setValue('ppppp123');

    LoginScreen.loginButton.click();
    HomeScreen.waitForIsShown();
    expect(HomeScreen.list.isExisting()).to.equal(true);
  });
});

describe('Logging off should return to the login screen,', () => {
  beforeEach(() => {
    HomeScreen.waitForIsShown(true);
  });

  it('should show login screen', async () => {
    hamburgerScreen.hamburgerScreen.click();
    const elem = $('~LogoutDesc');
    elem.click();
    LoginScreen.waitForIsShown();
    //HomeScreen.logout.click();
    expect(LoginScreen.loginScreen.isExisting()).to.equal(true);
  });
});
