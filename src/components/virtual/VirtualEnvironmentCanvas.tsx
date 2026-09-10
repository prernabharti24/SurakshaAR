import React from 'react';
import {
  EnvironmentDefinition,
  VirtualHotspot,
  VirtualSafetyEvent
} from '../../types';
import {
  AlertTriangle,
  Flame,
  Zap,
  HardHat,
  ShieldAlert,
  Pickaxe,
  Info,
  CheckCircle2,
  Volume2,
  Wind
} from 'lucide-react';

interface VirtualEnvironmentCanvasProps {
  environment: EnvironmentDefinition;
  activeEvent: VirtualSafetyEvent | null;
  activeStageIndex: number;
  selectedHotspot: VirtualHotspot | null;
  onSelectHotspot: (hotspot: VirtualHotspot | null) => void;
  onTriggerEventClick?: (event: VirtualSafetyEvent) => void;
  isHindi: boolean;
  isAlarmActive: boolean;
}

export const VirtualEnvironmentCanvas: React.FC<VirtualEnvironmentCanvasProps> = ({
  environment,
  activeEvent,
  selectedHotspot,
  onSelectHotspot,
  isHindi,
  isAlarmActive
}) => {
  const isMining = environment.id === 'mining';

  return (
    <div className="relative w-full aspect-[16/9] min-h-[380px] max-h-[560px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl select-none">
      {/* 1. AMBIENT ALARM STROBE OVERLAY */}
      {isAlarmActive && (
        <div className="absolute inset-0 z-20 pointer-events-none animate-pulse bg-red-600/20 border-4 border-red-500/80 transition-all duration-300">
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white font-bold px-4 py-1 rounded-full shadow-lg flex items-center gap-2 text-xs uppercase tracking-wider animate-bounce">
            <AlertTriangle className="w-4 h-4 animate-spin text-amber-300" />
            <span>{isHindi ? '🚨 आपातकालीन चेतावनी सक्रिय (अलार्म चालू)' : '🚨 EMERGENCY ALARM ACTIVE - EVACUATION PREPAREDNESS'}</span>
          </div>
        </div>
      )}

      {/* 2. SVG 2.5D INTERACTIVE WORKPLACE RENDERING */}
      <svg
        viewBox="0 0 1000 600"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Manufacturing Gradients */}
          <linearGradient id="floorMakers" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="mineFloor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#181512" />
            <stop offset="100%" stopColor="#0c0a09" />
          </linearGradient>
          <linearGradient id="wallGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="50%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <pattern id="hazardStripe" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="10" height="20" fill="#f59e0b" />
            <rect x="10" width="10" height="20" fill="#0f172a" />
          </pattern>
          <radialGradient id="sparkGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="1" />
            <stop offset="60%" stopColor="#0284c7" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="fireGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#f97316" stopOpacity="0.6" />
            <stop offset="80%" stopColor="#eab308" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="gasCloud" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.7" />
            <stop offset="60%" stopColor="#6366f1" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {!isMining ? (
          /* ====================================================== */
          /* 🏭 MANUFACTURING FLOOR GRAPHICS                        */
          /* ====================================================== */
          <g id="manufacturing-scene">
            {/* Background Floor & Perspective Lines */}
            <rect x="0" y="0" width="1000" height="600" fill="url(#floorMakers)" />
            {/* Rear Factory Walls */}
            <polygon points="0,0 1000,0 1000,200 0,200" fill="#1e293b" />
            {/* Wall Panels and Steel Girders */}
            <line x1="200" y1="0" x2="200" y2="200" stroke="#334155" strokeWidth="4" />
            <line x1="450" y1="0" x2="450" y2="200" stroke="#334155" strokeWidth="4" />
            <line x1="750" y1="0" x2="750" y2="200" stroke="#334155" strokeWidth="4" />
            {/* Overhead Crane Rails */}
            <rect x="0" y="50" width="1000" height="18" fill="#475569" />
            <rect x="0" y="54" width="1000" height="6" fill="#f59e0b" />
            {/* Yellow Floor Walkways */}
            <polygon points="400,200 480,200 560,600 360,600" fill="#047857" opacity="0.2" />
            <line x1="400" y1="200" x2="360" y2="600" stroke="#10b981" strokeWidth="3" strokeDasharray="8 6" />
            <line x1="480" y1="200" x2="560" y2="600" stroke="#10b981" strokeWidth="3" strokeDasharray="8 6" />

            {/* Restricted Hazard Perimeter Zone (Forklift / Crane) */}
            <polygon points="180,420 820,420 880,590 120,590" fill="none" stroke="url(#hazardStripe)" strokeWidth="12" />

            {/* Machine 1: Pneumatic Press (Left) */}
            <g transform="translate(200, 160)">
              <rect x="0" y="0" width="140" height="190" rx="8" fill="#334155" stroke="#64748b" strokeWidth="3" />
              <rect x="15" y="20" width="110" height="40" rx="4" fill="#0284c7" />
              <text x="70" y="44" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">HYDRAULIC PRESS</text>
              {/* Press Ram and Sensor Curtain */}
              <rect x="40" y="70" width="60" height="70" fill="#1e293b" />
              <line x1="25" y1="80" x2="25" y2="135" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2" />
              <line x1="115" y1="80" x2="115" y2="135" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2" />
              {/* Status Lamp */}
              <circle cx="120" cy="18" r="6" fill="#22c55e" className="animate-pulse" />
            </g>

            {/* Machine 2: In-Running Conveyor (Center Right) */}
            <g transform="translate(540, 260)">
              <rect x="0" y="40" width="260" height="45" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="2" />
              {/* Rollers */}
              <circle cx="25" cy="62" r="18" fill="#64748b" stroke="#94a3b8" strokeWidth="2" />
              <circle cx="85" cy="62" r="18" fill="#64748b" stroke="#94a3b8" strokeWidth="2" />
              <circle cx="145" cy="62" r="18" fill="#64748b" stroke="#94a3b8" strokeWidth="2" />
              <circle cx="205" cy="62" r="18" fill="#64748b" stroke="#94a3b8" strokeWidth="2" />
              {/* Moving Belt Dash */}
              <rect x="25" y="44" width="210" height="8" fill="#334155" />
              <line x1="25" y1="48" x2="235" y2="48" stroke="#f59e0b" strokeWidth="2" strokeDasharray="12 8" />
              {/* Red Mushroom Emergency Stop (E-Stop) */}
              <g transform="translate(230, 15)">
                <rect x="0" y="0" width="16" height="25" fill="#eab308" rx="2" />
                <circle cx="8" cy="4" r="9" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                <text x="8" y="32" fill="#f87171" fontSize="9" fontWeight="bold" textAnchor="middle">E-STOP</text>
              </g>
            </g>

            {/* Electrical MCC Substation Panel (Far Left) */}
            <g transform="translate(50, 280)">
              <rect x="0" y="0" width="110" height="180" rx="4" fill="#1e293b" stroke="#64748b" strokeWidth="3" />
              <rect x="10" y="15" width="90" height="40" fill="#334155" rx="2" />
              {/* 440V Danger Sign */}
              <polygon points="55,20 75,46 35,46" fill="#facc15" stroke="#000000" strokeWidth="1" />
              <text x="55" y="43" fill="#000000" fontSize="10" fontWeight="bold" textAnchor="middle">⚡</text>
              <text x="55" y="70" fill="#f87171" fontSize="11" fontWeight="bold" textAnchor="middle">440V LOTO</text>
              {/* Rubber Dielectric Mat on floor */}
              <rect x="-10" y="180" width="130" height="35" fill="#0f172a" stroke="#0284c7" strokeWidth="2" strokeDasharray="4 2" />
              <text x="55" y="200" fill="#38bdf8" fontSize="9" textAnchor="middle">IS 15652 RUBBER MAT</text>
            </g>

            {/* Emergency Exit Door (Right Wall) */}
            <g transform="translate(860, 120)">
              <rect x="0" y="0" width="80" height="150" fill="#065f46" stroke="#10b981" strokeWidth="3" rx="4" />
              {/* Photoluminescent Exit Sign */}
              <rect x="10" y="-22" width="60" height="18" fill="#10b981" rx="2" />
              <text x="40" y="-9" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">EXIT / निकास</text>
              {/* Push Panic Bar */}
              <rect x="10" y="75" width="60" height="10" fill="#e2e8f0" stroke="#475569" strokeWidth="1" rx="3" />
            </g>

            {/* Fire Extinguisher (Mounted on Right Wall) */}
            <g transform="translate(820, 240)">
              <rect x="6" y="0" width="14" height="40" rx="6" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
              <rect x="11" y="-8" width="4" height="8" fill="#475569" />
              <circle cx="13" cy="-4" r="5" fill="#fef08a" stroke="#000" strokeWidth="0.5" />
              <text x="13" y="52" fill="#ef4444" fontSize="9" fontWeight="bold" textAnchor="middle">DCP</text>
            </g>

            {/* Animated Industrial Workers */}
            {/* Worker 1: Near Press with Helmet */}
            <g transform="translate(360, 240)">
              {/* Hardhat */}
              <path d="M-10,-24 Q0,-34 10,-24 Z" fill="#eab308" />
              <circle cx="0" cy="-18" r="7" fill="#fed7aa" />
              {/* Hi-Vis Orange Vest */}
              <rect x="-10" y="-10" width="20" height="26" fill="#f97316" rx="2" />
              <line x1="-10" y1="2" x2="10" y2="2" stroke="#ffffff" strokeWidth="3" />
              {/* Legs / Boots */}
              <line x1="-5" y1="16" x2="-5" y2="38" stroke="#1e293b" strokeWidth="4" />
              <line x1="5" y1="16" x2="5" y2="38" stroke="#1e293b" strokeWidth="4" />
              <rect x="-8" y="36" width="6" height="4" fill="#000000" />
              <rect x="2" y="36" width="6" height="4" fill="#000000" />
            </g>

            {/* Worker 2: Walking near Haul Corridor */}
            <g transform="translate(500, 380)">
              <path d="M-8,-20 Q0,-30 8,-20 Z" fill="#ffffff" />
              <circle cx="0" cy="-14" r="6" fill="#fed7aa" />
              <rect x="-9" y="-7" width="18" height="24" fill="#22c55e" rx="2" />
              <line x1="-9" y1="4" x2="9" y2="4" stroke="#ffffff" strokeWidth="2.5" />
              <line x1="-4" y1="17" x2="-7" y2="36" stroke="#334155" strokeWidth="3" />
              <line x1="4" y1="17" x2="7" y2="36" stroke="#334155" strokeWidth="3" />
            </g>
          </g>
        ) : (
          /* ====================================================== */
          /* ⛏ MINING AREA GRAPHICS                                 */
          /* ====================================================== */
          <g id="mining-scene">
            {/* Dark Underground Rock Tunnel Floor */}
            <rect x="0" y="0" width="1000" height="600" fill="url(#mineFloor)" />

            {/* Underground Strata Seam Roof (Rock & Coal layers) */}
            <path
              d="M0,0 L1000,0 L1000,140 Q850,110 700,135 T400,120 T150,135 L0,125 Z"
              fill="#292524"
              stroke="#44403c"
              strokeWidth="4"
            />
            {/* Rock Bolt Plates on Roof */}
            <g fill="#78716c">
              <rect x="120" y="110" width="16" height="16" rx="2" />
              <rect x="260" y="100" width="16" height="16" rx="2" />
              <rect x="420" y="105" width="16" height="16" rx="2" />
              <rect x="580" y="115" width="16" height="16" rx="2" />
              <rect x="740" y="95" width="16" height="16" rx="2" />
            </g>

            {/* Hydraulic Steel Arch Props (Support System) */}
            <path d="M80,120 L120,600" stroke="#71717a" strokeWidth="12" />
            <path d="M920,110 L880,600" stroke="#71717a" strokeWidth="12" />
            <path d="M120,120 Q500,70 880,110" fill="none" stroke="#71717a" strokeWidth="10" />

            {/* Haulage Road with Tire Tracks */}
            <polygon points="340,220 660,220 840,600 160,600" fill="#1c1917" stroke="#292524" strokeWidth="2" />
            <line x1="380" y1="220" x2="260" y2="600" stroke="#292524" strokeWidth="6" strokeDasharray="14 10" />
            <line x1="620" y1="220" x2="740" y2="600" stroke="#292524" strokeWidth="6" strokeDasharray="14 10" />

            {/* 35T Heavy Mining Dumper Vehicle */}
            <g transform="translate(620, 240)">
              {/* Dumper Body (Yellow Heavy Metal) */}
              <polygon points="20,20 180,0 200,80 30,80" fill="#eab308" stroke="#ca8a04" strokeWidth="3" />
              <rect x="0" y="30" width="40" height="45" fill="#ca8a04" rx="3" />
              {/* Driver Cab */}
              <rect x="5" y="15" width="30" height="25" fill="#38bdf8" opacity="0.8" rx="2" />
              {/* Gigantic Off-Highway Tires */}
              <circle cx="45" cy="85" r="28" fill="#18181b" stroke="#3f3f46" strokeWidth="4" />
              <circle cx="45" cy="85" r="14" fill="#71717a" />
              <circle cx="165" cy="85" r="28" fill="#18181b" stroke="#3f3f46" strokeWidth="4" />
              <circle cx="165" cy="85" r="14" fill="#71717a" />
              {/* Reversing Beacon / Hazard Strobe */}
              <circle cx="190" cy="15" r="6" fill="#ef4444" className="animate-ping" />
              <text x="100" y="50" fill="#000000" fontSize="14" fontWeight="black" textAnchor="middle">35T HAULAGE</text>
            </g>

            {/* Multi-Gas Methanometer Telemetry Station (Left Drift Wall) */}
            <g transform="translate(140, 200)">
              <rect x="0" y="0" width="80" height="110" rx="6" fill="#1c1917" stroke="#0284c7" strokeWidth="3" />
              <rect x="10" y="12" width="60" height="28" fill="#0f172a" rx="2" />
              {/* LED Gas Readout */}
              <text x="40" y="26" fill="#22c55e" fontSize="10" fontWeight="bold" textAnchor="middle">CH₄: 0.35%</text>
              <text x="40" y="37" fill="#38bdf8" fontSize="8" textAnchor="middle">CO: 4 PPM</text>
              {/* Flashing Warning Beacon */}
              <circle cx="40" cy="65" r="10" fill="#0284c7" className="animate-pulse" />
              <text x="40" y="95" fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle">DGMS GAS SENSOR</text>
            </g>

            {/* Emergency Refuge Bay Chamber (Far Right) */}
            <g transform="translate(840, 160)">
              <rect x="0" y="0" width="90" height="140" fill="#064e3b" stroke="#10b981" strokeWidth="3" rx="6" />
              <rect x="10" y="15" width="70" height="22" fill="#10b981" rx="2" />
              <text x="45" y="30" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">REFUGE BAY</text>
              <text x="45" y="55" fill="#a7f3d0" fontSize="8" textAnchor="middle">O₂ BREATHING</text>
              <circle cx="45" cy="85" r="12" fill="#047857" stroke="#34d399" strokeWidth="2" />
              <text x="45" y="90" fill="#ffffff" fontSize="12" textAnchor="middle">➕</text>
            </g>

            {/* Statutory DGMS Bilingual Warning Barricade (Goaf Stop) */}
            <g transform="translate(420, 480)">
              <rect x="0" y="0" width="160" height="50" fill="#b91c1c" stroke="#fecaca" strokeWidth="2" rx="4" />
              <text x="80" y="22" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">खतरा / DANGER</text>
              <text x="80" y="40" fill="#fef08a" fontSize="9" textAnchor="middle">NO ENTRY - GOAF STOPPING</text>
              {/* Support Legs */}
              <line x1="20" y1="50" x2="20" y2="90" stroke="#7f1d1d" strokeWidth="4" />
              <line x1="140" y1="50" x2="140" y2="90" stroke="#7f1d1d" strokeWidth="4" />
            </g>

            {/* Mining Worker with DGMS Cap Lamp & Battery Belt */}
            <g transform="translate(290, 320)">
              {/* IS 2925 Type II Mining Helmet with Bright LED Cap Lamp Beam */}
              <path d="M-10,-24 Q0,-36 10,-24 Z" fill="#ffffff" />
              {/* Cap Lamp Headpiece */}
              <rect x="-4" y="-32" width="8" height="6" fill="#38bdf8" />
              {/* Light Beam Cone from Caplamp */}
              <polygon points="4,-29 160,-60 180,60" fill="#fef08a" opacity="0.25" />
              <circle cx="0" cy="-18" r="7" fill="#d97706" />
              {/* Fluorescent Orange DGMS Hi-Vis Vest */}
              <rect x="-10" y="-10" width="20" height="28" fill="#ea580c" rx="2" />
              <line x1="-10" y1="4" x2="10" y2="4" stroke="#facc15" strokeWidth="3" />
              {/* Heavy Boots */}
              <line x1="-5" y1="18" x2="-5" y2="42" stroke="#292524" strokeWidth="5" />
              <line x1="5" y1="18" x2="5" y2="42" stroke="#292524" strokeWidth="5" />
            </g>
          </g>
        )}

        {/* ====================================================== */}
        {/* 🚨 DYNAMIC ACTIVE INCIDENT FX RENDERER                 */}
        {/* ====================================================== */}
        {activeEvent && (
          <g id="active-event-overlay">
            {/* Visual Location Marker Coordinates */}
            {(() => {
              const cx = (activeEvent.visualLocation.x / 100) * 1000;
              const cy = (activeEvent.visualLocation.y / 100) * 600;

              return (
                <g transform={`translate(${cx}, ${cy})`}>
                  {/* Fire Event Effects */}
                  {activeEvent.hazardType === 'fire' && (
                    <g>
                      <circle cx="0" cy="0" r="90" fill="url(#fireGlow)" className="animate-ping" />
                      <circle cx="0" cy="0" r="50" fill="url(#fireGlow)" />
                      {/* Smoke Particles */}
                      <circle cx="-20" cy="-40" r="25" fill="#475569" opacity="0.7" className="animate-pulse" />
                      <circle cx="15" cy="-60" r="35" fill="#334155" opacity="0.8" />
                      <circle cx="-5" cy="-90" r="45" fill="#1e293b" opacity="0.9" />
                      {/* Fire Icon Badge */}
                      <circle cx="0" cy="0" r="28" fill="#ef4444" stroke="#ffffff" strokeWidth="3" />
                      <text x="0" y="8" fill="#ffffff" fontSize="22" textAnchor="middle">🔥</text>
                    </g>
                  )}

                  {/* Electrical Arc Flash Effects */}
                  {activeEvent.hazardType === 'electrical' && (
                    <g>
                      <circle cx="0" cy="0" r="70" fill="url(#sparkGlow)" className="animate-ping" />
                      <line x1="-30" y1="-20" x2="30" y2="20" stroke="#38bdf8" strokeWidth="4" strokeDasharray="6 4" />
                      <line x1="25" y1="-25" x2="-25" y2="25" stroke="#ffffff" strokeWidth="3" />
                      <circle cx="0" cy="0" r="26" fill="#0284c7" stroke="#facc15" strokeWidth="3" />
                      <text x="0" y="8" fill="#ffffff" fontSize="20" textAnchor="middle">⚡</text>
                    </g>
                  )}

                  {/* Machinery Jam / Nip Point Effects */}
                  {activeEvent.hazardType === 'machinery' && (
                    <g>
                      <circle cx="0" cy="0" r="55" fill="#f59e0b" opacity="0.3" className="animate-ping" />
                      <circle cx="0" cy="0" r="28" fill="#d97706" stroke="#ffffff" strokeWidth="3" />
                      <text x="0" y="8" fill="#ffffff" fontSize="20" textAnchor="middle">⚙</text>
                    </g>
                  )}

                  {/* PPE or Restricted Violation */}
                  {(activeEvent.hazardType === 'ppe' || activeEvent.hazardType === 'restricted') && (
                    <g>
                      <circle cx="0" cy="0" r="60" fill="#f43f5e" opacity="0.3" className="animate-ping" />
                      <circle cx="0" cy="0" r="28" fill="#e11d48" stroke="#ffffff" strokeWidth="3" />
                      <text x="0" y="8" fill="#ffffff" fontSize="20" textAnchor="middle">🦺</text>
                    </g>
                  )}

                  {/* Mining Roof Failure Effect */}
                  {activeEvent.hazardType === 'roof' && (
                    <g>
                      <circle cx="0" cy="0" r="75" fill="#eab308" opacity="0.3" className="animate-ping" />
                      {/* Cracking Fractures */}
                      <path d="M-40,-30 L-10,-5 L20,-20 L45,10" stroke="#facc15" strokeWidth="4" fill="none" />
                      <circle cx="0" cy="0" r="28" fill="#854d0e" stroke="#facc15" strokeWidth="3" />
                      <text x="0" y="8" fill="#ffffff" fontSize="20" textAnchor="middle">⛏</text>
                    </g>
                  )}

                  {/* Methane Gas Spike Cloud */}
                  {activeEvent.hazardType === 'gas' && (
                    <g>
                      <circle cx="0" cy="0" r="85" fill="url(#gasCloud)" className="animate-pulse" />
                      <circle cx="0" cy="0" r="28" fill="#7c3aed" stroke="#ffffff" strokeWidth="3" />
                      <text x="0" y="8" fill="#ffffff" fontSize="20" textAnchor="middle">💨</text>
                    </g>
                  )}

                  {/* Incident Label Banner */}
                  <g transform="translate(0, 48)">
                    <rect x="-100" y="-12" width="200" height="24" rx="12" fill="#0f172a" stroke="#ef4444" strokeWidth="2" />
                    <text x="0" y="4" fill="#f87171" fontSize="10" fontWeight="bold" textAnchor="middle">
                      {isHindi ? '🚨 सक्रिय सुरक्षा घटना' : '🚨 ACTIVE SAFETY INCIDENT'}
                    </text>
                  </g>
                </g>
              );
            })()}
          </g>
        )}

        {/* ====================================================== */}
        {/* 🔍 INTERACTIVE WORKPLACE INSPECTION HOTSPOTS           */}
        {/* ====================================================== */}
        {environment.hotspots.map((spot) => {
          const cx = (spot.x / 100) * 1000;
          const cy = (spot.y / 100) * 600;
          const isSelected = selectedHotspot?.id === spot.id;

          return (
            <g
              key={spot.id}
              transform={`translate(${cx}, ${cy})`}
              className="cursor-pointer group"
              onClick={() => onSelectHotspot(isSelected ? null : spot)}
            >
              {/* Outer pulsing ring */}
              <circle
                cx="0"
                cy="0"
                r={isSelected ? 24 : 16}
                fill={
                  spot.status === 'hazard'
                    ? '#ef4444'
                    : spot.status === 'warning'
                    ? '#f59e0b'
                    : '#0284c7'
                }
                opacity={isSelected ? 0.4 : 0.2}
                className="group-hover:scale-125 transition-transform"
              />
              {/* Core Hotspot Pin */}
              <circle
                cx="0"
                cy="0"
                r="11"
                fill={
                  spot.status === 'hazard'
                    ? '#dc2626'
                    : spot.status === 'warning'
                    ? '#d97706'
                    : '#0369a1'
                }
                stroke="#ffffff"
                strokeWidth="2.5"
                className="transition-all duration-200 group-hover:scale-110"
              />
              <text x="0" y="4" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                i
              </text>

              {/* Tag Label below hotspot */}
              <g transform="translate(0, 22)">
                <rect
                  x="-55"
                  y="-8"
                  width="110"
                  height="16"
                  rx="4"
                  fill="#0f172ae6"
                  stroke="#475569"
                  strokeWidth="1"
                />
                <text x="0" y="4" fill="#e2e8f0" fontSize="8" fontWeight="medium" textAnchor="middle">
                  {isHindi ? spot.nameHi.slice(0, 16) : spot.nameEn.slice(0, 16)}
                </text>
              </g>
            </g>
          );
        })}
      </svg>

      {/* 3. SELECTED HOTSPOT INSPECTION DETAIL POPUP */}
      {selectedHotspot && (
        <div className="absolute bottom-4 left-4 max-w-sm bg-slate-900/95 backdrop-blur-md border border-cyan-500/50 rounded-xl p-4 shadow-2xl text-slate-200 z-30 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-white">
                  {isHindi ? selectedHotspot.nameHi : selectedHotspot.nameEn}
                </h4>
                {selectedHotspot.ruleCode && (
                  <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                    {selectedHotspot.ruleCode}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => onSelectHotspot(null)}
              className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
            {isHindi ? selectedHotspot.inspectionInfoHi : selectedHotspot.inspectionInfoEn}
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {isHindi ? 'सुरक्षा निरीक्षण स्टेशन' : 'Verified Safety Hotspot'}
            </span>
            <span className="text-slate-500">SURAKSHAAR AR-IS</span>
          </div>
        </div>
      )}

      {/* 4. ENVIRONMENT INFO BADGE (TOP LEFT) */}
      <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-sm border border-slate-700/80 rounded-xl px-3 py-2 flex items-center gap-3 z-10">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
        <div>
          <div className="text-xs font-bold text-white flex items-center gap-1.5">
            {isMining ? <Pickaxe className="w-3.5 h-3.5 text-amber-400" /> : <HardHat className="w-3.5 h-3.5 text-blue-400" />}
            {isHindi ? environment.nameHi : environment.nameEn}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            {environment.regulatoryStandard}
          </div>
        </div>
      </div>

      {/* 5. HOTSPOT INSPECTION HINT (BOTTOM RIGHT) */}
      <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-slate-400 flex items-center gap-1.5 z-10">
        <Info className="w-3.5 h-3.5 text-cyan-400" />
        <span>{isHindi ? 'निरीक्षण के लिए किसी भी (i) बिंदु पर क्लिक करें' : 'Click any (i) hotspot to inspect equipment & PPE'}</span>
      </div>
    </div>
  );
};
