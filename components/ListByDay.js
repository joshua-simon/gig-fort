import { useState,useMemo } from "react";
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

  const gigsToRender = showWeek ? gigsThisWeek : gigsToday
  
  
  return (
    <View>
      <View>
        <TouchableOpacity onPress = {()=> setShowByWeek(false)}>
        <Text style={styles.header}>Gigs today</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress = {()=> setShowByWeek(true)}>
          <Text>Gigs this week</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={gigsToRender}
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
});

export default ListByDay;
