
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
      { name: "Lucas Ferreira", level: 1, joinDate: "10/01/2024", isActive: true, whatsapp: "11999999999" },
      { name: "Beatriz Santos", level: 1, joinDate: "12/01/2024", isActive: false, whatsapp: "11888888888" },
      { name: "Ricardo Silva", level: 2, joinDate: "15/01/2024", isActive: true, whatsapp: "11777777777" },
      { name: "Julia Lopes", level: 3, joinDate: "20/01/2024", isActive: true, whatsapp: "11666666666" },
    ];

    const mockTransactions: Transaction[] = [
      { id: "1", fromName: "Lucas Ferreira", level: 1, percentage: 25, amount: 7.50, date: "10 Jan" },
      { id: "2", fromName: "Ricardo Silva", level: 2, percentage: 15, amount: 4.50, date: "15 Jan" },
    ];

    const fullProfile: UserProfile = { 
      ...profileData, 
      referralCode,
      balance: 12.00,
      referralCount: 12,
      indirectCount: 15,
      currentCareerLevel: 'START',
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
      alert("Houve um erro. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("Isso apagará seus dados de treino e rede. Continuar?")) {
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
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-6 shadow-[0_0_20px_rgba(16,185,129,0.3)]" />
        <h2 className="text-2xl font-bold text-white uppercase italic tracking-tighter">Sincronizando Ecossistema...</h2>
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
            <span className="font-bold text-lg tracking-tighter">Fit<span className="text-emerald-500">mova</span></span>
          </div>
          {userProfile && (
             <button onClick={handleReset} className="text-[10px] font-black uppercase text-slate-500 hover:text-red-400 tracking-widest transition-colors text-white">Sair</button>
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
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-3xl font-bold text-white">Olá, {userProfile.name}</h2>
                    <p className="text-slate-500 text-sm italic">Ambiente: {userProfile.environment === 'gym' ? 'Academia' : 'Em Casa'}</p>
                  </div>
                </div>

                {bmi && <BMIResult result={bmi} />}

                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setActiveTab('workout')} className="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem] text-left hover:border-emerald-500/50 transition-all group overflow-hidden relative shadow-xl">
                    <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform">🏋️</span>
                    <h3 className="font-bold text-white uppercase text-xs tracking-widest">Meus Treinos</h3>
                    <p className="text-[10px] text-slate-500 uppercase mt-1 font-black">Planos de IA</p>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                      <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                  </button>
                  <button onClick={() => setActiveTab('referral')} className="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem] text-left hover:border-indigo-500/50 transition-all group overflow-hidden relative shadow-xl">
                    <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform">💎</span>
                    <h3 className="font-bold text-white uppercase text-xs tracking-widest">Graduação</h3>
                    <p className="text-[10px] text-slate-500 uppercase mt-1 font-black">{userProfile.currentCareerLevel}</p>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                      <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.407 2.67 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.407-2.67-1M12 16v1m4-12V3m0 18v-2M4 21v-2m0-14V3" /></svg>
                    </div>
                  </button>
                </div>

                <div className="bg-gradient-to-br from-indigo-500/10 to-emerald-500/10 border border-slate-800 p-6 rounded-[2.5rem] flex items-center justify-between cursor-pointer hover:border-slate-700 transition-all" onClick={() => setActiveTab('marketing_plan')}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-2xl">🏆</div>
                    <div>
                      <h4 className="font-black text-white uppercase italic tracking-tighter">Explorar Carreira</h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">De START a ORIGIN (Corolla 0km)</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
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
            <button onClick={() => setActiveTab('home')} className={`flex-1 flex flex-col items-center py-2.5 rounded-full transition-all ${activeTab === 'home' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' : 'text-slate-500'}`}>
              <span className="text-[10px] font-black uppercase tracking-tighter">Início</span>
            </button>
            <button onClick={() => setActiveTab('workout')} className={`flex-1 flex flex-col items-center py-2.5 rounded-full transition-all ${activeTab === 'workout' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' : 'text-slate-500'}`}>
              <span className="text-[10px] font-black uppercase tracking-tighter">Treinos</span>
            </button>
            <button onClick={() => setActiveTab('referral')} className={`flex-1 flex flex-col items-center py-2.5 rounded-full transition-all ${['referral', 'marketing_plan'].includes(activeTab) ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' : 'text-slate-500'}`}>
              <span className="text-[10px] font-black uppercase tracking-tighter">Ganhos</span>
            </button>
            <button onClick={() => setActiveTab('diet')} className={`flex-1 flex flex-col items-center py-2.5 rounded-full transition-all ${activeTab === 'diet' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' : 'text-slate-500'}`}>
              <span className="text-[10px] font-black uppercase tracking-tighter">Dieta</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
};

export default App;
