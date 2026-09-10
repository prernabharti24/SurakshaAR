import React, { useState, useEffect } from 'react';
import { STEP_1_CHECKLIST, STEP_2_CHECKLIST, STEP_3_CHECKLIST, STEP_5_CHECKLIST, STEP_6_CHECKLIST, STEP_7_CHECKLIST, STEP_8_CHECKLIST } from '../data/unityData';
import { ChecklistItem } from '../types';
import { CheckCircle2, Circle, Trophy, RefreshCw, Sparkles, ShieldCheck, Cpu, Layers, Languages, Award, CheckSquare } from 'lucide-react';
import confetti from 'canvas-confetti';

const STORAGE_KEY_STEP1 = 'sih26041_step1_checklist';
const STORAGE_KEY_STEP2 = 'sih26041_step2_checklist';
const STORAGE_KEY_STEP3 = 'sih26041_step3_checklist';
const STORAGE_KEY_STEP5 = 'sih26041_step5_checklist';
const STORAGE_KEY_STEP6 = 'sih26041_step6_checklist';
const STORAGE_KEY_STEP7 = 'sih26041_step7_checklist';
const STORAGE_KEY_STEP8 = 'sih26041_step8_checklist';

export const ChecklistTracker: React.FC = () => {
  const [activeTab, setActiveTab] = useState<1 | 2 | 3 | 5 | 6 | 7 | 8>(8); // Default to Step 8!

  const [step1Items, setStep1Items] = useState<ChecklistItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STEP1);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return STEP_1_CHECKLIST;
  });

  const [step2Items, setStep2Items] = useState<ChecklistItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STEP2);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return STEP_2_CHECKLIST;
  });

  const [step3Items, setStep3Items] = useState<ChecklistItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STEP3);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return STEP_3_CHECKLIST;
  });

  const [step5Items, setStep5Items] = useState<ChecklistItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STEP5);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return STEP_5_CHECKLIST;
  });

  const [step6Items, setStep6Items] = useState<ChecklistItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STEP6);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return STEP_6_CHECKLIST;
  });

  const [step7Items, setStep7Items] = useState<ChecklistItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STEP7);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return STEP_7_CHECKLIST;
  });

  const [step8Items, setStep8Items] = useState<ChecklistItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STEP8);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return STEP_8_CHECKLIST;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STEP1, JSON.stringify(step1Items));
    } catch {}
  }, [step1Items]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STEP2, JSON.stringify(step2Items));
    } catch {}
  }, [step2Items]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STEP3, JSON.stringify(step3Items));
    } catch {}
  }, [step3Items]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STEP5, JSON.stringify(step5Items));
    } catch {}
  }, [step5Items]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STEP6, JSON.stringify(step6Items));
    } catch {}
  }, [step6Items]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STEP7, JSON.stringify(step7Items));
    } catch {}
  }, [step7Items]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STEP8, JSON.stringify(step8Items));
    } catch {}
  }, [step8Items]);

  const activeItems =
    activeTab === 8
      ? step8Items
      : activeTab === 7
      ? step7Items
      : activeTab === 6
      ? step6Items
      : activeTab === 5
      ? step5Items
      : activeTab === 3
      ? step3Items
      : activeTab === 2
      ? step2Items
      : step1Items;

  const setActiveItems =
    activeTab === 8
      ? setStep8Items
      : activeTab === 7
      ? setStep7Items
      : activeTab === 6
      ? setStep6Items
      : activeTab === 5
      ? setStep5Items
      : activeTab === 3
      ? setStep3Items
      : activeTab === 2
      ? setStep2Items
      : setStep1Items;

  const toggleItem = (id: string) => {
    setActiveItems((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item));
      const completedCount = updated.filter((i) => i.completed).length;
      if (completedCount === updated.length) {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#10b981', '#06b6d4'],
        });
      }
      return updated;
    });
  };

  const handleReset = () => {
    const base =
      activeTab === 8
        ? STEP_8_CHECKLIST
        : activeTab === 7
        ? STEP_7_CHECKLIST
        : activeTab === 6
        ? STEP_6_CHECKLIST
        : activeTab === 5
        ? STEP_5_CHECKLIST
        : activeTab === 3
        ? STEP_3_CHECKLIST
        : activeTab === 2
        ? STEP_2_CHECKLIST
        : STEP_1_CHECKLIST;
    setActiveItems(base.map((i) => ({ ...i, completed: false })));
  };

  const completedCount = activeItems.filter((i) => i.completed).length;
  const progressPercent = Math.round((completedCount / activeItems.length) * 100);

  // Group by category
  const categories = Array.from(new Set(activeItems.map((i) => i.category)));

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 md:p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <button
              onClick={() => setActiveTab(8)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 8 ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              ⭐ Step 8: Integration &amp; Demo (Active)
            </button>
            <button
              onClick={() => setActiveTab(7)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 7 ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Step 7: Bilingual &amp; Voice
            </button>
            <button
              onClick={() => setActiveTab(6)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 6 ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Step 6: Gamification
            </button>
            <button
              onClick={() => setActiveTab(5)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 5 ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Step 5: Scenarios
            </button>
            <button
              onClick={() => setActiveTab(3)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 3 ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Step 3: Gemini AI
            </button>
            <button
              onClick={() => setActiveTab(2)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 2 ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Step 2: PPE
            </button>
            <button
              onClick={() => setActiveTab(1)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 1 ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Step 1: AR
            </button>
          </div>

          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            {activeTab === 8
              ? 'STEP 8 COMPLETION CHECKLIST: INTEGRATION, AUDIT, TEST, OPTIMIZE & SIH DEMO'
              : activeTab === 7
              ? 'STEP 7 COMPLETION CHECKLIST: MULTILINGUAL (EN/HI), VOICE GUIDANCE, ACCESSIBILITY & SIH DEMO'
              : activeTab === 6
              ? 'STEP 6 COMPLETION CHECKLIST: GAMIFICATION, XP, BADGES & LEADERBOARD'
              : activeTab === 5
              ? 'STEP 5 COMPLETION CHECKLIST: VOCATIONAL SAFETY SCENARIOS (JHARKHAND MINING & MANUFACTURING)'
              : activeTab === 3
              ? 'STEP 3 COMPLETION CHECKLIST: AI-ASSISTED SAFETY ANALYSIS (GEMINI API)'
              : activeTab === 2
              ? 'STEP 2 COMPLETION CHECKLIST: PPE & HAZARD IDENTIFICATION'
              : 'STEP 1 COMPLETION CHECKLIST: AR FOUNDATION'}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {activeTab === 8
              ? 'Verify Step 8 integration: Complete 15-step flow (Splash to Dashboard), DontDestroyOnLoad AppStateManager, ARCore hardware check + 3D Orbit fallback, Gemini 8s timeout with deterministic rule fallback, Offline local sync queue, Redacted PII AppLogger, 24 QA automated tests, and 3-5 min live presentation playbook.'
              : activeTab === 7
              ? 'Verify Step 7 features: Key-based bilingual localization (EN/HI), Android native TextToSpeech bridge + Web Speech API fallback, dynamic text scaling (A-/A+), high-contrast accessibility mode, color-independent status icons, 10-step SIH jury presentation mode, and reset isolation.'
              : activeTab === 6
              ? 'Verify Step 6 features: XP scoring mechanics, safety levels 1-5, achievement system, privacy-safe leaderboard (display names only), trainee profile, and scenario recommendations.'
              : activeTab === 5
              ? 'Verify Step 5 multi-scenario features: Reusable ScenarioDefinition architecture, 5 specialized vocational scenarios (PPE, Electrical, Fire, Mining, Machinery), Firebase session persistence, and Trainer Analytics Dashboard.'
              : activeTab === 3
              ? 'Verify all Step 3 AI capabilities: Screen capture downsampling, GeminiSafetyAnalysisService, structured JSON response, risk level indicators, 3D AR object highlighting, and network error handling.'
              : activeTab === 2
              ? 'Verify all Step 2 interactive mechanics: ScriptableObjects, raycast tapping, PPE auto-equip, scoring, feedback cards, and completion dialog.'
              : 'Verify all Step 1 AR foundation prerequisites: Session origin, plane tracking, reticle, tap-to-place, and UI.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-400 block font-mono">Completed</span>
            <span className="text-lg font-bold font-mono text-emerald-400">
              {completedCount} / {activeItems.length} ({progressPercent}%)
            </span>
          </div>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Reset Checklist"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
        <div
          className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {progressPercent === 100 && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 flex items-center gap-3 text-emerald-300 animate-in fade-in duration-300">
          <Trophy className="w-6 h-6 text-emerald-400 shrink-0" />
          <div className="text-xs">
            <strong className="text-sm block font-bold text-white">
              {activeTab === 2 ? 'Step 2 Complete & Production-Verified! 🎉' : 'Step 1 Foundation Complete! 🎉'}
            </strong>
            {activeTab === 2
              ? 'Your AR safety simulator is ready for Step 3 (Machinery Pinch Points, Fire & Electrical Safety Scenarios)!'
              : 'All AR Foundation systems are verified. Ready to proceed with Step 2!'}
          </div>
        </div>
      )}

      {/* Grouped Checklist */}
      <div className="space-y-6">
        {categories.map((category) => {
          const categoryItems = activeItems.filter((i) => i.category === category);
          return (
            <div key={category} className="space-y-2.5">
              <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold px-1">{category}</h3>

              <div className="grid grid-cols-1 gap-2">
                {categoryItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                      item.completed
                        ? 'bg-emerald-950/20 border-emerald-500/40 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/40 hover:border-slate-700'
                    }`}
                  >
                    <div className="pt-0.5">
                      {item.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-500 shrink-0" />
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <h4
                        className={`text-sm font-semibold transition-colors ${
                          item.completed ? 'text-emerald-200 line-through' : 'text-slate-200'
                        }`}
                      >
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
