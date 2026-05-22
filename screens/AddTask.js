import React, {useState} from 'react';
import { View, Text, Modal, Pressable, StyleSheet, ImageBackground, Image, ScrollView, TextInput, Button} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';

import {supabase} from '../config/initSupabase.js';
import { validateTitle, validateDate, validatePriority } from '../util/validation.js';
import Header from '../components/Header.js';
import Nav from '../components/Nav.js';
import styles from '../assets/style.js';

export default function AddTask ({navigation}){
    const [title, setTitle] = useState('');

    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show,setShow] = useState(false);


     const [days, setDays] = useState([]);
    const [priority, setPriority] = useState('Q4');

    const [titleError, setTitleError] = useState('');
    const [dateError, setDateError] = useState('');
    const [priorityError, setPriorityError] = useState('');

    //used to determine whether the priority tip popup is open or closed
    const [tips, setTips] = useState(false);

    const weekDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const toggleDay = (day) =>{
        setDays((prev)=>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        )
    } 

    const showMode = (currentMode) =>{
        setShow(true);
        setMode(currentMode);
    }

    const showDatePicker = () =>{
        showMode('date');
    }

    const showPriorityTip = () =>{
        setTips(true);
    }

    const validateFields = () =>{
        const titleErr = validateTitle(title);
        const dateErr = validateDate(date);
        const priorityErr = validatePriority(priority);

        if (titleErr == null && dateErr == null && priorityErr == null){
            submitTask();
        } else{
            setTitleError(titleErr);
            setDateError(dateErr);
            setPriorityError(priorityErr);

            return false;
        }
    }

    const submitTask = async() => {
        console.log("HI");
        const user = (await supabase.auth.getUser()).data.user;

        if(!user) return;
     console.log("HI2");

            console.log("HI3");
            const {data, error} = await supabase
            .from('tasks')
            .insert({
                user_id : user?.id,
                title : title,
                date: date,
                recurring: days,
                priority: priority,
            })

            if(!error){
                navigation.navigate('Tasks');
            }


        
    }

    return(
        <ImageBackground source={require('../assets/bg4.jpg')} imageStyle={{opacity:0.4}} style={{flex:1}}>
            <Header></Header>
            <View style={{flex:0, justifyContent:'center', alignItems:'center'}}>
            <View style={[styles.container]}>
                <View style={[styles.titleContainer,{backgroundColor:'#c14343'}]}>
                    <Image source={require('../assets/Pin.png')} style={{flex:0, alignSelf:'center',width:16, height:16}}></Image>
                    <View style={{paddingHorizontal: '5%'}}>
                        <Text style={styles.subtitle}>let's go</Text>
                        <Text style={styles.title}>
                            add task
                        </Text>
                    </View>
                </View>
                    <ScrollView style={{height:'50%'}}>
                        <SafeAreaView style={{paddingHorizontal: 15}}>
                            <View style={styles.fields}>
                                <Text style={styles.fieldLabels}>title:</Text>
                                <TextInput style={styles.input} placeholder='enter a title' value={title} onChangeText={setTitle}></TextInput>
                                {titleError ? (<Text style={styles.errorText}>{titleError}</Text>) : null}
                            </View>
                            <View style={styles.fields}>
                                <Text style={styles.fieldLabels}>date:</Text>
                                <Pressable style={{backgroundColor:'white'}} onPress={showDatePicker} ><View style={[styles.input, {flex:0, justifyContent:'center', paddingHorizontal:'3%'}]}><Text>{date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}</Text></View></Pressable>
                                {show && (
                                <DateTimePicker
                                value={date}
                                mode={mode}
                                is24Hour={true}
                                onChange={(event, selectedDate) => {setDate(selectedDate); setShow(false)}}
                                />
                            )}
                            {dateError ? (<Text style={styles.errorText}>{dateError}</Text>) : null}
                            </View>
                            <View style={styles.fields}>
                                <Text style={styles.fieldLabels}>recurring:</Text>
                                <View style={{flex:0, flexDirection:'row', justifyContent:'space-around'}}>
                                    {weekDay.map((day) =>(<Pressable key={day} onPress={()=> toggleDay(day)} style={{ borderColor: days.includes(day) ? "#e3922f" : null, padding:10, borderWidth: days.includes(day) ? 1 : null}}><Text style={{fontFamily:'JetBrainsMono_400Regular', fontSize:12}}>{day}</Text></Pressable>))}
                                </View>
                            </View>
                            <View style={styles.fields}>
                                <View style={{flex:0, flexDirection:'row', justifyContent:'space-between'}}>
                                    <Text style={styles.fieldLabels}>priority:</Text>
                                    <Pressable onPress = {() => showPriorityTip()}style={[styles.borderButton, {paddingVertical:2, borderRadius:20, backgroundColor: tips ? '#e5e5e5' : "white"}]}><Text>?</Text></Pressable>
                                </View>
                                <View style={{flex:0, flexDirection:'row', }}>
                                    <Pressable onPress={()=> priority === 'Q1' ? setPriority('') : setPriority('Q1') } style={{borderColor:'#c14343', borderWidth:1, marginRight:10, padding:5, backgroundColor: priority === 'Q1' ? '#c14343': 'white'}}><Text style={{color:priority === 'Q1' ?  'white' : '#c14343'}}>Q1</Text></Pressable>
                                    <Pressable onPress={()=> priority === 'Q2' ? setPriority('') : setPriority('Q2')} style={{borderColor:'#e3922f', borderWidth:1, marginRight:10, padding:5, backgroundColor: priority === 'Q2' ? '#e3922f': 'white'}}><Text style={{color: priority === 'Q2' ? 'white': '#e3922f'}}>Q2</Text></Pressable>
                                    <Pressable onPress={()=> priority === 'Q3' ? setPriority('') : setPriority('Q3')} style={{borderColor:'#efd868', borderWidth:1, marginRight:10, padding:5, backgroundColor: priority === 'Q3' ? '#efd868': 'white'}}><Text style={{color:priority === 'Q3' ?  'white': '#efd868'}}>Q3</Text></Pressable>
                                    <Pressable onPress={()=> priority === 'Q4' ? setPriority('') : setPriority('Q4')} style={{borderColor:'#46b6af', borderWidth:1, padding:5, backgroundColor: priority === 'Q4' ? '#46b6af': 'white'}}><Text style={{color:priority === 'Q4' ? 'white':  '#46b6af'}}>Q4</Text></Pressable>
                                </View>
                                {priorityError ? (<Text style={styles.errorText}>{priorityError}</Text>): null}
                            </View>
                            <Pressable style={({pressed}) => [styles.trueCenter, styles.buttons, {backgroundColor: pressed? "#e4b639" : '#FFE66D'}, {transform: [{rotate: '3deg'}]}]} onPress={validateFields}>
                                        <View style={[{flexDirection:'row'}, {alignItems:'center'}]}>
                                            <Text style={styles.buttonTexts} >Add </Text>
                                            <Image source={require('../assets/Check.png')}>
                                            </Image>
                                        </View>
                            </Pressable>
                        </SafeAreaView>
                    </ScrollView>

            </View>
        </View>
        <Nav></Nav>
        <Modal animationType="fade" transparent={true} visible={tips} onRequestClose={()=>setTips(!tips)}>
            <View style={styles.priorityPopBack}>
                <View style={styles.priorityPopContainer}>
                    <Pressable onPress={()=>setTips(!tips)} style={{flex:0, alignSelf:'flex-end', margin:10}}>
                        <Image source={require('../assets/close.png')}></Image>
                    </Pressable>
                    <Text style={styles.priorityTitle}>Eisenhower Matrix</Text>
                    <Image source = {require('../assets/PriorityTips.png')} style={{flex:0, alignSelf:'center',marginTop:'5%'}}></Image>
                </View>
            </View>
        </Modal>
        </ImageBackground>

    );
}
