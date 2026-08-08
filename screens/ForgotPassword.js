import React, {useState} from "react";
import {View, Text, TextInput, Platform, Pressable, Alert, ActivityIndicator} from "react-native";
import {supabase} from "../config/initSupabase";
import useDictionary from '../hook/useDictionary.js';
import {SafeAreaView} from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/Header.js';
import styles from '../assets/style.js';
import { validateEmail } from "../util/validation.js";

export default function ForgotPassword({navigation}){
    //store the user's email address
    const [email,setEmail] = useState("");

    //store the email validation error
    const [emailError, setEmailError] = useState("");

    const {dictionary, loading} = useDictionary();

    //deep link used for password reset
    const redirectTo = "skeduleit://reset-password";  

    //send a password reset email using Supabase
    const sendResetEmail = async()=>{
        const {error} = await supabase.auth.resetPasswordForEmail(email.trim(), {
            redirectTo: "skeduleit://reset-password",

        });

        if(error){
            throw error;
        }
    }
    //validate the email address and send the reset email
    const handleEmail = async () => {

        const emailErr = validateEmail(email, dictionary);
        setEmailError(emailErr);
        if(emailErr === null ){
            try{
            await sendResetEmail();
            Alert.alert(
                dictionary.email_sent,
                dictionary.email_sent_message
            );

        } catch(e){
            Alert.alert(dictionary.error, e.message);}
        }
    }

    //display a loading spinner while the dictionary is being loaded
    if(loading){
            return(
                <View style={{flex:1}}>
                <LinearGradient colors={['#F9FAF4', '#F9FAF4', '#cdf5e9', '#FEE172']} style={{flex:1}}>
                    <Header></Header>
                <View style={{flex: 1, justifyContent:"center", alignItems:"center"}}>
                    <ActivityIndicator size="large" color="black"></ActivityIndicator>
                </View>
                </LinearGradient>
                </View>
            )
        }

    return(
    <View style={{flex:1,}}>
            <LinearGradient colors={['#F9FAF4', '#F9FAF4', '#cdf5e9', '#FEE172']} style={{flex:1}}>
                <Header includeBack navigation={navigation}/>
                <View style={[styles.container, {marginTop:'10%'}]}>
                    <View style={[styles.titleContainer, ]}>
                        <View style={{paddingLeft: '5%'}}>
                            <Text style={[styles.subtitle,]}>{dictionary.lets_go}</Text>
                            <Text style={styles.title}>
                                {dictionary.updated} {dictionary.reset_password}
                            </Text>
                        </View>
                    </View>
                    <SafeAreaView>
                        <View style={{padding:'5%'}}>
                            <View style={styles.fields}>
                                <Text style={styles.fieldLabels}>{dictionary.email}:</Text>
                                <TextInput style ={styles.input} value = {email} onChangeText={setEmail} placeholder={dictionary.email_placeholder} placeholderTextColor='#555555'></TextInput>
                                {emailError? (<Text style={styles.errorText}>{emailError}</Text>) : null}
                            </View>                        
                            <Pressable style={({pressed}) => [styles.trueCenter, styles.buttons, {backgroundColor: pressed? 'gray' : 'black'}]} onPress={handleEmail}>
                                <View style={[{flexDirection:'row'}, {alignItems:'center'}]}>
                                    <Text style={[styles.buttonTexts, {color:'white'}]} >{dictionary.reset_password}</Text>
                                </View>
                            </Pressable>
                        </View>
                    </SafeAreaView>
                </View>
            </LinearGradient>
    </View>
)

}