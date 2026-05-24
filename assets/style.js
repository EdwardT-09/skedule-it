import { StyleSheet } from "react-native";


const styles= StyleSheet.create({

    links:{
        color:'#4ECDC4',
        textDecorationLine: 'underline',
    },

    borderButton:{
        borderColor:'black',
        borderWidth:1,
        padding:'3%',
    },

    errorText:{
        color:'red',
        fontSize: 12,
        fontFamily: 'SpaceGrotesk_400Regular',
    },

    center:{
        flex:1,
        alignItems:'center',

    },

    trueCenter:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },


    container:{
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 15,
        // borderColor:'black',
        // borderWidth: 1,
        elevation:10,
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },

    titleContainer:{
        borderTopStartRadius:13,
        borderTopEndRadius:13,     
        // alignItems:'center',
        paddingVertical: '5%',
        borderBottomColor:'black',
        borderBottomWidth: 1,
    },

    subtitle:{
        textAlign:'left',
        fontFamily: 'JetBrainsMono_400Regular',
        fontSize:12,
    },

    title:{
        color:'black',
        fontSize:28,
        fontFamily: 'SpaceGrotesk_700Bold'
    },

    desc:{
        color:'black',
        fontSize:11,
        fontFamily: 'SpaceGrotesk_400Regular'
    },

    buttons:{
        paddingVertical:'3%',
        paddingHorizontal:'5%',
        borderColor: 'black',
        borderWidth:1,
        marginTop:'10%',

        //ios shadow
        shadowColor: "black",
        shadowOffset: {wdith:10, height: 10},
        shadowOpacity:0.5,
        shadowRadius: 5,
        backgroundColor: 'white',

        //android shadow
        elevation:4,
    },

    buttonTexts:{
        fontFamily: 'JetBrainsMono_700Bold',
        fontSize:15,
        textAlign:'center',
    },

    input:{
        height: 40,
        width: '100%',
        backgroundColor:'#F0F0F0',
        borderColor: "black",
        borderWidth: 1,
        fontFamily:'JetBrainsMono_400Regular',
        fontSize:11,
    },
    
    fieldLabels:{
        fontFamily:'JetBrainsMono_400Regular',
        fontSize:13,
        marginBottom:'3%',
    },

    fields:{
        paddingVertical:15,
    },

    authFooter:{
        backgroundColor: '#FFD3B6',
        borderStyle: 'dashed',
        borderTopColor:'black',
        borderTopWidth:1,
        padding:'5%',
    },

    authFooterText:{
        fontFamily: 'JetBrainsMono_400Regular',
        fontSize: 10,
    },

    welcomeText:{
        fontFamily: 'JetBrainsMono_700Bold',
        fontSize:24,
        textAlign: 'center',
        textDecorationLine:'underline',
        textTransform: 'uppercase',
    },

    addTaskButton:{
        position:"absolute",
        bottom:180,
        right:20,
        borderRadius:50,
        backgroundColor: '#c14343',
        padding:20,
        elevation:5,
        zIndex:2,
    },

    //navigation

    navContainer:{
        position:'absolute',
        bottom:0,
        width:'100%',
        backgroundColor:'rgb(249, 249, 249)',
        paddingVertical:30,
        // borderColor:'black',
        // borderWidth:1,
        borderRadius:20,
        elevation:10,
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

    },

    navButton:{
        borderRadius:50,
        // borderColor: 'black',
        // borderWidth:1,
        padding:10,
    },

    navLabel:{
        fontFamily: 'JetBrainsMono_400Regular',
        fontSize:11,
    },

    
    navActive:{
        borderRadius:50,
        // borderColor: 'black',
        // borderWidth:1,
        padding:10,
    },


    //profile
    profileText:{
        fontFamily:'SpaceGrotesk_700Bold',
        fontSize:28,
        textAlign:'center',
    },

    settingsText:{
        fontFamily: 'JetBrainsMono_400Regular',
        fontSize:14,
        paddingLeft:'3%',
    },

    settingItem:{
        paddingHorizontal:'5%',
        paddingVertical:'4%',
    },

    //priority pop up 
    priorityPopBack:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#00000050'
    },

    priorityPopContainer:{
        backgroundColor:'white',
        width:'80%',
        height:'60%',
        borderColor:'black',
        borderWidth:1,
        borderRadius:20
    },

    priorityTitle:{
        fontFamily:'JetBrainsMono_700Bold',
        fontSize:32,
        textAlign:'center',
    },


    //tasks
    taskItem:{
        borderColor:'black',
        borderBottomWidth:1,
        padding:'3%',
    },

    taskMenuContainer:{
        backgroundColor:'rgb(255, 255, 255)',
        // borderColor:'black',
        // borderWidth:1,
        borderTopEndRadius:25,
        borderTopLeftRadius:25,
        width:'100%',
        height:'35%',
        position:"absolute",
        bottom:0,
        padding:10,
        elevation:10,
    },

    taskMenuItem:{
        flex:0,
        flexDirection:'row',
        alignItems:'center',
        borderColor:'gray',
        borderBottomWidth:1
    },

    timeLabel:{
        fontFamily: 'SpaceGrotesk_700Bold',
        fontSize:28,
        paddingLeft:10,
        paddingTop:20,
    },

    taskMenuImage:{
        marginVertical:'5%',
        marginRight:'5%',
    },

    taskMenuLabels:{
        fontSize:16,
        fontFamily: 'JetBrainsMono_400Regular',
    },






})

export default styles;