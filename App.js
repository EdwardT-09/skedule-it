import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import { JetBrainsMono_400Regular, JetBrainsMono_700Bold } from '@expo-google-fonts/jetbrains-mono';
import {SpaceGrotesk_400Regular,SpaceGrotesk_700Bold,} from '@expo-google-fonts/space-grotesk';
import { Sintony_400Regular, Sintony_700Bold } from '@expo-google-fonts/sintony';
import { Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';

import Landing from './screens/Landing.js';
import SignIn from './screens/SignIn.js';
import Register from './screens/Register.js';
import Home from './screens/Home.js';
import Subjects from './screens/Subjects.js';
import Subject from './screens/Subject.js';
import AddSubject from './screens/AddSubject.js';
import NotesViewer from './screens/NotesViewer.js';
import Chat from './screens/Chat.js';
import Tasks from './screens/Tasks.js';
import AddTask from './screens/AddTask.js';
import Profile from './screens/Profile.js';
import Languages from './screens/Languages.js';
import Password from './screens/Password.js';
import ChangeInfo from './screens/ChangeInfo.js';


const Stack = createNativeStackNavigator();

export default function App(){
  const [fontsLoaded] = useFonts({
    JetBrainsMono_400Regular,
    JetBrainsMono_700Bold,
    SpaceGrotesk_400Regular,
    SpaceGrotesk_700Bold,
    Sintony_400Regular,
    Sintony_700Bold,
    Poppins_400Regular, 
    Poppins_700Bold,

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
        <Stack.Screen name="Subjects" component={Subjects}></Stack.Screen>
        <Stack.Screen name="Subject" component={Subject}></Stack.Screen>
        <Stack.Screen name="AddSubject" component={AddSubject}></Stack.Screen>
        <Stack.Screen name="NotesViewer" component={NotesViewer}></Stack.Screen>
        <Stack.Screen name="Chat" component={Chat}></Stack.Screen>
        <Stack.Screen name="Tasks" component={Tasks}></Stack.Screen>
        <Stack.Screen name="AddTask" component={AddTask}></Stack.Screen>
        <Stack.Screen name="Profile" component={Profile}></Stack.Screen>
        <Stack.Screen name="Languages" component={Languages}></Stack.Screen>
        <Stack.Screen name="Password" component={Password}></Stack.Screen>
        <Stack.Screen name="ChangeInfo" component={ChangeInfo}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
);
}