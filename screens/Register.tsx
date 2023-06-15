import { FC,useState } from "react";
import { View,Text,Button,TextInput,TextInputProps } from 'react-native'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

interface InputProps extends TextInputProps {
    name:string
}

const Register:FC<InputProps> = ({name}) => {

    interface IState {
        firstName:string,
        lastName:string,
        email:string,
        password:string
    }

    const [userDetails,setUserDetails] = useState<IState>({firstName:'',lastName:'',email:'',password:''})

    const handleChange = (name:string,value:string) => {
        setUserDetails({...userDetails,[name]:value})
    }

    const handleSubmit = (e:any) => {
        e.preventDefault()
        createUserWithEmailAndPassword(auth,userDetails.email,userDetails.password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
        })
    }

    return (
        <View>
            <TextInput 
                placeholder="First Name"
                value={userDetails.firstName}
                onChangeText={(text) => handleChange('firstName',text)}
            />
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
            <Button title="Submit" onPress={handleSubmit} ></Button>
        </View>
    )
}

 
export default Register;