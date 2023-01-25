import { FC } from "react";
import { useState, useMemo } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useGigs } from "../hooks/useGigs";
import GigsByDay from "./GigsByDay";
import GigsByWeek from "./GigsByWeek";
import { format, addDays } from "date-fns";
import { listProps } from "../routes/homeStack";
import { getGigsToday, getGigsThisWeek } from "../util/helperFunctions";

type ListScreenNavigationProp = listProps["navigation"];

interface Props {
  navigation: ListScreenNavigationProp;
}

const ListByDay: FC<Props> = ({ navigation }): JSX.Element => {
  const [currentDateMs, setCurrentDateMs] = useState<number>(Date.now());
  const [showWeek, setShowByWeek] = useState<boolean>(false);
  const gigs = useGigs();

  const gigsToday = getGigsToday(gigs, currentDateMs);
  const gigThisWeek = getGigsThisWeek(gigs, currentDateMs);

  const gigsToRender = showWeek ? (
    <GigsByWeek gigsThisWeek_grouped={gigThisWeek} navigation={navigation} />
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
          <Text testID="header" style={showWeek ? styles.selected : null}>
            Gigs this week
          </Text>
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
    width: "85%",
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
    flexDirection: "row",
    alignItems: "center",
  },
  gigCard_items_img: {
    height: 30,
    width: 30,
  },
  selected: {
    backgroundColor: "#68912b",
    padding: 5,
    color: "white",
    fontFamily: "Helvetica-Neue",
    borderRadius: 5,
  },
});

export default ListByDay;
