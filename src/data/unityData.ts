import { CSharpScript, SetupStep, ErrorTroubleshooting, ChecklistItem } from '../types';
import { STEP_2_SCRIPTS, HAZARD_SCENARIO_ITEMS, STEP_2_CHECKLIST } from './step2Data';
import { STEP_3_SCRIPTS, STEP_3_CHECKLIST, SAMPLE_GEMINI_ANALYSIS_UNSOLVED, SAMPLE_GEMINI_ANALYSIS_SOLVED } from './step3Data';
import { STEP_5_SCRIPTS, STEP_5_CHECKLIST, SCENARIO_DEFINITIONS, MOCK_TRAINEE_SESSIONS } from './step5Data';
import { STEP_6_SCRIPTS, STEP_6_CHECKLIST, ACHIEVEMENTS_LIST, INITIAL_LEADERBOARD, INITIAL_TRAINEE_PROFILE, SAFETY_LEVELS } from './step6Data';
import { STEP_7_SCRIPTS, STEP_7_CHECKLIST, LOCALIZATION_DICTIONARY, SAFETY_TERMINOLOGY_GLOSSARY, PRESENTATION_SLIDES, SAMPLE_DEMO_TRAINEES } from './step7Data';
import {
  STEP_8_SCRIPTS,
  STEP_8_CHECKLIST,
  APPLICATION_FLOW_STEPS,
  QA_TEST_CASES,
  SECURITY_AUDIT_ITEMS,
  PERFORMANCE_AUDIT_METRICS,
  ANDROID_BUILD_SETTINGS,
  RECOMMENDED_PROJECT_STRUCTURE
} from './step8Data';

export {
  HAZARD_SCENARIO_ITEMS,
  STEP_2_CHECKLIST,
  STEP_2_SCRIPTS,
  STEP_3_SCRIPTS,
  STEP_3_CHECKLIST,
  SAMPLE_GEMINI_ANALYSIS_UNSOLVED,
  SAMPLE_GEMINI_ANALYSIS_SOLVED,
  STEP_5_SCRIPTS,
  STEP_5_CHECKLIST,
  SCENARIO_DEFINITIONS,
  MOCK_TRAINEE_SESSIONS,
  STEP_6_SCRIPTS,
  STEP_6_CHECKLIST,
  ACHIEVEMENTS_LIST,
  INITIAL_LEADERBOARD,
  INITIAL_TRAINEE_PROFILE,
  SAFETY_LEVELS,
  STEP_7_SCRIPTS,
  STEP_7_CHECKLIST,
  LOCALIZATION_DICTIONARY,
  SAFETY_TERMINOLOGY_GLOSSARY,
  PRESENTATION_SLIDES,
  SAMPLE_DEMO_TRAINEES,
  STEP_8_SCRIPTS,
  STEP_8_CHECKLIST,
  APPLICATION_FLOW_STEPS,
  QA_TEST_CASES,
  SECURITY_AUDIT_ITEMS,
  PERFORMANCE_AUDIT_METRICS,
  ANDROID_BUILD_SETTINGS,
  RECOMMENDED_PROJECT_STRUCTURE
};

export const UNITY_VERSION_RECOMMENDATION = {
  version: "Unity 2022.3 LTS (Recommended: 2022.3.30f1 or newer LTS)",
  alternate: "Unity 6 (6000.0.x LTS) with AR Foundation 6.0 (if targeting latest 2024+ engine)",
  template: "3D (Core) or 3D (URP - Universal Render Pipeline)",
  androidMinSdk: "Android 7.0 'Nougat' (API Level 24) minimum; API Level 26 (Android 8.0) recommended for modern ARCore features.",
  androidTargetSdk: "API Level 34 (Android 14) or API Level 33 (Google Play requirement)",
  scriptingBackend: "IL2CPP",
  targetArchitecture: "ARM64 (uncheck ARMv7, ARCore requires 64-bit on modern Android)",
};

