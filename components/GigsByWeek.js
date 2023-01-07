const GigsByWeek = ({ gigsThisWeek_grouped, navigation }) => (
  <View style={{ flexGrow: 1, height: 600 }}>
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
                  navigation.navigate('GigDetails', {
                    venue: val.venue,
                    gigName: val.gigName,
                    blurb: val.blurb,
                    isFree: val.isFree,
                    image: val.image,
                    genre: val.genre,
                    dateAndTime: val.dateAndTime.seconds,
                    tickets: val.tickets,
                  })
                }>
                <View style={styles.gigCard_items}>
                  <Image
                    style={styles.gigCard_items_img}
                    source={require('../assets/Icon_Gold_48x48.png')}
                  />
                  <View>
                    <Text style={styles.gigCard_header}>{val.gigName}</Text>
                    <Text style={styles.gigCard_details}>{val.venue}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )
      })}
    </ScrollView>
  </View>
)

export default GigsByWeek
