
import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Middleware Simples de Verificação
const checkActive = (req: any, res: any, next: any) => {
  // Em produção, aqui você buscaria no Banco de Dados
  const { userId } = req.headers; 
  // Simulação: se não houver ID, tratamos como inativo para exemplo
  if (!userId) return res.status(403).json({ error: "Assinatura Inativa" });
  next();
};

// Rota para Gerar Treino (Protegida)
app.post('/api/generate-workout', checkActive, async (req, res) => {
  try {
    const { profile } = req.body;
    // Fix: Always use ai.models.generateContent directly with the model name and prompt.
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Gere um plano de treino para ${profile.name}, objetivo ${profile.goal}...`
    });
    
    // Fix: Access the generated text using the .text property (not a method).
    res.json(JSON.parse(response.text || '{}'));
  } catch (error) {
    res.status(500).json({ error: "Erro ao processar IA" });
  }
});

// Endpoint para Webhook do Mercado Pago
app.post('/api/webhooks/mercadopago', async (req, res) => {
  const { action, data } = req.body;
  if (action === "payment.created") {
    // 1. Verificar se o pagamento foi aprovado via API do Mercado Pago
    // 2. Buscar usuário pelo ID enviado no external_reference
    // 3. Atualizar campo isActive = true no Banco de Dados
    console.log("Pagamento Recebido:", data.id);
  }
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor Fitmova rodando na porta ${PORT}`));
