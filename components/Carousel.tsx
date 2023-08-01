import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet,Animated } from "react-native";
import { format, addDays, startOfDay, getUnixTime,isSameDay } from "date-fns";
import { getNextSevenDays } from '../util/helperFunctions'

const Carousel = ({ setSelectedDate,selectedDate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentDate = new Date()
  const slideAnim = new Animated.Value(0);

  const slideValue = 60;

const translateX = slideAnim.interpolate({
  inputRange: [-1, 0, 1],
  outputRange: [-slideValue, 0, slideValue],
});



const nextSlide = () => {
  setCurrentIndex((prevIndex) => (prevIndex + 1) % 7);
  Animated.timing(slideAnim, {
    toValue: 1,
    duration: 300,
    useNativeDriver: true,
  }).start(() => {
    slideAnim.setValue(0);
  });
};

const prevSlide = () => {
  setCurrentIndex((prevIndex) => (prevIndex - 1 + 7) % 7);
  Animated.timing(slideAnim, {
    toValue: -1,
    duration: 300,
    useNativeDriver: true,
  }).start(() => {
    slideAnim.setValue(0);
  });
};


  const formatDate = (date) => {
    return format(date, "MMM dd");
  };



  const dates = getNextSevenDays();
  const displayDates = [
    dates[(currentIndex - 1 + 7) % 7], // previous date
    dates[currentIndex], // current date
    dates[(currentIndex + 1) % 7] // next date
  ];



  return (
    <View style={styles.carousel}>
      <TouchableOpacity style={styles.prevButton} onPress={prevSlide}>
        <Text style={styles.buttonText}>&lt;</Text>
      </TouchableOpacity>

      <View style = {styles.displayedDates}>
      {displayDates.map((date, index) => (
        <TouchableOpacity onPress={() => setSelectedDate(date)}  >
          <Animated.View style = {[
            styles.dateContainer,
            {backgroundColor: isSameDay(date,selectedDate) ? 'lightblue' : 'rgb(55, 125, 138)' },
            {transform: [{ translateX }]},
          ]}>
          <Text 
            style={styles.date}
          >
            {formatDate(new Date(date))}
          </Text>
          </Animated.View>
        </TouchableOpacity>
      ))}
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={nextSlide}>
        <Text style={styles.buttonText}>&gt;</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    carousel: {
      flex:1,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      width: "100%",
      position:'absolute',
      zIndex: 1,
      alignSelf: 'center',
      left: 0
      // backgroundColor: 'rgba(55, 125, 138,0.8)',
    },
    date: {
      fontSize: 15,
      fontWeight: "400",
      color: 'white',
      fontFamily: "NunitoSans", 
    },
    dateContainer: {
      borderRadius: 50, 
      width: 60, 
      height: 60, 
      lineHeight: 100,
      backgroundColor: 'rgb(55, 125, 138)', 
      alignItems:'center',
      justifyContent:'center',


    },
    displayedDates:{
      flex:1,
      flexDirection:'row',
      justifyContent:'space-evenly',
      width:'100%'
    },
    prevButton: {
      // position: "absolute",
      // top: "50%",
      // left: 0,
      // transform: [{ translateY: -25 }],
      padding: 10,
      backgroundColor: 'rgba(55, 125, 138,0.8)',
    },
    nextButton: {
      // position: "absolute",
      // top: "50%",
      // right: 0,
      // transform: [{ translateY: -25 }],
      padding: 10,
      backgroundColor: 'rgba(55, 125, 138,0.8)',
    },
    buttonText: {
      fontSize: 28,
      fontWeight:'bold',
      color:'white'
    },
  });
  

export default Carousel;
