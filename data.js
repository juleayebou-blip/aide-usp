/* =====================================================================
   DONNÉES CLINIQUES — À VALIDER PAR UN PROFESSIONNEL AVANT TOUT USAGE
   Ce fichier est le seul à modifier pour changer le contenu médical.

   Source principale : « Manuel d'ordinogrammes à l'intention des formations
   sanitaires », Ministère de la Santé, République Togolaise, juin 2015 (Togo).
   Source complémentaire (recoupement) : Guides cliniques et thérapeutiques RDC 2016.
   Chaque schéma indique sa source (« Ord. n » = ordinogramme n du manuel togolais).
   Le champ « valider » signale un point à vérifier par un professionnel.
   ===================================================================== */

const APP_META = {
  version: "0.4-prototype",
  dateContenu: "2026-10-07",
  statut: "BROUILLON NON VALIDÉ",
  sources: [
    "Manuel d'ordinogrammes, MSP Togo, juin 2015 (source principale)",
    "Guides cliniques et thérapeutiques RDC 2016, Médecine interne et Pédiatrie (source pour les ajouts v0.3 : ulcère, morsures, diabète, HTA, drépanocytose, hémorroïdes, rhumatisme ; les IST viennent du manuel togolais)",
    "Livre « Prise en charge HTA » (Cardiologie, p. 188-225 ; HAS 2005, ESH 2007) : source de l'algorithme HTA"
  ]
};

/* ---------------------------------------------------------------------
   MÉDICAMENTS
   Types de régime :
   - mgkg     : dose par prise = mgkg x poids  (ou mgkgJour / parJour). mgkgMax / mgkgJourMax = borne haute d'une fourchette.
   - tranches : doses par tranches de poids
   - fixe     : texte libre (dose fixe)
   - totalkg  : volume total = dose x poids (ex. SRO)
   Filtres facultatifs : ageMin / ageMax (en MOIS, ageMax exclu), poidsMin / poidsMax (kg, poidsMax exclu)
   formes : mg (contenu par unité), ml (volume de l'unité si liquide) ; conv:false = pas de conversion
   Adulte = 15 ans et plus (180 mois) dans ce manuel.
   --------------------------------------------------------------------- */
