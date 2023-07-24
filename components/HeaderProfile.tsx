import { FC, useContext,useState } from "react";
import { StyleSheet, View, Text, Button, Modal,TouchableOpacity, ActivityIndicator } from "react-native";
import { Feather } from '@expo/vector-icons'; 
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../routes/homeStack";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthContext } from "../AuthContext";
import { useGetUser } from "../hooks/useGetUser";
import { Menu,MenuOptions,MenuOption, MenuTrigger} from 'react-native-popup-menu';
import { auth } from "../firebase";
import { signOut, deleteUser } from "firebase/auth";
import { buttonFilled,buttonFilled_text,buttonTextOnly,buttonTextOnly_text } from "../styles";


const HeaderProfile: FC = (): JSX.Element => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, "Map">>();
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteUserModalVisible, setdeleteUserModalVisible] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);


  const { user } = useContext(AuthContext);

  const userDetails = useGetUser(user?.uid)

  const { firstName, lastName, email } = userDetails || {};

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const toggleDeleteUserModal = () => {
    setdeleteUserModalVisible(!deleteUserModalVisible);
  };

  const showPopup = () => {
    setPopupVisible(true);

    // Hide the popup after 2 seconds
    setTimeout(() => {
      setPopupVisible(false);
    }, 3000);
  };

  const signUserOut = () => {
    setLoading(true); 
    signOut(auth)
      .then(() => {
        navigation.navigate("Map");
        showPopup();
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      })
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

  const notificationPopup = isPopupVisible ? (
    <Text style = {styles.reminderPopup}>Reminder notification set for one hour before gig</Text>
  ) : null

  return (
    <View style={styles.container}>
      {notificationPopup}
      <Menu>
        <MenuTrigger>
          <Feather name="settings" size={24} color="white" />
        </MenuTrigger>
        <MenuOptions
          customStyles={{ optionsContainer: { padding: 5, borderRadius: 10 } }}
        >
          <MenuOption onSelect={toggleModal}>
            <Text style={styles.menuOption}>Log out</Text>
          </MenuOption>
          <MenuOption
            onSelect={() => {
              navigation.navigate("EditDetails", {
                firstName,
                lastName,
                UID: user?.uid,
              });
            }}
          >
            <Text style={styles.menuOption}>Edit details</Text>
          </MenuOption>
          <MenuOption onSelect={toggleDeleteUserModal}>
            <Text style={styles.menuOption}>Delete account</Text>
          </MenuOption>
          <MenuOption onSelect={() => navigation.navigate('About')}>
            <Text style={styles.menuOption}>App information</Text>
          </MenuOption>
        </MenuOptions>
      </Menu>

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={{ backgroundColor: "white", padding: 20 }}>
            <Text style={styles.modalHeader}>
              Are you sure you want to log out?
            </Text>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={signUserOut}
            >
              {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Log out</Text>
          )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.returnToProfileButton} onPress={toggleModal}>
              <Text style={styles.returnToProfileText}>Return to profile</Text>
            </TouchableOpacity>
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
            <Text style={styles.modalHeader}>Are you sure you want to delete your account?</Text>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={deleteUserAccount}
            >
              <Text style={styles.buttonText}>Delete account</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.returnToProfileButton} onPress={toggleDeleteUserModal}>
              <Text style={styles.returnToProfileText}>Return to profile</Text>
            </TouchableOpacity>
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
  buttonText: buttonFilled_text,
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
    fontSize: 16,
    padding:5
  },
  modalContainer: {
    flex: 1, 
    alignItems: "center",
     justifyContent: "center"
  },
  modalHeader: {
    fontFamily: "NunitoSans",
    fontSize:20,
    marginBottom:10
  },
  reminderPopup: {
    position:'absolute',
    left:'20%', 
    color:"white", 
    backgroundColor:"rgba(0,0,0,1)",
    fontFamily:'LatoRegular',
    fontSize:14,
    padding:'3%',
    borderRadius:8
  },
  submitButton: buttonFilled,
  returnToProfileButton: buttonTextOnly,
  returnToProfileText: buttonTextOnly_text
    
});

export default HeaderProfile;