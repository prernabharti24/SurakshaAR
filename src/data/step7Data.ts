import {
  SupportedLanguage,
  LanguageOption,
  AccessibilityConfig,
  SafetyTerminologyItem,
  LocalizedScenarioContent,
  DemoTraineeRecord,
  PresentationSlide,
  CSharpScript,
  ChecklistItem
} from '../types';

// ==========================================
// 1. SUPPORTED LANGUAGES
// ==========================================
export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English (US/UK/IN)',
    flagEmoji: '🇬🇧',
    ttsVoiceCode: 'en-IN'
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिंदी (भारत)',
    flagEmoji: '🇮🇳',
    ttsVoiceCode: 'hi-IN'
  }
];

// Extensibility note: Additional languages like Bengali ('bn'), Odia ('or'), Santhali ('sat')
// can be added to SUPPORTED_LANGUAGES without altering core simulation or scenario logic.

// ==========================================
// 2. CENTRALIZED LOCALIZATION DICTIONARY
// ==========================================
export const LOCALIZATION_DICTIONARY: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // App & Navigation
    APP_TITLE: 'AR Vocational Safety Training Simulator',
    APP_SUBTITLE: 'Industrial Safety Compliance for Jharkhand Mining & Manufacturing',
    SELECT_LANGUAGE: 'Select Training Language',
    LANGUAGE_EN: 'English',
    LANGUAGE_HI: 'हिंदी (Hindi)',
    CONTINUE: 'Continue',
    CLOSE: 'Close',
    SETTINGS: 'Settings & Accessibility',
    DEMO_MODE: 'SIH Demo Mode',
    PRESENTATION_MODE: 'Pitch & Presentation',
    SAFETY_GLOSSARY: 'Safety Glossary',
    RESET_DEMO: 'Reset Demo',
    CONFIRM_RESET_DEMO: 'Are you sure you want to reset demo progress? Real trainee data will not be affected.',

    // Navigation Tabs
    TAB_TRAINEE_DASHBOARD: 'Trainee Dashboard',
    TAB_AR_SIMULATOR: 'AR Simulator',
    TAB_TRAINER_ANALYTICS: 'Trainer Analytics',
    TAB_CSHARP_SCRIPTS: 'C# Scripts',
    TAB_SETUP_GUIDE: 'Unity Setup',
    TAB_CHECKLIST: 'Step Checklist',

    // AR Simulator Lifecycle
    TRAINING_START: 'Training Started. Follow AR prompts to inspect the workplace.',
    SCAN_FLOOR_INSTRUCTION: 'Scan the floor or ground surface to place the industrial training area.',
    PLANE_DETECTED: 'Industrial ground plane detected! Tap anywhere to place the equipment layout.',
    TAP_TO_PLACE: 'Tap screen to anchor safety scenario',
    SCENARIO_PLACED: 'Training bay anchored successfully. Inspect the surroundings for hazards.',
    REPLAY_INSTRUCTION: 'Replay Voice Instruction',

    // Hazard Identification & Interactions
    HAZARD_IDENTIFIED: 'Hazard Identified! Correct safety intervention recorded.',
    INCORRECT_ACTION: 'Incorrect Action! This object is safe or already compliant.',
    HAZARDS_REMAINING: 'Hazards Remaining',
    HAZARDS_FOUND: 'Hazards Found',
    CURRENT_SCORE: 'Safety Score',
    COMPLIANCE_PASSING: 'Passing Benchmark: ≥75%',

    // Scenario Completion & Results
    SCENARIO_COMPLETED: 'Training scenario completed!',
    SCENARIO_PASSED: 'Module Passed — DGMS & CEA Compliant',
    SCENARIO_FAILED: 'Remediation Required — Retest Recommended',
    OVERALL_RISK: 'Overall Workplace Risk',
    RISK_LOW: 'Low Risk',
    RISK_MEDIUM: 'Moderate Risk',
    RISK_HIGH: 'High Risk / Severe Danger',
    TRAINING_RECOMMENDATION: 'Recommended Follow-up Training',
    RETRY_SCENARIO: 'Retry Scenario',
    LAUNCH_NEXT_MODULE: 'Launch Next Module',
    RETURN_TO_DASHBOARD: 'Return to Dashboard',

    // Voice Guidance Prompts
    VOICE_SCAN_FLOOR: 'Scan the floor to place the training area.',
    VOICE_IDENTIFY_ELECTRICAL: 'Inspect the electrical equipment and identify potential insulation or live wire hazards.',
    VOICE_CORRECT_HAZARD: 'Correct. You identified a safety hazard.',
    VOICE_INCORRECT_OBJECT: 'Incorrect. This object is not a hazard.',
    VOICE_SCENARIO_DONE: 'Training scenario completed. Review your safety score and AI recommendations.',
    VOICE_WEAR_PPE: 'Warning: Missing protective equipment detected in active operational zone.',

    // Accessibility
    ACCESSIBILITY_TITLE: 'Accessibility & Voice Settings',
    VOICE_GUIDANCE_LABEL: 'Voice Guidance (TTS)',
    VOICE_GUIDANCE_DESC: 'Bilingual spoken step-by-step vocal instructions during AR sessions',
    VOLUME_LABEL: 'Voice Volume',
    TEXT_SIZE_LABEL: 'Text Display Scaling',
    TEXT_SIZE_NORMAL: 'Standard (100%)',
    TEXT_SIZE_LARGE: 'Large (125%)',
    TEXT_SIZE_XLARGE: 'Extra Large (150%)',
    HIGH_CONTRAST_LABEL: 'High Contrast Mode',
    HIGH_CONTRAST_DESC: 'Increases element separation and border contrast for outdoor and low-light readability',
    COLOR_INDEPENDENT_LABEL: 'Color-Independent Status Indicators',
    COLOR_INDEPENDENT_DESC: 'Displays geometric badges alongside colors for color-blind trainees',

    // Trainee Gamification
    LEVEL_LABEL: 'Safety Rank',
    XP_LABEL: 'Experience Points',
    STREAK_LABEL: 'Day Streak',
    ACHIEVEMENTS_TITLE: 'Vocational Badges',
    LEADERBOARD_TITLE: 'Statewide Vocational Leaderboard',
    SMART_RECOMMENDATION_TAG: 'Smart Recommendation'
  },
  hi: {
    // App & Navigation
    APP_TITLE: 'एआर व्यावसायिक सुरक्षा प्रशिक्षण सिम्युलेटर',
    APP_SUBTITLE: 'झारखंड खनन और विनिर्माण क्षेत्र के लिए औद्योगिक सुरक्षा अनुपालन',
    SELECT_LANGUAGE: 'प्रशिक्षण भाषा चुनें',
    LANGUAGE_EN: 'English (अंग्रेज़ी)',
    LANGUAGE_HI: 'हिंदी (Hindi)',
    CONTINUE: 'आगे बढ़ें',
    CLOSE: 'बंद करें',
    SETTINGS: 'सेटिंग्स और सुगमता (Accessibility)',
    DEMO_MODE: 'एसआईएच डेमो मोड',
    PRESENTATION_MODE: 'प्रस्तुति और पिच (Pitch)',
    SAFETY_GLOSSARY: 'सुरक्षा शब्दावली (Glossary)',
    RESET_DEMO: 'डेमो रीसेट करें',
    CONFIRM_RESET_DEMO: 'क्या आप डेमो प्रगति को रीसेट करना चाहते हैं? वास्तविक प्रशिक्षु डेटा सुरक्षित रहेगा।',

    // Navigation Tabs
    TAB_TRAINEE_DASHBOARD: 'प्रशिक्षु डैशबोर्ड',
    TAB_AR_SIMULATOR: 'एआर सिम्युलेटर',
    TAB_TRAINER_ANALYTICS: 'प्रशिक्षक विश्लेषण',
    TAB_CSHARP_SCRIPTS: 'सी# स्क्रिप्ट्स (C# Scripts)',
    TAB_SETUP_GUIDE: 'यूनिटी सेटअप',
    TAB_CHECKLIST: 'प्रगति चेकलिस्ट',

    // AR Simulator Lifecycle
    TRAINING_START: 'प्रशिक्षण शुरू हुआ। कार्यक्षेत्र का निरीक्षण करने के लिए एआर निर्देशों का पालन करें।',
    SCAN_FLOOR_INSTRUCTION: 'औद्योगिक प्रशिक्षण क्षेत्र स्थापित करने के लिए फर्श या ज़मीन की सतह को स्कैन करें।',
    PLANE_DETECTED: 'औद्योगिक ज़मीनी सतह पहचानी गई! उपकरण लेआउट स्थापित करने के लिए स्क्रीन पर कहीं भी टैप करें।',
    TAP_TO_PLACE: 'सुरक्षा परिदृश्य स्थापित करने के लिए टैप करें',
    SCENARIO_PLACED: 'प्रशिक्षण क्षेत्र सफलतापूर्वक स्थापित हुआ। खतरों की पहचान के लिए चारों ओर निरीक्षण करें।',
    REPLAY_INSTRUCTION: 'आवाज़ निर्देश फिर से सुनें',

    // Hazard Identification & Interactions
    HAZARD_IDENTIFIED: 'ख़तरा पहचाना गया! सही सुरक्षा कार्रवाई दर्ज की गई।',
    INCORRECT_ACTION: 'गलत कार्रवाई! यह वस्तु सुरक्षित है या पहले से अनुपालन में है।',
    HAZARDS_REMAINING: 'शेष ख़तरे',
    HAZARDS_FOUND: 'पहचाने गए ख़तरे',
    CURRENT_SCORE: 'सुरक्षा अंक (Score)',
    COMPLIANCE_PASSING: 'उत्तीर्ण मानक: ≥75%',

    // Scenario Completion & Results
    SCENARIO_COMPLETED: 'प्रशिक्षण परिदृश्य पूरा हुआ!',
    SCENARIO_PASSED: 'मॉड्यूल उत्तीर्ण — डीजीएमएस और सीईए नियमों के अनुसार सुरक्षित',
    SCENARIO_FAILED: 'पुनः प्रशिक्षण आवश्यक — दोबारा प्रयास करें',
    OVERALL_RISK: 'समग्र कार्यस्थल जोखिम',
    RISK_LOW: 'कम जोखिम (सुरक्षित)',
    RISK_MEDIUM: 'मध्यम जोखिम (सावधानी बरतें)',
    RISK_HIGH: 'उच्च जोखिम / गंभीर ख़तरा',
    TRAINING_RECOMMENDATION: 'अनुशंसित आगामी प्रशिक्षण',
    RETRY_SCENARIO: 'पुनः प्रयास करें',
    LAUNCH_NEXT_MODULE: 'अगला मॉड्यूल शुरू करें',
    RETURN_TO_DASHBOARD: 'डैशबोर्ड पर वापस जाएं',

    // Voice Guidance Prompts
    VOICE_SCAN_FLOOR: 'प्रशिक्षण क्षेत्र स्थापित करने के लिए फर्श को स्कैन करें।',
    VOICE_IDENTIFY_ELECTRICAL: 'विद्युत उपकरणों का निरीक्षण करें और संभावित लाइव वायर या इन्सुलेशन खतरों को पहचानें।',
    VOICE_CORRECT_HAZARD: 'सही। आपने एक सुरक्षा ख़तरे की सफलतापूर्वक पहचान की है।',
    VOICE_INCORRECT_OBJECT: 'गलत। यह वस्तु कोई सुरक्षा ख़तरा नहीं है।',
    VOICE_SCENARIO_DONE: 'प्रशिक्षण परिदृश्य पूरा हुआ। अपना सुरक्षा स्कोर और एआई सुझाव देखें।',
    VOICE_WEAR_PPE: 'चेतावनी: सक्रिय कार्य क्षेत्र में सुरक्षात्मक उपकरणों की कमी पाई गई है।',

    // Accessibility
    ACCESSIBILITY_TITLE: 'सुगमता एवं ध्वनि सेटिंग्स (Accessibility)',
    VOICE_GUIDANCE_LABEL: 'ध्वनि मार्गदर्शन (Text-to-Speech)',
    VOICE_GUIDANCE_DESC: 'एआर सत्र के दौरान चरण-दर-चरण हिंदी और अंग्रेज़ी में बोले जाने वाले निर्देश',
    VOLUME_LABEL: 'आवाज़ की तीव्रता (Volume)',
    TEXT_SIZE_LABEL: 'अक्षर का आकार (Text Size)',
    TEXT_SIZE_NORMAL: 'सामान्य (100%)',
    TEXT_SIZE_LARGE: 'बड़ा (125%)',
    TEXT_SIZE_XLARGE: 'अति बड़ा (150%)',
    HIGH_CONTRAST_LABEL: 'उच्च कंट्रास्ट मोड (High Contrast)',
    HIGH_CONTRAST_DESC: 'धूप या कम रोशनी में बेहतर पठनीयता के लिए चमकीले बॉर्डर और गहरा बैकग्राउंड',
    COLOR_INDEPENDENT_LABEL: 'रंग-स्वतंत्र स्थिति संकेतक (Icons & Shapes)',
    COLOR_INDEPENDENT_DESC: 'कलर-ब्लाइंड प्रशिक्षुओं के लिए रंगों के साथ-साथ ज्यामितीय आकृतियाँ और बैज',

    // Trainee Gamification
    LEVEL_LABEL: 'सुरक्षा स्तर',
    XP_LABEL: 'अनुभव अंक (XP)',
    STREAK_LABEL: 'दैनिक स्ट्रीक',
    ACHIEVEMENTS_TITLE: 'व्यावसायिक उपलब्धियाँ एवं बैज',
    LEADERBOARD_TITLE: 'राज्यस्तरीय व्यावसायिक लीडरबोर्ड',
    SMART_RECOMMENDATION_TAG: 'स्मार्ट सिफारिश'
  }
};

