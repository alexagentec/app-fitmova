
import React, { useState } from 'react';
import { UserProfile, NetworkMember, Transaction } from '../types';

interface ReferralSectionProps {
  profile: UserProfile;
  onShowPlan?: () => void;
}

export const ReferralSection: React.FC<ReferralSectionProps> = ({ profile, onShowPlan }) => {
  const [activeView, setActiveView] = useState<'stats' | 'network' | 'ledger'>('stats');
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(profile.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return (
        <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">Ativo</span>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-end">
        <div className="flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
          <span className="w-2 h-2 bg-slate-600 rounded-full" />
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Inativo</span>
        </div>
        <span className="text-[9px] text-rose-500 font-bold uppercase mt-1">Sem Comissões</span>
      </div>
    );
  };

  const getLevelBadge = (level: number) => {
    const configs = {
      1: { color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30', label: 'Nível 1' },
      2: { color: 'text-indigo-400', bg: 'bg-indigo-500/20', border: 'border-indigo-500/30', label: 'Nível 2' },
      3: { color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/30', label: 'Nível 3' }
    };
    const config = configs[level as keyof typeof configs];
    return (
      <span className={`px-2 py-0.5 ${config.bg} ${config.color} text-[10px] font-black rounded border ${config.border} uppercase`}>
        {config.label}
      </span>
    );
  };

  const directMembers = profile.network.filter(m => m.level === 1);
  const indirectMembers = profile.network.filter(m => m.level > 1);

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Header Info */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 border border-slate-700 shadow-2xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Minha Rede</h2>
            <p className="text-slate-500 text-xs">Gestão de Afiliados e Comissões</p>
          </div>
          <button 
            onClick={onShowPlan}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20"
          >
            Ver Plano 🚀
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-950/50 p-5 rounded-3xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Saldo Total</span>
            <div className="text-3xl font-black text-white">R$ {profile.balance.toFixed(2)}</div>
          </div>
          <div className="bg-slate-950/50 p-5 rounded-3xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Membros Ativos</span>
            <div className="text-3xl font-black text-emerald-500">{profile.network.filter(m => m.isActive).length}</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-slate-950 p-1.5 rounded-2xl gap-1">
          <button onClick={() => setActiveView('stats')} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${activeView === 'stats' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>Visão Geral</button>
          <button onClick={() => setActiveView('network')} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${activeView === 'network' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>Membros</button>
          <button onClick={() => setActiveView('ledger')} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${activeView === 'ledger' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>Extrato</button>
        </div>
      </div>

      {activeView === 'stats' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-sm text-slate-300 uppercase tracking-widest">🔗 Seu Código de Convite</h3>
            <div className="flex gap-2">
              <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono font-bold text-emerald-400 text-center select-all">
                {profile.referralCode}
              </div>
              <button onClick={copyCode} className="px-6 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold transition-all text-white">
                {copied ? 'OK!' : 'Copiar'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
             <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                <span className="text-emerald-500 font-black text-xl">25%</span>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Nível 1 (Diretos)</p>
             </div>
             <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                <span className="text-indigo-400 font-black text-xl">15%</span>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Nível 2 (Indiretos)</p>
             </div>
             <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                <span className="text-purple-400 font-black text-xl">10%</span>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Nível 3 (Indiretos)</p>
             </div>
          </div>
        </div>
      )}

      {activeView === 'network' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 bg-slate-950/20">
            <h3 className="font-bold text-white text-lg">Estrutura de Rede</h3>
          </div>
          
          <div className="divide-y divide-slate-800 max-h-[60vh] overflow-y-auto">
            {profile.network.length > 0 ? (
              <>
                {/* Diretos - Nível 1 */}
                <div className="bg-emerald-500/5 px-4 py-2 border-b border-slate-800">
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Indicações Diretas (Nível 1)</span>
                </div>
                {directMembers.map((member, i) => (
                  <div key={`d-${i}`} className="p-4 flex justify-between items-center hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${member.isActive ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' : 'border-slate-700 bg-slate-800 text-slate-600'}`}>
                        {member.name.substring(0, 1)}
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${member.isActive ? 'text-white' : 'text-slate-500'}`}>{member.name}</p>
                        <p className="text-[10px] text-slate-500">Membro desde {member.joinDate}</p>
                      </div>
                    </div>
                    {getStatusBadge(member.isActive)}
                  </div>
                ))}

                {/* Indiretos - Níveis 2 e 3 */}
                <div className="bg-indigo-500/5 px-4 py-2 border-b border-slate-800 border-t border-slate-800">
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Rede Indireta (Níveis 2 e 3)</span>
                </div>
                {indirectMembers.map((member, i) => (
                  <div key={`ind-${i}`} className="p-4 flex justify-between items-center hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${member.isActive ? (member.level === 2 ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' : 'border-purple-500 bg-purple-500/10 text-purple-400') : 'border-slate-700 bg-slate-800 text-slate-600'}`}>
                        {member.name.substring(0, 1)}
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${member.isActive ? 'text-white' : 'text-slate-500'}`}>{member.name}</p>
                        <div className="flex gap-2 mt-0.5">
                          {getLevelBadge(member.level)}
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(member.isActive)}
                  </div>
                ))}
              </>
            ) : (
              <div className="p-20 text-center text-slate-600 font-medium italic">Sua rede ainda está vazia.</div>
            )}
          </div>
        </div>
      )}

      {activeView === 'ledger' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 bg-slate-950/20">
            <h3 className="font-bold text-white text-lg">Ganhos por Nível</h3>
          </div>
          <div className="divide-y divide-slate-800">
            {profile.transactions.map((tx, i) => (
              <div key={i} className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`w-1 h-8 rounded-full ${tx.level === 1 ? 'bg-emerald-500' : tx.level === 2 ? 'bg-indigo-500' : 'bg-purple-500'}`} />
                  <div>
                    <p className="text-xs text-white">Comissão de <span className="font-bold">{tx.fromName}</span></p>
                    <div className="flex items-center gap-2">
                       <span className="text-[9px] font-bold text-slate-500 uppercase">{tx.date}</span>
                       <span className={`text-[9px] font-black uppercase ${tx.level === 1 ? 'text-emerald-500' : 'text-indigo-400'}`}>Nível {tx.level}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-emerald-400">+ R$ {tx.amount.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
