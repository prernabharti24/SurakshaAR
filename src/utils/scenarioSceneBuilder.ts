import * as THREE from 'three';
import { HazardScenarioItem, GeminiSafetyAnalysis, SupportedLanguage } from '../types';
import { buildRealisticGasProcessingFacility, updateGasFacilityAnimations } from './gasFacilityBuilder';

export { updateGasFacilityAnimations };

export interface VisualReferences {
  // Scenario 1: PPE & Workshop
  workerHelmetMesh?: THREE.Mesh;
  workerVestMesh?: THREE.Mesh;
  wireSparksRef?: THREE.Points;
  wireLockoutMesh?: THREE.Mesh;
  barrierFixedMesh?: THREE.Mesh;
  blockedDoorObstacles?: THREE.Group;

  // Scenario 2 / 3: Fire
  fireFlameParticles?: THREE.Points;
  fireFoamMesh?: THREE.Mesh;
  fireExitDoorMesh?: THREE.Mesh;
  fireObstacleCrates?: THREE.Group;
  fireAlarmBoxMesh?: THREE.Mesh;
  fireWorkerGroup?: THREE.Group;
  fireLightRef?: THREE.PointLight;

  // Scenario 2 / 3: Electrical
  elecConduitSparks?: THREE.Points;
  elecLotoTagMesh?: THREE.Mesh;
  elecRubberMatMesh?: THREE.Mesh;
  elecGlovesMesh?: THREE.Mesh;
  elecClearSignMesh?: THREE.Mesh;

  // Scenario 4: Mining
  mineDumperGroup?: THREE.Group;
  minePedestrianWorker?: THREE.Group;
  mineRefugeBayMesh?: THREE.Mesh;
  mineRoofCracksMesh?: THREE.Mesh;
  mineRoofPropMesh?: THREE.Mesh;
  mineMinerCapLampMesh?: THREE.Mesh;
  mineDangerGateMesh?: THREE.Mesh;

  // Scenario 5: Machinery
  machRollersGroup?: THREE.Group;
  machWireMeshGuard?: THREE.Mesh;
  machEstopButton?: THREE.Mesh;
  machOperatorSleeve?: THREE.Mesh;
  machPerimeterStripe?: THREE.Mesh;

  // Scenario 6 / Primary: Gas Leakage & Industrial Animated Facility
  gasLeakParticles?: THREE.Points;
  gasFlangeMesh?: THREE.Mesh;
  gasValveHandwheel?: THREE.Mesh;
  gasAlarmStrobeLight?: THREE.PointLight;
  gasAlarmStrobeBeacon?: THREE.Group;
  gasAlarmPullLever?: THREE.Mesh;
  gasVentilationFans?: THREE.Group[];
  gasGaugeNeedle?: THREE.Mesh;
  gasBlockedExitCrates?: THREE.Group;
  gasWorkerRespirator?: THREE.Mesh;
  gasEvacSignLight?: THREE.PointLight;
  gasEvacPathFloorMesh?: THREE.Mesh;
  gasManifoldPipe?: THREE.Group;
  gasCompressorFlywheel?: THREE.Mesh;
  gasCompressorPiston?: THREE.Mesh;
  gasSteamParticles?: THREE.Points;
}

