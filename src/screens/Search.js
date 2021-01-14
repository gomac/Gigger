import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Button} from '../components/Button';
import moment from 'moment';
import {ListItem} from 'react-native-elements';
import {testProperties} from '../../src/Utils/TestProperties';
import {GetJobsInLocationOnce} from '../model';
import {StatusDisplay} from '../components/StatusDisplay';
import {
  GetUserApplicationsFronJobArr,
  GetUserJobs,
  GetJobsByJob_IdArr,
  GetJobsByCriteriaLocation,
} from '../model';
import {merge} from 'lodash';

const B = (props) => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>;
const RED = (props) => <Text style={{color: 'red'}}>{props.children}</Text>;
const GREEN = (props) => <Text style={{color: 'green'}}>{props.children}</Text>;

const Search = (props) => {
  const [data, setData] = useState([]);
  ///const [curRadius, setCurRadius] = useState(200);
  const [isLoading, setIsLoading] = useState(false);
  //const [dataFound, setDataFound] = useState(false);

  let searchTerm = '';
  let searchAttribute = '';
  let searchByTitle = '';
  let ignoreCase = '';

  useEffect(() => {
    setIsLoading(true);
    const region = props.route.params.region;
    const codeArr =
      typeof props.route.params.selectedJobTypes !== 'undefined'
        ? props.route.params.selectedJobTypes
        : [];
    const fetchData = async () => {
      // 1  find job_ids in criteria
      // 2  link the job details to the job_ids
      //      there could be some still in jobLoc but old jobs
      GetJobsByCriteriaLocation(region, codeArr).then((jobDtlsArr) => {
        GetJobsByJob_IdArr(jobDtlsArr).then((jobArr) => {
          if (Array.isArray(jobArr) && jobArr.length > 0) {
            GetUserJobs(global.UID).then((arr) => {
              if (Array.isArray(arr) && arr.length > 0) {
                GetUserApplicationsFronJobArr(arr).then((arr2) => {
                  //merge elements
                  if (arr2.length > 0) {
                    arr2.map((job) => {
                      var idx = jobArr.findIndex(
                        (obj) => obj.job_id === job.job_id,
                      );
                      if (idx !== -1) {
                        // merge if found
                        var merged = Object.assign({}, jobArr[idx], job);
                        jobArr[idx] = merged;
                      }
                    });
                  }
                });
              }
            });
            setData(jobArr);
          } else {
            jobDtlsArr.length = 0;
            setData(jobArr);
          }
        });
      });

      //setData(jobDtlsArr);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const renderItem = ({item, index}) => {
    return (
      <ListItem
        key={index}
        rightElement={() => renderRowButton(item)}
        onPress={() => {
          enquire(item);
        }}>
        <ListItem.Content>
          <ListItem.Title>
            <View>
              <B style={styles.item}>{`${item.name.toUpperCase()}`}</B>
            </View>
          </ListItem.Title>
          <ListItem.Subtitle>{GetSubtitle(item)}</ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    );
  };

  function renderRowButton(item) {
    return (
      <View>
        <Button
          text={global.appType === 'boss' ? 'Applicants' : 'Enquire'}
          onPress={() => enquire(item)}
          loading={isLoading}
          type="small"
        />
      </View>
    );
  }

  const renderHeader = () => {
    if (global.appType === 'boss' && typeof data !== 'undefined') {
      const label1 = data.length + ' Jobs:';
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
          <Text style={styles.headingText}>{label2}</Text>
        </View>
      );
    }
    return null;
  };

  const renderFooter = () => {
    if (!isLoading) {
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
    let startDate = '';
    let endDate = '';
    let enrollmentEndDate = '';
    if (typeof item.terms?.jobStartDate !== 'undefined') {
      const today = new Date();
      const end = moment(today);
      startDate = moment(item.terms?.jobStartDate).format('DD/mM/YYYY');
      endDate = moment(item.terms?.applicationEndDate).format('DD/mM/YYYY');
      enrollmentEndDate = moment(item.terms?.applicationEndDate).format(
        'DD/mM/YYYY',
      );
      diff = -1 * end.diff(item.terms?.jobStartDate, 'days');
    }

    return (
      <View>
        {item.terms?.workTerms ? (
          <Text style={styles.baseText}>
            {item.terms?.workTerms ? <B>{item.terms?.workTerms} - </B> : null}
            {/*         <Text style={styles.baseText}>
          <B>{item.location}</B>
        </Text> */}
            {item.terms?.maxPayValue > 0 ? (
              <B>
                {CURRENCY_SYMBOL}
                {item.terms?.minPayValue} - {CURRENCY_SYMBOL}
                {item.terms?.maxPayValue} {item.terms?.payFreq}
              </B>
            ) : null}
          </Text>
        ) : null}
        {/*         <Text style={styles.item}>
          <B>Start date: </B>
          {item.terms?.jobStartDate ? startDate : <B>TBA</B>}
        </Text> */}
        <Text style={styles.smallText}>{diff}d ago</Text>
        <Text style={styles.item}>
          <B>End date: </B>
          {item.terms?.jobEndDate ? endDate : <B>TBA</B>}
        </Text>
        <Text style={styles.smallText}>
          Apply by:
          {item.terms?.enrollmentEndDate ? enrollmentEndDate : <B>TBA</B>}
        </Text>
        {item.description ? (
          <Text style={styles.baseText}>{item.description}</Text>
        ) : null}
        {item.videoRqdBool && (
          <Text style={styles.baseText}>
            <RED>*An introductory video is required</RED>
          </Text>
        )}
      </View>
    );
  };

  const enquire = (item) => {
    // set global job
    global.job = item.job_id;
    props.navigation.navigate('Enquiry', {
      jobObj: item,
    });
  };

  return (
    <View>
      <View
        keyboardShouldPersistTaps={'handled'}
        {...testProperties('Search-screen')}>
        <View style={styles.container}>
          {!data || !data.length > 0 ? (
            <Text style={styles.titleText}>No Jobs Found</Text>
          ) : null}
          {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
          {data ? (
            <FlatList
              data={data}
              keyExtractor={(item, index) => index.toString()}
              ListHeaderComponent={renderHeader}
              renderItem={renderItem}
              ItemSeparatorComponent={renderSeparator}
              ListFooterComponent={renderFooter}
              refreshing={isLoading}
            />
          ) : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4c69a5',
  },
  enquireButtonIcon: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    backgroundColor: '#8cd3ce',
  },
  alreadyEnquiredButtonIcon: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    backgroundColor: '#8cd3ce',
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
    marginTop: 16,
  },
  titleText: {
    fontFamily: 'Cochin',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    textAlignVertical: 'center',
  },
  baseText: {
    fontFamily: 'Cochin',
    fontWeight: 'normal',
  },
  headingText: {
    fontFamily: 'Cochin',
    fontWeight: 'normal',
    color: 'white',
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#4c69a5',
  },
  item: {
    padding: 0,
    fontSize: 13,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#CED0CE',
    marginLeft: '0%',
  },
});
export default Search;
