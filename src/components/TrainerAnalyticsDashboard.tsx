import React, { useState, useEffect, useMemo } from 'react';
import {
  TraineeSessionRecord,
  ScenarioDefinition,
  ScenarioIndustry,
  ScenarioDifficulty
} from '../types';
import { SCENARIO_DEFINITIONS, MOCK_TRAINEE_SESSIONS } from '../data/step5Data';
import {
  Users,
  Award,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  BarChart3,
  TrendingDown,
  Filter,
  Search,
  Download,
  Database,
  Shield,
  Zap,
  Flame,
  Pickaxe,
  Cog,
  RefreshCw,
  PlusCircle,
  ExternalLink,
  ChevronRight,
  Layers,
  Bot,
  Mic,
  Sparkles,
  Clapperboard
} from 'lucide-react';
import { AISafetyAssistant } from './AISafetyAssistant';

const STORAGE_KEY_SESSIONS = 'sih26041_trainee_sessions';

interface TrainerAnalyticsDashboardProps {
  onWatchSafetySteps?: (scenarioId: string) => void;
}

export const TrainerAnalyticsDashboard: React.FC<TrainerAnalyticsDashboardProps> = ({
  onWatchSafetySteps
}) => {
  const [sessions, setSessions] = useState<TraineeSessionRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SESSIONS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return MOCK_TRAINEE_SESSIONS;
  });

  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'scenarios' | 'assistant' | 'firestore'>('overview');
  const [isSimulatingSession, setIsSimulatingSession] = useState(false);
  const [simulationNotice, setSimulationNotice] = useState<string | null>(null);
  const [isAssistantModalOpen, setIsAssistantModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
    } catch {
      // ignore
    }
  }, [sessions]);

  // Filtered session records
  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      if (selectedIndustry !== 'All' && session.industry !== selectedIndustry) return false;
      if (selectedScenarioId !== 'All' && session.scenarioId !== selectedScenarioId) return false;
      if (selectedStatus !== 'All' && session.status !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = session.traineeName.toLowerCase().includes(q);
        const matchesId = session.traineeId.toLowerCase().includes(q);
        const matchesScenario = session.scenarioName.toLowerCase().includes(q);
        if (!matchesName && !matchesId && !matchesScenario) return false;
      }
      return true;
    });
  }, [sessions, selectedIndustry, selectedScenarioId, selectedStatus, searchQuery]);

  // Analytics Metrics
  const totalSessions = sessions.length;
  const uniqueTraineesCount = useMemo(() => {
    return new Set(sessions.map((s) => s.traineeId)).size;
  }, [sessions]);

  const passedSessions = sessions.filter((s) => s.status === 'Passed').length;
  const overallPassRate = totalSessions > 0 ? Math.round((passedSessions / totalSessions) * 100) : 0;
  const avgScore =
    totalSessions > 0 ? Math.round(sessions.reduce((acc, s) => acc + s.percentage, 0) / totalSessions) : 0;
  const avgTimeSeconds =
    totalSessions > 0 ? Math.round(sessions.reduce((acc, s) => acc + s.timeSpentSeconds, 0) / totalSessions) : 0;

  // Weakest category analysis
  const categoryFailureCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    sessions.forEach((s) => {
      if (s.weakestCategory) {
        counts[s.weakestCategory] = (counts[s.weakestCategory] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([category, count]) => ({
        category,
        count,
        percentage: totalSessions > 0 ? Math.round((count / totalSessions) * 100) : 0
      }));
  }, [sessions, totalSessions]);

  // Scenario completion breakdown
  const scenarioCompletionStats = useMemo(() => {
    return SCENARIO_DEFINITIONS.map((def) => {
      const scenarioSessions = sessions.filter((s) => s.scenarioId === def.id);
      const totalAttempts = scenarioSessions.length;
      const passed = scenarioSessions.filter((s) => s.status === 'Passed').length;
      const passRate = totalAttempts > 0 ? Math.round((passed / totalAttempts) * 100) : 0;
      const avgTime =
        totalAttempts > 0
          ? Math.round(scenarioSessions.reduce((acc, s) => acc + s.timeSpentSeconds, 0) / totalAttempts)
          : 0;
      const avgScore =
        totalAttempts > 0
          ? Math.round(scenarioSessions.reduce((acc, s) => acc + s.percentage, 0) / totalAttempts)
          : 0;

      return {
        ...def,
        totalAttempts,
        passed,
        passRate,
        avgTime,
        avgScore
      };
    });
  }, [sessions]);

  // Most difficult scenario
  const mostDifficultScenario = useMemo(() => {
    if (scenarioCompletionStats.length === 0) return null;
    return [...scenarioCompletionStats].sort((a, b) => a.passRate - b.passRate)[0];
  }, [scenarioCompletionStats]);

  // Most common hazard missed
  const mostCommonHazard = '440V Exposed Live Cable & Dielectric Gloves (CEA Reg 30)';
  const weakestCategoryName = categoryFailureCounts[0]?.category || 'Electrical Safety';

  // Simulate logging a new trainee session
  const handleSimulateNewSession = () => {
    setIsSimulatingSession(true);
    const randomScenario = SCENARIO_DEFINITIONS[Math.floor(Math.random() * SCENARIO_DEFINITIONS.length)];
    const randomNames = [
      'Anand Kumar',
      'Pooja Hembrom',
      'Bikram Soren',
      'Sunil Mahto',
      'Deepak Bedia',
      'Kavita Tirkey',
      'Manish Munda',
      'Sangeeta Murmu'
    ];
    const traineeName = randomNames[Math.floor(Math.random() * randomNames.length)];
    const traineeId = `JH-VOC-${Math.floor(1000 + Math.random() * 9000)}`;
    const difficulty: ScenarioDifficulty = (['Easy', 'Medium', 'Hard'] as ScenarioDifficulty[])[
      Math.floor(Math.random() * 3)
    ];

    const hazardsTotal = randomScenario.hazards.length;
    const hazardsFound = Math.floor(Math.random() * 2) + (hazardsTotal - 1); // high score or close
    const maxScore = hazardsTotal * 10;
    const score = Math.max(10, hazardsFound * 10 - (Math.random() > 0.6 ? 5 : 0));
    const percentage = Math.round((score / maxScore) * 100);
    const status = percentage >= randomScenario.passingPercentage ? 'Passed' : 'Failed';
    const weakest =
      randomScenario.hazards[Math.floor(Math.random() * randomScenario.hazards.length)].category;

    const newRecord: TraineeSessionRecord = {
      id: `rec-${Date.now()}`,
      traineeId,
      traineeName,
      scenarioId: randomScenario.id,
      scenarioName: randomScenario.shortTitle,
      industry: randomScenario.industry,
      score,
      maxScore,
      percentage,
      status,
      weakestCategory: weakest,
      hazardsIdentified: randomScenario.hazards.slice(0, hazardsFound).map((h) => h.id),
      totalHazards: hazardsTotal,
      incorrectActions: status === 'Failed' ? 2 : 0,
      timeSpentSeconds: Math.floor(45 + Math.random() * 60),
      difficulty,
      timestamp: new Date().toISOString()
    };

    setTimeout(() => {
      setSessions((prev) => [newRecord, ...prev]);
      setIsSimulatingSession(false);
      setSimulationNotice(`Simulated session for ${traineeName} synced to Firestore: ${status} (${percentage}%)`);
      setTimeout(() => setSimulationNotice(null), 4000);
    }, 600);
  };

  // Export session data
  const handleExportCSV = () => {
    const headers = [
      'SessionID',
      'TraineeID',
      'TraineeName',
      'Scenario',
      'Industry',
      'Score',
      'MaxScore',
      'Percentage',
      'Status',
      'WeakestCategory',
      'TimeSeconds',
      'Difficulty',
      'Timestamp'
    ];
    const rows = filteredSessions.map((s) => [
      s.id,
      s.traineeId,
      `"${s.traineeName}"`,
      `"${s.scenarioName}"`,
      `"${s.industry}"`,
      s.score,
      s.maxScore,
      `${s.percentage}%`,
      s.status,
      `"${s.weakestCategory}"`,
      s.timeSpentSeconds,
      s.difficulty,
      s.timestamp
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SIH26041_Trainee_Audit_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset to default sample sessions
  const handleResetSessions = () => {
    setSessions(MOCK_TRAINEE_SESSIONS);
    setSimulationNotice('Reset records to verified baseline sample.');
    setTimeout(() => setSimulationNotice(null), 3000);
  };

  const getIndustryIcon = (industry: ScenarioIndustry) => {
    switch (industry) {
      case 'Mining & Extraction':
        return <Pickaxe className="w-4 h-4 text-cyan-400" />;
      case 'Electrical Infrastructure':
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 'Emergency Response':
        return <Flame className="w-4 h-4 text-rose-400" />;
      case 'Heavy Engineering':
        return <Cog className="w-4 h-4 text-purple-400" />;
      default:
        return <Shield className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-xs font-semibold border border-cyan-500/40">
              STEP 5 &bull; TRAINER VIEW &amp; ANALYTICS
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs font-semibold border border-emerald-500/40 flex items-center gap-1">
              <Database className="w-3 h-3" /> Firestore Synced
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-amber-400" />
            Vocational Safety Analytics &amp; Trainer Dashboard
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-3xl">
            Real-time competency tracking for vocational trainees in Jharkhand&apos;s mining belts (Dhanbad, Bokaro, Chaibasa) and manufacturing hubs (Jamshedpur, Ranchi). Evaluates DGMS, CEA, and IS standards compliance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Prominent AI Safety Assistant Button */}
          <button
            id="btn-trainer-ai-safety-assistant-header"
            onClick={() => setIsAssistantModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-xl shadow-red-950/70 transition-all flex items-center gap-2 cursor-pointer active:scale-95 border-2 border-red-500/80"
            title="Open AI Safety Assistant"
          >
            <Bot className="w-4 h-4 text-white" />
            <span>🤖 AI Safety Assistant</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          <button
            onClick={handleSimulateNewSession}
            disabled={isSimulatingSession}
            className="px-3 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            {isSimulatingSession ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <PlusCircle className="w-4 h-4" />
            )}
            Log Trainee Attempt
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-400" />
            Export Audit CSV
          </button>

          <button
            onClick={handleResetSessions}
            title="Reset to default mock sessions"
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl border border-slate-700 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Simulation Feedback Alert */}
      {simulationNotice && (
        <div className="bg-emerald-950/40 border border-emerald-500/60 text-emerald-300 text-xs p-3 rounded-xl flex items-center justify-between animate-fadeIn">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            {simulationNotice}
          </span>
          <span className="text-[10px] font-mono text-emerald-400/70">Firestore Document ID: rec-{Date.now()}</span>
        </div>
      )}

      {/* CLEARLY VISIBLE AI SAFETY ASSISTANT CARD FOR TRAINERS */}
      <div
        id="trainer-ai-assistant-card"
        onClick={() => setIsAssistantModalOpen(true)}
        className="relative overflow-hidden bg-gradient-to-r from-neutral-950 via-neutral-900 to-red-950 border-2 border-red-500 hover:border-red-400 rounded-2xl p-5 md:p-6 shadow-2xl shadow-red-950/70 transition-all cursor-pointer group flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
      >
        {/* Top accent hazard bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500" />

        <div className="flex items-start md:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 via-red-700 to-red-900 flex items-center justify-center text-white shadow-xl shadow-red-950/80 border-2 border-red-400/50 shrink-0 group-hover:scale-105 transition-transform">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-xl md:text-2xl font-black text-white group-hover:text-red-300 transition-colors flex items-center gap-2 tracking-tight">
                🤖 AI Safety Assistant
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-red-600/40 text-red-200 border border-red-400 flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-red-300 animate-pulse" />
                VOICE + TEXT
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neutral-800 text-slate-200 border border-neutral-700">
                🇮🇳 हिन्दी &amp; English
              </span>
            </div>
            <p className="text-base font-bold text-red-200">
              Ask safety questions by voice or text
            </p>
            <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Low-literacy voice &amp; text companion for vocational trainers. Instant guidance on PPE (IS 2925/15298), fire safety, 440V electrical isolation, DGMS mining regulations, and machinery lockout/tagout without complicated jargon.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto justify-end">
          <button
            type="button"
            id="btn-open-assistant-embedded"
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab('assistant');
            }}
            className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-slate-200 text-xs font-bold rounded-xl border border-neutral-700 transition cursor-pointer"
          >
            Open in Tab
          </button>
          <button
            type="button"
            id="btn-open-assistant-modal"
            onClick={(e) => {
              e.stopPropagation();
              setIsAssistantModalOpen(true);
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-xl shadow-red-950/70 flex items-center gap-2 transition active:scale-95 cursor-pointer border border-red-400/40"
          >
            <Mic className="w-4 h-4 text-white" />
            <span>Open Chatbot</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Primary KPI Ribbon (Step 9 Requirements) */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4">
        {/* Metric 1: Total Trainees */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total Trainees</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-white">{uniqueTraineesCount}</div>
            <p className="text-[10px] text-slate-400 mt-0.5">{totalSessions} Sessions Logged</p>
          </div>
        </div>

        {/* Metric 2: Average Score */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Average Score</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-amber-400">{avgScore}%</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Benchmark: &ge;75%</p>
          </div>
        </div>

        {/* Metric 3: Pass Rate */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Overall Pass Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-emerald-400">{overallPassRate}%</div>
            <p className="text-[10px] text-slate-400 mt-0.5">{passedSessions} Passed</p>
          </div>
        </div>

        {/* Metric 4: Most Difficult Scenario */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Most Difficult</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2">
            <div className="text-xs font-bold text-rose-300 truncate">
              {mostDifficultScenario?.shortTitle || 'Electrical Safety'}
            </div>
            <p className="text-[10px] font-mono text-rose-400 mt-0.5">
              Pass Rate: {mostDifficultScenario?.passRate || 58}%
            </p>
          </div>
        </div>

        {/* Metric 5: Most Common Hazard */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Most Common Hazard</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2">
            <div className="text-xs font-bold text-slate-200 truncate">440V Exposed Wire</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Dielectric Isolation</p>
          </div>
        </div>

        {/* Metric 6: Weakest Safety Category */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Weakest Category</span>
            <TrendingDown className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2">
            <div className="text-xs font-bold text-amber-300 truncate">{weakestCategoryName}</div>
            <p className="text-[10px] text-rose-400 mt-0.5">Remediation Target</p>
          </div>
        </div>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'overview'
              ? 'bg-amber-500 text-slate-950 shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          Analytics &amp; Weak Categories
        </button>

        <button
          id="tab-btn-assistant"
          onClick={() => setActiveTab('assistant')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'assistant'
              ? 'bg-red-600 text-white shadow-lg shadow-red-950/60'
              : 'text-red-400 hover:text-white hover:bg-red-950/40 border border-red-800/60'
          }`}
        >
          <Bot className="w-4 h-4 text-red-300" />
          <span>🤖 AI Safety Assistant</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>

        <button
          onClick={() => setActiveTab('scenarios')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'scenarios'
              ? 'bg-amber-500 text-slate-950 shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          5 Vocational Modules
        </button>

        <button
          onClick={() => setActiveTab('sessions')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'sessions'
              ? 'bg-amber-500 text-slate-950 shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          Recent Trainee Sessions ({filteredSessions.length})
        </button>

        <button
          onClick={() => setActiveTab('firestore')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'firestore'
              ? 'bg-amber-500 text-slate-950 shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          Firestore Schema &amp; Architecture
        </button>
      </div>

      {/* TAB 1: OVERVIEW & WEAKEST CATEGORIES */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Weakest Safety Categories & Failure Drivers */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-rose-400" />
                  Weakest Safety Competency Areas (Failure Frequency)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  High failure density indicates where instructors in Dhanbad &amp; Jamshedpur industrial institutes should focus remediation.
                </p>
              </div>
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono border border-rose-500/40">
                Action Required
              </span>
            </div>

            <div className="space-y-3 pt-2">
              {categoryFailureCounts.map((item, idx) => (
                <div key={item.category} className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-200 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-mono text-[10px] text-slate-300">
                        0{idx + 1}
                      </span>
                      {item.category}
                    </span>
                    <span className="font-mono text-rose-400 font-bold">
                      {item.count} infractions ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, item.percentage * 2)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>
                      {item.category === 'Electrical Safety' &&
                        'CEA Regulation 30 & dielectric glove verification issues (barehanded contact risks).'}
                      {item.category === 'Mining Geotechnical Safety' &&
                        'DGMS Coal Mines Regs 2017: Failure to spot unsupported roof strata fracture lines.'}
                      {item.category === 'Machinery Guarding' &&
                        'IS 9474: Bypassing in-running roller nip points and failing to actuate red E-Stop.'}
                      {item.category === 'Personal Protective Equipment' &&
                        'IS 2925 & IS 15809: Missing chin-straps and non-fluorescent night haulage attire.'}
                      {item.category === 'Vehicle & Traffic Safety' &&
                        'Walking into 35-tonne dump truck turning radius blind spots.'}
                      {item.category === 'Emergency Evacuation' &&
                        'Leaving exit push-bar doors obstructed with storage pallets.'}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Col: Scenario Completion Radar / Quick Rates */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Scenario Pass Rates
            </h3>
            <p className="text-xs text-slate-400">
              Benchmark comparison across all five vocational scenarios:
            </p>

            <div className="space-y-3 pt-1">
              {scenarioCompletionStats.map((sc) => (
                <div key={sc.id} className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-200 flex items-center gap-1.5 truncate">
                      {getIndustryIcon(sc.industry)}
                      {sc.shortTitle}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-slate-300">
                        Average: <strong className="text-amber-400">{sc.avgScore || 75}%</strong>
                      </span>
                      <span
                        className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                          sc.passRate >= 75 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        Pass Rate: {sc.passRate}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-1.5">
                    <div
                      className={`h-full rounded-full ${
                        sc.passRate >= 80
                          ? 'bg-emerald-500'
                          : sc.passRate >= 70
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${sc.passRate}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{sc.totalAttempts} sessions logged</span>
                    <span>Avg Response: {sc.avgTime}s</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SCENARIOS ARCHITECTURE (5 MODULES) */}
      {activeTab === 'scenarios' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-400" />
                  Jharkhand Mining &amp; Manufacturing Vocational Curriculum
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Five specialized vocational scenarios implemented via reusable ScriptableObjects without duplicated boilerplate.
                </p>
              </div>
              <span className="text-xs text-slate-400 font-mono">5 ScriptableObject Definitions</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SCENARIO_DEFINITIONS.map((scenario, idx) => (
                <div
                  key={scenario.id}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        SCENARIO 0{idx + 1}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {scenario.badge}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      {getIndustryIcon(scenario.industry)}
                      {scenario.name}
                    </h4>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {scenario.description}
                    </p>

                    <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                        Interactive Hazards ({scenario.hazards.length}):
                      </span>
                      <ul className="space-y-1">
                        {scenario.hazards.map((h) => (
                          <li key={h.id} className="text-[11px] text-slate-300 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
                            <span className="font-semibold text-slate-200">{h.title}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>Pass: {scenario.passingPercentage}%</span>
                    <span>Time: {scenario.timeLimitSeconds.Medium}s</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (onWatchSafetySteps) onWatchSafetySteps(scenario.id);
                    }}
                    className="mt-3 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-red-600/20 via-red-500/15 to-amber-500/15 hover:from-red-600/30 hover:via-red-500/25 hover:to-amber-500/25 border border-red-500/50 hover:border-red-400 text-left transition-all duration-200 group flex items-center justify-between gap-2 cursor-pointer shadow-sm"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="p-1 rounded bg-red-600 text-white shrink-0 shadow">
                        <Clapperboard className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-white block group-hover:text-red-300 transition-colors truncate">
                          🎬 Watch Safety Steps
                        </span>
                        <span className="text-[10px] text-amber-200/90 truncate block">
                          Learn with animation &amp; voice
                        </span>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-amber-300 border border-amber-500/30 shrink-0">
                      Tutorial
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RECENT TRAINEE SESSIONS */}
      {activeTab === 'sessions' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-xl space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="relative flex-1 max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search trainee name or ID..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="All">All Industries</option>
                <option value="Mining & Extraction">Mining &amp; Extraction</option>
                <option value="Electrical Infrastructure">Electrical Infrastructure</option>
                <option value="Emergency Response">Emergency Response</option>
                <option value="Heavy Engineering">Heavy Engineering</option>
                <option value="General Manufacturing">General Manufacturing</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Passed">Passed</option>
                <option value="Failed">Failed</option>
              </select>

              <span className="text-slate-400 font-mono text-[11px] ml-1">
                Showing {filteredSessions.length} of {sessions.length}
              </span>
            </div>
          </div>

          {/* Sessions Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Trainee</th>
                  <th className="py-2.5 px-3">Scenario</th>
                  <th className="py-2.5 px-3">Difficulty</th>
                  <th className="py-2.5 px-3">Score</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Weakest Safety Area</th>
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">Firestore Sync</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-white">{session.traineeName}</div>
                      <div className="text-[10px] font-mono text-slate-400">{session.traineeId}</div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-200 flex items-center gap-1.5">
                        {getIndustryIcon(session.industry)}
                        {session.scenarioName}
                      </div>
                      <div className="text-[10px] text-slate-400">{session.industry}</div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {session.difficulty}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono font-bold">
                      <span className={session.percentage >= 75 ? 'text-emerald-400' : 'text-rose-400'}>
                        {session.score}/{session.maxScore} ({session.percentage}%)
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          session.status === 'Passed'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {session.status === 'Passed' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <XCircle className="w-3 h-3 text-rose-400" />
                        )}
                        {session.status}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 text-[11px]">
                        {session.weakestCategory || 'None Identified'}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono text-slate-300">
                      {session.timeSpentSeconds}s
                    </td>

                    <td className="py-3 px-3">
                      <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Synced
                      </span>
                      <div className="text-[9px] font-mono text-slate-400">
                        {new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: FIRESTORE SCHEMA & REUSABLE ARCHITECTURE */}
      {activeTab === 'firestore' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-xl space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-amber-400" />
              Firestore Collection Hierarchy: <code className="text-amber-300 font-mono text-xs">trainee_sessions</code>
            </h3>
            <p className="text-xs text-slate-400">
              Each session record submitted by Unity ARCore via <code className="text-slate-300 font-mono">FirebaseTrainingRecordService.cs</code> conforms to this schema:
            </p>

            <pre className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-[11px] font-mono text-cyan-300 overflow-x-auto leading-relaxed">
{`// Cloud Firestore: /artifacts/399d2463.../trainee_sessions/{sessionId}
{
  "sessionId": "rec-1725619420000",
  "traineeId": "JH-VOC-4821",
  "traineeName": "Bikram Soren",
  "scenarioId": "scenario-4-mining",
  "scenarioName": "Coal Mining & Haulage",
  "industry": "Mining & Extraction",
  "score": 45,
  "maxScore": 50,
  "percentage": 90,
  "status": "Passed",
  "weakestCategory": "Vehicle & Traffic Safety",
  "hazardsIdentified": [
    "mine-haulage-blindspot",
    "mine-unstable-roof",
    "mine-no-caplamp"
  ],
  "totalHazards": 4,
  "incorrectActions": 0,
  "timeSpentSeconds": 68,
  "difficulty": "Hard",
  "deviceInfo": "Android ARCore / Samsung Galaxy S21",
  "timestamp": "2026-09-06T10:15:30Z"
}`}
            </pre>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-xl space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              Firestore Security Rules &amp; Role-Based Access
            </h3>
            <p className="text-xs text-slate-400">
              Rule enforcement prevents trainees from modifying prior test records while allowing accredited instructors to review aggregate telemetry:
            </p>

            <pre className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-[11px] font-mono text-emerald-300 overflow-x-auto leading-relaxed">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Trainee Session Records collection
    match /trainee_sessions/{sessionId} {
      // Any authenticated trainee can create their own result
      allow create: if request.auth != null 
                    && request.resource.data.traineeId == request.auth.uid;

      // Trainees can only read their own records
      allow read: if request.auth != null && (
        resource.data.traineeId == request.auth.uid ||
        request.auth.token.role == "trainer"
      );

      // Records are immutable audit logs
      allow update, delete: if false;
    }
  }
}`}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 5: AI SAFETY ASSISTANT EMBEDDED VIEW */}
      {activeTab === 'assistant' && (
        <div className="space-y-4">
          <AISafetyAssistant isEmbedded={true} currentScenarioId="scenario-1-ppe" />
        </div>
      )}

      {/* MODAL VIEW FOR AI SAFETY ASSISTANT */}
      {isAssistantModalOpen && (
        <div
          id="ai-safety-assistant-modal-backdrop"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
          onClick={() => setIsAssistantModalOpen(false)}
        >
          <div
            className="w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <AISafetyAssistant
              isEmbedded={false}
              currentScenarioId="scenario-1-ppe"
              onClose={() => setIsAssistantModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
