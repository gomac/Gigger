import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {useJob} from '../Utils/JobContext';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Button} from '../components/Button';
import {StatusDisplay} from '../components/StatusDisplay';
import {flattenObject} from '../Utils/helpers';
import {
  GetApplicationsByJobId,
  GetUserApplicationsFronJobArr,
  GetJobsByUid,
  GetUserJobs,
  GetJobsByJob_IdArr,
  GetJobsInLocationOnce,
} from '../model';
import JobListView from '../components/JobListView';

const Jobs = (props) => {
  const {setNewJob, loadJobObj} = useJob();
  const [applications, setApplications] = useState([]);
  const [aplnsCntsArr, setAplnsCntsArr] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [jobs, setjobs] = useState([]);

  // 3 MODES
  // 1 'bossJobs' for Boss - get jobs for boss UID
  // 2 'applicastions' - get jobs for applicant UID
  // 3 'search' - for jobs - get jobs for criteria

  let loading = null;
  let error = null;
  let value = null;
  // this fn calls the react-firebase-hooks. the only problem
  // is that is does a useEffect inside and sets up a listener
  if (global.appType === 'boss') {
    [value, loading, error] = GetJobsByUid(global.UID);
  }

  const func = (acc, appln) => {
    return {...acc, [appln.status]: (acc[appln.status] || 0) + 1};
  };

  function getByValue(arr, job_id) {
    for (var i = 0, iLen = arr.length; i < iLen; i++) {
      if (arr[i].job_id === job_id) return arr[i];
    }
  }

  useEffect(() => {
    if (global.appType === 'boss') {
      if (Array.isArray(value) && value.length) {
        //use job_id from jobs to get applications
        GetApplicationsByJobId(value).then((applnsArr) => {
          setApplications(applnsArr);

          const countsArr = Object.entries(applnsArr).map((applns) =>
            applns[1].reduce(func, {
              job_id: applns[0],
              pending: 0,
              accepted: 0,
              rejected: 0,
            }),
          );

          setAplnsCntsArr(countsArr);
        });
        setjobs(value);
      }
    } else if (global.appType === 'user') {
      let outArr = [];
      GetUserJobs(global.UID).then((arr) => {
        GetJobsByJob_IdArr(arr).then((jobDtlsArr) => {
          if (!jobDtlsArr) {
            return;
          }
          GetUserApplicationsFronJobArr(arr).then((arr2) => {
            // console.log('jobDtlsArr ', jobDtlsArr);
            // console.log('applications arr ', arr2);
            //merge elements
            let i = 0;
            arr2.map((obj) => {
              var merged = Object.assign({}, jobDtlsArr[i], obj);
              outArr.push(merged);
              i++;
            });
            setjobs(outArr);
            //console.log('outArr ', outArr);
          });
        });
      });
    }
    {
      console.log('global.appType not found');
    }
  }, [value]);

  function renderRowButton(item) {
    const statusesObj = getByValue(aplnsCntsArr, item.job_id);
    return (
      <View>
        {global.appType === 'boss' ? (
          Array.isArray(applications) &&
          typeof applications[item.job_id] !== 'undefined' && (
            <Button
              text={'Applicants'}
              accessibilityLabel="Applicants"
              onPress={(job) => {
                props.navigation.navigate('TileList', {
                  applicantEnqArr: applications[item.job_id],
                  job: item,
                  refreshRqd: this.refreshRqd,
                });
              }}
              loading={loading}
              type="small"
            />
          )
        ) : (
          <Button
            text={'Enquiries'}
            accessibilityLabel="My Enquiry"
            onPress={(job) => {
              props.navigation.navigate('Enquiry', {
                jobObj: item,
              });
            }}
            loading={loading}
            type="small"
          />
        )}
        <StatusDisplay
          pendingNum={statusesObj?.pending}
          rejectedNum={statusesObj?.rejected}
          acceptedNum={statusesObj?.accepted}
        />
      </View>
    );
  }

  const goToJobController = (item) => {
    loadJobObj(flattenObject(item));
    props.navigation.navigate('JobController');
  };

  const goToWizard = () => {
    setNewJob();
    props.navigation.navigate('AddJobWizard');
  };

  return (
    jobs && (
      <>
        <JobListView
          isLoading={isLoading}
          data={jobs}
          navigate={props.navigation}
          renderRowButton={renderRowButton}
          onPress={(item) => {
            global.appType === 'boss'
              ? goToJobController(item)
              : props.navigation.navigate('Enquiry', {
                  jobObj: item,
                });
          }}
        />

        <Icon
          style={{position: 'absolute', bottom: 0, alignSelf: 'center'}}
          reverse
          name="plus-circle"
          size={55}
          color="rgba(231,76,60,1)"
          onPress={goToWizard}
        />
      </>
    )
  );
};

export default Jobs;
