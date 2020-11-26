import React from 'react';
import {useJob} from '../../Utils/JobContext';
import {Dimensions, ScrollView, StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {MultLineTextField} from '../../components/FormFields';
import {useForm, Controller} from 'react-hook-form';
import {Button} from '../../components/Button';
import {updateRequirements} from '../../model';

const {width} = Dimensions.get('window');

const Requirements = (props) => {
  const {isNewJob, jobObj, updJobObj} = useJob();
  const {errors, control, handleSubmit, trigger} = useForm({
    mode: 'onBlur',
  });

  const onSubmit = (data) => {
    updateRequirements({jobObj});
    isNewJob && props.setStepIsValid(true);
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
            defaultValue={jobObj.requirement}
            render={({value, onChange, onBlur}) => (
              <MultLineTextField
                {...props}
                placeholderTextColor="#828282"
                placeholder="Enter requirements here"
                value={jobObj.requirement}
                onBlur={onBlur}
                onChangeText={(val) => {
                  onChange(val);
                  updJobObj('requirement', val);
                }}
                error={errors.requirement && errors.requirement.message}
              />
            )}
          />
          <MultLineTextField
            {...props}
            placeholderTextColor="#828282"
            placeholder="Enter criteria here"
            value={jobObj.criteria}
            onChangeText={(val) => {
              updJobObj('criteria', val);
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
