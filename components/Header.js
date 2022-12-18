import { StyleSheet,View,Text,Image } from "react-native";


const Header = () => {
    return (
        <View style = {styles.headerContainer}>
            <Image style = {styles.image} source = {require('../assets/Gig_Fort_Logo_Full.png')}/>
        </View>
    )
}

const styles = StyleSheet.create({
    image:{
        height:40,
        width:90
    },
    headerContainer: {
        backgroundColor:'blue'
    }
})
 
export default Header;