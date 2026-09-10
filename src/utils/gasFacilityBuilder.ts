import * as THREE from 'three';
import { VisualReferences } from './scenarioSceneBuilder';

// Helper to tag meshes for raycaster clicks and highlight
function tagObject(obj: THREE.Object3D, hazardId: string, interactables: Record<string, THREE.Object3D>) {
  obj.userData = { ...obj.userData, hazardId };
  obj.traverse((child) => {
    child.userData = { ...child.userData, hazardId };
    if ((child as THREE.Mesh).isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  interactables[hazardId] = obj;
}

// Procedural texture generator for caution hazard chevrons (Yellow & Black 45-deg stripes)
function createHazardStripeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#facc15'; // OSHA Yellow
  ctx.fillRect(0, 0, 256, 256);
  ctx.fillStyle = '#1e293b'; // Slate Black
  ctx.beginPath();
  const stripeWidth = 32;
  for (let i = -256; i < 512; i += stripeWidth * 2) {
    ctx.moveTo(i, 0);
    ctx.lineTo(i + stripeWidth, 0);
    ctx.lineTo(i + stripeWidth + 256, 256);
    ctx.lineTo(i + 256, 256);
    ctx.closePath();
  }
  ctx.fill();
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 1);
  return texture;
}

// Procedural texture for pressure gauge dial face
function createPressureGaugeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  
  // White dial background
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.arc(128, 128, 120, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 6;
  ctx.stroke();

  // Color bands: Green (0-40 bar), Yellow (40-60 bar), Red (60-100 bar)
  // Arc angles from 135 deg to 405 deg (270 deg span)
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  
  // Green zone (135 to 225 deg)
  ctx.beginPath();
  ctx.arc(128, 128, 95, toRad(135), toRad(245));
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 14;
  ctx.stroke();

  // Yellow zone (245 to 310 deg)
  ctx.beginPath();
  ctx.arc(128, 128, 95, toRad(245), toRad(310));
  ctx.strokeStyle = '#eab308';
  ctx.lineWidth = 14;
  ctx.stroke();

  // Red danger zone (310 to 405 deg)
  ctx.beginPath();
  ctx.arc(128, 128, 95, toRad(310), toRad(405));
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 14;
  ctx.stroke();

  // Tick marks & numbers
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('BAR x10', 128, 175);
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('HIGH PRESSURE', 128, 90);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// Procedural texture for statutory warning sign (Bilingual: Danger Flammable Gas)
function createDangerGasSignTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // White signboard background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 512, 256);
  ctx.strokeStyle = '#dc2626';
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, 502, 246);

  // Red Danger oval header
  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.ellipse(256, 45, 180, 30, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('DANGER / खतरा', 256, 54);

  // Black text
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('FLAMMABLE GAS HAZARD', 256, 115);
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('ज्वलनशील गैस - आग का खतरा', 256, 150);

  ctx.font = 'bold 17px sans-serif';
  ctx.fillStyle = '#dc2626';
  ctx.fillText('NO SMOKING • NO OPEN FLAME • IS/PESO COMPLIANT', 256, 200);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// Procedural texture for Exit sign
function createExitSignTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#16a34a'; // Green
  ctx.fillRect(0, 0, 256, 128);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('EMERGENCY', 128, 48);
  ctx.font = 'bold 44px sans-serif';
  ctx.fillText('EXIT / निकास', 128, 98);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export function buildRealisticGasProcessingFacility(
  scene: THREE.Group,
  interactables: Record<string, THREE.Object3D>,
  refs: VisualReferences
): void {
  const plant = new THREE.Group();

  // Materials
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.75,
    metalness: 0.2
  });
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.85,
    metalness: 0.15
  });
  const pipeYellowMat = new THREE.MeshStandardMaterial({
    color: 0xeab308, // Gas Yellow
    metalness: 0.5,
    roughness: 0.3
  });
  const pipeChromeMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8, // Stainless Steel
    metalness: 0.8,
    roughness: 0.2
  });
  const valveRedMat = new THREE.MeshStandardMaterial({
    color: 0xdc2626, // Valve Red
    metalness: 0.4,
    roughness: 0.35
  });
  const steelFrameMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    metalness: 0.7,
    roughness: 0.4
  });
  const railingYellowMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    roughness: 0.3,
    metalness: 0.4
  });

  // 1. Concrete & Steel Plant Floor (16x16m)
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(16, 16), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  plant.add(floor);

  // Concrete expansion joint grid
  const grid = new THREE.GridHelper(16, 16, 0x64748b, 0x475569);
  grid.position.y = 0.002;
  plant.add(grid);

  // Main Transit Walkway with Yellow Border
  const walkway = new THREE.Mesh(
    new THREE.PlaneGeometry(2.6, 14),
    new THREE.MeshStandardMaterial({ color: 0x273142, roughness: 0.85 })
  );
  walkway.rotation.x = -Math.PI / 2;
  walkway.position.set(0, 0.004, 0);
  walkway.receiveShadow = true;
  plant.add(walkway);

  // Yellow borders on walkway
  for (const side of [-1.3, 1.3]) {
    const border = new THREE.Mesh(
      new THREE.PlaneGeometry(0.12, 14),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 })
    );
    border.rotation.x = -Math.PI / 2;
    border.position.set(side, 0.006, 0);
    plant.add(border);
  }

  // 2. High Industrial Plant Enclosure Walls (Back, Left, Right)
  // Back Wall
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(16, 5.2, 0.3), wallMat);
  backWall.position.set(0, 2.6, -4.5);
  backWall.receiveShadow = true;
  plant.add(backWall);

  // Left Wall
  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 5.2, 14), wallMat);
  leftWall.position.set(-4.5, 2.6, 1.0);
  leftWall.receiveShadow = true;
  plant.add(leftWall);

  // Right Wall
  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 5.2, 14), wallMat);
  rightWall.position.set(4.5, 2.6, 1.0);
  rightWall.receiveShadow = true;
  plant.add(rightWall);

  // Structural Steel I-Beam Columns along walls
  const colPositions = [
    [-4.3, -4.3],
    [4.3, -4.3],
    [-4.3, 0],
    [4.3, 0],
    [-4.3, 3.5],
    [4.3, 3.5]
  ];
  colPositions.forEach(([cx, cz]) => {
    const col = new THREE.Mesh(new THREE.BoxGeometry(0.35, 5.2, 0.35), steelFrameMat);
    col.position.set(cx, 2.6, cz);
    col.castShadow = true;
    col.receiveShadow = true;
    plant.add(col);
  });

  // Overhead Steel Trusses & Gantry Crane Girder
  for (let z = -3.5; z <= 3.5; z += 3.5) {
    const trussBeam = new THREE.Mesh(new THREE.BoxGeometry(9.0, 0.25, 0.25), steelFrameMat);
    trussBeam.position.set(0, 4.8, z);
    plant.add(trussBeam);
  }
  const craneGirder = new THREE.Mesh(
    new THREE.BoxGeometry(8.6, 0.35, 0.4),
    new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.6, roughness: 0.3 })
  );
  craneGirder.position.set(0, 4.3, -1.0);
  plant.add(craneGirder);

  // Overhead High-Bay Sodium Lamps (3 units)
  const lampPositions = [
    [-2.0, 4.0, -1.5],
    [0.0, 4.0, 0.5],
    [2.0, 4.0, -1.5]
  ];
  lampPositions.forEach(([lx, ly, lz]) => {
    const wire = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.8, 6),
      new THREE.MeshBasicMaterial({ color: 0x111827 })
    );
    wire.position.set(lx, ly + 0.4, lz);
    plant.add(wire);

    const shade = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.4, 0.3, 16, 1, true),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 })
    );
    shade.position.set(lx, ly, lz);
    plant.add(shade);

    const bulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xffedd5 })
    );
    bulb.position.set(lx, ly - 0.05, lz);
    plant.add(bulb);

    const pl = new THREE.PointLight(0xfff7ed, 0.7, 7);
    pl.position.set(lx, ly - 0.2, lz);
    plant.add(pl);
  });

  // 3. High-Pressure Gas Manifold & Pipelines
  // Main horizontal yellow gas header running along the back
  const mainGasHeader = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 7.5, 24),
    pipeYellowMat
  );
  mainGasHeader.rotation.z = Math.PI / 2;
  mainGasHeader.position.set(0.5, 1.8, -3.8);
  mainGasHeader.castShadow = true;
  plant.add(mainGasHeader);

  // Pipeline Flanges along the header
  const flangeGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.06, 24);
  const flangeMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8, roughness: 0.3 });
  for (const fx of [-2.5, -0.8, 0.8, 2.2, 3.8]) {
    const fl = new THREE.Mesh(flangeGeo, flangeMat);
    fl.rotation.z = Math.PI / 2;
    fl.position.set(fx, 1.8, -3.8);
    plant.add(fl);
  }

  // Vertical Riser Pipeline from manifold to equipment
  const riserPipe = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.15, 1.8, 20),
    pipeChromeMat
  );
  riserPipe.position.set(1.6, 0.9, -2.8);
  riserPipe.castShadow = true;
  plant.add(riserPipe);

  // Connecting elbow from header to riser
  const elbowJoint = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.15, 16, 24, Math.PI / 2),
    pipeChromeMat
  );
  elbowJoint.position.set(1.6, 1.8, -3.5);
  elbowJoint.rotation.y = Math.PI / 2;
  plant.add(elbowJoint);

  // -------------------------------------------------------------------------
  // HAZARD 1: THE GAS LEAK SITE (Flange breach & Handwheel valve)
  // -------------------------------------------------------------------------
  const leakGroup = new THREE.Group();
  leakGroup.position.set(1.6, 1.4, -2.8);

  // Flange pair at leak joint
  const flangeL = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.05, 20), flangeMat);
  flangeL.position.y = -0.04;
  leakGroup.add(flangeL);

  const flangeR = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.05, 20), flangeMat);
  flangeR.position.y = 0.04;
  leakGroup.add(flangeR);

  // Hex bolts around flange
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI * 2) / 8;
    const bolt = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.12, 6),
      new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9 })
    );
    bolt.position.set(Math.cos(angle) * 0.22, 0, Math.sin(angle) * 0.22);
    leakGroup.add(bolt);
  }

  // Rotary Gas Handwheel Shutoff Valve directly above flange
  const valveBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.32, 0.25, 0.28),
    valveRedMat
  );
  valveBody.position.y = 0.2;
  leakGroup.add(valveBody);

  const valveStem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.03, 0.25, 12),
    new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 })
  );
  valveStem.position.y = 0.38;
  leakGroup.add(valveStem);

  // Red Handwheel
  const handwheel = new THREE.Mesh(
    new THREE.TorusGeometry(0.18, 0.028, 12, 24),
    valveRedMat
  );
  handwheel.rotation.x = Math.PI / 2;
  handwheel.position.y = 0.5;
  leakGroup.add(handwheel);
  refs.gasValveHandwheel = handwheel;

  // Handwheel cross-spokes
  for (let i = 0; i < 4; i++) {
    const spoke = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.34, 8),
      valveRedMat
    );
    spoke.rotation.x = Math.PI / 2;
    spoke.rotation.z = (i * Math.PI) / 4;
    spoke.position.y = 0.5;
    leakGroup.add(spoke);
  }

  // Detailed Industrial Pressure Gauge above the valve
  const gaugeSiphon = new THREE.Mesh(
    new THREE.CylinderGeometry(0.015, 0.015, 0.3, 8),
    new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 })
  );
  gaugeSiphon.position.set(0.2, 0.3, 0);
  leakGroup.add(gaugeSiphon);

  const gaugeDialGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.04, 24);
  const gaugeDialMat = new THREE.MeshStandardMaterial({
    map: createPressureGaugeTexture(),
    roughness: 0.3
  });
  const gaugeDial = new THREE.Mesh(gaugeDialGeo, gaugeDialMat);
  gaugeDial.rotation.x = Math.PI / 2;
  gaugeDial.position.set(0.2, 0.48, 0.08);
  leakGroup.add(gaugeDial);

  // Needle on gauge (vibrating in the RED zone)
  const needle = new THREE.Mesh(
    new THREE.BoxGeometry(0.01, 0.09, 0.005),
    new THREE.MeshBasicMaterial({ color: 0xdc2626 })
  );
  needle.position.set(0.2, 0.49, 0.11);
  needle.rotation.z = -0.75; // Points into danger red band
  leakGroup.add(needle);
  refs.gasGaugeNeedle = needle;

  // Animated Gas Leak Particle System (200 particles)
  const particleCount = 220;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);
  const lifetimes = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 0.15;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.15;

    velocities[i * 3] = (Math.random() - 0.5) * 0.4 + 0.1;
    velocities[i * 3 + 1] = Math.random() * 0.8 + 0.4; // Billowing up
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.5 + 0.2; // Shooting forward

    lifetimes[i] = Math.random();
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.userData = { velocities, lifetimes };

  const particleMat = new THREE.PointsMaterial({
    color: 0x67e8f9, // Vapor Cyan
    size: 0.18,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const gasParticles = new THREE.Points(particleGeo, particleMat);
  gasParticles.position.set(0, 0, 0.1);
  leakGroup.add(gasParticles);
  refs.gasLeakParticles = gasParticles;

  // Warning amber glow at leak point
  const leakLight = new THREE.PointLight(0x06b6d4, 1.2, 3.5);
  leakLight.position.set(0, 0.2, 0.2);
  leakGroup.add(leakLight);

  // Tag leak group as HAZARD 1
  tagObject(leakGroup, 'gas-valve-leak', interactables);
  plant.add(leakGroup);

  // Floor hazard chevrons marking gas exclusion perimeter
  const hazardPerimeter = new THREE.Mesh(
    new THREE.PlaneGeometry(3.2, 2.4),
    new THREE.MeshStandardMaterial({
      map: createHazardStripeTexture(),
      roughness: 0.6
    })
  );
  hazardPerimeter.rotation.x = -Math.PI / 2;
  hazardPerimeter.position.set(1.6, 0.008, -2.6);
  plant.add(hazardPerimeter);

  // 4. Large Vertical Separator Pressure Tank
  const tankGroup = new THREE.Group();
  tankGroup.position.set(-1.8, 0, -3.2);

  // Cylindrical body
  const tankBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.7, 0.7, 2.4, 28),
    pipeChromeMat
  );
  tankBody.position.y = 1.6;
  tankBody.castShadow = true;
  tankGroup.add(tankBody);

  // Domed top cap
  const tankTop = new THREE.Mesh(
    new THREE.SphereGeometry(0.7, 24, 14, 0, Math.PI * 2, 0, Math.PI / 2),
    pipeChromeMat
  );
  tankTop.position.y = 2.8;
  tankGroup.add(tankTop);

  // Steel Skirt support legs (4 legs)
  for (let i = 0; i < 4; i++) {
    const legAngle = (i * Math.PI) / 2;
    const leg = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.6, 0.12),
      steelFrameMat
    );
    leg.position.set(Math.cos(legAngle) * 0.62, 0.3, Math.sin(legAngle) * 0.62);
    tankGroup.add(leg);
  }

  // Tank inspection manway with bolt ring
  const manway = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.24, 0.1, 16),
    flangeMat
  );
  manway.rotation.x = Math.PI / 2;
  manway.position.set(0, 1.6, 0.72);
  tankGroup.add(manway);

  // NFPA 704 HazChem Warning Diamond on tank
  const diamond = new THREE.Mesh(
    new THREE.PlaneGeometry(0.35, 0.35),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  diamond.rotation.z = Math.PI / 4;
  diamond.position.set(0, 2.2, 0.71);
  tankGroup.add(diamond);
  plant.add(tankGroup);

  // 5. Industrial Gas Compressor & Motor Skid
  const compressorSkid = new THREE.Group();
  compressorSkid.position.set(0.2, 0, -2.0);

  // Concrete pedestal mounting base
  const concreteBase = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 0.3, 1.2),
    new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9 })
  );
  concreteBase.position.y = 0.15;
  compressorSkid.add(concreteBase);

  // Electric Motor with cooling fins
  const motor = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.3, 0.8, 18),
    new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.6, roughness: 0.3 })
  );
  motor.rotation.z = Math.PI / 2;
  motor.position.set(-0.35, 0.6, 0);
  motor.castShadow = true;
  compressorSkid.add(motor);

  // Rotating Flywheel on drive shaft
  const flywheelGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.08, 24);
  const flywheelMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2 });
  const flywheel = new THREE.Mesh(flywheelGeo, flywheelMat);
  flywheel.rotation.z = Math.PI / 2;
  flywheel.position.set(0.08, 0.6, 0);
  compressorSkid.add(flywheel);
  refs.gasCompressorFlywheel = flywheel;

  // Compressor pump head
  const pumpHead = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.55, 0.6),
    new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7, roughness: 0.3 })
  );
  pumpHead.position.set(0.45, 0.6, 0);
  compressorSkid.add(pumpHead);

  // Reciprocating Piston Rod
  const pistonGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.35, 12);
  const pistonMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });
  const pistonRod = new THREE.Mesh(pistonGeo, pistonMat);
  pistonRod.rotation.z = Math.PI / 2;
  pistonRod.position.set(0.2, 0.6, 0);
  compressorSkid.add(pistonRod);
  refs.gasCompressorPiston = pistonRod;

  plant.add(compressorSkid);

  // -------------------------------------------------------------------------
  // HAZARD 2: UNISOLATED ELECTRICAL CONTROL CABINET NEAR GAS CLOUD
  // -------------------------------------------------------------------------
  const elecGroup = new THREE.Group();
  elecGroup.position.set(-2.8, 0, -3.2);

  // Cabinet body
  const cabinet = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 1.9, 0.45),
    new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.7, roughness: 0.35 })
  );
  cabinet.position.y = 0.95;
  elecGroup.add(cabinet);

  // Open Door swung ajar 45 degrees
  const door = new THREE.Mesh(
    new THREE.BoxGeometry(0.85, 1.85, 0.04),
    new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.7, roughness: 0.35 })
  );
  door.position.set(0.4, 0.95, 0.28);
  door.rotation.y = 0.65;
  elecGroup.add(door);

  // Exposed internal circuit breakers & copper busbars
  const busbar = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 1.4, 0.1),
    new THREE.MeshStandardMaterial({ color: 0xb45309, metalness: 0.8, roughness: 0.3 })
  );
  busbar.position.set(0, 0.95, 0.15);
  elecGroup.add(busbar);

  // 440V Danger signboard on cabinet
  const elecSign = new THREE.Mesh(
    new THREE.PlaneGeometry(0.45, 0.25),
    new THREE.MeshBasicMaterial({
      map: createDangerGasSignTexture(),
    })
  );
  elecSign.position.set(-0.1, 1.5, 0.24);
  elecGroup.add(elecSign);

  // Spark / arc flicker simulation light
  const arcLight = new THREE.PointLight(0x38bdf8, 0.4, 2);
  arcLight.position.set(0, 1.0, 0.3);
  elecGroup.add(arcLight);

  tagObject(elecGroup, 'gas-elec-panel', interactables);
  plant.add(elecGroup);

  // -------------------------------------------------------------------------
  // HAZARD 3: PROCESS WORKER WITHOUT CHEMICAL RESPIRATOR / SCBA
  // -------------------------------------------------------------------------
  const workerGroup = new THREE.Group();
  workerGroup.position.set(0.5, 0, -1.0);

  // Work Boots
  const bootMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
  const bootL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.24), bootMat);
  bootL.position.set(-0.14, 0.05, 0.04);
  workerGroup.add(bootL);
  const bootR = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.24), bootMat);
  bootR.position.set(0.14, 0.05, 0.04);
  workerGroup.add(bootR);

  // Overalls Legs
  const overallsMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.6 }); // Navy blue
  const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.72, 12), overallsMat);
  legL.position.set(-0.14, 0.46, 0);
  workerGroup.add(legL);
  const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.72, 12), overallsMat);
  legR.position.set(0.14, 0.46, 0);
  workerGroup.add(legR);

  // Torso
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.18, 0.6, 14), overallsMat);
  torso.position.set(0, 1.05, 0);
  workerGroup.add(torso);

  // Worker Head
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 });
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 16), skinMat);
  head.position.set(0, 1.48, 0);
  workerGroup.add(head);

  // Hard hat on head
  const hardHat = new THREE.Mesh(
    new THREE.SphereGeometry(0.15, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.55),
    new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3 })
  );
  hardHat.position.set(0, 1.54, 0);
  workerGroup.add(hardHat);

  // Chemical Full-Face Gas Mask / Respirator (Hidden initially, appears on remediation)
  const respiratorMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.5 });
  const respMask = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.15, 0.12), respiratorMat);
  respMask.position.set(0, 1.45, 0.1);

  // Twin gas cartridge filters
  const cartL = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 0.06, 12),
    new THREE.MeshStandardMaterial({ color: 0x94a3b8 })
  );
  cartL.rotation.z = Math.PI / 2;
  cartL.position.set(-0.1, 1.43, 0.12);
  respMask.add(cartL);

  const cartR = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 0.06, 12),
    new THREE.MeshStandardMaterial({ color: 0x94a3b8 })
  );
  cartR.rotation.z = Math.PI / 2;
  cartR.position.set(0.1, 1.43, 0.12);
  respMask.add(cartR);

  respMask.visible = false;
  workerGroup.add(respMask);
  refs.gasWorkerRespirator = respMask;

  tagObject(workerGroup, 'gas-worker-ppe', interactables);
  plant.add(workerGroup);

  // -------------------------------------------------------------------------
  // HAZARD 4: OBSTRUCTED EMERGENCY EXIT ROUTE (Chemical Drums & Pallets)
  // -------------------------------------------------------------------------
  const exitGroup = new THREE.Group();
  exitGroup.position.set(4.45, 0, 1.5);

  // Industrial Steel Exit Double Doors
  const doorLeafL = new THREE.Mesh(
    new THREE.BoxGeometry(0.05, 2.3, 0.95),
    new THREE.MeshStandardMaterial({ color: 0x15803d, metalness: 0.5, roughness: 0.4 }) // Green
  );
  doorLeafL.position.set(0, 1.15, -0.48);
  exitGroup.add(doorLeafL);

  const doorLeafR = new THREE.Mesh(
    new THREE.BoxGeometry(0.05, 2.3, 0.95),
    new THREE.MeshStandardMaterial({ color: 0x15803d, metalness: 0.5, roughness: 0.4 })
  );
  doorLeafR.position.set(0, 1.15, 0.48);
  exitGroup.add(doorLeafR);

  // Panic Push-Bar
  const pushBar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 1.7, 8),
    new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.8 })
  );
  pushBar.rotation.x = Math.PI / 2;
  pushBar.position.set(-0.06, 1.0, 0);
  exitGroup.add(pushBar);

  // Illuminated Green Emergency Exit Lightbox above door
  const exitSignGeo = new THREE.BoxGeometry(0.1, 0.35, 0.9);
  const exitSignMat = new THREE.MeshBasicMaterial({
    map: createExitSignTexture()
  });
  const exitSign = new THREE.Mesh(exitSignGeo, exitSignMat);
  exitSign.position.set(-0.1, 2.55, 0);
  exitGroup.add(exitSign);

  const exitLight = new THREE.PointLight(0x22c55e, 0.8, 4);
  exitLight.position.set(-0.3, 2.4, 0);
  exitGroup.add(exitLight);
  refs.gasEvacSignLight = exitLight;

  // Obstruction: 200L Chemical Drums & Wooden Pallets blocking the door
  const obstacleGroup = new THREE.Group();
  obstacleGroup.position.set(-0.65, 0, 0);

  // Wooden Pallet 1
  const palletMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
  const pallet1 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.14, 1.2), palletMat);
  pallet1.position.set(0, 0.07, 0);
  obstacleGroup.add(pallet1);

  // Pallet 2 stacked on top
  const pallet2 = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.14, 1.1), palletMat);
  pallet2.position.set(0.05, 0.21, 0.05);
  obstacleGroup.add(pallet2);

  // 200L Blue Chemical Drum
  const drumMat = new THREE.MeshStandardMaterial({ color: 0x0369a1, metalness: 0.6, roughness: 0.3 });
  const drum1 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.9, 18), drumMat);
  drum1.position.set(-0.1, 0.73, -0.25);
  drum1.castShadow = true;
  obstacleGroup.add(drum1);

  // Yellow Toxic Hazard Drum
  const drum2 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.3, 0.9, 18),
    new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.5, roughness: 0.4 })
  );
  drum2.position.set(0.15, 0.73, 0.3);
  drum2.castShadow = true;
  obstacleGroup.add(drum2);

  exitGroup.add(obstacleGroup);
  refs.gasBlockedExitCrates = obstacleGroup;

  tagObject(exitGroup, 'gas-blocked-exit', interactables);
  plant.add(exitGroup);

  // -------------------------------------------------------------------------
  // COMPLIANT ACTION CONTROLS & SAFETY STATIONS
  // -------------------------------------------------------------------------

  // 1. Break-Glass Emergency Gas Alarm MCP Station (`gas-alarm-box`)
  const alarmGroup = new THREE.Group();
  alarmGroup.position.set(-4.3, 1.5, 0.0);

  const alarmBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.3, 0.25),
    valveRedMat
  );
  alarmGroup.add(alarmBox);

  // White break-glass window with pull lever
  const glassWindow = new THREE.Mesh(
    new THREE.BoxGeometry(0.02, 0.12, 0.12),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  glassWindow.position.set(0.08, 0, 0);
  alarmGroup.add(glassWindow);

  // Mechanical Alarm Pull Lever
  const pullLeverGeo = new THREE.BoxGeometry(0.04, 0.1, 0.03);
  const pullLeverMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.7 });
  const pullLever = new THREE.Mesh(pullLeverGeo, pullLeverMat);
  pullLever.position.set(0.09, 0.02, 0);
  alarmGroup.add(pullLever);
  refs.gasAlarmPullLever = pullLever;

  // Rotating Xenon Red Strobe Beacon above
  const beaconBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 0.08, 16),
    new THREE.MeshStandardMaterial({ color: 0x1e293b })
  );
  beaconBase.position.set(0, 1.6, 0);
  alarmGroup.add(beaconBase);

  const beaconDome = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.85 })
  );
  beaconDome.position.set(0, 1.64, 0);
  alarmGroup.add(beaconDome);

  // Internal rotating reflector mirror
  const beaconReflector = new THREE.Group();
  beaconReflector.position.set(0, 1.64, 0);
  const mirror = new THREE.Mesh(
    new THREE.BoxGeometry(0.02, 0.1, 0.08),
    new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.95, roughness: 0.1 })
  );
  beaconReflector.add(mirror);
  alarmGroup.add(beaconReflector);
  refs.gasAlarmStrobeBeacon = beaconReflector;

  const strobeLight = new THREE.PointLight(0xef4444, 0.2, 5);
  strobeLight.position.set(0, 1.7, 0);
  alarmGroup.add(strobeLight);
  refs.gasAlarmStrobeLight = strobeLight;

  tagObject(alarmGroup, 'gas-alarm-box', interactables);
  plant.add(alarmGroup);

  // 2. Explosion-Proof Emergency Exhaust Ventilation Blowers (`gas-vent-fan`)
  const ventGroup = new THREE.Group();
  ventGroup.position.set(0.0, 3.4, -4.2);

  // Heavy galvanized duct housing
  const ventHousing = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 1.2, 0.6),
    steelFrameMat
  );
  ventGroup.add(ventHousing);

  refs.gasVentilationFans = [];

  // Dual exhaust fan ports
  for (const fx of [-0.65, 0.65]) {
    const portRim = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45, 0.45, 0.1, 24),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 })
    );
    portRim.rotation.x = Math.PI / 2;
    portRim.position.set(fx, 0, 0.3);
    ventGroup.add(portRim);

    // 4-Blade Rotating Impeller Fan
    const fanGroup = new THREE.Group();
    fanGroup.position.set(fx, 0, 0.32);

    const hub = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.06, 16),
      new THREE.MeshStandardMaterial({ color: 0x475569 })
    );
    hub.rotation.x = Math.PI / 2;
    fanGroup.add(hub);

    for (let b = 0; b < 4; b++) {
      const blade = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.36, 0.015),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 })
      );
      blade.rotation.z = (b * Math.PI) / 2;
      blade.position.set(0, 0, 0);
      fanGroup.add(blade);
    }

    ventGroup.add(fanGroup);
    refs.gasVentilationFans.push(fanGroup);
  }

  tagObject(ventGroup, 'gas-vent-fan', interactables);
  plant.add(ventGroup);

  // 3. PPE Safety Station Locker (`gas-ppe-station`)
  const ppeLocker = new THREE.Group();
  ppeLocker.position.set(-4.3, 1.2, 2.5);

  const cabinetMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 1.4, 0.9),
    new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 }) // Yellow
  );
  ppeLocker.add(cabinetMesh);

  // Window showing internal respirators
  const lockerWindow = new THREE.Mesh(
    new THREE.BoxGeometry(0.02, 1.0, 0.7),
    new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 })
  );
  lockerWindow.position.set(0.1, 0, 0);
  ppeLocker.add(lockerWindow);

  tagObject(ppeLocker, 'gas-ppe-station', interactables);
  plant.add(ppeLocker);

  // 4. Wall-Mounted DCP Fire Extinguisher at (4.3, 1.3, -1.0)
  const extGroup = new THREE.Group();
  extGroup.position.set(4.3, 1.3, -1.0);

  const extCylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(0.11, 0.11, 0.65, 16),
    valveRedMat
  );
  extGroup.add(extCylinder);

  const extTop = new THREE.Mesh(
    new THREE.SphereGeometry(0.11, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2),
    valveRedMat
  );
  extTop.position.y = 0.32;
  extGroup.add(extTop);

  const extHose = new THREE.Mesh(
    new THREE.CylinderGeometry(0.018, 0.018, 0.55, 8),
    new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 })
  );
  extHose.position.set(0.08, 0.05, 0.1);
  extGroup.add(extHose);

  tagObject(extGroup, 'fire-extinguisher', interactables);
  plant.add(extGroup);

  // 5. Statutory Danger Flammable Gas Warning Board on Left Wall
  const dangerSign = new THREE.Mesh(
    new THREE.PlaneGeometry(1.4, 0.7),
    new THREE.MeshBasicMaterial({
      map: createDangerGasSignTexture(),
    })
  );
  dangerSign.rotation.y = Math.PI / 2;
  dangerSign.position.set(-4.32, 2.2, -1.5);
  plant.add(dangerSign);

  // 6. Elevated Steel Catwalk Mezzanine with Access Stairs
  const catwalkGroup = new THREE.Group();
  catwalkGroup.position.set(-3.2, 2.2, -1.0);

  // Steel grating platform (length 5m, width 1.2m)
  const platform = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.1, 5.0),
    new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 })
  );
  catwalkGroup.add(platform);

  // Yellow Safety Handrails (top rail, mid rail, vertical stanchions)
  for (let z = -2.5; z <= 2.5; z += 1.25) {
    const stanchion = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 1.05, 8),
      railingYellowMat
    );
    stanchion.position.set(0.58, 0.55, z);
    catwalkGroup.add(stanchion);
  }
  const topRail = new THREE.Mesh(
    new THREE.CylinderGeometry(0.025, 0.025, 5.0, 8),
    railingYellowMat
  );
  topRail.rotation.x = Math.PI / 2;
  topRail.position.set(0.58, 1.05, 0);
  catwalkGroup.add(topRail);

  // Access Stairway with 7 treads
  for (let s = 0; s < 7; s++) {
    const tread = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.04, 0.28),
      steelFrameMat
    );
    tread.position.set(-0.1, -0.3 * (s + 1), 2.5 + s * 0.28);
    catwalkGroup.add(tread);
  }
  plant.add(catwalkGroup);

  // 7. Industrial Clutter (Toolbox on wheels, Oil Spill Drum, Traffic Cones)
  const coneGeo = new THREE.ConeGeometry(0.16, 0.5, 16);
  const coneMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.4 });
  const cone1 = new THREE.Mesh(coneGeo, coneMat);
  cone1.position.set(2.8, 0.25, -1.2);
  plant.add(cone1);

  const cone2 = new THREE.Mesh(coneGeo, coneMat);
  cone2.position.set(0.4, 0.25, 0.6);
  plant.add(cone2);

  scene.add(plant);
}

