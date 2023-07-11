import { FC } from "react";
import { StyleSheet,View,Text,TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../routes/homeStack";
import { StackNavigationProp } from "@react-navigation/stack";
  

const Header: FC = (): JSX.Element => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Map'>>();

  return (
    <View style = {styles.container}>


    <View style = {styles.section}>
    <View style = {styles.buttonContainer}>
    <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
        style={styles.button}
      >
        <Text style = {styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Register")}
      >
        <Text style = {styles.buttonText_register}>Register</Text>
      </TouchableOpacity>
    </View>
    </View>

    <View style = {styles.section}>
    <TouchableOpacity
        onPress={() => navigation.navigate("Profile")}
      >
        <Ionicons name="ios-person-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>

    </View>
  );
};

const styles = StyleSheet.create({
    button:{
        flexDirection:'column',
        width:45,
        height:25,
        marginRight:10,
        backgroundColor:'#377D8A',
        borderRadius:8,
        justifyContent:'center',
      },
      buttonText: {
        color:'#FFFFFF',
        textAlign:'center',
        fontFamily: 'NunitoSans',
        fontSize:12,
        lineHeight:22
      },
      buttonText_register: {
        color:'#377D8A',
        fontFamily: 'NunitoSans',
        fontSize:12,
        lineHeight:22
      },
    buttonContainer:{
        flexDirection: 'row',
        alignItems: 'center'
    },
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width:'100%',
    },
    section: {
        flexDirection: "row",
        alignItems: "center",
      },
})
 
export default Header;