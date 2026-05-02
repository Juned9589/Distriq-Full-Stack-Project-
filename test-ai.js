import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: ["Hello"],
        });
        console.log("SUCCESS:", typeof response.text === 'function' ? response.text() : response.text);
    } catch (error) {
        console.error("ERROR:", error.message || error);
    }
}

test();
