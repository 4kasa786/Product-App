//This is a test file for the Gemini API using the Google Generative AI library.

import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const testGemini = async () => {
    try {
        console.log('Testing Gemini API...');

        // Debug: Check if API key is loaded
        console.log('API Key loaded:', process.env.GEMINI_API_KEY ? 'Yes' : 'No');
        console.log('API Key length:', process.env.GEMINI_API_KEY?.length || 0);
        console.log('API Key starts with:', process.env.GEMINI_API_KEY?.substring(0, 10) + '...');

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        // Use the correct model name
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent("Say hello");
        console.log('Success:', result.response.text());
    } catch (error) {
        console.error('Error:', error.message);
    }
};

testGemini();