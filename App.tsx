
import React, { useState, useEffect } from 'react';
import { AppItem, RigidityLevel, WellbeingStats, PersonalityType } from './types';
import ChallengeModal from './components/ChallengeModal';
import ActivitySheet from './components/ActivitySheet';
import WellbeingDashboard from './components/WellbeingDashboard';
import { 
  ShieldAlert, 
  Target, 
  LayoutGrid, 
  Settings, 
  Clock, 
  Plus, 
  Trash2,
  Lock,
  AlertTriangle,
  FileText,
  Heart,
  Flame,
  Zap,
  Smile,
  ExternalLink
} from 'lucide-react';

const INITIAL_APPS: AppItem[] = [
  { id: '1', name: 'Instagram', icon: '📸', category: 'Social', isBlocked: true },
  { id: '2', name: 'YouTube', icon: '🎬', category: 'Entertainment', isBlocked: true },
  { id: '3', name: 'Twitter / X', icon: '🐦', category: 'Social', isBlocked: true },
  { id: '4', name: 'TikTok', icon: '🎵', category: 'Entertainment', isBlocked: true },
  { id: '5', name: 'Reddit', icon: '🤖', category: 'Social', isBlocked: false },
  { id: '6', name: 'LinkedIn', icon: '💼', category: 'Work', isBlocked: false },
];

export const Logo = ({ size = "text-xl" }: { size?: string }) => (
  <div className={`inline-flex items-center bg-black px-3 py-2 rounded-lg font-black ${size} tracking-tighter select-none border border-zinc-800`}>
    <span className="text-white">Focus</span>
    <span className="bg-[#FF9900] text-black px-1.5 py-0.5 rounded-md ml-1.5 leading-none">Hub</span>
  </div>
);

