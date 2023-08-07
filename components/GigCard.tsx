import { useContext, useState, useEffect, useRef,FC } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  Platform,
  TouchableOpacity,
} from "react-native"; 
import { Ionicons, AntDesign, Entypo,FontAwesome } from "@expo/vector-icons";
import { AuthContext } from "../AuthContext";
import { subHours, subMinutes, format, set,getDate } from "date-fns";
import * as Notifications from "expo-notifications";
import { useGigData } from "../hooks/useGigData";
import ButtonBar from "./ButtonBar";
import NotificationIcon from "../assets/notification_logo.png"
import { IGigs } from "../hooks/useGigs";
import * as Device from 'expo-device';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

interface Props {
  item: IGigs;
  isProfile?: boolean;
  navigation?: any;
}

const GigCard:FC<Props> = ({ item, isProfile, navigation }) => {



  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const [expoPushToken, setExpoPushToken] = useState('');
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  const dateInSeconds = item?.dateAndTime?.seconds || 0;
  const gigDate = new Date(dateInSeconds * 1000);
  const gigDateBefore = subHours(gigDate, 1);
  const formattedDate = format(gigDateBefore, "yyyy-MM-dd'T'HH:mm:ssxxx");

  const dateObject = new Date(gigDate);
  const dayOfMonth = getDate(dateObject);
  const monthName = format(new Date(gigDate), 'LLL');


  const { user } = useContext(AuthContext);

  const {
    isGigSaved,
    toggleSaveGig,
    likes,
    toggleLiked,
    notifications,
    toggleNotifications,
    isGigLiked,
    isPopupVisible
  } = useGigData(item?.id, user?.uid);


  useEffect(() => {
    // This logic should only run once when the component mounts
    registerForPushNotificationsAsync().then(token => {
      setExpoPushToken(prevToken => token || prevToken);
    });
  
    notificationListener.current = 
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });
  
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });
  
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []); // Empty dependency list
  
  useEffect(() => {
    const isValidDate = (date) => {
      return date instanceof Date && !isNaN(date.getTime());
    }
  
    const schedulePushNotification = async () => {
      try {
        const triggerDate = new Date(formattedDate);
  
        if (!isValidDate(triggerDate)) {
          console.warn("Invalid trigger date for notification:", formattedDate);
          return;
        }
  
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Gig reminder",
            body: `Your gig at ${item?.venue} starts in 1 hour!`,
            data: { data: "goes here" },
            android: {
              channelId: 'gig-reminder',
              icon: NotificationIcon
            }
          } as Notifications.NotificationContentInput,
          trigger: triggerDate,
        });
      } catch (error) {
        console.error('Failed to schedule notification', error);
      }
    };
  
    if (notifications) {
      try {
        schedulePushNotification();
      } catch (error) {
        console.error("Error encountered while scheduling push notification:", error);
      }
    }
  
  }, [notifications]); // Depend on notifications

