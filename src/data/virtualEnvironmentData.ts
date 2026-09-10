import { EnvironmentDefinition, VirtualSafetyEvent } from '../types';

export const VIRTUAL_ENVIRONMENTS: Record<string, EnvironmentDefinition> = {
  manufacturing: {
    id: 'manufacturing',
    nameEn: 'Manufacturing Floor',
    nameHi: 'विनिर्माण कार्यशाला (Manufacturing Floor)',
    subtitleEn: 'Heavy Industrial Fabrication & Machine Shop',
    subtitleHi: 'भारी औद्योगिक फैब्रिकेशन एवं मशीन शॉप',
    industry: 'General Manufacturing',
    regulatoryStandard: 'Factories Act 1948 & IS 9474 / IS 15683',
    descriptionEn:
      'Active industrial plant floor with heavy pneumatic presses, conveyor transport systems, high-voltage MCC panels, and crane haulage corridors.',
    descriptionHi:
      'भारी वायवीय प्रेस, कन्वेयर बेल्ट, हाई-वोल्टेज एमसीसी पैनल और ओवरहेड क्रेन कॉरिडोर वाला सक्रिय कार्यशाला क्षेत्र।',
    hotspots: [
      {
        id: 'spot-press',
        nameEn: 'Pneumatic Stamping Press',
        nameHi: 'न्यूमेटिक स्टैम्पिंग प्रेस',
        category: 'machine',
        x: 28,
        y: 42,
        status: 'normal',
        inspectionInfoEn: 'Interlocking mesh guard closed. Light-curtain safety sensors active.',
        inspectionInfoHi: 'इंटरलाकिंग सुरक्षा जाली बंद है। प्रकाश सेंसर सक्रिय हैं।',
        ruleCode: 'IS 9474 Guarding'
      },
      {
        id: 'spot-conveyor',
        nameEn: 'In-Running Conveyor Nip-Point',
        nameHi: 'कन्वेयर बेल्ट रोलर प्वाइंट',
        category: 'machine',
        x: 62,
        y: 55,
        status: 'warning',
        inspectionInfoEn: 'Continuous belt moving at 1.8 m/s. Emergency pull-cord verified.',
        inspectionInfoHi: 'कन्वेयर बेल्ट 1.8 मीटर/सेकंड पर चालू है। इमरजेंसी पुल-कॉर्ड चालू है।',
        ruleCode: 'Factories Act Sec 21'
      },
      {
        id: 'spot-mcc',
        nameEn: '440V Main Distribution Panel',
        nameHi: '440V मुख्य विद्युत वितरण पैनल',
        category: 'electrical',
        x: 12,
        y: 65,
        status: 'normal',
        inspectionInfoEn: 'Dielectric rubber mat IS 15652 in place. LOTO master lockbox stationed.',
        inspectionInfoHi: 'पैनल के सामने रबर इंसुलेशन मैट मौजूद है। लोटो बॉक्स उपलब्ध है।',
        ruleCode: 'CEA Reg 30'
      },
      {
        id: 'spot-exit',
        nameEn: 'Emergency Fire Exit Door',
        nameHi: 'आपातकालीन निकास द्वार (Fire Exit)',
        category: 'exit',
        x: 88,
        y: 32,
        status: 'normal',
        inspectionInfoEn: 'Illuminated green photoluminescent sign. Panic push-bar unobstructed.',
        inspectionInfoHi: 'हरा चमकदार बोर्ड जल रहा है। पुश-बार निकास मार्ग पूरी तरह साफ है।',
        ruleCode: 'IS 2189 Egress'
      },
      {
        id: 'spot-extinguisher',
        nameEn: 'ABC Dry Chemical Extinguisher',
        nameHi: 'एबीसी ड्राई केमिकल अग्निशामक (DCP)',
        category: 'fire',
        x: 84,
        y: 52,
        status: 'normal',
        inspectionInfoEn: 'Pressure gauge needle in green zone. Inspection tag valid through Nov 2026.',
        inspectionInfoHi: 'प्रेशर मीटर की सुई हरे निशान पर है। सुरक्षा पिन लगी हुई है।',
        ruleCode: 'IS 15683'
      },
      {
        id: 'spot-ppe-rack',
        nameEn: 'PPE Inspection & Storage Station',
        nameHi: 'पीपीई निरीक्षण व भंडारण स्टेशन',
        category: 'ppe',
        x: 45,
        y: 22,
        status: 'normal',
        inspectionInfoEn: 'Helmets (IS 2925), safety glasses, and ear plugs available for check-in.',
        inspectionInfoHi: 'प्रमाणित हेलमेट, सुरक्षा चश्मे और ईयरप्लग जांच हेतु उपलब्ध हैं।',
        ruleCode: 'IS 2925 / IS 15298'
      },
      {
        id: 'spot-crane-zone',
        nameEn: 'Overhead Crane Suspended Load Zone',
        nameHi: 'ओवरहेड क्रेन हैंगिंग लोड क्षेत्र',
        category: 'restricted',
        x: 52,
        y: 78,
        status: 'hazard',
        inspectionInfoEn: 'Yellow-black hatched perimeter. No walking under suspended ladle loads.',
        inspectionInfoHi: 'पीली-काली चेतावनी पट्टी। लटके हुए भार के नीचे चलना सख्त मना है।',
        ruleCode: 'Restricted Overhead Clearance'
      }
    ],
    availableEvents: []
  },

  mining: {
    id: 'mining',
    nameEn: 'Mining Area',
    nameHi: 'खनन क्षेत्र (Mining Area)',
    subtitleEn: 'Underground Drift & Heavy Haulage Roadway',
    subtitleHi: 'भूमिगत गैलरी एवं भारी डम्पर हॉल-रोड',
    industry: 'Mining & Extraction',
    regulatoryStandard: 'DGMS Coal Mines Regulations 2017 & Mines Act 1952',
    descriptionEn:
      'High-risk mining environment with underground unsupported roof seams, diesel dump trucks, explosive dust atmospheres, and methane detection gates.',
    descriptionHi:
      'भूमिगत गैलरी, 35-टन डम्पर हॉल-रोड, ज्वलनशील गैस व धूल तथा छत ढहने के जोखिम वाला खनन क्षेत्र।',
    hotspots: [
      {
        id: 'spot-mine-roof',
        nameEn: 'Underground Coal Seam Strata (Roof)',
        nameHi: 'भूमिगत कोयला सीम छत (Strata)',
        category: 'warning',
        x: 35,
        y: 20,
        status: 'warning',
        inspectionInfoEn: 'Hydraulic props and resin-anchored rock bolts installed per Support Plan.',
        inspectionInfoHi: 'हाइड्रोलिक प्रॉप्स और रॉक-बोल्ट सपोर्ट प्लान के अनुसार लगे हैं।',
        ruleCode: 'DGMS CMR Reg 123'
      },
      {
        id: 'spot-mine-dumper',
        nameEn: '35T Diesel Haulage Dumper Path',
        nameHi: '35-टन भारी माइनिंग डम्पर मार्ग',
        category: 'machine',
        x: 70,
        y: 60,
        status: 'hazard',
        inspectionInfoEn: 'Blind-spot mirror active. Minimum 15m pedestrian standoff required.',
        inspectionInfoHi: 'ब्लाइंड-स्पॉट दर्पण लगा है। पैदल चलने वालों के लिए 15 मीटर दूरी जरूरी है।',
        ruleCode: 'DGMS Reg 104 Haulage'
      },
      {
        id: 'spot-gas-monitor',
        nameEn: 'Multi-Gas Telemetry Station',
        nameHi: 'मल्टी-गैस सेंसर स्टेशन (CH₄ / CO)',
        category: 'warning',
        x: 18,
        y: 40,
        status: 'normal',
        inspectionInfoEn: 'Methane (CH₄): 0.35% (Safe). Carbon Monoxide: 4 ppm. Siren armed.',
        inspectionInfoHi: 'मीथेन: 0.35% (सुरक्षित सीमा)। कार्बन मोनोऑक्साइड: 4 पीपीएम।',
        ruleCode: 'DGMS Gas Limits'
      },
      {
        id: 'spot-refuge-bay',
        nameEn: 'Emergency Mine Refuge Bay',
        nameHi: 'आपातकालीन माइन रिफ्यूज बे',
        category: 'exit',
        x: 88,
        y: 28,
        status: 'normal',
        inspectionInfoEn: 'Positive-pressure breathing air line and fresh water pipeline operational.',
        inspectionInfoHi: 'ऑक्सीजन सप्लाई और ताजे पानी की पाइपलाइन चालू स्थिति में है।',
        ruleCode: 'CMR 2017 Emergency Haven'
      },
      {
        id: 'spot-flameproof-switch',
        nameEn: 'Flameproof Electrical Switchgear (FLP)',
        nameHi: 'फ्लेमप्रूफ विद्युत स्विचगियर (FLP)',
        category: 'electrical',
        x: 22,
        y: 72,
        status: 'normal',
        inspectionInfoEn: 'Intrinsically safe FLP enclosure certified for Group I coal environments.',
        inspectionInfoHi: 'डीजीएमएस प्रमाणित ग्रुप-1 कोयला वातावरण हेतु फ्लेमप्रूफ बॉक्स।',
        ruleCode: 'IS/IEC 60079 FLP'
      },
      {
        id: 'spot-danger-barricade',
        nameEn: 'DGMS Goaf Restricted Danger Gate',
        nameHi: 'डीजीएमएस गोफ प्रतिबंधित लाल चेतावनी गेट',
        category: 'restricted',
        x: 50,
        y: 82,
        status: 'hazard',
        inspectionInfoEn: 'Old unventilated goaf area. Bilingual KHATRA / DANGER warning posted.',
        inspectionInfoHi: 'पुरानी बंद गैलरी। द्विभाषी "खतरा / DANGER" लाल बैरिकेड लगा है।',
        ruleCode: 'DGMS Statutory Stoppings'
      }
    ],
    availableEvents: []
  }
};

