import { FC } from "react";
import { StyleSheet,View,Image } from "react-native";


const Header:FC = (): JSX.Element => {
    return (
        <View>
            <Image style = {styles.image} source = {require('../assets/Gig_Fort_Logo_Large_Gold.png')}/>
        </View>
    )
}

const styles = StyleSheet.create({
    image:{
        height:45,
        width:100
    }
})
 
export default Header;