import React, { useState, useEffect } from 'react';
import { ProjectHeader } from './components/ProjectHeader';
import { ARSimulator } from './components/ARSimulator';
import { AccessibilityBar } from './components/AccessibilityBar';
import { LanguageSelectionModal } from './components/LanguageSelectionModal';
import { SafetyGlossaryModal } from './components/SafetyGlossaryModal';
import { SplashScreenModal } from './components/SplashScreenModal';
import { AuthScreen } from './components/AuthScreen';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthService } from './services/authService';
import { SupportedLanguage, AccessibilityConfig, AuthUser, TraineeProfile } from './types';
import {
  loadAccessibilityConfig,
  saveAccessibilityConfig,
  speakVoiceGuidance,
  t
} from './services/localizationService';
import {
  Home,
  HardHat,
  Factory,
  Camera,
  Award,
  ArrowLeft,
  Clapperboard,
  Bot,
  ShieldAlert,
  Lock,
  ExternalLink,
  RotateCcw,
  HelpCircle
} from 'lucide-react';
import { AISafetyAssistant } from './components/AISafetyAssistant';
import { AnimatedSafetyModal } from './components/animated/AnimatedSafetyModal';
import { VirtualSafetyModule } from './components/virtual/VirtualSafetyModule';
import { TraineeDoubtModal } from './components/TraineeDoubtModal';

// Vocational training page components
import { TraineeHomeDashboard } from './components/pages/TraineeHomeDashboard';
import { SafetyScenariosPage } from './components/pages/SafetyScenariosPage';
import { ScenarioPPEPage } from './components/pages/ScenarioPPEPage';
import { ScenarioModuleIntroPage } from './components/pages/ScenarioModuleIntroPage';
import { AIHazardCheckPage } from './components/pages/AIHazardCheckPage';
import { MyProgressPage } from './components/pages/MyProgressPage';

const LANGUAGE_STORAGE_KEY = 'sih26041_training_language';
const LANGUAGE_SELECTED_KEY = 'sih26041_language_selected';
const SPLASH_SEEN_KEY = 'surakshaar_splash_seen';

export type NavigationPage =
  | 'home'
  | 'scenarios'
  | 'scenario-ppe'
  | 'scenario-intro'
  | 'ar-simulation'
  | 'virtual-env'
  | 'ai-hazard-check'
  | 'my-progress'
  | 'admin'
  | 'unauthorized'
  | 'module-unassigned';