// 5 Core Scenario Items with Hazards & Safe Distractors
export const SCENARIO_ITEMS_MAP: Record<string, HazardScenarioItem[]> = {
  'scenario-1-ppe': [
    {
      id: 'worker-helmet',
      name: 'Worker Head (Missing Helmet)',
      category: 'ppe',
      isHazard: true,
      title: 'Missing Safety Helmet (Hard Hat)',
      explanation: 'Trainee entering active industrial fabrication shop floor without approved head protection. High danger of traumatic head injury from falling tools or overhead crane loads.',
      recommendation: 'Equip certified IS 2925 industrial hard hat with fastened 3-point chin strap before crossing safety boundary.',
      scoreImpact: 10
    },
    {
      id: 'worker-vest',
      name: 'Worker Torso (Missing Safety Vest)',
      category: 'ppe',
      isHazard: true,
      title: 'Missing High-Visibility Reflective Vest',
      explanation: 'Worker wearing dark work clothing without retro-reflective bands in active machinery transit aisle.',
      recommendation: 'Don IS 15809 Class 2 fluorescent orange vest with minimum 50mm wide retro-reflective bands for 360° visibility.',
      scoreImpact: 10
    },
    {
      id: 'exposed-wire',
      name: 'Live Exposed 440V Power Cable',
      category: 'hazard',
      isHazard: true,
      title: 'Exposed 440V Live Feeder Cable',
      explanation: 'Live 3-phase power cable with severed rubber insulation lying exposed on shop floor with active sparking fault potential.',
      recommendation: 'Enforce Lockout/Tagout (LOTO) per CEA Regulations 2010; isolate upstream breaker and route cable inside grounded steel conduit.',
      scoreImpact: 10
    },
    {
      id: 'unsafe-barrier',
      name: 'Blocked Emergency Exit Route',
      category: 'hazard',
      isHazard: true,
      title: 'Obstructed Emergency Egress Path',
      explanation: 'Wooden cargo pallets and 200L chemical drums are stacked directly in front of statutory fire exit door, blocking rapid escape.',
      recommendation: 'Clear all cargo pallets and drums immediately; maintain minimum 1.5m unblocked egress corridor per Indian Factories Act.',
      scoreImpact: 10
    },
    {
      id: 'warning-sign',
      name: 'Compliant Warning Signpost',
      category: 'safe',
      isHazard: false,
      title: 'Standard Hazard Warning Sign (Compliant)',
      explanation: 'This is NOT a hazard! The caution placard is correctly installed at eye level alerting workers to workplace hazards.',
      recommendation: 'Good observation. Signage is a compliant statutory alert. Avoid reporting safe controls.',
      scoreImpact: -5
    },
    {
      id: 'safety-shoes',
      name: 'Worker Safety Footwear',
      category: 'safe',
      isHazard: false,
      title: 'IS 15298 Steel-Toe Safety Boots (Compliant)',
      explanation: 'Worker is already wearing approved 200J impact-resistant steel-toe boots with oil-resistant non-slip outsoles.',
      recommendation: 'Compliant personal protective equipment. No corrective action required.',
      scoreImpact: -5
    }
  ],

  'scenario-2-fire': [
    {
      id: 'fire-active-blaze',
      name: 'Active Machinery Fire & Smoke',
      category: 'hazard',
      isHazard: true,
      title: 'Uncontrolled Class B/C Machinery Fire',
      explanation: 'Electrical motor overheat has ignited industrial lubricant resulting in open flames and toxic smoke plume.',
      recommendation: 'Sound plant emergency alarm, isolate power supply, and extinguish with IS 15683 certified DCP/CO2 fire extinguisher using P.A.S.S.',
      scoreImpact: 10
    },
    {
      id: 'fire-blocked-exit',
      name: 'Obstructed Fire Exit Door',
      category: 'hazard',
      isHazard: true,
      title: 'Blocked Emergency Fire Exit Door',
      explanation: 'Heavy industrial shipping crates and oil drums are blocking the outward-opening emergency fire exit doors.',
      recommendation: 'Clear obstacles immediately, unlatch exit push bar, and verify illuminated running-man egress sign is visible.',
      scoreImpact: 10
    },
    {
      id: 'fire-alarm-pull',
      name: 'Unactivated Manual Call Point (MCP)',
      category: 'hazard',
      isHazard: true,
      title: 'Emergency Alarm Not Triggered',
      explanation: 'Fire is spreading but the wall-mounted break-glass manual alarm call point has not been activated to alert plant personnel.',
      recommendation: 'Break glass and depress manual fire alarm call point immediately to trigger plant-wide sirens and exhaust ventilation.',
      scoreImpact: 10
    },
    {
      id: 'fire-worker-evac',
      name: 'Trainee in Smoke Plume Zone',
      category: 'hazard',
      isHazard: true,
      title: 'Worker Disoriented in Smoke Zone',
      explanation: 'Worker is standing upright inside the toxic smoke plume without guiding toward designated egress path.',
      recommendation: 'Crouch below toxic smoke ceiling and follow photoluminescent green floor route to external muster point.',
      scoreImpact: 10
    },
    {
      id: 'fire-dcp-extinguisher',
      name: '6kg DCP Fire Extinguisher',
      category: 'safe',
      isHazard: false,
      title: 'IS 15683 Dry Chemical Powder Extinguisher (Compliant)',
      explanation: 'Certified, charged 6kg ABC dry powder extinguisher in accessible wall bracket with green pressure needle.',
      recommendation: 'Compliant first-aid firefighting device ready for immediate deployment.',
      scoreImpact: -5
    }
  ],

  'scenario-3-fire': [], // Populated by alias

  'scenario-2-electrical': [
    {
      id: 'elec-exposed-cable',
      name: 'Live Exposed 440V Cable',
      category: 'hazard',
      isHazard: true,
      title: 'Live Exposed 440V Cable',
      explanation: 'Severed outer sheath exposing live 440V conductors near concrete floor with visible electrical fault arcing.',
      recommendation: 'Implement Lockout/Tagout (LOTO) per CEA Regulation 30; trip upstream breaker and verify zero energy before handling.',
      scoreImpact: 10
    },
    {
      id: 'elec-wet-floor',
      name: 'Water Puddle in Front of 11kV Switchgear',
      category: 'hazard',
      isHazard: true,
      title: 'Conductive Water Puddle in Switchgear Bay',
      explanation: 'Puddle of water directly in front of high-voltage switchgear drastically increases shock & step-potential electrocution risk.',
      recommendation: 'Barricade area, isolate moisture source, dry floor, and deploy IS 15652 dielectric insulating rubber mats.',
      scoreImpact: 10
    },
    {
      id: 'elec-missing-gloves',
      name: 'Technician Operating Barehanded',
      category: 'hazard',
      isHazard: true,
      title: 'Missing High-Voltage Dielectric Gloves',
      explanation: 'Technician inspecting high-voltage terminals without IS 4770 certified 1000V insulating electrical gloves.',
      recommendation: 'Equip certified IS 4770 Class 0 dielectric rubber insulating gloves with leather protector gloves.',
      scoreImpact: 10
    },
    {
      id: 'elec-blocked-sign',
      name: 'Obstructed 440V Statutory Danger Signboard',
      category: 'hazard',
      isHazard: true,
      title: 'Covered High-Voltage Danger Sign (IS 2551)',
      explanation: 'Statutory 440V Danger signboard with skull and crossbones is blocked by leaning storage crates.',
      recommendation: 'Remove obstructing crates immediately so warning signs are visible from all room approaches.',
      scoreImpact: 10
    },
    {
      id: 'elec-copper-earth',
      name: 'Copper Earthing Grounding Bar',
      category: 'safe',
      isHazard: false,
      title: 'Solid Copper Grounding Busbar (Compliant)',
      explanation: 'Solid copper earthing busbar properly bonded to grounding grid per IS 3043 grounding code.',
      recommendation: 'Compliant safety grounding infrastructure. Do not report as hazard.',
      scoreImpact: -5
    }
  ],

  'scenario-3-electrical': [], // Populated by alias

  'scenario-4-mining': [
    {
      id: 'mine-haulage-blindspot',
      name: 'Miner in 35-Ton Dumper Blind Spot',
      category: 'hazard',
      isHazard: true,
      title: 'Worker Standing in Heavy Vehicle Blind Spot',
      explanation: 'Miner standing in rear blindspot of 35-ton mining haul truck. High risk of fatal crush injury per DGMS circulars.',
      recommendation: 'Establish eye contact with operator, maintain 15m safety distance, and follow marked pedestrian refuge escapeway.',
      scoreImpact: 10
    },
    {
      id: 'mine-unstable-roof',
      name: 'Fractured Hanging Wall (Roof Fall Danger)',
      category: 'hazard',
      isHazard: true,
      title: 'Unstable Fractured Tunnel Roof Strata',
      explanation: 'Prominent tensile fractures and loose hanging rock slabs without adequate support props in underground gallery.',
      recommendation: 'Sound testing per CMR 2017; withdraw personnel and erect mechanical friction props / roof bolts before re-entry.',
      scoreImpact: 10
    },
    {
      id: 'mine-no-caplamp',
      name: 'Miner Missing Approved Cap Lamp & Helmet',
      category: 'hazard',
      isHazard: true,
      title: 'Missing DGMS-Approved Cordless Cap Lamp',
      explanation: 'Miner in underground development face without approved intrinsic safety cap lamp and mining hard hat.',
      recommendation: 'Equip DGMS-certified IS cap lamp with high-luminance LED beam and approved mining hard hat.',
      scoreImpact: 10
    },
    {
      id: 'mine-missing-sign',
      name: 'Unfenced Dangerous Goaf Area',
      category: 'hazard',
      isHazard: true,
      title: 'Unfenced Goaf / Abandoned Working',
      explanation: 'Entrance to abandoned underground working lacks statutory danger fencing and methane gas warning.',
      recommendation: 'Install statutory DGMS warning placard and lockable wire-mesh danger barrier across opening.',
      scoreImpact: 10
    },
    {
      id: 'mine-vent-tube',
      name: 'Flexible Ventilation Ducting',
      category: 'safe',
      isHazard: false,
      title: 'Auxiliary Forced Air Ventilation Duct (Compliant)',
      explanation: 'Forced air duct providing positive fresh air velocity across face per Coal Mines Regulations.',
      recommendation: 'Essential life safety ventilation equipment. Compliant.',
      scoreImpact: -5
    }
  ],

  'scenario-5-machinery': [
    {
      id: 'mach-missing-guard',
      name: 'Unguarded Conveyor Nip/Pinch Point',
      category: 'hazard',
      isHazard: true,
      title: 'In-Running Nip Point Without Safety Guard',
      explanation: 'In-running pinch point between conveyor belt and head drive roller lacks fixed interlocked wire-mesh machine guard per IS 9474.',
      recommendation: 'Install certified heavy-gauge wire mesh nip guard with interlocked safety limit switch.',
      scoreImpact: 10
    },
    {
      id: 'mach-estop-unhit',
      name: 'Unhit Emergency-Stop Button on Pedestal',
      category: 'hazard',
      isHazard: true,
      title: 'Emergency Stop (E-Stop) Not Activated',
      explanation: 'Conveyor drive roller is jammed with maintenance rag, but operator has not pressed the red mushroom emergency stop.',
      recommendation: 'Depress red mushroom head Emergency-Stop switch immediately to mechanically lock open power circuits.',
      scoreImpact: 10
    },
    {
      id: 'mach-loose-clothing',
      name: 'Operator with Loose Unbuttoned Sleeves',
      category: 'hazard',
      isHazard: true,
      title: 'Loose Work Clothing Near Rotating Shaft',
      explanation: 'Technician standing near rotating mechanical drive shaft with loose, dangling sleeves presenting severe entanglement hazard.',
      recommendation: 'Tuck in clothing, fasten buttoned cuffs tightly, and tie back long hair before approaching rotating machinery.',
      scoreImpact: 10
    },
    {
      id: 'mach-missing-perimeter',
      name: 'Missing Machine Hazard Demarcation',
      category: 'hazard',
      isHazard: true,
      title: 'Absence of Floor Caution Chevron Boundary',
      explanation: 'No marked 1m yellow/black safety exclusion zone around rotating conveyor drive assembly.',
      recommendation: 'Apply high-durability yellow-and-black 45° diagonal chevron epoxy line marking around machine perimeter.',
      scoreImpact: 10
    },
    {
      id: 'mach-eyewash',
      name: 'Emergency Eyewash & Safety Shower',
      category: 'safe',
      isHazard: false,
      title: 'IS 10592 Compliant Emergency Eyewash Station',
      explanation: 'Certified plum emergency eyewash unit with tepid potable water supply and push flag activator.',
      recommendation: 'Compliant statutory first-aid decontamination facility.',
      scoreImpact: -5
    }
  ],

  'scenario-gas-leak': [
    {
      id: 'gas-valve-leak',
      name: 'Pressurized Pipe Flange & Valve Leak',
      category: 'hazard',
      isHazard: true,
      title: 'High-Pressure Gas Flange Joint Rupture',
      explanation: 'A high-pressure seal flange on the primary hydrocarbon manifold has breached, violently jetting volatile flammable/toxic vapor with an audible hissing plume and pressure loss.',
      recommendation: 'Sound immediate plant emergency alarm, initiate remote emergency shutdown (ESD), isolate manual shutoff valve, and enforce a 50-meter perimeter cordon.',
      scoreImpact: 15
    },
    {
      id: 'gas-elec-panel',
      name: 'Open 440V Electrical Panel in Vapor Zone',
      category: 'hazard',
      isHazard: true,
      title: 'Live Electrical Switchgear Near Gas Envelope',
      explanation: 'An open 440V electrical control panel sits within the flammable vapor dispersion zone. Contact sparking from breakers or contactors will trigger catastrophic deflagration.',
      recommendation: 'Perform remote electrical de-energization outside hazardous gas envelope per IS/IEC 60079; prohibit manual breaker switching within vapor radius.',
      scoreImpact: 15
    },
    {
      id: 'gas-worker-ppe',
      name: 'Technician Breathing Toxic Vapor Without Respirator',
      category: 'ppe',
      isHazard: true,
      title: 'Worker Without Chemical Gas Respirator / SCBA',
      explanation: 'Process worker inside active leak boundary lacks IS 9473 / EN 14387 certified toxic chemical cartridge respirator or Self-Contained Breathing Apparatus (SCBA).',
      recommendation: 'Don certified IS 9473 multi-gas respirator or SCBA immediately and guide worker upwind to designated medical/assembly zone.',
      scoreImpact: 10
    },
    {
      id: 'gas-blocked-exit',
      name: 'Obstructed Emergency Egress Route',
      category: 'hazard',
      isHazard: true,
      title: 'Chemical Drums & Pallets Blocking Emergency Exit',
      explanation: 'Wooden cargo pallets and 200L chemical drums stacked directly in front of the illuminated emergency fire and gas escape door, preventing rapid facility evacuation.',
      recommendation: 'Clear all cargo obstructions immediately; unlatch emergency panic push-bar to maintain minimum 2-meter unobstructed escape corridor per Indian Factories Act Section 38.',
      scoreImpact: 10
    },
    {
      id: 'gas-alarm-box',
      name: 'Break-Glass Emergency Gas Alarm Station',
      category: 'safe',
      isHazard: false,
      title: 'Emergency Alarm Manual Call Point (Actionable Control)',
      explanation: 'Statutory emergency break-glass call point with high-decibel warble siren and rotating xenon beacon light.',
      recommendation: 'Actuate manual call point immediately upon uncontained gas release to warn plant occupants and trigger HazMat dispatch.',
      scoreImpact: 0
    },
    {
      id: 'gas-vent-fan',
      name: 'Explosion-Proof Emergency Exhaust Blower',
      category: 'safe',
      isHazard: false,
      title: 'Emergency Exhaust Ventilation System (Actionable Control)',
      explanation: 'Flameproof centrifugal exhaust blower system designed to rapidly extract combustible vapors to external scrubber stack.',
      recommendation: 'Activate high-velocity emergency exhaust to dilute volatile vapor concentration well below Lower Explosive Limit (LEL).',
      scoreImpact: 0
    },
    {
      id: 'gas-ppe-station',
      name: 'PPE Safety Station Locker',
      category: 'safe',
      isHazard: false,
      title: 'Certified Chemical PPE & SCBA Station (Compliant)',
      explanation: 'Standard emergency PPE cabinet stocked with IS 9473 chemical respirators, hard hats, safety goggles, and SCBA apparatus.',
      recommendation: 'Essential safety station. Access clear and operational.',
      scoreImpact: 0
    }
  ]
};

