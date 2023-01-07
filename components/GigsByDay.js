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

export default GigsByDay
