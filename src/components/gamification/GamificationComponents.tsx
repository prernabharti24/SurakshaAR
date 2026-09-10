import React from 'react';
import { SurakshaLogo } from '../SurakshaLogo';
import {
  Achievement,
  ScenarioDefinition,
  LeaderboardEntry,
  CompletionSummaryData,
  ScenarioIndustry
} from '../../types';
import {
  Award,
  Crosshair,
  Star,
  Pickaxe,
  Flame,
  Zap,
  Trophy,
  Shield,
  Cog,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Lock,
  ChevronRight,
  TrendingUp,
  Layers,
  ShieldCheck,
  Clapperboard
} from 'lucide-react';

// ==========================================
// 1. STAT CARD
// ==========================================
interface StatCardProps {
  id?: string;
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  highlightColor?: 'red' | 'amber' | 'emerald' | 'cyan' | 'purple' | 'rose';
}

export const StatCard: React.FC<StatCardProps> = ({
  id,
  label,
  value,
  subtext,
  icon,
  highlightColor = 'red'
}) => {
  const getColorClasses = () => {
    switch (highlightColor) {
      case 'red':
        return 'text-red-400 border-red-500/30 bg-red-950/20';
      case 'emerald':
        return 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20';
      case 'cyan':
        return 'text-cyan-400 border-cyan-500/30 bg-cyan-950/20';
      case 'purple':
        return 'text-purple-400 border-purple-500/30 bg-purple-950/20';
      case 'rose':
        return 'text-rose-400 border-rose-500/30 bg-rose-950/20';
      default:
        return 'text-red-400 border-red-500/30 bg-red-950/20';
    }
  };

  return (
    <div
      id={id}
      className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between hover:border-slate-700 transition-all"
    >
      <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
        <span>{label}</span>
        {icon && <div className="p-1 rounded-lg bg-slate-800/80">{icon}</div>}
      </div>
      <div className="mt-2">
        <div className={`text-2xl md:text-3xl font-bold font-mono ${getColorClasses().split(' ')[0]}`}>
          {value}
        </div>
        {subtext && <p className="text-[11px] text-slate-400 mt-1">{subtext}</p>}
      </div>
    </div>
  );
};

