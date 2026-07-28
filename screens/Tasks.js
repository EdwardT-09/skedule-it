import React, {useState, useEffect} from 'react';
import { View, Text, Pressable, StyleSheet, ImageBackground, Image, ScrollView, ActivityIndicator} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Modal from 'react-native-modal'
import {supabase} from '../config/initSupabase.js';
import { priorityColors } from '../util/taskHelpers.js';
import useDictionary from '../hook/useDictionary.js';
import Header from '../components/Header.js';
import Nav from '../components/Nav.js';
import styles from '../assets/style.js';
import useTask from '../hook/useTask.js';
import { isNotLoggedIn } from '../util/common.js';
import Checkbox from 'expo-checkbox';

export default function Tasks ({navigation}){
    const [selectedTask, setSelectedTask] = useState();
console.log("Today Tasks:", todayTasks);
console.log("Upcoming Tasks:", upcomingTasks);
    const {
        todayTasks,
        upcomingTasks,
        menuVisible,
        setMenuVisible,
        refreshTasks,
        deleteTask,
        toggleTaskCompletion,
    } = useTask();
    
    const {dictionary, loading} = useDictionary();

    const today = new Date().toLocaleDateString('en-CA', 
        {
            timeZone:'Asia/Kuala_Lumpur',
        }
    )

    //if user not logged in, then navigate to landing page
    useEffect(()=>{
            isNotLoggedIn(navigation)
        },[])



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
            <View style={{flex:0, alignItems:'center'}}>
            <View style={[styles.container]}>
                <View style={[styles.titleContainer,]}>
                    <View style={{paddingHorizontal: '5%'}}>
                        <Text style={styles.subtitle}>{dictionary.lets_go}</Text>
                        <View style={{flex:0, flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                            <Text style={styles.title}>
                                {dictionary.tasks}
                            </Text>
                            <Pressable onPress = {() => navigation.navigate('AddTask')} style={({pressed})=>[styles.borderButton,{opacity: pressed? 0.5: 1, borderRadius:25}]}>
                                <Image source={require('../assets/Plus.png')} style={{width:20, height:20}}></Image></Pressable>
                        </View>
                    </View>
                </View>
                    <ScrollView style={{height:'60%'}}>
                        <Text style={styles.timeLabel}>{dictionary.today}</Text>
                        {todayTasks.length === 0 && (
                            <View style={styles.nilContainer}>
                                <Text style={styles.nilError}>{dictionary.no_task}</Text>
                            </View>)}
                        {todayTasks.map((task)=> {    
                            const isDone = task.completed_on === today;
                            const isDueToday = task.has_deadline && task.end_date === today;
                            return (
                            <Pressable key={task.id} onPress={()=> toggleTaskCompletion(task)}>
                                <View style={[styles.listItems,  { marginLeft: task.level == 0 ? null : task.level * 20 }]} key={task.id}>
                                    <View style={{flex:0, flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                                        <View style={{width:'80%', flexDirection:'row', alignItems:'center'}}>
                                            <Checkbox
                                                value={isDone}
                                                onValueChange={() => toggleTaskCompletion(task)}
                                                color={isDone ? '#4CAF50' : undefined}
                                                style={{marginRight: '5%'}}
                                            />
                                        <View style={{flex:0, flexDirection:'column'}}>
                                            <Text style={[styles.taskTitle,  isDueToday && {color:'red'}, isDone && {
                                                            textDecorationLine:'line-through', color: 'gray'
                                                        }, ]}>{task.title}</Text>
                                            <Text style={[styles.taskInfo, ]}>{task.start_date} {task.recurring?.length > 0 ? '(' + dictionary.recurring + ')'  : ''} </Text>
                                        </View>
                                        </View>
                                        <View style={{flex:0, flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                                            <Text style={{borderColor:priorityColors[task.priority], borderWidth:1, padding:'1%', color:priorityColors[task.priority]}}>{task.priority}</Text>
                                            {/* get the position of the menu */}
                                            <Pressable onPress={()=> {
                                                //get the id to be used during editing or adding new subtasks 
                                                setSelectedTask(task);
                                                //allow menu to be closed
                                                //does not use !menuVisible as the menu will be inaccessible when the popup appears
                                                setMenuVisible(!menuVisible);
                                            }}><Image source={require('../assets/Menu.png')} style={{height:24, width:24, marginLeft:'2%'}}></Image></Pressable>
                                        </View>
                                    </View>
                                </View>
                            </Pressable>
                            )})}  
                        <Text style={styles.timeLabel}>{dictionary.upcoming}</Text>      
                        {upcomingTasks.length === 0 && (
                            <View style={styles.nilContainer}>
                                <Text style={styles.nilError}>{dictionary.no_upcoming_tasks}</Text>
                            </View>)}
                        {upcomingTasks.map((task)=>(<View style={styles.taskItem} key={task.id}>
                            <View style={{flex:0, flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                                <View style={{width:'70%'}}>
                                    <Text style={[styles.taskTitle, {marginLeft:task.level * 15}]}>{task.title}</Text>
                                    <Text style={styles.taskInfo}>{task.start_date}</Text>
                                </View>
                            <View style={{flex:0, flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                                <Text style={{borderColor:priorityColors[task.priority], borderWidth:1, padding:'1%', color:priorityColors[task.priority]}}>{task.priority}</Text>
                            {/* get the position of the menu */}
                                <Pressable onPress={()=> {
                                    //get the id to be used during editing or adding new subtasks 
                                    setSelectedTask(task);
                                    //allow menu to be closed
                                    //does not use !menuVisible as the menu will be inaccessible when the popup appears
                                    setMenuVisible(!menuVisible);
                                }}><Image source={require('../assets/Menu.png')} style={{height:24, width:24, marginLeft:'2%'}}></Image></Pressable></View></View>
                            </View>
                        ))}
                    </ScrollView>

            </View>
        </View>
        <Nav></Nav>
        <Modal style={{justifyContent: 'flex-end', margin:0}} transparent={true} isVisible={menuVisible} swipeDirection="down" onSwipeComplete={()=> setMenuVisible(false)} onBackdropPress={()=> setMenuVisible(false)} propagateSwipe={true}>
            <View style={[styles.modalMenuContainer]}>
                <Pressable onPress={()=>{setMenuVisible(false)}}>
                    <Image source={require('../assets/close.png')} style={{ flex:0, justifyContent:'center', alignSelf:'flex-end'}}></Image>
                </Pressable>
                <View>
                    <Pressable onPress = {()=> {navigation.navigate('AddTask', {taskID:selectedTask.id, method:'Edit'}), setMenuVisible(false)}} style={({pressed})=> ([styles.modalMenuItem,{ backgroundColor: pressed ? 'rgb(235, 235, 235)': null}])}>
                        <Image source={require('../assets/Edit.png')} style={styles.modalMenuImage}></Image>
                        <Text style={styles.modalMenuLabels}>{dictionary.edit}</Text>
                    </Pressable>
                    {selectedTask?.level < 2 && (
                    <Pressable onPress = {()=> {navigation.navigate('AddTask', {taskID:selectedTask.id, method:'Add Subtask'}), setMenuVisible(false)}} style={({pressed})=> ([styles.modalMenuItem,{ backgroundColor: pressed ? 'rgb(235, 235, 235)': null}])}>
                        <Image source={require('../assets/Plus.png')} style={[styles.modalMenuImage, {width:36, height:36}]}></Image>
                        <Text style={styles.modalMenuLabels}>{dictionary.add_new_subtask}</Text>
                    </Pressable>
                    )}
                    <Pressable onPress= {()=> {deleteTask(selectedTask.id), setMenuVisible(false)}} style={({pressed})=> ([styles.modalMenuItem,{ backgroundColor: pressed ? 'rgb(235, 235, 235)': null}])}>
                        <Image source={require('../assets/Trash.png')} style={styles.modalMenuImage}></Image>
                        <Text style={[styles.modalMenuLabels, {color:'#c14343'}]}>{dictionary.delete}</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>

        </LinearGradient>
    </View>
        

    );
}