const STEP_1_SCRIPTS: CSharpScript[] = [
  {
    id: "placement-manager",
    step: 1,
    filename: "ARPlacementManager.cs",
    className: "ARPlacementManager",
    namespace: "SIH26041.AR.Core",
    summary: "Handles screen-center AR raycasting, UI touch blocking, tap input detection, and instantiation/repositioning of the industrial training area prefab on detected horizontal planes.",
    targetGameObject: "XR Origin (or AR Session Origin)",
    requiredComponents: ["ARRaycastManager", "ARPlaneManager"],
    inspectorFields: [
      { name: "trainingAreaPrefab", type: "GameObject", description: "The IndustrialTrainingArea_Placeholder prefab to spawn.", required: true },
      { name: "placementIndicator", type: "ARPlacementIndicator", description: "Reference to the visual reticle script.", required: true },
      { name: "planeController", type: "ARPlaneDetectionController", description: "Reference to plane detection controller to pause/hide planes after placement.", required: false },
      { name: "autoFaceCameraOnPlacement", type: "bool", description: "Whether the placed training area should rotate to face the user's camera on initial placement (defaults to true).", required: false },
      { name: "hidePlanesAfterPlacement", type: "bool", description: "Automatically hides AR plane meshes once placed to reduce visual clutter in industrial demo.", required: false }
    ],
    code: `using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.XR.ARFoundation;
using UnityEngine.XR.ARSubsystems;

namespace SIH26041.AR.Core
{
    /// <summary>
    /// Core placement controller for SIH26041 Industrial Safety AR Simulator.
    /// Detects user taps, validates screen touches (ignoring UI buttons),
    /// raycasts against AR horizontal planes, and anchors the industrial training area.
    /// </summary>
    [RequireComponent(typeof(ARRaycastManager))]
    [RequireComponent(typeof(ARPlaneManager))]
    public class ARPlacementManager : MonoBehaviour
    {
        [Header("Prefab & References")]
        [Tooltip("Prefab of the Industrial Training Area placeholder.")]
        [SerializeField] private GameObject trainingAreaPrefab;

        [Tooltip("Placement indicator reticle script.")]
        [SerializeField] private ARPlacementIndicator placementIndicator;

        [Tooltip("Optional reference to plane detection controller to hide planes post-placement.")]
        [SerializeField] private ARPlaneDetectionController planeController;

        [Header("Placement Options")]
        [Tooltip("If true, the spawned training area will rotate to face the AR camera.")]
        [SerializeField] private bool autoFaceCameraOnPlacement = true;

        [Tooltip("If true, disables visible plane meshes once an area is placed to keep AR view clean.")]
        [SerializeField] private bool hidePlanesAfterPlacement = true;

        // Cached components
        private ARRaycastManager _raycastManager;
        private Camera _arCamera;
        private GameObject _spawnedTrainingArea;
        private bool _isAreaPlaced = false;

        // Raycast hit cache
        private static readonly List<ARRaycastHit> Hits = new List<ARRaycastHit>();

        // Events for UI and state managers
        public event Action OnTrainingAreaPlaced;
        public event Action OnTrainingAreaReset;
        public event Action<bool> OnPlacementReadyChanged;

        public bool IsAreaPlaced => _isAreaPlaced;
        public GameObject SpawnedTrainingArea => _spawnedTrainingArea;

        private void Awake()
        {
            _raycastManager = GetComponent<ARRaycastManager>();
            _arCamera = Camera.main;

            if (_arCamera == null)
            {
                Debug.LogError("[ARPlacementManager] Main Camera not found. Ensure AR Camera has 'MainCamera' tag.");
            }
        }

        private void Update()
        {
            // If already placed, do not process new placement taps unless repositioning mode is active
            if (_isAreaPlaced)
            {
                return;
            }

            // Check if touch input occurred
            if (TryGetTouchInput(out Vector2 touchPosition))
            {
                // CRITICAL: Block placement if user tapped on a UI button (e.g., reset, settings, help)
                if (IsPointerOverUI(touchPosition))
                {
                    return;
                }

                // Attempt to place object at touch position or current reticle position
                TryPlaceObject(touchPosition);
            }
        }

        /// <summary>
        /// Reads first touch phase began or mouse click (for Unity Editor testing).
        /// </summary>
        private bool TryGetTouchInput(out Vector2 touchPosition)
        {
#if UNITY_EDITOR
            if (Input.GetMouseButtonDown(0))
            {
                touchPosition = Input.mousePosition;
                return true;
            }
#else
            if (Input.touchCount > 0)
            {
                Touch touch = Input.GetTouch(0);
                if (touch.phase == TouchPhase.Began)
                {
                    touchPosition = touch.position;
                    return true;
                }
            }
#endif
            touchPosition = default;
            return false;
        }

        /// <summary>
        /// Validates raycast against detected horizontal planes and spawns the training area.
        /// </summary>
        private void TryPlaceObject(Vector2 screenPosition)
        {
            // Raycast against polygons on horizontal detected planes
            if (_raycastManager.Raycast(screenPosition, Hits, TrackableType.PlaneWithinPolygon))
            {
                Pose hitPose = Hits[0].pose;

                // Determine orientation: optionally face user's camera on Y axis
                Quaternion spawnRotation = hitPose.rotation;
                if (autoFaceCameraOnPlacement && _arCamera != null)
                {
                    Vector3 cameraForward = _arCamera.transform.forward;
                    cameraForward.y = 0f; // Keep rotation level with the floor plane
                    if (cameraForward.sqrMagnitude > 0.001f)
                    {
                        spawnRotation = Quaternion.LookRotation(cameraForward);
                    }
                }

                if (trainingAreaPrefab == null)
                {
                    Debug.LogError("[ARPlacementManager] trainingAreaPrefab is not assigned in Inspector. Cannot place area.");
                    return;
                }

                if (_spawnedTrainingArea == null)
                {
                    _spawnedTrainingArea = Instantiate(trainingAreaPrefab, hitPose.position, spawnRotation);
                }
                else
                {
                    _spawnedTrainingArea.transform.SetPositionAndRotation(hitPose.position, spawnRotation);
                    _spawnedTrainingArea.SetActive(true);
                }

                _isAreaPlaced = true;

                // Hide reticle
                if (placementIndicator != null)
                {
                    placementIndicator.SetReticleActive(false);
                }

                // Hide plane meshes to keep scene clean for industrial training
                if (hidePlanesAfterPlacement && planeController != null)
                {
                    planeController.SetPlanesVisible(false);
                }

                Debug.Log($"[ARPlacementManager] Training Area successfully placed at {hitPose.position}");
                OnTrainingAreaPlaced?.Invoke();
            }
        }

        /// <summary>
        /// Allows resetting or repositioning the training zone (e.g. from UI button).
        /// </summary>
        public void ResetPlacement()
        {
            if (_spawnedTrainingArea != null)
            {
                _spawnedTrainingArea.SetActive(false);
            }

            _isAreaPlaced = false;

            if (placementIndicator != null)
            {
                placementIndicator.SetReticleActive(true);
            }

            if (planeController != null)
            {
                planeController.SetPlanesVisible(true);
            }

            Debug.Log("[ARPlacementManager] AR Placement reset. Ready for re-anchoring.");
            OnTrainingAreaReset?.Invoke();
        }

        /// <summary>
        /// Prevents AR tap placement through UI canvas elements.
        /// </summary>
        private bool IsPointerOverUI(Vector2 screenPosition)
        {
            if (EventSystem.current == null) return false;

            PointerEventData eventData = new PointerEventData(EventSystem.current)
            {
                position = screenPosition
            };

            List<RaycastResult> results = new List<RaycastResult>();
            EventSystem.current.RaycastAll(eventData, results);
            return results.Count > 0;
        }
    }
}`
  },
  {
    id: "placement-indicator",
    step: 1,
    filename: "ARPlacementIndicator.cs",
    className: "ARPlacementIndicator",
    namespace: "SIH26041.AR.Core",
    summary: "Renders a visual placement reticle/marker at the center of the camera screen over detected AR surfaces to guide the trainee.",
    targetGameObject: "PlacementIndicator (Child of Scene or Reticle Prefab)",
    requiredComponents: [],
    inspectorFields: [
      { name: "visualChild", type: "GameObject", description: "The visual 3D mesh/ring of the reticle (toggled on/off).", required: true },
      { name: "raycastManager", type: "ARRaycastManager", description: "Reference to ARRaycastManager on XR Origin.", required: true },
      { name: "placementManager", type: "ARPlacementManager", description: "Reference to ARPlacementManager.", required: true },
      { name: "smoothMoveSpeed", type: "float", description: "Lerp speed for smooth reticle movement (default 15f).", required: false }
    ],
    code: `using System.Collections.Generic;
using UnityEngine;
using UnityEngine.XR.ARFoundation;
using UnityEngine.XR.ARSubsystems;

namespace SIH26041.AR.Core
{
    /// <summary>
    /// Visual reticle that continuously raycasts from the center of the screen
    /// onto detected horizontal planes to show exactly where the training area will anchor.
    /// </summary>
    public class ARPlacementIndicator : MonoBehaviour
    {
        [Header("Indicator Configuration")]
        [Tooltip("The visual child GameObject containing meshes/colliders for the reticle ring.")]
        [SerializeField] private GameObject visualChild;

        [Tooltip("Reference to the ARRaycastManager on XR Origin.")]
        [SerializeField] private ARRaycastManager raycastManager;

        [Tooltip("Reference to ARPlacementManager.")]
        [SerializeField] private ARPlacementManager placementManager;

        [Tooltip("Speed of reticle position smoothing.")]
        [SerializeField] private float smoothMoveSpeed = 15f;

        private bool _isPlacementValid = false;
        private bool _isManualOverrideHidden = false;
        private static readonly List<ARRaycastHit> Hits = new List<ARRaycastHit>();

        public bool IsPlacementValid => _isPlacementValid;

        private void Start()
        {
            if (visualChild == null && transform.childCount > 0)
            {
                visualChild = transform.GetChild(0).gameObject;
            }

            SetReticleActive(false);
        }

        private void Update()
        {
            // Do not display if already placed or explicitly hidden
            if (_isManualOverrideHidden || (placementManager != null && placementManager.IsAreaPlaced))
            {
                SetReticleActive(false);
                return;
            }

            UpdatePlacementPose();
        }

        /// <summary>
        /// Raycasts from viewport center (0.5, 0.5) to track horizontal surface.
        /// </summary>
        private void UpdatePlacementPose()
        {
            if (raycastManager == null) return;

            // Center of screen
            Vector2 screenCenter = new Vector2(Screen.width * 0.5f, Screen.height * 0.5f);

            if (raycastManager.Raycast(screenCenter, Hits, TrackableType.PlaneWithinPolygon))
            {
                Pose hitPose = Hits[0].pose;
                _isPlacementValid = true;

                // Smoothly interpolate reticle position to avoid jitter on noisy sensor feeds
                transform.position = Vector3.Lerp(transform.position, hitPose.position, Time.deltaTime * smoothMoveSpeed);
                transform.rotation = Quaternion.Slerp(transform.rotation, hitPose.rotation, Time.deltaTime * smoothMoveSpeed);

                SetReticleActive(true);
            }
            else
            {
                _isPlacementValid = false;
                SetReticleActive(false);
            }
        }

        public void SetReticleActive(bool active)
        {
            if (visualChild != null && visualChild.activeSelf != active)
            {
                visualChild.SetActive(active);
            }
        }

        public void SetManualOverrideHidden(bool hide)
        {
            _isManualOverrideHidden = hide;
            if (hide) SetReticleActive(false);
        }
    }
}`
  },
  {
    id: "plane-controller",
    step: 1,
    filename: "ARPlaneDetectionController.cs",
    className: "ARPlaneDetectionController",
    namespace: "SIH26041.AR.Core",
    summary: "Monitors ARPlaneManager plane discovery events, tracks detected plane counts, and allows toggling plane visualization on/off.",
    targetGameObject: "XR Origin (or AR Session Origin)",
    requiredComponents: ["ARPlaneManager"],
    inspectorFields: [
      { name: "planePrefab", type: "GameObject", description: "AR Plane visualizer prefab with ARPlane, ARPlaneMeshVisualizer, and LineRenderer/Material.", required: true },
      { name: "minimumPlanesToPromptPlacement", type: "int", description: "Minimum detected planes before showing placement ready prompt (default: 1).", required: false }
    ],
    code: `using System;
using UnityEngine;
using UnityEngine.XR.ARFoundation;

namespace SIH26041.AR.Core
{
    /// <summary>
    /// Coordinates plane detection states and allows toggling plane visualizers
    /// between active scanning mode and training simulation mode.
    /// </summary>
    [RequireComponent(typeof(ARPlaneManager))]
    public class ARPlaneDetectionController : MonoBehaviour
    {
        [Tooltip("Optional reference to the AR Plane Manager (auto-retrieved if null).")]
        [SerializeField] private ARPlaneManager planeManager;

        public event Action<int> OnPlaneCountChanged;
        public event Action OnFirstPlaneDetected;

        private int _totalPlanesDetected = 0;
        private bool _firstPlaneNotified = false;

        public int TotalPlanesDetected => _totalPlanesDetected;
        public bool HasDetectedPlanes => _totalPlanesDetected > 0;

        private void Awake()
        {
            if (planeManager == null)
            {
                planeManager = GetComponent<ARPlaneManager>();
            }
        }

        private void OnEnable()
        {
            if (planeManager != null)
            {
                planeManager.planesChanged += HandlePlanesChanged;
            }
        }

        private void OnDisable()
        {
            if (planeManager != null)
            {
                planeManager.planesChanged -= HandlePlanesChanged;
            }
        }

        private void HandlePlanesChanged(ARPlanesChangedEventArgs args)
        {
            _totalPlanesDetected = planeManager.trackables.count;
            OnPlaneCountChanged?.Invoke(_totalPlanesDetected);

            if (!_firstPlaneNotified && _totalPlanesDetected > 0)
            {
                _firstPlaneNotified = true;
                OnFirstPlaneDetected?.Invoke();
                Debug.Log("[ARPlaneDetectionController] Initial horizontal plane recognized.");
            }
        }

        /// <summary>
        /// Toggles visual rendering of all detected planes without stopping underlying tracking.
        /// </summary>
        public void SetPlanesVisible(bool visible)
        {
            if (planeManager == null) return;

            foreach (var plane in planeManager.trackables)
            {
                plane.gameObject.SetActive(visible);
            }
        }

        /// <summary>
        /// Completely pauses or resumes AR plane detection subsystems (saves battery).
        /// </summary>
        public void SetPlaneDetectionEnabled(bool enable)
        {
            if (planeManager != null)
            {
                planeManager.enabled = enable;
            }
        }
    }
}`
  },
  {
    id: "ui-manager",
    step: 1,
    filename: "ARUIManager.cs",
    className: "ARUIManager",
    namespace: "SIH26041.AR.UI",
    summary: "Drives trainee onboarding HUD guidance: 'Scan the floor', 'Tap to place training area', plane count pill, and Reset Placement button.",
    targetGameObject: "Canvas_AR_HUD",
    requiredComponents: [],
    inspectorFields: [
      { name: "instructionBannerText", type: "TMPro.TextMeshProUGUI", description: "Main instruction label on the top banner.", required: true },
      { name: "planeStatusBadgeText", type: "TMPro.TextMeshProUGUI", description: "Small pill showing 'Planes detected: X'.", required: false },
      { name: "instructionIcon", type: "UnityEngine.UI.Image", description: "Icon next to the banner text.", required: false },
      { name: "resetButton", type: "UnityEngine.UI.Button", description: "Button allowing trainee to clear and reposition training area.", required: true },
      { name: "placementManager", type: "ARPlacementManager", description: "Reference to ARPlacementManager.", required: true },
      { name: "indicator", type: "ARPlacementIndicator", description: "Reference to ARPlacementIndicator.", required: true },
      { name: "planeController", type: "ARPlaneDetectionController", description: "Reference to ARPlaneDetectionController.", required: true }
    ],
    code: `using TMPro;
using UnityEngine;
using UnityEngine.UI;
using SIH26041.AR.Core;

namespace SIH26041.AR.UI
{
    /// <summary>
    /// Manages the heads-up display (HUD) for SIH26041 AR Vocational Safety Simulator.
    /// Provides crystal-clear visual prompts: 'Scan the floor' -> 'Tap to place' -> 'Safety Area Active'.
    /// </summary>
    public class ARUIManager : MonoBehaviour
    {
        [Header("UI Text & Banners")]
        [Tooltip("Main prompt text banner.")]
        [SerializeField] private TextMeshProUGUI instructionBannerText;

        [Tooltip("Badge displaying detected plane count.")]
        [SerializeField] private TextMeshProUGUI planeStatusBadgeText;

        [Header("Buttons")]
        [Tooltip("Button to reset object placement and reposition.")]
        [SerializeField] private Button resetButton;

        [Header("Scene References")]
        [SerializeField] private ARPlacementManager placementManager;
        [SerializeField] private ARPlacementIndicator indicator;
        [SerializeField] private ARPlaneDetectionController planeController;

        private const string MSG_SCANNING = "Move device slowly to scan the floor...";
        private const string MSG_TAP_TO_PLACE = "Surface detected! Tap screen to place Training Area.";
        private const string MSG_AREA_PLACED = "Training Area Deployed. Walk around to inspect.";

        private void Awake()
        {
            if (resetButton != null)
            {
                resetButton.onClick.AddListener(OnResetButtonClicked);
                resetButton.gameObject.SetActive(false); // Initially hidden
            }
        }

        private void OnEnable()
        {
            if (placementManager != null)
            {
                placementManager.OnTrainingAreaPlaced += HandleAreaPlaced;
                placementManager.OnTrainingAreaReset += HandleAreaReset;
            }

            if (planeController != null)
            {
                planeController.OnPlaneCountChanged += HandlePlaneCountChanged;
            }
        }

        private void OnDisable()
        {
            if (placementManager != null)
            {
                placementManager.OnTrainingAreaPlaced -= HandleAreaPlaced;
                placementManager.OnTrainingAreaReset -= HandleAreaReset;
            }

            if (planeController != null)
            {
                planeController.OnPlaneCountChanged -= HandlePlaneCountChanged;
            }
        }

        private void Update()
        {
            // If already placed, keep placed message
            if (placementManager != null && placementManager.IsAreaPlaced)
            {
                return;
            }

            // Dynamically update guidance based on whether reticle is locked onto a plane
            if (indicator != null && indicator.IsPlacementValid)
            {
                SetInstruction(MSG_TAP_TO_PLACE, new Color(0.1f, 0.75f, 0.35f)); // Green prompt
            }
            else
            {
                SetInstruction(MSG_SCANNING, new Color(0.95f, 0.65f, 0.1f)); // Amber/Warning prompt
            }
        }

        private void HandlePlaneCountChanged(int count)
        {
            if (planeStatusBadgeText != null)
            {
                planeStatusBadgeText.text = $"Surfaces: {count}";
            }
        }

        private void HandleAreaPlaced()
        {
            SetInstruction(MSG_AREA_PLACED, new Color(0.2f, 0.5f, 1f));
            if (resetButton != null)
            {
                resetButton.gameObject.SetActive(true);
            }
        }

        private void HandleAreaReset()
        {
            SetInstruction(MSG_SCANNING, new Color(0.95f, 0.65f, 0.1f));
            if (resetButton != null)
            {
                resetButton.gameObject.SetActive(false);
            }
        }

        private void OnResetButtonClicked()
        {
            if (placementManager != null)
            {
                placementManager.ResetPlacement();
            }
        }

        private void SetInstruction(string message, Color highlightColor)
        {
            if (instructionBannerText != null)
            {
                instructionBannerText.text = message;
                instructionBannerText.color = highlightColor;
            }
        }
    }
}`
  },
  {
    id: "training-anchor",
    step: 1,
    filename: "TrainingAreaAnchor.cs",
    className: "TrainingAreaAnchor",
    namespace: "SIH26041.AR.Training",
    summary: "Attached to the instantiated training area placeholder root. Holds references to hazard perimeter, safety equipment socket, and provides extensible hooks for future Step 2 modules.",
    targetGameObject: "IndustrialTrainingArea_Placeholder (Prefab Root)",
    requiredComponents: [],
    inspectorFields: [
      { name: "scenarioMountPoint", type: "Transform", description: "Child transform where future industrial machinery (conveyor, switchgear) will be injected.", required: true },
      { name: "safetyBoundaryVisual", type: "GameObject", description: "Perimeter danger tape / boundary mesh around the training zone.", required: false },
      { name: "areaLabel", type: "string", description: "Identifier name for this vocational simulator zone (e.g., 'Zone A: Heavy Machinery Safety').", required: false }
    ],
    code: `using UnityEngine;

namespace SIH26041.AR.Training
{
    /// <summary>
    /// Root anchor component for the placed industrial training zone.
    /// Acts as the foundational anchor point for SIH26041 safety scenarios,
    /// hazard markers, and vocational assessment triggers.
    /// </summary>
    public class TrainingAreaAnchor : MonoBehaviour
    {
        [Header("Scenario Mount")]
        [Tooltip("Transform where future interactive scenarios (Step 2) will be dynamically loaded.")]
        [SerializeField] private Transform scenarioMountPoint;

        [Tooltip("Visual safety boundary line or caution barricade around the training zone.")]
        [SerializeField] private GameObject safetyBoundaryVisual;

        [Header("Metadata")]
        [SerializeField] private string areaLabel = "Jharkhand Mining Safety - Training Station 01";

        public Transform ScenarioMountPoint => scenarioMountPoint != null ? scenarioMountPoint : transform;
        public string AreaLabel => areaLabel;

        private void Start()
        {
            // Play initial subtle deployment sound or particle if available
            Debug.Log($"[TrainingAreaAnchor] Initialized: {areaLabel} at position {transform.position}");
        }

        /// <summary>
        /// Hook for Step 2: Allows switching between Mining Haulage, Electrical Switchgear,
        /// or PPE Inspection modules without rebuilding the AR foundation.
        /// </summary>
        public void LoadScenario(GameObject scenarioPrefab)
        {
            if (scenarioPrefab == null) return;

            // Clear previous scenario if any
            foreach (Transform child in ScenarioMountPoint)
            {
                Destroy(child.gameObject);
            }

            Instantiate(scenarioPrefab, ScenarioMountPoint);
            Debug.Log($"[TrainingAreaAnchor] Injected scenario prefab: {scenarioPrefab.name}");
        }
    }
}`
  }
];

