import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { GeneratedRecipe, Language, PantryItemAnalysis } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenerativeAI(process.env.API_KEY || '');

const RECIPE_SCHEMA = {
  type: SchemaType.OBJECT,
  properties: {
    title: { type: SchemaType.STRING },
    description: { type: SchemaType.STRING },
    ingredients: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING }
    },
    instructions: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING }
    },
    calories: { type: SchemaType.NUMBER },
    prepTimeMinutes: { type: SchemaType.NUMBER },
    cuisine: { type: SchemaType.STRING },
    mealType: { type: SchemaType.STRING },
    difficulty: { type: SchemaType.STRING, enum: ["Easy", "Medium", "Hard"] },
    servings: { type: SchemaType.NUMBER },
    tips: { 
      type: SchemaType.ARRAY, 
      items: { type: SchemaType.STRING },
      description: "Short, helpful chef tips or substitutions"
    }
  },
  required: ["title", "description", "ingredients", "instructions", "calories", "prepTimeMinutes", "difficulty", "servings"]
};

// Schema for Pantry Analysis
const PANTRY_ITEM_SCHEMA = {
  type: SchemaType.OBJECT,
  properties: {
    name: { type: SchemaType.STRING },
    quantity: { type: SchemaType.NUMBER },
    unit: { type: SchemaType.STRING },
    expiryDate: { type: SchemaType.STRING, description: "YYYY-MM-DD or null if not found" },
    category: { type: SchemaType.STRING, enum: ["produce", "dairy", "protein", "pantry", "other"] }
  },
  required: ["name", "quantity", "unit", "category"]
};

export const generateRecipeFromIngredients = async (
  ingredients: string[], 
  language: Language,
  filters?: { cuisine?: string, mealType?: string, mood?: string }
): Promise<GeneratedRecipe | null> => {
  if (!process.env.API_KEY) {
    console.error("API Key missing");
    // Return mock for demo if no key
    return {
      id: 'mock-id-' + Date.now(),
      title: "Avocado & Egg Toast (Mock)",
      description: "A quick mock recipe because API Key is missing.",
      ingredients: ["Avocado", "Bread", "Egg"],
      instructions: ["Toast bread", "Mash avocado", "Fry egg", "Combine"],
      calories: 350,
      prepTimeMinutes: 10,
      cuisine: 'European',
      mealType: 'Breakfast',
      difficulty: 'Easy',
      servings: 1,
      tips: ["Add some chili flakes for heat!", "Use sourdough for better texture."],
      createdAt: new Date().toLocaleDateString()
    };
  }

  try {
    const langInstruction = language === 'ru' ? 'Respond in Russian.' : 'Respond in English.';
    
    let prompt = `Create a healthy, delicious recipe using these ingredients: ${ingredients.join(', ')}. 
    You can assume basic pantry staples (oil, salt, pepper) are available. 
    Focus on a meal suitable for a woman's nutritional needs.`;

    if (filters?.mealType && filters.mealType !== 'Any') {
      prompt += ` The meal must be a ${filters.mealType}.`;
    }

    if (filters?.cuisine && filters.cuisine !== 'Any') {
      prompt += ` The recipe must be in the style of ${filters.cuisine} cuisine.`;
    }
    
    if (filters?.mood && filters.mood !== 'Any') {
      prompt += ` The recipe should fit a "${filters.mood}" mood/occasion.`;
    }

    prompt += ` ${langInstruction}`;

    const model = ai.getGenerativeModel({ 
      model: 'gemini-pro',
      systemInstruction: `You are a world-class nutritionist and chef designed to help women cook healthy meals easily. 
        Provide 2-3 helpful tips (substitutions, nutritional benefits) in the 'tips' field.
        If the cuisine is Central Asian (Uzbek, Tajik, etc.), suggest an adapted healthier version if traditional versions are too heavy, 
        but keep the authentic flavor profile. ${langInstruction}`
    });
    
    const response = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: RECIPE_SCHEMA,
      }
    });

    const text = response.response.text();
    if (!text) return null;
    
    const parsed = JSON.parse(text) as GeneratedRecipe;
    parsed.id = Date.now().toString(); // Add local ID
    parsed.createdAt = new Date().toLocaleDateString();
    return parsed;

  } catch (error) {
    console.error("Gemini Recipe Error:", error);
    return null;
  }
};

export const generateDishImage = async (title: string, ingredients: string[]): Promise<string | null> => {
  if (!process.env.API_KEY) return null;

  try {
    const prompt = `A professional food photography shot of a dish called "${title}". 
    The dish MUST visibly contain these ingredients: ${ingredients.join(', ')}.
    High resolution, appetizing, soft lighting, 4k, overhead or 45-degree angle view, restaurant quality.`;

    const model = ai.getGenerativeModel({ model: 'gemini-pro' });
    
    const response = await model.generateContent([
      prompt
    ]);

    // Check for inline data in parts
    const result = response.response;
    if (result.candidates?.[0]?.content?.parts) {
      for (const part of result.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const mimeType = part.inlineData.mimeType || 'image/png';
          return `data:${mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Image Gen Error:", error);
    return null;
  }
};

export const identifyPantryItem = async (base64Image: string, language: Language): Promise<PantryItemAnalysis | null> => {
  if (!process.env.API_KEY) return null;

  try {
    // Remove data URL prefix if present for API consumption
    const base64Data = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");
    
    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Data
      }
    };

    const prompt = `Identify the food product in this image. 
    If you see a barcode or text on packaging, use it to identify the item name accurately.
    Estimate quantity (e.g. 1 for a pack/bottle, or grams if visible).
    Suggest a unit (pcs, g, kg, ml, l, cup, pack).
    If an expiration date is clearly visible on the packaging, extract it (YYYY-MM-DD). If not, leave expiryDate null.
    Categorize into: produce, dairy, protein, pantry, other.
    ${language === 'ru' ? 'Return the name in Russian.' : 'Return the name in English.'}`;

    const model = ai.getGenerativeModel({ model: 'gemini-pro' });
    
    const response = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [imagePart, { text: prompt }]
      }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: PANTRY_ITEM_SCHEMA
      }
    });

    const text = response.response.text();
    if (!text) return null;
    return JSON.parse(text) as PantryItemAnalysis;

  } catch (error) {
    console.error("Pantry Scan Error:", error);
    return null;
  }
};

export const streamChatResponse = async function* (
  history: { role: string; parts: { text: string }[] }[],
  newMessage: string,
  language: Language
) {
  if (!process.env.API_KEY) {
    yield "I'm sorry, I cannot connect to the AI service right now (Missing API Key).";
    return;
  }

  try {
    const langInstruction = language === 'ru' ? 'Respond in Russian.' : 'Respond in English.';
    
    const model = ai.getGenerativeModel({
      model: 'gemini-pro',
      systemInstruction: `You are a friendly, supportive AI Chef and Nutritionist for a women's health app. Keep answers concise, encouraging, and helpful. You help with ingredient substitutions, cooking tips, and quick healthy snack ideas. ${langInstruction}`
    });
    
    // Filter history to ensure it starts with 'user' role
    const filteredHistory = history.filter((msg, index) => {
      if (index === 0) return msg.role === 'user';
      return true;
    });
    
    const chat = model.startChat({ history: filteredHistory });

    const result = await chat.sendMessageStream(newMessage);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        yield chunkText;
      }
    }
  } catch (error) {
    console.error("Chat Error:", error);
    yield "I'm having a little trouble thinking right now. Please try again.";
  }
};
