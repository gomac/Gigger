import {initial} from 'lodash';
import React, {useContext, useMemo, useState} from 'react';

const JobContext = React.createContext();

// user loaded in a context for easy access
const JobProvider = ({children}) => {
  const jobObjInitialState = {
    name: '',
    description: '',
    status: '',
    videoRqdBool: false,
    requirement: '',
    criteria: '',
    markerLoc: '',
    address_components: '',
    payFreq: '',
    workTerms: '',
    minPayValue: '',
    maxPayValue: '',
    applicationEndDate: null,
    jobStartDate: null,
    jobEndDate: null,
    maxApplicantNum: 20,
    selectedJobTypes: '',
    selectedJobTypesArr: '',
  };

  const [newJob_id, setNewJob_id] = useState('');
  const [isNewJob, setNewJobInd] = useState(false);
  const [jobObj, setJobObj] = useState(jobObjInitialState);

  const jobValue = useMemo(() => {
    return {
      updJobObj: (name, val) => {
        // marshall parameters into the job object
        setJobObj({...jobObj, [name]: val});
      },
      loadJobObj: (obj) => {
        // marshall parameters into the job object
        setJobObj({...obj});
      },
      setNewJob_id: (id) => {
        setNewJob_id(id);
        setJobObj({...jobObj, job_id: id});
      },
      setNewJob: () => {
        setNewJobInd(true);
        setJobObj({...jobObjInitialState});
      },
      finaliseNewJob: () => {
        setNewJobInd(false);
        setNewJob_id('');
        setJobObj({...jobObjInitialState});
      },
      newJob_id,
      isNewJob,
      jobObj,
    };
  }, [newJob_id, isNewJob, jobObj]);

  return <JobContext.Provider value={jobValue}>{children}</JobContext.Provider>;
};

// this is a friendly way of providing access to the
// JobContext. It means that consumers only need to import and use
// useJob. Without it, they would need to import useContext and JobContext
// It also checks that it is being used within a JobProvider
const useJob = () => {
  const jobFromContext = useContext(JobContext);
  // has to be called under JobProvider tag
  if (jobFromContext == null) {
    throw new Error('useJob() called outside of a JobProvider?');
  }
  return jobFromContext;
};

export {JobProvider, useJob};
