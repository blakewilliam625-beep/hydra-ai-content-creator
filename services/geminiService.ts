
import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { BrandIdentity, AiModel, HydraResultItem } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable is not set. This may be expected if user selects key at runtime.");
}

const brandBibleSchema = {
  type: Type.OBJECT,
  properties: {
    companyName: {
      type: Type.STRING,
      description: "A creative and memorable name for the company based on its mission."
    },
    logoDescription: {
      type: Type.STRING,
      description: "A detailed, creative prompt for an AI image generator to create a primary logo. It should capture the brand's essence.",
    },
    secondaryMarksDescriptions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "An array of 2-3 descriptive prompts for secondary logos or brand marks (e.g., an icon, a wordmark variation).",
    },
    colorPalette: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "A common, descriptive name for the color (e.g., 'Midnight Blue')." },
          hex: { type: Type.STRING, description: "The hexadecimal code for the color (e.g., '#0A192F')." },
          usage: { type: Type.STRING, description: "The intended use of the color (e.g., 'Primary', 'Accent', 'Text', 'Background')." },
        },
        required: ["name", "hex", "usage"],
      },
      description: "A vibrant and cohesive 5-color palette.",
    },
    fontPairings: {
      type: Type.OBJECT,
      properties: {
        header: { type: Type.STRING, description: "The name of a Google Font for headings." },
        body: { type: Type.STRING, description: "The name of a Google Font for body text." },
      },
      required: ["header", "body"],
    },
  },
  required: ["companyName", "logoDescription", "secondaryMarksDescriptions", "colorPalette", "fontPairings"],
};

export const generateBrandIdentity = async (mission: string): Promise<BrandIdentity> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    You are an expert brand strategist and designer. Based on the following company mission, generate a complete brand identity bible.

    Company Mission: "${mission}"

    Your response must be a valid JSON object that adheres to the provided schema. Do not include any text, code block markers, or explanations outside of the single JSON object.
  `;
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: brandBibleSchema,
    },
  });

  try {
    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);
    return parsedJson as BrandIdentity;
  } catch (error) {
    console.error("Failed to parse Gemini response:", response.text);
    throw new Error("Could not parse the brand identity from the AI response.");
  }
};

export const generateVideo = async (prompt: string, modelId: string, onProgress: (message: string) => void): Promise<string> => {
    if (modelId !== 'google-veo-3.1') {
        throw new Error(`The model '${modelId}' is not yet implemented.`);
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        onProgress("Starting video generation...");
        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt,
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: '16:9'
            }
        });

        onProgress("Processing video... This can take a few minutes.");
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 10000));
            onProgress("Checking video status...");
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!downloadLink) {
            throw new Error("Video generation failed to produce a valid result.");
        }
        
        onProgress("Finalizing and fetching video...");
        const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        if (!videoResponse.ok) {
            throw new Error(`Failed to fetch video data: ${videoResponse.statusText}`);
        }
        const videoBlob = await videoResponse.blob();
        return URL.createObjectURL(videoBlob);

    } catch (error: any) {
        if (error.message?.includes("Requested entity was not found")) {
             throw new Error("API key not found or invalid. Please select a valid API key and try again.");
        }
        console.error("Video generation error:", error);
        throw new Error(error.message || "An unknown error occurred during video generation.");
    }
};

export const generateWithHydraAI = async (prompt: string, allModels: AiModel[], onProgress: (message: string) => void): Promise<HydraResultItem[]> => {
    const modelsToRun = allModels.filter(m => m.type !== 'hydra');

    onProgress(`Hydra AI activated. Engaging ${modelsToRun.length} models simultaneously...`);

    const promises = modelsToRun.map(model => {
        const hydraProgress = (msg: string) => onProgress(`[${model.name}] ${msg}`);
        
        if (model.type === 'brand') {
            return generateBrandIdentity(prompt).then(data => ({ model, data }));
        }
        if (model.type === 'video') {
            return generateVideo(prompt, model.id, hydraProgress).then(data => ({ model, data }));
        }
        return Promise.resolve({ model, error: 'Model type not supported by Hydra.'});
    });

    const results = await Promise.allSettled(promises);

    return results.map((result, index) => {
        const model = modelsToRun[index];
        if (result.status === 'fulfilled') {
            // FIX: Use a type guard to correctly handle the discriminated union for result.value.
            // The original destructuring was incorrect because 'data' and 'error' do not coexist on the same object type.
            const value = result.value;
            if ('error' in value) {
                 return {
                    modelId: model.id,
                    modelName: model.name,
                    type: model.type as 'brand' | 'video',
                    error: value.error,
                };
            }
            return {
                modelId: model.id,
                modelName: model.name,
                type: model.type as 'brand' | 'video',
                data: value.data,
            };
        } else {
            return {
                modelId: model.id,
                modelName: model.name,
                type: model.type as 'brand' | 'video',
                error: result.reason?.message || 'An unknown error occurred.',
            };
        }
    });
};


export const createChat = (): Chat => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
        systemInstruction: "You are a helpful assistant. Keep your answers concise and friendly.",
    },
  });
};