import {supabase} from '../config/initSupabase.js';

export const isEmpty = (value) => {
    if (value === null || (typeof value === "string" && value.trim() === '')){
        return true;
    }
    return false;
} 

export const isLoggedIn = async(navigation) => {
    const user = (await supabase.auth.getUser()).data.user;

    if (!user) return;

    if(user){
        navigation.navigate('Home');
    }
}


export function roundUpToDecimal(num, places) {
  const factor = Math.pow(10, places);
  return Math.ceil(num * factor) / factor;
}
