import { StyleSheet } from "react-native";


const styles= StyleSheet.create({

    links:{
        color:'black',
        fontFamily: 'Poppins_700Bold',
    },

    visiblePassword:{
        fontFamily: 'Poppins_700Bold',
        fontSize:13,

    },

    borderButton:{
        borderColor:'black',
        borderWidth:1,
        padding:'3%',
    },

    errorText:{
        color:'red',
        fontSize: 12,
        fontFamily: 'Poppins_400Regular',
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
        width: '100%',
        backgroundColor: 'transparent',
        borderRadius: 15,
        // borderColor:'black',
        // borderWidth: 1,
        // elevation:10,
        // shadowColor: '#000', 
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.25,
        // shadowRadius: 3.84,
    },

    titleContainer:{
        borderTopStartRadius:13,
        borderTopEndRadius:13,     
        // flex:0,
        // flexDirection:'column',
        // justifyContent:'start',
        // alignItems:'left',
        paddingVertical: '5%',
        borderBottomColor:'black',
        borderBottomWidth: 1,

    },

    subtitle:{
        textAlign:'left',
        fontFamily:  'Poppins_400Regular',
        fontSize:12,
    },

    landingTitle:{
        color:'black',
        fontSize:40,
        fontFamily: 'Sintony_700Bold'
    },

    landingDesc:{
        color:'black',
        fontSize:16,
        fontFamily:  'Poppins_400Regular',
    },

    title:{
        color:'black',
        fontSize:28,
        fontFamily: 'Sintony_700Bold'
    },

    desc:{
        color:'black',
        fontSize:11,
        fontFamily:  'Poppins_400Regular',
    },

    buttons:{
        paddingVertical:'3%',
        paddingHorizontal:'5%',
        borderColor: 'black',
        borderWidth:1,
        marginTop:'10%',
        borderRadius:50,

        //ios shadow
        // shadowColor: "black",
        // shadowOffset: {wdith:10, height: 10},
        // shadowOpacity:0.5,
        // shadowRadius: 5,
        // backgroundColor: 'white',

        // //android shadow
        // elevation:4,
    },

    buttonTexts:{
        fontFamily: 'Poppins_700Bold',
        fontSize:15,
        textAlign:'center',
    },

    input:{
        height: 40,
        width: '100%',
        backgroundColor:'transparent',
        borderColor: "black",
        borderBottomWidth: 1,
        fontFamily:'Poppins_400Regular',
        fontSize:11,
    },
    
    fieldLabels:{
        fontFamily:'Poppins_400Regular',
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
        fontFamily: 'Poppins_400Regular',
        fontSize: 10,
    },

    welcomeText:{
        fontFamily: 'Sintony_400Regular',
        fontSize:24,
        textAlign: 'center',
        textTransform: 'lowercase',
    },

    addTaskButton:{
        position:"absolute",
        bottom:180,
        right:20,
        borderRadius:50,
        padding:15,
        borderColor:'black',
        borderWidth:1,
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
        fontFamily: 'Poppins_400Regular',
        fontSize:11,
    },

    
    navActive:{
        borderRadius:50,
        // borderColor: 'black',
        // borderWidth:1,
        padding:10,
        shadowColor: '#ffcd07',
    },

    //subject
    subjectContainer:{
        flex:0,
        flexDirection:'row', 
        paddingHorizontal:'5%', 
        justifyContent:'space-between',
        flexWrap:'wrap',
        paddingVertical:'5%',
    },

    subjectItems:{
        width:150, 
        flex:0, 
        flexDirection:'column', 
        justifyContent:'center',
        alignItems:'center'
    },


    //profile
    profileName:{
        fontFamily:'Sintony_700Bold',
        fontSize:30,
        textAlign:'center',
        marginTop:'2%',
    },

    profileGender:{
        fontFamily:'Poppins_400Regular',
        fontSize:14,
        textAlign:'center',
        textTransform:'lowercase',
    },

    profileText:{
        fontFamily:'Sintony_700Bold',
        fontSize:28,
        textAlign:'center',
    },

    settingsText:{
        fontFamily: 'Poppins_400Regular',
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
        borderWidth:1,
        margin:'2.5%',
        padding:'3%',
        borderRadius: 10,

    },

    taskTitle:{
        fontFamily:'Poppins_700Bold',
        fontSize:15,
    },

    taskInfo:{
        fontFamily:'Poppins_400Regular',
        fontSize:11,
    },


    modalMenuContainer:{
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

    modalMenuItem:{
        flex:0,
        flexDirection:'row',
        alignItems:'center',
        borderColor:'gray',
        borderBottomWidth:1
    },

    timeLabel:{
        fontFamily: 'Sintony_700Bold',
        fontSize:28,
        paddingLeft:10,
        paddingTop:20,
    },

    modalMenuImage:{
        marginVertical:'5%',
        marginRight:'5%',
    },

    modalMenuLabels:{
        fontSize:16,
        fontFamily: 'Poppins_400Regular',
    },






})

export default styles;