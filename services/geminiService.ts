
import { GoogleGenAI, Type } from "@google/genai";
import { MathProblem, NaturalPrompt, ActivityRow, ActivityAnalysis, PersonalityType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const geminiService = {
  async analyzeActivities(activities: ActivityRow[], goal: string, personality: PersonalityType = 'Supportive'): Promise<ActivityAnalysis> {
    const tone = personality === 'Savage' ? 
      "Be ruthless, sarcastic, and insulting. Use heavy slang like a frustrated friend. Use Roman Hindi." : 
      "Act as the world's best motivational speaker and time management expert. Use powerful, wise, and inspiring words that ignite a fire in the user's heart. Talk about 'Kamyabi', 'Junoon', and 'Waqt ki keemat'. Use Roman Hindi (Hinglish).";
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        The user's goal is: "${goal}". 
        Tone instructions: ${tone}. 
        Analyze these activities: ${JSON.stringify(activities)}. 
        
        CRITICAL REQUIREMENT: 
        1. The "summary" field MUST be written in Roman Hindi (Hinglish/WhatsApp style).
        2. The "recommendations" items MUST also be in Roman Hindi.
        
        Example Supportive style: "Bhai, tere andar woh aag hai jo kisi bhi rukawat ko jala sakti hai. Aaj tune thoda waqt ganjwaya hai, par yaad rakh, agla pal teri taqdeer badal sakta hai. Uth aur apna lakshya poora kar!"
        Output strictly in JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            timeWastedMinutes: { type: Type.NUMBER },
            timeSavedMinutes: { type: Type.NUMBER },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            productivityScore: { type: Type.NUMBER }
          },
          required: ["summary", "timeWastedMinutes", "timeSavedMinutes", "recommendations", "productivityScore"]
        }
      }
    });
    return JSON.parse(response.text);
  },

  async validateIntent(intent: string, currentGoal: string, personality: PersonalityType = 'Supportive'): Promise<{ isValid: boolean; feedback: string }> {
    const tone = personality === 'Savage' ? 
      "Be highly skeptical and mock weak excuses in Roman Hindi." : 
      "Be a wise mentor. If the intent is weak, challenge them to be better. If it's good, encourage them with fire. Use Roman Hindi (Hinglish).";
      
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        Goal: "${currentGoal}". 
        User intent: "${intent}". 
        Tone: ${tone}. 
        Analyze if this is productive or procrastination. 
        IMPORTANT: Provide the "feedback" in Roman Hindi (Hinglish).
        Output strictly in JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isValid: { type: Type.BOOLEAN },
            feedback: { type: Type.STRING }
          },
          required: ["isValid", "feedback"]
        }
      }
    });
    return JSON.parse(response.text);
  },

  async generateMathProblem(difficulty: 'easy' | 'medium' | 'hard' = 'medium'): Promise<MathProblem> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a math problem. Difficulty: ${difficulty}. Output strictly in JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            answer: { type: Type.STRING },
            explanation: { type: Type.STRING }
          },
          required: ["question", "answer", "explanation"]
        }
      }
    });
    return JSON.parse(response.text);
  },

  async generateNaturalGrounding(): Promise<NaturalPrompt> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate a short natural grounding exercise. Provide the prompt and guidance in English but with a simple, calm tone. Output strictly in JSON.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            prompt: { type: Type.STRING },
            guidance: { type: Type.STRING }
          },
          required: ["prompt", "guidance"]
        }
      }
    });
    return JSON.parse(response.text);
  }
};