// Aliases
SCENARIO_ITEMS_MAP['scenario-2-fire'] = SCENARIO_ITEMS_MAP['scenario-2-fire'];
SCENARIO_ITEMS_MAP['scenario-3-fire'] = SCENARIO_ITEMS_MAP['scenario-2-fire'];
SCENARIO_ITEMS_MAP['scenario-3-electrical'] = SCENARIO_ITEMS_MAP['scenario-2-electrical'];

export function getScenarioItems(scenarioId: string): HazardScenarioItem[] {
  if (scenarioId === 'scenario-gas-leak') {
    return SCENARIO_ITEMS_MAP['scenario-gas-leak'];
  }
  if (scenarioId === 'scenario-2-fire' || scenarioId === 'scenario-3-fire') {
    return SCENARIO_ITEMS_MAP['scenario-2-fire'];
  }
  if (scenarioId === 'scenario-2-electrical' || scenarioId === 'scenario-3-electrical') {
    return SCENARIO_ITEMS_MAP['scenario-2-electrical'];
  }
  return SCENARIO_ITEMS_MAP[scenarioId] || SCENARIO_ITEMS_MAP['scenario-gas-leak'] || SCENARIO_ITEMS_MAP['scenario-1-ppe'];
}

// 3D Anchor positions for placing subtle AR reticles in the 3D scene
export function getHazardAnchorPositions(scenarioId: string): Record<string, THREE.Vector3> {
  const normId =
    scenarioId === 'scenario-2-fire' || scenarioId === 'scenario-3-fire'
      ? 'scenario-2-fire'
      : scenarioId === 'scenario-3-electrical'
      ? 'scenario-2-electrical'
      : scenarioId;

  switch (normId) {
    case 'scenario-gas-leak':
      return {
        'gas-valve-leak': new THREE.Vector3(1.6, 1.4, -2.8),
        'gas-elec-panel': new THREE.Vector3(-2.8, 1.3, -3.2),
        'gas-worker-ppe': new THREE.Vector3(0.5, 1.1, -1.0),
        'gas-blocked-exit': new THREE.Vector3(3.8, 0.8, 1.5),
        'gas-alarm-box': new THREE.Vector3(-3.8, 1.5, 0.0),
        'gas-vent-fan': new THREE.Vector3(0.0, 3.2, -4.2),
        'gas-ppe-station': new THREE.Vector3(-3.8, 1.2, 2.5)
      };
    case 'scenario-1-ppe':
      return {
        'worker-helmet': new THREE.Vector3(-0.6, 1.6, -0.2),
        'worker-vest': new THREE.Vector3(-0.6, 1.0, -0.2),
        'exposed-wire': new THREE.Vector3(0.4, 0.25, 0.4),
        'unsafe-barrier': new THREE.Vector3(1.4, 1.3, -1.6)
      };
    case 'scenario-2-fire':
      return {
        'fire-active-blaze': new THREE.Vector3(0.0, 0.9, 0.0),
        'fire-blocked-exit': new THREE.Vector3(1.5, 1.2, -4.0),
        'fire-alarm-pull': new THREE.Vector3(-1.8, 1.4, -0.2),
        'fire-worker-evac': new THREE.Vector3(0.2, 1.2, 0.3),
        'fire-dcp-extinguisher': new THREE.Vector3(-1.8, 1.2, -4.3)
      };
    case 'scenario-2-electrical':
      return {
        'elec-exposed-cable': new THREE.Vector3(0.6, 0.35, -0.3),
        'elec-wet-floor': new THREE.Vector3(-0.4, 0.15, 0.2),
        'elec-missing-gloves': new THREE.Vector3(-0.4, 1.2, -0.4),
        'elec-blocked-sign': new THREE.Vector3(0.0, 1.7, -1.3)
      };
    case 'scenario-4-mining':
      return {
        'mine-haulage-blindspot': new THREE.Vector3(0.8, 1.1, 0.5),
        'mine-unstable-roof': new THREE.Vector3(-0.5, 2.3, -0.4),
        'mine-no-caplamp': new THREE.Vector3(-1.1, 1.3, 0.2),
        'mine-missing-sign': new THREE.Vector3(1.5, 1.2, -1.2)
      };
    case 'scenario-5-machinery':
      return {
        'mach-missing-guard': new THREE.Vector3(0.0, 1.0, -0.3),
        'mach-estop-unhit': new THREE.Vector3(0.9, 1.0, -0.1),
        'mach-loose-clothing': new THREE.Vector3(-0.8, 1.2, 0.3),
        'mach-missing-perimeter': new THREE.Vector3(0.0, 0.15, 0.6)
      };
    default:
      return {};
  }
}

// Utility: Tag an object and all its submeshes recursively for reliable raycasting
function tagInteractable(
  object: THREE.Object3D,
  hazardId: string,
  interactables: Record<string, THREE.Object3D>
) {
  object.traverse((child) => {
    child.userData = { ...child.userData, hazardId };
    if ((child as THREE.Mesh).isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  interactables[hazardId] = object;
}

// =========================================================================
// ARCHITECTURAL INDUSTRIAL SHELL (COMMON FOR WORKSHOP, FIRE, ELECTRICAL, MACHINERY)
// =========================================================================
function buildRealisticIndustrialHall(scene: THREE.Group, theme: 'workshop' | 'electrical' | 'fire' | 'machinery') {
  const hall = new THREE.Group();

  // 1. Concrete Factory Floor (Wide 16x16m)
  const floorGeo = new THREE.PlaneGeometry(16, 16);
  const floorMat = new THREE.MeshStandardMaterial({
    color: theme === 'electrical' ? 0x1e293b : theme === 'fire' ? 0x1a202c : 0x222a38,
    roughness: 0.7,
    metalness: 0.2
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  hall.add(floor);

  // Concrete expansion joint grid lines
  const grid = new THREE.GridHelper(16, 16, 0x475569, 0x334155);
  grid.position.y = 0.002;
  hall.add(grid);

  // Main High-Visibility Forklift & Pedestrian Walkway (Yellow/Black chevron boundary)
  const walkwayGeo = new THREE.PlaneGeometry(2.4, 14);
  const walkwayMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.8
  });
  const walkway = new THREE.Mesh(walkwayGeo, walkwayMat);
  walkway.rotation.x = -Math.PI / 2;
  walkway.position.set(0, 0.004, 0);
  walkway.receiveShadow = true;
  hall.add(walkway);

  // Walkway yellow borders
  for (const side of [-1.2, 1.2]) {
    const border = new THREE.Mesh(
      new THREE.PlaneGeometry(0.12, 14),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.5 })
    );
    border.rotation.x = -Math.PI / 2;
    border.position.set(side, 0.006, 0);
    hall.add(border);
  }

  // 2. High Industrial Enclosure Walls (Back, Left, Right)
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0x2d3748,
    roughness: 0.85,
    metalness: 0.15
  });

  const wainscotMat = new THREE.MeshStandardMaterial({
    color: 0x1a202c,
    roughness: 0.9
  });

  // Back Wall (16m wide, 5.2m high)
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(16, 5.2, 0.3), wallMat);
  backWall.position.set(0, 2.6, -4.5);
  backWall.receiveShadow = true;
  hall.add(backWall);

  // Back Wall Lower Wainscoting
  const backWainscot = new THREE.Mesh(new THREE.BoxGeometry(16, 1.2, 0.32), wainscotMat);
  backWainscot.position.set(0, 0.6, -4.49);
  hall.add(backWainscot);

  // Left Wall
  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 5.2, 14), wallMat);
  leftWall.position.set(-4.5, 2.6, 1.0);
  leftWall.receiveShadow = true;
  hall.add(leftWall);

  // Right Wall
  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 5.2, 14), wallMat);
  rightWall.position.set(4.5, 2.6, 1.0);
  rightWall.receiveShadow = true;
  hall.add(rightWall);

  // 3. Structural Steel Columns (I-Beams) along walls
  const colMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8, roughness: 0.3 });
  const columnPositions = [
    [-4.3, -4.3],
    [4.3, -4.3],
    [-4.3, 0],
    [4.3, 0],
    [-4.3, 3.5],
    [4.3, 3.5]
  ];
  columnPositions.forEach(([x, z]) => {
    const col = new THREE.Mesh(new THREE.BoxGeometry(0.35, 5.2, 0.35), colMat);
    col.position.set(x, 2.6, z);
    col.castShadow = true;
    col.receiveShadow = true;
    hall.add(col);
  });

  // 4. Overhead Pratt Roof Trusses & Crane Runway Girder
  const trussMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.7, roughness: 0.4 });
  for (let z = -3.5; z <= 3.5; z += 3.5) {
    const mainBeam = new THREE.Mesh(new THREE.BoxGeometry(9.0, 0.25, 0.25), trussMat);
    mainBeam.position.set(0, 4.8, z);
    hall.add(mainBeam);

    // Diagonal truss web members
    for (let x = -3.5; x <= 3.5; x += 1.4) {
      const diag = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.2, 8), trussMat);
      diag.rotation.z = Math.PI / 4;
      diag.position.set(x, 4.4, z);
      hall.add(diag);
    }
  }

  // Overhead Yellow Gantry Crane Beam
  const craneBeam = new THREE.Mesh(
    new THREE.BoxGeometry(8.6, 0.35, 0.4),
    new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.6, roughness: 0.3 })
  );
  craneBeam.position.set(0, 4.3, -1.0);
  hall.add(craneBeam);

  // Crane Hoist Trolley
  const hoist = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.4, 0.5),
    new THREE.MeshStandardMaterial({ color: 0x0f172a })
  );
  hoist.position.set(1.2, 4.0, -1.0);
  hall.add(hoist);

  // 5. Overhead Industrial High-Bay Lighting (3 suspended dome lamps)
  const lampMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });
  const glowMat = new THREE.MeshBasicMaterial({ color: 0xffedd5 });

  const lampPositions = [
    [-1.8, 4.0, -1.5],
    [0.0, 4.0, 0.5],
    [1.8, 4.0, -1.5]
  ];

  lampPositions.forEach(([lx, ly, lz]) => {
    // Suspension wire
    const wire = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.8, 6),
      new THREE.MeshBasicMaterial({ color: 0x111827 })
    );
    wire.position.set(lx, ly + 0.4, lz);
    hall.add(wire);

    // Dome shade
    const dome = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.4, 0.3, 16, 1, true),
      lampMat
    );
    dome.position.set(lx, ly, lz);
    hall.add(dome);

    // Glowing bulb
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), glowMat);
    bulb.position.set(lx, ly - 0.05, lz);
    hall.add(bulb);

    // Subtle downlight point
    const pl = new THREE.PointLight(0xfff7ed, 0.7, 7);
    pl.position.set(lx, ly - 0.2, lz);
    hall.add(pl);
  });

  // 6. Wall Horizontal Conduit Pipe Runs
  const conduit = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.03, 15, 8),
    new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.1 })
  );
  conduit.rotation.z = Math.PI / 2;
  conduit.position.set(0, 2.8, -4.32);
  hall.add(conduit);

  scene.add(hall);
  return hall;
}

