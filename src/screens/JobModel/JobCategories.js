import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, ScrollView, StyleSheet, Text} from 'react-native';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import {useCollectionOnce} from 'react-firebase-hooks/firestore';
import {useForm, Controller} from 'react-hook-form';
import firestore from '@react-native-firebase/firestore';
import {Button} from '../../components/Button';

const JobCategories = (props) => {
  const {jobObj} = props.route.params;

  const MSListRef = useRef();
  const [job_id] = useState(jobObj.job_id);
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [selectedJobTypesArr, setSelectedJobTypesArr] = useState([]);

  const {errors, control, handleSubmit, trigger} = useForm({
    mode: 'onBlur',
  });

  const onSubmit = (data) => {
    console.log('data ', data);
  };

  const [refData, loading, error] = useCollectionOnce(
    firestore().collection('refData'),
  );

  console.log('errors ', errors);

  const refDataToMultiSLFormat = (obj) => {
    // needs to look like this
    /*
      const outArr = [
      // this is the parent or 'item'
      {
        name: 'Building and related trades workers, excluding electricians',
        id: 0,
        // these are the children or 'sub items'
          children: [
            {
              name: 'Building finishers and related trades workers:',
              id: 10,
            },
            {
              name: 'Building frame and related trades workers',
              id: 17,
            }
          ] */
    let outArr = [];

    obj.docs.map((doc, index) => {
      //console.log("heading ", heading)
      let outItem = {};
      //substring sort key which is first two digits
      outItem.title = doc.id.substring(2);
      outItem.id = 100 * (index + 1);
      //console.log("outItem.id ", outItem.id)
      // now map children
      let childArr = [];
      const children = Object.keys(doc.data());
      children.map((child, index2) => {
        let outChild = {};
        //console.log("child ", child)
        outChild.title = child;
        outChild.id = outItem.id + (index2 + 1);
        //console.log("outChild.id ", outChild.id)
        childArr.push(outChild);
      });
      outItem.children = childArr;
      outArr.push(outItem);
    });
    return outArr;
  };

  let outArr;
  if (!refData) {
    // TODO user friendly message
    console.log('ref data not found');
  } else {
    outArr = refDataToMultiSLFormat(refData);
  }

  return (
    <ScrollView keyboardShouldPersistTaps={'handled'} style={styles.scrollView}>
      {typeof outArr !== 'undefined' && (
        <>
          <Controller
            name="JobCats"
            control={control}
            //rules={{required: 'Required field'}}
            rules={{
              validate: {
                arrayNotEmpty: (value) =>
                  value.length > 0
                    ? ''
                    : 'You must select at least one category',
              },
            }}
            defaultValue={selectedJobTypes}
            render={({value, onChange, onBlur}) => (
              <SectionedMultiSelect
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
                onSelectedItemsChange={(val) => {
                  console.log('value ', value);
                  console.log('selectedJobTypes ', selectedJobTypes);
                  onChange(val);
                  setSelectedJobTypes(val);
                }}
                onSelectedItemObjectsChange={setSelectedJobTypesArr}
                //onSelectedItemObjectsChange={onSelectedItemObjectsChange}
                selectedItems={value}
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
                onBlur={onBlur}
              />
            )}
          />
          {errors.JobCats && (
            <Text style={styles.error}>{errors.JobCats.message}</Text>
          )}
        </>
      )}
      <Button
        text="Save Details"
        accessibilityLabel="Save Details"
        onPress={handleSubmit(onSubmit)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#f3f3f3',
  },
  error: {
    color: 'red',
    fontWeight: '600',
    marginBottom: 7,
  },
  actionButtonIcon: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    backgroundColor: '#8fb1aa',
  },
  likeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  contentContainer: {
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    padding: 10,
  },
  sectionContainer: {
    paddingVertical: 56,
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
  scrollViewContainer: {
    paddingTop: 8,
  },
  row: {
    height: 48,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  titleText: {
    fontFamily: 'Cochin',
    fontWeight: 'bold',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    textAlignVertical: 'center',
  },
  baseText: {
    fontFamily: 'Cochin',
    fontWeight: 'normal',
  },
  selectBox: {
    alignSelf: 'center',
    maxHeight: 300,
    borderColor: '#1ca0ff',
    borderWidth: 1,
    paddingLeft: 10,
    paddingRight: 10,
    marginVertical: 10,
    width: '90%',
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
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#8fb1aa',
  },
  item: {
    padding: 10,
    fontSize: 13,
    height: 44,
  },
});

export default JobCategories;
