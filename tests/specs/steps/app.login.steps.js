import {context} from '../../data/Context';
import LoginScreen from '../../screenobjects/login.screen';
import HomeScreen from '../../screenobjects/home.screen';
import {expect} from 'chai';
import {Given, When, Then} from 'cucumber';
import {getTextOfElement} from '../../helpers/utils';

const SELECTORS = {
  ERROR_MSG: '~errorMsg',
};

Given(/^I'm on the login screen$/, () => {
  LoginScreen.waitForIsShown(true);
});

When(
  /^I try to log in with credentials; email: '(.+)' and password: '(.+)'$/,
  (email, password) => {
    LoginScreen.login(email, password);
  },
);

Then(/^app displays a message that the credentials are invalid$/, () => {
  const elem = getTextOfElement($(SELECTORS.ERROR_MSG));
  expect(elem).contain('Error: No record found. You must register first.');
});

When(/^I log in with the user'(.+)'$/, (Boss) => {
  const user = context.logins[Boss];
  LoginScreen.login(user.email, user.password);
  HomeScreen.waitForIsShown();
});

Then(/^app displays alert of successful login$/, () => {
  expect(HomeScreen.list.isExisting()).to.equal(true);
});
