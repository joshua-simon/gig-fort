import { useState,useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { query,collection,getDocs } from 'firebase/firestore';
import { db } from '../firebase';


const GigMap = () => {
  const [ gigs,setGigs ] = useState([])

  useEffect(() => {
    const getGigs = async () => {
      try {
        const gigArray = [];
        const q = query(collection(db, "gigs"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) =>
          gigArray.push({ id: doc.id, ...doc.data() })
        );
        setGigs(gigArray);
      } catch (err) {
        console.log(`Error: ${err}`);
      }
    };
    getGigs();
  }, []);

  // Rogue coordinates
  // lat:  -41.29342516194285 long:  174.77451072494182

  const rogueLat = gigs[0]?.location.latitude
  const rogueLong = gigs[0]?.location.longitude

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
      >
        <Marker
          coordinate={{latitude: rogueLat,longitude:rogueLong}}
          image = {require('../assets/Icon_Gold_48x48.png')}
        />
      </MapView>
    </View>
  );
};


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