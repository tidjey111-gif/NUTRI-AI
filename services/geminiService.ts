import { GoogleGenAI, Type } from "@google/genai";
import { NutritionData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeFood = async (query: string): Promise<NutritionData | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the following food item described in Russian (or any language) and provide nutritional information per serving size implied or standard 100g if not specified.
      
      Food item: "${query}"
      
      If the input is not a food item, return null for all values.
      Provide realistic estimates based on standard nutritional databases.
      Translate the name to Russian for the 'name' field.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Short name of the food in Russian" },
            calories: { type: Type.NUMBER, description: "Total calories (kcal)" },
            protein: { type: Type.NUMBER, description: "Protein content in grams" },
            fat: { type: Type.NUMBER, description: "Fat content in grams" },
            carbs: { type: Type.NUMBER, description: "Carbohydrate content in grams" },
            weight_g: { type: Type.NUMBER, description: "Estimated weight in grams" },
            description: { type: Type.STRING, description: "Short description of the portion size (e.g., '1 среднее яблоко')" },
            is_food: { type: Type.BOOLEAN, description: "True if valid food, false otherwise" }
          },
          required: ["name", "calories", "protein", "fat", "carbs", "weight_g", "is_food"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;

    const data = JSON.parse(text);

    if (!data.is_food) {
      throw new Error("Это не похоже на еду.");
    }

    return {
      name: data.name,
      calories: data.calories,
      protein: data.protein,
      fat: data.fat,
      carbs: data.carbs,
      weight_g: data.weight_g,
      description: data.description
    };

  } catch (error) {
    console.error("Error analyzing food:", error);
    throw error;
  }
};