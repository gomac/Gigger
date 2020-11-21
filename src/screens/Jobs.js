import React, {useState, useEffect} from 'react';
//import {useAuthState} from 'react-firebase-hooks/auth';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MapInput from '../components/MapInput';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {ListItem} from 'react-native-elements';
import {Button} from '../components/Button';
import {StatusDisplay} from '../components/StatusDisplay';
import {testProperties} from '../Utils/TestProperties';
import {GetJobsByUid, GetJobsByCriteria} from '../model';

const B = (props) => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>;
const RED = (props) => <Text style={{color: 'red'}}>{props.children}</Text>;

const Jobs = (props) => {
  const [criteria, setCriteria] = useState([]);
  const [markerLoc, setMarkerLoc] = useState([]);

  //two modes:  1 get default list. getJobsByUid for BOSS and
  //            2 custom search
  // steps:     get mode and call search component to return job array

  let value = '';
  let loading = '';
  let error = '';
  if (global.appType === 'boss') {
    [value, loading, error] = GetJobsByUid(global.UID);
  } else {
    // if this is a logged in user
    // get the locally save previous search
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
    props.navigation.navigate('JobController', {
      jobObj: item,
    });
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
    this.updateState({
      latitude: loc.geometry.location.lat,
      longitude: loc.geometry.location.lng,
    });
  };

  return (
    <View {...testProperties('Home-screen')} style={styles.searchContainer}>
      <SafeAreaView {...testProperties('List')}>
        {global.appType !== 'boss' && (
          <ScrollView>
            <MapInput
              style={styles.input}
              notifyChange={(loc) => {
                getCoordsFromName(loc);
              }}
            />
            <Icon
              name={'search'}
              style={styles.searchIcon}
              size={22}
              color="black"
            />
          </ScrollView>
        )}
        {error && <Text>{('error: ', error)}</Text>}
        {loading && <Text>'loading...'</Text>}

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
            onPress={() => props.navigation.navigate('AddJobWizard')}
          />
        ) : null}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
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
});

export default Jobs;
