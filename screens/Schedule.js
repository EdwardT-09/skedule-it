import React, {use, useState, useEffect} from 'react';
import { View, Text, Button, ImageBackground, Image, Pressable,ScrollView, ActivityIndicator} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

import Modal from 'react-native-modal';
import useDictionary from '../hook/useDictionary.js';
import {supabase} from '../config/initSupabase.js';
import Header from '../components/Header.js';
import Navigation from '../components/Nav.js';
import styles from '../assets/style.js';
import AddSchedule from './AddSchedule.js';
import { isNotLoggedIn } from '../util/common.js';
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { generateICS } from '../util/ics.js';


export default function Schedule({navigation}){
    const {dictionary, loading} = useDictionary();

    //useState for showing the modal for each event schedule
    const [eventMenuVisible, setEventMenuVisible] = useState(false);

    // anchor to hold as the reference monday for this week
    const [mondayAnchor, setMondayAnchor] = useState(getMonday(new Date()));

    //store the day headers data objects
    const [weekDays, setWeekDays] = useState([]);

    //store the calendar event rows fetched from Supabase
    const [events, setEvents] = useState([]);

    const [selectedEvent, setSelectedEvent] = useState('');

    const [startTime, setStartTime] = useState(new Date());
    
    const [endTime, setEndTime] = useState(new Date());

    const HOURS = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13',  '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']

    const COLUMN_WIDTH = 130;
    const TIME_COL_WIDTH = 60;

    //if user not logged in, then navigate to landing page
    useEffect(()=>{
            isNotLoggedIn(navigation)
        },[])

    //to extract the monday date of any given week based on the date provided
    function getMonday(d){
        const date = new Date(d);
        const day = date.getDay();

        //get the date for the monday of the week
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);

        return new Date(date.setDate(diff));
    }

   //set up a side effect hook that watches the mondayAnchor state and triggers calculations on shift
   useEffect (()=>{
        const daysArray = []; //array to assemble the structural day headers

        for(let i = 0; i < 7; i++){
            const currentDay = new Date(mondayAnchor);
            currentDay.setDate(mondayAnchor.getDate() + i);

            //add the formatted day to the end of the array
            daysArray.push({
                name:currentDay.toLocaleDateString('en-US', {weekday: 'short'}).toLowerCase(),
                number:currentDay.getDate(),
                month: currentDay.getMonth() + 1,
                isoString:`${currentDay.getFullYear()}-${String(currentDay.getMonth()+1).padStart(2,'0')}-${String(currentDay.getDate()).padStart(2,'0')}`
            });

        }
        //commit the assembled day header configurations into your component's reactive state array
        setWeekDays(daysArray);
        //fire the database coordinator function to pull matching event entries from supabase
        fetchScheduleForTheWeek(daysArray);
   }, [mondayAnchor])


   const handleNextWeek = () =>{
        const nextMonday = new Date(mondayAnchor); 
        nextMonday.setDate(mondayAnchor.getDate()+7); //get the date for the Monday of next week
        setMondayAnchor(nextMonday);
   };

      const handlePrevWeek = () =>{
        const prevMonday = new Date(mondayAnchor); 
        prevMonday.setDate(mondayAnchor.getDate()-7); //get the date for the Monday of the previous week
        setMondayAnchor(prevMonday);
   };



    const exportToICS = async(events) =>{
        try{
            const icsString = generateICS(events);

            const fileUri = FileSystem.documentDirectory + "schedule.ics";

            await FileSystem.writeAsStringAsync(fileUri, icsString, {
                encoding: FileSystem.EncodingType.UTF8,
            })

            await Sharing.shareAsync(fileUri)
        } catch (err){
            return;
        }
    }

    const fetchUserSchedule = async() => {
        const user = (await supabase.auth.getUser()).data.user;

        if(!user) return;

        const {data,error} = await supabase
            .from("schedule_events")
            .select(`title, start_date, end_date, start_time, end_time, recurring`)
            .eq('user_id', user?.id)
        
        if(!error && data){
            await exportToICS(data);
        } else{
            Alert.alert(dictionary.error, error.message);
        }

        
    }



   //get data from database
   const fetchScheduleForTheWeek = async(currentWeekDays) => {
        const user = (await supabase.auth.getUser()).data.user;

        if(!user) return;
        
        if(currentWeekDays.length === 0) return;

        const startRange = currentWeekDays[0].isoString;
        const endRange = currentWeekDays[currentWeekDays.length - 1].isoString;

        const {data, error} = await supabase
        .from('schedule_events')
        .select('*')
        .gte('end_date', startRange)
        .lte('start_date', endRange)
        .eq('user_id', user?.id)

        if(!error && data){
            setEvents(data);
        }
   }

   const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const eventOccurence = (event, dayObj) => {
        const currentDate = dayObj.isoString;

        // non recurring event
        if (!event.recurring || event.recurring.length === 0) {
            return currentDate === event.start_date;
        }

        // recurring event
        if(currentDate < event.start_date || currentDate > event.end_date){
            return false;
        }

        const current = new Date(currentDate);
        const weekday = dayName[current.getDay()];

        return event.recurring.includes(weekday);
    };

   const renderGridCell = (hour, dayObj) =>{
    const cellEvent = events.find(event =>{
        const eventDate = new Date(event.start_date);
        const eventHour = event.start_time.split(":")[0];
    
        
        const matchesHour = eventHour === hour;
        const matchesDay = eventOccurence(event, dayObj);

        return matchesHour && matchesDay;
    })


    return (
        <View>
            {cellEvent && (
                <View style={{backgroundColor: cellEvent.color || '#FF6B6B',
                        borderRadius: 8,
                        borderWidth: 2,
                        borderColor: '#000',
                        padding: 6,
                        }}>
                    <View style={{flex:0, justifyContent:'space-between', flexDirection:'row', width:'85%'}}>
                        <Text style={{fontSize: 15, fontWeight: '900', color:'#000'}}>{cellEvent.title}</Text>
                        <Pressable  onPress={() => {setEventMenuVisible(true); setSelectedEvent(cellEvent.id);}}>
                            <Image source={require('../assets/Menu.png')} style={{width:20, height:20}}/>
                        </Pressable>
                    </View>
                        <Text style={{fontSize:13}}>{cellEvent.start_time.split("+")[0]} - {cellEvent.end_time.split("+")[0]}</Text>
                </View>
            )}
        </View>
    )
   }

    const deleteEvent = async(selectedEvent) =>{
            const user = (await supabase.auth.getUser()).data.user;

            if(!user) return;

            const {error} = await supabase
            .from('schedule_events')
            .delete()
            .eq('id', selectedEvent)

            if(error){
                console.log(error);
            } else{ 
                setEventMenuVisible(false);
                navigation.navigate('Schedule')
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
    <View style={{flex:1}}>
        <LinearGradient colors={['#F9FAF4', '#F9FAF4', '#cdf5e9', '#FEE172']} style={{flex:1}}>
            <Header navigation={navigation}/>
                    <View style={[styles.container, {marginTop:'10%',}]}>
                        <View style={[styles.titleContainer,]}>
                            <View style={{paddingHorizontal: '5%'}}>
                                <Text style={styles.subtitle}>{dictionary.lets_go}</Text>
                                <View style={{flex:0, flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:'5%'}}>
                                    <Text style={styles.title}>
                                        {dictionary.schedule}
                                    </Text>
                                    <View style={{flex:0, flexDirection:'row', gap:12}}>
                                        <Pressable onPress={fetchUserSchedule}>
                                            <Image source={require('../assets/Download.png')}/>
                                        </Pressable>
                                        <Pressable onPress={()=>{navigation.navigate('AddSchedule')}}>
                                            <Image source={require('../assets/Plus.png')}/>
                                        </Pressable>
                                    </View>
                                </View>
                                <View style={{flex:0, flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                                    <Pressable onPress={handlePrevWeek} style={{borderWidth:2, borderColor:'gray', padding:'2.5%'}}><Text style={{fontWeight:'900'}}>{"<"}</Text></Pressable>
                                    <Pressable onPress={handleNextWeek} style={{borderWidth:2, borderColor:'gray', padding:'2.5%'}}><Text style={{fontWeight:'900'}}>{">"}</Text></Pressable>
                                </View>
                            </View>
                        </View>
                        
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
                            <View style={{flexDirection:'column'}}> 
                                <View style={{ flexDirection: 'row',  backgroundColor: '#FFB84D', borderWidth: 2, borderColor: '#000', borderRadius: 4, marginBottom: 5 }}>
                                    <View style={{width:TIME_COL_WIDTH, borderRightWidth:2, borderColor:'#000'}}/>
                                        {weekDays.map(day => (
                                            <View key={day.isoString} style={{width:COLUMN_WIDTH, alignItems:'center', paddingVertical:4, borderRightWidth: day.name === 'sun' ? 0 : 1, borderColor: 'gray'}}>
                                                <Text style={{fontWeight: '700', fontSize:12}}>{day.name}</Text>
                                                <Text style={{fontWeight: '900', fontSize:16}}>{day.number}/{day.month}</Text>
                                            </View>
                                        ))}
                                </View>
                                
                                <View style={{height:"55%", borderWidth:2, borderColor: 'gray', borderRadius: 4,}}>
                                <ScrollView>
                                    {HOURS.map(hour =>(
                                        <View key={hour} style={{flexDirection:'row', borderBottomWidth:1, borderColor: 'gray'}}>
                                            <View style={{width:TIME_COL_WIDTH, padding: 10, justifyContent:'center', alignItems:'center', borderRightWidth:2, borderColor:'gray'}}>
                                                <Text style={{fontWeight:'900', fontSize:14}}>{hour}</Text>
                                            </View>
                                            {weekDays.map(dayObj => <View key={`${hour} - ${dayObj.isoString}`} style={{ width:COLUMN_WIDTH, minHeight:100, padding:4,     overflow: 'hidden'}}>{renderGridCell(hour, dayObj)}</View>)}
                                        </View>
                                    ))}
                                </ScrollView>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                    <Navigation/>
                    <Modal style={{justifyContent: 'flex-end', margin:0}} transparent={true} isVisible={eventMenuVisible} swipeDirection="down" onSwipeComplete={()=> setEventMenuVisible(false)} onBackdropPress={()=> setEventMenuVisible(false)} propagateSwipe={true}>
                        <View style={[styles.modalMenuContainer]}>
                            <Pressable onPress={()=>{setEventMenuVisible(false)}}>
                                <Image source={require('../assets/close.png')} style={{ flex:0, justifyContent:'center', alignSelf:'flex-end'}}></Image>
                            </Pressable>
                            <View>
                                <Pressable onPress = {()=> {navigation.navigate('AddSchedule', {scheduleID:selectedEvent, method:'Edit'});setEventMenuVisible(false)}} style={({pressed})=> ([styles.modalMenuItem,{ backgroundColor: pressed ? 'rgb(235, 235, 235)': null}])}>
                                    <Image source={require('../assets/Edit.png')} style={styles.modalMenuImage}></Image>
                                    <Text style={styles.taskMenuLabels}>{dictionary.edit}</Text>
                                </Pressable>
                                <Pressable onPress= {()=> {deleteEvent(selectedEvent);setEventMenuVisible(false)}} style={({pressed})=> ([styles.modalMenuItem,{ backgroundColor: pressed ? 'rgb(235, 235, 235)': null}])}>
                                    <Image source={require('../assets/Trash.png')} style={styles.modalMenuImage}></Image>
                                    <Text style={[styles.taskMenuLabels, {color:'#c14343'}]}>{dictionary.delete}</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal>
        </LinearGradient>
    </View>
    )
}