const MEDICAMENTS = [
  {
    id: "paracetamol",
    nom: "Paracétamol",
    classe: "Antalgique / antipyrétique",
    formes: [
      { nom: "Sirop 125 mg/5 mL", mg: 125, ml: 5 },
      { nom: "Comprimé 100 mg", mg: 100 },
      { nom: "Comprimé 500 mg", mg: 500 }
    ],
    regimes: [
      {
        id: "para-enf", indication: "Fièvre ≥ 38,5 °C / douleur — enfant",
        type: "mgkg", mgkg: 15, parJour: 4, jours: null, maxPrise: 1000, maxJour: 4000,
        ageMin: 2, ageMax: 180,
        note: "Toutes les 6 heures jusqu'à disparition de la fièvre. Donner si température ≥ 38,5 °C.",
        source: "Ord. 1 (tableau I) et Ord. 6 : 15 mg/kg toutes les 6 h",
        valider: "Le manuel propose aussi l'AAS chez l'enfant > 6 ans ; non repris ici."
      },
      {
        id: "para-adulte", indication: "Fièvre / douleur — adulte",
        type: "fixe", texte: "1 g (2 comprimés de 500 mg) par prise, 3 fois par jour, 6 h d'intervalle minimum",
        parJour: 3, jours: null, ageMin: 180,
        note: "À prendre au cours des repas ; boire beaucoup d'eau.",
        source: "Ord. 16 : paracétamol 500 mg, 2 cp x 3/j"
      },
      {
        id: "para-cvo", indication: "Crise vaso-occlusive (drépanocytose) — enfant : dose de charge",
        type: "mgkg", mgkg: 30, parJour: 1, jours: 1, maxPrise: 1000, ageMin: 6, ageMax: 180,
        note: "Dose de charge 30 mg/kg (1 g si plus de 12 ans), puis 15 mg/kg toutes les 6 heures (500 mg si plus de 12 ans).",
        source: "RDC Pédiatrie, drépanocytose (crise vaso-occlusive bénigne)"
      }
    ],
    ci: ["Insuffisance hépatique sévère", "Allergie au paracétamol"],
    precautions: ["Ne jamais dépasser la dose maximale journalière", "Attention aux associations contenant déjà du paracétamol", "Dénutrition / alcoolisme chronique : réduire la dose"],
    effets: ["Rares aux doses usuelles ; hépatotoxicité en cas de surdosage"]
  },

  {
    id: "ibuprofene",
    nom: "Ibuprofène",
    classe: "Anti-inflammatoire non stéroïdien",
    formes: [
      { nom: "Sirop 100 mg/5 mL", mg: 100, ml: 5 },
      { nom: "Comprimé 200 mg", mg: 200 },
      { nom: "Comprimé 400 mg", mg: 400 }
    ],
    regimes: [
      {
        id: "ibu-enf", indication: "Douleur de gorge / d'oreille — enfant",
        type: "mgkg", mgkgJour: 30, parJour: 3, jours: 3, maxPrise: 400, maxJour: 1200,
        ageMin: 3, ageMax: 180,
        note: "À prendre pendant les repas. Durée courte.",
        source: "Ord. 12 : ibuprofène 30 mg/kg/jour en 3 prises pendant les repas"
      },
      {
        id: "ibu-cvo", indication: "Crise vaso-occlusive (drépanocytose) — enfant, si douleur persistante après 30 à 45 min",
        type: "mgkg", mgkg: 10, parJour: 3, jours: 3, maxPrise: 400, ageMin: 6, ageMax: 180,
        note: "10 mg/kg par prise, 3 prises par jour, pendant le repas, avec hydratation.",
        source: "RDC Pédiatrie, drépanocytose ; posologie retenue par le validateur"
      },
      {
        id: "ibu-adulte", indication: "Douleur / inflammation (IST pelviennes, prostatite, rhumatisme) — adulte",
        type: "fixe", texte: "400 mg, 2 comprimés (800 mg) matin et soir, au cours du repas",
        parJour: 2, jours: 5, ageMin: 180,
        note: "5 à 10 jours selon l'indication (maladie inflammatoire du pelvis 5 jours ; cervicite 10 jours ; prostatite et cystite 7 jours).",
        source: "Togo Ord. 26 et 31",
        valider: "Dose maximale élevée ; protéger l'estomac si traitement prolongé."
      }
    ],
    ci: ["Enfant < 3 mois", "Déshydratation / vomissements importants / diarrhée sévère", "Ulcère gastro-duodénal, saignement digestif", "Insuffisance rénale, cardiaque ou hépatique sévère", "Grossesse", "Suspicion de paludisme grave ou de fièvre hémorragique (risque de saignement)", "Varicelle"],
    precautions: ["Asthme (risque de bronchospasme)", "Hypertension, traitement anticoagulant ou diurétique"],
    effets: ["Douleurs gastriques, nausées", "Insuffisance rénale aiguë si déshydratation"]
  },

  {
    id: "amoxicilline",
    nom: "Amoxicilline",
    classe: "Antibiotique (bêta-lactamine)",
    formes: [
      { nom: "Comprimé / poudre pour sirop 250 mg", mg: 250 },
      { nom: "Sirop 250 mg/5 mL", mg: 250, ml: 5 },
      { nom: "Gélule / comprimé 500 mg", mg: 500 }
    ],
    regimes: [
      {
        id: "amox-pneumo-enf", indication: "Pneumonie de l'enfant (non grave)",
        type: "mgkg", mgkgJour: 100, parJour: 3, jours: 5, maxPrise: 1000, ageMin: 2, ageMax: 180,
        note: "Réévaluer après 2 jours : si amélioration, continuer ; sinon référer. Allergie aux pénicillines : érythromycine.",
        source: "Ord. 2, traitement 3 : amoxicilline 100 mg/kg en 3 prises/jour pendant 5 jours",
        valider: "100 mg/kg/j est plus élevé que la PCIME/OMS (≈ 50 mg/kg/j). Le guide RDC cite aussi 50-100 mg/kg/j. À confirmer avec le PNLP/PCIME en vigueur."
      },
      {
        id: "amox-angine-enf", indication: "Angine bactérienne de l'enfant",
        type: "mgkg", mgkgJour: 100, parJour: 3, jours: 10, maxPrise: 1000, ageMin: 2, ageMax: 180,
        note: "Continuer 10 jours même après la disparition de la douleur (risque de RAA, glomérulonéphrite).",
        source: "Ord. 11, traitement 1 : 100 mg/kg/jour en 3 prises, 10 jours"
      },
      {
        id: "amox-rougeole", indication: "Rougeole — prévention de la surinfection",
        type: "mgkg", mgkgJour: 100, parJour: 2, jours: 10, maxPrise: 1000, ageMin: 2, ageMax: 180,
        note: "En 2 prises par jour, au moins 10 jours.",
        source: "Ord. 1, traitement 8"
      },
      {
        id: "amox-grave-enf", indication: "Pneumonie grave de l'enfant — dose avant transfert (IM/IV)",
        type: "mgkg", mgkg: 50, parJour: null, jours: null, maxPrise: null, ageMin: 2, ageMax: 180,
        note: "Une injection (ou ceftriaxone 50 mg/kg), puis référer.",
        source: "Ord. 2, traitement 4"
      },
      {
        id: "amox-adulte", indication: "Pneumonie / bronchite / laryngite de l'adulte",
        type: "fixe", texte: "1 g (2 gélules de 500 mg) par prise, matin, midi et soir",
        parJour: 3, jours: 10, ageMin: 180,
        note: "Pas d'amélioration après 5 jours : référer. Signes de gravité : ceftriaxone 2 g puis référer.",
        source: "Ord. 16 (traitement 6) et Ord. 17 (traitements 2 à 4)"
      },
      {
        id: "amox-hp", indication: "Gastrite / ulcère : éradication d'Helicobacter pylori — adulte",
        type: "fixe", texte: "1 g, 2 fois par jour, avec l'oméprazole et la clarithromycine (ou le métronidazole)",
        parJour: 2, jours: 14, ageMin: 180,
        note: "Traitement de 14 jours (protocole retenu).",
        source: "RDC Méd. interne III.3 et III.4 ; Togo Ord. 23, traitement 3"
      }
    ],
    ci: ["Allergie aux pénicillines (risque de choc anaphylactique)"],
    precautions: ["Rechercher une allergie aux bêta-lactamines AVANT la première dose", "Insuffisance rénale : espacer les prises"],
    effets: ["Diarrhée, nausées", "Éruption cutanée / urticaire", "Réaction anaphylactique (rare)"]
  },

  {
    id: "amox-clav",
    nom: "Amoxicilline + acide clavulanique",
    classe: "Antibiotique (bêta-lactamine + inhibiteur)",
    formes: [{ nom: "Selon la présentation disponible (dose exprimée en amoxicilline)", mg: 0 }],
    regimes: [
      {
        id: "ac-otite", indication: "Otite moyenne aiguë / otite externe — enfant",
        type: "mgkg", mgkgJour: 50, parJour: 3, jours: 10, maxPrise: 1000, ageMin: 2, ageMax: 180,
        note: "Réévaluer à 5 jours : si bonne évolution, poursuivre encore 5 jours ; sinon (ou rechute après 10 jours) référer.",
        source: "Ord. 12, traitement 1 : 50 mg/kg/jour en 3 prises"
      },
      {
        id: "ac-adulte", indication: "Pneumonie avec signes de gravité — adulte",
        type: "fixe", texte: "1000 mg par prise, 3 fois par jour",
        parJour: 3, jours: 10, ageMin: 180,
        note: "Alternative : ceftriaxone 2 g/jour.",
        source: "Ord. 16, traitement 6"
      }
    ],
    ci: ["Allergie aux pénicillines", "Antécédent d'atteinte hépatique liée à ce médicament"],
    precautions: ["Diarrhée fréquente : donner au début d'un repas"],
    effets: ["Diarrhée, nausées", "Éruption cutanée"]
  },

  {
    id: "erythromycine",
    nom: "Érythromycine",
    classe: "Antibiotique (macrolide) — alternative en cas d'allergie aux pénicillines",
    formes: [
      { nom: "Comprimé 250 mg", mg: 250 },
      { nom: "Sirop 125 mg/5 mL", mg: 125, ml: 5 }
    ],
    regimes: [
      {
        id: "ery-enf", indication: "Alternative à l'amoxicilline — enfant (pneumonie, angine, rhinopharyngite, otite)",
        type: "mgkg", mgkgJour: 50, parJour: 2, jours: null, maxPrise: 1000, ageMin: 2, ageMax: 180,
        note: "5 jours (pneumonie) à 10 jours (angine, rhinopharyngite).",
        source: "Ord. 2, 11, 12 : 50 mg/kg/jour en 2 prises"
      },
      {
        id: "ery-adulte", indication: "Pneumonie / bronchite / laryngite — adulte",
        type: "fixe", texte: "1 g matin et soir",
        parJour: 2, jours: 7, ageMin: 180,
        source: "Ord. 16 et 17"
      },
      {
        id: "ery-ist", indication: "IST : alternative en cas de grossesse ou d'allergie — adulte",
        type: "fixe", texte: "500 mg, 2 comprimés (1 g) matin et soir, au repas ; 7 jours (pelvis) ou 14 jours (syphilis / chancre mou)",
        parJour: 2, jours: 14, ageMin: 180,
        source: "Togo Ord. 26 et 27",
        valider: "Dose du manuel : 2 comprimés de 500 mg 2 fois par jour (2 g par jour)."
      }
    ],
    ci: ["Allergie aux macrolides"],
    precautions: ["Troubles digestifs fréquents : prendre au cours du repas"],
    effets: ["Nausées, douleurs abdominales, diarrhée"]
  },

  {
    id: "act-al",
    nom: "Artéméther + luméfantrine (AL)",
    classe: "Antipaludique — CTA, paludisme simple",
    formes: [{ nom: "Comprimé 20 mg/120 mg", mg: 20 }],
    regimes: [
      {
        id: "al-std", indication: "Paludisme simple (TDR / goutte épaisse positif) — tous âges",
        type: "tranches", parJour: 2, jours: 3,
        tranches: [
          { poidsMin: 5, poidsMax: 15, texte: "1 comprimé par prise" },
          { poidsMin: 15, poidsMax: 25, texte: "2 comprimés par prise" },
          { poidsMin: 25, poidsMax: 35, texte: "3 comprimés par prise" },
          { poidsMin: 35, poidsMax: 999, texte: "4 comprimés par prise" }
        ],
        note: "Matin et soir pendant 3 jours (6 prises). Prendre avec un aliment gras ou du lait. Si vomissement < 30 min : répéter la dose. Fièvre persistante après 3 jours de traitement correct : rechercher une autre cause.",
        source: "Ord. 1, traitement 2 (tableau AL) et Ord. 16, traitement 1",
        valider: "Le tableau II du paludisme simple (par âge/poids) n'est pas lisible dans le fichier fourni ; le tableau AL du paludisme grave (5-14 kg : 1 cp, 15-24 : 2, 25-34 : 3, ≥ 35 : 4) a été utilisé. Grossesse 1er trimestre : protocole PNLP à vérifier."
      }
    ],
    ci: ["Paludisme grave (utiliser l'artésunate injectable)", "Allergie connue aux composants", "Poids < 5 kg : avis médical"],
    precautions: ["Grossesse : 1er trimestre = avis médical (voir protocole national)", "Médicaments allongeant le QT"],
    effets: ["Céphalées, vertiges, troubles digestifs", "Palpitations (rare)"]
  },

  {
    id: "asaq",
    nom: "Artésunate + amodiaquine (AS-AQ)",
    classe: "Antipaludique — CTA, paludisme simple (alternative)",
    formes: [{ nom: "Comprimés séparés : artésunate 50 mg + amodiaquine 153 mg", mg: 50 }],
    regimes: [
      {
        id: "asaq-enf", indication: "Paludisme simple — enfant et adolescent (AS 50 mg + AQ 153 mg)",
        type: "tranches", parJour: 1, jours: 3,
        tranches: [
          { poidsMin: 5, poidsMax: 10, texte: "½ comprimé d'AS + ½ comprimé d'AQ, 1 fois par jour" },
          { poidsMin: 10, poidsMax: 24, texte: "1 comprimé d'AS + 1 comprimé d'AQ, 1 fois par jour" },
          { poidsMin: 24, poidsMax: 50, texte: "2 comprimés d'AS + 2 comprimés d'AQ, 1 fois par jour" },
          { poidsMin: 50, poidsMax: 999, texte: "4 comprimés d'AS + 4 comprimés d'AQ, 1 fois par jour" }
        ],
        note: "AS et AQ pris ensemble, en une prise par jour, pendant 3 jours.",
        source: "Ord. 1, traitement 2 (alternative) : 4 mg/kg AS + 10 mg/kg AQ une fois par jour pendant 3 jours",
        valider: "Dose adulte du manuel (Ord. 16 : « 1 comprimé de 100/270 mg de chaque par jour ») semble sous-dosée par rapport au schéma usuel de 2 comprimés de 100/270 mg ; non reprise ici. À vérifier avec le PNLP."
      }
    ],
    ci: ["Paludisme grave", "Antécédent d'atteinte hépatique ou de neutropénie liée à l'amodiaquine"],
    precautions: ["Éviter chez les patients sous traitement antirétroviral à base de zidovudine/éfavirenz sans avis"],
    effets: ["Troubles digestifs, asthénie, somnolence"]
  },

  {
    id: "artesunate",
    nom: "Artésunate injectable",
    classe: "Antipaludique — paludisme grave",
    formes: [{ nom: "Ampoule 60 mg (à reconstituer)", mg: 60, conv: false }],
    regimes: [
      {
        id: "arte-iv", indication: "Paludisme grave (enfant et adulte) — IV direct ou IM",
        type: "mgkg", mgkg: 2.4, parJour: null, jours: null, maxPrise: null,
        note: "À H0, H12 et H24 le 1er jour, puis 1 fois par jour jusqu'à amélioration, puis relais par une CTA. Durée totale de l'artésunate injectable : 7 jours si la voie orale reste impossible. IM : face antéro-externe de la cuisse. Enfant : donner d'abord SGH 10 % 10 mL/kg en bolus (1 h). Référer.",
        source: "Ord. 1, traitement 2 ; Ord. 6 ; Ord. 16, traitement 2",
        valider: "Le guide RDC donne aussi 2,4 mg/kg chez l'enfant et l'adulte. Les recommandations OMS actuelles proposent 3 mg/kg si poids < 20 kg : à confirmer avec le PNLP."
      }
    ],
    ci: ["Allergie connue à l'artésunate"],
    precautions: ["Surveiller la glycémie (hypoglycémie fréquente)", "Anémie hémolytique retardée possible 2-3 semaines après : contrôler l'hémoglobine"],
    effets: ["Hémolyse retardée", "Réaction au point d'injection"]
  },

  {
    id: "artemether-inj",
    nom: "Artéméther injectable (IM)",
    classe: "Antipaludique — paludisme grave (alternative)",
    formes: [
      { nom: "Ampoule 20 mg/mL", mg: 20, ml: 1 },
      { nom: "Ampoule 40 mg/mL", mg: 40, ml: 1 }
    ],
    regimes: [
      {
        id: "artm-j1", indication: "Enfant — jour 1",
        type: "mgkg", mgkg: 3.2, parJour: null, jours: null, maxPrise: null, ageMax: 180,
        note: "IM face antéro-externe de la cuisse. Puis 1,6 mg/kg/jour du 2e au 7e jour si le transfert est impossible.",
        source: "Ord. 1, traitement 2 et tableau III"
      },
      {
        id: "artm-j2", indication: "Enfant — du jour 2 au jour 7",
        type: "mgkg", mgkg: 1.6, parJour: 1, jours: 6, maxPrise: null, ageMax: 180,
        note: "À partir du 5e jour, une CTA peut remplacer l'artéméther injectable pour finir les 7 jours.",
        source: "Ord. 1, tableau III"
      },
      {
        id: "artm-adulte", indication: "Adulte — 1re dose avant transfert",
        type: "fixe", texte: "160 mg en IM, dose unique",
        ageMin: 180, note: "Puis référer d'urgence.",
        source: "Ord. 16, traitement 2"
      }
    ],
    ci: ["Allergie connue"],
    precautions: ["Absorption IM variable : référer"],
    effets: ["Douleur au point d'injection"]
  },

  {
    id: "quinine-inj",
    nom: "Quinine injectable",
    classe: "Antipaludique — paludisme grave (alternative)",
    formes: [{ nom: "Ampoule 300 mg/1 mL diluée dans 5 mL d'eau distillée (50 mg/mL)", mg: 50, ml: 1 }],
    regimes: [
      {
        id: "qui-sels", indication: "Sels de quinine — IM (cuisse) ou perfusion",
        type: "mgkg", mgkg: 15, parJour: 2, jours: null, maxPrise: null,
        note: "Toutes les 12 heures. IM : diluer l'ampoule de 300 mg (1 mL) avec 5 mL d'eau distillée (50 mg/mL). Perfusion : dans 250 mL de sérum glucosé isotonique en 4 h. Relais par une CTA dès amélioration. Référer.",
        source: "Ord. 1, traitement 2 et tableau III ; Ord. 16, traitement 2",
        valider: "Chez l'adulte, 15 mg/kg donne de grandes doses (≈ 1050 mg, soit 21 mL en IM à 70 kg) : vérifier la dose maximale par prise et le volume injectable par site."
      },
      {
        id: "qui-base", indication: "Quinine base",
        type: "mgkg", mgkg: 12.5, parJour: 2, jours: null, maxPrise: null,
        note: "Toutes les 12 heures, perfusion dans 250 mL de SGI en 4 h (usage hospitalier).",
        source: "Ord. 1, traitement 2"
      }
    ],
    ci: ["Hémoglobinurie (urines « coca-cola »)", "Antécédent d'intolérance à la quinine"],
    precautions: ["Risque d'hypoglycémie : surveiller la glycémie", "Perfusion lente (jamais en bolus)"],
    effets: ["Bourdonnements d'oreilles, vertiges", "Hypoglycémie"]
  },

  {
    id: "sgh10",
    nom: "Sérum glucosé hypertonique 10 %",
    classe: "Traitement de l'hypoglycémie",
    formes: [{ nom: "Perfusion SGH 10 %", mg: 0 }],
    regimes: [
      {
        id: "sgh-enf", indication: "Hypoglycémie / paludisme grave — enfant",
        type: "totalkg", dose: 10, unit: "mL", ageMax: 180,
        note: "En bolus (en 1 heure). Alimenter l'enfant dès que la voie orale est possible.",
        source: "Ord. 1 (traitement 2), Ord. 5 (traitement 5)"
      },
      {
        id: "sgh-adulte", indication: "Hypoglycémie — adulte",
        type: "fixe", texte: "100 mL d'eau sucrée si le patient peut boire, ou SGH 10 % 250 mL en perfusion",
        ageMin: 180, source: "Ord. 16, traitement 2"
      }
    ],
    ci: ["Aucune en situation d'urgence hypoglycémique"],
    precautions: ["Contrôler la glycémie capillaire avant et après"],
    effets: ["Phlébite si extravasation"]
  },

  {
    id: "diazepam",
    nom: "Diazépam",
    classe: "Anticonvulsivant",
    formes: [{ nom: "Ampoule 10 mg/2 mL", mg: 5, ml: 1 }],
    regimes: [
      {
        id: "dz-enf", indication: "Convulsions — enfant (IR, IM ou IV lente)",
        type: "mgkg", mgkg: 0.5, mgkgMax: 1, parJour: null, jours: null, maxPrise: null, ageMax: 180,
        note: "En cas de détresse respiratoire : ne pas donner de diazépam, donner du phénobarbital 15 mg/kg IM. Mettre en position latérale de sécurité, libérer les voies aériennes.",
        source: "Ord. 1, 5, 6 : 0,5 à 1 mg/kg",
        valider: "Vérifier la concentration de l'ampoule disponible (5 mg/mL supposé)."
      },
      {
        id: "dz-adulte", indication: "Convulsions — adulte",
        type: "fixe", texte: "10 mg en IM",
        ageMin: 180, note: "Patient sur le côté, tête en extension, rien dans la bouche, aspirer les sécrétions.",
        source: "Ord. 16, traitement 2"
      }
    ],
    ci: ["Détresse respiratoire (préférer le phénobarbital chez l'enfant)"],
    precautions: ["Surveiller la respiration", "Matériel de ventilation à portée de main"],
    effets: ["Somnolence, dépression respiratoire"]
  },

  {
    id: "ceftriaxone",
    nom: "Ceftriaxone",
    classe: "Antibiotique injectable (céphalosporine)",
    formes: [{ nom: "Flacon injectable (1 g)", mg: 1000, conv: false }],
    regimes: [
      {
        id: "cef-pg-enf", indication: "Pneumonie grave — enfant (dose avant transfert)",
        type: "mgkg", mgkg: 50, parJour: null, jours: null, maxPrise: null, ageMin: 2, ageMax: 180,
        note: "IV ou IM, puis référer.", source: "Ord. 2, traitement 4"
      },
      {
        id: "cef-men-enf", indication: "Méningite — enfant (zone d'endémie)",
        type: "mgkg", mgkgJour: 100, parJour: 1, jours: 10, maxPrise: 4000, ageMin: 2, ageMax: 180,
        note: "IM ou IV, une fois par jour. Notifier. Référer.", source: "Ord. 1, traitement 3"
      },
      {
        id: "cef-typh-enf", indication: "Fièvre typhoïde — enfant",
        type: "mgkg", mgkgJour: 50, parJour: 1, jours: 10, maxPrise: 2000, ageMin: 2, ageMax: 180,
        note: "10 à 15 jours, IV direct ou IM.", source: "Ord. 1, traitement 4"
      },
      {
        id: "cef-pg-adulte", indication: "Pneumonie avec signes de gravité — adulte",
        type: "fixe", texte: "2 g en IM ou IV direct, dose unique avant transfert",
        ageMin: 180, source: "Ord. 17 et Ord. 19"
      },
      {
        id: "cef-men-adulte", indication: "Méningite (épidémie) — adulte, 1re dose",
        type: "fixe", texte: "1 g en IM ou IV direct, puis référer",
        ageMin: 180, note: "Notifier à l'échelon supérieur.", source: "Ord. 16, traitement 3"
      },
      {
        id: "cef-typh-adulte", indication: "Fièvre typhoïde — adulte",
        type: "fixe", texte: "1 g, 2 fois par jour en IM ou IV",
        parJour: 2, jours: 10, ageMin: 180,
        note: "Relais par voie orale si amélioration après 3 jours. Fièvre persistante après le 7e jour : référer.",
        source: "Ord. 16 (2 g en 2 inj/jour) et Ord. 18 (1 g, 2 fois/jour)"
      },
      {
        id: "cef-chancre", indication: "Syphilis / chancre mou, 2e choix — adulte",
        type: "fixe", texte: "250 mg en IM, dose unique (avec la doxycycline 200 mg par jour pendant 14 jours)",
        parJour: 1, jours: 1, ageMin: 180,
        source: "Togo Ord. 27, traitement 1 (2e choix)",
        valider: "Dose de 250 mg à confirmer."
      }
    ],
    ci: ["Allergie aux céphalosporines ou antécédent de choc aux bêta-lactamines", "Nouveau-né ictérique (< 28 jours) : avis médical"],
    precautions: ["Ne pas mélanger avec des solutions contenant du calcium"],
    effets: ["Douleur au point d'injection", "Diarrhée, éruption"]
  },

  {
    id: "ciprofloxacine",
    nom: "Ciprofloxacine",
    classe: "Antibiotique (fluoroquinolone)",
    formes: [
      { nom: "Comprimé 250 mg", mg: 250 },
      { nom: "Comprimé 500 mg", mg: 500 }
    ],
    regimes: [
      {
        id: "cip-dys-enf", indication: "Dysenterie bacillaire — enfant (comprimé 250 mg, matin et soir)",
        type: "tranches", parJour: 2, jours: 5, ageMax: 180,
        tranches: [
          { poidsMin: 0, poidsMax: 6, texte: "¼ comprimé de 250 mg par prise" },
          { poidsMin: 6, poidsMax: 9, texte: "½ comprimé de 250 mg par prise" },
          { poidsMin: 9, poidsMax: 13, texte: "¾ de comprimé de 250 mg par prise" },
          { poidsMin: 13, poidsMax: 18, texte: "1 comprimé de 250 mg par prise" },
          { poidsMin: 18, poidsMax: 34, texte: "1 comprimé et demi de 250 mg par prise" },
          { poidsMin: 34, poidsMax: 999, texte: "2 comprimés de 250 mg par prise" }
        ],
        note: "Revoir à 2 jours : s'il y a encore du sang dans les selles ou pas d'amélioration, référer.",
        source: "Ord. 4, traitement 4 et tableau IV",
        valider: "Le texte du manuel dit 15-20 mg/kg/jour, mais son tableau IV donne ≈ 31 mg/kg/jour (ex. ¾ cp de 250 mg x 2 pour 9-13 kg). Le tableau a été utilisé ; à confirmer."
      },
      {
        id: "cip-typh-enf", indication: "Fièvre typhoïde — enfant > 6 mois",
        type: "mgkg", mgkgJour: 15, mgkgJourMax: 20, parJour: 2, jours: 10, maxJour: 1000, ageMin: 6, ageMax: 180,
        source: "Ord. 1, traitement 4",
        valider: "Même réserve que pour la dysenterie : le texte donne 15-20 mg/kg/jour, mais le tableau IV du manuel correspond à ≈ 30 mg/kg/jour."
      },
      {
        id: "cip-chol-enf", indication: "Choléra — enfant (1re intention), mêmes doses que la dysenterie",
        type: "tranches", parJour: 2, jours: 3, ageMax: 180,
        tranches: [
          { poidsMin: 0, poidsMax: 6, texte: "¼ comprimé de 250 mg par prise" },
          { poidsMin: 6, poidsMax: 9, texte: "½ comprimé de 250 mg par prise" },
          { poidsMin: 9, poidsMax: 13, texte: "¾ de comprimé de 250 mg par prise" },
          { poidsMin: 13, poidsMax: 18, texte: "1 comprimé de 250 mg par prise" },
          { poidsMin: 18, poidsMax: 34, texte: "1 comprimé et demi de 250 mg par prise" },
          { poidsMin: 34, poidsMax: 999, texte: "2 comprimés de 250 mg par prise" }
        ],
        note: "Notifier. Réhydrater. Référer.",
        source: "Ord. 4, traitement 8 (15-20 mg/kg/jour en 2 prises, 3 jours) ; doses du tableau IV",
        valider: "Même réserve que pour la dysenterie sur la dose en mg/kg."
      },
      {
        id: "cip-dys-adulte", indication: "Dysenterie bacillaire — adulte",
        type: "fixe", texte: "500 mg matin et soir", parJour: 2, jours: 10, ageMin: 180,
        note: "Alternative : cotrimoxazole 480 mg, 2 comprimés matin et soir pendant 10 jours.",
        source: "Ord. 18, traitement 3"
      },
      {
        id: "cip-typh-adulte", indication: "Fièvre typhoïde — adulte",
        type: "fixe", texte: "500 mg matin et soir", parJour: 2, jours: 21, ageMin: 180,
        note: "15 à 21 jours. Fièvre persistante après le 7e jour : référer.",
        source: "Ord. 16, traitement 4 et Ord. 18, traitement 5"
      },
      {
        id: "cip-ist", indication: "Syphilis / chancre mou — adulte",
        type: "fixe", texte: "500 mg, 1 comprimé matin et soir pendant 15 jours (syphilis / chancre mou, avec la benzathine pénicilline)",
        parJour: 2, jours: 15, ageMin: 180,
        note: "Contre-indiquée chez la femme enceinte ou allaitante. Écoulement urétral, cervicite, infection du pelvis : azithromycine 1 g en prise unique (la ciprofloxacine n'est plus utilisée seule contre le gonocoque).",
        source: "Togo Ord. 27"
      }
    ],
    ci: ["Grossesse", "Allergie aux quinolones"],
    precautions: ["Enfant : utilisation justifiée par le manuel pour la dysenterie et la typhoïde", "Éviter l'exposition au soleil", "Tendinopathie : arrêter"],
    effets: ["Nausées, diarrhée", "Tendinopathie (rare)"]
  },

  {
    id: "metronidazole",
    nom: "Métronidazole",
    classe: "Antiparasitaire / antibiotique",
    formes: [
      { nom: "Suspension 125 mg/5 mL", mg: 125, ml: 5 },
      { nom: "Comprimé 250 mg", mg: 250 },
      { nom: "Comprimé 500 mg", mg: 500 }
    ],
    regimes: [
      {
        id: "met-enf", indication: "Dysenterie amibienne — enfant",
        type: "mgkg", mgkgJour: 30, mgkgJourMax: 40, parJour: 3, jours: 7, maxJour: 1500, ageMin: 2, ageMax: 180,
        note: "Revoir après 3 jours : s'il y a encore du sang dans les selles, référer. 2e intention : tinidazole.",
        source: "Ord. 4, traitement 5",
        valider: "Le manuel écrit « 30 à 40 mg/kg, 3 fois par jour » : interprété comme 30-40 mg/kg PAR JOUR en 3 prises. À confirmer."
      },
      {
        id: "met-adulte", indication: "Dysenterie amibienne — adulte",
        type: "fixe", texte: "500 mg, 3 fois par jour", parJour: 3, jours: 10, ageMin: 180,
        note: "Alternative : tinidazole 500 mg, 4 comprimés en prise unique par jour pendant 3 jours. Revoir après 3 jours.",
        source: "Ord. 18, traitement 4"
      },
      {
        id: "met-hp", indication: "Éradication d'Helicobacter pylori — adulte (alternative à la clarithromycine)",
        type: "fixe", texte: "500 mg, 2 fois par jour pendant 14 jours, avec l'oméprazole et l'amoxicilline",
        parJour: 2, jours: 14, ageMin: 180,
        source: "RDC Méd. interne III.4 ; protocole retenu par le validateur"
      },
      {
        id: "met-ist", indication: "Pertes vaginales : trichomonase, vaginose, maladie inflammatoire du pelvis — adulte",
        type: "fixe", texte: "250 mg, 2 comprimés (500 mg), 3 fois par jour pendant 10 jours (cervicite : 2 comprimés matin et soir)",
        parJour: 3, jours: 10, ageMin: 180,
        note: "Alternative : tinidazole 500 mg, 4 comprimés en prise unique. Traiter le partenaire.",
        source: "Togo Ord. 26, traitements 1, 3 et 4"
      }
    ],
    ci: ["Premier trimestre de grossesse : avis médical", "Alcool pendant le traitement"],
    precautions: ["Goût métallique, nausées"],
    effets: ["Nausées, goût métallique", "Neuropathie si traitement prolongé"]
  },

  {
    id: "sro",
    nom: "SRO (sels de réhydratation orale)",
    classe: "Réhydratation",
    formes: [{ nom: "Sachet SRO (1 sachet dans 1 L d'eau potable)", mg: 0 }],
    regimes: [
      {
        id: "sro-b", indication: "Signes évidents de déshydratation (Plan B) — 4 premières heures",
        type: "totalkg", dose: 75, unit: "mL",
        note: "À faire boire en 4 heures. Réévaluer après 4 h : amélioration partielle = continuer le plan B ; aggravation = plan C si possible, sinon référer.",
        source: "Ord. 4 : SRO 75 mL/kg en 4 heures"
      },
      {
        id: "sro-a", indication: "Pas de déshydratation (Plan A) — après chaque selle liquide",
        type: "fixe", texte: "50 à 100 mL (¼ à ½ verre) après chaque selle liquide",
        note: "Poursuivre l'alimentation et l'allaitement.",
        source: "Ord. 4 (plan A)"
      }
    ],
    ci: ["Déshydratation sévère / incapacité de boire : perfusion"],
    precautions: ["Préparer avec de l'eau potable, dans le volume indiqué sur le sachet", "Si vomissement : attendre 10 min puis reprendre plus lentement"],
    effets: ["Vomissements transitoires"]
  },

  {
    id: "zinc",
    nom: "Zinc",
    classe: "Complément — diarrhée",
    formes: [{ nom: "Comprimé dispersible 20 mg", mg: 20 }],
    regimes: [
      {
        id: "zinc-1", indication: "Diarrhée — enfant jusqu'à 6 mois",
        type: "fixe", texte: "½ comprimé par jour, à dissoudre dans une cuillère d'eau ou de SRO",
        parJour: 1, jours: 14, ageMax: 7,
        note: "Dans tous les cas de diarrhée.",
        source: "Ord. 4 : zinc 14 jours",
        valider: "L'OMS recommande 10 jours ; le manuel togolais indique 14 jours."
      },
      {
        id: "zinc-2", indication: "Diarrhée — enfant de 7 mois et plus",
        type: "fixe", texte: "1 comprimé par jour, à dissoudre dans une cuillère d'eau ou de SRO",
        parJour: 1, jours: 14, ageMin: 7, ageMax: 180,
        source: "Ord. 4"
      }
    ],
    ci: ["Aucune connue aux doses usuelles"],
    precautions: ["Dissoudre dans un peu d'eau ou de SRO"],
    effets: ["Vomissements possibles (reprendre plus tard)"]
  },

  {
    id: "albendazole",
    nom: "Albendazole",
    classe: "Antihelminthique",
    formes: [{ nom: "Comprimé 400 mg", mg: 400 }],
    regimes: [
      { id: "alb-1", indication: "Déparasitage — enfant 12 à 23 mois", type: "fixe", texte: "200 mg (½ comprimé de 400 mg), dose unique", parJour: 1, jours: 1, ageMin: 12, ageMax: 24, source: "Ord. 9, traitement 1" },
      { id: "alb-2", indication: "Déparasitage — ≥ 24 mois", type: "fixe", texte: "400 mg (1 comprimé), dose unique", parJour: 1, jours: 1, ageMin: 24, source: "Ord. 9, traitement 1", note: "Alternative : mébendazole 500 mg en une seule dose." }
    ],
    ci: ["Grossesse 1er trimestre", "Enfant < 12 mois"],
    precautions: ["Éviter si fièvre ou maladie aiguë sévère"],
    effets: ["Douleurs abdominales, nausées (rares)"]
  },

  {
    id: "vitamine-a",
    nom: "Vitamine A",
    classe: "Supplément — rougeole",
    formes: [{ nom: "Capsule (selon dosage disponible)", mg: 0 }],
    regimes: [
      { id: "vita-1", indication: "Rougeole — enfant de 6 à 11 mois", type: "fixe", texte: "100 000 UI, dose unique", ageMin: 6, ageMax: 12, source: "Ord. 1, traitement 8" },
      { id: "vita-2", indication: "Rougeole — enfant de 12 à 59 mois", type: "fixe", texte: "200 000 UI, dose unique", ageMin: 12, ageMax: 60, source: "Ord. 1, traitement 8" }
    ],
    ci: ["Aucune pour la dose unique"],
    precautions: ["Ne pas répéter sans avis"],
    effets: ["Vomissements, céphalées transitoires"]
  },

  {
    id: "salbutamol",
    nom: "Salbutamol (spray)",
    classe: "Bronchodilatateur",
    formes: [{ nom: "Aérosol doseur (chambre d'inhalation de préférence)", mg: 0 }],
    regimes: [
      {
        id: "sal-enf", indication: "Crise d'asthme — enfant / nourrisson",
        type: "fixe", texte: "1 à 2 bouffées avec chambre d'inhalation, à renouveler toutes les 30 min à 1 h jusqu'à l'arrêt de la crise",
        ageMax: 180, note: "Détresse respiratoire : bétaméthasone IM (2 à 8 mg selon l'âge) et référer.",
        source: "Ord. 2, traitement 5"
      },
      {
        id: "sal-adulte", indication: "Crise d'asthme — adulte",
        type: "fixe", texte: "1 à 2 bouffées avec chambre d'inhalation dès les premiers symptômes, à répéter si besoin après 15 min",
        ageMin: 180, note: "Crise persistante après 1 heure : référer en position demi-assise. Si la crise cède : corticoïde inhalé 1 à 2 bouffées pendant 30 jours.",
        source: "Ord. 17, traitement 6 et Ord. 19"
      }
    ],
    ci: ["Aucune en urgence"],
    precautions: ["Tremblements, tachycardie possibles"],
    effets: ["Tremblements, palpitations"]
  },

{
    id: "omeprazole",
    nom: "Oméprazole",
    classe: "Antiulcéreux — inhibiteur de la pompe à protons",
    formes: [
      { nom: "Comprimé / gélule 20 mg", mg: 20, conv: false },
      { nom: "Ampoule injectable 40 mg", mg: 40, conv: false }
    ],
    regimes: [
      {
        id: "ome-erad", indication: "Gastrite / ulcère : éradication d'Helicobacter pylori (adulte)",
        type: "fixe", texte: "20 mg, 2 fois par jour, avec l'amoxicilline et la clarithromycine (ou le métronidazole)",
        parJour: 2, jours: 14, ageMin: 180,
        note: "Traitement de 14 jours. Puis oméprazole 20 mg, 1 fois par jour, si amélioration : 3 semaines (RDC, ulcère) à 30 jours (Togo). Sans amélioration : référer.",
        source: "RDC Méd. interne III.3 et III.4 ; Togo Ord. 23, traitement 3 ; durée retenue par le validateur"
      },
      {
        id: "ome-aine", indication: "Ulcère lié aux AINS (adulte)",
        type: "fixe", texte: "40 mg en IV directe, puis 20 mg par voie orale 1 fois par jour pendant 4 semaines, 30 à 60 minutes avant le repas",
        ageMin: 180,
        note: "Arrêter l'AINS en cause. Associer un pansement gastrique (Alugel).",
        source: "RDC Méd. interne III.4, ulcères liés aux AINS"
      },
      {
        id: "ome-hemo", indication: "Ulcère hémorragique (adulte) : avant le transfert",
        type: "fixe", texte: "80 mg par jour en IV directe (ou antisécrétoire IV : cimétidine 400 mg, 3 à 4 fois par jour)",
        ageMin: 180,
        note: "Traiter le choc hypovolémique, puis référer en urgence.",
        source: "RDC Méd. interne III.4, ulcères compliqués (à référer)"
      }
    ],
    ci: ["Allergie à l'oméprazole ou aux autres IPP"],
    precautions: ["Éliminer d'abord les signes d'alarme (âge > 50 ans, amaigrissement, difficulté à avaler, saignement, anémie) : référer pour endoscopie", "Pas de cicatrisation après 3 à 4 mois : avis chirurgical (risque de cancer gastrique méconnu)"],
    effets: ["Céphalées, nausées, diarrhée"]
  },

  {
    id: "clarithromycine",
    nom: "Clarithromycine",
    classe: "Antibiotique (macrolide)",
    formes: [{ nom: "Comprimé 500 mg", mg: 500 }],
    regimes: [
      {
        id: "clari-erad", indication: "Éradication d'Helicobacter pylori (adulte)",
        type: "fixe", texte: "500 mg, 2 fois par jour, avec l'oméprazole et l'amoxicilline",
        parJour: 2, jours: 14, ageMin: 180,
        note: "Traitement de 14 jours (protocole retenu).",
        source: "RDC Méd. interne III.3 et III.4 ; durée retenue par le validateur"
      }
    ],
    ci: ["Allergie aux macrolides"],
    precautions: ["Grossesse : avis médical"],
    effets: ["Nausées, diarrhée, goût métallique"]
  },

  {
    id: "antiacides",
    nom: "Antiacides (hydroxyde d'aluminium, trisilicate de magnésium)",
    classe: "Pansement gastrique / antiacide",
    formes: [
      { nom: "Hydroxyde d'aluminium, comprimé à croquer 500 mg", mg: 500, conv: false },
      { nom: "Trisilicate de magnésium, comprimé 500 mg", mg: 500, conv: false },
      { nom: "Alugel, suspension buvable", mg: 0 }
    ],
    regimes: [
      {
        id: "anti-gastrite", indication: "Gastrite aiguë : phase aiguë, 7 à 10 jours (adulte)",
        type: "fixe", texte: "Hydroxyde d'aluminium 500 mg : 1 comprimé à croquer, 3 fois par jour — ou trisilicate de magnésium 500 mg : 2 comprimés, 3 fois par jour pendant 10 jours",
        ageMin: 180, source: "RDC Méd. interne III.3"
      },
      {
        id: "anti-douleur", indication: "Ulcère / gastrite : au moment de la douleur (adulte)",
        type: "fixe", texte: "Faire sucer 2 comprimés d'hydroxyde d'aluminium au moment de la douleur",
        ageMin: 180, source: "Togo Ord. 23, traitement 3"
      },
      {
        id: "anti-alugel", indication: "Ulcère lié aux AINS (adulte)",
        type: "fixe", texte: "Alugel : 15 mL, 3 fois par jour, 30 à 60 minutes après le repas",
        parJour: 3, ageMin: 180, source: "RDC Méd. interne III.4"
      }
    ],
    ci: ["Insuffisance rénale sévère : avis médical"],
    precautions: ["Espacer des autres médicaments (ciprofloxacine, doxycycline…)"],
    effets: ["Constipation (aluminium), diarrhée (magnésium)"]
  },

  {
    id: "anti-h2",
    nom: "Anti-H2 (cimétidine, ranitidine)",
    classe: "Antisécrétoire gastrique",
    formes: [
      { nom: "Cimétidine, comprimé 200 mg", mg: 200, conv: false },
      { nom: "Ranitidine, comprimé 150 mg", mg: 150, conv: false }
    ],
    regimes: [
      {
        id: "h2-gastrite", indication: "Gastrite aiguë sans réponse aux antiacides (adulte)",
        type: "fixe", texte: "Cimétidine 200 à 400 mg toutes les 8 heures pendant 4 à 6 semaines — ou ranitidine 150 mg, 2 fois par jour",
        ageMin: 180, source: "RDC Méd. interne III.3"
      }
    ],
    ci: ["Allergie connue"],
    precautions: ["Insuffisance rénale : adapter la dose"],
    effets: ["Céphalées, diarrhée, vertiges"]
  },

  {
    id: "glibenclamide",
    nom: "Glibenclamide",
    classe: "Antidiabétique oral (sulfamide hypoglycémiant)",
    formes: [{ nom: "Comprimé 5 mg", mg: 5, conv: false }],
    regimes: [
      {
        id: "glib-dt2", indication: "Diabète de type 2 (adulte)",
        type: "fixe", texte: "Débuter à 5 mg le matin, 20 à 30 minutes avant le repas ; augmenter de 5 mg toutes les 2 semaines si la glycémie n'est pas normalisée ; maximum 15 mg par jour",
        ageMin: 180,
        note: "Si 15 mg sont insuffisants : ajouter la metformine. Ne jamais associer deux sulfamides. Ne pas associer à l'insuline (risque d'hypoglycémie).",
        source: "RDC Méd. interne V.2, traitement du diabète de type 2"
      }
    ],
    ci: ["Diabète de type 1", "Grossesse et allaitement", "Maladie hépatique", "Personne âgée ou insuffisance rénale (éviter : risque d'hypoglycémie prolongée)"],
    precautions: ["Hypoglycémie : éduquer le patient (repas réguliers, pas d'alcool à jeun)"],
    effets: ["Hypoglycémie", "Prise de poids"]
  },

  {
    id: "metformine",
    nom: "Metformine",
    classe: "Antidiabétique oral (biguanide)",
    formes: [{ nom: "Comprimé 500 mg", mg: 500, conv: false }],
    regimes: [
      {
        id: "met-dt2", indication: "Diabète de type 2, surtout patient obèse (adulte)",
        type: "fixe", texte: "500 mg, 2 fois par jour, pendant ou après le repas ; augmenter de 500 mg toutes les 2 semaines jusqu'à normalisation de la glycémie ; maximum 2 g par jour",
        parJour: 2, ageMin: 180,
        note: "Si la glycémie reste élevée : ajouter le glibenclamide (jusqu'à 15 mg/jour). En cas d'échec : insuline et arrêt du glibenclamide.",
        source: "RDC Méd. interne V.2",
        valider: "Le guide dit tantôt +500 mg par semaine (association), tantôt +500 mg toutes les 2 semaines (patient obèse)."
      }
    ],
    ci: ["Diabète de type 1", "Grossesse et allaitement", "Insuffisance rénale ou atteinte hépatique", "Personne âgée (éviter)"],
    precautions: ["Acidose lactique rare mais grave : arrêter en cas de vomissements, déshydratation ou respiration rapide"],
    effets: ["Nausées, diarrhée, goût métallique"]
  },

  {
    id: "adrenaline",
    nom: "Adrénaline (épinéphrine)",
    classe: "Urgence — choc anaphylactique",
    formes: [{ nom: "Ampoule 1 mg/mL (seringue de 1 mL graduée au 1/100)", mg: 1, conv: false }],
    regimes: [
      {
        id: "adr-1", indication: "Réaction anaphylactique — enfant de moins de 6 ans",
        type: "fixe", texte: "0,15 mL de solution à 1 mg/mL, en IM (solution non diluée)",
        ageMax: 72,
        note: "Sans seringue de 1 mL graduée : solution diluée à 0,1 mg/mL (1 mg dans 9 mL de NaCl 0,9 %) : 1,5 mL. Répéter après 5 minutes si pas d'amélioration. Collapsus ou absence de réponse : voie veineuse et adrénaline IV.",
        source: "RDC Méd. interne I.6.4",
        valider: "Les tranches d'âge du guide se chevauchent à 6 et 12 ans : 6 ans inclus dans la tranche 6-12 ans ; 12 ans révolus inclus dans la tranche 6-12 ans."
      },
      {
        id: "adr-2", indication: "Réaction anaphylactique — enfant de 6 à 12 ans",
        type: "fixe", texte: "0,3 mL de solution à 1 mg/mL, en IM (solution non diluée)",
        ageMin: 72, ageMax: 145,
        note: "Sans seringue de 1 mL graduée : solution diluée à 0,1 mg/mL : 3 mL. Répéter après 5 minutes si pas d'amélioration.",
        source: "RDC Méd. interne I.6.4"
      },
      {
        id: "adr-3", indication: "Réaction anaphylactique — enfant de plus de 12 ans et adulte",
        type: "fixe", texte: "0,5 mL de solution à 1 mg/mL, en IM (solution non diluée)",
        ageMin: 145,
        note: "Répéter après 5 minutes si pas d'amélioration. Collapsus ou absence de réponse : voie veineuse et adrénaline IV.",
        source: "RDC Méd. interne I.6.4"
      }
    ],
    ci: ["Aucune en cas d'anaphylaxie"],
    precautions: ["Surveiller le pouls et la tension après l'injection"],
    effets: ["Palpitations, tremblements, pâleur"]
  },

  {
    id: "gluconate-calcium",
    nom: "Gluconate de calcium 10 %",
    classe: "Calcium injectable",
    formes: [{ nom: "Ampoule 10 % (10 mL)", mg: 0 }],
    regimes: [
      {
        id: "gca-enf", indication: "Douleurs musculaires / spasmes (scorpion, araignée) — enfant",
        type: "fixe", texte: "5 mL en IV très lente (10 à 20 minutes)",
        ageMax: 180, source: "RDC Méd. interne I.6.2 et I.6.3"
      },
      {
        id: "gca-adulte", indication: "Douleurs musculaires / spasmes (scorpion, araignée) — adulte",
        type: "fixe", texte: "10 mL en IV très lente (10 à 20 minutes)",
        ageMin: 180, source: "RDC Méd. interne I.6.2 et I.6.3"
      }
    ],
    ci: ["Patient sous digitaliques : avis médical"],
    precautions: ["Injection IV très lente uniquement"],
    effets: ["Bouffées de chaleur, bradycardie si trop rapide"]
  },

  {
    id: "daflon",
    nom: "Daflon (fraction flavonoïque)",
    classe: "Phlébotonique — hémorroïdes",
    formes: [{ nom: "Comprimé 500 mg", mg: 500, conv: false }],
    regimes: [
      {
        id: "daf-crise", indication: "Crise hémorroïdaire (adulte)",
        type: "fixe", texte: "2 comprimés, 3 fois par jour pendant 4 jours, puis 2 comprimés, 2 fois par jour pendant 3 jours",
        ageMin: 180,
        note: "À associer aux bains de siège et aux suppositoires ou pommades antihémorroïdaires.",
        source: "RDC Méd. interne III.9"
      }
    ],
    ci: ["Aucune connue"],
    precautions: ["Hémorroïdes compliquées ou saignement abondant : référer en chirurgie"],
    effets: ["Troubles digestifs légers"]
  },

  {
    id: "allopurinol",
    nom: "Allopurinol",
    classe: "Antigoutteux — traitement de fond",
    formes: [{ nom: "Comprimé 100 mg / 300 mg", mg: 100, conv: false }],
    regimes: [
      {
        id: "allo-fond", indication: "Goutte : traitement de fond (adulte)",
        type: "fixe", texte: "100 à 300 mg, 2 fois par jour, après le repas (dose moyenne 300 mg par jour)",
        ageMin: 180,
        note: "À débuter seulement quand la douleur est maîtrisée (environ 2 semaines après la crise). Réduire la dose en cas d'insuffisance rénale ou hépatique. Ne pas donner pendant la crise aiguë.",
        source: "RDC Méd. interne V.4, goutte"
      }
    ],
    ci: ["Crise de goutte aiguë en cours (ne pas débuter)"],
    precautions: ["Insuffisance rénale ou hépatique : réduire la dose"],
    effets: ["Éruption cutanée, troubles digestifs"]
  },

  {
    id: "indometacine",
    nom: "Indométacine",
    classe: "Anti-inflammatoire non stéroïdien",
    formes: [{ nom: "Gélule / comprimé 25 mg ou 50 mg", mg: 0 }],
    regimes: [
      {
        id: "indo-goutte", indication: "Crise de goutte aiguë (adulte)",
        type: "fixe", texte: "50 mg toutes les 4 à 6 heures pendant 2 jours, puis 25 à 50 mg toutes les 8 heures pendant la durée de la crise",
        ageMin: 180,
        note: "Commencer par une dose élevée puis diminuer progressivement. Ne pas utiliser en traitement d'entretien.",
        source: "RDC Méd. interne V.4, goutte"
      }
    ],
    ci: ["Ulcère gastro-duodénal", "Insuffisance rénale", "Grossesse"],
    precautions: ["Prendre pendant les repas"],
    effets: ["Douleurs gastriques, céphalées, vertiges"]
  },

  {
    id: "diclofenac",
    nom: "Diclofénac",
    classe: "Anti-inflammatoire non stéroïdien",
    formes: [{ nom: "Comprimé 25 mg / 50 mg", mg: 50, conv: false }],
    regimes: [
      {
        id: "diclo-pr", indication: "Arthrite rhumatoïde (adulte)",
        type: "fixe", texte: "50 mg, 3 fois par jour",
        parJour: 3, ageMin: 180,
        note: "Référer tous les cas suspects pour le traitement de fond.",
        source: "RDC Méd. interne VI.3, arthrite rhumatoïde"
      },
      {
        id: "diclo-goutte", indication: "Crise de goutte aiguë (adulte)",
        type: "fixe", texte: "25 à 50 mg toutes les 8 heures, après le repas",
        ageMin: 180, source: "RDC Méd. interne V.4, goutte"
      },
      {
        id: "diclo-arthrose", indication: "Arthrose compliquée (adulte)",
        type: "fixe", texte: "50 mg, 3 fois par jour, pendant les repas, pendant la poussée",
        parJour: 3, ageMin: 180,
        source: "RDC Méd. interne VI.3 : « diclofénac 250 mg 3 fois/jour »",
        valider: "Le guide écrit 250 mg 3 fois par jour pour l'arthrose, dose manifestement erronée (probable erreur de frappe) : non reprise ; 50 mg utilisé par analogie avec les autres indications."
      }
    ],
    ci: ["Ulcère gastro-duodénal", "Insuffisance rénale, cardiaque ou hépatique sévère", "Grossesse", "Allergie à l'aspirine / aux AINS"],
    precautions: ["Prendre pendant les repas", "Durée la plus courte possible"],
    effets: ["Douleurs gastriques, saignement digestif", "Insuffisance rénale si déshydratation"]
  },

  {
    id: "penicilline-v",
    nom: "Pénicilline V (phénoxyméthylpénicilline)",
    classe: "Antibiotique (pénicilline orale)",
    formes: [{ nom: "Comprimé ou sirop (selon disponibilité)", mg: 0 }],
    regimes: [
      {
        id: "pv-dr-1", indication: "Drépanocytose : prophylaxie, de 2 mois à 2 ans",
        type: "fixe", texte: "125 mg, 2 fois par jour", parJour: 2, ageMin: 2, ageMax: 36,
        note: "Systématique jusqu'à l'âge de 15 ans (50 mg/kg/24 h en 2 à 3 prises). Allergie : érythromycine aux mêmes doses.",
        source: "RDC Pédiatrie, drépanocytose"
      },
      {
        id: "pv-dr-2", indication: "Drépanocytose : prophylaxie, de 3 à 6 ans",
        type: "fixe", texte: "250 mg, 2 fois par jour", parJour: 2, ageMin: 36, ageMax: 84,
        note: "Systématique jusqu'à l'âge de 15 ans.", source: "RDC Pédiatrie, drépanocytose"
      },
      {
        id: "pv-dr-3", indication: "Drépanocytose : prophylaxie, de 7 à 12 ans",
        type: "fixe", texte: "250 mg, 3 fois par jour", parJour: 3, ageMin: 84, ageMax: 156,
        note: "Systématique jusqu'à l'âge de 15 ans.", source: "RDC Pédiatrie, drépanocytose"
      },
      {
        id: "pv-dr-4", indication: "Drépanocytose : prophylaxie, plus de 12 ans (jusqu'à 15 ans)",
        type: "fixe", texte: "500 mg, 2 fois par jour", parJour: 2, ageMin: 156, ageMax: 180,
        note: "Jusqu'à l'âge de 15 ans.", source: "RDC Pédiatrie, drépanocytose"
      },
      {
        id: "pv-raa-1", indication: "Rhumatisme articulaire aigu : éradication du streptocoque, 1 à 5 ans",
        type: "fixe", texte: "125 mg toutes les 6 heures pendant 10 jours", parJour: 4, jours: 10, ageMin: 12, ageMax: 72,
        source: "RDC Méd. interne VI.4"
      },
      {
        id: "pv-raa-2", indication: "Rhumatisme articulaire aigu : éradication du streptocoque, 6 à 12 ans",
        type: "fixe", texte: "250 mg toutes les 6 heures pendant 10 jours", parJour: 4, jours: 10, ageMin: 72, ageMax: 156,
        source: "RDC Méd. interne VI.4"
      },
      {
        id: "pv-raa-3", indication: "Rhumatisme articulaire aigu : éradication du streptocoque, adulte",
        type: "fixe", texte: "500 mg toutes les 6 heures pendant 10 jours", parJour: 4, jours: 10, ageMin: 156,
        note: "Allergie à la pénicilline : érythromycine par voie orale aux mêmes doses.",
        source: "RDC Méd. interne VI.4",
        valider: "Adolescents de 13 à 14 ans : le guide ne précise que la dose adulte ; à confirmer."
      }
    ],
    ci: ["Allergie aux pénicillines"],
    precautions: ["Rechercher une allergie avant la première dose"],
    effets: ["Diarrhée, éruption cutanée"]
  },

  {
    id: "benzathine-penicilline",
    nom: "Benzathine pénicilline (Extencilline)",
    classe: "Antibiotique (pénicilline retard, IM)",
    formes: [{ nom: "Flacon injectable 600 000 UI / 1,2 MUI / 2,4 MUI (selon présentation)", mg: 0 }],
    regimes: [
      {
        id: "bp-raa-1", indication: "Rhumatisme articulaire aigu : prévention des rechutes, enfant de moins de 30 kg",
        type: "fixe", texte: "600 000 UI en IM, 1 fois par mois", ageMax: 180, poidsMax: 30,
        note: "À continuer jusqu'à 21 ans, ou sans limite si atteinte valvulaire. Allergie : érythromycine par voie orale.",
        source: "RDC Méd. interne VI.4"
      },
      {
        id: "bp-raa-2", indication: "Rhumatisme articulaire aigu : prévention des rechutes, enfant de plus de 30 kg",
        type: "fixe", texte: "900 000 UI en IM, 1 fois par mois", ageMax: 180, poidsMin: 30,
        note: "À continuer jusqu'à 21 ans, ou sans limite si atteinte valvulaire.", source: "RDC Méd. interne VI.4"
      },
      {
        id: "bp-raa-3", indication: "Rhumatisme articulaire aigu : prévention des rechutes, adulte",
        type: "fixe", texte: "1,2 million d'UI en IM, 1 fois par mois", ageMin: 180,
        note: "À continuer jusqu'à 21 ans, ou sans limite si atteinte valvulaire.", source: "RDC Méd. interne VI.4"
      },
      {
        id: "bp-syph", indication: "Syphilis / chancre mou (adulte)",
        type: "fixe", texte: "2,4 millions d'UI en IM, dose unique, avec la ciprofloxacine",
        ageMin: 180,
        note: "Traiter simultanément la syphilis et le chancre mou. Femme enceinte ou allergie : érythromycine.",
        source: "Togo Ord. 27, traitement 1"
      },
      {
        id: "bp-abces", indication: "Abcès de l'amygdale : dose avant transfert, enfant de 5 ans et plus",
        type: "fixe", texte: "1,2 million d'UI en IM, dose unique", ageMin: 60, ageMax: 180,
        note: "Puis référer.", source: "Togo Ord. 11, traitement 2"
      },
      {
        id: "bp-abces2", indication: "Abcès de l'amygdale : dose avant transfert, enfant de moins de 5 ans",
        type: "fixe", texte: "600 000 UI en IM, dose unique", ageMax: 60,
        note: "Puis référer.", source: "Togo Ord. 11, traitement 2"
      }
    ],
    ci: ["Allergie aux pénicillines"],
    precautions: ["Injection IM profonde, jamais en IV", "Rechercher une allergie avant la première dose"],
    effets: ["Douleur au point d'injection", "Réaction allergique (rare)"]
  },

  {
    id: "acide-folique",
    nom: "Acide folique",
    classe: "Vitamine — anémie / drépanocytose",
    formes: [{ nom: "Comprimé 5 mg", mg: 5, conv: false }],
    regimes: [
      {
        id: "af-enf-1", indication: "Drépanocytose / anémie : enfant de 2 mois à 5 ans",
        type: "fixe", texte: "1 comprimé de 5 mg par jour pendant 14 jours", parJour: 1, jours: 14, ageMin: 2, ageMax: 60,
        source: "Togo Ord. 6, traitement 5"
      },
      {
        id: "af-enf-2", indication: "Drépanocytose / anémie : enfant de plus de 5 ans",
        type: "fixe", texte: "2 comprimés de 5 mg par jour pendant 14 jours", parJour: 1, jours: 14, ageMin: 60, ageMax: 180,
        source: "Togo Ord. 6, traitement 5"
      },
      {
        id: "af-adulte", indication: "Crise drépanocytaire (adulte)",
        type: "fixe", texte: "1 comprimé de 5 mg le matin et le soir, aux repas",
        parJour: 2, ageMin: 180, source: "Togo Ord. 21, traitement 6 et Ord. 23, traitement 11"
      },
      {
        id: "af-rdc", indication: "Drépanocytose : traitement de fond (phase entre les crises)",
        type: "fixe", texte: "1 comprimé par jour, 10 à 15 jours par mois ; 2 comprimés par jour pendant les crises",
        source: "RDC Pédiatrie, drépanocytose",
        valider: "Le dosage du comprimé n'est pas précisé dans le guide RDC (5 mg dans le manuel togolais)."
      }
    ],
    ci: ["Aucune connue"],
    precautions: ["Drépanocytose : ne pas donner de fer"],
    effets: ["Très bien toléré"]
  },

  {
    id: "aspirine",
    nom: "Aspirine (acide acétylsalicylique, AAS)",
    classe: "Anti-inflammatoire / antalgique / antiagrégant",
    formes: [
      { nom: "Comprimé 500 mg", mg: 500 },
      { nom: "Comprimé 100 mg (cardioaspirine)", mg: 100 }
    ],
    regimes: [
      {
        id: "aas-raa-1", indication: "Rhumatisme articulaire aigu : phase d'attaque (enfant)",
        type: "mgkg", mgkgJour: 100, parJour: 4, jours: 14, ageMax: 180,
        note: "100 mg/kg/24 h en 4 à 6 prises pendant 2 semaines, puis 75 mg/kg/24 h pendant 4 à 6 semaines, puis arrêt progressif. Cardite : prednisolone, référer.",
        source: "RDC Méd. interne VI.4"
      },
      {
        id: "aas-raa-2", indication: "Rhumatisme articulaire aigu : phase d'entretien (enfant)",
        type: "mgkg", mgkgJour: 75, parJour: 4, jours: 28, ageMax: 180,
        note: "Pendant 4 à 6 semaines, après les 2 premières semaines à 100 mg/kg/24 h.",
        source: "RDC Méd. interne VI.4"
      },
      {
        id: "aas-arthrose", indication: "Arthrose, cas simple (adulte)",
        type: "fixe", texte: "500 mg, 2 à 3 fois par jour, pendant les repas", ageMin: 180,
        source: "RDC Méd. interne VI.3, arthrose du genou"
      },
      {
        id: "aas-diab", indication: "Diabète : prévention des complications (adulte)",
        type: "fixe", texte: "Cardioaspirine 100 mg par jour, à vie", ageMin: 180,
        source: "RDC Méd. interne V.2"
      },
      {
        id: "aas-cvo", indication: "Crise drépanocytaire : antalgique (adulte)",
        type: "fixe", texte: "500 mg : 2 comprimés, 3 fois par jour", parJour: 3, ageMin: 180,
        note: "En alternative au paracétamol. Acétylsalicylate de lysine injectable 1 g en IV directe, 2 fois par jour, si douleur forte.",
        source: "Togo Ord. 21 et Ord. 23, traitement 11"
      }
    ],
    ci: ["Ulcère gastro-duodénal", "Allergie aux AINS", "Grossesse", "Paludisme ou fièvre hémorragique suspecté, varicelle, grippe chez l'enfant (risque de syndrome de Reye)"],
    precautions: ["Prendre pendant les repas"],
    effets: ["Douleurs gastriques, saignement digestif"]
  },

  {
    "id": "antihta",
    "nom": "Antihypertenseurs (adulte)",
    "classe": "Hypertension artérielle",
    "formes": [
      {
        "nom": "Selon la classe choisie (voir le schéma)",
        "mg": 0
      }
    ],
    "regimes": [
      {
        "id": "hta-diur",
        "indication": "Diurétique thiazidique (adulte)",
        "type": "fixe",
        "texte": "Hydrochlorothiazide 25 mg, 1 fois par jour (dans les associations fixes : 12,5 ou 25 mg)",
        "parJour": 1,
        "ageMin": 180,
        "note": "Actif jusqu'à une clairance de la créatinine de 30 mL/min ; en dessous : diurétique de l'anse (furosémide). Spironolactone et amiloride : contre-indiqués en cas d'insuffisance rénale. Surveiller kaliémie et créatinine 7 à 15 jours après le début. Goutte : thiazidique déconseillé.",
        "source": "Livre « Prise en charge HTA » (Cardiologie, p. 188-225 ; HAS 2005, ESH 2007) ; Togo Ord. 41, traitement 8",
        "valider": "La dose de 25 mg par jour vient du manuel togolais ; le livre ne donne que les associations fixes (12,5 ou 25 mg)."
      },
      {
        "id": "hta-bb",
        "indication": "Bêtabloquant (adulte)",
        "type": "fixe",
        "texte": "Aténolol 50 mg, 1 fois par jour ; bisoprolol 2,5 à 10 mg, 1 fois par jour",
        "parJour": 1,
        "ageMin": 180,
        "note": "Réservé à la tachycardie de repos, à l'angor et à la cardiopathie ischémique (pas de monothérapie en 1re intention en dehors de ces cas). Contre-indiqués : asthme, bradycardie, bloc auriculo-ventriculaire. Association à un anticalcique non dihydropyridine déconseillée.",
        "source": "Livre « Prise en charge HTA » (Cardiologie, p. 188-225 ; HAS 2005, ESH 2007)",
        "valider": "Le livre ne donne pas les doses des bêtabloquants seuls : doses déduites des associations fixes (aténolol 50 mg, bisoprolol 2,5 à 10 mg). À confirmer."
      },
      {
        "id": "hta-iec",
        "indication": "IEC (adulte)",
        "type": "fixe",
        "texte": "Énalapril, captopril, ramipril, lisinopril ou périndopril : commencer à faible dose, puis augmenter selon la tolérance",
        "ageMin": 180,
        "note": "Diabétique, prévention de la néphropathie (RDC) : captopril 6,25 mg 2 fois par jour, ou énalapril 2,5 à 5 mg par jour. Cause principale d'arrêt : la toux (passer à un ARA II). Contre-indiqués : grossesse, sténose bilatérale des artères rénales, hyperkaliémie. Dose à adapter à la clairance de la créatinine.",
        "source": "Livre « Prise en charge HTA » (Cardiologie, p. 188-225 ; HAS 2005, ESH 2007) ; RDC Méd. interne V.2",
        "valider": "Les pages du livre sur les IEC seuls n'ont pas été fournies : doses de départ à définir avec la notice du produit disponible."
      },
      {
        "id": "hta-ara",
        "indication": "ARA II / sartans (adulte)",
        "type": "fixe",
        "texte": "1 prise par jour : losartan 50 mg (rarement 100 mg en 2 prises) ; valsartan 40 à 160 mg ; irbésartan 75 à 300 mg ; candésartan 4 à 16 mg ; telmisartan 40 à 80 mg ; olmésartan 10 à 40 mg ; éprosartan 300 mg 2 fois par jour",
        "parJour": 1,
        "ageMin": 180,
        "note": "Efficacité proche de celle des IEC, sans toux ni œdème angioneurotique. Contre-indiqués : grossesse et allaitement, sténose bilatérale des artères rénales, insuffisance hépatique sévère. Surveiller kaliémie et créatinine.",
        "source": "Livre « Prise en charge HTA » (Cardiologie, p. 188-225 ; HAS 2005, ESH 2007)"
      },
      {
        "id": "hta-ca-dhp",
        "indication": "Anticalcique dihydropyridine (adulte)",
        "type": "fixe",
        "texte": "Amlodipine 5 mg par jour, puis 10 mg si besoin ; nifédipine LP 20 mg 2 fois par jour (ou LP 30 mg 1 fois par jour) ; nicardipine LP 50 mg matin et soir ; félodipine 5 mg (jusqu'à 10) ; lercanidipine 10 mg ; lacidipine 4 mg (jusqu'à 6) ; isradipine 5 mg ; nitrendipine 20 mg ; manidipine 10 mg (20 mg après 2 à 4 semaines)",
        "ageMin": 180,
        "note": "Sujet âgé ou insuffisance hépatique : doses plus faibles. Effets : œdèmes des chevilles, bouffées de chaleur, céphalées, palpitations. Ne pas utiliser en cas d'infarctus de moins d'un mois.",
        "source": "Livre « Prise en charge HTA » (Cardiologie, p. 188-225 ; HAS 2005, ESH 2007)"
      },
      {
        "id": "hta-ca-nondhp",
        "indication": "Anticalcique non dihydropyridine (adulte)",
        "type": "fixe",
        "texte": "Diltiazem LP 200 ou 300 mg, 1 fois par jour à heure fixe ; vérapamil LP 240 mg, 1 comprimé le matin (ou 120 mg 2 fois par jour)",
        "parJour": 1,
        "ageMin": 180,
        "note": "Contre-indiqués : bradycardie, blocs auriculo-ventriculaires, insuffisance cardiaque. Association aux bêtabloquants déconseillée (risque de bradycardie).",
        "source": "Livre « Prise en charge HTA » (Cardiologie, p. 188-225 ; HAS 2005, ESH 2007)"
      },
      {
        "id": "hta-asso",
        "indication": "Associations fixes (adulte) : 1 comprimé par jour",
        "type": "fixe",
        "texte": "Énalapril 20 mg + HCTZ 12,5 mg ; captopril 50 mg + HCTZ 25 mg ; lisinopril 20 mg + HCTZ 12,5 mg ; ramipril 5 mg + HCTZ 12,5 mg ; losartan 50 mg + HCTZ 12,5 mg ; valsartan 80 mg + HCTZ 12,5 mg ; aténolol 50 mg + chlortalidone 12,5 mg ; bisoprolol 2,5 à 10 mg + HCTZ 6,25 mg ; aténolol 50 mg + nifédipine 20 mg ; valsartan 80 mg + amlodipine 5 mg",
        "parJour": 1,
        "ageMin": 180,
        "note": "Sujet âgé ou insuffisance rénale modérée : débuter à un demi-comprimé (IEC + HCTZ). Associations préférentielles : anticalcique + IEC (ou ARA II) ; thiazidique + IEC (ou ARA II) ; bêtabloquant + thiazidique ; bêtabloquant + anticalcique dihydropyridine ; anticalcique + thiazidique.",
        "source": "Livre « Prise en charge HTA » (Cardiologie, p. 188-225 ; HAS 2005, ESH 2007), associations"
      },
      {
        "id": "hta-gross",
        "indication": "HTA de la grossesse (adulte)",
        "type": "fixe",
        "texte": "Méthyldopa (Aldomet) : débuter à 250 mg 2 ou 3 fois par jour pendant 48 heures, puis augmenter progressivement toutes les 48 heures jusqu'à 750 mg à 1,5 g par jour (maximum 3 g par jour)",
        "ageMin": 180,
        "note": "Médicament autorisé pendant la grossesse et l'allaitement. Référer pour le suivi obstétrical.",
        "source": "Livre « Prise en charge HTA » (Cardiologie, p. 188-225 ; HAS 2005, ESH 2007) (fiche méthyldopa)"
      }
    ],
    "ci": [
      "Diurétiques : goutte (thiazidiques) ; spironolactone et amiloride : insuffisance rénale",
      "Bêtabloquants : asthme, bradycardie, blocs auriculo-ventriculaires",
      "IEC et ARA II : grossesse, allaitement, sténose bilatérale des artères rénales, hyperkaliémie",
      "Anticalciques non dihydropyridine : bradycardie, bloc, insuffisance cardiaque"
    ],
    "precautions": [
      "Objectifs : < 140/90 mmHg (HTA non compliquée) ; < 130/80 (diabète, insuffisance rénale) ; < 125/75 (insuffisance rénale avec protéinurie > 1 g par 24 h)",
      "Revoir à 4 semaines ; ne pas faire baisser trop brutalement la tension",
      "Alpha-bloquants, antihypertenseurs centraux, vasodilatateurs directs (minoxidil) : jamais en 1re intention, réservés au médecin",
      "AINS, corticoïdes, œstroprogestatifs, vasoconstricteurs nasaux, réglisse et alcool peuvent élever la tension"
    ],
    "effets": [
      "Selon la classe : crampes, hypokaliémie (diurétiques), toux (IEC), bradycardie (bêtabloquants), œdèmes des chevilles (anticalciques)"
    ]
  },

  {
    id: "azithromycine",
    nom: "Azithromycine",
    classe: "Antibiotique (macrolide) — IST",
    formes: [{ nom: "Comprimé 500 mg (ou 250 mg)", mg: 500, conv: false }],
    regimes: [
      {
        id: "azi-ist", indication: "Écoulement urétral, cervicite, infection du pelvis (gonocoque, chlamydia) — adulte",
        type: "fixe", texte: "1 g (2 comprimés de 500 mg, ou 4 comprimés de 250 mg) en prise unique",
        parJour: 1, jours: 1, ageMin: 180,
        note: "Traiter le ou les partenaires ; préservatifs ; dépistage du VIH.",
        source: "Protocole retenu par le validateur (remplace la ciprofloxacine seule du manuel togolais)"
      }
    ],
    ci: ["Allergie aux macrolides"],
    precautions: ["Peut être utilisée chez la femme enceinte (avis médical)"],
    effets: ["Nausées, diarrhée, douleurs abdominales"]
  },

  {
    id: "tinidazole",
    nom: "Tinidazole",
    classe: "Antiparasitaire / antibactérien",
    formes: [{ nom: "Comprimé 500 mg", mg: 500 }],
    regimes: [
      {
        id: "tini-trich", indication: "Trichomonase / vaginose / urétrite (adulte)",
        type: "fixe", texte: "4 comprimés de 500 mg (2 g) en prise unique",
        ageMin: 180,
        note: "Urétrite : associer l'azithromycine 1 g en prise unique. Traiter le ou les partenaires.",
        source: "Togo Ord. 26, traitement 3 ; Ord. 31, traitement 5"
      },
      {
        id: "tini-amib-adulte", indication: "Dysenterie amibienne (adulte)",
        type: "fixe", texte: "4 comprimés de 500 mg en prise unique par jour pendant 3 jours",
        parJour: 1, jours: 3, ageMin: 180,
        note: "Revoir après 3 jours ; du sang encore présent dans les selles : référer.",
        source: "Togo Ord. 18, traitement 4"
      },
      {
        id: "tini-amib-enf", indication: "Dysenterie amibienne (enfant), 2e intention",
        type: "mgkg", mgkg: 50, mgkgMax: 70, parJour: 1, jours: 3, maxPrise: 2000, ageMax: 180,
        note: "En une seule prise par jour. Revoir après 3 jours.",
        source: "Togo Ord. 4, traitement 5"
      }
    ],
    ci: ["Premier trimestre de la grossesse", "Alcool pendant le traitement"],
    precautions: ["Goût métallique, nausées"],
    effets: ["Nausées, goût métallique"]
  },

  {
    id: "doxycycline",
    nom: "Doxycycline",
    classe: "Antibiotique (cycline)",
    formes: [{ nom: "Comprimé 100 mg", mg: 100 }],
    regimes: [
      {
        id: "doxy-syph", indication: "Syphilis / chancre mou : 2e choix (adulte)",
        type: "fixe", texte: "200 mg par jour pendant 14 jours, au repas, avec la ceftriaxone 250 mg en IM unique",
        parJour: 1, jours: 14, ageMin: 180,
        source: "Togo Ord. 27, traitement 1"
      },
      {
        id: "doxy-gono", indication: "Infection à chlamydia associée (arthrite gonococcique) (adulte)",
        type: "fixe", texte: "100 mg toutes les 12 heures pendant 14 jours",
        parJour: 2, jours: 14, ageMin: 180,
        source: "RDC Méd. interne VI.3, arthrite gonococcique"
      },
      {
        id: "doxy-chol", indication: "Choléra — enfant de plus de 8 ans",
        type: "mgkg", mgkgJour: 4, parJour: 1, maxPrise: 200, ageMin: 96, ageMax: 180,
        note: "En une prise par jour ; maximum 200 mg par jour.",
        source: "Togo Ord. 4, traitement 8"
      }
    ],
    ci: ["Grossesse et allaitement", "Enfant de moins de 8 ans"],
    precautions: ["Prendre au repas avec un grand verre d'eau", "Éviter l'exposition au soleil"],
    effets: ["Nausées, photosensibilité"]
  },

  {
    id: "acyclovir",
    nom: "Acyclovir",
    classe: "Antiviral — herpès",
    formes: [{ nom: "Comprimé 400 mg", mg: 400 }],
    regimes: [
      {
        id: "acv-herpes", indication: "Herpès génital (adulte)",
        type: "fixe", texte: "400 mg, 2 fois par jour pendant 5 jours",
        parJour: 2, jours: 5, ageMin: 180,
        note: "Associer : éosine aqueuse 2 %, 3 fois par jour ; vitamine C 1000 mg, 1 comprimé matin et midi ; et le traitement de la syphilis / chancre mou.",
        source: "Togo Ord. 27, traitement 2"
      }
    ],
    ci: ["Allergie à l'acyclovir"],
    precautions: ["Bien s'hydrater", "Insuffisance rénale : adapter la dose"],
    effets: ["Nausées, céphalées"]
  },

  {
    id: "nystatine",
    nom: "Nystatine",
    classe: "Antifongique",
    formes: [
      { nom: "Comprimé 500 000 UI", mg: 0 },
      { nom: "Comprimé / ovule vaginal, pommade", mg: 0 }
    ],
    regimes: [
      {
        id: "nys-vagin", indication: "Vulvo-vaginite à candida (adulte)",
        type: "fixe", texte: "500 000 UI : 2 comprimés par voie orale, matin, midi et soir, pendant 10 jours",
        parJour: 3, jours: 10, ageMin: 180,
        note: "Toilette intime matin et soir pendant 7 jours (polyvidone iodée). Sans amélioration après 7 jours : ajouter le traitement de l'infection du pelvis.",
        source: "Togo Ord. 26, traitement 2"
      },
      {
        id: "nys-cervicite", indication: "Cervicite : comprimé vaginal (adulte)",
        type: "fixe", texte: "1 comprimé vaginal, matin et soir, pendant 10 jours",
        parJour: 2, jours: 10, ageMin: 180, source: "Togo Ord. 26, traitement 4"
      },
      {
        id: "nys-mycose", indication: "Mycose cutanéo-muqueuse génitale (adulte)",
        type: "fixe", texte: "Pommade : 1 application locale, 3 fois par jour ; comprimés 500 000 UI : 2 comprimés, 3 fois par jour pendant 3 semaines ; ovule : 1 ovule, 2 fois par jour pendant 6 jours",
        ageMin: 180, note: "Hygiène corporelle et vestimentaire.", source: "Togo Ord. 27, traitement 3"
      }
    ],
    ci: ["Allergie connue"],
    precautions: ["Traiter aussi le partenaire en cas de récidive"],
    effets: ["Nausées légères"]
  }

];

