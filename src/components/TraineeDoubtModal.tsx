import React, { useState, useEffect, useRef } from 'react';
import {
  HelpCircle,
  MessageSquare,
  Mic,
  MicOff,
  Send,
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
  Globe,
  Sparkles,
  ChevronRight,
  HardHat,
  RefreshCw
} from 'lucide-react';
import { SupportedLanguage, HelpRequestItem } from '../types';
import { AuthService } from '../services/authService';

interface TraineeDoubtModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: SupportedLanguage;
  currentScenarioName?: string;
  onVoiceSpeak?: (text: string) => void;
}

export const TraineeDoubtModal: React.FC<TraineeDoubtModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  currentScenarioName = 'General Workplace Safety',
  onVoiceSpeak
}) => {
  const [modalLang, setModalLang] = useState<SupportedLanguage>(currentLanguage);
  const [activeTab, setActiveTab] = useState<'ask' | 'list'>('ask');
  const [queryText, setQueryText] = useState('');
  const [selectedScenario, setSelectedScenario] = useState(currentScenarioName);
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [myDoubts, setMyDoubts] = useState<HelpRequestItem[]>([]);
  const [isLoadingDoubts, setIsLoadingDoubts] = useState(false);
  const [selectedDoubtId, setSelectedDoubtId] = useState<string | null>(null);
  const [followupText, setFollowupText] = useState('');

  const recognitionRef = useRef<any>(null);

  const isHi = modalLang === 'hi';

  useEffect(() => {
    if (isOpen) {
      loadMyDoubts();
    }
  }, [isOpen]);

  const loadMyDoubts = async () => {
    setIsLoadingDoubts(true);
    try {
      const requests = await AuthService.getMyHelpRequests();
      setMyDoubts(requests || []);
    } catch (err: any) {
      console.warn('Failed to load doubts:', err);
    } finally {
      setIsLoadingDoubts(false);
    }
  };

  const handleStartVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceNotice(
        isHi
          ? 'आपके ब्राउज़र में आवाज़ पहचान उपलब्ध नहीं है। कृपया लिखकर सवाल पूछें।'
          : 'Voice recognition is not supported in this browser. Please type your query.'
      );
      setTimeout(() => setVoiceNotice(null), 4000);
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch {}
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = isHi ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceNotice(
          isHi
            ? '🎤 बोलिए, सुरक्षा अधिकारी सुन रहा है...'
            : '🎤 Speak now, listening for your question...'
        );
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setQueryText(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setVoiceNotice(null);
      };

      recognition.start();
    } catch (err) {
      console.warn('Failed to start speech recognition:', err);
      setIsListening(false);
      setVoiceNotice(isHi ? 'आवाज़ पहचान शुरू करने में विफल।' : 'Failed to start speech recognition.');
    }
  };

  const handleSubmitDoubt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryText.trim()) {
      setErrorMessage(isHi ? 'कृपया अपना सवाल दर्ज करें।' : 'Please enter your doubt/question.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const newReq = await AuthService.submitTraineeHelpRequest({
        type: 'Safety Question',
        query: queryText.trim(),
        priority,
        language: modalLang,
        scenarioName: selectedScenario
      });

      setSuccessMessage(
        isHi
          ? 'आपका सवाल सुरक्षा अधिकारी/एडमिन को भेज दिया गया है।'
          : 'Your doubt has been sent to the Safety Officer/Admin.'
      );

      onVoiceSpeak?.(
        isHi
          ? 'आपका सवाल भेज दिया गया है।'
          : 'Your doubt has been submitted successfully.'
      );

      setQueryText('');
      await loadMyDoubts();

      setTimeout(() => {
        setSuccessMessage(null);
        setActiveTab('list');
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || (isHi ? 'सवाल भेजने में विफल।' : 'Failed to submit doubt.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendFollowup = async (doubtId: string) => {
    if (!followupText.trim()) return;

    try {
      const updated = await AuthService.replyToHelpRequest(doubtId, followupText.trim());
      setFollowupText('');
      await loadMyDoubts();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send reply.');
    }
  };

  if (!isOpen) return null;

  const selectedDoubt = myDoubts.find((d) => d.id === selectedDoubtId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <span>{isHi ? '🆘 संदेह और सहायता केंद्र' : '🆘 Doubt & Help Center'}</span>
              </h2>
              <p className="text-xs text-slate-400">
                {isHi
                  ? 'सुरक्षा अधिकारी या एडमिन से सीधे मार्गदर्शन प्राप्त करें।'
                  : 'Ask safety questions and get expert guidance from Safety Officers.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setModalLang('en')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  modalLang === 'en'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setModalLang('hi')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  modalLang === 'hi'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                हिंदी
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-6 gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('ask')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'ask'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{isHi ? '✍️ नया सवाल पूछें (Ask Doubt)' : '✍️ Ask a Doubt'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('list');
              loadMyDoubts();
            }}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'list'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>
              {isHi ? `📋 मेरे सवाल (${myDoubts.length})` : `📋 My Doubts (${myDoubts.length})`}
            </span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* TAB 1: ASK DOUBT */}
          {activeTab === 'ask' && (
            <form onSubmit={handleSubmitDoubt} className="space-y-4">
              <div className="p-3 rounded-2xl bg-blue-950/40 border border-blue-500/30 text-xs text-blue-200 flex items-center gap-2.5">
                <HardHat className="w-5 h-5 text-blue-400 shrink-0" />
                <div>
                  <strong className="block font-bold">
                    {isHi ? `सक्रिय परिदृश्य: ${selectedScenario}` : `Active Scenario: ${selectedScenario}`}
                  </strong>
                  <span className="text-slate-400 text-[11px]">
                    {isHi
                      ? 'आपका यह सवाल स्वचालित रूप से इस प्रशिक्षण मॉड्यूल के साथ दर्ज किया जाएगा।'
                      : 'Your query will be automatically tagged with this active training scenario.'}
                  </span>
                </div>
              </div>

              {/* Doubt Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>{isHi ? 'आपका सुरक्षा सवाल / संदेह:' : 'Your Safety Question / Doubt:'}</span>
                  <span className="text-[11px] text-amber-400 font-mono">
                    {modalLang.toUpperCase()}
                  </span>
                </label>

                <div className="relative">
                  <textarea
                    rows={4}
                    value={queryText}
                    onChange={(e) => setQueryText(e.target.value)}
                    placeholder={
                      isHi
                        ? 'उदा. "यदि बिजली का नंगा तार दिख जाए तो क्या करें?" या "कौन सा अग्निशामक यंत्र उपयोग करें?"'
                        : 'e.g., "What should I do if I see an exposed electrical cable?" or "Which extinguisher should I use?"'
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors leading-relaxed"
                  />

                  {/* Voice Button inside textarea area */}
                  <div className="absolute right-3 bottom-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleStartVoiceInput}
                      className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg ${
                        isListening
                          ? 'bg-rose-600 text-white animate-pulse'
                          : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700'
                      }`}
                      title={isHi ? 'बोलकर पूछें (Voice Input)' : 'Ask by Voice'}
                    >
                      <Mic className={`w-4 h-4 ${isListening ? 'animate-bounce' : ''}`} />
                      <span>{isListening ? (isHi ? 'सुन रहा है...' : 'Listening...') : (isHi ? '🎤 बोलकर पूछें' : '🎤 Ask by Voice')}</span>
                    </button>
                  </div>
                </div>

                {voiceNotice && (
                  <p className="text-xs text-amber-400 font-medium animate-pulse pt-1">
                    {voiceNotice}
                  </p>
                )}
              </div>

              {/* Priority Selection */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">
                    {isHi ? 'प्राथमिकता (Priority)' : 'Priority Level'}
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Low">{isHi ? 'कम (Low)' : 'Low Priority'}</option>
                    <option value="Medium">{isHi ? 'मध्यम (Medium)' : 'Medium Priority'}</option>
                    <option value="High">{isHi ? 'उच्च - आपातकालीन (High)' : 'High / Urgent'}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">
                    {isHi ? 'भाषा (Language)' : 'Selected Language'}
                  </label>
                  <input
                    type="text"
                    disabled
                    value={modalLang === 'hi' ? 'हिंदी (Hindi)' : 'English'}
                    className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl px-3 py-2 text-xs text-slate-400 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !queryText.trim()}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                      <span>{isHi ? 'सवाल भेजा जा रहा है...' : 'Sending Doubt...'}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{isHi ? 'सुरक्षा अधिकारी को सवाल भेजें' : 'Submit Doubt to Safety Officer'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: MY DOUBTS LIST */}
          {activeTab === 'list' && (
            <div className="space-y-4">
              {isLoadingDoubts ? (
                <div className="py-12 text-center text-slate-500">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-400" />
                  <span>{isHi ? 'आपके सवाल लोड हो रहे हैं...' : 'Loading your doubts...'}</span>
                </div>
              ) : myDoubts.length === 0 ? (
                <div className="py-12 text-center text-slate-400 bg-slate-950/50 rounded-2xl border border-slate-800 space-y-2">
                  <HelpCircle className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-sm font-bold text-slate-300">
                    {isHi ? 'अभी तक कोई सवाल नहीं पूछा गया है।' : 'No doubts or queries submitted yet.'}
                  </p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {isHi
                      ? 'पहला सवाल पूछने के लिए "नया सवाल पूछें" टैब पर जाएं।'
                      : 'Switch to the "Ask a Doubt" tab to send your first workplace safety query.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {myDoubts.map((doubt) => {
                    const isSelected = selectedDoubtId === doubt.id;
                    const statusBg =
                      doubt.status === 'Resolved'
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                        : doubt.status === 'In Progress'
                        ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                        : 'bg-rose-950/80 text-rose-300 border-rose-500/40';

                    return (
                      <div
                        key={doubt.id}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-950 border-amber-500/60 shadow-lg'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                        onClick={() => setSelectedDoubtId(isSelected ? null : doubt.id)}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-amber-400 font-bold">
                              {doubt.scenarioName || 'Safety Module'}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300 font-mono uppercase">
                              {doubt.language || 'en'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusBg}`}>
                              {doubt.status}
                            </span>
                            <span className="text-[11px] font-mono text-slate-500">
                              {new Date(doubt.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-200 font-medium leading-snug">
                          &ldquo;{doubt.query}&rdquo;
                        </p>

                        {/* Admin Reply or Thread Preview */}
                        {doubt.adminReply && (
                          <div className="mt-3 p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs space-y-1">
                            <div className="font-bold text-amber-300 flex items-center gap-1.5">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>{isHi ? 'सुरक्षा अधिकारी का जवाब:' : 'Safety Officer Reply:'}</span>
                            </div>
                            <p className="text-slate-300 leading-relaxed">{doubt.adminReply}</p>
                          </div>
                        )}

                        {/* Thread detail expansion */}
                        {isSelected && (
                          <div className="mt-3 pt-3 border-t border-slate-800 space-y-3" onClick={(e) => e.stopPropagation()}>
                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                              {isHi ? 'बातचीत का इतिहास (Conversation Thread)' : 'Conversation Thread'}
                            </div>

                            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                                <span className="font-bold text-amber-400 block mb-0.5">{doubt.traineeName} (Trainee)</span>
                                <p className="text-slate-200">{doubt.query}</p>
                              </div>

                              {doubt.adminReply && (
                                <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs">
                                  <span className="font-bold text-amber-300 block mb-0.5">Safety Officer / Admin</span>
                                  <p className="text-slate-200">{doubt.adminReply}</p>
                                </div>
                              )}
                            </div>

                            {doubt.status !== 'Resolved' && (
                              <div className="flex gap-2 pt-1">
                                <input
                                  type="text"
                                  value={followupText}
                                  onChange={(e) => setFollowupText(e.target.value)}
                                  placeholder={isHi ? 'संदेश या फॉलो-अप लिखें...' : 'Type follow-up message...'}
                                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleSendFollowup(doubt.id)}
                                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
                                >
                                  {isHi ? 'भेजें' : 'Send'}
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>DGMS &amp; IS 4770 Compliant Safety Helpdesk</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer transition-colors"
          >
            {isHi ? 'बंद करें' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
