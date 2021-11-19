// THIS IS THE COMPONENT RESPONSIBLE FOR SAVING THE IMAGE

import React, { useState } from 'react'
import { View, TextInput, Image, Button } from 'react-native'

import firebase from 'firebase'
import { NavigationContainer } from '@react-navigation/native'
// importing things that are not the npm packages
require("firebase/firestore")
require("firebase/firebase-storage")


export default function Save(props) {
    // hook tracking caption    
    const [caption, setCaption] = useState("")

    const uploadImage = async () => {
        const uri = props.route.params.image;
        // math.random() will generate a random number of 36 characters
        const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`;
        console.log(childPath)

        const response = await fetch(uri);
        // responsible for uploading the image. it will create a blob of this uri which will then pass along the firestore which will then upload the image
        const blob = await response.blob();

        // by creating a task we will be able to know alot of info about the image upload
        const task = firebase
            .storage()
            .ref()
            .child(childPath)
            // it will tell the firebase storage, which file it is
            .put(blob);

        // showing upload process progress in bytes 
        const taskProgress = snapshot => {
            console.log(`transferred: ${snapshot.bytesTransferred}`)
        }

        // do this when we are done with uploading
        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                savePostData(snapshot);
                console.log(snapshot)
            })
        }

        // do this in case of an error in uploading process
        const taskError = snapshot => {
            console.log(snapshot)
        }

        // calling the tasks on state change
        task.on("state_changed", taskProgress, taskError, taskCompleted);
    }

    const savePostData = (downloadURL) => {
        firebase.firestore()
            .collection('posts')
            .doc(firebase.auth().currentUser.uid)
            .collection("userPosts")
            .add({
                downloadURL,
                caption,
                likesCount: 0,
                // firestore will place a timestamp in this location. that way we can know for sure that when the post was created
                creation: firebase.firestore.FieldValue.serverTimestamp()
            }).then((function () {
                // navigation.popToTop() will go to the beginning route of navigator. In this case it will go to the Main (mainScreen) in app.js
                props.navigation.popToTop()
            }))
    }
    console.log(props)
    return (
        <View style={{ flex: 1 }}>
            <Image source={{ uri: props.route.params.image }} />
            <TextInput
                placeholder="Write a Caption. . ."
                onChangeText={(caption) => setCaption(caption)}
            />
            <Button title="Save" onPress={() => uploadImage()} />
        </View>
    )
}