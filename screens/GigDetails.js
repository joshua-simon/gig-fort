import { StyleSheet, Text, View } from 'react-native';

const GigDetails = ({ route,navigation }) => {
    const { venue,date,gigName,time } = route.params
    return ( 
        <View>
            <Text>{JSON.stringify(venue)}</Text>
            <Text>{JSON.stringify(gigName)}</Text>
            <Text>{JSON.stringify(date)}</Text>
            <Text>{JSON.stringify(time)}</Text>
        </View>
     );
}
 
export default GigDetails;