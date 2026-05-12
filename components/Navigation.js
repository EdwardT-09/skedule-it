import React, {useState} from 'react';
import {View, Text, Image, BackHandler, Pressable} from 'react-native';

import styles from '../assets/style.js';

export default function Navigation({navigation}){
    const [activeTab, setActiveTab] = useState("home");
    return(
        <View style={styles.navContainer}>
        <View style={{flex:0, flexDirection:'row', justifyContent:'space-around', }}>
                <Pressable onPress={() => setActiveTab('home')} style={() => [activeTab === "home" ? styles.navActive : styles.navButton, {backgroundColor: '#FF6B6B'}]}><Image source={require('../assets/Home.png')}></Image></Pressable>
                <Pressable onPress={() => setActiveTab('schedule')} style={() => [activeTab === "schedule" ? styles.navActive: styles.navButton, {backgroundColor: '#FFE66D'}]}><Image source={require('../assets/Calendar.png')}></Image></Pressable>
                <Pressable onPress={() => setActiveTab("")}  style={() => [activeTab === "" ? styles.navActive: styles.navButton, {backgroundColor: '#FFD3B6'}]}><Image source={require('../assets/Home.png')}></Image></Pressable>
                <Pressable onPress={() => setActiveTab("")}  style={() => [activeTab === "" ? styles.navActive: styles.navButton, {backgroundColor: '#4ECDC4'}]}><Image source={require('../assets/Home.png')}></Image></Pressable>
                <Pressable onPress={() => setActiveTab("profile")}  style={() => [activeTab === "profile" ? styles.navActive: styles.navButton, {backgroundColor: '#FDA132'}]}><Image source={require('../assets/User.png')}></Image></Pressable>
        </View>
        </View>
    );
}