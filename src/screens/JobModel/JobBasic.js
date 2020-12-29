import React from 'react';
import {StyleSheet, Switch, Text, View} from 'react-native';
import {useJob} from '../../Utils/JobContext';
import {TextField} from '../../components/FormFields';
import {MultLineTextField} from '../../components/FormFields';
import {useForm, Controller} from 'react-hook-form';
import {Button} from '../../components/Button';
import {testProperties} from '../../Utils/TestProperties';
import {createNewJob, updateJobBasic} from '../../model';

const JobBasic = (props) => {
  const {isNewJob, jobObj, updJobObj, setNewJob_id} = useJob();
  const {errors, control, handleSubmit} = useForm({
    mode: 'onBlur',
  });

  const onSubmit = async (data) => {
    if (isNewJob) {
      const returned_id = await createNewJob({jobObj});
      if (returned_id) {
        setNewJob_id(returned_id);
        isNewJob && props.setStepIsValid(true);
      }
    } else {
      updateJobBasic({jobObj});
      // TODO need to add an await here
      isNewJob && props.setStepIsValid(true);
    }
  };

  return (
    <View>
      <Controller
        name="name"
        control={control}
        rules={{required: 'Required field'}}
        defaultValue={jobObj.name}
        render={({value, onChange, onBlur}) => (
          <TextField
            value={jobObj.name}
            placeholder="Enter new job name here"
            {...testProperties('Job-name')}
            name={'newJobName'}
            style={styles.singleField}
            onBlur={onBlur}
            onChangeText={(val) => {
              onChange(val);
              updJobObj('name', val);
            }}
            error={errors.name && errors.name.message}
          />
        )}
      />
      <MultLineTextField
        value={jobObj.description}
        placeholder="Enter the job description"
        {...testProperties('Job-description')}
        onChangeText={(val) => updJobObj('description', val)}
        maxLength={2000}
        numberOfLines={3}
      />
      <View style={[{textAlignVertical: 'top'}, styles.multilineBox]}>
        <Text>Video {jobObj.videoRqdBool ? 'IS' : 'IS NOT'} required</Text>
        <Switch
          style={{marginTop: 30}}
          onValueChange={(val) => updJobObj('videoRqdBool', val)}
          value={jobObj.videoRqdBool}
        />
        <Text>
          If this is on, a short 15 second video will be required from
          applicants and will be available until the application end date.
        </Text>
      </View>
      <Button
        text="Save Details"
        accessibilityLabel="Save Details"
        {...testProperties('Save-details')}
        onPress={handleSubmit(onSubmit)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    flexDirection: 'column',
  },
  singleField: {
    alignSelf: 'center',
    textAlignVertical: 'top',
    borderColor: '#1ca0ff',
    borderWidth: 1,
    color: '#5d5d5d',
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
    textAlignVertical: 'top',
  },
});

export default JobBasic;
