import React, { useState } from 'react';
import { View, Text, Button, ImageBackground, Image, TextInput, Pressable,ScrollView} from "react-native";
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

import {isEmpty} from '../util/common.js';
import {validateEmail, validatePassword} from '../util/validation.js'
import Header from '../components/Header.js';
import styles from '../assets/style.js';

export default function Register({navigation}) {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleRegister = () => {
        const emailErr = validateEmail(email);
        const passwordErr = validatePassword(password);
        
        setEmailError(emailErr);
        setPasswordError(passwordErr);

        if(isEmpty(emailError) || isEmpty(passwordError)){
            return true;
        }
        return false;
    }
    return (
            <ScrollView>
            <ImageBackground
                source = {require('../assets/bg2.png')}
                style = {{flex:1}}>
                    <View style={styles.center}>
                        <Header></Header>
                        <View style={[styles.container, {marginBottom:100},]}>
                            <View style={[styles.titleContainer, { backgroundColor:'#4ECDC4'}]}>
                                <Image
                                source = {require('../assets/stars.png')}></Image>
                                <Text style={styles.title}>back already?</Text>
                                <Text style={styles.desc}>continue your study journey with us</Text>
                            </View>
                                <SafeAreaView style={{paddingHorizontal: 15}}>
                                    <View style={styles.fields}>
                                        <Text style={styles.fieldLabels}>email:</Text>
                                        <TextInput style ={styles.input} value = {email} onChangeText={setEmail}></TextInput>
                                        {emailError? (<Text style={styles.errorText}>{emailError}</Text>) : null}
                                    </View>
                                    <View style={styles.fields}>
                                        <Text style={styles.fieldLabels}>password:</Text>
                                        <TextInput style ={styles.input} secureTextEntry={true} value={password} onChangeText={setPassword}></TextInput>
                                        {passwordError? (<Text style={styles.errorText}>{passwordError}</Text>) : null}
                                    </View>
                                    <View style={[{flexDirection:'row'}, {alignItems:'center'}, {justifyContent:'space-between'}]}>
                                        <View style={[{flexDirection:'row'}, {alignItems:'center'}]}>
                                            <Text>not registered? </Text>
                                            <Pressable onPress={()=> navigation.navigate('Register')}>
                                                <Text style={styles.links}>register here</Text>
                                            </Pressable>
                                        </View>
                                        <Pressable onPress={()=> navigation.navigate('Register')}>
                                            <Text style={styles.links}>forgot password</Text>
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