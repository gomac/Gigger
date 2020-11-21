import React, {useEffect, useRef, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import JobCategories from './JobCategories';
import JobBasic from './JobBasic';
import Requirements from './Requirements';
import JobTerms from './JobTerms';
import JobLoc from './JobLoc';
import {Button} from '../../components/Button';

import * as JobUpdates from '../../model';

const JobController = (props) => {
  const {job} = props.route.params;

  const [job_id] = useState(job.job_id);
  const [newJobName, setNewJobName] = useState(job.name);
  const [newJobDesc, setNewJobDesc] = useState(job.description);
  const [jobStatus, setJobStatus] = useState(job.status);
  const [videoRqdBool, setVideoRqdBool] = useState(job.videoRqdBool);
  const [requirement, setRequirement] = useState(
    typeof job.requirements?.requirement !== 'undefined'
      ? job.requirements.requirement
      : '',
  );
  const [criteria, setCriteria] = useState(
    typeof job.requirements?.criteria !== 'undefined'
      ? job.requirements.criteria
      : '',
  );
  const [markerLoc, setMarkerLoc] = useState(job.location);
  const [address_components, setAddress_components] = useState({});
  const [payFreq, setPayFreq] = useState(job.terms?.payFreq ?? '');

  const [workTerms, setWorkTerms] = useState(job.terms?.workTerms ?? '');
  const [minPayValue, setMinPayValue] = useState(job.terms?.minPayValue ?? '');
  const [maxPayValue, setMaxPayValue] = useState(job.terms?.maxPayValue ?? '');
  const [applicationEndDate, setApplicationEndDate] = useState(null);
  const [jobStartDate, setJobStartDate] = useState(null);
  const [jobEndDate, setJobEndDate] = useState(null);
  const [maxApplicantNum, setMaxApplicantNum] = useState(
    job.maxApplicantNum || 1,
  );
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [selectedJobTypesArr, setSelectedJobTypesArr] = useState([]);

  const [screenList, setScreenList] = useState({});
  const [validateChild, setValidateChild] = useState(false);
  const [validationError, setValidationError] = useState(false);

  const StartChildenValidation = () => {
    setValidateChild(true);
  };

  useEffect(() => {
    job.requirements?.criteria ? setCriteria(job.requirements.criteria) : '';

    if (typeof job.terms?.applicationEndDate !== 'undefined') {
      setApplicationEndDate(
        moment(job.terms.applicationEndDate).format('DD-MM-YYYY'),
      );
    }

    if (typeof job.terms?.jobStartDate !== 'undefined') {
      setJobStartDate(moment(job.terms.jobStartDate).format('DD-MM-YYYY'));
    }

    if (typeof job.terms?.jobEndDate !== 'undefined') {
      setJobEndDate(moment(job.terms.jobEndDate).format('DD-MM-YYYY'));
    }

    initialiseScreenList();
  }, [job.requirements?.requirement]);

  const initialiseScreenList = () => {
    let obj = {};
    components.map((ComponentObj) => {
      const TagRef = ComponentObj.ref;
      //rough way to ignore button
      if (TagRef !== 'Button') {
        obj[TagRef] = false;
      }
    });
    setScreenList({...obj});
  };

  const components = [
    {
      content: (
        <JobCategories
          selectedJobTypes={selectedJobTypes}
          setSelectedJobTypes={setSelectedJobTypes}
          setSelectedJobTypesArr={setSelectedJobTypesArr}
        />
      ),
      ref: 'JobCategories',
      title: 'Job Categories',
    },
    {
      content: (
        <JobBasic
          newJobName={newJobName}
          updateJob={setNewJobName}
          newJobDesc={newJobDesc}
          updateJobDesc={setNewJobDesc}
          videoRqdBool={videoRqdBool}
          toggleVideoRqdBool={setVideoRqdBool}
        />
      ),
      ref: 'JobBasic',
      title: 'Basic Details',
    },
    {
      content: (
        <Requirements
          requirement={requirement}
          setRequirement={setRequirement}
          criteria={criteria}
          setCriteria={setCriteria}
          startValidation={validateChild}
          onValidationReset={() => {
            setValidateChild(false);
          }}
          setValidationError={setValidationError}
        />
      ),
      ref: 'Requirements',
      title: 'Requirements',
    },
    {
      content: (
        <JobTerms
          applicationEndDate={applicationEndDate}
          setApplicationEndDate={setApplicationEndDate}
          jobStartDate={jobStartDate}
          setJobStartDate={setJobStartDate}
          jobEndDate={jobEndDate}
          setJobEndDate={setJobEndDate}
          maxApplicantNum={maxApplicantNum}
          setMaxApplicantNum={setMaxApplicantNum}
          statusPickHandler={setJobStatus}
          workTerms={workTerms}
          setWorkTerms={setWorkTerms}
          minPayValue={minPayValue}
          setMinPayValue={setMinPayValue}
          maxPayValue={maxPayValue}
          setMaxPayValue={setMaxPayValue}
          payFreq={payFreq}
          setPayFreq={setPayFreq}
        />
      ),
      ref: 'JobTerms',
      title: 'Status and Rates',
    },
    {
      content: <JobLoc setMarkerLoc={setMarkerLoc} />,
      ref: 'JobLoc',
      title: 'Location',
    },
  ];

  const setMarkerLocComponents = (loc, components) => {
    //console.log("setMarkerLoc ", address_components)

    setMarkerLoc(loc);
    setAddress_components(components);
  };

  const showScreen = (screen) => {
    let obj = {};
    let currentTrue = '';
    Object.keys(screenList).map((key) => {
      if (screenList[key]) {
        currentTrue = key;
      }
      obj[key] = false;
      if (screen !== currentTrue) {
        obj[screen] = true;
      }
    });

    setScreenList({...obj});
  };

  const updateData = (dataName) => {
    StartChildenValidation();
    if (validationError) {
      alert('validation error');
      setValidationError(false);
    }

    //TODO call validations
    /*     if (dataName === 'JobCategories') {
      JobUpdates.updateJobCategories();
    } else if (dataName === 'JobBasic') {
      JobUpdates.updateJobBasic();
    } else if (dataName === 'Requirements') {
      JobUpdates.updateRequirements({job_id, requirement, criteria});
    } else if (dataName === 'JobTerms') {
      JobUpdates.updateJobTerms();
    } else if (dataName === 'JobLoc') {
      JobUpdates.updateJobLoc();
    } */
  };

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <View>
        {components.map((ComponentObj, index) => {
          // using the terminology 'content' here because thats
          // what the wizard uses
          const TagName = ComponentObj.content;
          const TagText = ComponentObj.title;
          const TagRef = ComponentObj.ref;
          return (
            <View key={TagRef}>
              <TouchableOpacity onPress={() => showScreen(TagRef)}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginLeft: 20,
                    marginRight: 20,
                  }}>
                  <Text style={styles.title}>{TagText}</Text>
                  <Icon
                    name={screenList[TagRef] ? 'minus' : 'plus'}
                    size={25}
                    color="blue"
                  />
                </View>
              </TouchableOpacity>
              {screenList[TagRef] && (
                <View>
                  {TagName}
                  <Button
                    text="Save Details"
                    accessibilityLabel="Save Details"
                    onPress={() => updateData(TagRef)}
                  />
                </View>
              )}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Cochin',
    fontWeight: 'normal',
    fontSize: 18,
  },
});

export default JobController;
