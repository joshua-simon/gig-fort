import { FC,useState } from "react";
import { View,Text,Button,TextInput,TextInputProps } from 'react-native'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { collection,addDoc } from "firebase/firestore";
import {db} from '../firebase'
import { registerProps } from "../routes/homeStack";

type RegisterNavigationProp = registerProps['navigation']

interface InputProps extends TextInputProps {
    name:string,
    navigation:RegisterNavigationProp
}



const Register:FC<InputProps> = ({name,navigation}) => {

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
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!emailRegex.test(userDetails.email)) {
                error.email = 'Email is invalid'
                isValid = false
            }
        }
        if(userDetails.password.trim() === '') {
            error.password = 'Password is required'
            isValid = false
        } else {
            const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
            if(!passwordRegex.test(userDetails.password)) {
                error.password = 'Password must be at least 8 characters long and contain at least one number, one uppercase letter, and one lowercase letter';
                isValid = false
            }
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
                navigation.navigate('RegistrationSuccess')
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                const updatedErrorMessages = { ...errorMessages };

                switch (errorCode) {
                  case "auth/email-already-in-use":
                    updatedErrorMessages.email = "Email is already in use";
                    break;
                  case "auth/invalid-email":
                    updatedErrorMessages.email = "Invalid email";
                    break;
                  case "auth/weak-password":
                    updatedErrorMessages.password = "Weak password";
                    break;
                  default:
                    // Handle other Firebase errors as needed
                    break;
                }
        
                setErrorMessages(updatedErrorMessages);
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
            {errorMessages.lastName ? <Text style={{ color: 'red' }}>{errorMessages.lastName}</Text> : null}
            <TextInput
                placeholder="Email"
                value={userDetails.email}
                onChangeText={(text) => handleChange('email',text)}
            />
            {errorMessages.email ? <Text style={{ color: 'red' }}>{errorMessages.email}</Text> : null}
            <TextInput
                placeholder="Password"
                value={userDetails.password}
                onChangeText={(text) => handleChange('password',text)}
            />
            {errorMessages.password ? <Text style={{ color: 'red' }}>{errorMessages.password}</Text> : null}
            <TextInput
                placeholder="Please re-enter your password"
                value={userDetails.repeatPassword}
                onChangeText={(text) => handleChange('repeatPassword',text)}
            />
            {errorMessages.repeatPassword ? <Text style={{ color: 'red' }}>{errorMessages.repeatPassword}</Text> : null}
            <Button title="Submit" onPress={handleSubmit} ></Button>
        </View>
    )
}

 
export default Register;