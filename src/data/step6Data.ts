import {
  SafetyLevel,
  Achievement,
  LeaderboardEntry,
  TraineeProfile,
  SmartRecommendation,
  CSharpScript,
  ChecklistItem
} from '../types';
import { SCENARIO_DEFINITIONS } from './step5Data';

// Configurable XP Rules
export const XP_CONFIG = {
  HAZARD_IDENTIFIED: 25,
  CORRECT_SAFETY_DECISION: 15,
  SCENARIO_COMPLETION_BONUS: 100,
  HIGH_SCORE_BONUS_THRESHOLD: 90, // Percentage
  HIGH_SCORE_BONUS: 50,
  PERFECT_SCORE_BONUS: 100,
  DAILY_STREAK_BONUS: 30
};

// 5 Gamification Levels with Configurable XP Thresholds
export const SAFETY_LEVELS: SafetyLevel[] = [
  {
    level: 1,
    title: 'Safety Trainee',
    minXP: 0,
    maxXP: 299,
    badgeColor: 'text-slate-300 bg-slate-800 border-slate-700',
    description: 'Beginner induction tier. Learning baseline PPE and foundational hazard recognition.'
  },
  {
    level: 2,
    title: 'Safety Explorer',
    minXP: 300,
    maxXP: 699,
    badgeColor: 'text-sky-400 bg-sky-950/60 border-sky-600/50',
    description: 'Developing environmental hazard awareness across workshop and industrial utility bays.'
  },
  {
    level: 3,
    title: 'Safety Practitioner',
    minXP: 700,
    maxXP: 1299,
    badgeColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-600/50',
    description: 'Competent in multi-hazard identification, electrical isolation, and DGMS emergency procedures.'
  },
  {
    level: 4,
    title: 'Safety Champion',
    minXP: 1300,
    maxXP: 2099,
    badgeColor: 'text-amber-400 bg-amber-950/60 border-amber-600/50',
    description: 'Advanced proficiency across mining haulage, fire evacuation, and high-voltage substations.'
  },
  {
    level: 5,
    title: 'Safety Leader',
    minXP: 2100,
    maxXP: 999999,
    badgeColor: 'text-purple-400 bg-purple-950/60 border-purple-600/50',
    description: 'Master tier. Demonstrates near-perfect safety compliance and peer mentoring readiness.'
  }
];

export const calculateLevelFromXP = (xp: number): SafetyLevel => {
  for (let i = SAFETY_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= SAFETY_LEVELS[i].minXP) {
      return SAFETY_LEVELS[i];
    }
  }
  return SAFETY_LEVELS[0];
};

// Official Achievements
export const ACHIEVEMENTS_LIST: Achievement[] = [
  {
    id: 'first-training',
    title: 'First Training',
    description: 'Complete your first industrial safety AR training scenario.',
    iconName: 'Award',
    xpReward: 50,
    category: 'general',
    isUnlocked: true,
    unlockedAt: '2026-09-04T09:30:00Z',
    progress: { current: 1, total: 1 }
  },
  {
    id: 'hazard-hunter',
    title: 'Hazard Hunter',
    description: 'Correctly identify and tag 10 industrial safety hazards.',
    iconName: 'Crosshair',
    xpReward: 100,
    category: 'general',
    isUnlocked: true,
    unlockedAt: '2026-09-05T14:15:00Z',
    progress: { current: 10, total: 10 }
  },
  {
    id: 'safety-expert',
    title: 'Safety Expert',
    description: 'Score 90% or higher in any vocational safety scenario.',
    iconName: 'Star',
    xpReward: 100,
    category: 'mastery',
    isUnlocked: true,
    unlockedAt: '2026-09-06T08:45:00Z',
    progress: { current: 1, total: 1 }
  },
  {
    id: 'mining-guardian',
    title: 'Mining Guardian',
    description: 'Successfully complete the Mining Underground & Haulage Road Safety scenario (DGMS CMR 2017).',
    iconName: 'Pickaxe',
    xpReward: 150,
    category: 'mining',
    isUnlocked: false,
    progress: { current: 0, total: 1 }
  },
  {
    id: 'emergency-ready',
    title: 'Emergency Ready',
    description: 'Successfully complete the Industrial Fire Emergency & Evacuation scenario.',
    iconName: 'Flame',
    xpReward: 125,
    category: 'fire',
    isUnlocked: false,
    progress: { current: 0, total: 1 }
  },
  {
    id: 'electrical-aware',
    title: 'Electrical Aware',
    description: 'Successfully complete High-Voltage Electrical Substation Safety per CEA Regs 2010.',
    iconName: 'Zap',
    xpReward: 125,
    category: 'electrical',
    isUnlocked: true,
    unlockedAt: '2026-09-05T16:20:00Z',
    progress: { current: 1, total: 1 }
  },
  {
    id: 'safety-champion',
    title: 'Safety Champion',
    description: 'Pass all 5 available vocational safety scenarios with passing grade.',
    iconName: 'Trophy',
    xpReward: 250,
    category: 'mastery',
    isUnlocked: false,
    progress: { current: 3, total: 5 }
  }
];

// Initial Trainee Profile (Current logged-in user)
export const INITIAL_TRAINEE_PROFILE: TraineeProfile = {
  id: 'JH-TRAINEE-2026',
  name: 'Anand Kumar',
  affiliation: 'Govt Polytechnic Dhanbad / Tata Steel Trainee',
  xp: 780,
  level: 3,
  levelTitle: 'Safety Practitioner',
  currentStreak: 3,
  bestStreak: 5,
  lastActiveDate: '2026-09-06',
  unlockedAchievements: ['first-training', 'hazard-hunter', 'safety-expert', 'electrical-aware'],
  completedScenarioIds: ['scenario-1-ppe', 'scenario-2-electrical'],
  bestScores: {
    'scenario-1-ppe': 95,
    'scenario-2-electrical': 85
  }
};

