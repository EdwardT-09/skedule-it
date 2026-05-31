import React, {useState, useEffect} from 'react';
import { View, Text, Button, ImageBackground, Image, TextInput, Pressable,ScrollView, Switch} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

import useDictionary from '../hook/useDictionary.js';
import {supabase} from '../config/initSupabase.js';
import Header from '../components/Header.js';
import Navigation from '../components/Nav.js';
import styles from '../assets/style.js';

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
    },[])

    const dictionary = useDictionary();

    const saveNotification = async() => {
        const toggle = !isEnabled;
        setIsEnabled(toggle);
        
        const user = (await supabase.auth.getUser()).data.user;

        if (!user) console.log('No User 1');

        const {data, error} = await supabase
            .from('profiles')
            .upsert({
                id:user?.id,
                notification: toggle,
            })

            if(error){
                console.log(error);
            }

            console.log('saved');
    }

    const fetchData = async() => {


        const user = (await supabase.auth.getUser()).data.user;

        if (!user) console.log('No User 2');

        const {data, error} = await supabase
            .from('profiles')
            .select('username, notification, gender')
            .eq('id', user.id)
            .single();

        console.log(data.notification);
        if(data){
            setUsername(data.username);
            setIsEnabled(data.notification);
            setGender(data.gender);
        }

        if(error){
            console.log('Error: Notification Fetching');
        }

    }
    return(
        <View style={{flex:1,}}>
            <LinearGradient colors={['#F9FAF4', '#F9FAF4', '#cdf5e9', '#FEE172']} style={{flex:1}}>
                <ScrollView>
                    <View style={{flex:0, justifyContent:'center', alignItems:'center', paddingBottom:'40%'}}>
                        <Header></Header>
                        <Text style={styles.profileText}>{dictionary.my_profile}</Text> 
                        <Image source={genderImage[gender]} style={{width:200, height:200, resizeMode:'contain', marginTop:'5%',}}></Image>
                        <View style={{flex:0, flexDirection:'row', alignItems:'center'}}>
                            <Text style={styles.profileName}>{username}</Text>
                            <Pressable onPress={()=> navigation.navigate('ChangeInfo')} style={({pressed}) => [{opacity: pressed? 0.5 : 1, paddingLeft:'5%'}]}>
                                <Image source={require('../assets/Edit.png')} style={{width:25, height:25,}}></Image>
                            </Pressable>
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
                            <View style={{paddingLeft:'3%', paddingVertical:'4%', flex:0, justifyContent:'center', alignItems:'center'}}>
                                <View style={[{flexDirection:'row'}, {alignItems:'center'}]}>
                                    <Image source={require('../assets/Log out.png')}></Image>
                                    <Text style={[styles.settingsText,{color:'#c14343'}]}>{dictionary.logout}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            <Navigation></Navigation>
            </LinearGradient>
        </View>)
}