export interface FacilityAnimationOptions {
  leakIntensity?: number; // 0.0 to 1.0
  pressureBar?: number; // e.g. 28 to 95
  isAlarmActive?: boolean;
  isVentActive?: boolean;
  isValveClosed?: boolean;
}

// Animation update callback called in main requestAnimationFrame loop
export function updateGasFacilityAnimations(
  refs: VisualReferences,
  clockDelta: number,
  elapsedTime: number,
  options?: FacilityAnimationOptions
): void {
  const leakIntensity = options?.leakIntensity ?? 0.8;
  const pressureBar = options?.pressureBar ?? 85;
  const isAlarmActive = options?.isAlarmActive ?? false;
  const isVentActive = options?.isVentActive ?? false;
  const isValveClosed = options?.isValveClosed ?? false;

  // 1. Heavy Industrial Machinery: Motor Flywheel & Piston Stroke
  if (refs.gasCompressorFlywheel) {
    refs.gasCompressorFlywheel.rotation.z += clockDelta * 14.0;
  }
  if (refs.gasCompressorPiston) {
    refs.gasCompressorPiston.position.x = 0.2 + Math.sin(elapsedTime * 14.0) * 0.07;
  }

  // 2. High-Pressure Manifold Pipe Shudder / Vibration under Overpressure
  if (refs.gasManifoldPipe) {
    if (pressureBar > 65 && !isValveClosed) {
      refs.gasManifoldPipe.position.x = 1.6 + Math.sin(elapsedTime * 48.0) * 0.003;
      refs.gasManifoldPipe.position.y = 1.4 + Math.cos(elapsedTime * 36.0) * 0.002;
    } else {
      refs.gasManifoldPipe.position.x = 1.6;
      refs.gasManifoldPipe.position.y = 1.4;
    }
  }

  // 3. Dynamic Gas Leak Particles & Plume Expansion
  if (refs.gasLeakParticles) {
    if (leakIntensity <= 0.04 || isValveClosed) {
      refs.gasLeakParticles.visible = false;
    } else {
      refs.gasLeakParticles.visible = true;
      const pointsMat = refs.gasLeakParticles.material as THREE.PointsMaterial;
      if (pointsMat) {
        // Opacity and cloud size scale with leak severity
        pointsMat.opacity = Math.min(0.85, 0.25 + leakIntensity * 0.55);
        pointsMat.size = 0.12 + leakIntensity * 0.12;
      }

      const geo = refs.gasLeakParticles.geometry as THREE.BufferGeometry;
      const pos = geo.attributes.position.array as Float32Array;
      const { velocities, lifetimes } = geo.userData;
      const count = pos.length / 3;
      const speedMult = 0.7 + leakIntensity * 0.8;

      for (let i = 0; i < count; i++) {
        lifetimes[i] += clockDelta * 0.95 * speedMult;
        if (lifetimes[i] > 1.0) {
          lifetimes[i] = 0;
          pos[i * 3] = (Math.random() - 0.5) * 0.08;
          pos[i * 3 + 1] = (Math.random() - 0.5) * 0.06;
          pos[i * 3 + 2] = (Math.random() - 0.5) * 0.08;
        } else {
          pos[i * 3] += velocities[i * 3] * clockDelta * speedMult;
          pos[i * 3 + 1] += velocities[i * 3 + 1] * clockDelta * speedMult;
          pos[i * 3 + 2] += velocities[i * 3 + 2] * clockDelta * speedMult;
        }
      }
      geo.attributes.position.needsUpdate = true;
    }
  }

  // 4. Ventilation Fan Impellers (Accelerates when activated)
  if (refs.gasVentilationFans && refs.gasVentilationFans.length > 0) {
    const fanSpeed = isVentActive ? 32.0 : 6.5;
    refs.gasVentilationFans.forEach((fan) => {
      fan.rotation.z += clockDelta * fanSpeed;
    });
  }

  // 5. Emergency Alarm Strobe Beacon & Rotating Reflector
  if (refs.gasAlarmStrobeBeacon) {
    if (isAlarmActive) {
      refs.gasAlarmStrobeBeacon.rotation.y += clockDelta * 12.0;
    }
  }
  if (refs.gasAlarmStrobeLight) {
    if (isAlarmActive) {
      const pulse = Math.sin(elapsedTime * 12.0);
      refs.gasAlarmStrobeLight.intensity = pulse > 0 ? 3.2 : 0.3;
      refs.gasAlarmStrobeLight.color.setHex(0xef4444);
    } else {
      refs.gasAlarmStrobeLight.intensity = 0.08;
    }
  }

  // 6. Mechanical Alarm Pull Station Lever
  if (refs.gasAlarmPullLever) {
    refs.gasAlarmPullLever.rotation.z = isAlarmActive ? 0.65 : 0.0;
  }

  // 7. Pressure Gauge Needle (Accurate physical Bar reading + mechanical jitter)
  if (refs.gasGaugeNeedle) {
    // 0 bar = +0.7 rad, 100 bar = -1.1 rad
    const targetAngle = 0.7 - (pressureBar / 100) * 1.8;
    const jitter = Math.sin(elapsedTime * 22.0) * (pressureBar > 60 ? 0.035 : 0.008);
    refs.gasGaugeNeedle.rotation.z = targetAngle + jitter;
  }
}