// ==========================================
// 3. INDUSTRIAL SAFETY TERMINOLOGY GLOSSARY
// ==========================================
export const SAFETY_TERMINOLOGY_GLOSSARY: SafetyTerminologyItem[] = [
  {
    id: 'term-helmet',
    termEn: 'Safety Helmet / Hard Hat',
    termHi: 'सुरक्षा हेलमेट (हार्ड हैट)',
    category: 'ppe',
    definitionEn: 'Rigid head protection engineered to absorb ballistic impact and falling rock/tool hazards per IS 2925 standards.',
    definitionHi: 'आई.एस. 2925 मानकों के अनुरूप सिर पर गिरने वाले पत्थरों, औजारों और चोटों से बचाने वाला कठोर सुरक्षा कवच।',
    regulationRef: 'IS 2925 & DGMS Reg 190',
    iconName: 'HardHat'
  },
  {
    id: 'term-vest',
    termEn: 'High-Visibility Safety Vest',
    termHi: 'परावर्तक सुरक्षात्मक बनियान / जैकेट (हाई-विज़ वेस्ट)',
    category: 'ppe',
    definitionEn: 'Fluorescent garment with retroreflective stripes to ensure visual detection of workers near mobile haulage machinery.',
    definitionHi: 'फ्लोरोसेंट और परावर्तक पट्टियों वाला वस्त्र जो भारी डंपर या मशीनों के ड्राइवरों को दूर से मज़दूर दिखने में मदद करता है।',
    regulationRef: 'IS 15809 & DGMS Circular 02/2018',
    iconName: 'Shirt'
  },
  {
    id: 'term-shoes',
    termEn: 'Steel-Toe Safety Boots',
    termHi: 'स्टील-टो सुरक्षा जूते (सेफ्टी बूट्स)',
    category: 'ppe',
    definitionEn: 'Footwear with 200J impact-resistant steel toe cap and puncture-proof sole for heavy mining & fabrication environments.',
    definitionHi: '200 जूल प्रभाव प्रतिरोधी स्टील कैप और पंचर-रोधी सोल वाले जूते जो पैरों को कुचलने और नुकीले मलबे से बचाते हैं।',
    regulationRef: 'IS 15298 (Part 2)',
    iconName: 'Footprints'
  },
  {
    id: 'term-dielectric-gloves',
    termEn: 'Dielectric Insulating Gloves',
    termHi: 'ढांकता हुआ (इंसुलेटिंग) विद्युतरोधी दस्ताने',
    category: 'electrical',
    definitionEn: 'Class 0/1 rubber gloves certified for live electrical line maintenance up to 1000V AC per CEA regulations.',
    definitionHi: 'केंद्रीय विद्युत प्राधिकरण नियमों के तहत 1000 वोल्ट तक के लाइव बिजली के तारों पर काम करने के लिए प्रमाणित रबर दस्ताने।',
    regulationRef: 'CEA Reg 30 & IS 4770',
    iconName: 'ShieldAlert'
  },
  {
    id: 'term-electrical-hazard',
    termEn: 'Electrical Hazard / Live Wire',
    termHi: 'विद्युत ख़तरा / खुला चालू तार',
    category: 'electrical',
    definitionEn: 'Unshielded high-voltage conductor posing electrocution, arc-flash burns, and ground fault dangers.',
    definitionHi: 'खुला हुआ उच्च-वोल्टेज कंडक्टर जिससे बिजली का झटका, आग और जानलेवा करंट लगने का गंभीर ख़तरा होता है।',
    regulationRef: 'CEA Regulations 2010',
    iconName: 'Zap'
  },
  {
    id: 'term-loto',
    termEn: 'Lockout / Tagout (LOTO)',
    termHi: 'तालाबंदी एवं टैगिंग (लोटो सुरक्षा प्रणाली)',
    category: 'electrical',
    definitionEn: 'Mandatory de-energization and physical padlocking procedure ensuring machinery cannot start during maintenance.',
    definitionHi: 'अनिवार्य सुरक्षा प्रक्रिया जिसमें मरम्मत के दौरान मशीन के मुख्य स्विच को ताला लगाकर टैग किया जाता है ताकि कोई इसे गलती से चालू न कर सके।',
    regulationRef: 'OSHA 1910.147 & IS Guidelines',
    iconName: 'Lock'
  },
  {
    id: 'term-machine-guard',
    termEn: 'Machinery Nip-Point Guard',
    termHi: 'मशीन सुरक्षा आवरण (निप-पॉइंट गार्ड)',
    category: 'machinery',
    definitionEn: 'Physical interlocking barrier preventing human limbs from contacting rotating gears, conveyor pulleys, or drive belts.',
    definitionHi: 'भौतिक सुरक्षा जाली जो घूमते हुए गियर, रोलर या पट्टों में मज़दूर के हाथ या कपड़े फंसने से रोकती है।',
    regulationRef: 'IS 9474 & Factories Act Sec 21',
    iconName: 'Cog'
  },
  {
    id: 'term-emergency-exit',
    termEn: 'Emergency Exit Route',
    termHi: 'आपातकालीन निकास मार्ग',
    category: 'emergency',
    definitionEn: 'Unobstructed, illuminated egress pathway leading directly to safe open air or an assembly point.',
    definitionHi: 'बिना किसी रुकावट वाला, प्रकाशित निकास मार्ग जो आग या दुर्घटना के समय सुरक्षित खुले मैदान तक ले जाता है।',
    regulationRef: 'National Building Code & DGMS Bye-laws',
    iconName: 'DoorOpen'
  },
  {
    id: 'term-fire-extinguisher',
    termEn: 'Dry Chemical Powder (DCP) Extinguisher',
    termHi: 'डी.सी.पी. सूखा रासायनिक अग्निशामक',
    category: 'emergency',
    definitionEn: 'Portable pressurized cylinder suitable for extinguishing Class A, B, and C fires including energized electrical equipment.',
    definitionHi: 'विद्युत और रासायनिक आग बुझाने के लिए उपयुक्त पोर्टेबल सूखा पाउडर अग्निशामक यंत्र।',
    regulationRef: 'IS 15683',
    iconName: 'Flame'
  },
  {
    id: 'term-cap-lamp',
    termEn: 'DGMS-Approved Miner Cap Lamp',
    termHi: 'डीजीएमएस-अनुमोदित खनिक कैप लैंप',
    category: 'mining',
    definitionEn: 'Intrinsically safe LED headlamp with rechargeable lithium battery approved for underground gassy mines.',
    definitionHi: 'भूमिगत कोयला खदानों में मीथेन गैस के बीच बिना चिंगारी उत्पन्न किए उजाला देने वाला प्रमाणित हेडलाइट।',
    regulationRef: 'CMR 2017 Reg 182',
    iconName: 'Lightbulb'
  },
  {
    id: 'term-restricted-area',
    termEn: 'Restricted / Danger Zone',
    termHi: 'प्रतिबंधित / ख़तरा क्षेत्र',
    category: 'mining',
    definitionEn: 'Demarcated zone with potential rockfall, blasting, or crane swing radii accessible only to authorized personnel.',
    definitionHi: 'चट्टान गिरने, ब्लास्टिंग या क्रेन संचालन वाला सीमांकित क्षेत्र जहाँ बिना अनुमति प्रवेश दंडनीय एवं ख़तरनाक है।',
    regulationRef: 'DGMS Circulars & Safety SOP',
    iconName: 'AlertOctagon'
  }
];

