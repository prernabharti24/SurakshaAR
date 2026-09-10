// SURAKSHAAR - Indian Vocational Industrial Safety Knowledge Base
// Compliant with DGMS (Directorate General of Mines Safety), Factories Act 1948, CEA Reg 2010, and BIS Indian Standards.
// Designed with ultra-simple language (Hindi and English) for low-literacy vocational trainees and trainers.

export interface SafetyTopic {
  id: string;
  category: string;
  categoryHi: string;
  icon: string;
  starterQuestionEn: string;
  starterQuestionHi: string;
  keywords: string[];
  simpleAnswerEn: string;
  simpleAnswerHi: string;
}

export const SAFETY_TOPICS: SafetyTopic[] = [
  {
    id: 'ppe-helmet',
    category: 'PPE',
    categoryHi: 'सुरक्षा उपकरण (PPE)',
    icon: '🦺',
    starterQuestionEn: 'What are the mandatory PPE rules for workers in industrial sites?',
    starterQuestionHi: 'कार्यस्थल पर हेलमेट और पीपीई (PPE) के क्या नियम हैं?',
    keywords: ['helmet', 'ppe', 'vest', 'shoes', 'goggles', 'gloves', 'pehna', 'pehanna', 'head', 'hard hat', 'हेलमेट', 'दस्ताने', 'जूते', 'सुरक्षा'],
    simpleAnswerEn: `🔴 RISK LEVEL: High (if entering without mandatory PPE)
⚠️ HAZARD: Falling objects, crush injuries to feet, head concussion, and low visibility to heavy moving machinery.
🛡️ WHAT TO DO:
1. Put on an IS 2925 approved Hard Hat with the chin strap tightly buckled.
2. Wear an IS 15809 high-visibility fluorescent orange reflective safety vest.
3. Wear IS 15298 certified steel-toe safety shoes to protect feet from heavy drops.
4. Wear impact-rated eye goggles and dielectric gloves when handling tools or machinery.
5. Inspect all PPE for cracks, tears, or expiration before entering the shop floor.
🚫 DO NOT:
• Do NOT enter any operational zone without complete certified PPE.
• Do NOT wear cracked helmets or leave chin straps dangling.
• Do NOT substitute regular sneakers or slippers for steel-toe boots.
🧰 REQUIRED PPE: IS 2925 Hard Hat, IS 15809 Reflective Vest, IS 15298 Steel-Toe Boots, IS 5983 Safety Goggles.
📌 PREVENTION: Conduct daily tool-box safety briefings and pre-entry gatekeeper PPE verification.`,
    simpleAnswerHi: `🔴 RISK LEVEL (जोखिम स्तर): High (उच्च जोखिम)
⚠️ HAZARD (खतरा): सिर पर भारी वस्तुएं गिरना, पैरों में चोट, कम दृश्यता और मशीनरी से कुचलने का ख़तरा।
🛡️ WHAT TO DO (क्या करें):
1. सिर की सुरक्षा के लिए 'IS 2925' प्रमाणित औद्योगिक सुरक्षा हेलमेट पहनें और ठुड्डी का पट्टा (चिन्स्ट्रैप) कसकर बांधें।
2. दूर से दिखने वाली चमकीली नारंगी फ्लोरोसेंट रिफ्लेक्टिव जैकेट (IS 15809) पहनें।
3. पैरों की सुरक्षा के लिए स्टील-टो सेफ्टी जूते (IS 15298) पहनें।
4. आंखों की सुरक्षा के लिए सेफ्टी चश्मा और काम के अनुसार सही दस्ताने पहनें।
5. कार्यक्षेत्र में जाने से पहले अपने सभी पीपीई की जांच करें कि वे टूटे या फटे न हों।
🚫 DO NOT (क्या न करें):
• बिना पीपीई के किसी भी कार्य क्षेत्र में प्रवेश न करें।
• टूटे हुए हेलमेट या ढीले पट्टे का उपयोग न करें।
• सुरक्षा जूतों की जगह साधारण चप्पल या जूते कभी न पहनें।
🧰 REQUIRED PPE (आवश्यक पीपीई): IS 2925 हेलमेट, IS 15809 रिफ्लेक्टिव जैकेट, IS 15298 सेफ्टी जूते, सेफ्टी चश्मा।
📌 PREVENTION (रोकथाम): कार्य शुरू होने से पहले प्रतिदिन टूलबॉक्स सुरक्षा जांच अनिवार्य करें।`
  },
  {
    id: 'fire-safety',
    category: 'Fire Safety',
    categoryHi: 'अग्नि सुरक्षा (Fire)',
    icon: '🔥',
    starterQuestionEn: 'What is the first step when a fire breaks out in the plant?',
    starterQuestionHi: 'आग लगने पर सबसे पहला कदम क्या उठाना चाहिए?',
    keywords: ['fire', 'aag', 'extinguisher', 'cylinder', 'smoke', 'alarm', 'flame', 'blaze', 'dhua', 'pass', 'आग', 'धुआं', 'अग्निशामक'],
    simpleAnswerEn: `🔴 RISK LEVEL: High
⚠️ HAZARD: Rapid flame spread, toxic smoke inhalation, structural collapse, and flashover explosions.
🛡️ WHAT TO DO:
1. Immediately shout "FIRE! FIRE!" and break the glass on the nearest Manual Call Point (MCP) fire alarm.
2. Evacuate through illuminated green emergency exit routes toward the external assembly muster point.
3. If trained and fire is small, operate the ABC Dry Chemical Powder (DCP) extinguisher using P.A.S.S.:
   - P (Pull): Pull the safety pin and break the plastic seal.
   - A (Aim): Aim the nozzle at the base of the fire, not into the flames.
   - S (Squeeze): Squeeze the handle levers together steadily.
   - S (Sweep): Sweep the nozzle smoothly from side to side.
4. Close doors behind you as you evacuate to contain oxygen feeding the fire.
5. Report directly to your Safety Officer and supervisor at the muster area.
🚫 DO NOT:
• Do NOT use water on electrical panel fires or chemical fuel fires.
• Do NOT use elevators or lifts during a fire emergency.
• Do NOT re-enter the burning structure to retrieve personal belongings.
🧰 REQUIRED PPE: Smoke escape hood, heat-resistant flame-retardant gloves, safety goggles.
📌 PREVENTION: Inspect fire extinguishers monthly, keep exit corridors unobstructed, and practice bi-annual fire drills.`,
    simpleAnswerHi: `🔴 RISK LEVEL (जोखिम स्तर): High (अत्यंत गंभीर)
⚠️ HAZARD (खतरा): तीव्र लपटें, दम घोंटने वाला जहरीला धुआं और रासायनिक विस्फोट का ख़तरा।
🛡️ WHAT TO DO (क्या करें):
1. तुरंत जोर से "आग! आग!" चिल्लाएं और निकटतम फायर अलार्म (MCP) का कांच तोड़कर सायरन बजाएं।
2. हरी बत्ती वाले आपातकालीन निकास (Emergency Exit) की ओर तेजी से लेकिन शांत रहकर बढ़ें।
3. यदि आग छोटी है और आप प्रशिक्षित हैं, तो P.A.S.S. नियम से ABC पाउडर अग्निशामक का प्रयोग करें:
   - P (पुल): सुरक्षा पिन खींचें।
   - A (ऐम): आग की जड़ (निचले हिस्से) पर निशाना साधें।
   - S (स्क्वीज): हैंडल को दबाएं।
   - S (स्वीप): नली को दाएं से बाएं घुमाते हुए पाउडर छिड़कें।
4. बाहर खुले असेंबली पॉइंट (Assembly Point) पर पहुंचकर सुपरवाइजर को उपस्थिति दर्ज कराएं।
🚫 DO NOT (क्या न करें):
• बिजली या मशीन की आग पर कभी भी पानी न डालें।
• आग लगने पर लिफ्ट का उपयोग कभी न करें, केवल सीढ़ियों से उतरें।
• सामान निकालने के लिए जलती हुई इमारत में वापस न जाएं।
🧰 REQUIRED PPE (आवश्यक पीपीई): स्मोक मास्क, हीट-रेसिस्टेंट दस्ताने, सुरक्षा जूते।
📌 PREVENTION (रोकथाम): निकास मार्गों को हमेशा खुला रखें और हर 6 महीने में मॉक ड्रिल करें।`
  },
  {
    id: 'electrical-safety',
    category: 'Electrical Safety',
    categoryHi: 'विद्युत सुरक्षा (Electrical)',
    icon: '⚡',
    starterQuestionEn: 'What safety precautions are required near 440V electrical panels?',
    starterQuestionHi: 'इलेक्ट्रिकल पैनल और 440V के पास क्या सुरक्षा रखनी चाहिए?',
    keywords: ['electrical', 'bijli', 'wire', '440v', 'current', 'shock', 'panel', 'loto', 'spark', 'cable', 'तार', 'बिजली', 'करंट', 'पैनल'],
    simpleAnswerEn: `🔴 RISK LEVEL: High (440V+ fatal electrocution and arc flash risk)
⚠️ HAZARD: High-voltage shock, severe internal organ burns, arc flash blast, and secondary fall injuries.
🛡️ WHAT TO DO:
1. Trip the upstream master circuit breaker or isolator handle immediately to de-energize the circuit.
2. Apply Lockout/Tagout (LOTO): Attach your safety padlock and warning tag (IS 9474) with your name and date.
3. Verify zero energy potential using a calibrated, insulated high-voltage proximity tester.
4. Stand exclusively on IS 15652 certified dielectric rubber insulation mats in front of all panels.
5. If rescuing an electrocution victim, NEVER touch them barehanded; separate them with a dry wooden or fiberglass pole.
🚫 DO NOT:
• Do NOT touch damaged or frayed 440V cables with bare hands.
• Do NOT work on electrical systems with wet hands, footwear, or damp floors.
• Do NOT remove another technician's LOTO padlock without written managerial protocol.
🧰 REQUIRED PPE: IS 4770 Class 0/1 1000V Dielectric Gloves, Arc-Flash Face Shield (NFPA 70E), IS 15298 Non-Conductive Boots.
📌 PREVENTION: Test ground-fault circuit interrupters (GFCI) weekly and service insulation annually.`,
    simpleAnswerHi: `🔴 RISK LEVEL (जोखिम स्तर): High (जानलेवा 440V झटका एवं आर्क फ्लैश)
⚠️ HAZARD (खतरा): खुले तारों से 440V का उच्च वोल्टेज करंट, शरीर का गंभीर रूप से जलना और दिल का दौरा पड़ना।
🛡️ WHAT TO DO (क्या करें):
1. सबसे पहले मुख्य मास्टर स्विच या सर्किट ब्रेकर को बंद करके बिजली की सप्लाई काटें।
2. LOTO (ताला-टैग) नियम अपनाएं: स्विच पर अपना व्यक्तिगत सुरक्षा ताला और लाल 'खतरा' टैग लगाएं।
3. पैनल के सामने हमेशा IS 15652 प्रमाणित रबर के इंसुलेटिंग मैट पर ही खड़े हों।
4. 1000V सुरक्षित इंसुलेटेड दस्ताने (IS 4770) और आर्क-फ्लैश सुरक्षात्मक फेस शील्ड पहनें।
5. यदि किसी साथी को करंट लगा हो, तो उसे नंगे हाथों से न छुएं; सूखी लकड़ी के डंडे से अलग करें और सीपीआर दें।
🚫 DO NOT (क्या न करें):
• गीले हाथों या पानी भरी जमीन पर कभी भी बिजली का काम न करें।
• कटे-फटे तारों पर साधारण टेप लगाकर अधूरा काम न छोड़ें।
• बिना अनुमति किसी दूसरे कामगार का LOTO ताला कभी न खोलें।
🧰 REQUIRED PPE (आवश्यक पीपीई): IS 4770 1000V डाईइलेक्ट्रिक दस्ताने, फेस शील्ड, IS 15298 गैर-सुचालक सुरक्षा जूते।
📌 PREVENTION (रोकथाम): सभी अर्थिंग तारों की नियमित जांच करें और पैनलों पर लॉक लगाकर रखें।`
  },
  {
    id: 'mining-safety',
    category: 'Mining Safety',
    categoryHi: 'खनन सुरक्षा (Mining)',
    icon: '⛏',
    starterQuestionEn: 'What are the key DGMS safety rules for underground and opencast mines?',
    starterQuestionHi: 'खदान (Mining) में काम करते समय किन खतरों से बचना चाहिए?',
    keywords: ['mining', 'mine', 'khandan', 'roof', 'dgms', 'caplamp', 'haul', 'dumper', 'chhat', 'coal', 'pit', 'खदान', 'कोयला', 'गैलरी'],
    simpleAnswerEn: `🔴 RISK LEVEL: High (DGMS Statutory Enforcement Zone)
⚠️ HAZARD: Strata collapse / roof falls, heavy dumper blind spot collisions, toxic methane/CO gas, and coal dust explosions.
🛡️ WHAT TO DO:
1. Always wear a DGMS-certified mining safety helmet equipped with a working intrinsically safe LED cap lamp.
2. Perform systematic roof and side inspections ("Sounding test") before stepping under newly exposed galleries.
3. Maintain at least 15 meters clearance from haul trucks, dumpers, and walking draglines; make eye contact with operators.
4. Carry a functional DGMS self-rescuer respirator and gas detector (detecting CH4, CO, O2).
5. Follow all directives from the Mining Sirdar and Overman under the Coal Mines Regulations 2017.
🚫 DO NOT:
• Do NOT enter any unventilated, unsupported, or barricaded goaf / old workings.
• Do NOT walk directly within the blind spot arc (front right and rear) of heavy mining haul trucks.
• Do NOT smoke, use lighters, or introduce non-flameproof electronics underground.
🧰 REQUIRED PPE: DGMS Certified Mining Helmet with Cap Lamp, Steel-Toe Metatarsal Boots, High-Vis Vest, Self-Rescuer.
📌 PREVENTION: Systematic support rules (SSR) compliance, continuous methane monitoring, and stone dust application.`,
    simpleAnswerHi: `🔴 RISK LEVEL (जोखिम स्तर): High (डीजीएमएस खदान सुरक्षा नियम)
⚠️ HAZARD (खतरा): खदान की छत गिरना (Roof Fall), विशाल डंपरों के अंधे क्षेत्र में आना और जहरीली गैसें (मीथेन/कार्बन मोनोऑक्साइड)।
🛡️ WHAT TO DO (क्या करें):
1. हमेशा डीजीएमएस अनुमोदित माइनिंग हेलमेट और चालू स्थिति वाला कैप लैंप पहनकर ही खदान में जाएं।
2. नई गैलरी में प्रवेश से पहले छत और दीवारों की जांच ('साउंडिंग टेस्ट') करें; खटखटाकर देखें कि पत्थर ढीले तो नहीं हैं।
3. चलते हुए भारी डंपर या लोडरों से कम से कम 15 मीटर की दूरी रखें और ड्राइवर से नजर मिलाकर ही आगे बढ़ें।
4. अपने पास चालू गैस डिटेक्टर और आपातकालीन सेल्फ-रेस्क्यूअर श्वास उपकरण हमेशा रखें।
5. माइनिंग सिरदार और ओवरमैन के सभी वैधानिक निर्देशों का पालन करें।
🚫 DO NOT (क्या न करें):
• बिना वेंटिलेशन वाली या बंद पुरानी गैलरी (Goaf) में कभी न जाएं।
• डंपर के ठीक पीछे या दाएँ ब्लाइंड स्पॉट में कभी खड़े न हों।
• खदान के अंदर माचिस, बीड़ी, सिगरेट या बिना-प्रमाणित इलेक्ट्रॉनिक उपकरण न ले जाएं।
🧰 REQUIRED PPE (आवश्यक पीपीई): DGMS प्रमाणित माइनिंग हेलमेट, कैप लैंप, मेटाटार्सल सेफ्टी जूते, सेल्फ-रेस्क्यूअर मास्क।
📌 PREVENTION (रोकथाम): सिस्टेमेटिक रूफ सपोर्ट (SSR) का पालन और निरंतर वेंटिलेशन एयरफ्लो सुनिश्चित करें।`
  },
  {
    id: 'machinery-safety',
    category: 'Machinery Safety',
    categoryHi: 'मशीनरी सुरक्षा (Machinery)',
    icon: '⚙',
    starterQuestionEn: 'How to safely perform Lockout/Tagout (LOTO) and operate moving machinery?',
    starterQuestionHi: 'मशीन की सफाई या मरम्मत से पहले LOTO कैसे करें?',
    keywords: ['machinery', 'machine', 'loto', 'conveyor', 'roller', 'estop', 'guard', 'lockout', 'tagout', 'मशीन', 'रोलर', 'जाली', 'कन्वेयर'],
    simpleAnswerEn: `🔴 RISK LEVEL: High (Entanglement, amputation, and crush points)
⚠️ HAZARD: High-speed rotating shafts, in-running conveyor nip points, unexpected machine energization, and flying debris.
🛡️ WHAT TO DO:
1. Ensure all fixed perimeter wire mesh guards (IS 9474) and interlocks are securely fastened before power-on.
2. Locate the Red Mushroom Emergency Stop (E-Stop) push-button and trip cord along the conveyor bed.
3. Before any maintenance, clearing jams, or lubrication, execute LOTO: isolate power, lock breaker, tagout, and bleed energy.
4. Tuck in shirts, button up sleeves, tie long hair under your hairnet/hard hat, and remove all jewelry or wristbands.
5. Use long reach push-sticks or specialized tools to unjam chutes—never insert fingers or hands.
🚫 DO NOT:
• Do NOT remove safety guards or tamper with safety limit switches while machines are operating.
• Do NOT reach around, through, or under running conveyor rollers or belts.
• Do NOT wear loose clothing, hanging ID lanyards, or neckties near rotating equipment.
🧰 REQUIRED PPE: Snug-fit Work Coverall (IS 15809), Impact Safety Spectacles (IS 5983), Steel-Toe Boots, Grip Gloves.
📌 PREVENTION: Preventative maintenance, interlocked guard door sensors, and monthly E-Stop trip verification.`,
    simpleAnswerHi: `🔴 RISK LEVEL (जोखिम स्तर): High (अंग कटने एवं मशीन में खिंचने का ख़तरा)
⚠️ HAZARD (खतरा): तेज घूमते रोलर, कन्वेयर बेल्ट के पिंच पॉइंट, ढीले कपड़ों का मशीन में फंसना।
🛡️ WHAT TO DO (क्या करें):
1. मशीन चालू करने से पहले सुरक्षा जाली (Safety Guard - IS 9474) और सुरक्षा कवर की जांच करें।
2. आपातकालीन स्टॉप (लाल मशरूम E-Stop बटन) की स्थिति हमेशा याद रखें, संकट में तुरंत दबाएं।
3. मशीन की सफाई, तेल डालने या जाम ठीक करने से पहले बिजली बंद करें और LOTO (ताला-टैग) लगाएं।
4. शरीर से सटे कपड़े पहनें; आस्तीन के बटन बंद रखें, गले की चेन, अंगूठी और टाई पूरी तरह उतार दें।
5. अटके हुए माल को निकालने के लिए लंबे हैंडल वाले टूल का प्रयोग करें, हाथ कभी न डालें।
🚫 DO NOT (क्या न करें):
• चलती हुई मशीन से कभी भी सुरक्षा गार्ड या जाली न हटाएं।
• घूमते हुए रोलर या बेल्ट के नीचे कभी हाथ न डालें।
• ढीले कपड़े या लटकते हुए पहचान पत्र पहनकर मशीन के पास न जाएं।
🧰 REQUIRED PPE (आवश्यक पीपीई): फिटिंग वर्कवियर, सुरक्षा चश्मा, स्टील-टो सेफ्टी जूते, कट-प्रतिरोधी दस्ताने।
📌 PREVENTION (रोकथाम): नियमित रखरखाव, सेंसरयुक्त सुरक्षा गार्ड और प्रतिदिन आपातकालीन स्टॉप की जांच।`
  },
  {
    id: 'hazard-identification',
    category: 'Hazard Identification',
    categoryHi: 'ख़तरा पहचान (Hazard Identification)',
    icon: '⚠',
    starterQuestionEn: 'How do I identify workplace safety hazards during daily inspection?',
    starterQuestionHi: 'कार्यस्थल पर खतरों (Hazards) की पहचान कैसे करें?',
    keywords: ['hazard', 'identification', 'khatra', 'risk', 'inspection', 'trip', 'slip', 'oil', 'housekeeping', 'what to do right now', 'right now', 'खतरा', 'पहचान', 'फिसलन', 'अभी क्या करें'],
    simpleAnswerEn: `🔴 RISK LEVEL: Medium to High (Depending on active workplace situation)
⚠️ HAZARD: Uncontrolled shop-floor hazards: slip/trip items, missing PPE, unguarded pinch points, and exposed live wires.
🛡️ WHAT TO DO:
1. STOP AND ASSESS: Pause your work and scan your 360° surroundings before taking any step.
2. CHECK THE 4 VITAL ZONES:
   - Floor: Oil spills, conductive water, scrap metal, tripping cables.
   - Equipment: Missing wire guards, loose belts, ungrounded plugs, warning lights.
   - People: Missing helmets, vests, eye protection, unsafe work postures.
   - Environment: Lighting, ventilation, exit clearance, fire extinguisher accessibility.
3. REMEDIATE OR ISOLATE: If safe, mark the hazard zone with yellow barricade tape.
4. REPORT: Report immediately to your Safety Supervisor with exact location and hazard nature.
5. RESUME ONLY WHEN CLEARED: Never take shortcuts through an uncleared danger zone.
🚫 DO NOT:
• Do NOT ignore a "minor" leak or loose wire thinking someone else will fix it.
• Do NOT step over rotating conveyors or bypass hazard barricades.
• Do NOT start work under pressure if you feel the safety conditions are unsafe.
🧰 REQUIRED PPE: Task-specific PPE (Hard hat, safety spectacles, steel-toe shoes, hi-vis vest).
📌 PREVENTION: Daily 5S housekeeping audits and proactive near-miss reporting.`,
    simpleAnswerHi: `🔴 RISK LEVEL (जोखिम स्तर): Medium to High (सक्रिय स्थिति के अनुसार)
⚠️ HAZARD (खतरा): कार्यस्थल पर छिपे खतरे: तेल का फैलाव, नंगे बिजली के तार, खुली मशीनरी और बिना पीपीई के काम करना।
🛡️ WHAT TO DO (क्या करें):
1. रुकें और 360° नजर दौड़ाएं: कोई भी नया काम शुरू करने से पहले अपने आसपास चारों तरफ देखें।
2. इन 4 मुख्य क्षेत्रों की तुरंत जांच करें:
   - फर्श (Floor): क्या तेल, पानी या खुले तार बिखरे हैं?
   - मशीनें (Equipment): क्या कोई सुरक्षा जाली खुली है या अजीब आवाज आ रही है?
   - लोग (Workers): क्या सभी ने हेलमेट, जैकेट और जूते पहने हैं?
   - निकास (Exits): क्या आपातकालीन रास्ते और फायर सिलेंडर साफ और खाली हैं?
3. खतरे को अलग करें: खतरे वाले स्थान पर पीला सुरक्षा फीता (Barricade Tape) लगाएं।
4. सुपरवाइजर को सूचित करें: सुरक्षा अधिकारी को तुरंत खतरे का विवरण दें।
🚫 DO NOT (क्या न करें):
• किसी भी खतरे को यह सोचकर न छोड़ें कि "यह मेरा काम नहीं है"।
• असुरक्षित मशीनरी को शॉर्टकट अपनाकर जबरन चालू न करें।
• बिना सुरक्षा पुष्टि के खतरे वाले इलाके में न जाएं।
🧰 REQUIRED PPE (आवश्यक पीपीई): IS 2925 हेलमेट, IS 15298 जूते, हाई-विजिबिलिटी जैकेट।
📌 PREVENTION (रोकथाम): 5S कार्यस्थल सफाई और प्रतिदिन कार्य से पहले सुरक्षा निरीक्षण।`
  },
  {
    id: 'gas-leakage',
    category: 'Gas Leakage & Chemical',
    categoryHi: 'गैस रिसाव एवं रसायन (Gas Leakage)',
    icon: '🧪',
    starterQuestionEn: 'What is the immediate action protocol for industrial gas leakages?',
    starterQuestionHi: 'गैस रिसाव (Gas Leak) होने पर तुरंत क्या कदम उठाने चाहिए?',
    keywords: ['gas', 'leak', 'chemical', 'toxic', 'smell', 'h2s', 'methane', 'cylinder', 'गैस', 'रिसाव', 'रसायन', 'गंध'],
    simpleAnswerEn: `🔴 RISK LEVEL: High (Immediate Evacuation Hazard)
⚠️ HAZARD: Asphyxiation, toxic inhalation (H2S, CO), flammable explosion, and chemical lung burns.
🛡️ WHAT TO DO:
1. Immediately sound the chemical alarm and alert coworkers by shouting "GAS LEAK! EVACUATE UPWIND!".
2. Check the wind direction sock and evacuate UPWIND or CROSSWIND to high ground—never downwind.
3. Don emergency escape breathing apparatus (EEBA) or positive-pressure full-face respirator.
4. Shut off main cylinder manifold or pipeline emergency shutoff valves ONLY if safe and trained.
5. Muster at the designated Upwind Assembly Point and wait for HazMat clearance.
🚫 DO NOT:
• Do NOT turn on or off any electrical switches, flashlights, or motor vehicles (sparks ignite gas).
• Do NOT attempt rescue without self-contained breathing apparatus (SCBA).
• Do NOT re-enter the leak zone until atmospheric testing verifies normal oxygen (19.5% - 23.5%).
🧰 REQUIRED PPE: Full-Face Respirator with ABEK Chemical Filter or SCBA, Chemical Protective Suit, Nitrile Gauntlets.
📌 PREVENTION: Calibrated fixed gas sensor array, regular leak-check sniffer inspections, and HazMat drills.`,
    simpleAnswerHi: `🔴 RISK LEVEL (जोखिम स्तर): High (तत्काल निकास एवं दम घुटने का ख़तरा)
⚠️ HAZARD (खतरा): जहरीली गैस का रिसाव, ऑक्सीजन की भारी कमी, सांस रुकना और अचानक आग/विस्फोट।
🛡️ WHAT TO DO (क्या करें):
1. तुरंत सायरन बजाएं और साथियों को चेतावनी दें: "गैस रिसाव! हवा की विपरीत दिशा में भागें!"।
2. हवा का रुख (विंडसॉक) देखें और हवा के उल्टे रुख (Upwind) में ऊंची जगह की ओर सुरक्षित निकलें।
3. आपातकालीन रेस्पिरेटर या केमिकल मास्क तुरंत अपने चेहरे पर कसकर लगाएं।
4. यदि सुरक्षित हो और आप अधिकृत हैं, तो मुख्य गैस वाल्व (Emergency Shutoff) को तुरंत बंद करें।
5. असेंबली पॉइंट पर जाकर अपनी उपस्थिति दर्ज कराएं और सेफ्टी टीम के निर्देश की प्रतीक्षा करें।
🚫 DO NOT (क्या न करें):
• रिसाव क्षेत्र में कोई भी बिजली का स्विच, पंखा या लाइट न छुएं (स्पार्क से धमाका हो सकता है)।
• बिना ऑक्सीजन सिलेंडर (SCBA) के बेहोश साथी को बचाने अंदर न कूदें।
• गैस की गंध आने पर माचिस, लाइटर या मोबाइल फोन का प्रयोग न करें।
🧰 REQUIRED PPE (आवश्यक पीपीई): फुल-फेस केमिकल रेस्पिरेटर, गैस-टाइट चश्मा, रासायनिक रोधी दस्ताने।
📌 PREVENTION (रोकथाम): गैस सेंसर अलार्म की नियमित जांच और आपातकालीन निकास रास्तों की स्पष्ट मार्किंग।`
  }
];

