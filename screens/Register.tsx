import { FC,useState } from "react";
import { View,Text,TextInput,TextInputProps,TouchableOpacity, StyleSheet,ScrollView } from 'react-native'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { collection,setDoc,doc } from "firebase/firestore";
import {db} from '../firebase'
import { registerProps } from "../routes/homeStack";

type RegisterNavigationProp = registerProps['navigation']

interface InputProps extends TextInputProps {
    name:string,
    navigation:RegisterNavigationProp
}

interface IState {
    firstName:string,
    lastName:string,
    email:string,
    password:string,
    repeatPassword:string
}

const Register:FC<InputProps> = ({name,navigation}) => {

    const [userDetails,setUserDetails] = useState<IState>({firstName:'',lastName:'',email:'',password:'',repeatPassword:''})
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
                setDoc(doc(db, "users", user.uid), {
                    userId: user.uid,
                    firstName: userDetails.firstName,
                    lastName: userDetails.lastName,
                    email: userDetails.email,
                    likedGigs: [],
                })
                navigation.replace('RegistrationSuccess')
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
    <ScrollView>
    <View style={styles.container}>
      <Text style={styles.title}>Sign up for Gig Fort</Text>

      <Text style={styles.label}>Enter first name</Text>
      <TextInput 
        style={styles.input}
        placeholder="First Name"
        value={userDetails.firstName}
        onChangeText={(text) => handleChange('firstName',text)}
      />
    {errorMessages.firstName ? <Text style={{ color: 'red' }}>{errorMessages.firstName}</Text> : null}      

      <Text style={styles.label}>Enter last name</Text>
      <TextInput 
        style={styles.input}
        placeholder="Last Name"
        value={userDetails.lastName}
        onChangeText={(text) => handleChange('lastName',text)}
      />
    {errorMessages.lastName ? <Text style={{ color: 'red' }}>{errorMessages.lastName}</Text> : null}

<Text style={styles.label}>Enter email</Text>
      <TextInput 
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={userDetails.email}
        onChangeText={(text) => handleChange('email',text)}
      />
    {errorMessages.email ? <Text style={{ color: 'red' }}>{errorMessages.email}</Text> : null}

<Text style={styles.label}>Enter password</Text>
      <TextInput 
        style={styles.input}
        placeholder="Password"
        value={userDetails.password}
        secureTextEntry={true}
        onChangeText={(text) => handleChange('password',text)}
      />
    {errorMessages.password ? <Text style={{ color: 'red' }}>{errorMessages.password}</Text> : null}

<Text style={styles.label}>Please re-enter your password</Text>
      <TextInput 
        style={styles.input}
        secureTextEntry={true}
        placeholder="Re-enter your password"
        value={userDetails.repeatPassword}
        onChangeText={(text) => handleChange('repeatPassword',text)}
      />
    {errorMessages.repeatPassword ? <Text style={{ color: 'red' }}>{errorMessages.repeatPassword}</Text> : null}
      
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} >
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'NunitoSans',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    fontFamily: 'NunitoSans',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
    padding: 10,
    borderRadius: 4,
    fontFamily: 'LatoRegular',
  },
  submitButton: {
    backgroundColor:'#377D8A',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color:'#FFFFFF',
    textAlign:'center',
    fontFamily: 'NunitoSans',
    fontSize:16,
    lineHeight:22
  },
});

export default Register;
