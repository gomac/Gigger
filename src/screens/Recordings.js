'use strict';
import React, {Component} from 'react';
import {
  Alert,
  Button,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ListItem} from 'react-native-elements';
import Video from 'react-native-video-controls';
import store from 'react-native-simple-store';
import moment from 'moment';
import DropdownAlert from 'react-native-dropdownalert';
const width = Dimensions.get('window').width;

class Recordings extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.currentTime = 0.0;

    this.state = {
      // show video at startup
      toggleVideo: false,
      stRecordings: [],
      forceRefreshRequiredInd: false,

      filename: '', // key
      recordDate: '',
      description: '',
      currentRec: {},
      // state for the video player
      paused: true,
      playWhenInactive: false,
      playInBackground: false,
      repeat: false,
      videoURL: '',
      showPlayerBool: true,
      rate: 1,
      volume: 1,
      muted: false,
      resizeMode: 'contain',
      duration: 0.0,
      videoHeight: width * 0.5625,
      loggedInUser: {},
      loading: false,
    };

    // Get updated object
    store.get('loggedUser').then((res) => {
      if (res) {
        //console.log("res.user ", res.user);
        this.setState({
          loggedInUser: res.user,
          stRecordings: res.filename,
          //entityInFocus: res.entityInFocus
        });
        store.keys().then((keys) => {});
      }
    });

    store.get(global.UID).then((res) => {
      if (res) {
        //console.log("res.user ", res.user);
        this.setState({
          loggedInUser: res.user,
          //stRecordings: res.filename
          //entityInFocus: res.entityInFocus
        });
        //store.keys().then( (keys) => {console.log('global.UID: ', keys)});
      }
    });
  }

  onEnd = () => {
    //console.log('onEnd: pause play')
    this.setState({paused: true}, () => this.recPlayer.seekTo(0));
  };

  componentDidMount() {
    this.loadRecordings();
  }

  setstRecordings = (arr) => {
    this.setState({stRecordings: myArray});
  };

  loadRecordings = () => {
    // TODO tell them that they should set up (boss) or join (user) a job
    var myArray;
    // Get local recordings
    store
      .get(global.UID)
      .then((res) => {
        myArray = [...res];
        this.setState({stRecordings: myArray});
      })
      .catch((error) => {
        // console.log("Promise is rejected with error: " + error);
      });
  };

  videoSubmitHandler = () => {
    if (this.state.recordingName.trim() === '') {
      return;
    }
    this.props.add(this.state.recordingName);
  };

  recordingNameChangeHandler = (value) => {
    this.setState({recordingName: value});
  };

  refreshRqd = () => {
    this.setState({forceRefreshRequiredInd: true});
  };

  onLearnMore = (recording) => {
    this.props.navigation.navigate('Details', {...recording});
  };

  playRecording = (recording, url = false) => {
    //this.setState({ currentRec: Object.assign({}, this.state.currentRec, recording )});
    // console.log("playRecording this.setState: ", this.state.paused);
    if (url) {
      this.setState({videoURL: recording, paused: false});
    } else {
      this.setState({videoURL: recording.filename, paused: false});
    }
    //console.log("playRecording: filename " + recording.filename);
    //console.log("playRecording: videoURL " + this.state.videoURL);
  };

  onLoad = (data) => {
    this.setState({duration: data.duration});
  };

  onProgress = (data) => {
    this.currentTime = data.currentTime;
    //console.log('current time: ', this.state.currentTime);
  };

  humanizeDuration(input, units) {
    // units is a string with possible values of y, M, w, d, h, m, s, ms
    var duration = moment().startOf('day').add(input, units),
      format = '';
    if (duration.hour() > 0) {
      format += 'h[:]';
    }
    if (duration.minute() > 0) {
      format += 'mm[:]';
    }
    format += 'ss';
    return duration.format(format);
  }

  returnData(recordingID) {
    // stitch this on to the comment
    //console.log('returnData: recordingID ', recordingID);
  }

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

  jumpToPosAndPlay = (posTime) => {
    //console.log('jumpToPosAndPlay');
    this.setState({paused: false}, () => this.recPlayer.seekTo(posTime));
  };

  getPlayerPos = () => {
    //console.log('currentTime: ', this.state.currentTime);
    return this.currentTime;
  };

  requestActioned = (job, pendingUID) => {
    // a request has been actioned, rejected or accepted
    // take it off the jobReqObj
    let filteredArr = this.state.jobReqObj[job._id].filter(function (
      value,
      index,
      arr,
    ) {
      return value.UID != pendingUID;
    });
    this.setState({jobReqObj: filteredArr});
  };

  renderFooter = () => {
    if (!this.state.loading) return null;
    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: '#CED0CE',
        }}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '86%',
          backgroundColor: '#CED0CE',
          marginLeft: '14%',
        }}
      />
    );
  };

  hideShowPlayer = () => {
    // The toggleVideo state variable is used to create the player
    // the showPlayerBool is used to make it invisible,
    // so we can maximise the screen space and continue to listen to the recording
    let videoHeight = width * 0.5625;
    if (this.state.showPlayerBool) {
      videoHeight = 0;
    }
    this.setState({
      videoHeight: videoHeight,
      showPlayerBool: !this.state.showPlayerBool,
    });
  };

  onVideoError = (err) => {
    console.log('ERROR FROM VIDEO ', err);
  };

  videoView = () => {
    return (
      <View>
        <View style={{width, height: this.state.videoHeight}}>
          <Video
            ref={(ref) => {
              this.recPlayer = ref;
            }}
            paused={this.state.paused}
            onLoad={() => {
              this.setState({
                paused: true,
              });
            }}
            disableFullscreen={true}
            controlTimeout={60000}
            posterStyles={{resizeMode: 'cover'}}
            repeat={false}
            onProgress={this.onProgress}
            onEnd={this.onEnd}
            style={StyleSheet.absoluteFill}
            source={{uri: this.state.videoURL}}
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
    );
  };

  deleteRecording = (obj, index) => {
    Alert.alert(
      'Delete',
      `You are about to delete recording ${obj.description}`,
      [
        {
          text: 'Cancel',
          //onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            //console.log('OK Pressed')
            try {
              store
                .get(global.UID)
                .then((res) => {
                  if (res) {
                    // cant delete an occ of store array
                    // instead delete occ in state.strecordings and add it back
                    // overwriting the old one
                    let tempArr = [...this.state.stRecordings];
                    if (index !== null) {
                      tempArr.splice(index, 1);
                      store
                        .save(global.UID, tempArr)
                        .then(() => this.loadRecordings());
                    }
                  }
                })
                .then(() => this.loadRecordings());
            } catch (error) {
              console.log(error);
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  videoList = () => {
    //const avatar_url = "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"
    const avatar_url = '';
    return (
      <View style={styles.bottomBlock}>
        <TouchableOpacity
          style={styles.touchIconRight}
          onPress={this.hideShowPlayer}>
          {this.state.showPlayerBool ? (
            <Text style={{color: 'green'}}>Hide Player</Text>
          ) : (
            <Text style={{color: 'green'}}>Show Player</Text>
          )}
        </TouchableOpacity>
        <Text style={{marginLeft: 10}}>
          You have no videos recorded. You can press the 'Video' tab below to
          make one
        </Text>

        <View style={[width, styles.container]}>
          <ScrollView contentContainerStyle={{flexGrow: 1}}>
            {this.state.stRecordings &&
              this.state.stRecordings.map((recording, index) => (
                <ListItem
                  key={recording.filename}
                  type={recording.type}
                  avatar={{uri: recording.filename}}
                  title={recording.description}
                  subtitle={recording.recordDate}
                  ItemSeparatorComponent={this.renderSeparator}
                  date={recording.recordDate}
                  rightElement={() => this.renderRowButton(recording)}
                  onPress={() => this.playRecording(recording)}
                  onLongPress={() => this.deleteRecording(recording, index)}
                />
              ))}
          </ScrollView>
        </View>
      </View>
    );
  };

  renderRowButton = (recording) => {
    return (
      <View>
        <Button
          title="Details"
          buttonStyle={{backgroundColor: '#2089dc'}}
          accessibilityLabel="Details"
          onPress={() => {
            this.onLearnMore(recording);
          }}
        />
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container} pointerEvents="box-none">
        {/*         <NavigationEvents
          onWillFocus={payload => {
            //console.log("NavigationEvents: will focus payload is", payload);
            // on return from an update if we have added a job
            //console.log("forceRefreshRequiredInd ", this.state.forceRefreshRequiredInd)
            this.loadRecordings();
            //TODO do this later. there are now three copies of loadRecordings
            //DBHelpers.loadRecordings()
            //.then ((response, reject) => {
            // this.setstRecordings(response)
            //})
          }}
          onWillBlur={() => {
            //console.log("NavigationEvents: onWillBlur");
            //this.onEnd();
          }}
        /> */}
        {this.videoView()}
        {this.videoList()}
        <DropdownAlert ref={(ref) => (this.dropdown = ref)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rowText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#2089dc',
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  bottomBlock: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 18,
  },
  likeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  touchIconLeft: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  touchIconRight: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  iconText: {
    marginTop: 5,
  },
  padding: {
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  // This pushes the view out of the viewport, but why the negative bottom?
  hiddenContainer: {
    top: window.height,
    bottom: -window.height,
  },
  titleText: {
    fontFamily: 'Cochin',
    fontWeight: 'bold',
  },
  baseText: {
    fontFamily: 'Cochin',
    fontWeight: 'normal',
  },
  button1: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#c37dc6',
  },
  button2: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#adbce6',
  },
  button3: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#27ddc5',
  },
});

export default Recordings;