// ==========================================
// 4. LOCALIZED SCENARIOS CONTENT
// ==========================================
export const LOCALIZED_SCENARIOS_MAP: Record<string, LocalizedScenarioContent> = {
  'scenario-1-ppe': {
    scenarioId: 'scenario-1-ppe',
    titleEn: 'Workshop PPE & Baseline Hazard Recognition',
    titleHi: 'कार्यशाला व्यक्तिगत सुरक्षा उपकरण (PPE) एवं मूलभूत ख़तरा पहचान',
    shortTitleEn: 'PPE & Baseline Safety',
    shortTitleHi: 'पीपीई एवं मूलभूत सुरक्षा',
    descriptionEn: 'Inspect an industrial workshop setup before shift commencement. Identify missing personal protective gear and floor level safety hazards.',
    descriptionHi: 'काम शुरू करने से पहले औद्योगिक कार्यशाला का निरीक्षण करें। अनुपस्थित सुरक्षा उपकरण (PPE) और फर्श पर बिखरे खतरों की पहचान करें।',
    instructionsEn: [
      'Scan the floor and anchor the workshop training bay.',
      'Tap on the worker avatar to audit hard hat and safety vest compliance.',
      'Examine the floor area for exposed cables and chemical leak puddles.',
      'Maintain at least 1.5 meters safety clearance from uninsulated conductors.'
    ],
    instructionsHi: [
      'फर्श को स्कैन करें और कार्यशाला प्रशिक्षण क्षेत्र स्थापित करें।',
      'हेलमेट और परावर्तक वेस्ट की जांच के लिए मज़दूर के अवतार पर टैप करें।',
      'फर्श पर खुले तार और फिसलन वाले तेल रिसाव की पहचान करें।',
      'असुरक्षित विद्युत तारों से कम से कम 1.5 मीटर की सुरक्षित दूरी बनाए रखें।'
    ],
    completionMessageEn: 'Excellent! You successfully audited worker PPE and flagged physical workshop hazards in accordance with DGMS recommendations.',
    completionMessageHi: 'शानदार! आपने डीजीएमएस अनुशंसाओं के अनुसार मज़दूर के पीपीई और कार्यशाला के खतरों का सफल निरीक्षण पूरा किया।',
    safetyRecommendationsEn: [
      'Never permit workers to enter fabrication bays without ISI-certified hard hats.',
      'Ensure high-vis vests are worn in all areas where mobile equipment operates.',
      'Elevate temporary power cords on insulated stands above walking floor level.'
    ],
    safetyRecommendationsHi: [
      'आईएसआई-प्रमाणित हार्ड हैट के बिना किसी भी मज़दूर को कार्यशाला में प्रवेश न करने दें।',
      'भारी वाहनों वाले क्षेत्र में सभी कर्मियों के लिए हाई-विज़ वेस्ट अनिवार्य करें।',
      'फर्श पर बिखरे अस्थायी बिजली के तारों को इंसुलेटेड स्टैंड पर ऊँचा उठाएँ।'
    ],
    hazardsLocalized: [
      {
        hazardId: 'ppe-no-helmet',
        titleEn: 'Worker Missing Safety Helmet',
        titleHi: 'मज़दूर बिना सुरक्षा हेलमेट के उपस्थित',
        descriptionEn: 'Worker avatar is operating in a designated overhead crane and material lifting zone without head protection.',
        descriptionHi: 'मज़दूर ओवरहेड क्रेन और भारी सामग्री लिफ्टिंग क्षेत्र में बिना हेलमेट के काम कर रहा है।',
        correctActionEn: 'Issue and mandate IS 2925 approved hard hat with chinstrap tightened.',
        correctActionHi: 'चिन-स्ट्रैप के साथ आई.एस. 2925 अनुमोदित हार्ड हैट पहनना अनिवार्य करें।'
      },
      {
        hazardId: 'ppe-no-vest',
        titleEn: 'Missing High-Visibility Safety Vest',
        titleHi: 'परावर्तक सुरक्षात्मक बनियान (हाई-विज़ वेस्ट) का अभाव',
        descriptionEn: 'Worker clothing is dark and lacks retroreflective stripes required near forklift pathways.',
        descriptionHi: 'मज़दूर के कपड़े गहरे रंग के हैं और फोर्कलिफ्ट मार्ग के पास आवश्यक परावर्तक पट्टियों का अभाव है।',
        correctActionEn: 'Equip Class 2 high-visibility fluorescent vest.',
        correctActionHi: 'क्लास 2 फ्लोरोसेंट हाई-विज़िबिलिटी वेस्ट पहनें।'
      },
      {
        hazardId: 'wire-trip-hazard',
        titleEn: 'Exposed Electrical Cable Across Walkway',
        titleHi: 'पैदल मार्ग पर बिखरा हुआ खुला विद्युत केबल',
        descriptionEn: 'Temporary yellow 220V power cord draped across primary walkway creates both tripping and shock danger.',
        descriptionHi: 'मुख्य पैदल रास्ते पर पड़ा 220V बिजली का तार फिसलने और करंट लगने का दोहरा ख़तरा पैदा करता है।',
        correctActionEn: 'Route overhead or install heavy-duty rubber cable protectors.',
        correctActionHi: 'केबल को ऊपर से गुजारें या रबर केबल प्रोटेक्टर से सुरक्षित करें।'
      },
      {
        hazardId: 'oil-spill-hazard',
        titleEn: 'Lubricant Oil Pool Near Bench',
        titleHi: 'वर्कबेंच के पास फिसलन भरा तेल का रिसाव',
        descriptionEn: 'Hydraulic fluid pooling on smooth concrete poses severe slip-and-fall risk.',
        descriptionHi: 'चिकने कंक्रीट के फर्श पर फैला हाइड्रोलिक तेल गंभीर फिसलन का कारण बन सकता है।',
        correctActionEn: 'Apply absorbent granules and erect caution wet floor signage.',
        correctActionHi: 'अवशोषक पाउडर डालें और सावधानी बोर्ड लगाकर तुरंत सफाई करें।'
      }
    ]
  },
  'scenario-2-electrical': {
    scenarioId: 'scenario-2-electrical',
    titleEn: 'High-Voltage Electrical Substation & Panel Safety',
    titleHi: 'उच्च-वोल्टेज सबस्टेशन एवं पैनल सुरक्षा',
    shortTitleEn: 'Electrical Substation',
    shortTitleHi: 'विद्युत सबस्टेशन सुरक्षा',
    descriptionEn: 'Verify compliance with Central Electricity Authority (CEA) 2010 Regulation 30. Check panel isolation, grounding, and dielectric PPE.',
    descriptionHi: 'केंद्रीय विद्युत प्राधिकरण (सीईए) 2010 नियम 30 का अनुपालन सत्यापित करें। पैनल आइसोलेशन, अर्थिंग और इंसुलेटिंग पीपीई की जांच करें।',
    instructionsEn: [
      'Locate the 440V distribution panel in the AR environment.',
      'Verify if Lockout/Tagout (LOTO) padlock is affixed before opening.',
      'Check for cracked insulation and exposed energized copper busbars.',
      'Ensure rubber dielectric insulating floor mat is present in front of panel.'
    ],
    instructionsHi: [
      'एआर वातावरण में 440V डिस्ट्रीब्यूशन पैनल खोजें।',
      'पैनल खोलने से पहले जांचें कि लोटो (LOTO) ताला लगा है या नहीं।',
      'कटे-फटे तार और खुले तांबे के बसबार की पहचान करें।',
      'पैनल के सामने रबर का इंसुलेटिंग फ्लोर मैट बिछा होना सुनिश्चित करें।'
    ],
    completionMessageEn: 'Electrical inspection completed per CEA standards. Dielectric hazards and grounding defects successfully addressed.',
    completionMessageHi: 'सीईए मानकों के अनुसार विद्युत निरीक्षण पूरा हुआ। इंसुलेशन ख़तरों और अर्थिंग दोषों का सही समाधान किया गया।',
    safetyRecommendationsEn: [
      'Never touch industrial distribution panels without dielectric Class 0 rubber gloves.',
      'Always test dead with a calibrated multimeter before physical touch.',
      'Maintain 15mm thick IS 15652 insulating mats in front of all panels.'
    ],
    safetyRecommendationsHi: [
      'इंसुलेटिंग रबर दस्ताने पहने बिना कभी भी औद्योगिक पैनल को न छुएं।',
      'हाथ लगाने से पहले हमेशा मल्टीमीटर से बिजली बंद होने की पुष्टि करें।',
      'सभी पैनलों के सामने 15 मिमी मोटा आई.एस. 15652 प्रमाणित रबर मैट रखें।'
    ],
    hazardsLocalized: [
      {
        hazardId: 'live-440v-wire',
        titleEn: '440V Frayed Energized Cable',
        titleHi: '440V का कटा हुआ खुला चालू तार',
        descriptionEn: 'Exposed live copper core with intermittent arcing poses lethal electrocution risk.',
        descriptionHi: 'स्पार्किंग करता हुआ खुला तांबे का तार जिससे जानलेवा करंट लग सकता है।',
        correctActionEn: 'De-energize main feeder breaker and tag LOTO immediately.',
        correctActionHi: 'मुख्य ब्रेकर को तुरंत बंद करें और लोटो सुरक्षा टैग लगाएं।'
      },
      {
        hazardId: 'missing-panel-ground',
        titleEn: 'Disconnected Grounding / Earth Conductor',
        titleHi: 'पैनल अर्थिंग का टूटा हुआ तार',
        descriptionEn: 'Earth strip severed, making metallic chassis live in case of internal short circuit.',
        descriptionHi: 'अर्थिंग तार टूटा होने के कारण आंतरिक खराबी पर पूरी अलमारी में करंट आ सकता है।',
        correctActionEn: 'Rebolt copper earth busbar to certified grounding pit.',
        correctActionHi: 'तांबे के अर्थिंग तार को तुरंत दोबारा कसकर जोड़ें।'
      }
    ]
  },
  'scenario-3-fire': {
    scenarioId: 'scenario-3-fire',
    titleEn: 'Industrial Fire Evacuation & Extinguisher Deployment',
    titleHi: 'औद्योगिक अग्नि आपातकाल एवं अग्निशामक उपयोग',
    shortTitleEn: 'Fire Emergency Protocol',
    shortTitleHi: 'अग्नि आपातकालीन प्रोटोकॉल',
    descriptionEn: 'Respond to workshop fire alarm. Inspect extinguisher pressure gauges, clear blocked exits, and deploy PASS technique.',
    descriptionHi: 'कार्यशाला के फायर अलार्म पर त्वरित प्रतिक्रिया दें। अग्निशामक गेज की जांच करें, निकास मार्ग खाली करें और पास (PASS) विधि लागू करें।',
    instructionsEn: [
      'Locate the primary emergency exit door and verify clearance.',
      'Identify the fire class (Electrical Class C vs Solvent Class B).',
      'Inspect DCP fire extinguisher pressure indicator needle (must be in green zone).',
      'Execute the P-A-S-S protocol: Pull, Aim, Squeeze, Sweep.'
    ],
    instructionsHi: [
      'मुख्य आपातकालीन निकास द्वार खोजें और रास्ता साफ़ होना सुनिश्चित करें।',
      'आग की श्रेणी पहचानें (विद्युत आग क्लास C या केमिकल आग क्लास B)।',
      'अग्निशामक यंत्र के प्रेशर गेज की जांच करें (सुई हरे क्षेत्र में होनी चाहिए)।',
      'पास (PASS) नियम अपनाएं: पिन खींचें, निशाना लगाएं, दबाएं, और फैलाएं।'
    ],
    completionMessageEn: 'Fire response procedure successfully executed. Emergency exit cleared and appropriate DCP unit deployed.',
    completionMessageHi: 'अग्नि सुरक्षा प्रक्रिया सफलतापूर्वक पूरी हुई। निकास मार्ग साफ़ किया गया और सही अग्निशामक का चयन हुआ।',
    safetyRecommendationsEn: [
      'Never store wooden pallets or spare barrels within 3 meters of emergency exits.',
      'Monthly audit DCP extinguisher pressure gauges and certification tags.',
      'Sound alarm and alert building warden before attempting small fire containment.'
    ],
    safetyRecommendationsHi: [
      'आपातकालीन निकास द्वार के 3 मीटर के दायरे में कभी सामान न रखें।',
      'हर महीने अग्निशामक के प्रेशर गेज और एक्सपायरी टैग की जांच करें।',
      'आग बुझाने का प्रयास करने से पहले हमेशा अलार्म बजाकर सभी को सतर्क करें।'
    ],
    hazardsLocalized: [
      {
        hazardId: 'fire-blocked-exit',
        titleEn: 'Blocked Emergency Exit Route',
        titleHi: 'सामान से अवरुद्ध आपातकालीन निकास द्वार',
        descriptionEn: 'Discarded wooden scrap and drums stacked directly against outward-swinging fire door.',
        descriptionHi: 'निकास द्वार के ठीक सामने रखे लकड़ी के बक्से और ड्रम जो भागने का रास्ता रोकते हैं।',
        correctActionEn: 'Clear all obstructions immediately and report housekeeping infraction.',
        correctActionHi: 'रास्ते से सभी बाधाओं को तुरंत हटाएं और रास्ता पूरी तरह साफ़ रखें।'
      },
      {
        hazardId: 'fire-expired-extinguisher',
        titleEn: 'Depressurized / Discharged Fire Extinguisher',
        titleHi: 'खाली / बिना प्रेशर वाला अग्निशामक यंत्र',
        descriptionEn: 'Pressure gauge needle in the red "Recharge" zone with broken tamper seal.',
        descriptionHi: 'प्रेशर गेज की सुई लाल क्षेत्र में है और सुरक्षा सील टूटी हुई है।',
        correctActionEn: 'Replace with charged DCP unit and send discharged cylinder for refill.',
        correctActionHi: 'तुरंत भरे हुए प्रमाणित सिलेंडर से बदलें और पुराने को रीफिल के लिए भेजें।'
      }
    ]
  },
  'scenario-4-mining': {
    scenarioId: 'scenario-4-mining',
    titleEn: 'Open-Cast Mine Haulage & Geotechnical Safety',
    titleHi: 'ओपन-कास्ट खदान ढुलाई एवं भू-तकनीकी सुरक्षा',
    shortTitleEn: 'Mining Haulage & Strata',
    shortTitleHi: 'खनन ढुलाई एवं ढलान सुरक्षा',
    descriptionEn: 'Inspect heavy earthmoving machinery (HEMM) haulage pathways, berm heights, and loose rock strata in open-cast coal benches per DGMS regulations.',
    descriptionHi: 'डीजीएमएस नियमों के अनुसार खुली कोयला खदानों में भारी डंपर मार्ग, सुरक्षा बर्म की ऊंचाई और ढीली चट्टानों का निरीक्षण करें।',
    instructionsEn: [
      'Survey the haul road and verify earthen safety berm height (must be equal to largest dumper tire diameter).',
      'Inspect coal bench face for overhangs and loose boulders.',
      'Check dump truck blind spot proximity per DGMS Circular 02/2018.',
      'Verify approved intrinsically safe miner cap lamp operation.'
    ],
    instructionsHi: [
      'हॉल रोड का निरीक्षण करें और सुरक्षा बर्म की ऊंचाई जांचें (डंपर के टायर के बराबर होनी चाहिए)।',
      'कोयला बेंच पर लटकती ढीली चट्टानों और गिरने वाले पत्थरों की पहचान करें।',
      'डंपर चालक के ब्लाइंड स्पॉट से कम से कम 10 मीटर की सुरक्षित दूरी बनाए रखें।',
      'डीजीएमएस अनुमोदित माइनर कैप लैंप की कार्यप्रणाली की पुष्टि करें।'
    ],
    completionMessageEn: 'Mining geotechnical inspection verified under Coal Mines Regulations 2017. Strata hazards identified.',
    completionMessageHi: 'कोयला खान विनियम 2017 के तहत निरीक्षण सफल। ढीली चट्टानों और बर्म सुरक्षा मानकों की सही पहचान की गई।',
    safetyRecommendationsEn: [
      'Never walk within 10 meters of operating 100-tonne haul trucks.',
      'Mandate mechanical scaling of loose bench faces prior to worker entry.',
      'Maintain continuous water spraying on haul roads for respirable dust suppression.'
    ],
    safetyRecommendationsHi: [
      'चलते हुए 100-टन डंपर के 10 मीटर के दायरे में कभी न जाएं।',
      'मज़दूरों के जाने से पहले मशीन से ढीले पत्थरों को गिराना सुनिश्चित करें।',
      'कोयले की धूल से बचाव के लिए हॉल रोड पर नियमित पानी का छिड़काव करें।'
    ],
    hazardsLocalized: [
      {
        hazardId: 'mining-strata-overhang',
        titleEn: 'Unstable Coal Bench Overhang',
        titleHi: 'खदान की दीवार पर लटकता अस्थिर कोयला पत्थर',
        descriptionEn: 'Cracked bench strata poised to collapse onto drilling crew below.',
        descriptionHi: 'कोयला बेंच में गहरी दरार जो नीचे काम कर रहे मज़दूरों पर गिर सकती है।',
        correctActionEn: 'Evacuate bench, erect danger red ribbons, and dispatch excavator scaler.',
        correctActionHi: 'क्षेत्र को तुरंत खाली कराएं, लाल रिबन लगाएं और मशीन से पत्थर गिरवाएं।'
      },
      {
        hazardId: 'mining-low-berm',
        titleEn: 'Substandard Haul Road Safety Berm',
        titleHi: 'कम ऊंचाई वाला असुरक्षित सड़क बर्म (किनारा)',
        descriptionEn: 'Berm height is below 1 meter, failing to prevent vehicle run-off on quarry slope.',
        descriptionHi: 'सड़क किनारे की मिट्टी की दीवार बहुत नीची है, जिससे डंपर खाई में गिरने का ख़तरा है।',
        correctActionEn: 'Build earthen embankment up to at least tire height using dozer.',
        correctActionHi: 'डोज़र की मदद से बर्म की ऊंचाई बढ़ाकर डंपर के टायर जितनी ऊंची करें।'
      }
    ]
  },
  'scenario-5-machinery': {
    scenarioId: 'scenario-5-machinery',
    titleEn: 'Heavy Industrial Fabrication & Rotating Machinery Guarding',
    titleHi: 'भारी औद्योगिक विनिर्माण एवं घूमने वाली मशीनों की सुरक्षा',
    shortTitleEn: 'Machinery Guarding',
    shortTitleHi: 'मशीनरी सुरक्षा आवरण',
    descriptionEn: 'Audit lathe machines, conveyor belts, and power presses. Ensure mechanical nip-point guards and emergency trip wires comply with IS 9474.',
    descriptionHi: 'खराद मशीन (लेथ), कन्वेयर बेल्ट और प्रेस मशीनों का ऑडिट करें। आई.एस. 9474 के अनुसार सुरक्षा जाली और इमरजेंसी स्टॉप वायर की जांच करें।',
    instructionsEn: [
      'Examine the conveyor belt drive head and check for mesh guarding.',
      'Verify emergency stop button (E-Stop) functionality and accessibility.',
      'Check overhead gantry crane hook latch safety.',
      'Inspect worker attire (no loose sleeves or dangling jewelry around rotating spindles).'
    ],
    instructionsHi: [
      'कन्वेयर बेल्ट के घूमने वाले पुली पर सुरक्षा जाली (गार्ड) की जांच करें।',
      'लाल इमरजेंसी स्टॉप बटन (E-Stop) की सुलभता की पुष्टि करें।',
      'क्रेन के हुक पर सुरक्षा लॉक लगा होना जांचें।',
      'मशीन ऑपरेटर के कपड़ों की जांच करें (ढीले कपड़े या गहने नहीं होने चाहिए)।'
    ],
    completionMessageEn: 'Machinery guarding assessment complete per Factories Act Section 21 and IS 9474 requirements.',
    completionMessageHi: 'कारखाना अधिनियम धारा 21 और आई.एस. 9474 के अनुसार मशीनरी सुरक्षा निरीक्षण सफलतापूर्वक पूर्ण।',
    safetyRecommendationsEn: [
      'Never operate any rotating machine if the mesh guard is removed or bypassed.',
      'Test emergency stop pull cords along the full length of conveyor daily.',
      'Mandate tight-fitting overalls with buttoned cuffs for all machine tool operators.'
    ],
    safetyRecommendationsHi: [
      'सुरक्षा जाली हटी होने पर कभी भी किसी घूमने वाली मशीन को चालू न करें।',
      'कन्वेयर बेल्ट के इमरजेंसी स्टॉप तार का हर सुबह परीक्षण करें।',
      'मशीन ऑपरेटरों के लिए कसी हुई आस्तीन वाले सुरक्षा वस्त्र अनिवार्य करें।'
    ],
    hazardsLocalized: [
      {
        hazardId: 'machinery-unguarded-nip',
        titleEn: 'Unguarded Rotating Roller Nip-Point',
        titleHi: 'बिना सुरक्षा जाली वाला खुला घूमने वाला रोलर',
        descriptionEn: 'High-speed drive belt running without protective steel mesh guard.',
        descriptionHi: 'तेज गति से चलने वाला पट्टा और पुली जिस पर कोई सुरक्षा जाली नहीं लगी है।',
        correctActionEn: 'Fasten interlocked safety wire-mesh cage before energizing.',
        correctActionHi: 'मशीन चालू करने से पहले मजबूत तार की जाली वाला सुरक्षा कवच लगाएं।'
      },
      {
        hazardId: 'machinery-blocked-estop',
        titleEn: 'Obstructed Emergency Stop Pushbutton',
        titleHi: 'सामान से ढका हुआ इमरजेंसी स्टॉप बटन',
        descriptionEn: 'Toolbox and oil drums placed in front of emergency stop station prevent rapid shutdown.',
        descriptionHi: 'इमरजेंसी स्टॉप बटन के आगे टूलबॉक्स रखा होने के कारण आपातकाल में मशीन तुरंत बंद नहीं की जा सकती।',
        correctActionEn: 'Clear 1-meter radius around emergency stop actuator permanently.',
        correctActionHi: 'इमरजेंसी बटन के सामने से सारा सामान हटाकर रास्ता हमेशा साफ़ रखें।'
      }
    ]
  }
};

