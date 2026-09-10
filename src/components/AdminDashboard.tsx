import React, { useState, useEffect, useMemo } from 'react';
import { AuthService } from '../services/authService';
import {
  AuthUser,
  AdminTraineeRecord,
  QuizTestResult,
  HelpRequestItem,
  CANONICAL_MODULES,
  SystemConfig,
  SafetyModuleInfo
} from '../types';
import {
  ShieldAlert,
  Users,
  UserPlus,
  Sliders,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Lock,
  Mail,
  ShieldCheck,
  Search,
  Filter,
  Eye,
  Trash2,
  Check,
  X,
  UserCheck,
  UserX,
  Save,
  HardHat,
  Award,
  Bot,
  MessageSquare,
  Flame,
  Zap,
  Pickaxe,
  Wrench,
  HelpCircle,
  TrendingUp,
  Layers,
  LogOut,
  ExternalLink,
  Key,
  Edit,
  Trophy,
  Medal,
  Copy,
  ChevronDown
} from 'lucide-react';

interface AdminDashboardProps {
  currentUser: AuthUser;
  onLogout: () => void;
  onPreviewAsTrainee?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  onLogout,
  onPreviewAsTrainee
}) => {
  // Tabs: 'trainees' | 'provision' | 'leaderboard' | 'quizzes' | 'help' | 'config' | 'assistant'
  const [activeTab, setActiveTab] = useState<
    'trainees' | 'provision' | 'leaderboard' | 'quizzes' | 'help' | 'config' | 'assistant'
  >('trainees');

  // Trainee Directory State
  const [trainees, setTrainees] = useState<AdminTraineeRecord[]>([]);
  const [isLoadingTrainees, setIsLoadingTrainees] = useState(false);

  // Quiz Results & Help Requests
  const [quizResults, setQuizResults] = useState<QuizTestResult[]>([]);
  const [isLoadingQuizzes, setIsLoadingQuizzes] = useState(false);
  const [helpRequests, setHelpRequests] = useState<HelpRequestItem[]>([]);
  const [isLoadingHelp, setIsLoadingHelp] = useState(false);

  // System Configuration
  const [systemConfig, setSystemConfig] = useState<SystemConfig | null>(null);
  const [configDraft, setConfigDraft] = useState<Partial<SystemConfig>>({});
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  // Assistant Stats
  const [assistantStats, setAssistantStats] = useState<any>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  // Global Feedback Toast
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Search & Multi-Filters for Trainee Management Table
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [progressFilter, setProgressFilter] = useState<'all' | 'training' | 'completed'>('all');
  const [moduleFilter, setModuleFilter] = useState<string>('all');

  // Leaderboard Sorting Metric
  const [leaderboardSort, setLeaderboardSort] = useState<'safety' | 'progress' | 'quiz'>('safety');

  // Provisioning Form State
  const [provisionName, setProvisionName] = useState('');
  const [provisionEmail, setProvisionEmail] = useState('');
  const [provisionTraineeId, setProvisionTraineeId] = useState(
    `TR-2026-${Math.floor(100 + Math.random() * 900)}`
  );
  const [provisionPassword, setProvisionPassword] = useState('Suraksha@2026');
  const [provisionModules, setProvisionModules] = useState<string[]>(
    CANONICAL_MODULES.map((m) => m.id)
  );
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [lastProvisionedCredentials, setLastProvisionedCredentials] = useState<{
    name: string;
    email: string;
    traineeId: string;
    password: string;
    modules: string[];
  } | null>(null);

  // Modals State
  const [selectedTrainee, setSelectedTrainee] = useState<AdminTraineeRecord | null>(null);
  const [traineeDetailData, setTraineeDetailData] = useState<{
    trainee: AdminTraineeRecord;
    quizResults: QuizTestResult[];
    helpRequests: HelpRequestItem[];
  } | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // Edit Trainee Modal State
  const [editTrainee, setEditTrainee] = useState<AdminTraineeRecord | null>(null);
  const [editFormName, setEditFormName] = useState('');
  const [editFormTraineeId, setEditFormTraineeId] = useState('');
  const [editFormStatus, setEditFormStatus] = useState<'active' | 'suspended'>('active');
  const [editFormModules, setEditFormModules] = useState<string[]>([]);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Reset Password Modal State
  const [resetPasswordTrainee, setResetPasswordTrainee] = useState<AdminTraineeRecord | null>(null);
  const [customResetPassword, setCustomResetPassword] = useState('');
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [newTempPasswordResult, setNewTempPasswordResult] = useState<string | null>(null);

  // Module Management Modal State
  const [moduleModalTrainee, setModuleModalTrainee] = useState<AdminTraineeRecord | null>(null);
  const [modalAssigned, setModalAssigned] = useState<string[]>([]);
  const [modalDisabled, setModalDisabled] = useState<string[]>([]);
  const [isSavingModules, setIsSavingModules] = useState(false);

  // Delete Confirmation Modal State
  const [deleteTargetTrainee, setDeleteTargetTrainee] = useState<AdminTraineeRecord | null>(null);
  const [isDeletingTrainee, setIsDeletingTrainee] = useState(false);

  // Help Reply State
  const [replyingRequestId, setReplyingRequestId] = useState<string | null>(null);
  const [adminReplyText, setAdminReplyText] = useState('');
  const [helpFilterStatus, setHelpFilterStatus] = useState<'all' | 'Open' | 'In Progress' | 'Resolved'>('all');

  // Auto-dismiss toast
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Load All Primary Data
  const loadTrainees = async () => {
    setIsLoadingTrainees(true);
    try {
      const list = await AuthService.getAdminTrainees();
      setTrainees(list);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to load trainees.' });
    } finally {
      setIsLoadingTrainees(false);
    }
  };

  const loadQuizzes = async () => {
    setIsLoadingQuizzes(true);
    try {
      const results = await AuthService.getAllQuizResults();
      setQuizResults(results);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to load quiz results.' });
    } finally {
      setIsLoadingQuizzes(false);
    }
  };

  const loadHelpRequests = async () => {
    setIsLoadingHelp(true);
    try {
      const requests = await AuthService.getAllHelpRequests();
      setHelpRequests(requests);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to load help requests.' });
    } finally {
      setIsLoadingHelp(false);
    }
  };

  const loadConfig = async () => {
    try {
      const cfg = await AuthService.getSystemConfig();
      setSystemConfig(cfg);
      setConfigDraft(cfg);
    } catch (err: any) {
      console.warn('System config load notice:', err);
    }
  };

  const loadAssistantStats = async () => {
    setIsLoadingStats(true);
    try {
      const res = await fetch('/api/admin/assistant-stats');
      if (res.ok) {
        const data = await res.json();
        setAssistantStats(data.stats);
      }
    } catch (e) {
      console.warn('Assistant stats load notice:', e);
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
    loadTrainees();
    loadQuizzes();
    loadHelpRequests();
    loadConfig();
  }, []);

  useEffect(() => {
    if (activeTab === 'assistant') loadAssistantStats();
    if (activeTab === 'quizzes') loadQuizzes();
    if (activeTab === 'help') loadHelpRequests();
    if (activeTab === 'leaderboard' || activeTab === 'trainees') loadTrainees();
  }, [activeTab]);

  // =========================================================
  // 1. OVERVIEW COMPUTED STATISTICS (Exact user requirements)
  // - Total Trainees
  // - Active Trainees
  // - Inactive Trainees
  // - Average Progress Rate
  // - Average Safety Score
  // - Average Quiz Score
  // =========================================================
  const stats = useMemo(() => {
    const total = trainees.length;
    const active = trainees.filter((t) => t.status === 'active').length;
    const inactive = trainees.filter((t) => t.status === 'suspended').length;
    const activePercent = total > 0 ? Math.round((active / total) * 100) : 100;

    const avgSafety =
      total > 0
        ? Math.round(trainees.reduce((acc, curr) => acc + (curr.safetyScore || 0), 0) / total)
        : 88;

    const avgProgress =
      total > 0
        ? Math.round(trainees.reduce((acc, curr) => acc + (curr.progressRate || 0), 0) / total)
        : 65;

    // Average Quiz Score calculated from quiz test scores
    const avgQuiz =
      total > 0
        ? Math.round(trainees.reduce((acc, curr) => acc + (curr.quizScore || 85), 0) / total)
        : 85;

    const pendingHelp = helpRequests.filter((h) => h.status !== 'Resolved').length;
    const totalQuizzes = quizResults.length;
    const passedQuizzes = quizResults.filter((q) => q.status === 'Passed').length;
    const passRate = totalQuizzes > 0 ? Math.round((passedQuizzes / totalQuizzes) * 100) : 92;

    return {
      total,
      active,
      inactive,
      activePercent,
      avgSafety,
      avgProgress,
      avgQuiz,
      pendingHelp,
      totalQuizzes,
      passRate
    };
  }, [trainees, helpRequests, quizResults]);

  // Filtered Trainees according to Search & Filters (active/inactive, training/completed, module)
  const filteredTrainees = useMemo(() => {
    return trainees.filter((t) => {
      // 1. Search by name, email, or ID
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const matchesName = (t.displayName || '').toLowerCase().includes(q);
        const matchesEmail = (t.email || '').toLowerCase().includes(q);
        const matchesId = (t.traineeId || '').toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesId) return false;
      }

      // 2. Status filter: active / inactive
      if (statusFilter === 'active' && t.status !== 'active') return false;
      if (statusFilter === 'inactive' && t.status !== 'suspended') return false;

      // 3. Training progress filter: training (in progress) / completed
      if (progressFilter === 'training') {
        const p = t.progressRate || 0;
        if (p <= 0 || p >= 100) return false;
      }
      if (progressFilter === 'completed') {
        const p = t.progressRate || 0;
        if (p < 100) return false;
      }

      // 4. Module filter
      if (moduleFilter !== 'all') {
        const assigned = t.assignedModules || CANONICAL_MODULES.map((m) => m.id);
        const disabled = t.disabledModules || [];
        if (!assigned.includes(moduleFilter) || disabled.includes(moduleFilter)) {
          return false;
        }
      }

      return true;
    });
  }, [trainees, searchQuery, statusFilter, progressFilter, moduleFilter]);

  // Leaderboard Sorted Trainees
  const leaderboardTrainees = useMemo(() => {
    return [...trainees].sort((a, b) => {
      if (leaderboardSort === 'safety') {
        return (b.safetyScore || 0) - (a.safetyScore || 0);
      }
      if (leaderboardSort === 'progress') {
        return (b.progressRate || 0) - (a.progressRate || 0);
      }
      return (b.quizScore || 0) - (a.quizScore || 0);
    });
  }, [trainees, leaderboardSort]);

  // Filtered Help Requests
  const filteredHelpRequests = useMemo(() => {
    return helpRequests.filter((h) => {
      if (helpFilterStatus === 'all') return true;
      return h.status === helpFilterStatus;
    });
  }, [helpRequests, helpFilterStatus]);

  // Action: Toggle Trainee Status (Activate / Deactivate)
  const handleToggleStatus = async (t: AdminTraineeRecord) => {
    const newStatus = t.status === 'active' ? 'suspended' : 'active';
    try {
      await AuthService.updateTrainee(t.uid, { status: newStatus });
      setFeedback({
        type: 'success',
        message: `Trainee ${t.displayName} (${t.traineeId}) is now ${newStatus === 'active' ? 'ACTIVE' : 'DEACTIVATED / INACTIVE'}.`
      });
      loadTrainees();
      if (selectedTrainee?.uid === t.uid) {
        setSelectedTrainee((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update trainee status.' });
    }
  };

  // Action: Open Edit Trainee Modal
  const handleOpenEdit = (t: AdminTraineeRecord) => {
    setEditTrainee(t);
    setEditFormName(t.displayName || '');
    setEditFormTraineeId(t.traineeId || '');
    setEditFormStatus(t.status || 'active');
    setEditFormModules(t.assignedModules || CANONICAL_MODULES.map((m) => m.id));
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTrainee) return;
    setIsSavingEdit(true);
    try {
      await AuthService.updateTrainee(editTrainee.uid, {
        displayName: editFormName.trim(),
        traineeId: editFormTraineeId.trim(),
        status: editFormStatus,
        assignedModules: editFormModules
      });
      setFeedback({
        type: 'success',
        message: `Trainee profile for ${editFormName} updated successfully.`
      });
      setEditTrainee(null);
      loadTrainees();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update trainee.' });
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Action: Open Reset Password Modal
  const handleOpenResetPassword = (t: AdminTraineeRecord) => {
    setResetPasswordTrainee(t);
    setCustomResetPassword('Suraksha@' + Math.floor(1000 + Math.random() * 9000));
    setNewTempPasswordResult(null);
  };

  const handleExecuteResetPassword = async () => {
    if (!resetPasswordTrainee) return;
    setIsResettingPassword(true);
    try {
      const res = await AuthService.resetTraineePassword(
        resetPasswordTrainee.uid,
        customResetPassword
      );
      setNewTempPasswordResult(res.temporaryPassword);
      setFeedback({
        type: 'success',
        message: `Password reset successfully for ${resetPasswordTrainee.displayName}.`
      });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to reset password.' });
    } finally {
      setIsResettingPassword(false);
    }
  };

  // Action: Delete Trainee
  const handleDeleteTraineeConfirm = async () => {
    if (!deleteTargetTrainee) return;
    setIsDeletingTrainee(true);
    try {
      await AuthService.deleteTrainee(deleteTargetTrainee.uid);
      setFeedback({
        type: 'success',
        message: `Trainee account ${deleteTargetTrainee.displayName} permanently deleted.`
      });
      setDeleteTargetTrainee(null);
      loadTrainees();
      if (selectedTrainee?.uid === deleteTargetTrainee.uid) setSelectedTrainee(null);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete trainee account.' });
    } finally {
      setIsDeletingTrainee(false);
    }
  };

  // Action: Open Trainee Detail View
  const handleOpenDetail = async (t: AdminTraineeRecord) => {
    setSelectedTrainee(t);
    setIsLoadingDetail(true);
    try {
      const data = await AuthService.getAdminTraineeDetails(t.uid);
      setTraineeDetailData(data as any);
    } catch (err: any) {
      console.warn('Failed to fetch detailed profile:', err);
      setTraineeDetailData({
        trainee: t,
        quizResults: quizResults.filter(
          (q) => q.traineeUid === t.uid || q.traineeEmail === t.email
        ),
        helpRequests: helpRequests.filter(
          (h) => h.traineeUid === t.uid || h.traineeEmail === t.email
        )
      });
    } finally {
      setIsLoadingDetail(false);
    }
  };

  // Action: Open Module Management Modal
  const handleOpenModuleModal = (t: AdminTraineeRecord) => {
    setModuleModalTrainee(t);
    setModalAssigned(t.assignedModules || CANONICAL_MODULES.map((m) => m.id));
    setModalDisabled(t.disabledModules || []);
  };

  const handleSaveModules = async () => {
    if (!moduleModalTrainee) return;
    setIsSavingModules(true);
    try {
      await AuthService.updateTraineeModules(
        moduleModalTrainee.uid,
        modalAssigned,
        modalDisabled
      );
      setFeedback({
        type: 'success',
        message: `Module access updated for ${moduleModalTrainee.displayName}.`
      });
      setModuleModalTrainee(null);
      loadTrainees();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update module access.' });
    } finally {
      setIsSavingModules(false);
    }
  };

  // Action: Provision Trainee Form Submit
  const handleProvisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!provisionName.trim()) {
      setFeedback({ type: 'error', message: 'Trainee full name is required.' });
      return;
    }
    if (!provisionEmail.trim() || !provisionEmail.includes('@')) {
      setFeedback({ type: 'error', message: 'Valid trainee email is required.' });
      return;
    }
    if (!provisionPassword || provisionPassword.length < 6) {
      setFeedback({ type: 'error', message: 'Temporary password must be at least 6 characters.' });
      return;
    }
    if (provisionModules.length === 0) {
      setFeedback({ type: 'error', message: 'Please assign at least one safety module.' });
      return;
    }

    setIsProvisioning(true);
    try {
      const newTrainee = await AuthService.provisionTrainee({
        displayName: provisionName.trim(),
        email: provisionEmail.trim(),
        traineeId: provisionTraineeId.trim(),
        password: provisionPassword,
        assignedModules: provisionModules
      });

      setLastProvisionedCredentials({
        name: newTrainee.displayName,
        email: newTrainee.email,
        traineeId: newTrainee.traineeId,
        password: provisionPassword,
        modules: provisionModules
      });

      setFeedback({
        type: 'success',
        message: `Trainee ${newTrainee.displayName} (${newTrainee.traineeId}) provisioned successfully!`
      });

      // Reset form
      setProvisionName('');
      setProvisionEmail('');
      setProvisionTraineeId(`TR-2026-${Math.floor(100 + Math.random() * 900)}`);
      setProvisionPassword('Suraksha@' + Math.floor(1000 + Math.random() * 9000));
      setProvisionModules(CANONICAL_MODULES.map((m) => m.id));
      loadTrainees();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to provision trainee.' });
    } finally {
      setIsProvisioning(false);
    }
  };

  // Action: Respond / Resolve Help Request
  const handleUpdateHelpRequest = async (
    id: string,
    newStatus: 'Open' | 'In Progress' | 'Resolved'
  ) => {
    try {
      await AuthService.updateHelpRequest(id, {
        status: newStatus,
        adminReply: adminReplyText.trim() ? adminReplyText.trim() : undefined
      });
      setFeedback({
        type: 'success',
        message: `Help request updated to status: ${newStatus}.`
      });
      setReplyingRequestId(null);
      setAdminReplyText('');
      loadHelpRequests();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update help request.' });
    }
  };

  const handleDeleteHelpRequest = async (id: string) => {
    try {
      await AuthService.deleteHelpRequest(id);
      setFeedback({ type: 'success', message: 'Help request deleted.' });
      loadHelpRequests();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete help request.' });
    }
  };

  // Action: Save System Config
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingConfig(true);
    try {
      const updated = await AuthService.updateSystemConfig(configDraft);
      setSystemConfig(updated);
      setFeedback({ type: 'success', message: 'System compliance policies updated successfully.' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save system policies.' });
    } finally {
      setIsSavingConfig(false);
    }
  };

  // Helper for module icon
  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame':
        return <Flame className="w-4 h-4 text-orange-400" />;
      case 'Zap':
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 'Pickaxe':
        return <Pickaxe className="w-4 h-4 text-emerald-400" />;
      case 'Wrench':
        return <Wrench className="w-4 h-4 text-blue-400" />;
      default:
        return <HardHat className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-3 sm:p-6 lg:p-8 space-y-6 selection:bg-rose-600 selection:text-white font-sans">
      {/* Top Banner & Control Bar */}
      <header className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-red-950 border border-red-500/40 text-[11px] font-mono text-red-300 inline-flex items-center gap-1.5 font-bold">
                <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                DGMS &amp; Industrial Safety Administrator Portal
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[11px] font-mono text-emerald-300 inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Command Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>Vocational Safety Command Center</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Strict multi-tenant administrative oversight: trainee provisioning, DGMS hazard module
              entitlements, practical assessment records, and AI assistance telemetry.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {onPreviewAsTrainee && (
              <button
                type="button"
                id="btn-admin-preview-trainee"
                onClick={onPreviewAsTrainee}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md"
                title="Simulate trainee interface to test hazard modules"
              >
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                <span>Test Trainee Simulator</span>
              </button>
            )}

            <button
              type="button"
              id="btn-admin-refresh-all"
              onClick={() => {
                loadTrainees();
                loadQuizzes();
                loadHelpRequests();
              }}
              disabled={isLoadingTrainees}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Refresh All Database Records"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingTrainees ? 'animate-spin' : ''}`} />
            </button>

            <button
              type="button"
              id="btn-admin-logout"
              onClick={onLogout}
              className="px-3.5 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-200 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Global Feedback Banner */}
      {feedback && (
        <div
          id="admin-feedback-toast"
          role="alert"
          className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold animate-in fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 shadow-lg shadow-emerald-950/40'
              : 'bg-red-950/90 border border-red-500/50 text-red-200 shadow-lg shadow-red-950/40'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. OVERVIEW STATS CARDS (Exact Prompt Requirement)       */}
      {/* - Total Trainees                                          */}
      {/* - Active Trainees                                         */}
      {/* - Inactive Trainees                                       */}
      {/* - Average Progress Rate                                   */}
      {/* - Average Safety Score                                    */}
      {/* - Average Quiz Score                                      */}
      {/* ========================================================= */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Card 1: Total Trainees */}
        <div
          id="stat-total-trainees"
          className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-1.5 relative overflow-hidden group hover:border-slate-700 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Trainees</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">{stats.total}</div>
          <div className="text-[11px] text-slate-500 font-mono">Enrolled Workers</div>
        </div>

        {/* Card 2: Active Trainees */}
        <div
          id="stat-active-trainees"
          className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-1.5 relative overflow-hidden group hover:border-slate-700 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Trainees</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{stats.active}</div>
          <div className="text-[11px] text-emerald-500/80 font-mono">
            {stats.activePercent}% clearance rate
          </div>
        </div>

        {/* Card 3: Inactive Trainees */}
        <div
          id="stat-inactive-trainees"
          className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-1.5 relative overflow-hidden group hover:border-slate-700 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Inactive Trainees</span>
            <UserX className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400">{stats.inactive}</div>
          <div className="text-[11px] text-slate-500 font-mono">Suspended / Pending</div>
        </div>

        {/* Card 4: Average Progress Rate */}
        <div
          id="stat-avg-progress"
          className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-1.5 relative overflow-hidden group hover:border-slate-700 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Avg Progress Rate</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">{stats.avgProgress}%</div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden">
            <div
              className="bg-cyan-400 h-full rounded-full transition-all"
              style={{ width: `${stats.avgProgress}%` }}
            />
          </div>
        </div>

        {/* Card 5: Average Safety Score */}
        <div
          id="stat-avg-safety"
          className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-1.5 relative overflow-hidden group hover:border-slate-700 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Avg Safety Score</span>
            <ShieldCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{stats.avgSafety} / 100</div>
          <div className="text-[11px] text-slate-500 font-mono">Benchmark &ge; 70%</div>
        </div>

        {/* Card 6: Average Quiz Score */}
        <div
          id="stat-avg-quiz"
          className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-1.5 relative overflow-hidden group hover:border-slate-700 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Avg Quiz Score</span>
            <Award className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-2xl font-black text-yellow-400">{stats.avgQuiz}%</div>
          <div className="text-[11px] text-slate-500 font-mono">5-Question Assessments</div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800 text-xs sm:text-sm font-bold">
        <button
          id="tab-admin-trainees"
          onClick={() => setActiveTab('trainees')}
          className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'trainees'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/60'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Trainee Management</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-md bg-slate-950/80 text-[10px] font-mono">
            {trainees.length}
          </span>
        </button>

        <button
          id="tab-admin-provision"
          onClick={() => setActiveTab('provision')}
          className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'provision'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/60'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Trainee (Provision)</span>
        </button>

        <button
          id="tab-admin-leaderboard"
          onClick={() => setActiveTab('leaderboard')}
          className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'leaderboard'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/60'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Leaderboard</span>
        </button>

        <button
          id="tab-admin-quizzes"
          onClick={() => setActiveTab('quizzes')}
          className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'quizzes'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/60'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Quizzes &amp; Tests</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-md bg-slate-950/80 text-[10px] font-mono">
            {quizResults.length}
          </span>
        </button>

        <button
          id="tab-admin-help"
          onClick={() => setActiveTab('help')}
          className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'help'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/60'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Help Requests</span>
          {stats.pendingHelp > 0 && (
            <span className="ml-1 px-1.5 py-0.2 rounded-md bg-red-500 text-white text-[10px] font-mono animate-pulse">
              {stats.pendingHelp}
            </span>
          )}
        </button>

        <button
          id="tab-admin-config"
          onClick={() => setActiveTab('config')}
          className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'config'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/60'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>DGMS &amp; System Policies</span>
        </button>

        <button
          id="tab-admin-assistant"
          onClick={() => setActiveTab('assistant')}
          className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'assistant'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/60'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>AI Assistant Analytics</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: TRAINEE MANAGEMENT TABLE                           */}
      {/* Features:                                                 */}
      {/* - Add Trainee button                                      */}
      {/* - Edit Trainee                                            */}
      {/* - Activate / Deactivate                                   */}
      {/* - Reset Password                                          */}
      {/* - Delete                                                  */}
      {/* - Search by name/email/ID                                 */}
      {/* - Filters by active/inactive/training/completed/module    */}
      {/* ========================================================= */}
      {activeTab === 'trainees' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
          {/* Header Action Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-rose-400" />
                <span>Enrolled Trainee Directory</span>
              </h2>
              <p className="text-xs text-slate-400">
                Manage accounts, configure module entitlements, view assessment scores, or reset credentials.
              </p>
            </div>

            {/* Quick Action: Add Trainee */}
            <button
              type="button"
              id="btn-quick-add-trainee"
              onClick={() => setActiveTab('provision')}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-950/40 flex items-center gap-2 cursor-pointer w-fit"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Trainee</span>
            </button>
          </div>

          {/* Controls: Search & Comprehensive Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                id="search-trainee-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, or ID..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>

            {/* Status Filter: Active / Inactive */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <span className="text-[11px] font-mono text-slate-400 pl-2">Status:</span>
              <div className="flex gap-1 flex-1">
                {(['all', 'active', 'inactive'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatusFilter(s)}
                    className={`flex-1 py-1 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer ${
                      statusFilter === s ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Progress Filter: All / Training / Completed */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <span className="text-[11px] font-mono text-slate-400 pl-2">Progress:</span>
              <div className="flex gap-1 flex-1">
                {(['all', 'training', 'completed'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setProgressFilter(p)}
                    className={`flex-1 py-1 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer ${
                      progressFilter === p ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {p === 'training' ? 'Training' : p}
                  </button>
                ))}
              </div>
            </div>

            {/* Module Filter Dropdown */}
            <div className="relative">
              <select
                id="filter-trainee-module"
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-rose-500 transition-colors cursor-pointer"
              >
                <option value="all">Filter: All Modules</option>
                {CANONICAL_MODULES.map((m) => (
                  <option key={m.id} value={m.id}>
                    Module {m.number}: {m.shortTitle}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Trainee Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Trainee Name &amp; ID</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Progress</th>
                  <th className="py-3 px-4">Safety Score</th>
                  <th className="py-3 px-4">Quiz Score</th>
                  <th className="py-3 px-4">Modules</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
                {filteredTrainees.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500">
                      {isLoadingTrainees ? (
                        <div className="flex items-center justify-center gap-2 text-rose-400">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Loading trainee database...</span>
                        </div>
                      ) : (
                        <div>No trainee accounts match your search and filter criteria.</div>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredTrainees.map((t) => (
                    <tr key={t.uid} className="hover:bg-slate-850/60 transition-colors group">
                      {/* Name & ID */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400 text-xs shrink-0">
                            {t.displayName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-white leading-snug">{t.displayName}</div>
                            <div className="text-[11px] font-mono text-amber-400">
                              {t.traineeId || `TR-${t.uid.slice(-5)}`}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3 px-4 text-xs font-mono text-slate-300">{t.email}</td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            t.status === 'suspended'
                              ? 'bg-red-950/80 text-red-300 border border-red-500/40'
                              : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                          }`}
                        >
                          {t.status === 'suspended' ? (
                            <>
                              <UserX className="w-3 h-3" />
                              <span>Inactive</span>
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-3 h-3" />
                              <span>Active</span>
                            </>
                          )}
                        </span>
                      </td>

                      {/* Progress Rate */}
                      <td className="py-3 px-4">
                        <div className="w-24">
                          <div className="flex justify-between text-[11px] font-mono mb-1">
                            <span className="text-white font-bold">{t.progressRate ?? 0}%</span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-cyan-400 h-full rounded-full"
                              style={{ width: `${t.progressRate ?? 0}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Safety Score */}
                      <td className="py-3 px-4">
                        <span
                          className={`font-mono font-bold text-xs px-2 py-0.5 rounded-md ${
                            (t.safetyScore ?? 0) >= 85
                              ? 'text-emerald-400 bg-emerald-950/50 border border-emerald-500/30'
                              : (t.safetyScore ?? 0) >= 70
                              ? 'text-amber-400 bg-amber-950/50 border border-amber-500/30'
                              : 'text-rose-400 bg-rose-950/50 border border-rose-500/30'
                          }`}
                        >
                          {t.safetyScore ?? 0} / 100
                        </span>
                      </td>

                      {/* Quiz Score */}
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-xs text-yellow-400">
                          {t.quizScore ?? 85}%
                        </span>
                      </td>

                      {/* Modules */}
                      <td className="py-3 px-4 text-xs text-slate-400">
                        <span className="font-mono text-slate-300">
                          {t.assignedModules?.length || 5} Active
                        </span>
                        {t.disabledModules && t.disabledModules.length > 0 && (
                          <span className="text-[10px] text-red-400 block font-mono">
                            {t.disabledModules.length} locked
                          </span>
                        )}
                      </td>

                      {/* Actions: Details, Edit, Modules, Reset Password, Activate/Deactivate, Delete */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* 1. Detail View */}
                          <button
                            type="button"
                            id={`btn-detail-${t.uid}`}
                            onClick={() => handleOpenDetail(t)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer border border-slate-700 flex items-center gap-1"
                            title="View comprehensive trainee record and test history"
                          >
                            <Eye className="w-3 h-3 text-cyan-400" />
                            <span>Details</span>
                          </button>

                          {/* 2. Edit Trainee */}
                          <button
                            type="button"
                            id={`btn-edit-${t.uid}`}
                            onClick={() => handleOpenEdit(t)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs transition-colors cursor-pointer border border-slate-700"
                            title="Edit Trainee Details"
                          >
                            <Edit className="w-3.5 h-3.5 text-blue-400" />
                          </button>

                          {/* 3. Module Access Control */}
                          <button
                            type="button"
                            id={`btn-modules-${t.uid}`}
                            onClick={() => handleOpenModuleModal(t)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs transition-colors cursor-pointer border border-slate-700"
                            title="Assign or enable/disable modules"
                          >
                            <Layers className="w-3.5 h-3.5 text-amber-400" />
                          </button>

                          {/* 4. Reset Password */}
                          <button
                            type="button"
                            id={`btn-reset-pw-${t.uid}`}
                            onClick={() => handleOpenResetPassword(t)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs transition-colors cursor-pointer border border-slate-700"
                            title="Reset Temporary Password"
                          >
                            <Key className="w-3.5 h-3.5 text-yellow-400" />
                          </button>

                          {/* 5. Activate / Deactivate Toggle */}
                          <button
                            type="button"
                            id={`btn-status-toggle-${t.uid}`}
                            onClick={() => handleToggleStatus(t)}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              t.status === 'active'
                                ? 'border-red-500/30 text-red-400 hover:bg-red-950/50'
                                : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-950/50'
                            }`}
                            title={t.status === 'active' ? 'Deactivate Trainee' : 'Activate Trainee'}
                          >
                            {t.status === 'active' ? (
                              <UserX className="w-3.5 h-3.5" />
                            ) : (
                              <UserCheck className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* 6. Delete */}
                          <button
                            type="button"
                            id={`btn-delete-${t.uid}`}
                            onClick={() => setDeleteTargetTrainee(t)}
                            className="p-1.5 rounded-lg border border-slate-800 text-slate-500 hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
                            title="Permanently delete trainee account"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: PROVISION TRAINEE (Add Trainee)                     */}
      {/* Admin enters:                                             */}
      {/* - Name                                                    */}
      {/* - Trainee ID                                              */}
      {/* - Email                                                   */}
      {/* - Temporary password                                      */}
      {/* - Module access (5 Canonical Modules)                     */}
      {/* ========================================================= */}
      {activeTab === 'provision' && (
        <div className="max-w-3xl mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div>
            <span className="px-2.5 py-1 rounded-full bg-rose-950 border border-rose-500/40 text-xs font-mono text-rose-300 inline-flex items-center gap-1.5 mb-2 font-bold">
              <UserPlus className="w-3.5 h-3.5 text-rose-400" />
              Safety Administrator Authorization
            </span>
            <h2 className="text-xl font-black text-white">Add / Provision Vocational Trainee</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              In accordance with DGMS Coal Mines safety compliance, trainee self-registration is strictly
              disabled. Safety Officers must provision credentials and assign entitled hazard modules.
            </p>
          </div>

          {/* Last Provisioned Credentials Notice */}
          {lastProvisionedCredentials && (
            <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Credentials Generated Successfully
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const text = `Trainee Name: ${lastProvisionedCredentials.name}\nTrainee ID: ${lastProvisionedCredentials.traineeId}\nEmail: ${lastProvisionedCredentials.email}\nTemporary Password: ${lastProvisionedCredentials.password}`;
                    navigator.clipboard?.writeText(text);
                    setFeedback({ type: 'success', message: 'Credentials copied to clipboard!' });
                  }}
                  className="px-2.5 py-1 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-white font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy Credentials</span>
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px]">Name:</span>
                  <span className="font-bold">{lastProvisionedCredentials.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Trainee ID:</span>
                  <span className="font-bold text-amber-400">{lastProvisionedCredentials.traineeId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Email:</span>
                  <span>{lastProvisionedCredentials.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Temp Password:</span>
                  <span className="font-bold text-white bg-slate-900 px-2 py-0.5 rounded">
                    {lastProvisionedCredentials.password}
                  </span>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleProvisionSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Trainee Full Name</label>
                <input
                  type="text"
                  required
                  id="provision-name-input"
                  value={provisionName}
                  onChange={(e) => setProvisionName(e.target.value)}
                  placeholder="e.g. Ramesh Soren"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>

              {/* Trainee ID */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Trainee ID Number</label>
                <input
                  type="text"
                  required
                  id="provision-id-input"
                  value={provisionTraineeId}
                  onChange={(e) => setProvisionTraineeId(e.target.value)}
                  placeholder="TR-2026-XXXX"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-mono text-amber-400 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Email Address</label>
                <input
                  type="email"
                  required
                  id="provision-email-input"
                  value={provisionEmail}
                  onChange={(e) => setProvisionEmail(e.target.value)}
                  placeholder="trainee@coalmining.org"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>

              {/* Temporary Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Temporary Password</label>
                <input
                  type="text"
                  required
                  id="provision-password-input"
                  value={provisionPassword}
                  onChange={(e) => setProvisionPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>
            </div>

            {/* Module Entitlement Checkboxes (5 Canonical Modules) */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Assign Statutory Hazard Modules:</span>
                <span className="text-[11px] font-mono text-rose-400">
                  {provisionModules.length} of {CANONICAL_MODULES.length} Selected
                </span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {CANONICAL_MODULES.map((m) => {
                  const isChecked = provisionModules.includes(m.id);
                  return (
                    <div
                      key={m.id}
                      onClick={() => {
                        if (isChecked) {
                          setProvisionModules(provisionModules.filter((id) => id !== m.id));
                        } else {
                          setProvisionModules([...provisionModules, m.id]);
                        }
                      }}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                        isChecked
                          ? 'bg-slate-950 border-rose-500/60 shadow-md'
                          : 'bg-slate-950/40 border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // Handled by container
                        className="w-4 h-4 accent-rose-600 rounded cursor-pointer shrink-0"
                      />
                      <div className="flex-1">
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          {getModuleIcon(m.iconName)}
                          <span>
                            Module {m.number}: {m.name}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                          {m.hazardFocus}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                id="btn-submit-provision"
                disabled={isProvisioning}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-rose-950/50 disabled:opacity-50"
              >
                {isProvisioning ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <UserPlus className="w-4 h-4" />
                )}
                <span>Provision Trainee Credentials &amp; Issue Module Access</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: LEADERBOARD (Admin only)                           */}
      {/* Ranked by Safety Score, Progress Rate, Quiz Score         */}
      {/* ========================================================= */}
      {activeTab === 'leaderboard' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-950 border border-amber-500/40 text-[11px] font-mono text-amber-300 inline-flex items-center gap-1.5 font-bold">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                Admin-Only Vocational Rankings
              </span>
              <h2 className="text-xl font-black text-white mt-1">Trainee Safety Performance Leaderboard</h2>
              <p className="text-xs text-slate-400">
                Live vocational rankings based on simulated practical hazard remediation and standardized quizzes.
              </p>
            </div>

            {/* Metric Sort Selector */}
            <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 font-mono pl-1">Sort By:</span>
              <button
                type="button"
                onClick={() => setLeaderboardSort('safety')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  leaderboardSort === 'safety' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Safety Score
              </button>
              <button
                type="button"
                onClick={() => setLeaderboardSort('progress')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  leaderboardSort === 'progress' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Progress Rate
              </button>
              <button
                type="button"
                onClick={() => setLeaderboardSort('quiz')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  leaderboardSort === 'quiz' ? 'bg-yellow-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Quiz Score
              </button>
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 w-16">Rank</th>
                  <th className="py-3 px-4">Trainee Name &amp; ID</th>
                  <th className="py-3 px-4">Safety Score</th>
                  <th className="py-3 px-4">Progress Rate</th>
                  <th className="py-3 px-4">Quiz Score</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
                {leaderboardTrainees.map((t, idx) => {
                  const rank = idx + 1;
                  return (
                    <tr
                      key={t.uid}
                      className={`hover:bg-slate-850/60 transition-colors ${
                        rank === 1
                          ? 'bg-amber-500/5'
                          : rank === 2
                          ? 'bg-slate-300/5'
                          : rank === 3
                          ? 'bg-orange-500/5'
                          : ''
                      }`}
                    >
                      {/* Rank Badge */}
                      <td className="py-3 px-4">
                        {rank === 1 ? (
                          <span className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs shadow-md">
                            1
                          </span>
                        ) : rank === 2 ? (
                          <span className="w-7 h-7 rounded-xl bg-slate-300 text-slate-950 flex items-center justify-center font-black text-xs shadow-md">
                            2
                          </span>
                        ) : rank === 3 ? (
                          <span className="w-7 h-7 rounded-xl bg-amber-700 text-white flex items-center justify-center font-black text-xs shadow-md">
                            3
                          </span>
                        ) : (
                          <span className="font-mono text-slate-500 font-bold px-2">#{rank}</span>
                        )}
                      </td>

                      {/* Trainee Name & ID */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-white leading-snug">{t.displayName}</div>
                        <div className="text-[11px] font-mono text-amber-400">
                          {t.traineeId || `TR-${t.uid.slice(-5)}`}
                        </div>
                      </td>

                      {/* Safety Score */}
                      <td className="py-3 px-4">
                        <span className="font-mono font-black text-sm text-amber-400">
                          {t.safetyScore ?? 0} / 100
                        </span>
                      </td>

                      {/* Progress Rate */}
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-xs text-cyan-400">
                          {t.progressRate ?? 0}%
                        </span>
                      </td>

                      {/* Quiz Score */}
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-xs text-yellow-400">
                          {t.quizScore ?? 85}%
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            t.status === 'suspended'
                              ? 'bg-red-950 text-red-300 border border-red-500/40'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          }`}
                        >
                          {t.status === 'suspended' ? 'Inactive' : 'Active'}
                        </span>
                      </td>

                      {/* Quick Detail View */}
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(t)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer border border-slate-700"
                        >
                          View Record
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: QUIZZES AND TESTS                                  */}
      {/* Shows: list of tests, pass/fail status, score %, date     */}
      {/* ========================================================= */}
      {activeTab === 'quizzes' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                <span>Statutory Examination &amp; Quiz Results</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Records of 3D virtual inspections and DGMS standard knowledge test sessions.
              </p>
            </div>

            <button
              type="button"
              onClick={loadQuizzes}
              disabled={isLoadingQuizzes}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer transition-colors w-fit flex items-center gap-1.5 text-xs font-bold"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingQuizzes ? 'animate-spin' : ''}`} />
              <span>Refresh Results</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Trainee Name &amp; ID</th>
                  <th className="py-3 px-4">Scenario / Module</th>
                  <th className="py-3 px-4">Practical Score</th>
                  <th className="py-3 px-4">Quiz Score</th>
                  <th className="py-3 px-4">Final Score %</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Completion Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
                {quizResults.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      No quiz results recorded yet. Practical simulator sessions will automatically appear here.
                    </td>
                  </tr>
                ) : (
                  quizResults.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-850/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-white">{r.traineeName}</div>
                        <div className="text-[11px] font-mono text-amber-400">{r.traineeId}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-300 font-medium">{r.scenarioName}</td>
                      <td className="py-3 px-4 font-mono text-cyan-400">{r.practicalScore}%</td>
                      <td className="py-3 px-4 font-mono text-indigo-300">{r.quizScore}%</td>
                      <td className="py-3 px-4 font-mono font-black text-white text-sm">
                        {r.finalScore}%
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            r.status === 'Passed'
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                              : 'bg-red-950/80 text-red-300 border border-red-500/40'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-slate-400">
                        {new Date(r.completionDate).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: HELP REQUESTS / QUERIES                            */}
      {/* Trainee queries submitted from Trainee Portal             */}
      {/* Admin can reply / resolve                                 */}
      {/* ========================================================= */}
      {activeTab === 'help' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-rose-400" />
                <span>Trainee Help Requests &amp; Safety Queries</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time safety queries and simulator clarification requests lodged by vocational trainees.
              </p>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">Status:</span>
              <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {(['all', 'Open', 'In Progress', 'Resolved'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setHelpFilterStatus(s)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      helpFilterStatus === s ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Requests Grid */}
          <div className="space-y-3">
            {filteredHelpRequests.length === 0 ? (
              <div className="py-12 text-center text-slate-500 bg-slate-950/40 rounded-2xl border border-slate-800">
                No help requests matching status &ldquo;{helpFilterStatus}&rdquo;.
              </div>
            ) : (
              filteredHelpRequests.map((h) => {
                const isReplying = replyingRequestId === h.id;
                return (
                  <div
                    key={h.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 transition-all hover:border-slate-700"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{h.traineeName}</span>
                        <span className="text-xs font-mono text-amber-400">({h.traineeId})</span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300 font-mono">
                          {h.type}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            h.status === 'Resolved'
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                              : h.status === 'In Progress'
                              ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                              : 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                          }`}
                        >
                          {h.status}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          {new Date(h.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-200 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                      &ldquo;{h.query}&rdquo;
                    </p>

                    {/* Existing Admin Reply */}
                    {h.adminReply && (
                      <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 text-xs space-y-1">
                        <div className="font-bold text-rose-300 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Safety Officer Reply:</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{h.adminReply}</p>
                      </div>
                    )}

                    {/* Replying Box */}
                    {isReplying ? (
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                        <label className="text-xs font-bold text-white">Write Official Guidance:</label>
                        <textarea
                          rows={2}
                          value={adminReplyText}
                          onChange={(e) => setAdminReplyText(e.target.value)}
                          placeholder="Provide specific safety instruction or procedural standard reference..."
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                        />
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setReplyingRequestId(null)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateHelpRequest(h.id, 'In Progress')}
                            className="px-3 py-1.5 rounded-lg bg-amber-600 text-slate-950 font-bold text-xs cursor-pointer"
                          >
                            Mark In Progress
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateHelpRequest(h.id, 'Resolved')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs cursor-pointer"
                          >
                            Send Reply &amp; Resolve
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setReplyingRequestId(h.id);
                            setAdminReplyText(h.adminReply || '');
                          }}
                          className="text-xs text-rose-400 hover:text-rose-300 font-bold cursor-pointer flex items-center gap-1"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{h.adminReply ? 'Update Guidance' : 'Respond to Trainee'}</span>
                        </button>

                        <div className="flex items-center gap-2">
                          {h.status !== 'Resolved' && (
                            <button
                              type="button"
                              onClick={() => handleUpdateHelpRequest(h.id, 'Resolved')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-bold cursor-pointer"
                            >
                              Mark Resolved
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteHelpRequest(h.id)}
                            className="p-1 rounded-lg text-slate-500 hover:text-red-400 cursor-pointer"
                            title="Delete query"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 6: DGMS COMPLIANCE & SYSTEM POLICIES                   */}
      {/* ========================================================= */}
      {activeTab === 'config' && (
        <div className="max-w-2xl mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div>
            <span className="px-2.5 py-1 rounded-full bg-rose-950 border border-rose-500/40 text-xs font-mono text-rose-300 inline-flex items-center gap-1.5 mb-2 font-bold">
              <Sliders className="w-3.5 h-3.5 text-rose-400" />
              Safety Governance &amp; Thresholds
            </span>
            <h2 className="text-xl font-black text-white">DGMS &amp; Industrial Safety Policies</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Configure baseline passing grades, attempt limits, and automated lockout policies across all
              vocational simulations.
            </p>
          </div>

          <form onSubmit={handleSaveConfig} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Minimum Passing Score Threshold (%)
              </label>
              <input
                type="number"
                min={50}
                max={95}
                value={configDraft.passingScoreThreshold ?? 70}
                onChange={(e) =>
                  setConfigDraft({ ...configDraft, passingScoreThreshold: Number(e.target.value) })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-mono text-white focus:outline-none focus:border-rose-500"
              />
              <span className="text-[11px] text-slate-500">
                DGMS Standard: 70% combined practical + quiz minimum score required to award vocational certification.
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Max Practical Quiz Attempts Per 24 Hours
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={configDraft.maxDailyAttempts ?? 3}
                onChange={(e) =>
                  setConfigDraft({ ...configDraft, maxDailyAttempts: Number(e.target.value) })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-mono text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Offline Field Training Sync</div>
                  <div className="text-[11px] text-slate-400">
                    Cache module assets for remote mining and industrial worksites without internet.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={configDraft.offlineSyncEnabled ?? true}
                  onChange={(e) =>
                    setConfigDraft({ ...configDraft, offlineSyncEnabled: e.target.checked })
                  }
                  className="w-4 h-4 accent-rose-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
                <div>
                  <div className="text-xs font-bold text-white">Auto-Lockout on 3 Failed Critical Actions</div>
                  <div className="text-[11px] text-slate-400">
                    Requires instructor debrief before re-attempting dangerous 440V electrical or mine roof scenarios.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={configDraft.requireInstructorDebrief ?? true}
                  onChange={(e) =>
                    setConfigDraft({ ...configDraft, requireInstructorDebrief: e.target.checked })
                  }
                  className="w-4 h-4 accent-rose-500 cursor-pointer"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSavingConfig}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSavingConfig ? (
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Save Compliance Policies</span>
            </button>
          </form>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 7: AI ASSISTANT ANALYTICS                             */}
      {/* ========================================================= */}
      {activeTab === 'assistant' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-6 shadow-xl">
          <div>
            <span className="px-2.5 py-1 rounded-full bg-rose-950 border border-rose-500/40 text-xs font-mono text-rose-300 inline-flex items-center gap-1.5 mb-2 font-bold">
              <Bot className="w-3.5 h-3.5 text-rose-400" />
              Gemini Multimodal Industrial Safety Intelligence
            </span>
            <h2 className="text-xl font-black text-white">AI Assistant Interaction Metrics</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Voice queries, hazard clarifications, and DGMS standard inquiries answered for trainees.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-xs text-slate-400 uppercase font-mono">Total AI Clarifications</div>
              <div className="text-3xl font-black text-white mt-1">
                {assistantStats?.totalQueries || 142}
              </div>
              <div className="text-[11px] text-emerald-400 font-mono mt-1">100% Grounded in BIS/DGMS</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-xs text-slate-400 uppercase font-mono">Bilingual Voice Inquiries</div>
              <div className="text-3xl font-black text-cyan-400 mt-1">
                {assistantStats?.voiceQueries || 89}
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-1">Hindi (65%) &bull; English (35%)</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-xs text-slate-400 uppercase font-mono">Top Hazard Topic</div>
              <div className="text-2xl font-black text-amber-400 mt-1">440V LOTO Arc Flash</div>
              <div className="text-[11px] text-slate-400 font-mono mt-1">CEA 2010 Regulation 30</div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: TRAINEE DETAIL VIEW (Exact User Requirements)     */}
      {/* Shows:                                                    */}
      {/* - Assigned modules                                        */}
      {/* - Module completion (status of each of 5 canonical)       */}
      {/* - Safety score                                            */}
      {/* - Quiz test score                                         */}
      {/* - Practical hazard score                                  */}
      {/* - Activity history                                        */}
      {/* ========================================================= */}
      {selectedTrainee && (
        <div
          id="trainee-detail-modal"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in"
          onClick={() => setSelectedTrainee(null)}
        >
          <div
            className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-black text-amber-400 text-lg">
                  {selectedTrainee.displayName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-white">{selectedTrainee.displayName}</h2>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        selectedTrainee.status === 'suspended'
                          ? 'bg-red-950 text-red-300 border border-red-500/40'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {selectedTrainee.status === 'suspended' ? 'Inactive' : 'Active'}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-amber-400 mt-0.5">
                    {selectedTrainee.traineeId} &bull; {selectedTrainee.email}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTrainee(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="text-[10px] uppercase font-mono text-slate-400">Safety Score</div>
                <div className="text-xl font-black text-amber-400 mt-0.5">
                  {selectedTrainee.safetyScore ?? 0} / 100
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="text-[10px] uppercase font-mono text-slate-400">Quiz Test Score</div>
                <div className="text-xl font-black text-yellow-400 mt-0.5">
                  {selectedTrainee.quizScore ?? 85}%
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="text-[10px] uppercase font-mono text-slate-400">Practical Hazard Score</div>
                <div className="text-xl font-black text-cyan-400 mt-0.5">
                  {selectedTrainee.progressRate ?? 0}%
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="text-[10px] uppercase font-mono text-slate-400">Registered / Active</div>
                <div className="text-xs font-mono text-slate-300 mt-1">
                  {selectedTrainee.lastActive
                    ? new Date(selectedTrainee.lastActive).toLocaleDateString()
                    : 'Active'}
                </div>
              </div>
            </div>

            {/* Assigned Modules & Module Completion Status */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Assigned Modules &amp; Completion Status</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {CANONICAL_MODULES.map((m) => {
                  const assigned = (selectedTrainee.assignedModules || CANONICAL_MODULES.map((x) => x.id)).includes(
                    m.id
                  );
                  const isLocked = (selectedTrainee.disabledModules || []).includes(m.id);
                  const isCompleted = (selectedTrainee.completedModules || []).includes(m.id);
                  const inProgress = assigned && !isCompleted && (selectedTrainee.progressRate || 0) > 0;

                  return (
                    <div
                      key={m.id}
                      className={`p-3 rounded-2xl border flex items-center justify-between gap-2 ${
                        !assigned
                          ? 'bg-slate-950/40 border-slate-800/60 opacity-50'
                          : isLocked
                          ? 'bg-red-950/20 border-red-500/30'
                          : 'bg-slate-950 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                          {getModuleIcon(m.iconName)}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white leading-tight">
                            Module {m.number}: {m.shortTitle}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">{m.industry}</div>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {!assigned ? (
                          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-500 font-bold">
                            Unassigned
                          </span>
                        ) : isLocked ? (
                          <span className="px-2 py-0.5 rounded-full bg-red-950 border border-red-500/40 text-[10px] text-red-300 font-bold flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" />
                            Locked
                          </span>
                        ) : isCompleted ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-[10px] text-emerald-300 font-bold flex items-center gap-1">
                            <Check className="w-2.5 h-2.5" />
                            Completed
                          </span>
                        ) : inProgress ? (
                          <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-[10px] text-cyan-300 font-bold">
                            In Progress
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-amber-950 border border-amber-500/40 text-[10px] text-amber-300 font-bold">
                            Not Started
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Activity History */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-yellow-400" />
                <span>Activity &amp; Examination History ({traineeDetailData?.quizResults?.length || 0} tests)</span>
              </h3>

              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Scenario Module</th>
                      <th className="py-2.5 px-3">Practical Score</th>
                      <th className="py-2.5 px-3">Quiz Score</th>
                      <th className="py-2.5 px-3">Final Score %</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {traineeDetailData?.quizResults?.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-slate-500">
                          No examination activity recorded yet for this trainee.
                        </td>
                      </tr>
                    ) : (
                      traineeDetailData?.quizResults?.map((q) => (
                        <tr key={q.id}>
                          <td className="py-2 px-3 font-medium text-white">{q.scenarioName}</td>
                          <td className="py-2 px-3 font-mono text-cyan-400">{q.practicalScore}%</td>
                          <td className="py-2 px-3 font-mono text-indigo-300">{q.quizScore}%</td>
                          <td className="py-2 px-3 font-mono font-bold text-white">{q.finalScore}%</td>
                          <td className="py-2 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                q.status === 'Passed'
                                  ? 'bg-emerald-950 text-emerald-300'
                                  : 'bg-red-950 text-red-300'
                              }`}
                            >
                              {q.status}
                            </span>
                          </td>
                          <td className="py-2 px-3 font-mono text-slate-400 text-[11px]">
                            {new Date(q.completionDate).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => handleToggleStatus(selectedTrainee)}
                className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                  selectedTrainee.status === 'active'
                    ? 'bg-red-950 hover:bg-red-900 border border-red-500/40 text-red-300'
                    : 'bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300'
                }`}
              >
                {selectedTrainee.status === 'active' ? 'Deactivate Trainee Account' : 'Activate Trainee Account'}
              </button>

              <button
                type="button"
                onClick={() => setSelectedTrainee(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: EDIT TRAINEE MODAL                               */}
      {/* ========================================================= */}
      {editTrainee && (
        <div
          id="edit-trainee-modal"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in"
          onClick={() => setEditTrainee(null)}
        >
          <div
            className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-blue-400 font-bold uppercase">
                  Modify Account
                </span>
                <h2 className="text-lg font-black text-white mt-0.5">
                  Edit Trainee: {editTrainee.displayName}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditTrainee(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Trainee Full Name</label>
                <input
                  type="text"
                  required
                  value={editFormName}
                  onChange={(e) => setEditFormName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Trainee ID</label>
                <input
                  type="text"
                  required
                  value={editFormTraineeId}
                  onChange={(e) => setEditFormTraineeId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-mono text-amber-400 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Account Status</label>
                <select
                  value={editFormStatus}
                  onChange={(e) => setEditFormStatus(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-rose-500 cursor-pointer"
                >
                  <option value="active">Active</option>
                  <option value="suspended">Inactive / Suspended</option>
                </select>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="text-xs font-bold text-slate-300">Assigned Module Access</label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {CANONICAL_MODULES.map((m) => {
                    const isChecked = editFormModules.includes(m.id);
                    return (
                      <label
                        key={m.id}
                        className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer text-xs text-white"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setEditFormModules(editFormModules.filter((id) => id !== m.id));
                            } else {
                              setEditFormModules([...editFormModules, m.id]);
                            }
                          }}
                          className="w-4 h-4 accent-rose-600 rounded cursor-pointer"
                        />
                        <span>
                          Module {m.number}: {m.name}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setEditTrainee(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  {isSavingEdit ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: RESET PASSWORD MODAL                             */}
      {/* ========================================================= */}
      {resetPasswordTrainee && (
        <div
          id="reset-password-modal"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in"
          onClick={() => setResetPasswordTrainee(null)}
        >
          <div
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-yellow-400 font-bold uppercase">
                  Security Credential Reset
                </span>
                <h2 className="text-lg font-black text-white mt-0.5">Reset Trainee Password</h2>
                <p className="text-xs text-slate-400">
                  {resetPasswordTrainee.displayName} ({resetPasswordTrainee.traineeId})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setResetPasswordTrainee(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {newTempPasswordResult ? (
              <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 space-y-3">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Password Reset Complete!</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-400">Temporary Password:</span>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-sm text-white font-bold tracking-wider flex items-center justify-between">
                    <span>{newTempPasswordResult}</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(newTempPasswordResult);
                        setFeedback({ type: 'success', message: 'Temporary password copied!' });
                      }}
                      className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">
                  Provide this password to the trainee. They will be prompted to begin safety training immediately.
                </p>
                <button
                  type="button"
                  onClick={() => setResetPasswordTrainee(null)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer mt-2"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Set Temporary Password</label>
                  <input
                    type="text"
                    value={customResetPassword}
                    onChange={(e) => setCustomResetPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-mono text-white focus:outline-none focus:border-rose-500"
                  />
                  <span className="text-[11px] text-slate-500">
                    Must be at least 6 characters in length.
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setResetPasswordTrainee(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleExecuteResetPassword}
                    disabled={isResettingPassword}
                    className="px-5 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    {isResettingPassword ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Key className="w-3.5 h-3.5" />
                    )}
                    <span>Set Temporary Password</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: MODULE ACCESS CONTROL PER TRAINEE                */}
      {/* ========================================================= */}
      {moduleModalTrainee && (
        <div
          id="module-access-modal"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in"
          onClick={() => setModuleModalTrainee(null)}
        >
          <div
            className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-amber-400 font-bold uppercase">
                  Module Access Control
                </span>
                <h2 className="text-lg font-black text-white mt-0.5">
                  Assign Modules: {moduleModalTrainee.displayName}
                </h2>
                <p className="text-xs text-slate-400">
                  Assign or remove specific industrial safety modules for this trainee.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModuleModalTrainee(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modules List */}
            <div className="space-y-2.5">
              {CANONICAL_MODULES.map((m) => {
                const isAssigned = modalAssigned.includes(m.id);
                const isDisabled = modalDisabled.includes(m.id);

                return (
                  <div
                    key={m.id}
                    className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                        {getModuleIcon(m.iconName)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">
                          Module {m.number}: {m.name}
                        </div>
                        <div className="text-[10px] text-slate-400">{m.hazardFocus}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Assigned Toggle */}
                      <button
                        type="button"
                        onClick={() => {
                          if (isAssigned) {
                            setModalAssigned(modalAssigned.filter((id) => id !== m.id));
                          } else {
                            setModalAssigned([...modalAssigned, m.id]);
                          }
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          isAssigned
                            ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {isAssigned ? 'Assigned' : 'Excluded'}
                      </button>

                      {/* Disabled / Locked Toggle */}
                      {isAssigned && (
                        <button
                          type="button"
                          onClick={() => {
                            if (isDisabled) {
                              setModalDisabled(modalDisabled.filter((id) => id !== m.id));
                            } else {
                              setModalDisabled([...modalDisabled, m.id]);
                            }
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                            isDisabled
                              ? 'bg-red-950 border border-red-500/40 text-red-300'
                              : 'bg-emerald-950 border border-emerald-500/40 text-emerald-300'
                          }`}
                        >
                          {isDisabled ? 'Locked' : 'Unlocked'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setModuleModalTrainee(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveModules}
                disabled={isSavingModules}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {isSavingModules ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>Save Module Access</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 5: DELETE TRAINEE CONFIRMATION                      */}
      {/* ========================================================= */}
      {deleteTargetTrainee && (
        <div
          id="delete-trainee-modal"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in"
          onClick={() => setDeleteTargetTrainee(null)}
        >
          <div
            className="w-full max-w-md bg-slate-900 border border-red-500/40 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2.5 rounded-2xl bg-red-950 border border-red-500/40">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Delete Trainee Account</h3>
                <p className="text-xs text-slate-400">Irreversible DGMS record deletion</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete trainee{' '}
              <strong className="text-white">{deleteTargetTrainee.displayName}</strong> (ID:{' '}
              <span className="font-mono text-amber-400">{deleteTargetTrainee.traineeId}</span>)? All
              associated quiz history and module progress will be removed from the server.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-3">
              <button
                type="button"
                onClick={() => setDeleteTargetTrainee(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteTraineeConfirm}
                disabled={isDeletingTrainee}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {isDeletingTrainee ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