// Initial Leaderboard Data with Privacy-Friendly Display Names
export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    traineeId: 'JH-TR-0941',
    displayName: 'Rohan M. (Bokaro Steel Hub)',
    affiliation: 'SAIL Bokaro Industrial Center',
    xp: 2450,
    level: 5,
    levelTitle: 'Safety Leader',
    scenariosCompleted: 8,
    averageScore: 94,
    avatarColor: 'from-purple-500 to-indigo-600',
    bestStreak: 12
  },
  {
    rank: 2,
    traineeId: 'JH-TR-1823',
    displayName: 'Pooja H. (Dhanbad Mining Inst.)',
    affiliation: 'IIT-ISM Dhanbad Extension',
    xp: 2180,
    level: 5,
    levelTitle: 'Safety Leader',
    scenariosCompleted: 7,
    averageScore: 91,
    avatarColor: 'from-amber-500 to-rose-600',
    bestStreak: 9
  },
  {
    rank: 3,
    traineeId: 'JH-TR-3392',
    displayName: 'Bikram S. (Tata Steel Jamshedpur)',
    affiliation: 'Tata Steel Technical Institute',
    xp: 1850,
    level: 4,
    levelTitle: 'Safety Champion',
    scenariosCompleted: 6,
    averageScore: 88,
    avatarColor: 'from-emerald-500 to-teal-600',
    bestStreak: 7
  },
  {
    rank: 4,
    traineeId: 'JH-TR-4105',
    displayName: 'Sunil M. (Ranchi Polytech)',
    affiliation: 'Govt Polytechnic Ranchi',
    xp: 1420,
    level: 4,
    levelTitle: 'Safety Champion',
    scenariosCompleted: 5,
    averageScore: 84,
    avatarColor: 'from-cyan-500 to-blue-600',
    bestStreak: 6
  },
  {
    rank: 5,
    traineeId: 'JH-TR-5021',
    displayName: 'Kavita T. (Chaibasa Mines Safety)',
    affiliation: 'West Singhbhum Mining Board',
    xp: 1150,
    level: 3,
    levelTitle: 'Safety Practitioner',
    scenariosCompleted: 4,
    averageScore: 86,
    avatarColor: 'from-rose-500 to-pink-600',
    bestStreak: 5
  },
  {
    rank: 6,
    traineeId: 'JH-TR-6218',
    displayName: 'Deepak B. (Ramgarh Coalfields)',
    affiliation: 'Central Coalfields Limited (CCL)',
    xp: 920,
    level: 3,
    levelTitle: 'Safety Practitioner',
    scenariosCompleted: 3,
    averageScore: 79,
    avatarColor: 'from-amber-500 to-yellow-600',
    bestStreak: 4
  },
  {
    rank: 7,
    traineeId: 'JH-TRAINEE-2026',
    displayName: 'Anand Kumar (You)',
    affiliation: 'Govt Polytechnic Dhanbad / Tata Steel Trainee',
    xp: 780,
    level: 3,
    levelTitle: 'Safety Practitioner',
    scenariosCompleted: 3,
    averageScore: 85,
    avatarColor: 'from-amber-400 to-orange-500',
    bestStreak: 5
  },
  {
    rank: 8,
    traineeId: 'JH-TR-7440',
    displayName: 'Sangeeta M. (Dumka ITI)',
    affiliation: 'Santhal Pargana Vocational Unit',
    xp: 640,
    level: 2,
    levelTitle: 'Safety Explorer',
    scenariosCompleted: 2,
    averageScore: 76,
    avatarColor: 'from-sky-500 to-cyan-600',
    bestStreak: 3
  }
];

// Smart Recommendation Engine (Local Rule-Based per Step 6 Specification)
export const computeSmartRecommendation = (
  bestScores: Record<string, number>,
  completedScenarioIds: string[]
): SmartRecommendation => {
  // Rule 1: Electrical safety score < 70
  const elecScore = bestScores['scenario-2-electrical'];
  if (elecScore !== undefined && elecScore < 70) {
    return {
      scenarioId: 'scenario-2-electrical',
      scenarioName: 'High-Voltage Electrical Substation Safety',
      shortTitle: 'Electrical Safety Refresher',
      reason: 'Your electrical safety score was below 70%. High-voltage substations require mastery of CEA Regulation 30 isolation.',
      priority: 'urgent_remediation',
      industry: 'Electrical Infrastructure'
    };
  }

  // Rule 2: Mining safety score < 70 or not yet completed
  const miningScore = bestScores['scenario-4-mining'];
  if (miningScore !== undefined && miningScore < 70) {
    return {
      scenarioId: 'scenario-4-mining',
      scenarioName: 'Mining Underground & Haulage Road Safety',
      shortTitle: 'Mining Area Safety Refresher',
      reason: 'Your mining haulage safety score was below 70%. Master unsupported roof strata checks (DGMS CMR 2017).',
      priority: 'urgent_remediation',
      industry: 'Mining & Extraction'
    };
  }

  // Rule 3: Machinery guarding score < 70
  const machScore = bestScores['scenario-5-machinery'];
  if (machScore !== undefined && machScore < 70) {
    return {
      scenarioId: 'scenario-5-machinery',
      scenarioName: 'Heavy Industrial Machinery & Nip-Point Guarding',
      shortTitle: 'Machinery Guarding Refresher',
      reason: 'Rotating nip-point score was below 70%. Practice emergency stop (E-Stop) actuation per IS 9474.',
      priority: 'urgent_remediation',
      industry: 'Heavy Engineering'
    };
  }

  // Rule 4: Fire safety score < 70
  const fireScore = bestScores['scenario-3-fire'];
  if (fireScore !== undefined && fireScore < 70) {
    return {
      scenarioId: 'scenario-3-fire',
      scenarioName: 'Industrial Fire Emergency & Evacuation',
      shortTitle: 'Fire Safety Refresher',
      reason: 'Fire response score was below 70%. Revisit manual break-glass call points and emergency exit clearance.',
      priority: 'urgent_remediation',
      industry: 'Emergency Response'
    };
  }

  // Rule 5: Next uncompleted scenario
  const uncompleted = SCENARIO_DEFINITIONS.find((s) => !completedScenarioIds.includes(s.id));
  if (uncompleted) {
    return {
      scenarioId: uncompleted.id,
      scenarioName: uncompleted.name,
      shortTitle: uncompleted.shortTitle,
      reason: `Expand your vocational competency to ${uncompleted.industry} safety protocols in Jharkhand.`,
      priority: 'recommended',
      industry: uncompleted.industry
    };
  }

  // Rule 6: All completed successfully -> Advanced Hard Mode
  return {
    scenarioId: 'scenario-4-mining',
    scenarioName: 'Mining Underground & Haulage Road Safety (Hard Mode)',
    shortTitle: 'Advanced Safety Scenario (Hard Mode)',
    reason: 'Congratulations! All basic modules completed. Test your rapid hazard reflexes under restricted 60s time limits.',
    priority: 'advanced_challenge',
    industry: 'Mining & Extraction'
  };
};

