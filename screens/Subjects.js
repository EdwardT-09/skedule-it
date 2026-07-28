import React, {useState, useEffect} from 'react';
import { View, Text, Button, ImageBackground, Image, Pressable,ScrollView, Switch, ActivityIndicator} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

import useDictionary from '../hook/useDictionary.js';
import {supabase} from '../config/initSupabase.js';
import Header from '../components/Header.js';
import Navigation from '../components/Nav.js';
import styles from '../assets/style.js';
import { isNotLoggedIn } from '../util/common.js';


export default function Subjects ({navigation}){
    
    const {dictionary, loading} = useDictionary();

    const [subjects, setSubjects] = useState([]);

    useEffect(()=> {getSubjects(); isNotLoggedIn(navigation)}, []);

    const getSubjects = async() =>{
        const user = (await supabase.auth.getUser()).data.user;

        if (!user) return;

        const {data, error} = await supabase
        .from('subjects')
        .select('id, subject_code, name')
        .eq('user_id', user?.id);


        if (error){
            return
        }

        data.sort((a,b)=> 
            a.id - b.id
        )
        
        setSubjects(data);
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
       <View style={{flex:1,}}>
            <LinearGradient colors={['#F9FAF4', '#F9FAF4', '#cdf5e9', '#FEE172']} style={{flex:1}}>
                <Header/>
                <View style={styles.container}>
                    <View style={[styles.titleContainer, {paddingHorizontal:20}]}>
                        <Text style={styles.subtitle}>{dictionary.classes}</Text>
                        <Text style={styles.title}>{dictionary.subjects}</Text>
                    </View>
                    <ScrollView contentContainerStyle={[styles.subjectContainer]}>
                        {subjects.map((subject) =>  (
                            <Pressable key={subject.id} style={styles.subjectItems} onPress={()=> navigation.navigate('Subject', {subjectID: subject.id})}>
                                <Image source={require('../assets/Folder.png')}></Image>
                                <Text>{subject.subject_code} - {subject.name}</Text>
                            </Pressable>
                            )
                        )}
                        <Pressable onPress={()=>navigation.navigate('AddSubject')} style={styles.subjectItems}>
                                <Image source={require('../assets/FolderPlus.png')}></Image>
                                <Text style={{textAlign:'center'}}>add subject</Text>
                        </Pressable>
                    </ScrollView>
                </View>
                <Navigation></Navigation>
            </LinearGradient>
        </View>
    );
}