// Utility: Build a complete realistic worker 3D character
function buildRealisticWorker(
  group: THREE.Group,
  pos: THREE.Vector3,
  theme: 'workshop' | 'electrical' | 'mining' | 'machinery' | 'fire'
) {
  const wGroup = new THREE.Group();
  wGroup.position.copy(pos);

  // Boots
  const bootMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7 });
  const bootL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.12, 0.24), bootMat);
  bootL.position.set(-0.12, 0.06, 0.05);
  wGroup.add(bootL);

  const bootR = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.12, 0.24), bootMat);
  bootR.position.set(0.12, 0.06, 0.05);
  wGroup.add(bootR);

  // Legs in dark blue industrial dungarees
  const pantMat = new THREE.MeshStandardMaterial({
    color: theme === 'mining' ? 0x334155 : 0x1e3a8a,
    roughness: 0.8
  });
  const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.7, 12), pantMat);
  legL.position.set(-0.12, 0.42, 0);
  wGroup.add(legL);

  const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.7, 12), pantMat);
  legR.position.set(0.12, 0.42, 0);
  wGroup.add(legR);

  // Belt
  const belt = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 0.07, 14),
    new THREE.MeshStandardMaterial({ color: 0x020617 })
  );
  belt.position.set(0, 0.76, 0);
  wGroup.add(belt);

  // Torso
  const torsoMat = new THREE.MeshStandardMaterial({
    color: theme === 'mining' ? 0x475569 : 0x1e3a8a,
    roughness: 0.7
  });
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.17, 0.58, 14), torsoMat);
  torso.position.set(0, 1.05, 0);
  wGroup.add(torso);

  // Neck
  const neck = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 0.1, 10),
    new THREE.MeshStandardMaterial({ color: 0xd4a373 })
  );
  neck.position.set(0, 1.36, 0);
  wGroup.add(neck);

  // Head
  const headMat = new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.5 });
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 16), headMat);
  head.position.set(0, 1.48, 0);
  wGroup.add(head);

  // Hair
  const hair = new THREE.Mesh(
    new THREE.SphereGeometry(0.135, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.4),
    new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 })
  );
  hair.position.set(0, 1.5, 0);
  wGroup.add(hair);

  // Arms & Hands
  const armMat = torsoMat;
  const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.55, 10), armMat);
  armL.position.set(-0.25, 1.05, 0);
  armL.rotation.z = 0.15;
  wGroup.add(armL);

  const handL = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 10), headMat);
  handL.position.set(-0.28, 0.74, 0);
  wGroup.add(handL);

  const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.55, 10), armMat);
  armR.position.set(0.25, 1.05, 0);
  armR.rotation.z = -0.15;
  wGroup.add(armR);

  const handR = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 10), headMat);
  handR.position.set(0.28, 0.74, 0);
  wGroup.add(handR);

  group.add(wGroup);
  return { wGroup, torso, head, handL, handR, bootL, bootR };
}

