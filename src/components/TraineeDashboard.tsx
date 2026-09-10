import React, { useState, useMemo, useEffect } from 'react';
import { SurakshaLogo } from './SurakshaLogo';
import {
  TraineeProfile,
  Achievement,
  LeaderboardEntry,
  ScenarioDefinition,
  TraineeSessionRecord,
  CompletionSummaryData
} from '../types';
import {
  INITIAL_TRAINEE_PROFILE,
  SAFETY_LEVELS,
  ACHIEVEMENTS_LIST,
  INITIAL_LEADERBOARD,
  computeSmartRecommendation,
  calculateLevelFromXP,
  XP_CONFIG
} from '../data/step6Data';
import { SCENARIO_DEFINITIONS, MOCK_TRAINEE_SESSIONS } from '../data/step5Data';
import {
  StatCard,
  ProgressBar,
  AchievementCard,
  ScenarioCard,
  LeaderboardRow,
  ScenarioCompletionModal
} from './gamification/GamificationComponents';
import {
  Award,
  Sparkles,
  Trophy,
  Flame,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Layers,
  Users,
  History,
  User,
  Shield,
  Zap,
  Play,
  Filter,
  CheckSquare,
  Lock,
  Database,
  ShieldCheck,
  Pickaxe,
  HardHat,
  AlertTriangle,
  LogOut,
  Factory
} from 'lucide-react';
import { AuthUser } from '../types';

interface TraineeDashboardProps {
  onStartScenario?: (scenarioId: string) => void;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
  onWatchSafetySteps?: (scenarioId: string) => void;
  onOpenVirtualEnvironment?: () => void;
}

const PROFILE_STORAGE_KEY = 'sih26041_trainee_profile';
const ACHIEVEMENTS_STORAGE_KEY = 'sih26041_achievements';
const LEADERBOARD_STORAGE_KEY = 'sih26041_leaderboard';

