import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {merge} from 'lodash';
import {feedback} from '../../components/Feedback';
//simport {getUser} from '../../components/DBHelpers';

export const userLogin = (email, password) => {
  return new Promise((resolve) => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error) => {
        switch (error.code) {
          case 'auth/invalid-email':
            resolve('Error: Invalid email address format.');
            break;
          case 'auth/user-not-found':
            resolve('Error: No record found. You must register first.');
          case 'auth/wrong-password':
            resolve('Error: Invalid email address or password');
            break;
          default:
            resolve('Error: Please check your internet connection');
        }
        resolve(null);
      })
      .then((user) => {
        if (user) {
          //pick up additional user details
          if (global.appType === 'boss') {
            /*               getUser(user.user.uid).then((userRec) => {
                global.company = userRec.company;
              }); */
          }
          resolve(user);
        }
      });
  });
};

export const createUserRecord = (
  info,
  user,
  name,
  company,
  email,
  password,
) => {
  ////
  // 1 add user to database
  const obj = {};
  obj._id = info.user.uid;
  //this.usersFromFB.update(obj);
  const newEmail = info.user.email;

  //obj.email = info.user.email;
  const newUser = {};
  newUser.createdAt = Date.now();
  newUser.name = name;
  if (global.appType === 'boss') {
    newUser.company = company;
  }
  newUser.email = newEmail;
  newUser.uploadTotal = 0;
  newUser.status = 'registered';
  ////
  // pass the merge option to avoid overwriting the entire document
  firestore()
    .collection('users')
    .doc(obj._id)
    .set(newUser, {merge: true})

    .then(() => {
      feedback('Account created', '');
    })
    .catch((error) => {
      feedback(name, error);
    });

  /*                     // 3 add an email uid index record
            // . not allowed in node name. Convert to ,
            let commaEmail = email.replace(/\./g, ',');

            this.userEmailIndexFromFB.update(
              {
                [commaEmail]: obj._id,
              },
              function (error) {
                if (error) {
                  // console.log("userEmailIndex record for " + obj._id + " could not be saved." + error);
                } else {
                  // console.log("userEmailIndex Data saved successfully.");
                }
              },
            ); */
};

export const createFirebaseAccount = (name, company, email, password) => {
  return new Promise((resolve) => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .catch((error) => {
        switch (error.code) {
          case 'auth/email-already-in-use':
            resolve('Error: This email address is already taken');
            break;
          case 'auth/invalid-email':
            resolve('Error: Invalid e-mail address format');
            break;
          case 'auth/weak-password':
            resolve('Error: Password is too weak');
            break;
          default:
            resolve('Error: Please Check your internet connection');
        }
        resolve(false);
      })
      .then((info) => {
        if (info) {
          auth().onAuthStateChanged((user) => {
            if (user) {
              createUserRecord(info, user, name, company, email, password);
              // User is signed in.
              auth().currentUser.updateProfile({
                displayName: name,
              });
              global.displayName = name;
              resolve(true);
            } else {
              // No user is signed in.
              resolve(false);
            }
          });
        }
      });
  });
};

export const sendEmailWithPassword = (email) => {
  return new Promise((resolve) => {
    auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        console.warn('Email with new password has been sent');
        resolve(true);
      })
      .catch((error) => {
        switch (error.code) {
          case 'auth/invalid-email':
            resolve('Error: Invalid email address format');
            break;
          case 'auth/user-not-found':
            resolve('Error: User with this email does not exist');
            break;
          default:
            resolve('Error: Pleasae check your internet connection');
        }
        resolve(false);
      });
  });
};