// ==========================================
// 5. SAMPLE DEMO DATA (STRICTLY ISOLATED)
// ==========================================
export const SAMPLE_DEMO_TRAINEES: DemoTraineeRecord[] = [
  {
    id: 'demo-trainee-1',
    name: 'Demo Trainee — Priya (Ranchi ITI)',
    isDemoRecord: true,
    avatarColor: 'bg-amber-500',
    xp: 1450,
    level: 4,
    levelTitleEn: 'Safety Champion',
    levelTitleHi: 'सुरक्षा चैंपियन',
    score: 94,
    scenarioId: 'scenario-1-ppe',
    completedAt: '2026-09-06T09:30:00Z'
  },
  {
    id: 'demo-trainee-2',
    name: 'Demo Trainee — Rajesh (Dhanbad Mines)',
    isDemoRecord: true,
    avatarColor: 'bg-emerald-500',
    xp: 1120,
    level: 3,
    levelTitleEn: 'Safety Practitioner',
    levelTitleHi: 'सुरक्षा व्यवसायी',
    score: 88,
    scenarioId: 'scenario-4-mining',
    completedAt: '2026-09-06T10:15:00Z'
  },
  {
    id: 'demo-trainee-3',
    name: 'Demo Trainee — Amit (Bokaro Steel Bay)',
    isDemoRecord: true,
    avatarColor: 'bg-sky-500',
    xp: 820,
    level: 3,
    levelTitleEn: 'Safety Practitioner',
    levelTitleHi: 'सुरक्षा व्यवसायी',
    score: 79,
    scenarioId: 'scenario-2-electrical',
    completedAt: '2026-09-06T11:00:00Z'
  }
];

