import React, {useEffect, useState} from 'react';
import {Dimensions, ScrollView, StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {MultLineTextField} from '../../components/FormFields';
import {useForm, Controller} from 'react-hook-form';
import {Button} from '../../components/Button';
import {updateRequirements} from '../../model';

const {width} = Dimensions.get('window');

const Requirements = (props) => {
  const {jobObj} = props.route.params;
  props = {...props, ...jobObj};

  const [job_id] = useState(jobObj.job_id);
  const [requirement, setRequirement] = useState(
    typeof jobObj.requirements?.requirement !== 'undefined'
      ? jobObj.requirements.requirement
      : '',
  );
  const [criteria, setCriteria] = useState(
    typeof jobObj.requirements?.criteria !== 'undefined'
      ? jobObj.requirements.criteria
      : '',
  );

  const {errors, control, handleSubmit, trigger} = useForm({
    mode: 'onBlur',
  });
  /*
  const triggerValidation = () => {
    trigger();
  }; */

  /*   useEffect(() => {
    if (props.startValidation) {
      triggerValidation();
      if (props.onValidationReset) props.onValidationReset();
    }
  }, [props.startValidation, props.onValidationReset]); */

  const onSubmit = (data) => {
    console.log('data ', data);
    updateRequirements({job_id, requirement, criteria});
  };

  return (
    <KeyboardAwareScrollView
      extraScrollHeight={100}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled">
      <View style={[width, styles.container]}>
        <ScrollView keyboardShouldPersistTaps={'handled'}>
          <Controller
            name="requirement"
            control={control}
            rules={{required: 'Required field'}}
            defaultValue={requirement}
            render={({value, onChange, onBlur}) => (
              <MultLineTextField
                {...props}
                placeholderTextColor="#828282"
                placeholder="Enter requirements here"
                value={requirement}
                onBlur={onBlur}
                onChangeText={(val) => {
                  onChange(val);
                  setRequirement(val);
                }}
                error={errors.requirement && errors.requirement.message}
              />
            )}
          />
          <MultLineTextField
            {...props}
            placeholderTextColor="#828282"
            placeholder="Enter criteria here"
            value={criteria}
            onChangeText={(val) => {
              setCriteria(val);
            }}
          />
        </ScrollView>
        <Button
          text="Save Details"
          accessibilityLabel="Save Details"
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  row: {
    height: 48,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
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
  },
  item: {
    padding: 10,
    fontSize: 13,
    height: 44,
  },
});

export default Requirements;
