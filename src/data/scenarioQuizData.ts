export interface QuizQuestion {
  id: string;
  questionEn: string;
  questionHi: string;
  optionsEn: string[];
  optionsHi: string[];
  correctIndex: number;
  explanationEn: string;
  explanationHi: string;
}

export interface ScenarioQuiz {
  scenarioId: string;
  titleEn: string;
  titleHi: string;
  industryEn: string;
  industryHi: string;
  questions: QuizQuestion[];
}

export const SCENARIO_QUIZZES: Record<string, ScenarioQuiz> = {
  'scenario-1-ppe': {
    scenarioId: 'scenario-1-ppe',
    titleEn: 'PPE & Workplace Hazard Safety Quiz',
    titleHi: 'पीपीई और बुनियादी कार्यस्थल सुरक्षा प्रश्नोत्तरी',
    industryEn: 'General Manufacturing Workshop',
    industryHi: 'सामान्य निर्माण कार्यशाला',
    questions: [
      {
        id: 'ppe-q1',
        questionEn: 'According to IS 2925, what is the primary protective function of an industrial safety helmet (hard hat)?',
        questionHi: 'IS 2925 के अनुसार, औद्योगिक सुरक्षा हेलमेट का प्राथमिक सुरक्षात्मक कार्य क्या है?',
        optionsEn: [
          'To protect against rain and harsh sunlight only',
          'To protect the head against impact and penetration from falling or flying objects',
          'To serve as an identification badge for factory visitors',
          'To insulate the worker from ambient room noise'
        ],
        optionsHi: [
          'केवल बारिश और धूप से बचाव के लिए',
          'ऊपर से गिरने वाली वस्तुओं के प्रभाव और प्रवेश से सिर की रक्षा करना',
          'कारखाने में आगंतुकों के लिए पहचान पत्र के रूप में कार्य करना',
          'कमरे के शोर से श्रमिक को अलग रखना'
        ],
        correctIndex: 1,
        explanationEn: 'IS 2925 certified industrial helmets are engineered to absorb overhead impact energy and resist sharp penetration hazards across industrial and mining work zones.',
        explanationHi: 'IS 2925 प्रमाणित हेलमेट औद्योगिक और खनन क्षेत्रों में ऊपर से गिरने वाली भारी वस्तुओं के प्रभाव को सोखने और प्रवेश का विरोध करने के लिए डिज़ाइन किए गए हैं।'
      },
      {
        id: 'ppe-q2',
        questionEn: 'What is the Indian Standard requirement for high-visibility reflective vests used in industrial transit zones?',
        questionHi: 'औद्योगिक आवागमन क्षेत्रों में प्रयुक्त हाई-विजिबिलिटी रिफ्लेक्टिव वेस्ट के लिए कौन सा भारतीय मानक लागू है?',
        optionsEn: [
          'IS 15809 specifying retro-reflective bands with 360-degree conspicuity',
          'IS 1000 for standard cotton shirts without reflectors',
          'Any bright colored t-shirt chosen by the worker',
          'No standard exists; high-visibility vests are purely optional'
        ],
        optionsHi: [
          'IS 15809 जो 360-डिग्री दृश्यता के साथ रेट्रो-रिफ्लेक्टिव बैंड निर्दिष्ट करता है',
          'बिना रिफ्लेक्टर वाले साधारण सूती शर्ट के लिए IS 1000',
          'श्रमिक द्वारा चुनी गई कोई भी चमकीले रंग की टी-शर्ट',
          'कोई मानक नहीं है; रिफ्लेक्टिव वेस्ट पूरी तरह से वैकल्पिक है'
        ],
        correctIndex: 0,
        explanationEn: 'IS 15809 mandates high-visibility garments with retro-reflective tape ensuring operators of forklifts and dumpers can spot personnel from all directions in low light.',
        explanationHi: 'IS 15809 रेट्रो-रिफ्लेक्टिव टेप वाले उच्च-दृश्यता कपड़ों को अनिवार्य करता है ताकि कम रोशनी में भारी वाहनों के ऑपरेटर कर्मियों को दूर से देख सकें।'
      },
      {
        id: 'ppe-q3',
        questionEn: 'If an exposed 440V live feeder cable with torn insulation is discovered on the workshop floor, what is the immediate first action?',
        questionHi: 'यदि कार्यशाला के फर्श पर कटी हुई इंसुलेशन वाली नंगी 440V बिजली केबल मिले, तो पहली कार्रवाई क्या होनी चाहिए?',
        optionsEn: [
          'Attempt to quickly move the live cable with bare hands',
          'Cover it with cardboard and ignore it',
          'Report immediately, warn nearby workers to clear the area, and request authorized LOTO isolation',
          'Pour water over the cable to cool it down'
        ],
        optionsHi: [
          'नंगे हाथों से केबल को जल्दी से हटाने का प्रयास करना',
          'इसे गत्ते से ढक देना और नजरअंदाज करना',
          'तुरंत रिपोर्ट करें, आसपास के श्रमिकों को दूर हटाएं और अधिकृत LOTO आइसोलेशन का अनुरोध करें',
          'केबल को ठंडा करने के लिए उस पर पानी डालना'
        ],
        correctIndex: 2,
        explanationEn: 'Never touch live cables. The immediate duty is warning fellow personnel, securing the perimeter, and reporting for certified Lockout/Tagout de-energization.',
        explanationHi: 'जीवंत केबल को कभी न छुएं। साथी कर्मियों को चेतावनी देना, क्षेत्र को सुरक्षित करना और प्रमाणित LOTO आइसोलेशन के लिए रिपोर्ट करना अनिवार्य है।'
      },
      {
        id: 'ppe-q4',
        questionEn: 'According to IS 9474 and machine guarding principles, why must physical perimeter barriers be erected around rotating equipment?',
        questionHi: 'IS 9474 और मशीन सुरक्षा सिद्धांतों के अनुसार, घूमने वाले उपकरणों के चारों ओर सुरक्षा बैरियर क्यों लगाया जाना चाहिए?',
        optionsEn: [
          'To prevent inadvertent physical contact with moving parts and nip points',
          'To hide the machinery from management inspectors',
          'To hold tools and worker lunchboxes',
          'To restrict airflow into the machine'
        ],
        optionsHi: [
          'घूमने वाले हिस्सों और पिंच पॉइंट के साथ अनपेक्षित शारीरिक संपर्क को रोकने के लिए',
          'प्रबंधन निरीक्षकों से मशीनरी को छिपाने के लिए',
          'औजार और टिफिन बॉक्स रखने के लिए',
          'मशीन में हवा के प्रवाह को प्रतिबंधित करने के लिए'
        ],
        correctIndex: 0,
        explanationEn: 'Fixed perimeter guarding ensures that workers cannot accidentally trip, reach, or fall into hazardous in-running pinch points or rotating mechanical spindles.',
        explanationHi: 'स्थिर सुरक्षा बैरियर यह सुनिश्चित करता है कि श्रमिक गलती से फिसलकर या झुककर खतरनाक घूमने वाले हिस्सों या पिंच पॉइंट में न फंसें।'
      },
      {
        id: 'ppe-q5',
        questionEn: 'Why are steel-toe safety footwear (IS 15298) mandatory in manufacturing and material handling areas?',
        questionHi: 'विनिर्माण और सामग्री प्रबंधन क्षेत्रों में स्टील-टो सुरक्षा जूते (IS 15298) क्यों अनिवार्य हैं?',
        optionsEn: [
          'They allow workers to run faster during work shifts',
          'To provide toe crush protection against heavy dropped objects and sole puncture resistance',
          'They are fashion accessories required by the uniform code',
          'To prevent shoelaces from untying'
        ],
        optionsHi: [
          'वे श्रमिकों को कार्य शिफ्ट के दौरान तेजी से दौड़ने की अनुमति देते हैं',
          'भारी गिरने वाली वस्तुओं से पैर के अंगूठे को कुचलने से बचाना और तलवे में कील/लोहे के प्रवेश को रोकना',
          'वे वर्दी कोड द्वारा आवश्यक फैशन के सामान हैं',
          'जूते के फीते खुलने से रोकने के लिए'
        ],
        correctIndex: 1,
        explanationEn: 'IS 15298 steel-toe boots withstand 200 Joules of drop impact and feature anti-perforation steel midsole inserts preventing puncture from sharp metallic workshop debris.',
        explanationHi: 'IS 15298 स्टील-टो जूते 200 जूल प्रभाव सहन करते हैं और तलवे में स्टील प्लेट के कारण नुकीली कील या लोहे के टुकड़ों से पैर की रक्षा करते हैं।'
      }
    ]
  },

  'scenario-2-fire': {
    scenarioId: 'scenario-2-fire',
    titleEn: 'Industrial Fire Safety & Emergency Evacuation Quiz',
    titleHi: 'औद्योगिक अग्नि सुरक्षा और आपातकालीन निकासी प्रश्नोत्तरी',
    industryEn: 'Industrial Facility & Warehouse',
    industryHi: 'औद्योगिक संयंत्र और गोदाम',
    questions: [
      {
        id: 'fire-q1',
        questionEn: 'What does the standard P.A.S.S. protocol stand for when operating a portable fire extinguisher?',
        questionHi: 'पोर्टेबल अग्निशामक यंत्र (Fire Extinguisher) चलाते समय P.A.S.S. नियम का क्या अर्थ है?',
        optionsEn: [
          'Push, Alert, Spray, Stop',
          'Pull the pin, Aim at base of fire, Squeeze the handle, Sweep side-to-side',
          'Power off, Alarm call, Shout, Search',
          'Press button, Approach closely, Shake bottle, Stand back'
        ],
        optionsHi: [
          'Push, Alert, Spray, Stop',
          'Pull (पिन खींचें), Aim (आग के आधार पर निशाना साधें), Squeeze (हैंडल दबाएं), Sweep (दाएं-बाएं घुमाएं)',
          'Power off, Alarm call, Shout, Search',
          'Press button, Approach closely, Shake bottle, Stand back'
        ],
        correctIndex: 1,
        explanationEn: 'P.A.S.S. is the globally recognized method: Pull the pin, Aim at the base of flames (not top of smoke), Squeeze the discharge trigger, and Sweep across the width of the fire.',
        explanationHi: 'P.A.S.S. नियम: 1. पिन खींचें (Pull), 2. लपटों के आधार पर निशाना लगाएं (Aim), 3. लीवर दबाएं (Squeeze), 4. आधार पर दाएं-बाएं छिड़कें (Sweep)।'
      },
      {
        id: 'fire-q2',
        questionEn: 'Which fire extinguisher type is statutory under IS 15683 for electrical equipment panels and flammable liquid fires?',
        questionHi: 'विद्युत उपकरणों और ज्वलनशील तरल पदार्थों की आग के लिए IS 15683 के तहत कौन सा अग्निशामक उपयुक्त है?',
        optionsEn: [
          'Plain water stream extinguisher (Class A only)',
          'Carbon Dioxide (CO2) or Dry Chemical Powder (ABC / DCP) extinguisher',
          'Wet chemical cooking oil extinguisher only',
          'Sand bucket containing wet mud'
        ],
        optionsHi: [
          'साधारण पानी का अग्निशामक (केवल क्लास ए)',
          'कार्बन डाइऑक्साइड (CO2) या ड्राई केमिकल पाउडर (ABC / DCP) अग्निशामक',
          'केवल रसोई के तेल के लिए वेट केमिकल',
          'गीली मिट्टी वाली रेत की बाल्टी'
        ],
        correctIndex: 1,
        explanationEn: 'Water conducts electricity and can electrocute the user. Class B & C fires require non-conductive Dry Chemical Powder (DCP) or CO2 gas to smother the fire without conducting voltage.',
        explanationHi: 'पानी बिजली का सुचालक है और करंट का झटका दे सकता है। विद्युत आग के लिए गैर-सुचालक CO2 या ABC ड्राई केमिकल पाउडर आवश्यक है।'
      },
      {
        id: 'fire-q3',
        questionEn: 'Upon detecting an electrical transformer overheating and smoke appearing in a workshop, what is your very first emergency priority?',
        questionHi: 'कार्यशाला में ट्रांसफार्मर के अधिक गर्म होने और धुआं निकलने पर आपकी सबसे पहली आपातकालीन प्राथमिकता क्या होनी चाहिए?',
        optionsEn: [
          'Attempt to take photos for social media',
          'Immediately activate the manual break-glass fire alarm to alert everyone and summon the emergency team',
          'Lock the doors and leave without informing anyone',
          'Open the electrical enclosure to touch the components'
        ],
        optionsHi: [
          'सोशल मीडिया के लिए तस्वीरें लेने का प्रयास करना',
          'तुरंत मैनुअल कॉल पॉइंट (फायर अलार्म) बजाकर सभी को सतर्क करना और आपातकालीन टीम को बुलाना',
          'दरवाजे बंद करके बिना किसी को बताए भाग जाना',
          'पुर्जों को छूने के लिए विद्युत पैनल खोलना'
        ],
        correctIndex: 1,
        explanationEn: 'Sounding the alarm ensures the entire facility is alerted to evacuate early and the industrial fire response team is immediately dispatched before the blaze grows uncontrollable.',
        explanationHi: 'अलार्म सक्रिय करने से पूरे संयंत्र को समय रहते खाली कराया जा सकता है और आग विकराल होने से पहले आपातकालीन टीम पहुंच सकती है।'
      },
      {
        id: 'fire-q4',
        questionEn: 'Why is it a severe statutory violation (IS 2190) to store pallet boxes or scrap crates in front of emergency fire exit doors?',
        questionHi: 'आपातकालीन निकास दरवाजों के सामने बक्से या सामान रखना IS 2190 के तहत गंभीर सुरक्षा उल्लंघन क्यों है?',
        optionsEn: [
          'It makes the factory look untidy during audits only',
          'Obstructions block rapid egress during dense smoke and panic, trapping occupants inside the burning facility',
          'The pallets might get dusty',
          'It prevents natural sunlight from entering through the exit'
        ],
        optionsHi: [
          'यह केवल ऑडिट के दौरान कारखाने को गन्दा दिखाता है',
          'रुकावटें धुएं और घबराहट में निकासी को रोकती हैं, जिससे लोग आग में अंदर फंस सकते हैं',
          'बक्सों पर धूल जम सकती है',
          'यह खिड़की से धूप आने से रोकता है'
        ],
        correctIndex: 1,
        explanationEn: 'In a real fire, blackout conditions and smoke inhalation reduce visibility to near zero. Any obstacle in front of exit doors causes deadly pile-ups and prevents safe evacuation.',
        explanationHi: 'आग के दौरान धुआं दृश्यता को शून्य कर देता है। निकास मार्ग में कोई भी रुकावट जानलेवा भगदड़ पैदा कर सकती है और बाहर निकलने से रोकती है।'
      },
      {
        id: 'fire-q5',
        questionEn: 'After following the illuminated green evacuation arrows and reaching outside, what is the mandatory next step?',
        questionHi: 'इमरजेंसी निकास मार्ग से बाहर निकलने के बाद अनिवार्य रूप से अगला कदम क्या होना चाहिए?',
        optionsEn: [
          'Immediately re-enter the building to retrieve personal belongings and toolboxes',
          'Proceed directly to the designated Emergency Safe Assembly Point (Muster Point) for roll-call head count',
          'Go home directly without reporting to the safety warden',
          'Crowd around the main entrance to watch firefighters'
        ],
        optionsHi: [
          'सामान और औजार वापस लेने के लिए तुरंत जलती हुई इमारत में वापस जाना',
          'हाजिरी और गिनती (Headcount) के लिए सीधे निर्धारित सुरक्षित असेंबली पॉइंट (Muster Point) पर पहुंचना',
          'सुरक्षा वार्डन को बताए बिना सीधे घर चले जाना',
          'अग्निशामकों को देखने के लिए मुख्य द्वार पर भीड़ लगाना'
        ],
        correctIndex: 1,
        explanationEn: 'Personnel must report to the designated safe muster assembly zone so incident commanders can verify through roll-call that no worker remains trapped inside the structure.',
        explanationHi: 'कर्मियों को निर्धारित असेंबली पॉइंट पर एकत्रित होना चाहिए ताकि हाजिरी से यह सुनिश्चित किया जा सके कि कोई भी श्रमिक इमारत के अंदर फंसा नहीं है।'
      }
    ]
  },

  'scenario-3-electrical': {
    scenarioId: 'scenario-3-electrical',
    titleEn: 'High-Voltage Electrical Safety Quiz',
    titleHi: 'हाई-वोल्टेज विद्युत सुरक्षा प्रश्नोत्तरी',
    industryEn: 'Electrical Substation & Switchgear',
    industryHi: 'विद्युत सबस्टेशन और स्विचगियर',
    questions: [
      {
        id: 'elec-q1',
        questionEn: 'Under Central Electricity Authority (CEA) Regulations 2010, what is the mandatory requirement before carrying out work on electrical switchboards?',
        questionHi: 'केंद्रीय विद्युत प्राधिकरण (CEA) विनियम 2010 के अनुसार, विद्युत स्विचबोर्ड पर कार्य करने से पहले क्या अनिवार्य है?',
        optionsEn: [
          'Work can proceed live if the worker is in a hurry',
          'De-energize, isolate from all sources, verify dead with a calibrated detector, and lock out/tag out (LOTO)',
          'Splash tap water on the contacts to clean them',
          'Rely on memory without verifying zero voltage'
        ],
        optionsHi: [
          'यदि श्रमिक जल्दी में हो तो चालू लाइन पर काम किया जा सकता है',
          'विद्युत आपूर्ति बंद करें (De-energize), आइसोलेट करें, शून्य वोल्टेज की जांच करें और LOTO लगाएं',
          'संपर्कों को साफ करने के लिए नल का पानी छिड़कें',
          'वोल्टेज की जांच किए बिना केवल याददाश्त पर भरोसा करें'
        ],
        correctIndex: 1,
        explanationEn: 'CEA Regulation 30 mandates complete electrical isolation, testing with verified detectors to prove dead condition, and applying individual LOTO padlocks before any touching of conductors.',
        explanationHi: 'CEA विनियम 30 पूर्ण आइसोलेशन, वोल्टेज डिटेक्टर से शून्य वोल्टेज की पुष्टि और कंडक्टरों को छूने से पहले LOTO पैडलॉक लगाना अनिवार्य करता है।'
      },
      {
        id: 'elec-q2',
        questionEn: 'What standard governs dielectric rubber insulating gloves used by electrical technicians in India?',
        questionHi: 'भारत में इलेक्ट्रिकल तकनीशियनों द्वारा उपयोग किए जाने वाले इन्सुलेटिंग दस्तानों को कौन सा मानक नियंत्रित करता है?',
        optionsEn: [
          'IS 4770 (Dielectric Insulating Gloves) tested for specific operating voltage ratings',
          'IS 500 for ordinary gardening cotton gloves',
          'Household latex washing gloves',
          'Any wool winter mittens'
        ],
        optionsHi: [
          'IS 4770 (डाइइलेक्ट्रिक इन्सुलेटिंग ग्लव्स) जो विशिष्ट ऑपरेटिंग वोल्टेज के लिए परीक्षित होते हैं',
          'साधारण सूती बागवानी दस्तानों के लिए IS 500',
          'घरेलू रबर के बर्तन धोने वाले दस्ताने',
          'सर्दियों के ऊनी दस्ताने'
        ],
        correctIndex: 0,
        explanationEn: 'IS 4770 certifies seamless rubber electrical gloves categorized into voltage classes (e.g. Class 0 up to 1000V) that protect electricians against contact electrocution.',
        explanationHi: 'IS 4770 प्रमाणित रबर दस्ताने विशिष्ट वोल्टेज (जैसे 1000V तक क्लास 0) के लिए प्रमाणित होते हैं और इलेक्ट्रीशियन को घातक करंट से बचाते हैं।'
      },
      {
        id: 'elec-q3',
        questionEn: 'Why is a conductive water puddle in front of a 440V distribution switchgear an immediate critical hazard?',
        questionHi: '440V विद्युत स्विचगियर के सामने पानी भरा होना एक गंभीर और जानलेवा खतरा क्यों है?',
        optionsEn: [
          'It makes the shoes wet and uncomfortable',
          'Water dramatically lowers electrical contact resistance, creating a deadly pathway for ground fault current and arc blast through the worker',
          'It causes corrosion to the ceiling lights',
          'Water attracts mosquitoes into the substation'
        ],
        optionsHi: [
          'यह केवल जूते गीले और असुविधाजनक बनाता है',
          'पानी विद्युत प्रतिरोध को बहुत कम कर देता है, जिससे ऑपरेटर के शरीर से घातक करंट प्रवाहित होने का खतरा बढ़ जाता है',
          'यह छत की लाइटों में जंग लगाता है',
          'पानी सबस्टेशन में मच्छरों को आकर्षित करता है'
        ],
        correctIndex: 1,
        explanationEn: 'Moisture on substation floors drastically reduces human body contact resistance to ground. An arc or leakage will conduct directly through the standing operator with fatal consequences.',
        explanationHi: 'फर्श पर पानी जमीन से प्रतिरोध को लगभग खत्म कर देता है। किसी भी स्पार्क या लीकेज पर पानी के संपर्क में खड़े व्यक्ति की करंट से तुरंत मृत्यु हो सकती है।'
      },
      {
        id: 'elec-q4',
        questionEn: 'What does the safety procedure LOTO stand for in industrial plant maintenance?',
        questionHi: 'औद्योगिक संयंत्र रखरखाव में सुरक्षा प्रक्रिया LOTO का क्या अर्थ है?',
        optionsEn: [
          'Line Off / Time On',
          'Lockout / Tagout (Securing energy isolating devices with physical padlock and warning tag)',
          'Look Out / Take Over',
          'Low Output / Thermal Overload'
        ],
        optionsHi: [
          'Line Off / Time On',
          'Lockout / Tagout (ऊर्जा आइसोलेटर को पैडलॉक से लॉक करना और चेतावनी टैग लगाना)',
          'Look Out / Take Over',
          'Low Output / Thermal Overload'
        ],
        correctIndex: 1,
        explanationEn: 'Lockout/Tagout (LOTO) ensures hazardous energy sources (electrical, mechanical, hydraulic) remain physically locked in the OFF state so nobody can re-energize the line while workers are inside.',
        explanationHi: 'LOTO (Lockout/Tagout) यह सुनिश्चित करता है कि मुख्य स्विच को ताले (Padlock) और चेतावनी टैग से बंद रखा जाए ताकि काम के दौरान कोई अन्य व्यक्ति लाइन चालू न कर सके।'
      },
      {
        id: 'elec-q5',
        questionEn: 'If statutory high-voltage danger warning signage (IS 2551) is obstructed by leaning scrap or toolboxes, what must be done?',
        questionHi: 'यदि 440V हाई-वोल्टेज चेतावनी बोर्ड (IS 2551) कबाड़ या टूलबॉक्स से ढका हुआ है, तो क्या करना चाहिए?',
        optionsEn: [
          'Leave it covered because experienced workers already know where panels are',
          'Immediately clear the obstruction to maintain unobstructed line-of-sight to the statutory hazard warning',
          'Paint over the warning sign with dark paint',
          'Remove the sign completely and discard it'
        ],
        optionsHi: [
          'इसे ढका रहने दें क्योंकि पुराने कर्मचारी जानते हैं कि स्विचगियर कहां है',
          'चेतावनी बोर्ड के सामने से तुरंत रुकावट हटाएं ताकि दूर से ही खतरा स्पष्ट दिखाई दे',
          'चेतावनी बोर्ड पर काला पेंट लगा दें',
          'बोर्ड को पूरी तरह से हटाकर फेंक दें'
        ],
        correctIndex: 1,
        explanationEn: 'Statutory danger signs warn personnel and contractors of arc flash boundaries. They must remain 100% visible and unblocked at all times under Indian Electricity Rules.',
        explanationHi: 'भारतीय विद्युत नियमों के अनुसार डेंजर बोर्ड दूर से दिखाई देने चाहिए ताकि कोई भी अनजाने में हाई-वोल्टेज क्षेत्र में न जाए। सामने की रुकावट तुरंत हटानी चाहिए।'
      }
    ]
  },

  'scenario-4-mining': {
    scenarioId: 'scenario-4-mining',
    titleEn: 'Underground Mining & Haulage Safety Quiz',
    titleHi: 'भूमिगत कोयला खदान और हॉलेज सुरक्षा प्रश्नोत्तरी',
    industryEn: 'Underground Coal & Metal Mine',
    industryHi: 'भूमिगत कोयला और धातु खदान',
    questions: [
      {
        id: 'mine-q1',
        questionEn: 'Under DGMS Coal Mines Regulations 2017, what minimum clearance must pedestrians maintain from heavy 35-tonne dump trucks on active haulage roads?',
        questionHi: 'DGMS कोल माइन्स विनियम 2017 के तहत, सक्रिय हॉलेज रोड पर पैदल श्रमिकों को भारी डंपर से कितनी न्यूनतम सुरक्षित दूरी रखनी चाहिए?',
        optionsEn: [
          'No distance needed; workers can touch the tires while truck is moving',
          'Maintain minimum 15-meter clearance and never enter operator blind spots; use designated refuge bays',
          '1 foot away from the rear bumper',
          'Walk directly in front of the truck driver cabin'
        ],
        optionsHi: [
          'दूरी की आवश्यकता नहीं है; ट्रक चलने पर श्रमिक टायरों को छू सकते हैं',
          'कम से कम 15 मीटर की दूरी बनाए रखें और ब्लाइंड स्पॉट में कभी न जाएं; केवल रिफ्यूज बे का उपयोग करें',
          'पीछे के बंपर से केवल 1 फीट दूर',
          'चालक के केबिन के ठीक सामने चलें'
        ],
        correctIndex: 1,
        explanationEn: 'Heavy mining haul trucks have vast blind spots where the driver cannot see pedestrians within 15 meters. Pedestrians must keep clear and shelter in refuge bays when haulage is moving.',
        explanationHi: '35-टन भारी खनन डंपरों में ड्राइवर को 15 मीटर के दायरे में नीचे खड़े व्यक्ति नहीं दिखते। श्रमिकों को हॉलेज मार्ग पर दूर रहना चाहिए और रिफ्यूज बे में शरण लेनी चाहिए।'
      },
      {
        id: 'mine-q2',
        questionEn: 'What geological hazard does a visible fracture plane in an unsupported coal or rock ceiling (hanging wall) represent?',
        questionHi: 'बिना सहारे वाली कोयला या चट्टान की छत में दिखाई देने वाली दरार (Fracture) किस खतरे को दर्शाती है?',
        optionsEn: [
          'A convenient location to hang clothing',
          'Imminent catastrophic roof fall / strata collapse requiring immediate evacuation and hydraulic prop support',
          'Natural air ventilation entry',
          'Completely stable ground requiring zero attention'
        ],
        optionsHi: [
          'कपड़े टांगने के लिए एक सुविधाजनक जगह',
          'छत गिरने (Roof Fall) और चट्टान ढहने का गंभीर खतरा; तुरंत सुरक्षित हटें और सपोर्ट प्रॉप लगाएं',
          'प्राकृतिक वायु संवातन का मार्ग',
          'पूरी तरह से सुरक्षित छत जिस पर ध्यान देने की आवश्यकता नहीं है'
        ],
        correctIndex: 1,
        explanationEn: 'Roof fall is the leading cause of fatalities in underground coal mines. Any visible parting or fracture must be cordoned off immediately and secured under the Strata Control Management Plan (SCMP).',
        explanationHi: 'भूमिगत खदानों में छत गिरना (Roof Fall) सबसे बड़ा जानलेवा खतरा है। दरार दिखने पर तुरंत इलाका खाली करें और SCMP के तहत हाइड्रोलिक प्रॉप या रूफ बोल्ट लगाएं।'
      },
      {
        id: 'mine-q3',
        questionEn: 'Which illumination equipment is mandatory for underground mine workers under DGMS safety standards?',
        questionHi: 'DGMS सुरक्षा मानकों के तहत भूमिगत खनिकों के लिए कौन सा प्रकाश उपकरण अनिवार्य है?',
        optionsEn: [
          'Domestic mobile phone flashlight',
          'Intrinsically safe, flameproof DGMS-approved LED cap lamp mounted on IS 2925 Type II mining helmet',
          'Wax candles and matchboxes',
          'Ordinary open kerosene hurricane lantern'
        ],
        optionsHi: [
          'घरेलू मोबाइल फोन की टॉर्च',
          'IS 2925 टाइप II खनन हेलमेट पर लगा इंट्रिन्सिकली सेफ (फ्लेमप्रूफ) DGMS-अनुमोदित LED कैप लैंप',
          'मोमबत्ती और माचिस',
          'साधारण मिट्टी के तेल की लालटेन'
        ],
        correctIndex: 1,
        explanationEn: 'Open flames or non-certified electric torches can ignite underground coal dust or methane gas pockets. Only DGMS intrinsically safe cap lamps are legally permitted.',
        explanationHi: 'खुली आग या साधारण टॉर्च से खदान की मीथेन गैस या कोयले की धूल में भयानक विस्फोट हो सकता है। केवल DGMS अनुमोदित फ्लेमप्रूफ कैप लैंप ही कानूनी रूप से मान्य है।'
      },
      {
        id: 'mine-q4',
        questionEn: 'What must mining personnel do when observing a statutory DGMS "KHATRA / DANGER" barrier board blocking an abandoned gallery or goaf?',
        questionHi: 'परित्यक्त गैलरी या गोफ (Goaf) को अवरुद्ध करने वाले DGMS "खतरा / DANGER" बोर्ड को देखकर खनिकों को क्या करना चाहिए?',
        optionsEn: [
          'Cross the barrier to inspect the dark area alone',
          'Respect the barrier strictly: Do NOT cross under any circumstances due to toxic noxious gas (CO, CH4) and oxygen deficiency',
          'Tear down the sign and throw it away',
          'Use the abandoned area as a rest room'
        ],
        optionsHi: [
          'अकेले अंधेरे क्षेत्र का निरीक्षण करने के लिए बैरियर पार करें',
          'बैरियर का कड़ाई से सम्मान करें: जहरीली गैसों (CO, CH4) और ऑक्सीजन की कमी के कारण किसी भी स्थिति में अंदर न जाएं',
          'साइन बोर्ड को फाड़कर फेंक दें',
          'परित्यक्त क्षेत्र का उपयोग आराम करने के लिए करें'
        ],
        correctIndex: 1,
        explanationEn: 'Unventilated abandoned mine workings accumulate lethal carbon monoxide, methane, and oxygen-deficient black damp that can cause loss of consciousness within seconds.',
        explanationHi: 'बंद गैलरी में जहरीली कार्बन मोनोऑक्साइड, मीथेन और ऑक्सीजन की भारी कमी होती है। वहां जाने पर कुछ ही सेकंड में दम घुटने से मौत हो सकती है। बैरियर कभी पार न करें।'
      },
      {
        id: 'mine-q5',
        questionEn: 'Which hazardous flammable gas must be actively tested in underground coal mines using approved methanometers before working?',
        questionHi: 'भूमिगत कोयला खदानों में काम करने से पहले किस ज्वलनशील गैस की जांच अनुमोदित मिथेनोमीटर से की जानी चाहिए?',
        optionsEn: [
          'Methane (CH4 / Firedamp)',
          'Pure Helium (He)',
          'Argon gas (Ar)',
          'Neon gas (Ne)'
        ],
        optionsHi: [
          'मीथेन गैस (CH4 / फायरडैम्प)',
          'शुद्ध हीलियम',
          'आर्गन गैस',
          'नियॉन गैस'
        ],
        correctIndex: 0,
        explanationEn: 'Methane (firedamp) forms explosive mixtures with air between 5.4% and 14.8%. Strict continuous ventilation and gas monitoring are required under Coal Mines Regulations 2017.',
        explanationHi: 'मीथेन (फायरडैम्प) हवा के साथ 5% से 15% के अनुपात में अत्यंत विस्फोटक मिश्रण बनाती है। खदान में काम शुरू करने से पहले मिथेनोमीटर से इसकी जांच अनिवार्य है।'
      }
    ]
  },

  'scenario-5-machinery': {
    scenarioId: 'scenario-5-machinery',
    titleEn: 'Machinery & Nip-Point Safety Quiz',
    titleHi: 'भारी मशीनरी और निप-पॉइंट सुरक्षा प्रश्नोत्तरी',
    industryEn: 'Heavy Industrial Machinery & Conveyors',
    industryHi: 'भारी औद्योगिक मशीनरी और कन्वेयर',
    questions: [
      {
        id: 'mach-q1',
        questionEn: 'What is an "in-running nip point" on industrial machinery such as conveyors and roll crushers?',
        questionHi: 'कन्वेयर और रोल क्रशर जैसी औद्योगिक मशीनरी पर "इन-रनिंग निप पॉइंट" क्या होता है?',
        optionsEn: [
          'A soft cushioned seat for operators',
          'The point where two rotating parts move toward each other, creating a severe draw-in and crushing hazard',
          'An electrical outlet for charging tools',
          'The paint coat on the machine body'
        ],
        optionsHi: [
          'ऑपरेटर के लिए गद्देदार सीट',
          'वह बिंदु जहां दो घूमने वाले हिस्से एक-दूसरे की ओर मुड़ते हैं, जिससे शरीर के अंग खिंचने और कुचलने का गंभीर खतरा होता है',
          'औजार चार्ज करने के लिए बिजली का सॉकेट',
          'मशीन की बॉडी पर पेंट की परत'
        ],
        correctIndex: 1,
        explanationEn: 'In-running nip points generate extreme drawing forces that can pull in fingers, clothing, and limbs in a fraction of a second, causing traumatic amputation.',
        explanationHi: 'निप पॉइंट वह खतरनाक स्थान है जहां घूमने वाले रोलर कपड़े या हाथ को सेकंड के दसवें हिस्से में अंदर खींचकर कुचल सकते हैं। यहां हमेशा मजबूत सुरक्षा गार्ड होना चाहिए।'
      },
      {
        id: 'mach-q2',
        questionEn: 'According to IS 9474 and ISO 13849, what is the key safety function of an interlocked machine guard?',
        questionHi: 'IS 9474 और ISO 13849 के अनुसार, इंटरलॉक्ड मशीन गार्ड का मुख्य सुरक्षा कार्य क्या है?',
        optionsEn: [
          'It automatically cuts power and stops the machine motor if the safety guard is opened or removed',
          'It plays music when the machine is operating',
          'It increases the machine speed beyond manufacturer rating',
          'It collects motor oil leaks'
        ],
        optionsHi: [
          'यदि सुरक्षा गार्ड खोला या हटाया जाता है, तो यह स्वचालित रूप से बिजली काटकर मशीन को तुरंत रोक देता है',
          'मशीन चलने पर यह संगीत बजाता है',
          'यह मशीन की गति को अत्यधिक बढ़ा देता है',
          'यह मोटर से टपकने वाले तेल को इकट्ठा करता है'
        ],
        correctIndex: 0,
        explanationEn: 'An electrical interlock switch wired into the machine emergency stop circuit prevents the drive from running whenever the barrier is moved away from the hazardous nip zone.',
        explanationHi: 'इंटरलॉक्ड गार्ड में सुरक्षा स्विच लगा होता है। यदि कोई भी व्यक्ति गार्ड खोलता है तो मोटर की बिजली तुरंत कट जाती है और मशीन रुक जाती है।'
      },
      {
        id: 'mach-q3',
        questionEn: 'If a conveyor belt shows severe mechanical jamming or abnormal vibration, what is the immediate first action?',
        questionHi: 'यदि कन्वेयर बेल्ट में गंभीर खराबी, जाम या असामान्य कंपन दिखाई दे, तो पहली कार्रवाई क्या होनी चाहिए?',
        optionsEn: [
          'Strike the prominent red mushroom Emergency Stop (E-Stop) pushbutton or pull the trip wire to halt the drive',
          'Reach inside with bare hands while belt is running to dislodge the jammed rock',
          'Pour engine oil directly on the moving drive pulley',
          'Speed up the motor to force the jam through'
        ],
        optionsHi: [
          'ड्राइव को तुरंत रोकने के लिए प्रमुख लाल मशरूम इमरजेंसी स्टॉप (E-Stop) बटन दबाएं या ट्रिप वायर खींचें',
          'चलती बेल्ट में फंसे पत्थर को निकालने के लिए नंगे हाथों से अंदर पहुंचना',
          'चलती हुई चरखी पर सीधे इंजन का तेल डालना',
          'जाम को जबरन निकालने के लिए मोटर की गति बढ़ाना'
        ],
        correctIndex: 0,
        explanationEn: 'Hitting the Emergency Stop cuts motor power instantly. Never touch or attempt to clear a jammed conveyor while mechanical power is connected.',
        explanationHi: 'इमरजेंसी स्टॉप बटन दबाने से मोटर तुरंत बंद हो जाती है। चलती मशीन में कभी भी हाथ न डालें; पहले E-stop दबाकर मशीन पूरी तरह बंद करें।'
      },
      {
        id: 'mach-q4',
        questionEn: 'Why are loose shirt sleeves, unbuttoned jackets, long neckties, and dangling lanyards strictly banned around rotating machinery?',
        questionHi: 'घूमने वाली मशीनरी के पास ढीली आस्तीन, खुले जैकेट, टाई और लटकते आईडी कार्ड कार्ड क्यों पूरी तरह प्रतिबंधित हैं?',
        optionsEn: [
          'They violate the company fashion guidelines',
          'Loose garments can snag on rotating shafts and draw the operator directly into high-speed machinery',
          'They cause the room temperature to rise',
          'They block worker visibility'
        ],
        optionsHi: [
          'वे कंपनी के फैशन दिशानिर्देशों का उल्लंघन करते हैं',
          'ढीले कपड़े घूमने वाले शाफ्ट में लिपट सकते हैं और श्रमिक को सीधे मशीन के अंदर खींच सकते हैं',
          'वे कमरे का तापमान बढ़ाते हैं',
          'वे ऑपरेटर की आंखों की रोशनी रोकते हैं'
        ],
        correctIndex: 1,
        explanationEn: 'A rotating shaft spinning at 1500 RPM will entangle loose fabric in milliseconds, giving the worker zero reaction time to pull away before fatal injuries occur.',
        explanationHi: 'घूमते हुए शाफ्ट में ढीला कपड़ा पलक झपकते ही लिपट जाता है और व्यक्ति को मशीन के अंदर खींच लेता है। मशीन ऑपरेटरों को कसी हुई आस्तीन और बटन बंद रखने चाहिए।'
      },
      {
        id: 'mach-q5',
        questionEn: 'After stopping a conveyor with the Emergency Stop button to clear a jammed item, what must be done before placing hands into the nip zone?',
        questionHi: 'जाम साफ करने के लिए इमरजेंसी स्टॉप बटन दबाने के बाद, निप पॉइंट में हाथ डालने से पहले क्या अनिवार्य है?',
        optionsEn: [
          'Immediately grab the stuck object without further precautions',
          'Perform Lockout/Tagout (LOTO) on the main electrical breaker and dissipate all stored mechanical/hydraulic energy',
          'Ask another worker to hold the start button down',
          'Clean the floor with soap while reaching inside'
        ],
        optionsHi: [
          'बिना किसी अन्य सावधानी के तुरंत फंसी वस्तु को हाथ से खींचना',
          'मुख्य ब्रेकर पर LOTO (लॉकआउट/टैगआउट) लगाएं और संचित यांत्रिक दबाव को शून्य करें (Zero Energy State)',
          'दूसरे कार्यकर्ता से स्टार्ट बटन दबाकर रखने को कहें',
          'अंदर हाथ डालते समय फर्श को साबुन से साफ करना'
        ],
        correctIndex: 1,
        explanationEn: 'E-Stops are control circuits that can fail or be accidentally reset. True physical zero-energy state requires mechanical LOTO isolation at the main breaker before any intervention.',
        explanationHi: 'E-stop केवल कंट्रोल स्विच है जो गलती से दोबारा चालू हो सकता है। काम करने से पहले मुख्य स्विचबोर्ड पर LOTO पैडलॉक लगाना और संचित तनाव को शून्य करना अनिवार्य है।'
      }
    ]
  },

  'scenario-gas-leak': {
    scenarioId: 'scenario-gas-leak',
    titleEn: 'Industrial Gas Leakage & Chemical Process Emergency Quiz',
    titleHi: 'औद्योगिक गैस रिसाव एवं रासायनिक आपातकालीन सुरक्षा प्रश्नोत्तरी',
    industryEn: 'Gas Processing & Petrochemical Refineries',
    industryHi: 'गैस प्रसंस्करण एवं पेट्रोकेमिकल रिफाइनरी',
    questions: [
      {
        id: 'gas-q1',
        questionEn: 'Upon detecting a high-pressure toxic or flammable gas leak in an industrial workshop, what is the FIRST priority action?',
        questionHi: 'औद्योगिक कार्यशाला में जहरीली या ज्वलनशील गैस का रिसाव होने पर सबसे पहली प्राथमिकता क्या है?',
        optionsEn: [
          'Sound the emergency alarm, evacuate personnel upwind, and isolate the source if safe',
          'Turn on light switches to illuminate the gas cloud',
          'Use a steel hammer to hit the pipe joints',
          'Open all windows while smoking a cigarette'
        ],
        optionsHi: [
          'इमरजेंसी अलार्म बजाएं, हवा की विपरीत दिशा में बाहर निकलें और सुरक्षित हो तो वाल्व बंद करें',
          'गैस का बादल देखने के लिए बिजली के स्विच चालू करें',
          'पाइप जोड़ों को लोहे के हथौड़े से ठोकें',
          'बीड़ी पीते हुए खिड़कियां खोलें'
        ],
        correctIndex: 0,
        explanationEn: 'Factories Act 1948 and PESO guidelines mandate immediate emergency alarm activation, immediate personnel evacuation to upwind assembly points, and remote or safe isolation to avoid asphyxiation and spark ignition.',
        explanationHi: 'भारतीय कारखाना अधिनियम एवं PESO नियमों के अनुसार तुरंत आपातकालीन अलार्म बजाना और श्रमिकों को हवा के बहाव की विपरीत दिशा में सुरक्षित स्थान पर निकालना पहली प्राथमिकता है।'
      },
      {
        id: 'gas-q2',
        questionEn: 'Which standard of Personal Protective Equipment (PPE) is mandatory when entering a toxic gas concentration zone?',
        questionHi: 'जहरीली गैस सांद्रता क्षेत्र में प्रवेश करते समय किस प्रकार का पीपीई (PPE) अनिवार्य है?',
        optionsEn: [
          'Paper dust mask or surgical face mask',
          'Positive-pressure Self-Contained Breathing Apparatus (SCBA) or certified chemical gas respirator (IS 9473/EN 14387)',
          'Dry cotton bandana wrapped around the nose',
          'Swimming goggles with ear plugs'
        ],
        optionsHi: [
          'कागज का डस्ट मास्क या सर्जिकल मास्क',
          'पॉजिटिव-प्रेशर SCBA (सेल्फ-कंटेन्ड ब्रीदिंग अपेरटस) या प्रमाणित केमिकल गैस रेस्पिरेटर',
          'नाक पर बंधा सूखा सूती रूमाल',
          'कान के प्लग के साथ स्विमिंग चश्मा'
        ],
        correctIndex: 1,
        explanationEn: 'Dust masks filter only mechanical particulate matter. Chemical vapors and toxic gases require certified chemical cartridges (IS 9473 / EN 14387) or autonomous air cylinders (SCBA) in oxygen-deficient or toxic atmospheres.',
        explanationHi: 'धूल के मास्क केवल धूल रोकते हैं। जहरीली गैसों से फेफड़ों की रक्षा के लिए प्रमाणित केमिकल रेस्पिरेटर या स्वतंत्र ऑक्सीजन सिलेंडर (SCBA) अनिवार्य है।'
      },
      {
        id: 'gas-q3',
        questionEn: 'Why is turning electrical light switches or motor starters ON or OFF strictly prohibited inside a flammable gas envelope?',
        questionHi: 'ज्वलनशील गैस के बादल में बिजली के स्विच को चालू या बंद करना सख्त वर्जित क्यों है?',
        optionsEn: [
          'Because mechanical switch contacts generate electrical micro-arcs that can ignite the flammable air-gas mixture',
          'Because electricity makes the gas smell bad',
          'Because switches consume too much power during emergencies',
          'Because the power company fines the factory'
        ],
        optionsHi: [
          'क्योंकि स्विच के संपर्कों से निकलने वाली विद्युत चिंगारी (स्पार्क) गैस मिश्रण में तुरंत विस्फोट कर सकती है',
          'क्योंकि बिजली से गैस में बदबू आने लगती है',
          'क्योंकि आपातकाल में बिजली बहुत महंगी पड़ती है',
          'क्योंकि बिजली कंपनी जुर्माना लगा देती है'
        ],
        correctIndex: 0,
        explanationEn: 'Under IS/IEC 60079 hazardous area regulations, standard electrical switches generate contact break-arcs exceeding minimum ignition energy (MIE) of hydrocarbon and volatile gases, causing catastrophic deflagration.',
        explanationHi: 'सामान्य बिजली के स्विच चालू या बंद करते समय संपर्क बिंदुओं पर चिंगारी निकलती है, जो गैस के ज्वलनशील मिश्रण को तुरंत आग लगाकर विस्फोट कर देती है।'
      },
      {
        id: 'gas-q4',
        questionEn: 'What is the role of industrial explosion-proof exhaust ventilation systems during a gas release?',
        questionHi: 'गैस रिसाव के दौरान विस्फोट-रोधी आपातकालीन निकास पंखे (एग्जॉस्ट वेंटिलेशन) की क्या भूमिका है?',
        optionsEn: [
          'To rapidly dilute and extract the gas below Lower Explosive Limit (LEL) and route it to scrubbers',
          'To heat up the plant room temperature',
          'To create background noise so workers stay calm',
          'To pump flammable gas into the office lunchroom'
        ],
        optionsHi: [
          'गैस की सांद्रता को विस्फोटक सीमा (LEL) से नीचे लाना और सुरक्षित स्क्रबर में भेजना',
          'प्लांट के कमरे का तापमान बढ़ाना',
          'शोर पैदा करना ताकि कर्मचारी शांत रहें',
          'गैस को कर्मचारियों के भोजनालय में पहुंचाना'
        ],
        correctIndex: 0,
        explanationEn: 'Emergency exhaust ventilation actively dilutes vapor concentration well below the Lower Explosive Limit (LEL), displacing toxic pockets and scrubbing volatile organic chemicals safely.',
        explanationHi: 'आपातकालीन निकास वेंटिलेशन गैस की सघनता को सुरक्षित सीमा से नीचे लाता है और हवा को शुद्ध कर वातावरण को रहने योग्य बनाता है।'
      },
      {
        id: 'gas-q5',
        questionEn: 'When evacuating from a gas processing plant during an uncontained chemical release, in which direction should personnel move?',
        questionHi: 'रासायनिक गैस रिसाव के दौरान संयंत्र से बाहर निकलते समय किस दिशा में बढ़ना चाहिए?',
        optionsEn: [
          'Downwind (in the exact direction the smoke and smell are blowing)',
          'Crosswind or Upwind (perpendicular to or against wind direction towards designated muster point)',
          'Towards underground basements and pit areas where gas accumulates',
          'Hide inside small storage cabinets until the shift ends'
        ],
        optionsHi: [
          'हवा के बहाव की दिशा में (जिस तरफ धुआं और गैस बह रही है)',
          'हवा के रुख की विपरीत या लंबवत दिशा में (Upwind / Crosswind) निर्धारित सुरक्षित असेंबली पॉइंट की ओर',
          'भूमिगत बेसमेंट या गड्ढों में जहाँ गैस इकट्ठा होती है',
          'अलमारी के अंदर छिपकर शिफ्ट खत्म होने का इंतजार करना'
        ],
        correctIndex: 1,
        explanationEn: 'Most industrial gases are heavier than air or travel with the wind. Moving upwind/crosswind ensures escape from the advancing plume, avoiding asphyxiating low-lying trenches or basements.',
        explanationHi: 'अधिकांश औद्योगिक गैसें हवा से भारी होती हैं और हवा के रुख के साथ बहती हैं। हवा के विपरीत (Upwind) चलने से जहरीले बादल से सुरक्षित बाहर निकला जा सकता है।'
      }
    ]
  }
};

export function getScenarioQuiz(scenarioId: string): ScenarioQuiz {
  if (scenarioId === 'scenario-1-ppe') {
    return SCENARIO_QUIZZES['scenario-1-ppe'];
  }
  if (scenarioId === 'scenario-gas-leak') {
    return SCENARIO_QUIZZES['scenario-gas-leak'];
  }
  if (scenarioId === 'scenario-2-electrical' || scenarioId === 'scenario-3-electrical') {
    return SCENARIO_QUIZZES['scenario-3-electrical'];
  }
  if (scenarioId === 'scenario-3-fire' || scenarioId === 'scenario-2-fire') {
    return SCENARIO_QUIZZES['scenario-2-fire'];
  }
  if (scenarioId === 'scenario-4-mining') {
    return SCENARIO_QUIZZES['scenario-4-mining'];
  }
  if (scenarioId === 'scenario-5-machinery') {
    return SCENARIO_QUIZZES['scenario-5-machinery'];
  }
  return SCENARIO_QUIZZES[scenarioId] || SCENARIO_QUIZZES['scenario-2-fire'] || SCENARIO_QUIZZES['scenario-1-ppe'];
}
