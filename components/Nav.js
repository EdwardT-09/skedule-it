import React, {useState} from 'react';
import {View, Text, Image, BackHandler, Pressable} from 'react-native';
import useDictionary from '../hook/useDictionary.js';
import { useNavigation, useRoute } from '@react-navigation/native';

import styles from '../assets/style.js';

export default function Navigation(){
    const navigation = useNavigation();
    const route = useRoute();
    //get current screen name
    const activeTab = route.name;

    const dictionary = useDictionary();
    return(
        <View style={styles.nav}>
            <View style={styles.navContainer}>
                <View style={{flex:0, flexDirection:'row', justifyContent:'space-around', }}>
                        <View style={{flex:0, flexDirection: 'column' , justifyContent:'center', alignItems:'center'}}>
                            <Pressable onPress={() => {navigation.navigate('Home')}}  style={() => [activeTab === "Home" ? styles.navActive : styles.navButton, {backgroundColor: activeTab === "Home" ?  '#eeeeee' : '#1e1e1e', flex:0, flexDirection: activeTab  === "Home" ?'row' : null , justifyContent:'center', alignItems:'center'}]}>
                                <Image source={activeTab === "Home" ? require('../assets/Home.png') : require('../assets/HomeWhite.png')}></Image>
                                <Text style={[styles.navLabel, {display: activeTab == "Home" ? 'flex': 'none', marginLeft:'2.5%'}]}>{dictionary.home}</Text>
                            </Pressable>
                        </View>
                        <View style={{flex:0, flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                            <Pressable onPress={() => navigation.navigate('Subjects')}  style={() => [activeTab === "" ? styles.navActive: styles.navButton, {backgroundColor: activeTab === "Subjects" ? '#eeeeee' : '#1e1e1e', flex:0, flexDirection: activeTab  === "Subjects" ?'row' : null , justifyContent:'center', alignItems:'center'}]}>
                                <Image source={activeTab === "Subjects" ? require('../assets/Book.png') : require('../assets/BookWhite.png')}></Image>
                                <Text style={[styles.navLabel, {display: activeTab == "Subjects" ? 'flex': 'none', marginLeft:'2.5%'}]}>{dictionary.study}</Text>
                            </Pressable>
                        </View>
                        <View style={{flex:0, flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                            <Pressable onPress={() => navigation.navigate('Schedule')} style={() => [activeTab === "Schedule" ? styles.navActive: styles.navButton, {backgroundColor: activeTab === "Schedule" ? '#eeeeee' : '#1e1e1e', flex:0, flexDirection: activeTab  === "Schedule" ?'row' : null , justifyContent:'center', alignItems:'center'}]}>
                                <Image source={activeTab === "Schedule" ? require('../assets/Calendar.png') : require('../assets/CalendarWhite.png')}></Image>
                                <Text style={[styles.navLabel, {display: activeTab == "Schedule" ? 'flex': 'none', marginLeft:'2.5%'}]}>{dictionary.schedule}</Text>
                        </Pressable>
                        </View>
                        <View style={{flex:0, flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                            <Pressable onPress={() => {navigation.navigate('Tasks')}}  style={() => [activeTab === "Tasks" ? styles.navActive: styles.navButton, {backgroundColor: activeTab === "Tasks" ? '#eeeeee' : '#1e1e1e', flex:0, flexDirection: activeTab  === "Tasks" ?'row' : null , justifyContent:'center', alignItems:'center'}]}>
                                <Image source={activeTab === "Tasks" ? require('../assets/Clipboard.png'):  require('../assets/ClipboardWhite.png')}></Image>
                                <Text style={[styles.navLabel, {display: activeTab == "Tasks" ? 'flex': 'none', marginLeft:'2.5%'}]}>{dictionary.tasks}</Text>
                            </Pressable>

                        </View>
                        <View style={{flex:0, flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                            <Pressable onPress={() => { navigation.navigate('Profile')}}  style={() => [activeTab === "Profile" ? styles.navActive: styles.navButton, {backgroundColor: activeTab === "Profile" ?'#eeeeee' : '#1e1e1e', flex:0, flexDirection: activeTab  === "Profile" ?'row' : null , justifyContent:'center', alignItems:'center'}]}>
                                <Image source={activeTab === "Profile" ? require('../assets/User.png'): require('../assets/UserWhite.png')}></Image>
                                <Text style={[styles.navLabel, {display: activeTab == "Profile" ? 'flex': 'none', marginLeft:'2.5%'}]}>{dictionary.profile}</Text>
                            </Pressable>
                        </View>
                </View>
            </View>
        </View>
    );
}