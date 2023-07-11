import { useContext,useState,useEffect,useRef } from 'react';
import { StyleSheet,View,Image,Text,Platform,TouchableOpacity } from 'react-native'
import { Ionicons, AntDesign, Entypo  } from '@expo/vector-icons';
import { AuthContext } from '../AuthContext';
import { incrementRecommendByOne, addRecommendedGigIDtoUser,  removeLikedGig, addLikedGigs, addUserIdToGig, removeUserIdFromGig } from '../hooks/databaseFunctions';
import { doc,getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { subHours,subMinutes, format } from 'date-fns'
import * as Notifications from 'expo-notifications';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


const GigCard = ({item}) => {


  const [ isGigLiked, setIsGigLiked ] = useState(false)
  const [ recommended,setRecommended ] = useState(0)
  const [ currentUserRecommendedGigs,setCurrentUserRecommendedGigs ] = useState(null)
  const [ notifications,setNotifications ] = useState(false)
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  const dateInSeconds = item.dateAndTime.seconds
  const gigDate = new Date(dateInSeconds * 1000)
  const gigDateBefore = subHours(gigDate, 1);
  const formattedDate = format(gigDateBefore,"yyyy-MM-dd'T'HH:mm:ssxxx")


  const { user } = useContext(AuthContext)


    useEffect(() => {
      const fetchData = async () => {
        const gigRef = doc(db, "test", item.id);
        const gig = await getDoc(gigRef);
        const userRef = doc(db, "users", user.uid);
        const userDetails = await getDoc(userRef);

        setRecommended(gig.data().likes);

        if (gig.data().notifiedUsers.includes(user.uid)) {
          setNotifications(true);
        }

        if (userDetails.data().likedGigs.includes(item.id)) {
          setIsGigLiked(true);
        }

        setCurrentUserRecommendedGigs(userDetails.data().recommendedGigs);
      };
      fetchData();
    }, []);


    const changeGig = (gigID:string) => {
      if(isGigLiked){ 
        setIsGigLiked(false)
        removeLikedGig(gigID, user.uid)
      }else{
        setIsGigLiked(true) 
        addLikedGigs(gigID, user.uid)
      }
    }

    const activateNotifications = (gigId:string) => {
      if(notifications) {
        setNotifications(false)
        removeUserIdFromGig(gigId, user.uid)
      } else {
        setNotifications(true)
        addUserIdToGig(gigId, user.uid)
      }
    }

    
    const increaseRecommendations = (gigID:string) => {
      if(!currentUserRecommendedGigs.includes(gigID)){
        incrementRecommendByOne(gigID)
        addRecommendedGigIDtoUser(gigID, user.uid)
        setRecommended(recommended + 1)
      } else {
        console.log('already recommended')
      }
    }

      useEffect(() => {
        notificationListener.current =
          Notifications.addNotificationReceivedListener((notification) => {
            setNotification(notification);
          });

        responseListener.current =
          Notifications.addNotificationResponseReceivedListener((response) => {
            console.log(response);
          });

          // ----------------------------------------------

        const schedulePushNotification = async () => {

          const triggerDate  = new Date(formattedDate)

          await Notifications.scheduleNotificationAsync({
            content: {
              title: "You've got mail! 📬",
              body: "Here is the notification body",
              data: { data: "goes here" },
            },
            trigger: triggerDate,
          });
        };
           // ----------------------------------------------

        if (notifications){
          schedulePushNotification();
        }

        return () => {
          Notifications.removeNotificationSubscription(
            notificationListener.current
          );
          Notifications.removeNotificationSubscription(
            responseListener.current
          );
        };
      }, [notifications]);


      
      const gigTitle = item.gigName.length > 30 ? `${item.gigName.substring(0,30)}...` : item.gigName

      const isNotifications = notifications ? (
        <Ionicons name="notifications-sharp" size={24} color="black" />
      ) : (
        <Ionicons name="notifications-outline" size={24} color="black" />
      )
  


    return (
    <View style={styles.gigCard_items}>
        <Text style={styles.gigCard_header}>{gigTitle}</Text>
            <View style = {styles.venueDetails}>
                <Ionicons name="location-outline" size={14} color="black" />
                <Text style={styles.gigCard_details}>{item.venue}  |  {item.genre}</Text>
            </View>
            <View style = {styles.imageAndBlurb}>
                <Image style = {styles.gigCard_items_img} source = {{uri: item.image}}/>
                <Text style={styles.blurbText}>{`${item.blurb.substring(0,60)}...`}</Text>
            </View>
        <Text style = {styles.seeMore}>See more {`>`}</Text>    
            <TouchableOpacity
              onPress = {() => changeGig(item.id)}
            >
               {isGigLiked ? <AntDesign name="heart" size={24} color="black" /> : <AntDesign name="hearto" size={24} color="black" />}
            </TouchableOpacity>
            <TouchableOpacity
              onPress = {() => increaseRecommendations(item.id)}
            >
              <Entypo name="arrow-bold-up" size={24} color="black" />
            </TouchableOpacity>
            <Text>{`  ${recommended} ${recommended == 1 ? 'person has' : 'people have'} recommended this gig`}</Text>
            <TouchableOpacity
              onPress = {() => activateNotifications(item.id)}
            >
              {isNotifications}
            </TouchableOpacity>
    </View>
    )

}

const styles = StyleSheet.create({
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
    header: {
      padding: 10,
    },
    buttonContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      padding: 15,
    },
    touchable: {
      padding: 6,
    },
    gigCard_header: {
      fontFamily: "NunitoSans",
      fontSize: 18,
      lineHeight:24.55
    },
    gigCard_details: {
      fontFamily: "LatoRegular",
      color: "#000000",
      flexShrink: 1,
      fontSize:12,
      lineHeight:17.04
    },
    venueDetails:{
      flexDirection:'row',
      alignItems:'center'
    },
    date: {
      paddingLeft: 10,
      fontFamily: "Sofia-Pro",
      fontSize: 20,
      textDecorationLine: "underline",
    },
    gigCard_items: {
      flexDirection:'column',
    },
    gigCard_items_img:{
      height:85.63,
      width:100,
      borderRadius:8,
      marginRight:'3%'
    },
    imageAndBlurb:{
      flexDirection:'row',
      transform:[{translateY:15}]
    },
    seeMore:{
      textAlign:'right',
      fontFamily:'LatoRegular',
      fontSize:12,
      lineHeight:17.04,
      color:'#377D8A'
    },
    blurbText:{
      flex: 1,
      fontFamily:'LatoRegular',
      size:10,
      lineHeight:14.2
    }
  });

export default GigCard;



