import React, {useState, useEffect, use} from 'react';
import { View, Text, Modal, Pressable, StyleSheet, ImageBackground, Image, ScrollView, TextInput, Button} from 'react-native';
import { validateUsername, validateGender } from '../util/validation.js';
import styles from '../assets/style.js';

import useDictionary from '../hook/useDictionary.js'
import Header from '../components/Header.js';
import { LinearGradient } from 'expo-linear-gradient';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import {supabase} from '../config/initSupabase.js';

export default function ChangeInfo({navigation}){
    useEffect(()=>{
        getDetails();
    }, [])

    const dictionary = useDictionary();

    const [username, setUsername] = useState('');
    const [gender, setGender] = useState('');

    const [usernameError, setUsernameError] = useState('');
    const [genderError, setGenderError] = useState('');

    const getDetails = async() =>{
           const user = (await supabase.auth.getUser()).data.user;
        
            if(!user) return;
        
     
            const {data, error} = await supabase
            .from('profiles')
            .select('username, gender')
            .eq('id', user?.id)
            .single('');

            if(data){
                setUsername(data?.username);
                setGender(data?.gender);
            }
        
    }

    const updateDetails = async()=> {
        const user = (await supabase.auth.getUser()).data.user;
    
        if(!user) return;
        const usernameErr = validateUsername(username, dictionary);
        const genderErr = validateGender(gender, dictionary);

        setUsernameError(usernameErr);
        setGenderError(genderErr);
            
        if(usernameErr === null && genderErr === null){
            const {error} = await supabase
                .from('profiles')
                .update({
                    username:username,
                    gender:gender,
                })
                .eq('id', user?.id);

                if(!error){
                    navigation.navigate('Profile')
                }
            }};

          

    return(
         <View style={{flex:1,}}>
            <LinearGradient colors={['#F9FAF4', '#F9FAF4', '#cdf5e9', '#FEE172']} style={{flex:1}}>
                <Header includeBack navigation={navigation}></Header>
                <View style={styles.container}>
                    <View style={[styles.titleContainer, {padding:'5%'}]}>
                        <Text style={styles.desc}>{dictionary.personal_details}</Text>
                        <Text style={styles.title}>{dictionary.update} {dictionary.information}</Text>
                    </View>
                    <SafeAreaView style={{paddingHorizontal:15}}>
                        <View style={styles.fields}>
                            <Text style={styles.fieldLabels}>{dictionary.username}:</Text>
                            <TextInput style={styles.input} value={username} onChangeText={setUsername} placeholder={dictionary.username_placeholder}></TextInput>
                        </View>
                        <View style={styles.fields}>
                            <Text style={styles.fieldLabels}>{dictionary.gender}:</Text>
                            <View style={{flex:0, flexDirection:'row'}}>
                                <Pressable onPress={()=> gender === 'Male' ? setGender('') : setGender('Male')} style={{borderColor: 'black', borderWidth: gender=== 'Male' ? 1 : 0, marginRight:20, padding:5}}>
                                    <Text>{dictionary.male}</Text>
                                </Pressable>
                                <Pressable onPress={()=> gender === 'Female' ? setGender('') : setGender('Female')} style={{borderColor: 'black', borderWidth: gender=== 'Female' ? 1 : 0, marginRight:20, padding:5}}>
                                    <Text>{dictionary.female}</Text>
                                </Pressable>    
                            </View>
                        </View>
                        <Pressable style={({pressed}) => [styles.center, styles.buttons, {minHeight:50,backgroundColor: pressed? "#ffffff" : 'transparent'}]} onPress={updateDetails} >
                                <Text style={[styles.buttonTexts, {color:'black'}]} >{dictionary.update} </Text>
                        </Pressable>
                        
                    </SafeAreaView>
                </View>
            </LinearGradient>
        </View>
    );
}