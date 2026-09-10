// Zero-dependency Web Audio Synthesizer for Industrial Safety Simulations
// Generates realistic procedural audio: gas hissing, alarm siren, ventilation hum, Geiger gas sniffer, UI clicks

let audioCtx: AudioContext | null = null;
let gasLeakNode: { source: AudioBufferSourceNode; gain: GainNode; filter: BiquadFilterNode } | null = null;
let sirenOscillator: OscillatorNode | null = null;
let sirenLfo: OscillatorNode | null = null;
let sirenGain: GainNode | null = null;
let ventHumOsc: OscillatorNode | null = null;
let ventHumGain: GainNode | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// 1. Gas Leak Pressurized Hissing (Filtered White Noise)
export function startGasHissAudio(volume: number = 0.25): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (gasLeakNode) {
      gasLeakNode.gain.gain.setValueAtTime(Math.min(0.6, Math.max(0.01, volume)), ctx.currentTime);
      return;
    }

    // 2-second looped noise buffer
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Bandpass filter centered around 1800Hz for high-pressure gas jet hissing
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800, ctx.currentTime);
    filter.Q.setValueAtTime(1.2, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    whiteNoise.start(0);
    gasLeakNode = { source: whiteNoise, gain, filter };
  } catch {
    // Audio context may be restricted before user gesture
  }
}

export function updateGasHissDistance(distanceToLeak: number): void {
  if (!gasLeakNode || !audioCtx) return;
  // Volume drops off with distance (max volume within 2m, drops to near 0 at 12m)
  const maxDist = 12;
  const factor = Math.max(0, 1 - distanceToLeak / maxDist);
  const targetGain = Math.pow(factor, 1.8) * 0.35;
  gasLeakNode.gain.gain.setTargetAtTime(targetGain, audioCtx.currentTime, 0.1);
}

export function stopGasHissAudio(): void {
  if (gasLeakNode) {
    try {
      gasLeakNode.source.stop();
      gasLeakNode.source.disconnect();
    } catch {}
    gasLeakNode = null;
  }
}

// 2. Industrial Emergency Alarm Siren (Pulsating Two-Tone)
export function startEmergencyAlarmAudio(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx || sirenOscillator) return;

    const osc = ctx.createOscillator();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    const masterGain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // Base tone A5

    // LFO modulates frequency between 700Hz and 1100Hz at 2.5 Hz rate
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(2.5, ctx.currentTime);
    lfoGain.gain.setValueAtTime(220, ctx.currentTime);

    lfo.connect(osc.frequency);

    masterGain.gain.setValueAtTime(0.18, ctx.currentTime);
    osc.connect(masterGain);
    masterGain.connect(ctx.destination);

    osc.start();
    lfo.start();

    sirenOscillator = osc;
    sirenLfo = lfo;
    sirenGain = masterGain;
  } catch {}
}

export function stopEmergencyAlarmAudio(): void {
  if (sirenOscillator) {
    try {
      sirenOscillator.stop();
      sirenOscillator.disconnect();
      sirenLfo?.stop();
      sirenLfo?.disconnect();
    } catch {}
    sirenOscillator = null;
    sirenLfo = null;
    sirenGain = null;
  }
}

// 3. Ventilation Blower Fan Hum
export function startVentilationHumAudio(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx || ventHumOsc) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(110, ctx.currentTime); // Deep motor hum 110Hz

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    ventHumOsc = osc;
    ventHumGain = gain;
  } catch {}
}

export function stopVentilationHumAudio(): void {
  if (ventHumOsc) {
    try {
      ventHumOsc.stop();
      ventHumOsc.disconnect();
    } catch {}
    ventHumOsc = null;
    ventHumGain = null;
  }
}

// 4. Industrial Switch / Lever Click
export function playSwitchClickSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
  } catch {}
}

// 5. Portable Multi-Gas Detector Beep / Sniffer Alert
export function playGasSnifferAlert(dangerLevel: number = 1): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const freq = dangerLevel > 2 ? 2400 : 1800;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.08);
  } catch {}
}

// 6. Continuous Industrial Machinery Hum (Heavy Compressor & Pumps)
let machineryHumOsc: OscillatorNode | null = null;
let machineryHumGain: GainNode | null = null;

export function startMachineryHumAudio(volume: number = 0.08): void {
  try {
    const ctx = getAudioContext();
    if (!ctx || machineryHumOsc) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(58, ctx.currentTime); // 58 Hz industrial sub-hum

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(140, ctx.currentTime);

    gain.gain.setValueAtTime(volume, ctx.currentTime);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    machineryHumOsc = osc;
    machineryHumGain = gain;
  } catch {}
}

export function stopMachineryHumAudio(): void {
  if (machineryHumOsc) {
    try {
      machineryHumOsc.stop();
      machineryHumOsc.disconnect();
    } catch {}
    machineryHumOsc = null;
    machineryHumGain = null;
  }
}

// 7. Mechanical Valve Turn Metallic Ratchet
export function playValveTurnSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    for (let i = 0; i < 3; i++) {
      const time = ctx.currentTime + i * 0.09;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320 + i * 40, time);
      osc.frequency.exponentialRampToValueAtTime(140, time + 0.04);

      gain.gain.setValueAtTime(0.18, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(time);
      osc.stop(time + 0.04);
    }
  } catch {}
}

// 8. SCBA Respirator Breath Sound
export function playRespiratorBreathSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(240, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(180, ctx.currentTime + 0.4);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.45);
  } catch {}
}

// Cleanup all audio on unmount
export function stopAllIndustrialAudio(): void {
  stopGasHissAudio();
  stopEmergencyAlarmAudio();
  stopVentilationHumAudio();
  stopMachineryHumAudio();
}

