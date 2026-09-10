import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ImmersiveScenarioDefinition,
  SimulationPhase,
  SimulationTrainingMode,
  DecisionOption,
  HazardIdentificationItem,
  SimulationScoreMetrics,
  AuthUser
} from '../../types';
import { simAudio } from '../../services/simulationAudioService';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Volume2,
  VolumeX,
  Languages,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Flame,
  Zap,
  HardHat,
  DoorOpen,
  PhoneCall,
  Lock,
  Pickaxe,
  Footprints,
  Users,
  Bot,
  Send,
  Mic,
  MicOff,
  Sparkles,
  Info,
  Timer,
  ChevronRight,
  TrendingUp,
  Film
} from 'lucide-react';

interface ImmersiveSimulationPlayerProps {
  scenario: ImmersiveScenarioDefinition;
  mode: SimulationTrainingMode;
  isHindi: boolean;
  currentUser?: AuthUser | null;
  onToggleLanguage: () => void;
  onWatchSafetySteps?: (scenarioId: string) => void;
  onExitSimulation?: () => void;
  onScenarioCompleted?: (scoreMetrics: SimulationScoreMetrics) => void;
}

const PHASES_LIST: { id: SimulationPhase; labelEn: string; labelHi: string; icon: string }[] = [
  { id: 'normal', labelEn: '1. Normal', labelHi: '1. सामान्य', icon: '🏭' },
  { id: 'warning', labelEn: '2. Warning', labelHi: '2. चेतावनी', icon: '⚠️' },
  { id: 'incident', labelEn: '3. Incident', labelHi: '3. दुर्घटना', icon: '🚨' },
  { id: 'decision', labelEn: '4. Decision', labelHi: '4. निर्णय', icon: '🤔' },
  { id: 'consequence', labelEn: '5. Consequence', labelHi: '5. परिणाम', icon: '⚡' },
  { id: 'solution', labelEn: '6. Solution', labelHi: '6. समाधान', icon: '✅' },
  { id: 'practice', labelEn: '7. Practice', labelHi: '7. अभ्यास', icon: '🔄' },
  { id: 'score', labelEn: '8. Score', labelHi: '8. रिपोर्ट', icon: '🏆' }
];

