import React, {useState, useEffect} from 'react';
import {View, Text, ImageBackground,Image, ScrollView, Pressable} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {supabase} from '../config/initSupabase.js';
import Modal from 'react-native-modal';
import Header from '../components/Header.js';
import useDictionary from '../hook/useDictionary.js';
import Navigation from '../components/Nav.js';
import styles from '../assets/style.js';
import { priorityColors } from '../util/taskHelpers.js';
import useTask from '../hook/useTask.js';

export default function Home({navigation}){
    const [username, setUsername] = useState();
    const [selectedTask, setSelectedTask] = useState();

    const dictionary = useDictionary();

    useEffect(()=>{
        fetchUser();
    },[])

    const {
        todayTasks,
        menuVisible,
        setMenuVisible,
        refreshTasks,
        deleteTask,
    } = useTask();


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

        if(error){
            console.log(error);
        }
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
                        <View style={[styles.titleContainer,]}>
                            <View style={{paddingLeft: '5%'}}>
                                <Text style={styles.subtitle}>{dictionary.lets_go}</Text>
                                    <Text style={styles.title}>
                                        {dictionary.tasks_for_the_day}
                                    </Text>
                            </View>
                        </View>
                        <ScrollView style={{height:"55%",}}>
                            {todayTasks.map((task) => (
                                <View key={task.id} style={styles.listItems}>
                                    <View style={{flex:0, flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                                        <View>
                                            <Text style={styles.taskTitle}>{task.title}</Text>
                                            <Text style={styles.taskInfo}>{task.date} {task.recurring?.length > 0 ? '(' + dictionary.recurring + ')' : null}</Text>
                                        </View>
                                        <View style={{flex:0, flexDirection:'row', alignItems:'center'}}>
                                            <Text style={{borderColor: priorityColors[task.priority], borderWidth:1, padding:'1%', color:priorityColors[task.priority]}}>{task.priority}</Text>
                                            
                                            <Pressable onPress={() => {
                                                setMenuVisible(!menuVisible);

                                                setSelectedTask(task.id);
                                            }}>
                                                <Image source={require('../assets/Menu.png')} style={[{height:24, width:24, marginLeft:'2%'}]}></Image>
                                            </Pressable>
                                            
                                        </View>
                                    </View>
                                </View>
                            ))

                            }
                            
                        </ScrollView>
                    </View>
                <Pressable onPress={()=> navigation.navigate('AddTask')} style={styles.addTaskButton}>
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
                            <Pressable onPress = {()=> navigation.navigate('AddTask', {taskID:selectedTask, method:'Edit'})} style={({pressed})=> ([styles.modalMenuItem,{ backgroundColor: pressed ? 'rgb(235, 235, 235)': null}])}>
                                <Image source={require('../assets/Edit.png')} style={styles.modalMenuImage}></Image>
                                <Text style={styles.taskMenuLabels}>{dictionary.edit}</Text>
                            </Pressable>
                            <Pressable onPress = {()=> navigation.navigate('AddTask', {taskID:selectedTask, method:'Add Subtask'})} style={({pressed})=> ([styles.modalMenuItem,{ backgroundColor: pressed ? 'rgb(235, 235, 235)': null}])}>
                                <Image source={require('../assets/Plus.png')} style={[styles.modalMenuImage, {width:36, height:36}]}></Image>
                                <Text style={styles.taskMenuLabels}>{dictionary.add_new_subtask}</Text>
                            </Pressable>
                            <Pressable onPress= {()=> deleteTask(selectedTask)} style={({pressed})=> ([styles.modalMenuItem,{ backgroundColor: pressed ? 'rgb(235, 235, 235)': null}])}>
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