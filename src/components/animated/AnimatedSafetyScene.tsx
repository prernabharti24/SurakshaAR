import React from 'react';
import { TutorialStep } from '../../types';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Flame,
  HardHat,
  Lock,
  DoorOpen,
  Footprints,
  Glasses,
  BellRing,
  PhoneCall,
  FlameKindling,
  Users,
  Mountain,
  UserCheck,
  AlertOctagon,
  Cog,
  Shield,
  PlayCircle,
  OctagonAlert,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface AnimatedSafetySceneProps {
  step: TutorialStep;
  scenarioId: string;
  isPlaying: boolean;
  activeLanguage: 'en' | 'hi';
}

export const AnimatedSafetyScene: React.FC<AnimatedSafetySceneProps> = ({
  step,
  scenarioId,
  isPlaying,
  activeLanguage,
}) => {
  // Helper to get step icon
  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'DoorOpen':
        return <DoorOpen className="w-8 h-8 text-blue-400" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-8 h-8 text-amber-400" />;
      case 'HardHat':
        return <HardHat className="w-8 h-8 text-amber-400" />;
      case 'Footprints':
        return <Footprints className="w-8 h-8 text-emerald-400" />;
      case 'Glasses':
        return <Glasses className="w-8 h-8 text-cyan-400" />;
      case 'CheckCircle2':
        return <CheckCircle2 className="w-8 h-8 text-emerald-400" />;
      case 'Zap':
        return <Zap className="w-8 h-8 text-amber-400" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-8 h-8 text-red-400" />;
      case 'Lock':
        return <Lock className="w-8 h-8 text-amber-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-8 h-8 text-emerald-400" />;
      case 'Hand':
        return <AlertOctagon className="w-8 h-8 text-red-500" />;
      case 'PhoneCall':
        return <PhoneCall className="w-8 h-8 text-blue-400" />;
      case 'Flame':
        return <Flame className="w-8 h-8 text-rose-500" />;
      case 'BellRing':
        return <BellRing className="w-8 h-8 text-red-500 animate-bounce" />;
      case 'FlameKindling':
        return <FlameKindling className="w-8 h-8 text-amber-400" />;
      case 'Mountain':
        return <Mountain className="w-8 h-8 text-amber-500" />;
      case 'UserCheck':
        return <UserCheck className="w-8 h-8 text-emerald-400" />;
      case 'AlertOctagon':
        return <AlertOctagon className="w-8 h-8 text-red-500" />;
      case 'Cog':
        return <Cog className="w-8 h-8 text-blue-400" />;
      case 'Shield':
        return <Shield className="w-8 h-8 text-emerald-400" />;
      case 'PlayCircle':
        return <PlayCircle className="w-8 h-8 text-emerald-400" />;
      case 'OctagonAlert':
        return <OctagonAlert className="w-8 h-8 text-rose-500" />;
      default:
        return <Shield className="w-8 h-8 text-red-400" />;
    }
  };

  // Specific visual animations per scenario and step
  const renderVisualAnimation = () => {
    switch (scenarioId) {
      // -------------------------------------------------------------
      // SCENARIO 1: PPE & HAZARD IDENTIFICATION
      // -------------------------------------------------------------
      case 'scenario-1-ppe':
        if (step.stepNumber === 1) {
          // Approach workplace
          return (
            <div className="relative w-full h-full flex items-center justify-center">
              <svg className="w-full h-64 md:h-72" viewBox="0 0 500 300" fill="none">
                {/* Factory floor ground */}
                <rect x="0" y="220" width="500" height="80" fill="#0f172a" />
                <line x1="0" y1="220" x2="500" y2="220" stroke="#334155" strokeWidth="3" />
                {/* Yellow/Black hazard floor line */}
                <rect x="260" y="218" width="240" height="6" fill="#eab308" />
                <line x1="260" y1="221" x2="500" y2="221" stroke="#000" strokeWidth="2" strokeDasharray="10 10" />

                {/* Industrial entrance gate */}
                <rect x="250" y="50" width="14" height="170" fill="#475569" rx="3" />
                <rect x="470" y="50" width="14" height="170" fill="#475569" rx="3" />
                <rect x="245" y="45" width="245" height="18" fill="#1e293b" rx="4" />
                <text x="367" y="58" fill="#f8fafc" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                  ACTIVE WORKSHOP ZONE
                </text>

                {/* Safety Warning Sign on Gate */}
                <rect x="290" y="75" width="130" height="42" fill="#ef4444" rx="6" stroke="#ffffff" strokeWidth="2" />
                <text x="355" y="93" fill="#ffffff" fontSize="10" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                  STOP &bull; रुकें
                </text>
                <text x="355" y="107" fill="#ffffff" fontSize="8" fontFamily="sans-serif" textAnchor="middle">
                  MANDATORY PPE REQUIRED
                </text>

                {/* Walking Worker Character */}
                <g className={isPlaying ? 'animate-pulse' : ''}>
                  {/* Head */}
                  <circle cx="120" cy="120" r="16" fill="#fde047" />
                  {/* Hair / Cap */}
                  <path d="M 104 116 Q 120 102 136 116 Z" fill="#475569" />
                  {/* Body */}
                  <rect x="108" y="138" width="24" height="44" rx="6" fill="#3b82f6" />
                  {/* Legs */}
                  <line x1="114" y1="182" x2="110" y2="220" stroke="#1e293b" strokeWidth="7" strokeLinecap="round" />
                  <line x1="126" y1="182" x2="132" y2="220" stroke="#1e293b" strokeWidth="7" strokeLinecap="round" />
                  {/* Arms */}
                  <line x1="108" y1="145" x2="98" y2="175" stroke="#fde047" strokeWidth="5" strokeLinecap="round" />
                  <line x1="132" y1="145" x2="142" y2="175" stroke="#fde047" strokeWidth="5" strokeLinecap="round" />
                </g>

                {/* Big Green Walking Arrow */}
                <path d="M 160 170 L 220 170 L 220 160 L 245 175 L 220 190 L 220 180 L 160 180 Z" fill="#10b981" />
                <text x="200" y="155" fill="#10b981" fontSize="10" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                  STOP HERE
                </text>
              </svg>
            </div>
          );
        }

        if (step.stepNumber === 2) {
          // Identify visible hazards (radar scan)
          return (
            <div className="relative w-full h-full flex items-center justify-center">
              <svg className="w-full h-64 md:h-72" viewBox="0 0 500 300" fill="none">
                <rect x="0" y="220" width="500" height="80" fill="#0f172a" />
                <line x1="0" y1="220" x2="500" y2="220" stroke="#334155" strokeWidth="2" />

                {/* Overhead Crane Hook with falling load hazard */}
                <g className="animate-bounce" style={{ animationDuration: '3s' }}>
                  <rect x="120" y="20" width="10" height="60" fill="#64748b" />
                  <path d="M 125 80 Q 140 100 125 115" stroke="#e2e8f0" strokeWidth="5" fill="none" />
                  {/* Suspended Steel Beam */}
                  <rect x="60" y="115" width="130" height="24" rx="4" fill="#94a3b8" stroke="#f43f5e" strokeWidth="3" />
                  {/* Danger Alert Icon */}
                  <circle cx="125" cy="127" r="14" fill="#ef4444" />
                  <text x="125" y="132" fill="#fff" fontSize="14" fontWeight="bold" textAnchor="middle">!</text>
                  <text x="125" y="155" fill="#f43f5e" fontSize="10" fontWeight="bold" textAnchor="middle">
                    OVERHEAD LOAD
                  </text>
                </g>

                {/* Forklift Moving Hazard */}
                <g transform="translate(320, 160)">
                  <rect x="0" y="20" width="60" height="35" rx="5" fill="#eab308" />
                  <circle cx="15" cy="55" r="9" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                  <circle cx="50" cy="55" r="9" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                  <rect x="60" y="0" width="5" height="55" fill="#334155" />
                  <rect x="65" y="40" width="30" height="6" fill="#94a3b8" />
                  {/* Danger circle */}
                  <circle cx="30" cy="10" r="14" fill="#ef4444" />
                  <text x="30" y="15" fill="#fff" fontSize="14" fontWeight="bold" textAnchor="middle">!</text>
                  <text x="40" y="-8" fill="#f59e0b" fontSize="10" fontWeight="bold" textAnchor="middle">
                    MOVING VEHICLE
                  </text>
                </g>

                {/* Radar Sweep Effect */}
                <circle cx="250" cy="180" r="90" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6 6" className="animate-spin" style={{ animationDuration: '6s' }} />
                <circle cx="250" cy="180" r="40" stroke="#38bdf8" strokeWidth="1.5" />
                <circle cx="250" cy="180" r="6" fill="#38bdf8" />
              </svg>
            </div>
          );
        }

        if (step.stepNumber === 3) {
          // Wear safety helmet
          return (
            <div className="relative w-full h-full flex items-center justify-center">
              <svg className="w-full h-64 md:h-72" viewBox="0 0 500 300" fill="none">
                {/* Left Side: Unsafe (No helmet) */}
                <g transform="translate(100, 50)">
                  <circle cx="60" cy="70" r="32" fill="#fde047" stroke="#dc2626" strokeWidth="3" />
                  {/* Eyes, mouth */}
                  <circle cx="50" cy="65" r="4" fill="#1e293b" />
                  <circle cx="70" cy="65" r="4" fill="#1e293b" />
                  <path d="M 52 82 Q 60 76 68 82" stroke="#1e293b" strokeWidth="3" fill="none" />
                  {/* Red Cross */}
                  <circle cx="60" cy="140" r="16" fill="#ef4444" />
                  <path d="M 50 130 L 70 150 M 70 130 L 50 150" stroke="#fff" strokeWidth="4" />
                  <text x="60" y="175" fill="#ef4444" fontSize="12" fontWeight="bold" textAnchor="middle">
                    {activeLanguage === 'hi' ? 'असुरक्षित: सिर खुला' : 'UNSAFE: BARE HEAD'}
                  </text>
                </g>

                {/* Center Animated Arrow */}
                <g transform="translate(230, 110)">
                  <line x1="0" y1="15" x2="35" y2="15" stroke="#10b981" strokeWidth="5" strokeLinecap="round" />
                  <polygon points="35,5 50,15 35,25" fill="#10b981" />
                </g>

                {/* Right Side: Safe (Helmet locked) */}
                <g transform="translate(300, 50)">
                  <circle cx="60" cy="70" r="32" fill="#fde047" stroke="#10b981" strokeWidth="3" />
                  {/* Eyes, mouth happy */}
                  <circle cx="50" cy="68" r="4" fill="#1e293b" />
                  <circle cx="70" cy="68" r="4" fill="#1e293b" />
                  <path d="M 50 80 Q 60 90 70 80" stroke="#1e293b" strokeWidth="3" fill="none" />

                  {/* IS 2925 Yellow Helmet descending & locked */}
                  <g className={isPlaying ? 'animate-bounce' : ''} style={{ animationDuration: '2s' }}>
                    <path d="M 22 52 Q 60 12 98 52 Q 60 46 22 52 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="2" />
                    <rect x="20" y="50" width="80" height="7" rx="3" fill="#facc15" />
                    {/* Chin strap secured */}
                    <path d="M 28 54 Q 60 106 92 54" stroke="#0f172a" strokeWidth="3" fill="none" strokeDasharray="4 2" />
                    <circle cx="60" cy="98" r="5" fill="#10b981" />
                  </g>

                  {/* Green Check */}
                  <circle cx="60" cy="140" r="16" fill="#10b981" />
                  <path d="M 52 140 L 58 146 L 68 134" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
                  <text x="60" y="175" fill="#10b981" fontSize="12" fontWeight="bold" textAnchor="middle">
                    {activeLanguage === 'hi' ? 'सुरक्षित: हेलमेट बंद' : 'SAFE: HELMET LOCKED'}
                  </text>
                </g>
              </svg>
            </div>
          );
        }

        if (step.stepNumber === 4) {
          // Wear safety shoes
          return (
            <div className="relative w-full h-full flex items-center justify-center">
              <svg className="w-full h-64 md:h-72" viewBox="0 0 500 300" fill="none">
                {/* Left: Slippers vs Sharp Nail */}
                <g transform="translate(80, 60)">
                  {/* Sharp nail / scrap */}
                  <polygon points="100,160 106,120 112,160" fill="#94a3b8" stroke="#ef4444" strokeWidth="2" />
                  {/* Foot in open slipper */}
                  <rect x="20" y="125" width="70" height="15" rx="6" fill="#38bdf8" />
                  <path d="M 45 125 Q 55 105 70 125" stroke="#ef4444" strokeWidth="4" fill="none" />
                  <circle cx="60" cy="180" r="16" fill="#ef4444" />
                  <path d="M 50 170 L 70 190 M 70 170 L 50 190" stroke="#fff" strokeWidth="4" />
                  <text x="60" y="215" fill="#ef4444" fontSize="12" fontWeight="bold" textAnchor="middle">
                    {activeLanguage === 'hi' ? 'असुरक्षित: चप्पल' : 'UNSAFE: SLIPPERS'}
                  </text>
                </g>

                <g transform="translate(225, 130)">
                  <line x1="0" y1="15" x2="35" y2="15" stroke="#10b981" strokeWidth="5" strokeLinecap="round" />
                  <polygon points="35,5 50,15 35,25" fill="#10b981" />
                </g>

                {/* Right: Steel-toe industrial boots */}
                <g transform="translate(290, 60)">
                  <g className={isPlaying ? 'animate-pulse' : ''}>
                    {/* Boot silhouette */}
                    <path d="M 30 70 L 60 70 L 60 110 L 105 110 Q 115 110 115 125 L 115 140 L 25 140 L 25 80 Z" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                    {/* Steel cap glow */}
                    <path d="M 85 110 L 105 110 Q 115 110 115 125 L 115 140 L 85 140 Z" fill="#10b981" fillOpacity="0.4" stroke="#10b981" strokeWidth="2" />
                    {/* Thick rubber tread */}
                    <rect x="22" y="140" width="95" height="10" rx="3" fill="#0f172a" stroke="#ca8a04" strokeWidth="1.5" />
                    {/* Shield icon on boot */}
                    <circle cx="50" cy="100" r="10" fill="#10b981" />
                    <text x="50" y="104" fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle">✓</text>
                  </g>
                  <circle cx="70" cy="180" r="16" fill="#10b981" />
                  <path d="M 62 180 L 68 186 L 78 174" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
                  <text x="70" y="215" fill="#10b981" fontSize="12" fontWeight="bold" textAnchor="middle">
                    {activeLanguage === 'hi' ? 'सुरक्षित: स्टील-टो जूते' : 'SAFE: STEEL BOOTS'}
                  </text>
                </g>
              </svg>
            </div>
          );
        }

        if (step.stepNumber === 5) {
          // Wear required eye & hand PPE
          return (
            <div className="relative w-full h-full flex items-center justify-center">
              <svg className="w-full h-64 md:h-72" viewBox="0 0 500 300" fill="none">
                {/* Goggles and Gloves Showcase */}
                <g transform="translate(100, 40)">
                  {/* Safety Goggles */}
                  <rect x="20" y="20" width="110" height="50" rx="14" fill="#0f172a" stroke="#38bdf8" strokeWidth="3" />
                  <circle cx="50" cy="45" r="18" fill="#38bdf8" fillOpacity="0.3" stroke="#38bdf8" strokeWidth="2" />
                  <circle cx="100" cy="45" r="18" fill="#38bdf8" fillOpacity="0.3" stroke="#38bdf8" strokeWidth="2" />
                  <rect x="70" y="42" width="10" height="6" fill="#38bdf8" />
                  <text x="75" y="90" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
                    IS 5983 GOGGLES
                  </text>
                </g>

                <g transform="translate(270, 40)">
                  {/* Heavy Leather Work Gloves */}
                  <path d="M 30 20 L 70 20 L 75 70 L 25 70 Z" fill="#ea580c" rx="4" />
                  {/* Fingers */}
                  <rect x="28" y="5" width="10" height="20" rx="4" fill="#f97316" />
                  <rect x="40" y="0" width="10" height="25" rx="4" fill="#f97316" />
                  <rect x="52" y="5" width="10" height="20" rx="4" fill="#f97316" />
                  <rect x="64" y="10" width="10" height="15" rx="4" fill="#f97316" />
                  {/* Grip grip texture */}
                  <line x1="30" y1="35" x2="68" y2="35" stroke="#7c2d12" strokeWidth="2" />
                  <line x1="30" y1="50" x2="68" y2="50" stroke="#7c2d12" strokeWidth="2" />
                  <text x="50" y="90" fill="#f97316" fontSize="11" fontWeight="bold" textAnchor="middle">
                    IS 6994 GLOVES
                  </text>
                </g>

                {/* Flying spark deflection animation */}
                <g className={isPlaying ? 'animate-pulse' : ''} transform="translate(240, 160)">
                  <circle cx="0" cy="0" r="24" fill="#10b981" fillOpacity="0.2" stroke="#10b981" strokeWidth="2" />
                  <path d="M -8 0 L -2 6 L 8 -6" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                  <text x="0" y="45" fill="#10b981" fontSize="13" fontWeight="bold" textAnchor="middle">
                    {activeLanguage === 'hi' ? 'आंखें और हाथ सुरक्षित' : 'FULL SPLATTER PROTECTION'}
                  </text>
                </g>
              </svg>
            </div>
          );
        }

        // Step 6: 100% Confirm PPE
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <svg className="w-full h-64 md:h-72" viewBox="0 0 500 300" fill="none">
              <circle cx="250" cy="150" r="110" fill="#10b981" fillOpacity="0.08" stroke="#10b981" strokeWidth="3" strokeDasharray="8 6" className="animate-spin" style={{ animationDuration: '12s' }} />

              {/* Fully Equipped Worker Avatar */}
              <g transform="translate(190, 40)">
                {/* Yellow Safety Helmet with chin strap */}
                <path d="M 32 30 Q 60 5 88 30 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="2" />
                <rect x="30" y="28" width="60" height="5" rx="2" fill="#facc15" />
                {/* Head */}
                <circle cx="60" cy="45" r="18" fill="#fde047" />
                {/* Safety Goggles on face */}
                <rect x="46" y="40" width="28" height="10" rx="4" fill="#0284c7" />
                {/* High-Vis Vest Body */}
                <rect x="42" y="65" width="36" height="48" rx="6" fill="#84cc16" stroke="#65a30d" strokeWidth="2" />
                {/* Reflective silver stripes */}
                <rect x="42" y="78" width="36" height="6" fill="#f8fafc" />
                <rect x="42" y="94" width="36" height="6" fill="#f8fafc" />
                {/* Gloves on hands giving thumbs up */}
                <circle cx="32" cy="85" r="8" fill="#ea580c" />
                <circle cx="88" cy="85" r="8" fill="#ea580c" />
                {/* Legs & Safety Boots */}
                <line x1="50" y1="113" x2="48" y2="155" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
                <line x1="70" y1="113" x2="72" y2="155" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
                <rect x="36" y="152" width="20" height="12" rx="4" fill="#0f172a" stroke="#eab308" strokeWidth="1.5" />
                <rect x="64" y="152" width="20" height="12" rx="4" fill="#0f172a" stroke="#eab308" strokeWidth="1.5" />
              </g>

              {/* Verified Badges around worker */}
              <g transform="translate(100, 100)">
                <circle cx="0" cy="0" r="16" fill="#10b981" />
                <text x="0" y="5" fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">✓</text>
                <text x="0" y="26" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">HELMET</text>
              </g>
              <g transform="translate(400, 100)">
                <circle cx="0" cy="0" r="16" fill="#10b981" />
                <text x="0" y="5" fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">✓</text>
                <text x="0" y="26" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">GOGGLES</text>
              </g>
              <g transform="translate(100, 190)">
                <circle cx="0" cy="0" r="16" fill="#10b981" />
                <text x="0" y="5" fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">✓</text>
                <text x="0" y="26" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">GLOVES</text>
              </g>
              <g transform="translate(400, 190)">
                <circle cx="0" cy="0" r="16" fill="#10b981" />
                <text x="0" y="5" fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">✓</text>
                <text x="0" y="26" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">BOOTS</text>
              </g>

              <text x="250" y="260" fill="#10b981" fontSize="15" fontWeight="bold" textAnchor="middle" className="tracking-wider">
                {activeLanguage === 'hi' ? '100% सुरक्षा अनुपालन &bull; कार्य के लिए तैयार' : '100% PPE COMPLIANT &bull; READY TO WORK'}
              </text>
            </svg>
          </div>
        );

      // -------------------------------------------------------------
      // SCENARIO 2: ELECTRICAL SAFETY
      // -------------------------------------------------------------
      case 'scenario-2-electrical':
        if (step.stepNumber === 1) {
          // Identify electrical hazard (sparking panel)
          return (
            <div className="relative w-full h-full flex items-center justify-center">
              <svg className="w-full h-64 md:h-72" viewBox="0 0 500 300" fill="none">
                <rect x="0" y="220" width="500" height="80" fill="#0f172a" />
                {/* 440V Main Electrical Panel */}
                <rect x="180" y="40" width="140" height="180" rx="8" fill="#334155" stroke="#64748b" strokeWidth="4" />
                <rect x="195" y="60" width="110" height="140" fill="#1e293b" rx="4" />
                {/* Danger High Voltage Triangle */}
                <polygon points="250,85 225,125 275,125" fill="#eab308" stroke="#000" strokeWidth="2" />
                <path d="M 252 96 L 243 110 L 253 110 L 245 122" stroke="#000" strokeWidth="2.5" fill="none" />
                <text x="250" y="145" fill="#ef4444" fontSize="12" fontWeight="black" textAnchor="middle">
                  DANGER 440V
                </text>

                {/* Animated Electric Sparking Arcs */}
                <g className={isPlaying ? 'animate-pulse' : ''}>
                  <path d="M 170 110 L 150 120 L 165 130 L 140 145" stroke="#facc15" strokeWidth="3" fill="none" />
                  <path d="M 330 90 L 355 105 L 340 115 L 365 130" stroke="#38bdf8" strokeWidth="3" fill="none" />
                  <circle cx="150" cy="120" r="6" fill="#facc15" />
                  <circle cx="355" cy="105" r="6" fill="#38bdf8" />
                </g>

                <text x="250" y="260" fill="#f59e0b" fontSize="13" fontWeight="bold" textAnchor="middle">
                  {activeLanguage === 'hi' ? 'खतरे की पहचान: खुला या स्पार्क करता पैनल' : 'IDENTIFY: SPARKING 440V HIGH VOLTAGE FAULT'}
                </text>
              </svg>
            </div>
          );
        }

        if (step.stepNumber === 2) {
          // Keep unsafe access clear (2m cordon & no puddle)
          return (
            <div className="relative w-full h-full flex items-center justify-center">
              <svg className="w-full h-64 md:h-72" viewBox="0 0 500 300" fill="none">
                <rect x="0" y="200" width="500" height="100" fill="#0f172a" />
                {/* Electrical Panel in distance */}
                <rect x="40" y="60" width="80" height="140" fill="#334155" rx="4" />
                <polygon points="80,90 65,115 95,115" fill="#eab308" />

                {/* Water Puddle near panel */}
                <ellipse cx="140" cy="220" rx="45" ry="18" fill="#0284c7" fillOpacity="0.6" stroke="#38bdf8" strokeWidth="2" />
                <text x="140" y="224" fill="#fff" fontSize="9" fontWeight="bold" textAnchor="middle">WATER PUDDLE</text>

                {/* Red Cordon Barrier Tape */}
                <line x1="200" y1="120" x2="200" y2="230" stroke="#ef4444" strokeWidth="6" />
                <line x1="450" y1="120" x2="450" y2="230" stroke="#ef4444" strokeWidth="6" />
                {/* Barricade tape with stripes */}
                <rect x="198" y="140" width="254" height="14" fill="#eab308" />
                <line x1="198" y1="147" x2="452" y2="147" stroke="#000" strokeWidth="4" strokeDasharray="12 12" />
                <text x="325" y="135" fill="#ef4444" fontSize="12" fontWeight="bold" textAnchor="middle">
                  DANGER: 2-METER CLEARANCE REQUIRED
                </text>

                {/* Safe worker standing outside tape */}
                <g transform="translate(370, 100)">
                  <circle cx="20" cy="20" r="14" fill="#fde047" />
                  <rect x="12" y="34" width="16" height="30" rx="4" fill="#3b82f6" />
                  <line x1="16" y1="64" x2="14" y2="95" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" />
                  <line x1="24" y1="64" x2="26" y2="95" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" />
                </g>
              </svg>
            </div>
          );
        }

        if (step.stepNumber === 3) {
          // Isolate power according to procedure (LOTO)
          return (
            <div className="relative w-full h-full flex items-center justify-center">
              <svg className="w-full h-64 md:h-72" viewBox="0 0 500 300" fill="none">
                {/* Breaker Switch Box */}
                <rect x="140" y="40" width="220" height="200" rx="10" fill="#1e293b" stroke="#475569" strokeWidth="4" />
                <text x="250" y="70" fill="#f8fafc" fontSize="13" fontWeight="bold" textAnchor="middle">
                  MAIN POWER ISOLATOR
                </text>

                {/* Heavy Knife Switch Handle in DOWN (OFF) Position */}
                <rect x="235" y="90" width="30" height="90" rx="6" fill="#334155" />
                <rect x="230" y="140" width="40" height="20" rx="4" fill="#ef4444" />
                <text x="250" y="154" fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle">OFF</text>

                {/* Lockout Tagout Padlock Clamped on Handle */}
                <g transform="translate(240, 165)" className={isPlaying ? 'animate-bounce' : ''}>
                  {/* Brass shackle */}
                  <path d="M 5 0 Q 10 -15 20 0" stroke="#f59e0b" strokeWidth="4" fill="none" />
                  {/* Red lock body */}
                  <rect x="0" y="0" width="25" height="30" rx="4" fill="#dc2626" stroke="#b91c1c" strokeWidth="2" />
                  <circle cx="12" cy="12" r="3" fill="#fff" />
                  {/* LOTO Warning Tag */}
                  <rect x="28" y="0" width="65" height="40" rx="3" fill="#ffffff" stroke="#dc2626" strokeWidth="2" />
                  <rect x="30" y="2" width="61" height="12" fill="#dc2626" />
                  <text x="60" y="11" fill="#fff" fontSize="7" fontWeight="bold" textAnchor="middle">DANGER</text>
                  <text x="60" y="24" fill="#000" fontSize="7" fontWeight="bold" textAnchor="middle">DO NOT</text>
                  <text x="60" y="34" fill="#000" fontSize="7" fontWeight="bold" textAnchor="middle">OPERATE</text>
                </g>

                <text x="250" y="270" fill="#10b981" fontSize="13" fontWeight="bold" textAnchor="middle">
                  {activeLanguage === 'hi' ? 'सप्लाई बंद &bull; LOTO ताला और टैग लगाया गया' : 'POWER ISOLATED &bull; LOTO PADLOCK SECURED'}
                </text>
              </svg>
            </div>
          );
        }

        if (step.stepNumber === 4) {
          // Appropriate safety PPE/tools (Dielectric gloves 1000V)
          return (
            <div className="relative w-full h-full flex items-center justify-center">
              <svg className="w-full h-64 md:h-72" viewBox="0 0 500 300" fill="none">
                {/* Dielectric Rubber Gloves */}
                <g transform="translate(100, 50)">
                  <rect x="20" y="40" width="60" height="90" rx="10" fill="#0284c7" stroke="#38bdf8" strokeWidth="3" />
                  <rect x="30" y="10" width="12" height="35" rx="5" fill="#0284c7" />
                  <rect x="44" y="5" width="12" height="40" rx="5" fill="#0284c7" />
                  <rect x="58" y="10" width="12" height="35" rx="5" fill="#0284c7" />
                  <text x="50" y="105" fill="#fff" fontSize="11" fontWeight="bold" textAnchor="middle">1000V</text>
                  <text x="50" y="120" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">CLASS 0</text>
                </g>

                {/* Insulated Voltage Tester Probe */}
                <g transform="translate(280, 70)">
                  <rect x="20" y="20" width="30" height="90" rx="6" fill="#eab308" stroke="#ca8a04" strokeWidth="2" />
                  <line x1="35" y1="20" x2="35" y2="-15" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
                  <circle cx="35" cy="50" r="8" fill="#10b981" />
                  <text x="35" y="75" fill="#000" fontSize="9" fontWeight="bold" textAnchor="middle">0.0V</text>
                  <text x="35" y="130" fill="#eab308" fontSize="10" fontWeight="bold" textAnchor="middle">
                    ISOLATED PROBE
                  </text>
                </g>

                <text x="250" y="250" fill="#38bdf8" fontSize="13" fontWeight="bold" textAnchor="middle">
                  {activeLanguage === 'hi' ? 'IS 4770 प्रमाणित 1000 वोल्ट दस्ताने और औजार' : 'IS 4770 CERTIFIED DIELECTRIC PPE & TEST TOOLS'}
                </text>
              </svg>
            </div>
          );
        }

        if (step.stepNumber === 5) {
          // Do not touch exposed live parts
          return (
            <div className="relative w-full h-full flex items-center justify-center">
              <svg className="w-full h-64 md:h-72" viewBox="0 0 500 300" fill="none">
                {/* Exposed Busbar Conductors */}
                <g transform="translate(120, 40)">
                  <rect x="0" y="0" width="260" height="150" fill="#1e293b" rx="6" stroke="#475569" strokeWidth="2" />
                  <line x1="50" y1="20" x2="50" y2="130" stroke="#f59e0b" strokeWidth="12" strokeLinecap="round" />
                  <line x1="130" y1="20" x2="130" y2="130" stroke="#f59e0b" strokeWidth="12" strokeLinecap="round" />
                  <line x1="210" y1="20" x2="210" y2="130" stroke="#f59e0b" strokeWidth="12" strokeLinecap="round" />
                  <text x="50" y="145" fill="#f59e0b" fontSize="9" textAnchor="middle">R</text>
                  <text x="130" y="145" fill="#f59e0b" fontSize="9" textAnchor="middle">Y</text>
                  <text x="210" y="145" fill="#f59e0b" fontSize="9" textAnchor="middle">B</text>
                </g>

                {/* Hand reaching with huge RED NO TOUCH CIRCLE */}
                <g transform="translate(250, 115)">
                  <circle cx="0" cy="0" r="45" fill="#ef4444" fillOpacity="0.2" stroke="#ef4444" strokeWidth="6" />
                  <line x1="-30" y1="-30" x2="30" y2="30" stroke="#ef4444" strokeWidth="6" />
                  {/* Bare hand silhouette */}
                  <path d="M -15 15 L 0 -10 L 12 -5 L 15 15 Z" fill="#fde047" />
                </g>

                <text x="250" y="245" fill="#ef4444" fontSize="15" fontWeight="black" textAnchor="middle">
                  {activeLanguage === 'hi' ? 'खतरा: नंगी तारों को कभी हाथ न लगाएं!' : 'DANGER: NEVER TOUCH EXPOSED LIVE PARTS!'}
                </text>
                <text x="250" y="265" fill="#94a3b8" fontSize="11" textAnchor="middle">
                  Always verify zero energy with a calibrated tester first.
                </text>
              </svg>
            </div>
          );
        }

        // Step 6: Inform supervisor / electrician
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <svg className="w-full h-64 md:h-72" viewBox="0 0 500 300" fill="none">
              {/* Communication Radio transmitting */}
              <g transform="translate(130, 70)">
                <rect x="0" y="20" width="50" height="90" rx="8" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                <line x1="25" y1="20" x2="25" y2="-10" stroke="#64748b" strokeWidth="4" />
                <circle cx="25" cy="50" r="12" fill="#0284c7" />
                {/* Radio waves */}
                <path d="M 60 50 Q 75 35 60 20" stroke="#38bdf8" strokeWidth="3" fill="none" className="animate-pulse" />
                <path d="M 70 60 Q 90 35 70 10" stroke="#38bdf8" strokeWidth="3" fill="none" className="animate-pulse" />
                <text x="25" y="130" fill="#94a3b8" fontSize="10" textAnchor="middle">SUPERVISOR RADIO</text>
              </g>

              {/* Work Permit Document */}
              <g transform="translate(260, 50)">
                <rect x="0" y="0" width="130" height="150" rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
                <rect x="15" y="15" width="100" height="10" fill="#dc2626" rx="2" />
                <line x1="15" y1="35" x2="115" y2="35" stroke="#94a3b8" strokeWidth="3" />
                <line x1="15" y1="48" x2="90" y2="48" stroke="#94a3b8" strokeWidth="3" />
                <line x1="15" y1="61" x2="105" y2="61" stroke="#94a3b8" strokeWidth="3" />
                {/* Stamped Permit Approved */}
                <rect x="25" y="80" width="80" height="30" rx="4" fill="none" stroke="#10b981" strokeWidth="3" />
                <text x="65" y="100" fill="#10b981" fontSize="11" fontWeight="bold" textAnchor="middle">
                  PTW SIGNED
                </text>
                <text x="65" y="170" fill="#10b981" fontSize="10" fontWeight="bold" textAnchor="middle">
                  WORK PERMIT ISSUED
                </text>
              </g>

              <text x="250" y="255" fill="#10b981" fontSize="13" fontWeight="bold" textAnchor="middle">
                {activeLanguage === 'hi' ? 'अधिकृत सुपरवाइजर व इलेक्ट्रीशियन को सूचना दी गई' : 'INFORMED RESPONSIBLE SUPERVISOR & ELECTRICIAN'}
              </text>
            </svg>
          </div>
        );

      // -------------------------------------------------------------
      // SCENARIO 3: FIRE SAFETY
      // -------------------------------------------------------------
      case 'scenario-3-fire':
        if (step.stepNumber === 1) {
          // Detect fire/smoke
          return (
            <div className="relative w-full h-full flex items-center justify-center">
              <svg className="w-full h-64 md:h-72" viewBox="0 0 500 300" fill="none">
                <rect x="0" y="220" width="500" height="80" fill="#0f172a" />
                {/* Machinery box where fire started */}
                <rect x="200" y="130" width="100" height="90" fill="#334155" rx="6" />

                {/* Animated Flame and Smoke */}
                <g className={isPlaying ? 'animate-bounce' : ''} style={{ animationDuration: '1.2s' }}>
                  {/* Smoke clouds */}
                  <circle cx="230" cy="60" r="22" fill="#64748b" fillOpacity="0.7" />
                  <circle cx="265" cy="45" r="28" fill="#475569" fillOpacity="0.8" />
                  <circle cx="280" cy="75" r="20" fill="#64748b" fillOpacity="0.7" />
                  {/* Flickering Fire Flames */}
                  <path d="M 230 130 Q 250 80 270 130 Q 260 110 250 90 Q 240 110 230 130 Z" fill="#ef4444" />
                  <path d="M 240 130 Q 250 100 260 130 Z" fill="#facc15" />
                </g>

                {/* Warning Pulse Banner */}
                <rect x="150" y="240" width="200" height="30" rx="6" fill="#ef4444" />
                <text x="250" y="260" fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">
                  {activeLanguage === 'hi' ? 'धुआं / आग की पहचान!' : 'SMOKE & FIRE DETECTED!'}
                </text>
              </svg>
            </div>
          );
        }

        if (step.stepNumber === 2) {
          // Raise alarm (Break-glass manual call point)
          return (
            <div className="relative w-full h-full flex items-center justify-center">
              <svg className="w-full h-64 md:h-72" viewBox="0 0 500 300" fill="none">
                {/* Red Break-Glass Call Point */}
                <g transform="translate(190, 40)">
                  <rect x="0" y="0" width="120" height="130" rx="10" fill="#dc2626" stroke="#b91c1c" strokeWidth="4" />
                  {/* Glass center */}
                  <rect x="20" y="20" width="80" height="60" rx="4" fill="#38bdf8" fillOpacity="0.4" stroke="#f8fafc" strokeWidth="2" />
                  {/* Cracked glass lines */}
                  <line x1="30" y1="30" x2="60" y2="50" stroke="#fff" strokeWidth="2" />
                  <line x1="60" y1="50" x2="90" y2="40" stroke="#fff" strokeWidth="2" />
                  <line x1="60" y1="50" x2="50" y2="70" stroke="#fff" strokeWidth="2" />
                  <circle cx="60" cy="50" r="12" fill="#ef4444" />
                  <text x="60" y="54" fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle">PUSH</text>
                  <text x="60" y="105" fill="#fff" fontSize="11" fontWeight="bold" textAnchor="middle">FIRE ALARM</text>
                </g>

                {/* Flashing Siren Sound Waves */}
                <g transform="translate(250, 105)" className={isPlaying ? 'animate-ping' : ''}>
                  <circle cx="0" cy="0" r="80" stroke="#ef4444" strokeWidth="2" fill="none" opacity="0.4" />
                  <circle cx="0" cy="0" r="110" stroke="#ef4444" strokeWidth="2" fill="none" opacity="0.2" />
                </g>

                <text x="250" y="240" fill="#ef4444" fontSize="15" fontWeight="black" textAnchor="middle">
                  {activeLanguage === 'hi' ? 'अलार्म बजाएं: पूरे परिसर में सायरन सक्रिय' : 'RAISE ALARM: PLANT-WIDE SIREN ACTIVATED'}
                </text>
              </svg>
            </div>
          );
        }

        if (step.stepNumber === 3) {
          // Inform emergency team / dispatch
          return (
            <div className="relative w-full h-full flex items-center justify-center">
              <svg className="w-full h-64 md:h-72" viewBox="0 0 500 300" fill="none">
                {/* Emergency Control Room Console */}
                <rect x="100" y="40" width="300" height="160" rx="10" fill="#0f172a" stroke="#ef4444" strokeWidth="3" />
                <rect x="120" y="60" width="130" height="90" rx="4" fill="#1e293b" />
                {/* Map with flashing location pin */}
                <circle cx="185" cy="105" r="10" fill="#ef4444" className={isPlaying ? 'animate-ping' : ''} />
                <circle cx="185" cy="105" r="6" fill="#fff" />
                <text x="185" y="130" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">ZONE 3 WORKSHOP</text>

                {/* Emergency phone on console */}
                <g transform="translate(280, 70)">
                  <rect x="0" y="0" width="80" height="60" rx="6" fill="#dc2626" />
                  <circle cx="40" cy="30" r="14" fill="#fff" />
                  <text x="40" y="34" fill="#dc2626" fontSize="12" fontWeight="bold" textAnchor="middle">101</text>
                  <text x="40" y="80" fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle">DISPATCHED</text>
                </g>

                <text x="250" y="240" fill="#38bdf8" fontSize="13" fontWeight="bold" textAnchor="middle">
                  {activeLanguage === 'hi' ? 'फायर ब्रिगेड व आपातकालीन टीम को तुरंत सूचित किया' : 'EMERGENCY TEAM & FIRE BRIGADE DISPATCHED'}
                </text>
              </svg>
            </div>
          );
        }

        if (step.stepNumber === 4) {
          // P.A.S.S. Extinguisher Action
          return (
            <div className="relative w-full h-full flex items-center justify-center">
              <svg className="w-full h-64 md:h-72" viewBox="0 0 500 300" fill="none">
                <rect x="0" y="220" width="500" height="80" fill="#0f172a" />

                {/* Red DCP Fire Extinguisher */}
                <g transform="translate(100, 60)">
                  {/* Cylinder */}
                  <rect x="20" y="40" width="50" height="110" rx="12" fill="#dc2626" stroke="#b91c1c" strokeWidth="2" />
                  {/* Squeeze Lever */}
                  <path d="M 30 40 L 45 15 L 60 40" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
                  {/* Pull Pin */}
                  <circle cx="35" cy="20" r="6" fill="#facc15" />
                  {/* Hose aiming forward */}
                  <path d="M 60 40 Q 90 40 120 75" stroke="#0f172a" strokeWidth="8" fill="none" />
                  <text x="45" y="100" fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle">DCP</text>
                </g>

                {/* Extinguisher Foam Cloud spraying at base */}
                <g transform="translate(220, 120)" className={isPlaying ? 'animate-pulse' : ''}>
                  <path d="M 0 15 Q 60 -10 120 20 Q 80 50 0 35 Z" fill="#f8fafc" fillOpacity="0.7" />
                  <circle cx="80" cy="20" r="14" fill="#f8fafc" fillOpacity="0.6" />
                  <circle cx="110" cy="30" r="16" fill="#f8fafc" fillOpacity="0.7" />
                </g>

                {/* Burning fuel base smothered */}
                <g transform="translate(340, 140)">
                  <ellipse cx="40" cy="70" rx="50" ry="15" fill="#78350f" />
                  {/* Dying flame */}
                  <path d="M 25 70 Q 40 40 55 70 Z" fill="#ef4444" opacity="0.6" />
                  <text x="40" y="40" fill="#10b981" fontSize="12" fontWeight="bold" textAnchor="middle">
                    BASE TARGETED
                  </text>
                </g>

                <text x="250" y="260" fill="#10b981" fontSize="13" fontWeight="bold" textAnchor="middle">
                  P.A.S.S. : PULL &bull; AIM AT BASE &bull; SQUEEZE &bull; SWEEP
                </text>
              </svg>
            </div>
          );
        }

        if (step.stepNumber === 5) {
          // Maintain safe escape route
          return (
            <div className="relative w-full h-full flex items-center justify-center">
              <svg className="w-full h-64 md:h-72" viewBox="0 0 500 300" fill="none">
                <rect x="0" y="200" width="500" height="100" fill="#0f172a" />

                {/* Green Illuminated Exit Door Behind Worker */}
                <g transform="translate(60, 40)">
                  <rect x="0" y="0" width="80" height="160" fill="#10b981" rx="4" stroke="#34d399" strokeWidth="3" />
                  <rect x="10" y="10" width="60" height="140" fill="#064e3b" />
                  {/* Exit Sign */}
                  <rect x="15" y="20" width="50" height="20" fill="#10b981" rx="2" />
                  <text x="40" y="34" fill="#fff" fontSize="9" fontWeight="bold" textAnchor="middle">EXIT &rarr;</text>
                  {/* Green illuminated floor path */}
                  <polygon points="40,160 0,260 120,260" fill="#10b981" fillOpacity="0.2" />
                </g>

                {/* Safe Retreat Arrow */}
                <path d="M 220 180 L 140 180" stroke="#10b981" strokeWidth="6" strokeLinecap="round" markerEnd="url(#arrow)" />

                {/* Worker with back to door */}
                <g transform="translate(230, 90)">
                  <circle cx="20" cy="20" r="16" fill="#fde047" />
                  <rect x="10" y="36" width="20" height="40" rx="4" fill="#3b82f6" />
                  <line x1="15" y1="76" x2="13" y2="110" stroke="#0f172a" strokeWidth="7" strokeLinecap="round" />
                  <line x1="25" y1="76" x2="27" y2="110" stroke="#0f172a" strokeWidth="7" strokeLinecap="round" />
                </g>

                {/* Fire in front of worker, never behind */}
                <g transform="translate(380, 130)">
                  <path d="M 20 70 Q 40 10 60 70 Z" fill="#ef4444" />
                  <path d="M 30 70 Q 40 30 50 70 Z" fill="#facc15" />
                  <text x="40" y="90" fill="#ef4444" fontSize="10" fontWeight="bold" textAnchor="middle">
                    FIRE IN FRONT
                  </text>
                </g>

                <text x="250" y="270" fill="#10b981" fontSize="13" fontWeight="bold" textAnchor="middle">
                  {activeLanguage === 'hi' ? 'निकास द्वार हमेशा अपनी पीठ पीछे खुला रखें' : 'KEEP UNBLOCKED ESCAPE ROUTE BEHIND YOU'}
                </text>
              </svg>
            </div>
          );
        }

        // Step 6: Evacuate to assembly point
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <svg className="w-full h-64 md:h-72" viewBox="0 0 500 300" fill="none">
              {/* Outdoor Assembly Ground */}
              <circle cx="250" cy="140" r="85" fill="#10b981" fillOpacity="0.12" stroke="#10b981" strokeWidth="3" />

              {/* Green Assembly Point Signboard */}
              <g transform="translate(210, 40)">
                <rect x="0" y="0" width="80" height="50" rx="6" fill="#10b981" stroke="#fff" strokeWidth="2" />
                {/* 4 arrows pointing inward */}
                <path d="M 15 15 L 25 25 M 65 15 L 55 25 M 15 35 L 25 25 M 65 35 L 55 25" stroke="#fff" strokeWidth="2.5" />
                <circle cx="40" cy="25" r="4" fill="#fff" />
                <text x="40" y="65" fill="#10b981" fontSize="10" fontWeight="bold" textAnchor="middle">
                  ASSEMBLY POINT
                </text>
              </g>

              {/* Group of Evacuated Workers Safe */}
              <g transform="translate(190, 120)">
                <circle cx="30" cy="20" r="10" fill="#fde047" />
                <rect x="22" y="30" width="16" height="25" rx="3" fill="#3b82f6" />
                <circle cx="60" cy="18" r="10" fill="#fde047" />
                <rect x="52" y="28" width="16" height="27" rx="3" fill="#10b981" />
                <circle cx="90" cy="20" r="10" fill="#fde047" />
                <rect x="82" y="30" width="16" height="25" rx="3" fill="#f59e0b" />
              </g>

              <text x="250" y="250" fill="#10b981" fontSize="14" fontWeight="bold" textAnchor="middle">
                {activeLanguage === 'hi' ? 'सभी कर्मचारी सुरक्षित असेंबली पॉइंट पर एकत्रित' : 'ALL WORKERS EVACUATED TO ASSEMBLY POINT'}
              </text>
            </svg>
          </div>
        );

      // -------------------------------------------------------------
      // SCENARIO 4: MINING AREA SAFETY
      // -------------------------------------------------------------
      case 'scenario-4-mining':
        if (step.stepNumber === 1) {
          // Wear mining PPE & cap lamp
          return (
            <div className="relative w-full h-full flex items-center justify-center">
              <svg className="w-full h-64 md:h-72" viewBox="0 0 500 300" fill="none">
                {/* Dark Mine Tunnel Background */}
                <rect x="0" y="0" width="500" height="300" fill="#020617" />
                <path d="M 0 50 Q 250 10 500 50 L 500 300 L 0 300 Z" fill="#0f172a" />

                {/* Miner Avatar with Cap Lamp Light Beam */}
                <g transform="translate(140, 60)">
                  {/* Cap Lamp LED on Helmet */}
                  <polygon points="65,48 400,-10 400,160" fill="#fef08a" fillOpacity="0.18" />
                  {/* Helmet */}
                  <path d="M 35 48 Q 60 20 85 48 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
                  <circle cx="60" cy="38" r="7" fill="#38bdf8" />
                  {/* Head */}
                  <circle cx="60" cy="62" r="18" fill="#fde047" />
                  {/* High Vis Vest */}
                  <rect x="42" y="80" width="36" height="45" rx="4" fill="#f97316" />
                  <line x1="42" y1="95" x2="78" y2="95" stroke="#fff" strokeWidth="5" />
                  <line x1="42" y1="110" x2="78" y2="110" stroke="#fff" strokeWidth="5" />
                </g>

                <text x="250" y="250" fill="#38bdf8" fontSize="13" fontWeight="bold" textAnchor="middle">
                  {activeLanguage === 'hi' ? 'डीजीएमएस प्रमाणित कैप लैंप व रिफ्लेक्टिव जैकेट' : 'DGMS APPROVED CAP LAMP & HIGH-VISIBILITY VEST'}
                </text>
              </svg>
            </div>
          );
        }

        if (step.stepNumber === 2) {
          // Check strata / ceiling cracks
          return (
            <div className="relative w-full h-full flex items-center justify-center">
              <svg className="w-full h-64 md:h-72" viewBox="0 0 500 300" fill="none">
                <rect x="0" y="0" width="500" height="300" fill="#0f172a" />
                {/* Mine Roof Strata */}
                <path d="M 0 60 Q 150 70 300 50 Q 400 70 500 50 L 500 0 L 0 0 Z" fill="#1e293b" />
                {/* Rock fracture line */}
                <path d="M 180 60 L 210 90 L 230 80 L 260 110" stroke="#ef4444" strokeWidth="3" fill="none" strokeDasharray="4 2" />
                <circle cx="220" cy="85" r="14" fill="#ef4444" className={isPlaying ? 'animate-ping' : ''} />
                <text x="220" y="90" fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">!</text>

                {/* Rock bolt support system */}
                <line x1="120" y1="60" x2="120" y2="20" stroke="#10b981" strokeWidth="4" />
                <circle cx="120" cy="60" r="5" fill="#10b981" />
                <line x1="340" y1="55" x2="340" y2="15" stroke="#10b981" strokeWidth="4" />
                <circle cx="340" cy="55" r="5" fill="#10b981" />

                <text x="250" y="240" fill="#f59e0b" fontSize="13" fontWeight="bold" textAnchor="middle">
                  {activeLanguage === 'hi' ? 'छत की दरारों व रॉक बोल्ट की पूर्व जांच' : 'INSPECT ROOF STRATA & ROCK BOLT SUPPORT'}
                </text>
              </svg>
            </div>
          );
        }

        if (step.stepNumber === 3) {
          // Designated pedestrian walkway
          return (
            <div className="relative w-full h-full flex items-center justify-center">
              <svg className="w-full h-64 md:h-72" viewBox="0 0 500 300" fill="none">
                <rect x="0" y="0" width="500" height="300" fill="#0f172a" />
                {/* Haul road with truck tire marks */}
                <rect x="0" y="100" width="300" height="200" fill="#1e293b" />
                <line x1="40" y1="100" x2="40" y2="300" stroke="#334155" strokeWidth="8" strokeDasharray="20 15" />
                <line x1="240" y1="100" x2="240" y2="300" stroke="#334155" strokeWidth="8" strokeDasharray="20 15" />

                {/* Pedestrian walkway separated by steel barrier */}
                <rect x="320" y="50" width="180" height="250" fill="#064e3b" />
                <line x1="310" y1="50" x2="310" y2="300" stroke="#eab308" strokeWidth="6" />

                {/* Footprints inside green zone */}
                <path d="M 400 240 L 400 120" stroke="#34d399" strokeWidth="4" strokeDasharray="8 8" />
                <text x="410" y="100" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">
                  PEDESTRIAN FAIRWAY
                </text>

                <text x="250" y="270" fill="#10b981" fontSize="13" fontWeight="bold" textAnchor="middle">
                  {activeLanguage === 'hi' ? 'केवल निर्धारित पैदल रास्ते पर ही चलें' : 'STAY EXCLUSIVELY ON DESIGNATED PEDESTRIAN ROUTE'}
                </text>
              </svg>
            </div>
          );
        }

        if (step.stepNumber === 4) {
          // Stay away from dump truck blindspot (15m rule)
          return (
            <div className="relative w-full h-full flex items-center justify-center">
              <svg className="w-full h-64 md:h-72" viewBox="0 0 500 300" fill="none">
                <rect x="0" y="0" width="500" height="300" fill="#0f172a" />

                {/* 35-Tonne Dump Truck */}
                <g transform="translate(180, 70)">
                  {/* Yellow dumper body */}
                  <polygon points="0,50 140,50 120,10 20,10" fill="#eab308" stroke="#ca8a04" strokeWidth="3" />
                  <rect x="100" y="30" width="40" height="40" rx="4" fill="#0284c7" />
                  {/* Huge mining wheels */}
                  <circle cx="30" cy="85" r="24" fill="#0f172a" stroke="#475569" strokeWidth="4" />
                  <circle cx="110" cy="85" r="24" fill="#0f172a" stroke="#475569" strokeWidth="4" />
                </g>

                {/* 15m Danger Blindspot Zone (Red Circle) */}
                <circle cx="250" cy="130" r="95" stroke="#ef4444" strokeWidth="3" strokeDasharray="6 4" fill="#ef4444" fillOpacity="0.1" className={isPlaying ? 'animate-pulse' : ''} />
                <text x="250" y="200" fill="#ef4444" fontSize="11" fontWeight="bold" textAnchor="middle">
                  15m DANGER RADIUS / DRIVER BLIND SPOT
                </text>

                {/* Safe Refuge Bay Alcove */}
                <g transform="translate(390, 80)">
                  <rect x="0" y="0" width="70" height="80" rx="6" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                  <text x="35" y="45" fill="#10b981" fontSize="9" fontWeight="bold" textAnchor="middle">
                    REFUGE BAY
                  </text>
                  <circle cx="35" cy="20" r="8" fill="#fde047" />
                </g>

                <text x="250" y="270" fill="#ef4444" fontSize="13" fontWeight="bold" textAnchor="middle">
                  {activeLanguage === 'hi' ? 'डंपर के 15 मीटर के दायरे और ब्लाइंड स्पॉट से दूर रहें' : 'MAINTAIN 15M CLEARANCE FROM HEAVY MINING DUMPERS'}
                </text>
              </svg>
            </div>
          );
        }

        if (step.stepNumber === 5) {
          // Follow supervisor / Sirdar instructions
          return (
            <div className="relative w-full h-full flex items-center justify-center">
              <svg className="w-full h-64 md:h-72" viewBox="0 0 500 300" fill="none">
                <rect x="0" y="0" width="500" height="300" fill="#0f172a" />

                {/* Mining Sirdar Character with White Helmet & Green Signal */}
                <g transform="translate(180, 50)">
                  {/* White helmet */}
                  <path d="M 30 30 Q 55 10 80 30 Z" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" />
                  <circle cx="55" cy="45" r="16" fill="#fde047" />
                  <rect x="40" y="62" width="30" height="45" rx="4" fill="#1e293b" />
                  {/* Arm holding Green Signal Lamp */}
                  <line x1="70" y1="70" x2="110" y2="40" stroke="#fde047" strokeWidth="5" strokeLinecap="round" />
                  <circle cx="115" cy="35" r="16" fill="#10b981" className={isPlaying ? 'animate-pulse' : ''} />
                  <text x="115" y="40" fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">✓</text>
                </g>

                <text x="250" y="240" fill="#10b981" fontSize="14" fontWeight="bold" textAnchor="middle">
                  {activeLanguage === 'hi' ? 'माइनिंग सरदार के निर्देशों व सिग्नल का अनिवार्य पालन' : 'STRICT ADHERENCE TO STATUTORY SIRDAR INSTRUCTIONS'}
                </text>
              </svg>
            </div>
          );
        }

        // Step 6: Report hazards immediately
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <svg className="w-full h-64 md:h-72" viewBox="0 0 500 300" fill="none">
              <rect x="0" y="0" width="500" height="300" fill="#0f172a" />

              {/* Underground Mine Telephone Station */}
              <g transform="translate(140, 50)">
                <rect x="0" y="0" width="90" height="130" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="3" />
                <rect x="15" y="15" width="60" height="30" fill="#0284c7" rx="4" />
                <text x="45" y="34" fill="#fff" fontSize="9" fontWeight="bold" textAnchor="middle">MINE TEL</text>
                <circle cx="45" cy="80" r="14" fill="#f59e0b" />
                <text x="45" y="85" fill="#000" fontSize="14" fontWeight="bold" textAnchor="middle">📞</text>
              </g>

              {/* DGMS Hazard Incident Log Book */}
              <g transform="translate(280, 50)">
                <rect x="0" y="0" width="110" height="130" rx="6" fill="#f8fafc" stroke="#64748b" strokeWidth="2" />
                <rect x="10" y="12" width="90" height="10" fill="#ef4444" rx="2" />
                <line x1="10" y1="35" x2="100" y2="35" stroke="#94a3b8" strokeWidth="3" />
                <line x1="10" y1="50" x2="80" y2="50" stroke="#94a3b8" strokeWidth="3" />
                <circle cx="55" cy="85" r="16" fill="#10b981" />
                <text x="55" y="90" fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">✓</text>
                <text x="55" y="115" fill="#0f172a" fontSize="8" fontWeight="bold" textAnchor="middle">LOGGED</text>
              </g>

              <text x="250" y="240" fill="#10b981" fontSize="13" fontWeight="bold" textAnchor="middle">
                {activeLanguage === 'hi' ? 'खतरे की तुरंत रिपोर्टिंग &bull; शून्य दुर्घटना लक्ष्य' : 'IMMEDIATE HAZARD REPORTING SAVES LIVES'}
              </text>
            </svg>
          </div>
        );

      // -------------------------------------------------------------
      // SCENARIO 5: MANUFACTURING MACHINERY SAFETY
      // -------------------------------------------------------------
      case 'scenario-5-machinery':
      default:
        if (step.stepNumber === 1) {
          // Identify nip points
          return (
            <div className="relative w-full h-full flex items-center justify-center">
              <svg className="w-full h-64 md:h-72" viewBox="0 0 500 300" fill="none">
                <rect x="0" y="220" width="500" height="80" fill="#0f172a" />

                {/* Rotating Gears & In-Running Rollers */}
                <g transform="translate(180, 60)">
                  {/* Left Roller */}
                  <circle cx="40" cy="60" r="35" fill="#334155" stroke="#64748b" strokeWidth="4" />
                  <path d="M 40 30 A 30 30 0 0 1 70 60" stroke="#facc15" strokeWidth="4" fill="none" className={isPlaying ? 'animate-spin' : ''} style={{ transformOrigin: '40px 60px' }} />
                  {/* Right Roller */}
                  <circle cx="105" cy="60" r="35" fill="#334155" stroke="#64748b" strokeWidth="4" />
                  <path d="M 105 30 A 30 30 0 0 0 75 60" stroke="#facc15" strokeWidth="4" fill="none" className={isPlaying ? 'animate-spin' : ''} style={{ transformOrigin: '105px 60px' }} />

                  {/* Danger Nip Arrow pointing into pinch zone */}
                  <polygon points="72,15 65,35 79,35" fill="#ef4444" />
                  <circle cx="72.5" cy="60" r="14" fill="#ef4444" className={isPlaying ? 'animate-ping' : ''} />
                  <text x="72.5" y="65" fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">!</text>
                  <text x="72.5" y="115" fill="#ef4444" fontSize="11" fontWeight="bold" textAnchor="middle">
                    IN-RUNNING NIP POINT
                  </text>
                </g>

                <text x="250" y="250" fill="#f59e0b" fontSize="13" fontWeight="bold" textAnchor="middle">
                  {activeLanguage === 'hi' ? 'मशीन के घूमने वाले रोलर व खिंचाव के खतरे पहचानें' : 'IDENTIFY ROTATING ROLLERS & DANGEROUS PINCH POINTS'}
                </text>
              </svg>
            </div>
          );
        }

        if (step.stepNumber === 2) {
          // Check machine guards
          return (
            <div className="relative w-full h-full flex items-center justify-center">
              <svg className="w-full h-64 md:h-72" viewBox="0 0 500 300" fill="none">
                {/* Rollers behind mesh */}
                <circle cx="210" cy="110" r="30" fill="#334155" />
                <circle cx="270" cy="110" r="30" fill="#334155" />

                {/* Steel Interlocked Mesh Guard locked in place */}
                <g transform="translate(150, 50)">
                  <rect x="0" y="0" width="180" height="120" rx="8" fill="#10b981" fillOpacity="0.15" stroke="#10b981" strokeWidth="3" />
                  {/* Wire grid */}
                  <line x1="30" y1="0" x2="30" y2="120" stroke="#10b981" strokeWidth="1.5" />
                  <line x1="60" y1="0" x2="60" y2="120" stroke="#10b981" strokeWidth="1.5" />
                  <line x1="90" y1="0" x2="90" y2="120" stroke="#10b981" strokeWidth="1.5" />
                  <line x1="120" y1="0" x2="120" y2="120" stroke="#10b981" strokeWidth="1.5" />
                  <line x1="150" y1="0" x2="150" y2="120" stroke="#10b981" strokeWidth="1.5" />
                  <line x1="0" y1="30" x2="180" y2="30" stroke="#10b981" strokeWidth="1.5" />
                  <line x1="0" y1="60" x2="180" y2="60" stroke="#10b981" strokeWidth="1.5" />
                  <line x1="0" y1="90" x2="180" y2="90" stroke="#10b981" strokeWidth="1.5" />
                  {/* Safety limit interlock switch */}
                  <circle cx="170" cy="20" r="8" fill="#10b981" />
                  <text x="90" y="140" fill="#10b981" fontSize="11" fontWeight="bold" textAnchor="middle">
                    GUARD LOCKED &bull; INTERLOCK ENGAGED
                  </text>
                </g>

                <text x="250" y="240" fill="#10b981" fontSize="13" fontWeight="bold" textAnchor="middle">
                  {activeLanguage === 'hi' ? 'सुरक्षा जाली (गार्ड) बंद और इंटरलॉक स्विच चालू' : 'MACHINE GUARDS SECURE & INTERLOCK VERIFIED'}
                </text>
              </svg>
            </div>
          );
        }

        if (step.stepNumber === 3) {
          // Keep hands / body clear of moving parts (no loose clothes)
          return (
            <div className="relative w-full h-full flex items-center justify-center">
              <svg className="w-full h-64 md:h-72" viewBox="0 0 500 300" fill="none">
                {/* Left: Unsafe Loose Clothing */}
                <g transform="translate(80, 50)">
                  <circle cx="50" cy="40" r="20" fill="#fde047" stroke="#ef4444" strokeWidth="2" />
                  <rect x="35" y="62" width="30" height="45" rx="4" fill="#3b82f6" />
                  {/* Long loose sleeves trailing into hazard */}
                  <path d="M 35 70 Q 15 110 5 130" stroke="#ef4444" strokeWidth="6" strokeDasharray="3 3" fill="none" />
                  <circle cx="50" cy="140" r="16" fill="#ef4444" />
                  <path d="M 40 130 L 60 150 M 60 130 L 40 150" stroke="#fff" strokeWidth="4" />
                  <text x="50" y="175" fill="#ef4444" fontSize="11" fontWeight="bold" textAnchor="middle">
                    {activeLanguage === 'hi' ? 'असुरक्षित: ढीले कपड़े' : 'UNSAFE: LOOSE FABRIC'}
                  </text>
                </g>

                {/* Right: Safe Rolled Sleeves behind yellow line */}
                <g transform="translate(290, 50)">
                  <circle cx="50" cy="40" r="20" fill="#fde047" stroke="#10b981" strokeWidth="2" />
                  <rect x="35" y="62" width="30" height="45" rx="4" fill="#3b82f6" />
                  {/* Rolled tight sleeves */}
                  <rect x="25" y="70" width="10" height="12" rx="3" fill="#1e293b" />
                  <rect x="65" y="70" width="10" height="12" rx="3" fill="#1e293b" />
                  {/* Yellow safety floor line */}
                  <line x1="0" y1="125" x2="100" y2="125" stroke="#eab308" strokeWidth="6" />
                  <circle cx="50" cy="140" r="16" fill="#10b981" />
                  <path d="M 42 140 L 48 146 L 58 134" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
                  <text x="50" y="175" fill="#10b981" fontSize="11" fontWeight="bold" textAnchor="middle">
                    {activeLanguage === 'hi' ? 'सुरक्षित: मुड़ी आस्तीन' : 'SAFE: TIGHT SLEEVES'}
                  </text>
                </g>

                <text x="250" y="260" fill="#38bdf8" fontSize="13" fontWeight="bold" textAnchor="middle">
                  {activeLanguage === 'hi' ? 'घूमने वाली मशीन से शरीर और हाथ दूर रखें' : 'KEEP HANDS CLEAR & TIGHT CLOTHING AT ALL TIMES'}
                </text>
              </svg>
            </div>
          );
        }

        if (step.stepNumber === 4) {
          // Authorized start / stop procedure
          return (
            <div className="relative w-full h-full flex items-center justify-center">
              <svg className="w-full h-64 md:h-72" viewBox="0 0 500 300" fill="none">
                {/* Control Station Panel */}
                <rect x="150" y="40" width="200" height="170" rx="10" fill="#1e293b" stroke="#475569" strokeWidth="3" />

                {/* Pre-warning horn sound wave */}
                <g transform="translate(190, 80)">
                  <polygon points="0,15 20,5 20,25" fill="#f59e0b" />
                  <circle cx="30" cy="15" r="8" fill="#f59e0b" fillOpacity="0.3" className={isPlaying ? 'animate-ping' : ''} />
                  <text x="45" y="20" fill="#f59e0b" fontSize="10" fontWeight="bold">PRE-START HORN</text>
                </g>

                {/* Big Green Start Button */}
                <g transform="translate(225, 120)">
                  <circle cx="25" cy="25" r="22" fill="#10b981" stroke="#059669" strokeWidth="4" className={isPlaying ? 'animate-pulse' : ''} />
                  <text x="25" y="30" fill="#fff" fontSize="11" fontWeight="bold" textAnchor="middle">START</text>
                </g>

                <text x="250" y="250" fill="#10b981" fontSize="13" fontWeight="bold" textAnchor="middle">
                  {activeLanguage === 'hi' ? 'चेतावनी सायरन के बाद ही अधिकृत तरीके से चालू करें' : 'AUDIBLE PRE-WARNING BEFORE STARTING MOTORS'}
                </text>
              </svg>
            </div>
          );
        }

        if (step.stepNumber === 5) {
          // Maintenance LOTO
          return (
            <div className="relative w-full h-full flex items-center justify-center">
              <svg className="w-full h-64 md:h-72" viewBox="0 0 500 300" fill="none">
                {/* Power disconnect box */}
                <rect x="120" y="40" width="260" height="160" rx="10" fill="#0f172a" stroke="#dc2626" strokeWidth="3" />
                <text x="250" y="70" fill="#f8fafc" fontSize="12" fontWeight="bold" textAnchor="middle">
                  ZERO MECHANICAL ENERGY LOCKOUT
                </text>

                {/* Big Red Padlock Clamped */}
                <g transform="translate(230, 90)">
                  <path d="M 10 0 Q 20 -20 30 0" stroke="#f59e0b" strokeWidth="6" fill="none" />
                  <rect x="0" y="0" width="40" height="50" rx="6" fill="#dc2626" />
                  <circle cx="20" cy="20" r="5" fill="#fff" />
                </g>

                <text x="250" y="250" fill="#10b981" fontSize="13" fontWeight="bold" textAnchor="middle">
                  {activeLanguage === 'hi' ? 'रखरखाव से पहले मेन स्विच पर ताला (LOTO) लगाएं' : 'APPLY PERSONAL LOTO PADLOCK BEFORE SERVICING'}
                </text>
              </svg>
            </div>
          );
        }

        // Step 6: E-Stop and reporting
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <svg className="w-full h-64 md:h-72" viewBox="0 0 500 300" fill="none">
              {/* Yellow Industrial E-Stop Enclosure */}
              <rect x="160" y="40" width="180" height="170" rx="12" fill="#eab308" stroke="#ca8a04" strokeWidth="4" />

              {/* Large Red Mushroom Emergency Stop Pushbutton */}
              <g transform="translate(250, 120)" className={isPlaying ? 'animate-bounce' : ''} style={{ animationDuration: '2s' }}>
                <circle cx="0" cy="0" r="42" fill="#dc2626" stroke="#b91c1c" strokeWidth="4" />
                <circle cx="0" cy="0" r="30" fill="#ef4444" />
                <text x="0" y="5" fill="#ffffff" fontSize="13" fontWeight="black" textAnchor="middle">
                  E-STOP
                </text>
              </g>

              {/* Instant 0.2s stop badge */}
              <rect x="185" y="170" width="130" height="24" rx="4" fill="#0f172a" />
              <text x="250" y="186" fill="#10b981" fontSize="10" fontWeight="bold" textAnchor="middle">
                &lt; 200ms TRIP RESPONSE
              </text>

              <text x="250" y="250" fill="#ef4444" fontSize="14" fontWeight="black" textAnchor="middle">
                {activeLanguage === 'hi' ? 'खतरे की स्थिति में लाल इमरजेंसी स्टॉप दबाएं!' : 'HIT EMERGENCY STOP IMMEDIATELY ON DANGER!'}
              </text>
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full min-h-[300px] md:min-h-[340px] flex flex-col items-center justify-center relative select-none">
      {/* Visual Animation Scene */}
      <div className="w-full flex-1 flex items-center justify-center relative">
        {renderVisualAnimation()}
      </div>

      {/* Unsafe vs Safe Real-Time Indicator Bar */}
      <div className="w-full px-4 pb-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        {step.unsafeWarning && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-950/80 border border-red-500/40 text-red-300">
            <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span className="font-semibold text-[11px]">
              {activeLanguage === 'hi' ? step.unsafeWarning.labelHi : step.unsafeWarning.labelEn}
            </span>
          </div>
        )}

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 ml-auto">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="font-semibold text-[11px]">
            {activeLanguage === 'hi' ? step.safeConfirmation.labelHi : step.safeConfirmation.labelEn}
          </span>
        </div>
      </div>
    </div>
  );
};
