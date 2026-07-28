import React, {useState, useEffect} from 'react';
import { View, Text, Pressable, StyleSheet, ImageBackground, Image, ScrollView, ActivityIndicator} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import useDictionary from '../hook/useDictionary.js';
import Header from '../components/Header.js';
import Nav from '../components/Nav.js';
import styles from '../assets/style.js';


export default function RegisterConfirmation ({navigation}){
    
    const {dictionary, loading} = useDictionary();

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
            <Header></Header>
            <View style={[styles.container, {marginTop:'10%'}]}>
                <View style={[styles.titleContainer,]}>
                    <View style={{paddingLeft: '5%'}}>
                        <Text style={styles.subtitle}>{dictionary.email_confirmation_title}</Text>
                            <Text style={styles.title}>
                                {dictionary.tasks_for_the_day}
                            </Text>
                    </View>
                </View>
                <View style={{paddingLeft:'5%'}}>
                <Text style={styles.emailConfirmationText}>{dictionary.email_confirmation}</Text>
                <Text style={styles.emailConfirmationText}>{dictionary.email_confirmation_2}</Text>
                <Text style={styles.emailConfirmationText}>{dictionary.email_confirmation_3}</Text>
                <Pressable onPress={()=> navigation.navigate('SignIn')}>
                    <Text style={styles.links}>{dictionary.sign_in_here}</Text>
                </Pressable>
                </View>
            </View>
        </LinearGradient>
    </View>
        

    );
}
