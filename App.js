import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import { JetBrainsMono_400Regular, JetBrainsMono_700Bold } from '@expo-google-fonts/jetbrains-mono';
import {SpaceGrotesk_400Regular,SpaceGrotesk_700Bold,} from '@expo-google-fonts/space-grotesk';

import Landing from './screens/Landing.js';
import SignIn from './screens/SignIn.js';
import Register from './screens/Register.js';
import Home from './screens/Home.js';



const Stack = createNativeStackNavigator();

export default function App(){
  const [fontsLoaded] = useFonts({
    JetBrainsMono_400Regular,
    JetBrainsMono_700Bold,
    SpaceGrotesk_400Regular,
    SpaceGrotesk_700Bold,

  });
  if (!fontsLoaded) {
    return null; // or loading screen
  }
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Landing' screenOptions={{ headerShown: false, }}>
        <Stack.Screen name="Landing" component={Landing}></Stack.Screen>
        <Stack.Screen name="SignIn" component={SignIn}></Stack.Screen>
        <Stack.Screen name="Register" component={Register}></Stack.Screen>
        <Stack.Screen name="Home" component={Home}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
);
}