import { GoogleGenAI } from "@google/genai";
import { GEMINI_MODEL_FLASH } from "../constants";

let aiClient: GoogleGenAI | null = null;

// Initialize the client strictly with process.env.API_KEY
const getAiClient = () => {
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return aiClient;
};

export const solveMathProblem = async (problem: string): Promise<string> => {
  if (!problem.trim()) return "";

  try {
    const ai = getAiClient();
    const model = GEMINI_MODEL_FLASH;

    const prompt = `
      You are an expert mathematician and calculator assistant.
      
      User Request: "${problem}"
      
      Instructions:
      1. Solve the math problem step-by-step.
      2. If it is a simple arithmetic expression, just provide the result.
      3. If it is a complex word problem or advanced calculus/algebra, explain the steps briefly and clearly.
      4. Format the final answer clearly at the end.
      5. Use Markdown for formatting (bold, code blocks for equations).
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: "You are a precise and helpful math tutor.",
        temperature: 0.2, // Low temperature for precision
      }
    });

    return response.text || "Could not generate a solution.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error: Unable to connect to AI service. Please check your API key or network connection.";
  }
};
