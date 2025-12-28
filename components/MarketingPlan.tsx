
import React from 'react';

interface MarketingPlanProps {
  onBack: () => void;
}

export const MarketingPlan: React.FC<MarketingPlanProps> = ({ onBack }) => {
  return (
    <div className="space-y-8 animate-fade-in pb-24">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 bg-slate-900 border border-slate-800 rounded-full text-slate-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h2 className="text-2xl font-bold">Plano de Carreira Fitmova</h2>
      </div>

      {/* Banner Principal */}
      <div className="bg-gradient-to-br from-indigo-600 to-emerald-600 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-3xl font-black mb-2 uppercase tracking-tighter">Liberdade Financeira & Fitness</h3>
          <p className="opacity-90 text-sm max-w-sm">O Fitmova recompensa quem ajuda a comunidade a crescer. Transforme sua rede em uma fonte de renda recorrente.</p>
        </div>
        <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
           <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.407 2.67 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.407-2.67-1M12 16v1m4-12V3m0 18v-2M4 21v-2m0-14V3" /></svg>
        </div>
      </div>

      {/* Tabela de Comissões */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center justify-between group hover:border-emerald-500/50 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500 text-black flex items-center justify-center rounded-2xl font-black text-xl shadow-lg shadow-emerald-500/20">1º</div>
            <div>
              <h4 className="font-bold text-white">Nível Direto</h4>
              <p className="text-xs text-slate-500">Pessoas que você indicou</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-emerald-500">25%</span>
            <span className="block text-[10px] text-slate-500 font-bold">R$ 7,50 /mês</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center justify-between group hover:border-indigo-500/50 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500 text-white flex items-center justify-center rounded-2xl font-black text-xl shadow-lg shadow-indigo-500/20">2º</div>
            <div>
              <h4 className="font-bold text-white">Nível Indireto</h4>
              <p className="text-xs text-slate-500">Indicados dos seus amigos</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-indigo-400">15%</span>
            <span className="block text-[10px] text-slate-500 font-bold">R$ 4,50 /mês</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center justify-between group hover:border-purple-500/50 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500 text-white flex items-center justify-center rounded-2xl font-black text-xl shadow-lg shadow-purple-500/20">3º</div>
            <div>
              <h4 className="font-bold text-white">Nível Rede</h4>
              <p className="text-xs text-slate-500">Indicados do Nível 2</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-purple-400">10%</span>
            <span className="block text-[10px] text-slate-500 font-bold">R$ 3,00 /mês</span>
          </div>
        </div>
      </div>

      {/* Simulação de Ganhos */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <span className="text-emerald-500">📈</span> Simulação de Rede
        </h3>
        <p className="text-sm text-slate-400 mb-8">Se você indicar apenas 5 amigos e eles fizerem o mesmo:</p>
        
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">5 Pessoas no Nível 1</span>
            <span className="text-white font-bold">R$ 37,50</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">25 Pessoas no Nível 2</span>
            <span className="text-white font-bold">R$ 112,50</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">125 Pessoas no Nível 3</span>
            <span className="text-white font-bold">R$ 375,00</span>
          </div>
          <div className="pt-4 border-t border-slate-800 flex justify-between">
            <span className="font-bold text-emerald-400">Ganhos Mensais Totais</span>
            <span className="text-2xl font-black text-emerald-500">R$ 525,00</span>
          </div>
        </div>
        
        <p className="mt-8 text-[10px] text-slate-600 italic text-center">
          * Valores baseados na assinatura Premium Mensal de R$ 30,00. Os ganhos são recorrentes enquanto as assinaturas estiverem ativas.
        </p>
      </div>

      {/* CTA Final */}
      <div className="p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-[2.5rem] text-center">
        <h4 className="text-lg font-bold text-white mb-2">Pronto para começar?</h4>
        <p className="text-xs text-slate-500 mb-6">Comece compartilhando seu código agora mesmo e veja sua rede crescer!</p>
        <button 
          onClick={onBack}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-900/40"
        >
          Ir para Meus Ganhos
        </button>
      </div>
    </div>
  );
};
