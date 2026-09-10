import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { ANIMATED_TUTORIALS } from '../../data/animatedTutorialData';
import { AnimatedSafetyScene } from './AnimatedSafetyScene';
import { speakVoiceGuidance } from '../../services/localizationService';
import { SupportedLanguage } from '../../types';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Globe,
  Award,
  Trophy,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clapperboard,
  Sparkles,
  Shield,
  Layers,
} from 'lucide-react';

export interface AnimatedSafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialScenarioId?: string;
  initialLanguage?: SupportedLanguage;
  onRewardXP?: (xp: number, reason: string) => void;
}

export const AnimatedSafetyModal: React.FC<AnimatedSafetyModalProps> = ({
  isOpen,
  onClose,
  initialScenarioId = 'scenario-1-ppe',
  initialLanguage = 'en',
  onRewardXP,
}) => {
  const [activeScenarioId, setActiveScenarioId] = useState<string>(initialScenarioId);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeLang, setActiveLang] = useState<SupportedLanguage>(
    initialLanguage === 'hi' ? 'hi' : 'en'
  );
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showQuiz, setShowQuiz] = useState<boolean>(false);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizSuccess, setQuizSuccess] = useState<boolean>(false);
  const [stepTimerProgress, setStepTimerProgress] = useState<number>(0);

  const stepTimerRef = useRef<number | null>(null);
  const STEP_DURATION_MS = 9000; // 9 seconds per step for low-literacy clarity

  // Get active tutorial
  const tutorial = ANIMATED_TUTORIALS[activeScenarioId] || ANIMATED_TUTORIALS['scenario-1-ppe'];
  const currentStep = tutorial.steps[currentStepIndex] || tutorial.steps[0];

  // Sync initial scenario ID when changed externally
  useEffect(() => {
    if (initialScenarioId && ANIMATED_TUTORIALS[initialScenarioId]) {
      setActiveScenarioId(initialScenarioId);
      setCurrentStepIndex(0);
      setShowQuiz(false);
      setSelectedQuizOption(null);
      setQuizSubmitted(false);
      setQuizSuccess(false);
    }
  }, [initialScenarioId]);

  // Handle Speech Narration on step change
  const playStepNarration = (stepIdx: number, lang: SupportedLanguage) => {
    if (isMuted) return;
    const s = tutorial.steps[stepIdx];
    if (!s) return;

    const narrationText = lang === 'hi' ? s.narrationHi : s.narrationEn;
    speakVoiceGuidance(narrationText, lang, 0.9, false);
  };

  // Play narration whenever step changes or language changes
  useEffect(() => {
    if (!isOpen) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    if (!showQuiz) {
      playStepNarration(currentStepIndex, activeLang);
    }
  }, [currentStepIndex, activeLang, activeScenarioId, isOpen, showQuiz]);

  // Step auto-progress timer when playing
  useEffect(() => {
    if (!isOpen || showQuiz || !isPlaying) {
      if (stepTimerRef.current) clearInterval(stepTimerRef.current);
      return;
    }

    setStepTimerProgress(0);
    const intervalMs = 100;
    const progressIncrement = (intervalMs / STEP_DURATION_MS) * 100;

    stepTimerRef.current = window.setInterval(() => {
      setStepTimerProgress((prev) => {
        if (prev >= 100) {
          // Advance to next step or show quiz
          handleNextStep();
          return 0;
        }
        return prev + progressIncrement;
      });
    }, intervalMs);

    return () => {
      if (stepTimerRef.current) clearInterval(stepTimerRef.current);
    };
  }, [isOpen, showQuiz, isPlaying, currentStepIndex, activeScenarioId]);

  if (!isOpen) return null;

  // Handlers
  const handleNextStep = () => {
    if (currentStepIndex < tutorial.steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setStepTimerProgress(0);
    } else {
      // Completed all steps: transition to Visual Quiz
      setShowQuiz(true);
      setIsPlaying(false);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  };

  const handlePrevStep = () => {
    if (showQuiz) {
      setShowQuiz(false);
      setCurrentStepIndex(tutorial.steps.length - 1);
      setStepTimerProgress(0);
      return;
    }
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setStepTimerProgress(0);
    }
  };

  const handleReplay = () => {
    setStepTimerProgress(0);
    playStepNarration(currentStepIndex, activeLang);
  };

  const handleTogglePlayPause = () => {
    setIsPlaying((prev) => !prev);
    if (!isPlaying) {
      playStepNarration(currentStepIndex, activeLang);
    }
  };

  const handleLanguageToggle = () => {
    const nextLang: SupportedLanguage = activeLang === 'hi' ? 'en' : 'hi';
    setActiveLang(nextLang);
  };

  const handleMuteToggle = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (nextMuted) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } else {
      playStepNarration(currentStepIndex, activeLang);
    }
  };

  const handleSelectQuizOption = (optionIndex: number) => {
    setSelectedQuizOption(optionIndex);
    setQuizSubmitted(true);
    const chosen = tutorial.quiz.options[optionIndex];
    if (chosen.isCorrect) {
      setQuizSuccess(true);
      // Confetti celebration
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {
        // Continue
      }
      // Speak congratulations
      const congrats =
        activeLang === 'hi'
          ? 'शाबाश! आपने सही सुरक्षा नियम चुना। ५० सुरक्षा अंक मिले।'
          : 'Great job! You selected the safe procedure. +50 Safety XP awarded!';
      speakVoiceGuidance(congrats, activeLang, 0.9, false);

      // Trigger XP reward
      if (onRewardXP) {
        onRewardXP(tutorial.quiz.xpReward, `Animated Tutorial: ${tutorial.scenarioNameEn}`);
      }
    } else {
      setQuizSuccess(false);
      const tryAgain =
        activeLang === 'hi'
          ? 'यह असुरक्षित है। कृपया दोबारा सही विकल्प चुनें।'
          : 'That is unsafe. Please review and try the safe choice!';
      speakVoiceGuidance(tryAgain, activeLang, 0.9, false);
    }
  };

  const handleRestartTutorial = () => {
    setCurrentStepIndex(0);
    setShowQuiz(false);
    setSelectedQuizOption(null);
    setQuizSubmitted(false);
    setQuizSuccess(false);
    setIsPlaying(true);
    setStepTimerProgress(0);
  };

  const handleSwitchScenario = (newId: string) => {
    setActiveScenarioId(newId);
    setCurrentStepIndex(0);
    setShowQuiz(false);
    setSelectedQuizOption(null);
    setQuizSubmitted(false);
    setQuizSuccess(false);
    setIsPlaying(true);
    setStepTimerProgress(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border-2 border-red-500/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] text-white">
        
        {/* Top Header Bar */}
        <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 shrink-0">
              <Clapperboard className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-red-950 text-red-300 font-bold border border-red-500/40">
                  Animated Safety Tutorial
                </span>
                <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                  {tutorial.badge}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-black text-white truncate tracking-tight">
                {activeLang === 'hi' ? tutorial.scenarioNameHi : tutorial.scenarioNameEn}
              </h2>
            </div>
          </div>

          {/* Controls: Scenario Switcher, Lang, Audio, Close */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Scenario Selector Dropdown */}
            <select
              value={activeScenarioId}
              onChange={(e) => handleSwitchScenario(e.target.value)}
              className="px-2 py-1 text-xs font-mono bg-slate-900 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-red-500 hidden md:block cursor-pointer"
            >
              <option value="scenario-1-ppe">1. PPE &amp; Hazard Scan</option>
              <option value="scenario-2-electrical">2. Electrical Safety</option>
              <option value="scenario-3-fire">3. Fire Emergency</option>
              <option value="scenario-4-mining">4. Mining Area Safety</option>
              <option value="scenario-5-machinery">5. Machinery Safety</option>
            </select>

            {/* Language Switch */}
            <button
              onClick={handleLanguageToggle}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer text-amber-300 transition-colors"
              title="Toggle Hindi / English voice narration"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{activeLang === 'hi' ? '🇮🇳 हिन्दी' : 'English'}</span>
            </button>

            {/* Voice Mute / Unmute */}
            <button
              onClick={handleMuteToggle}
              className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                isMuted
                  ? 'bg-slate-800 text-slate-500 border-slate-700'
                  : 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border-slate-700'
              }`}
              title={isMuted ? 'Unmute voice narration' : 'Mute voice narration'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Skip Tutorial Button */}
            <button
              onClick={onClose}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              title="Skip Tutorial"
            >
              <span>{activeLang === 'hi' ? 'छोड़ें (Skip)' : 'Skip Tutorial'}</span>
            </button>

            {/* Close / Dismiss Modal */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-red-600/30 text-slate-400 hover:text-white border border-slate-700 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Progress Tracker Bar */}
        {!showQuiz && (
          <div className="w-full bg-slate-950 px-4 py-2 border-b border-slate-800/80 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-red-400">
                {activeLang === 'hi' ? `चरण ${currentStepIndex + 1} / ${tutorial.steps.length}` : `Step ${currentStepIndex + 1} of ${tutorial.steps.length}`}
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:inline">&bull;</span>
              <span className="text-xs font-semibold text-slate-300 truncate max-w-[240px] sm:max-w-md">
                {activeLang === 'hi' ? currentStep.titleHi : currentStep.titleEn}
              </span>
            </div>

            {/* Stepper Dots */}
            <div className="flex items-center gap-1.5">
              {tutorial.steps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentStepIndex(idx);
                    setStepTimerProgress(0);
                  }}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    idx === currentStepIndex
                      ? 'w-6 bg-red-500 shadow-sm shadow-red-500/50'
                      : idx < currentStepIndex
                      ? 'w-2 bg-emerald-500'
                      : 'w-2 bg-slate-700'
                  }`}
                  title={`Go to Step ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Timer Line (indicates step countdown when playing) */}
        {!showQuiz && isPlaying && (
          <div className="w-full bg-slate-800 h-1 overflow-hidden">
            <div
              className="h-full bg-red-500 transition-all duration-100 ease-linear"
              style={{ width: `${stepTimerProgress}%` }}
            />
          </div>
        )}

        {/* Main Stage: Scene Animation OR Visual Quiz */}
        <div className="flex-1 p-3 sm:p-5 flex flex-col justify-between overflow-y-auto bg-slate-900/60">
          {!showQuiz ? (
            <div className="flex-1 flex flex-col justify-between space-y-4">
              {/* Animated Visual Canvas Stage */}
              <div className="w-full bg-slate-950 rounded-2xl border border-slate-800 p-2 sm:p-4 shadow-inner relative overflow-hidden flex items-center justify-center">
                <AnimatedSafetyScene
                  step={currentStep}
                  scenarioId={activeScenarioId}
                  isPlaying={isPlaying}
                  activeLanguage={activeLang}
                />
              </div>

              {/* Low-Literacy Narration & Caption Card */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-md flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-red-600/20 text-red-400 border border-red-500/40 shrink-0">
                  <Volume2 className="w-5 h-5 animate-pulse" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                      {activeLang === 'hi' ? currentStep.titleHi : currentStep.titleEn}
                    </h3>
                    {currentStep.ruleBadge && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {currentStep.ruleBadge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-amber-200/90 mt-1 font-medium leading-relaxed">
                    {activeLang === 'hi' ? currentStep.shortTextHi : currentStep.shortTextEn}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Interactive Post-Tutorial Visual Quiz */
            <div className="flex-1 flex flex-col justify-between space-y-4 py-2">
              <div className="text-center space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-400 text-xs font-bold font-mono">
                  <Trophy className="w-3.5 h-3.5 text-emerald-400" />
                  {activeLang === 'hi' ? 'ट्यूटोरियल पूरा हुआ! त्वरित प्रश्नोत्तरी' : 'Tutorial Complete! Quick Visual Check'}
                </div>
                <h3 className="text-base sm:text-xl font-black text-white">
                  {activeLang === 'hi' ? tutorial.quiz.questionHi : tutorial.quiz.questionEn}
                </h3>
                <p className="text-xs text-slate-400">
                  {activeLang === 'hi' ? tutorial.quiz.scenarioContextHi : tutorial.quiz.scenarioContextEn}
                </p>
              </div>

              {/* 2-3 Visual Choice Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-2">
                {tutorial.quiz.options.map((option, idx) => {
                  const isSelected = selectedQuizOption === idx;
                  let cardStyle = 'bg-slate-950 border-slate-800 hover:border-slate-600';
                  if (quizSubmitted && isSelected) {
                    cardStyle = option.isCorrect
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-100 shadow-xl shadow-emerald-950/50 scale-[1.02]'
                      : 'bg-red-950/80 border-red-500 text-red-100 shadow-xl shadow-red-950/50';
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSelectQuizOption(idx)}
                      className={`p-4 rounded-2xl border-2 text-left flex flex-col justify-between gap-3 transition-all cursor-pointer ${cardStyle}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        {quizSubmitted && isSelected && (
                          <span>
                            {option.isCorrect ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-red-400" />
                            )}
                          </span>
                        )}
                      </div>

                      <div className="text-sm font-bold leading-snug">
                        {activeLang === 'hi' ? option.textHi : option.textEn}
                      </div>

                      {quizSubmitted && isSelected && (
                        <div
                          className={`text-xs p-2 rounded-xl border mt-1 leading-relaxed ${
                            option.isCorrect
                              ? 'bg-emerald-900/60 border-emerald-500/40 text-emerald-200'
                              : 'bg-red-900/60 border-red-500/40 text-red-200'
                          }`}
                        >
                          {activeLang === 'hi' ? option.explanationHi : option.explanationEn}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Quiz Outcome Banner */}
              {quizSubmitted && (
                <div
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                    quizSuccess
                      ? 'bg-emerald-950/90 border-emerald-500/60 text-emerald-300'
                      : 'bg-amber-950/90 border-amber-500/60 text-amber-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {quizSuccess ? (
                      <>
                        <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
                        <div>
                          <div className="font-bold text-sm text-white">
                            {activeLang === 'hi' ? 'बधाई हो! सही उत्तर' : 'Excellent! Safe Choice Confirmed'}
                          </div>
                          <div className="text-xs text-emerald-400">
                            +{tutorial.quiz.xpReward} XP {activeLang === 'hi' ? 'सुरक्षा बोनस' : 'Safety XP Earned'}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <HelpCircle className="w-5 h-5 text-amber-400 shrink-0" />
                        <div>
                          <div className="font-bold text-sm text-white">
                            {activeLang === 'hi' ? 'कोई बात नहीं, दोबारा प्रयास करें' : 'Review and Retry'}
                          </div>
                          <div className="text-xs text-amber-300">
                            {activeLang === 'hi' ? 'ऊपर दिए गए विकल्पों में से सुरक्षित नियम चुनें।' : 'Select the safe procedure from the options above.'}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRestartTutorial}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{activeLang === 'hi' ? 'पुनः देखें' : 'Replay'}</span>
                    </button>

                    <button
                      onClick={onClose}
                      className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white transition-all shadow-md cursor-pointer"
                    >
                      {activeLang === 'hi' ? 'समाप्त करें' : 'Finish'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Playback Control Bar */}
        <div className="px-4 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-2">
          {/* Previous Step */}
          <button
            onClick={handlePrevStep}
            disabled={currentStepIndex === 0 && !showQuiz}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              currentStepIndex === 0 && !showQuiz
                ? 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
                : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{activeLang === 'hi' ? 'पिछला' : 'Previous'}</span>
          </button>

          {/* Central Playback Controls */}
          {!showQuiz && (
            <div className="flex items-center gap-2">
              {/* Replay */}
              <button
                onClick={handleReplay}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Replay Step & Narration"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">{activeLang === 'hi' ? 'दोहराएं' : 'Replay'}</span>
              </button>

              {/* Play / Pause */}
              <button
                onClick={handleTogglePlayPause}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-red-950/60 active:scale-95 transition-all cursor-pointer"
                title={isPlaying ? 'Pause auto-playback' : 'Resume auto-playback'}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>{activeLang === 'hi' ? 'रोकें' : 'Pause'}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>{activeLang === 'hi' ? 'चलाएं' : 'Play'}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Right Controls: Skip & Next Step / Quiz Button */}
          <div className="flex items-center gap-2">
            {!showQuiz && (
              <button
                onClick={onClose}
                className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold border border-slate-700 transition-colors cursor-pointer hidden sm:inline-block"
              >
                {activeLang === 'hi' ? 'छोड़ें (Skip)' : 'Skip Tutorial'}
              </button>
            )}

            {/* Next Step / Quiz Button */}
            <button
              onClick={handleNextStep}
              className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <span>
                {showQuiz
                  ? activeLang === 'hi'
                    ? 'समाप्त'
                    : 'Close'
                  : currentStepIndex === tutorial.steps.length - 1
                  ? activeLang === 'hi'
                    ? 'प्रश्नोत्तरी'
                    : 'Take Quiz'
                  : activeLang === 'hi'
                  ? 'अगला'
                  : 'Next'}
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
