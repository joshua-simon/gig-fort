import { FC,useState } from "react";
import { View,Text,TextInput,Button,TouchableOpacity,Modal,StyleSheet,ActivityIndicator } from 'react-native'
import { auth } from "../firebase";
import { signInWithEmailAndPassword,sendPasswordResetEmail } from "firebase/auth";
import { loginProps } from "../routes/homeStack";
import { buttonFilled, buttonFilled_text,buttonTextOnly,buttonTextOnly_text } from "../styles";
import { set } from "date-fns";

type LoginScreenNavgationProp = loginProps['navigation']

interface Props {
    navigation: LoginScreenNavgationProp
}


const Login:FC<Props> = ({ navigation }) => {

    const [ loginDetails, setLoginDetails ] = useState({email:'',password:''})
    const [errorMessages,setErrorMessages] = useState<Record<string,string>>({})
    const [modalVisible, setModalVisible] = useState(false);
    const [ resetEmail,setResetEmail ] = useState('')
    const [loading, setLoading] = useState<boolean>(false);

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
          setLoading(true);
            signInWithEmailAndPassword(auth,loginDetails.email,loginDetails.password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                setLoading(false);
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
                setLoading(false)
            });
        }
    }

    const toggleModal = () => {
        setModalVisible(!modalVisible);
      };

    const sendPasswordEmail = () => {
        if(resetEmail.trim() === '') {
            alert('Email is required')
            return
        } else {
            sendPasswordResetEmail(auth, resetEmail)
            .then(() => {
                alert('Email sent')
                toggleModal() 
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorMessage)
            })
        }
    }

    const handleEmailChange = (text:string) => {
        setResetEmail(text)
    }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput 
        style={styles.input}
        placeholder="Enter your email"
        keyboardType="email-address"
        value={loginDetails.email}
        onChangeText={(text) => handleChange('email',text)}
      />
      {errorMessages.email ? <Text style={{ color: 'red' }}>{errorMessages.email}</Text> : null}

      <Text style={styles.label}>Password</Text>
      <TextInput 
        style={styles.input}
        placeholder="Enter your password"
        secureTextEntry={true}
        value={loginDetails.password}
        onChangeText={(text) => handleChange('password',text)}
      />
    {errorMessages.password ? <Text style={{ color: 'red' }}>{errorMessages.password}</Text> : null}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
      {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Submit</Text>
          )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.forgotButton} onPress = {toggleModal}>
        <Text style={styles.forgotButtonText}>Forgot Password</Text>
      </TouchableOpacity>

      <Modal
          visible={modalVisible}
          animationType="slide"
          onRequestClose={toggleModal}
        >
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <View style={{ backgroundColor: "white",alignItems:'center' }}>
            <TextInput
                placeholder="Enter email address"
                onChangeText={(text) => handleEmailChange(text)}
                style = {{borderColor: '#ddd',padding:'2%',borderWidth:1,marginBottom:'10%',borderRadius:4}}
            />
              <TouchableOpacity  onPress = {sendPasswordEmail} style = {buttonFilled}>
                <Text style = {buttonFilled_text}>Send a password reset email to my email address</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleModal} style = {buttonTextOnly}>
                  <Text style = {buttonTextOnly_text}>Return to Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F7F6F5',
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
    fontFamily: 'NunitoSans'
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
    padding: 10,
    borderRadius: 4,
    fontFamily: 'LatoRegular'
  },
  submitButton: {
    backgroundColor:'#377D8A',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 10,
  },
  forgotButton: {
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color:'#FFFFFF',
    textAlign:'center',
    fontFamily: 'NunitoSans',
    fontSize:16,
    lineHeight:22
  },
  forgotButtonText: {
    color:'#377D8A',
    fontFamily: 'NunitoSans',   
  }
});

export default Login;
