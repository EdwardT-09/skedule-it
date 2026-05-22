import React, {useState} from 'react';
import { View, Text, Button, ImageBackground, Image, TextInput, Pressable,ScrollView} from "react-native";

import {supabase} from '../config/initSupabase.js';
import Header from '../components/Header.js';
import Navigation from '../components/Nav.js';
import styles from '../assets/style.js';

export default function Languages(){
    const [isLanguage, setIsLanguage] = useState('en');
    const saveLanguage  = async(lang) => {
        const user = (await supabase.auth.getUser()).data.user;
    
        if(!user) return;

        const {data, error} = await supabase
            .from('profiles')
            .upsert({
                id:user?.id,
                language: lang,
            })
        
    }
    return(
    <ImageBackground source={require('../assets/bg4.jpg')} imageStyle={{opacity:0.4}} style={{flex:1}}>
        <Header/>
        <View style={{flex:0, justifyContent:'center', alignItems:'center'}}>
            <View style={[styles.container, {marginTop:'10%'}]}>
                <View style={[styles.titleContainer,{backgroundColor:'#c14343'}]}>
                    <View style={{paddingLeft: '5%'}}>
                        <Text style={styles.subtitle}>settings</Text>
                        <Text style={styles.title}>
                            change language
                        </Text>
                    </View>
                </View>
                    <Pressable onPress={() => {setIsLanguage('en'); saveLanguage('en');}} style={({pressed}) => [styles.settingItem, {backgroundColor: pressed? "#e9e9e9" : '#ffffff'}, { borderColor:'black', borderBottomWidth:1}]}><Text style={styles.settingsText}>english</Text></Pressable>
                    <Pressable onPress={() => {setIsLanguage('bm'); saveLanguage('bm');}} style={({pressed}) => [styles.settingItem, {backgroundColor: pressed? "#e9e9e9" : '#ffffff'}, { borderColor:'black', borderBottomWidth:1}]}><Text style={styles.settingsText}>bahasa melayu</Text></Pressable>
                    <Pressable onPress={() => {setIsLanguage('zh'); saveLanguage('zh');}} style={({pressed}) => [styles.settingItem, {backgroundColor: pressed? "#e9e9e9" : '#ffffff'}, { borderColor:'black', borderBottomWidth:1}]}><Text style={styles.settingsText}>中文（简体）</Text></Pressable>

            </View>
        </View>
        <Navigation/>
    </ImageBackground>
    )
}