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

//  QUERY BY job_id
export const GetApplicationsByJobId = (jobArr) => {
  return new Promise((resolve, reject) => {
    let jobIdArr = [];
    jobArr.map((job) => {
      jobIdArr.push(job.job_id);
    });

    let dataArr = [];
    // 'By default, a query retrieves all documents that satisfy
    // the query in ascending order by document ID'
    // 'You cannot order your query by any field included in an equality (=) or in clause'
    firestore()
      .collection('applications')
      .where('__name__', 'in', jobIdArr)
      .get()
      .then((querySnapshot) => {
        var result = querySnapshot.docs.reduce(function (acc, val) {
          //var k = val.data().job_id; // unique key
          var k = val.id; // use the job_key as the unique key
          if (acc[k] || (acc[k] = [])) {
            Object.values(val.data()).map((el) => acc[k].push(el));
          }
          return acc;
        }, {});

        resolve(result);
      })
      .catch((error) => {
        reject(`Error getting documents: ${error}`);
      });
  });
};

export const GetApplicationsByUid = async (uid) => {
  let query = firestore()
    .collection('applications')
    .where('applicant_id', '===', uid);
  const [value, loading, error] = useCollectionDataOnce(query, {
    snapshotListenOptions: {includeMetadataChanges: true},
  });

  // pick job_ids into an array
  let arr = [];
  value.map((job) => {
    arr.push(job.job_id);
  });

  // get the job details for each one
  let outerArr = [];
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

  return outerArr;
};

/*
export const GetJobsByJob_Id = (job_id) => {
  //return firestore().collection('jobs').where('job_id', '==', job_id);
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
 */

// QUERY BY criteria
export const GetApplicationsByCriteria = (criteria) => {
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
