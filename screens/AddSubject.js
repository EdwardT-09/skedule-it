import React, {useState, useEffect} from 'react';
import { View, Text, Modal, Pressable, StyleSheet, ImageBackground, Image, ScrollView, TextInput, Button} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';

import useDictionary from '../hook/useDictionary.js'
import {supabase} from '../config/initSupabase.js';
import { validateSubjectCode, validateSubject} from '../util/validation.js';
import Header from '../components/Header.js';
import Nav from '../components/Nav.js';
import styles from '../assets/style.js';

export default function AddTask ({navigation, route}){
    const [name, setName] = useState('');
    const [subjectCode, setSubjectCode] = useState('');
    const [nameError, setNameError] = useState('');
    const [subjectCodeError, setSubjectCodeError] = useState('');
  
    const subjectID = route?.params?.subjectID;

    const dictionary = useDictionary();

    console.log(subjectID);
     useEffect(()=> {
        if(subjectID){
            editSubject();
        } 
    }, [subjectID])

    const editSubject = async() =>{

        const user = (await supabase.auth.getUser()).data.user;

        if(!user) return;
 
        const {data, error} = await supabase
            .from('subjects')
            .select(
                'name, subject_code'
            )
            .eq('user_id', user.id)
            .eq('id', subjectID)
            .single()

        console.log(data)
        
        if(error){
            console.log(error);
        }

        setName(data.name);
        setSubjectCode(data.subject_code);
    }

    

    

    const validateFields = () =>{
        const subjectCodeErr = validateSubjectCode(subjectCode, dictionary);
        const nameErr = validateSubject(name, dictionary);

        if (subjectCodeErr == null && nameErr == null){
            submitSubject();
        } else{
            setSubjectCodeError(subjectCodeErr);
            setNameError(nameErr);

            return false;
        }
    }

    const submitSubject = async() => {
        const user = (await supabase.auth.getUser()).data.user;

        if(!user) return;

        if(subjectID){
        const {error} = await supabase
            .from('subjects')
            .update({
                user_id : user?.id,
                subject_code : subjectCode,
                name: name,
            })
            .eq('id', subjectID)
        
        if(!error){
            navigation.navigate('Subject', {subjectID: subjectID});
        }

        }
        else{
            console.log('HIIII')
        const {error} = await supabase
        .from('subjects')
        .insert({
            user_id : user?.id,
            subject_code : subjectCode,
            name: name,
        })

    
        if(!error){
            navigation.navigate('Subjects');
        }}


        
    }

    return(
        <View style={{flex:1,}}>
            <LinearGradient colors={['#F9FAF4', '#F9FAF4', '#cdf5e9', '#FEE172']} style={{flex:1}}>
                <Header includeBack navigation={navigation}></Header>
                <View style={{flex:0, alignItems:'center'}}>
                <View style={[styles.container, ]}>
                    <View style={[styles.titleContainer]}>
                        <View style={{paddingHorizontal: '5%'}}>
                            <Text style={styles.subtitle}>{dictionary.lets_go}</Text>
                            <Text style={styles.title}>
                                {dictionary.add_subject}
                            </Text>
                        </View>
                    </View>
                        <ScrollView style={{height:'65%'}}>
                            <SafeAreaView style={{paddingHorizontal: 15}}>
                                <View style={styles.fields}>
                                    <Text style={styles.fieldLabels}>{dictionary.subject_code}:</Text>
                                    <TextInput style={styles.input} placeholder={dictionary.title_placeholder} value={subjectCode} onChangeText={setSubjectCode}></TextInput>
                                    {subjectCodeError ? (<Text style={styles.errorText}>{subjectCodeError}</Text>) : null}
                                </View>
                                <View style={styles.fields}>
                                    <Text style={styles.fieldLabels}>{dictionary.subject}:</Text>
                                    <TextInput style={styles.input} placeholder={dictionary.title_placeholder} value={name} onChangeText={setName}></TextInput>
                                    {nameError ? (<Text style={styles.errorText}>{nameError}</Text>) : null}
                                </View>                                
                                <Pressable style={({pressed}) => [styles.trueCenter, styles.buttons, {opacity: pressed? 0.5 : 1, backgroundColor:'black'},]} onPress={validateFields}>
                                            <View style={[{flexDirection:'row'}, {alignItems:'center'}]}>
                                                <Text style={[styles.buttonTexts, {color:'white'}]} >{dictionary.add}</Text>
                                            </View>
                                </Pressable>
                            </SafeAreaView>
                        </ScrollView>
                    </View>
                </View>
                <Nav></Nav>
            </LinearGradient>
        </View>

    );
}
