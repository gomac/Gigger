import React, {Component} from 'react';
import {
  Alert,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button} from 'react-native-elements';
import Video from 'react-native-video-controls';
import store from 'react-native-simple-store';
import RNPickerSelect from 'react-native-picker-select';
//import { material }                 from 'react-native-typography';
import {uploadRecording} from '../components/DBHelpers';
//import NumericInput                 from 'react-native-numeric-input'
import {updateApplication} from '../model';
import DropdownAlert from 'react-native-dropdownalert';
import PhoneInput from 'react-native-phone-number-input';
import * as Progress from 'react-native-progress';
import {testProperties} from '../../src/Utils/TestProperties';

const {width, height: screenHeight} = Dimensions.get('window');

// props: jobObj
// purpose: gather details for an Enquiry (for job)
// process: button that presents modal display of recordings
//          fields to add some comments
//          update pending node in firebase with details
export default class Enquiry extends Component {
  constructor(props) {
    super(props);
    this.props = props;

    this.recPlayer = React.createRef();
    this.phoneRef = React.createRef(null);
    let filename = '';
    this.state = {
      // state for the video player
      newTime: 0,
      refreshPlayerTime: false,
      pauseMainPlayer: false,
      paused: true,
      playWhenInactive: false,
      playInBackground: false,
      repeat: false,
      recordings: [],
      recordingPickerSelectedItem: undefined,
      toggleVideo: filename ? true : false,
      //videoURL: {
      //   uri:
      //     'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      //},
      videoHeight: width * 0.5625,
      videoURL: {uri: filename},
      rate: 1,
      volume: 1,
      muted: false,
      resizeMode: 'contain',
      duration: 0.0,
      currentTime: 0.0,

      doUpload: false,
      progressCount: 0,

      myMessage: '',
      phoneValid: '',
      phoneType: '',
      phoneValue: '',
      formattedValue: '',
      //allowedViewDays: 15,
      //noTimesToView: 5
    };

    this.alreadyApplied = false;
    //only interested in occ one
    this.jobObj = this.props.route.params.jobObj;
    //this.jobObj = Object.values(this.props.route.params.jobObj)[0];

    if (typeof this.jobObj !== 'undefined') {
      //if (this.jobObj.status==="accepted" ||this.jobObj.status==="rejected") {
      if (this.jobObj.contactPhone) {
        this.state.phoneValue = this.jobObj.contactPhone;
      }
      this.alreadyApplied = true;
      //}
    }
  }

  componentDidMount() {
    this.loadRecordings();
  }

  onProgress = (currentTime) => {
    //this.currentTime = data.currentTime;
    this.setState({currentTime: currentTime});
    //console.log('current time: ', this.state.currentTime);
  };

  onEnd = () => {
    //console.log('onEnd: pause play')
    //this.setState({feedbackPaused: true}, () => this.recPlayer.seekTo(0));
    this.setState({
      feedbackPaused: true,
      currentTime: 0,
      pauseMainPlayer: false,
    });
  };

  updatePhoneInfo = () => {
    this.setState({
      phoneValid: this.phone.isValidNumber(),
      phoneType: this.phone.getNumberType(),
      phoneValue: this.phone.getValue(),
    });
  };

  jumpToPosAndPlay = (posTime) => {
    //console.log('jumpToPosAndPlay');
    //this.setState({paused: false}, () => this.recPlayer.current.seek(posTime));
    this.setState({newTime: posTime, refreshPlayerTime: true}, () =>
      this.setState({refreshPlayerTime: false}),
    );
  };

  loadRecordings = () => {
    // TODO tell them that they should set up (boss) or join (user) a job
    //var myArray;
    // Get local recordings
    // console.log("loadRecordings: global.UID is: ", global.UID);
    store
      .get(global.UID)
      .then((res) => {
        if (Array.isArray(res) && res.length) {
          this.setState({recordings: [...res]});
        } else {
          if (!this.alreadyApplied && this.jobObj.videoRqdBool) {
            alert(
              'The employer requires an introductory video to enquire for this job.',
            );
          }
        }
      })
      .catch((error) => {
        //console.log("Promise is rejected with error: " + error);
      });
  };

