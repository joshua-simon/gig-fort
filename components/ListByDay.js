import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useGigs } from "../hooks/useGigs";

const ListByDay = ({ navigation }) => {
  const gigs = useGigs();

  return (
    <View>
      <Text style={styles.header}>Gigs today</Text>
      <FlatList
        data={gigs}
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
