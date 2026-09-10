import React, { useState, useEffect } from 'react';
import { SurakshaLogo } from './SurakshaLogo';
import { Shield, Cpu, Sparkles, CheckCircle2, ChevronRight, Activity, HardHat } from 'lucide-react';

interface SplashScreenModalProps {
  isOpen: boolean;
  onEnter: () => void;
  onClose?: () => void;
  autoAdvance?: boolean;
}

export const SplashScreenModal: React.FC<SplashScreenModalProps> = ({
  isOpen,
  onEnter,
  onClose,
  autoAdvance = true
}) => {
  const [bootProgress, setBootProgress] = useState(0);
  const [currentStepText, setCurrentStepText] = useState('Booting SURAKSHAAR Subsystems...');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setBootProgress(0);
      setIsReady(false);
      return;
    }

    const steps = [
      { pct: 20, text: 'Initializing Unity 2022.3 LTS runtime & AppStateManager...' },
      { pct: 45, text: 'Validating ARCore & spatial depth sensors (ARM64)...' },
      { pct: 70, text: 'Connecting Firebase cloud sync & local queue...' },
      { pct: 90, text: 'Connecting SURAKSHAAR Safety AI (Gemini 2.5 Flash)...' },
      { pct: 100, text: 'DGMS & IS:8032 Safety Regulations loaded. Platform ready.' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setBootProgress(steps[currentStep].pct);
        setCurrentStepText(steps[currentStep].text);
        currentStep++;
      } else {
        clearInterval(interval);
        setIsReady(true);
      }
    }, 450);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950 text-white animate-in fade-in duration-300">
      {/* Background Industrial Grid & Subtle Red Radial Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-950/25 via-slate-950/90 to-black pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 max-w-xl w-full flex flex-col items-center text-center space-y-8 p-6 md:p-8 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-[0_0_50px_rgba(220,38,38,0.2)] backdrop-blur-xl">
        {/* Top Scene Code Identifier */}
        <div className="w-full flex items-center justify-between text-slate-500 font-mono text-xs border-b border-slate-800/80 pb-3">
          <span className="flex items-center gap-1.5 text-red-400 font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
            00_BootSplash &bull; Unity 2022.3 LTS
          </span>
          <span className="text-slate-400">DGMS/IS:8032 Compliant</span>
        </div>

        {/* Hero Logo Display */}
        <div className="flex flex-col items-center space-y-3 pt-2">
          <SurakshaLogo variant="hero" size="hero" showTagline showSince />
        </div>

        {/* Technical Subsystem Boot Terminal */}
        <div className="w-full space-y-3 bg-black/60 border border-slate-800 rounded-2xl p-4 text-left font-mono">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              Subsystem Verification
            </span>
            <span className="text-red-400 font-bold">{bootProgress}%</span>
          </div>

          {/* Progress Bar with Red Industrial Glow */}
          <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-red-600 via-red-500 to-rose-400 transition-all duration-300 shadow-[0_0_12px_rgba(239,68,68,0.8)]"
              style={{ width: `${bootProgress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span className="truncate pr-2 text-slate-300">{currentStepText}</span>
            {isReady && (
              <span className="text-emerald-400 flex items-center gap-1 shrink-0 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                VERIFIED
              </span>
            )}
          </div>
        </div>

        {/* Action Button: Transition to 01_MainMenu */}
        <div className="w-full space-y-3">
          <button
            onClick={onEnter}
            className={`w-full py-4 px-6 rounded-2xl font-black text-sm md:text-base tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-3 shadow-xl cursor-pointer ${
              isReady
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-950/60 hover:shadow-red-600/30 scale-100 hover:scale-[1.01] active:scale-95'
                : 'bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>Enter SURAKSHAAR Platform</span>
            <ChevronRight className="w-5 h-5 text-white" />
          </button>

          <p className="text-[11px] text-slate-500 font-sans">
            Designed for Mining Workers, Manufacturing Plants, Vocational ITIs &amp; Safety Officers
          </p>
        </div>
      </div>
    </div>
  );
};
