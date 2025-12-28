
import React from 'react';

interface NotFoundViewProps {
  onGoHome: () => void;
}

const NotFoundView: React.FC<NotFoundViewProps> = ({ onGoHome }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-8">
      <div className="text-6xl" aria-hidden="true">🕊️</div>
      <header className="space-y-2">
        <h2 className="accent-font text-4xl font-bold gold-gradient-text uppercase tracking-widest">Page Not Found</h2>
        <p className="text-stone-500 text-xs uppercase tracking-[0.3em]">Lost in the wilderness</p>
      </header>
      <p className="text-stone-400 text-sm max-w-xs italic">
        "I have gone astray like a lost sheep; seek thy servant; for I do not forget thy commandments." — Psalm 119:176
      </p>
      <button 
        onClick={onGoHome}
        className="px-12 py-4 bg-[#D4AF37] text-black font-bold rounded-xl uppercase tracking-widest text-[10px] shadow-xl hover:scale-105 transition-all"
      >
        Return to Home
      </button>
    </div>
  );
};

export default NotFoundView;
