import { FC, useContext,useState } from "react";
import {View,Text,Modal} from 'react-native'
import { useGigs } from "../hooks/useGigs";
import { AuthContext } from "../AuthContext";
import { useGetUser } from "../hooks/useGetUser";
import { Button } from "react-native";
import { auth } from "../firebase";
import { signOut,deleteUser } from "firebase/auth";
import { profileProps } from "../routes/homeStack";

type ProfileScreenNavigationProp = profileProps['navigation']

interface Props {
    navigation: ProfileScreenNavigationProp
}

const Profile:FC<Props> = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [deleteUserModalVisible, setdeleteUserModalVisible] = useState(false);

    const gigs = useGigs()

    const { user } = useContext(AuthContext)

    const userDetails = useGetUser(user?.uid)

    const gigIDs = userDetails?.likedGigs

    const test = gigs.filter(gig => gigIDs?.includes(gig.id))

    const toggleModal = () => {
        setModalVisible(!modalVisible);
      };
    
    const toggleDeleteUserModal = () => {
        setdeleteUserModalVisible(!deleteUserModalVisible);
        };
    
    
      const signUserOut = () => {
        signOut(auth).then(() => {
            console.log("User signed out")
            navigation.navigate('Map')
        }).catch((error) => {
            console.log(error)
        })
      }

      const deleteUserAccount = () => {
        deleteUser(auth.currentUser).then(() => {
            console.log("User deleted")
            navigation.navigate('Map')
        }).catch((err) => {
            console.log(err)
        })
    }

    return (
      <View>
        <Text>This is the profile screen</Text>
        {test.map((gig) => (
          <Text key={gig.id}>{gig.gigName}</Text>
        ))}

        <View>
          <Button title="Logout" onPress={toggleModal} />
          <Button
            title="Edit details"
            onPress={() => console.log("Edit details")}
          />
          <Button
            title="Delete account"
            onPress={toggleDeleteUserModal}
          />
        </View>

        <Modal
          visible={modalVisible}
          animationType="slide"
          onRequestClose={toggleModal}
        >
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <View style={{ backgroundColor: "white", padding: 20 }}>
              <Text>Are you sure you want to log out?</Text>
              <Button title="Log out" onPress={signUserOut} />
              <Button title="Return to profile" onPress={toggleModal} />
            </View>
          </View>
        </Modal>

        <Modal
            visible={deleteUserModalVisible}
            animationType="slide"
            onRequestClose={toggleDeleteUserModal}
        >
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <View style={{ backgroundColor: "white", padding: 20 }}>
              <Text>Are you sure you want to delete your account?</Text>
              <Button title="Delete account" onPress={deleteUserAccount} />
              <Button title="Return to profile" onPress={toggleDeleteUserModal} />
            </View>
          </View>
        </Modal>

      </View>
    );
}
 
export default Profile;