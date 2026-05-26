import React, { useState } from 'react';
import { View, Text, Button, ImageBackground, Image, TextInput, Pressable,ScrollView} from "react-native";
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import {isEmpty} from '../util/common.js';
import {validateEmail, validatePassword} from '../util/validation.js'
import {onSignIn} from '../database/auth.js';
import Header from '../components/Header.js';
import styles from '../assets/style.js';

export default function SignIn({navigation}) {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');

    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [generalError, setGeneralError] = useState('');

    const [showPassword, setShowPassword] = useState(true);

    const [loading,setLoading] = useState('');
    const handleSignIn = async () => {
        if(loading) return;

        const emailErr = validateEmail(email);
        const passwordErr = validatePassword(password);
        
        setEmailError(emailErr);
        setPasswordError(passwordErr);

        if(emailErr === null && passwordErr===null){
            setLoading(true);
            try{
            const error = await onSignIn(email, password);
            if(error === null){
            console.log('Hello');
           return navigation.navigate('Home');
        } else{
            console.log('Failed');
        }
        } catch(e){
            setGeneralError(error);}
            finally{
                setLoading(false);
            }


        }
        return false;

    }
    return (
        <ScrollView>
            <View style={{flex:1}}>
                <LinearGradient colors={['#F9FAF4', '#F9FAF4', '#cdf5e9', '#FEE172']} style={{flex:1}}>
                    <View style={styles.center}>
                        <Header></Header>
                        <View style={[styles.container, {marginBottom:100},]}>
                            <View style={[styles.titleContainer, {paddingLeft:'7%', flex:0, flexDirection:'row'}]}>
                                 <View style={{marginRight:'15%'}}>
                                    <Text style={styles.title}>back already?</Text>
                                    <Text style={styles.desc}>continue your study journey with us</Text>
                                </View>
                                <Image
                                source = {require('../assets/stars.png')} style={{flex:0, alignSelf:'center'}}></Image>
                            </View>
                                <SafeAreaView style={{paddingHorizontal: 15}}>
                                    <View style={styles.fields}>
                                        <Text style={styles.fieldLabels}>email:</Text>
                                        <TextInput style ={styles.input} value = {email} onChangeText={setEmail} placeholder='enter your email'></TextInput>
                                        {emailError? (<Text style={styles.errorText}>{emailError}</Text>) : null}
                                    </View>
                                    <View style={styles.fields}>
                                        <Text style={styles.fieldLabels}>password:</Text>
                                        <TextInput style ={styles.input} secureTextEntry={showPassword} value={password} onChangeText={setPassword} placeholder='enter your password'></TextInput>
                                        <Pressable onPress={()=> setShowPassword(!showPassword)}>
                                            <Text style={styles.visiblePassword}>{showPassword ? 'show' : 'hide'} password</Text>
                                        </Pressable>
                                        {passwordError? (<Text style={styles.errorText}>{passwordError}</Text>) : null}
                                        {generalError? (<Text style={styles.errorText}>{generalError}</Text>) : null}
                                    </View>
                                 
                                    <Pressable style={({pressed}) => [styles.trueCenter, styles.buttons, {backgroundColor: pressed? "gray" : 'black'}]} onPress={handleSignIn}>
                                        <View style={[{flexDirection:'row'}, {alignItems:'center'}]}>
                                            <Text style={[styles.buttonTexts, {color:'white'}]} >LET'S GO </Text>
                                        </View>
                                    </Pressable>
                                       <View style={[{flexDirection:'column', paddingVertical:'10%', justifyContent:'space-between'}]}>
                                        <View style={[{flexDirection:'row'}, {alignItems:'center'}]}>
                                            <Text>dont have an account? </Text>
                                            <Pressable onPress={()=> navigation.navigate('Register')}>
                                                <Text style={styles.links}>register here</Text>
                                            </Pressable>
                                        </View>
                                        <Pressable onPress={()=> navigation.navigate('Register')} style={{paddingVertical:'5%', }}>
                                            <Text style={styles.links}>forgot password</Text>
                                        </Pressable>
                                    </View>
                                </SafeAreaView>
                                {/* <View style={[styles.authFooter, styles.trueCenter]}>
                                    <Text style={styles.authFooterText}>★Free Forever★</Text>
                                </View> */}
                        </View>
                    </View>
                </LinearGradient>
            </View>
        </ScrollView>
    )
}