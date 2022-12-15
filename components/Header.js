import { StyleSheet,View,Text,Image } from "react-native";


const Header = () => {
    return (
        <View style = {styles.headerContainer}>
            <Image style = {styles.image} source = {require('../assets/Icon_Gold_48x48.png')}/>
        </View>
    )
}

const styles = StyleSheet.create({
    image:{
        height:40,
        width:40
    }
})
 
export default Header;