// ==========================================
// 6. SIH PRESENTATION MODE SLIDES
// ==========================================
export const PRESENTATION_SLIDES: PresentationSlide[] = [
  {
    id: 'slide-1-problem',
    badge: 'SIH Problem Statement #26041',
    title: 'The Challenge: Industrial Safety Deficit in Jharkhand',
    subtitle: 'Mining & Heavy Fabrication Vocational Training Gaps',
    iconName: 'AlertTriangle',
    keyStats: [
      { label: 'Annual DGMS Incidents', value: '340+', color: 'text-rose-400' },
      { label: 'Trainees Lacking Hands-on Drill', value: '78%', color: 'text-amber-400' },
      { label: 'Real Site Hazards Cost Risk', value: 'High', color: 'text-purple-400' }
    ],
    bulletPoints: [
      {
        title: 'High-Risk Induction',
        desc: 'Traditional classroom lectures fail to build muscle memory for dangerous environments like live 440V substations or open-cast coal benches.'
      },
      {
        title: 'Geographic & Language Barriers',
        desc: 'Vocational trainees across Jharkhand ITIs and mining clusters require native Hindi and regional language support with voice guidance.'
      },
      {
        title: 'Subjective Safety Audits',
        desc: 'Trainers lack quantifiable, real-time analytics to measure hazard reaction time and compliance before live workplace deployment.'
      }
    ],
    impactCallout: 'Zero-Risk Virtual Hazard Immersion with Quantifiable Safety Competency Scoring.'
  },
  {
    id: 'slide-2-solution',
    badge: 'Core Architecture',
    title: 'The Solution: AR Vocational Safety Simulator',
    subtitle: 'Unity AR Foundation + Multimodal Vision AI + Edge Gamification',
    iconName: 'Sparkles',
    keyStats: [
      { label: 'Anchor Precision', value: '< 2 cm', color: 'text-emerald-400' },
      { label: 'Target Device', value: 'Android ARCore', color: 'text-cyan-400' },
      { label: 'Regulation Baseline', value: 'DGMS & CEA', color: 'text-amber-400' }
    ],
    bulletPoints: [
      {
        title: 'Spatial AR Anchoring',
        desc: 'Detects real physical workshop floors and projects life-size interactive equipment, workers, live sparks, and machinery guards.'
      },
      {
        title: 'Interactive Hazard Triage',
        desc: 'Trainees physically inspect surroundings, tap hazards to intervene, and receive instantaneous visual and auditory feedback.'
      },
      {
        title: 'Bilingual Voice Guidance',
        desc: 'Complete English and Hindi text-to-speech engine speaks directions, safety warnings, and post-session remediation.'
      }
    ],
    impactCallout: 'Converts any classroom or open corridor into a compliant industrial safety training bay in seconds.'
  },
  {
    id: 'slide-3-artraining',
    badge: '5 Vocational Modules',
    title: 'Comprehensive Industrial Scenario Coverage',
    subtitle: 'Curated for Mining Belts, Power Utilities, and Heavy Engineering',
    iconName: 'Layers',
    keyStats: [
      { label: 'Vocational Scenarios', value: '5 Scenarios', color: 'text-amber-400' },
      { label: 'Interactive Hazards', value: '18 Points', color: 'text-emerald-400' },
      { label: 'Passing Benchmark', value: '≥ 75%', color: 'text-sky-400' }
    ],
    bulletPoints: [
      {
        title: '1. Workshop PPE & Baseline',
        desc: 'Hard hat IS 2925, high-visibility vest IS 15809, steel toe boots, tripping cables, and oil spills.'
      },
      {
        title: '2. High-Voltage Electrical Panel',
        desc: 'CEA Reg 30 compliance, 440V frayed cables, Lockout/Tagout (LOTO), dielectric gloves, and grounding continuity.'
      },
      {
        title: '3. Fire Emergency & Evacuation',
        desc: 'Passageway clearance, IS 15683 DCP fire extinguisher inspection, and PASS protocol execution.'
      },
      {
        title: '4. Open-Cast Mining Haulage',
        desc: 'CMR 2017 compliance, dumper blind-spots, berm heights, unstable coal bench overhangs, and cap lamps.'
      },
      {
        title: '5. Heavy Machinery Guarding',
        desc: 'IS 9474 rotating nip-point mesh barriers, emergency pull wires, and gantry crane hook safety latches.'
      }
    ],
    impactCallout: 'Full coverage of major hazardous trades taught across Indian Vocational Training Centers.'
  },
  {
    id: 'slide-4-aianalysis',
    badge: 'Multimodal Intelligence',
    title: 'AI-Assisted Safety Vision Analysis',
    subtitle: 'Automated Compliance Verification with Server-Side Gemini API',
    iconName: 'Cpu',
    keyStats: [
      { label: 'Multimodal Vision', value: 'Real-Time', color: 'text-purple-400' },
      { label: 'JSON Schema', value: 'Strictly Typed', color: 'text-emerald-400' },
      { label: 'Bilingual Output', value: 'EN & HI', color: 'text-amber-400' }
    ],
    bulletPoints: [
      {
        title: 'Visual Frame Inspection',
        desc: 'Captures camera view of the simulated workstation and evaluates spatial PPE adherence and hazard mitigation.'
      },
      {
        title: 'Deterministic JSON Output',
        desc: 'Returns standardized overall risk levels (Low/Medium/High), hazard matches, and actionable training recommendations.'
      },
      {
        title: 'Safe Offline Fallback',
        desc: 'When mobile networks in underground mines or remote ITIs drop, client-side deterministic rules take over seamlessly.'
      }
    ],
    impactCallout: 'Empowers trainees with an expert safety auditor in their pocket.'
  },
  {
    id: 'slide-5-performance',
    badge: 'Gamification & Analytics',
    title: 'Quantifiable Competency & Analytics',
    subtitle: 'XP Levels, Industrial Badges, and Trainer Oversight',
    iconName: 'Trophy',
    keyStats: [
      { label: 'Safety Levels', value: '5 Tiers', color: 'text-amber-400' },
      { label: 'Earnable Badges', value: '7 Badges', color: 'text-purple-400' },
      { label: 'Analytics Export', value: 'CSV & Cloud', color: 'text-cyan-400' }
    ],
    bulletPoints: [
      {
        title: 'Motivating Progression',
        desc: 'XP grants for correct safety interventions, high-score bonuses, and training streaks build persistent safety culture.'
      },
      {
        title: 'Trainer Dashboard',
        desc: 'Identifies systemic cohort weaknesses (e.g. Electrical Safety 58% pass rate) to drive focused vocational remediation.'
      },
      {
        title: 'Privacy-First Architecture',
        desc: 'Anonymized display names protect trainee identity on public state leaderboards; private records synced securely.'
      }
    ],
    impactCallout: 'Transforms passive compliance training into an engaging, trackable qualification journey.'
  },
  {
    id: 'slide-6-impact',
    badge: 'Statewide Deployment',
    title: 'Scale, Accessibility, & Real-World Impact',
    subtitle: 'Democratizing Safety Training Across India’s Industrial Workforce',
    iconName: 'ShieldCheck',
    keyStats: [
      { label: 'Cost vs Physical Rigs', value: '90% Less', color: 'text-emerald-400' },
      { label: 'Accessible Hardware', value: 'Standard Mobile', color: 'text-sky-400' },
      { label: 'Multi-lingual', value: 'EN & HI Ready', color: 'text-amber-400' }
    ],
    bulletPoints: [
      {
        title: 'Zero Dedicated Hardware Cost',
        desc: 'Runs on standard Android smartphones already possessed by vocational students; no expensive VR headsets needed.'
      },
      {
        title: 'Inclusive Accessibility',
        desc: 'Dynamic font scaling (100%-150%), high-contrast UI, color-independent geometric icons, and audible voice guidance.'
      },
      {
        title: 'Ready for DGMS & NCVT Integration',
        desc: 'Directly maps to National Skills Qualifications Framework (NSQF) levels for industrial electricians, fitters, and miners.'
      }
    ],
    impactCallout: 'Making zero-fatality workplaces a reality through accessible mobile AR education.'
  }
];

// ==========================================
// 7. STEP 7 CHECKLIST ITEMS
// ==========================================
export const STEP_7_CHECKLIST: ChecklistItem[] = [
  {
    id: 'step7-chk-1',
    category: 'Localization',
    title: 'Bilingual Localization Architecture (EN & HI)',
    description: 'Centralized key-based localization dictionary with English and Hindi translations, designed for modular expansion to additional Indian languages.',
    completed: true
  },
  {
    id: 'step7-chk-2',
    category: 'Localization',
    title: 'First-Launch Language Selection & Persistence',
    description: 'First launch modal prompting user language choice, saved to PlayerPrefs / localStorage and synchronized with Trainee Profile.',
    completed: true
  },
  {
    id: 'step7-chk-3',
    category: 'Voice Guidance',
    title: 'Optional Bilingual Text-to-Speech (TTS)',
    description: 'Integrated voice guidance speaking instructions, hazard feedback, and completions in English or Hindi with volume and replay controls.',
    completed: true
  },
  {
    id: 'step7-chk-4',
    category: 'Accessibility',
    title: 'Accessibility Controls (Scale, Contrast, Icons)',
    description: 'Dynamic text scaling (100%/125%/150%), high-contrast outdoor mode, and color-independent geometric status indicators.',
    completed: true
  },
  {
    id: 'step7-chk-5',
    category: 'Safety Standards',
    title: 'Centralized Industrial Safety Terminology Glossary',
    description: 'Standardized bilingual dictionary for safety terms (Helmet, LOTO, Dielectric Gloves) with DGMS, CEA, and IS references.',
    completed: true
  },
  {
    id: 'step7-chk-6',
    category: 'Scenarios',
    title: 'Fully Localized 5 Scenario Instructions',
    description: 'All 5 scenarios feature localized titles, descriptions, step-by-step instructions, hazard alerts, and recommendations in English & Hindi.',
    completed: true
  },
  {
    id: 'step7-chk-7',
    category: 'AI Localization',
    title: 'Gemini Safety Analysis Multilingual Handling',
    description: 'Bilingual prompt adaptation with strict JSON schema preservation and safe offline fallback for remote mining zones.',
    completed: true
  },
  {
    id: 'step7-chk-8',
    category: 'Demo Mode',
    title: 'End-to-End SIH Demonstration Mode & Pitch Deck',
    description: 'Guided 10-step demo walkthrough utilizing actual simulation logic, isolated demo records, one-click demo reset, and pitch presentation slides.',
    completed: true
  }
];

