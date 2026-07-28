import {supabase} from '../config/initSupabase.js';


//get the total duration for each subject 
export const getDurationBySubject = (subjects, logs) =>{
    const result = {};

    subjects.forEach((subject) => {
        result[subject.id] = {
            subject_code: subject.subject_code,
            totalDuration: 0,
        }
    })

    logs.forEach((item)=>{
        if(result[item.subject]){
            result[item.subject].totalDuration += Number(item.duration) || 0
        }
    })

    return result;
}


export const getSessionCountBySubject = (subjects, logs) => {
    const result = {};

    subjects.forEach((subject) => {
    result[subject.id] = {
        subject_code: subject.subject_code,
        sessions: 0,
    }
})

    logs.forEach((item) => {
        if(result[item.subject]){
            result[item.subject].sessions += 1;
        }
    })

    return result;
}

export const getAvgConfidenceBySubject = (subjects, logs) => {
    const totals = {};
    const counts = {};

    subjects.forEach((subject) => {
            totals[subject.id] = 0;
            counts[subject.id] = 0; 
    })
    
    logs.forEach((item) =>{
        const subjectId = item.subject;
        const confidence = Number(item.confidence) || 0;

        if(totals.hasOwnProperty(subjectId)){
            totals[subjectId] += confidence;
            counts[subjectId] += 1;
        }

    })

    const result = {};

    subjects.forEach((subject)=>{
        const id = subject.id;

        result[id] = {
            subject_code:subject.subject_code,
            avgConfidence:
            counts[id] === 0 ? 0 : totals[id] / counts[id],
        }
    });

    return result;
}

