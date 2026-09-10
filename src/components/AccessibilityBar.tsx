import React, { useState } from 'react';
import { SupportedLanguage, AccessibilityConfig, TextScaleLevel } from '../types';
import { t, replayLastVoiceInstruction } from '../services/localizationService';
import {
  Volume2,
  VolumeX,
  Languages,
  Eye,
  Type,
  Sparkles,
  Sliders,
  RotateCcw,
  Presentation,
  BookOpen
} from 'lucide-react';

interface AccessibilityBarProps {
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  config: AccessibilityConfig;
  onUpdateConfig: (newConfig: Partial<AccessibilityConfig>) => void;
  onOpenLanguageModal: () => void;
  onOpenGlossary: () => void;
  onStartDemoMode: () => void;
  onOpenPresentation: () => void;
}

export const AccessibilityBar: React.FC<AccessibilityBarProps> = ({
  currentLanguage,
  onLanguageChange,
  config,
  onUpdateConfig,
  onOpenLanguageModal,
  onOpenGlossary,
  onStartDemoMode,
  onOpenPresentation
}) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  return (
    <aside aria-label="Accessibility &amp; Demo Controls" className="bg-slate-950/90 border-b border-slate-800/90 px-3 sm:px-6 py-2.5 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Language & Voice Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Language Selector Pill */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                currentLanguage === 'en'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('hi')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                currentLanguage === 'hi'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={onOpenLanguageModal}
              title="More Language Options"
              className="p-1 text-slate-400 hover:text-white rounded-md transition-colors"
            >
              <Languages className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Voice Guidance Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1.5 relative">
            <button
              onClick={() => onUpdateConfig({ voiceEnabled: !config.voiceEnabled })}
              title={config.voiceEnabled ? 'Voice Guidance Active' : 'Voice Guidance Muted'}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                config.voiceEnabled
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {config.voiceEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span className="hidden sm:inline">
                {config.voiceEnabled ? 'Voice ON' : 'Voice OFF'}
              </span>
            </button>

            {config.voiceEnabled && (
              <>
                <button
                  onClick={() => replayLastVoiceInstruction(config.voiceVolume)}
                  title={t('REPLAY_INSTRUCTION', currentLanguage)}
                  className="p-1 text-slate-400 hover:text-amber-400 rounded-md transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                  title="Adjust Volume"
                  className="p-1 text-slate-400 hover:text-white rounded-md transition-colors cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" />
                </button>

                {showVolumeSlider && (
                  <div className="absolute top-full mt-2 left-0 z-40 bg-slate-900 border border-slate-700 p-2.5 rounded-xl shadow-xl flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-mono">Vol</span>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={config.voiceVolume}
                      onChange={(e) =>
                        onUpdateConfig({ voiceVolume: parseFloat(e.target.value) })
                      }
                      className="w-20 accent-amber-500"
                    />
                    <span className="text-[10px] text-amber-400 font-mono w-6">
                      {Math.round(config.voiceVolume * 100)}%
                    </span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Text Size Multiplier Buttons */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1">
            <span className="text-[10px] text-slate-500 px-1 font-mono flex items-center gap-0.5">
              <Type className="w-3 h-3" />
            </span>
            {(['normal', 'large', 'xlarge'] as TextScaleLevel[]).map((lvl) => {
              const labels = { normal: '100%', large: '125%', xlarge: '150%' };
              const isSelected = config.textSize === lvl;
              return (
                <button
                  key={lvl}
                  onClick={() => onUpdateConfig({ textSize: lvl })}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {labels[lvl]}
                </button>
              );
            })}
          </div>

          {/* High Contrast Mode Toggle */}
          <button
            onClick={() => onUpdateConfig({ highContrast: !config.highContrast })}
            title="Toggle High Contrast for Sunlight / Low-light Viewing"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border font-medium transition-all cursor-pointer ${
              config.highContrast
                ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold shadow-md shadow-amber-950/40'
                : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden md:inline">High Contrast</span>
          </button>
        </div>

        {/* Right: Safety Terms & Help */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Safety Glossary Drawer Button */}
          <button
            onClick={onOpenGlossary}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold transition-colors cursor-pointer"
            title="Safety Terms & Definitions"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>{currentLanguage === 'hi' ? 'सुरक्षा नियम' : 'Safety Terms'}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
