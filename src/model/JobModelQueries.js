import React, {useState} from 'react';
import {
  useCollection,
  useCollectionOnce,
  useCollectionData,
  useCollectionDataOnce,
} from 'react-firebase-hooks/firestore';
import firestore from '@react-native-firebase/firestore';
import * as geofirestore from 'geofirestore';

// QUERY BY (BOSS) UID
/* const GetJobsByUid = () => {
  //return firestore().collection('jobs').where('user_id', '==', uid);
}; */

// QUERY BY job_id
export const GetJobsByUid = (uid) => {
  let query = firestore()
    .collection('jobs')
    .where('user_id', '==', uid)
    .orderBy('name');
  return useCollectionData(query, {
    snapshotListenOptions: {includeMetadataChanges: true},
  });
};

export const GetJobsByUidOnce = (uid) => {
  let query = firestore()
    .collection('jobs')
    .where('user_id', '==', uid)
    .orderBy('name');
  return useCollectionDataOnce(query, {
    snapshotListenOptions: {includeMetadataChanges: true},
  });
};

export const GetUserJobs = (UID) => {
  return new Promise((resolve, reject) => {
    firestore()
      .collection('users')
      .doc(UID)
      .get()
      .then((querySnapshot) => {
        // pick job_ids into an array
        let arr = [];
        if (
          !querySnapshot ||
          typeof querySnapshot.data().jobs === 'undefined'
        ) {
          resolve([]);
        } else {
          querySnapshot.data().jobs.map((job_id) => {
            arr.push(job_id);
          });
          resolve(arr);
        }
      });
  });
};

export const GetJobsByJob_IdArr = (job_idArr) => {
  return new Promise((resolve, reject) => {
    let outArr = [];
    if (job_idArr.length > 0) {
      firestore()
        .collection('jobs')
        .where('job_id', 'in', job_idArr)
        .orderBy('name')
        .get()
        .then((value) => {
          value.docs.map((doc) => {
            outArr.push(doc.data());
          });
          resolve(outArr);
        });
    }
  });
};

export const GetJobsInLocationOnce = async (loc) => {
  let outerArr = [];
  let arr = [];
  arr = await GetJobIdsInLocation(loc);
  const snapshot = await firestore()
    .collection('jobs')
    .where('job_id', 'in', arr)
    .orderBy('name')
    .get();

  if (snapshot) {
    snapshot.docs.map((doc) => {
      outerArr.push(doc.data());
    });
  }

  console.log('outerArr ', outerArr);
  return outerArr;
};

export const GetRefData = () => {
  return useCollectionOnce(firestore().collection('refData'));
};

// SEARCH BY LOCATION
export const GetJobIdsInLocation = (loc) => {
  return new Promise((resolve, reject) => {
    // Create a GeoFirestore reference
    const GeoFirestore = geofirestore.initializeApp(firestore());

    // Create a GeoCollection reference
    const geocollection = GeoFirestore.collection('jobLocs');

    // Create a GeoQuery based on a location
    const query = geocollection.near({
      center: new firestore.GeoPoint(loc.latitude, loc.longitude),
      radius: 1000,
    });

    // Get query (as Promise)
    let job_idArr = [];
    query
      .get()
      .then((value) => {
        if (value?.docs?.length > 0) {
          // All GeoDocument returned by GeoQuery, like the GeoDocument added above
          value.docs.map((doc) => {
            job_idArr.push(doc.data().job_id);
          });
        }
      })
      .then(() => {
        resolve(job_idArr);
      })
      .catch(() => {
        reject('error in Job Query');
      });
  });
};

export const GetJobsByCriteriaLocation = (loc, jobTypeCodeArr) => {
  return new Promise((resolve, reject) => {
    GetJobIdsInLocation(loc).then((job_idArr) => {
      if (Array.isArray(jobTypeCodeArr) && jobTypeCodeArr.length > 0) {
        GetJobsByCriteria(job_idArr, jobTypeCodeArr).then((arr) => {
          resolve(arr);
        });
      } else {
        resolve(job_idArr);
      }
    });
  });
};

// QUERY BY criteria
export const GetJobsByCriteria = (job_idArr, jobTypeCodeArr) => {
  return new Promise((resolve, reject) => {
    let outArr = [];
    console.log('jobTypeCodeArr ', jobTypeCodeArr);
    firestore()
      .collection('jobs')
      .where('selectedJobTypesArr', 'array-contains-any', jobTypeCodeArr)
      .orderBy('name')
      .get()
      .then((value) => {
        value.docs.map((doc) => {
          // find them in jobTypeCodeArr
          console.log('doc ', doc);
          outArr.push(doc.data());
        });
        resolve(outArr);
      });
  });
};
