
import React from 'react';
import { BMIResult as BMIResultType } from '../types';

interface BMIResultProps {
  result: BMIResultType;
}

export const BMIResult: React.FC<BMIResultProps> = ({ result }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl animate-fade-in overflow-hidden relative">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="relative flex items-center justify-center">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
            <circle 
              cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" 
              strokeDasharray={364.4} 
              strokeDashoffset={364.4 - (Math.min(result.score, 40) / 40) * 364.4}
              className={`${result.color} transition-all duration-1000 ease-out`}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-bold text-white">{result.score}</span>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">IMC</span>
          </div>
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h3 className={`text-2xl font-bold mb-1 ${result.color}`}>{result.category}</h3>
          <p className="text-slate-400 leading-relaxed text-sm">{result.interpretation}</p>
          <div className="mt-4 flex gap-1 justify-center md:justify-start">
             {[16, 20, 26, 31].map(v => (
               <div key={v} className={`h-1 flex-1 rounded-full ${result.score > v ? result.color : 'bg-slate-800'}`} />
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};
