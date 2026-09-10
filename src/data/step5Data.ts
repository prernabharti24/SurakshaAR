import { ScenarioDefinition, TraineeSessionRecord, CSharpScript, ChecklistItem } from '../types';

export const SCENARIO_DEFINITIONS: ScenarioDefinition[] = [
  {
    id: 'scenario-gas-leak',
    name: 'Industrial Gas Processing & Chemical Leakage',
    shortTitle: 'Gas Leakage Emergency',
    industry: 'Gas Processing & Petrochemicals',
    description: 'Simulates a high-pressure industrial gas processing plant manifold. Trainees must navigate the realistic facility, discover the pressurized flange leak, initiate emergency alarm & ventilation, don chemical PPE, and guide evacuation.',
    trainingObjectives: [
      'Locate abnormal pressurized gas/vapor leak along high-pressure pipeline flange',
      'Trigger emergency break-glass alarm to alert entire facility and initiate shutdown',
      'Equip certified IS/EN chemical respirator / SCBA before approaching hazard perimeter',
      'Engage explosion-proof emergency exhaust ventilation and evacuate to muster point'
    ],
    defaultDifficulty: 'Easy',
    passingPercentage: 80,
    timeLimitSeconds: { Easy: 120, Medium: 90, Hard: 60 },
    badge: 'PESO / Factories Act 1948',
    colorTheme: 'cyan',
    status: 'active',
    hazards: [
      {
        id: 'gas-valve-leak',
        title: 'Pressurized Gas Flange & Valve Leak',
        category: 'Chemical & Process Safety',
        severity: 'Critical',
        description: 'High-pressure gas pipeline joint leaking toxic/flammable vapor with visible plume and pressure drop.',
        recommendation: 'Sound plant emergency alarm, isolate upstream shutoff valve, and enforce 50m exclusion zone.',
        isHazard: true,
        scoreImpact: 15,
        correctAction: 'Emergency Isolation & Gas Shutoff',
        objectId: 'gas-valve-leak'
      },
      {
        id: 'gas-elec-panel',
        title: 'Unisolated Electrical Panel in Gas Zone',
        category: 'Explosion Prevention',
        severity: 'Critical',
        description: 'Open electrical control cabinet near leaking gas cloud presents immediate arc-flash ignition risk.',
        recommendation: 'Perform emergency electrical isolation outside hazardous vapor envelope; prevent all sparking.',
        isHazard: true,
        scoreImpact: 15,
        correctAction: 'Isolate Electrical Ignition Source',
        objectId: 'gas-elec-panel'
      },
      {
        id: 'gas-worker-ppe',
        title: 'Worker Without Chemical Respirator / SCBA',
        category: 'Personal Protective Equipment',
        severity: 'High',
        description: 'Worker in process bay breathing toxic chemical vapors without certified gas respirator or SCBA.',
        recommendation: 'Equip IS 9473/EN 14387 toxic gas respirator or Self-Contained Breathing Apparatus immediately.',
        isHazard: true,
        scoreImpact: 10,
        correctAction: 'Equip Chemical Respirator / SCBA',
        objectId: 'gas-worker-ppe'
      },
      {
        id: 'gas-blocked-exit',
        title: 'Obstructed Emergency Egress Route',
        category: 'Emergency Evacuation',
        severity: 'High',
        description: 'Cargo pallets and chemical drums blocking the designated illuminated emergency exit door.',
        recommendation: 'Clear exit corridor immediately; verify unimpeded path to outdoor windward muster point.',
        isHazard: true,
        scoreImpact: 10,
        correctAction: 'Clear Emergency Exit Corridor',
        objectId: 'gas-blocked-exit'
      }
    ],
    recommendedTraining: 'Petroleum and Explosives Safety Organisation (PESO) & Industrial Gas Handling Protocols (Module GAS-201)'
  },
  {
    id: 'scenario-1-ppe',
    number: 1,
    name: 'PPE & Workplace Hazard Identification',
    nameHi: 'पीपीई और बुनियादी कार्यस्थल खतरे',
    shortTitle: 'PPE & Baseline Hazards',
    shortTitleHi: 'पीपीई सुरक्षा',
    industry: 'General Manufacturing',
    industryHi: 'सामान्य विनिर्माण कार्यशाला',
    description: 'Foundational safety inspection for heavy workshop environments. Trainees identify missing personal protective equipment (IS 2925 helmet, IS 15809 vest) and environmental non-compliances.',
    descriptionHi: 'कार्यशाला का निरीक्षण करें, गायब सुरक्षा हेलमेट, बिना रिफ्लेक्टिव जैकेट, नंगी 440V बिजली केबल और खुली मशीनरी बैरियर की पहचान करें।',
    trainingObjectives: [
      'Identify missing mandatory head protection (IS 2925) within machine perimeter',
      'Spot absent high-visibility retro-reflective vest (IS 15809) in active haulage zone',
      'Locate exposed 440V 3-phase live feeder cabling on floor',
      'Verify installation of fixed machine perimeter barrier'
    ],
    defaultDifficulty: 'Easy',
    passingPercentage: 75,
    timeLimitSeconds: { Easy: 120, Medium: 90, Hard: 60 },
    badge: 'IS 2925 / IS 15809',
    badgeHi: 'IS 2925 / IS 15809 प्रमाणित',
    colorTheme: 'amber',
    status: 'active',
    hazards: [
      {
        id: 'worker-helmet',
        title: 'Missing Safety Hard Hat',
        titleHi: 'बिना हेलमेट श्रमिक (IS 2925)',
        category: 'Personal Protective Equipment',
        categoryHi: 'व्यक्तिगत सुरक्षा उपकरण',
        severity: 'High',
        description: 'Trainee/Worker is present in active machinery perimeter without high-density polyethylene helmet.',
        descriptionHi: 'श्रमिक बिना सुरक्षा हेलमेट के सक्रिय मशीनरी क्षेत्र में काम कर रहा है।',
        recommendation: 'Equip approved IS 2925 hard hat with secure chin strap to protect against overhead falling objects.',
        recommendationHi: 'सिर की सुरक्षा के लिए IS 2925 प्रमाणित हेलमेट और चिन स्ट्रैप पहनें।',
        standard: 'IS 2925',
        isHazard: true,
        scoreImpact: 10,
        correctAction: 'Equip IS 2925 Helmet',
        objectId: 'worker-helmet'
      },
      {
        id: 'exposed-wire',
        title: 'Exposed 440V Live Feeder Cable',
        titleHi: '440V नंगी बिजली केबल (CEA Reg 30)',
        category: 'Electrical Safety',
        categoryHi: 'विद्युत सुरक्षा',
        severity: 'High',
        description: 'Live 3-phase cable with frayed insulation lying directly on floor with spark arcing risk.',
        descriptionHi: 'फर्श पर कटी हुई 440V बिजली की केबल पड़ी है जिससे शॉर्ट सर्किट का खतरा है।',
        recommendation: 'Perform Lockout/Tagout (LOTO) per CEA Regulations 2010; route inside heavy-duty grounded conduit.',
        recommendationHi: 'CEA विनियम 30 के अनुसार LOTO आइसोलेशन करें और केबल को सुरक्षित कंड्यूट में डालें।',
        standard: 'CEA Regulations 2010',
        isHazard: true,
        scoreImpact: 10,
        correctAction: 'Apply LOTO & Conduit Enclosure',
        objectId: 'exposed-wire'
      },
      {
        id: 'worker-vest',
        title: 'Missing High-Visibility Vest',
        titleHi: 'बिना रिफ्लेक्टिव जैकेट (IS 15809)',
        category: 'Personal Protective Equipment',
        categoryHi: 'व्यक्तिगत सुरक्षा उपकरण',
        severity: 'Medium',
        description: 'Worker attire lacks fluorescent background and retro-reflective bands required in mining haulage routes.',
        descriptionHi: 'श्रमिक ने रात या कम रोशनी में चमकने वाली रिफ्लेक्टिव जैकेट नहीं पहनी है।',
        recommendation: 'Don IS 15809 Class 2 orange vest with minimum 50mm wide reflective stripes.',
        recommendationHi: 'IS 15809 क्लास 2 फ्लोरोसेंट सुरक्षा जैकेट पहनें।',
        standard: 'IS 15809',
        isHazard: true,
        scoreImpact: 10,
        correctAction: 'Equip IS 15809 Vest',
        objectId: 'worker-vest'
      },
      {
        id: 'unsafe-barrier',
        title: 'Missing Machinery Perimeter Barrier',
        titleHi: 'खुली मशीनरी बैरियर (IS 9474)',
        category: 'Machinery Guarding',
        categoryHi: 'मशीनरी सुरक्षा',
        severity: 'High',
        description: 'Absence of physical perimeter barricade permits inadvertent entry into rotating pinch-point radius.',
        descriptionHi: 'घूमने वाले पुर्जों के चारों ओर सुरक्षा जाली या बैरियर नहीं लगाया गया है।',
        recommendation: 'Install fixed perimeter railing with warning signage at 1.5m clearance per IS 9474.',
        recommendationHi: 'IS 9474 के अनुसार 1.5 मीटर की दूरी पर सुरक्षा बैरियर और चेतावनी बोर्ड लगाएं।',
        standard: 'IS 9474',
        isHazard: true,
        scoreImpact: 10,
        correctAction: 'Erect Safety Barrier',
        objectId: 'unsafe-barrier'
      }
    ],
    recommendedTraining: 'General Workshop Induction & Personal Protective Equipment Compliance (Module IND-101)'
  },

  {
    id: 'scenario-2-fire',
    number: 2,
    name: 'Industrial Fire Safety & Emergency Evacuation',
    nameHi: 'औद्योगिक अग्नि सुरक्षा और आपातकालीन निकासी',
    shortTitle: 'Industrial Fire & Exit',
    shortTitleHi: 'अग्नि सुरक्षा',
    industry: 'Emergency Response',
    industryHi: 'औद्योगिक संयंत्र और आपातकालीन निकासी',
    description: 'Interactive emergency response scenario simulating an early-stage Class B/C oil and electrical blaze in an industrial workshop. Emphasizes R.A.C.E. / P.A.S.S. protocol and emergency egress.',
    descriptionHi: 'कार्यशाला में तेल और विद्युत आग का सिमुलेशन। अलार्म बजाएं, अवरुद्ध निकास द्वार खोलें, P.A.S.S. से अग्निशामक चलाएं और सुरक्षित बाहर निकलें।',
    trainingObjectives: [
      'Locate incipient blaze and sound immediate plant emergency alarm',
      'Identify obstructed emergency exit fire door blocked by pallet crates',
      'Select and operate appropriate Dry Chemical Powder (DCP) extinguisher (IS 15683)',
      'Direct confused worker to designated external assembly zone'
    ],
    defaultDifficulty: 'Medium',
    passingPercentage: 80,
    timeLimitSeconds: { Easy: 140, Medium: 95, Hard: 65 },
    badge: 'IS 15683 / NFPA 10',
    badgeHi: 'IS 15683 / NFPA 10 प्रमाणित',
    colorTheme: 'red',
    status: 'active',
    hazards: [
      {
        id: 'fire-active-blaze',
        title: 'Active Class B/C Machinery Fire',
        titleHi: 'सक्रिय मशीनरी आग और धुआं (Class B/C)',
        category: 'Fire Safety',
        categoryHi: 'अग्नि सुरक्षा',
        severity: 'Critical',
        description: 'Electrical transformer oil ignition producing dense acrid smoke plume and radiant heat.',
        descriptionHi: 'विद्युत मोटर और ट्रांसफार्मर तेल में आग लगने से जहरीला धुआं और लपटें उठ रही हैं।',
        recommendation: 'Sound evacuation alarm immediately; deploy multi-purpose ABC/DCP extinguisher if safe.',
        recommendationHi: 'तुरंत अलार्म बजाएं, बिजली काटें और IS 15683 DCP अग्निशामक से आग बुझाएं।',
        standard: 'IS 15683',
        isHazard: true,
        scoreImpact: 15,
        correctAction: 'Activate Fire Alarm & Pull Extinguisher',
        objectId: 'fire-active-blaze'
      },
      {
        id: 'fire-blocked-exit',
        title: 'Obstructed Emergency Egress Route',
        titleHi: 'अवरुद्ध आपातकालीन निकास द्वार (Sec 38)',
        category: 'Emergency Evacuation',
        categoryHi: 'आपातकालीन निकासी',
        severity: 'High',
        description: 'Wooden pallets and scrap metal crates stacked directly against the illuminated fire exit door.',
        descriptionHi: 'लकड़ी के बक्से और ड्रम आपातकालीन निकास द्वार के ठीक सामने रखे हैं जिससे रास्ता बंद है।',
        recommendation: 'Maintain minimum 2-meter clear passageway to all emergency push-bar exit doors at all times.',
        recommendationHi: 'फैक्ट्रीज एक्ट धारा 38 के अनुसार आपातकालीन द्वार से सभी रुकावटें तुरंत हटाएं।',
        standard: 'Factories Act Sec 38',
        isHazard: true,
        scoreImpact: 10,
        correctAction: 'Clear Fire Exit Obstruction',
        objectId: 'fire-blocked-exit'
      },
      {
        id: 'fire-alarm-pull',
        title: 'Unactivated Manual Call Point (Alarm)',
        titleHi: 'अलार्म न बजाना (Manual Call Point)',
        category: 'Emergency Response',
        categoryHi: 'आपातकालीन प्रतिक्रिया',
        severity: 'High',
        description: 'Alarm break-glass unit has not been triggered to warn adjacent manufacturing plant modules.',
        descriptionHi: 'आग लगने पर भी दीवार पर लगा मैनुअल अलार्म बटन नहीं दबाया गया है।',
        recommendation: 'Strike manual call point immediately before attempting any small-fire suppression.',
        recommendationHi: 'आग बुझाने से पहले तुरंत ब्रेक-ग्लास अलार्म दबाकर पूरे संयंत्र को सतर्क करें।',
        standard: 'IS 2189',
        isHazard: true,
        scoreImpact: 10,
        correctAction: 'Trigger Break-Glass Alarm',
        objectId: 'fire-alarm-pull'
      },
      {
        id: 'fire-worker-evac',
        title: 'Disoriented Worker in Smoke Zone',
        titleHi: 'धुएं में फंसा श्रमिक (Evacuation)',
        category: 'Life Safety',
        categoryHi: 'जीवन रक्षा',
        severity: 'High',
        description: 'Worker coughing near smoke cloud without smoke evacuation mask or clear egress direction.',
        descriptionHi: 'श्रमिक जहरीले धुएं में फंसा हुआ है और बाहर निकलने का रास्ता नहीं ढूंढ पा रहा है।',
        recommendation: 'Direct trainee/worker along illuminated floor egress strip to muster assembly point.',
        recommendationHi: 'श्रमिक को झुककर हरी फ्लोर पट्टी के साथ बाहर सुरक्षित असेंबली पॉइंट पर ले जाएं।',
        standard: 'IS 2190',
        isHazard: true,
        scoreImpact: 10,
        correctAction: 'Evacuate Worker to Safety',
        objectId: 'fire-worker-evac'
      }
    ],
    recommendedTraining: 'DGMS Standard Operating Procedures for Mine Fires & Factory Evacuation Drills (IS 2190)'
  },

  {
    id: 'scenario-3-electrical',
    number: 3,
    name: 'High-Voltage Electrical Substation Safety',
    nameHi: 'हाई-वोल्टेज विद्युत सबस्टेशन सुरक्षा',
    shortTitle: 'Electrical Substation',
    shortTitleHi: 'विद्युत सबस्टेशन',
    industry: 'Electrical Infrastructure',
    industryHi: 'विद्युत सबस्टेशन और 440V स्विचगियर',
    description: 'Simulates a 440V/11kV industrial power distribution station in a Jharkhand coal washery. Trainees identify deadly contact risks and learn authorized isolation procedures without attempting self-repair.',
    descriptionHi: '440V/11kV सबस्टेशन का निरीक्षण करें। LOTO आइसोलेशन लागू करें, पानी पर इंसुलेटिंग रबर मैट बिछाएं, डाइइलेक्ट्रिक दस्ताने पहनें और 440V खतरा बोर्ड साफ करें।',
    trainingObjectives: [
      'Identify uninsulated conductors and damaged cable sheathing near switchgear',
      'Detect conductive liquid puddle pooling in front of high-voltage distribution board',
      'Spot worker lacking Class 0 (1000V) dielectric insulating gloves and boots',
      'Execute authorized emergency power isolation and perimeter barricading'
    ],
    defaultDifficulty: 'Medium',
    passingPercentage: 80,
    timeLimitSeconds: { Easy: 150, Medium: 100, Hard: 70 },
    badge: 'CEA Regs 2010 / IS 4770',
    badgeHi: 'CEA विनियम 2010 / IS 4770',
    colorTheme: 'yellow',
    status: 'active',
    hazards: [
      {
        id: 'elec-exposed-cable',
        title: 'Exposed 440V Main Cable Sheath',
        titleHi: 'कटा हुआ 440V केबल (Exposed Sheath)',
        category: 'Electrical Safety',
        categoryHi: 'विद्युत सुरक्षा',
        severity: 'Critical',
        description: 'High-voltage feed conduit torn open with copper conductors exposed near transformer footings.',
        descriptionHi: 'ट्रांसफार्मर के पास हाई-वोल्टेज केबल की इंसुलेशन फटी हुई है और तांबे के तार बाहर दिख रहे हैं।',
        recommendation: 'Immediate trip of upstream breaker; place LOTO padlock and tagout per CEA Regulation 30.',
        recommendationHi: 'तुरंत मुख्य ब्रेकर बंद करें और CEA विनियम 30 के अनुसार LOTO ताला और टैग लगाएं।',
        standard: 'CEA Reg 30',
        isHazard: true,
        scoreImpact: 15,
        correctAction: 'Isolate Upstream Breaker & Tag',
        objectId: 'elec-exposed-cable'
      },
      {
        id: 'elec-wet-floor',
        title: 'Conductive Water Puddle in Switchgear Bay',
        titleHi: 'स्विचगियर के पास पानी (Conductive Pool)',
        category: 'Workplace Environment',
        categoryHi: 'कार्यस्थल पर्यावरण',
        severity: 'High',
        description: 'Water accumulation across operator standing zone creates severe electrocution hazard if flashover occurs.',
        descriptionHi: 'हाई-वोल्टेज पैनल के सामने पानी भरा हुआ है जिससे ऑपरेटर को करंट लगने का जानलेवा खतरा है।',
        recommendation: 'De-energize board, place insulating rubber matting (IS 15652 Class B), and remediate drainage.',
        recommendationHi: 'IS 15652 क्लास B प्रमाणित इंसुलेटिंग रबर मैट बिछाएं और पानी की निकासी ठीक करें।',
        standard: 'IS 15652',
        isHazard: true,
        scoreImpact: 10,
        correctAction: 'Deploy Insulating Rubber Mat',
        objectId: 'elec-wet-floor'
      },
      {
        id: 'elec-missing-gloves',
        title: 'Worker Lacks Dielectric Insulating Gloves',
        titleHi: 'इंसुलेटिंग दस्ताने न होना (IS 4770)',
        category: 'Personal Protective Equipment',
        categoryHi: 'व्यक्तिगत सुरक्षा उपकरण',
        severity: 'High',
        description: 'Operator reaching towards panel door barehanded without 1000V rated rubber insulating gloves.',
        descriptionHi: 'ऑपरेटर बिना 1000V रेटेड रबर इंसुलेटिंग दस्तानों के नंगे हाथों से पैनल छू रहा है।',
        recommendation: 'Don IS 4770 certified composite insulating gloves and arc-flash face shield (NFPA 70E Cat 2).',
        recommendationHi: 'IS 4770 प्रमाणित डाइइलेक्ट्रिक दस्ताने और आर्क-फ्लैश शील्ड पहनें।',
        standard: 'IS 4770',
        isHazard: true,
        scoreImpact: 10,
        correctAction: 'Don IS 4770 Insulating Gloves',
        objectId: 'elec-missing-gloves'
      },
      {
        id: 'elec-blocked-sign',
        title: 'Obstructed High-Voltage Warning Placard',
        titleHi: 'खतरे का बोर्ड छिपा होना (IS 2551)',
        category: 'Signage & Demarcation',
        categoryHi: 'संकेतक और चेतावनी',
        severity: 'Medium',
        description: 'Statutory 440V Danger signboard is obscured by leaning toolboxes and debris.',
        descriptionHi: 'वैधानिक 440V खतरा बोर्ड टूलबॉक्स और मलबे के पीछे छिपा हुआ है।',
        recommendation: 'Clear statutory signage path; maintain unimpeded line of sight to IS 2551 danger placards.',
        recommendationHi: 'IS 2551 खतरा साइनबोर्ड के सामने से सभी बक्से हटाकर स्पष्ट दृश्यता सुनिश्चित करें।',
        standard: 'IS 2551',
        isHazard: true,
        scoreImpact: 10,
        correctAction: 'Clear Warning Signboard',
        objectId: 'elec-blocked-sign'
      }
    ],
    recommendedTraining: 'Central Electricity Authority (Measures Relating to Safety and Electric Supply) Regulations 2010 Certification'
  },

  {
    id: 'scenario-4-mining',
    number: 4,
    name: 'Underground Coal Mining & Haulage Safety',
    nameHi: 'भूमिगत कोयला खदान और हॉलेज सुरक्षा',
    shortTitle: 'Coal Mining & Haulage',
    shortTitleHi: 'कोयला खदान सुरक्षा',
    industry: 'Mining & Extraction',
    industryHi: 'भूमिगत कोयला खदान एवं हॉलेज सड़क',
    description: 'Tailored for Jharkhand coal and iron ore deposits (Dhanbad, Bokaro, Chaibasa). Features underground drift roadway, heavy 35-tonne dump truck blind zones, unsupported roof strata, and DGMS signage.',
    descriptionHi: 'भूमिगत कोयला खदान गैलरी। 35 टन डंपर के ब्लाइंड स्पॉट से बचें, कमजोर छत (अनसपोर्टेड रूफ) को प्रॉप करें, DGMS स्वीकृत कैप लैंप पहनें और खतरा बैरिकेड लगाएं।',
    trainingObjectives: [
      'Detect worker entering 35T dump truck driver blind spot without high-intensity LED cap lamp',
      'Identify fractured roof strata (unsupported geological hanging wall without rock bolts)',
      'Spot personnel walking inside demarcated heavy vehicular haulage fairway',
      'Verify statutory DGMS unsupported roof warning board and clear retreat airway'
    ],
    defaultDifficulty: 'Hard',
    passingPercentage: 85,
    timeLimitSeconds: { Easy: 160, Medium: 110, Hard: 75 },
    badge: 'DGMS Coal Mines Regs 2017',
    badgeHi: 'DGMS कोयला खान विनियम 2017',
    colorTheme: 'cyan',
    status: 'active',
    hazards: [
      {
        id: 'mine-haulage-blindspot',
        title: 'Pedestrian in 35T Haulage Dumper Blind Zone',
        titleHi: 'डंपर के पीछे श्रमिक (CMR Reg 87)',
        category: 'Vehicle & Traffic Safety',
        categoryHi: 'वाहन एवं यातायात सुरक्षा',
        severity: 'Critical',
        description: 'Worker standing within rear 6-meter turning radius of active diesel mining vehicle.',
        descriptionHi: 'श्रमिक 35 टन डंपर के टर्निंग रेडियस और ब्लाइंड स्पॉट में खड़ा है जहां चालक उसे नहीं देख सकता।',
        recommendation: 'Maintain minimum 15m clearance from mobile haulage machinery; cross only at designated overhead/refuge points.',
        recommendationHi: 'भारी वाहनों से कम से कम 15 मीटर दूर रहें और केवल निर्धारित शेल्टर बे का उपयोग करें।',
        standard: 'CMR Reg 87',
        isHazard: true,
        scoreImpact: 15,
        correctAction: 'Move to Designated Refuge Bay',
        objectId: 'mine-haulage-blindspot'
      },
      {
        id: 'mine-unstable-roof',
        title: 'Unsupported Strata / Loose Hanging Wall',
        titleHi: 'कमजोर एवं दरारयुक्त छत (DGMS Reg 123)',
        category: 'Mining Geotechnical Safety',
        categoryHi: 'भू-तकनीकी सुरक्षा',
        severity: 'Critical',
        description: 'Visible fracture plane in coal ceiling with absent resin rock bolts and tell-tale convergence indicator.',
        descriptionHi: 'कोयले की छत में दरारें हैं और कोई रॉक बोल्ट या सपोर्ट नहीं लगा है। कभी भी छत गिर सकती है।',
        recommendation: 'Immediately tag zone as "UNSAFE ROOF - NO ENTRY" per DGMS Reg 123; retreat to supported timber/steel arch section.',
        recommendationHi: 'DGMS नियम 123 के अनुसार तुरंत सपोर्ट प्रॉप लगाएं और क्षेत्र को "खतरनाक छत" टैग करें।',
        standard: 'DGMS Reg 123',
        isHazard: true,
        scoreImpact: 15,
        correctAction: 'Install Temporary Roof Prop & Tag',
        objectId: 'mine-unstable-roof'
      },
      {
        id: 'mine-no-caplamp',
        title: 'Worker Without DGMS Approved Cap Lamp & Helmet',
        titleHi: 'बिना DGMS कैप लैंप (Cap Lamp Absent)',
        category: 'Personal Protective Equipment',
        categoryHi: 'व्यक्तिगत सुरक्षा उपकरण',
        severity: 'High',
        description: 'Worker entering dark gallery lacking intrinsically safe LED cap lamp (DGMS approved) and chin-strap helmet.',
        descriptionHi: 'श्रमिक अंधेरी खदान गैलरी में बिना DGMS स्वीकृत कैप लैंप और बिना माइनिंग हेलमेट के प्रवेश कर रहा है।',
        recommendation: 'Require DGMS tested flameproof cap lamp and IS 2925 Type II mining safety helmet.',
        recommendationHi: 'DGMS प्रमाणित फ्लेमप्रूफ एलईडी कैप लैंप और IS 2925 माइनिंग हेलमेट पहनना अनिवार्य करें।',
        standard: 'DGMS Approved',
        isHazard: true,
        scoreImpact: 10,
        correctAction: 'Equip Cap Lamp & Mine Helmet',
        objectId: 'mine-no-caplamp'
      },
      {
        id: 'mine-missing-sign',
        title: 'Missing DGMS Statutory Danger Board',
        titleHi: 'खतरे का बैरिकेड न होना (CMR Danger Board)',
        category: 'Signage & Demarcation',
        categoryHi: 'संकेतक और चेतावनी',
        severity: 'Medium',
        description: 'Abandoned goaf or unventilated blind roadway lacks red reflective "KHATRA / DANGER" barrier.',
        descriptionHi: 'बंद या बिना हवा वाली गैलरी के सामने कोई लाल रिफ्लेक्टिव खतरा बैरिकेड नहीं है।',
        recommendation: 'Erect chain link barricade with bilingual (Hindi/English) DGMS warning signboard.',
        recommendationHi: 'द्विभाषी (हिंदी/अंग्रेजी) DGMS चेतावनी साइनबोर्ड के साथ चेन-लिंक बैरिकेड लगाएं।',
        standard: 'DGMS CMR 2017',
        isHazard: true,
        scoreImpact: 10,
        correctAction: 'Place DGMS Danger Barricade',
        objectId: 'mine-missing-sign'
      }
    ],
    recommendedTraining: 'Coal Mines Regulations 2017 (CMR 2017) & Strata Control Management Plan (SCMP)'
  },

  {
    id: 'scenario-5-machinery',
    number: 5,
    name: 'Heavy Industrial Machinery & Nip-Point Guarding',
    nameHi: 'भारी औद्योगिक मशीनरी और निप-पॉइंट सुरक्षा',
    shortTitle: 'Machinery & E-Stop',
    shortTitleHi: 'मशीनरी सुरक्षा',
    industry: 'Heavy Engineering',
    industryHi: 'स्टील रोलिंग मिल एवं कन्वेयर लाइन',
    description: 'Simulates steel rolling mill and conveyor transmission lines found in Jamshedpur industrial belts. Trainees identify unguarded rotating rollers, bypass switches, and practice simulated Emergency Stop actuation.',
    descriptionHi: 'रोलिंग मिल और कन्वेयर लाइन। खुले घूमने वाले रोलर्स पर सुरक्षा जाली लगाएं, लाल इमरजेंसी स्टॉप (E-Stop) दबाएं, ढीले कपड़ों को ठीक करें और पीली सीमा रेखा के पीछे रहें।',
    trainingObjectives: [
      'Identify exposed in-running nip point on rotating cylinder without interlocked mesh guard',
      'Detect operator leaning over rotating spindle with loose sleeve attire',
      'Simulate immediate activation of red mushroom Emergency Stop (E-Stop) pushbutton',
      'Verify yellow safety perimeter floor demarcation line compliance'
    ],
    defaultDifficulty: 'Medium',
    passingPercentage: 80,
    timeLimitSeconds: { Easy: 130, Medium: 90, Hard: 60 },
    badge: 'IS 9474 / ISO 13850',
    badgeHi: 'IS 9474 / ISO 13850 प्रमाणित',
    colorTheme: 'purple',
    status: 'active',
    hazards: [
      {
        id: 'mach-missing-guard',
        title: 'Unguarded In-Running Rotating Roller Nip',
        titleHi: 'रोलर पर सुरक्षा जाली का अभाव (IS 9474)',
        category: 'Machinery Guarding',
        categoryHi: 'मशीनरी सुरक्षा',
        severity: 'Critical',
        description: 'Exposed cylinder rollers rotating at high speed without interlocked physical barrier or trip wire.',
        descriptionHi: 'मशीन के रोलर तेज गति से घूम रहे हैं लेकिन उनके ऊपर कोई इंटरलॉक्ड सुरक्षा गार्ड या जाली नहीं है।',
        recommendation: 'Interlock fixed wire mesh guard (IS 9474); ensure machine cuts power if guard is unlatched.',
        recommendationHi: 'IS 9474 के अनुसार इंटरलॉक्ड वायर मेश गार्ड लगाएं जो गार्ड खुलने पर मशीन बंद कर दे।',
        standard: 'IS 9474',
        isHazard: true,
        scoreImpact: 15,
        correctAction: 'Install Interlocked Wire Guard',
        objectId: 'mach-missing-guard'
      },
      {
        id: 'mach-estop-unhit',
        title: 'Rotating Roller Requires Emergency Stop',
        titleHi: 'इमरजेंसी स्टॉप न दबाना (E-Stop)',
        category: 'Emergency Controls',
        categoryHi: 'आपातकालीन नियंत्रण',
        severity: 'High',
        description: 'Machine is running with abnormal vibration; emergency trip actuator has not been engaged.',
        descriptionHi: 'मशीन असामान्य कंपन के साथ चल रही है लेकिन लाल मशरूम आपातकालीन स्टॉप बटन नहीं दबाया गया है।',
        recommendation: 'Firmly strike prominent red mushroom Emergency Stop pushbutton (ISO 13850) to trip main drive.',
        recommendationHi: 'ISO 13850 प्रमाणित लाल इमरजेंसी स्टॉप बटन को तुरंत दबाकर मोटर पावर ट्रिप करें।',
        standard: 'ISO 13850',
        isHazard: true,
        scoreImpact: 15,
        correctAction: 'Strike Emergency Stop (E-Stop)',
        objectId: 'mach-estop-unhit'
      },
      {
        id: 'mach-loose-attire',
        title: 'Worker Wearing Loose Attire Near Spindle',
        titleHi: 'मशीन के पास ढीले कपड़े (Loose Attire)',
        category: 'Safe Worker Behavior',
        categoryHi: 'सुरक्षित व्यवहार',
        severity: 'High',
        description: 'Operator has unbuttoned loose sleeves and hanging lanyard within 300mm of rotating conveyor belt.',
        descriptionHi: 'ऑपरेटर ने ढीली आस्तीन और गले में लटकता पहचान पत्र पहन रखा है जो घूमते शाफ्ट में उलझ सकता है।',
        recommendation: 'Enforce tight-fitting flame-retardant boiler suit with rolled cuffs; ban ties/lanyards near drives.',
        recommendationHi: 'कलाई पर बंद होने वाले चुस्त कपड़े पहनें और घूमने वाले पुर्जों के पास कोई डोरी या टाई न रखें।',
        standard: 'Factories Act Sec 22',
        isHazard: true,
        scoreImpact: 10,
        correctAction: 'Correct Attire & Button Sleeves',
        objectId: 'mach-loose-attire'
      },
      {
        id: 'mach-yellow-line',
        title: 'Worker Breaching Yellow Demarcation Zone',
        titleHi: 'पीली सीमा रेखा का उल्लंघन (Hazard Line)',
        category: 'Workplace Demarcation',
        categoryHi: 'सीमांकन सुरक्षा',
        severity: 'Medium',
        description: 'Operator standing inside high-vibration hazard zone without hearing protection and authorization.',
        descriptionHi: 'श्रमिक पीली और काली पट्टी वाली खतरे की सीमा रेखा के अंदर खड़ा है जहां भारी कंपन और शोर है।',
        recommendation: 'Step back beyond high-contrast yellow/black diagonal floor stripes (IS 9474 boundary).',
        recommendationHi: 'IS 9474 सुरक्षा सीमा के अनुसार पीली रेखा के पीछे हटें और सुरक्षित दूरी बनाए रखें।',
        standard: 'IS 9474',
        isHazard: true,
        scoreImpact: 10,
        correctAction: 'Retreat Behind Yellow Boundary',
        objectId: 'mach-yellow-line'
      }
    ],
    recommendedTraining: 'Factories Act 1948 Section 21 (Fencing of Machinery) & Mechanical Lockout Protocols'
  }
];

