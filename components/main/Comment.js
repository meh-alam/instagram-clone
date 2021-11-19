import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, Button, TextInput } from 'react-native'

import firebase from 'firebase'
require('firebase/firestore')

import { connect } from 'react-redux'
// Normally you should just call dispatch directly on your Store instance. If you use Redux with React, 
    // react-redux will provide you with the dispatch function so you can call it directly, too.
// The only use case for bindActionCreators is when you want to pass some action creators down to a component 
    // that isn't aware of Redux, and you don't want to pass dispatch or the Redux store to it.
// we are using it because we want to use fetchUsersData() which is inside redux.actions.index.js
import { bindActionCreators } from 'redux'
import { fetchUsersData } from '../../redux/actions/index'

function Comment(props) {
    // list of comments
    const [comments, setComments] = useState([])
    // post that the comments are for
    const [postId, setPostId] = useState("")
    // a single comment text that the user types
    const [text, setText] = useState("")

    useEffect(() => {
        // the main role is this function is to attach a user to every single comment
        function matchUserToComment(comments) {
            // loop through all the comments
            for (let i = 0; i < comments.length; i++) {
                // if the comments collection has already the property user (that is declared below), then it means that this comment has
                    // already a user so we will just continue without executing the following code
                if (comments[i].hasOwnProperty('user')) {
                    // just move on to the next iteration of the loop
                    continue;
                }

                // if the user inside the users array that we are looping through has id matching to comment.creator, then that is our
                    // target user
                const user = props.users.find(x => x.uid === comments[i].creator)
                // we don't have user's information
                if (user == undefined) {
                    props.fetchUsersData(comments[i].creator, false)
                } else {
                    // the user matched
                    comments[i].user = user
                }
            }
            // update the comments
            setComments(comments)
        }

        // if the postId is different from that we already have, only then make a query to the firebase otherwise don't
            // this is just to make sure we don't make extra calls/queries
        if (props.route.params.postId !== postId) {
            firebase.firestore()
                .collection('posts')
                .doc(props.route.params.uid)
                .collection('userPosts')
                .doc(props.route.params.postId)
                .collection('comments')
                .get()
                // after getting all the comments
                .then((snapshot) => {
                    let comments = snapshot.docs.map(doc => {
                        // here data contains the text and the creator of the comment
                        const data = doc.data();
                        // id will be the id of the comments
                        const id = doc.id;
                        // now inserting the data and id to the comments collection/list
                            // the following thing says, put the commentId first, then spread the data obj which is the text and creator of the comment
                        return { id, ...data }
                    })
                    matchUserToComment(comments)
                })
                // now update the state of postId
            setPostId(props.route.params.postId)
        } else {
            matchUserToComment(comments)
        }
        // re-run the useEffect whenever the postId or user changes
    }, [props.route.params.postId, props.users])

    // this function will be triggered whenver the user taps the send button below the comment textInput
        // it is adding the comment to the comments collection
    const onCommentSend = () => {
        firebase.firestore()
            .collection('posts')
            .doc(props.route.params.uid)
            .collection('userPosts')
            .doc(props.route.params.postId)
            .collection('comments')
            // adding the comment to the comments collection
            .add({
                // add an object containing the id of the user commenting and text he typed
                creator: firebase.auth().currentUser.uid,
                text
            })
    }

    return (
        <View>
            <FlatList
                numColumns={1}
                horizontal={false}
                data={comments}
                renderItem={({ item }) => (
                    <View>
                        {/* if we have the user */}
                        {item.user !== undefined ?
                            <Text>
                                {item.user.name}
                            </Text>
                            : null}
                        <Text>{item.text}</Text>
                    </View>
                )}
            />
            {/* a container containing the textInput for user to type the comment text and a button to send the comment */}
            <View>
                <TextInput
                    placeholder='comment...'
                    // whenever the text changes
                    onChangeText={(text) => setText(text)} />
                <Button
                    // the function is declared up top
                    onPress={() => onCommentSend()}
                    title="Send"
                />
            </View>

        </View>
    )
}


const mapStateToProps = (store) => ({
    users: store.usersState.users
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUsersData }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Comment);