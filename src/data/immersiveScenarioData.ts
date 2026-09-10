import { ImmersiveScenarioDefinition, ImmersiveScenarioId } from '../types';

export const IMMERSIVE_SCENARIOS: Record<ImmersiveScenarioId, ImmersiveScenarioDefinition> = {
  'fire-emergency': {
    id: 'fire-emergency',
    titleEn: 'Fire Emergency Simulation',
    titleHi: 'आग आपातकालीन सिमुलेशन',
    subtitleEn: 'Manufacturing Floor • Electrical Panel Fire & Evacuation',
    subtitleHi: 'विनिर्माण फ्लोर • इलेक्ट्रिकल पैनल आग एवं सुरक्षित निकास',
    environmentType: 'manufacturing',
    regulatoryStandard: 'IS 2190:2010 / Indian Factories Act 1948 Sec 38',
    ambientSoundType: 'factory',
    phases: {
      normal: {
        descriptionEn: 'Manufacturing plant operating under normal production conditions. Technicians are monitoring CNC stations and assembly lines.',
        descriptionHi: 'विनिर्माण संयंत्र सामान्य उत्पादन स्थिति में कार्यरत है। तकनीशियन सीएनसी और असेंबली लाइनों की निगरानी कर रहे हैं।',
        narrationEn: 'Industrial manufacturing plant. Technicians are operating machinery in the assembly zone. All systems appear operational.',
        narrationHi: 'औद्योगिक विनिर्माण संयंत्र। असेंबली क्षेत्र में मशीनें सामान्य रूप से चल रही हैं।',
        durationSeconds: 5
      },
      warning: {
        warningTextEn: 'Subtle Warning: Sub-panel temperature rising rapidly. High-frequency buzz and thin wisps of smoke visible.',
        warningTextHi: 'सूक्ष्म चेतावनी: इलेक्ट्रिकल सब-पैनल का तापमान तेज़ी से बढ़ रहा है। हल्की भनभनाहट और हल्का धुआं दिखाई दे रहा है।',
        narrationEn: 'Warning signs detected. The motor control panel is overheating. Faint smoke and buzzing electrical arcing observed.',
        narrationHi: 'चेतावनी: इलेक्ट्रिकल पैनल अत्यधिक गर्म हो रहा है। हल्का धुआं और भनभनाहट सुनाई दे रही है।',
        visualCue: 'smoke_whisper',
        durationSeconds: 4
      },
      incident: {
        incidentTitleEn: 'INCIDENT: High-Voltage Electrical Fire & Smoke Eruption',
        incidentTitleHi: 'घटना: हाई-वोल्टेज इलेक्ट्रिकल पैनल में आग और घना धुआं',
        incidentDescriptionEn: 'A sudden electrical arc ignites insulation inside the main 440V panel. Flames erupt, dense toxic smoke billows, and the plant emergency siren triggers.',
        incidentDescriptionHi: 'मुख्य 440V पैनल में अचानक स्पार्क से आग भड़क गई है। जहरीला धुआं फैल रहा है और संयंत्र का आपातकालीन सायरन बज उठा है।',
        voiceAlertEn: 'Emergency. Fire has been detected in the electrical panel. Immediate action required.',
        voiceAlertHi: 'आपातकालीन चेतावनी! इलेक्ट्रिकल पैनल में आग का पता चला है। तुरंत कार्रवाई आवश्यक है।',
        visualEffect: 'fire_smoke',
        severity: 'critical',
        durationSeconds: 5
      },
      decision: {
        stageNumber: 1,
        totalStages: 1,
        stageNameEn: 'Emergency Response Action',
        stageNameHi: 'आपातकालीन प्रतिक्रिया निर्णय',
        situationEn: 'Flames and heavy toxic smoke are spreading from the live 440V electrical panel. The siren is sounding.',
        situationHi: 'लाइव 440V पैनल से आग और काला धुआं फैल रहा है। आपातकालीन सायरन बज रहा है।',
        promptEn: 'What should you do immediately?',
        promptHi: 'आपको तुरंत क्या करना चाहिए?',
        timerSeconds: 15,
        options: [
          {
            id: 'fire-opt-correct',
            keyLabel: 'A',
            textEn: 'Sound manual call point, inform supervisor, and evacuate through designated green exit to assembly area.',
            textHi: 'मैन्युअल फायर अलार्म दबाएं, सुपरवाइजर को सूचित करें और सुरक्षित निकास द्वार से असेंबली पॉइंट की ओर जाएं।',
            isCorrect: true,
            explanationEn: 'Correct statutory procedure! Raising the alarm alerts all workers, and early evacuation prevents toxic smoke inhalation.',
            explanationHi: 'बिल्कुल सही! अलार्म बजाने से सभी कर्मियों को चेतावनी मिलती है और सुरक्षित निकास से जहरीले धुएं से बचाव होता है।',
            consequenceEn: 'All workers hear the emergency alarm, evacuate smoothly through unobstructed exits, and reach the safe outdoor assembly point.',
            consequenceHi: 'सभी कर्मी सायरन सुनकर सुरक्षित मार्ग से बाहर असेंबली पॉइंट पर पहुंच जाते हैं।',
            standardRule: 'IS 2190 / Factories Act Sec 38'
          },
          {
            id: 'fire-opt-water',
            keyLabel: 'B',
            textEn: 'Pick up an open bucket of water and throw it directly at the burning 440V electrical panel.',
            textHi: 'पानी की बाल्टी उठाकर जलते हुए 440V बिजली के पैनल पर फेंक दें।',
            isCorrect: false,
            explanationEn: 'Extremely dangerous! Water is an electrical conductor. Throwing water on an energized 440V panel causes severe electrocution and explosive steam spall.',
            explanationHi: 'अत्यंत घातक! पानी बिजली का सुचालक है। चालू 440 वोल्ट पैनल पर पानी फेंकने से जानलेवा करंट और विस्फोट हो सकता है।',
            consequenceEn: 'Severe electrical shock risk! Conductive water stream bridges 440V phase to ground, creating an explosive flashover.',
            consequenceHi: 'घातक बिजली का झटका! पानी की धार से शॉर्ट सर्किट और जोरदार धमाका होता है।',
            standardRule: 'NFPA 70E / IS 5216'
          },
          {
            id: 'fire-opt-open',
            keyLabel: 'C',
            textEn: 'Open the burning metal panel doors with bare hands to pull out melting cables.',
            textHi: 'नंगे हाथों से जलते हुए लोहे के पैनल का दरवाज़ा खोलकर पिघलते तारों को खींचने का प्रयास करें।',
            isCorrect: false,
            explanationEn: 'Fatal hazard! Opening a burning live panel exposes you to intense radiant heat, flash fire, and live 440V busbars.',
            explanationHi: 'घातक भूल! जलते हुए पैनल को खोलने से भयंकर आग का झोंका और नंगे तारों से जानलेवा करंट लग सकता है।',
            consequenceEn: 'Extreme thermal burn and electrocution hazard from contact with live copper busbars.',
            consequenceHi: 'लाइव बसबार के संपर्क से गंभीर जलन और बिजली का झटका।',
            standardRule: 'Central Electricity Authority Safety Regs'
          },
          {
            id: 'fire-opt-film',
            keyLabel: 'D',
            textEn: 'Stay in the smoke-filled room and record video on your phone for social media.',
            textHi: 'धुएं से भरे कमरे में रुककर मोबाइल से सोशल मीडिया के लिए वीडियो बनाएं।',
            isCorrect: false,
            explanationEn: 'Unacceptable behavior! Toxic smoke containing carbon monoxide and cyanide can cause loss of consciousness in under 60 seconds.',
            explanationHi: 'अस्वीकार्य लापरवाही! कार्बन मोनोऑक्साइड युक्त जहरीला धुआं 1 मिनट में बेहोश कर सकता है।',
            consequenceEn: 'Rapid asphyxiation from toxic combustion gases, trapping personnel inside the fire zone.',
            consequenceHi: 'जहरीली गैसों से दम घुटना और रास्ते में फंस जाना।',
            standardRule: 'Industrial Safety Standard SOP'
          }
        ]
      },
      consequence: {
        safeResultEn: 'Immediate evacuation and alarm containment ensured 100% headcount safety at the outdoor assembly point. Fire response team arrived with CO2 extinguishers.',
        safeResultHi: 'तुरंत अलार्म बजाने और सुरक्षित निकास से सभी कर्मी खुले असेंबली पॉइंट पर सुरक्षित पहुंच गए। अग्निशमन दल ने CO2 सिलेंडर से आग बुझाई।',
        unsafeResultEn: 'Delaying evacuation or attempting unsafe water suppression puts lives in immediate peril from toxic smoke and 440V electrocution.',
        unsafeResultHi: 'निकास में देरी या पानी फेंकने से जहरीला धुआं और जानलेवा करंट का खतरा पैदा होता है।',
        visualConsequence: 'evac_safe'
      },
      solution: {
        titleEn: 'Standard Fire Emergency Evacuation Procedure',
        titleHi: 'मानक अग्नि आपातकालीन निकास प्रक्रिया',
        summaryEn: 'In any industrial fire, personal life safety precedes equipment protection. Never fight a fire unless trained and it is safe.',
        summaryHi: 'औद्योगिक आग में जीवन रक्षा मशीन की सुरक्षा से पहले आती है। जब तक प्रशिक्षित न हों, आग से सीधे न लड़ें।',
        steps: [
          {
            stepNumber: 1,
            icon: 'AlertTriangle',
            actionEn: 'Raise the Fire Alarm Immediately',
            actionHi: 'तुरंत फायर अलार्म बजाएं',
            detailEn: 'Break manual call point glass or pull station to notify the entire factory and emergency response team.',
            detailHi: 'मैन्युअल कॉल पॉइंट का शीशा तोड़कर या स्विच दबाकर पूरे कारखाने में सायरन बजाएं।',
            standardRef: 'IS 2190'
          },
          {
            stepNumber: 2,
            icon: 'PhoneCall',
            actionEn: 'Inform Shift Supervisor & Control Room',
            actionHi: 'सुपरवाइजर और कंट्रोल रूम को सूचित करें',
            detailEn: 'Relay exact incident location, panel number, and nature of burning material.',
            detailHi: 'घटना का सटीक स्थान, पैनल नंबर और किस चीज़ में आग लगी है, कंट्रोल रूम को बताएं।',
            standardRef: 'Factories Act Sec 38'
          },
          {
            stepNumber: 3,
            icon: 'DoorOpen',
            actionEn: 'Move Toward Designated Safe Exit',
            actionHi: 'निर्धारित सुरक्षित निकास की ओर बढ़ें',
            detailEn: 'Follow illuminated green exit signs. Stay low if smoke is accumulating at ceiling level.',
            detailHi: 'हरे रंग के एग्जिट बोर्ड की दिशा में चलें। यदि धुआं ऊपर भरा हो तो झुककर चलें।',
            standardRef: 'NBC 2016 Part 4'
          },
          {
            stepNumber: 4,
            icon: 'Footprints',
            actionEn: 'Evacuate Without Panic',
            actionHi: 'शांत रहकर सुरक्षित बाहर निकलें',
            detailEn: 'Do not use elevators/lifts. Keep walkways clear. Never re-enter for personal belongings.',
            detailHi: 'लिफ्ट का उपयोग न करें। सीढ़ियों से उतरें। सामान लेने वापस न लौटें।',
            standardRef: 'IS 14435'
          },
          {
            stepNumber: 5,
            icon: 'Flame',
            actionEn: 'Extinguish ONLY If Trained & Safe (PASS Method)',
            actionHi: 'केवल प्रशिक्षित होने पर CO2 बुझाएं (PASS नियम)',
            detailEn: 'Use Carbon Dioxide (CO2) or Dry Chemical Powder on electrical fires. Never use water on live equipment.',
            detailHi: 'बिजली की आग पर केवल CO2 या ड्राई केमिकल पाउडर का प्रयोग करें। पानी कभी न डालें।',
            standardRef: 'IS 2878'
          },
          {
            stepNumber: 6,
            icon: 'Users',
            actionEn: 'Report to Designated Assembly Point',
            actionHi: 'निर्धारित असेंबली पॉइंट पर एकत्रित हों',
            detailEn: 'Gather at designated outdoor muster area for immediate roll-call and attendance verification.',
            detailHi: 'बाहर खुले असेंबली पॉइंट पर जाकर हाजिरी दर्ज कराएं ताकि पता चले सभी सुरक्षित हैं।',
            standardRef: 'Factories Act Sec 38'
          },
          {
            stepNumber: 7,
            icon: 'CheckCircle2',
            actionEn: 'Follow Official Emergency Team Directives',
            actionHi: 'आपातकालीन टीम के निर्देशों का पालन करें',
            detailEn: 'Do not return into the plant until the Safety Officer issues official all-clear clearance.',
            detailHi: 'जब तक सुरक्षा अधिकारी आधिकारिक ऑल-क्लियर न दें, संयंत्र के भीतर दोबारा न जाएं।',
            standardRef: 'Statutory Safety Clearance'
          }
        ],
        prohibitedActionsEn: [
          'NEVER use water or foam on live electrical fires.',
          'NEVER open burning high-voltage panels with bare hands.',
          'NEVER use passenger elevators during a fire evacuation.',
          'NEVER re-enter a burning building to retrieve personal belongings.'
        ],
        prohibitedActionsHi: [
          'चालू बिजली की आग पर कभी भी पानी या झाग न डालें।',
          'जलते हुए पैनल को कभी भी नंगे हाथों से न खोलें।',
          'आग लगने पर कभी भी लिफ्ट का इस्तेमाल न करें।',
          'पर्स या मोबाइल लेने के लिए कभी भी अंदर वापस न लौटें।'
        ]
      }
    }
  },

  'electrical-incident': {
    id: 'electrical-incident',
    titleEn: 'Electrical Incident Simulation',
    titleHi: 'विद्युत दुर्घटना सिमुलेशन',
    subtitleEn: 'Industrial Switchgear Room • 440V Arc Flash & LOTO',
    subtitleHi: 'औद्योगिक स्विचगियर कक्ष • 440V आर्क फ्लैश एवं लोटो प्रक्रिया',
    environmentType: 'electrical',
    regulatoryStandard: 'IS 5216 / CEA Safety Regulations 2010',
    ambientSoundType: 'electrical',
    phases: {
      normal: {
        descriptionEn: 'High-voltage Motor Control Center (MCC). Transformers and switchgear are operating within standard voltage tolerances.',
        descriptionHi: 'हाई-वोल्टेज मोटर कंट्रोल सेंटर। ट्रांसफार्मर और स्विचगियर सामान्य वोल्टेज सीमा में कार्य कर रहे हैं।',
        narrationEn: 'Industrial electrical switchgear room. High-voltage distribution panels are energized at 440 volts.',
        narrationHi: 'औद्योगिक विद्युत स्विचगियर कक्ष। 440 वोल्ट पर विद्युत वितरण पैनल कार्यरत हैं।',
        durationSeconds: 5
      },
      warning: {
        warningTextEn: 'Warning: Abnormal 50Hz corona buzz and flickering breaker indicator lights. Faint ozone smell.',
        warningTextHi: 'चेतावनी: असामान्य भनभनाहट और ब्रेकर की लाइटें झिलमिला रही हैं। ओजोन गैस की गंध आ रही है।',
        narrationEn: 'Abnormal condition detected. High electrical vibration and contact chatter observed in breaker compartment 3.',
        narrationHi: 'चेतावनी: ब्रेकर कम्पार्टमेंट में असामान्य कंपन और स्पार्किंग के लक्षण दिख रहे हैं।',
        visualCue: 'electric_vibration',
        durationSeconds: 4
      },
      incident: {
        incidentTitleEn: 'INCIDENT: Violent 440V Arc Flash & Spark Discharge',
        incidentTitleHi: 'घटना: 440V आर्क फ्लैश और आग की भयानक चिंगारियां',
        incidentDescriptionEn: 'Phase-to-phase short circuit triggers a blinding electrical arc flash with loud cracking, thermal blast waves, and molten metal spatter.',
        incidentDescriptionHi: 'शॉर्ट सर्किट से तेज आवाज के साथ 440 वोल्ट का आर्क फ्लैश हुआ। आग की तेज लपटें और चिंगारियां उड़ रही हैं।',
        voiceAlertEn: 'Warning. Electrical arcing detected in 440 volt switchgear. Maintain safe boundary.',
        voiceAlertHi: 'सावधान! 440 वोल्ट स्विचगियर में भयंकर स्पार्किंग हो रही है। सुरक्षित दूरी बनाए रखें।',
        visualEffect: 'electrical_arc',
        severity: 'critical',
        durationSeconds: 5
      },
      decision: {
        stageNumber: 1,
        totalStages: 1,
        stageNameEn: 'Arc Flash Safe Reaction',
        stageNameHi: 'आर्क फ्लैश सुरक्षा निर्णय',
        situationEn: 'The 440V panel is arcing violently with continuous crackling sparks and molten copper droplets shooting across the floor.',
        situationHi: '440 वोल्ट पैनल से चिंगारियां और पिघला हुआ तांबा फर्श पर बिखर रहा है।',
        promptEn: 'What is the trainee mandatory action?',
        promptHi: 'प्रशिक्षार्थी को क्या अनिवार्य कदम उठाना चाहिए?',
        timerSeconds: 15,
        options: [
          {
            id: 'elec-opt-correct',
            keyLabel: 'A',
            textEn: 'Stop immediately, step back beyond the 3-meter boundary, and inform the authorized plant electrician.',
            textHi: 'तुरंत रुकें, कम से कम 3 मीटर सुरक्षित दूरी पर हटें और अधिकृत इलेक्ट्रीशियन को सूचित करें।',
            isCorrect: true,
            explanationEn: 'Statutory compliance! Stepping outside the arc flash flashover boundary protects eyes and skin from radiant burns.',
            explanationHi: 'नियम के अनुसार सही! सुरक्षित दूरी (कम से कम 3 मीटर) बनाने से आंखों और त्वचा को आर्क फ्लैश से बचाया जा सकता है।',
            consequenceEn: 'Trainee avoids blast concussion and radiant thermal burn. Certified electrician isolates upstream supply safely.',
            consequenceHi: 'प्रशिक्षार्थी सुरक्षित दूरी पर सुरक्षित रहता है और अधिकृत इलेक्ट्रीशियन मुख्य सप्लाई बंद करता है।',
            standardRule: 'IS 5216 / CEA Reg 19'
          },
          {
            id: 'elec-opt-touch',
            keyLabel: 'B',
            textEn: 'Grab the sparking cable with cotton work gloves and attempt to push it back into the terminal.',
            textHi: 'सूती दस्ताने पहनकर स्पार्क कर रहे तार को नंगे हाथ से धक्का देकर टर्मिनल में लगाने की कोशिश करें।',
            isCorrect: false,
            explanationEn: 'Fatal mistake! Cotton gloves provide 0 volts insulation against 440V phase power. Instant fatal electrocution and deep 4th-degree burns occur.',
            explanationHi: 'जानलेवा भूल! सूती दस्ताने बिजली नहीं रोक सकते। 440 वोल्ट से तुरंत घातक करंट और गंभीर जलन होगी।',
            consequenceEn: 'Catastrophic electric shock and ventricular fibrillation from direct contact with 440V phase.',
            consequenceHi: '440 वोल्ट के सीधे संपर्क से जानलेवा बिजली का झटका।',
            standardRule: 'CEA Safety Regulations'
          },
          {
            id: 'elec-opt-water',
            keyLabel: 'C',
            textEn: 'Spray pressurized water from the nearby fire hose reel onto the sparking switchgear.',
            textHi: 'पास के होज-रील से पानी का छिड़काव सीधे स्पार्क कर रहे बिजली के पैनल पर करें।',
            isCorrect: false,
            explanationEn: 'Deadly error! Water stream conducts 440V back up into the user holding the metal nozzle.',
            explanationHi: 'घातक गलती! पानी की धार से 440 वोल्ट का करंट सीधे नोजल पकड़ने वाले व्यक्ति तक पहुंच जाएगा।',
            consequenceEn: 'Electrocution transmitted through conductive water stream.',
            consequenceHi: 'पानी के जरिए करंट लगने से भारी क्षति।',
            standardRule: 'IS 2190 Electrical Prohibition'
          },
          {
            id: 'elec-opt-ignore',
            keyLabel: 'D',
            textEn: 'Continue working within 1 meter of the panel without notifying anyone.',
            textHi: 'पैनल के ठीक 1 मीटर पास खड़े होकर काम जारी रखें और किसी को न बताएं।',
            isCorrect: false,
            explanationEn: 'Dangerous negligence! Arc flashes can expand into sustained 3-phase short circuits with temperatures exceeding 5,000°C.',
            explanationHi: 'गंभीर लापरवाही! आर्क फ्लैश 5000 डिग्री सेल्सियस तक गर्म हो सकता है जो कपड़े जला सकता है।',
            consequenceEn: 'Sudden secondary blast wave causing severe eye flash burns and projectile injuries.',
            consequenceHi: 'अचानक बड़े धमाके से आंखों और शरीर को गंभीर नुकसान।',
            standardRule: 'Safety Protocol Violation'
          }
        ]
      },
      consequence: {
        safeResultEn: 'Maintaining a 3m clearance and requesting Lockout/Tagout (LOTO) isolation prevented injury. Certified electrical crew de-energized upstream breaker.',
        safeResultHi: '3 मीटर दूरी बनाए रखने और लोटो आइसोलेशन की मांग से सभी सुरक्षित रहे। अधिकृत टीम ने मेन ब्रेकर को लॉक किया।',
        unsafeResultEn: 'Approaching or touching live 440V conductors causes fatal electrocution and permanent retinal flash injury.',
        unsafeResultHi: 'चालू 440V तारों को छूने से जानलेवा करंट और आंखों की रोशनी जाने का खतरा होता है।',
        visualConsequence: 'loto_safe'
      },
      solution: {
        titleEn: 'Safe Electrical Hazard Management Procedure',
        titleHi: 'सुरक्षित विद्युत जोखिम प्रबंधन प्रक्रिया',
        summaryEn: 'Only certified Class A/B electricians are authorized to touch energized switchgear. Never attempt DIY electrical repairs.',
        summaryHi: 'केवल अधिकृत प्रमाणित इलेक्ट्रीशियन ही बिजली पैनल खोल सकते हैं। कभी भी खुद मरम्मत का प्रयास न करें।',
        steps: [
          {
            stepNumber: 1,
            icon: 'Hand',
            actionEn: 'Stop Work & Maintain Safe Distance',
            actionHi: 'तुरंत रुकें और सुरक्षित दूरी बनाएं',
            detailEn: 'Step back at least 3 meters (10 feet) outside the restricted arc flash boundary immediately.',
            detailHi: 'पैनल से कम से कम 3 मीटर (10 फीट) दूर हट जाएं ताकि चिंगारियां न लगें।',
            standardRef: 'NFPA 70E / IS 5216'
          },
          {
            stepNumber: 2,
            icon: 'ShieldOff',
            actionEn: 'DO NOT Touch Any Exposed or Live Parts',
            actionHi: 'किसी भी नंगे तार या उपकरण को न छुएं',
            detailEn: 'Never use metal tools, screwdrivers, or bare hands on or near damaged electrical enclosures.',
            detailHi: 'बिना इंसुलेटेड औजार या नंगे हाथों से किसी भी बिजली के तार को कभी न छुएं।',
            standardRef: 'CEA Reg 19'
          },
          {
            stepNumber: 3,
            icon: 'PhoneCall',
            actionEn: 'Report to Shift In-Charge & Electrician',
            actionHi: 'शिफ्ट इंचार्ज और इलेक्ट्रीशियन को सूचित करें',
            detailEn: 'Call the electrical maintenance department and declare an urgent arc fault condition.',
            detailHi: 'इलेक्ट्रिकल विभाग को फोन करके पैनल नंबर और स्पार्किंग की तुरंत सूचना दें।',
            standardRef: 'Plant SOP'
          },
          {
            stepNumber: 4,
            icon: 'Lock',
            actionEn: 'Enforce Lockout / Tagout (LOTO) Isolation',
            actionHi: 'लोटो (LOTO) तालाबंदी प्रक्रिया लागू करें',
            detailEn: 'Upstream feeder circuit breaker must be racked out, locked with safety padlocks, and tagged.',
            detailHi: 'मेन ब्रेकर को बंद करके उस पर लाल ताला और डेंजर टैग (LOTO) लगाएं।',
            standardRef: 'IS 8032 LOTO Standard'
          },
          {
            stepNumber: 5,
            icon: 'HardHat',
            actionEn: 'Allow Authorized Personnel with Rated PPE',
            actionHi: 'केवल प्रमाणित इलेक्ट्रीशियन को अधिकृत करें',
            detailEn: 'Only licensed electricians wearing certified Class 0 rubber gloves and arc face shields may enter.',
            detailHi: 'केवल 1000V प्रमाणित इंसुलेटेड दस्ताने और आर्क शील्ड पहने तकनीशियन ही जांच करें।',
            standardRef: 'IS 4770 Dielectric PPE'
          },
          {
            stepNumber: 6,
            icon: 'CheckCircle2',
            actionEn: 'Resume Operations ONLY After Clearance Certificate',
            actionHi: 'स्वीकृति प्रमाण पत्र मिलने पर ही काम शुरू करें',
            detailEn: 'Area must be tested with calibrated multi-meter for zero residual energy before work resumes.',
            detailHi: 'वोल्टेज टेस्टर से 0 वोल्ट की पुष्टि होने और अधिकृत क्लियरेंस मिलने पर ही काम शुरू करें।',
            standardRef: 'Permit to Work (PTW)'
          }
        ],
        prohibitedActionsEn: [
          'NEVER touch a sparking panel, switch, or cable with bare hands.',
          'NEVER use conductive metal ladders near high-voltage lines.',
          'NEVER reset a tripped high-voltage breaker without an electrician inspection.',
          'NEVER bypass or tape over electrical safety fuses or interlocks.'
        ],
        prohibitedActionsHi: [
          'स्पार्क कर रहे पैनल या केबल को नंगे हाथों से कभी न छुएं।',
          'बिजली की लाइनों के पास लोहे या एल्युमिनियम की सीढ़ी का इस्तेमाल न करें।',
          'ट्रिप हुए ब्रेकर को बिना जांच कराए बार-बार चालू करने की कोशिश न करें।',
          'बिजली के फ्यूज या सेफ्टी लॉक को कभी भी बाईपास न करें।'
        ]
      }
    }
  },

  'mining-incident': {
    id: 'mining-incident',
    titleEn: 'Mining Underground Safety Simulation',
    titleHi: 'भूमिगत खनन सुरक्षा सिमुलेशन',
    subtitleEn: 'Underground Coal Seam • Strata Roof Fall & Methane Alert',
    subtitleHi: 'भूमिगत कोयला खदान • छत गिरने का खतरा एवं मीथेन गैस चेतावनी',
    environmentType: 'mining',
    regulatoryStandard: 'DGMS Coal Mines Regulations 2017 (CMR Reg 123 & 133)',
    ambientSoundType: 'mining',
    phases: {
      normal: {
        descriptionEn: 'Underground coal face excavation gallery. Timber and hydraulic props are supporting the sandstone strata roof.',
        descriptionHi: 'भूमिगत कोयला खदान गैलरी। हाइड्रोलिक और लकड़ी के खंभे छत को सहारा दे रहे हैं।',
        narrationEn: 'Underground coal mine working gallery. Ventilation air is flowing through the intake airway. Miners are operating at the face.',
        narrationHi: 'भूमिगत कोयला खदान कार्यक्षेत्र। ताजी हवा की वेंटिलेशन चल रही है और खनिक काम कर रहे हैं।',
        durationSeconds: 5
      },
      warning: {
        warningTextEn: 'Warning: Micro-seismic creaking in timber props. Coal spalling chips raining from the sandstone roof seam.',
        warningTextHi: 'चेतावनी: लकड़ी के खंभों से चरमराहट की आवाज। छत से कोयले के छोटे टुकड़े और धूल गिर रही है।',
        narrationEn: 'Strata movement detected. Audible creaking heard from roof supports and fine coal dust is dropping.',
        narrationHi: 'छत में हलचल देखी गई। खंभों से चरमराहट की आवाज आ रही है और बारीक कोयला गिर रहा है।',
        visualCue: 'roof_dust',
        durationSeconds: 4
      },
      incident: {
        incidentTitleEn: 'INCIDENT: Active Roof Cleavage Fracture & Methane Spike',
        incidentTitleHi: 'घटना: खदान की छत में दरार और मीथेन गैस का रिसाव',
        incidentDescriptionEn: 'A deep fracture opens in the unsupported roof strata. Rocks detach and crash down, while the digital methanometer sounds continuous alarm (>1.25%).',
        incidentDescriptionHi: 'असमर्थित छत में बड़ी दरार पड़ गई है और पत्थर गिर रहे हैं। मीथेन गैस का सायरन (1.25% से अधिक) बज रहा है।',
        voiceAlertEn: 'Alert. Strata roof movement and gas alarm in underground seam. Withdraw immediately.',
        voiceAlertHi: 'सावधान! खदान की छत खिसक रही है और मीथेन गैस का अलार्म बज रहा है। तुरंत बाहर हटें।',
        visualEffect: 'roof_collapse',
        severity: 'critical',
        durationSeconds: 5
      },
      decision: {
        stageNumber: 1,
        totalStages: 1,
        stageNameEn: 'Mining Emergency Evacuation Decision',
        stageNameHi: 'खनन आपातकालीन निकास निर्णय',
        situationEn: 'Rocks are falling from the unsupported coal face, and the methane monitor flashes red at 1.4% (dangerous explosive threshold).',
        situationHi: 'छत से पत्थर गिर रहे हैं और मीथेन मीटर 1.4% पर लाल बत्ती के साथ चीख रहा है।',
        promptEn: 'What is the required DGMS statutory action?',
        promptHi: 'डीजीएमएस नियमावली के अनुसार आपका क्या कर्तव्य है?',
        timerSeconds: 15,
        options: [
          {
            id: 'mine-opt-correct',
            keyLabel: 'A',
            textEn: 'Halt work immediately, withdraw to the intake airway under permanent steel arches, and alert Mining Sirdar.',
            textHi: 'तुरंत काम रोकें, समर्थित स्टील आर्च वाले ताजी हवा के रास्ते में हटें और माइनिंग सिरदार को सूचित करें।',
            isCorrect: true,
            explanationEn: 'Statutory compliance with DGMS CMR Reg 123/133! Withdrawing to supported intake airway prevents entrapment and suffocating gas exposure.',
            explanationHi: 'डीजीएमएस नियमों के अनुसार सही! तुरंत समर्थित स्टील आर्च क्षेत्र में जाने से छत गिरने और गैस से जान बचती है।',
            consequenceEn: 'All miners withdraw safely into the well-ventilated intake airway. Sirdar places danger barricade across the unstable face.',
            consequenceHi: 'सभी खनिक सुरक्षित ताजी हवा के मार्ग में पहुंच जाते हैं। सिरदार खतरे का बोर्ड लगा देता है।',
            standardRule: 'DGMS Coal Mines Regs 123 & 133'
          },
          {
            id: 'mine-opt-hammer',
            keyLabel: 'B',
            textEn: 'Walk under the cracked roof with a crowbar and vigorously strike the rock to see if it falls.',
            textHi: 'दरार वाली छत के नीचे जाकर लोहे के सब्बल से पत्थर को ठोककर देखें कि वह गिरता है या नहीं।',
            isCorrect: false,
            explanationEn: 'Fatal practice! Striking an unstable roof without temporary support causes instant strata collapse directly onto the miner.',
            explanationHi: 'अत्यंत घातक गलती! बिना सपोर्ट वाली कमजोर छत को ठोकने से पूरी छत तुरंत सिर पर गिर सकती है।',
            consequenceEn: 'Instant strata collapse causing severe crushing entrapment.',
            consequenceHi: 'छत ढहने से नीचे दबने का घातक जोखिम।',
            standardRule: 'DGMS Sounding Protocol Violation'
          },
          {
            id: 'mine-opt-stay',
            keyLabel: 'C',
            textEn: 'Ignore the gas alarm and continue shoveling coal to finish your daily tonnage quota.',
            textHi: 'गैस अलार्म को नजरअंदाज करके कोयला उठाना जारी रखें ताकि टारगेट पूरा हो सके।',
            isCorrect: false,
            explanationEn: 'Criminal negligence! Operating in >1.25% CH4 atmosphere risks catastrophic underground methane explosion and asphyxiation.',
            explanationHi: 'गंभीर अपराध! 1.25% से अधिक मीथेन में काम करने से भयानक धमाका हो सकता है।',
            consequenceEn: 'Explosive methane deflagration ignited by machine friction sparks.',
            consequenceHi: 'चिनगारी से मीथेन गैस में भयंकर विस्फोट का खतरा।',
            standardRule: 'DGMS CMR Reg 133 Prohibition'
          },
          {
            id: 'mine-opt-goaf',
            keyLabel: 'D',
            textEn: 'Run inside the unventilated abandoned goaf area to hide.',
            textHi: 'छिपने के लिए पुराने बंद पड़े गोफ (Goaf) क्षेत्र की ओर भागें।',
            isCorrect: false,
            explanationEn: 'Deadly mistake! Abandoned goaves contain zero oxygen and lethal concentrations of carbon monoxide (white damp) and black damp.',
            explanationHi: 'घातक भूल! बंद गोफ में ऑक्सीजन शून्य होती है और जहरीली गैसें तुरंत मार देती हैं।',
            consequenceEn: 'Instant fatal asphyxiation within 30 seconds from oxygen deficiency in goaf.',
            consequenceHi: 'गोफ में जहरीली गैसों से तुरंत बेहोशी और मौत।',
            standardRule: 'DGMS CMR 144 Goaf Entry Ban'
          }
        ]
      },
      consequence: {
        safeResultEn: 'Immediate withdrawal to the intake airway saved the entire crew. Mining Sirdar isolated the section and dispatched roof-bolting teams.',
        safeResultHi: 'तुरंत ताजी हवा वाले रास्ते में हटने से सभी खनिक बच गए। माइनिंग सिरदार ने रास्ता बंद कर रूफ-बोल्टिंग टीम बुलाई।',
        unsafeResultEn: 'Remaining under unstable strata or in methane concentrations above 1.25% leads to roof collapse entrapment or gas explosion.',
        unsafeResultHi: 'कमजोर छत के नीचे रुकने या मीथेन गैस में काम करने से दबने या विस्फोट की भयानक घटना होती है।',
        visualConsequence: 'mining_evac_safe'
      },
      solution: {
        titleEn: 'DGMS Mining Strata & Gas Incident Procedure',
        titleHi: 'डीजीएमएस खनन छत व गैस सुरक्षा प्रक्रिया',
        summaryEn: 'Under DGMS Coal Mines Regulations 2017, no person shall remain under an unsupported roof or in inflammable gas exceeding 1.25%.',
        summaryHi: 'डीजीएमएस नियमों के तहत असमर्थित छत के नीचे या 1.25% से अधिक मीथेन में किसी को भी काम करने की अनुमति नहीं है।',
        steps: [
          {
            stepNumber: 1,
            icon: 'Hand',
            actionEn: 'Stop All Mechanical Work Immediately',
            actionHi: 'तुरंत सभी काम और मशीनें बंद करें',
            detailEn: 'Switch off coal cutting machinery and electric drills at once to eliminate ignition friction sparks.',
            detailHi: 'मशीनों और ड्रिल को तुरंत बंद करें ताकि कोई चिंगारी न निकले।',
            standardRef: 'CMR Reg 133'
          },
          {
            stepNumber: 2,
            icon: 'Shield',
            actionEn: 'Withdraw Immediately to Supported Steel Arches',
            actionHi: 'तुरंत मजबूत सपोर्ट वाले रास्ते में हटें',
            detailEn: 'Retreat out of the working face to the permanent steel arch roadway under full roof support.',
            detailHi: 'कमजोर क्षेत्र से बाहर निकलकर मजबूत लोहे की आर्च वाले पक्के रास्ते में जाएं।',
            standardRef: 'CMR Reg 123'
          },
          {
            stepNumber: 3,
            icon: 'PhoneCall',
            actionEn: 'Inform Mining Sirdar & Surface Control Room',
            actionHi: 'माइनिंग सिरदार और कंट्रोल रूम को सूचित करें',
            detailEn: 'Report strata movement and methanometer reading via underground flameproof telephone.',
            detailHi: 'खदान टेलीफोन से तुरंत सिरदार और कंट्रोल रूम को छत और गैस की जानकारी दें।',
            standardRef: 'CMR Reg 48'
          },
          {
            stepNumber: 4,
            icon: 'ShieldOff',
            actionEn: 'DO NOT Enter Any Restricted or Goaf Areas',
            actionHi: 'किसी भी प्रतिबंधित या पुराने गोफ में न जाएं',
            detailEn: 'Respect danger boards. Never enter old workings where black damp and poisonous gases linger.',
            detailHi: 'लाल खतरे के बोर्ड का सम्मान करें। बंद खदान में कभी कदम न रखें।',
            standardRef: 'CMR Reg 144'
          },
          {
            stepNumber: 5,
            icon: 'Footprints',
            actionEn: 'Follow Designated Intake Airway Route',
            actionHi: 'निर्धारित ताजी हवा के मार्ग का अनुसरण करें',
            detailEn: 'Move in the direction of fresh incoming intake air toward the mine pit bottom or drift.',
            detailHi: 'ताजी हवा आने की दिशा में आगे बढ़ें ताकि सांस लेने में कोई परेशानी न हो।',
            standardRef: 'CMR Reg 153'
          },
          {
            stepNumber: 6,
            icon: 'CheckCircle2',
            actionEn: 'Return ONLY After Statutory Sirdar Clearance',
            actionHi: 'सिरदार की लिखित जांच के बाद ही वापस आएं',
            detailEn: 'Section must be tested with safety lamp and multi-gas detector and certified safe under Reg 129.',
            detailHi: 'जब तक सिरदार और ओवरमैन गैस और छत की दोबारा जांच करके सुरक्षित घोषित न करें, काम पर न लौटें।',
            standardRef: 'CMR Reg 129 Statutory Clearance'
          }
        ],
        prohibitedActionsEn: [
          'NEVER work under an unsupported roof strata.',
          'NEVER enter a coal seam if CH4 exceeds 1.25%.',
          'NEVER tamper with or open flameproof electrical casings underground.',
          'NEVER sleep or sit in unventilated return airways.'
        ],
        prohibitedActionsHi: [
          'बिना सपोर्ट वाली खदान की छत के नीचे कभी काम न करें।',
          'यदि मीथेन 1.25% से ज्यादा हो तो कभी भी अंदर न जाएं।',
          'भूमिगत बिजली के बक्सों को कभी खुद खोलने का प्रयास न करें।',
          'बिना वेंटिलेशन वाले गंदी हवा के रास्ते में कभी न बैठें।'
        ]
      }
    }
  },

  'machinery-incident': {
    id: 'machinery-incident',
    titleEn: 'Machinery Incident Simulation',
    titleHi: 'मशीनरी सुरक्षा सिमुलेशन',
    subtitleEn: 'Heavy Industrial Plant • Conveyor Nip-Point & E-Stop',
    subtitleHi: 'भारी उद्योग संयंत्र • कन्वेयर रोलर निप-पॉइंट एवं ई-स्टॉप प्रक्रिया',
    environmentType: 'machinery',
    regulatoryStandard: 'Indian Factories Act 1948 Section 21 (Fencing of Machinery)',
    ambientSoundType: 'heavy-machinery',
    phases: {
      normal: {
        descriptionEn: 'Bulk material conveyor belt running at 2.5 m/s. Interlocked wire mesh guards enclose all rotating pulleys and pinch points.',
        descriptionHi: 'कन्वेयर बेल्ट 2.5 मीटर/सेकंड की गति से चल रही है। घूमने वाले पहियों पर सुरक्षा जाली लगी है।',
        narrationEn: 'Heavy machinery operational floor. Belt conveyor is transporting aggregate. Protective guards are secured in place.',
        narrationHi: 'मशीनरी संचालन फ्लोर। कन्वेयर बेल्ट सुचारू रूप से चल रही है और सुरक्षा जाली लगी हुई है।',
        durationSeconds: 5
      },
      warning: {
        warningTextEn: 'Warning: Metallic grinding screech and drive motor strain. Interlocked mesh guard latch rattling loose.',
        warningTextHi: 'चेतावनी: मशीन से असामान्य घिसने की आवाज। सुरक्षा जाली का ताला ढीला होकर हिल रहा है।',
        narrationEn: 'Mechanical anomaly observed. Belt speed fluctuating with loud screeching from the head pulley bearing.',
        narrationHi: 'मशीन में खराबी: बेल्ट की गति धीमी हो रही है और भारी आवाज आ रही है।',
        visualCue: 'guard_rattle',
        durationSeconds: 4
      },
      incident: {
        incidentTitleEn: 'INCIDENT: Jammed Roller & Exposed High-Speed Nip-Point',
        incidentTitleHi: 'घटना: कन्वेयर रोलर जाम और सुरक्षा जाली का खुल जाना',
        incidentDescriptionEn: 'The guard latch fails and pops open. A heavy foreign object jams between the high-speed belt and steel idler roller, producing friction smoke.',
        incidentDescriptionHi: 'सुरक्षा जाली खुल गई है और घूमने वाले रोलर में सामान फंसने से भारी धुआं और चिनगारियां निकल रही हैं।',
        voiceAlertEn: 'Alert. Conveyor nip-point jammed. Dangerous condition. Shut down power immediately.',
        voiceAlertHi: 'चेतावनी! कन्वेयर रोलर जाम हो गया है। जानलेवा खतरा! तुरंत इमरजेंसी स्टॉप दबाएं।',
        visualEffect: 'conveyor_jam',
        severity: 'high',
        durationSeconds: 5
      },
      decision: {
        stageNumber: 1,
        totalStages: 1,
        stageNameEn: 'Rotating Machinery Emergency Stop',
        stageNameHi: 'मशीन इमरजेंसी स्टॉप निर्णय',
        situationEn: 'The high-speed conveyor roller is jammed, smoking from friction, and rotating with exposed pinch points.',
        situationHi: 'रोलर जाम होकर धुआं दे रहा है और सुरक्षा जाली खुली हुई है।',
        promptEn: 'What is the required safe operating procedure?',
        promptHi: 'सुरक्षित मानक संचालन प्रक्रिया क्या है?',
        timerSeconds: 15,
        options: [
          {
            id: 'mach-opt-correct',
            keyLabel: 'A',
            textEn: 'Hit the Red Mushroom Emergency Stop (E-Stop) button immediately, keep hands clear, and initiate LOTO.',
            textHi: 'तुरंत लाल रंग का इमरजेंसी स्टॉप (E-Stop) बटन दबाएं, हाथ दूर रखें और लोटो प्रक्रिया शुरू करें।',
            isCorrect: true,
            explanationEn: 'Statutory compliance with Factories Act Sec 21! Pressing the E-Stop instantly interrupts drive power, halting rotating inertia.',
            explanationHi: 'बिल्कुल सही! इमरजेंसी स्टॉप दबाने से मशीन तुरंत रुक जाती है और जानलेवा खिंचाव का खतरा टल जाता है।',
            consequenceEn: 'Conveyor drive motor shuts down within 1.5 seconds. Rotating nip point comes to a safe standstill.',
            consequenceHi: 'कन्वेयर 1.5 सेकंड में रुक जाती है और हाथ फंसने का जोखिम खत्म हो जाता है।',
            standardRule: 'Factories Act 1948 Sec 21 / IS 11000'
          },
          {
            id: 'mach-opt-reach',
            keyLabel: 'B',
            textEn: 'Reach both hands into the spinning nip-point while the belt is running to yank out the stuck item.',
            textHi: 'चलती मशीन के रोलर में दोनों हाथ डालकर फंसे सामान को खींचने की कोशिश करें।',
            isCorrect: false,
            explanationEn: 'Catastrophic error! A moving conveyor pulley pulls at speeds exceeding human reflexes (>2 m/s), causing traumatic limb entrapment and amputation.',
            explanationHi: 'भयंकर भूल! चलती मशीन 2 मीटर प्रति सेकंड की गति से हाथ को अंदर खींच लेती है जिससे अंग कटने का खतरा होता है।',
            consequenceEn: 'Severe mechanical crush entrapment from rotating pinch points.',
            consequenceHi: 'घूमते रोलर में हाथ फंसने से गंभीर चोट का जोखिम।',
            standardRule: 'OSHA / Factories Act Prohibited'
          },
          {
            id: 'mach-opt-bypass',
            keyLabel: 'C',
            textEn: 'Use a cable zip-tie to bypass the safety interlock switch so the machine keeps running.',
            textHi: 'तार या रस्सी बांधकर सेफ्टी स्विच को दबा दें ताकि मशीन बिना रुके चलती रहे।',
            isCorrect: false,
            explanationEn: 'Illegal and dangerous! Tampering with or bypassing safety interlocks directly violates industrial statutory safety laws.',
            explanationHi: 'गैरकानूनी और घातक! सेफ्टी स्विच को बायपास करना कारखाने के कानून का उल्लंघन है।',
            consequenceEn: 'Disabled fail-safe causes equipment burn-out and secondary fires.',
            consequenceHi: 'सेफ्टी स्विच बंद करने से आग और मशीन में भारी नुकसान।',
            standardRule: 'Factories Act Section 21 Violation'
          },
          {
            id: 'mach-opt-kick',
            keyLabel: 'D',
            textEn: 'Kick the spinning jammed pulley with your safety shoe to force it back in rotation.',
            textHi: 'सुरक्षा जूते से चलती हुई जाम पुली पर जोरदार लात मारकर घुमाने का प्रयास करें।',
            isCorrect: false,
            explanationEn: 'Dangerous folly! The moving belt will catch the shoe tread and drag the trainee under the heavy rollers.',
            explanationHi: 'खतरनाक मूर्खता! बेल्ट जूते को पकड़कर व्यक्ति को रोलर के नीचे खींच लेगी।',
            consequenceEn: 'Severe lower limb fracture from entrapment under conveyor belt.',
            consequenceHi: 'पैर फंसने से गंभीर फ्रैक्चर का खतरा।',
            standardRule: 'Basic Mechanical Safety Rule'
          }
        ]
      },
      consequence: {
        safeResultEn: 'Engaging the Emergency Stop button halted all kinetic power immediately. Maintenance crew applied padlocks and cleared the jam safely.',
        safeResultHi: 'ई-स्टॉप दबाने से मशीन तुरंत रुक गई। मेंटेनेंस टीम ने ताला लगाकर सुरक्षित तरीके से जाम हटाया।',
        unsafeResultEn: 'Reaching into running equipment or bypassing guards causes catastrophic limb entrapment.',
        unsafeResultHi: 'चलती मशीन में हाथ डालने से अंग कटने या कुचलने की गंभीर दुर्घटना हो सकती है।',
        visualConsequence: 'estop_safe'
      },
      solution: {
        titleEn: 'Rotating Machinery & Conveyor Safety Protocol',
        titleHi: 'घूर्णन मशीनरी एवं कन्वेयर सुरक्षा नियम',
        summaryEn: 'Under Section 21 of the Indian Factories Act 1948, every moving part of transmission machinery must be securely fenced and guarded.',
        summaryHi: 'कारखाना अधिनियम 1948 की धारा 21 के तहत सभी घूमने वाले हिस्सों पर मजबूत सुरक्षा जाली अनिवार्य है।',
        steps: [
          {
            stepNumber: 1,
            icon: 'Hand',
            actionEn: 'Follow Safe Stop Procedure (Hit E-Stop)',
            actionHi: 'तुरंत इमरजेंसी स्टॉप (E-Stop) दबाएं',
            detailEn: 'Slap the prominent red mushroom emergency stop button or pull the emergency trip wire cord.',
            detailHi: 'लाल रंग का बड़ा ई-स्टॉप बटन दबाएं या आपातकालीन सुरक्षा तार खींचें।',
            standardRef: 'Factories Act Sec 21'
          },
          {
            stepNumber: 2,
            icon: 'ShieldOff',
            actionEn: 'Stay Away from Exposed Moving Parts',
            actionHi: 'घूमते हिस्सों से हाथ और कपड़े दूर रखें',
            detailEn: 'Never touch rotating pulleys, idlers, or nip points while the system is still coasting to a stop.',
            detailHi: 'जब तक मशीन पूरी तरह रुक न जाए, किसी भी पहिए या बेल्ट को न छुएं।',
            standardRef: 'IS 11000'
          },
          {
            stepNumber: 3,
            icon: 'PhoneCall',
            actionEn: 'Notify Mechanical Supervisor Immediately',
            actionHi: 'मैकेनिकल सुपरवाइजर को तुरंत सूचित करें',
            detailEn: 'Report the guard failure, machine vibration, and jammed item location.',
            detailHi: 'जाली टूटने और रोलर जाम होने की सूचना तुरंत सुपरवाइजर को दें।',
            standardRef: 'Plant Maintenance Protocol'
          },
          {
            stepNumber: 4,
            icon: 'Lock',
            actionEn: 'Execute Lockout / Tagout (LOTO) Before Maintenance',
            actionHi: 'तालाबंदी (LOTO) ताला लगाएं',
            detailEn: 'Isolate main motor isolator switch, attach personal safety padlock, and verify zero kinetic energy.',
            detailHi: 'मेन स्विच बंद करके अपना लाल सुरक्षा ताला लगाएं ताकि कोई दूसरा चालू न कर सके।',
            standardRef: 'IS 8032 LOTO Standard'
          },
          {
            stepNumber: 5,
            icon: 'HardHat',
            actionEn: 'Allow Authorized Maintenance Crew to Inspect',
            actionHi: 'केवल अधिकृत मेंटेनेंस टीम को ठीक करने दें',
            detailEn: 'Fitters will clear the blockage using specialized tools—never by hand force.',
            detailHi: 'विशेष औजारों की मदद से प्रशिक्षित फिटर ही जाम सामान को बाहर निकालेंगे।',
            standardRef: 'Safe Work Method Statement'
          },
          {
            stepNumber: 6,
            icon: 'CheckCircle2',
            actionEn: 'Reinstall & Interlock Guards Before Restart',
            actionHi: 'सुरक्षा जाली दोबारा लगाकर ही मशीन चलाएं',
            detailEn: 'Verify all safety guards are securely bolted and interlocks tested before removing LOTO padlocks.',
            detailHi: 'जाली के सारे नट-बोल्ट कसने और सेफ्टी स्विच चेक करने के बाद ही ताला खोलें।',
            standardRef: 'Factories Act Sec 21'
          }
        ],
        prohibitedActionsEn: [
          'NEVER reach into moving conveyor nip-points while running.',
          'NEVER bypass, tape, or defeat machine safety interlock switches.',
          'NEVER wear loose clothing, ties, or jewelry near rotating shafts.',
          'NEVER clean or oil machinery while it is in operation.'
        ],
        prohibitedActionsHi: [
          'चलती मशीन के अंदर कभी भी हाथ या औजार न डालें।',
          'सेफ्टी स्विच को कभी भी टेप या तार से बायपास न करें।',
          'मशीनों के पास ढीले कपड़े, मफलर या अंगूठी न पहनें।',
          'चलती मशीन में तेल डालने या सफाई करने का प्रयास कभी न करें।'
        ]
      }
    }
  },

  'ppe-hazard-id': {
    id: 'ppe-hazard-id',
    titleEn: 'PPE & Hazard Identification Simulation',
    titleHi: 'पीपीई एवं कार्यस्थल खतरा पहचान सिमुलेशन',
    subtitleEn: 'Interactive Inspection • Tap Objects to Detect Hazards',
    subtitleHi: 'इंटरएक्टिव निरीक्षण • खतरों को पहचानने के लिए स्क्रीन पर टैप करें',
    environmentType: 'manufacturing',
    regulatoryStandard: 'IS 2925 (Helmets) / IS 5983 (Eye) / Factories Act 1948',
    ambientSoundType: 'factory',
    phases: {
      normal: {
        descriptionEn: 'Active industrial workshop with workers engaged in assembly, grinding, and material transfer. Observation is required to spot safety non-compliances.',
        descriptionHi: 'सक्रिय औद्योगिक कार्यशाला। यहां कुछ गंभीर सुरक्षा कमियां हैं जिन्हें ध्यानपूर्वक देखकर पहचानना होगा।',
        narrationEn: 'Industrial plant floor inspection. Scan the workplace carefully. Multiple safety violations and hazards are present.',
        narrationHi: 'कार्यस्थल सुरक्षा निरीक्षण। पूरे क्षेत्र को ध्यान से देखें। कई जगह सुरक्षा नियमों का उल्लंघन हो रहा है।',
        durationSeconds: 5
      },
      warning: {
        warningTextEn: 'Observation Phase: Look closely at workers, floors, fire exits, and electrical wiring.',
        warningTextHi: 'निरीक्षण चरण: कर्मियों के पीपीई, फर्श, आपातकालीन निकास और बिजली के तारों को ध्यान से देखें।',
        narrationEn: 'Prepare to inspect. Identify hazardous conditions by tapping on workers and equipment.',
        narrationHi: 'निरीक्षण के लिए तैयार हों। स्क्रीन पर टैप करके खतरों की पहचान करें।',
        visualCue: 'inspect_pulse',
        durationSeconds: 4
      },
      incident: {
        incidentTitleEn: 'INTERACTIVE CHALLENGE: Identify All Workplace Hazards',
        incidentTitleHi: 'चुनौती: कार्यस्थल के सभी खतरों को पहचानें',
        incidentDescriptionEn: 'Observe the scene and tap on workers or areas that violate industrial safety standards.',
        incidentDescriptionHi: 'दृश्य को ध्यान से देखें और उन कर्मियों या स्थानों पर टैप करें जो सुरक्षा नियमों का उल्लंघन कर रहे हैं।',
        voiceAlertEn: 'Interactive inspection active. Tap on the hazards you observe in the workplace.',
        voiceAlertHi: 'निरीक्षण सक्रिय है। कार्यस्थल में दिखने वाले खतरों पर टैप करें।',
        visualEffect: 'conveyor_jam',
        severity: 'high',
        durationSeconds: 6
      },
      decision: {
        stageNumber: 1,
        totalStages: 1,
        stageNameEn: 'Hazard Identification Decision',
        stageNameHi: 'खतरा पहचान निर्णय',
        situationEn: 'You have observed multiple safety infractions across the shop floor.',
        situationHi: 'आपने कार्यस्थल में कई सुरक्षा उल्लंघनों का निरीक्षण किया है।',
        promptEn: 'What is the most critical immediate safety priority?',
        promptHi: 'सबसे पहली और आवश्यक सुरक्षा प्राथमिकता क्या है?',
        timerSeconds: 15,
        options: [
          {
            id: 'ppe-opt-correct',
            keyLabel: 'A',
            textEn: 'Enforce mandatory PPE (Helmets, Eye Shields), clear blocked exits, and isolate frayed electrical wiring immediately.',
            textHi: 'अनिवार्य पीपीई (हेलमेट, चश्मा) पहनवाएं, बंद निकास साफ कराएं और कटे तारों को तुरंत बिजली से अलग करें।',
            isCorrect: true,
            explanationEn: 'Full compliance with Indian Factories Act and IS standards! Eliminating baseline hazards prevents 90% of industrial incidents.',
            explanationHi: 'बिल्कुल सही! सभी कर्मियों को पीपीई पहनाना और रास्तों को साफ रखना 90% हादसों को रोक देता है।',
            consequenceEn: 'Workplace hazards resolved. Zero near-misses recorded across the shift.',
            consequenceHi: 'सभी खतरों को दूर कर दिया गया और कार्यस्थल सुरक्षित हो गया।',
            standardRule: 'Factories Act 1948 & IS Standards'
          },
          {
            id: 'ppe-opt-ignore',
            keyLabel: 'B',
            textEn: 'Assume workers know what they are doing and let them work without PPE.',
            textHi: 'यह मान लें कि मजदूर अपना काम जानते हैं और उन्हें बिना हेलमेट काम करने दें।',
            isCorrect: false,
            explanationEn: 'Dangerous assumption! Overhead objects from cranes can cause fatal head injuries without certified IS 2925 helmets.',
            explanationHi: 'घातक लापरवाही! क्रेन से सामान गिरने पर बिना हेलमेट गंभीर सिर की चोट लग सकती है।',
            consequenceEn: 'High near-miss rate and potential falling object head injuries.',
            consequenceHi: 'सिर में गंभीर चोट लगने का खतरा।',
            standardRule: 'Safety Negligence'
          },
          {
            id: 'ppe-opt-paint',
            keyLabel: 'C',
            textEn: 'Only worry about painting the floor yellow and ignore missing helmets.',
            textHi: 'केवल फर्श को पीला रंगने पर ध्यान दें और हेलमेट को नजरअंदाज करें।',
            isCorrect: false,
            explanationEn: 'Wrong priority! Personal protective equipment protects the worker directly from traumatic impact.',
            explanationHi: 'गलत प्राथमिकता! पीपीई व्यक्ति की सीधी जान बचाता है।',
            consequenceEn: 'Superficial compliance while life-threatening physical hazards persist.',
            consequenceHi: 'दिखावटी काम जबकि जान का जोखिम बना रहता है।',
            standardRule: 'Hierarchy of Controls'
          }
        ]
      },
      consequence: {
        safeResultEn: 'Accurate hazard identification enabled proactive safety interventions before any worker was harmed.',
        safeResultHi: 'समय पर सही खतरे पहचानने से किसी भी मजदूर को चोट लगने से पहले ही बचाव हो गया।',
        unsafeResultEn: 'Ignoring baseline PPE violations and blocked exits leads directly to severe industrial injuries during emergencies.',
        unsafeResultHi: 'पीपीई की अनदेखी और बंद रास्ते आपातकाल में गंभीर हादसों का कारण बनते हैं।',
        visualConsequence: 'inspect_safe'
      },
      solution: {
        titleEn: 'Comprehensive Industrial PPE & Housekeeping Standards',
        titleHi: 'व्यापक औद्योगिक पीपीई एवं स्वच्छता मानक',
        summaryEn: 'Personal Protective Equipment (PPE) is the final barrier protecting human life from industrial hazards. 100% compliance is mandatory.',
        summaryHi: 'पीपीई मानव जीवन की रक्षा करने वाला अंतिम सुरक्षा कवच है। इसका 100% पालन अनिवार्य है।',
        steps: [
          {
            stepNumber: 1,
            icon: 'HardHat',
            actionEn: 'Mandatory Safety Helmets in Overhead Risk Zones',
            actionHi: 'क्रेन और लोडिंग क्षेत्र में सुरक्षा हेलमेट अनिवार्य',
            detailEn: 'Industrial safety helmets compliant with IS 2925 must be worn with chin strap secured.',
            detailHi: 'IS 2925 प्रमाणित हेलमेट को चिन स्ट्रैप (फीता) कसकर ही पहनें।',
            standardRef: 'IS 2925'
          },
          {
            stepNumber: 2,
            icon: 'Eye',
            actionEn: 'Eye & Face Protection at Grinding & Chemical Stations',
            actionHi: 'ग्राइंडिंग और केमिकल कार्य पर सुरक्षा चश्मा अनिवार्य',
            detailEn: 'Impact-resistant polycarbonate goggles (IS 5983) prevent metallic particulate corneal lacerations.',
            detailHi: 'चिनगारी और केमिकल के छींटों से बचने के लिए IS 5983 प्रमाणित चश्मा पहनें।',
            standardRef: 'IS 5983'
          },
          {
            stepNumber: 3,
            icon: 'DoorOpen',
            actionEn: 'Keep All Fire Exits & Pathways 100% Unobstructed',
            actionHi: 'सभी आपातकालीन निकास मार्गों को पूरी तरह खाली रखें',
            detailEn: 'Never stack wooden pallets, scrap drums, or boxes in front of marked fire exit doors.',
            detailHi: 'आपातकालीन दरवाजों के आगे कभी भी लकड़ी के बक्से या कबाड़ न रखें।',
            standardRef: 'Factories Act Sec 38'
          },
          {
            stepNumber: 4,
            icon: 'Zap',
            actionEn: 'Inspect & Replace Frayed Electrical Cables',
            actionHi: 'कटे-फटे बिजली के तारों को तुरंत बदलें',
            detailEn: 'Temporary wiring across walkways must be protected in heavy-duty rubber cable ramps.',
            detailHi: 'पैदल चलने के रास्ते पर खुले तार न छोड़ें। उन्हें सुरक्षित रबर रैंप से ढकें।',
            standardRef: 'CEA Safety Regs'
          },
          {
            stepNumber: 5,
            icon: 'AlertTriangle',
            actionEn: 'Contain Chemical Puddles Immediately with Spill Kits',
            actionHi: 'फर्श पर फैले तेल या केमिकल को तुरंत साफ करें',
            detailEn: 'Use absorbent neutralizer pads and post yellow caution slip warning boards.',
            detailHi: 'फिसलन वाले तेल पर सूखा बुरादा डालें और चेतावनी बोर्ड लगाएं।',
            standardRef: 'IS 5182'
          },
          {
            stepNumber: 6,
            icon: 'CheckCircle2',
            actionEn: 'Conduct Daily Pre-Shift Tool Box Talks (TBT)',
            actionHi: 'हर दिन काम से पहले 5 मिनट की टूल बॉक्स टॉक करें',
            detailEn: 'Review safety checklists with all contract and permanent workers before shift begins.',
            detailHi: 'काम शुरू करने से पहले सभी मजदूरों को उस दिन के खतरों की जानकारी दें।',
            standardRef: 'Statutory Safety Routine'
          }
        ],
        prohibitedActionsEn: [
          'NEVER enter a construction or crane zone without an IS 2925 helmet.',
          'NEVER stack material within 1 meter of a fire extinguisher or fire exit.',
          'NEVER use grinding machines without the protective wheel guard in place.',
          'NEVER leave damaged power tool cables taped with ordinary masking tape.'
        ],
        prohibitedActionsHi: [
          'क्रेन क्षेत्र में बिना हेलमेट के कभी प्रवेश न करें।',
          'फायर सिलेंडर या इमरजेंसी गेट के 1 मीटर के दायरे में सामान न रखें।',
          'बिना सेफ्टी गार्ड वाली ग्राइंडिंग मशीन कभी न चलाएं।',
          'कटे हुए बिजली के तारों पर साधारण टेप लगाकर इस्तेमाल न करें।'
        ]
      }
    },
    hazardItems: [
      {
        id: 'hz-helmet',
        nameEn: 'Worker without Safety Helmet',
        nameHi: 'बिना हेलमेट काम करता मजदूर',
        x: 28,
        y: 62,
        isActualHazard: true,
        hazardType: 'missing_ppe',
        descriptionEn: 'Worker is standing directly beneath the overhead gantry crane without an IS 2925 safety helmet.',
        descriptionHi: 'मजदूर क्रेन के ठीक नीचे बिना हेलमेट खड़ा है। ऊपर से सामान गिरने का भारी जोखिम है।',
        remedyEn: 'Issue certified IS 2925 helmet with chin strap immediately.',
        remedyHi: 'तुरंत सुरक्षा हेलमेट पहनाएं।',
        standardRef: 'IS 2925'
      },
      {
        id: 'hz-goggles',
        nameEn: 'Grinder with Goggles on Forehead',
        nameHi: 'माथे पर चश्मा रखकर ग्राइंडिंग करता कारीगर',
        x: 52,
        y: 56,
        isActualHazard: true,
        hazardType: 'missing_ppe',
        descriptionEn: 'Worker has pushed protective eye goggles onto forehead while grinding steel, exposing eyes to molten sparks.',
        descriptionHi: 'कारीगर ने ग्राइंडिंग करते समय चश्मा माथे पर चढ़ा रखा है। आंखों में गर्म चिनगारी जाने का खतरा है।',
        remedyEn: 'Mandate full eye shield protection before operating grinding wheel.',
        remedyHi: 'आंखों पर तुरंत चश्मा लगवाएं।',
        standardRef: 'IS 5983'
      },
      {
        id: 'hz-exit',
        nameEn: 'Blocked Emergency Fire Exit Door',
        nameHi: 'सामान से बंद किया गया फायर एग्जिट दरवाजा',
        x: 88,
        y: 42,
        isActualHazard: true,
        hazardType: 'housekeeping',
        descriptionEn: 'Wooden pallets and scrap drums are stacked directly in front of the emergency fire exit door, blocking egress.',
        descriptionHi: 'इमरजेंसी दरवाजे के सामने लकड़ी के बक्से और ड्रम रखकर रास्ता बंद कर दिया गया है।',
        remedyEn: 'Clear exit route immediately to maintain minimum 1.5m clearance.',
        remedyHi: 'रास्ते को तुरंत खाली करवाएं।',
        standardRef: 'Factories Act Sec 38'
      },
      {
        id: 'hz-cable',
        nameEn: 'Frayed 230V Cable on Wet Walkway',
        nameHi: 'गीले फर्श पर कटा हुआ बिजली का तार',
        x: 44,
        y: 78,
        isActualHazard: true,
        hazardType: 'electrical',
        descriptionEn: 'Damaged power cord with exposed copper conductor is lying across a moist pedestrian walkway.',
        descriptionHi: 'कटा हुआ बिजली का तार गीले फर्श पर पड़ा है जिससे करंट फैलने का खतरा है।',
        remedyEn: 'De-energize, replace cord, and route through overhead cable trays.',
        remedyHi: 'सप्लाई बंद कर तार बदलें और रबर रैंप से ढकें।',
        standardRef: 'CEA Reg 19'
      },
      {
        id: 'hz-chemical',
        nameEn: 'Uncontained Lubricant Oil Puddle',
        nameHi: 'फर्श पर फैला फिसलन भरा तेल',
        x: 68,
        y: 74,
        isActualHazard: true,
        hazardType: 'chemical',
        descriptionEn: 'Slippery hydraulic oil leak without caution signage or spill containment pads.',
        descriptionHi: 'फर्श पर तेल का रिसाव है और कोई सावधानी का बोर्ड नहीं लगा है।',
        remedyEn: 'Apply spill absorbent powder and post yellow slip caution sign.',
        remedyHi: 'तेल सोखने वाला पाउडर डालें और बोर्ड लगाएं।',
        standardRef: 'IS 5182'
      },
      // Benign non-hazards (if trainee taps safe objects)
      {
        id: 'hz-safe-extinguisher',
        nameEn: 'Wall-Mounted CO2 Fire Extinguisher',
        nameHi: 'दीवार पर लगा सही फायर सिलेंडर',
        x: 12,
        y: 45,
        isActualHazard: false,
        descriptionEn: 'This is a certified, fully inspected CO2 fire extinguisher with valid test pressure gauge. It is a safety control, not a hazard!',
        descriptionHi: 'यह दीवार पर लगा चालू फायर सिलेंडर है। यह एक सुरक्षा उपकरण है, कोई खतरा नहीं!'
      },
      {
        id: 'hz-safe-worker',
        nameEn: 'Compliant Worker in Full PPE',
        nameHi: 'पूरी सुरक्षा किट पहने जिम्मेदार मजदूर',
        x: 75,
        y: 58,
        isActualHazard: false,
        descriptionEn: 'This worker is wearing a certified helmet, high-visibility vest, safety shoes, and gloves. Safe practice!',
        descriptionHi: 'यह मजदूर हेलमेट, रिफ्लेक्टिव जैकेट और सेफ्टी जूते पहने हुए है। यह सुरक्षित आचरण है!'
      }
    ]
  }
};