export function getScenarioDefinition(id: string): ScenarioDefinition {
  const normId =
    id === 'scenario-3-fire'
      ? 'scenario-2-fire'
      : id === 'scenario-2-electrical'
      ? 'scenario-3-electrical'
      : id;
  const found = SCENARIO_DEFINITIONS.find((s) => s.id === normId || s.id === id);
  return found || SCENARIO_DEFINITIONS[1] || SCENARIO_DEFINITIONS[0];
}

export const MOCK_TRAINEE_SESSIONS: TraineeSessionRecord[] = [
  {
    id: 'sess-001',
    traineeId: 'TR-JH-402',
    traineeName: 'Amit Kumar Murmu',
    scenarioId: 'scenario-1-ppe',
    scenarioName: 'PPE & Industrial Hazard Baseline',
    industry: 'General Manufacturing',
    score: 40,
    maxScore: 40,
    percentage: 100,
    status: 'Passed',
    weakestCategory: 'None',
    hazardsIdentified: ['worker-helmet', 'exposed-wire', 'worker-vest', 'unsafe-barrier'],
    totalHazards: 4,
    incorrectActions: 0,
    timeSpentSeconds: 48,
    difficulty: 'Easy',
    timestamp: '2026-09-06T08:15:00Z'
  },
  {
    id: 'sess-002',
    traineeId: 'TR-JH-402',
    traineeName: 'Amit Kumar Murmu',
    scenarioId: 'scenario-2-electrical',
    scenarioName: 'High-Voltage Electrical Substation Safety',
    industry: 'Electrical Infrastructure',
    score: 35,
    maxScore: 45,
    percentage: 78,
    status: 'Failed',
    weakestCategory: 'Electrical Safety',
    hazardsIdentified: ['elec-wet-floor', 'elec-missing-gloves', 'elec-blocked-sign'],
    totalHazards: 4,
    incorrectActions: 1,
    timeSpentSeconds: 84,
    difficulty: 'Medium',
    timestamp: '2026-09-06T08:35:00Z'
  },
  {
    id: 'sess-003',
    traineeId: 'TR-JH-519',
    traineeName: 'Sunita Soren',
    scenarioId: 'scenario-4-mining',
    scenarioName: 'Mining Underground & Haulage Road Safety',
    industry: 'Mining & Extraction',
    score: 50,
    maxScore: 50,
    percentage: 100,
    status: 'Passed',
    weakestCategory: 'None',
    hazardsIdentified: ['mine-haulage-blindspot', 'mine-unstable-roof', 'mine-no-caplamp', 'mine-missing-sign'],
    totalHazards: 4,
    incorrectActions: 0,
    timeSpentSeconds: 62,
    difficulty: 'Medium',
    timestamp: '2026-09-06T09:10:00Z'
  },
  {
    id: 'sess-004',
    traineeId: 'TR-JH-388',
    traineeName: 'Rajesh Oraon',
    scenarioId: 'scenario-3-fire',
    scenarioName: 'Industrial Fire Emergency & Evacuation',
    industry: 'Emergency Response',
    score: 45,
    maxScore: 45,
    percentage: 100,
    status: 'Passed',
    weakestCategory: 'None',
    hazardsIdentified: ['fire-active-blaze', 'fire-blocked-exit', 'fire-alarm-pull', 'fire-worker-evac'],
    totalHazards: 4,
    incorrectActions: 0,
    timeSpentSeconds: 52,
    difficulty: 'Medium',
    timestamp: '2026-09-06T09:30:00Z'
  },
  {
    id: 'sess-005',
    traineeId: 'TR-JH-214',
    traineeName: 'Deepak Baski',
    scenarioId: 'scenario-5-machinery',
    scenarioName: 'Heavy Industrial Machinery & Nip-Point Guarding',
    industry: 'Heavy Engineering',
    score: 25,
    maxScore: 50,
    percentage: 50,
    status: 'Failed',
    weakestCategory: 'Machinery Guarding',
    hazardsIdentified: ['mach-estop-unhit', 'mach-loose-attire'],
    totalHazards: 4,
    incorrectActions: 2,
    timeSpentSeconds: 95,
    difficulty: 'Hard',
    timestamp: '2026-09-06T09:48:00Z'
  },
  {
    id: 'sess-006',
    traineeId: 'TR-JH-701',
    traineeName: 'Pooja Hansda',
    scenarioId: 'scenario-2-electrical',
    scenarioName: 'High-Voltage Electrical Substation Safety',
    industry: 'Electrical Infrastructure',
    score: 45,
    maxScore: 45,
    percentage: 100,
    status: 'Passed',
    weakestCategory: 'None',
    hazardsIdentified: ['elec-exposed-cable', 'elec-wet-floor', 'elec-missing-gloves', 'elec-blocked-sign'],
    totalHazards: 4,
    incorrectActions: 0,
    timeSpentSeconds: 71,
    difficulty: 'Medium',
    timestamp: '2026-09-06T10:02:00Z'
  }
];

