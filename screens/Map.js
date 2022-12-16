import { StyleSheet,View,Text,Pressable } from 'react-native'
import GigMap from '../components/GigMap'

const Map = ({ navigation }) => {
    return (
        <View style = {styles.container}>
            <GigMap navigation = {navigation}/>
            <View style = {styles.footer}>
            <Pressable
                title = "Go to list view"
                onPress = {() => navigation.navigate("List")}
                style = {styles.button}
            >
                <Text style = {styles.buttonText}>List View</Text>
            </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: 'coral',
        justifyContent: 'space-between'
    },
    footer:{
        backgroundColor: '#fff',
        height:50,
        justifyContent: 'center',
        alignItems:'center'
    },
    button: {
        backgroundColor: '#00008b',
        padding:3,
        borderRadius:5
    },
    buttonText: {
        color:'white'
    }
})
 
export default Map;