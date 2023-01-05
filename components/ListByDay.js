import { useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  VirtualizedList, // NOTE: watch your unused imports - I *think* vscode will show you these
} from 'react-native'
import { useGigs } from '../hooks/useGigs'

const ListByDay = ({ navigation }) => {
  // NOTE: Store and manipulate dates as JS dates.
  // So for now, set the initial state with new Date().
  const [selectedDateMs, setSelectedDateMs] = useState(Date.now())
  const [showWeek, setShowByWeek] = useState(false)
  const gigs = useGigs()

  // NOTE: memoisation is overkill until you actually need it.
  // There's a method on the date object which will do
  // exactly what you want, but much more reliably - 'toDateString'
  const selectedDateString = useMemo(() => {
    const date = new Date(selectedDateMs);
    const dateToString = date.toString().slice(0,15)
    return dateToString // returns in form 'Tue Dec 20 2022'
  }, [selectedDateMs])

  // NOTE: You want to find dates which are on the same day.
  // just use the toDateString method mentioned above and compare for equality,
  // since the date string only gives day-level granularity
  // the filter function is also a one-liner
  const gigsToday = gigs.filter(gig => {
    const gigDate1 = new Date(gig.dateAndTime.seconds * 1000)
    const gigDate2 = gigDate1.toString().slice(0, 15) //return form 'Tue Dec 20 2022'
    return gigDate2 === selectedDateString
  })

  // NOTE: Use real date objects:
  // date-fns for example has the 'addWeeks' or 'addDays' functions
  // ...which work with date objects
  const weekFromNow = selectedDateMs + 1000 * 60 * 60 * 24 * 7

  // NOTE: Unconvinced that you need this!
  const dateNow = Date.now()

  // NOTE: Still compare using real dates. This milisecond conversion is unnecessary.
  // FWIW, date comparison just uses regular JS operators https://stackoverflow.com/questions/492994/compare-two-dates-with-javascript#answer-14629978
  const gigsThisWeek = gigs.filter(gig => {
    return (
      gig.dateAndTime.seconds * 1000 < weekFromNow &&
      gig.dateAndTime.seconds * 1000 >= dateNow
    )
  })

  // NOTE: plz no snake case in JS
  const gigsThisWeek_sorted = gigsThisWeek.sort(
    // NOTE: as above, this will still work the same way once you're using real JS dates
    (a, b) => a.dateAndTime - b.dateAndTime
  )

  // NOTE: as above plz no snek case
  const gigsThisWeek_newDate = gigsThisWeek_sorted.map(item => {
    const newDate = new Date(item.dateAndTime.seconds * 1000)
    const newDateString = newDate.toString().slice(0, 15)
    // NOTE: dateAndTime is not dateAndTime. It's a date string, which is only the date.
    // Use a real JS date. This is where TypeScript *shines* as your friend, holding you account for such things
    // The first type you should define is the gig object
    return { ...item, dateAndTime: newDateString }
  })

  // NOTE: use existing tools. lodash for example has groupBy,
  //  which will do this whole thing in one line: https://lodash.com/docs/4.17.15#groupBy
  const gigsThisWeek_grouped = gigsThisWeek_newDate.reduce((acc, curr) => {
    if (acc[curr.dateAndTime]) {
      acc[curr.dateAndTime].push(curr);
    } else {
      acc[curr.dateAndTime] = [curr];
    }
    return acc;
  }, {});


  // NOTE: I think it's clear what to do with this
  const gigs_week = (
 <View style = {{flexGrow: 1, height:600}}>
    <ScrollView>
      {Object.keys(gigsThisWeek_grouped).map((item, i) => {
        return (
          <>
            <Text key={i} style={styles.date}>
              {item}
            </Text>
            {gigsThisWeek_grouped[item].map((val, i) => (
              <TouchableOpacity
                style={styles.gigCard}
                key={i}
                onPress={() =>
                  navigation.navigate("GigDetails", {
                    venue: val.venue,
                    gigName: val.gigName,
                    blurb: val.blurb,
                    isFree: val.isFree,
                    image: val.image,
                    genre:val.genre,
                    dateAndTime: val.dateAndTime.seconds,
                    tickets:val.tickets
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
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </>
        );
      })}
    </ScrollView>
    </View>
  );



  // NOTE: Also this!
  //return current day's gigs
  const gigs_day = (
    <FlatList
      data={gigsToday}
      keyExtractor={(item) => item.id}
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
              dateAndTime: item.dateAndTime.seconds,
              tickets:item.tickets
            })
          }
        ><View style = {styles.gigCard_items}>
          <Image style = {styles.gigCard_items_img} source = {require('../assets/Icon_Gold_48x48.png')}/>
          <View>
          <Text style={styles.gigCard_header}>{item.gigName}</Text>
          <Text style={styles.gigCard_details}>{item.venue}</Text>
          </View>
        </View>
        </TouchableOpacity>
      )}
    />
  );

  // NOTE: as above with the top two comments...
  //conditionally renderes either gig list by day or list by week
  const gigsToRender = showWeek ? gigs_week : gigs_day;

  // NOTE: There's almost certainly a better, immutable way to do this.
  let buttonColorToday
  let buttonColorWeek
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

// NOTE: could probably live outside this module but next to it,
// so it's less cluttered... -> ListByDay.styles.js or something
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
  }
});

export default ListByDay;
