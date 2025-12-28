
const API_URL = 'https://seu-backend-no-railway.app/api';

export const apiClient = {
  async generateWorkout(profile: any) {
    const response = await fetch(`${API_URL}/generate-workout`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'userId': profile.referralCode // Usando código como ID temporário
      },
      body: JSON.stringify({ profile })
    });
    if (!response.ok) throw new Error('Falha na assinatura');
    return response.json();
  },

  async createCheckout(planType: string, userId: string) {
    // Rota que geraria o link de pagamento do Mercado Pago
    const response = await fetch(`${API_URL}/payments/create-preference`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planType, userId })
    });
    return response.json();
  }
};
