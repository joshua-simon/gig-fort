import { FC, useContext } from "react";
import { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Feather } from '@expo/vector-icons'; 
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../routes/homeStack";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthContext } from "../AuthContext";
import { useGetUser } from "../hooks/useGetUser";


const HeaderProfile: FC = (): JSX.Element => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, "Map">>();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const { user } = useContext(AuthContext);

  const userDetails = useGetUser(user?.uid)


  return (
    <View style={styles.container}>
        <TouchableOpacity onPress = {() => setDropdownVisible(!dropdownVisible)}>
            <Feather name="settings" size={24} color="black" />
        </TouchableOpacity>
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
});

export default HeaderProfile;