export const CS_SCRIPTS: CSharpScript[] = [
  ...STEP_1_SCRIPTS,
  ...STEP_2_SCRIPTS,
  ...STEP_3_SCRIPTS,
  ...STEP_5_SCRIPTS,
  ...STEP_6_SCRIPTS,
  ...STEP_7_SCRIPTS,
  ...STEP_8_SCRIPTS
];

export const FOLDER_STRUCTURE_TEXT = `Assets/
├── _Project/                           <-- Clean root namespace isolating project from external SDKs
│   ├── Animations/
│   │   ├── Reticle/
│   │   └── UI/
│   ├── Audio/                          <-- Industrial alerts, machinery hum, safety buzzer
│   ├── Materials/
│   │   ├── M_AR_PlaneGrid.mat          <-- Semi-transparent yellow/blue grid for detected planes
│   │   ├── M_PlacementReticle.mat      <-- High-visibility amber reticle material
│   │   ├── M_CautionTape.mat           <-- Black & yellow industrial hazard stripes
│   │   └── M_IndustrialMetal.mat
│   ├── Models/
│   │   ├── Machinery/                  <-- Placeholder & future 3D equipment
│   │   └── Props/                      <-- Cones, barriers, fire extinguishers
│   ├── Prefabs/
│   │   ├── AR/
│   │   │   ├── AR_FeatheredPlane.prefab    <-- Plane visualizer prefab
│   │   │   └── AR_PlacementReticle.prefab  <-- Center-screen target indicator
│   │   ├── TrainingArea/
│   │   │   └── IndustrialTrainingArea_Placeholder.prefab <-- Step 1 placed training zone
│   │   └── UI/
│   │       └── Canvas_AR_HUD.prefab
│   ├── Scenes/
│   │   ├── 01_AR_SafetyFoundation.unity    <-- STEP 1 SCENE
│   │   └── 00_Bootloader.unity             <-- Future loading/login scene
│   ├── Scripts/
│   │   ├── AR/
│   │   │   ├── ARPlacementManager.cs
│   │   │   ├── ARPlacementIndicator.cs
│   │   │   └── ARPlaneDetectionController.cs
│   │   ├── UI/
│   │   │   └── ARUIManager.cs
│   │   ├── Training/
│   │   │   └── TrainingAreaAnchor.cs
│   │   ├── Data/                       <-- Reserved for Step 2+ (User progress, hazard models)
│   │   ├── Firebase/                   <-- Reserved for Step 3 (Auth, Firestore)
│   │   └── AI/                         <-- Reserved for Step 4 (Gemini hazard analysis)
│   └── Shaders/
│       └── AR_PlaneFeatheredGrid.shader
└── TextMesh Pro/                       <-- Generated by Unity TMPro essential resources`;

