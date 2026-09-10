import { CSharpScript, HazardScenarioItem, ChecklistItem } from '../types';

export const HAZARD_SCENARIO_ITEMS: HazardScenarioItem[] = [
  {
    id: "worker-helmet",
    name: "Worker Head (Missing Helmet)",
    category: "ppe",
    isHazard: true,
    title: "Missing Safety Helmet (Hard Hat)",
    explanation: "Trainee is entering an active mining/manufacturing zone without an approved safety helmet. Extreme danger of fatal head injury from falling rocks, tools, or overhead crane hooks.",
    recommendation: "Per DGMS (Directorate General of Mines Safety) guidelines & IS 2925, an industrial safety helmet with chin strap must be worn before entering any active plant or pit.",
    scoreImpact: 10
  },
  {
    id: "worker-vest",
    name: "Worker Torso (Missing Safety Vest)",
    category: "ppe",
    isHazard: true,
    title: "Missing High-Visibility Reflective Vest",
    explanation: "Worker is wearing dark clothing without high-visibility retro-reflective tape. In Jharkhand's underground and open-cast mines, heavy haul trucks (dumpers) have severe blind spots.",
    recommendation: "Fluorescent safety jacket with Class 2 reflective bands (IS 15809) must be worn to ensure visibility from a minimum distance of 150 meters.",
    scoreImpact: 10
  },
  {
    id: "exposed-wire",
    name: "Live Exposed 440V Power Cable",
    category: "hazard",
    isHazard: true,
    title: "Exposed High-Voltage Electrical Hazard",
    explanation: "Frayed 440V motor power feed resting directly on a wet concrete floor near the metal conveyor frame. Severe risk of fatal electrocution and arc flash explosion.",
    recommendation: "Immediate de-energization following Lockout/Tagout (LOTO) protocols (OSHA 1910.147 / CEA Regulations 2010). Cable must be routed overhead or shielded in conduit.",
    scoreImpact: 10
  },
  {
    id: "unsafe-barrier",
    name: "Open Machinery Pit / Missing Barrier",
    category: "hazard",
    isHazard: true,
    title: "Unprotected Conveyor Pinch-Point Zone",
    explanation: "Perimeter danger boundary tape is broken and mechanical safety interlock fence is missing around rotating drive gears. Risk of limb entanglement.",
    recommendation: "Install fixed interlocking wire-mesh machinery guards per IS 9474 and place barricade tape at least 1.5m from any moving drive components.",
    scoreImpact: 10
  },
  {
    id: "safety-shoes",
    name: "Worker Safety Footwear",
    category: "safe",
    isHazard: false,
    title: "Approved Steel-Toe Safety Shoes (Compliant)",
    explanation: "This is NOT a hazard! The worker is wearing certified steel-toe, puncture-resistant industrial safety footwear with oil-resistant non-slip soles (IS 15298).",
    recommendation: "Good observation. Trainees should verify that footwear is fully laced and soles are free of oil contamination.",
    scoreImpact: -5
  },
  {
    id: "warning-sign",
    name: "Danger Warning Signpost",
    category: "safe",
    isHazard: false,
    title: "Standard Hazard Warning Sign (Compliant)",
    explanation: "This is NOT a hazard! The yellow triangular caution placard is correctly installed at eye level, properly alerting workers to pinch points.",
    recommendation: "Caution signage is a vital engineering control. Ensure signs are clean, illuminated, and legible in Hindi and English.",
    scoreImpact: -5
  }
];

