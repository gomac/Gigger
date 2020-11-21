'use strict';
import React, {Component} from 'react';
import {
  Dimensions,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {material} from 'react-native-typography';
import {Button, ListItem} from 'react-native-elements';
import {firebaseDB} from '../config/FirebaseConfig';
import Snackbar from 'react-native-snackbar';
import RadioForm from 'react-native-simple-radio-button';
import Video from 'react-native-video-controls';

const width = Dimensions.get('window').width;

class Request extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.jobsFromFB = firebaseDB.ref('/jobs');
    this.usersFromFB = firebaseDB.ref('/users');

    this.value = 0;

    this.applicantEnqObjKey = this.props.route.params.applicantEnqObj[0];
    this.applicantEnqObj = {
      ...this.props.route.params.applicantEnqObj[1],
    };

    console.log('this.applicantEnqObjKey ', this.applicantEnqObjKey);
    console.log('this.applicantEnqObj ', this.applicantEnqObj);
    this.state = {
      decisionMsg: '',
      enquirerMsg: '',
      placeholder: '',
      toggleVideo: false,
      // state for the video player
      paused: true,
      playWhenInactive: false,
      playInBackground: false,
      repeat: false,
      videoURL: {
        uri: this.applicantEnqObj.recording
          ? this.applicantEnqObj.recording
          : '',
      },
      videoHeight: width * 0.5625,
      acceptReject: [
        {label: 'Awaiting decision', value: 0, dbVal: 'pending'},
        {label: "I'm interested", value: 1, dbVal: 'accepted'},
        {label: 'Reject request', value: 2, dbVal: 'rejected'},
      ],
    };

    //tiring conversion of literal to index
    const initialObj = this.state.acceptReject.filter(obj => {
      return obj.dbVal === this.applicantEnqObj.status;
    })[0];
    this.initialStatus = initialObj.value;
  }

  componentDidMount() {
    this.setState({enquirerMsg: this.applicantEnqObj.message});
    this.applicantEnqObj.status === 'rejected' ||
      (this.applicantEnqObj.status === 'accepted' &&
        this.setState({
          decisionMsg: this.applicantEnqObj.decisionMsg,
        }));
  }

  didUpdate = () => {
    const {navigation} = this.props;
    //navigation.state.params.refreshRqd()
    navigation.goBack();
  };

  findByProp = (o, prop, val, retprop) => {
    //Early return
    if (o == null) return false;
    if (o[prop] === val) {
      return retprop ? o[retprop] : o;
    }
    var result, p;
    for (p in o) {
      if (o.hasOwnProperty(p) && typeof o[p] === 'object') {
        result = this.findByProp(o[p], prop, val);
        if (result) {
          return retprop ? result[retprop] : result;
        }
      }
    }
    return retprop ? result[retprop] : result;
  };

  linkApplicantToJob = async () => {
    const {job} = this.props.route.params;
    // NOTE the this.applicantEnqObj[0] is the requesting user UID, applicantReq[1] is and object
    //const job = {...job}

    // 1  add applicant to job
    // 2  add job id to USER who is now a APPLICANT

    // TODO cant make boss a applicant
    // if UID === global.UID
    // TODO leave this out for testing

    // I dont think we need this
    // 1 ADD APPLICANT TO JOB
    // check if already exists
    // look through list of applicants nodes in jobs array
    /*if (typeof job !== "undefined") {
      console.log("findByProp return value is ", this.findByProp(job.applicants, "applicant_id", UID));
      if (this.findByProp(job.applicants, "applicant_id", UID)) {
        alert("Applicant is already accepted for consideration.");
        return;
      }
    }*/

    // I dont think we need this
    // add APPLICANT node to JOB
    /*console.log("this.applicantEnqObj.name ", this.applicantEnqObj.name)
    this.jobsFromFB.child(job._id).child('applicants').child(UID).update(
      { name: this.applicantEnqObj.name,
        _id: UID,
        decisionMsg: this.state.decisionMsg
      },
      function(error) {
      if (error) {
        //console.log("Job applicant details could not be saved." + error);
      } else {
       // console.log("Job applicant details saved successfully.");
      }
    });*/

    // 2 ADD JOB TO USER
    /* We need this because when the user logs in we want a quck list
        of their jobs. We don't want to have to look through all jobs
        to see if applicant is enrolled */
    let node = 'jobs/' + job._id;
    this.usersFromFB = firebaseDB.ref('/users');
    this.usersFromFB
      .child(this.applicantEnqObjKey)
      .update({[node]: 'current'}, error => {
        if (error) {
          //console.log("Data could not be saved." + error);
        } else {
          // console.log("Job saved successfully.");
        }
      });
  };

  actionRequest = () => {
    // val = 0 - return, val = 1 - g, val = 2 - reject
    const value = this.value;
    const obj = {};
    obj.changedDate = Date.now();
    obj.name = this.applicantEnqObj.name;
    obj.message = this.applicantEnqObj.message;
    obj.decisionMsg = this.state.decisionMsg;

    if (value == 0) {
      return;
    } else if (value == 1) {
      // accept
      // 1 link applicant to job
      this.linkApplicantToJob();
      // 2 change status
      obj.status = 'accepted';
    } else if (value == 2) {
      // reject:
      obj.status = 'rejected';
    }

    const {job} = this.props.route.params;

    const refPending = firebaseDB.ref('/pending');
    let node = '/' + this.applicantEnqObjKey + '/';

    refPending.child(job._id).update({[node]: obj}, error => {
      if (error) {
        Snackbar.show({
          title: 'Enrolment action could not be saved' + error,
          duration: Snackbar.LENGTH_LONG,
        });
      } else {
        Snackbar.show({
          title: 'Enrolment request actioned',
          duration: Snackbar.LENGTH_LONG,
        });
      }
    });
    this.didUpdate();
  };

  hideShowPlayer = () => {
    // The toggleVideo state variable is used to create the player
    // the toggleVideo is used to make it invisible
    // so we can maximise the screen space and continue to listen to the recording
    let videoHeight = width * 0.5625;
    if (this.state.toggleVideo) {
      videoHeight = 0;
    }
    this.setState({
      videoHeight: videoHeight,
      toggleVideo: !this.state.toggleVideo,
    });
  };

  onProgress = data => {
    this.currentTime = data.currentTime;
    //console.log('current time: ', this.state.currentTime);
  };

  onVideoError = err => {
    //("ERROR FROM VIDEO ", err)
  };

  toggleVideoView = () => {
    return this.state.toggleVideo ? (
      <View>
        <View style={{width, height: this.state.instructionHeight}}>
          <Text style={styles.baseText} value={this.state.instructions}>
            {this.state.instructions}
          </Text>
        </View>
        <View style={{width, height: this.state.videoHeight}}>
          <Video
            ref={ref => {
              this.recPlayer = ref;
            }}
            paused={this.state.paused}
            onLoad={() => {
              //("LOADING VIDEO, before setState,  paused is ", this.state.paused)
              this.setState({
                paused: false,
              });
            }}
            disableFullscreen={true}
            controlTimeout={60000}
            posterStyles={{resizeMode: 'cover'}}
            repeat={false}
            onProgress={this.onProgress}
            onEnd={this.onEnd}
            style={StyleSheet.absoluteFill}
            source={this.state.videoURL}
            resizeMode="contain"
            onError={() => {
              this.onVideoError;
            }}
            navigator={this.props.navigator}
            playWhenInactive={false}
            disableBack={true}
            playInBackground={false}
          />
        </View>
      </View>
    ) : null;
  };

  playRecording = (recording, url = false) => {
    //this.setState({ currentRec: Object.assign({}, this.state.currentRec, recording )});
    //("playRecording this.setState: ", this.state.paused);
    if (url) {
      this.setState({videoURL: {uri: recording}, paused: false});
    } else {
      this.setState({videoURL: {uri: recording.filename}, paused: false});
    }
    //console.log("playRecording: filename " + recording.filename);
    //console.log("playRecording: videoURL " + this.state.videoURL);
  };

  pausePlay = () => {
    if (this.state.toggleVideo) {
      this.setState({paused: true}, () =>
        this.recPlayer.seekTo(this.currentTime),
      );
    }
  };

  resumePlay = () => {
    //console.log('currentTime: ', this.state.currentTime);
    this.setState({paused: false});
  };

  onEnd = () => {
    //console.log('onEnd: pause play')
    this.setState({paused: true}, () => this.recPlayer.seekTo(0));
  };

  setPlaceHolderMsg = () => {
    if (!this.state.decisionMsg) {
      let placeholder;
      if (this.value == 2) {
        placeholder = `Hi ${
          this.applicantEnqObj.name
        }. Thank you for your application. Unfortunaly, we can't offer you a position at this stage. Best wishes in your job search, ${
          global.displayName
        }`;
      } else if (this.value == 1) {
        placeholder = `Hi ${
          this.applicantEnqObj.name
        }. I'm interested in your application. The process from here is as follows:



        Regards, ${global.displayName}`;
      }

      //make this the draft instead of the placeholer
      //this.setState({placeholder: placeholder})
      this.setState({decisionMsg: placeholder});
    }
  };

  render() {
    return (
      <View>
        <ScrollView keyboardShouldPersistTaps={'handled'}>
          <View style={styles.container}>
            {this.toggleVideoView()}
            <View styles={styles.likeRow}>
              <TouchableOpacity
                style={styles.touchIconLeft}
                onPress={this.hideShowPlayer}>
                {this.state.toggleVideo ? (
                  <Text style={styles.hideShowLabels}>
                    Hide Applicant Video
                  </Text>
                ) : (
                  <Text style={styles.hideShowLabels}>
                    View Applicant Video
                  </Text>
                )}
              </TouchableOpacity>
            </View>
            <View style={{marginLeft: 20, flex: 1, flexDirection: 'row'}}>
              <Text
                onPress={() => {
                  Linking.openURL(
                    'tel:' + this.applicantEnqObj.contactPhone,
                  ).catch(err => console.error('An error occurred', err));
                }}
                style={styles.phoneText}>
                {this.applicantEnqObj.name}: {this.applicantEnqObj.contactPhone}
              </Text>
            </View>

            <RadioForm
              radio_props={this.state.acceptReject}
              initial={this.initialStatus}
              formHorizontal={false}
              labelHorizontal={false}
              animation={true}
              onPress={value => {
                this.value = value;
                this.setPlaceHolderMsg();
              }}
            />
            <Text style={{marginLeft: 20}}>Applicant message</Text>
            <TextInput
              editable={global.appType === 'boss' ? false : true}
              multiline={true}
              maxLength={2000}
              numberOfLines={3}
              value={this.state.enquirerMsg}
              onChangeText={decisionMsg => this.setState({decisionMsg})}
              clearButtonMode="always"
              style={{
                alignSelf: 'center',
                textAlignVertical: 'top',
                borderColor: '#1ca0ff',
                borderWidth: 1,
                paddingLeft: 10,
                paddingRight: 10,
                marginVertical: 10,
                width: '90%',
              }}
            />
            <TextInput
              editable={true}
              placeholder={this.state.placeholder}
              multiline={true}
              maxLength={2000}
              numberOfLines={3}
              value={this.state.decisionMsg}
              onChangeText={decisionMsg => this.setState({decisionMsg})}
              clearButtonMode="always"
              style={{
                alignSelf: 'center',
                textAlignVertical: 'top',
                borderColor: '#1ca0ff',
                borderWidth: 1,
                paddingLeft: 10,
                paddingRight: 10,
                marginVertical: 10,
                width: '90%',
              }}
            />
            <Button
              title="Finalise"
              buttonStyle={styles.actionButtonIcon}
              accessibilityLabel="Request Request"
              onPress={() => {
                this.actionRequest();
              }}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  actionButtonIcon: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    backgroundColor: '#8fb1aa',
  },
  touchIconLeft: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  likeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  contentContainer: {
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    padding: 10,
  },
  sectionContainer: {
    paddingVertical: 56,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 88,
    height: 36,
    borderRadius: 2,
    backgroundColor: '#E8EAF6',
    elevation: 2,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  scrollViewContainer: {
    paddingTop: 8,
  },
  row: {
    height: 48,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  titleText: {
    fontFamily: 'Cochin',
    fontWeight: 'bold',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    textAlignVertical: 'center',
  },
  baseText: {
    fontFamily: 'Cochin',
    fontWeight: 'normal',
  },
  selectBox: {
    alignSelf: 'center',
    maxHeight: 300,
    borderColor: '#1ca0ff',
    borderWidth: 1,
    paddingLeft: 10,
    paddingRight: 10,
    marginVertical: 10,
    width: '90%',
  },
  multilineBox: {
    alignSelf: 'center',
    maxHeight: 300,
    borderColor: '#1ca0ff',
    borderWidth: 1,
    paddingLeft: 10,
    paddingRight: 10,
    marginVertical: 10,
    width: '90%',
  },
  phoneText: {
    fontSize: 13,
    color: 'blue',
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 15,
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#8fb1aa',
  },
  item: {
    padding: 10,
    fontSize: 13,
    height: 44,
  },
  hideShowLabels: {
    color: 'green',
    alignSelf: 'center',
    marginBottom: 10,
    fontSize: 16,
  },
});
export default Request;
