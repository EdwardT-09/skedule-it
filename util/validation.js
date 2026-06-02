
import {isEmpty} from './common.js';
import useDictionary from '../hook/useDictionary.js';

export const validateUsername = (username, dictionary) => {
    if (isEmpty(username)){
        return dictionary.username_empty_error;
    } 

    return null;
};

export const validateEmail = (email, dictionary) => {

    const pattern = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/;
    if (isEmpty(email)){
        return dictionary.email_empty_error;
    } 

    if(!pattern.test(email)){
        return dictionary.email_format_error;
    }

    return null;
};

export const validateGender = (gender, dictionary) => {

    if (isEmpty(gender)){
        return dictionary.gender_empty_error;
    } 

    return null;
};



export const validatePassword = (password, dictionary) => {

    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[%&?_#=-])[A-Za-z\d%&?_#=-]{8,}$/;
    if (isEmpty(password)){
        return dictionary.password_empty_error;
    } 

    if(!pattern.test(password)){
        
        return dictionary.password_format_error;    }
    return null;
};

export const validatePassword2 = (password, password2, dictionary) => {

    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[%&?_#=-])[A-Za-z\d%&?_#=-]{8,}$/;
    if (isEmpty(password2)){
        return dictionary.confirm_password_empty_error;
    }
    if(!pattern.test(password2)){
        return dictionary.password_format_error;
    }

    if (password !== password2){
        return dictionary.confirm_password_match_error
    }
    return null;
};

export const validateTitle = (title, dictionary) =>{

    if(isEmpty(title)){
        return dictionary.title_empty_error;
    }

    return null;
}

export const validateDate = (date, dictionary) =>{

    const currentDate = new Date();
  
    date.setHours(0,0,0,0);
    currentDate.setHours(0,0,0,0);

    if(date < currentDate){
        return dictionary.date_error+ currentDate.getDate() +"/"+  (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear() + "onwards";
    }

    return null;
}

export const validatePriority = (priority, dictionary) =>{

    if(isEmpty(priority)){
        return dictionary.priority_empty_error;
    }
    return null;
}

export const validateSubjectCode = (subjectCode, dictionary) =>{
    if(isEmpty(subjectCode)){
        return dictionary.subjectCode_empty_error;
    }

    return null;
}

export const validateSubject = (name, dictionary) =>{

    if(isEmpty(name)){
        return dictionary.subject_empty_error;
    }

    return null;
}