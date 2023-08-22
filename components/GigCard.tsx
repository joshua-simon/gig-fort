import { useContext, useState, useEffect, useRef,FC } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  Platform,
  TouchableOpacity,
} from "react-native"; 
import { AuthContext } from "../AuthContext";
import { subHours, subMinutes, format, set,getDate } from "date-fns";
import * as Notifications from "expo-notifications";
import { useGigData } from "../hooks/useGigData";
import NotificationIcon from "../assets/notification_logo.png"
import { GigObject } from "../routes/homeStack";
import * as Device from 'expo-device';
import GigCardProfile from "./GigCardContent";


interface Props {
  item: GigObject ;
  isProfile?: boolean;
  navigation?: any;
}

const GigCard:FC<Props> = ({ item, isProfile, navigation }) => {

  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const [notificationId, setNotificationId] = useState<string | null>(null);
  const [expoPushToken, setExpoPushToken] = useState('');
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  const dateInSeconds = item?.dateAndTime?.seconds || 0;
  const defaultDate = new Date();
  const gigDate = dateInSeconds !== 0 ? new Date(dateInSeconds * 1000) : defaultDate;
  const gigDateBefore = subHours(gigDate, 1);
  let formattedDate = format(gigDateBefore, "yyyy-MM-dd'T'HH:mm:ssxxx");

  if (formattedDate === 'Invalid Date') {
    formattedDate = format(defaultDate, "yyyy-MM-dd'T'HH:mm:ssxxx");
}

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
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
  },[])

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
  }, []); 


  
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
  
        const identifier = await Notifications.scheduleNotificationAsync({
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
        setNotificationId(identifier);
      } catch (error) {
        console.error('Failed to schedule notification', error);
      }
    };
    
  
    if (notifications && !notificationId) {
      try {
        schedulePushNotification();
      } catch (error) {
        console.error("Error encountered while scheduling push notification:", error);
      }
    }

    if (!notifications && notificationId) {
      try {
        Notifications.cancelScheduledNotificationAsync(notificationId);
        setNotificationId(null);
      } catch (error) {
        console.error("Error encountered while canceling push notification:", error);
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

  const notificationPopup = isPopupVisible ? (
    <Text style = {styles.reminderPopup}>Reminder notification set for one hour before gig</Text>
  ) : null


  return (
    <GigCardProfile 
    item = {item} 
    dayOfMonth={dayOfMonth} 
    monthName={monthName} 
    toggleSaveGig={toggleSaveGig} 
    isGigSaved={isGigSaved}
    navigation = {navigation}
    isProfile = {isProfile}
    user = {user}
    notificationPopup = {notificationPopup}
    likes = {likes}
    isGigLiked = {isGigLiked}
    toggleLiked = {toggleLiked}
    notifications = {notifications}
    toggleNotifications = {toggleNotifications}
    />
  )
};


const styles = StyleSheet.create({
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