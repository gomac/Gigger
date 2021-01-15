import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Button} from '../components/Button';
import {
  GetUserApplicationsFronJobArr,
  GetUserJobs,
  GetJobsByJob_IdArr,
  GetJobsByCriteriaLocation,
} from '../model';
import JobListView from '../components/JobListView';

const Search = (props) => {
  const [data, setData] = useState([]);
  ///const [curRadius, setCurRadius] = useState(200);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const region = props.route.params.region;
    const codeArr =
      typeof props.route.params.selectedJobTypes !== 'undefined'
        ? props.route.params.selectedJobTypes
        : [];
    const fetchData = async () => {
      // 1  find job_ids in criteria
      // 2  link the job details to the job_ids
      //      there could be some still in jobLoc but old jobs
      GetJobsByCriteriaLocation(region, codeArr).then((jobDtlsArr) => {
        GetJobsByJob_IdArr(jobDtlsArr).then((jobArr) => {
          if (Array.isArray(jobArr) && jobArr.length > 0) {
            GetUserJobs(global.UID).then((arr) => {
              if (Array.isArray(arr) && arr.length > 0) {
                GetUserApplicationsFronJobArr(arr).then((arr2) => {
                  //merge elements
                  if (arr2.length > 0) {
                    arr2.map((job) => {
                      var idx = jobArr.findIndex(
                        (obj) => obj.job_id === job.job_id,
                      );
                      if (idx !== -1) {
                        // merge if found
                        var merged = Object.assign({}, jobArr[idx], job);
                        jobArr[idx] = merged;
                      }
                    });
                  }
                });
              }
            });
            setData(jobArr);
          } else {
            jobDtlsArr.length = 0;
            setData(jobArr);
          }
        });
      });

      //setData(jobDtlsArr);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const enquire = (item) => {
    // set global job
    global.job = item.job_id;
    props.navigation.navigate('Enquiry', {
      jobObj: item,
    });
  };

  function renderRowButton(item) {
    return (
      <View>
        <Button
          text={global.appType === 'boss' ? 'Applicants' : 'Enquire'}
          onPress={() => enquire(item)}
          loading={props.isLoading}
          type="small"
        />
      </View>
    );
  }

  return (
    data && (
      <JobListView
        isLoading={isLoading}
        data={data}
        navigate={props.navigation}
        renderRowButton={renderRowButton}
        onPress={enquire}
      />
    )
  );
};

export default Search;
