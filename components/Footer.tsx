import React, { useState,useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Ionicons, Feather, FontAwesome } from '@expo/vector-icons';
import { useFocusEffect,useRoute } from '@react-navigation/native';

const Footer = ({ navigation }) => {
  const route = useRoute();
  const [selectedMap, setSelectedMap] = useState(route.name === 'Map');
  const [selectedList, setSelectedList] = useState(route.name === 'List');

  useFocusEffect(
    useCallback(() => {
      setSelectedMap(route.name === 'Map');
      setSelectedList(route.name === 'List');
    }, [route])
  );

  const toggleStateMap = () => {

      setSelectedMap(true);
      setSelectedList(false);
      navigation.navigate('Map');

  };

  const toggleStateList = () => {

      setSelectedMap(false);
      setSelectedList(true);
      navigation.navigate('List');

  };

  return (
    <View style={styles.footer}>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={toggleStateList}>
          {selectedList ? (  
            <FontAwesome name="list-ul" size={24} color="#377D8A" />
          ) : (
            <Feather name="list" size={24} color="black" />
          )}
        </TouchableOpacity>
        <Text style={styles.buttonLabel}>Gig List</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={toggleStateMap}>
          {selectedMap ? (
            <Ionicons name="md-map" size={24} color="#377D8A" />
          ) : (
            <Ionicons name="md-map-outline" size={24} color="black" />
          )}
        </TouchableOpacity>
        <Text style={styles.buttonLabel}>Gig Map</Text>
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    backgroundColor: '#F7F6F5',
    height: '8%',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopColor: '#d3d3d3',
    borderTopWidth: 1,
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  buttonLabel: {
    fontFamily: 'LatoRegular',
    color: '#747474',
  },
});

export default Footer;
