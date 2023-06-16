import { FC,useState } from "react";
import { View,Text,Button,TextInput,TextInputProps } from 'react-native'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { collection,addDoc } from "firebase/firestore";
import {db} from '../firebase'

interface InputProps extends TextInputProps {
    name:string
}

const Register:FC<InputProps> = ({name}) => {

    interface IState {
        firstName:string,
        lastName:string,
        email:string,
        password:string,
        repeatPassword:string
    }

    const [userDetails,setUserDetails] = useState<IState>({firstName:'',lastName:'',email:'',password:'',repeatPassword:''})

    // const [errorMessages,setErrorMessages] = useState<IState>({firstName:'',lastName:'',email:'',password:'',repeatPassword:''})

    const [errorMessages,setErrorMessages] = useState<Record<string,string>>({})

    const handleChange = (name:string,value:string) => {
        setUserDetails({...userDetails,[name]:value})
        setErrorMessages({...errorMessages,[name]:''})  
    }

    const validateForm = () => {
        let isValid = true
        const error:Record<string,string> = {}

        if(userDetails.firstName.trim() === '') {
            error.firstName = 'First Name is required'
            isValid = false
        }
        if(userDetails.lastName.trim() === '') {
            error.lastName = 'Last Name is required'
            isValid = false
        }
        if(userDetails.email.trim() === '') {
            error.email = 'Email is required'
            isValid = false
        }
        if(userDetails.password.trim() === '') {
            error.password = 'Password is required'
            isValid = false
        }
        if(userDetails.repeatPassword.trim() === '') {
            error.repeatPassword = 'Repeat Password is required'
            isValid = false
        }
        if(userDetails.password !== userDetails.repeatPassword) {
            error.repeatPassword = 'Passwords do not match'
            isValid = false
        }

        setErrorMessages(error)
        return isValid
    }

    const handleSubmit = (e:any) => {
        e.preventDefault()
        if(validateForm()) {
            createUserWithEmailAndPassword(auth,userDetails.email,userDetails.password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                const docRef = addDoc(collection(db, "users"), {
                    userId: user.uid,
                    firstName: userDetails.firstName,
                    lastName: userDetails.lastName,
                    email: userDetails.email
                })
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ..
            })
        }
    }

    return (
        <View>
            <TextInput 
                placeholder="First Name"
                value={userDetails.firstName}
                onChangeText={(text) => handleChange('firstName',text)}
            />
            {errorMessages.firstName ? <Text style={{ color: 'red' }}>{errorMessages.firstName}</Text> : null}
            <TextInput
                placeholder="Last Name"
                value={userDetails.lastName}
                onChangeText={(text) => handleChange('lastName',text)}
            />
            <TextInput
                placeholder="Email"
                value={userDetails.email}
                onChangeText={(text) => handleChange('email',text)}
            />
            <TextInput
                placeholder="Password"
                value={userDetails.password}
                onChangeText={(text) => handleChange('password',text)}
            />
            <TextInput
                placeholder="Please re-enter your password"
                value={userDetails.repeatPassword}
                onChangeText={(text) => handleChange('repeatPassword',text)}
            />
            <Button title="Submit" onPress={handleSubmit} ></Button>
        </View>
    )
}

 
export default Register;