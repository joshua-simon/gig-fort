import { FC, useContext,useState } from "react";
import {View,Text,Modal} from 'react-native'
import { useGigs } from "../hooks/useGigs";
import { AuthContext } from "../AuthContext";
import { useGetUser } from "../hooks/useGetUser";
import { Button } from "react-native";

const Profile:FC = () => {
    const [modalVisible, setModalVisible] = useState(false);

    const gigs = useGigs()

    const { user } = useContext(AuthContext)

    const userDetails = useGetUser(user.uid)

    const gigIDs = userDetails.likedGigs

    const test = gigs.filter(gig => gigIDs?.includes(gig.id))

    const toggleModal = () => {
        setModalVisible(!modalVisible);
      };

    return (
        <View>
            <Text>This is the profile screen</Text>
            {test.map(gig => <Text key = {gig.id}>{gig.gigName}</Text>)}

            <View>
                <Button title = 'Logout' onPress = {toggleModal}/>
                <Button title = 'Edit details' onPress = {() => console.log('Edit details')}/>
                <Button title = 'Delete account' onPress = {() => console.log('Delete account')}/>
            </View>

            
            <Modal
                visible = {modalVisible}
                animationType ="slide"
                onRequestClose = {toggleModal}
            >
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 20 }}>
            <Text>This is the modal content</Text>
            <Button title="Close Modal" onPress={toggleModal} />
          </View>
        </View>
            </Modal>

        </View>
    )
}
 
export default Profile;