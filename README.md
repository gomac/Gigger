# Gigger is a job recruitment app that you can use for examples of the latest React Native Techniques

**_ In Construction _**

There are actually two apps, a boss and a job-seeker (gigger) app. Which one is built is determined by changing the 'global.appType' value in global.js to either 'user' or 'boss'.

It's also a great template for a 'vanilla' or 'white-label' app, that can be modified for other opportunities, e.g. a dating app, insurance claim app, teaching app...

To install and use the app 'as is' you need a Google Firestore database. Once set up, make sure you add the google-services.json config files, as explained in the google docs. The app uses @react-native-firebase for simplicity.

## TLDR;

At this stage I haven't had time to write articles on the incorporated features so this repo is really suited to experienced developers to forage around to find what they are looking for. Within the source, you can find how to do the following activities.

1.  Form validation with react-hook-form
2.  Using Appium and writing tests in Cucumber
3.  Connecting to Firestore with react-native-firestore
4.  Reading Firestore with react-firebase-hooks
5.  Using react-navigation v5
6.  Authentication flow in react navigation
7.  Use of useContext for authentication and main entities to prevent prop-drilling
8.  How to add Introduction Slides to your app and make them appear only for first time users
9.  How to configure Android and IOS so you can generate different apps with with different logos and splash screens
10. How to generate test data and load it into Firestore
11. Incorporating location data using GeoFirestore so you can find all the jobs within a given radius
12. Loading and using reference data, in this case the categories of jobs, e.g. customer contact, hospitality, child care
13. Checking for network connection and dropouts
14. Multi-language support
