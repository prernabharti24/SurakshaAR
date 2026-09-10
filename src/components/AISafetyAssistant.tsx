import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Bot,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Trash2,
  Globe,
  Sparkles,
  HardHat,
  Flame,
  Zap,
  Pickaxe,
  Cog,
  AlertTriangle,
  X,
  ChevronRight,
  ShieldCheck,
  Camera,
  Image as ImageIcon,
  Copy,
  Check,
  RotateCcw,
  ShieldAlert,
  AlertOctagon,
  LifeBuoy
} from 'lucide-react';
import { SAFETY_TOPICS, findSafetyFallbackAnswer } from '../data/safetyKnowledgeBase';
import { SCENARIO_DEFINITIONS } from '../data/step5Data';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: 'gemini' | 'safety_knowledge_base';
  modelUsed?: string;
  scenarioContext?: string;
  isVoiceInput?: boolean;
  imagePreview?: string;
}

export interface SelectedHazardContext {
  id: string;
  titleEn: string;
  titleHi: string;
  categoryEn?: string;
  categoryHi?: string;
  severity?: string;
  standardEn?: string;
  standardHi?: string;
  descriptionEn?: string;
  descriptionHi?: string;
  isResolved?: boolean;
}

interface AISafetyAssistantProps {
  currentScenarioId?: string;
  onClose?: () => void;
  isEmbedded?: boolean;
  className?: string;
  initialCategory?: string;
  initialQuery?: string;
  autoSendInitialQuery?: boolean;
  selectedHazard?: SelectedHazardContext;
  onPerformCorrectiveAction?: () => void;
  autoSpeakResponse?: boolean;
}

// Category Definitions with quick prompt suggestions
const SAFETY_CATEGORIES = [
  {
    id: 'PPE',
    nameEn: 'PPE Safety',
    nameHi: 'सुरक्षा उपकरण (PPE)',
    icon: HardHat,
    color: 'border-blue-500/40 bg-blue-950/40 text-blue-300 hover:bg-blue-900/50',
    activeColor: 'border-blue-400 bg-blue-900/80 text-white shadow-blue-900/40',
    suggestions: [
      {
        en: 'What are the mandatory PPE rules for industrial work?',
        hi: 'कार्यस्थल पर हेलमेट और पीपीई (PPE) के क्या नियम हैं?'
      },
      {
        en: 'A worker is not wearing a hard hat, what immediate action to take?',
        hi: 'एक वर्कर ने हेलमेट नहीं पहना है, तुरंत क्या कदम उठाएं?'
      },
      {
        en: 'What are the Indian Standards (BIS) for safety shoes and eye goggles?',
        hi: 'सुरक्षा जूते और चश्मे के लिए भारतीय मानक (IS) क्या हैं?'
      }
    ]
  },
  {
    id: 'Fire',
    nameEn: 'Fire Safety',
    nameHi: 'अग्नि सुरक्षा (Fire)',
    icon: Flame,
    color: 'border-red-500/40 bg-red-950/40 text-red-300 hover:bg-red-900/50',
    activeColor: 'border-red-400 bg-red-900/80 text-white shadow-red-900/40',
    suggestions: [
      {
        en: 'What is the first step when a fire breaks out in the plant?',
        hi: 'कारखाने में आग लगने पर सबसे पहला कदम क्या उठाना चाहिए?'
      },
      {
        en: 'How to use an ABC Dry Chemical Extinguisher using the P-A-S-S rule?',
        hi: 'P-A-S-S नियम से अग्निशामक सिलेंडर का सही उपयोग कैसे करें?'
      },
      {
        en: 'Can we use water on an electrical panel fire?',
        hi: 'क्या बिजली के पैनल की आग पर पानी डाल सकते हैं?'
      }
    ]
  },
  {
    id: 'Electrical',
    nameEn: 'Electrical Safety',
    nameHi: 'विद्युत सुरक्षा (Electrical)',
    icon: Zap,
    color: 'border-amber-500/40 bg-amber-950/40 text-amber-300 hover:bg-amber-900/50',
    activeColor: 'border-amber-400 bg-amber-900/80 text-white shadow-amber-900/40',
    suggestions: [
      {
        en: 'What safety precautions are required near 440V electrical panels?',
        hi: 'इलेक्ट्रिकल पैनल और 440V के पास क्या सुरक्षा रखनी चाहिए?'
      },
      {
        en: 'How to rescue a coworker receiving an electric shock safely?',
        hi: 'करंट लगे हुए साथी को सुरक्षित तरीके से कैसे अलग करें?'
      },
      {
        en: 'What is the Lockout/Tagout (LOTO) procedure for electrical maintenance?',
        hi: 'बिजली मरम्मत के लिए LOTO (ताला-टैग) नियम क्या है?'
      }
    ]
  },
  {
    id: 'Mining',
    nameEn: 'Mining Safety',
    nameHi: 'खनन सुरक्षा (Mining)',
    icon: Pickaxe,
    color: 'border-stone-500/40 bg-stone-950/40 text-stone-300 hover:bg-stone-900/50',
    activeColor: 'border-stone-400 bg-stone-900/80 text-white shadow-stone-900/40',
    suggestions: [
      {
        en: 'What are the key DGMS safety rules for underground mines?',
        hi: 'भूमिगत खदानों के लिए DGMS के मुख्य सुरक्षा नियम क्या हैं?'
      },
      {
        en: 'How to avoid blind spot collisions with heavy mining haul dumpers?',
        hi: 'भारी माइनिंग डंपर के ब्लाइंड स्पॉट से कैसे बचें?'
      },
      {
        en: 'What to do if there is a warning of roof strata fall or toxic methane gas?',
        hi: 'खदान की छत में दरार दिखने या मीथेन गैस की गंध आने पर क्या करें?'
      }
    ]
  },
  {
    id: 'Machinery',
    nameEn: 'Machinery Safety',
    nameHi: 'मशीनरी सुरक्षा (Machinery)',
    icon: Cog,
    color: 'border-purple-500/40 bg-purple-950/40 text-purple-300 hover:bg-purple-900/50',
    activeColor: 'border-purple-400 bg-purple-900/80 text-white shadow-purple-900/40',
    suggestions: [
      {
        en: 'How to safely operate near conveyor rollers and moving pinch points?',
        hi: 'कन्वेयर रोलर और घूमती मशीन के पास सुरक्षित कैसे रहें?'
      },
      {
        en: 'When must the Red Mushroom Emergency Stop (E-Stop) button be pressed?',
        hi: 'लाल इमरजेंसी स्टॉप (E-Stop) बटन कब दबाना चाहिए?'
      },
      {
        en: 'Why is loose clothing strictly prohibited near machine shafts?',
        hi: 'मशीनों के पास ढीले कपड़े और चेन पहनना क्यों मना है?'
      }
    ]
  },
  {
    id: 'Hazard',
    nameEn: 'Hazard ID',
    nameHi: 'ख़तरा पहचान (Hazard ID)',
    icon: AlertTriangle,
    color: 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/50',
    activeColor: 'border-emerald-400 bg-emerald-900/80 text-white shadow-emerald-900/40',
    suggestions: [
      {
        en: 'How do I identify workplace safety hazards during daily inspection?',
        hi: 'काम शुरू करने से पहले कार्यस्थल पर खतरों की पहचान कैसे करें?'
      },
      {
        en: 'What should I do right now if I see an oil spill near walking path?',
        hi: 'रास्ते में तेल या पानी का फैलाव दिखने पर तुरंत क्या करें?'
      },
      {
        en: 'How do I report an unsafe condition or near-miss incident?',
        hi: 'असुरक्षित स्थिति या नियर-मिस (Near-Miss) घटना की रिपोर्ट कैसे करें?'
      }
    ]
  }
];

