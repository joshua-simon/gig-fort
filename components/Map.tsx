import { FC } from "react";
import { useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  Platform,
  Dimensions,
  Button
} from "react-native";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import { mapStyle } from "../util/mapStyle";
import { useGigs } from "../hooks/useGigs";
import { AntDesign,FontAwesome5,Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { mapProps } from "../routes/homeStack";
import { Switch } from 'react-native-paper'
import { PROVIDER_GOOGLE } from "react-native-maps";
import DateTimePicker from '@react-native-community/datetimepicker';


type MapScreenNavgationProp = mapProps['navigation']

interface Props {
    navigation: MapScreenNavgationProp
}

const GigMap:FC<Props> = ({ navigation }):JSX.Element => {
  const [selectedDateMs, setSelectedDateMs] = useState<number>(Date.now());
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const gigs = useGigs();

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };


  //generates current date in format DD/MM/YYYY
  const selectedDateString:string = useMemo(() => {
    const formattedDate = format(date,'EEE LLL do Y')
    return formattedDate
  }, [date]);


  const currentDay:string = useMemo(() => {
    const formattedDay = format(date,'EEEE')
    return formattedDay
  },[date])

  const currentWeek:string = useMemo(() => {
    const formattedDay = format(date,'LLLL do Y')
    return formattedDay
  },[date])

  //Filtering through gigs to return only current day's gigs
 
  const gigsToday = gigs.filter((gig) => {
    const formattedGigDate = format(new Date(gig.dateAndTime.seconds * 1000), 'EEE LLL do Y')
    return formattedGigDate === selectedDateString;
  });


  const freeGigsToday = gigsToday.filter((gig) => {
    return gig.isFree === true
  })
  

  const gigsToDisplay = isSwitchOn ? freeGigsToday : gigsToday
  
  //increments date by amount
  const addDays = (amount:number):void => {
    setSelectedDateMs((curr) => curr + 1000 * 60 * 60 * 24 * amount);
  };

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  return (
    <View style={styles.container}>




      <View style = {styles.mapElements}>

        <TouchableOpacity style = {styles.mapElements_container} onPress={showDatepicker}>
          <View>
            <Text style={styles.headerText_main}>{currentDay}</Text>
            <Text style={styles.headerText_sub}>{currentWeek}</Text>
          </View>
          <View style = {{alignItems:'center'}}>
          <FontAwesome5 name="calendar" size={24} color="white" />
            {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}
          </View>
        </TouchableOpacity>

      </View>




      {/* <View style={styles.imageText}>
        <Text style={styles.subHeader}>Tap on the</Text>
        <Image
          style={styles.image}
          source={require("../assets/map-pin-new.png")}
        />
        <Text style={styles.subHeader}>
          icons on the map to see more gig info
        </Text>
      </View> */}

      <View style={styles.mapContainer}>
        <MapView
          initialRegion={{
            latitude: -41.29416,
            longitude: 174.77782,
            latitudeDelta: 0.03,
            longitudeDelta: 0.03,
          }}
          style={styles.map}
          customMapStyle={mapStyle}
          provider = {PROVIDER_GOOGLE}
        >
          {gigsToDisplay.map((gig, i) => {
            return (
              <Marker
                key={i}
                coordinate={{
                  latitude: gig.location.latitude,
                  longitude: gig.location.longitude,
                }}
                onPress={() => {
                  navigation.navigate("GigDetails", {
                    venue: gig.venue,
                    gigName: gig.gigName,
                    image: gig.image,
                    blurb: gig.blurb,
                    isFree: gig.isFree,
                    genre: gig.genre,
                    dateAndTime: { ...gig.dateAndTime },
                    ticketPrice: gig.ticketPrice,
                    tickets: gig.tickets,
                    address: gig.address,
                    links: gig.links,
                    gigName_subHeader: gig.gigName_subHeader
                  });
                }}
              >
                <ImageBackground  style={styles.imageMain} source = {require('../assets/map-pin-new.png')}>
                <Text style ={{color:'white', borderRadius:2, fontWeight:'bold', fontSize:9, backgroundColor: "#377D8A",textAlign:'center',marginTop:'103%',fontFamily:'LatoRegular'}}>{gig.genre.length > 6 ? gig.genre.substring(0,7) : gig.genre }</Text>
                </ImageBackground>
                
                {/* <Image  style={styles.imageMain} source = {require('../assets/map-pin-new.png')}/>   */}
                {/* <Ionicons name="ios-location-sharp" size={48} color="black" /> */}

              </Marker>
            );
          })}
        </MapView>
      </View>

      {/* <View style={styles.buttonOptions}>
          <TouchableOpacity onPress={() => addDays(-1)} style={styles.touchable}>
            <AntDesign name="caretleft" size={36} color="#377D8A" />
            <Text style={{ fontFamily: "NunitoSans", color: "black",marginLeft:'8%',fontSize:15  }}>
              Previous day
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => addDays(1)} style={styles.touchable}>
            <AntDesign name="caretright" size={36} color="#377D8A" />
            <Text style={{ fontFamily: "NunitoSans", color: "black",marginRight:'8%',fontSize:15 }}>
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
    flex:1,
  },
  map: {
    height: '100%',
    width: '100%',
    flex:1,
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
  marker: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  markerText: {
    color: '#000',
    fontWeight: 'bold',
    marginLeft: 5,
    marginRight: 5,
    fontSize: 14,
  },
  mapContainer:{
    marginTop: 0,
    // marginHorizontal: 20,
    // width: mapWidth,
    // height: mapHeight,
    flex:1,
    ...Platform.select({
      ios: {
        // borderRadius:26,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
      },
      android: {
        overflow: 'hidden',
        // borderRadius:26,
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
  mapElements_container:{
    flexDirection:'row',
    backgroundColor: 'rgba(55, 125, 138,0.8)',
    alignSelf: 'flex-start',
    padding:'3%',
    borderRadius:8
  },
  headerText_main: {
    fontFamily: "NunitoSans",
    fontSize:25,
    lineHeight:34.1,
    color:'white',
    marginLeft:'7%'
  },
  headerText_sub: {
    fontFamily:'LatoRegular',
    size:14,
    lineHeight:16.8,
    color:'white',
    marginLeft:'7%'
  },
  callout: {
    width: "auto",
    height: "auto",
    backgroundColor: "azure",
  },
  buttonOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width:'100%',
    position: 'absolute',
    top: '80%', 
    left: 0, 
    right: 0, 
    zIndex: 1,
    padding:'2%'
  },
  buttonOptionsText: {
    margin: 5,
  },
  image: {
    height:20,
    width:14,
    marginHorizontal:3
  },
  imageMain: {
    height:42,
    width:30,
    marginHorizontal:3, 

  },
  imageText: {
    flexDirection: "row",
    marginLeft:'7%',
    marginTop:27
  },
  touchable: {
    flexDirection: "column",
    alignItems: "center",
    // backgroundColor:'rgba(1,174,221, 0.9)',
    // padding:'2%',
    // width:'40%',
    // borderRadius:80
  },
  subHeader: {
    fontFamily: "LatoRegular",
    color: "#747474",
    size: 12,
    lineHeight: 17.04,
  },
  button:{
    flexDirection:'column',
    width:115,
    height:37,
    marginLeft:'7%',
    backgroundColor:'#377D8A',
    borderRadius:8,
    justifyContent:'center',
    marginTop:'6%'
  },
  buttonText: {
    color:'#FFFFFF',
    textAlign:'center',
    fontFamily: 'NunitoSans',
    fontSize:16,
    lineHeight:22
  },
  buttonAndSwitch:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    marginBottom:'6%'
  },
  switch:{
    marginRight:'7%',
    zIndex:0,
  },
  switch_text: {
    fontFamily: 'LatoRegular',
    fontSize:10,
  },
  mapElements: {
    flexDirection: 'column',
    position: 'absolute',
    top: 10,
    left: 10,
    right: 0,
    zIndex: 1,
  },
  mapElements_top:{
    flex: 1,
  },
});

export default GigMap;