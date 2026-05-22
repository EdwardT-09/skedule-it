import React, {useState} from 'react';
import {View, Text, Image, BackHandler, Pressable} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';

import styles from '../assets/style.js';

export default function Navigation(){
    const navigation = useNavigation();
    const route = useRoute();
    //get current screen name
    const activeTab = route.name;
    return(
        <View style={styles.navContainer}>
        <View style={{flex:0, flexDirection:'row', justifyContent:'space-around', }}>
                <View style={{flex:0, flexDirection:'column', justifyContent:'center', alignItems:'center'}}><Pressable onPress={() => {navigation.navigate('Home')}}  style={() => [activeTab === "Home" ? styles.navActive : styles.navButton, {backgroundColor: activeTab === "Home" ?  '#c14343' : 'white', }]}><Image source={activeTab === "Home" ? require('../assets/HomeWhite.png') : require('../assets/Home.png')}></Image></Pressable><Text style={[styles.navLabel,{color: activeTab === "Home" ?  '#c14343' : 'black', }]}>home</Text></View>
                <View style={{flex:0, flexDirection:'column', justifyContent:'center', alignItems:'center'}}><Pressable onPress={() => navigation.navigate('Home')} style={() => [activeTab === "Schedule" ? styles.navActive: styles.navButton, {backgroundColor: activeTab === "Schedule" ? '#efd868' : 'white'}]}><Image source={activeTab === "Schedule" ? require('../assets/CalendarWhite.png') : require('../assets/Calendar.png')}></Image></Pressable><Text style={[styles.navLabel,{color: activeTab === "Schedule" ? '#efd868' : 'black'}]}>schedule</Text></View>
                <View style={{flex:0, flexDirection:'column', justifyContent:'center', alignItems:'center'}}><Pressable onPress={() => navigation.navigate('Home')}  style={() => [activeTab === "" ? styles.navActive: styles.navButton, {backgroundColor: activeTab === "" ? '#d3b098' : 'white'}]}><Image source={require('../assets/Home.png')}></Image></Pressable><Text style={[styles.navLabel,{color: activeTab === "" ? '#d3b098' : 'black', }]}>home</Text></View>
                <View style={{flex:0, flexDirection:'column', justifyContent:'center', alignItems:'center'}}><Pressable onPress={() => {navigation.navigate('Tasks')}}  style={() => [activeTab === "Tasks" ? styles.navActive: styles.navButton, {backgroundColor: activeTab === "Tasks" ? '#46b6af' : 'white'}]}><Image source={activeTab === "Tasks" ? require('../assets/HomeWhite.png'):  require('../assets/Home.png')}></Image></Pressable><Text style={[styles.navLabel,{color:activeTab === "Tasks" ? '#46b6af' : 'black', }]}>tasks</Text></View>
                <View style={{flex:0, flexDirection:'column', justifyContent:'center', alignItems:'center'}}><Pressable onPress={() => { navigation.navigate('Profile')}}  style={() => [activeTab === "Profile" ? styles.navActive: styles.navButton, {backgroundColor: activeTab === "Profile" ?'#e3922f' : 'white'}]}><Image source={activeTab === "Profile" ? require('../assets/UserWhite.png'): require('../assets/User.png')}></Image></Pressable><Text style={[styles.navLabel,{color: activeTab === "Profile" ?'#e3922f' : 'black', }]}>profile</Text></View>
        </View>
        </View>
    );
}