
import React, { useState } from 'react';
import { ActivityRow, ActivityAnalysis, PersonalityType } from '../types';
import { geminiService } from '../services/geminiService';
import { 
  FileSpreadsheet, 
  Sparkles, 
  Plus, 
  Trash2, 
  Clock, 
  Share2,
  BrainCircuit,
  Loader2,
  Lightbulb,
  Calendar
} from 'lucide-react';

interface Props {
  goal: string;
  personality: PersonalityType;
}

const ActivitySheet: React.FC<Props> = ({ goal, personality }) => {
  const [activities, setActivities] = useState<ActivityRow[]>(() => {
    const saved = localStorage.getItem('focus_sheet');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ActivityAnalysis | null>(null);

  const addRow = () => {
    const newRow: ActivityRow = {
      id: Date.now().toString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      activity: '',
      category: 'Work',
      durationMinutes: 30
    };
    const updated = [newRow, ...activities];
    setActivities(updated);
    localStorage.setItem('focus_sheet', JSON.stringify(updated));
  };

  const updateRow = (id: string, field: keyof ActivityRow, value: any) => {
    const updated = activities.map(r => r.id === id ? { ...r, [field]: value } : r);
    setActivities(updated);
    localStorage.setItem('focus_sheet', JSON.stringify(updated));
  };

  const removeRow = (id: string) => {
    const updated = activities.filter(r => r.id !== id);
    setActivities(updated);
    localStorage.setItem('focus_sheet', JSON.stringify(updated));
  };

  const runAnalysis = async () => {
    if (activities.length < 1) return;
    setLoading(true);
    try {
      const result = await geminiService.analyzeActivities(activities, goal, personality);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const shareReport = () => {
    if (!analysis) return;
    const text = `Focus Report: Today I saved ${analysis.timeSavedMinutes}m using Focus Hub! Mission: ${goal}. Score: ${analysis.productivityScore}%`;
    navigator.clipboard.writeText(text);
    alert("Report copied to clipboard!");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white flex items-center gap-3 uppercase italic tracking-tighter">
            <div className="w-10 h-10 bg-[#FF9900] rounded-xl flex items-center justify-center text-black">
              <FileSpreadsheet size={20} />
            </div>
            Time Ledger
          </h2>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">Document every second. Account for every impulse.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button onClick={addRow} className="flex-1 sm:flex-none bg-zinc-900 border border-zinc-800 px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all text-white">
            <Plus size={16} className="text-[#FF9900]" /> NEW ENTRY
          </button>
          <button 
            onClick={runAnalysis} 
            disabled={loading || activities.length < 1} 
            className="flex-1 sm:flex-none bg-[#FF9900] text-black px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-orange-400 transition-all shadow-[0_0_30px_rgba(255,153,0,0.2)]"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
            ANALYZE LOGS
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
        {/* Main List Area - Optimized for No Horizontal Scroll */}
        <div className="xl:col-span-8 space-y-4">
          {activities.length === 0 ? (
            <div className="bg-zinc-900/40 border border-dashed border-zinc-800 rounded-[2.5rem] py-24 text-center">
              <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="text-zinc-700" size={32} />
              </div>
              <p className="text-zinc-600 font-black uppercase text-[10px] tracking-widest">The ledger is empty. Start recording your time.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map((row) => (
                <div key={row.id} className="group bg-zinc-900/40 border border-zinc-800 rounded-3xl p-5 hover:border-zinc-700 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-4 sm:w-24 shrink-0">
                      <Calendar size={14} className="text-[#FF9900]" />
                      <input 
                        type="text" 
                        className="bg-transparent border-none outline-none font-black text-zinc-400 uppercase text-[10px] tracking-widest focus:text-[#FF9900] w-full" 
                        value={row.time} 
                        onChange={(e) => updateRow(row.id, 'time', e.target.value)} 
                      />
                    </div>
                    
                    <div className="flex-1">
                      <textarea 
                        rows={1}
                        className="bg-transparent border-none outline-none w-full text-white font-bold text-sm resize-none overflow-hidden focus:text-[#FF9900] placeholder:text-zinc-700 scroll-none" 
                        placeholder="Log your mission update..." 
                        value={row.activity} 
                        onChange={(e) => {
                          updateRow(row.id, 'activity', e.target.value);
                          e.target.style.height = 'auto';
                          e.target.style.height = e.target.scrollHeight + 'px';
                        }} 
                      />
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-48 shrink-0">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-zinc-600" />
                        <input 
                          type="number" 
                          className="bg-black/50 border border-zinc-800 rounded-lg px-2 py-1 w-16 text-center text-xs font-black text-[#FF9900] outline-none" 
                          value={row.durationMinutes} 
                          onChange={(e) => updateRow(row.id, 'durationMinutes', parseInt(e.target.value) || 0)} 
                        />
                        <span className="text-[8px] font-black text-zinc-600 uppercase">Min</span>
                      </div>
                      
                      <button onClick={() => removeRow(row.id)} className="w-8 h-8 flex items-center justify-center text-zinc-700 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Analysis Sidebar */}
        <div className="xl:col-span-4 space-y-6 sticky top-8">
          {analysis ? (
            <div className="bg-black rounded-[3rem] p-10 text-white shadow-2xl border border-zinc-800 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-10">
                  <div className="w-16 h-16 bg-[#FF9900] rounded-2xl flex items-center justify-center text-black shadow-[0_0_20px_rgba(255,153,0,0.4)]">
                    <BrainCircuit size={32} />
                  </div>
                  <button onClick={shareReport} className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-500 hover:text-[#FF9900] transition-colors">
                    <Share2 size={20} />
                  </button>
                </div>
                
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">Efficiency Quotient</h3>
                <div className="flex items-baseline gap-3 mb-10">
                  <span className="text-7xl font-black tracking-tighter text-white italic">{analysis.productivityScore}</span>
                  <span className="text-2xl font-black text-[#FF9900] tracking-tighter">%</span>
                </div>

                <div className="space-y-8">
                  <div className="relative pl-6">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF9900] rounded-full shadow-[0_0_10px_rgba(255,153,0,0.5)]"></div>
                    <p className="text-zinc-100 text-xl leading-relaxed font-black uppercase italic tracking-tight">
                      "{analysis.summary}"
                    </p>
                  </div>

                  {analysis.recommendations.length > 0 && (
                    <div className="pt-8 border-t border-zinc-800 space-y-5">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FF9900]">Tactical Adjustments:</h4>
                      {analysis.recommendations.map((rec, i) => (
                        <div key={i} className="flex gap-4 text-sm font-bold text-zinc-400 group/item">
                          <Lightbulb size={18} className="text-[#FF9900] shrink-0 group-hover/item:scale-110 transition-transform" />
                          <span className="leading-snug">{rec}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#FF9900]/10 rounded-full blur-[100px] pointer-events-none"></div>
            </div>
          ) : (
            <div className="bg-zinc-900/20 rounded-[3rem] p-12 border-2 border-dashed border-zinc-800 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center text-zinc-700 mb-6 shadow-inner">
                <Sparkles size={40} />
              </div>
              <h3 className="font-black text-white uppercase italic tracking-tighter text-xl">Intelligence Standby</h3>
              <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest max-w-[200px] mt-4 leading-relaxed">
                Awaiting input data. Feed the ledger to unlock AI insights.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivitySheet;
