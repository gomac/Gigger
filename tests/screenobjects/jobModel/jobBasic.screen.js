import AppScreen from '../app.screen';
//import ErrorField from './components/error.field';

const SELECTORS = {
  JOB_BASIC_SCREEN: '~Login-screen',
  SAVE_BUTTON: '~Save-details-button',
  NAME: '~Name',
  DESCRIPTION: '~Description',
  ERROR_MSG: '~ErrorMsg',
};

class JobBasicScreen extends AppScreen {
  constructor() {
    super(SELECTORS.JOB_BASIC_SCREEN);
  }

  get jobBasicScreen() {
    return $(SELECTORS.JOB_BASIC_SCREEN);
  }

  get saveButton() {
    return $(SELECTORS.SAVE_BUTTON);
  }

  get name() {
    return $(SELECTORS.NAME);
  }

  get description() {
    return $(SELECTORS.DESCRIPTION);
  }

  get errorMsg() {
    return $(SELECTORS.ERROR_MSG);
  }
}

export default new JobBasicScreen();
