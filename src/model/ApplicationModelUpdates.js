import firestore from '@react-native-firebase/firestore';
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

  firestore()
    .collection('applications')
    .doc(job_id)
    .set(
      {
        applicant_id: global.UID,
        appliedDate: appliedDate,
        status: status,
        message: message,
        name: name,
        messageType: messageType,
        recording: recording,
        contactPhone: contactPhone,
      },
      {merge: true},
    )
    .then(() => {
      feedback(name, '');
    })
    .catch((error) => {
      feedback(name, error);
    });
};
