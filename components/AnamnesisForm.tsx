
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface AnamnesisFormProps {
  onSubmit: (profile: UserProfile) => void;
}

export const AnamnesisForm: React.FC<AnamnesisFormProps> = ({ onSubmit }) => {
  const [step, setStep] = useState(1);
  // Initializing formData with all required fields of UserProfile.
  // Fix: Added missing referralCode, balance, referralCount, network, and transactions fields to satisfy UserProfile interface.
  const [formData, setFormData] = useState<UserProfile>({
    name: '',
    age: 25,
    sex: 'Masculino',
    weight: 70,
    height: 170,
    activityLevel: 'moderado',
    healthHistory: '',
    injuries: '',
    inactivityTime: 'Mais de 6 meses',
    goal: 'health',
    level: 'iniciante',
    environment: 'gym',
    daysPerWeek: 3,
    timePerWorkout: 45,
    subscriptionTier: 'free',
    referralCode: '',
    balance: 0,
    referralCount: 0,
    network: [],
    transactions: []
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClass = "w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all";
  const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2";
  const cardSelectClass = (current: string, value: string) => 
    `flex-1 p-4 rounded-2xl border-2 transition-all cursor-pointer text-center ${
      current === value ? 'border-emerald-500 bg-emerald-500/10 text-white' : 'border-slate-800 bg-slate-900 text-slate-400'
    }`;

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <div className="mb-8 flex justify-between items-center">
        {[1, 2, 3].map(i => (
          <div key={i} className={`h-1.5 flex-1 rounded-full mx-1 ${step >= i ? 'bg-emerald-500' : 'bg-slate-800'}`} />
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-3xl font-bold">Dados Básicos</h2>
            <p className="text-slate-400">Primeiro, conte-nos quem você é.</p>
            
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Nome Completo</label>
                <input type="text" className={inputClass} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Idade</label>
                  <input type="number" className={inputClass} value={formData.age} onChange={e => setFormData({...formData, age: Number(e.target.value)})} />
                </div>
                <div>
                  <label className={labelClass}>Sexo</label>
                  <select className={inputClass} value={formData.sex} onChange={e => setFormData({...formData, sex: e.target.value as any})}>
                    <option>Masculino</option>
                    <option>Feminino</option>
                    <option>Outro</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Peso (kg)</label>
                  <input type="number" step="0.1" className={inputClass} value={formData.weight} onChange={e => setFormData({...formData, weight: Number(e.target.value)})} />
                </div>
                <div>
                  <label className={labelClass}>Altura (cm)</label>
                  <input type="number" className={inputClass} value={formData.height} onChange={e => setFormData({...formData, height: Number(e.target.value)})} />
                </div>
              </div>
            </div>
            <button type="button" onClick={nextStep} className="w-full bg-emerald-600 py-4 rounded-xl font-bold mt-4 hover:bg-emerald-500 transition-colors">Próximo Passo</button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-3xl font-bold">Objetivo & Nível</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Nível Atual</label>
                <div className="flex gap-2">
                  {['iniciante', 'intermediario', 'avancado'].map(v => (
                    <div key={v} className={cardSelectClass(formData.level, v)} onClick={() => setFormData({...formData, level: v as any})}>
                      <span className="capitalize">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>Meta Principal</label>
                <select className={inputClass} value={formData.goal} onChange={e => setFormData({...formData, goal: e.target.value as any})}>
                  <option value="health">Saúde Geral</option>
                  <option value="weight_loss">Emagrecimento</option>
                  <option value="hypertrophy">Hipertrofia (Músculos)</option>
                  <option value="endurance">Resistência</option>
                  <option value="rehabilitation">Reabilitação</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Frequência Cardíaca/Atividade</label>
                <select className={inputClass} value={formData.activityLevel} onChange={e => setFormData({...formData, activityLevel: e.target.value as any})}>
                  <option value="sedentario">Sedentário (Pouco movimento)</option>
                  <option value="leve">Leve (1-2x semana)</option>
                  <option value="moderado">Moderado (3-5x semana)</option>
                  <option value="intenso">Intenso (Todo dia)</option>
                  <option value="atleta">Atleta (Performance)</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4">
              <button type="button" onClick={prevStep} className="flex-1 bg-slate-800 py-4 rounded-xl font-bold">Voltar</button>
              <button type="button" onClick={nextStep} className="flex-1 bg-emerald-600 py-4 rounded-xl font-bold">Próximo</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-3xl font-bold">Ambiente & Saúde</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Onde vai treinar?</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className={cardSelectClass(formData.environment, 'gym')} onClick={() => setFormData({...formData, environment: 'gym'})}>🏋️ Academia</div>
                  <div className={cardSelectClass(formData.environment, 'home_objects')} onClick={() => setFormData({...formData, environment: 'home_objects'})}>🏠 Casa (C/ Objetos)</div>
                  <div className={cardSelectClass(formData.environment, 'outdoor')} onClick={() => setFormData({...formData, environment: 'outdoor'})}>🌳 Ar Livre</div>
                  <div className={cardSelectClass(formData.environment, 'bodyweight')} onClick={() => setFormData({...formData, environment: 'bodyweight'})}>💪 Peso do Corpo</div>
                </div>
              </div>

              <div>
                <label className={labelClass}>Restrições ou Lesões</label>
                <input type="text" placeholder="Ex: Dor no joelho, hérnia..." className={inputClass} value={formData.injuries} onChange={e => setFormData({...formData, injuries: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Dias/Semana</label>
                  <input type="number" min="1" max="7" className={inputClass} value={formData.daysPerWeek} onChange={e => setFormData({...formData, daysPerWeek: Number(e.target.value)})} />
                </div>
                <div>
                  <label className={labelClass}>Tempo (min)</label>
                  <input type="number" className={inputClass} value={formData.timePerWorkout} onChange={e => setFormData({...formData, timePerWorkout: Number(e.target.value)})} />
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button type="button" onClick={prevStep} className="flex-1 bg-slate-800 py-4 rounded-xl font-bold">Voltar</button>
              <button type="submit" className="flex-1 bg-emerald-600 py-4 rounded-xl font-bold hover:shadow-emerald-500/20 shadow-xl">Finalizar</button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
