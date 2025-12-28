
import React from 'react';

interface HeaderProps {
  onMenuToggle: () => void;
  onShowSearch: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onMenuToggle,
  onShowSearch
}) => {
  return (
    <header className="glass-dark border-b border-white/5 sticky top-0 z-50 py-3 px-4 sm:px-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <button 
          onClick={onMenuToggle}
          className="p-2 bg-white/5 rounded-lg text-stone-500 hover:text-[#D4AF37] transition-all"
          aria-label="Toggle Menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-stone-900 rounded-xl flex items-center justify-center border border-white/10 shadow-lg relative overflow-hidden shrink-0">
            <span className="text-lg sm:text-xl text-[#D4AF37] relative z-10" aria-hidden="true">♰</span>
          </div>
          <h1 className="text-sm sm:text-lg font-bold accent-font tracking-[0.1em] gold-gradient-text leading-tight uppercase">Holy Bible GPT</h1>
        </div>
        
        <button 
          onClick={onShowSearch}
          className="p-2 bg-white/5 rounded-lg text-stone-500 hover:text-[#D4AF37] transition-all"
          aria-label="Search Scripture"
        >
          🔍
        </button>
      </div>
    </header>
  );
};

export default Header;
