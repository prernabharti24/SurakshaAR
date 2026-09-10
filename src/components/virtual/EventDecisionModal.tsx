import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  VirtualSafetyEvent,
  IncidentDecisionStage,
  DecisionOption,
  SimulationTrainingMode
} from '../../types';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Volume2,
  VolumeX,
  Bot,
  ArrowRight,
  Shield,
  RotateCcw,
  Sparkles,
  Send,
  Mic,
  MicOff,
  Flame,
  Zap,
  HardHat,
  Cog,
  Wind,
  Pickaxe
} from 'lucide-react';

interface EventDecisionModalProps {
  event: VirtualSafetyEvent;
  currentStageIndex: number;
  mode: SimulationTrainingMode;
  isHindi: boolean;
  onDecisionSubmitted: (option: DecisionOption, reactionTimeSeconds: number) => void;
  onNextStage: () => void;
  onClose: () => void;
}

export const EventDecisionModal: React.FC<EventDecisionModalProps> = ({
  event,
  currentStageIndex,
  mode,
  isHindi,
  onDecisionSubmitted,
  onNextStage,
  onClose
}) => {
  const stage: IncidentDecisionStage = event.stages[currentStageIndex] || event.stages[0];

  const [selectedOption, setSelectedOption] = useState<DecisionOption | null>(null);
  const [hasEvaluated, setHasEvaluated] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(stage.timerSeconds || 15);
  const [timerActive, setTimerActive] = useState<boolean>(mode !== 'practice');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // AI Safety Coach Drawer inside Decision Modal
  const [showAiCoach, setShowAiCoach] = useState<boolean>(false);
  const [aiQuery, setAiQuery] = useState<string>('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);

  const startTimeRef = useRef<number>(Date.now());
  const recognitionRef = useRef<any>(null);

  // Timer Countdown logic for Assessment & Surprise modes
  useEffect(() => {
    startTimeRef.current = Date.now();
    setTimeLeft(stage.timerSeconds || 15);
    setTimerActive(mode !== 'practice');
    setSelectedOption(null);
    setHasEvaluated(false);
    setShowAiCoach(false);
    setAiAnswer(null);
  }, [currentStageIndex, stage, mode]);

  useEffect(() => {
    if (!timerActive || hasEvaluated || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Timer expired: auto-select first incorrect option or force timeout
          const incorrectOption = stage.options.find((o) => !o.isCorrect) || stage.options[0];
          handleSelectOption(incorrectOption, true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, hasEvaluated, timeLeft, stage]);

  // Text-To-Speech audio read-out
  const speakText = useCallback(
    (text: string) => {
      if (!('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();

      if (isSpeaking) {
        setIsSpeaking(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = isHindi ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    },
    [isHindi, isSpeaking]
  );

  // Stop speech when modal closes
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSelectOption = (option: DecisionOption, isTimeout = false) => {
    if (hasEvaluated && mode !== 'practice') return;

    setSelectedOption(option);
    setHasEvaluated(true);
    setTimerActive(false);

    const reactionTime = (Date.now() - startTimeRef.current) / 1000;
    onDecisionSubmitted(option, reactionTime);

    // Read explanation aloud for low-literacy trainees
    const explanationToRead = isHindi
      ? `${option.isCorrect ? 'सही उत्तर!' : 'सावधानी!'} ${option.explanationHi}`
      : `${option.isCorrect ? 'Correct action!' : 'Unsafe action!'} ${option.explanationEn}`;
    speakText(explanationToRead);
  };

  // AI Safety Coach Query Handler
  const askAiCoach = async (customPrompt?: string) => {
    const questionText =
      customPrompt ||
      aiQuery ||
      (isHindi
        ? `${event.titleHi} में यह निर्णय क्यों ${selectedOption?.isCorrect ? 'सुरक्षित' : 'खतरनाक'} है?`
        : `Why is this response ${selectedOption?.isCorrect ? 'safe' : 'dangerous'} in ${event.titleEn}?`);

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
            event.remediationTag === 'fire'
              ? 'scenario-3-fire'
              : event.remediationTag === 'electrical'
              ? 'scenario-2-electrical'
              : event.remediationTag === 'mining'
              ? 'scenario-4-mining'
              : event.remediationTag === 'machinery'
              ? 'scenario-5-machinery'
              : 'scenario-1-ppe',
          isVoice: false
        })
      });

      if (!res.ok) throw new Error('AI Assistant Service Unavailable');
      const data = await res.json();
      setAiAnswer(data.answer);
      setAiQuery('');
    } catch (err) {
      // Offline fallback answer
      const fallback = selectedOption?.isCorrect
        ? isHindi
          ? `यह निर्णय भारतीय मानक (${selectedOption.standardRule || 'IS/DGMS'}) के अनुरूप है। खतरे को पहचान कर तुरंत सायरन बजाना और अधिकृत लोटो प्रक्रिया का पालन करना ही जीवन बचाता है।`
          : `This action aligns with ${selectedOption?.standardRule || 'statutory safety standards'}. Always isolate energy sources and notify emergency teams immediately.`
        : isHindi
        ? `यह निर्णय बेहद असुरक्षित है। अनियंत्रित उपकरणों को छूने या भागने से गंभीर चोट लग सकती है। हमेशा प्रमाणित पीपीई और आपातकालीन प्रक्रियाओं का पालन करें।`
        : `This decision violates safety protocol and exposes personnel to fatal consequences. Follow standard containment and mandatory evacuation orders.`;
      setAiAnswer(fallback);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Voice speech-to-text for asking AI Coach
  const toggleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(isHindi ? 'ब्राउज़र में वॉइस इनपुट समर्थित नहीं है।' : 'Voice recognition not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = isHindi ? 'hi-IN' : 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setAiQuery(transcript);
      setIsListening(false);
      askAiCoach(transcript);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const getHazardIcon = () => {
    switch (event.hazardType) {
      case 'fire':
        return <Flame className="w-6 h-6 text-red-500 animate-pulse" />;
      case 'electrical':
        return <Zap className="w-6 h-6 text-amber-400 animate-bounce" />;
      case 'machinery':
        return <Cog className="w-6 h-6 text-orange-400 animate-spin" />;
      case 'roof':
        return <Pickaxe className="w-6 h-6 text-yellow-500" />;
      case 'gas':
        return <Wind className="w-6 h-6 text-purple-400" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-rose-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* 1. MODAL HEADER WITH HAZARD BANNER */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 p-4 sm:p-5 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-950/80 border border-red-500/40 text-red-400">
              {getHazardIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-red-500/20 text-red-400 border border-red-500/40">
                  {event.severity.toUpperCase()} HAZARD
                </span>
                {event.stages.length > 1 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                    {isHindi ? `चरण ${currentStageIndex + 1}/${event.stages.length}` : `Stage ${currentStageIndex + 1} of ${event.stages.length}`}
                  </span>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                {isHindi ? event.titleHi : event.titleEn}
              </h3>
            </div>
          </div>

          {/* Audio read-out toggle */}
          <button
            onClick={() =>
              speakText(
                isHindi
                  ? `${stage.situationHi}. ${stage.promptHi}`
                  : `${stage.situationEn}. ${stage.promptEn}`
              )
            }
            className={`p-2 rounded-lg border transition-all ${
              isSpeaking
                ? 'bg-amber-500/20 border-amber-500 text-amber-300 animate-pulse'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title={isHindi ? 'आवाज़ में सुनें' : 'Listen with Voice'}
          >
            {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>

        {/* 2. TIMER BAR (ASSESSMENT & SURPRISE MODES) */}
        {mode !== 'practice' && !hasEvaluated && (
          <div className="w-full bg-slate-800 h-1.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                timeLeft <= 4 ? 'bg-red-500' : timeLeft <= 8 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${(timeLeft / (stage.timerSeconds || 15)) * 100}%` }}
            />
          </div>
        )}

        {/* 3. SCROLLABLE CONTENT BODY */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* Situation Prompt Box */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 sm:p-4">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1 font-medium">
              <span>{isHindi ? stage.stageNameHi : stage.stageNameEn}</span>
              {mode !== 'practice' && !hasEvaluated && (
                <span className={`font-mono font-bold ${timeLeft <= 5 ? 'text-red-400 animate-ping' : 'text-amber-400'}`}>
                  ⏱ {timeLeft}s
                </span>
              )}
            </div>
            <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
              {isHindi ? stage.situationHi : stage.situationEn}
            </p>
            <p className="text-xs sm:text-sm text-cyan-400 font-semibold mt-2">
              👉 {isHindi ? stage.promptHi : stage.promptEn}
            </p>
          </div>

          {/* Decision Options List */}
          <div className="space-y-2.5">
            {stage.options.map((option) => {
              const isChosen = selectedOption?.id === option.id;
              let btnStyle = 'bg-slate-800/80 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600 text-slate-200';

              if (hasEvaluated) {
                if (option.isCorrect) {
                  btnStyle = 'bg-emerald-950/70 border-emerald-500/80 text-emerald-100 ring-1 ring-emerald-500';
                } else if (isChosen && !option.isCorrect) {
                  btnStyle = 'bg-rose-950/70 border-rose-500/80 text-rose-100 ring-1 ring-rose-500';
                } else {
                  btnStyle = 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option)}
                  disabled={hasEvaluated && mode !== 'practice'}
                  className={`w-full text-left p-3 sm:p-3.5 rounded-xl border transition-all duration-200 flex items-start gap-3 ${btnStyle}`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                      hasEvaluated && option.isCorrect
                        ? 'bg-emerald-500 text-slate-950'
                        : hasEvaluated && isChosen && !option.isCorrect
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    {hasEvaluated && option.isCorrect ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : hasEvaluated && isChosen && !option.isCorrect ? (
                      <XCircle className="w-4 h-4" />
                    ) : (
                      option.keyLabel
                    )}
                  </div>
                  <div className="flex-1 text-xs sm:text-sm font-medium leading-snug">
                    {isHindi ? option.textHi : option.textEn}
                  </div>
                </button>
              );
            })}
          </div>

          {/* EVALUATION FEEDBACK CARD */}
          {hasEvaluated && selectedOption && (
            <div
              className={`rounded-xl p-4 border animate-in slide-in-from-bottom-2 duration-300 ${
                selectedOption.isCorrect
                  ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200'
                  : 'bg-rose-950/50 border-rose-500/50 text-rose-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm">
                {selectedOption.isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-emerald-300">
                      {isHindi ? 'उत्कृष्ट सुरक्षा निर्णय (+50 XP)' : 'Correct Safe Decision (+50 XP)'}
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-400" />
                    <span className="text-rose-300">
                      {isHindi ? 'असुरक्षित निर्णय! गंभीर जोखिम' : 'Unsafe Action! High Risk'}
                    </span>
                  </>
                )}
              </div>

              {/* Consequence explanation without graphic gore */}
              {selectedOption.consequenceEn && !selectedOption.isCorrect && (
                <div className="mt-2 text-xs bg-rose-950/80 p-2.5 rounded-lg border border-rose-800 text-rose-100">
                  <span className="font-bold text-rose-300">
                    {isHindi ? 'संभावित परिणाम: ' : 'Realistic Consequence: '}
                  </span>
                  {isHindi ? selectedOption.consequenceHi : selectedOption.consequenceEn}
                </div>
              )}

              <p className="text-xs sm:text-sm mt-2 leading-relaxed text-slate-200">
                {isHindi ? selectedOption.explanationHi : selectedOption.explanationEn}
              </p>

              {selectedOption.standardRule && (
                <div className="mt-2.5 text-[11px] font-mono text-cyan-300 bg-cyan-950/60 px-2.5 py-1 rounded inline-block border border-cyan-800">
                  📜 {selectedOption.standardRule}
                </div>
              )}

              {/* Action Buttons for AI Coach or Retry */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                <button
                  onClick={() => askAiCoach()}
                  className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/60 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Bot className="w-4 h-4 text-cyan-400" />
                  <span>{isHindi ? '🤖 AI कोच से और पूछें' : '🤖 Ask AI Safety Coach'}</span>
                </button>

                {mode === 'practice' && !selectedOption.isCorrect && (
                  <button
                    onClick={() => {
                      setHasEvaluated(false);
                      setSelectedOption(null);
                    }}
                    className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 bg-amber-950/50 border border-amber-800 px-3 py-1.5 rounded-lg"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{isHindi ? 'फिर से कोशिश करें' : 'Try Again'}</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* AI SAFETY COACH EXPANDABLE SECTION */}
          {showAiCoach && (
            <div className="bg-slate-950/90 border border-cyan-500/40 rounded-xl p-3.5 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs font-bold text-cyan-300">
                <div className="flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-cyan-400" />
                  <span>{isHindi ? 'एआई सुरक्षा कोच (SURAKSHAAR AI)' : 'AI Safety Coach Explanation'}</span>
                </div>
                {aiAnswer && (
                  <button
                    onClick={() => speakText(aiAnswer)}
                    className="text-cyan-400 hover:text-cyan-200 text-xs flex items-center gap-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isHindi ? 'सुनें' : 'Listen'}</span>
                  </button>
                )}
              </div>

              {isAiLoading ? (
                <div className="flex items-center gap-2 text-xs text-slate-400 py-3">
                  <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  <span>{isHindi ? 'एआई कोच सुरक्षा नियमों का विश्लेषण कर रहा है...' : 'AI Coach analyzing industrial safety regulations...'}</span>
                </div>
              ) : aiAnswer ? (
                <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                  {aiAnswer}
                </div>
              ) : null}

              {/* Free-form Question Input with Voice */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && askAiCoach(aiQuery)}
                  placeholder={isHindi ? 'सवाल लिखें (जैसे: लोटो क्यों ज़रूरी है?)...' : 'Type a question (e.g. Why is LOTO mandatory?)...'}
                  className="flex-1 bg-slate-900 border border-slate-700 text-xs rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={toggleVoiceInput}
                  className={`p-2 rounded-lg border ${
                    isListening
                      ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                  title={isHindi ? 'बोलकर पूछें' : 'Speak Question'}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => askAiCoach(aiQuery)}
                  disabled={!aiQuery.trim() || isAiLoading}
                  className="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 4. MODAL FOOTER */}
        <div className="bg-slate-950 border-t border-slate-800 p-3 sm:p-4 flex items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400">
            {isHindi
              ? 'प्रशिक्षण अनुकरण। हमेशा अपने कार्यस्थल के अधिकृत नियमों का पालन करें।'
              : 'Safety training simulation. Always follow site standard procedures.'}
          </div>

          <div className="flex items-center gap-2">
            {hasEvaluated && currentStageIndex < event.stages.length - 1 ? (
              <button
                onClick={onNextStage}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-cyan-950 transition-colors"
              >
                <span>{isHindi ? 'अगला चरण' : 'Next Stage'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : hasEvaluated ? (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-emerald-950 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isHindi ? 'प्रशिक्षण जारी रखें' : 'Continue Simulation'}</span>
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
