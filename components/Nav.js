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
        <View style={styles.navContainer}>
            <View style={{flex:0, flexDirection:'row', justifyContent:'space-around', }}>
                    <View style={{flex:0, flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                        <Pressable onPress={() => {navigation.navigate('Home')}}  style={() => [activeTab === "Home" ? styles.navActive : styles.navButton, {backgroundColor: activeTab === "Home" ?  '#c1c1c1' : 'white', }]}>
                            <Image source={activeTab === "Home" ? require('../assets/HomeWhite.png') : require('../assets/Home.png')}></Image>
                        </Pressable>
                        <Text style={styles.navLabel}>{dictionary.home}</Text>
                    </View>
                    <View style={{flex:0, flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                        <Pressable onPress={() => navigation.navigate('Home')} style={() => [activeTab === "Schedule" ? styles.navActive: styles.navButton, {backgroundColor: activeTab === "Schedule" ? '#c1c1c1' : 'white'}]}>
                            <Image source={activeTab === "Schedule" ? require('../assets/CalendarWhite.png') : require('../assets/Calendar.png')}></Image>
                        </Pressable>
                        <Text style={styles.navLabel}>{dictionary.schedule}</Text>
                    </View>
                    <View style={{flex:0, flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                        <Pressable onPress={() => navigation.navigate('Home')}  style={() => [activeTab === "" ? styles.navActive: styles.navButton, {backgroundColor: activeTab === "" ? '#c1c1c1' : 'white'}]}>
                            <Image source={require('../assets/Home.png')}></Image>
                        </Pressable>
                        <Text style={[styles.navLabel,{color: activeTab === "" ? '#d3b098' : 'black', }]}>{dictionary.study}</Text>
                    </View>
                    <View style={{flex:0, flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                        <Pressable onPress={() => {navigation.navigate('Tasks')}}  style={() => [activeTab === "Tasks" ? styles.navActive: styles.navButton, {backgroundColor: activeTab === "Tasks" ? '#c1c1c1' : 'white'}]}>
                            <Image source={activeTab === "Tasks" ? require('../assets/HomeWhite.png'):  require('../assets/Home.png')}></Image>
                        </Pressable>
                        <Text style={styles.navLabel}>{dictionary.tasks}</Text>
                    </View>
                    <View style={{flex:0, flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                        <Pressable onPress={() => { navigation.navigate('Profile')}}  style={() => [activeTab === "Profile" ? styles.navActive: styles.navButton, {backgroundColor: activeTab === "Profile" ?'#c1c1c1' : 'white'}]}>
                            <Image source={activeTab === "Profile" ? require('../assets/UserWhite.png'): require('../assets/User.png')}></Image>
                        </Pressable>
                        <Text style={styles.navLabel}>{dictionary.profile}</Text>
                    </View>
            </View>
        </View>
    );
}