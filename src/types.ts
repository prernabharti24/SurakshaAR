export interface CSharpScript {
  id: string;
  name?: string;
  category?: string;
  description?: string;
  step: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  filename: string;
  className: string;
  namespace?: string;
  summary: string;
  targetGameObject: string;
  requiredComponents: string[];
  inspectorFields: {
    name: string;
    type: string;
    description: string;
    required: boolean;
  }[];
  dependencies?: string[];
  code: string;
}

export type ScenarioDifficulty = 'Easy' | 'Medium' | 'Hard';

export type ScenarioIndustry =
  | 'Gas Processing & Petrochemicals'
  | 'General Manufacturing'
  | 'Electrical Infrastructure'
  | 'Emergency Response'
  | 'Mining & Extraction'
  | 'Heavy Engineering';

export interface ScenarioHazardDef {
  id: string;
  title: string;
  titleHi?: string;
  category: string;
  categoryHi?: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  descriptionHi?: string;
  recommendation: string;
  recommendationHi?: string;
  standard?: string;
  isHazard: boolean;
  scoreImpact: number;
  correctAction: string;
  objectId: string;
  requiredForDifficulty?: ScenarioDifficulty[];
}

export interface ScenarioDefinition {
  id: string;
  number?: number;
  name: string;
  nameHi?: string;
  shortTitle: string;
  shortTitleHi?: string;
  industry: ScenarioIndustry;
  industryHi?: string;
  description: string;
  descriptionHi?: string;
  trainingObjectives: string[];
  trainingObjectivesHi?: string[];
  defaultDifficulty: ScenarioDifficulty;
  passingPercentage: number;
  timeLimitSeconds: Record<ScenarioDifficulty, number>;
  hazards: ScenarioHazardDef[];
  recommendedTraining: string;
  badge: string;
  badgeHi?: string;
  colorTheme: string;
  status?: 'active' | 'coming_soon';
}

export interface TraineeSessionRecord {
  id: string;
  traineeId: string;
  traineeName: string;
  scenarioId: string;
  scenarioName: string;
  industry: ScenarioIndustry;
  score: number;
  maxScore: number;
  percentage: number;
  status: 'Passed' | 'Failed' | 'Incomplete';
  weakestCategory: string;
  hazardsIdentified: string[];
  totalHazards: number;
  incorrectActions: number;
  timeSpentSeconds: number;
  difficulty: ScenarioDifficulty;
  timestamp: string;
  xpEarned?: number;
}

export interface SafetyLevel {
  level: number;
  title: string;
  minXP: number;
  maxXP: number;
  badgeColor: string;
  description: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  xpReward: number;
  category: 'general' | 'mining' | 'electrical' | 'fire' | 'mastery';
  isUnlocked: boolean;
  unlockedAt?: string;
  progress?: { current: number; total: number };
}

export interface LeaderboardEntry {
  rank: number;
  traineeId: string;
  displayName: string;
  affiliation?: string;
  xp: number;
  level: number;
  levelTitle: string;
  scenariosCompleted: number;
  averageScore: number;
  avatarColor: string;
  bestStreak: number;
}

export interface TraineeProfile {
  id: string;
  name: string;
  affiliation: string;
  xp: number;
  level: number;
  levelTitle: string;
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: string;
  unlockedAchievements: string[];
  completedScenarioIds: string[];
  bestScores: Record<string, number>;
}

export interface SmartRecommendation {
  scenarioId: string;
  scenarioName: string;
  shortTitle: string;
  reason: string;
  priority: 'urgent_remediation' | 'recommended' | 'advanced_challenge';
  industry: ScenarioIndustry;
}

export interface CompletionSummaryData {
  scenarioId: string;
  scenarioName: string;
  score: number;
  maxScore: number;
  percentage: number;
  accuracy: number;
  xpEarned: number;
  xpBreakdown: { item: string; amount: number }[];
  timeSpentSeconds: number;
  hazardsIdentified: number;
  totalHazards: number;
  mistakesCount: number;
  newAchievements: Achievement[];
  recommendation: SmartRecommendation;
  passed: boolean;
}

export interface GeminiHazardItem {
  type: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  recommendation: string;
  matchedObjectId?: string;
  isMatchExact?: boolean;
}

export interface GeminiSafetyAnalysis {
  overallRisk: 'Low' | 'Medium' | 'High';
  summary: string;
  hazards: GeminiHazardItem[];
  trainingRecommendation: string;
  timestamp?: string;
  modelUsed?: string;
  analyzedFrameDataUri?: string;
}

