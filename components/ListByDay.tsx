import { FC } from "react";
import { useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from "react-native";
import { useGigs } from "../hooks/useGigs";
import GigsByDay from "./GigsByDay";
import GigsByWeek from "./GigsByWeek";
import { format,addDays } from "date-fns";
import { listProps } from "../routes/homeStack";

type ListScreenNavigationProp = listProps['navigation']

interface Props {
  navigation:ListScreenNavigationProp
}

const ListByDay:FC<Props> = ({ navigation }):JSX.Element => {

  const [currentDateMs, setCurrentDateMs] = useState<number>(Date.now());
  const [showWeek, setShowByWeek] = useState<boolean>(false);
  const gigs  = useGigs();



  //Filtering through gigs to return only current day's gigs
  const gigsToday = gigs.filter((gig) => { 
    const formattedDate = format(new Date(currentDateMs), 'do MMMM Y')
    const formattedGigDate = format(new Date(gig.dateAndTime.seconds*1000) ,'do MMMM Y')
    return formattedGigDate === formattedDate
  })

  //Generating date a week from current date
  const weekFromNow = addDays(currentDateMs,7)


  //Filtering through gigs and returning gigs for week after current date
  const gigsThisWeek = gigs.filter((gig) => {
    const gigDate = new Date(gig.dateAndTime.seconds*1000)
    return gigDate < weekFromNow && gig.dateAndTime.seconds*1000 >= currentDateMs
  })


  const gigsThisWeek_sorted = gigsThisWeek.sort((a,b) => a.dateAndTime.seconds - b.dateAndTime.seconds)

  const gigsThisWeek_newDate = gigsThisWeek_sorted.map((item) => {
    const formattedDate = format(new Date(item.dateAndTime.seconds*1000),'EEE LLL do Y')
    return {...item, titleDate: formattedDate}
  })


  //group gigs by date
  const gigsThisWeek_grouped = gigsThisWeek_newDate.reduce((acc, curr) => {
    if (acc[curr.titleDate]) {
      acc[curr.titleDate].push(curr);
    } else {
      acc[curr.titleDate] = [curr];
    }
    return acc;
  }, {});


  //conditionally renders either gig list by day or list by week
  const gigsToRender = showWeek ? (
    <GigsByWeek gigsThisWeek_grouped={gigsThisWeek_grouped} navigation={navigation} />
  ) : (
    <GigsByDay navigation={navigation} gigsFromSelectedDate={gigsToday} />
  );
  

  return (
    <View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => setShowByWeek(false)}
          style={styles.touchable}
        >
          <Text style={showWeek ? null : styles.selected}>Gigs today</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowByWeek(true)}
          style={styles.touchable}
        >
          <Text style={showWeek ? styles.selected : null}>Gigs this week</Text>
        </TouchableOpacity>
      </View>
      {gigsToRender}
    </View>
  );
};

const styles = StyleSheet.create({
  gigCard: {
    marginBottom: 5,
    padding: 12,
    width:'85%',
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
    flexShrink: 1,
  },
  date: {
    paddingLeft: 10,
    fontFamily: "Sofia-Pro",
    fontSize: 20,
    textDecorationLine: "underline",
  },
  gigCard_items: {
    flexDirection:'row',
    alignItems:'center',
  },
  gigCard_items_img:{
    height:30,
    width:30
  },
  selected: {
    backgroundColor: "#68912b",
    padding: 5,
    color: "white",
    fontFamily: "Helvetica-Neue",
    borderRadius: 5,
  }
});

export default ListByDay;
