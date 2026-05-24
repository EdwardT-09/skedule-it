import React, {useState, useEffect} from 'react';
import { View, Text, Pressable, StyleSheet, ImageBackground, Image, ScrollView} from 'react-native';
import Modal from 'react-native-modal'
import {supabase} from '../config/initSupabase.js';
import Header from '../components/Header.js';
import Nav from '../components/Nav.js';
import styles from '../assets/style.js';

export default function Tasks ({navigation}){
    const [todayTasks, setTodayTasks] = useState([]);
    const [upcomingTasks, setUpcomingTasks] = useState([]);
    const [menuPos, setMenuPos] = useState({x:0, y:0});
    const [selectedTask, setSelectedTask] = useState();
    const [menuVisible, setMenuVisible] = useState(false);

    //assign a ranking system to determine the priority order
    const priorities = ['Q1', 'Q2', 'Q3', 'Q4'];
    //using key value map to assign colors to each priority level
    const priorityColors = {Q1: '#c14343', Q2 : '#e3922f', Q3 : '#efd868', Q4:'#46b6af'};

    const menuRef = React.useRef(null);
    const currentDate = new Date();
   const pad = (n) => String(n).padStart(2, '0');

    const currentDateStr = `${currentDate.getFullYear()}-${pad(currentDate.getMonth()+1)}-${pad(currentDate.getDate())}`;
    const weekDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const todayName = weekDay[currentDate.getDay()];

    useEffect(()=>{getTasks()}, [])

    const deleteTask = async(selectedTask) =>{
        const user = (await supabase.auth.getUser()).data.user;

        if(!user) return;

        const {error} = await supabase
        .from('tasks')
        .delete()
        .eq('id', selectedTask)

        if(error){
            console.log(error);
        } else{ 
            getTasks();
            setMenuVisible(false);
        }
    }

    const organizeTasks = (tasks) =>{
        //store main tasks in parent var
        const parents = tasks.filter(task => !task.parent_key);

        //sort parents by priority
        parents.sort(
                (a,b) =>
                    //when it is negative, a will come first
                    //when it is positive, b will come first
                    //if its equal, it will keep the same order
                    priorities.indexOf(a.priority) - priorities.indexOf(b.priority)
        )

        //add the subtasks
        const organized = []

        parents.forEach(parent => {
            // add the parent into the organized array
            organized.push(parent);

            //get the subtask 
            const subtasks = tasks.filter(task => task.parent_key === parent.id);

            subtasks.sort(
                (a,b) => 
                    //when it is negative, a will come first
                    //when it is positive, b will come first
                    //if its equal, it will keep the same order
                    priorities.indexOf(a.priority) - priorities.indexOf(b.priority)  
            );
            organized.push(...subtasks);
            subtasks.forEach(subtask =>{
                //get the sub-subtask 
                const childSubtasks = tasks.filter(task => task.parent_key === subtask.id);
                childSubtasks.sort((a,b) => 
                    //when it is negative, a will come first
                    //when it is positive, b will come first
                    //if its equal, it will keep the same order
                    priorities.indexOf(a.priority) - priorities.indexOf(b.priority)  
                );
            organized.push(...childSubtasks);
            })
          
        })
        return organized;
    } 

    const isTodayTask = (task) =>{
        const oneTimeTask = task.date === currentDateStr;

        const recurringTask = task.recurring?.includes(todayName) && Array.isArray(task.recurring);

        return oneTimeTask || recurringTask
    }

    const includeParents = (tasks) => {
        const taskMap = new Map(tasks.map(t=> [t.id, t]));

        //using set to avoid duplicated results
        const set = new Set(tasks);

        tasks.forEach(task => {
            let parentId = task.parent_key;

            while(parentId){
                const parent = taskMap.get(parentId);
                if(!parent) break;

                set.add(parent);
                parentId = parent.parent_key;
            }
        })
        return Array.from(set);
    }

    const getTasks = async() => {
        const user = (await supabase.auth.getUser()).data.user;

        if(!user) return;

        //get data for today
        const {data, error} = await supabase
            .from('tasks')
            .select('id, title, date, recurring, priority, parent_key, level')
            .eq('user_id', user.id)
            //.eq('date', currentDate.getFullYear() +"-" + (currentDate.getMonth()+1) + "-" + currentDate.getDate() )
            

        if(data){
            const todayFiltered = data.filter(isTodayTask);
            const withParents = includeParents(todayFiltered)
            todayFiltered.sort(
                (a,b) =>
                    //when it is negative, a will come first
                    //when it is positive, b will come first
                    //if its equal, it will keep the same order
                    priorities.indexOf(a.priority) - priorities.indexOf(b.priority)
            )
            setTodayTasks(organizeTasks(todayFiltered));
        }

        if(error){
            console.log(error);
        }

        //get data for the month
        const {data : upcomingData, error: upcomingError} = await supabase
            .from('tasks')
            .select('id, title, date, recurring, priority, parent_key, level')
            .eq('user_id', user.id)
            .gt('date', currentDate.getFullYear() +"-" + (currentDate.getMonth()+1) + "-" + currentDate.getDate() )
            
        if(upcomingData){
            upcomingData.sort(
                (a,b) =>
                    //when it is negative, a will come first
                    //when it is positive, b will come first
                    //if its equal, it will keep the same order
                    // new Date(a.date) - new Date (b.date),
                    priorities.indexOf(a.priority) - priorities.indexOf(b.priority)
            )
            setUpcomingTasks(organizeTasks(upcomingData));
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
                        <View style={{flex:0, flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                            <Text style={styles.title}>
                                tasks
                            </Text>
                            <Pressable onPress = {() => navigation.navigate('AddTask')} style={({pressed})=>[styles.borderButton,{backgroundColor: pressed? '#c49832': '#efd868'}]}>
                                <Image source={require('../assets/Plus.png')} style={{width:20, height:20}}></Image></Pressable>
                        </View>
                    </View>
                </View>
                    <ScrollView style={{height:'50%'}}>
                        <Text style={styles.timeLabel}>today</Text>
                        {todayTasks.map((task)=> (<View style={styles.taskItem} key={task.id}><View style={{flex:0, flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                            <Text style={{marginLeft:task.level * 15}}>{task.title}</Text>
                            <View style={{flex:0, flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                                <Text style={{borderColor:priorityColors[task.priority], borderWidth:1, padding:'1%', color:priorityColors[task.priority]}}>{task.priority}</Text>
                            {/* get the position of the menu */}
                            <Pressable onPress={()=> {
                                //get the id to be used during editing or adding new subtasks 
                                setSelectedTask(task.id);
                                //allow menu to be closed
                                //does not use !menuVisible as the menu will be inaccessible when the popup appears
                                setMenuVisible(!menuVisible);
                            }}><Image source={require('../assets/Menu.png')} style={{height:24, width:24, marginLeft:'2%'}}></Image></Pressable></View></View>
                            </View>
                            ))}  
                        <Text style={styles.timeLabel}>upcoming</Text>      
                        {upcomingTasks.map((task)=>(<View style={styles.taskItem} key={task.id}>
                            <View style={{flex:0, flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                            <Text style={{marginLeft:task.level * 15}}>{task.title}</Text>
                            <View style={{flex:0, flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                                <Text style={{borderColor:priorityColors[task.priority], borderWidth:1, padding:'1%', color:priorityColors[task.priority]}}>{task.priority}</Text>
                            {/* get the position of the menu */}
                                <Pressable onPress={()=> {
                                    //get the id to be used during editing or adding new subtasks 
                                    setSelectedTask(task.id);
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
            <View style={[styles.taskMenuContainer]}>
                <Pressable onPress={()=>{setMenuVisible(false)}}>
                    <Image source={require('../assets/close.png')} style={{ flex:0, justifyContent:'center', alignSelf:'flex-end'}}></Image>
                </Pressable>
                <View>
                    <Pressable onPress = {()=> navigation.navigate('AddTask', {taskID:selectedTask, method:'Edit'})} style={({pressed})=> ([styles.taskMenuItem,{ backgroundColor: pressed ? 'rgb(235, 235, 235)': null}])}>
                        <Image source={require('../assets/Edit.png')} style={styles.taskMenuImage}></Image>
                        <Text style={styles.taskMenuLabels}>edit</Text>
                    </Pressable>
                    <Pressable onPress = {()=> navigation.navigate('AddTask', {taskID:selectedTask, method:'Add Subtask'})} style={({pressed})=> ([styles.taskMenuItem,{ backgroundColor: pressed ? 'rgb(235, 235, 235)': null}])}>
                        <Image source={require('../assets/Plus.png')} style={[styles.taskMenuImage, {width:36, height:36}]}></Image>
                        <Text style={styles.taskMenuLabels}>add new subtask</Text>
                    </Pressable>
                    <Pressable onPress= {()=> deleteTask(selectedTask)} style={({pressed})=> ([styles.taskMenuItem,{ backgroundColor: pressed ? 'rgb(235, 235, 235)': null}])}>
                        <Image source={require('../assets/Trash.png')} style={styles.taskMenuImage}></Image>
                        <Text style={[styles.taskMenuLabels, {color:'#c14343'}]}>delete</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>

        </ImageBackground>
        

    );
}
