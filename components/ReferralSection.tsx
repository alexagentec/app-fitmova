
import React, { useState } from 'react';
import { UserProfile, NetworkMember, Transaction } from '../types';

interface ReferralSectionProps {
  profile: UserProfile;
  onShowPlan?: () => void;
}

export const ReferralSection: React.FC<ReferralSectionProps> = ({ profile, onShowPlan }) => {
  const [activeView, setActiveView] = useState<'stats' | 'network' | 'ledger'>('stats');
  const [copied, setCopied] = useState(false);
  const [selectedMember, setSelectedMember] = useState<NetworkMember | null>(null);

  const copyCode = () => {
    navigator.clipboard.writeText(profile.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContactWhatsApp = (member: NetworkMember) => {
    if (!member.whatsapp) {
      alert("Este membro não cadastrou um WhatsApp.");
      return;
    }
    const message = encodeURIComponent(`Olá ${member.name.split(' ')[0]}, notei que seu plano Fitmova está inativo. Vamos voltar aos treinos e reativar suas comissões?`);
    window.open(`https://wa.me/55${member.whatsapp.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  const getStatusBadge = (member: NetworkMember) => {
    const isActive = member.isActive;
    if (isActive) {
      return (
        <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">Ativo</span>
        </div>
      );
    }
    return (
      <button 
        onClick={(e) => {
          e.stopPropagation();
          setSelectedMember(member);
        }}
        className="flex flex-col items-end group"
      >
        <div className="flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700 group-hover:border-rose-500/50 transition-all">
          <span className="w-2 h-2 bg-slate-600 rounded-full" />
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Inativo</span>
        </div>
        <span className="text-[9px] text-rose-500 font-bold uppercase mt-1 group-hover:animate-bounce">Tocar p/ Cobrar</span>
      </button>
    );
  };

  const getLevelBadge = (level: number) => {
    const configs = {
      1: { color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30', label: 'Nível 1' },
      2: { color: 'text-indigo-400', bg: 'bg-indigo-500/20', border: 'border-indigo-500/30', label: 'Nível 2' },
      3: { color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/30', label: 'Nível 3' }
    };
    const config = configs[level as keyof typeof configs] || configs[1];
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
            <h2 className="text-2xl font-bold text-white">Ecossistema de Ganhos</h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Carreira: {profile.currentCareerLevel}</p>
          </div>
          <button 
            onClick={onShowPlan}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20"
          >
            Plano Completo 🚀
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-950/50 p-5 rounded-3xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Saldo Líquido</span>
            <div className="text-3xl font-black text-white">R$ {profile.balance.toFixed(2)}</div>
          </div>
          <div className="bg-slate-950/50 p-5 rounded-3xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Rede Total</span>
            <div className="text-3xl font-black text-indigo-400">{profile.referralCount + profile.indirectCount}</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-slate-950 p-1.5 rounded-2xl gap-1">
          <button onClick={() => setActiveView('stats')} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${activeView === 'stats' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>Performance</button>
          <button onClick={() => setActiveView('network')} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${activeView === 'network' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>Estrutura</button>
          <button onClick={() => setActiveView('ledger')} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${activeView === 'ledger' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>Fluxo</button>
        </div>
      </div>

      {activeView === 'stats' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-sm text-slate-300 uppercase tracking-widest">🔗 Link Embaixador</h3>
            <div className="flex gap-2">
              <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono font-bold text-emerald-400 text-center select-all">
                {profile.referralCode}
              </div>
              <button onClick={copyCode} className="px-6 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold transition-all text-white">
                {copied ? 'OK!' : 'Copiar'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="p-5 bg-slate-900 border border-slate-800 rounded-[2rem]">
                <span className="text-slate-500 font-bold text-[10px] uppercase block mb-1">Diretos (N1)</span>
                <span className="text-emerald-500 font-black text-2xl">{profile.referralCount}</span>
                <p className="text-[10px] text-slate-500 mt-1 uppercase font-black">Meta: 20 para Start</p>
             </div>
             <div className="p-5 bg-slate-900 border border-slate-800 rounded-[2rem]">
                <span className="text-slate-500 font-bold text-[10px] uppercase block mb-1">Indiretos (N2+N3)</span>
                <span className="text-indigo-400 font-black text-2xl">{profile.indirectCount}</span>
                <p className="text-[10px] text-slate-500 mt-1 uppercase font-black">Meta: 40 para Start</p>
             </div>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6">
             <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest italic">Próxima Graduação</h4>
                <span className="text-[10px] font-black bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded">START</span>
             </div>
             <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full transition-all duration-1000" 
                  style={{ width: `${Math.min((profile.referralCount / 20) * 100, 100)}%` }}
                />
             </div>
             <p className="text-[9px] text-slate-600 mt-2 font-bold uppercase text-center tracking-tighter">Progresso baseado em seus indicadores diretos</p>
          </div>
        </div>
      )}

      {activeView === 'network' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden relative">
          <div className="p-6 border-b border-slate-800 bg-slate-950/20">
            <h3 className="font-bold text-white text-lg">Visualização de Equipe</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Clique no status p/ ver contato</p>
          </div>
          
          <div className="divide-y divide-slate-800 max-h-[60vh] overflow-y-auto">
            {profile.network.length > 0 ? (
              <>
                <div className="bg-emerald-500/5 px-4 py-2 border-b border-slate-800">
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Indicados Diretos (Nível 1)</span>
                </div>
                {directMembers.map((member, i) => (
                  <div key={`d-${i}`} className="p-4 flex justify-between items-center hover:bg-slate-800/30 transition-colors cursor-pointer" onClick={() => setSelectedMember(member)}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${member.isActive ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' : 'border-slate-700 bg-slate-800 text-slate-600'}`}>
                        {member.name.substring(0, 1)}
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${member.isActive ? 'text-white' : 'text-slate-500'}`}>{member.name}</p>
                        <p className="text-[10px] text-slate-500">Cadastrado em {member.joinDate}</p>
                      </div>
                    </div>
                    {getStatusBadge(member)}
                  </div>
                ))}

                <div className="bg-indigo-500/5 px-4 py-2 border-b border-slate-800 border-t border-slate-800">
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Rede Expandida (Nível 2 e 3)</span>
                </div>
                {indirectMembers.map((member, i) => (
                  <div key={`ind-${i}`} className="p-4 flex justify-between items-center hover:bg-slate-800/30 transition-colors cursor-pointer" onClick={() => setSelectedMember(member)}>
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
                    {getStatusBadge(member)}
                  </div>
                ))}
              </>
            ) : (
              <div className="p-20 text-center italic text-slate-600">Nenhum membro ativo na sua rede.</div>
            )}
          </div>
        </div>
      )}

      {selectedMember && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedMember(null)}>
          <div className="bg-slate-900 border border-slate-800 w-full max-w-xs rounded-[2rem] overflow-hidden shadow-2xl p-6" onClick={e => e.stopPropagation()}>
            <div className="flex flex-col items-center text-center space-y-4">
               <div className={`w-20 h-20 rounded-full flex items-center justify-center font-black text-3xl border-4 ${selectedMember.isActive ? 'border-emerald-500 text-emerald-500 bg-emerald-500/10' : 'border-slate-700 text-slate-600 bg-slate-800'}`}>
                 {selectedMember.name.substring(0, 1)}
               </div>
               <div>
                 <h4 className="text-xl font-bold text-white">{selectedMember.name}</h4>
                 <div className="flex items-center justify-center gap-2 mt-1">
                   {getLevelBadge(selectedMember.level)}
                   <span className={`text-[10px] font-bold uppercase ${selectedMember.isActive ? 'text-emerald-500' : 'text-slate-500'}`}>
                     {selectedMember.isActive ? 'Conta Ativa' : 'Assinatura Inativa'}
                   </span>
                 </div>
               </div>
               
               <div className="w-full pt-4 space-y-3">
                 <button 
                  onClick={() => handleContactWhatsApp(selectedMember)}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 py-4 rounded-2xl font-bold text-white transition-all shadow-lg shadow-emerald-900/40"
                 >
                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42 1.56 1.56 2.42 3.63 2.42 5.82 0 4.54-3.7 8.24-8.24 8.24-1.54 0-3.05-.43-4.36-1.24l-.31-.19-3.24.85.86-3.15-.21-.34A8.221 8.221 0 013.82 11.9c0-4.54 3.7-8.24 8.24-8.24m-3.95 3.1c-.22 0-.45.03-.64.22-.2.19-.77.75-.77 1.83s.78 2.11.89 2.26c.11.15 1.53 2.34 3.71 3.28.52.22.92.35 1.24.45.52.17.99.14 1.36.09.42-.06 1.28-.53 1.46-1.03.18-.51.18-.94.13-1.03-.05-.09-.19-.14-.39-.24-.21-.11-1.28-.63-1.48-.7-.2-.07-.34-.11-.49.11-.15.22-.59.75-.72.91-.13.16-.27.18-.47.07-.2-.11-.84-.31-1.61-.99-.6-.53-1-1.19-1.12-1.39-.13-.21-.01-.32.09-.42.09-.09.21-.24.31-.36.1-.12.13-.21.2-.35.07-.14.03-.26-.01-.36-.05-.1-.49-1.18-.67-1.62-.18-.43-.36-.37-.49-.37z"/></svg>
                   {selectedMember.isActive ? 'Conversar' : 'Remeter Cobrança'}
                 </button>
                 <button 
                  onClick={() => setSelectedMember(null)}
                  className="w-full text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
                 >
                   Fechar
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}

      {activeView === 'ledger' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 bg-slate-950/20">
            <h3 className="font-bold text-white text-lg">Histórico Financeiro</h3>
          </div>
          <div className="divide-y divide-slate-800">
            {profile.transactions.map((tx, i) => (
              <div key={i} className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`w-1 h-8 rounded-full ${tx.level === 1 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : tx.level === 2 ? 'bg-indigo-500' : 'bg-purple-500'}`} />
                  <div>
                    <p className="text-xs text-white">Comissão — {tx.fromName}</p>
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