export interface HazardScenarioItem {
  id: string;
  name: string;
  category: 'hazard' | 'ppe' | 'safe';
  isHazard: boolean;
  title: string;
  explanation: string;
  recommendation: string;
  scoreImpact: number;
}

export interface SetupStep {
  id: string;
  title: string;
  category: 'engine' | 'android' | 'packages' | 'xr' | 'hierarchy' | 'prefab' | 'testing';
  summary: string;
  details: string[];
  codeOrConfig?: string;
  tips?: string[];
}

export interface ErrorTroubleshooting {
  id: string;
  errorTitle: string;
  symptom: string;
  rootCause: string;
  solutionSteps: string[];
  preventativeTip: string;
}

export interface ChecklistItem {
  id: string;
  category: string;
  title: string;
  description: string;
  completed: boolean;
  step?: number;
  fileReference?: string;
}

// ==========================================
// STEP 7 TYPES: MULTILINGUAL, ACCESSIBILITY, DEMO
// ==========================================

export type SupportedLanguage = 'en' | 'hi';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flagEmoji: string;
  ttsVoiceCode: string;
}

export type TextScaleLevel = 'normal' | 'large' | 'xlarge';

export interface AccessibilityConfig {
  textSize: TextScaleLevel;
  highContrast: boolean;
  voiceEnabled: boolean;
  voiceVolume: number; // 0 to 1
  colorIndependentIcons: boolean;
}

export interface SafetyTerminologyItem {
  id: string;
  termEn: string;
  termHi: string;
  category: 'ppe' | 'electrical' | 'mining' | 'emergency' | 'machinery';
  definitionEn: string;
  definitionHi: string;
  regulationRef?: string;
  iconName?: string;
}

export interface LocalizedScenarioContent {
  scenarioId: string;
  titleEn: string;
  titleHi: string;
  shortTitleEn: string;
  shortTitleHi: string;
  descriptionEn: string;
  descriptionHi: string;
  instructionsEn: string[];
  instructionsHi: string[];
  completionMessageEn: string;
  completionMessageHi: string;
  safetyRecommendationsEn: string[];
  safetyRecommendationsHi: string[];
  hazardsLocalized: {
    hazardId: string;
    titleEn: string;
    titleHi: string;
    descriptionEn: string;
    descriptionHi: string;
    correctActionEn: string;
    correctActionHi: string;
  }[];
}

export interface DemoTraineeRecord {
  id: string;
  name: string;
  isDemoRecord: true;
  avatarColor: string;
  xp: number;
  level: number;
  levelTitleEn: string;
  levelTitleHi: string;
  score: number;
  scenarioId: string;
  completedAt: string;
}

export interface PresentationSlide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  iconName: string;
  keyStats: { label: string; value: string; color: string }[];
  bulletPoints: { title: string; desc: string }[];
  impactCallout: string;
}

// Step 8 Integration, QA & Production Readiness Types
export type UserRole = 'trainee' | 'trainer' | 'admin';

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  traineeId?: string;
  level?: number;
  xp?: number;
  status?: 'active' | 'suspended';
  token?: string;
  createdAt?: string;
  isAnonymous?: boolean;
  assignedModules?: string[];
  disabledModules?: string[];
  progressRate?: number;
  safetyScore?: number;
  quizScore?: number;
  completedModules?: string[];
  lastActive?: string;
}

export interface AdminUserRecord {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  traineeId?: string;
  level?: number;
  xp?: number;
  status: 'active' | 'suspended';
  createdAt: string;
  lastLoginAt: string;
  assignedModules?: string[];
  disabledModules?: string[];
  progressRate?: number;
  safetyScore?: number;
  quizScore?: number;
  completedModules?: string[];
}

export interface AdminTraineeRecord {
  uid: string;
  email: string;
  displayName: string;
  traineeId: string;
  status: 'active' | 'suspended';
  assignedModules: string[];
  disabledModules: string[];
  progressRate: number;
  safetyScore: number;
  quizScore: number;
  xp: number;
  completedModules: string[];
  lastActive: string;
  createdAt: string;
}

export interface QuizTestResult {
  id: string;
  traineeUid: string;
  traineeName: string;
  traineeId: string;
  traineeEmail: string;
  scenarioId: string;
  scenarioName: string;
  practicalScore: number;
  quizScore: number;
  finalScore: number;
  completionDate: string;
  status: 'Passed' | 'Failed';
}

export interface HelpRequestItem {
  id: string;
  traineeUid: string;
  traineeName: string;
  traineeId: string;
  traineeEmail: string;
  type: 'Safety Question' | 'Training Problem' | 'Technical Issue' | 'Other';
  query: string;
  date: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High';
  adminReply?: string;
  repliedAt?: string;
}

