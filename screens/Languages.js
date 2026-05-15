import React, {useState} from 'react';
import { View, Text, Button, ImageBackground, Image, TextInput, Pressable,ScrollView} from "react-native";


import Header from '../components/Header.js';
import Navigation from '../components/Nav.js';
import styles from '../assets/style.js';

export default function Languages(){
    return(
    <ImageBackground source={require('../assets/bg3.png')} style={{flex:1}}>
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
                    <Pressable style={({pressed}) => [styles.settingItem, {backgroundColor: pressed? "#e9e9e9" : '#ffffff'}, { borderColor:'black', borderBottomWidth:1}]}><Text style={styles.settingsText}>english</Text></Pressable>
                    <Pressable style={({pressed}) => [styles.settingItem, {backgroundColor: pressed? "#e9e9e9" : '#ffffff'}, { borderColor:'black', borderBottomWidth:1}]}><Text style={styles.settingsText}>bahasa melayu</Text></Pressable>
                    <Pressable style={({pressed}) => [styles.settingItem, {backgroundColor: pressed? "#e9e9e9" : '#ffffff'}, { borderColor:'black', borderBottomWidth:1}]}><Text style={styles.settingsText}>中文（简体）</Text></Pressable>

            </View>
        </View>
        <Navigation/>
    </ImageBackground>
    )
}