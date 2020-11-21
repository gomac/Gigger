import React, {Component} from 'react';
import {
  FlatList,
  ActivityIndicator,
  Alert,
  AppRegistry,
  Button,
  Image,
  Keyboard,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {SinglePickerMaterialDialog} from 'react-native-material-dialog';
import {material} from 'react-native-typography';
import {firebaseDB} from '../config/FirebaseConfig';
import uuidv4 from 'uuid/v4';
import Snackbar from 'react-native-snackbar';
import {uploadRecordingToRequirement} from './DBHelpers';
import JobTerms from '../screens/JobModel/JobTerms';
import JobLoc from './JobLoc';
import JobBasic from '../screens/JobModel/JobBasic';
import Requirements from '../screens/JobModel/Requirements';
import JobCategories from './screens/JobModel/JobCategories';
import DropdownAlert from 'react-native-dropdownalert';

import Wizard from 'react-native-wizard';

import {geoFireApp} from '../config/FirebaseConfig';
import * as JobUpdates from '../model/JobModel';

/*var workTermsVals = [
  { label: 'Full Time', value: 0 },
  { label: 'Part Time', value: 1 },
  { label: 'Casual', value: 2 },
  { label: 'Contract/Temp', value: 3 },
];*/

var freqVals = [
  {label: 'one time', value: 0},
  {label: 'hourly', value: 1},
  {label: 'daily', value: 2},
  {label: 'weekly', value: 3},
  {label: 'p.a.', value: 4},
];

class Provider extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    //console.log("props ", props)
    this.providersFromFB = firebaseDB.ref('/providers');
    global.appType === 'boss'
      ? (this.actorsFromFB = firebaseDB.ref('bosses'))
      : (this.actorsFromFB = firebaseDB.ref('users'));
    //this.actorsFromFB = firebaseDB.ref(`/${global.appType}s`);
    this.jobsFromFB = firebaseDB.ref('/jobs');
    this.userFromFB = firebaseDB.ref('/users');
    this.emailToUidFromFB = firebaseDB.ref('/emailToUid');
    this.bossesFromFB = firebaseDB.ref('/bosses');
    this.requirementsFromFB = '';

    this.maxApplicantNum = 1;
    const today = new Date();
    let defaultApplicationEndDate = new Date();
    let defaultStartDate = new Date();
    this.defaultApplicationEndDate = defaultApplicationEndDate.setDate(
      today.getDate() + 7,
    );
    this.defaultStartDate = defaultStartDate.setDate(today.getDate() + 14);
    this.defaultEndDate = defaultStartDate.setDate(today.getDate() + 21);

    this.state = {
      isLastStep: false,
      isFirstStep: false,
      currentIndex: 0,
      newJob: '',
      newJobDesc: '',

      // this is used to add the location to GeoFire
      marker: '',
      address_components: '',

      workTerms: 'casual',
      applicationEndDate: new Date(),
      jobStartDate: new Date(),
      jobEndDate: new Date(),
      jobStatus: undefined,
      providers: [],
      jobs: [],
      bosses: [],
      applicants: [],
      selectedJobTypes: [], // these is the index values
      selectedJobTypesArr: [], // these is the literal values
      requirements: [],
      firstName: '',
      lastName: '',
      stepIsValid: false,
      videoRqdBool: false,

      newProvider: '',
      newBoss: '',
      newApplicant: '',
      newRequirement: '',
      newRequirementDesc: '',
      newInstructions: '',
      linkBossEmail: '',
      linkApplicantEmail: '',

      textProviderInput: '',
      textJobrInput: '',
      textBossInput: '',
      textApplicantInput: '',
      textRequirementInput: '',
      textLinkApplicantEmailInput: '',
      textLinkBossEmailInput: '',

      jobPickerVisible: false,
      jobPickerSelectedItem: undefined,

      requirementPickerVisible: false,
      requirementPickerSelectedItem: undefined,

      user: global.UID,
      idFromEmail: '',

      loading: false,
      data: [],
      page: 1,
      seed: 1,
      error: null,
      refreshing: false,

      minPayValue: '',
      maxPayValue: '',
      payFreq: '',
    };
  }

  getJobData = () => {
    //console.log("global app type ", global.appType, "global UID ", global.UID);
    //EXPERIMENTAL VERSION
    var outArr = [];
    //this.actorsFromFB = firebaseDB.ref(`/${global.appType}s`);
    this.actorsFromFB
      .child(global.UID)
      .child('jobs')
      .once('value')
      .then(
        (snapshot) => {
          if (!snapshot.val()) {
            //reject(`${actor} job not found`);
            //console.log(` Oh dear, ${global.appType} job not found`);
            return;
          }

          let allJobArr = [];
          Object.entries(snapshot.val()).forEach(function ([key, val]) {
            if (key) {
              allJobArr.push(key);
            } else {
              //console.log("ProviderJobBoss: There is no data");
            }
          });
          //console.log("ProviderJobBoss: allJobArr length", allJobArr);

          if (typeof allJobArr == 'object') {
            var reads = [];
            //this.jobsFromFB = firebaseDB.ref('/jobs');
            allJobArr.map((id) => {
              var promise = this.jobsFromFB
                .child(id)
                .once('value')
                .then((childSnapshot) => {
                  if (!childSnapshot.val()) {
                    return;
                  }
                  outArr.push(childSnapshot.val());
                });
              reads.push(promise);
            });
            return Promise.all(reads);
          }
        },
        function (error) {
          // The Promise was rejected.
          console.error('Promise error ', error);
        },
      )
      .then((values) => {
        outArr.sort(function (a, b) {
          var nameA = a.name.toUpperCase(); // ignore upper and lowercase
          var nameB = b.name.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          // names must be equal
          return 0;
        });
        //console.log("outArr ", outArr, "length is ", outArr.length)
        if (this._isMounted) {
          this.setState(
            {
              jobs: outArr,
            },
            () => {
              // if there is only one job, select it
              if (outArr.length == 1) {
                global.job = this.state.jobs[0]._id;
                //console.log("SET GLOBAL.JOB ", global.job)
                this.setState({
                  jobPickerSelectedItem: {label: outArr[0].name, value: 0},
                });
                // load the constrained list of requirements
                this.getRequirementsForJob(0);
                // load the constrained list of applicants
                this.getApplicantsForJob(0);
              }
            },
          );
        }

        //resolve(outArr);
      });
  };

  componentDidMount() {
    this._isMounted = true;
    this.getJobData();
  }

  componentWillUnmount() {
    //console.log("PROVIDERJOBBOSS HAS UNMOUNTED")
    this._isMounted = false;
    this.setState({
      providers: [],
      jobs: [],
      bosses: [],
      applicants: [],
      requirements: [],
    });

    this.providersFromFB.off();
    this.jobsFromFB.off();
    this.bossesFromFB.off();
    this.actorsFromFB.off();
    this.emailToUidFromFB.off();
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '86%',
          backgroundColor: '#CED0CE',
          marginLeft: '14%',
        }}
      />
    );
  };

  renderFooter = () => {
    if (!this.state.loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: '#CED0CE',
        }}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  getRequirementsForJob = (val) => {
    //console.log("this.state.jobPickerSelectedItem is ", this.state.jobPickerSelectedItem)
    this.setState({
      requirementPickerSelectedItem: undefined,
      requirements: [],
    });
    if (this.state.jobs[val].requirements) {
      const requirementArr = Object.values(this.state.jobs[val].requirements);
      //console.log("requirementArr: ", requirementArr);
      this.setState({
        requirements: requirementArr,
      });
    }
  };

  sortAlphaNum = (a, b) => {
    const reA = /[^a-zA-Z]/g;
    const reN = /[^0-9]/g;
    var aA = a.name.replace(reA, '');
    var bA = b.name.replace(reA, '');
    if (aA === bA) {
      var aN = parseInt(a.name.replace(reN, ''), 10);
      var bN = parseInt(b.name.replace(reN, ''), 10);
      return aN === bN ? 0 : aN > bN ? 1 : -1;
    } else {
      return aA > bA ? 1 : -1;
    }
  };

  getApplicantsForJob = (val) => {
    this.setState({
      applicantPickerSelectedItem: undefined,
      applicants: [],
    });
    if (this.state.jobs[val].applicants) {
      let applicantsArr = Object.values(this.state.jobs[val].applicants);
      const sortAlphaNum = (a, b) => a.localeCompare(b, 'en', {numeric: true});
      applicantsArr.sort(this.sortAlphaNum);
      this.setState({
        applicants: applicantsArr,
      });
    }
  };

  addProvider = () => {
    const obj = {};
    obj._id = uuidv4();
    const provider = {};
    provider.provider_id = obj._id;
    provider.createdAt = Date.now();
    provider.name = this.state.newProvider;
    provider.status = 'current';
    // TODO this would normally be created on registration
    provider.createdBy = this.state.user;

    this.providersFromFB.child(obj._id).update(provider, function (error) {
      if (error) {
        //console.log("Data could not be saved." + error);
      } else {
        //this.setState({providers: [provider, ...this.state.providers]});
        //console.log("Data saved successfully.");
      }
    });
    this.textProviderInput.clear();
    this.newProvider = '';
    Keyboard.dismiss();
  };

  addJob = () => {
    //TODO SET MAXIMUM NUMBER OF JOBS FOR LICENSING
    // Validations
    // 1 Madatory fields
    if (!this.state.newJob) {
      Alert.alert('You must enter a Job name first.');
      return;
    }

    // 2 Must not match existing job
    //console.log("this.state.jobs ", this.state.jobs);
    //console.log("this.state.jobs.findIndex ", this.state.jobs.findIndex(x => x.name === this.state.newJob));
    if (this.state.jobs.findIndex((x) => x.name === this.state.newJob) != -1) {
      Alert.alert('That Job name already exists.');
      return;
    }

    const obj = {};
    obj._id = uuidv4();
    const job = {};
    job._id = obj._id;
    job.createdAt = Date.now();
    job.name = this.state.newJob;
    job.description = this.state.newJobDesc;
    job.videoRqdBool = this.state.videoRqdBool;
    job.createdBy = this.props.user;
    job.provider_id = this.props.user;
    job.company_id = global.company;
    // add city and region
    //job.location = this.state.address_components[0][0].long_name + ", " + this.state.address_components[0][1].long_name + ", " + this.state.address_components[0][2].long_name

    // 1 add the job
    //this.jobsFromFB = firebaseDB.ref('/jobs');
    this.jobsFromFB.child(obj._id).update(job, (error) => {
      if (error) {
        //console.log("Job could not be saved." + error);
      } else {
        //console.log("Job saved successfully.");
      }
    });

    // 2 add boss tag to job
    let node = 'bosses/' + global.UID;
    this.jobsFromFB
      .child(job._id)
      .update({[node]: 'current'}, function (error) {
        if (error) {
          //console.log("Boss tag could not be saved." + error);
        } else {
          //console.log("Job saved successfully.");
        }
      });

    // 3 add the status details
    let statusDetails = {};
    terms.jobStatus = 'current';
    terms.workTerms = this.state.workTerms;

    if (this.state.payFreq) {
      terms.payFreq = freqVals[this.state.payFreq].label;
    }
    terms.minPayValue = this.state.minPayValue;
    terms.maxPayValue = this.state.maxPayValue;
    terms.applicationEndDate = this.state.applicationEndDate;
    terms.jobStartDate = this.state.jobStartDate;
    terms.jobEndDate = this.state.jobEndDate;
    terms.maxApplicantNum = this.maxApplicantNum;
    terms.currentApplicantntNum = 0;
    let selectedJobTypesArrObj = {};
    this.state.selectedJobTypesArr.map((jobType) => {
      selectedJobTypesArrObj[jobType.id] = jobType.title;
    });
    terms.selectedJobTypesArr = selectedJobTypesArrObj;
    let stsDtlsnode = 'statusDetails/';
    this.jobsFromFB
      .child(job._id)
      .update({[stsDtlsnode]: statusDetails}, function (error) {
        if (error) {
          //console.log("statusDetails tag could not be saved." + error);
        } else {
          //console.log("statusDetails saved successfully.");
        }
      });

    // 4 add job to boss
    node = 'jobs/' + job._id;
    // we dont get the bosses at the beginning
    // so we need the ref
    //this.actorsFromFB = firebaseDB.ref('/bosses');
    //console.log("global.UID is: ", global.UID);
    this.actorsFromFB
      .child(global.UID)
      .update({[node]: 'current'}, function (error) {
        if (error) {
          Alert.alert('Job reference could not be saved.' + error);
        } else {
          Snackbar.show({
            title: 'Job added. Your job will be visible for 30 days from today',
            duration: Snackbar.LENGTH_LONG,
          });
        }
      });

    // 5 add location data to GeoFire
    //console.log("this.state.marker ", this.state.marker)
    /*geoFireApp.set(job._id, [this.state.marker.coordinate.latitude, this.state.marker.coordinate.longitude])
    .then( () => {
       // console.log("Added this.state.marker: ", this.state.marker, " to props.job._id: ", job._id);
    }, function(error) {
      //console.log("Error: " + error);
    })*/
    //gradually moving over to using the JobModal for more discrete updates
    JobUpdates.updateJobLoc(
      job._id,
      this.state.marker,
      this.state.address_components,
    );

    //this.getJobData();
    //add the requirement and instructions
    if (this.state.newRequirement) {
      this.addRequirement(job._id);
    }

    //this.textJobInput.clear()
    //this.textJobDescInput.clear()
    this.setState({newJob: ''});
    Keyboard.dismiss();
    // Navigate back
    this.props.didUpdate();
  };

  linkBossToJob = async () => {
    // 1  validations
    // 2  if test mode, select boss, otherwise
    //    look up boss to get UID
    // 3  add UID to job
    // 4  add job id to boss

    // 1  CHECK JOB IS SELECTED
    const job = {};
    if (!this.state.jobPickerSelectedItem) {
      Alert.alert('You must select a Job first');
      return;
    } else {
      job._id = this.state.jobs[this.state.jobPickerSelectedItem.value]._id;
    }

    // 2  LOOK UP UID
    const email = this.state.linkBossEmail.replace(/\./g, ',');
    let bossUID;
    await this.getUIDfromEmail(email)
      .then((message) => {
        bossUID = message;
        //console.log("promise resolve is: ", message);
      })
      .catch((message) => {
        //console.log("promise reject is: ", message);
      });

    if (!bossUID) {
      Alert.alert('You must enter a Boss email address');
      return;
    }

    // 3 ADD BOSS TO JOB
    let node = 'bosses/' + bossUID;
    this.jobsFromFB
      .child(job._id)
      .update({[node]: 'current'}, function (error) {
        if (error) {
          //console.log("Data could not be saved." + error);
        } else {
          //console.log("Job saved successfully.");
        }
      });

    // 4 ADD JOB TO BOSS
    node = 'jobs/' + job._id;
    this.bossesFromFB
      .child(bossUID)
      .update({[node]: 'current'}, function (error) {
        if (error) {
          //console.log("Data could not be saved." + error);
        } else {
          //console.log("Job saved successfully.");
        }
      });

    this.textLinkBossEmailInput.clear();
    this.linkBossEmail = '';
    Keyboard.dismiss();

    //CLEAN OUT VALUES?
  };

  addBoss = async () => {
    //TODO CHECK NOT ALREADY ADDED or just overwrite
    if (global.appType != 'test') {
      // use select box
      if (!this.state.jobPickerSelectedItem) {
        Alert.alert('You must select a Job first');
        return;
      }
    }

    const email = this.state.linkBossEmail.replace(/\./g, ',');
    try {
      var retID;
      await this.getUIDfromEmail(email)
        .then((message) => {
          retID = message;
          //console.log("promise resolve is: ", message);
        })
        .catch((message) => {
          //console.log("promise reject is: ", message);
        });
    } catch (error) {
      console.error(error);
    }

    if (!retID) {
      Alert.alert('That email was not found.');
      return;
    }
    const obj = {};
    obj._id = retID;

    const boss = {};
    boss.boss_id = obj._id;
    boss.createdAt = Date.now();
    boss.email = this.state.linkBossEmail;
    boss.uploadTotal;
    boss.status = 'current';
    boss.createdBy = this.state.user;

    this.bossesFromFB.child(obj._id).update(boss, function (error) {
      if (error) {
        //console.log("Boss could not be saved." + error);
      } else {
        //this.setState({providers: [provider, ...this.state.providers]});
        //console.log("Boss saved successfully.");
      }
    });
    this.textBossInput.clear();
    this.newBoss = '';
    Keyboard.dismiss();
  };

  findByProp = (o, prop, val, retprop) => {
    //Early return
    if (o == null) return false;
    if (o[prop] === val) {
      return retprop ? o[retprop] : o;
    }
    var result, p;
    for (p in o) {
      if (o.hasOwnProperty(p) && typeof o[p] === 'object') {
        result = this.findByProp(o[p], prop, val);
        if (result) {
          return retprop ? result[retprop] : result;
        }
      }
    }
    return retprop ? result[retprop] : result;
  };

  linkApplicantToJob = async () => {
    // 1  check job is selected
    // 2  if test mode, select applicant, otherwise
    //    look up applicant to get UID
    // 3  add UID to job
    // 4  add job id to USER who is now a APPLICANT

    // Validations
    // 1  CHECK JOB IS SELECTED
    const job = {};
    if (!this.state.jobPickerSelectedItem) {
      Alert.alert('You must select a Job first');
      return;
    }
    // 2 check applicant field is not empty
    if (!this.state.linkApplicantEmail) {
      Alert.alert('You must enter a Applicant first');
      return;
    }

    // 2  LOOK UP UID
    const email = this.state.linkApplicantEmail.replace(/\./g, ',');
    let retID;
    await this.getUIDfromEmail(email)
      .then((message) => {
        retID = message;
        //('promise resolve is: ', message);
      })
      .catch((message) => {
        //console.log("promise reject is: ", message);
      });

    if (!retID) {
      Alert.alert('That email was not found.');
      return;
    }

    // 3 cant make boss a applicant
    // if retID === global.UID
    // TODO leave this out for testing

    // 3 ADD APPLICANT TO JOB
    // check if already exists
    // look through list of applicants nodes in jobs array
    let existingApplicants = [];
    existingApplicants = this.state.jobs[this.state.jobPickerSelectedItem.value]
      .applicants;
    //console.log("existingApplicants ", existingApplicants, "picker value is ", this.state.jobPickerSelectedItem.value);
    if (typeof existingApplicants !== 'undefined') {
      //console.log("findByProp return value is ", this.findByProp(existingApplicants, "applicant_id", retID));
      if (this.findByProp(existingApplicants, 'applicant_id', retID)) {
        Alert.alert('Applicant has already applied.');
        return;
      }
    }

    // do this in two steps because I don't know how
    // to do it in one
    job._id = this.state.jobs[this.state.jobPickerSelectedItem.value]._id;

    //console.log("job._id ", job._id, "retID is ", retID);
    await this.getUser(retID)
      .then((message) => {
        //console.log("retUser promise resolve is: ", message, "retID is ", retID);

        let node = 'applicants/' + retID;
        this.jobsFromFB
          .child(job._id)
          .update({[node]: 'current'}, function (error) {
            if (error) {
              //console.log("Job applicant skeleton could not be saved." + error);
            } else {
              //console.log("Job applicant skeleton saved successfully.");
            }
          });

        this.jobsFromFB
          .child(job._id)
          .child('applicants')
          .child(retID)
          .update(
            {
              name: message.name,
              _id: retID,
              email: message.email,
            },
            function (error) {
              if (error) {
                //console.log("Job applicant details could not be saved." + error);
              } else {
                //console.log("Job applicant details saved successfully.");
              }
            },
          );
      })
      .catch((message) => {
        //console.log("retUser promise reject is: ", message);
      });

    // 4 ADD JOB TO USER
    /* We need this because when the user logs in we want a quck list
        of their jobs. We don't want to have to look through all jobs
        to see if applicant has applied */
    node = 'jobs/' + job._id;
    //this.userFromFB = firebaseDB.ref('/users');
    this.userFromFB.child(retID).update({[node]: 'current'}, function (error) {
      if (error) {
        //console.log("Data could not be saved." + error);
      } else {
        //console.log("Job saved successfully.");
      }
    });

    // would be nice if the listener did all of this
    //await this.getJobData();
    // refresh the constrained list of requirements
    //this.getApplicantsForJob(this.state.jobPickerSelectedItem.value);

    this.textLinkApplicantEmailInput.clear();
    this.newApplicant = '';
    Keyboard.dismiss();
    this.props.didUpdate();
  };

  getUser = (uid) => {
    return new Promise(function (resolve, reject) {
      this.userFromFB = firebaseDB.ref('/users');
      this.userFromFB.child(uid).once('value', (snapshot) => {
        //console.log( "snap shot", snapshot.val())
        if (!snapshot.val()) {
          //console.log("snapshot: Oh No, user not found");
          reject('USER not found');
        } else {
          resolve(snapshot.val());
        }
      });
    });
  };

  getUIDfromEmail = (email) => {
    return new Promise(function (resolve, reject) {
      //this.emailToUidFromFB = firebaseDB.ref('/emailToUid');
      this.emailToUidFromFB.child(email).once('value', (snapshot) => {
        //console.log( "snap shot", snapshot.val())
        if (!snapshot.val()) {
          //console.log("snapshot: Email not found");
          reject('email not found');
        } else {
          //this.setState({ idFromEmail: snapshot.val() })
          resolve(snapshot.val());
        }
      });
    });
  };

  validateRequirements = () => {
    // 1 check job is selected

    if (!this.state.jobPickerSelectedItem) {
      Alert.alert('You must select a Job first');
      return;
    }
    if (!this.state.newRequirement) {
      Alert.alert('You must enter an Requirement name first.');
      return;
    }

    /* field not used from 22 May 2019
    if (!this.state.newRequirementDesc) {
      Alert.alert("You must enter a Description.");
      return;
    }*/

    if (!this.state.newInstructions) {
      Alert.alert('You must enter an Instructions.');
      return;
    }

    // 2 Must not match existing requirement
    if (
      this.state.jobs.findIndex((x) => x.name === this.state.newRequirement) !=
      -1
    ) {
      Alert.alert('That Requirement name already exists.');
      return;
    }
  };

  addRequirement = async (
    job_ID = this.state.jobs[this.state.jobPickerSelectedItem.value]._id,
  ) => {
    const job = {};
    job._id = job_ID;

    const obj = {};
    obj._id = uuidv4();
    const requirement = {};
    requirement._id = obj._id;
    requirement.createdAt = Date.now();
    requirement.name = this.state.newRequirement;
    requirement.description = this.state.newRequirementDesc;
    requirement.instructions = this.state.newInstructions;
    requirement.status = 'current';

    let node = 'requirements/' + requirement._id;
    this.jobsFromFB
      .child(job._id)
      .update({[node]: 'current'}, async (error) => {
        if (error) {
          //console.log("WARNING Data could not be saved." + error);
        } else {
          //console.log("addRequirements: Job saved successfully.");
          global.requirement = requirement._id;
          // add recording
          if (typeof this.props.videoURL !== 'undefined') {
            Snackbar.show({
              title: 'Uploading recording',
              duration: Snackbar.LENGTH_LONG,
            });
            await uploadRecordingToRequirement(this.props.videoURL);
          }
          Snackbar.show({
            title: 'UPLOAD successful',
            duration: Snackbar.LENGTH_SHORT,
          });
        }
      });
    // and update the node with the object
    this.jobsFromFB
      .child(job._id)
      .child('requirements')
      .child(requirement._id)
      .update(requirement, function (error) {
        if (error) {
          //console.log("Requirement could not be saved." + error);
        } else {
          //this.setState({providers: [provider, ...this.state.providers]});
          //console.log("Requirement saved successfully.");
        }
      });

    this.getJobData();
    // refresh the constrained list of requirements
    if (this.state.jobPickerSelectedItem != undefined) {
      this.getRequirementsForJob(this.state.jobPickerSelectedItem.value);
    }

    // find the applicants
    // for each applicant
    // add a thred with UID
    ////############
    var applicantArr = [];
    this.jobsFromFB
      .child(job._id)
      .child('applicants')
      .on('value', (snapshot) => {
        //console.log( "jobs applicant snap shot", snapshot.val())
        if (!snapshot.val()) {
          return;
        }

        snapshot.forEach(function (childSnapshot) {
          if (childSnapshot.val() === 'current') {
            //console.log("applicant key", childSnapshot.key);
            applicantArr.push(childSnapshot.key);
          } else {
            //console.log("There is no data");
            return;
          }
        });
        // now add applicants for applicantArr
        // TODO
      });

    ////############

    if (typeof this.textRequirementInput != 'undefined') {
      this.textRequirementInput.clear();
      //this.textRequirementDescInput.clear()
      this.textRequirementInstructionsInput.clear();
    }

    this.newRequirement = '';
    Keyboard.dismiss();
    // Navigate back
    this.props.didUpdate();
  };

  renderHeader = () => {
    return <Text style={styles.titleText}>Select a Applicant</Text>;
  };

  setWorkTerms = (flag) => {
    this.setState({workTerms: flag});
  };

  statusPickHandler = (status) => {
    this.setState({jobStatus: status});
  };

  setMaxApplicantNum = (num) => {
    this.maxApplicantNum = num;
  };

  setJobStartDate = (date) => {
    this.setState({jobStartDate: date});
  };

  setJobEndDate = (date) => {
    this.setState({jobEndDate: date});
  };

  setApplicationEndDate = (date) => {
    this.setState({applicationEndDate: date});
  };

  setJobTypes = (selectedJobTypes) => {
    this.setState({selectedJobTypes});
  };

  setJobTypeStringArr = (selectedJobTypesArr) => {
    this.setState({selectedJobTypesArr, stepIsValid: true});
  };

  updateJob = (newJob) => {
    this.setState({newJob: newJob, stepIsValid: true});
  };

  updateJobDesc = (newJobDesc) => {
    this.setState({newJobDesc: newJobDesc});
  };

  setMarkerLoc = (loc, address_components) => {
    //console.log("setMarkerLoc ", address_components)
    //there is a timing problem. picking in the location can take
    // time to return the address_components. Going too quickly
    // to the addJob function will result in empty address_components
    return new Promise((resolve, reject) => {
      this.setState({marker: loc, address_components: address_components});
    }).then(this.setState({stepIsValid: true}));
  };

  setMinPayValue = (minValue) => {
    this.setState({minPayValue: minValue});
  };

  setMaxPayValue = (maxValue) => {
    this.setState({maxPayValue: maxValue});
  };

  setPayFreq = (freqObj) => {
    this.setState({payFreq: freqObj});
  };

  setStepIsValid = () => {
    this.setState({stepIsValid: true});
  };

  setNewInstructions = (instructions) => {
    this.setState({newInstructions: instructions});
  };

  setNewRequirement = (requirement) => {
    this.setState({newRequirement: requirement});
  };

  toggleVideoRqdBool = (bVal) => {
    this.setState({videoRqdBool: bVal});
  };

  render() {
    const avatar_url = '';

    const steps = [
      {
        component: JobCategories,
        title: 'Job Categories',
        props: {
          selectedJobTypes: this.state.selectedJobTypes,
          setJobTypes: this.setJobTypes,
          selectedJobTypesArr: this.state.selectedJobTypesArr,
          setJobTypeStringArr: this.setJobTypeStringArr,
        },
      },
      {
        //1
        component: JobBasic,
        title: 'Basic Details',
        props: {
          newJob: this.state.newJob,
          updateJob: this.updateJob,
          newJobDesc: this.state.newJobDesc,
          updateJobDesc: this.updateJobDesc,
          videoRqdBool: this.state.videoRqdBool,
          toggleVideoRqdBool: this.toggleVideoRqdBool,
        },
      },
      {
        //2
        component: Requirements,
        title: 'Requirements',
        props: {
          newRequirement: this.state.newRequirement,
          setNewRequirement: this.setNewRequirement,
          newInstructions: this.state.newInstructions,
          setNewInstructions: this.setNewInstructions,
          action: 'add',
          user: global.UID,
          entity: 'jobs',
          actionType: 'jobs',
        },
      },
      {
        //3
        component: JobTerms,
        title: 'Status and Rates',
        props: {
          applicationEndDate: this.state.applicationEndDate,
          setApplicationEndDate: this.setApplicationEndDate,
          jobStartDate: this.state.jobStartDate,
          setJobStartDate: this.setJobStartDate,
          jobEndDate: this.state.jobEndDate,
          setJobEndDate: this.setJobEndDate,
          setMaxApplicantNum: this.setMaxApplicantNum,
          statusPickHandler: this.statusPickHandler,
          workTerms: this.state.workTerms,
          setWorkTerms: this.setWorkTerms,
          minPayValue: this.state.minPayValue,
          setMinPayValue: this.setMinPayValue,
          maxPayValue: this.state.maxPayValue,
          setMaxPayValue: this.setMaxPayValue,
          payFreq: this.state.payFreq,
          setPayFreq: this.setPayFreq,
          setStepIsValid: this.setStepIsValid,
        },
      },
      {
        //4
        component: JobLoc,
        title: 'Location',
        props: {
          setMarkerLoc: this.setMarkerLoc,
        },
      },
      {
        component: Button,
        props: {
          title: 'Add Job',
          accessibilityLabel: 'Add Job',
          onPress: () => {
            this.addJob();
          },
        },
      },
    ];

    const msgCatScreen = `To begin to setup a job you need to Add a Category`;
    const INTERVAL = 5000;

    return (
      <ScrollView keyboardShouldPersistTaps="handled">
        {/* <DropdownAlert ref={ref => this.dropdown = ref} />*/}
        <View>
          {/** Now come the selections */}
          {this.props.actionType !== 'jobs' && (
            <View style={[styles.likeRow, {marginTop: 3}]}>
              <TouchableOpacity
                onPress={() => this.setState({jobPickerVisible: true})}>
                <View style={styles.button}>
                  <Text
                    style={[
                      material.button,
                      {
                        backgroundColor: '#1ca0ff',
                        borderWidth: 1,
                        marginVertical: 10,
                        color: 'white',
                      },
                    ]}>
                    Select a Job
                  </Text>
                </View>
              </TouchableOpacity>
              <Text numberOfLines={1} style={styles.titleText}>
                {typeof this.state.jobPickerSelectedItem === 'undefined'
                  ? 'No item selected.'
                  : `Selected: ${this.state.jobPickerSelectedItem.label}`}
              </Text>

              {this.state.jobs.length > 0 && (
                <SinglePickerMaterialDialog
                  title={'Select Jobs'}
                  scrolled={true}
                  label={'myLabel'}
                  items={this.state.jobs.map((row, index) => ({
                    value: index,
                    label: row.name,
                  }))}
                  visible={this.state.jobPickerVisible}
                  selectedItem={this.state.jobPickerSelectedItem}
                  onCancel={() => this.setState({jobPickerVisible: false})}
                  onOk={(result) => {
                    this.setState({jobPickerVisible: false});
                    // clear the selection
                    global.job = this.state.jobs[result.selectedItem.value]._id;
                    this.setState({
                      jobPickerSelectedItem: result.selectedItem,
                    });
                    // load the constrained list of requirements
                    this.getRequirementsForJob(result.selectedItem.value);
                    // load the constrained list of applicants
                    this.getApplicantsForJob(result.selectedItem.value);
                  }}
                />
              )}
            </View>
          )}

          {this.props.actionType !== 'jobs' &&
            this.props.actionType !== 'requirements' &&
            this.props.actionType !== 'linkApplicant' && (
              <View>
                <TouchableOpacity
                  onPress={() =>
                    this.setState({requirementPickerVisible: true})
                  }>
                  <View style={styles.button}>
                    <Text
                      style={[
                        material.button,
                        {
                          backgroundColor: '#1ca0ff',
                          borderWidth: 1,
                          marginVertical: 10,
                          paddingLeft: 10,
                          paddingRight: 10,
                          color: 'white',
                        },
                      ]}>
                      Select an Requirement
                    </Text>
                  </View>
                </TouchableOpacity>
                <Text
                  style={material.title}
                  numberOfLines={1}
                  style={material.caption}>
                  {typeof this.state.requirementPickerSelectedItem ===
                  'undefined'
                    ? 'No item selected.'
                    : `Selected: ${this.state.requirementPickerSelectedItem.label}`}
                </Text>
                {this.state.requirements.length > 0 &&
                  typeof this.state.jobPickerSelectedItem !== 'undefined' && (
                    <SinglePickerMaterialDialog
                      title={'Select Requirement'}
                      scrolled={true}
                      label={'myLabel'}
                      items={this.state.requirements.map((row, index) => ({
                        value: index,
                        label: row.name,
                      }))}
                      visible={this.state.requirementPickerVisible}
                      selectedItem={this.state.requirementPickerSelectedItem}
                      onCancel={() =>
                        this.setState({requirementPickerVisible: false})
                      }
                      onOk={(result) => {
                        this.setState({requirementPickerVisible: false});
                        global.requirement = this.state.requirements[
                          result.selectedItem.value
                        ]._id;
                        this.setState({
                          requirementPickerSelectedItem: result.selectedItem,
                        });
                      }}
                    />
                  )}
              </View>
            )}

          {this.props.actionType === 'jobs' && global.appType === 'boss' ? (
            <View>
              {/** Add an JOB
              1 What type of job is it
              2 what its called and description
              3 status details

              */}

              <SafeAreaView>
                <View style={{alignItems: 'center', paddingTop: 5}}>
                  <View style={[styles.likeRow, {zIndex: 999}]}>
                    <View style={styles.touchIconLeft}>
                      {this.state
                        .isFirstStep ? /** this.dropdown.alertWithType('info',`Let"s Setup a job. Press Select to choose your Category`, msgCatScreen, {}, INTERVAL)}*/ null : (
                        <Button
                          onPress={() => {
                            //assume that when going back the validations are good
                            this.setState({stepIsValid: true});
                            this.wizard.prev();
                          }}
                          title={'Back'}
                        />
                      )}
                    </View>
                    <Text style={{fontSize: 18}}>
                      {' '}
                      Step {this.state.currentIndex + 1} of 6{' '}
                    </Text>
                    <View style={styles.touchIconRight}>
                      {!this.state.isLastStep && (
                        <Button
                          onPress={() => {
                            // you can only go forward if stepIsValid
                            if (
                              this.state.stepIsValid ||
                              this.state.currentIndex == 2 ||
                              this.state.currentIndex == 3
                            ) {
                              this.wizard.next();
                              this.setState({stepIsValid: false});
                            } else {
                              alert('You must fill all mandatory fields');
                            }
                          }}
                          title={'Next'}
                        />
                      )}
                    </View>
                  </View>
                </View>
                <Wizard
                  showPrevButton={(status) => {
                    //status ? console.log("SHOW") : console.log("HIDE")
                  }}
                  showNextButton={(status) => {
                    //status ? console.log("SHOW") : console.log("HIDE")
                  }}
                  ref={(e) => (this.wizard = e)}
                  currentStep={(currentIndex, isFirstStep, isLastStep) => {
                    //console.log("currentStep Called currentIndex, isFirstStep, isLastStep", currentIndex, isFirstStep, isLastStep)
                    this.setState({
                      isLastStep: isLastStep,
                      isFirstStep: isFirstStep,
                      currentIndex: currentIndex,
                    });
                  }}
                  //onNext={() => {console.log("next() Called")}}
                  //onPrev={() => { console.log("prev() Called")}}
                  //onFinish={() => {console.log("finish Called")}}
                  steps={steps}
                />
              </SafeAreaView>
            </View>
          ) : null}

          {/** Add an requirement */}
          {this.props.actionType === 'requirements' && (
            <View>
              <TextInput
                ref={(input) => {
                  this.textRequirementInput = input;
                }}
                value={this.state.newRequirement}
                onChangeText={(newRequirement) =>
                  this.setState({newRequirement})
                }
                placeholder="Enter requirement name and description  here"
                clearButtonMode="always"
                style={{
                  alignSelf: 'center',
                  textAlignVertical: 'top',
                  borderColor: '#1ca0ff',
                  borderWidth: 1,
                  paddingLeft: 10,
                  paddingRight: 10,
                  marginVertical: 10,
                  width: '90%',
                }}
              />
              <TextInput
                ref={(input) => {
                  this.textRequirementInstructionsInput = input;
                }}
                value={this.state.newInstructions}
                onChangeText={(newInstructions) =>
                  this.setState({newInstructions})
                }
                placeholder="Enter the instructions"
                editable={true}
                multiline={true}
                maxLength={2000}
                numberOfLines={7}
                clearButtonMode="always"
                style={[{textAlignVertical: 'top'}, styles.multilineBox]}
                autoGrow={true}
              />
              <Button
                title="Add job Requirement"
                accessibilityLabel="Add job Requirement"
                onPress={() => {
                  validateRequirements();
                  this.addRequirement();
                }}
              />
            </View>
          )}

          {/** link a applicant */}
          {this.props.actionType === 'linkApplicant' && (
            <View>
              <Button
                title="Add applicant to job"
                accessibilityLabel="Add applicant to job"
                onPress={() => {
                  this.linkApplicantToJob();
                }}
                style={{
                  alignSelf: 'center',
                  textAlignVertical: 'top',
                  borderWidth: 1,
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingTop: 10,
                  marginVertical: 10,
                  width: '90%',
                }}
              />
              <TextInput
                ref={(input) => {
                  this.textLinkApplicantEmailInput = input;
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={this.state.linkApplicantEmail}
                onChangeText={(linkApplicantEmail) =>
                  this.setState({linkApplicantEmail})
                }
                placeholder="Enter the Applicant email address here"
                clearButtonMode="always"
                style={{
                  alignSelf: 'center',
                  textAlignVertical: 'top',
                  borderColor: '#1ca0ff',
                  borderWidth: 1,
                  paddingLeft: 10,
                  paddingRight: 10,
                  marginVertical: 10,
                  width: '90%',
                }}
              />
            </View>
          )}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  likeRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  touchIconLeft: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  touchIconRight: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  contentContainer: {
    marginTop: 56,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    padding: 20,
  },
  sectionContainer: {
    paddingVertical: 56,
  },
  navigationBar: {
    paddingTop: 10,
    height: 52,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: '#3F51B5',
    ...Platform.select({
      android: {
        elevation: 4,
      },
      ios: {
        zIndex: 10,
      },
    }),
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 88,
    height: 36,
    borderRadius: 2,
    backgroundColor: '#E8EAF6',
    elevation: 2,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  scrollViewContainer: {
    paddingTop: 8,
  },
  row: {
    height: 48,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  titleText: {
    fontFamily: 'Cochin',
    fontWeight: 'bold',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    textAlignVertical: 'center',
  },
  baseText: {
    fontFamily: 'Cochin',
    fontWeight: 'normal',
  },
  selectBox: {
    alignSelf: 'center',
    maxHeight: 300,
    borderColor: '#1ca0ff',
    borderWidth: 1,
    paddingLeft: 10,
    paddingRight: 10,
    marginVertical: 10,
    width: '90%',
  },
  multilineBox: {
    alignSelf: 'center',
    maxHeight: 300,
    borderColor: '#1ca0ff',
    borderWidth: 1,
    paddingLeft: 10,
    paddingRight: 10,
    marginVertical: 10,
    width: '90%',
  },
});

export default Provider;