/* ---------------------------------------------------------------------
   ALGORITHMES DE DÉCISION
   Chaque nœud : { q, aide, options:[{t, vers, memo?}] }  ou  { res:{...} } (résultat)
   vers : id de nœud, "algo:<id>" (début d'un autre algorithme) ou "algo:<id>#<noeud>"
   memo : texte conservé et affiché dans le résultat (ex. plan de réhydratation retenu)
   groupe : "Enfant" ou "Adulte" (affichage du menu)
   niveau : urgence | attention | ok
   Dans les textes : {kg:100} = 100 x poids du patient en mL ; {mg:2.4} = 2,4 x poids en mg
   --------------------------------------------------------------------- */
const ALGORITHMES = [

/* ============================ ENFANT ============================ */
  {
    id: "fievre_enf", groupe: "Enfant",
    titre: "Fièvre de l'enfant",
    sous: "Ord. 1 — dès 2 mois ; température axillaire > 37,5 °C",
    debut: "f0",
    noeuds: {
      f0: {
        q: "Signes de GRAVITÉ du paludisme ou signes généraux de danger ?",
        aide: "Vomissements importants · urines « coca-cola » · oligo-anurie · convulsions · coma ou léthargie · incapable de boire ou téter · pâleur palmaire sévère · détresse respiratoire.",
        options: [
          { t: "Oui, au moins un", vers: "r_grave" },
          { t: "Non", vers: "f1" }
        ]
      },
      f1: {
        q: "Raideur de la nuque, fontanelle bombée, convulsion ou léthargie ?",
        options: [
          { t: "Oui", vers: "r_mening" },
          { t: "Non", vers: "f2" }
        ]
      },
      f2: {
        q: "Âge de l'enfant ?",
        options: [
          { t: "Moins de 2 mois", vers: "r_nne" },
          { t: "2 mois ou plus", vers: "f3" }
        ]
      },
      f3: {
        q: "Résultat du TDR / goutte épaisse (paludisme) ?",
        options: [
          { t: "Positif", vers: "r_palu" },
          { t: "Négatif", vers: "f4" },
          { t: "Non disponible / non réalisé", vers: "r_tdr_nd" }
        ]
      },
      f4: {
        q: "Cherchez un foyer infectieux : lequel est présent ?",
        aide: "Dévêtir l'enfant et l'examiner entièrement. Choisir le signe le plus net.",
        options: [
          { t: "Toux, respiration rapide ou difficile, tirage", vers: "algo:toux_enf" },
          { t: "Diarrhée", vers: "algo:diarrhee_enf" },
          { t: "Mal de gorge : gorge rouge, difficulté à avaler, ganglions", vers: "algo:gorge_enf" },
          { t: "Oreille : pleurs, écoulement, douleur, gonflement", vers: "algo:oreille_enf" },
          { t: "Éruption + (toux, nez qui coule ou yeux rouges), signe de Koplik", vers: "r_rougeole" },
          { t: "Petites bulles / pustules cutanées", vers: "r_staph" },
          { t: "Pleurs en urinant", vers: "r_iu" },
          { t: "Fièvre isolée > 7 jours, quotidienne, fatigue, douleur abdominale", vers: "r_typhoide" },
          { t: "Forte fièvre avec saignement, vomissement, diarrhée", vers: "r_fhv" },
          { t: "Fièvre persistante, diarrhée persistante, retard de croissance, mycose, otite chronique", vers: "r_vih" },
          { t: "Aucun foyer évident", vers: "r_sans_foyer" }
        ]
      },
      r_grave: {
        res: {
          niveau: "urgence",
          titre: "Paludisme grave / maladie fébrile très grave",
          resume: "Premiers soins puis transfert. Garder l'enfant si le transfert est impossible.",
          conduite: [
            "SGH 10 % : 10 mL/kg en bolus (1 h) = {kg:10} mL (prévenir ou traiter l'hypoglycémie)",
            "Artésunate 2,4 mg/kg = {mg:2.4} mg en IV direct ou IM (cuisse), à H0, H12, H24, puis 1 fois/jour (alternatives : artéméther 3,2 mg/kg IM, ou quinine)",
            "Antibiotique : ampicilline + gentamicine, ou ceftriaxone + gentamicine",
            "Prévenir ou traiter la déshydratation (voie orale)",
            "Convulsions : diazépam 0,5 à 1 mg/kg ; détresse respiratoire : phénobarbital 15 mg/kg IM",
            "Paracétamol si fièvre > 38,5 °C",
            "Transfert OBLIGATOIRE si : inconscience persistante après 2 jours, convulsions persistantes, urines rares ou absentes, pâleur palmaire sévère",
            "Pâleur sévère ou urines « coca-cola » (hémoglobinurie) : référer, ne pas donner de quinine"
          ],
          meds: ["sgh10", "artesunate", "artemether-inj", "quinine-inj", "diazepam", "ceftriaxone", "paracetamol"],
          source: "Ord. 1, traitement 2 et tableau III"
        }
      },
      r_mening: {
        res: {
          niveau: "urgence",
          titre: "Méningite possible",
          resume: "Antibiotique à haute dose puis transfert. Notifier.",
          conduite: [
            "Ceftriaxone 100 mg/kg/jour IM ou IV (ou ampicilline 200 à 300 mg/kg/jour), 10 jours",
            "Faire le TDR : paludisme grave possible en même temps",
            "Glycémie ; diazépam si convulsions",
            "Paracétamol si fièvre",
            "Notifier à l'échelon supérieur (zone épidémique) et référer"
          ],
          meds: ["ceftriaxone", "diazepam", "paracetamol"],
          source: "Ord. 1, traitement 3"
        }
      },
      r_nne: {
        res: {
          niveau: "urgence",
          titre: "Nourrisson de moins de 2 mois fébrile",
          resume: "Infection bactérienne grave possible : référer.",
          conduite: [
            "Garder au chaud, poursuivre l'allaitement",
            "Première dose d'antibiotique avant le transfert (ceftriaxone ou ampicilline + gentamicine)",
            "Contrôler la glycémie",
            "Référer en urgence"
          ],
          meds: [],
          source: "Ord. 6 (infections néonatales) — PCIME ; absent du tableau fièvre du manuel",
          valider: ["Le manuel ne détaille pas la fièvre < 2 mois dans l'ordinogramme 1 ; conduite issue de l'ordinogramme 6 et des pratiques PCIME."]
        }
      },
      r_palu: {
        res: {
          niveau: "attention",
          titre: "Paludisme simple (TDR positif, sans signe de gravité)",
          resume: "CTA pendant 3 jours + traitement de la fièvre.",
          conduite: [
            "Artéméther-luméfantrine (AL) selon le poids — ou artésunate-amodiaquine",
            "Paracétamol si température ≥ 38,5 °C, toutes les 6 h",
            "Déshabiller l'enfant, faire boire beaucoup, envelopper dans un linge humide si possible",
            "Rechercher une autre infection associée",
            "Fièvre persistante après 3 jours de traitement correct : rechercher une autre cause, référer",
            "Revenir tout de suite si vomissements, convulsions, enfant qui ne boit plus"
          ],
          meds: ["act-al", "asaq", "paracetamol"],
          source: "Ord. 1, traitement 1"
        }
      },
      r_tdr_nd: {
        res: {
          niveau: "attention",
          titre: "TDR non disponible",
          resume: "Confirmer le paludisme avant tout traitement antipaludique.",
          conduite: [
            "Faire le TDR ou la goutte épaisse (envoyer l'enfant si impossible)",
            "Chercher un autre foyer infectieux",
            "Paracétamol si ≥ 38,5 °C",
            "Si l'enfant est stable et que le test est réellement impossible : appliquer le protocole national du PNLP"
          ],
          meds: ["paracetamol"],
          source: "Ord. 1, étape C : « faire un TDR pour rechercher le paludisme »",
          valider: ["Conduite à tenir sans test non précisée dans le manuel."]
        }
      },
      r_rougeole: {
        res: {
          niveau: "attention",
          titre: "Rougeole",
          resume: "Vitamine A, soins des yeux, prévention de la surinfection. Notifier.",
          conduite: [
            "Vitamine A : 100 000 UI (6-11 mois) ou 200 000 UI (12-59 mois)",
            "Prévenir l'infection de l'œil : pommade ophtalmique à la tétracycline (ou rifamycine collyre, auréomycine)",
            "Amoxicilline 100 mg/kg/jour en 2 prises, au moins 10 jours",
            "Calmer la toux (voir toux de l'enfant), paracétamol si fièvre",
            "Complication majeure (pus des yeux, ulcérations profondes de la bouche, opacité de la cornée, stridor) : référer",
            "Notifier (maladie à déclaration)"
          ],
          meds: ["vitamine-a", "amoxicilline", "paracetamol"],
          source: "Ord. 1, traitement 8"
        }
      },
      r_staph: {
        res: {
          niveau: "attention",
          titre: "Staphylococcie cutanée",
          resume: "Antibiotique oral et soins locaux.",
          conduite: [
            "Cloxacilline 50 mg/kg/jour en 2 prises par voie orale, ou amoxicilline + acide clavulanique 50 mg/kg/jour en 3 prises",
            "Soins locaux : désinfection à la chlorhexidine",
            "Paracétamol si fièvre",
            "Pas d'amélioration : référer"
          ],
          meds: ["amox-clav", "paracetamol"],
          source: "Ord. 1, traitement 9"
        }
      },
      r_iu: {
        res: {
          niveau: "attention",
          titre: "Infection urinaire possible",
          resume: "Traitement selon le manuel ; référer en cas de récidive ou de douleurs abdominales.",
          conduite: [
            "Bandelette urinaire si disponible",
            "Schéma du manuel : ceftriaxone 50 à 100 mg/kg en prise unique IM + érythromycine 50 mg/kg/jour en 2 prises + métronidazole 30 à 40 mg/kg/jour en 2 prises, 7 jours",
            "Hydratation, paracétamol si fièvre",
            "Récidive, douleurs abdominales associées ou échec : référer"
          ],
          meds: ["ceftriaxone", "erythromycine", "metronidazole", "paracetamol"],
          source: "Ord. 1, traitement 10",
          valider: ["Association antibiotique inhabituelle (3 molécules) et libellé de la dose de métronidazole ambigu : à confirmer avant usage."]
        }
      },
      r_typhoide: {
        res: {
          niveau: "attention",
          titre: "Fièvre typhoïde possible",
          resume: "Antibiotique 10 à 15 jours. Référer si doute ou échec.",
          conduite: [
            "Ceftriaxone 50 mg/kg/jour en IV/IM pendant 10 à 15 jours",
            "ou ciprofloxacine 15-20 mg/kg/jour en 2 prises pendant 10 jours (enfant > 6 mois, max 1000 mg/jour)",
            "Hydratation, paracétamol si fièvre",
            "Fièvre persistante après 7 jours de traitement : référer"
          ],
          meds: ["ceftriaxone", "ciprofloxacine", "paracetamol"],
          source: "Ord. 1, traitement 4"
        }
      },
      r_fhv: {
        res: {
          niveau: "urgence",
          titre: "Fièvre hémorragique virale possible",
          resume: "Isoler, mesures d'hygiène, informer la hiérarchie, référer.",
          conduite: [
            "Isoler le malade, mesures d'hygiène strictes (gants, protection)",
            "Informer immédiatement la hiérarchie sanitaire",
            "Ne pas donner d'AAS ni d'AINS",
            "Référer"
          ],
          meds: [],
          source: "Ord. 1, traitement 12"
        }
      },
      r_vih: {
        res: {
          niveau: "attention",
          titre: "Infection à VIH probable",
          resume: "Cotrimoxazole puis référer.",
          conduite: [
            "Cotrimoxazole : ½ comprimé de 480 mg pour 5 kg de poids par jour (ou 5 mL de sirop pour 5 kg/jour), en une prise",
            "Proposer le dépistage (enfant et mère)",
            "Référer pour prise en charge"
          ],
          meds: [],
          source: "Ord. 1, traitement 11"
        }
      },
      r_sans_foyer: {
        res: {
          niveau: "attention",
          titre: "Fièvre sans foyer, TDR négatif",
          resume: "Traitement symptomatique et référence si besoin.",
          conduite: [
            "Paracétamol si ≥ 38,5 °C, hydratation",
            "Refaire le TDR si la fièvre persiste après 48 h",
            "Fièvre > 7 jours ou aggravation : référer",
            "Revenir immédiatement si apparition d'un signe de danger"
          ],
          meds: ["paracetamol"],
          source: "Ord. 1 (« autres signes : référer »)",
          valider: ["Délais de réévaluation (48 h, 7 jours) issus de la pratique courante, non précisés dans le manuel."]
        }
      }
    }
  },

  {
    id: "toux_enf", groupe: "Enfant",
    titre: "Toux / difficultés respiratoires de l'enfant",
    sous: "Ord. 2 et 3",
    debut: "t0",
    noeuds: {
      t0: {
        q: "Fièvre + signe de danger ou de lutte respiratoire ?",
        aide: "Léthargie ou inconscience · incapable de boire ou téter · vomit tout · convulsion · tirage sous-costal · stridor · battement des ailes du nez · geignement.",
        options: [
          { t: "Oui", vers: "r_pneumo_grave" },
          { t: "Non", vers: "t1" }
        ]
      },
      t1: {
        q: "Respiration rapide ? (compter 1 minute complète, enfant calme)",
        aide: "< 2 mois : ≥ 60 /min · 2 à 12 mois : ≥ 50 /min · 12 mois à 5 ans : ≥ 40 /min.",
        options: [
          { t: "Oui, sans signe de lutte respiratoire", vers: "r_pneumo" },
          { t: "Non", vers: "t2" }
        ]
      },
      t2: {
        q: "Autres signes ?",
        options: [
          { t: "Difficulté respiratoire, antécédents, distension thoracique, sifflement", vers: "r_asthme" },
          { t: "Toux + voix rauque ou éteinte, inspiration bruyante (stridor)", vers: "r_laryngite" },
          { t: "Signe de Koplik et/ou éruption", vers: "algo:fievre_enf#r_rougeole" },
          { t: "Fièvre + écoulement nasal, pas de respiration rapide", vers: "r_rhino" },
          { t: "Expectorations + fièvre", vers: "r_bronchite" },
          { t: "Début brutal après un repas ou une régurgitation (corps étranger)", vers: "r_corps" },
          { t: "Toux depuis plus de 2 semaines, contage tuberculeux, fièvre prolongée", vers: "r_tb" },
          { t: "Autres signes", vers: "r_ref" }
        ]
      },
      r_pneumo_grave: {
        res: {
          niveau: "urgence",
          titre: "Pneumonie grave",
          resume: "Première dose d'antibiotique puis transfert.",
          conduite: [
            "Libérer les voies aériennes, position semi-assise, oxygène si disponible",
            "Amoxicilline 50 mg/kg en 1 injection IM/IV, ou ceftriaxone 50 mg/kg IV, puis référer",
            "Abord veineux si possible ; faire le TDR (paludisme associé)"
          ],
          meds: ["amoxicilline", "ceftriaxone"],
          source: "Ord. 2, traitement 4 et Ord. 3"
        }
      },
      r_pneumo: {
        res: {
          niveau: "attention",
          titre: "Pneumonie (non grave)",
          resume: "Amoxicilline orale 5 jours, réévaluation à 2 jours.",
          conduite: [
            "Amoxicilline 100 mg/kg/jour en 3 prises pendant 5 jours (ou ampicilline)",
            "Allergie aux pénicillines : érythromycine 50 mg/kg/jour en 2 prises, 5 jours",
            "Paracétamol si température > 38,5 °C",
            "Désobstruer le nez ; apprendre à la mère les signes de retour immédiat (tirage, stridor)",
            "Après 2 jours : amélioration = continuer, sinon référer"
          ],
          meds: ["amoxicilline", "erythromycine", "paracetamol"],
          source: "Ord. 2, traitement 3"
        }
      },
      r_asthme: {
        res: {
          niveau: "attention",
          titre: "Crise d'asthme du nourrisson / de l'enfant",
          resume: "Bronchodilatateur en chambre d'inhalation.",
          conduite: [
            "Salbutamol spray + chambre d'inhalation : 1 à 2 bouffées, à renouveler toutes les 30 min à 1 h jusqu'à l'arrêt de la crise",
            "Fièvre ou signes de pneumonie : érythromycine 50 mg/kg/jour en 2 prises, 5 jours",
            "Détresse respiratoire : bétaméthasone IM (2 à 8 mg selon l'âge), puis référer",
            "Traitement de fond par corticoïdes inhalés (selon niveau de gravité)"
          ],
          meds: ["salbutamol", "erythromycine"],
          source: "Ord. 2, traitement 5"
        }
      },
      r_laryngite: {
        res: {
          niveau: "urgence",
          titre: "Laryngite avec stridor",
          resume: "Traiter puis réévaluer à 1 heure ; référer si pas d'amélioration.",
          conduite: [
            "Enfant < 6 mois : pénicilline G 50 000 UI/kg IM ; enfant > 6 mois : ceftriaxone 50 mg/kg/jour IV",
            "Bétaméthasone 4 mg IM (1 ampoule)",
            "Prométhazine 1 mg/kg IM",
            "Après 1 heure : amélioration = continuer l'antibiotique 6 jours ; sinon référer"
          ],
          meds: ["ceftriaxone"],
          source: "Ord. 2, traitement 2"
        }
      },
      r_rhino: {
        res: {
          niveau: "ok",
          titre: "Rhinopharyngite",
          resume: "Traitement symptomatique ; antibiotique selon le manuel.",
          conduite: [
            "Paracétamol si température > 38,5 °C",
            "Désobstruer et désinfecter les narines au sérum physiologique",
            "Le manuel prescrit : amoxicilline ou érythromycine 50 mg/kg en 2 prises pendant 10 jours",
            "Apprendre à la mère quand revenir immédiatement (tirage, stridor) ; pas d'amélioration : référer"
          ],
          meds: ["paracetamol", "erythromycine"],
          source: "Ord. 2, traitement 1",
          valider: ["L'OMS/PCIME ne recommande pas d'antibiotique pour un rhume ou une rhinopharyngite simple. Le manuel togolais en prescrit un : à trancher lors de la validation."]
        }
      },
      r_bronchite: {
        res: {
          niveau: "attention",
          titre: "Bronchite",
          resume: "Fluidifiant et antibiotique selon le manuel.",
          conduite: [
            "Bromhexine 0,5 mg/kg/jour, ou acétylcystéine (2 à 7 ans : 400 mg/j en 2 prises ; > 8 ans : 600 mg/j en 3 prises), 7 jours",
            "Amoxicilline 100 mg/kg en 3 prises/jour pendant 5 jours, ou érythromycine 50 mg/kg/jour en 2 prises, 5 jours",
            "Amélioration : continuer ; sinon référer"
          ],
          meds: ["amoxicilline", "erythromycine"],
          source: "Ord. 2, traitement 6"
        }
      },
      r_corps: {
        res: {
          niveau: "urgence",
          titre: "Inhalation de corps étranger / fausse route",
          resume: "Manœuvre de Heimlich, référer si détresse.",
          conduite: [
            "Manœuvre de Heimlich",
            "Ne pas faire vomir, pas de lavage d'estomac",
            "Détresse respiratoire : référer",
            "Signes de pneumonie : traiter ; surveiller l'enfant"
          ],
          meds: [],
          source: "Ord. 2, traitement 7"
        }
      },
      r_tb: {
        res: {
          niveau: "attention",
          titre: "Toux prolongée : tuberculose possible",
          resume: "Référer pour diagnostic.",
          conduite: [
            "Rechercher un contage tuberculeux, un amaigrissement, une infection à VIH",
            "Référer pour bilan"
          ],
          meds: [],
          source: "Ord. 3 (tuberculose : référer)"
        }
      },
      r_ref: {
        res: {
          niveau: "attention",
          titre: "Autres signes : référer",
          resume: "Pas de conduite spécifique dans le manuel.",
          conduite: ["Référer pour avis médical"],
          meds: [],
          source: "Ord. 2 (« autres signes : référer »)"
        }
      }
    }
  },

  {
    id: "diarrhee_enf", groupe: "Enfant",
    titre: "Diarrhée de l'enfant",
    sous: "Ord. 4 — évaluer toujours l'hydratation",
    debut: "d0",
    noeuds: {
      d0: {
        q: "Déshydratation SÉVÈRE ?",
        aide: "Au moins 2 parmi : léthargie ou inconscience · yeux enfoncés · incapable de boire · pli cutané qui s'efface très lentement.",
        options: [
          { t: "Oui (≥ 2 signes) — Plan C", vers: "d_spec", memo: "Hydratation : déshydratation SÉVÈRE → Plan C" },
          { t: "Non", vers: "d1" }
        ]
      },
      d1: {
        q: "Signes ÉVIDENTS de déshydratation ?",
        aide: "Au moins 2 parmi : agité ou irritable · yeux enfoncés · boit avec avidité, assoiffé · pli cutané qui s'efface lentement.",
        options: [
          { t: "Oui (≥ 2 signes) — Plan B", vers: "d_spec", memo: "Hydratation : signes évidents → Plan B (SRO 75 mL/kg en 4 h)" },
          { t: "Non — Plan A", vers: "d_spec", memo: "Hydratation : pas de déshydratation → Plan A" }
        ]
      },
      d_spec: {
        q: "Autres caractéristiques ?",
        options: [
          { t: "Sang et/ou glaires dans les selles + fièvre (≥ 37,5 °C)", vers: "r_bacillaire" },
          { t: "Sang et/ou glaires dans les selles, sans fièvre", vers: "r_amibienne" },
          { t: "Selles « eau de riz » abondantes (choléra suspecté)", vers: "r_cholera" },
          { t: "Selles liquides depuis plus de 14 jours, amaigrissement, fièvre, mycose", vers: "r_vih" },
          { t: "Signes de malnutrition : amaigrissement, cheveux fins, œdèmes des pieds", vers: "r_malnut" },
          { t: "Aucune de ces caractéristiques", vers: "r_simple" }
        ]
      },
      r_simple: {
        res: {
          niveau: "attention",
          titre: "Diarrhée aiguë : réhydratation + zinc",
          resume: "Appliquer le plan de réhydratation retenu et donner le zinc.",
          conduite: [
            "Plan A : SRO 50 à 100 mL après chaque selle liquide (domicile)",
            "Plan B : SRO 75 mL/kg en 4 h = {kg:75} mL ; réévaluer après 4 h",
            "Plan C : perfusion de réhydratation, référer si application impossible localement (annexe 6 du manuel)",
            "Zinc dans tous les cas : ½ cp/jour jusqu'à 6 mois, 1 cp/jour dès 7 mois, pendant 14 jours",
            "Poursuivre l'allaitement et l'alimentation ; pas d'antibiotique ni d'antidiarrhéique",
            "Revenir si boit mal, fièvre, sang dans les selles, aggravation"
          ],
          meds: ["sro", "zinc"],
          source: "Ord. 4",
          valider: ["L'annexe 6 du manuel (détail du plan C) n'est pas dans le fichier fourni : à compléter."]
        }
      },
      r_bacillaire: {
        res: {
          niveau: "attention",
          titre: "Dysenterie bacillaire (shigellose)",
          resume: "Ciprofloxacine 5 jours + réhydratation + zinc.",
          conduite: [
            "Réhydratation selon le plan retenu (voir plus haut) ; SRO plan B = {kg:75} mL en 4 h",
            "Ciprofloxacine 15-20 mg/kg/jour en 2 prises pendant 5 jours (max 1000 mg/jour)",
            "Zinc 14 jours",
            "Revoir à 2 jours : sang encore présent ou pas d'amélioration → référer"
          ],
          meds: ["ciprofloxacine", "sro", "zinc"],
          source: "Ord. 4, traitement 4"
        }
      },
      r_amibienne: {
        res: {
          niveau: "attention",
          titre: "Dysenterie amibienne",
          resume: "Métronidazole 7 jours + réhydratation + zinc.",
          conduite: [
            "Réhydratation selon le plan retenu ; SRO plan B = {kg:75} mL en 4 h",
            "Métronidazole 30-40 mg/kg/jour en 3 prises pendant 7 jours (2e intention : tinidazole 50-70 mg/kg en 1 prise par jour, 3 jours)",
            "Zinc 14 jours",
            "Revoir à 3 jours : sang encore présent → référer"
          ],
          meds: ["metronidazole", "sro", "zinc"],
          source: "Ord. 4, traitement 5"
        }
      },
      r_cholera: {
        res: {
          niveau: "urgence",
          titre: "Choléra suspecté",
          resume: "Réhydrater, antibiotique, isoler et notifier.",
          conduite: [
            "Réhydratation rapide selon le degré (plan B/C) ; SRO plan B = {kg:75} mL en 4 h",
            "Ciprofloxacine 15-20 mg/kg/jour en 2 prises pendant 3 jours (1re intention)",
            "Enfant > 8 ans : doxycycline 4 mg/kg/jour en 1 prise (max 200 mg/jour)",
            "2e intention : érythromycine, 4 fois par jour pendant 3 jours",
            "Isoler, mesures d'hygiène, notifier immédiatement ; référer"
          ],
          meds: ["ciprofloxacine", "erythromycine", "sro", "zinc"],
          source: "Ord. 4, traitement 8"
        }
      },
      r_vih: {
        res: {
          niveau: "attention",
          titre: "Diarrhée persistante : infection à VIH probable",
          resume: "Réhydrater, cotrimoxazole, référer.",
          conduite: [
            "Traiter la déshydratation selon le plan retenu",
            "Cotrimoxazole : ½ comprimé de 480 mg pour 5 kg/jour en 2 prises pendant 5 jours (sirop : 5 mL pour 5 kg/jour)",
            "Zinc 14 jours",
            "Référer en cas de persistance de la diarrhée"
          ],
          meds: ["sro", "zinc"],
          source: "Ord. 4, traitement 6"
        }
      },
      r_malnut: {
        res: {
          niveau: "attention",
          titre: "Malnutrition associée",
          resume: "Réhydrater prudemment et référer vers le centre nutritionnel.",
          conduite: [
            "Traiter la déshydratation selon le plan retenu",
            "Malnutrition modérée : référer vers le CRENAM",
            "Malnutrition sévère : référer vers le CRENI / CRENAS",
            "Zinc 14 jours"
          ],
          meds: ["sro", "zinc"],
          source: "Ord. 4, traitement 7"
        }
      }
    }
  },

  {
    id: "gorge_enf", groupe: "Enfant",
    titre: "Mal de gorge de l'enfant",
    sous: "Ord. 11",
    debut: "g0",
    noeuds: {
      g0: {
        q: "Que trouve-t-on à l'examen ?",
        options: [
          { t: "Gorge rouge, enduits blanchâtres, fièvre, difficulté à avaler", vers: "r_angine" },
          { t: "Fausses membranes, ganglions, grosse rate", vers: "r_mono" },
          { t: "Ouverture difficile de la bouche", vers: "r_abces" },
          { t: "Corps étranger visible ou suspecté", vers: "r_corps" },
          { t: "Nez qui coule ou bouché, fièvre, ganglions (rhinopharyngite)", vers: "algo:toux_enf" },
          { t: "Autres signes", vers: "r_ref" }
        ]
      },
      r_angine: {
        res: {
          niveau: "attention",
          titre: "Angine bactérienne",
          resume: "Amoxicilline 10 jours + antalgique.",
          conduite: [
            "Amoxicilline (ou ampicilline) 100 mg/kg/jour en 3 prises par voie orale, 10 jours ; ou érythromycine 50 mg/kg/jour en 2 prises",
            "Antalgique : paracétamol, et anti-inflammatoire (ibuprofène) si besoin",
            "Continuer l'antibiotique 10 jours même sans douleur (RAA, glomérulonéphrite)",
            "Évolution défavorable : maintenir le traitement et référer"
          ],
          meds: ["amoxicilline", "erythromycine", "paracetamol", "ibuprofene"],
          source: "Ord. 11, traitement 1"
        }
      },
      r_mono: {
        res: { niveau: "attention", titre: "Mononucléose infectieuse possible", resume: "Référer.", conduite: ["Référer pour avis médical"], meds: [], source: "Ord. 11" }
      },
      r_abces: {
        res: {
          niveau: "urgence",
          titre: "Abcès de l'amygdale",
          resume: "Première dose puis référer.",
          conduite: [
            "Benzathine pénicilline en IM : enfant ≥ 5 ans 1,2 MUI ; enfant < 5 ans 600 000 UI",
            "Référer"
          ],
          meds: [],
          source: "Ord. 11, traitement 2"
        }
      },
      r_corps: {
        res: {
          niveau: "urgence",
          titre: "Corps étranger de la gorge",
          resume: "Manœuvre de Heimlich ; référer rapidement si échec.",
          conduite: [
            "Manœuvre de Heimlich",
            "Si échec : paracétamol injectable 15 mg/kg et amoxicilline injectable 50 mg/kg avant le transfert",
            "Référer rapidement"
          ],
          meds: [],
          source: "Ord. 11, traitement 3"
        }
      },
      r_ref: {
        res: { niveau: "attention", titre: "Autres signes : référer", resume: "Pas de conduite spécifique.", conduite: ["Référer pour avis médical"], meds: [], source: "Ord. 11" }
      }
    }
  },

  {
    id: "oreille_enf", groupe: "Enfant",
    titre: "Maladies de l'oreille de l'enfant",
    sous: "Ord. 12",
    debut: "o0",
    noeuds: {
      o0: {
        q: "Que trouve-t-on à l'examen de l'oreille ?",
        options: [
          { t: "Tympan rouge, pas d'écoulement ou écoulement < 14 jours, fièvre", vers: "r_oma" },
          { t: "Écoulement d'oreille depuis plus de 14 jours", vers: "r_omc" },
          { t: "Douleur à la pression du tragus (furoncle du conduit)", vers: "r_ext" },
          { t: "Gonflement douloureux DERRIÈRE l'oreille", vers: "r_mastoidite" },
          { t: "Gonflement douloureux SOUS l'oreille (oreillons)", vers: "r_parotidite" },
          { t: "Écoulement de sang / traumatisme", vers: "r_lesion" },
          { t: "Corps étranger", vers: "r_corps" },
          { t: "Bouchon de cérumen", vers: "r_cerumen" },
          { t: "Baisse de l'audition, bourdonnements, vertiges", vers: "r_ref" }
        ]
      },
      r_oma: {
        res: {
          niveau: "attention",
          titre: "Otite moyenne aiguë",
          resume: "Amoxicilline + acide clavulanique, antalgique, réévaluer à 5 jours.",
          conduite: [
            "Amoxicilline + acide clavulanique 50 mg/kg/jour (amoxicilline) en 3 prises, ou érythromycine 50 mg/kg/jour en 2 prises",
            "À 5 jours : bonne évolution = poursuivre encore 5 jours ; sinon ou rechute après 10 jours = référer",
            "Écoulement : assécher avec une mèche, ne rien mettre d'autre dans l'oreille",
            "Antalgique : paracétamol ou ibuprofène 30 mg/kg/jour en 3 prises pendant les repas"
          ],
          meds: ["amox-clav", "erythromycine", "paracetamol", "ibuprofene"],
          source: "Ord. 12, traitement 1"
        }
      },
      r_omc: {
        res: {
          niveau: "attention",
          titre: "Otite moyenne chronique",
          resume: "Assécher et gouttes de quinolone ; référer si pas d'amélioration à 5 jours.",
          conduite: [
            "Assécher l'oreille avec une mèche, changer dès qu'elle est humide",
            "Quinolone en gouttes auriculaires",
            "Éviter que l'eau n'entre dans l'oreille (coton au moment de la toilette)",
            "Pas d'amélioration après 5 jours : référer"
          ],
          meds: [],
          source: "Ord. 12, traitement 2"
        }
      },
      r_ext: {
        res: {
          niveau: "attention",
          titre: "Otite externe / furoncle du conduit",
          resume: "Même antibiotique que l'otite moyenne aiguë.",
          conduite: ["Amoxicilline + acide clavulanique (voir otite moyenne aiguë)", "Antalgique"],
          meds: ["amox-clav", "paracetamol"],
          source: "Ord. 12, traitement 3"
        }
      },
      r_mastoidite: {
        res: {
          niveau: "urgence",
          titre: "Mastoïdite aiguë",
          resume: "Première dose puis référer.",
          conduite: ["Ampicilline 50 mg/kg + gentamicine 3 mg/kg en IM", "Référer"],
          meds: [],
          source: "Ord. 12, traitement 4"
        }
      },
      r_parotidite: {
        res: {
          niveau: "attention",
          titre: "Parotidite aiguë / oreillons",
          resume: "Repos et même attitude que l'otite moyenne aiguë.",
          conduite: ["Repos au lit, éviction scolaire 7 jours", "Même traitement que l'otite moyenne aiguë", "Douleurs testiculaires : référer"],
          meds: ["amox-clav", "paracetamol"],
          source: "Ord. 12, traitement 5"
        }
      },
      r_lesion: {
        res: {
          niveau: "urgence",
          titre: "Lésion certaine de l'oreille",
          resume: "Première dose puis référer.",
          conduite: ["Mèche stérile dans l'oreille", "Ampicilline 50 mg/kg + gentamicine 3 mg/kg en IM", "Paracétamol 15 mg/kg en IV", "Référer"],
          meds: [],
          source: "Ord. 12, traitement 6"
        }
      },
      r_corps: {
        res: {
          niveau: "attention",
          titre: "Corps étranger de l'oreille",
          resume: "Extraction à la pince, pas de lavage.",
          conduite: ["Tenter l'extraction avec une pince ; ne pas laver l'oreille", "Amoxicilline + acide clavulanique 7 jours", "Échec d'extraction : même traitement et référer"],
          meds: ["amox-clav"],
          source: "Ord. 12, traitement 7"
        }
      },
      r_cerumen: {
        res: {
          niveau: "ok",
          titre: "Bouchon de cérumen",
          resume: "Lavage à l'eau tiède.",
          conduite: ["Lavage à l'eau tiède avec une grosse seringue sans aiguille", "Le patient entend-il mieux ? Sinon référer", "Douleur après lavage : AAS ou ibuprofène 3 jours"],
          meds: ["ibuprofene"],
          source: "Ord. 12, traitement 9"
        }
      },
      r_ref: {
        res: { niveau: "attention", titre: "Référer", resume: "Troubles cochléo-vestibulaires ou autres signes.", conduite: ["Référer pour avis spécialisé"], meds: [], source: "Ord. 12" }
      }
    }
  },

/* ============================ ADULTE ============================ */
  {
    id: "fievre_adu", groupe: "Adulte",
    titre: "Fièvre de l'adulte",
    sous: "Ord. 16 — température > 37,5 °C",
    debut: "a0",
    noeuds: {
      a0: {
        q: "Signes de gravité ou vomissements importants ?",
        aide: "Vomissements importants · convulsions · troubles de la conscience · ictère · urines foncées · détresse respiratoire · pâleur sévère · oligo-anurie.",
        options: [
          { t: "Oui", vers: "r_grave" },
          { t: "Non", vers: "a1" }
        ]
      },
      a1: {
        q: "Raideur de la nuque, céphalées intenses, vomissements en jet, notion d'épidémie ?",
        options: [
          { t: "Oui", vers: "r_mening" },
          { t: "Non", vers: "a2" }
        ]
      },
      a2: {
        q: "Vomissements noirâtres ou saignements de la peau et des muqueuses ?",
        options: [
          { t: "Oui", vers: "r_fj" },
          { t: "Non", vers: "a3" }
        ]
      },
      a3: {
        q: "Résultat du TDR / goutte épaisse (frissons, courbatures, céphalées) ?",
        options: [
          { t: "Positif", vers: "r_palu" },
          { t: "Négatif ou non disponible", vers: "a4" }
        ]
      },
      a4: {
        q: "Quel foyer ou syndrome oriente ?",
        options: [
          { t: "Toux, dyspnée, douleur thoracique, râles crépitants", vers: "algo:toux_adu" },
          { t: "Diarrhée", vers: "algo:diarrhee_adu" },
          { t: "Fièvre > 39 °C isolée depuis plus de 7 jours, fatigue, pouls dissocié", vers: "r_typhoide" },
          { t: "Écoulement nasal, toux, larmoiement, céphalées", vers: "r_grippe" },
          { t: "Ictère, nausées, douleur de l'hypocondre droit", vers: "r_hepatite" },
          { t: "Fièvre > 1 mois, sueurs nocturnes, amaigrissement, toux > 2 semaines", vers: "r_tb" },
          { t: "Mal de gorge, oreille, sinus", vers: "r_orl" },
          { t: "Autres signes", vers: "r_ref" }
        ]
      },
      r_grave: {
        res: {
          niveau: "urgence",
          titre: "Paludisme grave / maladie fébrile grave",
          resume: "1re dose puis transfert en urgence à l'hôpital.",
          conduite: [
            "Artésunate injectable 2,4 mg/kg = {mg:2.4} mg en IV ou IM, ou artéméther 160 mg IM, ou quinine injectable (15 mg/kg de sels IM / 12,5 mg/kg base)",
            "Antibiotique : ampicilline 100 mg/kg IM, ou ceftriaxone 50 mg/kg IM",
            "Convulsions : diazépam 10 mg IM, patient sur le côté, aspirer les sécrétions",
            "Hypoglycémie : 100 mL d'eau sucrée si le patient peut boire, ou SGH 10 % 250 mL en perfusion",
            "Paracétamol ou AAS si fièvre ≥ 38,5 °C et pour les céphalées",
            "Référer d'urgence"
          ],
          meds: ["artesunate", "artemether-inj", "quinine-inj", "ceftriaxone", "diazepam", "sgh10", "paracetamol"],
          source: "Ord. 16, traitement 2"
        }
      },
      r_mening: {
        res: {
          niveau: "urgence",
          titre: "Méningite possible",
          resume: "Première dose de ceftriaxone, notifier, référer.",
          conduite: [
            "Ceftriaxone 1 g IM ou IV direct (ou ampicilline 200 mg/kg IM/IV)",
            "Paracétamol ou AAS si fièvre",
            "Notifier à l'échelon supérieur",
            "Référer"
          ],
          meds: ["ceftriaxone", "paracetamol"],
          source: "Ord. 16, traitement 3"
        }
      },
      r_fj: {
        res: {
          niveau: "urgence",
          titre: "Fièvre jaune ou fièvre hémorragique possible",
          resume: "Alerter immédiatement l'échelon supérieur.",
          conduite: [
            "Isoler le malade, mesures de protection",
            "SRO à boire à volonté, compresses froides",
            "Ne pas donner d'AAS",
            "Alerter l'échelon supérieur immédiatement et référer"
          ],
          meds: ["sro"],
          source: "Ord. 16, traitement 9"
        }
      },
      r_palu: {
        res: {
          niveau: "attention",
          titre: "Paludisme simple",
          resume: "CTA 3 jours + traitement de la fièvre.",
          conduite: [
            "Artéméther-luméfantrine 20/120 mg : 4 comprimés matin et soir pendant 3 jours",
            "Alternative : artésunate-amodiaquine pendant 3 jours (schéma adulte à valider)",
            "Paracétamol 500 mg : 2 comprimés x 3/jour (6 h d'intervalle)",
            "Eau à boire à volonté",
            "Fièvre persistante après 3 jours de traitement correct : rechercher d'autres affections, référer",
            "Femme enceinte : suivre le protocole du PNLP selon le trimestre"
          ],
          meds: ["act-al", "paracetamol"],
          source: "Ord. 16, traitement 1",
          valider: ["La dose adulte de l'AS-AQ du manuel est probablement erronée (voir fiche AS-AQ)."]
        }
      },
      r_typhoide: {
        res: {
          niveau: "attention",
          titre: "Fièvre typhoïde possible",
          resume: "Ciprofloxacine 15-21 jours ou ceftriaxone 10 jours.",
          conduite: [
            "Ciprofloxacine 500 mg : 1 comprimé x 2/jour pendant 15 à 21 jours",
            "ou ceftriaxone 2 g/jour en 2 injections IM/IV pendant 10 jours (relais oral si amélioration après 3 jours)",
            "Fièvre persistante après le 7e jour : référer"
          ],
          meds: ["ciprofloxacine", "ceftriaxone"],
          source: "Ord. 16, traitement 4"
        }
      },
      r_grippe: {
        res: {
          niveau: "ok",
          titre: "Syndrome grippal",
          resume: "Traitement symptomatique.",
          conduite: [
            "Paracétamol ou AAS",
            "Vitamine C 1000 mg le matin",
            "Repos, boissons chaudes, calmer la toux si besoin, antihistaminique"
          ],
          meds: ["paracetamol"],
          source: "Ord. 16, traitement 5"
        }
      },
      r_hepatite: {
        res: {
          niveau: "attention",
          titre: "Hépatite possible",
          resume: "Voir l'ordinogramme ictère (non intégré).",
          conduite: ["Référer pour bilan", "Éviter les médicaments hépatotoxiques (paracétamol à dose réduite)"],
          meds: [],
          source: "Ord. 16 → Ord. 21 (non intégré)"
        }
      },
      r_tb: {
        res: {
          niveau: "attention",
          titre: "Tuberculose / infection à VIH possible",
          resume: "Suivre les directives des programmes nationaux.",
          conduite: ["Référer pour examen de crachats et dépistage selon le PNLT et le PNLS"],
          meds: [],
          source: "Ord. 16, traitement 7"
        }
      },
      r_orl: {
        res: {
          niveau: "attention",
          titre: "Affection ORL",
          resume: "Ordinogrammes mal de gorge / oreille / écoulement nasal de l'adulte (non intégrés).",
          conduite: ["Examiner la gorge, les tympans et les sinus", "Paracétamol", "Antibiotique selon le manuel (amoxicilline ou érythromycine si angine bactérienne)", "Référer en cas de doute"],
          meds: ["paracetamol"],
          source: "Ord. 16, traitement 10 → Ord. 35, 40, 41 (non intégrés)"
        }
      },
      r_ref: {
        res: { niveau: "attention", titre: "Autres signes : référer", resume: "Pas de conduite spécifique.", conduite: ["Paracétamol", "Référer pour bilan"], meds: ["paracetamol"], source: "Ord. 16" }
      }
    }
  },

  {
    id: "toux_adu", groupe: "Adulte",
    titre: "Toux de l'adulte",
    sous: "Ord. 17 et 19",
    debut: "u0",
    noeuds: {
      u0: {
        q: "Fièvre > 1 mois, amaigrissement, sueurs nocturnes, toux > 15 jours ?",
        options: [
          { t: "Oui", vers: "r_tb" },
          { t: "Non", vers: "u1" }
        ]
      },
      u1: {
        q: "Fièvre + dyspnée + douleur thoracique + râles crépitants ?",
        options: [
          { t: "Oui", vers: "u1b" },
          { t: "Non", vers: "u2" }
        ]
      },
      u1b: {
        q: "Signes de gravité ?",
        aide: "Détresse respiratoire · cyanose · confusion · fréquence respiratoire élevée · tension basse · incapacité à boire.",
        options: [
          { t: "Oui", vers: "r_pneumo_grave" },
          { t: "Non", vers: "r_pneumo" }
        ]
      },
      u2: {
        q: "Autres signes ?",
        options: [
          { t: "Fièvre, crachats jaunâtres", vers: "r_bronchite" },
          { t: "Fièvre, toux, voix rauque ou éteinte", vers: "r_laryngite" },
          { t: "Écoulement nasal, toux, larmoiement, céphalées", vers: "r_grippe" },
          { t: "Râles sibilants, dyspnée expiratoire", vers: "r_asthme" },
          { t: "Dyspnée de décubitus ou œdèmes des membres inférieurs", vers: "r_ic" },
          { t: "Crachat mousseux rosé, orthopnée, râles crépitants, HTA", vers: "r_oap" },
          { t: "Rougeur conjonctivale, larmoiement, prurit", vers: "r_allergie" },
          { t: "Autres signes", vers: "r_ref" }
        ]
      },
      r_tb: {
        res: {
          niveau: "attention", titre: "Tuberculose possible", resume: "Référer pour diagnostic et traitement selon le programme national.",
          conduite: ["Référer pour examen de crachats et mise sous traitement selon le PNLT"], meds: [], source: "Ord. 17"
        }
      },
      r_pneumo: {
        res: {
          niveau: "attention", titre: "Pneumonie (sans signe de gravité)", resume: "Amoxicilline 10 jours, revoir à 5 jours.",
          conduite: [
            "Amoxicilline 1 g par voie orale matin, midi et soir pendant 10 jours (ou ampicilline 1 g x 3/j)",
            "Alternative : érythromycine 1 g matin et soir pendant 7 jours",
            "Paracétamol ou AAS 1 g x 3/jour si température > 38,5 °C",
            "Pas d'amélioration après 5 jours : référer"
          ],
          meds: ["amoxicilline", "erythromycine", "paracetamol"], source: "Ord. 17, traitement 2 et Ord. 16, traitement 6"
        }
      },
      r_pneumo_grave: {
        res: {
          niveau: "urgence", titre: "Pneumonie avec signes de gravité", resume: "Ceftriaxone puis référer.",
          conduite: [
            "Ceftriaxone 2 g IM ou IV direct, puis référer",
            "Position demi-assise, oxygène si disponible"
          ],
          meds: ["ceftriaxone", "amox-clav"], source: "Ord. 17 et Ord. 19, traitement 5",
          valider: ["Critères de gravité non détaillés dans le manuel : liste usuelle utilisée."]
        }
      },
      r_bronchite: {
        res: {
          niveau: "attention", titre: "Bronchite aiguë", resume: "Paracétamol, fluidifiant ; antibiotique si fièvre persistante.",
          conduite: [
            "Paracétamol 500 mg : 2 comprimés matin et soir",
            "Expectorant",
            "Fièvre persistante après 5 jours : amoxicilline 1 g x 3/j pendant 10 jours (ou érythromycine 1 g x 2/j pendant 7 jours)",
            "Pas d'amélioration après 10 jours : référer"
          ],
          meds: ["paracetamol", "amoxicilline", "erythromycine"], source: "Ord. 17, traitement 3"
        }
      },
      r_laryngite: {
        res: {
          niveau: "attention", titre: "Laryngite", resume: "Antibiotique ; corticoïde puis référer si dyspnée.",
          conduite: [
            "Amoxicilline 1 g x 3/j pendant 10 jours ou érythromycine 1 g x 2/j pendant 7 jours",
            "Noscapine 1 comprimé x 3/j ou bromhexine 2 comprimés x 2/j",
            "Dyspnée : corticoïde puis référer"
          ],
          meds: ["amoxicilline", "erythromycine"], source: "Ord. 17, traitement 4"
        }
      },
      r_grippe: {
        res: {
          niveau: "ok", titre: "Syndrome grippal", resume: "Traitement symptomatique.",
          conduite: ["Paracétamol ou AAS 500 mg x 3/j", "Terpine codéine 300-600 mg x 3/j pendant 5 à 7 jours", "Vitamine C 500 mg : 2 comprimés le matin", "Repos, boissons chaudes, antihistaminique"],
          meds: ["paracetamol"], source: "Ord. 17, traitement 5"
        }
      },
      r_asthme: {
        res: {
          niveau: "attention", titre: "Crise d'asthme", resume: "Salbutamol en chambre d'inhalation.",
          conduite: [
            "Salbutamol aérosol 1 à 2 bouffées avec chambre d'inhalation dès les premiers symptômes, à répéter après 15 min si besoin",
            "Crise persistante après 1 heure : référer en position demi-assise",
            "Si la crise cède : corticoïde inhalé 1 à 2 bouffées pendant 30 jours"
          ],
          meds: ["salbutamol"], source: "Ord. 17, traitement 6 et Ord. 19"
        }
      },
      r_ic: {
        res: { niveau: "urgence", titre: "Insuffisance cardiaque possible", resume: "Référer.", conduite: ["Position demi-assise", "Référer"], meds: [], source: "Ord. 17 → Ord. 37 (œdèmes, non intégré) ; Ord. 19" }
      },
      r_oap: {
        res: {
          niveau: "urgence", titre: "Œdème aigu du poumon possible", resume: "Furosémide IV puis référer.",
          conduite: ["Position demi-assise", "Furosémide 20 mg : 2 ampoules en IV direct", "Référer d'urgence"],
          meds: [], source: "Ord. 19, traitement 1"
        }
      },
      r_allergie: {
        res: {
          niveau: "ok", titre: "Allergie", resume: "Antihistaminique.",
          conduite: ["Polaramine 2 mg : 1 comprimé x 3/j, ou loratadine : 1 comprimé/jour", "Persistance : référer"],
          meds: [], source: "Ord. 17, traitement 9"
        }
      },
      r_ref: {
        res: { niveau: "attention", titre: "Autres signes : référer", resume: "Pas de conduite spécifique.", conduite: ["Référer pour avis médical"], meds: [], source: "Ord. 17" }
      }
    }
  },

  {
    id: "diarrhee_adu", groupe: "Adulte",
    titre: "Diarrhée de l'adulte",
    sous: "Ord. 18",
    debut: "da0",
    noeuds: {
      da0: {
        q: "Que présente le patient ?",
        options: [
          { t: "Selles profuses blanchâtres « eau de riz » + déshydratation", vers: "r_cholera" },
          { t: "Sang et/ou glaires, épreintes, ténesme, fièvre ≥ 37,5 °C", vers: "r_bacillaire" },
          { t: "Sang et/ou glaires sans fièvre", vers: "r_amibienne" },
          { t: "Vomissements après ingestion d'aliments ou de produits suspects", vers: "r_intox" },
          { t: "Diarrhée hémorragique + fièvre + vomissements (± sanglants)", vers: "r_fhv" },
          { t: "Fièvre, vomissements, pouls dissocié, durée > 15 jours", vers: "r_typhoide" },
          { t: "Amaigrissement, dermatose, fièvre, candidose buccale", vers: "r_vih" },
          { t: "Autres signes", vers: "r_ref" }
        ]
      },
      r_cholera: {
        res: {
          niveau: "urgence", titre: "Choléra suspecté", resume: "Isoler, réhydrater, antibiotique, notifier, référer.",
          conduite: ["Isoler le malade ; notifier à l'échelon supérieur", "Réhydrater (SRO et/ou Ringer lactate)", "Antibiotique : doxycycline ou ciprofloxacine", "Hygiène alimentaire et environnementale", "Référer"],
          meds: ["sro", "ciprofloxacine"], source: "Ord. 18, traitement 1",
          valider: ["Doses adultes d'antibiotique pour le choléra non précisées dans le manuel : se référer au Programme national de lutte contre les maladies diarrhéiques."]
        }
      },
      r_bacillaire: {
        res: {
          niveau: "attention", titre: "Dysenterie bacillaire", resume: "Cotrimoxazole ou ciprofloxacine 10 jours.",
          conduite: [
            "Cotrimoxazole 480 mg : 2 comprimés matin et soir pendant 10 jours, ou ciprofloxacine 500 mg matin et soir pendant 10 jours",
            "Déparasiter : tinidazole 500 mg, 4 comprimés en prise unique par jour pendant 3 jours",
            "Réhydrater (SRO)",
            "Amélioration : continuer jusqu'à l'arrêt de la dysenterie ; sinon référer"
          ],
          meds: ["ciprofloxacine", "sro"], source: "Ord. 18, traitement 3"
        }
      },
      r_amibienne: {
        res: {
          niveau: "attention", titre: "Dysenterie amibienne", resume: "Métronidazole 10 jours.",
          conduite: [
            "Métronidazole 500 mg : 1 comprimé x 3/jour pendant 10 jours, ou tinidazole 500 mg : 4 comprimés en prise unique par jour pendant 3 jours",
            "Réhydrater (SRO)",
            "Revoir après 3 jours ; encore du sang dans les selles : référer"
          ],
          meds: ["metronidazole", "sro"], source: "Ord. 18, traitement 4"
        }
      },
      r_intox: {
        res: { niveau: "attention", titre: "Intoxication alimentaire ou chimique", resume: "Voir l'ordinogramme intoxication (non intégré).", conduite: ["Réhydrater", "Référer en cas de signes de gravité ou de produit toxique"], meds: ["sro"], source: "Ord. 18 → Ord. 38 (non intégré)" }
      },
      r_fhv: {
        res: { niveau: "urgence", titre: "Fièvre hémorragique possible (Ebola…)", resume: "Isoler et informer la hiérarchie.", conduite: ["Isoler le malade, mesures de protection strictes", "Informer immédiatement la hiérarchie", "Référer"], meds: [], source: "Ord. 18" }
      },
      r_typhoide: {
        res: {
          niveau: "attention", titre: "Fièvre typhoïde possible", resume: "Ciprofloxacine 15-21 jours ou ceftriaxone 10 jours.",
          conduite: ["Ciprofloxacine 500 mg : 1 comprimé x 2/jour pendant 15 à 21 jours", "ou ceftriaxone 1 g, 2 fois par jour pendant 10 jours (relais oral si amélioration à 3 jours)", "Fièvre persistante après le 7e jour : référer"],
          meds: ["ciprofloxacine", "ceftriaxone"], source: "Ord. 18, traitement 5"
        }
      },
      r_vih: {
        res: { niveau: "attention", titre: "VIH/SIDA suspecté", resume: "Voir l'ordinogramme amaigrissement (non intégré).", conduite: ["Réhydrater", "Proposer le dépistage et référer selon le PNLS"], meds: ["sro"], source: "Ord. 18 → Ord. 22 (non intégré)" }
      },
      r_ref: {
        res: { niveau: "attention", titre: "Autres signes : référer", resume: "Pas de conduite spécifique.", conduite: ["Réhydrater si besoin", "Référer"], meds: ["sro"], source: "Ord. 18" }
      }
    }
  },

/* ============ NOUVEAUX ARBRES (v0.3) — sources : guides RDC 2016 (+ Togo pour les IST) ============ */
  {
    id: "ulcere_adu", groupe: "Adulte",
    titre: "Douleur d'estomac : gastrite / ulcère",
    sous: "RDC Méd. interne III.3 et III.4 ; Togo Ord. 23 — adulte",
    debut: "u0",
    noeuds: {
      u0: {
        q: "Y a-t-il un signe de COMPLICATION ou d'alarme ?",
        aide: "Vomissement de sang, selles noires (méléna), douleur brutale avec ventre dur « de bois », vomissements alimentaires répétés, amaigrissement, difficulté à avaler, pâleur/anémie, âge > 50 ans.",
        options: [
          { t: "Vomissement de sang ou selles noires", vers: "r_hemo" },
          { t: "Douleur brutale intense, ventre dur (perforation possible)", vers: "r_perfo" },
          { t: "Amaigrissement, difficulté à avaler, anémie, vomissements répétés ou âge > 50 ans", vers: "r_alarme" },
          { t: "Aucun de ces signes", vers: "u1" }
        ]
      },
      u1: {
        q: "Le patient prend-il des AINS (diclofénac, ibuprofène, aspirine) ou des corticoïdes ?",
        options: [
          { t: "Oui", vers: "r_aine" },
          { t: "Non", vers: "u2" }
        ]
      },
      u2: {
        q: "Quel est le type de douleur ?",
        options: [
          { t: "Brûlure épigastrique de début brutal, nausées / vomissements (alcool, épices, stress, médicament)", vers: "r_gastrite" },
          { t: "Douleur épigastrique périodique, calmée par le repas, réveil nocturne (faim douloureuse)", vers: "r_ulcere" },
          { t: "Douleur atypique (thorax, hypochondre droit, dos, après repas gras)", vers: "r_atyp" }
        ]
      },
      r_hemo: {
        res: { niveau: "urgence", titre: "Ulcère hémorragique : à référer en urgence",
          resume: "Traiter le choc, antisécrétoire IV, puis transfert.",
          conduite: ["Poser une voie veineuse, traiter le choc hypovolémique (remplissage)", "Oméprazole 80 mg par jour en IV directe (ou cimétidine IV 400 mg, 3 à 4 fois par jour)", "À jeun strict", "Référer pour endoscopie et hémostase ; chirurgie si échec ou choc non contrôlé"],
          meds: ["omeprazole"], source: "RDC Méd. interne III.4 (UGD compliqués : à référer)" }
      },
      r_perfo: {
        res: { niveau: "urgence", titre: "Perforation possible : urgence chirurgicale",
          resume: "Abdomen aigu : ne rien donner par la bouche, référer immédiatement.",
          conduite: ["À jeun strict, voie veineuse", "Antalgique IV", "Référer en chirurgie en urgence (le traitement de l'ulcère perforé est chirurgical)"],
          meds: [], source: "RDC Méd. interne III.4 ; Togo Ord. 23 (abdomen chirurgical : référer)" }
      },
      r_alarme: {
        res: { niveau: "attention", titre: "Signe d'alarme : référer pour endoscopie",
          resume: "Risque de cancer gastrique ou de complication : ne pas se contenter d'un traitement d'essai.",
          conduite: ["Référer pour gastroscopie avec biopsie", "NFS, recherche d'anémie", "En attendant : éviter alcool, tabac, AINS ; antiacide si douleur"],
          meds: ["antiacides"], source: "RDC Méd. interne III.3 et III.4" }
      },
      r_aine: {
        res: { niveau: "attention", titre: "Ulcère / gastrite liés aux AINS",
          resume: "Arrêter l'AINS en cause et protéger l'estomac.",
          conduite: ["ARRÊTER l'AINS (ou corticoïde) en cause", "Oméprazole 40 mg en IV directe puis 20 mg par voie orale par jour pendant 4 semaines, 30 à 60 min avant le repas", "Pansement gastrique : Alugel 3 × 15 mL par jour, 30 à 60 min après le repas", "Si stress : diazépam 10 mg par jour en 1 ou 2 prises", "Surveiller : vomissement de sang, selles noires, douleur brutale = référer", "Pas de cicatrisation après 3 à 4 mois : avis chirurgical"],
          meds: ["omeprazole", "antiacides"], source: "RDC Méd. interne III.4 (ulcères liés aux AINS)" }
      },
      r_gastrite: {
        res: { niveau: "attention", titre: "Gastrite aiguë",
          resume: "Traiter le facteur déclenchant et soulager. Éradiquer H. pylori si besoin.",
          conduite: ["Supprimer le facteur déclenchant : alcool, tabac, café, épices, AINS", "Antiacides pendant 7 à 10 jours", "Pas de réponse : anti-H2 (cimétidine ou ranitidine)", "Si Helicobacter pylori probable ou échec : oméprazole + amoxicilline + clarithromycine (ou métronidazole 500 mg 2 fois par jour), pendant 14 jours", "Vomissements : métoclopramide 10 mg en IM, jusqu'à 3 fois par jour", "Repas légers, fractionnés, peu chauds", "Pas d'amélioration ou signe d'alarme : référer"],
          meds: ["antiacides", "anti-h2", "omeprazole", "amoxicilline", "clarithromycine", "metronidazole"],
          source: "RDC Méd. interne III.3 ; Togo Ord. 23, traitement 3" }
      },
      r_ulcere: {
        res: { niveau: "attention", titre: "Ulcère gastro-duodénal probable",
          resume: "Traitement d'éradication de H. pylori puis entretien par l'oméprazole.",
          conduite: ["Oméprazole 20 mg 2 fois par jour + amoxicilline 1 g 2 fois par jour + clarithromycine 500 mg 2 fois par jour (ou métronidazole 500 mg 2 fois par jour), pendant 14 jours", "Puis oméprazole 20 mg par jour pendant 3 semaines (RDC) à 30 jours (Togo) si amélioration", "Antiacide (hydroxyde d'aluminium) à sucer au moment de la douleur", "Éviter tabac, alcool, AINS, stress ; repas légers toutes les 2 heures", "Pas d'amélioration : référer pour endoscopie"],
          meds: ["omeprazole", "amoxicilline", "clarithromycine", "metronidazole", "antiacides"],
          source: "RDC Méd. interne III.4 ; Togo Ord. 23, traitement 3" }
      },
      r_atyp: {
        res: { niveau: "attention", titre: "Douleur atypique : éliminer une autre cause",
          resume: "Penser à l'infarctus, à la colique biliaire, à la pancréatite.",
          conduite: ["Examiner : ECG si douleur thoracique ou épigastrique chez un sujet à risque", "Douleur de l'hypochondre droit, fièvre, ictère : cholécystite, référer", "Douleur transfixiante vers le dos : pancréatite, référer", "Dyspepsie sans signe d'alarme : traitement symptomatique (antiacide)"],
          meds: ["antiacides"], source: "RDC Méd. interne III.3 et III.4 (diagnostics différentiels)" }
      }
    }
  },

  {
    id: "morsure", groupe: "Tous",
    titre: "Morsure ou piqûre d'animal",
    sous: "RDC Méd. interne I.6 : chien, serpent, scorpion, araignée, abeille",
    debut: "m0",
    noeuds: {
      m0: {
        q: "Quel animal ?",
        options: [
          { t: "Chien, chat, singe, chauve-souris, autre animal mammifère (risque de rage)", vers: "r_rage" },
          { t: "Serpent", vers: "m1" },
          { t: "Scorpion", vers: "m2" },
          { t: "Araignée", vers: "m3" },
          { t: "Abeille, guêpe, frelon", vers: "m4" }
        ]
      },
      m1: {
        q: "Signes d'envenimation du serpent ?",
        aide: "Œdème qui s'étend, douleur intense, saignements, ptose des paupières, difficulté à avaler ou à respirer, hypotension, nécrose.",
        options: [
          { t: "Oui, au moins un signe", vers: "r_serpent_env" },
          { t: "Non : simples traces de crochets", vers: "r_serpent_simple" }
        ]
      },
      m2: {
        q: "Signes généraux après la piqûre de scorpion ?",
        aide: "Hypertension, salivation, sueurs, fièvre, vomissements, diarrhée, douleurs musculaires, difficulté à respirer, convulsions.",
        options: [
          { t: "Oui", vers: "r_scorp_sev" },
          { t: "Non : douleur, œdème ou rougeur locaux", vers: "r_scorp_simple" }
        ]
      },
      m3: {
        q: "Quels signes ?",
        options: [
          { t: "Douleur musculaire intense, sueurs, tachycardie (type veuve noire)", vers: "r_arai_neuro" },
          { t: "Lésion locale qui se nécrose (type recluse)", vers: "r_arai_necro" }
        ]
      },
      m4: {
        q: "Signes de réaction allergique grave ?",
        aide: "Gonflement du visage ou de la gorge, difficulté à respirer, malaise, urticaire généralisée, chute de la tension.",
        options: [
          { t: "Oui", vers: "r_anaph" },
          { t: "Non : douleur et gonflement locaux", vers: "r_hymeno_loc" }
        ]
      },
      r_rage: {
        res: { niveau: "urgence", titre: "Morsure par un mammifère : risque de rage",
          resume: "Laver la plaie tout de suite et orienter vers un centre antirabique.",
          conduite: [
            "Laver immédiatement la plaie à l'eau et au savon (plusieurs minutes), rincer, antiseptique ; ne pas suturer",
            "Prophylaxie antitétanique ; antibiotique si plaie infectée (amoxicilline + acide clavulanique)",
            "Animal inconnu ou disparu : vaccination antirabique complète",
            "Animal vivant et sain : observation vétérinaire J0, J7, J14 ; vacciner si l'animal présente des signes de rage",
            "Animal mort : envoyer le cerveau pour analyse ou vacciner",
            "Animal suspect : débuter la vaccination, à suspendre si l'animal se révèle sain",
            "Vaccin cellulaire en IM dans le deltoïde : schéma court J0 (2 injections), J7, J21 ; ou schéma long J0, J3, J7, J14, J28",
            "Morsure grave par un animal suspect : sérum antirabique homologue 20 UI/kg = {n:20} UI, en plus du vaccin",
            "Référer vers un centre antirabique"
          ],
          meds: ["amox-clav"], source: "RDC Méd. interne I.6.5 (rage)",
          valider: ["Le guide RDC ne précise pas les catégories d'exposition (léchage, griffure, morsure). Appliquer le protocole national togolais.", "Dans le schéma court, « 2 injections à J0 à deux sites » est conforme au texte RDC."] }
      },
      r_serpent_simple: {
        res: { niveau: "attention", titre: "Morsure de serpent sans signe d'envenimation",
          resume: "Pas de venin injecté dans environ 50 % des cas : surveiller.",
          conduite: ["Repos complet, immobiliser le membre avec une attelle", "Nettoyer la plaie", "Surveiller au moins 12 heures", "Prophylaxie antitétanique (vaccin et sérum antitétanique)", "Si apparition d'œdème, de saignement ou de signes nerveux : passer au traitement de l'envenimation et référer", "Absence de signes et de trouble de coagulation après 6 heures ou plus : rassurer, sortie après 12 heures"],
          meds: [], source: "RDC Méd. interne I.6.1" }
      },
      r_serpent_env: {
        res: { niveau: "urgence", titre: "Envenimation par morsure de serpent",
          resume: "Premiers gestes, voie veineuse et transfert : le sérum antivenimeux est réservé à l'hôpital.",
          conduite: ["Repos complet, immobilisation du membre, nettoyer la plaie ; ne pas inciser, ne pas aspirer", "Poser une voie veineuse périphérique", "Sérum antivenimeux : usage hospitalier uniquement, ne pas retarder le transfert", "Œdème et douleur : antalgique / anti-inflammatoire par voie orale ou IV", "Surveiller la coagulation (tube sec) ; saignement ou anémie : transfusion de sang frais", "Choc : traitement du choc ; atteinte respiratoire : ventilation assistée", "Nécrose : mise à plat des phlyctènes, détersion, pansement quotidien non occlusif", "Infection patente seulement : drainage de l'abcès ; amoxicilline + acide clavulanique 7 à 10 jours en cas de cellulite", "Prophylaxie antitétanique", "Référer"],
          meds: ["amox-clav", "paracetamol"], source: "RDC Méd. interne I.6.1" }
      },
      r_scorp_simple: {
        res: { niveau: "ok", titre: "Piqûre de scorpion : envenimation simple",
          resume: "Soins locaux et surveillance de 12 heures.",
          conduite: ["Repos complet, nettoyer la plaie", "Antalgique par voie orale", "Douleur intense : lidocaïne 1 % en infiltration autour du point de piqûre", "Observer pendant 12 heures", "Prophylaxie antitétanique", "Enfant de moins de 5 ans : surveiller de près"],
          meds: ["paracetamol"], source: "RDC Méd. interne I.6.2.A" }
      },
      r_scorp_sev: {
        res: { niveau: "urgence", titre: "Piqûre de scorpion : envenimation sévère",
          resume: "Traitement des symptômes et transfert.",
          conduite: ["Sérum antivenimeux : usage hospitalier (efficacité discutée) : référer", "Vomissements, diarrhée, sueurs : prévenir la déshydratation (SRO)", "Douleur musculaire : gluconate de calcium 10 % en IV lente (10 à 20 minutes) : 5 mL enfant, 10 mL adulte", "Convulsions : diazépam avec précaution", "Surveiller la tension, la respiration, la conscience", "Référer"],
          meds: ["gluconate-calcium", "sro", "diazepam"], source: "RDC Méd. interne I.6.2.B" }
      },
      r_arai_neuro: {
        res: { niveau: "attention", titre: "Morsure d'araignée : syndrome neurologique",
          resume: "Évolution favorable en quelques jours.",
          conduite: ["Repos complet, nettoyer la plaie", "Antalgique par voie orale", "Spasme musculaire : gluconate de calcium 10 % en IV lente : 5 mL enfant, 10 mL adulte", "Prophylaxie antitétanique", "Les signes évoluent pendant 24 heures puis disparaissent en quelques jours"],
          meds: ["gluconate-calcium", "paracetamol"], source: "RDC Méd. interne I.6.3" }
      },
      r_arai_necro: {
        res: { niveau: "attention", titre: "Morsure d'araignée : syndrome nécrotique",
          resume: "Soins locaux, ne pas inciser la nécrose.",
          conduite: ["Repos, nettoyer la plaie", "Antalgique par voie orale", "Prophylaxie antitétanique", "Débridement ou incision de la nécrose : DÉCONSEILLÉS", "Ictère ou urines foncées (hémolyse) : référer en urgence"],
          meds: ["paracetamol"], source: "RDC Méd. interne I.6.3" }
      },
      r_anaph: {
        res: { niveau: "urgence", titre: "Réaction anaphylactique après piqûre",
          resume: "Adrénaline IM sans attendre.",
          conduite: ["Adrénaline IM solution non diluée à 1 mg/mL : moins de 6 ans 0,15 mL ; 6 à 12 ans 0,3 mL ; plus de 12 ans et adulte 0,5 mL", "Sans amélioration : répéter après 5 minutes", "Collapsus ou non-réponse à l'IM : voie veineuse et adrénaline IV", "Allonger le patient, jambes surélevées ; oxygène si disponible", "Référer"],
          meds: ["adrenaline"], source: "RDC Méd. interne I.6.4",
          valider: "Les tranches d'âge 6 ans et 12 ans se chevauchent dans le guide ; la calculatrice les sépare par l'âge saisi." }
      },
      r_hymeno_loc: {
        res: { niveau: "ok", titre: "Piqûre d'abeille, de guêpe ou de frelon : réaction locale",
          resume: "Soins locaux.",
          conduite: ["Retirer le dard (abeille)", "Laver à l'eau et au savon", "Lotion à la calamine si démangeaison", "Antalgique par voie orale si besoin", "Surveiller 1 heure l'apparition de signes allergiques"],
          meds: ["paracetamol"], source: "RDC Méd. interne I.6.4" }
      }
    }
  },

  {
    id: "diabete", groupe: "Tous",
    titre: "Diabète",
    sous: "RDC Méd. interne V.2 ; Togo Ord. 31 (suspicion de diabète : référer)",
    debut: "d0",
    noeuds: {
      d0: {
        q: "Quelle est la situation ?",
        options: [
          { t: "Patient inconscient, convulsions, ou glycémie < 2,2 mmol/L (40 mg/dL)", vers: "d_hypo_q" },
          { t: "Vomissements, douleur abdominale, respiration ample et rapide, haleine acétonique, déshydratation", vers: "r_acido" },
          { t: "Sueurs, tremblements, vertiges chez un diabétique traité", vers: "d_hypo_q" },
          { t: "Soif, urines abondantes, amaigrissement, fatigue : suspicion de diabète", vers: "d_diag" },
          { t: "Diabète connu : suivi / traitement", vers: "d_suivi" }
        ]
      },
      d_hypo_q: {
        q: "Le patient est-il conscient et capable d'avaler ?",
        options: [
          { t: "Oui", vers: "r_hypo_cons" },
          { t: "Non (inconscient ou convulsions)", vers: "r_hypo_inc" }
        ]
      },
      d_diag: {
        q: "Glycémie disponible ?",
        aide: "Diagnostic : glycémie à jeun ≥ 126 mg/dL (7 mmol/L) à 2 reprises, ou glycémie quelconque > 200 mg/dL (11,1 mmol/L) chez un patient symptomatique.",
        options: [
          { t: "Oui, glycémie ≥ seuil", vers: "d_type" },
          { t: "Oui, glycémie en dessous du seuil", vers: "r_dnorm" },
          { t: "Non disponible", vers: "r_dnd" }
        ]
      },
      d_type: {
        q: "Quel type de patient ?",
        options: [
          { t: "Enfant, adolescent ou adulte jeune, maigre, début brutal (type 1)", vers: "r_dt1" },
          { t: "Adulte, souvent en surpoids, début progressif (type 2)", vers: "d_suivi" }
        ]
      },
      d_suivi: {
        q: "Patient diabétique de type 2 : situation ?",
        options: [
          { t: "Traitement à débuter, patient non obèse", vers: "r_dt2_glib" },
          { t: "Traitement à débuter, patient obèse", vers: "r_dt2_met" },
          { t: "Glycémie non contrôlée sous 15 mg de glibenclamide", vers: "r_dt2_assoc" },
          { t: "Plaie du pied, infection, complication grave", vers: "r_dcompl" }
        ]
      },
      r_hypo_cons: {
        res: { niveau: "attention", titre: "Hypoglycémie : patient conscient",
          resume: "Sucre tout de suite, puis repas.",
          conduite: ["Arrêter l'activité physique", "15 g de glucose : 3 à 4 morceaux de sucre, ou 2 à 3 cuillères à café de confiture, ou 1 verre de lait ou de jus de fruit, ou 1 cuillère à soupe de miel", "Puis un repas", "Rechercher la cause : dose excessive de sulfamide ou d'insuline, repas sauté, alcool, effort", "Revoir la dose du traitement et éduquer le patient"],
          meds: [], source: "RDC Méd. interne, hypoglycémie (D.1)" }
      },
      r_hypo_inc: {
        res: { niveau: "urgence", titre: "Hypoglycémie : patient inconscient",
          resume: "Glucose IV.",
          conduite: ["Glycémie capillaire si possible, sans retarder le traitement", "Sérum glucosé 10 % IV 500 mL, puis perfusion de glucosé 5 % ou 10 % 500 mL toutes les 4 heures jusqu'à ce que le patient mange", "Alternative : glucagon 1 mg en IM ou sous-cutané", "Pas de voie veineuse : sonde nasogastrique d'alimentation", "Hospitaliser (surtout si sulfamide à longue durée d'action)"],
          meds: ["sgh10"], source: "RDC Méd. interne, hypoglycémie (D.1)" }
      },
      r_acido: {
        res: { niveau: "urgence", titre: "Acidocétose diabétique probable",
          resume: "Urgence hospitalière : référer sans délai.",
          conduite: ["Référer en urgence, accompagné", "Glycémie et bandelette urinaire (glycosurie, acétonurie) si disponible, avant le départ", "Ne pas démarrer l\'insuline ni le potassium en USP : protocole hospitalier", "Rechercher le facteur déclenchant (infection, arrêt de l\'insuline)"],
          meds: [], source: "RDC Méd. interne, coma acido-cétosique (D.2) ; conduite retenue par le validateur : référer" }
      },
      r_dt1: {
        res: { niveau: "urgence", titre: "Diabète de type 1 probable",
          resume: "L'insuline est toujours indiquée : référer.",
          conduite: ["Débuter l'insuline (indiquée dans tous les cas de type 1)", "Référer pour mise en route du traitement et éducation", "Surveiller l'hypoglycémie"],
          meds: [], source: "RDC Méd. interne, indications de l'insuline" }
      },
      r_dnorm: {
        res: { niveau: "ok", titre: "Glycémie sous le seuil diagnostique",
          resume: "Contrôler si symptômes persistants.",
          conduite: ["Répéter la glycémie à jeun si les symptômes persistent", "Conseils d'hygiène de vie", "Rechercher d'autres causes de soif et d'amaigrissement"],
          meds: [], source: "RDC Méd. interne V.2" }
      },
      r_dnd: {
        res: { niveau: "attention", titre: "Suspicion de diabète sans glycémie",
          resume: "Confirmer par une glycémie avant tout traitement.",
          conduite: ["Faire la glycémie (laboratoire ou bandelette)", "Si impossible : référer", "Glycosurie à la bandelette : orientation seulement"],
          meds: [], source: "RDC Méd. interne V.2 ; Togo Ord. 31 (suspicion de diabète : référer)" }
      },
      r_dt2_glib: {
        res: { niveau: "attention", titre: "Diabète de type 2 : patient non obèse",
          resume: "Régime, activité physique et sulfamide.",
          conduite: ["Régime et activité physique pour tous les patients", "Glibenclamide : débuter à 5 mg le matin, 20 à 30 min avant le repas ; augmenter de 5 mg toutes les 2 semaines ; maximum 15 mg par jour", "Éduquer sur l'hypoglycémie", "Aspirine à faible dose possible pour prévenir les complications cardiovasculaires (selon le guide)", "Contrôle de la glycémie régulier"],
          meds: ["glibenclamide", "aspirine"], source: "RDC Méd. interne V.2, traitement du type 2" }
      },
      r_dt2_met: {
        res: { niveau: "attention", titre: "Diabète de type 2 : patient obèse",
          resume: "Régime, activité physique et metformine.",
          conduite: ["Régime et activité physique", "Metformine : débuter à 500 mg 2 fois par jour, augmenter de 500 mg toutes les 2 semaines ; maximum 2 g par jour", "Contre-indiquée en cas d'insuffisance rénale ou hépatique", "Si insuffisant : ajouter le glibenclamide"],
          meds: ["metformine", "glibenclamide"], source: "RDC Méd. interne V.2, traitement du type 2" }
      },
      r_dt2_assoc: {
        res: { niveau: "attention", titre: "Diabète de type 2 non contrôlé",
          resume: "Associer la metformine, puis l'insuline.",
          conduite: ["Glibenclamide 15 mg par jour insuffisant : associer la metformine (débuter à 500 mg 2 fois par jour)", "Toujours insuffisant : insuline, avec arrêt du glibenclamide (ne pas associer à l'insuline)", "Insuline surtout chez le sujet âgé ou en cas d'insuffisance rénale ou hépatique", "Référer pour mise en route de l'insuline"],
          meds: ["metformine", "glibenclamide"], source: "RDC Méd. interne V.2" }
      },
      r_dcompl: {
        res: { niveau: "attention", titre: "Complication du diabète",
          resume: "Référer ; infection : traiter et surveiller la glycémie.",
          conduite: ["Plaie du pied : nettoyage, pansement, antibiotique si infection, ne pas marcher sur le pied", "Infection (urinaire, pulmonaire, cutanée) : traiter en surveillant la glycémie", "Signes de gravité (confusion, vomissements, déshydratation) : référer", "Rétinopathie, néphropathie, neuropathie : référer"],
          meds: ["amox-clav"], source: "RDC Méd. interne V.2 (complications)" }
      }
    }
  },

  {
    "id": "hta_adu",
    "groupe": "Adulte",
    "titre": "Hypertension artérielle",
    "sous": "Livre « Prise en charge HTA » (Cardiologie) ; HAS 2005, ESH 2007",
    "debut": "h00",
    "noeuds": {
      "h00": {
        "q": "Femme enceinte ?",
        "aide": "Le livre fourni traite l'HTA de l'adulte en dehors de la grossesse.",
        "options": [
          {
            "t": "Oui",
            "vers": "r_gross"
          },
          {
            "t": "Non (ou patient de sexe masculin)",
            "vers": "h0"
          }
        ]
      },
      "h0": {
        "q": "Valeur de la tension artérielle (position assise, après 5 minutes de repos, brassard adapté) ?",
        "aide": "HTA : PAS ≥ 140 et/ou PAD ≥ 90 mmHg (14/9 cmHg), constatée à au moins 2 consultations. Brassard trop serré : tension surestimée ; trop lâche : sous-estimée. HTA systolique isolée (PAS ≥ 140 et PAD < 90) : classer selon la PAS.",
        "options": [
          {
            "t": "≥ 180 / 110 mmHg (grade 3, sévère)",
            "vers": "h1"
          },
          {
            "t": "160-179 / 100-109 mmHg (grade 2, modérée)",
            "vers": "hc2"
          },
          {
            "t": "140-159 / 90-99 mmHg (grade 1, légère)",
            "vers": "hc1"
          },
          {
            "t": "130-139 / 85-89 mmHg (normale haute)",
            "vers": "r_haute"
          },
          {
            "t": "Moins de 130 / 85 mmHg (normale ou optimale)",
            "vers": "r_normal"
          }
        ]
      },
      "h1": {
        "q": "Signes de souffrance d'organe ?",
        "aide": "Neurologiques : céphalées intenses récentes, trouble de la vigilance, baisse de la vue, déficit (AVC). Cardiaques : essoufflement (insuffisance ventriculaire gauche), douleur thoracique (angor). Rénaux : urines très abondantes, soif, déshydratation. Confirmer la mesure après 15 minutes de repos allongé, au calme.",
        "options": [
          {
            "t": "Oui, au moins un",
            "vers": "r_urg"
          },
          {
            "t": "Non",
            "vers": "h1b"
          }
        ]
      },
      "h1b": {
        "q": "Le patient est-il déjà traité pour une HTA ?",
        "options": [
          {
            "t": "Oui (hypertendu connu)",
            "vers": "r_poussee"
          },
          {
            "t": "Non (HTA découverte)",
            "vers": "hc3"
          }
        ]
      },
      "hc1": {
        "q": "La tension élevée est-elle confirmée ?",
        "aide": "Au moins 2 consultations (examens répétés), ou mesure ambulatoire sur 24 h, ou automesure : 3 jours consécutifs, 3 mesures le matin avant les médicaments et 3 le soir ; une moyenne des 18 mesures ≤ 135/85 mmHg est normale.",
        "options": [
          {
            "t": "Oui, confirmée",
            "vers": "hr1"
          },
          {
            "t": "Non, ou une seule mesure",
            "vers": "r_confirmer"
          }
        ]
      },
      "hc2": {
        "q": "La tension élevée est-elle confirmée ?",
        "aide": "Au moins 2 consultations (examens répétés), ou mesure ambulatoire sur 24 h, ou automesure : 3 jours consécutifs, 3 mesures le matin avant les médicaments et 3 le soir ; une moyenne des 18 mesures ≤ 135/85 mmHg est normale.",
        "options": [
          {
            "t": "Oui, confirmée",
            "vers": "hr2"
          },
          {
            "t": "Non, ou une seule mesure",
            "vers": "r_confirmer"
          }
        ]
      },
      "hc3": {
        "q": "La tension élevée est-elle confirmée ?",
        "aide": "Au moins 2 consultations ; confirmer après 15 minutes de repos allongé.",
        "options": [
          {
            "t": "Oui, confirmée",
            "vers": "hp",
            "memo": "Grade 3 : risque cardiovasculaire élevé, traitement médicamenteux d'emblée."
          },
          {
            "t": "Non, ou une seule mesure",
            "vers": "r_confirmer"
          }
        ]
      },
      "hr1": {
        "q": "Facteurs de risque associés ?",
        "aide": "Facteurs de risque : âge > 50 ans (homme) ou > 60 ans (femme) ; tabac ; infarctus ou mort subite précoce chez un parent (père < 55 ans, mère < 65 ans) ; cholestérol LDL ≥ 1,60 g/L ou HDL ≤ 0,40 g/L ; (diabète compte à part). Autres : obésité abdominale (tour de taille > 102 cm homme, > 88 cm femme), sédentarité, alcool excessif.",
        "options": [
          {
            "t": "Aucun facteur de risque",
            "vers": "r_faible"
          },
          {
            "t": "1 ou 2 facteurs de risque",
            "vers": "r_moyen"
          },
          {
            "t": "3 facteurs ou plus, ou diabète, ou atteinte d'organe (cœur, rein, cerveau), ou maladie cardiovasculaire / rénale",
            "vers": "hp",
            "memo": "Risque cardiovasculaire élevé : traitement médicamenteux d'emblée."
          }
        ]
      },
      "hr2": {
        "q": "Facteurs de risque associés ?",
        "aide": "Facteurs de risque : âge > 50 ans (homme) ou > 60 ans (femme) ; tabac ; infarctus ou mort subite précoce chez un parent (père < 55 ans, mère < 65 ans) ; cholestérol LDL ≥ 1,60 g/L ou HDL ≤ 0,40 g/L ; (diabète compte à part). Autres : obésité abdominale (tour de taille > 102 cm homme, > 88 cm femme), sédentarité, alcool excessif.",
        "options": [
          {
            "t": "Aucun, ou 1 à 2 facteurs de risque",
            "vers": "r_moyen"
          },
          {
            "t": "3 facteurs ou plus, ou diabète, ou atteinte d'organe (cœur, rein, cerveau), ou maladie cardiovasculaire / rénale",
            "vers": "hp",
            "memo": "Risque cardiovasculaire élevé : traitement médicamenteux d'emblée."
          }
        ]
      },
      "hp": {
        "q": "Quel profil pour choisir le traitement ?",
        "options": [
          {
            "t": "HTA non compliquée",
            "vers": "r_nc"
          },
          {
            "t": "Sujet âgé, ou HTA systolique isolée",
            "vers": "r_age"
          },
          {
            "t": "Diabète",
            "vers": "r_diab"
          },
          {
            "t": "Insuffisance rénale",
            "vers": "r_ir"
          },
          {
            "t": "Angor, ou infarctus ancien",
            "vers": "r_coro"
          },
          {
            "t": "Insuffisance cardiaque",
            "vers": "r_ic"
          },
          {
            "t": "Hypertrophie du ventricule gauche, ou antécédent d'AVC",
            "vers": "r_avc"
          }
        ]
      },
      "r_normal": {
        "res": {
          "niveau": "ok",
          "titre": "Tension normale ou optimale",
          "resume": "Pas de traitement.",
          "conduite": [
            "Conseils d'hygiène de vie",
            "Contrôle régulier de la tension"
          ],
          "meds": [],
          "source": "Livre « Prise en charge HTA » (Cardiologie, p. 188-225 ; HAS 2005, ESH 2007)"
        }
      },
      "r_haute": {
        "res": {
          "niveau": "ok",
          "titre": "Tension normale haute (130-139 / 85-89 mmHg)",
          "resume": "Pas de médicament en général ; surveiller le risque cardiovasculaire global.",
          "conduite": [
            "Pas de traitement antihypertenseur en l'absence de maladie associée",
            "Prendre en charge le risque cardiovasculaire global (diabète, tabac, cholestérol, obésité)",
            "Hygiène de vie : sel < 6 g par jour (éviter charcuterie, conserves, plats préparés) ; fruits et légumes ; perte de poids si surpoids ; alcool limité (pas plus de 2 verres de vin ou de bière par jour, 1 jour d'abstinence par semaine) ; marche soutenue 30 min, 3 fois par semaine ; arrêt du tabac",
            "Contrôle régulier de la tension"
          ],
          "meds": [],
          "source": "Livre « Prise en charge HTA » (Cardiologie, p. 188-225 ; HAS 2005, ESH 2007)"
        }
      },
      "r_confirmer": {
        "res": {
          "niveau": "attention",
          "titre": "HTA non confirmée",
          "resume": "Ne pas traiter sur une seule mesure : confirmer.",
          "conduite": [
            "Remesurer après 5 minutes de repos assis, avec un brassard adapté, sur 2 consultations au moins",
            "Automesure : 3 jours consécutifs, 3 mesures le matin avant les médicaments et 3 le soir ; moyenne ≤ 135/85 mmHg = tension normale",
            "Entre-temps : hygiène de vie",
            "Revoir pour confirmation, puis suivre ce schéma"
          ],
          "meds": [],
          "source": "Livre « Prise en charge HTA » (Cardiologie, p. 188-225 ; HAS 2005, ESH 2007)"
        }
      },
      "r_urg": {
        "res": {
          "niveau": "urgence",
          "titre": "Urgence hypertensive avec souffrance d'organe",
          "resume": "Hospitalisation en soins intensifs : référer sans délai.",
          "conduite": [
            "Allonger le patient au calme, mesure confirmée après 15 minutes de repos",
            "Chercher un facteur déclenchant : arrêt du traitement, douleur aiguë, infection, stress, AVC, épistaxis, prise d'AINS",
            "HTA maligne : PAD > 130 mmHg avec signe de souffrance viscérale",
            "Le traitement est hospitalier, sous contrôle tensionnel rapproché : référer en urgence"
          ],
          "meds": [],
          "source": "Livre « Prise en charge HTA » (Cardiologie, p. 188-225 ; HAS 2005, ESH 2007)"
        }
      },
      "r_poussee": {
        "res": {
          "niveau": "attention",
          "titre": "Poussée hypertensive chez un hypertendu connu, sans souffrance d'organe",
          "resume": "Repos ; en général pas de traitement d'urgence ; revoir le traitement de fond.",
          "conduite": [
            "Repos ; confirmer la mesure après 15 minutes allongé, au calme",
            "Pas de traitement d'urgence dans la plupart des cas",
            "Chercher un facteur déclenchant : arrêt du traitement, douleur, infection, stress, AINS, épistaxis",
            "Revoir le traitement de fond (observance, doses, classes) ; consultation rapide chez le médecin",
            "Apparition de céphalées intenses, trouble de la vue, douleur thoracique, déficit : référer en urgence"
          ],
          "meds": [],
          "source": "Livre « Prise en charge HTA » (Cardiologie, p. 188-225 ; HAS 2005, ESH 2007)"
        }
      },
      "r_gross": {
        "res": {
          "niveau": "attention",
          "titre": "HTA et grossesse",
          "resume": "Référer pour le suivi obstétrical ; éviter IEC et sartans.",
          "conduite": [
            "Tension ≥ 140/90 pendant la grossesse : référer pour suivi obstétrical",
            "Médicament autorisé : méthyldopa (Aldomet) 250 mg 2 ou 3 fois par jour, à augmenter progressivement",
            "IEC et ARA II (sartans) : contre-indiqués pendant la grossesse et l'allaitement",
            "Prazosine, minoxidil, urapidil : innocuité non démontrée",
            "Céphalées, œdèmes, protéinurie, convulsions : urgence obstétricale, référer"
          ],
          "meds": [
            "antihta"
          ],
          "source": "Livre « Prise en charge HTA » (Cardiologie, p. 188-225 ; HAS 2005, ESH 2007)",
          "valider": "Le livre fourni traite l'HTA en dehors de la grossesse : cette conduite reprend ses fiches médicaments et le guide RDC."
        }
      },
      "r_faible": {
        "res": {
          "niveau": "attention",
          "titre": "HTA grade 1, risque cardiovasculaire faible",
          "resume": "Hygiène de vie pendant 6 mois ; médicament si l'objectif n'est pas atteint.",
          "conduite": [
            "Bilan initial : bandelette urinaire (sang, protéines), glycémie ; si disponible : créatininémie, kaliémie, cholestérol (LDL, HDL), triglycérides, ECG",
            "Hygiène de vie : sel < 6 g par jour (éviter charcuterie, conserves, plats préparés) ; fruits et légumes ; perte de poids si surpoids ; alcool limité (pas plus de 2 verres de vin ou de bière par jour, 1 jour d'abstinence par semaine) ; marche soutenue 30 min, 3 fois par semaine ; arrêt du tabac",
            "Contrôle de la tension régulier pendant 6 mois",
            "Objectif : < 140/90 mmHg",
            "Si l'objectif n'est pas atteint à 6 mois : traitement médicamenteux (monothérapie ou association fixe à faible dose), puis suivre l'étape « HTA non compliquée »",
            "Revoir à 4 semaines. Objectif atteint et bien toléré : poursuivre. Baisse de la PAS < 10 % ou effet secondaire gênant : changer de classe. Baisse > 10 % mais objectif non atteint : augmenter la dose ou passer à une bithérapie",
            "Toujours pas à l'objectif après 4 semaines : trithérapie avec un diurétique thiazidique ; si la tension reste élevée (HTA résistante) : chercher une HTA secondaire et référer",
            "Une fois contrôlée : tension tous les 3 à 6 mois ; bandelette urinaire tous les 12 mois ; créatinine et kaliémie tous les 1 à 2 ans (et 7 à 15 jours après le début d'un diurétique ou d'un IEC / ARA II) ; glycémie, lipides et ECG tous les 3 ans",
            "Rappeler à chaque consultation : traitement souvent à vie, bonne observance, hygiène de vie"
          ],
          "meds": [
            "antihta"
          ],
          "source": "Livre « Prise en charge HTA » (Cardiologie, p. 188-225 ; HAS 2005, ESH 2007)"
        }
      },
      "r_moyen": {
        "res": {
          "niveau": "attention",
          "titre": "HTA de risque cardiovasculaire moyen",
          "resume": "Hygiène de vie pendant 1 à 3 mois ; médicament si l'objectif n'est pas atteint.",
          "conduite": [
            "Bilan initial : bandelette urinaire (sang, protéines), glycémie ; si disponible : créatininémie, kaliémie, cholestérol (LDL, HDL), triglycérides, ECG",
            "Hygiène de vie : sel < 6 g par jour (éviter charcuterie, conserves, plats préparés) ; fruits et légumes ; perte de poids si surpoids ; alcool limité (pas plus de 2 verres de vin ou de bière par jour, 1 jour d'abstinence par semaine) ; marche soutenue 30 min, 3 fois par semaine ; arrêt du tabac",
            "Objectif : < 140/90 mmHg",
            "Si l'objectif n'est pas atteint après 1 à 3 mois d'hygiène de vie : traitement médicamenteux (monothérapie ou association fixe à faible dose)",
            "Classes possibles si HTA non compliquée : diurétique thiazidique, IEC, ARA II, anticalcique dihydropyridine ; bêtabloquant seulement si tachycardie ou angor",
            "Revoir à 4 semaines. Objectif atteint et bien toléré : poursuivre. Baisse de la PAS < 10 % ou effet secondaire gênant : changer de classe. Baisse > 10 % mais objectif non atteint : augmenter la dose ou passer à une bithérapie",
            "Toujours pas à l'objectif après 4 semaines : trithérapie avec un diurétique thiazidique ; si la tension reste élevée (HTA résistante) : chercher une HTA secondaire et référer",
            "Une fois contrôlée : tension tous les 3 à 6 mois ; bandelette urinaire tous les 12 mois ; créatinine et kaliémie tous les 1 à 2 ans (et 7 à 15 jours après le début d'un diurétique ou d'un IEC / ARA II) ; glycémie, lipides et ECG tous les 3 ans",
            "Rappeler à chaque consultation : traitement souvent à vie, bonne observance, hygiène de vie"
          ],
          "meds": [
            "antihta"
          ],
          "source": "Livre « Prise en charge HTA » (Cardiologie, p. 188-225 ; HAS 2005, ESH 2007)"
        }
      },
      "r_nc": {
        "res": {
          "niveau": "attention",
          "titre": "HTA non compliquée, risque élevé",
          "resume": "Traitement d'emblée : monothérapie ou association fixe à faible dose.",
          "conduite": [
            "Bilan initial : bandelette urinaire (sang, protéines), glycémie ; si disponible : créatininémie, kaliémie, cholestérol (LDL, HDL), triglycérides, ECG",
            "Hygiène de vie : sel < 6 g par jour (éviter charcuterie, conserves, plats préparés) ; fruits et légumes ; perte de poids si surpoids ; alcool limité (pas plus de 2 verres de vin ou de bière par jour, 1 jour d'abstinence par semaine) ; marche soutenue 30 min, 3 fois par semaine ; arrêt du tabac",
            "Étape 1 : une monothérapie à faible dose (diurétique thiazidique, IEC, ARA II ou anticalcique dihydropyridine) ou une association fixe à faible dose",
            "Bêtabloquant : pas de monothérapie en 1re intention en dehors de la tachycardie de repos, de l'angor ou de la cardiopathie ischémique",
            "Associations préférentielles : anticalcique + IEC (ou ARA II) ; thiazidique + IEC (ou ARA II) ; bêtabloquant + thiazidique ; bêtabloquant + anticalcique dihydropyridine ; anticalcique + thiazidique",
            "Objectif : < 140/90 mmHg",
            "Revoir à 4 semaines. Objectif atteint et bien toléré : poursuivre. Baisse de la PAS < 10 % ou effet secondaire gênant : changer de classe. Baisse > 10 % mais objectif non atteint : augmenter la dose ou passer à une bithérapie",
            "Toujours pas à l'objectif après 4 semaines : trithérapie avec un diurétique thiazidique ; si la tension reste élevée (HTA résistante) : chercher une HTA secondaire et référer",
            "Une fois contrôlée : tension tous les 3 à 6 mois ; bandelette urinaire tous les 12 mois ; créatinine et kaliémie tous les 1 à 2 ans (et 7 à 15 jours après le début d'un diurétique ou d'un IEC / ARA II) ; glycémie, lipides et ECG tous les 3 ans",
            "Rappeler à chaque consultation : traitement souvent à vie, bonne observance, hygiène de vie"
          ],
          "meds": [
            "antihta"
          ],
          "source": "Livre « Prise en charge HTA » (Cardiologie, p. 188-225 ; HAS 2005, ESH 2007)"
        }
      },
      "r_age": {
        "res": {
          "niveau": "attention",
          "titre": "HTA du sujet âgé ou HTA systolique isolée",
          "resume": "Diurétique thiazidique ou anticalcique dihydropyridine de longue durée.",
          "conduite": [
            "Bilan initial : bandelette urinaire (sang, protéines), glycémie ; si disponible : créatininémie, kaliémie, cholestérol (LDL, HDL), triglycérides, ECG",
            "Hygiène de vie : sel < 6 g par jour (éviter charcuterie, conserves, plats préparés) ; fruits et légumes ; perte de poids si surpoids ; alcool limité (pas plus de 2 verres de vin ou de bière par jour, 1 jour d'abstinence par semaine) ; marche soutenue 30 min, 3 fois par semaine ; arrêt du tabac",
            "Classes préférentielles : diurétique thiazidique ; anticalcique dihydropyridine de longue durée d'action",
            "Commencer à faible dose ; chercher une hypotension orthostatique (tension debout) à chaque visite",
            "Objectif : < 140/90 mmHg",
            "Revoir à 4 semaines. Objectif atteint et bien toléré : poursuivre. Baisse de la PAS < 10 % ou effet secondaire gênant : changer de classe. Baisse > 10 % mais objectif non atteint : augmenter la dose ou passer à une bithérapie",
            "Toujours pas à l'objectif après 4 semaines : trithérapie avec un diurétique thiazidique ; si la tension reste élevée (HTA résistante) : chercher une HTA secondaire et référer",
            "Une fois contrôlée : tension tous les 3 à 6 mois ; bandelette urinaire tous les 12 mois ; créatinine et kaliémie tous les 1 à 2 ans (et 7 à 15 jours après le début d'un diurétique ou d'un IEC / ARA II) ; glycémie, lipides et ECG tous les 3 ans",
            "Rappeler à chaque consultation : traitement souvent à vie, bonne observance, hygiène de vie"
          ],
          "meds": [
            "antihta"
          ],
          "source": "Livre « Prise en charge HTA » (Cardiologie, p. 188-225 ; HAS 2005, ESH 2007)"
        }
      },
      "r_diab": {
        "res": {
          "niveau": "attention",
          "titre": "HTA et diabète",
          "resume": "IEC ou ARA II en 1er choix ; objectif plus bas.",
          "conduite": [
            "Bilan initial : bandelette urinaire (sang, protéines), glycémie ; si disponible : créatininémie, kaliémie, cholestérol (LDL, HDL), triglycérides, ECG",
            "Classes : IEC ou ARA II (surtout si néphropathie : protéinurie) ; diurétique thiazidique ; diurétique de l'anse en cas d'insuffisance rénale sévère",
            "Objectif : < 130/80 mmHg",
            "Contrôler la créatinine et la kaliémie avant, puis 7 à 15 jours après le début d'un IEC / ARA II ; référer si possible pour le suivi du diabète",
            "Revoir à 4 semaines. Objectif atteint et bien toléré : poursuivre. Baisse de la PAS < 10 % ou effet secondaire gênant : changer de classe. Baisse > 10 % mais objectif non atteint : augmenter la dose ou passer à une bithérapie",
            "Toujours pas à l'objectif après 4 semaines : trithérapie avec un diurétique thiazidique ; si la tension reste élevée (HTA résistante) : chercher une HTA secondaire et référer",
            "Une fois contrôlée : tension tous les 3 à 6 mois ; bandelette urinaire tous les 12 mois ; créatinine et kaliémie tous les 1 à 2 ans (et 7 à 15 jours après le début d'un diurétique ou d'un IEC / ARA II) ; glycémie, lipides et ECG tous les 3 ans",
            "Rappeler à chaque consultation : traitement souvent à vie, bonne observance, hygiène de vie"
          ],
          "meds": [
            "antihta"
          ],
          "source": "Livre « Prise en charge HTA » (Cardiologie, p. 188-225 ; HAS 2005, ESH 2007)"
        }
      },
      "r_ir": {
        "res": {
          "niveau": "attention",
          "titre": "HTA et insuffisance rénale",
          "resume": "IEC / ARA II avec surveillance ; diurétique de l'anse si insuffisance sévère ; référer.",
          "conduite": [
            "Objectif : < 130/80 mmHg (< 125/75 si protéinurie > 1 g par 24 h)",
            "Diurétique thiazidique actif jusqu'à une clairance de la créatinine de 30 mL/min ; en dessous : diurétique de l'anse (furosémide)",
            "Diurétiques épargneurs de potassium (spironolactone, amiloride) : contre-indiqués",
            "IEC / ARA II : surveiller de près la kaliémie et la créatinine",
            "Éviter les AINS",
            "Référer pour le suivi néphrologique",
            "Revoir à 4 semaines. Objectif atteint et bien toléré : poursuivre. Baisse de la PAS < 10 % ou effet secondaire gênant : changer de classe. Baisse > 10 % mais objectif non atteint : augmenter la dose ou passer à une bithérapie",
            "Toujours pas à l'objectif après 4 semaines : trithérapie avec un diurétique thiazidique ; si la tension reste élevée (HTA résistante) : chercher une HTA secondaire et référer",
            "Une fois contrôlée : tension tous les 3 à 6 mois ; bandelette urinaire tous les 12 mois ; créatinine et kaliémie tous les 1 à 2 ans (et 7 à 15 jours après le début d'un diurétique ou d'un IEC / ARA II) ; glycémie, lipides et ECG tous les 3 ans",
            "Rappeler à chaque consultation : traitement souvent à vie, bonne observance, hygiène de vie"
          ],
          "meds": [
            "antihta"
          ],
          "source": "Livre « Prise en charge HTA » (Cardiologie, p. 188-225 ; HAS 2005, ESH 2007)"
        }
      },
      "r_coro": {
        "res": {
          "niveau": "attention",
          "titre": "HTA et maladie coronaire (angor, infarctus ancien)",
          "resume": "Bêtabloquant ; référer pour avis cardiologique.",
          "conduite": [
            "Angor : bêtabloquant ; anticalcique de longue durée d'action",
            "Après infarctus : IEC et bêtabloquant",
            "Objectif : < 140/90 mmHg",
            "Référer pour avis cardiologique",
            "Revoir à 4 semaines. Objectif atteint et bien toléré : poursuivre. Baisse de la PAS < 10 % ou effet secondaire gênant : changer de classe. Baisse > 10 % mais objectif non atteint : augmenter la dose ou passer à une bithérapie",
            "Toujours pas à l'objectif après 4 semaines : trithérapie avec un diurétique thiazidique ; si la tension reste élevée (HTA résistante) : chercher une HTA secondaire et référer",
            "Une fois contrôlée : tension tous les 3 à 6 mois ; bandelette urinaire tous les 12 mois ; créatinine et kaliémie tous les 1 à 2 ans (et 7 à 15 jours après le début d'un diurétique ou d'un IEC / ARA II) ; glycémie, lipides et ECG tous les 3 ans",
            "Rappeler à chaque consultation : traitement souvent à vie, bonne observance, hygiène de vie"
          ],
          "meds": [
            "antihta"
          ],
          "source": "Livre « Prise en charge HTA » (Cardiologie, p. 188-225 ; HAS 2005, ESH 2007)"
        }
      },
      "r_ic": {
        "res": {
          "niveau": "attention",
          "titre": "HTA et insuffisance cardiaque",
          "resume": "Traitement spécialisé : référer.",
          "conduite": [
            "Classes possibles : diurétique thiazidique ou de l'anse ; IEC (1re intention) ou ARA II en cas d'intolérance ; bêtabloquant ; antialdostérone (stades III et IV)",
            "Diltiazem et vérapamil : contre-indiqués en cas d'insuffisance cardiaque décompensée",
            "Référer pour la mise en route et l'adaptation du traitement",
            "Revoir à 4 semaines. Objectif atteint et bien toléré : poursuivre. Baisse de la PAS < 10 % ou effet secondaire gênant : changer de classe. Baisse > 10 % mais objectif non atteint : augmenter la dose ou passer à une bithérapie",
            "Toujours pas à l'objectif après 4 semaines : trithérapie avec un diurétique thiazidique ; si la tension reste élevée (HTA résistante) : chercher une HTA secondaire et référer",
            "Une fois contrôlée : tension tous les 3 à 6 mois ; bandelette urinaire tous les 12 mois ; créatinine et kaliémie tous les 1 à 2 ans (et 7 à 15 jours après le début d'un diurétique ou d'un IEC / ARA II) ; glycémie, lipides et ECG tous les 3 ans",
            "Rappeler à chaque consultation : traitement souvent à vie, bonne observance, hygiène de vie"
          ],
          "meds": [
            "antihta"
          ],
          "source": "Livre « Prise en charge HTA » (Cardiologie, p. 188-225 ; HAS 2005, ESH 2007)"
        }
      },
      "r_avc": {
        "res": {
          "niveau": "attention",
          "titre": "HTA avec hypertrophie du ventricule gauche ou antécédent d'AVC",
          "resume": "ARA II ou thiazidique ; référer pour avis.",
          "conduite": [
            "Hypertrophie du ventricule gauche : ARA II ; diurétique thiazidique",
            "Antécédent d'accident vasculaire cérébral : diurétique thiazidique, seul ou avec un IEC",
            "Objectif : < 140/90 mmHg",
            "Référer pour avis spécialisé",
            "Revoir à 4 semaines. Objectif atteint et bien toléré : poursuivre. Baisse de la PAS < 10 % ou effet secondaire gênant : changer de classe. Baisse > 10 % mais objectif non atteint : augmenter la dose ou passer à une bithérapie",
            "Toujours pas à l'objectif après 4 semaines : trithérapie avec un diurétique thiazidique ; si la tension reste élevée (HTA résistante) : chercher une HTA secondaire et référer",
            "Une fois contrôlée : tension tous les 3 à 6 mois ; bandelette urinaire tous les 12 mois ; créatinine et kaliémie tous les 1 à 2 ans (et 7 à 15 jours après le début d'un diurétique ou d'un IEC / ARA II) ; glycémie, lipides et ECG tous les 3 ans",
            "Rappeler à chaque consultation : traitement souvent à vie, bonne observance, hygiène de vie"
          ],
          "meds": [
            "antihta"
          ],
          "source": "Livre « Prise en charge HTA » (Cardiologie, p. 188-225 ; HAS 2005, ESH 2007)"
        }
      }
    }
  },

  {
    id: "drepano", groupe: "Tous",
    titre: "Drépanocytose : crise douloureuse",
    sous: "RDC Pédiatrie (drépanocytose) ; Togo Ord. 21 et 23 (adulte)",
    debut: "s0",
    noeuds: {
      s0: {
        q: "Signe de GRAVITÉ ?",
        aide: "Pâleur brutale avec grosse rate (séquestration), anémie profonde, fièvre élevée, essoufflement ou douleur thoracique (syndrome thoracique aigu), déficit neurologique ou céphalée intense (AVC), érection douloureuse persistante (priapisme), urines rares.",
        options: [
          { t: "Oui, au moins un", vers: "r_grave" },
          { t: "Non", vers: "s1" }
        ]
      },
      s1: {
        q: "Âge du patient ?",
        options: [
          { t: "Enfant (moins de 15 ans)", vers: "r_cvo_enf" },
          { t: "Adulte (15 ans et plus)", vers: "r_cvo_adu" }
        ]
      },
      r_grave: {
        res: { niveau: "urgence", titre: "Crise drépanocytaire grave",
          resume: "Premiers soins, antalgique et transfert (transfusion possible).",
          conduite: ["Hydratation (boire ou perfusion), antalgique, diazépam si besoin", "Fièvre : antibiotique (ceftriaxone, ou amoxicilline + acide clavulanique), car infection fréquente", "Séquestration splénique ou anémie profonde : transfusion 20 mL de sang par kg sans dépasser 450 mL ; choc : sérum physiologique 20 mL/kg en 20 minutes = {kg:20} mL", "Syndrome thoracique ou douleur très forte non calmée : référer dans un hôpital", "Urines < 500 mL par 24 h chez l'adulte : référer"],
          meds: ["paracetamol", "ceftriaxone", "amox-clav", "diazepam"], source: "RDC Pédiatrie, drépanocytose (crises) ; Togo Ord. 21, traitement 6" }
      },
      r_cvo_enf: {
        res: { niveau: "attention", titre: "Crise vaso-occlusive de l'enfant, forme bénigne",
          resume: "Antalgique par paliers, hydratation, chaleur locale.",
          conduite: ["Paracétamol : 30 mg/kg en dose de charge ({mg:30} mg), puis 15 mg/kg toutes les 6 heures", "Douleur persistante après 30 à 45 minutes : ibuprofène 10 mg/kg par prise ({mg:10} mg), 3 prises par jour", "Douleur abdominale : antispasmodique", "Boire beaucoup d'eau ; bouillotte chaude ou massage de la zone douloureuse", "Acide folique : 2 comprimés par jour pendant la crise", "Pas d'amélioration : référer"],
          meds: ["paracetamol", "ibuprofene", "acide-folique", "penicilline-v", "amoxicilline"],
          source: "RDC Pédiatrie, drépanocytose, crise vaso-occlusive bénigne",
          valider: ["Prophylaxie entre les crises : pénicilline V jusqu'à 15 ans, acide folique, vaccination antipneumococcique."] }
      },
      r_cvo_adu: {
        res: { niveau: "attention", titre: "Crise drépanocytaire de l'adulte",
          resume: "Antalgique, acide folique, hydratation ; référer si anémie grave ou oligurie.",
          conduite: ["Acide folique 5 mg : 2 comprimés par jour", "Paracétamol 1 g 3 fois par jour, ou aspirine 1 g 3 fois par jour", "Acétylsalicylate de lysine 1 g en IV directe 2 fois par jour, puis relais oral", "Réhydratation : boire beaucoup d'eau", "Anémie grave ou diurèse < 500 mL par 24 h, ou pas d'amélioration : référer", "Fièvre : rechercher une infection (paludisme, pneumonie) et traiter"],
          meds: ["paracetamol", "aspirine", "acide-folique", "ibuprofene"],
          source: "Togo Ord. 21, traitement 6 et Ord. 23, traitement 11",
          valider: "Le manuel togolais note « ibuprofène 400 mg 2 comprimés × 2/j ??? » (point d'interrogation dans le texte) : non retenu. Le guide RDC (pédiatrie) mentionne la gestion de la douleur adulte dans le chapitre de médecine interne." }
      }
    }
  },

  {
    id: "ist_adu", groupe: "Adulte",
    titre: "Infection sexuellement transmissible (IST)",
    sous: "Togo Ord. 26, 27 et 31 : pertes vaginales, ulcérations génitales, écoulement urétral",
    debut: "i0",
    noeuds: {
      i0: {
        q: "Quel est le motif ?",
        options: [
          { t: "Pertes vaginales (femme)", vers: "i1" },
          { t: "Ulcération ou plaie génitale", vers: "i2" },
          { t: "Écoulement urétral / brûlure en urinant (homme)", vers: "r_uret" }
        ]
      },
      i1: {
        q: "Douleur du bas-ventre, fièvre > 37,5 °C et douleur à la mobilisation de l'utérus ?",
        options: [
          { t: "Oui", vers: "r_dip" },
          { t: "Non", vers: "i1b" }
        ]
      },
      i1b: {
        q: "Aspect des pertes ?",
        options: [
          { t: "Démangeaisons, pertes blanches « lait caillé »", vers: "r_candida" },
          { t: "Pertes fluides, mousseuses ou odeur de poisson pourri", vers: "r_trich" },
          { t: "Pertes purulentes nauséabondes, col inflammatoire sans ulcération", vers: "r_cervicite" },
          { t: "Col ulcéré ou saignant au contact, saignement après la ménopause", vers: "r_ref_ist" },
          { t: "Pertes blanches abondantes sans odeur, ou glaires transparentes périodiques", vers: "r_physio" }
        ]
      },
      i2: {
        q: "Quel aspect ?",
        options: [
          { t: "Plaie ou ulcération, avec ou sans ganglion inguinal", vers: "r_syph" },
          { t: "Picotement, brûlure, vésicules en bouquet", vers: "r_herpes" },
          { t: "Lésions blanchâtres, démangeaisons, mycose", vers: "r_mycose" }
        ]
      },
      r_dip: {
        res: { niveau: "attention", titre: "Maladie inflammatoire du pelvis (salpingite)",
          resume: "Triple traitement + antalgique ; traiter le partenaire.",
          conduite: ["Azithromycine 1 g (2 comprimés de 500 mg) en prise unique", "Métronidazole 250 mg : 2 comprimés matin, midi et soir pendant 10 jours", "Ibuprofène 400 mg : 2 comprimés matin et soir pendant 5 jours, au cours du repas (à éviter chez la femme enceinte)", "Femme enceinte ou allaitante : avis médical", "Traiter le ou les partenaires ; proposer le dépistage du VIH ; préservatifs", "Pas d'amélioration ou signes de péritonite : référer"],
          meds: ["azithromycine", "metronidazole", "ibuprofene"], source: "Togo Ord. 26, traitement 1 ; azithromycine selon le protocole du validateur",
          valider: "Le manuel togolais prévoit la ciprofloxacine 10 jours ; remplacée ici par l'azithromycine 1 g en prise unique. À confirmer pour la maladie inflammatoire du pelvis." }
      },
      r_candida: {
        res: { niveau: "ok", titre: "Vulvo-vaginite à candida",
          resume: "Antifongique ; revoir à 7 jours.",
          conduite: ["Nystatine 500 000 UI : 2 comprimés par voie orale matin, midi et soir pendant 10 jours", "Toilette intime à la polyvidone iodée matin et soir pendant 7 jours", "Pas d'amélioration après 7 jours : ajouter le traitement de la maladie inflammatoire du pelvis", "Traiter le ou les partenaires si symptômes"],
          meds: ["nystatine"], source: "Togo Ord. 26, traitement 2" }
      },
      r_trich: {
        res: { niveau: "attention", titre: "Trichomonase ou vaginose bactérienne",
          resume: "Nitro-imidazolé ; traiter le partenaire.",
          conduite: ["Métronidazole 250 mg : 2 comprimés par voie orale matin, midi et soir pendant 10 jours", "Ou tinidazole 500 mg : 4 comprimés en prise unique", "Toilette intime pendant 7 jours", "Pas d'amélioration après 7 jours : ajouter le traitement du candida", "Traiter le ou les partenaires ; préservatifs"],
          meds: ["metronidazole", "tinidazole", "nystatine"], source: "Togo Ord. 26, traitement 3" }
      },
      r_cervicite: {
        res: { niveau: "attention", titre: "Cervicite",
          resume: "Antibiotique + antiparasitaire + antalgique ; traiter le partenaire.",
          conduite: ["Azithromycine 1 g (2 comprimés de 500 mg) en prise unique", "Métronidazole 250 mg : 2 comprimés matin et soir pendant 10 jours", "Ibuprofène 400 mg : 2 comprimés matin et soir pendant 10 jours", "Nystatine comprimé vaginal : 1 matin et soir pendant 10 jours", "Traiter le ou les partenaires ; dépistage du VIH ; préservatifs"],
          meds: ["azithromycine", "metronidazole", "ibuprofene", "nystatine"], source: "Togo Ord. 26, traitement 4 ; azithromycine selon le protocole du validateur" }
      },
      r_physio: {
        res: { niveau: "ok", titre: "Pertes physiologiques ou glaires cervicales",
          resume: "Rassurer.", conduite: ["Rassurer la patiente", "Hygiène intime simple"], meds: [], source: "Togo Ord. 26, traitements 7 et 8" }
      },
      r_ref_ist: {
        res: { niveau: "attention", titre: "Suspicion de cancer du col ou de l'endomètre",
          resume: "Référer.", conduite: ["Référer (tamponnement vaginal si hémorragie importante)"], meds: [], source: "Togo Ord. 26, traitements 5 et 6" }
      },
      r_uret: {
        res: { niveau: "attention", titre: "Urétrite (écoulement urétral)",
          resume: "Traitement + partenaire + dépistage VIH.",
          conduite: ["Azithromycine 1 g (2 comprimés de 500 mg) en prise unique", "Tinidazole 500 mg : 4 comprimés en prise unique", "Pas d'amélioration : référer", "Conseiller les préservatifs, faire traiter le ou les partenaires, proposer le dépistage du VIH"],
          meds: ["azithromycine", "tinidazole"], source: "Togo Ord. 31, traitement 5 ; azithromycine selon le protocole du validateur" }
      },
      r_syph: {
        res: { niveau: "attention", titre: "Syphilis ou chancre mou",
          resume: "Les deux sont traités ensemble.",
          conduite: ["1er choix : benzathine pénicilline 2,4 MUI en IM unique + ciprofloxacine 500 mg, 1 comprimé 2 fois par jour pendant 15 jours", "Allergie à la pénicilline : érythromycine 500 mg, 2 comprimés matin et soir pendant 14 jours, au repas", "2e choix : doxycycline 200 mg par jour pendant 14 jours + ceftriaxone 250 mg en IM unique", "Femme enceinte : érythromycine 500 mg, 2 comprimés matin et soir pendant 14 jours", "Soins locaux : violet de gentiane 1 % ou polyvidone iodée", "Traiter le ou les partenaires ; dépistage du VIH ; préservatifs", "Pas d'amélioration après 7 jours : référer"],
          meds: ["benzathine-penicilline", "ciprofloxacine", "erythromycine", "doxycycline", "ceftriaxone"], source: "Togo Ord. 27, traitement 1",
          valider: "Doxycycline : contre-indiquée chez la femme enceinte. Dose de ceftriaxone 250 mg à valider." }
      },
      r_herpes: {
        res: { niveau: "attention", titre: "Herpès génital",
          resume: "Antiviral + soins locaux.",
          conduite: ["Badigeonner à l'éosine aqueuse 2 %, 3 fois par jour", "Acyclovir 400 mg, 2 fois par jour pendant 5 jours", "Vitamine C 1000 mg : 1 comprimé matin et midi", "Si surinfection : ajouter le traitement des ulcérations (syphilis / chancre mou)", "Préservatifs ; dépistage du VIH"],
          meds: ["acyclovir"], source: "Togo Ord. 27, traitement 2" }
      },
      r_mycose: {
        res: { niveau: "ok", titre: "Mycose cutanéo-muqueuse génitale",
          resume: "Antifongique local et oral.",
          conduite: ["Nystatine pommade : 1 application 3 fois par jour (homme et femme)", "Nystatine 500 000 UI : 2 comprimés par voie orale 3 fois par jour pendant 3 semaines", "Nystatine ovule : 1 ovule 2 fois par jour pendant 6 jours (femme)", "Hygiène corporelle et vestimentaire"],
          meds: ["nystatine"], source: "Togo Ord. 27, traitement 3" }
      }
    }
  },

  {
    id: "hemorroides", groupe: "Adulte",
    titre: "Hémorroïdes",
    sous: "RDC Méd. interne III.9 — adulte",
    debut: "o0",
    noeuds: {
      o0: {
        q: "Quels signes ?",
        options: [
          { t: "Saignement abondant, pâleur, malaise, ou thrombose très douloureuse, ou strangulation", vers: "r_ocompl" },
          { t: "Crise hémorroïdaire : pesanteur, chaleur anale, œdème, douleur modérée", vers: "r_ocrise" },
          { t: "Saignement discret en fin de selle, masse que le patient sent", vers: "r_osimple" },
          { t: "Douleur à la selle avec fissure, pus, ou masse permanente", vers: "r_odiff" }
        ]
      },
      r_ocompl: {
        res: { niveau: "attention", titre: "Hémorroïdes compliquées",
          resume: "Référer en chirurgie.",
          conduite: ["Saignement profus, thrombose, strangulation, infection ou ulcération : référer en chirurgie", "NFS : rechercher une anémie", "En attendant : bain de siège antiseptique, antalgique"],
          meds: ["paracetamol"], source: "RDC Méd. interne III.9" }
      },
      r_ocrise: {
        res: { niveau: "attention", titre: "Crise hémorroïdaire",
          resume: "Phlébotonique, soins locaux et règles de vie.",
          conduite: ["Daflon : 3 × 2 comprimés par jour pendant 4 jours, puis 2 × 2 comprimés par jour pendant 3 jours", "Bain de siège avec un antiseptique", "Suppositoires ou pommade anti-hémorroïdaires (anti-inflammatoire, astringent, anesthésique local)", "Lutter contre la constipation : eau, fibres, fruits", "Éviter épices, alcool, café, sédentarité", "Échec du traitement médical ou complication : chirurgie"],
          meds: ["daflon", "paracetamol"], source: "RDC Méd. interne III.9" }
      },
      r_osimple: {
        res: { niveau: "ok", titre: "Maladie hémorroïdaire non compliquée",
          resume: "Règles de vie et soins locaux.",
          conduite: ["Boire beaucoup, régime riche en fibres et en fruits", "Éviter épices, alcool, café ; ne pas pousser aux selles", "Bain de siège antiseptique, pommade ou suppositoire", "Saignement répété ou pâleur : NFS et référer (éliminer un cancer du rectum)"],
          meds: ["daflon"], source: "RDC Méd. interne III.9" }
      },
      r_odiff: {
        res: { niveau: "attention", titre: "Autre cause anale possible",
          resume: "Fissure, fistule ou cancer du rectum : référer.",
          conduite: ["Fissure : douleur après la selle ; fistule : tuméfaction péri-anale permanente avec pus", "Toucher rectal et rectoscopie par un médecin", "Référer"],
          meds: [], source: "RDC Méd. interne III.9 (diagnostics différentiels)" }
      }
    }
  },

  {
    id: "rhumatisme", groupe: "Tous",
    titre: "Rhumatisme : douleurs des articulations",
    sous: "RDC Méd. interne VI.3 à VI.5 (rhumatologie, goutte, RAA, lumbago)",
    debut: "r0",
    noeuds: {
      r0: {
        q: "Quel tableau ?",
        options: [
          { t: "Enfant ou adolescent, fièvre, articulations qui se succèdent, après une angine, avec palpitations", vers: "r_raa" },
          { t: "Début brutal, une articulation (gros orteil), rouge, très douloureuse, la nuit", vers: "r_goutte" },
          { t: "Plusieurs articulations, douleur nocturne, raideur matinale > 1 heure, gonflement", vers: "r_ar" },
          { t: "Douleur à l'effort qui cède au repos, fin de journée, raideur matinale < 30 min", vers: "r_arthrose" },
          { t: "Douleur lombaire brutale après un effort", vers: "r_lumbago" },
          { t: "Articulation chaude, fièvre élevée, ne peut pas bouger (arthrite septique)", vers: "r_septique" }
        ]
      },
      r_raa: {
        res: { niveau: "attention", titre: "Rhumatisme articulaire aigu (RAA)",
          resume: "Éradiquer le streptocoque, calmer l'inflammation, prévenir les rechutes.",
          conduite: [
            "Pénicilline V pendant 10 jours : adulte 500 mg toutes les 6 h ; 1 à 5 ans 125 mg toutes les 6 h ; 6 à 12 ans 250 mg toutes les 6 h. Allergie : érythromycine aux mêmes doses",
            "Aspirine : 100 mg/kg/24 h en 4 à 6 prises pendant 2 semaines = {mg:100} mg par jour ; puis 75 mg/kg/24 h pendant 4 à 6 semaines",
            "Cardite : prednisolone 1 à 2 mg/kg/jour pendant 2 semaines, puis diminuer progressivement (traitement médical)",
            "Prévention des rechutes : benzathine pénicilline 1 fois par mois : adulte 1,2 MUI ; enfant de plus de 30 kg 900 000 UI ; enfant de moins de 30 kg 600 000 UI, jusqu'à 21 ans ou plus longtemps si atteinte valvulaire",
            "Palpitations, essoufflement, douleur thoracique : cardite, référer"
          ],
          meds: ["penicilline-v", "aspirine", "benzathine-penicilline", "erythromycine"], source: "RDC Méd. interne VI.4",
          valider: "Dose d'aspirine très élevée chez l'enfant : surveillance de la toxicité. Prednisolone non incluse dans la calculatrice." }
      },
      r_goutte: {
        res: { niveau: "attention", titre: "Crise de goutte aiguë",
          resume: "Anti-inflammatoire ; la colchicine est du ressort du médecin : référer.",
          conduite: ["Repos de l'articulation, froid local", "Indométacine ou diclofénac en crise ; colchicine : référer", "Traitement de fond après la crise : allopurinol", "Boire beaucoup d'eau ; limiter alcool et abats", "Pas de diurétique thiazidique chez le goutteux"],
          meds: ["indometacine", "diclofenac", "allopurinol"], source: "RDC Méd. interne, goutte",
          valider: "Ne pas donner d'AINS en cas d'ulcère ou d'insuffisance rénale." }
      },
      r_ar: {
        res: { niveau: "attention", titre: "Arthrite rhumatoïde probable",
          resume: "Anti-inflammatoire et avis spécialisé.",
          conduite: ["Anti-inflammatoire : diclofénac, avec protection gastrique", "Antalgique : paracétamol", "Référer pour confirmation et traitement de fond", "Éviter les AINS en cas d'ulcère connu"],
          meds: ["diclofenac", "paracetamol", "omeprazole"], source: "RDC Méd. interne VI.3" }
      },
      r_arthrose: {
        res: { niveau: "ok", titre: "Arthrose",
          resume: "Antalgique, repos relatif, éviter la surcharge.",
          conduite: ["Cas simple : paracétamol ou aspirine", "Arthrose douloureuse compliquée : anti-inflammatoire de courte durée", "Éviter la surcharge de l'articulation, perdre du poids si besoin", "Kinésithérapie"],
          meds: ["paracetamol", "aspirine", "diclofenac"], source: "RDC Méd. interne VI.3 (arthrose)",
          valider: "Le guide contient une faute de frappe sur la dose de diclofénac (« 250 mg ») non reprise ici." }
      },
      r_lumbago: {
        res: { niveau: "ok", titre: "Lumbago",
          resume: "Repos, anti-inflammatoire, kinésithérapie.",
          conduite: ["Repos au lit (court)", "Anti-inflammatoire de courte durée avec protection de l'estomac", "Kinésithérapie", "Radiographie normale dans le lumbago", "Déficit moteur, trouble urinaire, fièvre : référer"],
          meds: ["paracetamol", "diclofenac"], source: "RDC Méd. interne VI.5" }
      },
      r_septique: {
        res: { niveau: "urgence", titre: "Arthrite septique possible",
          resume: "Urgence : antibiotique et transfert.",
          conduite: ["Ne pas retarder le transfert", "Drépanocytaire : penser à la salmonelle", "Référer en chirurgie / orthopédie"],
          meds: ["ceftriaxone"], source: "RDC Méd. interne VI.3 (arthrites septiques)" }
      }
    }
  }
];
