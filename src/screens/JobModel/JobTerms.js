'use strict';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {useJob} from '../../Utils/JobContext';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import NumericInput from 'react-native-numeric-input';
import CustomNumeric from '@wwdrew/react-native-numeric-textinput';
import DatePicker from 'react-native-datepicker';
import RNPickerSelect from 'react-native-picker-select';
import {useForm, Controller} from 'react-hook-form';
import {Button} from '../../components/Button';
import {updateJobTerms} from '../../model';
const initialJobData = {
  status: '',
  maxApplicantNum: 50,
};

// later bosses will be able to set up their own lists of allowed respondants
var workTermsList = [
  {label: 'Full Time', value: 'Full Time'},
  {label: 'Part Time', value: 'Part Time'},
  {label: 'Casual', value: 'Casual'},
  {label: 'Contract/Temp', value: 'Contract/Temp'},
];

var freqVals = [
  {label: 'one time', value: 'one time'},
  {label: 'hourly', value: 'hourly'},
  {label: 'daily', value: 'daily'},
  {label: 'weekly', value: 'weekly'},
  {label: 'p.a.', value: 'p.a.'},
];

const validStatusChanges = [
  ['', 'draft'],
  ['', 'current'],
  ['draft', 'cancelled'],
  ['draft', 'current'],
  ['current', 'cancelled'],
  ['current', 'closed'],
];

export const setMaxApplicants = () => {};

function formatDateTime(dateObj) {
  const formattedDate =
    dateObj.getFullYear() +
    '-' +
    (dateObj.getMonth() + 1) +
    '-' +
    dateObj.getDate();

  return formattedDate;
}

function getEndDate(days) {
  const today = new Date();
  let defaultApplicationEndDate = new Date();
  const extendedDate = defaultApplicationEndDate.setDate(
    today.getDate() + days,
  );
  //console.log("extendedDate ", extendedDate)
  let outDate = new Date(extendedDate);
  outDate = formatDateTime(outDate);
  return outDate;
}

