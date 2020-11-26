/**
 * this is one of the few cases where you would initialise state from  props
 * the refresh of the parent props will be handled by firestores listener
 */

import React, {useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useJob} from '../../Utils/JobContext';
import {SafeAreaView} from 'react-native-safe-area-context';
import Wizard from 'react-native-wizard';
import JobCategories from './JobCategories';
import JobBasic from './JobBasic';
import Requirements from './Requirements';
import JobTerms from './JobTerms';
import JobLoc from './JobLoc';
import {Button} from '../../components/Button';

const AddJobWizard = (props) => {
  const {isNewJob, finaliseNewJob} = useJob();
  const wizard = useRef();
  const [isLastStep, setIsLastStep] = useState(false);
  const [isFirstStep, setIsFirstStep] = useState(false);
  const [myCurrentStep, setMyCurrentStep] = useState(0);
  const [stepIsValid, setStepIsValid] = useState(false);
  const [errorMsg, setErrorMsg] = useState();

  const clearErrors = () => {
    setStepIsValid(true);
    setErrorMsg(null);
  };

  // context set new job
  const components = [
    {
      content: <JobBasic setStepIsValid={clearErrors} />,
      ref: 'JobBasic',
      title: 'Basic Details',
    },
    {
      content: <JobCategories setStepIsValid={clearErrors} />,
      ref: 'JobCategories',
      title: 'Job Categories',
    },
    {
      content: <Requirements setStepIsValid={clearErrors} />,
      ref: 'Requirements',
      title: 'Requirements',
    },
    {
      content: <JobTerms setStepIsValid={clearErrors} />,
      ref: 'JobTerms',
      title: 'Status and Rates',
    },
    {
      content: <JobLoc setStepIsValid={clearErrors} />,
      ref: 'JobLoc',
      title: 'Location',
    },
  ];

  const goToNext = () => {
    wizard.current.next();
    setStepIsValid(false);
    setErrorMsg(null);
  };

  const finalize = () => {
    finaliseNewJob();
    props.navigation.navigate('Home');
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
                  wizard.current.prev();
                }}
                text={'Back'}
              />
            )}

            <Text style={{fontSize: 18}}> Step {myCurrentStep + 1} of 6 </Text>

            {!isLastStep ? (
              <Button
                onPress={() => {
                  // you can only go forward if setStepIsValid
                  stepIsValid
                    ? goToNext()
                    : setErrorMsg('Save and correct errors first');
                }}
                text={'Next'}
              />
            ) : (
              <Button
                onPress={() => {
                  // you can only go forward if setStepIsValid
                  stepIsValid
                    ? finalize()
                    : setErrorMsg('Save and correct errors first');
                }}
                text={'Finalize'}
              />
            )}
            {/*                   <Text>
                  Screen: {components[currentStep].ref}
                </Text> */}
          </View>
          {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
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
  error: {
    color: 'red',
    fontWeight: '600',
    marginBottom: 7,
  },
  likeRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
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
