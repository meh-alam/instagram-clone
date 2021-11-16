// we created this component as class-component because it will contain state
// funtions are statless while components are stateful
import React, { Component } from 'react'
import {Button, TextInput, View} from 'react-native'
import firebase from 'firebase'


export class Login extends Component {
    // to initialize the component. first function that will run
    constructor(props){
        super(props)

        this.state={
            email:'',
            password: '',
        }
        // binding this in order to access it
        this.onSignUp=this.onSignUp.bind(this)
    }

    onSignUp(){
        const {email,password}=this.state;
        firebase.auth().signInWithEmailAndPassword(email,password)
        .then((result)=>console.log(result))
        .catch(error=>console.log(error))
    }

    render() {
        return (
            <View>
                <TextInput 
                    placeholder='email' 
                    onChangeText={(email)=>this.setState({email})}
                />
                <TextInput 
                placeholder='password' 
                secureTextEntry={true}
                onChangeText={(password)=>this.setState({password})}
            />
            <Button title="Sign In" onPress={()=>this.onSignUp()} />
            </View>
        )
    }
    
}

export default Login
