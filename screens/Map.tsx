import { FC } from 'react'
import { StyleSheet,View,Text,TouchableOpacity } from 'react-native'
import GigMap from '../components/Map'
import { mapProps } from '../routes/homeStack'
import Footer from '../components/Footer'


type MapScreenNavgationProp = mapProps['navigation']

interface Props {
    navigation: MapScreenNavgationProp
}

const Map:FC<Props> = ({ navigation }):JSX.Element => {
    return (
        <View style = {styles.container}>
            <GigMap navigation = {navigation}/>
            <Footer navigation = {navigation}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#F7F6F5',
        // justifyContent: 'space-between'
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