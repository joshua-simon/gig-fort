import { FC } from "react";
import {
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
  Text,
  Platform,
} from "react-native";
import { listProps } from "../routes/homeStack";
import { GigObject } from "../routes/homeStack";
import GigCard from "./GigCard";

type ListScreenNavigationProp = listProps["navigation"];

interface IGroupedGigs {
  [date: string]: Array<{
    blurb: string;
    dateAndTime: {
      nanoseconds: number;
      seconds: number;
    };
    genre: string;
    gigName: string;
    id: string;
    image: any;
    isFree: any;
    location: {
      latitude: number;
      longitude: number;
    };
    tickets: string;
    titleDate: string;
    venue: string;
    address: string;
    links: string[];
    gigName_subHeader: string;
  }>;
}

interface Props {
  gigsThisWeek_grouped: IGroupedGigs;
  navigation: ListScreenNavigationProp;
}

const GigsByWeek: FC<Props> = ({
  gigsThisWeek_grouped,
  navigation,
}): JSX.Element => (
  <View style={{ flexGrow: 1, height: 600, paddingBottom: 80 }}>
    <ScrollView>
      {Object.keys(gigsThisWeek_grouped).map((item: string, i: number) => {
        const day = item?.slice(0, 3);
        const week = item?.slice(4, 18);
        return (
          <View key={i}>
            <View key={item} style={styles.date}>
              <Text style={styles.headerText_main}>{day}</Text>
              <Text style={styles.headerText_sub}>{week}</Text>
            </View>

            {gigsThisWeek_grouped[item].map((val: GigObject, i: number) => (
              <View style={styles.gigCard} key={val.id}>
                <GigCard item={val} navigation={navigation} isProfile={false} />
              </View>
            ))}
          </View>
        );
      })}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  gigCard: {
    marginLeft: "5%",
    marginRight: "5%",
    backgroundColor: "#FAF7F2",
    height: "auto",
    marginBottom: 16,
    padding: "3%",
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
      },
      android: {
        elevation: 4,
      },
    }),
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
    lineHeight: 24.55,
  },
  gigCard_details: {
    fontFamily: "LatoRegular",
    color: "#000000",
    flexShrink: 1,
    fontSize: 12,
    lineHeight: 17.04,
  },
  imageAndBlurb: {
    flexDirection: "row",
    transform: [{ translateY: 15 }],
  },
  blurbText: {
    flex: 1,
    fontFamily: "LatoRegular",
    size: 10,
    lineHeight: 14.2,
  },
  date: {
    marginLeft: "7%",
    marginBottom: "3%",
  },
  gigCard_items: {
    flexDirection: "column",
  },
  gigCard_items_img: {
    height: 85.63,
    width: 100,
    borderRadius: 8,
    marginRight: "3%",
  },
  venueDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText_main: {
    fontFamily: "NunitoSans",
    fontSize: 25,
    lineHeight: 34.1,
  },
  seeMore: {
    textAlign: "right",
    fontFamily: "LatoRegular",
    fontSize: 12,
    lineHeight: 17.04,
    color: "#377D8A",
  },
  headerText_sub: {
    fontFamily: "LatoRegular",
    size: 14,
    lineHeight: 16.8,
  },
});

export default GigsByWeek;
