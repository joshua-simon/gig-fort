import { useContext,useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import List from '../screens/List'
import Map from '../screens/Map'
import GigDetails from "../screens/GigDetails";
import Register from "../screens/Register";
import RegistrationSuccess from "../screens/RegistrationSuccess";
import Profile from "../screens/Profile";
import Login from "../screens/Login";
import EditDetails from "../screens/EditDetails";
import Header from "../components/Header";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import About from "../screens/About";
import { AuthContext } from "../AuthContext";


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

export interface UserDetails {
  firstName:string,
  lastName:string,
  UID:string
}


export type RootStackParamList = {
  Map:undefined,
  List:undefined,
  GigDetails: GigObject,
  About:undefined,
  Register:undefined, 
  RegistrationSuccess:undefined,
  Profile:undefined,
  Login:undefined,
  EditDetails:UserDetails,
  Header:undefined
}

const Stack = createStackNavigator<RootStackParamList>()

export type listProps = NativeStackScreenProps<RootStackParamList, 'List', 'MyStack'>
export type mapProps = NativeStackScreenProps<RootStackParamList, 'Map', 'MyStack'>
export type gigDetailsProps = NativeStackScreenProps<RootStackParamList, 'GigDetails', 'MyStack'>
export type registerProps = NativeStackScreenProps<RootStackParamList, 'Register', 'MyStack'>
export type registrationSuccessProps = NativeStackScreenProps<RootStackParamList, 'RegistrationSuccess', 'MyStack'>
export type profileProps = NativeStackScreenProps<RootStackParamList, 'Profile', 'MyStack'>
export type loginProps = NativeStackScreenProps<RootStackParamList, 'Login', 'MyStack'>
export type editDetailsProps = NativeStackScreenProps<RootStackParamList, 'EditDetails', 'MyStack'>



export const MyStack = () => {

  const { user } = useContext(AuthContext)

  return (
    <Stack.Navigator
        initialRouteName="Map"
    >
      <Stack.Screen 
      name="Map" 
      component={Map} 
      options={{
        title:'',
        headerTitle: () => <Header/>,
        // headerTitleAlign: 'center',
        headerStyle:{
          backgroundColor:'#F7F6F5',
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
      name="EditDetails" 
      component={EditDetails} 
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
  {user ? (
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
   ): null}
    <Stack.Screen 
    name="Login" 
    component={Login} 
    options={{
      title:'',
      headerStyle:{
        backgroundColor:'#E2DBCF'
      },
  }}
      />
    </Stack.Navigator>
  );
};