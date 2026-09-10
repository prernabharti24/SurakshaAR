import { AnimatedTutorialDefinition } from '../types';

export const ANIMATED_TUTORIALS: Record<string, AnimatedTutorialDefinition> = {
  'scenario-1-ppe': {
    scenarioId: 'scenario-1-ppe',
    scenarioNameEn: 'PPE & Industrial Hazard Baseline',
    scenarioNameHi: 'पीपीई और बुनियादी औद्योगिक सुरक्षा',
    industry: 'General Manufacturing',
    badge: 'IS 2925 / IS 15298',
    totalSteps: 6,
    steps: [
      {
        stepNumber: 1,
        titleEn: 'Worker Approaches Workplace',
        titleHi: 'कार्यस्थल के पास पहुंचना',
        shortTextEn: 'Worker stops at workshop perimeter before entering danger zone.',
        shortTextHi: 'कार्यक्षेत्र में जाने से पहले प्रवेश द्वार पर रुकें।',
        narrationEn: 'Step 1: Always pause at the workshop entry gate. Check the safety signboards before walking into the active work zone.',
        narrationHi: 'पहला कदम: कार्यक्षेत्र के गेट पर रुकें। अंदर जाने से पहले चेतावनी बोर्ड को ध्यान से देखें।',
        actionType: 'approach',
        iconName: 'DoorOpen',
        safeConfirmation: {
          labelEn: 'Entry Point Check',
          labelHi: 'प्रवेश द्वार जांच',
          descriptionEn: 'Identified workshop safety boundary.',
          descriptionHi: 'सुरक्षा सीमा की पहचान की गई।'
        },
        ruleBadge: 'IS Entry Protocol'
      },
      {
        stepNumber: 2,
        titleEn: 'Identify Visible Hazards',
        titleHi: 'आसपास के खतरों को पहचानें',
        shortTextEn: 'Look around for overhead loads, moving equipment, and obstacles.',
        shortTextHi: 'ऊपर लटकते भार, चलती गाड़ियां और फर्श पर रुकावटें देखें।',
        narrationEn: 'Step 2: Scan the work environment. Watch out for overhead cranes, moving forklifts, and loose floor debris.',
        narrationHi: 'दूसरा कदम: चारों तरफ नजर घुमाएं। ऊपर क्रेन का भार और नीचे फैले सामान पर ध्यान दें।',
        actionType: 'hazard_scan',
        iconName: 'AlertTriangle',
        unsafeWarning: {
          labelEn: 'Unsafe: Walking Blindly',
          labelHi: 'असुरक्षित: बिना देखे आगे बढ़ना',
          descriptionEn: 'Walking into active machinery paths without looking.',
          descriptionHi: 'बिना देखे चलती मशीन के रास्ते में जाना।'
        },
        safeConfirmation: {
          labelEn: 'Safe: 360° Visual Scan',
          labelHi: 'सुरक्षित: 360 डिग्री नजर',
          descriptionEn: 'Identified clearance paths before moving forward.',
          descriptionHi: 'आगे बढ़ने से पहले सुरक्षित रास्ता तय किया।'
        },
        ruleBadge: 'Hazard Perception'
      },
      {
        stepNumber: 3,
        titleEn: 'Wear Safety Helmet',
        titleHi: 'सुरक्षा हेलमेट पहनें',
        shortTextEn: 'Put on approved hard hat and fasten the chin strap securely.',
        shortTextHi: 'मजबूत सुरक्षा हेलमेट पहनें और ठुड्डी का पट्टा कसें।',
        narrationEn: 'Step 3: Wear an approved safety helmet with the chin strap locked tightly. It shields your head from falling tools and heavy impacts.',
        narrationHi: 'तीसरा कदम: सिर पर सुरक्षा हेलमेट लगाएं और स्ट्रैप जरूर बांधें। यह ऊपर से गिरती चीजों से आपकी रक्षा करता है।',
        actionType: 'equip_helmet',
        iconName: 'HardHat',
        unsafeWarning: {
          labelEn: 'Unsafe: Bare Head or Loose Hat',
          labelHi: 'असुरक्षित: बिना हेलमेट या ढीला फीता',
          descriptionEn: 'Head fully exposed to crushing and falling tools.',
          descriptionHi: 'सिर पर भारी चोट का गंभीर खतरा।'
        },
        safeConfirmation: {
          labelEn: 'Safe: IS 2925 Helmet Locked',
          labelHi: 'सुरक्षित: हेलमेट सही तरीके से बंद',
          descriptionEn: 'High-density polyethylene shell with chin strap secured.',
          descriptionHi: 'हेलमेट सिर पर कसकर बंधा है।'
        },
        ruleBadge: 'IS 2925 Standard'
      },
      {
        stepNumber: 4,
        titleEn: 'Wear Safety Shoes',
        titleHi: 'सुरक्षा जूते पहनें',
        shortTextEn: 'Wear steel-toe industrial shoes to prevent foot crush injuries.',
        shortTextHi: 'लोहे के पंजे वाले मजबूत सुरक्षा जूते पहनें।',
        narrationEn: 'Step 4: Wear steel-toe safety boots. Slippers or cloth shoes can lead to severe crushing and puncture injuries from sharp metal.',
        narrationHi: 'चौथा कदम: मजबूत सुरक्षा जूते पहनें। चप्पल या साधारण कपड़े के जूते कभी न पहनें, नुकीली कीलों और भारी वजन से पैर बचाएं।',
        actionType: 'equip_shoes',
        iconName: 'Footprints',
        unsafeWarning: {
          labelEn: 'Unsafe: Open Slippers or Sandals',
          labelHi: 'असुरक्षित: चप्पल या साधारण जूते',
          descriptionEn: 'Crush and puncture risk from heavy parts or scrap metal.',
          descriptionHi: 'कील या भारी लोहे से पैर कटने का खतरा।'
        },
        safeConfirmation: {
          labelEn: 'Safe: IS 15298 Steel-Toe Boots',
          labelHi: 'सुरक्षित: स्टील-टो सुरक्षा जूते',
          descriptionEn: '200 Joule impact resistant safety footwear.',
          descriptionHi: 'भारी आघात से सुरक्षित जूते।'
        },
        ruleBadge: 'IS 15298 Standard'
      },
      {
        stepNumber: 5,
        titleEn: 'Wear Required Eye & Hand PPE',
        titleHi: 'चश्मा और दस्ताने पहनें',
        shortTextEn: 'Equip protective eye goggles and certified work gloves.',
        shortTextHi: 'आंखों के लिए सुरक्षा चश्मा और हाथों में दस्ताने पहनें।',
        narrationEn: 'Step 5: Put on clear safety glasses to stop flying sparks and wear sturdy work gloves to protect hands from rough edges.',
        narrationHi: 'पांचवां कदम: उड़ती चिंगारी और धूल से बचने के लिए सुरक्षा चश्मा और हाथों में मजबूत दस्ताने पहनें।',
        actionType: 'equip_gloves',
        iconName: 'Glasses',
        unsafeWarning: {
          labelEn: 'Unsafe: Bare Hands & Exposed Eyes',
          labelHi: 'असुरक्षित: नंगे हाथ और खुली आंखें',
          descriptionEn: 'Metal shavings in eyes, skin cuts and burns.',
          descriptionHi: 'लोहे के बुरादे से आंखों और हाथों को नुकसान।'
        },
        safeConfirmation: {
          labelEn: 'Safe: IS 5983 Goggles & IS 6994 Gloves',
          labelHi: 'सुरक्षित: चश्मा और दस्ताने तैयार',
          descriptionEn: 'Complete eye protection and cut-resistant gloves on.',
          descriptionHi: 'आंख और हाथ दोनों पूरी तरह सुरक्षित।'
        },
        ruleBadge: 'IS 5983 / IS 6994'
      },
      {
        stepNumber: 6,
        titleEn: 'Confirm PPE Before Starting Work',
        titleHi: 'काम शुरू करने से पहले अंतिम जांच',
        shortTextEn: 'Verify all protective gear is in place. Thumbs up for safety!',
        shortTextHi: 'सिर से पैर तक सब सुरक्षा उपकरण चेक करें। अब आप सुरक्षित हैं!',
        narrationEn: 'Step 6: Do a quick full body check. Helmet fastened, vest on, gloves equipped, boots tight. You are now safe to start your job.',
        narrationHi: 'छठा कदम: एक बार पूरा शरीर जांच लें। हेलमेट, जैकेट, दस्ताने और जूते। जब सब ठीक हो, तभी काम शुरू करें।',
        actionType: 'confirm_ready',
        iconName: 'CheckCircle2',
        safeConfirmation: {
          labelEn: 'Ready for Work: 100% Compliant',
          labelHi: 'काम के लिए तैयार: पूरी तरह सुरक्षित',
          descriptionEn: 'All statutory PPE confirmed before starting tasks.',
          descriptionHi: 'सभी अनिवार्य सुरक्षा उपकरण सही पाए गए।'
        },
        ruleBadge: 'Full Compliance'
      }
    ],
    quiz: {
      questionEn: 'A worker is standing near active machinery without a helmet. What must he do first?',
      questionHi: 'एक मजदूर बिना हेलमेट मशीन के पास खड़ा है। उसे सबसे पहले क्या करना चाहिए?',
      scenarioContextEn: 'Workplace Safety Protocol & Personal Protective Equipment',
      scenarioContextHi: 'कार्यस्थल सुरक्षा नियम और व्यक्तिगत सुरक्षा उपकरण',
      xpReward: 50,
      options: [
        {
          id: 'opt-1-unsafe',
          textEn: 'Run inside quickly for just 2 minutes',
          textHi: 'सिर्फ २ मिनट के लिए बिना हेलमेट अंदर चले जाएं',
          iconName: 'XCircle',
          isCorrect: false,
          explanationEn: 'Unsafe! Falling objects can strike instantly regardless of time.',
          explanationHi: 'गलत! ऊपर से कोई भी चीज कुछ ही सेकंड में गिरकर चोट पहुंचा सकती है।'
        },
        {
          id: 'opt-2-correct',
          textEn: 'Put on an IS 2925 safety helmet and fasten the chin strap',
          textHi: 'तुरंत आईएस 2925 हेलमेट पहनें और फीता कसें',
          iconName: 'CheckCircle2',
          isCorrect: true,
          explanationEn: 'Correct! Head protection with chin strap is mandatory before entering any industrial zone.',
          explanationHi: 'शाबाश! कार्यक्षेत्र में घुसने से पहले हेलमेट पहनना अनिवार्य है।'
        },
        {
          id: 'opt-3-towel',
          textEn: 'Cover head with a cloth towel or handkerchief',
          textHi: 'सिर पर साधारण रुमाल या गमछा बांध लें',
          iconName: 'AlertCircle',
          isCorrect: false,
          explanationEn: 'Cloth offers zero impact resistance against metal, tools, or concrete.',
          explanationHi: 'गलत! कपड़े या गमछे से भारी चोट से कोई बचाव नहीं होता।'
        }
      ]
    }
  },

  'scenario-2-electrical': {
    scenarioId: 'scenario-2-electrical',
    scenarioNameEn: 'High-Voltage Electrical Safety',
    scenarioNameHi: 'उच्च वोल्टेज विद्युत सुरक्षा',
    industry: 'Electrical Infrastructure',
    badge: 'CEA Regs 2010 / IS 4770',
    totalSteps: 6,
    steps: [
      {
        stepNumber: 1,
        titleEn: 'Identify Electrical Hazard',
        titleHi: 'बिजली के खतरे को पहचानें',
        shortTextEn: 'Spot sparking panels, torn insulation, or exposed live cables.',
        shortTextHi: 'स्पार्किंग, कटी हुई तार या खुले पैनल बोर्ड को पहचानें।',
        narrationEn: 'Step 1: Look for electrical warning signs. Watch out for torn cable sheaths, spark sounds, or open switchboard doors.',
        narrationHi: 'पहला कदम: बिजली के खतरे को पहचानें। कटी तारें, चिंगारी की आवाज या खुला पैनल बोर्ड देखें।',
        actionType: 'hazard_id',
        iconName: 'Zap',
        unsafeWarning: {
          labelEn: 'Danger: Ignoring Frayed Wires',
          labelHi: 'खतरा: कटी तार को अनदेखा करना',
          descriptionEn: 'Passing by live spark hazard without flagging it.',
          descriptionHi: 'चिंगारी फेंकती तार के पास से बिना सावधानी के गुजरना।'
        },
        safeConfirmation: {
          labelEn: 'Hazard Spotted: 440V Danger',
          labelHi: 'खतरा चिह्नित: 440 वोल्ट बिजली',
          descriptionEn: 'Identified exposed cable fault from safe distance.',
          descriptionHi: 'सुरक्षित दूरी से बिजली के फाल्ट को पहचाना।'
        },
        ruleBadge: 'CEA Reg 30'
      },
      {
        stepNumber: 2,
        titleEn: 'Keep Unsafe Access Clear',
        titleHi: 'खतरे वाली जगह को घेरें और दूर रहें',
        shortTextEn: 'Keep water, puddles, and workers at least 2 meters away.',
        shortTextHi: 'पानी, कीचड़ और अन्य लोगों को बिजली की जगह से दूर रखें।',
        narrationEn: 'Step 2: Keep people away and cordon off the area. Never walk through water puddles near electrical equipment.',
        narrationHi: 'दूसरा कदम: उस जगह से लोगों को दूर रखें। बिजली के पैनल के पास पानी या गीले फर्श पर कभी पैर न रखें।',
        actionType: 'clear_access',
        iconName: 'ShieldAlert',
        unsafeWarning: {
          labelEn: 'Unsafe: Stepping in Wet Puddle',
          labelHi: 'असुरक्षित: गीले फर्श पर खड़े होना',
          descriptionEn: 'Water conducts fatal electrical shock directly into body.',
          descriptionHi: 'पानी के जरिए शरीर में जानलेवा करंट आ सकता है।'
        },
        safeConfirmation: {
          labelEn: 'Safe: 2-Meter Safe Perimeter Cordon',
          labelHi: 'सुरक्षित: दो मीटर की दूरी और बैरिकेड',
          descriptionEn: 'Barricade tape deployed; standing zone dry.',
          descriptionHi: 'लाल चेतावनी पट्टी लगाई और सूखा फर्श सुनिश्चित किया।'
        },
        ruleBadge: 'IS 2551 Clearances'
      },
      {
        stepNumber: 3,
        titleEn: 'Isolate Power According to Authorized Procedure',
        titleHi: 'नियमानुसार बिजली सप्लाई बंद करें (LOTO)',
        shortTextEn: 'Turn off the main breaker and apply Lockout/Tagout padlock.',
        shortTextHi: 'मुख्य स्विच नीचे गिराएं और अपना ताला (LOTO) लगाएं।',
        narrationEn: 'Step 3: Cut the upstream power using authorized isolation. Place a Lockout Tagout padlock so nobody turns it on accidentally.',
        narrationHi: 'तीसरा कदम: अधिकृत तरीके से मेन स्विच बंद करें। ताला और टैग लगाएं ताकि कोई गलती से बिजली चालू न कर दे।',
        actionType: 'isolate_power',
        iconName: 'Lock',
        unsafeWarning: {
          labelEn: 'Unsafe: Pulling Live Cables',
          labelHi: 'असुरक्षित: चालू तार को खींचना',
          descriptionEn: 'Touching or pulling energized lines causes deadly arc flash.',
          descriptionHi: 'चालू तार छूने से भीषण धमाका और करंट लगता है।'
        },
        safeConfirmation: {
          labelEn: 'Safe: LOTO Padlock Applied',
          labelHi: 'सुरक्षित: मेन स्विच पर ताला और टैग',
          descriptionEn: 'Main switch locked in OFF position with safety tag.',
          descriptionHi: 'मेन स्विच बंद कर ताला लगाया गया।'
        },
        ruleBadge: 'LOTO Protocol'
      },
      {
        stepNumber: 4,
        titleEn: 'Use Appropriate Safety PPE & Tools',
        titleHi: 'विद्युतरोधी दस्ताने और सुरक्षित औजार लें',
        shortTextEn: 'Wear 1000V rated dielectric rubber gloves and insulated probe.',
        shortTextHi: '1000 वोल्ट तक सुरक्षित रबर दस्ताने और इंसुलेटेड औजार लें।',
        narrationEn: 'Step 4: Wear certified dielectric insulating gloves and use insulated test tools. Never handle electrical panels barehanded.',
        narrationHi: 'चौथा कदम: प्रमाणित रबर के विद्युतरोधी दस्ताने पहनें। नंगे हाथों या लोहे के साधारण औजार से काम न करें।',
        actionType: 'dielectric_ppe',
        iconName: 'ShieldCheck',
        safeConfirmation: {
          labelEn: 'Safe: IS 4770 Class 0 Gloves',
          labelHi: 'सुरक्षित: प्रमाणित इंसुलेटेड दस्ताने',
          descriptionEn: '1000V tested rubber insulating gloves equipped.',
          descriptionHi: 'करंट से बचाने वाले रबर दस्ताने पहने।'
        },
        ruleBadge: 'IS 4770 Certified'
      },
      {
        stepNumber: 5,
        titleEn: 'Do Not Touch Exposed Live Parts',
        titleHi: 'नंगी चालू तारों को कभी न छुएं',
        shortTextEn: 'Never touch uninsulated conductors or try DIY repairs.',
        shortTextHi: 'खुली तारों को कभी हाथ न लगाएं, खुद मरम्मत की कोशिश न करें।',
        narrationEn: 'Step 5: Do not touch exposed live electrical conductors. Wait until an authorized electrician tests for zero voltage.',
        narrationHi: 'पांचवां कदम: खुली तारों को कभी न छुएं। जब तक बिजली मिस्त्री टेस्टर से जांच न कर ले, तार से दूर रहें।',
        actionType: 'no_touch_live',
        iconName: 'Hand',
        unsafeWarning: {
          labelEn: 'Deadly: Touching Bare Busbars',
          labelHi: 'घातक: खुली तारों को हाथ लगाना',
          descriptionEn: 'Direct contact results in fatal electric shock or severe burns.',
          descriptionHi: 'सीधे छूने से जान जाने का खतरा है।'
        },
        safeConfirmation: {
          labelEn: 'Safe: Zero Voltage Verified',
          labelHi: 'सुरक्षित: वोल्टेज शून्य की पुष्टि',
          descriptionEn: 'Tested with calibrated voltage detector before touch.',
          descriptionHi: 'टेस्टर से सुरक्षित पुष्टि के बाद ही आगे बढ़े।'
        },
        ruleBadge: 'NFPA 70E / CEA'
      },
      {
        stepNumber: 6,
        titleEn: 'Inform Responsible Supervisor / Electrician',
        titleHi: 'सुपरवाइजर और बिजली मिस्त्री को सूचना दें',
        shortTextEn: 'Notify the certified plant electrician and log the maintenance permit.',
        shortTextHi: 'प्लांट इलेक्ट्रीशियन और सुपरवाइजर को तुरंत सूचित करें।',
        narrationEn: 'Step 6: Report the electrical issue to the shift supervisor and qualified electrician. Always get a written work permit before re-energizing.',
        narrationHi: 'छठा कदम: सुपरवाइजर और इलेक्ट्रीशियन को पूरी बात बताएं। वर्क परमिट मिलने के बाद ही बिजली दोबारा चालू करें।',
        actionType: 'inform_supervisor',
        iconName: 'PhoneCall',
        safeConfirmation: {
          labelEn: 'Logged & Certified',
          labelHi: 'सूचना दर्ज और प्रमाणित',
          descriptionEn: 'Official logbook updated; certified electrician on site.',
          descriptionHi: 'रजिस्टर में दर्ज और अधिकृत मिस्त्री मौके पर उपस्थित।'
        },
        ruleBadge: 'Work Permit System'
      }
    ],
    quiz: {
      questionEn: 'A power cable is damaged and sparking in a puddle. What is the safest first action?',
      questionHi: 'एक बिजली की तार कटकर पानी में चिंगारी फेंक रही है। सबसे सुरक्षित पहला कदम क्या है?',
      scenarioContextEn: 'High-Voltage Safety & Authorized Electrical Protocol',
      scenarioContextHi: 'हाई वोल्टेज सुरक्षा और अधिकृत विद्युत प्रक्रिया',
      xpReward: 50,
      options: [
        {
          id: 'opt-elec-1',
          textEn: 'Pick up the wire barehanded to lift it out of water',
          textHi: 'नंगे हाथ से तार उठाकर पानी से बाहर करें',
          iconName: 'XCircle',
          isCorrect: false,
          explanationEn: 'Extremely dangerous! You will suffer a fatal electric shock.',
          explanationHi: 'बहुत खतरनाक! इससे तुरंत जानलेवा करंट लग जाएगा।'
        },
        {
          id: 'opt-elec-2',
          textEn: 'Keep 2m away, isolate power at the main breaker, and notify the electrician',
          textHi: 'दो मीटर दूर रहें, मेन स्विच बंद कराएं और इलेक्ट्रीशियन को बुलाएं',
          iconName: 'CheckCircle2',
          isCorrect: true,
          explanationEn: 'Correct! Keeping distance and isolating upstream power prevents electrocution.',
          explanationHi: 'बिल्कुल सही! सुरक्षित दूरी बनाकर मेन स्विच बंद करना ही सही तरीका है।'
        },
        {
          id: 'opt-elec-3',
          textEn: 'Cover the sparkling wire with a wet cotton rag',
          textHi: 'गीला कपड़ा डालकर चिंगारी दबाने की कोशिश करें',
          iconName: 'AlertCircle',
          isCorrect: false,
          explanationEn: 'Wet cloth conducts electricity and can catch fire immediately.',
          explanationHi: 'गलत! गीला कपड़ा करंट पकड़ेगा और आग भड़क जाएगी।'
        }
      ]
    }
  },

  'scenario-3-fire': {
    scenarioId: 'scenario-3-fire',
    scenarioNameEn: 'Industrial Fire Emergency & Evacuation',
    scenarioNameHi: 'औद्योगिक आग से बचाव और सुरक्षित निकास',
    industry: 'Emergency Response',
    badge: 'IS 15683 / NFPA 10',
    totalSteps: 6,
    steps: [
      {
        stepNumber: 1,
        titleEn: 'Detect Fire or Smoke',
        titleHi: 'आग या धुएं को तुरंत पहचानें',
        shortTextEn: 'Spot smoke plume, unusual heat, or burning smell immediately.',
        shortTextHi: 'धुआं, जलने की गंध या आग की लपटों को तुरंत भांपें।',
        narrationEn: 'Step 1: Notice the first signs of fire. Look for dark smoke, flickering flames, or strong acrid electrical odor.',
        narrationHi: 'पहला कदम: आग के शुरुआती संकेत पहचानें। काला धुआं, आग की लपटें या बिजली के जलने की गंध देखें।',
        actionType: 'detect_fire',
        iconName: 'Flame',
        unsafeWarning: {
          labelEn: 'Unsafe: Delaying Response',
          labelHi: 'असुरक्षित: आग को बढ़ता देखना',
          descriptionEn: 'Ignoring early smoke allows blaze to become uncontainable.',
          descriptionHi: 'धुएं को अनदेखा करने से आग तेजी से फैल सकती है।'
        },
        safeConfirmation: {
          labelEn: 'Spotted: Early Stage Fire',
          labelHi: 'पहचाना: शुरुआती आग',
          descriptionEn: 'Identified fire source at incipient stage.',
          descriptionHi: 'शुरुआती स्तर पर आग के स्रोत की पहचान।'
        },
        ruleBadge: 'Incipient Stage'
      },
      {
        stepNumber: 2,
        titleEn: 'Raise the Alarm Immediately',
        titleHi: 'तुरंत अलार्म बजाएं (Break-Glass)',
        shortTextEn: 'Break glass and strike the nearest manual call point alarm.',
        shortTextHi: 'पास लगे लाल फायर अलार्म का शीशा तोड़कर बटन दबाएं।',
        narrationEn: 'Step 2: Sound the fire alarm. Break the call point glass to alert everyone in the building to evacuate.',
        narrationHi: 'दूसरा कदम: तुरंत फायर अलार्म बजाएं। शीशा तोड़कर सायरन चालू करें ताकि सब सतर्क हो जाएं।',
        actionType: 'raise_alarm',
        iconName: 'BellRing',
        safeConfirmation: {
          labelEn: 'Safe: Siren Activated Plant-Wide',
          labelHi: 'सुरक्षित: पूरे प्लांट में सायरन सक्रिय',
          descriptionEn: 'Manual call point triggered; building alerted.',
          descriptionHi: 'फायर अलार्म बज उठा; सभी को चेतावनी मिली।'
        },
        ruleBadge: 'IS 2189 Alarm Code'
      },
      {
        stepNumber: 3,
        titleEn: 'Inform Responsible Personnel & Emergency Team',
        titleHi: 'इमरजेंसी टीम और फायर ब्रिगेड को सूचित करें',
        shortTextEn: 'Call plant emergency desk with exact building/floor location.',
        shortTextHi: 'कंट्रोल रूम या सुरक्षा दल को आग की सही जगह बताएं।',
        narrationEn: 'Step 3: Inform emergency coordinators. Tell them the exact plant module, floor, and what type of material is burning.',
        narrationHi: 'तीसरा कदम: आपातकालीन टीम को फोन करें। सही फ्लोर, कमरा नंबर और क्या जल रहा है, साफ बताएं।',
        actionType: 'call_emergency',
        iconName: 'PhoneCall',
        safeConfirmation: {
          labelEn: 'Dispatched: Fire Team En Route',
          labelHi: 'सुरक्षा दल मौके के लिए रवाना',
          descriptionEn: 'Emergency response team notified with exact location.',
          descriptionHi: 'फायर टीम को सही लोकेशन मिल गई।'
        },
        ruleBadge: 'Emergency R.A.C.E.'
      },
      {
        stepNumber: 4,
        titleEn: 'If Trained & Safe, Use Fire Extinguisher (P.A.S.S.)',
        titleHi: 'ट्रेनिंग होने पर अग्निशामक (P.A.S.S.) चलाएं',
        shortTextEn: 'Pull pin, Aim at base, Squeeze handle, Sweep side-to-side.',
        shortTextHi: 'पिन खींचें, आग की जड़ पर निशाना साधें, हैंडल दबाएं और झाड़ू की तरह घुमाएं।',
        narrationEn: 'Step 4: If the fire is small and you are trained, use the P.A.S.S. method: Pull the pin, Aim at the base of fire, Squeeze the lever, Sweep across the flames.',
        narrationHi: 'चौथा कदम: अगर आग छोटी है तो P.A.S.S. तरीका अपनाएं: पिन निकालें, आग की जड़ पर निशाना लगाएं, हैंडल दबाएं और दाएं-बाएं घुमाएं।',
        actionType: 'use_extinguisher',
        iconName: 'FlameKindling',
        unsafeWarning: {
          labelEn: 'Unsafe: Aiming at Top of Flames',
          labelHi: 'असुरक्षित: लपटों के ऊपर पाउडर मारना',
          descriptionEn: 'Powder blows away without putting out the fuel source.',
          descriptionHi: 'ऊपर मारने से आग नहीं बुझती, केवल पाउडर बर्बाद होता है।'
        },
        safeConfirmation: {
          labelEn: 'Safe: P.A.S.S. at Base of Fire',
          labelHi: 'सुरक्षित: आग की जड़ पर सही छिड़काव',
          descriptionEn: 'Dry chemical powder blankets fire base successfully.',
          descriptionHi: 'पाउडर ने आग की जड़ को पूरी तरह ढक दिया।'
        },
        ruleBadge: 'IS 15683 DCP'
      },
      {
        stepNumber: 5,
        titleEn: 'Maintain a Safe Escape Route Behind You',
        titleHi: 'निकलने का रास्ता हमेशा अपनी पीठ पीछे खुला रखें',
        shortTextEn: 'Never let fire block your exit door. Keep path clear at all times.',
        shortTextHi: 'आग को कभी अपने और निकास द्वार के बीच न आने दें।',
        narrationEn: 'Step 5: Always keep your back toward an open exit. Never let flames cut off your retreat path.',
        narrationHi: 'पांचवां कदम: अपनी पीठ हमेशा बाहर जाने वाले दरवाजे की तरफ रखें। कभी ऐसी जगह न फंसें जहां से निकलने का रास्ता बंद हो।',
        actionType: 'maintain_escape',
        iconName: 'ArrowUpRight',
        unsafeWarning: {
          labelEn: 'Trap Danger: Back to Fire',
          labelHi: 'खतरा: दरवाजे से दूर आग के अंदर जाना',
          descriptionEn: 'Risk of smoke engulfment with exit blocked.',
          descriptionHi: 'धुआं भरने पर रास्ता बंद होने का जानलेवा जोखिम।'
        },
        safeConfirmation: {
          labelEn: 'Safe: Clear Egress Path Guaranteed',
          labelHi: 'सुरक्षित: बाहर निकलने का रास्ता खुला',
          descriptionEn: 'Direct unhindered line of retreat to illuminated exit.',
          descriptionHi: 'बाहर निकलने वाले दरवाजे तक सीधा खुला रास्ता।'
        },
        ruleBadge: 'NFPA 101 Life Safety'
      },
      {
        stepNumber: 6,
        titleEn: 'Evacuate to Designated Assembly Point',
        titleHi: 'सुरक्षित असेंबली पॉइंट (एकत्र स्थल) पर जाएं',
        shortTextEn: 'Walk calmly to the muster ground outside. Wait for roll call.',
        shortTextHi: 'बिना हड़बड़ी के बाहर बने असेंबली पॉइंट पर जाकर खड़े हों।',
        narrationEn: 'Step 6: Evacuate calmly along the green exit path. Gather at the outdoor assembly point so supervisors can count everyone.',
        narrationHi: 'छठा कदम: हरी पट्टी वाले रास्ते से बाहर निकलें। असेंबली पॉइंट पर जाएं ताकि आपकी हाजिरी हो सके कि आप सुरक्षित हैं।',
        actionType: 'evacuate_muster',
        iconName: 'Users',
        safeConfirmation: {
          labelEn: 'Evacuated: Accounted for at Assembly Area',
          labelHi: 'सुरक्षित निकास: असेंबली पॉइंट पर गिनती',
          descriptionEn: 'All workers assembled at safe exterior muster zone.',
          descriptionHi: 'सभी मजदूर बाहर सुरक्षित खुले मैदान में एकत्रित।'
        },
        ruleBadge: 'Factory Act 1948'
      }
    ],
    quiz: {
      questionEn: 'When operating a fire extinguisher on a small fire, where should you aim the hose nozzle?',
      questionHi: 'छोटी आग पर अग्निशामक (सिलेंडर) चलाते समय नली का मुंह कहां रखना चाहिए?',
      scenarioContextEn: 'Industrial Fire Extinguishment (P.A.S.S. Protocol)',
      scenarioContextHi: 'औद्योगिक अग्नि सुरक्षा (P.A.S.S. नियम)',
      xpReward: 50,
      options: [
        {
          id: 'opt-fire-1',
          textEn: 'At the very top of the smoke and flames',
          textHi: 'धुएं और लपटों के बिल्कुल ऊपर',
          iconName: 'XCircle',
          isCorrect: false,
          explanationEn: 'Aiming at flames wastes the chemical without smothering the fuel.',
          explanationHi: 'लपटों के ऊपर मारने से आग की जड़ नहीं बुझती।'
        },
        {
          id: 'opt-fire-2',
          textEn: 'At the base of the fire where the material is burning',
          textHi: 'आग की जड़ (निचले हिस्से) पर जहां से आग उठ रही है',
          iconName: 'CheckCircle2',
          isCorrect: true,
          explanationEn: 'Correct! P.A.S.S. requires aiming at the base to cut off oxygen and extinguish the fuel source.',
          explanationHi: 'बहुत बढ़िया! आग की जड़ पर निशाना लगाने से ऑक्सीजन कटती है और आग बुझ जाती है।'
        },
        {
          id: 'opt-fire-3',
          textEn: 'Wave the nozzle in circles in the air above your head',
          textHi: 'हवा में ऊपर की तरफ गोल-गोल घुमाएं',
          iconName: 'AlertCircle',
          isCorrect: false,
          explanationEn: 'Spraying air does nothing to put out the burning surface.',
          explanationHi: 'हवा में छिड़कने से आग पर कोई असर नहीं होगा।'
        }
      ]
    }
  },

  'scenario-4-mining': {
    scenarioId: 'scenario-4-mining',
    scenarioNameEn: 'Mining Underground & Haulage Safety',
    scenarioNameHi: 'भूमिगत खनन और डंपर वाहन सुरक्षा',
    industry: 'Mining & Extraction',
    badge: 'DGMS Coal Mines Regs 2017',
    totalSteps: 6,
    steps: [
      {
        stepNumber: 1,
        titleEn: 'Wear Required Mining PPE & Cap Lamp',
        titleHi: 'माइनिंग हेलमेट, कैप लैंप और रिफ्लेक्टिव जैकेट पहनें',
        shortTextEn: 'Equip DGMS cap lamp, chin strap helmet, and high-visibility jacket.',
        shortTextHi: 'डीजीएमएस कैप लैंप, माइनिंग हेलमेट और चमकीली जैकेट पहनें।',
        narrationEn: 'Step 1: Always put on your DGMS-approved mining helmet with LED cap lamp and bright reflective jacket before going underground.',
        narrationHi: 'पहला कदम: खदान में उतरने से पहले कैप लैंप वाला हेलमेट और चमकने वाली जैकेट जरूर पहनें। अंधेरे में आपकी पहचान जरूरी है।',
        actionType: 'mining_ppe',
        iconName: 'HardHat',
        safeConfirmation: {
          labelEn: 'Safe: DGMS Mining PPE Equipped',
          labelHi: 'सुरक्षित: माइनिंग सुरक्षा किट तैयार',
          descriptionEn: 'Tested flameproof cap lamp and IS 2925 Type II helmet on.',
          descriptionHi: 'कैप लैंप और हेलमेट सही तरीके से लगे हैं।'
        },
        ruleBadge: 'DGMS CMR Reg 2017'
      },
      {
        stepNumber: 2,
        titleEn: 'Check the Work Area for Geological Hazards',
        titleHi: 'छत की दरारों और ढीले पत्थरों की जांच करें',
        shortTextEn: 'Inspect ceiling strata for loose rocks, fractures, and unsupported roof.',
        shortTextHi: 'खदान की छत पर दरारें, लटकते पत्थर और सपोर्ट की जांच करें।',
        narrationEn: 'Step 2: Examine the mine roof and sidewalls. Look for loose shale, rock fractures, and tell-tale indicators before walking in.',
        narrationHi: 'दूसरा कदम: खदान की छत और दीवारों को ध्यान से देखें। ढीले पत्थर या दरार दिखने पर तुरंत रुकें।',
        actionType: 'check_strata',
        iconName: 'Mountain',
        unsafeWarning: {
          labelEn: 'Fatal: Walking Under Unsupported Roof',
          labelHi: 'जानलेवा: बिना सपोर्ट वाली कच्ची छत के नीचे जाना',
          descriptionEn: 'Roof collapse / rockfall can crush workers without warning.',
          descriptionHi: 'अचानक चट्टान गिरने से दबने का बहुत बड़ा खतरा।'
        },
        safeConfirmation: {
          labelEn: 'Safe: Roof Strata Inspected & Tagged',
          labelHi: 'सुरक्षित: छत की जांच और सपोर्ट की पुष्टि',
          descriptionEn: 'Rock bolts verified; tell-tale convergence normal.',
          descriptionHi: 'रॉक बोल्ट और खूंटे सुरक्षित पाए गए।'
        },
        ruleBadge: 'DGMS Reg 123'
      },
      {
        stepNumber: 3,
        titleEn: 'Follow Designated Pedestrian Safe Routes',
        titleHi: 'हमेशा पैदल चलने वाले सुरक्षित रास्ते पर चलें',
        shortTextEn: 'Walk only inside marked green walkways, never in dumper tracks.',
        shortTextHi: 'सफेद/हरी पट्टी वाले पैदल रास्ते पर ही चलें, डंपर के रास्ते में न जाएं।',
        narrationEn: 'Step 3: Walk strictly on designated pedestrian walkways. Keep off the heavy vehicle haul roads.',
        narrationHi: 'तीसरा कदम: सिर्फ पैदल चलने के लिए बने रास्ते पर चलें। भारी डंपर गाड़ियों की सड़क पर कभी न चलें।',
        actionType: 'pedestrian_path',
        iconName: 'Footprints',
        safeConfirmation: {
          labelEn: 'Safe: Inside Pedestrian Fairway',
          labelHi: 'सुरक्षित: पैदल ट्रैक के अंदर',
          descriptionEn: 'Maintained separated route away from mobile equipment.',
          descriptionHi: 'गाड़ियों से अलग सुरक्षित रास्ते पर चलना।'
        },
        ruleBadge: 'Haul Road Rule'
      },
      {
        stepNumber: 4,
        titleEn: 'Stay Away from Restricted & Blind Danger Zones',
        titleHi: 'डंपर के ब्लाइंड स्पॉट और खतरे के दायरे से दूर रहें',
        shortTextEn: 'Keep 15m distance from 35-tonne dump truck turning circles.',
        shortTextHi: '35 टन के डंपर से कम से कम 15 मीटर की दूरी बनाए रखें।',
        narrationEn: 'Step 4: Maintain at least 15 meters clearance from dumpers. The driver cannot see you directly behind or beneath the wheel radius.',
        narrationHi: 'चौथा कदम: बड़े डंपर से 15 मीटर दूर रहें। ड्राइवर को गाड़ी के ठीक पीछे या पहियों के पास कुछ दिखाई नहीं देता।',
        actionType: 'blindspot_clear',
        iconName: 'ShieldAlert',
        unsafeWarning: {
          labelEn: 'Fatal: Standing in Dumper Blind Spot',
          labelHi: 'घातक: डंपर के ठीक पीछे खड़े होना',
          descriptionEn: 'Driver cannot see pedestrians in rear 6-meter sweep zone.',
          descriptionHi: 'ड्राइवर को पीछे खड़ा व्यक्ति बिल्कुल नहीं दिखता।'
        },
        safeConfirmation: {
          labelEn: 'Safe: In Designated Refuge Bay',
          labelHi: 'सुरक्षित: शरण स्थल (Refuge Bay) में खड़े होना',
          descriptionEn: 'Safely positioned in concrete refuge alcove.',
          descriptionHi: 'दीवार में बने सुरक्षित शेल्टर में खड़े होकर गाड़ी निकलने दी।'
        },
        ruleBadge: '15m Clearance Rule'
      },
      {
        stepNumber: 5,
        titleEn: 'Follow Site Supervisor & Sirdar Instructions',
        titleHi: 'माइनिंग सरदार और सुपरवाइजर के आदेशों का पालन करें',
        shortTextEn: 'Respect blast warnings, whistle codes, and supervisor signals.',
        shortTextHi: 'ब्लास्टिंग सायरन, सीटी के कोड और सरदार के इशारे का पालन करें।',
        narrationEn: 'Step 5: Follow all instructions from the Mining Sirdar. When you hear the blasting warning siren, immediately move to the shelter.',
        narrationHi: 'पांचवां कदम: माइनिंग सरदार के निर्देशों को मानें। ब्लास्टिंग की सीटी बजते ही तुरंत सुरक्षित बंकर में जाएं।',
        actionType: 'supervisor_signal',
        iconName: 'UserCheck',
        safeConfirmation: {
          labelEn: 'Safe: Sirdar Clearance Acknowledged',
          labelHi: 'सुरक्षित: सरदार की हरी झंडी',
          descriptionEn: 'Authorised entry granted under certified supervision.',
          descriptionHi: 'सरदार की अनुमति के बाद ही खदान में आगे बढ़े।'
        },
        ruleBadge: 'CMR Statutory Sirdar'
      },
      {
        stepNumber: 6,
        titleEn: 'Report Hazards & Strata Cracks Immediately',
        titleHi: 'खतरे और छत की दरारों की तुरंत रिपोर्ट करें',
        shortTextEn: 'Report loose rocks, gas smells, or blocked airways to safety desk.',
        shortTextHi: 'ढीली छत, गैस की महक या रुका हुआ रास्ता तुरंत कंट्रोल रूम को बताएं।',
        narrationEn: 'Step 6: Report any unusual rock noise, ceiling fractures, or gas odor immediately to the safety officer. Your report saves lives.',
        narrationHi: 'छठा कदम: छत से पत्थर गिरने की आवाज या गैस की बदबू आते ही सरदार को बताएं। आपकी सतर्कता कई जानें बचाती है।',
        actionType: 'report_hazard',
        iconName: 'AlertOctagon',
        safeConfirmation: {
          labelEn: 'Logged: Mine Safety Dispatch Informed',
          labelHi: 'सूचना दर्ज: सुरक्षा अधिकारी को रिपोर्ट',
          descriptionEn: 'Hazard marker placed; geotechnical team notified.',
          descriptionHi: 'खतरे का बोर्ड लगाया गया और टीम को सूचना दी।'
        },
        ruleBadge: 'Zero Harm DGMS'
      }
    ],
    quiz: {
      questionEn: 'A 35-tonne heavy mining dump truck is reversing along the haul road. Where must you stand?',
      questionHi: 'एक 35 टन का भारी माइनिंग डंपर पीछे आ रहा है। आपको कहां खड़े होना चाहिए?',
      scenarioContextEn: 'Mining Haulage Road Safety & Blind Spot Avoidance',
      scenarioContextHi: 'माइनिंग रोड सुरक्षा और डंपर के खतरे से बचाव',
      xpReward: 50,
      options: [
        {
          id: 'opt-mine-1',
          textEn: 'Directly behind the rear wheels waving your hands',
          textHi: 'डंपर के ठीक पीछे हाथ हिलाते हुए खड़े रहें',
          iconName: 'XCircle',
          isCorrect: false,
          explanationEn: 'The driver has a huge rear blind spot and cannot see anyone below the dump bed.',
          explanationHi: 'गलत! ड्राइवर को पीछे कुछ नहीं दिखता, दबने का भारी खतरा है।'
        },
        {
          id: 'opt-mine-2',
          textEn: 'Inside a designated refuge bay or at least 15 meters clear on the walkway',
          textHi: 'दीवार में बने रिफ्यूज शेल्टर में या कम से कम 15 मीटर दूर पैदल रास्ते पर',
          iconName: 'CheckCircle2',
          isCorrect: true,
          explanationEn: 'Correct! Staying 15m away in a refuge bay keeps you completely outside heavy vehicle blind spots.',
          explanationHi: 'बिल्कुल सही! 15 मीटर दूर सुरक्षित शेल्टर में खड़े रहने से आप डंपर की चपेट में नहीं आएंगे।'
        },
        {
          id: 'opt-mine-3',
          textEn: 'Try to quickly crawl under the vehicle chassis',
          textHi: 'गाड़ी के नीचे से जल्दी से निकलने की कोशिश करें',
          iconName: 'AlertCircle',
          isCorrect: false,
          explanationEn: 'Fatal action! Never go under or near moving industrial wheels.',
          explanationHi: 'अत्यंत घातक! चलती गाड़ी के नीचे जाना जानलेवा है।'
        }
      ]
    }
  },

  'scenario-5-machinery': {
    scenarioId: 'scenario-5-machinery',
    scenarioNameEn: 'Machinery Guarding & Emergency Stop',
    scenarioNameHi: 'मशीनरी सुरक्षा गार्ड और इमरजेंसी स्टॉप',
    industry: 'Heavy Engineering',
    badge: 'IS 9474 / ISO 13850',
    totalSteps: 6,
    steps: [
      {
        stepNumber: 1,
        titleEn: 'Identify Machine Hazards & In-Running Nips',
        titleHi: 'मशीन के घूमने वाले हिस्सों और खिंचाव के खतरे को पहचानें',
        shortTextEn: 'Spot rotating rollers, belts, gears, and pinch-points.',
        shortTextHi: 'घूमने वाले रोलर, गियर, बेल्ट और दबने वाली जगहों को पहचानें।',
        narrationEn: 'Step 1: Identify nip points. Moving rollers and conveyor belts can instantly trap fingers, clothing, and limbs.',
        narrationHi: 'पहला कदम: मशीन के घूमने वाले गियर और रोलर को पहचानें। ये उंगलियों और कपड़ों को पलक झपकते अंदर खींच सकते हैं।',
        actionType: 'identify_nip',
        iconName: 'Cog',
        unsafeWarning: {
          labelEn: 'Danger: Exposed Pinch Point',
          labelHi: 'खतरा: खुला घूमने वाला रोलर',
          descriptionEn: 'Rotating nip points without barriers draw in human limbs.',
          descriptionHi: 'बिना जाली के रोलर में हाथ खिंचने का भारी खतरा।'
        },
        safeConfirmation: {
          labelEn: 'Hazard Mapped: High Nip Risk',
          labelHi: 'खतरा पहचाना: रोलर खिंचाव क्षेत्र',
          descriptionEn: 'Identified rotating perimeter boundary.',
          descriptionHi: 'मशीन के खतरनाक क्षेत्र की पहचान की गई।'
        },
        ruleBadge: 'IS 9474 Guarding'
      },
      {
        stepNumber: 2,
        titleEn: 'Check & Secure Machine Guards Before Powering',
        titleHi: 'मशीन चालू करने से पहले सुरक्षा जाली (गार्ड) जांचें',
        shortTextEn: 'Ensure physical wire mesh guards and interlock switches are in place.',
        shortTextHi: 'सुनिश्चित करें कि लोहे की जाली बंद है और सेफ्टी स्विच लगा है।',
        narrationEn: 'Step 2: Check all machine guards. The fixed wire mesh guard must be locked tight so nobody can touch moving gears.',
        narrationHi: 'दूसरा कदम: सुरक्षा जाली चेक करें। लोहे का गार्ड पूरी तरह बंद होना चाहिए ताकि कोई भी हाथ अंदर न डाल सके।',
        actionType: 'check_guards',
        iconName: 'Shield',
        safeConfirmation: {
          labelEn: 'Safe: Interlocked Mesh Guard Locked',
          labelHi: 'सुरक्षित: सेफ्टी जाली बंद और लॉक',
          descriptionEn: 'Physical barrier in place; safety interlock circuit armed.',
          descriptionHi: 'लोहे की सुरक्षा जाली पूरी तरह से बंद पाई गई।'
        },
        ruleBadge: 'Interlock ISO 14119'
      },
      {
        stepNumber: 3,
        titleEn: 'Keep Hands & Body Clear of Moving Parts',
        titleHi: 'ढीले कपड़े न पहनें और हाथ दूर रखें',
        shortTextEn: 'Roll up sleeves, tuck in loose clothes, and stand behind the line.',
        shortTextHi: 'आस्तीन मोड़ें, ढीले कपड़े न पहनें और पीली सुरक्षा रेखा के पीछे रहें।',
        narrationEn: 'Step 3: Never wear loose clothing, jewelry, or open hair near rotating machines. Keep your body behind the yellow floor line.',
        narrationHi: 'तीसरा कदम: ढीले कपड़े, मफलर या खुला गमछा कभी न पहनें। पीली सुरक्षा लाइन के पीछे खड़े होकर ही काम करें।',
        actionType: 'no_loose_clothing',
        iconName: 'UserX',
        unsafeWarning: {
          labelEn: 'Fatal: Loose Sleeves Near Spindle',
          labelHi: 'घातक: ढीली आस्तीन या गमछा लटकना',
          descriptionEn: 'Fabric caught by rotating shaft pulls operator into machine.',
          descriptionHi: 'कपड़ा फंसने से पूरा शरीर मशीन में खिंच जाता है।'
        },
        safeConfirmation: {
          labelEn: 'Safe: Tight Attire Behind Yellow Line',
          labelHi: 'सुरक्षित: मुड़ी आस्तीन और पीली रेखा के पीछे',
          descriptionEn: 'Zero entanglement hazards; proper operator clearance.',
          descriptionHi: 'कपड़े बिल्कुल सुरक्षित और हाथ दूर रखे गए हैं।'
        },
        ruleBadge: 'IS Safe Behavior'
      },
      {
        stepNumber: 4,
        titleEn: 'Follow Authorized Start/Stop Procedures',
        titleHi: 'सही तरीके से मशीन चालू और बंद करें',
        shortTextEn: 'Sound pre-start warning buzzer and press green start only when clear.',
        shortTextHi: 'स्टार्ट का हूटर बजाएं और रास्ता साफ होने पर ही हरा बटन दबाएं।',
        narrationEn: 'Step 4: Follow authorized starting steps. Sound the warning horn first so other workers step back, then press start.',
        narrationHi: 'चौथा कदम: मशीन चालू करने से पहले चेतावनी हूटर बजाएं ताकि आसपास के लोग हट जाएं, फिर हरा बटन दबाएं।',
        actionType: 'start_stop_procedure',
        iconName: 'PlayCircle',
        safeConfirmation: {
          labelEn: 'Safe: Pre-Warning Buzzer Sounded',
          labelHi: 'सुरक्षित: चेतावनी सायरन के साथ शुरुआत',
          descriptionEn: 'Area verified clear before motor drive energized.',
          descriptionHi: 'सबके हटने के बाद ही मोटर चालू की गई।'
        },
        ruleBadge: 'SOP Machine Start'
      },
      {
        stepNumber: 5,
        titleEn: 'For Maintenance, Follow Authorized LOTO Isolation',
        titleHi: 'सफाई या मरम्मत से पहले ताला (LOTO) लगाएं',
        shortTextEn: 'Never repair a running machine. Lock main power switch with padlock.',
        shortTextHi: 'चलती मशीन में हाथ कभी न डालें। मेन स्विच पर अपना ताला लगाएं।',
        narrationEn: 'Step 5: Before any cleaning or maintenance, shut down the power and apply your personal Lockout/Tagout padlock. Never repair while running.',
        narrationHi: 'पांचवां कदम: सफाई या मरम्मत से पहले मेन स्विच बंद करें और ताला लगाएं। चलती मशीन में कभी हाथ न डालें।',
        actionType: 'maintenance_loto',
        iconName: 'Lock',
        unsafeWarning: {
          labelEn: 'Fatal: Reaching Inside Running Rollers',
          labelHi: 'घातक: चलती मशीन में हाथ डालना',
          descriptionEn: 'Severe crushing or amputation within milliseconds.',
          descriptionHi: 'हाथ कटने या कुचले जाने का अत्यंत गंभीर जोखिम।'
        },
        safeConfirmation: {
          labelEn: 'Safe: Energy Zero Stored (LOTO)',
          labelHi: 'सुरक्षित: पावर बंद और ताला लगा',
          descriptionEn: 'Zero mechanical energy verified before servicing.',
          descriptionHi: 'मशीन पूरी तरह शांत और स्विच पर ताला लगा है।'
        },
        ruleBadge: 'LOTO Standard'
      },
      {
        stepNumber: 6,
        titleEn: 'Report Unsafe Machine Conditions & Test E-Stop',
        titleHi: 'खराबी की रिपोर्ट करें और इमरजेंसी स्टॉप का उपयोग जानें',
        shortTextEn: 'Know where the red mushroom E-Stop button is. Strike to stop immediately.',
        shortTextHi: 'लाल इमरजेंसी स्टॉप बटन पहचानें। किसी भी खतरे पर इसे तुरंत दबाएं।',
        narrationEn: 'Step 6: Know the location of the red mushroom Emergency Stop button. If abnormal noise occurs or someone is in danger, hit it immediately.',
        narrationHi: 'छठा कदम: लाल इमरजेंसी स्टॉप बटन की जगह हमेशा याद रखें। कोई भी खतरा दिखने पर इसे तुरंत जोर से दबाएं।',
        actionType: 'estop_report',
        iconName: 'OctagonAlert',
        safeConfirmation: {
          labelEn: 'Safe: E-Stop Tested & Functional',
          labelHi: 'सुरक्षित: इमरजेंसी स्टॉप की जांच पूरी',
          descriptionEn: 'Emergency stop circuit trips power in under 200 milliseconds.',
          descriptionHi: 'लाल बटन दबाते ही मशीन तुरंत रुक जाती है।'
        },
        ruleBadge: 'ISO 13850 E-Stop'
      }
    ],
    quiz: {
      questionEn: 'A piece of material has jammed inside rotating rollers while the machine is running. What must you do?',
      questionHi: 'मशीन चालू है और घूमने वाले रोलर में कपड़ा या सामान फंस गया है। आपको क्या करना चाहिए?',
      scenarioContextEn: 'Industrial Machinery Safety & Lockout/Tagout (LOTO)',
      scenarioContextHi: 'औद्योगिक मशीनरी सुरक्षा और तालाबंदी (LOTO)',
      xpReward: 50,
      options: [
        {
          id: 'opt-mach-1',
          textEn: 'Reach in with your hand or a screwdriver while it continues rotating',
          textHi: 'मशीन चलते हुए ही हाथ या पेचकस से सामान खींचने की कोशिश करें',
          iconName: 'XCircle',
          isCorrect: false,
          explanationEn: 'Extreme danger of severe crush injury or amputation in fractions of a second!',
          explanationHi: 'बहुत बड़ा खतरा! हाथ रोलर में फंसकर कट या कुचल सकता है।'
        },
        {
          id: 'opt-mach-2',
          textEn: 'Hit Emergency Stop, cut power, lock out with personal padlock (LOTO), then inspect',
          textHi: 'इमरजेंसी स्टॉप दबाएं, मेन पावर बंद कर ताला (LOTO) लगाएं, फिर सामान निकालें',
          iconName: 'CheckCircle2',
          isCorrect: true,
          explanationEn: 'Correct! Always hit E-Stop and execute LOTO isolation before clearing jams or touching rollers.',
          explanationHi: 'बिल्कुल सही! इमरजेंसी स्टॉप दबाकर और ताला लगाकर ही मशीन को छूना चाहिए।'
        },
        {
          id: 'opt-mach-3',
          textEn: 'Speed up the motor hoping it grinds the jam through',
          textHi: 'मशीन की स्पीड और तेज कर दें ताकि सामान पिस जाए',
          iconName: 'AlertCircle',
          isCorrect: false,
          explanationEn: 'Increasing speed creates mechanical fire, flying shrapnel, and motor burnout.',
          explanationHi: 'गलत! इससे मशीन टूट सकती है और आग या धमाका हो सकता है।'
        }
      ]
    }
  }
};
