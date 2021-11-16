// we created this component as class-component because it will contain state
// funtions are statless while components are stateful
import React, { Component } from 'react'
import {Button, TextInput, View} from 'react-native'
import firebase from 'firebase'
export class Register extends Component {

    // to initialize the component. first function that will run
    constructor(props){
        super(props)

        this.state={
            email:'',
            password: '',
            name:''
        }
        // binding this in order to access it
        this.onSignUp=this.onSignUp.bind(this)
    }

    // creating user
    onSignUp(){
        const {email,password,name}=this.state;
        firebase.auth().createUserWithEmailAndPassword(email,password)
        .then((result)=>{
            firebase.firestore().collection("users")
                .doc(firebase.auth().currentUser.uid)
                .set({
                    name,email
                })
        })
        .catch(error=>console.log(error))
    }


    render() {
        return (
            <View>
                <TextInput 
                    placeholder='name' 
                    onChangeText={(name)=>this.setState({name})}
                />
                <TextInput 
                    placeholder='email' 
                    onChangeText={(email)=>this.setState({email})}
                />
                <TextInput 
                placeholder='password' 
                secureTextEntry={true}
                onChangeText={(password)=>this.setState({password})}
            />
            <Button title="Sign Up" onPress={()=>this.onSignUp()} />
            </View>
        )
    }
    
}

export default Register