export interface SafetyModuleInfo {
  id: string;
  number: number;
  name: string;
  shortTitle: string;
  industry: string;
  description: string;
  hazardFocus?: string;
  isCompliant?: string;
  iconName: string;
}

export const CANONICAL_MODULES: SafetyModuleInfo[] = [
  {
    id: 'scenario-1-ppe',
    number: 1,
    name: 'PPE & Workplace Hazard Identification',
    shortTitle: 'PPE & Hazard Identification',
    industry: 'General Manufacturing Workshop',
    description: 'Inspect workshop, identify missing safety hard hat, missing retro-reflective vest, exposed 440V live cable, and machine guarding.',
    hazardFocus: 'IS 2925 / IS 15809 / IS 15298 PPE Compliance & Floor Obstructions',
    isCompliant: 'IS 2925, IS 15809',
    iconName: 'HardHat'
  },
  {
    id: 'scenario-2-fire',
    number: 2,
    name: 'Fire Safety & Emergency Evacuation',
    shortTitle: 'Industrial Fire Safety & Evacuation',
    industry: 'Industrial Facility & Flammable Storage',
    description: 'Transformer fire emergency, strike break-glass manual alarm, operate DCP extinguisher using P.A.S.S., clear exit routes, and evacuate disoriented workers.',
    hazardFocus: 'Class B/C Flammable Vapors, PASS Extinguisher, Emergency Evacuation',
    isCompliant: 'IS 2190, NFPA 10',
    iconName: 'Flame'
  },
  {
    id: 'scenario-3-electrical',
    number: 3,
    name: 'High-Voltage Electrical Substation Safety',
    shortTitle: 'High-Voltage Substation Safety',
    industry: 'Electrical Infrastructure',
    description: 'High-voltage 440V distribution risks, standing liquid flashover puddles, dielectric insulating gloves (IS 4770), and Lockout/Tagout isolation.',
    hazardFocus: '440V Busbar Isolation, Lockout/Tagout (LOTO), Arc Flash Boundary',
    isCompliant: 'CEA 2010 Reg 30, NFPA 70E',
    iconName: 'Zap'
  },
  {
    id: 'scenario-4-mining',
    number: 4,
    name: 'Underground Coal Mining & Haulage Safety',
    shortTitle: 'Underground & Haulage Road Safety',
    industry: 'Mining & Extraction',
    description: 'Underground roadway haulage blind spots, unsupported rock strata fracture, LED cap lamp compliance, and DGMS retreat guidelines.',
    hazardFocus: 'Strata Failure Warning, Methane (CH4)/CO Monitoring, Self-Rescuer Deployment',
    isCompliant: 'DGMS Reg 108 & 110 (Coal Mines Regs 2017)',
    iconName: 'Pickaxe'
  },
  {
    id: 'scenario-5-machinery',
    number: 5,
    name: 'Heavy Industrial Machinery & Nip-Point Guarding',
    shortTitle: 'Heavy Machinery & Conveyor Safety',
    industry: 'Heavy Engineering & Materials Handling',
    description: 'Unguarded conveyor nip point hazards, emergency trip-wire pulls, loose clothing entrapment risks, and yellow demarcation boundary compliance.',
    hazardFocus: 'Pinch Point Guarding, Pull-Cord Emergency Stops, Pre-Start Alarms',
    isCompliant: 'IS 14886 / Factories Act 1948 Sec 21',
    iconName: 'Wrench'
  }
];

export interface SystemConfig {
  passingScorePercentage: number;
  sessionTimeoutSeconds: number;
  aiEvaluationModel: string;
  strictDgmsCompliance: boolean;
  allowOfflineSync: boolean;
  maintenanceMode: boolean;
  emergencyBroadcastMessage: string | null;
  lastUpdated: string;
  updatedBy: string;
}

export interface QATestCase {
  id: string;
  category:
    | 'Auth & Profile'
    | 'AR & Hardware'
    | 'Scenarios & Interaction'
    | 'Scoring & Pass/Fail'
    | 'Gemini AI & Fallback'
    | 'Firebase & Offline Sync'
    | 'Gamification & XP'
    | 'Localization & Voice'
    | 'Accessibility'
    | 'Demo Mode & Resilience';
  title: string;
  steps: string[];
  expectedResult: string;
  status: 'pass' | 'fail' | 'blocked';
  severity: 'critical' | 'high' | 'medium';
  notes?: string;
}

