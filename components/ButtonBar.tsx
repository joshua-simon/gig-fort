import { useContext, useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Ionicons, AntDesign, Entypo, FontAwesome } from "@expo/vector-icons";

const ButtonBar = () => {
  const content = (
    <View style={styles.saveAndNotificationButtons}>
      <View style={styles.saveAndNotificationButtons_button}>
        <TouchableOpacity
          onPress={() =>
            alert("Please sign in to like and save gigs")
          }
        >
          <AntDesign name="hearto" size={24} color="#377D8A" />
        </TouchableOpacity>
        <Text style={styles.saveAndNotificationButtons_button_text}>Like</Text>
      </View>

      <View style={styles.saveAndNotificationButtons_button}>
        <TouchableOpacity
          onPress={() =>
            alert("Please sign in to like, save, and set reminders for gigs")
          }
        >
          <FontAwesome name="bookmark-o" size={24} color="#377D8A" />
        </TouchableOpacity>
        <Text style={styles.saveAndNotificationButtons_button_text}>Save</Text>
      </View>

    </View>
  );

  return <View>{content}</View>;
};
const styles = StyleSheet.create({
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
});

export default ButtonBar;
