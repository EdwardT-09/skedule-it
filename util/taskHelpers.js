//assign a ranking system to determine the priority order
   export const priorities = ['Q1', 'Q2', 'Q3', 'Q4'];
    //using key value map to assign colors to each priority level
    export const priorityColors = {Q1: '#c14343', Q2 : '#e3922f', Q3 : '#efd868', Q4:'#46b6af'};

    export const getCurrentDateStr = () =>{
        const currentDate = new Date();
        const pad = (n) => String(n).padStart(2, '0');

        return `${currentDate.getFullYear()}-${pad(currentDate.getMonth()+1)}-${pad(currentDate.getDate())}`;
    }

    export const getTodayName = () =>{
        const currentDate = new Date();
        const weekDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return weekDay[currentDate.getDay()];
    }

    

    export const organizeTasks = (tasks) =>{
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

    export const isTodayTask = (task) =>{
        const currentDateStr = getCurrentDateStr();
        const todayName = getTodayName();
        const oneTimeTask = task.date === currentDateStr;

        const recurringTask = task.recurring?.includes(todayName) && Array.isArray(task.recurring) && task.date <= currentDateStr;

        return oneTimeTask || recurringTask
    }

    export const includeParents = (tasks) => {
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

