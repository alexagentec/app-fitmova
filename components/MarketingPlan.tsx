
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

      <div className="bg-gradient-to-br from-indigo-600 to-emerald-600 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-3xl font-black mb-2 uppercase tracking-tighter italic">Seja Ativo. Ganhe Recorrência.</h3>
          <p className="opacity-90 text-sm max-w-sm">No Fitmova, sua saúde gera renda. Ao convidar novos membros, você ganha sobre 3 níveis de profundidade.</p>
        </div>
      </div>

      <div className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-3xl">
        <h4 className="text-rose-400 font-bold mb-2 flex items-center gap-2 uppercase tracking-widest text-xs">
           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
           Regra de Ouro
        </h4>
        <p className="text-rose-200/70 text-sm">
          Apenas usuários com a assinatura **ATIVA** têm direito a receber comissões de sua rede. Se você ficar inativo, o saldo gerado no período será bloqueado, e somente a partir da regularização, recomeça a computar seus ganhos.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500 text-black flex items-center justify-center rounded-2xl font-black text-xl">1º</div>
            <div>
              <h4 className="font-bold text-white uppercase text-xs">Indicações Diretas</h4>
              <p className="text-2xl font-black text-emerald-500">25%</p>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 font-bold text-right uppercase">Ganhos por<br/>Venda Direta</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500 text-white flex items-center justify-center rounded-2xl font-black text-xl">2º</div>
            <div>
              <h4 className="font-bold text-white uppercase text-xs">Indicações Nível 2</h4>
              <p className="text-2xl font-black text-indigo-400">15%</p>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 font-bold text-right uppercase">Rede Indireta<br/>Amigos de Amigos</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500 text-white flex items-center justify-center rounded-2xl font-black text-xl">3º</div>
            <div>
              <h4 className="font-bold text-white uppercase text-xs">Indicações Nível 3</h4>
              <p className="text-2xl font-black text-purple-400">10%</p>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 font-bold text-right uppercase">Rede Global<br/>Expansão Máxima</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
        <h3 className="text-xl font-bold mb-6">Exemplo de Ganhos</h3>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">5 Diretos (R$ 7,50 cada)</span>
            <span className="text-white font-bold">R$ 37,50</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">25 Indiretos N2 (R$ 4,50 cada)</span>
            <span className="text-white font-bold">R$ 112,50</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">125 Indiretos N3 (R$ 3,00 cada)</span>
            <span className="text-white font-bold">R$ 375,00</span>
          </div>
          <div className="pt-4 border-t border-slate-800 flex justify-between">
            <span className="font-bold text-emerald-400 uppercase tracking-widest text-xs">Potencial Mensal</span>
            <span className="text-2xl font-black text-emerald-500">R$ 525,00</span>
          </div>
        </div>
      </div>
    </div>
  );
};
