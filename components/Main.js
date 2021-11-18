// MAIN.JS is the file that's called up after landing, logging and register

import React, { Component } from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import firebase from 'firebase'
// connect allows us to connect react (or a component) and redux
import { connect } from 'react-redux'
// bindActionCreators allows us to bind our actions to this component
import { bindActionCreators } from 'redux'
import { fetchUser, fetchUserPosts, fetchUserFollowing, clearData } from '../redux/actions/index'

import FeedScreen from './main/Feed'
import ProfileScreen from './main/Profile' 
import SearchScreen from './main/Search.js'

const Tab = createMaterialBottomTabNavigator();

// making it just because the app doesn't crash and we can return it as an empty screen because we have to return something in every case
const EmptyScreen = () => {
    return (null)
}

export class Main extends Component {
    // componentDidMount calls upon the first page whenever the user logs in
    componentDidMount() {
        this.props.clearData();
        // it will call up index.js which then by calling dispatch (which is there in index.js) will call up the reducers at user.js and these will
        // update the state of current user with what we get in our actions
        this.props.fetchUser();
        this.props.fetchUserPosts();
        this.props.fetchUserFollowing();
    }
    render() {
        return (
            <Tab.Navigator initialRouteName="Feed" labeled={false}>
                
                {/* FeedScreen started here */}
                <Tab.Screen name="Feed" component={FeedScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            // adding home icon
                            <MaterialCommunityIcons name="home" color={color} size={26} />
                        ),
                    }} />

                {/* SearchScreen started here */}
                <Tab.Screen name="Search" component={SearchScreen} navigation={this.props.navigation}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            // magnifying glass icon
                            <MaterialCommunityIcons name="magnify" color={color} size={26} />
                        ),
                    }} />
                    {/* emptyscreen is an empty function that we are showing as an empty component. it is returning null */}
                <Tab.Screen name="AddContainer" component={EmptyScreen}
                    // listeners will be listening to user interaction with a button so that we can easily catch those events and say no, we are not going to do
                    // what you are programmed to do, you are going to do these other things which we want you to do which is in this case opening a new screen
                    listeners={({ navigation }) => ({

                        // when the user presses tab button
                        tabPress: event => {
                            // prevents the default behavior so that we can do what we want to do in the next line that is navigation.navigate("Add")
                            event.preventDefault();
                            navigation.navigate("Add")
                        }
                    })}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="plus-box" color={color} size={26} />
                        ),
                    }} />
                <Tab.Screen name="Profile" component={ProfileScreen} 
                listeners={({ navigation }) => ({
                    tabPress: event => {
                        event.preventDefault();
                        navigation.navigate("Profile", {uid: firebase.auth().currentUser.uid})
                    }})}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="account-circle" color={color} size={26} />
                        ),
                    }} />
            </Tab.Navigator>
        )
    }
}

// a function directed at reducers
const mapStateToProps = (store) => ({
    // variables that are inside redux state
    currentUser: store.userState.currentUser
})

// it will connect the function to our props and because of that we will be able to access them here in this component
    // providing all the functions in bindActionCreators that we want to acces and we have used up top, inside an object
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUser, fetchUserPosts, fetchUserFollowing, clearData }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Main);