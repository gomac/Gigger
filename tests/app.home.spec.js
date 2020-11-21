import HomeScreen from '../screenobjects/home.screen';
import SearchScreen from '../screenobjects/search.screen';
import EnquiryScreen from '../screenobjects/enquiry.screen';
import Gestures from '../helpers/Gestures';

describe('When interacting with a Home and Search forms,', () => {
  it('should be able search successfully', () => {
    HomeScreen.location.setValue('Canberra ACT, Australia');
    HomeScreen.location.setValue('Home location');

    driver.touchPerform([
      {
        action: 'press',
        options: {
          x: 200,
          y: 300,
        },
      },
      {
        action: 'press',
        options: {
          x: 200,
          y: 500,
        },
      },
      {
        action: 'release',
      },
    ]);

    if (driver.isKeyboardShown()) {
      driver.hideKeyboard();
    }

    expect(HomeScreen.searchButton.isExisting()).toEqual(true);
    HomeScreen.searchButton.click();
  });

  it('click takes you to enquire screen', () => {
    Gestures.checkIfDisplayedWithScrollDown(SearchScreen.enquireButton, 2);
    expect(SearchScreen.enquireButton.isExisting()).toEqual(true);
    SearchScreen.enquireButton.click();

    if (driver.isKeyboardShown()) {
      driver.hideKeyboard();
    }
  });

  it('should be able to click Send Enquiry and fail successfully', () => {
    EnquiryScreen.sendEnquiryButton.click();

    if (driver.isKeyboardShown()) {
      driver.hideKeyboard();
    }
    EnquiryScreen.alert.waitForIsShown(true);
    //expect an alert
    //expect(EnquiryScreen.alert.isExisting()).toEqual(true);
  });
});
