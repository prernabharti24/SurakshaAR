// Web Audio API & Speech Synthesis Industrial Sound Engine for SURAKSHAAR
// 100% offline, zero-asset dependency, lightweight and mobile-safe

class SimulationAudioEngine {
  private ctx: AudioContext | null = null;
  private ambientNode: { osc: OscillatorNode; subOsc: OscillatorNode; gain: GainNode } | null = null;
  private isMuted: boolean = false;
  private isSpeaking: boolean = false;

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopAmbient();
      this.stopSpeech();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // 1. Ambient Industrial Workplace Hum
  public playAmbient(type: 'factory' | 'mining' | 'electrical' | 'heavy-machinery' = 'factory') {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    this.stopAmbient();

    try {
      const osc = ctx.createOscillator();
      const subOsc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      filter.type = 'lowpass';

      if (type === 'mining') {
        // Deeper subterranean rumble & air shaft hum
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(45, ctx.currentTime);
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(80, ctx.currentTime);
        filter.frequency.setValueAtTime(140, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
      } else if (type === 'electrical') {
        // 50Hz transformer core hum & 100Hz harmonic
        osc.type = 'sine';
        osc.frequency.setValueAtTime(50, ctx.currentTime);
        subOsc.type = 'triangle';
        subOsc.frequency.setValueAtTime(100, ctx.currentTime);
        filter.frequency.setValueAtTime(250, ctx.currentTime);
        gain.gain.setValueAtTime(0.035, ctx.currentTime);
      } else {
        // Manufacturing machinery hum
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(60, ctx.currentTime);
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(120, ctx.currentTime);
        filter.frequency.setValueAtTime(200, ctx.currentTime);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
      }

      osc.connect(filter);
      subOsc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      subOsc.start();

      this.ambientNode = { osc, subOsc, gain };
    } catch (e) {
      // Audio autoplay policy catch
    }
  }

  public stopAmbient() {
    if (this.ambientNode) {
      try {
        this.ambientNode.osc.stop();
        this.ambientNode.subOsc.stop();
        this.ambientNode.osc.disconnect();
        this.ambientNode.subOsc.disconnect();
      } catch (e) {}
      this.ambientNode = null;
    }
  }

  // 2. Emergency Siren / Alarm
  public playEmergencySiren(durationSeconds: number = 3) {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      gain.gain.setValueAtTime(0.12, ctx.currentTime);

      // Two-tone industrial emergency siren loop
      const now = ctx.currentTime;
      for (let i = 0; i < durationSeconds; i += 0.8) {
        osc.frequency.setValueAtTime(750, now + i);
        osc.frequency.linearRampToValueAtTime(520, now + i + 0.4);
        osc.frequency.linearRampToValueAtTime(750, now + i + 0.8);
      }

      gain.gain.setValueAtTime(0.12, now + durationSeconds - 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + durationSeconds);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + durationSeconds);
    } catch (e) {}
  }

  // 3. Electrical Arc / Spark Crackle Sound
  public playElectricalSpark() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const bufferSize = ctx.sampleRate * 0.35;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Noise bursts with sharp decay
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1800, ctx.currentTime);
      filter.Q.setValueAtTime(3, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.2, ctx.currentTime);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
    } catch (e) {}
  }

  // 4. Warning Alert Buzzer
  public playWarningBuzzer() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {}
  }

  // 5. Positive Success Chime
  public playSuccessChime() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
        gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + idx * 0.1 + 0.35);
      });
    } catch (e) {}
  }

  // 6. Action Error / Warning Tone
  public playUnsafeTone() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(90, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {}
  }

  // 7. Speech Synthesis Voice Narration
  public speak(
    text: string,
    isHindi: boolean,
    onEnd?: () => void
  ) {
    if (this.isMuted) {
      if (onEnd) onEnd();
      return;
    }
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = isHindi ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Pick best matching voice
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const targetLang = isHindi ? 'hi' : 'en';
      const voice = voices.find((v) => v.lang.startsWith(targetLang));
      if (voice) utterance.voice = voice;
    }

    utterance.onend = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };
    utterance.onerror = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    this.isSpeaking = true;
    window.speechSynthesis.speak(utterance);
  }

  public stopSpeech() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
    }
  }

  public stopAll() {
    this.stopAmbient();
    this.stopSpeech();
  }
}

export const simAudio = new SimulationAudioEngine();
