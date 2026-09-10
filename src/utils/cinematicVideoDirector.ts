import * as THREE from 'three';

export interface CinematicWaypoint {
  time: number; // Seconds in the video sequence
  pos: THREE.Vector3;
  target: THREE.Vector3;
  eventStage: number; // 1 to 5
  eventTitleEn: string;
  eventTitleHi: string;
  subtitleEn: string;
  subtitleHi: string;
  lelTarget: number;
  pressureBar: number;
  leakIntensity: number; // 0.0 to 1.0
  alarmActive: boolean;
}

export const CINEMATIC_TIMELINE: CinematicWaypoint[] = [
  {
    time: 0.0,
    pos: new THREE.Vector3(0.0, 1.65, 4.5),
    target: new THREE.Vector3(0.0, 1.5, 0.0),
    eventStage: 1,
    eventTitleEn: 'EVENT 01: Normal Plant Operation',
    eventTitleHi: 'घटना 01: सामान्य संयंत्र संचालन',
    subtitleEn: 'ENTERING GAS PROCESSING BAY: Commencing routine statutory safety inspection. Baseline atmosphere normal (0% LEL).',
    subtitleHi: 'गैस प्रसंस्करण बे में प्रवेश: नियमित वैधानिक सुरक्षा निरीक्षण शुरू। वायुमंडलीय स्तर सामान्य (0% LEL)।',
    lelTarget: 0,
    pressureBar: 28,
    leakIntensity: 0.0,
    alarmActive: false,
  },
  {
    time: 4.5,
    pos: new THREE.Vector3(-0.6, 1.65, 2.6),
    target: new THREE.Vector3(0.8, 1.2, 0.4),
    eventStage: 1,
    eventTitleEn: 'EVENT 01: Compressor Bay Walkthrough',
    eventTitleHi: 'घटना 01: कंप्रेसर बे वॉकथ्रू',
    subtitleEn: 'COMPRESSOR SKID A-102: Industrial pumps operating within safe parameters. Technicians on active shift.',
    subtitleHi: 'कंप्रेसर स्किड A-102: औद्योगिक पंप सुरक्षित मानकों के भीतर काम कर रहे हैं। तकनीशियन ड्यूटी पर हैं।',
    lelTarget: 1,
    pressureBar: 30,
    leakIntensity: 0.0,
    alarmActive: false,
  },
  {
    time: 8.5,
    pos: new THREE.Vector3(0.3, 1.65, 0.8),
    target: new THREE.Vector3(1.4, 1.5, -2.4),
    eventStage: 2,
    eventTitleEn: 'EVENT 02: Abnormal Pressure Indication',
    eventTitleHi: 'घटना 02: असामान्य दबाव संकेत',
    subtitleEn: '⚠️ PRESSURE SURGE DETECTED: Manifold Line #3 needle spiking into RED ZONE (78 BAR)! Pipe vibrating abnormally.',
    subtitleHi: '⚠️ दबाव में अचानक वृद्धि: मैनिफोल्ड लाइन #3 का कांटा लाल खतरे के क्षेत्र (78 BAR) में पहुंच गया! पाइप में कंपन।',
    lelTarget: 12,
    pressureBar: 78,
    leakIntensity: 0.15,
    alarmActive: false,
  },
  {
    time: 13.0,
    pos: new THREE.Vector3(1.1, 1.65, -1.2),
    target: new THREE.Vector3(1.6, 1.45, -2.8),
    eventStage: 3,
    eventTitleEn: 'EVENT 03: Flange Rupture & Gas Leak Starts',
    eventTitleHi: 'घटना 03: निकला हुआ किनारा टूटना और गैस रिसाव शुरू',
    subtitleEn: '🚨 FLANGE JOINT BREACH! High-pressure methane hissing violently from gasket. Explosive gas plume escaping into facility.',
    subtitleHi: '🚨 फ्लैंज जोड़ फटा! गैसकेट से अत्यधिक दबाव वाली मीथेन तेजी से रिस रही है। विस्फोटक गैस का रिसाव जारी।',
    lelTarget: 34,
    pressureBar: 92,
    leakIntensity: 0.65,
    alarmActive: false,
  },
  {
    time: 17.5,
    pos: new THREE.Vector3(0.6, 1.65, -0.4),
    target: new THREE.Vector3(1.6, 1.4, -2.8),
    eventStage: 4,
    eventTitleEn: 'EVENT 04: Hazard Becomes Critical',
    eventTitleHi: 'घटना 04: खतरा गंभीर स्थिति में पहुंचा',
    subtitleEn: '⚠️ CRITICAL RISK: Flammable gas cloud expanding! Atmospheric LEL exceeds 45%! Facility warning strobes activated.',
    subtitleHi: '⚠️ गंभीर जोखिम: ज्वलनशील गैस का बादल तेजी से फैल रहा है! LEL 45% से अधिक! चेतावनी स्ट्रोब सक्रिय।',
    lelTarget: 48,
    pressureBar: 88,
    leakIntensity: 1.0,
    alarmActive: true,
  },
  {
    time: 22.0,
    pos: new THREE.Vector3(0.3, 1.65, 0.4),
    target: new THREE.Vector3(1.6, 1.4, -2.8),
    eventStage: 5,
    eventTitleEn: 'EVENT 05: Trainee Control Enabled',
    eventTitleHi: 'घटना 05: प्रशिक्षु नियंत्रण सक्रिय',
    subtitleEn: '⚡ TAKE COMMAND OF INCIDENT: Pull Emergency Alarm -> Don SCBA Respirator -> Start Ventilation -> Isolate Valve!',
    subtitleHi: '⚡ आपातकालीन कार्रवाई करें: आपातकालीन अलार्म खींचें -> SCBA रेस्पिरेटर पहनें -> वेंटिलेशन शुरू करें -> वाल्व बंद करें!',
    lelTarget: 48,
    pressureBar: 85,
    leakIntensity: 1.0,
    alarmActive: true,
  }
];

