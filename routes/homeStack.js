import { createStackNavigator } from "@react-navigation/stack";
import List from '../screens/List'
import Map from '../screens/Map'
import Header from "../components/Header";
import GigDetails from "../screens/GigDetails";


const Stack = createStackNavigator()

export const MyStack = () => {

  return (
    <Stack.Navigator
        initialRouteName="Map"
    >
      <Stack.Screen 
      name="Map" 
      component={Map} 
      options={{
        headerTitle: () => <Header/>,
        headerTitleAlign: 'center',
        headerStyle:{

        }
    }}     
      />
      <Stack.Screen 
      name="List" 
      component={List} 
      options={{
        headerTitle: () => <Header/>,
        headerTitleAlign: 'center'
    }}
      />
      <Stack.Screen 
      name="GigDetails" 
      component={GigDetails} 
      options={{
        headerTitle: () => <Header/>,
        headerTitleAlign: 'center'
    }}
      />
    </Stack.Navigator>
  );
};