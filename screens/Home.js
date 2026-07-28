import React, {useState, useEffect} from 'react';
import {View, Text, ImageBackground,Image, ScrollView, Pressable, ActivityIndicator} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {supabase} from '../config/initSupabase.js';
import Modal from 'react-native-modal';
import Header from '../components/Header.js';
import useDictionary from '../hook/useDictionary.js';
import Navigation from '../components/Nav.js';
import { getDurationBySubject, getAvgConfidenceBySubject, getSessionCountBySubject } from '../util/performanceStats.js';
import styles from '../assets/style.js';
import { priorityColors } from '../util/taskHelpers.js';
import useTask from '../hook/useTask.js';
import { PieChart, BarChart } from "react-native-gifted-charts";
import { isNotLoggedIn } from '../util/common.js';
import Checkbox from 'expo-checkbox';


export default function Home({navigation}){
    const colors = ["#CDF5E9", "#9FD8C3", "#D8B84C", "#7FA8C9", "#C98FA5", "#404040"];

    const [username, setUsername] = useState();
    const [selectedTask, setSelectedTask] = useState();
    const [subjects, setSubjects] = useState([]);
    const [logs, setLogs] = useState([]);
    const [durationChart, setDurationChart] = useState([]);
    const [sessionChart, setSessionChart] = useState([]);
    const [avgConfChart, setAvgConfChart] = useState([]);
    const [chartReady, setChartReady] = useState(false);
    const [dueTodayTasks, setDueTodayTasks] = useState([]);
    const [deadlineModalVisible, setDeadlineModalVisible] = useState(false);

    const {dictionary, loading} = useDictionary();
    const today = new Date().toLocaleDateString('en-CA', {
        timeZone: 'Asia/Kuala_Lumpur'
    });



                                        
    useEffect(()=>{
        fetchUser();
        fetchSubjects();
        fetchLogs();
        isNotLoggedIn(navigation);
    },[])

    useEffect(()=>{
        if(!subjects.length || !logs.length ) return;

        const durationStats = getDurationBySubject(subjects, logs);
        const sessionStats = getSessionCountBySubject(subjects, logs);
        const averageConfStats = getAvgConfidenceBySubject(subjects,logs);

        const newDurationChart = Object.values(durationStats).map((item, index)=>({
            value:item.totalDuration,
            color: colors[index % colors.length],
            text:`${item.subject_code} - ${item.totalDuration}`,
        }))
        
        const newSessionChart=Object.values(sessionStats).map((item, index)=> ({
            value: item.sessions,
            color: colors[index % colors.length],
            label: item.subject_code,
        }))

        const newAvgConfChart = Object.values(averageConfStats).map((item, index)=> ({
            value: item.avgConfidence,
            color: colors[index % colors.length],
            text:`${item.subject_code} - ${item.avgConfidence}`,
        }))

        setDurationChart(newDurationChart);
        setSessionChart(newSessionChart);
        setAvgConfChart(newAvgConfChart);

        setChartReady(
            newDurationChart.length > 0 && newSessionChart.length > 0 && newAvgConfChart.length > 0
        )


    }, [subjects, logs])

    const {
        todayTasks,
        menuVisible,
        setMenuVisible,
        refreshTasks,
        deleteTask,
        toggleTaskCompletion,
    } = useTask();

    useEffect(() =>{
    const todayStr = new Date().toLocaleDateString('en-CA', {
        timeZone: 'Asia/Kuala_Lumpur',
    });

    const filtered = todayTasks.filter(task =>
        task.has_deadline && 
        task.end_date === todayStr &&
        task.completed_on !== todayStr
    )
        setDueTodayTasks(filtered);
    }, [todayTasks])

    useEffect(()=>{
        setDeadlineModalVisible(dueTodayTasks.length > 0);
    }, [dueTodayTasks])

    async function fetchUser(){

        const {
            data: {user}
        } = await supabase.auth.getUser();

        if(!user) return;

        const {data, error} = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();
        
        if(data){
            setUsername(data.username);
        }


    }

    const fetchSubjects = async() =>{
        const user = (await supabase.auth.getUser()).data.user;

        if(!user) return;


        const {data, error} = await supabase
        .from('subjects')
        .select('id, name, subject_code')
        .eq('user_id', user?.id)

        if(!error){
            setSubjects(data);
        }
    }

    const fetchLogs = async() =>{
        const user = (await supabase.auth.getUser()).data.user;

        if(!user) return;

        const twoMonthsAgo = new Date();
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2)

        const {data, error} = await supabase
        .from('performance_log')
        .select('id, subject, duration, confidence')
        .eq('user_id', user?.id)
        .gte("created_at", twoMonthsAgo.toISOString());

        if(!error){
            setLogs(data);

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
                <Header></Header>
                <View style={styles.center}>
                    <Text style={styles.welcomeText}>
                        {dictionary.welcome}, {username || 'STUDENT'}
                    </Text>
                    <View style={[styles.container, {marginTop:'10%'}]}>
                        <ScrollView style={{height:'80%'}}>
                            <View style={[styles.titleContainer,]}>
                                <View style={{paddingLeft: '5%'}}>
                                    <Text style={styles.subtitle}>{dictionary.lets_go}</Text>
                                        <Text style={styles.title}>
                                            {dictionary.tasks_for_the_day}
                                        </Text>
                                </View>
                            </View>
                            <ScrollView style={{height:"55%",}}>
                                {todayTasks.length === 0 && (
                                    <View style={styles.nilContainer}>
                                        <Text style={styles.nilError}>{dictionary.no_task}</Text>
                                        </View>)}
                                {todayTasks.map((task) => {
                                        
                                    const isDone = task.completed_on === today;
                                    const isDueToday = task.has_deadline && task.end_date === today;

                                return (
                                    <Pressable key={task.id} onPress={()=> toggleTaskCompletion(task)}>
                                    <View  style={[styles.listItems,  { marginLeft: task.level == 0 ? null : task.level * 20, }]}>
                                        <View style={{flex:0, flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                                          <View style={{flex:0, flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                                            <View style={{width:'80%', flexDirection:'row', alignItems:'center'}}>
                                                <Checkbox
                                                    value={isDone}
                                                    onValueChange={() => toggleTaskCompletion(task)}
                                                    color={isDone ? '#4CAF50' : undefined}
                                                    style={{marginRight: '5%'}}
                                                />
                                                <View>
                                                    <Text style={[styles.taskTitle, isDueToday && {color:'red'}, isDone && {
                                                        textDecorationLine:'line-through', color: 'gray'
                                                    }]}>{task.title}</Text>
                                                    <Text style={[styles.taskInfo,]}>{task.start_date} {task.recurring?.length > 0 ? '(' + dictionary.recurring + ')' : null}</Text>
                                                </View>
                                            </View>
                                            </View>
                                            <View style={{flex:0, flexDirection:'row', alignItems:'center'}}>
                                                <Text style={{borderColor: priorityColors[task.priority], borderWidth:1, padding:'1%', color:priorityColors[task.priority]}}>{task.priority}</Text>
                                                
                                                <Pressable onPress={() => {
                                                    setMenuVisible(!menuVisible);

                                                    setSelectedTask(task);
                                                }}>
                                                    <Image source={require('../assets/Menu.png')} style={[{height:24, width:24, marginLeft:'2%'}]}></Image>
                                                </Pressable>
                                                
                                            </View>
                                        </View>
                                    </View>
                                </Pressable>)
                                })}
                                </ScrollView>
                                    <View style={[styles.titleContainer,]}>
                                        <View style={{paddingHorizontal: '5%'}}>
                                            <Text style={styles.subtitle}>{dictionary.lets_go}</Text>
                                            <View style={{flex: 0, flexDirection:'row', justifyContent:'space-between'}}>
                                                <Text style={styles.title}>
                                                    {dictionary.stats}
                                                </Text>
                                                <Pressable onPress={()=>{navigation.navigate('Performance')}} >
                                                    <Image source={require('../assets/Plus.png')}/>
                                                </Pressable>
                                            </View>
                                        </View>
                                    </View>
                                    {!chartReady? (
                                        <View style={styles.nilContainer}>
                                            <Text style={styles.nilError}>{dictionary.empty_chart_message}</Text>
                                        </View>) : null}
                                    {chartReady ? (
                                    <View>
                                        <View style={styles.chart}>
                                            <Text style={styles.chartTitle}>{dictionary.task_duration}</Text>
                                            <View style={{flex:0, justifyContent:'center', alignItems:'center'}}>
                                                <PieChart data={durationChart} showText textColor="black" textSize={10}  strokeColor="#565656" strokeWidth={1}/>
                                            </View>
                                        </View>

                                        <View style={styles.chart}>
                                            <Text style={styles.chartTitle}>{dictionary.session_count_per_subject}</Text>
                                                <View style={{alignSelf:'center',}} >
                                                    <BarChart data={sessionChart} rotateLabel spacing={30} />
                                                </View>
                                        </View>
                                                
                                        <View style={styles.chart}>
                                            <Text style={styles.chartTitle}>{dictionary.average_confidence_per_subject}</Text>
                                                <View style={{flex:0, justifyContent:'center', alignItems:'center'}}>
                                                    <PieChart data={avgConfChart} showText textColor="black" textSize={10} strokeColor="#565656" strokeWidth={1}/>
                                                </View>                                
                                        </View>
                                        </View>): null}
                        </ScrollView>
                    </View>
                <Pressable onPress={()=> navigation.navigate('AddTask')} style={[styles.addTaskButton, {backgroundColor:'#d9b274'}]} >
                    <Image source={require('../assets/Plus.png')}></Image>
                </Pressable>
                </View>
                <Navigation></Navigation>
                <Modal style={{justifyContent: 'flex-end', margin:0}} transparent={true} isVisible={menuVisible} swipeDirection="down" onSwipeComplete={()=> setMenuVisible(false)} onBackdropPress={()=> setMenuVisible(false)} propagateSwipe={true}>
                    <View style={[styles.modalMenuContainer]}>
                        <Pressable onPress={()=>{setMenuVisible(false)}}>
                            <Image source={require('../assets/close.png')} style={{ flex:0, justifyContent:'center', alignSelf:'flex-end'}}></Image>
                        </Pressable>
                        <View>
                            <Pressable onPress = {()=> {navigation.navigate('AddTask', {taskID:selectedTask.id, method:'Edit'}), setMenuVisible(false)}} style={({pressed})=> ([styles.modalMenuItem,{ backgroundColor: pressed ? 'rgb(235, 235, 235)': null}])}>
                                <Image source={require('../assets/Edit.png')} style={styles.modalMenuImage}></Image>
                                <Text style={styles.taskMenuLabels}>{dictionary.edit}</Text>
                            </Pressable>
                            {selectedTask?.level < 2 && (
                            <Pressable onPress = {()=> {navigation.navigate('AddTask', {taskID:selectedTask.id, method:'Add Subtask'}), setMenuVisible(false)}} style={({pressed})=> ([styles.modalMenuItem,{ backgroundColor: pressed ? 'rgb(235, 235, 235)': null}])}>
                                <Image source={require('../assets/Plus.png')} style={[styles.modalMenuImage, {width:36, height:36}]}></Image>
                                <Text style={styles.taskMenuLabels}>{dictionary.add_new_subtask}</Text>
                            </Pressable>
                            )}
                            <Pressable onPress= {()=> {deleteTask(selectedTask.id); setMenuVisible(false)}} style={({pressed})=> ([styles.modalMenuItem,{ backgroundColor: pressed ? 'rgb(235, 235, 235)': null}])}>
                                <Image source={require('../assets/Trash.png')} style={styles.modalMenuImage}></Image>
                                <Text style={[styles.taskMenuLabels, {color:'#c14343'}]}>{dictionary.delete}</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
                <Modal style={{justifyContent: 'flex-end', margin:0,}} transparent={true} isVisible={deadlineModalVisible} swipeDirection="down" onSwipeComplete={()=> setDeadlineModalVisible(false)} onBackdropPress={()=> setDeadlineModalVisible(false)} propagateSwipe={true}>
                    <View style={[styles.modalMenuContainer, {padding:25}]}>
                        <View style={{flex:0, flexDirection:'row', justifyContent:'space-between'}}>
                            <Text style={styles.dueTodayText}>Due Today</Text>
                            <Pressable onPress={()=> setDeadlineModalVisible(false)}>
                                <Image source={require('../assets/close.png')}/>
                            </Pressable>
                        </View>
                        {dueTodayTasks.map(task =>(
                            <View key={task.id} style={{marginBottom:10}}>
                                    <Text>{task.title}</Text>
                                <Text style={{ color: 'gray' }}>{task.end_date}</Text> 
                            </View>
                            
                        ))}

                    </View>
                </Modal>
            </LinearGradient>
        </View>
            )
}