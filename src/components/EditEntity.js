import React, { Component } from 'react';
import {
    Button,
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    View,
    TextInput,
    Platform,
} from 'react-native';
import { firebaseDB }  from "../config/FirebaseConfig";
import Snackbar from 'react-native-snackbar';

class EditEntity extends Component {
  constructor(props){
    super(props);
    this.props = props;
   // console.log("props ", props)
  }
  
  // antipattern ahead
  state = {
    updatedEntityName: this.props.entity.name, 
    updatedEntityDesc: this.props.entity.description,
    updatedEntityInstructions: this.props.entity.instructions,
    updatesAllowed: false
  }


  componentDidMount () {
    let editable = ""
    global.appType==="boss"?editable=true:editable=false
    this.setState({ updatesAllowed: editable})
  }

  updateRequirements = () => {
    const obj = {};
    const entity = {};
    //entity._id  = this.props.entity._id
    // TODO change the database to have an updatedAt datetime
    //entity.updatedAt = Date.now();
    // TODO change the database to have an updatedBy
    //entity.updatedBy =  this.props.user;

    // update the entity
    this.jobsExercisesFromFB = firebaseDB.ref(`/jobs`);
    this.jobsExercisesFromFB.child(global.job).child('requirements').child(this.props.entity._id).update(
      {
        name: this.state.updatedEntityName,
        description: this.state.updatedEntityDesc,
        instructions: this.state.updatedEntityInstructions,
        status: "current"
      }
      ,function(error) {
      if (error) {
        //console.log("Job could not be saved." + error);
      } else {
        Snackbar.show({
          title: 'Update successful',
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    });
    Keyboard.dismiss();
    //this.props.didUpdate()   
  }

 

  render() {
    //console.log("EditEntity global.appType is " + global.appType);
    return (
        <View>
        {/** <Text style={styles.titleText}>Name</Text>*/}
          <TextInput
          editable={this.state.updatesAllowed}
          value={this.state.updatedEntityName}
          onChangeText={(updatedEntityName) => this.setState({updatedEntityName})}
          placeholder={`Enter name`}
          clearButtonMode="always"
          style={{
            alignSelf: "center",
            textAlignVertical: "top",
            borderColor: "#1ca0ff", 
            borderWidth: 1, 
            paddingLeft: 10,
            paddingRight: 10,
            marginVertical: 10,
            width: "90%"}}
          />
          {/**<Text style={styles.titleText}>DESCRIPTION</Text>
          <TextInput
          editable={this.state.updatesAllowed}
          value={this.state.updatedEntityDesc}
          onChangeText={(updatedEntityDesc) => this.setState({updatedEntityDesc})}
          placeholder={`Enter description`}
          multiline = {true}            
          maxLength = {2000}   
          numberOfLines={3}             
          clearButtonMode="always"
          style={ [{  textAlignVertical: "top"}, styles.multilineBox]}
          autoGrow={true}                
          />

          <Text style={styles.titleText}>INSTRUCTIONS</Text>*/}
          {!this.state.updatesAllowed?
          <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 8 }}>
            <Text style={styles.baseText}>{this.state.updatedEntityInstructions}</Text>
          </ScrollView>
          :
          <TextInput
            editable={true}
            value={this.state.updatedEntityInstructions}
            onChangeText={(updatedEntityInstructions) => this.setState({updatedEntityInstructions})}
            placeholder={`Enter skills and experience of applicant`}
            multiline = {true}            
            maxLength = {2000}   
            numberOfLines={7}             
            clearButtonMode="always"
            style={ [{  textAlignVertical: "top", marginBottom: 5}, styles.multilineBox]}
            autoGrow={true}                
            />}
          {global.appType==="boss"?
            <Button
              title={`Save changes to ${this.state.updatedEntityName}`}
              accessibilityLabel={`Update ${this.state.updatedEntityName}`}
              style={{
                alignSelf: "center",
                borderWidth: 1, 
                paddingLeft: 10,
                paddingRight: 10,
                width: "90%"}}
              onPress={() => {
                  this.updateRequirements()
              }}/>
          :null
          }
        </View>
    );
  }
}

const statusCodes = [
  { value: 'Current' },
  { value: 'Cancelled' },
  { value: 'Suspended' },
];

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  contentContainer: {
    marginTop: 56,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    padding: 20,
  },
  sectionContainer: {
    paddingVertical: 56,
  },
  navigationBar: {
    paddingTop: 10,
    height: 52,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top:   0,
    backgroundColor: '#3F51B5',
    ...Platform.select({
      android: {
        elevation: 4,
      },
      ios: {
        zIndex: 10,
      },
    }),
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
    paddingTop: 5
  },
  baseText: {
    fontFamily: 'Cochin',
    fontWeight: 'normal'
  },
  multilineBox: {
    alignSelf: "center",
    maxHeight: 150,
    borderColor: "#1ca0ff", 
    borderWidth: 1, 
    paddingLeft: 10,
    paddingRight: 10,
    marginVertical: 1,
    width: "90%"}
});

export default EditEntity;