import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Play,
  Volume2,
  ChevronRight,
  ShieldCheck,
  Zap,
  Flame,
  Pickaxe,
  Wrench,
  Check
} from 'lucide-react';
import { SCENARIO_DEFINITIONS } from '../../data/step5Data';

interface ScenarioModuleIntroPageProps {
  scenarioId: string;
  currentLanguage: string;
  onLaunchARSimulation: () => void;
  onBackToScenarios: () => void;
  onWatchSafetySteps?: (scenarioId: string) => void;
  onVoiceSpeak?: (text: string) => void;
}

interface ScenarioConfig {
  number: number;
  titleEn: string;
  titleHi: string;
  industryEn: string;
  industryHi: string;
  standard: string;
  badge: string;
  situationEn: string;
  situationHi: string;
  icon: React.ComponentType<{ className?: string }>;
  colorTheme: string;
  initialChecks: { id: string; textEn: string; textHi: string; standard: string }[];
  hazards: { id: string; titleEn: string; titleHi: string; severity: string; standard: string; descEn: string; descHi: string }[];
}

const SCENARIO_CONFIGS: Record<string, ScenarioConfig> = {
  'scenario-2-fire': {
    number: 2,
    titleEn: 'Industrial Fire Safety & Emergency Evacuation',
    titleHi: 'औद्योगिक अग्नि सुरक्षा और आपातकालीन निकासी',
    industryEn: 'Industrial Facility & Flammable Storage',
    industryHi: 'औद्योगिक संयंत्र और ज्वलनशील भंडारण',
    standard: 'IS 2190 / IS 15683 / NFPA 10',
    badge: 'IS 2190 / NFPA 10',
    situationEn: 'Electrical transformer overheating and smoke outbreak near plant flammables. Trainee must sound the alarm, operate the DCP extinguisher using P.A.S.S., clear egress routes, and evacuate personnel to the safe muster point.',
    situationHi: 'विद्युत ट्रांसफार्मर के अधिक गर्म होने से धुआं और आग का फैलाव। प्रशिक्षु को अलार्म बजाना होगा, P.A.S.S. नियम से DCP अग्निशामक चलाना होगा, निकास द्वार साफ करना होगा और कर्मचारियों को सुरक्षित स्थान पर पहुंचाना होगा।',
    icon: Flame,
    colorTheme: 'red',
    initialChecks: [
      { id: 'fc-1', textEn: 'Inspect ABC / DCP dry chemical powder extinguisher pressure gauge in green zone', textHi: 'ABC/DCP अग्निशामक का प्रेशर गेज हरे निशान में जांचें', standard: 'IS 15683' },
      { id: 'fc-2', textEn: 'Verify wall-mounted manual call point (break-glass alarm) accessibility', textHi: 'मैनुअल कॉल पॉइंट (अलार्म बॉक्स) तक पहुंच की जांच करें', standard: 'IS 2189' },
      { id: 'fc-3', textEn: 'Confirm illuminated emergency exit push-bar doors are unlocked and unobstructed', textHi: 'इमरजेंसी फायर एग्जिट दरवाजे खुले और बिना रुकावट के होने की पुष्टि करें', standard: 'IS 2190' },
      { id: 'fc-4', textEn: 'Review emergency muster assembly point location and evacuation route markers', textHi: 'आपातकालीन असेंबली पॉइंट और निकास तीर के निशानों की समीक्षा करें', standard: 'Factories Act Sec 38' }
    ],
    hazards: [
      {
        id: 'fire-active-blaze',
        titleEn: 'Active Class B/C Machinery Fire',
        titleHi: 'सक्रिय औद्योगिक मशीनरी आग',
        severity: 'Critical',
        standard: 'IS 15683',
        descEn: 'Electrical transformer oil fire producing flames, dense smoke plume, and thermal radiation.',
        descHi: 'ट्रांसफार्मर के तेल में आग जिससे लपटें और घना जहरीला धुआं निकल रहा है।'
      },
      {
        id: 'fire-blocked-exit',
        titleEn: 'Obstructed Emergency Egress Route',
        titleHi: 'इमरजेंसी निकास द्वार पर रुकावट',
        severity: 'High',
        standard: 'IS 2190',
        descEn: 'Heavy wooden pallet crates stacked directly against the illuminated fire exit door.',
        descHi: 'आपातकालीन निकास द्वार के ठीक सामने लकड़ी के भारी बक्से रखे हुए हैं।'
      },
      {
        id: 'fire-alarm-pull',
        titleEn: 'Unactivated Manual Break-Glass Station',
        titleHi: 'मैनुअल फायर अलार्म न बजाना',
        severity: 'High',
        standard: 'IS 2189',
        descEn: 'Alarm has not been triggered to sound whole-plant evacuation sirens.',
        descHi: 'संयंत्र के सभी कर्मियों को सतर्क करने के लिए अलार्म अभी नहीं बजाया गया है।'
      },
      {
        id: 'fire-worker-evac',
        titleEn: 'Disoriented Worker in Smoke Zone',
        titleHi: 'धुएं में फंसा हुआ श्रमिक',
        severity: 'High',
        standard: 'DGMS Life Safety',
        descEn: 'Worker coughing in smoke corridor requiring guidance to outdoor safe assembly zone.',
        descHi: 'श्रमिक धुएं में रास्ता भूल गया है और उसे बाहर सुरक्षित स्थान पर ले जाने की आवश्यकता है।'
      }
    ]
  },

  'scenario-3-electrical': {
    number: 3,
    titleEn: 'High-Voltage Electrical Substation Safety',
    titleHi: 'हाई-वोल्टेज विद्युत सबस्टेशन सुरक्षा',
    industryEn: 'Electrical Infrastructure & Switchgear',
    industryHi: 'विद्युत सबस्टेशन और 440V स्विचगियर',
    standard: 'CEA Regulations 2010 / IS 4770 / IS 15652',
    badge: 'CEA Regs 2010 / IS 4770',
    situationEn: 'A 440V/11kV industrial power distribution substation with exposed conductors, wet conductive pooling, and unauthorized worker proximity. Trainee must apply LOTO isolation, deploy insulating mats, equip dielectric PPE, and clear danger signage.',
    situationHi: '440V/11kV सबस्टेशन में कटी हुई केबल, फर्श पर पानी और बिना सुरक्षा काम करने का खतरा। प्रशिक्षु को LOTO आइसोलेशन लागू करना होगा, इंसुलेटिंग मैट बिछाना होगा, रबर ग्लव्स पहनने होंगे और खतरे का बोर्ड साफ करना होगा।',
    icon: Zap,
    colorTheme: 'amber',
    initialChecks: [
      { id: 'ec-1', textEn: 'Verify IS 4770 Class 0 dielectric rubber insulating gloves (1000V rated) condition', textHi: 'IS 4770 क्लास 0 डाइइलेक्ट्रिक इन्सुलेटिंग दस्तानों की स्थिति जांचें', standard: 'IS 4770' },
      { id: 'ec-2', textEn: 'Confirm non-conductive safety helmet and arc-flash protective face shield', textHi: 'गैर-सुचालक सुरक्षा हेलमेट और आर्क-फ्लैश फेस शील्ड की पुष्टि करें', standard: 'NFPA 70E' },
      { id: 'ec-3', textEn: 'Inspect Lockout/Tagout (LOTO) padlocks, lockout hasps, and statutory danger tags', textHi: 'LOTO पैडलॉक, हैस्प और वैधानिक खतरा टैग की जांच करें', standard: 'CEA Reg 30' },
      { id: 'ec-4', textEn: 'Verify calibrated non-contact voltage detector is tested against live proving unit', textHi: 'सत्यापित वोल्टेज डिटेक्टर से शून्य वोल्टेज की जांच करें', standard: 'IS 732' }
    ],
    hazards: [
      {
        id: 'elec-exposed-cable',
        titleEn: 'Torn 440V Main Conduit Sheath',
        titleHi: 'कटा हुआ 440V मुख्य विद्युत केबल',
        severity: 'Critical',
        standard: 'CEA Reg 30',
        descEn: 'Feed conduit torn open with bare copper conductors exposed near transformer footings.',
        descHi: 'ट्रांसफार्मर के पास 440V केबल कटा हुआ है और नंगे तांबे के तार बाहर हैं।'
      },
      {
        id: 'elec-wet-floor',
        titleEn: 'Conductive Water Pool in Switchgear Bay',
        titleHi: 'स्विचगियर के पास पानी भरा होना',
        severity: 'High',
        standard: 'IS 15652',
        descEn: 'Water pooling across operator standing zone creates severe electrocution hazard.',
        descHi: 'स्विचगियर के सामने पानी भरा होने से ऑपरेटर के शरीर से करंट जाने का गंभीर खतरा है।'
      },
      {
        id: 'elec-missing-gloves',
        titleEn: 'Worker Lacks Dielectric Insulating Gloves',
        titleHi: 'इंसुलेटिंग रबर दस्ताने न होना',
        severity: 'High',
        standard: 'IS 4770',
        descEn: 'Operator reaching towards panel door barehanded without 1000V rated gloves.',
        descHi: 'तकनीशियन बिना इन्सुलेटिंग दस्तानों के नंगे हाथों से स्विच छू रहा है।'
      },
      {
        id: 'elec-blocked-sign',
        titleEn: 'Obstructed High-Voltage Placard',
        titleHi: 'खतरे का बोर्ड छिपा होना',
        severity: 'Medium',
        standard: 'IS 2551',
        descEn: 'Statutory 440V Danger signboard is obscured by stacked toolboxes and debris.',
        descHi: '440V का लाल खतरा बोर्ड कबाड़ और बक्सों के पीछे छिपा हुआ है।'
      }
    ]
  },

  'scenario-4-mining': {
    number: 4,
    titleEn: 'Mining Underground & Haulage Road Safety',
    titleHi: 'भूमिगत कोयला खदान और हॉलेज सुरक्षा',
    industryEn: 'Underground Coal Mine & Haulage Fairway',
    industryHi: 'भूमिगत कोयला खदान और हॉलेज मार्ग',
    standard: 'DGMS Coal Mines Regulations 2017 / CMR 2017',
    badge: 'DGMS CMR 2017',
    situationEn: 'Simulates underground coal drift roadway with heavy 35-tonne dump truck turning blind zones, unsupported roof strata, and unventilated abandoned workings. Trainee must enforce refuge bay clearance, install hydraulic roof props, equip approved cap lamps, and erect DGMS danger gates.',
    situationHi: 'भूमिगत कोयला खदान में 35-टन डंपर के ब्लाइंड स्पॉट, कमजोर छत (Roof Fall खतरा) और पुरानी गैलरी का खतरा। प्रशिक्षु को रिफ्यूज बे का उपयोग करना होगा, सपोर्ट प्रॉप लगाना होगा, फ्लेमप्रूफ कैप लैंप पहनना होगा और डेंजर गेट लगाना होगा।',
    icon: Pickaxe,
    colorTheme: 'emerald',
    initialChecks: [
      { id: 'mc-1', textEn: 'Verify DGMS approved intrinsically safe LED cap lamp battery and beam focus', textHi: 'DGMS अनुमोदित फ्लेमप्रूफ LED कैप लैंप और बैटरी की जांच करें', standard: 'DGMS CMR Reg 170' },
      { id: 'mc-2', textEn: 'Inspect Type II mining helmet with secure chin strap and high-reflectivity bands', textHi: 'चिन स्ट्रैप और रिफ्लेक्टिव बैंड वाले माइनिंग हेलमेट की जांच करें', standard: 'IS 2925 Type II' },
      { id: 'mc-3', textEn: 'Verify portable methanometer / multi-gas detector for CH4, CO, and O2 levels', textHi: 'मीथेन, CO और ऑक्सीजन जांच के लिए मल्टी-गैस डिटेक्टर की पुष्टि करें', standard: 'DGMS Reg 153' },
      { id: 'mc-4', textEn: 'Confirm self-contained self-rescuer (SCSR) seal and pressure indicator tag', textHi: 'आपातकालीन सांस उपकरण (SCSR) की सील और टैग की जांच करें', standard: 'DGMS Circular' }
    ],
    hazards: [
      {
        id: 'mine-haulage-blindspot',
        titleEn: 'Pedestrian in 35T Dumper Turning Radius',
        titleHi: 'डंपर के ब्लाइंड स्पॉट में श्रमिक',
        severity: 'Critical',
        standard: 'DGMS Reg 104',
        descEn: 'Worker standing within rear 6-meter turning radius of active diesel mining haul truck.',
        descHi: 'श्रमिक 35-टन भारी डंपर के ठीक पीछे खड़ा है जहां ड्राइवर को कुछ नहीं दिखता।'
      },
      {
        id: 'mine-unstable-roof',
        titleEn: 'Unsupported Strata / Loose Hanging Wall',
        titleHi: 'कमजोर छत (Roof Fall का खतरा)',
        severity: 'Critical',
        standard: 'DGMS Reg 123 / SCMP',
        descEn: 'Visible fracture plane in coal ceiling with absent resin rock bolts and tell-tale convergence.',
        descHi: 'कोयले की छत में गहरी दरार है और कोई रूफ बोल्ट नहीं लगा है। ढहने का गंभीर खतरा।'
      },
      {
        id: 'mine-no-caplamp',
        titleEn: 'Worker Lacks Approved Cap Lamp & Helmet',
        titleHi: 'अनुमोदित कैप लैंप और हेलमेट न होना',
        severity: 'High',
        standard: 'IS 2925 Type II',
        descEn: 'Worker entering dark drift gallery lacking intrinsically safe LED cap lamp.',
        descHi: 'श्रमिक बिना फ्लेमप्रूफ कैप लैंप और हेलमेट के अंधेरी खदान में जा रहा है।'
      },
      {
        id: 'mine-missing-sign',
        titleEn: 'Missing DGMS Statutory Danger Board',
        titleHi: 'DGMS खतरा बोर्ड न होना',
        severity: 'Medium',
        standard: 'CMR 2017 Reg 139',
        descEn: 'Unventilated blind roadway or abandoned goaf lacks reflective bilingual warning barrier.',
        descHi: 'बंद या बिना हवा वाली गैलरी पर कोई लाल खतरा बैरियर नहीं है जहां जहरीली गैस हो सकती है।'
      }
    ]
  },

  'scenario-5-machinery': {
    number: 5,
    titleEn: 'Heavy Industrial Machinery & Nip-Point Guarding',
    titleHi: 'भारी मशीनरी और निप-पॉइंट सुरक्षा',
    industryEn: 'Heavy Mechanical Workshop & Conveyors',
    industryHi: 'भारी औद्योगिक मशीनरी और कन्वेयर सिस्टम',
    standard: 'IS 9474 Guarding / ISO 13850 E-Stop / Factories Act 1948',
    badge: 'IS 9474 / ISO 13850',
    situationEn: 'High-speed conveyor roller transmission line with exposed in-running nip points, loose operator sleeves, unhit Emergency Stop, and missing yellow demarcation boundary. Trainee must interlock guards, strike E-Stop, secure attire, and paint perimeter lines.',
    situationHi: 'तेज गति से चलने वाली कन्वेयर लाइन जिसमें खुले रोलर, ढीली आस्तीन, बिना दबाया हुआ इमरजेंसी स्टॉप और पीली सीमा रेखा का अभाव। प्रशिक्षु को सुरक्षा गार्ड लगाना होगा, E-Stop दबाना होगा, आस्तीन कसनी होगी और पीली पट्टी लगानी होगी।',
    icon: Wrench,
    colorTheme: 'purple',
    initialChecks: [
      { id: 'mac-1', textEn: 'Inspect tight-fitting protective boiler suit with buttoned wrist cuffs', textHi: 'कसी हुई सुरक्षा पोशाक और कलाई के बटन बंद होने की जांच करें', standard: 'Factories Rules' },
      { id: 'mac-2', textEn: 'Verify prominent red mushroom Emergency Stop (E-Stop) pushbutton trip circuit', textHi: 'लाल मशरूम इमरजेंसी स्टॉप (E-Stop) बटन और सर्किट की जांच करें', standard: 'ISO 13850' },
      { id: 'mac-3', textEn: 'Verify mechanical wire mesh interlock limit switch cuts motor drive power when opened', textHi: 'जालीदार गार्ड खुलने पर मोटर कटने वाले इंटरलॉक स्विच की जांच करें', standard: 'IS 9474' },
      { id: 'mac-4', textEn: 'Inspect yellow and black diagonal hazard warning floor boundary clearance', textHi: 'फर्श पर पीली और काली सुरक्षा सीमा रेखा की जांच करें', standard: 'IS 2379' }
    ],
    hazards: [
      {
        id: 'mach-missing-guard',
        titleEn: 'Unguarded In-Running Rotating Roller Nip',
        titleHi: 'रोलर के पास सुरक्षा गार्ड न होना',
        severity: 'Critical',
        standard: 'IS 9474',
        descEn: 'Exposed cylinder rollers rotating at high speed without interlocked physical barrier.',
        descHi: 'तेजी से घूमने वाले रोलर बिना किसी सुरक्षा जाली के खुले चल रहे हैं।'
      },
      {
        id: 'mach-estop-unhit',
        titleEn: 'Rotating Roller Requires Emergency Stop',
        titleHi: 'इमरजेंसी स्टॉप बटन दबाने की आवश्यकता',
        severity: 'High',
        standard: 'ISO 13850',
        descEn: 'Machine drive running with abnormal vibration; emergency trip actuator unhit.',
        descHi: 'कन्वेयर में असामान्य कंपन है; लाल इमरजेंसी स्टॉप बटन नहीं दबाया गया है।'
      },
      {
        id: 'mach-loose-clothing',
        titleEn: 'Operator With Loose Sleeve Near Spindle',
        titleHi: 'ढीली आस्तीन पहनकर काम करना',
        severity: 'High',
        standard: 'Factories Act Sec 21',
        descEn: 'Machinist operating with unbuttoned drooping sleeve in dangerous proximity to spindle.',
        descHi: 'मशीन ऑपरेटर की खुली ढीली आस्तीन घूमने वाले शाफ्ट के ठीक पास लटक रही है।'
      },
      {
        id: 'mach-missing-perimeter',
        titleEn: 'Missing Yellow Perimeter Floor Demarcation',
        titleHi: 'पीली सुरक्षा सीमा रेखा का अभाव',
        severity: 'Medium',
        standard: 'IS 2379',
        descEn: 'Absence of high-visibility yellow/black hazard perimeter floor markings.',
        descHi: 'मशीन के चारों ओर फर्श पर पीली/काली सुरक्षा चेतावनी पट्टी नहीं है।'
      }
    ]
  }
};

