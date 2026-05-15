import React, {useState} from 'react';
import { View, Text, Button, ImageBackground, Image, TextInput, Pressable,ScrollView} from "react-native";
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

import Header from '../components/Header.js';
import Navigation from '../components/Nav.js';
import styles from '../assets/style.js';

export default function Password(){
    return(
    <ImageBackground source={require('../assets/bg3.png')} style={{flex:1}}>

        <Header/>
        <View style={{flex:0, justifyContent:'center', alignItems:'center'}}>
            <View style={[styles.container, {marginTop:'10%'}]}>
                <View style={[styles.titleContainer,{backgroundColor:'#c14343'}]}>
                    <View style={{paddingLeft: '5%'}}>
                        <Text style={styles.subtitle}>settings</Text>
                        <Text style={styles.title}>
                            change password
                        </Text>
                    </View>
                </View>
                <ScrollView>
                    <SafeAreaView style={{paddingHorizontal: 15}}>
                        <View style={styles.fields}>
                            <Text style={styles.fieldLabels}>Current Password: </Text>
                            <TextInput style={styles.input}></TextInput>
                        </View>
                        <View style={styles.fields}>
                            <Text style={styles.fieldLabels}>New Password: </Text>
                            <TextInput style={styles.input}></TextInput>
                        </View>
                        <View style={styles.fields}>
                            <Text style={styles.fieldLabels}>Confirm New Password: </Text>
                            <TextInput style={styles.input}></TextInput>
                        </View>
                        <Pressable style={({pressed}) => [styles.trueCenter, styles.buttons, {backgroundColor: pressed? "#e4b639" : '#FFE66D'}, {transform: [{rotate: '3deg'}]}]}>
                            <View style={[{flexDirection:'row'}, {alignItems:'center'}]}>
                                <Text style={styles.buttonTexts} >LET'S GO </Text>
                                <Image source={require('../assets/Check.png')}>
                                </Image>
                            </View>
                        </Pressable>
                    </SafeAreaView>
                </ScrollView>

            </View>
        </View>

        
    </ImageBackground>
    )
}