import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import {useJob} from '../Utils/JobContext';
import moment from 'moment';
import {w, h, totalSize} from '../Utils/Dimensions';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome5';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import MapInput from '../components/MapInput';
import {refDataToMultiSLFormat, flattenObject} from '../Utils/helpers';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {ListItem} from 'react-native-elements';
import {Button} from '../components/Button';
import {StatusDisplay} from '../components/StatusDisplay';
import {testProperties} from '../Utils/TestProperties';
import {GetJobsByUid, GetRefData} from '../model';

const B = (props) => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>;
const RED = (props) => <Text style={{color: 'red'}}>{props.children}</Text>;

const Jobs = (props) => {
  const {setNewJob, loadJobObj} = useJob();
  const [markerLoc, setMarkerLoc] = useState([]);
  const [val, setValue] = useState([]);
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
  if (global.appType === 'boss') {
    [value, loading, error] = GetJobsByUid(global.UID);
  } else {
    [refData, loading, error] = GetRefData();
  }
  //else {
  // if this is a logged in user
  // get the locally save previous search
  //     GetJobsInLocationOnce('abc').then((arr) => {
  //console.log('retDocsArr ', arr);
  //setValue([...arr]);
  //}); */
  //}

  console.log('errors ', error);

  let outArr;
  if (!refData) {
    // TODO user friendly message
    console.log('ref data not found');
  } else {
    outArr = refDataToMultiSLFormat(refData);
  }

  console.log('value ', value);

  function renderRowButton(item) {
    return (
      <View>
        <Button
          text={global.appType === 'boss' ? 'Applicants' : 'Enquire'}
          onPress={() => console.log('row button')}
          loading={loading}
          type="small"
        />
        <StatusDisplay pendingNum="1" rejectedNum="1" acceptedNum="1" />
      </View>
    );
  }

  const goToJobController = (item) => {
    var selArr = ['selectedJobTypesArr'];
    console.log(flattenObject(item, selArr));
    loadJobObj(flattenObject(item));
    props.navigation.navigate('JobController');
  };

  const renderHeader = () => {
    if (global.appType === 'boss' && typeof value !== 'undefined') {
      const label1 = value.length + ` Jobs:`;
      const label2 =
        'press a Job to go to Requirements for the Job or press Plus to Add a Job';

      return (
        <View style={styles.header}>
          <Text style={styles.titleText}>
            {label1}
            <Text style={styles.baseText}>
              <Text style={styles.titleText}>
                <Text style={styles.baseText} />
              </Text>
            </Text>
          </Text>
          <Text>{label2}</Text>
        </View>
      );
    }
    return null;
  };

  const renderFooter = () => {
    if (!loading) {
      return null;
    } else {
      return (
        <View style={styles.footer}>
          <ActivityIndicator animating size="large" />
        </View>
      );
    }
  };

  const renderSeparator = () => {
    return <View style={styles.separator} />;
  };

  const GetSubtitle = (item) => {
    // make this a lookup later
    const CURRENCY_SYMBOL = '$';

    //days old
    let diff = 0;
    if (typeof item.terms?.jobStartDate !== 'undefined') {
      const today = new Date();
      const end = moment(today);
      const start = moment(item.terms.jobStartDate);
      diff = end.diff(start, 'days');
    }

    return (
      <View>
        <Text style={styles.baseText}>
          <B>{item.terms?.workTerms}</B>
        </Text>
        <Text style={styles.baseText}>
          <B>{item.location}</B>
        </Text>
        {item.terms?.maxPayValue > 0 && (
          <Text style={styles.baseText}>
            <B>
              {CURRENCY_SYMBOL}
              {item.terms?.minPayValue} - {CURRENCY_SYMBOL}
              {item.terms?.maxPayValue} {item.terms?.payFreq}
            </B>
          </Text>
        )}
        {/**<Text style={styles.item}><B>Start date:</B> {this.FormatUTCDateTime(Date.parse(item.statusDetails.jobStartDate))}</Text>*/}
        <Text style={styles.smallText}>{diff}d ago</Text>
        {/**<Text style={styles.item}><B>End date: </B>{this.FormatUTCDateTime(Date.parse(item.statusDetails.jobEndDate))}</Text>*/}
        {/**<Text style={styles.smallText}>Apply by: <RED>{this.FormatUTCDateTime(Date.parse(item.statusDetails.applicationEndDate))}</RED></Text>*/}
        <Text style={styles.baseText}>{item.description}</Text>
        {item.videoRqdBool && (
          <Text style={styles.baseText}>
            <RED>*An introductory video is required</RED>
          </Text>
        )}
      </View>
    );
  };

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
        {global.appType !== 'boss' ? (
          <View style={{width: '100%'}} accessibilityLabel="home-view">
            <ScrollView keyboardShouldPersistTaps="handled">
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
              </View>
            </ScrollView>
          </View>
        ) : null}
        {error && <Text>{('error: ', error)}</Text>}
        <FlatList
          data={value}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={renderHeader}
          renderItem={({item, index}) => (
            <ListItem
              key={index}
              rightElement={() => renderRowButton()}
              onPress={() => {
                goToJobController(item);
              }}>
              <ListItem.Content>
                <ListItem.Title>{`${item.name.toUpperCase()}`}</ListItem.Title>
                <ListItem.Subtitle>{GetSubtitle(item)}</ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
          )}
          ItemSeparatorComponent={renderSeparator}
          ListFooterComponent={renderFooter}
          refreshing={loading}
        />
        {global.appType === 'boss' ? (
          <Icon
            style={{position: 'absolute', bottom: 0, alignSelf: 'center'}}
            reverse
            name="plus-circle"
            size={55}
            color="rgba(231,76,60,1)"
            onPress={goToWizard}
          />
        ) : null}
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
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
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
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: '#fff',
    color: '#424242',
    marginLeft: 20,
  },
  baseText: {
    fontFamily: 'Cochin',
    fontWeight: 'normal',
    fontSize: 13,
  },
  smallText: {
    fontFamily: 'Cochin',
    fontWeight: 'normal',
    fontSize: 11,
  },
  header: {
    borderColor: '#1ca0ff',
    borderWidth: 1,
    padding: 10,
    width: '99%',
  },
  footer: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: '#CED0CE',
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#CED0CE',
    marginLeft: '0%',
  },
  newContainer: {
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
  },
});

export default Jobs;
