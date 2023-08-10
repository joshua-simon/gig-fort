import 'react-native-gesture-handler';
import React, { useCallback } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { MyStack } from './routes/homeStack';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen'
import { AuthProvider } from './AuthContext';
import { MenuProvider } from 'react-native-popup-menu';
import { SafeAreaView } from 'react-native';

export default function App() {

  const [ fontsLoaded ] = useFonts({
    'NunitoSans': require('./assets/NunitoSans-Bold.ttf'),
    'LatoRegular': require('./assets/Lato-Regular.ttf')
  })


  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
      <MenuProvider>
        <AuthProvider>
          <NavigationContainer onLayout={onLayoutRootView}>
            <MyStack />
          </NavigationContainer>
        </AuthProvider>
      </MenuProvider>
  );
}

