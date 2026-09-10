import React from 'react';
import { SupportedLanguage } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/step7Data';
import { Languages, Check, Sparkles } from 'lucide-react';

interface LanguageSelectionModalProps {
  currentLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  onClose: () => void;
  isFirstLaunch?: boolean;
}

export const LanguageSelectionModal: React.FC<LanguageSelectionModalProps> = ({
  currentLanguage,
  onSelectLanguage,
  onClose,
  isFirstLaunch = false
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Subtle accent backdrop */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 mx-auto flex items-center justify-center mb-1">
            <Languages className="w-6 h-6" />
          </div>

          <h2 className="text-xl font-bold text-white tracking-tight">
            {isFirstLaunch ? 'Select Training Language' : 'Change Language / भाषा बदलें'}
          </h2>

          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            Choose your preferred language for AR voice guidance, hazard descriptions, and DGMS safety recommendations.
          </p>
        </div>

        {/* Language Options Grid */}
        <div className="space-y-3">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = currentLanguage === lang.code;
            return (
              <button
                key={lang.code}
                id={`lang-select-${lang.code}`}
                onClick={() => {
                  onSelectLanguage(lang.code);
                  onClose();
                }}
                className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between group cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500 text-white shadow-lg shadow-amber-950/30'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-600 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-2xl" role="img" aria-label={lang.name}>
                    {lang.flagEmoji}
                  </span>
                  <div>
                    <div className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                      {lang.nativeName}
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      {lang.name} &bull; TTS Voice Active
                    </div>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                    isSelected
                      ? 'bg-amber-500 border-amber-400 text-slate-950'
                      : 'border-slate-700 text-transparent'
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Extensibility notice */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            Designed for modular expansion: Additional regional Indian languages (Odia, Bengali, Santhali) can be plugged in without changing scenario code.
          </span>
        </div>

        {!isFirstLaunch && (
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            Close / बंद करें
          </button>
        )}
      </div>
    </div>
  );
};