export default function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    return AuthService.getStoredUser();
  });

  const [currentPage, setCurrentPage] = useState<NavigationPage>('home');
  const [adminPreviewMode, setAdminPreviewMode] = useState<boolean>(false);

  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('scenario-1-ppe');
  const [showSplashScreen, setShowSplashScreen] = useState<boolean>(() => {
    try {
      return localStorage.getItem(SPLASH_SEEN_KEY) !== 'true';
    } catch {
      return false;
    }
  });

  // Trainee Profile for simple progress tracking
  const [traineeProfile, setTraineeProfile] = useState<TraineeProfile>(() => {
    const defaultProfile: TraineeProfile = {
      id: 'TR-2024-88',
      name: 'Ramesh Soren',
      affiliation: 'Mining & Metallurgical Safety',
      xp: 420,
      level: 2,
      levelTitle: 'Certified Safety Trainee',
      currentStreak: 4,
      bestStreak: 4,
      lastActiveDate: new Date().toISOString(),
      unlockedAchievements: ['first-training', 'hazard-hunter'],
      completedScenarioIds: ['scenario-1-ppe'],
      bestScores: { 'scenario-1-ppe': 85 }
    };
    try {
      const raw = localStorage.getItem('sih26041_trainee_profile');
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...defaultProfile,
          ...parsed,
          completedScenarioIds: Array.isArray(parsed?.completedScenarioIds)
            ? parsed.completedScenarioIds
            : ['scenario-1-ppe'],
          bestScores: parsed?.bestScores || { 'scenario-1-ppe': 85 }
        };
      }
    } catch {}
    return defaultProfile;
  });

  // Verify stored session on mount & subscribe to auth changes
  useEffect(() => {
    AuthService.checkSession().then((user) => {
      if (user) {
        setCurrentUser(user);
      }
    });

    const unsubscribe = AuthService.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  // Hash-based route listener to enforce strict access rules
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'admin' || hash === '/admin') {
        if (currentUser && currentUser.role === 'trainee') {
          // Trainee attempted to access /admin -> strict 403
          setCurrentPage('unauthorized');
        } else if (currentUser && currentUser.role === 'admin') {
          setAdminPreviewMode(false);
          setCurrentPage('admin');
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Check initial hash
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentUser]);

  const handleAuthSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    setAdminPreviewMode(false);
    if (user.role === 'admin') {
      setCurrentPage('admin');
    } else {
      setCurrentPage('home');
    }
  };

  const handleLogout = async () => {
    await AuthService.logout();
    setCurrentUser(null);
    setAdminPreviewMode(false);
    setCurrentPage('home');
    window.location.hash = '';
  };

  // Language & Accessibility State
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved === 'en' || saved === 'hi') return saved;
    } catch {}
    return 'en';
  });

  const [accessibilityConfig, setAccessibilityConfig] = useState<AccessibilityConfig>(() => {
    return loadAccessibilityConfig();
  });

  // Modal states
  const [showLanguageModal, setShowLanguageModal] = useState<boolean>(() => {
    try {
      return localStorage.getItem(LANGUAGE_SELECTED_KEY) !== 'true';
    } catch {
      return false;
    }
  });
  const [showGlossaryModal, setShowGlossaryModal] = useState(false);
  const [showAIAssistantModal, setShowAIAssistantModal] = useState(false);
  const [showDoubtModal, setShowDoubtModal] = useState(false);
  const [initialAssistantCategory, setInitialAssistantCategory] = useState<string | undefined>(undefined);
  const [initialAssistantQuery, setInitialAssistantQuery] = useState<string | undefined>(undefined);
  const [showAnimatedTutorialModal, setShowAnimatedTutorialModal] = useState(false);
  const [tutorialScenarioId, setTutorialScenarioId] = useState('scenario-1-ppe');

  const handleOpenAIAssistant = (category?: string, query?: string) => {
    setInitialAssistantCategory(category);
    setInitialAssistantQuery(query);
    setShowAIAssistantModal(true);
  };

  const handleOpenSafetyTutorial = (scenarioId?: string) => {
    if (scenarioId) {
      setTutorialScenarioId(scenarioId);
    }
    setShowAnimatedTutorialModal(true);
  };

  // Sync language change
  const handleSelectLanguage = (lang: SupportedLanguage) => {
    setCurrentLanguage(lang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      localStorage.setItem(LANGUAGE_SELECTED_KEY, 'true');
    } catch {}
    setShowLanguageModal(false);
  };

  // Sync accessibility changes
  const handleUpdateAccessibility = (partialConfig: Partial<AccessibilityConfig>) => {
    setAccessibilityConfig((prev) => {
      const updated = { ...prev, ...partialConfig };
      saveAccessibilityConfig(updated);
      return updated;
    });
  };

  const handleVoiceSpeak = (text: string) => {
    if (accessibilityConfig.voiceEnabled) {
      speakVoiceGuidance(text, currentLanguage, accessibilityConfig.voiceVolume, true);
    }
  };

  // Check if a module is assigned to current trainee
  const isModuleAssigned = (scenarioId: string) => {
    if (!currentUser || currentUser.role === 'admin') return true;
    const assigned = currentUser.assignedModules;
    const disabled = currentUser.disabledModules || [];
    if (assigned && !assigned.includes(scenarioId)) return false;
    if (disabled && disabled.includes(scenarioId)) return false;
    return true;
  };

  const handleStartScenario = (scenarioId: string) => {
    if (!isModuleAssigned(scenarioId)) {
      setSelectedScenarioId(scenarioId);
      setCurrentPage('module-unassigned');
      return;
    }

    setSelectedScenarioId(scenarioId);
    if (scenarioId === 'scenario-1-ppe') {
      setCurrentPage('scenario-ppe');
    } else {
      setCurrentPage('scenario-intro');
    }
  };

  const handleScenarioCompleted = (score: number, identified: string[]) => {
    const sessionXP = 100 + 4 * 25;
    setTraineeProfile((prev) => {
      const updated = {
        ...prev,
        xp: (prev.xp || 420) + sessionXP,
        safetyScore: Math.max(prev.safetyScore || 0, score),
        bestScores: {
          ...(prev.bestScores || {}),
          [selectedScenarioId]: Math.max(prev.bestScores?.[selectedScenarioId] || 0, score)
        },
        completedScenarioIds: Array.from(
          new Set([...(prev.completedScenarioIds || []), selectedScenarioId])
        ),
        lastActiveDate: new Date().toISOString()
      };
      try {
        localStorage.setItem('sih26041_trainee_profile', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const fontSizeMultiplier =
    accessibilityConfig.textSize === 'xlarge'
      ? 1.5
      : accessibilityConfig.textSize === 'large'
      ? 1.25
      : 1.0;

  // =========================================================
  // VIEW 1: UNAUTHENTICATED USERS (Login Portal)
  // =========================================================
  if (!currentUser) {
    return (
      <div
        className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950 transition-colors ${
          accessibilityConfig.highContrast ? 'contrast-125 saturate-150' : ''
        }`}
        style={{
          fontSize: `${fontSizeMultiplier * 100}%`
        }}
      >
        <ProjectHeader
          onOpenSplash={() => setShowSplashScreen(true)}
          currentUser={null}
          onGoHome={() => setCurrentPage('home')}
        />

        <main className="flex-1 flex items-center justify-center p-4">
          <AuthScreen
            onSuccess={handleAuthSuccess}
            onContinueAsGuest={() => {
              const guestUser = AuthService.loginAsGuest();
              handleAuthSuccess(guestUser);
            }}
          />
        </main>

        <SplashScreenModal
          isOpen={showSplashScreen}
          onEnter={() => {
            try {
              localStorage.setItem(SPLASH_SEEN_KEY, 'true');
            } catch {}
            setShowSplashScreen(false);
          }}
          onClose={() => setShowSplashScreen(false)}
        />
      </div>
    );
  }

  // =========================================================
  // VIEW 2: STRICT 403 ACCESS DENIED (Trainee -> /admin)
  // =========================================================
  if (currentUser.role === 'trainee' && (currentPage === 'unauthorized' || currentPage === 'admin')) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-red-600 selection:text-white font-sans">
        <ProjectHeader
          currentUser={currentUser}
          onLogout={handleLogout}
          onGoHome={() => {
            window.location.hash = '';
            setCurrentPage('home');
          }}
        />

        <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <div className="max-w-xl w-full bg-slate-900 border-2 border-red-500/60 rounded-3xl p-6 sm:p-10 text-center space-y-6 shadow-2xl shadow-red-950/80">
            <div className="w-20 h-20 rounded-3xl bg-red-950/80 border-2 border-red-500 flex items-center justify-center mx-auto text-red-400 shadow-xl shadow-red-950/50">
              <ShieldAlert className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-red-950 border border-red-500/50 text-xs font-mono font-bold text-red-300 uppercase tracking-widest inline-block">
                403 Forbidden &bull; Strict Access Control
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Access Denied: Administrative Area
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                Trainee accounts are strictly prohibited from accessing administrative command centers,
                trainee provisioning tools, or system compliance policies.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-left font-mono text-xs space-y-1 text-slate-400">
              <div className="flex justify-between">
                <span>Account:</span>
                <span className="text-white font-bold">{currentUser.displayName}</span>
              </div>
              <div className="flex justify-between">
                <span>Trainee ID:</span>
                <span className="text-amber-400 font-bold">{currentUser.traineeId || 'TR-USER'}</span>
              </div>
              <div className="flex justify-between">
                <span>Role Permission:</span>
                <span className="text-red-400 font-bold uppercase">trainee (no admin rights)</span>
              </div>
              <div className="flex justify-between border-t border-slate-800/80 pt-1 text-[11px]">
                <span>Logged Incident:</span>
                <span>{new Date().toLocaleTimeString()} &bull; DGMS SEC-403</span>
              </div>
            </div>

            <div>
              <button
                type="button"
                id="btn-return-trainee-portal"
                onClick={() => {
                  window.location.hash = '';
                  setCurrentPage('home');
                }}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm transition-all shadow-lg shadow-amber-950/40 cursor-pointer flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Authorized Trainee Portal</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // =========================================================
  // VIEW 3: MODULE NOT ASSIGNED TO TRAINEE
  // =========================================================
  if (currentUser.role === 'trainee' && currentPage === 'module-unassigned') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <ProjectHeader
          currentUser={currentUser}
          onLogout={handleLogout}
          onGoHome={() => setCurrentPage('home')}
        />

        <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-950 border border-amber-500/40 text-[11px] font-mono text-amber-300 font-bold">
                Access Restricted
              </span>
              <h2 className="text-xl font-black text-white">Module Not Assigned</h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Your Safety Administrator has not assigned this statutory hazard training module (
                <span className="font-mono text-amber-400">{selectedScenarioId}</span>) to your trainee profile.
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-400 text-left">
              Please complete your currently assigned modules or submit a request to your Safety Officer via
              the Help Requests section in &ldquo;My Progress&rdquo;.
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                id="btn-return-assigned-modules"
                onClick={() => setCurrentPage('scenarios')}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer transition-colors"
              >
                Return to Assigned Scenarios
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage('home')}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
              >
                Go to Home Dashboard
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // =========================================================
  // VIEW 4: ADMIN PORTAL (Safety Command Center)
  // When currentUser.role === 'admin' and NOT in preview mode
  // =========================================================
  if (currentUser.role === 'admin' && !adminPreviewMode) {
    return (
      <AdminDashboard
        currentUser={currentUser}
        onLogout={handleLogout}
        onPreviewAsTrainee={() => {
          setAdminPreviewMode(true);
          setCurrentPage('home');
        }}
      />
    );
  }

  // =========================================================
  // VIEW 5: TRAINEE PORTAL (or Admin in Preview Mode)
  // =========================================================
  const isHindi = currentLanguage === 'hi';

  return (
    <div
      className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950 transition-colors ${
        accessibilityConfig.highContrast ? 'contrast-125 saturate-150' : ''
      }`}
      style={{
        fontSize: `${fontSizeMultiplier * 100}%`
      }}
    >
      {/* Sticky Top Banner for Admin in Preview Mode */}
      {currentUser.role === 'admin' && adminPreviewMode && (
        <div
          id="admin-preview-banner"
          className="bg-amber-500 text-slate-950 px-4 py-2 text-xs sm:text-sm font-bold flex items-center justify-between shadow-lg sticky top-0 z-40 border-b border-amber-600"
        >
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-slate-950 text-amber-400 font-mono text-xs uppercase font-black">
              ADMIN PREVIEW
            </span>
            <span>Testing vocational simulator in trainee mode</span>
          </div>

          <button
            type="button"
            id="btn-exit-preview"
            onClick={() => {
              setAdminPreviewMode(false);
              setCurrentPage('admin');
            }}
            className="px-3 py-1 rounded-lg bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
          >
            <span>Return to Safety Admin Portal</span>
            <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
          </button>
        </div>
      )}

      {/* Top Header */}
      <ProjectHeader
        onOpenSplash={() => setShowSplashScreen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
        onGoHome={() => {
          if (currentUser.role === 'admin') {
            setAdminPreviewMode(false);
            setCurrentPage('admin');
          } else {
            setCurrentPage('home');
          }
        }}
      />

      {/* Accessibility & Language Bar */}
      <AccessibilityBar
        currentLanguage={currentLanguage}
        onLanguageChange={handleSelectLanguage}
        config={accessibilityConfig}
        onUpdateConfig={handleUpdateAccessibility}
        onOpenLanguageModal={() => setShowLanguageModal(true)}
        onOpenGlossary={() => setShowGlossaryModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 lg:p-7 space-y-6">
        {/* Simple Worker-Friendly Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 border border-slate-800 p-2 rounded-2xl shadow-lg">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              id="nav-btn-home"
              onClick={() => setCurrentPage('home')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                currentPage === 'home'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>{isHindi ? 'मुख्य (Home)' : 'Home'}</span>
            </button>

            <button
              id="nav-btn-scenarios"
              onClick={() => setCurrentPage('scenarios')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                currentPage === 'scenarios' || currentPage === 'scenario-ppe' || currentPage === 'ar-simulation'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <HardHat className="w-4 h-4" />
              <span>{isHindi ? 'सुरक्षा परिदृश्य' : 'Safety Scenarios'}</span>
            </button>

            <button
              id="nav-btn-virtual-env"
              onClick={() => setCurrentPage('virtual-env')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                currentPage === 'virtual-env'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Factory className="w-4 h-4" />
              <span>{isHindi ? 'आभासी प्रशिक्षण' : 'Virtual Training'}</span>
            </button>

            <button
              id="nav-btn-ai-hazard"
              onClick={() => setCurrentPage('ai-hazard-check')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                currentPage === 'ai-hazard-check'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>{isHindi ? 'खतरा जांच' : 'AI Hazard Check'}</span>
            </button>

            <button
              id="nav-btn-my-progress"
              onClick={() => setCurrentPage('my-progress')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                currentPage === 'my-progress'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>{isHindi ? 'मेरी प्रगति' : 'My Progress'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* AI Safety Assistant */}
            <button
              id="btn-global-ai-assistant"
              onClick={() => handleOpenAIAssistant()}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-black transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 border border-blue-400/40"
              title="AI Safety Assistant / सुरक्षा सहायक"
            >
              <Bot className="w-3.5 h-3.5 text-blue-200" />
              <span>{isHindi ? 'सुरक्षा सहायक' : 'AI Assistant'}</span>
            </button>

            {/* Doubt & Help */}
            <button
              id="btn-global-doubt-help"
              onClick={() => setShowDoubtModal(true)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs font-black transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 border border-amber-400/40"
              title="Doubt & Help / संदेह और सहायता"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-200" />
              <span>{isHindi ? 'संदेह और सहायता' : 'Doubt & Help'}</span>
            </button>

            {/* Animated Safety Steps */}
            <button
              id="btn-global-safety-steps"
              onClick={() => handleOpenSafetyTutorial(selectedScenarioId)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs font-black transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 border border-amber-300"
              title="Animated Safety Steps - Learn with animation and voice"
            >
              <Clapperboard className="w-3.5 h-3.5" />
              <span>{isHindi ? 'सुरक्षा चरण' : 'Safety Steps'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Page Routing */}
        <div className="transition-all duration-200">
          {/* Page 1: Home Dashboard */}
          {currentPage === 'home' && (
            <TraineeHomeDashboard
              currentLanguage={currentLanguage}
              currentUser={currentUser}
              profile={traineeProfile}
              onStartTraining={() => setCurrentPage('scenarios')}
              onOpenVirtualSafety={() => setCurrentPage('virtual-env')}
              onOpenAIHazardCheck={() => setCurrentPage('ai-hazard-check')}
              onOpenMyProgress={() => setCurrentPage('my-progress')}
              onOpenAIAssistant={handleOpenAIAssistant}
              onOpenDoubtModal={() => setShowDoubtModal(true)}
              onWatchSafetySteps={handleOpenSafetyTutorial}
              onSelectScenario={handleStartScenario}
              onVoiceSpeak={handleVoiceSpeak}
            />
          )}

          {/* Page 2: Safety Scenarios Page */}
          {currentPage === 'scenarios' && (
            <SafetyScenariosPage
              currentLanguage={currentLanguage}
              currentUser={currentUser}
              onSelectScenario={handleStartScenario}
              onSelectScenario1={() => handleStartScenario('scenario-1-ppe')}
              onBackToHome={() => setCurrentPage('home')}
              onWatchSafetySteps={handleOpenSafetyTutorial}
              onVoiceSpeak={handleVoiceSpeak}
            />
          )}

          {/* Page 3: Scenario 1 PPE & Hazard Step-by-Step */}
          {currentPage === 'scenario-ppe' && (
            <ScenarioPPEPage
              currentLanguage={currentLanguage}
              onLaunchARSimulation={() => setCurrentPage('ar-simulation')}
              onStartARSimulation={() => setCurrentPage('ar-simulation')}
              onBackToScenarios={() => setCurrentPage('scenarios')}
              onWatchSafetySteps={handleOpenSafetyTutorial}
              onVoiceSpeak={handleVoiceSpeak}
            />
          )}

          {/* Page 3.5: Scenario Module Brief & Mandatory Safety Checklist */}
          {currentPage === 'scenario-intro' && (
            <ScenarioModuleIntroPage
              scenarioId={selectedScenarioId}
              currentLanguage={currentLanguage}
              onLaunchARSimulation={() => setCurrentPage('ar-simulation')}
              onBackToScenarios={() => setCurrentPage('scenarios')}
              onVoiceSpeak={handleVoiceSpeak}
              onWatchSafetySteps={handleOpenSafetyTutorial}
            />
          )}

          {/* Page 4: 3D AR Simulator Practical Session */}
          {currentPage === 'ar-simulation' && (
            <div className="space-y-4 max-w-5xl mx-auto">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <div className="flex items-center gap-2">
                  <button
                    id="btn-ar-back-to-intro"
                    onClick={() => {
                      if (selectedScenarioId === 'scenario-1-ppe') {
                        setCurrentPage('scenario-ppe');
                      } else {
                        setCurrentPage('scenario-intro');
                      }
                    }}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-bold cursor-pointer transition-colors border border-slate-700"
                  >
                    <ArrowLeft className="w-4 h-4 text-amber-400" />
                    <span>
                      {selectedScenarioId === 'scenario-1-ppe'
                        ? isHindi ? '← पीपीई चेकलिस्ट' : '← PPE Checklist'
                        : isHindi ? '← परिदृश्य विवरण' : '← Safety Brief'}
                    </span>
                  </button>

                  <button
                    id="btn-ar-back-to-scenarios"
                    onClick={() => setCurrentPage('scenarios')}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs sm:text-sm font-bold cursor-pointer transition-colors border border-slate-700"
                  >
                    <HardHat className="w-4 h-4 text-amber-400" />
                    <span>{isHindi ? 'परिदृश्य सूची' : 'Safety Scenarios'}</span>
                  </button>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider block">
                    {isHindi ? 'व्यावहारिक 3D/AR निरीक्षण' : 'Practical 3D / AR Inspection'}
                  </span>
                  <span className="text-xs text-slate-300 font-medium">
                    {isHindi ? 'कार्यस्थल में 4 खतरे पहचानें' : 'Remediate 4 Workplace Hazards'}
                  </span>
                </div>
              </div>

              <ARSimulator
                scenarioId={selectedScenarioId}
                onSelectScenario={(id) => handleStartScenario(id)}
                onNavigateToProgress={() => setCurrentPage('my-progress')}
                onNavigateToScenarios={() => setCurrentPage('scenarios')}
                onReturnHome={() => setCurrentPage('home')}
                currentLanguage={currentLanguage}
                accessibilityConfig={accessibilityConfig}
                onScenarioCompleted={handleScenarioCompleted}
                onWatchSafetySteps={handleOpenSafetyTutorial}
              />
            </div>
          )}

          {/* Page 5: Virtual Safety Environment */}
          {currentPage === 'virtual-env' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <button
                  onClick={() => setCurrentPage('home')}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-bold cursor-pointer transition-colors border border-slate-700"
                >
                  <ArrowLeft className="w-4 h-4 text-amber-400" />
                  <span>{isHindi ? '← मुख्य पृष्ठ (Home)' : '← Back to Home'}</span>
                </button>
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
                  {isHindi ? 'औद्योगिक सिमुलेशन' : 'Industrial Worksite Simulator'}
                </span>
              </div>

              <VirtualSafetyModule
                currentUser={currentUser}
                onWatchSafetySteps={handleOpenSafetyTutorial}
                onStartScenario={handleStartScenario}
              />
            </div>
          )}

          {/* Page 6: AI Hazard Check */}
          {currentPage === 'ai-hazard-check' && (
            <AIHazardCheckPage
              currentLanguage={currentLanguage}
              onBackToHome={() => setCurrentPage('home')}
              onStartScenario1={() => handleStartScenario('scenario-1-ppe')}
              onVoiceSpeak={handleVoiceSpeak}
            />
          )}

          {/* Page 7: My Progress */}
          {currentPage === 'my-progress' && (
            <MyProgressPage
              currentLanguage={currentLanguage}
              profile={traineeProfile}
              onBackToHome={() => setCurrentPage('home')}
              onContinueTraining={() => setCurrentPage('scenarios')}
              onStartScenario={handleStartScenario}
              onVoiceSpeak={handleVoiceSpeak}
              onOpenAIAssistant={handleOpenAIAssistant}
            />
          )}
        </div>
      </main>

      {/* Modals */}
      {/* 0. Boot Splash Modal */}
      <SplashScreenModal
        isOpen={showSplashScreen}
        onEnter={() => {
          setShowSplashScreen(false);
          setCurrentPage('home');
        }}
        onClose={() => setShowSplashScreen(false)}
      />

      {/* 1. Language Selection Modal */}
      {showLanguageModal && (
        <LanguageSelectionModal
          onSelectLanguage={handleSelectLanguage}
          currentLanguage={currentLanguage}
        />
      )}

      {/* 2. Safety Glossary Modal */}
      {showGlossaryModal && (
        <SafetyGlossaryModal
          currentLanguage={currentLanguage}
          onClose={() => setShowGlossaryModal(false)}
        />
      )}

      {/* 3. AI Safety Assistant Modal */}
      {showAIAssistantModal && (
        <div
          id="global-ai-assistant-modal-backdrop"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
          onClick={() => setShowAIAssistantModal(false)}
        >
          <div
            className="w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <AISafetyAssistant
              isEmbedded={false}
              currentScenarioId={selectedScenarioId}
              initialCategory={initialAssistantCategory}
              initialQuery={initialAssistantQuery}
              onClose={() => setShowAIAssistantModal(false)}
            />
          </div>
        </div>
      )}

      {/* 4. Animated Safety Steps Tutorial Modal */}
      {showAnimatedTutorialModal && (
        <AnimatedSafetyModal
          isOpen={showAnimatedTutorialModal}
          onClose={() => setShowAnimatedTutorialModal(false)}
          initialScenarioId={tutorialScenarioId}
          initialLanguage={currentLanguage}
          onRewardXP={(xp) => {
            setTraineeProfile((prev) => {
              const updated = { ...prev, xp: (prev.xp || 0) + xp };
              try {
                localStorage.setItem('sih26041_trainee_profile', JSON.stringify(updated));
              } catch {}
              return updated;
            });
          }}
        />
      )}

      {/* 5. Trainee Doubt & Help Modal */}
      <TraineeDoubtModal
        isOpen={showDoubtModal}
        onClose={() => setShowDoubtModal(false)}
        currentLanguage={currentLanguage}
        currentScenarioName={selectedScenarioId}
        onVoiceSpeak={handleVoiceSpeak}
      />

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-4 px-4 text-center text-xs text-slate-500 font-mono">
        SURAKSHAAR &bull; Industrial Safety Vocational AR &bull; Bilingual EN / HI &bull; Voice Guidance Compliant
      </footer>
    </div>
  );
}
