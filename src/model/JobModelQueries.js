import React from 'react';
import {
  useCollection,
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

export const GetJobsByJob_Id = (job_id) => {
  //return firestore().collection('jobs').where('job_id', '==', job_id);
};

// SEARCH BY LOCATION
export const GetJobIdsInLocation = (loc) => {
  // Create a GeoFirestore reference
  const GeoFirestore = geofirestore.initializeApp(firestore());

  // Create a GeoCollection reference
  const geocollection = GeoFirestore.collection('jobLocs');

  // Create a GeoQuery based on a location
  const query = geocollection.near({
    center: new firestore.GeoPoint(40.7589, -73.9851),
    radius: 1000,
  });

  // Get query (as Promise)
  let job_idArr = [];
  query.get().then((value) => {
    // All GeoDocument returned by GeoQuery, like the GeoDocument added above
    value.docs.map((doc) => {
      job_idArr.push(doc.data().job_id);
    });
  });
  return job_idArr;
};

// QUERY BY criteria
export const GetJobsByCriteria = (criteria) => {
  const job_idArr = [];

  // a search can be
  // by BOSS'S UID
  // by applicant's UID
  // a criteria which should include a location
  let options = {
    where: [
      ['category', '==', 'someCategory'],
      ['color', '==', 'red'],
      ['author', '==', 'Sam'],
    ],
    orderBy: ['date', 'desc'],
  };

  //OR
  // A single where
  //
  //let options = {where: ['category', '==', 'someCategory']};
  const query = readDocuments(criteria);

  const [value, loading, error] = useCollectionDataOnce(query, {
    snapshotListenOptions: {includeMetadataChanges: true},
  });

  firestore().collection('jobs');
};

function readDocuments(collection, options = {}) {
  let {where, orderBy, limit} = options;
  let query = firestore().collection(collection);

  if (where) {
    if (where[0] instanceof Array) {
      // It's an array of array
      for (let w of where) {
        query = query.where(...w);
      }
    } else {
      query = query.where(...where);
    }
  }

  if (orderBy) {
    query = query.orderBy(...orderBy);
  }

  if (limit) {
    query = query.limit(limit);
  }

  return query;
}
