import React, {useState} from 'react';
import {useCollection, useCollectionData} from 'react-firebase-hooks/firestore';
import firestore from '@react-native-firebase/firestore';
import * as geofirestore from 'geofirestore';

const Search = (criteria) => {
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

  const [value, loading, error] = useCollectionData(query, {
    snapshotListenOptions: {includeMetadataChanges: true},
  });

  firestore().collection('jobs');

  // QUERY BY (BOSS) UID
  function searchJobsByUID(id) {}

  // QUERY BY job_id
  function searchJobsById(id) {}

  // SEARCH BY LOCATION
  function searchByLocation(loc) {
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
    query.get().then((value) => {
      // All GeoDocument returned by GeoQuery, like the GeoDocument added above
      value.docs.map((doc) => {
        job_idArr.push(doc.data().job_id);
      });
    });
    return job_idArr;
  }
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

export default Search;
