import React, {useState, useEffect} from 'react';
import { View, Text, Button, ImageBackground, Image, TextInput, Pressable,ScrollView, Switch} from "react-native";

import {supabase} from '../config/initSupabase.js';
import Header from '../components/Header.js';
import Navigation from '../components/Nav.js';
import styles from '../assets/style.js';

export default function Profile({navigation}){
    const [isEnabled, setIsEnabled] = useState(false);
   
    useEffect(()=>{
            fetchNotification();
    },[])

    const saveNotification = async() => {
        const toggle = !isEnabled;
        setIsEnabled(toggle);
        
        const user = (await supabase.auth.getUser()).data.user;

        if (!user) console.log('No User 1');

        const {data, error} = await supabase
            .from('profiles')
            .upsert({
                id:user?.id,
                notification: toggle,
            })

            if(error){
                console.log(error);
            }

            console.log('saved');
    }

    const fetchNotification = async() => {


        const user = (await supabase.auth.getUser()).data.user;

        if (!user) console.log('No User 2');

        const {data, error} = await supabase
            .from('profiles')
            .select('notification')
            .eq('id', user.id)
            .single();

        console.log(data.notification);
        if(data){
            setIsEnabled(data.notification);
        }

        if(error){
            console.log('Error: Notification Fetching');
        }

    }
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
                        <Pressable onPress={ () => {navigation.navigate('Languages')}} style={({pressed}) => [styles.settingItem, {backgroundColor: pressed? "#e9e9e9" : '#ffffff'},{borderColor:'black', borderBottomWidth:1,flexDirection:'row', alignItems:'center', justifyContent:'space-between'}]}>
                            <View style={[{flexDirection:'row'}, {alignItems:'center'}]}>
                                <Image source={require('../assets/Globe.png')}></Image>
                                <Text style={styles.settingsText}>languages</Text>
                            </View>
                            <View>
                                <Image source={require('../assets/Caret Right.png')}></Image>
                                </View>
                        </Pressable>
                        <View style={[styles.settingItem,{borderColor:'black', borderBottomWidth:1,flexDirection:'row', alignItems:'center', justifyContent:'space-between'}]}>
                            <View style={[{flexDirection:'row'}, {alignItems:'center'}]}>
                                <Image source={require('../assets/Bell.png')}></Image>
                                <Text style={styles.settingsText}>notification</Text>
                            </View>
                            <View>
                                <Switch trackColor={{false: 'gray', true: 'gray'}} thumbColor={isEnabled? 'black' : 'white'} onValueChange={saveNotification} value={isEnabled}></Switch>
                            </View>
                        </View>
                        <Pressable onPress={()=>{navigation.navigate('Password')}} style={({pressed}) => [styles.settingItem, {backgroundColor: pressed? "#e9e9e9" : '#ffffff'},{borderColor:'black', borderBottomWidth:1,flexDirection:'row', alignItems:'center', justifyContent:'space-between'}]}>
                            <View style={[{flexDirection:'row'}, {alignItems:'center'}]}>
                                <Image source={require('../assets/Key.png')}></Image>
                                <Text style={styles.settingsText}>change password</Text>
                            </View>
                            <View>
                                <Image source={require('../assets/Caret Right.png')}></Image>
                            </View>
                        </Pressable>
                    <View style={{paddingLeft:'3%', paddingVertical:'4%', flex:0, justifyContent:'center', alignItems:'center'}}>
                        <View style={[{flexDirection:'row'}, {alignItems:'center'}]}>
                            <Image source={require('../assets/Log out.png')}></Image>
                            <Text style={[styles.settingsText,{color:'#c14343'}]}>logout</Text>
                        </View>
                    </View>

                </View>
            </View>
        </ScrollView>
        <Navigation></Navigation>
    </ImageBackground>)
}