import React, {useEffect} from 'react';
import { View, Text, Pressable, StyleSheet, ImageBackground, Image, ActivityIndicator } from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';

import useDictionary from '../hook/useDictionary.js';
import styles from '../assets/style.js';
import {isLoggedIn} from '../util/common.js';


export default function Landing({ navigation }) {
    const {dictionary, loading} = useDictionary();

    useEffect(()=> {isLoggedIn(navigation)}, []);

    //display loading spinner while dictionary data is being retrieved
    if(loading){
        return(
            <View style={{flex:1}}>
            <LinearGradient colors={['#F9FAF4', '#F9FAF4', '#cdf5e9', '#FEE172']} style={{flex:1}}>
            <View style={{flex: 1, justifyContent:"center", alignItems:"center"}}>
                <ActivityIndicator size="large" color="black"></ActivityIndicator>
            </View>
            </LinearGradient>
            </View>
        )
    }

  return (
        <View style={{flex:1,}}>
            <LinearGradient colors={['#F9FAF4', '#F9FAF4', '#cdf5e9', '#FEE172', ]} style={{flex:1,}}>
            <View style={styles.center}>
                <Image source={require('../assets/logo2.png')} style={{width:300, height:100, marginTop:'35%', resizeMode: 'contain',}}></Image>
                <View style={{flex:1, justifyContent:'center', alignSelf:'center'}}>
                    <View style={[styles.titleContainer, {paddingLeft:'7%', marginTop:'30%',}]}>
                        <Text style={styles.landingTitle}>{dictionary.lets_start}</Text>
                        <Text style={styles.landingDesc}>{dictionary.landing_desc}</Text>
                    </View>
                    <View style={[{paddingVertical:"10%",}]}>
                        <Pressable onPress = {() => navigation.navigate('Register')} style={({pressed}) => [styles.buttons, {backgroundColor:'black', opacity: pressed ? 0.5 : 1,}]}><Text style={[styles.buttonTexts, {color:'white'}]}>{dictionary.register}</Text></Pressable>
                        <Pressable onPress = {() => navigation.navigate('SignIn')} style={({pressed}) => [styles.buttons, {backgroundColor: 'transparent', opacity: pressed ? 0.5 : 1, }]}><Text style={styles.buttonTexts}>{dictionary.sign_in}</Text></Pressable>
                </View>
                </View>

            </View>
            </LinearGradient>
        </View>
  );
}