export const SETUP_STEPS: SetupStep[] = [
  {
    id: "step-a-versions",
    title: "A. Recommended Unity Version & Packages",
    category: "packages",
    summary: "Select the rock-solid LTS release and install verified AR Foundation & ARCore plugins.",
    details: [
      "Recommended Unity Editor Version: Unity 2022.3.30f1 LTS or newer (e.g., 2022.3.48f1). Unity 2022.3 is the battle-tested standard for Android ARCore with complete stability and zero breaking API deprecations.",
      "Alternate: Unity 6000.0.x (Unity 6) is also supported, with AR Foundation 6.0.",
      "Template: Select '3D (Core)' or '3D (URP)'. For beginners and robust AR rendering, 3D Core or standard URP is ideal.",
      "Open Unity Hub -> New Project -> Select 3D Core -> Name project 'SIH26041_IndustrialSafetyAR'.",
      "Open Window -> Package Manager. Set dropdown to 'Packages: Unity Registry'.",
      "Search for and install: 'AR Foundation' (Version 5.1.x for Unity 2022.3, or 6.x for Unity 6).",
      "Search for and install: 'Google ARCore XR Plugin' (matching version, e.g. 5.1.x).",
      "Verify 'XR Interaction Toolkit' is NOT needed for this step (keep dependencies minimal and fast)."
    ],
    tips: [
      "Ensure you have the 'Android Build Support' module installed in Unity Hub, including Android SDK & NDK Tools and OpenJDK."
    ]
  },
  {
    id: "step-b-project-settings",
    title: "B. Exact Unity Project & Android Setup",
    category: "android",
    summary: "Configure Android Player Settings, XR Plug-in Management, and Camera permissions.",
    details: [
      "1. Switch Platform: File -> Build Settings -> Select 'Android' -> Click 'Switch Platform' (allow Unity to recompile assets).",
      "2. XR Plug-in Management: Edit -> Project Settings -> XR Plug-in Management. Click the Android tab (robot icon) and CHECK 'Google ARCore'.",
      "3. Player Settings -> Other Settings:",
      "   - Auto Graphics API: UNCHECK 'Auto Graphics API'.",
      "   - Graphics APIs: Ensure 'Vulkan' is either removed or placed BELOW OpenGLES3, or ensure Vulkan is supported (ARCore recommends OpenGLES3 / Vulkan compatible). For widest compatibility across budget Indian Android phones, use OpenGLES3.",
      "   - Minimum API Level: Set to 'Android 7.0 (API Level 24)' or 'Android 8.0 (API Level 26)'.",
      "   - Target API Level: 'Automatic (highest installed)' or 'API Level 34'.",
      "   - Scripting Backend: Set to 'IL2CPP'.",
      "   - Target Architectures: Check 'ARM64', uncheck 'ARMv7' (ARCore requires 64-bit).",
      "4. Camera Usage Description: In Player Settings -> Other Settings, enter: 'Industrial AR safety training requires camera access to detect floors and machinery zones.'",
      "5. Package Name: Set Identification -> Package Name to 'com.sih26041.industrialsafety.ar'."
    ]
  },
  {
    id: "step-c-folder-structure",
    title: "C. Exact Project Folder Structure",
    category: "engine",
    summary: "Establish a scalable architecture under Assets/_Project/ ready for upcoming training scenarios.",
    details: [
      "In Unity's Project tab, navigate to Assets.",
      "Create a root folder named '_Project'. The leading underscore keeps your proprietary code at the very top, separated from 3rd party packages.",
      "Create subfolders as outlined in the Folder Structure panel: AR, UI, Training, Materials, Prefabs, Scenes, Models, Audio.",
      "Create a new Scene in Assets/_Project/Scenes/ named '01_AR_SafetyFoundation'."
    ]
  },
  {
    id: "step-d-scripts",
    title: "D. Complete Modular C# Scripts",
    category: "hierarchy",
    summary: "Drop in the 5 production scripts with clean separation of concerns.",
    details: [
      "ARPlacementManager.cs: Handles screen touches, ignores UI clicks, raycasts against polygons, anchors the prefab.",
      "ARPlacementIndicator.cs: Renders the pulsing yellow target reticle at the center of screen.",
      "ARPlaneDetectionController.cs: Tracks detected horizontal planes and allows toggling plane visuals on/off.",
      "ARUIManager.cs: Updates text HUD: 'Scan floor' -> 'Tap to place' -> 'Safety Area Placed', plus Reset button.",
      "TrainingAreaAnchor.cs: Extensible anchor component on the spawned industrial prefab."
    ]
  },
  {
    id: "step-e-scene-hierarchy",
    title: "E. Exact Unity Scene Hierarchy",
    category: "hierarchy",
    summary: "Assemble the AR Foundation GameObjects in the scene with exact component wiring.",
    details: [
      "1. Delete default 'Main Camera' and 'Directional Light' (or keep Directional Light for shading).",
      "2. Right-click in Hierarchy -> XR -> AR Session. (Creates 'AR Session' with ARSession and ARInputManager components).",
      "3. Right-click in Hierarchy -> XR -> XR Origin (in older AR Foundation it was named 'AR Session Origin').",
      "4. Inspect 'XR Origin':",
      "   - Add Component: 'ARRaycastManager'.",
      "   - Add Component: 'ARPlaneManager'. In ARPlaneManager, set 'Detection Mode' to 'Horizontal'.",
      "   - Add Component: 'ARPlacementManager' (our script).",
      "   - Add Component: 'ARPlaneDetectionController' (our script).",
      "5. Inspect child 'Main Camera' inside XR Origin:",
      "   - Ensure it has components: 'ARCameraManager', 'ARCameraBackground', 'TrackedPoseDriver'. Tag MUST be 'MainCamera'.",
      "6. Create Reticle GameObject in Hierarchy: Right-click -> Create Empty -> Name it 'PlacementIndicator'.",
      "   - Add Component: 'ARPlacementIndicator' (our script).",
      "   - Create a 3D Quad or 3D Cylinder (flattened to Y=0.01f, Scale: 0.4, 0.005, 0.4) as child named 'VisualChild'.",
      "7. Create UI Canvas: Right-click -> UI -> Canvas. Set Canvas Scaler to 'Scale With Screen Size' (1080 x 1920, Match 0.5).",
      "   - Add TextMeshPro top banner for instructions.",
      "   - Add Reset Button in bottom-right.",
      "   - Add Component 'ARUIManager' to Canvas and wire Inspector references."
    ]
  },
  {
    id: "step-f-prefab",
    title: "F. Create Placeholder Training-Area Prefab",
    category: "prefab",
    summary: "Construct a 1:1 real-scale industrial safety station placeholder.",
    details: [
      "1. In Hierarchy, create Empty GameObject named 'IndustrialTrainingArea_Placeholder'.",
      "2. Add Component: 'TrainingAreaAnchor' (our script).",
      "3. Create Child 1: 'FloorBase_CautionPerimeter'. Add a 3D Cube: Position (0, 0.02, 0), Scale (1.5, 0.04, 1.5). Apply caution yellow/black material.",
      "4. Create Child 2: 'MachineryPlaceholder_Pedestal'. Add a 3D Cylinder or Cube: Position (0, 0.4, 0), Scale (0.6, 0.7, 0.6). Represents mining equipment / conveyor motor.",
      "5. Create Child 3: 'HazardWarning_SignPost'. Add a thin post (Scale 0.05, 1.2, 0.05) with a yellow caution diamond sign reading 'DANGER: HIGH VOLTAGE / CONVEYOR PINCH POINT'.",
      "6. Create Child 4: Empty Transform named 'ScenarioMountPoint'. Position (0, 0.8, 0). Link this to TrainingAreaAnchor's 'scenarioMountPoint' field in Inspector.",
      "7. Drag 'IndustrialTrainingArea_Placeholder' from Hierarchy into 'Assets/_Project/Prefabs/TrainingArea/' to save as a Prefab.",
      "8. Delete it from Hierarchy (it will be instantiated at runtime via ARPlacementManager)."
    ]
  },
  {
    id: "step-g-android-test",
    title: "G. Android Phone Testing Steps",
    category: "testing",
    summary: "Deploy and run live on an ARCore compatible Android device.",
    details: [
      "1. Enable Developer Options on Android: Settings -> About Phone -> Tap 'Build Number' 7 times.",
      "2. Enable 'USB Debugging' in Developer Options.",
      "3. Install 'Google Play Services for AR' from Google Play Store on your test phone.",
      "4. Connect phone to PC via USB. Accept 'Allow USB Debugging' prompt on device.",
      "5. In Unity: File -> Build Settings -> Ensure scene '01_AR_SafetyFoundation' is checked in 'Scenes In Build'.",
      "6. Select your device in 'Run Device' dropdown -> Click 'Build and Run'.",
      "7. Grant Camera Permission when prompted on app launch.",
      "8. Move phone slowly in a circular motion facing a textured floor (tile, carpet, wood, concrete).",
      "9. Verify the reticle locks to the floor, instruction changes to 'Surface detected! Tap screen to place...', tap to anchor the training area, and verify the Reset button functions."
    ]
  },
  {
    id: "step-h-troubleshooting",
    title: "H. Common Errors & Fixes",
    category: "testing",
    summary: "Immediate diagnostics for black screen, missing ARCore, tap through UI, and tracking errors.",
    details: [
      "Black Screen on launch -> Missing Google ARCore provider in XR Plug-in Management, or missing Camera permission in AndroidManifest.",
      "App crashes on launch -> ARMv7 enabled instead of ARM64, or Vulkan incompatibility (switch to OpenGLES3 in Player Settings).",
      "Planes never detected -> Featureless floor (plain white glossy tile), poor lighting, or missing ARPlaneMeshVisualizer.",
      "Tap places object when clicking buttons -> Missing EventSystem UI raycast check (already solved in ARPlacementManager.cs with IsPointerOverUI)."
    ]
  }
];

