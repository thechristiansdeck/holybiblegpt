
import React from 'react';

const GospelHarmonyView: React.FC = () => {
  const events = [
    { name: "Baptism of Jesus", matt: "3:13-17", mark: "1:9-11", luke: "3:21-22", john: "1:29-34" },
    { name: "The Temptation", matt: "4:1-11", mark: "1:12-13", luke: "4:1-13", john: "-" },
    { name: "Feeding the 5000", matt: "14:13-21", mark: "6:30-44", luke: "9:10-17", john: "6:1-14" },
    { name: "Peter's Confession", matt: "16:13-20", mark: "8:27-30", luke: "9:18-21", john: "6:66-71" },
    { name: "The Transfiguration", matt: "17:1-8", mark: "9:2-8", luke: "9:28-36", john: "-" },
    { name: "Lord's Supper", matt: "26:26-29", mark: "14:22-25", luke: "22:17-20", john: "13:1-30" },
    { name: "Crucifixion", matt: "27:32-56", mark: "15:21-41", luke: "23:26-49", john: "19:17-37" },
    { name: "Resurrection", matt: "28:1-10", mark: "16:1-8", luke: "24:1-12", john: "20:1-10" }
  ];

  return (
    <div className="flex-1 overflow-y-auto px-6 py-12 max-w-5xl mx-auto w-full space-y-12 pb-32">
      <header className="text-center space-y-4">
        <h2 className="accent-font text-3xl font-bold gold-gradient-text uppercase tracking-widest">Gospel Harmony</h2>
        <p className="text-[10px] text-stone-600 uppercase tracking-[0.4em]">One Life • Four Witnesses</p>
      </header>

      <div className="overflow-x-auto glass-dark border border-white/5 rounded-[2rem] shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="p-6 text-[10px] font-bold text-stone-500 uppercase tracking-widest">Event</th>
              <th className="p-6 text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest">Matthew</th>
              <th className="p-6 text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest">Mark</th>
              <th className="p-6 text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest">Luke</th>
              <th className="p-6 text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest">John</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {events.map((e, idx) => (
              <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                <td className="p-6 font-bold text-stone-200 text-xs uppercase tracking-widest">{e.name}</td>
                <td className="p-6 bible-font text-stone-400 text-sm">{e.matt}</td>
                <td className="p-6 bible-font text-stone-400 text-sm">{e.mark}</td>
                <td className="p-6 bible-font text-stone-400 text-sm">{e.luke}</td>
                <td className="p-6 bible-font text-stone-400 text-sm">{e.john}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-10 glass-dark border border-[#D4AF37]/20 rounded-[2.5rem] space-y-6 text-center">
        <p className="text-stone-300 text-sm leading-relaxed italic">
          “The variation in details between Gospels demonstrates the authenticity of eyewitness testimony—different perspectives on the same historical Truth.”
        </p>
      </div>
    </div>
  );
};

export default GospelHarmonyView;
