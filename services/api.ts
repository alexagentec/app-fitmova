
import { generateWorkoutPlan } from './geminiService';

// IMPORTANTE: Mude esta URL para o seu endereço real quando fizer o deploy do backend no Railway
const API_URL = 'https://seu-backend-no-railway.app/api';

export const apiClient = {
  async generateWorkout(profile: any) {
    // Se a URL for a de exemplo, usamos o fallback local para não travar o app
    if (API_URL.includes('seu-backend-no-railway')) {
      console.warn("Backend não configurado. Usando IA local (Frontend Fallback).");
      return await generateWorkoutPlan(profile);
    }

    try {
      const response = await fetch(`${API_URL}/generate-workout`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'userId': profile.referralCode
        },
        body: JSON.stringify({ profile }),
        // Adicionando timeout para não travar o app se o servidor estiver lento
        signal: AbortSignal.timeout(15000) 
      });

      if (!response.ok) {
        throw new Error('Falha na resposta do servidor');
      }
      return await response.json();
    } catch (error) {
      console.error("Erro no backend, tentando fallback local...", error);
      return await generateWorkoutPlan(profile);
    }
  },

  async createCheckout(planType: string, userId: string) {
    // Simulação de criação de checkout caso o backend não exista
    if (API_URL.includes('seu-backend-no-railway')) {
      return { 
        init_point: 'https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=placeholder' 
      };
    }

    const response = await fetch(`${API_URL}/payments/create-preference`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planType, userId })
    });
    return response.json();
  }
};
