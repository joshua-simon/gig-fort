import { StyleSheet, Text, View } from 'react-native';

const CalloutView = ({ venue,gigName,genre }) => {
    return ( 
        <View style = {styles.container}>
            <Text style = {styles.header} >{gigName}</Text>
            <Text style = {styles.details}>{`${venue} | ${genre}`}</Text>
            <Text style = {styles.button}>Tap to see details</Text>
        </View>
     );
}

const styles = StyleSheet.create({
    container:{
        padding:7,
        flex:1
    },
    text: {
     marginTop:10
    },
    header:{
        fontFamily:'Sofia-Pro',
        fontSize:20
    },
    details:{
        fontFamily:'Helvetica-Neue',
        color:'#778899'
    },
    button:{
        textAlign:'center',
        marginTop:10,
        fontFamily:'Helvetica-Neue',
        color:'white',
        backgroundColor: "#68912b",
        padding:2,
        borderRadius:5
    }
})
 
export default CalloutView;