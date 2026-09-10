import React from 'react';
import { SurakshaLogo } from './SurakshaLogo';
import { ShieldCheck, HardHat, LogOut, User } from 'lucide-react';
import { AuthUser } from '../types';

interface ProjectHeaderProps {
  onOpenSplash?: () => void;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
  onGoHome?: () => void;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  onOpenSplash,
  currentUser,
  onLogout,
  onGoHome
}) => {
  return (
    <header className="bg-slate-950 border-b border-slate-800/80 px-4 py-3.5 md:px-8 relative overflow-hidden">
      {/* Industrial top hazard stripe */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-red-600 to-amber-500" />

      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* SURAKSHAAR Main Logo Block */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <button
              onClick={onGoHome || onOpenSplash}
              title="SURAKSHAAR - Home"
              className="group text-left cursor-pointer transition-transform active:scale-98"
            >
              <SurakshaLogo variant="full" size="lg" showTagline showSince />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-950/50 text-amber-300 border border-amber-500/40 text-[11px] font-mono font-bold tracking-wide flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              DGMS &amp; IS Compliant
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-700 text-[11px] font-mono flex items-center gap-1">
              <HardHat className="w-3.5 h-3.5 text-slate-400" />
              Industrial Safety Training
            </span>
          </div>
        </div>

        {/* Right Section: User Profile & Quick Logout */}
        <div className="flex items-center gap-3">
          {currentUser && (
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-2 rounded-xl text-xs shrink-0">
              <div className="flex items-center gap-2 px-1 border-r border-slate-800">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <User className="w-4 h-4" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-white font-bold text-xs truncate max-w-[140px] leading-tight">
                    {currentUser.displayName || currentUser.email.split('@')[0]}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono capitalize">
                    {currentUser.role === 'admin' ? 'Safety Administrator' : currentUser.role === 'trainer' ? 'Certified Trainer' : 'Trainee'}
                  </span>
                </div>
              </div>

              {currentUser.role === 'admin' && onGoHome && (
                <button
                  type="button"
                  onClick={onGoHome}
                  className="px-2.5 py-1.5 rounded-lg bg-rose-950/80 border border-rose-500/40 text-rose-300 hover:bg-rose-900/80 text-xs font-bold transition-colors cursor-pointer"
                  title="Return to Admin Command Center"
                >
                  Admin Center
                </button>
              )}

              {onLogout && (
                <button
                  onClick={onLogout}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-red-950/70 text-slate-300 hover:text-red-300 border border-slate-700 hover:border-red-500/40 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Logout from SURAKSHAAR"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-400" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
