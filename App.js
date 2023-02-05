import 'react-native-gesture-handler';
import React, { useCallback } from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { MyStack } from './routes/homeStack';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen'
import * as Sentry from 'sentry-expo';

Sentry.init({
  dsn: 'https://aaa871e8e53148579a1922c7c85f4249@o4504624590553088.ingest.sentry.io/4504624596254720',
  enableInExpoDevelopment: true,
  debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});

export default function App() {

  const [ fontsLoaded ] = useFonts({
    'Sofia-Pro': require('./assets/Sofia_Pro_Regular.otf'),
    'Helvetica-Neue': require('./assets/HelveticaNeue-Medium.otf')
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
    <NavigationContainer onLayout={onLayoutRootView}>
      <MyStack/>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
