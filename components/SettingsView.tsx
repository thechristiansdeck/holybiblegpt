
import React, { useState } from 'react';
import { storage } from '../services/storageService';
import { downloadFullKJV } from '../services/bibleService';
import { AppSettings, AppTab } from '../types';

interface SettingsViewProps {
  onTabChange: (tab: AppTab) => void;
  onReport?: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ onTabChange, onReport }) => {
  const [settings, setSettings] = useState<AppSettings>(storage.getSettings());
  const [syncProgress, setSyncProgress] = useState<number | null>(null);
  const aiUsage = storage.getAIUsage();

  const update = (newSettings: Partial<AppSettings>) => {
    const s = { ...settings, ...newSettings };
    setSettings(s);
    storage.saveSettings(s);
  };

  const startSync = async () => {
    setSyncProgress(0);
    try { await downloadFullKJV(setSyncProgress); } 
    catch { setSyncProgress(null); }
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-12 max-w-2xl mx-auto w-full space-y-12 pb-24">
      <header className="text-center">
        <h2 className="accent-font text-3xl font-bold gold-gradient-text uppercase tracking-widest">Settings</h2>
        <p className="text-[10px] text-stone-700 uppercase tracking-[0.4em] mt-2">v3.3.0 • Safety & Trust Build</p>
      </header>

      <section className="space-y-10">
        {/* AI Analytics */}
        <div className="glass-dark border border-[#D4AF37]/20 p-8 rounded-[2rem] space-y-6 shadow-2xl">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]">Usage Sanctuary</h3>
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-stone-900 p-4 rounded-xl text-center border border-white/5">
                <div className="text-2xl font-bold text-stone-200">{aiUsage.count}</div>
                <div className="text-[8px] text-stone-600 uppercase tracking-widest mt-1">Daily AI Queries</div>
             </div>
             <div className="bg-stone-900 p-4 rounded-xl text-center border border-white/5">
                <div className="text-2xl font-bold text-[#D4AF37]">{storage.getRemainingAI()}</div>
                <div className="text-[8px] text-stone-600 uppercase tracking-widest mt-1">Credits Remaining</div>
             </div>
          </div>
          <p className="text-[9px] text-stone-500 uppercase tracking-widest text-center italic">Most Bible reading works offline. AI needs internet.</p>
        </div>

        {/* Safety Section */}
        <div className="glass-dark border border-white/5 p-8 rounded-[2rem] space-y-6">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500">Safety & Family</h3>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-sm text-stone-300 block">Kids Mode</span>
              <span className="text-[9px] text-stone-600 uppercase tracking-widest">Simple words • Shorter answers</span>
            </div>
            <button onClick={() => update({ kidsMode: !settings.kidsMode })} className={`w-14 h-7 rounded-full relative transition-colors ${settings.kidsMode ? 'bg-[#D4AF37]' : 'bg-stone-900'}`} aria-label="Toggle Kids Mode">
              <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${settings.kidsMode ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
        </div>

        {/* Your Data Section */}
        <div className="glass-dark border border-white/5 p-8 rounded-[2rem] space-y-8">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500">Your Data</h3>
          
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-[9px] font-bold text-[#D4AF37] uppercase tracking-widest">What saves on your device:</h4>
              <ul className="text-xs text-stone-400 space-y-2">
                <li>• Reading progress</li>
                <li>• Bookmarks</li>
                <li>• Notes</li>
                <li>• Highlights</li>
                <li>• Install preferences</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-[9px] font-bold text-stone-600 uppercase tracking-widest">What saves on our servers:</h4>
              <ul className="text-xs text-stone-400 space-y-2">
                <li>• Anonymous usage stats</li>
                <li>• Error logs for fixing bugs</li>
                <li>• AI questions without personal info</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="glass-dark border border-white/5 p-8 rounded-[2rem] space-y-8">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500">Reading Experience</h3>
          <div className="space-y-4">
            <div className="flex justify-between text-xs text-stone-400"><label htmlFor="font-size">Font Size</label><span>{settings.fontSize}px</span></div>
            <input id="font-size" type="range" min="14" max="48" value={settings.fontSize} onChange={(e) => update({ fontSize: parseInt(e.target.value) })} className="w-full h-2 bg-stone-900 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-stone-300">Night Reading Mode</span>
            <button onClick={() => update({ nightMode: !settings.nightMode })} className={`w-14 h-7 rounded-full relative transition-colors ${settings.nightMode ? 'bg-[#D4AF37]' : 'bg-stone-900'}`} aria-label="Toggle Night Mode">
              <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${settings.nightMode ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
        </div>

        <div className="glass-dark border border-white/5 p-8 rounded-[2rem] space-y-6 text-center">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500">Sacred Repository</h3>
          <p className="text-xs text-stone-500 leading-relaxed px-4">Download the full KJV for 100% offline access.</p>
          <button onClick={startSync} disabled={syncProgress !== null} className={`w-full py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${syncProgress !== null ? 'bg-stone-900 text-stone-700' : 'bg-[#D4AF37] text-black shadow-xl hover:scale-[1.01] active:scale-95'}`}>
            {syncProgress !== null ? `Syncing Scripture... ${syncProgress}%` : 'Download Offline KJV'}
          </button>
        </div>

        <div className="grid gap-4">
          <button onClick={() => onTabChange('privacy')} className="w-full py-4 glass-dark border border-white/5 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-stone-500 hover:text-stone-300 transition-colors">Privacy Sanctuary</button>
          <button onClick={() => window.location.href = "mailto:thechristiansdeck@gmail.com?subject=Bug%20Report%20Holy%20Bible%20GPT"} className="w-full py-4 glass-dark border border-white/5 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-stone-500 hover:text-[#D4AF37] transition-colors">Report a problem</button>
        </div>
      </section>
    </div>
  );
};

export default SettingsView;
