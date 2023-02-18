import { StyleSheet,View,TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons';


const Footer = ({ navigation }) => {
  return (
    <View style = {styles.footer}>

        <TouchableOpacity
            onPress = {() => navigation.navigate("Map")}
        >
            <Ionicons name="home-outline" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress = {() => navigation.navigate("About")}
          style={{ marginLeft: 50 }}
        >
          <Ionicons name="information-circle-outline" size={24} color="black"/>
        </TouchableOpacity>

    </View>
  )
};

const styles = StyleSheet.create({
  footer: {
    flexDirection:'row',
    backgroundColor: "#F7F6F5",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderTopColor:'#d3d3d3',
    borderTopWidth:1
  },
  icons:{
    flexDirection:'row',
  }
});
 
export default Footer;