// ==========================================
// UNEXPECTED SAFETY EVENTS DATA DEFINITION
// ==========================================
export const VIRTUAL_SAFETY_EVENTS: VirtualSafetyEvent[] = [
  // 1. FIRE EMERGENCY (MANUFACTURING) - MULTI-STEP
  {
    id: 'evt-mfg-fire',
    environmentId: 'manufacturing',
    hazardType: 'fire',
    titleEn: 'Transformer Oil Fire & Dense Smoke Plume',
    titleHi: 'ट्रांसफार्मर ऑयल में अचानक आग व घना धुआं',
    descriptionEn:
      'Thick black acrid smoke and yellow flames erupt from the cooling coils of the main plant transformer.',
    descriptionHi:
      'मुख्य ट्रांसफार्मर की कूलिंग कॉइल से अचानक घना काला धुआं और तेज आग की लपटें निकलने लगी हैं।',
    severity: 'critical',
    triggerDelaySeconds: 4,
    iconName: 'Flame',
    visualLocation: {
      x: 78,
      y: 45,
      areaNameEn: 'Transformer Bay & Assembly Lane',
      areaNameHi: 'ट्रांसफार्मर बे एवं असेंबली लेन'
    },
    remediationTag: 'fire',
    stages: [
      {
        stageNumber: 1,
        totalStages: 3,
        stageNameEn: 'Stage 1: Initial Detection & Emergency Alert',
        stageNameHi: 'चरण 1: आग की पहचान एवं आपातकालीन अलार्म',
        situationEn: 'You observe rising flames and smelling burning transformer oil. What is your immediate first action?',
        situationHi: 'आप आग की लपटें उठते और धुआं फैलते देखते हैं। आपका सबसे पहला कदम क्या होना चाहिए?',
        promptEn: 'Choose your immediate response:',
        promptHi: 'तत्काल कार्रवाई चुनें:',
        timerSeconds: 15,
        options: [
          {
            id: 'opt-fire-1a',
            keyLabel: 'A',
            textEn: 'Throw water from the workshop wash bucket onto the transformer',
            textHi: 'पास रखी बाल्टी से ट्रांसफार्मर पर पानी फेंकें',
            isCorrect: false,
            explanationEn:
              'Water conducts electricity! Throwing water onto live transformer equipment causes violent steam explosions and lethal electrical shocks.',
            explanationHi:
              'गलत व जानलेवा! बिजली के उपकरणों पर कभी पानी न डालें। इससे बिजली का भीषण झटका और धमाका हो सकता है।',
            consequenceEn: 'Severe electrocution risk and conductive arc-flash blast.',
            consequenceHi: 'करंट लगने व धमाके से गंभीर जानलेवा खतरा।',
            standardRule: 'IS 15683 / Class C Fire Protocol'
          },
          {
            id: 'opt-fire-1b',
            keyLabel: 'B',
            textEn: 'Shout "Aag! Aag!" and strike the wall-mounted Fire Alarm (Manual Call Point)',
            textHi: 'जोर से "आग! आग!" चिल्लाएं और दीवार पर लगा लाल फायर अलार्म तुरंत दबाएं',
            isCorrect: true,
            explanationEn:
              'Correct! Immediately alerting all workers and triggering the audible plant alarm is the statutory first step before anything else.',
            explanationHi:
              'शाबाश! सबसे पहले सायरन बजाकर सबको सूचित करना सबसे सुरक्षित और अधिकृत कदम है।',
            consequenceEn: 'All plant occupants alerted; automatic emergency response activated.',
            consequenceHi: 'पूरे प्लांट में सायरन बज गया और सभी साथी सतर्क हो गए।',
            standardRule: 'IS 2189 Sec 6.2'
          },
          {
            id: 'opt-fire-1c',
            keyLabel: 'C',
            textEn: 'Quietly pack your personal tools and lunchbox before leaving',
            textHi: 'चुपचाप अपना टूलबॉक्स और सामान समेटें फिर बाहर निकलें',
            isCorrect: false,
            explanationEn:
              'Industrial fires double in size every 30 seconds. Delaying evacuation for personal possessions leads to asphyxiation from toxic cyanide/CO smoke.',
            explanationHi:
              'गलत! आग तेजी से फैलती है। सामान समेटने में समय गंवाने से जहरीले धुएं में दम घुटने का खतरा होता है।',
            consequenceEn: 'Toxic smoke inhalation and trapped escape route.',
            consequenceHi: 'धुएं में फंसने और रास्ता बंद होने का जोखिम।',
            standardRule: 'Factories Act 1948 Egress Rule'
          },
          {
            id: 'opt-fire-1d',
            keyLabel: 'D',
            textEn: 'Open all nearby warehouse windows to let fresh air in',
            textHi: 'ताजी हवा के लिए आसपास की सारी खिड़कियां खोल दें',
            isCorrect: false,
            explanationEn:
              'Opening windows feeds oxygen directly to oil fires, triggering an explosive flashover.',
            explanationHi:
              'गलत! खिड़की खोलने से ऑक्सीजन मिलेगी और आग और भयानक रूप ले लेगी।',
            consequenceEn: 'Oxygen draft accelerates thermal flashover.',
            consequenceHi: 'आग तेजी से भड़क जाएगी।',
            standardRule: 'Industrial Fire Behavior Principles'
          }
        ]
      },
      {
        stageNumber: 2,
        totalStages: 3,
        stageNameEn: 'Stage 2: Suppression vs. Evacuation Choice',
        stageNameHi: 'चरण 2: आग बुझाना या बाहर निकलना',
        situationEn:
          'The alarm is sounding. The oil fire is approximately 1.5 meters wide. Dense smoke is rolling along the ceiling. An ABC Dry Chemical extinguisher is 3 meters away, but exit doors are clear.',
        situationHi:
          'सायरन बज रहा है। आग करीब 1.5 मीटर दायरे में है और धुआं छत पर फैल रहा है। पास में एबीसी अग्निशामक है और निकास द्वार भी खुला है।',
        promptEn: 'What is the correct protocol decision?',
        promptHi: 'सही निर्णय क्या है?',
        timerSeconds: 15,
        options: [
          {
            id: 'opt-fire-2a',
            keyLabel: 'A',
            textEn: 'Run directly through the thick smoke cloud to inspect the damage',
            textHi: 'धुएं के बीच से दौड़कर देखें कि कितना नुकसान हुआ है',
            isCorrect: false,
            explanationEn:
              'One breath of superheated synthetic oil smoke can burn lung airways and cause instant unconsciousness.',
            explanationHi:
              'अत्यधिक खतरनाक! जहरीले और गर्म धुएं में एक सांस लेने से भी फेफड़े जल सकते हैं।',
            consequenceEn: 'Acute asphyxiation and loss of consciousness.',
            consequenceHi: 'दम घुटना और बेहोश होना।',
            standardRule: 'NFPA 101 Life Safety'
          },
          {
            id: 'opt-fire-2b',
            keyLabel: 'B',
            textEn: 'If trained and keeping escape route behind you, apply P.A.S.S. with ABC extinguisher at the base of flames; otherwise evacuate',
            textHi: 'यदि प्रशिक्षित हैं और निकास रास्ता पीछे खुला है, तो PASS नियम से आग की जड़ पर अग्निशामक चलाएं; अन्यथा तुरंत बाहर निकलें',
            isCorrect: true,
            explanationEn:
              'Correct! Never fight a fire without an unobstructed exit behind you. Use P.A.S.S. (Pull, Aim, Squeeze, Sweep) targeting the burning fuel source at the base.',
            explanationHi:
              'शाबाश! निकास रास्ता हमेशा अपनी पीठ के पीछे खुला रखें और PASS नियम से आग की जड़ पर पाउडर छिड़कें।',
            consequenceEn: 'Contained fire progression while maintaining safe egress path.',
            consequenceHi: 'सुरक्षित रहते हुए आग पर नियंत्रण का प्रयास किया गया।',
            standardRule: 'IS 15683 Portable Extinguisher Protocols'
          },
          {
            id: 'opt-fire-2c',
            keyLabel: 'C',
            textEn: 'Take the freight lift/elevator to reach the upper floor office',
            textHi: 'ऊपरी मंजिल पर जाने के लिए लिफ्ट का इस्तेमाल करें',
            isCorrect: false,
            explanationEn:
              'Never use lifts during a fire. Power failure traps occupants in the elevator shaft as smoke chimneys upwards.',
            explanationHi:
              'गलत! आग के दौरान लिफ्ट कभी न लें। बिजली कटने से लिफ्ट फंस सकती है और धुआं भर सकता है।',
            consequenceEn: 'Entrapment in electrical lift shaft with toxic smoke.',
            consequenceHi: 'लिफ्ट में धुएं के साथ फंसने का खतरा।',
            standardRule: 'IS 2189 Emergency Lift Lockout'
          }
        ]
      },
      {
        stageNumber: 3,
        totalStages: 3,
        stageNameEn: 'Stage 3: Evacuation & Headcount',
        stageNameHi: 'चरण 3: सुरक्षित निकास एवं हाजिरी',
        situationEn:
          'You are exiting the plant. Smoke is settling down to head height. Workers are gathering outside.',
        situationHi: 'आप बाहर निकल रहे हैं। धुआं नीचे आ रहा है और साथी बाहर खुले में जा रहे हैं।',
        promptEn: 'Where must you proceed and what must you do?',
        promptHi: 'आपको कहां जाना चाहिए और क्या करना चाहिए?',
        timerSeconds: 15,
        options: [
          {
            id: 'opt-fire-3a',
            keyLabel: 'A',
            textEn: 'Crouch low below the smoke line, exit through Green Door, and report to the designated Assembly Point for headcount',
            textHi: 'धुएं से नीचे झुककर चलें, हरे आपातकालीन गेट से निकलें और असेंबली पॉइंट पर हाजिरी दें',
            isCorrect: true,
            explanationEn:
              'Correct! Cooler breathable air remains in the bottom 50cm. Reporting to the Safety Warden at the Assembly Point confirms all lives are accounted for.',
            explanationHi:
              'शाबाश! धुएं से बचने के लिए झुककर चलना चाहिए और असेंबली पॉइंट पर पहुंचना अनिवार्य है।',
            consequenceEn: 'Safe evacuation complete. Safety Officer marks trainee present.',
            consequenceHi: 'सुरक्षित निकास पूरा हुआ। हाजिरी में आपकी उपस्थिति दर्ज हो गई।',
            standardRule: 'Factories Act 1948 Egress & Headcount Rule'
          },
          {
            id: 'opt-fire-3b',
            keyLabel: 'B',
            textEn: 'Go straight to the parking lot, start your motorcycle, and drive home without telling anyone',
            textHi: 'सीधे पार्किंग में जाएं, गाड़ी उठाएं और बिना किसी को बताए घर चले जाएं',
            isCorrect: false,
            explanationEn:
              'Leaving without headcount reporting causes emergency rescue teams to risk their lives searching inside burning buildings for missing personnel!',
            explanationHi:
              'गलत! बिना बताए चले जाने से बचाव दल आपको ढूंढने के लिए जलती इमारत में जान जोखिम में डालेगा।',
            consequenceEn: 'Emergency rescue teams deployed into danger zone for phantom victim.',
            consequenceHi: 'रेस्क्यू टीम को अनावश्यक रूप से खतरे में डालना।',
            standardRule: 'Muster Point Protocol'
          }
        ]
      }
    ]
  },

  // 2. ELECTRICAL FAULT (MANUFACTURING) - MULTI-STEP
  {
    id: 'evt-mfg-electrical',
    environmentId: 'manufacturing',
    hazardType: 'electrical',
    titleEn: '440V Cable Arc Flash & Damp Floor Hazard',
    titleHi: '440 वोल्ट केबल में स्पार्किंग एवं गीले फर्श का खतरा',
    descriptionEn:
      'A heavy-duty 3-phase feeder cable has suffered mechanical damage from a forklift wheel. Arcing sparks are flying and water coolant has pooled nearby.',
    descriptionHi:
      'फोर्कलिफ्ट से कुचलकर 440V की तीन-फेज केबल कट गई है। तेज चिंगारियां निकल रही हैं और फर्श पर पानी/कूलेंट फैला है।',
    severity: 'critical',
    triggerDelaySeconds: 5,
    iconName: 'Zap',
    visualLocation: {
      x: 18,
      y: 62,
      areaNameEn: 'MCC Feeder Panel & Floor Conduit',
      areaNameHi: 'एमसीसी फीडर पैनल एवं फर्श'
    },
    remediationTag: 'electrical',
    stages: [
      {
        stageNumber: 1,
        totalStages: 2,
        stageNameEn: 'Stage 1: Electrical Perimeter Standoff',
        stageNameHi: 'चरण 1: बिजली से सुरक्षित दूरी बनाए रखना',
        situationEn:
          'You see bright blue electrical arcs flashing across the wet floor near the 440V panel. A trainee is walking towards it unaware.',
        situationHi:
          'आप 440V पैनल के पास गीले फर्श पर नीली चिंगारियां छूटती देखते हैं। एक नया साथी बिना देखे उधर ही बढ़ रहा है।',
        promptEn: 'What is the immediate safe action?',
        promptHi: 'तत्काल सुरक्षित कदम क्या है?',
        timerSeconds: 15,
        options: [
          {
            id: 'opt-elec-1a',
            keyLabel: 'A',
            textEn: 'Grab the trailing cable with bare hands and whip it away from the water puddle',
            textHi: 'नंगे हाथों से केबल पकड़कर पानी से दूर खींच लें',
            isCorrect: false,
            explanationEn:
              'Fatal mistake! 440V current will paralyze muscle contractions immediately, preventing you from letting go and causing cardiac arrest.',
            explanationHi:
              'जानलेवा गलती! नंगे हाथ से 440V छूते ही मांसपेशियां जकड़ जाएंगी और दिल का दौरा पड़ सकता है।',
            consequenceEn: 'Immediate fatal ventricular fibrillation and high-voltage arc burn.',
            consequenceHi: 'तत्काल जानलेवा करंट का झटका।',
            standardRule: 'CEA Regulations 2010 Reg 30'
          },
          {
            id: 'opt-elec-1b',
            keyLabel: 'B',
            textEn: 'Shout a clear vocal warning to the trainee, stop all traffic, and maintain a 2-meter dry barrier standoff',
            textHi: 'साथी को जोर से आवाज देकर रोकें, रास्ता बंद करें और कम से कम 2 मीटर की सूखी दूरी बनाए रखें',
            isCorrect: true,
            explanationEn:
              'Correct! Vocal warning prevents third-party contact. Step-potential in wet environments can electrocute anyone stepping into the puddle.',
            explanationHi:
              'शाबाश! साथी को रोककर खुद भी 2 मीटर दूर रहना ही स्टेप-पोटेंशियल करंट से बचने का सही नियम है।',
            consequenceEn: 'Worker halted safely. Arc-flash perimeter established.',
            consequenceHi: 'साथी सुरक्षित रुक गया और खतरे के घेरे की पहचान हो गई।',
            standardRule: 'IS 2551 & CEA Reg 30 Clearances'
          },
          {
            id: 'opt-elec-1c',
            keyLabel: 'C',
            textEn: 'Step into the puddle wearing cloth sneakers to test if electricity is flowing',
            textHi: 'साधारण कपड़े के जूते पहनकर पानी में पैर रखकर देखें कि करंट आ रहा है या नहीं',
            isCorrect: false,
            explanationEn:
              'Cloth sneakers provide zero electrical insulation against 440V. Moisture conducts current straight into feet.',
            explanationHi:
              'अत्यंत खतरनाक! कपड़े के जूतों से करंट नहीं रुकता, गीले पानी से करंट सीधे शरीर में आएगा।',
            consequenceEn: 'Electrocution through wet footwear.',
            consequenceHi: 'जूतों से करंट लगना।',
            standardRule: 'IS 4770 Dielectric Footwear Protocol'
          }
        ]
      },
      {
        stageNumber: 2,
        totalStages: 2,
        stageNameEn: 'Stage 2: Authorized Isolation (LOTO)',
        stageNameHi: 'चरण 2: अधिकृत बिजली कट व लोटो (LOTO)',
        situationEn:
          'The hazard is cordoned off. You need to de-energize the circuit safely so qualified maintenance can replace the damaged cable.',
        situationHi:
          'खतरे वाले क्षेत्र को घेर दिया गया है। अब केबल बदलने के लिए बिजली सप्लाई को सुरक्षित रूप से बंद करना है।',
        promptEn: 'How must power isolation be performed?',
        promptHi: 'बिजली सप्लाई कैसे बंद की जानी चाहिए?',
        timerSeconds: 15,
        options: [
          {
            id: 'opt-elec-2a',
            keyLabel: 'A',
            textEn: 'Wrap electrical tape around the sparking section while power is still on',
            textHi: 'चालू बिजली में ही केबल पर काली इंसुलेशन टेप लपेट दें',
            isCorrect: false,
            explanationEn:
              'Never tape live energized high-voltage cables. Arc flashes reach 19,000°C, instantly vaporizing tape and causing severe burns.',
            explanationHi:
              'गलत! चालू केबल पर टेप कभी न लगाएं। तेज स्पार्क से भीषण आग लग सकती है।',
            consequenceEn: 'Severe thermal blast burns to hands and face.',
            consequenceHi: 'हाथों और चेहरे का गंभीर रूप से जलना।',
            standardRule: 'CEA Reg 34 De-energization'
          },
          {
            id: 'opt-elec-2b',
            keyLabel: 'B',
            textEn: 'Trip upstream breaker, apply Lockout/Tagout (LOTO) padlock, verify zero voltage with multimeter, and notify electrical supervisor',
            textHi: 'मेन स्विच बंद करें, लोटो ताला और टैग लगाएं, टेस्टर से जीरो वोल्टेज जांचें और इंजीनियर को सूचित करें',
            isCorrect: true,
            explanationEn:
              'Correct! LOTO (Lockout/Tagout) ensures no one can accidentally switch the power back on while repairs are underway. Zero-energy verification proves the line is dead.',
            explanationHi:
              'शाबाश! स्विच बंद कर ताला-टैग (LOTO) लगाना और बिजली की अनुपस्थिति की जांच करना ही कानूनी नियम है।',
            consequenceEn: 'Circuit safely locked out; zero energy state verified.',
            consequenceHi: 'लाइन पूरी तरह बंद और सुरक्षित हो गई।',
            standardRule: 'CEA Regulations 2010 / IS 13947 LOTO'
          }
        ]
      }
    ]
  },

  // 3. MACHINERY NIP-POINT FAILURE (MANUFACTURING)
  {
    id: 'evt-mfg-machinery',
    environmentId: 'manufacturing',
    hazardType: 'machinery',
    titleEn: 'Conveyor Jam & Dislodged Protective Mesh Guard',
    titleHi: 'कन्वेयर बेल्ट जाम व खुली सुरक्षात्मक जाली',
    descriptionEn:
      'A component has jammed in the drive roller of conveyor line #2. The protective wire-mesh guard has been knocked loose, exposing rotating gears.',
    descriptionHi:
      'कन्वेयर बेल्ट के रोलर में कलपुर्जा फंस गया है। सुरक्षात्मक जाली ढीली होकर खुल गई है और घूमने वाले गियर नंगे दिख रहे हैं।',
    severity: 'high',
    triggerDelaySeconds: 6,
    iconName: 'Cog',
    visualLocation: {
      x: 64,
      y: 52,
      areaNameEn: 'Conveyor Line #2 Roller Bay',
      areaNameHi: 'कन्वेयर लाइन #2 रोलर बे'
    },
    remediationTag: 'machinery',
    stages: [
      {
        stageNumber: 1,
        totalStages: 1,
        stageNameEn: 'Emergency Stop & Mechanical Clearing',
        stageNameHi: 'इमरजेंसी स्टॉप एवं सुरक्षित पुर्जा निकालना',
        situationEn:
          'The conveyor motor is whining under strain. An operator is tempted to reach their hand inside the rotating nip to dislodge the stuck part quickly.',
        situationHi:
          'मोटर पर दबाव से अजीब आवाज आ रही है। एक कर्मचारी तेजी से फंसा पुर्जा निकालने के लिए हाथ अंदर डालने जा रहा है।',
        promptEn: 'What is the required safe response?',
        promptHi: 'अनिवार्य सुरक्षा प्रतिक्रिया क्या है?',
        timerSeconds: 15,
        options: [
          {
            id: 'opt-mach-1a',
            keyLabel: 'A',
            textEn: 'Slap the big Red Mushroom Emergency Stop (E-Stop) button immediately; do NOT let anyone reach inside running parts',
            textHi: 'तुरंत लाल रंग का बड़ा इमरजेंसी स्टॉप (E-Stop) बटन दबाएं; चलती मशीन में हाथ न डालने दें',
            isCorrect: true,
            explanationEn:
              'Correct! In-running nip points pull hands and arms in fractions of a second. The red mushroom E-Stop instantly cuts drive power before any physical intervention.',
            explanationHi:
              'शाबाश! सबसे पहले लाल इमरजेंसी स्टॉप बटन दबाकर मशीन रोकनी चाहिए। चलती मशीन में हाथ डालना हाथ कटने का कारण बनता है।',
            consequenceEn: 'Drive motor halted instantly; zero pinch injury.',
            consequenceHi: 'मशीन तुरंत रुक गई और हाथ कटने से बच गया।',
            standardRule: 'Factories Act 1948 Section 21 & IS 9474'
          },
          {
            id: 'opt-mach-1b',
            keyLabel: 'B',
            textEn: 'Quickly use a metal pry bar to lever the jammed part out while the belt is running full speed',
            textHi: 'चलती मशीन में लोहे की रॉड डालकर पुर्जे को बाहर निकालने का प्रयास करें',
            isCorrect: false,
            explanationEn:
              'Rotating gears will grab the metal bar and propel it like shrapnel, or pull the operator violently into the drive sprocket.',
            explanationHi:
              'गलत! चलती मशीन लोहे की रॉड को खींचकर ऑपरेटर को अंदर घसीट सकती है या रॉड टूटकर चोट पहुंचा सकती है।',
            consequenceEn: 'Severe mechanical crush injury and projectile hazard.',
            consequenceHi: 'गंभीर चोट और रॉड उछलने का खतरा।',
            standardRule: 'IS 9474 Guarding Mandate'
          },
          {
            id: 'opt-mach-1c',
            keyLabel: 'C',
            textEn: 'Pour liquid grease directly onto the moving teeth to loosen the jam',
            textHi: 'चलते दांतों पर ग्रीस डालकर ढीला करने की कोशिश करें',
            isCorrect: false,
            explanationEn:
              'Applying lubricants to rotating moving parts is illegal under the Factories Act and causes violent entanglement.',
            explanationHi:
              'अवैध व खतरनाक! चलती मशीन में तेल या ग्रीस डालना कारख़ाना अधिनियम के विरुद्ध है।',
            consequenceEn: 'Glove and clothing entanglement.',
            consequenceHi: 'कपड़े या दस्ताने फंसने का खतरा।',
            standardRule: 'Factories Act 1948 Sec 22'
          }
        ]
      }
    ]
  },

  // 4. PPE COMPLIANCE VIOLATION (MANUFACTURING)
  {
    id: 'evt-mfg-ppe',
    environmentId: 'manufacturing',
    hazardType: 'ppe',
    titleEn: 'Worker Entering Overhead Crane Lift Zone Without Helmet',
    titleHi: 'बिना हेलमेट क्रेन लिफ्टिंग क्षेत्र में वर्कर का प्रवेश',
    descriptionEn:
      'A contractor worker carrying structural steel bars has entered the overhead gantry crane perimeter wearing only a cloth cap and sandals.',
    descriptionHi:
      'एक ठेका मजदूर केवल साधारण टोपी और चप्पल पहने भारी ओवरहेड क्रेन के खतरे वाले इलाके में घुस गया है।',
    severity: 'medium',
    triggerDelaySeconds: 4,
    iconName: 'HardHat',
    visualLocation: {
      x: 48,
      y: 72,
      areaNameEn: 'Gantry Crane Suspended Lift Corridor',
      areaNameHi: 'गैन्ट्री क्रेन लिफ्ट कॉरिडोर'
    },
    remediationTag: 'ppe',
    stages: [
      {
        stageNumber: 1,
        totalStages: 1,
        stageNameEn: 'PPE Enforcement & Hazard Intervention',
        stageNameHi: 'पीपीई अनुपालन एवं सुरक्षा हस्तक्षेप',
        situationEn:
          'A 2-tonne steel beam is suspended 8 meters overhead. The worker without a helmet is walking directly beneath the crane load line.',
        situationHi:
          'ऊपर 8 मीटर की ऊंचाई पर 2 टन का लोहे का बीम लटक रहा है। बिना हेलमेट का मजदूर ठीक उसके नीचे से गुजर रहा है।',
        promptEn: 'What is your immediate supervisory safety intervention?',
        promptHi: 'आपका तत्काल सुरक्षा हस्तक्षेप क्या होना चाहिए?',
        timerSeconds: 15,
        options: [
          {
            id: 'opt-ppe-1a',
            keyLabel: 'A',
            textEn: 'Signal the worker to halt immediately, step outside the crane perimeter, and don certified IS 2925 hard hat and IS 15298 safety boots',
            textHi: 'मजदूर को तुरंत रुकने का इशारा करें, क्रेन के दायरे से बाहर निकालें और प्रमाणित हेलमेट व जूते पहनाएं',
            isCorrect: true,
            explanationEn:
              'Correct! Direct stop-work intervention protects human life. Falling bolts, clips, or hoist cable failure can kill unhelmeted personnel instantaneously.',
            explanationHi:
              'शाबाश! तुरंत काम रुकवाना और सुरक्षात्मक उपकरण (हेलमेट और जूते) पहनवाना ही सही सुरक्षा नियम है।',
            consequenceEn: 'Worker evacuated to safe walkway; full PPE enforced.',
            consequenceHi: 'मजदूर सुरक्षित बाहर निकला और सही पीपीई सुनिश्चित हुआ।',
            standardRule: 'IS 2925 (Hard Hats) & IS 15298 (Boots)'
          },
          {
            id: 'opt-ppe-1b',
            keyLabel: 'B',
            textEn: 'Ignore him; everyone is responsible only for their own personal safety',
            textHi: 'अनदेखा करें; हर कोई अपनी सुरक्षा का खुद जिम्मेदार है',
            isCorrect: false,
            explanationEn:
              'Unacceptable safety culture! Industrial safety depends on peer observation and intervention to protect lives.',
            explanationHi:
              'गलत! कार्यस्थल पर किसी भी साथी को खतरे में देखना और चुप रहना घोर लापरवाही है।',
            consequenceEn: 'Catastrophic fatality risk if rigging hardware fails.',
            consequenceHi: 'ऊपर से सामान गिरने पर जान जाने का खतरा।',
            standardRule: 'Zero Harm Workplace Culture'
          },
          {
            id: 'opt-ppe-1c',
            keyLabel: 'C',
            textEn: 'Tell him to hurry up and run faster beneath the load',
            textHi: 'उसे कहें कि दौड़कर जल्दी से बीम के नीचे से निकल जाए',
            isCorrect: false,
            explanationEn:
              'Running beneath suspended crane loads causes panic slips and increases exposure time during sudden rigging failures.',
            explanationHi:
              'गलत! लटके हुए भार के नीचे दौड़ने से फिसलने और दबने का खतरा बढ़ जाता है।',
            consequenceEn: 'Slip and entrapment directly under pinch zone.',
            consequenceHi: 'फिसलने और दबने का गंभीर खतरा।',
            standardRule: 'IS 13367 Mobile & Gantry Crane Safety'
          }
        ]
      }
    ]
  },

  // 5. RESTRICTED ZONE VIOLATION (MANUFACTURING)
  {
    id: 'evt-mfg-restricted',
    environmentId: 'manufacturing',
    hazardType: 'restricted',
    titleEn: 'Forklift Haulage Crossing & Barricade Breach',
    titleHi: 'फोर्कलिफ्ट मार्ग में बिना अनुमति प्रवेश',
    descriptionEn:
      'A delivery driver has stepped past the yellow/black zebra safety barrier into the fast-moving forklift blind curve.',
    descriptionHi:
      'एक व्यक्ति पीली-काली सुरक्षा पट्टी पार करके तेज चलती फोर्कलिफ्ट के अंधे मोड़ वाले रास्ते पर चला गया है।',
    severity: 'medium',
    triggerDelaySeconds: 5,
    iconName: 'ShieldAlert',
    visualLocation: {
      x: 35,
      y: 78,
      areaNameEn: 'Forklift Traffic Intersect #3',
      areaNameHi: 'फोर्कलिफ्ट चौराहा #3'
    },
    remediationTag: 'machinery',
    stages: [
      {
        stageNumber: 1,
        totalStages: 1,
        stageNameEn: 'Pedestrian vs Mobile Plant Separation',
        stageNameHi: 'पैदल मार्ग एवं भारी वाहन पृथक्करण',
        situationEn:
          'A loaded 3-tonne forklift is approaching the blind corner with horn sounding. The pedestrian cannot see it because of stacked pallet boxes.',
        situationHi:
          'सामान लदी 3-टन फोर्कलिफ्ट हॉर्न बजाते हुए मोड़ पर आ रही है। पेटियों की वजह से पैदल व्यक्ति को गाड़ी नहीं दिख रही।',
        promptEn: 'What is the required action?',
        promptHi: 'जरूरी कार्रवाई क्या है?',
        timerSeconds: 15,
        options: [
          {
            id: 'opt-res-1a',
            keyLabel: 'A',
            textEn: 'Call out loudly to stop the pedestrian, direct them into the dedicated green pedestrian walkway, and secure the magnetic gate',
            textHi: 'आवाज देकर पैदल व्यक्ति को रोकें, उसे हरे पैदल मार्ग पर ले जाएं और सुरक्षा गेट बंद करें',
            isCorrect: true,
            explanationEn:
              'Correct! Physical separation between mobile industrial trucks and pedestrians is the single most effective defense against crush collisions.',
            explanationHi:
              'शाबाश! फोर्कलिफ्ट और पैदल यात्रियों को हमेशा अलग-अलग रास्तों पर रखना चाहिए।',
            consequenceEn: 'Pedestrian safely routed onto marked walkway; collision prevented.',
            consequenceHi: 'व्यक्ति सुरक्षित पैदल मार्ग पर आ गया और टक्कर टल गई।',
            standardRule: 'Factories Act 1948 Floor Aisles Mandate'
          },
          {
            id: 'opt-res-1b',
            keyLabel: 'B',
            textEn: 'Stand in front of the forklift to try and physically block it with your arms',
            textHi: 'फोर्कलिफ्ट के सामने खड़े होकर उसे हाथ दिखाकर रोकने की कोशिश करें',
            isCorrect: false,
            explanationEn:
              'A loaded forklift weighs over 5,000 kg and cannot stop instantly. Standing in front creates double casualties.',
            explanationHi:
              'अत्यधिक खतरनाक! 5000 किलो की चलती गाड़ी के आगे खड़े होने से आप भी कुचले जा सकते हैं।',
            consequenceEn: 'High-inertia vehicular impact.',
            consequenceHi: 'गाड़ी से कुचलने का जानलेवा खतरा।',
            standardRule: 'Mobile Equipment Safety'
          }
        ]
      }
    ]
  },

  // 6. UNDERGROUND ROOF STRATA FAILURE (MINING) - MULTI-STEP
  {
    id: 'evt-mine-roof',
    environmentId: 'mining',
    hazardType: 'roof',
    titleEn: 'Unsupported Coal Seam Roof Spalling & Strata Crack',
    titleHi: 'भूमिगत कोयला छत से पत्थर गिरना व दरार (Roof Fall Risk)',
    descriptionEn:
      'Fine coal dust and small pebbles are trickling down from an unsupported roof joint. A distinct hairline fracture has opened along the hanging wall.',
    descriptionHi:
      'खदान की छत से कोयले के छोटे टुकड़े और धूल गिर रही है। छत की दीवार पर एक साफ दरार खुलती दिख रही है।',
    severity: 'critical',
    triggerDelaySeconds: 4,
    iconName: 'Pickaxe',
    visualLocation: {
      x: 36,
      y: 22,
      areaNameEn: 'Drift Gallery #4 Roof Seam',
      areaNameHi: 'ड्रिफ्ट गैलरी #4 छत सीम'
    },
    remediationTag: 'mining',
    stages: [
      {
        stageNumber: 1,
        totalStages: 2,
        stageNameEn: 'Stage 1: Warning Sign Recognition & Perimeter Clearance',
        stageNameHi: 'चरण 1: छत गिरने के संकेत पहचानना एवं तुरंत हटना',
        situationEn:
          'Dust trickles from the roof and you hear a dull cracking "thump" in the strata rock. Two coal cutters are working underneath.',
        situationHi:
          'छत से धूल झर रही है और पत्थर चटकने की धीमी आवाज आई है। नीचे दो मजदूर कोयला काट रहे हैं।',
        promptEn: 'What is your immediate response under DGMS regulations?',
        promptHi: 'डीजीएमएस नियमों के तहत आपका तत्काल कदम क्या है?',
        timerSeconds: 15,
        options: [
          {
            id: 'opt-roof-1a',
            keyLabel: 'A',
            textEn: 'Keep cutting coal until the shift siren blows in 20 minutes',
            textHi: 'काम जारी रखें जब तक 20 मिनट बाद शिफ्ट की छुट्टी का सायरन न बज जाए',
            isCorrect: false,
            explanationEn:
              'Roof falls in underground mines are instantaneous and deadly. Minor dust trickling is the universal primary precursor to catastrophic collapse.',
            explanationHi:
              'अत्यंत घातक! छत से धूल गिरना छत ढहने का पहला संकेत है। काम जारी रखना मौत को बुलावा देना है।',
            consequenceEn: 'Massive coal roof collapse crushing all personnel beneath.',
            consequenceHi: 'छत ढहने से नीचे दबने का घातक परिणाम।',
            standardRule: 'DGMS Coal Mines Regulations 2017 Reg 123'
          },
          {
            id: 'opt-roof-1b',
            keyLabel: 'B',
            textEn: 'Shout "Roof Warning!", retreat immediately with all workers at least 15 meters to supported ground, and erect temporary barrier',
            textHi: 'जोर से "छत का खतरा!" चिल्लाएं, सभी साथियों के साथ कम से कम 15 मीटर दूर मजबूत सपोर्ट वाले क्षेत्र में जाएं और लाल रिबन लगाएं',
            isCorrect: true,
            explanationEn:
              'Correct! DGMS mandatory rule: Any strata disturbance requires immediate withdrawal to safe supported galleries before attempting support.',
            explanationHi:
              'शाबाश! छत से आवाज आते ही तुरंत सुरक्षित जगह पर पीछे हटना ही DGMS का सख्त कानून है।',
            consequenceEn: 'All workers retreated safely to permanent steel arch support.',
            consequenceHi: 'सभी मजदूर सुरक्षित स्टील सपोर्ट वाले इलाके में आ गए।',
            standardRule: 'DGMS CMR 2017 Regulation 123 & 124'
          },
          {
            id: 'opt-roof-1c',
            keyLabel: 'C',
            textEn: 'Use a long iron crowbar to strike the crack forcefully to knock down loose stone right now',
            textHi: 'लोहे की भारी रॉड से दरार पर जोर-जोर से मारकर पत्थर गिराने की कोशिश करें',
            isCorrect: false,
            explanationEn:
              'Only certified Mining Sirdars with proper dressing tools and safety canopies are permitted to dress loose roofs.',
            explanationHi:
              'गलत! बिना ट्रेनिंग और सुरक्षा कवर के छत पर चोट मारने से पूरी छत आपके ऊपर गिर सकती है।',
            consequenceEn: 'Induced premature roof collapse directly on operator.',
            consequenceHi: 'छत सीधे ऊपर गिरना।',
            standardRule: 'DGMS Dressing Protocol'
          }
        ]
      },
      {
        stageNumber: 2,
        totalStages: 2,
        stageNameEn: 'Stage 2: Statutory Reporting & Support Installation',
        stageNameHi: 'चरण 2: सिरदार को रिपोर्ट व हाइड्रोलिक सपोर्ट',
        situationEn:
          'Workers are safe in the supported junction. The dangerous area must be secured before anyone enters again.',
        situationHi:
          'सभी साथी सुरक्षित सपोर्ट वाले जंक्शन पर आ गए हैं। अब दोबारा प्रवेश रोकने और सपोर्ट लगाने की प्रक्रिया करनी है।',
        promptEn: 'What is the correct statutory procedure?',
        promptHi: 'अधिकृत कानूनी प्रक्रिया क्या है?',
        timerSeconds: 15,
        options: [
          {
            id: 'opt-roof-2a',
            keyLabel: 'A',
            textEn: 'Report immediately to the Mining Sirdar / Overman and install mechanical hydraulic props per the Site Support Plan',
            textHi: 'माइनिंग सिरदार/ओवरमैन को तुरंत रिपोर्ट करें और सपोर्ट प्लान के अनुसार हाइड्रोलिक प्रॉप्स लगाएं',
            isCorrect: true,
            explanationEn:
              'Correct! The Overman/Sirdar inspects the strata, tags the gallery, and directs certified prop installation under temporary safety shields.',
            explanationHi:
              'शाबाश! खदान सिरदार को सूचित करना और योजनाबद्ध तरीके से सपोर्ट लगाना ही सही नियम है।',
            consequenceEn: 'Strata stabilized; statutory entry permit issued.',
            consequenceHi: 'छत को मजबूत सपोर्ट मिला और सुरक्षित काम का परमिट जारी हुआ।',
            standardRule: 'Mines Act 1952 Section 22'
          },
          {
            id: 'opt-roof-2b',
            keyLabel: 'B',
            textEn: 'Take down the warning signs so the shift supervisor doesn\'t get upset about production delays',
            textHi: 'चेतावनी बोर्ड हटा दें ताकि सुपरवाइजर काम रुकने से नाराज न हों',
            isCorrect: false,
            explanationEn:
              'Concealing safety hazards in mines is a criminal offense under the Mines Act, punishable by imprisonment.',
            explanationHi:
              'घोर अपराध! खदान में खतरे को छिपाना कानूनी जुर्म है जिससे साथियों की जान जा सकती है।',
            consequenceEn: 'Criminal statutory violation and catastrophic worker injury.',
            consequenceHi: 'कानूनी कार्रवाई और जानलेवा दुर्घटना।',
            standardRule: 'Mines Act Statutory Compliance'
          }
        ]
      }
    ]
  },

  // 7. METHANE GAS SPIKE & VENTILATION WARNING (MINING)
  {
    id: 'evt-mine-gas',
    environmentId: 'mining',
    hazardType: 'gas',
    titleEn: 'Methane (CH₄) Spike Exceeding 1.25% DGMS Limit',
    titleHi: 'ज्वलनशील मीथेन गैस (CH₄) का खतरनाक स्तर (1.25% से अधिक)',
    descriptionEn:
      'The electronic methanometer telemetry unit sounds a shrill alarm. CH₄ concentration in the blind heading has jumped to 1.45%.',
    descriptionHi:
      'इलेक्ट्रॉनिक गैस मीटर का तेज सायरन बज उठा है। गैलरी में मीथेन गैस की मात्रा 1.45% पहुंच गई है जो खतरनाक स्तर है।',
    severity: 'critical',
    triggerDelaySeconds: 4,
    iconName: 'Wind',
    visualLocation: {
      x: 18,
      y: 42,
      areaNameEn: 'Heading #2 Face Telemetry Sensor',
      areaNameHi: 'हेडिंग #2 फेस गैस सेंसर'
    },
    remediationTag: 'mining',
    stages: [
      {
        stageNumber: 1,
        totalStages: 1,
        stageNameEn: 'Inflammable Gas Emergency Protocol',
        stageNameHi: 'ज्वलनशील गैस आपातकालीन प्रक्रिया',
        situationEn:
          'Methane reading is 1.45%. At 5% to 15%, methane is violently explosive. An auxiliary fan seems to have tripped.',
        situationHi:
          'मीथेन 1.45% पर है। 5% से 15% पर मीथेन में भीषण विस्फोट होता है। ऐसा लगता है वेंटिलेशन पंखा बंद हो गया है।',
        promptEn: 'What is the mandatory DGMS procedure?',
        promptHi: 'डीजीएमएस का अनिवार्य नियम क्या है?',
        timerSeconds: 15,
        options: [
          {
            id: 'opt-gas-1a',
            keyLabel: 'A',
            textEn: 'Cut off all electrical power to the face, withdraw all workers through intake fresh air immediately, and do not attempt to start electrical fans until cleared',
            textHi: 'तुरंत फेस की बिजली बंद करें, सभी को ताजी हवा वाले रास्ते से बाहर निकालें और बिना अनुमति पंखा चालू न करें',
            isCorrect: true,
            explanationEn:
              'Correct! CMR 2017 Regulation 169: When inflammable gas exceeds 1.25%, all electrical power must be isolated and personnel withdrawn to intake airway immediately.',
            explanationHi:
              'शाबाश! 1.25% से ऊपर गैस होते ही तुरंत बिजली काटना और ताजी हवा वाले रास्ते से बाहर निकलना अनिवार्य कानून है।',
            consequenceEn: 'Zero ignition source present. All personnel evacuated to main intake.',
            consequenceHi: 'चिंगारी का कोई स्रोत नहीं रहा और सभी साथी सुरक्षित बाहर आ गए।',
            standardRule: 'DGMS CMR 2017 Regulation 169'
          },
          {
            id: 'opt-gas-1b',
            keyLabel: 'B',
            textEn: 'Light a cigarette or match to see if the gas will catch fire and burn off',
            textHi: 'माचिस या बीड़ी जलाकर देखें कि गैस जलती है या नहीं',
            isCorrect: false,
            explanationEn:
              'Insane and fatal! Contraband like matches or lighters are strictly banned in mines. Any open spark triggers a massive firedamp mine explosion.',
            explanationHi:
              'जानलेवा गलती! खदान में कोई भी माचिस या चिंगारी पूरे खदान में भीषण विस्फोट करा सकती है।',
            consequenceEn: 'Massive underground explosion destroying the entire district.',
            consequenceHi: 'पूरी खदान में महाविस्फोट।',
            standardRule: 'Mines Act Prohibition of Contraband'
          },
          {
            id: 'opt-gas-1c',
            keyLabel: 'C',
            textEn: 'Turn on additional electrical cutting machinery to speed up work before gas rises',
            textHi: 'मशीनें और तेजी से चलाएं ताकि गैस बढ़ने से पहले कोयला निकल जाए',
            isCorrect: false,
            explanationEn:
              'Electric motor switches generate internal arcing sparks that can ignite gas pockets.',
            explanationHi:
              'गलत! मोटर के स्विच से निकलने वाली चिंगारी गैस में आग लगा सकती है।',
            consequenceEn: 'Arc-flash ignition of methane gas cloud.',
            consequenceHi: 'गैस में चिंगारी से आग लगना।',
            standardRule: 'DGMS CMR 2017 Reg 170'
          }
        ]
      }
    ]
  },

  // 8. 35T DUMPER HAULAGE BLIND ZONE (MINING)
  {
    id: 'evt-mine-dumper',
    environmentId: 'mining',
    hazardType: 'machinery',
    titleEn: 'Pedestrian Walking in 35T Haulage Dumper Blind Spot',
    titleHi: '35-टन भारी डम्पर के पीछे ब्लाइंड स्पॉट में मजदूर',
    descriptionEn:
      'A 35-tonne diesel dump truck is beginning to reverse towards the coal transfer bunker. A worker with head turned away is walking in the rear blind turning radius.',
    descriptionHi:
      '35-टन का विशाल डम्पर पीछे बैक हो रहा है। एक मजदूर पीछे मुड़कर देखे बिना डम्पर के पहिए के रास्ते में चल रहा है।',
    severity: 'critical',
    triggerDelaySeconds: 5,
    iconName: 'ShieldAlert',
    visualLocation: {
      x: 72,
      y: 62,
      areaNameEn: 'Haulage Road Transfer Bunker',
      areaNameHi: 'हॉल-रोड ट्रांसफर बंकर'
    },
    remediationTag: 'mining',
    stages: [
      {
        stageNumber: 1,
        totalStages: 1,
        stageNameEn: 'Haulage Truck Standoff & Refuge Bay',
        stageNameHi: 'भारी वाहन से 15 मीटर दूरी एवं रिफ्यूज बे',
        situationEn:
          'The dump truck reversing buzzer is sounding, but the worker has hearing protection on and cannot see the truck reversing.',
        situationHi:
          'डम्पर का बैक हॉर्न बज रहा है लेकिन मजदूर ने ईयरप्लग लगा रखा है और उसे पीछे गाड़ी आती नहीं दिख रही।',
        promptEn: 'What is the correct safety intervention?',
        promptHi: 'सही सुरक्षा हस्तक्षेप क्या है?',
        timerSeconds: 15,
        options: [
          {
            id: 'opt-dump-1a',
            keyLabel: 'A',
            textEn: 'Flash high-intensity cap lamp beam onto worker\'s path, wave red warning flag/signal, and guide worker into the designated refuge bay (minimum 15m clearance)',
            textHi: 'कैप लैंप की रोशनी सीधे उसके रास्ते पर चमकाएं, लाल झंडी का इशारा करें और तुरंत रिफ्यूज बे में ले जाएं (कम से कम 15 मीटर दूरी)',
            isCorrect: true,
            explanationEn:
              'Correct! Visual light signals cut through ear protection. DGMS rules require pedestrians to maintain 15 meters standoff from heavy earthmoving machinery and use refuge bays.',
            explanationHi:
              'शाबाश! लाइट के इशारे से मजदूर सतर्क हुआ और रिफ्यूज बे में जाकर सुरक्षित हो गया।',
            consequenceEn: 'Worker enters protected refuge hole; truck completes reverse safely.',
            consequenceHi: 'मजदूर सुरक्षित रिफ्यूज बे में चला गया।',
            standardRule: 'DGMS CMR 2017 Regulation 104'
          },
          {
            id: 'opt-dump-1b',
            keyLabel: 'B',
            textEn: 'Run directly behind the reversing dump truck to pull the worker by their belt',
            textHi: 'रिवर्स होते डम्पर के ठीक पीछे दौड़कर मजदूर को बेल्ट से खींचने जाएं',
            isCorrect: false,
            explanationEn:
              'Never run into the blind spot of a reversing 35-tonne vehicle. Both workers can be crushed beneath the rear dual tires.',
            explanationHi:
              'खतरनाक! रिवर्स होती विशाल गाड़ी के पीछे दौड़ने से आप दोनों कुचले जा सकते हैं।',
            consequenceEn: 'Double crush entrapment under heavy earthmoving machinery tires.',
            consequenceHi: 'पहियों के नीचे दबने का जानलेवा जोखिम।',
            standardRule: 'DGMS Heavy Machinery Clearance'
          },
          {
            id: 'opt-dump-1c',
            keyLabel: 'C',
            textEn: 'Throw coal rocks at the dumper windshield to try to crack the glass and get the driver\'s attention',
            textHi: 'ड्राइवर का ध्यान खींचने के लिए डम्पर के शीशे पर कोयले के पत्थर फेंकें',
            isCorrect: false,
            explanationEn:
              'Throwing stones can shatter glass into the driver\'s eyes, causing loss of braking control and an uncontrolled runaway vehicle.',
            explanationHi:
              'गलत! पत्थर फेंकने से ड्राइवर का ध्यान भटकेगा और गाड़ी बेकाबू होकर पलट सकती है।',
            consequenceEn: 'Driver blinding and loss of heavy truck steering control.',
            consequenceHi: 'गाड़ी का संतुलन बिगड़ना।',
            standardRule: 'Code of Safe Practice for Haulage'
          }
        ]
      }
    ]
  }
];

// Populate events into respective environments
VIRTUAL_ENVIRONMENTS.manufacturing.availableEvents = VIRTUAL_SAFETY_EVENTS.filter(
  (e) => e.environmentId === 'manufacturing'
);
VIRTUAL_ENVIRONMENTS.mining.availableEvents = VIRTUAL_SAFETY_EVENTS.filter(
  (e) => e.environmentId === 'mining'
);
