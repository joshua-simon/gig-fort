import { StyleSheet, Text, View } from 'react-native';

const CalloutView = ({ venue,date,gigName,time }) => {
    return ( 
        <View style = {styles.container}>
            <Text style = {styles.text}>{venue}</Text>
            <Text>{gigName}</Text>
            <Text>{`${date } ${time}`}</Text>
        </View>
     );
}

const styles = StyleSheet.create({
    container: {
     
    },
})
 
export default CalloutView;