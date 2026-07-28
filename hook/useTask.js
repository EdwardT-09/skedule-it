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
        console.log("1");
        //get data for today
        const {data, error} = await supabase
            .from('tasks')
            .select('id, title, start_date, recurring, priority, parent_key, level, completed_on, has_deadline, end_date')
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
            .select('id, title, start_date, end_date, has_deadline, recurring, priority, parent_key, level, completed_on')
            .eq('user_id', user.id)
            .gt('start_date', getCurrentDateStr() )

        if(upcomingError){
            console.log(upcomingError)
        }
            
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

            const toggleTaskCompletion = async(task) =>{
                    const today = new Date().toLocaleDateString('en-CA', {
                        timeZone:'Asia/Kuala_Lumpur'
                    });
                    
                    const isCompleted = task.completed_on === today;

                    const isRecurring = Array.isArray(task.recurring) && task.recurring.length > 0;

                    let newCompletedOn;

                    if(isRecurring){
                        newCompletedOn = isCompleted ? null : today;
                    } else{
                        newCompletedOn = task.completed_on ? task.completed_on : today;
                    }

                    const {error} = await supabase
                    .from("tasks")
                    .update({
                        completed_on: newCompletedOn
                    })
                    .eq("id", task.id);

                    if(error){
                        console.log(error);
                        return;
                    }

                    await getTasks();
                }


            useEffect(()=>{
                getTasks();
            }, [])

            return {
                todayTasks,
                upcomingTasks,
                menuVisible,
                toggleTaskCompletion,
                setMenuVisible,
                refreshTasks:getTasks,
                deleteTask,
            }

    
    }

