import React, {Component} from 'react';
import {
  Button,
  Dimensions,
  StyleSheet,
  View,
  StatusBar,
  ScrollView,
  Platform,
  Text,
  TouchableOpacity,
} from 'react-native';
import Provider from '../components/ProviderJobBoss';
import EditEntity from '../components/EditEntity';
const {width, height: screenHeight} = Dimensions.get('window');

export default class Template extends Component {
  static navigationOptions = ({navigation}) => {
    const {entity} = this.props.route.params;
    let header = `Maintenance`;
    if (typeof entity != 'undefined') {
      header = `Details for ${entity.name}`;
    }

    return {
      title: navigation.getParam('Title', header),
      headerStyle: {
        textAlign: 'right',
        backgroundColor: navigation.getParam('BackgroundColor', '#c37dc6'),
      },
      headerTintColor: navigation.getParam('HeaderTintColor', '#fff'),
    };
  };

  constructor(props) {
    super(props);
    this.props = props;
  }

  didUpdate = () => {
    const {navigation} = this.props;
    // dont refresh if it is just updating instructions
    //navigation.state.params.refreshRqd();
    this.props.route.params.refreshRqd();
    this.props.navigation.navigate('Home');
  };

  render() {
    const {action, user, entity, actionType} = this.props.route.params;

    return (
      <View style={[width, styles.container]}>
        <ScrollView keyboardShouldPersistTaps={'handled'}>
          {action === 'edit' ? (
            <View>
              <EditEntity entity={entity} didUpdate={this.didUpdate} />
              {/**global.appType==="user"?
              <Button
                title='Go to Requirement'
                accessibilityLabel="Go to requirement"
                onPress={() => {
                  this.props.navigation.state.params.goToHomework()
                  this.props.navigation.goBack()
                }}
              />
              :null
            } */}
            </View>
          ) : (
            <Provider
              user={user}
              actionType={actionType}
              didUpdate={this.didUpdate}
            />
          )}
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
  likeRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 88,
    height: 30,
    borderRadius: 2,
    backgroundColor: '#E8EAF6',
    elevation: 2,
    paddingHorizontal: 16,
    marginTop: 16,
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
  titleText: {
    fontFamily: 'Cochin',
    fontWeight: 'bold',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    textAlignVertical: 'center',
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
