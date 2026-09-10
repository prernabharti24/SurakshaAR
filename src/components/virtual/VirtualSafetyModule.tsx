import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  VirtualEnvironmentId,
  SimulationTrainingMode,
  SimulationDifficulty,
  VirtualSafetyEvent,
  VirtualHotspot,
  DecisionOption,
  SimulationScoreMetrics,
  VirtualAdaptiveRecommendation,
  AuthUser,
  ImmersiveScenarioId
} from '../../types';
import {
  VIRTUAL_ENVIRONMENTS,
  VIRTUAL_SAFETY_EVENTS
} from '../../data/virtualEnvironmentData';
import { IMMERSIVE_SCENARIOS } from '../../data/immersiveScenarioData';
import { VirtualEnvironmentCanvas } from './VirtualEnvironmentCanvas';
import { EventDecisionModal } from './EventDecisionModal';
import { ImmersiveSimulationPlayer } from './ImmersiveSimulationPlayer';
import {
  Factory,
  Pickaxe,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Languages,
  Award,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Timer,
  Zap,
  Flame,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Sliders,
  Settings2,
  BookOpen,
  Film,
  HardHat,
  Info,
  Layers,
  Search
} from 'lucide-react';

interface VirtualSafetyModuleProps {
  currentUser?: AuthUser | null;
  onWatchSafetySteps?: (scenarioId: string) => void;
  onStartScenario?: (scenarioId: string) => void;
}

const PROFILE_STORAGE_KEY = 'sih26041_trainee_profile';

