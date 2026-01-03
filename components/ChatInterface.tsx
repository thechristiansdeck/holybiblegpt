
import React, { useState, useEffect, useRef } from 'react';
import { Role, Message, AppMode, Translation, PassageLink, AppTab } from '../types';
import { sendMessageStream } from '../services/aiService';
import MessageBubble from './MessageBubble';
import { storage } from '../services/storageService';

interface ChatInterfaceProps {
  currentTranslation: Translation;
  onOpenReader: (link: PassageLink) => void;
  currentMode: AppMode;
  pendingQuery?: string | null;
  isVerseSpecific?: boolean;
  onQueryProcessed?: () => void;
  onClose?: () => void;
  onReport?: () => void;
  onTabChange?: (tab: AppTab) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  currentTranslation,
  onOpenReader,
  currentMode,
  pendingQuery,
  isVerseSpecific,
  onQueryProcessed,
  onClose,
  onReport,
  onTabChange
}) => {
  const settings = storage.getSettings();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: Role.BOT,
      text: `Welcome to Bible Study. How can I help you understand the Word today?`,
      timestamp: Date.now(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (pendingQuery && !isLoading) {
      handleSend(pendingQuery);
      if (onQueryProcessed) onQueryProcessed();
    }
  }, [pendingQuery, isLoading]);

  const handleSend = async (text: string = input) => {
    const trimmedText = text.trim();
    if (!trimmedText || isLoading) return;

    const isPro = await storage.isPro();
    if (!isPro && !storage.canUseAI()) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: Role.BOT,
        text: "You reached today’s free limit. Upgrade to continue using study tools.",
        timestamp: Date.now(),
        isLimitMessage: true
      }]);
      return;
    }

    const userMessage: Message = { id: Date.now().toString(), role: Role.USER, text: trimmedText, timestamp: Date.now(), mode: currentMode };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const botMessageId = (Date.now() + 1).toString();
    const botMessagePlaceholder: Message = { id: botMessageId, role: Role.BOT, text: "", timestamp: Date.now(), mode: currentMode };
    setMessages(prev => [...prev, botMessagePlaceholder]);

    try {
      const history = messages
        .filter(m => m.id !== '1')
        .map(m => ({
          role: (m.role === Role.BOT ? 'assistant' : 'user') as 'assistant' | 'user',
          content: m.text
        }));
      history.push({ role: 'user', content: trimmedText });

      await sendMessageStream(
        currentMode,
        currentTranslation,
        settings.kidsMode,
        history,
        (chunk) => {
          setMessages(prev => prev.map(msg => msg.id === botMessageId ? { ...msg, text: chunk } : msg));
        }
      );
      storage.incrementAIUsage();
    } catch (error: any) {
      const errorMsg = "AI unavailable. Please continue with Bible study.";
      setMessages(prev => prev.map(msg => msg.id === botMessageId ? { ...msg, text: errorMsg } : msg));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-black">
      <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-stone-900/40">
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Study Center</span>
          <span className="text-[8px] text-stone-600 uppercase tracking-widest mt-0.5">
            {storage.canUseAI() ? `${storage.getRemainingAI()} daily questions left` : 'Daily limit reached'}
          </span>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 text-stone-500 hover:text-white" aria-label="Close Chat">✕</button>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-8 space-y-6 scroll-smooth">
        {messages.map(msg => <MessageBubble key={msg.id} message={msg} onOpenReader={onOpenReader} onReport={onReport} onUpgrade={() => onTabChange?.('settings')} />)}

        {isLoading && <div className="animate-pulse text-[#D4AF37] text-xs uppercase tracking-widest">Studying Scripture...</div>}
      </div>

      <div className="px-6 py-4 border-t border-white/5 bg-stone-900/20">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative max-w-2xl mx-auto mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={storage.canUseAI() ? "Type your question..." : "Limit reached. Keep reading."}
            disabled={!storage.canUseAI()}
            className="w-full pl-7 pr-16 py-4 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#D4AF37] text-stone-200 bible-font text-lg disabled:opacity-50"
          />
          <button type="submit" disabled={isLoading || !input.trim() || !storage.canUseAI()} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-[#D4AF37] text-black disabled:bg-stone-800 disabled:text-stone-600 transition-colors">
            ↑
          </button>
        </form>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 px-2">
          <p className="text-[9px] text-stone-600 uppercase tracking-widest text-center">
            AI is for explanation only. Scripture is the final authority.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