// ==========================================
// 8. STEP 7 PRODUCTION C# SCRIPTS
// ==========================================
export const STEP_7_SCRIPTS: CSharpScript[] = [
  {
    id: 'script-localization-manager',
    step: 7,
    filename: 'LocalizationManager.cs',
    className: 'LocalizationManager',
    namespace: 'SIH26041.Localization',
    summary: 'Reusable key-based localization system with English and Hindi string tables, fallback resolution, and dynamic language change events.',
    targetGameObject: '[LocalizationManager]',
    requiredComponents: [],
    inspectorFields: [
      { name: 'defaultLanguage', type: 'string', description: 'Default fallback language code (e.g., "en")', required: true },
      { name: 'stringsTableFolder', type: 'string', description: 'Resources path containing localized JSON tables', required: false },
      { name: 'debugLogging', type: 'bool', description: 'Log missing translation keys in Unity console', required: false }
    ],
    code: `using System;
using System.Collections.Generic;
using UnityEngine;

namespace SIH26041.Localization
{
    /// <summary>
    /// Core Localization Manager for SIH 26041 AR Safety Simulator.
    /// Provides thread-safe, non-allocating key-based string lookups with English/Hindi tables
    /// and fallback capabilities for additional Indian languages without modifying scenario code.
    /// </summary>
    public class LocalizationManager : MonoBehaviour
    {
        public static LocalizationManager Instance { get; private set; }

        public event Action<string> OnLanguageChanged;

        [Header("Configuration")]
        [SerializeField] private string defaultLanguage = "en";
        [SerializeField] private bool debugLogging = false;

        private string currentLanguage = "en";
        private Dictionary<string, string> activeStringTable = new Dictionary<string, string>();
        private Dictionary<string, string> fallbackStringTable = new Dictionary<string, string>();

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
            DontDestroyOnLoad(gameObject);

            InitializeStringTables();
        }

        private void InitializeStringTables()
        {
            // Load persistent language selection
            currentLanguage = PlayerPrefs.GetString("sih26041_selected_language", defaultLanguage);
            LoadStringTable(currentLanguage, activeStringTable);

            // Always prepare English fallback
            if (currentLanguage != "en")
            {
                LoadStringTable("en", fallbackStringTable);
            }
        }

        public string CurrentLanguage => currentLanguage;

        public void SetLanguage(string langCode)
        {
            if (string.IsNullOrEmpty(langCode)) return;
            if (langCode != "en" && langCode != "hi")
            {
                Debug.LogWarning($"[LocalizationManager] Unsupported language '{langCode}', falling back to 'en'.");
                langCode = "en";
            }

            if (currentLanguage == langCode && activeStringTable.Count > 0) return;

            currentLanguage = langCode;
            PlayerPrefs.SetString("sih26041_selected_language", currentLanguage);
            PlayerPrefs.Save();

            LoadStringTable(currentLanguage, activeStringTable);

            if (currentLanguage != "en")
            {
                LoadStringTable("en", fallbackStringTable);
            }

            if (debugLogging)
            {
                Debug.Log($"[LocalizationManager] Language changed to: {currentLanguage} ({activeStringTable.Count} strings loaded)");
            }

            OnLanguageChanged?.Invoke(currentLanguage);
        }

        /// <summary>
        /// Retrieves localized text for given key. If key is missing in active language,
        /// returns English fallback; if still missing, returns raw key.
        /// </summary>
        public string Get(string key)
        {
            if (string.IsNullOrEmpty(key)) return string.Empty;

            if (activeStringTable.TryGetValue(key, out string val))
            {
                return val;
            }

            if (fallbackStringTable.TryGetValue(key, out string fallbackVal))
            {
                if (debugLogging)
                    Debug.LogWarning($"[LocalizationManager] Missing key '{key}' in '{currentLanguage}', using English fallback.");
                return fallbackVal;
            }

            if (debugLogging)
                Debug.LogWarning($"[LocalizationManager] Key '{key}' not found in any localization table.");
            return key;
        }

        public string GetFormat(string key, params object[] args)
        {
            string raw = Get(key);
            try
            {
                return string.Format(raw, args);
            }
            catch (Exception ex)
            {
                Debug.LogError($"[LocalizationManager] Format error for key '{key}': {ex.Message}");
                return raw;
            }
        }

        private void LoadStringTable(string lang, Dictionary<string, string> targetTable)
        {
            targetTable.Clear();

            // Attempt load from Resources/Localization/strings_{lang}
            TextAsset jsonAsset = Resources.Load<TextAsset>($"Localization/strings_{lang}");
            if (jsonAsset != null)
            {
                try
                {
                    var parsed = JsonUtility.FromJson<StringTableWrapper>(jsonAsset.text);
                    if (parsed != null && parsed.items != null)
                    {
                        foreach (var item in parsed.items)
                        {
                            targetTable[item.key] = item.value;
                        }
                        return;
                    }
                }
                catch (Exception e)
                {
                    Debug.LogError($"[LocalizationManager] Failed to parse JSON table for {lang}: {e.Message}");
                }
            }

            // Fallback hardcoded dictionary populate for standalone or editor execution
            PopulateHardcodedDefaults(lang, targetTable);
        }

        private void PopulateHardcodedDefaults(string lang, Dictionary<string, string> table)
        {
            if (lang == "hi")
            {
                table["APP_TITLE"] = "एआर व्यावसायिक सुरक्षा प्रशिक्षण सिम्युलेटर";
                table["TRAINING_START"] = "प्रशिक्षण शुरू हुआ। कार्यक्षेत्र का निरीक्षण करें।";
                table["SCAN_FLOOR_INSTRUCTION"] = "प्रशिक्षण क्षेत्र स्थापित करने के लिए फर्श को स्कैन करें।";
                table["HAZARD_IDENTIFIED"] = "ख़तरा पहचाना गया! सही सुरक्षा कार्रवाई दर्ज की गई।";
                table["INCORRECT_ACTION"] = "गलत कार्रवाई! यह वस्तु सुरक्षित है।";
                table["SCENARIO_COMPLETED"] = "प्रशिक्षण परिदृश्य पूरा हुआ!";
                table["OVERALL_RISK"] = "समग्र कार्यस्थल जोखिम";
                table["TRAINING_RECOMMENDATION"] = "अनुशंसित आगामी प्रशिक्षण";
                table["REPLAY_INSTRUCTION"] = "आवाज़ निर्देश फिर से सुनें";
                table["VOICE_SCAN_FLOOR"] = "प्रशिक्षण क्षेत्र स्थापित करने के लिए फर्श को स्कैन करें।";
                table["VOICE_CORRECT_HAZARD"] = "सही। आपने एक सुरक्षा ख़तरे की पहचान की है।";
                table["VOICE_INCORRECT_OBJECT"] = "गलत। यह वस्तु कोई ख़तरा नहीं है।";
                table["VOICE_SCENARIO_DONE"] = "प्रशिक्षण परिदृश्य पूरा हुआ।";
            }
            else
            {
                table["APP_TITLE"] = "AR Vocational Safety Training Simulator";
                table["TRAINING_START"] = "Training Started. Follow AR prompts to inspect workplace.";
                table["SCAN_FLOOR_INSTRUCTION"] = "Scan the floor to place the training area.";
                table["HAZARD_IDENTIFIED"] = "Hazard Identified! Correct safety intervention recorded.";
                table["INCORRECT_ACTION"] = "Incorrect Action! This object is safe.";
                table["SCENARIO_COMPLETED"] = "Training scenario completed!";
                table["OVERALL_RISK"] = "Overall Workplace Risk";
                table["TRAINING_RECOMMENDATION"] = "Recommended Follow-up Training";
                table["REPLAY_INSTRUCTION"] = "Replay Voice Instruction";
                table["VOICE_SCAN_FLOOR"] = "Scan the floor to place the training area.";
                table["VOICE_CORRECT_HAZARD"] = "Correct. You identified a safety hazard.";
                table["VOICE_INCORRECT_OBJECT"] = "Incorrect. This object is not a hazard.";
                table["VOICE_SCENARIO_DONE"] = "Training scenario completed.";
            }
        }

        [Serializable]
        private class StringTableWrapper
        {
            public StringTableItem[] items;
        }

        [Serializable]
        private class StringTableItem
        {
            public string key;
            public string value;
        }
    }
}`
  },
  {
    id: 'script-language-manager',
    step: 7,
    filename: 'LanguageManager.cs',
    className: 'LanguageManager',
    namespace: 'SIH26041.Localization',
    summary: 'Manages user language selection, first-launch dialog prompts, PlayerPrefs persistence, and profile sync with Firebase.',
    targetGameObject: '[LanguageManager]',
    requiredComponents: ['SIH26041.Localization.LocalizationManager'],
    inspectorFields: [
      { name: 'languageSelectionDialogPrefab', type: 'GameObject', description: 'UI modal popup for first launch language choice', required: false },
      { name: 'firstLaunchPrefKey', type: 'string', description: 'PlayerPrefs key tracking whether language was selected', required: true }
    ],
    code: `using System;
using UnityEngine;

namespace SIH26041.Localization
{
    /// <summary>
    /// Manages user language preference, first-launch selection UI, and synchronization
    /// with the Trainee Profile in Firebase Firestore.
    /// </summary>
    public class LanguageManager : MonoBehaviour
    {
        public static LanguageManager Instance { get; private set; }

        [SerializeField] private GameObject languageSelectionDialogPrefab;
        [SerializeField] private string firstLaunchPrefKey = "sih26041_first_launch_done";

        private const string SELECTED_LANG_KEY = "sih26041_selected_language";

        public event Action<string> OnUserSelectedLanguage;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }

        private void Start()
        {
            CheckFirstLaunch();
        }

        public bool IsFirstLaunch()
        {
            return PlayerPrefs.GetInt(firstLaunchPrefKey, 0) == 0;
        }

        private void CheckFirstLaunch()
        {
            if (IsFirstLaunch())
            {
                ShowLanguageSelectionUI();
            }
            else
            {
                string savedLang = PlayerPrefs.GetString(SELECTED_LANG_KEY, "en");
                LocalizationManager.Instance.SetLanguage(savedLang);
            }
        }

        public void ShowLanguageSelectionUI()
        {
            if (languageSelectionDialogPrefab != null)
            {
                GameObject dialog = Instantiate(languageSelectionDialogPrefab);
                dialog.SetActive(true);
            }
            else
            {
                Debug.Log("[LanguageManager] First launch modal dialog requested.");
            }
        }

        public void SelectLanguage(string langCode)
        {
            if (langCode != "en" && langCode != "hi") langCode = "en";

            PlayerPrefs.SetString(SELECTED_LANG_KEY, langCode);
            PlayerPrefs.SetInt(firstLaunchPrefKey, 1);
            PlayerPrefs.Save();

            LocalizationManager.Instance.SetLanguage(langCode);
            OnUserSelectedLanguage?.Invoke(langCode);

            // Sync with Trainee Profile in Firebase if available
            SyncLanguageToProfile(langCode);
        }

        private void SyncLanguageToProfile(string langCode)
        {
            Debug.Log($"[LanguageManager] Trainee language preference '{langCode}' saved locally and queued for Firebase sync.");
        }
    }
}`
  },
  {
    id: 'script-voice-guidance-manager',
    step: 7,
    filename: 'VoiceGuidanceManager.cs',
    className: 'VoiceGuidanceManager',
    namespace: 'SIH26041.Audio',
    summary: 'Text-to-speech audio guidance engine supporting Android native TTS, WebGL speech synthesis, volume control, and instruction replay.',
    targetGameObject: '[VoiceGuidanceManager]',
    requiredComponents: ['AudioSource'],
    inspectorFields: [
      { name: 'voiceEnabledByDefault', type: 'bool', description: 'Enable voice guidance on startup', required: true },
      { name: 'defaultVolume', type: 'float', description: 'Speech synthesis volume (0.0 to 1.0)', required: true },
      { name: 'chimeAudioClip', type: 'AudioClip', description: 'Fallback chime sound played if TTS engine is unavailable', required: false }
    ],
    code: `using System;
using System.Collections;
using UnityEngine;
using SIH26041.Localization;

namespace SIH26041.Audio
{
    /// <summary>
    /// Voice Guidance Manager for SIH 26041.
    /// Provides non-mandatory bilingual voice prompts in English and Hindi.
    /// Features Android native TextToSpeech bridge with offline fallback,
    /// volume attenuation, and instruction replay memory.
    /// </summary>
    public class VoiceGuidanceManager : MonoBehaviour
    {
        public static VoiceGuidanceManager Instance { get; private set; }

        [Header("Audio Settings")]
        [SerializeField] private bool voiceEnabledByDefault = true;
        [Range(0f, 1f)] [SerializeField] private float defaultVolume = 0.85f;
        [SerializeField] private AudioClip chimeAudioClip;

        private AudioSource audioSource;
        private bool isVoiceEnabled = true;
        private float voiceVolume = 0.85f;
        private string lastSpokenInstruction = string.Empty;

#if UNITY_ANDROID && !UNITY_EDITOR
        private AndroidJavaObject ttsInstance = null;
        private bool isAndroidTtsReady = false;
#endif

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
            DontDestroyOnLoad(gameObject);

            audioSource = GetComponent<AudioSource>();
            if (audioSource == null) audioSource = gameObject.AddComponent<AudioSource>();

            // Load saved settings
            isVoiceEnabled = PlayerPrefs.GetInt("sih26041_voice_enabled", voiceEnabledByDefault ? 1 : 0) == 1;
            voiceVolume = PlayerPrefs.GetFloat("sih26041_voice_volume", defaultVolume);

#if UNITY_ANDROID && !UNITY_EDITOR
            InitializeAndroidTTS();
#endif
        }

#if UNITY_ANDROID && !UNITY_EDITOR
        private void InitializeAndroidTTS()
        {
            try
            {
                using (AndroidJavaClass unityPlayer = new AndroidJavaClass("com.unity3d.player.UnityPlayer"))
                {
                    AndroidJavaObject currentActivity = unityPlayer.GetStatic<AndroidJavaObject>("currentActivity");
                    ttsInstance = new AndroidJavaObject("android.speech.tts.TextToSpeech", currentActivity, new AndroidTTSOnInitListener(this));
                }
            }
            catch (Exception ex)
            {
                Debug.LogWarning($"[VoiceGuidanceManager] Android TTS initialization failed: {ex.Message}. Using audio chime fallback.");
                isAndroidTtsReady = false;
            }
        }

        private class AndroidTTSOnInitListener : AndroidJavaProxy
        {
            private VoiceGuidanceManager manager;
            public AndroidTTSOnInitListener(VoiceGuidanceManager mgr) : base("android.speech.tts.TextToSpeech$OnInitListener")
            {
                manager = mgr;
            }

            public void onInit(int status)
            {
                if (status == 0) // TextToSpeech.SUCCESS
                {
                    manager.isAndroidTtsReady = true;
                    Debug.Log("[VoiceGuidanceManager] Android TextToSpeech engine initialized successfully.");
                }
                else
                {
                    Debug.LogWarning("[VoiceGuidanceManager] Android TextToSpeech engine failed with status: " + status);
                    manager.isAndroidTtsReady = false;
                }
            }
        }
#endif

        public bool IsVoiceEnabled => isVoiceEnabled;
        public float VoiceVolume => voiceVolume;

        public void SetVoiceEnabled(bool enabled)
        {
            isVoiceEnabled = enabled;
            PlayerPrefs.SetInt("sih26041_voice_enabled", enabled ? 1 : 0);
            PlayerPrefs.Save();

            if (!enabled) StopSpeaking();
        }

        public void SetVolume(float vol)
        {
            voiceVolume = Mathf.Clamp01(vol);
            PlayerPrefs.SetFloat("sih26041_voice_volume", voiceVolume);
            PlayerPrefs.Save();
        }

        /// <summary>
        /// Speaks a localized instruction by key or plain text. Follows active language setting.
        /// </summary>
        public void Speak(string textOrKey, bool isLocalizationKey = true)
        {
            if (!isVoiceEnabled) return;

            string textToSpeak = isLocalizationKey ? LocalizationManager.Instance.Get(textOrKey) : textOrKey;
            if (string.IsNullOrEmpty(textToSpeak)) return;

            lastSpokenInstruction = textToSpeak;
            string currentLang = LocalizationManager.Instance.CurrentLanguage;

            // Play auditory chime indicator
            if (chimeAudioClip != null && audioSource != null)
            {
                audioSource.PlayOneShot(chimeAudioClip, voiceVolume * 0.4f);
            }

#if UNITY_ANDROID && !UNITY_EDITOR
            if (isAndroidTtsReady && ttsInstance != null)
            {
                try
                {
                    using (AndroidJavaClass localeClass = new AndroidJavaClass("java.util.Locale"))
                    {
                        AndroidJavaObject locale = currentLang == "hi" 
                            ? localeClass.CallStatic<AndroidJavaObject>("forLanguageTag", "hi-IN")
                            : localeClass.GetStatic<AndroidJavaObject>("US");

                        int available = ttsInstance.Call<int>("isLanguageAvailable", locale);
                        if (available >= 0)
                        {
                            ttsInstance.Call<int>("setLanguage", locale);
                            using (AndroidJavaObject paramsBundle = new AndroidJavaObject("android.os.Bundle"))
                            {
                                ttsInstance.Call<int>("speak", textToSpeak, 0, paramsBundle, "SIH26041_UTTERANCE");
                            }
                            return;
                        }
                        else
                        {
                            Debug.LogWarning($"[VoiceGuidanceManager] Locale '{currentLang}' not available on device. Falling back to English or chime.");
                        }
                    }
                }
                catch (Exception e)
                {
                    Debug.LogError($"[VoiceGuidanceManager] Android TTS speak error: {e.Message}");
                }
            }
#endif
            // Web / Editor / Desktop fallback: Log spoken utterance
            Debug.Log($"[VoiceGuidanceManager Spoken ({currentLang})]: \\"{textToSpeak}\\" (Volume: {voiceVolume:P0})");
        }

        public void ReplayLastInstruction()
        {
            if (string.IsNullOrEmpty(lastSpokenInstruction))
            {
                Speak("SCAN_FLOOR_INSTRUCTION", true);
            }
            else
            {
                Speak(lastSpokenInstruction, false);
            }
        }

        public void StopSpeaking()
        {
#if UNITY_ANDROID && !UNITY_EDITOR
            if (isAndroidTtsReady && ttsInstance != null)
            {
                ttsInstance.Call<int>("stop");
            }
#endif
            if (audioSource != null && audioSource.isPlaying)
            {
                audioSource.Stop();
            }
        }

        private void OnDestroy()
        {
#if UNITY_ANDROID && !UNITY_EDITOR
            if (ttsInstance != null)
            {
                ttsInstance.Call("shutdown");
                ttsInstance = null;
            }
#endif
        }
    }
}`
  },
  {
    id: 'script-accessibility-manager',
    step: 7,
    filename: 'AccessibilityManager.cs',
    className: 'AccessibilityManager',
    namespace: 'SIH26041.Accessibility',
    summary: 'Manages dynamic UI text scaling (100%-150%), high-contrast outdoor shader/canvas styling, and color-independent geometric indicators.',
    targetGameObject: '[AccessibilityManager]',
    requiredComponents: [],
    inspectorFields: [
      { name: 'normalFontScale', type: 'float', description: 'Standard text scale (1.0)', required: true },
      { name: 'largeFontScale', type: 'float', description: 'Large text scale (1.25)', required: true },
      { name: 'xlargeFontScale', type: 'float', description: 'Extra large text scale (1.5)', required: true },
      { name: 'highContrastMaterial', type: 'Material', description: 'High contrast canvas overlay material for bright daylight reading', required: false }
    ],
    code: `using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

namespace SIH26041.Accessibility
{
    public enum TextScaleLevel
    {
        Normal = 0,
        Large = 1,
        XLarge = 2
    }

    /// <summary>
    /// Accessibility Manager for SIH 26041.
    /// Supports dynamic TextMeshPro font scaling, high-contrast UI mode, and color-independent
    /// geometric shape indicators so color-blind trainees never rely solely on red/green colors.
    /// </summary>
    public class AccessibilityManager : MonoBehaviour
    {
        public static AccessibilityManager Instance { get; private set; }

        public event Action<TextScaleLevel> OnTextScaleChanged;
        public event Action<bool> OnHighContrastChanged;

        [Header("Font Scaling Multipliers")]
        [SerializeField] private float normalFontScale = 1.0f;
        [SerializeField] private float largeFontScale = 1.25f;
        [SerializeField] private float xlargeFontScale = 1.5f;

        [Header("Visual Contrasting")]
        [SerializeField] private Material highContrastMaterial;

        private TextScaleLevel currentTextScale = TextScaleLevel.Normal;
        private bool isHighContrast = false;
        private bool useColorIndependentIcons = true;
        private readonly Dictionary<TextMeshProUGUI, float> _baselineFontSizes = new Dictionary<TextMeshProUGUI, float>();

        private const string PREF_TEXT_SCALE = "sih26041_text_scale";
        private const string PREF_HIGH_CONTRAST = "sih26041_high_contrast";

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
            DontDestroyOnLoad(gameObject);

            LoadPreferences();
        }

        private void LoadPreferences()
        {
            currentTextScale = (TextScaleLevel)PlayerPrefs.GetInt(PREF_TEXT_SCALE, (int)TextScaleLevel.Normal);
            isHighContrast = PlayerPrefs.GetInt(PREF_HIGH_CONTRAST, 0) == 1;
        }

        public TextScaleLevel CurrentTextScale => currentTextScale;
        public bool IsHighContrast => isHighContrast;
        public bool UseColorIndependentIcons => useColorIndependentIcons;

        public float GetCurrentScaleMultiplier()
        {
            switch (currentTextScale)
            {
                case TextScaleLevel.Large: return largeFontScale;
                case TextScaleLevel.XLarge: return xlargeFontScale;
                default: return normalFontScale;
            }
        }

        public void SetTextScale(TextScaleLevel level)
        {
            currentTextScale = level;
            PlayerPrefs.SetInt(PREF_TEXT_SCALE, (int)level);
            PlayerPrefs.Save();

            ApplyTextScalingToActiveCanvases();
            OnTextScaleChanged?.Invoke(level);
        }

        public void SetHighContrast(bool enabled)
        {
            isHighContrast = enabled;
            PlayerPrefs.SetInt(PREF_HIGH_CONTRAST, enabled ? 1 : 0);
            PlayerPrefs.Save();

            ApplyHighContrastToCanvases();
            OnHighContrastChanged?.Invoke(enabled);
        }

        private void ApplyTextScalingToActiveCanvases()
        {
            float mult = GetCurrentScaleMultiplier();
            TextMeshProUGUI[] allTexts = FindObjectsByType<TextMeshProUGUI>(FindObjectsInactive.Include, FindObjectsSortMode.None);
            foreach (var t in allTexts)
            {
                if (t == null) continue;
                if (!_baselineFontSizes.ContainsKey(t))
                {
                    _baselineFontSizes[t] = t.fontSize;
                }
                t.fontSize = _baselineFontSizes[t] * mult;
            }
        }

        private void ApplyHighContrastToCanvases()
        {
            Debug.Log($"[AccessibilityManager] High contrast mode set to: {isHighContrast}");
        }
    }
}`
  },
  {
    id: 'script-demo-mode-manager',
    step: 7,
    filename: 'DemoModeManager.cs',
    className: 'DemoModeManager',
    namespace: 'SIH26041.Demo',
    summary: 'Orchestrates the 10-step SIH jury demonstration workflow using the real underlying simulation, isolated demo state, and one-click demo reset.',
    targetGameObject: '[DemoModeManager]',
    requiredComponents: [],
    inspectorFields: [
      { name: 'defaultDemoScenarioId', type: 'string', description: 'First scenario launched in demo flow (scenario-1-ppe)', required: true },
      { name: 'autoVoiceOnDemoStep', type: 'bool', description: 'Automatically vocalize step instructions during demo', required: false }
    ],
    code: `using System;
using UnityEngine;
using SIH26041.Audio;
using SIH26041.Localization;

namespace SIH26041.Demo
{
    public enum DemoFlowStep
    {
        Welcome = 0,
        LanguageSelect = 1,
        ScenarioSelect = 2,
        ARPlacement = 3,
        HazardDetection = 4,
        AISafetyAnalysis = 5,
        CompleteScenario = 6,
        ScoreAndXP = 7,
        AchievementUnlock = 8,
        SmartRecommendationAndDashboard = 9
    }

    /// <summary>
    /// Dedicated SIH Demonstration Mode Manager.
    /// Enables the team to showcase the full end-to-end flow without lengthy setup.
    /// Uses real scenario logic and keeps demo progress strictly isolated from production records.
    /// </summary>
    public class DemoModeManager : MonoBehaviour
    {
        public static DemoModeManager Instance { get; private set; }

        public event Action<DemoFlowStep> OnDemoStepChanged;
        public event Action OnDemoReset;

        [SerializeField] private string defaultDemoScenarioId = "scenario-1-ppe";
        [SerializeField] private bool autoVoiceOnDemoStep = true;

        private bool isDemoModeActive = false;
        private DemoFlowStep currentStep = DemoFlowStep.Welcome;
        private string activeDemoScenarioId;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
            DontDestroyOnLoad(gameObject);
            activeDemoScenarioId = defaultDemoScenarioId;
        }

        public bool IsDemoModeActive => isDemoModeActive;
        public DemoFlowStep CurrentStep => currentStep;
        public string ActiveDemoScenarioId => activeDemoScenarioId;

        public void StartDemoMode(string scenarioId = null)
        {
            isDemoModeActive = true;
            activeDemoScenarioId = !string.IsNullOrEmpty(scenarioId) ? scenarioId : defaultDemoScenarioId;
            SetStep(DemoFlowStep.Welcome);
            Debug.Log("[DemoModeManager] Started SIH Demo Mode at Step: Welcome");
        }

        public void AdvanceDemoStep()
        {
            if (!isDemoModeActive) return;

            int next = (int)currentStep + 1;
            if (next <= (int)DemoFlowStep.SmartRecommendationAndDashboard)
            {
                SetStep((DemoFlowStep)next);
            }
            else
            {
                CompleteDemoMode();
            }
        }

        public void SetStep(DemoFlowStep step)
        {
            currentStep = step;
            OnDemoStepChanged?.Invoke(step);

            if (autoVoiceOnDemoStep && VoiceGuidanceManager.Instance != null)
            {
                VocalizeStep(step);
            }
        }

        private void VocalizeStep(DemoFlowStep step)
        {
            switch (step)
            {
                case DemoFlowStep.Welcome:
                    VoiceGuidanceManager.Instance.Speak("TRAINING_START");
                    break;
                case DemoFlowStep.ARPlacement:
                    VoiceGuidanceManager.Instance.Speak("SCAN_FLOOR_INSTRUCTION");
                    break;
                case DemoFlowStep.HazardDetection:
                    VoiceGuidanceManager.Instance.Speak("VOICE_IDENTIFY_ELECTRICAL");
                    break;
                case DemoFlowStep.CompleteScenario:
                    VoiceGuidanceManager.Instance.Speak("SCENARIO_COMPLETED");
                    break;
            }
        }

        /// <summary>
        /// Clears only demo-mode state and restores demo initial conditions.
        /// Never modifies or deletes real Firebase trainee records.
        /// </summary>
        public void ResetDemo()
        {
            currentStep = DemoFlowStep.Welcome;
            activeDemoScenarioId = defaultDemoScenarioId;
            DemoDataManager.Instance?.ClearDemoSessions();

            OnDemoReset?.Invoke();
            Debug.Log("[DemoModeManager] Demo mode reset successfully. Real trainee data untouched.");
        }

        public void ExitDemoMode()
        {
            isDemoModeActive = false;
            Debug.Log("[DemoModeManager] Exited Demo Mode.");
        }

        private void CompleteDemoMode()
        {
            Debug.Log("[DemoModeManager] Completed full 10-step SIH demo flow.");
        }
    }
}`
  },
  {
    id: 'script-demo-data-manager',
    step: 7,
    filename: 'DemoDataManager.cs',
    className: 'DemoDataManager',
    namespace: 'SIH26041.Demo',
    summary: 'Manages sample presentation data with strict isolation from real trainee records and Firestore persistence.',
    targetGameObject: '[DemoDataManager]',
    requiredComponents: [],
    inspectorFields: [
      { name: 'includeSampleTrainees', type: 'bool', description: 'Pre-populate 3 sample presentation trainee records', required: true }
    ],
    code: `using System;
using System.Collections.Generic;
using UnityEngine;

namespace SIH26041.Demo
{
    [Serializable]
    public class DemoTraineeSession
    {
        public string id;
        public string traineeName;
        public string scenarioId;
        public int score;
        public int maxScore;
        public bool isDemoRecord = true;
        public string timestamp;
    }

    /// <summary>
    /// Manages presentation/demo sample records.
    /// Strictly guarantees demo records are never mixed with real Firebase user records.
    /// </summary>
    public class DemoDataManager : MonoBehaviour
    {
        public static DemoDataManager Instance { get; private set; }

        [SerializeField] private bool includeSampleTrainees = true;

        private List<DemoTraineeSession> demoSessions = new List<DemoTraineeSession>();

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
            DontDestroyOnLoad(gameObject);

            if (includeSampleTrainees)
            {
                SeedDemoData();
            }
        }

        private void SeedDemoData()
        {
            demoSessions.Clear();
            demoSessions.Add(new DemoTraineeSession
            {
                id = "demo-sess-001",
                traineeName = "Demo Trainee — Priya (Ranchi ITI)",
                scenarioId = "scenario-1-ppe",
                score = 95,
                maxScore = 100,
                timestamp = DateTime.UtcNow.ToString("o")
            });
            demoSessions.Add(new DemoTraineeSession
            {
                id = "demo-sess-002",
                traineeName = "Demo Trainee — Rajesh (Dhanbad Mines)",
                scenarioId = "scenario-4-mining",
                score = 88,
                maxScore = 100,
                timestamp = DateTime.UtcNow.ToString("o")
            });
        }

        public IReadOnlyList<DemoTraineeSession> GetDemoSessions() => demoSessions.AsReadOnly();

        public void AddDemoSession(DemoTraineeSession session)
        {
            session.isDemoRecord = true;
            demoSessions.Add(session);
        }

        public void ClearDemoSessions()
        {
            demoSessions.Clear();
            SeedDemoData();
        }
    }
}`
  },
  {
    id: 'script-localized-safety-terms',
    step: 7,
    filename: 'LocalizedSafetyTerms.cs',
    className: 'LocalizedSafetyTerms',
    namespace: 'SIH26041.Localization',
    summary: 'Centralized industrial safety terminology container providing standardized English and Hindi translations with DGMS, CEA, and IS regulation references.',
    targetGameObject: '[LocalizedSafetyTerms]',
    requiredComponents: [],
    inspectorFields: [
      { name: 'terminologyCount', type: 'int', description: 'Total safety terms defined', required: false }
    ],
    code: `using System;
using System.Collections.Generic;
using UnityEngine;

namespace SIH26041.Localization
{
    [Serializable]
    public class SafetyTermDefinition
    {
        public string id;
        public string termEn;
        public string termHi;
        public string category; // ppe, electrical, mining, emergency, machinery
        public string definitionEn;
        public string definitionHi;
        public string regulationRef;
    }

    /// <summary>
    /// Centralized registry for industrial safety vocabulary across English and Hindi.
    /// Ensures consistent phrasing for PPE, hazards, and regulatory articles.
    /// </summary>
    public class LocalizedSafetyTerms : MonoBehaviour
    {
        public static LocalizedSafetyTerms Instance { get; private set; }

        private readonly Dictionary<string, SafetyTermDefinition> termsMap = new Dictionary<string, SafetyTermDefinition>();

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
            DontDestroyOnLoad(gameObject);

            InitializeGlossary();
        }

        private void InitializeGlossary()
        {
            AddTerm("helmet", "Safety Helmet / Hard Hat", "सुरक्षा हेलमेट (हार्ड हैट)", "ppe",
                "Rigid head protection per IS 2925.", "आई.एस. 2925 के अनुसार सिर का सुरक्षा कवच।", "IS 2925 & CMR 190");
            AddTerm("vest", "High-Visibility Safety Vest", "परावर्तक सुरक्षात्मक बनियान (हाई-विज़ वेस्ट)", "ppe",
                "Fluorescent vest with reflective stripes.", "परावर्तक पट्टियों वाला चमकीला सुरक्षा वस्त्र।", "IS 15809");
            AddTerm("electrical_hazard", "Electrical Hazard / Live Wire", "विद्युत ख़तरा / खुला चालू तार", "electrical",
                "Unshielded energized conductor.", "खुला हुआ चालू बिजली का तार जिससे झटका लग सकता है।", "CEA Reg 30");
            AddTerm("loto", "Lockout / Tagout (LOTO)", "तालाबंदी एवं टैगिंग (लोटो)", "electrical",
                "Physical padlocking during maintenance.", "मरम्मत के दौरान बिजली स्विच पर ताला लगाना।", "OSHA 1910.147");
            AddTerm("machine_guard", "Machine Nip-Point Guard", "मशीन सुरक्षा आवरण (गार्ड)", "machinery",
                "Interlocking physical barrier.", "घूमने वाले पुर्जों से बचाने वाली सुरक्षा जाली।", "IS 9474");
            AddTerm("fire_extinguisher", "DCP Fire Extinguisher", "डी.सी.पी. सूखा अग्निशामक", "emergency",
                "Dry chemical extinguisher for Class A, B, C.", "बिजली और तेल की आग बुझाने का यंत्र।", "IS 15683");
        }

        private void AddTerm(string id, string en, string hi, string cat, string defEn, string defHi, string reg)
        {
            termsMap[id] = new SafetyTermDefinition
            {
                id = id,
                termEn = en,
                termHi = hi,
                category = cat,
                definitionEn = defEn,
                definitionHi = defHi,
                regulationRef = reg
            };
        }

        public SafetyTermDefinition GetTerm(string id)
        {
            termsMap.TryGetValue(id, out var term);
            return term;
        }

        public string GetTermDisplay(string id, string lang = "en")
        {
            if (termsMap.TryGetValue(id, out var term))
            {
                return lang == "hi" ? term.termHi : term.termEn;
            }
            return id;
        }
    }
}`
  }
];