  addEnquiry = () => {
    //console.log("addInstructions: global.job is ", global.job ,"addInstructions: global.requirement is ", global.requirement)
    // make sure that they have added the requirement first
    //if (!this.state.recordingPickerSelectedItem || this.newExercise.textExerciseInput) {
    // Alert.alert("You must add the requirement first")
    // }

    if (!this.state.videoURL.uri && this.jobObj.videoRqdBool) {
      alert('You need to add a recording before enquiring for a job');
    } else {
      // check that a job and requirement selected
      if (!global.job) {
        alert('You must select a Job.');
        return;
      }

      // check message
      if (!this.state.myMessage) {
        Alert.alert('You must enter a brief request to the employer');
        return;
      }

      // check phone number
      if (!this.phoneRef.current.isValidNumber(this.state.phoneValue)) {
        alert('You must enter a valid phone number');
        return;
      }

      // there might be a video even though one is not required
      const enquiryObj = {};
      enquiryObj.job_id = this.jobObj.job_id;
      enquiryObj.appliedDate = Date.now();
      enquiryObj.name = global.displayName;
      enquiryObj.status = 'pending';
      enquiryObj.message = this.state.myMessage;
      let today = new Date();
      let endDate = new Date();
      // make the end date the application end date of the job
      //enquiryObj.endDate = endDate.setDate(today.getDate() + this.state.allowedViewDays)
      //enquiryObj.endDate = endDate.setDate(today.getDate() + this.state.allowedViewDays)
      //enquiryObj.noTimesToView = this.state.noTimesToView
      enquiryObj.name = global.displayName;
      enquiryObj.messageType = 'text';
      enquiryObj.recording = false;
      enquiryObj.contactPhone = this.state.phoneValue;

      updateApplication({enquiryObj});

      if (this.state.videoURL) {
        uploadRecording(this.state.videoURL, this.updateProgress).then(
          (response, reject) => {
            if (response) {
              this.setState({doUpload: true});
              enquiryObj.messageType = 'video';
              enquiryObj.recording = response.headers.Location;
            }
          },
        );
      }
    }
  };

