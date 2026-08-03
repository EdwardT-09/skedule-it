import {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import { JetBrainsMono_400Regular, JetBrainsMono_700Bold } from '@expo-google-fonts/jetbrains-mono';
import {SpaceGrotesk_400Regular,SpaceGrotesk_700Bold,} from '@expo-google-fonts/space-grotesk';
import { Sintony_400Regular, Sintony_700Bold } from '@expo-google-fonts/sintony';
import { Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import styles from './assets/style.js';
import useDictionary from './hook/useDictionary.js'
import {supabase} from './config/initSupabase.js';
import { getStateFromPath } from '@react-navigation/native';

import * as Linking from "expo-linking";
import Landing from './screens/Landing.js';
import SignIn from './screens/SignIn.js';
import Register from './screens/Register.js';
import RegisterConfirmation from './screens/RegisterConfirmation.js';
import ForgotPassword from './screens/ForgotPassword.js';
import ResetPassword from './screens/ResetPassword.js';
import Home from './screens/Home.js';
import Schedule from './screens/Schedule.js';
import AddSchedule from './screens/AddSchedule.js';
import Subjects from './screens/Subjects.js';
import Subject from './screens/Subject.js';
import Performance from './screens/StudyLog.js';
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
  const [isConnected, setIsConnected] = useState(true);
  const {dictionary, loading} = useDictionary();

  useEffect(()=>{
    const unsubscribe = NetInfo.addEventListener(state=>{
      setIsConnected(state.isConnected);
    })

    return ()=> unsubscribe
  }, [])



useEffect(() => {
  Linking.getInitialURL().then((url) => {
    console.log("INITIAL URL:", url);
  });

  const sub = Linking.addEventListener("url", ({ url }) => {
    console.log("URL EVENT:", url);
  });

  return () => sub.remove();
}, []);


const linking = {
  prefixes: [
    "skeduleit://",
    // Linking.createURL("/"),
  ],
  config: {
    screens: {
      ResetPassword: "reset-password",
      RegisterConfirmation: "signup-confirmed",
    },
  },

  getStateFromPath: (path, options) => {
    const normalizedPath = path.replace("#", "?");

    if (normalizedPath.includes("type=recovery")) {
        return {
            routes: [
                { 
                    name: "ResetPassword",
                    params: { 
                        isRecovery: true, 
                        rawUrl: normalizedPath 
                    }
                }
            ],
        };
    }

    if (normalizedPath.includes("type=signup")) {
        return {
            routes: [
                {
                    name: "RegisterConfirmation",
                    params: {
                        rawUrl: normalizedPath
                    }
                }
            ],
        };
    }

    return getStateFromPath(normalizedPath, options);
}
};
  
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
    <View style={{flex:1}}>
      
      {!isConnected && (
        <View style={styles.offlineOverlay}>
          <View style={styles.offlinePopup}>
              <Text style={styles.offlineText}>
                 no internet
              </Text>
          </View>
        </View>
      )}
  
      <NavigationContainer linking={linking}>
        <Stack.Navigator initialRouteName='Landing' screenOptions={{ headerShown: false, }}>
          <Stack.Screen name="Landing" component={Landing}></Stack.Screen>
          <Stack.Screen name="SignIn" component={SignIn}></Stack.Screen>
          <Stack.Screen name="Register" component={Register}></Stack.Screen>
          <Stack.Screen name="RegisterConfirmation" component={RegisterConfirmation}></Stack.Screen>
          <Stack.Screen name="ForgotPassword" component={ForgotPassword}></Stack.Screen>
          <Stack.Screen name="ResetPassword" component={ResetPassword}></Stack.Screen>
          <Stack.Screen name="Home" component={Home}></Stack.Screen>
          <Stack.Screen name="Schedule" component={Schedule}></Stack.Screen>
          <Stack.Screen name="AddSchedule" component={AddSchedule}></Stack.Screen>
          <Stack.Screen name="Subjects" component={Subjects}></Stack.Screen>
          <Stack.Screen name="Subject" component={Subject}></Stack.Screen>
          <Stack.Screen name="AddSubject" component={AddSubject}></Stack.Screen>
          <Stack.Screen name="Performance" component={Performance}></Stack.Screen>
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
      </View>
);
}