import { FC,useState } from "react";
import { View,Text,TextInput,Button } from 'react-native'
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { loginProps } from "../routes/homeStack";

type LoginScreenNavgationProp = loginProps['navigation']

interface Props {
    navigation: LoginScreenNavgationProp
}


const Login:FC<Props> = ({ navigation }) => {

    const [ loginDetails, setLoginDetails ] = useState({email:'',password:''})
    const [errorMessages,setErrorMessages] = useState<Record<string,string>>({})

    const handleChange = (field:string,text:string) => {
        setLoginDetails({...loginDetails,[field]:text})
        setErrorMessages({...errorMessages,[field]:''})  
    }

    const validateForm = () => {
        let isValid = true
        const error:Record<string,string> = {}

        if(loginDetails.email.trim() === '') {
            error.email = 'Email is required'
            isValid = false
        }
        if(loginDetails.password.trim() === '') {
            error.password = 'Password is required'
            isValid = false
        }    
        setErrorMessages(error)
        return isValid
    }


    const handleSubmit = () => {
        if(validateForm()) {
            signInWithEmailAndPassword(auth,loginDetails.email,loginDetails.password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                navigation.replace('Profile')
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                const updatedErrorMessages = { ...errorMessages };

                switch (errorCode) {
                    case "auth/invalid-email":
                        updatedErrorMessages.email = "Invalid email";
                        break;
                    case "auth/user-disabled":
                        updatedErrorMessages.email = "User disabled";
                        break;
                    case "auth/user-not-found":
                        updatedErrorMessages.email = "User not found";
                        break;
                    case "auth/wrong-password":
                        updatedErrorMessages.password = "Wrong password";
                        break;
                    default:
                        break;
                }
                setErrorMessages(updatedErrorMessages);
            });
        }
    }

    return (
        <View>
            <Text>Login</Text>
            <TextInput
                placeholder="Email"
                value={loginDetails.email}
                onChangeText={(text) => handleChange('email',text)}
            />
            {errorMessages.email ? <Text style={{ color: 'red' }}>{errorMessages.email}</Text> : null}
            <TextInput
                placeholder="Password"
                value={loginDetails.password}
                onChangeText={(text) => handleChange('password',text)}
            />
            {errorMessages.password ? <Text style={{ color: 'red' }}>{errorMessages.password}</Text> : null}
        <Button title="Submit" onPress={handleSubmit} ></Button>
        </View>
    )
}
 
export default Login;