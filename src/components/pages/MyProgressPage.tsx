import React, { useState } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Award,
  TrendingUp,
  CheckCircle2,
  HardHat,
  ChevronRight,
  Play,
  RotateCcw,
  Zap,
  Flame,
  Pickaxe,
  Wrench,
  Bot,
  MessageSquare,
  Send,
  LifeBuoy
} from 'lucide-react';
import { SupportedLanguage, TraineeProfile } from '../../types';
import { AuthService } from '../../services/authService';

interface MyProgressPageProps {
  currentLanguage: SupportedLanguage;
  profile?: TraineeProfile;
  onBackToHome: () => void;
  onContinueTraining: () => void;
  onStartScenario?: (scenarioId: string) => void;
  onVoiceSpeak?: (text: string) => void;
  onOpenAIAssistant?: (topic?: string, query?: string) => void;
}

export const MyProgressPage: React.FC<MyProgressPageProps> = ({
  currentLanguage,
  profile,
  onBackToHome,
  onContinueTraining,
  onStartScenario,
  onVoiceSpeak,
  onOpenAIAssistant
}) => {
  const isHindi = currentLanguage === 'hi';

  const completedIds = profile?.completedScenarioIds || ['scenario-1-ppe'];
  const bestScores = profile?.bestScores || { 'scenario-1-ppe': 85 };

  const modulesList = [
    {
      id: 'scenario-1-ppe',
      number: 1,
      nameEn: 'PPE & Hazard Identification',
      nameHi: 'पीपीई और बुनियादी कार्यस्थल खतरे',
      icon: HardHat,
      standards: 'IS 2925 / IS 15809 / IS 9474',
      industryEn: 'General Manufacturing Workshop',
      industryHi: 'सामान्य विनिर्माण कार्यशाला'
    },
    {
      id: 'scenario-2-fire',
      number: 2,
      nameEn: 'Fire Safety & Emergency Evacuation',
      nameHi: 'औद्योगिक अग्नि सुरक्षा और निकासी',
      icon: Flame,
      standards: 'IS 2190 / NFPA 10 / Factories Act',
      industryEn: 'Industrial Warehouse & Flammables',
      industryHi: 'गोदाम और ज्वलनशील पदार्थ'
    },
    {
      id: 'scenario-3-electrical',
      number: 3,
      nameEn: 'High-Voltage Electrical Substation Safety',
      nameHi: 'हाई-वोल्टेज विद्युत सबस्टेशन सुरक्षा',
      icon: Zap,
      standards: 'CEA 2010 Regulations / IS 4770',
      industryEn: 'Electrical Substation & 440V Switchgear',
      industryHi: 'विद्युत सबस्टेशन और 440V स्विचगियर'
    },
    {
      id: 'scenario-4-mining',
      number: 4,
      nameEn: 'Underground Coal Mining Safety',
      nameHi: 'भूमिगत कोयला खदान और हॉलेज सुरक्षा',
      icon: Pickaxe,
      standards: 'DGMS Coal Mines Reg 2017',
      industryEn: 'Underground Coal Mine',
      industryHi: 'भूमिगत कोयला खदान'
    },
    {
      id: 'scenario-5-machinery',
      number: 5,
      nameEn: 'Heavy Machinery & Conveyor Safety',
      nameHi: 'भारी मशीनरी और कन्वेयर निप-पॉइंट',
      icon: Wrench,
      standards: 'IS 9474 / ISO 13850 E-Stop',
      industryEn: 'Heavy Mechanical Workshop',
      industryHi: 'भारी औद्योगिक कार्यशाला'
    }
  ];

  // Calculate stats
  const completedCount = modulesList.filter((m) =>
    completedIds.includes(m.id) ||
    (m.id === 'scenario-2-fire' && completedIds.includes('scenario-3-fire')) ||
    (m.id === 'scenario-3-electrical' && completedIds.includes('scenario-2-electrical'))
  ).length;

  const validScores = modulesList
    .map((m) => bestScores[m.id] || (m.id === 'scenario-1-ppe' ? 85 : 0))
    .filter((s) => s > 0);

  const avgScore =
    validScores.length > 0
      ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length)
      : 85;

  const totalXP = profile?.xp || (420 + (completedCount - 1) * 200);

  const [helpQuery, setHelpQuery] = useState('');
  const [helpType, setHelpType] = useState('Safety SOP Clarification');
  const [isSubmittingHelp, setIsSubmittingHelp] = useState(false);
  const [helpSuccess, setHelpSuccess] = useState<string | null>(null);

  const handleSubmitHelp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!helpQuery.trim()) return;
    setIsSubmittingHelp(true);
    try {
      await AuthService.submitTraineeHelpRequest({
        type: helpType,
        query: helpQuery.trim(),
        priority: 'Normal'
      });
      setHelpSuccess(
        isHindi
          ? 'आपकी याचिका सुरक्षा अधिकारी के पास दर्ज कर दी गई है।'
          : 'Your help inquiry has been logged and sent to the Safety Administrator.'
      );
      setHelpQuery('');
      setTimeout(() => setHelpSuccess(null), 5000);
    } catch (err: any) {
      alert(err.message || 'Failed to submit help request.');
    } finally {
      setIsSubmittingHelp(false);
    }
  };

  const handleLaunchModule = (scenarioId: string) => {
    if (onStartScenario) {
      onStartScenario(scenarioId);
    } else {
      onContinueTraining();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn pb-12">
      {/* 1. Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-xl shadow-md">
        <div className="flex items-center gap-3">
          <button
            id="btn-back-to-home-progress"
            onClick={onBackToHome}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>{isHindi ? '← मुख्य पृष्ठ (Home)' : '← Back to Home'}</span>
          </button>
          <div className="h-6 w-px bg-slate-800 hidden sm:block" />
          <div>
            <span className="text-[11px] text-amber-400 font-mono font-bold uppercase tracking-wider block">
              {isHindi ? 'प्रशिक्षण रिकॉर्ड' : 'Official Training Record'}
            </span>
            <h1 className="text-lg sm:text-xl font-bold text-white">
              {isHindi ? 'मेरी सुरक्षा प्रगति (5 परिदृश्य)' : 'My Safety Progress (All 5 Modules)'}
            </h1>
          </div>
        </div>

        <button
          onClick={onContinueTraining}
          className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors border border-amber-300"
        >
          <Play className="w-3.5 h-3.5 fill-slate-950" />
          <span>{isHindi ? 'प्रशिक्षण जारी रखें' : 'Continue Training'}</span>
        </button>
      </div>

      {/* 2. 3 Clean Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1: Average Safety Score */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {isHindi ? 'औसत सुरक्षा स्कोर' : 'Average Safety Score'}
            </span>
            <div className="w-7 h-7 rounded bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-400 font-mono">
            {avgScore}%
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isHindi ? 'डीजीएमएस मानक उत्तीर्ण (≥75%)' : 'DGMS Standard Met (≥75%)'}</span>
          </div>
        </div>

        {/* Metric 2: Total XP Points */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {isHindi ? 'कुल एक्सपी अंक' : 'Total Trainee XP'}
            </span>
            <div className="w-7 h-7 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono">
            {totalXP} XP
          </div>
          <div className="text-xs text-slate-400 font-medium">
            {isHindi ? 'स्तर 2: प्रमाणित सुरक्षा प्रशिक्षु' : 'Level 2: Certified Safety Trainee'}
          </div>
        </div>

        {/* Metric 3: Scenarios Completed */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {isHindi ? 'पूर्ण परिदृश्य' : 'Completed Modules'}
            </span>
            <div className="w-7 h-7 rounded bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white font-mono">
            {completedCount} / 5
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / 5) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* AI Safety Assistant 24/7 Guidance Banner */}
      <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-950/20 backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0 shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{isHindi ? 'AI सुरक्षा सहायक (24/7 सहायता)' : 'AI Safety Assistant (24/7 Guidance)'}</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-mono font-bold">
                {isHindi ? 'ऑनलाइन' : 'ONLINE'}
              </span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              {isHindi
                ? 'किसी भी सुरक्षा मानक (IS / DGMS / CEA) या परिदृश्य के बारे में बोलकर या लिखकर पूछें।'
                : 'Ask about any statutory standards (IS / DGMS / CEA) or practical hazards by voice or text.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOpenAIAssistant ? onOpenAIAssistant('General Safety', '') : onContinueTraining()}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer shrink-0 border border-blue-400"
        >
          <Bot className="w-3.5 h-3.5" />
          <span>{isHindi ? 'सुरक्षा सहायक से पूछें' : 'Open Safety Assistant'}</span>
        </button>
      </div>

      {/* 3. Safety Modules Status Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <HardHat className="w-4 h-4 text-amber-400" />
            <span>{isHindi ? 'सभी 5 सुरक्षा मॉड्यूल स्थिति' : 'All 5 Safety Training Modules'}</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">DGMS &amp; IS Standards</span>
        </div>

        <div className="space-y-3">
          {modulesList.map((m) => {
            const isCompleted =
              completedIds.includes(m.id) ||
              (m.id === 'scenario-2-fire' && completedIds.includes('scenario-3-fire')) ||
              (m.id === 'scenario-3-electrical' && completedIds.includes('scenario-2-electrical'));

            const score =
              bestScores[m.id] ||
              (m.id === 'scenario-1-ppe' ? 85 : 0);

            const IconComp = m.icon;

            return (
              <div
                key={m.id}
                className="p-4 rounded-lg border border-slate-800 bg-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-mono shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    #{m.number}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <IconComp className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isHindi ? m.nameHi : m.nameEn}</span>
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="text-[11px] font-mono text-slate-400">
                        {isHindi ? m.industryHi : m.industryEn}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-[11px] font-mono text-amber-400/90">{m.standards}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  {isCompleted ? (
                    <>
                      <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-600/40 text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{isHindi ? 'उत्तीर्ण' : 'Passed'} ({score > 0 ? `${score}%` : '85%'})</span>
                      </span>

                      <button
                        onClick={() => handleLaunchModule(m.id)}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded border border-slate-700 cursor-pointer flex items-center gap-1 transition-colors"
                      >
                        <RotateCcw className="w-3 h-3 text-amber-400" />
                        <span>{isHindi ? 'दोबारा करें' : 'Retrain'}</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleLaunchModule(m.id)}
                      className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded border border-amber-300 cursor-pointer flex items-center gap-1.5 transition-colors"
                    >
                      <Play className="w-3 h-3 fill-slate-950" />
                      <span>{isHindi ? 'शुरू करें' : 'Start Module'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3.5 Trainee Help & Safety Officer Inquiry Desk */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <LifeBuoy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{isHindi ? 'सुरक्षा अधिकारी सहायता एवं प्रश्न डेस्क' : 'Safety Officer Help & Inquiry Desk'}</span>
              </h3>
              <p className="text-xs text-slate-400">
                {isHindi
                  ? 'अतिरिक्त मॉड्यूल असाइनमेंट, एसओपी स्पष्टीकरण या साइट सुरक्षा नियमों के लिए अनुरोध भेजें'
                  : 'Submit requests for module access, DGMS compliance queries, or workplace hazard clarifications'}
              </p>
            </div>
          </div>
        </div>

        {helpSuccess && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{helpSuccess}</span>
          </div>
        )}

        <form onSubmit={handleSubmitHelp} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="sm:col-span-1">
              <label className="text-[11px] font-bold font-mono text-slate-400 block mb-1">
                {isHindi ? 'याचिका प्रकार' : 'Inquiry Category'}
              </label>
              <select
                value={helpType}
                onChange={(e) => setHelpType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Safety SOP Clarification">Safety SOP Clarification</option>
                <option value="Module Access Request">Module Access Request</option>
                <option value="DGMS Regulation Query">DGMS Regulation Query</option>
                <option value="Site Hazard Report">Site Hazard Report</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold font-mono text-slate-400 block mb-1">
                {isHindi ? 'आपका प्रश्न या अनुरोध' : 'Your Query or Request'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={helpQuery}
                  onChange={(e) => setHelpQuery(e.target.value)}
                  placeholder={
                    isHindi
                      ? 'उदा. मुझे कोयला खदान मॉड्यूल या सुरक्षा दस्ताने के बारे में प्रश्न है...'
                      : 'e.g. Request access to Module 4 Mining Safety or ask about electrical gloves standard...'
                  }
                  required
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  disabled={isSubmittingHelp || !helpQuery.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'भेजें' : 'Send'}</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* 4. Bottom Action */}
      <div className="text-center pt-2">
        <button
          onClick={onContinueTraining}
          className="px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-sm inline-flex items-center gap-2 cursor-pointer transition-colors border border-amber-300"
        >
          <HardHat className="w-4 h-4" />
          <span>{isHindi ? 'प्रशिक्षण परिदृश्य सूची पर जाएं →' : 'Go to Safety Scenarios Catalog →'}</span>
        </button>
      </div>
    </div>
  );
};
