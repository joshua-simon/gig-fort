import { useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useGigs } from "../hooks/useGigs";

const ListByDay = ({ navigation }) => {
  const [selectedDateMs, setSelectedDateMs] = useState(Date.now());
  const [showWeek, setShowByWeek] = useState(false);
  const gigs = useGigs();

  //generates current date in format DD/MM/YYYY
  const selectedDateString = useMemo(() => {
    const d = new Date(selectedDateMs);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }, [selectedDateMs]);

  const currentDate = new Date(selectedDateMs).toString().slice(0, 15);

  //Filtering through gigs to return only current day's gigs
  const gigsToday = gigs.filter((gig) => gig.date === selectedDateString);

  //Generating date a week from current date
  const weekFromNow = selectedDateMs + 1000 * 60 * 60 * 24 * 7;
  const dateWeekFromNow = new Date(weekFromNow);
  const finalDate = dateWeekFromNow.toISOString().slice(0, 10);

  //Filtering through gigs and returning gigs for week after current date
  const gigsThisWeek = gigs.filter((gig) => gig.date < finalDate);

  //coverts the date property in each gig object from YYYY-MM-DD to 'Day Month Year' format
  const updatedGigs = [];
  gigsThisWeek.map((item, i) => {
    const newDate = new Date(item.date);
    const newDateToString = newDate.toString().slice(0, 15);
    const newGigObject = {
      date: newDateToString,
      gigName: item.gigName,
      venue: item.venue,
      time: item.time,
      key: i,
    };
    updatedGigs.push(newGigObject);
  });

  //group gigs by date
  const gigsThisWeek_grouped = updatedGigs.reduce((acc, curr) => {
    if (acc[curr.date]) {
      acc[curr.date].push(curr);
    } else {
      acc[curr.date] = [curr];
    }
    return acc;
  }, {});

  //return gigs for week starting on current
  const gigs_week = (
    <View>
      {Object.keys(gigsThisWeek_grouped).map((item, i) => (
        <>
          <Text key={i} style = {styles.date}>{item}</Text>
          {gigsThisWeek_grouped[item].map((val, i) => (
            <TouchableOpacity
            style={styles.gigCard}
              key={i}
              onPress={() =>
                navigation.navigate("GigDetails", {
                  venue: val.venue,
                  gigName: val.gigName,
                  date: val.date,
                  time: val.time,
                })
              }
            >
              <Text style = {styles.gigCard_header}>{val.gigName}</Text>
              <Text style = {styles.gigCard_details}>{val.venue}</Text>
              <Text style = {styles.gigCard_details}>{val.time}</Text>
            </TouchableOpacity>
          ))}
        </>
      ))}
    </View>
  );

  //return current day's gigs
  const gigs_day = (
    <FlatList
      data={gigsToday}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.gigCard}
          onPress={() =>
            navigation.navigate("GigDetails", {
              venue: item.venue,
              gigName: item.gigName,
              date: item.date,
              time: item.time,
            })
          }
        >
          <Text style = {styles.gigCard_header}>{item.gigName}</Text>
          <Text style = {styles.gigCard_details}>{item.venue}</Text>
          <Text style = {styles.gigCard_details}>{item.time}</Text>
        </TouchableOpacity>
      )}
    />
  );

  //conditionally renderes either gig list by day or list by week
  const gigsToRender = showWeek ? gigs_week : gigs_day;

//conditionally render background color for button being pressed
  let buttonColorToday
  let buttonColorWeek
  if(!showWeek){
    buttonColorToday = {backgroundColor:'#68912b',padding:5,color: 'white', fontFamily:'Helvetica-Neue',borderRadius:5}
    buttonColorWeek = null
  } else {
     buttonColorToday = null
    buttonColorWeek = {backgroundColor:'#68912b',padding:5,color: 'white', fontFamily:'Helvetica-Neue', borderRadius:5}
  }
 

  return (
    <View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => setShowByWeek(false)} style = {styles.touchable}>
          <Text style={buttonColorToday}>Gigs today</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowByWeek(true)} style = {styles.touchable}>
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
    padding:10
  },
  header: {
    padding: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    padding:15
  },
  touchable: {
    padding:6
  },
  gigCard_header:{
    fontFamily: 'Sofia-Pro',
    fontSize:17
  },
  gigCard_details: {
    fontFamily: 'Helvetica-Neue',
    color:'#778899'
  },
  date: {
    paddingLeft:10,
    fontFamily: 'Sofia-Pro',
    fontSize:20,
    textDecorationLine: 'underline'
  }
});

export default ListByDay;