export const ImmersiveSimulationPlayer: React.FC<ImmersiveSimulationPlayerProps> = ({
  scenario,
  mode,
  isHindi,
  currentUser,
  onToggleLanguage,
  onWatchSafetySteps,
  onExitSimulation,
  onScenarioCompleted
}) => {
  // Current Phase
  const [currentPhase, setCurrentPhase] = useState<SimulationPhase>('normal');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);

  // Decision State
  const [selectedOption, setSelectedOption] = useState<DecisionOption | null>(null);
  const [decisionTimer, setDecisionTimer] = useState<number>(15);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [reactionTime, setReactionTime] = useState<number>(0);
  const decisionStartTimeRef = useRef<number>(Date.now());

  // Hazard Identification State (for ppe-hazard-id scenario)
  const [inspectedHazardIds, setInspectedHazardIds] = useState<string[]>([]);
  const [activeInspectionItem, setActiveInspectionItem] = useState<HazardIdentificationItem | null>(null);

  // AI Safety Coach Drawer inside Simulation
  const [showAiCoach, setShowAiCoach] = useState<boolean>(false);
  const [aiQuestion, setAiQuestion] = useState<string>('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  // Score metrics
  const [scoreMetrics, setScoreMetrics] = useState<SimulationScoreMetrics>({
    overallScore: 100,
    hazardRecognition: 100,
    decisionMaking: 100,
    emergencyResponse: 100,
    totalDecisions: 0,
    correctDecisions: 0,
    incorrectDecisions: 0,
    averageReactionTimeSeconds: 0,
    xpEarned: 0,
    eventsEncountered: 1,
    eventsResolved: 0
  });

  // Scene transition timer reference
  const phaseTimerRef = useRef<any>(null);

  // Auto-play / Advance Phases when isPlaying is true
  useEffect(() => {
    if (!isPlaying) return;

    if (currentPhase === 'normal') {
      simAudio.playAmbient(scenario.ambientSoundType);
      const narration = isHindi
        ? scenario.phases.normal.narrationHi
        : scenario.phases.normal.narrationEn;
      simAudio.speak(narration, isHindi);

      // Transition to warning after duration (or shorter in surprise mode)
      const duration = mode === 'surprise' ? 2500 : scenario.phases.normal.durationSeconds * 1000;
      phaseTimerRef.current = setTimeout(() => {
        goToPhase('warning');
      }, duration);
    } else if (currentPhase === 'warning') {
      simAudio.playWarningBuzzer();
      const narration = isHindi
        ? scenario.phases.warning.narrationHi
        : scenario.phases.warning.narrationEn;
      simAudio.speak(narration, isHindi);

      const duration = mode === 'surprise' ? 1500 : scenario.phases.warning.durationSeconds * 1000;
      phaseTimerRef.current = setTimeout(() => {
        goToPhase('incident');
      }, duration);
    } else if (currentPhase === 'incident') {
      simAudio.playEmergencySiren(4);
      if (scenario.phases.incident.visualEffect === 'electrical_arc') {
        simAudio.playElectricalSpark();
      }

      const alertVoice = isHindi
        ? scenario.phases.incident.voiceAlertHi
        : scenario.phases.incident.voiceAlertEn;
      simAudio.speak(alertVoice, isHindi);

      const duration = scenario.phases.incident.durationSeconds * 1000;
      phaseTimerRef.current = setTimeout(() => {
        goToPhase('decision');
      }, duration);
    } else if (currentPhase === 'decision') {
      // Simulation pauses for decision
      simAudio.stopAmbient();
      decisionStartTimeRef.current = Date.now();
      setDecisionTimer(15);
      setTimerActive(mode !== 'practice');

      const prompt = isHindi
        ? `${scenario.phases.decision.situationHi}. ${scenario.phases.decision.promptHi}`
        : `${scenario.phases.decision.situationEn}. ${scenario.phases.decision.promptEn}`;
      simAudio.speak(prompt, isHindi);
    }

    return () => {
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    };
  }, [currentPhase, isPlaying, scenario, isHindi, mode]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      simAudio.stopAll();
    };
  }, []);

  // Timer countdown for Decision phase
  useEffect(() => {
    if (currentPhase !== 'decision' || !timerActive || decisionTimer <= 0) return;

    const interval = setInterval(() => {
      setDecisionTimer((prev) => {
        if (prev <= 1) {
          // Time expired: auto-select first incorrect option
          const incorrect =
            scenario.phases.decision.options.find((o) => !o.isCorrect) ||
            scenario.phases.decision.options[0];
          handleSelectOption(incorrect);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentPhase, timerActive, decisionTimer, scenario]);

  const goToPhase = (phase: SimulationPhase) => {
    if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    simAudio.stopSpeech();
    setCurrentPhase(phase);
  };

  const handleSelectOption = (option: DecisionOption) => {
    const elapsed = (Date.now() - decisionStartTimeRef.current) / 1000;
    setReactionTime(parseFloat(elapsed.toFixed(1)));
    setSelectedOption(option);
    setTimerActive(false);

    // Audio cue
    if (option.isCorrect) {
      simAudio.playSuccessChime();
    } else {
      simAudio.playUnsafeTone();
    }

    // Update score
    const isCorrect = option.isCorrect;
    const gainedXp = isCorrect ? 50 : 0;

    setScoreMetrics((prev) => {
      const total = prev.totalDecisions + 1;
      const correct = isCorrect ? prev.correctDecisions + 1 : prev.correctDecisions;
      const incorrect = !isCorrect ? prev.incorrectDecisions + 1 : prev.incorrectDecisions;
      const overall = Math.round((correct / total) * 100);

      return {
        ...prev,
        totalDecisions: total,
        correctDecisions: correct,
        incorrectDecisions: incorrect,
        overallScore: overall,
        decisionMaking: overall,
        emergencyResponse: isCorrect ? 100 : 50,
        averageReactionTimeSeconds: parseFloat(
          ((prev.averageReactionTimeSeconds * prev.totalDecisions + elapsed) / total).toFixed(1)
        ),
        xpEarned: prev.xpEarned + gainedXp,
        eventsResolved: prev.eventsResolved + 1
      };
    });

    // Save XP to profile in localStorage
    if (isCorrect) {
      try {
        const saved = localStorage.getItem('sih26041_trainee_profile');
        if (saved) {
          const profile = JSON.parse(saved);
          profile.xp = (profile.xp || 780) + gainedXp;
          localStorage.setItem('sih26041_trainee_profile', JSON.stringify(profile));
        }
      } catch (e) {}
    }

    // Voice explanation
    const explanation = isHindi
      ? `${isCorrect ? 'सही उत्तर!' : 'असुरक्षित निर्णय!'} ${option.explanationHi}`
      : `${isCorrect ? 'Correct action!' : 'Unsafe action!'} ${option.explanationEn}`;
    simAudio.speak(explanation, isHindi);

    // Automatically transition to Consequence phase after brief delay
    setTimeout(() => {
      goToPhase('consequence');
    }, 1200);
  };

  // Hazard tap handler for PPE scenario
  const handleTapHazard = (item: HazardIdentificationItem) => {
    setActiveInspectionItem(item);

    if (!inspectedHazardIds.includes(item.id)) {
      setInspectedHazardIds((prev) => [...prev, item.id]);

      if (item.isActualHazard) {
        simAudio.playSuccessChime();
        setScoreMetrics((prev) => ({ ...prev, xpEarned: prev.xpEarned + 20 }));
      } else {
        simAudio.playWarningBuzzer();
      }
    }

    const feedback = isHindi
      ? item.isActualHazard
        ? `खतरा पहचाना गया: ${item.nameHi}. ${item.descriptionHi}`
        : `${item.nameHi}. यह सुरक्षित स्थिति है, कोई खतरा नहीं।`
      : item.isActualHazard
      ? `Hazard Identified: ${item.nameEn}. ${item.descriptionEn}`
      : `${item.nameEn}. This is a compliant condition, not a hazard.`;

    simAudio.speak(feedback, isHindi);
  };

  // AI Safety Coach Handler
  const askAiSafetyCoach = async (customPrompt?: string) => {
    const questionText =
      customPrompt ||
      aiQuestion ||
      (isHindi
        ? `${scenario.titleHi} में यह कदम क्यों ${selectedOption?.isCorrect ? 'सुरक्षित' : 'असुरक्षित'} है?`
        : `Why is this action ${selectedOption?.isCorrect ? 'safe' : 'unsafe'} in ${scenario.titleEn}?`);

    setIsAiLoading(true);
    setShowAiCoach(true);

    try {
      const res = await fetch('/api/ai-safety-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionText,
          language: isHindi ? 'hi' : 'en',
          scenarioId:
            scenario.id === 'fire-emergency'
              ? 'scenario-3-fire'
              : scenario.id === 'electrical-incident'
              ? 'scenario-2-electrical'
              : scenario.id === 'mining-incident'
              ? 'scenario-4-mining'
              : scenario.id === 'machinery-incident'
              ? 'scenario-5-machinery'
              : 'scenario-1-ppe',
          isVoice: false
        })
      });

      if (!res.ok) throw new Error('AI Coach unavailable');
      const data = await res.json();
      setAiAnswer(data.answer);
      setAiQuestion('');
      simAudio.speak(data.answer, isHindi);
    } catch (e) {
      // Offline fallback
      const fallback = selectedOption?.isCorrect
        ? isHindi
          ? `यह निर्णय अधिकृत सुरक्षा मानकों (${selectedOption.standardRule || 'IS/DGMS'}) के अनुरूप है। कार्यस्थल में कभी भी सीधे खतरनाक ऊर्जा के संपर्क में न आएं।`
          : `This action aligns with ${selectedOption?.standardRule || 'statutory safety regulations'}. Maintaining standoff distance and locking out energy protects personnel.`
        : isHindi
        ? `यह निर्णय बेहद खतरनाक है। बिना व्यक्तिगत सुरक्षा उपकरणों (पीपीई) या अनधिकृत रूप से मशीनों को छूने से गंभीर चोट लग सकती है।`
        : `This action violates statutory safety protocols and exposes the worker to immediate hazards. Always isolate energy sources and report to authorities.`;
      setAiAnswer(fallback);
      simAudio.speak(fallback, isHindi);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Toggle Voice Recognition for AI Coach
  const toggleVoiceInput = () => {
    const SpeechRec =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      alert(isHindi ? 'ब्राउज़र में वॉइस इनपुट समर्थित नहीं है।' : 'Voice input not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const rec = new SpeechRec();
    rec.lang = isHindi ? 'hi-IN' : 'en-IN';
    rec.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setAiQuestion(transcript);
      setIsListening(false);
      askAiSafetyCoach(transcript);
    };
    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);

    recognitionRef.current = rec;
    rec.start();
    setIsListening(true);
  };

  const toggleAudio = () => {
    const nextMuted = !isAudioMuted;
    setIsAudioMuted(nextMuted);
    simAudio.setMuted(nextMuted);
  };

  // Current phase index (1 to 8)
  const currentPhaseIndex = PHASES_LIST.findIndex((p) => p.id === currentPhase) + 1;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4">
      {/* 1. TOP VIDEO PLAYER CONTROLS & TIMELINE BAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Title & Phase Indicator */}
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-950 text-red-400 border border-red-800">
                  Interactive Simulation
                </span>
                <span className="text-xs font-mono font-bold text-cyan-400">
                  {isHindi ? `चरण ${currentPhaseIndex} / 8: ` : `Phase ${currentPhaseIndex} of 8: `}
                  <strong className="text-white uppercase">{currentPhase}</strong>
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight mt-0.5">
                {isHindi ? scenario.titleHi : scenario.titleEn}
              </h2>
            </div>
          </div>

          {/* Player Navigation Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Play / Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isPlaying
                  ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
                  : 'bg-emerald-950 border-emerald-600 text-emerald-300'
              }`}
              title={isPlaying ? 'Pause Simulation' : 'Resume Simulation'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Play'}</span>
            </button>

            {/* Replay Current Phase */}
            <button
              onClick={() => goToPhase(currentPhase)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs flex items-center gap-1.5"
              title={isHindi ? 'वर्तमान चरण दोबारा देखें' : 'Replay Current Phase'}
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">{isHindi ? 'दोहराएं' : 'Replay'}</span>
            </button>

            {/* Next Phase Skip */}
            <button
              onClick={() => {
                const nextIdx = (currentPhaseIndex % 8);
                goToPhase(PHASES_LIST[nextIdx].id);
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs flex items-center gap-1.5"
              title="Next Phase"
            >
              <SkipForward className="w-4 h-4" />
              <span className="hidden sm:inline">{isHindi ? 'आगे' : 'Next'}</span>
            </button>

            {/* Audio Voice Mute Toggle */}
            <button
              onClick={toggleAudio}
              className={`p-2 rounded-xl border transition-colors ${
                isAudioMuted
                  ? 'bg-rose-950 border-rose-700 text-rose-400'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
              }`}
              title={isAudioMuted ? 'Unmute Sound' : 'Mute Sound'}
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* Language Switch */}
            <button
              onClick={onToggleLanguage}
              className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
            >
              <Languages className="w-4 h-4 text-cyan-400" />
              <span>{isHindi ? 'English' : 'हिंदी'}</span>
            </button>
          </div>
        </div>

        {/* 8-Phase Interactive Scrubbing Bar */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1">
            {PHASES_LIST.map((item, idx) => {
              const isCurrent = item.id === currentPhase;
              const isPast = idx < currentPhaseIndex - 1;

              return (
                <button
                  key={item.id}
                  onClick={() => goToPhase(item.id)}
                  className={`px-1.5 py-1.5 rounded-lg text-[11px] font-bold truncate transition-all text-center flex flex-col items-center justify-center gap-0.5 border ${
                    isCurrent
                      ? 'bg-cyan-600 text-white border-cyan-400 shadow-md shadow-cyan-950 scale-102'
                      : isPast
                      ? 'bg-slate-800/90 text-slate-300 border-slate-700 hover:bg-slate-800'
                      : 'bg-slate-950/60 text-slate-500 border-slate-900 hover:text-slate-300'
                  }`}
                >
                  <span className="text-xs">{item.icon}</span>
                  <span className="truncate w-full">{isHindi ? item.labelHi : item.labelEn}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. THE SIMULATION VIEWPORT (ANIMATED WORKPLACE CANVAS) */}
      <div className="relative w-full aspect-[16/9] min-h-[360px] sm:min-h-[460px] bg-slate-950 border-2 border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between select-none">
        {/* Real-time Ambient Lighting Overlay based on Phase */}
        <div
          className={`absolute inset-0 pointer-events-none transition-colors duration-700 z-10 ${
            currentPhase === 'incident'
              ? 'bg-red-950/30 ring-inset ring-4 ring-red-600 animate-pulse'
              : currentPhase === 'warning'
              ? 'bg-amber-950/20 ring-inset ring-2 ring-amber-500/50'
              : currentPhase === 'consequence' && selectedOption?.isCorrect
              ? 'bg-emerald-950/20'
              : 'bg-transparent'
          }`}
        />

        {/* 2.1 SVG Dynamic Environment Artwork */}
        <div className="absolute inset-0 overflow-hidden">
          <svg
            viewBox="0 0 1000 600"
            preserveAspectRatio="xMidYMid slice"
            className="w-full h-full"
          >
            <defs>
              <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>
              <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
              <radialGradient id="sparkGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fef08a" stopOpacity="1" />
                <stop offset="60%" stopColor="#f97316" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="smokeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#475569" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Back Wall & Industrial Perspective Floor */}
            <rect x="0" y="0" width="1000" height="340" fill="url(#wallGrad)" />
            <polygon points="0,340 1000,340 1000,600 0,600" fill="url(#floorGrad)" />

            {/* Perspective Grid Floor Lines */}
            <line x1="0" y1="340" x2="1000" y2="340" stroke="#334155" strokeWidth="2" />
            <line x1="150" y1="340" x2="0" y2="600" stroke="#1e293b" strokeWidth="1.5" />
            <line x1="350" y1="340" x2="200" y2="600" stroke="#1e293b" strokeWidth="1.5" />
            <line x1="650" y1="340" x2="800" y2="600" stroke="#1e293b" strokeWidth="1.5" />
            <line x1="850" y1="340" x2="1000" y2="600" stroke="#1e293b" strokeWidth="1.5" />

            {/* Overhead Crane Girders & Safety Signs */}
            <line x1="0" y1="70" x2="1000" y2="70" stroke="#eab308" strokeWidth="8" strokeDasharray="25 15" opacity="0.6" />
            <text x="500" y="55" fill="#facc15" fontSize="12" fontWeight="bold" textAnchor="middle" letterSpacing="3">
              ▲ CAUTION: OVERHEAD LOAD TRAJECTORY • KEEP CLEAR ▲
            </text>

            {/* SCENARIO SPECIFIC SCENERY */}
            {scenario.environmentType === 'mining' ? (
              // Mining Strata Roof & Hydraulic Props
              <g id="mining-props">
                {/* Jagged Rock Strata Roof */}
                <path
                  d="M0,0 L1000,0 L1000,180 Q850,220 700,190 Q500,240 300,190 Q150,210 0,170 Z"
                  fill="#1c1917"
                  stroke="#44403c"
                  strokeWidth="3"
                />
                {/* Steel Roof Arches */}
                <path d="M120,340 C120,180 280,180 280,340" stroke="#78716c" strokeWidth="10" fill="none" />
                <path d="M720,340 C720,180 880,180 880,340" stroke="#78716c" strokeWidth="10" fill="none" />
                {/* Yellow Safety Signs */}
                <rect x="750" y="240" width="100" height="40" rx="4" fill="#000" stroke="#eab308" strokeWidth="2" />
                <text x="800" y="265" fill="#facc15" fontSize="10" fontWeight="bold" textAnchor="middle">
                  DGMS CMR 123
                </text>
              </g>
            ) : (
              // Manufacturing Plant Machinery & Safety Exit
              <g id="mfg-equipment">
                {/* Emergency Exit Door in Background */}
                <rect x="860" y="160" width="85" height="180" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                <rect x="875" y="135" width="55" height="20" rx="3" fill="#10b981" />
                <text x="902" y="149" fill="#022c22" fontSize="9" fontWeight="bold" textAnchor="middle">
                  EXIT / निकास
                </text>

                {/* Industrial Lathe / CNC Station */}
                <rect x="80" y="240" width="220" height="150" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                <circle cx="140" cy="300" r="30" fill="#0f172a" stroke="#06b6d4" strokeWidth="3" className="animate-spin origin-center" />
                <rect x="185" y="280" width="80" height="40" fill="#334155" />

                {/* Heavy Conveyor Machine */}
                <rect x="400" y="270" width="300" height="60" rx="6" fill="#334155" stroke="#64748b" strokeWidth="2" />
                <circle cx="430" cy="300" r="20" fill="#0f172a" stroke="#e2e8f0" strokeWidth="3" />
                <circle cx="670" cy="300" r="20" fill="#0f172a" stroke="#e2e8f0" strokeWidth="3" />
                {/* Red Emergency Stop Mushroom Button */}
                <rect x="360" y="280" width="24" height="24" rx="4" fill="#eab308" />
                <circle cx="372" cy="292" r="10" fill="#ef4444" stroke="#991b1b" strokeWidth="2" className="cursor-pointer" />
              </g>
            )}

            {/* 440V Main Electrical Panel (Focal point for Fire & Electrical) */}
            <g id="main-panel" transform="translate(480, 180)">
              <rect x="-60" y="0" width="120" height="160" rx="6" fill="#1e293b" stroke="#94a3b8" strokeWidth="3" />
              <rect x="-50" y="10" width="100" height="60" rx="4" fill="#0f172a" stroke="#475569" />
              <text x="0" y="30" fill="#facc15" fontSize="10" fontWeight="bold" textAnchor="middle">
                ⚡ 440 VOLTS
              </text>
              <text x="0" y="45" fill="#ef4444" fontSize="8" fontWeight="bold" textAnchor="middle">
                DANGER • खतरा
              </text>

              {/* Status LEDs */}
              <circle cx="-30" cy="90" r="5" fill="#ef4444" className={currentPhase === 'warning' || currentPhase === 'incident' ? 'animate-ping' : ''} />
              <circle cx="0" cy="90" r="5" fill="#eab308" />
              <circle cx="30" cy="90" r="5" fill="#10b981" />
            </g>

            {/* Animated Workers */}
            <g id="workers">
              {/* Worker 1 (Near CNC/Panel) */}
              <g transform="translate(350, 260)">
                <ellipse cx="0" cy="65" rx="14" ry="6" fill="#000" opacity="0.3" />
                {/* Body / High-vis Vest */}
                <rect x="-14" y="20" width="28" height="42" rx="4" fill="#eab308" />
                <rect x="-10" y="30" width="20" height="8" fill="#e2e8f0" />
                {/* Head with Yellow Helmet */}
                <circle cx="0" cy="10" r="10" fill="#fdba74" />
                <path d="M-12,8 Q0,-4 12,8 Z" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
              </g>

              {/* Worker 2 (Near Exit / Safety Zone) */}
              <g transform="translate(800, 280)">
                <ellipse cx="0" cy="65" rx="14" ry="6" fill="#000" opacity="0.3" />
                <rect x="-14" y="20" width="28" height="42" rx="4" fill="#0284c7" />
                <circle cx="0" cy="10" r="10" fill="#fed7aa" />
                <path d="M-12,8 Q0,-4 12,8 Z" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
              </g>
            </g>

            {/* DYNAMIC VISUAL EFFECTS BASED ON PHASE */}
            {/* 1. Warning Phase: Wisps of Smoke or Vibration */}
            {currentPhase === 'warning' && (
              <g id="fx-warning" transform="translate(480, 180)">
                <circle cx="0" cy="-20" r="30" fill="url(#smokeGlow)" className="animate-pulse" />
                <circle cx="10" cy="-40" r="45" fill="url(#smokeGlow)" className="animate-pulse" />
                <text x="0" y="-70" fill="#facc15" fontSize="14" fontWeight="bold" textAnchor="middle" className="animate-bounce">
                  ⚠️ OVERHEATING DETECTED
                </text>
              </g>
            )}

            {/* 2. Incident Phase: Blazing Fire, Sparks, or Falling Rock */}
            {currentPhase === 'incident' && (
              <g id="fx-incident">
                {scenario.phases.incident.visualEffect === 'electrical_arc' ? (
                  // Arc Flash Sparks
                  <g transform="translate(480, 240)">
                    <circle cx="0" cy="0" r="70" fill="url(#sparkGlow)" className="animate-ping" />
                    <line x1="-50" y1="-30" x2="40" y2="40" stroke="#fef08a" strokeWidth="4" />
                    <line x1="30" y1="-40" x2="-40" y2="50" stroke="#67e8f9" strokeWidth="4" />
                    <line x1="-60" y1="20" x2="60" y2="-20" stroke="#ffffff" strokeWidth="5" />
                  </g>
                ) : scenario.phases.incident.visualEffect === 'roof_collapse' ? (
                  // Falling Rock Chunks
                  <g transform="translate(500, 220)">
                    <polygon points="0,0 30,20 15,45 -10,30" fill="#78716c" className="animate-bounce" />
                    <polygon points="60,-30 85,-10 70,15 45,0" fill="#57534e" className="animate-bounce" />
                    <text x="0" y="-40" fill="#ef4444" fontSize="16" fontWeight="black" textAnchor="middle">
                      🚨 ROOF FRACTURE!
                    </text>
                  </g>
                ) : (
                  // Raging Fire & Billowing Smoke Plumes
                  <g transform="translate(480, 220)">
                    <circle cx="0" cy="-60" r="65" fill="url(#smokeGlow)" className="animate-pulse" />
                    <circle cx="-30" cy="-100" r="85" fill="url(#smokeGlow)" className="animate-pulse" />
                    <path
                      d="M-40,20 Q-20,-70 0,-10 Q20,-80 40,20 Z"
                      fill="#ef4444"
                      className="animate-pulse"
                    />
                    <path
                      d="M-25,20 Q-10,-50 0,-5 Q10,-60 25,20 Z"
                      fill="#f59e0b"
                      className="animate-pulse"
                    />
                    <path
                      d="M-10,20 Q0,-30 10,20 Z"
                      fill="#fef08a"
                    />
                  </g>
                )}
              </g>
            )}

            {/* 3. Consequence Phase Visuals */}
            {currentPhase === 'consequence' && selectedOption?.isCorrect && (
              <g id="fx-consequence-safe">
                <circle cx="900" cy="270" r="50" fill="#10b981" opacity="0.2" className="animate-pulse" />
                <text x="900" y="240" fill="#10b981" fontSize="13" fontWeight="bold" textAnchor="middle">
                  ✓ SAFE EVACUATION
                </text>
              </g>
            )}

            {/* 4. Interactive Tappable Hazard Markers (For PPE scenario) */}
            {scenario.hazardItems && (currentPhase === 'incident' || currentPhase === 'decision') && (
              <g id="interactive-hazards">
                {scenario.hazardItems.map((item) => {
                  const isFound = inspectedHazardIds.includes(item.id);
                  const cx = (item.x / 100) * 1000;
                  const cy = (item.y / 100) * 600;

                  return (
                    <g
                      key={item.id}
                      onClick={() => handleTapHazard(item)}
                      className="cursor-pointer group"
                    >
                      <circle
                        cx={cx}
                        cy={cy}
                        r="24"
                        fill={
                          isFound
                            ? item.isActualHazard
                              ? '#10b981'
                              : '#ef4444'
                            : '#06b6d4'
                        }
                        opacity={isFound ? '0.7' : '0.4'}
                        className="animate-pulse"
                      />
                      <circle
                        cx={cx}
                        cy={cy}
                        r="14"
                        fill={isFound ? (item.isActualHazard ? '#10b981' : '#ef4444') : '#0891b2'}
                        stroke="#fff"
                        strokeWidth="2"
                      />
                      <text
                        x={cx}
                        y={cy + 4}
                        fill="#ffffff"
                        fontSize="10"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {isFound ? (item.isActualHazard ? '✓' : '✗') : '?'}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}
          </svg>
        </div>

        {/* 2.2 TOP IN-CANVAS HUD OVERLAY */}
        <div className="relative z-20 p-4 flex items-start justify-between gap-4 pointer-events-none">
          {/* Phase Badge & Description */}
          <div className="bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-2xl p-3 max-w-lg shadow-lg pointer-events-auto">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-200 border border-slate-700">
                {scenario.phases[currentPhase]?.narrationEn ? `PHASE ${currentPhaseIndex}` : 'SIMULATION'}
              </span>
              <span className="text-xs font-mono text-cyan-400 font-bold">
                {scenario.regulatoryStandard}
              </span>
            </div>

            {/* Current Phase Description Text (Short for low-literacy) */}
            <p className="text-xs sm:text-sm text-slate-100 font-medium mt-1 leading-snug">
              {currentPhase === 'normal' && (isHindi ? scenario.phases.normal.descriptionHi : scenario.phases.normal.descriptionEn)}
              {currentPhase === 'warning' && (isHindi ? scenario.phases.warning.warningTextHi : scenario.phases.warning.warningTextEn)}
              {currentPhase === 'incident' && (isHindi ? scenario.phases.incident.incidentDescriptionHi : scenario.phases.incident.incidentDescriptionEn)}
              {currentPhase === 'decision' && (isHindi ? scenario.phases.decision.situationHi : scenario.phases.decision.situationEn)}
              {currentPhase === 'consequence' && (selectedOption?.isCorrect
                ? isHindi ? scenario.phases.consequence.safeResultHi : scenario.phases.consequence.safeResultEn
                : isHindi ? scenario.phases.consequence.unsafeResultHi : scenario.phases.consequence.unsafeResultEn)}
              {currentPhase === 'solution' && (isHindi ? scenario.phases.solution.summaryHi : scenario.phases.solution.summaryEn)}
              {currentPhase === 'practice' && (isHindi ? 'स्थिति को दोबारा दोहराएं और सही प्रतिक्रिया का अभ्यास करें।' : 'Repeat the situation to master your safety reflexes.')}
              {currentPhase === 'score' && (isHindi ? 'प्रशिक्षण सत्र पूरा हुआ! अपना स्कोरकार्ड देखें।' : 'Training session complete! Review your scorecard below.')}
            </p>
          </div>

          {/* Decision Timer Countdown in Decision Phase */}
          {currentPhase === 'decision' && mode !== 'practice' && (
            <div className="bg-slate-950/90 border border-red-500/80 rounded-2xl p-3 text-center pointer-events-auto shadow-xl animate-bounce">
              <div className="text-[10px] font-bold text-red-400 uppercase tracking-wide">
                {isHindi ? 'निर्णय समय' : 'Action Timer'}
              </div>
              <div className="text-2xl font-mono font-black text-red-400">
                {decisionTimer}s
              </div>
            </div>
          )}
        </div>

        {/* 2.3 BOTTOM IN-CANVAS CONTROLS & VOICE CUE */}
        <div className="relative z-20 p-4 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pt-8">
          <div className="text-xs text-slate-300 font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>
              {isHindi
                ? 'श्रव्य-दृश्य सिमुलेशन सक्रिय है। निर्देशों को सुनें।'
                : 'Audio-visual simulation active. Observe safety protocols.'}
            </span>
          </div>

          {/* Quick Action Navigation in bottom bar */}
          <div className="flex items-center gap-2">
            {currentPhase === 'incident' && (
              <button
                onClick={() => goToPhase('decision')}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-red-950 animate-pulse transition-all"
              >
                <span>{isHindi ? '🚨 निर्णय लें (Take Action)' : '🚨 Take Action (Decision)'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {currentPhase === 'consequence' && (
              <button
                onClick={() => goToPhase('solution')}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-950 transition-all"
              >
                <span>{isHindi ? '✅ सही मानक प्रक्रिया देखें' : '✅ View Correct Solution Steps'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {currentPhase === 'solution' && (
              <button
                onClick={() => goToPhase('score')}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950 transition-all"
              >
                <span>{isHindi ? '🏆 स्कोरकार्ड देखें' : '🏆 View Final Score'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. PHASE 4: INTERACTIVE DECISION CARD (EMBEDDED) */}
      {currentPhase === 'decision' && (
        <div className="bg-slate-900 border-2 border-red-500/70 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 animate-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-950 text-red-400 border border-red-500/50 animate-pulse">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-red-400 tracking-wider uppercase">
                  {isHindi ? 'आपातकालीन प्रतिक्रिया निर्णय' : 'EMERGENCY ACTION DECISION'}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                  🚨 {isHindi ? scenario.phases.decision.promptHi : scenario.phases.decision.promptEn}
                </h3>
              </div>
            </div>

            {/* Listen question aloud button */}
            <button
              onClick={() =>
                simAudio.speak(
                  isHindi
                    ? `${scenario.phases.decision.situationHi}. ${scenario.phases.decision.promptHi}`
                    : `${scenario.phases.decision.situationEn}. ${scenario.phases.decision.promptEn}`,
                  isHindi
                )
              }
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white"
              title="Listen Aloud"
            >
              <Volume2 className="w-5 h-5 text-amber-400" />
            </button>
          </div>

          {/* Decision Options (2 to 4 choices) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {scenario.phases.decision.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option)}
                className="text-left p-4 rounded-2xl bg-slate-950/80 hover:bg-slate-950 border-2 border-slate-800 hover:border-cyan-500 text-slate-200 transition-all flex items-start gap-3.5 group cursor-pointer active:scale-98 shadow-md"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-cyan-400 font-bold text-sm flex items-center justify-center shrink-0 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                  {option.keyLabel}
                </div>
                <div className="flex-1 text-xs sm:text-sm font-medium leading-snug">
                  {isHindi ? option.textHi : option.textEn}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. PHASE 5: CONSEQUENCE / FEEDBACK CARD */}
      {currentPhase === 'consequence' && selectedOption && (
        <div
          className={`rounded-3xl p-5 sm:p-6 border-2 shadow-2xl animate-in slide-in-from-bottom-2 duration-300 ${
            selectedOption.isCorrect
              ? 'bg-emerald-950/70 border-emerald-500 text-emerald-100'
              : 'bg-rose-950/70 border-rose-500 text-rose-100'
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl ${
                  selectedOption.isCorrect
                    ? 'bg-emerald-900 text-emerald-300'
                    : 'bg-rose-900 text-rose-300'
                }`}
              >
                {selectedOption.isCorrect ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <XCircle className="w-6 h-6" />
                )}
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider">
                  {selectedOption.isCorrect
                    ? isHindi ? 'सुरक्षित एवं प्रमाणित निर्णय (+50 XP)' : 'Correct & Compliant Decision (+50 XP)'
                    : isHindi ? 'असुरक्षित निर्णय! गंभीर जोखिम' : 'Unsafe Decision! Dangerous Risk'}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                  {selectedOption.isCorrect
                    ? isHindi ? 'उत्कृष्ट सुरक्षा मानक अनुपालन' : 'Excellent Safety Procedure Followed'
                    : isHindi ? 'कारखाना सुरक्षा नियमों का उल्लंघन' : 'Industrial Safety Violation'}
                </h3>
              </div>
            </div>

            {/* Read feedback aloud */}
            <button
              onClick={() =>
                simAudio.speak(
                  isHindi
                    ? `${selectedOption.isCorrect ? 'सही उत्तर!' : 'असुरक्षित!'} ${selectedOption.explanationHi}`
                    : `${selectedOption.isCorrect ? 'Correct action!' : 'Unsafe!'} ${selectedOption.explanationEn}`,
                  isHindi
                )
              }
              className="p-2 rounded-xl bg-slate-900/60 border border-slate-700 text-white"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          {/* Non-graphic Consequence Explanation */}
          <div className="mt-4 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-xs sm:text-sm leading-relaxed text-slate-200">
            <span className="font-bold text-amber-300 mr-1.5">
              {isHindi ? 'परिणाम विश्लेषण: ' : 'Consequence Analysis: '}
            </span>
            {isHindi ? selectedOption.explanationHi : selectedOption.explanationEn}
          </div>

          {selectedOption.standardRule && (
            <div className="mt-3 text-[11px] font-mono text-cyan-300 bg-cyan-950/80 px-3 py-1 rounded-lg inline-block border border-cyan-800">
              📜 {selectedOption.standardRule}
            </div>
          )}

          {/* Practice Again or Advance Buttons */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => askAiSafetyCoach()}
              className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 bg-cyan-950 border border-cyan-700 px-4 py-2 rounded-xl hover:bg-cyan-900 transition-colors"
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>{isHindi ? '🤖 AI सुरक्षा कोच से पूछें' : '🤖 Ask AI Safety Coach'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPhase('decision')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isHindi ? 'फिर से कोशिश करें (Retry)' : 'Try Again'}</span>
              </button>

              <button
                onClick={() => goToPhase('solution')}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-emerald-950"
              >
                <span>{isHindi ? 'सही कदम देखें' : 'Correct Procedure'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. PHASE 6: STEP-BY-STEP CORRECT SAFETY SOLUTION */}
      {currentPhase === 'solution' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
                Statutory Safety Solution
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-white mt-1">
                {isHindi ? scenario.phases.solution.titleHi : scenario.phases.solution.titleEn}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {isHindi ? scenario.phases.solution.summaryHi : scenario.phases.solution.summaryEn}
              </p>
            </div>

            {/* Listen aloud all solution steps */}
            <button
              onClick={() => {
                const textToRead = scenario.phases.solution.steps
                  .map((s) => `${s.stepNumber}. ${isHindi ? s.actionHi : s.actionEn}. ${isHindi ? s.detailHi : s.detailEn}`)
                  .join('. ');
                simAudio.speak(textToRead, isHindi);
              }}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 shrink-0"
            >
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span>{isHindi ? 'सभी कदम सुनें' : 'Listen Solution'}</span>
            </button>
          </div>

          {/* Sequential Step Cards (Large icons & very short text for low-literacy) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {scenario.phases.solution.steps.map((step) => (
              <div
                key={step.stepNumber}
                className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-start gap-3.5 hover:border-emerald-500/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-950 text-emerald-400 font-black text-sm flex items-center justify-center shrink-0 border border-emerald-800">
                  {step.stepNumber}
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    {isHindi ? step.actionHi : step.actionEn}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {isHindi ? step.detailHi : step.detailEn}
                  </p>
                  {step.standardRef && (
                    <span className="inline-block text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-900 mt-1">
                      {step.standardRef}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Prohibited Actions Checklist */}
          <div className="bg-rose-950/40 border border-rose-800/60 rounded-2xl p-4">
            <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-rose-400" />
              <span>{isHindi ? 'प्रतिबंधित कार्य (क्या न करें)' : 'Prohibited Unsafe Actions'}</span>
            </h4>
            <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-rose-100">
              {(isHindi
                ? scenario.phases.solution.prohibitedActionsHi
                : scenario.phases.solution.prohibitedActionsEn
              ).map((rule, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer Action to Proceed */}
          <div className="pt-2 flex justify-end gap-3">
            <button
              onClick={() => goToPhase('practice')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isHindi ? 'पुनः अभ्यास करें' : 'Practice Scenario Again'}</span>
            </button>

            <button
              onClick={() => goToPhase('score')}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-emerald-950"
            >
              <span>{isHindi ? 'स्कोरकार्ड देखें' : 'View Final Score'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 6. PHASE 7: PRACTICE MODE LAUNCHER */}
      {currentPhase === 'practice' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-cyan-950 border border-cyan-600 text-cyan-400 flex items-center justify-center mx-auto">
            <RotateCcw className="w-8 h-8 animate-spin" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              {isHindi ? 'अभ्यास मोड: स्थिति को दोहराएं' : 'Practice Mode: Repeat Workplace Situation'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mt-1 leading-relaxed">
              {isHindi
                ? 'मांसपेशियों की स्मृति और स्वचालित सजगता विकसित करने के लिए इस परिदृश्य को दोबारा दोहराएं। अभ्यास में कोई अंक नहीं कटते।'
                : 'Repeat this scenario to build muscle memory and instinctual safety reflexes. In practice mode, there is zero score penalty.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setSelectedOption(null);
                goToPhase('normal');
              }}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-950"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isHindi ? 'शुरुआत से दोहराएं (Replay from Start)' : 'Replay Scenario from Start'}</span>
            </button>

            <button
              onClick={() => goToPhase('decision')}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs sm:text-sm border border-slate-700"
            >
              <span>{isHindi ? 'सीधे निर्णय चरण पर जाएं' : 'Jump to Decision Phase'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 7. PHASE 8: SCORECARD & PERFORMANCE METRICS */}
      {currentPhase === 'score' && (
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-800">
                Evaluation Complete
              </span>
              <h3 className="text-2xl font-black text-white mt-1">
                {isHindi ? 'सुरक्षा सिमुलेशन प्रदर्शन रिपोर्ट' : 'Safety Simulation Performance Report'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {isHindi ? 'डीजीएमएस एवं कारखाना अधिनियम के तहत मूल्यांकन' : 'Evaluated under DGMS & Indian Factories Act Regulations'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-slate-400">{isHindi ? 'कुल सुरक्षा स्कोर' : 'Overall Safety Score'}</div>
                <div className="text-3xl font-black text-emerald-400 font-mono">
                  {scoreMetrics.overallScore}%
                </div>
              </div>
            </div>
          </div>

          {/* Key Metric Gauges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center">
              <div className="text-xs text-slate-400">{isHindi ? 'खतरा पहचान' : 'Hazard Recognition'}</div>
              <div className="text-2xl font-bold text-cyan-400 mt-1">
                {scoreMetrics.hazardRecognition}%
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center">
              <div className="text-xs text-slate-400">{isHindi ? 'निर्णय गुणवत्ता' : 'Decision Quality'}</div>
              <div className="text-2xl font-bold text-blue-400 mt-1">
                {scoreMetrics.decisionMaking}%
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center">
              <div className="text-xs text-slate-400">{isHindi ? 'प्रतिक्रिया समय' : 'Reaction Speed'}</div>
              <div className="text-2xl font-bold text-amber-400 mt-1 font-mono">
                {reactionTime || scoreMetrics.averageReactionTimeSeconds}s
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center">
              <div className="text-xs text-slate-400">{isHindi ? 'कुल XP अर्जित' : 'XP Awarded'}</div>
              <div className="text-2xl font-bold text-purple-400 mt-1 flex items-center justify-center gap-1">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span>+{scoreMetrics.xpEarned}</span>
              </div>
            </div>
          </div>

          {/* Action Links */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => askAiSafetyCoach()}
              className="px-4 py-2 bg-cyan-950 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 rounded-xl text-xs font-bold flex items-center gap-2"
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>{isHindi ? '🤖 AI से पूछें: यह कदम क्यों खतरनाक था?' : '🤖 Ask AI: Why was this action unsafe?'}</span>
            </button>

            <div className="flex items-center gap-2">
              {onWatchSafetySteps && (
                <button
                  onClick={() => onWatchSafetySteps(scenario.id === 'fire-emergency' ? 'scenario-3-fire' : 'scenario-1-ppe')}
                  className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-amber-950"
                >
                  <Film className="w-4 h-4" />
                  <span>{isHindi ? '🎬 एनिमेटेड सुरक्षा कदम देखें' : '🎬 Watch Safety Steps'}</span>
                </button>
              )}

              <button
                onClick={() => {
                  setSelectedOption(null);
                  goToPhase('normal');
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{isHindi ? 'पुनः अभ्यास' : 'Retake Simulation'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. AI SAFETY COACH EXPANDABLE DRAWER */}
      {showAiCoach && (
        <div className="bg-slate-900 border-2 border-cyan-500/50 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-700">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  {isHindi ? 'एआई सुरक्षा कोच (SURAKSHAAR AI)' : 'AI Safety Coach Explanation'}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {isHindi ? 'सरल भाषा में दुर्घटना के कारण और मानक नियमों को समझें।' : 'Conversational root-cause analysis based on statutory safety standards.'}
                </p>
              </div>
            </div>

            {aiAnswer && (
              <button
                onClick={() => simAudio.speak(aiAnswer, isHindi)}
                className="p-2 rounded-xl bg-slate-800 text-cyan-300 hover:text-white flex items-center gap-1 text-xs"
              >
                <Volume2 className="w-4 h-4" />
                <span>{isHindi ? 'सुनें' : 'Listen'}</span>
              </button>
            )}
          </div>

          {isAiLoading ? (
            <div className="flex items-center gap-2 text-xs text-slate-400 py-3">
              <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <span>{isHindi ? 'एआई सुरक्षा नियमों का विश्लेषण कर रहा है...' : 'Analyzing DGMS & Factories Act safety standards...'}</span>
            </div>
          ) : aiAnswer ? (
            <div className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950/80 p-4 rounded-2xl border border-slate-800 whitespace-pre-line">
              {aiAnswer}
            </div>
          ) : null}

          {/* Voice & Text Ask Bar */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && askAiSafetyCoach(aiQuestion)}
              placeholder={isHindi ? 'सवाल पूछें (जैसे: बिजली के पैनल पर पानी क्यों नहीं डालना चाहिए?)...' : 'Type question (e.g. Why is water prohibited on live electrical panels?)...'}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={toggleVoiceInput}
              className={`p-2.5 rounded-xl border ${
                isListening
                  ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse'
                  : 'bg-slate-950 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title={isHindi ? 'बोलकर पूछें' : 'Voice Input'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <button
              onClick={() => askAiSafetyCoach(aiQuestion)}
              disabled={!aiQuestion.trim() || isAiLoading}
              className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
