import React, {Component} from 'react';
import {FlatList, ScrollView} from 'react-native';
import {ListItem} from 'react-native-elements';

//import { firebaseDB }       from "../config/FirebaseConfig";

class UserList extends Component {
  constructor(props) {
    super(props);
    this.props = props;

    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    const [...applicantEnqArr] = this.props.route.state.params.applicantEnqArr;

    if (applicantEnqArr.length > 0) {
      applicantEnqArr.map(applicantObj => {
        // used to call getUser but not necessary
        // the name is in applicantEnqArr and
        // best not to give out email to boss
        //this.getUser(Object.keys(applicantId)[0])
        //.then ( applicantObj => {
        //this.setState({ data: [applicantEnqArr.name, ...this.state.data]})
        // format of applicantId is key: {name: , recording: etc}
        //console.log( "Object.values(applicantObj)[0].name ", Object.values(applicantObj)[0].name)
        this.setState({data: [applicantObj, ...this.state.data]});
        //})
      });
    }
  }

  /*getUser = (uid) => {
    return new Promise(function(resolve, reject) {
    this.userFromFB = firebaseDB.ref('/users');
    this.userFromFB.child(uid).once("value", snapshot => {
      //console.log( "snap shot", snapshot.val())
      if (!snapshot.val()) {
        console.log("snapshot: Oh No, user not found");
          reject("USER not found");
      } else {
        let userRec = snapshot.val()
        // add the key for simplicity
        userRec._id = snapshot.key
        resolve(userRec);
      }
      })
    });
  }*/

  onLearnMore = index => {
    const {job} = this.props.route.params;
    const [...applicantEnqArr] = this.props.route.params.applicantEnqArr;
    this.props.navigation.navigate('Request', {
      applicantEnqObj: applicantEnqArr[index],
      job: job,
    });
  };

  render() {
    return (
      <ScrollView>
        <FlatList
          data={this.state.data}
          extraData={this.state}
          renderItem={({item, index}) => (
            <ListItem
              key={index}
              containerStyle={
                item.status == 'accepted' && {backgroundColor: 'yellow'}
              }
              roundAvatar
              avatar={{uri: user.picture.thumbnail}}
              title={`${item.name.toUpperCase()}`}
              subtitle={`Applicant ${index + 1}`}
              onPress={() => this.onLearnMore(index)}
            />
          )}
        />
      </ScrollView>
    );
  }
}

export default UserList;
