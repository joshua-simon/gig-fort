import { useState, useMemo } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import MapView from "react-native-maps";
import { Marker, Callout } from "react-native-maps";
import CalloutView from "./CalloutView";
import { mapStyle } from "../util/mapStyle";
import { useGigs } from "../hooks/useGigs";

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

  console.log(new Date(selectedDateMs).toString())


  //Filtering through gigs to return only current day's gigs
  const gigsToday = gigs.filter((gig) => gig.date === selectedDateString);

  //increments date by amount
  const addDays = (amount) => {
    setSelectedDateMs((curr) => curr + 1000 * 60 * 60 * 24 * amount);
  };

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
        <Pressable onPress = {() => addDays(-1)} >
          <Text style={styles.buttonOptionsText}>previous day's gigs</Text>
        </Pressable>
        <Pressable onPress = {() => addDays(1)}>
          <Text style={styles.buttonOptionsText}>next day's gigs</Text>
        </Pressable>
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
    justifyContent: "flex-start",
  },
  buttonOptionsText: {
    margin: 5,
  },
});

export default GigMap;