export interface ApplicationFlowStep {
  stepNumber: number;
  id: string;
  name: string;
  sourceScreen: string;
  targetScreen: string;
  keyAction: string;
  stateValidation: string[];
  failureFallback: string;
  isCompleted: boolean;
}

export interface SecurityAuditItem {
  id: string;
  category: string;
  aspect: string;
  status: 'passed' | 'warning' | 'needs_action';
  verificationMethod: string;
  productionRule: string;
}

export interface PerformanceAuditMetric {
  metric: string;
  targetMidRange: string;
  budgetLimit: string;
  simulatedValue: string;
  status: 'optimal' | 'acceptable' | 'warning';
  optimizationApplied: string;
}

// ==========================================
// 12. ANIMATED SAFETY TUTORIAL TYPES
// ==========================================
export interface TutorialStep {
  stepNumber: number;
  titleEn: string;
  titleHi: string;
  shortTextEn: string;
  shortTextHi: string;
  narrationEn: string;
  narrationHi: string;
  actionType: string;
  iconName: string;
  unsafeWarning?: {
    labelEn: string;
    labelHi: string;
    descriptionEn: string;
    descriptionHi: string;
  };
  safeConfirmation: {
    labelEn: string;
    labelHi: string;
    descriptionEn: string;
    descriptionHi: string;
  };
  ruleBadge?: string;
}

export interface TutorialQuizOption {
  id: string;
  textEn: string;
  textHi: string;
  iconName: string;
  isCorrect: boolean;
  explanationEn: string;
  explanationHi: string;
}

export interface TutorialQuiz {
  questionEn: string;
  questionHi: string;
  scenarioContextEn: string;
  scenarioContextHi: string;
  options: TutorialQuizOption[];
  xpReward: number;
}

export interface AnimatedTutorialDefinition {
  scenarioId: string;
  scenarioNameEn: string;
  scenarioNameHi: string;
  industry: ScenarioIndustry;
  badge: string;
  totalSteps: number;
  steps: TutorialStep[];
  quiz: TutorialQuiz;
}

// ==========================================
// 13. VIRTUAL INDUSTRIAL SAFETY ENVIRONMENT TYPES
// ==========================================
export type VirtualEnvironmentId = 'manufacturing' | 'mining';
export type SimulationTrainingMode = 'practice' | 'assessment' | 'surprise';
export type SimulationDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type VirtualHazardType =
  | 'fire'
  | 'electrical'
  | 'machinery'
  | 'ppe'
  | 'restricted'
  | 'gas'
  | 'roof'
  | 'alarm';

export interface DecisionOption {
  id: string;
  keyLabel: string; // 'A', 'B', 'C', 'D'
  textEn: string;
  textHi: string;
  isCorrect: boolean;
  explanationEn: string;
  explanationHi: string;
  consequenceEn?: string;
  consequenceHi?: string;
  standardRule?: string;
}

export interface IncidentDecisionStage {
  stageNumber: number;
  totalStages: number;
  stageNameEn: string;
  stageNameHi: string;
  situationEn: string;
  situationHi: string;
  promptEn: string;
  promptHi: string;
  options: DecisionOption[];
  timerSeconds: number;
}

export interface VirtualSafetyEvent {
  id: string;
  environmentId: VirtualEnvironmentId;
  hazardType: VirtualHazardType;
  titleEn: string;
  titleHi: string;
  descriptionEn: string;
  descriptionHi: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  triggerDelaySeconds: number;
  iconName: string;
  visualLocation: {
    x: number; // percentage 0-100 on canvas
    y: number; // percentage 0-100 on canvas
    areaNameEn: string;
    areaNameHi: string;
  };
  stages: IncidentDecisionStage[];
  remediationTag: 'fire' | 'electrical' | 'ppe' | 'mining' | 'machinery';
}

export interface VirtualHotspot {
  id: string;
  nameEn: string;
  nameHi: string;
  category: 'ppe' | 'machine' | 'exit' | 'fire' | 'electrical' | 'restricted' | 'warning';
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  status: 'normal' | 'hazard' | 'warning';
  inspectionInfoEn: string;
  inspectionInfoHi: string;
  ruleCode?: string;
}

export interface EnvironmentDefinition {
  id: VirtualEnvironmentId;
  nameEn: string;
  nameHi: string;
  subtitleEn: string;
  subtitleHi: string;
  industry: ScenarioIndustry;
  regulatoryStandard: string;
  descriptionEn: string;
  descriptionHi: string;
  hotspots: VirtualHotspot[];
  availableEvents: VirtualSafetyEvent[];
}

