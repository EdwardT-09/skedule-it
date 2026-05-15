import { StyleSheet } from "react-native";


const styles= StyleSheet.create({
    links:{
        color:'#4ECDC4',
        textDecorationLine: 'underline',
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
        borderColor:'black',
        borderWidth: 1,
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

    navContainer:{
        position:'absolute',
        bottom:0,
        width:'100%',
        backgroundColor:'white',
        paddingVertical:30,
        borderColor:'black',
        borderWidth:1,
    },

    navButton:{
        borderRadius:50,
        borderColor: 'black',
        borderWidth:1,
        padding:10,
    },

    
    navActive:{
        borderRadius:50,
        borderColor: 'black',
        borderWidth:1,
        paddingVertical:10,
        paddingHorizontal:30,
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
    }

})

export default styles;