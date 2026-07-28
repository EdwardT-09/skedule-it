import React, {use, useState, useEffect} from 'react';
import { View, Text, Button, ImageBackground, Image, Pressable,ScrollView, ActivityIndicator} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

import useDictionary from '../hook/useDictionary.js';
import {supabase} from '../config/initSupabase.js';
import Header from '../components/Header.js';
import Navigation from '../components/Nav.js';
import styles from '../assets/style.js';
import { isNotLoggedIn } from '../util/common.js';

export default function Languages({navigation}){
    const {dictionary, loading, refreshDictionary} = useDictionary();
    const [isLanguage, setIsLanguage] = useState('en');
    
    //if user not logged in, then navigate to landing page
    useEffect(()=>{
            isNotLoggedIn(navigation)
        },[])
    const saveLanguage  = async(lang) => {
        const user = (await supabase.auth.getUser()).data.user;
    
        if(!user) return;

        const {data, error} = await supabase
            .from('profiles')
            .upsert({
                id:user?.id,
                language: lang,
            })
        

        refreshDictionary();
        navigation.navigate('Profile');
    }

    if(loading){
        return(
            <View style={{flex:1}}>
            <LinearGradient colors={['#F9FAF4', '#F9FAF4', '#cdf5e9', '#FEE172']} style={{flex:1}}>
                <Header></Header>
            <View style={{flex: 1, justifyContent:"center", alignItems:"center"}}>
                <ActivityIndicator size="large" color="black"></ActivityIndicator>
            </View>
            </LinearGradient>
            </View>
        )
    }
    return(
    <View style={{flex:1}}>
        <LinearGradient colors={['#F9FAF4', '#F9FAF4', '#cdf5e9', '#FEE172']} style={{flex:1}}>
            <Header includeBack navigation={navigation}/>
            <View style={{flex:0, justifyContent:'center', alignItems:'center',}}>
                <View style={[styles.container, {marginTop:'10%'}]}>
                    <View style={[styles.titleContainer, ]}>
                        <View style={{paddingLeft: '5%'}}>
                            <Text style={[styles.subtitle,]}>{dictionary.settings}</Text>
                            <Text style={styles.title}>
                                {dictionary.updated} {dictionary.languages}
                            </Text>
                        </View>
                    </View>
                        <Pressable onPress={() => {setIsLanguage('en'); saveLanguage('en');}} style={({pressed}) => [styles.settingItem, {opacity: pressed ? 0.5 : 1}, { borderColor:'black', borderBottomWidth:1}]}><Text style={styles.settingsText}>english</Text></Pressable>
                        <Pressable onPress={() => {setIsLanguage('bm'); saveLanguage('bm');}} style={({pressed}) => [styles.settingItem, {opacity: pressed ? 0.5 : 1}, { borderColor:'black', borderBottomWidth:1}]}><Text style={styles.settingsText}>bahasa melayu</Text></Pressable>
                        <Pressable onPress={() => {setIsLanguage('zh'); saveLanguage('zh');}} style={({pressed}) => [styles.settingItem, {opacity: pressed ? 0.5 : 1}, { borderColor:'black', borderBottomWidth:1}]}><Text style={styles.settingsText}>中文（简体）</Text></Pressable>

                </View>
            </View>
        </LinearGradient>
    </View>
    )
}