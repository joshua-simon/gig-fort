import { useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image
} from "react-native";
import { useGigs } from "../hooks/useGigs";

const ListByDay = ({ navigation }) => {
  const [selectedDateMs, setSelectedDateMs] = useState(Date.now());
  const [showWeek, setShowByWeek] = useState(false);
  const gigs  = useGigs();


  //generates current date in format 'Tue Dec 20 2022'
  const selectedDateString = useMemo(() => {
    const date = new Date(selectedDateMs);
    const dateToString = date.toString().slice(0,15)
    return dateToString // returns in form 'Tue Dec 20 2022'
  }, [selectedDateMs]);


  //Filtering through gigs to return only current day's gigs
  const gigsToday = gigs.filter((gig) => {
    const gigDate1 = new Date(gig.dateAndTime.seconds*1000)   
    const gigDate2 = gigDate1.toString().slice(0,15) //return form 'Tue Dec 20 2022'
    return gigDate2 === selectedDateString
  })


  //Generating date a week from current date
  const weekFromNow = selectedDateMs + 1000 * 60 * 60 * 24 * 7;

  //Generate current date
  const dateNow = Date.now()

  //Filtering through gigs and returning gigs for week after current date
  const gigsThisWeek = gigs.filter((gig) => {
    return gig.dateAndTime.seconds*1000 < weekFromNow && gig.dateAndTime.seconds*1000 >= dateNow
  })


  //group gigs by date
  const gigsThisWeek_grouped = gigsThisWeek.reduce((acc, curr) => {
    if (acc[curr.dateAndTime.seconds]) {
      acc[curr.dateAndTime.seconds].push(curr);
    } else {
      acc[curr.dateAndTime.seconds] = [curr];
    }
    return acc;
  }, {});

  //return gigs for week starting on current day
  const gigs_week = (
    <View>
      {Object.keys(gigsThisWeek_grouped).map((item, i) => {
        const date = new Date(item * 1000).toString().slice(0, 15);
        return (
          <>
            <Text key={i} style={styles.date}>
              {date}
            </Text>
            {gigsThisWeek_grouped[item].map((val, i) => (
              <TouchableOpacity
                style={styles.gigCard}
                key={i}
                onPress={() =>
                  navigation.navigate("GigDetails", {
                    venue: val.venue,
                    gigName: val.gigName,
                    image: val.image,
                  })
                }
              >
                <View style={styles.gigCard_items}>
                  <Image
                    style={styles.gigCard_items_img}
                    source={require("../assets/Icon_Gold_48x48.png")}
                  />
                  <View>
                    <Text style={styles.gigCard_header}>{val.gigName}</Text>
                    <Text style={styles.gigCard_details}>{val.venue}</Text>
                    {/* <Text style={styles.gigCard_details}>{val.time}</Text> */}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </>
        );
      })}
    </View>
  );

  //return current day's gigs
  const gigs_day = (
    <FlatList
      data={gigsToday}
      keyExtractor={item => item.venue}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.gigCard}
          onPress={() =>
            navigation.navigate("GigDetails", {
              venue: item.venue,
              gigName: item.gigName,
              blurb: item.blurb,
              isFree: item.isFree,
              image: item.image,
              genre:item.genre,
              dateAndTime: item.dateAndTime.seconds
            })
          }
        ><View style = {styles.gigCard_items}>
          <Image style = {styles.gigCard_items_img} source = {require('../assets/Icon_Gold_48x48.png')}/>
          <View>
          <Text style={styles.gigCard_header}>{item.gigName}</Text>
          <Text style={styles.gigCard_details}>{item.venue}</Text>
          {/* <Text style={styles.gigCard_details}>{item.time}</Text> */}
          </View>
        </View>
        </TouchableOpacity>
      )}
    />
  );

  //conditionally renderes either gig list by day or list by week
  const gigsToRender = showWeek ? gigs_week : gigs_day;

  //conditionally render background color for button being pressed
  let buttonColorToday;
  let buttonColorWeek;
  if (!showWeek) {
    buttonColorToday = {
      backgroundColor: "#68912b",
      padding: 5,
      color: "white",
      fontFamily: "Helvetica-Neue",
      borderRadius: 5,
    };
    buttonColorWeek = null;
  } else {
    buttonColorToday = null;
    buttonColorWeek = {
      backgroundColor: "#68912b",
      padding: 5,
      color: "white",
      fontFamily: "Helvetica-Neue",
      borderRadius: 5,
    };
  }

  return (
    <View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => setShowByWeek(false)}
          style={styles.touchable}
        >
          <Text style={buttonColorToday}>Gigs today</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowByWeek(true)}
          style={styles.touchable}
        >
          <Text style={buttonColorWeek}>Gigs this week</Text>
        </TouchableOpacity>
      </View>
      {gigsToRender}
    </View>
  );
};

const styles = StyleSheet.create({
  gigCard: {
    marginBottom: 5,
    padding: 10,
  },
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
    fontFamily: "Sofia-Pro",
    fontSize: 17,
  },
  gigCard_details: {
    fontFamily: "Helvetica-Neue",
    color: "#778899",
  },
  date: {
    paddingLeft: 10,
    fontFamily: "Sofia-Pro",
    fontSize: 20,
    textDecorationLine: "underline",
  },
  gigCard_items: {
    flexDirection:'row',
    alignItems:'center'
  },
  gigCard_items_img:{
    height:30,
    width:30
  }
});

export default ListByDay;
