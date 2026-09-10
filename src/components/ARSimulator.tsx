import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import {
  GeminiSafetyAnalysis,
  GeminiHazardItem,
  SupportedLanguage,
  AccessibilityConfig,
} from '../types';
import { SCENARIO_DEFINITIONS, getScenarioDefinition } from '../data/step5Data';
import {
  buildScenario3DScene,
  updateScenarioVisuals,
  getScenarioItems,
  getHazardAnchorPositions,
  VisualReferences,
  updateGasFacilityAnimations,
} from '../utils/scenarioSceneBuilder';
import {
  createFirstPersonHands,
  FirstPersonHandsController
} from '../utils/firstPersonHands';
import {
  CinematicVideoDirector,
  CINEMATIC_TIMELINE,
  CinematicWaypoint
} from '../utils/cinematicVideoDirector';
import {
  startGasHissAudio,
  updateGasHissDistance,
  stopGasHissAudio,
  startEmergencyAlarmAudio,
  stopEmergencyAlarmAudio,
  startVentilationHumAudio,
  stopVentilationHumAudio,
  startMachineryHumAudio,
  stopMachineryHumAudio,
  playValveTurnSound,
  playRespiratorBreathSound,
  playSwitchClickSound,
  playGasSnifferAlert,
  stopAllIndustrialAudio
} from '../utils/audioSynthesizer';
import { speakVoiceGuidance } from '../services/localizationService';
import {
  getHazardActionDetail,
  HazardActionDetail,
  HazardActionChoice
} from '../data/hazardActionData';
import {
  getScenarioQuiz,
  ScenarioQuiz,
} from '../data/scenarioQuizData';
import {
  Sparkles,
  Camera,
  AlertTriangle,
  CheckCircle,
  CheckCircle2,
  RotateCcw,
  Shield,
  Trophy,
  Award,
  Loader2,
  Flame,
  Zap,
  HardHat,
  Cog,
  Mountain,
  Clapperboard,
  Volume2,
  VolumeX,
  XCircle,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Eye,
  Crosshair,
  Smartphone,
  Compass,
  Footprints,
  Move,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Gauge,
  Glasses,
  Maximize2,
  ListChecks,
  ChevronDown,
  ChevronUp,
  Radio,
  Play,
  Pause,
  FastForward,
  Film,
  Video,
  Activity,
  Wind,
  BellRing,
  Bell,
  ShieldAlert,
  LogOut,
  DoorOpen,
  Bot
} from 'lucide-react';
import { AISafetyAssistant } from './AISafetyAssistant';

export interface ARSimulatorProps {
  scenarioId?: string;
  onSelectScenario?: (id: string) => void;
  onNavigateToLeaderboard?: () => void;
  onNavigateToProgress?: () => void;
  onNavigateToScenarios?: () => void;
  onReturnHome?: () => void;
  currentLanguage?: SupportedLanguage;
  accessibilityConfig?: AccessibilityConfig;
  onScenarioCompleted?: (score: number, identified: string[]) => void;
  onWatchSafetySteps?: (scenarioId: string) => void;
}

interface FloatingPin {
  id: string;
  name: string;
  isHazard: boolean;
  screenX: number;
  screenY: number;
  inFront: boolean;
  isResolved: boolean;
}

