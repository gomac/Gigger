global.Buffer = global.Buffer || require('buffer').Buffer; // Required for aws sigv4 signing

import React from 'react';
import {I18nManager} from 'react-native';
import * as RNLocalize from 'react-native-localize';
import i18n from './src/i18n';
import memoize from 'lodash.memoize';
import Router from './src/Router';
import {NetworkProvider} from './src/Utils/NetworkProvider';
import ConnectionMsg from './src/Utils/ConnectionMsg';
const translationGetters = {
  // lazy requires (metro bundler does not support symlinks)
  en: () => require('./src/locales/en.json'),
  es: () => require('./src/locales/es.json'),
  //ca: () => require('../locales/ca.json'),
};

global.tr = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);

const setI18nConfig = () => {
  // fallback if no available language fits
  const fallback = {languageTag: 'en', isRTL: false};

  const {languageTag, isRTL} =
    RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) ||
    fallback;

  // clear translation cache
  global.tr.cache.clear();
  // update layout direction
  I18nManager.forceRTL(isRTL);
  // set i18n-js config
  i18n.translations = {[languageTag]: translationGetters[languageTag]()};
  i18n.locale = languageTag;
};

const App = () => {
  setI18nConfig();
  return (
    <NetworkProvider>
      <ConnectionMsg />
      <Router />
    </NetworkProvider>
  );
};

export default App;
