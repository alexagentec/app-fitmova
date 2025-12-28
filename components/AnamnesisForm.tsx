
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface AnamnesisFormProps {
  onSubmit: (profile: UserProfile) => void;
}

export const AnamnesisForm: React.FC<AnamnesisFormProps> = ({ onSubmit }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<UserProfile>({
    name: '',
    whatsapp: '',
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
    indirectCount: 0,
    currentCareerLevel: 'START',
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
            <h2 className="text-3xl font-bold text-white">Dados de Acesso</h2>
            <p className="text-slate-400">Suas informações para contato e rede.</p>
            
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Nome Completo</label>
                <input type="text" className={inputClass} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Como quer ser chamado?" required />
              </div>

              <div>
                <label className={labelClass}>WhatsApp (Com DDD)</label>
                <div className="relative">
                  <input 
                    type="tel" 
                    className={`${inputClass} pl-12`} 
                    value={formData.whatsapp} 
                    onChange={e => setFormData({...formData, whatsapp: e.target.value.replace(/\D/g, '')})} 
                    placeholder="11999999999" 
                    required 
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42 1.56 1.56 2.42 3.63 2.42 5.82 0 4.54-3.7 8.24-8.24 8.24-1.54 0-3.05-.43-4.36-1.24l-.31-.19-3.24.85.86-3.15-.21-.34A8.221 8.221 0 013.82 11.9c0-4.54 3.7-8.24 8.24-8.24m-3.95 3.1c-.22 0-.45.03-.64.22-.2.19-.77.75-.77 1.83s.78 2.11.89 2.26c.11.15 1.53 2.34 3.71 3.28.52.22.92.35 1.24.45.52.17.99.14 1.36.09.42-.06 1.28-.53 1.46-1.03.18-.51.18-.94.13-1.03-.05-.09-.19-.14-.39-.24-.21-.11-1.28-.63-1.48-.7-.2-.07-.34-.11-.49.11-.15.22-.59.75-.72.91-.13.16-.27.18-.47.07-.2-.11-.84-.31-1.61-.99-.6-.53-1-1.19-1.12-1.39-.13-.21-.01-.32.09-.42.09-.09.21-.24.31-.36.1-.12.13-.21.2-.35.07-.14.03-.26-.01-.36-.05-.1-.49-1.18-.67-1.62-.18-.43-.36-.37-.49-.37z"/></svg>
                  </div>
                </div>
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
            </div>
            <button type="button" onClick={nextStep} className="w-full bg-emerald-600 py-4 rounded-xl font-bold mt-4 hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-900/40">Próximo Passo</button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-3xl font-bold text-white">Objetivo & Nível</h2>
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
                <label className={labelClass}>Atividade Diária</label>
                <select className={inputClass} value={formData.activityLevel} onChange={e => setFormData({...formData, activityLevel: e.target.value as any})}>
                  <option value="sedentario">Sedentário</option>
                  <option value="leve">Leve (1-2x semana)</option>
                  <option value="moderado">Moderado (3-5x semana)</option>
                  <option value="intenso">Intenso (Todo dia)</option>
                  <option value="atleta">Atleta (Performance)</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4">
              <button type="button" onClick={prevStep} className="flex-1 bg-slate-800 py-4 rounded-xl font-bold text-white">Voltar</button>
              <button type="button" onClick={nextStep} className="flex-1 bg-emerald-600 py-4 rounded-xl font-bold text-white">Próximo</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-3xl font-bold text-white">Ambiente & Saúde</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Onde vai treinar?</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className={cardSelectClass(formData.environment, 'gym')} onClick={() => setFormData({...formData, environment: 'gym'})}>🏋️ Academia</div>
                  <div className={cardSelectClass(formData.environment, 'home_objects')} onClick={() => setFormData({...formData, environment: 'home_objects'})}>🏠 Casa</div>
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
              <button type="button" onClick={prevStep} className="flex-1 bg-slate-800 py-4 rounded-xl font-bold text-white">Voltar</button>
              <button type="submit" className="flex-1 bg-emerald-600 py-4 rounded-xl font-bold hover:shadow-emerald-500/20 shadow-xl text-white">Finalizar</button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