export const ScenarioModuleIntroPage: React.FC<ScenarioModuleIntroPageProps> = ({
  scenarioId,
  currentLanguage,
  onLaunchARSimulation,
  onBackToScenarios,
  onWatchSafetySteps,
  onVoiceSpeak
}) => {
  const isHindi = currentLanguage === 'hi';

  // Normalize scenario ID mapping
  let configKey = scenarioId;
  if (scenarioId === 'scenario-2-electrical') configKey = 'scenario-3-electrical';
  if (scenarioId === 'scenario-3-fire') configKey = 'scenario-2-fire';

  const config = SCENARIO_CONFIGS[configKey] || SCENARIO_CONFIGS['scenario-2-fire'];

  // Interactive Checklist State
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => {
      const nextState = !prev[id];
      if (nextState) {
        onVoiceSpeak?.(isHindi ? 'सुरक्षा नियम सत्यापित किया गया।' : 'Safety check verified.');
      }
      return { ...prev, [id]: nextState };
    });
  };

  const handleStartSimulation = () => {
    onVoiceSpeak?.(
      isHindi
        ? `${config.titleHi} 3D सिमुलेशन शुरू कर रहे हैं।`
        : `Starting ${config.titleEn} 3D simulation.`
    );
    onLaunchARSimulation();
  };

  const handleReadIntroduction = () => {
    const text = isHindi
      ? `${config.titleHi}। ${config.situationHi}`
      : `${config.titleEn}. ${config.situationEn}`;
    onVoiceSpeak?.(text);
  };

  const IconComponent = config.icon;
  const allChecksComplete = config.initialChecks.every((c) => checkedItems[c.id]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn pb-12">
      {/* 1. Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-xl shadow-lg">
        <div className="flex items-center gap-3">
          <button
            id="btn-back-to-scenarios-intro"
            onClick={onBackToScenarios}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>{isHindi ? '← परिदृश्य सूची' : '← All Scenarios'}</span>
          </button>
          <div className="h-6 w-px bg-slate-800 hidden sm:block" />
          <div>
            <span className="text-[11px] text-amber-400 font-mono font-bold uppercase tracking-wider block">
              {isHindi ? `परिदृश्य ${config.number}: तैयारी एवं वैधानिक मानक` : `Scenario ${config.number}: Statutory Standard & Setup`}
            </span>
            <h1 className="text-lg sm:text-xl font-bold text-white">
              {isHindi ? config.titleHi : config.titleEn}
            </h1>
          </div>
        </div>

        {/* Start AR / 3D Simulation Button */}
        <button
          id="btn-module-start-ar"
          onClick={handleStartSimulation}
          className="px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors border border-amber-300 shrink-0"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          <span>{isHindi ? '3D/AR सिमुलेशन शुरू करें' : 'Start 3D / AR Simulation'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Situation & Environment Context Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5">
                <IconComponent className="w-4 h-4 text-amber-400" />
                {isHindi ? config.industryHi : config.industryEn}
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-xs font-mono font-medium border border-slate-700">
                {config.standard}
              </span>
            </div>

            <h2 className="text-xl font-bold text-white">
              {isHindi ? 'कार्यस्थल आपातकालीन स्थिति एवं प्रक्रिया' : 'Workplace Scenario Brief & Statutory Protocol'}
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              {isHindi ? config.situationHi : config.situationEn}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={handleReadIntroduction}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer border border-slate-700 transition-colors"
              >
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span>{isHindi ? 'निर्देश सुनें (Voice Guide)' : 'Listen to Briefing (Audio)'}</span>
              </button>

              {onWatchSafetySteps && (
                <button
                  onClick={() => onWatchSafetySteps(scenarioId)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer border border-slate-700 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isHindi ? '3D सुरक्षा वीडियो देखें' : 'Watch 3D Safety Video'}</span>
                </button>
              )}
            </div>
          </div>

          <div className="w-full md:w-64 bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2 shrink-0">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-bold block">
              {isHindi ? 'प्रशिक्षण आवश्यकताएं' : 'Training Requirements'}
            </span>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center justify-between py-1 border-b border-slate-900">
                <span>{isHindi ? 'खतरे खोजना' : 'Identify Hazards'}</span>
                <span className="font-bold text-amber-400 font-mono">4 {isHindi ? 'खतरे' : 'Hazards'}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-900">
                <span>{isHindi ? 'सुधारात्मक कार्रवाई' : 'Corrective Actions'}</span>
                <span className="font-bold text-amber-400 font-mono">100% {isHindi ? 'सटीक' : 'Required'}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-900">
                <span>{isHindi ? 'सुरक्षा प्रश्नोत्तरी' : 'Safety Quiz'}</span>
                <span className="font-bold text-amber-400 font-mono">5 {isHindi ? 'प्रश्न' : 'Questions'}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span>{isHindi ? 'पुरस्कार XP' : 'XP Reward'}</span>
                <span className="font-bold text-emerald-400 font-mono">+250 XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Pre-Entry PPE & Safety Checklist (Interactive) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider block">
              {isHindi ? 'चरण 1: प्रारंभिक जांच सूची' : 'Step 1: Pre-Entry Verification Checklist'}
            </span>
            <h3 className="text-base font-bold text-white">
              {isHindi ? 'कार्यस्थल में प्रवेश करने से पहले सभी जांचें पूरी करें' : 'Mandatory Safety & PPE Verification'}
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {Object.values(checkedItems).filter(Boolean).length} / {config.initialChecks.length} {isHindi ? 'सत्यापित' : 'Verified'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {config.initialChecks.map((item) => {
            const isChecked = Boolean(checkedItems[item.id]);
            return (
              <button
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-3.5 rounded-lg border text-left flex items-start gap-3 transition-colors cursor-pointer ${
                  isChecked
                    ? 'bg-emerald-950/30 border-emerald-600/60 text-white'
                    : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 border ${
                    isChecked
                      ? 'bg-emerald-600 border-emerald-500 text-white'
                      : 'bg-slate-800 border-slate-700 text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <div className="space-y-0.5 flex-1">
                  <span className="text-xs font-medium block leading-snug">
                    {isHindi ? item.textHi : item.textEn}
                  </span>
                  <span className="text-[10px] font-mono text-amber-400 block">
                    {item.standard}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Statutory Hazards in this Scenario */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider block">
              {isHindi ? 'चरण 2: कार्यस्थल निरीक्षण लक्ष्य' : 'Step 2: Workplace Inspection Targets'}
            </span>
            <h3 className="text-base font-bold text-white">
              {isHindi ? '4 प्रमुख खतरे जिनकी आपको पहचान करनी है' : '4 Statutory Hazards You Must Remediate in 3D'}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {config.hazards.map((hazard, index) => (
            <div
              key={hazard.id}
              className="bg-slate-950 border border-slate-800 p-4 rounded-lg space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-400">
                  #{index + 1}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-red-950/80 border border-red-800 text-red-400">
                  {hazard.severity} {isHindi ? 'खतरा' : 'Hazard'}
                </span>
              </div>

              <h4 className="text-sm font-bold text-white">
                {isHindi ? hazard.titleHi : hazard.titleEn}
              </h4>

              <p className="text-xs text-slate-400 leading-relaxed">
                {isHindi ? hazard.descHi : hazard.descEn}
              </p>

              <div className="text-[11px] font-mono text-amber-400/90 pt-1">
                <strong>{isHindi ? 'मानक:' : 'Standard:'}</strong> {hazard.standard}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Bottom Action Launch Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-base font-bold text-white">
            {isHindi ? 'क्या आप व्यावहारिक सिमुलेशन के लिए तैयार हैं?' : 'Ready for the Practical 3D Simulation?'}
          </h4>
          <p className="text-xs text-slate-400">
            {isHindi
              ? 'सिमुलेटर में 4 खतरों को पहचानें, सही सुधारात्मक कार्रवाई चुनें और उसके बाद 5-प्रश्नों की प्रश्नोत्तरी हल करें।'
              : 'Identify all 4 hazards in 3D, select the correct statutory remediations, and complete the 5-question safety quiz.'}
          </p>
        </div>

        <button
          id="btn-bottom-start-simulation"
          onClick={handleStartSimulation}
          className="w-full sm:w-auto px-8 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors border border-amber-300 shrink-0"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          <span>{isHindi ? '3D सिमुलेशन लॉन्च करें →' : 'Launch 3D Simulation →'}</span>
        </button>
      </div>
    </div>
  );
};
