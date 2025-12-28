
import React, { useState } from 'react';
import { Translation } from '../types';

interface SearchViewProps {
  onOpenPassage: (book: string, chapter: string, verse?: string) => void;
  translation: Translation;
}

const SearchView: React.FC<SearchViewProps> = ({ onOpenPassage, translation }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ book: string; chapter: string; verse?: string; text: string }[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Simple Verse Reference Parser
    // Matches: "John 3:16" or "Genesis 1"
    const refRegex = /^([1-3]?\s?[a-zA-Z]+)\s?(\d+)(?::(\d+))?$/;
    const match = query.trim().match(refRegex);

    if (match) {
      const bookName = match[1].trim();
      const chapter = match[2];
      const verse = match[3];

      onOpenPassage(bookName, chapter, verse);
      return;
    }

    // Keyword Search (Placeholder for more complex logic)
    // In this app, keyword search could call the Gemini API for semantic results
    // but for now, we'll suggest using the Study tools for word studies.
    setResults([
      { 
        book: "Study Tool", 
        chapter: "AI", 
        text: `To search for the keyword "${query}", please use the "Study" tab and ask Holy Bible GPT for a word analysis or cross-references.` 
      }
    ]);
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-12 max-w-2xl mx-auto w-full space-y-8">
      <header className="text-center space-y-2">
        <h2 className="accent-font text-2xl font-bold gold-gradient-text uppercase tracking-widest">Scripture Search</h2>
        <p className="text-[10px] text-stone-600 uppercase tracking-widest">Find verses by reference or keyword</p>
      </header>

      <form onSubmit={handleSearch} className="relative group">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. John 3:16 or 'Grace'"
          className="w-full bg-stone-900/50 border border-white/10 rounded-2xl px-6 py-4 text-stone-200 focus:outline-none focus:border-[#D4AF37] bible-font text-lg transition-all"
          aria-label="Search Bible"
        />
        <button 
          type="submit"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D4AF37] hover:scale-110 transition-transform"
        >
          🔍
        </button>
      </form>

      <div className="space-y-4">
        {results.map((res, i) => (
          <div key={i} className="glass-dark border border-white/5 p-6 rounded-2xl space-y-3">
             <div className="flex justify-between items-center">
               <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest">{res.book} {res.chapter}{res.verse ? `:${res.verse}` : ''}</span>
             </div>
             <p className="text-stone-400 text-sm italic leading-relaxed">{res.text}</p>
          </div>
        ))}
      </div>

      <div className="text-center pt-8">
        <p className="text-[9px] text-stone-700 uppercase tracking-widest leading-relaxed">
          Tip: Type a full reference (e.g. Genesis 1:1) to jump directly to that passage.
        </p>
      </div>
    </div>
  );
};

export default SearchView;
