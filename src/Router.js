'use strict';
import React, {useContext, useEffect, useMemo, useState} from 'react';
import {View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import auth from '@react-native-firebase/auth';

import {Icon} from 'react-native-elements';
import SideMenuIcon from './components/SideMenuIcon';
import Jobs from './screens/Jobs';
import Recordings from './screens/Recordings';
import Splash from './screens/Splash';
import FirebaseLogin from './FirebaseLogin';
import LogOut from './FirebaseLogin/screens/LogOut';
import {NetworkContext} from './Utils/NetworkProvider';
import {AuthProvider, useAuth} from './Utils/context';
import {testProperties} from './Utils/TestProperties';
import AddJobWizard from './screens/JobModel/AddJobWizard';
import JobController from './screens/JobModel/JobController';
import JobCategories from './screens/JobModel/JobCategories';
import JobBasic from './screens/JobModel/JobBasic';
import Requirements from './screens/JobModel/Requirements';
import JobTerms from './screens/JobModel/JobTerms';
import JobLoc from './screens/JobModel/JobLoc';

////
const AuthStack = createStackNavigator();
const JobsStack = createStackNavigator();
const Tabs = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const RootStack = createStackNavigator();

const AuthStackScreen = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen
      name="SignIn"
      component={FirebaseLogin}
      options={{
        title: 'Register or Sign In',
        headerStyle: {
          backgroundColor: '#5692CE',
        },
        headerTintColor: '#fff',
      }}
    />
  </AuthStack.Navigator>
);

const JobsStackScreen = () => (
  <JobsStack.Navigator>
    <JobsStack.Screen
      name="Home"
      component={TabsScreen}
      options={({navigation}) => ({
        headerTitle: 'Home',
        headerMode: 'screen',
        headerStyle: {
          backgroundColor: '#5692CE',
        },
        headerTintColor: '#fff',
        headerLeft: () => (
          <SideMenuIcon
            onPress={() => navigation.toggleDrawer()}
            title="Info"
            color="#fff"
          />
        ),
      })}
    />
    <JobsStack.Screen
      name="JobController"
      component={JobController}
      options={{
        tabBarLabel: 'Jobs',
        gesturesEnabled: true,
        headerTitleStyle: {
          width: '90%',
          textAlign: 'right',
        },
        headerStyle: {
          backgroundColor: '#5692CE',
        },
        headerTintColor: '#fff',
        title: 'Job Details',
      }}
    />

    <JobsStack.Screen
      name="JobBasic"
      component={JobBasic}
      options={{
        tabBarLabel: 'Jobs',
        gesturesEnabled: true,
        headerTitleStyle: {
          width: '90%',
          textAlign: 'right',
        },
        headerStyle: {
          backgroundColor: '#5692CE',
        },
        headerTintColor: '#fff',
        title: 'Job Details',
      }}
    />
    <JobsStack.Screen
      name="JobCategories"
      component={JobCategories}
      options={{
        tabBarLabel: 'Jobs',
        gesturesEnabled: true,
        headerTitleStyle: {
          width: '90%',
          textAlign: 'right',
        },
        headerStyle: {
          backgroundColor: '#5692CE',
        },
        headerTintColor: '#fff',
        title: 'Job Cateogory',
      }}
    />
    <JobsStack.Screen
      name="Requirements"
      component={Requirements}
      options={{
        tabBarLabel: 'Jobs',
        gesturesEnabled: true,
        headerTitleStyle: {
          width: '90%',
          textAlign: 'right',
        },
        headerStyle: {
          backgroundColor: '#5692CE',
        },
        headerTintColor: '#fff',
        title: 'Job Details',
      }}
    />
    <JobsStack.Screen
      name="JobTerms"
      component={JobTerms}
      options={{
        tabBarLabel: 'Jobs',
        gesturesEnabled: true,
        headerTitleStyle: {
          width: '90%',
          textAlign: 'right',
        },
        headerStyle: {
          backgroundColor: '#5692CE',
        },
        headerTintColor: '#fff',
        title: 'Term and Rates',
      }}
    />
    <JobsStack.Screen
      name="JobLoc"
      component={JobLoc}
      options={{
        tabBarLabel: 'Jobs',
        gesturesEnabled: true,
        headerTitleStyle: {
          width: '90%',
          textAlign: 'right',
        },
        headerStyle: {
          backgroundColor: '#5692CE',
        },
        headerTintColor: '#fff',
        title: 'Job Location',
      }}
    />
    <JobsStack.Screen
      name={'AddJobWizard'}
      component={AddJobWizard}
      options={{
        tabBarLabel: 'Jobs',
        gesturesEnabled: true,
        headerTitleStyle: {
          width: '90%',
          textAlign: 'right',
        },
        headerStyle: {
          backgroundColor: '#5692CE',
        },
        headerTintColor: '#fff',
        title: 'Add New Job',
      }}
    />
  </JobsStack.Navigator>
);

