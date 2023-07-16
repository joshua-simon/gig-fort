import { useContext, useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Ionicons, AntDesign, Entypo } from "@expo/vector-icons";
import { AuthContext } from "../AuthContext";
import {
  incrementRecommendByOne,
  addRecommendedGigIDtoUser,
  removeLikedGig,
  addLikedGigs,
  addUserIdToGig,
  removeUserIdFromGig,
  decrementRecommendByOne,
  removeRecommendedGigIDfromUser
} from "../hooks/databaseFunctions";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { subHours, subMinutes, format } from "date-fns";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const GigCard = ({ item, isProfile, navigation }) => {
  const [isGigLiked, setIsGigLiked] = useState(false);
  const [recommended, setRecommended] = useState(0);
  const [currentUserRecommendedGigs, setCurrentUserRecommendedGigs] = useState(null);
  const [isRecommended, setIsRecommended] = useState(false); // <--- this is the new state
  const [notifications, setNotifications] = useState(false);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  const dateInSeconds = item.dateAndTime.seconds;
  const gigDate = new Date(dateInSeconds * 1000);
  const gigDateBefore = subHours(gigDate, 1);
  const formattedDate = format(gigDateBefore, "yyyy-MM-dd'T'HH:mm:ssxxx");

  const { user } = useContext(AuthContext);



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
  }, [recommended,currentUserRecommendedGigs]);

  const changeGig = (gigID: string) => {
    if (isGigLiked) {
      setIsGigLiked(false);
      removeLikedGig(gigID, user.uid);
    } else {
      setIsGigLiked(true);
      addLikedGigs(gigID, user.uid);
    }
  };

  const activateNotifications = (gigId: string) => {
    if (notifications) {
      setNotifications(false);
      removeUserIdFromGig(gigId, user.uid);
    } else {
      setNotifications(true);
      addUserIdToGig(gigId, user.uid);
    }
  };

  const toggleRecommendations = (gigID: string) => {
    if (currentUserRecommendedGigs.includes(gigID)) {
      setIsRecommended(false);
      decrementRecommendByOne(gigID)
      removeRecommendedGigIDfromUser(gigID, user.uid)
    } else {
      setIsRecommended(true);
      incrementRecommendByOne(gigID)
      addRecommendedGigIDtoUser(gigID, user.uid)
    }
  }

  {/* ----------------------------------------------------------------------------------------------------------------- */}
  const increaseRecommendations = (gigID: string) => {
    // console.log(gigID)
    if (!currentUserRecommendedGigs.includes(gigID)) {
      incrementRecommendByOne(gigID);
      addRecommendedGigIDtoUser(gigID, user.uid);
      setRecommended(recommended + 1);
    } else {
      console.log("already recommended");
    }
  };
{/* ----------------------------------------------------------------------------------------------------------------- */}

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
      const triggerDate = new Date(formattedDate);

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

    if (notifications) {
      schedulePushNotification();
    }

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [notifications]);

  const gigTitle =
    item.gigName.length > 30
      ? `${item.gigName.substring(0, 30)}...`
      : item.gigName;

  const isNotifications = notifications ? (
    <Ionicons name="notifications-sharp" size={24} color="#377D8A" />
  ) : (
    <Ionicons name="notifications-outline" size={24} color="#377D8A" />
  );

  const content = !isProfile ? (
    <View style={styles.gigCard_items}>
      <Text style={styles.gigCard_header}>{gigTitle}</Text>

      <View style={styles.venueDetails}>
        <Ionicons name="location-outline" size={14} color="black" />
        <Text style={styles.gigCard_details}>
          {item.venue} | {item.genre}
        </Text>
      </View>

      <View style={styles.imageAndBlurb}>
        <Image style={styles.gigCard_items_img} source={{ uri: item.image }} />
        <Text style={styles.blurbText}>{`${item.blurb.substring(
          0,
          60
        )}...`}</Text>

        <TouchableOpacity
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
          <Text style={styles.seeMore}>See more {`>`}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.recommendations}>
        <Text style={styles.recommendations_text}>{`  ${recommended} ${
          recommended == 1 ? "person has" : "people have"
        } recommended this gig`}</Text>
      </View>

      <View style={styles.saveAndNotificationButtons}>
        <View style={styles.saveAndNotificationButtons_button}>
          <TouchableOpacity
            onPress={() => changeGig(item.id)}
            style={{ marginRight: "10%" }}
          >
            {isGigLiked ? (
              <AntDesign name="heart" size={24} color="#377D8A" />
            ) : (
              <AntDesign name="hearto" size={24} color="#377D8A" />
            )}
          </TouchableOpacity>
          <Text style={styles.saveAndNotificationButtons_button_text}>
            Save
          </Text>
        </View>

        <View style={styles.saveAndNotificationButtons_button}>
          <TouchableOpacity
            onPress={() => activateNotifications(item.id)}
            style={{ marginRight: "10%" }}
          >
            {isNotifications}
          </TouchableOpacity>
          <Text style={styles.saveAndNotificationButtons_button_text}>
            Set reminder
          </Text>
        </View>

        <View style={styles.saveAndNotificationButtons_button}>                   
          <TouchableOpacity onPress={() => toggleRecommendations(item.id)}>
            {currentUserRecommendedGigs?.includes(item.id) ? <AntDesign name="like1" size={24} color="#377D8A" /> : <AntDesign name="like2" size={24} color="#377D8A" /> }
          </TouchableOpacity>
          <Text style={styles.saveAndNotificationButtons_button_text}>
            Recommend
          </Text>
        </View>
      </View>
    </View>
  ) : (
    <View style={styles.gigCard_items}>
      <Text style={styles.gigCard_header}>{gigTitle}</Text>
      <View style={styles.venueDetails}>
        <Ionicons name="location-outline" size={14} color="black" />
        <Text style={styles.gigCard_details}>
          {item.venue} | {item.genre}
        </Text>
      </View>
      <Text style={styles.seeMore}>See more {`>`}</Text>
      <TouchableOpacity onPress={() => changeGig(item.id)}>
        {isGigLiked ? (
          <AntDesign name="heart" size={24} color="#377D8A" />
        ) : (
          <AntDesign name="hearto" size={24} color="#377D8A" />
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
    flexDirection: "row",
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
  saveAndNotificationButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: "2%",
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: "#D3D3D3",
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
});

export default GigCard;
