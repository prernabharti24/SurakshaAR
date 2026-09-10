import React, { useState } from 'react';
import { SurakshaLogo } from './SurakshaLogo';
import { AuthService } from '../services/authService';
import { AuthUser } from '../types';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  HardHat,
  KeyRound,
  RefreshCw,
  ArrowRight,
  ShieldAlert,
  UserCheck,
  UserPlus,
  Building2,
  User
} from 'lucide-react';

interface AuthScreenProps {
  onSuccess: (user: AuthUser) => void;
  onContinueAsGuest?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess, onContinueAsGuest }) => {
  // Tab: 'trainee' | 'admin'
  const [activePortal, setActivePortal] = useState<'trainee' | 'admin'>('trainee');

  // Trainee Form Fields
  const [traineeEmail, setTraineeEmail] = useState('');
  const [traineePassword, setTraineePassword] = useState('');
  const [showTraineePassword, setShowTraineePassword] = useState(false);

  // Admin Form Fields
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  // Admin Register States
  const [showAdminRegister, setShowAdminRegister] = useState(false);
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regOrganization, setRegOrganization] = useState('Tata Steel Jamshedpur / Coal India');
  const [regAdminRole, setRegAdminRole] = useState('Safety Officer');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  // General States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Forgot Password inline panel (Trainee only)
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [resetFeedback, setResetFeedback] = useState<string | null>(null);

  const resetFormState = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleSwitchPortal = (portal: 'trainee' | 'admin') => {
    setActivePortal(portal);
    setShowForgotPassword(false);
    setShowAdminRegister(false);
    resetFormState();
  };

  // 2b. Admin Register Handler
  const handleAdminRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();

    if (!regFullName.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }
    if (!regEmail.trim()) {
      setErrorMessage('Email address is required.');
      return;
    }
    if (!regPassword) {
      setErrorMessage('Password is required.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Password and Confirm Password do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await AuthService.registerAdmin({
        fullName: regFullName,
        email: regEmail,
        password: regPassword,
        confirmPassword: regConfirmPassword,
        organization: regOrganization,
        adminRole: regAdminRole
      });

      setSuccessMessage(res.message || 'Admin account created successfully! Please sign in.');
      setAdminEmail(regEmail);
      setAdminPassword('');
      setTimeout(() => {
        setShowAdminRegister(false);
        setSuccessMessage(null);
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create admin account.');
    } finally {
      setIsLoading(false);
    }
  };

  // 1. Trainee Login
  const handleTraineeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();

    if (!traineeEmail.trim()) {
      setErrorMessage('Please enter your trainee email address.');
      return;
    }
    if (!traineePassword) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await AuthService.login(traineeEmail, traineePassword, 'trainee');
      setSuccessMessage('Credentials authenticated. Loading Trainee Dashboard...');
      setTimeout(() => {
        onSuccess(user);
      }, 500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please verify trainee credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Admin Login
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();

    if (!adminEmail.trim()) {
      setErrorMessage('Please enter your administrator email address.');
      return;
    }
    if (!adminPassword) {
      setErrorMessage('Please enter your administrator password.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await AuthService.login(adminEmail, adminPassword, 'admin');
      setSuccessMessage('Administrator verified. Entering Safety Command Center...');
      setTimeout(() => {
        onSuccess(user);
      }, 500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Administrator authentication failed. Unauthorized access prohibited.');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Forgot Password Handler
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetFeedback(null);
    if (!resetEmail.trim()) {
      setResetFeedback('Please enter your registered trainee email.');
      return;
    }

    setIsResetting(true);
    try {
      const msg = await AuthService.sendPasswordReset(resetEmail);
      setResetFeedback(msg);
    } catch (err: any) {
      setResetFeedback(err.message || 'Unable to submit password reset request.');
    } finally {
      setIsResetting(false);
    }
  };

  const handleQuickFillTrainee = () => {
    setTraineeEmail('trainee@surakshaar.org');
    setTraineePassword('Suraksha@2026');
    setErrorMessage(null);
  };

  const handleQuickFillAdmin = () => {
    setAdminEmail('admin@surakshaar.org');
    setAdminPassword('Admin@2026');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden selection:bg-amber-500 selection:text-slate-950">
      {/* Industrial Visual Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/20 via-slate-950 to-black pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      
      {/* Top Accent Hazard Stripe */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />

      {/* Main Authentication Card */}
      <div className="relative z-10 w-full max-w-md bg-slate-900/95 border border-slate-800 rounded-3xl shadow-[0_0_60px_rgba(245,158,11,0.1)] p-6 sm:p-8 backdrop-blur-xl space-y-5">
        
        {/* SURAKSHAAR Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <SurakshaLogo variant="full" size="lg" showTagline={false} />
          
          <div className="pt-2">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {activePortal === 'trainee' ? 'Trainee Portal Login' : 'Admin Command Center'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
              &ldquo;Train Safer. Work Smarter. Build a Safer Tomorrow.&rdquo;
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            {activePortal === 'trainee' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-950/60 border border-amber-500/30 text-[11px] font-mono text-amber-300">
                <HardHat className="w-3.5 h-3.5 text-amber-400" />
                Vocational Trainee Safety
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950/60 border border-red-500/40 text-[11px] font-mono text-red-300">
                <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                DGMS &amp; Industrial Administrator
              </span>
            )}
          </div>
        </div>

        {/* Portal Switcher: [Trainee Login] [Admin Login] */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-950 border border-slate-800 rounded-2xl gap-1">
          <button
            type="button"
            id="portal-tab-trainee"
            onClick={() => handleSwitchPortal('trainee')}
            className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activePortal === 'trainee'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-950/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <HardHat className="w-4 h-4" />
            <span>Trainee Login</span>
          </button>

          <button
            type="button"
            id="portal-tab-admin"
            onClick={() => handleSwitchPortal('admin')}
            className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activePortal === 'admin'
                ? 'bg-red-600 text-white font-black shadow-md shadow-red-950/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin Login</span>
          </button>
        </div>

        {/* Status / Error / Success Banners */}
        {errorMessage && (
          <div
            id="auth-error-alert"
            role="alert"
            className="p-3 rounded-2xl bg-red-950/80 border border-red-500/60 text-red-200 text-xs flex items-start gap-2.5 animate-in fade-in"
          >
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed font-semibold">{errorMessage}</div>
          </div>
        )}

        {successMessage && (
          <div
            id="auth-success-alert"
            role="status"
            className="p-3 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-200 text-xs flex items-start gap-2.5 animate-in fade-in"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed font-medium">{successMessage}</div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 1: TRAINEE LOGIN                                      */}
        {/* ========================================================= */}
        {activePortal === 'trainee' && (
          <>
            {showForgotPassword ? (
              /* Inline Forgot Password Sub-view */
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    Password Recovery
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetFeedback(null);
                    }}
                    className="text-[11px] text-amber-400 hover:text-amber-300 cursor-pointer underline"
                  >
                    Back to Trainee Login
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Enter your registered trainee email to receive password reset instructions.
                </p>

                <form onSubmit={handleForgotPasswordSubmit} className="space-y-3">
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="trainee@surakshaar.org"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {resetFeedback && (
                    <div className="text-[11px] text-amber-300 p-2 rounded-lg bg-amber-950/40 border border-amber-500/30">
                      {resetFeedback}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isResetting}
                    className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    {isResetting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <KeyRound className="w-3.5 h-3.5" />}
                    <span>Send Reset Instructions</span>
                  </button>
                </form>
              </div>
            ) : (
              /* Trainee Login Form */
              <form onSubmit={handleTraineeLogin} className="space-y-4">
                {/* Trainee Email */}
                <div className="space-y-1.5">
                  <label htmlFor="trainee-email" className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>Trainee Email</span>
                  </label>
                  <div className="relative">
                    <input
                      id="trainee-email"
                      type="email"
                      value={traineeEmail}
                      onChange={(e) => setTraineeEmail(e.target.value)}
                      placeholder="trainee@surakshaar.org"
                      required
                      autoComplete="username"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40 transition-colors"
                    />
                  </div>
                </div>

                {/* Trainee Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="trainee-password" className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Password</span>
                    </label>
                    <button
                      type="button"
                      id="trainee-forgot-password-link"
                      onClick={() => {
                        setShowForgotPassword(true);
                        setResetEmail(traineeEmail);
                      }}
                      className="text-[11px] text-amber-400 hover:text-amber-300 transition-colors cursor-pointer font-medium"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      id="trainee-password"
                      type={showTraineePassword ? 'text' : 'password'}
                      value={traineePassword}
                      onChange={(e) => setTraineePassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      autoComplete="current-password"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40 transition-colors pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowTraineePassword(!showTraineePassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-white cursor-pointer"
                      title={showTraineePassword ? 'Hide password' : 'Show password'}
                    >
                      {showTraineePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Quick Demo Fill Helper */}
                <div className="flex items-center justify-between p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs">
                  <span className="text-slate-400 text-[11px]">Accredited Trainee:</span>
                  <button
                    type="button"
                    id="quick-fill-trainee"
                    onClick={handleQuickFillTrainee}
                    className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-lg font-mono text-[11px] font-bold cursor-pointer transition-colors"
                  >
                    Quick Fill (trainee@surakshaar.org)
                  </button>
                </div>

                {/* Login Button */}
                <button
                  id="trainee-login-submit"
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Verifying Trainee Credentials...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Login to Trainee Dashboard</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>

                {/* Explicit Compliance Notice: NO CREATE ACCOUNT */}
                <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80 text-[11px] text-slate-400 text-center leading-relaxed">
                  <span className="text-amber-400/90 font-semibold">Self-registration disabled: </span>
                  Trainee accounts are securely provisioned by your designated Safety Administrator.
                </div>
              </form>
            )}
          </>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: ADMIN LOGIN & REGISTER                             */}
        {/* ========================================================= */}
        {activePortal === 'admin' && !showAdminRegister && (
          <form onSubmit={handleAdminLogin} className="space-y-4">
            {/* Security Badge */}
            <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/30 text-[11px] text-red-200 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              <span>Restricted to authorized Safety Officers and System Administrators.</span>
            </div>

            {/* Admin Email */}
            <div className="space-y-1.5">
              <label htmlFor="admin-email" className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-red-400" />
                <span>Admin Email</span>
              </label>
              <div className="relative">
                <input
                  id="admin-email"
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@surakshaar.org"
                  required
                  autoComplete="username"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/40 transition-colors"
                />
              </div>
            </div>

            {/* Admin Password */}
            <div className="space-y-1.5">
              <label htmlFor="admin-password" className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-red-400" />
                <span>Admin Password</span>
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showAdminPassword ? 'text' : 'password'}
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/40 transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPassword(!showAdminPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-white cursor-pointer"
                  title={showAdminPassword ? 'Hide password' : 'Show password'}
                >
                  {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick Demo Fill Helper for Admin */}
            <div className="flex items-center justify-between p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs">
              <span className="text-slate-400 text-[11px]">System Officer:</span>
              <button
                type="button"
                id="quick-fill-admin"
                onClick={handleQuickFillAdmin}
                className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg font-mono text-[11px] font-bold cursor-pointer transition-colors"
              >
                Quick Fill (admin@surakshaar.org)
              </button>
            </div>

            {/* Login Button */}
            <button
              id="admin-login-submit"
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-black text-sm shadow-lg shadow-red-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Verifying Admin Permissions...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Login to Admin Dashboard</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>

            {/* Create Account (Admin) Button - Placed immediately below Login and above Guest */}
            <button
              type="button"
              id="admin-create-account-btn"
              onClick={() => {
                resetFormState();
                setShowAdminRegister(true);
              }}
              className="w-full mt-2.5 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-400 hover:text-cyan-300 font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Account (Admin)</span>
            </button>
          </form>
        )}

        {/* Admin Registration Form */}
        {activePortal === 'admin' && showAdminRegister && (
          <form onSubmit={handleAdminRegister} className="space-y-3.5">
            <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-[11px] text-cyan-200 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Register a new Safety Officer or Administrator account.</span>
            </div>

            {/* Full Name */}
            <div className="space-y-1">
              <label htmlFor="reg-fullname" className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>Full Name</span>
              </label>
              <input
                id="reg-fullname"
                type="text"
                value={regFullName}
                onChange={(e) => setRegFullName(e.target.value)}
                placeholder="Ramesh Kumar"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label htmlFor="reg-email" className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>Email Address</span>
              </label>
              <input
                id="reg-email"
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="safety.officer@company.org"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label htmlFor="reg-password" className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Password (Min 6 chars)</span>
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showRegPassword ? 'text' : 'password'}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                >
                  {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label htmlFor="reg-confirm" className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Confirm Password</span>
              </label>
              <div className="relative">
                <input
                  id="reg-confirm"
                  type={showRegConfirmPassword ? 'text' : 'password'}
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                >
                  {showRegConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Organization & Role */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Organization</span>
                </label>
                <input
                  type="text"
                  value={regOrganization}
                  onChange={(e) => setRegOrganization(e.target.value)}
                  placeholder="Tata Steel / Coal India"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Admin Role</span>
                </label>
                <select
                  value={regAdminRole}
                  onChange={(e) => setRegAdminRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Safety Officer">Safety Officer</option>
                  <option value="Chief Safety Officer">Chief Safety Officer</option>
                  <option value="Plant Safety Lead">Plant Safety Lead</option>
                  <option value="System Administrator">System Administrator</option>
                </select>
              </div>
            </div>

            {/* Submit & Back */}
            <div className="pt-2 space-y-2">
              <button
                id="admin-register-submit"
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-black text-sm shadow-lg shadow-cyan-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Creating Admin Account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Register Admin Account</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowAdminRegister(false);
                  resetFormState();
                }}
                className="w-full py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                ← Back to Admin Login
              </button>
            </div>
          </form>
        )}

        {/* Guest Fallback */}
        <div className="pt-2 border-t border-slate-800/80 text-center space-y-2">
          <button
            type="button"
            id="auth-guest-mode-btn"
            onClick={() => {
              const guestUser = AuthService.loginAsGuest();
              if (onContinueAsGuest) {
                onContinueAsGuest();
              } else {
                onSuccess(guestUser);
              }
            }}
            className="text-xs text-slate-400 hover:text-amber-400 transition-colors inline-flex items-center gap-1.5 cursor-pointer font-medium"
          >
            <span>Continue as Guest Trainee →</span>
          </button>
        </div>
      </div>

      {/* Safety Compliance Footer Notice */}
      <div className="relative z-10 text-center mt-6 text-xs text-slate-500 max-w-sm space-y-1">
        <p className="flex items-center justify-center gap-1 font-mono">
          <HardHat className="w-3.5 h-3.5 text-amber-500" />
          <span>SURAKSHAAR Industrial Safety Simulator</span>
        </p>
        <p className="text-[11px] text-slate-600">
          Compliant with DGMS Regulations &amp; BIS Industrial Safety Framework
        </p>
      </div>
    </div>
  );
};
