
import React, { useState } from 'react';

interface OnboardingProps {
  onAccept: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onAccept }) => {
  const [step, setStep] = useState(1);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else {
      localStorage.setItem('hbgpt_onboarding_accepted', 'true');
      onAccept();
    }
  };

  const screens = [
    {
      title: "Welcome",
      desc: "This app helps you read the Bible daily. Scripture holds final authority.",
      icon: "⛪"
    },
    {
      title: "Read",
      desc: "Pick a book. Pick a chapter. Start reading.",
      icon: "📖"
    },
    {
      title: "Study",
      desc: "Ask questions. Review notes. Compare passages.",
      icon: "⚙️"
    },
    {
      title: "Grow",
      desc: "Pray. Bookmark. Build daily habits.",
      icon: "🌱"
    }
  ];

  const current = screens[step - 1];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
      <div className="relative w-full max-w-xl glass-dark border border-[#D4AF37]/30 rounded-[3rem] p-10 md:p-14 space-y-10 shadow-2xl animate-in zoom-in-95 duration-500 flex flex-col items-center text-center">
        <header className="space-y-4">
          <div className="w-20 h-20 bg-stone-900 rounded-[2rem] flex items-center justify-center border border-white/10 mx-auto mb-6 shadow-2xl">
            <span className="text-4xl" aria-hidden="true">{current.icon}</span>
          </div>
          <h2 className="accent-font text-3xl font-bold gold-gradient-text uppercase tracking-widest">{current.title}</h2>
        </header>

        <section className="space-y-6">
          <p className="text-stone-400 text-lg leading-relaxed italic">
            {current.desc}
          </p>
        </section>

        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`h-1.5 rounded-full transition-all ${step === s ? 'w-8 bg-[#D4AF37]' : 'w-2 bg-stone-800'}`} />
          ))}
        </div>

        <button 
          onClick={handleNext}
          className="w-full bg-[#D4AF37] text-black font-bold py-5 rounded-2xl uppercase tracking-widest text-xs shadow-xl hover:scale-[1.02] transition-all active:scale-95"
        >
          {step === 4 ? "Start Now" : "Next Step"}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