export const TOTAL_CINEMATIC_DURATION = 22.0;

export interface CinematicFrameState {
  cameraPos: THREE.Vector3;
  cameraLookTarget: THREE.Vector3;
  currentStage: number;
  eventTitleEn: string;
  eventTitleHi: string;
  subtitleEn: string;
  subtitleHi: string;
  lelLevel: number;
  pressureBar: number;
  leakIntensity: number;
  isAlarmStrobeActive: boolean;
  isComplete: boolean;
}

// Smooth cubic easing
function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

export class CinematicVideoDirector {
  private currentTime: number = 0;
  private isPlaying: boolean = true;
  private playbackSpeed: number = 1.0;
  private isFinished: boolean = false;

  constructor() {
    this.reset();
  }

  public reset(): void {
    this.currentTime = 0;
    this.isPlaying = true;
    this.isFinished = false;
  }

  public play(): void {
    this.isPlaying = true;
  }

  public pause(): void {
    this.isPlaying = false;
  }

  public togglePlay(): boolean {
    this.isPlaying = !this.isPlaying;
    return this.isPlaying;
  }

  public seek(seconds: number): void {
    this.currentTime = Math.max(0, Math.min(TOTAL_CINEMATIC_DURATION, seconds));
    if (this.currentTime >= TOTAL_CINEMATIC_DURATION) {
      this.isFinished = true;
    } else {
      this.isFinished = false;
    }
  }

  public setPlaybackSpeed(speed: number): void {
    this.playbackSpeed = speed;
  }

  public getPlaybackSpeed(): number {
    return this.playbackSpeed;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentTime(): number {
    return this.currentTime;
  }

  public getDuration(): number {
    return TOTAL_CINEMATIC_DURATION;
  }

  public update(delta: number): CinematicFrameState {
    if (this.isPlaying && !this.isFinished) {
      this.currentTime += delta * this.playbackSpeed;
      if (this.currentTime >= TOTAL_CINEMATIC_DURATION) {
        this.currentTime = TOTAL_CINEMATIC_DURATION;
        this.isFinished = true;
        this.isPlaying = false;
      }
    }

    // Find current interval in waypoints
    let idx = 0;
    for (let i = 0; i < CINEMATIC_TIMELINE.length - 1; i++) {
      if (this.currentTime >= CINEMATIC_TIMELINE[i].time && this.currentTime <= CINEMATIC_TIMELINE[i + 1].time) {
        idx = i;
        break;
      }
      if (this.currentTime > CINEMATIC_TIMELINE[CINEMATIC_TIMELINE.length - 1].time) {
        idx = CINEMATIC_TIMELINE.length - 2;
      }
    }

    const p0 = CINEMATIC_TIMELINE[idx];
    const p1 = CINEMATIC_TIMELINE[Math.min(CINEMATIC_TIMELINE.length - 1, idx + 1)];

    const segmentDuration = p1.time - p0.time;
    const progress = segmentDuration > 0 ? (this.currentTime - p0.time) / segmentDuration : 1.0;
    const smoothT = smoothstep(Math.max(0, Math.min(1, progress)));

    // Camera position interpolation with subtle cinematic head-bob & handheld float
    const camPos = new THREE.Vector3().lerpVectors(p0.pos, p1.pos, smoothT);
    const floatBobX = Math.sin(this.currentTime * 2.2) * 0.02;
    const floatBobY = Math.cos(this.currentTime * 3.4) * 0.025;
    camPos.x += floatBobX;
    camPos.y += floatBobY;

    // Look target interpolation
    const lookTarget = new THREE.Vector3().lerpVectors(p0.target, p1.target, smoothT);

    // Numeric interpolations
    const lel = Math.round(p0.lelTarget + (p1.lelTarget - p0.lelTarget) * smoothT);
    const pressure = Math.round(p0.pressureBar + (p1.pressureBar - p0.pressureBar) * smoothT);
    const leak = p0.leakIntensity + (p1.leakIntensity - p0.leakIntensity) * smoothT;

    return {
      cameraPos: camPos,
      cameraLookTarget: lookTarget,
      currentStage: p1.eventStage,
      eventTitleEn: p1.eventTitleEn,
      eventTitleHi: p1.eventTitleHi,
      subtitleEn: p1.subtitleEn,
      subtitleHi: p1.subtitleHi,
      lelLevel: lel,
      pressureBar: pressure,
      leakIntensity: leak,
      isAlarmStrobeActive: p1.alarmActive || this.currentTime >= 16.0,
      isComplete: this.isFinished || this.currentTime >= TOTAL_CINEMATIC_DURATION,
    };
  }
}
