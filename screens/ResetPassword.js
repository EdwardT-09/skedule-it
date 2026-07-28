import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, Alert, ActivityIndicator, Platform, ScrollView } from "react-native";
import { supabase } from "../config/initSupabase";
import useDictionary from '../hook/useDictionary.js';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/Header.js';
import styles from '../assets/style.js';
import { validatePassword, validatePassword2 } from "../util/validation.js";

export default function ResetPassword({ route, navigation }) {
    const { dictionary, loading } = useDictionary();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [newPasswordError, setNewPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [isSessionSetting, setIsSessionSetting] = useState(false);

    const [showPassword, setShowPassword] = useState(true);
    const [showConfirmPassword, setShowConfirmPassword] = useState(true);

    useEffect(() => {
        // Grab the deep link URL directly from App.js routing parameters!
        const deepLinkUrl = route.params?.rawUrl;
        
        if (deepLinkUrl) {
            
            const parseAndSetSession = async () => {
                const rawParams = deepLinkUrl.split('#')[1] || deepLinkUrl.split('?')[1];
                if (!rawParams) return;

                const params = new URLSearchParams(rawParams);
                const access_token = params.get('access_token');
                const refresh_token = params.get('refresh_token');

                if (access_token && refresh_token) {
                    setIsSessionSetting(true);
                    const { error } = await supabase.auth.setSession({
                        access_token,
                        refresh_token,
                    });
                    setIsSessionSetting(false);

                    if (error) {
                        Alert.alert(dictionary.error, dictionary.session_error_message + error.message);
                    } 
                }
            };

            parseAndSetSession();
        }
    }, [route.params?.rawUrl]); // Re-run if a new link is tapped while app is open

    const updatePassword = async () => {
        const user = (await supabase.auth.getUser()).data.user;

        if (!user) {
            Alert.alert(dictionary.expired_link, dictionary.expired_link_message);
            return;
        }

        const newPasswordErr = validatePassword(newPassword, dictionary);
        const confirmPasswordErr = validatePassword2(newPassword, confirmPassword, dictionary);

        setNewPasswordError(newPasswordErr);
        setConfirmPasswordError(confirmPasswordErr);

        if (newPasswordErr === null && confirmPasswordErr === null) {

            const { error } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (error) {
                Alert.alert(dictionary.error, error.message);
                return;
            }

            Alert.alert(dictionary.success, dictionary.password_success_message);
            navigation.navigate("SignIn");
        }
    };

    if (loading || isSessionSetting) {
        return (
            <View style={{ flex: 1 }}>
                <LinearGradient colors={['#F9FAF4', '#F9FAF4', '#cdf5e9', '#FEE172']} style={{ flex: 1 }}>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <ActivityIndicator size="large" color="black" />
                    </View>
                </LinearGradient>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>            
                <LinearGradient colors={['#F9FAF4', '#F9FAF4', '#cdf5e9', '#FEE172']} style={{ flex: 1 }}>
                    <ScrollView keyboardShouldPersistTaps="handled">
                        <View style={{ flex: 0, justifyContent: 'center', alignItems: 'center' }}>
                            <View style={[styles.container, { marginTop: '20%', marginBottom: '8%' }]}>
                                <View style={[styles.titleContainer]}>
                                    <View style={{ paddingLeft: '5%' }}>
                                        <Text style={styles.subtitle}>{dictionary.settings}</Text>
                                        <Text style={styles.title}>
                                            {dictionary.update}{dictionary.password}
                                        </Text>
                                    </View>
                                </View>
                                <SafeAreaView style={{ paddingHorizontal: 15 }}>
                                    <View style={styles.fields}>
                                        <Text style={styles.fieldLabels}>{dictionary.new_password}: </Text>
                                        <TextInput 
                                            style={styles.input} 
                                            secureTextEntry={showPassword} 
                                            value={newPassword} 
                                            onChangeText={setNewPassword} 
                                            placeholder={dictionary.new_password} 
                                            placeholderTextColor='#555555'
                                        />
                                        <Pressable onPress={()=> setShowPassword(!showPassword)}>
                                                <Text style={styles.visiblePassword}>{showPassword ? dictionary.show : dictionary.hide} {dictionary.password}</Text>
                                        </Pressable>
                                        {newPasswordError ? <Text style={styles.errorText}>{newPasswordError}</Text> : null}
                                    </View>
                                    <View style={styles.fields}>
                                        <Text style={styles.fieldLabels}>{dictionary.confirm_new_password}: </Text>
                                        <TextInput 
                                            style={styles.input} 
                                            secureTextEntry={showConfirmPassword} 
                                            value={confirmPassword} 
                                            onChangeText={setConfirmPassword} 
                                            placeholder={dictionary.confirm_new_psw_placeholder} 
                                            placeholderTextColor='#555555'
                                        />
                                        <Pressable onPress={()=> setShowConfirmPassword(!showConfirmPassword)}>
                                            <Text style={styles.visiblePassword}>{showConfirmPassword ? dictionary.show : dictionary.hide} {dictionary.password}</Text>
                                        </Pressable>
                                        {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
                                    </View>
                                    
                                    <Pressable 
                                        style={({ pressed }) => [
                                            styles.trueCenter, 
                                            styles.buttons, 
                                            { opacity: pressed ? 0.5 : 1 }
                                        ]} 
                                        onPress={() => {
                                            updatePassword();
                                        }}
                                    >
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={styles.buttonTexts}>{dictionary.lets_go}</Text>
                                        </View>
                                    </Pressable>
                                </SafeAreaView>
                            </View>
                        </View>
                    </ScrollView>
                </LinearGradient>
        </View>
    );
}