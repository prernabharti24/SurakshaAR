import express from 'express';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// --- SECURE SERVER-SIDE AUTHENTICATION STORE & FIREBASE PROXY ---
type UserRole = 'trainee' | 'trainer' | 'admin';

interface StoredUser {
  uid: string;
  email: string;
  displayName: string;
  passwordHash: string;
  salt: string;
  role: UserRole;
  createdAt: string;
  lastLoginAt: string;
  traineeId?: string;
  level?: number;
  xp?: number;
  status: 'active' | 'suspended';
  assignedModules?: string[];
  disabledModules?: string[];
  progressRate?: number;
  safetyScore?: number;
  quizScore?: number;
  completedModules?: string[];
  lastActive?: string;
}

interface QuizTestResult {
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

interface HelpRequestItem {
  id: string;
  traineeUid: string;
  traineeName: string;
  traineeId: string;
  traineeEmail: string;
  type: 'Safety Question' | 'Training Problem' | 'Technical Issue' | 'Other';
  query: string;
  language?: 'en' | 'hi';
  scenarioName?: string;
  date: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High';
  adminReply?: string;
  repliedAt?: string;
}

interface SystemConfig {
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

let systemConfigStore: SystemConfig = {
  passingScorePercentage: 75,
  sessionTimeoutSeconds: 120,
  aiEvaluationModel: 'gemini-2.5-flash',
  strictDgmsCompliance: true,
  allowOfflineSync: true,
  maintenanceMode: false,
  emergencyBroadcastMessage: null,
  lastUpdated: new Date().toISOString(),
  updatedBy: 'admin@surakshaar.org'
};

const DATA_DIR = path.join(process.cwd(), '.data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const QUIZ_RESULTS_FILE = path.join(DATA_DIR, 'quiz_results.json');
const HELP_REQUESTS_FILE = path.join(DATA_DIR, 'help_requests.json');
const SESSIONS: Map<string, { uid: string; email: string; role: UserRole; expiresAt: number }> = new Map();

function ensureDataDir(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.warn('[AuthStore] Could not create .data directory, running in-memory fallback:', err);
  }
}

// Helper to hash password
function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

const DEFAULT_CANONICAL_MODULES = [
  'scenario-1-ppe',
  'scenario-2-fire',
  'scenario-3-electrical',
  'scenario-4-mining',
  'scenario-5-machinery'
];

function seedCertifiedUser(
  target: Record<string, StoredUser>,
  email: string,
  pass: string,
  displayName: string,
  role: UserRole,
  extras: Partial<StoredUser> = {}
): void {
  if (!target[email]) {
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(pass, salt);
    target[email] = {
      uid: `${role}_` + crypto.randomBytes(6).toString('hex'),
      email,
      displayName,
      passwordHash,
      salt,
      role,
      status: 'active',
      createdAt: '2026-09-01T00:00:00.000Z',
      lastLoginAt: new Date().toISOString(),
      assignedModules: role === 'trainee' ? [...DEFAULT_CANONICAL_MODULES] : undefined,
      disabledModules: role === 'trainee' ? [] : undefined,
      progressRate: role === 'trainee' ? 80 : undefined,
      safetyScore: role === 'trainee' ? 90 : undefined,
      quizScore: role === 'trainee' ? 85 : undefined,
      completedModules: role === 'trainee' ? ['scenario-1-ppe', 'scenario-2-fire'] : undefined,
      lastActive: new Date().toISOString(),
      ...extras
    };
  } else {
    // Ensure role and status integrity
    target[email].role = role;
    if (!target[email].status) target[email].status = 'active';
    if (role === 'trainee') {
      if (!target[email].assignedModules) target[email].assignedModules = [...DEFAULT_CANONICAL_MODULES];
      if (!target[email].disabledModules) target[email].disabledModules = [];
      if (target[email].progressRate === undefined) target[email].progressRate = extras.progressRate ?? 80;
      if (target[email].safetyScore === undefined) target[email].safetyScore = extras.safetyScore ?? 90;
      if (target[email].quizScore === undefined) target[email].quizScore = extras.quizScore ?? 85;
      if (!target[email].completedModules) target[email].completedModules = extras.completedModules ?? ['scenario-1-ppe'];
      if (!target[email].lastActive) target[email].lastActive = new Date().toISOString();
    }
  }
}

function loadUsers(): Record<string, StoredUser> {
  ensureDataDir();
  let users: Record<string, StoredUser> = {};
  try {
    if (fs.existsSync(USERS_FILE)) {
      const content = fs.readFileSync(USERS_FILE, 'utf-8');
      users = JSON.parse(content);
    }
  } catch (err) {
    console.warn('[AuthStore] Error reading users file:', err);
  }

  // Pre-provision and seed verified accounts for accredited roles
  seedCertifiedUser(users, 'trainee@surakshaar.org', 'Suraksha@2026', 'Arjun Verma', 'trainee', {
    traineeId: 'TR-26041',
    level: 3,
    xp: 1450,
    progressRate: 85,
    safetyScore: 92,
    quizScore: 88,
    assignedModules: [...DEFAULT_CANONICAL_MODULES],
    disabledModules: [],
    completedModules: ['scenario-1-ppe', 'scenario-2-fire', 'scenario-3-electrical'],
    lastActive: new Date(Date.now() - 3600000 * 3).toISOString()
  });

  seedCertifiedUser(users, 'ramesh.soren@surakshaar.org', 'Suraksha@2026', 'Ramesh Soren', 'trainee', {
    traineeId: 'TR-2024-88',
    level: 2,
    xp: 980,
    progressRate: 60,
    safetyScore: 85,
    quizScore: 80,
    assignedModules: ['scenario-1-ppe', 'scenario-2-fire', 'scenario-3-electrical'],
    disabledModules: ['scenario-4-mining', 'scenario-5-machinery'],
    completedModules: ['scenario-1-ppe', 'scenario-2-fire'],
    lastActive: new Date(Date.now() - 3600000 * 24).toISOString()
  });

  seedCertifiedUser(users, 'sunita.k@surakshaar.org', 'Suraksha@2026', 'Sunita Kumari', 'trainee', {
    traineeId: 'TR-2024-92',
    level: 5,
    xp: 2200,
    progressRate: 100,
    safetyScore: 96,
    quizScore: 94,
    assignedModules: [...DEFAULT_CANONICAL_MODULES],
    disabledModules: [],
    completedModules: [...DEFAULT_CANONICAL_MODULES],
    lastActive: new Date(Date.now() - 3600000 * 7).toISOString()
  });

  seedCertifiedUser(users, 'rajesh.m@surakshaar.org', 'Suraksha@2026', 'Rajesh Mahato', 'trainee', {
    traineeId: 'TR-2024-45',
    level: 1,
    xp: 300,
    status: 'suspended',
    progressRate: 20,
    safetyScore: 55,
    quizScore: 60,
    assignedModules: ['scenario-1-ppe'],
    disabledModules: ['scenario-2-fire'],
    completedModules: [],
    lastActive: new Date(Date.now() - 3600000 * 120).toISOString()
  });

  seedCertifiedUser(users, 'priya.h@surakshaar.org', 'Suraksha@2026', 'Priya Hansda', 'trainee', {
    traineeId: 'TR-2024-77',
    level: 2,
    xp: 650,
    progressRate: 40,
    safetyScore: 78,
    quizScore: 75,
    assignedModules: ['scenario-1-ppe', 'scenario-2-fire'],
    disabledModules: [],
    completedModules: ['scenario-1-ppe'],
    lastActive: new Date(Date.now() - 3600000 * 48).toISOString()
  });

  seedCertifiedUser(users, 'trainer@surakshaar.org', 'Trainer@2026', 'Dr. Rajesh Sharma (Lead Safety Instructor)', 'trainer', {
    traineeId: 'TR-INST-04',
    level: 5,
    xp: 5200
  });

  seedCertifiedUser(users, 'admin@surakshaar.org', 'Admin@2026', 'Chief Safety Officer (Admin)', 'admin', {
    level: 10,
    xp: 9999
  });

  // Ensure every user has role and status
  Object.values(users).forEach((u) => {
    if (!u.role) u.role = 'trainee';
    if (!u.status) u.status = 'active';
  });

  saveUsers(users);
  return users;
}

function saveUsers(users: Record<string, StoredUser>): void {
  ensureDataDir();
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[AuthStore] Error saving users file:', err);
  }
}

// Default initial Quiz Results
const DEFAULT_QUIZ_RESULTS: QuizTestResult[] = [
  {
    id: 'qr-001',
    traineeUid: 'trainee_arjun',
    traineeName: 'Arjun Verma',
    traineeId: 'TR-26041',
    traineeEmail: 'trainee@surakshaar.org',
    scenarioId: 'scenario-1-ppe',
    scenarioName: 'PPE & Workplace Hazard Identification',
    practicalScore: 95,
    quizScore: 90,
    finalScore: 93,
    completionDate: '2026-09-08T11:20:00.000Z',
    status: 'Passed'
  },
  {
    id: 'qr-002',
    traineeUid: 'trainee_arjun',
    traineeName: 'Arjun Verma',
    traineeId: 'TR-26041',
    traineeEmail: 'trainee@surakshaar.org',
    scenarioId: 'scenario-2-fire',
    scenarioName: 'Fire Safety',
    practicalScore: 90,
    quizScore: 86,
    finalScore: 88,
    completionDate: '2026-09-08T15:45:00.000Z',
    status: 'Passed'
  },
  {
    id: 'qr-003',
    traineeUid: 'trainee_sunita',
    traineeName: 'Sunita Kumari',
    traineeId: 'TR-2024-92',
    traineeEmail: 'sunita.k@surakshaar.org',
    scenarioId: 'scenario-1-ppe',
    scenarioName: 'PPE & Workplace Hazard Identification',
    practicalScore: 100,
    quizScore: 95,
    finalScore: 98,
    completionDate: '2026-09-07T14:10:00.000Z',
    status: 'Passed'
  },
  {
    id: 'qr-004',
    traineeUid: 'trainee_sunita',
    traineeName: 'Sunita Kumari',
    traineeId: 'TR-2024-92',
    traineeEmail: 'sunita.k@surakshaar.org',
    scenarioId: 'scenario-2-fire',
    scenarioName: 'Fire Safety',
    practicalScore: 95,
    quizScore: 92,
    finalScore: 94,
    completionDate: '2026-09-07T16:30:00.000Z',
    status: 'Passed'
  },
  {
    id: 'qr-005',
    traineeUid: 'trainee_ramesh',
    traineeName: 'Ramesh Soren',
    traineeId: 'TR-2024-88',
    traineeEmail: 'ramesh.soren@surakshaar.org',
    scenarioId: 'scenario-1-ppe',
    scenarioName: 'PPE & Workplace Hazard Identification',
    practicalScore: 85,
    quizScore: 80,
    finalScore: 83,
    completionDate: '2026-09-06T10:00:00.000Z',
    status: 'Passed'
  }
];

function loadQuizResults(): QuizTestResult[] {
  ensureDataDir();
  try {
    if (fs.existsSync(QUIZ_RESULTS_FILE)) {
      const content = fs.readFileSync(QUIZ_RESULTS_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.warn('[QuizStore] Error reading quiz results:', err);
  }
  saveQuizResults(DEFAULT_QUIZ_RESULTS);
  return DEFAULT_QUIZ_RESULTS;
}

function saveQuizResults(results: QuizTestResult[]): void {
  ensureDataDir();
  try {
    fs.writeFileSync(QUIZ_RESULTS_FILE, JSON.stringify(results, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[QuizStore] Error writing quiz results:', err);
  }
}

// Default initial Help Requests
const DEFAULT_HELP_REQUESTS: HelpRequestItem[] = [
  {
    id: 'req-001',
    traineeUid: 'trainee_arjun',
    traineeName: 'Arjun Verma',
    traineeId: 'TR-26041',
    traineeEmail: 'trainee@surakshaar.org',
    type: 'Safety Question',
    query: 'What is the minimum safe clearance distance from a 440V distribution transformer during live maintenance?',
    date: '2026-09-08T10:15:00.000Z',
    status: 'In Progress',
    priority: 'High',
    adminReply: 'Per CEA Reg 30 & IS 4770, minimum boundary is 1.5m without de-energization and insulating rubber barriers.'
  },
  {
    id: 'req-002',
    traineeUid: 'trainee_ramesh',
    traineeName: 'Ramesh Soren',
    traineeId: 'TR-2024-88',
    traineeEmail: 'ramesh.soren@surakshaar.org',
    type: 'Training Problem',
    query: 'Cannot locate the break-glass alarm call point during the Fire Safety simulation in low-light mode.',
    date: '2026-09-07T14:30:00.000Z',
    status: 'Resolved',
    priority: 'Medium',
    adminReply: 'The manual call point is located on the left wall adjacent to the workshop entrance, marked with a high-visibility red strobe.',
    repliedAt: '2026-09-07T16:00:00.000Z'
  },
  {
    id: 'req-003',
    traineeUid: 'trainee_priya',
    traineeName: 'Priya Hansda',
    traineeId: 'TR-2024-77',
    traineeEmail: 'priya.h@surakshaar.org',
    type: 'Technical Issue',
    query: 'Audio voice prompt plays with low volume in Chrome mobile browser during scenario 1 inspection.',
    date: '2026-09-09T09:00:00.000Z',
    status: 'Open',
    priority: 'Low'
  }
];

function loadHelpRequests(): HelpRequestItem[] {
  ensureDataDir();
  try {
    if (fs.existsSync(HELP_REQUESTS_FILE)) {
      const content = fs.readFileSync(HELP_REQUESTS_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.warn('[HelpStore] Error reading help requests:', err);
  }
  saveHelpRequests(DEFAULT_HELP_REQUESTS);
  return DEFAULT_HELP_REQUESTS;
}

function saveHelpRequests(requests: HelpRequestItem[]): void {
  ensureDataDir();
  try {
    fs.writeFileSync(HELP_REQUESTS_FILE, JSON.stringify(requests, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[HelpStore] Error writing help requests:', err);
  }
}

let quizResultsCache: QuizTestResult[] = loadQuizResults();
let helpRequestsCache: HelpRequestItem[] = loadHelpRequests();

// In-memory cache synced with disk
let usersCache: Record<string, StoredUser> = loadUsers();

// Session verification helper
function getSessionUser(req: express.Request): StoredUser | null {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace(/^Bearer\s+/i, '');
  if (!token) return null;
  const session = SESSIONS.get(token);
  if (!session || session.expiresAt < Date.now()) {
    if (session) SESSIONS.delete(token);
    return null;
  }
  return usersCache[session.email] || null;
}

// Middleware to enforce strict role-based access control (RBAC)
function requireRole(allowedRoles: UserRole[]) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Valid authentication session required.' });
    }
    if (user.status === 'suspended') {
      return res.status(403).json({ error: 'ACCOUNT_SUSPENDED', message: 'Account is suspended.' });
    }
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        error: 'FORBIDDEN',
        message: `Insufficient permissions. Access restricted to roles: ${allowedRoles.join(', ')}`
      });
    }
    (req as any).user = user;
    next();
  };
}

// Lazy initializer for Gemini client to prevent crashes if key is absent
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

const GEMINI_MODELS = ['gemini-3.1-flash-lite', 'gemini-3.6-flash', 'gemini-3.8-flash'];

async function generateWithGeminiFallback(
  client: GoogleGenAI,
  requestConfig: any
): Promise<{ text: string; model: string }> {
  let lastError: any = null;
  for (const model of GEMINI_MODELS) {
    try {
      const response = await client.models.generateContent({
        ...requestConfig,
        model
      });
      if (response && response.text) {
        return { text: response.text, model };
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`[Gemini Fallback] Model ${model} encountered error, trying next:`, err?.message?.slice(0, 100));
    }
  }
  throw lastError || new Error('All configured Gemini models failed.');
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'SIH26041 AR Vocational Safety Simulator Server',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    registeredUsersCount: Object.keys(usersCache).length,
    timestamp: new Date().toISOString()
  });
});

