import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { format, addDays, startOfDay, getUnixTime } from "date-fns";
import { getNextSevenDays } from '../util/helperFunctions'

const Carousel = ({ setSelectedDate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);


  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % 7);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + 7) % 7);
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

      {displayDates.map((date, index) => (
        <TouchableOpacity key={date} onPress={() => setSelectedDate(date)}>
          <Text 
            style = {styles.letter}
          >
            {formatDate(new Date(date))}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.nextButton} onPress={nextSlide}>
        <Text style={styles.buttonText}>&gt;</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    carousel: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      width: "100%",
      aspectRatio: 1,
      position:'absolute',
      top: 10,
      left: 10,
      right: 0,
      zIndex: 1,
    },
    letter: {
      fontSize: 15,
      fontWeight: "bold",
      textAlign: "center",
      color: 'white', // White text
      backgroundColor: 'lightblue', // Light blue background
      borderRadius: 50, // Make it round
      width: 60, // Fixed width
      height: 60, // Fixed height
      lineHeight: 100, // Center text vertically
    },
    prevButton: {
      position: "absolute",
      top: "50%",
      left: 0,
      transform: [{ translateY: -25 }],
      padding: 10,
      backgroundColor: "#f1f1f1",
    },
    nextButton: {
      position: "absolute",
      top: "50%",
      right: 0,
      transform: [{ translateY: -25 }],
      padding: 10,
      backgroundColor: "#f1f1f1",
    },
    buttonText: {
      fontSize: 24,
    },
  });
  

export default Carousel;
