
import React from 'react';

const AboutView: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-12 max-w-2xl mx-auto w-full space-y-12">
      <header className="text-center space-y-4">
        <h2 className="accent-font text-3xl font-bold gold-gradient-text uppercase tracking-widest">About Holy Bible GPT</h2>
        <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent mx-auto" />
      </header>

      <section className="glass-dark border border-white/5 p-10 rounded-[2.5rem] space-y-8 shadow-2xl text-center">
        <p className="bible-font text-xl text-stone-200 leading-relaxed font-light italic">
          “Holy Bible GPT exists to help people read the Bible and grow closer to God. Scripture remains the final authority. The app helps explain. The Bible speaks Truth.”
        </p>

        <div className="space-y-6 pt-6 border-t border-white/5">
          <h3 className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">Our Mission</h3>
          <ul className="space-y-4 text-sm text-stone-400 font-bold uppercase tracking-widest">
            <li>Help believers read daily</li>
            <li>Help believers understand Scripture</li>
            <li>Help believers love Jesus more</li>
          </ul>
        </div>

        <div className="space-y-4 pt-6 border-t border-white/5">
          <h3 className="text-[10px] font-bold text-stone-600 uppercase tracking-widest">A Note on AI</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            AI assists with teaching. AI does not replace Scripture. Always check everything with the Bible.
          </p>
        </div>

        <footer className="pt-8">
          <p className="text-[10px] font-bold text-stone-700 uppercase tracking-[0.4em]">To God be the glory.</p>
        </footer>
      </section>
    </div>
  );
};

export default AboutView;
