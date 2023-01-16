import { FC } from 'react'
import { StyleSheet,View,Text,TouchableOpacity } from 'react-native'
import GigMap from '../components/GigMap'
import { mapProps } from '../routes/homeStack'

type MapScreenNavgationProp = mapProps['navigation']

interface Props {
    navigation: MapScreenNavgationProp
}

const Map:FC<Props> = ({ navigation }):JSX.Element => {
    return (
        <View style = {styles.container}>
            <GigMap navigation = {navigation}/>
            <View style = {styles.footer}>
            <TouchableOpacity
                onPress = {() => navigation.navigate("List")}
                style = {styles.button}
            >
                <Text style = {styles.buttonText}>List View</Text>
            </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#f0ffff',
        justifyContent: 'space-between'
    },
    footer:{
        backgroundColor: 'white',
        height:50,
        justifyContent: 'center',
        alignItems:'center'
    },
    button: {
        backgroundColor: '#68912b',
        padding:5,
        borderRadius:5
    },
    buttonText: {
        color:'white',
        fontFamily:'Helvetica-Neue'
    }
})
 
export default Map;