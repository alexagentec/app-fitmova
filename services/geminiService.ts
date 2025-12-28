
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, WorkoutPlan, DietPlan, BMIResult, HealthTip } from "../types";

// Corrected API key initialization to use process.env.API_KEY directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const calculateBMI = (weight: number, height: number): BMIResult => {
  const score = weight / ((height / 100) * (height / 100));
  let category = '';
  let interpretation = '';
  let color = '';

  if (score < 18.5) {
    category = 'Abaixo do Peso';
    interpretation = 'Você está abaixo do peso ideal para sua altura. Foco em nutrição calórica e ganho de massa.';
    color = 'text-blue-400';
  } else if (score < 25) {
    category = 'Peso Ideal';
    interpretation = 'Parabéns! Você está na faixa de peso saudável. Vamos manter e tonificar.';
    color = 'text-emerald-400';
  } else if (score < 30) {
    category = 'Sobrepeso';
    interpretation = 'Você está levemente acima do peso. Exercícios aeróbicos e controle calórico ajudarão.';
    color = 'text-yellow-400';
  } else {
    category = 'Obesidade';
    interpretation = 'Seu IMC indica obesidade. O foco inicial será em condicionamento e perda de gordura sustentável.';
    color = 'text-red-400';
  }

  return { score: Number(score.toFixed(1)), category, interpretation, color };
};

export const generateWorkoutPlan = async (profile: UserProfile): Promise<WorkoutPlan> => {
  const prompt = `Atue como um Master Personal Trainer. Gere um plano de treino detalhado:
    Perfil: ${profile.name}, ${profile.sex}, ${profile.age} anos.
    Objetivo: ${profile.goal} (Nível: ${profile.level}).
    Ambiente: ${profile.environment} (Treino ${profile.environment === 'home_objects' ? 'em casa com objetos domésticos' : profile.environment === 'outdoor' ? 'ao ar livre' : profile.environment === 'bodyweight' ? 'com peso do corpo' : 'em academia'}).
    Restrições: ${profile.injuries || 'Nenhuma'}. Histórico: ${profile.healthHistory}.
    Disponibilidade: ${profile.daysPerWeek} dias/semana, ${profile.timePerWorkout} min/dia.
    
    O plano deve ser criativo e adaptado EXATAMENTE ao ambiente e restrições.`;

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

  return JSON.parse(response.text || '{}');
};

export const generateDietPlan = async (profile: UserProfile): Promise<DietPlan> => {
  const prompt = `Atue como um Nutricionista Esportivo. Sugira um plano alimentar saudável adaptado ao objetivo: ${profile.goal}.
  Perfil: ${profile.weight}kg, ${profile.height}cm, Nível de atividade: ${profile.activityLevel}.
  AVISO: Inclua um aviso de que isso não substitui acompanhamento médico.`;

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

  return JSON.parse(response.text || '{}');
};

export interface ExecutionGuide {
  steps: string[];
  commonMistakes: string[];
  muscleGroups: string[];
  videoSearchUrl: string;
}

export const getExerciseExecution = async (exerciseName: string, profile: UserProfile): Promise<ExecutionGuide> => {
  const prompt = `Explique a execução biomecânica correta de: "${exerciseName}".
  Perfil do aluno: ${profile.injuries}.
  Foque em postura, respiração e erros comuns.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
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

  return JSON.parse(response.text || '{}');
};

export const generateExerciseIllustration = async (exerciseName: string): Promise<string | null> => {
  const prompt = `Professional 3D anatomical fitness avatar performing ${exerciseName}. 
  Muscles highlighted in bright neon blue/orange. Medical style clarity. Solid background.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: "1:1" } }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image generation error:", error);
    return null;
  }
};

// Added missing function used in TipsSection
export const getHealthTips = async (profile: UserProfile, category: 'nutrition' | 'performance'): Promise<HealthTip[]> => {
  const prompt = `Atue como um especialista em ${category === 'nutrition' ? 'Nutrição Esportiva' : 'Performance e Biomecânica'}. 
  Gere 3 dicas práticas e curtas para ${profile.name} (Objetivo: ${profile.goal}, Nível: ${profile.level}).
  As dicas devem ser adaptadas para o ambiente: ${profile.environment}.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
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

  return JSON.parse(response.text || '[]');
};
