import React from 'react';
import {I18nManager, View, Text, StyleSheet} from 'react-native';

import * as RNLocalize from 'react-native-localize';
import i18n from '../i18n';
import memoize from 'lodash.memoize';

const translationGetters = {
  // lazy requires (metro bundler does not support symlinks)
  en: () => require('../locales/en.json'),
  es: () => require('../locales/es.json'),
  //ca: () => require('../locales/ca.json'),
};

const tr = memoize(
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
  tr.cache.clear();
  // update layout direction
  I18nManager.forceRTL(isRTL);
  // set i18n-js config
  i18n.translations = {[languageTag]: translationGetters[languageTag]()};
  i18n.locale = languageTag;
};

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4F6D7A',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#F5FCFF',
  },
  instructions: {
    textAlign: 'center',
    color: '#F5FCFF',
    marginBottom: 5,
  },
});

class Splash extends React.Component {
  render() {
    return (
      <View style={styles.splash}>
        <Text style={styles.welcome}>
          {tr('home.welcome', {appName: tr('appName')})}
        </Text>
      </View>
    );
  }
}

export default Splash;
