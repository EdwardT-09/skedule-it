import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';
import Header from '../components/Header.js';

import styles from '../assets/style.js';


export default function Landing({ navigation }) {
  return (
    <ImageBackground 
        source = {require ('../assets/bg2.png')}
        style={{flex:1}}>
        <View style={styles.center}>
            <Header></Header>
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>let's start</Text>
                    <Text style={styles.desc}>start your study journey with us</Text>
                </View>
                <View style={{paddingVertical:"10%"}}>
                    <TouchableOpacity onPress = {() => navigation.navigate('Register')}><Text style={[styles.buttons, { transform: [{ rotate: '3deg' }],}]}>REGISTER</Text></TouchableOpacity>
                    <TouchableOpacity onPress = {() => navigation.navigate('SignIn')}><Text style={[styles.buttons, { transform: [{ rotate: '-3deg' }],}]}>SIGN IN</Text></TouchableOpacity>
                </View>
            </View>
        </View>
    </ImageBackground>
  );
}

