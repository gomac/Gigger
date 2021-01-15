import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import moment from 'moment';
import {ListItem} from 'react-native-elements';
import {testProperties} from '../../src/Utils/TestProperties';

const B = (props) => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>;
const RED = (props) => <Text style={{color: 'red'}}>{props.children}</Text>;
const GREEN = (props) => <Text style={{color: 'green'}}>{props.children}</Text>;

const JobListView = (props) => {
  const renderItem = ({item, index}) => {
    return (
      <ListItem
        key={index}
        rightElement={() => props.renderRowButton(item)}
        onPress={() => {
          props.onPress(item);
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

  const renderHeader = () => {
    if (global.appType === 'boss' && typeof props.data !== 'undefined') {
      const label1 = props.data.length + ' Jobs:';
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
    if (!props.isLoading) {
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

  return (
    <View>
      <View
        keyboardShouldPersistTaps={'handled'}
        {...testProperties('Search-screen')}>
        <View style={styles.container}>
          {!props.data || !props.data.length > 0 ? (
            <Text style={styles.titleText}>No Jobs Found</Text>
          ) : null}
          {props.isLoading && (
            <ActivityIndicator size="large" color="#0000ff" />
          )}
          {props.data ? (
            <FlatList
              data={props.data}
              keyExtractor={(item, index) => index.toString()}
              ListHeaderComponent={renderHeader}
              renderItem={renderItem}
              ItemSeparatorComponent={renderSeparator}
              ListFooterComponent={renderFooter}
              refreshing={props.isLoading}
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
export default JobListView;
