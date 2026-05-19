import React from 'react';
import { View, Text, Pressable, StyleSheet, ImageBackground, Image } from 'react-native';
import Header from '../components/Header.js';

import styles from '../assets/style.js';


export default function Landing({ navigation }) {
  return (
    <ImageBackground 
        source = {require ('../assets/bg3.png')}
        style={{flex:1}}>
        <View style={styles.center}>
            <Header></Header>
            <View style={styles.container}>
                <View style={[styles.titleContainer, { backgroundColor:'#4ECDC4'}, {paddingLeft:'7%'}]}>
                    <Text style={styles.title}>let's start</Text>
                    <Text style={styles.desc}>start your study journey with us</Text>
                </View>
                <View style={[{paddingVertical:"10%"}, {marginHorizontal:'10%'}]}>
                    <Pressable onPress = {() => navigation.navigate('Register')} style={({pressed}) => [styles.buttons, { transform: [{ rotate: '3deg' }]}, {backgroundColor: pressed ? '#ddd': 'white' }]}><Text style={styles.buttonTexts}>REGISTER</Text></Pressable>
                    <Pressable onPress = {() => navigation.navigate('SignIn')} style={({pressed}) => [styles.buttons, { transform: [{ rotate: '-3deg' }]}, {backgroundColor: pressed ? '#ddd': 'white' }]}><Text style={styles.buttonTexts}>SIGN IN</Text></Pressable>
                </View>
            </View>
        </View>
    </ImageBackground>
  );
}

