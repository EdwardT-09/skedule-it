// import 'dotenv/config';
import {GoogleGenAI} from '@google/genai';


export const ai = new GoogleGenAI({apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY});

