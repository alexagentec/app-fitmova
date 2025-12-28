
import React from 'react';

interface MarketingPlanProps {
  onBack: () => void;
}

export const MarketingPlan: React.FC<MarketingPlanProps> = ({ onBack }) => {
  const levels = [
    {
      id: 'START',
      icon: '🥉',
      name: 'Nível 1 — START',
      color: 'border-amber-700 bg-amber-900/10 text-amber-500',
      reqs: { directs: 20, indirects: 40, company: 0 },
      prize: 'Reconhecimento no app + Badge digital',
      delivery: 'Imediata no app',
      cost: 'R$ 0'
    },
    {
      id: 'BUILDER',
      icon: '🥈',
      name: 'Nível 2 — BUILDER',
      color: 'border-slate-400 bg-slate-900 text-slate-200',
      reqs: { directs: 50, indirects: 100, company: 0 },
      prize: 'R$ 200/mês (Pago por 2 meses mediante requalificação)',
      delivery: 'Crédito mensal no extrato',
      cost: 'R$ 400 total'
    },
    {
      id: 'LEADER',
      icon: '🥇',
      name: 'Nível 3 — LEADER',
      color: 'border-yellow-500 bg-yellow-500/10 text-yellow-500',
      reqs: { directs: 80, indirects: 160, company: 0 },
      prize: 'R$ 500/mês (Pago por 2 meses consecutivos)',
      delivery: 'Crédito mensal no extrato',
      cost: 'R$ 1.000 total'
    },
    {
      id: 'ELITE',
      icon: '🚢',
      name: 'Nível 4 — ELITE',
      color: 'border-indigo-500 bg-indigo-500/10 text-indigo-400',
      reqs: { directs: 120, indirects: 250, company: 10000 },
      prize: 'Cruzeiro Nacional (Exige 3 meses de requalificação)',
      delivery: 'Voucher na Convenção de Novembro',
      cost: 'Até R$ 20.000 com acompanhante'
    },
    {
      id: 'PRIME',
      icon: '🏨',
      name: 'Nível 5 — PRIME',
      color: 'border-purple-500 bg-purple-500/10 text-purple-400',
      reqs: { directs: 180, indirects: 400, company: 15000 },
      prize: 'Resort Nacional (7 meses seguidos de requalificação)',
      delivery: 'Voucher na Convenção de Novembro',
      cost: 'Média R$ 7.000'
    },
    {
      id: 'MASTER',
      icon: '🏍️',
      name: 'Nível 6 — MASTER',
      color: 'border-emerald-500 bg-emerald-500/10 text-emerald-400',
      reqs: { directs: 250, indirects: 700, company: 20000 },
      prize: 'Moto 150cc (7 meses seguidos de requalificação)',
      delivery: 'Chave simbólica na convenção',
      cost: 'R$ 15.000'
    },
    {
      id: 'LEGACY',
      icon: '🚗',
      name: 'Nível 7 — LEGACY',
      color: 'border-blue-600 bg-blue-600/10 text-blue-400',
      reqs: { directs: 400, indirects: 1200, company: 50000 },
      prize: 'Carro Popular (10 meses de requalificação)',
      delivery: 'Entrega em até 90 dias após evento',
      cost: 'R$ 60.000 (Limite 1/ano)'
    },
    {
      id: 'ORIGIN',
      icon: '👑',
      name: 'Nível 8 — ORIGIN',
      color: 'border-amber-400 bg-amber-400/5 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.1)]',
      reqs: { directs: 600, indirects: 2000, company: 70000 },
      prize: 'Corolla 0km (12 meses de requalificação)',
      delivery: 'Entrega Oficial na Convenção de Novembro',
      cost: 'R$ 130.000'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-24">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 bg-slate-900 border border-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white">Plano de Carreira</h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Graduações Fitmova</p>
        </div>
      </div>

      <div className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-[2rem] shadow-lg shadow-rose-950/20">
        <h4 className="text-rose-400 font-black mb-2 flex items-center gap-2 uppercase tracking-widest text-xs">
           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
           Regra de Ouro
        </h4>
        <p className="text-rose-200/80 text-sm leading-relaxed">
          Apenas usuários com a assinatura **ATIVA** têm direito a receber comissões de sua rede. Se você ficar inativo, o saldo gerado no período será bloqueado, e somente a partir da regularização, recomeça a computar seus ganhos.
        </p>
      </div>

      <div className="space-y-4">
        {levels.map((lvl, idx) => (
          <div key={lvl.id} className={`border-2 rounded-[2rem] p-6 transition-all ${lvl.color}`}>
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <span className="text-4xl drop-shadow-md">{lvl.icon}</span>
                <div>
                  <h3 className="font-black text-lg italic uppercase">{lvl.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="bg-black/20 px-2 py-0.5 rounded text-[10px] font-bold border border-current/20">🎯 {lvl.reqs.directs} Diretos</span>
                    <span className="bg-black/20 px-2 py-0.5 rounded text-[10px] font-bold border border-current/20">📊 {lvl.reqs.indirects} Indiretos</span>
                    {lvl.reqs.company > 0 && (
                      <span className="bg-black/20 px-2 py-0.5 rounded text-[10px] font-bold border border-current/20">🏢 Empresa {lvl.reqs.company/1000}k+</span>
                    )}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-black opacity-50 uppercase tracking-tighter">Fitmova Origin</span>
            </div>

            <div className="bg-black/20 rounded-2xl p-4 border border-current/10">
              <div className="flex items-center gap-3 mb-2 text-white">
                <span className="text-lg">🎁</span>
                <p className="text-sm font-bold tracking-tight">{lvl.prize}</p>
              </div>
              <div className="flex justify-between items-end mt-4 pt-3 border-t border-current/10">
                <div className="space-y-1">
                  <span className="block text-[8px] uppercase font-black opacity-60">Logística de Entrega</span>
                  <span className="text-[10px] font-bold">{lvl.delivery}</span>
                </div>
                <div className="text-right">
                  <span className="block text-[8px] uppercase font-black opacity-60">Valor Estimado</span>
                  <span className="text-[10px] font-black">{lvl.cost}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 space-y-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🛡️</span>
          <h3 className="text-xl font-bold text-white uppercase italic tracking-tighter">Travas Financeiras Essenciais</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="text-emerald-500 text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Sustentabilidade
            </h4>
            <ul className="text-xs text-slate-400 space-y-2">
              <li className="flex gap-2"><span>✅</span> Premiações grandes só se fundo anual ≥ custo.</li>
              <li className="flex gap-2"><span>✅</span> Nunca haverá antecipação de prêmios físicos.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-indigo-400 text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
              Critérios de Desempate
            </h4>
            <ul className="text-xs text-slate-400 space-y-2 leading-relaxed">
              <li>1. Maior tempo total qualificado.</li>
              <li>2. Maior número de diretos ativos.</li>
              <li>3. Data cronológica da qualificação.</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800">
           <div className="bg-slate-950 p-4 rounded-2xl flex gap-3 border border-slate-800">
             <span className="text-lg">⚖️</span>
             <p className="text-[10px] text-slate-500 font-bold leading-normal">
               A empresa reserva-se o direito de postergar entregas via cláusula de proteção ou substituir por experiência equivalente caso as metas globais de faturamento não atinjam o fundo de premiação anual.
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};