// =========================================================================
// SCENARIO 3D BUILDER FUNCTION
// =========================================================================
export function buildScenario3DScene(
  scenarioId: string,
  parentGroup: THREE.Group
): {
  interactables: Record<string, THREE.Object3D>;
  refs: VisualReferences;
} {
  // Clear any existing children
  while (parentGroup.children.length > 0) {
    parentGroup.remove(parentGroup.children[0]);
  }

  const interactables: Record<string, THREE.Object3D> = {};
  const refs: VisualReferences = {};

  const normId =
    scenarioId === 'scenario-2-fire' || scenarioId === 'scenario-3-fire'
      ? 'scenario-2-fire'
      : scenarioId === 'scenario-3-electrical'
      ? 'scenario-2-electrical'
      : scenarioId;

  // -----------------------------------------------------------------------
  // SCENARIO 0: REALISTIC INDUSTRIAL GAS PROCESSING PLANT (PRIMARY)
  // -----------------------------------------------------------------------
  if (normId === 'scenario-gas-leak') {
    buildRealisticGasProcessingFacility(parentGroup, interactables, refs);
    return { interactables, refs };
  }

  // -----------------------------------------------------------------------
  // SCENARIO 1: INDUSTRIAL WORKSHOP & PPE
  // -----------------------------------------------------------------------
  if (normId === 'scenario-1-ppe') {
    const wsGroup = new THREE.Group();
    buildRealisticIndustrialHall(wsGroup, 'workshop');

    // 1. Worker 3D Character (Hazard 1: worker-helmet & Hazard 2: worker-vest)
    const { wGroup, torso, head, bootL, bootR } = buildRealisticWorker(
      wsGroup,
      new THREE.Vector3(-0.6, 0, -0.2),
      'workshop'
    );

    // Tag Head as Hazard 1 (Missing Helmet)
    tagInteractable(head, 'worker-helmet', interactables);

    // Yellow Industrial Hard Hat (Appears on resolution per IS 2925)
    const hardHat = new THREE.Mesh(
      new THREE.SphereGeometry(0.155, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.55),
      new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        roughness: 0.25,
        metalness: 0.3
      })
    );
    hardHat.position.set(0, 1.54, 0);
    hardHat.visible = false;
    wGroup.add(hardHat);
    refs.workerHelmetMesh = hardHat;

    // Tag Torso as Hazard 2 (Missing Safety Vest)
    tagInteractable(torso, 'worker-vest', interactables);

    // High-Vis Orange Safety Vest (Appears on resolution per IS 15809)
    const vest = new THREE.Mesh(
      new THREE.CylinderGeometry(0.19, 0.18, 0.56, 14),
      new THREE.MeshStandardMaterial({
        color: 0xf97316,
        roughness: 0.4,
        emissive: 0xf97316,
        emissiveIntensity: 0.4
      })
    );
    vest.position.set(0, 1.05, 0);
    vest.visible = false;
    wGroup.add(vest);
    refs.workerVestMesh = vest;

    // Tag boots as Safe Distractor (safety-shoes)
    tagInteractable(bootL, 'safety-shoes', interactables);
    tagInteractable(bootR, 'safety-shoes', interactables);

    // 2. Heavy-Duty Steel Industrial Workbench with Tools
    const benchGroup = new THREE.Group();
    benchGroup.position.set(-1.8, 0, -1.2);

    // Tabletop
    const benchTop = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.08, 0.8),
      new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.3 })
    );
    benchTop.position.set(0, 0.85, 0);
    benchGroup.add(benchTop);

    // Table Legs & Bracing
    const legPositions = [
      [-0.7, 0.42, -0.3],
      [0.7, 0.42, -0.3],
      [-0.7, 0.42, 0.3],
      [0.7, 0.42, 0.3]
    ];
    legPositions.forEach(([x, y, z]) => {
      const bLeg = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.84, 0.08),
        new THREE.MeshStandardMaterial({ color: 0x1e293b })
      );
      bLeg.position.set(x, y, z);
      benchGroup.add(bLeg);
    });

    // Bench Vise
    const vise = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.16, 0.16),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.8 })
    );
    vise.position.set(-0.5, 0.97, 0.2);
    benchGroup.add(vise);

    // Red Toolbox & Wrench on Bench
    const toolbox = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.18, 0.2),
      new THREE.MeshStandardMaterial({ color: 0xdc2626 })
    );
    toolbox.position.set(0.3, 0.98, -0.1);
    benchGroup.add(toolbox);

    wsGroup.add(benchGroup);

    // 3. Wall-Mounted 415V Distribution Panel
    const distPanel = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 1.1, 0.25),
      new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.85, roughness: 0.2 })
    );
    distPanel.position.set(0.2, 1.8, -4.3);
    distPanel.castShadow = true;
    wsGroup.add(distPanel);

    // Red Voltage Indicator Lamps
    for (let i = -1; i <= 1; i++) {
      const lamp = new THREE.Mesh(
        new THREE.SphereGeometry(0.03, 8, 8),
        new THREE.MeshBasicMaterial({ color: i === 0 ? 0xef4444 : 0xfacc15 })
      );
      lamp.position.set(0.2 + i * 0.15, 2.2, -4.16);
      wsGroup.add(lamp);
    }

    // 4. Frayed 440V Live Power Cable with Sparks (Hazard 3: exposed-wire)
    const wireG = new THREE.Group();
    wireG.position.set(0.4, 0.02, 0.4);

    const wireCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.5, 0.02, -0.6),
      new THREE.Vector3(-0.2, 0.08, -0.2),
      new THREE.Vector3(0.2, 0.02, 0.1),
      new THREE.Vector3(0.6, 0.03, -0.3)
    ]);
    const cableMesh = new THREE.Mesh(
      new THREE.TubeGeometry(wireCurve, 28, 0.035, 8, false),
      new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4 })
    );
    wireG.add(cableMesh);

    // Active Electrical Fault Spark Particles
    const sparkCount = 45;
    const sparkGeo = new THREE.BufferGeometry();
    const sparkPos = new Float32Array(sparkCount * 3);
    for (let i = 0; i < sparkCount * 3; i += 3) {
      sparkPos[i] = 0.2 + (Math.random() - 0.5) * 0.3;
      sparkPos[i + 1] = 0.06 + Math.random() * 0.25;
      sparkPos[i + 2] = 0.1 + (Math.random() - 0.5) * 0.3;
    }
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
    const sparks = new THREE.Points(
      sparkGeo,
      new THREE.PointsMaterial({ color: 0x93c5fd, size: 0.06, transparent: true, opacity: 0.95 })
    );
    wireG.add(sparks);
    refs.wireSparksRef = sparks;

    // Green LOTO Lockout Enclosure (Appears on resolution)
    const loto = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.16, 0.14),
      new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3 })
    );
    loto.position.set(0.2, 0.1, 0.1);
    loto.visible = false;
    wireG.add(loto);
    refs.wireLockoutMesh = loto;

    // Tag entire wire group for direct click/tap
    tagInteractable(wireG, 'exposed-wire', interactables);
    wsGroup.add(wireG);

    // 5. Blocked Emergency Exit Door (Hazard 4: unsafe-barrier)
    const exitG = new THREE.Group();
    exitG.position.set(1.4, 0, -4.3);

    const doorFrame = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 2.2, 0.1),
      new THREE.MeshStandardMaterial({ color: 0x1e293b })
    );
    doorFrame.position.set(0, 1.1, 0);
    exitG.add(doorFrame);

    const doorLeaf = new THREE.Mesh(
      new THREE.BoxGeometry(1.0, 2.05, 0.06),
      new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.3 })
    );
    doorLeaf.position.set(0, 1.05, 0.02);
    exitG.add(doorLeaf);

    // Glowing EXIT sign above door
    const exitSign = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.22, 0.05),
      new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x22c55e, emissiveIntensity: 0.9 })
    );
    exitSign.position.set(0, 2.3, 0.06);
    exitG.add(exitSign);

    // Stacking cargo pallets, drums, and crates blocking exit door
    const obstacles = new THREE.Group();
    const pallet1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.75, 0.15, 0.75),
      new THREE.MeshStandardMaterial({ color: 0x854d0e })
    );
    pallet1.position.set(0, 0.08, 0.6);
    obstacles.add(pallet1);

    const drum1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.22, 0.75, 14),
      new THREE.MeshStandardMaterial({ color: 0x1d4ed8, metalness: 0.6 })
    );
    drum1.position.set(-0.25, 0.5, 0.6);
    obstacles.add(drum1);

    const crate1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.45, 0.45, 0.45),
      new THREE.MeshStandardMaterial({ color: 0x78350f })
    );
    crate1.position.set(0.22, 0.4, 0.65);
    obstacles.add(crate1);

    exitG.add(obstacles);
    refs.blockedDoorObstacles = obstacles;

    // Green cleared barrier line (Appears on resolution)
    const fixedRailing = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 0.9, 0.06),
      new THREE.MeshStandardMaterial({ color: 0x10b981, wireframe: true })
    );
    fixedRailing.position.set(0, 0.45, 0.8);
    fixedRailing.visible = false;
    exitG.add(fixedRailing);
    refs.barrierFixedMesh = fixedRailing;

    // Tag entire exit door group for direct click/tap
    tagInteractable(exitG, 'unsafe-barrier', interactables);
    wsGroup.add(exitG);

    // 6. Compliant Warning Signpost (Safe distractor: warning-sign)
    const signPostG = new THREE.Group();
    signPostG.position.set(-1.4, 0, 1.2);

    const post = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 1.4, 8),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8 })
    );
    post.position.set(0, 0.7, 0);
    signPostG.add(post);

    const diamondSign = new THREE.Mesh(
      new THREE.BoxGeometry(0.45, 0.45, 0.03),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3 })
    );
    diamondSign.rotation.z = Math.PI / 4;
    diamondSign.position.set(0, 1.4, 0);
    signPostG.add(diamondSign);

    tagInteractable(signPostG, 'warning-sign', interactables);
    wsGroup.add(signPostG);

    // 7. Yellow Steel Guardrails along hazard perimeter
    const guardrail = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 0.9, 0.08),
      new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.6, roughness: 0.4 })
    );
    guardrail.position.set(-2.2, 0.45, 0.5);
    wsGroup.add(guardrail);

    parentGroup.add(wsGroup);

  // -----------------------------------------------------------------------
  // SCENARIO 2: INDUSTRIAL FIRE SAFETY & EVACUATION
  // -----------------------------------------------------------------------
  } else if (normId === 'scenario-2-fire') {
    const fireScene = new THREE.Group();
    buildRealisticIndustrialHall(fireScene, 'fire');

    // 1. Factory Heavy Machinery (Overheating Motor Generator)
    const machGroup = new THREE.Group();
    machGroup.position.set(-0.8, 0, -0.7);

    // Motor body
    const motorBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45, 0.45, 1.1, 16),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.3 })
    );
    motorBody.rotation.z = Math.PI / 2;
    motorBody.position.set(0, 0.55, 0);
    machGroup.add(motorBody);

    // Motor stand
    const stand = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.3, 0.8),
      new THREE.MeshStandardMaterial({ color: 0x0f172a })
    );
    stand.position.set(0, 0.15, 0);
    machGroup.add(stand);

    // Drive pulley
    const pulley = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.35, 0.12, 16),
      new THREE.MeshStandardMaterial({ color: 0x475569 })
    );
    pulley.rotation.z = Math.PI / 2;
    pulley.position.set(0.6, 0.55, 0);
    machGroup.add(pulley);

    // Hazard 1: Active Fire & Smoke Plume (fire-active-blaze)
    const fireGroup = new THREE.Group();
    fireGroup.position.set(0, 0.8, 0);

    // Multi-layered animated fire particles
    const flameCount = 90;
    const flameGeo = new THREE.BufferGeometry();
    const flamePos = new Float32Array(flameCount * 3);
    for (let i = 0; i < flameCount * 3; i += 3) {
      flamePos[i] = (Math.random() - 0.5) * 0.45;
      flamePos[i + 1] = Math.random() * 0.8;
      flamePos[i + 2] = (Math.random() - 0.5) * 0.45;
    }
    flameGeo.setAttribute('position', new THREE.BufferAttribute(flamePos, 3));
    const flames = new THREE.Points(
      flameGeo,
      new THREE.PointsMaterial({ color: 0xf97316, size: 0.12, transparent: true, opacity: 0.95 })
    );
    fireGroup.add(flames);
    refs.fireFlameParticles = flames;

    // Dynamic fire flicker point light
    const fireLight = new THREE.PointLight(0xf97316, 2.5, 5);
    fireLight.position.set(0, 0.6, 0);
    fireGroup.add(fireLight);
    refs.fireLightRef = fireLight;

    // Extinguishing White Chemical Foam Blanketing (Appears on resolution)
    const foam = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.25, 0.9),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.9 })
    );
    foam.position.set(0, 0.2, 0);
    foam.visible = false;
    fireGroup.add(foam);
    refs.fireFoamMesh = foam;

    machGroup.add(fireGroup);
    tagInteractable(machGroup, 'fire-active-blaze', interactables);
    fireScene.add(machGroup);

    // 2. Wall-Mounted Certified DCP Fire Extinguisher (Safe distractor: fire-dcp-extinguisher)
    const extGroup = new THREE.Group();
    extGroup.position.set(-1.8, 1.2, -4.3);

    // Red Cylinder Tank
    const extTank = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 0.65, 14),
      new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.5, roughness: 0.3 })
    );
    extGroup.add(extTank);

    // Pressure gauge & nozzle
    const gauge = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.04, 8),
      new THREE.MeshStandardMaterial({ color: 0x10b981 })
    );
    gauge.position.set(0.1, 0.35, 0);
    extGroup.add(gauge);

    const hose = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8),
      new THREE.MeshStandardMaterial({ color: 0x18181b })
    );
    hose.position.set(-0.1, 0.1, 0.08);
    extGroup.add(hose);

    tagInteractable(extGroup, 'fire-dcp-extinguisher', interactables);
    fireScene.add(extGroup);

    // 3. Red Break-Glass Manual Alarm Call Point (Hazard 3: fire-alarm-pull)
    const alarmBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 0.3, 0.1),
      new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 })
    );
    alarmBox.position.set(-1.8, 1.4, -0.2);
    refs.fireAlarmBoxMesh = alarmBox;

    // Strobe Siren on top
    const strobe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 0.08, 10),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    strobe.position.set(-1.8, 1.6, -0.2);
    fireScene.add(strobe);

    tagInteractable(alarmBox, 'fire-alarm-pull', interactables);
    fireScene.add(alarmBox);

    // 4. Blocked Emergency Exit Door (Hazard 2: fire-blocked-exit)
    const exitG = new THREE.Group();
    exitG.position.set(1.5, 0, -4.3);

    const doorLeaf = new THREE.Mesh(
      new THREE.BoxGeometry(1.0, 2.1, 0.06),
      new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.3 })
    );
    doorLeaf.position.set(0, 1.05, 0.02);
    exitG.add(doorLeaf);

    // Running-Man Illuminated Green Sign
    const sign = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.22, 0.05),
      new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x22c55e, emissiveIntensity: 0.9 })
    );
    sign.position.set(0, 2.3, 0.06);
    exitG.add(sign);

    // Crates blocking door
    const obst = new THREE.Group();
    const c1 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 0.5), new THREE.MeshStandardMaterial({ color: 0x78350f }));
    c1.position.set(0, 0.25, 0.55);
    obst.add(c1);

    const d1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.7, 12), new THREE.MeshStandardMaterial({ color: 0x1e3a8a }));
    d1.position.set(-0.3, 0.35, 0.55);
    obst.add(d1);

    exitG.add(obst);
    refs.fireObstacleCrates = obst;

    tagInteractable(exitG, 'fire-blocked-exit', interactables);
    fireScene.add(exitG);

    // 5. Worker Caught in Smoke Zone (Hazard 4: fire-worker-evac)
    const { wGroup: workerEvac } = buildRealisticWorker(
      fireScene,
      new THREE.Vector3(0.2, 0, 0.3),
      'fire'
    );
    refs.fireWorkerGroup = workerEvac;
    tagInteractable(workerEvac, 'fire-worker-evac', interactables);

    // 6. Photoluminescent Green Floor Evacuation Route Arrows
    for (let z = 2.5; z >= -3.5; z -= 1.5) {
      const arrow = new THREE.Mesh(
        new THREE.PlaneGeometry(0.4, 0.6),
        new THREE.MeshStandardMaterial({
          color: 0x22c55e,
          emissive: 0x22c55e,
          emissiveIntensity: 0.5
        })
      );
      arrow.rotation.x = -Math.PI / 2;
      arrow.position.set(1.5, 0.007, z);
      fireScene.add(arrow);
    }

    // External Assembly Muster Point Sign (in external area)
    const musterSign = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.6, 0.04),
      new THREE.MeshStandardMaterial({ color: 0x15803d, emissive: 0x15803d, emissiveIntensity: 0.4 })
    );
    musterSign.position.set(3.2, 1.8, -3.5);
    fireScene.add(musterSign);

    parentGroup.add(fireScene);

  // -----------------------------------------------------------------------
  // SCENARIO 3: HIGH-VOLTAGE ELECTRICAL SUBSTATION
  // -----------------------------------------------------------------------
  } else if (normId === 'scenario-2-electrical') {
    const elecScene = new THREE.Group();
    buildRealisticIndustrialHall(elecScene, 'electrical');

    // 1. 11kV High-Voltage Switchgear Cabinets (3 adjacent steel enclosures)
    const switchgearGroup = new THREE.Group();
    switchgearGroup.position.set(0, 0, -2.2);

    for (let i = -1; i <= 1; i++) {
      const cabinet = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 2.2, 0.7),
        new THREE.MeshStandardMaterial({ color: i === 0 ? 0x1e293b : 0x0f172a, metalness: 0.85, roughness: 0.25 })
      );
      cabinet.position.set(i * 1.0, 1.1, 0);
      switchgearGroup.add(cabinet);

      // Meter glass dials
      const meter = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.25, 0.02),
        new THREE.MeshStandardMaterial({ color: 0x0284c7, emissive: 0x0284c7, emissiveIntensity: 0.4 })
      );
      meter.position.set(i * 1.0, 1.6, 0.36);
      switchgearGroup.add(meter);

      // Circuit breaker rotary handle
      const handle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 0.1, 10),
        new THREE.MeshStandardMaterial({ color: 0xdc2626 })
      );
      handle.rotation.x = Math.PI / 2;
      handle.position.set(i * 1.0, 1.1, 0.36);
      switchgearGroup.add(handle);
    }
    elecScene.add(switchgearGroup);

    // Overhead High-Voltage Busbars & Ceramic Insulators
    for (let x = -1.2; x <= 1.2; x += 1.2) {
      const insulator = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 0.45, 12),
        new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.3 })
      );
      insulator.position.set(x, 2.5, -2.2);
      elecScene.add(insulator);
    }

    // 2. Frayed 440V Feeder Cable with Active Sparks (Hazard 1: elec-exposed-cable)
    const cableG = new THREE.Group();
    cableG.position.set(0.6, 0.03, -0.3);

    const cCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.4, 0.02, -0.6),
      new THREE.Vector3(0.0, 0.08, -0.2),
      new THREE.Vector3(0.3, 0.02, 0.2),
      new THREE.Vector3(0.5, 0.03, -0.1)
    ]);
    const cable = new THREE.Mesh(
      new THREE.TubeGeometry(cCurve, 24, 0.035, 8, false),
      new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 })
    );
    cableG.add(cable);

    // Spark Particles
    const sparkGeo = new THREE.BufferGeometry();
    const sPos = new Float32Array(30 * 3);
    for (let i = 0; i < 30 * 3; i += 3) {
      sPos[i] = 0.1 + (Math.random() - 0.5) * 0.25;
      sPos[i + 1] = 0.05 + Math.random() * 0.2;
      sPos[i + 2] = (Math.random() - 0.5) * 0.25;
    }
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
    const sparks = new THREE.Points(
      sparkGeo,
      new THREE.PointsMaterial({ color: 0x60a5fa, size: 0.06, transparent: true })
    );
    cableG.add(sparks);
    refs.elecConduitSparks = sparks;

    // LOTO lock (Appears on resolution)
    const lotoTag = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.2, 0.08),
      new THREE.MeshStandardMaterial({ color: 0x10b981 })
    );
    lotoTag.position.set(0.1, 0.12, 0);
    lotoTag.visible = false;
    cableG.add(lotoTag);
    refs.elecLotoTagMesh = lotoTag;

    tagInteractable(cableG, 'elec-exposed-cable', interactables);
    elecScene.add(cableG);

    // 3. Conductive Water Puddle in Switchgear Bay (Hazard 2: elec-wet-floor)
    const puddle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.65, 0.65, 0.01, 16),
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        metalness: 0.9,
        roughness: 0.1,
        transparent: true,
        opacity: 0.75
      })
    );
    puddle.position.set(-0.4, 0.008, 0.2);
    tagInteractable(puddle, 'elec-wet-floor', interactables);
    elecScene.add(puddle);

    // Deployable Dielectric Insulating Rubber Safety Mat (Appears on resolution per IS 15652)
    const rubberMat = new THREE.Mesh(
      new THREE.PlaneGeometry(1.4, 1.0),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.9 })
    );
    rubberMat.rotation.x = -Math.PI / 2;
    rubberMat.position.set(-0.4, 0.015, 0.2);
    rubberMat.visible = false;
    elecScene.add(rubberMat);
    refs.elecRubberMatMesh = rubberMat;

    // 4. Technician Character (Hazard 3: elec-missing-gloves)
    const { wGroup: tech, handL, handR } = buildRealisticWorker(
      elecScene,
      new THREE.Vector3(-0.4, 0, -0.4),
      'electrical'
    );
    tagInteractable(handL, 'elec-missing-gloves', interactables);
    tagInteractable(handR, 'elec-missing-gloves', interactables);

    // IS 4770 Class 0 Insulating Rubber Gloves (Appears on resolution)
    const gloves = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.12, 0.16),
      new THREE.MeshStandardMaterial({ color: 0xf97316 })
    );
    gloves.position.set(0.28, 0.74, 0);
    gloves.visible = false;
    tech.add(gloves);
    refs.elecGlovesMesh = gloves;

    // 5. Obstructed Statutory 440V Danger Signboard (Hazard 4: elec-blocked-sign)
    const signGroup = new THREE.Group();
    signGroup.position.set(0, 0, -2.18);

    const dangerSign = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.45, 0.03),
      new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 })
    );
    dangerSign.position.set(0, 1.7, 0.38);
    signGroup.add(dangerSign);

    // Obstructing wooden crate in front of sign
    const blockCrate = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.55, 0.4),
      new THREE.MeshStandardMaterial({ color: 0x78350f })
    );
    blockCrate.position.set(0, 1.45, 0.65);
    signGroup.add(blockCrate);
    refs.elecClearSignMesh = blockCrate;

    tagInteractable(signGroup, 'elec-blocked-sign', interactables);
    elecScene.add(signGroup);

    // 6. Solid Copper Grounding Busbar (Safe distractor: elec-copper-earth)
    const earthBusbar = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 0.06, 0.04),
      new THREE.MeshStandardMaterial({ color: 0xb45309, metalness: 0.9, roughness: 0.2 })
    );
    earthBusbar.position.set(0, 0.05, -3.8);
    tagInteractable(earthBusbar, 'elec-copper-earth', interactables);
    elecScene.add(earthBusbar);

    parentGroup.add(elecScene);

  // -----------------------------------------------------------------------
  // SCENARIO 4: UNDERGROUND MINING SAFETY
  // -----------------------------------------------------------------------
  } else if (normId === 'scenario-4-mining') {
    const mineScene = new THREE.Group();

    // 1. Underground Drift Tunnel Floor (Rock, coal ballast, rails)
    const rockFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(16, 16),
      new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.95 })
    );
    rockFloor.rotation.x = -Math.PI / 2;
    rockFloor.receiveShadow = true;
    mineScene.add(rockFloor);

    // Mining Narrow-Gauge Railway Tracks
    for (let side of [-0.4, 0.4]) {
      const rail = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 0.08, 14),
        new THREE.MeshStandardMaterial({ color: 0x71717a, metalness: 0.8, roughness: 0.4 })
      );
      rail.position.set(side, 0.04, 0);
      mineScene.add(rail);
    }
    // Wooden Track Sleepers (Ties)
    for (let z = -6.0; z <= 6.0; z += 0.8) {
      const tie = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.05, 0.15),
        new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 })
      );
      tie.position.set(0, 0.02, z);
      mineScene.add(tie);
    }

    // 2. Arched Steel Yieldable Arches (Timber sets) framing underground drift
    const archMat = new THREE.MeshStandardMaterial({ color: 0x57534e, metalness: 0.7, roughness: 0.5 });
    for (let z = -5.0; z <= 5.0; z += 2.5) {
      const arch = new THREE.Mesh(
        new THREE.TorusGeometry(3.2, 0.12, 8, 24, Math.PI),
        archMat
      );
      arch.position.set(0, 0, z);
      arch.rotation.z = 0;
      mineScene.add(arch);
    }

    // 3. 35-Ton Heavy Mining Haul Dumper Truck
    const dumperG = new THREE.Group();
    dumperG.position.set(0.8, 0, -1.2);

    // Chassis & Engine Hood
    const chassis = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.8, 2.4),
      new THREE.MeshStandardMaterial({ color: 0x0c0a09 })
    );
    chassis.position.set(0, 0.8, 0);
    dumperG.add(chassis);

    // Yellow Dump Bed
    const dumpBed = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 0.9, 1.8),
      new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.6, roughness: 0.4 })
    );
    dumpBed.position.set(0, 1.4, -0.2);
    dumperG.add(dumpBed);

    // Giant Ribbed Mining Tires (4 off-road wheels)
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });
    const wheelPositions = [
      [-0.95, 0.55, -0.8],
      [0.95, 0.55, -0.8],
      [-0.95, 0.55, 0.8],
      [0.95, 0.55, 0.8]
    ];
    wheelPositions.forEach(([wx, wy, wz]) => {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.35, 16), tireMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(wx, wy, wz);
      dumperG.add(wheel);
    });

    // Driver Cab
    const cab = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.7, 0.8),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.8 })
    );
    cab.position.set(-0.4, 1.5, 0.7);
    dumperG.add(cab);

    mineScene.add(dumperG);
    refs.mineDumperGroup = dumperG;

    // Hazard 1: Haulage Blind Spot Zone (mine-haulage-blindspot)
    const blindZone = new THREE.Mesh(
      new THREE.PlaneGeometry(1.6, 1.6),
      new THREE.MeshStandardMaterial({
        color: 0xef4444,
        transparent: true,
        opacity: 0.5,
        roughness: 0.9
      })
    );
    blindZone.rotation.x = -Math.PI / 2;
    blindZone.position.set(0.8, 0.015, 0.6);
    tagInteractable(blindZone, 'mine-haulage-blindspot', interactables);
    mineScene.add(blindZone);

    // Miner standing in blindspot
    const { wGroup: blindWorker } = buildRealisticWorker(
      mineScene,
      new THREE.Vector3(0.8, 0, 0.6),
      'mining'
    );
    refs.minePedestrianWorker = blindWorker;

    // 4. Fractured Hanging Wall / Sagging Roof (Hazard 2: mine-unstable-roof)
    const roofRock = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.8, 1),
      new THREE.MeshStandardMaterial({ color: 0x44403c, roughness: 0.95 })
    );
    roofRock.position.set(-0.5, 2.6, -0.4);
    tagInteractable(roofRock, 'mine-unstable-roof', interactables);
    mineScene.add(roofRock);
    refs.mineRoofCracksMesh = roofRock;

    // Hydraulic Friction Roof Support Prop (Appears on resolution per CMR 2017)
    const prop = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 2.6, 12),
      new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.8 })
    );
    prop.position.set(-0.5, 1.3, -0.4);
    prop.visible = false;
    mineScene.add(prop);
    refs.mineRoofPropMesh = prop;

    // 5. Miner Character Missing Cap Lamp (Hazard 3: mine-no-caplamp)
    const { wGroup: minerNoLamp, head: minerHead } = buildRealisticWorker(
      mineScene,
      new THREE.Vector3(-1.1, 0, 0.2),
      'mining'
    );
    tagInteractable(minerHead, 'mine-no-caplamp', interactables);

    // DGMS Approved High-Intensity Cap Lamp (Appears on resolution)
    const capLamp = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.08, 0.08),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x38bdf8, emissiveIntensity: 1.0 })
    );
    capLamp.position.set(0, 1.58, 0.12);
    capLamp.visible = false;
    minerNoLamp.add(capLamp);
    refs.mineMinerCapLampMesh = capLamp;

    // 6. Unfenced Dangerous Goaf Area (Hazard 4: mine-missing-sign)
    const goafOpening = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 2.2, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x09090b })
    );
    goafOpening.position.set(1.5, 1.1, -3.8);
    tagInteractable(goafOpening, 'mine-missing-sign', interactables);
    mineScene.add(goafOpening);

    // Danger Barrier Gate (Appears on resolution)
    const dangerGate = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 1.2, 0.08),
      new THREE.MeshStandardMaterial({ color: 0xef4444, wireframe: true })
    );
    dangerGate.position.set(1.5, 0.6, -3.6);
    dangerGate.visible = false;
    mineScene.add(dangerGate);
    refs.mineDangerGateMesh = dangerGate;

    // 7. Compliant Auxiliary Mine Ventilation Duct (Safe distractor: mine-vent-tube)
    const ventDuct = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.35, 12, 16),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.5 })
    );
    ventDuct.rotation.x = Math.PI / 2;
    ventDuct.position.set(-2.0, 2.6, 0);
    tagInteractable(ventDuct, 'mine-vent-tube', interactables);
    mineScene.add(ventDuct);

    parentGroup.add(mineScene);

  // -----------------------------------------------------------------------
  // SCENARIO 5: MACHINERY & NIP-POINT SAFETY
  // -----------------------------------------------------------------------
  } else if (normId === 'scenario-5-machinery') {
    const machScene = new THREE.Group();
    buildRealisticIndustrialHall(machScene, 'machinery');

    // 1. Powered Heavy Industrial Belt Conveyor System
    const conveyorGroup = new THREE.Group();
    conveyorGroup.position.set(0, 0, -0.4);

    // Structural Steel Channel Frame
    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.2, 0.8),
      new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 })
    );
    frame.position.set(0, 0.75, 0);
    conveyorGroup.add(frame);

    // Support Steel Legs
    for (const [lx, lz] of [
      [-1.0, -0.35],
      [1.0, -0.35],
      [-1.0, 0.35],
      [1.0, 0.35]
    ]) {
      const leg = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.75, 0.08),
        new THREE.MeshStandardMaterial({ color: 0x1e293b })
      );
      leg.position.set(lx, 0.375, lz);
      conveyorGroup.add(leg);
    }

    // Heavy Rubber Conveyor Belt
    const belt = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 0.03, 0.6),
      new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.9 })
    );
    belt.position.set(0, 0.86, 0);
    conveyorGroup.add(belt);

    // Head Drive Pulley Roller & Tail Roller
    const rollerHead = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.14, 0.62, 16),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 })
    );
    rollerHead.rotation.x = Math.PI / 2;
    rollerHead.position.set(1.05, 0.85, 0);
    conveyorGroup.add(rollerHead);

    // Electric Drive Motor & Gearbox
    const motor = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 0.5, 12),
      new THREE.MeshStandardMaterial({ color: 0x0284c7 })
    );
    motor.rotation.x = Math.PI / 2;
    motor.position.set(1.05, 0.85, 0.55);
    conveyorGroup.add(motor);

    // Visible In-Running Nip Point with Jammed Rag/Tool (Hazard 1: mach-missing-guard)
    const nipPoint = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 0.15, 0.5),
      new THREE.MeshStandardMaterial({ color: 0xdc2626 })
    );
    nipPoint.position.set(0.9, 0.88, 0);
    conveyorGroup.add(nipPoint);
    tagInteractable(nipPoint, 'mach-missing-guard', interactables);

    // Yellow Interlocked Wire-Mesh Safety Guard (Appears on resolution per IS 9474)
    const wireGuard = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.45, 0.72),
      new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        wireframe: true
      })
    );
    wireGuard.position.set(1.0, 0.95, 0);
    wireGuard.visible = false;
    conveyorGroup.add(wireGuard);
    refs.machWireMeshGuard = wireGuard;

    machScene.add(conveyorGroup);

    // 2. Operator Pedestal with Emergency Stop Button (Hazard 2: mach-estop-unhit)
    const estopPedestal = new THREE.Group();
    estopPedestal.position.set(0.9, 0, -0.1);

    const post = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 0.9, 10),
      new THREE.MeshStandardMaterial({ color: 0xfacc15 })
    );
    post.position.set(0, 0.45, 0);
    estopPedestal.add(post);

    const estopBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.25, 0.14),
      new THREE.MeshStandardMaterial({ color: 0xfacc15 })
    );
    estopBox.position.set(0, 0.95, 0);
    estopPedestal.add(estopBox);

    // Prominent Red Mushroom Head Button
    const estopBtn = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.07, 0.06, 16),
      new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.2 })
    );
    estopBtn.rotation.x = Math.PI / 2;
    estopBtn.position.set(0, 0.95, 0.08);
    estopPedestal.add(estopBtn);
    refs.machEstopButton = estopBtn;

    tagInteractable(estopPedestal, 'mach-estop-unhit', interactables);
    machScene.add(estopPedestal);

    // 3. Worker with Loose Unbuttoned Sleeves (Hazard 3: mach-loose-clothing)
    const { wGroup: opWorker, handL: opHandL } = buildRealisticWorker(
      machScene,
      new THREE.Vector3(-0.8, 0, 0.3),
      'machinery'
    );
    tagInteractable(opHandL, 'mach-loose-clothing', interactables);

    // Loose dangling sleeve mesh
    const looseSleeve = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.18, 0.08),
      new THREE.MeshStandardMaterial({ color: 0x3b82f6 })
    );
    looseSleeve.position.set(-0.25, 0.85, 0);
    opWorker.add(looseSleeve);
    refs.machOperatorSleeve = looseSleeve;

    // 4. Missing Floor Chevron Caution Perimeter (Hazard 4: mach-missing-perimeter)
    const chevronPerimeter = new THREE.Mesh(
      new THREE.RingGeometry(1.6, 1.85, 24),
      new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        roughness: 0.4,
        side: THREE.DoubleSide
      })
    );
    chevronPerimeter.rotation.x = -Math.PI / 2;
    chevronPerimeter.position.set(0, 0.008, -0.4);
    chevronPerimeter.visible = false;
    machScene.add(chevronPerimeter);
    refs.machPerimeterStripe = chevronPerimeter;

    // Tag floor area around machine as Hazard 4
    const floorArea = new THREE.Mesh(
      new THREE.PlaneGeometry(2.8, 2.0),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    floorArea.rotation.x = -Math.PI / 2;
    floorArea.position.set(0, 0.007, 0.5);
    tagInteractable(floorArea, 'mach-missing-perimeter', interactables);
    machScene.add(floorArea);

    // 5. Statutory Emergency Eyewash Station (Safe distractor: mach-eyewash)
    const eyewash = new THREE.Group();
    eyewash.position.set(-2.2, 0, -1.8);

    const ePost = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 1.2, 8),
      new THREE.MeshStandardMaterial({ color: 0x15803d })
    );
    ePost.position.set(0, 0.6, 0);
    eyewash.add(ePost);

    const bowl = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.12, 0.15, 12),
      new THREE.MeshStandardMaterial({ color: 0x22c55e })
    );
    bowl.position.set(0, 1.15, 0);
    eyewash.add(bowl);

    tagInteractable(eyewash, 'mach-eyewash', interactables);
    machScene.add(eyewash);

    parentGroup.add(machScene);
  }

  return { interactables, refs };
}

