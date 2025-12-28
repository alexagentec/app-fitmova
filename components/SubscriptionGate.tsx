
import React from 'react';

interface SubscriptionGateProps {
  onSelect: (tier: 'free' | 'premium', period?: 'monthly' | 'yearly') => void;
}

export const SubscriptionGate: React.FC<SubscriptionGateProps> = ({ onSelect }) => {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-indigo-400">Escolha seu Caminho</h2>
        <p className="text-slate-400 max-w-lg mx-auto">Transforme seu corpo com a potência da inteligência artificial e ainda ganhe indicando amigos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* FREE PLAN */}
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 flex flex-col hover:border-slate-700 transition-all opacity-80">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-2">Plano Starter</h3>
            <p className="text-slate-500 text-sm">O básico para começar sua jornada.</p>
          </div>
          <div className="mb-8">
            <span className="text-4xl font-extrabold text-white">Grátis</span>
          </div>
          <ul className="space-y-4 mb-10 flex-1">
            <li className="flex items-center gap-3 text-slate-400 text-sm">
              <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              Treino em Casa (Básico)
            </li>
            <li className="flex items-center gap-3 text-slate-700 text-sm line-through">
              Ganhos por Indicação
            </li>
            <li className="flex items-center gap-3 text-slate-700 text-sm line-through">
              Plano de Dieta IA
            </li>
          </ul>
          <button 
            onClick={() => onSelect('free')}
            className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all"
          >
            Começar Grátis
          </button>
        </div>

        {/* MONTHLY PREMIUM */}
        <div className="bg-slate-900 border-2 border-emerald-500 rounded-[2.5rem] p-8 flex flex-col relative shadow-2xl shadow-emerald-500/10 transform md:scale-105 z-10">
          <div className="absolute top-0 right-10 -translate-y-1/2 bg-emerald-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
            RECORRENTE
          </div>
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-2">Premium Mensal</h3>
            <p className="text-slate-500 text-sm">Libere ganhos em 2 níveis.</p>
          </div>
          <div className="mb-8">
            <span className="text-4xl font-extrabold text-white">R$ 30,00</span>
            <span className="text-slate-500 text-sm ml-1">/mês</span>
          </div>
          <ul className="space-y-4 mb-10 flex-1">
            <li className="flex items-center gap-3 text-slate-300 text-sm">
              <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              Comissão de 30% Direta
            </li>
            <li className="flex items-center gap-3 text-slate-300 text-sm">
              <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              Comissão de 20% Indireta
            </li>
            <li className="flex items-center gap-3 text-slate-300 text-sm">
              <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              Acesso a Academia e Treino IA
            </li>
          </ul>
          <button 
            onClick={() => onSelect('premium', 'monthly')}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/20"
          >
            Assinar Mensal
          </button>
        </div>

        {/* YEARLY PREMIUM */}
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 flex flex-col hover:border-slate-700 transition-all">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-2">Premium Anual</h3>
            <p className="text-slate-500 text-sm">Melhor custo para embaixadores.</p>
          </div>
          <div className="mb-8">
            <div className="flex items-baseline">
              <span className="text-4xl font-extrabold text-white">R$ 300</span>
              <span className="text-slate-500 text-sm ml-1">/ano</span>
            </div>
          </div>
          <ul className="space-y-4 mb-10 flex-1">
            <li className="flex items-center gap-3 text-slate-300 text-sm">
              <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              Ganhos Máximos 2 Níveis
            </li>
            <li className="flex items-center gap-3 text-slate-300 text-sm">
              <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              Economia de R$ 60 no ano
            </li>
          </ul>
          <button 
            onClick={() => onSelect('premium', 'yearly')}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all"
          >
            Assinar Anual
          </button>
        </div>
      </div>
    </div>
  );
};
