import { Component } from 'react';
import { firebaseDB }  from "../config/FirebaseConfig";

class FBTransaction extends Component {
  constructor(props){
    super(props);
    this.props = props;
    //("Constructor global app type ", global.appType, "global UID ", global.UID);

    //this.actorsFromFB = firebaseDB.ref(`/${global.appType}s`);
    global.appType==="boss"?this.actorsFromFB = firebaseDB.ref('bosses'):this.actorsFromFB = firebaseDB.ref('users')
    this.jobsFromFB = firebaseDB.ref('/gigs');
    this.userFromFB = firebaseDB.ref('/users');
    this.emailToUidFromFB = firebaseDB.ref('/emailToUid');
  }
  
  state = {
    providers:  [],
    gigs:  [],
    bosss:  [],
    applicants:  [],
    requirements:  [],
    isAllowed: true,  
    user: global.UID,

  };


  getJobData = () => {
    
    // 1. read either boss or user nodes and get a list of their gigs
    var outArr = [];
    //this.actorsFromFB = firebaseDB.ref(`/${global.appType}s`);
    global.appType==="boss"?this.actorsFromFB = firebaseDB.ref('bosses'):this.actorsFromFB = firebaseDB.ref('users')
    this.actorsFromFB.child(global.UID).child('gigs').on("value").then( (snapshot) => {
        if (!snapshot.val()) {
          //reject(`${actor} job not found`);
         // console.log(` Oh dear, ${global.appType} job not found`);
          return;
        }
        
        let allJobArr = [];
        Object.entries(snapshot.val()).forEach(function([key, val]) {
          if(key){
            allJobArr.push(key);
          } else {
            //console.log("ProviderJobBoss: There is no data");
          }
          
        } );
        //("ProviderJobBoss: allJobArr length", allJobArr);

        if (typeof allJobArr == "object") {

          var reads = [];
          // 2. loop the gigs from job node
          allJobArr.map  (id => {
            var promise = this.jobsFromFB.child(id).once("value").then ( (childSnapshot) => { 
              if (!childSnapshot.val()) {
                  return;
              }
              outArr.push(childSnapshot.val());
              })
              reads.push(promise);
          })
          return Promise.all(reads);
        }

    }, function(error) {
      // The Promise was rejected.
      console.error("Promise error ", error);
    }).then( (values) => { 
      outArr.sort(function(a, b) {
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
      this.setState({
        gigs: outArr
      })
        //resolve(outArr);
    });
  }

  componentDidMount() {
     this.getJobData();
  }

  componentWillUnmount() {
        this.setState({
            providers: [],
            gigs: [],
            bosses: [],
            applicants: [],
            requirements: []
        });
        
        this.providersFromFB.off();
        this.jobsFromFB.off();
        this.bossesFromFB.off();
        this.applicantsFromFB.off();
        this.exercisesFromFB.off();
        this.actorsFromFB.off();
    }


  getExercisesForJob = (val) => {
    this.setState({
      requirements: []
    })
    if (this.state.gigs[val].requirements) {
      const exerciseArr = Object.values(this.state.gigs[val].requirements);
     // console.log("exerciseArr: ", exerciseArr);
      this.setState({
      requirements: exerciseArr
    })
    }
  }


  getApplicantsForJob = (val) => {
    this.setState({
      applicants: []
      })
    if (this.state.gigs[val].applicants) {
      let applicantsArr = Object.values(this.state.gigs[val].applicants);
      const sortAlphaNum = (a, b) => a.localeCompare(b, 'en', { numeric: true })
      applicantsArr.sort(this.sortAlphaNum)
      this.setState({
        applicants: applicantsArr
      })
    }
  }


    sortAlphaNum = (a, b) => {
        const reA = /[^a-zA-Z]/g;
        const reN = /[^0-9]/g;
        var aA = a.name.replace(reA, "");
        var bA = b.name.replace(reA, "");
        if (aA === bA) {
        var aN = parseInt(a.name.replace(reN, ""), 10);
        var bN = parseInt(b.name.replace(reN, ""), 10);
        return aN === bN ? 0 : aN > bN ? 1 : -1;
        } else {
        return aA > bA ? 1 : -1;
        }
    }


  getUser = (uid) => {
    return new Promise(function(resolve, reject) {
    this.userFromFB = firebaseDB.ref('/users');
    this.userFromFB.child(uid).once("value", snapshot => {
          //( "snap shot", snapshot.val())
          if (!snapshot.val()) {
            //console.log("snapshot: Oh No, user not found");
              reject("USER not found");
          } else {
            resolve(snapshot.val());
          }
        })
      });
  }

  getUIDfromEmail = (email) => {
    return new Promise(function(resolve, reject) {
      this.emailToUidFromFB = firebaseDB.ref('/emailToUid');
      this.emailToUidFromFB.child(email).once("value", snapshot => {
        //console.log( "snap shot", snapshot.val())
        if (!snapshot.val()) {
          //console.log("snapshot: Email not found");
            reject("email not found");
        } else {
          //this.setState({ idFromEmail: snapshot.val() })
          resolve(snapshot.val());
        }
      })
    });
  }

}

export default new FBTransaction();