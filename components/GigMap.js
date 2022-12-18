import { useState, useMemo } from "react";
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
import CalloutView from "./CalloutView";
import { mapStyle } from "../util/mapStyle";
import { useGigs } from "../hooks/useGigs";
import { AntDesign } from "@expo/vector-icons";


const GigMap = ({ navigation }) => {
  const [selectedDateMs, setSelectedDateMs] = useState(Date.now());
  const gigs = useGigs();

  //generates current date in format DD/MM/YYYY
  const selectedDateString = useMemo(() => {
    const d = new Date(selectedDateMs);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }, [selectedDateMs]);

  const currentDate = new Date(selectedDateMs).toString().slice(0, 15);

  //Filtering through gigs to return only current day's gigs
  const gigsToday = gigs.filter((gig) => gig.date === selectedDateString);

  //increments date by amount
  const addDays = (amount) => {
    setSelectedDateMs((curr) => curr + 1000 * 60 * 60 * 24 * amount);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{`Gigs on ${currentDate}`}</Text>

      <View style={styles.imageText}>
        <Text style = {styles.subHeader}>Tap on</Text>
        <Image
          style={styles.image}
          source={require("../assets/Icon_Gold_48x48.png")}
        />
        <Text style = {styles.subHeader}> to see gig info</Text>
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
        {gigsToday.map((gig, i) => (
          <Marker
            key={i}
            coordinate={{
              latitude: gig.location.latitude,
              longitude: gig.location.longitude,
            }}
            image={require("../assets/Icon_Gold_48x48.png")}
          >
            <Callout
              style={styles.callout}
              onPress={() =>
                navigation.navigate("GigDetails", {
                  venue: gig.venue,
                  date: gig.date,
                  gigName: gig.gigName,
                  time: gig.time,
                })
              }
            >
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

      <View style={styles.buttonOptions}>
        <TouchableOpacity onPress={() => addDays(-1)} style = {styles.touchable}>
          <AntDesign name="caretleft" size={36} color="#778899" />
          <Text style = {{fontFamily:'Helvetica-Neue', color:'#778899'}}>Previous day's gigs</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => addDays(1)} style = {styles.touchable}>
          <AntDesign name="caretright" size={36} color="#778899" />
          <Text style = {{fontFamily:'Helvetica-Neue',color:'#778899'}}>Next day's gigs</Text>
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
    width: 200,
    height: 100,
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
