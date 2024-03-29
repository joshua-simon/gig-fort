import { FC,useState,useMemo,useEffect,useContext,useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  Dimensions,
  Button,
  StatusBar,
  TouchableOpacity
} from "react-native";
import { Marker,Callout } from "react-native-maps";
import { mapStyle } from "../util/mapStyle";
import { useGigs } from "../hooks/useGigs";
import { format,isSameDay } from "date-fns";
import { mapProps } from "../routes/homeStack";
import { PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from 'expo-location';
import Carousel from "./Carousel";
import ClusteredMapView from 'react-native-maps-super-cluster';
import { Entypo } from '@expo/vector-icons';
import { AuthContext } from "../AuthContext";
import { useGetUser } from "../hooks/useGetUser";
import { useLocation } from "../LocationContext";
import { useFocusEffect } from '@react-navigation/native';
import CustomCallout from "./CustomCallout";


type MapScreenNavgationProp = mapProps['navigation']

interface Props {
    navigation: MapScreenNavgationProp
}

const GigMap:FC<Props> = ({ navigation }):JSX.Element => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [ gigs, setGigs ] = useState([])
  const {user} = useContext(AuthContext) || {}
  const userDetails = useGetUser(user?.uid);
  const gigsDataFromHook = useGigs(userDetails?.userLocation);
  const { selectedLocation, setSelectedLocation } = useLocation();

  useEffect(() => {
    if (gigsDataFromHook) {
      setGigs(gigsDataFromHook);
    }
  }, [gigsDataFromHook]);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor('#2596be');
      return () => {};  // optional cleanup 
    }, [])
  );


  //Filtering through gigs to return only current day's gigs
  const gigsToday = gigs?.filter((gig) => {
    const gigDate = new Date(gig?.dateAndTime?.seconds * 1000)
    return isSameDay(gigDate, selectedDate);
  });

  const gigsData = gigsToday?.map((gig) => ({
    coordinate: {
      latitude: gig.location.latitude,
      longitude: gig.location.longitude,
    },
    ...gig,
  })) || [];


  const groupedByVenue = {};

  gigsData.forEach(gig => {
      if (groupedByVenue[gig.venue]) {
          groupedByVenue[gig.venue].push(gig);
      } else {
          groupedByVenue[gig.venue] = [gig];
      }
  });

  const venuesData = Object.keys(groupedByVenue).map(venue => ({
    venue,
    gigs: groupedByVenue[venue],
    location: groupedByVenue[venue][0].coordinate 
}));

// RENDER MARKER ---------------------------------------------------------------//

const renderMarker = (data) => {
  const { venue, gigs } = data;
  const primaryGig = gigs[0]; 


  if (gigs.length === 1) {
    return (
      <Marker
        anchor={{ x: 0.5, y: 0.5 }} 
        key={primaryGig.id}
        coordinate={{
          latitude: primaryGig.location.latitude,
          longitude: primaryGig.location.longitude
        }}
        onPress={() => {
          navigation.navigate("GigDetails", {
            venue: primaryGig.venue,
            gigName: primaryGig.gigName,
            image: primaryGig.image,
            blurb: primaryGig.blurb,
            isFree: primaryGig.isFree,
            genre: primaryGig.genre,
            dateAndTime: { ...primaryGig.dateAndTime },
            ticketPrice: primaryGig.ticketPrice,
            tickets: primaryGig.tickets,
            address: primaryGig.address,
            links: primaryGig.links,
            gigName_subHeader: primaryGig.gigName_subHeader,
            id: primaryGig.id
          });
        }}
      >
        <View style={{ alignItems: 'center' }}>
          <Image style={styles.imageMain} source={require('../assets/map-pin-new.png')}/>
          <Text style={styles.markerText}>
            {primaryGig.venue.length > 10 ? `${primaryGig.venue.substring(0, 10)}...` : primaryGig.venue}
          </Text>
        </View>
      </Marker>
    );   
  } 

  else {
    return (
      <Marker
        anchor={{ x: 0.5, y: 0.5 }}
        key={venue}
        coordinate={{
          latitude: primaryGig.location.latitude,
          longitude: primaryGig.location.longitude
        }}
      >
        <View style={{ alignItems: 'center' }}>
          <Image style={styles.imageMain} source={require('../assets/map-pin-new.png')}/>
          <Text style={styles.markerText}>
            {venue.length > 10 ? `${venue.substring(0, 10)}...` : venue}
          </Text>
        </View>

        <Callout  style = {{width:150, height:'auto'}}>
          <View style = {styles.callout}>
            {data.gigs.map((gig,i) => {

              const date = new Date(gig.dateAndTime.seconds*1000)
              const formattedDate = format(date, 'h:mm a')

              return (
                <TouchableOpacity style = {{zIndex:2}}  key={gig.id} onPress={() => {
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
                    gigName_subHeader: gig.gigName_subHeader,
                    id: gig.id                 
                  });
                }}>
                  <View style = {{backgroundColor:'#377D8A',borderRadius:4,marginBottom:'5%',padding: '2%',width:'auto'}}>
                    <Text style = {styles.callout_gigName}>{gig.gigName.length > 20 ? `${gig.gigName.substring(0,21)}... - ${formattedDate}`: `${gig.gigName} - ${formattedDate}`}</Text>
                  </View>
                </TouchableOpacity>              
              )
              })}
          </View>
          <Text style = {{fontFamily:'LatoRegular',fontStyle:'italic'}}>Find gigs on the 'List' view for more details</Text>
        </Callout>

      </Marker>
    );
  }
};

