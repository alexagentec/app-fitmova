
import React, { useState, useEffect } from 'react';
import { HealthTip, UserProfile } from '../types';
import { getHealthTips } from '../services/geminiService';

interface TipsSectionProps {
  profile: UserProfile;
}

export const TipsSection: React.FC<TipsSectionProps> = ({ profile }) => {
  const [tips, setTips] = useState<HealthTip[]>([]);
  const [category, setCategory] = useState<'nutrition' | 'performance'>('nutrition');
  const [loading, setLoading] = useState(false);

  const fetchTips = async (cat: 'nutrition' | 'performance') => {
    setLoading(true);
    try {
      const data = await getHealthTips(profile, cat);
      setTips(data);
    } catch (error) {
      console.error("Erro ao buscar dicas", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTips(category);
  }, [category]);

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl">
      <div className="flex flex-wrap gap-4 mb-8">
        <button 
          onClick={() => setCategory('nutrition')}
          className={`px-6 py-2 rounded-full font-bold transition-all border ${category === 'nutrition' ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-900/40' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}
        >
          🍎 Nutrição Saudável
        </button>
        <button 
          onClick={() => setCategory('performance')}
          className={`px-6 py-2 rounded-full font-bold transition-all border ${category === 'performance' ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/40' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}
        >
          ⚡ Performance & Ganhos
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tips.map((tip, idx) => (
            <div key={idx} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-all">
              <h4 className="text-xl font-bold text-white mb-3">{tip.title}</h4>
              <p className="text-slate-400 leading-relaxed">{tip.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
