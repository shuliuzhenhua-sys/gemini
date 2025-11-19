import { GoogleGenAI, Content } from "@google/genai";
import { ChatMessage, MessageRole } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

// Safe initialization - we don't want to crash if env is missing, but we can't work without it.
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export const createChatSession = () => {
  if (!apiKey) {
    console.error("API Key is missing.");
    throw new Error("API Key is missing from environment variables.");
  }

  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7, // Balanced creativity
    },
  });
};

export const sendMessageToGemini = async (
  chatSession: any,
  message: string,
  imageContext?: string
): Promise<string> => {
  try {
    let response;
    if (imageContext) {
      // If there is an image, we might need to do a single turn generation or
      // use the chat session if it supports multimodal history properly.
      // For complex flows, sending the image as a 'user' part in the chat history is best.
      
      // The SDK Chat object handles history. We just send the new message.
      // But for the image upload turn, we need to construct the part properly.
      
      // Clean base64 string (remove data:image/png;base64, prefix if present)
      const base64Data = imageContext.split(',')[1] || imageContext;
      
      response = await chatSession.sendMessage({
        message: {
            role: 'user',
            parts: [
                { text: message },
                {
                    inlineData: {
                        mimeType: 'image/jpeg', // Assuming jpeg/png, robust enough usually
                        data: base64Data
                    }
                }
            ]
        }
      });
    } else {
      response = await chatSession.sendMessage({ message });
    }
    
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I encountered an error connecting to the Neural Link. Please try again.";
  }
};

export const generateVisualPreview = async (prompt: string): Promise<string | null> => {
    if (!apiKey) return null;

    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                aspectRatio: '1:1',
                outputMimeType: 'image/jpeg'
            }
        });
        
        const base64Image = response.generatedImages?.[0]?.image?.imageBytes;
        if (base64Image) {
            return `data:image/jpeg;base64,${base64Image}`;
        }
        return null;
    } catch (e) {
        console.error("Image Generation Error:", e);
        // Fallback: Try Flash 2.5 Image if Imagen fails (often distinct quotas)
        // But for this specific "Visual Demo" purpose, we will just return null to UI 
        // and handle error gracefully.
        return null;
    }
}

/**
 * Helper to analyze an image specifically for the "Reverse Engineering" mode first step
 * Using a fresh stateless call to ensure clean context or use the main chat.
 * We will use the main chat to keep history.
 */