
import React from 'react';

interface HistoricalWarningProps {
  onContinue: () => void;
  onGoBack: () => void;
}

const HistoricalWarning: React.FC<HistoricalWarningProps> = ({ onContinue, onGoBack }) => {
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
      <div className="relative w-full max-w-xl glass-dark border border-[#D4AF37]/20 rounded-[3rem] p-10 md:p-14 space-y-10 shadow-2xl animate-in zoom-in-95 duration-500">
        <header className="text-center space-y-4">
          <div className="w-16 h-16 bg-stone-900 rounded-2xl flex items-center justify-center border border-white/10 mx-auto mb-4">
            <span className="text-stone-500 text-3xl">📜</span>
          </div>
          <h2 className="accent-font text-2xl font-bold gold-gradient-text uppercase tracking-widest leading-tight">Historical Context Warning</h2>
        </header>

        <section className="space-y-6 text-center">
          <p className="text-sm text-stone-300 leading-relaxed italic">
            “These writings are not part of the Holy Bible. They are historical and educational. 
            They can help you understand background and context. They are not equal to Scripture. 
            Always treat the Bible as your final authority.”
          </p>
        </section>

        <div className="flex flex-col gap-4">
          <button 
            onClick={onContinue}
            className="w-full bg-[#D4AF37] text-black font-bold py-5 rounded-2xl uppercase tracking-widest text-xs shadow-xl hover:scale-[1.02] transition-all"
          >
            Continue to Study
          </button>
          <button 
            onClick={onGoBack}
            className="w-full bg-stone-900 border border-white/10 text-stone-500 font-bold py-5 rounded-2xl uppercase tracking-widest text-xs hover:bg-stone-800 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoricalWarning;
