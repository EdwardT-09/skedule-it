import React from 'react';
import { View, Text, Pressable, StyleSheet, ImageBackground, Image } from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';

import styles from '../assets/style.js';


export default function Landing({ navigation }) {
  return (
        <View style={{flex:1,}}>
            <LinearGradient colors={['#F9FAF4', '#F9FAF4', '#cdf5e9', '#FEE172', ]} style={{flex:1,}}>
            <View style={styles.center}>
                <Image source={require('../assets/logo2.png')} style={{width:400, height:100, marginTop:'35%', resizeMode: 'contain',}}></Image>
                <View style={{flex:1, justifyContent:'center', alignSelf:'center'}}>
                    <View style={[styles.titleContainer, {paddingLeft:'7%', marginTop:'30%'}]}>
                        <Text style={styles.landingTitle}>let's start</Text>
                        <Text style={styles.landingDesc}>start your study journey with us</Text>
                    </View>
                    <View style={[{paddingVertical:"10%"}]}>
                        <Pressable onPress = {() => navigation.navigate('Register')} style={({pressed}) => [styles.buttons, {backgroundColor: pressed ? '#ddd': 'black',}]}><Text style={[styles.buttonTexts, {color:'white'}]}>REGISTER</Text></Pressable>
                        <Pressable onPress = {() => navigation.navigate('SignIn')} style={({pressed}) => [styles.buttons, {backgroundColor: pressed ? '#ddd': 'transparent' }]}><Text style={styles.buttonTexts}>SIGN IN</Text></Pressable>
                </View>
                </View>

            </View>
            </LinearGradient>
        </View>
  );
}

