import {Platform} from 'react-native';
import {RNS3} from 'react-native-aws3';
import firestore from '@react-native-firebase/firestore';
import {Promise} from 'core-js';
import store from 'react-native-simple-store';
import AwsConfig from '../config/AwsConfig';

export const getUser = (uid) => {
  return new Promise(function (resolve, reject) {
    this.userFromFB = firestore.ref('/users');
    this.userFromFB.child(uid).once('value', (snapshot) => {
      //( "snap shot", snapshot.val())
      if (!snapshot.val()) {
        //console.log("snapshot: Oh No, user not found");
        reject('USER not found');
      } else {
        resolve(snapshot.val());
      }
    });
  });
};

export const loadRecordings = () => {
  return new Promise((resolve, reject) => {
    // TODO tell them that they should set up (boss) or join (user) a job
    var myArray;
    // Get local recordings
    store
      .get(global.UID)
      .then((res) => {
        if (Array.isArray(res) && res.length) {
          myArray = [...res];
          //myArray = res.slice(0);
          //console.log("loadRecordings: myArray in get: ", myArray);
          store.keys().then((keys) => {
            console.log('loadRecordings All keys: ', keys);
          });
          //this.state.recordings = myArray.slice();
          //this.setState({ stRecordings: myArray}, () => {console.log("loadRecordings: recordings get: ", this.state.stRecordings);});
          resolve(myArray);
        }
      })
      .catch((error) => {
        //console.log(("Promise is rejected with error: " + error);
        reject('Promise is rejected with error: ' + error);
      });
  });
};

export const uploadRecording = (fn, callback) => {
  return new Promise((resolve, reject) => {
    //console.log(("fn is ", fn);
    if (!fn.uri) {
      resolve('');
      return;
    }

    let fileName = fn.uri.substring(fn.uri.lastIndexOf('/') + 1);
    const file = {
      uri: Platform.OS === 'ios' ? fn : `file://${fn.uri}`,
      name: fileName,
      type: `audio/aac`,
    };

    const options = {
      keyPrefix: AwsConfig.keyPrefix,
      bucket: AwsConfig.bucket,
      region: AwsConfig.region,
      accessKey: AwsConfig.accessKey,
      secretKey: AwsConfig.secretKey,
    };

    RNS3.put(file, options)
      .progress((event) => {
        callback(event.percent);
        //console.log((`percent: ${event.percent}`);
      })
      .then((response) => {
        //console.log(response, "response from rns3 audio");
        if (response.status !== 201) {
          alert('Something went wrong, and the video was not uploaded.');
          console.error(response.body);
          reject(response.body);
          return;
        }
        resolve(response);
      })
      .catch((err) => {
        //console.log((err, "error audio upload");
      });
  });
};

export const getRefData = () => {
  return new Promise((resolve, reject) => {
    /*     const refData = firebaseDB.ref('/refData');
    refData.child('items').once('value', (snapshot) => {
      //console.log( "snap shot", snapshot.val())
      if (!snapshot.val()) {
        //console.log("snapshot: Email not found");
        reject('ref data not found');
      } else {
        const outArr = this.refDataToMultiSLFormat(snapshot.val());
        resolve(outArr);
      }
    }); */
  });
};
