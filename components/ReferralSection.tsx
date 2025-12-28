
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

  const getLevelBadge = (level: number) => {
    switch (level) {
      case 1: 
        return (
          <div className="flex flex-col items-end gap-1">
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-black rounded border border-emerald-500/30 uppercase">Nível 1</span>
            <span className="text-[9px] font-bold text-emerald-500/60 uppercase tracking-tighter">Indicado Direto</span>
          </div>
        );
      case 2: 
        return (
          <div className="flex flex-col items-end gap-1">
            <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-[10px] font-black rounded border border-indigo-500/30 uppercase">Nível 2</span>
            <span className="text-[9px] font-bold text-indigo-500/60 uppercase tracking-tighter">Indicado Indireto</span>
          </div>
        );
      case 3: 
        return (
          <div className="flex flex-col items-end gap-1">
            <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-[10px] font-black rounded border border-purple-500/30 uppercase">Nível 3</span>
            <span className="text-[9px] font-bold text-purple-500/60 uppercase tracking-tighter">Indicado Indireto</span>
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
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest transition-all"
          >
            Plano de Marketing 🚀
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-950/50 p-5 rounded-3xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Saldo Disponível</span>
            <div className="text-3xl font-black text-white">R$ {profile.balance.toFixed(2)}</div>
          </div>
          <div className="bg-slate-950/50 p-5 rounded-3xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Total na Rede</span>
            <div className="text-3xl font-black text-indigo-400">{profile.network.length}</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-slate-950 p-1.5 rounded-2xl gap-1">
          <button 
            onClick={() => setActiveView('stats')}
            className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${activeView === 'stats' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Início
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

      {/* Stats View */}
      {activeView === 'stats' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">🔗 Seu Link de Convite</h3>
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
             <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                <div className="flex justify-between items-start mb-2">
                   <span className="w-8 h-8 bg-emerald-500/10 rounded flex items-center justify-center text-emerald-500 font-bold">1</span>
                   <span className="text-[10px] font-black text-emerald-500">25%</span>
                </div>
                <p className="text-xs font-bold text-slate-300 uppercase">Nível 1 - Direto</p>
                <p className="text-[10px] text-slate-500">Indicados por você</p>
             </div>
             <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                <div className="flex justify-between items-start mb-2">
                   <span className="w-8 h-8 bg-indigo-500/10 rounded flex items-center justify-center text-indigo-500 font-bold">2</span>
                   <span className="text-[10px] font-black text-indigo-500">15%</span>
                </div>
                <p className="text-xs font-bold text-slate-300 uppercase">Nível 2 - Indireto</p>
                <p className="text-[10px] text-slate-500">Indicados do Nível 1</p>
             </div>
             <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                <div className="flex justify-between items-start mb-2">
                   <span className="w-8 h-8 bg-purple-500/10 rounded flex items-center justify-center text-purple-500 font-bold">3</span>
                   <span className="text-[10px] font-black text-purple-500">10%</span>
                </div>
                <p className="text-xs font-bold text-slate-300 uppercase">Nível 3 - Indireto</p>
                <p className="text-[10px] text-slate-500">Indicados do Nível 2</p>
             </div>
          </div>

          <button className="w-full py-5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-black rounded-3xl shadow-xl shadow-emerald-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest">
            Solicitar Saque (PIX)
          </button>
        </div>
      )}

      {/* Network View */}
      {activeView === 'network' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 bg-slate-950/20">
            <h3 className="font-bold text-white text-lg">Membros da Rede</h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Gerenciamento de Afiliados</p>
          </div>
          
          <div className="divide-y divide-slate-800 max-h-[60vh] overflow-y-auto">
            {profile.network.length > 0 ? (
              <>
                {/* Indicações Diretas */}
                {directMembers.length > 0 && (
                  <div className="bg-slate-800/20 px-4 py-2 border-b border-slate-800">
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Indicações Diretas</span>
                  </div>
                )}
                {directMembers.map((member, i) => (
                  <div key={`direct-${i}`} className="p-4 flex justify-between items-center hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center font-bold text-emerald-500">
                        {member.name.substring(0, 1)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{member.name}</p>
                        <p className="text-[10px] text-slate-500">Entrou em {member.joinDate}</p>
                      </div>
                    </div>
                    {getLevelBadge(member.level)}
                  </div>
                ))}

                {/* Indicações Indiretas */}
                {indirectMembers.length > 0 && (
                  <div className="bg-slate-800/20 px-4 py-2 border-b border-slate-800 border-t border-slate-800">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Indicações Indiretas</span>
                  </div>
                )}
                {indirectMembers.map((member, i) => (
                  <div key={`indirect-${i}`} className="p-4 flex justify-between items-center hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${member.level === 2 ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-purple-500/10 border-purple-500/20'} border rounded-full flex items-center justify-center font-bold text-slate-400`}>
                        {member.name.substring(0, 1)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{member.name}</p>
                        <p className="text-[10px] text-slate-500">Entrou em {member.joinDate}</p>
                      </div>
                    </div>
                    {getLevelBadge(member.level)}
                  </div>
                ))}
              </>
            ) : (
              <div className="p-20 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h4 className="font-bold text-slate-500">Sua rede está vazia</h4>
                <p className="text-xs text-slate-600 mt-1 max-w-[200px]">Compartilhe seu código para começar a ganhar comissões.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ledger View */}
      {activeView === 'ledger' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 bg-slate-950/20">
            <h3 className="font-bold text-white text-lg">Histórico de Comissões</h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Ganhos em tempo real</p>
          </div>
          <div className="divide-y divide-slate-800 max-h-[60vh] overflow-y-auto">
            {profile.transactions.length > 0 ? profile.transactions.map((tx, i) => (
              <div key={i} className="p-4 flex justify-between items-center hover:bg-slate-800/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-10 rounded-full ${tx.level === 1 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : tx.level === 2 ? 'bg-indigo-500' : 'bg-purple-500'}`} />
                  <div>
                    <p className="text-xs text-white">Pagamento de <span className="font-bold">{tx.fromName}</span></p>
                    <div className="flex items-center gap-2 mt-1">
                       <span className="text-[9px] font-bold text-slate-500 uppercase">{tx.date}</span>
                       <span className={`text-[9px] font-black uppercase tracking-widest ${tx.level === 1 ? 'text-emerald-500' : 'text-slate-500'}`}>
                         NÍVEL {tx.level} {tx.level === 1 ? '• DIRETO' : '• INDIRETO'}
                       </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-emerald-400">+ R$ {tx.amount.toFixed(2)}</p>
                  <p className="text-[10px] text-slate-500">{tx.percentage}% comissão</p>
                </div>
              </div>
            )) : (
              <div className="p-20 text-center text-slate-600 font-medium">Nenhuma transação registrada ainda.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
