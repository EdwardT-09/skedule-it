import React, {useState, useEffect} from 'react';
import { View, Text, Button, ImageBackground, Image,  Pressable,ScrollView, Switch} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Modal from 'react-native-modal'
import Markdown from 'react-native-markdown-display';

import useDictionary from '../hook/useDictionary.js';
import {supabase} from '../config/initSupabase.js';
import Header from '../components/Header.js';
import styles from '../assets/style.js';
import { isNotLoggedIn } from '../util/common.js';


export default function NotesViewer ({navigation, route}){
    const fileID = route?.params?.fileID;
    const content = route?.params?.content;

    //store notes
    const [notes, setNotes] = useState(content || '');


    useEffect(()=> {
        isNotLoggedIn(navigation)
    }, [])
       

    return(
        <View style={{flex:1,}}>
            <LinearGradient colors={['#F9FAF4', '#F9FAF4', '#cdf5e9', '#FEE172']} style={{flex:1}}>
                <Header includeBack navigation={navigation}/>
                <ScrollView style={{paddingHorizontal:'5%', maxHeight:'65%'}}>
                    <View style={{paddingBottom:'25%'}}>
                        <Markdown style={{marginBottom:'5%'}}>{notes}</Markdown>
                    </View>
                </ScrollView>
                <Pressable onPress={() => navigation.navigate('Chat', { fileID :fileID, content : notes})} style={{backgroundColor:'#1e1e1e', padding: 15, borderRadius: 50, marginTop: 20, width:65, height:65,  position: 'absolute', bottom:80, right:40, flex:0, alignItems:'center', justifyContent:'center'}}>
                   <Image source={require('../assets/Chat.png')}/> 
                </Pressable>
            </LinearGradient>
        </View>
    );
}
