import {
  useCollection,
  useCollectionOnce,
  useCollectionData,
  useCollectionDataOnce,
} from 'react-firebase-hooks/firestore';
import firestore from '@react-native-firebase/firestore';

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

    firestore()
      .collection('applications')
      .where('__name__', 'in', jobIdArr)
      .get()
      .then((querySnapshot) => {
        var result = querySnapshot.docs.reduce(function (acc, val) {
          // for each job build job object of applications
          // each job has an array of application objects with the job as key
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

export const GetUserApplicationsFronJobArr = async (job_idArr) => {
  return new Promise((resolve, reject) => {
    // return an array of applns, one appln for each job for this UID
    let outerArr = [];
    firestore()
      .collection('applications')
      .where('__name__', 'in', job_idArr)
      .get()
      .then((snapshot) => {
        // the snapshot has the found set of applicationms by job
        // but we need to filter for this user
        snapshot.docs.map((doc) => {
          const appOut = Object.entries(doc.data()).filter((appln) => {
            return appln[0] === global.UID;
          });
          outerArr.push(appOut[0][1]);
        });
        resolve(outerArr);
      })
      .catch((e) => {
        console.log('error ', e);
        reject('error ', e);
      });
  });
};
