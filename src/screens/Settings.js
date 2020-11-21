import React, {Component} from 'react';
import {
  AppRegistry,
  Keyboard,
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
import {DrawerActions, NavigationActions} from '@react-navigation/native';
import {AuthContext} from '../Utils/context';

export default class Settings extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
  }

  showFields = name => {
    const CustomTag = `<View style={styles.container}> <${name}/></View>`;
    return CustomTag;
  };

  showApplicantDetails = (applicant, exercies = []) => {
    //console.log("Settings showApplicantDetails ", applicant)

    //console.log("navigate to Tabs")
    this.props.navigation.navigate('home', {...applicant});
    //("close drawer")
    this.props.navigation.dispatch(DrawerActions.closeDrawer());
  };

  signOut = () => {
    const {signOut} = this.context;
    signOut();
  };

  render() {
    // now set in router logon process
    //onst user = this.props.navigation.getParam('user');
    //const {user} = this.props.route.params;

    //console.log("Settings User: ", user.uid);
    //global.UID = user.uid;
    //global.displayName = user.displayName;
    //console.log("Settings global.UID : ", global.UID);

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#303f9f" />
        <Text>Name: {global.displayName}</Text>
        <Text>Email: {global.email}</Text>
        {global.appType != 'user' && (
          <View>
            <Text>Position: {global.appType}</Text>
            <Text>Company: {global.company}</Text>
          </View>
        )}
        <Text />
        <ScrollView keyboardShouldPersistTaps={'handled'}>
          {/**<Provider showApplicant={this.showApplicantDetails}/>*/}
          <View style={styles.menuItem}>
            <Text onPress={this.signOut}>SignOut</Text>
          </View>
        </ScrollView>
      </View>
    );
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
