import { createStackNavigator } from "@react-navigation/stack";
import List from '../screens/List'
import Map from '../screens/Map'
import Header from "../components/Header";
import GigDetails from "../screens/GigDetails";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

export interface Time {
  nanoseconds:number
  seconds:number;
}

export interface GigObject {
  tickets:string,
  venue:string,
  dateAndTime: Time,
  isFree:boolean,
  image:string,
  genre: string,
  gigName:string,
  blurb:string,
  id?:string,
  location?:{longitude:number,latitude:number},
}


type RootStackParamList = {
  Map:undefined,
  List:undefined,
  GigDetails: GigObject 
}


const Stack = createStackNavigator<RootStackParamList>()

export type listProps = NativeStackScreenProps<RootStackParamList, 'List', 'MyStack'>
export type mapProps = NativeStackScreenProps<RootStackParamList, 'Map', 'MyStack'>
export type gigDetailsProps = NativeStackScreenProps<RootStackParamList, 'GigDetails', 'MyStack'>


export const MyStack = () => {

  return (
    <Stack.Navigator
        initialRouteName="Map"
    >
      <Stack.Screen 
      name="Map" 
      component={Map} 
      options={{
        title:'',
        // headerTitle: () => <Header/>,
        // headerTitleAlign: 'center',
        headerStyle:{
          backgroundColor:'#F7F6F5'
        }
    }}     
      />
      <Stack.Screen 
      name="List" 
      component={List} 
      options={{
        title: '',
        // headerTitle: () => <Header/>,
        // headerTitleAlign: 'center',
        headerStyle:{
          backgroundColor:'#F7F6F5'
        }
    }}
      />
      <Stack.Screen 
      name="GigDetails" 
      component={GigDetails} 
      options={{
        headerTitle: () => <Header/>,
        headerTitleAlign: 'center',
        headerStyle:{
          backgroundColor:'#ba9556'
        }
    }}
      />
    </Stack.Navigator>
  );
};