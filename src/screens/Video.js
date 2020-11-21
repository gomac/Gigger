import React, {Component} from 'react';
import store from 'react-native-simple-store';
import {
  Alert,
  Button,
  Image,
  Keyboard,
  PermissionsAndroid,
  Platform,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import {RNCamera} from 'react-native-camera';
import {Dialog, SlideAnimation, DialogTitle} from 'react-native-popup-dialog';
import CameraRoll from '@react-native-community/cameraroll';
import CircularTimer from 'react-native-circular-timer';
import moment from 'moment';

export default class Video extends Component {
  constructor(props) {
    super(props);
    const currentDate = new Date();
    this.camera = null;
    this.state = {
      cameraType: 'front',
      mirrorMode: false,
      isRecording: false,

      // recordings metadata
      recordings: [],
      filename: '', // key
      recordDate: moment(currentDate)
        .format('YYYY-MM-DD')
        .toString(),
      description: '',
      popVisible: false,
    };
  }

  _restartTimer = () => {
    if (this._timerRef) this._timerRef.restart();
  };

  takePicture = async function() {
    if (this.camera) {
      this.camera.capture().catch(err => console.error(err));
    }
  };

  checkAndroidPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'App Video Camera Permission',
          message: 'The App needs access to your camera .',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //console.log("You can use the camera");

        const data = await this.camera.takePictureAsync();
        let saveResult = CameraRoll.saveToCameraRoll(data.uri);
        //console.warn("takePicture ", saveResult);
        //console.warn("picture url ", data.uri);
      } else {
        //console.log("Camera permission denied");
      }
    } catch (err) {
      // console.warn(err);
    }
  };

  confirmAndRecord = () => {
    Alert.alert(
      'Get Ready to Record!',
      'Your recording has a maximum of 5 minutes',
      [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {text: `I'm Ready`, onPress: () => this.startRecording()},
      ],
      {cancelable: false},
    );
  };

  startRecording = async () => {
    if (this.camera) {
      this.setState({recorded: false});
      this.setState({
        isRecording: true,
      });
      const options = {
        maxDuration: 15,
        mute: false,
      };
      //const data =  await this.camera.recordAsync(options)
      const {uri, codec = 'mp4'} = await this.camera.recordAsync(options);
      if (Platform.OS === 'android') {
        const result = await this.checkAndroidPermission();
        //console.log("RESULT IS ", result)
      }
      this.setState({filename: uri});

      CameraRoll.saveToCameraRoll(this.state.filename, 'video');
      //console.log("FILE", this.state.filename);
    }
  };

  stopRecording = async () => {
    if (this.state.isRecording) {
      await this.camera.stopRecording();
      this.setState({isRecording: false});

      this.setState({popVisible: true});
      //this.popupDialog.show();
    }
  };

  switchType = () => {
    let newType;
    const {back, front} = RNCamera.Constants.Type;

    if (this.state.type === back) {
      newType = front;
      newMirrorMode = true;
    } else if (this.state.type === front) {
      newType = back;
      newMirrorMode = false;
    }

    this.setState({
      cameraType: newType,
      mirrorMode: newMirrorMode,
    });
  };

  switchTypeIcon() {
    let icon;
    const {back, front} = RNCamera.Constants.Type;

    if (this.state.cameraType === back) {
      icon = require('../assets/ic_camera_rear_white.png');
    } else if (this.statetype === front) {
      icon = require('../assets/ic_camera_front_white.png');
    }
    return icon;
  }

  switchFlash = () => {
    let newFlashMode;
    const {auto, on, off} = RNCamera.Constants.FlashMode;

    if (this.state.flash === auto) {
      newFlashMode = on;
    } else if (this.state.flash === on) {
      newFlashMode = off;
    } else if (this.state.flash === off) {
      newFlashMode = auto;
    }

    this.setState({
      camera: {
        ...this.state.camera,
        flashMode: newFlashMode,
      },
    });
  };

  get flashIcon() {
    let icon;
    const {auto, on, off} = RNCamera.Constants.FlashMode;

    if (this.state.flash === auto) {
      icon = require('../assets/ic_flash_auto_white.png');
    } else if (this.state.flash === on) {
      icon = require('../assets/ic_flash_on_white.png');
    } else if (this.state.flash === off) {
      icon = require('../assets/ic_flash_off_white.png');
    }

    return icon;
  }

  ///////// render //////////
  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={cam => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={this.state.aspect}
          captureTarget={this.state.captureTarget}
          type={this.state.cameraType}
          mirrorImage={this.state.mirrorMode}
          flashMode={this.state.flash}
          onFocusChanged={() => {}}
          onZoomChanged={() => {}}
          defaultTouchToFocus
          mirrorImage={false}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          captureAudio={true}
        />
        <View style={styles.countdownContainer}>
          {this.state.isRecording ? (
            <CircularTimer
              ref={refs => (this._timerRef = refs)}
              onTimeElapsed={() => {
                // console.log('Timer Finished!');
              }}
              radius={60}
              seconds={15}
              showSecond={true}
            />
          ) : null}
          <Text style={styles.arText}>
            Press the Video Recorder to begin recording
          </Text>
        </View>
        <View style={[styles.overlay, styles.topOverlay]}>
          <TouchableOpacity style={styles.typeButton} onPress={this.switchType}>
            <Image source={this.switchTypeIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.flashButton}
            onPress={this.switchFlash}>
            <Image source={this.flashIcon} />
          </TouchableOpacity>
        </View>
        <View style={[styles.overlay, styles.bottomOverlay]}>
          {/**
            !this.state.isRecording
            &&
            <TouchableOpacity
              style={styles.captureButton}
              onPress={this.takePicture}
            >
              <Image
                source={require('../assets/ic_photo_camera_36pt.png')}
              />
            </TouchableOpacity>
            ||
            null
          */}
          <View style={styles.buttonsSpace} />
          {(!this.state.isRecording && (
            <TouchableOpacity
              style={styles.captureButton}
              onPress={this.confirmAndRecord}>
              <Image source={require('../assets/ic_videocam_36pt.png')} />
            </TouchableOpacity>
          )) || (
            <TouchableOpacity
              style={styles.captureButton}
              onPress={this.stopRecording}>
              <Image source={require('../assets/ic_stop_36pt.png')} />
            </TouchableOpacity>
          )}
        </View>
        <Dialog
          visible={this.state.popVisible}
          ref={popupDialog => {
            this.popupDialog = popupDialog;
          }}
          containerStyle={{justifyContent: 'flex-start'}}
          height={200}
          dialogTitle={<DialogTitle title="Save your recording" />}
          dialogAnimation={
            new SlideAnimation({
              slideFrom: 'top',
            })
          }>
          <View style={styles.addRecordingPopup}>
            <View
              style={styles.addRecordingPopupDescriptionTextFieldsContainer}>
              <TextInput
                style={styles.addRecordingPopupTextInput}
                onChangeText={text => this.setState({description: text})}
                placeholder="Enter a recording description here."
              />
            </View>
            <View style={[styles.popupButtonView, {flexDirection: 'row'}]}>
              <View style={[{width: '30%', margin: 10}]}>
                <Button
                  onPress={() => {
                    //.then(this.props.navigation.navigate("Recordings"));
                    this.setState({popVisible: false});
                    //this.popupDialog.dismiss();
                    Keyboard.dismiss();
                    //this.props.navigation.navigate("Recordings");
                  }}
                  title="Cancel"
                  color="#42a1f4"
                />
              </View>
              <View style={[{width: '30%', margin: 10}]}>
                <Button
                  onPress={() => {
                    if (this.state.description) {
                      const video = {
                        type: 'video',
                        filename: this.state.filename,
                        recordDate: this.state.recordDate,
                        description: this.state.description,
                      };
                      store.push(global.UID, video);
                      //.then(this.props.navigation.navigate("Recordings"));
                      this.setState({popVisible: false});
                      //this.popupDialog.dismiss();
                      Keyboard.dismiss();
                      //this.props.navigation.navigate("Recordings");
                    } else {
                      alert('Name required');
                    }
                  }}
                  title="Save"
                  color="#42a1f4"
                />
              </View>
            </View>
          </View>
        </Dialog>
      </View>
    );
  }
}

