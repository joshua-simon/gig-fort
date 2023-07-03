import { FC, useContext, useState, useEffect,useRef } from "react";
import { View, Text, Modal, Animated, StyleSheet,Platform } from "react-native";
import { useGigs } from "../hooks/useGigs";
import { AuthContext } from "../AuthContext";
import { useGetUser } from "../hooks/useGetUser";
import { Button } from "react-native";
import { auth } from "../firebase";
import { signOut, deleteUser } from "firebase/auth";
import { profileProps } from "../routes/homeStack";

// ------------------------------------------------------
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
// ------------------------------------------------------

type ProfileScreenNavigationProp = profileProps["navigation"];


interface Props {
  navigation: ProfileScreenNavigationProp;
}

// ------------------------------------------------------
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
// ------------------------------------------------------

const Profile: FC<Props> = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteUserModalVisible, setdeleteUserModalVisible] = useState(false);


// ------------------------------------------------------  
  const [notification, setNotification] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState('');
  const notificationListener = useRef();
  const responseListener = useRef();
// ------------------------------------------------------


  const gigs = useGigs();

  const { user } = useContext(AuthContext);

  const userDetails = useGetUser(user?.uid);

  const { firstName, lastName, email } = userDetails || {};

  const gigIDs = userDetails?.likedGigs;

  const savedGigs = gigs.filter((gig) => gigIDs?.includes(gig.id));

// ------------------------------------------------------ 
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    const schedulePushNotification = async () => {
      const notificationDate = new Date('2023-07-03T14:08:00+12:00');
      console.log(notificationDate);
  
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "You've got mail! 📬",
          body: 'Here is the notification body',
          data: { data: 'goes here' },
        },
        trigger: notificationDate,
      });
    };
  
    schedulePushNotification();

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
// ------------------------------------------------------ 

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const toggleDeleteUserModal = () => {
    setdeleteUserModalVisible(!deleteUserModalVisible);
  };

  const signUserOut = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out");
        navigation.navigate("Map");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteUserAccount = () => {
    deleteUser(auth.currentUser)
      .then(() => {
        console.log("User deleted");
        navigation.navigate("Map");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <View>
      <Text>
        {firstName} {lastName}
      </Text>
      {savedGigs?.map((gig) => (
        <Text key={gig.id}>{gig.gigName}</Text>
      ))}

      <View>
        <Button title="Logout" onPress={toggleModal} />
        <Button
          title="Edit details"
          onPress={() =>
            navigation.navigate("EditDetails", {
              firstName,
              lastName,
              UID: user?.uid,
            })
          }
        />
        <Button title="Delete account" onPress={toggleDeleteUserModal} />
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={toggleModal}
      >
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <View style={{ backgroundColor: "white", padding: 20 }}>
            <Text>Are you sure you want to log out?</Text>
            <Button title="Log out" onPress={signUserOut} />
            <Button title="Return to profile" onPress={toggleModal} />
          </View>
        </View>
      </Modal>

      <Modal
        visible={deleteUserModalVisible}
        animationType="slide"
        onRequestClose={toggleDeleteUserModal}
      >
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <View style={{ backgroundColor: "white", padding: 20 }}>
            <Text>Are you sure you want to delete your account?</Text>
            <Button title="Delete account" onPress={deleteUserAccount} />
            <Button title="Return to profile" onPress={toggleDeleteUserModal} />
          </View>
        </View>
      </Modal>

      {/* // ------------------------------------------------------ */}
      {/* <Button
        title="Press to schedule a notification"
        onPress={async () => {
          await schedulePushNotification();
        }}
      /> */}
    {/* //------------------------------------------------------------------- */}


    </View>
  );

  // ------------------------------------------------------
  // async function schedulePushNotification() {

  //   const notificationDate = new Date('2023-07-03T12:58:00')
  //   console.log(notificationDate)

  //   await Notifications.scheduleNotificationAsync({
  //     content: {
  //       title: "You've got mail! 📬",
  //       body: 'Here is the notification body',
  //       data: { data: 'goes here' },
  //     },
  //     trigger: notificationDate,
  //   });
  // }
// ------------------------------------------------------

  // ------------------------------------------------------
  async function registerForPushNotificationsAsync() {
    let token;
  
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
  
    return token;
  }
// ------------------------------------------------------

};

export default Profile;
