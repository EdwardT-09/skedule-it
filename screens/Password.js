import React, {useState} from 'react';
import { View, Text, Button, ImageBackground, Image, TextInput, Pressable,ScrollView} from "react-native";
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import useDictionary from '../hook/useDictionary.js';
import {supabase} from '../config/initSupabase.js';
import {validatePassword, validatePassword2 } from '../util/validation.js';
import Header from '../components/Header.js';
import Navigation from '../components/Nav.js';
import styles from '../assets/style.js';

export default function Password({navigation}){
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [currentPasswordError, setCurrentPasswordError] = useState('');
    const [newPasswordError, setNewPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const dictionary = useDictionary();

    const changePassword = async() => {
                
        const user = (await supabase.auth.getUser()).data.user;

        if(!user) return;

        const currentPasswordErr =  validatePassword(currentPassword, dictionary);
        const newPasswordErr =  validatePassword(newPassword, dictionary);
        const confirmPasswordErr =  validatePassword(newPassword, confirmPassword, dictionary);

        setCurrentPasswordError(currentPasswordErr);
        setNewPasswordError(newPasswordErr);
        setConfirmPasswordError(confirmPasswordErr);

        console.log('Yes');
        if(currentPasswordErr === null && newPasswordErr === null && confirmPasswordErr === null){
                 console.log('Yes2');
        const {data, error} = await supabase.auth.signInWithPassword({
            email: user.email,
            password: currentPassword,
        })
                         console.log('Yes3');
            if(data){
                                    console.log('Yes4');
                    const {data, error} = await supabase.auth.updateUser({
                        password : confirmPassword
                    })
                    console.log("SAVED");
                } else {
                    setCurrentPasswordError('The current password provided is incorrect.', error);
                    console.log(error);
                }
        }
        
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
                                    <Text style={styles.fieldLabels}>{dictionary.current_password}: </Text>
                                    <TextInput style={styles.input} secureTextEntry={true} value={currentPassword} onChangeText={setCurrentPassword} placeholder={dictionary.current_password_placeholder}></TextInput>
                                    {currentPasswordError? (<Text style={styles.errorText}>{currentPasswordError}</Text>) : null}
                                </View>
                                <View style={styles.fields}>
                                    <Text style={styles.fieldLabels}>{dictionary.new_password}: </Text>
                                    <TextInput style={styles.input} secureTextEntry={true} value={newPassword} onChangeText={setNewPassword} placeholder={dictionary.new_password}></TextInput>
                                    {newPasswordError? (<Text style={styles.errorText}>{newPasswordError}</Text>) : null}
                                </View>
                                <View style={styles.fields}>
                                    <Text style={styles.fieldLabels}>{dictionary.confirm_new_password}: </Text>
                                    <TextInput style={styles.input} secureTextEntry={true} value={confirmPassword} onChangeText={setConfirmPassword} placeholder={dictionary.confirm_new_psw_placeholder}></TextInput>
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