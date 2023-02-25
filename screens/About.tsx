import { View,Text,StyleSheet } from 'react-native'

const About = () => {
    return (
        <View style = {styles.container}>
            <Text style = {styles.header}>Gig Fort</Text>
            <Text style = {styles.subheader}>A one-stop app for finding gigs in Wellington with ease.</Text>
            <Text style = {styles.contact}>For any questions or feedback, please contact us at <Text style = {styles.email}>gigfort.nz@gmail.com</Text></Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        marginLeft:'7%',
        marginRight:'7%'
    },
    header:{
       fontFamily:'NunitoSans',
       fontSize:30
    },
    subheader:{
        fontFamily:'LatoRegular',
        fontSize:20
    },
    contact:{
        marginTop:'10%',
        fontFamily:'LatoRegular',
        fontSize:15,        
    },
    email:{
        marginTop:'10%',
        fontFamily:'LatoRegular',
        fontWeight:'bold'       
    }
})
 
export default About;