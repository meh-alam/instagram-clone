import React,{Component} from 'react';
import { View,Text } from 'react-native';

// an npm package that we have installed for navigations
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'

// importing required components
import LandingScreen from './components/auth/Landing'
import RegisterScreen from './components/auth/Register'

// importing firebase
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

//it will contain our screens, pages and will be generating all routes.
const Stack=createStackNavigator();
export class App extends Component {
  constructor(props){
    super(props)
    this.state={
      loaded: false
    }
  }

  // it will run once the component is loaded/mounted
  componentDidMount(){
    // will be listening for state changes (loaded in this case) and will show loading when not and then navigation container/logged in page
    // when the user has been logged in 
    firebase.auth().onAuthStateChanged((user)=>{
      if(!user){
        this.setState({
          loggedIn:false,
          loaded:true
        })
      }
      else{
        this.setState({
          loggedIn:true,
          loaded:true
        })
      }
    })
  }

  render() {
    const {loggedIn,loaded}=this.state
    if(!loaded){
      return(
        <View style={{flex:1,justifyContent:'center'}}>
          <Text>Loading</Text>
        </View>
      )
    }

    if(!loggedIn){
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
    return(
      <View style={{flex:1,justifyContent:'center'}}>
        <Text>User is logged in</Text>
      </View>
    )
  }
}

export default App