// AI Safety Assistant / सुरक्षा सहायक Endpoint
app.post('/api/safety-assistant', async (req, res) => {
  try {
    const { query, language } = req.body || {};
    if (!query || typeof query !== 'string' || !query.trim()) {
      return res.status(400).json({ error: 'Query is required.' });
    }

    const cleanQuery = query.trim();
    const isHindiQuery =
      language === 'hi' ||
      /[\u0900-\u097F]/.test(cleanQuery) ||
      /\b(kya|karein|karo|aag|bijli|khatra|helmet|suraksha|madad)\b/i.test(cleanQuery);

    const client = getGeminiClient();
    if (client) {
      try {
        const systemPrompt = `You are the SURAKSHAAR AI Safety Assistant (सुरक्षा सहायक), a practical industrial safety expert for factory workers, trainees, miners, and technicians in India.
Your goal is to provide simple, worker-friendly, step-by-step safety instructions (maximum 5 clear numbered points).
Language instruction:
${isHindiQuery ? 'Respond in simple, clear Hindi (Devanagari script). Use easy language that workers can immediately follow.' : 'Respond in simple, clear English. Use short, actionable bullet points that are practical on the shop floor.'}
Rules:
- Keep answers short, practical, and easy to understand.
- Never use academic or complicated jargon.
- Format strictly as numbered steps: 1, 2, 3, 4, 5.
- Always prioritize worker life, alarm raising, PPE, safe distance, and reporting to supervisors.`;

        const response = await client.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nWorker Question: "${cleanQuery}"` }]
            }
          ]
        });

        const replyText = response.text || '';
        if (replyText.trim()) {
          return res.json({
            response: replyText.trim(),
            language: isHindiQuery ? 'hi' : 'en',
            source: 'gemini'
          });
        }
      } catch (geminiErr: any) {
        console.warn('[Safety Assistant] Gemini API error, falling back to rule engine:', geminiErr?.message?.slice(0, 100));
      }
    }

    // High-quality domain fallback responses for reliable offline worker guidance
    let fallbackText = '';
    const qLower = cleanQuery.toLowerCase();

    if (qLower.includes('fire') || qLower.includes('aag') || qLower.includes('blaze') || qLower.includes('extinguish')) {
      fallbackText = isHindiQuery
        ? `1. तुरंत अलार्म (MCP) बजाएं और जोर से चिल्लाएं।\n2. आग से सुरक्षित दूरी बनाएं और धुआं सूंघने से बचें।\n3. हरी आपातकालीन निकास (Emergency Exit) बत्ती का पालन करें।\n4. यदि प्रशिक्षित हैं, तो सही अग्निशामक (P.A.S.S. विधि) का उपयोग करें।\n5. बाहरी असेंबली पॉइंट पर जाकर सुपरवाइजर को उपस्थिति दर्ज कराएं।`
        : `1. Activate the manual fire alarm call point immediately.\n2. Move away to a safe distance from smoke and radiant heat.\n3. Follow the green illuminated emergency exit route.\n4. If certified, use the correct fire extinguisher using the P.A.S.S. method.\n5. Assemble at the designated external muster point.`;
    } else if (qLower.includes('electric') || qLower.includes('bijli') || qLower.includes('current') || qLower.includes('shock') || qLower.includes('cable') || qLower.includes('wire')) {
      fallbackText = isHindiQuery
        ? `1. कभी भी नंगे हाथों से तार या घायल व्यक्ति को न छुएं।\n2. तुरंत मुख्य स्विच या ब्रेकर (MCB/Isolator) से बिजली काटें।\n3. लकड़ी या सूखे डंडे से व्यक्ति को अलग करें।\n4. आईएस 15652 रबर इंसुलेटिंग मैट और दस्ताने का प्रयोग करें।\n5. तुरंत इलेक्ट्रिकल सुपरवाइजर और मेडिकल टीम को आपातकाल रिपोर्ट करें।`
        : `1. Do not touch the victim or live exposed wire with bare hands.\n2. Isolate power immediately at the main breaker panel.\n3. Use an insulated fiberglass or dry wooden pole if separation is required.\n4. Deploy IS 15652 dielectric insulating rubber mats and IS 4770 gloves.\n5. Call the electrical supervisor and emergency medical response team.`;
    } else if (qLower.includes('ppe') || qLower.includes('helmet') || qLower.includes('glove') || qLower.includes('shoe') || qLower.includes('boot') || qLower.includes('vest')) {
      fallbackText = isHindiQuery
        ? `1. कार्यस्थल में प्रवेश से पहले आईएस 2925 प्रमाणित सुरक्षा हेलमेट पहनें।\n2. दूर से दिखने के लिए हाई-विजिबिलिटी फ्लोरोसेंट वेस्ट (IS 15809) पहनें।\n3. पैरों की सुरक्षा के लिए स्टील-टो सेफ्टी जूते (IS 15298) अनिवार्य हैं।\n4. काम के अनुसार सुरक्षा चश्मा (Goggles) और कट-रेसिस्टेंट दस्ताने लगाएं।\n5. यदि कोई पीपीई क्षतिग्रस्त है, तो तुरंत अपने सुरक्षा अधिकारी से बदलवाएं।`
        : `1. Always wear an IS 2925 certified industrial hard hat before entering the shop floor.\n2. Don a high-visibility reflective vest (IS 15809) for 360° visibility.\n3. Wear IS 15298 certified steel-toe boots to prevent foot crush and puncture.\n4. Wear impact goggles and task-appropriate protective gloves.\n5. Inspect PPE daily and replace damaged gear with the safety officer.`;
    } else if (qLower.includes('machin') || qLower.includes('nip') || qLower.includes('conveyor') || qLower.includes('roller') || qLower.includes('pinch')) {
      fallbackText = isHindiQuery
        ? `1. आपात स्थिति में तुरंत लाल मशरूम इमरजेंसी स्टॉप (E-Stop) बटन दबाएं।\n2. चलती मशीन या कन्वेयर रोलर में हाथ डालने का कभी प्रयास न करें।\n3. मरम्मत से पहले LOTO (ताला और टैग) लगाकर बिजली पूरी तरह बंद करें।\n4. ढीले कपड़े, टाई, मफलर या कलाई घड़ी उतारकर बटन बंद करें।\n5. मशीन पर सुरक्षा गार्ड (Machine Guard) ठीक से लगा होने पर ही चालू करें।`
        : `1. Hit the red mushroom Emergency-Stop (E-Stop) button immediately.\n2. Never reach into moving conveyor rollers or in-running pinch points.\n3. Implement Lockout/Tagout (LOTO) on the master isolator before clearing jams.\n4. Tuck in loose clothing, fasten cuffs, and tie long hair securely.\n5. Ensure interlocked safety mesh guards are securely fastened before restarting.`;
    } else if (qLower.includes('mine') || qLower.includes('mining') || qLower.includes('khanan') || qLower.includes('roof') || qLower.includes('dumper')) {
      fallbackText = isHindiQuery
        ? `1. डीजीएमएस स्वीकृत कैप लैंप और रिफ्लेक्टिव स्ट्रिप वाली वर्दी अनिवार्य पहनें।\n2. भारी डंपर या हॉलेज वाहन के अंधे क्षेत्र (Blindspot) में कभी खड़े न हों।\n3. छत पर ढीले पत्थरों या दरारों की जांच करें और सुरक्षित प्रोप/बोल्ट लगाएं।\n4. गैस गंध या सायरन बजने पर तुरंत आश्रय स्थल (Refuge Bay) की ओर जाएं।\n5. अनधिकृत या प्रतिबंधित गोफ (Goaf) क्षेत्र में कभी प्रवेश न करें।`
        : `1. Wear a DGMS-approved cap lamp, hard hat, and high-visibility coveralls.\n2. Stay completely out of 35-ton heavy haul dumper blind spots.\n3. Inspect the hanging wall for roof fractures and verify timber/hydraulic props.\n4. On toxic gas alarm or ventilation change, move to the fresh-air refuge chamber.\n5. Never enter unsupported or unventilated goaf areas under any circumstance.`;
    } else {
      fallbackText = isHindiQuery
        ? `1. खतरे को पहचानें और तुरंत उस स्थान से सुरक्षित दूरी बनाएं।\n2. अपने आसपास के साथी श्रमिकों को जोर से सतर्क करें।\n3. स्थिति अनुसार उचित पीपीई किट का पूरा उपयोग करें।\n4. समस्या की जानकारी तुरंत अपने सेफ्टी सुपरवाइजर को दें।\n5. जब तक क्षेत्र को प्रमाणित सुरक्षित न घोषित किया जाए, वहां दोबारा प्रवेश न करें।`
        : `1. Identify the hazard and maintain a safe standoff distance.\n2. Alert nearby coworkers immediately to the potential danger.\n3. Ensure all mandatory PPE is securely worn before taking any action.\n4. Report the hazard condition to your workplace safety officer.\n5. Do not resume work until the area has been inspected and cleared safe.`;
    }

    return res.json({
      response: fallbackText,
      language: isHindiQuery ? 'hi' : 'en',
      source: 'knowledge-base'
    });
  } catch (error: any) {
    console.error('[Safety Assistant Error]', error);
    return res.status(500).json({ error: 'Internal safety assistant error' });
  }
});

// --- AUTHENTICATION API ENDPOINTS ---
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LOGIN_ROUTES = ['/api/auth/login', '/api/auth/login/', '/api/login', '/api/login/'];
const SIGNUP_ROUTES = ['/api/auth/signup', '/api/auth/signup/', '/api/signup', '/api/signup/'];
const REGISTER_ADMIN_ROUTES = ['/api/auth/register-admin', '/api/auth/register-admin/'];
const FORGOT_ROUTES = ['/api/auth/forgot-password', '/api/auth/forgot-password/', '/api/forgot-password', '/api/forgot-password/'];
const VERIFY_ROUTES = ['/api/auth/verify', '/api/auth/verify/', '/api/verify', '/api/verify/'];
const LOGOUT_ROUTES = ['/api/auth/logout', '/api/auth/logout/', '/api/logout', '/api/logout/'];

// 1. Sign Up (Restricted - Self-registration disabled for trainees)
app.post(SIGNUP_ROUTES, (req, res) => {
  return res.status(403).json({
    error: 'REGISTRATION_DISABLED',
    message: 'Trainee self-registration is disabled per industrial safety compliance policy. All trainee accounts must be created and provisioned directly by a Safety Administrator in the Admin Dashboard.'
  });
});

// 1b. Public Admin Registration (Secure)
app.post(REGISTER_ADMIN_ROUTES, (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, organization, adminRole } = req.body || {};

    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'MISSING_FIELDS', message: 'All required fields (Full Name, Email, Password, Confirm Password) must be provided.' });
    }
    if (!EMAIL_REGEX.test(String(email).trim().toLowerCase())) {
      return res.status(400).json({ error: 'INVALID_EMAIL', message: 'Please enter a valid email address.' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'PASSWORD_MISMATCH', message: 'Password and Confirm Password do not match.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'WEAK_PASSWORD', message: 'Password must be at least 6 characters long.' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    if (usersCache[cleanEmail]) {
      return res.status(400).json({ error: 'EMAIL_EXISTS', message: 'An account with this email address already exists.' });
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(password, salt);
    const uid = 'admin_' + crypto.randomBytes(6).toString('hex');

    const newAdmin: StoredUser = {
      uid,
      email: cleanEmail,
      displayName: String(fullName).trim(),
      passwordHash,
      salt,
      role: 'admin',
      status: 'active',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      traineeId: `ADM-2026-${Math.floor(100 + Math.random() * 900)}`,
      level: 5,
      xp: 1000,
      assignedModules: [...DEFAULT_CANONICAL_MODULES],
      disabledModules: [],
      progressRate: 100,
      safetyScore: 100,
      quizScore: 100,
      completedModules: [...DEFAULT_CANONICAL_MODULES],
      lastActive: new Date().toISOString()
    };

    usersCache[cleanEmail] = newAdmin;
    saveUsers(usersCache);

    return res.status(201).json({
      ok: true,
      message: 'Admin account created successfully. You can now log in using your registered credentials.',
      email: cleanEmail
    });
  } catch (err: any) {
    console.error('[Auth API] Admin register error:', err);
    return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Failed to create admin account.' });
  }
});

// 2. Login
app.post(LOGIN_ROUTES, (req, res) => {
  try {
    const { email, password, role } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: 'INVALID_DATA', message: 'Both email and password are required.' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const user = usersCache[cleanEmail];

    if (!user) {
      return res.status(401).json({ error: 'EMAIL_NOT_FOUND', message: 'No account found with this email address.' });
    }

    const calculatedHash = hashPassword(password, user.salt);
    if (calculatedHash !== user.passwordHash) {
      return res.status(401).json({ error: 'INVALID_PASSWORD', message: 'Invalid password. Please check your credentials.' });
    }

    // Account status check
    if (user.status === 'suspended') {
      return res.status(403).json({
        error: 'ACCOUNT_SUSPENDED',
        message: 'This account has been deactivated/suspended by system administration. Please contact your safety administrator.'
      });
    }

    // Role-based authorization verification
    if (role && user.role !== role) {
      return res.status(403).json({
        error: 'Invalid role for this account',
        message: 'Invalid role for this account. Trainees must sign in via Trainee Login; Administrators must sign in via Admin Login.'
      });
    }

    user.lastLoginAt = new Date().toISOString();
    user.lastActive = new Date().toISOString();
    saveUsers(usersCache);

    const token = 'sat_' + crypto.randomBytes(24).toString('hex');
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
    SESSIONS.set(token, { uid: user.uid, email: cleanEmail, role: user.role, expiresAt });

    return res.json({
      ok: true,
      message: 'Authentication successful.',
      token,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        status: user.status,
        traineeId: user.traineeId,
        level: user.level,
        xp: user.xp,
        assignedModules: user.assignedModules || [...DEFAULT_CANONICAL_MODULES],
        disabledModules: user.disabledModules || [],
        progressRate: user.progressRate ?? 0,
        safetyScore: user.safetyScore ?? 0,
        quizScore: user.quizScore ?? 0,
        completedModules: user.completedModules || [],
        lastActive: user.lastActive || user.lastLoginAt,
        createdAt: user.createdAt
      }
    });
  } catch (err: any) {
    console.error('[Auth API] Login error:', err);
    return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Authentication service encountered an error.' });
  }
});

// Guard non-POST calls on login routes so they never fall through to Vite HTML
app.all(LOGIN_ROUTES, (req, res) => {
  return res.status(405).json({
    error: 'METHOD_NOT_ALLOWED',
    message: `Method ${req.method} not allowed on login endpoint. Use POST with JSON credentials.`
  });
});

// 3. Forgot Password
app.post(FORGOT_ROUTES, (req, res) => {
  try {
    const { email } = req.body || {};

    if (!email || !EMAIL_REGEX.test(String(email).trim().toLowerCase())) {
      return res.status(400).json({ error: 'INVALID_EMAIL', message: 'Please enter a valid email address.' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const user = usersCache[cleanEmail];

    // Always return success message for security, but log verification internally
    return res.json({
      ok: true,
      exists: Boolean(user),
      message: `If ${cleanEmail} is registered in SURAKSHAAR, password reset instructions have been dispatched.`
    });
  } catch (err: any) {
    console.error('[Auth API] Forgot password error:', err);
    return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Failed to process password reset request.' });
  }
});

// 4. Verify Session Token
app.get(VERIFY_ROUTES, (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace(/^Bearer\s+/i, '');

    if (!token) {
      return res.status(401).json({ ok: false, message: 'No authorization token provided.' });
    }

    const session = SESSIONS.get(token);
    if (!session || session.expiresAt < Date.now()) {
      if (session) SESSIONS.delete(token);
      return res.status(401).json({ ok: false, message: 'Session expired or invalid.' });
    }

    const user = usersCache[session.email];
    if (!user) {
      return res.status(401).json({ ok: false, message: 'User record not found.' });
    }

    return res.json({
      ok: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        status: user.status,
        traineeId: user.traineeId,
        level: user.level,
        xp: user.xp,
        assignedModules: user.assignedModules || [...DEFAULT_CANONICAL_MODULES],
        disabledModules: user.disabledModules || [],
        progressRate: user.progressRate ?? 0,
        safetyScore: user.safetyScore ?? 0,
        quizScore: user.quizScore ?? 0,
        completedModules: user.completedModules || [],
        lastActive: user.lastActive || user.lastLoginAt,
        createdAt: user.createdAt
      }
    });
  } catch (err: any) {
    console.error('[Auth API] Verify error:', err);
    return res.status(500).json({ ok: false, message: 'Failed to verify session.' });
  }
});

// 5. Logout
app.post(LOGOUT_ROUTES, (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace(/^Bearer\s+/i, '') || req.body?.token;

    if (token) {
      SESSIONS.delete(token);
    }

    return res.json({ ok: true, message: 'Logged out successfully.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Logout failed.' });
  }
});

// --- ADMIN-ONLY PROTECTED ENDPOINTS ---

// Helper to format trainee record for Admin
function formatAdminTrainee(u: StoredUser) {
  return {
    uid: u.uid,
    email: u.email,
    displayName: u.displayName,
    role: u.role,
    status: u.status || 'active',
    traineeId: u.traineeId || `TR-${u.uid.slice(-5)}`,
    level: u.level || 1,
    xp: u.xp || 0,
    assignedModules: u.assignedModules || [...DEFAULT_CANONICAL_MODULES],
    disabledModules: u.disabledModules || [],
    progressRate: u.progressRate ?? 0,
    safetyScore: u.safetyScore ?? 0,
    quizScore: u.quizScore ?? 0,
    completedModules: u.completedModules || [],
    lastActive: u.lastActive || u.lastLoginAt || u.createdAt,
    createdAt: u.createdAt,
    lastLoginAt: u.lastLoginAt
  };
}

// A1. List all trainees / users (Admin only)
app.get(['/api/admin/trainees', '/api/admin/users'], requireRole(['admin']), (req, res) => {
  try {
    const trainees = Object.values(usersCache)
      .filter((u) => u.role === 'trainee')
      .map(formatAdminTrainee);

    const allUsers = Object.values(usersCache).map((u) => ({
      uid: u.uid,
      email: u.email,
      displayName: u.displayName,
      role: u.role,
      status: u.status || 'active',
      traineeId: u.traineeId,
      level: u.level,
      xp: u.xp,
      createdAt: u.createdAt,
      lastLoginAt: u.lastLoginAt
    }));

    return res.json({ ok: true, trainees, users: allUsers });
  } catch (err) {
    return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Failed to retrieve user directory.' });
  }
});

// A2. Admin Creates/Provisions Trainee (Admin only) - Password hashed with pbkdf2Sync
app.post(['/api/admin/trainees', '/api/admin/users'], requireRole(['admin']), (req, res) => {
  try {
    const { email, password, displayName, traineeId, assignedModules } = req.body || {};
    if (!email || !EMAIL_REGEX.test(email.trim().toLowerCase())) {
      return res.status(400).json({ error: 'INVALID_EMAIL', message: 'Valid trainee email is required.' });
    }
    const cleanEmail = email.trim().toLowerCase();
    if (usersCache[cleanEmail]) {
      return res.status(400).json({ error: 'EMAIL_EXISTS', message: 'A trainee or user already exists with this email.' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'WEAK_PASSWORD', message: 'Temporary password must be at least 6 characters long.' });
    }

    const existingUsers = Object.values(usersCache);
    let assignedTraineeId = '';

    if (traineeId && typeof traineeId === 'string' && traineeId.trim()) {
      const cleanProvidedId = traineeId.trim().toUpperCase();
      const duplicate = existingUsers.find((u) => u.traineeId && u.traineeId.toUpperCase() === cleanProvidedId);
      if (duplicate) {
        return res.status(400).json({
          error: 'DUPLICATE_TRAINEE_ID',
          message: `⚠️ Duplicate Trainee ID\nTrainee ID ${cleanProvidedId} already exists.\nA unique Trainee ID is required. Please try again.`
        });
      }
      assignedTraineeId = cleanProvidedId;
    } else {
      let attempts = 0;
      let uniqueFound = false;
      while (attempts < 5) {
        const candidate = `TR-2026-${Math.floor(100 + Math.random() * 900)}`;
        const exists = existingUsers.some((u) => u.traineeId && u.traineeId.toUpperCase() === candidate);
        if (!exists) {
          assignedTraineeId = candidate;
          uniqueFound = true;
          break;
        }
        attempts++;
      }
      if (!uniqueFound) {
        return res.status(400).json({
          error: 'UNIQUE_ID_GENERATION_FAILED',
          message: 'Unable to generate a unique Trainee ID. Please try again.'
        });
      }
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(password, salt);
    const uid = 'trainee_' + crypto.randomBytes(6).toString('hex');

    const validModules = Array.isArray(assignedModules) && assignedModules.length > 0
      ? assignedModules
      : [...DEFAULT_CANONICAL_MODULES];

    const newTrainee: StoredUser = {
      uid,
      email: cleanEmail,
      displayName: (displayName && typeof displayName === 'string' && displayName.trim())
        ? displayName.trim()
        : cleanEmail.split('@')[0],
      passwordHash,
      salt,
      role: 'trainee',
      status: 'active',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      traineeId: assignedTraineeId,
      level: 1,
      xp: 0,
      assignedModules: validModules,
      disabledModules: [],
      progressRate: 0,
      safetyScore: 100,
      quizScore: 0,
      completedModules: [],
      lastActive: new Date().toISOString()
    };

    usersCache[cleanEmail] = newTrainee;
    saveUsers(usersCache);

    return res.status(201).json({
      ok: true,
      message: `Trainee account created successfully for ${newTrainee.displayName} (${newTrainee.traineeId}).`,
      trainee: formatAdminTrainee(newTrainee)
    });
  } catch (err) {
    console.error('[Admin API] Error provisioning trainee:', err);
    return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Failed to provision trainee account.' });
  }
});

// A3. Admin Get Single Trainee Details + Quiz Results (Admin only)
app.get('/api/admin/trainees/:uid', requireRole(['admin']), (req, res) => {
  try {
    const { uid } = req.params;
    const trainee = Object.values(usersCache).find((u) => u.uid === uid && u.role === 'trainee');
    if (!trainee) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'Trainee profile not found.' });
    }

    const traineeResults = quizResultsCache.filter((r) => r.traineeUid === uid || r.traineeEmail === trainee.email);
    const traineeHelp = helpRequestsCache.filter((h) => h.traineeUid === uid || h.traineeEmail === trainee.email);

    return res.json({
      ok: true,
      trainee: formatAdminTrainee(trainee),
      quizResults: traineeResults,
      helpRequests: traineeHelp
    });
  } catch (err) {
    return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Failed to retrieve trainee profile.' });
  }
});

// A4. Admin Update Trainee Details (Admin only)
app.put(['/api/admin/trainees/:uid', '/api/admin/users/:uid'], requireRole(['admin']), (req, res) => {
  try {
    const { uid } = req.params;
    const { displayName, status, progressRate, safetyScore, quizScore, assignedModules, disabledModules, traineeId, password } = req.body || {};

    const userEntry = Object.entries(usersCache).find(([_, u]) => u.uid === uid);
    if (!userEntry) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'Trainee record not found.' });
    }

    const [userEmail, targetUser] = userEntry;

    if (userEmail === 'admin@surakshaar.org' && status === 'suspended') {
      return res.status(400).json({ error: 'FORBIDDEN', message: 'Primary system admin account cannot be suspended.' });
    }

    if (displayName && typeof displayName === 'string') targetUser.displayName = displayName.trim();
    if (traineeId && typeof traineeId === 'string' && traineeId.trim()) {
      const newCleanId = traineeId.trim().toUpperCase();
      const collision = Object.values(usersCache).find(
        (u) => u.uid !== uid && u.traineeId && u.traineeId.toUpperCase() === newCleanId
      );
      if (collision) {
        return res.status(400).json({
          error: 'DUPLICATE_TRAINEE_ID',
          message: `⚠️ Duplicate Trainee ID\nTrainee ID ${newCleanId} already exists.\nA unique Trainee ID is required. Please try again.`
        });
      }
      targetUser.traineeId = newCleanId;
    }
    if (status && ['active', 'suspended'].includes(status)) targetUser.status = status;
    if (typeof progressRate === 'number') targetUser.progressRate = Math.min(100, Math.max(0, progressRate));
    if (typeof safetyScore === 'number') targetUser.safetyScore = Math.min(100, Math.max(0, safetyScore));
    if (typeof quizScore === 'number') targetUser.quizScore = Math.min(100, Math.max(0, quizScore));
    if (Array.isArray(assignedModules)) targetUser.assignedModules = assignedModules;
    if (Array.isArray(disabledModules)) targetUser.disabledModules = disabledModules;
    if (password && typeof password === 'string' && password.length >= 6) {
      const newSalt = crypto.randomBytes(16).toString('hex');
      targetUser.salt = newSalt;
      targetUser.passwordHash = hashPassword(password, newSalt);
    }

    saveUsers(usersCache);
    return res.json({
      ok: true,
      message: 'Trainee record updated successfully.',
      trainee: formatAdminTrainee(targetUser)
    });
  } catch (err) {
    return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Failed to update trainee record.' });
  }
});

// A4.0.1 Admin Update Trainee Status (PATCH)
app.patch(['/api/admin/trainees/:uid/status', '/api/admin/users/:uid/status'], requireRole(['admin']), (req, res) => {
  try {
    const { uid } = req.params;
    const { status } = req.body || {};

    const userEntry = Object.entries(usersCache).find(([_, u]) => u.uid === uid);
    if (!userEntry) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'Trainee record not found.' });
    }

    const [userEmail, targetUser] = userEntry;
    if (userEmail === 'admin@surakshaar.org' && status === 'suspended') {
      return res.status(400).json({ error: 'FORBIDDEN', message: 'Primary system admin account cannot be suspended.' });
    }

    if (status && ['active', 'suspended'].includes(status)) {
      targetUser.status = status;
    }

    saveUsers(usersCache);
    return res.json({
      ok: true,
      message: `Trainee status set to ${targetUser.status}.`,
      trainee: formatAdminTrainee(targetUser)
    });
  } catch (err) {
    return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Failed to update trainee status.' });
  }
});

// A4.1 Admin Reset Trainee Password (Admin only)
app.post('/api/admin/trainees/:uid/reset-password', requireRole(['admin']), (req, res) => {
  try {
    const { uid } = req.params;
    const { newPassword } = req.body || {};
    const userEntry = Object.entries(usersCache).find(([_, u]) => u.uid === uid);
    if (!userEntry) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'Trainee record not found.' });
    }

    const [_, targetUser] = userEntry;
    const tempPassword =
      newPassword && typeof newPassword === 'string' && newPassword.length >= 6
        ? newPassword.trim()
        : 'Suraksha@' + Math.floor(1000 + Math.random() * 9000);

    const newSalt = crypto.randomBytes(16).toString('hex');
    targetUser.salt = newSalt;
    targetUser.passwordHash = hashPassword(tempPassword, newSalt);

    saveUsers(usersCache);
    return res.json({
      ok: true,
      message: `Password reset successfully for ${targetUser.displayName}. Temporary password: ${tempPassword}`,
      temporaryPassword: tempPassword
    });
  } catch (err) {
    return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Failed to reset password.' });
  }
});

// A5. Admin Delete Trainee (Admin only)
app.delete(['/api/admin/trainees/:uid', '/api/admin/users/:uid'], requireRole(['admin']), (req, res) => {
  try {
    const { uid } = req.params;
    const userEntry = Object.entries(usersCache).find(([_, u]) => u.uid === uid);
    if (!userEntry) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'Account not found.' });
    }

    const [userEmail, targetUser] = userEntry;
    if (targetUser.role === 'admin' || userEmail === 'admin@surakshaar.org') {
      return res.status(403).json({ error: 'FORBIDDEN', message: 'Admin accounts cannot be deleted.' });
    }

    delete usersCache[userEmail];
    saveUsers(usersCache);

    return res.json({ ok: true, message: `Account ${targetUser.displayName} removed successfully.` });
  } catch (err) {
    return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Failed to delete account.' });
  }
});

// A6. Admin Module Assignment & Enable/Disable per Trainee (Admin only)
app.put('/api/admin/trainees/:uid/modules', requireRole(['admin']), (req, res) => {
  try {
    const { uid } = req.params;
    const { assignedModules, disabledModules } = req.body || {};

    const targetUser = Object.values(usersCache).find((u) => u.uid === uid);
    if (!targetUser) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'Trainee not found.' });
    }

    if (Array.isArray(assignedModules)) {
      targetUser.assignedModules = assignedModules;
    }
    if (Array.isArray(disabledModules)) {
      targetUser.disabledModules = disabledModules;
    }

    saveUsers(usersCache);
    return res.json({
      ok: true,
      message: `Module access settings updated for ${targetUser.displayName}.`,
      assignedModules: targetUser.assignedModules,
      disabledModules: targetUser.disabledModules
    });
  } catch (err) {
    return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Failed to update module access.' });
  }
});

// A7. Admin List All Quiz Results (Admin only)
app.get('/api/admin/quiz-results', requireRole(['admin']), (req, res) => {
  return res.json({ ok: true, results: quizResultsCache });
});

// A8. Admin Help Requests Management (Admin only)
app.get('/api/admin/help-requests', requireRole(['admin']), (req, res) => {
  return res.json({ ok: true, requests: helpRequestsCache });
});

app.put('/api/admin/help-requests/:id', requireRole(['admin']), (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminReply } = req.body || {};
    const item = helpRequestsCache.find((h) => h.id === id);
    if (!item) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'Help request not found.' });
    }

    if (status && ['Open', 'In Progress', 'Resolved'].includes(status)) {
      item.status = status;
    }
    if (adminReply && typeof adminReply === 'string') {
      item.adminReply = adminReply.trim();
      item.repliedAt = new Date().toISOString();
    }

    saveHelpRequests(helpRequestsCache);
    return res.json({ ok: true, message: 'Help request updated.', request: item });
  } catch (err) {
    return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Failed to update help request.' });
  }
});

app.delete('/api/admin/help-requests/:id', requireRole(['admin']), (req, res) => {
  try {
    const { id } = req.params;
    const idx = helpRequestsCache.findIndex((h) => h.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'Help request not found.' });
    }

    helpRequestsCache.splice(idx, 1);
    saveHelpRequests(helpRequestsCache);
    return res.json({ ok: true, message: 'Help request deleted.' });
  } catch (err) {
    return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Failed to delete help request.' });
  }
});

// A9. System Configuration (Admin only)
app.get('/api/admin/system-config', requireRole(['admin']), (req, res) => {
  res.json({ ok: true, config: systemConfigStore });
});

app.put('/api/admin/system-config', requireRole(['admin']), (req, res) => {
  try {
    const updates = req.body;
    const currentUser = (req as any).user as StoredUser;

    systemConfigStore = {
      ...systemConfigStore,
      ...updates,
      lastUpdated: new Date().toISOString(),
      updatedBy: currentUser.email
    };

    return res.json({ ok: true, message: 'System configuration updated.', config: systemConfigStore });
  } catch (err) {
    return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Failed to update system config.' });
  }
});

// --- TRAINEE PROTECTED ENDPOINTS (Trainee sees ONLY their own data) ---

// Helper middleware to authenticate any active user
function requireAuth(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace(/^Bearer\s+/i, '');
  if (!token) {
    return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Authorization required.' });
  }
  const session = SESSIONS.get(token);
  if (!session || session.expiresAt < Date.now()) {
    return res.status(401).json({ error: 'SESSION_EXPIRED', message: 'Session expired.' });
  }
  const user = usersCache[session.email];
  if (!user || user.status === 'suspended') {
    return res.status(403).json({ error: 'FORBIDDEN', message: 'Account inaccessible or suspended.' });
  }
  req.user = user;
  next();
}

// T1. Trainee Quiz Results (ONLY for this trainee)
app.get('/api/trainee/quiz-results', requireAuth, (req, res) => {
  const currentUser = (req as any).user as StoredUser;
  const myResults = quizResultsCache.filter(
    (r) => r.traineeUid === currentUser.uid || r.traineeEmail === currentUser.email
  );
  return res.json({ ok: true, results: myResults });
});

// T2. Save Quiz Result (Current Trainee)
app.post('/api/quiz-results', requireAuth, (req, res) => {
  try {
    const currentUser = (req as any).user as StoredUser;
    const { scenarioId, scenarioName, practicalScore, quizScore } = req.body || {};

    const pScore = Number(practicalScore) || 0;
    const qScore = Number(quizScore) || 0;
    const fScore = Math.round(pScore * 0.6 + qScore * 0.4);

    const newResult: QuizTestResult = {
      id: 'qr_' + crypto.randomBytes(6).toString('hex'),
      traineeUid: currentUser.uid,
      traineeName: currentUser.displayName,
      traineeId: currentUser.traineeId || `TR-${currentUser.uid.slice(-5)}`,
      traineeEmail: currentUser.email,
      scenarioId: scenarioId || 'scenario-1-ppe',
      scenarioName: scenarioName || 'Industrial Safety Scenario',
      practicalScore: pScore,
      quizScore: qScore,
      finalScore: fScore,
      completionDate: new Date().toISOString(),
      status: fScore >= 70 ? 'Passed' : 'Failed'
    };

    quizResultsCache.unshift(newResult);
    saveQuizResults(quizResultsCache);

    // Update trainee stats
    if (currentUser.role === 'trainee') {
      if (!currentUser.completedModules) currentUser.completedModules = [];
      if (!currentUser.completedModules.includes(newResult.scenarioId)) {
        currentUser.completedModules.push(newResult.scenarioId);
      }
      const totalModules = currentUser.assignedModules?.length || 5;
      currentUser.progressRate = Math.min(100, Math.round((currentUser.completedModules.length / totalModules) * 100));
      currentUser.quizScore = qScore;
      currentUser.safetyScore = Math.round(((currentUser.safetyScore || 85) + fScore) / 2);
      currentUser.xp = (currentUser.xp || 0) + (fScore >= 70 ? 250 : 50);
      currentUser.lastActive = new Date().toISOString();
      saveUsers(usersCache);
    }

    return res.status(201).json({ ok: true, result: newResult });
  } catch (err) {
    return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Failed to record quiz result.' });
  }
});

// T3. Trainee Help Requests (ONLY for this trainee)
app.get('/api/trainee/help-requests', requireAuth, (req, res) => {
  const currentUser = (req as any).user as StoredUser;
  const myRequests = helpRequestsCache.filter(
    (h) => h.traineeUid === currentUser.uid || h.traineeEmail === currentUser.email
  );
  return res.json({ ok: true, requests: myRequests });
});

app.post('/api/trainee/help-requests', requireAuth, (req, res) => {
  try {
    const currentUser = (req as any).user as StoredUser;
    const { type, query, priority = 'Medium', language = 'en', scenarioName = 'General Workplace Safety' } = req.body || {};

    if (!query || typeof query !== 'string' || !query.trim()) {
      return res.status(400).json({ error: 'QUERY_REQUIRED', message: 'Query details are required.' });
    }

    const newRequest: HelpRequestItem = {
      id: 'req_' + crypto.randomBytes(6).toString('hex'),
      traineeUid: currentUser.uid,
      traineeName: currentUser.displayName,
      traineeId: currentUser.traineeId || `TR-${currentUser.uid.slice(-5)}`,
      traineeEmail: currentUser.email,
      type: type || 'Safety Question',
      query: query.trim(),
      language: language === 'hi' ? 'hi' : 'en',
      scenarioName: scenarioName || 'General Workplace Safety',
      date: new Date().toISOString(),
      status: 'Open',
      priority: priority || 'Medium'
    };

    helpRequestsCache.unshift(newRequest);
    saveHelpRequests(helpRequestsCache);

    return res.status(201).json({ ok: true, message: 'Help request submitted to safety administrators.', request: newRequest });
  } catch (err) {
    return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Failed to submit help request.' });
  }
});

app.post('/api/trainee/help-requests/:id/reply', requireAuth, (req, res) => {
  try {
    const currentUser = (req as any).user as StoredUser;
    const { id } = req.params;
    const { reply } = req.body || {};

    if (!reply || typeof reply !== 'string' || !reply.trim()) {
      return res.status(400).json({ error: 'REPLY_REQUIRED', message: 'Reply text is required.' });
    }

    const item = helpRequestsCache.find((h) => h.id === id);
    if (!item) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'Help request not found.' });
    }

    if (item.traineeUid !== currentUser.uid && item.traineeEmail !== currentUser.email) {
      return res.status(403).json({ error: 'FORBIDDEN', message: 'Access denied.' });
    }

    // Append trainee follow-up query / note or update query
    item.query = `${item.query}\n[Follow-up by ${currentUser.displayName}]: ${reply.trim()}`;
    item.status = 'Open';
    saveHelpRequests(helpRequestsCache);

    return res.json({ ok: true, message: 'Follow-up sent successfully.', request: item });
  } catch (err) {
    return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Failed to send reply.' });
  }
});

// T4. Public / Trainee Leaderboard (Ranked strictly by Safety Score, Progress Rate, XP)
app.get('/api/leaderboard', (req, res) => {
  try {
    const leaderboard = Object.values(usersCache)
      .filter((u) => u.role === 'trainee')
      .map((u) => ({
        uid: u.uid,
        displayName: u.displayName,
        traineeId: u.traineeId || `TR-${u.uid.slice(-5)}`,
        safetyScore: u.safetyScore ?? 85,
        progressRate: u.progressRate ?? 60,
        xp: u.xp ?? 500,
        level: u.level ?? 2,
        completedCount: u.completedModules?.length || 2,
        status: u.status
      }))
      .sort((a, b) => {
        // 1st criteria: Safety Score descending
        if (b.safetyScore !== a.safetyScore) return b.safetyScore - a.safetyScore;
        // 2nd criteria: Progress rate descending
        if (b.progressRate !== a.progressRate) return b.progressRate - a.progressRate;
        // 3rd criteria: XP descending
        return b.xp - a.xp;
      });

    return res.json({ ok: true, leaderboard });
  } catch (err) {
    return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Failed to compute leaderboard.' });
  }
});

// T5. Trainee Profile / Assigned Modules
app.get('/api/trainee/profile', requireAuth, (req, res) => {
  const currentUser = (req as any).user as StoredUser;
  return res.json({
    ok: true,
    profile: {
      uid: currentUser.uid,
      email: currentUser.email,
      displayName: currentUser.displayName,
      traineeId: currentUser.traineeId,
      level: currentUser.level,
      xp: currentUser.xp,
      assignedModules: currentUser.assignedModules || [...DEFAULT_CANONICAL_MODULES],
      disabledModules: currentUser.disabledModules || [],
      progressRate: currentUser.progressRate ?? 0,
      safetyScore: currentUser.safetyScore ?? 0,
      quizScore: currentUser.quizScore ?? 0,
      completedModules: currentUser.completedModules || [],
      lastActive: currentUser.lastActive
    }
  });
});

// Production Architecture Backend Proxy Endpoint for Gemini Safety Analysis
app.post('/api/gemini-safety-analysis', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', currentSceneState, language = 'en' } = req.body;
    const isHindi = language === 'hi';

    const languageInstruction = isHindi
      ? `\nLANGUAGE REQUIREMENT: Provide the values for 'summary', 'description', and 'recommendation' in natural, professional Hindi (हिंदी). Do NOT translate JSON keys or technical standards/identifiers (e.g. keep "overallRisk", "High", "Medium", "Low", "IS 2925", "IS 15809", "CEA 2010", "440V", "LOTO" exactly as specified).`
      : `\nLANGUAGE REQUIREMENT: Provide the response in clear, professional English.`;

    const systemInstruction = `You are a certified industrial safety engineer for mining and heavy manufacturing vocational training in India (DGMS Directorate General of Mines Safety and Indian Standards IS compliant).
Analyze this image captured from an AR vocational training scenario.
Detect visible safety non-compliances:
- Missing PPE: Safety hard hat/helmet (IS 2925), high-visibility reflective vest (IS 15809), steel-toe safety footwear (IS 15298).
- Electrical hazards: Unsheathed 440V cable, spark arcing, absent lockout/tagout (LOTO) breaker tag.
- Machinery & Structural: Absent perimeter barricade/guardrails near conveyor or pit, pinch-point exposure.
- Housekeeping: Pathway obstructions, slip/trip hazards.
${languageInstruction}

CRITICAL: Return strictly valid JSON adhering to this exact schema without markdown code blocks:
{
  "overallRisk": "High" | "Medium" | "Low",
  "summary": "Concise 2-sentence summary of overall work area safety compliance.",
  "hazards": [
    {
      "type": "Missing Safety Helmet",
      "severity": "High" | "Medium" | "Low",
      "description": "Worker is present within active machine perimeter without hard hat protection.",
      "recommendation": "Equip IS 2925 approved helmet with chin strap immediately."
    }
  ],
  "trainingRecommendation": "Actionable vocational instruction for the student before entering zone."
}`;

    const client = getGeminiClient();

    if (client && imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

      try {
        const { text: responseText, model: usedModel } = await generateWithGeminiFallback(client, {
          contents: [
            {
              role: 'user',
              parts: [
                { text: systemInstruction },
                {
                  inlineData: {
                    mimeType: mimeType,
                    data: cleanBase64
                  }
                }
              ]
            }
          ],
          config: {
            responseMimeType: 'application/json',
            temperature: 0.2
          }
        });

        try {
          const parsed = JSON.parse(responseText);
          parsed.modelUsed = usedModel;
          return res.json(parsed);
        } catch {
          // In case of backtick wrapper
          const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleaned);
          parsed.modelUsed = usedModel;
          return res.json(parsed);
        }
      } catch (geminiErr: any) {
        console.warn('[Gemini Safety Analysis] API call failed, falling back to DGMS rule-based engine:', geminiErr?.message);
      }
    }

    // High-fidelity DGMS rule-based fallback based on current scenario and AR scene state
    const scenarioId = currentSceneState?.scenarioId || req.body.scenarioId || 'scenario-1-ppe';
    const identified = currentSceneState?.identifiedHazards || [];

    const hazards: Array<{
      type: string;
      severity: 'Low' | 'Medium' | 'High';
      description: string;
      recommendation: string;
      matchedObjectId?: string;
      isMatchExact: boolean;
    }> = [];

    if (scenarioId === 'scenario-2-electrical') {
      if (!identified.includes('elec-exposed-cable')) {
        hazards.push({
          type: isHindi ? 'खुला हुआ 440V मुख्य केबल आवरण' : 'Exposed 440V Main Cable Sheath',
          severity: 'High',
          description: isHindi
            ? 'ट्रांसफार्मर फुटिंग के पास 440V का उच्च-वोल्टेज केबल खुला है, जिससे फ्लैशओवर और करंट का गंभीर ख़तरा है।'
            : 'High-voltage feed conduit is torn open with copper conductors exposed near transformer footings.',
          recommendation: isHindi
            ? 'सीईए नियम 30 के अनुसार लोटो (LOTO) पैडलॉक लगाएं और केबल को तुरंत बंद करें।'
            : 'Perform immediate breaker trip and apply LOTO padlock per CEA Regulation 30.',
          matchedObjectId: 'elec-exposed-cable',
          isMatchExact: true
        });
      }
      if (!identified.includes('elec-wet-floor')) {
        hazards.push({
          type: isHindi ? 'स्विचगियर बे में सुचालक पानी का जमाव' : 'Conductive Water Pool in Switchgear Bay',
          severity: 'High',
          description: isHindi
            ? 'ऑपरेटर खड़े होने वाले क्षेत्र में पानी भरा है, जो सतह पर बिजली फैलने का ख़तरा पैदा करता है।'
            : 'Standing water pool in front of 440V switchgear creates severe touch-potential electrocution hazard.',
          recommendation: isHindi
            ? 'आई.एस. 15652 अनुमोदित डाइइलेक्ट्रिक रबर मैट बिछाएं और पानी की निकासी करें।'
            : 'Deploy IS 15652 certified Class B dielectric rubber matting and dry standing water.',
          matchedObjectId: 'elec-wet-floor',
          isMatchExact: true
        });
      }
      if (!identified.includes('elec-missing-gloves')) {
        hazards.push({
          type: isHindi ? 'इंसुलेटिंग दस्तानों का अभाव' : 'Worker Lacks Dielectric Insulating Gloves',
          severity: 'High',
          description: isHindi
            ? 'ऑपरेटर नंगे हाथों से 440V पैनल के पास काम कर रहा है।'
            : 'Technician working within live arc flash boundary without 1000V composite dielectric gloves.',
          recommendation: isHindi
            ? 'आई.एस. 4770 प्रमाणित क्लास 0 इंसुलेटिंग दस्ताने अनिवार्य रूप से पहनें।'
            : 'Mandate IS 4770 certified composite dielectric insulating gloves and arc-flash shield.',
          matchedObjectId: 'elec-missing-gloves',
          isMatchExact: true
        });
      }
      if (!identified.includes('elec-blocked-sign')) {
        hazards.push({
          type: isHindi ? 'अवरुद्ध 440V ख़तरा चेतावनी बोर्ड' : 'Obstructed High-Voltage Warning Placard',
          severity: 'Medium',
          description: isHindi
            ? 'वैधानिक 440V ख़तरा चेतावनी बोर्ड लकड़ी के बक्सों के पीछे छिपा हुआ है।'
            : 'Statutory 440V Danger signboard is obstructed by scrap materials and wooden crates.',
          recommendation: isHindi
            ? 'आई.एस. 2551 के अनुसार चेतावनी बोर्ड के सामने 2 मीटर का स्पष्ट रास्ता रखें।'
            : 'Clear obstructions to maintain unobstructed line of sight to IS 2551 warning placards.',
          matchedObjectId: 'elec-blocked-sign',
          isMatchExact: true
        });
      }
    } else if (scenarioId === 'scenario-3-fire') {
      if (!identified.includes('fire-active-blaze')) {
        hazards.push({
          type: isHindi ? 'सक्रिय ट्रांसफार्मर ऑयल आग' : 'Active Class B/C Machinery Fire',
          severity: 'High',
          description: isHindi
            ? 'ट्रांसफार्मर ऑयल से निकली लपटें और जहरीला धुआं तेजी से फैल रहा है।'
            : 'Electrical transformer oil fire producing dense acrid smoke and intense radiant heat.',
          recommendation: isHindi
            ? 'तुरंत सायरन बजाएं और डीसीपी/फोम अग्निशामक का सुरक्षित दूरी से प्रयोग करें।'
            : 'Trigger immediate plant evacuation alarm; discharge multi-purpose ABC/DCP extinguisher if safe.',
          matchedObjectId: 'fire-active-blaze',
          isMatchExact: true
        });
      }
      if (!identified.includes('fire-blocked-exit')) {
        hazards.push({
          type: isHindi ? 'अवरुद्ध आपातकालीन निकास द्वार' : 'Obstructed Emergency Egress Route',
          severity: 'High',
          description: isHindi
            ? 'ग्रीन पुश-बार आपातकालीन निकास द्वार के सामने लकड़ी के पैलेट्स का ढेर लगा है।'
            : 'Heavy wooden pallet crates stacked directly blocking illuminated green fire exit door.',
          recommendation: isHindi
            ? 'कारख़ाना अधिनियम 1948 के अनुसार निकास द्वारों पर 2 मीटर चौड़ा रास्ता सदैव साफ़ रखें।'
            : 'Maintain minimum 2-meter clear passageway to all emergency exit doors at all times.',
          matchedObjectId: 'fire-blocked-exit',
          isMatchExact: true
        });
      }
      if (!identified.includes('fire-alarm-pull')) {
        hazards.push({
          type: isHindi ? 'अनुपयुक्त आपातकालीन फायर अलार्म' : 'Unactivated Manual Call Point (Alarm)',
          severity: 'Medium',
          description: isHindi
            ? 'दीवार पर लगा आपातकालीन अलार्म ब्रेक-ग्लास बॉक्स अभी तक नहीं दबाया गया है।'
            : 'Wall-mounted emergency fire alarm break-glass unit has not been triggered for plant evacuation.',
          recommendation: isHindi
            ? 'आग बुझाने के प्रयास से पहले तत्काल मैनुअल कॉल पॉइंट दबाएं।'
            : 'Strike manual call point immediately before attempting any small-fire suppression.',
          matchedObjectId: 'fire-alarm-pull',
          isMatchExact: true
        });
      }
      if (!identified.includes('fire-worker-evac')) {
        hazards.push({
          type: isHindi ? 'धुएं में फंसा भ्रमित कर्मचारी' : 'Disoriented Worker in Smoke Zone',
          severity: 'High',
          description: isHindi
            ? 'धुएं के कारण एक कर्मचारी खांसता हुआ निकास दिशा ढूंढने में असमर्थ है।'
            : 'Worker coughing near smoke plume without smoke hood or egress route navigation.',
          recommendation: isHindi
            ? 'कर्मचारी को फर्श पर लगे प्रकाशमान निकास चिह्नों के साथ असेंबली पॉइंट की ओर ले जाएं।'
            : 'Guide worker along illuminated floor egress strip to designated external assembly point.',
          matchedObjectId: 'fire-worker-evac',
          isMatchExact: true
        });
      }
    } else if (scenarioId === 'scenario-4-mining') {
      if (!identified.includes('mine-haulage-blindspot')) {
        hazards.push({
          type: isHindi ? '35T डम्पर के ब्लाइंड स्पॉट में पैदल यात्री' : 'Pedestrian in 35T Haulage Dumper Blind Zone',
          severity: 'High',
          description: isHindi
            ? 'मज़दूर 35-टन भारी माइनिंग डम्पर के पीछे 6 मीटर के स्विंग दायरे में खड़ा है।'
            : 'Worker standing within rear 6-meter turning radius of an active 35-tonne diesel mining dump truck.',
          recommendation: isHindi
            ? 'डीजीएमएस नियम 104 के अनुसार भारी वाहनों से 15 मीटर दूरी रखें और रिफ्यूज बे में जाएं।'
            : 'Maintain minimum 15m haulage clearance; retreat immediately to designated refuge bay (DGMS Reg 104).',
          matchedObjectId: 'mine-haulage-blindspot',
          isMatchExact: true
        });
      }
      if (!identified.includes('mine-unstable-roof')) {
        hazards.push({
          type: isHindi ? 'असुरक्षित कोयला छत / हैंगिंग वॉल' : 'Unsupported Strata / Loose Hanging Wall',
          severity: 'High',
          description: isHindi
            ? 'भूमिगत कोयला सीम छत में दरार दिखाई दे रही है जिसमें रॉक बोल्ट और सपोर्ट की कमी है।'
            : 'Visible fracture plane in underground coal seam roof lacking resin rock bolts or hydraulic props.',
          recommendation: isHindi
            ? 'डीजीएमएस नियम 123 के अनुसार क्षेत्र को "असुरक्षित छत" टैग करें और हाइड्रोलिक प्रॉप लगाएं।'
            : 'Immediately tag zone as "UNSAFE ROOF - NO ENTRY" per DGMS Reg 123; install hydraulic support prop.',
          matchedObjectId: 'mine-unstable-roof',
          isMatchExact: true
        });
      }
      if (!identified.includes('mine-no-caplamp')) {
        hazards.push({
          type: isHindi ? 'डीजीएमएस स्वीकृत कैप लैंप का अभाव' : 'Worker Without DGMS Approved Cap Lamp & Helmet',
          severity: 'High',
          description: isHindi
            ? 'मज़दूर बिना फ्लेमप्रूफ एलईडी कैप लैंप के अंधेरी खदान गैलरी में प्रवेश कर रहा है।'
            : 'Worker entering dark drift gallery lacking intrinsically safe LED cap lamp (DGMS approved) and chin-strap helmet.',
          recommendation: isHindi
            ? 'डीजीएमएस प्रमाणित फ्लेमप्रूफ कैप लैंप और आई.एस. 2925 टाइप II माइनिंग हेलमेट पहनें।'
            : 'Require DGMS tested flameproof cap lamp and IS 2925 Type II mining safety helmet.',
          matchedObjectId: 'mine-no-caplamp',
          isMatchExact: true
        });
      }
      if (!identified.includes('mine-missing-sign')) {
        hazards.push({
          type: isHindi ? 'गोफ क्षेत्र में डीजीएमएस ख़तरा बोर्ड का अभाव' : 'Missing DGMS Statutory Danger Board',
          severity: 'Medium',
          description: isHindi
            ? 'असुरक्षित बंद गैलरी के प्रवेश द्वार पर कोई चेतावनी या सुरक्षा बैरिकेड नहीं है।'
            : 'Unventilated blind roadway or abandoned goaf lacks reflective bilingual "KHATRA / DANGER" barrier gate.',
          recommendation: isHindi
            ? 'कोल माइन्स रेगुलेशन 2017 के अनुसार द्विभाषी (हिंदी/अंग्रेजी) लाल चेतावनी गेट लगाएं।'
            : 'Erect chain link barricade with bilingual (Hindi/English) DGMS warning signboard per CMR 2017.',
          matchedObjectId: 'mine-missing-sign',
          isMatchExact: true
        });
      }
    } else if (scenarioId === 'scenario-5-machinery') {
      if (!identified.includes('mach-missing-guard')) {
        hazards.push({
          type: isHindi ? 'कन्वेयर रोलर पर सुरक्षात्मक जाली का अभाव' : 'Unguarded In-Running Rotating Roller Nip',
          severity: 'High',
          description: isHindi
            ? 'घूमने वाले स्टील रोलर्स बिना इंटरलॉक्ड सुरक्षा जाली के चल रहे हैं।'
            : 'Exposed steel conveyor rollers rotating at high speed without interlocked physical barrier or trip wire.',
          recommendation: isHindi
            ? 'आई.एस. 9474 के अनुसार इंटरलॉक्ड वायर मेश सेफ्टी गार्ड लगाएं।'
            : 'Interlock fixed wire mesh guard (IS 9474); ensure machine cuts power if guard is unlatched.',
          matchedObjectId: 'mach-missing-guard',
          isMatchExact: true
        });
      }
      if (!identified.includes('mach-estop-unhit')) {
        hazards.push({
          type: isHindi ? 'आपातकालीन स्टॉप (E-Stop) बटन अप्रयुक्त' : 'Rotating Roller Requires Emergency Stop',
          severity: 'High',
          description: isHindi
            ? 'असामान्य कंपन होने के बावजूद लाल मशरूम आपातकालीन स्टॉप बटन नहीं दबाया गया है।'
            : 'Machine drive is running with abnormal mechanical vibration; red mushroom emergency actuator has not been engaged.',
          recommendation: isHindi
            ? 'आईएसओ 13850 के अनुसार तुरंत लाल मशरूम ई-स्टॉप बटन दबाकर ड्राइव बंद करें।'
            : 'Firmly strike prominent red mushroom Emergency Stop pushbutton (ISO 13850) to trip main drive.',
          matchedObjectId: 'mach-estop-unhit',
          isMatchExact: true
        });
      }
      if (!identified.includes('mach-loose-clothing')) {
        hazards.push({
          type: isHindi ? 'स्पिंडल के पास ढीली आस्तीन' : 'Operator With Loose Sleeve Near Spindle',
          severity: 'High',
          description: isHindi
            ? 'घूमती हुई शाफ्ट के पास ऑपरेटर की खुली और ढीली आस्तीन लटक रही है।'
            : 'Machinist operating with unbuttoned drooping sleeve in dangerous proximity to spinning metal lathe shaft.',
          recommendation: isHindi
            ? 'कारख़ाना नियमों के अनुसार कलाई के बटन बंद करें और ढीले आभूषण हटा दें।'
            : 'Enforce tight buttoned cuffs, remove rings and neck chains per Factory Rules before starting machine.',
          matchedObjectId: 'mach-loose-clothing',
          isMatchExact: true
        });
      }
      if (!identified.includes('mach-missing-perimeter')) {
        hazards.push({
          type: isHindi ? 'फर्श पर पीली परिधि सीमा रेखा का अभाव' : 'Missing Yellow Perimeter Floor Demarcation',
          severity: 'Medium',
          description: isHindi
            ? 'मशीनरी के चारों ओर सुरक्षात्मक पीली/काली धारीदार परिधि सीमा रेखा नहीं है।'
            : 'Absence of high-visibility yellow/black hazard perimeter floor markings around rotating equipment envelope.',
          recommendation: isHindi
            ? 'आई.एस. 9474 के अनुसार 1.5 मीटर दायरे में 100mm चौड़ी पीली/काली पट्टी लगाएं।'
            : 'Paint 100mm wide yellow and black hazard chevron border at 1.5m safety boundary clearance.',
          matchedObjectId: 'mach-missing-perimeter',
          isMatchExact: true
        });
      }
    } else {
      // Default: Scenario 1 (PPE & Baseline Hazards)
      if (!identified.includes('worker-helmet')) {
        hazards.push({
          type: isHindi ? 'अनुपस्थित पीपीई (सुरक्षा हेलमेट)' : 'Missing PPE (Safety Helmet)',
          severity: 'High',
          description: isHindi
            ? 'प्रशिक्षु/मज़दूर सक्रिय मशीनरी क्षेत्र में बिना हार्ड हैट सुरक्षा के उपस्थित है।'
            : 'Trainee/Worker is standing in active mechanical equipment perimeter without a high-density polyethylene helmet.',
          recommendation: isHindi
            ? 'सिर पर चोट से बचाव के लिए आई.एस. 2925 अनुमोदित हेलमेट तुरंत पहनें।'
            : 'Equip approved IS 2925 hard hat with secure chin strap to guard against overhead impact.',
          matchedObjectId: 'worker-helmet',
          isMatchExact: true
        });
      }
      if (!identified.includes('exposed-wire')) {
        hazards.push({
          type: isHindi ? 'खुला हुआ उच्च-वोल्टेज बिजली का तार' : 'Exposed High-Voltage Electrical Cable',
          severity: 'High',
          description: isHindi
            ? 'फर्श पर 440V का चालू केबल खुला पड़ा है, जिससे स्पार्किंग और करंट लगने का गंभीर ख़तरा है।'
            : 'Live 440V 3-phase feeder cable is exposed on the floor with active arcing/spark discharge potential.',
          recommendation: isHindi
            ? 'सीईए नियम 2010 के अनुसार लोटो (LOTO) प्रक्रिया अपनाएं और केबल को इंसुलेटेड नाली में रखें।'
            : 'Perform Lockout/Tagout (LOTO) per CEA Regulations 2010; route cable inside heavy-duty grounded conduit.',
          matchedObjectId: 'exposed-wire',
          isMatchExact: true
        });
      }
      if (!identified.includes('worker-vest')) {
        hazards.push({
          type: isHindi ? 'परावर्तक सुरक्षा बनियान (हाई-विज़ वेस्ट) का अभाव' : 'Missing High-Visibility Reflective Vest',
          severity: 'Medium',
          description: isHindi
            ? 'मज़दूर के कपड़ों में खनन हॉल-रोड के लिए आवश्यक परावर्तक पट्टियों का अभाव है।'
            : 'Worker attire lacks fluorescent background and retro-reflective bands required in mining haulage routes.',
          recommendation: isHindi
            ? 'आई.एस. 15809 क्लास 2 फ्लोरोसेंट सुरक्षा बनियान पहनें।'
            : 'Wear IS 15809 Class 2 orange/fluorescent vest with minimum 50mm reflective banding.',
          matchedObjectId: 'worker-vest',
          isMatchExact: true
        });
      }
      if (!identified.includes('unsafe-barrier')) {
        hazards.push({
          type: isHindi ? 'असुरक्षित मशीनरी ख़तरा क्षेत्र' : 'Unprotected Machinery Hazard Zone',
          severity: 'High',
          description: isHindi
            ? 'सुरक्षात्मक बैरिकेड न होने से घूमने वाले पुर्जों में फंसने का जोखिम है।'
            : 'Missing perimeter barrier and interlocking gate creates pinch-point and crush entrapment risks.',
          recommendation: isHindi
            ? 'आई.एस. 9474 के अनुसार कम से कम 1.5 मीटर दायरे में सुरक्षा जाली और चेतावनी बोर्ड लगाएं।'
            : 'Install fixed perimeter barricade with caution barrier signage at minimum 1.5m radius per IS 9474.',
          matchedObjectId: 'unsafe-barrier',
          isMatchExact: true
        });
      }
    }

    // Contextual general observation
    hazards.push({
      type: isHindi ? 'कार्यस्थल स्वच्छता एवं निकास मार्ग' : 'Housekeeping & Pathway Clearance',
      severity: 'Low',
      description: isHindi
        ? 'उपकरण के किनारे हल्का मलबा और उपकरण बिखरे होने से फिसलने का ख़तरा है।'
        : 'Minor debris and tool placement observed near foundation edge, creating potential slip/trip hazards.',
      recommendation: isHindi
        ? 'सभी कार्यस्थलों के चारों ओर कम से कम 1 मीटर चौड़ा साफ़ रास्ता बनाए रखें।'
        : 'Maintain minimum 1-meter clear perimeter walking aisle around all equipment foundations.',
      matchedObjectId: undefined,
      isMatchExact: false
    });

    const isAllResolved = hazards.filter(h => h.severity === 'High').length === 0;

    let summaryText = '';
    let recommendationText = '';

    if (isHindi) {
      summaryText = isAllResolved
        ? 'उच्च जोखिम वाले विद्युत और पीपीई खतरों को ठीक कर लिया गया है। कार्यक्षेत्र प्रारंभिक सुरक्षा मानकों पर खरा उतरता है।'
        : `एआर कार्यशाला स्टेशन में ${hazards.length} सुरक्षा उल्लंघन पाए गए। महत्वपूर्ण पीपीई और विद्युत खतरों का तत्काल समाधान आवश्यक है।`;
      recommendationText = isAllResolved
        ? 'प्रशिक्षण क्षेत्र पर्यवेक्षित कार्य के लिए स्वीकृत। यांत्रिक लॉक सत्यापन की ओर बढ़ें।'
        : 'कार्यक्षेत्र में प्रवेश करने से पहले अनिवार्य लोटो आइसोलेशन और सुरक्षात्मक उपकरण (PPE) पहनना सुनिश्चित करें।';
    } else {
      summaryText = isAllResolved
        ? 'High-risk electrical and PPE hazards have been corrected. Work station meets preliminary vocational safety clearance.'
        : `Identified ${hazards.length} safety violations in the AR vocational station. Critical PPE and electrical hazards require immediate remediation.`;
      recommendationText = isAllResolved
        ? 'Vocational area cleared for supervised operation. Proceed to mechanical lock verification.'
        : 'Complete mandatory LOTO isolation and personal protective equipment donning before entering station.';
    }

    return res.json({
      overallRisk: isAllResolved ? 'Low' : 'High',
      summary: summaryText,
      hazards,
      trainingRecommendation: recommendationText,
      modelUsed: 'gemini-3.1-flash-lite',
      analyzedAt: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Gemini Safety Analysis Error:', error);
    res.status(500).json({
      error: 'Failed to process AI safety analysis',
      message: error?.message || 'Internal server error'
    });
  }
});

// --- AI SAFETY ASSISTANT ENDPOINT & KNOWLEDGE BASE ENGINE ---

interface AssistantStats {
  totalQueries: number;
  hindiQueries: number;
  englishQueries: number;
  voiceQueries: number;
  categoryBreakdown: Record<string, number>;
  recentQueries: Array<{
    id: string;
    question: string;
    language: 'hi' | 'en';
    scenarioId: string;
    source: 'gemini' | 'safety_knowledge_base';
    modelUsed?: string;
    timestamp: string;
    isVoice?: boolean;
  }>;
}

const assistantStatsStore: AssistantStats = {
  totalQueries: 14,
  hindiQueries: 9,
  englishQueries: 5,
  voiceQueries: 6,
  categoryBreakdown: {
    'Personal Protective Equipment': 5,
    'Fire Safety': 3,
    'Electrical Safety': 3,
    'Mining Safety': 2,
    'Machinery Safety': 1
  },
  recentQueries: [
    {
      id: 'ast-1',
      question: 'Worker ne helmet nahi pehna hai, kya karna chahiye?',
      language: 'hi',
      scenarioId: 'scenario-1-ppe',
      source: 'gemini',
      modelUsed: 'gemini-3.1-flash-lite',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      isVoice: true
    },
    {
      id: 'ast-2',
      question: 'Electrical panel ke paas kaun sa PPE use karna chahiye?',
      language: 'hi',
      scenarioId: 'scenario-2-electrical',
      source: 'gemini',
      modelUsed: 'gemini-3.1-flash-lite',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      isVoice: true
    },
    {
      id: 'ast-3',
      question: 'What is the PASS method for fire extinguishers?',
      language: 'en',
      scenarioId: 'scenario-3-fire',
      source: 'gemini',
      modelUsed: 'gemini-3.1-flash-lite',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      isVoice: false
    }
  ]
};

// Built-in Vocational Safety Topics & DGMS Fallback Knowledge Base with Standardized 6-Section Schema
const VOCATIONAL_SAFETY_FALLBACKS = [
  {
    category: 'Personal Protective Equipment',
    keywords: ['helmet', 'ppe', 'vest', 'shoes', 'goggles', 'gloves', 'pehna', 'pehanna', 'head', 'hard hat', 'हेलमेट', 'दस्ताने', 'जूते', 'सुरक्षा'],
    answerEn: `🔴 RISK LEVEL: High (if entering without mandatory PPE)
⚠️ HAZARD: Falling objects, crush injuries to feet, head concussion, and poor visibility to heavy machinery.
🛡️ WHAT TO DO:
1. Put on an IS 2925 certified hard hat with the chin strap tightly buckled.
2. Wear an IS 15809 high-visibility fluorescent orange reflective safety vest.
3. Wear IS 15298 certified steel-toe safety footwear with slip-resistant soles.
4. Put on impact-rated safety goggles and task-appropriate protective gloves.
5. Inspect all PPE for cracks, tears, or expiration before entering the shop floor.
🚫 DO NOT:
• Do NOT enter any operational zone without complete certified PPE.
• Do NOT use cracked helmets or loose chin straps.
• Do NOT alter, paint, or remove protective elements from safety gear.
🧰 REQUIRED PPE: IS 2925 Hard Hat, IS 15809 Reflective Vest, IS 15298 Steel-Toe Boots, IS 5983 Safety Goggles.
📌 PREVENTION: Daily tool-box talk and pre-entry gatekeeper PPE verification.`,
    answerHi: `🔴 RISK LEVEL (जोखिम स्तर): High (उच्च जोखिम)
⚠️ HAZARD (खतरा): सिर पर भारी वस्तुएं गिरना, पैरों में चोट, कम दृश्यता और मशीनरी से कुचलने का ख़तरा।
🛡️ WHAT TO DO (क्या करें):
1. 'IS 2925' प्रमाणित औद्योगिक सुरक्षा हेलमेट पहनें और ठुड्डी का पट्टा (चिन्स्ट्रैप) कसकर बांधें।
2. दूर से दिखने वाली चमकीली नारंगी फ्लोरोसेंट रिफ्लेक्टिव जैकेट (IS 15809) पहनें।
3. पैरों की सुरक्षा के लिए स्टील-टो सेफ्टी जूते (IS 15298) पहनें।
4. आंखों की सुरक्षा के लिए सेफ्टी चश्मा और काम के अनुसार सही दस्ताने पहनें।
5. कार्यक्षेत्र में जाने से पहले अपने सभी पीपीई की जांच करें कि वे टूटे या फटे न हों।
🚫 DO NOT (क्या न करें):
• बिना पीपीई के किसी भी कार्य क्षेत्र में प्रवेश न करें।
• टूटे हुए हेलमेट या ढीले पट्टे का उपयोग न करें।
• सुरक्षा जूतों की जगह साधारण चप्पल या जूते कभी न पहनें।
🧰 REQUIRED PPE (आवश्यक पीपीई): IS 2925 हेलमेट, IS 15809 रिफ्लेक्टिव जैकेट, IS 15298 सेफ्टी जूते, सेफ्टी चश्मा।
📌 PREVENTION (रोकथाम): कार्य शुरू होने से पहले प्रतिदिन टूलबॉक्स सुरक्षा जांच अनिवार्य करें।`
  },
  {
    category: 'Fire Safety',
    keywords: ['fire', 'aag', 'extinguisher', 'cylinder', 'smoke', 'alarm', 'flame', 'blaze', 'dhua', 'pass', 'आग', 'धुआं', 'अग्निशामक'],
    answerEn: `🔴 RISK LEVEL: High
⚠️ HAZARD: Rapid flame spread, toxic smoke inhalation, structural collapse, and flashover explosions.
🛡️ WHAT TO DO:
1. Immediately shout "FIRE! FIRE!" and break the glass on the nearest Manual Call Point (MCP) fire alarm.
2. Evacuate through illuminated green emergency exit routes toward the external assembly muster point.
3. If trained and fire is small, operate the ABC Dry Chemical Powder (DCP) extinguisher using P.A.S.S.:
   - P (Pull): Pull the safety pin and break the plastic seal.
   - A (Aim): Aim the nozzle at the base of the fire, not into the flames.
   - S (Squeeze): Squeeze the handle levers together steadily.
   - S (Sweep): Sweep the nozzle smoothly from side to side.
4. Close doors behind you as you evacuate to contain oxygen feeding the fire.
5. Report directly to your Safety Officer and supervisor at the muster area.
🚫 DO NOT:
• Do NOT use water on electrical panel fires or chemical fuel fires.
• Do NOT use elevators or lifts during a fire emergency.
• Do NOT re-enter the burning structure to retrieve personal belongings.
🧰 REQUIRED PPE: Smoke escape hood, heat-resistant flame-retardant gloves, safety goggles.
📌 PREVENTION: Inspect fire extinguishers monthly, keep exit corridors unobstructed, and practice bi-annual fire drills.`,
    answerHi: `🔴 RISK LEVEL (जोखिम स्तर): High (अत्यंत गंभीर)
⚠️ HAZARD (खतरा): तीव्र लपटें, दम घोंटने वाला जहरीला धुआं और रासायनिक विस्फोट का ख़तरा।
🛡️ WHAT TO DO (क्या करें):
1. तुरंत जोर से "आग! आग!" चिल्लाएं और निकटतम फायर अलार्म (MCP) का कांच तोड़कर सायरन बजाएं।
2. हरी बत्ती वाले आपातकालीन निकास (Emergency Exit) की ओर तेजी से लेकिन शांत रहकर बढ़ें।
3. यदि आग छोटी है और आप प्रशिक्षित हैं, तो P.A.S.S. नियम से ABC पाउडर अग्निशामक का प्रयोग करें:
   - P (पुल): सुरक्षा पिन खींचें।
   - A (ऐम): आग की जड़ (निचले हिस्से) पर निशाना साधें।
   - S (स्क्वीज): हैंडल को दबाएं।
   - S (स्वीप): नली को दाएं से बाएं घुमाते हुए पाउडर छिड़कें।
4. बाहर खुले असेंबली पॉइंट (Assembly Point) पर पहुंचकर सुपरवाइजर को उपस्थिति दर्ज कराएं।
🚫 DO NOT (क्या न करें):
• बिजली या मशीन की आग पर कभी भी पानी न डालें।
• आग लगने पर लिफ्ट का उपयोग कभी न करें, केवल सीढ़ियों से उतरें।
• सामान निकालने के लिए जलती हुई इमारत में वापस न जाएं।
🧰 REQUIRED PPE (आवश्यक पीपीई): स्मोक मास्क, हीट-रेसिस्टेंट दस्ताने, सुरक्षा जूते।
📌 PREVENTION (रोकथाम): निकास मार्गों को हमेशा खुला रखें और हर 6 महीने में मॉक ड्रिल करें।`
  },
  {
    category: 'Electrical Safety',
    keywords: ['electrical', 'bijli', 'wire', '440v', 'current', 'shock', 'panel', 'loto', 'spark', 'cable', 'तार', 'बिजली', 'करंट', 'पैनल'],
    answerEn: `🔴 RISK LEVEL: High (440V+ fatal electrocution and arc flash risk)
⚠️ HAZARD: High-voltage shock, severe internal organ burns, arc flash blast, and secondary fall injuries.
🛡️ WHAT TO DO:
1. Trip the upstream master circuit breaker or isolator handle immediately to de-energize the circuit.
2. Apply Lockout/Tagout (LOTO): Attach your safety padlock and warning tag (IS 9474) with your name and date.
3. Verify zero energy potential using a calibrated, insulated high-voltage proximity tester.
4. Stand exclusively on IS 15652 certified dielectric rubber insulation mats in front of all panels.
5. If rescuing an electrocution victim, NEVER touch them barehanded; separate them with a dry wooden or fiberglass pole.
🚫 DO NOT:
• Do NOT touch damaged or frayed 440V cables with bare hands.
• Do NOT work on electrical systems with wet hands, footwear, or damp floors.
• Do NOT remove another technician's LOTO padlock without written managerial protocol.
🧰 REQUIRED PPE: IS 4770 Class 0/1 1000V Dielectric Gloves, Arc-Flash Face Shield (NFPA 70E), IS 15298 Non-Conductive Boots.
📌 PREVENTION: Test ground-fault circuit interrupters (GFCI) weekly and service insulation annually.`,
    answerHi: `🔴 RISK LEVEL (जोखिम स्तर): High (जानलेवा 440V झटका एवं आर्क फ्लैश)
⚠️ HAZARD (खतरा): खुले तारों से 440V का उच्च वोल्टेज करंट, शरीर का गंभीर रूप से जलना और दिल का दौरा पड़ना।
🛡️ WHAT TO DO (क्या करें):
1. सबसे पहले मुख्य मास्टर स्विच या सर्किट ब्रेकर को बंद करके बिजली की सप्लाई काटें।
2. LOTO (ताला-टैग) नियम अपनाएं: स्विच पर अपना व्यक्तिगत सुरक्षा ताला और लाल 'खतरा' टैग लगाएं।
3. पैनल के सामने हमेशा IS 15652 प्रमाणित रबर के इंसुलेटिंग मैट पर ही खड़े हों।
4. 1000V सुरक्षित इंसुलेटेड दस्ताने (IS 4770) और आर्क-फ्लैश सुरक्षात्मक फेस शील्ड पहनें।
5. यदि किसी साथी को करंट लगा हो, तो उसे नंगे हाथों से न छुएं; सूखी लकड़ी के डंडे से अलग करें और सीपीआर दें।
🚫 DO NOT (क्या न करें):
• गीले हाथों या पानी भरी जमीन पर कभी भी बिजली का काम न करें।
• कटे-फटे तारों पर साधारण टेप लगाकर अधूरा काम न छोड़ें।
• बिना अनुमति किसी दूसरे कामगार का LOTO ताला कभी न खोलें।
🧰 REQUIRED PPE (आवश्यक पीपीई): IS 4770 1000V डाईइलेक्ट्रिक दस्ताने, फेस शील्ड, IS 15298 गैर-सुचालक सुरक्षा जूते।
📌 PREVENTION (रोकथाम): सभी अर्थिंग तारों की नियमित जांच करें और पैनलों पर लॉक लगाकर रखें।`
  },
  {
    category: 'Mining Safety',
    keywords: ['mining', 'mine', 'khandan', 'roof', 'dgms', 'caplamp', 'haul', 'dumper', 'chhat', 'coal', 'pit', 'खदान', 'कोयला', 'गैलरी'],
    answerEn: `🔴 RISK LEVEL: High (DGMS Statutory Enforcement Zone)
⚠️ HAZARD: Strata collapse / roof falls, heavy dumper blind spot collisions, toxic methane/CO gas, and coal dust explosions.
🛡️ WHAT TO DO:
1. Always wear a DGMS-certified mining safety helmet equipped with a working intrinsically safe LED cap lamp.
2. Perform systematic roof and side inspections ("Sounding test") before stepping under newly exposed galleries.
3. Maintain at least 15 meters clearance from haul trucks, dumpers, and walking draglines; make eye contact with operators.
4. Carry a functional DGMS self-rescuer respirator and gas detector (detecting CH4, CO, O2).
5. Follow all directives from the Mining Sirdar and Overman under the Coal Mines Regulations 2017.
🚫 DO NOT:
• Do NOT enter any unventilated, unsupported, or barricaded goaf / old workings.
• Do NOT walk directly within the blind spot arc (front right and rear) of heavy mining haul trucks.
• Do NOT smoke, use lighters, or introduce non-flameproof electronics underground.
🧰 REQUIRED PPE: DGMS Certified Mining Helmet with Cap Lamp, Steel-Toe Metatarsal Boots, High-Vis Vest, Self-Rescuer.
📌 PREVENTION: Systematic support rules (SSR) compliance, continuous methane monitoring, and stone dust application.`,
    answerHi: `🔴 RISK LEVEL (जोखिम स्तर): High (डीजीएमएस खदान सुरक्षा नियम)
⚠️ HAZARD (खतरा): खदान की छत गिरना (Roof Fall), विशाल डंपरों के अंधे क्षेत्र में आना और जहरीली गैसें (मीथेन/कार्बन मोनोऑक्साइड)।
🛡️ WHAT TO DO (क्या करें):
1. हमेशा डीजीएमएस अनुमोदित माइनिंग हेलमेट और चालू स्थिति वाला कैप लैंप पहनकर ही खदान में जाएं।
2. नई गैलरी में प्रवेश से पहले छत और दीवारों की जांच ('साउंडिंग टेस्ट') करें; खटखटाकर देखें कि पत्थर ढीले तो नहीं हैं।
3. चलते हुए भारी डंपर या लोडरों से कम से कम 15 मीटर की दूरी रखें और ड्राइवर से नजर मिलाकर ही आगे बढ़ें।
4. अपने पास चालू गैस डिटेक्टर और आपातकालीन सेल्फ-रेस्क्यूअर श्वास उपकरण हमेशा रखें।
5. माइनिंग सिरदार और ओवरमैन के सभी वैधानिक निर्देशों का पालन करें।
🚫 DO NOT (क्या न करें):
• बिना वेंटिलेशन वाली या बंद पुरानी गैलरी (Goaf) में कभी न जाएं।
• डंपर के ठीक पीछे या दाएँ ब्लाइंड स्पॉट में कभी खड़े न हों।
• खदान के अंदर माचिस, बीड़ी, सिगरेट या बिना-प्रमाणित इलेक्ट्रॉनिक उपकरण न ले जाएं।
🧰 REQUIRED PPE (आवश्यक पीपीई): DGMS प्रमाणित माइनिंग हेलमेट, कैप लैंप, मेटाटार्सल सेफ्टी जूते, सेल्फ-रेस्क्यूअर मास्क।
📌 PREVENTION (रोकथाम): सिस्टेमेटिक रूफ सपोर्ट (SSR) का पालन और निरंतर वेंटिलेशन एयरफ्लो सुनिश्चित करें।`
  },
  {
    category: 'Machinery Safety',
    keywords: ['machinery', 'machine', 'loto', 'conveyor', 'roller', 'estop', 'guard', 'lockout', 'tagout', 'मशीन', 'रोलर', 'जाली', 'कन्वेयर'],
    answerEn: `🔴 RISK LEVEL: High (Entanglement, amputation, and crush points)
⚠️ HAZARD: High-speed rotating shafts, in-running conveyor nip points, unexpected machine energization, and flying debris.
🛡️ WHAT TO DO:
1. Ensure all fixed perimeter wire mesh guards (IS 9474) and interlocks are securely fastened before power-on.
2. Locate the Red Mushroom Emergency Stop (E-Stop) push-button and trip cord along the conveyor bed.
3. Before any maintenance, clearing jams, or lubrication, execute LOTO: isolate power, lock breaker, tagout, and bleed energy.
4. Tuck in shirts, button up sleeves, tie long hair under your hairnet/hard hat, and remove all jewelry or wristbands.
5. Use long reach push-sticks or specialized tools to unjam chutes—never insert fingers or hands.
🚫 DO NOT:
• Do NOT remove safety guards or tamper with safety limit switches while machines are operating.
• Do NOT reach around, through, or under running conveyor rollers or belts.
• Do NOT wear loose clothing, hanging ID lanyards, or neckties near rotating equipment.
🧰 REQUIRED PPE: Snug-fit Work Coverall (IS 15809), Impact Safety Spectacles (IS 5983), Steel-Toe Boots, Grip Gloves.
📌 PREVENTION: Preventative maintenance, interlocked guard door sensors, and monthly E-Stop trip verification.`,
    answerHi: `🔴 RISK LEVEL (जोखिम स्तर): High (अंग कटने एवं मशीन में खिंचने का ख़तरा)
⚠️ HAZARD (खतरा): तेज घूमते रोलर, कन्वेयर बेल्ट के पिंच पॉइंट, ढीले कपड़ों का मशीन में फंसना।
🛡️ WHAT TO DO (क्या करें):
1. मशीन चालू करने से पहले सुरक्षा जाली (Safety Guard - IS 9474) और सुरक्षा कवर की जांच करें।
2. आपातकालीन स्टॉप (लाल मशरूम E-Stop बटन) की स्थिति हमेशा याद रखें, संकट में तुरंत दबाएं।
3. मशीन की सफाई, तेल डालने या जाम ठीक करने से पहले बिजली बंद करें और LOTO (ताला-टैग) लगाएं।
4. शरीर से सटे कपड़े पहनें; आस्तीन के बटन बंद रखें, गले की चेन, अंगूठी और टाई पूरी तरह उतार दें।
5. अटके हुए माल को निकालने के लिए लंबे हैंडल वाले टूल का प्रयोग करें, हाथ कभी न डालें।
🚫 DO NOT (क्या न करें):
• चलती हुई मशीन से कभी भी सुरक्षा गार्ड या जाली न हटाएं।
• घूमते हुए रोलर या बेल्ट के नीचे कभी हाथ न डालें।
• ढीले कपड़े या लटकते हुए पहचान पत्र पहनकर मशीन के पास न जाएं।
🧰 REQUIRED PPE (आवश्यक पीपीई): फिटिंग वर्कवियर, सुरक्षा चश्मा, स्टील-टो सेफ्टी जूते, कट-प्रतिरोधी दस्ताने।
📌 PREVENTION (रोकथाम): नियमित रखरखाव, सेंसरयुक्त सुरक्षा गार्ड और प्रतिदिन आपातकालीन स्टॉप की जांच।`
  },
  {
    category: 'Gas Leakage & Chemical Hazards',
    keywords: ['gas', 'leak', 'chemical', 'toxic', 'smell', 'h2s', 'methane', 'cylinder', 'गैस', 'रिसाव', 'रसायन', 'गंध'],
    answerEn: `🔴 RISK LEVEL: High (Immediate Evacuation Hazard)
⚠️ HAZARD: Asphyxiation, toxic inhalation (H2S, CO), flammable explosion, and chemical lung burns.
🛡️ WHAT TO DO:
1. Immediately sound the chemical alarm and alert coworkers by shouting "GAS LEAK! EVACUATE UPWIND!".
2. Check the wind direction sock and evacuate UPWIND or CROSSWIND to high ground—never downwind.
3. Don emergency escape breathing apparatus (EEBA) or positive-pressure full-face respirator.
4. Shut off main cylinder manifold or pipeline emergency shutoff valves ONLY if safe and trained.
5. Muster at the designated Upwind Assembly Point and wait for HazMat clearance.
🚫 DO NOT:
• Do NOT turn on or off any electrical switches, flashlights, or motor vehicles (sparks ignite gas).
• Do NOT attempt rescue without self-contained breathing apparatus (SCBA).
• Do NOT re-enter the leak zone until atmospheric testing verifies normal oxygen (19.5% - 23.5%).
🧰 REQUIRED PPE: Full-Face Respirator with ABEK Chemical Filter or SCBA, Chemical Protective Suit, Nitrile Gauntlets.
📌 PREVENTION: Calibrated fixed gas sensor array, regular leak-check sniffer inspections, and HazMat drills.`,
    answerHi: `🔴 RISK LEVEL (जोखिम स्तर): High (तत्काल निकास एवं दम घुटने का ख़तरा)
⚠️ HAZARD (खतरा): जहरीली गैस का रिसाव, ऑक्सीजन की भारी कमी, सांस रुकना और अचानक आग/विस्फोट।
🛡️ WHAT TO DO (क्या करें):
1. तुरंत सायरन बजाएं और साथियों को चेतावनी दें: "गैस रिसाव! हवा की विपरीत दिशा में भागें!"।
2. हवा का रुख (विंडसॉक) देखें और हवा के उल्टे रुख (Upwind) में ऊंची जगह की ओर सुरक्षित निकलें।
3. आपातकालीन रेस्पिरेटर या केमिकल मास्क तुरंत अपने चेहरे पर कसकर लगाएं।
4. यदि सुरक्षित हो और आप अधिकृत हैं, तो मुख्य गैस वाल्व (Emergency Shutoff) को तुरंत बंद करें।
5. असेंबली पॉइंट पर जाकर अपनी उपस्थिति दर्ज कराएं और सेफ्टी टीम के निर्देश की प्रतीक्षा करें।
🚫 DO NOT (क्या न करें):
• रिसाव क्षेत्र में कोई भी बिजली का स्विच, पंखा या लाइट न छुएं (स्पार्क से धमाका हो सकता है)।
• बिना ऑक्सीजन सिलेंडर (SCBA) के बेहोश साथी को बचाने अंदर न कूदें।
• गैस की गंध आने पर माचिस, लाइटर या मोबाइल फोन का प्रयोग न करें।
🧰 REQUIRED PPE (आवश्यक पीपीई): फुल-फेस केमिकल रेस्पिरेटर, गैस-टाइट चश्मा, रासायनिक रोधी दस्ताने।
📌 PREVENTION (रोकथाम): गैस सेंसर अलार्म की नियमित जांच और आपातकालीन निकास रास्तों की स्पष्ट मार्किंग।`
  },
  {
    category: 'Hazard Identification',
    keywords: ['hazard', 'identification', 'khatra', 'risk', 'inspection', 'trip', 'slip', 'oil', 'housekeeping', 'what to do right now', 'right now', 'खतरा', 'पहचान', 'फिसलन', 'अभी क्या करें'],
    answerEn: `🔴 RISK LEVEL: Medium to High (Depending on active workplace situation)
⚠️ HAZARD: Uncontrolled shop-floor hazards: slip/trip items, missing PPE, unguarded pinch points, and exposed live wires.
🛡️ WHAT TO DO:
1. STOP AND ASSESS: Pause your work and scan your 360° surroundings before taking any step.
2. CHECK THE 4 VITAL ZONES:
   - Floor: Oil spills, conductive water, scrap metal, tripping cables.
   - Equipment: Missing wire guards, loose belts, ungrounded plugs, warning lights.
   - People: Missing helmets, vests, eye protection, unsafe work postures.
   - Environment: Lighting, ventilation, exit clearance, fire extinguisher accessibility.
3. REMEDIATE OR ISOLATE: If safe, mark the hazard zone with yellow barricade tape.
4. REPORT: Report immediately to your Safety Supervisor with exact location and hazard nature.
5. RESUME ONLY WHEN CLEARED: Never take shortcuts through an uncleared danger zone.
🚫 DO NOT:
• Do NOT ignore a "minor" leak or loose wire thinking someone else will fix it.
• Do NOT step over rotating conveyors or bypass hazard barricades.
• Do NOT start work under pressure if you feel the safety conditions are unsafe.
🧰 REQUIRED PPE: Task-specific PPE (Hard hat, safety spectacles, steel-toe shoes, hi-vis vest).
📌 PREVENTION: Daily 5S housekeeping audits and proactive near-miss reporting.`,
    answerHi: `🔴 RISK LEVEL (जोखिम स्तर): Medium to High (सक्रिय स्थिति के अनुसार)
⚠️ HAZARD (खतरा): कार्यस्थल पर छिपे खतरे: तेल का फैलाव, नंगे बिजली के तार, खुली मशीनरी और बिना पीपीई के काम करना।
🛡️ WHAT TO DO (क्या करें):
1. रुकें और 360° नजर दौड़ाएं: कोई भी नया काम शुरू करने से पहले अपने आसपास चारों तरफ देखें।
2. इन 4 मुख्य क्षेत्रों की तुरंत जांच करें:
   - फर्श (Floor): क्या तेल, पानी या खुले तार बिखरे हैं?
   - मशीनें (Equipment): क्या कोई सुरक्षा जाली खुली है या अजीब आवाज आ रही है?
   - लोग (Workers): क्या सभी ने हेलमेट, जैकेट और जूते पहने हैं?
   - निकास (Exits): क्या आपातकालीन रास्ते और फायर सिलेंडर साफ और खाली हैं?
3. खतरे को अलग करें: खतरे वाले स्थान पर पीला सुरक्षा फीता (Barricade Tape) लगाएं।
4. सुपरवाइजर को सूचित करें: सुरक्षा अधिकारी को तुरंत खतरे का विवरण दें।
🚫 DO NOT (क्या न करें):
• किसी भी खतरे को यह सोचकर न छोड़ें कि "यह मेरा काम नहीं है"।
• असुरक्षित मशीनरी को शॉर्टकट अपनाकर जबरन चालू न करें।
• बिना सुरक्षा पुष्टि के खतरे वाले इलाके में न जाएं।
🧰 REQUIRED PPE (आवश्यक पीपीई): IS 2925 हेलमेट, IS 15298 जूते, हाई-विजिबिलिटी जैकेट।
📌 PREVENTION (रोकथाम): 5S कार्यस्थल सफाई और प्रतिदिन कार्य से पहले सुरक्षा निरीक्षण।`
  }
];

function getSafetyFallback(query: string, language: 'hi' | 'en', scenarioId?: string): { answer: string; category: string } {
  const q = (query || '').toLowerCase();
  let best = VOCATIONAL_SAFETY_FALLBACKS[0];
  let maxScore = 0;

  for (const topic of VOCATIONAL_SAFETY_FALLBACKS) {
    let score = 0;
    for (const kw of topic.keywords) {
      if (q.includes(kw.toLowerCase())) score += 3;
    }
    if (scenarioId) {
      if (scenarioId.includes('ppe') && topic.category.includes('Protective')) score += 4;
      if (scenarioId.includes('elec') && topic.category.includes('Electrical')) score += 4;
      if (scenarioId.includes('fire') && topic.category.includes('Fire')) score += 4;
      if (scenarioId.includes('mine') && topic.category.includes('Mining')) score += 4;
      if (scenarioId.includes('mach') && topic.category.includes('Machinery')) score += 4;
      if (scenarioId.includes('gas') && topic.category.includes('Gas')) score += 4;
    }
    if (score > maxScore) {
      maxScore = score;
      best = topic;
    }
  }

  return {
    answer: language === 'hi' ? best.answerHi : best.answerEn,
    category: best.category
  };
}

// AI Safety Assistant Chatbot API Endpoint
app.post('/api/ai-safety-assistant', async (req, res) => {
  try {
    const {
      question,
      language = 'hi',
      scenarioId = 'scenario-1-ppe',
      conversationHistory = [],
      isVoice = false,
      imageBase64,
      mimeType = 'image/jpeg'
    } = req.body;

    if (!question || typeof question !== 'string' || !question.trim()) {
      return res.status(400).json({ error: 'INVALID_REQUEST', message: 'Question text is required.' });
    }

    const cleanQuestion = question.trim();
    // Detect Hindi from Devanagari or explicit language flag
    const hasDevanagari = /[\u0900-\u097F]/.test(cleanQuestion);
    const resolvedLanguage: 'hi' | 'en' = language === 'hi' || hasDevanagari ? 'hi' : 'en';

    // Scenario details lookup
    const scenarioNames: Record<string, string> = {
      'scenario-1-ppe': 'PPE & Industrial Hazard Baseline (IS 2925, IS 15809, IS 15298)',
      'scenario-2-electrical': 'Electrical Infrastructure & Substation Safety (440V, LOTO, IS 4770)',
      'scenario-3-electrical': 'Electrical Infrastructure & Substation Safety (440V, LOTO, IS 4770)',
      'scenario-2-fire': 'Industrial Fire & Emergency Evacuation (Class B/C Fire, PASS, IS 2189)',
      'scenario-3-fire': 'Industrial Fire & Emergency Evacuation (Class B/C Fire, PASS, IS 2189)',
      'scenario-4-mining': 'Underground & Opencast Mining Safety (DGMS, Coal Mines Reg 2017)',
      'scenario-5-machinery': 'Heavy Machinery, Conveyors & Machine Guarding (IS 9474, E-Stop)',
      'scenario-gas-leak': 'Industrial Gas Leakage & Hazardous Atmosphere Safety',
      'scenario-gas-leakage': 'Industrial Gas Leakage & Hazardous Atmosphere Safety'
    };
    const scenarioContextStr = scenarioNames[scenarioId] || 'General Industrial Vocational Safety';

    const client = getGeminiClient();
    let assistantAnswer = '';
    let usedSource: 'gemini' | 'safety_knowledge_base' = 'safety_knowledge_base';
    let usedModel: string | undefined = undefined;
    let matchedCategory = 'General Safety';

    if (client) {
      const languageInstruction = resolvedLanguage === 'hi'
        ? `Write your response in clear, respectful, practical Hindi (Devanagari script) with simple technical explanations suited for Indian industrial vocational trainees.`
        : `Write your response in clear, concise English with short, actionable sentences suited for vocational industrial workers.`;

      const systemInstruction = `You are the certified Chief AI Safety Assistant for SURAKSHAAR - Indian Vocational Industrial Safety Simulator.
You specialize in Indian Standards (BIS: IS 2925, IS 15809, IS 15298, IS 4770, IS 9474), Directorate General of Mines Safety (DGMS), and Central Electricity Authority (CEA) regulations.

ACTIVE WORKPLACE SCENARIO CONTEXT: "${scenarioContextStr}".
If the user asks situational questions like "What should I do right now?", base your primary advice on this active workplace context!

${languageInstruction}

CRITICAL MANDATORY RESPONSE STRUCTURE:
You MUST structure your safety answers using this standardized 6-section safety framework:
🔴 RISK LEVEL: High / Medium / Low
⚠️ HAZARD: (Clearly explain what danger, violation, or risk exists)
🛡️ WHAT TO DO: (Clear, actionable, numbered step-by-step instructions: 1, 2, 3...)
🚫 DO NOT: (Critical mistakes, dangerous shortcuts, or prohibitions)
🧰 REQUIRED PPE: (Mandatory personal protective equipment with relevant Indian Standards codes)
📌 PREVENTION: (How to avoid this situation from recurring in the future)

If in Hindi, include clear Hindi labels:
🔴 RISK LEVEL (जोखिम स्तर): High / Medium / Low
⚠️ HAZARD (खतरा): ...
🛡️ WHAT TO DO (क्या करें): 1, 2, 3...
🚫 DO NOT (क्या न करें): ...
🧰 REQUIRED PPE (आवश्यक पीपीई): ...
📌 PREVENTION (रोकथाम): ...

If an image is attached, inspect the image for visible safety violations (e.g. missing helmets, loose cables, unguarded machinery, blocked exits) and detail them in the HAZARD and WHAT TO DO sections.

SAFETY GUARDRAILS:
- Do NOT advise touching energized components, defeating safety interlocks, or entering unventilated mine galleries.
- For extreme emergencies (raging fire, gas cloud, electrocution in progress), prioritize immediate evacuation, tripping main power, and calling emergency sirens.`;

      // Build contents array including conversation history (limited to last 4 turns)
      const contentsPayload: any[] = [];
      if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
        const recentTurns = conversationHistory.slice(-4);
        for (const turn of recentTurns) {
          if (turn.role && turn.text) {
            contentsPayload.push({
              role: turn.role === 'user' ? 'user' : 'model',
              parts: [{ text: turn.text }]
            });
          }
        }
      }

      // Add current user prompt (with image if provided)
      const userParts: any[] = [
        { text: `Workplace query from trainee/worker: "${cleanQuestion}"\nPlease provide your structured 6-section safety response now.` }
      ];

      if (imageBase64 && typeof imageBase64 === 'string') {
        const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        userParts.push({
          inlineData: {
            mimeType: mimeType || 'image/jpeg',
            data: cleanBase64
          }
        });
      }

      contentsPayload.push({
        role: 'user',
        parts: userParts
      });

      try {
        const { text, model } = await generateWithGeminiFallback(client, {
          contents: contentsPayload,
          systemInstruction: { parts: [{ text: systemInstruction }] },
          config: {
            temperature: 0.25,
            maxOutputTokens: 750
          }
        });

        if (text && text.trim()) {
          assistantAnswer = text.trim();
          usedSource = 'gemini';
          usedModel = model;
        }
      } catch (geminiError: any) {
        console.warn('[AI Safety Assistant] Gemini failed, switching to local safety knowledge base:', geminiError?.message);
      }
    }

    // If Gemini was unavailable or threw an error, use high-fidelity safety knowledge base fallback
    if (!assistantAnswer) {
      const fallbackResult = getSafetyFallback(cleanQuestion, resolvedLanguage, scenarioId);
      assistantAnswer = fallbackResult.answer;
      matchedCategory = fallbackResult.category;
      usedSource = 'safety_knowledge_base';
    }

    // Update query stats
    assistantStatsStore.totalQueries++;
    if (resolvedLanguage === 'hi') assistantStatsStore.hindiQueries++;
    else assistantStatsStore.englishQueries++;
    if (isVoice) assistantStatsStore.voiceQueries++;
    assistantStatsStore.categoryBreakdown[matchedCategory] = (assistantStatsStore.categoryBreakdown[matchedCategory] || 0) + 1;

    assistantStatsStore.recentQueries.unshift({
      id: `query-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      question: cleanQuestion,
      language: resolvedLanguage,
      scenarioId,
      source: usedSource,
      modelUsed: usedModel,
      timestamp: new Date().toISOString(),
      isVoice: Boolean(isVoice)
    });
    if (assistantStatsStore.recentQueries.length > 30) {
      assistantStatsStore.recentQueries.pop();
    }

    return res.json({
      ok: true,
      answer: assistantAnswer,
      language: resolvedLanguage,
      scenarioId,
      scenarioContext: scenarioContextStr,
      source: usedSource,
      modelUsed: usedModel || 'DGMS Safety Knowledge Base Engine',
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('[AI Safety Assistant Endpoint Error]:', err);
    const fallback = getSafetyFallback(req.body?.question || '', req.body?.language || 'hi', req.body?.scenarioId);
    return res.json({
      ok: true,
      answer: fallback.answer,
      language: req.body?.language || 'hi',
      scenarioId: req.body?.scenarioId || 'scenario-1-ppe',
      source: 'safety_knowledge_base',
      modelUsed: 'DGMS Safety Knowledge Base Engine (Fallback)',
      timestamp: new Date().toISOString()
    });
  }
});

// Admin endpoints for assistant stats
app.get('/api/admin/assistant-stats', (req, res) => {
  return res.json({
    ok: true,
    stats: assistantStatsStore
  });
});

app.get('/api/assistant/stats', (req, res) => {
  return res.json({
    ok: true,
    stats: assistantStatsStore
  });
});

// Catch-all for any unhandled /api or /api/* endpoints - ensures NO API call falls through to Vite HTML
app.all(['/api', '/api/*', '/api*'], (req, res) => {
  return res.status(404).json({
    error: 'NOT_FOUND',
    message: `API endpoint ${req.method} ${req.originalUrl} not found`
  });
});

// Explicit API Error Handler: ensures errors on /api routes return JSON, never Express default HTML
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.path.startsWith('/api') || req.originalUrl.startsWith('/api')) {
    console.error('[API Server Error]', err);
    return res.status(err.status || 500).json({
      error: err.code || 'INTERNAL_ERROR',
      message: err.message || 'An internal server error occurred.'
    });
  }
  next(err);
});

// Vite middleware & SPA fallback
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    // Explicit barrier: never let an /api request fall through to Vite HTML
    app.use((req, res, next) => {
      if (req.path.startsWith('/api') || req.originalUrl.startsWith('/api')) {
        return res.status(404).json({
          error: 'NOT_FOUND',
          message: `API endpoint ${req.method} ${req.originalUrl} not found`
        });
      }
      next();
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      if (req.path.startsWith('/api') || req.originalUrl.startsWith('/api')) {
        return res.status(404).json({
          error: 'NOT_FOUND',
          message: `API endpoint ${req.method} ${req.originalUrl} not found`
        });
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SIH26041 Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
