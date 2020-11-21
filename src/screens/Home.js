import React from 'react';
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import {w, h, totalSize} from '../Utils/Dimensions';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import MapInput from '../components/MapInput';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {testProperties} from '../../src/Utils/TestProperties';
import LinearGradient from 'react-native-linear-gradient';

//TODO reset navigation to prevent return to login screen
export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.mySectionedMultiSelect = null;

    this.state = {
      refDataArr: [],
      selectedJobTypes: [],
      region: {},
    };
  }

  render() {
    return (
      <View style={{width: '100%'}} accessibilityLabel="home-view">
        <Text>Hello</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  h1: {
    color: '#008F68',
    fontSize: 40,
    marginLeft: 20,
  },
  h2: {
    alignSelf: 'flex-start',
    color: '#FAE042',
    fontSize: 18,
    marginTop: 8,
    marginLeft: 20,
  },
  h3: {
    alignSelf: 'flex-start',
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    marginLeft: 20,
  },
  button: {
    width: '50%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: w(2),
    backgroundColor: '#ea8214',
    borderRadius: w(10),
    marginTop: h(6),
  },
  text: {
    color: 'white',
    fontWeight: '700',
    fontSize: totalSize(2.1),
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  newContainer: {
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
  },
  multiListScrollContainer: {
    paddingTop: 1,
    paddingHorizontal: 10,
    flex: 1,
    flexDirection: 'column',
  },
});
