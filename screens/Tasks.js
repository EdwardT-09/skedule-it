import React from 'react';
import { View, Text, Pressable, StyleSheet, ImageBackground, Image, ScrollView} from 'react-native';

import Header from '../components/Header.js';
import Nav from '../components/Nav.js';
import styles from '../assets/style.js';

export default function Tasks ({navigation}){
    return(
        <ImageBackground source={require('../assets/bg3.png')} style={{flex:1}}>
            <Header></Header>
            <View style={{flex:0, justifyContent:'center', alignItems:'center'}}>
            <View style={[styles.container]}>
                <View style={[styles.titleContainer,{backgroundColor:'#c14343'}]}>
                    <Image source={require('../assets/Pin.png')} style={{flex:0, alignSelf:'center',width:16, height:16}}></Image>
                    <View style={{paddingHorizontal: '5%'}}>
                        <Text style={styles.subtitle}>settings</Text>
                        <View style={{flex:0, flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                            <Text style={styles.title}>
                                tasks for the day
                            </Text>
                            <Pressable style={({pressed})=>[styles.addButton,{backgroundColor: pressed? '#c49832': '#efd868'}]}><Image source={require('../assets/Plus.png')}></Image></Pressable>
                        </View>
                    </View>
                </View>
                    <ScrollView style={{height:'50%'}}>
                        <Text>Hello</Text>
                    </ScrollView>

            </View>
        </View>
        <Nav></Nav>
        </ImageBackground>

    );
}
