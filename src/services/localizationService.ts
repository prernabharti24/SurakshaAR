import { SupportedLanguage, AccessibilityConfig } from '../types';
import { LOCALIZATION_DICTIONARY } from '../data/step7Data';

export const LANG_STORAGE_KEY = 'sih26041_selected_language';
export const ACCESSIBILITY_STORAGE_KEY = 'sih26041_accessibility_config';
export const FIRST_LAUNCH_STORAGE_KEY = 'sih26041_first_launch_done';

export const DEFAULT_ACCESSIBILITY_CONFIG: AccessibilityConfig = {
  textSize: 'normal',
  highContrast: false,
  voiceEnabled: true,
  voiceVolume: 0.85,
  colorIndependentIcons: true
};

export function loadAccessibilityConfig(): AccessibilityConfig {
  try {
    const saved = localStorage.getItem(ACCESSIBILITY_STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_ACCESSIBILITY_CONFIG, ...JSON.parse(saved) };
    }
  } catch {
    // fallback
  }
  return DEFAULT_ACCESSIBILITY_CONFIG;
}

export function saveAccessibilityConfig(config: AccessibilityConfig): void {
  try {
    localStorage.setItem(ACCESSIBILITY_STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
}

let lastSpokenText: { text: string; lang: SupportedLanguage } | null = null;
let currentAudioContext: AudioContext | null = null;

/**
 * Translates a key according to active language with fallback to English then key itself.
 */
export function t(key: string, lang: SupportedLanguage = 'en'): string {
  if (!key) return '';
  const langDict = LOCALIZATION_DICTIONARY[lang];
  if (langDict && langDict[key]) {
    return langDict[key];
  }
  // Fallback to English
  const enDict = LOCALIZATION_DICTIONARY['en'];
  if (enDict && enDict[key]) {
    return enDict[key];
  }
  return key;
}

/**
 * Speaks text using Web SpeechSynthesis API or synthetic chime fallback.
 */
export function speakVoiceGuidance(
  textOrKey: string,
  lang: SupportedLanguage,
  volume: number = 0.85,
  isKey: boolean = false
): void {
  const textToSpeak = isKey ? t(textOrKey, lang) : textOrKey;
  if (!textToSpeak) return;

  lastSpokenText = { text: textToSpeak, lang };

  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    playChimeTone(volume);
    return;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any pending speech

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.volume = Math.max(0, Math.min(1, volume));
    utterance.rate = lang === 'hi' ? 0.95 : 1.0;
    utterance.pitch = 1.0;

    // Pick appropriate voice
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      if (lang === 'hi') {
        const hindiVoice = voices.find(
          (v) => v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi')
        );
        if (hindiVoice) utterance.voice = hindiVoice;
        utterance.lang = 'hi-IN';
      } else {
        const englishVoice = voices.find(
          (v) => v.lang === 'en-IN' || v.lang === 'en-US' || v.lang.startsWith('en')
        );
        if (englishVoice) utterance.voice = englishVoice;
        utterance.lang = 'en-US';
      }
    }

    utterance.onerror = () => {
      // Fallback to chime on speech synthesis error
      playChimeTone(volume);
    };

    window.speechSynthesis.speak(utterance);
  } catch {
    playChimeTone(volume);
  }
}

/**
 * Plays a pleasant industrial notification chime tone as fallback or cue.
 */
export function playChimeTone(volume: number = 0.85): void {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    if (!currentAudioContext) {
      currentAudioContext = new AudioCtx();
    }
    if (currentAudioContext.state === 'suspended') {
      currentAudioContext.resume();
    }

    const osc = currentAudioContext.createOscillator();
    const gain = currentAudioContext.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, currentAudioContext.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, currentAudioContext.currentTime + 0.15); // A5

    gain.gain.setValueAtTime(volume * 0.2, currentAudioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, currentAudioContext.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(currentAudioContext.destination);

    osc.start();
    osc.stop(currentAudioContext.currentTime + 0.35);
  } catch {
    // Ignore audio context errors in quiet environments
  }
}

export function stopVoiceGuidance(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function replayLastVoiceInstruction(volume: number = 0.85): void {
  if (lastSpokenText) {
    speakVoiceGuidance(lastSpokenText.text, lastSpokenText.lang, volume, false);
  } else {
    speakVoiceGuidance('SCAN_FLOOR_INSTRUCTION', 'en', volume, true);
  }
}
