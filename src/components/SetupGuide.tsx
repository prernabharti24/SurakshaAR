import React, { useState } from 'react';
import { SETUP_STEPS, ERROR_DIAGNOSTICS, FOLDER_STRUCTURE_TEXT, UNITY_VERSION_RECOMMENDATION } from '../data/unityData';
import {
  Smartphone,
  FolderTree,
  ListOrdered,
  AlertOctagon,
  Settings,
  Boxes,
  CheckCircle,
  HelpCircle,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';

export const SetupGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'step3_guide' | 'step2_guide' | 'a_engine' | 'b_android' | 'c_folders' | 'e_hierarchy' | 'f_prefab' | 'g_testing' | 'h_troubleshooting'>('step3_guide');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex flex-col gap-6 bg-slate-900 rounded-2xl border border-slate-800 p-4 md:p-6 shadow-xl">
      {/* Section Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4">
        <button
          onClick={() => setActiveTab('step3_guide')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'step3_guide'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/50'
              : 'bg-amber-950/40 text-amber-300 border border-amber-500/30 hover:bg-amber-900/40'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          ⭐ Step 3: Gemini AI Safety Setup
        </button>

        <button
          onClick={() => setActiveTab('step2_guide')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'step2_guide'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/50'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Boxes className="w-3.5 h-3.5" />
          Step 2: PPE &amp; Hazard Setup
        </button>

        <button
          onClick={() => setActiveTab('a_engine')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'a_engine'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/50'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          A. Engine &amp; Packages
        </button>

        <button
          onClick={() => setActiveTab('b_android')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'b_android'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/50'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          B. Android &amp; XR Settings
        </button>

        <button
          onClick={() => setActiveTab('c_folders')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'c_folders'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/50'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <FolderTree className="w-3.5 h-3.5" />
          C. Folder Structure
        </button>

        <button
          onClick={() => setActiveTab('e_hierarchy')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'e_hierarchy'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/50'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          E. Scene Hierarchy
        </button>

        <button
          onClick={() => setActiveTab('f_prefab')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'f_prefab'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/50'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Boxes className="w-3.5 h-3.5" />
          F. Industrial Prefab
        </button>

        <button
          onClick={() => setActiveTab('g_testing')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'g_testing'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/50'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          G. Phone Testing
        </button>

        <button
          onClick={() => setActiveTab('h_troubleshooting')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'h_troubleshooting'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/50'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <AlertOctagon className="w-3.5 h-3.5" />
          H. Troubleshooting
        </button>
      </div>

      {/* Tab Content: STEP 3 IMPLEMENTATION GUIDE */}
      {activeTab === 'step3_guide' && (
        <div className="space-y-6">
          <div className="bg-amber-950/30 border border-amber-500/40 p-5 rounded-xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-bold font-mono">
                STEP 3 ACTIVE SPRINT
              </span>
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono">
                Google Gemini Multimodal AI
              </span>
              <h3 className="text-lg font-bold text-white">
                Step 3: AI-Assisted Safety Analysis System
              </h3>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              Equips trainees with an AI-assisted safety advisor. When the trainee taps <strong>"Analyze Safety"</strong> on their AR HUD, the system captures the camera frame, downsamples it to 1024px JPEG, and dispatches it to Google Gemini AI. Gemini analyzes visible industrial violations (missing PPE, live electrical cabling, unguarded machinery pits), returns structured JSON with Risk Level and actionable recommendations, highlights matched 3D objects in the AR world, and prompts the trainee with vocational next steps.
            </p>
            <div className="bg-slate-950/80 border border-amber-500/30 p-3 rounded-lg flex items-start gap-2 text-[11px] text-amber-300">
              <AlertOctagon className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <span>
                <strong>Educational Assistant Notice:</strong> This feature is engineered strictly as an educational vocational training assistant for SIH26041. It does not replace statutory industrial safety audits or certified mine safety inspectors under the Directorate General of Mines Safety (DGMS).
              </span>
            </div>
          </div>

          {/* Section 1: Architecture & Security */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 font-mono text-amber-400">
              1. ARCHITECTURE &amp; API SECURITY SPECIFICATION
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold font-mono">PREFERRED PRODUCTION ARCHITECTURE</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">Secure</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded font-mono text-[11px] text-slate-300 border border-slate-800">
                  Unity AR Client → Secure Backend Proxy → Gemini API
                </div>
                <ul className="text-slate-300 text-[11px] space-y-1 list-disc list-inside">
                  <li>API keys are <strong>never</strong> bundled into the Android APK or exposed to decompiler tools.</li>
                  <li>Backend server authenticates trainee sessions, enforces rate-limiting, and logs vocational audits.</li>
                  <li>Configured in <code className="text-amber-300 font-mono">GeminiConfig.asset</code> via <code className="text-emerald-300 font-mono">useBackendProxy = true</code>.</li>
                  <li>Our applet includes the working Express proxy endpoint at <code className="text-cyan-300 font-mono">/api/gemini-safety-analysis</code>!</li>
                </ul>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-amber-400 font-bold font-mono">PROTOTYPE DEVELOPMENT MODE</span>
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px]">Dev Only</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded font-mono text-[11px] text-slate-300 border border-slate-800">
                  Unity Client → Direct Gemini REST API (v1beta)
                </div>
                <ul className="text-slate-300 text-[11px] space-y-1 list-disc list-inside">
                  <li>Allows rapid offline development in Unity Editor without deploying a backend.</li>
                  <li>Configured in <code className="text-amber-300 font-mono">GeminiConfig.asset</code> via <code className="text-amber-300 font-mono">useBackendProxy = false</code>.</li>
                  <li><strong className="text-red-400">Strict Warning:</strong> Add <code className="text-slate-200 font-mono">GeminiConfig.asset</code> to <code className="text-slate-200 font-mono">.gitignore</code>. Never commit raw API keys to GitHub or hackathon repositories.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 2: Unity Asset & Scene Setup */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 font-mono text-amber-400">
              2. UNITY SCENE WIRING &amp; COMPONENT HIERARCHY
            </h4>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
              <p className="text-slate-300">
                Extend your existing Step 1 &amp; 2 scene (<code className="text-amber-300 font-mono">01_AR_SafetyFoundation.unity</code>) without breaking existing foundations:
              </p>
              <div className="space-y-2 font-mono text-[11px]">
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <span className="text-amber-400 font-bold">A. Create Configuration Asset:</span>
                  <p className="text-slate-300 mt-1 font-sans text-xs">
                    In Project view: <span className="text-white font-semibold">Assets → Create → SIH26041 → Gemini Config</span>. Name it <code className="text-amber-300 font-mono">GeminiConfig.asset</code>.
                  </p>
                  <ul className="text-slate-400 font-sans text-[11px] mt-1 space-y-0.5 list-disc list-inside">
                    <li>Set <code className="text-slate-200 font-mono">Model Name</code> = <code className="text-amber-300 font-mono">gemini-2.5-flash</code></li>
                    <li>Set <code className="text-slate-200 font-mono">Max Image Dimension</code> = 1024 (downsamples image for instant mobile upload)</li>
                    <li>Set <code className="text-slate-200 font-mono">Timeout Seconds</code> = 30.0f</li>
                  </ul>
                </div>

                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <span className="text-amber-400 font-bold">B. Attach Services to XR Origin (or dedicated GameObject):</span>
                  <ul className="text-slate-400 font-sans text-[11px] mt-1 space-y-1 list-disc list-inside">
                    <li><strong className="text-slate-200 font-mono">ARScreenCaptureService.cs:</strong> Assign <code className="text-slate-300">Target Camera = AR Camera (Camera.main)</code>.</li>
                    <li><strong className="text-slate-200 font-mono">GeminiSafetyAnalysisService.cs:</strong> Assign <code className="text-slate-300">Config = GeminiConfig.asset</code>.</li>
                    <li><strong className="text-slate-200 font-mono">SafetyAnalysisManager.cs:</strong> Assign references to Capture Service, AI Service, and UI Controller.</li>
                  </ul>
                </div>

                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <span className="text-amber-400 font-bold">C. Canvas HUD Integration:</span>
                  <p className="text-slate-300 mt-1 font-sans text-xs">
                    Under <code className="text-amber-300 font-mono">Canvas_AR_HUD</code>, add <code className="text-cyan-300 font-mono">Panel_SafetyAnalysisUI</code> with:
                  </p>
                  <ul className="text-slate-400 font-sans text-[11px] mt-1 space-y-0.5 list-disc list-inside">
                    <li><strong className="text-slate-200">HUD Button:</strong> "Analyze Safety" with camera scan icon</li>
                    <li><strong className="text-slate-200">Loading Overlay:</strong> Animated circular spinner + Text: "Analyzing with Google Gemini AI..."</li>
                    <li><strong className="text-slate-200">Results Panel:</strong> Overall Risk badge (Red/Amber/Green), 2-sentence summary, scrollable hazard cards, and vocational training recommendation banner</li>
                    <li><strong className="text-slate-200">Error Modal:</strong> Friendly error message with active "Retry" button</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Android Network Permissions */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 font-mono text-amber-400">
              3. ANDROID MANIFEST &amp; PERMISSIONS
            </h4>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <p className="text-slate-300">
                Add network permissions in <code className="text-amber-300 font-mono">Assets/Plugins/Android/AndroidManifest.xml</code>:
              </p>
              <pre className="bg-slate-900 p-3 rounded-lg text-emerald-300 font-mono text-[11px] overflow-x-auto border border-slate-800">
{`<!-- Network access for Gemini API communication -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

<!-- Application tag for local development HTTP proxies (if testing against localhost or local IP) -->
<application
    android:usesCleartextTraffic="true"
    ... >
</application>`}
              </pre>
            </div>
          </div>

          {/* Section 4: 3D AR Object Matching & Visual Feedback */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 font-mono text-amber-400">
              4. 3D AR OBJECT MATCHING &amp; VISUAL HIGHLIGHTING
            </h4>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <p className="text-slate-300 leading-relaxed">
                When Gemini returns detected hazards in structured JSON, <code className="text-amber-300 font-mono">SafetyAnalysisManager</code> scans the active scene for corresponding Step 2 3D objects:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                  <span className="text-amber-400 font-bold">Missing Helmet / Vest</span>
                  <p className="text-slate-400 text-[11px]">
                    Matched to Worker head/torso colliders. Spawns pulsing yellow warning halo directly above worker avatar.
                  </p>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                  <span className="text-red-400 font-bold">Exposed 440V Cable</span>
                  <p className="text-slate-400 text-[11px]">
                    Matched to electrical cable collider. Spawns high-voltage hazard indicator above frayed conduit.
                  </p>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                  <span className="text-cyan-400 font-bold">General AI Observation</span>
                  <p className="text-slate-400 text-[11px]">
                    If hazard has no corresponding 3D collider, card is tagged as <code className="text-cyan-300">○ AI Observation</code> so trainees know it is contextual.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: STEP 2 IMPLEMENTATION GUIDE */}
      {activeTab === 'step2_guide' && (
        <div className="space-y-6">
          <div className="bg-amber-950/30 border border-amber-500/40 p-5 rounded-xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-bold font-mono">
                SIH26041 ACTIVE SPRINT
              </span>
              <h3 className="text-lg font-bold text-white">
                Step 2: PPE &amp; Industrial Hazard Identification Scenario
              </h3>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              This scenario extends the Step 1 tap-to-place foundation. When the trainee anchors the training station, the scenario populates an interactive industrial work area. Trainees inspect the worker and surroundings, tapping to identify missing PPE (IS 2925 hard hat, reflective vest) and critical mining hazards (frayed 440V live cable, missing machinery guardrails), while earning points and receiving DGMS-standard feedback.
            </p>
          </div>

          {/* Section 1: Data-Driven ScriptableObject Setup */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 font-mono text-amber-400">
              1. SCRIPTABLEOBJECT ASSET SETUP (Data-Driven Architecture)
            </h4>
            <p className="text-xs text-slate-400">
              Create data assets in <code className="text-amber-300 font-mono">Assets/_Project/ScriptableObjects/Hazards/</code> via <span className="text-white font-semibold">Right Click → Create → SIH26041 → Safety Hazard Data</span>:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-amber-400 font-bold font-mono block">HAZ_PPE_NO_HELMET.asset</span>
                <p className="text-slate-300 font-semibold">Missing Safety Helmet</p>
                <div className="text-[11px] text-slate-400 space-y-0.5">
                  <div><strong>Category:</strong> MissingPPE</div>
                  <div><strong>isHazard:</strong> true</div>
                  <div><strong>ScoreImpact:</strong> +10</div>
                  <div><strong>Standard:</strong> DGMS Circular / IS 2925</div>
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-amber-400 font-bold font-mono block">HAZ_PPE_NO_VEST.asset</span>
                <p className="text-slate-300 font-semibold">Missing High-Vis Vest</p>
                <div className="text-[11px] text-slate-400 space-y-0.5">
                  <div><strong>Category:</strong> MissingPPE</div>
                  <div><strong>isHazard:</strong> true</div>
                  <div><strong>ScoreImpact:</strong> +10</div>
                  <div><strong>Standard:</strong> IS 15809 Class 2 High-Vis</div>
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-amber-400 font-bold font-mono block">HAZ_ELEC_LIVE_CABLE.asset</span>
                <p className="text-slate-300 font-semibold">Live Exposed 440V Cable</p>
                <div className="text-[11px] text-slate-400 space-y-0.5">
                  <div><strong>Category:</strong> ElectricalHazard</div>
                  <div><strong>isHazard:</strong> true</div>
                  <div><strong>ScoreImpact:</strong> +10</div>
                  <div><strong>Standard:</strong> CEA Reg 2010 / LOTO Protocol</div>
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-amber-400 font-bold font-mono block">HAZ_MECH_UNSAFE_PIT.asset</span>
                <p className="text-slate-300 font-semibold">Broken Machinery Barrier</p>
                <div className="text-[11px] text-slate-400 space-y-0.5">
                  <div><strong>Category:</strong> MechanicalPinchPoint</div>
                  <div><strong>isHazard:</strong> true</div>
                  <div><strong>ScoreImpact:</strong> +10</div>
                  <div><strong>Standard:</strong> IS 9474 Machine Guarding</div>
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-cyan-400 font-bold font-mono block">SAFE_BOOTS_COMPLIANT.asset</span>
                <p className="text-slate-300 font-semibold">Steel-Toe Safety Shoes</p>
                <div className="text-[11px] text-slate-400 space-y-0.5">
                  <div><strong>Category:</strong> CompliantSafeObject</div>
                  <div><strong>isHazard:</strong> false</div>
                  <div><strong>ScoreImpact:</strong> -5 (False Alarm)</div>
                  <div><strong>Standard:</strong> IS 15298 Certified Footwear</div>
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-cyan-400 font-bold font-mono block">SAFE_WARNING_SIGN.asset</span>
                <p className="text-slate-300 font-semibold">Caution Warning Placard</p>
                <div className="text-[11px] text-slate-400 space-y-0.5">
                  <div><strong>Category:</strong> CompliantSafeObject</div>
                  <div><strong>isHazard:</strong> false</div>
                  <div><strong>ScoreImpact:</strong> -5 (False Alarm)</div>
                  <div><strong>Standard:</strong> IS 9457 Safety Signs</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Prefab Assembly & Hierarchy */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 font-mono text-amber-400">
              2. MODULAR PREFAB HIERARCHY &amp; COMPONENT ATTACHMENTS
            </h4>
            <div className="bg-[#0d1117] p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto">
              <pre>{`Scenario_PPE_Hazard_Prefab (Root)
│   Components: [SafetyScenarioManager], [TrainingScoreManager]
│
├── Station_Floor_Base (Box 1.6m x 0.04m x 1.6m with caution yellow border)
│
├── Worker_Avatar_Placeholder (Trainee character model)
│   ├── Body_Legs_Trousers (Navy cylinder)
│   ├── SafetyShoes_Boots [Collider, HazardObject] --> Data: SAFE_BOOTS_COMPLIANT
│   ├── Torso_Shirt [Collider, PPEObject] ----------> Data: HAZ_PPE_NO_VEST
│   │   └── HighVisVest_Mesh (Orange jacket, initially Active=False)
│   └── Head_Bare [Collider, PPEObject] -------------> Data: HAZ_PPE_NO_HELMET
│       └── HardHat_Mesh (Yellow helmet, initially Active=False)
│
├── Hazard_ExposedWire [Collider, HazardObject] ------> Data: HAZ_ELEC_LIVE_CABLE
│   ├── FrayedCable_Mesh (Red tube)
│   ├── Spark_Particles (ParticleSystem, live electrical arcs)
│   └── LOTO_Lockbox (Green padlock box, enabled when identified)
│
├── Hazard_UnsafeBarrier [Collider, HazardObject] ---> Data: HAZ_MECH_UNSAFE_PIT
│   ├── Machinery_Frame (Drive gears)
│   ├── Broken_Tape_Mesh (Drooping yellow barricade)
│   └── Fixed_Guardrail_Mesh (Green mesh fence, enabled when resolved)
│
└── Safe_WarningSignpost [Collider, HazardObject] ----> Data: SAFE_WARNING_SIGN
    ├── Metal_Post (Grey cylinder)
    └── Caution_Diamond (Yellow placard)`}</pre>
            </div>
          </div>

          {/* Section 3: LayerMask & Touch Raycasting */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 font-mono text-amber-400">
              3. LAYERMASK &amp; TOUCH RAYCASTING SETUP
            </h4>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-300">
              <p>
                To ensure responsive mobile touch detection without UI interference:
              </p>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
                <li>Go to <span className="text-white font-semibold">Edit → Project Settings → Tags and Layers</span>.</li>
                <li>Add User Layer 8: <code className="text-amber-300 font-mono">SafetyObjects</code>.</li>
                <li>Assign all interactive colliders (Worker Head, Torso, Wire, Barrier, Sign) to layer <code className="text-amber-300 font-mono">SafetyObjects</code>.</li>
                <li>Select the <span className="text-white font-semibold">XR Origin</span>, attach <code className="text-amber-300 font-mono">TrainingObjectInteraction.cs</code>, and set <code className="text-emerald-400 font-mono">interactionLayers = SafetyObjects</code>.</li>
              </ol>
            </div>
          </div>

          {/* Section 4: Testing & Verification */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 font-mono text-amber-400">
              4. STEP-BY-STEP TESTING IN UNITY &amp; ON ANDROID
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                <span className="text-amber-400 font-bold block font-mono">1. Placement &amp; Spawn</span>
                <p className="text-slate-300">
                  Aim camera at floor. Tap detected surface. Training station anchors and displays worker, wire, and barriers.
                </p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                <span className="text-amber-400 font-bold block font-mono">2. PPE Inspection</span>
                <p className="text-slate-300">
                  Tap bare head → Score increases +10, feedback card appears, worker equips yellow hard hat. Tap torso → +10, worker equips high-vis vest.
                </p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                <span className="text-amber-400 font-bold block font-mono">3. Industrial Hazards</span>
                <p className="text-slate-300">
                  Tap frayed wire → +10, spark effect ceases, LOTO padlock attaches. Tap open machinery → +10, guardrail locks into place.
                </p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                <span className="text-amber-400 font-bold block font-mono">4. False Positive &amp; Completion</span>
                <p className="text-slate-300">
                  Tap shoes or sign → Warning card "This is not a hazard", score deducts -5. When 4/4 hazards found, completion dialog displays with DGMS safety summary!
                </p>
              </div>
            </div>
          </div>

          {/* Section 5: Common Step 2 Errors & Fixes */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 font-mono text-amber-400">
              5. STEP 2 TROUBLESHOOTING &amp; ERROR HANDLING
            </h4>
            <div className="space-y-2 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-red-400 font-bold block">Issue: Tapping objects does nothing in AR</span>
                <p className="text-slate-300 mt-0.5">
                  <strong>Fix:</strong> Ensure the 3D meshes have a 3D Collider (<code className="text-amber-300">BoxCollider</code>, <code className="text-amber-300">CapsuleCollider</code>, or convex <code className="text-amber-300">MeshCollider</code>). Verify that <code className="text-amber-300">interactionLayers</code> on <code className="text-amber-300">TrainingObjectInteraction</code> matches the GameObject's layer.
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-red-400 font-bold block">Issue: Clicking UI buttons also clicks 3D objects behind them</span>
                <p className="text-slate-300 mt-0.5">
                  <strong>Fix:</strong> <code className="text-amber-300">TrainingObjectInteraction.cs</code> includes <code className="text-amber-300">IsPointerOverUI()</code> using <code className="text-amber-300">EventSystem.current.RaycastAll</code>. Ensure your Canvas has a <code className="text-amber-300">GraphicRaycaster</code> attached.
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-red-400 font-bold block">Issue: NullReferenceException on SafetyHazardData</span>
                <p className="text-slate-300 mt-0.5">
                  <strong>Fix:</strong> Open each prefab object in the Inspector and drag the corresponding <code className="text-amber-300">.asset</code> file from Project Browser into the <code className="text-amber-300">hazardData</code> field.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content A: Recommended Unity Version & Packages */}
      {activeTab === 'a_engine' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-amber-400" />
              A. Recommended Unity Engine Version &amp; Core Packages
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              Guarantees rock-solid stability on Android without breaking changes or missing AR Foundation symbols.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-2">
              <span className="text-xs uppercase font-mono tracking-wider text-amber-400 font-semibold">Primary Target</span>
              <h4 className="text-white font-bold text-base">{UNITY_VERSION_RECOMMENDATION.version}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Unity 2022.3 LTS is the industry standard for production Android ARCore apps. It has 100% verified compatibility with AR Foundation 5.1 and does not suffer from experimental rendering bugs.
              </p>
              <div className="pt-2 text-xs font-mono text-cyan-300">
                Template: <span className="text-white font-semibold">3D (Core)</span> or <span className="text-white font-semibold">3D (URP)</span>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-2">
              <span className="text-xs uppercase font-mono tracking-wider text-cyan-400 font-semibold">Unity Package Manager</span>
              <h4 className="text-white font-bold text-base">Required AR Packages</h4>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                <li><code className="text-amber-300 font-mono">AR Foundation</code> (v5.1.x) - High-level cross-platform AR API</li>
                <li><code className="text-amber-300 font-mono">Google ARCore XR Plugin</code> (v5.1.x) - Android ARCore engine bridge</li>
                <li><code className="text-slate-400 font-mono">TextMeshPro</code> - Already included in Unity for crisp mobile HUD text</li>
              </ul>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-xs text-amber-200 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300">Unity Hub Installation Check:</strong> Make sure you have checked the <span className="underline">Android Build Support</span> component (including Android SDK &amp; NDK Tools and OpenJDK) in your Unity Editor installation within Unity Hub.
            </div>
          </div>
        </div>
      )}

      {/* Tab Content B: Android & XR Settings */}
      {activeTab === 'b_android' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-amber-400" />
              B. Exact Unity Project &amp; Android Player Settings
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              Step-by-step configuration to prevent black screen crashes and ARCore initialization errors.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl">
              <h4 className="text-amber-400 font-bold text-sm mb-2">1. Switch Platform to Android</h4>
              <p className="text-slate-300">
                Go to <span className="text-white font-semibold">File -&gt; Build Settings</span>, select <span className="text-white font-semibold">Android</span> in the Platform list, and click <span className="text-amber-400 font-semibold">Switch Platform</span>. Wait for the compilation bar to finish.
              </p>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl">
              <h4 className="text-amber-400 font-bold text-sm mb-2">2. XR Plug-in Management Setup</h4>
              <p className="text-slate-300 mb-2">
                Go to <span className="text-white font-semibold">Edit -&gt; Project Settings -&gt; XR Plug-in Management</span>:
              </p>
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg font-mono text-cyan-300">
                Select the Android Tab (Robot Icon) -&gt; CHECK "Google ARCore"
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl">
              <h4 className="text-amber-400 font-bold text-sm mb-2">3. Player Settings &mdash; Other Settings</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                <div className="bg-slate-900 p-3 rounded-lg">
                  <span className="text-slate-400 block font-semibold mb-1">Graphics APIs:</span>
                  <p className="text-slate-300 leading-relaxed">
                    UNCHECK <span className="text-white">Auto Graphics API</span>. Use <span className="text-amber-300 font-mono">OpenGLES3</span> for maximum compatibility across Indian industrial worker Android devices.
                  </p>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg">
                  <span className="text-slate-400 block font-semibold mb-1">Minimum API Level:</span>
                  <p className="text-slate-300 leading-relaxed">
                    Set to <span className="text-amber-300 font-mono">Android 7.0 (API Level 24)</span> or <span className="text-amber-300 font-mono">Android 8.0 (API Level 26)</span>.
                  </p>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg">
                  <span className="text-slate-400 block font-semibold mb-1">Scripting Backend:</span>
                  <p className="text-slate-300 leading-relaxed">
                    Change from Mono to <span className="text-amber-300 font-mono">IL2CPP</span> (Required for 64-bit Google Play &amp; ARCore).
                  </p>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg">
                  <span className="text-slate-400 block font-semibold mb-1">Target Architectures:</span>
                  <p className="text-slate-300 leading-relaxed">
                    CHECK <span className="text-emerald-400 font-mono">ARM64</span>, UNCHECK <span className="text-red-400 font-mono">ARMv7</span>.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl">
              <h4 className="text-amber-400 font-bold text-sm mb-2">4. Camera Permission &amp; Package Name</h4>
              <p className="text-slate-300 mb-2">
                In <span className="text-white font-semibold">Player Settings -&gt; Other Settings</span>:
              </p>
              <p className="text-slate-400">
                Camera Usage Description:{' '}
                <span className="text-slate-200 italic font-mono bg-slate-900 px-2 py-1 rounded">
                  "AR vocational safety training requires camera access to scan industrial floor surfaces and anchor training stations."
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content C: Scalable Folder Structure */}
      {activeTab === 'c_folders' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-amber-400" />
              C. Scalable Project Folder Structure
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              Encapsulated under <code className="text-amber-300 font-mono">Assets/_Project/</code> so third-party plugins (Firebase, Gemini, XR packages) never clutter your core codebase.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed max-h-[460px]">
            <pre>{FOLDER_STRUCTURE_TEXT}</pre>
          </div>
        </div>
      )}

      {/* Tab Content E: Scene Hierarchy */}
      {activeTab === 'e_hierarchy' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              E. Exact Unity Scene Hierarchy
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              Setup inside <code className="text-amber-300 font-mono">01_AR_SafetyFoundation.unity</code>. Delete the default camera before adding AR components.
            </p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {/* AR Session */}
            <div className="bg-slate-950/90 border border-slate-800 p-3.5 rounded-xl">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <span>GameObject:</span> <span className="text-white">AR Session</span>
              </div>
              <div className="mt-2 text-slate-400 pl-4 border-l-2 border-amber-500/40 space-y-1">
                <div>&bull; Component: <span className="text-cyan-300">ARSession</span> (Manages ARCore session lifecycle &amp; tracking states)</div>
                <div>&bull; Component: <span className="text-cyan-300">ARInputManager</span> (Feeds Android touch events into XR)</div>
              </div>
            </div>

            {/* XR Origin */}
            <div className="bg-slate-950/90 border border-slate-800 p-3.5 rounded-xl">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <span>GameObject:</span> <span className="text-white">XR Origin</span>
              </div>
              <div className="mt-2 text-slate-400 pl-4 border-l-2 border-cyan-500/40 space-y-1">
                <div>&bull; Component: <span className="text-cyan-300">XROrigin</span> (Transforms AR tracking space to Unity world space)</div>
                <div>&bull; Component: <span className="text-cyan-300">ARRaycastManager</span> (Performs real-time raycasts on detected planes)</div>
                <div>&bull; Component: <span className="text-cyan-300">ARPlaneManager</span> (Set 'Detection Mode' to Horizontal)</div>
                <div>&bull; Component: <span className="text-amber-300 font-bold">ARPlacementManager.cs</span> (Wiring: Drag TrainingArea Prefab &amp; Reticle)</div>
                <div>&bull; Component: <span className="text-amber-300 font-bold">ARPlaneDetectionController.cs</span></div>

                <div className="mt-3 pl-4 border-l-2 border-slate-700">
                  <div className="text-white font-semibold">&or; Child: Camera Offset</div>
                  <div className="pl-4 border-l border-slate-800 mt-1">
                    <div className="text-white font-semibold">&or; Child: Main Camera (Tag: "MainCamera")</div>
                    <div className="text-slate-400 space-y-0.5 mt-1">
                      <div>- Component: <span className="text-cyan-300">Camera</span> (Clear Flags: Solid Color, Background: Black)</div>
                      <div>- Component: <span className="text-cyan-300">ARCameraManager</span></div>
                      <div>- Component: <span className="text-cyan-300">ARCameraBackground</span></div>
                      <div>- Component: <span className="text-cyan-300">TrackedPoseDriver</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PlacementIndicator */}
            <div className="bg-slate-950/90 border border-slate-800 p-3.5 rounded-xl">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <span>GameObject:</span> <span className="text-white">PlacementIndicator</span>
              </div>
              <div className="mt-2 text-slate-400 pl-4 border-l-2 border-yellow-500/40 space-y-1">
                <div>&bull; Component: <span className="text-amber-300 font-bold">ARPlacementIndicator.cs</span></div>
                <div className="pl-4 border-l border-slate-800 mt-1">
                  <div className="text-white font-semibold">&or; Child: VisualChild (Quad or Flattened Ring with Amber Material)</div>
                </div>
              </div>
            </div>

            {/* Canvas AR HUD */}
            <div className="bg-slate-950/90 border border-slate-800 p-3.5 rounded-xl">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <span>GameObject:</span> <span className="text-white">Canvas_AR_HUD</span>
              </div>
              <div className="mt-2 text-slate-400 pl-4 border-l-2 border-purple-500/40 space-y-1">
                <div>&bull; Component: <span className="text-cyan-300">Canvas</span> (Render Mode: Screen Space - Overlay)</div>
                <div>&bull; Component: <span className="text-cyan-300">CanvasScaler</span> (Scale With Screen Size, 1080x1920)</div>
                <div>&bull; Component: <span className="text-cyan-300">GraphicRaycaster</span></div>
                <div>&bull; Component: <span className="text-amber-300 font-bold">ARUIManager.cs</span></div>
                <div className="pl-4 border-l border-slate-800 mt-1 space-y-1 text-slate-400">
                  <div>&bull; Child Text: <span className="text-slate-200">InstructionBannerText</span> ("Scan floor...")</div>
                  <div>&bull; Child Text: <span className="text-slate-200">PlaneCountBadge</span> ("Surfaces: 0")</div>
                  <div>&bull; Child Button: <span className="text-slate-200">ResetButton</span> (Text: "Reset Placement")</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content F: Create Placeholder Prefab */}
      {activeTab === 'f_prefab' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Boxes className="w-5 h-5 text-amber-400" />
              F. Steps to Create the Industrial Training Area Prefab
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              Constructed at true 1:1 metric scale (1 unit = 1 meter) representing a mining safety zone.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="font-mono text-amber-400 font-bold">Step 1: Create Root Object</span>
              <p className="text-slate-300">
                In Hierarchy, right click -&gt; <span className="text-white">Create Empty</span>. Rename to <code className="text-amber-300 font-mono">IndustrialTrainingArea_Placeholder</code>. Ensure Position is <code className="text-cyan-300 font-mono">(0, 0, 0)</code> and Scale is <code className="text-cyan-300 font-mono">(1, 1, 1)</code>.
              </p>
              <p className="text-slate-400">
                Add Component: <code className="text-amber-300 font-mono">TrainingAreaAnchor.cs</code>.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="font-mono text-amber-400 font-bold">Step 2: Add Safety Boundary Base</span>
              <p className="text-slate-300">
                Right-click root -&gt; 3D Object -&gt; Cube. Rename to <code className="text-white font-mono">FloorBase_CautionPerimeter</code>.
              </p>
              <div className="bg-slate-900 p-2.5 rounded font-mono text-slate-300 space-y-1">
                <div>Position: (0, 0.02, 0)</div>
                <div>Scale: (1.5, 0.04, 1.5)</div>
                <div className="text-amber-300">Represents 1.5m x 1.5m restricted safety boundary around industrial equipment.</div>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="font-mono text-amber-400 font-bold">Step 3: Add Equipment Stand &amp; Hazard Sign Post</span>
              <p className="text-slate-300">
                Right-click root -&gt; 3D Object -&gt; Cube/Cylinder. Rename to <code className="text-white font-mono">MachineryPlaceholder_Pedestal</code> (Scale: 0.6, 0.7, 0.6).
              </p>
              <p className="text-slate-300">
                Right-click root -&gt; 3D Object -&gt; Cylinder. Rename to <code className="text-white font-mono">HazardWarning_Post</code> (Position: -0.55, 0.6, 0.55, Scale: 0.04, 1.2, 0.04). Add a rotated Quad for the yellow caution diamond.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="font-mono text-amber-400 font-bold">Step 4: Scenario Mount Point</span>
              <p className="text-slate-300">
                Right-click root -&gt; Create Empty. Rename to <code className="text-white font-mono">ScenarioMountPoint</code> (Position: 0, 0.8, 0).
              </p>
              <p className="text-slate-400">
                Drag this child into the <code className="text-amber-300 font-mono">scenarioMountPoint</code> field of TrainingAreaAnchor on the root.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="font-mono text-emerald-400 font-bold">Step 5: Save as Prefab</span>
              <p className="text-slate-300">
                Drag <code className="text-white font-mono">IndustrialTrainingArea_Placeholder</code> from Hierarchy into <code className="text-amber-300 font-mono">Assets/_Project/Prefabs/TrainingArea/</code>. Then delete it from the scene.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content G: Testing on Android */}
      {activeTab === 'g_testing' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-amber-400" />
              G. Step-by-Step Android Testing Guide
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              Deploying directly to your physical Android device with Google Play Services for AR.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <h4 className="text-white font-semibold mb-1">1. Verify ARCore Compatibility</h4>
              <p className="text-slate-400">
                Check that your phone is on the Google ARCore supported devices list. Ensure "Google Play Services for AR" is updated from the Play Store.
              </p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <h4 className="text-white font-semibold mb-1">2. Enable USB Debugging on Phone</h4>
              <p className="text-slate-400">
                Settings -&gt; About Phone -&gt; Tap "Build Number" 7 times. Go back to Developer Options -&gt; Toggle ON "USB Debugging".
              </p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <h4 className="text-white font-semibold mb-1">3. Connect &amp; Build in Unity</h4>
              <p className="text-slate-400 mb-2">
                Connect phone via USB. Accept the "Allow USB debugging" prompt on your phone screen. In Unity:
              </p>
              <div className="bg-slate-900 p-2.5 rounded font-mono text-amber-300">
                File -&gt; Build Settings -&gt; Select device in 'Run Device' -&gt; Click 'Build And Run'
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <h4 className="text-white font-semibold mb-1">4. Real-World Field Scan Verification</h4>
              <p className="text-slate-400">
                Launch app. Allow camera permission. Pan phone over a textured floor in slow circular movements. Once the reticle locks onto the detected floor surface, tap anywhere on the screen to anchor the vocational training station!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content H: Troubleshooting Matrix */}
      {activeTab === 'h_troubleshooting' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-amber-400" />
              H. Common ARCore Errors &amp; Immediate Fixes
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              Field-tested solutions for the most frequent issues encountered when initializing AR Foundation on Android.
            </p>
          </div>

          <div className="space-y-3">
            {ERROR_DIAGNOSTICS.map((err) => (
              <div key={err.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-400"></span>
                  <h4 className="text-red-300 font-bold text-sm">{err.errorTitle}</h4>
                </div>

                <div className="text-slate-400">
                  <span className="font-semibold text-slate-300">Symptom:</span> {err.symptom}
                </div>

                <div className="text-slate-400">
                  <span className="font-semibold text-slate-300">Root Cause:</span> {err.rootCause}
                </div>

                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-1">
                  <span className="text-emerald-400 font-semibold uppercase tracking-wider text-[10px] block">Solution:</span>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    {err.solutionSteps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </div>

                <div className="text-amber-400/90 text-[11px] italic">
                  💡 Pro-tip: {err.preventativeTip}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
