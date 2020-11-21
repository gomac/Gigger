import React, {useEffect, useState} from 'react';
import {StyleSheet, Switch, Text, View} from 'react-native';
import {TextField} from '../../components/FormFields';
import {MultLineTextField} from '../../components/FormFields';
import {useForm, Controller} from 'react-hook-form';
import {Button} from '../../components/Button';
import {updateJobBasic} from '../../model';

const JobBasic = (props) => {
  const {jobObj} = props.route.params;
  props = {...props, ...jobObj};

  const [job_id] = useState(jobObj.job_id);
  const [newJobName, setNewJobName] = useState(jobObj.name);
  const [newJobDesc, setNewJobDesc] = useState(jobObj.description);
  const [videoRqdBool, setVideoRqdBool] = useState(jobObj.videoRqdBool);

  const {errors, control, handleSubmit, trigger} = useForm({
    mode: 'onBlur',
  });

  const onSubmit = (data) => {
    console.log('data ', data);
    updateJobBasic({job_id, newJobName, newJobDesc, videoRqdBool});
  };

  return (
    <View>
      <Controller
        name="newJobName"
        control={control}
        rules={{required: 'Required field'}}
        defaultValue={newJobName}
        render={({value, onChange, onBlur}) => (
          <TextField
            value={newJobName}
            placeholder="Enter new job name here"
            name={'newJobName'}
            style={{
              alignSelf: 'center',
              textAlignVertical: 'top',
              borderColor: '#1ca0ff',
              borderWidth: 1,
              color: '#5d5d5d',
              paddingLeft: 10,
              paddingRight: 10,
              marginVertical: 10,
              width: '90%',
            }}
            onBlur={onBlur}
            onChangeText={(val) => {
              onChange(val);
              setNewJobName(val);
            }}
            error={errors.newJobName && errors.newJobName.message}
          />
        )}
      />

      <MultLineTextField
        value={newJobDesc}
        placeholder="Enter the job description"
        name={'newJobDesc'}
        onChange={setNewJobDesc}
        editable={true}
        multiline={true}
        maxLength={2000}
        numberOfLines={3}
        autoGrow={true}
      />
      <View style={[{textAlignVertical: 'top'}, styles.multilineBox]}>
        <Text>Video {videoRqdBool ? 'IS' : 'IS NOT'} required</Text>
        <Switch
          style={{marginTop: 30}}
          onValueChange={setVideoRqdBool}
          value={videoRqdBool}
        />
        <Text>
          If this is on, a short 15 second video will be required from
          applicants and will be available until the application end date.
        </Text>
      </View>
      <Button
        text="Save Details"
        accessibilityLabel="Save Details"
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
