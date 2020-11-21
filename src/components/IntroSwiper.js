import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import LinearGradient from 'react-native-linear-gradient';

export default props => (
  <AppIntroSlider
    renderItem={_renderItem}
    data={global.appType === 'boss' ? tbossSlides : tjobSlides}
    bottomButton={true}
    onDone={props.onIntroDone}
  />
);

const _renderItem = ({item}) => {
  return (
    <LinearGradient colors={item.colors} style={{flex: 1}}>
      <View style={[styles.slide, {backgroundColor: item.backgroundColor}]}>
        <Text style={styles.title}>{item.title}</Text>
        <Image source={item.image} />
        <Text style={styles.text}>{item.text}</Text>
      </View>
    </LinearGradient>
  );
};

const tjobSlides = [
  {
    key: 'one',
    title: 'TJob',
    text: 'Welcom to TJob\n\nCreate an intro and\n do one-click applications.',
    image: require('../assets/email.png'),
    colors: ['#3F85A8', '#6d5a8e'],
  },
  {
    key: 'two',
    title: 'Getting Started',
    text:
      'TJob lets you make your own profile \nso you can apply for jobs \nwith just one click.',
    image: require('../assets/email.png'),
    colors: ['#9c4b81', '#ac3263', '#b93254', '#c1334b'],
  },
  {
    key: 'three',
    title: 'Selfie Videos',
    text: 'Organise your selfie video\nand share with an employer.',
    image: require('../assets/email.png'),
    colors: ['#d63a40', '#c94571', '#bb779a', '#947ab1'],
  },
  {
    key: 'four',
    title: 'Find Jobs!',
    text: 'Search for jobs and\napply with one-click.',
    image: require('../assets/email.png'),
    colors: ['#32ab51', '#5bba91', '#3ca782'],
  },
  {
    key: 'five',
    title: 'Almost Done!',
    text: "Let's build your profile.",
    image: require('../assets/email.png'),
    colors: ['#3F85A8', '#6d5a8e'],
  },
];

const tbossSlides = [
  {
    key: 'one',
    title: 'TBoss',
    text:
      'Welcom to TBoss\n\nCreate an intro and\n do one-click advertisements.',
    image: require('../assets/email.png'),
    colors: ['#3F85A8', '#6d5a8e'],
  },
  {
    key: 'two',
    title: 'Getting Started',
    text:
      'TBoss lets you make your own profile \nso you can advertise jobs \nwith just one click.',
    image: require('../assets/email.png'),
    colors: ['#9c4b81', '#ac3263', '#b93254', '#c1334b'],
  },
  {
    key: 'three',
    title: 'Almost Done!',
    text: "Let's build your profile.",
    image: require('../assets/email.png'),
    colors: ['#3F85A8', '#6d5a8e'],
  },
];

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 320,
    height: 320,
    marginVertical: 32,
  },
  text: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});

const linearGradientProp = () => {
  return {
    colors: ['#c37dc6', '#adbce6'],
    start: {x: 1.0, y: 0},
    end: {x: 0.2, y: 0},
  };
};
