import { FC } from 'react'
import { ScrollView,TouchableOpacity,StyleSheet,View,Image,Text } from 'react-native'
import { listProps } from '../routes/homeStack'
import { GigObject } from '../routes/homeStack'
import { Time } from '../routes/homeStack'


type ListScreenNavigationProp = listProps['navigation']

interface IGroupedGigs {
  [date: string]: Array<{
    blurb: string;
    dateAndTime: {
        nanoseconds: number;
        seconds: number;
    },
    genre: string;
    gigName: string;
    id: string;
    image: any;
    isFree: any;
    location: {
        latitude: number;
        longitude: number;
    },
    tickets: string;
    titleDate: string;
    venue: string;
  }>
}


interface Props {
  gigsThisWeek_grouped: IGroupedGigs,
  navigation: ListScreenNavigationProp
}


const GigsByWeek:FC<Props> = ({ gigsThisWeek_grouped, navigation }): JSX.Element => (

  <View style={{ flexGrow: 1, height: 600 }}>
    <ScrollView>
      {Object.keys(gigsThisWeek_grouped).map((item, i) => {
        return (
          <>
            <Text key={i} style={styles.date}>
              {item}
            </Text>
            {gigsThisWeek_grouped[item].map((val:GigObject, i:number) => (
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
                    dateAndTime: {...val.dateAndTime},
                    tickets: val.tickets,
                    id:val.id
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
  },
  selected: {
    backgroundColor: "#68912b",
    padding: 5,
    color: "white",
    fontFamily: "Helvetica-Neue",
    borderRadius: 5,
  }
});

export default GigsByWeek
