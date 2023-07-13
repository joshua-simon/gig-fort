import { FC, useContext,useState } from "react";
import { StyleSheet, View, Text, Button, Modal } from "react-native";
import { Feather } from '@expo/vector-icons'; 
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../routes/homeStack";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthContext } from "../AuthContext";
import { useGetUser } from "../hooks/useGetUser";
import { Menu,MenuOptions,MenuOption, MenuTrigger} from 'react-native-popup-menu';
import { auth } from "../firebase";
import { signOut, deleteUser } from "firebase/auth";


const HeaderProfile: FC = (): JSX.Element => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, "Map">>();
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteUserModalVisible, setdeleteUserModalVisible] = useState(false);


  const { user } = useContext(AuthContext);

  const userDetails = useGetUser(user?.uid)

  const { firstName, lastName, email } = userDetails || {};

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const toggleDeleteUserModal = () => {
    setdeleteUserModalVisible(!deleteUserModalVisible);
  };

  const signUserOut = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out");
        navigation.navigate("Map");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteUserAccount = () => {
    deleteUser(auth.currentUser)
      .then(() => {
        console.log("User deleted");
        navigation.navigate("Map");
      })
      .catch((err) => {
        console.log(err);
      });
  };


  return (
    <View style={styles.container}>

    <Menu>
      <MenuTrigger>
          <Feather name="settings" size={24} color="black" />
      </MenuTrigger>
      <MenuOptions customStyles={{optionsContainer:{padding:5,borderRadius:10}}}>
        <MenuOption onSelect={toggleModal}>
          <Text style = {styles.menuOption}>Log out</Text>
        </MenuOption>
        <MenuOption onSelect={() => {
            navigation.navigate("EditDetails", {
              firstName,
              lastName,
              UID: user?.uid,
            })}}>
              <Text style ={styles.menuOption}>Edit details</Text>
            </MenuOption>
        <MenuOption onSelect= {toggleDeleteUserModal}>
          <Text style = {styles.menuOption}>Delete account</Text>
        </MenuOption>
      </MenuOptions>
    </Menu>

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
};


const styles = StyleSheet.create({
  button: {
    flexDirection: "column",
    width: 45,
    height: 25,
    marginRight: 10,
    backgroundColor: "#377D8A",
    borderRadius: 8,
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontFamily: "NunitoSans",
    fontSize: 12,
    lineHeight: 22,
  },
  buttonText_register: {
    color: "#377D8A",
    fontFamily: "NunitoSans",
    fontSize: 12,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    width: "100%",
  },
  firstName: {
    fontFamily: "LatoRegular",
  },
  profile: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    width: "100%",
  },
  menuOption: {
    fontFamily: "LatoRegular",
    fontSize: 16
  },
});

export default HeaderProfile;
