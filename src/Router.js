'use strict';
import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {Icon} from 'react-native-elements';
import SideMenuIcon from './components/SideMenuIcon';
import Settings from './screens/Settings';
import Jobs from './screens/Jobs';
import Home from './screens/Home';
import Recordings from './screens/Recordings';
import Splash from './screens/Splash';
import FirebaseLogin from './FirebaseLogin';
import LogOut from './FirebaseLogin/screens/LogOut';
import Video from './screens/Video';
import Enquiry from './screens/Enquiry';
import {AuthProvider, useAuth} from './Utils/AuthContext';
import {JobProvider} from './Utils/JobContext';
import {testProperties} from './Utils/TestProperties';
import AddJobWizard from './screens/JobModel/AddJobWizard';
import JobController from './screens/JobModel/JobController';
import JobCategories from './screens/JobModel/JobCategories';
import JobBasic from './screens/JobModel/JobBasic';
import Requirements from './screens/JobModel/Requirements';
import JobTerms from './screens/JobModel/JobTerms';
import Search from './screens/Search';
import IntroSwiper from './components/IntroSwiper';
import JobLoc from './screens/JobModel/JobLoc';
import store from 'react-native-simple-store';

const AuthStack = createStackNavigator();
const JobsStack = createStackNavigator();
const Tabs = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const RootStack = createStackNavigator();
const SettingsStack = createStackNavigator();

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

const SettingsStackScreen = () => {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        name="Settings"
        component={Settings}
        options={({navigation}) => ({
          headerTitle: 'Settings',
          headerMode: 'screen',
          headerStyle: {
            backgroundColor: '#5692CE',
          },
          headerTintColor: '#fff',
          headerLeft: () => (
            <Icon
              type="ionicon"
              name="arrow-back-outline"
              size={35}
              onPress={() => {
                navigation.goBack(null);
              }}
            />
          ),
          headerRight: () => (
            <Icon name="home" size={35} color={'#fff'} marginRight={10} />
          ),
        })}
      />
    </SettingsStack.Navigator>
  );
};

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
      name="Jobs"
      component={Jobs}
      options={({navigation}) => ({
        headerTitle: 'Jobs',
        headerMode: 'screen',
        headerStyle: {
          backgroundColor: '#5692CE',
        },
        headerTintColor: '#fff',
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
    <JobsStack.Screen
      name="Search"
      component={Search}
      options={{
        tabBarLabel: 'Search Results',
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
    <JobsStack.Screen
      name="Enquiry"
      component={Enquiry}
      options={{
        tabBarLabel: 'Enquiries',
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
    <JobsStack.Screen
      name="Video"
      component={Video}
      options={{
        tabBarLabel: 'Video',
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
          <Icon name="videocam" size={35} color={'blue'} />
        ),
      }}
    />
  </JobsStack.Navigator>
);

const TabsScreen = () => (
  <Tabs.Navigator>
    <Tabs.Screen
      name="Home"
      component={Home}
      options={{
        tabBarLabel: 'Home',
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
      name="Video"
      component={Video}
      options={{
        tabBarLabel: 'Video',
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
          <Icon name="videocam" size={35} color={'blue'} />
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
    <Drawer.Screen name="Home" component={JobsStackScreen} />
    <Drawer.Screen name="Settings" component={SettingsStackScreen} />
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
  // currentUser is provided from the listener in the authProvider
  const {currentUser, loading, error} = useAuth();
  console.log('error ', error);
  // if no user go to login, don't show error
  if (loading) {
    return <Splash />;
  }
  if (currentUser !== null && typeof currentUser !== 'undefined') {
    //setup globals
    global.UID = currentUser.uid;
    global.displayName = currentUser.displayName;
    global.email = currentUser.email;
  }

  return (
    <RootStack.Navigator headerMode="none">
      {currentUser !== null && currentUser !== 'undefined' ? (
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
  const [isIntroDone, setIsIntroDone] = useState(false);

  useEffect(() => {
    // if isIntroDone is changed then update the asyncstorage
    if (isIntroDone) {
      if (global.appType === 'boss') {
        store.save('introDone', {bossIntroDone: true});
      } else {
        store.save('introDone', {userIntroDone: true});
      }
    }
  }, [isIntroDone]);

  store.get('introDone').then((introDoneArr) => {
    console.log(introDoneArr);
    if (introDoneArr) {
      setIsIntroDone(true);
    }
  });

  if (!isIntroDone) {
    return <IntroSwiper onIntroDone={setIsIntroDone} />;
  } else {
    return (
      <AuthProvider>
        <NavigationContainer>
          <JobProvider>
            <RootStackScreen />
          </JobProvider>
        </NavigationContainer>
      </AuthProvider>
    );
  }
};
