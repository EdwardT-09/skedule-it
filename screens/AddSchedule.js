import React, {useState, useEffect} from 'react';
import { Platform, ActivityIndicator } from 'react-native';
import { View, Text, Modal, Pressable, StyleSheet, ImageBackground, Image, ScrollView, TextInput, Button} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';

import { formatTimeOnly } from '../util/common.js';
import useDictionary from '../hook/useDictionary.js'
import {supabase} from '../config/initSupabase.js';
import { ai } from '../config/initGemini.js';
import { validateSubject, validateDate, validateDateTime, validateTimes, validateColor } from '../util/validation.js';
import Header from '../components/Header.js';
import Nav from '../components/Nav.js';
import styles from '../assets/style.js';

export default function AddSchedule ({navigation, route}){
    const [subject, setSubject] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [color, setColor] = useState('');
    const [days, setDays] = useState([]);


    const [isAiMode, setIsAiMode] = useState(false);
    const [aiPromptInput, setAiPromptInput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const [showStartTime,setShowStartTime] = useState(false);
    const [showEndTime,setShowEndTime] = useState(false);  
    const [showStartDate,setShowStartDate] = useState(false);   
    const [showEndDate,setShowEndDate] = useState(false);   
    

    const [subjectError, setSubjectError] = useState('');
    const [timeError, setTimeError] = useState('');
    const [startDateError, setStartDateError] = useState('');
    const [endDateError, setEndDateError] = useState('');
    const [colorError, setColorError] = useState('');

    
    const [startPickerMode, setStartPickerMode] = useState('time');
    const [startDatePickerMode, setStartDatePickerMode] = useState('date');
    const [endTimePickerMode, setEndTimePickerMode] = useState('time');
    const [endPickerMode, setEndPickerMode] = useState('date');


    const weekDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const eventID = route?.params?.scheduleID;
    const method = route?.params?.method;
    const dictionary = useDictionary();

    console.log(eventID);
     useEffect(()=> {
        if(eventID && method == 'Edit'){
            editEvent();
        } 
    }, [eventID])

    const editEvent = async() =>{

        const user = (await supabase.auth.getUser()).data.user;

        if(!user) return;
 
        const {data, error} = await supabase
            .from('schedule_events')
            .select(
                'title, start_date, color, recurring, start_time, end_date, end_time'
            )
            .eq('user_id', user.id)
            .eq('id', eventID)
            .single()

        console.log(data)
        
        if(error){
            console.log(error);
        }

        setSubject(data.title)
        setStartDate(new Date(data.start_date))
        setStartTime(new Date(data.start_time))
        setEndTime(new Date(data.end_time))
        setEndDate(new Date(data.end_date))
        setDays(data.recurring)
        setColor(data.color);
    }



    const toggleDay = (day) =>{
        setDays((prev)=>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        )
    } 

   
    const validateFields = () =>{
        const subjectErr = validateSubject(subject, dictionary);
        const timeErr = validateTimes(startTime, endTime, dictionary);
        const startDateErr = validateDate(startDate, dictionary);
        const endDateErr = validateDate(endDate, dictionary);
        const colorErr = validateColor(color, dictionary);


        if (subjectErr == null && timeErr == null  && startDateErr == null && endDateErr == null && colorErr == null){
            submitEvent();
        } else{
            setSubjectError(subjectErr);
            setTimeError(timeErr);
            setStartDateError(startDateErr);
            setEndDateError(endDateErr);
            setColorError(colorErr);

            return false;
        }
    }

    const submitEvent = async() => {
        const user = (await supabase.auth.getUser()).data.user;

        if(!user) return;

        console.log("HI2");
        const formattedStartDate = startDate.toLocaleDateString('en-CA', {
        timeZone: 'Asia/Kuala_Lumpur'
        })
        const formattedEndDate = endDate.toLocaleDateString('en-CA', {
        timeZone: 'Asia/Kuala_Lumpur'
        })


            if(eventID && method === "Edit"){
            const {data, error} = await supabase
                .from('schedule_events')
                .update({
                    title : subject,
                    start_date : formattedStartDate,
                    start_time: formatTimeOnly(startTime),
                    end_time: formatTimeOnly(endTime),
                    end_date: formattedEndDate,
                    recurring: days,
                    color: color
                })
                .eq('id', eventID)
            
            if(!error){
                navigation.navigate('Schedule');
            }

            }
            else{
            const {data, error} = await supabase
            .from('schedule_events')
            .insert({
                    title : subject,
                    start_date : formattedStartDate,
                    start_time: formatTimeOnly(startTime),  
                    end_time: formatTimeOnly(endTime),
                    end_date: formattedEndDate,
                    recurring: days,
                    color: color
            })

            if(!error){
                navigation.navigate('Schedule');
            }
            console.log(error);
    }}

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
                                {dictionary.add_schedule}
                            </Text>
                        </View>
                    </View>
                        <ScrollView style={{height:'70%'}}>
                            <SafeAreaView style={{paddingHorizontal: 15}}>
                                <View style={styles.fields}>
                                    <Text style={styles.fieldLabels}>{dictionary.subject}:</Text>
                                    <TextInput style={styles.input} placeholder={dictionary.subject_placeholder} value={subject} onChangeText={setSubject}></TextInput>
                                    {subjectError ? (<Text style={styles.errorText}>{subjectError}</Text>) : null}
                                </View>
                            <View style={styles.fields}>
                                    <Text style={styles.fieldLabels}>{dictionary.start_date}:</Text>
                                    <Pressable style={{backgroundColor:'transparent'}} onPress={()=> setShowStartDate(true)} ><View style={[styles.input, {flex:0, justifyContent:'center', paddingHorizontal:'3%'}]}>
                                        <Text>{startDate.getDate()}/{startDate.getMonth()+1}/{startDate.getFullYear()}</Text></View></Pressable>
                                    {showStartDate && (
                                    <DateTimePicker
                                    value={startDate}
                                    mode={startDatePickerMode}
                                    is24Hour={true}
                                    onChange={(event, selectedDate) => {
                                        setStartDate(selectedDate)
                                        setShowStartDate(false);
                                        return;
                                    
                                    }} 
                                />

                                

                                )}
                                {startDateError ? (<Text style={styles.errorText}>{startDateError}</Text>) : null}
                                </View>
                                    <View style={styles.fields}>
                                    <Text style={styles.fieldLabels}>{dictionary.start_time}:</Text>
                                    <Pressable style={{backgroundColor:'transparent'}} onPress={()=> setShowStartTime(true)} ><View style={[styles.input, {flex:0, justifyContent:'center', paddingHorizontal:'3%'}]}>
                                        <Text>{startTime.getHours()}:{startTime.getMinutes()}</Text></View></Pressable>
                                    {showStartTime && (
                                    <DateTimePicker
                                    value={startTime}
                                    mode={startPickerMode}
                                    is24Hour={true}
                                    onChange={(event, selectedDate) => { if (!selectedDate) {
                                        setStartTime(selectedDate)
                                        setShowStartTime(false);
                                        return;
                                    }
                                    if(Platform.OS == 'android'){
                                        if (startPickerMode === 'date') {
                                            const newDate = new Date(startTime);

                                            newDate.setFullYear(
                                            selectedDate.getFullYear(),
                                            selectedDate.getMonth(),
                                            selectedDate.getDate()
                                            );

                                            setStartTime(newDate);

                                            // Open time picker next
                                            setStartPickerMode('time');
                                        } else {
                                            const newDate = new Date(startTime);

                                            newDate.setHours(selectedDate.getHours());
                                            newDate.setMinutes(selectedDate.getMinutes());

                                            setStartTime(newDate);
                                            setShowStartTime(false);
                                            setStartPickerMode('date');
                                        }
                                        }else if (Platform.OS == 'ios'){
                                            if (selectedDate){
                                                setStartTime(selectedDate);
                                            }
                                            setStartPickerMode('time')
                                        }}} 
                                />

                                

                                )}
                                {timeError ? (<Text style={styles.errorText}>{timeError}</Text>) : null}
                                </View>

                                <View style={styles.fields}>
                                    <Text style={styles.fieldLabels}>{dictionary.end_time}:</Text>
                                    <Pressable style={{backgroundColor:'transparent'}} onPress={()=> setShowEndTime(true)} ><View style={[styles.input, {flex:0, justifyContent:'center', paddingHorizontal:'3%'}]}>
                                        <Text>{endTime.getHours()}:{endTime.getMinutes()}</Text></View></Pressable>
                                    {showEndTime && (
                                    <DateTimePicker
                                    value={endTime}
                                    mode={endTimePickerMode}
                                    is24Hour={true}
                                    onChange={(event, selectedDate) => { if (!selectedDate) {
                                        setEndTime(selectedDate)
                                        setShowEndTime(false);
                                        return;
                                    }
                                    if(Platform.OS == 'android'){
                                        if (endTimePickerMode === 'date') {
                                            const newDate = new Date(endTime);

                                            newDate.setFullYear(
                                            selectedDate.getFullYear(),
                                            selectedDate.getMonth(),
                                            selectedDate.getDate()
                                            );

                                            setEndTime(newDate);

                                            // Open time picker next
                                            setEndTimePickerMode('time');
                                        } else {
                                            const newEndTime = new Date(endTime);

                                            newEndTime.setHours(selectedDate.getHours());
                                            newEndTime.setMinutes(selectedDate.getMinutes());

                                            setEndTime(newDate);
                                            setShowEndTime(false);
                                            setEndTimePickerMode('date');
                                        }
                                        }else if (Platform.OS == 'ios'){
                                            if (selectedDate){
                                                setEndTime(selectedDate);
                                            }
                                            setEndTimePickerMode('time')
                                        }}} 
                                />

                                

                                )}
                                {timeError ? (<Text style={styles.errorText}>{timeError}</Text>) : null}
                                </View>
                                <View style={styles.fields}>
                                    <Text style={styles.fieldLabels}>{dictionary.recurring}:</Text>
                                    <View style={{flex:0, flexDirection:'row', justifyContent:'space-around'}}>
                                        {weekDay.map((day) =>(<Pressable key={day} onPress={()=> toggleDay(day)} style={{ borderColor: days.includes(day) ? "black" : null, padding:10, borderWidth: days.includes(day) ? 1 : null}}><Text style={{fontFamily:'JetBrainsMono_400Regular', fontSize:12}}>{day}</Text></Pressable>))}
                                    </View>
                                </View>
                                {days?.length > 0  && (<View><View style={styles.fields}>
                                    <Text style={styles.fieldLabels}>{dictionary.end_date}:</Text>
                                    <Pressable style={{backgroundColor:'transparent'}} onPress={()=> setShowEndDate(true)} >
                                        <View style={[styles.input, {flex:0, justifyContent:'center', paddingHorizontal:'3%'}]}>
                                            <Text>{endDate.getDate()}/{endDate.getMonth() + 1}/{endDate.getFullYear()}</Text></View></Pressable>
                                    {showEndDate && (
                                    <DateTimePicker
                                    value={endDate}
                                    mode={endPickerMode}
                                    is24Hour={true}
                                    onChange={(event, selectedDate) => { if (!selectedDate) {
                                        setShowEndDate(false);
                                        return;
                                    }
                                    if(Platform.OS == 'android'){
                                        if (endPickerMode === 'date') {
                                            const newEndDate = new Date(endDate);

                                            newEndDate.setFullYear(
                                            selectedDate.getFullYear(),
                                            selectedDate.getMonth(),
                                            selectedDate.getDate()
                                            );

                                            setEndDate(newEndDate);

                   
                                            setEndPickerMode('time');
                                        } else {
                                            const newEndDate = new Date(endDate);

                                            newEndDate.setHours(selectedDate.getHours());
                                            newEndDate.setMinutes(selectedDate.getMinutes());

                                            setEndDate(newEndDate);
                                            setShowEndDate(false);
                                            setEndPickerMode('date');
                                        }
                                        }else if (Platform.OS == 'ios'){
                                            if(selectedDate){
                                                setEndDate(selectedDate);
                                            }
                                            setEndPickerMode('date')
                                        }}} 
                                />

                                )}
                                {endDateError ? (<Text style={styles.errorText}>{endDateError}</Text>) : null}
                                </View>
                              
                                </View>
                                )}
                                <View style={styles.fields}>
                                    <View style={{flex:0, flexDirection:'row', justifyContent:'space-between'}}>
                                        <Text style={styles.fieldLabels}>{dictionary.color}:</Text>
                                    </View>
                                    <View style={{flex:0, flexDirection:'row', }}>
                                        <Pressable onPress={()=> color === '#FFA94D' ? setColor('') : setColor('#FFA94D') } style={{borderColor:'black' , borderWidth:color === '#FFA94D' ? 1 :0 , marginRight:10, padding:15, backgroundColor: '#FFA94D'}}></Pressable>
                                        <Pressable onPress={()=> color  === '#FEE172' ? setColor('') : setColor('#FEE172')} style={{borderColor:'black', borderWidth:  color === '#FEE172' ? 1 :0, marginRight:10, padding:15, backgroundColor:'#FEE172'}}></Pressable>
                                        <Pressable onPress={()=> color  === '#FFB6C1' ? setColor('') : setColor('#FFB6C1')} style={{borderColor:'black', borderWidth: color === '#FFB6C1' ? 1 : 0 , marginRight:10, padding:15, backgroundColor:  '#FFB6C1'}}></Pressable>
                                        <Pressable onPress={()=> color  === '#cdf5e9' ? setColor('') : setColor('#cdf5e9')} style={{borderColor:'black', borderWidth: color === '#cdf5e9' ? 1 : 0, padding:15, backgroundColor:  '#cdf5e9'}}></Pressable>
                                    </View>
                                    {colorError ? (<Text style={styles.errorText}>{colorError}</Text>): null}
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
            </LinearGradient>
        </View>

    );
}
