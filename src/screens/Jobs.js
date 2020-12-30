import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useJob} from '../Utils/JobContext';
import moment from 'moment';
import {w, h, totalSize} from '../Utils/Dimensions';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {ListItem} from 'react-native-elements';
import {Button} from '../components/Button';
import {StatusDisplay} from '../components/StatusDisplay';
import {testProperties} from '../Utils/TestProperties';
import {flattenObject} from '../Utils/fp_helpers';
import {
  GetApplicationsByJobId,
  GetApplicationsByUid,
  GetJobsByUid,
  GetJobsInLocationOnce,
} from '../model';

const B = (props) => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>;
const RED = (props) => <Text style={{color: 'red'}}>{props.children}</Text>;

const Jobs = (props) => {
  const {setNewJob, loadJobObj} = useJob();
  const [applications, setApplications] = useState([]);
  const [aplnsCntsArr, setAplnsCntsArr] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [jobs, setjobs] = useState([]);

  const mode = props.route?.params?.mode;

  // 3 MODES
  // 1 'bossJobs' for Boss - get jobs for boss UID
  // 2 'applicastions' - get jobs for applicant UID
  // 3 'search' - for jobs - get jobs for criteria

  let loading = null;
  let error = null;
  let value = null;
  // this fn calls the react-firebase-hooks. the only problem
  // is that is does a useEffect inside and sets up a listener
  if (mode === 'bossJobs') {
    [value, loading, error] = GetJobsByUid(global.UID);
  }

  const func = (acc, appln) => {
    return {...acc, [appln.status]: (acc[appln.status] || 0) + 1};
  };

  function getByValue(arr, job_id) {
    for (var i = 0, iLen = arr.length; i < iLen; i++) {
      if (arr[i].job_id === job_id) return arr[i];
    }
  }

  useEffect(() => {
    if (mode === 'bossJobs') {
      if (value) {
        //use job_id from jobs to get applications
        GetApplicationsByJobId(value).then((applnsArr) => {
          setApplications(applnsArr);

          const countsArr = Object.entries(applnsArr).map((applns) =>
            applns[1].reduce(func, {
              job_id: applns[0],
              pending: 0,
              accepted: 0,
              rejected: 0,
            }),
          );

          setAplnsCntsArr(countsArr);
        });
        setjobs(value);
      }
    } else if (mode === 'applications') {
      GetApplicationsByUid(global.UID).then((arr) => {
        setApplications(arr);
      });
    } else if (mode === 'search') {
      setIsLoading(true);
      const region = props.route.params.region;
      const loc =
        typeof props.route.params.selectedJobTypes !== 'undefined'
          ? props.route.params.selectedJobTypes
          : [];
      const fetchData = async () => {
        const arr = await GetJobsInLocationOnce(region, loc);

        setjobs(arr);
        setIsLoading(false);
      };

      fetchData();
    } else {
      console.log('mode not found');
    }
  }, [jobs, value, mode, props.route?.param]);

  function renderRowButton(item) {
    const statusesObj = getByValue(aplnsCntsArr, item.job_id);
    return (
      <View>
        <Button
          text={'Applicants'}
          onPress={() => console.log('row button')}
          loading={loading}
          type="small"
        />
        <StatusDisplay
          pendingNum={statusesObj?.pending}
          rejectedNum={statusesObj?.rejected}
          acceptedNum={statusesObj?.accepted}
        />
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
    if (typeof jobs !== 'undefined') {
      const label1 = jobs?.length + ' Jobs:';
      const label2 =
        'press a Job to go to Requirements for the Job or press Plus to Add a Job';

      return (
        <View style={styles.header}>
          <Text style={styles.headingText}>
            {label1}
            <Text style={styles.baseText}>
              <Text style={styles.headingText}>
                <Text style={styles.baseText} />
              </Text>
            </Text>
          </Text>
          <Text style={styles.headingText}>{label2}</Text>
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

  const goToWizard = () => {
    setNewJob();
    props.navigation.navigate('AddJobWizard');
  };

  return (
    <LinearGradient
      start={{x: 0.0, y: 0.25}}
      end={{x: 0.5, y: 1.0}}
      colors={['#5692CE', '#5E82E3']}
      style={{flex: 1}}>
      <SafeAreaView {...testProperties('List')} style={styles.bottomContainer}>
        {error && <Text>{('error: ', error)}</Text>}
        <FlatList
          data={jobs}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={renderHeader}
          renderItem={({item, index}) => (
            <ListItem
              key={index}
              rightElement={() => renderRowButton(item, index)}
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

        <Icon
          style={{position: 'absolute', bottom: 0, alignSelf: 'center'}}
          reverse
          name="plus-circle"
          size={55}
          color="rgba(231,76,60,1)"
          onPress={goToWizard}
        />
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
  headingText: {
    fontFamily: 'Cochin',
    fontWeight: 'normal',
    color: 'white',
  },
  newContainer: {
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
  },
});

export default Jobs;
