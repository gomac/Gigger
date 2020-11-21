import AppScreen from './app.screen';
import NativeAlert from '../helpers/NativeAlert';

const SELECTORS = {
  ENQUIRY_SCREEN: '~Enquiry-screen',
  SEND_ENQUIRY_BUTTON: '~SendEnquiry-button',
};

class EnquiryScreen extends AppScreen {
  constructor() {
    super(SELECTORS.ENQUIRY_SCREEN);
  }

  get sendEnquiryButton() {
    return $(SELECTORS.SEND_ENQUIRY_BUTTON);
  }

  get alert() {
    return NativeAlert;
  }
}

export default new EnquiryScreen();
