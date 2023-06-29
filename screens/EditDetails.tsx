import { FC,useState } from "react";
import { View, Text,TextInput,Button } from "react-native";
import { editDetailsProps } from "../routes/homeStack";
import { doc,updateDoc } from "firebase/firestore";
import { db } from "../firebase";

type EditDetailsScreenProp = editDetailsProps['route']

interface Props {
    route:EditDetailsScreenProp
}

const EditDetails:FC<Props> = ({ route }) => {

    const [ userDetails, setUserDetails ] = useState({updatedFirstName:'',updatedLastName:''})

    const { firstName, lastName, UID } = route.params;

    const handleChange = (name:string,value:string) => {
        setUserDetails({...userDetails,[name]:value})
    }

  const handleSubmit = async () => {
    try {
        const docRef = doc(db, "users", UID);
        await updateDoc(docRef, {
            firstName: userDetails.updatedFirstName,
            lastName: userDetails.updatedLastName
        });
        alert("Document updated successfully");
    } catch (error) {
        alert(error);
    }
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