export interface SimulationScoreMetrics {
  overallScore: number;
  hazardRecognition: number;
  decisionMaking: number;
  emergencyResponse: number;
  totalDecisions: number;
  correctDecisions: number;
  incorrectDecisions: number;
  averageReactionTimeSeconds: number;
  xpEarned: number;
  eventsEncountered: number;
  eventsResolved: number;
}

export interface VirtualAdaptiveRecommendation {
  recommendedModule: string;
  targetId: string;
  moduleType: 'tutorial' | 'scenario' | 'practice';
  topic: 'fire' | 'electrical' | 'ppe' | 'mining' | 'machinery';
  reasonEn: string;
  reasonHi: string;
  priority: 'urgent' | 'recommended';
}

// ==========================================
// 14. IMMERSIVE VIDEO-LIKE SIMULATION TYPES
// ==========================================
export type SimulationPhase =
  | 'normal'
  | 'warning'
  | 'incident'
  | 'decision'
  | 'consequence'
  | 'solution'
  | 'practice'
  | 'score';

export type ImmersiveScenarioId =
  | 'fire-emergency'
  | 'electrical-incident'
  | 'mining-incident'
  | 'machinery-incident'
  | 'ppe-hazard-id';

export interface SafetyProcedureStep {
  stepNumber: number;
  icon: string;
  actionEn: string;
  actionHi: string;
  detailEn: string;
  detailHi: string;
  standardRef?: string;
}

export interface HazardIdentificationItem {
  id: string;
  nameEn: string;
  nameHi: string;
  x: number; // percentage 0-100 on canvas
  y: number; // percentage 0-100 on canvas
  isActualHazard: boolean;
  hazardType?: 'missing_ppe' | 'electrical' | 'housekeeping' | 'machinery' | 'chemical' | 'structural';
  descriptionEn: string;
  descriptionHi: string;
  remedyEn?: string;
  remedyHi?: string;
  standardRef?: string;
}

export interface ImmersiveScenarioDefinition {
  id: ImmersiveScenarioId;
  titleEn: string;
  titleHi: string;
  subtitleEn: string;
  subtitleHi: string;
  environmentType: 'manufacturing' | 'mining' | 'electrical' | 'machinery';
  regulatoryStandard: string;
  ambientSoundType: 'factory' | 'mining' | 'electrical' | 'heavy-machinery';
  phases: {
    normal: {
      descriptionEn: string;
      descriptionHi: string;
      narrationEn: string;
      narrationHi: string;
      durationSeconds: number;
    };
    warning: {
      warningTextEn: string;
      warningTextHi: string;
      narrationEn: string;
      narrationHi: string;
      visualCue: string;
      durationSeconds: number;
    };
    incident: {
      incidentTitleEn: string;
      incidentTitleHi: string;
      incidentDescriptionEn: string;
      incidentDescriptionHi: string;
      voiceAlertEn: string;
      voiceAlertHi: string;
      visualEffect: 'fire_smoke' | 'electrical_arc' | 'roof_collapse' | 'conveyor_jam' | 'gas_leak';
      severity: 'high' | 'critical';
      durationSeconds: number;
    };
    decision: IncidentDecisionStage;
    consequence: {
      safeResultEn: string;
      safeResultHi: string;
      unsafeResultEn: string;
      unsafeResultHi: string;
      visualConsequence: string;
    };
    solution: {
      titleEn: string;
      titleHi: string;
      summaryEn: string;
      summaryHi: string;
      steps: SafetyProcedureStep[];
      prohibitedActionsEn: string[];
      prohibitedActionsHi: string[];
    };
  };
  hazardItems?: HazardIdentificationItem[];
}export interface AdminTraineeRecord {
  uid: string;
  email: string;
  displayName: string;
  role: 'trainee' | 'trainer' | 'admin';
  status: 'active' | 'suspended';
  traineeId: string;
  level: number;
  xp: number;
  assignedModules: string[];
  disabledModules: string[];
  progressRate: number;
  safetyScore: number;
  quizScore: number;
  completedModules: string[];
  lastActive: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface QuizTestResult {
  id: string;
  traineeUid: string;
  traineeName: string;
  traineeId: string;
  traineeEmail: string;
  scenarioId: string;
  scenarioName: string;
  practicalScore: number;
  quizScore: number;
  finalScore: number;
  completionDate: string;
  status: 'Passed' | 'Failed';
}

export interface HelpRequestItem {
  id: string;
  traineeUid: string;
  traineeName: string;
  traineeId: string;
  traineeEmail: string;
  type: 'Safety Question' | 'Training Problem' | 'Technical Issue' | 'Other';
  query: string;
  date: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High';
  adminReply?: string;
  repliedAt?: string;
}


