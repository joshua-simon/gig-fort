
import { FC } from "react";
import { useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform,
  Dimensions
} from "react-native";
import MapView from "react-native-maps";
import { Marker, Callout } from "react-native-maps";
import { mapStyle } from "../util/mapStyle";
import { useGigs } from "../hooks/useGigs";
import { AntDesign } from "@expo/vector-icons";
import { format } from "date-fns";
import { mapProps } from "../routes/homeStack";


type MapScreenNavgationProp = mapProps['navigation']

interface Props {
    navigation: MapScreenNavgationProp
}

const GigMap:FC<Props> = ({ navigation }):JSX.Element => {
  const [selectedDateMs, setSelectedDateMs] = useState<number>(Date.now());
  const gigs = useGigs();

  //generates current date in format DD/MM/YYYY
  const selectedDateString:string = useMemo(() => {
    const formattedDate = format(new Date(selectedDateMs),'EEE LLL do Y')
    return formattedDate
  }, [selectedDateMs]);

  const currentDay:string = useMemo(() => {
    const formattedDay = format(new Date(selectedDateMs),'EEEE')
    return formattedDay
  },[selectedDateMs])

  const currentWeek:string = useMemo(() => {
    const formattedDay = format(new Date(selectedDateMs),'LLLL do Y')
    return formattedDay
  },[selectedDateMs])

  //Filtering through gigs to return only current day's gigs
  const gigsToday = gigs.filter((gig) => {
    const formattedGigDate = format(new Date(gig.dateAndTime.seconds * 1000), 'EEE LLL do Y')
    return formattedGigDate === selectedDateString;
  });
  

  //increments date by amount
  const addDays = (amount:number):void => {
    setSelectedDateMs((curr) => curr + 1000 * 60 * 60 * 24 * amount);
  };


  return (
    <View style={styles.container}>
      <View testID="gigMapHeader" style={styles.headerText}>
        <Text style = {styles.headerText_main}>{currentDay}</Text>
        <Text style = {styles.headerText_sub}>{currentWeek}</Text>
      </View>

      <View style={styles.imageText}>
        <Text style={styles.subHeader}>Tap on the</Text>
        <Image
          style={styles.image}
          source={require("../assets/map-pin-new.png")}
        />
        <Text style={styles.subHeader}>icons on the map to see more gig info</Text>
      </View>

      <View style = {styles.mapContainer}>
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

          let venueName:string;
          if (gig.venue.length > 12) {
            venueName = `${gig.venue.substring(0, 12)}...`;
          } else {
            venueName = gig.venue;
          }
          return (
            <Marker
              key={i}
              coordinate={{
                latitude: gig.location.latitude,
                longitude: gig.location.longitude,
              }}
              icon={require("../assets/map-pin-50pc.png")}
              onPress={() => {
                navigation.navigate("GigDetails", {
                  venue: gig.venue,
                  gigName: gig.gigName,
                  image: gig.image,
                  blurb: gig.blurb,
                  isFree: gig.isFree,
                  genre: gig.genre,
                  dateAndTime: {...gig.dateAndTime},
                  tickets: gig.tickets,
                });
              }} 
            >
              <Text style = {styles.gigInfo_text}>{gig.genre}</Text>
            </Marker>
          );
        })}
      </MapView>
      </View>

      {/* <View style={styles.buttonOptions}>
        <TouchableOpacity onPress={() => addDays(-1)} style={styles.touchable}>
          <AntDesign name="caretleft" size={36} color="#778899" />
          <Text style={{ fontFamily: "Helvetica-Neue", color: "#778899" }}>
            Previous day
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => addDays(1)} style={styles.touchable}>
          <AntDesign name="caretright" size={36} color="#778899" />
          <Text style={{ fontFamily: "Helvetica-Neue", color: "#778899" }}>
            Next day
          </Text>
        </TouchableOpacity>
      </View> */}

    </View>
  );
};

const {width:screenWidth, height:screenHeight} = Dimensions.get('window')
const mapWidth = screenWidth * 0.9 //this sets width to 90%
const mapHeight = mapWidth /0.91 //this set height  based on the figma map aspect ratio of 0.91



const styles = StyleSheet.create({
  container: {
    // flexDirection: "column",
    // alignItems: "center",
    flex:1
  },
  map: {
    height: '100%',
    width: '100%'
  },
  mapContainer:{
    marginTop: '10%',
    marginHorizontal: 20,
    width: mapWidth,
    height: mapHeight,
    ...Platform.select({
      ios: {
        borderRadius:26,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
      },
      android: {
        overflow: 'hidden',
        borderRadius:26,
        elevation: 4,
      }
    })
  },
  gigInfo: {
    // backgroundColor: '#68912b',
    // marginTop:20
  },
  gigInfo_text: {
    fontSize:10,
    color:'black',
    fontFamily:'NunitoSans',
    paddingTop: 25,
    textAlign:'center',
    fontWeight:'bold'
  },
  gigInfo_text_genre: {
    color: "white",
    fontFamily: "Helvetica-Neue",
    transform: [{ translateY: -5 }],
  },
  headerText: {
    color: "black",
    fontSize: 25,
    marginTop: '0%',
    marginLeft: '7%',
    fontFamily: "NunitoSans",
    marginBottom: 10,
  },
  headerText_main: {
    fontFamily: "NunitoSans",
    fontSize:25,
    lineHeight:34.1
  },
  headerText_sub: {
    fontFamily:'LatoRegular',
    size:14,
    lineHeight:16.8
  },
  callout: {
    width: "auto",
    height: "auto",
    backgroundColor: "azure",
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
    height:20,
    width:14,
    marginHorizontal:3
  },
  imageText: {
    flexDirection: "row",
    marginLeft:'7%',
    marginTop:27
  },
  touchable: {
    flexDirection: "column",
    alignItems: "center",
  },
  subHeader: {
    fontFamily: "LatoRegular",
    color: "#747474",
    size: 12,
    lineHeight: 17.04
  },
});

export default GigMap;
