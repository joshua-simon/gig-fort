import { StyleSheet,View,Text,TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

const MapGigDetails = ({ venue,gigName,navigation }) => {
    const shortenedGigName = gigName?.substring(0,20)
    return (
        <TouchableOpacity style = {styles.container} onPress = {() => navigation.navigate("GigDetails", {venue,gigName})}>
            <View style = {styles.details}>
                <Text style = {styles.header}>{shortenedGigName}</Text>
                <Text style = {styles.text}>{venue}</Text>
            </View>
                <MaterialCommunityIcons name="gesture-tap" size={24} color="#d3d3d3" />
     </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems: 'center',
        borderWidth:1,
        borderColor:'#d3d3d3',
        borderRadius:5,
        padding:5,
        marginTop:2,
        width:200,
        marginBottom:20
    },
    text: {
        color:'#778899'
    },
    header: {
        fontFamily: 'Helvetica-Neue'
    }
})
 
export default MapGigDetails;
