import { FC,useState } from "react";
import { View,Text,TextInput,TextInputProps } from 'react-native'

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

    const handleChange = (key: keyof IState, value:string) => {

    }

    return (
        <View>
            <Text>Create an account with Gig Fort</Text>
            <View>
                <Text>Enter first name</Text>
                <TextInput
                    onChangeText={(value) => handleChange('firstName',value)}
                />
            </View>
            <View>
                <Text>Enter last name</Text>
                <TextInput
                    onChangeText={handleChange}
                />
            </View>
            <View>
                <Text>Enter email address</Text>
                <TextInput
                    onChangeText={handleChange}
                />
            </View>
            <View>
                <Text>Enter email address</Text>
                <TextInput
                    onChangeText={handleChange}
                />
            </View>
        </View>
    )
}
 
export default Register;