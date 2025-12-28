
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
      { name: "João Silva", level: 1, joinDate: "10/01/2024", isActive: true },
      { name: "Maria Clara", level: 1, joinDate: "12/01/2024", isActive: false },
      { name: "Roberto Junior", level: 2, joinDate: "15/01/2024", isActive: true },
      { name: "Ana Paula", level: 3, joinDate: "20/01/2024", isActive: true },
    ];

    const mockTransactions: Transaction[] = [
      { id: "1", fromName: "João Silva", level: 1, percentage: 25, amount: 7.50, date: "10 Jan" },
      { id: "2", fromName: "Roberto Junior", level: 2, percentage: 15, amount: 4.50, date: "15 Jan" },
    ];

    const fullProfile: UserProfile = { 
      ...profileData, 
      referralCode,
      balance: 12.00,
      referralCount: 4,
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
      alert("Erro ao gerar plano. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("Isso apagará seus dados. Continuar?")) {
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
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-6" />
        <h2 className="text-2xl font-bold text-white">Criando seu ecossistema...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-inter">
      <header className="fixed top-0 inset-x-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-900">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span className="font-bold text-lg">Fit<span className="text-emerald-500">mova</span></span>
          </div>
          {userProfile && (
             <button onClick={handleReset} className="text-[10px] font-bold uppercase text-slate-500 hover:text-red-400">Sair</button>
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
                    <p className="text-slate-500 text-sm">Seu painel fitness e de negócios.</p>
                  </div>
                </div>

                {bmi && <BMIResult result={bmi} />}

                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setActiveTab('workout')} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-left hover:border-emerald-500/50 transition-all">
                    <span className="text-2xl block mb-2">🏋️</span>
                    <h3 className="font-bold text-white">Treinos</h3>
                    <p className="text-[10px] text-slate-500 uppercase mt-1">Ver meu plano</p>
                  </button>
                  <button onClick={() => setActiveTab('referral')} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-left hover:border-indigo-500/50 transition-all">
                    <span className="text-2xl block mb-2">💰</span>
                    <h3 className="font-bold text-white">Ganhos</h3>
                    <p className="text-[10px] text-slate-500 uppercase mt-1">Rede e Saldo</p>
                  </button>
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
            <button onClick={() => setActiveTab('home')} className={`flex-1 flex flex-col items-center py-2 rounded-full transition-all ${activeTab === 'home' ? 'bg-emerald-600 text-white' : 'text-slate-500'}`}>
              <span className="text-[10px] font-bold">Início</span>
            </button>
            <button onClick={() => setActiveTab('workout')} className={`flex-1 flex flex-col items-center py-2 rounded-full transition-all ${activeTab === 'workout' ? 'bg-emerald-600 text-white' : 'text-slate-500'}`}>
              <span className="text-[10px] font-bold">Treino</span>
            </button>
            <button onClick={() => setActiveTab('referral')} className={`flex-1 flex flex-col items-center py-2 rounded-full transition-all ${['referral', 'marketing_plan'].includes(activeTab) ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>
              <span className="text-[10px] font-bold">Ganhos</span>
            </button>
            <button onClick={() => setActiveTab('diet')} className={`flex-1 flex flex-col items-center py-2 rounded-full transition-all ${activeTab === 'diet' ? 'bg-emerald-600 text-white' : 'text-slate-500'}`}>
              <span className="text-[10px] font-bold">Dieta</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
};

export default App;
