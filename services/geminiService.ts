
import { GoogleGenAI } from "@google/genai";
import { Tone } from "../types";

const apiKey = process.env.API_KEY;
if (!apiKey) {
    // This will be caught by the environment, but it's good practice
    // to have a check for development or debugging purposes.
    console.error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export const generateReply = async (emailContent: string, tone: Tone): Promise<string> => {
    if (!apiKey) {
        return "Error: API_KEY is not configured. Please ensure the API key is set in the environment variables.";
    }
    
    if (!emailContent.trim()) {
        return "Please provide the content of the email you received.";
    }

    const model = 'gemini-2.5-flash';
    
    const systemInstruction = `You are a highly proficient AI assistant specialized in professional communication. Your task is to analyze the provided email content and draft a suitable, professional reply based on the specified tone. The reply should be ready to send. Do not include any headers like "Subject:" or greetings like "Hi [Name]," unless it is essential for the context. Just provide the body of the reply. Ensure the reply is coherent, contextually appropriate, and maintains the requested tone throughout.`;

    const prompt = `
---INCOMING EMAIL---
${emailContent}
---END OF INCOMING EMAIL---

---INSTRUCTIONS---
Tone for reply: ${tone}
Draft a professional email reply based on the incoming email.
`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.7,
                topP: 1,
                topK: 32,
            }
        });
        
        return response.text;
    } catch (error) {
        console.error("Error generating reply:", error);
        if (error instanceof Error) {
            return `An error occurred while generating the reply: ${error.message}. Please check the console for more details.`;
        }
        return "An unknown error occurred while generating the reply.";
    }
};
