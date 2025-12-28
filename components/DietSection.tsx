
import React, { useState, useEffect } from 'react';
import { UserProfile, DietPlan } from '../types';
import { generateDietPlan } from '../services/geminiService';

interface DietSectionProps {
  profile: UserProfile;
}

export const DietSection: React.FC<DietSectionProps> = ({ profile }) => {
  const [diet, setDiet] = useState<DietPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiet = async () => {
      setLoading(true);
      try {
        const data = await generateDietPlan(profile);
        setDiet(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDiet();
  }, [profile]);

  if (loading) return (
    <div className="py-20 flex flex-col items-center">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-slate-500">Calculando necessidades nutricionais...</p>
    </div>
  );

  if (!diet) return <div className="text-center p-10 text-slate-500">Não foi possível carregar as sugestões.</div>;

  const isFree = profile.subscriptionTier === 'free';
  const displayMeals = isFree ? diet.meals.slice(0, 3) : diet.meals;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-orange-500/20 rounded-3xl p-8">
        <h3 className="text-2xl font-bold text-orange-400 mb-2">Plano Sugestivo: {diet.objective}</h3>
        <p className="text-slate-400 text-sm">
          {isFree ? 'Geral: Estimativa baseada no seu perfil.' : `Aproximadamente ${diet.dailyCaloriesHint} por dia.`}
        </p>
        <div className="mt-4 p-4 bg-orange-500/10 rounded-xl border border-orange-500/20 text-xs text-orange-200">
          ⚠️ <strong>AVISO:</strong> Estas sugestões são apenas informativas e não substituem o acompanhamento de um nutricionista profissional.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayMeals.map((meal, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-orange-500/30 transition-all group">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-orange-500 tracking-widest uppercase">{meal.time}</span>
              <h4 className="font-bold text-white text-lg">{meal.mealName}</h4>
            </div>
            <ul className="space-y-2 mb-4">
              {meal.items.map((item, i) => (
                <li key={i} className="flex gap-2 text-slate-400 text-sm items-center">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
            {!isFree && meal.substitutions && meal.substitutions.length > 0 && (
              <div className="pt-4 border-t border-slate-800">
                <p className="text-[10px] text-slate-600 font-bold mb-2 uppercase tracking-widest">Opções de Troca</p>
                <div className="flex flex-wrap gap-2">
                  {meal.substitutions.map((sub, sIdx) => (
                    <span key={sIdx} className="px-2 py-1 bg-slate-800 rounded text-[10px] text-slate-500">{sub}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        
        {isFree && (
          <div className="bg-slate-900/50 border border-dashed border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center mb-3">
               <svg className="w-5 h-5 text-slate-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
            </div>
            <h5 className="font-bold text-slate-300 text-sm">Mais refeições bloqueadas</h5>
            <p className="text-[10px] text-slate-500 mt-1">Assine o PRO para ver Lanches, Jantares e Substituições.</p>
          </div>
        )}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h4 className="text-lg font-bold text-white mb-4">💡 Hábitos de Sucesso</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(isFree ? diet.generalTips.slice(0, 2) : diet.generalTips).map((tip, idx) => (
            <div key={idx} className="flex gap-3 text-slate-400 text-sm">
              <span className="text-emerald-500">✨</span>
              {tip}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