// Helper to parse the standardized 6-section safety framework:
// 🔴 RISK LEVEL, ⚠️ HAZARD, 🛡️ WHAT TO DO, 🚫 DO NOT, 🧰 REQUIRED PPE, 📌 PREVENTION
interface ParsedSafetyResponse {
  riskLevel?: { level: string; raw: string };
  hazard?: string;
  whatToDo?: string[];
  doNot?: string[];
  requiredPPE?: string;
  prevention?: string;
  rawText: string;
  isStructured: boolean;
}

function parseSafetyResponse(text: string): ParsedSafetyResponse {
  const result: ParsedSafetyResponse = {
    rawText: text,
    isStructured: false
  };

  const hasRisk = /🔴\s*RISK\s*LEVEL/i.test(text);
  const hasHazard = /⚠️\s*HAZARD/i.test(text);
  const hasWhatToDo = /🛡️\s*WHAT\s*TO\s*DO/i.test(text);

  if (!hasRisk && !hasHazard && !hasWhatToDo) {
    return result;
  }

  result.isStructured = true;

  // Extract Risk Level
  const riskMatch = text.match(/🔴\s*RISK\s*LEVEL[^\n:]*:\s*([^\n]+)/i);
  if (riskMatch) {
    const raw = riskMatch[1].trim();
    let level = 'Medium';
    if (/high|उच्च/i.test(raw)) level = 'High';
    else if (/low|निम्न/i.test(raw)) level = 'Low';
    result.riskLevel = { level, raw };
  }

  // Extract Hazard
  const hazardMatch = text.match(/⚠️\s*HAZARD[^\n:]*:\s*([\s\S]*?)(?=(?:🛡️|🚫|🧰|📌|$))/i);
  if (hazardMatch) {
    result.hazard = hazardMatch[1].trim();
  }

  // Extract What To Do
  const whatToDoMatch = text.match(/🛡️\s*WHAT\s*TO\s*DO[^\n:]*:\s*([\s\S]*?)(?=(?:🚫|🧰|📌|$))/i);
  if (whatToDoMatch) {
    const items = whatToDoMatch[1]
      .split(/\n+/)
      .map((line) => line.replace(/^[\d+.\-•*]\s*/, '').trim())
      .filter((line) => line.length > 0);
    result.whatToDo = items;
  }

  // Extract Do Not
  const doNotMatch = text.match(/🚫\s*DO\s*NOT[^\n:]*:\s*([\s\S]*?)(?=(?:🧰|📌|$))/i);
  if (doNotMatch) {
    const items = doNotMatch[1]
      .split(/\n+/)
      .map((line) => line.replace(/^[\d+.\-•*]\s*/, '').trim())
      .filter((line) => line.length > 0);
    result.doNot = items;
  }

  // Extract Required PPE
  const ppeMatch = text.match(/🧰\s*REQUIRED\s*PPE[^\n:]*:\s*([\s\S]*?)(?=(?:📌|$))/i);
  if (ppeMatch) {
    result.requiredPPE = ppeMatch[1].trim();
  }

  // Extract Prevention
  const prevMatch = text.match(/📌\s*PREVENTION[^\n:]*:\s*([\s\S]*?)$/i);
  if (prevMatch) {
    result.prevention = prevMatch[1].trim();
  }

  return result;
}

