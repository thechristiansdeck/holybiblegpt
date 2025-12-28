
import React, { useState } from 'react';
import { storage } from '../services/storageService';

interface LibraryViewProps {
  onOpenPassage: (book: string, chapter: string, verse?: string) => void;
}

const LibraryView: React.FC<LibraryViewProps> = ({ onOpenPassage }) => {
  const [activeSub, setActiveSub] = useState<'bookmarks' | 'notes' | 'history'>('bookmarks');
  const bookmarks = storage.getBookmarks();
  const notes = storage.getNotes();
  const history = storage.getHistory();

  const handleExportNotes = () => {
    const entries = Object.entries(notes);
    if (entries.length === 0) return;

    let content = "Holy Bible GPT - My Spiritual Journal\n";
    content += "====================================\n\n";

    entries.forEach(([id, text]) => {
      content += `Ref: ${id.replace(/-/g, ' ')}\n`;
      content += `Note: ${text}\n`;
      content += "------------------------------------\n\n";
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HolyBibleGPT_Notes_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-12 max-w-5xl mx-auto w-full space-y-12 pb-32">
      <header className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <h2 className="accent-font text-3xl font-bold gold-gradient-text uppercase tracking-widest">My Sanctuary</h2>
          <p className="text-xs text-stone-500 uppercase tracking-[0.3em] mt-2">Saved Grace & Wisdom</p>
        </div>
        <div className="flex bg-stone-900/50 p-1 rounded-xl border border-white/5">
          {['bookmarks', 'notes', 'history'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveSub(tab as any)}
              className={`px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                activeSub === tab ? 'bg-white/10 text-white shadow-xl' : 'text-stone-500 hover:text-stone-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {activeSub === 'notes' && Object.keys(notes).length > 0 && (
        <div className="flex justify-end">
          <button 
            onClick={handleExportNotes}
            className="px-6 py-3 bg-stone-900 border border-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#D4AF37]/10 transition-all active:scale-95"
          >
            Export My Notes
          </button>
        </div>
      )}

      <div className="grid gap-6">
        {activeSub === 'bookmarks' && (
          <div className="grid sm:grid-cols-2 gap-6">
            {bookmarks.length === 0 ? (
              <p className="text-stone-600 text-sm italic col-span-full py-12 text-center">No verses bookmarked yet. Start your journey in the Reader.</p>
            ) : (
              bookmarks.map((b, i) => (
                <button
                  key={i}
                  onClick={() => onOpenPassage(b.book, b.chapter, b.verse.toString())}
                  className="glass-dark border border-white/5 p-6 rounded-2xl text-left hover:border-[#D4AF37]/40 transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">{b.book} {b.chapter}:{b.verse}</span>
                    <span className="text-[9px] text-stone-700">{new Date(b.timestamp).toLocaleDateString()}</span>
                  </div>
                  <p className="bible-font text-lg text-stone-300 leading-relaxed group-hover:text-stone-100 transition-colors">Tap to read the full chapter...</p>
                </button>
              ))
            )}
          </div>
        )}

        {activeSub === 'notes' && (
          <div className="space-y-6">
            {Object.keys(notes).length === 0 ? (
              <p className="text-stone-600 text-sm italic py-12 text-center">Your spiritual journal is empty. Add notes to any verse while reading.</p>
            ) : (
              Object.entries(notes).map(([id, text]) => (
                <div key={id} className="glass-dark border border-white/5 p-8 rounded-3xl space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.3em]">{id.replace(/-/g, ' ')}</span>
                  </div>
                  <p className="text-stone-300 text-sm italic leading-relaxed whitespace-pre-wrap">{text}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeSub === 'history' && (
          <div className="space-y-2">
            {history.length === 0 ? (
              <p className="text-stone-600 text-sm italic py-12 text-center">No reading history yet.</p>
            ) : (
              history.map((h, i) => (
                <button
                  key={i}
                  onClick={() => onOpenPassage(h.book, h.chapter)}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/5 rounded-xl border-b border-white/5 last:border-0 transition-colors group"
                >
                  <span className="text-stone-300 font-medium group-hover:text-[#D4AF37] transition-colors">{h.book} {h.chapter}</span>
                  <span className="text-[10px] text-stone-700 uppercase tracking-widest">{new Date(h.timestamp).toLocaleDateString()}</span>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryView;