// Step 6 C# Scripts for Unity AR Project
export const STEP_6_SCRIPTS: CSharpScript[] = [
  {
    id: "gamification-manager",
    step: 6,
    filename: "GamificationManager.cs",
    className: "GamificationManager",
    namespace: "SIH26041.AR.Gamification",
    summary: "Central Singleton managing XP accumulation, Safety Level thresholds, daily activity streak calculation, and event dispatches for UI feedback.",
    targetGameObject: "Managers / GamificationManager",
    requiredComponents: [],
    inspectorFields: [
      { name: "xpPerHazard", type: "int", description: "XP awarded per correct hazard identification (Default: 25).", required: true },
      { name: "xpPerSafetyAction", type: "int", description: "XP awarded per correct safety action / PPE equip (Default: 15).", required: true },
      { name: "completionBonusXP", type: "int", description: "Bonus XP awarded upon scenario completion (Default: 100).", required: true },
      { name: "highScoreBonusXP", type: "int", description: "Bonus XP awarded when score exceeds 90% (Default: 50).", required: true },
      { name: "syncService", type: "FirebaseGamificationSyncService", description: "Reference to Firestore persistence and offline sync service.", required: false }
    ],
    code: `using System;
using System.Collections.Generic;
using UnityEngine;

namespace SIH26041.AR.Gamification
{
    /// <summary>
    /// Singleton manager responsible for XP tracking, level progression,
    /// activity streaks, and broadcasting gamification state changes.
    /// </summary>
    public class GamificationManager : MonoBehaviour
    {
        public static GamificationManager Instance { get; private set; }

        [Header("XP Configuration")]
        [SerializeField] private int xpPerHazard = 25;
        [SerializeField] private int xpPerSafetyAction = 15;
        [SerializeField] private int completionBonusXP = 100;
        [SerializeField] private int highScoreBonusXP = 50;
        [SerializeField] private int perfectScoreBonusXP = 100;

        [Header("Level Thresholds (Min XP)")]
        [SerializeField] private int level2Threshold = 300;   // Safety Explorer
        [SerializeField] private int level3Threshold = 700;   // Safety Practitioner
        [SerializeField] private int level4Threshold = 1300;  // Safety Champion
        [SerializeField] private int level5Threshold = 2100;  // Safety Leader

        [Header("Runtime State (Read Only)")]
        [SerializeField] private int currentXP = 0;
        [SerializeField] private int currentLevel = 1;
        [SerializeField] private int currentStreak = 1;
        [SerializeField] private int bestStreak = 1;
        [SerializeField] private string lastActiveDateIso = "";

        // Events
        public event Action<int, int> OnXPGained; // (amountAdded, totalXP)
        public event Action<int, string> OnLevelUp; // (newLevel, levelTitle)
        public event Action<int> OnStreakUpdated;

        private const string PREF_KEY_XP = "SIH26041_CurrentXP";
        private const string PREF_KEY_STREAK = "SIH26041_CurrentStreak";
        private const string PREF_KEY_BEST_STREAK = "SIH26041_BestStreak";
        private const string PREF_KEY_LAST_DATE = "SIH26041_LastActiveDate";

        public int CurrentXP => currentXP;
        public int CurrentLevel => currentLevel;
        public int CurrentStreak => currentStreak;
        public int BestStreak => bestStreak;

        private void Awake()
        {
            if (Instance == null)
            {
                Instance = this;
                DontDestroyOnLoad(gameObject);
                LoadLocalState();
                UpdateStreakOnLaunch();
            }
            else
            {
                Destroy(gameObject);
            }
        }

        private void LoadLocalState()
        {
            currentXP = PlayerPrefs.GetInt(PREF_KEY_XP, 0);
            currentStreak = PlayerPrefs.GetInt(PREF_KEY_STREAK, 1);
            bestStreak = PlayerPrefs.GetInt(PREF_KEY_BEST_STREAK, 1);
            lastActiveDateIso = PlayerPrefs.GetString(PREF_KEY_LAST_DATE, DateTime.UtcNow.ToString("yyyy-MM-dd"));
            currentLevel = CalculateLevel(currentXP);
        }

        private void SaveLocalState()
        {
            PlayerPrefs.SetInt(PREF_KEY_XP, currentXP);
            PlayerPrefs.SetInt(PREF_KEY_STREAK, currentStreak);
            PlayerPrefs.SetInt(PREF_KEY_BEST_STREAK, bestStreak);
            PlayerPrefs.SetString(PREF_KEY_LAST_DATE, lastActiveDateIso);
            PlayerPrefs.Save();
        }

        public void AwardHazardXP()
        {
            AddXP(xpPerHazard, "Hazard Correctly Identified");
        }

        public void AwardSafetyActionXP()
        {
            AddXP(xpPerSafetyAction, "Safe Procedural Action");
        }

        public int CalculateScenarioXP(int score, int maxScore, bool passed)
        {
            int earned = 0;
            if (passed)
            {
                earned += completionBonusXP;
            }

            float pct = maxScore > 0 ? ((float)score / maxScore) * 100f : 0f;
            if (pct >= 90f)
            {
                earned += highScoreBonusXP;
            }
            if (pct >= 100f)
            {
                earned += perfectScoreBonusXP;
            }

            AddXP(earned, "Scenario Completion Reward");
            return earned;
        }

        public void AddXP(int amount, string source)
        {
            if (amount <= 0) return;

            int oldLevel = currentLevel;
            currentXP += amount;
            currentLevel = CalculateLevel(currentXP);

            SaveLocalState();
            OnXPGained?.Invoke(amount, currentXP);

            if (currentLevel > oldLevel)
            {
                string title = GetLevelTitle(currentLevel);
                Debug.Log($"[Gamification] LEVEL UP! Level {currentLevel} - {title}");
                OnLevelUp?.Invoke(currentLevel, title);
            }
        }

        public int CalculateLevel(int xp)
        {
            if (xp >= level5Threshold) return 5;
            if (xp >= level4Threshold) return 4;
            if (xp >= level3Threshold) return 3;
            if (xp >= level2Threshold) return 2;
            return 1;
        }

        public string GetLevelTitle(int level)
        {
            switch (level)
            {
                case 1: return "Safety Trainee";
                case 2: return "Safety Explorer";
                case 3: return "Safety Practitioner";
                case 4: return "Safety Champion";
                case 5: return "Safety Leader";
                default: return "Safety Trainee";
            }
        }

        public (int minXP, int maxXP) GetLevelBounds(int level)
        {
            switch (level)
            {
                case 1: return (0, level2Threshold - 1);
                case 2: return (level2Threshold, level3Threshold - 1);
                case 3: return (level3Threshold, level4Threshold - 1);
                case 4: return (level4Threshold, level5Threshold - 1);
                case 5: return (level5Threshold, 999999);
                default: return (0, 299);
            }
        }

        private void UpdateStreakOnLaunch()
        {
            DateTime today = DateTime.UtcNow.Date;
            if (DateTime.TryParse(lastActiveDateIso, out DateTime lastDate))
            {
                int dayDiff = (today - lastDate.Date).Days;
                if (dayDiff == 1)
                {
                    // Consecutive day active
                    currentStreak++;
                    if (currentStreak > bestStreak) bestStreak = currentStreak;
                }
                else if (dayDiff > 1)
                {
                    // Streak lapsed (graceful reset, no shaming)
                    currentStreak = 1;
                }
            }

            lastActiveDateIso = today.ToString("yyyy-MM-dd");
            SaveLocalState();
            OnStreakUpdated?.Invoke(currentStreak);
        }
    }
}`
  },

  {
    id: "achievement-manager",
    step: 6,
    filename: "AchievementManager.cs",
    className: "AchievementManager",
    namespace: "SIH26041.AR.Gamification",
    summary: "Monitors gameplay events, evaluates unlocking conditions for 7 core vocational badges, manages local PlayerPrefs cache, and raises unlock notifications.",
    targetGameObject: "Managers / AchievementManager",
    requiredComponents: [],
    inspectorFields: [
      { name: "totalHazardsIdentified", type: "int", description: "Lifetime hazards identified counter.", required: false },
      { name: "toastDurationSeconds", type: "float", description: "Duration to display achievement toast (Default: 3.5s).", required: true }
    ],
    code: `using System;
using System.Collections.Generic;
using UnityEngine;

namespace SIH26041.AR.Gamification
{
    [System.Serializable]
    public class AchievementData
    {
        public string id;
        public string title;
        public string description;
        public int xpReward;
        public bool isUnlocked;
        public string unlockedAtIso;
    }

    /// <summary>
    /// Evaluates achievement criteria, stores unlocked states locally,
    /// and broadcasts unlock notifications to HUD controllers.
    /// </summary>
    public class AchievementManager : MonoBehaviour
    {
        public static AchievementManager Instance { get; private set; }

        public event Action<AchievementData> OnAchievementUnlocked;

        private Dictionary<string, AchievementData> achievements = new Dictionary<string, AchievementData>();
        private int totalLifetimeHazards = 0;
        private HashSet<string> completedScenarioIds = new HashSet<string>();

        private const string PREF_LIFETIME_HAZARDS = "SIH26041_LifetimeHazards";
        private const string PREF_UNLOCKED_PREFIX = "SIH26041_Ach_";

        private void Awake()
        {
            if (Instance == null)
            {
                Instance = this;
                DontDestroyOnLoad(gameObject);
                InitializeDefinitions();
                LoadAchievementStates();
            }
            else
            {
                Destroy(gameObject);
            }
        }

        private void InitializeDefinitions()
        {
            RegisterAchievement("first-training", "First Training", "Complete your first safety AR training scenario.", 50);
            RegisterAchievement("hazard-hunter", "Hazard Hunter", "Identify 10 hazards correctly.", 100);
            RegisterAchievement("safety-expert", "Safety Expert", "Score 90%+ in a scenario.", 100);
            RegisterAchievement("mining-guardian", "Mining Guardian", "Complete Mining Area Safety (DGMS CMR 2017).", 150);
            RegisterAchievement("emergency-ready", "Emergency Ready", "Complete Industrial Fire Safety & Evacuation.", 125);
            RegisterAchievement("electrical-aware", "Electrical Aware", "Complete High-Voltage Electrical Substation Safety.", 125);
            RegisterAchievement("safety-champion", "Safety Champion", "Pass all 5 available vocational safety scenarios.", 250);
        }

        private void RegisterAchievement(string id, string title, string description, int xp)
        {
            achievements[id] = new AchievementData
            {
                id = id,
                title = title,
                description = description,
                xpReward = xp,
                isUnlocked = false,
                unlockedAtIso = ""
            };
        }

        private void LoadAchievementStates()
        {
            totalLifetimeHazards = PlayerPrefs.GetInt(PREF_LIFETIME_HAZARDS, 0);

            foreach (var kvp in achievements)
            {
                if (PlayerPrefs.GetInt(PREF_UNLOCKED_PREFIX + kvp.Key, 0) == 1)
                {
                    kvp.Value.isUnlocked = true;
                    kvp.Value.unlockedAtIso = PlayerPrefs.GetString(PREF_UNLOCKED_PREFIX + kvp.Key + "_date", "");
                }
            }
        }

        public void NotifyHazardIdentified()
        {
            totalLifetimeHazards++;
            PlayerPrefs.SetInt(PREF_LIFETIME_HAZARDS, totalLifetimeHazards);
            PlayerPrefs.Save();

            if (totalLifetimeHazards >= 10)
            {
                TryUnlock("hazard-hunter");
            }
        }

        public void NotifyScenarioCompleted(string scenarioId, int score, int maxScore, bool passed)
        {
            TryUnlock("first-training");

            float pct = maxScore > 0 ? ((float)score / maxScore) * 100f : 0f;
            if (pct >= 90f)
            {
                TryUnlock("safety-expert");
            }

            if (passed)
            {
                completedScenarioIds.Add(scenarioId);

                if (scenarioId == "scenario-4-mining")
                {
                    TryUnlock("mining-guardian");
                }
                else if (scenarioId == "scenario-3-fire")
                {
                    TryUnlock("emergency-ready");
                }
                else if (scenarioId == "scenario-2-electrical")
                {
                    TryUnlock("electrical-aware");
                }

                if (completedScenarioIds.Count >= 5)
                {
                    TryUnlock("safety-champion");
                }
            }
        }

        private bool TryUnlock(string achievementId)
        {
            if (!achievements.TryGetValue(achievementId, out var data)) return false;
            if (data.isUnlocked) return false;

            data.isUnlocked = true;
            data.unlockedAtIso = DateTime.UtcNow.ToString("o");

            PlayerPrefs.SetInt(PREF_UNLOCKED_PREFIX + achievementId, 1);
            PlayerPrefs.SetString(PREF_UNLOCKED_PREFIX + achievementId + "_date", data.unlockedAtIso);
            PlayerPrefs.Save();

            GamificationManager.Instance?.AddXP(data.xpReward, $"Achievement: {data.title}");
            OnAchievementUnlocked?.Invoke(data);
            Debug.Log($"[AchievementManager] UNLOCKED: {data.title} (+{data.xpReward} XP)");
            return true;
        }

        public List<AchievementData> GetAllAchievements()
        {
            return new List<AchievementData>(achievements.Values);
        }
    }
}`
  },

  {
    id: "smart-recommendation-service",
    step: 6,
    filename: "SmartRecommendationService.cs",
    className: "SmartRecommendationService",
    namespace: "SIH26041.AR.Gamification",
    summary: "Rule-based recommendation engine prioritizing safety refreshers for scenarios where trainee scored <70% before recommending advanced hard mode.",
    targetGameObject: "Managers / SmartRecommendationService",
    requiredComponents: [],
    inspectorFields: [
      { name: "failingThresholdPct", type: "float", description: "Score threshold below which scenario refresher is recommended (Default: 70%).", required: true }
    ],
    code: `using System;
using System.Collections.Generic;
using UnityEngine;

namespace SIH26041.AR.Gamification
{
    [System.Serializable]
    public class RecommendationResult
    {
        public string scenarioId;
        public string scenarioTitle;
        public string recommendationReason;
        public string priority; // "urgent_remediation", "recommended", "advanced_challenge"
    }

    /// <summary>
    /// Evaluates trainee performance history and generates targeted,
    /// non-AI deterministic recommendations per Step 7 specification.
    /// </summary>
    public class SmartRecommendationService : MonoBehaviour
    {
        public static SmartRecommendationService Instance { get; private set; }

        [SerializeField] private float failingThresholdPct = 70f;

        private void Awake()
        {
            if (Instance == null) Instance = this;
            else Destroy(gameObject);
        }

        public RecommendationResult GetRecommendation(Dictionary<string, int> bestScores, List<string> completedIds)
        {
            // Rule 1: Electrical safety score < 70%
            if (bestScores.TryGetValue("scenario-2-electrical", out int elecScore) && elecScore < failingThresholdPct)
            {
                return new RecommendationResult
                {
                    scenarioId = "scenario-2-electrical",
                    scenarioTitle = "Electrical Safety Refresher",
                    recommendationReason = "Your electrical score was below 70%. High-voltage substations require mastery of CEA Reg 30 isolation.",
                    priority = "urgent_remediation"
                };
            }

            // Rule 2: Mining safety score < 70%
            if (bestScores.TryGetValue("scenario-4-mining", out int miningScore) && miningScore < failingThresholdPct)
            {
                return new RecommendationResult
                {
                    scenarioId = "scenario-4-mining",
                    scenarioTitle = "Mining Area Safety Refresher",
                    recommendationReason = "Your mining score was below 70%. Re-study unsupported roof strata detection per DGMS CMR 2017.",
                    priority = "urgent_remediation"
                };
            }

            // Rule 3: Heavy machinery nip-point < 70%
            if (bestScores.TryGetValue("scenario-5-machinery", out int machScore) && machScore < failingThresholdPct)
            {
                return new RecommendationResult
                {
                    scenarioId = "scenario-5-machinery",
                    scenarioTitle = "Heavy Machinery Guarding Refresher",
                    recommendationReason = "Machine guarding score was below 70%. Practice emergency stop (E-Stop) actuation per IS 9474.",
                    priority = "urgent_remediation"
                };
            }

            // Rule 4: Fire emergency < 70%
            if (bestScores.TryGetValue("scenario-3-fire", out int fireScore) && fireScore < failingThresholdPct)
            {
                return new RecommendationResult
                {
                    scenarioId = "scenario-3-fire",
                    scenarioTitle = "Fire Safety Refresher",
                    recommendationReason = "Fire response was below 70%. Revisit manual break-glass call points and egress clearing.",
                    priority = "urgent_remediation"
                };
            }

            // Rule 5: Next uncompleted scenario
            string[] allScenarios = new string[]
            {
                "scenario-1-ppe",
                "scenario-2-electrical",
                "scenario-3-fire",
                "scenario-4-mining",
                "scenario-5-machinery"
            };

            foreach (var scId in allScenarios)
            {
                if (!completedIds.Contains(scId))
                {
                    return new RecommendationResult
                    {
                        scenarioId = scId,
                        scenarioTitle = GetScenarioTitle(scId),
                        recommendationReason = "Expand your vocational safety compliance to this essential industrial domain.",
                        priority = "recommended"
                    };
                }
            }

            // Rule 6: Advanced Challenge
            return new RecommendationResult
            {
                scenarioId = "scenario-4-mining",
                scenarioTitle = "Advanced Safety Scenario (Hard Mode)",
                recommendationReason = "All basic modules passed! Test rapid hazard recognition with shortened time limits.",
                priority = "advanced_challenge"
            };
        }

        private string GetScenarioTitle(string id)
        {
            switch (id)
            {
                case "scenario-1-ppe": return "PPE & Baseline Hazards";
                case "scenario-2-electrical": return "High-Voltage Substation";
                case "scenario-3-fire": return "Fire Safety & Evacuation";
                case "scenario-4-mining": return "Mining Haulage Safety";
                case "scenario-5-machinery": return "Heavy Machinery Guarding";
                default: return "Vocational Safety Module";
            }
        }
    }
}`
  },

  {
    id: "trainee-dashboard-ui",
    step: 6,
    filename: "TraineeDashboardUIController.cs",
    className: "TraineeDashboardUIController",
    namespace: "SIH26041.AR.UI",
    summary: "Coordinates the redesigned Trainee Dashboard UI, rendering XP progress, level badges, overall progress bar, streak counter, achievements cards, and tab routing.",
    targetGameObject: "Canvas_AR_HUD / TraineeDashboardPanel",
    requiredComponents: [],
    inspectorFields: [
      { name: "welcomeText", type: "TMPro.TextMeshProUGUI", description: "Trainee personalized greeting.", required: true },
      { name: "levelBadgeText", type: "TMPro.TextMeshProUGUI", description: "Displays Safety Level and Title.", required: true },
      { name: "xpSlider", type: "UnityEngine.UI.Slider", description: "Visual XP progress bar to next level.", required: true },
      { name: "xpProgressText", type: "TMPro.TextMeshProUGUI", description: "Text '780 / 1300 XP'.", required: true },
      { name: "overallProgressSlider", type: "UnityEngine.UI.Slider", description: "Percentage of all 5 vocational modules passed.", required: true },
      { name: "streakText", type: "TMPro.TextMeshProUGUI", description: "Current daily training streak text.", required: true },
      { name: "recommendationBannerText", type: "TMPro.TextMeshProUGUI", description: "Smart recommendation summary banner.", required: true }
    ],
    code: `using System;
using UnityEngine;
using UnityEngine.UI;
using TMPro;
using SIH26041.AR.Gamification;

namespace SIH26041.AR.UI
{
    /// <summary>
    /// Drives the high-contrast industrial Trainee Dashboard per Step 5 & 6 requirements.
    /// Handles XP progress updates, streak displays, and tab switching.
    /// </summary>
    public class TraineeDashboardUIController : MonoBehaviour
    {
        [Header("Header Elements")]
        [SerializeField] private TextMeshProUGUI welcomeText;
        [SerializeField] private TextMeshProUGUI levelBadgeText;
        [SerializeField] private Slider xpSlider;
        [SerializeField] private TextMeshProUGUI xpProgressText;

        [Header("Key KPI Cards")]
        [SerializeField] private Slider overallProgressSlider;
        [SerializeField] private TextMeshProUGUI overallProgressText;
        [SerializeField] private TextMeshProUGUI averageScoreText;
        [SerializeField] private TextMeshProUGUI scenariosCompletedText;
        [SerializeField] private TextMeshProUGUI streakText;

        [Header("Smart Recommendation")]
        [SerializeField] private GameObject recommendationBanner;
        [SerializeField] private TextMeshProUGUI recommendationTitleText;
        [SerializeField] private TextMeshProUGUI recommendationReasonText;
        [SerializeField] private Button recommendationLaunchButton;

        [Header("Action Buttons")]
        [SerializeField] private Button startTrainingButton;
        [SerializeField] private Button scenariosTabButton;
        [SerializeField] private Button achievementsTabButton;
        [SerializeField] private Button leaderboardTabButton;

        private void Start()
        {
            RefreshDashboard();

            if (GamificationManager.Instance != null)
            {
                GamificationManager.Instance.OnXPGained += (added, total) => RefreshDashboard();
                GamificationManager.Instance.OnLevelUp += (lvl, title) => RefreshDashboard();
                GamificationManager.Instance.OnStreakUpdated += (s) => RefreshDashboard();
            }
        }

        public void RefreshDashboard()
        {
            var gm = GamificationManager.Instance;
            if (gm == null) return;

            int xp = gm.CurrentXP;
            int level = gm.CurrentLevel;
            string levelTitle = gm.GetLevelTitle(level);
            var (minXP, maxXP) = gm.GetLevelBounds(level);

            if (welcomeText != null)
            {
                welcomeText.text = "Welcome, Anand Kumar";
            }

            if (levelBadgeText != null)
            {
                levelBadgeText.text = $"Level {level} &bull; {levelTitle}";
            }

            if (xpSlider != null)
            {
                int span = maxXP - minXP;
                int currentInSpan = xp - minXP;
                xpSlider.minValue = 0;
                xpSlider.maxValue = span > 0 ? span : 1;
                xpSlider.value = currentInSpan;
            }

            if (xpProgressText != null)
            {
                xpProgressText.text = $"{xp} / {maxXP + 1} XP";
            }

            if (streakText != null)
            {
                streakText.text = $"{gm.CurrentStreak} Day Streak (Best: {gm.BestStreak})";
            }
        }
    }
}`
  },

  {
    id: "scenario-completion-ui",
    step: 6,
    filename: "ScenarioCompletionUIController.cs",
    className: "ScenarioCompletionUIController",
    namespace: "SIH26041.AR.UI",
    summary: "Drives the post-scenario completion dialog presenting Score, Accuracy, XP Earned, Time Elapsed, Mistakes, Unlocked Badges, and smart next-step routing.",
    targetGameObject: "Canvas_AR_HUD / ScenarioCompletionModal",
    requiredComponents: [],
    inspectorFields: [
      { name: "scoreValueText", type: "TMPro.TextMeshProUGUI", description: "Score display '45 / 50'.", required: true },
      { name: "accuracyValueText", type: "TMPro.TextMeshProUGUI", description: "Accuracy percentage '90%'.", required: true },
      { name: "xpEarnedValueText", type: "TMPro.TextMeshProUGUI", description: "Total XP earned '+150 XP'.", required: true },
      { name: "timeValueText", type: "TMPro.TextMeshProUGUI", description: "Time taken '54s'.", required: true },
      { name: "hazardsFoundText", type: "TMPro.TextMeshProUGUI", description: "Hazards found '4 / 4'.", required: true },
      { name: "mistakesCountText", type: "TMPro.TextMeshProUGUI", description: "Incorrect taps penalty count.", required: true },
      { name: "retryButton", type: "UnityEngine.UI.Button", description: "Button to retry current scenario.", required: true },
      { name: "nextScenarioButton", type: "UnityEngine.UI.Button", description: "Button to advance to next recommended module.", required: true },
      { name: "dashboardButton", type: "UnityEngine.UI.Button", description: "Button to return to Trainee Dashboard.", required: true }
    ],
    code: `using System;
using UnityEngine;
using UnityEngine.UI;
using TMPro;
using SIH26041.AR.Gamification;

namespace SIH26041.AR.UI
{
    /// <summary>
    /// Displays post-scenario results with accuracy breakdown, XP rewards,
    /// unlocked achievements, and navigation buttons.
    /// </summary>
    public class ScenarioCompletionUIController : MonoBehaviour
    {
        [Header("Completion Stats")]
        [SerializeField] private TextMeshProUGUI scoreValueText;
        [SerializeField] private TextMeshProUGUI accuracyValueText;
        [SerializeField] private TextMeshProUGUI xpEarnedValueText;
        [SerializeField] private TextMeshProUGUI timeValueText;
        [SerializeField] private TextMeshProUGUI hazardsFoundText;
        [SerializeField] private TextMeshProUGUI mistakesCountText;

        [Header("Achievement Banner")]
        [SerializeField] private GameObject newAchievementBanner;
        [SerializeField] private TextMeshProUGUI achievementTitleText;

        [Header("Recommendation")]
        [SerializeField] private TextMeshProUGUI recommendationText;

        [Header("Navigation Buttons")]
        [SerializeField] private Button retryButton;
        [SerializeField] private Button nextScenarioButton;
        [SerializeField] private Button dashboardButton;

        public void DisplayCompletion(
            int score,
            int maxScore,
            int timeSeconds,
            int hazardsFound,
            int totalHazards,
            int mistakes,
            int xpEarned,
            string newAchievementTitle,
            string nextScenarioRecommendation)
        {
            gameObject.SetActive(true);

            float pct = maxScore > 0 ? ((float)score / maxScore) * 100f : 0f;

            if (scoreValueText != null)
                scoreValueText.text = $"{score} / {maxScore}";

            if (accuracyValueText != null)
                accuracyValueText.text = $"{Mathf.RoundToInt(pct)}%";

            if (xpEarnedValueText != null)
                xpEarnedValueText.text = $"+{xpEarned} XP";

            if (timeValueText != null)
                timeValueText.text = $"{timeSeconds}s";

            if (hazardsFoundText != null)
                hazardsFoundText.text = $"{hazardsFound} / {totalHazards}";

            if (mistakesCountText != null)
                mistakesCountText.text = mistakes.ToString();

            if (newAchievementBanner != null)
            {
                bool hasNewAch = !string.IsNullOrEmpty(newAchievementTitle);
                newAchievementBanner.SetActive(hasNewAch);
                if (hasNewAch && achievementTitleText != null)
                {
                    achievementTitleText.text = $"Unlocked: {newAchievementTitle}!";
                }
            }

            if (recommendationText != null && !string.IsNullOrEmpty(nextScenarioRecommendation))
            {
                recommendationText.text = $"Recommendation: {nextScenarioRecommendation}";
            }
        }
    }
}`
  },

  {
    id: "firebase-gamification-sync",
    step: 6,
    filename: "FirebaseGamificationSyncService.cs",
    className: "FirebaseGamificationSyncService",
    namespace: "SIH26041.AR.Firebase",
    summary: "Syncs XP, safety level, streak, achievements, and session records to Cloud Firestore. Implements offline queueing and idempotent UUID deduplication.",
    targetGameObject: "Services / FirebaseGamificationSyncService",
    requiredComponents: [],
    inspectorFields: [
      { name: "firestoreCollectionUsers", type: "string", description: "Firestore collection name for user profiles (Default: 'users').", required: true },
      { name: "firestoreCollectionLeaderboard", type: "string", description: "Firestore collection name for leaderboard (Default: 'leaderboard').", required: true },
      { name: "autoRetryIntervalSeconds", type: "float", description: "Interval to retry flushing pending offline records (Default: 30s).", required: true }
    ],
    code: `using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;

namespace SIH26041.AR.Firebase
{
    [System.Serializable]
    public class ProfileSyncPayload
    {
        public string traineeId;
        public string displayName;
        public int xp;
        public int level;
        public int currentStreak;
        public int bestStreak;
        public string lastActiveDate;
        public string[] unlockedAchievements;
        public string clientSyncId; // Idempotent deduplication key
    }

    /// <summary>
    /// Synchronizes gamification telemetry to Cloud Firestore.
    /// Handles offline persistence via PlayerPrefs and prevents duplicates.
    /// </summary>
    public class FirebaseGamificationSyncService : MonoBehaviour
    {
        public static FirebaseGamificationSyncService Instance { get; private set; }

        [SerializeField] private string apiEndpoint = "https://your-firebase-proxy/api/gamification/sync";
        [SerializeField] private float autoRetryIntervalSeconds = 30f;

        private const string PREF_OFFLINE_QUEUE = "SIH26041_PendingSyncQueue";

        private void Awake()
        {
            if (Instance == null)
            {
                Instance = this;
                DontDestroyOnLoad(gameObject);
                StartCoroutine(OfflineFlushLoop());
            }
            else
            {
                Destroy(gameObject);
            }
        }

        public void QueueProfileSync(ProfileSyncPayload payload)
        {
            if (payload == null) return;
            if (string.IsNullOrEmpty(payload.clientSyncId))
            {
                payload.clientSyncId = Guid.NewGuid().ToString();
            }

            StartCoroutine(PostProfileSync(payload));
        }

        private IEnumerator PostProfileSync(ProfileSyncPayload payload)
        {
            string json = JsonUtility.ToJson(payload);

            using (UnityWebRequest req = new UnityWebRequest(apiEndpoint, "POST"))
            {
                byte[] bodyRaw = System.Text.Encoding.UTF8.GetBytes(json);
                req.uploadHandler = new UploadHandlerRaw(bodyRaw);
                req.downloadHandler = new DownloadHandlerBuffer();
                req.SetRequestHeader("Content-Type", "application/json");

                yield return req.SendWebRequest();

                if (req.result != UnityWebRequest.Result.Success)
                {
                    Debug.LogWarning($"[FirebaseGamificationSync] Network offline or request failed ({req.error}). Storing locally.");
                    EnqueueOffline(json);
                }
                else
                {
                    Debug.Log($"[FirebaseGamificationSync] Profile & XP synced successfully to Firestore: {payload.displayName}");
                }
            }
        }

        private void EnqueueOffline(string json)
        {
            string current = PlayerPrefs.GetString(PREF_OFFLINE_QUEUE, "");
            string updated = string.IsNullOrEmpty(current) ? json : current + "|||" + json;
            PlayerPrefs.SetString(PREF_OFFLINE_QUEUE, updated);
            PlayerPrefs.Save();
        }

        private IEnumerator OfflineFlushLoop()
        {
            WaitForSeconds wait = new WaitForSeconds(autoRetryIntervalSeconds);
            while (true)
            {
                yield return wait;

                if (Application.internetReachability != NetworkReachability.NotReachable)
                {
                    string queue = PlayerPrefs.GetString(PREF_OFFLINE_QUEUE, "");
                    if (!string.IsNullOrEmpty(queue))
                    {
                        string[] items = queue.Split(new string[] { "|||" }, StringSplitOptions.RemoveEmptyEntries);
                        PlayerPrefs.DeleteKey(PREF_OFFLINE_QUEUE);
                        PlayerPrefs.Save();

                        foreach (var item in items)
                        {
                            var payload = JsonUtility.FromJson<ProfileSyncPayload>(item);
                            if (payload != null)
                            {
                                yield return PostProfileSync(payload);
                            }
                        }
                    }
                }
            }
        }
    }
}`
  }
];

