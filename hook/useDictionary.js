import React, {useState, useEffect} from "react";
import { supabase } from "../config/initSupabase";
import { getTranslations, buildDictionary } from "../util/translation";

export default function useDictionary(){
    const [dictionary, setDictionary] = useState({});
    const [lang, setLang] = useState('');

    
    useEffect(()=>{
        getLang();
      }, [])

    useEffect(()=>{
        const loadDictionary = async() =>{
            if (!lang) return;

            const rows = await getTranslations(lang)
            const dict = buildDictionary(rows, lang);

            setDictionary(dict);
        };
        loadDictionary();
    }, [lang])

    const getLang = async() =>{
        const user = (await supabase.auth.getUser()).data.user;

        if(!user) return;

        const {data, error} = await supabase
        .from('profiles')
        .select('language')
        .eq('id', user?.id)
        .single()

        if(data){
            setLang(data.language);
        }
    }

    return dictionary;
}