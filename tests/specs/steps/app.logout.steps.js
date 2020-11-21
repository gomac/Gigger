import LoginScreen from '../../screenobjects/login.screen';
import HomeScreen from '../../screenobjects/home.screen';
import hamburgerScreen from '../../screenobjects/hamburger.screen';
import {expect} from 'chai';
import {Given, When, Then} from 'cucumber';

Given(/^I'm on the list screen$/, () => {
  HomeScreen.waitForIsShown(true);
});

When(/^I press log out on the side menu$/, () => {
  hamburgerScreen.hamburgerScreen.click();
});

Then(/^app displays login screen$/, () => {
  const elem = $('~LogoutDesc');
  elem.click();
  LoginScreen.waitForIsShown();
  //HomeScreen.logout.click();
  expect(LoginScreen.loginScreen.isExisting()).to.equal(true);
});