// Step 6 Verification Checklist
export const STEP_6_CHECKLIST: ChecklistItem[] = [
  {
    id: "chk-6-1",
    category: "Gamification & XP System",
    title: "Configurable XP Rules & 5 Safety Levels",
    description: "Verified Level 1 (Trainee) to Level 5 (Leader) progression; correct hazard (+25 XP) and scenario completion (+100 XP) formulas.",
    completed: false
  },
  {
    id: "chk-6-2",
    category: "Gamification & XP System",
    title: "Activity Streak Counter with Health Boundary",
    description: "Consecutive day active tracking without toxic cooldowns; vocational-appropriate phrasing.",
    completed: false
  },
  {
    id: "chk-6-3",
    category: "Achievements & Badges",
    title: "7 Core Industrial Safety Badges Implemented",
    description: "First Training, Hazard Hunter, Safety Expert (90%+), Mining Guardian, Emergency Ready, Electrical Aware, and Safety Champion.",
    completed: false
  },
  {
    id: "chk-6-4",
    category: "Leaderboard & Privacy",
    title: "XP Ranked Leaderboard with Privacy-Friendly Display Names",
    description: "Displays Rank, Trainee (e.g., 'Rohan M. (Bokaro Steel Hub)'), XP, Level, Scenarios Completed, and Average Score without leaking raw emails.",
    completed: false
  },
  {
    id: "chk-6-5",
    category: "Trainee Dashboard UI",
    title: "Redesigned Professional Trainee Dashboard",
    description: "Welcome banner, Level badge, XP progress bar, Overall progress bar, Key stat cards, and quick navigation tabs.",
    completed: false
  },
  {
    id: "chk-6-6",
    category: "Scenario Cards & Recommendations",
    title: "Rich Scenario Cards & Deterministic Smart Recommendation",
    description: "Scenario cards show Industry, Difficulty, Best Score, Status, and XP reward. Local rule suggests refresher when score < 70%.",
    completed: false
  },
  {
    id: "chk-6-7",
    category: "Post-Scenario Completion Screen",
    title: "Scenario Completed Modal & Action Routing",
    description: "Displays Score, Accuracy %, XP Earned, Time Elapsed, Hazards Found, Mistakes, New Badges, Retry, and Next Scenario buttons.",
    completed: false
  },
  {
    id: "chk-6-8",
    category: "Firebase Firestore & Security",
    title: "Firestore Schema & Security Rules for Gamification",
    description: "Configured 'users/{uid}' for XP/levels/achievements, 'leaderboard/{uid}' for public XP ranks, and idempotent deduplication via clientSyncId.",
    completed: false
  },
  {
    id: "chk-6-9",
    category: "Offline Behavior & Performance",
    title: "Offline Storage & Idempotent Syncing",
    description: "Local PlayerPrefs queue caches achievements and training sessions when offline; flushes safely without duplicate records upon reconnection.",
    completed: false
  },
  {
    id: "chk-6-10",
    category: "Trainer Analytics Polish",
    title: "Trainer View Trainee-Level Breakdown & Metrics",
    description: "Total trainees, Average score, Pass rate, Weakest safety category, and scenario-level performance metrics.",
    completed: false
  }
];
