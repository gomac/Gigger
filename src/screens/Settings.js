import React, {Component} from 'react';
import {StyleSheet, Text, View, StatusBar, Platform} from 'react-native';

export default class Settings extends Component {
  //static contextType = AuthContext;

  constructor(props) {
    super(props);
  }

  customMenu = () => {
    return (
      <View>
        <StatusBar backgroundColor="#303f9f" />
        <Text>Name: {global.displayName}</Text>
        <Text>Email: {global.email}</Text>
        <Text>Position: {global.appType}</Text>
        {global.appType === 'boss' && <Text>Company: {global.company}</Text>}
      </View>
    );
  };

  render() {
    return this.customMenu();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  heading: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  menuItem: {
    padding: 10,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
  },
  contentContainer: {
    flex: 1,
    marginTop: 56,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    padding: 20,
  },
  sectionContainer: {
    paddingVertical: 16,
  },
  navigationBar: {
    paddingTop: 60,
    height: 72,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: '#3F51B5',
    ...Platform.select({
      android: {
        elevation: 4,
      },
      ios: {
        zIndex: 10,
      },
    }),
  },
});

//AppRegistry.registerComponent('Settings', () => Settings);
