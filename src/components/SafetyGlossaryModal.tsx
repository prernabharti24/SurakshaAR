import React, { useState, useMemo } from 'react';
import { SupportedLanguage } from '../types';
import { SAFETY_TERMINOLOGY_GLOSSARY } from '../data/step7Data';
import { speakVoiceGuidance } from '../services/localizationService';
import {
  BookOpen,
  Search,
  Volume2,
  Shield,
  Zap,
  HardHat,
  Flame,
  Cog,
  FileCheck,
  X
} from 'lucide-react';

interface SafetyGlossaryModalProps {
  currentLanguage: SupportedLanguage;
  onClose: () => void;
  voiceVolume: number;
}

export const SafetyGlossaryModal: React.FC<SafetyGlossaryModalProps> = ({
  currentLanguage,
  onClose,
  voiceVolume
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [modalLang, setModalLang] = useState<SupportedLanguage>(currentLanguage);
  const [speakingTermId, setSpeakingTermId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: modalLang === 'hi' ? 'सभी शब्दावली' : 'All Terms' },
    { id: 'ppe', label: modalLang === 'hi' ? 'पीपीई उपकरण' : 'PPE Equipment' },
    { id: 'electrical', label: modalLang === 'hi' ? 'विद्युत सुरक्षा' : 'Electrical' },
    { id: 'mining', label: modalLang === 'hi' ? 'खनन सुरक्षा' : 'Mining' },
    { id: 'emergency', label: modalLang === 'hi' ? 'आपातकाल' : 'Emergency & Fire' },
    { id: 'machinery', label: modalLang === 'hi' ? 'मशीनरी आवरण' : 'Machinery Guard' }
  ];

  const filteredTerms = useMemo(() => {
    return SAFETY_TERMINOLOGY_GLOSSARY.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.termEn.toLowerCase().includes(q) ||
        item.termHi.toLowerCase().includes(q) ||
        item.definitionEn.toLowerCase().includes(q) ||
        item.definitionHi.toLowerCase().includes(q) ||
        (item.regulationRef && item.regulationRef.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleLanguageSwitch = (newLang: SupportedLanguage) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingTermId(null);
    setModalLang(newLang);
  };

  const handleSpeakTerm = (item: typeof SAFETY_TERMINOLOGY_GLOSSARY[0]) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    if (speakingTermId === item.id) {
      setSpeakingTermId(null);
      return;
    }

    const isHi = modalLang === 'hi';
    const termTitle = isHi ? item.termHi : item.termEn;
    const termDef = isHi ? item.definitionHi : item.definitionEn;
    const catLabel = isHi ? `श्रेणी: ${item.category}` : `Category: ${item.category}`;
    const standardText = item.regulationRef ? (isHi ? `मानक संदर्भ: ${item.regulationRef}` : `Standard Reference: ${item.regulationRef}`) : '';

    const fullNarration = `${termTitle}. ${catLabel}. ${termDef}. ${standardText}`;

    setSpeakingTermId(item.id);
    speakVoiceGuidance(fullNarration, modalLang, voiceVolume, false);

    // Reset speaking state when done (rough timeout or speech event simulation)
    const wordsCount = fullNarration.split(' ').length;
    const estimatedDurationMs = Math.max(3000, wordsCount * 280);
    setTimeout(() => {
      setSpeakingTermId((prev) => (prev === item.id ? null : prev));
    }, estimatedDurationMs);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ppe':
        return <HardHat className="w-4 h-4 text-amber-400" />;
      case 'electrical':
        return <Zap className="w-4 h-4 text-cyan-400" />;
      case 'emergency':
        return <Flame className="w-4 h-4 text-rose-400" />;
      case 'machinery':
        return <Cog className="w-4 h-4 text-purple-400" />;
      default:
        return <Shield className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/90 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>
                  {currentLanguage === 'hi'
                    ? 'औद्योगिक सुरक्षा शब्दावली'
                    : 'Industrial Safety Terminology'}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  DGMS &bull; CEA &bull; IS
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {currentLanguage === 'hi'
                  ? 'भारतीय औद्योगिक मानकों के अनुसार द्विभाषी शब्दावली (English & हिंदी)'
                  : 'Bilingual safety vocabulary standardized for Indian mining and manufacturing sectors'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/90 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  modalLang === 'hi'
                    ? 'शब्द खोजें (उदा. हेलमेट, लोटो, अर्थिंग, ग्लव्स, DGMS)...'
                    : 'Search terminology (e.g., Helmet, LOTO, Dielectric, DGMS)...'
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {/* Voice Language Switcher */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => handleLanguageSwitch('en')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  modalLang === 'en'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => handleLanguageSwitch('hi')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  modalLang === 'hi'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                हिंदी
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Terms List Grid */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
          {filteredTerms.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs font-mono">
              No matching safety terms found. Try a different search term.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredTerms.map((term) => (
                <div
                  key={term.id}
                  className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 space-y-2.5 hover:border-slate-700 transition-all shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(term.category)}
                        <span className="text-[10px] font-mono text-slate-400 uppercase">
                          {term.category}
                        </span>
                      </div>

                      <button
                        onClick={() => handleSpeakTerm(term)}
                        title={modalLang === 'hi' ? 'पूर्ण विवरण सुनें' : 'Listen to complete description'}
                        className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                          speakingTermId === term.id
                            ? 'bg-amber-500 text-slate-950 shadow-md animate-pulse'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        }`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{speakingTermId === term.id ? (modalLang === 'hi' ? 'बोल रहा है...' : 'Speaking...') : (modalLang === 'hi' ? '🔊 सुनें' : '🔊 Listen')}</span>
                      </button>
                    </div>

                    <div className="space-y-0.5">
                      <h4 className="text-sm font-bold text-white">{term.termEn}</h4>
                      <h5 className="text-sm font-semibold text-amber-400 font-sans">
                        {term.termHi}
                      </h5>
                    </div>

                    <div className="pt-1 space-y-1 text-xs text-slate-300 leading-relaxed border-t border-slate-900">
                      <p className="text-slate-400 text-[11px]">{term.definitionEn}</p>
                      <p className="text-slate-200 text-[11px]">{term.definitionHi}</p>
                    </div>
                  </div>

                  {term.regulationRef && (
                    <div className="pt-2 border-t border-slate-900/80 flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                      <FileCheck className="w-3 h-3 shrink-0" />
                      <span>Standard: {term.regulationRef}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 text-center text-xs text-slate-500 font-mono">
          DGMS Coal Mines Regulations 2017 &bull; Central Electricity Authority 2010 &bull; Bureau of Indian Standards (BIS)
        </div>
      </div>
    </div>
  );
};
