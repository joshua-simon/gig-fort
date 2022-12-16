import { StyleSheet, Text, View } from 'react-native';

const CalloutView = ({ venue,date,gigName,time }) => {
    return ( 
        <View style = {styles.container}>
            <Text >{venue}</Text>
            <Text>{gigName}</Text>
            <Text>{`${date } ${time}`}</Text>
            <Text style = {styles.text}>Tap to see details</Text>
        </View>
     );
}

const styles = StyleSheet.create({
    text: {
     marginTop:10
    },
})
 
export default CalloutView;