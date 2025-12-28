
import React, { useState } from 'react';
import { WorkoutPlan, Exercise, UserProfile } from '../types';
import { getExerciseExecution, ExecutionGuide, generateExerciseIllustration } from '../services/geminiService';

interface WorkoutDisplayProps {
  plan: WorkoutPlan;
  userProfile: UserProfile;
}

export const WorkoutDisplay: React.FC<WorkoutDisplayProps> = ({ plan, userProfile }) => {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [executionGuide, setExecutionGuide] = useState<ExecutionGuide | null>(null);
  const [exerciseImage, setExerciseImage] = useState<string | null>(null);
  const [loadingExecution, setLoadingExecution] = useState(false);

  const handleShowExecution = async (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setLoadingExecution(true);
    setExecutionGuide(null);
    setExerciseImage(null);
    
    try {
      const isPremium = userProfile.subscriptionTier === 'premium';
      
      const promises: [Promise<ExecutionGuide>, Promise<string | null> | null] = [
        getExerciseExecution(exercise.name, userProfile),
        isPremium ? generateExerciseIllustration(exercise.name) : Promise.resolve(null)
      ];

      const [guide, imageUrl] = await Promise.all(promises);
      setExecutionGuide(guide);
      setExerciseImage(imageUrl);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingExecution(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-emerald-600 to-indigo-600 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Protocolo {plan.level} {userProfile.subscriptionTier === 'free' ? '(FREE)' : '(PRO)'}</span>
          <h2 className="text-3xl font-extrabold mb-2">{plan.planName}</h2>
          <p className="text-sm opacity-90 max-w-md">{plan.generalAdvice}</p>
        </div>
        <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
           <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
      </div>

      <div className="space-y-4">
        {plan.weeklySchedule.map((day, idx) => (
          <details key={idx} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden group">
            <summary className="p-5 flex justify-between items-center cursor-pointer hover:bg-slate-800/50 transition-colors list-none">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center font-bold text-emerald-500 group-open:bg-emerald-500 group-open:text-white transition-all">
                  {day.day.substring(0, 1).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-white">{day.day}</h3>
                  <p className="text-xs text-slate-500">{day.focus}</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-slate-600 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div className="p-4 pt-0 space-y-3">
              {day.exercises.map((ex, eIdx) => (
                <div key={eIdx} className="bg-slate-800/30 p-4 rounded-2xl border border-slate-800 hover:border-emerald-500/30 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-white">{ex.name}</h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {ex.targetMuscles.map((m, mi) => (
                           <span key={mi} className="text-[9px] uppercase font-bold text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">{m}</span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="block text-emerald-500 font-bold text-sm">{ex.sets} x {ex.reps}</span>
                      <span className="block text-slate-500 text-[10px]">Descanso: {ex.rest}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleShowExecution(ex)}
                    className="mt-3 w-full py-2 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-xl hover:bg-emerald-500/20 transition-all"
                  >
                    Guia de Execução
                  </button>
                </div>
              ))}
            </div>
          </details>
        ))}
      </div>

      {selectedExercise && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-t-[2.5rem] md:rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-slate-900/95 backdrop-blur p-6 border-b border-slate-800 flex justify-between items-center z-10">
              <div>
                <h3 className="text-2xl font-bold text-white">{selectedExercise.name}</h3>
                <p className="text-xs text-emerald-500 font-bold uppercase tracking-widest">
                  {userProfile.subscriptionTier === 'free' ? 'Guia Básico de Treino' : 'Biomecânica Aplicada PRO'}
                </p>
              </div>
              <button onClick={() => setSelectedExercise(null)} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-6 md:p-8">
              {loadingExecution ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-slate-500 animate-pulse">Processando detalhes técnicos...</p>
                </div>
              ) : executionGuide ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="relative aspect-square bg-slate-800 rounded-[2rem] overflow-hidden border border-slate-700 flex flex-col">
                      {userProfile.subscriptionTier === 'free' ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-900/40">
                          <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                          </div>
                          <h4 className="font-bold text-white mb-2">Visualização Anatômica Bloqueada</h4>
                          <p className="text-xs text-slate-500 mb-6">Assine o Premium para ver quais músculos estão sendo trabalhados com imagens 3D geradas por IA.</p>
                          <button className="px-6 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg">ASSINAR PRO</button>
                        </div>
                      ) : exerciseImage ? (
                        <img src={exerciseImage} alt={selectedExercise.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600">Visual Indisponível</div>
                      )}
                      
                      {userProfile.subscriptionTier === 'premium' && (
                        <div className="absolute bottom-4 left-4 right-4 p-4 bg-black/60 backdrop-blur rounded-2xl">
                          <span className="text-[10px] font-bold text-slate-400 block mb-2 uppercase">Músculos Ativados</span>
                          <div className="flex flex-wrap gap-2">
                            {executionGuide.muscleGroups.map((m, i) => (
                              <span key={i} className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded-md">{m}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-emerald-400 font-bold mb-4 flex items-center gap-2">
                        <span className="bg-emerald-500/20 p-1 rounded">💪</span> Execução Correta
                      </h4>
                      <ul className="space-y-3">
                        {executionGuide.steps.map((step, i) => (
                          <li key={i} className="flex gap-3 text-slate-300 text-sm">
                            <span className="text-emerald-500 font-bold">{i+1}.</span>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-2xl">
                      <h4 className="text-red-400 font-bold mb-3 text-sm">⚠️ Evite estes Erros</h4>
                      <ul className="space-y-2">
                        {executionGuide.commonMistakes.map((m, i) => (
                          <li key={i} className="text-xs text-red-200/70 flex gap-2">
                             <span>•</span> {m}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <a 
                      href={executionGuide.videoSearchUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-2xl transition-all"
                    >
                      <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg>
                      Ver Referência em Vídeo
                    </a>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
