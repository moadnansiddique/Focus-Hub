
import React, { useState, useEffect } from 'react';
import { ChallengeStep, AppItem, MathProblem, NaturalPrompt, RigidityLevel } from '../types';
import { geminiService } from '../services/geminiService';
import { Logo } from '../App';
import { 
  Brain, 
  Dumbbell, 
  Leaf, 
  MessageSquare, 
  ArrowRight, 
  CheckCircle2, 
  Loader2,
  XCircle,
  ShieldX
} from 'lucide-react';

interface Props {
  app: AppItem;
  goal: string;
  rigidity: RigidityLevel;
  onSuccess: () => void;
  onCancel: () => void;
}

const ChallengeModal: React.FC<Props> = ({ app, goal, rigidity, onSuccess, onCancel }) => {
  const getStartStep = () => {
    if (rigidity === 'Locked') return ChallengeStep.INTENT;
    return ChallengeStep.MATH;
  };

  const [step, setStep] = useState<ChallengeStep>(getStartStep());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [intentInput, setIntentInput] = useState('');
  const [intentFeedback, setIntentFeedback] = useState<string | null>(null);
  const [mathProblem, setMathProblem] = useState<MathProblem | null>(null);
  const [mathAnswer, setMathAnswer] = useState('');
  const [naturalPrompt, setNaturalPrompt] = useState<NaturalPrompt | null>(null);

  const handleIntentSubmit = async () => {
    if (!intentInput.trim()) return;
    setLoading(true);
    try {
      const result = await geminiService.validateIntent(intentInput, goal);
      setIntentFeedback(result.feedback);
      if (result.isValid) {
        setTimeout(() => {
          setStep(ChallengeStep.MATH);
          setLoading(false);
        }, 1500);
      } else {
        setLoading(false);
      }
    } catch (err) {
      setError("Failed to validate intent.");
      setLoading(false);
    }
  };

  const loadMath = async () => {
    setLoading(true);
    try {
      const diff = rigidity === 'Soft' ? 'easy' : (rigidity === 'Standard' ? 'medium' : 'hard');
      const prob = await geminiService.generateMathProblem(diff);
      setMathProblem(prob);
    } catch (err) {
      setError("Failed to load math challenge.");
    } finally {
      setLoading(false);
    }
  };

  const handleMathSubmit = () => {
    if (mathAnswer === mathProblem?.answer) {
      if (rigidity === 'Soft') {
        setStep(ChallengeStep.COMPLETED);
      } else {
        setStep(ChallengeStep.PHYSICAL);
      }
    } else {
      setError("INCORRECT. FOCUS.");
      setTimeout(() => setError(null), 2000);
    }
  };

  const loadNatural = async () => {
    setLoading(true);
    try {
      const prompt = await geminiService.generateNaturalGrounding();
      setNaturalPrompt(prompt);
    } catch (err) {
      setError("Failed to load natural prompt.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (step === ChallengeStep.MATH) loadMath();
    if (step === ChallengeStep.NATURAL) loadNatural();
  }, [step]);

  const renderStep = () => {
    switch (step) {
      case ChallengeStep.INTENT:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-[#FF9900]">
              <MessageSquare size={24} />
              <h3 className="font-black uppercase tracking-[0.2em] text-xs">Phaze 1: Intent Verification</h3>
            </div>
            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Mission Context:</p>
              <p className="text-sm text-zinc-300 font-bold italic">"{goal}"</p>
            </div>
            <textarea
              className="w-full p-5 border-2 border-zinc-800 bg-black rounded-[1.5rem] focus:border-[#FF9900] outline-none text-sm min-h-[140px] text-white font-bold placeholder:text-zinc-700 shadow-inner"
              placeholder="Explain how accessing this node serves your mission..."
              value={intentInput}
              onChange={(e) => setIntentInput(e.target.value)}
            />
            {intentFeedback && (
              <div className="p-4 rounded-2xl bg-[#FF9900]/10 border border-[#FF9900]/20 text-[#FF9900] text-sm font-bold italic">
                {intentFeedback}
              </div>
            )}
            <button
              onClick={handleIntentSubmit}
              disabled={loading || !intentInput}
              className="w-full bg-[#FF9900] text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-orange-400 transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,153,0,0.2)]"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>AUTHENTICATE INTENT <ArrowRight size={18} /></>}
            </button>
          </div>
        );

      case ChallengeStep.MATH:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-[#FF9900]">
              <Brain size={24} />
              <h3 className="font-black uppercase tracking-[0.2em] text-xs">Phaze 2: Synaptic Trigger</h3>
            </div>
            {mathProblem ? (
              <>
                <div className="p-10 bg-black rounded-[2rem] text-center border-2 border-zinc-800 shadow-inner">
                  <span className="text-4xl font-black tracking-widest text-white italic">{mathProblem.question}</span>
                </div>
                <input
                  type="text"
                  autoFocus
                  className="w-full p-5 bg-zinc-900 border-2 border-zinc-800 rounded-2xl focus:border-[#FF9900] outline-none text-center text-3xl font-black text-white tracking-widest placeholder:text-zinc-800 shadow-inner"
                  placeholder="?"
                  value={mathAnswer}
                  onChange={(e) => setMathAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleMathSubmit()}
                />
                {error && <p className="text-red-500 text-xs text-center font-black uppercase tracking-widest animate-pulse">{error}</p>}
                <button
                  onClick={handleMathSubmit}
                  className="w-full bg-[#FF9900] text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-orange-400 transition-all shadow-[0_0_30px_rgba(255,153,0,0.2)]"
                >
                  VALIDATE RESPONSE
                </button>
              </>
            ) : (
              <div className="flex justify-center p-12"><Loader2 className="animate-spin text-[#FF9900]" size={32} /></div>
            )}
          </div>
        );

      case ChallengeStep.PHYSICAL:
        return (
          <div className="space-y-6 text-center">
            <div className="flex items-center justify-center gap-3 text-[#FF9900]">
              <Dumbbell size={24} />
              <h3 className="font-black uppercase tracking-[0.2em] text-xs">Phaze 3: Kinetic Pulse</h3>
            </div>
            <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Execute required physical movement to re-engage cognition.</p>
            <div className="p-10 bg-black rounded-[2rem] border-2 border-zinc-800 shadow-inner group">
              <h4 className="text-3xl font-black text-[#FF9900] mb-3 uppercase italic group-hover:scale-110 transition-transform">
                {rigidity === 'Standard' ? '20 AIR SQUATS' : '40 PUSHUPS'}
              </h4>
              <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em]">Break the digital trance. Feel the load.</p>
            </div>
            <button
              onClick={() => {
                if (rigidity === 'Standard') setStep(ChallengeStep.COMPLETED);
                else setStep(ChallengeStep.NATURAL);
              }}
              className="w-full bg-[#FF9900] text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-orange-400 shadow-[0_0_30px_rgba(255,153,0,0.2)]"
            >
              KINETIC TARGET REACHED
            </button>
          </div>
        );

      case ChallengeStep.NATURAL:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-[#FF9900]">
              <Leaf size={24} />
              <h3 className="font-black uppercase tracking-[0.2em] text-xs">Phaze 4: Earth Connection</h3>
            </div>
            {naturalPrompt ? (
              <>
                <div className="p-8 bg-black border-2 border-zinc-800 rounded-[2rem] shadow-inner">
                  <h4 className="font-black text-[#FF9900] mb-4 text-xl uppercase italic tracking-tight border-b border-zinc-800 pb-2">{naturalPrompt.prompt}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed font-bold uppercase tracking-tighter">{naturalPrompt.guidance}</p>
                </div>
                <button
                  onClick={() => setStep(ChallengeStep.COMPLETED)}
                  className="w-full bg-[#FF9900] text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-orange-400 transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,153,0,0.2)]"
                >
                  DE-LINK COMPLETE <CheckCircle2 size={18} />
                </button>
              </>
            ) : (
              <div className="flex justify-center p-12"><Loader2 className="animate-spin text-[#FF9900]" size={32} /></div>
            )}
          </div>
        );

      case ChallengeStep.COMPLETED:
        return (
          <div className="text-center space-y-8 py-6">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-[#FF9900] text-black rounded-full mb-2 shadow-[0_0_50px_rgba(255,153,0,0.4)] animate-bounce">
              <CheckCircle2 size={56} />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">BARRIER BREACHED</h3>
              <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Protocol bypassed. Access granted for limited duration.</p>
            </div>
            <button
              onClick={onSuccess}
              className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-xs hover:bg-zinc-200 transition-all"
            >
              INITIALIZE {app.name}
            </button>
          </div>
        );
    }
  };

  const stepsCount = rigidity === 'Soft' ? 1 : (rigidity === 'Standard' ? 2 : 4);
  const currentStepIndex = step === ChallengeStep.INTENT ? 0 : 
                           step === ChallengeStep.MATH ? (rigidity === 'Locked' ? 1 : 0) :
                           step === ChallengeStep.PHYSICAL ? (rigidity === 'Locked' ? 2 : 1) :
                           step === ChallengeStep.NATURAL ? 3 : stepsCount;
  const progress = Math.min(100, (currentStepIndex + 1) * (100 / stepsCount));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
      <div className="bg-[#0a0a0a] w-full max-w-lg rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] relative border border-zinc-800">
        <button onClick={onCancel} className="absolute top-8 right-8 text-zinc-600 hover:text-white transition-colors">
          <XCircle size={32} />
        </button>
        <div className="p-10">
          <div className="flex items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-[1.5rem] bg-zinc-900 flex items-center justify-center text-4xl border border-zinc-800 shadow-inner group">
                <span className="group-hover:scale-125 transition-transform">{app.icon}</span>
              </div>
              <div>
                <Logo size="text-[10px]" />
                <h2 className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em] mt-2">Security Level: {rigidity}</h2>
              </div>
            </div>
          </div>
          <div className="mb-10 h-2 bg-zinc-900 rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-[#FF9900] transition-all duration-700 shadow-[0_0_20px_rgba(255,153,0,0.6)]" style={{ width: `${progress}%` }} />
          </div>
          <div className="min-h-[300px] flex flex-col justify-center">
            {renderStep()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeModal;
