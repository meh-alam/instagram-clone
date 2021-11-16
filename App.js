import { StatusBar } from 'expo-status-bar';
import React from 'react';

import firebase from 'firebase'

// firebase config
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCeSIFxQ1REOBkczRXH_4gNSxxI4fwivns",
  authDomain: "instagram-dev-122a6.firebaseapp.com",
  projectId: "instagram-dev-122a6",
  storageBucket: "instagram-dev-122a6.appspot.com",
  messagingSenderId: "512102290323",
  appId: "1:512102290323:web:656bfec63d81fc63368e66",
  measurementId: "G-KLBGPNSD3P"
};

// initializing firebase app
if(firebase.apps.length===0){
  firebase.initializeApp(firebaseConfig)
}

// an npm package that we have installed for navigations
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'

// importing required components
import LandingScreen from './components/auth/Landing'
import RegisterScreen from './components/auth/Register'

//it will contain our screens, pages and will be generating all routes.
const Stack=createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Landing'>
        {/* here options is the customization that we apply if want to each screen */}
        <Stack.Screen name='Landing' component={LandingScreen} options={{headerShown:false}} />
        <Stack.Screen name='Register' component={RegisterScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}