/*
async storeItem(key, item) {
  try {
    var jsonOfItem = await AsyncStorage.setItem(key, JSON.stringify(item));
    return jsonOfItem;
  } catch (error) {
    console.log(error.message);
  }
}

async retrieveRecordings() {
  try {
    this.retrieveItem("videos").then((values) => {
      if (values) {
        var index = 0;
        values.forEach(function(recording) {
          var updatedRecording = new VideoSeg(recording.recordDate, recording.filename, recording.description);
          values[index] = updatedRecording;
          index++;
        });

        this.setState({ recordings: values });
        console.log(values);
      } else {
        console.log("We have no recordings");
      }
    }).catch((error) => {
      console.log("Promise is rejected with error: " + error);
    });
  } catch (error) {
    console.log(error.message);
  }
}

async retrieveItem(key) {
  try {
    const retrievedItem = await AsyncStorage.getItem(key);
    const item = JSON.parse(retrievedItem);
    return item;
  } catch (error) {
    console.log(error.message);
  }
  return
}



var VideoSeg = function(filename, recordDate, description) {
this.filename = filename;
this.recordDate = recordDate;
this.description = description;
};
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    padding: 16,
    right: 0,
    left: 0,
    alignItems: 'center',
  },
  topOverlay: {
    top: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomOverlay: {
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownContainer: {
    position: 'absolute',
    padding: 60,
    right: 0,
    left: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  arText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  captureButton: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 40,
  },
  baseText: {
    fontFamily: 'Cochin',
  },
  typeButton: {
    padding: 5,
  },
  flashButton: {
    padding: 5,
  },
  buttonsSpace: {
    width: 10,
  },
  addRecordingPopup: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  addRecordingPopupDescriptionTextFieldsContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  addRecordingPopupTextInput: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  popupButtonView: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 8,
    marginLeft: 12,
    marginRight: 12,
    marginBottom: 8,
  },
});
