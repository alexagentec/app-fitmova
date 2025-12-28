
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, WorkoutPlan, DietPlan, BMIResult, HealthTip } from "../types";

// Inicialização segura com a chave de ambiente
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const cleanJSONResponse = (text: string) => {
  // Remove possíveis markdown de código que a IA costuma retornar
  return text.replace(/```json|```/g, '').trim();
};

// Exportando a interface ExecutionGuide para ser usada em componentes
export interface ExecutionGuide {
  steps: string[];
  commonMistakes: string[];
  muscleGroups: string[];
  videoSearchUrl: string;
}

export const calculateBMI = (weight: number, height: number): BMIResult => {
  const score = weight / ((height / 100) * (height / 100));
  let category = '';
  let interpretation = '';
  let color = '';

  if (score < 18.5) {
    category = 'Abaixo do Peso';
    interpretation = 'Foco em nutrição calórica e ganho de massa.';
    color = 'text-blue-400';
  } else if (score < 25) {
    category = 'Peso Ideal';
    interpretation = 'Parabéns! Você está na faixa de peso saudável.';
    color = 'text-emerald-400';
  } else if (score < 30) {
    category = 'Sobrepeso';
    interpretation = 'Exercícios aeróbicos e controle calórico ajudarão.';
    color = 'text-yellow-400';
  } else {
    category = 'Obesidade';
    interpretation = 'O foco inicial será em condicionamento e perda de gordura.';
    color = 'text-red-400';
  }

  return { score: Number(score.toFixed(1)), category, interpretation, color };
};

export const generateWorkoutPlan = async (profile: UserProfile): Promise<WorkoutPlan> => {
  const prompt = `Atue como um Master Personal Trainer. Gere um plano de treino detalhado em JSON:
    Perfil: ${profile.name}, Objetivo: ${profile.goal}, Ambiente: ${profile.environment}.
    Disponibilidade: ${profile.daysPerWeek} dias/semana, ${profile.timePerWorkout} min/dia.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          planName: { type: Type.STRING },
          level: { type: Type.STRING },
          environment: { type: Type.STRING },
          weeklySchedule: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.STRING },
                focus: { type: Type.STRING },
                exercises: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      sets: { type: Type.STRING },
                      reps: { type: Type.STRING },
                      rest: { type: Type.STRING },
                      instructions: { type: Type.STRING },
                      targetMuscles: { type: Type.ARRAY, items: { type: Type.STRING } },
                      safetyNotes: { type: Type.STRING }
                    },
                    required: ["name", "sets", "reps", "instructions", "targetMuscles"]
                  }
                }
              },
              required: ["day", "focus", "exercises"]
            }
          },
          generalAdvice: { type: Type.STRING }
        },
        required: ["planName", "level", "environment", "weeklySchedule", "generalAdvice"]
      }
    }
  });

  try {
    const rawText = response.text || '{}';
    return JSON.parse(cleanJSONResponse(rawText));
  } catch (e) {
    console.error("Erro no parse do JSON do treino:", e);
    throw new Error("Resposta da IA inválida");
  }
};

export const generateDietPlan = async (profile: UserProfile): Promise<DietPlan> => {
  const prompt = `Sugira um plano alimentar saudável para o objetivo: ${profile.goal}. Perfil: ${profile.weight}kg, ${profile.height}cm.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          objective: { type: Type.STRING },
          dailyCaloriesHint: { type: Type.STRING },
          meals: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING },
                mealName: { type: Type.STRING },
                items: { type: Type.ARRAY, items: { type: Type.STRING } },
                substitutions: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["time", "mealName", "items"]
            }
          },
          generalTips: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["objective", "meals", "generalTips"]
      }
    }
  });

  try {
    return JSON.parse(cleanJSONResponse(response.text || '{}'));
  } catch (e) {
    throw new Error("Erro no parse da dieta");
  }
};

export const getHealthTips = async (profile: UserProfile, category: 'nutrition' | 'performance'): Promise<HealthTip[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Dicas de ${category} para ${profile.goal}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING }
          },
          required: ["title", "content"]
        }
      }
    }
  });
  return JSON.parse(cleanJSONResponse(response.text || '[]'));
};

// Adicionando o tipo de retorno explicitamente
export const getExerciseExecution = async (exerciseName: string, profile: UserProfile): Promise<ExecutionGuide> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Como executar: ${exerciseName}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          steps: { type: Type.ARRAY, items: { type: Type.STRING } },
          commonMistakes: { type: Type.ARRAY, items: { type: Type.STRING } },
          muscleGroups: { type: Type.ARRAY, items: { type: Type.STRING } },
          videoSearchUrl: { type: Type.STRING }
        },
        required: ["steps", "commonMistakes", "muscleGroups", "videoSearchUrl"]
      }
    }
  });
  return JSON.parse(cleanJSONResponse(response.text || '{}'));
};

export const generateExerciseIllustration = async (exerciseName: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: `Fitness exercise illustration: ${exerciseName}` }] },
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
    return null;
  } catch { return null; }
};
