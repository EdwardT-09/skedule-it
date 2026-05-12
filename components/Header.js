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
            <Image source = {require('../assets/logo.png')} style= {styles.logo}></Image>
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
        width:150,
        height:150,
        marginBottom:20,
        resizeMode:'contain',
    },

    date:{
        fontFamily: 'JetBrainsMono_700Bold',
        position:'absolute',
        top:75,
        right:90,
        zIndex:2,
        backgroundColor: "#F5FFFE",
        borderColor: "black",
        borderWidth: 1,
        padding: "2%",
        transform: [{ rotate: '-12.62deg' }],
        fontSize:9,
       
    }
})