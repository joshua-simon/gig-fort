import { useState, useMemo, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  TouchableOpacity,
} from "react-native";
import MapView from "react-native-maps";
import { Marker, Callout } from "react-native-maps";
import { mapStyle } from "../util/mapStyle";
import { useGigs } from "../hooks/useGigs";
import { AntDesign } from "@expo/vector-icons";
import MapGigDetails from "./mapGigDetails";


const GigMap = ({ navigation }) => {
  const [selectedDateMs, setSelectedDateMs] = useState(Date.now());
  const  [ gigDetails,setGigDetails ] = useState({})
  const gigs = useGigs();


  //generates current date in format DD/MM/YYYY
  const selectedDateString = useMemo(() => {
    const date = new Date(selectedDateMs);
    const dateToString = date.toString().slice(0,15)
    return dateToString // returns in form 'Tue Dec 20 2022'
  }, [selectedDateMs]);


  //Filtering through gigs to return only current day's gigs
  const gigsToday = gigs.filter((gig) => {
    const gigDate1 = new Date(gig.dateAndTime.seconds*1000)   
    const gigDate2 = gigDate1.toString().slice(0,15) //return form 'Tue Dec 20 2022'
    return gigDate2 === selectedDateString
  })

  // console.log('gigsToday', gigsToday[0]) gives gig at index 0

  //increments date by amount
  const addDays = (amount) => {
    setSelectedDateMs((curr) => curr + 1000 * 60 * 60 * 24 * amount);
    setGigDetails({})
  };

  const sendGigDetails = (payload) => setGigDetails(payload)

  const testView = <View><Text>{gigDetails?.venue}</Text></View>

  //WRITE CLEAR MAP DETAILS FUNCTION FOR TOUCHABLE COMPONENT

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{`Gigs on ${selectedDateString}`}</Text>
      {testView}
      <View style={styles.imageText}>
        <Text style = {styles.subHeader}>Tap on</Text>
        <Image
          style={styles.image}
          source={require("../assets/Icon_Gold_48x48.png")}
        />
        <Text style = {styles.subHeader}> for gig info</Text>
      </View>

      <MapView
        initialRegion={{
          latitude: -41.29416,
          longitude: 174.77782,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        }}
        style={styles.map}
        customMapStyle={mapStyle}
      >
        {gigsToday.map((gig, i) => {

          return (
            <Marker
              key={i}
              coordinate={{
                latitude: gig.location.latitude,
                longitude: gig.location.longitude,
              }}
              image={require("../assets/Icon_Gold_48x48.png")}
              onPress={() => sendGigDetails(gig)}
            />

          );
        }        
        )}
      </MapView>

      <View style={styles.buttonOptions}>
        <TouchableOpacity onPress={() => addDays(-1)} style = {styles.touchable}>
          <AntDesign name="caretleft" size={36} color="#778899" />
          <Text style = {{fontFamily:'Helvetica-Neue', color:'#778899'}}>Previous day</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => addDays(1)} style = {styles.touchable}>
          <AntDesign name="caretright" size={36} color="#778899" />
          <Text style = {{fontFamily:'Helvetica-Neue',color:'#778899'}}>Next day</Text>
        </TouchableOpacity>
      </View>
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
  },
  map: {
    height: 400,
    width: 330,
    margin: 10,
  },
  headerText: {
    color: "black",
    fontSize: 25,
    marginTop: 5,
    fontFamily:'Sofia-Pro',
    fontStyle:'bold',
    marginBottom:10,
    marginTop: 15
  },
  callout: {
    width: 'auto',
    height: 'auto',
    backgroundColor:'azure'
  },
  buttonOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "92%",
  },
  buttonOptionsText: {
    margin: 5,
  },
  image: {
    height: 20,
    width: 20,
    paddingBottom: 10,
    margin: 0,
  },
  imageText: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  touchable: {
    flexDirection:'column',
    alignItems:'center'
  },
  subHeader: {
    fontStyle: 'italic',
    fontFamily:'Helvetica-Neue',
    color:'#778899'
  }
});

export default GigMap;