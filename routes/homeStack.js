import { createStackNavigator } from "@react-navigation/stack";
import List from '../screens/List'
import Map from '../screens/Map'

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
        headerTintColor: '#fff',
        headerStyle: { backgroundColor: 'coral' },
      }}
      />
      <Stack.Screen name="List" component={List} />
    </Stack.Navigator>
  );
};