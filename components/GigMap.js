import { useState,useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView from 'react-native-maps';
import { Marker,Callout } from 'react-native-maps';
import { query,collection,getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import CalloutView from './CalloutView';


const GigMap = () => {
  const [gigs, setGigs] = useState([]);

  //Generating current date
  const day = new Date().getDate();
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();
  const dateToday = `${day}/${month}/${year}`;

  //Making call to Firebase to retrieve gig documents from 'gigs' collection
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

  //Filtering through gigs to return only current day's gigs
  const gigsToday = gigs.filter((gig) => gig.date === dateToday);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Today's gigs</Text>
      <MapView
        initialRegion={{
          latitude: -41.29416,
          longitude: 174.77782,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        }}
        style={styles.map}
      >
        {gigsToday.map((gig, i) => (
          <Marker
            key={i}
            coordinate={{
              latitude: gig.location.latitude,
              longitude: gig.location.longitude,
            }}
            image={require("../assets/Icon_Gold_48x48.png")}
          >
            <Callout style={styles.callout}>
              <CalloutView
                venue={gig.venue}
                date={gig.date}
                gigName={gig.gigName}
                time={gig.time}
                style={styles.calloutView}
              />
            </Callout>
          </Marker>
        ))}
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
    },
    callout: {
      width:200,
      height:100,
    },
    calloutView: {
      // width: 100,
      // height:100
    }
})


export default GigMap;