
import React, { useState, useEffect, useRef } from 'react';
import { Translation, ReaderState, AppMode, Highlight } from '../types';
import { getVerseText, VerseData, BIBLE_BOOKS, HISTORICAL_BOOKS, prefetchAdjacent, isChapterOffline } from '../services/bibleService';
import { MODE_LABELS, HISTORICAL_INTRODUCTIONS } from '../constants';
import { storage } from '../services/storageService';

interface BibleReaderProps {
  state: ReaderState;
  translation: Translation;
  onClose: () => void;
  onNavigate: (book: string, chapter: string) => void;
  onStudyVerse?: (mode: AppMode, verse: number) => void;
  onReport?: () => void;
}

const ALL_BOOKS = [...BIBLE_BOOKS, ...HISTORICAL_BOOKS];

const BibleReader: React.FC<BibleReaderProps> = ({
  state,
  translation,
  onNavigate,
  onStudyVerse,
  onReport,
  onClose
}) => {
  const [content, setContent] = useState<VerseData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [highlights, setHighlights] = useState<Highlight[]>([]);

  const settings = storage.getSettings();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isHistorical = HISTORICAL_BOOKS.some(b => b.name === state.book);
    if (isHistorical && state.chapter === '1' && !loading) {
      setShowIntro(true);
    } else {
      setShowIntro(false);
      loadVerses();
    }
    storage.addHistory({ book: state.book, chapter: state.chapter, timestamp: Date.now() });
    prefetchAdjacent(translation, state.book, state.chapter);
    checkOfflineStatus();
    setHighlights(storage.getHighlights());
  }, [state.book, state.chapter, translation]);

  const checkOfflineStatus = async () => {
    const offline = await isChapterOffline(translation, state.book, state.chapter);
    setIsOffline(offline);
  };

  const loadVerses = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getVerseText(translation, state.book, state.chapter);
      setContent(data);
    } catch {
      setError("Scripture connection failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerseClick = (num: number) => {
    setSelectedVerse(selectedVerse === num ? null : num);
    storage.saveLastRead(state.book, state.chapter, num);
  };

  const applyHighlight = (color: string) => {
    if (!selectedVerse) return;
    const h: Highlight = { book: state.book, chapter: state.chapter, verse: selectedVerse, color, timestamp: Date.now() };
    storage.addHighlight(h);
    setHighlights(storage.getHighlights());
    setSelectedVerse(null);
  };

  const getVerseHighlight = (num: number) => {
    return highlights.find(h => h.book === state.book && h.chapter === state.chapter && h.verse === num)?.color;
  };

  const currentBookData = ALL_BOOKS.find(b => b.name === state.book) || ALL_BOOKS[0];

  if (showIntro) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-black">
        <div className="glass-dark border border-[#D4AF37]/20 p-10 rounded-[2.5rem] max-w-xl space-y-8 shadow-2xl">
          <header className="text-center space-y-4">
            <div className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.4em]">Historical Context</div>
            <h2 className="accent-font text-4xl gold-gradient-text uppercase tracking-widest">{state.book}</h2>
          </header>
          <p className="bible-font text-stone-300 leading-relaxed italic text-center text-lg">
            “{HISTORICAL_INTRODUCTIONS[state.book] || "A valuable historical witness."}”
          </p>
          <button onClick={() => { setShowIntro(false); loadVerses(); }} className="w-full bg-[#D4AF37] text-black font-bold py-5 rounded-2xl uppercase tracking-widest text-xs">Enter Study</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full relative ${settings.nightMode ? 'bg-stone-950' : 'bg-transparent'}`}>
      <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between glass-dark z-20">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
          <select value={state.book} onChange={(e) => onNavigate(e.target.value, '1')} className="text-[10px] font-bold bg-stone-900 border border-white/10 rounded-lg px-3 py-1.5 focus:outline-none text-stone-300">
            <optgroup label="OT">{BIBLE_BOOKS.slice(0, 39).map(b => <option key={b.name} value={b.name}>{b.name}</option>)}</optgroup>
            <optgroup label="NT">{BIBLE_BOOKS.slice(39).map(b => <option key={b.name} value={b.name}>{b.name}</option>)}</optgroup>
            <optgroup label="Hist">{HISTORICAL_BOOKS.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}</optgroup>
          </select>
          <select value={state.chapter} onChange={(e) => onNavigate(state.book, e.target.value)} className="text-[10px] font-bold bg-stone-900 border border-white/10 rounded-lg px-3 py-1.5 focus:outline-none text-stone-300">
            {Array.from({ length: currentBookData.chapters }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
          </select>
          <span className={`text-[8px] uppercase tracking-widest font-bold ${isOffline ? 'text-emerald-500' : 'text-stone-600'}`}>
            {isOffline ? 'Offline' : 'Online'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onClose} className="p-2 text-stone-500 hover:text-[#D4AF37] flex items-center gap-2 transition-colors">
            <span className="text-xl">←</span> <span className="text-[10px] font-bold uppercase tracking-widest">Back</span>
          </button>
          <div className="h-4 w-px bg-white/10 mx-2"></div>
          <button onClick={() => onNavigate(state.book, (Math.max(1, parseInt(state.chapter) - 1)).toString())} className="p-2 text-stone-600 hover:text-white">←</button>
          <button onClick={() => onNavigate(state.book, (Math.min(currentBookData.chapters, parseInt(state.chapter) + 1)).toString())} className="p-2 text-stone-600 hover:text-white">→</button>
        </div>
      </div>

      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-4 md:px-0 py-12 scroll-smooth">
        <div className="max-w-3xl mx-auto w-full">
          <header className="mb-16 text-center space-y-4">
            <h2 className="accent-font text-5xl font-bold tracking-[0.1em] gold-gradient-text uppercase">{state.book} {state.chapter}</h2>
            <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-stone-700">Holy Scripture • {translation}</p>
          </header>

          <div className="space-y-0 relative">
            {content.map((v, idx) => {
              const hColor = getVerseHighlight(v.number);
              return (
                <div
                  key={v.number}
                  onClick={() => handleVerseClick(v.number)}
                  className={`group/verse relative flex flex-col gap-4 px-4 py-8 cursor-pointer transition-all ${selectedVerse === v.number ? 'bg-[#D4AF37]/10' : 'hover:bg-white/[0.01]'}`}
                >
                  <div className="flex gap-8">
                    <span className="text-[10px] font-bold text-stone-600 w-8 shrink-0">{v.number}</span>
                    <div className="flex-1">
                      <p
                        style={{ fontSize: `${settings.fontSize}px`, lineHeight: settings.lineHeight, backgroundColor: hColor || 'transparent' }}
                        className={`bible-font text-stone-200 ${idx === 0 && state.chapter === '1' ? 'drop-cap' : ''} ${hColor ? 'px-2 py-1 rounded' : ''}`}
                      >
                        {v.text}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Verse Tool Menu overlay */}
      {selectedVerse && (
        <div className="fixed inset-x-0 bottom-0 z-[60] p-6 animate-in slide-in-from-bottom-full duration-300">
          <div className="max-w-xl mx-auto glass-dark border border-[#D4AF37]/30 rounded-[2.5rem] p-6 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] space-y-6">
            <header className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.3em]">{state.book} {state.chapter}:{selectedVerse}</span>
              <button onClick={() => setSelectedVerse(null)} className="text-stone-600 hover:text-white p-1">✕</button>
            </header>

            <div className="grid grid-cols-4 gap-4">
              <button onClick={() => { navigator.clipboard.writeText(`${state.book} ${state.chapter}:${selectedVerse} - ${content.find(v => v.number === selectedVerse)?.text}`); setSelectedVerse(null); }} className="flex flex-col items-center gap-2 group">
                <span className="text-xl group-hover:scale-110 transition-transform">📋</span>
                <span className="text-[8px] font-bold text-stone-500 uppercase tracking-widest">Copy</span>
              </button>
              <button onClick={() => storage.addBookmark({ book: state.book, chapter: state.chapter, verse: selectedVerse!, timestamp: Date.now() })} className="flex flex-col items-center gap-2 group">
                <span className="text-xl group-hover:scale-110 transition-transform">🔖</span>
                <span className="text-[8px] font-bold text-stone-500 uppercase tracking-widest">Bookmark</span>
              </button>
              <button onClick={() => applyHighlight('#D4AF3733')} className="flex flex-col items-center gap-2 group">
                <span className="text-xl group-hover:scale-110 transition-transform">🖍️</span>
                <span className="text-[8px] font-bold text-stone-500 uppercase tracking-widest">Highlight</span>
              </button>
              <button onClick={() => {
                const text = prompt("Add a note:");
                if (text) storage.saveNote(`${state.book}-${state.chapter}-${selectedVerse}`, text);
                setSelectedVerse(null);
              }} className="flex flex-col items-center gap-2 group">
                <span className="text-xl group-hover:scale-110 transition-transform">📝</span>
                <span className="text-[8px] font-bold text-stone-500 uppercase tracking-widest">Note</span>
              </button>
            </div>

            <div className="h-px bg-white/5" />

            <div className="flex justify-center">
              <button
                onClick={() => { onStudyVerse?.(AppMode.THEOLOGIAN, selectedVerse!); setSelectedVerse(null); }}
                className="px-6 py-3 bg-[#D4AF37]/10 border border-[#D4AF37] rounded-xl text-[10px] font-bold text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all uppercase tracking-[0.2em] flex items-center gap-2"
              >
                <span>✨</span> Explain Verse
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BibleReader;
