import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, Button } from 'react-native'

import firebase from 'firebase'
require('firebase/firestore')
import { connect } from 'react-redux'

function Feed(props) {
    const [posts, setPosts] = useState([]);

    useEffect(() => { 
        // second condition is if we don't have any user who is following
        if (props.usersFollowingLoaded == props.following.length && props.following.length !== 0) {
            // ordering the posts using timestap
            props.feed.sort(function (x, y) {
                // if x.creation is greater then y.creation then the following would be positive
                // and if less, then will be negative and hence will sort all accordingly
                return x.creation - y.creation;
            }) 
            setPosts(props.feed);
        }
        console.log(posts)

    }, [props.usersFollowingLoaded, props.feed])

    // this function will be triggered whenever the user presses the like button
    const onLikePress = (userId, postId) => {
        firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .set({})
    }

    // this function will be triggered whenever the user presses the dislike button
    const onDislikePress = (userId, postId) => {
        firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .delete()
    }
    return (
        <View style={styles.container}>
            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={posts}
                    renderItem={({ item }) => (
                        <View
                            style={styles.containerImage}>
                            <Text style={styles.container}>{item.user.name}</Text>
                            <Image
                                style={styles.image}
                                source={{ uri: item.downloadURL }}
                            />

                            {/* if currentUserLike is true, it means that the has has already liked the post, so give the option of dislike */}
                            { item.currentUserLike ?
                                (
                                    <Button
                                        title="Dislike"
                                        onPress={() => onDislikePress(item.user.uid, item.id)} />
                                )
                                // if not already liked
                                :
                                (
                                    <Button
                                        title="Like"
                                        onPress={() => onLikePress(item.user.uid, item.id)} />
                                )
                            } 
                            {/* a touchable text that will navigate us to the comments collection */}
                            <Text
                                // navigating to the comments screen. The postId will tell the text which post's comments to be opened 
                                    // and uid will tell about the user
                                onPress={() => props.navigation.navigate('Comment', { postId: item.id, uid: item.user.uid })}>
                                View Comments...
                                </Text>
                        </View>

                    )}

                />
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerInfo: {
        margin: 20
    },
    containerGallery: {
        flex: 1
    },
    containerImage: {
        flex: 1 / 3

    },
    image: {
        flex: 1,
        aspectRatio: 1 / 1
    }
})
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    following: store.userState.following,
    feed: store.usersState.feed,
    usersFollowingLoaded: store.usersState.usersFollowingLoaded,


})
export default connect(mapStateToProps, null)(Feed);