export const ERROR_DIAGNOSTICS: ErrorTroubleshooting[] = [
  {
    id: "err-1",
    errorTitle: "Black Screen / Camera feed not rendering on phone",
    symptom: "The app opens on Android, UI is visible, but the camera feed is completely black.",
    rootCause: "1) Google ARCore is not checked in XR Plug-in Management, 2) Camera permission was rejected or not declared, or 3) AR Camera is missing ARCameraBackground component.",
    solutionSteps: [
      "Go to Edit -> Project Settings -> XR Plug-in Management -> Android tab. Ensure 'Google ARCore' has a checkmark.",
      "Inspect XR Origin -> Main Camera. Ensure it contains 'AR Camera Manager' and 'AR Camera Background' components.",
      "Check Android device Settings -> Apps -> SIH26041 AR -> Permissions -> Camera -> Set to 'Allow only while using the app'."
    ],
    preventativeTip: "Always verify XR Plug-in Management before your first build."
  },
  {
    id: "err-2",
    errorTitle: "Build Error: 'ARCore requires ARM64 architecture' / Crash on launch",
    symptom: "Unity build fails or the app crashes immediately after the Unity splash screen.",
    rootCause: "Project is configured with Mono or 32-bit ARMv7. Google ARCore requires 64-bit binaries.",
    solutionSteps: [
      "Open Edit -> Project Settings -> Player -> Android tab -> Other Settings.",
      "Change 'Scripting Backend' from 'Mono' to 'IL2CPP'.",
      "Under 'Target Architectures', UNCHECK 'ARMv7' and CHECK 'ARM64'.",
      "If prompted, verify your Android NDK is configured in Unity Preferences -> External Tools."
    ],
    preventativeTip: "ARCore 1.30+ requires 64-bit on modern Android releases."
  },
  {
    id: "err-3",
    errorTitle: "Planes never detect / Reticle never appears",
    symptom: "The user waves the phone over the floor for minutes, but no horizontal planes appear.",
    rootCause: "The floor surface is uniformly reflective (e.g. glossy white tile with zero texture) or lighting is too dim for ARCore feature-point optical flow.",
    solutionSteps: [
      "Test on a textured floor: patterned rug, wood grain, concrete, or place a few sheets of paper or tape marks on the floor.",
      "Ensure ambient room lighting is bright enough (avoid dark corridors).",
      "Verify ARPlaneManager has 'Detection Mode' set to 'Horizontal' and not 'None'."
    ],
    preventativeTip: "For industrial mining demonstrations, concrete floors have rich texture and track exceptionally well."
  },
  {
    id: "err-4",
    errorTitle: "Tapping 'Reset' button accidentally spawns/moves the AR object",
    symptom: "When trainee taps the UI Reset button, the object gets relocated right where the button was pressed.",
    rootCause: "Touch input was processed by both the UI EventSystem and the ARRaycastManager simultaneously.",
    solutionSteps: [
      "Our ARPlacementManager includes the robust method 'IsPointerOverUI(touchPosition)'.",
      "Verify EventSystem exists in the scene (created automatically with Canvas).",
      "Ensure GraphicRaycaster is attached to Canvas_AR_HUD."
    ],
    preventativeTip: "Always filter touches through EventSystem.current.RaycastAll before calling ARRaycastManager."
  }
];