// ==========================================
// 2. PROGRESS BAR
// ==========================================
interface ProgressBarProps {
  id?: string;
  label?: string;
  current: number;
  max: number;
  valueSuffix?: string;
  color?: 'red' | 'amber' | 'emerald' | 'cyan' | 'purple';
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  id,
  label,
  current,
  max,
  valueSuffix = '',
  color = 'red',
  showPercentage = true
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((current / (max || 1)) * 100)));

  const getColorClasses = () => {
    switch (color) {
      case 'emerald':
        return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]';
      case 'cyan':
        return 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]';
      case 'purple':
        return 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]';
      case 'amber':
        return 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]';
      case 'red':
      default:
        return 'bg-gradient-to-r from-red-600 to-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]';
    }
  };

  return (
    <div id={id} className="space-y-1.5 w-full">
      <div className="flex items-center justify-between text-xs">
        {label && <span className="text-slate-300 font-medium">{label}</span>}
        <span className="text-slate-400 font-mono text-[11px]">
          {current} / {max} {valueSuffix}
          {showPercentage && ` (${percentage}%)`}
        </span>
      </div>

      <div className="w-full h-2 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getColorClasses()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// ==========================================
// 3. ACHIEVEMENT CARD
// ==========================================
interface AchievementCardProps {
  id?: string;
  achievement: Achievement;
  onSelect?: () => void;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ id, achievement, onSelect }) => {
  const getIcon = () => {
    switch (achievement.iconName) {
      case 'Award':
        return <Award className="w-5 h-5" />;
      case 'Crosshair':
        return <Crosshair className="w-5 h-5" />;
      case 'Star':
        return <Star className="w-5 h-5" />;
      case 'Pickaxe':
        return <Pickaxe className="w-5 h-5" />;
      case 'Flame':
        return <Flame className="w-5 h-5" />;
      case 'Zap':
        return <Zap className="w-5 h-5" />;
      case 'Trophy':
        return <Trophy className="w-5 h-5" />;
      default:
        return <Shield className="w-5 h-5" />;
    }
  };

  return (
    <div
      id={id || `ach-card-${achievement.id}`}
      onClick={onSelect}
      className={`rounded-2xl p-4 border transition-all flex flex-col justify-between ${
        achievement.isUnlocked
          ? 'bg-slate-900/90 border-amber-500/40 shadow-lg shadow-amber-950/20'
          : 'bg-slate-950/60 border-slate-800 opacity-60'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`p-2.5 rounded-xl shrink-0 flex items-center justify-center ${
            achievement.isUnlocked
              ? 'bg-gradient-to-br from-amber-500/20 to-amber-600/30 text-amber-400 border border-amber-500/50'
              : 'bg-slate-800 text-slate-500 border border-slate-700'
          }`}
        >
          {achievement.isUnlocked ? getIcon() : <Lock className="w-5 h-5 text-slate-500" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <h4 className="text-xs sm:text-sm font-bold text-white truncate">{achievement.title}</h4>
            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                achievement.isUnlocked
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              +{achievement.xpReward} XP
            </span>
          </div>

          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {achievement.description}
          </p>
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
        {achievement.isUnlocked ? (
          <span className="text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Unlocked {achievement.unlockedAt ? new Date(achievement.unlockedAt).toLocaleDateString() : ''}
          </span>
        ) : (
          <span className="text-slate-500 flex items-center gap-1">
            <Lock className="w-3 h-3 text-slate-500" />
            Locked (In Progress)
          </span>
        )}

        {achievement.progress && (
          <span className="text-slate-400">
            {achievement.progress.current}/{achievement.progress.total}
          </span>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 4. SCENARIO CARD
// ==========================================
interface ScenarioCardProps {
  id?: string;
  scenario: ScenarioDefinition;
  bestScore?: number | null;
  isCompleted?: boolean;
  isLocked?: boolean;
  xpReward?: number;
  onLaunch?: () => void;
  onWatchSafetySteps?: () => void;
  isRecommended?: boolean;
}

export const ScenarioCard: React.FC<ScenarioCardProps> = ({
  id,
  scenario,
  bestScore,
  isCompleted,
  isLocked = false,
  xpReward = 150,
  onLaunch,
  onWatchSafetySteps,
  isRecommended = false
}) => {
  const getIndustryIcon = (industry: ScenarioIndustry) => {
    switch (industry) {
      case 'Mining & Extraction':
        return <Pickaxe className="w-4 h-4 text-red-400" />;
      case 'Electrical Infrastructure':
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 'Emergency Response':
        return <Flame className="w-4 h-4 text-rose-400" />;
      case 'Heavy Engineering':
        return <Cog className="w-4 h-4 text-slate-300" />;
      default:
        return <Shield className="w-4 h-4 text-red-400" />;
    }
  };

  return (
    <div
      id={id || `scenario-card-${scenario.id}`}
      className={`rounded-2xl p-4 border flex flex-col justify-between transition-all duration-200 ${
        isRecommended
          ? 'bg-slate-900 border-red-500 shadow-xl shadow-red-950/40'
          : 'bg-slate-900/90 border-slate-800 hover:border-red-500/50 hover:bg-slate-900'
      }`}
    >
      <div className="space-y-3">
        {/* Top Header: Badge & Status */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            {getIndustryIcon(scenario.industry)}
            <span className="truncate max-w-[140px] text-slate-300 font-medium">{scenario.industry}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {isRecommended && (
              <span className="px-2 py-0.5 rounded-md bg-red-600 text-white font-mono text-[10px] font-bold shadow-sm tracking-wider">
                RECOMMENDED
              </span>
            )}
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800">
              {scenario.defaultDifficulty}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm md:text-base font-bold text-white leading-snug tracking-tight">
          {scenario.name}
        </h3>

        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {scenario.description}
        </p>

        {/* Hazards mini list */}
        <div className="pt-2 border-t border-slate-800/80">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
            {scenario.hazards.length} Critical Hazards &bull; DGMS/IS
          </span>
          <div className="flex flex-wrap gap-1">
            {scenario.hazards.slice(0, 3).map((h) => (
              <span
                key={h.id}
                className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800 truncate max-w-[150px]"
              >
                {h.title}
              </span>
            ))}
            {scenario.hazards.length > 3 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-950 text-slate-400 border border-slate-800">
                +{scenario.hazards.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Prominent Watch Safety Steps Button */}
      <div className="mt-3.5">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onWatchSafetySteps) onWatchSafetySteps();
          }}
          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-red-600/20 via-red-500/15 to-amber-500/15 hover:from-red-600/35 hover:via-red-500/25 hover:to-amber-500/25 border border-red-500/50 hover:border-red-400 text-left transition-all duration-200 group flex items-center justify-between gap-2 cursor-pointer shadow-sm hover:shadow-red-950/40"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 rounded-lg bg-red-600 text-white shrink-0 shadow-md group-hover:scale-105 transition-transform">
              <Clapperboard className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-black text-white group-hover:text-red-300 transition-colors flex items-center gap-1.5">
                <span>🎬 Watch Safety Steps</span>
              </div>
              <div className="text-[10px] text-amber-200/90 font-medium truncate">
                Learn with animation and voice
              </div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-slate-950 text-[10px] font-mono text-amber-300 font-bold border border-amber-500/30 shrink-0">
            6 Steps
          </span>
        </button>
      </div>

      {/* Footer / Performance Stats & CTA */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] text-slate-400 font-mono">
            Best Score:{' '}
            {bestScore !== null && bestScore !== undefined ? (
              <span className={`font-bold ${bestScore >= 75 ? 'text-emerald-400' : 'text-red-400'}`}>
                {bestScore}%
              </span>
            ) : (
              <span className="text-slate-500">Not Attempted</span>
            )}
          </div>
          <div className="text-[10px] font-mono text-red-400 font-semibold">+{xpReward} XP Reward</div>
        </div>

        <button
          onClick={onLaunch}
          disabled={isLocked}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            isLocked
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : isRecommended
              ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-950/50 active:scale-95'
              : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-red-500/40'
          }`}
        >
          {isLocked ? (
            <>
              <Lock className="w-3.5 h-3.5" /> Locked
            </>
          ) : isCompleted ? (
            <>
              <RotateCcw className="w-3.5 h-3.5" /> Retake
            </>
          ) : (
            <>
              <span>Start AR</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// ==========================================
// 5. LEADERBOARD ROW
// ==========================================
interface LeaderboardRowProps {
  id?: string;
  entry: LeaderboardEntry;
  isCurrentUser?: boolean;
}

export const LeaderboardRow: React.FC<LeaderboardRowProps> = ({ id, entry, isCurrentUser }) => {
  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-bold flex items-center justify-center text-xs shadow-sm">
            1
          </span>
        );
      case 2:
        return (
          <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-950 font-bold flex items-center justify-center text-xs shadow-sm">
            2
          </span>
        );
      case 3:
        return (
          <span className="w-6 h-6 rounded-full bg-amber-700 text-white font-bold flex items-center justify-center text-xs shadow-sm">
            3
          </span>
        );
      default:
        return <span className="text-slate-400 font-mono text-xs w-6 text-center">{rank}</span>;
    }
  };

  return (
    <div
      id={id || `leaderboard-row-${entry.traineeId}`}
      className={`px-3 py-2.5 rounded-xl flex items-center justify-between gap-3 transition-colors ${
        isCurrentUser
          ? 'bg-red-950/30 border border-red-500/50 shadow-sm shadow-red-950/40'
          : 'bg-slate-950/70 hover:bg-slate-800/40 border border-slate-800/80'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="shrink-0 flex items-center justify-center">{getRankBadge(entry.rank)}</div>

        <div
          className={`w-8 h-8 rounded-full bg-gradient-to-tr ${entry.avatarColor} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm`}
        >
          {entry.displayName.slice(0, 2).toUpperCase()}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs sm:text-sm font-bold truncate ${
                isCurrentUser ? 'text-white' : 'text-slate-200'
              }`}
            >
              {entry.displayName}
            </span>
            {isCurrentUser && (
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-red-600 text-white font-bold tracking-wider">
                YOU
              </span>
            )}
          </div>
          <div className="text-[10px] text-slate-400 truncate">
            {entry.affiliation || 'Industrial Safety Trainee'} &bull;{' '}
            <span className="text-slate-300 font-medium">Lvl {entry.level} ({entry.levelTitle})</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 text-right shrink-0">
        <div className="hidden sm:block">
          <div className="text-[11px] font-mono text-slate-300">{entry.scenariosCompleted} Scenarios</div>
          <div className="text-[10px] text-slate-400 font-mono">Avg: {entry.averageScore}%</div>
        </div>

        <div>
          <div className="text-xs sm:text-sm font-bold font-mono text-red-400">
            {entry.xp.toLocaleString()} XP
          </div>
          <div className="text-[10px] font-mono text-emerald-400">
            {entry.bestStreak}d streak
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. RESULT CARD
// ==========================================
interface ResultCardProps {
  id?: string;
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  subtitle?: string;
  isPassed?: boolean;
}

export const ResultCard: React.FC<ResultCardProps> = ({ id, label, value, icon, subtitle, isPassed }) => {
  return (
    <div id={id} className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-center space-y-1">
      <div className="text-[10px] font-mono uppercase text-slate-400 flex items-center justify-center gap-1">
        {icon}
        <span>{label}</span>
      </div>
      <div
        className={`text-xl font-bold font-mono ${
          isPassed !== undefined
            ? isPassed
              ? 'text-emerald-400'
              : 'text-rose-400'
            : 'text-white'
        }`}
      >
        {value}
      </div>
      {subtitle && <div className="text-[10px] text-slate-400">{subtitle}</div>}
    </div>
  );
};

// ==========================================
// 7. FEEDBACK PANEL
// ==========================================
interface FeedbackPanelProps {
  id?: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  recommendation?: string;
  onDismiss?: () => void;
}

export const FeedbackPanel: React.FC<FeedbackPanelProps> = ({
  id,
  type,
  title,
  message,
  recommendation,
  onDismiss
}) => {
  const getTheme = () => {
    switch (type) {
      case 'success':
        return {
          border: 'border-emerald-500/50',
          bg: 'bg-emerald-950/30',
          text: 'text-emerald-300',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        };
      case 'error':
        return {
          border: 'border-rose-500/50',
          bg: 'bg-rose-950/30',
          text: 'text-rose-300',
          icon: <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
        };
      case 'warning':
        return {
          border: 'border-amber-500/50',
          bg: 'bg-amber-950/30',
          text: 'text-amber-300',
          icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
        };
      default:
        return {
          border: 'border-cyan-500/50',
          bg: 'bg-cyan-950/30',
          text: 'text-cyan-300',
          icon: <Shield className="w-5 h-5 text-cyan-400 shrink-0" />
        };
    }
  };

  const theme = getTheme();

  return (
    <div
      id={id}
      className={`rounded-xl p-3.5 border ${theme.border} ${theme.bg} text-xs space-y-1.5 animate-fadeIn`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-white">
          {theme.icon}
          <span>{title}</span>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-slate-400 hover:text-white text-xs px-1 cursor-pointer"
          >
            &times;
          </button>
        )}
      </div>

      <p className="text-slate-300 pl-7">{message}</p>

      {recommendation && (
        <div className="ml-7 pt-1 text-[11px] text-amber-300 font-medium">
          &rarr; <strong>Remediation:</strong> {recommendation}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 8. SCENARIO COMPLETION MODAL (Step 8 Goal)
// ==========================================
interface ScenarioCompletionModalProps {
  data: CompletionSummaryData;
  onRetry: () => void;
  onNextScenario: () => void;
  onGoDashboard: () => void;
  onClose: () => void;
}

export const ScenarioCompletionModal: React.FC<ScenarioCompletionModalProps> = ({
  data,
  onRetry,
  onNextScenario,
  onGoDashboard,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-5 md:p-6 shadow-[0_0_50px_rgba(220,38,38,0.25)] space-y-4 max-h-[92vh] overflow-y-auto relative">
        {/* SURAKSHAAR Top Brand Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <SurakshaLogo variant="compact" size="sm" showSince />
          <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            04_SummaryLeaderboard
          </span>
        </div>

        {/* Header & Pass/Fail Status Banner */}
        <div className="text-center space-y-2 pt-1">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-red-600/20 to-red-950/40 border border-red-500/40 text-red-400 mb-1">
            <Trophy className="w-8 h-8" />
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Safety Assessment Complete
          </h2>
          <p className="text-xs text-slate-400">{data.scenarioName}</p>

          {/* Compliance Status Pill */}
          <div className="inline-block mt-2">
            {data.passed ? (
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm">
                <CheckCircle2 className="w-4 h-4" />
                PASSED &bull; DGMS &amp; IS:8032 COMPLIANT
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/50 text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm">
                <AlertTriangle className="w-4 h-4" />
                NEEDS REMEDIATION &bull; SCORE BELOW 75%
              </span>
            )}
          </div>
        </div>

        {/* Primary Result Grid */}
        <div className="grid grid-cols-3 gap-2.5">
          <ResultCard
            label="Score"
            value={`${data.score}/${data.maxScore}`}
            subtitle={`${data.percentage}%`}
            isPassed={data.passed}
          />
          <ResultCard
            label="XP Earned"
            value={`+${data.xpEarned}`}
            subtitle="Added to Rank"
            icon={<Sparkles className="w-3 h-3 text-red-400" />}
          />
          <ResultCard
            label="Duration"
            value={`${data.timeSpentSeconds}s`}
            subtitle="Inspection Time"
            icon={<Clock className="w-3 h-3 text-slate-400" />}
          />
        </div>

        {/* Hazard & Mistake Breakdown */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>
              Hazards Identified:{' '}
              <strong className="text-white font-mono">
                {data.hazardsIdentified} / {data.totalHazards}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span>
              Mistakes / False Alarms:{' '}
              <strong className={`font-mono ${data.mistakesCount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                {data.mistakesCount}
              </strong>
            </span>
          </div>
        </div>

        {/* New Achievements Unlocked (if any) */}
        {data.newAchievements.length > 0 && (
          <div className="bg-red-950/20 border border-red-500/40 rounded-xl p-3 space-y-2">
            <div className="text-xs font-bold text-red-400 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-red-400" />
              <span>New Industrial Achievement Unlocked!</span>
            </div>
            {data.newAchievements.map((ach) => (
              <div key={ach.id} className="flex items-center justify-between text-xs text-slate-200">
                <span className="font-semibold">{ach.title}</span>
                <span className="text-[10px] font-mono text-red-300 font-bold">+{ach.xpReward} XP</span>
              </div>
            ))}
          </div>
        )}

        {/* Safety Recommendation with DGMS Regulation Citation */}
        {data.recommendation && (
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1">
            <div className="text-[10px] font-mono uppercase text-red-400 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              SURAKSHAAR AI Recommendation:
            </div>
            <div className="text-xs font-bold text-white">{data.recommendation.shortTitle}</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">{data.recommendation.reason}</p>
          </div>
        )}

        {/* Action Buttons: Red Primary, Dark Secondary */}
        <div className="pt-2 flex flex-wrap items-center gap-2">
          <button
            onClick={onRetry}
            className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Retry Scenario
          </button>

          <button
            onClick={onNextScenario}
            className="flex-1 py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-red-950/50 cursor-pointer active:scale-95"
          >
            <span>Next Scenario</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onGoDashboard}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-medium transition-all border border-slate-800 cursor-pointer"
          >
            Back to Trainee Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
