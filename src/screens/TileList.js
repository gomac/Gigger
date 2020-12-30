import React, {Component} from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  Linking,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const {width} = Dimensions.get('window');

class TileList extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.applicantEnqArr = this.props.route.params.applicantEnqArr;
    console.log('this.applicantEnqArr ', this.applicantEnqArr);
  }

  onLearnMore = (index) => {
    const {job} = this.props.route.params;
    this.props.navigation.navigate('Request', {
      applicantEnqObj: this.applicantEnqArr[index],
      job: job,
    });
  };

  //spanish name
  parseName = (input) => {
    var fullName = input || '';
    var result = {};

    if (fullName.length > 0) {
      var nameTokens =
        fullName.match(
          /[A-ZÁ-ÚÑÜ][a-zá-úñü]+|([aeodlsz]+\s+)+[A-ZÁ-ÚÑÜ][a-zá-úñü]+/g,
        ) || [];

      if (nameTokens.length > 3) {
        result.name = nameTokens.slice(0, 2).join(' ');
      } else {
        result.name = nameTokens.slice(0, 1).join(' ');
      }

      if (nameTokens.length > 2) {
        result.lastName = nameTokens.slice(-2, -1).join(' ');
        result.secondLastName = nameTokens.slice(-1).join(' ');
      } else {
        result.lastName = nameTokens.slice(-1).join(' ');
        result.secondLastName = '';
      }
    }
    return result;
  };

  Item = ({size, margin, applicant}, index) => {
    return (
      <TouchableOpacity
        key={index}
        style={styles.button}
        onPress={() => this.onLearnMore(index)}>
        <View
          style={[
            styles.tile,
            {
              width: size,
              height: size,
              marginHorizontal: margin,
              backgroundColor: this.getColor(applicant.name),
            },
          ]}>
          {applicant.status === 'accepted' && (
            <View style={styles.iconAccept}>
              <Icon name="thumbs-up" size={25} color="white" />
            </View>
          )}

          {applicant.status === 'rejected' && (
            <View style={styles.iconReject}>
              <Icon name="thumbs-down" size={25} color="white" />
            </View>
          )}

          <View style={styles.writingTile}>
            <Text style={styles.itemTextName}>
              {this.parseName(applicant.name).name}
            </Text>
            <Text style={styles.itemTextName}>
              {this.parseName(applicant.name).lastName}
            </Text>
          </View>
          <View style={styles.messageBubble}>
            <View style={styles.talkBubbleTriangle} />
            <Text style={styles.messageBubbleTextLeft}>
              {applicant.message}
            </Text>
          </View>
          <Text
            onPress={() => {
              Linking.openURL('tel:' + applicant.contactPhone).catch((err) =>
                console.error('An error occurred', err),
              );
            }}
            style={styles.phoneText}>
            {applicant.contactPhone}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  calcTileDimensions = (deviceWidth, tpr) => {
    const margin = deviceWidth / (tpr * 30);
    const size = (deviceWidth - margin * (tpr * 2)) / tpr;
    return {size, margin};
  };

  getColor = (username) => {
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
      '#8687c8',
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

  render() {
    const tileDimensions = this.calcTileDimensions(width, 2);

    return (
      <ScrollView>
        <View style={styles.container}>
          {this.applicantEnqArr.map((applicantArr, index) =>
            this.Item({...tileDimensions, applicant: applicantArr}, index),
          )}
        </View>
      </ScrollView>
    );
  }
}

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

export default TileList;
