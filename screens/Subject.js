import React, {useState, useEffect} from 'react';
import { View, Text, Button, ImageBackground, Image, TextInput, Pressable,ScrollView, Switch} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Modal from 'react-native-modal'

import useDictionary from '../hook/useDictionary.js';
import {supabase} from '../config/initSupabase.js';
import Header from '../components/Header.js';
import Navigation from '../components/Nav.js';
import styles from '../assets/style.js';



export default function Subject ({navigation, route}){
    const [menuVisible, setMenuVisible] = useState(false);
    const [subjectCode, setSubjectCode] = useState('');
    const [name, setName] = useState('');

    const dictionary = useDictionary();

    const subjectID = route?.params?.subjectID;

    useEffect(() => {getSubject()}, []);
    
    const getSubject = async() => {
        const user = (await supabase.auth.getUser()).data.user;

        if (!user) return;

        const {data, error} = await supabase
        .from('subjects')
        .select('id, subject_code, name')
        .eq('user_id', user?.id)
        .eq('id', subjectID)
        .single();

        if (error){
            return
        }

        setSubjectCode(data.subject_code);
        setName(data.name);
    }

    return(
       <View style={{flex:1,}}>
            <LinearGradient colors={['#F9FAF4', '#F9FAF4', '#cdf5e9', '#FEE172']} style={{flex:1}}>
                <Header/>
                <View style={[styles.container,{ paddingHorizontal:'5%'}]}>
                    <View style={styles.titleContainer}>
                        <View>
                            <Text style={styles.subtitle}>subject</Text>
                            <Text style={styles.title}>{subjectCode} - {name}</Text>
                        </View>
                        <Pressable onPress={() => {setMenuVisible(true)}}>
                            <Image source={require('../assets/Menu.png')} style={{width:20, height:20, resizeMode:'contain', flex:0, alignSelf:'flex-end'}}></Image>
                        </Pressable>
                    </View>
                </View>
                <Navigation></Navigation>
                <Modal style={{justifyContent: 'flex-end', margin:0}} transparent={true} isVisible={menuVisible} swipeDirection="down" onSwipeComplete={()=> setMenuVisible(false)} onBackdropPress={()=> setMenuVisible(false)} propagateSwipe={true}>
            <View style={[styles.modalMenuContainer]}>
                <Pressable onPress={()=>{setMenuVisible(false)}}>
                    <Image source={require('../assets/close.png')} style={{ flex:0, justifyContent:'center', alignSelf:'flex-end'}}></Image>
                </Pressable>
                <View>
                    <Pressable onPress = {()=> navigation.navigate('AddSubject', {subjectID:subjectID})} style={({pressed})=> ([styles.modalMenuItem,{ backgroundColor: pressed ? 'rgb(235, 235, 235)': null}])}>
                        <Image source={require('../assets/Edit.png')} style={styles.modalMenuImage}></Image>
                        <Text style={styles.modalMenuLabels}>{dictionary.edit}</Text>
                    </Pressable>
                    <Pressable onPress= {()=> deleteTask(subjectID)} style={({pressed})=> ([styles.modalMenuItem,{ backgroundColor: pressed ? 'rgb(235, 235, 235)': null}])}>
                        <Image source={require('../assets/Trash.png')} style={styles.modalMenuImage}></Image>
                        <Text style={[styles.modalMenuLabels, {color:'#c14343'}]}>{dictionary.delete}</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>

            </LinearGradient>
        </View>
    );
}