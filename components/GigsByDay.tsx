import { FC } from 'react';
import { FlatList,TouchableOpacity,StyleSheet,View,Image,Text,Platform } from 'react-native'
import { listProps } from '../routes/homeStack';
import { GigObject } from '../routes/homeStack';
import { Ionicons } from '@expo/vector-icons';

type ListScreenNavigationProp = listProps['navigation']

interface Props {
  gigsFromSelectedDate: GigObject[],
  navigation: ListScreenNavigationProp
}

const GigsByDay:FC<Props> = ({ gigsFromSelectedDate, navigation }):JSX.Element => (
  <FlatList
    testID='gigs-today'
    data={gigsFromSelectedDate}
    keyExtractor={item => item.id}
    renderItem={({ item }) => (
      <TouchableOpacity
        testID="gigs-today-card"
        style={styles.gigCard}
        onPress={() =>
          navigation.navigate('GigDetails', {
            venue: item.venue,
            gigName: item.gigName,
            blurb: item.blurb,
            isFree: item.isFree,
            image: item.image,
            genre: item.genre,
            dateAndTime: {...item.dateAndTime},
            tickets: item.tickets,
            id:item.id
          })
        }>
        <View style={styles.gigCard_items}>

            <Text style={styles.gigCard_header}>{`${item.gigName.substring(0,30)}`}</Text>

            <View style = {styles.venueDetails}>
              <Ionicons name="location-outline" size={14} color="black" />
              <Text style={styles.gigCard_details}>{item.venue}</Text>
            </View>

            <View style = {styles.imageAndBlurb}>
              <Image style = {styles.gigCard_items_img} source = {{uri: item.image}}/>
              <Text style={styles.blurbText}>{`${item.blurb.substring(0,60)}...`}</Text>
            </View>
            
            <Text style = {styles.seeMore}>See more {`>`}</Text>

        </View>
      </TouchableOpacity>
    )}
  />
)

const styles = StyleSheet.create({
  gigCard: {
    marginLeft:'7%',
    marginRight:'7%',
    backgroundColor:'#FAF7F2',
    height:'auto',
    marginBottom:16,
    padding:'3%',
    borderRadius:10,
    ...Platform.select({
      ios:{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
      },
      android:{
       elevation: 4,       
      }
    })
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
    fontFamily: "NunitoSans",
    fontSize: 18,
    lineHeight:24.55
  },
  gigCard_details: {
    fontFamily: "LatoRegular",
    color: "#000000",
    flexShrink: 1,
    fontSize:12,
    lineHeight:17.04
  },
  venueDetails:{
    flexDirection:'row',
    alignItems:'center'
  },
  date: {
    paddingLeft: 10,
    fontFamily: "Sofia-Pro",
    fontSize: 20,
    textDecorationLine: "underline",
  },
  gigCard_items: {
    flexDirection:'column',
  },
  gigCard_items_img:{
    height:85.63,
    width:100,
    borderRadius:8,
    marginRight:'3%'
  },
  imageAndBlurb:{
    flexDirection:'row',
    transform:[{translateY:15}]
  },
  seeMore:{
    textAlign:'right',
    fontFamily:'LatoRegular',
    fontSize:12,
    lineHeight:17.04,
    color:'#377D8A'
  },
  blurbText:{
    flex: 1,
    fontFamily:'LatoRegular',
    size:10,
    lineHeight:14.2
  }
});

export default GigsByDay
