import AppScreen from './app.screen';

const SELECTORS = {
  HOME_SCREEN: '~Home-screen',

  LIST_VIEW: '~List',
  HAMBURGER: '~Hamburger',
  LOGOUT_BUTTON: '~Logout',
  // these are for Boss
};

class HomeScreen extends AppScreen {
  constructor() {
    super(SELECTORS.HOME_SCREEN);
  }

  get list() {
    return $(SELECTORS.LIST_VIEW);
  }

  get hamburger() {
    return $(SELECTORS.HAMBURGER);
  }

  get logout() {
    return $(SELECTORS.LOGOUT_BUTTON);
  }
}

export default new HomeScreen();
