import React from 'react';
import { Layers, CheckCircle2, ChevronRight, HardHat, Database, Sparkles, AlertTriangle } from 'lucide-react';

export const RoadmapOverview: React.FC = () => {
  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 md:p-5 text-xs text-slate-300">
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          SIH26041 Incremental Development Roadmap
        </span>
        <span className="text-[11px] text-slate-400">Strict Incremental Approach</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Step 1 - Completed */}
        <div className="bg-emerald-950/20 border border-emerald-500/40 rounded-xl p-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-emerald-400 font-bold mb-1">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              STEP 1
            </span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-[10px] font-mono text-emerald-300">Verified</span>
          </div>
          <h4 className="text-white font-bold text-xs mb-1">AR Core Foundation</h4>
          <p className="text-[10px] text-slate-300 leading-snug">
            AR Session, XR Origin, Horizontal Plane Detection, Center Reticle, Tap-to-Place, HUD Guidance.
          </p>
        </div>

        {/* Step 2 - Completed */}
        <div className="bg-emerald-950/20 border border-emerald-500/40 rounded-xl p-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-emerald-400 font-bold mb-1">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              STEP 2
            </span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-[10px] font-mono text-emerald-300">Verified</span>
          </div>
          <h4 className="text-white font-bold text-xs mb-1">PPE &amp; Hazards</h4>
          <p className="text-[10px] text-slate-300 leading-snug">
            Interactive PPE check (hard hat, vest), 440V cable, raycast tapping, dynamic scoring, and DGMS feedback.
          </p>
        </div>

        {/* Step 3 - Completed */}
        <div className="bg-emerald-950/20 border border-emerald-500/40 rounded-xl p-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-emerald-400 font-bold mb-1">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              STEP 3
            </span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-[10px] font-mono text-emerald-300">Verified</span>
          </div>
          <h4 className="text-white font-bold text-xs mb-1">Gemini Multimodal AI</h4>
          <p className="text-[10px] text-slate-300 leading-snug">
            Camera frame capture, dedicated Gemini service layer, structured JSON risk report, 3D AR highlight matching.
          </p>
        </div>

        {/* Step 4 - Completed */}
        <div className="bg-emerald-950/20 border border-emerald-500/40 rounded-xl p-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-emerald-400 font-bold mb-1">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              STEP 4
            </span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-[10px] font-mono text-emerald-300">Verified</span>
          </div>
          <h4 className="text-white font-bold text-xs mb-1">Firebase &amp; Cloud Records</h4>
          <p className="text-[10px] text-slate-300 leading-snug">
            Firebase Auth, Firestore sessions, trainee score persistence, audit trail, and role-based security.
          </p>
        </div>

        {/* Step 5 - Completed */}
        <div className="bg-emerald-950/20 border border-emerald-500/40 rounded-xl p-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-emerald-400 font-bold mb-1">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              STEP 5
            </span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-[10px] font-mono text-emerald-300">Verified</span>
          </div>
          <h4 className="text-white font-bold text-xs mb-1">Vocational Scenarios</h4>
          <p className="text-[10px] text-slate-300 leading-snug">
            5 Modules: Mining, Electrical, Fire, Machinery, PPE with difficulty scaling &amp; trainer analytics.
          </p>
        </div>

        {/* Step 6 - Completed */}
        <div className="bg-emerald-950/20 border border-emerald-500/40 rounded-xl p-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-emerald-400 font-bold mb-1">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              STEP 6
            </span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-[10px] font-mono text-emerald-300">Verified</span>
          </div>
          <h4 className="text-white font-bold text-xs mb-1">Gamification &amp; XP</h4>
          <p className="text-[10px] text-slate-300 leading-snug">
            6 Safety levels, 8 unlockable badges, cohort leaderboard, training streaks, &amp; AI recommendations.
          </p>
        </div>

        {/* Step 7 - Completed */}
        <div className="bg-emerald-950/20 border border-emerald-500/40 rounded-xl p-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-emerald-400 font-bold mb-1">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              STEP 7
            </span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-[10px] font-mono text-emerald-300">Verified</span>
          </div>
          <h4 className="text-white font-bold text-xs mb-1">Bilingual &amp; Accessibility</h4>
          <p className="text-[10px] text-slate-300 leading-snug">
            English/Hindi localization, audible voice synthesis, high-contrast mode, &amp; SIH Demo Deck.
          </p>
        </div>

        {/* Step 8 - Active & Production Verified */}
        <div className="bg-gradient-to-br from-amber-500/15 via-amber-500/10 to-slate-900 border-2 border-amber-500/80 rounded-xl p-3 relative overflow-hidden shadow-lg shadow-amber-950/30">
          <div className="flex items-center justify-between text-amber-400 font-bold mb-1">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
              STEP 8
            </span>
            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-[10px] font-mono text-amber-300 font-black">
              Production Ready
            </span>
          </div>
          <h4 className="text-white font-bold text-xs mb-1">Integration, QA &amp; Demo</h4>
          <p className="text-[10px] text-slate-300 leading-snug">
            15-Step State Pipeline, 24 QA Tests, Zero-Crash Offline Fallback, ARM64/IL2CPP Build Settings.
          </p>
        </div>
      </div>
    </div>
  );
};
