
import React, { useState } from 'react';
import { Message, Role, PassageLink } from '../types';

interface MessageBubbleProps {
  message: Message;
  onOpenReader: (link: PassageLink) => void;
  onReport?: () => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onOpenReader, onReport }) => {
  const isBot = message.role === Role.BOT;
  const [feedback, setFeedback] = useState<'helpful' | 'not-helpful' | null>(null);

  const parseContent = (text: string) => {
    const links: PassageLink[] = [];
    const regex = /\[link_to_passage\s+book="([^"]+)"\s+chapter="([^"]+)"\s+verses="([^"]+)"\]/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      links.push({ book: match[1], chapter: match[2], verses: match[3] });
    }
    const cleanText = text.replace(regex, '').trim();
    return { cleanText, links };
  };

  const { cleanText, links } = parseContent(message.text);

  return (
    <div className={`flex w-full mb-10 ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-[95%] sm:max-w-[85%] px-6 py-6 rounded-[2rem] relative group transition-all ${
        isBot 
          ? 'glass-dark border border-white/5 shadow-2xl text-stone-200' 
          : 'bg-stone-900 border border-white/10 text-stone-100 font-medium shadow-xl'
      }`}>
        {isBot && (
          <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-stone-950 rounded-xl flex items-center justify-center border border-white/10 shadow-inner">
                <span className="text-[#D4AF37] text-xs">♰</span>
              </div>
              <span className="text-[10px] font-bold text-stone-600 uppercase tracking-[0.3em]">Holy Bible GPT Response</span>
            </div>
          </div>
        )}

        <div className={`whitespace-pre-wrap leading-relaxed ${isBot ? 'bible-font text-xl font-light' : 'text-sm font-medium'}`}>
          {cleanText}
        </div>

        {isBot && (
          <div className="mt-8 pt-6 border-t border-white/5 space-y-6">
            <p className="text-[10px] text-[#D4AF37] italic font-medium">
              Check everything with Scripture. AI makes mistakes.
            </p>
            
            {links.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {links.map((link, idx) => (
                  <button 
                    key={idx}
                    className="flex items-center gap-2 px-4 py-2.5 bg-stone-950 border border-white/5 rounded-xl text-[10px] font-bold text-[#D4AF37] hover:border-[#D4AF37]/40 hover:bg-stone-900 transition-all shadow-lg"
                    onClick={() => onOpenReader(link)}
                  >
                    📖 Read {link.book} {link.chapter}
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4 pt-4 border-t border-white/5">
              <span className="text-[9px] text-stone-600 uppercase tracking-widest font-bold">Feedback:</span>
              <button 
                onClick={() => setFeedback('helpful')}
                className={`text-[10px] uppercase font-bold px-3 py-1 rounded-full border transition-all ${feedback === 'helpful' ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]' : 'border-white/5 text-stone-600 hover:text-stone-400'}`}
              >
                Helpful
              </button>
              <button 
                onClick={() => setFeedback('not-helpful')}
                className={`text-[10px] uppercase font-bold px-3 py-1 rounded-full border transition-all ${feedback === 'not-helpful' ? 'bg-red-500/20 border-red-500 text-red-400' : 'border-white/5 text-stone-600 hover:text-stone-400'}`}
              >
                Not Helpful
              </button>
            </div>
            
            <footer className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                 <div className="w-6 h-6 rounded-full bg-stone-900 flex items-center justify-center text-[10px] text-stone-600">⚠</div>
                 <span className="text-[9px] font-bold text-stone-500 uppercase tracking-widest">Verify with Scripture • Study Actively</span>
              </div>
              <div className="flex gap-2">
                 <button onClick={onReport} className="text-[8px] font-bold text-stone-700 hover:text-red-500 uppercase tracking-widest p-2 transition-colors">Report an issue</button>
              </div>
            </footer>
          </div>
        )}

        <div className={`mt-4 text-[9px] ${isBot ? 'text-stone-800' : 'text-stone-600'} uppercase font-bold tracking-widest`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
