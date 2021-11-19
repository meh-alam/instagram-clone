import React,{Component} from 'react';
import { View,Text } from 'react-native';

// an npm package that we have install for navigations
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'

// importing required components
import LandingScreen from './components/auth/Landing'
import RegisterScreen from './components/auth/Register'
import LoginScreen from './components/auth/Login'
import MainScreen from './components/Main'
import AddScreen from './components/main/Add'
import SaveScreen from './components/main/Save'
import CommentScreen from './components/main/Comment'

// importing firebase
import firebase from 'firebase'

// importing redux
    // provider is tag that will ingo our components and everthing that's inside our app
import { Provider } from 'react-redux';
import {createStore,applyMiddleware} from 'redux'
    // main reducer in our redux
import rootReducer from './redux/reducers'
    // thunk is a middleware that allows us to use dispatch function inside here
import thunk from 'redux-thunk'
    // creating store
const store=createStore(rootReducer,applyMiddleware(thunk))

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
            <Stack.Screen name='Login' component={LoginScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }
    return(
      <Provider store={store}>
        <NavigationContainer>
        <Stack.Navigator initialRouteName='Main'>
            {/* here options is the customization that we apply if want to each screen */}
            {/* the firt screen that shows up and that contains the botton navigater that enables us to switch along the screens */}
            <Stack.Screen name='Main' component={MainScreen} options={{headerShown:false}} />
            {/* passing navigation as a prop we will be able to access it in add component */}
            <Stack.Screen name='Add' component={AddScreen} navigation={this.props.navigation} />
            <Stack.Screen name='Save' component={SaveScreen} navigation={this.props.navigation} />
            <Stack.Screen name='Comment' component={CommentScreen} navigation={this.props.navigation} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    )
  }
}

export default App
