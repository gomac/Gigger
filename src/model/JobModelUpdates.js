import firestore from '@react-native-firebase/firestore';
import * as geofirestore from 'geofirestore';
import {feedback} from '../components/Feedback';
import uuidv4 from 'uuid/v4';

// keep this separate so it can be used for adding a new job with discrete
// Read https://medium.com/madhash/how-not-to-get-a-30k-bill-from-firebase-37a6cb3abaca

const workTermsVals = [
  {label: 'Full Time', value: 0},
  {label: 'Part Time', value: 1},
  {label: 'Casual', value: 2},
  {label: 'Contract/Temp', value: 3},
];

const freqVals = [
  {label: 'one time', value: 0},
  {label: 'hourly', value: 1},
  {label: 'daily', value: 2},
  {label: 'weekly', value: 3},
  {label: 'p.a.', value: 4},
];

export const createNewJob = async ({jobObj}) => {
  const {name, description, videoRqdBool} = jobObj;
  // 1 Madatory fields
  const jobStatus = 'started';
  if (!name) {
    alert('You must enter a Job name first.');
    return;
  }
  // 2 Must not match existing job
  // get existing jobs for user_id and check not already exists
  /*   if (this.state.jobs.findIndex((x) => x.name === name) != -1) {
    Alert.alert('That Job name already exists.');
    return;
  } */
  if (!global.UID) {
    alert('No current user logged in');
  }

  const _id = uuidv4();
  // install @react-native-firebase/analytics
  // to use
  /*   async () =>
    await analytics().logEvent('createNewJob', {
      id: _id,
      name: newJobName,
      createDate: Date.now(),
    }); */

  await firestore()
    .collection('jobs')
    .doc(_id)
    .set({
      job_id: _id,
      name: name,
      description: description,
      videoRqdBool: videoRqdBool,
      status: jobStatus,
      user_id: global.UID,
    })
    .then(() => {
      feedback(name, '');
    })
    .catch((error) => {
      feedback(name, error);
    });

  console.log('inside updates and id is ', _id);
  return _id;
};

export const updateJobBasic = ({jobObj}) => {
  const {job_id, name, description, videoRqdBool} = jobObj;
  firestore()
    .collection('jobs')
    .doc(job_id)
    .update({
      name: name,
      description: description,
      videoRqdBool: videoRqdBool,
    })
    .then(() => {
      feedback(name, '');
    })
    .catch((error) => {
      feedback(name, error);
    });
};

const func = (acc, el) => {
  return [...acc, el.id];
};

export const updateJobCategories = ({jobObj}) => {
  const {job_id, selectedJobTypesArr} = jobObj;

  const jobCodesArr = selectedJobTypesArr.reduce(func, []);

  firestore()
    .collection('jobs')
    .doc(job_id)
    .update({
      selectedJobTypesArr: firestore.FieldValue.arrayUnion(...jobCodesArr),
    })
    .then(() => {
      feedback('', '');
    })
    .catch((error) => {
      feedback('', error);
    });
};

export const updateRequirements = ({jobObj}) => {
  const {job_id, requirement, criteria} = jobObj;
  const requirements = {};
  requirements.requirement = requirement;
  requirements.criteria = criteria;

  firestore()
    .collection('jobs')
    .doc(job_id)
    .update({requirements})
    .then(() => {
      feedback('', '');
    })
    .catch((error) => {
      feedback('', error);
    });
};

//NOTE the selectedJobTypes is the jobCategories
export const updateJobTerms = ({jobObj}) => {
  const {
    job_id,
    workTerms,
    payFreq,
    minPayValue,
    maxPayValue,
    applicationEndDate,
    jobStartDate,
    jobEndDate,
    maxApplicantNum,
  } = jobObj;

  const terms = {};
  terms.workTerms = workTerms;

  if (payFreq) {
    terms.payFreq = payFreq;
  }

  terms.minPayValue = minPayValue;
  terms.maxPayValue = maxPayValue;
  terms.applicationEndDate = applicationEndDate;
  terms.jobStartDate = jobStartDate;
  terms.jobEndDate = jobEndDate;
  terms.maxApplicantNum = maxApplicantNum;
  terms.currentApplicantntNum = 0;

  firestore()
    .collection('jobs')
    .doc(job_id)
    .update({terms})
    .then(() => {
      feedback('', '');
    })
    .catch((error) => {
      feedback('', error);
    });
};

export const updateJobLoc = (markers, {jobObj}) => {
  const {job_id, address_components} = jobObj;

  const latitude = markers[0]?.coordinate.latitude;
  const longitude = markers[0]?.coordinate.longitude;
  // Create a GeoFirestore reference
  const GeoFirestore = geofirestore.initializeApp(firestore());

  // Create a GeoCollection reference
  const geocollection = GeoFirestore.collection('jobLocs');

  if (!job_id) {
    alert('There was an error adding location');
  }
  // Add a GeoDocument to a GeoCollection
  geocollection
    .add({
      job_id,
      // The coordinates field must be a GeoPoint!
      //coordinates: new firestore.GeoPoint(40.7589, -73.9851),
      coordinates: new firestore.GeoPoint(latitude, longitude),
    })
    .then(() => {
      feedback('', '');
    });

  // todo add human readable address

  // Create a GeoQuery based on a location
  const query = geocollection.near({
    //center: new firestore.GeoPoint(40.7589, -73.9851),
    center: new firestore.GeoPoint(latitude, longitude),
    radius: 1000,
  });

  // Get query (as Promise)
  query.get().then((value) => {
    // All GeoDocument returned by GeoQuery, like the GeoDocument added above
    console.log(value.docs);
  });
};