export const STEP_1_CHECKLIST: ChecklistItem[] = [
  {
    id: "chk-1",
    category: "Unity & XR Setup",
    title: "Unity 2022.3 LTS Project Created with 3D Template",
    description: "New project initialized with Android Build Support enabled.",
    completed: false
  },
  {
    id: "chk-2",
    category: "Unity & XR Setup",
    title: "AR Foundation & Google ARCore XR Plugin Installed",
    description: "Installed matching 5.1.x (or 6.x) packages from Package Manager.",
    completed: false
  },
  {
    id: "chk-3",
    category: "Android Configuration",
    title: "XR Plug-in Management -> Google ARCore Enabled",
    description: "ARCore provider checked under Android tab in Project Settings.",
    completed: false
  },
  {
    id: "chk-4",
    category: "Android Configuration",
    title: "IL2CPP + ARM64 Architecture Set",
    description: "ARMv7 unchecked, 64-bit IL2CPP enabled, OpenGLES3 graphics selected.",
    completed: false
  },
  {
    id: "chk-5",
    category: "Architecture & Scripts",
    title: "Assets/_Project/ Directory Structure Established",
    description: "Standard folders created for AR, UI, Training, Prefabs, Materials.",
    completed: false
  },
  {
    id: "chk-6",
    category: "Architecture & Scripts",
    title: "All 5 Modular C# Scripts Imported",
    description: "ARPlacementManager, ARPlacementIndicator, ARPlaneDetectionController, ARUIManager, TrainingAreaAnchor added.",
    completed: false
  },
  {
    id: "chk-7",
    category: "Scene & Prefabs",
    title: "XR Origin & AR Session Configured",
    description: "AR Camera tagged MainCamera with TrackedPoseDriver, ARRaycastManager & ARPlaneManager attached.",
    completed: false
  },
  {
    id: "chk-8",
    category: "Scene & Prefabs",
    title: "Industrial Training Area Placeholder Prefab Created",
    description: "Contains caution hazard boundary, equipment pedestal, danger sign, and TrainingAreaAnchor component.",
    completed: false
  },
  {
    id: "chk-9",
    category: "UI & Feedback",
    title: "AR HUD Canvas Wired Up",
    description: "Dynamic text banner ('Scan floor' / 'Tap to place'), plane counter, and Reset button connected.",
    completed: false
  },
  {
    id: "chk-10",
    category: "Verification",
    title: "Tested on Physical Android ARCore Phone",
    description: "Successful floor plane detection, reticle lock, tap-to-place anchoring, and reset testing.",
    completed: false
  }
];