// Visual Resolver to update 3D meshes in real-time
export function updateScenarioVisuals(
  hazardId: string,
  isResolved: boolean,
  refs: VisualReferences
) {
  // Scenario 1: PPE
  if (hazardId === 'worker-helmet' && refs.workerHelmetMesh) {
    refs.workerHelmetMesh.visible = isResolved;
  }
  if (hazardId === 'worker-vest' && refs.workerVestMesh) {
    refs.workerVestMesh.visible = isResolved;
  }
  if (hazardId === 'exposed-wire') {
    if (refs.wireSparksRef) refs.wireSparksRef.visible = !isResolved;
    if (refs.wireLockoutMesh) refs.wireLockoutMesh.visible = isResolved;
  }
  if (hazardId === 'unsafe-barrier') {
    if (refs.blockedDoorObstacles) refs.blockedDoorObstacles.visible = !isResolved;
    if (refs.barrierFixedMesh) refs.barrierFixedMesh.visible = isResolved;
  }

  // Scenario 2 / 3: Fire
  if (hazardId === 'fire-active-blaze') {
    if (refs.fireFlameParticles) refs.fireFlameParticles.visible = !isResolved;
    if (refs.fireFoamMesh) refs.fireFoamMesh.visible = isResolved;
    if (refs.fireLightRef) refs.fireLightRef.visible = !isResolved;
  }
  if (hazardId === 'fire-blocked-exit' && refs.fireObstacleCrates) {
    refs.fireObstacleCrates.visible = !isResolved;
  }
  if (hazardId === 'fire-alarm-pull' && refs.fireAlarmBoxMesh) {
    const mat = refs.fireAlarmBoxMesh.material as THREE.MeshStandardMaterial;
    mat.emissive = new THREE.Color(isResolved ? 0x22c55e : 0x000000);
    mat.emissiveIntensity = isResolved ? 0.8 : 0.0;
  }
  if (hazardId === 'fire-worker-evac' && refs.fireWorkerGroup) {
    refs.fireWorkerGroup.position.set(1.5, 0, -3.5); // Safely at external muster point
  }

  // Scenario 2 / 3: Electrical
  if (hazardId === 'elec-exposed-cable') {
    if (refs.elecConduitSparks) refs.elecConduitSparks.visible = !isResolved;
    if (refs.elecLotoTagMesh) refs.elecLotoTagMesh.visible = isResolved;
  }
  if (hazardId === 'elec-wet-floor' && refs.elecRubberMatMesh) {
    refs.elecRubberMatMesh.visible = isResolved;
  }
  if (hazardId === 'elec-missing-gloves' && refs.elecGlovesMesh) {
    refs.elecGlovesMesh.visible = isResolved;
  }
  if (hazardId === 'elec-blocked-sign' && refs.elecClearSignMesh) {
    refs.elecClearSignMesh.visible = !isResolved; // Hide obstructing crate
  }

  // Scenario 4: Mining
  if (hazardId === 'mine-haulage-blindspot') {
    if (refs.minePedestrianWorker) {
      refs.minePedestrianWorker.position.set(-1.8, 0, 0.6); // Safely into refuge bay
    }
  }
  if (hazardId === 'mine-unstable-roof' && refs.mineRoofPropMesh) {
    refs.mineRoofPropMesh.visible = isResolved;
  }
  if (hazardId === 'mine-no-caplamp' && refs.mineMinerCapLampMesh) {
    refs.mineMinerCapLampMesh.visible = isResolved;
  }
  if (hazardId === 'mine-missing-sign' && refs.mineDangerGateMesh) {
    refs.mineDangerGateMesh.visible = isResolved;
  }

  // Scenario 5: Machinery
  if (hazardId === 'mach-missing-guard' && refs.machWireMeshGuard) {
    refs.machWireMeshGuard.visible = isResolved;
  }
  if (hazardId === 'mach-estop-unhit' && refs.machEstopButton) {
    refs.machEstopButton.position.z = isResolved ? 0.03 : 0.08; // Depressed
  }
  if (hazardId === 'mach-loose-clothing' && refs.machOperatorSleeve) {
    refs.machOperatorSleeve.visible = !isResolved; // Fastened / rolled up
  }
  if (hazardId === 'mach-missing-perimeter' && refs.machPerimeterStripe) {
    refs.machPerimeterStripe.visible = isResolved;
  }

  // Scenario 6 / Primary: Gas Leakage
  if (hazardId === 'gas-valve-leak') {
    if (refs.gasLeakParticles) refs.gasLeakParticles.visible = !isResolved;
    if (refs.gasValveHandwheel) refs.gasValveHandwheel.rotation.x = isResolved ? 0 : Math.PI / 2;
    if (refs.gasGaugeNeedle) refs.gasGaugeNeedle.rotation.z = isResolved ? 0.7 : -0.75;
  }
  if (hazardId === 'gas-worker-ppe' && refs.gasWorkerRespirator) {
    refs.gasWorkerRespirator.visible = isResolved;
  }
  if (hazardId === 'gas-blocked-exit' && refs.gasBlockedExitCrates) {
    refs.gasBlockedExitCrates.visible = !isResolved;
  }
  if (hazardId === 'gas-alarm-box' && refs.gasAlarmStrobeLight) {
    refs.gasAlarmStrobeLight.intensity = isResolved ? 0.2 : 2.0;
  }
}

