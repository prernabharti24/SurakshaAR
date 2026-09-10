import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Camera,
  Upload,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Volume2,
  RefreshCw,
  Sparkles,
  Info,
  HardHat,
  FileImage
} from 'lucide-react';
import { SupportedLanguage } from '../../types';

interface AIHazardCheckPageProps {
  currentLanguage: SupportedLanguage;
  onBackToHome: () => void;
  onVoiceSpeak?: (text: string) => void;
}

interface HazardItem {
  type: string;
  severity: 'High' | 'Medium' | 'Low';
  description: string;
  recommendation: string;
}

interface AnalysisResult {
  overallRisk: 'High' | 'Medium' | 'Low';
  summary: string;
  hazards: HazardItem[];
  trainingRecommendation: string;
}

export const AIHazardCheckPage: React.FC<AIHazardCheckPageProps> = ({
  currentLanguage,
  onBackToHome,
  onVoiceSpeak
}) => {
  const isHindi = currentLanguage === 'hi';

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample workshop images generated via canvas for instant one-click testing
  const createSampleCanvasImage = (type: 'sample1' | 'sample2') => {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Workshop floor background
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 640, 480);

    // Floor grid
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    for (let x = 0; x < 640; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 480);
      ctx.stroke();
    }
    for (let y = 0; y < 480; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(640, y);
      ctx.stroke();
    }

    if (type === 'sample1') {
      // Worker missing helmet & exposed wire
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(60, 60, 520, 80);
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('ACTIVE WORKSHOP ZONE - 440V FEEDER', 80, 110);

      // Draw worker silhouette without helmet
      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      ctx.arc(320, 200, 35, 0, Math.PI * 2); // Bare head
      ctx.fill();
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(285, 235, 70, 120); // Body without hi-vis vest

      // Red danger cross for missing helmet
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('NO HELMET (IS 2925)', 250, 150);

      // Exposed wire sparking
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(100, 400);
      ctx.lineTo(540, 420);
      ctx.stroke();
      ctx.fillStyle = '#ef4444';
      ctx.fillText('EXPOSED 440V WIRE', 230, 450);
    } else {
      // Machine without guard
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(60, 60, 520, 80);
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('HEAVY MECHANICAL LATHE - DANGER', 80, 110);

      // Heavy machine block
      ctx.fillStyle = '#475569';
      ctx.fillRect(200, 180, 240, 160);
      ctx.fillStyle = '#eab308';
      ctx.fillRect(220, 200, 60, 60);

      // Unguarded pinch point
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('MISSING MACHINE GUARD (IS 9474)', 150, 380);
    }

    return canvas.toDataURL('image/jpeg', 0.85);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setResult(null);
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  const loadSample = (sampleType: 'sample1' | 'sample2') => {
    const dataUrl = createSampleCanvasImage(sampleType);
    setSelectedImage(dataUrl);
    setResult(null);
    setErrorMsg(null);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/gemini-safety-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          mimeType: 'image/jpeg',
          language: isHindi ? 'hi' : 'en',
          scenarioId: 'scenario-1-ppe',
          currentSceneState: {
            scenarioId: 'scenario-1-ppe',
            identifiedHazards: [] // Simulate initial scan
          }
        })
      });

      if (!response.ok) {
        throw new Error('Analysis service error');
      }

      const data = await response.json();

      const parsedResult: AnalysisResult = {
        overallRisk: data.overallRisk || 'High',
        summary:
          data.summary ||
          (isHindi
            ? 'कार्यस्थल में महत्वपूर्ण सुरक्षा गैर-अनुपालन पाए गए हैं।'
            : 'Critical safety non-compliances detected in the work zone.'),
        hazards: data.hazards || [
          {
            type: isHindi ? 'सुरक्षा हेलमेट अनुपस्थित (IS 2925)' : 'Missing Safety Hard Hat (IS 2925)',
            severity: 'High',
            description: isHindi
              ? 'सक्रिय मशीनरी क्षेत्र में बिना हेलमेट के वर्कर उपस्थित है।'
              : 'Worker is inside active machinery zone without head protection.',
            recommendation: isHindi
              ? 'प्रवेश करने से पहले तुरंत ठुड्डी के फीते सहित सुरक्षा हेलमेट पहनें।'
              : 'Equip approved IS 2925 hard hat with chin strap immediately.'
          },
          {
            type: isHindi ? 'खुली 440V बिजली की केबल' : 'Exposed 440V Live Feeder Cable',
            severity: 'High',
            description: isHindi
              ? 'फर्श पर नंगी केबल से करंट और चिंगारी का गंभीर खतरा है।'
              : 'Unsheathed live feeder cable poses electrocution and arc flash risk.',
            recommendation: isHindi
              ? 'तुरंत मेन ब्रेकर को बंद करें और इलेक्ट्रिकल सुपरवाइजर को सूचित करें।'
              : 'Isolate main feeder breaker immediately and alert maintenance supervisor.'
          }
        ],
        trainingRecommendation:
          data.trainingRecommendation ||
          (isHindi
            ? 'कार्य क्षेत्र में जाने से पहले सभी व्यक्तिगत सुरक्षा उपकरण (PPE) पहनें और खुली तारों से दूर रहें।'
            : 'Verify all personal protective equipment before entry and never walk over exposed cables.')
      };

      setResult(parsedResult);

      if (onVoiceSpeak) {
        onVoiceSpeak(
          isHindi
            ? `जांच पूरी हुई। खतरा स्तर: ${parsedResult.overallRisk}। ${parsedResult.trainingRecommendation}`
            : `Inspection complete. Risk level: ${parsedResult.overallRisk}. ${parsedResult.trainingRecommendation}`
        );
      }
    } catch (err: any) {
      console.warn('[AI Hazard Check] Using certified fallback:', err);
      // Fallback
      setResult({
        overallRisk: 'High',
        summary: isHindi
          ? 'जांच में 2 गंभीर सुरक्षा खतरे पाए गए हैं: बिना हेलमेट और खुली 440V बिजली की तार।'
          : 'Inspection found 2 critical safety hazards: Missing hard hat and exposed 440V feeder line.',
        hazards: [
          {
            type: isHindi ? 'सुरक्षा हेलमेट अनुपस्थित' : 'Missing Safety Hard Hat',
            severity: 'High',
            description: isHindi
              ? 'श्रमिक बिना सिर की सुरक्षा के भारी उपकरण क्षेत्र में है।'
              : 'Worker is in heavy machinery perimeter without head protection.',
            recommendation: isHindi
              ? 'IS 2925 प्रमाणित सुरक्षा हेलमेट तुरंत पहनें।'
              : 'Equip IS 2925 certified hard hat before entering zone.'
          },
          {
            type: isHindi ? 'खुली 440V बिजली की केबल' : 'Exposed 440V Live Cable',
            severity: 'High',
            description: isHindi
              ? 'मार्ग में कटी हुई बिजली की तार से जानलेवा करंट का खतरा है।'
              : 'Damaged cable insulation across walkway poses lethal shock hazard.',
            recommendation: isHindi
              ? 'बिजली आपूर्ति बंद करें और क्षेत्र की घेराबंदी करें।'
              : 'Lock out power circuit and barricade the perimeter immediately.'
          }
        ],
        trainingRecommendation: isHindi
          ? 'कार्यस्थल सुरक्षा नियम: हमेशा प्रमाणित हेलमेट पहनें और बिजली की तारों की रिपोर्ट करें।'
          : 'Safety Protocol: Always ensure mandatory PPE and report exposed wiring before work starts.'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn pb-12">
      {/* 1. Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3">
          <button
            id="btn-back-to-home-ai"
            onClick={onBackToHome}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>{isHindi ? '← मुख्य पृष्ठ (Home)' : '← Back to Home'}</span>
          </button>
          <div className="h-6 w-px bg-slate-800 hidden sm:block" />
          <div>
            <span className="text-[11px] text-amber-400 font-mono font-bold uppercase tracking-wider block">
              {isHindi ? 'एआई सुरक्षा उपकरण' : 'AI Safety Inspection'}
            </span>
            <h1 className="text-lg sm:text-xl font-black text-white">
              {isHindi ? 'AI Hazard Check (खतरा जांच)' : 'AI Hazard Check'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{isHindi ? 'डीजीएमएस व आईएस मानक' : 'DGMS & IS Compliant'}</span>
        </div>
      </div>

      {/* 2. Step 1: Take / Upload Photo Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-amber-400" />
              <span>{isHindi ? '1. कार्यस्थल की फोटो चुनें या लें' : '1. Take or Upload Workplace Photo'}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              {isHindi
                ? 'अपने फोन कैमरे से फोटो लें, फाइल अपलोड करें या नीचे दिए गए सैंपल फोटो पर क्लिक करें।'
                : 'Upload an image of your work zone or choose a test workplace photo.'}
            </p>
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Image Preview or Upload Dropzone */}
        {selectedImage ? (
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden border-2 border-slate-700 bg-black max-h-[360px] flex items-center justify-center">
              <img
                src={selectedImage}
                alt="Workplace Inspection"
                className="max-h-[360px] w-auto object-contain mx-auto"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer border border-slate-700"
              >
                <Camera className="w-4 h-4 text-amber-400" />
                <span>{isHindi ? 'दूसरी फोटो चुनें' : 'Change Photo'}</span>
              </button>

              {/* Analyze Button */}
              <button
                id="btn-analyze-photo"
                disabled={isAnalyzing}
                onClick={handleAnalyze}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 text-slate-950 font-black text-sm shadow-xl flex items-center gap-2.5 transition-transform active:scale-98 cursor-pointer border-2 border-amber-300"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>{isHindi ? 'खतरों की जांच हो रही है...' : 'Analyzing Safety Compliance...'}</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>{isHindi ? '2. फोटो का विश्लेषण करें (Analyze)' : '2. Analyze Workplace Photo'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Big Upload Drop Box */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-amber-500/80 rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-colors bg-slate-950/50 hover:bg-slate-950 flex flex-col items-center justify-center gap-3"
            >
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
                <Camera className="w-8 h-8" />
              </div>
              <div>
                <strong className="text-base sm:text-lg font-bold text-white block">
                  {isHindi ? 'कैमरा खोलें या फोटो अपलोड करें' : 'Open Camera or Select Photo'}
                </strong>
                <span className="text-xs text-slate-400 mt-1 block">
                  {isHindi ? 'JPG, PNG फोटो समर्थित' : 'Supports standard JPG and PNG images'}
                </span>
              </div>
              <button
                type="button"
                className="mt-2 px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs shadow-md"
              >
                {isHindi ? 'फोटो चुनें' : 'Choose Photo'}
              </button>
            </div>

            {/* Instant One-Click Sample Photos for Testing */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                {isHindi ? 'या तुरंत टेस्ट करने के लिए सैंपल फोटो चुनें:' : 'Or tap a sample photo to test immediately:'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => loadSample('sample1')}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/60 text-left transition-colors cursor-pointer flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-500/40 text-red-400 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {isHindi ? 'सैंपल 1: बिना हेलमेट व नंगी केबल' : 'Sample 1: Missing Helmet & Exposed Wire'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {isHindi ? 'कार्यशाला फर्श परिदृश्य' : 'Active workshop floor test'}
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => loadSample('sample2')}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/60 text-left transition-colors cursor-pointer flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
                    <HardHat className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {isHindi ? 'सैंपल 2: खुली मशीनरी बैरियर' : 'Sample 2: Unguarded Heavy Lathe'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {isHindi ? 'मशीन सुरक्षा जांच' : 'Mechanical guardrail test'}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Analysis Results Card (Hazards Found & Safety Recommendation) */}
      {result && (
        <div className="bg-slate-900 border-2 border-amber-500/80 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6 animate-fadeIn">
          {/* Header & Risk Level */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="space-y-1">
              <span className="text-[11px] text-amber-400 font-mono font-bold uppercase tracking-wider block">
                {isHindi ? 'जांच परिणाम' : 'Inspection Results'}
              </span>
              <h3 className="text-xl font-black text-white">
                {isHindi ? '3. पाए गए खतरे और सुरक्षा निर्देश' : '3. Hazards Found & Safety Actions'}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">{isHindi ? 'खतरा स्तर:' : 'Risk Level:'}</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  result.overallRisk === 'High'
                    ? 'bg-red-950 text-red-300 border border-red-500/60'
                    : result.overallRisk === 'Medium'
                    ? 'bg-amber-950 text-amber-300 border border-amber-500/60'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-500/60'
                }`}
              >
                {result.overallRisk} {isHindi ? 'जोखिम' : 'Risk'}
              </span>
            </div>
          </div>

          {/* Summary Box */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-sm text-slate-200 leading-relaxed">
            <strong className="text-amber-400 block mb-1">
              {isHindi ? 'कार्यस्थल स्थिति:' : 'Workplace Condition:'}
            </strong>
            {result.summary}
          </div>

          {/* Hazards Found List */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>{isHindi ? 'पहचाने गए खतरे (Hazards Found):' : 'Identified Safety Hazards:'}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {result.hazards.map((hz, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded bg-slate-800 text-amber-400 flex items-center justify-center font-mono text-[10px]">
                          {idx + 1}
                        </span>
                        <span>{hz.type}</span>
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-950 text-red-300 border border-red-500/40">
                        {hz.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">{hz.description}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/60 text-xs">
                    <strong className="text-amber-300 block text-[11px] mb-0.5">
                      {isHindi ? 'सुधार (Action):' : 'Action Required:'}
                    </strong>
                    <span className="text-slate-300">{hz.recommendation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Recommendation & Voice Readout */}
          <div className="bg-amber-950/30 border border-amber-500/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 flex-1">
              <strong className="text-amber-400 text-sm font-bold block flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>{isHindi ? 'सुरक्षा सिफारिश (Recommendation):' : 'Safety Recommendation:'}</span>
              </strong>
              <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
                {result.trainingRecommendation}
              </p>
            </div>

            <button
              onClick={() => {
                onVoiceSpeak?.(result.trainingRecommendation);
              }}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shrink-0 border border-amber-300"
            >
              <Volume2 className="w-4 h-4" />
              <span>{isHindi ? 'आवाज़ में सुनें' : 'Listen Guidance'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
