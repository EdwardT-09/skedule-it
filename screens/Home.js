import React, {useState, useEffect} from 'react';
import {View, Text, ImageBackground,Image, ScrollView, Pressable} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {supabase} from '../config/initSupabase.js'
import Header from '../components/Header.js';
import Navigation from '../components/Nav.js';
import styles from '../assets/style.js';

export default function Home({navigation}){
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
        <View style={{flex:1}}>
            <LinearGradient colors={['#F9FAF4', '#F9FAF4', '#cdf5e9', '#FEE172']} style={{flex:1}}>
            <Header></Header>
            <View style={styles.center}>
                <Text style={styles.welcomeText}>
                    WELCOME BACK, {username || 'STUDENT'}
                </Text>
                <View style={[styles.container, {marginTop:'10%'}]}>
                    <View style={[styles.titleContainer,]}>
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
            <Pressable onPress={()=> navigation.navigate('AddTask')} style={styles.addTaskButton}>
                <Image source={require('../assets/Plus.png')}></Image>
            </Pressable>
            </View>
            <Navigation></Navigation>
        </LinearGradient>
        </View>
            )
}