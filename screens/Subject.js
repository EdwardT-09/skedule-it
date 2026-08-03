import React, {useState, useEffect} from 'react';
import { View, Text, Button, ImageBackground, Image,  Pressable,ScrollView, Switch, ActivityIndicator} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Modal from 'react-native-modal'
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { File } from 'expo-file-system/next';
import { decode } from 'base64-arraybuffer';
import { ai } from '../config/initGemini.js'
import { isNotLoggedIn, roundUpToDecimal } from '../util/common.js';
import useDictionary from '../hook/useDictionary.js';
import {supabase} from '../config/initSupabase.js';
import Header from '../components/Header.js';
import Navigation from '../components/Nav.js';
import styles from '../assets/style.js';
import { copyAsync } from 'expo-file-system/legacy';
import { Alert } from 'react-native';

export default function Subject ({navigation, route}){
    const [menuVisible, setMenuVisible] = useState(false);
    const [subjectCode, setSubjectCode] = useState('');
    const [name, setName] = useState('');

    const [files, setFiles] = useState([]);

    const [generating, setGenerating] = useState(false);

    const [selectedFile, setSelectedFile] = useState();
    const [fileMenuVisible, setFileMenuVisible] = useState(false);

    const {dictionary, loading} = useDictionary();

    const subjectID = route?.params?.subjectID;

    useEffect(() => {getSubject(); getFiles();isNotLoggedIn(navigation)}, []);
    
    const deleteSubject = async(selectedSubject) =>{
            const user = (await supabase.auth.getUser()).data.user;

            if(!user) return;

            const {error} = await supabase
            .from('subjects')
            .delete()
            .eq('id', selectedSubject)

            if(error){
                console.log(error);
            } else{ 
                getSubject();
                setMenuVisible(false);
                navigation.navigate('Subjects')
            }
        }

        const deleteFile = async(selectedFile) =>{
            const user = (await supabase.auth.getUser()).data.user;

            if(!user) return;

            const {error} = await supabase
            .from('notes')
            .delete()
            .eq('id', selectedFile.id)

            if(error){
                console.log(error);
            } else{ 
                await getFiles();
                getSubject();
                setFileMenuVisible(false);
            }
    }

    const getSubject = async() => {
        const user = (await supabase.auth.getUser()).data.user;

        if (!user) return;

        const {data, error} = await supabase
        .from('subjects')
        .select('id, subject_code, name')
        .eq('user_id', user?.id)
        .eq('id', subjectID)
        .single();

        if (error){
            return
        }

        setSubjectCode(data.subject_code);
        setName(data.name);
    }

    const uploadDocument = async() =>{
        //allows users to slect the files to upload (open file selection window)
        const result = await DocumentPicker.getDocumentAsync({
            copyToCacheDirectory: true,
        })

        //if user did not pick any file (press cancel), return
        if (result.canceled) return;

        const file = result.assets[0];

        if (file.mimeType !== "application/pdf") {
            Alert.alert("Invalid File", "Please select a PDF document.");
            return;
        }

        setGenerating(true);

        try{
        for (const file of result.assets){
            await uploadToDatabase(file);
        }
        await getFiles();
        Alert.alert(
            "Success",
            "Your notes have been generated successfully."
        );
    } catch(err){
        console.log(err.message);
         Alert.alert(
            "Generation Failed",
            "We couldn't generate notes from this document. Please try again."
        );
    }
    finally{
        setGenerating(false)
    }
        
    }


    const uploadToDatabase = async (file) => {
    try {

      const user = (await supabase.auth.getUser()).data.user;

      const fileName = `${user.id}/${subjectID}/${Date.now()}-${file.name}`;


      const base64 = await FileSystem.readAsStringAsync(file.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });


      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  mimeType: "application/pdf",
                  data: base64,
                },
              },
              {
               text: `
Convert this PDF into study notes in Markdown format.

Rules:
- Start immediately with the first heading (## ...)
- Do NOT write any introduction
- Do NOT write phrases like:
  - "Here are the notes"
  - "Based on the PDF"
  - "Designed for clarity and easy learning"
- Do NOT add any text before the first heading
- Do NOT add any concluding remarks outside the notes
- Use:
  - ## for main sections
  - ### for subsections
  - Bullet points for key facts
  - Code blocks when relevant
- End with a ## Summary section

Output ONLY the Markdown notes.
`,
              },
            ],
          },
        ],
      });


      const notes =
        response.text ||
        response.candidates?.[0]?.content?.parts?.[0]?.text;



      const { error: dbError } = await supabase.from("notes").insert({
        subject_id: subjectID,
        file_name: file.name,
        content: notes,
      });
    
    } catch (err) {
        throw err;
    }
  };



    const getFiles = async () =>{
        const user = (await supabase.auth.getUser()).data.user;

        if (!user) return;

        const { data, error } = await supabase
                .from("notes")
                .select("id, file_name, content")
                .eq("subject_id", subjectID);

            if(error){
                console.log(error);
                return;
            }

            setFiles(data);
    }

  async function testGemini() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: 'Say hello in one sentence.',
    });



  } catch (error) {
    return;
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
                <Header includeBack navigation={navigation}/>
                <View style={[styles.container,{ paddingHorizontal:'5%'}]}>
                    <View style={styles.titleContainer}>
                        <View>
                            <Text style={styles.subtitle}>subject</Text>
                            <Text style={styles.title}>{subjectCode} - {name}</Text>
                        </View>
                        <View style={{flex:0, flexDirection:'row', alignSelf:'flex-end'}}>
                            <Pressable   disabled={generating} onPress={()=> {uploadDocument()}}>
                                {generating ? (
                                        <ActivityIndicator color="black" />
                                    ) : (
                                        <Image source={require("../assets/Plus.png")} style={{ width: 35, height:35, resizeMode: "contain" }}/>
                                    )}
                            </Pressable>
                            <Pressable onPress={() => {setMenuVisible(true)}}>
                                <Image source={require('../assets/Menu.png')} style={{width:35, height:35, paddingRight:'8%', resizeMode:'contain'}}></Image>
                            </Pressable>
                        </View>
                    </View>
                    <View>
                        <ScrollView style={{height:'65%'}}>
                            {files.map((file)=>(
                                <Pressable key={file.id} style={styles.listItems} onPress={()=> navigation.navigate('NotesViewer', {fileID: file.id, content:file.content})}>
                                    <View style={{flex:0, flexDirection:'row', justifyContent:'center', alignItems:'center'}}>  
                                        <View style={{width:'85%'}}>
                                            <Text style={styles.fileTitle}>{file.file_name}</Text>
                                        </View>
                                        <Pressable onPress={()=>{setSelectedFile(file); setFileMenuVisible(true)}}>
                                                <Image source={require('../assets/Menu.png')} style={{width:35, height:35, paddingRight:'8%', resizeMode:'contain'}}></Image>
                                        </Pressable>
                                    </View>
                                </Pressable>

                            )
                        )}
                        </ScrollView>
                    </View>
                </View>
                <Modal style={{justifyContent: 'flex-end', margin:0}} transparent={true} isVisible={menuVisible} swipeDirection="down" onSwipeComplete={()=> setMenuVisible(false)} onBackdropPress={()=> setMenuVisible(false)} propagateSwipe={true}>
                    <View style={[styles.modalMenuContainer]}>
                        <Pressable onPress={()=>{setMenuVisible(false)}}>
                            <Image source={require('../assets/close.png')} style={{ flex:0, justifyContent:'center', alignSelf:'flex-end'}}></Image>
                        </Pressable>
                        <View>
                            <Pressable onPress = {()=> navigation.navigate('AddSubject', {subjectID:subjectID})} style={({pressed})=> ([styles.modalMenuItem,{ backgroundColor: pressed ? 'rgb(235, 235, 235)': null}])}>
                                <Image source={require('../assets/Edit.png')} style={styles.modalMenuImage}></Image>
                                <Text style={styles.modalMenuLabels}>{dictionary.edit}</Text>
                            </Pressable>
                            <Pressable onPress= {()=> deleteSubject(subjectID)} style={({pressed})=> ([styles.modalMenuItem,{ backgroundColor: pressed ? 'rgb(235, 235, 235)': null}])}>
                                <Image source={require('../assets/Trash.png')} style={styles.modalMenuImage}></Image>
                                <Text style={[styles.modalMenuLabels, {color:'#c14343'}]}>{dictionary.delete}</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
                <Modal style={{justifyContent: 'flex-end', margin:0}} transparent={true} isVisible={fileMenuVisible} swipeDirection="down" onSwipeComplete={()=> setFileMenuVisible(false)} onBackdropPress={()=> setFileMenuVisible(false)} propagateSwipe={true}>
                    <View style={[styles.modalMenuContainer]}>
                        <Pressable onPress={()=>{setFileMenuVisible(false)}}>
                            <Image source={require('../assets/close.png')} style={{ flex:0, justifyContent:'center', alignSelf:'flex-end'}}></Image>
                        </Pressable>
                        <View>
                            <Pressable onPress= {()=> deleteFile(selectedFile)} style={({pressed})=> ([styles.modalMenuItem,{ backgroundColor: pressed ? 'rgb(235, 235, 235)': null}])}>
                                <Image source={require('../assets/Trash.png')} style={styles.modalMenuImage}></Image>
                                <Text style={[styles.modalMenuLabels, {color:'#c14343'}]}>{dictionary.delete}</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            </LinearGradient>
        </View>
    );
}