export const AISafetyAssistant: React.FC<AISafetyAssistantProps> = ({
  currentScenarioId = 'scenario-1-ppe',
  onClose,
  isEmbedded = false,
  className = '',
  initialCategory,
  initialQuery,
  autoSendInitialQuery = false,
  selectedHazard,
  onPerformCorrectiveAction,
  autoSpeakResponse = true
}) => {
  const [language, setLanguage] = useState<'hi' | 'en'>('hi');
  const [activeScenarioId, setActiveScenarioId] = useState<string>(currentScenarioId);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'PPE');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>(initialQuery || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Hazard Image Upload State
  const [attachedImageBase64, setAttachedImageBase64] = useState<string | null>(null);
  const [attachedImageMimeType, setAttachedImageMimeType] = useState<string>('image/jpeg');
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const autoSentQueryRef = useRef<string | null>(null);

  // Synchronize scenario if prop changes
  useEffect(() => {
    if (currentScenarioId) {
      setActiveScenarioId(currentScenarioId);
    }
  }, [currentScenarioId]);

  // Synchronize category if prop changes
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Synchronize input text if initialQuery changes
  useEffect(() => {
    if (initialQuery && initialQuery !== inputText) {
      setInputText(initialQuery);
    }
  }, [initialQuery]);

  // Initialize welcome message
  useEffect(() => {
    const activeScenarioDef = SCENARIO_DEFINITIONS.find((s) => s.id === activeScenarioId);
    const scenarioTitle = activeScenarioDef ? activeScenarioDef.name : 'General Industrial Safety';

    const welcomeMsgHi = `नमस्ते! मैं आपका **AI सुरक्षा सहायक (AI Safety Assistant)** हूँ।

कार्यस्थल सुरक्षा, DGMS और BIS मानकों के अनुसार आप मुझसे बोलकर 🎤, लिखकर ✍️ या कार्यस्थल की फोटो 📷 अपलोड करके कोई भी सवाल पूछ सकते हैं।

🏢 वर्तमान कार्यक्षेत्र: **${scenarioTitle}**

तुरंत मदद के लिए नीचे दी गई श्रेणियों में से चुनें या अपना सवाल पूछें:
• "वर्कर ने हेलमेट नहीं पहना है, क्या करें?"
• "आग लगने पर पहला कदम क्या है?"
• "440V बिजली के पास क्या सुरक्षा रखें?"
• "कैमरा 📷 से कार्यस्थल की फोटो लेकर खतरे की जांच करें।"`;

    const welcomeMsgEn = `Hello! I am your **AI Safety Assistant** for industrial workplace safety.

You can ask safety questions by voice 🎤, text ✍️, or by uploading a workplace photo 📷 for AI hazard detection.

🏢 Active Workplace Context: **${scenarioTitle}**

Select any safety category below or ask your own question:
• "A worker is missing their hard hat, what immediate action to take?"
• "What is the first step when a fire breaks out?"
• "What safety precautions apply near 440V electrical panels?"
• "Snap or upload a workplace photo 📷 to check for hazards."`;

    setMessages([
      {
        id: 'msg-welcome',
        sender: 'assistant',
        text: language === 'hi' ? welcomeMsgHi : welcomeMsgEn,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'safety_knowledge_base',
        modelUsed: 'SURAKSHAAR Safety Engine'
      }
    ]);
  }, [language, activeScenarioId]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isAnalyzingImage]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

  // Handle Speech-to-Text (Voice Input)
  const handleToggleVoiceInput = useCallback(() => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceNotice(
        language === 'hi'
          ? 'आपके ब्राउज़र में आवाज़ पहचान (Speech Recognition) उपलब्ध नहीं है। कृपया लिखकर सवाल पूछें।'
          : 'Voice recognition is not supported in this browser. Please type your query.'
      );
      setTimeout(() => setVoiceNotice(null), 4000);
      return;
    }

    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        setSpeakingMessageId(null);
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceNotice(
          language === 'hi'
            ? '🎤 बोलिए, सुरक्षा सहायक सुन रहा है...'
            : '🎤 Speak now, listening for safety question...'
        );
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputText(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setVoiceNotice(
            language === 'hi'
              ? 'कृपया माइक्रोफ़ोन की अनुमति (Permission) चालू करें।'
              : 'Microphone permission denied. Please allow microphone access.'
          );
        } else {
          setVoiceNotice(
            language === 'hi'
              ? 'आवाज़ साफ़ नहीं आई। कृपया दोबारा बोलें या लिखें।'
              : 'Speech not detected clearly. Please try again or type.'
          );
        }
        setTimeout(() => setVoiceNotice(null), 4000);
      };

      recognition.onend = () => {
        setIsListening(false);
        setVoiceNotice(null);
      };

      recognition.start();
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
    }
  }, [isListening, language]);

  // Handle Text-to-Speech (TTS)
  const handleSpeakText = (messageId: string, textToSpeak: string) => {
    if (!('speechSynthesis' in window)) {
      setVoiceNotice('Text-to-speech is not supported in this browser.');
      setTimeout(() => setVoiceNotice(null), 3000);
      return;
    }

    if (speakingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Clean text for natural speech
    const cleanText = textToSpeak
      .replace(/[*#_`~]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/🔴|⚠️|🛡️|🚫|🧰|📌|💡|🏢|🎤|✍️|📷/g, '')
      .replace(/•/g, ', ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utteranceRef.current = utterance;

    const hasDevanagari = /[\u0900-\u097F]/.test(cleanText);
    utterance.lang = hasDevanagari || language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      if (hasDevanagari || language === 'hi') {
        const hindiVoice = voices.find(
          (v) => v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi')
        );
        if (hindiVoice) utterance.voice = hindiVoice;
      } else {
        const enVoice = voices.find(
          (v) => v.lang.startsWith('en-IN') || v.lang.startsWith('en')
        );
        if (enVoice) utterance.voice = enVoice;
      }
    }

    utterance.onstart = () => {
      setSpeakingMessageId(messageId);
    };

    utterance.onend = () => {
      setSpeakingMessageId(null);
    };

    utterance.onerror = () => {
      setSpeakingMessageId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingMessageId(null);
  };

  // Handle Image File Selection (Hazard Photo)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert(language === 'hi' ? 'कृपया केवल फोटो फाइल चुनें।' : 'Please select a valid image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      setImagePreviewUrl(base64String);
      // Strip data:image/...;base64, prefix for backend payload
      const pureBase64 = base64String.split(',')[1];
      setAttachedImageBase64(pureBase64);
      setAttachedImageMimeType(file.type || 'image/jpeg');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setAttachedImageBase64(null);
    setImagePreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Copy Message Text
  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Send message to backend
  const handleSendMessage = async (customQuery?: string, isVoice = false) => {
    const queryToSend = (customQuery || inputText).trim();
    const hasImage = Boolean(attachedImageBase64);

    // If there's an image and no text, provide default hazard inspection prompt
    const finalQuery =
      queryToSend ||
      (hasImage
        ? language === 'hi'
          ? 'इस कार्यस्थल की फोटो में मौजूद खतरों की जांच करें और सुरक्षा सुझाव दें।'
          : 'Analyze this workplace image for safety hazards, missing PPE, and recommend immediate actions.'
        : '');

    if (!finalQuery && !hasImage) return;
    if (isLoading) return;

    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsListening(false);
    }

    handleStopSpeaking();

    const userMessageId = `user-${Date.now()}`;
    const newUserMessage: ChatMessage = {
      id: userMessageId,
      sender: 'user',
      text: finalQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isVoiceInput: isVoice || isListening,
      imagePreview: imagePreviewUrl || undefined
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputText('');
    const currentImageBase64 = attachedImageBase64;
    const currentMimeType = attachedImageMimeType;
    handleRemoveImage();
    setIsLoading(true);

    // Build recent conversation history
    const historyPayload = messages.slice(-4).map((m) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      text: m.text
    }));

    try {
      const response = await fetch('/api/ai-safety-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: finalQuery,
          language,
          scenarioId: activeScenarioId,
          conversationHistory: historyPayload,
          isVoice: Boolean(isVoice || isListening),
          imageBase64: currentImageBase64 || undefined,
          mimeType: currentMimeType || undefined
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();

      const newAssistantMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.answer || 'कृपया दोबारा प्रयास करें।',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source || 'gemini',
        modelUsed: data.modelUsed || 'SURAKSHAAR Gemini Safety AI',
        scenarioContext: data.scenarioContext
      };

      setMessages((prev) => [...prev, newAssistantMessage]);
      if (autoSpeakResponse || isVoice) {
        handleSpeakText(newAssistantMessage.id, newAssistantMessage.text);
      }
    } catch (err: any) {
      console.warn('AI Safety Assistant API call failed, using client fallback:', err);
      const fallback = findSafetyFallbackAnswer(finalQuery, language, activeScenarioId);
      const newAssistantMessage: ChatMessage = {
        id: `ai-fallback-${Date.now()}`,
        sender: 'assistant',
        text: fallback.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'safety_knowledge_base',
        modelUsed: 'SURAKSHAAR Certified Knowledge Base'
      };
      setMessages((prev) => [...prev, newAssistantMessage]);
      if (autoSpeakResponse || isVoice) {
        handleSpeakText(newAssistantMessage.id, newAssistantMessage.text);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-send initial query if requested
  useEffect(() => {
    if (autoSendInitialQuery && initialQuery && initialQuery.trim() && autoSentQueryRef.current !== initialQuery) {
      autoSentQueryRef.current = initialQuery;
      const t = setTimeout(() => {
        handleSendMessage(initialQuery, false);
      }, 350);
      return () => clearTimeout(t);
    }
  }, [autoSendInitialQuery, initialQuery]);

  const handleClearChat = () => {
    handleStopSpeaking();
    const activeScenarioDef = SCENARIO_DEFINITIONS.find((s) => s.id === activeScenarioId);
    const scenarioTitle = activeScenarioDef ? activeScenarioDef.name : 'General Industrial Safety';

    const welcomeText =
      language === 'hi'
        ? `चैट साफ़ कर दी गई है। वर्तमान कार्यक्षेत्र: **${scenarioTitle}**।\n\nआप मुझसे किसी भी सुरक्षा नियम, खतरे या पीपीई के बारे में सवाल पूछ सकते हैं।`
        : `Chat history cleared. Active workplace context: **${scenarioTitle}**.\n\nYou can ask any safety question or tap a category below.`;

    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: welcomeText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'safety_knowledge_base',
        modelUsed: 'SURAKSHAAR Safety Engine'
      }
    ]);
  };

  // Find active category definition for suggestions
  const currentCategoryDef =
    SAFETY_CATEGORIES.find((c) => c.id === selectedCategory) || SAFETY_CATEGORIES[0];

  return (
    <div
      id="ai-safety-assistant-container"
      className={`flex flex-col bg-slate-950 text-slate-100 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden ${
        isEmbedded ? 'h-[750px] w-full' : 'h-[90vh] max-h-[880px] w-full max-w-4xl mx-auto'
      } ${className}`}
    >
      {/* 1. FUTURISTIC INDUSTRIAL HEADER */}
      <div
        id="assistant-header"
        className="px-4 sm:px-6 py-4 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0 relative overflow-hidden"
      >
        {/* Top safety hazard stripe */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-amber-500 to-red-500" />

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-blue-900/40 border border-blue-400/40 shrink-0">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
                <span>{language === 'hi' ? 'सुरक्षा सहायक' : 'AI Safety Assistant'}</span>
              </h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1.5" />
                DGMS &amp; BIS 2026
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              {language === 'hi'
                ? 'औद्योगिक सुरक्षा विशेषज्ञ • हिंदी + English वॉइस'
                : 'Industrial Safety Expert • Voice + Vision Enabled'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {speakingMessageId && (
            <button
              id="btn-stop-speaking-header"
              onClick={handleStopSpeaking}
              className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-red-900/40 transition active:scale-95 animate-pulse cursor-pointer"
              title="Stop Speaking"
            >
              <VolumeX className="w-4 h-4" />
              <span>{language === 'hi' ? 'आवाज़ रोकें' : 'Stop Audio'}</span>
            </button>
          )}

          {/* Language Toggle */}
          <button
            id="btn-language-toggle"
            onClick={() => {
              handleStopSpeaking();
              setLanguage((prev) => (prev === 'hi' ? 'en' : 'hi'));
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            title="Toggle Language"
          >
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span>{language === 'hi' ? '🇮🇳 हिन्दी' : '🇬🇧 English'}</span>
          </button>

          {/* Clear Chat */}
          <button
            id="btn-clear-chat"
            onClick={handleClearChat}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition active:scale-95 cursor-pointer"
            title={language === 'hi' ? 'चैट साफ़ करें' : 'Clear Chat'}
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Close Modal */}
          {onClose && (
            <button
              id="btn-close-assistant"
              onClick={() => {
                handleStopSpeaking();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-red-950/80 text-slate-300 hover:text-white border border-slate-700 hover:border-red-500/40 transition active:scale-95 cursor-pointer"
              title="Close Assistant"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. SCENARIO CONTEXT BAR */}
      <div
        id="scenario-context-strip"
        className="px-4 sm:px-6 py-2 bg-slate-900/70 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300 gap-3 shrink-0 flex-wrap"
      >
        <div className="flex items-center gap-2">
          <span className="font-bold text-amber-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            {language === 'hi' ? 'सक्रिय कार्यक्षेत्र (Scenario Context):' : 'Workplace Context:'}
          </span>
          <select
            id="scenario-context-select"
            value={activeScenarioId}
            onChange={(e) => setActiveScenarioId(e.target.value)}
            className="bg-slate-950 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-blue-500 transition font-medium"
          >
            {SCENARIO_DEFINITIONS.map((def) => (
              <option key={def.id} value={def.id}>
                {def.shortTitle || def.name}
              </option>
            ))}
          </select>
        </div>

        <span className="text-slate-400 hidden sm:inline text-[11px]">
          {language === 'hi'
            ? '💡 "अभी क्या करें?" पूछने पर AI इस कार्यक्षेत्र के अनुसार उत्तर देगा'
            : '💡 Grounded in active scenario for accurate step-by-step guidance'}
        </span>
      </div>

      {/* 3. SAFETY CATEGORIES BAR */}
      <div
        id="safety-categories-bar"
        className="px-4 sm:px-6 py-2.5 bg-slate-950/90 border-b border-slate-800 overflow-x-auto flex items-center gap-2 shrink-0 scrollbar-thin scrollbar-thumb-slate-800"
      >
        <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 shrink-0 mr-1 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          {language === 'hi' ? 'श्रेणी (Category):' : 'Category:'}
        </span>

        {SAFETY_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              id={`cat-btn-${cat.id.toLowerCase()}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95 ${
                isSelected ? cat.activeColor : cat.color
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? cat.nameHi : cat.nameEn}</span>
            </button>
          );
        })}
      </div>

      {/* 4. CATEGORY SUGGESTIONS CHIPS */}
      <div
        id="category-suggestions-chips"
        className="px-4 sm:px-6 py-2 bg-slate-900/40 border-b border-slate-800/60 overflow-x-auto flex items-center gap-2 shrink-0 scrollbar-thin scrollbar-thumb-slate-800 text-xs"
      >
        <span className="text-[11px] font-semibold text-slate-400 shrink-0">
          {language === 'hi' ? 'सुझाव सवाल:' : 'Suggestions:'}
        </span>
        {currentCategoryDef.suggestions.map((sug, idx) => {
          const sugText = language === 'hi' ? sug.hi : sug.en;
          return (
            <button
              key={idx}
              id={`sug-btn-${currentCategoryDef.id.toLowerCase()}-${idx}`}
              onClick={() => handleSendMessage(sugText)}
              disabled={isLoading}
              className="px-3 py-1 rounded-lg bg-slate-800/80 hover:bg-blue-600/30 hover:border-blue-400/60 text-slate-300 hover:text-white border border-slate-700/60 text-[11px] font-medium whitespace-nowrap transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {sugText}
            </button>
          );
        })}
      </div>

      {/* 5. VOICE RECORDING NOTIFICATION BANNER */}
      {voiceNotice && (
        <div
          id="voice-notice-banner"
          className="px-4 py-2 bg-blue-950/80 border-b border-blue-800/80 text-blue-200 text-xs flex items-center justify-between transition animate-fadeIn shrink-0"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            <span className="font-semibold">{voiceNotice}</span>
          </div>
          <button
            onClick={() => setVoiceNotice(null)}
            className="text-blue-300 hover:text-white p-0.5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 6. MAIN CHAT MESSAGES AREA */}
      <div
        id="chat-messages-container"
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900/50"
      >
        {/* SELECTED HAZARD ACTIVE CONTEXT CARD */}
        {selectedHazard && (
          <div className="p-3.5 rounded-xl bg-slate-900 border border-amber-500/40 shadow-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-red-950 text-red-400 border border-red-800">
                  {selectedHazard.severity || 'Critical'}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {language === 'hi' ? selectedHazard.categoryHi : selectedHazard.categoryEn}
                </span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                selectedHazard.isResolved
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                  : 'bg-amber-950 text-amber-300 border-amber-500 animate-pulse'
              }`}>
                {selectedHazard.isResolved
                  ? (language === 'hi' ? 'सुरक्षित (SAFE)' : 'SAFE / RESOLVED')
                  : (language === 'hi' ? '⚠️ सक्रिय खतरा' : '⚠️ HAZARD ACTIVE')}
              </span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{language === 'hi' ? selectedHazard.titleHi : selectedHazard.titleEn}</span>
              </h4>
              {(selectedHazard.descriptionHi || selectedHazard.descriptionEn) && (
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {language === 'hi' ? selectedHazard.descriptionHi : selectedHazard.descriptionEn}
                </p>
              )}
              {(selectedHazard.standardHi || selectedHazard.standardEn) && (
                <div className="mt-1 text-[10px] font-mono text-amber-400">
                  <strong>{language === 'hi' ? 'मानक:' : 'Standard:'}</strong> {language === 'hi' ? selectedHazard.standardHi : selectedHazard.standardEn}
                </div>
              )}
            </div>

            {onPerformCorrectiveAction && !selectedHazard.isResolved && (
              <button
                type="button"
                onClick={onPerformCorrectiveAction}
                className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer border border-emerald-400"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? '⚡ 3D सिमुलेटर में कार्रवाई लागू करें' : '⚡ Perform Action & Remediate in 3D'}</span>
              </button>
            )}
          </div>
        )}

        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isCurrentlySpeaking = speakingMessageId === msg.id;
          const parsed = !isUser ? parseSafetyResponse(msg.text) : null;

          return (
            <div
              key={msg.id}
              id={`chat-message-${msg.id}`}
              className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md border border-blue-400/40 shrink-0 mt-1">
                  <Bot className="w-5 h-5" />
                </div>
              )}

              <div
                className={`max-w-[90%] sm:max-w-[82%] rounded-2xl p-4 sm:p-5 shadow-xl border transition ${
                  isUser
                    ? 'bg-blue-950/70 text-white border-blue-500/40 rounded-tr-sm'
                    : 'bg-slate-900 text-slate-100 border-slate-800 rounded-tl-sm ring-1 ring-white/5'
                }`}
              >
                {/* Header in bubble */}
                <div className="flex items-center justify-between gap-3 text-[11px] mb-3 pb-2 border-b border-white/10 text-slate-400">
                  <div className="flex items-center gap-2 font-bold">
                    <span>{isUser ? 'Trainee / Worker' : 'AI Safety Assistant'}</span>
                    {msg.isVoiceInput && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] bg-blue-900/60 text-blue-300 border border-blue-500/40 font-mono">
                        <Mic className="w-2.5 h-2.5" />
                        Voice
                      </span>
                    )}
                    {!isUser && msg.source === 'gemini' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 font-mono">
                        <Sparkles className="w-2.5 h-2.5" />
                        Gemini AI
                      </span>
                    )}
                    {!isUser && msg.source === 'safety_knowledge_base' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] bg-amber-950/60 text-amber-300 border border-amber-500/40 font-mono">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        DGMS Certified
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                </div>

                {/* User Attached Image (Hazard Photo) */}
                {isUser && msg.imagePreview && (
                  <div className="mb-3 rounded-xl overflow-hidden border border-blue-400/40 shadow-md max-w-sm">
                    <img
                      src={msg.imagePreview}
                      alt="Uploaded workplace situation"
                      className="w-full max-h-56 object-cover"
                    />
                    <div className="bg-slate-950/80 px-2.5 py-1 text-[11px] text-blue-300 font-mono flex items-center gap-1">
                      <Camera className="w-3 h-3" />
                      Workplace Hazard Photo
                    </div>
                  </div>
                )}

                {/* Assistant Message Rendering: Structured 6-Section Framework vs Clean Plain Text */}
                {!isUser && parsed && parsed.isStructured ? (
                  <div className="space-y-3.5 select-text">
                    {/* 1. Risk Level Card */}
                    {parsed.riskLevel && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wide border shadow-md ${
                            parsed.riskLevel.level === 'High'
                              ? 'bg-red-500/20 text-red-300 border-red-500/50 shadow-red-950/50'
                              : parsed.riskLevel.level === 'Medium'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-amber-950/50'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-emerald-950/50'
                          }`}
                        >
                          <AlertOctagon className="w-4 h-4" />
                          <span>{parsed.riskLevel.raw}</span>
                        </span>
                      </div>
                    )}

                    {/* 2. Hazard Description */}
                    {parsed.hazard && (
                      <div className="bg-amber-950/30 border border-amber-500/40 rounded-xl p-3 text-sm text-amber-200 leading-relaxed">
                        <strong className="block text-amber-300 font-bold mb-1 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                          ⚠️ HAZARD (पहचाना गया ख़तरा)
                        </strong>
                        <p>{parsed.hazard}</p>
                      </div>
                    )}

                    {/* 3. What To Do (Action Steps) */}
                    {parsed.whatToDo && parsed.whatToDo.length > 0 && (
                      <div className="space-y-1.5">
                        <strong className="block text-blue-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-blue-400" />
                          🛡️ WHAT TO DO (सुरक्षित कदम)
                        </strong>
                        <div className="space-y-1.5">
                          {parsed.whatToDo.map((step, idx) => (
                            <div
                              key={idx}
                              className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 text-xs sm:text-sm text-slate-200 flex items-start gap-2.5"
                            >
                              <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-300 border border-blue-400/40 text-[11px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span className="flex-1 leading-snug">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 4. Do Not (Prohibitions) */}
                    {parsed.doNot && parsed.doNot.length > 0 && (
                      <div className="bg-red-950/25 border border-red-500/30 rounded-xl p-3 text-xs sm:text-sm text-red-200 leading-relaxed">
                        <strong className="block text-red-400 font-bold mb-1.5 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                          <ShieldAlert className="w-4 h-4 text-red-400" />
                          🚫 DO NOT (क्या भूलकर भी न करें)
                        </strong>
                        <ul className="space-y-1 pl-1">
                          {parsed.doNot.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-red-400 font-bold">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* 5. Required PPE */}
                    {parsed.requiredPPE && (
                      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-slate-200">
                        <strong className="block text-emerald-300 font-bold mb-1 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                          <HardHat className="w-4 h-4 text-emerald-400" />
                          🧰 REQUIRED PPE (अनिवार्य सुरक्षा उपकरण)
                        </strong>
                        <p className="text-slate-300">{parsed.requiredPPE}</p>
                      </div>
                    )}

                    {/* 6. Prevention */}
                    {parsed.prevention && (
                      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-slate-200">
                        <strong className="block text-cyan-300 font-bold mb-1 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                          <LifeBuoy className="w-4 h-4 text-cyan-400" />
                          📌 PREVENTION (भविष्य में रोकथाम)
                        </strong>
                        <p className="text-slate-300">{parsed.prevention}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-normal select-text text-slate-100">
                    {msg.text}
                  </div>
                )}

                {/* Footer Controls for AI Message: Audio Listen & Copy Text */}
                {!isUser && (
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <button
                        id={`btn-tts-${msg.id}`}
                        onClick={() => handleSpeakText(msg.id, msg.text)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer ${
                          isCurrentlySpeaking
                            ? 'bg-red-600 text-white animate-pulse'
                            : 'bg-slate-800 hover:bg-slate-700 text-blue-300 hover:text-white border border-slate-700'
                        }`}
                        title={isCurrentlySpeaking ? 'Stop speaking' : 'Listen aloud'}
                      >
                        {isCurrentlySpeaking ? (
                          <>
                            <VolumeX className="w-4 h-4" />
                            <span>{language === 'hi' ? 'बोलना बंद करें ⏹' : 'Stop ⏹'}</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-4 h-4 text-blue-400" />
                            <span>{language === 'hi' ? '🔊 सुनें (Listen)' : '🔊 Listen'}</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleCopyText(msg.id, msg.text)}
                        className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1 transition cursor-pointer"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 text-[11px]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="text-[11px]">Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <span className="text-[10px] text-slate-500 font-mono">
                      {msg.modelUsed || 'SURAKSHAAR AI'}
                    </span>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-9 h-9 rounded-xl bg-blue-700 flex items-center justify-center text-white border border-blue-500/40 shrink-0 mt-1 font-bold text-xs shadow-md">
                  TR
                </div>
              )}
            </div>
          );
        })}

        {/* LOADING INDICATOR */}
        {isLoading && (
          <div className="flex items-start gap-3 justify-start animate-fadeIn">
            <div className="w-9 h-9 rounded-xl bg-blue-700 flex items-center justify-center text-white shrink-0 mt-1 animate-pulse shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-slate-900 text-slate-200 border border-slate-800 rounded-2xl rounded-tl-sm p-4 shadow-xl flex items-center gap-3">
              <div className="flex space-x-1.5">
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-bounce" />
              </div>
              <span className="text-xs text-slate-300 font-semibold">
                {language === 'hi'
                  ? 'सुरक्षा नियमों एवं 6-चरणीय सुरक्षा ढांचे की जांच की जा रही है...'
                  : 'Formulating 6-section safety analysis & risk evaluation...'}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 7. INPUT TRAY & HAZARD IMAGE PREVIEW */}
      <div
        id="assistant-input-tray"
        className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800 shrink-0 space-y-2.5"
      >
        {/* Hidden File Input for Hazard Image Upload / Camera */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageFileChange}
          className="hidden"
          id="hazard-photo-input"
        />

        {/* Image Attachment Preview Bar */}
        {imagePreviewUrl && (
          <div className="flex items-center gap-3 bg-slate-950 border border-blue-500/40 p-2.5 rounded-2xl animate-fadeIn">
            <img
              src={imagePreviewUrl}
              alt="Hazard snapshot preview"
              className="w-14 h-14 object-cover rounded-xl border border-blue-400/40 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-white block truncate">
                {language === 'hi' ? 'कार्यस्थल फोटो संलग्न' : 'Workplace Photo Attached'}
              </span>
              <span className="text-[11px] text-blue-300 block">
                {language === 'hi'
                  ? 'AI से खतरे की पहचान कराने के लिए "भेजें" दबाएं'
                  : 'Press Send to run AI Hazard Identification'}
              </span>
            </div>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-900/60 text-slate-300 hover:text-red-300 border border-slate-700 transition cursor-pointer"
              title="Remove photo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 sm:gap-3"
        >
          {/* Camera / Image Upload Button */}
          <button
            type="button"
            id="btn-upload-hazard-photo"
            onClick={() => fileInputRef.current?.click()}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition shadow-lg shrink-0 cursor-pointer ${
              imagePreviewUrl
                ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 active:scale-95'
            }`}
            title={
              language === 'hi'
                ? 'कार्यस्थल की फोटो अपलोड करें / कैमरे से लें'
                : 'Upload or capture workplace hazard photo'
            }
          >
            <Camera className="w-5 h-5" />
          </button>

          {/* Large Voice Input Button */}
          <button
            type="button"
            id="btn-voice-input"
            onClick={handleToggleVoiceInput}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition shadow-lg shrink-0 cursor-pointer ${
              isListening
                ? 'bg-red-600 text-white ring-4 ring-red-500/40 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 border border-slate-700 active:scale-95'
            }`}
            title={
              isListening
                ? language === 'hi'
                  ? 'सुनना बंद करें'
                  : 'Stop listening'
                : language === 'hi'
                ? 'बोलकर सवाल पूछें (माइक्रोफ़ोन)'
                : 'Ask by voice (Microphone)'
            }
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input */}
          <div className="relative flex-1">
            <input
              id="assistant-text-input"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isListening
                  ? language === 'hi'
                    ? 'सुन रहा हूँ... बोलिए'
                    : 'Listening... please speak'
                  : imagePreviewUrl
                  ? language === 'hi'
                    ? 'फोटो के बारे में सवाल पूछें या सीधे भेजें...'
                    : 'Ask about this photo or send to analyze...'
                  : language === 'hi'
                  ? 'सुरक्षा सवाल पूछें (बोलकर 🎤 या लिखकर ✍️)...'
                  : 'Ask any safety question (voice or text)...'
              }
              disabled={isLoading}
              className="w-full h-12 px-4 pr-10 rounded-2xl bg-slate-950 text-white placeholder-slate-400 border border-slate-700 focus:outline-none focus:border-blue-500 text-sm sm:text-base font-medium shadow-inner transition"
            />
            {inputText && (
              <button
                type="button"
                onClick={() => setInputText('')}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Send Button */}
          <button
            type="submit"
            id="btn-send-message"
            disabled={(!inputText.trim() && !imagePreviewUrl) || isLoading}
            className="w-12 h-12 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white flex items-center justify-center transition shadow-lg shadow-blue-900/30 shrink-0 active:scale-95 border border-blue-400/30 cursor-pointer disabled:cursor-not-allowed"
            title="Send Question"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

        {/* Footnote guidance */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-0.5">
          <span>
            {language === 'hi'
              ? '🎤 बोलें • 📷 फोटो अपलोड करें • 🔊 उत्तर सुनें • 🔴 जोखिम स्तर और 6-चरण नियम'
              : '🎤 Voice input • 📷 Hazard photo detection • 🔊 Text-to-Speech • 🔴 6-Section Framework'}
          </span>
          <span className="hidden sm:inline text-slate-400 font-mono">
            DGMS / BIS:8032 / CEA 2010
          </span>
        </div>
      </div>
    </div>
  );
};
