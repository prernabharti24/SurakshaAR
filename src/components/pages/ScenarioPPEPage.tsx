import React, { useState } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  HardHat,
  AlertTriangle,
  Play,
  CheckCircle2,
  Volume2,
  ChevronRight,
  Sparkles,
  Info,
  Eye
} from 'lucide-react';
import { SupportedLanguage } from '../../types';
import { ANIMATED_TUTORIALS } from '../../data/animatedTutorialData';
import { AnimatedSafetyScene } from '../animated/AnimatedSafetyScene';
import { getScenarioDefinition } from '../../data/step5Data';

interface ScenarioPPEPageProps {
  currentLanguage: SupportedLanguage;
  onBackToScenarios: () => void;
  onStartARSimulation?: () => void;
  onLaunchARSimulation?: () => void;
  onWatchSafetySteps?: (scenarioId: string) => void;
  onVoiceSpeak?: (text: string) => void;
}

export const ScenarioPPEPage: React.FC<ScenarioPPEPageProps> = ({
  currentLanguage,
  onBackToScenarios,
  onStartARSimulation,
  onLaunchARSimulation,
  onWatchSafetySteps,
  onVoiceSpeak
}) => {
  const isHindi = currentLanguage === 'hi';
  const tutorialDef = ANIMATED_TUTORIALS['scenario-1-ppe'];

  const handleStartSimulation = () => {
    onVoiceSpeak?.(
      isHindi
        ? '3D और एआर सुरक्षा सिमुलेशन शुरू कर रहे हैं।'
        : 'Starting AR safety simulation.'
    );
    if (onLaunchARSimulation) {
      onLaunchARSimulation();
    } else if (onStartARSimulation) {
      onStartARSimulation();
    }
  };

  const [activeTab, setActiveTab] = useState<'overview' | 'steps' | '3d-demo'>('overview');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  const steps = tutorialDef ? tutorialDef.steps : [];

  const ppeScenarioDef = getScenarioDefinition('scenario-1-ppe');
  const hazardsList = ppeScenarioDef.hazards.filter((h) => h.isHazard).map((h) => ({
    id: h.id,
    titleEn: h.title,
    titleHi: h.titleHi || h.title,
    severity: h.severity,
    standard: h.standard || 'IS Standard',
    descEn: h.description,
    descHi: h.descriptionHi || h.description
  }));

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn pb-12">
      {/* 1. Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3">
          <button
            id="btn-back-to-scenarios"
            onClick={onBackToScenarios}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>{isHindi ? '← परिदृश्य सूची' : '← All Scenarios'}</span>
          </button>
          <div className="h-6 w-px bg-slate-800 hidden sm:block" />
          <div>
            <span className="text-[11px] text-amber-400 font-mono font-bold uppercase tracking-wider block">
              {isHindi ? 'परिदृश्य 1: तैयारी एवं निर्देश' : 'Scenario 1: Instructions & Safety Rules'}
            </span>
            <h1 className="text-lg sm:text-xl font-black text-white">
              {isHindi ? 'पीपीई और बुनियादी कार्यस्थल खतरे' : 'PPE & Hazard Identification'}
            </h1>
          </div>
        </div>

        {/* Big Start AR Simulation Button in Header */}
        <button
          id="btn-header-start-ar"
          onClick={handleStartSimulation}
          className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-98 border border-amber-300 shrink-0"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          <span>{isHindi ? 'AR सिमुलेशन शुरू करें' : 'Start AR Simulation'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Top Overview Card: Workplace Environment */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                {isHindi ? 'कार्यशाला पर्यावरण' : 'General Manufacturing Workshop'}
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-mono">
                DGMS &amp; IS 2925 / IS 15809
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white">
              {isHindi
                ? 'कार्यशाला में प्रवेश करने से पहले सुरक्षा जांच'
                : 'Workshop Pre-Entry Safety Protocol'}
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              {isHindi
                ? 'इस कार्यशाला में प्रवेश करने वाले प्रत्येक श्रमिक के लिए सुरक्षा हेलमेट, सुरक्षा जूते और हाई-विजिबिलिटी जैकेट पहनना अनिवार्य है। फर्श पर 440V बिजली की केबल और खुली मशीनरी के खतरों की पहचान करें।'
                : 'Every worker entering this active manufacturing bay must verify approved PPE compliance (IS 2925 hard hat, steel-toe footwear, and high-visibility vest). Identify exposed live electrical cables and missing guardrails before starting work.'}
            </p>

            {/* Quick Goals */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-300">
                  {isHindi
                    ? '4 प्रमुख खतरों की सही पहचान करें'
                    : 'Locate 4 critical safety hazards on floor'}
                </span>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-300">
                  {isHindi
                    ? 'नियमों के अनुसार सुधारात्मक कदम उठाएं'
                    : 'Apply mandatory Indian Standards remediation'}
                </span>
              </div>
            </div>
          </div>

          {/* Tab selector for Overview vs Step-by-Step vs 3D Demo */}
          <div className="flex sm:flex-col gap-2 w-full md:w-56 shrink-0 bg-slate-950 p-2 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-colors text-left flex items-center justify-between cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-amber-500 text-slate-950 font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{isHindi ? '1. खतरे विवरण' : '1. Hazard List'}</span>
              <AlertTriangle className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('steps')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-colors text-left flex items-center justify-between cursor-pointer ${
                activeTab === 'steps'
                  ? 'bg-amber-500 text-slate-950 font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{isHindi ? '2. 6 सुरक्षा कदम' : '2. 6 Safety Steps'}</span>
              <ShieldCheck className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('3d-demo')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-colors text-left flex items-center justify-between cursor-pointer ${
                activeTab === '3d-demo'
                  ? 'bg-amber-500 text-slate-950 font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{isHindi ? '3. 3D डेमो देखें' : '3. 3D Visual Demo'}</span>
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Content Tab Views */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>{isHindi ? 'कार्यशाला में मौजूद खतरे' : 'Hazards Present in this Scenario'}</span>
            </h3>
            <span className="text-xs text-slate-400">
              {isHindi ? 'सिमुलेशन में इन पर टैप करें' : 'Tap these during simulation'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {hazardsList.map((hazard, index) => (
              <div
                key={hazard.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-lg bg-slate-800 text-amber-400 font-bold text-xs flex items-center justify-center font-mono">
                      #{index + 1}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                        hazard.severity === 'Critical'
                          ? 'bg-red-950 text-red-300 border border-red-500/50'
                          : hazard.severity === 'High'
                          ? 'bg-amber-950 text-amber-300 border border-amber-500/50'
                          : 'bg-yellow-950 text-yellow-300 border border-yellow-500/50'
                      }`}
                    >
                      {hazard.severity}
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-white">
                    {isHindi ? hazard.titleHi : hazard.titleEn}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {isHindi ? hazard.descHi : hazard.descEn}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>{isHindi ? 'मानक:' : 'Standard:'}</span>
                  <span className="text-amber-400 font-bold">{hazard.standard}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'steps' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>{isHindi ? '6 अनिवार्य सुरक्षा कदम' : '6 Mandatory Safety Steps'}</span>
            </h3>
            <span className="text-xs text-slate-400">
              {isHindi ? 'प्रत्येक कदम को ध्यान से समझें' : 'Standard compliance steps'}
            </span>
          </div>

          <div className="space-y-3">
            {steps.map((step, idx) => (
              <div
                key={step.stepNumber}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-black text-sm flex items-center justify-center shrink-0">
                    {step.stepNumber}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm sm:text-base font-bold text-white">
                        {isHindi ? step.titleHi : step.titleEn}
                      </h4>
                      {step.ruleBadge && (
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                          {step.ruleBadge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {isHindi ? step.shortTextHi : step.shortTextEn}
                    </p>
                    <p className="text-[11px] text-slate-400 italic">
                      "{isHindi ? step.narrationHi : step.narrationEn}"
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onVoiceSpeak?.(isHindi ? step.narrationHi : step.narrationEn);
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-center"
                  title="Listen in Voice"
                >
                  <Volume2 className="w-4 h-4 text-amber-400" />
                  <span>{isHindi ? 'आवाज़ सुनें' : 'Listen'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === '3d-demo' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-amber-400" />
              <span>{isHindi ? '3D एनिमेटेड सुरक्षा डेमो' : '3D Animated Safety Demonstration'}</span>
            </h3>
            <span className="text-xs text-slate-400">
              {isHindi ? 'चरणबद्ध विजुअल निर्देश' : 'Step-by-step visual demonstration'}
            </span>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-3 sm:p-5 overflow-hidden">
            <AnimatedSafetyScene
              scenarioId="scenario-1-ppe"
              currentStepIndex={currentStepIndex}
              onStepChange={(newStep) => setCurrentStepIndex(newStep)}
              currentLanguage={currentLanguage}
              height="400px"
              showControls={true}
              showNarration={true}
            />
          </div>
        </div>
      )}

      {/* 4. Bottom Prominent Action CTA to Launch AR Simulator */}
      <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-500/10 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center mx-auto shadow-lg">
          <Play className="w-9 h-9 fill-slate-950" />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-xl sm:text-2xl font-black text-white">
            {isHindi
              ? 'तैयार हैं? 3D / AR सुरक्षा सिमुलेशन शुरू करें'
              : 'Ready? Start 3D / AR Safety Simulation'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            {isHindi
              ? 'कार्यस्थल को स्कैन करें, 4 खतरों की पहचान करें और सही सुरक्षा मानक लागू करें।'
              : 'Scan the workplace floor, locate the 4 hazards, tap them to fix, and receive your safety score.'}
          </p>
        </div>

        <div>
          <button
            id="btn-bottom-start-ar-simulation"
            onClick={handleStartSimulation}
            className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-black text-base sm:text-lg shadow-xl inline-flex items-center justify-center gap-3 cursor-pointer transition-transform active:scale-98 border-2 border-amber-300"
          >
            <HardHat className="w-6 h-6" />
            <span>{isHindi ? 'AR सिमुलेशन में प्रवेश करें →' : 'Enter AR Simulation →'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
