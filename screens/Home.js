import React from 'react';
import {View, Text, ImageBackground,Image} from 'react-native';


import Header from '../components/Header.js';
import Navigation from '../components/Navigation.js';
import styles from '../assets/style.js';

export default function Home(){
    return(
        <ImageBackground
            source= {require('../assets/bg.png')}
            style={{flex:1}}>
        <Header></Header>
        <View style={styles.center}>
            <Text style={styles.welcomeText}>
                WELCOME BACK, USERNAME2026
            </Text>
            <View style={[styles.container, {marginTop:'10%'}]}>
                <View style={[styles.titleContainer,{backgroundColor:'#FFE66D'}]}>
                    <Image source={require('../assets/Pin.png')} style={{flex:0, alignSelf:'center',width:16, height:16}}></Image>
                    <View style={{paddingLeft: '5%'}}>
                        <Text style={styles.subtitle}>let's go</Text>
                        <Text style={styles.title}>
                            tasks for the day
                        </Text>
                    </View>
                </View>
                <Text>
                Hello
                </Text>
            </View>
        </View>
        <Navigation></Navigation>
        </ImageBackground>
            )
}