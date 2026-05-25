import React, {useState} from 'react';
import { View, Text, Button, ImageBackground, Image, TextInput, Pressable,ScrollView} from "react-native";
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { isEmpty } from '../util/common.js';
import { validateUsername, validateEmail, validateGender, validatePassword, validatePassword2 } from '../util/validation.js';
import {onRegister} from '../database/auth.js'
import Header from '../components/Header.js';
import styles from '../assets/style.js';


export default function Register({navigation}) {

    const [username,setUsername] = useState('');
    const [email,setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [password,setPassword] = useState('');
    const [password2,setPassword2] = useState('');
    
    const [usernameError,setUsernameError] = useState('');
    const [emailError,setEmailError] = useState('');
    const [genderError,setGenderError] = useState('');
    const [passwordError,setPasswordError] = useState('');
    const [password2Error,setPassword2Error] = useState('');
    const [generalError, setGeneralError] = useState('');

    const [showPassword, setShowPassword] = useState(true);
    const [showConfirmPassword, setShowConfirmPassword] = useState(true);

    const handleRegister = async() => {
        const usernameErr = validateUsername(username);
        const emailErr = validateEmail(email);
        const genderErr = validateGender(gender);
        const passwordErr = validatePassword(password);
        const password2Err = validatePassword2(password, password2);

        setUsernameError(usernameErr);
        setEmailError(emailErr);
        setGenderError(genderErr);
        setPasswordError(passwordErr);
        setPassword2Error(password2Err);
        setGeneralError(typeof password2Err);
        
        if(usernameErr === null && emailErr === null && genderErr === null && passwordErr === null && password2Err === null){
            setGeneralError("HI55");
            const error = await onRegister(username, email, gender, password);
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
            <View style={{flex:1}}>
                <LinearGradient colors={['#F9FAF4', '#F9FAF4', '#cdf5e9', '#FEE172']} style={{flex:1}}>
                        <View style={styles.center}>
                            <Header></Header>
                            <View style={[styles.container, {marginBottom:100,},]}>
                                <View style={[styles.titleContainer, {paddingHorizontal:'7%', flex:0, flexDirection:'row',}]}>
                                    <View style={{marginRight:'15%'}}>
                                        <Text style={styles.title}>join the club!</Text>
                                        <Text style={styles.desc}>start your study journey with us</Text>
                                    </View>
                                    <Image
                                    source = {require('../assets/stars.png')}></Image>
                                </View>
                                    <SafeAreaView style={{paddingHorizontal: 20}}>
                                        <View style={styles.fields}>
                                            <Text style={styles.fieldLabels}>username:</Text>
                                            <TextInput style ={styles.input} value={username} onChangeText={setUsername} placeholder='enter a username'></TextInput>
                                            {usernameError? (<Text style={styles.errorText}>{usernameError}</Text>) : null}
                                        </View>
                                        <View style={styles.fields}>
                                            <Text style={styles.fieldLabels}>email:</Text>
                                            <TextInput style ={styles.input} value={email} onChangeText={setEmail} placeholder='enter your email'></TextInput>
                                            {emailError? (<Text style={styles.errorText}>{emailError}</Text>) : null}
                                        </View>
                                        <View style={styles.fields}>
                                            <Text>gender:</Text>
                                            <View style={{flex:0, flexDirection:'row', marginTop:10,}}>
                                                <Pressable onPress={()=> gender === 'Male' ? setGender('') : setGender('Male')} style={{borderColor: 'black', borderWidth: gender=== 'Male' ? 1 : 0, marginRight:20, padding:5}}><Text style={{color: gender === 'Male'? 'black' : 'gray'}}>male</Text></Pressable>
                                                <Pressable onPress={()=> gender === 'Female' ? setGender('') : setGender('Female')} style={{borderColor: 'black', borderWidth: gender=== 'Female' ? 1 : 0, padding:5}}><Text style={{color: gender === 'Female'? 'black' : 'gray'}}>female</Text></Pressable>
                                            </View>
                                            {genderError? (<Text style={styles.errorText}>{genderError}</Text>) : null}
                                        </View>
                                        <View style={styles.fields}>
                                            <Text style={styles.fieldLabels}>password:</Text>
                                            <TextInput style ={styles.input} secureTextEntry={showPassword} value={password} onChangeText={setPassword} placeholder='enter a password'></TextInput>
                                            <Pressable onPress={()=> setShowPassword(!showPassword)}>
                                                <Text style={styles.visiblePassword}>{showPassword ? 'show' : 'hide'} password</Text>
                                            </Pressable>
                                            {passwordError? (<Text style={styles.errorText}>{passwordError}</Text>) : null}
                                        </View>
                                        <View style={styles.fields}>
                                            <Text style={styles.fieldLabels}>confirm password:</Text>
                                            <TextInput style ={styles.input} secureTextEntry={showConfirmPassword} value={password2} onChangeText={setPassword2} placeholder='enter the password again'></TextInput>
                                            <Pressable onPress={()=> setShowConfirmPassword(!showConfirmPassword)}>
                                                <Text style={styles.visiblePassword}>{showConfirmPassword ? 'show' : 'hide'} password</Text>
                                            </Pressable>
                                            {password2Error? (<Text style={styles.errorText}>{password2Error}</Text>) : null}
                                            {generalError? (<Text style={styles.errorText}>{generalError}</Text>) : null}
                                        </View>
                                        
                                        <Pressable style={({pressed}) => [styles.trueCenter, styles.buttons, {backgroundColor: pressed? 'gray' : 'black'}]} onPress={handleRegister}>
                                            <View style={[{flexDirection:'row'}, {alignItems:'center'}]}>
                                                <Text style={[styles.buttonTexts, {color:'white'}]} >LET'S GO </Text>
                                                <Image source={require('../assets/Check.png')}>
                                                </Image>
                                            </View>
                                        </Pressable>
                                        <View style={[{flexDirection:'row'}, {alignItems:'center', marginTop:'5%'}]}>
                                            <Text> already have an account? </Text>
                                            <Pressable onPress={()=> navigation.navigate('SignIn')}>
                                                <Text style={styles.links}>sign in</Text>
                                            </Pressable>
                                        </View>
                                    </SafeAreaView>
                                {/* <View style={[styles.authFooter, styles.trueCenter]}>
                                        <Text style={styles.authFooterText}>★Free Forever★</Text>
                                    </View>    */}
                            </View>
                        </View>
                    </LinearGradient>
                </View>
            </ScrollView>
    )
}