import { FlatList,TouchableOpacity,StyleSheet,View,Image,Text } from 'react-native'

const GigsByDay = ({ gigsFromSelectedDate, navigation }) => (
  <FlatList
    data={gigsFromSelectedDate}
    keyExtractor={item => item.id}
    renderItem={({ item }) => (
      <TouchableOpacity
        style={styles.gigCard}
        onPress={() =>
          navigation.navigate('GigDetails', {
            venue: item.venue,
            gigName: item.gigName,
            blurb: item.blurb,
            isFree: item.isFree,
            image: item.image,
            genre: item.genre,
            dateAndTime: item.dateAndTime.seconds,
            tickets: item.tickets,
          })
        }>
        <View style={styles.gigCard_items}>
          <Image
            style={styles.gigCard_items_img}
            source={require('../assets/Icon_Gold_48x48.png')}
          />
          <View>
            <Text style={styles.gigCard_header}>{item.gigName}</Text>
            <Text style={styles.gigCard_details}>{item.venue}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )}
  />
)

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

export default GigsByDay
