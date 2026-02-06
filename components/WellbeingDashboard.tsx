
import React from 'react';
import { WellbeingStats } from '../types';
import { 
  Heart, 
  Zap, 
  ShieldCheck, 
  ArrowUpRight, 
  Activity,
  History,
  Calendar
} from 'lucide-react';

interface Props { stats: WellbeingStats; }

const WellbeingDashboard: React.FC<Props> = ({ stats }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Interceptions', val: stats.interceptions, icon: <ShieldCheck size={20} />, bg: 'bg-orange-50', text: 'text-[#FF9900]' },
          { label: 'Unlocks', val: stats.allowedSessions, icon: <Zap size={20} />, bg: 'bg-slate-950', text: 'text-white' },
          { label: 'Time Saved', val: `${stats.totalTimeSavedMinutes}m`, icon: <Heart size={20} />, bg: 'bg-orange-50', text: 'text-[#FF9900]' },
          { label: 'Focus Level', val: 'Peak', icon: <Zap size={20} />, bg: 'bg-slate-100', text: 'text-slate-900' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 ${item.bg} ${item.text} rounded-xl flex items-center justify-center`}>
                {item.icon}
              </div>
            </div>
            <p className="text-xs text-slate-400 font-black uppercase tracking-widest mb-1">{item.label}</p>
            <p className="text-3xl font-black text-slate-800 tracking-tight">{item.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
          <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-tight">
            <Activity className="text-[#FF9900]" /> Usage Trends
          </h3>
          <div className="h-48 flex items-end justify-between gap-4 px-4">
            {stats.focusHistory.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-slate-100 rounded-t-xl hover:bg-[#FF9900] transition-all cursor-help relative group"
                  style={{ height: `${val}%` }}
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity font-black">
                    {val}% Focus
                  </div>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">D{i+1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-black p-8 rounded-[3rem] text-white overflow-hidden relative border border-slate-900 shadow-2xl">
          <div className="relative z-10">
            <h3 className="text-xl font-black mb-6 flex items-center gap-2 uppercase tracking-tight">
              <Calendar className="text-[#FF9900]" /> Forecast
            </h3>
            <p className="text-slate-400 mb-8 leading-relaxed font-medium">
              You are projected to regain <span className="text-[#FF9900] font-black italic">14.2 hours</span> of high-value time this cycle by active barrier usage.
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#FF9900]/20 rounded-lg flex items-center justify-center text-[#FF9900]"><History size={16} /></div>
                  <span className="text-sm font-black uppercase tracking-widest text-[10px] text-slate-300">Avg Deep Session</span>
                </div>
                <span className="font-black text-lg tracking-tight">4.2h</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white"><Zap size={16} /></div>
                  <span className="text-sm font-black uppercase tracking-widest text-[10px] text-slate-300">Impulse Resistance</span>
                </div>
                <span className="font-black text-lg tracking-tight">High</span>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#FF9900]/5 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default WellbeingDashboard;