const App: React.FC = () => {
  const [apps, setApps] = useState<AppItem[]>(() => {
    const saved = localStorage.getItem('focus_apps');
    return saved ? JSON.parse(saved) : INITIAL_APPS;
  });
  
  const [goal, setGoal] = useState<string>(() => localStorage.getItem('focus_goal') || '');
  const [rigidity, setRigidity] = useState<RigidityLevel>(() => (localStorage.getItem('focus_rigidity') as RigidityLevel) || 'Standard');
  const [personality, setPersonality] = useState<PersonalityType>(() => (localStorage.getItem('focus_personality') as PersonalityType) || 'Supportive');
  const [stats, setStats] = useState<WellbeingStats>(() => {
    const saved = localStorage.getItem('focus_stats');
    return saved ? JSON.parse(saved) : {
      interceptions: 14,
      allowedSessions: 3,
      totalTimeSavedMinutes: 125,
      focusHistory: [40, 65, 30, 80, 55, 90, 75],
      streak: 5
    };
  });

  const [interceptedApp, setInterceptedApp] = useState<AppItem | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'sheet' | 'wellbeing' | 'settings'>('dashboard');
  const [showGoalInput, setShowGoalInput] = useState(!goal);
  const [newAppName, setNewAppName] = useState('');
  const [newAppEmoji, setNewAppEmoji] = useState('📱');

  useEffect(() => {
    localStorage.setItem('focus_apps', JSON.stringify(apps));
    localStorage.setItem('focus_goal', goal);
    localStorage.setItem('focus_rigidity', rigidity);
    localStorage.setItem('focus_personality', personality);
    localStorage.setItem('focus_stats', JSON.stringify(stats));
  }, [apps, goal, rigidity, personality, stats]);

  const toggleBlock = (id: string) => {
    setApps(apps.map(a => a.id === id ? { ...a, isBlocked: !a.isBlocked } : a));
  };

  const addCustomApp = () => {
    if (!newAppName) return;
    setApps([...apps, { id: Date.now().toString(), name: newAppName, icon: newAppEmoji, category: 'Other', isBlocked: true }]);
    setNewAppName('');
    setNewAppEmoji('📱');
  };

  const handleAppClick = (app: AppItem) => {
    if (app.isBlocked) {
      if (!goal) { 
        setActiveTab('dashboard');
        setShowGoalInput(true); 
        return; 
      }
      setInterceptedApp(app);
      setStats(prev => ({ ...prev, interceptions: prev.interceptions + 1 }));
    } else {
      window.open('https://google.com', '_blank');
    }
  };

  const handleInterventionSuccess = () => {
    setInterceptedApp(null);
    setStats(prev => ({ 
      ...prev, 
      allowedSessions: prev.allowedSessions + 1,
      totalTimeSavedMinutes: prev.totalTimeSavedMinutes + 15
    }));
    window.open('https://google.com', '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0a0a0a] text-zinc-100 font-sans">
      <nav className="w-full md:w-24 bg-black border-b md:border-r border-zinc-800 p-4 flex md:flex-col items-center justify-between md:justify-start gap-12 z-30">
        <Logo size="text-[10px]" />
        
        <div className="flex md:flex-col gap-6">
          {[{ id: 'dashboard', icon: <LayoutGrid size={22} /> }, { id: 'sheet', icon: <FileText size={22} /> }, { id: 'wellbeing', icon: <Heart size={22} /> }, { id: 'settings', icon: <Settings size={22} /> }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`p-3 rounded-2xl transition-all ${activeTab === tab.id ? 'bg-[#FF9900] text-black shadow-lg shadow-orange-500/20' : 'text-zinc-500 hover:bg-zinc-900'}`}>
              {tab.icon}
            </button>
          ))}
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 pb-24 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <Logo size="text-2xl" />
              <h1 className="text-4xl font-black tracking-tight mt-6 text-white uppercase italic">
                {activeTab === 'dashboard' && 'Control Room'}
                {activeTab === 'sheet' && 'Time Ledger'}
                {activeTab === 'wellbeing' && 'Vital Signs'}
                {activeTab === 'settings' && 'System Config'}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">{rigidity} Protocol • {personality} AI</span>
                <div className="flex items-center gap-1 bg-zinc-900 text-[#FF9900] px-2 py-0.5 rounded-full text-xs font-black border border-zinc-800">
                  <Flame size={12} fill="currentColor" /> {stats.streak} DAY STREAK
                </div>
              </div>
            </div>
            
            <div className="bg-zinc-900/50 p-5 rounded-[2rem] border border-zinc-800 flex items-center gap-4 min-w-[320px] shadow-2xl backdrop-blur-sm">
              <div className="w-12 h-12 bg-[#FF9900] text-black rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(255,153,0,0.3)]"><Target size={24} /></div>
              <div className="flex-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 block mb-1">Your Primary Objective</span>
                {showGoalInput ? (
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      className="text-sm w-full border-b-2 border-[#FF9900] outline-none bg-black/40 p-2 text-white font-bold placeholder:text-zinc-700 rounded-t-lg" 
                      placeholder="Define your mission..."
                      value={goal} 
                      onChange={(e) => setGoal(e.target.value)} 
                      onKeyDown={(e) => e.key === 'Enter' && setShowGoalInput(false)} 
                      autoFocus 
                    />
                    <button onClick={() => setShowGoalInput(false)} className="text-[10px] font-black uppercase text-black bg-[#FF9900] px-3 rounded-lg hover:bg-orange-400 transition-colors">SET</button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <span className="text-base font-black text-white tracking-tight leading-tight">{goal || "MISSION UNDEFINED"}</span>
                    <button onClick={() => setShowGoalInput(true)} className="ml-4 text-[10px] font-black uppercase text-[#FF9900] border border-[#FF9900]/20 hover:bg-[#FF9900]/10 px-3 py-1.5 rounded-lg transition-all">EDIT</button>
                  </div>
                )}
              </div>
            </div>
          </header>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {apps.map((app) => (
                  <div key={app.id} onClick={() => handleAppClick(app)} className={`group relative p-8 rounded-[2.5rem] border ${app.isBlocked ? 'border-orange-500/30 bg-zinc-900/40' : 'border-zinc-800 bg-black'} shadow-sm hover:shadow-[0_0_40px_rgba(0,0,0,0.5)] hover:border-zinc-700 transition-all cursor-pointer overflow-hidden`}>
                    {app.isBlocked ? (
                      <div className="absolute top-6 right-6 text-[#FF9900] flex flex-col items-center">
                        <Lock size={18} />
                        <span className="text-[8px] font-black uppercase tracking-tighter mt-1">LOCKED</span>
                      </div>
                    ) : (
                      <div className="absolute top-6 right-6 text-zinc-600">
                        <ExternalLink size={18} />
                      </div>
                    )}
                    <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">{app.icon}</div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">{app.name}</h3>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{app.category}</p>
                    <div className="mt-8 flex items-center gap-2 text-[10px] font-black text-[#FF9900] opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-[0.2em]">
                      {app.isBlocked ? 'Infiltrate Barrier' : 'Access Node'} <Plus size={14} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'sheet' && <ActivitySheet goal={goal} personality={personality} />}
            {activeTab === 'wellbeing' && <WellbeingDashboard stats={stats} />}
            
            {activeTab === 'settings' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="bg-zinc-900/40 rounded-[3rem] p-10 border border-zinc-800 shadow-sm backdrop-blur-md">
                  <h2 className="text-2xl font-black text-white mb-8 uppercase italic tracking-tighter border-l-4 border-[#FF9900] pl-4">AI Personality</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setPersonality('Supportive')} className={`p-8 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-4 ${personality === 'Supportive' ? 'border-[#FF9900] bg-[#FF9900]/10' : 'border-zinc-800 bg-black/50 hover:bg-zinc-800'}`}>
                      <Smile className={personality === 'Supportive' ? 'text-[#FF9900]' : 'text-zinc-600'} size={40} />
                      <p className="font-black text-[10px] uppercase tracking-widest">Motivational Speaker</p>
                    </button>
                    <button onClick={() => setPersonality('Savage')} className={`p-8 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-4 ${personality === 'Savage' ? 'border-[#FF9900] bg-[#FF9900]/10' : 'border-zinc-800 bg-black/50 hover:bg-zinc-800'}`}>
                      <Zap className={personality === 'Savage' ? 'text-[#FF9900]' : 'text-zinc-600'} size={40} />
                      <p className="font-black text-[10px] uppercase tracking-widest">Savage Roast Agent</p>
                    </button>
                  </div>
                  <p className="mt-6 text-[11px] text-zinc-500 font-medium leading-relaxed uppercase tracking-tighter">
                    {personality === 'Supportive' ? 'Agent uses high-power Hinglish to awaken your latent potential.' : 'Agent will use brutal sarcasm to dismantle your procrastination.'}
                  </p>
                  
                  <h2 className="text-2xl font-black text-white mt-16 mb-8 uppercase italic tracking-tighter border-l-4 border-zinc-700 pl-4">Barrier Rigidity</h2>
                  <div className="space-y-3">
                    {['Soft', 'Standard', 'Locked'].map(level => (
                      <button key={level} onClick={() => setRigidity(level as any)} className={`w-full p-5 rounded-2xl border-2 flex justify-between items-center font-black uppercase text-xs tracking-[0.2em] transition-all ${rigidity === level ? 'border-[#FF9900] bg-[#FF9900]/10 text-[#FF9900]' : 'border-zinc-800 bg-black/20 text-zinc-600 hover:bg-zinc-800'}`}>
                        {level} {rigidity === level && <Lock size={16} />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-zinc-900/40 rounded-[3rem] p-10 border border-zinc-800 shadow-sm backdrop-blur-md">
                  <h2 className="text-2xl font-black text-white mb-8 uppercase italic tracking-tighter border-l-4 border-zinc-700 pl-4">Blocklist config</h2>
                  <div className="flex gap-4 mb-10">
                    <input className="w-20 p-5 bg-black border border-zinc-800 rounded-3xl text-center text-3xl shadow-inner" value={newAppEmoji} onChange={e => setNewAppEmoji(e.target.value)} />
                    <input className="flex-1 p-5 bg-black border border-zinc-800 rounded-3xl outline-none text-white font-bold placeholder:text-zinc-700 shadow-inner" placeholder="Distraction name..." value={newAppName} onChange={e => setNewAppName(e.target.value)} />
                    <button onClick={addCustomApp} className="px-8 bg-[#FF9900] text-black rounded-3xl font-black uppercase text-xs hover:bg-orange-400 transition-all shadow-[0_0_20px_rgba(255,153,0,0.2)]">ADD</button>
                  </div>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {apps.map(app => (
                      <div key={app.id} className="flex items-center justify-between p-4 bg-black/40 border border-zinc-800 rounded-[1.5rem] hover:bg-zinc-800/40 transition-colors">
                        <div className="flex items-center gap-4">
                          <span className="text-2xl">{app.icon}</span>
                          <span className="font-black text-xs uppercase tracking-tight text-white">{app.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <button onClick={() => toggleBlock(app.id)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${app.isBlocked ? 'bg-[#FF9900] text-black' : 'bg-zinc-800 text-zinc-500'}`}>
                            {app.isBlocked ? 'ARMED' : 'BYPASS'}
                          </button>
                          <button onClick={() => setApps(apps.filter(a => a.id !== app.id))} className="w-10 h-10 flex items-center justify-center text-zinc-700 hover:text-red-500 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {interceptedApp && goal && (
        <ChallengeModal 
          app={interceptedApp} 
          goal={goal}
          rigidity={rigidity}
          onSuccess={handleInterventionSuccess}
          onCancel={() => setInterceptedApp(null)}
        />
      )}
    </div>
  );
};

export default App;
