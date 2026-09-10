import React, { useState } from 'react';
import { SupportedLanguage } from '../types';
import { SAMPLE_DEMO_TRAINEES } from '../data/step7Data';
import { SCENARIO_DEFINITIONS } from '../data/step5Data';
import { speakVoiceGuidance } from '../services/localizationService';
import {
  Sparkles,
  Play,
  RotateCcw,
  Languages,
  CheckCircle,
  X,
  Layers,
  Crosshair,
  AlertTriangle,
  Cpu,
  Trophy,
  Award,
  Compass,
  BarChart3,
  Shield,
  ExternalLink
} from 'lucide-react';

interface DemoModeWorkflowProps {
  currentLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  onLaunchScenarioInSimulator: (scenarioId: string) => void;
  onNavigateToDashboard: () => void;
  onClose: () => void;
  voiceVolume: number;
}

export type DemoStage =
  | 'welcome'
  | 'language'
  | 'scenario'
  | 'ar_placement'
  | 'hazards'
  | 'ai_analysis'
  | 'completion'
  | 'score_xp'
  | 'achievement'
  | 'recommendation'
  | 'dashboard';

export const DemoModeWorkflow: React.FC<DemoModeWorkflowProps> = ({
  currentLanguage,
  onSelectLanguage,
  onLaunchScenarioInSimulator,
  onNavigateToDashboard,
  onClose,
  voiceVolume
}) => {
  const [currentStage, setCurrentStage] = useState<DemoStage>('welcome');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('scenario-1-ppe');
  const [demoResetNotice, setDemoResetNotice] = useState(false);

  const stageOrder: DemoStage[] = [
    'welcome',
    'language',
    'scenario',
    'ar_placement',
    'hazards',
    'ai_analysis',
    'completion',
    'score_xp',
    'achievement',
    'recommendation',
    'dashboard'
  ];

  const currentStepIndex = stageOrder.indexOf(currentStage);

  const handleNext = () => {
    const nextIdx = currentStepIndex + 1;
    if (nextIdx < stageOrder.length) {
      const nextStage = stageOrder[nextIdx];
      setCurrentStage(nextStage);

      // Vocalize corresponding voice prompt if appropriate
      if (nextStage === 'ar_placement') {
        speakVoiceGuidance('SCAN_FLOOR_INSTRUCTION', currentLanguage, voiceVolume, true);
      } else if (nextStage === 'hazards') {
        speakVoiceGuidance('VOICE_IDENTIFY_ELECTRICAL', currentLanguage, voiceVolume, true);
      } else if (nextStage === 'completion') {
        speakVoiceGuidance('SCENARIO_COMPLETED', currentLanguage, voiceVolume, true);
      }
    } else {
      onNavigateToDashboard();
      onClose();
    }
  };

  const handlePrev = () => {
    const prevIdx = currentStepIndex - 1;
    if (prevIdx >= 0) {
      setCurrentStage(stageOrder[prevIdx]);
    }
  };

  const handleResetDemo = () => {
    setCurrentStage('welcome');
    setSelectedScenarioId('scenario-1-ppe');
    setDemoResetNotice(true);
    setTimeout(() => setDemoResetNotice(false), 3500);
  };

  const selectedScenario =
    SCENARIO_DEFINITIONS.find((s) => s.id === selectedScenarioId) || SCENARIO_DEFINITIONS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/90 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  SIH 26041 Demo Mode
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Fast-Track Jury Walkthrough
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Step {currentStepIndex + 1} of {stageOrder.length} &bull; Live end-to-end evaluation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetDemo}
              title="Reset Demo State (Leaves real Firebase data untouched)"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 text-xs font-mono transition-colors cursor-pointer border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Progress Ribbon */}
        <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono">
          {stageOrder.map((st, i) => {
            const isCompleted = i < currentStepIndex;
            const isCurrent = i === currentStepIndex;
            return (
              <React.Fragment key={st}>
                <button
                  onClick={() => setCurrentStage(st)}
                  className={`px-2 py-1 rounded-md transition-all whitespace-nowrap cursor-pointer ${
                    isCurrent
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : isCompleted
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {i + 1}. {st.replace('_', ' ')}
                </button>
                {i < stageOrder.length - 1 && <span className="text-slate-700">&rarr;</span>}
              </React.Fragment>
            );
          })}
        </div>

        {/* Reset Banner Confirmation */}
        {demoResetNotice && (
          <div className="bg-emerald-500/20 border-b border-emerald-500/40 px-4 py-2 text-xs text-emerald-300 flex items-center justify-between animate-in fade-in">
            <span>✓ Demo mode state restored to default! Real Firebase trainee records untouched.</span>
          </div>
        )}

        {/* Stage Dynamic Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* 1. WELCOME */}
          {currentStage === 'welcome' && (
            <div className="space-y-4 text-center max-w-xl mx-auto py-4">
              <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-500/40 text-amber-400 mx-auto flex items-center justify-center">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">
                Welcome to SIH 26041 AR Safety Demo
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                This guided showcase takes the jury through the complete lifecycle of our AR Vocational Safety Training Simulator—from spatial ground detection to real-time AI hazard vision analysis, XP leveling, and DGMS compliance recommendations.
              </p>
              <div className="grid grid-cols-3 gap-2.5 pt-2 text-left">
                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-mono">Engine</div>
                  <div className="text-xs font-bold text-white mt-0.5">Unity AR Foundation</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-mono">Vision AI</div>
                  <div className="text-xs font-bold text-amber-400 mt-0.5">Gemini Multimodal</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-mono">Target</div>
                  <div className="text-xs font-bold text-emerald-400 mt-0.5">Android ARCore</div>
                </div>
              </div>
            </div>
          )}

          {/* 2. SELECT LANGUAGE */}
          {currentStage === 'language' && (
            <div className="space-y-4 max-w-md mx-auto py-2">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-bold text-white flex items-center justify-center gap-2">
                  <Languages className="w-5 h-5 text-amber-400" />
                  Select Training Language
                </h3>
                <p className="text-xs text-slate-400">
                  Demonstrates instant bilingual UI and Text-to-Speech switching.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    onSelectLanguage('en');
                    speakVoiceGuidance('TRAINING_START', 'en', voiceVolume, true);
                  }}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                    currentLanguage === 'en'
                      ? 'bg-amber-500/20 border-amber-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🇬🇧</span>
                    <div>
                      <div className="font-bold text-sm">English</div>
                      <div className="text-xs text-slate-400 font-mono">Indian English TTS Voice</div>
                    </div>
                  </div>
                  {currentLanguage === 'en' && <CheckCircle className="w-5 h-5 text-amber-400" />}
                </button>

                <button
                  onClick={() => {
                    onSelectLanguage('hi');
                    speakVoiceGuidance('TRAINING_START', 'hi', voiceVolume, true);
                  }}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                    currentLanguage === 'hi'
                      ? 'bg-amber-500/20 border-amber-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🇮🇳</span>
                    <div>
                      <div className="font-bold text-sm">हिंदी (Hindi)</div>
                      <div className="text-xs text-slate-400 font-mono">हिंदी भाषा टीटीएस मार्गदर्शन</div>
                    </div>
                  </div>
                  {currentLanguage === 'hi' && <CheckCircle className="w-5 h-5 text-amber-400" />}
                </button>
              </div>
            </div>
          )}

          {/* 3. SELECT SCENARIO */}
          {currentStage === 'scenario' && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-bold text-white">Select Industrial Module</h3>
                <p className="text-xs text-slate-400">
                  Choose which trade scenario to present during this demo walkthrough.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SCENARIO_DEFINITIONS.map((sc) => {
                  const isSelected = sc.id === selectedScenarioId;
                  return (
                    <button
                      key={sc.id}
                      onClick={() => setSelectedScenarioId(sc.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500 text-white shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase text-amber-400">
                            {sc.industry}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                            {sc.hazards.length} Hazards
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white">{sc.name}</h4>
                        <p className="text-xs text-slate-400 line-clamp-2">{sc.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. PLACE AR ENVIRONMENT */}
          {currentStage === 'ar_placement' && (
            <div className="space-y-4 text-center max-w-lg mx-auto py-2">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 mx-auto flex items-center justify-center">
                <Crosshair className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white">AR Plane Detection &amp; Placement</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Unity AR Foundation raycasts against real-world horizontal surfaces detected by Google ARCore. Once the yellow reticle aligns with an estimated plane, tapping anchors the life-size industrial equipment layout.
              </p>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Surface Tracking:</span>
                  <span className="text-emerald-400 font-mono font-bold">ARPlane.HorizontalUpward</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Selected Module:</span>
                  <span className="text-amber-400 font-bold">{selectedScenario.name}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Spoken Guidance:</span>
                  <span className="text-slate-300 italic">"Scan the floor to place the training area."</span>
                </div>
              </div>
            </div>
          )}

          {/* 5. IDENTIFY HAZARDS */}
          {currentStage === 'hazards' && (
            <div className="space-y-4 max-w-xl mx-auto py-2">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-bold text-white flex items-center justify-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  Spatial Hazard Identification Drill
                </h3>
                <p className="text-xs text-slate-400">
                  Trainee interacts with physical 3D objects to triage hazards and verify PPE.
                </p>
              </div>

              <div className="space-y-2.5">
                {selectedScenario.hazards.map((hz) => (
                  <div
                    key={hz.id}
                    className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3"
                  >
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{hz.title}</span>
                        <span className="text-[10px] font-mono text-emerald-400">+{hz.scoreImpact} Pts</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">{hz.description}</p>
                      <div className="text-[10px] text-cyan-400 pt-0.5">
                        Action: {hz.correctAction}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. AI SAFETY ANALYSIS */}
          {currentStage === 'ai_analysis' && (
            <div className="space-y-4 max-w-xl mx-auto py-2 text-center">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-400 mx-auto flex items-center justify-center">
                <Cpu className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white">Multimodal Vision AI Analysis</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Captures spatial AR frame and sends it to the server-side Gemini 2.5 API with strict JSON formatting. Generates overall risk level, hazard highlights, and actionable DGMS recommendations.
              </p>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-2 font-mono text-xs">
                <div className="text-purple-400 font-bold flex items-center gap-1.5">
                  <span>Gemini Multimodal Response:</span>
                </div>
                <div className="text-slate-300">
                  <span className="text-slate-500">"overallRisk":</span> "Low",
                </div>
                <div className="text-slate-300">
                  <span className="text-slate-500">"summary":</span> "Worker PPE verified per IS 2925; cable tripping hazards successfully rerouted.",
                </div>
                <div className="text-slate-300">
                  <span className="text-slate-500">"trainingRecommendation":</span> "Proceed to High-Voltage Electrical Substation module."
                </div>
              </div>
            </div>
          )}

          {/* 7. COMPLETION */}
          {currentStage === 'completion' && (
            <div className="space-y-4 text-center max-w-md mx-auto py-3">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Scenario Completed!</h3>
              <p className="text-xs text-slate-300">
                All 4 industrial hazards successfully mitigated in 48 seconds with zero critical safety infractions.
              </p>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Score Achieved:</span>
                  <span className="text-emerald-400 font-mono font-bold">100 / 100 (100%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-white font-bold">Passed (Benchmark ≥75%)</span>
                </div>
              </div>
            </div>
          )}

          {/* 8. SCORE + XP */}
          {currentStage === 'score_xp' && (
            <div className="space-y-4 text-center max-w-md mx-auto py-2">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 mx-auto flex items-center justify-center">
                <Trophy className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white">XP Grant &amp; Level Up</h3>
              <p className="text-xs text-slate-300">
                The trainee receives quantifiable experience points synced with their persistent profile.
              </p>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-2 text-xs">
                <div className="flex justify-between border-b border-slate-900 pb-1.5">
                  <span className="text-slate-400">Hazard Interventions (4 × 25 XP):</span>
                  <span className="text-white font-mono">+100 XP</span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-1.5">
                  <span className="text-slate-400">Scenario Completion Bonus:</span>
                  <span className="text-white font-mono">+100 XP</span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-1.5">
                  <span className="text-slate-400">High-Score Bonus (≥90%):</span>
                  <span className="text-white font-mono">+50 XP</span>
                </div>
                <div className="flex justify-between text-amber-400 font-bold pt-1">
                  <span>Total Session XP:</span>
                  <span className="font-mono text-sm">+250 XP</span>
                </div>
              </div>
            </div>
          )}

          {/* 9. ACHIEVEMENT UNLOCK */}
          {currentStage === 'achievement' && (
            <div className="space-y-4 text-center max-w-md mx-auto py-2">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 mx-auto flex items-center justify-center">
                <Award className="w-7 h-7 animate-bounce" />
              </div>
              <h3 className="text-lg font-bold text-white">Vocational Badge Unlocked</h3>
              <p className="text-xs text-slate-300">
                Achievements align with Indian Industrial Skill standards (DGMS &amp; CEA).
              </p>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 via-slate-950 to-slate-950 border border-amber-500/40 flex items-center gap-4 text-left">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-lg shadow-amber-950/40">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-mono uppercase text-amber-400 font-bold">
                    Achievement Unlocked
                  </div>
                  <h4 className="text-base font-black text-white">First Training Completed</h4>
                  <p className="text-xs text-slate-400">
                    Successfully completed your first AR vocational safety inspection (+30 XP).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 10. SMART RECOMMENDATION & DASHBOARD */}
          {(currentStage === 'recommendation' || currentStage === 'dashboard') && (
            <div className="space-y-4 max-w-lg mx-auto py-2 text-center">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 mx-auto flex items-center justify-center">
                <Compass className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white">Deterministic Smart Recommendation</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Our client-side recommendation engine automatically evaluates score gaps to guide the trainee's learning trajectory.
              </p>

              <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/40 text-left space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Recommended Next
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">
                  High-Voltage Electrical Substation &amp; Panel Safety
                </h4>
                <p className="text-xs text-slate-400">
                  Targeted remediation: Master Central Electricity Authority Regulation 30 isolation and dielectric gloves.
                </p>
              </div>

              {/* Sample Presentation Trainees */}
              <div className="pt-2 text-left space-y-2">
                <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
                  <span>Demo Trainee Leaderboard Snapshot:</span>
                  <span className="text-[10px] text-amber-400">Privacy Safe (Display Names Only)</span>
                </div>
                <div className="space-y-1.5">
                  {SAMPLE_DEMO_TRAINEES.map((dt, idx) => (
                    <div
                      key={dt.id}
                      className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-slate-500 font-bold">#{idx + 1}</span>
                        <div className={`w-6 h-6 rounded-full ${dt.avatarColor} text-white font-bold flex items-center justify-center text-[10px]`}>
                          {dt.name.charAt(0)}
                        </div>
                        <span className="text-white font-medium">{dt.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-amber-400 font-mono font-bold">{dt.xp} XP</span>
                        <span className="text-slate-400 font-mono">{dt.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              currentStepIndex === 0
                ? 'text-slate-600 bg-slate-900 border border-slate-800 cursor-not-allowed'
                : 'text-white bg-slate-800 hover:bg-slate-700'
            }`}
          >
            &larr; Back
          </button>

          <div className="flex items-center gap-2">
            {/* Direct Jump to Real 3D AR Simulator */}
            <button
              onClick={() => {
                onLaunchScenarioInSimulator(selectedScenarioId);
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold transition-colors cursor-pointer border border-slate-700"
            >
              <Play className="w-3.5 h-3.5 fill-amber-400" />
              <span>Launch Live AR Canvas</span>
            </button>

            {/* Next Step / Complete */}
            <button
              onClick={handleNext}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all shadow-md shadow-amber-950/30 cursor-pointer"
            >
              {currentStepIndex === stageOrder.length - 1
                ? 'Open Dashboard & Finish'
                : 'Next Step &rarr;'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
