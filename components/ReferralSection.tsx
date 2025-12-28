
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
        <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[9px] font-black text-emerald-500 uppercase">Ativo</span>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-end">
        <div className="flex items-center gap-1.5 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
          <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
          <span className="text-[9px] font-black text-rose-500 uppercase">Inativo</span>
        </div>
        <span className="text-[8px] text-rose-500/60 font-bold uppercase mt-1 tracking-tighter">Sem comissões</span>
      </div>
    );
  };

  const getLevelBadge = (level: number) => {
    switch (level) {
      case 1: 
        return (
          <div className="flex flex-col items-end gap-1">
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-black rounded border border-emerald-500/30 uppercase">Nível 1</span>
            <span className="text-[9px] font-bold text-emerald-500/60 uppercase tracking-tighter">Direto</span>
          </div>
        );
      case 2: 
        return (
          <div className="flex flex-col items-end gap-1">
            <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-[10px] font-black rounded border border-indigo-500/30 uppercase">Nível 2</span>
            <span className="text-[9px] font-bold text-indigo-500/60 uppercase tracking-tighter">Indireto</span>
          </div>
        );
      case 3: 
        return (
          <div className="flex flex-col items-end gap-1">
            <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-[10px] font-black rounded border border-purple-500/30 uppercase">Nível 3</span>
            <span className="text-[9px] font-bold text-purple-500/60 uppercase tracking-tighter">Indireto</span>
          </div>
        );
      default: return null;
    }
  };

  const directMembers = profile.network.filter(m => m.level === 1);
  const indirectMembers = profile.network.filter(m => m.level > 1);

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Header Cards */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 border border-slate-700 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Ecossistema Fitmova</h2>
          <button 
            onClick={onShowPlan}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20"
          >
            Plano de Carreira 🚀
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-950/50 p-5 rounded-3xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Saldo Disponível</span>
            <div className="text-3xl font-black text-white">R$ {profile.balance.toFixed(2)}</div>
          </div>
          <div className="bg-slate-950/50 p-5 rounded-3xl border border-slate-800 relative overflow-hidden group">
            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Total na Rede</span>
            <div className="text-3xl font-black text-indigo-400">{profile.network.length}</div>
            <div className="absolute top-2 right-2 flex gap-1">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Ativos"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-rose-500" title="Inativos"></div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-slate-950 p-1.5 rounded-2xl gap-1">
          <button 
            onClick={() => setActiveView('stats')}
            className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${activeView === 'stats' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Painel
          </button>
          <button 
            onClick={() => setActiveView('network')}
            className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${activeView === 'network' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Minha Rede
          </button>
          <button 
            onClick={() => setActiveView('ledger')}
            className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${activeView === 'ledger' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Extrato
          </button>
        </div>
      </div>

      {/* Network View */}
      {activeView === 'network' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 bg-slate-950/20 flex justify-between items-end">
            <div>
              <h3 className="font-bold text-white text-lg">Membros da Rede</h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Acompanhamento de Atividade</p>
            </div>
            <div className="flex items-center gap-4 text-[9px] font-bold text-slate-500 uppercase">
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Ativo</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Inativo</span>
            </div>
          </div>
          
          <div className="divide-y divide-slate-800 max-h-[60vh] overflow-y-auto">
            {profile.network.length > 0 ? (
              <>
                {/* Indicações Diretas */}
                {directMembers.length > 0 && (
                  <div className="bg-slate-800/20 px-4 py-2 border-b border-slate-800">
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Indicados Diretos (Nível 1)</span>
                  </div>
                )}
                {directMembers.map((member, i) => (
                  <div key={`direct-${i}`} className="p-4 flex justify-between items-center hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 border-2 rounded-full flex items-center justify-center font-bold transition-all ${member.isActive ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-500' : 'border-slate-700 bg-slate-800 text-slate-600'}`}>
                        {member.name.substring(0, 1)}
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${member.isActive ? 'text-white' : 'text-slate-500'}`}>{member.name}</p>
                        <p className="text-[10px] text-slate-500">Desde {member.joinDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {getStatusBadge(member.isActive)}
                      {getLevelBadge(member.level)}
                    </div>
                  </div>
                ))}

                {/* Indicações Indiretas */}
                {indirectMembers.length > 0 && (
                  <div className="bg-slate-800/20 px-4 py-2 border-b border-slate-800 border-t border-slate-800">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Rede Indireta (Nível 2 e 3)</span>
                  </div>
                )}
                {indirectMembers.map((member, i) => (
                  <div key={`indirect-${i}`} className="p-4 flex justify-between items-center hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 border-2 rounded-full flex items-center justify-center font-bold transition-all ${member.isActive ? (member.level === 2 ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-400' : 'border-purple-500/50 bg-purple-500/10 text-purple-400') : 'border-slate-700 bg-slate-800 text-slate-600'}`}>
                        {member.name.substring(0, 1)}
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${member.isActive ? 'text-white' : 'text-slate-500'}`}>{member.name}</p>
                        <p className="text-[10px] text-slate-500">Desde {member.joinDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {getStatusBadge(member.isActive)}
                      {getLevelBadge(member.level)}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="p-20 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-600">
                   <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h4 className="font-bold text-slate-500">Sua rede está vazia</h4>
                <p className="text-xs text-slate-600 mt-1">Convide pessoas para ativar seu motor de ganhos.</p>
              </div>
            )}
          </div>
          
          <div className="bg-slate-950 p-4 border-t border-slate-800">
             <div className="flex items-center gap-3 bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-2xl">
                <span className="text-xl">ℹ️</span>
                <p className="text-[10px] text-indigo-300 leading-tight">
                  <span className="font-bold text-white uppercase block mb-0.5">Regra de Ativação:</span>
                  Apenas membros <span className="text-emerald-400 font-bold">ATIVOS</span> recebem e geram comissões. Membros inativos permanecem na sua rede, mas o fluxo financeiro é pausado até a regularização.
                </p>
             </div>
          </div>
        </div>
      )}

      {/* Stats e Ledger permanecem similares, focando na estética de embaixador */}
      {activeView === 'stats' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">🔗 Link de Indicação</h3>
            <div className="flex gap-2">
              <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono font-bold text-emerald-400 text-center select-all">
                {profile.referralCode}
              </div>
              <button onClick={copyCode} className="px-6 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold transition-all text-white">
                {copied ? 'OK!' : 'Copiar'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden">
                <div className="flex justify-between items-start mb-2">
                   <span className="w-8 h-8 bg-emerald-500/10 rounded flex items-center justify-center text-emerald-500 font-bold">1</span>
                   <span className="text-[10px] font-black text-emerald-500">25%</span>
                </div>
                <p className="text-xs font-bold text-slate-300 uppercase">Nível 1</p>
                <p className="text-[10px] text-slate-500">Comissão Direta</p>
                <div className="absolute -right-2 -bottom-2 w-12 h-12 bg-emerald-500/5 rounded-full"></div>
             </div>
             <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden">
                <div className="flex justify-between items-start mb-2">
                   <span className="w-8 h-8 bg-indigo-500/10 rounded flex items-center justify-center text-indigo-500 font-bold">2</span>
                   <span className="text-[10px] font-black text-indigo-500">15%</span>
                </div>
                <p className="text-xs font-bold text-slate-300 uppercase">Nível 2</p>
                <p className="text-[10px] text-slate-500">Indireto Profissional</p>
                <div className="absolute -right-2 -bottom-2 w-12 h-12 bg-indigo-500/5 rounded-full"></div>
             </div>
             <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden">
                <div className="flex justify-between items-start mb-2">
                   <span className="w-8 h-8 bg-purple-500/10 rounded flex items-center justify-center text-purple-500 font-bold">3</span>
                   <span className="text-[10px] font-black text-purple-500">10%</span>
                </div>
                <p className="text-xs font-bold text-slate-300 uppercase">Nível 3</p>
                <p className="text-[10px] text-slate-500">Rede Expandida</p>
                <div className="absolute -right-2 -bottom-2 w-12 h-12 bg-purple-500/5 rounded-full"></div>
             </div>
          </div>

          <button className="w-full py-5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-black rounded-3xl shadow-xl shadow-emerald-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest">
            Solicitar Saque (PIX)
          </button>
        </div>
      )}

      {activeView === 'ledger' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 bg-slate-950/20">
            <h3 className="font-bold text-white text-lg">Fluxo Financeiro</h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Créditos de Rede</p>
          </div>
          <div className="divide-y divide-slate-800 max-h-[60vh] overflow-y-auto">
            {profile.transactions.length > 0 ? profile.transactions.map((tx, i) => (
              <div key={i} className="p-4 flex justify-between items-center hover:bg-slate-800/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-10 rounded-full ${tx.level === 1 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : tx.level === 2 ? 'bg-indigo-500' : 'bg-purple-500'}`} />
                  <div>
                    <p className="text-xs text-white">Bônus de <span className="font-bold">{tx.fromName}</span></p>
                    <div className="flex items-center gap-2 mt-1">
                       <span className="text-[9px] font-bold text-slate-500 uppercase">{tx.date}</span>
                       <span className="text-[9px] font-black uppercase text-slate-400">NÍVEL {tx.level}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-emerald-400">+ R$ {tx.amount.toFixed(2)}</p>
                  <p className="text-[10px] text-slate-500">{tx.percentage}% bônus</p>
                </div>
              </div>
            )) : (
              <div className="p-20 text-center text-slate-600 font-medium">Sem movimentações financeiras.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
