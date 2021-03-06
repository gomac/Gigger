import React, {useState, useEffect} from 'react';
import {useJob} from '../../Utils/JobContext';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import MapInput from '../../components/MapInput';
import {useForm, Controller} from 'react-hook-form';
import {Button} from '../../components/Button';
import {updateJobLoc} from '../../model';

const radius = [
  {label: '50km', value: 0},
  {label: '100km', value: 1},
];

const JobLoc = (props) => {
  const {isNewJob, jobObj, updJobObj} = useJob();
  const [markerLoc, setMarkerLoc] = useState('');

  jobObj.location && setMarkerLoc(jobObj.location);

  const {errors, control, handleSubmit} = useForm({
    mode: 'onBlur',
  });

  const [region, setRegion] = useState({});
  const [markers, setMarkers] = useState([]);

  const onSubmit = (data) => {
    //updateJobLoc({job_id, markers, address_components});
    updateJobLoc(markers, {jobObj});
    isNewJob && props.setStepIsValid(true);
  };

  function updateState(location) {
    setRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.09,
      longitudeDelta: 0.09,
    });

    setMarkers([
      {
        coordinate: location,
      },
    ]);
  }

  function getCoordsFromName(loc) {
    updateState({
      latitude: loc.geometry.location.lat,
      longitude: loc.geometry.location.lng,
    });
    //setAddress_components([loc.address_components]);
    updJobObj('address_components', [loc.address_components]);
  }

  useEffect(() => {
    // console.log("address_components ", address_components)
    if (markers.length > 0 && jobObj.address_components?.length > 0) {
      setMarkerLoc(markers[0], jobObj.address_components);
    }
  }, [markers, jobObj.address_components]);

  return (
    <View
      style={{
        borderColor: '#1ca0ff',
        paddingLeft: 10,
        paddingRight: 10,
        marginVertical: 10,
      }}>
      <View style={{flexDirection: 'row'}}>
        <Controller
          name="markerLoc"
          control={control}
          rules={{required: 'Required field'}}
          defaultValue={markerLoc}
          render={({value, onChange, onBlur}) => (
            <MapInput
              notifyChange={(loc) => {
                onChange(loc);
                getCoordsFromName(loc);
              }}
              onBlur={onBlur}
              error={errors.markerLoc && errors.markerLoc.message}
            />
          )}
        />
      </View>
      {errors.markerLoc && (
        <Text style={styles.error}>{errors.markerLoc.message}</Text>
      )}
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
  },
  error: {
    color: 'red',
    fontWeight: '600',
    marginBottom: 7,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 88,
    height: 36,
    borderRadius: 2,
    backgroundColor: '#E8EAF6',
    elevation: 2,
    paddingHorizontal: 16,
    marginLeft: 2,
    marginTop: 4,
  },
  calloutSearchView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  calloutSearch: {
    borderColor: 'black',
    width: '100%',
    height: 40,
    borderWidth: 0.7,
    borderRadius: 10,
  },
  map: {
    justifyContent: 'space-around',
    height: Dimensions.get('window').height - 180,
    width: Dimensions.get('window').width - 20,
  },
  marker: {
    backgroundColor: '#550bbc',
    padding: 5,
    borderRadius: 5,
  },
  text: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default JobLoc;
