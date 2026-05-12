import React, {useState} from 'react';
import { View, Text, Button, ImageBackground, Image, TextInput, Pressable,ScrollView} from "react-native";
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

import { isEmpty } from '../util/common.js';
import { validateUsername, validateEmail, validatePassword, validatePassword2 } from '../util/validation.js';
import {onRegister} from '../database/auth.js'
import Header from '../components/Header.js';
import styles from '../assets/style.js';


export default function Register({navigation}) {

    const [username,setUsername] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [password2,setPassword2] = useState('');
    
    const [usernameError,setUsernameError] = useState('');
    const [emailError,setEmailError] = useState('');
    const [passwordError,setPasswordError] = useState('');
    const [password2Error,setPassword2Error] = useState('');
    const [generalError, setGeneralError] = useState('');

    const handleRegister = async() => {
        const usernameErr = validateUsername(username);
        const emailErr = validateEmail(email);
        const passwordErr = validatePassword(password);
        const password2Err = validatePassword2(password, password2);

        setUsernameError(usernameErr);
        setEmailError(emailErr);
        setPasswordError(passwordErr);
        setPassword2Error(password2Err);
        setGeneralError(typeof password2Err);
        if(usernameErr === null && emailErr === null && passwordErr === null && password2Err === null){
            setGeneralError("HI55");
            const error = await onRegister(username, email, password);
            setGeneralError(error);
        }else{
            setGeneralError("HI2");
        }

            console.log ("General Error:", generalError);
        if(generalError === null){
            return navigation.navigate('Home');
        }else{
            setGeneralError(error);
            return
        }

        return false;
    }
    return (
            <ScrollView>
            <ImageBackground
                source = {require('../assets/bg.png')}
                style = {{flex:1}}>
                    <View style={styles.center}>
                        <Header></Header>
                        <View style={[styles.container, {marginBottom:100},]}>
                            <View style={[styles.titleContainer, { backgroundColor:'#4ECDC4'}, {paddingLeft:'7%'}]}>
                                <Image
                                source = {require('../assets/stars.png')} style={{flex:0, alignSelf:'center'}}></Image>
                                <Text style={styles.title}>join the club!</Text>
                                <Text style={styles.desc}>start your study journey with us</Text>
                            </View>
                                <SafeAreaView style={{paddingHorizontal: 15}}>
                                    <View style={styles.fields}>
                                        <Text style={styles.fieldLabels}>username:</Text>
                                        <TextInput style ={styles.input} value={username} onChangeText={setUsername}></TextInput>
                                        {usernameError? (<Text style={styles.errorText}>{usernameError}</Text>) : null}
                                    </View>
                                    <View style={styles.fields}>
                                        <Text style={styles.fieldLabels}>email:</Text>
                                        <TextInput style ={styles.input} value={email} onChangeText={setEmail}></TextInput>
                                        {emailError? (<Text style={styles.errorText}>{emailError}</Text>) : null}
                                    </View>
                                    <View style={styles.fields}>
                                        <Text style={styles.fieldLabels}>password:</Text>
                                        <TextInput style ={styles.input} secureTextEntry={true} value={password} onChangeText={setPassword}></TextInput>
                                        {passwordError? (<Text style={styles.errorText}>{passwordError}</Text>) : null}
                                    </View>
                                    <View style={styles.fields}>
                                        <Text style={styles.fieldLabels}>confirm password:</Text>
                                        <TextInput style ={styles.input} secureTextEntry={true} value={password2} onChangeText={setPassword2}></TextInput>
                                        {password2Error? (<Text style={styles.errorText}>{password2Error}</Text>) : null}
                                        {generalError? (<Text style={styles.errorText}>{generalError}</Text>) : null}
                                    </View>
                                    <View style={[{flexDirection:'row'}, {alignItems:'center'}]}>
                                        <Text> registered? </Text>
                                        <Pressable onPress={()=> navigation.navigate('SignIn')}>
                                            <Text style={styles.links}>sign in</Text>
                                        </Pressable>
                                    </View>
                                    <Pressable style={({pressed}) => [styles.trueCenter, styles.buttons, {backgroundColor: pressed? "#e4b639" : '#FFE66D'}, {transform: [{rotate: '3deg'}]}]} onPress={handleRegister}>
                                        <View style={[{flexDirection:'row'}, {alignItems:'center'}]}>
                                            <Text style={styles.buttonTexts} >LET'S GO </Text>
                                            <Image source={require('../assets/Check.png')}>
                                            </Image>
                                        </View>
                                    </Pressable>
                                </SafeAreaView>
                                <View style={[styles.authFooter, styles.trueCenter]}>
                                    <Text style={styles.authFooterText}>★Free Forever★</Text>
                                </View>
                        </View>
                    </View>
                </ImageBackground>
            </ScrollView>
    )
}