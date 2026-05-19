import React, {useState} from 'react';
import { View, Text, Pressable, StyleSheet, ImageBackground, Image, ScrollView, TextInput, Button} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';

import Header from '../components/Header.js';
import Nav from '../components/Nav.js';
import styles from '../assets/style.js';

export default function AddTask ({navigation}){
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show,setShow] = useState(false);
    const [selectedRecurrance, setSelectedReccurrance] = useState("none");
    const [days, setDays] = useState([]);
    const [priority, setPriority] = useState('Q4');

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

    return(
        <ImageBackground source={require('../assets/bg3.png')} style={{flex:1}}>
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
                                <TextInput style={styles.input}></TextInput>
                            </View>
                            <View style={styles.fields}>
                                <Text style={styles.fieldLabels}>date:</Text>
                                <Pressable style={{backgroundColor:'white'}} onPress={showDatePicker} ><View style={[styles.input, {flex:0, justifyContent:'center', paddingHorizontal:'3%'}]}><Text>{date.toLocaleString()}</Text></View></Pressable>
                                {show && (
                                <DateTimePicker
                                value={date}
                                mode={mode}
                                is24Hour={true}
                                onChange={(event, selectedDate) => {setDate(selectedDate); setShow(false)}}
                                />
                            )}
                            </View>
                            <View style={styles.fields}>
                                <Text style={styles.fieldLabels}>recurring:</Text>
                                <View style={{flex:0, flexDirection:'row', justifyContent:'space-around'}}>
                                    {weekDay.map((day) =>(<Pressable key={day} onPress={()=> toggleDay(day)} style={{ backgroundColor: days.includes(day) ? "#e3922f" : "white", padding:10,}}><Text>{day}</Text></Pressable>))}
                                </View>
                            </View>
                            <View style={styles.fields}>
                                 <Text style={styles.fieldLabels}>priority:</Text>
                                <View style={{flex:0, flexDirection:'row', }}>
                                    <Pressable onPress={()=> setPriority('Q1')} style={{borderColor:'#c14343', borderWidth:1, marginRight:10, padding:5, backgroundColor: priority === 'Q1' ? '#c14343': 'white'}}><Text style={{color:priority === 'Q1' ?  'white' : '#c14343'}}>Q1</Text></Pressable>
                                    <Pressable onPress={()=> setPriority('Q2')} style={{borderColor:'#e3922f', borderWidth:1, marginRight:10, padding:5, backgroundColor: priority === 'Q2' ? '#e3922f': 'white'}}><Text style={{color: priority === 'Q2' ? 'white': '#e3922f'}}>Q2</Text></Pressable>
                                    <Pressable onPress={()=> setPriority('Q3')} style={{borderColor:'#efd868', borderWidth:1, marginRight:10, padding:5, backgroundColor: priority === 'Q3' ? '#efd868': 'white'}}><Text style={{color:priority === 'Q3' ?  'white': '#efd868'}}>Q3</Text></Pressable>
                                    <Pressable onPress={()=> setPriority('Q4')} style={{borderColor:'#46b6af', borderWidth:1, padding:5, backgroundColor: priority === 'Q4' ? '#46b6af': 'white'}}><Text style={{color:priority === 'Q4' ? 'white':  '#46b6af'}}>Q4</Text></Pressable>
                                </View>
                            </View>
                            <Pressable style={({pressed}) => [styles.trueCenter, styles.buttons, {backgroundColor: pressed? "#e4b639" : '#FFE66D'}, {transform: [{rotate: '3deg'}]}]}>
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
        </ImageBackground>

    );
}
