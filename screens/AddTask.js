import React, {useState, useEffect} from 'react';
import { View, Text, Modal, Pressable, StyleSheet, ImageBackground, Image, ScrollView, TextInput, Button} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';

import useDictionary from '../hook/useDictionary.js'
import {supabase} from '../config/initSupabase.js';
import { validateTitle, validateDate, validatePriority } from '../util/validation.js';
import Header from '../components/Header.js';
import Nav from '../components/Nav.js';
import styles from '../assets/style.js';

export default function AddTask ({navigation, route}){
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

    const [level, setLevel] = useState();

    const weekDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const taskID = route?.params?.taskID;
    const method = route?.params?.method;

    const dictionary = useDictionary();

    console.log(taskID);
     useEffect(()=> {
        if(taskID && method == 'Edit'){
            editTask();
        } else if (taskID && method == 'Add Subtask') {
            addSubTask();
        }
    }, [taskID])

    const editTask = async() =>{

        const user = (await supabase.auth.getUser()).data.user;

        if(!user) return;
 
        const {data, error} = await supabase
            .from('tasks')
            .select(
                'title, date, recurring, priority'
            )
            .eq('user_id', user.id)
            .eq('id', taskID)
            .single()

        console.log(data)
        
        if(error){
            console.log(error);
        }

        setTitle(data.title)
        setDate(new Date(data.date))
        setDays(data.recurring)
        setPriority(data.priority);
    }

    const addSubTask = async() => {
        const user = (await supabase.auth.getUser()).data.user;

        if(!user) return;
        
        const {data, error} = await supabase
            .from('tasks')
            .select(
                'level'
            )
            .eq('user_id', user.id)
            .eq('id', taskID)
            .single()

            if(error){
            console.log(error);
            }


        setLevel(data.level);
    }


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
        const titleErr = validateTitle(title, dictionary);
        const dateErr = validateDate(date, dictionary);
        const priorityErr = validatePriority(priority, dictionary);

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
        const user = (await supabase.auth.getUser()).data.user;

        if(!user) return;
        console.log("HI2");
            const formattedDate = date.toLocaleDateString('en-CA', {
        timeZone: 'Asia/Kuala_Lumpur'
        })
            console.log("HI3");
            if(taskID && method === "Edit"){
            const {data, error} = await supabase
                .from('tasks')
                .update({
                    user_id : user?.id,
                    title : title,
                    date: formattedDate,
                    recurring: days,
                    priority: priority,
                })
                .eq('id', taskID)
            
            if(!error){
                navigation.navigate('Tasks');
            }

            }else if (taskID && method === "Add Subtask") {
            const {data, error} = await supabase
                .from('tasks')
                .insert({
                    user_id : user?.id,
                    title : title,
                    date: formattedDate,
                    recurring: days,
                    priority: priority,
                    parent_key: taskID,
                    level: level + 1, 
                  
            })

            if(!error){
                navigation.navigate('Tasks');
            }
        }
            else{
            const {data, error} = await supabase
            .from('tasks')
            .insert({
                user_id : user?.id,
                title : title,
                date: formattedDate,
                recurring: days,
                priority: priority,
                parent_key:null,
                level: 0,
            })

            if(!error){
                navigation.navigate('Tasks');
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
                                {dictionary.add_task}
                            </Text>
                        </View>
                    </View>
                        <ScrollView style={{height:'65%'}}>
                            <SafeAreaView style={{paddingHorizontal: 15}}>
                                <View style={styles.fields}>
                                    <Text style={styles.fieldLabels}>{dictionary.title}:</Text>
                                    <TextInput style={styles.input} placeholder={dictionary.title_placeholder} value={title} onChangeText={setTitle}></TextInput>
                                    {titleError ? (<Text style={styles.errorText}>{titleError}</Text>) : null}
                                </View>
                                <View style={styles.fields}>
                                    <Text style={styles.fieldLabels}>{dictionary.date}:</Text>
                                    <Pressable style={{backgroundColor:'transparent'}} onPress={showDatePicker} ><View style={[styles.input, {flex:0, justifyContent:'center', paddingHorizontal:'3%'}]}><Text>{date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}</Text></View></Pressable>
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
                                    <Text style={styles.fieldLabels}>{dictionary.recurring}:</Text>
                                    <View style={{flex:0, flexDirection:'row', justifyContent:'space-around'}}>
                                        {weekDay.map((day) =>(<Pressable key={day} onPress={()=> toggleDay(day)} style={{ borderColor: days.includes(day) ? "black" : null, padding:10, borderWidth: days.includes(day) ? 1 : null}}><Text style={{fontFamily:'JetBrainsMono_400Regular', fontSize:12}}>{day}</Text></Pressable>))}
                                    </View>
                                </View>
                                <View style={styles.fields}>
                                    <View style={{flex:0, flexDirection:'row', justifyContent:'space-between'}}>
                                        <Text style={styles.fieldLabels}>{dictionary.priority}:</Text>
                                        <Pressable onPress = {() => showPriorityTip()} style={[styles.borderButton, {paddingVertical:2, borderRadius:20, backgroundColor: null, opacity: tips ? 0.5 : 1,}]}><Text>?</Text></Pressable>
                                    </View>
                                    <View style={{flex:0, flexDirection:'row', }}>
                                        <Pressable onPress={()=> priority === 'Q1' ? setPriority('') : setPriority('Q1') } style={{borderColor:'black', borderWidth:1, marginRight:10, padding:5, backgroundColor: priority === 'Q1' ? '#c14343': null}}><Text style={{color:priority === 'Q1' ?  'white' : 'black'}}>Q1</Text></Pressable>
                                        <Pressable onPress={()=> priority === 'Q2' ? setPriority('') : setPriority('Q2')} style={{borderColor:'black', borderWidth:1, marginRight:10, padding:5, backgroundColor: priority === 'Q2' ? '#e3922f': null}}><Text style={{color: priority === 'Q2' ? 'white': 'black'}}>Q2</Text></Pressable>
                                        <Pressable onPress={()=> priority === 'Q3' ? setPriority('') : setPriority('Q3')} style={{borderColor:'black', borderWidth:1, marginRight:10, padding:5, backgroundColor: priority === 'Q3' ? '#efd868': null}}><Text style={{color:priority === 'Q3' ?  'white': 'black'}}>Q3</Text></Pressable>
                                        <Pressable onPress={()=> priority === 'Q4' ? setPriority('') : setPriority('Q4')} style={{borderColor:'black', borderWidth:1, padding:5, backgroundColor: priority === 'Q4' ? '#46b6af': null}}><Text style={{color:priority === 'Q4' ? 'white':  'black'}}>Q4</Text></Pressable>
                                    </View>
                                    {priorityError ? (<Text style={styles.errorText}>{priorityError}</Text>): null}
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
            </LinearGradient>
        </View>

    );
}
