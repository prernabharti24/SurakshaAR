export interface HazardActionChoice {
  id: string;
  textEn: string;
  textHi: string;
  isCorrect: boolean;
  consequenceEn: string;
  consequenceHi: string;
  penaltyScore?: number;
}

export interface HazardActionDetail {
  id: string;
  titleEn: string;
  titleHi: string;
  categoryEn: string;
  categoryHi: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  standardEn: string;
  standardHi: string;
  riskDescriptionEn: string;
  riskDescriptionHi: string;
  isCompliantControl: boolean;
  choices: HazardActionChoice[];
}

export const HAZARD_ACTIONS_MAP: Record<string, HazardActionDetail> = {
  // Scenario 1: PPE & Workplace Hazards
  'worker-helmet': {
    id: 'worker-helmet',
    titleEn: 'Missing Safety Hard Hat',
    titleHi: 'सुरक्षा हेलमेट न होना',
    categoryEn: 'Personal Protective Equipment',
    categoryHi: 'व्यक्तिगत सुरक्षा उपकरण',
    severity: 'High',
    standardEn: 'IS 2925 (Industrial Safety Helmets)',
    standardHi: 'IS 2925 (औद्योगिक सुरक्षा हेलमेट)',
    riskDescriptionEn: 'Worker entered active manufacturing perimeter without approved head protection. Extreme hazard of skull fracture and concussion from overhead crane loads, dropped tools, and steel beams.',
    riskDescriptionHi: 'श्रमिक बिना हेलमेट के सक्रिय मशीनरी क्षेत्र में है। ऊपर से गिरने वाले औजारों या लोहे के गर्डर से सिर में जानलेवा चोट का गंभीर खतरा है।',
    isCompliantControl: false,
    choices: [
      {
        id: 'opt-helmet-correct',
        textEn: 'Equip approved IS 2925 industrial hard hat with secure chin strap',
        textHi: 'मजबूत चिन स्ट्रैप के साथ IS 2925 अनुमोदित औद्योगिक सुरक्षा हेलमेट पहनें',
        isCorrect: true,
        consequenceEn: 'Correct action! Helmet absorbs impact shock and shields the head against overhead mechanical hazards.',
        consequenceHi: 'सही कार्रवाई! हेलमेट प्रभाव को सोखता है और सिर को गिरने वाली वस्तुओं से बचाता है।'
      },
      {
        id: 'opt-helmet-wrong1',
        textEn: 'Enter machine area wearing a cloth baseball cap',
        textHi: 'कपड़े की बेसबॉल टोपी पहनकर मशीनरी क्षेत्र में प्रवेश करें',
        isCorrect: false,
        consequenceEn: 'DANGER: Cloth caps offer ZERO impact absorption or penetration resistance against falling objects! Penalty incurred.',
        consequenceHi: 'खतरा: कपड़े की टोपी गिरने वाली वस्तुओं से बिल्कुल सुरक्षा नहीं देती! जुर्माना लगा।',
        penaltyScore: -5
      },
      {
        id: 'opt-helmet-wrong2',
        textEn: 'Ignore head protection because overhead crane is stationary',
        textHi: 'हेलमेट न पहनें क्योंकि क्रेन अभी नहीं चल रही है',
        isCorrect: false,
        consequenceEn: 'VIOLATION: Industrial regulations mandate continuous head protection inside all active workshop bays.',
        consequenceHi: 'उल्लंघन: कार्यशाला क्षेत्र में हर समय सुरक्षा हेलमेट पहनना अनिवार्य है।',
        penaltyScore: -5
      }
    ]
  },

  'worker-vest': {
    id: 'worker-vest',
    titleEn: 'Missing High-Visibility Reflective Vest',
    titleHi: 'रिफ्लेक्टिव सुरक्षा जैकेट न होना',
    categoryEn: 'Personal Protective Equipment',
    categoryHi: 'व्यक्तिगत सुरक्षा उपकरण',
    severity: 'Medium',
    standardEn: 'IS 15809 (High-Visibility Warning Garments)',
    standardHi: 'IS 15809 (उच्च-दृश्यता सुरक्षा कपड़े)',
    riskDescriptionEn: 'Worker attire lacks fluorescent background and retro-reflective bands required in shared pedestrian and industrial vehicle pathways.',
    riskDescriptionHi: 'श्रमिक के कपड़ों में रिफ्लेक्टिव पट्टियां नहीं हैं, जिससे कम रोशनी में वाहन चालकों को श्रमिक दिखाई नहीं देगा।',
    isCompliantControl: false,
    choices: [
      {
        id: 'opt-vest-correct',
        textEn: 'Don IS 15809 Class 2 orange vest with 50mm retro-reflective stripes',
        textHi: '50mm रिफ्लेक्टिव पट्टियों वाली IS 15809 क्लास 2 नारंगी सुरक्षा जैकेट पहनें',
        isCorrect: true,
        consequenceEn: 'Correct action! Worker is now clearly visible from 360 degrees to all forklift and machine drivers.',
        consequenceHi: 'सही कार्रवाई! अब वर्कर सभी दिशाओं से वाहन चालकों को स्पष्ट दिखाई देगा।'
      },
      {
        id: 'opt-vest-wrong1',
        textEn: 'Wear dark clothing and walk in shadow zones',
        textHi: 'काले कपड़े पहनकर छायादार क्षेत्र में चलें',
        isCorrect: false,
        consequenceEn: 'SEVERE COLLISION HAZARD: In dark attire, forklift operators cannot spot workers in time to brake!',
        consequenceHi: 'टक्कर का गंभीर खतरा: गहरे कपड़ों में फोर्कलिफ्ट ऑपरेटर आपको समय पर नहीं देख पाएंगे!',
        penaltyScore: -5
      }
    ]
  },

  'exposed-wire': {
    id: 'exposed-wire',
    titleEn: 'Exposed 440V Live Feeder Cable',
    titleHi: 'खुली 440V बिजली की नंगी केबल',
    categoryEn: 'Electrical Hazard',
    categoryHi: 'विद्युत खतरा',
    severity: 'Critical',
    standardEn: 'CEA Regulations 2010 (Measures Relating to Safety)',
    standardHi: 'CEA विनियम 2010 (विद्युत सुरक्षा उपाय)',
    riskDescriptionEn: 'Damaged insulation on 3-phase 440V power cable lying directly on floor. Creates severe electrocution, flashover, and arcing fire risks.',
    riskDescriptionHi: 'फर्श पर 440V की तीन-फेज केबल कटी हुई पड़ी है। इससे जानलेवा करंट लगने, स्पार्क और आग का गंभीर खतरा है।',
    isCompliantControl: false,
    choices: [
      {
        id: 'opt-wire-correct',
        textEn: 'Apply Lockout/Tagout (LOTO), isolate upstream, and enclose inside grounded conduit',
        textHi: 'LOTO लगाएं, मुख्य बिजली काटें और केबल को अर्थिंग वाले मजबूत पाइप में बंद करें',
        isCorrect: true,
        consequenceEn: 'Correct action! Power is safely locked out and the cable is enclosed inside industrial protective conduit.',
        consequenceHi: 'सही कार्रवाई! बिजली सुरक्षित रूप से बंद कर दी गई और केबल को सुरक्षा पाइप में सील कर दिया गया।'
      },
      {
        id: 'opt-wire-wrong1',
        textEn: 'Touch or nudge the live cable with bare hands or boot',
        textHi: 'नंगे हाथों या जूतों से नंगी केबल को एक तरफ हटाने का प्रयास करें',
        isCorrect: false,
        consequenceEn: 'CRITICAL DANGER: Direct contact with 440V produces fatal electric shock and severe arc blast! Incurred severe penalty.',
        consequenceHi: 'जानलेवा खतरा: 440V को छूने से तुरंत जानलेवा करंट और भयानक शॉक लगेगा! भारी पेनल्टी।',
        penaltyScore: -10
      },
      {
        id: 'opt-wire-wrong2',
        textEn: 'Cover sparking cable with dry cardboard',
        textHi: 'चिंगारी निकलती केबल को गत्ते के डिब्बे से ढक दें',
        isCorrect: false,
        consequenceEn: 'FIRE HAZARD: Electrical sparking ignites flammable cardboard within seconds!',
        consequenceHi: 'आग का खतरा: बिजली की चिंगारी से गत्ते में तुरंत आग लग जाएगी!',
        penaltyScore: -5
      }
    ]
  },

  'unsafe-barrier': {
    id: 'unsafe-barrier',
    titleEn: 'Missing Machinery Perimeter Barrier',
    titleHi: 'मशीन सुरक्षा रेलिंग का अभाव',
    categoryEn: 'Machinery Guarding',
    categoryHi: 'मशीनरी सुरक्षा',
    severity: 'High',
    standardEn: 'IS 9474 (Safety Guarding of Machinery)',
    standardHi: 'IS 9474 (मशीनरी की सुरक्षा फेंसिंग)',
    riskDescriptionEn: 'Absence of physical perimeter barricade permits inadvertent entry into rotating pinch-point radius and moving mechanical components.',
    riskDescriptionHi: 'सुरक्षा रेलिंग न होने से कोई भी व्यक्ति गलती से चलती मशीन के पहियों या पिंच पॉइंट के संपर्क में आ सकता है।',
    isCompliantControl: false,
    choices: [
      {
        id: 'opt-barrier-correct',
        textEn: 'Erect fixed perimeter safety barrier with warning signage at 1.5m clearance',
        textHi: '1.5 मीटर की दूरी पर चेतावनी बोर्ड के साथ मजबूत सुरक्षा रेलिंग लगाएं',
        isCorrect: true,
        consequenceEn: 'Correct action! Guard barrier physically prevents workers from slipping or falling into rotating machine elements.',
        consequenceHi: 'सही कार्रवाई! सुरक्षा रेलिंग श्रमिकों को मशीन के खतरनाक हिस्सों में जाने से रोकती है।'
      },
      {
        id: 'opt-barrier-wrong1',
        textEn: 'Leave perimeter unbarricaded and tell workers to be careful',
        textHi: 'रेलिंग न लगाएं और केवल श्रमिकों से ध्यान रखने को कहें',
        isCorrect: false,
        consequenceEn: 'SAFETY VIOLATION: Statutory standards require physical engineering controls, not just verbal warnings.',
        consequenceHi: 'सुरक्षा उल्लंघन: मौखिक चेतावनी पर्याप्त नहीं है; भौतिक रेलिंग लगाना कानूनी रूप से अनिवार्य है।',
        penaltyScore: -5
      }
    ]
  },

  'worker-boots': {
    id: 'worker-boots',
    titleEn: 'Approved Steel-Toe Safety Boots (Compliant Control)',
    titleHi: 'प्रमाणित स्टील-टो सुरक्षा जूते (सुरक्षित)',
    categoryEn: 'Personal Protective Equipment',
    categoryHi: 'व्यक्तिगत सुरक्षा उपकरण',
    severity: 'Low',
    standardEn: 'IS 15298 (Safety Footwear)',
    standardHi: 'IS 15298 (सुरक्षा जूते)',
    riskDescriptionEn: 'Worker is wearing certified steel-toe, puncture-resistant, oil-resistant safety footwear with non-slip soles.',
    riskDescriptionHi: 'श्रमिक ने प्रमाणित स्टील-टो और फिसलन-रोधी सुरक्षा जूते पहने हुए हैं।',
    isCompliantControl: true,
    choices: [
      {
        id: 'opt-boots-correct',
        textEn: 'Confirm compliant safety control (No violation - Footwear conforms to IS 15298)',
        textHi: 'पुष्टि करें कि यह सुरक्षित और प्रमाणित है (कोई खतरा नहीं)',
        isCorrect: true,
        consequenceEn: 'Accurate observation! Certified safety boots protect against dropped objects and puncture wounds.',
        consequenceHi: 'सही अवलोकन! प्रमाणित सुरक्षा जूते पूरी तरह सही हैं और इन्हें बदलने की आवश्यकता नहीं है।'
      },
      {
        id: 'opt-boots-wrong',
        textEn: 'Report as violation and ask worker to change into sneakers',
        textHi: 'इसे खतरा मानकर रिपोर्ट करें और कपड़े के जूते पहनने को कहें',
        isCorrect: false,
        consequenceEn: 'INCORRECT: Steel-toe boots are compliant! Standard sneakers are prohibited in industrial bays.',
        consequenceHi: 'गलत: स्टील-टो जूते पूरी तरह वैध हैं! साधारण जूते पहनना प्रतिबंधित है।',
        penaltyScore: -5
      }
    ]
  },

  // Scenario 2/3: Electrical Substation Hazards
  'elec-exposed-cable': {
    id: 'elec-exposed-cable',
    titleEn: 'Live Exposed 440V Cable',
    titleHi: 'खुली लाइव 440V बिजली केबल',
    categoryEn: 'Electrical Hazard',
    categoryHi: 'विद्युत खतरा',
    severity: 'Critical',
    standardEn: 'CEA Regulation 30 & IS 732',
    standardHi: 'CEA विनियम 30 और IS 732',
    riskDescriptionEn: 'High-voltage feed conduit torn open with bare copper conductors exposed near transformer footings with severe flashover and arc blast risk.',
    riskDescriptionHi: 'ट्रांसफार्मर के पास 440V का केबल कटा हुआ है और नंगे तांबे के तार बाहर हैं। इससे भयानक आर्क फ्लैश और करंट का खतरा है।',
    isCompliantControl: false,
    choices: [
      {
        id: 'opt-elec1-correct',
        textEn: 'Isolate upstream main breaker, apply LOTO padlock, and attach warning tagout',
        textHi: 'मुख्य ब्रेकर बंद करें, LOTO पैडलॉक लगाएं और चेतावनी टैग लगाएं',
        isCorrect: true,
        consequenceEn: 'Correct action! De-energization and LOTO prevents accidental re-powering during repairs.',
        consequenceHi: 'सही कार्रवाई! LOTO लगाने से मरम्मत के दौरान कोई अन्य व्यक्ति बिजली चालू नहीं कर सकता।'
      },
      {
        id: 'opt-elec1-wrong1',
        textEn: 'Wrap standard household vinyl tape while the 440V line is fully live',
        textHi: 'चालू बिजली में साधारण टेप लपेटने का प्रयास करें',
        isCorrect: false,
        consequenceEn: 'CRITICAL SHOCK RISK: Working live on 440V without arc flash gear is life-threatening!',
        consequenceHi: 'घातक खतरा: 440V चालू लाइन पर बिना सुरक्षा काम करने से गंभीर करंट और जलन हो सकती है!',
        penaltyScore: -10
      }
    ]
  },

  'elec-wet-floor': {
    id: 'elec-wet-floor',
    titleEn: 'Conductive Water Pool in Switchgear Bay',
    titleHi: 'स्विचगियर के पास पानी भरा होना',
    categoryEn: 'Workplace Environment',
    categoryHi: 'कार्यस्थल वातावरण',
    severity: 'High',
    standardEn: 'IS 15652 (Electrical Insulating Mats)',
    standardHi: 'IS 15652 (इंसुलेटिंग रबर मैट)',
    riskDescriptionEn: 'Water accumulation across operator standing zone creates severe electrocution hazard if surface flashover occurs.',
    riskDescriptionHi: 'स्विचगियर के सामने पानी भरा होने से ऑपरेटर के शरीर से जमीन में करंट जाने का जानलेवा जोखिम है।',
    isCompliantControl: false,
    choices: [
      {
        id: 'opt-elec2-correct',
        textEn: 'De-energize board, deploy IS 15652 Class B insulating rubber mat, and remediate water leak',
        textHi: 'बिजली काटें, IS 15652 इंसुलेटिंग रबर मैट बिछाएं और पानी की निकासी ठीक करें',
        isCorrect: true,
        consequenceEn: 'Correct action! Insulating mats provide certified dielectric breakdown resistance up to 33kV.',
        consequenceHi: 'सही कार्रवाई! इंसुलेटिंग रबर मैट ऑपरेटर को जमीन में करंट जाने से पूर्ण सुरक्षा प्रदान करती है।'
      },
      {
        id: 'opt-elec2-wrong1',
        textEn: 'Mop with a wet cotton mop while switchgear is energized',
        textHi: 'बिजली चालू रहते हुए गीले पोछे से पानी साफ करने का प्रयास करें',
        isCorrect: false,
        consequenceEn: 'DANGER: Wet mops conduct current directly into the operator hands! Severe shock risk.',
        consequenceHi: 'खतरा: गीला पोछा बिजली का सुचालक है और हाथों में सीधा करंट लग सकता है!',
        penaltyScore: -10
      }
    ]
  },

  'elec-missing-gloves': {
    id: 'elec-missing-gloves',
    titleEn: 'Worker Lacks Dielectric Insulating Gloves',
    titleHi: 'इंसुलेटिंग रबर दस्ताने न होना',
    categoryEn: 'Personal Protective Equipment',
    categoryHi: 'व्यक्तिगत सुरक्षा उपकरण',
    severity: 'High',
    standardEn: 'IS 4770 (Dielectric Gloves)',
    standardHi: 'IS 4770 (डाइइलेक्ट्रिक ग्लव्स)',
    riskDescriptionEn: 'Technician reaching towards 440V panel door barehanded without 1000V rated dielectric insulating gloves or arc shield.',
    riskDescriptionHi: 'तकनीशियन बिना इन्सुलेटिंग दस्तानों के नंगे हाथों से 440V पैनल का स्विच छू रहा है।',
    isCompliantControl: false,
    choices: [
      {
        id: 'opt-elec3-correct',
        textEn: 'Don certified IS 4770 Class 0 dielectric gloves and arc-flash face shield',
        textHi: 'प्रमाणित IS 4770 क्लास 0 इंसुलेटिंग दस्ताने और आर्क-फ्लैश फेस शील्ड पहनें',
        isCorrect: true,
        consequenceEn: 'Correct action! Dielectric gloves shield technicians from high-voltage contact and arc flash burns.',
        consequenceHi: 'सही कार्रवाई! इन्सुलेटिंग दस्ताने तकनीशियन को करंट और आर्क फ्लैश से सुरक्षित रखते हैं।'
      },
      {
        id: 'opt-elec3-wrong1',
        textEn: 'Use thin household cotton gloves to flip the breaker',
        textHi: 'पतले सूती दस्ताने पहनकर ब्रेकर चलाने का प्रयास करें',
        isCorrect: false,
        consequenceEn: 'INSUFFICIENT PROTECTION: Cotton gloves offer ZERO electrical insulation against 440V.',
        consequenceHi: 'अपर्याप्त सुरक्षा: सूती दस्ताने 440V करंट से कोई सुरक्षा नहीं देते।',
        penaltyScore: -5
      }
    ]
  },

  'elec-blocked-sign': {
    id: 'elec-blocked-sign',
    titleEn: 'Obstructed High-Voltage Placard',
    titleHi: 'खतरे का बोर्ड छिपा होना',
    categoryEn: 'Signage & Demarcation',
    categoryHi: 'संकेत और सीमांकन',
    severity: 'Medium',
    standardEn: 'IS 2551 (Danger Notice Plates)',
    standardHi: 'IS 2551 (खतरा सूचना पट्टिकाएं)',
    riskDescriptionEn: 'Statutory 440V Danger signboard is obscured by leaning toolboxes and scrap debris.',
    riskDescriptionHi: '440V का लाल खतरा बोर्ड कबाड़ और बक्सों के पीछे छिपा हुआ है।',
    isCompliantControl: false,
    choices: [
      {
        id: 'opt-elec4-correct',
        textEn: 'Clear debris and restore unobstructed line-of-sight to the statutory danger signboard',
        textHi: 'सामान हटाएं और खतरे के बोर्ड को सभी के लिए स्पष्ट रूप से दृश्यमान बनाएं',
        isCorrect: true,
        consequenceEn: 'Correct action! Statutory danger notice must remain visible from all approach angles.',
        consequenceHi: 'सही कार्रवाई! सांविधिक खतरा बोर्ड हर दिशा से साफ दिखाई देना चाहिए।'
      },
      {
        id: 'opt-elec4-wrong1',
        textEn: 'Leave it covered since workers already know where the panel is',
        textHi: 'इसे ढका रहने दें क्योंकि श्रमिक पहले से जानते हैं',
        isCorrect: false,
        consequenceEn: 'VIOLATION: Visitors and emergency personnel rely on clear placards to identify hazard boundaries.',
        consequenceHi: 'उल्लंघन: नए कर्मचारी और बचाव दल चेतावनी बोर्ड देखकर ही सतर्क होते हैं।',
        penaltyScore: -5
      }
    ]
  },

  'elec-safe-box': {
    id: 'elec-safe-box',
    titleEn: 'Grounded Distribution Cabinet (Compliant Control)',
    titleHi: 'अर्थिंग किया हुआ कैबिनेट (सुरक्षित नियंत्रण)',
    categoryEn: 'Electrical Safety',
    categoryHi: 'विद्युत सुरक्षा',
    severity: 'Low',
    standardEn: 'IS 3043 (Code of Practice for Earthing)',
    standardHi: 'IS 3043 (अर्थिंग अभ्यास संहिता)',
    riskDescriptionEn: 'This distribution cabinet has verified dual copper grounding strips with continuity tags per CEA regulations.',
    riskDescriptionHi: 'इस कैबिनेट में CEA नियमों के अनुसार तांबे की दोहरी अर्थिंग पट्टी लगी हुई है।',
    isCompliantControl: true,
    choices: [
      {
        id: 'opt-elec5-correct',
        textEn: 'Confirm compliant grounded control (No action needed - Earth continuity verified)',
        textHi: 'पुष्टि करें कि अर्थिंग सही है (कोई खतरा नहीं)',
        isCorrect: true,
        consequenceEn: 'Correct observation! Certified dual earthing provides a low-impedance ground path preventing touch voltage hazards.',
        consequenceHi: 'सही अवलोकन! दोहरी अर्थिंग ऑपरेटर को कैबिनेट छूने पर करंट लगने से बचाती है।'
      },
      {
        id: 'opt-elec5-wrong',
        textEn: 'Disconnect the copper earthing strip',
        textHi: 'तांबे की अर्थिंग पट्टी को खोलकर अलग कर दें',
        isCorrect: false,
        consequenceEn: 'CRITICAL VIOLATION: Disconnecting safety grounds leaves the metal enclosure live during internal faults!',
        consequenceHi: 'गंभीर उल्लंघन: अर्थिंग हटाने पर किसी भी खराबी में पूरी धातु की बॉडी में करंट फैल जाएगा!',
        penaltyScore: -10
      }
    ]
  },

  // Scenario 2/3: Fire Emergency Hazards
  'fire-active-blaze': {
    id: 'fire-active-blaze',
    titleEn: 'Active Class B/C Machinery Fire',
    titleHi: 'सक्रिय औद्योगिक आग',
    categoryEn: 'Fire Emergency',
    categoryHi: 'अग्नि आपातकाल',
    severity: 'Critical',
    standardEn: 'IS 15683 / NFPA 10 (Fire Extinguishers)',
    standardHi: 'IS 15683 / NFPA 10 (अग्निशामक मानक)',
    riskDescriptionEn: 'Electrical equipment oil ignition producing open flames and dense smoke plume with extreme radiant thermal heat.',
    riskDescriptionHi: 'विद्युत उपकरण में तेल की आग से लपटें और जहरीला धुआं निकल रहा है।',
    isCompliantControl: false,
    choices: [
      {
        id: 'opt-fire1-correct',
        textEn: 'Pull pin, aim at base of fire, squeeze lever, sweep side-to-side using ABC/DCP extinguisher',
        textHi: 'P.A.S.S. नियम से ABC/DCP अग्निशामक चलाएं: पिन खींचें, आधार पर निशाना साधें और छिड़कें',
        isCorrect: true,
        consequenceEn: 'Correct action! P.A.S.S. protocol with Dry Chemical Powder smothers the flames without risk of electrical conduction.',
        consequenceHi: 'सही कार्रवाई! DCP पाउडर से आग बुझ गई और बिजली के करंट का कोई खतरा नहीं हुआ।'
      },
      {
        id: 'opt-fire1-wrong1',
        textEn: 'Pour a bucket of water onto the electrical fire',
        textHi: 'विद्युत आग पर पानी की बाल्टी फेंकें',
        isCorrect: false,
        consequenceEn: 'FATAL RISK: Water conducts high voltage directly through the stream, causing severe electrocution and steam explosion!',
        consequenceHi: 'घातक खतरा: पानी बिजली का सुचालक है! पानी डालने से करंट का झटका लगेगा और विस्फोट हो सकता है!',
        penaltyScore: -10
      },
      {
        id: 'opt-fire1-wrong2',
        textEn: 'Stand very close and try to blow out the flames with breath',
        textHi: 'आग के पास खड़े होकर फूंक मारकर बुझाने का प्रयास करें',
        isCorrect: false,
        consequenceEn: 'EXTREME RISK: Radiant heat causes facial burns and toxic smoke inhalation!',
        consequenceHi: 'अत्यधिक खतरा: चेहरे पर जलन और धुएं से दम घुटने का गंभीर जोखिम!',
        penaltyScore: -5
      }
    ]
  },

  'fire-blocked-exit': {
    id: 'fire-blocked-exit',
    titleEn: 'Obstructed Emergency Egress Route',
    titleHi: 'इमरजेंसी निकास द्वार पर रुकावट',
    categoryEn: 'Emergency Evacuation',
    categoryHi: 'आपातकालीन निकासी',
    severity: 'High',
    standardEn: 'IS 2190 & Factories Act 1948 Section 38',
    standardHi: 'IS 2190 और कारखाना अधिनियम 1948 धारा 38',
    riskDescriptionEn: 'Heavy wooden pallets and scrap crates stacked directly against the green emergency push-bar exit door.',
    riskDescriptionHi: 'इमरजेंसी फायर एग्जिट दरवाजे के सामने लकड़ी के भारी बक्से रखे हैं, जिससे रास्ता बंद है।',
    isCompliantControl: false,
    choices: [
      {
        id: 'opt-fire2-correct',
        textEn: 'Immediately remove all crates and clear minimum 2-meter egress route to the fire exit',
        textHi: 'सारे बक्से तुरंत हटाएं और निकास द्वार तक 2 मीटर चौड़ा रास्ता पूरी तरह खाली करें',
        isCorrect: true,
        consequenceEn: 'Correct action! Exit door is fully unblocked and ready for immediate evacuation.',
        consequenceHi: 'सही कार्रवाई! निकास द्वार अब पूरी तरह खुल गया है और निकासी के लिए तैयार है।'
      },
      {
        id: 'opt-fire2-wrong1',
        textEn: 'Leave the crates and tell workers to climb over them during fire',
        textHi: 'बक्से वहीं रहने दें और कहें कि आग लगने पर कूदकर बाहर निकलें',
        isCorrect: false,
        consequenceEn: 'SEVERE LIFE THREAT: In smoke and panic, climbing over crates causes crushing, falls, and fatal pile-ups!',
        consequenceHi: 'गंभीर खतरा: धुएं और भगदड़ में बक्सों पर चढ़ने से लोग गिरकर कुचल सकते हैं!',
        penaltyScore: -5
      }
    ]
  },

  'fire-alarm-pull': {
    id: 'fire-alarm-pull',
    titleEn: 'Unactivated Manual Break-Glass Alarm',
    titleHi: 'फायर अलार्म न बजाना',
    categoryEn: 'Emergency Response',
    categoryHi: 'आपातकालीन प्रतिक्रिया',
    severity: 'High',
    standardEn: 'IS 2189 (Fire Alarm Systems)',
    standardHi: 'IS 2189 (फायर अलार्म प्रणाली)',
    riskDescriptionEn: 'Manual alarm call point has not been triggered to warn all workshop sections and summon the plant emergency response team.',
    riskDescriptionHi: 'आपातकालीन मैनुअल कॉल पॉइंट को दबाया नहीं गया है, जिससे अन्य कमरों में मौजूद लोगों को आग का पता नहीं चला।',
    isCompliantControl: false,
    choices: [
      {
        id: 'opt-fire3-correct',
        textEn: 'Strike manual call point break-glass to sound plant-wide evacuation sirens immediately',
        textHi: 'मैनुअल कॉल पॉइंट दबाकर तुरंत पूरे संयंत्र में निकासी सायरन बजाएं',
        isCorrect: true,
        consequenceEn: 'Correct action! Sirens alert all workers to evacuate and dispatch industrial firefighters.',
        consequenceHi: 'सही कार्रवाई! सायरन बजने से सभी कर्मचारी सतर्क हो गए और बचाव दल रवाना हुआ।'
      },
      {
        id: 'opt-fire3-wrong1',
        textEn: 'Wait until the fire becomes huge before alerting anyone',
        textHi: 'आग के बहुत बड़ा होने तक किसी को न बताएं',
        isCorrect: false,
        consequenceEn: 'FATAL DELAY: Evacuation alarms must be triggered at the incipient stage!',
        consequenceHi: 'जानलेवा देरी: आग की शुरुआत में ही अलार्म बजाना कानूनी नियम है!',
        penaltyScore: -5
      }
    ]
  },

  'fire-worker-evac': {
    id: 'fire-worker-evac',
    titleEn: 'Disoriented Worker in Smoke Zone',
    titleHi: 'धुएं में फंसा हुआ श्रमिक',
    categoryEn: 'Life Safety',
    categoryHi: 'जीवन सुरक्षा',
    severity: 'High',
    standardEn: 'DGMS Emergency Evacuation Protocols',
    standardHi: 'DGMS आपातकालीन निकासी प्रोटोकॉल',
    riskDescriptionEn: 'Coughing worker trapped in smoke corridor without navigation assistance or smoke hood.',
    riskDescriptionHi: 'श्रमिक धुएं में रास्ता भूलकर खांस रहा है और बाहर निकलने में असमर्थ है।',
    isCompliantControl: false,
    choices: [
      {
        id: 'opt-fire4-correct',
        textEn: 'Direct worker along floor egress line towards the unblocked exit to safe muster assembly point',
        textHi: 'श्रमिक को फर्श की हरी निकास पट्टी के साथ बाहर सुरक्षित असेंबली पॉइंट पर ले जाएं',
        isCorrect: true,
        consequenceEn: 'Correct action! Worker is guided safely outside to the muster zone for headcount verification.',
        consequenceHi: 'सही कार्रवाई! श्रमिक सुरक्षित रूप से बाहर असेंबली पॉइंट पर पहुंच गया।'
      },
      {
        id: 'opt-fire4-wrong1',
        textEn: 'Tell the worker to hide inside an enclosed storeroom',
        textHi: 'श्रमिक को एक बंद स्टोररूम में छिपने के लिए कहें',
        isCorrect: false,
        consequenceEn: 'CRITICAL TRAP: Hiding in rooms leads to asphyxiation from carbon monoxide gas!',
        consequenceHi: 'गंभीर खतरा: कमरे में छिपने से जहरीली गैस से दम घुट जाएगा!',
        penaltyScore: -10
      }
    ]
  },

  'fire-blanket-box': {
    id: 'fire-blanket-box',
    titleEn: 'Certified Fire Blanket Station (Compliant Control)',
    titleHi: 'फायर ब्लैंकेट स्टेशन (सुरक्षित)',
    categoryEn: 'Fire Equipment',
    categoryHi: 'अग्निशमन उपकरण',
    severity: 'Low',
    standardEn: 'IS 15381 (Fire Blankets)',
    standardHi: 'IS 15381 (फायर ब्लैंकेट)',
    riskDescriptionEn: 'Wall-mounted fiberglass fire blanket is sealed, certified, and fully accessible.',
    riskDescriptionHi: 'दीवार पर लगा फायर ब्लैंकेट बॉक्स पूरी तरह प्रमाणित और आपातकाल के लिए तैयार है।',
    isCompliantControl: true,
    choices: [
      {
        id: 'opt-fire5-correct',
        textEn: 'Confirm compliant fire safety installation (No action needed - Fully operational)',
        textHi: 'पुष्टि करें कि यह प्रमाणित अग्निशमन उपकरण है (कोई खतरा नहीं)',
        isCorrect: true,
        consequenceEn: 'Correct observation! Fire blankets are compliant emergency gear used to smother clothing flames.',
        consequenceHi: 'सही अवलोकन! यह जीवन रक्षक उपकरण है और इसे हटाने की आवश्यकता नहीं है।'
      },
      {
        id: 'opt-fire5-wrong',
        textEn: 'Remove fire blanket and use it to mop oil spills',
        textHi: 'फायर ब्लैंकेट निकालकर उससे फर्श का तेल पोंछें',
        isCorrect: false,
        consequenceEn: 'VIOLATION: Fire equipment must never be misused or removed from emergency enclosures.',
        consequenceHi: 'उल्लंघन: आपातकालीन सुरक्षा उपकरणों का दुरुपयोग प्रतिबंधित है।',
        penaltyScore: -5
      }
    ]
  },

  'fire-dcp-extinguisher': {
    id: 'fire-dcp-extinguisher',
    titleEn: 'IS 15683 6kg DCP Fire Extinguisher (Compliant Equipment)',
    titleHi: 'IS 15683 6kg डीसीपी अग्निशामक (सुरक्षित उपकरण)',
    categoryEn: 'Fire Equipment',
    categoryHi: 'अग्निशमन उपकरण',
    severity: 'Low',
    standardEn: 'IS 15683 (Portable Fire Extinguishers)',
    standardHi: 'IS 15683 (पोर्टेबल अग्निशामक)',
    riskDescriptionEn: 'Wall-mounted 6kg Dry Chemical Powder (ABC) extinguisher charged with nitrogen pressure needle strictly in the green operating zone.',
    riskDescriptionHi: 'दीवार पर लगा 6 किलो का सूखा रासायनिक पाउडर (ABC) अग्निशामक चालू हालत में है। यह जीवन रक्षक उपकरण है।',
    isCompliantControl: true,
    choices: [
      {
        id: 'opt-dcp-correct',
        textEn: 'Confirm compliant fire safety equipment (No violation - Ready for emergency response)',
        textHi: 'पुष्टि करें कि यह प्रमाणित अग्निशामक यंत्र है (कोई उल्लंघन नहीं - आपातकाल के लिए तैयार)',
        isCorrect: true,
        consequenceEn: 'Correct observation! Certified fire extinguishers are vital life safety controls and should remain mounted and accessible.',
        consequenceHi: 'सही अवलोकन! यह जीवन रक्षक उपकरण है और इसे हटाने की आवश्यकता नहीं है।'
      },
      {
        id: 'opt-dcp-wrong',
        textEn: 'Discharge extinguisher without fire or block it with storage boxes',
        textHi: 'अग्निशामक को बिना कारण खाली करें या इसके आगे बक्से रखकर ब्लॉक करें',
        isCorrect: false,
        consequenceEn: 'VIOLATION: Tampering with or blocking emergency fire apparatus is a serious statutory violation under the Indian Factories Act.',
        consequenceHi: 'उल्लंघन: आपातकालीन अग्निशामक उपकरण से छेड़छाड़ करना या रास्ता रोकना गैरकानूनी है।',
        penaltyScore: -5
      }
    ]
  },

  // Scenario 4: Mining Safety Hazards
  'mine-haulage-blindspot': {
    id: 'mine-haulage-blindspot',
    titleEn: 'Pedestrian in 35T Dumper Turning Radius',
    titleHi: 'डंपर के ब्लाइंड स्पॉट में श्रमिक',
    categoryEn: 'Mining Vehicle Safety',
    categoryHi: 'खनन वाहन सुरक्षा',
    severity: 'Critical',
    standardEn: 'DGMS Coal Mines Regulations 2017 Reg 104',
    standardHi: 'DGMS कोल माइन्स विनियम 2017 नियम 104',
    riskDescriptionEn: 'Worker standing within rear 6-meter turning radius of an active 35-tonne diesel mining haul truck. Driver has zero visibility in this blind sector.',
    riskDescriptionHi: 'श्रमिक 35-टन भारी डंपर के ठीक पीछे खड़ा है जहां ड्राइवर को कुछ नहीं दिखता। कुचले जाने का जानलेवा खतरा।',
    isCompliantControl: false,
    choices: [
      {
        id: 'opt-mine1-correct',
        textEn: 'Direct worker immediately into designated refuge bay and maintain minimum 15m clearance',
        textHi: 'श्रमिक को तुरंत रिफ्यूज बे (सुरक्षित कोने) में भेजें और डंपर से 15 मीटर की दूरी रखें',
        isCorrect: true,
        consequenceEn: 'Correct action! Worker is relocated to a secure refuge bay shielded from mobile mining machinery.',
        consequenceHi: 'सही कार्रवाई! श्रमिक अब सुरक्षित रिफ्यूज बे में है जहां वाहन उसे नुकसान नहीं पहुंचा सकते।'
      },
      {
        id: 'opt-mine1-wrong1',
        textEn: 'Instruct worker to stay near the rear tires while dumper is reversing',
        textHi: 'डंपर के बैक होते समय पिछले टायर के पास खड़े रहने को कहें',
        isCorrect: false,
        consequenceEn: 'FATAL CRUSH RISK: Dumper tires can crush personnel instantly with zero braking reaction time!',
        consequenceHi: 'जानलेवा खतरा: भारी डंपर के टायर के नीचे आने से तुरंत मृत्यु हो सकती है!',
        penaltyScore: -10
      }
    ]
  },

  'mine-unstable-roof': {
    id: 'mine-unstable-roof',
    titleEn: 'Unsupported Strata / Loose Hanging Wall',
    titleHi: 'खदान की कमजोर छत (Roof Fall का खतरा)',
    categoryEn: 'Strata Control & Ground Safety',
    categoryHi: 'छत नियंत्रण और भू-सुरक्षा',
    severity: 'Critical',
    standardEn: 'DGMS Reg 123 & Strata Control Management Plan (SCMP)',
    standardHi: 'DGMS नियम 123 और SCMP (छत नियंत्रण योजना)',
    riskDescriptionEn: 'Visible fracture plane in underground coal ceiling with absent resin rock bolts. Imminent danger of rock fall and mass strata collapse.',
    riskDescriptionHi: 'कोयले की छत में गहरी दरार है और कोई रूफ बोल्ट नहीं लगा है। छत गिरने से मलबे में दबने का भयानक खतरा है।',
    isCompliantControl: false,
    choices: [
      {
        id: 'opt-mine2-correct',
        textEn: 'Tag zone as "UNSAFE ROOF - NO ENTRY" and install certified hydraulic support prop',
        textHi: '"खतरनाक छत - प्रवेश निषेध" का टैग लगाएं और हाइड्रोलिक सपोर्ट प्रॉप लगाएं',
        isCorrect: true,
        consequenceEn: 'Correct action! Temporary hydraulic prop stabilizes loose strata and prevents catastrophic ceiling collapse.',
        consequenceHi: 'सही कार्रवाई! सपोर्ट प्रॉप लगाने से छत सुरक्षित हो गई और ढहने का खतरा टल गया।'
      },
      {
        id: 'opt-mine2-wrong1',
        textEn: 'Stand directly underneath the crack and strike it with a hammer to test it',
        textHi: 'दरार के ठीक नीचे खड़े होकर हथौड़े से चोट मारकर जांच करें',
        isCorrect: false,
        consequenceEn: 'FATAL STRATA COLLAPSE: Vibrations from striking loose roof cause instant collapse onto the worker!',
        consequenceHi: 'जानलेवा खतरा: कमजोर छत पर चोट मारने से पूरी चट्टान तुरंत नीचे गिर जाएगी!',
        penaltyScore: -10
      }
    ]
  },

  'mine-no-caplamp': {
    id: 'mine-no-caplamp',
    titleEn: 'Worker Lacks Approved Cap Lamp & Helmet',
    titleHi: 'अनुमोदित कैप लैंप और हेलमेट न होना',
    categoryEn: 'Mining PPE',
    categoryHi: 'खनन पीपीई',
    severity: 'High',
    standardEn: 'DGMS Approval Standard & IS 2925 Type II',
    standardHi: 'DGMS अनुमोदन मानक और IS 2925 टाइप II',
    riskDescriptionEn: 'Worker entering dark drift gallery lacking intrinsically safe LED cap lamp and chin-strap mining helmet.',
    riskDescriptionHi: 'श्रमिक बिना फ्लेमप्रूफ कैप लैंप और हेलमेट के अंधेरी खदान गैलरी में प्रवेश कर रहा है।',
    isCompliantControl: false,
    choices: [
      {
        id: 'opt-mine3-correct',
        textEn: 'Equip DGMS tested intrinsically safe LED cap lamp and Type II mining helmet',
        textHi: 'DGMS अनुमोदित फ्लेमप्रूफ LED कैप लैंप और टाइप II माइनिंग हेलमेट प्रदान करें',
        isCorrect: true,
        consequenceEn: 'Correct action! Intrinsically safe lamp illuminates hazards without risking methane ignition.',
        consequenceHi: 'सही कार्रवाई! फ्लेमप्रूफ लैंप से रास्ता दिखेगा और मीथेन गैस में आग लगने का जोखिम नहीं होगा।'
      },
      {
        id: 'opt-mine3-wrong1',
        textEn: 'Light a wax candle or open flame torch for visibility',
        textHi: 'रोशनी के लिए मोमबत्ती या खुली आग जलाएं',
        isCorrect: false,
        consequenceEn: 'CATASTROPHIC METHANE EXPLOSION: Naked flames underground cause instant firedamp explosions!',
        consequenceHi: 'भयानक विस्फोट: खदान में खुली आग जलाने से मीथेन गैस में भयंकर विस्फोट हो जाएगा!',
        penaltyScore: -10
      }
    ]
  },

  'mine-missing-sign': {
    id: 'mine-missing-sign',
    titleEn: 'Missing DGMS Statutory Danger Board',
    titleHi: 'DGMS खतरा बोर्ड न होना',
    categoryEn: 'Mine Demarcation',
    categoryHi: 'खदान सीमांकन',
    severity: 'High',
    standardEn: 'Coal Mines Regulations 2017',
    standardHi: 'कोल माइन्स विनियम 2017',
    riskDescriptionEn: 'Unventilated blind roadway or abandoned goaf lacks reflective bilingual "KHATRA / DANGER" barrier gate.',
    riskDescriptionHi: 'बंद या बिना हवा वाली गैलरी पर कोई लाल खतरा बैरियर नहीं है, जहां जहरीली गैस भरी हो सकती है।',
    isCompliantControl: false,
    choices: [
      {
        id: 'opt-mine4-correct',
        textEn: 'Erect chain link barricade gate with bilingual DGMS "KHATRA / DANGER" warning placard',
        textHi: 'द्विभाषी DGMS "खतरा / DANGER" चेतावनी बोर्ड के साथ मजबूत बैरिकेड लगाएं',
        isCorrect: true,
        consequenceEn: 'Correct action! Physical gate prevents miners from wandering into suffocating abandoned goaf zones.',
        consequenceHi: 'सही कार्रवाई! बैरिकेड से कोई भी श्रमिक गलती से जहरीली गैस वाले क्षेत्र में नहीं जा पाएगा।'
      },
      {
        id: 'opt-mine4-wrong1',
        textEn: 'Leave the opening unfenced so workers can explore the old workings',
        textHi: 'रास्ता खुला रहने दें ताकि श्रमिक पुरानी खदान में जा सकें',
        isCorrect: false,
        consequenceEn: 'ASPHYXIATION HAZARD: Abandoned workings contain lethal black damp with near-zero oxygen!',
        consequenceHi: 'दम घुटने का खतरा: पुरानी खदान में ऑक्सीजन नहीं होती और कुछ ही सेकंड में मौत हो सकती है!',
        penaltyScore: -5
      }
    ]
  },

  'mine-vent-duct': {
    id: 'mine-vent-duct',
    titleEn: 'Auxiliary Mine Ventilation Duct (Compliant Control)',
    titleHi: 'खदान वेंटिलेशन डक्ट (सुरक्षित नियंत्रण)',
    categoryEn: 'Ventilation Safety',
    categoryHi: 'वायु संवातन सुरक्षा',
    severity: 'Low',
    standardEn: 'DGMS Regulation 153 (Standards of Ventilation)',
    standardHi: 'DGMS विनियम 153 (संवातन मानक)',
    riskDescriptionEn: 'Flameproof flexible ventilation duct delivering positive fresh airflow to the working coal face per statutory standards.',
    riskDescriptionHi: 'यह लचीली डक्ट खदान के मुहाने तक ताजी हवा पहुंचाने का सुरक्षित उपकरण है।',
    isCompliantControl: true,
    choices: [
      {
        id: 'opt-mine5-correct',
        textEn: 'Confirm compliant ventilation delivery system (No action needed - Positive airflow verified)',
        textHi: 'पुष्टि करें कि वेंटिलेशन सही ढंग से काम कर रहा है (कोई खतरा नहीं)',
        isCorrect: true,
        consequenceEn: 'Correct observation! Delivering minimum 6m3/min airflow per miner to dilute noxious gases.',
        consequenceHi: 'सही अवलोकन! यह हवा में जहरीली गैसों को घोलकर सुरक्षित माहौल बनाती है।'
      },
      {
        id: 'opt-mine5-wrong',
        textEn: 'Block the ventilation duct with empty cement bags',
        textHi: 'सीमेंट की बोरियों से वेंटिलेशन पाइप का मुंह बंद कर दें',
        isCorrect: false,
        consequenceEn: 'CRITICAL VIOLATION: Blocking ventilation leads to rapid toxic methane gas accumulation!',
        consequenceHi: 'गंभीर उल्लंघन: वेंटिलेशन बंद करने से खदान में जहरीली गैस तेजी से बढ़ जाएगी!',
        penaltyScore: -10
      }
    ]
  },

  // Scenario 5: Machinery & Nip-Point Safety Hazards
  'mach-missing-guard': {
    id: 'mach-missing-guard',
    titleEn: 'Unguarded In-Running Rotating Roller Nip',
    titleHi: 'रोलर के पास सुरक्षा गार्ड न होना',
    categoryEn: 'Machinery Guarding',
    categoryHi: 'मशीनरी सुरक्षा गार्ड',
    severity: 'Critical',
    standardEn: 'IS 9474 & Factories Act 1948 Section 21',
    standardHi: 'IS 9474 और कारखाना अधिनियम 1948 धारा 21',
    riskDescriptionEn: 'Exposed cylinder rollers rotating at high speed without interlocked physical barrier or trip wire. Severe draw-in and crushing hazard.',
    riskDescriptionHi: 'तेजी से घूमने वाले रोलर बिना किसी सुरक्षा जाली के खुले चल रहे हैं। हाथ या कपड़े खिंचने का जानलेवा खतरा।',
    isCompliantControl: false,
    choices: [
      {
        id: 'opt-mach1-correct',
        textEn: 'Install interlocked heavy wire mesh guard (IS 9474) with power cut-off interlock',
        textHi: 'पावर कट-ऑफ स्विच के साथ मजबूत इंटरलॉक्ड वायर मेश गार्ड लगाएं',
        isCorrect: true,
        consequenceEn: 'Correct action! Interlocked mesh guard encloses the nip and cuts power if opened.',
        consequenceHi: 'सही कार्रवाई! जालीदार गार्ड लगाने से हाथ अंदर नहीं जा सकता और गार्ड खुलने पर मशीन बंद हो जाएगी।'
      },
      {
        id: 'opt-mach1-wrong1',
        textEn: 'Keep the roller unguarded and tell operators to be extra careful',
        textHi: 'रोलर खुला रहने दें और ऑपरेटर से सावधानी बरतने को कहें',
        isCorrect: false,
        consequenceEn: 'CRITICAL NIP HAZARD: Human reaction time is too slow to escape a high-speed in-running nip point!',
        consequenceHi: 'गंभीर खतरा: घूमते हुए रोलर सेकंड के दसवें हिस्से में हाथ खींच लेते हैं; गार्ड लगाना अनिवार्य है!',
        penaltyScore: -10
      }
    ]
  },

  'mach-estop-unhit': {
    id: 'mach-estop-unhit',
    titleEn: 'Rotating Roller Requires Emergency Stop',
    titleHi: 'इमरजेंसी स्टॉप बटन दबाने की आवश्यकता',
    categoryEn: 'Emergency Controls',
    categoryHi: 'आपातकालीन नियंत्रण',
    severity: 'High',
    standardEn: 'ISO 13850 & IS 13947 (Emergency Stop Devices)',
    standardHi: 'ISO 13850 और IS 13947 (इमरजेंसी स्टॉप)',
    riskDescriptionEn: 'Conveyor drive is running with abnormal vibration and foreign object jam; red mushroom emergency actuator has not been struck.',
    riskDescriptionHi: 'कन्वेयर में असामान्य कंपन और रुकावट है; बड़ा लाल इमरजेंसी स्टॉप बटन अभी नहीं दबाया गया है।',
    isCompliantControl: false,
    choices: [
      {
        id: 'opt-mach2-correct',
        textEn: 'Firmly strike prominent red mushroom Emergency Stop (E-Stop) pushbutton to halt main drive',
        textHi: 'मुख्य ड्राइव को तुरंत रोकने के लिए लाल मशरूम इमरजेंसी स्टॉप (E-Stop) बटन दबाएं',
        isCorrect: true,
        consequenceEn: 'Correct action! Hitting the E-Stop instantly cuts motor contactor power, halting rotating elements.',
        consequenceHi: 'सही कार्रवाई! E-stop दबाते ही मोटर बंद हो गई और सभी घूमने वाले हिस्से तुरंत रुक गए।'
      },
      {
        id: 'opt-mach2-wrong1',
        textEn: 'Reach hands inside the moving rollers to pull out the jammed object while running',
        textHi: 'मशीन चलते समय हाथों से अंदर फंसे सामान को खींचने का प्रयास करें',
        isCorrect: false,
        consequenceEn: 'TRAUMATIC AMPUTATION RISK: Never insert hands into moving machinery under power!',
        consequenceHi: 'अंग कटने का भयानक जोखिम: चलती मशीन में कभी हाथ न डालें! पहले E-Stop दबाएं!',
        penaltyScore: -10
      }
    ]
  },

  'mach-loose-clothing': {
    id: 'mach-loose-clothing',
    titleEn: 'Operator With Loose Sleeve Near Spindle',
    titleHi: 'ढीली आस्तीन पहनकर काम करना',
    categoryEn: 'Safe Worker Attire',
    categoryHi: 'सुरक्षित कार्य पोशाक',
    severity: 'High',
    standardEn: 'Factories Rules & Workshop Safety Code',
    standardHi: 'कारखाना नियम और वर्कशॉप सुरक्षा संहिता',
    riskDescriptionEn: 'Machinist operating with unbuttoned drooping sleeve in dangerous proximity to spinning metal lathe spindle.',
    riskDescriptionHi: 'मशीन ऑपरेटर की खुली ढीली आस्तीन घूमने वाले शाफ्ट के ठीक पास लटक रही है।',
    isCompliantControl: false,
    choices: [
      {
        id: 'opt-mach3-correct',
        textEn: 'Roll up sleeves securely, button cuffs tight, and remove neckwear/lanyards',
        textHi: 'आस्तीन को ऊपर मोड़कर कसकर बटन लगाएं और गले का कार्ड या टाई तुरंत हटाएं',
        isCorrect: true,
        consequenceEn: 'Correct action! Tight-fitting attire eliminates snag points near rotating equipment.',
        consequenceHi: 'सही कार्रवाई! कसी हुई पोशाक से घूमने वाले शाफ्ट में कपड़ा फंसने का खतरा खत्म हो गया।'
      },
      {
        id: 'opt-mach3-wrong1',
        textEn: 'Leave loose sleeve fluttering near the spinning shaft',
        textHi: 'घूमते शाफ्ट के पास आस्तीन को खुला फहराने दें',
        isCorrect: false,
        consequenceEn: 'FATAL ENTANGLEMENT: Spinning spindles snag loose fabric instantly, dragging the worker into the lathe!',
        consequenceHi: 'जानलेवा खिंचाव: घूमता शाफ्ट कपड़े को तुरंत लपेटकर ऑपरेटर को मशीन में खींच लेगा!',
        penaltyScore: -5
      }
    ]
  },

  'mach-missing-perimeter': {
    id: 'mach-missing-perimeter',
    titleEn: 'Missing Yellow Perimeter Floor Demarcation',
    titleHi: 'पीली सुरक्षा सीमा रेखा का अभाव',
    categoryEn: 'Workplace Demarcation',
    categoryHi: 'कार्यस्थल सीमांकन',
    severity: 'Medium',
    standardEn: 'IS 9474 & IS 2379 (Safety Color Codes)',
    standardHi: 'IS 9474 और IS 2379 (सुरक्षा रंग कोड)',
    riskDescriptionEn: 'Absence of high-visibility yellow/black hazard perimeter floor markings around rotating equipment envelope.',
    riskDescriptionHi: 'मशीन के चारों ओर फर्श पर पीली/काली सुरक्षा चेतावनी पट्टी नहीं है।',
    isCompliantControl: false,
    choices: [
      {
        id: 'opt-mach4-correct',
        textEn: 'Paint 100mm yellow/black chevron border at 1.5m safety boundary clearance',
        textHi: '1.5 मीटर की दूरी पर फर्श पर 100mm चौड़ी पीली-काली सुरक्षा चेतावनी पट्टी बनाएं',
        isCorrect: true,
        consequenceEn: 'Correct action! Visual floor marking clearly demarcates the danger zone for all operators.',
        consequenceHi: 'सही कार्रवाई! फर्श पर पीली पट्टी सभी को सुरक्षित दूरी बनाए रखने की चेतावनी देती है।'
      },
      {
        id: 'opt-mach4-wrong1',
        textEn: 'Leave floor plain without any demarcation lines',
        textHi: 'फर्श को बिना किसी सुरक्षा रेखा के ऐसे ही रहने दें',
        isCorrect: false,
        consequenceEn: 'VIOLATION: Clear demarcation is statutory to prevent unauthorized entry into machine envelope.',
        consequenceHi: 'उल्लंघन: मशीन के खतरे के दायरे को स्पष्ट रूप से चिह्नित करना अनिवार्य है।',
        penaltyScore: -5
      }
    ]
  },

  'mach-eyewash': {
    id: 'mach-eyewash',
    titleEn: 'Approved Emergency Eyewash Station (Compliant Control)',
    titleHi: 'आपातकालीन आईवॉश स्टेशन (सुरक्षित नियंत्रण)',
    categoryEn: 'Emergency Facilities',
    categoryHi: 'आपातकालीन सुविधाएं',
    severity: 'Low',
    standardEn: 'IS 10592 (Industrial Emergency Eye Wash Equipment)',
    standardHi: 'IS 10592 (औद्योगिक आईवॉश उपकरण)',
    riskDescriptionEn: 'Plumbed emergency eye-wash station is operational with inspection tag and unobstructed 1-meter access radius.',
    riskDescriptionHi: 'आपातकालीन आंखों को धोने का फव्वारा पूरी तरह चालू है और 1 मीटर के दायरे में साफ रास्ता है।',
    isCompliantControl: true,
    choices: [
      {
        id: 'opt-mach5-correct',
        textEn: 'Confirm compliant emergency facility (No action needed - Keep 1-meter access clear)',
        textHi: 'पुष्टि करें कि यह प्रमाणित आपातकालीन सुविधा है (कोई खतरा नहीं)',
        isCorrect: true,
        consequenceEn: 'Correct observation! Emergency eyewash stations must remain operational for chemical splash response.',
        consequenceHi: 'सही अवलोकन! रासायनिक छींटों से आंखों को बचाने के लिए यह जीवन रक्षक सुविधा अनिवार्य है।'
      },
      {
        id: 'opt-mach5-wrong',
        textEn: 'Store scrap metal pipes on the eyewash basin',
        textHi: 'आईवॉश बेसिन पर लोहे के कबाड़ पाइप रख दें',
        isCorrect: false,
        consequenceEn: 'CRITICAL VIOLATION: Obstructing emergency wash stations prevents blinded workers from flushing eyes!',
        consequenceHi: 'गंभीर उल्लंघन: आपातकालीन आईवॉश को कभी अवरुद्ध नहीं किया जाना चाहिए!',
        penaltyScore: -10
      }
    ]
  },

  // Scenario 6 / Primary: Industrial Gas Processing & Leakage
  'gas-valve-leak': {
    id: 'gas-valve-leak',
    titleEn: 'Pressurized Gas Flange Joint Leak',
    titleHi: 'उच्च-दबाव गैस पाइपलाइन फ्लैंज रिसाव',
    categoryEn: 'Chemical & Process Safety',
    categoryHi: 'रासायनिक एवं प्रक्रिया सुरक्षा',
    severity: 'Critical',
    standardEn: 'PESO & Factories Act 1948 Section 37',
    standardHi: 'PESO एवं कारखाना अधिनियम 1948 धारा 37',
    riskDescriptionEn: 'A high-pressure flange seal on the primary gas manifold has ruptured, releasing an expanding cloud of toxic/flammable gas with audible hissing and pressure loss.',
    riskDescriptionHi: 'मुख्य गैस पाइपलाइन का फ्लैंज सील फट गया है, जिससे फुफकार के साथ जहरीली व ज्वलनशील गैस का बादल तेजी से फैल रहा है।',
    isCompliantControl: false,
    choices: [
      {
        id: 'opt-gas-valve-correct',
        textEn: 'Trigger emergency shutdown (ESD), isolate upstream manual shutoff valve, and enforce 50m exclusion zone',
        textHi: 'आपातकालीन शटडाउन (ESD) चालू करें, मुख्य वाल्व बंद करें और 50 मीटर का घेरा बनाएं',
        isCorrect: true,
        consequenceEn: 'Correct action! Immediate valve isolation halts gas release and prevents catastrophe.',
        consequenceHi: 'सही कार्रवाई! वाल्व बंद करने से गैस का रिसाव तुरंत रुक गया और बड़ा हादसा टल गया।'
      },
      {
        id: 'opt-gas-valve-wrong1',
        textEn: 'Try to tighten the leaking flange bolts with a steel spanner without isolating pressure',
        textHi: 'बिना दबाव कम किए लोहे के पाने से लीक बोल्ट को कसने की कोशिश करें',
        isCorrect: false,
        consequenceEn: 'FATAL RISK: Metal-on-metal spark will instantly detonate the pressurized gas cloud!',
        consequenceHi: 'घातक खतरा: लोहे की रगड़ से निकली चिंगारी गैस के बादल को तुरंत विस्फोटित कर देगी!',
        penaltyScore: -15
      },
      {
        id: 'opt-gas-valve-wrong2',
        textEn: 'Ignore the hissing vapor and continue normal factory production',
        textHi: 'गैस की फुफकार को नजरअंदाज करें और सामान्य काम जारी रखें',
        isCorrect: false,
        consequenceEn: 'CATASTROPHIC NEGLIGENCE: Gas accumulation causes widespread toxic asphyxiation or explosion.',
        consequenceHi: 'गंभीर लापरवाही: गैस जमा होने से पूरे प्लांट में दम घुटने या भयानक विस्फोट हो जाएगा।',
        penaltyScore: -15
      }
    ]
  },

  'gas-elec-panel': {
    id: 'gas-elec-panel',
    titleEn: 'Live Electrical Switchgear Panel Near Gas Cloud',
    titleHi: 'गैस रिसाव के पास खुला 440V बिजली पैनल',
    categoryEn: 'Explosion Prevention',
    categoryHi: 'विस्फोट रोकथाम',
    severity: 'Critical',
    standardEn: 'IS/IEC 60079 (Hazardous Area Explosive Atmospheres)',
    standardHi: 'IS/IEC 60079 (विस्फोटक वातावरण मानक)',
    riskDescriptionEn: 'An open electrical switchboard is operating inside the flammable gas dispersion radius, presenting an immediate electrical arc ignition source.',
    riskDescriptionHi: 'गैस बादल के ठीक बगल में 440V बिजली पैनल खुला हुआ है। रिले या स्विच से निकली एक चिंगारी भयंकर आग लगा सकती है।',
    isCompliantControl: false,
    choices: [
      {
        id: 'opt-gas-elec-correct',
        textEn: 'Perform remote emergency power cut-off from outside hazardous gas boundary',
        textHi: 'गैस क्षेत्र के बाहर से रिमोट इमरजेंसी पावर कट-ऑफ सक्रिय करें',
        isCorrect: true,
        consequenceEn: 'Correct action! De-energizing the electrical bay removes the spark ignition hazard.',
        consequenceHi: 'सही कार्रवाई! बिजली काटने से गैस प्रज्वलन (इग्निशन) का खतरा समाप्त हो गया।'
      },
      {
        id: 'opt-gas-elec-wrong1',
        textEn: 'Flip individual circuit breakers manually while standing inside the gas cloud',
        textHi: 'गैस के बादल के बीच खड़े होकर हाथ से स्विच चालू-बंद करें',
        isCorrect: false,
        consequenceEn: 'EXPLOSION: Breaker contacts create an internal arc that instantly ignites the flammable vapor!',
        consequenceHi: 'विस्फोट: स्विच काटते समय निकली चिंगारी से तुरंत गैस विस्फोट हो जाएगा!',
        penaltyScore: -15
      }
    ]
  },

  'gas-worker-ppe': {
    id: 'gas-worker-ppe',
    titleEn: 'Worker Breathing Toxic Gas Without Respirator',
    titleHi: 'बिना गैस मास्क/रेस्पिरेटर के श्रमिक का होना',
    categoryEn: 'Personal Protective Equipment',
    categoryHi: 'व्यक्तिगत सुरक्षा उपकरण',
    severity: 'High',
    standardEn: 'IS 9473 & EN 14387 (Chemical Gas Respirators)',
    standardHi: 'IS 9473 एवं EN 14387 (रासायनिक गैस मास्क)',
    riskDescriptionEn: 'Technician working in process bay without certified toxic gas respirator or Self-Contained Breathing Apparatus (SCBA). High risk of acute inhalation poisoning.',
    riskDescriptionHi: 'श्रमिक बिना रासायनिक गैस मास्क या SCBA के जहरीली गैस क्षेत्र में है, जिससे फेफड़े खराब होने व दम घुटने का खतरा है।',
    isCompliantControl: false,
    choices: [
      {
        id: 'opt-gas-ppe-correct',
        textEn: 'Don certified IS 9473 ABEK gas respirator / SCBA and retreat to upwind safety zone',
        textHi: 'प्रमाणित IS 9473 ABEK गैस रेस्पिरेटर या SCBA पहनें और हवा के रुख की विपरीत दिशा में जाएं',
        isCorrect: true,
        consequenceEn: 'Correct action! Full face chemical respirator seals airways against toxic vapor inhalation.',
        consequenceHi: 'सही कार्रवाई! रेस्पिरेटर पहनने से फेफड़े सुरक्षित हो गए और सांस लेना सुरक्षित हुआ।'
      },
      {
        id: 'opt-gas-ppe-wrong1',
        textEn: 'Cover mouth with a dry cotton handkerchief and stay in the gas area',
        textHi: 'मुंह पर सूखा सूती रूमाल बांधकर वहीं काम करते रहें',
        isCorrect: false,
        consequenceEn: 'LETHAL INHALATION: Cotton cloth does NOT filter toxic gas molecules or chemical vapors!',
        consequenceHi: 'घातक भूल: सूती कपड़ा रासायनिक वाष्प या जहरीली गैस को बिल्कुल नहीं रोक सकता!',
        penaltyScore: -10
      }
    ]
  },

  'gas-blocked-exit': {
    id: 'gas-blocked-exit',
    titleEn: 'Obstructed Industrial Emergency Egress Route',
    titleHi: 'आपातकालीन निकास द्वार पर रुकावट (अवरुद्ध रास्ता)',
    categoryEn: 'Emergency Evacuation',
    categoryHi: 'आपातकालीन निकासी',
    severity: 'High',
    standardEn: 'Indian Factories Act 1948 Section 38',
    standardHi: 'भारतीय कारखाना अधिनियम 1948 धारा 38',
    riskDescriptionEn: 'Wooden pallets and 200L chemical drums are stacked directly in front of the illuminated emergency fire and gas exit door, trapping occupants.',
    riskDescriptionHi: 'लकड़ी के पैलेट और रसायन ड्रम आपातकालीन निकास द्वार के सामने रखे हैं, जिससे भगदड़ में बाहर निकलना असंभव है।',
    isCompliantControl: false,
    choices: [
      {
        id: 'opt-gas-exit-correct',
        textEn: 'Clear drums immediately and unlatch panic push-bar to secure unimpeded evacuation path',
        textHi: 'ड्रमों को तुरंत हटाएं और निकास द्वार का पैनिक पुश-बार खोलकर रास्ता साफ करें',
        isCorrect: true,
        consequenceEn: 'Correct action! Egress corridor cleared, enabling rapid evacuation to outdoor muster point.',
        consequenceHi: 'सही कार्रवाई! निकास मार्ग पूरी तरह साफ हो गया, जिससे सभी सुरक्षित बाहर निकल सकते हैं।'
      },
      {
        id: 'opt-gas-exit-wrong1',
        textEn: 'Lock the exit door from inside to keep gas from escaping outdoors',
        textHi: 'गैस को बाहर जाने से रोकने के लिए दरवाजे पर ताला लगा दें',
        isCorrect: false,
        consequenceEn: 'CRITICAL TRAP: Locking fire exits traps personnel inside the toxic chamber with zero escape route!',
        consequenceHi: 'घातक गलती: निकास द्वार बंद करने से सभी लोग अंदर जहरीली गैस में फंस जाएंगे!',
        penaltyScore: -15
      }
    ]
  },

  'gas-alarm-box': {
    id: 'gas-alarm-box',
    titleEn: 'Break-Glass Emergency Gas Alarm MCP (Actionable Control)',
    titleHi: 'आपातकालीन गैस अलार्म बटन (सक्रिय करें)',
    categoryEn: 'Emergency Notification',
    categoryHi: 'आपातकालीन सूचना',
    severity: 'Low',
    standardEn: 'IS 2189 (Automatic & Manual Fire/Gas Alarm Systems)',
    standardHi: 'IS 2189 (आपातकालीन अलार्म मानक)',
    riskDescriptionEn: 'Wall-mounted manual call point (MCP) with flashing xenon beacon and siren. Ready for immediate actuation.',
    riskDescriptionHi: 'दीवार पर लगा लाल आपातकालीन अलार्म बॉक्स। दबाते ही पूरे प्लांट में सायरन और लाल बत्ती सक्रिय हो जाती है।',
    isCompliantControl: true,
    choices: [
      {
        id: 'opt-gas-alarm-correct',
        textEn: 'Strike break-glass call point to trigger plant-wide sirens and dispatch HazMat team',
        textHi: 'अलार्म बटन दबाएं ताकि पूरे संयंत्र में सायरन बजे और बचाव दल रवाना हो',
        isCorrect: true,
        consequenceEn: 'Alarm activated! High-decibel siren sounds, strobe light pulses, and emergency shutdown initiated.',
        consequenceHi: 'अलार्म सक्रिय! सायरन बज उठा और पूरे कारखाने को सुरक्षित निकासी का संकेत मिल गया।'
      }
    ]
  },

  'gas-vent-fan': {
    id: 'gas-vent-fan',
    titleEn: 'Explosion-Proof Emergency Exhaust Ventilation',
    titleHi: 'विस्फोट-रोधी आपातकालीन निकास पंखा (एग्जॉस्ट फैन)',
    categoryEn: 'Environmental Engineering',
    categoryHi: 'पर्यावरणीय इंजीनियरिंग',
    severity: 'Low',
    standardEn: 'NFPA 654 & Indian Explosives Rules',
    standardHi: 'NFPA 654 एवं विस्फोटक नियम',
    riskDescriptionEn: 'High-capacity flameproof industrial ventilation blower. Designed to rapidly exhaust hazardous vapor concentrations to safe scrubber stack.',
    riskDescriptionHi: 'उच्च-क्षमता का फ्लेमप्रूफ निकास पंखा। यह जहरीली गैस को खींचकर प्लांट से बाहर सुरक्षित स्क्रबर में भेजता है।',
    isCompliantControl: true,
    choices: [
      {
        id: 'opt-gas-vent-correct',
        textEn: 'Activate emergency ventilation blowers at maximum capacity to dilute gas plume',
        textHi: 'गैस को बाहर निकालने के लिए आपातकालीन एग्जॉस्ट पंखे तुरंत चालू करें',
        isCorrect: true,
        consequenceEn: 'Ventilation online! Heavy airflow begins rapidly dissipating and scrubbing hazardous vapors.',
        consequenceHi: 'निकास पंखे चालू! तेज हवा से गैस का घनत्व सुरक्षित स्तर तक तेजी से घटने लगा।'
      }
    ]
  }
};

export function getHazardActionDetail(hazardId: string): HazardActionDetail | undefined {
  return HAZARD_ACTIONS_MAP[hazardId];
}

