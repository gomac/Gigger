import {context} from '../../data/Context';
import JobBasicScreen from '../../screenobjects/jobModel/jobBasic.screen';
import {expect} from 'chai';
import {Given, When, Then} from 'cucumber';
import {getTextOfElement} from '../../helpers/utils';

const SELECTORS = {
  ERROR_MSG: '~errorMsg',
};

Given(/^I'm on the login screen$/, () => {
  JobBasicScreen.waitForIsShown(true);
});

When(/^I add basic job'(.+)'$/, (Job1) => {
  const user = context.jobBasic[Job1];
  JobBasicScreen.login(name, description);
  HomeScreen.waitForIsShown();
});

Then(/^app displays alert of successful login$/, () => {
  expect(HomeScreen.list.isExisting()).to.equal(true);
});
