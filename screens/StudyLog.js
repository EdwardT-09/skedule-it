import React, {useState, useEffect} from 'react';
import { View, Text, Modal, Pressable, StyleSheet, ImageBackground, Image, ScrollView, Platform, TextInput, Button, ActivityIndicator} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';

import { Picker } from '@react-native-picker/picker';
import useDictionary from '../hook/useDictionary.js'
import {supabase} from '../config/initSupabase.js';
import { getDurationBySubject, getAvgConfidenceBySubject, getSessionCountBySubject } from '../util/performanceStats.js';
import { validateSubject, validateDuration, validateConfidence} from '../util/validation.js';
import Header from '../components/Header.js';
import Nav from '../components/Nav.js';
import styles from '../assets/style.js';
import { isNotLoggedIn } from '../util/common.js';

export default function StudyLog ({navigation, route}){
    const [subject, setSubject] = useState('');
    const [duration, setDuration] = useState('');
    const [confidence, setConfidence] = useState('');


    const [subjectError, setSubjectError] = useState('');
    const [durationError, setDurationError] = useState('');
    const [confidenceError, setConfidenceError] = useState('');


    const confidenceList = [ '😕', '😐', '🙂', '😊', '😎'];

    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);

    const subjectID = route?.params?.subjectID;

    const {dictionary, loading} = useDictionary();


     useEffect(()=> {
        getSubjects();
        isNotLoggedIn(navigation);

        if(subjectID){
            editSubject();
        } 
    }, [subjectID])

    const getSubjects = async() =>{

        const user = (await supabase.auth.getUser()).data.user;

        if(!user) return;

        const {data,error} = await supabase
        .from('subjects')
        .select('id, name, subject_code')
        .eq('user_id', user.id)
        .order('name');


        setSubjects(data);
    }


    

    const validateFields = () =>{
        const subjectErr = validateSubject(selectedSubject, dictionary);
        const durationErr = validateDuration(duration, dictionary);
        const confidenceErr = validateConfidence(confidence, dictionary);

        if (subjectErr == null && durationErr == null && confidenceErr == null ){
            submitLog();
        } else{
            setSubjectError(subjectErr);
            setDurationError(durationErr);
            setConfidenceError(confidenceErr);

            return false;
        }
    }

    const submitLog = async() => {
        const user = (await supabase.auth.getUser()).data.user;

        if(!user) return;

        const {error} = await supabase
        .from('study_logs')
        .insert({
            user_id : user?.id,
            subject: selectedSubject,
            duration: duration,
            confidence: confidence,
        })

    
        if(!error){
            navigation.navigate('Home');
        }


        
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
                <Header includeBack navigation={navigation}></Header>
                <View style={{flex:0, alignItems:'center'}}>
                <View style={[styles.container, ]}>
                    <View style={[styles.titleContainer]}>
                        <View style={{paddingHorizontal: '5%'}}>
                            <Text style={styles.subtitle}>{dictionary.lets_go}</Text>
                            <Text style={styles.title}>
                                {dictionary.add_study_log}
                            </Text>
                        </View>
                    </View>
                        <ScrollView style={{height:'65%'}}>
                            <SafeAreaView style={{paddingHorizontal: 15}}>
                                <View style={styles.fields}>
                                    <Text style={styles.fieldLabels}>{dictionary.subject}:</Text>
                                    <Picker selectedValue={selectedSubject} onValueChange={(value)=>setSelectedSubject(value)} style={{color:'black'}}>
                                        <Picker.Item label={dictionary.select_subject}
                                        value={null} color="black"></Picker.Item>
                                        {subjects.map((subject) =>(
                                            <Picker.Item key={subject.id}  label={`${subject.subject_code} - ${subject.name}` } value={subject.id} color="black"/>
                                        ))}
                                    </Picker>
                                    {subjectError ? (<Text style={styles.errorText}>{subjectError}</Text>) : null}
                                </View>
                                <View style={styles.fields}>
                                    <Text style={styles.fieldLabels}>{dictionary.duration}:</Text>
                                    <TextInput style={styles.input} placeholder={dictionary.duration_placeholder} keyboardType='numeric' value={duration} onChangeText={setDuration} placeholderTextColor='#555555'></TextInput>
                                    {durationError ? (<Text style={styles.errorText}>{durationError}</Text>) : null}
                                </View>
                                <View style={styles.fields}>
                                    <Text style={styles.fieldLabels}>{dictionary.confidence}:</Text>
                                    <View style={{flex:0, flexDirection:'row', }}>
                                    {confidenceList.map((conf, index) => (
                                        <Pressable key={index} onPress={()=> confidence === index+ 1 ? setConfidence('') : setConfidence(index + 1)}style={{padding:10, borderWidth: confidence === (index + 1) ? 1 : 0, borderColor:'black'}}>
                                            <Text style={{fontSize:20}}>{conf}</Text>
                                        </Pressable>
                                    ))}
                                    </View>
                                    {confidenceError ? (<Text style={styles.errorText}>{confidenceError}</Text>) : null}
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