export const STEP_5_SCRIPTS: CSharpScript[] = [
  {
    id: 'scenario-definition-so',
    step: 5,
    filename: 'ScenarioDefinition.cs',
    className: 'ScenarioDefinition',
    namespace: 'SIH26041.AR.Scenarios',
    summary: 'Reusable ScriptableObject defining vocational scenarios for Jharkhand mining & heavy manufacturing. Encapsulates scenario ID, title, industry category, difficulty scaling, time limits, hazard catalogs, and passing percentage.',
    targetGameObject: 'Assets/ScriptableObjects/Scenarios/*.asset',
    requiredComponents: [],
    inspectorFields: [
      { name: 'scenarioId', type: 'string', description: 'Unique slug e.g. scenario-2-electrical', required: true },
      { name: 'scenarioName', type: 'string', description: 'Human readable full title.', required: true },
      { name: 'industry', type: 'ScenarioIndustry', description: 'Mining, Electrical, Manufacturing, or Emergency.', required: true },
      { name: 'passingPercentage', type: 'int', description: 'Passing threshold (typically 75% to 85%).', required: true },
      { name: 'easyTimeLimit', type: 'float', description: 'Seconds allotted for Easy mode.', required: true },
      { name: 'mediumTimeLimit', type: 'float', description: 'Seconds allotted for Medium mode.', required: true },
      { name: 'hardTimeLimit', type: 'float', description: 'Seconds allotted for Hard mode.', required: true },
      { name: 'hazards', type: 'List<ScenarioHazardEntry>', description: 'List of hazard definitions to spawn and evaluate.', required: true }
    ],
    code: `using System;
using System.Collections.Generic;
using UnityEngine;

namespace SIH26041.AR.Scenarios
{
    public enum ScenarioIndustry
    {
        GeneralManufacturing,
        ElectricalInfrastructure,
        EmergencyResponse,
        MiningAndExtraction,
        HeavyEngineering
    }

    public enum ScenarioDifficulty
    {
        Easy,
        Medium,
        Hard
    }

    [Serializable]
    public class ScenarioHazardEntry
    {
        public string hazardId;
        public string title;
        public string category;
        public string severity; // "Low", "Medium", "High", "Critical"
        [TextArea(2, 4)] public string description;
        [TextArea(2, 4)] public string recommendation;
        public int scoreImpact = 10;
        public string correctAction;
        public string targetObjectName;
    }

    [CreateAssetMenu(fileName = "ScenarioDef_", menuName = "SIH26041/Scenario Definition", order = 3)]
    public class ScenarioDefinition : ScriptableObject
    {
        [Header("Identity & Industry")]
        [SerializeField] private string scenarioId = "scenario-1-ppe";
        [SerializeField] private string scenarioName = "PPE & Industrial Hazard Baseline";
        [SerializeField] private ScenarioIndustry industry = ScenarioIndustry.GeneralManufacturing;
        [TextArea(2, 4)]
        [SerializeField] private string description;

        [Header("Pedagogical Goals")]
        [SerializeField] private List<string> trainingObjectives = new List<string>();
        [SerializeField] private string recommendedTraining;

        [Header("Difficulty & Time Bounds")]
        [Range(50, 100)]
        [SerializeField] private int passingPercentage = 80;
        [SerializeField] private float easyTimeLimit = 120f;
        [SerializeField] private float mediumTimeLimit = 90f;
        [SerializeField] private float hardTimeLimit = 60f;

        [Header("Environment & Prefabs")]
        [Tooltip("Root prefab containing 3D environment for this vocational setting.")]
        [SerializeField] private GameObject scenarioEnvironmentPrefab;

        [Header("Hazard Catalog")]
        [SerializeField] private List<ScenarioHazardEntry> hazards = new List<ScenarioHazardEntry>();

        public string ScenarioId => scenarioId;
        public string ScenarioName => scenarioName;
        public ScenarioIndustry Industry => industry;
        public string Description => description;
        public List<string> TrainingObjectives => trainingObjectives;
        public string RecommendedTraining => recommendedTraining;
        public int PassingPercentage => passingPercentage;
        public GameObject ScenarioEnvironmentPrefab => scenarioEnvironmentPrefab;
        public List<ScenarioHazardEntry> Hazards => hazards;

        public float GetTimeLimit(ScenarioDifficulty diff)
        {
            switch (diff)
            {
                case ScenarioDifficulty.Easy: return easyTimeLimit;
                case ScenarioDifficulty.Medium: return mediumTimeLimit;
                case ScenarioDifficulty.Hard: return hardTimeLimit;
                default: return mediumTimeLimit;
            }
        }
    }
}`
  },

  {
    id: 'scenario-manager-so',
    step: 5,
    filename: 'ScenarioManager.cs',
    className: 'ScenarioManager',
    namespace: 'SIH26041.AR.Scenarios',
    summary: 'Central runtime orchestrator that loads the selected ScenarioDefinition, tracks score and active countdown timer, validates hazard taps and emergency decisions (E-Stop, LOTO, fire alarm), and transmits session records to Firebase.',
    targetGameObject: 'ScenarioManager (Child of XR Origin or dedicated GameController)',
    requiredComponents: [],
    inspectorFields: [
      { name: 'availableScenarios', type: 'List<ScenarioDefinition>', description: 'List of all 5 configured ScriptableObject scenarios.', required: true },
      { name: 'currentScenario', type: 'ScenarioDefinition', description: 'Currently active loaded scenario.', required: false },
      { name: 'currentDifficulty', type: 'ScenarioDifficulty', description: 'Active difficulty scale.', required: false },
      { name: 'environmentAnchor', type: 'Transform', description: 'Transform parent where AR scenario objects spawn.', required: true }
    ],
    code: `using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using SIH26041.AR.Firebase;

namespace SIH26041.AR.Scenarios
{
    public class ScenarioManager : MonoBehaviour
    {
        public static ScenarioManager Instance { get; private set; }

        [Header("Scenario Registry")]
        [SerializeField] private List<ScenarioDefinition> availableScenarios = new List<ScenarioDefinition>();
        [SerializeField] private Transform environmentAnchor;

        [Header("Runtime State")]
        [SerializeField] private ScenarioDefinition activeScenario;
        [SerializeField] private ScenarioDifficulty activeDifficulty = ScenarioDifficulty.Medium;

        private GameObject _spawnedEnvironment;
        private int _currentScore = 0;
        private int _maxScore = 0;
        private int _incorrectCount = 0;
        private float _timeRemaining = 90f;
        private bool _isTimerRunning = false;
        private readonly HashSet<string> _resolvedHazardIds = new HashSet<string>();

        // Events for UI updating
        public event Action<int, int> OnScoreChanged; // current, max
        public event Action<float> OnTimerTick; // seconds remaining
        public event Action<ScenarioHazardEntry, bool> OnHazardResolved; // hazard, isCorrect
        public event Action<bool, int, int, string> OnScenarioEnded; // isPassed, score, maxScore, weakestCategory

        private void Awake()
        {
            if (Instance == null) Instance = this;
            else Destroy(gameObject);
        }

        private void Update()
        {
            if (_isTimerRunning)
            {
                _timeRemaining -= Time.deltaTime;
                OnTimerTick?.Invoke(Mathf.Max(0f, _timeRemaining));

                if (_timeRemaining <= 0f)
                {
                    _timeRemaining = 0f;
                    _isTimerRunning = false;
                    ConcludeScenario(isTimeOut: true);
                }
            }
        }

        public void LoadScenario(string scenarioId, ScenarioDifficulty difficulty)
        {
            if (availableScenarios == null || availableScenarios.Count == 0)
            {
                Debug.LogError("[ScenarioManager] availableScenarios list is null or empty. Ensure ScenarioDefinitions are assigned in Inspector.");
                return;
            }

            ScenarioDefinition target = availableScenarios.Find(s => s != null && s.ScenarioId == scenarioId);
            if (target == null)
            {
                Debug.LogWarning($"[ScenarioManager] Scenario '{scenarioId}' not found in registry. Defaulting safely to index 0.");
                target = availableScenarios[0];
                if (target == null)
                {
                    Debug.LogError("[ScenarioManager] Default scenario index 0 is null.");
                    return;
                }
            }

            activeScenario = target;
            activeDifficulty = difficulty;

            // Reset scores and state
            _currentScore = 0;
            _maxScore = 0;
            _incorrectCount = 0;
            _resolvedHazardIds.Clear();

            foreach (var h in activeScenario.Hazards)
            {
                _maxScore += h.scoreImpact;
            }

            _timeRemaining = activeScenario.GetTimeLimit(activeDifficulty);
            _isTimerRunning = true;

            // Spawn 3D Environment
            if (_spawnedEnvironment != null) Destroy(_spawnedEnvironment);
            if (activeScenario.ScenarioEnvironmentPrefab != null && environmentAnchor != null)
            {
                _spawnedEnvironment = Instantiate(activeScenario.ScenarioEnvironmentPrefab, environmentAnchor.position, environmentAnchor.rotation, environmentAnchor);
            }

            OnScoreChanged?.Invoke(_currentScore, _maxScore);
            Debug.Log($"[ScenarioManager] Loaded {activeScenario.ScenarioName} ({activeDifficulty}). Max Score: {_maxScore}");
        }

        public void RegisterHazardAction(string objectName)
        {
            if (activeScenario == null || !_isTimerRunning) return;

            ScenarioHazardEntry match = activeScenario.Hazards.Find(h =>
                h.targetObjectName.Equals(objectName, StringComparison.OrdinalIgnoreCase) ||
                h.hazardId.Equals(objectName, StringComparison.OrdinalIgnoreCase));

            if (match != null)
            {
                if (_resolvedHazardIds.Contains(match.hazardId))
                {
                    Debug.Log($"[ScenarioManager] Hazard {match.title} already resolved.");
                    return;
                }

                _resolvedHazardIds.Add(match.hazardId);
                _currentScore += match.scoreImpact;
                OnScoreChanged?.Invoke(_currentScore, _maxScore);
                OnHazardResolved?.Invoke(match, true);

                // Check if all hazards resolved
                if (_resolvedHazardIds.Count >= activeScenario.Hazards.Count)
                {
                    ConcludeScenario(isTimeOut: false);
                }
            }
            else
            {
                // Tapped non-hazardous or safe object: deduct small penalty
                _incorrectCount++;
                _currentScore = Mathf.Max(0, _currentScore - 5);
                OnScoreChanged?.Invoke(_currentScore, _maxScore);
                OnHazardResolved?.Invoke(null, false);
            }
        }

        private void ConcludeScenario(bool isTimeOut)
        {
            _isTimerRunning = false;
            float percentage = _maxScore > 0 ? ((float)_currentScore / _maxScore) * 100f : 0f;
            bool passed = !isTimeOut && percentage >= activeScenario.PassingPercentage;

            string weakestCategory = DetermineWeakestCategory();

            OnScenarioEnded?.Invoke(passed, _currentScore, _maxScore, weakestCategory);

            // Record to Firebase
            if (FirebaseTrainingRecordService.Instance != null)
            {
                FirebaseTrainingRecordService.Instance.SaveTrainingSession(
                    activeScenario.ScenarioId,
                    activeScenario.ScenarioName,
                    activeScenario.Industry.ToString(),
                    _currentScore,
                    _maxScore,
                    passed ? "Passed" : "Failed",
                    weakestCategory,
                    new List<string>(_resolvedHazardIds),
                    _incorrectCount
                );
            }
        }

        private string DetermineWeakestCategory()
        {
            Dictionary<string, int> missedByCategory = new Dictionary<string, int>();
            foreach (var h in activeScenario.Hazards)
            {
                if (!_resolvedHazardIds.Contains(h.hazardId))
                {
                    missedByCategory[h.category] = missedByCategory.ContainsKey(h.category) ? missedByCategory[h.category] + 1 : 1;
                }
            }

            string worst = "None";
            int maxMissed = 0;
            foreach (var kvp in missedByCategory)
            {
                if (kvp.Value > maxMissed)
                {
                    maxMissed = kvp.Value;
                    worst = kvp.Key;
                }
            }
            return worst;
        }

        public ScenarioDefinition ActiveScenario => activeScenario;
        public ScenarioDifficulty ActiveDifficulty => activeDifficulty;
        public List<ScenarioDefinition> AvailableScenarios => availableScenarios;
    }
}`
  },

  {
    id: 'scenario-interaction-controller',
    step: 5,
    filename: 'ScenarioInteractionController.cs',
    className: 'ScenarioInteractionController',
    namespace: 'SIH26041.AR.Scenarios',
    summary: 'Handles user touch raycasts against 3D AR colliders across all 5 scenarios. Validates specialized vocational interactions such as LOTO padlocks, fire alarms, E-Stop pushbuttons, and PPE equipping.',
    targetGameObject: 'ScenarioInteractionController (Child of XR Origin)',
    requiredComponents: [],
    inspectorFields: [
      { name: 'arCamera', type: 'Camera', description: 'AR main camera for screen-to-world raycasting.', required: true },
      { name: 'interactionLayerMask', type: 'LayerMask', description: 'Layer mask for interactive AR hazard colliders.', required: true }
    ],
    code: `using UnityEngine;
using UnityEngine.EventSystems;

namespace SIH26041.AR.Scenarios
{
    public class ScenarioInteractionController : MonoBehaviour
    {
        [Header("Camera & Raycasting")]
        [SerializeField] private Camera arCamera;
        [SerializeField] private LayerMask interactionLayerMask;

        private void Awake()
        {
            if (arCamera == null) arCamera = Camera.main;
        }

        private void Update()
        {
            // Handle mobile single touch
            if (Input.touchCount > 0)
            {
                Touch touch = Input.GetTouch(0);
                if (touch.phase == TouchPhase.Began)
                {
                    // Ignore clicks over UI
                    if (EventSystem.current != null && EventSystem.current.IsPointerOverGameObject(touch.fingerId))
                        return;

                    ProcessTap(touch.position);
                }
            }

            // Handle desktop/editor mouse click
            if (Input.GetMouseButtonDown(0))
            {
                if (EventSystem.current != null && EventSystem.current.IsPointerOverGameObject())
                    return;

                ProcessTap(Input.mousePosition);
            }
        }

        private void ProcessTap(Vector2 screenPos)
        {
            Ray ray = arCamera.ScreenPointToRay(screenPos);
            if (Physics.Raycast(ray, out RaycastHit hit, 20f, interactionLayerMask))
            {
                string targetName = hit.collider.gameObject.name;
                Debug.Log($"[ScenarioInteractionController] Trainee tapped: {targetName}");

                if (ScenarioManager.Instance != null)
                {
                    ScenarioManager.Instance.RegisterHazardAction(targetName);
                }
            }
        }
    }
}`
  },

  {
    id: 'firebase-training-record-service',
    step: 5,
    filename: 'FirebaseTrainingRecordService.cs',
    className: 'FirebaseTrainingRecordService',
    namespace: 'SIH26041.AR.Firebase',
    summary: 'Production Cloud Persistence Service. Manages real Firebase Authentication and Firestore writes to /trainees/{traineeId}/sessions/{sessionId} with offline sync fallback.',
    targetGameObject: 'FirebaseManager',
    requiredComponents: [],
    inspectorFields: [
      { name: 'currentTraineeId', type: 'string', description: 'UID of currently authenticated trainee.', required: true },
      { name: 'currentTraineeName', type: 'string', description: 'Full name of the trainee.', required: true }
    ],
    code: `using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using UnityEngine;
#if FIREBASE_ENABLED
using Firebase;
using Firebase.Auth;
using Firebase.Firestore;
using Firebase.Extensions;
#endif

namespace SIH26041.AR.Firebase
{
    [Serializable]
    public class CanonicalTrainingSession
    {
        public string sessionId;
        public string traineeId;
        public string traineeName;
        public string scenarioId;
        public string scenarioName;
        public string industry;
        public int score;
        public int maxScore;
        public float percentage;
        public string status; // "Passed" or "Failed"
        public string weakestCategory;
        public List<string> identifiedHazards = new List<string>();
        public int incorrectActions;
        public string timestampIso;
        public long timestampEpoch;
        public bool isSynced;
    }

    public class FirebaseTrainingRecordService : MonoBehaviour
    {
        public static FirebaseTrainingRecordService Instance { get; private set; }

        [Header("Student Profile")]
        [SerializeField] private string currentTraineeId = "TR-JH-402";
        [SerializeField] private string currentTraineeName = "Amit Kumar Murmu";

        private bool _isFirebaseInitialized = false;

#if FIREBASE_ENABLED
        private FirebaseAuth _auth;
        private FirebaseFirestore _firestore;
#endif

        private void Awake()
        {
            if (Instance == null)
            {
                Instance = this;
                DontDestroyOnLoad(gameObject);
                InitializeFirebaseSDK();
            }
            else
            {
                Destroy(gameObject);
            }
        }

        private void InitializeFirebaseSDK()
        {
#if FIREBASE_ENABLED
            FirebaseApp.CheckAndFixDependenciesAsync().ContinueWithOnMainThread(task =>
            {
                var dependencyStatus = task.Result;
                if (dependencyStatus == DependencyStatus.Available)
                {
                    _auth = FirebaseAuth.DefaultInstance;
                    _firestore = FirebaseFirestore.DefaultInstance;
                    _isFirebaseInitialized = true;
                    Debug.Log("[FirebaseTrainingRecordService] Firebase SDK initialized successfully.");
                }
                else
                {
                    Debug.LogError($"[FirebaseTrainingRecordService] Could not resolve Firebase dependencies: {dependencyStatus}");
                }
            });
#else
            _isFirebaseInitialized = true;
            Debug.Log("[FirebaseTrainingRecordService] Running in standalone mode. Ready for cloud persistence.");
#endif
        }

        public void SaveTrainingSession(
            string scenarioId,
            string scenarioName,
            string industry,
            int score,
            int maxScore,
            string status,
            string weakestCategory,
            List<string> identifiedHazards,
            int incorrectActions)
        {
            float pct = maxScore > 0 ? ((float)score / maxScore) * 100f : 0f;
            string sessionId = $"sess_{DateTime.UtcNow.Ticks}";

            var session = new CanonicalTrainingSession
            {
                sessionId = sessionId,
                traineeId = currentTraineeId,
                traineeName = currentTraineeName,
                scenarioId = scenarioId,
                scenarioName = scenarioName,
                industry = industry,
                score = score,
                maxScore = maxScore,
                percentage = pct,
                status = status,
                weakestCategory = weakestCategory,
                identifiedHazards = identifiedHazards ?? new List<string>(),
                incorrectActions = incorrectActions,
                timestampIso = DateTime.UtcNow.ToString("o"),
                timestampEpoch = DateTimeOffset.UtcNow.ToUnixTimeSeconds(),
                isSynced = false
            };

            // Write to Firestore asynchronously
            UploadSessionToFirestore(session);
        }

        private async void UploadSessionToFirestore(CanonicalTrainingSession session)
        {
#if FIREBASE_ENABLED
            if (_isFirebaseInitialized && _firestore != null)
            {
                try
                {
                    var docRef = _firestore.Collection("trainees").Document(session.traineeId).Collection("sessions").Document(session.sessionId);
                    var dict = new Dictionary<string, object>
                    {
                        { "sessionId", session.sessionId },
                        { "traineeId", session.traineeId },
                        { "traineeName", session.traineeName },
                        { "scenarioId", session.scenarioId },
                        { "scenarioName", session.scenarioName },
                        { "industry", session.industry },
                        { "score", session.score },
                        { "maxScore", session.maxScore },
                        { "percentage", session.percentage },
                        { "status", session.status },
                        { "weakestCategory", session.weakestCategory },
                        { "identifiedHazards", session.identifiedHazards },
                        { "incorrectActions", session.incorrectActions },
                        { "timestampIso", session.timestampIso },
                        { "timestampEpoch", session.timestampEpoch }
                    };

                    await docRef.SetAsync(dict);
                    session.isSynced = true;
                    Debug.Log($"[FirebaseTrainingRecordService] Successfully committed session {session.sessionId} to Firestore under trainees/{session.traineeId}/sessions.");
                    return;
                }
                catch (Exception ex)
                {
                    Debug.LogWarning($"[FirebaseTrainingRecordService] Firestore upload failed: {ex.Message}. Handing over to OfflineSyncManager.");
                }
            }
#endif
            // Offline sync queue fallback
            if (Persistence.OfflineSyncManager.Instance != null)
            {
                Persistence.OfflineSyncManager.Instance.SaveSession(
                    session.scenarioId,
                    session.score,
                    session.maxScore,
                    session.status == "Passed",
                    (int)(session.percentage * 10)
                );
            }
        }
    }
}`
  }
];

