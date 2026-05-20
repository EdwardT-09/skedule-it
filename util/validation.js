import {isEmpty} from './common.js';

export const validateUsername = (username) => {
    if (isEmpty(username)){
        return "The username field is empty.";
    } 

    return null;
};

export const validateEmail = (email) => {
    const pattern = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/;
    if (isEmpty(email)){
        return "The email field is empty.";
    } 

    if(!pattern.test(email)){
        return "The format is wrong. Please follow the example: johndoe@example.com";
    }

    return null;
};

export const validatePassword = (password) => {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[%&?_#=-])[A-Za-z\d%&?_#=-]{8,}$/;
    if (isEmpty(password)){
        return "The password field is empty.";
    } 

    if(!pattern.test(password)){
        return "The password must have a minumum of 8 characters with at least one uppercase and lowercase letter, one number and one special character.";
    }
    return null;
};

export const validatePassword2 = (password, password2) => {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[%&?_#=-])[A-Za-z\d%&?_#=-]{8,}$/;
    if (isEmpty(password2)){
        return "The password confirmation field is empty.";
    } 

    if(!pattern.test(password2)){
        return "The password must have a minumum of 8 characters with at least one uppercase and lowercase letter, one number and one special character.";
    }

    if (password !== password2){
        return "The passwords do not match"
    }
    return null;
};

export const validateTitle = (title) =>{
    if(isEmpty(title)){
        console.log('validate title')
        return "The title field is empty";
    }

    return null;
}

export const validateDate = (date) =>{
    const currentDate = new Date();
  
    date.setHours(0,0,0,0);
    currentDate.setHours(0,0,0,0);

    if(date < currentDate){
        console.log('validate date')
        return "The date field must be from"+ currentDate.getDate() +"/"+  (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear() + "onwards";
    }

    return null;
}

export const validatePriority = (priority) =>{
    if(isEmpty(priority)){
        console.log('validate priority');
        return "The priority field is empty";
    }
    return null;
}