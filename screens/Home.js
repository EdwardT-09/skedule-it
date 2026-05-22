import React, {useState, useEffect} from 'react';
import {View, Text, ImageBackground,Image, ScrollView} from 'react-native';

import {supabase} from '../config/initSupabase.js'
import Header from '../components/Header.js';
import Navigation from '../components/Nav.js';
import styles from '../assets/style.js';

export default function Home(){
    const [username, setUsername] = useState();

    useEffect(()=>{
        fetchUser();
    },[])
    async function fetchUser(){

        const {
            data: {user}
        } = await supabase.auth.getUser();

        if(!user) return;

        const {data, error} = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();
        
        if(data){
            setUsername(data.username);
        }

        if(error){
            console.log(error);
        }
    }
    return(
        <ImageBackground source={require('../assets/bg4.jpg')} imageStyle={{opacity:0.4}} style={{flex:1}}>
        <Header></Header>
        <View style={styles.center}>
            <Text style={styles.welcomeText}>
                WELCOME BACK, {username || 'STUDENT'}
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
                <ScrollView style={{height:"40%"}}>
                    <Text>
                    Hello
                    </Text>
                    
                </ScrollView>
            </View>
        </View>
        <Navigation></Navigation>
        </ImageBackground>
            )
}