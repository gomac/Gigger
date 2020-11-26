import React from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';

const {width} = Dimensions.get('window');

const JobController = (props) => {
  //const {jobObj} = props.route.params;

  const screens = [
    'JobBasic',
    'JobCategories',
    'Requirements',
    'JobTerms',
    'JobLoc',
  ];

  const onLearnMore = (screen) => {
    props.navigation.navigate(screen);
  };

  const Item = ({size, margin, screen}, index) => {
    return (
      <TouchableOpacity
        key={index}
        style={styles.button}
        onPress={() => onLearnMore(screen)}>
        <View
          style={[
            styles.tile,
            {
              width: size,
              height: size,
              marginHorizontal: margin,
              // backgroundColor: getColor(screen.name),
            },
          ]}>
          <View style={styles.writingTile}></View>
          <View style={styles.messageBubble}>
            <View style={styles.talkBubbleTriangle} />
            <Text style={styles.messageBubbleTextLeft}></Text>
          </View>
          <Text></Text>
        </View>
      </TouchableOpacity>
    );
  };

  const calcTileDimensions = (deviceWidth, tpr) => {
    const margin = deviceWidth / (tpr * 30);
    const size = (deviceWidth - margin * (tpr * 2)) / tpr;
    return {size, margin};
  };

  const getColor = (username) => {
    let sumChars = 0;
    for (let i = 0; i < username.length; i++) {
      sumChars += username.charCodeAt(i);
    }

    const colors = [
      '#e6194b',
      '#3cb44b',
      '#ffe119',
      '#4363d8',
      '#f58231',
      '#911eb4',
      '#46f0f0',
      '#f032e6',
      '#1cf60c',
      '#fabebe',
      '#008080',
      '#e6beff',
      '#9a6324',
      '#fffac8',
      '#800000',
      '#fe00f6',
      '#5d4eff',
      '#ffd8b1',
      '#52a4ff',
      '#808080',
      '#ffffff',
      '#000000',
    ];
    return colors[sumChars % colors.length];
  };

  const tileDimensions = calcTileDimensions(width, 2);

  return (
    <ScrollView>
      <View style={styles.container}>
        {screens.map((screen, index) =>
          Item({...tileDimensions, screen: screen}, index),
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  button: {
    alignContent: 'flex-start',
  },
  tile: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  itemTextName: {
    fontSize: 16,
    color: '#FFFFFF',
    justifyContent: 'flex-start',
    alignSelf: 'center',
  },
  itemText: {
    fontSize: 15,
    alignSelf: 'center',
  },
  phoneText: {
    fontSize: 13,
    color: 'blue',
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 15,
  },
  messageBubble: {
    flex: 0.5,
    width: '80%',
    borderRadius: 5,
    marginRight: 10,
    marginLeft: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: '#d5d8d4',
  },
  messageBubbleTextLeft: {
    fontSize: 14,
    color: 'gray',
    fontWeight: 'bold',
  },
  writingTile: {
    flex: 1,
  },
  talkBubbleTriangle: {
    position: 'absolute',
    left: -20,
    top: 5,
    width: 0,
    height: 0,
    borderTopColor: 'transparent',
    borderTopWidth: 10,
    borderRightWidth: 20,
    borderRightColor: '#d5d8d4',
    borderBottomWidth: 10,
    borderBottomColor: 'transparent',
  },
  iconAccept: {
    position: 'absolute',
    right: 5,
    top: 5,
  },
  iconReject: {
    position: 'absolute',
    left: 5,
    top: 5,
  },
});

export default JobController;
