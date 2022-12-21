import { StyleSheet,View,Text } from "react-native";

const MapGigDetails = ({ venue }) => {
    return (
        <View>
            <Text style = {styles.text}>{venue}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    text: {
        color:'white',
        backgroundColor: 'blue'
    }
})
 
export default MapGigDetails;
