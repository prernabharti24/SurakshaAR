import React, { useMemo } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  HardHat,
  Flame,
  Zap,
  Pickaxe,
  Wrench,
  ChevronRight,
  Play
} from 'lucide-react';
import { SupportedLanguage, AuthUser, CANONICAL_MODULES } from '../../types';
import { SCENARIO_DEFINITIONS } from '../../data/step5Data';
import { Lock } from 'lucide-react';

interface SafetyScenariosPageProps {
  currentLanguage: SupportedLanguage;
  currentUser?: AuthUser | null;
  onSelectScenario?: (scenarioId: string) => void;
  onSelectScenario1?: () => void;
  onBackToHome: () => void;
  onVoiceSpeak?: (text: string) => void;
  onWatchSafetySteps?: (scenarioId: string) => void;
}

export const SafetyScenariosPage: React.FC<SafetyScenariosPageProps> = ({
  currentLanguage,
  currentUser,
  onSelectScenario,
  onSelectScenario1,
  onBackToHome,
  onVoiceSpeak,
  onWatchSafetySteps
}) => {
  const isHindi = currentLanguage === 'hi';

  const isModuleAssigned = (scenarioId: string) => {
    if (!currentUser) return true;
    if (currentUser.role === 'admin') return true;
    const assigned = currentUser.assignedModules;
    const disabled = currentUser.disabledModules || [];
    if (assigned && !assigned.includes(scenarioId)) return false;
    if (disabled && disabled.includes(scenarioId)) return false;
    return true;
  };

  const handleLaunchScenario = (id: string) => {
    if (!isModuleAssigned(id)) {
      onVoiceSpeak?.(
        isHindi
          ? 'यह मॉड्यूल आपकी प्रोफाइल को असाइन नहीं किया गया है। कृपया सुरक्षा अधिकारी से संपर्क करें।'
          : 'Access restricted: This statutory safety module is not assigned to your trainee profile.'
      );
      if (onSelectScenario) {
        onSelectScenario(id); // Will trigger access denied gate in App.tsx
      }
      return;
    }

    if (id === 'scenario-1-ppe') {
      onVoiceSpeak?.(
        isHindi
          ? 'पीपीई और बुनियादी कार्यस्थल खतरे परिदृश्य शुरू कर रहे हैं।'
          : 'Starting PPE and Workplace Hazard Identification scenario.'
      );
      if (onSelectScenario1) {
        onSelectScenario1();
      } else if (onSelectScenario) {
        onSelectScenario('scenario-1-ppe');
      }
    } else {
      const scenarioObj = scenarios.find((s) => s.id === id);
      onVoiceSpeak?.(
        isHindi
          ? `${scenarioObj?.nameHi || 'सुरक्षा परिदृश्य'} शुरू कर रहे हैं।`
          : `Starting ${scenarioObj?.nameEn || 'Safety Scenario'}.`
      );
      if (onSelectScenario) {
        onSelectScenario(id);
      }
    }
  };

  const scenarios = useMemo(() => {
    const iconMap: Record<string, any> = {
      'scenario-1-ppe': HardHat,
      'scenario-2-fire': Flame,
      'scenario-3-electrical': Zap,
      'scenario-4-mining': Pickaxe,
      'scenario-5-machinery': Wrench
    };
    return SCENARIO_DEFINITIONS.filter((s) => s.id !== 'scenario-gas-leak').map((s, idx) => {
      const iconComponent = iconMap[s.id] || HardHat;
      const trueHazards = s.hazards.filter((h) => h.isHazard);
      return {
        id: s.id,
        number: s.number || idx + 1,
        nameEn: s.name,
        nameHi: s.nameHi || s.name,
        badgeEn: s.badge || 'AVAILABLE NOW',
        badgeHi: s.badgeHi || 'सक्रिय एवं उपलब्ध',
        isAvailable: true,
        icon: iconComponent,
        color: s.colorTheme || 'amber',
        industryEn: s.industry,
        industryHi: s.industryHi || s.industry,
        descEn: s.description,
        descHi: s.descriptionHi || s.description,
        standards: s.badge,
        hazardsEn: trueHazards.map((h) => h.title),
        hazardsHi: trueHazards.map((h) => h.titleHi || h.title)
      };
    });
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn pb-12">
      {/* 1. Top Navigation & Context Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-xl shadow-lg">
        <div className="flex items-center gap-3">
          <button
            id="btn-back-to-home"
            onClick={onBackToHome}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>{isHindi ? '← मुख्य पृष्ठ (Home)' : '← Back to Home'}</span>
          </button>
          <div className="h-6 w-px bg-slate-800 hidden sm:block" />
          <div>
            <span className="text-[11px] text-amber-400 font-mono font-bold uppercase tracking-wider block">
              {isHindi ? 'चरण 1: परिदृश्य चयन' : 'Step 1: Choose Scenario'}
            </span>
            <h1 className="text-lg sm:text-xl font-bold text-white">
              {isHindi ? 'सुरक्षा प्रशिक्षण परिदृश्य (5 मॉड्यूल)' : 'Safety Training Scenarios (All 5 Active)'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-mono font-bold text-emerald-400">
            {isHindi ? 'सभी 5 परिदृश्य सक्रिय एवं उपलब्ध' : 'All 5 Scenarios Active & Unlocked'}
          </span>
        </div>
      </div>

      {/* 2. Instructions Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs sm:text-sm text-slate-300 flex items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <HardHat className="w-5 h-5 text-amber-400 shrink-0" />
          <span>
            {isHindi
              ? 'सभी 5 सुरक्षा परिदृश्य पूरी तरह से इंटरैक्टिव 3D/AR सिमुलेशन, खतरे की पहचान, सुधारात्मक कार्रवाई और 5-प्रश्नों की सुरक्षा प्रश्नोत्तरी के साथ सक्रिय हैं।'
              : 'All 5 safety training modules feature interactive 3D/AR simulations, hazard identification with corrective actions, and statutory 5-question safety quizzes.'}
          </span>
        </div>
      </div>

      {/* 3. Scenarios Cards List */}
      <div className="space-y-4">
        {scenarios.map((sc) => {
          const IconComponent = sc.icon;

          return (
            <div
              key={sc.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 sm:p-6 shadow-md transition-all duration-150"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-600/50 text-[11px] font-bold font-mono tracking-wide flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      {isHindi ? sc.badgeHi : sc.badgeEn}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs font-mono">
                      {isHindi ? sc.industryHi : sc.industryEn}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-950 text-amber-400/90 text-xs font-mono border border-slate-800">
                      {sc.standards}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded bg-amber-500 text-slate-950 flex items-center justify-center text-sm font-black shrink-0">
                        {sc.number}
                      </span>
                      <span>{isHindi ? sc.nameHi : sc.nameEn}</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
                      {isHindi ? sc.descHi : sc.descEn}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
                    <span className="font-semibold text-amber-400 font-mono">
                      {isHindi ? 'पहचानने योग्य खतरे:' : '4 Statutory Hazards:'}
                    </span>
                    {(isHindi ? sc.hazardsHi : sc.hazardsEn).map((hz, hIdx) => (
                      <span
                        key={hIdx}
                        className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-slate-300 text-[11px]"
                      >
                        {hz}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="shrink-0 flex flex-col sm:items-end gap-2">
                  {isModuleAssigned(sc.id) ? (
                    <button
                      id={`btn-start-scenario-${sc.number}`}
                      onClick={() => handleLaunchScenario(sc.id)}
                      className="w-full sm:w-auto px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors border border-amber-300"
                    >
                      <IconComponent className="w-4 h-4 text-slate-950" />
                      <span>
                        {isHindi ? `परिदृश्य ${sc.number} शुरू करें` : `Start Scenario ${sc.number}`}
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      id={`btn-start-scenario-${sc.number}`}
                      onClick={() => handleLaunchScenario(sc.id)}
                      className="w-full sm:w-auto px-6 py-3 rounded-lg bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-300 font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors border border-slate-700 hover:border-red-500/40"
                      title="This module has not been assigned to your profile by the safety administrator"
                    >
                      <Lock className="w-4 h-4 text-red-400" />
                      <span>
                        {isHindi ? 'मॉड्यूल अनअसाइंड / लॉक' : 'Unassigned / Locked'}
                      </span>
                    </button>
                  )}

                  <div className="flex items-center gap-2">
                    {onWatchSafetySteps && (
                      <button
                        onClick={() => onWatchSafetySteps(sc.id)}
                        className="text-[11px] text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Play className="w-3 h-3 text-amber-400" />
                        <span>{isHindi ? '3D वीडियो देखें' : 'Watch 3D Guide'}</span>
                      </button>
                    )}
                    <span className="text-[11px] text-slate-500">•</span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {isHindi ? '3D सिमुलेशन + क्विज़' : '3D Sim + 5-Q Quiz'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