///////
const JobTerms = (props, {} = {...initialJobData}) => {
  const {isNewJob, jobObj, updJobObj} = useJob();

  const {errors, control, handleSubmit} = useForm({
    mode: 'onBlur',
  });

  const refMinPay = useRef(null);
  const refMaxPay = useRef(null);
  const refStartDate = useRef(null);
  const refEndDate = useRef(null);
  const refApplicationEndDate = useRef(null);

  const onSubmit = () => {
    updateJobTerms({jobObj});
    isNewJob && props.setStepIsValid(true);
  };

  const placeholder = {
    label: 'Select from ...',
    value: '',
    color: '#343536',
  };

  const TODAY = formatDateTime(new Date());
  const MAX_APP_END_DATE = getEndDate(30);

  return (
    <View style={{marginTop: 50}}>
      <ScrollView keyboardShouldPersistTaps={'handled'}>
        <View style={{flexDirection: 'column'}}>
          <View style={{flexDirection: 'column'}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.label}>Contract Type</Text>
              <Controller
                name="workTerms"
                control={control}
                rules={{required: 'Required field'}}
                /*                 rules={{
                  validate: {
                    ValueNotPicked: (value) =>
                      value === '' ? 'You must select the Contract Type' : '',
                  },
                }} */
                defaultValue={() => (jobObj.workTerms ? jobObj.workTerms : '')}
                render={({value, onChange, onBlur}) => (
                  <RNPickerSelect
                    placeholder={placeholder}
                    items={workTermsList}
                    onValueChange={(val) => {
                      onChange(val);
                      updJobObj('workTerms', val);
                    }}
                    value={jobObj.workTerms}
                    useNativeAndroidPickerStyle={false}
                    Icon={() => {
                      return <View style={styles.RNPickerSelect} />;
                    }}
                    style={{
                      ...pickerSelectStyles,
                      iconContainer: {
                        top: 20,
                        right: 10,
                      },
                      placeholder: {
                        color: 'purple',
                        fontSize: 14,
                        fontWeight: 'bold',
                      },
                    }}
                    onBlur={onBlur}
                  />
                )}
              />
            </View>
            {errors.workTerms && (
              <Text style={styles.error}>{errors.workTerms.message}</Text>
            )}
          </View>
          <View paddingVertical={15} />

          <View style={[styles.likeRow]}>
            <Text style={styles.label}>Places</Text>
            <NumericInput
              minValue={1}
              initValue={1}
              totalHeight={40}
              separatorWidth={2}
              rightButtonBackgroundColor="#8fb1aa"
              iconStyle={{color: 'white'}}
              leftButtonBackgroundColor="#8fb1aa"
              value={jobObj.maxApplicantNum}
              onChange={(value) => updJobObj('maxApplicationNum', value)}
            />
          </View>
          <View style={{flexDirection: 'column'}}>
            <View style={{flexDirection: 'column'}}>
              <View style={styles.likeRow}>
                <Text style={styles.label}>Apply until</Text>
                <Controller
                  name="applicationEndDate"
                  control={control}
                  rules={{required: "'Apply until' is required"}}
                  defaultValue={() =>
                    jobObj.applicationEndDate
                      ? jobObj.applicationEndDate
                      : new Date()
                  }
                  render={({value, onChange, onBlur}) => (
                    <DatePicker
                      ref={refApplicationEndDate}
                      style={{width: '35%'}}
                      date={jobObj.applicationEndDate}
                      value={value}
                      placeholder="select date"
                      mode="date"
                      format="YYYY-MM-DD"
                      minDate={TODAY}
                      maxDate={MAX_APP_END_DATE}
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      androidMode="calendar"
                      customStyles={{
                        dateIcon: {
                          position: 'absolute',
                          right: 0,
                          top: 4,
                          marginLeft: 0,
                        },
                        dateInput: {
                          justifyContent: 'center',
                          alignItems: 'flex-start',
                          paddingLeft: 5,
                        },
                      }}
                      onDateChange={
                        (date) => {
                          onChange(date);
                          updJobObj('applicationEndDate', date);
                        }
                        //handleOnChange('applicationEndDate', date) &&
                      }
                      onBlur={onBlur}
                    />
                  )}
                />
              </View>
              {errors.applicationEndDate && (
                <Text style={styles.error}>
                  {errors.applicationEndDate.message}
                </Text>
              )}
            </View>
            <View style={{flexDirection: 'column'}}>
              <View style={styles.likeRow}>
                <Text style={styles.label}>Start Date</Text>
                <Controller
                  name="jobStartDate"
                  control={control}
                  rules={{required: "'Start Date' is required"}}
                  defaultValue={() =>
                    jobObj.jobStartDate ? jobObj.jobStartDate : new Date()
                  }
                  render={({value, onChange, onBlur}) => (
                    <DatePicker
                      ref={refStartDate}
                      style={{width: '35%'}}
                      date={jobObj.jobStartDate}
                      value={value}
                      placeholder="select date"
                      mode="date"
                      format="YYYY-MM-DD"
                      minDate={TODAY}
                      maxDate="2021-06-30"
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      androidMode="calendar"
                      customStyles={{
                        dateIcon: {
                          position: 'absolute',
                          right: 0,
                          top: 4,
                          marginLeft: 0,
                        },
                        dateInput: {
                          justifyContent: 'center',
                          alignItems: 'flex-start',
                          paddingLeft: 5,
                        },
                      }}
                      onDateChange={(date) => {
                        onChange(date);
                        updJobObj('jobStartDate', date);
                      }}
                      onBlur={onBlur}
                    />
                  )}
                />
              </View>
              {errors.jobStartDate && (
                <Text style={styles.error}>{errors.jobStartDate.message}</Text>
              )}
            </View>

            <View style={{flexDirection: 'column'}}>
              <View style={styles.likeRow}>
                <Text style={styles.label}>End Date</Text>
                <Controller
                  name="jobEndDate"
                  control={control}
                  defaultValue={() =>
                    jobObj.jobEndDate ? jobObj.jobEndDate : new Date()
                  }
                  rules={{
                    required: "End Date' is required",
                    validate: {
                      endDateAfterStartDate: (value) => {
                        return (
                          jobObj.jobStartDate < value ||
                          'End Date cannot be before Start Date'
                        );
                      },
                    },
                  }}
                  render={({value, onChange, onBlur}) => (
                    <DatePicker
                      ref={refEndDate}
                      style={{width: '35%'}}
                      date={jobObj.jobEndDate}
                      value={value}
                      placeholder="select date"
                      mode="date"
                      format="YYYY-MM-DD"
                      minDate={TODAY}
                      maxDate="2021-06-30"
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      androidMode="calendar"
                      customStyles={{
                        dateIcon: {
                          position: 'absolute',
                          right: 0,
                          top: 4,
                          marginLeft: 0,
                        },
                        dateInput: {
                          justifyContent: 'center',
                          alignItems: 'flex-start',
                          paddingLeft: 5,
                        },
                      }}
                      onDateChange={(date) => {
                        onChange(date);
                        updJobObj('jobEndDate', date);
                      }}
                      onBlur={onBlur}
                    />
                  )}
                />
              </View>
              {errors.jobEndDate && (
                <Text style={styles.error}>{errors.jobEndDate.message}</Text>
              )}
            </View>
          </View>

          <View paddingVertical={15} />

          <View style={styles.contentContainer}>
            <View style={{flexDirection: 'row', height: 45}}>
              <Text style={[styles.label, {width: '63%', textAlign: 'center'}]}>
                Pay Range
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.label}>Frequency</Text>
              <RNPickerSelect
                placeholder={placeholder}
                items={freqVals}
                onValueChange={(value) => {
                  updJobObj('payFreq', value);
                }}
                value={jobObj.payFreq}
                useNativeAndroidPickerStyle={false}
                Icon={() => {
                  return <View style={styles.RNPickerSelect} />;
                }}
                style={{
                  ...pickerSelectStyles,
                  iconContainer: {
                    top: 20,
                    right: 10,
                  },
                  placeholder: {
                    color: 'purple',
                    fontSize: 14,
                    fontWeight: 'bold',
                  },
                }}
              />
            </View>
            <View style={{flexDirection: 'row', height: 45}}>
              <Text style={styles.label}>Minimum</Text>
              <Controller
                name="minPayValue"
                control={control}
                defaultValue={() =>
                  jobObj.minPayValue ? jobObj.minPayValue : 0
                }
                rules={{
                  validate: {
                    requiredIfPayfreq: (value) => {
                      return (
                        (jobObj.payFreq !== '' && value) ||
                        'Required for Pay Range'
                      );
                    },
                  },
                }}
                render={({value, onChange, onBlur}) => (
                  <CustomNumeric
                    ref={refMinPay}
                    type="decimal"
                    decimalPlaces={0}
                    width={'20%'}
                    borderColor="grey"
                    color="#5d5d5d"
                    borderWidth={1}
                    value={jobObj.minPayValue}
                    onUpdate={(minValue) => {
                      onChange(minValue);
                      updJobObj('minPayValue', minValue);
                    }}
                    onBlur={onBlur}
                  />
                )}
              />
              {errors.minPayValue && (
                <Text style={styles.error}>{errors.minPayValue.message}</Text>
              )}
            </View>

            <View style={{flexDirection: 'column', height: 45}}>
              <View style={{flexDirection: 'row', height: 45}}>
                <Text style={styles.label}>Maximum</Text>
                <Controller
                  name="maxPayValue"
                  control={control}
                  defaultValue={() =>
                    jobObj.maxPayValue ? jobObj.maxPayValue : 0
                  }
                  rules={{
                    validate: {
                      minMoreThanMax: (value) => {
                        /*                         console.log(
                          'minPayValue > value ',
                          jobObj.minPayValue,
                          ' ',
                          value,
                        ); */
                        return (
                          jobObj.minPayValue <= value ||
                          'Maximum cannot be less than Minimum'
                        );
                      },
                    },
                  }}
                  render={({value, onChange, onBlur}) => (
                    <CustomNumeric
                      ref={refMaxPay}
                      type="decimal"
                      decimalPlaces={0}
                      width={'20%'}
                      borderColor="grey"
                      color="#5d5d5d"
                      borderWidth={1}
                      value={jobObj.maxPayValue}
                      onUpdate={(maxValue) => {
                        onChange(maxValue);
                        updJobObj('maxPayValue', maxValue);
                      }}
                      onBlur={onBlur}
                    />
                  )}
                />
              </View>
              {errors.maxPayValue && (
                <Text style={styles.error}>{errors.maxPayValue.message}</Text>
              )}
            </View>
          </View>
        </View>
        <View paddingVertical={15} />
        <Button
          text="Save Details"
          accessibilityLabel="Save Details"
          onPress={handleSubmit(onSubmit)}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  error: {
    color: 'red',
    fontWeight: '600',
    marginLeft: 30,
    marginBottom: 7,
  },
  label: {
    backgroundColor: '#1ca0ff',
    borderWidth: 1,
    width: '30%',
    fontSize: 16,
    paddingLeft: 10,
    justifyContent: 'center',
    textAlignVertical: 'center',
    color: 'white',
    marginLeft: 30,
  },
  likeRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  contentContainer: {
    justifyContent: 'flex-start',
  },
  row: {
    height: 48,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  item: {
    padding: 10,
    fontSize: 13,
    height: 44,
  },
  errorStyle: {
    color: 'red',
    fontSize: 15,
    marginBottom: 5,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 15,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 15,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  RNPickerSelect: {
    backgroundColor: 'transparent',
    borderTopWidth: 10,
    borderTopColor: 'gray',
    borderRightWidth: 10,
    borderRightColor: 'transparent',
    borderLeftWidth: 10,
    borderLeftColor: 'transparent',
    width: 0,
    height: 0,
  },
});

export default JobTerms;