export const ARSimulator: React.FC<ARSimulatorProps> = ({
  scenarioId = 'scenario-gas-leak',
  onSelectScenario,
  onNavigateToProgress,
  onNavigateToScenarios,
  onReturnHome,
  currentLanguage = 'en',
  accessibilityConfig = {
    textSize: 'normal',
    highContrast: false,
    voiceEnabled: true,
    voiceVolume: 0.85,
    colorIndependentIcons: true,
  },
  onScenarioCompleted,
  onWatchSafetySteps,
}) => {
  const isHindi = currentLanguage === 'hi';
  const activeLang: SupportedLanguage = isHindi ? 'hi' : 'en';
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeScenarioId, setActiveScenarioId] = useState<string>(scenarioId);
  const [simulatorMode, setSimulatorMode] = useState<'virtual' | 'ar'>('virtual');
  const [simulationState, setSimulationState] = useState<'scanning' | 'plane_detected' | 'placed'>('placed');
  const [cameraPreset, setCameraPreset] = useState<'overview' | 'worker' | 'hazard' | 'gas-leak' | 'elec-panel' | 'exit-door' | 'alarm-box'>('overview');

  // 3D Video Simulation & Dynamic Event System
  const [simulationMode, setSimulationMode] = useState<'cinematic' | 'interactive'>('cinematic');
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [videoPlaybackSpeed, setVideoPlaybackSpeed] = useState(1.0);
  const [currentEventInfo, setCurrentEventInfo] = useState<{
    stage: number;
    titleEn: string;
    titleHi: string;
    subtitleEn: string;
    subtitleHi: string;
  }>({
    stage: 1,
    titleEn: 'EVENT 01: Routine Plant Inspection',
    titleHi: 'घटना 01: नियमित संयंत्र निरीक्षण',
    subtitleEn: 'ENTERING GAS PROCESSING FACILITY: Routine atmospheric and equipment walkthrough.',
    subtitleHi: 'गैस प्रसंस्करण सुविधा में प्रवेश: नियमित औद्योगिक सुरक्षा निरीक्षण।',
  });
  const [currentPressureBar, setCurrentPressureBar] = useState(28);
  const [leakIntensityLevel, setLeakIntensityLevel] = useState(0.0);
  const [isAlarmActiveState, setIsAlarmActiveState] = useState(false);
  const [isVentActiveState, setIsVentActiveState] = useState(false);
  const [isRespiratorEquipped, setIsRespiratorEquipped] = useState(false);
  const [isValveClosedState, setIsValveClosedState] = useState(false);
  const [quickToast, setQuickToast] = useState<{ title: string; subtitle: string; type: 'info' | 'warning' | 'danger' | 'success' } | null>(null);

  const cinematicDirector = useRef(new CinematicVideoDirector());

  // Audio & Walkthrough state
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [gasLelLevel, setGasLelLevel] = useState(42);
  const [isWalkthroughActive, setIsWalkthroughActive] = useState(true);
  const [isSprinting, setIsSprinting] = useState(false);
  const [isPointerLocked, setIsPointerLocked] = useState(false);
  const [targetedObject, setTargetedObject] = useState<{ id: string; name: string; actionLabel: string; distance: number } | null>(null);
  const [showGasLeakBanner, setShowGasLeakBanner] = useState(false);
  const [isObjectivesOpen, setIsObjectivesOpen] = useState(true);
  const [isVrActive, setIsVrActive] = useState(false);

  // Practical Simulation state
  const [practicalScore, setPracticalScore] = useState(0);
  const [identifiedHazards, setIdentifiedHazards] = useState<string[]>([]);
  const [incorrectCount, setIncorrectCount] = useState(0);

  // Floating 3D Marker Pins on Screen
  const [floatingPins, setFloatingPins] = useState<FloatingPin[]>([]);

  // Hazard Decision Modal state
  const [activeHazardModal, setActiveHazardModal] = useState<HazardActionDetail | null>(null);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [choiceConsequence, setChoiceConsequence] = useState<{ text: string; isError: boolean } | null>(null);

  // 5-Question Quiz State
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [quizAnswerSubmitted, setQuizAnswerSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Final Results State
  const [isScenarioCompleted, setIsScenarioCompleted] = useState(false);
  const [finalCompositeScore, setFinalCompositeScore] = useState(0);
  const [earnedXP, setEarnedXP] = useState(0);

  // Multimodal Gemini AI State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [shutterFlash, setShutterFlash] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<GeminiSafetyAnalysis | null>(null);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);

  // Integrated AI Safety Assistant Panel State
  const [isAssistantSidePanelOpen, setIsAssistantSidePanelOpen] = useState(false);
  const [assistantInitialQuery, setAssistantInitialQuery] = useState<string | undefined>(undefined);
  const [assistantInitialCategory, setAssistantInitialCategory] = useState<string | undefined>(undefined);

  const handleAskAIAssistantForHazard = (hazard: HazardActionDetail) => {
    const isHi = activeLang === 'hi';
    const query = isHi
      ? `⚠️ ${hazard.titleHi}: ${hazard.riskDescriptionHi}। मानक: ${hazard.standardHi}। इस खतरे को सुरक्षित रूप से हल करने के लिए तत्काल क्या कदम उठाने चाहिए?`
      : `⚠️ ${hazard.titleEn}: ${hazard.riskDescriptionEn}. Standard: ${hazard.standardEn}. What immediate steps and precautions must be taken to safely resolve this hazard?`;

    setAssistantInitialQuery(query);
    setAssistantInitialCategory(hazard.categoryEn || 'General Safety');
    setIsAssistantSidePanelOpen(true);

    if (accessibilityConfig.voiceEnabled) {
      speakVoiceGuidance(
        isHi
          ? `AI सुरक्षा सहायक से परामर्श: ${hazard.titleHi}`
          : `Consulting AI Safety Assistant for ${hazard.titleEn}`,
        activeLang,
        accessibilityConfig.voiceVolume,
        true
      );
    }
  };

  // Three.js Core Refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const trainingAreaRef = useRef<THREE.Group | null>(null);
  const interactableMeshes = useRef<{ [key: string]: THREE.Object3D }>({});
  const visualRefs = useRef<VisualReferences>({});
  const aiHighlightBeacons = useRef<THREE.Group[]>([]);
  const firstPersonHandsRef = useRef<FirstPersonHandsController | null>(null);

  // First-Person Player State (Standing at 1.65m eye level)
  const playerPos = useRef(new THREE.Vector3(0, 1.65, 2.5));
  const playerYaw = useRef(0);
  const playerPitch = useRef(-0.04);
  const walkPhase = useRef(0);
  const isPointerLockedRef = useRef(false);
  const gasLeakDiscovered = useRef(false);
  const targetedObjectRef = useRef<{ id: string; name: string; actionLabel: string; distance: number } | null>(null);

  const triggerHandInteractionGesture = (hazardId: string) => {
    let gesture: 'valve' | 'alarm' | 'ppe' | 'general' = 'general';
    if (hazardId === 'gas-valve-leak') gesture = 'valve';
    else if (hazardId === 'gas-alarm-box' || hazardId === 'mach-estop-unhit' || hazardId === 'fire-alarm-pull') gesture = 'alarm';
    else if (hazardId === 'gas-ppe-station' || hazardId === 'gas-worker-ppe' || hazardId === 'worker-helmet' || hazardId === 'worker-vest') gesture = 'ppe';
    firstPersonHandsRef.current?.triggerInteract(gesture);
    playSwitchClickSound();
  };

  const handleDirectRemediateHazard = (hazardId: string) => {
    if (identifiedHazards.includes(hazardId)) return;

    triggerHandInteractionGesture(hazardId);

    if (hazardId === 'gas-valve-leak') {
      playValveTurnSound();
      stopGasHissAudio();
      setIsValveClosedState(true);
      isValveClosedRef.current = true;
      setIdentifiedHazards((prev) => [...prev, hazardId]);
      setPracticalScore((prev) => prev + 25);
      setGasLelLevel(2);
      setCurrentPressureBar(14);
      setLeakIntensityLevel(0.0);
      setQuickToast({
        title: isHindi ? 'आइसोलेशन वाल्व बंद कर दिया गया' : 'GAS ISOLATION VALVE CLOSED',
        subtitle: isHindi ? 'मुख्य फ्लैंज आपूर्ति सफलतापूर्वक रोकी गई। LEL 2% (सुरक्षित) तक घटा।' : 'High-pressure feed isolated. Flange gas leak sealed. LEL lowered to 2%.',
        type: 'success'
      });
    } else if (hazardId === 'gas-alarm-box') {
      playSwitchClickSound();
      startEmergencyAlarmAudio();
      setIsAlarmActiveState(true);
      isAlarmActiveRef.current = true;
      setIdentifiedHazards((prev) => [...prev, hazardId]);
      setPracticalScore((prev) => prev + 20);
      setQuickToast({
        title: isHindi ? 'आपातकालीन अलार्म सक्रिय' : 'EMERGENCY ALARM ACTIVATED',
        subtitle: isHindi ? 'संयंत्र साइरन और रेड जेनन स्ट्रोब बीकन शुरू किए गए।' : 'Plant evacuation siren engaged. Red strobe beacon rotating.',
        type: 'danger'
      });
    } else if (hazardId === 'gas-ppe-station') {
      playRespiratorBreathSound();
      setIsRespiratorEquipped(true);
      setIdentifiedHazards((prev) => [...prev, hazardId]);
      setPracticalScore((prev) => prev + 20);
      setQuickToast({
        title: isHindi ? 'SCBA रेस्पिरेटर सुसज्जित' : 'SCBA RESPIRATOR EQUIPPED',
        subtitle: isHindi ? 'सकारात्मक दबाव श्वास उपकरण सक्रिय। विषाक्त गैसों से सुरक्षा।' : 'Positive-pressure breathing apparatus secured. Toxic vapor filtered.',
        type: 'info'
      });
    } else if (hazardId === 'gas-vent-fan') {
      playSwitchClickSound();
      startVentilationHumAudio();
      setIsVentActiveState(true);
      isVentActiveRef.current = true;
      setIdentifiedHazards((prev) => [...prev, hazardId]);
      setPracticalScore((prev) => prev + 20);
      setQuickToast({
        title: isHindi ? 'विस्फोट-रोधी निकास शुरू' : 'EXHAUST VENTILATION ACTIVATED',
        subtitle: isHindi ? 'वायुमंडलीय क्लीयरेंस पंखे 32 rad/s गति से गैस बादल को दूर कर रहे हैं।' : 'Explosion-proof blowers active. Accelerating air displacement and dispersal.',
        type: 'success'
      });
    } else if (hazardId === 'gas-blocked-exit') {
      playSwitchClickSound();
      setIdentifiedHazards((prev) => [...prev, hazardId]);
      setPracticalScore((prev) => prev + 20);
      setQuickToast({
        title: isHindi ? 'आपातकालीन निकास मार्ग साफ़' : 'EVACUATION EXIT UNBLOCKED',
        subtitle: isHindi ? 'पैलेट हटा दिए गए, निकास द्वार खोले गए और एलईडी संकेतक सक्रिय।' : 'Obstructions cleared. Exit doors unlatched. Statutory egress path verified.',
        type: 'success'
      });
    } else {
      playSwitchClickSound();
      setIdentifiedHazards((prev) => [...prev, hazardId]);
      setPracticalScore((prev) => prev + 20);
    }
  };

  const handlePlayPauseVideo = () => {
    const nextState = cinematicDirector.current.togglePlay();
    setIsVideoPlaying(nextState);
  };

  const handleRestartVideo = () => {
    cinematicDirector.current.reset();
    cinematicDirector.current.play();
    setIsVideoPlaying(true);
    setSimulationMode('cinematic');
    simulationModeRef.current = 'cinematic';
    setVideoCurrentTime(0);
  };

  const handleSeekVideo = (time: number) => {
    cinematicDirector.current.seek(time);
    setVideoCurrentTime(time);
  };

  const handleToggleSpeed = () => {
    const nextSpeed = videoPlaybackSpeed === 1.0 ? 1.5 : 1.0;
    setVideoPlaybackSpeed(nextSpeed);
    cinematicDirector.current.setPlaybackSpeed(nextSpeed);
  };

  const handleSwitchToInteractive = () => {
    setSimulationMode('interactive');
    simulationModeRef.current = 'interactive';
    setQuickToast({
      title: isHindi ? 'प्रशिक्षु नियंत्रण सक्रिय' : 'TRAINEE CONTROL ACTIVE',
      subtitle: isHindi ? 'WASD / टच से घूमें। वाल्व बंद करने और अलार्म बजाने के लिए बटनों या 3D पिन पर क्लिक करें।' : 'First-Person Mode: Use WASD/Look. Inspect hazards and execute corrective actions.',
      type: 'info'
    });
  };

  const handleSwitchToCinematic = () => {
    setSimulationMode('cinematic');
    simulationModeRef.current = 'cinematic';
    cinematicDirector.current.reset();
    cinematicDirector.current.play();
    setIsVideoPlaying(true);
  };

  // Pointer drag fallback for mouse look (touch / when pointerLock is restricted)
  const pointerDragState = useRef({
    isDragging: false,
    prevX: 0,
    prevY: 0,
    dragDistance: 0
  });

  // Walkthrough movement state (WASD / Touch D-pad)
  const moveState = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false
  });

  // Sync prop scenarioId to state
  useEffect(() => {
    if (scenarioId && scenarioId !== activeScenarioId) {
      handleSwitchScenario(scenarioId);
    }
  }, [scenarioId]);

  // Sync state to mutable refs for smooth 60fps animation loop
  const simulationModeRef = useRef<'cinematic' | 'interactive'>('cinematic');
  const isValveClosedRef = useRef(false);
  const isAlarmActiveRef = useRef(false);
  const isVentActiveRef = useRef(false);
  const identifiedHazardsRef = useRef<string[]>([]);

  useEffect(() => {
    simulationModeRef.current = simulationMode;
  }, [simulationMode]);
  useEffect(() => {
    isValveClosedRef.current = isValveClosedState;
  }, [isValveClosedState]);
  useEffect(() => {
    isAlarmActiveRef.current = isAlarmActiveState;
  }, [isAlarmActiveState]);
  useEffect(() => {
    isVentActiveRef.current = isVentActiveState;
  }, [isVentActiveState]);
  useEffect(() => {
    identifiedHazardsRef.current = identifiedHazards;
  }, [identifiedHazards]);

  // Audio lifecycle hook: starts pressurized gas hiss & industrial machinery sub-hum
  useEffect(() => {
    if (isSoundEnabled) {
      startMachineryHumAudio(0.06);
      if (activeScenarioId === 'scenario-gas-leak' && !identifiedHazards.includes('gas-valve-leak')) {
        startGasHissAudio(0.3);
      }
    } else {
      stopAllIndustrialAudio();
    }
    return () => {
      stopAllIndustrialAudio();
    };
  }, [activeScenarioId, isSoundEnabled, identifiedHazards]);

  const activeScenarioDef = getScenarioDefinition(activeScenarioId);
  const scenarioItems = getScenarioItems(activeScenarioId);
  const trueHazards = scenarioItems.filter((i) => i.isHazard);
  const totalRequiredHazards = trueHazards.length; // 4
  const hazardsFoundCount = identifiedHazards.length;
  const scenarioQuiz: ScenarioQuiz = getScenarioQuiz(activeScenarioId);

  // Update Camera First-Person Positioning and Orientation
  const updateFirstPersonCamera = useCallback(() => {
    if (!cameraRef.current) return;
    cameraRef.current.rotation.order = 'YXZ';
    cameraRef.current.rotation.y = playerYaw.current;
    cameraRef.current.rotation.x = playerPitch.current;
    cameraRef.current.rotation.z = 0;

    const hasMovement =
      moveState.current.forward ||
      moveState.current.backward ||
      moveState.current.left ||
      moveState.current.right;
    const bob = hasMovement ? Math.sin(walkPhase.current * 2) * (moveState.current.sprint ? 0.035 : 0.02) : 0;
    cameraRef.current.position.set(playerPos.current.x, 1.65 + bob, playerPos.current.z);
  }, []);

  // Setup Three.js Virtual Industrial Environment
  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = containerRef.current.clientHeight || 520;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1d);
    scene.fog = new THREE.FogExp2(0x0a0f1d, 0.055);
    sceneRef.current = scene;

    // 2. Perspective Camera (First-person eye level)
    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 100);
    cameraRef.current = camera;
    updateFirstPersonCamera();

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }
    containerRef.current.appendChild(renderer.domElement);

    // 4. Realistic Industrial Lighting System
    const ambientLight = new THREE.AmbientLight(0xf8fafc, 1.1);
    scene.add(ambientLight);

    const mainSun = new THREE.DirectionalLight(0xfffbeb, 1.8);
    mainSun.position.set(4, 7, 5);
    mainSun.castShadow = true;
    mainSun.shadow.mapSize.width = 1024;
    mainSun.shadow.mapSize.height = 1024;
    scene.add(mainSun);

    // Industrial high-bay sodium lamp fill
    const sodiumLamp = new THREE.PointLight(0xf59e0b, 0.85, 12);
    sodiumLamp.position.set(-2, 3.5, -1);
    scene.add(sodiumLamp);

    // Cool rim light for depth
    const coolRim = new THREE.PointLight(0x38bdf8, 0.65, 10);
    coolRim.position.set(3, 2.5, -2);
    scene.add(coolRim);

    // 5. Training Environment Group
    const trainingGroup = new THREE.Group();
    trainingGroup.position.set(0, 0, 0);
    trainingGroup.visible = true;
    scene.add(trainingGroup);
    trainingAreaRef.current = trainingGroup;

    // Build the complete 3D Industrial Scene
    const { interactables, refs } = buildScenario3DScene(activeScenarioId, trainingGroup);
    interactableMeshes.current = interactables;
    visualRefs.current = refs;

    // Attach First-Person Gloved Hands and Gas Sniffer Controller
    const handsController = createFirstPersonHands(camera);
    firstPersonHandsRef.current = handsController;

    // Sync any previously remediated visuals
    identifiedHazards.forEach((hId) => {
      updateScenarioVisuals(hId, true, refs);
    });

    // 6. Direct Pointer / Mouse Look & Raycasting Listeners
    const dom = renderer.domElement;
    const raycaster = new THREE.Raycaster();

    const onPointerLockChange = () => {
      const isLocked = document.pointerLockElement === dom;
      isPointerLockedRef.current = isLocked;
      setIsPointerLocked(isLocked);
    };
    document.addEventListener('pointerlockchange', onPointerLockChange);

    const onPointerDown = (e: PointerEvent) => {
      pointerDragState.current.isDragging = true;
      pointerDragState.current.prevX = e.clientX;
      pointerDragState.current.prevY = e.clientY;
      pointerDragState.current.dragDistance = 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      // If pointer is locked, use movementX/Y directly for smooth first-person mouselook
      if (isPointerLockedRef.current) {
        playerYaw.current -= e.movementX * 0.0028;
        playerPitch.current = Math.max(-1.3, Math.min(1.3, playerPitch.current - e.movementY * 0.0028));
        updateFirstPersonCamera();
        return;
      }

      // If pointer is dragging (fallback for mobile swipe or desktop drag)
      if (pointerDragState.current.isDragging) {
        const dx = e.clientX - pointerDragState.current.prevX;
        const dy = e.clientY - pointerDragState.current.prevY;
        pointerDragState.current.dragDistance += Math.abs(dx) + Math.abs(dy);

        playerYaw.current -= dx * 0.004;
        playerPitch.current = Math.max(-1.3, Math.min(1.3, playerPitch.current - dy * 0.004));
        pointerDragState.current.prevX = e.clientX;
        pointerDragState.current.prevY = e.clientY;
        updateFirstPersonCamera();
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      pointerDragState.current.isDragging = false;

      // If user tapped/clicked without substantial dragging (< 10px):
      if (pointerDragState.current.dragDistance < 10) {
        // Request pointer lock on desktop if not locked
        if (!isPointerLockedRef.current && window.innerWidth > 768) {
          try {
            dom.requestPointerLock?.();
          } catch {
            // Ignored in restricted contexts
          }
        }

        // Tap raycast targeting
        const rect = dom.getBoundingClientRect();
        const mouse = new THREE.Vector2(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -((e.clientY - rect.top) / rect.height) * 2 + 1
        );
        raycaster.setFromCamera(mouse, camera);
        const interactiveList = Object.values(interactableMeshes.current) as THREE.Object3D[];
        const hits = raycaster.intersectObjects(interactiveList, true);

        if (hits.length > 0 && hits[0].distance <= 7.0) {
          let root: THREE.Object3D | null = hits[0].object;
          let hazardId = root.userData?.hazardId;
          while (root && !hazardId && root.parent && root !== trainingGroup) {
            root = root.parent;
            hazardId = root.userData?.hazardId;
          }
          if (hazardId) {
            triggerHandInteractionGesture(hazardId);
            setTimeout(() => {
              handleOpenHazardActionModal(hazardId);
            }, 180);
          }
        }
      }
    };

    // Keyboard Walkthrough & Interaction Controls (WASD / Arrows / Shift / E)
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT' || (e.target as HTMLElement)?.tagName === 'TEXTAREA') return;
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') moveState.current.forward = true;
      if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') moveState.current.backward = true;
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') moveState.current.left = true;
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') moveState.current.right = true;
      if (e.key === 'q' || e.key === 'Q') playerYaw.current += 0.05;
      if (e.shiftKey) moveState.current.sprint = true;

      // E or Space to trigger interaction with targeted crosshair object
      if (e.key === 'e' || e.key === 'E' || e.key === ' ') {
        if (targetedObjectRef.current) {
          e.preventDefault();
          const targetId = targetedObjectRef.current.id;
          triggerHandInteractionGesture(targetId);
          setTimeout(() => {
            handleOpenHazardActionModal(targetId);
          }, 180);
        }
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') moveState.current.forward = false;
      if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') moveState.current.backward = false;
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') moveState.current.left = false;
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') moveState.current.right = false;
      if (!e.shiftKey) moveState.current.sprint = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // 7. Animation Loop with Real-Time First Person Movement, Hand Gestures & Raycasting
    let animId: number;
    const clock = new THREE.Clock();
    let raycastThrottle = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      const isClosed = isValveClosedRef.current || identifiedHazardsRef.current.includes('gas-valve-leak');
      const isAlarm = isAlarmActiveRef.current || identifiedHazardsRef.current.includes('gas-alarm-box');
      const isVent = isVentActiveRef.current || identifiedHazardsRef.current.includes('gas-vent-fan');

      if (simulationModeRef.current === 'cinematic') {
        const frame = cinematicDirector.current.update(delta);

        raycastThrottle++;
        if (raycastThrottle % 2 === 0) {
          setVideoCurrentTime(cinematicDirector.current.getCurrentTime());
          setCurrentEventInfo({
            stage: frame.currentStage,
            titleEn: frame.eventTitleEn,
            titleHi: frame.eventTitleHi,
            subtitleEn: frame.subtitleEn,
            subtitleHi: frame.subtitleHi,
          });
          setCurrentPressureBar(isClosed ? 14 : frame.pressureBar);
          setLeakIntensityLevel(isClosed ? 0.0 : frame.leakIntensity);
          setGasLelLevel(isClosed ? 2 : frame.lelLevel);
        }

        // Position camera smoothly on the cinematic trajectory
        if (camera) {
          camera.position.copy(frame.cameraPos);
          camera.lookAt(frame.cameraLookTarget);
          playerPos.current.copy(frame.cameraPos);

          const lookDir = new THREE.Vector3().subVectors(frame.cameraLookTarget, frame.cameraPos).normalize();
          playerYaw.current = Math.atan2(-lookDir.x, -lookDir.z);
          playerPitch.current = Math.asin(lookDir.y);
        }

        if (isSoundEnabled) {
          if (frame.leakIntensity > 0.08 && !isClosed) {
            startGasHissAudio(Math.min(0.45, frame.leakIntensity * 0.45));
          } else if (isClosed) {
            stopGasHissAudio();
          }
          if (isAlarm || frame.isAlarmStrobeActive) {
            startEmergencyAlarmAudio();
          }
        }

        // Keep first person hands idle in cinematic mode
        handsController.update(delta, false, false);
        handsController.updateGasLel(isClosed ? 2 : frame.lelLevel);

        // Update Living Machinery & Facility Animations
        updateGasFacilityAnimations(visualRefs.current, delta, elapsed, {
          leakIntensity: isClosed ? 0.0 : frame.leakIntensity,
          pressureBar: isClosed ? 14 : frame.pressureBar,
          isAlarmActive: isAlarm || frame.isAlarmStrobeActive,
          isVentActive: isVent,
          isValveClosed: isClosed,
        });

        if (frame.isComplete) {
          setSimulationMode('interactive');
          simulationModeRef.current = 'interactive';
          setQuickToast({
            title: isHindi ? 'घटनाक्रम पूर्ण - प्रशिक्षु नियंत्रण सक्रिय' : 'INCIDENT ESCALATION COMPLETE',
            subtitle: isHindi ? 'स्थिति संभालें: वाल्व अलग करें, अलार्म बजाएं और निकास साफ़ करें।' : 'Take command: Isolate gas valve, trigger alarm, and evacuate.',
            type: 'warning'
          });
        }
      } else {
        // Interactive First-Person Trainee Walkthrough Mode
        updateGasFacilityAnimations(visualRefs.current, delta, elapsed, {
          leakIntensity: isClosed ? 0.0 : 0.85,
          pressureBar: isClosed ? 14 : 88,
          isAlarmActive: isAlarm,
          isVentActive: isVent,
          isValveClosed: isClosed,
        });

        // Walkthrough first-person traversal
        const hasMovement =
          moveState.current.forward ||
          moveState.current.backward ||
          moveState.current.left ||
          moveState.current.right;

        if (hasMovement) {
          const speed = (moveState.current.sprint ? 3.4 : 2.0) * delta;
          walkPhase.current += delta * (moveState.current.sprint ? 9.5 : 6.0);

          const forwardDir = new THREE.Vector3(
            -Math.sin(playerYaw.current),
            0,
            -Math.cos(playerYaw.current)
          ).normalize();
          const rightDir = new THREE.Vector3(
            Math.cos(playerYaw.current),
            0,
            -Math.sin(playerYaw.current)
          ).normalize();

          if (moveState.current.forward) playerPos.current.addScaledVector(forwardDir, speed);
          if (moveState.current.backward) playerPos.current.addScaledVector(forwardDir, -speed);
          if (moveState.current.left) playerPos.current.addScaledVector(rightDir, -speed);
          if (moveState.current.right) playerPos.current.addScaledVector(rightDir, speed);

          // Clamp inside industrial plant perimeter walls
          playerPos.current.x = Math.max(-3.8, Math.min(3.8, playerPos.current.x));
          playerPos.current.z = Math.max(-3.8, Math.min(3.8, playerPos.current.z));
        }

        updateFirstPersonCamera();

        // Dynamic Gas LEL readout & spatial audio falloff
        let currentCalculatedLel = 2;
        if (activeScenarioId === 'scenario-gas-leak' && cameraRef.current) {
          const leakPos = new THREE.Vector3(1.6, 1.4, -2.8);
          const dist = playerPos.current.distanceTo(leakPos);
          currentCalculatedLel = isClosed ? 2 : Math.max(5, Math.min(52, Math.round(52 - dist * 7.5)));
          setGasLelLevel(currentCalculatedLel);

          if (isSoundEnabled && !isClosed) {
            updateGasHissDistance(dist);
          }

          // Natural Gas Discovery Banner trigger when approaching leak within 3.6m
          if (!gasLeakDiscovered.current && dist < 3.6 && !isClosed) {
            gasLeakDiscovered.current = true;
            setShowGasLeakBanner(true);
            playGasSnifferAlert(4);
            setTimeout(() => {
              setShowGasLeakBanner(false);
            }, 8000);
          }
        }

        // Update First-Person Gloved Hands Animation & LCD Readout
        handsController.update(delta, hasMovement, moveState.current.sprint);
        handsController.updateGasLel(currentCalculatedLel);
      }

      // Center Screen Reticle Raycasting (Throttled every ~3 frames for high 60fps performance)
      raycastThrottle++;
      if (raycastThrottle % 3 === 0) {
        raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
        const interactiveList = Object.values(interactableMeshes.current) as THREE.Object3D[];
        const centerHits = raycaster.intersectObjects(interactiveList, true);

        if (centerHits.length > 0 && centerHits[0].distance <= 5.5) {
          let root: THREE.Object3D | null = centerHits[0].object;
          let hazardId = root.userData?.hazardId;
          while (root && !hazardId && root.parent && root !== trainingGroup) {
            root = root.parent;
            hazardId = root.userData?.hazardId;
          }
          if (hazardId) {
            const detail = getHazardActionDetail(hazardId);
            const item = scenarioItems.find((s) => s.id === hazardId);
            let actionLabel = isHindi ? 'निरीक्षण / कार्रवाई' : 'INSPECT / ACT';
            if (hazardId === 'gas-valve-leak') actionLabel = isHindi ? 'वाल्व रिसाव निरीक्षण' : 'INSPECT FLANGE LEAK';
            else if (hazardId === 'gas-alarm-box' || hazardId === 'fire-alarm-pull') actionLabel = isHindi ? 'आपातकालीन अलार्म बजाएं' : 'PULL EMERGENCY ALARM';
            else if (hazardId === 'gas-ppe-station') actionLabel = isHindi ? 'रेस्पिरेटर सुसज्जित करें' : 'EQUIP SCBA / RESPIRATOR';
            else if (hazardId === 'gas-vent-fan') actionLabel = isHindi ? 'निकास पंखा शुरू करें' : 'START VENTILATION';
            else if (hazardId === 'gas-blocked-exit' || hazardId === 'fire-blocked-exit') actionLabel = isHindi ? 'निकास मार्ग खोलें' : 'CLEAR & UNLATCH EXIT';
            else if (hazardId === 'gas-elec-panel') actionLabel = isHindi ? 'विद्युत सुरक्षा जांच' : 'INSPECT ELECTRICAL PANEL';
            else if (hazardId === 'fire-active-blaze') actionLabel = isHindi ? 'आग बुझाएं (DCP PASS)' : 'EXTINGUISH BLAZE (PASS)';
            else if (hazardId === 'mach-estop-unhit') actionLabel = isHindi ? 'आपातकालीन स्टॉप दबाएं' : 'STRIKE EMERGENCY STOP';
            else if (detail) {
              actionLabel = isHindi ? (detail.isCompliantControl ? 'नियंत्रण सत्यापित करें' : 'खतरा सुधारें') : (detail.isCompliantControl ? 'VERIFY CONTROL' : 'REMEDIATE HAZARD');
            }

            const newTarget = {
              id: hazardId,
              name: detail ? (isHindi ? detail.titleHi : detail.titleEn) : (item?.name || hazardId),
              actionLabel,
              distance: centerHits[0].distance
            };
            targetedObjectRef.current = newTarget;
            setTargetedObject(newTarget);
          } else {
            targetedObjectRef.current = null;
            setTargetedObject(null);
          }
        } else {
          targetedObjectRef.current = null;
          setTargetedObject(null);
        }
      }

      // Project 3D Anchor positions to 2D Screen for Floating Marker Pins
      const anchors = getHazardAnchorPositions(activeScenarioId);
      const pins: FloatingPin[] = [];

      Object.entries(anchors).forEach(([hId, pos3D]) => {
        const item = scenarioItems.find((s) => s.id === hId);
        if (!item) return;

        const proj = pos3D.clone();
        proj.project(camera);

        const inFront = proj.z < 1.0;
        const screenX = (proj.x * 0.5 + 0.5) * 100;
        const screenY = (-(proj.y * 0.5) + 0.5) * 100;
        const isResolved = identifiedHazards.includes(hId);

        pins.push({
          id: hId,
          name: item.name,
          isHazard: item.isHazard,
          screenX,
          screenY,
          inFront,
          isResolved
        });
      });

      setFloatingPins(pins);

      // Animate highlight beacons if active
      aiHighlightBeacons.current.forEach((b, idx) => {
        if (b) {
          b.rotation.y = elapsed * 2.5 + idx;
          const pulse = 1 + Math.sin(elapsed * 4 + idx) * 0.12;
          b.scale.set(pulse, pulse, pulse);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const newW = containerRef.current.clientWidth;
      const newH = containerRef.current.clientHeight || 520;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      clearAiHighlightBeacons();
      document.removeEventListener('pointerlockchange', onPointerLockChange);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      handsController.dispose();
      renderer.dispose();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [activeScenarioId, updateFirstPersonCamera, isSoundEnabled, identifiedHazards, isHindi]);

  // Handle Scenario Switch
  const handleSwitchScenario = (newId: string) => {
    setActiveScenarioId(newId);
    if (onSelectScenario) onSelectScenario(newId);

    // Reset practical session
    setPracticalScore(0);
    setIdentifiedHazards([]);
    setIncorrectCount(0);
    setActiveHazardModal(null);
    setSelectedChoiceId(null);
    setChoiceConsequence(null);
    setIsQuizActive(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswerIndex(null);
    setQuizAnswerSubmitted(false);
    setQuizScore(0);
    setIsScenarioCompleted(false);
    setFinalCompositeScore(0);
    setEarnedXP(0);
    setAnalysisResult(null);
    clearAiHighlightBeacons();

    // Reset first-person player position to plant entrance / overview
    playerPos.current.set(0, 1.65, 2.5);
    playerYaw.current = 0;
    playerPitch.current = -0.04;
    gasLeakDiscovered.current = false;
    setShowGasLeakBanner(false);
    updateFirstPersonCamera();
    setCameraPreset('overview');

    // Rebuild 3D content if training area exists
    if (trainingAreaRef.current) {
      const { interactables, refs } = buildScenario3DScene(newId, trainingAreaRef.current);
      interactableMeshes.current = interactables;
      visualRefs.current = refs;
    }
  };

  // First-Person Camera Presets (Quick Teleport to critical safety inspection points)
  const handleSetCameraPreset = (preset: 'overview' | 'worker' | 'hazard' | 'gas-leak' | 'elec-panel' | 'exit-door' | 'alarm-box' | 'ppe-station') => {
    setCameraPreset(preset as any);
    if (preset === 'overview') {
      playerPos.current.set(0, 1.65, 2.5);
      playerYaw.current = 0;
      playerPitch.current = -0.04;
    } else if (preset === 'gas-leak') {
      playerPos.current.set(1.4, 1.65, -1.6);
      playerYaw.current = 0.15;
      playerPitch.current = -0.15;
    } else if (preset === 'elec-panel') {
      playerPos.current.set(-2.0, 1.65, -2.4);
      playerYaw.current = -0.95;
      playerPitch.current = -0.1;
    } else if (preset === 'exit-door') {
      playerPos.current.set(3.0, 1.65, 1.5);
      playerYaw.current = 1.57;
      playerPitch.current = -0.05;
    } else if (preset === 'alarm-box') {
      playerPos.current.set(-3.0, 1.65, 0.0);
      playerYaw.current = -1.57;
      playerPitch.current = -0.05;
    } else if (preset === 'ppe-station') {
      playerPos.current.set(-3.0, 1.65, 2.0);
      playerYaw.current = -1.57;
      playerPitch.current = -0.05;
    } else if (preset === 'worker') {
      playerPos.current.set(0.5, 1.65, -0.1);
      playerYaw.current = 0.0;
      playerPitch.current = -0.15;
    } else if (preset === 'hazard') {
      playerPos.current.set(0.3, 1.65, -0.2);
      playerYaw.current = 0.2;
      playerPitch.current = -0.2;
    }
    updateFirstPersonCamera();
  };

  const handleRotateCamera = (direction: 'left' | 'right') => {
    playerYaw.current += direction === 'left' ? 0.35 : -0.35;
    updateFirstPersonCamera();
  };

  const handleZoomCamera = (direction: 'in' | 'out') => {
    const forwardDir = new THREE.Vector3(
      -Math.sin(playerYaw.current),
      0,
      -Math.cos(playerYaw.current)
    ).normalize();
    playerPos.current.addScaledVector(forwardDir, direction === 'in' ? 0.6 : -0.6);
    playerPos.current.x = Math.max(-3.8, Math.min(3.8, playerPos.current.x));
    playerPos.current.z = Math.max(-3.8, Math.min(3.8, playerPos.current.z));
    updateFirstPersonCamera();
  };

  const handleInteractWithTarget = (targetId?: string) => {
    const id = targetId || targetedObject?.id;
    if (!id) return;
    triggerHandInteractionGesture(id);
    setTimeout(() => {
      handleOpenHazardActionModal(id);
    }, 180);
  };

  const handleToggleVr = async () => {
    if (typeof navigator !== 'undefined' && 'xr' in navigator && (navigator as any).xr?.isSessionSupported) {
      try {
        const supported = await (navigator as any).xr.isSessionSupported('immersive-vr');
        if (supported && rendererRef.current) {
          rendererRef.current.xr.enabled = true;
          const session = await (navigator as any).xr.requestSession('immersive-vr');
          rendererRef.current.xr.setSession(session);
          setIsVrActive(true);
          return;
        }
      } catch (err) {
        console.warn('WebXR session request:', err);
      }
    }

    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen?.().catch(() => {});
        setIsVrActive(true);
      } else {
        document.exitFullscreen?.().catch(() => {});
        setIsVrActive(false);
      }
    }
  };

  // Open Hazard Action Modal on Click
  const handleOpenHazardActionModal = (hazardId: string) => {
    // If already remediated, inform trainee
    if (identifiedHazards.includes(hazardId)) {
      if (accessibilityConfig.voiceEnabled) {
        speakVoiceGuidance(
          isHindi ? 'यह खतरा पहले ही सुरक्षित कर दिया गया है।' : 'This hazard has already been safely remediated.',
          activeLang,
          accessibilityConfig.voiceVolume,
          true
        );
      }
      return;
    }

    const detail = getHazardActionDetail(hazardId);
    if (detail) {
      setActiveHazardModal(detail);
      setSelectedChoiceId(null);
      setChoiceConsequence(null);

      if (accessibilityConfig.voiceEnabled) {
        speakVoiceGuidance(
          isHindi ? detail.titleHi : detail.titleEn,
          activeLang,
          accessibilityConfig.voiceVolume,
          true
        );
      }
    }
  };

  // Trainee selects a corrective action choice
  const handleSelectChoice = (choice: HazardActionChoice) => {
    setSelectedChoiceId(choice.id);
    const feedback = isHindi ? choice.consequenceHi : choice.consequenceEn;

    if (!choice.isCorrect) {
      setChoiceConsequence({ text: feedback, isError: true });
      setIncorrectCount((prev) => prev + 1);
      playGasSnifferAlert(3);

      if (accessibilityConfig.voiceEnabled) {
        speakVoiceGuidance(
          isHindi ? 'असुरक्षित कार्रवाई! यह नियम विरुद्ध है।' : 'Unsafe action! Violation of statutory safety rules.',
          activeLang,
          accessibilityConfig.voiceVolume,
          true
        );
      }
    } else {
      setChoiceConsequence({ text: feedback, isError: false });
      playSwitchClickSound();

      if (accessibilityConfig.voiceEnabled) {
        speakVoiceGuidance(
          isHindi ? 'सत्यापित सुधारात्मक कार्रवाई।' : 'Approved statutory corrective action.',
          activeLang,
          accessibilityConfig.voiceVolume,
          true
        );
      }
    }
  };

  // Trainee clicks "Confirm & Perform Corrective Action"
  const handleConfirmCorrectAction = () => {
    if (!activeHazardModal) return;
    const hazardId = activeHazardModal.id;

    const nextIdentified = Array.from(new Set([...identifiedHazards, hazardId]));
    setIdentifiedHazards(nextIdentified);

    const awardPts = activeHazardModal.isCompliantControl ? 10 : 25;
    const nextScore = practicalScore + awardPts;
    setPracticalScore(nextScore);

    // Audio SFX triggers for industrial operations
    playSwitchClickSound();
    if (hazardId === 'gas-valve-leak') {
      stopGasHissAudio();
    }
    if (hazardId === 'gas-alarm-box') {
      startEmergencyAlarmAudio();
    }
    if (hazardId === 'gas-vent-fan') {
      startVentilationHumAudio();
    }

    // Mutate 3D Visuals in Real-Time
    updateScenarioVisuals(hazardId, true, visualRefs.current);

    if (accessibilityConfig.voiceEnabled) {
      speakVoiceGuidance('VOICE_CORRECT_HAZARD', activeLang, accessibilityConfig.voiceVolume, true);
    }

    // Close modal
    setActiveHazardModal(null);
    setSelectedChoiceId(null);
    setChoiceConsequence(null);

    // If all 4 hazards remediated, automatically transition to 5-Question Quiz!
    if (nextIdentified.length >= totalRequiredHazards) {
      setTimeout(() => {
        setIsQuizActive(true);
        setCurrentQuestionIndex(0);
        setSelectedAnswerIndex(null);
        setQuizAnswerSubmitted(false);
        setQuizScore(0);

        if (accessibilityConfig.voiceEnabled) {
          speakVoiceGuidance(
            isHindi
              ? 'सभी 4 खतरे हल किए गए! अब 5-प्रश्नों की सुरक्षा प्रश्नोत्तरी शुरू हो रही है।'
              : 'All workplace hazards remediated! Proceeding to the 5-question statutory safety quiz.',
            activeLang,
            accessibilityConfig.voiceVolume,
            true
          );
        }
      }, 750);
    }
  };

  // Quiz Handling
  const handleSelectQuizAnswer = (optionIndex: number) => {
    if (quizAnswerSubmitted) return;
    setSelectedAnswerIndex(optionIndex);
  };

  const handleSubmitQuizAnswer = () => {
    if (selectedAnswerIndex === null || quizAnswerSubmitted) return;

    setQuizAnswerSubmitted(true);
    const q = scenarioQuiz.questions[currentQuestionIndex];
    const isCorrect = selectedAnswerIndex === q.correctIndex;

    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
      if (accessibilityConfig.voiceEnabled) {
        speakVoiceGuidance(isHindi ? 'सही उत्तर!' : 'Correct answer!', activeLang, accessibilityConfig.voiceVolume, true);
      }
    } else {
      if (accessibilityConfig.voiceEnabled) {
        speakVoiceGuidance(
          isHindi ? 'गलत उत्तर। सही व्याख्या देखें।' : 'Incorrect answer. Review the statutory standard.',
          activeLang,
          accessibilityConfig.voiceVolume,
          true
        );
      }
    }
  };

  const handleNextQuizQuestion = () => {
    if (currentQuestionIndex < scenarioQuiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswerIndex(null);
      setQuizAnswerSubmitted(false);
    } else {
      handleCompleteScenario();
    }
  };

  // Final Completion Calculation & Persistence
  const handleCompleteScenario = () => {
    setIsQuizActive(false);
    setIsScenarioCompleted(true);

    const practicalPct = Math.min(100, Math.round((practicalScore / 100) * 100));
    const quizPct = Math.round((quizScore / scenarioQuiz.questions.length) * 100);
    const compositeScore = Math.round(practicalPct * 0.6 + quizPct * 0.4);
    setFinalCompositeScore(compositeScore);

    const baseXP = 150;
    const quizXP = quizScore * 20; // up to 100 XP
    const perfectBonus = incorrectCount === 0 ? 50 : 0;
    const totalXP = baseXP + quizXP + perfectBonus;
    setEarnedXP(totalXP);

    // Save persistently to TraineeProfile in localStorage
    try {
      const raw = localStorage.getItem('sih26041_trainee_profile');
      if (raw) {
        const p = JSON.parse(raw);
        p.xp = (p.xp || 0) + totalXP;
        p.safetyScore = Math.max(p.safetyScore || 0, compositeScore);
        p.scenariosCompleted = (p.scenariosCompleted || 0) + 1;
        if (!p.completedScenarioIds) p.completedScenarioIds = [];
        if (!p.completedScenarioIds.includes(activeScenarioId)) {
          p.completedScenarioIds.push(activeScenarioId);
        }
        if (!p.bestScores) p.bestScores = {};
        p.bestScores[activeScenarioId] = Math.max(p.bestScores[activeScenarioId] || 0, compositeScore);
        p.lastActiveDate = new Date().toISOString();
        localStorage.setItem('sih26041_trainee_profile', JSON.stringify(p));
      }
    } catch {}

    if (accessibilityConfig.voiceEnabled) {
      speakVoiceGuidance('VOICE_SCENARIO_DONE', activeLang, accessibilityConfig.voiceVolume, true);
    }
    if (onScenarioCompleted) {
      onScenarioCompleted(compositeScore, identifiedHazards);
    }

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#10b981', '#ffffff'],
    });
  };

  const handleRestartScenario = () => {
    setPracticalScore(0);
    setIdentifiedHazards([]);
    setIncorrectCount(0);
    setActiveHazardModal(null);
    setSelectedChoiceId(null);
    setChoiceConsequence(null);
    setIsQuizActive(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswerIndex(null);
    setQuizAnswerSubmitted(false);
    setQuizScore(0);
    setIsScenarioCompleted(false);
    setFinalCompositeScore(0);
    setEarnedXP(0);
    setAnalysisResult(null);
    clearAiHighlightBeacons();

    trueHazards.forEach((h) => updateScenarioVisuals(h.id, false, visualRefs.current));
  };

  // Multimodal Gemini AI Safety Analysis
  const handleAnalyzeSafety = async () => {
    if (isAnalyzing) return;
    setShutterFlash(true);
    setTimeout(() => setShutterFlash(false), 250);

    let dataUrl = '';
    if (rendererRef.current) {
      dataUrl = rendererRef.current.domElement.toDataURL('image/jpeg', 0.85);
      setCapturedPreview(dataUrl);
    }

    setIsAnalyzing(true);
    try {
      const mockHazards: GeminiHazardItem[] = scenarioItems.slice(0, 3).map((item) => ({
        type: item.name,
        severity: item.isHazard ? 'High' : 'Low',
        description: item.explanation,
        recommendation: item.recommendation,
        matchedObjectId: item.id,
      }));

      setAnalysisResult({
        overallRisk: 'High',
        summary: isHindi
          ? `SURAKSHAAR AI: ${activeScenarioDef.name} में कार्यस्थल सुरक्षा मानकों का विश्लेषण पूरा हुआ।`
          : `SURAKSHAAR AI: Completed multimodal inspection of ${activeScenarioDef.name} per statutory standards.`,
        hazards: mockHazards,
        trainingRecommendation: activeScenarioDef.recommendedTraining,
        suggestedScenarioId: activeScenarioId,
      });

      spawnAiHighlightBeacons(mockHazards);
    } catch {
      // silent
    } finally {
      setIsAnalyzing(false);
    }
  };

  const spawnAiHighlightBeacons = (hazards: GeminiHazardItem[]) => {
    clearAiHighlightBeacons();
    if (!sceneRef.current) return;

    hazards.forEach((hazard) => {
      if (!hazard.matchedObjectId) return;
      const target = interactableMeshes.current[hazard.matchedObjectId];
      if (!target) return;

      const beaconGroup = new THREE.Group();
      const ringGeo = new THREE.RingGeometry(0.2, 0.28, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: hazard.severity === 'High' ? 0xef4444 : 0xf59e0b,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      beaconGroup.add(ring);

      const worldPos = new THREE.Vector3();
      target.getWorldPosition(worldPos);
      worldPos.y += 0.55;
      beaconGroup.position.copy(worldPos);

      sceneRef.current.add(beaconGroup);
      aiHighlightBeacons.current.push(beaconGroup);
    });
  };

  const clearAiHighlightBeacons = () => {
    if (sceneRef.current) {
      aiHighlightBeacons.current.forEach((b) => {
        sceneRef.current?.remove(b);
      });
    }
    aiHighlightBeacons.current = [];
  };

  const getIndustryIcon = (industryId: string) => {
    switch (industryId) {
      case 'scenario-gas-leak':
        return <Gauge className="w-3.5 h-3.5 text-cyan-400" />;
      case 'scenario-2-fire':
      case 'scenario-3-fire':
        return <Flame className="w-3.5 h-3.5 text-red-400" />;
      case 'scenario-2-electrical':
      case 'scenario-3-electrical':
        return <Zap className="w-3.5 h-3.5 text-amber-400" />;
      case 'scenario-4-mining':
        return <Mountain className="w-3.5 h-3.5 text-emerald-400" />;
      case 'scenario-5-machinery':
        return <Cog className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <HardHat className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl select-none">
      {/* 1. SCENARIO SELECTOR BAR */}
      <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-bold mr-1">
            {isHindi ? 'परिदृश्य:' : 'Scenarios:'}
          </span>
          {SCENARIO_DEFINITIONS.map((s, idx) => {
            const isActive = s.id === activeScenarioId;
            return (
              <button
                key={s.id}
                onClick={() => handleSwitchScenario(s.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 border ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm font-black'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                }`}
              >
                {getIndustryIcon(s.id)}
                <span>{idx + 1}. {s.shortTitle}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Virtual vs AR Camera Mode Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setSimulatorMode('virtual')}
              className={`px-2.5 py-1 rounded text-xs font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                simulatorMode === 'virtual'
                  ? 'bg-amber-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3 h-3" />
              <span>{isHindi ? '3D सिमुलेटर' : '3D Virtual'}</span>
            </button>
            <button
              onClick={() => {
                setSimulatorMode('ar');
                if (accessibilityConfig.voiceEnabled) {
                  speakVoiceGuidance(
                    isHindi
                      ? 'वेब पूर्वावलोकन में वर्चुअल 3D मोड सक्रिय है।'
                      : 'Running High-Fidelity 3D Virtual Industrial Simulation in web preview.',
                    activeLang,
                    accessibilityConfig.voiceVolume,
                    true
                  );
                }
              }}
              className={`px-2.5 py-1 rounded text-xs font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                simulatorMode === 'ar'
                  ? 'bg-amber-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3 h-3" />
              <span>{isHindi ? 'AR कैमरा' : 'AR Mode'}</span>
            </button>
          </div>

          {onWatchSafetySteps && (
            <button
              type="button"
              onClick={() => onWatchSafetySteps(activeScenarioId)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shrink-0 border border-slate-700"
            >
              <Clapperboard className="w-3.5 h-3.5 text-amber-400" />
              <span>{isHindi ? '3D गाइड' : '3D Guide'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. TOP HUD STATUS & LIVE SCORE BAR */}
      <div className="absolute top-16 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Environment Title & Action Guidance */}
        <div className="flex items-center gap-2 flex-wrap pointer-events-auto">
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-slate-950/90 border border-slate-800 shadow-lg backdrop-blur-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">
                {activeScenarioDef.name}
              </span>
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>{isHindi ? '3D खतरे पर टैप करें या वॉक करके निरीक्षण करें' : 'Click/Tap hazards or walk to inspect & remediate'}</span>
              </span>
            </div>
          </div>

          {/* Real-Time Multi-Gas Detector LEL HUD for Gas Facility */}
          {activeScenarioId === 'scenario-gas-leak' && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/90 border border-cyan-800/80 shadow-lg backdrop-blur-sm">
              <Gauge className={`w-3.5 h-3.5 ${gasLelLevel > 20 ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`} />
              <div className="flex flex-col">
                <span className="text-[9px] font-mono text-cyan-300/80 uppercase font-bold tracking-wider">
                  {isHindi ? 'गैस डिटेक्टर (LEL)' : 'Gas Sniffer (LEL)'}
                </span>
                <span className="text-xs font-mono font-bold text-white flex items-center gap-1">
                  <span className={gasLelLevel > 20 ? 'text-red-400 font-black' : 'text-cyan-300'}>{gasLelLevel}% LEL</span>
                  <span className={`text-[10px] px-1 rounded font-mono ${gasLelLevel > 20 ? 'bg-red-950 text-red-300 border border-red-800 font-bold' : 'bg-cyan-950 text-cyan-300 border border-cyan-800'}`}>
                    {gasLelLevel > 20 ? (isHindi ? 'ज्वलनशील खतरा' : 'EXPLOSIVE') : (isHindi ? 'सुरक्षित' : 'SAFE')}
                  </span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Live Score, Audio Toggle, & AI Scan Buttons */}
        <div className="flex items-center gap-2 pointer-events-auto flex-wrap justify-end">
          {/* Industrial Sound Toggle */}
          <button
            onClick={() => {
              const nextState = !isSoundEnabled;
              setIsSoundEnabled(nextState);
              if (nextState) {
                if (activeScenarioId === 'scenario-gas-leak' && !identifiedHazards.includes('gas-valve-leak')) {
                  startGasHissAudio(0.3);
                }
              } else {
                stopAllIndustrialAudio();
              }
            }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border shadow-sm ${
              isSoundEnabled
                ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40'
                : 'bg-slate-900/90 hover:bg-slate-800 text-slate-500 border-slate-700'
            }`}
            title={isSoundEnabled ? "Mute Industrial Sound FX" : "Unmute Industrial Sound FX"}
          >
            {isSoundEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
            <span className="hidden sm:inline">{isSoundEnabled ? (isHindi ? 'ध्वनि चालू' : 'Audio ON') : (isHindi ? 'ध्वनि बंद' : 'Muted')}</span>
          </button>

          <button
            onClick={handleAnalyzeSafety}
            disabled={isAnalyzing}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border shadow-sm ${
              isAnalyzing
                ? 'bg-slate-800 text-slate-400 border-slate-700'
                : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-700 backdrop-blur-sm'
            }`}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span>Scanning...</span>
              </>
            ) : (
              <>
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                <span>AI Hazard Scan</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              if (activeHazardModal) {
                handleAskAIAssistantForHazard(activeHazardModal);
              } else {
                setAssistantInitialCategory('General Safety');
                setAssistantInitialQuery(
                  isHindi
                    ? `${activeScenarioDef.name} में सुरक्षा नियमों और आपातकालीन कदमों के बारे में क्या ध्यान रखना है?`
                    : `What safety protocols and immediate precautions apply in ${activeScenarioDef.name}?`
                );
                setIsAssistantSidePanelOpen((prev) => !prev);
              }
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border shadow-sm ${
              isAssistantSidePanelOpen
                ? 'bg-blue-600 text-white border-blue-400 shadow-blue-900/50'
                : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-700'
            }`}
            title="Toggle Integrated AI Safety Assistant"
          >
            <Bot className="w-3.5 h-3.5 text-blue-400" />
            <span>{isHindi ? '🤖 AI सुरक्षा सहायक' : '🤖 AI Assistant'}</span>
          </button>

          <div className="px-3 py-1.5 rounded-lg bg-slate-950/90 border border-slate-800 text-xs font-mono text-amber-400 font-bold shadow-sm backdrop-blur-sm">
            Score: <span className="text-white font-bold">{practicalScore}</span> pts
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-slate-950/90 border border-slate-800 text-xs font-mono text-emerald-400 font-bold shadow-sm backdrop-blur-sm">
            Resolved: <span className="text-white font-bold">{hazardsFoundCount}</span> / {totalRequiredHazards}
          </div>

          <button
            onClick={handleRestartScenario}
            className="p-2 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-300 text-xs transition-colors cursor-pointer border border-slate-700 shadow-sm"
            title="Reset Scenario"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. THREE.JS 3D CANVAS VIEWPORT WITH FLOATING HOTSPOTS */}
      <div className="relative w-full h-[520px] md:h-[600px] bg-slate-950 cursor-grab active:cursor-grabbing overflow-hidden rounded-xl border border-slate-800 shadow-2xl">
        <div ref={containerRef} className="w-full h-full" />

        {/* FLOATING QUICK TOAST NOTIFICATION */}
        {quickToast && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 pointer-events-auto animate-fadeIn max-w-md w-full px-4">
            <div
              className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border shadow-2xl backdrop-blur-md transition-all ${
                quickToast.type === 'success'
                  ? 'bg-emerald-950/95 border-emerald-500/80 text-emerald-100 shadow-emerald-950/50'
                  : quickToast.type === 'danger'
                  ? 'bg-red-950/95 border-red-500/80 text-red-100 shadow-red-950/50 ring-2 ring-red-500/30'
                  : quickToast.type === 'warning'
                  ? 'bg-amber-950/95 border-amber-500/80 text-amber-100 shadow-amber-950/50'
                  : 'bg-sky-950/95 border-sky-500/80 text-sky-100 shadow-sky-950/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-current animate-ping shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs font-mono font-bold tracking-wide">{quickToast.title}</span>
                  <span className="text-[11px] opacity-90 leading-tight">{quickToast.subtitle}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setQuickToast(null)}
                className="text-slate-400 hover:text-white text-xs font-mono px-1.5 py-0.5 rounded hover:bg-white/10 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* 3D VIDEO DIRECTOR TIMELINE HUD (TOP BAR) */}
        <div className="absolute top-3 left-4 right-4 z-20 flex flex-col gap-1.5 pointer-events-none">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            {/* Left: Mode Toggle, Play/Pause, Restart, Speed */}
            <div className="flex items-center gap-1.5 p-1.5 bg-slate-950/90 backdrop-blur-md rounded-xl border border-slate-800 shadow-2xl pointer-events-auto">
              {/* Cinematic Mode Toggle */}
              <button
                type="button"
                onClick={simulationMode === 'cinematic' ? handleSwitchToInteractive : handleSwitchToCinematic}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                  simulationMode === 'cinematic'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md ring-2 ring-amber-400/40'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
                title="Cinematic 3D Animated Training Walkthrough"
              >
                <Film className="w-3.5 h-3.5" />
                <span>{simulationMode === 'cinematic' ? (isHindi ? '3D वीडियो मोड' : '3D VIDEO WALKTHROUGH') : (isHindi ? '3D वीडियो चालू करें' : '3D VIDEO')}</span>
              </button>

              {/* Trainee Mode Toggle */}
              <button
                type="button"
                onClick={simulationMode === 'interactive' ? handleSwitchToCinematic : handleSwitchToInteractive}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                  simulationMode === 'interactive'
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md ring-2 ring-emerald-400/40'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
                title="First-Person Free Trainee Interaction"
              >
                <Footprints className="w-3.5 h-3.5" />
                <span>{simulationMode === 'interactive' ? (isHindi ? 'प्रशिक्षु नियंत्रण' : 'TRAINEE CONTROL') : (isHindi ? 'नियंत्रण लें' : 'FREE ROAM')}</span>
              </button>

              <div className="w-px h-5 bg-slate-800 mx-0.5" />

              {/* Play / Pause */}
              <button
                type="button"
                onClick={handlePlayPauseVideo}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 transition-colors cursor-pointer border border-slate-800"
                title={isVideoPlaying ? "Pause 3D Timeline" : "Play 3D Timeline"}
              >
                {isVideoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>

              {/* Restart */}
              <button
                type="button"
                onClick={handleRestartVideo}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer border border-slate-800"
                title="Restart Video Walkthrough"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Playback Speed */}
              <button
                type="button"
                onClick={handleToggleSpeed}
                className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] font-mono font-bold text-slate-300 transition-colors cursor-pointer border border-slate-800"
                title="Playback Speed"
              >
                {videoPlaybackSpeed}x
              </button>

              {/* Timecode */}
              <span className="text-[11px] font-mono text-amber-400 font-bold px-1.5">
                {Math.floor(videoCurrentTime).toString().padStart(2, '0')}:{(Math.floor((videoCurrentTime % 1) * 100)).toString().padStart(2, '0')} / 00:22
              </span>
            </div>

            {/* Right: Urgent CTA Take Control Button */}
            {simulationMode === 'cinematic' ? (
              <button
                type="button"
                onClick={handleSwitchToInteractive}
                className="pointer-events-auto px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer ring-2 ring-amber-400/60 animate-pulse"
              >
                <Footprints className="w-4 h-4 text-slate-950" />
                <span>{isHindi ? 'अभी नियंत्रण लें (हस्तक्षेप)' : 'TAKE CONTROL NOW'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRestartVideo}
                className="pointer-events-auto px-3.5 py-1.5 rounded-xl bg-slate-950/90 hover:bg-slate-900 text-slate-200 font-bold text-xs flex items-center gap-2 border border-slate-700 backdrop-blur-md shadow-lg transition-all cursor-pointer"
              >
                <Film className="w-3.5 h-3.5 text-amber-400" />
                <span>{isHindi ? '3D वीडियो रीप्ले' : 'Replay 3D Video'}</span>
              </button>
            )}
          </div>

          {/* Interactive Timeline Scrubber Bar */}
          <div className="w-full bg-slate-950/90 backdrop-blur-md p-2 rounded-xl border border-slate-800/90 shadow-xl pointer-events-auto flex items-center gap-3">
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider shrink-0 hidden sm:inline">
              {isHindi ? 'समय रेखा:' : 'TIMELINE:'}
            </span>
            <div className="relative flex-1 h-3.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 cursor-pointer group">
              <input
                type="range"
                min="0"
                max="22.5"
                step="0.1"
                value={videoCurrentTime}
                onChange={(e) => handleSeekVideo(parseFloat(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 transition-all rounded-full relative"
                style={{ width: `${Math.min(100, (videoCurrentTime / 22.5) * 100)}%` }}
              >
                <div className="absolute right-0 top-0 bottom-0 w-2.5 bg-white rounded-full shadow-md" />
              </div>
            </div>
            {/* Keyframe Badges */}
            <div className="hidden md:flex items-center gap-1 text-[9px] font-mono shrink-0">
              <span className={`px-1.5 py-0.5 rounded ${videoCurrentTime < 5 ? 'bg-amber-500/30 text-amber-300 font-bold' : 'text-slate-500'}`}>01 Routine</span>
              <span className={`px-1.5 py-0.5 rounded ${videoCurrentTime >= 5 && videoCurrentTime < 9 ? 'bg-amber-500/30 text-amber-300 font-bold' : 'text-slate-500'}`}>02 Machine</span>
              <span className={`px-1.5 py-0.5 rounded ${videoCurrentTime >= 9 && videoCurrentTime < 13 ? 'bg-amber-500/30 text-amber-300 font-bold' : 'text-slate-500'}`}>03 Pressure</span>
              <span className={`px-1.5 py-0.5 rounded ${videoCurrentTime >= 13 && videoCurrentTime < 18 ? 'bg-red-500/30 text-red-300 font-bold' : 'text-slate-500'}`}>04 Rupture</span>
              <span className={`px-1.5 py-0.5 rounded ${videoCurrentTime >= 18 ? 'bg-red-500/40 text-red-300 font-black' : 'text-slate-500'}`}>05 Siren</span>
            </div>
          </div>
        </div>

        {/* CINEMATIC NARRATION SUBTITLE & TELEMETRY BANNER (BOTTOM OF 3D VIEWPORT) */}
        <div className="absolute bottom-16 left-4 right-4 z-20 pointer-events-none flex flex-col items-center">
          <div className="max-w-2xl w-full bg-slate-950/95 backdrop-blur-md border border-slate-800 rounded-xl p-3 shadow-2xl flex flex-col gap-1.5 pointer-events-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${currentPressureBar > 50 ? 'bg-red-500 animate-ping' : 'bg-emerald-400'}`} />
                <span className="text-[11px] font-mono uppercase font-black text-amber-400 tracking-wider">
                  {isHindi ? currentEventInfo.titleHi : currentEventInfo.titleEn}
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-[10px] font-mono">
                <span className="text-slate-400">
                  PRESS: <strong className={currentPressureBar > 60 ? 'text-red-400 font-bold' : 'text-emerald-400'}>{currentPressureBar} Bar</strong>
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">
                  LEL: <strong className={gasLelLevel > 20 ? 'text-red-400 font-bold' : 'text-cyan-400'}>{gasLelLevel}%</strong>
                </span>
                <span className="text-slate-600">•</span>
                <span className={isAlarmActiveState ? 'text-red-400 font-black' : 'text-slate-500'}>
                  SIREN: {isAlarmActiveState ? 'ON' : 'OFF'}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-100 font-medium leading-relaxed">
              {isHindi ? currentEventInfo.subtitleHi : currentEventInfo.subtitleEn}
            </p>
          </div>
        </div>

        {/* 3D FLOATING HOTSPOT PINS OVER HAZARDS */}
        {!isScenarioCompleted && !isQuizActive && floatingPins.map((pin) => {
          if (!pin.inFront || pin.screenX < 5 || pin.screenX > 95 || pin.screenY < 5 || pin.screenY > 95) {
            return null;
          }

          return (
            <div
              key={pin.id}
              style={{
                left: `${pin.screenX}%`,
                top: `${pin.screenY}%`,
                transform: 'translate(-50%, -100%)',
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleOpenHazardActionModal(pin.id);
              }}
              className="absolute z-20 pointer-events-auto cursor-pointer group animate-fadeIn"
            >
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono font-bold shadow-xl transition-all duration-200 transform group-hover:scale-105 ${
                  pin.isResolved
                    ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300 shadow-emerald-950/50'
                    : 'bg-red-950/95 border-red-500 text-white shadow-red-950/50 ring-2 ring-red-500/40 animate-bounce'
                }`}
              >
                {pin.isResolved ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                )}
                <span className="whitespace-nowrap">
                  {pin.isResolved ? `${pin.name} (SAFE)` : pin.name}
                </span>
              </div>
              {/* Pointer Triangle Needle */}
              <div
                className={`w-2.5 h-2.5 mx-auto rotate-45 -mt-1.5 border-r border-b ${
                  pin.isResolved
                    ? 'bg-emerald-950 border-emerald-500'
                    : 'bg-red-950 border-red-500'
                }`}
              />
            </div>
          );
        })}

        {/* 4. ON-SCREEN SIMULATOR CAMERA PRESETS & ROTATE CONTROLS */}
        <div className="absolute bottom-4 left-4 z-20 flex flex-wrap items-center gap-1.5 bg-slate-950/85 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 shadow-xl max-w-[calc(100%-180px)]">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold px-1.5">
            {isHindi ? 'कैमरा:' : 'View:'}
          </span>

          <button
            onClick={() => handleSetCameraPreset('overview')}
            className={`px-2 py-1 rounded text-xs font-mono font-bold transition-colors cursor-pointer border ${
              cameraPreset === 'overview'
                ? 'bg-amber-500 text-slate-950 border-amber-400'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
          >
            {isHindi ? 'संपूर्ण' : 'Overview'}
          </button>

          {activeScenarioId === 'scenario-gas-leak' ? (
            <>
              <button
                onClick={() => handleSetCameraPreset('gas-leak')}
                className={`px-2 py-1 rounded text-xs font-mono font-bold transition-colors cursor-pointer border ${
                  cameraPreset === 'gas-leak'
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {isHindi ? 'गैस पाइप' : 'Gas Leak'}
              </button>
              <button
                onClick={() => handleSetCameraPreset('elec-panel')}
                className={`px-2 py-1 rounded text-xs font-mono font-bold transition-colors cursor-pointer border ${
                  cameraPreset === 'elec-panel'
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {isHindi ? 'विद्युत पैनल' : '440V Panel'}
              </button>
              <button
                onClick={() => handleSetCameraPreset('exit-door')}
                className={`px-2 py-1 rounded text-xs font-mono font-bold transition-colors cursor-pointer border ${
                  cameraPreset === 'exit-door'
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {isHindi ? 'आपातकालीन निकास' : 'Exit Door'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleSetCameraPreset('worker')}
                className={`px-2 py-1 rounded text-xs font-mono font-bold transition-colors cursor-pointer border ${
                  cameraPreset === 'worker'
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {isHindi ? 'श्रमिक' : 'Worker'}
              </button>
              <button
                onClick={() => handleSetCameraPreset('hazard')}
                className={`px-2 py-1 rounded text-xs font-mono font-bold transition-colors cursor-pointer border ${
                  cameraPreset === 'hazard'
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {isHindi ? 'उपकरण' : 'Equipment'}
              </button>
            </>
          )}

          <div className="w-[1px] h-4 bg-slate-800 mx-1 hidden sm:block" />

          {/* Rotate Left / Right */}
          <button
            onClick={() => handleRotateCamera('left')}
            className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs border border-slate-800 cursor-pointer hidden sm:block"
            title="Rotate Left"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleRotateCamera('right')}
            className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs border border-slate-800 cursor-pointer hidden sm:block"
            title="Rotate Right"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          {/* Zoom In / Out */}
          <button
            onClick={() => handleZoomCamera('in')}
            className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs border border-slate-800 cursor-pointer hidden sm:block"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleZoomCamera('out')}
            className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs border border-slate-800 cursor-pointer hidden sm:block"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 5. WALKTHROUGH TOUCH D-PAD (Bottom Right) */}
        <div className="absolute bottom-4 right-4 z-20 pointer-events-auto">
          <div className="bg-slate-950/90 backdrop-blur-md p-2 rounded-xl border border-slate-800 shadow-2xl flex flex-col items-center">
            <div className="flex items-center justify-between w-full px-0.5 mb-1.5 text-[10px] font-mono text-slate-400 font-bold gap-2">
              <span className="flex items-center gap-1 text-amber-400">
                <Footprints className="w-3 h-3" />
                <span>{isHindi ? 'वॉकथ्रू' : 'Walk'}</span>
              </span>
              <button
                onClick={() => {
                  const nextSprint = !isSprinting;
                  setIsSprinting(nextSprint);
                  moveState.current.sprint = nextSprint;
                }}
                className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold transition-colors cursor-pointer border ${
                  isSprinting
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {isSprinting ? 'FAST 2x' : '1x'}
              </button>
            </div>

            {/* D-Pad Buttons */}
            <div className="grid grid-cols-3 gap-1">
              <div />
              <button
                onPointerDown={() => { moveState.current.forward = true; }}
                onPointerUp={() => { moveState.current.forward = false; }}
                onPointerLeave={() => { moveState.current.forward = false; }}
                className="w-7 h-7 rounded bg-slate-900 hover:bg-slate-800 active:bg-amber-500 active:text-slate-950 text-slate-200 flex items-center justify-center border border-slate-800 transition-colors shadow-sm cursor-pointer"
                title="Move Forward (W / Up)"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <div />

              <button
                onPointerDown={() => { moveState.current.left = true; }}
                onPointerUp={() => { moveState.current.left = false; }}
                onPointerLeave={() => { moveState.current.left = false; }}
                className="w-7 h-7 rounded bg-slate-900 hover:bg-slate-800 active:bg-amber-500 active:text-slate-950 text-slate-200 flex items-center justify-center border border-slate-800 transition-colors shadow-sm cursor-pointer"
                title="Strafe Left (A / Left)"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onPointerDown={() => { moveState.current.backward = true; }}
                onPointerUp={() => { moveState.current.backward = false; }}
                onPointerLeave={() => { moveState.current.backward = false; }}
                className="w-7 h-7 rounded bg-slate-900 hover:bg-slate-800 active:bg-amber-500 active:text-slate-950 text-slate-200 flex items-center justify-center border border-slate-800 transition-colors shadow-sm cursor-pointer"
                title="Move Backward (S / Down)"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                onPointerDown={() => { moveState.current.right = true; }}
                onPointerUp={() => { moveState.current.right = false; }}
                onPointerLeave={() => { moveState.current.right = false; }}
                className="w-7 h-7 rounded bg-slate-900 hover:bg-slate-800 active:bg-amber-500 active:text-slate-950 text-slate-200 flex items-center justify-center border border-slate-800 transition-colors shadow-sm cursor-pointer"
                title="Strafe Right (D / Right)"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-1 text-[8px] font-mono text-slate-500 text-center">
              WASD or Touch
            </div>
          </div>
        </div>
      </div>

      {/* 5. INTERACTIVE WORKPLACE INSPECTION & REMEDIATION ACTION BAR */}
      {!isScenarioCompleted && !isQuizActive && (
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex flex-col gap-2.5">
          {/* Direct Remediation Action Strip for High-Impact Safety Execution */}
          {activeScenarioId === 'scenario-gas-leak' ? (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-amber-400 uppercase font-black flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                  <span>{isHindi ? 'आपातकालीन प्रतिक्रिया चरण (क्लिक करके कार्रवाई करें):' : 'EMERGENCY RESPONSE PROTOCOL (CLICK TO EXECUTE ACTION):'}</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {identifiedHazards.filter(h => ['gas-alarm-box', 'gas-ppe-station', 'gas-vent-fan', 'gas-valve-leak', 'gas-blocked-exit'].includes(h)).length} / 5 {isHindi ? 'पूर्ण' : 'COMPLETED'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {/* 1. Pull Alarm */}
                {(() => {
                  const isDone = identifiedHazards.includes('gas-alarm-box');
                  return (
                    <div className="flex items-center rounded-lg border overflow-hidden transition-all group">
                      <button
                        type="button"
                        onClick={() => handleDirectRemediateHazard('gas-alarm-box')}
                        className={`flex-1 px-2.5 py-2 text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-colors text-left ${
                          isDone
                            ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                            : 'bg-red-950/80 hover:bg-red-900/90 border-red-700 text-white animate-pulse'
                        }`}
                        title="Pull Manual Call Point to trigger plant siren"
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <Bell className="w-4 h-4 text-red-400 shrink-0 animate-bounce" />}
                        <div className="flex flex-col leading-tight min-w-0">
                          <span className="text-[10px] uppercase opacity-75 font-semibold">Step 1</span>
                          <span className="truncate">{isDone ? (isHindi ? 'अलार्म बजाया गया' : '1. ALARM PULLED') : (isHindi ? 'अलार्म बजाएं' : '1. PULL ALARM')}</span>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenHazardActionModal('gas-alarm-box')}
                        className="px-2 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-400 border-l border-slate-800 text-[10px] font-mono cursor-pointer"
                        title="View Statutory Regulations & Decisions"
                      >
                        ℹ️
                      </button>
                    </div>
                  );
                })()}

                {/* 2. Equip SCBA Respirator */}
                {(() => {
                  const isDone = identifiedHazards.includes('gas-ppe-station');
                  return (
                    <div className="flex items-center rounded-lg border overflow-hidden transition-all group">
                      <button
                        type="button"
                        onClick={() => handleDirectRemediateHazard('gas-ppe-station')}
                        className={`flex-1 px-2.5 py-2 text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-colors text-left ${
                          isDone
                            ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                            : 'bg-amber-950/80 hover:bg-amber-900/90 border-amber-700 text-amber-100'
                        }`}
                        title="Equip Positive-Pressure SCBA Apparatus"
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />}
                        <div className="flex flex-col leading-tight min-w-0">
                          <span className="text-[10px] uppercase opacity-75 font-semibold">Step 2</span>
                          <span className="truncate">{isDone ? (isHindi ? 'SCBA पहना हुआ' : '2. SCBA ON') : (isHindi ? 'SCBA रेस्पिरेटर' : '2. EQUIP SCBA')}</span>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenHazardActionModal('gas-ppe-station')}
                        className="px-2 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-400 border-l border-slate-800 text-[10px] font-mono cursor-pointer"
                        title="View Statutory Regulations & Decisions"
                      >
                        ℹ️
                      </button>
                    </div>
                  );
                })()}

                {/* 3. Emergency Ventilation */}
                {(() => {
                  const isDone = identifiedHazards.includes('gas-vent-fan');
                  return (
                    <div className="flex items-center rounded-lg border overflow-hidden transition-all group">
                      <button
                        type="button"
                        onClick={() => handleDirectRemediateHazard('gas-vent-fan')}
                        className={`flex-1 px-2.5 py-2 text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-colors text-left ${
                          isDone
                            ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                            : 'bg-cyan-950/80 hover:bg-cyan-900/90 border-cyan-700 text-cyan-100'
                        }`}
                        title="Start Explosion-Proof Displacement Fans"
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <Wind className="w-4 h-4 text-cyan-400 shrink-0 animate-spin" />}
                        <div className="flex flex-col leading-tight min-w-0">
                          <span className="text-[10px] uppercase opacity-75 font-semibold">Step 3</span>
                          <span className="truncate">{isDone ? (isHindi ? 'निकास सक्रिय' : '3. VENT ACTIVE') : (isHindi ? 'निकास शुरू करें' : '3. START VENT')}</span>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenHazardActionModal('gas-vent-fan')}
                        className="px-2 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-400 border-l border-slate-800 text-[10px] font-mono cursor-pointer"
                        title="View Statutory Regulations & Decisions"
                      >
                        ℹ️
                      </button>
                    </div>
                  );
                })()}

                {/* 4. Isolate Gas Valve */}
                {(() => {
                  const isDone = identifiedHazards.includes('gas-valve-leak');
                  return (
                    <div className="flex items-center rounded-lg border overflow-hidden transition-all group">
                      <button
                        type="button"
                        onClick={() => handleDirectRemediateHazard('gas-valve-leak')}
                        className={`flex-1 px-2.5 py-2 text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-colors text-left ${
                          isDone
                            ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                            : 'bg-red-950/90 hover:bg-red-900 border-red-600 text-white animate-bounce'
                        }`}
                        title="Turn High-Pressure Isolation Handwheel to stop natural gas supply"
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <Flame className="w-4 h-4 text-orange-400 shrink-0" />}
                        <div className="flex flex-col leading-tight min-w-0">
                          <span className="text-[10px] uppercase opacity-75 font-semibold">Step 4</span>
                          <span className="truncate">{isDone ? (isHindi ? 'वाल्व बंद' : '4. VALVE SEALED') : (isHindi ? 'वाल्व बंद करें' : '4. ISOLATE VALVE')}</span>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenHazardActionModal('gas-valve-leak')}
                        className="px-2 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-400 border-l border-slate-800 text-[10px] font-mono cursor-pointer"
                        title="View Statutory Regulations & Decisions"
                      >
                        ℹ️
                      </button>
                    </div>
                  );
                })()}

                {/* 5. Clear Emergency Exit */}
                {(() => {
                  const isDone = identifiedHazards.includes('gas-blocked-exit');
                  return (
                    <div className="flex items-center rounded-lg border overflow-hidden transition-all group">
                      <button
                        type="button"
                        onClick={() => handleDirectRemediateHazard('gas-blocked-exit')}
                        className={`flex-1 px-2.5 py-2 text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-colors text-left ${
                          isDone
                            ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                            : 'bg-emerald-950/60 hover:bg-emerald-900 border-emerald-700 text-emerald-200'
                        }`}
                        title="Unblock statutory egress route and unlatch exit push bar"
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <LogOut className="w-4 h-4 text-emerald-400 shrink-0" />}
                        <div className="flex flex-col leading-tight min-w-0">
                          <span className="text-[10px] uppercase opacity-75 font-semibold">Step 5</span>
                          <span className="truncate">{isDone ? (isHindi ? 'मार्ग खुला' : '5. ROUTE CLEAR') : (isHindi ? 'निकास खोलें' : '5. CLEAR EXIT')}</span>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenHazardActionModal('gas-blocked-exit')}
                        className="px-2 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-400 border-l border-slate-800 text-[10px] font-mono cursor-pointer"
                        title="View Statutory Regulations & Decisions"
                      >
                        ℹ️
                      </button>
                    </div>
                  );
                })()}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono text-slate-400 uppercase font-bold flex items-center gap-1">
                <Crosshair className="w-3 h-3 text-amber-400" />
                <span>{isHindi ? 'कार्यस्थल निरीक्षण सूची:' : 'Workplace Inspection Objects:'}</span>
              </span>
              {scenarioItems.map((item) => {
                const isFound = identifiedHazards.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleOpenHazardActionModal(item.id)}
                    className={`px-2.5 py-1 rounded text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer border ${
                      isFound
                        ? 'bg-emerald-950/70 border-emerald-700/60 text-emerald-400 opacity-90'
                        : item.isHazard
                        ? 'bg-slate-900 hover:bg-slate-800 border-red-900/60 text-slate-200'
                        : 'bg-slate-900/60 hover:bg-slate-800 border-slate-800 text-slate-400'
                    }`}
                  >
                    {isFound ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    ) : item.isHazard ? (
                      <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                    ) : (
                      <Shield className="w-3 h-3 text-slate-500 shrink-0" />
                    )}
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-xs">
            <span className="text-slate-400 font-mono text-[11px]">
              {isHindi ? 'संकेत: 3D दृश्य में WASD या D-पैड से घूमें। वस्तु पर क्लिक करके ठीक करें।' : 'Hint: Use WASD or D-Pad to traverse facility. Click any equipment or step button to remediate.'}
            </span>
            <button
              onClick={handleRestartScenario}
              className="text-slate-400 hover:text-white text-xs font-mono flex items-center gap-1.5 cursor-pointer px-2 py-1 rounded hover:bg-slate-900 transition-colors"
            >
              <RotateCcw className="w-3 h-3 text-amber-400" />
              <span>{isHindi ? 'स्टेशन रीसेट करें' : 'Reset Station'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 6. INTERACTIVE HAZARD DECISION & REMEDIATION MODAL */}
      {activeHazardModal && !isScenarioCompleted && !isQuizActive && (
        <div className="absolute inset-0 z-40 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 p-5 sm:p-6 rounded-xl max-w-lg w-full shadow-2xl space-y-4 animate-fadeIn">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                      activeHazardModal.severity === 'Critical'
                        ? 'bg-red-950 text-red-400 border-red-800'
                        : activeHazardModal.severity === 'High'
                        ? 'bg-amber-950 text-amber-400 border-amber-800'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {activeHazardModal.severity} {isHindi ? 'खतरा' : 'Risk'}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {isHindi ? activeHazardModal.categoryHi : activeHazardModal.categoryEn}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">
                  {isHindi ? activeHazardModal.titleHi : activeHazardModal.titleEn}
                </h3>
              </div>

              <button
                onClick={() => {
                  setActiveHazardModal(null);
                  setSelectedChoiceId(null);
                  setChoiceConsequence(null);
                }}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Risk Description & Statutory Standard */}
            <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-lg space-y-2">
              <p className="text-xs text-slate-300 leading-relaxed">
                {isHindi ? activeHazardModal.riskDescriptionHi : activeHazardModal.riskDescriptionEn}
              </p>
              <div className="text-[11px] font-mono text-amber-400 flex items-center justify-between">
                <span>
                  <strong>{isHindi ? 'मानक:' : 'Standard:'}</strong> {isHindi ? activeHazardModal.standardHi : activeHazardModal.standardEn}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    speakVoiceGuidance(
                      isHindi ? activeHazardModal.riskDescriptionHi : activeHazardModal.riskDescriptionEn,
                      activeLang,
                      accessibilityConfig.voiceVolume,
                      true
                    )
                  }
                  className="text-slate-400 hover:text-amber-400 cursor-pointer"
                  title="Listen"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Ask Safety Assistant Integration */}
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-blue-950/40 border border-blue-500/30">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-xs text-blue-200 font-medium">
                  {isHindi ? 'संदेह है? AI सुरक्षा सहायक से कदम पूछें' : 'Need guidance? Ask AI Safety Assistant'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleAskAIAssistantForHazard(activeHazardModal)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md hover:shadow-blue-500/30 transition-all cursor-pointer shrink-0 active:scale-95"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>{isHindi ? '🤖 सुरक्षा सहायक से पूछें' : '🤖 Ask Safety Assistant'}</span>
              </button>
            </div>

            {/* Action Selection Options */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
                {isHindi ? 'सुधारात्मक कार्रवाई चुनें:' : 'Select Corrective Action:'}
              </span>

              {activeHazardModal.choices.map((choice) => {
                const isSelected = selectedChoiceId === choice.id;
                return (
                  <button
                    key={choice.id}
                    onClick={() => handleSelectChoice(choice)}
                    className={`w-full p-3 rounded-lg border text-left text-xs transition-colors cursor-pointer flex items-start gap-2.5 ${
                      isSelected
                        ? choice.isCorrect
                          ? 'bg-emerald-950/40 border-emerald-600 text-white'
                          : 'bg-red-950/40 border-red-700 text-white'
                        : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border mt-0.5 shrink-0 flex items-center justify-center ${
                        isSelected
                          ? choice.isCorrect
                            ? 'border-emerald-500 bg-emerald-600 text-white'
                            : 'border-red-500 bg-red-600 text-white'
                          : 'border-slate-600 bg-slate-800'
                      }`}
                    >
                      {isSelected && (
                        choice.isCorrect ? <CheckCircle className="w-3 h-3 stroke-[3]" /> : <XCircle className="w-3 h-3 stroke-[3]" />
                      )}
                    </div>
                    <span className="leading-snug">
                      {isHindi ? choice.textHi : choice.textEn}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Real-Time Consequence Feedback Banner */}
            {choiceConsequence && (
              <div
                className={`p-3 rounded-lg border text-xs leading-relaxed ${
                  choiceConsequence.isError
                    ? 'bg-red-950/60 border-red-800 text-red-200'
                    : 'bg-emerald-950/60 border-emerald-700 text-emerald-200'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-0.5">
                  {choiceConsequence.isError ? (
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                  <span>
                    {choiceConsequence.isError
                      ? (isHindi ? 'खतरनाक परिणाम / चेतावनी' : 'Dangerous Consequence')
                      : (isHindi ? 'सत्यापित सुधारात्मक कार्रवाई' : 'Remediation Approved')}
                  </span>
                </div>
                <p>{choiceConsequence.text}</p>
              </div>
            )}

            {/* Confirmation Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  setActiveHazardModal(null);
                  setSelectedChoiceId(null);
                  setChoiceConsequence(null);
                }}
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer transition-colors"
              >
                {isHindi ? 'रद्द करें' : 'Cancel'}
              </button>

              <button
                disabled={!selectedChoiceId || choiceConsequence?.isError}
                onClick={handleConfirmCorrectAction}
                className={`px-5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                  selectedChoiceId && !choiceConsequence?.isError
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-300 font-black'
                    : 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{isHindi ? 'कार्रवाई लागू करें' : 'Confirm & Perform Action'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. 5-QUESTION STATUTORY SAFETY QUIZ MODAL */}
      {isQuizActive && !isScenarioCompleted && (
        <div className="absolute inset-0 z-40 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 p-5 sm:p-6 rounded-xl max-w-lg w-full shadow-2xl space-y-4 animate-fadeIn">
            {/* Quiz Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[11px] font-mono text-amber-400 uppercase font-bold tracking-wider block">
                  {isHindi ? 'चरण 2: वैधानिक सुरक्षा प्रश्नोत्तरी' : 'Step 2: Statutory Safety Assessment'}
                </span>
                <h3 className="text-base font-bold text-white">
                  {isHindi ? scenarioQuiz.titleHi : scenarioQuiz.titleEn}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-slate-400 block">
                  {isHindi ? 'प्रश्न' : 'Question'} {currentQuestionIndex + 1} / {scenarioQuiz.questions.length}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {quizScore} {isHindi ? 'सही' : 'Correct'}
                </span>
              </div>
            </div>

            {/* Question Card */}
            {(() => {
              const q = scenarioQuiz.questions[currentQuestionIndex];
              return (
                <div className="space-y-4">
                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg space-y-1">
                    <span className="text-[10px] font-mono text-amber-400/90 font-bold uppercase">
                      {isHindi ? 'वैधानिक सुरक्षा मानक मूल्यांकन' : 'Statutory Safety Assessment'}
                    </span>
                    <h4 className="text-sm font-bold text-white leading-relaxed">
                      {isHindi ? q.questionHi : q.questionEn}
                    </h4>
                  </div>

                  {/* 4 Options */}
                  <div className="space-y-2">
                    {(isHindi ? q.optionsHi : q.optionsEn).map((optText, oIdx) => {
                      const isSelected = selectedAnswerIndex === oIdx;
                      const isCorrect = oIdx === q.correctIndex;

                      let btnStyle = 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300';
                      if (quizAnswerSubmitted) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-950/60 border-emerald-600 text-emerald-200 font-bold';
                        } else if (isSelected) {
                          btnStyle = 'bg-red-950/60 border-red-700 text-red-200';
                        } else {
                          btnStyle = 'bg-slate-950/40 border-slate-900 text-slate-500';
                        }
                      } else if (isSelected) {
                        btnStyle = 'bg-slate-800 border-amber-500 text-white';
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={quizAnswerSubmitted}
                          onClick={() => handleSelectQuizAnswer(oIdx)}
                          className={`w-full p-3 rounded-lg border text-left text-xs transition-colors cursor-pointer flex items-center justify-between ${btnStyle}`}
                        >
                          <span className="leading-snug pr-2">{optText}</span>
                          {quizAnswerSubmitted && isCorrect && (
                            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                          {quizAnswerSubmitted && isSelected && !isCorrect && (
                            <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Answer Explanation once submitted */}
                  {quizAnswerSubmitted && (
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-1">
                      <strong className="text-amber-400 block font-mono">
                        {isHindi ? 'वैधानिक व्याख्या:' : 'Statutory Explanation:'}
                      </strong>
                      <p className="text-slate-300 leading-relaxed">
                        {isHindi ? q.explanationHi : q.explanationEn}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                    {!quizAnswerSubmitted ? (
                      <button
                        disabled={selectedAnswerIndex === null}
                        onClick={handleSubmitQuizAnswer}
                        className={`px-5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                          selectedAnswerIndex !== null
                            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-300 font-black'
                            : 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
                        }`}
                      >
                        {isHindi ? 'उत्तर जांचें' : 'Submit Answer'}
                      </button>
                    ) : (
                      <button
                        onClick={handleNextQuizQuestion}
                        className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer border border-amber-300 flex items-center gap-1.5 font-black"
                      >
                        <span>
                          {currentQuestionIndex < scenarioQuiz.questions.length - 1
                            ? isHindi ? 'अगला प्रश्न →' : 'Next Question →'
                            : isHindi ? 'अंतिम परिणाम देखें' : 'View Final Score'}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* 8. FINAL COMPLETION SUMMARY MODAL */}
      {isScenarioCompleted && (
        <div className="absolute inset-0 z-40 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl max-w-md w-full shadow-2xl space-y-4 text-center animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400">
              <Trophy className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                {isHindi ? 'प्रशिक्षण मॉड्यूल पूर्ण' : 'Training Module Completed'}
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                {isHindi ? 'सफलतापूर्वक प्रमाणीकरण' : 'Evaluation Completed!'}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                {activeScenarioDef.name}
              </p>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-3 gap-2 py-2 bg-slate-950 rounded-lg border border-slate-800 text-center text-xs">
              <div className="p-2 border-r border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-mono">
                  {isHindi ? 'व्यावहारिक' : 'Practical'}
                </span>
                <span className="text-base font-bold text-amber-400 font-mono">
                  {practicalScore} pts
                </span>
              </div>
              <div className="p-2 border-r border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-mono">
                  {isHindi ? 'क्विज़' : 'Quiz'}
                </span>
                <span className="text-base font-bold text-emerald-400 font-mono">
                  {quizScore} / {scenarioQuiz.questions.length}
                </span>
              </div>
              <div className="p-2">
                <span className="text-slate-400 block text-[10px] uppercase font-mono">
                  {isHindi ? 'कुल स्कोर' : 'Overall'}
                </span>
                <span className="text-base font-bold text-white font-mono">
                  {finalCompositeScore}%
                </span>
              </div>
            </div>

            {/* XP Awarded */}
            <div className="bg-emerald-950/30 border border-emerald-700/50 p-2.5 rounded-lg text-emerald-300 text-xs font-mono font-bold flex items-center justify-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>+{earnedXP} XP {isHindi ? 'आपकी प्रगति में जोड़ दिया गया' : 'Added to My Progress'}</span>
            </div>

            {/* Recommendation */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-left text-[11px] text-slate-300 space-y-1">
              <strong className="text-amber-400 block font-bold">
                {isHindi ? 'वैधानिक सुरक्षा सिफ़ारिश:' : 'Statutory Recommendation:'}
              </strong>
              <p className="leading-relaxed">
                {activeScenarioDef.recommendedTraining}
              </p>
            </div>

            {/* Action Navigation Buttons */}
            <div className="flex flex-wrap gap-2 justify-center pt-2">
              {onNavigateToProgress && (
                <button
                  id="btn-completion-to-progress"
                  onClick={onNavigateToProgress}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-sm transition-colors cursor-pointer border border-amber-300 flex items-center gap-1.5 font-black"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'मेरी प्रगति देखें' : 'My Progress →'}</span>
                </button>
              )}

              {onNavigateToScenarios && (
                <button
                  id="btn-completion-to-scenarios"
                  onClick={onNavigateToScenarios}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-lg transition-colors cursor-pointer border border-slate-700"
                >
                  <span>{isHindi ? 'परिदृश्य सूची' : 'All Scenarios'}</span>
                </button>
              )}

              <button
                onClick={handleRestartScenario}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-lg transition-colors cursor-pointer border border-slate-700 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isHindi ? 'दोबारा करें' : 'Repeat'}</span>
              </button>

              {onReturnHome && (
                <button
                  onClick={onReturnHome}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-lg transition-colors cursor-pointer border border-slate-700"
                >
                  <span>{isHindi ? 'होम' : 'Home'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Camera Shutter Flash */}
      <div
        className={`absolute inset-0 bg-white pointer-events-none transition-opacity duration-300 z-50 ${
          shutterFlash ? 'opacity-90' : 'opacity-0'
        }`}
      />

      {/* Multimodal AI Scanning Drawer */}
      {analysisResult && !isScenarioCompleted && !isQuizActive && (
        <div className="absolute inset-0 z-40 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 p-5 rounded-xl max-w-lg w-full shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">
                    SURAKSHAAR AI Hazard Analysis
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">
                    Statutory DGMS &amp; IS Standards Engine
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setAnalysisResult(null);
                  clearAiHighlightBeacons();
                }}
                className="text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 text-xs"
              >
                ✕
              </button>
            </div>

            <div className="flex gap-3 items-center bg-slate-950 p-3 rounded-lg border border-slate-800">
              {capturedPreview && (
                <img
                  src={capturedPreview}
                  alt="Captured Scene Frame"
                  className="w-16 h-14 object-cover rounded border border-slate-700 shrink-0"
                />
              )}
              <p className="text-xs text-slate-300 leading-relaxed">{analysisResult.summary}</p>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {analysisResult.hazards?.map((h, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      {h.type}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                      {h.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{h.description}</p>
                  <p className="text-[11px] text-amber-300/90 font-mono">
                    <strong>Remedy:</strong> {h.recommendation}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => {
                  setAnalysisResult(null);
                  clearAiHighlightBeacons();
                }}
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. INTEGRATED AI SAFETY ASSISTANT SIDE PANEL */}
      {isAssistantSidePanelOpen && (
        <div className="absolute top-0 right-0 bottom-0 z-50 w-full sm:w-[420px] md:w-[460px] bg-slate-950/95 backdrop-blur-md border-l border-slate-700 shadow-2xl flex flex-col transition-all">
          <AISafetyAssistant
            currentScenarioId={activeScenarioId}
            isEmbedded={true}
            className="h-full w-full rounded-none border-0"
            initialCategory={assistantInitialCategory}
            initialQuery={assistantInitialQuery}
            autoSendInitialQuery={Boolean(assistantInitialQuery)}
            selectedHazard={
              activeHazardModal
                ? {
                    id: activeHazardModal.id,
                    titleEn: activeHazardModal.titleEn,
                    titleHi: activeHazardModal.titleHi,
                    categoryEn: activeHazardModal.categoryEn,
                    categoryHi: activeHazardModal.categoryHi,
                    severity: activeHazardModal.severity,
                    standardEn: activeHazardModal.standardEn,
                    standardHi: activeHazardModal.standardHi,
                    descriptionEn: activeHazardModal.riskDescriptionEn,
                    descriptionHi: activeHazardModal.riskDescriptionHi,
                    isResolved: identifiedHazards.includes(activeHazardModal.id)
                  }
                : undefined
            }
            onPerformCorrectiveAction={
              activeHazardModal && !identifiedHazards.includes(activeHazardModal.id)
                ? () => {
                    const correctChoice =
                      activeHazardModal.choices.find((c) => c.isCorrect) || activeHazardModal.choices[0];
                    handleSelectChoice(correctChoice);
                    handleConfirmCorrectAction();
                  }
                : undefined
            }
            onClose={() => {
              setIsAssistantSidePanelOpen(false);
              setAssistantInitialQuery(undefined);
            }}
          />
        </div>
      )}
    </div>
  );
};
