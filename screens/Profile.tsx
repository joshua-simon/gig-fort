import { FC, useContext, useState, useEffect,useRef } from "react";
import { View, Text, StyleSheet,TouchableOpacity,FlatList, Platform,Image } from 'react-native';
import { AuthContext } from "../AuthContext";
import { useGetUser } from "../hooks/useGetUser";
import { useGigs } from "../hooks/useGigs";
import GigCard from "../components/GigCard";
import { profileProps } from "../routes/homeStack";
import Footer from "../components/Footer";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { isToday,isFuture } from "date-fns";


type ProfileScreenNavigationProp = profileProps["navigation"];

interface Props {
  navigation: ProfileScreenNavigationProp;
}

const Profile:FC<Props> = ({ navigation }) => {
  const [userSavedGigs, setUserSavedGigs] = useState([]);

  const { user } = useContext(AuthContext);
  const userDetails = useGetUser(user?.uid);
  const { firstName, lastName, userLocation } = userDetails || {};


  const gigs = useGigs();


  useEffect(() => {
    if (user) {
      const userRef = doc(db, 'users', user?.uid);
      const unsubscribeUser = onSnapshot(userRef, (userSnapshot) => {
      const userData = userSnapshot.data();
        
        if (userData) {
          setUserSavedGigs(userSnapshot.data().savedGigs || []);
        }
      });
  
      return () => {
        unsubscribeUser();
      };
    }
}, [user]);


  const savedGigs = gigs.filter((gig) => userSavedGigs?.includes(gig.id));

  const savedGigsFromCurrentDate = savedGigs?.filter((gig) => {
    const gigDate = gig.dateAndTime?.seconds * 1000;
    return isToday(new Date(gigDate)) || isFuture(new Date(gigDate))
  })



  const gigList =
    savedGigsFromCurrentDate?.length === 0 ? (
      <View style={{ alignItems: "center" }}>
        <Image
          source={require("../assets/logo_light_5.png")}
          style={{ width: 184, height: 184 }}
        />
        <Text
          style={{ fontFamily: "NunitoSans", fontSize: 16, marginTop: "2%" }}
        >
          You haven't saved any gigs yet!
        </Text>
      </View>
    ) : (
      <FlatList
        data={savedGigsFromCurrentDate}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 140 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.gigCard}
            onPress={() =>
              navigation.navigate("GigDetails", {
                venue: item.venue,
                gigName: item.gigName,
                blurb: item.blurb,
                isFree: item.isFree,
                image: item.image,
                genre: item.genre,
                dateAndTime: { ...item.dateAndTime },
                tickets: item.tickets,
                ticketPrice: item.ticketPrice,
                address: item.address,
                links: item.links,
                gigName_subHeader: item.gigName_subHeader,
                id: item.id,
              })
            }
          >
            <GigCard item={item} isProfile={true} />
          </TouchableOpacity>
        )}
      />
    );


  return (
    <View style={styles.container}>
    <View style={styles.contentContainer}>
      <View style = {styles.details}>
        <Text style={styles.username}>{firstName && lastName ? `${firstName} ${lastName}` : ''}</Text>
        <Text style = {styles.location}>{userLocation ? userLocation : ''}</Text>
      </View>
      <View style = {styles.savedGigs}>
        <Text style={styles.savedGigs_header}>Saved gigs</Text>
        <View style = {savedGigsFromCurrentDate?.length === 0 ? {marginTop:'20%'} :{marginTop:'10%'} }>
          {gigList}
        </View>
      </View>
    </View>
    <Footer navigation = {navigation}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F6F5',
  },
  contentContainer:{
    flex: 1,
    flexDirection:'column',
    justifyContent: 'flex-start'
  },
  username: {
    color: "white",
    fontSize: 26,
    fontFamily: "NunitoSans",
    marginLeft:'7%',
    marginTop:'7%'
  },
  location:{
    fontFamily:'NunitoSans',
    fontSize:16,
    color:'white',
    marginLeft:'7%'
  },
  gigCard: {
    marginLeft:'7%',
    marginRight:'7%',
    backgroundColor:'#FAF7F2',
    height:'auto',
    marginBottom:16,
    padding:'3%',
    borderRadius:10,
    ...Platform.select({
      ios:{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
      },
      android:{
       elevation: 4,       
      }
    })
  },
  details:{
    width:'98%',
    height:115,
    backgroundColor:'#4fb6da',
    marginVertical: 0,
    alignSelf: 'center',
    borderBottomRightRadius: 22,
    borderBottomLeftRadius: 22,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    flexDirection:'column'
  },
  savedGigs: {
    marginTop:'10%'
  },
  savedGigs_header: {
    color: "black",
    fontSize: 23,
    fontFamily: "NunitoSans",
    marginLeft:'7%'
  },
});

export default Profile;
