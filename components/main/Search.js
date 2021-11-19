import React, { useState } from 'react'
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native'

import firebase from 'firebase';
require('firebase/firestore');

export default function Search(props) {
    const [users, setUsers] = useState([])

    // fetchUsers will fetch all the users from database
    // based on the search (the parameter that we have passed), the search string that the user will write
    const fetchUsers = (search) => {
        firebase.firestore()
            .collection('users')
            // matching user's search string with the name present on database inside the users collection
            .where('name', '>=', search)
            .get()
            // do the following after getting the matched users
            .then((snapshot) => {
                let users = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                });
                // now update the state with the matched users
                setUsers(users);
            })
    }
    return (
        <View>
            
            {/* TextInput on top of the SearchScreen */}
            <TextInput
                placeholder="Type Here..."
                onChangeText={(search) => fetchUsers(search)} />

            {/* list of the users */}
            <FlatList
                numColumns={1}
                horizontal={false}
                data={users}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        // pressing a user's name will navigate us to that user's profile
                        onPress={() => props.navigation.navigate("Profile", {uid: item.id})}>
                        <Text>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}