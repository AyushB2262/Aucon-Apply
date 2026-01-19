import { GoogleGenAI } from "@google/genai";
import { GenerateMessageParams, GeneratedResponse } from "../types";
import { GEMINI_MODEL, SYSTEM_INSTRUCTION } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateApplicationMessage = async (params: GenerateMessageParams): Promise<GeneratedResponse> => {
  try {
    const jobTitleContext = params.jobTitle ? `Position Applied For: ${params.jobTitle}` : "Position: General Inquiry";
    
    const prompt = `
    Context: I am applying for a job via WhatsApp.
    
    Recipient Name: ${params.contactName}
    Company: ${params.companyName}
    ${jobTitleContext}
    Job Description/Context: ${params.jobDescription}
    
    Task: 
    1. Search the web for "${params.companyName}" to understand what they do and if there are any recent news or values I should align with.
    2. Search for "${params.jobTitle} at ${params.companyName}" to understand typical requirements if not fully provided.
    3. Write a personalized WhatsApp message to the recipient expressing interest in the role. Mention specific details found about the company to show I've done my research.
    
    Constraints:
    - Keep it friendly, concise (under 100 words), and professional.
    - End with a call to action.
    `;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    // Extract grounding URLs (Search Sources)
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const urls: string[] = chunks
      .map((chunk: any) => chunk.web?.uri)
      .filter((uri: string | undefined): uri is string => !!uri);
    
    // Deduplicate URLs
    const uniqueUrls = [...new Set(urls)];

    return {
      message: response.text || "Error: Could not generate message.",
      groundingUrls: uniqueUrls
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate message. Please check your API key and connection.");
  }
};