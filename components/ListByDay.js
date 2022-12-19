import { useState,useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity
} from "react-native";
import { useGigs } from "../hooks/useGigs";

const ListByDay = ({ navigation }) => {
  const [selectedDateMs, setSelectedDateMs] = useState(Date.now());
  const [ showWeek, setShowByWeek ] = useState(false)
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
  const weekFromNow = selectedDateMs + 1000 * 60 * 60 * 24 * 7
  const dateWeekFromNow = new Date(weekFromNow)
  const finalDate = dateWeekFromNow.toISOString().slice(0,10)

  //Filtering through gigs and returning gigs for week after current date
  const gigsThisWeek = gigs.filter((gig) => gig.date < finalDate)

    //coverts the date property in each gig object from YYYY-MM-DD to 'Day Month Year' format 
    const updatedGigs = [];
    gigsThisWeek.map((item,i) => {
      const newDate = new Date(item.date);
      const newDateToString = newDate.toString().slice(0, 15);
      const newGigObject = {
        date: newDateToString,
        gigName: item.gigName,
        venue: item.venue,
        time: item.time,
        key:i
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


  const gigs_week = <View>
      {
        Object.keys(gigsThisWeek_grouped).map((item,i) => (
          <>
            <TouchableOpacity>
              <Text key = {i}>{item}</Text>
            {gigsThisWeek_grouped[item].map((val,i) => (
              <View style = {{borderWidth:1,borderColor:'black'}} key = {i}>
                <Text>{val.venue}</Text>
                <Text>{val.gigName}</Text>
                <Text>{val.time}</Text>
              </View>
              
            ))}
            </TouchableOpacity>
          </>
        ))
      }
    </View>
    
    const gigs_day = <FlatList
    data={gigsToday}
    renderItem={({ item }) => (
      <TouchableOpacity
        style={styles.test}
        onPress={() =>
          navigation.navigate("GigDetails", {
            venue: item.venue,
            gigName: item.gigName,
            date: item.date,
            time: item.time,
          })
        }
      >
        <Text>{item.venue}</Text>
        <Text>{item.gigName}</Text>
        <Text>{item.date}</Text>
        <Text>{item.time}</Text>
      </TouchableOpacity>
    )}
  />
  

  //conditionally renderes either gig list by day or list by week
  const gigsToRender = showWeek ?  gigs_week : gigs_day
  
  
  return (
    <View>
      <View style = {styles.buttonContainer}>
        <TouchableOpacity onPress = {()=> setShowByWeek(false)}>
        <Text style={styles.header}>Gigs today</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress = {()=> setShowByWeek(true)}>
          <Text>Gigs this week</Text>
        </TouchableOpacity>
      </View>
        {gigsToRender}
    </View>
  );
};

const styles = StyleSheet.create({
  test: {
    borderWidth: 1,
    borderColor: "black",
  },
  header: {
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  }
});

export default ListByDay;
