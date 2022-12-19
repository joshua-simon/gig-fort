import { StyleSheet, Text, View,Image } from 'react-native';

const GigDetails = ({ route }) => {
    const { venue,date,gigName,time,image } = route.params

    return ( 
        <View style = {styles.container}>
            <View style = {styles.header}>
                <Image style = {styles.img} source = {{uri:image}}/>
                <Text style = {styles.header_text}>{gigName}</Text>
            </View>
            <View style = {styles.details}>
                <Text style = {styles.details_text}>{venue}</Text>
                <Text style = {styles.details_text}>{date}</Text>
                <Text style = {styles.details_text}>{time}</Text>
            </View>
        </View>
     );
}

const styles = StyleSheet.create({
    img:{
        height:150,
        width:150,
        borderRadius: 80
    },
    container: {
        flex:1,
        flexDirection:'column',
        padding:10,
        backgroundColor:'azure'
    },
    header:{
        flexDirection: 'column',
        justifyContent:'flex-start',
        alignItems: 'center',
        paddingTop:20
    },
    header_text:{
        fontSize:40,
        fontFamily: 'Sofia-Pro'
    },
    details: {
        flexDirection: 'column',
        alignItems:'center',
        marginTop:30
    },
    details_text: {
        fontFamily: 'Helvetica-Neue',
        fontSize:20,
        color: "#778899"
    }
})
 
export default GigDetails;