export function findSafetyFallbackAnswer(
  query: string,
  language: 'hi' | 'en' = 'hi',
  scenarioContext?: string
): { answer: string; topicId: string; category: string } {
  const q = query.toLowerCase().trim();

  // 1. Keyword search matching
  let bestMatch: SafetyTopic | null = null;
  let highestScore = 0;

  for (const topic of SAFETY_TOPICS) {
    let score = 0;
    for (const kw of topic.keywords) {
      if (q.includes(kw.toLowerCase())) {
        score += 3;
      }
    }
    // Boost if scenario matches category
    if (scenarioContext) {
      if (scenarioContext.includes('ppe') && topic.id.includes('ppe')) score += 2;
      if (scenarioContext.includes('elec') && topic.id.includes('electrical')) score += 2;
      if (scenarioContext.includes('fire') && topic.id.includes('fire')) score += 2;
      if (scenarioContext.includes('mine') && topic.id.includes('mining')) score += 2;
      if (scenarioContext.includes('mach') && topic.id.includes('machinery')) score += 2;
      if (scenarioContext.includes('gas') && topic.id.includes('gas')) score += 2;
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = topic;
    }
  }

  // 2. If no strong keyword match, prioritize based on current scenario
  if (!bestMatch || highestScore === 0) {
    if (scenarioContext?.includes('electrical')) {
      bestMatch = SAFETY_TOPICS.find((t) => t.id === 'electrical-safety') || SAFETY_TOPICS[0];
    } else if (scenarioContext?.includes('fire')) {
      bestMatch = SAFETY_TOPICS.find((t) => t.id === 'fire-safety') || SAFETY_TOPICS[0];
    } else if (scenarioContext?.includes('mining')) {
      bestMatch = SAFETY_TOPICS.find((t) => t.id === 'mining-safety') || SAFETY_TOPICS[0];
    } else if (scenarioContext?.includes('machinery')) {
      bestMatch = SAFETY_TOPICS.find((t) => t.id === 'machinery-safety') || SAFETY_TOPICS[0];
    } else if (scenarioContext?.includes('gas')) {
      bestMatch = SAFETY_TOPICS.find((t) => t.id === 'gas-leakage') || SAFETY_TOPICS[0];
    } else {
      bestMatch = SAFETY_TOPICS[0]; // PPE baseline
    }
  }

  const answer = language === 'hi' ? bestMatch.simpleAnswerHi : bestMatch.simpleAnswerEn;
  return {
    answer,
    topicId: bestMatch.id,
    category: bestMatch.category
  };
}
