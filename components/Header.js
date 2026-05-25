import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

const today = new Date();

const days = ['SUN', 'MON', 'TUE' ,' WED', 'THU', 'FRI', 'SAT'];

const day = days[today.getDay()];
const date = String(today.getDate()).padStart(2,'0');
const month = String(today.getMonth() + 1).padStart(2,'0');
const year = today.getFullYear();

const formattedDate = `${day}, ${date}/${month}/${year}`;

export default function Header(){
    return(
        <View style={[styles.container, {marginTop:"13%"}]}>
            <Image source = {require('../assets/logo2.png')} style= {styles.logo}></Image>
            <Text style={styles.date}>{formattedDate}</Text>
        </View>
    )
}

const styles= StyleSheet.create({
    container:{
        width:"100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    logo:{
        width:145,
        height:145,
        resizeMode:'contain',
    },

    date:{
        fontFamily: 'Poppins_400Regular',
        position:'absolute',
        top:70,
        right:135,
        zIndex:2,
        borderColor:'black',
        borderBottomWidth:1,
        backgroundColor: "transparent",
        paddingTop: "2.5%",
        fontSize:11,
       
    }
})