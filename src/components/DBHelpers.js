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
          alert('Something went wrong, and the audio was not uploaded.');
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

refDataToMultiSLFormat = (obj) => {
  // needs to look like this
  /*
		const outArr = [
  	// this is the parent or 'item'
  	{
			name: 'Building and related trades workers, excluding electricians',
			id: 0,
			// these are the children or 'sub items'
				children: [
					{
						name: 'Building finishers and related trades workers:',
						id: 10,
					},
					{
						name: 'Building frame and related trades workers',
						id: 17,
					}
				] */
  let outArr = [];
  const entries = Object.entries(obj);
  entries.map((heading, index) => {
    //console.log("heading ", heading)
    let outItem = {};
    //substring sort key which is first two digits
    outItem.title = heading[0].substring(2);
    outItem.id = 100 * (index + 1);
    //console.log("outItem.id ", outItem.id)
    // now map children
    let childArr = [];
    const children = Object.entries(heading[1]);
    children.map((child, index2) => {
      let outChild = {};
      //console.log("child ", child)
      outChild.title = child[0];
      outChild.id = outItem.id + (index2 + 1);
      //console.log("outChild.id ", outChild.id)
      childArr.push(outChild);
    });
    outItem.children = childArr;
    outArr.push(outItem);
  });
  //console.log("outArr ", outArr)
  return outArr;
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
