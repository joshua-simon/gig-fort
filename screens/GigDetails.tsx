import { FC } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { A } from "@expo/html-elements";
import { gigDetailsProps } from "../routes/homeStack";
import { format } from "date-fns";

type GigDetailsScreenProp = gigDetailsProps['route']

interface Props {
  route:GigDetailsScreenProp
}

const GigDetails:FC<Props> = ({ route }):JSX.Element => {
  const { venue, gigName, image, isFree, genre, blurb, dateAndTime, tickets } =
    route.params;

  const free = isFree ? "|  Free Entry" : "";

  const isTicketed = tickets ? (
    <A style={styles.link} href={tickets}> 
      Tickets
    </A>
  ) : null;


  const date:string = format(new Date(dateAndTime.seconds * 1000),'EEE LLL do Y')

  const time:string = format(new Date(dateAndTime.seconds * 1000),'hbbb')

  return (
    <ScrollView style={styles.scrollview}>
      <View style={styles.container}>
        <Image style={styles.img} source={{ uri: image }} />
        <View>
          <Text style={styles.header_text}>{gigName}</Text>
          <View style={styles.subheader}>
            <View style={styles.text_icon}>
              <Entypo
                style={styles.icon}
                name="location-pin"
                size={15}
                color="#778899"
              />
              <Text style={styles.details_text}>{`${venue}  ${free}`}</Text>
            </View>
            <View style={styles.text_icon}>
              <Ionicons
                style={styles.icon}
                name="time-outline"
                size={15}
                color="#778899"
              />
              <Text
                style={styles.details_text}
              >{`${date} |  ${time}`}</Text>
            </View>
            <Text style={styles.details_text_genre}>{genre}</Text>
          </View>
        </View>
        <View style={styles.details}>
          <Text style={styles.details_blurb}>Details</Text>
          <Text style={styles.details_text}>{blurb}</Text>
        </View>
        {isTicketed}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  img: {
    height: 200,
    width: "auto",
  },
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "azure",
    padding: 15,
  },
  scrollview: {
    backgroundColor: "azure",
  },
  header_text: {
    fontSize: 30,
    fontFamily: "Sofia-Pro",
  },
  details: {
    flexDirection: "column",
    marginTop: 30,
  },
  details_text: {
    fontFamily: "Helvetica-Neue",
    fontSize: 15,
    color: "#778899",
  },
  details_text_genre: {
    fontFamily: "Helvetica-Neue",
    fontSize: 15,
    color: "#778899",
    fontStyle: "italic",
  },
  details_blurb: {
    fontFamily: "Sofia-Pro",
    fontSize: 20,
    color: "black",
  },
  text_icon: {
    flexDirection: "row",
    alignItems: "center",
  },
  subheader: {
    marginTop: 10,
  },
  icon: {
    marginRight: 2,
  },
  link: {
    backgroundColor: "#68912b",
    color: "white",
    fontFamily: "Helvetica-Neue",
    width: 100,
    textAlign: "center",
    marginTop: 20,
    borderRadius: 5,
  },
});

export default GigDetails;
