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
       const organized = [];

       const addTaskWithChildren = (task, level = 0) =>{
        organized.push({
            ...task,
            displayLevel: level
        });

        const children = tasks.filter(
            child => child.parent_key === task.id
        );

        children.sort(
            (a,b) => priorities.indexOf(a.priority) - priorities.indexOf(b.priority)
        );

        children.forEach(child =>{
            addTaskWithChildren(child, level+1)
        });
    }

        const rootTasks = tasks.filter(task => !task.parent_key);


        rootTasks.sort(
            (a,b) => priorities.indexOf(a.priority) - priorities.indexOf(b.priority)
        );

        rootTasks.forEach(task =>{
            addTaskWithChildren(task);
        });
        
       return organized;
    } 

    export const isTodayTask = (task) =>{
        const currentDateStr = getCurrentDateStr();
        const todayName = getTodayName();

        if(
            task.has_deadline && task.end_date && task.end_date < currentDateStr

        ){
            return false;
        }
        const oneTimeTask = task.start_date === currentDateStr;

        const recurringTask = task.recurring?.includes(todayName) && Array.isArray(task.recurring) && task.start_date <= currentDateStr;

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

