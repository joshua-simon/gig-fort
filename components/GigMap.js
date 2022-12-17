import { useState, useMemo } from "react";
import { StyleSheet, Text, View, Pressable,Image,TouchableOpacity } from "react-native";
import MapView from "react-native-maps";
import { Marker, Callout } from "react-native-maps";
import CalloutView from "./CalloutView";
import { mapStyle } from "../util/mapStyle";
import { useGigs } from "../hooks/useGigs";
import { AntDesign } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const GigMap = ({ navigation }) => {

  const [selectedDateMs, setSelectedDateMs] = useState(Date.now());
  const gigs = useGigs()

  //generates current date in format DD/MM/YYYY
  const selectedDateString = useMemo(() => {
    const d = new Date(selectedDateMs);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }, [selectedDateMs]);

  const currentDate = new Date(selectedDateMs).toString().slice(0,15)

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
        <Text>Tap on</Text>
        <Image
          style={styles.image}
          source={require("../assets/Icon_Gold_48x48.png")}
        />
        <Text> to see gig info</Text>
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
        <TouchableOpacity onPress={() => addDays(-1)}>
          <AntDesign name="caretleft" size={36} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => addDays(1)}>
          <AntDesign name="caretright" size={36} color="black" />
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
    height: 500,
    width: 330,
    margin: 10,
  },
  headerText: {
    color: "black",
    fontSize: 20,
    marginTop: 5,
  },
  callout: {
    width: 200,
    height: 100,
  },
  buttonOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width:'92%'
  },
  buttonOptionsText: {
    margin: 5,
  },
  image:{
    height:20,
    width:20,
    paddingBottom:10,
    margin:0
},
imageText: {
  flexDirection:'row',
  alignItems:'center',
  justifyContent: 'center'
},
pressable: {
  flexDirection:'column',
  alignItems:'center'
}
});

export default GigMap;
