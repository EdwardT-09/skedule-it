import React, {useState} from 'react';
import { View, Text, Button, ImageBackground, Image, TextInput, Pressable,ScrollView} from "react-native";


import Header from '../components/Header.js';
import Navigation from '../components/Nav.js';
import styles from '../assets/style.js';

export default function Profile({navigation}){
    return(
    <ImageBackground source={require('../assets/bg3.png')} style={{flex:1}}>
        <ScrollView>
            <View style={{flex:0, justifyContent:'center', alignItems:'center'}}>
                <Header></Header>
                <Text style={styles.profileText}>my profile</Text> 
                <View style={[styles.container, {marginTop:'10%'}]}>
                    <View style={[styles.titleContainer,{backgroundColor:'#c14343'}]}>
                        <View style={{paddingLeft: '5%'}}>
                            <Text style={styles.subtitle}>configuration</Text>
                            <Text style={styles.title}>
                                settings
                            </Text>
                        </View>
                    </View>
                        <Pressable style={({pressed}) => [styles.settingItem, {backgroundColor: pressed? "#e9e9e9" : '#ffffff'},{borderColor:'black', borderBottomWidth:1,flexDirection:'row', alignItems:'center', justifyContent:'space-between'}]}><View style={[{flexDirection:'row'}, {alignItems:'center'}]}><Image source={require('../assets/Globe.png')}></Image><Text style={styles.settingsText}>languages</Text></View><View><Image source={require('../assets/Caret Right.png')}></Image></View></Pressable>
                    <View style={{paddingHorizontal:'5%', paddingVertical:'4%', borderColor:'black', borderBottomWidth:1}}>
                        <Pressable style={({pressed}) => [styles.settingItem, {backgroundColor: pressed? "#e9e9e9" : '#ffffff'},{borderColor:'black', borderBottomWidth:1,flexDirection:'row', alignItems:'center', justifyContent:'space-between'}]}><View style={[{flexDirection:'row'}, {alignItems:'center'}]}><Image source={require('../assets/Bell.png')}></Image><Text style={styles.settingsText}>notification</Text></View><View><Image source={require('../assets/Caret Right.png')}></Image></View></Pressable>
                    </View>
                    <View style={{paddingHorizontal:'5%', paddingVertical:'4%', borderColor:'black', borderBottomWidth:1}}>
                        <Pressable style={({pressed}) => [styles.settingItem, {backgroundColor: pressed? "#e9e9e9" : '#ffffff'},{borderColor:'black', borderBottomWidth:1,flexDirection:'row', alignItems:'center', justifyContent:'space-between'}]}><View style={[{flexDirection:'row'}, {alignItems:'center'}]}><Image source={require('../assets/Key.png')}></Image><Text style={styles.settingsText}>change password</Text></View><View><Image source={require('../assets/Caret Right.png')}></Image></View></Pressable>
                    </View>
                    <View style={{paddingLeft:'3%', paddingVertical:'4%', flex:0, justifyContent:'center', alignItems:'center'}}>
                        <View style={[{flexDirection:'row'}, {alignItems:'center'}]}><Image source={require('../assets/Log out.png')}></Image><Text style={[styles.settingsText,{color:'#c14343'}]}>logout</Text></View>
                    </View>

                </View>
            </View>
        </ScrollView>
        <Navigation></Navigation>
    </ImageBackground>)
}