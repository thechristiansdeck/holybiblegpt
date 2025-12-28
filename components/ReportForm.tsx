
import React, { useState } from 'react';

interface ReportFormProps {
  onClose: () => void;
}

const ReportForm: React.FC<ReportFormProps> = ({ onClose }) => {
  const [reason, setReason] = useState('Confusing');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would POST to a feedback API
    console.log('Report submitted:', { reason, note });
    setSubmitted(true);
    setTimeout(onClose, 2000);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
        <div className="glass-dark border border-emerald-500/30 p-12 rounded-[2.5rem] text-center space-y-4 animate-in zoom-in-95">
          <span className="text-4xl">✓</span>
          <h2 className="accent-font text-2xl font-bold text-emerald-400 uppercase tracking-widest">Report Received</h2>
          <p className="text-stone-500 text-xs uppercase tracking-widest">We review feedback and improve the app.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg glass-dark border border-white/10 rounded-[2.5rem] p-10 space-y-8 animate-in slide-in-from-bottom-8 duration-500 shadow-2xl">
        <button onClick={onClose} className="absolute top-6 right-8 text-stone-600 hover:text-white transition-colors">✕</button>
        
        <header className="text-center space-y-2">
          <h2 className="accent-font text-xl font-bold gold-gradient-text uppercase tracking-widest">Report an Issue</h2>
          <p className="text-[10px] text-stone-600 uppercase tracking-widest">Help us maintain accuracy and clarity</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Reason</label>
            <select 
              value={reason} 
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-stone-900 border border-white/5 rounded-xl px-4 py-3 text-sm text-stone-200 focus:outline-none focus:border-[#D4AF37] transition-all"
            >
              <option>Inaccurate Reference</option>
              <option>Confusing AI Response</option>
              <option>Technical Bug</option>
              <option>Content Concern</option>
              <option>Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Details</label>
            <textarea 
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What looks wrong or confusing?"
              className="w-full bg-stone-900 border border-white/5 rounded-xl px-4 py-3 text-sm text-stone-200 focus:outline-none focus:border-[#D4AF37] transition-all italic"
            />
          </div>

          <p className="text-[9px] text-stone-700 text-center uppercase tracking-widest leading-relaxed">
            If something looks wrong or confusing, please report it. We review feedback and improve the app.
          </p>

          <button 
            type="submit"
            className="w-full bg-[#D4AF37] text-black font-bold py-4 rounded-xl uppercase tracking-widest text-xs hover:scale-[1.02] transition-all shadow-xl"
          >
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportForm;
