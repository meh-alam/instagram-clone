// ACTIONS: this is where we are going to make a call to fetch the user, save the user, save posts and everything like that

import { USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, USERS_DATA_STATE_CHANGE,USERS_POSTS_STATE_CHANGE, USERS_LIKES_STATE_CHANGE, CLEAR_DATA} from '../constants/index'
import firebase from 'firebase'
import { SnapshotViewIOSComponent } from 'react-native'
import { users } from '../reducers/users'
require('firebase/firestore')

// these are the functions that our frontend will call in order to triger database actions
    //function for clearing the redux data
export function clearData() {
    return ((dispatch) => {
        // it will be triggered both in the user.js and users.js files (in every single reducer that we have)
        dispatch({type: CLEAR_DATA})
    })
}

// function to fetch a user
export function fetchUser() {
    return ((dispatch) => {
        // this is the same process as setting/reg the user but instead of set() we use get() to get/fetch the user
        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            // here is the difference
            .get()
            .then((snapshot) => {
                // snapshot is actually the data we are getting from database. if data exists on database then do the following
                if (snapshot.exists) {
                    // dispatch actually means send to the reducer a call and provide the state changes
                    dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() })
                }
                // in case the user does not exist in the database or something went terribly wrong
                else {
                    console.log('does not exist')
                }
            })
    })
}

// function to fetch user's posts
export function fetchUserPosts() {
    return ((dispatch) => {
        firebase.firestore()
            // structure inside firestore collection then a doc inside which a collection
            .collection("posts")
            .doc(firebase.auth().currentUser.uid)
            .collection("userPosts")
            // sorting posts in ascending order using timestamps (timestamp is an integer at 1970 as absolute zero and from then it is constantly increasing
            // each and every microsecond)
            .orderBy("creation", "asc")
            .get()
            .then((snapshot) => {
                // map will iterate through all the docs inside the snapshot. It iterates through the first doc,it gets 
                // the data and id, returns the data and id inside an object that we are returning and so on for 
                // all the docs
                let posts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                dispatch({ type: USER_POSTS_STATE_CHANGE, posts })
            })
    })
}

export function fetchUserFollowing() {
    return ((dispatch) => {
        firebase.firestore() 
            // go to collection with the name following
            .collection("following")
            // inside following open the current user
            .doc(firebase.auth().currentUser.uid)
            // inside that profile go to userFollowing collection
            .collection("userFollowing")
            // for that collection do the following
            // onSnapshot is a listener, this means u will be receving constant updatas anytime the database changes
            // anytime a user is added or removed from this collection, this function will be triggered and we will be able to get the most updated list
            // of the users that the currentUser is following
            .onSnapshot((snapshot) => {
                let following = snapshot.docs.map(doc => {
                    const id = doc.id;
                    return id
                })
                dispatch({ type: USER_FOLLOWING_STATE_CHANGE, following });
                
                // loop to go through all the users that the current user is following and calling fetchUsersData()
                // accordingly for each and every single user
                for(let i = 0; i < following.length; i++){
                    // true is passed in order to make it sure that the usersFollowingPost will be called
                    dispatch(fetchUsersData(following[i], true));
                }
            })
    })
}

// this function will get the users information that(the users)we get through above function (fetchUsersFollowing())
    // the getPosts boolean will tell if we are meant to fetch the posts or not, if we don't provide it the function
    // is always gonna fetch the posts (see dispatch of this function down below)
export function fetchUsersData(uid, getPosts) {
    // getState gives you the current state of the redux store so that we can get the users following   
    return ((dispatch, getState) => {
        // we want to first see if the user exists in our users array in users.js state
        // because we don't want duplication for the same user
            // what the following logic is doing is that if an element with uid that was passed along exists within
            // users.js.initialState.users array. if it does then found will be true else not
        const found = getState().usersState.users.some(el => el.uid === uid);
        // if the user doesn't exist
        if (!found) {
            firebase.firestore()
                .collection("users")
                .doc(uid)
                .get()
                .then((snapshot) => {
                    if (snapshot.exists) {
                        let user = snapshot.data();
                        user.uid = snapshot.id;
                        // this will update users.js.users by calling USERS_DATA_STATE_CHANGE case inside switch
                        dispatch({ type: USERS_DATA_STATE_CHANGE, user });
                    }
                    else {
                        console.log('does not exist')
                    }
                })

                // if and only if the getPosts boolean is true only then run fetchUsersData
                if(getPosts){
                    dispatch(fetchUsersFollowingPosts(uid));
                }
        }
    })
}

// this function is responsible for fetching all the users that the current user is following
export function fetchUsersFollowingPosts(uid) {
    return ((dispatch, getState) => {
        firebase.firestore()
            .collection("posts")
            .doc(uid)
            .collection("userPosts")
            // ascending order depending on the creation date
            .orderBy("creation", "asc")
            .get()
            .then((snapshot) => {
                const uid = snapshot.query._.C_.path.segments[1]
                // with the use of find it will give u the user that with the same uid
                const user = getState().usersState.users.find(el => el.uid === uid);

                let posts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data, user }
                })

                // looping through all the posts 
                for(let i = 0; i< posts.length; i++){
                    dispatch(fetchUsersFollowingLikes(uid, posts[i].id))
                }
                dispatch({ type: USERS_POSTS_STATE_CHANGE, posts, uid })

            })
    })
}


// this function is responsible for fetching all the likes
export function fetchUsersFollowingLikes(uid, postId) {
    return ((dispatch, getState) => {
        firebase.firestore()
            .collection("posts")
            .doc(uid)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            // if this is the currently loggedIn user's id 
            .doc(firebase.auth().currentUser.uid)
            // here we aren't simply getting the likes like we did with users and posts, here we are going to listen for changes with in this value
                // because anytime the user likes or dislikes a post this value changes
                    // then we want to trigger this function yet again in order to change the data that we have on the post
            .onSnapshot((snapshot) => { 
                // we need postId here because we have feed(an array of posts) inside redux.reducers.user.js.initialState
                    // if we have the postId then we are able to quickly find the post in the array we want to change the status of  
                // const postId = snapshot.ZE.path.segments[3];
                    // there is no easy way of getting the postId in this case, so we have to really dig deep to the obj and see where it is exactly
                        // and the above is the most easy way of doing this

                let currentUserLike = false;
                // in order to know if the user likes the post or not is to know if the user exists or not in the current snapshot(collection)
                if(snapshot.exists){
                    currentUserLike = true;
                }

                dispatch({ type: USERS_LIKES_STATE_CHANGE, postId, currentUserLike })
            })
    })
}