import { FC, useContext, useEffect,useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../routes/homeStack";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthContext } from "../AuthContext";
import { useGetUser } from "../hooks/useGetUser";


const Header: FC = (): JSX.Element => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, "Map">>();


  const { user } = useContext(AuthContext);
  const userDetails = useGetUser(user?.uid);
  const { firstName } = userDetails || {};



  const content = user && userDetails ? (

    <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
      <View style = {styles.profile}>
        <Ionicons name="ios-person-outline" size={24} color="white" />
        <Text style = {styles.firstName}>{firstName}</Text>
      </View>
    </TouchableOpacity>

  ) : (

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

  )


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
  },
});

export default Header;
