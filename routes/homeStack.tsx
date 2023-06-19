import { createStackNavigator } from "@react-navigation/stack";
import List from '../screens/List'
import Map from '../screens/Map'
import Header from "../components/Header";
import GigDetails from "../screens/GigDetails";
import Register from "../screens/Register";
import RegistrationSuccess from "../screens/RegistrationSuccess";
import Profile from "../screens/Profile";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import About from "../screens/About";

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
  ticketPrice?:string,
  address:string,
  links: string[],
  gigName_subHeader:string,
  location?:{longitude:number,latitude:number},
}


type RootStackParamList = {
  Map:undefined,
  List:undefined,
  GigDetails: GigObject,
  About:undefined,
  Register:undefined, 
  RegistrationSuccess:undefined,
  Profile:undefined
}


const Stack = createStackNavigator<RootStackParamList>()

export type listProps = NativeStackScreenProps<RootStackParamList, 'List', 'MyStack'>
export type mapProps = NativeStackScreenProps<RootStackParamList, 'Map', 'MyStack'>
export type gigDetailsProps = NativeStackScreenProps<RootStackParamList, 'GigDetails', 'MyStack'>
export type registerProps = NativeStackScreenProps<RootStackParamList, 'Register', 'MyStack'>
export type registrationSuccessProps = NativeStackScreenProps<RootStackParamList, 'RegistrationSuccess', 'MyStack'>
export type profileProps = NativeStackScreenProps<RootStackParamList, 'Profile', 'MyStack'>

//create a stack navigator for the profile screen, the prohobit user from going back to the registration screen, but
//allows back navigation to other screens



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
        title:'',
        // headerTitle: () => <Header/>,
        // headerTitleAlign: 'center',
        headerStyle:{
          backgroundColor:'#E2DBCF'
        }
    }}
      />
      <Stack.Screen 
      name="About" 
      component={About} 
      options={{
        title: '',
        headerStyle:{
          backgroundColor:'#F7F6F5'
        }
    }}
      />
      <Stack.Screen 
      name="Register" 
      component={Register} 
      options={{
        title:'',
        headerStyle:{
          backgroundColor:'#E2DBCF'
        }
    }}
    />
    <Stack.Screen 
    name="RegistrationSuccess" 
    component={RegistrationSuccess} 
    options={{
      title:'',
      headerStyle:{
        backgroundColor:'#E2DBCF'
      },
      headerLeft: () => {return null}
  }}
      />
      <Stack.Screen 
      name="Profile" 
      component={Profile} 
      options={{
        title:'',
        headerStyle:{
          backgroundColor:'#E2DBCF'
        }
    }}
    />
    </Stack.Navigator>
  );
};