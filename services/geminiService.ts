
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, FertilizerRecommendation, GrassType, SoilType, LawnCondition } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getFertilizerRecommendation = async (profile: UserProfile): Promise<FertilizerRecommendation> => {
  const prompt = `
    As a world-class lawn care expert, provide a specific fertilizer recommendation for the following user:
    - Grass Type: ${profile.grassType}
    - Soil Type: ${profile.soilType}
    - Current Condition: ${profile.condition}
    - Location: ${profile.location ? `Lat ${profile.location.lat}, Lng ${profile.location.lng}` : 'Unknown'}
    - Last Fertilized: ${profile.lastFertilized || 'Never recorded'}
    - Current Date: ${new Date().toLocaleDateString()}

    Consider the current season and environmental runoff prevention.
    Suggest a specific N-P-K ratio and an application window.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          productName: { type: Type.STRING, description: 'Generic or specific name of fertilizer' },
          npkRatio: { type: Type.STRING, description: 'The N-P-K ratio e.g., 24-0-10' },
          applicationRate: { type: Type.STRING, description: 'How much to apply' },
          timing: { type: Type.STRING, description: 'Best time of day or weather window' },
          bestPractices: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: 'List of 3-4 tips for this specific application'
          },
          reasoning: { type: Type.STRING, description: 'Expert explanation' },
          nextStepDate: { type: Type.STRING, description: 'ISO date for next application reminder' }
        },
        required: ["productName", "npkRatio", "applicationRate", "timing", "bestPractices", "reasoning", "nextStepDate"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateLawnVisualization = async (profile: UserProfile): Promise<string | null> => {
  const prompt = `A professional photorealistic high-angle shot of a lush ${profile.grassType} home lawn in a suburban backyard. The condition is currently ${profile.condition}. Vibrant green, perfectly manicured, natural sunlight.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image generation failed:", error);
    return null;
  }
};