  didUpdate = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  updateVideo = (url) => {
    this.setState({videoURL: url});
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

  toggleVideoView = () => {
    return this.state.toggleVideo ? (
      <View style={{width, height: this.state.videoHeight}}>
        <Video
          ref={(ref) => {
            this.recPlayer = ref;
          }}
          paused={this.state.paused}
          onLoad={() => {
            // console.log("LOADING VIDEO, before setState,  paused is ", this.state.paused)
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
    ) : null;
  };

  goToVideo = () => {
    this.props.navigation.navigate('Video');
  };

  renderPhoneInfo = () => {
    if (this.state.phoneValue) {
      return (
        <View style={styles.info}>
          <Text>
            Is Valid:{' '}
            <Text style={{fontWeight: 'bold'}}>
              {this.state.phoneValue.toString()}
            </Text>
          </Text>
          <Text>
            Type:{' '}
            <Text style={{fontWeight: 'bold'}}>{this.state.phoneType}</Text>
          </Text>
          <Text>
            Value:{' '}
            <Text style={{fontWeight: 'bold'}}>{this.state.phoneValue}</Text>
          </Text>
        </View>
      );
    }
  };

  updateProgress = (count) => {
    this.setState({progressCount: parseInt(count, 10) * 100});
  };

  renderProgress = () => {
    return (
      <View>
        <Progress.Bar
          style={styles.progress}
          progress={this.state.progressCount}
          indeterminate={false}
        />
        <Text>{`${this.state.progressCount}% Uploaded`}</Text>
      </View>
    );
  };

  render() {
    return (
      <View
        style={[width, styles.container]}
        {...testProperties('Enquiry-screen')}>
        {/*         <NavigationEvents
          onWillFocus={payload => {
            this.loadRecordings();
          }}
        /> */}
        <ScrollView keyboardShouldPersistTaps={'handled'}>
          <View>
            {(this.state.recordingPickerSelectedItem !== undefined ||
              this.state.toggleVideo) && (
              <View style={styles.container}>
                {this.toggleVideoView()}
                <TouchableOpacity
                  style={styles.touchIconRight}
                  onPress={this.hideShowPlayer}>
                  <Text
                    style={{alignSelf: 'center', color: 'green', fontSize: 18}}>
                    {this.state.toggleVideo
                      ? 'Hide Recording'
                      : 'View Recording'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            <View>
              <View style={styles.likeRow}>
                <View style={styles.contentContainer}>
                  {!this.alreadyApplied && (
                    <Button
                      title={
                        this.jobObj.videoRqdBool
                          ? `Make a Video)`
                          : `Make a Video (Optional)`
                      }
                      containerViewStyle={{alignSelf: 'center'}}
                      buttonStyle={{alignSelf: 'flex-start', height: 50}}
                      titleStyle={styles.text}
                      accessibilityLabel="Make a Video"
                      onPress={() => {
                        this.goToVideo();
                      }}
                    />
                  )}
                  {this.state.recordings.length <= 0 && (
                    <Text style={{marginLeft: 10}}>No Videos Available</Text>
                  )}
                  {this.state.recordings.length > 0 && !this.alreadyApplied && (
                    <RNPickerSelect
                      placeholder={{
                        label: 'Select a video...',
                        value: null,
                        color: 'purple',
                      }}
                      style={pickerSelectStyles}
                      items={this.state.recordings.map((row, index) => ({
                        value: index,
                        label: row.description,
                      }))}
                      value={this.state.recordingPickerSelectedItem}
                      onValueChange={(value, index) => {
                        // console.log("value, index ", value, " ", index)
                        this.setState({
                          recordingPickerSelectedItem: value,
                          // update video player
                          videoURL: {
                            uri: this.state.recordings[value].filename,
                          },
                        });
                      }}
                    />
                  )}

                  {this.state.doUpload && this.renderProgress()}

                  <View style={{flexDirection: 'column', marginTop: 35}}>
                    {!this.alreadyApplied ? (
                      <View style={styles.container}>
                        <TextInput
                          ref={(input) => {
                            this.textExerciseInstructionsInput = input;
                          }}
                          value={this.state.myMessage}
                          onChangeText={(myMessage) =>
                            this.setState({myMessage})
                          }
                          placeholder="Brief request to employer"
                          editable={true}
                          multiline={true}
                          maxLength={2000}
                          numberOfLines={Platform.OS === 'ios' ? null : 10}
                          minHeight={
                            Platform.OS === 'ios' && 15 ? 15 * 15 : null
                          }
                          clearButtonMode="always"
                          style={[
                            {textAlignVertical: 'top'},
                            styles.multilineBox,
                          ]}
                          autoGrow={true}
                        />
                        <Text style={styles.text}>Add a phone number:</Text>
                        <PhoneInput
                          defaultValue={this.state.phoneValue}
                          layout="first"
                          onChangeText={(text) => {
                            this.setState({phoneValue: text});
                          }}
                          onChangeFormattedText={(text) => {
                            this.setState({formattedValue: text});
                          }}
                          defaultCode={'AU'}
                          countryPickerProps={{withAlphaFilter: true}}
                          withShadow
                          autoFocus
                          value={
                            this.state.phoneValue ? this.state.phoneValue : ''
                          }
                          ref={this.phoneRef}
                        />

                        {/**<TouchableOpacity onPress={this.updatePhoneInfo} style={styles.button}>
                          <Text>Get Info</Text>
                          </TouchableOpacity>*/}

                        {/**this.renderPhoneInfo()*/}
                      </View>
                    ) : (
                      <View style={styles.container}>
                        <Text
                          style={[
                            {marginBottom: 25, fontWeight: 'bold'},
                            styles.text,
                          ]}>
                          Your Enquiry message
                        </Text>
                        <TextInput
                          value={this.jobObj.message}
                          editable={false}
                          multiline={true}
                          maxLength={2000}
                          numberOfLines={Platform.OS === 'ios' ? null : 7}
                          minHeight={
                            Platform.OS === 'ios' && 7 ? 15 * 15 : null
                          }
                          style={[
                            {textAlignVertical: 'top', color: '#334FFF'},
                            styles.multilineBox,
                          ]}
                          autoGrow={true}
                        />
                        <Text style={[styles.text, {fontWeight: 'bold'}]}>
                          Decision: {this.jobObj.status}
                        </Text>
                        <TextInput
                          value={this.jobObj.decisionMsg}
                          editable={false}
                          multiline={true}
                          maxLength={2000}
                          numberOfLines={Platform.OS === 'ios' ? null : 15}
                          minHeight={
                            Platform.OS === 'ios' && 15 ? 15 * 15 : null
                          }
                          clearButtonMode="always"
                          style={[
                            {
                              textAlignVertical: 'top',
                              marginTop: 10,
                              color: '#334FFF',
                            },
                            styles.multilineBox,
                          ]}
                          autoGrow={true}
                        />
                        <Text style={styles.text}>My phone number:</Text>
                        {/*                         <PhoneInput
                          disabled={true}
                          style={[
                            styles.text,
                            {
                              borderWidth: 1,
                              color: '#5d5d5d',
                              width: '50%',
                              borderColor: '#1ca0ff',
                            },
                          ]}
                          onPressFlag={() => {}}
                          value={
                            this.state.phoneValue ? this.state.phoneValue : ''
                          }
                          initialCountry={'au'}
                          ref={ref => {
                            this.phone = ref;
                          }}
                        /> */}
                      </View>
                    )}
                  </View>
                  {/** this bit fot later to restict viewing */}
                  {/**<View style={{flexDirection: "row" }}>
                      <Text style={[material.button,
                        styles.text2,
                        {width: "50%",
                        backgroundColor: "#1ca0ff",
                        borderWidth: 1,
                        color: 'white',
                        padding: 5  }]}
                        >They can play{"\n"}
                        my Recording</Text>
                      <NumericInput
                        minValue={1}
                        initValue={this.state.noTimesToView}
                        totalHeight={60}
                        separatorWidth={2}
                        inputStyle={{ fontSize: 18}}
                        rightButtonBackgroundColor='#8fb1aa'
                        iconStyle={{ color: 'white' }}
                        leftButtonBackgroundColor='#8fb1aa'
                        value={this.state.noTimesToView}
                        onChange={value => this.setState({noTimesToView: value})} />
                      <Text style={[material.button,
                        styles.text2,
                        {backgroundColor: "#1ca0ff",
                        borderWidth: 1,
                        color: 'white',
                        padding: 5  }]}
                        >times</Text>
                    </View>
                    <View style={{flexDirection: "row" }}>
                      <Text style={[material.button,
                      styles.text2,
                      {width: "50%",
                        backgroundColor: "#1ca0ff",
                        borderWidth: 1,
                        color: 'white',
                        padding: 10 }]}
                        >They can play{"\n"}
                        my Recording for</Text>
                      <NumericInput
                        minValue={1}
                        initValue={this.state.allowedViewDays}
                        totalHeight={68}
                        separatorWidth={2}
                        rightButtonBackgroundColor='#8fb1aa'
                        iconStyle={{ color: 'white' }}
                        inputStyle={{ fontSize: 18}}
                        leftButtonBackgroundColor='#8fb1aa'
                        value={this.state.allowedViewDays}
                        onChange={value => this.setState({allowedViewDays: value})} />
                      <Text style={[material.button,
                        styles.text2,
                        {backgroundColor: "#1ca0ff",
                        borderWidth: 1,
                        color: 'white',
                        padding: 5  }]}
                        >days
                      </Text>
                      </View>*/}
                </View>
              </View>
              <DropdownAlert ref={(ref) => (this.dropdown = ref)} />
              {!this.alreadyApplied && (
                <Button
                  title="SEND THE ENQUIRY"
                  containerViewStyle={{alignSelf: 'center', width: '83%'}}
                  buttonStyle={{alignSelf: 'center', width: '83%'}}
                  titleStyle={styles.text}
                  onPress={() => {
                    this.addEnquiry();
                  }}
                  {...testProperties('SendEnquiry-button')}
                />
              )}
            </View>
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
  likeRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 10,
  },
  contentContainer: {
    flex: 1,
    marginTop: 5,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    padding: 20,
  },
  titleText: {
    fontFamily: 'Cochin',
    fontWeight: 'bold',
    paddingLeft: 0,
    paddingTop: 10,
  },
  multilineBox: {
    alignSelf: 'flex-start',
    maxHeight: 350,
    borderColor: '#1ca0ff',
    borderWidth: 1,
    paddingLeft: 10,
    paddingRight: 10,
    marginVertical: -20,
    marginBottom: 10,
    width: '65%',
  },
  text: {
    padding: 8,
    fontSize: 14,
  },
  text2: {
    padding: 8,
    fontSize: 15,
    textAlignVertical: 'center',
    width: '20%',
  },
  info: {
    // width: 200,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginTop: 20,
  },
  button: {
    marginTop: 20,
    padding: 10,
  },
  progress: {
    margin: 10,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
