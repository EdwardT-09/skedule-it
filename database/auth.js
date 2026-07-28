import { supabase } from '../config/initSupabase';


export const onRegister = async(username, email, gender, password) => {
    const {data, error} = await supabase.auth.signUp({ email:email.trim(), password:password, options:{ data: { username, gender,}, emailRedirectTo: 'skeduleit://signup-confirmed',},});
    console.log("User:", data.user);
    console.log("Session:", data.session);

    const userId = data?.user?.id;
   
    // const { error: profileError } = await supabase
    // .from('profiles').insert({
    //     id:userId,
    //     username:username,
    //     gender: gender,
    // });

    // console.log("SIGNUP ERROR 2:", profileError);

    // if (profileError) {
    //     return profileError.message;
    // }

    console.log("SIGNUP ERROR 3:");
    return error ? error.message : null;
}

export const onSignIn = async(email, password) => {
    const {data, error} = await supabase.auth.signInWithPassword({email:email, password:password});
    console.log("SIGNIN ERROR 1:", error);
    
    if (error) {
    return error.message;
    }

    const user = data.user;

  
    const { data: profile, error: profileCheckError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();


    if (profileCheckError && profileCheckError.code === "PGRST116") {
        const { error: insertError } = await supabase
            .from("profiles")
            .insert({
                id: user.id,
                username: user.user_metadata.username,
                gender: user.user_metadata.gender,
            });

        if (insertError) {
            return insertError.message;
        }
    }

    return error ? error.message : null;
}