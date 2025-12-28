
import React, { useState, useEffect } from 'react';
import { UserProfile, WorkoutPlan, BMIResult as BMIResultType } from './types';
import { AnamnesisForm } from './components/AnamnesisForm';
import { WorkoutDisplay } from './components/WorkoutDisplay';
import { DietSection } from './components/DietSection';
import { BMIResult } from './components/BMIResult';
import { SubscriptionGate } from './components/SubscriptionGate';
import { ReferralSection } from './components/ReferralSection';
import { MarketingPlan } from './components/MarketingPlan';
import { apiClient } from './services/api';
import { calculateBMI } from './services/geminiService';

const App: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [bmi, setBmi] = useState<BMIResultType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'workout' | 'diet' | 'home' | 'subscription' | 'referral' | 'marketing_plan'>('home');

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('fitmova_v3_profile');
      const savedPlan = localStorage.getItem('fitmova_v3_plan');
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        setUserProfile(profile);
        setBmi(calculateBMI(profile.weight, profile.height));
      }
      if (savedPlan) setWorkoutPlan(JSON.parse(savedPlan));
    } catch (e) {
      console.error("Erro ao carregar dados locais.");
    }
  }, []);

  const handleAnamnesisSubmit = (profileData: UserProfile) => {
    const referralCode = profileData.name.split(' ')[0].toUpperCase() + Math.floor(1000 + Math.random() * 9000);
    const fullProfile: UserProfile = { 
      ...profileData, 
      referralCode,
      balance: 0,
      referralCount: 0,
      indirectCount: 0,
      currentCareerLevel: 'START',
      network: [],
      transactions: []
    };
    setUserProfile(fullProfile);
    setBmi(calculateBMI(profileData.weight, profileData.height));
    setActiveTab('subscription');
  };

  const handleSubscriptionSelect = async (tier: 'free' | 'premium', period?: 'monthly' | 'yearly') => {
    if (!userProfile) return;

    setIsLoading(true);
    const updatedProfile: UserProfile = { ...userProfile, subscriptionTier: tier, subscriptionPeriod: period };
    
    try {
      // O apiClient agora tem fallback automático para não travar
      const plan = await apiClient.generateWorkout(updatedProfile);
      
      setUserProfile(updatedProfile);
      setWorkoutPlan(plan);
      
      localStorage.setItem('fitmova_v3_profile', JSON.stringify(updatedProfile));
      localStorage.setItem('fitmova_v3_plan', JSON.stringify(plan));
      
      setActiveTab('home');
    } catch (error) {
      console.error("Erro ao processar plano:", error);
      alert("Houve um problema ao gerar seu plano. Verifique sua conexão e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("Deseja realmente sair?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-6 shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
      <h2 className="text-2xl font-bold text-white uppercase italic tracking-tighter">Sincronizando IA...</h2>
      <p className="text-slate-500 text-sm mt-2 max-w-xs">Geralmente leva entre 5 a 15 segundos para processar seu ecossistema.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-inter">
      <header className="fixed top-0 inset-x-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-900">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span className="font-bold text-lg tracking-tighter">Fit<span className="text-emerald-500">mova</span> PRO</span>
          </div>
          {userProfile && <button onClick={handleReset} className="text-[10px] font-black uppercase text-slate-400 hover:text-white transition-colors">Sair / Reset</button>}
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
                <h2 className="text-3xl font-bold text-white">Olá, {userProfile.name}</h2>
                {bmi && <BMIResult result={bmi} />}
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setActiveTab('workout')} className="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem] text-left hover:border-emerald-500 transition-all group">
                    <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform">🏋️</span>
                    <h3 className="font-bold text-white uppercase text-xs">Treinos Ativos</h3>
                    <p className="text-[9px] text-slate-500 font-bold mt-1">Sincronizado via IA</p>
                  </button>
                  <button onClick={() => setActiveTab('referral')} className="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem] text-left hover:border-indigo-500 transition-all group">
                    <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform">💎</span>
                    <h3 className="font-bold text-white uppercase text-xs">Minha Rede</h3>
                    <p className="text-[9px] text-slate-500 font-bold mt-1">Ganhos em 2 níveis</p>
                  </button>
                </div>
                <div className="bg-gradient-to-br from-indigo-500/10 to-emerald-500/10 border border-slate-800 p-6 rounded-[2.5rem] flex items-center justify-between cursor-pointer" onClick={() => setActiveTab('marketing_plan')}>
                   <div className="flex items-center gap-4">
                     <span className="text-2xl">🏆</span>
                     <div>
                       <h4 className="font-black text-white uppercase tracking-tighter">Plano de Carreira</h4>
                       <p className="text-[10px] text-slate-500 font-bold">Consulte metas e premiações</p>
                     </div>
                   </div>
                   <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
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
          <div className="bg-slate-900/90 backdrop-blur-2xl border border-slate-800 rounded-full p-2 flex justify-between shadow-2xl">
            <button onClick={() => setActiveTab('home')} className={`flex-1 py-2.5 rounded-full text-[10px] font-black uppercase transition-all ${activeTab === 'home' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' : 'text-slate-500'}`}>Início</button>
            <button onClick={() => setActiveTab('workout')} className={`flex-1 py-2.5 rounded-full text-[10px] font-black uppercase transition-all ${activeTab === 'workout' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' : 'text-slate-500'}`}>Treinos</button>
            <button onClick={() => setActiveTab('referral')} className={`flex-1 py-2.5 rounded-full text-[10px] font-black uppercase transition-all ${['referral', 'marketing_plan'].includes(activeTab) ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' : 'text-slate-500'}`}>Ganhos</button>
            <button onClick={() => setActiveTab('diet')} className={`flex-1 py-2.5 rounded-full text-[10px] font-black uppercase transition-all ${activeTab === 'diet' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' : 'text-slate-500'}`}>Dieta</button>
          </div>
        </nav>
      )}
    </div>
  );
};

export default App;