// Client-Side Deterministic DGMS Rule-Based Fallback Engine
export function generateDgmsRuleFallback(
  scenarioId: string,
  identifiedHazards: string[],
  language: SupportedLanguage
): GeminiSafetyAnalysis {
  const isHi = language === 'hi';
  const allItems = getScenarioItems(scenarioId).filter((i) => i.isHazard);
  const remainingHazards = allItems.filter((i) => !identifiedHazards.includes(i.id));

  const hazardsList = remainingHazards.map((h) => ({
    type: h.title,
    severity: 'High' as const,
    description: h.explanation,
    recommendation: h.recommendation,
    matchedObjectId: h.id,
    isMatchExact: true
  }));

  const isResolved = remainingHazards.length === 0;

  const summary = isResolved
    ? isHi
      ? 'सभी चिन्हित औद्योगिक खतरों का पूर्ण निवारण कर लिया गया है। कार्यक्षेत्र डीजीएमएस एवं भारतीय मानक ब्यूरो (BIS) के सुरक्षा नियमों का पालन करता है।'
      : 'All statutory industrial hazards have been fully mitigated. Work station meets DGMS & Indian Standards compliance standards.'
    : isHi
      ? `कार्यक्षेत्र में ${remainingHazards.length} सुरक्षा उल्लंघन पाए गए हैं। तुरंत सुधारात्मक कार्रवाई आवश्यक है।`
      : `${remainingHazards.length} active safety violations identified in station. Immediate regulatory remediation required.`;

  const recommendation = isResolved
    ? isHi
      ? 'प्रशिक्षण क्षेत्र सुरक्षित घोषित। अगले उन्नत औद्योगिक मॉड्यूल की ओर बढ़ें।'
      : 'Station certified safe for vocational operations. Proceed to next industrial safety module.'
    : isHi
      ? 'सख्त डीजीएमएस एवं कारख़ाना अधिनियम नियमों का पालन करें। प्रवेश से पहले समस्त खतरों को ठीक करें।'
      : 'Enforce strict DGMS Regulations and Indian Factories Act compliance before station entry.';

  return {
    overallRisk: isResolved ? 'Low' : 'High',
    summary,
    hazards: hazardsList,
    trainingRecommendation: recommendation,
    modelUsed: 'DGMS-Deterministic-Rule-Engine (Offline Fallback)',
    timestamp: new Date().toISOString()
  };
}
