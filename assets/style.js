import { StyleSheet } from "react-native";


const styles= StyleSheet.create({
    center:{
        flex:1,
        alignItems:'center',

    },


    container:{
        width: '80%',
        height: '55%',
        backgroundColor: '#fff',
        borderRadius: 15,
        borderColor:'black',
        borderWidth: 1,
    },

    titleContainer:{
        backgroundColor:'#4ECDC4', 
        borderTopStartRadius:15,
        borderTopEndRadius:15,
        alignItems:'center',
        paddingVertical: '8%',
        borderBottomColor:'black',
        borderBottomWidth: 1,
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
        fontFamily: 'JetBrainsMono_700Bold',
        fontSize:15,
        paddingVertical:'3%',
        paddingHorizontal:'5%',
        borderColor: 'black',
        borderWidth:1,
        margin:'10%',
        textAlign:'center',

        //ios shadow
        shadowColor: "black",
        shadowOffset: {wdith:10, height: 10},
        shadowOpacity:0.5,
        shadowRadius: 5,
        backgroundColor: 'white',

        //android shadow
        elevation:4,
    }
})

export default styles;