import React from 'react';
import {
  Play,
  Factory,
  Camera,
  TrendingUp,
  ShieldCheck,
  Award,
  HardHat,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Bot,
  Mic
} from 'lucide-react';
import { SupportedLanguage, AuthUser, TraineeProfile } from '../../types';

interface TraineeHomeDashboardProps {
  currentLanguage: SupportedLanguage;
  currentUser?: AuthUser | null;
  profile?: TraineeProfile;
  onStartTraining?: () => void;
  onOpenVirtualSafety?: () => void;
  onOpenAIHazardCheck?: () => void;
  onOpenMyProgress?: () => void;
  onOpenAIAssistant?: (initialTopic?: string) => void;
  onOpenDoubtModal?: () => void;
  onWatchSafetySteps?: (scenarioId?: string) => void;
  onSelectScenario?: (scenarioId: string) => void;
  onNavigate?: (page: 'scenarios' | 'virtual-training' | 'ai-hazard-check' | 'my-progress') => void;
  onVoiceSpeak?: (text: string) => void;
}

export const TraineeHomeDashboard: React.FC<TraineeHomeDashboardProps> = ({
  currentLanguage,
  currentUser,
  profile,
  onStartTraining,
  onOpenVirtualSafety,
  onOpenAIHazardCheck,
  onOpenMyProgress,
  onOpenAIAssistant,
  onOpenDoubtModal,
  onWatchSafetySteps,
  onSelectScenario,
  onNavigate,
  onVoiceSpeak
}) => {
  const isHindi = currentLanguage === 'hi';

  const completedCount = profile?.completedScenarioIds?.length || 0;
  const bestScoresList: number[] = Object.values(profile?.bestScores || {});
  const averageScore =
    bestScoresList.length > 0
      ? Math.round(bestScoresList.reduce((a: number, b: number) => a + b, 0) / bestScoresList.length)
      : 85;

  const totalXP = profile?.xp || 420;
  const displayName = currentUser?.displayName || currentUser?.email.split('@')[0] || profile?.name || 'Worker';

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
      {/* 1. Welcome & Status Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                {isHindi ? 'प्रमाणित सुरक्षा प्रशिक्षण' : 'Industrial Safety Training'}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-mono">
                DGMS / IS:8032
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isHindi ? `नमस्ते, ${displayName}` : `Welcome, ${displayName}`}
            </h1>

            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              {isHindi
                ? 'औद्योगिक सुरक्षा प्रशिक्षण में आपका स्वागत है। अपना प्रशिक्षण शुरू करें या खतरे की जांच करें।'
                : 'Welcome to your workplace safety portal. Begin your inspection training or run an AI hazard check.'}
            </p>
          </div>

          {/* Quick Stats Summary Pill */}
          <div className="grid grid-cols-2 gap-3 shrink-0 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
            <div className="text-center px-3 py-1.5 border-r border-slate-800">
              <span className="text-[11px] text-slate-400 block font-medium">
                {isHindi ? 'सुरक्षा स्कोर' : 'Safety Score'}
              </span>
              <span className="text-xl font-black text-amber-400 font-mono">
                {averageScore}%
              </span>
            </div>
            <div className="text-center px-3 py-1.5">
              <span className="text-[11px] text-slate-400 block font-medium">
                {isHindi ? 'कुल एक्सपी' : 'Total XP'}
              </span>
              <span className="text-xl font-black text-emerald-400 font-mono">
                {totalXP} XP
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main 4 Action Buttons Grid - Large, Clear, Worker-Friendly */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Action 1: Start Training */}
        <button
          id="btn-home-start-training"
          onClick={() => {
            onVoiceSpeak?.(
              isHindi
                ? 'सुरक्षा प्रशिक्षण परिदृश्य खोल रहे हैं।'
                : 'Opening safety training scenarios.'
            );
            if (onStartTraining) {
              onStartTraining();
            } else {
              onNavigate?.('scenarios');
            }
          }}
          className="group relative bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 p-6 sm:p-7 rounded-3xl shadow-xl transition-all duration-200 transform hover:-translate-y-1 active:translate-y-0 text-left cursor-pointer border-2 border-amber-400 flex flex-col justify-between min-h-[190px]"
        >
          <div className="flex items-start justify-between w-full">
            <div className="w-14 h-14 rounded-2xl bg-slate-950/20 flex items-center justify-center text-slate-950">
              <Play className="w-8 h-8 fill-slate-950" />
            </div>
            <span className="px-3 py-1 rounded-full bg-slate-950/25 text-slate-950 font-bold text-xs">
              {isHindi ? 'मुख्य प्रशिक्षण' : 'Primary Module'}
            </span>
          </div>

          <div className="space-y-1 pt-4">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center justify-between">
              <span>{isHindi ? '1. ट्रेनिंग शुरू करें' : '1. Start Training'}</span>
              <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
              {isHindi
                ? 'कार्यस्थल पर सुरक्षा जांच और 3D/AR सिमुलेशन शुरू करें।'
                : 'Inspect workplaces and detect statutory hazards in 3D & AR.'}
            </p>
          </div>
        </button>

        {/* Action 2: Virtual Safety Training */}
        <button
          id="btn-home-virtual-training"
          onClick={() => {
            onVoiceSpeak?.(
              isHindi
                ? 'सुरक्षा परिदृश्य पृष्ठ खोल रहे हैं।'
                : 'Opening safety training scenarios.'
            );
            if (onOpenVirtualSafety) {
              onOpenVirtualSafety();
            } else {
              onNavigate?.('scenarios');
            }
          }}
          className="group relative bg-slate-900 hover:bg-slate-800 text-white p-6 sm:p-7 rounded-3xl shadow-xl transition-all duration-200 transform hover:-translate-y-1 active:translate-y-0 text-left cursor-pointer border border-slate-700 hover:border-slate-600 flex flex-col justify-between min-h-[190px]"
        >
          <div className="flex items-start justify-between w-full">
            <div className="w-14 h-14 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Factory className="w-8 h-8" />
            </div>
            <span className="px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 font-bold text-xs font-mono">
              3D SIM
            </span>
          </div>

          <div className="space-y-1 pt-4">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center justify-between">
              <span>{isHindi ? '2. वर्चुअल सुरक्षा ट्रेनिंग' : '2. Virtual Safety Training'}</span>
              <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-white transition-transform group-hover:translate-x-1" />
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-snug">
              {isHindi
                ? 'कारखाने और खदान के 3D वातावरण में सुरक्षा का अभ्यास करें।'
                : 'Practice safety decisions in 3D manufacturing & mining zones.'}
            </p>
          </div>
        </button>

        {/* Action 3: AI Hazard Check */}
        <button
          id="btn-home-ai-hazard-check"
          onClick={() => {
            onVoiceSpeak?.(
              isHindi
                ? 'एआई खतरा जांच खोल रहे हैं।'
                : 'Opening AI hazard check.'
            );
            if (onOpenAIHazardCheck) {
              onOpenAIHazardCheck();
            } else {
              onNavigate?.('ai-hazard-check');
            }
          }}
          className="group relative bg-slate-900 hover:bg-slate-800 text-white p-6 sm:p-7 rounded-3xl shadow-xl transition-all duration-200 transform hover:-translate-y-1 active:translate-y-0 text-left cursor-pointer border border-slate-700 hover:border-slate-600 flex flex-col justify-between min-h-[190px]"
        >
          <div className="flex items-start justify-between w-full">
            <div className="w-14 h-14 rounded-2xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Camera className="w-8 h-8" />
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-950 border border-amber-800 text-amber-300 font-bold text-xs">
              {isHindi ? 'फोटो जांच' : 'Photo Scan'}
            </span>
          </div>

          <div className="space-y-1 pt-4">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center justify-between">
              <span>{isHindi ? '3. AI Hazard Check' : '3. AI Hazard Check'}</span>
              <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-white transition-transform group-hover:translate-x-1" />
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-snug">
              {isHindi
                ? 'कार्यस्थल की फोटो लें या अपलोड करें और तुरंत खतरे जांचें।'
                : 'Take or upload a workplace photo to scan for safety hazards.'}
            </p>
          </div>
        </button>

        {/* Action 4: My Progress */}
        <button
          id="btn-home-my-progress"
          onClick={() => {
            onVoiceSpeak?.(
              isHindi
                ? 'आपकी सुरक्षा प्रगति खोल रहे हैं।'
                : 'Opening your safety progress.'
            );
            if (onOpenMyProgress) {
              onOpenMyProgress();
            } else {
              onNavigate?.('my-progress');
            }
          }}
          className="group relative bg-slate-900 hover:bg-slate-800 text-white p-6 sm:p-7 rounded-3xl shadow-xl transition-all duration-200 transform hover:-translate-y-1 active:translate-y-0 text-left cursor-pointer border border-slate-700 hover:border-slate-600 flex flex-col justify-between min-h-[190px]"
        >
          <div className="flex items-start justify-between w-full">
            <div className="w-14 h-14 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-8 h-8" />
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 font-bold text-xs">
              {isHindi ? 'प्रमाणपत्र' : 'Record'}
            </span>
          </div>

          <div className="space-y-1 pt-4">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center justify-between">
              <span>{isHindi ? '4. मेरी प्रगति' : '4. My Progress'}</span>
              <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-white transition-transform group-hover:translate-x-1" />
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-snug">
              {isHindi
                ? 'अपना सुरक्षा स्कोर, एक्सपी और पूर्ण प्रशिक्षण रिकॉर्ड देखें।'
                : 'View your safety score, training XP, and completed modules.'}
            </p>
          </div>
        </button>
      </div>

      {/* 3. Helpful Safety Reminder Banner for Workers */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
          <HardHat className="w-5 h-5" />
        </div>
        <div className="space-y-0.5 text-xs sm:text-sm">
          <strong className="text-white block font-bold">
            {isHindi ? 'सुरक्षा नियम: जीवन पहले, काम बाद में' : 'Safety First: Always Inspect Before Work'}
          </strong>
          <p className="text-slate-400">
            {isHindi
              ? 'कार्यस्थल में प्रवेश से पहले हमेशा सुरक्षा हेलमेट और सुरक्षा जूते पहनें।'
              : 'Mandatory PPE: Ensure your hard hat, reflective vest, and safety boots are worn at all times.'}
          </p>
        </div>
      </div>
    </div>
  );
};
