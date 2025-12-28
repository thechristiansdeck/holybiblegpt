
import React, { useState, useEffect } from 'react';
import { storage } from '../services/storageService';
import { Translation, AppTab } from '../types';

interface HomeViewProps {
  onOpenPassage: (book: string, chapter: string, verse?: string) => void;
  onTabChange: (tab: AppTab) => void;
  translation: Translation;
}

const HomeView: React.FC<HomeViewProps> = ({ onOpenPassage, onTabChange, translation }) => {
  const settings = storage.getSettings();
  const today = new Date().toLocaleDateString();
  const [completed, setCompleted] = useState(storage.getProgress().includes(today));
  const streak = storage.getStreak();
  const remainingAI = storage.getRemainingAI();
  
  const encouragements = [
    { ref: "Philippians 4:13", text: "I can do all things through Christ which strengtheneth me.", focus: "Strength" },
    { ref: "Joshua 1:9", text: "Be strong and of a good courage; be not afraid, neither be thou dismayed.", focus: "Courage" },
    { ref: "Matthew 11:28", text: "Come unto me, all ye that labour and are heavy laden, and I will give you rest.", focus: "Rest" },
    { ref: "Romans 8:28", text: "And we know that all things work together for good to them that love God.", focus: "Trust" }
  ];

  const dailyVerse = encouragements[new Date().getDate() % encouragements.length];

  const handleComplete = () => {
    storage.markDayComplete(today);
    setCompleted(true);
  };

  const handleResume = () => {
    if (settings.lastRead) {
      onOpenPassage(settings.lastRead.book, settings.lastRead.chapter, settings.lastRead.verse.toString());
    } else {
      onOpenPassage("John", "1");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-12 lg:py-16 max-w-6xl mx-auto w-full space-y-12 pb-32">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
        <div className="space-y-1">
          <h2 className="accent-font text-2xl md:text-3xl font-bold gold-gradient-text uppercase tracking-widest leading-none">My Walk</h2>
          <p className="text-[10px] text-stone-600 uppercase tracking-[0.4em]">Daily Discipleship Dashboard</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-[#D4AF37]/5 px-6 py-4 rounded-2xl border border-[#D4AF37]/20 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
             <span className="text-2xl">🔥</span>
             <div className="flex flex-col">
               <span className="text-[8px] font-bold text-[#D4AF37] uppercase tracking-widest leading-none">Streak</span>
               <span className="text-xl font-bold text-stone-200 leading-none mt-1.5">{streak} Days</span>
             </div>
          </div>
          <div className="flex items-center gap-3 bg-white/5 px-6 py-4 rounded-2xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
             <div className="flex flex-col">
               <span className="text-[8px] font-bold text-stone-500 uppercase tracking-widest leading-none">AI Credits</span>
               <span className="text-xl font-bold text-stone-400 leading-none mt-1.5">{remainingAI}</span>
             </div>
          </div>
        </div>
      </header>

      {/* Daily Focus Card */}
      <section className="glass-dark border border-white/5 rounded-[3rem] p-10 md:p-14 shadow-[0_40px_80px_rgba(0,0,0,0.6)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 text-[12rem] accent-font opacity-[0.03] pointer-events-none select-none group-hover:opacity-[0.05] transition-opacity duration-700">
          {dailyVerse.focus[0]}
        </div>
        <div className="relative space-y-10">
          <div className="flex items-center gap-6">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
            <span className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.5em]">Today's Focus: {dailyVerse.focus}</span>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
          </div>
          <p className="bible-font text-3xl md:text-5xl lg:text-6xl text-stone-100 leading-[1.15] italic font-light">"{dailyVerse.text}"</p>
          <div className="flex items-center justify-between pt-8 border-t border-white/5">
             <span className="text-xs font-bold text-stone-600 tracking-[0.2em] uppercase">— {dailyVerse.ref}</span>
             <button onClick={() => onOpenPassage(dailyVerse.ref.split(' ')[0], "1")} className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest hover:text-white transition-colors py-2 px-4 bg-white/5 rounded-lg border border-white/5">Study Chapter →</button>
          </div>
        </div>
      </section>

      {/* Resume Card (Prominent) */}
      <button 
        onClick={handleResume}
        className="w-full flex items-center justify-between gap-8 glass-dark border border-white/10 p-10 md:p-12 rounded-[3rem] hover:border-[#D4AF37]/40 transition-all duration-500 text-left group shadow-[0_30px_60px_rgba(0,0,0,0.5)] overflow-hidden relative"
      >
        <div className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-[#D4AF37]/5 to-transparent pointer-events-none" />
        <div className="flex items-center gap-10 relative z-10">
          <div className="w-24 h-24 bg-[#D4AF37]/10 rounded-[2rem] flex items-center justify-center text-5xl group-hover:scale-110 group-hover:rotate-2 transition-all duration-500 shadow-inner border border-[#D4AF37]/10">📖</div>
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.4em]">Resume Your Journey</h4>
            <p className="text-2xl md:text-3xl font-bold text-stone-100 tracking-tight leading-tight">
              {settings.lastRead ? `${settings.lastRead.book} ${settings.lastRead.chapter}:${settings.lastRead.verse}` : 'Open the Sacred Word'}
            </p>
          </div>
        </div>
        <span className="text-3xl text-stone-700 group-hover:text-[#D4AF37] group-hover:translate-x-4 transition-all duration-500">→</span>
      </button>

      {/* Quick Access Grid */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-8">
        {[
          { id: 'prayer', label: 'Petitions', icon: '🙏' },
          { id: 'theology', label: 'Theology', icon: '🏛️' },
          { id: 'learn', label: 'Timeline', icon: '📜' },
          { id: 'kids', label: 'Kids Mode', icon: '🎨' }
        ].map(item => (
          <button 
            key={item.id}
            onClick={() => onTabChange(item.id as AppTab)}
            className="flex flex-col items-center gap-5 p-10 glass-dark border border-white/5 rounded-[2.5rem] hover:bg-white/5 hover:border-[#D4AF37]/30 transition-all duration-500 shadow-2xl group"
          >
            <span className="text-4xl group-hover:scale-125 group-hover:-translate-y-2 transition-transform duration-500">{item.icon}</span>
            <span className="text-[10px] font-bold text-stone-600 uppercase tracking-[0.3em] group-hover:text-[#D4AF37] transition-colors">{item.label}</span>
          </button>
        ))}
      </section>

      {/* Reading Progress Action */}
      <section className="pt-8">
        <div className={`p-12 rounded-[3.5rem] border transition-all duration-700 flex flex-col sm:flex-row items-center justify-between gap-8 ${completed ? 'bg-emerald-950/10 border-emerald-900/40' : 'glass-dark border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.4)]'}`}>
          <div className="space-y-3 text-center sm:text-left">
            <h4 className={`text-[10px] font-bold uppercase tracking-[0.4em] ${completed ? 'text-emerald-500' : 'text-stone-500'}`}>Reading Goal</h4>
            <p className="text-stone-300 text-lg md:text-xl italic font-light bible-font leading-relaxed">"Thy word is a lamp unto my feet, and a light unto my path."</p>
          </div>
          <button 
            onClick={handleComplete} 
            disabled={completed}
            className={`px-16 py-6 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-2xl ${completed ? 'text-emerald-500 border border-emerald-500/30 bg-emerald-500/5' : 'bg-[#D4AF37] text-black hover:scale-105 active:scale-95 hover:shadow-[#D4AF37]/30'}`}
          >
            {completed ? '✓ Today\'s Goal Complete' : 'Mark Goal Complete'}
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomeView;