const TabsScreen = () => (
  <Tabs.Navigator>
    <Tabs.Screen
      name="Jobs"
      component={Jobs}
      options={{
        tabBarLabel: 'Jobs',
        gesturesEnabled: true,
        headerTitleStyle: {
          width: '90%',
          textAlign: 'right',
        },
        headerStyle: {
          backgroundColor: '#5692CE',
        },
        headerTintColor: '#fff',
        title: 'Jobs',
        //tabBarVisible: false,
        tabBarIcon: ({tintColor}) => (
          <Icon name="home" size={35} color={tintColor} />
        ),
      }}
    />
    <Tabs.Screen
      name="Recordings"
      component={Recordings}
      options={{
        tabBarLabel: 'Recordings',
        headerTitleStyle: {
          width: '90%',
          textAlign: 'right',
        },
        headerStyle: {
          backgroundColor: '#5692CE',
        },
        headerTintColor: '#fff',
        //tabBarVisible: false,
        tabBarIcon: ({tintColor}) => (
          <Icon name="list" size={35} color={tintColor} />
        ),
      }}
    />
  </Tabs.Navigator>
);

const DrawerScreen = () => (
  <Drawer.Navigator
    drawerWidth={300}
    contentComponent={({navigation}) => <Tabs navigation={navigation} />}>
    <Drawer.Screen name="Jobs" component={JobsStackScreen} />
    <Drawer.Screen
      name="Logout"
      options={{
        drawerIcon: ({tintColor}) => (
          <Icon
            name="list"
            {...testProperties('LogoutDesc')}
            size={25}
            color={tintColor}
          />
        ),
      }}
      component={LogOut}
    />
  </Drawer.Navigator>
);

const RootStackScreen = () => {
  // newuser is provided from the listener in the authProvider
  const {newUser, authLoading, authError} = useAuth();

  // if no user go to login, don't show error
  if (authLoading) {
    return <Splash />;
  }
  if (newUser !== null && newUser !== 'undefined') {
    //setup globals
    global.UID = newUser.uid;
    global.displayName = newUser.displayName;
    global.email = newUser.email;
  }

  return (
    <RootStack.Navigator headerMode="none">
      {newUser !== null && newUser !== 'undefined' ? (
        <RootStack.Screen
          name="Drawer"
          component={DrawerScreen}
          options={{
            animationEnabled: false,
            headerStyle: {
              backgroundColor: '#5692CE',
            },
            headerTintColor: '#fff',
          }}
        />
      ) : (
        <RootStack.Screen
          name="Auth"
          component={AuthStackScreen}
          options={{
            animationEnabled: false,
          }}
        />
      )}
      <RootStack.Screen name="Tabs" component={TabsScreen} />
    </RootStack.Navigator>
  );
};

export default () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootStackScreen />
      </NavigationContainer>
    </AuthProvider>
  );
};

////
