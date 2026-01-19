import { GoogleGenAI } from "@google/genai";
import { GenerateMessageParams } from "../types";
import { GEMINI_MODEL, SYSTEM_INSTRUCTION } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateApplicationMessage = async (params: GenerateMessageParams): Promise<string> => {
  try {
    const prompt = `
    Context: I am applying for a job via WhatsApp.
    
    Recipient Name: ${params.contactName}
    Company: ${params.companyName}
    Job Description: ${params.jobDescription}
    
    Task: Write a personalized WhatsApp message to the recipient expresssing interest in the role. 
    Keep it friendly, concise, and professional. 
    `;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        maxOutputTokens: 200,
      },
    });

    return response.text || "Error: Could not generate message.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate message. Please check your API key and connection.");
  }
};
