import firestore from '@react-native-firebase/firestore';
import {merge} from 'lodash';
import {feedback} from '../components/Feedback';

export const updateApplication = ({enquiryObj}) => {
  const {
    job_id,
    appliedDate,
    status,
    message,
    name,
    messageType,
    recording,
    contactPhone,
  } = enquiryObj;

  const obj = {
    [global.UID]: {
      job_id: job_id,
      applicant_id: global.UID,
      appliedDate: appliedDate,
      status: status,
      message: message,
      name: name,
      messageType: messageType,
      recording: recording,
      contactPhone: contactPhone,
    },
  };

  firestore()
    .collection('applications')
    .doc(job_id)
    .set(obj, {merge: true})
    .then(() => {
      firestore()
        .collection('users')
        .doc(global.UID)
        .update({jobs: firestore.FieldValue.arrayUnion(job_id)})
        .then(() => {
          feedback(name, '');
        })
        .catch((error) => {
          feedback(name, error);
        });
    })
    .catch((error) => {
      feedback(name, error);
    });
};

export const updateApplicationDecision = ({enquiryObj}) => {
  const {job_id, decision, decisionMsg} = enquiryObj;

  firestore()
    .collection('applications')
    .doc(job_id)
    .set(
      {
        __name__: {
          changedDate: Date.now(),
          decision: decision,
          decisionMsg: decisionMsg,
        },
      },
      {merge: true},
    )

    .then(() => {
      feedback(job_id, '');
    })
    .catch((error) => {
      feedback(job_id, error);
    });
};
