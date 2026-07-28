import React, {useState, useEffect} from 'react';
import { View, Text, Button, ImageBackground, Image, Pressable,ScrollView, Switch, ActivityIndicator} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

import useDictionary from '../hook/useDictionary.js';
import {supabase} from '../config/initSupabase.js';
import Header from '../components/Header.js';
import Navigation from '../components/Nav.js';
import styles from '../assets/style.js';
import { isNotLoggedIn } from '../util/common.js';

export default function Profile({navigation}){
    const [isEnabled, setIsEnabled] = useState(false);
    const [username, setUsername] = useState('');
    const [gender, setGender] = useState('');
    const genderImage = {
        Male : require('../assets/Male.png'),
        Female : require('../assets/Female.png'),
    }
   
    useEffect(()=>{
            fetchData();
            isNotLoggedIn(navigation);
    },[])

    const {dictionary, loading} = useDictionary();

    const saveNotification = async() => {
        const toggle = !isEnabled;
        setIsEnabled(toggle);
        
        const user = (await supabase.auth.getUser()).data.user;


        const {data, error} = await supabase
            .from('profiles')
            .upsert({
                id:user?.id,
                notification: toggle,
            })

    }

    const fetchData = async() => {


        const user = (await supabase.auth.getUser()).data.user;


        const {data, error} = await supabase
            .from('profiles')
            .select('username, notification, gender')
            .eq('id', user.id)
            .single();


        if(data){
            setUsername(data.username);
            setIsEnabled(data.notification);
            setGender(data.gender);
        }



    }

    const logOut = async() =>{
        const user = (await supabase.auth.getUser()).data.user;

        if(!user) return;

        const {error} = await supabase.auth.signOut();

        if(!error){
            navigation.navigate("Landing");
        }
    }

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
                <ScrollView>
                    <View style={{flex:0, justifyContent:'center', alignItems:'center', paddingBottom:'40%'}}>
                        <Header/>
                        <Text style={styles.profileText}>{dictionary.profile}</Text> 
                        <View style={{width:'100%',  alignItems:'flex-end', paddingRight:'15%'}}>
                            <Pressable onPress={()=> navigation.navigate('ChangeInfo')} style={({pressed}) => [{opacity: pressed? 0.5 : 1, paddingLeft:'5%',}]}>
                                <Image source={require('../assets/Edit.png')} style={{width:30, height:30,}}></Image>
                            </Pressable>
                        </View>
                        <View style={{flex:0, flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                            <Image source={genderImage[gender]} style={{width:200, height:200, resizeMode:'contain', marginTop:'5%',}}></Image>
                            <Text style={styles.profileName}>{username}</Text>
                        </View>
                        <Text style={styles.profileGender}>{gender}</Text>
                        <View style={[styles.container, {marginTop:'10%'}]}>
                            <View style={[styles.titleContainer]}>
                                <View style={{paddingLeft: '5%'}}>
                                    <Text style={styles.subtitle}>{dictionary.configuration}</Text>
                                    <Text style={styles.title}>
                                        {dictionary.settings}
                                    </Text>
                                </View>
                            </View>
                            <Pressable onPress={ () => {navigation.navigate('Languages')}} style={({pressed}) => [styles.settingItem, {backgroundColor: 'transparent', opacity: pressed? 0.5 : 1},{borderColor:'black', borderBottomWidth:1,flexDirection:'row', alignItems:'center', justifyContent:'space-between'}]}>
                                <View style={[{flexDirection:'row'}, {alignItems:'center'}]}>
                                    <Image source={require('../assets/Globe.png')}></Image>
                                    <Text style={styles.settingsText}>{dictionary.languages}</Text>
                                </View>
                                <View>
                                    <Image source={require('../assets/Caret Right.png')}></Image>
                                    </View>
                            </Pressable>
                            <View style={[styles.settingItem,{borderColor:'black', borderBottomWidth:1,flexDirection:'row', alignItems:'center', justifyContent:'space-between'}]}>
                                <View style={[{flexDirection:'row'}, {alignItems:'center'}]}>
                                    <Image source={require('../assets/Bell.png')}></Image>
                                    <Text style={styles.settingsText}>{dictionary.notification}</Text>
                                </View>
                                <View>
                                    <Switch trackColor={{false: 'gray', true: 'gray'}} thumbColor={isEnabled? 'black' : 'white'} onValueChange={saveNotification} value={isEnabled}></Switch>
                                </View>
                            </View>
                            <Pressable onPress={()=>{navigation.navigate('Password')}} style={({pressed}) => [styles.settingItem, {backgroundColor: 'transparent', opacity: pressed? 0.5 : 1},{borderColor:'black', borderBottomWidth:1,flexDirection:'row', alignItems:'center', justifyContent:'space-between'}]}>
                                <View style={[{flexDirection:'row'}, {alignItems:'center'}]}>
                                    <Image source={require('../assets/Key.png')}></Image>
                                    <Text style={styles.settingsText}>{dictionary.update} {dictionary.password}</Text>
                                </View>
                                <View>
                                    <Image source={require('../assets/Caret Right.png')}></Image>
                                </View>
                            </Pressable>
                            <Pressable style={{paddingLeft:'3%', paddingVertical:'4%', flex:0, justifyContent:'center', alignItems:'center'}} onPress={() => {logOut()}}>
                                <View style={[{flexDirection:'row'}, {alignItems:'center'}]}>
                                    <Image source={require('../assets/Log out.png')}></Image>
                                    <Text style={[styles.settingsText,{color:'#c14343'}]}>{dictionary.logout}</Text>
                                </View>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            <Navigation></Navigation>
            </LinearGradient>
        </View>)
}