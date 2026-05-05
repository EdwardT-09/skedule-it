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
        return "The password field is empty.";
    } 

    if(!pattern.test(password2)){
        return "The password must have a minumum of 8 characters with at least one uppercase and lowercase letter, one number and one special character.";
    }

    if (password !== password2){
        return "The passwords do not match"
    }
    return null;
};