export const STEP_5_CHECKLIST: ChecklistItem[] = [
  {
    id: 's5-c1',
    category: 'Architecture',
    title: 'Reusable ScenarioDefinition ScriptableObject',
    description: 'Created ScenarioDefinition.cs supporting scenario ID, name, industry, objectives, hazards, passing %, and time bounds.',
    completed: true
  },
  {
    id: 's5-c2',
    category: 'Scenarios',
    title: 'Scenario 1: PPE & Baseline Hazards Preserved',
    description: 'Existing PPE and basic hazard scenario preserved and integrated into the multi-scenario registry.',
    completed: true
  },
  {
    id: 's5-c3',
    category: 'Scenarios',
    title: 'Scenario 2: Electrical Substation Safety',
    description: 'Simulates 440V switchgear, wet floor puddles, missing dielectric PPE, exposed live cable, and LOTO power isolation.',
    completed: true
  },
  {
    id: 's5-c4',
    category: 'Scenarios',
    title: 'Scenario 3: Industrial Fire & Evacuation',
    description: 'Active machinery blaze, blocked fire egress door, break-glass manual alarm pull, and DCP fire extinguisher verification.',
    completed: true
  },
  {
    id: 's5-c5',
    category: 'Scenarios',
    title: 'Scenario 4: Jharkhand Mining & Haulage Safety',
    description: 'Dhanbad/Bokaro coal mine roadway, 35T dump truck blind spot, unsupported roof strata, and DGMS statutory warning boards.',
    completed: true
  },
  {
    id: 's5-c6',
    category: 'Scenarios',
    title: 'Scenario 5: Heavy Machinery & E-Stop Safety',
    description: 'Jamshedpur rolling mill, exposed in-running nip point, loose sleeve attire, and simulated Emergency Stop button actuation.',
    completed: true
  },
  {
    id: 's5-c7',
    category: 'UI & UX',
    title: 'Industrial Safety Training Selection Screen',
    description: 'Cards for all 5 scenarios displaying industry, difficulty selector (Easy/Medium/Hard), best score, and completion status.',
    completed: true
  },
  {
    id: 's5-c8',
    category: 'Analytics',
    title: 'Trainee Dashboard & Trainer Analytics View',
    description: 'Records sessions to Firebase/Firestore, calculates overall completion, average score, scenario stats, and weakest category distribution.',
    completed: true
  },
  {
    id: 's5-c9',
    category: 'AI Integration',
    title: 'Multi-Scenario Gemini Safety Analysis',
    description: 'Reused Gemini safety analysis service across all 5 vocational environments, providing context-specific DGMS/IS advice.',
    completed: true
  }
];
