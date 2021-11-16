import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// an npm package that we have installed for navigations
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
// importing required components
import LandingScreen from './components/auth/Landing'

//it will contain our screens, pages and will be generating all routes.
const Stack=createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Landing'>
        {/* here options is the customization that we apply if want to each screen */}
        <Stack.Screen name='Landing' component={LandingScreen} options={{headerShown:false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}