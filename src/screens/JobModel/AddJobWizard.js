/**
 * this is one of the few cases where you would initialise state from  props
 * the refresh of the parent props will be handled by firestores listener
 */

import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Wizard from 'react-native-wizard';
import JobCategories from './JobCategories';
import JobBasic from './JobBasic';
import Requirements from './Requirements';
import JobTerms from './JobTerms';
import JobLoc from './JobLoc';
import {createNewJob} from '../../model';
import {Button} from '../../components/Button';

const AddJobWizard = (props) => {
  const wizard = useRef();

  const [newJobName, setNewJobName] = useState('');
  const [newJobDesc, setNewJobDesc] = useState('');
  const [jobStatus, setJobStatus] = useState('');
  const [videoRqdBool, setVideoRqdBool] = useState(false);

  const [requirement, setRequirement] = useState('');
  const [criteria, setCriteria] = useState('');
  const [markerLoc, setMarkerLoc] = useState('');
  const [address_components, setAddress_components] = useState({});
  const [payFreq, setPayFreq] = useState('');
  const [workTerms, setWorkTerms] = useState('');
  const [minPayValue, setMinPayValue] = useState('');
  const [maxPayValue, setMaxPayValue] = useState(false);
  const [applicationEndDate, setApplicationEndDate] = useState(null);
  const [jobStartDate, setJobStartDate] = useState(null);
  const [jobEndDate, setJobEndDate] = useState(null);
  const [maxApplicantNum, setMaxApplicantNum] = useState(1);
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [selectedJobTypesArr, setSelectedJobTypesArr] = useState([]);

  const [isLastStep, setIsLastStep] = useState(false);
  const [isFirstStep, setIsFirstStep] = useState(false);
  const [myCurrentStep, setMyCurrentStep] = useState(0);
  const [stepIsValid, setStepIsValid] = useState(true);

  const [jobObj, setJobObj] = useState({});

  const addJob = () => {
    // decision time.
    // 1 call apis with parameters or object. I prefer object. Easier to change
    // 2 call multiple transactions each time the user hits Next
    // or at the end. The latter means that it can work offline and there
    // should be less latency between pages. The former is better technically.
    // 3 in the database transactions, create a special transaction that updates the job table in one hit or
    // one big specialised transcation. Prefer discrete (former) because its less maintenance.

    // marshall parameters into the job object
    setJobObj({
      ['newJobName']: newJobName,
      ['newJobDesc']: newJobDesc,
      ['jobStatus']: jobStatus,
      ['videoRqdBool']: videoRqdBool,
      ['requirement']: requirement,
      ['criteria']: criteria,
      ['markerLoc']: markerLoc,
      ['address_components']: address_components,
      ['payFreq']: payFreq,
      ['workTerms']: workTerms,
      ['minPayValue']: minPayValue,
      ['maxPayValue']: maxPayValue,
      ['applicationEndDate']: applicationEndDate,
      ['jobStartDate']: jobStartDate,
      ['jobEndDate']: jobEndDate,
      ['maxApplicantNum']: maxApplicantNum,
      ['selectedJobTypes']: selectedJobTypes,
      ['selectedJobTypesArr']: selectedJobTypesArr,
    });
    createNewJob(jobObj);
  };

  // error field update
  // TODO get rid of this
  //useEffect(() => {
  //  createNewJob(jobObj);
  // }, [jobObj]);

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
          action={'add'}
          user={global.UID}
          entity={'jobs'}
          actionType={'jobs'}
        />
      ),
      refjjkj: 'Requirements',
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
          setStepIsValid={setStepIsValid}
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
    {
      content: (
        <Button
          text={'Add Job'}
          accessibilityLabel={'Add Job'}
          onPress={() => {
            addJob();
          }}
        />
      ),
    },
  ];

  const setMarkerLocComponents = (loc, components) => {
    //console.log("setMarkerLoc ", address_components)

    setMarkerLoc(loc);
    setAddress_components(components);
    setStepIsValid(true);
  };

  return (
    <>
      <SafeAreaView>
        <View style={{alignItems: 'center', paddingTop: 5}}>
          <View style={[styles.likeRow, {zIndex: 999}]}>
            {isFirstStep ? /** dropdown.alertWithType('info',`Let"s Setup a job. Press Select to choose your Category`, msgCatScreen, {}, INTERVAL)}*/ null : (
              <Button
                onPress={() => {
                  //assume that when going back the validations are good
                  setStepIsValid(true);
                  wizard.current.prev();
                }}
                text={'Back'}
              />
            )}

            <Text style={{fontSize: 18}}> Step {myCurrentStep + 1} of 6 </Text>

            {!isLastStep && (
              <Button
                onPress={() => {
                  // you can only go forward if stepIsValid
                  // if (stepIsValid || currentStep == 2 || currentStep == 3) {
                  wizard.current.next();
                  setStepIsValid(true);
                  /*                   } else {
                    alert('You must fill all mandatory fields');
                  } */
                }}
                text={'Next'}
              />
            )}
            {/*                   <Text>
                    Screen: {components[currentStep].ref}
                  </Text> */}
          </View>
        </View>
        <Wizard
          useNativeDriver={true}
          showPrevButton={(status) => {
            //status ? console.log("SHOW") : console.log("HIDE")
          }}
          showNextButton={(status) => {
            //status ? console.log("SHOW") : console.log("HIDE")
          }}
          ref={wizard}
          isFirstStep={(val) => setIsFirstStep(val)}
          isLastStep={(val) => setIsLastStep(val)}
          currentStep={({currentStep, isLastStep, isFirstStep}) => {
            setMyCurrentStep(currentStep);
          }}
          steps={components}
        />
      </SafeAreaView>
      <View style={styles.bottomContainer}>
        {components.map((val, index) => (
          <View
            key={'step-indicator-' + index}
            style={[
              styles.progress,
              {backgroundColor: index === myCurrentStep ? '#fc0' : '#000'},
            ]}
          />
        ))}
      </View>
    </>
  );
};

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
    width: 50,
  },
  touchIconRight: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    width: 50,
  },
  title: {
    fontFamily: 'Cochin',
    fontWeight: 'normal',
    fontSize: 18,
  },
  bottomContainer: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    alignSelf: 'center',
    bottom: 20,
  },
  progress: {
    width: 10,
    marginHorizontal: 6,
    height: 10,
    borderRadius: 5,
  },
});

export default AddJobWizard;
