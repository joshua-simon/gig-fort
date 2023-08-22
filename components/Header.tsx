import { FC, useContext, useEffect,useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity,Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../routes/homeStack";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthContext } from "../AuthContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { Picker } from "@react-native-picker/picker";
import { useLocation } from "../LocationContext";


const Header: FC = (): JSX.Element => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, "Map">>();
  const [userFirstName, setUserFirstName] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const { selectedLocation, setSelectedLocation } = useLocation();


  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  //Fetches current user detail login status (ie are they logged in or not) from global state. 
  //Note: global state is managed using React Context
  const { user } = useContext(AuthContext);

  //Fetches user information (in this case, their first name) from firebase, using method called 'onSnapshot'. This method
  //'listens' to changes in the firestore database. If the first name data changes, then the UI is immediately updated. 
  useEffect(() => {
    if (user) {
      const userRef = doc(db, 'users', user?.uid);
      const unsubscribeUser = onSnapshot(userRef, (userSnapshot) => {
      const userData = userSnapshot.data();
        
        if (userData) {
          setUserFirstName(userSnapshot.data().firstName || []);
        }
      });
  
      return () => {
        unsubscribeUser();
      };
    }
}, [user]);


  //This logic determines what is shown on the header. If the user is logged in, then user evalutes to true.
  //When user = true, a link to the user's profile is shown.
  //When user = false, the login/register buttons are shown.
  const content = user ? (
    <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
      <View style={styles.profile}>
        <Ionicons name="ios-person-outline" size={24} color="white" />
        <Text style={styles.firstName}>{userFirstName}</Text>
      </View>
    </TouchableOpacity>
  ) : (

    <View style = {styles.headerContainer}>
      <View>
        <TouchableOpacity style = {styles.selectLocation} onPress = {toggleModal}>
          <Text style = {styles.selectLocation_text}>Select location</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.buttonText_register}>Sign up</Text>
        </TouchableOpacity>
      </View>

      <Modal
      visible={modalVisible}
      animationType="slide"
      onRequestClose={toggleModal}
    >
      <View style={styles.modalContainer}>
        <View style={{ backgroundColor: "white", padding: 20 }}>
          <Text style={styles.modalHeader}>
            Please select your location
          </Text>
          <Picker
            selectedValue={selectedLocation}
            onValueChange={(itemValue) => setSelectedLocation(itemValue)}
          >
            <Picker.Item label="Auckland" value="Auckland" />
            <Picker.Item label="Wellington" value="Wellington" />
          </Picker>
          <TouchableOpacity style={styles.returnButton} onPress={toggleModal}>
            <Text style={styles.modalButtonText}>Return</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>

    </View>

  );


  return (
    <View style={styles.container}>
        {content}
    </View>
  );
};


const styles = StyleSheet.create({
  button: {
    flexDirection: "column",
    width: 45,
    height: 25,
    marginRight: 10,
    backgroundColor: "white",
    borderRadius: 8,
    justifyContent: "center",
  },
  buttonText: {
    color: "#377D8A",
    textAlign: "center",
    fontFamily: "NunitoSans",
    fontSize: 12,
    lineHeight: 22,
  },
  buttonText_register: {
    color: "#FFFFFF",
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
    color:'white'
  },
  profile: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    width: "100%",
    paddingBottom:'5%'
  },
  headerContainer:{
    flexDirection:'row',
    alignItems:'center',
    width:'100%',
    justifyContent:'space-between',
  },
  selectLocation:{
    borderWidth:1,
    borderColor:"#FFFFFF",
    borderRadius:8
  },
  selectLocation_text:{
    color: "#FFFFFF",
    fontFamily: "NunitoSans",
    fontSize: 12,
    lineHeight: 22,
    textAlign:'center',
    padding:'1%',
  },
  modalContainer: {
    flex: 1, 
    alignItems: "center",
    justifyContent: "center"
  },
  modalHeader: {
    fontFamily: "NunitoSans",
    fontSize: 20,
    marginBottom: 10
  },
  returnButton: {
    backgroundColor:'#377D8A',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 10,
  },
  modalButtonText:{
    color:'#FFFFFF',
    textAlign:'center',
    fontFamily: 'NunitoSans',
    fontSize: 16,   
  }
});

export default Header;
