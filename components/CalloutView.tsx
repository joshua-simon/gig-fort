import { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
    venue:string,
    gigName:string,
    genre:string
}

const CalloutView:FC<Props> = ({ venue,gigName,genre }):JSX.Element => {
    const title = gigName.substring(0,25)
    return ( 
        <View style = {styles.container}>
            <Text style = {styles.header} >{`${title}`}</Text>
            <Text style = {styles.details}>{`${venue} | ${genre}`}</Text>
            <Text style = {styles.button}>See details</Text>
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
        fontSize:15
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
        borderRadius:5,
    }
})
 
export default CalloutView;