async function registerForPushNotificationsAsync() {
  let token;

  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  } catch (error) {
    console.error("Error encountered during push notification registration:", error);
  }

  return token;
}


  const gigTitle =
    item?.gigName.length > 30
      ? `${item?.gigName.substring(0, 30)}...`
      : item?.gigName;


  const notificationPopup = isPopupVisible ? (
    <Text style = {styles.reminderPopup}>Reminder notification set for one hour before gig</Text>
  ) : null



  const content = !isProfile ? (
    <View style={styles.gigCard_items}>

      <View style = {{flexDirection:'row',justifyContent:'space-between'}}>
        <View style = {{flexDirection:'column'}}>
          <Text style={styles.gigCard_header}>{gigTitle.length > 23 ? `${gigTitle.substring(0,22)}...` : gigTitle }</Text>
          {notificationPopup}

          <View style={styles.venueDetails}>
            <Ionicons name="location-outline" size={14} color="black" />
            <Text style={styles.gigCard_details}>
              {item?.venue} | {item?.genre.length > 20 ? `${item?.genre.substring(0, 20)}...` : item?.genre}
            </Text>
          </View>
        </View>

          <View style = {styles.dateBox}>
            <Text style = {styles.dateBox_day}>{dayOfMonth}</Text>
            <Text style = {styles.dateBox_month}>{monthName}</Text>
          </View>

      </View>

      <View style={styles.imageAndBlurb}>
        { item.image ? <Image style={styles.gigCard_items_img} source={{ uri: item?.image }} /> : null}
        <Text style={styles.blurbText}>{`${item?.blurb.substring(
          0,
          60
        )}...`}</Text>

        <TouchableOpacity
          onPress={() => {
            try {
              navigation.navigate("GigDetails", {
                venue: item?.venue,
                gigName: item?.gigName,
                blurb: item?.blurb,
                isFree: item?.isFree,
                image: item?.image,
                genre: item?.genre,
                dateAndTime: { ...item?.dateAndTime },
                tickets: item?.tickets,
                ticketPrice: item?.ticketPrice,
                address: item?.address,
                links: item?.links,
                gigName_subHeader: item?.gigName_subHeader,
                id: item?.id,
              })
            } catch ( error ) {
              console.error('Error during navigation:', error);
            }
          }
          }
        >
          <Text style={styles.seeMore}>See more {`>`}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.recommendations}>
        <Text style={styles.recommendations_text}>{`  ${likes} ${
          likes == 1 ? "person has" : "people have"
        } liked this gig`}</Text>
      </View>

    {user ? (
            <View style={styles.saveAndNotificationButtons}>
            <View style={styles.saveAndNotificationButtons_button}>
              <TouchableOpacity onPress={() => toggleLiked(item?.id)}>
                {isGigLiked ? (
                  <AntDesign name="heart" size={24} color="#377D8A" />
                ) : (
                  <AntDesign name="hearto" size={24} color="#377D8A" />
                )}
              </TouchableOpacity>
              <Text style={styles.saveAndNotificationButtons_button_text}>
                Like
              </Text>
            </View>
    
            <View style={styles.saveAndNotificationButtons_button}>
              <TouchableOpacity onPress={() => toggleSaveGig(item?.id)}>
                {isGigSaved ? (
                  <FontAwesome name="bookmark" size={24} color="#377D8A" />
                ) : (
                  <FontAwesome name="bookmark-o" size={24} color="#377D8A" />
                )}
              </TouchableOpacity>
              <Text style={styles.saveAndNotificationButtons_button_text}>
                Save
              </Text>
            </View>
    
            <View style={styles.saveAndNotificationButtons_button}>
              <TouchableOpacity onPress={() => toggleNotifications(item?.id)}>
                {notifications ? (
                  <Ionicons name="notifications-sharp" size={24} color="#377D8A" />
                ) : (
                  <Ionicons
                    name="notifications-outline"
                    size={24}
                    color="#377D8A"
                  />
                )}
              </TouchableOpacity>
              <Text style={styles.saveAndNotificationButtons_button_text}>
                Reminder
              </Text>
            </View>
          </View>
    ) : (
      <ButtonBar/>
    )}

    </View>
  ) : (
    <View style={styles.gigCard_items}>
      <View style = {{flexDirection:'row',justifyContent:'space-between'}}>
        <View style = {{flexDirection:'column'}}>
          <Text style={styles.gigCard_header}>{gigTitle.length > 20 ? `${gigTitle.substring(0,19)}...` : gigTitle }</Text>

          <View style={styles.venueDetails}>
            <Ionicons name="location-outline" size={14} color="black" />
            <Text style={styles.gigCard_details}>
              {item?.venue} | {item?.genre.length > 15 ? `${item?.genre.substring(0, 14)}...` : item?.genre}
            </Text>
          </View>
        </View>

          <View style = {styles.dateBox}>
            <Text style = {styles.dateBox_day}>{dayOfMonth}</Text>
            <Text style = {styles.dateBox_month}>{monthName}</Text>
          </View>

      </View>
      <Text style={styles.seeMore}>See more {`>`}</Text>
      <TouchableOpacity onPress={() => toggleSaveGig(item?.id)}>
        {isGigSaved ? (
          <FontAwesome name="bookmark" size={24} color="#377D8A" />
        ) : (
          <FontAwesome name="bookmark-o" size={24} color="#377D8A" />
        )}
      </TouchableOpacity>
    </View>
  );

  return <View>{content}</View>;
};


const styles = StyleSheet.create({
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
    lineHeight: 24.55,
  },
  gigCard_details: {
    fontFamily: "LatoRegular",
    color: "#000000",
    flexShrink: 1,
    fontSize: 12,
    lineHeight: 17.04,
  },
  venueDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  date: {
    paddingLeft: 10,
    fontFamily: "Sofia-Pro",
    fontSize: 20,
    textDecorationLine: "underline",
  },
  gigCard_items: {
    flexDirection: "column",
  },
  gigCard_items_img: {
    height: 85.63,
    width: 100,
    borderRadius: 8,
    marginRight: "3%",
  },
  imageAndBlurb: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    transform: [{ translateY: 15 }],
    marginBottom: 20,
  },
  seeMore: {
    textAlign: "right",
    fontFamily: "LatoRegular",
    fontSize: 12,
    lineHeight: 17.04,
    color: "#377D8A",
  },
  blurbText: {
    flex: 1,
    fontFamily: "LatoRegular",
    size: 10,
    lineHeight: 14.2,
  },

  recommendations: {
    flexDirection: "column",
  },
  recommendations_text: {
    fontFamily: "LatoRegular",
    color: "#747474",
    marginTop: "2%",
    marginBottom: "1%",
  },
  saveAndNotificationButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: "2%",
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: "#D3D3D3",
  },
  saveAndNotificationButtons_button: {
    flexDirection: "column",
    alignItems: "center",
  },
  saveAndNotificationButtons_button_text: {
    // textAlign:'right',
    fontFamily: "LatoRegular",
    fontSize: 12,
    lineHeight: 17.04,
    color: "#377D8A",
  },
  dateBox: {
    width:42,
    height:40,
    flexShrink:0,
    borderRadius:4,
    backgroundColor:'#659AA3',
    alignItems:'center',
  },
  dateBox_day:{
  fontFamily:'NunitoSans',
  fontSize:16,

  },
  dateBox_month:{
    fontFamily:'NunitoSans',
    fontSize:12,
  },
  reminderPopup: {
    position:'absolute',
    left:'20%', 
    color:"white", 
    backgroundColor:'#000000',
    fontFamily:'LatoRegular',
    fontSize:14,
    padding:'3%',
    borderRadius:8,
    zIndex: 1
  }
});

export default GigCard;