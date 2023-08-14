import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { format, addDays, startOfDay, getUnixTime,isSameDay } from "date-fns";
import { getNextSevenDays } from '../util/helperFunctions'

const Carousel = ({ setSelectedDate,selectedDate }) => {

    const itemWidth = 80;

    const formattedDates = getNextSevenDays()

    const items = [...formattedDates, ...formattedDates, ...formattedDates];

    // Set the initial index to the middle of the duplicated array
    const initialIndex = formattedDates.length;
    const [slideAnim] = useState(new Animated.Value(-initialIndex * itemWidth));
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    const nextSlide = () => {
        Animated.timing(slideAnim, {
            toValue: -(currentIndex + 1) * itemWidth,
            duration: 500,
            useNativeDriver: true,
        }).start(() => {
            setCurrentIndex((prevIndex) => {
                if (prevIndex >= items.length - 2) {
                    slideAnim.setValue(-formattedDates.length * itemWidth);
                    return formattedDates.length;
                }
                return prevIndex + 1;
            });
        });
    };

    const prevSlide = () => {
        Animated.timing(slideAnim, {
            toValue: -(currentIndex - 1) * itemWidth,
            duration: 500,
            useNativeDriver: true,
        }).start(() => {
            setCurrentIndex((prevIndex) => {
                if (prevIndex <= 1) {
                    slideAnim.setValue(-2 * formattedDates.length * itemWidth);
                    return 2 * formattedDates.length;
                }
                return prevIndex - 1;
            });
        });
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.prevButton} onPress={prevSlide}>
                <Text style={styles.buttonText}>&lt;</Text>
            </TouchableOpacity>

            <View style={styles.carousel}>
                <Animated.View style={[styles.slider, { transform: [{ translateX: slideAnim }] }]}>
                    {items.map((date, index) => (
                        <TouchableOpacity key={index} style={styles.itemContainer} onPress = {() => setSelectedDate(date)}>
                            <View style = {[
                                    styles.dateContainer,
                                    {backgroundColor: isSameDay(date,selectedDate) ? '#2596be' : 'rgb(55, 125, 138)' }
                                ]}>
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Text style={styles.date_header}>{format(date, "EEE")}</Text>
                                    <Text style={styles.date_subheader}>
                                        {format(date, "d")} {format(date, "MMM")}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </Animated.View>
            </View>

            <TouchableOpacity style={styles.nextButton} onPress={nextSlide}>
                <Text style={styles.buttonText}>&gt;</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
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
    carousel: {
        width: 240,   // 3 times the itemWidth
        overflow: 'hidden',
    },
    displayedDates:{
        flex:1,
        flexDirection:'row',
        justifyContent:'space-evenly',
        width:'100%',

      },
    slider: {
        flexDirection: 'row',
    },
    itemContainer: {
        width: 80,
        justifyContent: 'center',
        alignItems: 'center',
        height: 90,
    },
    arrowButton: {
        fontSize: 20,
        marginHorizontal: 15,
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