export const VirtualSafetyModule: React.FC<VirtualSafetyModuleProps> = ({
  currentUser,
  onWatchSafetySteps,
  onStartScenario
}) => {
  // 1. Language & Environment State
  const [isHindi, setIsHindi] = useState<boolean>(false);
  const [selectedEnvId, setSelectedEnvId] = useState<VirtualEnvironmentId>('manufacturing');
  const [mode, setMode] = useState<SimulationTrainingMode>('practice');
  const [difficulty, setDifficulty] = useState<SimulationDifficulty>('beginner');

  // 2. Active Simulation State
  const [isSimRunning, setIsSimRunning] = useState<boolean>(false);
  const [activeEvent, setActiveEvent] = useState<VirtualSafetyEvent | null>(null);
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [selectedHotspot, setSelectedHotspot] = useState<VirtualHotspot | null>(null);
  const [isAlarmActive, setIsAlarmActive] = useState<boolean>(false);

  // 3. Trainer Mode Controls
  const [trainerPanelOpen, setTrainerPanelOpen] = useState<boolean>(
    currentUser?.role === 'trainer' || currentUser?.role === 'admin'
  );

  // 4. Scoring & Metrics
  const [metrics, setMetrics] = useState<SimulationScoreMetrics>({
    overallScore: 100,
    hazardRecognition: 100,
    decisionMaking: 100,
    emergencyResponse: 100,
    totalDecisions: 0,
    correctDecisions: 0,
    incorrectDecisions: 0,
    averageReactionTimeSeconds: 0,
    xpEarned: 0,
    eventsEncountered: 0,
    eventsResolved: 0
  });

  // Recent decision history in session
  const [decisionHistory, setDecisionHistory] = useState<
    Array<{
      id: string;
      eventTitle: string;
      isCorrect: boolean;
      optionChosen: string;
      reactionTime: number;
      timestamp: string;
    }>
  >([]);

  // 5. Adaptive Training Recommendation
  const [adaptiveRec, setAdaptiveRec] = useState<VirtualAdaptiveRecommendation | null>(null);

  // Reference for Surprise Mode timer
  const surpriseTimerRef = useRef<any>(null);

  const currentEnv = VIRTUAL_ENVIRONMENTS[selectedEnvId];

  // Start / Reset Simulation
  const handleStartSimulation = () => {
    setIsSimRunning(true);
    setActiveEvent(null);
    setSelectedHotspot(null);
    setIsAlarmActive(false);

    // If surprise mode, set up spontaneous hazard timer
    if (mode === 'surprise') {
      scheduleSurpriseEvent();
    }
  };

  const handleResetSimulation = () => {
    if (surpriseTimerRef.current) clearTimeout(surpriseTimerRef.current);
    setIsSimRunning(false);
    setActiveEvent(null);
    setSelectedHotspot(null);
    setIsAlarmActive(false);
    setCurrentStageIndex(0);
  };

  // Schedule surprise event
  const scheduleSurpriseEvent = () => {
    if (surpriseTimerRef.current) clearTimeout(surpriseTimerRef.current);

    const delay = difficulty === 'advanced' ? 5000 : difficulty === 'intermediate' ? 8000 : 12000;
    surpriseTimerRef.current = setTimeout(() => {
      triggerRandomEvent();
    }, delay);
  };

  const triggerRandomEvent = () => {
    const available = currentEnv.availableEvents;
    if (!available || available.length === 0) return;
    const randomEvt = available[Math.floor(Math.random() * available.length)];
    triggerSpecificEvent(randomEvt);
  };

  const triggerSpecificEvent = (evt: VirtualSafetyEvent) => {
    setActiveEvent(evt);
    setCurrentStageIndex(0);
    setIsAlarmActive(true);
    setSelectedHotspot(null);

    setMetrics((prev) => ({
      ...prev,
      eventsEncountered: prev.eventsEncountered + 1
    }));
  };

  // Handle decision made inside the modal
  const handleDecisionSubmitted = (option: DecisionOption, reactionTime: number) => {
    const isCorrect = option.isCorrect;

    // Update metrics
    setMetrics((prev) => {
      const newTotal = prev.totalDecisions + 1;
      const newCorrect = isCorrect ? prev.correctDecisions + 1 : prev.correctDecisions;
      const newIncorrect = !isCorrect ? prev.incorrectDecisions + 1 : prev.incorrectDecisions;
      const newAvgTime =
        (prev.averageReactionTimeSeconds * prev.totalDecisions + reactionTime) / newTotal;

      const scorePenalty = isCorrect ? 0 : difficulty === 'advanced' ? 25 : 15;
      const newOverall = Math.max(0, Math.min(100, Math.round((newCorrect / newTotal) * 100)));

      const addedXP = isCorrect ? 50 : 0;

      return {
        ...prev,
        totalDecisions: newTotal,
        correctDecisions: newCorrect,
        incorrectDecisions: newIncorrect,
        overallScore: newOverall,
        hazardRecognition: isCorrect ? prev.hazardRecognition : Math.max(40, prev.hazardRecognition - 10),
        decisionMaking: newOverall,
        emergencyResponse: isCorrect ? prev.emergencyResponse : Math.max(40, prev.emergencyResponse - 15),
        averageReactionTimeSeconds: parseFloat(newAvgTime.toFixed(1)),
        xpEarned: prev.xpEarned + addedXP
      };
    });

    // Update Trainee Profile XP in localStorage
    if (isCorrect) {
      try {
        const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
        if (saved) {
          const profile = JSON.parse(saved);
          profile.xp = (profile.xp || 780) + 50;
          localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
        }
      } catch (err) {
        // storage fallback
      }
    }

    // Record decision in history
    setDecisionHistory((prev) => [
      {
        id: `dec-${Date.now()}`,
        eventTitle: activeEvent?.titleEn || 'Safety Event',
        isCorrect,
        optionChosen: isHindi ? option.textHi : option.textEn,
        reactionTime: parseFloat(reactionTime.toFixed(1)),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      ...prev.slice(0, 9)
    ]);

    // Adaptive Training: If incorrect, set targeted tutorial recommendation
    if (!isCorrect && activeEvent) {
      generateAdaptiveRecommendation(activeEvent);
    }
  };

  const generateAdaptiveRecommendation = (event: VirtualSafetyEvent) => {
    switch (event.remediationTag) {
      case 'fire':
        setAdaptiveRec({
          recommendedModule: 'Industrial Fire Emergency & Evacuation',
          targetId: 'scenario-3-fire',
          moduleType: 'tutorial',
          topic: 'fire',
          reasonEn: 'Unsafe fire egress decision detected. Master the PASS extinguisher method and smoke navigation.',
          reasonHi: 'आग से बचाव में त्रुटि पाई गई। अग्निशामक PASS नियम और सुरक्षित निकास सीखें।',
          priority: 'urgent'
        });
        break;
      case 'electrical':
        setAdaptiveRec({
          recommendedModule: 'Electrical Infrastructure & 440V LOTO Protocol',
          targetId: 'scenario-2-electrical',
          moduleType: 'tutorial',
          topic: 'electrical',
          reasonEn: 'High-voltage safety infraction. Practice Lockout/Tagout isolation and dielectric barrier clearances.',
          reasonHi: 'हाई-वोल्टेज बिजली का खतरा। LOTO ताला-टैग प्रक्रिया और इंसुलेटेड सुरक्षा सीखें।',
          priority: 'urgent'
        });
        break;
      case 'mining':
        setAdaptiveRec({
          recommendedModule: 'Mining Underground & Haulage Safety (DGMS)',
          targetId: 'scenario-4-mining',
          moduleType: 'tutorial',
          topic: 'mining',
          reasonEn: 'DGMS protocol violation. Review methane limits, roof support plans, and haulage standoff.',
          reasonHi: 'डीजीएमएस नियमों की अनदेखी। मीथेन सीमा, खदान छत सपोर्ट और डम्पर दूरी सीखें।',
          priority: 'urgent'
        });
        break;
      case 'machinery':
        setAdaptiveRec({
          recommendedModule: 'Heavy Machinery & Nip-Point Guarding',
          targetId: 'scenario-5-machinery',
          moduleType: 'tutorial',
          topic: 'machinery',
          reasonEn: 'Rotating equipment risk. Revisit emergency stop (E-Stop) procedures and physical barrier interlocks.',
          reasonHi: 'चलती मशीनों में हाथ फंसने का जोखिम। इमरजेंसी स्टॉप और सुरक्षा जाली के नियम सीखें।',
          priority: 'urgent'
        });
        break;
      default:
        setAdaptiveRec({
          recommendedModule: 'PPE & Industrial Hazard Baseline',
          targetId: 'scenario-1-ppe',
          moduleType: 'tutorial',
          topic: 'ppe',
          reasonEn: 'Basic PPE non-compliance detected. Review IS 2925 helmets and safety footgear.',
          reasonHi: 'पीपीई अनुपालन में कमी। सही हेलमेट और सुरक्षा जूतों के नियम देखें।',
          priority: 'recommended'
        });
    }
  };

  const handleNextStage = () => {
    if (activeEvent && currentStageIndex < activeEvent.stages.length - 1) {
      setCurrentStageIndex((prev) => prev + 1);
    }
  };

  const handleCloseEvent = () => {
    setActiveEvent(null);
    setIsAlarmActive(false);
    setCurrentStageIndex(0);

    setMetrics((prev) => ({
      ...prev,
      eventsResolved: prev.eventsResolved + 1
    }));

    // If in surprise mode, queue next incident
    if (mode === 'surprise' && isSimRunning) {
      scheduleSurpriseEvent();
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-12">
      {/* 1. MODULE HERO & CONTROLS HEADER */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-950 text-cyan-400 border border-cyan-800/80 flex items-center gap-1.5">
                <Factory className="w-3.5 h-3.5" />
                <span>{isHindi ? 'आभासी औद्योगिक पर्यावरण' : 'Virtual Industrial Safety Environment'}</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                Interactive Simulation
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950 text-amber-300 border border-amber-800 font-mono">
                {currentEnv.regulatoryStandard}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight">
              {isHindi ? currentEnv.nameHi : currentEnv.nameEn}
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {isHindi ? currentEnv.descriptionHi : currentEnv.descriptionEn}
            </p>
          </div>

          {/* Quick Actions & Language Toggle */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Language switch */}
            <button
              onClick={() => setIsHindi(!isHindi)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Languages className="w-4 h-4 text-cyan-400" />
              <span>{isHindi ? 'English' : 'हिंदी'}</span>
            </button>

            {/* Trainer Controls Toggle */}
            <button
              onClick={() => setTrainerPanelOpen(!trainerPanelOpen)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-colors ${
                trainerPanelOpen
                  ? 'bg-amber-950 border-amber-600 text-amber-300'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>{isHindi ? 'प्रशिक्षक नियंत्रण (Trainer)' : 'Trainer Controls'}</span>
            </button>

            {/* Simulation Play / Pause Button */}
            {!isSimRunning ? (
              <button
                onClick={handleStartSimulation}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-emerald-950 transition-all hover:scale-105"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{isHindi ? 'सिमुलेशन शुरू करें' : 'Enter Simulation'}</span>
              </button>
            ) : (
              <button
                onClick={handleResetSimulation}
                className="px-4 py-2.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-700 text-rose-300 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{isHindi ? 'रीसेट करें' : 'Reset / Exit'}</span>
              </button>
            )}
          </div>
        </div>

        {/* ENVIRONMENT, MODE & DIFFICULTY TABS */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          {/* Environment Selector */}
          <div className="flex items-center gap-2 bg-slate-950/70 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => {
                setSelectedEnvId('manufacturing');
                handleResetSimulation();
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                selectedEnvId === 'manufacturing'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Factory className="w-4 h-4" />
              <span>{isHindi ? '🏭 विनिर्माण फ्लोर' : '🏭 Manufacturing Floor'}</span>
            </button>

            <button
              onClick={() => {
                setSelectedEnvId('mining');
                handleResetSimulation();
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                selectedEnvId === 'mining'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Pickaxe className="w-4 h-4" />
              <span>{isHindi ? '⛏ खनन क्षेत्र' : '⛏ Mining Area'}</span>
            </button>
          </div>

          {/* Mode Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950/70 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => setMode('practice')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                mode === 'practice'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🟢 {isHindi ? 'अभ्यास मोड' : 'Practice Mode'}
            </button>
            <button
              onClick={() => setMode('assessment')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                mode === 'assessment'
                  ? 'bg-amber-950 text-amber-300 border border-amber-700 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🟡 {isHindi ? 'मूल्यांकन मोड' : 'Assessment Mode'}
            </button>
            <button
              onClick={() => setMode('surprise')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                mode === 'surprise'
                  ? 'bg-rose-950 text-rose-300 border border-rose-700 font-bold animate-pulse'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🔴 {isHindi ? 'आकस्मिक घटना मोड' : 'Surprise Mode'}
            </button>
          </div>

          {/* Difficulty Level */}
          <div className="flex items-center gap-1 text-xs text-slate-400 bg-slate-950/70 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-slate-500 font-medium">{isHindi ? 'कठिनाई:' : 'Difficulty:'}</span>
            {(['beginner', 'intermediate', 'advanced'] as SimulationDifficulty[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setDifficulty(lvl)}
                className={`px-2 py-0.5 rounded capitalize ${
                  difficulty === lvl
                    ? 'bg-slate-700 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. TRAINER CONTROL PANEL (IF OPEN) */}
      {trainerPanelOpen && (
        <div className="bg-slate-900/95 border border-amber-500/40 rounded-2xl p-4 sm:p-5 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-950 text-amber-400 border border-amber-800">
                <Settings2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  {isHindi ? 'प्रशिक्षक सिमुलेशन कंट्रोल स्टेशन' : 'Trainer Simulation Control Station'}
                  <span className="text-[10px] font-mono bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800">
                    Live Instructor Mode
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  {isHindi
                    ? 'प्रशिक्षार्थी के लिए तुरंत कोई भी ख़तरा शुरू करें और उसके निर्णय का परीक्षण करें।'
                    : 'Force-trigger specific unexpected hazards on demand to evaluate trainee reflexes.'}
                </p>
              </div>
            </div>
            <button
              onClick={() => triggerRandomEvent()}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shrink-0"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{isHindi ? 'रैंडम ख़तरा भेजें' : 'Trigger Random Hazard'}</span>
            </button>
          </div>

          {/* Trigger Event Buttons Grid */}
          <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {currentEnv.availableEvents.map((evt) => (
              <button
                key={evt.id}
                onClick={() => triggerSpecificEvent(evt)}
                className="text-left p-3 rounded-xl bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-amber-500/60 transition-all flex items-start gap-2.5 group"
              >
                <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-amber-400 group-hover:scale-110 transition-transform">
                  {evt.hazardType === 'fire' ? (
                    <Flame className="w-4 h-4 text-red-500" />
                  ) : evt.hazardType === 'electrical' ? (
                    <Zap className="w-4 h-4 text-amber-400" />
                  ) : evt.hazardType === 'roof' ? (
                    <Pickaxe className="w-4 h-4 text-yellow-500" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white truncate">
                    {isHindi ? evt.titleHi : evt.titleEn}
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span className="uppercase text-amber-400 font-mono text-[10px]">{evt.severity}</span>
                    <span>• {evt.stages.length} {evt.stages.length > 1 ? 'stages' : 'stage'}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. SIMULATION VIEWPORT (CANVAS) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-semibold text-slate-200">
              {isHindi ? 'कार्यस्थल सिमुलेशन कैनवास' : 'Interactive Workplace Canvas'}
            </span>
            <span className="text-slate-500 font-mono">
              ({currentEnv.hotspots.length} inspection stations active)
            </span>
          </div>

          <div className="flex items-center gap-3">
            {activeEvent && (
              <span className="text-red-400 font-bold flex items-center gap-1 animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" />
                {isHindi ? 'घटना सक्रिय!' : 'Incident Underway!'}
              </span>
            )}
            <span className="text-slate-500">
              Mode: <strong className="text-slate-300 capitalize">{mode}</strong>
            </span>
          </div>
        </div>

        {/* 2D/2.5D Canvas Component */}
        <VirtualEnvironmentCanvas
          environment={currentEnv}
          activeEvent={activeEvent}
          activeStageIndex={currentStageIndex}
          selectedHotspot={selectedHotspot}
          onSelectHotspot={setSelectedHotspot}
          isHindi={isHindi}
          isAlarmActive={isAlarmActive}
        />
      </div>

      {/* 4. PERFORMANCE SCORECARD & REAL-TIME STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Overall Safety Score */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 text-center">
          <div className="text-[11px] text-slate-400 font-medium">{isHindi ? 'सुरक्षा स्कोर' : 'Safety Score'}</div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">
            {metrics.overallScore}%
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            {metrics.overallScore >= 80 ? 'Grade A (Pass)' : 'Needs Remediation'}
          </div>
        </div>

        {/* Hazard Recognition */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 text-center">
          <div className="text-[11px] text-slate-400 font-medium">{isHindi ? 'ख़तरा पहचान' : 'Hazard Recognition'}</div>
          <div className="text-xl sm:text-2xl font-black text-cyan-400 mt-1">
            {metrics.hazardRecognition}%
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">Awareness Metric</div>
        </div>

        {/* Decision Making */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 text-center">
          <div className="text-[11px] text-slate-400 font-medium">{isHindi ? 'निर्णय क्षमता' : 'Decision Making'}</div>
          <div className="text-xl sm:text-2xl font-black text-blue-400 mt-1">
            {metrics.decisionMaking}%
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">Statutory Rules</div>
        </div>

        {/* Avg Reaction Time */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 text-center">
          <div className="text-[11px] text-slate-400 font-medium">{isHindi ? 'प्रतिक्रिया समय' : 'Avg Reaction'}</div>
          <div className="text-xl sm:text-2xl font-black text-amber-400 mt-1 flex items-center justify-center gap-1">
            <span>{metrics.averageReactionTimeSeconds}s</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">Response Speed</div>
        </div>

        {/* Decisions Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 text-center">
          <div className="text-[11px] text-slate-400 font-medium">{isHindi ? 'सफल / कुल निर्णय' : 'Safe Decisions'}</div>
          <div className="text-xl sm:text-2xl font-black text-white mt-1">
            <span className="text-emerald-400">{metrics.correctDecisions}</span>
            <span className="text-slate-600 text-base"> / {metrics.totalDecisions}</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            {metrics.incorrectDecisions} error{metrics.incorrectDecisions !== 1 ? 's' : ''}
          </div>
        </div>

        {/* XP Earned */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 text-center">
          <div className="text-[11px] text-slate-400 font-medium">{isHindi ? 'कुल XP अर्जित' : 'Session XP'}</div>
          <div className="text-xl sm:text-2xl font-black text-purple-400 mt-1 flex items-center justify-center gap-1">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>+{metrics.xpEarned}</span>
          </div>
          <div className="text-[10px] text-purple-400/80 font-mono mt-0.5">Synced to Profile</div>
        </div>
      </div>

      {/* 5. ADAPTIVE TRAINING RECOMMENDATION CARD (WHEN MISTAKE OCCURS) */}
      {adaptiveRec && (
        <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/40 border border-amber-500/50 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-300">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-xl bg-amber-950 border border-amber-600 text-amber-400 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {isHindi ? 'अनुकूली प्रशिक्षण अनुशंसा' : 'Adaptive Training Recommendation'}
                </span>
                <span className="text-xs font-mono text-amber-400">
                  Target: {adaptiveRec.topic.toUpperCase()}
                </span>
              </div>
              <h4 className="text-base font-bold text-white mt-1">
                {adaptiveRec.recommendedModule}
              </h4>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                {isHindi ? adaptiveRec.reasonHi : adaptiveRec.reasonEn}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
            {onWatchSafetySteps && (
              <button
                onClick={() => onWatchSafetySteps(adaptiveRec.targetId)}
                className="flex-1 sm:flex-initial px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-amber-950 transition-all hover:scale-105"
              >
                <Film className="w-4 h-4" />
                <span>{isHindi ? '🎬 सुरक्षा कदम देखें' : '🎬 Watch Safety Steps'}</span>
              </button>
            )}

            {onStartScenario && (
              <button
                onClick={() => onStartScenario(adaptiveRec.targetId)}
                className="flex-1 sm:flex-initial px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
              >
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>{isHindi ? 'अभ्यास परिदृश्य' : 'Practice Scenario'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 6. RECENT DECISION LOGS FEED */}
      {decisionHistory.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>{isHindi ? 'सत्र निर्णय इतिहास' : 'Session Decision Stream'}</span>
            </h4>
            <span className="text-xs text-slate-500">
              {decisionHistory.length} decision{decisionHistory.length > 1 ? 's' : ''} recorded
            </span>
          </div>

          <div className="space-y-2">
            {decisionHistory.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${
                  item.isCorrect
                    ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                    : 'bg-rose-950/30 border-rose-500/30 text-rose-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <div>
                    <span className="font-bold text-white mr-2">{item.eventTitle}:</span>
                    <span className="text-slate-300">{item.optionChosen}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[11px] font-mono shrink-0 self-end sm:self-auto text-slate-400">
                  <span>⏱ {item.reactionTime}s</span>
                  <span>{item.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. DECISION INTERACTION MODAL (WHEN INCIDENT IS ACTIVE) */}
      {activeEvent && (
        <EventDecisionModal
          event={activeEvent}
          currentStageIndex={currentStageIndex}
          mode={mode}
          isHindi={isHindi}
          onDecisionSubmitted={handleDecisionSubmitted}
          onNextStage={handleNextStage}
          onClose={handleCloseEvent}
        />
      )}

      {/* 8. SAFETY & ETHICS DISCLAIMER BANNER */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400 space-y-1">
        <p className="font-medium text-slate-300">
          ⚠️ {isHindi
            ? 'सुरक्षा प्रशिक्षण अस्वीकरण: यह एक शैक्षणिक सिमुलेशन है। वास्तविक आपातकाल में सदैव अपने संयंत्र के आधिकारिक एसओपी का पालन करें।'
            : 'Safety Simulation Disclaimer: This virtual environment is designed for vocational training. In a real-world emergency, always follow your facility’s official standard operating procedures.'}
        </p>
        <p className="text-[11px] text-slate-500">
          SURAKSHAAR AI • Verified against DGMS Coal Mines Regulations 2017 & Indian Factories Act 1948
        </p>
      </div>
    </div>
  );
};
