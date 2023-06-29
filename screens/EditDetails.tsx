import { FC,useState } from "react";
import { View, Text,TextInput,Button } from "react-native";
import { editDetailsProps } from "../routes/homeStack";
import { updateUserDetails } from "../hooks/databaseFunctions";

type EditDetailsScreenProp = editDetailsProps['route']
type EditDetailsNavigationProp = editDetailsProps['navigation']

interface Props {
    route:EditDetailsScreenProp,
    navigation:EditDetailsNavigationProp
}

const EditDetails:FC<Props> = ({ route,navigation }) => {

    const [ userDetails, setUserDetails ] = useState({updatedFirstName:'',updatedLastName:''})

    const { firstName, lastName, UID } = route.params;

    const handleChange = (name:string,value:string) => {
        setUserDetails({...userDetails,[name]:value})
    }

  const handleSubmit = () => {
    updateUserDetails(userDetails.updatedFirstName,userDetails.updatedLastName,UID)
    navigation.navigate('Profile')
}

    return (
        <View>
            <Text>Edit details</Text>
            <TextInput 
                placeholder={firstName}
                value={userDetails.updatedFirstName}
                defaultValue={firstName}
                onChangeText={(text) => handleChange('updatedFirstName',text)}
            />
            <TextInput 
                placeholder={lastName}
                value={userDetails.updatedLastName}
                defaultValue={lastName}
                onChangeText={(text) => handleChange('updatedLastName',text)}
            />
            <Button title = "Submit" onPress={handleSubmit} />
        </View>
    )
}
 
export default EditDetails;