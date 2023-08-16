import { FC, useContext, useState, useEffect,useRef } from "react";
import { View, Text, StyleSheet,TouchableOpacity,FlatList, Platform } from 'react-native';
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



  const gigList = (
    <FlatList
    data={savedGigsFromCurrentDate}
    keyExtractor={item => item.id}
    contentContainerStyle={{ paddingBottom: 140 }}
    renderItem={({ item }) => (
      <TouchableOpacity
        style={styles.gigCard}
        onPress={() =>
          navigation.navigate('GigDetails', {
            venue: item.venue,
            gigName: item.gigName,
            blurb: item.blurb,
            isFree: item.isFree,
            image: item.image,
            genre: item.genre,
            dateAndTime: {...item.dateAndTime},
            tickets: item.tickets,
            ticketPrice: item.ticketPrice,
            address: item.address,
            links: item.links,
            gigName_subHeader:item.gigName_subHeader,
            id:item.id
          })
        }>

        <GigCard item = {item} isProfile = {true}/>

      </TouchableOpacity>
    )}
  />
  )

  return (
    <View style={styles.container}>
    <View style={styles.contentContainer}>
      <View style = {{marginBottom:20}}>
        <Text style={styles.username}>{firstName && lastName ? `${firstName} ${lastName}` : ''}</Text>
        <Text style = {{fontFamily:'NunitoSans',marginTop: '1%',fontSize:16}}>{userLocation ? userLocation : ''}</Text>
      </View>
      <Text style={styles.header}>Saved gigs</Text>
      {savedGigsFromCurrentDate?.length === 0 ? <Text style={{fontFamily:'NunitoSans'}}>You haven't saved any gigs yet!</Text> : gigList}
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
    justifyContent: 'flex-start',
    marginTop: '10%',
    marginLeft:'7%'
  },
  username: {
    color: "black",
    fontSize: 25,
    fontFamily: "NunitoSans",
  },
  header: {
    color: "black",
    fontSize: 18,
    fontFamily: "LatoRegular",
    marginBottom: 16
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
});

export default Profile;