export const TraineeDashboard: React.FC<TraineeDashboardProps> = ({
  onStartScenario,
  currentUser,
  onLogout,
  onWatchSafetySteps,
  onOpenVirtualEnvironment
}) => {
  // 1. Profile State
  const [profile, setProfile] = useState<TraineeProfile>(() => {
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_TRAINEE_PROFILE,
          ...parsed,
          completedScenarioIds: Array.isArray(parsed?.completedScenarioIds)
            ? parsed.completedScenarioIds
            : INITIAL_TRAINEE_PROFILE.completedScenarioIds,
          bestScores: parsed?.bestScores || INITIAL_TRAINEE_PROFILE.bestScores
        };
      }
    } catch {
      // fallback
    }
    return INITIAL_TRAINEE_PROFILE;
  });

  // Keep profile in sync if currentUser updates
  useEffect(() => {
    if (currentUser) {
      setProfile((prev) => ({
        ...prev,
        name: currentUser.displayName || currentUser.email.split('@')[0]
      }));
    }
  }, [currentUser]);

  // 2. Achievements State
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    try {
      const saved = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return ACHIEVEMENTS_LIST;
  });

  // 3. Leaderboard State
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    try {
      const saved = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_LEADERBOARD;
  });

  // 4. Sub-Navigation Tabs
  const [activeSubTab, setActiveSubTab] = useState<
    'overview' | 'scenarios' | 'achievements' | 'leaderboard' | 'history' | 'profile'
  >('overview');

  // 5. Completion Modal State (for testing or real post-scenario triggers)
  const [completionModalData, setCompletionModalData] = useState<CompletionSummaryData | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
      localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(achievements));
      localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(leaderboard));
    } catch {
      // ignore
    }
  }, [profile, achievements, leaderboard]);

  // Current Level info
  const currentLevelInfo = useMemo(() => {
    return calculateLevelFromXP(profile.xp);
  }, [profile.xp]);

  // Next Level threshold
  const nextLevelThreshold = useMemo(() => {
    const nextLvl = SAFETY_LEVELS.find((l) => l.level === currentLevelInfo.level + 1);
    return nextLvl ? nextLvl.minXP : currentLevelInfo.maxXP;
  }, [currentLevelInfo]);

  // Overall training progress (5 scenarios)
  const totalScenariosCount = SCENARIO_DEFINITIONS.length;
  const completedScenariosCount = (profile?.completedScenarioIds || []).length;
  const overallPercentage = Math.round((completedScenariosCount / totalScenariosCount) * 100);

  // Average Score across completed scenarios
  const averageScore = useMemo(() => {
    const scores: number[] = Object.values(profile?.bestScores || {});
    if (scores.length === 0) return 0;
    const sum = scores.reduce((a, b) => a + b, 0);
    return Math.round(sum / scores.length);
  }, [profile?.bestScores]);

  // Smart Recommendation
  const smartRecommendation = useMemo(() => {
    return computeSmartRecommendation(profile?.bestScores || {}, profile?.completedScenarioIds || []);
  }, [profile?.bestScores, profile?.completedScenarioIds]);

  // Filtered achievements
  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;

  // Simulate completion test
  const handleSimulateScenarioCompletion = (scenario: ScenarioDefinition) => {
    const score = Math.floor(Math.random() * 15) + (scenario.hazards.length * 10 - 15);
    const maxScore = scenario.hazards.length * 10;
    const pct = Math.round((score / maxScore) * 100);
    const passed = pct >= scenario.passingPercentage;
    const xpGained = passed ? XP_CONFIG.SCENARIO_COMPLETION_BONUS + (pct >= 90 ? XP_CONFIG.HIGH_SCORE_BONUS : 0) : 30;

    // Check new achievement
    const newUnlocked: Achievement[] = [];
    setAchievements((prev) =>
      prev.map((ach) => {
        if (!ach.isUnlocked) {
          if (ach.id === 'safety-expert' && pct >= 90) {
            const updated = { ...ach, isUnlocked: true, unlockedAt: new Date().toISOString() };
            newUnlocked.push(updated);
            return updated;
          }
          if (ach.id === 'mining-guardian' && scenario.id === 'scenario-4-mining' && passed) {
            const updated = { ...ach, isUnlocked: true, unlockedAt: new Date().toISOString() };
            newUnlocked.push(updated);
            return updated;
          }
          if (ach.id === 'emergency-ready' && scenario.id === 'scenario-3-fire' && passed) {
            const updated = { ...ach, isUnlocked: true, unlockedAt: new Date().toISOString() };
            newUnlocked.push(updated);
            return updated;
          }
        }
        return ach;
      })
    );

    // Update Profile
    const updatedXP = profile.xp + xpGained + newUnlocked.reduce((sum, a) => sum + a.xpReward, 0);
    const updatedBestScores = {
      ...profile.bestScores,
      [scenario.id]: Math.max(profile.bestScores[scenario.id] || 0, pct)
    };
    const currentCompleted = profile?.completedScenarioIds || [];
    const updatedCompletedIds = currentCompleted.includes(scenario.id)
      ? currentCompleted
      : [...currentCompleted, scenario.id];

    const updatedLvl = calculateLevelFromXP(updatedXP);

    setProfile((prev) => ({
      ...prev,
      xp: updatedXP,
      level: updatedLvl.level,
      levelTitle: updatedLvl.title,
      bestScores: updatedBestScores,
      completedScenarioIds: updatedCompletedIds
    }));

    // Update Leaderboard
    setLeaderboard((prev) =>
      prev
        .map((entry) => {
          if (entry.traineeId === profile.id) {
            return {
              ...entry,
              xp: updatedXP,
              level: updatedLvl.level,
              levelTitle: updatedLvl.title,
              scenariosCompleted: updatedCompletedIds.length
            };
          }
          return entry;
        })
        .sort((a, b) => b.xp - a.xp)
        .map((entry, idx) => ({ ...entry, rank: idx + 1 }))
    );

    // Show completion modal
    setCompletionModalData({
      scenarioId: scenario.id,
      scenarioName: scenario.name,
      score,
      maxScore,
      percentage: pct,
      accuracy: pct,
      xpEarned: xpGained,
      xpBreakdown: [
        { item: 'Scenario Completed', amount: XP_CONFIG.SCENARIO_COMPLETION_BONUS },
        { item: 'High Score Bonus', amount: pct >= 90 ? XP_CONFIG.HIGH_SCORE_BONUS : 0 }
      ],
      timeSpentSeconds: Math.floor(40 + Math.random() * 30),
      hazardsIdentified: scenario.hazards.length,
      totalHazards: scenario.hazards.length,
      mistakesCount: passed ? 0 : 2,
      newAchievements: newUnlocked,
      recommendation: computeSmartRecommendation(updatedBestScores, updatedCompletedIds),
      passed
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & SURAKSHAAR Welcome Section */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.5)] flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        {/* Subtle red ambient glow in top right */}
        <div className="absolute top-0 right-0 w-80 h-40 bg-red-600/10 blur-3xl pointer-events-none" />

        <div className="space-y-3 relative z-10">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold border border-red-500/40 bg-red-950/40 text-red-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
              Level {currentLevelInfo.level} &bull; {currentLevelInfo.title}
            </span>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-red-400" />
              {profile.currentStreak} Day Inspection Streak
            </span>
            <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
              DGMS / IS:8032 Certified Trainee
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Welcome, {profile.name}</span>
            </h2>
            <p className="text-xs md:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Industrial Safety Officer &bull; {profile.affiliation}. Multimodal safety compliance and real-time hazard detection in mining and heavy manufacturing.
            </p>
          </div>

          {/* Quick Start Safety Inspection Action */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                if (onStartScenario) {
                  onStartScenario(smartRecommendation.scenarioId);
                } else {
                  const sc = SCENARIO_DEFINITIONS.find((s) => s.id === smartRecommendation.scenarioId);
                  if (sc) handleSimulateScenarioCompletion(sc);
                }
              }}
              className="py-3 px-6 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-xs md:text-sm tracking-wider uppercase transition-all shadow-xl shadow-red-950/60 hover:shadow-red-600/30 flex items-center gap-2.5 cursor-pointer active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Safety Inspection</span>
            </button>

            <button
              onClick={() => setActiveSubTab('scenarios')}
              className="py-3 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs md:text-sm tracking-wide transition-all border border-slate-700 flex items-center gap-2 cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>Browse 5 Scenarios</span>
            </button>

            {onOpenVirtualEnvironment && (
              <button
                id="btn-trainee-open-virtual-env"
                onClick={onOpenVirtualEnvironment}
                className="py-3 px-5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs md:text-sm tracking-wide transition-all border border-cyan-500/40 flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-950/50 active:scale-95"
              >
                <Factory className="w-4 h-4 text-cyan-200" />
                <span>Virtual Environment</span>
                <span className="px-1.5 py-0.2 rounded-full bg-cyan-950 text-cyan-200 text-[10px] font-mono">NEW</span>
              </button>
            )}
          </div>
        </div>

        {/* Trainee XP & Rank Card */}
        <div className="w-full lg:w-80 bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2.5 relative z-10 shrink-0">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white font-bold flex items-center gap-1.5 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-red-400" />
              SURAKSHAAR XP
            </span>
            <span className="font-mono text-red-400 font-bold">
              {profile.xp.toLocaleString()} / {nextLevelThreshold.toLocaleString()} XP
            </span>
          </div>

          <ProgressBar
            current={profile.xp - currentLevelInfo.minXP}
            max={nextLevelThreshold - currentLevelInfo.minXP}
            color="red"
            showPercentage={false}
          />

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
            <span className="text-slate-300 font-medium">{currentLevelInfo.title}</span>
            <span>Next: Level {currentLevelInfo.level + 1}</span>
          </div>

          <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-center text-[10px] font-mono">
            <div className="bg-slate-900/90 rounded-lg p-1.5 border border-slate-800">
              <span className="text-slate-400 block">Avg Score</span>
              <span className="text-white font-bold text-xs">{averageScore}%</span>
            </div>
            <div className="bg-slate-900/90 rounded-lg p-1.5 border border-slate-800">
              <span className="text-slate-400 block">Badges</span>
              <span className="text-white font-bold text-xs">{unlockedCount}/{achievements.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          label="Training Progress"
          value={`${overallPercentage}%`}
          subtext={`${completedScenariosCount} of ${totalScenariosCount} Modules Passed`}
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          highlightColor="emerald"
        />

        <StatCard
          label="Safety Score"
          value={`${averageScore}%`}
          subtext="Benchmark: ≥75% (DGMS)"
          icon={<ShieldCheck className="w-4 h-4 text-red-400" />}
          highlightColor="red"
        />

        <StatCard
          label="Inspection Streak"
          value={`${profile.currentStreak} Days`}
          subtext={`Personal Best: ${profile.bestStreak} Days`}
          icon={<Flame className="w-4 h-4 text-red-400" />}
          highlightColor="red"
        />

        <StatCard
          label="Badges Unlocked"
          value={`${unlockedCount} / ${achievements.length}`}
          subtext="Industrial Competency"
          icon={<Trophy className="w-4 h-4 text-slate-300" />}
          highlightColor="red"
        />
      </div>

      {/* 3. Smart Recommendation Banner */}
      <div className="bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 border border-red-500/40 rounded-2xl p-4 md:p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-red-600 text-white font-mono text-[10px] font-bold tracking-wider">
              AI SAFETY RECOMMENDATION
            </span>
            <span className="text-xs text-slate-400 font-mono">{smartRecommendation.industry}</span>
          </div>

          <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-red-400" />
            Recommended: {smartRecommendation.shortTitle}
          </h3>

          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            {smartRecommendation.reason}
          </p>
        </div>

        <button
          onClick={() => {
            if (onStartScenario) onStartScenario(smartRecommendation.scenarioId);
            else {
              const sc = SCENARIO_DEFINITIONS.find((s) => s.id === smartRecommendation.scenarioId);
              if (sc) handleSimulateScenarioCompletion(sc);
            }
          }}
          className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-lg shadow-red-950/50 flex items-center justify-center gap-2 shrink-0 cursor-pointer active:scale-95"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Launch Recommended Training</span>
        </button>
      </div>

      {/* 4. Action / Sub-Tab Navigation Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'overview'
                ? 'bg-red-600 text-white shadow-md shadow-red-950/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Main Menu
          </button>

          <button
            onClick={() => setActiveSubTab('scenarios')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'scenarios'
                ? 'bg-red-600 text-white shadow-md shadow-red-950/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Scenario Select ({SCENARIO_DEFINITIONS.length})
          </button>

          <button
            onClick={() => setActiveSubTab('achievements')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'achievements'
                ? 'bg-red-600 text-white shadow-md shadow-red-950/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            Badges ({unlockedCount}/{achievements.length})
          </button>

          <button
            onClick={() => setActiveSubTab('leaderboard')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'leaderboard'
                ? 'bg-red-600 text-white shadow-md shadow-red-950/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Leaderboard
          </button>

          <button
            onClick={() => setActiveSubTab('history')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'history'
                ? 'bg-red-600 text-white shadow-md shadow-red-950/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Training History
          </button>

          <button
            onClick={() => setActiveSubTab('profile')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'profile'
                ? 'bg-red-600 text-white shadow-md shadow-red-950/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Settings / Compliance Standards
          </button>
        </div>

        <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Firebase Firestore Synced
        </span>
      </div>

      {/* 5. SUB-TAB 1: OVERVIEW / MAIN MENU */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* 5 Core Industrial Safety Training Modules */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base md:text-lg font-black text-white tracking-tight flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-red-500" />
                  Industrial Safety Modules &bull; DGMS &amp; IS:8032
                </h3>
                <p className="text-xs text-slate-400">
                  Select a specialized safety inspection module to launch AR spatial hazard analysis.
                </p>
              </div>
              <button
                onClick={() => setActiveSubTab('scenarios')}
                className="text-xs text-red-400 hover:text-red-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>View All Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SCENARIO_DEFINITIONS.map((scenario) => (
                <ScenarioCard
                  key={scenario.id}
                  scenario={scenario}
                  bestScore={profile?.bestScores?.[scenario.id]}
                  isCompleted={(profile?.completedScenarioIds || []).includes(scenario.id)}
                  isRecommended={smartRecommendation.scenarioId === scenario.id}
                  onLaunch={() => {
                    if (onStartScenario) onStartScenario(scenario.id);
                    else handleSimulateScenarioCompletion(scenario);
                  }}
                  onWatchSafetySteps={() => {
                    if (onWatchSafetySteps) onWatchSafetySteps(scenario.id);
                  }}
                />
              ))}
            </div>
          </div>

          {/* Quick Hub Navigation Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => setActiveSubTab('scenarios')}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-red-500/50 text-left transition-all group cursor-pointer"
            >
              <Layers className="w-5 h-5 text-red-400 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white">Scenario Select</div>
              <div className="text-[10px] text-slate-400 mt-0.5">5 AR Simulations</div>
            </button>

            <button
              onClick={() => setActiveSubTab('history')}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-red-500/50 text-left transition-all group cursor-pointer"
            >
              <History className="w-5 h-5 text-red-400 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white">Training History</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Audit Trails &amp; Logs</div>
            </button>

            <button
              onClick={() => setActiveSubTab('leaderboard')}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-red-500/50 text-left transition-all group cursor-pointer"
            >
              <Users className="w-5 h-5 text-red-400 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white">Leaderboard</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Statewide Safety Ranks</div>
            </button>

            <button
              onClick={() => setActiveSubTab('profile')}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-red-500/50 text-left transition-all group cursor-pointer"
            >
              <ShieldCheck className="w-5 h-5 text-red-400 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white">Compliance &amp; Settings</div>
              <div className="text-[10px] text-slate-400 mt-0.5">DGMS &amp; IS Standards</div>
            </button>
          </div>

          {/* Quick Achievements Grid (Top 3) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-slate-300" />
                Recent Badges &amp; Unlocks
              </h3>
              <button
                onClick={() => setActiveSubTab('achievements')}
                className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>View All Badges</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {achievements.slice(0, 3).map((ach) => (
                <AchievementCard key={ach.id} achievement={ach} />
              ))}
            </div>
          </div>

          {/* Leaderboard Snippet (Top 3) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-red-400" />
                Statewide Vocational Leaderboard (Top 3)
              </h3>
              <button
                onClick={() => setActiveSubTab('leaderboard')}
                className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Full Leaderboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2">
              {leaderboard.slice(0, 3).map((entry) => (
                <LeaderboardRow
                  key={entry.traineeId}
                  entry={entry}
                  isCurrentUser={entry.traineeId === profile.id}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. SUB-TAB 2: ALL SCENARIOS */}
      {activeSubTab === 'scenarios' && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-white">5 Vocational Safety Scenarios</h3>
              <p className="text-xs text-slate-400">
                Tailored for Jharkhand&apos;s mining belts and heavy manufacturing industrial hubs.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Completed {completedScenariosCount} of {totalScenariosCount} Modules
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SCENARIO_DEFINITIONS.map((scenario) => (
              <ScenarioCard
                key={scenario.id}
                scenario={scenario}
                bestScore={profile?.bestScores?.[scenario.id]}
                isCompleted={(profile?.completedScenarioIds || []).includes(scenario.id)}
                isRecommended={smartRecommendation.scenarioId === scenario.id}
                onLaunch={() => {
                  if (onStartScenario) onStartScenario(scenario.id);
                  else handleSimulateScenarioCompletion(scenario);
                }}
                onWatchSafetySteps={() => {
                  if (onWatchSafetySteps) onWatchSafetySteps(scenario.id);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* 7. SUB-TAB 3: ACHIEVEMENTS */}
      {activeSubTab === 'achievements' && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-red-500" />
                Vocational Safety Achievements &bull; Badges
              </h3>
              <p className="text-xs text-slate-400">
                Earn XP and unlock badges for mastering DGMS, CEA, and IS safety requirements.
              </p>
            </div>
            <span className="text-xs font-mono text-red-400 font-bold bg-red-950/40 px-3 py-1 rounded-xl border border-red-500/40">
              {unlockedCount} of {achievements.length} Badges Unlocked
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((ach) => (
              <AchievementCard key={ach.id} achievement={ach} />
            ))}
          </div>
        </div>
      )}

      {/* 8. SUB-TAB 4: LEADERBOARD */}
      {activeSubTab === 'leaderboard' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 md:p-6 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-red-500" />
                Jharkhand Vocational Safety Leaderboard
              </h3>
              <p className="text-xs text-slate-400">
                Ranked by accumulated Safety XP. Privacy-friendly display names protect trainee identity.
              </p>
            </div>
            <div className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Synced &bull; Cloud Firestore
            </div>
          </div>

          <div className="space-y-2">
            {leaderboard.map((entry) => (
              <LeaderboardRow
                key={entry.traineeId}
                entry={entry}
                isCurrentUser={entry.traineeId === profile.id}
              />
            ))}
          </div>
        </div>
      )}

      {/* 9. SUB-TAB 5: HISTORY & AUDIT LOGS */}
      {activeSubTab === 'history' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 md:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <History className="w-5 h-5 text-red-500" />
                Trainee Session History &amp; Audit Trail
              </h3>
              <p className="text-xs text-slate-400">
                Verified inspection records submitted from Android ARCore handheld devices.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400">
              {MOCK_TRAINEE_SESSIONS.length} Synced Records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Scenario</th>
                  <th className="py-2.5 px-3">Industry</th>
                  <th className="py-2.5 px-3">Score</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {MOCK_TRAINEE_SESSIONS.slice(0, 6).map((session) => (
                  <tr key={session.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-semibold text-white">{session.scenarioName}</td>
                    <td className="py-3 px-3 text-slate-400">{session.industry}</td>
                    <td className="py-3 px-3 font-mono font-bold text-red-400">
                      {session.score}/{session.maxScore} ({session.percentage}%)
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          session.status === 'Passed'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}
                      >
                        {session.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300">{session.timeSpentSeconds}s</td>
                    <td className="py-3 px-3 font-mono text-slate-400 text-[10px]">
                      {new Date(session.timestamp).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 10. SUB-TAB 6: PROFILE & STANDARDS */}
      {activeSubTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-red-500" />
              Trainee Credentials &bull; SURAKSHAAR
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Trainee Full Name:</span>
                <span className="font-semibold text-white">{profile.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Unique Trainee ID:</span>
                <span className="font-mono text-red-400">{profile.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Affiliated Institute:</span>
                <span className="font-semibold text-slate-200">{profile.affiliation}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Current Safety Rank:</span>
                <span className="font-semibold text-red-400">
                  Level {profile.level} ({profile.levelTitle})
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Total Lifetime XP:</span>
                <span className="font-mono font-bold text-red-400">{profile.xp} XP</span>
              </div>
              {currentUser && (
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Account Email:</span>
                  <span className="font-mono text-xs text-slate-300 truncate max-w-[200px]">
                    {currentUser.email}
                  </span>
                </div>
              )}
            </div>

            {onLogout && (
              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={onLogout}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-red-950/40 border border-slate-800 hover:border-red-500/50 text-red-400 hover:text-red-300 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Logout from Trainee Portal</span>
                </button>
              </div>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-500" />
              Regulatory Compliance Framework
            </h3>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <strong className="text-white block mb-0.5">DGMS Coal Mines Regulations 2017</strong>
                <span className="text-[11px] text-slate-400">
                  Governs strata control, haulage truck safety perimeters, and approved cap lamp usage.
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <strong className="text-white block mb-0.5">Central Electricity Authority (CEA) 2010</strong>
                <span className="text-[11px] text-slate-400">
                  Mandates Regulation 30 safety provisions for high-voltage isolation and dielectric PPE.
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <strong className="text-white block mb-0.5">IS 9474 &amp; IS 15683 Standards</strong>
                <span className="text-[11px] text-slate-400">
                  Industrial machinery nip-point guarding, emergency stop buttons, and portable fire extinguishers.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Completion Modal */}
      {completionModalData && (
        <ScenarioCompletionModal
          data={completionModalData}
          onRetry={() => {
            setCompletionModalData(null);
            const sc = SCENARIO_DEFINITIONS.find((s) => s.id === completionModalData.scenarioId);
            if (sc) handleSimulateScenarioCompletion(sc);
          }}
          onNextScenario={() => {
            const nextScId = completionModalData.recommendation.scenarioId;
            setCompletionModalData(null);
            const sc = SCENARIO_DEFINITIONS.find((s) => s.id === nextScId);
            if (sc) handleSimulateScenarioCompletion(sc);
          }}
          onGoDashboard={() => setCompletionModalData(null)}
          onClose={() => setCompletionModalData(null)}
        />
      )}
    </div>
  );
};
