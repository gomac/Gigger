import AppScreen from '../app.screen';

const SELECTORS = {
  ERROR_MSG: '~ErrorMsg',
};

class ErrorField extends AppScreen {
  constructor() {
    super(SELECTORS.ERROR_MSG);
  }
  get errorMsg() {
    return $(SELECTORS.ERROR_MSG);
  }
}

export default new ErrorField();
