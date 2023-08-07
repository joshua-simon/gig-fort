import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { format, addDays, startOfDay, getUnixTime,isSameDay } from "date-fns";
import { getNextSevenDays } from '../util/helperFunctions'

const Carousel = ({ setSelectedDate,selectedDate }) => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const currentDate = new Date()


  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % dates.length);
  };
  
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + dates.length) % dates.length);
  };
  

  const formatDate = (date) => {
    return format(date, "MMM dd");
  };

  const formatDateDay = (date) => {
    return format(date, "EEE")
  }



  const dates = getNextSevenDays();

  const displayDates = [
    dates[(currentIndex - 1 + dates.length) % dates.length], // previous date
    dates[currentIndex], // current date
    dates[(currentIndex + 1) % dates.length] // next date
  ];



  return (
    <View style={styles.carousel}>
      <TouchableOpacity style={styles.prevButton} onPress={prevSlide}>
        <Text style={styles.buttonText}>&lt;</Text>
      </TouchableOpacity>

      <View style = {styles.displayedDates}>
      {displayDates.map((date, index) => (
        <TouchableOpacity onPress={() => setSelectedDate(date)} key = {index} >
          <View style = {[
            styles.dateContainer,
            {backgroundColor: isSameDay(date,selectedDate) ? '#2596be' : 'rgb(55, 125, 138)' }
          ]}>
            <View style = {{alignItems:'center', justifyContent:'center'}}>
              <Text style = {styles.date_header}>
                {formatDateDay(new Date(date))}
              </Text>
              <Text style = {styles.date_subheader}>
                {formatDate(new Date(date))}
              </Text>
            </View>
          </View>
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
    },
    date: {
      fontSize: 15,
      fontWeight: "400",
      color: 'white',
      fontFamily: "NunitoSans", 
    },
    date_header:{
      color:'white',
      fontFamily:"NunitoSans",
      fontSize:20,
      textAlign:'center',
    },
    date_subheader:{
      color:'white',
      fontFamily:"NunitoSans",
      marginTop:-3,
      fontSize:14,
      fontWeight:'600'
    },
    dateContainer: {
      borderRadius: 50, 
      width: 70, 
      height: 70, 
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
      padding: 10,
    },
    nextButton: {
      padding: 10,
    },
    buttonText: {
      fontSize: 36,
      fontWeight:'bold',
      color:'black'
    },
  });
  

export default Carousel;