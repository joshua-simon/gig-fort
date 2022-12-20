import { StyleSheet,View,Text,Image } from "react-native";


const Header = () => {
    return (
        <View style = {styles.headerContainer}>
            <Image style = {styles.image} source = {require('../assets/Gig_Fort_Logo_Large_Gold.png')}/>
        </View>
    )
}

const styles = StyleSheet.create({
    image:{
        height:45,
        width:100
    },
    headerContainer: {
        backgroundColor:'blue'
    }
})
 
export default Header;