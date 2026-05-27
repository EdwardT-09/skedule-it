import React, {useState, useEffect} from 'react';
import { supabase } from '../config/initSupabase';
import {priorities, getCurrentDateStr, getTodayName, organizeTasks, isTodayTask, includeParents} from '../util/taskHelpers';

export default function useTask(){
    const [todayTasks, setTodayTasks] = useState([]);
    const [upcomingTasks, setUpcomingTasks] = useState([]);
    const [menuVisible, setMenuVisible] = useState(false);

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
            .gt('date', getCurrentDateStr() )
            
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

            useEffect(()=>{
                getTasks();
            }, [])

            return {
                todayTasks,
                upcomingTasks,
                menuVisible,
                setMenuVisible,
                refreshTasks:getTasks,
                deleteTask,
            }
    }
