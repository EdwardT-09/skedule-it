import React, {useState, useEffect} from 'react';
import { View, Text, Pressable, Modal, StyleSheet, ImageBackground, Image, ScrollView} from 'react-native';

import {supabase} from '../config/initSupabase.js';
import Header from '../components/Header.js';
import Nav from '../components/Nav.js';
import styles from '../assets/style.js';

export default function Tasks ({navigation}){
    const [tasks, setTasks] = useState([]);
    const [menuPos, setMenuPos] = useState({x:0, y:0});
    const [selectedTask, setSelectedTask] = useState();
    const [menuVisible, setMenuVisible] = useState(false);

    //assign a ranking system to determine the priority order
    const priorities = ['Q1', 'Q2', 'Q3', 'Q4'];
    //using key value map to assign colors to each priority level
    const priorityColors = {Q1: '#c14343', Q2 : '#e3922f', Q3 : '#efd868', Q4:'#46b6af'};

    const menuRef = React.useRef(null);


    useEffect(()=>{getTasks()}, [])

    const getTasks = async() => {
        const user = (await supabase.auth.getUser()).data.user;

        if(!user) return;

        const {data, error} = await supabase
            .from('tasks')
            .select('title, date, recurring, priority')
            .eq('user_id', user.id)

        if(data){
            data.sort(
                (a,b) =>
                    //when it is negative, a will come first
                    //when it is positive, b will come first
                    //if its equal, it will keep the same order
                    priorities.indexOf(a.priority) - priorities.indexOf(b.priority)
            )
            setTasks(data);
        }

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
                        <View style={{flex:0, flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                            <Text style={styles.title}>
                                tasks
                            </Text>
                            <Pressable onPress = {() => navigation.navigate('AddTask')} style={({pressed})=>[styles.borderButton,{backgroundColor: pressed? '#c49832': '#efd868'}]}><Image source={require('../assets/Plus.png')}></Image></Pressable>
                        </View>
                    </View>
                </View>
                    <ScrollView style={{height:'50%'}}>
                        <Text>This Week</Text>
                        {tasks.map((task)=> (<View style={styles.taskItem} key={task.id}><View style={{flex:0, flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}><Text>{task.title}</Text><View style={{flex:0, flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}><Text style={{borderColor:priorityColors[task.priority], borderWidth:1, padding:'1%', color:priorityColors[task.priority]}}>{task.priority}</Text>
                        {/* get the position of the menu */}
                        <Pressable ref={menuRef} onPress={()=> menuRef.current.measure((px, py) => {
                            setMenuPos({x:px, y:py});
                            //get the id to be used during editing or adding new subtasks 
                            setSelectedTask(task.id);
                            //allow menu to be closed
                            //does not use !menuVisible as the menu will be inaccessible when the popup appears
                            setMenuVisible(!menuVisible);
                        })}><Image source={require('../assets/Menu.png')} style={{height:24, width:24, marginLeft:'2%'}}></Image></Pressable></View></View>
                    {/* {menuVisible && selectedTask == task.id &&
                                <View style={[styles.taskMenuContainer, {top:menuPos.y + 20, right:menuPos.x}]}><Text>Hello</Text></View>

                    } */}
</View>
                        ))}        
                    </ScrollView>

            </View>
        </View>
        <Nav></Nav>
        
        </ImageBackground>
        

    );
}
