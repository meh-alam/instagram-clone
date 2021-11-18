import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, Button } from 'react-native'

import firebase from 'firebase'
require('firebase/firestore')
import { connect } from 'react-redux'

function Profile(props) {
    const [userPosts, setUserPosts] = useState([]);
    const [user, setUser] = useState(null);
    // if the currentUser is viewing a user's profile that he is following then it will be set to true else false
    const [following, setFollowing] = useState(false)

    // when the app loads, if the user is different from the currentUser fetch the data from the database 
    useEffect(() => {
        const { currentUser, posts } = props;

        //if current user
        if (props.route.params.uid === firebase.auth().currentUser.uid) {
            setUser(currentUser)
            setUserPosts(posts)
        }
        // if not the current user
        else {
            // display the profile of that user (having that uid)
            firebase.firestore()
                .collection("users")
                .doc(props.route.params.uid)
                .get()
                .then((snapshot) => {
                    if (snapshot.exists) {
                        setUser(snapshot.data());
                    }
                    else {
                        console.log('does not exist')
                    }
                })
            // and now get all the posts of that user (having that uid)
            firebase.firestore()
                .collection("posts")
                .doc(props.route.params.uid)
                .collection("userPosts")
                .orderBy("creation", "asc")
                .get()
                .then((snapshot) => {
                    let posts = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return { id, ...data }
                    })
                    setUserPosts(posts)
                })
        }

        // props.following is completely different from state variable following
        // this if will check the indexOf uid (string) inside of following, if it is greater than -1 then it means that this string belongs to following
        // however if it is equal to -1 then that means that this string doesnot exist inside the following
        // The indexOf() method returns the position of the first occurrence of a specified value in a string.
        // The indexOf() method returns -1 if the value is not found.
        if (props.following.indexOf(props.route.params.uid) > -1) {
            setFollowing(true);
        } else {
            setFollowing(false);
        }
        // only when the following variables update re-run useEffect hook
    }, [props.route.params.uid, props.following])

    //a function that will run when the user clicks the follow button on someone's profile
    const onFollow = () => {
        // go to firebase firestore 
        firebase.firestore()
            // go to the collection with the title following
            .collection("following")
            // go to the current user profile
            .doc(firebase.auth().currentUser.uid)
            // go to the collection inside user's profile with the title userFollowing
            .collection("userFollowing")
            // save the profile of the user we are currently viewing
            .doc(props.route.params.uid)
            .set({})
    }

    // a function that will be called when the user clicks the unfollow button on someone's profile
    // goes exactly the same as onFollow but we call delete() at the end instead of set()
    // to delete that record from the following collection
    const onUnfollow = () => {
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .doc(props.route.params.uid)
            .delete()
    }

    // a function triggered when the logout button is pressed
    // when the user logs out he will be automatically navigated to the landing page
    // and that's because in app.js we have the onAuthStateChanged() inside the componentDidMount()
    // whenever it changes, then the loggedIn state changes and when that happens the navigation container changes from the 
    // loggedInUser(the below one in app.js) to the notLoggedInUser(the upper one in app.js)
    const onLogout = () => {
        firebase.auth().signOut();
    }

    // if the user is not loaded before the useEffect is being called, in that case we'll have null in the user variable which will generate error
    // so below we are handling that scenario/case
    if (user === null) {
        return <View />
    }
    return (
        <View style={styles.container}>
            <View style={styles.containerInfo}>
                <Text>{user.name}</Text>
                <Text>{user.email}</Text>

                {/* if the user is viewing his own profile then just display a logout button 
                    and if he is viewing someone else's profile then show him the first view that is follow or following buttons*/}
                {props.route.params.uid !== firebase.auth().currentUser.uid ? (
                    <View>
                        {following ? (
                            // if following then display a button with the title following
                            <Button
                                title="Following"
                                // call this function if the user taps the following button which will lead to unfollowing the user
                                onPress={() => onUnfollow()}
                            />
                        ) :
                            // if not following then dispalay a button with the title follow to let the current user follow that user
                            (
                                <Button
                                    title="Follow"
                                    // call this function if the user taps the following button which will lead to following the user
                                    onPress={() => onFollow()}
                                />
                            )}
                    </View>
                ) :
                    // in case the uid is equal to currently loggedIn user
                    <Button
                        title="Logout"
                        onPress={() => onLogout()}
                    />}
            </View>
            {/* this gallery container will contain all the posts */}
            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={3}
                    horizontal={false}
                    data={userPosts}
                    renderItem={({ item }) => (
                        <View
                            style={styles.containerImage}>

                            <Image
                                style={styles.image}
                                // downloadURL is a key (variable) in firebase
                                source={{ uri: item.downloadURL }}
                            />
                        </View>

                    )}

                />
            </View>
        </View>

    )
}

// all the styling goes here
const styles = StyleSheet.create({
    // outermost container
    container: {
        flex: 1,
    },
    // container for the user information
    containerInfo: {
        margin: 20
    },
    // container for the gallery
    containerGallery: {
        flex: 1
    },
    // container for holding the image
    containerImage: {
        flex: 1 / 3

    },
    // some styling for the image itself
    image: {
        flex: 1,
        aspectRatio: 1 / 1
    }
})

// fetching data from the redux store
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
    following: store.userState.following
})

export default connect(mapStateToProps, null)(Profile);