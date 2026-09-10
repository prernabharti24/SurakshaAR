import React, { useState, useEffect } from 'react';
import { SupportedLanguage } from '../types';
import { PRESENTATION_SLIDES } from '../data/step7Data';
import {
  Presentation,
  ChevronLeft,
  ChevronRight,
  X,
  AlertTriangle,
  Sparkles,
  Layers,
  Cpu,
  Trophy,
  ShieldCheck,
  CheckCircle,
  Play
} from 'lucide-react';

interface PresentationModeModalProps {
  currentLanguage: SupportedLanguage;
  onClose: () => void;
  onLaunchDemoScenario: () => void;
}

export const PresentationModeModal: React.FC<PresentationModeModalProps> = ({
  currentLanguage,
  onClose,
  onLaunchDemoScenario
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const slide = PRESENTATION_SLIDES[currentSlideIndex];
  const totalSlides = PRESENTATION_SLIDES.length;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        setCurrentSlideIndex((prev) => Math.min(totalSlides - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlideIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalSlides, onClose]);

  const getSlideIcon = (name: string) => {
    switch (name) {
      case 'AlertTriangle':
        return <AlertTriangle className="w-6 h-6 text-rose-400" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-amber-400" />;
      case 'Layers':
        return <Layers className="w-6 h-6 text-sky-400" />;
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-purple-400" />;
      case 'Trophy':
        return <Trophy className="w-6 h-6 text-amber-400" />;
      default:
        return <ShieldCheck className="w-6 h-6 text-emerald-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-xl p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-5xl w-full h-[88vh] flex flex-col shadow-2xl relative overflow-hidden">
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold flex items-center gap-1.5">
              <Presentation className="w-3.5 h-3.5 text-amber-400" />
              SIH 26041 Presentation Mode
            </span>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              Slide {currentSlideIndex + 1} of {totalSlides}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onLaunchDemoScenario}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>Launch Live AR Drill</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Slide Canvas Content */}
        <div className="flex-1 p-6 sm:p-10 overflow-y-auto flex flex-col justify-between relative">
          <div className="space-y-6 max-w-4xl mx-auto w-full">
            {/* Header / Subtitle */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-[11px] font-mono text-cyan-300">
                  {slide.badge}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
                <div className="p-2 rounded-2xl bg-slate-800/80 border border-slate-700">
                  {getSlideIcon(slide.iconName)}
                </div>
                <span>{slide.title}</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-400 font-sans">
                {slide.subtitle}
              </p>
            </div>

            {/* Key Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {slide.keyStats.map((stat, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 flex flex-col justify-center"
                >
                  <span className={`text-2xl sm:text-3xl font-mono font-black ${stat.color}`}>
                    {stat.value}
                  </span>
                  <span className="text-xs text-slate-400 mt-1 font-medium">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Bullet Points */}
            <div className="space-y-3 pt-2">
              {slide.bulletPoints.map((pt, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 flex items-start gap-3.5 hover:border-slate-700 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 text-xs font-mono font-bold mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-0.5">{pt.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {pt.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Impact Callout Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-amber-400 shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-amber-200">
                {slide.impactCallout}
              </span>
            </div>
          </div>

          {/* Slide Navigation Controls */}
          <div className="pt-6 border-t border-slate-800/80 mt-6 flex items-center justify-between max-w-4xl mx-auto w-full">
            <button
              onClick={() => setCurrentSlideIndex((p) => Math.max(0, p - 1))}
              disabled={currentSlideIndex === 0}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                currentSlideIndex === 0
                  ? 'text-slate-600 bg-slate-900 border border-slate-800 cursor-not-allowed'
                  : 'text-white bg-slate-800 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Slide</span>
            </button>

            {/* Slide Indicator Dots */}
            <div className="flex items-center gap-2">
              {PRESENTATION_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlideIndex(i)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    i === currentSlideIndex
                      ? 'w-6 bg-amber-400 shadow-md shadow-amber-950/40'
                      : 'w-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() =>
                setCurrentSlideIndex((p) => Math.min(totalSlides - 1, p + 1))
              }
              disabled={currentSlideIndex === totalSlides - 1}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                currentSlideIndex === totalSlides - 1
                  ? 'text-slate-600 bg-slate-900 border border-slate-800 cursor-not-allowed'
                  : 'text-white bg-amber-500 hover:bg-amber-400 text-slate-950'
              }`}
            >
              <span>Next Slide</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
