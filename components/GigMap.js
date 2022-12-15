import { StyleSheet, Text, View } from 'react-native';
import MapView from 'react-native-maps';

const GigMap = () => {
  return (
    <View style = {styles.container}>
      <Text style = {styles.headerText}>Today's gigs</Text>
      <MapView
        initialRegion={{
          latitude: -41.29416,
          longitude: 174.77782,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }} 
        style = {styles.map}
      />
    </View>
  );
};

// welly coordinates
// 174.77782
// -41.29416


const styles = StyleSheet.create({
    container: {
        flexDirection:'column',
        alignItems: 'center'
    },
    map: {
        height:500,
        width:330,
        margin:10
    },
    headerText: {
        color: 'white',
        fontSize:20,
        marginTop:5
    }
})


export default GigMap;