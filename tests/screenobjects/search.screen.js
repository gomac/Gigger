import AppScreen from './app.screen';

const SELECTORS = {
  SEARCH_SCREEN: '~Search-screen',
  ENQUIRE_BUTTON: '~Enquire-button',
};

class HomeScreen extends AppScreen {
  constructor() {
    super(SELECTORS.SEARCH_SCREEN);
  }

  get enquireButton() {
    return $(SELECTORS.ENQUIRE_BUTTON);
  }
}

export default new HomeScreen();