// RENDER MARKER ---------------------------------------------------------------//


  const renderCluster = (cluster, onPress) => (
    <Marker coordinate={cluster.coordinate} onPress={onPress}>
      <View style={styles.clusterContainer}>
        <Text style={styles.clusterText}>{cluster.pointCount}</Text>
      </View>
    </Marker>
  );


  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  let userMarker = null;
  if (location) {
    userMarker = (
      <Marker
        coordinate={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }}
        title="You are here"
        // icon = {icon}
        anchor={{ x: 0.5, y: 0.5 }} 
      >
        <Entypo name="dot-single" size={60} color="#4A89F3" />
      </Marker>
    );
  }

  const wellingtonRegion = {
    latitude: -41.29416,
    longitude: 174.77782,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03,
  }

  const aucklandRegion = {
    latitude: -36.848461,
    longitude: 174.763336,
    latitudeDelta: 0.04,
    longitudeDelta: 0.04,
  }

  const [mapRegion, setMapRegion] = useState(wellingtonRegion);

  useEffect(() => {
    let newMapRegion;

    if (userDetails?.userLocation) {
        newMapRegion = userDetails.userLocation == 'Wellington' ? wellingtonRegion : aucklandRegion;
    } else if (selectedLocation) {
        newMapRegion = selectedLocation == 'Wellington' ? wellingtonRegion : aucklandRegion;
    }

    setMapRegion(newMapRegion);

}, [selectedLocation, userDetails]);


  return (
    <View style={styles.container}>
      <View style = {styles.mapElements}>
        <Carousel setSelectedDate = {setSelectedDate} selectedDate = {selectedDate}/>
      </View>
      <View style={styles.mapContainer}>
      <ClusteredMapView
          region={mapRegion}
          style={styles.map}
          data={venuesData}
          customMapStyle={mapStyle}
          provider={PROVIDER_GOOGLE}
          renderMarker={renderMarker} // Custom rendering for markers
          renderCluster={renderCluster} // Custom rendering for clusters
        >
          {userMarker}
        </ClusteredMapView>
      </View>
    </View>
  );
};

const {width:screenWidth, height:screenHeight} = Dimensions.get('window')
const mapWidth = screenWidth * 0.9 //this sets width to 90%
const mapHeight = mapWidth /0.91 //this set height  based on the figma map aspect ratio of 0.91


const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  map: {
    height: '100%',
    width: '100%',
    flex:1,
    ...Platform.select({
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
    color: 'black',
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily:'LatoRegular'
  },
  mapContainer:{
    marginTop: 0,
    flex:1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
      },
      android: {
        overflow: 'hidden',
        elevation: 4,
      }
    })
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
    width: 160,
    height: 'auto'
  },
  callout_gigName:{
    fontFamily:'NunitoSans',
    color:'#FFFFFF',
    width:'auto'
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
    left: 0,
    right: 0,
    zIndex: 1,
  },
  mapElements_top:{
    flex: 1,
  },
  clusterContainer: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderRadius: 15,
    alignItems: 'center',
    borderColor: '#65a8e6',
    justifyContent: 'center',
    backgroundColor: '#65a8e6',
  },
  clusterText: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default GigMap;