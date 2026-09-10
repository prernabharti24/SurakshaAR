import { AuthUser, UserRole, AdminUserRecord, SystemConfig, TraineeProfile } from '../types';

const AUTH_TOKEN_KEY = 'surakshaar_auth_token';
const AUTH_USER_KEY = 'surakshaar_auth_user';
const PROFILE_STORAGE_KEY = 'sih26041_trainee_profile';

type AuthListener = (user: AuthUser | null) => void;
const listeners: Set<AuthListener> = new Set();

function notifyListeners(user: AuthUser | null) {
  listeners.forEach((listener) => {
    try {
      listener(user);
    } catch (e) {
      console.error('[AuthService] Listener error:', e);
    }
  });
}

/**
 * Safe JSON response parser that guards against unexpected HTML or non-JSON payloads
 * to prevent: SyntaxError: Unexpected token '<', '<!DOCTYPE ...' is not valid JSON
 */
async function safeParseJsonResponse<T = any>(res: Response): Promise<T> {
  const contentType = res.headers.get('content-type') || '';
  let rawText = '';
  try {
    rawText = await res.text();
  } catch (readErr: any) {
    throw new Error(`Failed to read server response: ${readErr?.message || readErr}`);
  }

  const trimmed = rawText.trim();

  // If response has JSON content type or starts with valid JSON brackets
  if (contentType.includes('application/json') || trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      return JSON.parse(rawText) as T;
    } catch {
      // Failed JSON.parse, proceed to fallback inspection
    }
  }

  // Handle unexpected HTML / Vite / React fallback routes gracefully
  if (trimmed.startsWith('<') || contentType.includes('text/html')) {
    console.error('[SafeJSON] Received unexpected HTML response where JSON was expected:', trimmed.slice(0, 120));
    throw new Error(
      `Endpoint returned HTML instead of JSON (${res.status} ${res.statusText}). Expected JSON API response.`
    );
  }

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status} (${res.statusText || 'Error'})`);
  }

  throw new Error('Received unexpected non-JSON response from server.');
}

export class AuthService {
  /**
   * Returns currently stored user from localStorage if present
   */
  static getStoredUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem(AUTH_USER_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // ignore parsing error
    }
    return null;
  }

  /**
   * Returns current session token
   */
  static getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  /**
   * Subscribe to auth state changes
   */
  static onAuthStateChanged(callback: AuthListener): () => void {
    listeners.add(callback);
    // Immediate callback with current state
    callback(this.getStoredUser());
    return () => {
      listeners.delete(callback);
    };
  }

  /**
   * Verifies existing token against backend
   */
  static async checkSession(): Promise<AuthUser | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Accept': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await safeParseJsonResponse(response);
        if (data.ok && data.user) {
          const authUser: AuthUser = {
            uid: data.user.uid,
            email: data.user.email,
            displayName: data.user.displayName,
            role: data.user.role || 'trainee',
            status: data.user.status || 'active',
            traineeId: data.user.traineeId,
            level: data.user.level,
            xp: data.user.xp,
            token,
            createdAt: data.user.createdAt,
            assignedModules: data.user.assignedModules,
            disabledModules: data.user.disabledModules,
            progressRate: data.user.progressRate,
            safetyScore: data.user.safetyScore
          };
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));
          return authUser;
        }
      }
      // If token is invalid or expired, clear
      this.clearSession();
      return null;
    } catch (err) {
      console.warn('[AuthService] Offline verification fallback:', err);
      // Offline fallback: keep cached user if present
      return this.getStoredUser();
    }
  }

  /**
   * Sign In with Email, Password, and Role Verification
   */
  static async login(email: string, password: string, role?: UserRole): Promise<AuthUser> {
    if (!email || !email.trim()) {
      throw new Error('Please enter your email address.');
    }
    if (!password) {
      throw new Error('Please enter your password.');
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email: email.trim(), password, role })
      });

      const data = await safeParseJsonResponse(res);
      if (!res.ok || !data.ok) {
        // Specifically honor required prompt message: "Invalid role for this account"
        const errorVal = data?.error || data?.message;
        if (
          errorVal === 'Invalid role for this account' ||
          data?.error === 'INVALID_ROLE' ||
          (typeof errorVal === 'string' && errorVal.toLowerCase().includes('invalid role'))
        ) {
          throw new Error('Invalid role for this account');
        }
        throw new Error(data?.message || data?.error || 'Login failed. Please check your credentials.');
      }

      const authUser: AuthUser = {
        uid: data.user.uid,
        email: data.user.email,
        displayName: data.user.displayName,
        role: data.user.role || 'trainee',
        status: data.user.status || 'active',
        traineeId: data.user.traineeId,
        level: data.user.level,
        xp: data.user.xp,
        token: data.token,
        createdAt: data.user.createdAt,
        assignedModules: data.user.assignedModules,
        disabledModules: data.user.disabledModules,
        progressRate: data.user.progressRate,
        safetyScore: data.user.safetyScore
      };

      localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));

      // Sync trainee profile with logged in credentials if trainee
      if (authUser.role === 'trainee') {
        this.syncTraineeProfile(authUser, data.user.traineeId, data.user.level, data.user.xp);
      }

      notifyListeners(authUser);
      return authUser;
    } catch (err: any) {
      throw new Error(err.message || 'Unable to connect to authentication service.');
    }
  }

  /**
   * Sign Up (Create Account) with Email, Password and Confirmation (Trainee only)
   */
  static async signUp(
    email: string,
    password: string,
    confirmPassword: string,
    displayName?: string
  ): Promise<AuthUser> {
    if (!email || !email.trim()) {
      throw new Error('Email address is required.');
    }
    if (!password) {
      throw new Error('Password is required.');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match. Please verify and re-type.');
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
          confirmPassword,
          displayName
        })
      });

      const data = await safeParseJsonResponse(res);
      if (!res.ok || !data.ok) {
        throw new Error(data.message || data.error || 'Account registration failed.');
      }

      const authUser: AuthUser = {
        uid: data.user.uid,
        email: data.user.email,
        displayName: data.user.displayName,
        role: data.user.role || 'trainee',
        status: data.user.status || 'active',
        traineeId: data.user.traineeId,
        level: data.user.level,
        xp: data.user.xp,
        token: data.token,
        createdAt: data.user.createdAt
      };

      localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));

      // Initialize trainee profile
      this.syncTraineeProfile(authUser, data.user.traineeId, 1, 0);

      notifyListeners(authUser);
      return authUser;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to create user account.');
    }
  }

  /**
   * Register a new Administrator Account
   */
  static async registerAdmin(payload: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    organization?: string;
    adminRole?: string;
  }): Promise<{ ok: boolean; message: string; email: string }> {
    if (!payload.fullName || !payload.fullName.trim()) {
      throw new Error('Full name is required.');
    }
    if (!payload.email || !payload.email.trim()) {
      throw new Error('Email address is required.');
    }
    if (!payload.password) {
      throw new Error('Password is required.');
    }
    if (payload.password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }
    if (payload.password !== payload.confirmPassword) {
      throw new Error('Password and Confirm Password do not match.');
    }

    const res = await fetch('/api/auth/register-admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await safeParseJsonResponse(res);
    if (!res.ok || !data.ok) {
      throw new Error(data.message || data.error || 'Admin registration failed.');
    }
    return data;
  }

  /**
   * Send Password Reset Link
   */
  static async sendPasswordReset(email: string): Promise<string> {
    if (!email || !email.trim()) {
      throw new Error('Please enter your registered email address.');
    }

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email: email.trim() })
      });

      const data = await safeParseJsonResponse(res);
      if (!res.ok || !data.ok) {
        throw new Error(data.message || data.error || 'Failed to dispatch password reset request.');
      }

      return data.message || 'Password reset link has been dispatched to your email address.';
    } catch (err: any) {
      throw new Error(err.message || 'Unable to process password reset request.');
    }
  }

  /**
   * Sign out and clear stored session
   */
  static async logout(): Promise<void> {
    const token = this.getToken();
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ token })
        });
      } catch {
        // proceed with local cleanup even if offline
      }
    }
    this.clearSession();
    notifyListeners(null);
  }

  /**
   * Continue as Guest for Offline / Field Training fallback (Step 8 compliance)
   */
  static loginAsGuest(): AuthUser {
    const guestUser: AuthUser = {
      uid: 'guest_' + Math.random().toString(36).substring(2, 9),
      email: 'guest.trainee@offline.local',
      displayName: 'Field Guest Trainee',
      role: 'trainee',
      status: 'active',
      isAnonymous: true,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(guestUser));
    this.syncTraineeProfile(guestUser, 'GUEST-01', 1, 0);
    notifyListeners(guestUser);
    return guestUser;
  }

  /**
   * Admin API: Fetch all users
   */
  static async getAdminUsers(): Promise<AdminUserRecord[]> {
    const token = this.getToken();
    const res = await fetch('/api/admin/users', {
      headers: {
        'Accept': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    const data = await safeParseJsonResponse(res);
    if (!res.ok || !data.ok) {
      throw new Error(data.message || data.error || 'Failed to load users directory.');
    }
    return data.users;
  }

  /**
   * Admin API: Provision new user
   */
  static async provisionUser(userData: {
    email: string;
    password: string;
    role: UserRole;
    displayName?: string;
  }): Promise<AdminUserRecord> {
    const token = this.getToken();
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(userData)
    });
    const data = await safeParseJsonResponse(res);
    if (!res.ok || !data.ok) {
      throw new Error(data.message || data.error || 'Failed to provision user.');
    }
    return data.user;
  }

  /**
   * Admin API: Update user role or status
   */
  static async updateUser(
    uid: string,
    updates: { role?: UserRole; status?: 'active' | 'suspended'; displayName?: string }
  ): Promise<void> {
    const token = this.getToken();
    const res = await fetch(`/api/admin/users/${uid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });
    const data = await safeParseJsonResponse(res);
    if (!res.ok || !data.ok) {
      throw new Error(data.message || data.error || 'Failed to update user.');
    }
  }

  /**
   * Admin API: Fetch system configuration
   */
  static async getSystemConfig(): Promise<SystemConfig> {
    const token = this.getToken();
    const res = await fetch('/api/admin/system-config', {
      headers: {
        'Accept': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    const data = await safeParseJsonResponse(res);
    if (!res.ok || !data.ok) {
      throw new Error(data.message || data.error || 'Failed to load system config.');
    }
    return data.config;
  }

  /**
   * Admin API: Update system configuration
   */
  static async updateSystemConfig(config: Partial<SystemConfig>): Promise<SystemConfig> {
    const token = this.getToken();
    const res = await fetch('/api/admin/system-config', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(config)
    });
    const data = await safeParseJsonResponse(res);
    if (!res.ok || !data.ok) {
      throw new Error(data.message || data.error || 'Failed to update system config.');
    }
    return data.config;
  }

  /**
   * Admin API: Fetch all trainees with full metric profiles
   */
  static async getAdminTrainees(): Promise<any[]> {
    const token = this.getToken();
    const res = await fetch('/api/admin/trainees', {
      headers: {
        'Accept': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    const data = await safeParseJsonResponse(res);
    if (!res.ok || !data.ok) {
      throw new Error(data.message || data.error || 'Failed to load trainees.');
    }
    return data.trainees || [];
  }

  /**
   * Admin API: Provision new Trainee
   */
  static async provisionTrainee(traineeData: {
    email: string;
    password: string;
    displayName: string;
    traineeId?: string;
    assignedModules?: string[];
  }): Promise<any> {
    const token = this.getToken();
    const res = await fetch('/api/admin/trainees', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(traineeData)
    });
    const data = await safeParseJsonResponse(res);
    if (!res.ok || !data.ok) {
      throw new Error(data.message || data.error || 'Failed to provision trainee.');
    }
    return data.trainee;
  }

  /**
   * Admin API: Get single trainee profile, quiz test results, and help requests
   */
  static async getAdminTraineeDetails(uid: string): Promise<{
    trainee: any;
    quizResults: any[];
    helpRequests: any[];
  }> {
    const token = this.getToken();
    const res = await fetch(`/api/admin/trainees/${uid}`, {
      headers: {
        'Accept': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    const data = await safeParseJsonResponse(res);
    if (!res.ok || !data.ok) {
      throw new Error(data.message || data.error || 'Failed to load trainee details.');
    }
    return {
      trainee: data.trainee,
      quizResults: data.quizResults || [],
      helpRequests: data.helpRequests || []
    };
  }

  /**
   * Admin API: Update Trainee status or fields
   */
  static async updateTrainee(
    uid: string,
    updates: {
      displayName?: string;
      traineeId?: string;
      status?: 'active' | 'suspended';
      progressRate?: number;
      safetyScore?: number;
      quizScore?: number;
      assignedModules?: string[];
      disabledModules?: string[];
      password?: string;
    }
  ): Promise<any> {
    const token = this.getToken();
    const res = await fetch(`/api/admin/trainees/${uid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });
    const data = await safeParseJsonResponse(res);
    if (!res.ok || !data.ok) {
      throw new Error(data.message || data.error || 'Failed to update trainee record.');
    }
    return data.trainee;
  }

  /**
   * Admin API: Reset Trainee Password
   */
  static async resetTraineePassword(uid: string, newPassword?: string): Promise<{ message: string; temporaryPassword: string }> {
    const token = this.getToken();
    const res = await fetch(`/api/admin/trainees/${uid}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ newPassword })
    });
    const data = await safeParseJsonResponse(res);
    if (!res.ok || !data.ok) {
      throw new Error(data.message || data.error || 'Failed to reset trainee password.');
    }
    return {
      message: data.message,
      temporaryPassword: data.temporaryPassword
    };
  }

  /**
   * Admin API: Delete Trainee account
   */
  static async deleteTrainee(uid: string): Promise<void> {
    const token = this.getToken();
    const res = await fetch(`/api/admin/trainees/${uid}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    const data = await safeParseJsonResponse(res);
    if (!res.ok || !data.ok) {
      throw new Error(data.message || data.error || 'Failed to delete account.');
    }
  }

  /**
   * Admin API: Update Trainee Module Access
   */
  static async updateTraineeModules(
    uid: string,
    assignedModules: string[],
    disabledModules: string[]
  ): Promise<{ assignedModules: string[]; disabledModules: string[] }> {
    const token = this.getToken();
    const res = await fetch(`/api/admin/trainees/${uid}/modules`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ assignedModules, disabledModules })
    });
    const data = await safeParseJsonResponse(res);
    if (!res.ok || !data.ok) {
      throw new Error(data.message || data.error || 'Failed to update module access.');
    }
    return {
      assignedModules: data.assignedModules,
      disabledModules: data.disabledModules
    };
  }

  /**
   * Admin API: Get all quiz results across trainees
   */
  static async getAllQuizResults(): Promise<any[]> {
    const token = this.getToken();
    const res = await fetch('/api/admin/quiz-results', {
      headers: {
        'Accept': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    const data = await safeParseJsonResponse(res);
    if (!res.ok || !data.ok) {
      throw new Error(data.message || data.error || 'Failed to fetch quiz results.');
    }
    return data.results || [];
  }

  /**
   * Admin API: Get all help requests
   */
  static async getAllHelpRequests(): Promise<any[]> {
    const token = this.getToken();
    const res = await fetch('/api/admin/help-requests', {
      headers: {
        'Accept': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    const data = await safeParseJsonResponse(res);
    if (!res.ok || !data.ok) {
      throw new Error(data.message || data.error || 'Failed to fetch help requests.');
    }
    return data.requests || [];
  }

  /**
   * Admin API: Update help request status / admin reply
   */
  static async updateHelpRequest(
    id: string,
    updates: { status?: 'Open' | 'In Progress' | 'Resolved'; adminReply?: string }
  ): Promise<any> {
    const token = this.getToken();
    const res = await fetch(`/api/admin/help-requests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });
    const data = await safeParseJsonResponse(res);
    if (!res.ok || !data.ok) {
      throw new Error(data.message || data.error || 'Failed to update help request.');
    }
    return data.request;
  }

  /**
   * Admin API: Delete help request
   */
  static async deleteHelpRequest(id: string): Promise<void> {
    const token = this.getToken();
    const res = await fetch(`/api/admin/help-requests/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    const data = await safeParseJsonResponse(res);
    if (!res.ok || !data.ok) {
      throw new Error(data.message || data.error || 'Failed to delete help request.');
    }
  }

  /**
   * Trainee API: Get ONLY current trainee's quiz results
   */
  static async getMyQuizResults(): Promise<any[]> {
    const token = this.getToken();
    const res = await fetch('/api/trainee/quiz-results', {
      headers: {
        'Accept': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    const data = await safeParseJsonResponse(res);
    if (!res.ok || !data.ok) {
      throw new Error(data.message || data.error || 'Failed to fetch your quiz results.');
    }
    return data.results || [];
  }

  /**
   * Trainee API: Submit quiz completion result
   */
  static async submitQuizResult(payload: {
    scenarioId: string;
    scenarioName: string;
    practicalScore: number;
    quizScore: number;
  }): Promise<any> {
    const token = this.getToken();
    const res = await fetch('/api/quiz-results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    const data = await safeParseJsonResponse(res);
    if (!res.ok || !data.ok) {
      throw new Error(data.message || data.error || 'Failed to record quiz result.');
    }
    return data.result;
  }

  /**
   * Trainee API: Get ONLY current trainee's help requests
   */
  static async getMyHelpRequests(): Promise<any[]> {
    const token = this.getToken();
    const res = await fetch('/api/trainee/help-requests', {
      headers: {
        'Accept': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    const data = await safeParseJsonResponse(res);
    if (!res.ok || !data.ok) {
      throw new Error(data.message || data.error || 'Failed to fetch your help requests.');
    }
    return data.requests || [];
  }

  /**
   * Trainee API: Submit a help request
   */
  static async submitTraineeHelpRequest(payload: {
    type: string;
    query: string;
    priority?: string;
    language?: string;
    scenarioName?: string;
  }): Promise<any> {
    const token = this.getToken();
    const res = await fetch('/api/trainee/help-requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    const data = await safeParseJsonResponse(res);
    if (!res.ok || !data.ok) {
      throw new Error(data.message || data.error || 'Failed to submit help request.');
    }
    return data.request;
  }

  static async replyToHelpRequest(id: string, reply: string): Promise<any> {
    const token = this.getToken();
    const res = await fetch(`/api/trainee/help-requests/${id}/reply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ reply })
    });
    const data = await safeParseJsonResponse(res);
    if (!res.ok || !data.ok) {
      throw new Error(data.message || data.error || 'Failed to send reply.');
    }
    return data.request;
  }

  /**
   * Public / Trainee: Get ranked leaderboard
   */
  static async getLeaderboard(): Promise<any[]> {
    const res = await fetch('/api/leaderboard', {
      headers: { 'Accept': 'application/json' }
    });
    const data = await safeParseJsonResponse(res);
    if (!res.ok || !data.ok) {
      throw new Error(data.message || data.error || 'Failed to load leaderboard.');
    }
    return data.leaderboard || [];
  }

  /**
   * Trainer API: Fetch trainees list
   */
  static async getTrainerTrainees(): Promise<any[]> {
    const token = this.getToken();
    const res = await fetch('/api/trainer/trainees', {
      headers: {
        'Accept': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    const data = await safeParseJsonResponse(res);
    if (!res.ok || !data.ok) {
      throw new Error(data.message || data.error || 'Failed to load trainee directory.');
    }
    return data.trainees;
  }

  /**
   * Clear local storage tokens
   */
  private static clearSession() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  }

  /**
   * Sync trainee profile so name and ID match authenticated user
   */
  private static syncTraineeProfile(
    authUser: AuthUser,
    traineeId?: string,
    level?: number,
    xp?: number
  ) {
    try {
      let existingProfile: Partial<TraineeProfile> = {};
      const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (raw) {
        existingProfile = JSON.parse(raw);
      }

      const updatedProfile: TraineeProfile = {
        id: traineeId || existingProfile.id || 'TR-26041',
        name: authUser.displayName || authUser.email.split('@')[0],
        affiliation: existingProfile.affiliation || 'Jharkhand Mining & Heavy Engineering ITI',
        xp: xp !== undefined ? xp : (existingProfile.xp ?? 0),
        level: level !== undefined ? level : (existingProfile.level ?? 1),
        levelTitle: existingProfile.levelTitle || 'Safety Apprentice',
        currentStreak: existingProfile.currentStreak ?? 1,
        bestStreak: existingProfile.bestStreak ?? 1,
        lastActiveDate: new Date().toISOString(),
        unlockedAchievements: existingProfile.unlockedAchievements || ['ach-first-login'],
        completedScenarioIds: existingProfile.completedScenarioIds || [],
        bestScores: existingProfile.bestScores || {}
      };

      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updatedProfile));
    } catch (e) {
      console.warn('[AuthService] Could not sync profile:', e);
    }
  }
}
