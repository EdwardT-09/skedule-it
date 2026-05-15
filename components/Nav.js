import React, {useState} from 'react';
import {View, Text, Image, BackHandler, Pressable} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import styles from '../assets/style.js';

export default function Navigation(){
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState("home");
    return(
        <View style={styles.navContainer}>
        <View style={{flex:0, flexDirection:'row', justifyContent:'space-around', }}>
                <Pressable onPress={() => {setActiveTab("home"); navigation.navigate('Home')}}  style={() => [activeTab === "home" ? styles.navActive : styles.navButton, {backgroundColor: '#c14343'}]}><Image source={require('../assets/Home.png')}></Image></Pressable>
                <Pressable onPress={() => setActiveTab('schedule')} style={() => [activeTab === "schedule" ? styles.navActive: styles.navButton, {backgroundColor: '#efd868'}]}><Image source={require('../assets/Calendar.png')}></Image></Pressable>
                <Pressable onPress={() => setActiveTab("")}  style={() => [activeTab === "" ? styles.navActive: styles.navButton, {backgroundColor: '#d3b098'}]}><Image source={require('../assets/Home.png')}></Image></Pressable>
                <Pressable onPress={() => setActiveTab("")}  style={() => [activeTab === "" ? styles.navActive: styles.navButton, {backgroundColor: '#46b6af'}]}><Image source={require('../assets/Home.png')}></Image></Pressable>
                <Pressable onPress={() => {setActiveTab("profile"); navigation.navigate('Profile')}}  style={() => [activeTab === "profile" ? styles.navActive: styles.navButton, {backgroundColor: '#e3922f'}]}><Image source={require('../assets/User.png')}></Image></Pressable>
        </View>
        </View>
    );
}