import React from 'react';
import {View, Text, StyleSheet, Image, Pressable} from 'react-native';

const today = new Date();

const days = ['SUN', 'MON', 'TUE' ,' WED', 'THU', 'FRI', 'SAT'];

const day = days[today.getDay()];
const date = String(today.getDate()).padStart(2,'0');
const month = String(today.getMonth() + 1).padStart(2,'0');
const year = today.getFullYear();

const formattedDate = `${day}, ${date}/${month}/${year}`;

export default function Header({includeBack = false ,navigation}){
    return(
        <View style={{flex:0, flexDirection:'row', marginTop:'13%'}}>
            {includeBack && (<Pressable onPress={()=> navigation.goBack()} style={styles.back}><Image source={require('../assets/ChevronLeft.png')} style={{width:35, height:35}}></Image></Pressable>)}
            <View style={[styles.container, ]}>
                <View style={{flex:0, flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                    <Image source = {require('../assets/logo2.png')} style= {styles.logo}></Image>
                    <View style={{width:'100%', }}>
                        <Text style={styles.date}>{formattedDate}</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles= StyleSheet.create({
    back:{
        position:'absolute',
        top:60,
        left:20,
    },

    container:{
        width:"100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom:'5%'
    },

    logo:{
        width: 120,
        height: 75,
        resizeMode: 'contain',
    },

    date:{
        fontFamily: 'Poppins_400Regular',
        zIndex:2,
        borderColor:'black',
        borderBottomWidth:1,
        backgroundColor: "transparent",
        fontSize:11,
       
    }
})