import AppScreen from './app.screen';

const SELECTORS = {
  HAMBURGER_SCREEN: '~Hamburger-screen',

  // these are for Boss
};

class HamburgerScreen extends AppScreen {
  constructor() {
    super(SELECTORS.HAMBURGER_SCREEN);
  }

  get hamburgerScreen() {
    return $(SELECTORS.HAMBURGER_SCREEN);
  }
}

export default new HamburgerScreen();
