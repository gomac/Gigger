import AppScreen from './app.screen';
//import ErrorField from './components/error.field';

const SELECTORS = {
  LOGIN_SCREEN: '~Login-screen',
  LOGIN_BUTTON: '~Login-button',
  EMAIL: '~Email',
  PASSWORD: '~Password',
  ERROR_MSG: '~ErrorMsg',
};

class LoginScreen extends AppScreen {
  constructor() {
    super(SELECTORS.LOGIN_SCREEN);
  }

  get loginScreen() {
    return $(SELECTORS.LOGIN_SCREEN);
  }

  get loginButton() {
    return $(SELECTORS.LOGIN_BUTTON);
  }

  get email() {
    return $(SELECTORS.EMAIL);
  }

  get password() {
    return $(SELECTORS.PASSWORD);
  }

  login(email, password) {
    $(SELECTORS.EMAIL).setValue(email);
    $(SELECTORS.PASSWORD).setValue(password);
    $(SELECTORS.LOGIN_BUTTON).click();
  }

  get errorMsg() {
    return $(SELECTORS.ERROR_MSG);
  }
}

export default new LoginScreen();
