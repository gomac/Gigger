import React, {useRef, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import {useJob} from '../Utils/JobContext';
import {w, h, totalSize} from '../Utils/Dimensions';
import LinearGradient from 'react-native-linear-gradient';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MapInput from '../components/MapInput';
import {refDataToMultiSLFormat} from '../Utils/helpers';
import {testProperties} from '../Utils/TestProperties';
import {GetJobsByUid, GetRefData} from '../model';

//TODO reset navigation to prevent return to login screen
const Home = (props) => {
  const {setNewJob, loadJobObj} = useJob();
  const [markerLoc, setMarkerLoc] = useState([]);
  //const [val, setValue] = useState([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState();
  const [region, setRegion] = useState({});

  const MSListRef = useRef();
  //two modes:  1 get default list. getJobsByUid for BOSS and
  //            2 custom search
  // steps:     get mode and call search component to return job array

  let loading = null;
  let error = null;
  let value = null;
  let refData = null;
  let outArr;
  if (global.appType === 'boss') {
    //[value, loading, error] = GetJobsByUid(global.UID);
  } else {
    [refData, loading, error] = GetRefData();

    if (!refData) {
      // TODO user friendly message
      //console.log('ref data not found');
    } else {
      outArr = refDataToMultiSLFormat(refData);
    }
  }

  //console.log('errors ', error);

  const getCoordsFromName = (loc) => {
    updateState({
      latitude: loc.geometry.location.lat,
      longitude: loc.geometry.location.lng,
    });
  };

  const updateState = (location) => {
    setRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.09,
      longitudeDelta: 0.09,
    });
  };

  const goToWizard = () => {
    setNewJob();
    props.navigation.navigate('AddJobWizard');
  };

  const renderLoading = () => {
    if (!region['latitude']) {
      return (
        <View style={{marginTop: 100}}>
          <ActivityIndicator color="black" animating size="large" />
        </View>
      );
    }
  };

  const setJobType = (category) => {
    setSelectedJobTypes(category);
    //navigate to the map with the selectedJobTypes. Get the
    //coordinates when loading the map because they might change location
  };

  return (
    <LinearGradient
      start={{x: 0.0, y: 0.25}}
      end={{x: 0.5, y: 1.0}}
      colors={['#5692CE', '#5E82E3']}
      style={{flex: 1}}>
      <SafeAreaView {...testProperties('List')} style={styles.bottomContainer}>
        <View style={{width: '100%'}} accessibilityLabel="home-view">
          <ScrollView keyboardShouldPersistTaps="handled">
            {global.appType !== 'boss' ? (
              <View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    marginLeft: 20,
                    marginRight: 20,
                    marginTop: 20,
                  }}>
                  <Text style={styles.h3}>Where</Text>
                  <MapInput
                    {...testProperties('Location')}
                    primeHome={true}
                    style={{marginLeft: 10}}
                    notifyChange={(loc) => getCoordsFromName(loc)}
                  />
                </View>
                <Text style={styles.h3}>What</Text>
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={styles.newContainer}>
                  <SectionedMultiSelect
                    {...testProperties('Category')}
                    items={outArr}
                    ref={MSListRef}
                    uniqueKey="id"
                    subKey="children"
                    displayKey="title"
                    autoFocus
                    modalWithTouchable
                    modalWithSafeAreaView
                    // showCancelButton
                    // headerComponent={this.SelectOrRemoveAll}
                    // hideConfirm
                    // filterItems={this.filterItems}
                    // alwaysShowSelectText
                    // customChipsRenderer={this.customChipsRenderer}
                    chipsPosition="top"
                    //searchAdornment={searchTerm => this.searchAdornment(searchTerm)}
                    // noResultsComponent={this.noResults}
                    //iconRenderer={this.icon}
                    //  cancelIconComponent={<Text style={{color:'white'}}>Cancel</Text>}
                    showDropDowns={true}
                    expandDropDowns={true}
                    animateDropDowns={true}
                    readOnlyHeadings={false}
                    selectText="Choose job categories..."
                    single={false}
                    showRemoveAll={true}
                    parentChipsRemoveChildren={true}
                    selectChildren={true}
                    hideSearch={false}
                    //  itemFontFamily={fonts.boldCondensed}
                    // this isnt ideal but there are two update props. something's gotta give
                    // using curried function to specialise
                    //onSelectedItemsChange={setSelectedJobTypes}
                    onSelectedItemsChange={setJobType}
                    //onSelectedItemObjectsChange={onSelectedItemObjectsChange}
                    selectedItems={selectedJobTypes}
                    colors={{primary: '#5c3a9e', success: '#5c3a9e'}}
                    itemNumberOfLines={3}
                    selectLabelNumberOfLines={3}
                    styles={{
                      chipText: {
                        maxWidth: Dimensions.get('screen').width - 90,
                      },
                      //itemText: {
                      //  color: props.selectedJobTypes.length ? 'black' : 'lightgrey'
                      //},
                      selectedItemText: {
                        color: 'blue',
                      },
                      //subItemText: {
                      //  color: props.selectedJobTypes.length ? 'black' : 'lightgrey'
                      //},
                      item: {
                        paddingHorizontal: 10,
                      },
                      subItem: {
                        paddingHorizontal: 10,
                      },
                      selectedItem: {
                        backgroundColor: 'rgba(0,0,0,0.1)',
                      },
                      selectedSubItem: {
                        backgroundColor: 'rgba(0,0,0,0.1)',
                      },
                      // selectedSubItemText: {
                      //   color: 'blue',
                      // },
                      scrollView: {paddingHorizontal: 0},
                    }}
                    // cancelIconComponent={<Icon size={20} name="close" style={{ color: 'white' }} />}
                  />
                </ScrollView>
                <TouchableOpacity
                  {...testProperties('Search-button')}
                  style={styles.button}
                  onPress={() => {
                    !region['latitude']
                      ? renderLoading
                      : props.navigation.navigate('Search', {
                          region: region,
                          selectedJobTypes: selectedJobTypes,
                        });
                  }}>
                  <Text style={styles.text}>Search Now</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    props.navigation.navigate('Jobs');
                  }}>
                  <Text style={styles.text}>My Enquiries</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.button}
                  activeOpacity={0.6}
                  onPress={() => {
                    props.navigation.navigate('Recordings');
                  }}>
                  <Text style={styles.text}>My Recordings</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    props.navigation.navigate('Jobs');
                  }}>
                  <Text style={styles.text}>My Jobs</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.button}
                  onPress={goToWizard}
                  {...testProperties('Add-job-button')}>
                  <Text style={styles.text}>New Job</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  h1: {
    color: '#008F68',
    fontSize: 40,
    marginLeft: 20,
  },
  h2: {
    alignSelf: 'flex-start',
    color: '#FAE042',
    fontSize: 18,
    marginTop: 8,
    marginLeft: 20,
  },
  h3: {
    alignSelf: 'flex-start',
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    marginLeft: 20,
  },
  button: {
    width: '50%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: w(2),
    backgroundColor: '#ea8214',
    borderRadius: w(10),
    marginTop: h(6),
  },
  text: {
    color: 'white',
    fontWeight: '700',
    fontSize: totalSize(2.1),
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  newContainer: {
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
  },
  multiListScrollContainer: {
    paddingTop: 1,
    paddingHorizontal: 10,
    flex: 1,
    flexDirection: 'column',
  },
});

export default Home;
