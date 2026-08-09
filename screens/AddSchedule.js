import React, {useState, useEffect} from 'react';
import { Platform, ActivityIndicator } from 'react-native';
import { View, Text, Modal, Pressable, StyleSheet, ImageBackground, Image, ScrollView, TextInput, Button} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';

import { formatTimeOnly, isNotLoggedIn } from '../util/common.js';
import useDictionary from '../hook/useDictionary.js'
import {supabase} from '../config/initSupabase.js';
import { ai } from '../config/initGemini.js';
import { validateSubject, validateDate, validateDateTime, validateTimes, validateColor } from '../util/validation.js';
import Header from '../components/Header.js';
import Nav from '../components/Nav.js';
import styles from '../assets/style.js';
import { getAvgConfidenceBySubject, getDurationBySubject, getSessionCountBySubject } from '../util/performanceStats.js';

export default function AddSchedule ({navigation, route}){
    //store schedule title
    const [subject, setSubject] = useState('');

    //store schedule dates and times
    const [startDate, setStartDate] = useState(new Date());
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    //store selected schedule color
    const [color, setColor] = useState('');

    //store selected recurring days
    const [days, setDays] = useState([]);

    //store fetched subjects and study logs
    const [subjects, setSubjects] = useState([]);
    const [logs, setLogs] = useState([]);

    //toggle between ai and manual 
    const [isAiMode, setIsAiMode] = useState(false);

    //store user's ai prompt
    const [aiPromptInput, setAiPromptInput] = useState('');

    //for loading spinner
    const [isGenerating, setIsGenerating] = useState(false);

    // control visibility of date and time pickers
    const [showStartTime,setShowStartTime] = useState(false);
    const [showEndTime,setShowEndTime] = useState(false);  
    const [showStartDate,setShowStartDate] = useState(false);   
    const [showEndDate,setShowEndDate] = useState(false);   
    
    //store validation error messages
    const [subjectError, setSubjectError] = useState('');
    const [timeError, setTimeError] = useState('');
    const [startDateError, setStartDateError] = useState('');
    const [endDateError, setEndDateError] = useState('');
    const [colorError, setColorError] = useState('');


    //used for recurring
    const weekDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    //obtain from the parameters
    const eventID = route?.params?.scheduleID;
    const method = route?.params?.method;

    const {dictionary, loading} = useDictionary();

    //check if user is logged in
    useEffect(()=>{
        isNotLoggedIn(navigation)
    },[])

    //load existing schedule details when editing a schedule event
     useEffect(()=> {
        if(eventID && method == 'Edit'){
            editEvent();
        } 
    }, [eventID])
    
    //retrieve selected schedule from Supabase and populate the fields in the form 
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

        //used to populate fields
        setSubject(data.title)
        setStartDate(new Date(data.start_date))
        setEndDate(new Date(data.end_date))
        setDays(data.recurring)
        setColor(data.color);

        //format the time to show as 12:00 format
        const start = new Date();
        const [startHour, startMinute] = data.start_time.split(':');

        start.setHours(Number(startHour));
        start.setMinutes(Number(startMinute));

        const end = new Date();
        const [endHour, endMinute] = data.end_time.split(':');

        end.setHours(Number(endHour));
        end.setMinutes(Number(endMinute));

        setStartTime(start);
        setEndTime(end);
    }

    //add or remove a recurring weekday from the selected list
    const toggleDay = (day) =>{
        setDays((prev)=>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        )
    } 

    //generate a schedule using Gemini
    const handleAIGenerate = async() =>{
        setIsGenerating(true);
        const user = (await supabase.auth.getUser()).data.user;

        if(!user) return;

        //formatted dates according to the local timezone
        const formattedStartDate = startDate.toLocaleDateString('en-CA', { timeZone: 'Asia/Kuala_Lumpur' });
        const formattedEndDate = endDate.toLocaleDateString('en-CA', { timeZone: 'Asia/Kuala_Lumpur' });

        const { data: existingSchedules } = await supabase
        .from("schedule_events")
        .select(`
            title,
            start_date,
            end_date,
            start_time,
            end_time,
            recurring
            `)
            .eq("user_id", user?.id)
            .lte("start_date", formattedEndDate)
            .gte("end_date", formattedStartDate)


        const subjects = await fetchSubjects();
        const logs = await fetchLogs();
        
        //get the statistics to use in the prompt for adaptable schedule based on learning abilities
        const durationStats = getDurationBySubject(subjects, logs);
        const sessionStats = getSessionCountBySubject(subjects, logs);
        const confidenceStats = getAvgConfidenceBySubject(subjects, logs);

        const performanceStats = subjects.map(subject =>({
            subject:subject.name,
            totalStudyMinutes: durationStats[subject.id].totalDuration,
            totalSessions: sessionStats[subject.id].sessions,
            averageConfidence: Number(
                confidenceStats[subject.id].avgConfidence.toFixed(1)
            )
        }));       
    

    try{
        const prompt = `
            User goal:
            ${aiPromptInput}

            Existing schedule: 
            ${JSON.stringify(existingSchedules, null, 2)}

            Performance statistics:
            ${JSON.stringify(performanceStats, null, 2)}

            You are an AI study planning assistant. Build a structural, balanced timetable or schedule matching these criteria:
            - Goal context / Subject context / Guidelines: "${aiPromptInput || 'General study schedule mapping'}"
            - The schedule timeline explicitly starts on: ${formattedStartDate}
            - The schedule timeline explicitly ends on: ${formattedEndDate}

            Generate complete event rows for this timeline window. Return ONLY a valid JSON array of objects. Each object maps perfectly to the database model schema details below:
            - title (string): High contrast title descriptive of the task block. MUST be exactly one of the provided subject names from the Performance statistics. Do not modify, shorten, expand, rephrase, or add any words to the subject name. Do not include topics, activities, chapters, assignments, lab names, or descriptions in the title.
            - color (string): Provide a vibrant hex aesthetic palette choice matching your design language. Use only these values: '#FFA94D', '#FEE172', '#FFB6C1', or '#cdf5e9'
            - start_date (string): String date block formatted as YYYY-MM-DD
            - end_date (string): String terminal boundary limit sequence formatted as YYYY-MM-DD (set this to ${formattedEndDate} for recurring elements)
            - start_time (string): The clock window limit hour formatted cleanly as HH:MM:SS (e.g. "09:00:00", "14:30:00")
            - end_time (string): The completion block formatted cleanly as HH:MM:SS (e.g. "11:00:00", "16:00:00")
            - recurring (array of strings): Shorthand text items matching day blocks the event populates on each week. E.g. ["Mon", "Wed"]. If it's a single entry, keep it empty []

            Output purely the plain structural array JSON payload. Do not use markdown tags or backticks (\`\`\`json).
            `;


        const response = await ai.models.generateContent({
            model:"gemini-3.5-flash",
            contents:[{role: "user", parts:[{text:prompt}]}],
        });

        //parese generated JSON response
        const responseText = response.text || response.candidate?.[0]?.content?.parts?.[0]?.text;
        const cleanJsonText = responseText.replace(/```json/g, '').replace(/```/g, ''). trim();
        const eventsArray = JSON.parse(cleanJsonText);
        const eventsWithUser = eventsArray.map(event => ({
            ...event,
            user_id: user.id
        }));

        //insert into Supabase
        if(Array.isArray(eventsWithUser)){
            const {error:insertError} = await supabase
            .from('schedule_events')
            .insert(eventsWithUser);

            if(!insertError){
                navigation.navigate('Schedule');
            } 
        }

    } catch (error){
        console.log("Error:" + error);
    } finally {
        setIsGenerating(false);
    }
    }

    //validate all fields in the form
    const validateFields = () =>{
        const subjectErr = validateSubject(subject, dictionary);
        const timeErr = validateTimes(startTime, endTime, dictionary);
        const startDateErr = validateDate(startDate, dictionary);
        const endDateErr = validateDate(endDate, dictionary);
        const colorErr = validateColor(color, dictionary);

        //submit to Supabase if no errors
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

        //format dates before saving to Supabase
        const formattedStartDate = startDate.toLocaleDateString('en-CA', {
        timeZone: 'Asia/Kuala_Lumpur'
        })
        const formattedEndDate = endDate.toLocaleDateString('en-CA', {
        timeZone: 'Asia/Kuala_Lumpur'
        })

        //update existing schedule event
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
            //create new schedule event
            const {data, error} = await supabase
            .from('schedule_events')
            .insert({
                    user_id: user.id,
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
            }}
        //retrieve all users' subjects 
        const fetchSubjects = async() =>{
            const user = (await supabase.auth.getUser()).data.user;
    
            if(!user) return;
    
    
            const {data, error} = await supabase
            .from('subjects')
            .select('id, name')
            .eq('user_id', user?.id)
    
            if(error){
                return []
            }

            return data;
        }
        
        //retrieve all users' study logs
        const fetchLogs = async() =>{
            const user = (await supabase.auth.getUser()).data.user;
    
            if(!user) return;
    
            const twoMonthsAgo = new Date();
            twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2)

    
            const {data, error} = await supabase
            .from('study_logs')
            .select('id, subject, duration, confidence')
            .eq('user_id', user?.id)
            .gte("created_at", twoMonthsAgo.toISOString());
    
            if(error){
                return [];
            }

            return data;
    
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
                                <View style={{flex:0, flexDirection:'row', justifyContent:'space-between'}}>
                                    <Text style={styles.title}>
                                        {dictionary.add_schedule}
                                    </Text>
                                    <Pressable onPress={()=> setIsAiMode(!isAiMode)}
                                    style={{ width:'30%', borderWidth:2, borderColor:'black', marginHorizontal:8, padding:8, backgroundColor: isAiMode ? '#FEE172' : '#cdf5e9'}}>
                                        <Text style={{textAlign:'center'}}>{isAiMode ? 'Manual' : 'AI Mode'}</Text>
                                    </Pressable>
                                </View>
                            </View>

                        </View>
                            <ScrollView style={{height:'70%'}}>
                                <SafeAreaView style={{paddingHorizontal: 15}}>
                                {!isAiMode? (
                                        <View style={styles.fields}>
                                            <Text style={styles.fieldLabels}>{dictionary.subject}:</Text>
                                            <TextInput style={styles.input} placeholder={dictionary.subject_placeholder} value={subject} onChangeText={setSubject} placeholderTextColor='#555555'></TextInput>
                                            {subjectError ? (<Text style={styles.errorText}>{subjectError}</Text>) : null}
                                        </View>):null}
                                        {isAiMode? (<Text>{dictionary.generation_explanation}</Text>):null}
                                        <View style={styles.fields}>
                                        <Text style={styles.fieldLabels}>{dictionary.start_date}:</Text>
                                        <Pressable style={{backgroundColor:'transparent'}} onPress={()=> setShowStartDate(true)} ><View style={[styles.input, {flex:0, justifyContent:'center', paddingHorizontal:'3%'}]}>
                                            <Text>{startDate.getDate()}/{startDate.getMonth()+1}/{startDate.getFullYear()}</Text></View></Pressable>
                                        {showStartDate && (
                                        <DateTimePicker
                                        value={startDate}
                                        mode="date"
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
                                {!isAiMode? (   
                                    <View style={styles.fields}>
                                        <Text style={styles.fieldLabels}>{dictionary.start_time}:</Text>
                                        <Pressable style={{backgroundColor:'transparent'}} onPress={()=> setShowStartTime(true)} ><View style={[styles.input, {flex:0, justifyContent:'center', paddingHorizontal:'3%'}]}>
                                        <Text>
                                                {`${startTime.getHours() % 12 || 12}:${String(startTime.getMinutes()).padStart(2, '0')} ${startTime.getHours() >= 12 ? 'PM' : 'AM'}`}
                                            </Text>
                                            </View>
                                        </Pressable>
                                        {showStartTime && (
                                        <DateTimePicker
                                        value={startTime}
                                        mode="time"
                                        is24Hour={true}
                                        onChange={(event, selectedDate) => { if (!selectedDate) {
                                            setStartTime(selectedDate)
                                            setShowStartTime(false);
                                            return;
                                        }
                                        if(Platform.OS == 'android'){
                                            const newDate = new Date(startTime);

                                            newDate.setHours(selectedDate.getHours());
                                            newDate.setMinutes(selectedDate.getMinutes());

                                            setStartTime(newDate);
                                            setShowStartTime(false);
                                 
                                        
                                            }else if (Platform.OS == 'ios'){
                                                if (selectedDate){
                                                    setStartTime(selectedDate);
                                                }
                                             
                                            }}} 
                                    />

                                    

                                    )}
                                    {timeError ? (<Text style={styles.errorText}>{timeError}</Text>) : null}
                                    </View>
                                ): null}
                                    {isAiMode? (
                                        <View>
                                            <View><View style={styles.fields}>
                                            <Text style={styles.fieldLabels}>{dictionary.end_date}:</Text>
                                            <Pressable style={{backgroundColor:'transparent'}} onPress={()=> setShowEndDate(true)} >
                                                <View style={[styles.input, {flex:0, justifyContent:'center', paddingHorizontal:'3%'}]}>
                                                    <Text>{endDate.getDate()}/{endDate.getMonth() + 1}/{endDate.getFullYear()}</Text></View></Pressable>
                                            {showEndDate && (
                                            <DateTimePicker
                                            value={endDate}
                                            mode="date"
                                            is24Hour={true}
                                            onChange={(event, selectedDate) => { if (!selectedDate) {
                                                setShowEndDate(false);
                                                return;
                                            }
                                            if(Platform.OS == 'android'){
                                                    const newEndDate = new Date(endDate);

                                                    newEndDate.setFullYear(
                                                    selectedDate.getFullYear(),
                                                    selectedDate.getMonth(),
                                                    selectedDate.getDate()
                                                    );

                                                    setEndDate(newEndDate);
                                                    setShowEndDate(false)

                        
                                                
                                                }else if (Platform.OS == 'ios'){
                                                    if(selectedDate){
                                                        setEndDate(selectedDate);
                                                    }
                                                  
                                                }}} 
                                        />

                                        )}
                                        {endDateError ? (<Text style={styles.errorText}>{endDateError}</Text>) : null}
                                        </View>
                                    
                                        </View>
                                        
                                            <View style={styles.fields}>
                                                <Text style={styles.fieldLabels}>{dictionary.ai_prompt}</Text>
                                                <TextInput style={styles.input} value={aiPromptInput} onChangeText={setAiPromptInput} placeholder={dictionary.ai_prompt_placeholder} placeholderTextColor='#555555'></TextInput>
                                            </View>
                                            <Pressable style={({pressed}) => [styles.trueCenter, styles.buttons, {opacity: pressed || isGenerating ? 0.5 : 1, backgroundColor:'black', marginTop: 15}]}
                                                onPress={handleAIGenerate}
                                                disabled={isGenerating}>
                                                <View style={{flexDirection:'row', alignItems:'center'}}>
                                                    {isGenerating ? (
                                                        <ActivityIndicator color="white" style={{marginRight:10}}/>
                                                        
                                                    ): null}
                                                    <Text style={[styles.buttonTexts, {color:'white'}]}>
                                                        {isGenerating? `${dictionary.generating}...` : dictionary.add}
                                                    </Text>


                                                </View>

                                            </Pressable>
                                        </View>
                                    ):
                                    (
                                    <View>
                                    <View style={styles.fields}>
                                        <Text style={styles.fieldLabels}>{dictionary.end_time}:</Text>
                                        <Pressable style={{backgroundColor:'transparent'}} onPress={()=> setShowEndTime(true)} ><View style={[styles.input, {flex:0, justifyContent:'center', paddingHorizontal:'3%'}]}>
                                            <Text>
                                                {`${endTime.getHours() % 12 || 12}:${String(endTime.getMinutes()).padStart(2, '0')} ${endTime.getHours() >= 12 ? 'PM' : 'AM'}`}
                                            </Text></View></Pressable>
                                        {showEndTime && (
                                        <DateTimePicker
                                        value={endTime}
                                        mode="time"
                                        is24Hour={true}
                                        onChange={(event, selectedDate) => { if (!selectedDate) {
                                            setEndTime(selectedDate)
                                            setShowEndTime(false);
                                            return;
                                        }
                                        if(Platform.OS == 'android'){
                                                const newEndTime = new Date(endTime);

                                                newEndTime.setHours(selectedDate.getHours());
                                                newEndTime.setMinutes(selectedDate.getMinutes());

                                                setEndTime(newEndTime);
                                                setShowEndTime(false);

                                            
                                            }else if (Platform.OS == 'ios'){
                                                if (selectedDate){
                                                    setEndTime(selectedDate);
                                                }
                                        
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
                                        mode="date"
                                        is24Hour={true}
                                        onChange={(event, selectedDate) => { if (!selectedDate) {
                                            setShowEndDate(false);
                                            return;
                                        }
                                        if(Platform.OS == 'android'){
                                     
                                            const newEndDate = new Date(endDate);

                                            newEndDate.setFullYear(
                                            selectedDate.getFullYear(),
                                            selectedDate.getMonth(),
                                            selectedDate.getDate()
                                            );

                                            setEndDate(newEndDate);
                                            setShowEndDate(false);
                                                           
                                            }else if (Platform.OS == 'ios'){
                                                if(selectedDate){
                                                    setEndDate(selectedDate);
                                                }
                                               
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
                                    </View>
                                    )}
                                </SafeAreaView>
                            </ScrollView>
                        </View>
                    </View>
                </LinearGradient>
        </View>

    );
}
