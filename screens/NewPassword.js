import React, {useState, useEffect} from 'react';
import { View, Text, Button, ImageBackground, Image, Platform, TextInput, Pressable,ScrollView, ActivityIndicator} from "react-native";
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import useDictionary from '../hook/useDictionary.js';
import {supabase} from '../config/initSupabase.js';
import {validatePassword, validatePassword2 } from '../util/validation.js';
import Header from '../components/Header.js';
import Navigation from '../components/Nav.js';
import styles from '../assets/style.js';


export default function Password({navigation}){
    //store password and confirm password inputs
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    //store password and confirm password validation errors
    const [newPasswordError, setNewPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const {dictionary, loading} = useDictionary();

    //update password
    const changePassword = async() => {
                
        const user = (await supabase.auth.getUser()).data.user;

        if(!user) return;

        const newPasswordErr =  validatePassword(newPassword, dictionary);
        const confirmPasswordErr =  validatePassword2(newPassword, confirmPassword, dictionary);

        setNewPasswordError(newPasswordErr);
        setConfirmPasswordError(confirmPasswordErr);

        if(newPasswordErr === null && confirmPasswordErr === null){
              
            const {error} = await supabase.auth.updateUser({
                password : confirmPassword
            })

            if(!error){
                Alert.alert(dictionary.password_changed);
            }
               
        }
        
    }
    
    //display loading spinner while dictionary data is being retrieved
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
    <View style={{flex:1}}>
            <LinearGradient colors={['#F9FAF4', '#F9FAF4', '#cdf5e9', '#FEE172']} style={{flex:1}}>
                <ScrollView>
                    <Header includeBack navigation={navigation}/>
                    <View style={{flex:0, justifyContent:'center', alignItems:'center'}}>
                        <View style={[styles.container, {marginTop:'10%', marginBottom:'8%'}]}>
                            <View style={[styles.titleContainer]}>
                                <View style={{paddingLeft: '5%'}}>
                                    <Text style={styles.subtitle}>{dictionary.settings}</Text>
                                    <Text style={styles.title}>
                                        {dictionary.update}{dictionary.password}
                                    </Text>
                                </View>
                            </View>
                                <SafeAreaView style={{paddingHorizontal: 15}}>
                                    <View style={styles.fields}>
                                        <Text style={styles.fieldLabels}>{dictionary.new_password}: </Text>
                                        <TextInput style={styles.input} secureTextEntry={true} value={newPassword} onChangeText={setNewPassword} placeholder={dictionary.new_password} placeholderTextColor='#555555'></TextInput>
                                        {newPasswordError? (<Text style={styles.errorText}>{newPasswordError}</Text>) : null}
                                    </View>
                                    <View style={styles.fields}>
                                        <Text style={styles.fieldLabels}>{dictionary.confirm_new_password}: </Text>
                                        <TextInput style={styles.input} secureTextEntry={true} value={confirmPassword} onChangeText={setConfirmPassword} placeholder={dictionary.confirm_new_psw_placeholder} placeholderTextColor='#555555'></TextInput>
                                        {confirmPasswordError? (<Text style={styles.errorText}>{confirmPasswordError}</Text>) : null}
                                    </View>
                                    <Pressable style={({pressed}) => [styles.trueCenter, styles.buttons, {opacity: pressed ? 0.5 : 1}, ]} onPress={changePassword}>
                                        <View style={[{flexDirection:'row'}, {alignItems:'center'}]}>
                                            <Text style={styles.buttonTexts} >{dictionary.lets_go} </Text>
                                        </View>
                                    </Pressable>
                                </SafeAreaView>
                        </View>
                    </View>
                </ScrollView>
            </LinearGradient>
    </View>
    )
}