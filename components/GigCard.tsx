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
import { useGigData } from "../hooks/useGigData";
import { GigObject } from "../routes/homeStack";
import * as Device from 'expo-device';
import GigCardProfile from "./GigCardContent";


interface Props {
  item: GigObject ;
  isProfile?: boolean;
  navigation?: any;
}

const GigCard:FC<Props> = ({ item, isProfile, navigation }) => {


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
    isGigLiked,
    isPopupVisible
  } = useGigData(item?.id, user?.uid);


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
    likes = {likes}
    isGigLiked = {isGigLiked}
    toggleLiked = {toggleLiked}
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