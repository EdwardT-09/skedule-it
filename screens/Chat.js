import React, { useState, useEffect } from 'react';
import {View, Text, TextInput, KeyboardAvoidingView, ScrollView, Pressable, ActivityIndicator, Platform} from 'react-native';

import { isNotLoggedIn } from '../util/common.js';
import {supabase} from '../config/initSupabase.js';
import {ai} from '../config/initGemini.js'
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/Header';
import styles from '../assets/style';

export default function Chat({navigation, route}) {
    const fileName = route?.params?.fileName;
    const subjectID = route?.params?.subjectID;

    const [messages, setMessages] = useState([]);
    const [question, setQuestion] = useState('');
    const [loading, setLoading] = useState(false);

    const [notes, setNotes] = useState('');

    
    useEffect(()=> {getNotes(),  isNotLoggedIn(navigation)}, [])

    const getNotes = async() =>{

        const user = (await supabase.auth.getUser()).data.user;
        
        if(!user) return;

        
        const {data, error} = await supabase
        .from('notes')
        .select('content')
        .eq('file_name', `${user.id}/${subjectID}/${fileName}`)
        .single()
        
        setNotes(data.content);
    }

    const askAI = async() => {
        if(!question.trim()) return;

        const userQuestion = question;
        
        setMessages(prev =>[
            ...prev,
            {
                role: 'user',
                text: userQuestion
            }
        ]);

        setQuestion('');
        setLoading(true);

        try{
            const result = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: [
                  {
                    role: "user",
                    parts: [
                      {
                       text: 
                       `You are a lecturer. Use only these notes to answer in a simple, easy to understand manner:
                       RULES: Do not use markdown formatting.
                        Do not use *, **, #, backticks, or bullet symbols.
                        Reply in plain text.
                       NOTES: ${notes}
                       QUESTION: ${userQuestion}`
                      },
                    ],
                  },
                ],
              });
            const answer = result.candidates?.[0]?.content?.parts?.[0]?.text;
   


            setMessages(prev =>[
                ...prev,
                {
                    role: 'gemini',
                    text: answer
                }
            ])
        } catch(err){

            const errorMessage = err?.message || "sorry! it seems that something went wrong while generating a response";

            setMessages(prev =>[
                ...prev,
                {
                    role:"error",
                    text:errorMessage,
                }
            ])
        }
        finally{
        setLoading(false);}
  }

  return (
    <View style={{ flex: 1 }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={0} >
            <LinearGradient colors={['#F9FAF4', '#F9FAF4', '#cdf5e9', '#FEE172']} style={{flex:1}}>
                <Header includeBack navigation={navigation} />
                <ScrollView style={{flex:1}} contentContainerStyle={{padding:15}}>
                    {messages.map((msg, index) => (
                        <View key={index} style={[styles.chat, {alignSelf: msg.role === "user"? 'flex-end' : 'flex-start', backgroundColor: msg.role === "user" ? '#FEE172' : msg.role === "error" ? '#ffddd' : '#cdf5e9'}]}>
                            <Text style={{color:msg.role === "error" ? "#c62828" : "black"}}>{msg.text}</Text>
                        </View>
                    ))}
                    {loading && (
                        <ActivityIndicator size="small"/>
                    )}
                </ScrollView>
                <View style={{padding:15, paddingBottom:50}}>
                    <TextInput placeholder="ask me some questions" style={{borderWidth:1, borderColor:'#3f3f3f', marginBottom:'5%', padding:5, fontSize:16}} placeholderTextColor='#555555' value={question} onChangeText={setQuestion}></TextInput>
                    <Pressable onPress={()=> askAI()}style={{backgroundColor: '#1e1e1e', padding:'3.5%', borderRadius:50, marginBottom:'5%'}}>
                        <Text style={[styles.buttonTexts,{textAlign:'center', color:'white'}]}>send</Text>
                    </Pressable>
                    <Text>powered by gemini</Text>
                </View>
            </LinearGradient>
        </KeyboardAvoidingView>
    </View>
  );
}