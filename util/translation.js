import { supabase } from "../config/initSupabase";


export const getTranslations = async(lang) =>{

    const {data, error} = await supabase
        .from('dictionary')
        .select(`name, ${lang}`)

    if(data){
        return data;
    }


}

export const buildDictionary = (rows, lang) => {

    const dict = {};

    rows.map((row)=>{
        dict[row.name] = row[lang];

    })

    return dict

}