export const STEP_2_SCRIPTS: CSharpScript[] = [
  {
    id: "hazard-data",
    step: 2,
    filename: "SafetyHazardData.cs",
    className: "SafetyHazardData",
    namespace: "SIH26041.AR.Training.Data",
    summary: "ScriptableObject defining hazard metadata, danger explanation, IS/DGMS standards, and score impacts. Allows adding unlimited safety scenarios without writing C# code.",
    targetGameObject: "Project Asset (Create -> SIH26041 -> Safety Hazard Data)",
    requiredComponents: [],
    inspectorFields: [
      { name: "hazardId", type: "string", description: "Unique identifier (e.g. 'HAZ_PPE_NO_HELMET').", required: true },
      { name: "hazardTitle", type: "string", description: "Display name (e.g. 'Missing Safety Helmet').", required: true },
      { name: "isHazard", type: "bool", description: "True if dangerous condition/missing PPE; false if compliant safe object.", required: true },
      { name: "category", type: "HazardCategory", description: "PPE, Electrical, Mechanical, Chemical, Fire, or SafeObject.", required: true },
      { name: "dangerExplanation", type: "string", description: "Detailed root danger explained to trainee upon tapping.", required: true },
      { name: "regulatoryStandard", type: "string", description: "DGMS / IS standard or SOP requirement.", required: true },
      { name: "scoreImpact", type: "int", description: "+10 for identifying hazard, -5 for false positive.", required: true }
    ],
    code: `using UnityEngine;

namespace SIH26041.AR.Training.Data
{
    public enum HazardCategory
    {
        MissingPPE,
        ElectricalHazard,
        MechanicalPinchPoint,
        ChemicalHazard,
        FireExplosion,
        SlipTripFall,
        CompliantSafeObject
    }

    /// <summary>
    /// Data-driven definition of an industrial hazard or PPE requirement.
    /// Create via Assets -> Create -> SIH26041 -> Safety Hazard Data.
    /// </summary>
    [CreateAssetMenu(fileName = "HazardData_New", menuName = "SIH26041/Safety Hazard Data", order = 1)]
    public class SafetyHazardData : ScriptableObject
    {
        [Header("Identification")]
        [Tooltip("Unique ID for progress tracking and analytics.")]
        [SerializeField] private string hazardId = "HAZ_001";

        [Tooltip("Short user-facing title.")]
        [SerializeField] private string hazardTitle = "Missing Safety Helmet";

        [Tooltip("Check if this object represents an unsafe condition or missing PPE.")]
        [SerializeField] private bool isHazard = true;

        [SerializeField] private HazardCategory category = HazardCategory.MissingPPE;

        [Header("Educational Feedback")]
        [TextArea(3, 5)]
        [Tooltip("Explanation shown to trainee of why this condition is dangerous.")]
        [SerializeField] private string dangerExplanation = "Entering active industrial or mining pits without hard hat creates severe risk of fatal cranial injury from falling debris.";

        [TextArea(2, 4)]
        [Tooltip("Corrective action per DGMS/IS industrial standard.")]
        [SerializeField] private string regulatoryStandard = "Per DGMS circular & IS 2925, approved safety helmet with chin strap must be worn at all times.";

        [Header("Scoring")]
        [Tooltip("Score awarded (+10 for hazard, -5 for misidentification).")]
        [SerializeField] private int scoreImpact = 10;

        [Header("Visual Feedback")]
        [SerializeField] private Color highlightColor = new Color(1f, 0.2f, 0.2f, 0.8f);

        public string HazardId => hazardId;
        public string HazardTitle => hazardTitle;
        public bool IsHazard => isHazard;
        public HazardCategory Category => category;
        public string DangerExplanation => dangerExplanation;
        public string RegulatoryStandard => regulatoryStandard;
        public int ScoreImpact => scoreImpact;
        public Color HighlightColor => highlightColor;
    }
}`
  },
  {
    id: "hazard-object",
    step: 2,
    filename: "HazardObject.cs",
    className: "HazardObject",
    namespace: "SIH26041.AR.Training",
    summary: "Attached to any interactable 3D mesh in the scenario. Holds the SafetyHazardData, triggers visual highlight materials/particles, and prevents duplicate scoring.",
    targetGameObject: "Any interactable 3D hazard object (e.g., Worker Head, Exposed Wire, Unsafe Barrier, Safety Shoes)",
    requiredComponents: ["Collider"],
    inspectorFields: [
      { name: "hazardData", type: "SafetyHazardData", description: "ScriptableObject asset defining this hazard.", required: true },
      { name: "targetRenderer", type: "Renderer", description: "Mesh renderer to tint or outline upon identification.", required: false },
      { name: "identifiedMarkerPrefab", type: "GameObject", description: "Optional 3D checkmark / warning billboard spawned above object when found.", required: false }
    ],
    code: `using System;
using UnityEngine;
using SIH26041.AR.Training.Data;

namespace SIH26041.AR.Training
{
    /// <summary>
    /// Component placed on 3D objects that can be tapped by the trainee.
    /// Handles visual highlighting and dispatches interaction events.
    /// </summary>
    [RequireComponent(typeof(Collider))]
    public class HazardObject : MonoBehaviour
    {
        [Header("Hazard Configuration")]
        [Tooltip("Data asset defining danger explanation and scoring.")]
        [SerializeField] private SafetyHazardData hazardData;

        [Header("Visual Feedback")]
        [Tooltip("Primary renderer to flash or highlight when tapped.")]
        [SerializeField] private Renderer targetRenderer;

        [Tooltip("Optional 3D marker spawned over object when identified.")]
        [SerializeField] private GameObject identifiedMarkerPrefab;

        private bool _isIdentified = false;
        private Material _originalMaterial;
        private Color _originalColor;

        public SafetyHazardData Data => hazardData;
        public bool IsIdentified => _isIdentified;
        public bool IsHazard => hazardData != null && hazardData.IsHazard;

        public static event Action<HazardObject> OnHazardObjectTapped;

        private void Awake()
        {
            if (targetRenderer == null)
            {
                targetRenderer = GetComponentInChildren<Renderer>();
            }

            if (targetRenderer != null && targetRenderer.material != null)
            {
                _originalMaterial = targetRenderer.material;
                if (_originalMaterial.HasProperty("_BaseColor"))
                {
                    _originalColor = _originalMaterial.GetColor("_BaseColor");
                }
                else if (_originalMaterial.HasProperty("_Color"))
                {
                    _originalColor = _originalMaterial.GetColor("_Color");
                }
            }
        }

        /// <summary>
        /// Called by TrainingObjectInteraction when trainee taps this object in AR.
        /// </summary>
        public void Interact()
        {
            if (hazardData == null)
            {
                Debug.LogWarning($"[HazardObject] {gameObject.name} has no SafetyHazardData assigned.");
                return;
            }

            // Only mark as identified once
            if (!_isIdentified && hazardData.IsHazard)
            {
                _isIdentified = true;
                ApplyHighlightVisuals();
            }

            // Notify scenario manager and score system
            OnHazardObjectTapped?.Invoke(this);
        }

        private void ApplyHighlightVisuals()
        {
            if (targetRenderer != null && targetRenderer.material != null)
            {
                // Set highlight color on URP BaseColor or legacy Color
                if (targetRenderer.material.HasProperty("_BaseColor"))
                {
                    targetRenderer.material.SetColor("_BaseColor", hazardData.HighlightColor);
                }
                else if (targetRenderer.material.HasProperty("_Color"))
                {
                    targetRenderer.material.SetColor("_Color", hazardData.HighlightColor);
                }
            }

            if (identifiedMarkerPrefab != null)
            {
                Vector3 spawnPos = transform.position + Vector3.up * 0.4f;
                Instantiate(identifiedMarkerPrefab, spawnPos, Quaternion.identity, transform);
            }
        }

        /// <summary>
        /// Resets state when restarting training scenario.
        /// </summary>
        public void ResetState()
        {
            _isIdentified = false;

            if (targetRenderer != null && _originalMaterial != null)
            {
                if (targetRenderer.material.HasProperty("_Color"))
                {
                    targetRenderer.material.color = _originalColor;
                }
            }
        }
    }
}`
  },
  {
    id: "ppe-object",
    step: 2,
    filename: "PPEObject.cs",
    className: "PPEObject",
    namespace: "SIH26041.AR.Training",
    summary: "Specialized HazardObject representing a PPE slot (Head, Torso, Boots, Eyes, Gloves). Supports visually equipping compliant PPE once the trainee identifies the violation.",
    targetGameObject: "Worker avatar sub-components (Head, Torso, Hands)",
    requiredComponents: ["Collider"],
    inspectorFields: [
      { name: "ppeSlotName", type: "string", description: "Name of PPE slot (e.g., 'Head - Hard Hat').", required: true },
      { name: "isPPEMissing", type: "bool", description: "If true, represents missing required gear.", required: true },
      { name: "compliantPPEVisual", type: "GameObject", description: "Correct PPE 3D mesh toggled ON when trainee identifies missing gear.", required: false }
    ],
    code: `using UnityEngine;

namespace SIH26041.AR.Training
{
    /// <summary>
    /// Specialized interactive object for Personal Protective Equipment (PPE).
    /// Extends HazardObject functionality to toggle compliant gear onto the worker model.
    /// </summary>
    public class PPEObject : HazardObject
    {
        [Header("PPE Slot Settings")]
        [SerializeField] private string ppeSlotName = "Head - Industrial Hard Hat";
        [SerializeField] private bool isPPEMissing = true;

        [Tooltip("Visual 3D model of the compliant PPE that equips when trainee solves the hazard.")]
        [SerializeField] private GameObject compliantPPEVisual;

        private void Start()
        {
            // If PPE is missing, hide compliant model initially
            if (compliantPPEVisual != null)
            {
                compliantPPEVisual.SetActive(!isPPEMissing);
            }
        }

        public void EquipCompliantPPE()
        {
            if (compliantPPEVisual != null)
            {
                compliantPPEVisual.SetActive(true);
                Debug.Log($"[PPEObject] Equipped compliant gear for slot: {ppeSlotName}");
            }
        }

        public new void ResetState()
        {
            base.ResetState();
            if (compliantPPEVisual != null)
            {
                compliantPPEVisual.SetActive(!isPPEMissing);
            }
        }
    }
}`
  },
  {
    id: "object-interaction",
    step: 2,
    filename: "TrainingObjectInteraction.cs",
    className: "TrainingObjectInteraction",
    namespace: "SIH26041.AR.Interaction",
    summary: "Listens for mobile screen touches, casts a 3D ray from the camera, filters out UI elements, and invokes Interact() on hit HazardObjects.",
    targetGameObject: "XR Origin (or active Scenario GameObject)",
    requiredComponents: [],
    inspectorFields: [
      { name: "interactionLayers", type: "LayerMask", description: "Layer mask for interactable safety objects (e.g., 'SafetyObjects' layer or 'Default').", required: true },
      { name: "maxRaycastDistance", type: "float", description: "Maximum interaction distance in AR meters (default: 10f).", required: false }
    ],
    code: `using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;
using SIH26041.AR.Training;

namespace SIH26041.AR.Interaction
{
    /// <summary>
    /// Raycasts into the 3D AR world from user screen taps to interact with
    /// hazardous equipment and worker PPE. Ignores touches on UI buttons.
    /// </summary>
    public class TrainingObjectInteraction : MonoBehaviour
    {
        [Header("Raycast Settings")]
        [Tooltip("Layers checked for hazard objects.")]
        [SerializeField] private LayerMask interactionLayers = ~0; // Default to all layers

        [SerializeField] private float maxRaycastDistance = 10f;

        private Camera _arCamera;

        private void Awake()
        {
            _arCamera = Camera.main;
            if (_arCamera == null)
            {
                Debug.LogError("[TrainingObjectInteraction] Main Camera not found.");
            }
        }

        private void Update()
        {
            if (TryGetScreenTap(out Vector2 screenPosition))
            {
                // CRITICAL: Block interaction if user tapped on HUD buttons or modals
                if (IsPointerOverUI(screenPosition))
                {
                    return;
                }

                PerformRaycast(screenPosition);
            }
        }

        private bool TryGetScreenTap(out Vector2 screenPosition)
        {
#if UNITY_EDITOR
            if (Input.GetMouseButtonDown(0))
            {
                screenPosition = Input.mousePosition;
                return true;
            }
#else
            if (Input.touchCount > 0)
            {
                Touch touch = Input.GetTouch(0);
                if (touch.phase == TouchPhase.Began)
                {
                    screenPosition = touch.position;
                    return true;
                }
            }
#endif
            screenPosition = default;
            return false;
        }

        private void PerformRaycast(Vector2 screenPosition)
        {
            if (_arCamera == null) return;

            Ray ray = _arCamera.ScreenPointToRay(screenPosition);
            if (Physics.Raycast(ray, out RaycastHit hit, maxRaycastDistance, interactionLayers))
            {
                // Check if hit object or its parent has HazardObject component
                HazardObject hazard = hit.collider.GetComponent<HazardObject>();
                if (hazard == null)
                {
                    hazard = hit.collider.GetComponentInParent<HazardObject>();
                }

                if (hazard != null)
                {
                    hazard.Interact();
                    Debug.Log($"[TrainingObjectInteraction] Tapped: {hazard.gameObject.name}");
                }
            }
        }

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
    id: "score-manager",
    step: 2,
    filename: "TrainingScoreManager.cs",
    className: "TrainingScoreManager",
    namespace: "SIH26041.AR.Training",
    summary: "Tracks trainee performance: current score, hazards found, hazards remaining, incorrect attempts, and dynamic maximum possible score.",
    targetGameObject: "ScenarioManager GameObject",
    requiredComponents: [],
    inspectorFields: [
      { name: "correctHazardPoints", type: "int", description: "Points for correctly identifying a hazard (+10).", required: true },
      { name: "incorrectAttemptPenalty", type: "int", description: "Penalty for false alarms / incorrect taps (-5).", required: true }
    ],
    code: `using System;
using UnityEngine;
using SIH26041.AR.Training.Data;

namespace SIH26041.AR.Training
{
    /// <summary>
    /// Computes and tracks trainee score, accuracy, and hazard progress.
    /// </summary>
    public class TrainingScoreManager : MonoBehaviour
    {
        [Header("Point Values")]
        [SerializeField] private int correctHazardPoints = 10;
        [SerializeField] private int incorrectAttemptPenalty = 5;

        private int _currentScore = 0;
        private int _totalHazards = 0;
        private int _hazardsFound = 0;
        private int _incorrectAttempts = 0;
        private int _maxPossibleScore = 0;

        public int CurrentScore => _currentScore;
        public int TotalHazards => _totalHazards;
        public int HazardsFound => _hazardsFound;
        public int HazardsRemaining => Mathf.Max(0, _totalHazards - _hazardsFound);
        public int IncorrectAttempts => _incorrectAttempts;
        public int MaxPossibleScore => _maxPossibleScore;

        public float CompletionPercentage => _totalHazards > 0 
            ? ((float)_hazardsFound / _totalHazards) * 100f 
            : 0f;

        public event Action<int, int, int> OnScoreUpdated; // (currentScore, hazardsFound, hazardsRemaining)

        public void Initialize(int totalConfiguredHazards)
        {
            _totalHazards = totalConfiguredHazards;
            _maxPossibleScore = _totalHazards * correctHazardPoints;
            _currentScore = 0;
            _hazardsFound = 0;
            _incorrectAttempts = 0;

            OnScoreUpdated?.Invoke(_currentScore, _hazardsFound, HazardsRemaining);
        }

        public void RegisterHazardFound(SafetyHazardData data)
        {
            int points = data != null ? data.ScoreImpact : correctHazardPoints;
            _currentScore += points;
            _hazardsFound++;

            OnScoreUpdated?.Invoke(_currentScore, _hazardsFound, HazardsRemaining);
        }

        public void RegisterIncorrectTap(SafetyHazardData data)
        {
            _currentScore = Mathf.Max(0, _currentScore - incorrectAttemptPenalty);
            _incorrectAttempts++;

            OnScoreUpdated?.Invoke(_currentScore, _hazardsFound, HazardsRemaining);
        }

        public void ResetScore()
        {
            _currentScore = 0;
            _hazardsFound = 0;
            _incorrectAttempts = 0;
            OnScoreUpdated?.Invoke(_currentScore, _hazardsFound, HazardsRemaining);
        }
    }
}`
  },
  {
    id: "scenario-manager",
    step: 2,
    filename: "SafetyScenarioManager.cs",
    className: "SafetyScenarioManager",
    namespace: "SIH26041.AR.Training",
    summary: "Coordinates the entire PPE & Hazard Identification session: registers all objects, handles interaction responses, and triggers the completion sequence.",
    targetGameObject: "ScenarioManager GameObject",
    requiredComponents: ["TrainingScoreManager"],
    inspectorFields: [
      { name: "scenarioTitle", type: "string", description: "Title: 'PPE & Industrial Hazard Identification'.", required: true },
      { name: "scoreManager", type: "TrainingScoreManager", description: "Reference to score manager.", required: true },
      { name: "uiManager", type: "TrainingUIManager", description: "Reference to UI manager.", required: true }
    ],
    code: `using System;
using System.Collections.Generic;
using UnityEngine;
using SIH26041.AR.Training.Data;

namespace SIH26041.AR.Training
{
    /// <summary>
    /// Master coordinator for SIH26041 vocational safety scenario.
    /// Tracks all hazard objects, handles interaction events, and detects scenario completion.
    /// </summary>
    [RequireComponent(typeof(TrainingScoreManager))]
    public class SafetyScenarioManager : MonoBehaviour
    {
        [Header("Scenario Info")]
        [SerializeField] private string scenarioTitle = "PPE & Industrial Hazard Identification";

        [Header("References")]
        [SerializeField] private TrainingScoreManager scoreManager;
        [SerializeField] private TrainingUIManager uiManager;

        private readonly List<HazardObject> _scenarioObjects = new List<HazardObject>();
        private bool _isCompleted = false;

        public string ScenarioTitle => scenarioTitle;
        public bool IsCompleted => _isCompleted;

        public event Action<HazardObject, bool> OnObjectEvaluated; // (object, wasHazard)
        public event Action OnScenarioCompleted;

        private void Awake()
        {
            if (scoreManager == null)
            {
                scoreManager = GetComponent<TrainingScoreManager>();
            }
        }

        private void Start()
        {
            DiscoverScenarioObjects();
        }

        private void OnEnable()
        {
            HazardObject.OnHazardObjectTapped += HandleObjectTapped;
        }

        private void OnDisable()
        {
            HazardObject.OnHazardObjectTapped -= HandleObjectTapped;
        }

        /// <summary>
        /// Finds all HazardObject instances in the scene or children.
        /// </summary>
        public void DiscoverScenarioObjects()
        {
            _scenarioObjects.Clear();
            HazardObject[] foundObjects = FindObjectsOfType<HazardObject>();
            _scenarioObjects.AddRange(foundObjects);

            int totalHazards = 0;
            foreach (var obj in _scenarioObjects)
            {
                if (obj.IsHazard)
                {
                    totalHazards++;
                }
            }

            scoreManager.Initialize(totalHazards);

            if (uiManager != null)
            {
                uiManager.UpdateScoreDisplay(scoreManager.CurrentScore, scoreManager.HazardsFound, scoreManager.HazardsRemaining);
            }

            Debug.Log($"[SafetyScenarioManager] Initialized '{scenarioTitle}' with {totalHazards} active hazards.");
        }

        private void HandleObjectTapped(HazardObject obj)
        {
            if (_isCompleted || obj == null || obj.Data == null) return;

            SafetyHazardData data = obj.Data;

            if (data.IsHazard)
            {
                // If it's a PPE object, equip compliant visual
                if (obj is PPEObject ppeObj)
                {
                    ppeObj.EquipCompliantPPE();
                }

                scoreManager.RegisterHazardFound(data);
                OnObjectEvaluated?.Invoke(obj, true);

                if (uiManager != null)
                {
                    uiManager.ShowHazardIdentifiedFeedback(data);
                }

                // Check completion condition
                if (scoreManager.HazardsRemaining == 0)
                {
                    CompleteScenario();
                }
            }
            else
            {
                // False alarm / non-hazard tapped
                scoreManager.RegisterIncorrectTap(data);
                OnObjectEvaluated?.Invoke(obj, false);

                if (uiManager != null)
                {
                    uiManager.ShowNonHazardFeedback(data);
                }
            }
        }

        private void CompleteScenario()
        {
            _isCompleted = true;
            Debug.Log("[SafetyScenarioManager] Training scenario completed successfully!");

            OnScenarioCompleted?.Invoke();

            if (uiManager != null)
            {
                uiManager.ShowCompletionSummary(
                    scoreManager.CurrentScore,
                    scoreManager.HazardsFound,
                    scoreManager.IncorrectAttempts,
                    scoreManager.CompletionPercentage
                );
            }
        }

        public void RestartScenario()
        {
            _isCompleted = false;

            foreach (var obj in _scenarioObjects)
            {
                if (obj != null)
                {
                    obj.ResetState();
                }
            }

            scoreManager.ResetScore();
            DiscoverScenarioObjects();

            if (uiManager != null)
            {
                uiManager.HideCompletionSummary();
            }
        }
    }
}`
  },
  {
    id: "training-ui-manager",
    step: 2,
    filename: "TrainingUIManager.cs",
    className: "TrainingUIManager",
    namespace: "SIH26041.AR.UI",
    summary: "Drives all Step 2 mobile HUD elements: live score, hazards remaining, slide-up educational feedback modal, and completion summary screen.",
    targetGameObject: "Canvas_AR_HUD (or child Panel_TrainingScenarioUI)",
    requiredComponents: [],
    inspectorFields: [
      { name: "scenarioTitleText", type: "TextMeshProUGUI", description: "Top scenario title label.", required: true },
      { name: "scoreText", type: "TextMeshProUGUI", description: "Score counter label (e.g. 'Score: 30').", required: true },
      { name: "progressText", type: "TextMeshProUGUI", description: "Progress label (e.g. 'Hazards: 3 / 4').", required: true },
      { name: "feedbackPanel", type: "GameObject", description: "Slide-up bottom card showing educational explanations.", required: true },
      { name: "feedbackStatusText", type: "TextMeshProUGUI", description: "'HAZARD IDENTIFIED' or 'NOT A HAZARD'.", required: true },
      { name: "feedbackTitleText", type: "TextMeshProUGUI", description: "Hazard name.", required: true },
      { name: "feedbackExplanationText", type: "TextMeshProUGUI", description: "Why it is dangerous & regulatory standard.", required: true },
      { name: "completionModal", type: "GameObject", description: "Full-screen modal shown upon scenario completion.", required: true },
      { name: "finalScoreText", type: "TextMeshProUGUI", description: "Final score on completion modal.", required: true },
      { name: "restartButton", type: "Button", description: "Restart scenario button.", required: true }
    ],
    code: `using System.Collections;
using TMPro;
using UnityEngine;
using UnityEngine.UI;
using SIH26041.AR.Training;
using SIH26041.AR.Training.Data;

namespace SIH26041.AR.UI
{
    /// <summary>
    /// Handles in-training HUD, educational feedback cards, and completion dialogs
    /// for Step 2 PPE & Hazard Identification scenario.
    /// </summary>
    public class TrainingUIManager : MonoBehaviour
    {
        [Header("Header Bar")]
        [SerializeField] private TextMeshProUGUI scenarioTitleText;
        [SerializeField] private TextMeshProUGUI scoreText;
        [SerializeField] private TextMeshProUGUI progressText;

        [Header("Feedback Bottom Card")]
        [SerializeField] private GameObject feedbackPanel;
        [SerializeField] private TextMeshProUGUI feedbackStatusText;
        [SerializeField] private TextMeshProUGUI feedbackTitleText;
        [SerializeField] private TextMeshProUGUI feedbackExplanationText;
        [SerializeField] private TextMeshProUGUI feedbackStandardText;
        [SerializeField] private TextMeshProUGUI scoreChangeBadgeText;

        [Header("Completion Dialog")]
        [SerializeField] private GameObject completionModal;
        [SerializeField] private TextMeshProUGUI finalScoreText;
        [SerializeField] private TextMeshProUGUI correctCountText;
        [SerializeField] private TextMeshProUGUI incorrectCountText;
        [SerializeField] private TextMeshProUGUI accuracyPercentText;
        [SerializeField] private TextMeshProUGUI recommendationText;
        [SerializeField] private Button restartButton;

        [Header("Manager Reference")]
        [SerializeField] private SafetyScenarioManager scenarioManager;

        private Coroutine _hideFeedbackRoutine;

        private void Awake()
        {
            if (feedbackPanel != null) feedbackPanel.SetActive(false);
            if (completionModal != null) completionModal.SetActive(false);

            if (restartButton != null)
            {
                restartButton.onClick.AddListener(OnRestartClicked);
            }
        }

        public void UpdateScoreDisplay(int currentScore, int found, int remaining)
        {
            if (scoreText != null)
            {
                scoreText.text = $"Score: <color=#F59E0B>{currentScore}</color>";
            }

            if (progressText != null)
            {
                progressText.text = $"Hazards: <color=#10B981>{found}</color> / {found + remaining} ({remaining} Left)";
            }
        }

        public void ShowHazardIdentifiedFeedback(SafetyHazardData data)
        {
            if (feedbackPanel == null || data == null) return;

            feedbackPanel.SetActive(true);

            if (feedbackStatusText != null)
            {
                feedbackStatusText.text = "✓ HAZARD IDENTIFIED";
                feedbackStatusText.color = new Color(0.1f, 0.85f, 0.4f);
            }

            if (feedbackTitleText != null)
            {
                feedbackTitleText.text = data.HazardTitle;
            }

            if (feedbackExplanationText != null)
            {
                feedbackExplanationText.text = data.DangerExplanation;
            }

            if (feedbackStandardText != null)
            {
                feedbackStandardText.text = $"Standard: {data.RegulatoryStandard}";
            }

            if (scoreChangeBadgeText != null)
            {
                scoreChangeBadgeText.text = $"+{data.ScoreImpact} PTS";
                scoreChangeBadgeText.color = new Color(0.1f, 0.85f, 0.4f);
            }

            RestartFeedbackTimer(6f);
        }

        public void ShowNonHazardFeedback(SafetyHazardData data)
        {
            if (feedbackPanel == null || data == null) return;

            feedbackPanel.SetActive(true);

            if (feedbackStatusText != null)
            {
                feedbackStatusText.text = "⚠ THIS IS NOT A HAZARD";
                feedbackStatusText.color = new Color(0.95f, 0.7f, 0.1f);
            }

            if (feedbackTitleText != null)
            {
                feedbackTitleText.text = data.HazardTitle;
            }

            if (feedbackExplanationText != null)
            {
                feedbackExplanationText.text = data.DangerExplanation;
            }

            if (feedbackStandardText != null)
            {
                feedbackStandardText.text = $"Standard: {data.RegulatoryStandard}";
            }

            if (scoreChangeBadgeText != null)
            {
                scoreChangeBadgeText.text = $"{data.ScoreImpact} PTS";
                scoreChangeBadgeText.color = new Color(0.95f, 0.3f, 0.3f);
            }

            RestartFeedbackTimer(4f);
        }

        public void ShowCompletionSummary(int finalScore, int correct, int incorrect, float accuracy)
        {
            if (completionModal == null) return;

            if (feedbackPanel != null) feedbackPanel.SetActive(false);
            completionModal.SetActive(true);

            if (finalScoreText != null) finalScoreText.text = $"{finalScore}";
            if (correctCountText != null) correctCountText.text = $"{correct}";
            if (incorrectCountText != null) incorrectCountText.text = $"{incorrect}";
            if (accuracyPercentText != null) accuracyPercentText.text = $"{Mathf.RoundToInt(accuracy)}%";

            if (recommendationText != null)
            {
                recommendationText.text = "Always conduct 360-degree PPE & hazard inspections prior to entering active manufacturing conveyor lines or mining pits per DGMS Safety Circulars.";
            }
        }

        public void HideCompletionSummary()
        {
            if (completionModal != null) completionModal.SetActive(false);
        }

        private void RestartFeedbackTimer(float duration)
        {
            if (_hideFeedbackRoutine != null)
            {
                StopCoroutine(_hideFeedbackRoutine);
            }
            _hideFeedbackRoutine = StartCoroutine(HideFeedbackAfterDelay(duration));
        }

        private IEnumerator HideFeedbackAfterDelay(float delay)
        {
            yield return new WaitForSeconds(delay);
            if (feedbackPanel != null)
            {
                feedbackPanel.SetActive(false);
            }
        }

        private void OnRestartClicked()
        {
            if (scenarioManager != null)
            {
                scenarioManager.RestartScenario();
            }
        }
    }
}`
  }
];

export const STEP_2_CHECKLIST: ChecklistItem[] = [
  {
    id: "chk2-1",
    category: "Data Architecture",
    title: "SafetyHazardData ScriptableObject Created",
    description: "Configured hazard assets for Missing Helmet, Missing Vest, Exposed 440V Cable, Unsafe Barrier, and Compliant Safety Shoes.",
    completed: false
  },
  {
    id: "chk2-2",
    category: "Scene & Object Setup",
    title: "Modular Safety Scenario Prefab Assembled",
    description: "Worker avatar, electrical cable, warning signs, and barrier placed with Colliders and HazardObject components.",
    completed: false
  },
  {
    id: "chk2-3",
    category: "Interaction & Raycasting",
    title: "TrainingObjectInteraction Script Attached",
    description: "Touch raycasting works in AR; UI clicks properly filtered without triggering background 3D object taps.",
    completed: false
  },
  {
    id: "chk2-4",
    category: "PPE Mechanics",
    title: "PPEObject Auto-Equip Verified",
    description: "Worker avatar visually equips compliant hard hat and reflective jacket once trainee identifies the violation.",
    completed: false
  },
  {
    id: "chk2-5",
    category: "Scoring Engine",
    title: "TrainingScoreManager Dynamically Calculating Score",
    description: "Correct hazard awards +10, false alarms deduct -5, hazards remaining and percentage update in real time.",
    completed: false
  },
  {
    id: "chk2-6",
    category: "Educational HUD",
    title: "Feedback Card & Instructions Integrated",
    description: "Slide-up card shows DGMS/IS regulatory standard, danger explanation, and title upon tapping any object.",
    completed: false
  },
  {
    id: "chk2-7",
    category: "Scenario Completion",
    title: "Completion Dialog & Restart Tested",
    description: "When all hazards found, dialog shows Final Score, Correct/Incorrect count, safety recommendation, and resets properly.",
    completed: false
  }
];
