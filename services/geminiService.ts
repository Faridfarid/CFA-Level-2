
import { GoogleGenAI, Type } from "@google/genai";
import { Vignette, CFATopic } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const sanitize = (obj: any): any => {
  if (typeof obj === 'string') {
    // We only remove ** if they are not part of a table structure.
    // However, the user specifically asked to remove ** signs.
    // If we remove them, ReactMarkdown won't bold, which is what they want.
    return obj.replace(/\*\*/g, '');
  }
  if (Array.isArray(obj)) return obj.map(sanitize);
  if (obj !== null && typeof obj === 'object') {
    const newObj: any = {};
    for (const key in obj) {
      newObj[key] = sanitize(obj[key]);
    }
    return newObj;
  }
  return obj;
};

export const generateVignette = async (topic: CFATopic): Promise<Vignette> => {
  const ai = getAI();
  const prompt = `Generate a high-quality CFA Level 2 style vignette for the topic: ${topic}.

The vignette context should be a professional case study (400-600 words).
IMPORTANT: For any financial data, ratios, or balance sheet info, you MUST use standard GitHub Flavored Markdown (GFM) tables.

Table Rules:
1. Every table must be preceded by a label like "Exhibit 1: [Description]".
2. Tables must use the pipe and hyphen syntax:
   | Column 1 | Column 2 |
   |----------|----------|
   | Data 1   | Data 2   |
3. Ensure there is a blank line BEFORE and AFTER every table.
4. Do NOT use plain text spaces to align columns; use the pipe syntax properly.

Question Rules:
- Create 3 multiple-choice questions (A, B, C).
- Level 2 questions should be vignette-based (Item Set format).
- Focus on calculation, application, and analysis.
- Provide a detailed explanation for each correct answer and why the distractors are incorrect.

NO MARKDOWN BOLDING: Do not use double asterisks (**) for bolding text in paragraphs or questions. Use plain text for emphasis or capitalization if needed.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          topic: { type: Type.STRING },
          context: { type: Type.STRING, description: "The full case study context with GFM tables for financial exhibits." },
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                questionText: { type: Type.STRING },
                options: {
                  type: Type.OBJECT,
                  properties: {
                    A: { type: Type.STRING },
                    B: { type: Type.STRING },
                    C: { type: Type.STRING }
                  },
                  required: ["A", "B", "C"]
                },
                correctAnswer: { type: Type.STRING, enum: ["A", "B", "C"] },
                explanation: { type: Type.STRING }
              },
              required: ["id", "questionText", "options", "correctAnswer", "explanation"]
            }
          }
        },
        required: ["title", "topic", "context", "questions"]
      }
    }
  });

  const result = JSON.parse(response.text || "{}");
  return sanitize(result) as Vignette;
};
