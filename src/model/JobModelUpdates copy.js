import firestore from '@react-native-firebase/firestore';
import * as geofirestore from 'geofirestore';
import {feedback} from '../components/Feedback';

import uuidv4 from 'uuid/v4';

// keep this separate so it can be used for adding a new job with discrete
// transactions
// Decision time. Technically, the best solution is to keep nice discrete transactions
// to make for easier maintenance. However, this would mean multiple visits to the
// Firebase database which is charged by transactions. Better, from cost
// to make one large transaction
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

export const createNewJob = ({
  newJobName,
  newJobDesc,
  videoRqdBool,
  selectedJobTypesArr,
  requirement,
  criteria,
  jobStatus,
  workTerms,
  payFreq,
  minPayValue,
  maxPayValue,
  applicationEndDate,
  jobStartDate,
  jobEndDate,
  maxApplicantNum,
}) => {
  // 1 Madatory fields
  if (!newJobName) {
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

  // categories
  let CatObj = {};
  selectedJobTypesArr.map((jobType) => {
    CatObj[jobType.id] = jobType.title;
  });

  // requirements
  const requirements = {};
  requirements.requirement = requirement;
  requirements.criteria = criteria;

  // status details

  const terms = {};
  terms.jobStatus = jobStatus;
  if (typeof workTerms !== 'undefined' && workTerms !== '') {
    terms.workTerms = workTermsVals[workTerms].label;
  } else {
    terms.workTerms = '';
  }

  if (payFreq) {
    terms.payFreq = freqVals[payFreq].label;
  }

  terms.minPayValue = minPayValue;
  terms.maxPayValue = maxPayValue;
  terms.applicationEndDate = applicationEndDate;
  terms.jobStartDate = jobStartDate;
  terms.jobEndDate = jobEndDate;
  terms.maxApplicantNum = maxApplicantNum;
  terms.currentApplicantntNum = 0;
  terms.selectedJobTypesArr = selectedJobTypesArr;

  firestore()
    .collection('jobs')
    .doc(_id)
    .set({
      job_id: _id,
      name: newJobName,
      description: newJobDesc,
      videoRqdBool: videoRqdBool,
      user_id: global.UID,
      selectedJobTypes: CatObj,
      requirements,
      terms,
    })
    .then(() => {
      feedback(newJobName, '');
      return _id;
    })
    .catch((error) => {
      feedback(newJobName, error);
    });

  // jobloc
  const jobObj = {};
  jobObj._id = _id;
  updateJobLoc(jobObj);
};

export const updateJobBasic = (jobObj) => {
  const {job_id, newJobName, newJobDesc, videoRqdBool} = jobObj;
  firestore()
    .collection('jobs')
    .doc(job_id)
    .update({
      name: newJobName,
      description: newJobDesc,
      videoRqdBool: videoRqdBool,
    })
    .then(() => {
      feedback(newJobName, '');
    })
    .catch((error) => {
      feedback(newJobName, error);
    });
};

export const updateJobCategories = (jobObj) => {
  const {job_id, selectedJobTypesArr} = jobObj;
  let obj = {};
  selectedJobTypesArr.map((jobType) => {
    obj[jobType.id] = jobType.title;
  });
  firestore()
    .collection('jobs/selectedJobTypesArr')
    .doc(job_id)
    .update({selectedJobTypesArr: obj})
    .then(() => {
      feedback('', '');
    })
    .catch((error) => {
      feedback('', error);
    });
};

export const updateRequirements = (jobObj) => {
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
export const updateJobTerms = (jobObj) => {
  const {
    job_id,
    jobStatus,
    workTerms,
    payFreq,
    minPayValue,
    maxPayValue,
    applicationEndDate,
    jobStartDate,
    jobEndDate,
    maxApplicantNum,
    selectedJobTypesArr,
  } = jobObj;

  const terms = {};
  terms.jobStatus = jobStatus;
  terms.workTerms = workTermsVals[workTerms].label;

  if (payFreq) {
    terms.payFreq = freqVals[payFreq].label;
  }

  terms.minPayValue = minPayValue;
  terms.maxPayValue = maxPayValue;
  terms.applicationEndDate = applicationEndDate;
  terms.jobStartDate = jobStartDate;
  terms.jobEndDate = jobEndDate;
  terms.maxApplicantNum = maxApplicantNum;
  terms.currentApplicantntNum = 0;
  terms.selectedJobTypesArr = selectedJobTypesArr;

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

export const updateJobLoc = (jobObj) => {
  const {job_id} = jobObj;
  // Create a GeoFirestore reference
  const GeoFirestore = geofirestore.initializeApp(firestore());

  // Create a GeoCollection reference
  const geocollection = GeoFirestore.collection('jobLocs');

  if (!job_id) {
    alert('There was an error adding location');
  }
  // Add a GeoDocument to a GeoCollection
  geocollection.add({
    job_id,
    // The coordinates field must be a GeoPoint!
    coordinates: new firestore.GeoPoint(40.7589, -73.9851),
  });

  // Create a GeoQuery based on a location
  const query = geocollection.near({
    center: new firestore.GeoPoint(40.7589, -73.9851),
    radius: 1000,
  });

  // Get query (as Promise)
  query.get().then((value) => {
    // All GeoDocument returned by GeoQuery, like the GeoDocument added above
    console.log(value.docs);
  });
};
