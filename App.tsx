
import React, { useState, useEffect } from 'react';
import { UserProfile, WorkoutPlan, BMIResult as BMIResultType, NetworkMember, Transaction } from './types';
import { AnamnesisForm } from './components/AnamnesisForm';
import { WorkoutDisplay } from './components/WorkoutDisplay';
import { DietSection } from './components/DietSection';
import { BMIResult } from './components/BMIResult';
import { SubscriptionGate } from './components/SubscriptionGate';
import { ReferralSection } from './components/ReferralSection';
import { MarketingPlan } from './components/MarketingPlan';
import { generateWorkoutPlan, calculateBMI } from './services/geminiService';

const App: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [bmi, setBmi] = useState<BMIResultType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'workout' | 'diet' | 'home' | 'subscription' | 'referral' | 'marketing_plan'>('home');

  useEffect(() => {
    const savedProfile = localStorage.getItem('fitmova_v3_profile');
    const savedPlan = localStorage.getItem('fitmova_v3_plan');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setUserProfile(profile);
      setBmi(calculateBMI(profile.weight, profile.height));
    }
    if (savedPlan) setWorkoutPlan(JSON.parse(savedPlan));
  }, []);

  const handleAnamnesisSubmit = (profileData: UserProfile) => {
    const referralCode = profileData.name.split(' ')[0].toUpperCase() + Math.floor(1000 + Math.random() * 9000);
    
    const mockNetwork: NetworkMember[] = [
      { name: "Carlos (Professor)", level: 1, joinDate: "12/05/2024", isActive: true },
      { name: "Ana Silva (Aluna)", level: 2, joinDate: "14/05/2024", isActive: true },
      { name: "Pedro Rocha (Aluno)", level: 3, joinDate: "15/05/2024", isActive: true },
      { name: "Ricardo Mendes", level: 1, joinDate: "18/05/2024", isActive: false },
      { name: "Julia Santos", level: 2, joinDate: "19/05/2024", isActive: false },
    ];

    const mockTransactions: Transaction[] = [
      { id: "1", fromName: "Carlos", level: 1, percentage: 25, amount: 7.50, date: "Hoje, 10:30" },
      { id: "2", fromName: "Ana Silva", level: 2, percentage: 15, amount: 4.50, date: "Ontem, 18:20" },
      { id: "3", fromName: "Pedro Rocha", level: 3, percentage: 10, amount: 3.00, date: "15 Mai, 09:15" },
    ];

    const fullProfile: UserProfile = { 
      ...profileData, 
      referralCode,
      balance: 15.00,
      referralCount: 5,
      network: mockNetwork,
      transactions: mockTransactions
    };
    
    setUserProfile(fullProfile);
    setBmi(calculateBMI(profileData.weight, profileData.height));
    setActiveTab('subscription');
  };

  const handleSubscriptionSelect = async (tier: 'free' | 'premium', period?: 'monthly' | 'yearly') => {
    if (!userProfile) return;

    setIsLoading(true);
    const updatedProfile: UserProfile = {
      ...userProfile,
      subscriptionTier: tier,
      subscriptionPeriod: period
    };

    if (tier === 'free') {
      updatedProfile.daysPerWeek = Math.min(updatedProfile.daysPerWeek, 3);
      updatedProfile.environment = 'home_objects';
    }

    setUserProfile(updatedProfile);
    localStorage.setItem('fitmova_v3_profile', JSON.stringify(updatedProfile));

    try {
      const plan = await generateWorkoutPlan(updatedProfile);
      setWorkoutPlan(plan);
      localStorage.setItem('fitmova_v3_plan', JSON.stringify(plan));
      setActiveTab('home');
    } catch (error) {
      console.error(error);
      alert("Houve um erro ao processar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("Isso apagará seus dados e rede. Continuar?")) {
      localStorage.clear();
      setUserProfile(null);
      setWorkoutPlan(null);
      setBmi(null);
      setActiveTab('home');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 mb-8 relative">
          <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-indigo-400">Configurando seu Painel...</h2>
        <p className="text-slate-500 max-w-sm">Preparando seu motor de ganhos e treinos personalizados.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-inter">
      <header className="fixed top-0 inset-x-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-900">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span className="font-bold tracking-tight text-lg">Fit<span className="text-emerald-500">mova</span></span>
            {userProfile?.subscriptionTier === 'premium' && (
              <span className="ml-2 bg-amber-500 text-black text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">PRO</span>
            )}
          </div>
          {userProfile && (
             <button onClick={handleReset} className="text-[10px] font-bold tracking-widest uppercase text-slate-500 hover:text-red-400 transition-colors">Reset</button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-24 pb-32">
        {!userProfile ? (
          <AnamnesisForm onSubmit={handleAnamnesisSubmit} />
        ) : activeTab === 'subscription' ? (
          <SubscriptionGate onSelect={handleSubscriptionSelect} />
        ) : activeTab === 'marketing_plan' ? (
          <MarketingPlan onBack={() => setActiveTab('referral')} />
        ) : (
          <div className="space-y-6">
            {activeTab === 'home' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-3xl font-bold text-white">Olá, {userProfile.name}</h2>
                    <p className="text-slate-400 text-sm">Painel do Aluno & Embaixador.</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('referral')}
                    className="flex flex-col items-end bg-slate-900 border border-slate-800 px-5 py-3 rounded-3xl hover:border-emerald-500/50 transition-all group"
                  >
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest group-hover:animate-pulse">Ganhos de Rede</span>
                    <span className="text-xl font-black text-white">R$ {userProfile.balance.toFixed(2)}</span>
                  </button>
                </div>

                {bmi && <BMIResult result={bmi} />}

                <div className="grid grid-cols-2 gap-4">
                  <div onClick={() => setActiveTab('workout')} className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-3xl cursor-pointer hover:bg-emerald-500/20 transition-all">
                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center mb-4 text-white text-xl">🏋️</div>
                    <h3 className="font-bold text-white">Meus Treinos</h3>
                    <p className="text-xs text-slate-500 mt-1">Sessões Personalizadas</p>
                  </div>
                  <div onClick={() => setActiveTab('referral')} className="bg-indigo-500/10 border border-indigo-500/20 p-6 rounded-3xl cursor-pointer hover:bg-indigo-500/20 transition-all">
                    <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center mb-4 text-white text-xl">📊</div>
                    <h3 className="font-bold text-white">Minha Rede</h3>
                    <p className="text-xs text-slate-500 mt-1">{userProfile.network.filter(m => m.isActive).length} ativos de {userProfile.network.length}</p>
                  </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
                   <h4 className="font-bold text-sm mb-4 uppercase tracking-widest text-slate-500">Resumo da Conta</h4>
                   <div className="grid grid-cols-2 gap-y-4 text-sm">
                      <div className="flex flex-col"><span className="text-slate-500 text-xs">Código de Convite</span> <span className="font-mono text-emerald-400 font-bold">{userProfile.referralCode}</span></div>
                      <div className="flex flex-col"><span className="text-slate-500 text-xs">Membros Totais</span> <span className="font-medium text-white">{userProfile.referralCount} em sua rede</span></div>
                   </div>
                </div>

                <button 
                  onClick={() => setActiveTab('marketing_plan')}
                  className="w-full py-4 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-center gap-3 group hover:border-indigo-500/50 transition-all"
                >
                  <span className="text-indigo-400">✨</span>
                  <span className="font-bold text-slate-300">Conheça o Plano de Carreira</span>
                  <svg className="w-4 h-4 text-slate-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </div>
            )}

            {activeTab === 'workout' && workoutPlan && <WorkoutDisplay plan={workoutPlan} userProfile={userProfile} />}
            {activeTab === 'diet' && <DietSection profile={userProfile} />}
            {activeTab === 'referral' && <ReferralSection profile={userProfile} onShowPlan={() => setActiveTab('marketing_plan')} />}
          </div>
        )}
      </main>

      {userProfile && activeTab !== 'subscription' && (
        <nav className="fixed bottom-6 inset-x-4 max-w-md mx-auto z-40">
          <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-full p-2 flex justify-between shadow-2xl">
            <button onClick={() => setActiveTab('home')} className={`flex-1 flex flex-col items-center py-2 rounded-full transition-all ${activeTab === 'home' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' : 'text-slate-500'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span className="text-[10px] font-bold mt-1 text-center">Início</span>
            </button>
            <button onClick={() => setActiveTab('workout')} className={`flex-1 flex flex-col items-center py-2 rounded-full transition-all ${activeTab === 'workout' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' : 'text-slate-500'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span className="text-[10px] font-bold mt-1 text-center">Treinos</span>
            </button>
            <button onClick={() => setActiveTab('referral')} className={`flex-1 flex flex-col items-center py-2 rounded-full transition-all ${['referral', 'marketing_plan'].includes(activeTab) ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' : 'text-slate-500'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.407 2.67 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.407-2.67-1M12 16v1m4-12V3m0 18v-2M4 21v-2m0-14V3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span className="text-[10px] font-bold mt-1 text-center">Ganhos</span>
            </button>
            <button onClick={() => setActiveTab('diet')} className={`flex-1 flex flex-col items-center py-2 rounded-full transition-all ${activeTab === 'diet' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' : 'text-slate-500'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span className="text-[10px] font-bold mt-1 text-center">Dieta</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
};

export default App;
