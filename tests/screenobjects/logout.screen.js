import AppScreen from './app.screen';

const SELECTORS = {
  LOGOUT_SCREEN: '~Logout-screen',
};

class LogouScreen extends AppScreen {
  constructor() {
    super(SELECTORS.LOGOUT_SCREEN);
  }

  get logoutScreen() {
    return $(SELECTORS.LOGOUT_SCREEN);
  }
}

export default new LogouScreen();
