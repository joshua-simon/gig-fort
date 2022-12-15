import { View,Text,Button } from 'react-native'

const Map = ({ navigation }) => {
    return (
        <View>
            <Text>Map screen</Text>
            <Button
                title = "Go to list view"
                onPress = {() => navigation.navigate("List")}
            />
        </View>
    )
}
 
export default Map;