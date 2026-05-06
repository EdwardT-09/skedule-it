import { supabase } from '../config/initSupabase';


export const onRegister = async(username, email, password) => {
    const {data, error} = await supabase.auth.signUp({ email:email, password:password});
    console.log("SIGNUP ERROR 1:", error);
    console.log("SIGNUP DATA 1:", data);
    const userId = data?.user?.id;
   
    const { error: profileError } = await supabase.from('profiles').insert({
        id:userId,
        username:username,
    });

    console.log("SIGNUP ERROR 2:", profileError);

    if (profileError) {
        return profileError.message;
    }

    console.log("SIGNUP ERROR 3:");
    return error ? error.message : null;
}

export const onSignIn = async(email, password) => {
    const {error} = await supabase.auth.signInWithPassword({email:email, password:password});
    console.log("SIGNIN ERROR 1:", error);

    return error ? error.message : null;
}