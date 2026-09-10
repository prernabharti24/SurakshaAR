import * as THREE from 'three';

export interface FirstPersonHandsController {
  handsGroup: THREE.Group;
  update: (delta: number, isMoving: boolean, isSprinting: boolean) => void;
  triggerInteract: (actionType?: 'valve' | 'alarm' | 'ppe' | 'general') => void;
  updateGasLel: (lelPercent: number) => void;
  setVisible: (visible: boolean) => void;
  dispose: () => void;
}

export function createFirstPersonHands(camera: THREE.Camera): FirstPersonHandsController {
  const handsGroup = new THREE.Group();
  handsGroup.name = 'FirstPersonHandsGroup';

  // Attach directly to camera so hands stay in first-person view
  camera.add(handsGroup);
  // Positioned slightly down and forward in view frustum
  handsGroup.position.set(0, -0.22, -0.42);

  // ---------------------------------------------------------------------------
  // TEXTURES & CANVASES
  // ---------------------------------------------------------------------------

  // 1. Multi-Gas Sniffer LCD Canvas Texture
  const lcdCanvas = document.createElement('canvas');
  lcdCanvas.width = 256;
  lcdCanvas.height = 128;
  const lcdCtx = lcdCanvas.getContext('2d')!;
  const lcdTexture = new THREE.CanvasTexture(lcdCanvas);

  function drawLcd(lel: number) {
    // Screen background
    const isDangerous = lel > 20;
    lcdCtx.fillStyle = isDangerous ? '#450a0a' : '#042f2e';
    lcdCtx.fillRect(0, 0, 256, 128);

    // Frame
    lcdCtx.strokeStyle = isDangerous ? '#ef4444' : '#14b8a6';
    lcdCtx.lineWidth = 4;
    lcdCtx.strokeRect(4, 4, 248, 120);

    // Device Header
    lcdCtx.fillStyle = '#94a3b8';
    lcdCtx.font = 'bold 14px monospace';
    lcdCtx.fillText('SURAKSHA-4X SNIFFER', 14, 24);

    // Dynamic LEL %
    lcdCtx.fillStyle = isDangerous ? '#f87171' : '#2dd4bf';
    lcdCtx.font = 'bold 38px monospace';
    lcdCtx.fillText(`${Math.round(lel)}% LEL`, 14, 68);

    // Gas type & status
    lcdCtx.fillStyle = '#ffffff';
    lcdCtx.font = 'bold 16px monospace';
    lcdCtx.fillText('CH4 / HC GAS', 14, 96);

    // Status Pill
    lcdCtx.fillStyle = isDangerous ? '#dc2626' : '#0d9488';
    lcdCtx.fillRect(150, 80, 92, 28);
    lcdCtx.fillStyle = '#ffffff';
    lcdCtx.font = 'bold 13px sans-serif';
    lcdCtx.textAlign = 'center';
    lcdCtx.fillText(isDangerous ? 'EXPLOSIVE' : 'SAFE ZONE', 196, 99);
    lcdCtx.textAlign = 'left';

    lcdTexture.needsUpdate = true;
  }
  drawLcd(0);

  // ---------------------------------------------------------------------------
  // MATERIALS
  // ---------------------------------------------------------------------------
  // High-durability flame retardant navy blue workwear sleeve
  const sleeveMat = new THREE.MeshStandardMaterial({
    color: 0x1e3a8a, // Navy overall
    roughness: 0.85,
    metalness: 0.1
  });

  // Retro-reflective silver safety stripe (Class 2 tape)
  const reflectiveStripeMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.2,
    metalness: 0.8
  });

  // Hi-Vis Yellow / Orange safety glove fabric
  const gloveHiVisMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15, // Hi-vis safety yellow
    roughness: 0.45,
    metalness: 0.2
  });

  // Dark reinforced nitrile / polyurethane grip coating on palm & fingers
  const gloveGripMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b, // Slate dark grip
    roughness: 0.8,
    metalness: 0.1
  });

  // Sniffer chassis materials
  const snifferBodyMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b, // Industrial tool amber
    roughness: 0.35,
    metalness: 0.3
  });
  const snifferRubberMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.9,
    metalness: 0.1
  });
  const snifferScreenMat = new THREE.MeshBasicMaterial({
    map: lcdTexture
  });

  // ---------------------------------------------------------------------------
  // HELPER: BUILD GLOVED HAND RIG
  // ---------------------------------------------------------------------------
  function buildGlovedArm(isRightHand: boolean): {
    armGroup: THREE.Group;
    handGroup: THREE.Group;
    forearm: THREE.Mesh;
    fingers: THREE.Mesh[];
  } {
    const armGroup = new THREE.Group();
    const handGroup = new THREE.Group();
    const fingers: THREE.Mesh[] = [];

    // Forearm Sleeve (Cylinder tapering towards wrist)
    const forearm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.055, 0.28, 16),
      sleeveMat
    );
    forearm.rotation.x = Math.PI / 2.3;
    forearm.rotation.z = isRightHand ? -0.15 : 0.15;
    forearm.position.set(0, -0.06, -0.08);
    armGroup.add(forearm);

    // Reflective Safety Tape around wrist
    const stripe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.046, 0.048, 0.035, 16),
      reflectiveStripeMat
    );
    stripe.rotation.x = Math.PI / 2.3;
    stripe.rotation.z = isRightHand ? -0.15 : 0.15;
    stripe.position.set(0, -0.03, -0.01);
    armGroup.add(stripe);

    // Glove Ribbed Cuff
    const cuff = new THREE.Mesh(
      new THREE.CylinderGeometry(0.047, 0.046, 0.03, 16),
      gloveHiVisMat
    );
    cuff.rotation.x = Math.PI / 2.3;
    cuff.position.set(0, -0.01, 0.03);
    armGroup.add(cuff);

    // Palm / Hand Core
    const palm = new THREE.Mesh(
      new THREE.BoxGeometry(0.075, 0.03, 0.085),
      gloveHiVisMat
    );
    palm.position.set(0, 0, 0.07);
    handGroup.add(palm);

    // Grip pad under palm
    const gripPad = new THREE.Mesh(
      new THREE.BoxGeometry(0.07, 0.008, 0.075),
      gloveGripMat
    );
    gripPad.position.set(0, -0.015, 0.07);
    handGroup.add(gripPad);

    // Thumb
    const thumb = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.02, 0.045),
      gloveGripMat
    );
    thumb.position.set(isRightHand ? -0.045 : 0.045, 0.005, 0.065);
    thumb.rotation.y = isRightHand ? 0.6 : -0.6;
    handGroup.add(thumb);
    fingers.push(thumb);

    // 4 Fingers (Index, Middle, Ring, Pinky)
    const fingerWidth = 0.015;
    for (let i = 0; i < 4; i++) {
      const fx = (i - 1.5) * (fingerWidth + 0.003);
      const fingerLength = i === 1 || i === 2 ? 0.052 : 0.045;
      const finger = new THREE.Mesh(
        new THREE.BoxGeometry(fingerWidth, 0.018, fingerLength),
        gloveGripMat
      );
      finger.position.set(fx, 0.002, 0.115 + fingerLength * 0.4);
      // Gentle curve / curl
      finger.rotation.x = 0.25;
      handGroup.add(finger);
      fingers.push(finger);
    }

    handGroup.position.set(0, 0, 0);
    armGroup.add(handGroup);

    return { armGroup, handGroup, forearm, fingers };
  }

  // ---------------------------------------------------------------------------
  // LEFT ARM (Tactical / Readiness Pose)
  // ---------------------------------------------------------------------------
  const leftArm = buildGlovedArm(false);
  leftArm.armGroup.position.set(-0.24, -0.08, 0.04);
  leftArm.armGroup.rotation.set(-0.15, 0.35, -0.15);
  handsGroup.add(leftArm.armGroup);

  // ---------------------------------------------------------------------------
  // RIGHT ARM (Equipped with Industrial Multi-Gas Detector Sniffer)
  // ---------------------------------------------------------------------------
  const rightArm = buildGlovedArm(true);
  rightArm.armGroup.position.set(0.22, -0.06, 0.04);
  rightArm.armGroup.rotation.set(-0.12, -0.28, 0.12);
  handsGroup.add(rightArm.armGroup);

  // Build the Multi-Gas Detector Sniffer Device held in Right Hand
  const snifferGroup = new THREE.Group();
  snifferGroup.name = 'MultiGasDetector';

  // Device Main Casing
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.065, 0.04, 0.13),
    snifferBodyMat
  );
  body.position.set(0, 0.035, 0.03);
  snifferGroup.add(body);

  // Rubber bumper edges
  const bumperL = new THREE.Mesh(
    new THREE.BoxGeometry(0.008, 0.044, 0.134),
    snifferRubberMat
  );
  bumperL.position.set(-0.032, 0.035, 0.03);
  snifferGroup.add(bumperL);

  const bumperR = new THREE.Mesh(
    new THREE.BoxGeometry(0.008, 0.044, 0.134),
    snifferRubberMat
  );
  bumperR.position.set(0.032, 0.035, 0.03);
  snifferGroup.add(bumperR);

  // Sniffer Probe / Wand Snout protruding forward
  const snout = new THREE.Mesh(
    new THREE.CylinderGeometry(0.008, 0.012, 0.06, 12),
    snifferRubberMat
  );
  snout.rotation.x = Math.PI / 2;
  snout.position.set(0, 0.035, 0.125);
  snifferGroup.add(snout);

  const sensorTip = new THREE.Mesh(
    new THREE.CylinderGeometry(0.01, 0.01, 0.02, 12),
    new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 })
  );
  sensorTip.rotation.x = Math.PI / 2;
  sensorTip.position.set(0, 0.035, 0.16);
  snifferGroup.add(sensorTip);

  // LCD Screen on top face of detector
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.055, 0.042),
    snifferScreenMat
  );
  screen.rotation.x = -Math.PI / 2;
  screen.position.set(0, 0.056, 0.025);
  snifferGroup.add(screen);

  // Status Warning LED Indicator
  const led = new THREE.Mesh(
    new THREE.SphereGeometry(0.006, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0x10b981 })
  );
  led.position.set(0.02, 0.058, 0.065);
  snifferGroup.add(led);

  // Attach Sniffer firmly to Right Hand
  rightArm.handGroup.add(snifferGroup);

  // ---------------------------------------------------------------------------
  // ANIMATION & CONTROLLER LOGIC
  // ---------------------------------------------------------------------------
  let walkPhase = 0;
  let idleTime = 0;
  let isInteracting = false;
  let interactProgress = 0;
  let currentActionType: 'valve' | 'alarm' | 'ppe' | 'general' = 'general';

  // Base rest positions
  const baseLeftPos = new THREE.Vector3(-0.24, -0.08, 0.04);
  const baseRightPos = new THREE.Vector3(0.22, -0.06, 0.04);
  const baseRightRot = new THREE.Euler(-0.12, -0.28, 0.12);

  return {
    handsGroup,

    update(delta: number, isMoving: boolean, isSprinting: boolean) {
      idleTime += delta;

      // 1. Idle Breathing Sway
      const breath = Math.sin(idleTime * 2.2) * 0.003;
      handsGroup.position.y = -0.22 + breath;

      // 2. Walking / Sprinting Bobbing
      if (isMoving) {
        const stepRate = isSprinting ? 14 : 9;
        walkPhase += delta * stepRate;
        const walkBobY = Math.sin(walkPhase * 2) * (isSprinting ? 0.016 : 0.009);
        const walkSwayX = Math.cos(walkPhase) * (isSprinting ? 0.012 : 0.006);

        leftArm.armGroup.position.y = baseLeftPos.y + walkBobY;
        leftArm.armGroup.position.x = baseLeftPos.x + walkSwayX;

        if (!isInteracting) {
          rightArm.armGroup.position.y = baseRightPos.y - walkBobY * 0.8;
          rightArm.armGroup.position.x = baseRightPos.x + walkSwayX * 0.8;
        }
      } else {
        // Return smoothly to rest
        leftArm.armGroup.position.lerp(baseLeftPos, 0.1);
        if (!isInteracting) {
          rightArm.armGroup.position.lerp(baseRightPos, 0.1);
        }
      }

      // 3. Hand Interaction Reach Animation
      if (isInteracting) {
        interactProgress += delta * 2.5; // ~0.4 - 0.6 second action duration

        if (interactProgress <= 1.0) {
          // Smooth sine curve: starts at 0, reaches 1 at t=0.5, returns to 0 at t=1.0
          const reachFactor = Math.sin(interactProgress * Math.PI);

          // Thrust right arm forward towards target in screen center
          rightArm.armGroup.position.z = baseRightPos.z - reachFactor * 0.22;
          rightArm.armGroup.position.y = baseRightPos.y + reachFactor * 0.07;
          rightArm.armGroup.position.x = baseRightPos.x - reachFactor * 0.12;

          if (currentActionType === 'valve') {
            // Handwheel turn: twist the wrist
            rightArm.armGroup.rotation.z = baseRightRot.z + reachFactor * 0.9;
          } else if (currentActionType === 'alarm') {
            // Point forward to push break-glass button
            rightArm.armGroup.rotation.x = baseRightRot.x - reachFactor * 0.4;
          } else {
            rightArm.armGroup.rotation.x = baseRightRot.x - reachFactor * 0.25;
          }
        } else {
          // Finished interaction, snap back cleanly
          isInteracting = false;
          interactProgress = 0;
          rightArm.armGroup.position.copy(baseRightPos);
          rightArm.armGroup.rotation.copy(baseRightRot);
        }
      }
    },

    triggerInteract(actionType = 'general') {
      isInteracting = true;
      interactProgress = 0;
      currentActionType = actionType;
    },

    updateGasLel(lelPercent: number) {
      drawLcd(lelPercent);
      if (led) {
        const mat = led.material as THREE.MeshBasicMaterial;
        if (lelPercent > 20) {
          mat.color.setHex(0xef4444); // Danger Red
        } else if (lelPercent > 8) {
          mat.color.setHex(0xf59e0b); // Warning Amber
        } else {
          mat.color.setHex(0x10b981); // Safe Green
        }
      }
    },

    setVisible(visible: boolean) {
      handsGroup.visible = visible;
    },

    dispose() {
      camera.remove(handsGroup);
      lcdTexture.dispose();
    }
  };
}
