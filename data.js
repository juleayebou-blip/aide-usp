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
  "version": "0.9.1-prototype",
  "dateContenu": "2026-10-15",
  "statut": "BROUILLON NON VALIDÉ",
  "sources": [
    "Manuel d'ordinogrammes, MSP Togo, juin 2015 (source principale)",
    "Guides cliniques et thérapeutiques RDC 2016, Médecine interne et Pédiatrie (source pour les ajouts v0.3 : ulcère, morsures, diabète, HTA, drépanocytose, hémorroïdes, rhumatisme ; les IST viennent du manuel togolais)",
    "Fiche « HTA de l'adulte au centre de santé » (11/10/2026) : source de l'algorithme HTA",
    "Algorithme « Prise en charge des IST » (SANTÉ D'ABORD) : source de l'algorithme IST",
    "v0.9 : ajout de tous les ordinogrammes du manuel togolais non encore intégrés (Ord. 3, 5, 6, 7, 8, 13, 15, 19 à 22, 24, 25, 28 à 33, 37, 38, 41 à 44)"
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
    "id": "paracetamol",
    "nom": "Paracétamol",
    "classe": "Antalgique / antipyrétique",
    "formes": [
      {
        "nom": "Sirop 125 mg/5 mL",
        "mg": 125,
        "ml": 5
      },
      {
        "nom": "Comprimé 100 mg",
        "mg": 100
      },
      {
        "nom": "Comprimé 500 mg",
        "mg": 500
      }
    ],
    "regimes": [
      {
        "id": "para-enf",
        "indication": "Fièvre ≥ 38 °C / douleur — enfant",
        "type": "mgkg",
        "mgkg": 15,
        "parJour": 3,
        "jours": null,
        "maxPrise": 1000,
        "maxJour": 4000,
        "ageMin": 2,
        "ageMax": 180,
        "note": "Toutes les 8 heures jusqu'à disparition de la fièvre. Donner si température ≥ 38 °C. Alternative : ibuprofène sirop (Advil), voir la fiche ibuprofène.",
        "source": "Ord. 1 (tableau I) et Ord. 6 ; rythme de 8 heures retenu par le validateur"
      },
      {
        "id": "para-adulte",
        "indication": "Fièvre / douleur — adulte",
        "type": "fixe",
        "texte": "1 g (2 comprimés de 500 mg) par prise, 3 fois par jour, 6 h d'intervalle minimum",
        "parJour": 3,
        "jours": null,
        "ageMin": 180,
        "note": "À prendre au cours des repas ; boire beaucoup d'eau.",
        "source": "Ord. 16 : paracétamol 500 mg, 2 cp x 3/j"
      },
      {
        "id": "para-cvo",
        "indication": "Crise vaso-occlusive (drépanocytose) — enfant : dose de charge",
        "type": "mgkg",
        "mgkg": 30,
        "parJour": 1,
        "jours": 1,
        "maxPrise": 1000,
        "ageMin": 6,
        "ageMax": 180,
        "note": "Dose de charge 30 mg/kg (1 g si plus de 12 ans), puis 15 mg/kg toutes les 6 heures (500 mg si plus de 12 ans).",
        "source": "RDC Pédiatrie, drépanocytose (crise vaso-occlusive bénigne)"
      },
      {
        "id": "para-klipal",
        "indication": "Douleur — adulte, quand les AINS sont déconseillés (ulcère, gastrite)",
        "type": "fixe",
        "texte": "Parco Denk comprimé, ou Klipal codéine 300 comprimé : 1 comprimé 3 fois par jour",
        "parJour": 3,
        "ageMin": 180,
        "source": "Décision du validateur (remplace le diclofénac en cas d'ulcère ou de gastrite)"
      }
    ],
    "ci": [
      "Insuffisance hépatique sévère",
      "Allergie au paracétamol"
    ],
    "precautions": [
      "Ne jamais dépasser la dose maximale journalière",
      "Attention aux associations contenant déjà du paracétamol",
      "Dénutrition / alcoolisme chronique : réduire la dose"
    ],
    "effets": [
      "Rares aux doses usuelles ; hépatotoxicité en cas de surdosage"
    ]
  },
  {
    "id": "ibuprofene",
    "nom": "Ibuprofène",
    "classe": "Anti-inflammatoire non stéroïdien",
    "formes": [
      {
        "nom": "Sirop 100 mg/5 mL",
        "mg": 100,
        "ml": 5
      },
      {
        "nom": "Comprimé 200 mg",
        "mg": 200
      },
      {
        "nom": "Comprimé 400 mg",
        "mg": 400
      }
    ],
    "regimes": [
      {
        "id": "ibu-enf",
        "indication": "Douleur de gorge / d'oreille — enfant",
        "type": "mgkg",
        "mgkgJour": 30,
        "parJour": 3,
        "jours": 3,
        "maxPrise": 400,
        "maxJour": 1200,
        "ageMin": 3,
        "ageMax": 180,
        "note": "À prendre pendant les repas. Durée courte.",
        "source": "Ord. 12 : ibuprofène 30 mg/kg/jour en 3 prises pendant les repas"
      },
      {
        "id": "ibu-cvo",
        "indication": "Crise vaso-occlusive (drépanocytose) — enfant, si douleur persistante après 30 à 45 min",
        "type": "mgkg",
        "mgkg": 10,
        "parJour": 3,
        "jours": 3,
        "maxPrise": 400,
        "ageMin": 6,
        "ageMax": 180,
        "note": "10 mg/kg par prise, 3 prises par jour, pendant le repas, avec hydratation.",
        "source": "RDC Pédiatrie, drépanocytose ; posologie retenue par le validateur"
      },
      {
        "id": "ibu-adulte",
        "indication": "Douleur / inflammation (prostatite, rhumatisme) — adulte",
        "type": "fixe",
        "texte": "400 mg, 2 comprimés (800 mg) matin et soir, après le repas",
        "parJour": 2,
        "jours": 5,
        "ageMin": 180,
        "note": "5 à 10 jours selon l'indication (prostatite et cystite 7 jours).",
        "source": "Togo Ord. 26 et 31"
      },
      {
        "id": "ibu-orl",
        "indication": "Otite (moyenne aiguë, externe), corps étranger, traumatisme — adulte",
        "type": "fixe",
        "texte": "800 mg matin et soir, après le repas",
        "parJour": 2,
        "ageMin": 180,
        "source": "Togo Ord. 35, traitement 1"
      },
      {
        "id": "ibu-fievre-enf",
        "indication": "Fièvre / douleur — enfant : ibuprofène sirop (Advil), alternative au paracétamol",
        "type": "mgkg",
        "mgkgJour": 30,
        "parJour": 3,
        "maxPrise": 400,
        "ageMin": 3,
        "ageMax": 180,
        "note": "Dose selon le poids, 3 fois par jour, pendant les repas. Durée courte. Éviter en cas de déshydratation.",
        "source": "Décision du validateur"
      },
      {
        "id": "ibu-dysmen",
        "indication": "Dysménorrhée — femme",
        "type": "fixe",
        "texte": "800 mg matin et soir au cours des repas, pendant les 3 jours précédant les règles, pendant 3 cycles",
        "parJour": 2,
        "jours": 3,
        "ageMin": 180,
        "note": "Pas d'amélioration après 3 cycles : référer.",
        "source": "Togo Ord. 24 (traitement 14), Ord. 28 (traitement 9)"
      },
      {
        "id": "ibu-gyn",
        "indication": "Endométrite, fibrome, plaie vulvo-vaginale — adulte",
        "type": "fixe",
        "texte": "800 mg matin et soir au cours des repas",
        "parJour": 2,
        "ageMin": 180,
        "source": "Togo Ord. 24, 25 et 32"
      }
    ],
    "ci": [
      "Enfant < 3 mois",
      "Déshydratation / vomissements importants / diarrhée sévère",
      "Ulcère gastro-duodénal, saignement digestif",
      "Insuffisance rénale, cardiaque ou hépatique sévère",
      "Grossesse",
      "Suspicion de paludisme grave ou de fièvre hémorragique (risque de saignement)",
      "Varicelle"
    ],
    "precautions": [
      "Asthme (risque de bronchospasme)",
      "Hypertension, traitement anticoagulant ou diurétique"
    ],
    "effets": [
      "Douleurs gastriques, nausées",
      "Insuffisance rénale aiguë si déshydratation"
    ]
  },
  {
    "id": "amoxicilline",
    "nom": "Amoxicilline",
    "classe": "Antibiotique (bêta-lactamine)",
    "formes": [
      {
        "nom": "Comprimé / poudre pour sirop 250 mg",
        "mg": 250
      },
      {
        "nom": "Sirop 250 mg/5 mL",
        "mg": 250,
        "ml": 5
      },
      {
        "nom": "Gélule / comprimé 500 mg",
        "mg": 500
      }
    ],
    "regimes": [
      {
        "id": "amox-pneumo-enf",
        "indication": "Pneumonie de l'enfant (non grave)",
        "type": "mgkg",
        "mgkgJour": 50,
        "parJour": 3,
        "jours": 5,
        "maxPrise": 1000,
        "ageMin": 2,
        "ageMax": 180,
        "note": "Réévaluer après 2 jours : si amélioration, continuer ; sinon référer. Allergie aux pénicillines : érythromycine.",
        "source": "Ord. 2, traitement 3 ; dose retenue par le validateur : 50 mg/kg/jour (PCIME/OMS)"
      },
      {
        "id": "amox-angine-enf",
        "indication": "Angine bactérienne de l'enfant",
        "type": "mgkg",
        "mgkgJour": 100,
        "parJour": 3,
        "jours": 10,
        "maxPrise": 1000,
        "ageMin": 2,
        "ageMax": 180,
        "note": "Continuer 10 jours même après la disparition de la douleur (risque de RAA, glomérulonéphrite).",
        "source": "Ord. 11, traitement 1 : 100 mg/kg/jour en 3 prises, 10 jours"
      },
      {
        "id": "amox-rougeole",
        "indication": "Rougeole — prévention de la surinfection",
        "type": "mgkg",
        "mgkgJour": 100,
        "parJour": 2,
        "jours": 10,
        "maxPrise": 1000,
        "ageMin": 2,
        "ageMax": 180,
        "note": "En 2 prises par jour, au moins 10 jours.",
        "source": "Ord. 1, traitement 8"
      },
      {
        "id": "amox-grave-enf",
        "indication": "Pneumonie grave de l'enfant — dose avant transfert (IM/IV)",
        "type": "mgkg",
        "mgkg": 50,
        "parJour": null,
        "jours": null,
        "maxPrise": null,
        "ageMin": 2,
        "ageMax": 180,
        "note": "Une injection (ou ceftriaxone 50 mg/kg), puis référer.",
        "source": "Ord. 2, traitement 4"
      },
      {
        "id": "amox-adulte",
        "indication": "Pneumonie / bronchite / laryngite de l'adulte",
        "type": "fixe",
        "texte": "1 g (2 gélules de 500 mg) par prise, matin, midi et soir",
        "parJour": 3,
        "jours": 10,
        "ageMin": 180,
        "note": "Pas d'amélioration après 5 jours : référer. Signes de gravité : ceftriaxone 2 g puis référer.",
        "source": "Ord. 16 (traitement 6) et Ord. 17 (traitements 2 à 4)"
      },
      {
        "id": "amox-hp",
        "indication": "Gastrite / ulcère : éradication d'Helicobacter pylori — adulte",
        "type": "fixe",
        "texte": "1 g, 2 fois par jour, avec l'oméprazole et la clarithromycine (ou le métronidazole)",
        "parJour": 2,
        "jours": 14,
        "ageMin": 180,
        "note": "Traitement de 14 jours (protocole retenu).",
        "source": "RDC Méd. interne III.3 et III.4 ; Togo Ord. 23, traitement 3"
      },
      {
        "id": "amox-peau-adulte",
        "indication": "Peau : impétigo, abcès, surinfection (gale, varicelle) — adulte",
        "type": "fixe",
        "texte": "1 g, 3 fois par jour, 8 à 10 jours",
        "parJour": 3,
        "jours": 10,
        "ageMin": 180,
        "note": "8 jours pour la surinfection de gale ou de varicelle ; 10 jours pour l'impétigo et l'abcès.",
        "source": "Togo Ord. 36, traitements 1, 3, 9 et 12"
      },
      {
        "id": "amox-peau-enf",
        "indication": "Peau : impétigo, abcès, surinfection — enfant",
        "type": "mgkg",
        "mgkgJour": 50,
        "parJour": 2,
        "jours": 10,
        "ageMax": 180,
        "note": "8 jours pour la surinfection de gale ou de varicelle ; 10 jours pour l'impétigo et l'abcès.",
        "source": "Togo Ord. 36, traitements 1, 3, 9 et 12"
      },
      {
        "id": "amox-colite-enf",
        "indication": "Colite inflammatoire — enfant",
        "type": "mgkg",
        "mgkgJour": 100,
        "parJour": 3,
        "jours": 7,
        "ageMax": 180,
        "source": "Togo Ord. 14, traitement 4"
      },
      {
        "id": "amox-hemo-enf",
        "indication": "Hémorragie externe de petite abondance — enfant",
        "type": "mgkg",
        "mgkgJour": 50,
        "parJour": 2,
        "jours": 6,
        "ageMax": 180,
        "source": "Togo Ord. 9, traitement 6"
      },
      {
        "id": "amox-dent",
        "indication": "Infection dentaire (abcès, cellulite, ostéite, parodontose) — adulte",
        "type": "fixe",
        "texte": "500 mg : 2 comprimés (1 g) matin et soir",
        "parJour": 2,
        "ageMin": 180,
        "source": "Togo Ord. 34, traitement 2"
      },
      {
        "id": "amox-dent-enf",
        "indication": "Infection dentaire — enfant (dose pédiatrique)",
        "type": "mgkg",
        "mgkgJour": 50,
        "parJour": 2,
        "jours": 7,
        "maxPrise": 1000,
        "ageMin": 2,
        "ageMax": 180,
        "note": "Avec le métronidazole et le paracétamol sirop ; référer si pas d'amélioration.",
        "source": "Dose retenue par le validateur : 50 mg/kg/jour en 2 prises, 7 jours"
      },
      {
        "id": "amox-gorge-adu",
        "indication": "Angine bactérienne — adulte",
        "type": "fixe",
        "texte": "1 g (2 gélules de 500 mg) matin et soir",
        "parJour": 2,
        "jours": 10,
        "ageMin": 180,
        "note": "Continuer l'antibiotique même après la disparition des douleurs (rhumatisme articulaire aigu, glomérulonéphrite, endocardite).",
        "source": "Togo Ord. 40 (mal de gorge)"
      },
      {
        "id": "amox-oeil-enf",
        "indication": "Œil de l'enfant (conjonctivite, orgelet, blépharite, blessure de la cornée), associée à la pommade",
        "type": "mgkg",
        "mgkgJour": 50,
        "parJour": 2,
        "jours": 7,
        "maxPrise": 1000,
        "ageMin": 2,
        "ageMax": 180,
        "note": "Pas d'amélioration : référer.",
        "source": "Togo Ord. 13"
      },
      {
        "id": "amox-nez-enf",
        "indication": "Rhinopharyngite, sinusite, traumatisme du nez, plaies de la bouche — enfant",
        "type": "mgkg",
        "mgkgJour": 50,
        "parJour": 2,
        "jours": 7,
        "maxPrise": 1000,
        "ageMin": 2,
        "ageMax": 180,
        "note": "Après 7 jours : si bonne évolution, continuer 3 jours ; si fièvre persistante, référer.",
        "source": "Togo Ord. 41 (traitement 1)"
      },
      {
        "id": "amox-gyn",
        "indication": "Endométrite — adulte",
        "type": "fixe",
        "texte": "500 mg : 2 comprimés matin et soir pendant 10 jours",
        "parJour": 2,
        "jours": 10,
        "ageMin": 180,
        "source": "Togo Ord. 24, traitement 6"
      },
      {
        "id": "amox-sein",
        "indication": "Mastite / abcès du sein — adulte",
        "type": "fixe",
        "texte": "1 g matin et soir pendant 10 jours",
        "parJour": 2,
        "jours": 10,
        "ageMin": 180,
        "source": "Togo Ord. 29, traitement 2"
      },
      {
        "id": "amox-pp",
        "indication": "Suites de couches chez la femme qui allaite — adulte",
        "type": "fixe",
        "texte": "1 g matin et soir pendant 7 jours",
        "parJour": 2,
        "jours": 7,
        "ageMin": 180,
        "source": "Togo Ord. 30"
      },
      {
        "id": "amox-nez-adulte",
        "indication": "Rhinopharyngite, sinusite, traumatisme du nez, œil, plaies de la bouche — adulte",
        "type": "fixe",
        "texte": "500 mg : 2 gélules ou comprimés matin et soir",
        "parJour": 2,
        "jours": 7,
        "ageMin": 180,
        "note": "Rhinopharyngite / sinusite : après 7 jours, si bonne évolution continuer 3 jours ; fièvre persistante : référer.",
        "source": "Togo Ord. 41, 42, 43"
      }
    ],
    "ci": [
      "Allergie aux pénicillines (risque de choc anaphylactique)"
    ],
    "precautions": [
      "Rechercher une allergie aux bêta-lactamines AVANT la première dose",
      "Insuffisance rénale : espacer les prises"
    ],
    "effets": [
      "Diarrhée, nausées",
      "Éruption cutanée / urticaire",
      "Réaction anaphylactique (rare)"
    ]
  },
  {
    "id": "amox-clav",
    "nom": "Amoxicilline + acide clavulanique",
    "classe": "Antibiotique (bêta-lactamine + inhibiteur)",
    "formes": [
      {
        "nom": "Selon la présentation disponible (dose exprimée en amoxicilline)",
        "mg": 0
      }
    ],
    "regimes": [
      {
        "id": "ac-otite",
        "indication": "Otite moyenne aiguë / otite externe — enfant",
        "type": "mgkg",
        "mgkgJour": 50,
        "parJour": 3,
        "jours": 10,
        "maxPrise": 1000,
        "ageMin": 2,
        "ageMax": 180,
        "note": "Réévaluer à 5 jours : si bonne évolution, poursuivre encore 5 jours ; sinon (ou rechute après 10 jours) référer.",
        "source": "Ord. 12, traitement 1 : 50 mg/kg/jour en 3 prises"
      },
      {
        "id": "ac-adulte",
        "indication": "Pneumonie avec signes de gravité — adulte",
        "type": "fixe",
        "texte": "1000 mg par prise, 3 fois par jour",
        "parJour": 3,
        "jours": 10,
        "ageMin": 180,
        "note": "Alternative : ceftriaxone 2 g/jour.",
        "source": "Ord. 16, traitement 6"
      },
      {
        "id": "ac-orl-adulte",
        "indication": "Otite moyenne aiguë ou chronique, otite externe, corps étranger, traumatisme — adulte",
        "type": "fixe",
        "texte": "1 g matin et soir (comprimés ou gélules de 500 mg ou 1000 mg)",
        "parJour": 2,
        "jours": 10,
        "ageMin": 180,
        "note": "Otite moyenne aiguë : après 5 jours, si l'évolution est bonne, poursuivre 5 jours encore. Corps étranger : 7 jours.",
        "source": "Togo Ord. 35, traitement 1"
      },
      {
        "id": "ac-peau-adulte",
        "indication": "Abcès cutané, alternative — adulte",
        "type": "fixe",
        "texte": "500 mg : 2 comprimés, 3 fois par jour pendant 10 jours",
        "parJour": 3,
        "jours": 10,
        "ageMin": 180,
        "source": "Togo Ord. 36, traitement 9"
      },
      {
        "id": "ac-peau-enf",
        "indication": "Abcès cutané, alternative / relais de l'érysipèle — enfant",
        "type": "mgkg",
        "mgkgJour": 50,
        "parJour": 3,
        "jours": 10,
        "ageMax": 180,
        "source": "Togo Ord. 36, traitements 9 et 13"
      }
    ],
    "ci": [
      "Allergie aux pénicillines",
      "Antécédent d'atteinte hépatique liée à ce médicament"
    ],
    "precautions": [
      "Diarrhée fréquente : donner au début d'un repas"
    ],
    "effets": [
      "Diarrhée, nausées",
      "Éruption cutanée"
    ]
  },
  {
    "id": "erythromycine",
    "nom": "Érythromycine",
    "classe": "Antibiotique (macrolide) — alternative en cas d'allergie aux pénicillines",
    "formes": [
      {
        "nom": "Comprimé 250 mg",
        "mg": 250
      },
      {
        "nom": "Sirop 125 mg/5 mL",
        "mg": 125,
        "ml": 5
      }
    ],
    "regimes": [
      {
        "id": "ery-enf",
        "indication": "Alternative à l'amoxicilline — enfant (pneumonie, angine, rhinopharyngite, otite)",
        "type": "mgkg",
        "mgkgJour": 50,
        "parJour": 2,
        "jours": null,
        "maxPrise": 1000,
        "ageMin": 2,
        "ageMax": 180,
        "note": "5 jours (pneumonie) à 10 jours (angine, rhinopharyngite).",
        "source": "Ord. 2, 11, 12 : 50 mg/kg/jour en 2 prises"
      },
      {
        "id": "ery-adulte",
        "indication": "Pneumonie / bronchite / laryngite — adulte",
        "type": "fixe",
        "texte": "1 g matin et soir",
        "parJour": 2,
        "jours": 7,
        "ageMin": 180,
        "source": "Ord. 16 et 17"
      },
      {
        "id": "ery-peau-adulte",
        "indication": "Peau : surinfection, impétigo, eczéma surinfecté — adulte",
        "type": "fixe",
        "texte": "500 mg : 2 comprimés, 2 fois par jour pendant 8 jours",
        "parJour": 2,
        "jours": 8,
        "ageMin": 180,
        "source": "Togo Ord. 36, traitements 1, 3, 4 et 12"
      },
      {
        "id": "ery-peau-enf",
        "indication": "Peau : surinfection, impétigo, eczéma surinfecté — enfant",
        "type": "mgkg",
        "mgkgJour": 50,
        "parJour": 2,
        "jours": 8,
        "ageMax": 180,
        "source": "Togo Ord. 36, traitements 1, 3, 4 et 12"
      },
      {
        "id": "ery-ist-7",
        "indication": "IST : Écoulement vaginal (moins de 15 ans, femme enceinte ou allaitante)",
        "type": "fixe",
        "texte": "500 mg : 2 comprimés 2 fois par jour pendant 7 jours, au repas",
        "parJour": 2,
        "jours": 7,
        "source": "Algorithme « Prise en charge des IST » (SANTÉ D'ABORD), joint le 11/10/2026"
      },
      {
        "id": "ery-ist-14",
        "indication": "IST : Douleurs basses, tuméfaction du scrotum, conjonctivite (mère)",
        "type": "fixe",
        "texte": "500 mg : 2 comprimés 2 fois par jour pendant 14 jours, au repas",
        "parJour": 2,
        "jours": 14,
        "source": "Algorithme « Prise en charge des IST » (SANTÉ D'ABORD), joint le 11/10/2026"
      },
      {
        "id": "ery-ist-21",
        "indication": "IST : Ulcération génitale (femme enceinte), bubon inguinal",
        "type": "fixe",
        "texte": "500 mg : 2 comprimés 2 fois par jour pendant 21 jours, au repas",
        "parJour": 2,
        "jours": 21,
        "source": "Algorithme « Prise en charge des IST » (SANTÉ D'ABORD), joint le 11/10/2026"
      },
      {
        "id": "ery-conj-nn",
        "indication": "Conjonctivite du nouveau-né : sirop",
        "type": "mgkg",
        "mgkgJour": 50,
        "parJour": 4,
        "jours": 14,
        "ageMax": 2,
        "source": "Algorithme « Prise en charge des IST » (SANTÉ D'ABORD), joint le 11/10/2026"
      },
      {
        "id": "ery-gorge-adu",
        "indication": "Angine bactérienne — adulte",
        "type": "fixe",
        "texte": "500 mg : 1 comprimé 3 fois par jour",
        "parJour": 3,
        "ageMin": 180,
        "source": "Togo Ord. 40 (mal de gorge)"
      },
      {
        "id": "ery-nez-adulte",
        "indication": "Allergie à l'amoxicilline (rhinopharyngite, sinusite) — adulte",
        "type": "fixe",
        "texte": "500 mg : 2 comprimés matin et soir",
        "parJour": 2,
        "ageMin": 180,
        "source": "Togo Ord. 41, traitement 3"
      }
    ],
    "ci": [
      "Allergie aux macrolides"
    ],
    "precautions": [
      "Troubles digestifs fréquents : prendre au cours du repas"
    ],
    "effets": [
      "Nausées, douleurs abdominales, diarrhée"
    ]
  },
  {
    "id": "act-al",
    "nom": "Artéméther + luméfantrine (AL)",
    "classe": "Antipaludique — CTA, paludisme simple",
    "formes": [
      {
        "nom": "Comprimé 20 mg/120 mg",
        "mg": 20
      }
    ],
    "regimes": [
      {
        "id": "al-std",
        "indication": "Paludisme simple (TDR / goutte épaisse positif) — tous âges",
        "type": "tranches",
        "parJour": 2,
        "jours": 3,
        "tranches": [
          {
            "poidsMin": 5,
            "poidsMax": 14,
            "texte": "1 comprimé (20/120 mg) par prise"
          },
          {
            "poidsMin": 14,
            "poidsMax": 24,
            "texte": "2 comprimés (40/240 mg) par prise"
          },
          {
            "poidsMin": 24,
            "poidsMax": 35,
            "texte": "3 comprimés (60/360 mg) par prise"
          },
          {
            "poidsMin": 35,
            "poidsMax": 999,
            "texte": "4 comprimés (80/480 mg) par prise"
          }
        ],
        "note": "Matin et soir pendant 3 jours (6 prises). Prendre avec un aliment gras ou du lait. Si vomissement < 30 min : répéter la dose. Fièvre persistante après 3 jours de traitement correct : rechercher une autre cause.",
        "source": "Ord. 1, traitement 2 et Ord. 16, traitement 1 ; tranches de poids retenues par le validateur"
      }
    ],
    "ci": [
      "Paludisme grave (utiliser l'artésunate injectable)",
      "Allergie connue aux composants",
      "Poids < 5 kg : avis médical"
    ],
    "precautions": [
      "Grossesse : 1er trimestre = avis médical (voir protocole national)",
      "Médicaments allongeant le QT"
    ],
    "effets": [
      "Céphalées, vertiges, troubles digestifs",
      "Palpitations (rare)"
    ]
  },
  {
    "id": "asaq",
    "nom": "Artésunate + amodiaquine (AS-AQ)",
    "classe": "Antipaludique — CTA, paludisme simple (alternative)",
    "formes": [
      {
        "nom": "Comprimés séparés : artésunate 50 mg + amodiaquine 153 mg",
        "mg": 50
      }
    ],
    "regimes": [
      {
        "id": "asaq-enf",
        "indication": "Paludisme simple — enfant et adolescent (AS 50 mg + AQ 153 mg)",
        "type": "tranches",
        "parJour": 1,
        "jours": 3,
        "tranches": [
          {
            "poidsMin": 5,
            "poidsMax": 10,
            "texte": "½ comprimé d'AS + ½ comprimé d'AQ, 1 fois par jour"
          },
          {
            "poidsMin": 10,
            "poidsMax": 24,
            "texte": "1 comprimé d'AS + 1 comprimé d'AQ, 1 fois par jour"
          },
          {
            "poidsMin": 24,
            "poidsMax": 50,
            "texte": "2 comprimés d'AS + 2 comprimés d'AQ, 1 fois par jour"
          },
          {
            "poidsMin": 50,
            "poidsMax": 999,
            "texte": "4 comprimés d'AS + 4 comprimés d'AQ, 1 fois par jour"
          }
        ],
        "note": "AS et AQ pris ensemble, en une prise par jour, pendant 3 jours.",
        "source": "Ord. 1, traitement 2 (alternative) : 4 mg/kg AS + 10 mg/kg AQ une fois par jour pendant 3 jours"
      }
    ],
    "ci": [
      "Paludisme grave",
      "Antécédent d'atteinte hépatique ou de neutropénie liée à l'amodiaquine"
    ],
    "precautions": [
      "Éviter chez les patients sous traitement antirétroviral à base de zidovudine/éfavirenz sans avis"
    ],
    "effets": [
      "Troubles digestifs, asthénie, somnolence"
    ]
  },
  {
    "id": "artesunate",
    "nom": "Artésunate injectable",
    "classe": "Antipaludique — paludisme grave",
    "formes": [
      {
        "nom": "Ampoule 60 mg (à reconstituer)",
        "mg": 60,
        "conv": false
      }
    ],
    "regimes": [
      {
        "id": "arte-iv",
        "indication": "Paludisme grave — adulte et enfant de 20 kg et plus (IV direct ou IM)",
        "type": "mgkg",
        "mgkg": 2.4,
        "parJour": null,
        "jours": null,
        "maxPrise": null,
        "note": "À H0, H12 et H24 le 1er jour, puis 1 fois par jour jusqu'à amélioration, puis relais par une CTA. Durée totale de l'artésunate injectable : 7 jours si la voie orale reste impossible. IM : face antéro-externe de la cuisse. Enfant : donner d'abord SGH 10 % 10 mL/kg en bolus (1 h). Référer.",
        "source": "Ord. 1, traitement 2 ; Ord. 16 ; dose 2,4 mg/kg retenue par le validateur",
        "poidsMin": 20
      },
      {
        "id": "arte-iv-leger",
        "indication": "Paludisme grave — enfant de moins de 20 kg (IV direct ou IM)",
        "type": "mgkg",
        "mgkg": 3,
        "parJour": null,
        "jours": null,
        "maxPrise": null,
        "note": "À H0, H12 et H24 le 1er jour, puis 1 fois par jour jusqu'à amélioration, puis relais par une CTA. Durée totale de l'artésunate injectable : 7 jours si la voie orale reste impossible. IM : face antéro-externe de la cuisse. Enfant : donner d'abord SGH 10 % 10 mL/kg en bolus (1 h). Référer.",
        "source": "Dose 3 mg/kg si poids < 20 kg, retenue par le validateur (OMS)",
        "poidsMax": 20
      }
    ],
    "ci": [
      "Allergie connue à l'artésunate"
    ],
    "precautions": [
      "Surveiller la glycémie (hypoglycémie fréquente)",
      "Anémie hémolytique retardée possible 2-3 semaines après : contrôler l'hémoglobine"
    ],
    "effets": [
      "Hémolyse retardée",
      "Réaction au point d'injection"
    ]
  },
  {
    "id": "artemether-inj",
    "nom": "Artéméther injectable (IM)",
    "classe": "Antipaludique — paludisme grave (alternative)",
    "formes": [
      {
        "nom": "Ampoule 20 mg/mL",
        "mg": 20,
        "ml": 1
      },
      {
        "nom": "Ampoule 40 mg/mL",
        "mg": 40,
        "ml": 1
      }
    ],
    "regimes": [
      {
        "id": "artm-j1",
        "indication": "Enfant — jour 1",
        "type": "mgkg",
        "mgkg": 3.2,
        "parJour": null,
        "jours": null,
        "maxPrise": null,
        "ageMax": 180,
        "note": "IM face antéro-externe de la cuisse. Puis 1,6 mg/kg/jour du 2e au 7e jour si le transfert est impossible.",
        "source": "Ord. 1, traitement 2 et tableau III"
      },
      {
        "id": "artm-j2",
        "indication": "Enfant — du jour 2 au jour 7",
        "type": "mgkg",
        "mgkg": 1.6,
        "parJour": 1,
        "jours": 6,
        "maxPrise": null,
        "ageMax": 180,
        "note": "À partir du 5e jour, une CTA peut remplacer l'artéméther injectable pour finir les 7 jours.",
        "source": "Ord. 1, tableau III"
      },
      {
        "id": "artm-adulte",
        "indication": "Adulte — 1re dose avant transfert",
        "type": "fixe",
        "texte": "160 mg en IM, dose unique",
        "ageMin": 180,
        "note": "Puis référer d'urgence.",
        "source": "Ord. 16, traitement 2"
      }
    ],
    "ci": [
      "Allergie connue"
    ],
    "precautions": [
      "Absorption IM variable : référer"
    ],
    "effets": [
      "Douleur au point d'injection"
    ]
  },
  {
    "id": "quinine-inj",
    "nom": "Quinine injectable",
    "classe": "Antipaludique — paludisme grave (alternative)",
    "formes": [
      {
        "nom": "Ampoule 300 mg/1 mL diluée dans 5 mL d'eau distillée (50 mg/mL)",
        "mg": 50,
        "ml": 1
      }
    ],
    "regimes": [
      {
        "id": "qui-sels",
        "indication": "Sels de quinine — perfusion (adulte et enfant)",
        "type": "mgkg",
        "mgkg": 15,
        "parJour": 2,
        "jours": null,
        "maxPrise": null,
        "note": "Toutes les 12 heures (matin et soir), en perfusion dans du sérum glucosé isotonique 5 % (250 mL) en 4 heures. Relais par une CTA dès amélioration. Référer.",
        "source": "Ord. 1, traitement 2 et tableau III ; Ord. 16, traitement 2 ; voie retenue par le validateur : perfusion"
      },
      {
        "id": "qui-base",
        "indication": "Quinine base",
        "type": "mgkg",
        "mgkg": 12.5,
        "parJour": 2,
        "jours": null,
        "maxPrise": null,
        "note": "Toutes les 12 heures, perfusion dans 250 mL de SGI en 4 h (usage hospitalier).",
        "source": "Ord. 1, traitement 2"
      }
    ],
    "ci": [
      "Hémoglobinurie (urines « coca-cola »)",
      "Antécédent d'intolérance à la quinine"
    ],
    "precautions": [
      "Risque d'hypoglycémie : surveiller la glycémie",
      "Perfusion lente (jamais en bolus)"
    ],
    "effets": [
      "Bourdonnements d'oreilles, vertiges",
      "Hypoglycémie"
    ]
  },
  {
    "id": "sgh10",
    "nom": "Sérum glucosé hypertonique 10 %",
    "classe": "Traitement de l'hypoglycémie",
    "formes": [
      {
        "nom": "Perfusion SGH 10 %",
        "mg": 0
      }
    ],
    "regimes": [
      {
        "id": "sgh-enf",
        "indication": "Hypoglycémie / paludisme grave — enfant",
        "type": "totalkg",
        "dose": 10,
        "unit": "mL",
        "ageMax": 180,
        "note": "En bolus (en 1 heure). Alimenter l'enfant dès que la voie orale est possible.",
        "source": "Ord. 1 (traitement 2), Ord. 5 (traitement 5)"
      },
      {
        "id": "sgh-adulte",
        "indication": "Hypoglycémie — adulte",
        "type": "fixe",
        "texte": "100 mL d'eau sucrée si le patient peut boire, ou SGH 10 % 250 mL en perfusion",
        "ageMin": 180,
        "source": "Ord. 16, traitement 2"
      },
      {
        "id": "sgh-adulte-500",
        "indication": "Hypoglycémie d'une convulsion — adulte",
        "type": "fixe",
        "texte": "2 morceaux de sucre par la bouche si le patient est conscient ; sinon SGH 10 % 500 mL en perfusion rapide",
        "ageMin": 180,
        "note": "Surveiller.",
        "source": "Togo Ord. 20, traitement 4"
      }
    ],
    "ci": [
      "Aucune en situation d'urgence hypoglycémique"
    ],
    "precautions": [
      "Contrôler la glycémie capillaire avant et après"
    ],
    "effets": [
      "Phlébite si extravasation"
    ]
  },
  {
    "id": "diazepam",
    "nom": "Diazépam",
    "classe": "Anticonvulsivant",
    "formes": [
      {
        "nom": "Ampoule 10 mg/2 mL",
        "mg": 5,
        "ml": 1
      }
    ],
    "regimes": [
      {
        "id": "dz-enf",
        "indication": "Convulsions — enfant (IR, IM ou IV lente)",
        "type": "mgkg",
        "mgkg": 0.5,
        "mgkgMax": 1,
        "parJour": null,
        "jours": null,
        "maxPrise": null,
        "ageMax": 180,
        "note": "En cas de détresse respiratoire : ne pas donner de diazépam, donner du phénobarbital 15 mg/kg IM. Mettre en position latérale de sécurité, libérer les voies aériennes.",
        "source": "Ord. 1, 5, 6 : 0,5 à 1 mg/kg"
      },
      {
        "id": "dz-adulte",
        "indication": "Convulsions — adulte",
        "type": "fixe",
        "texte": "10 mg en IM",
        "ageMin": 180,
        "note": "Patient sur le côté, tête en extension, rien dans la bouche, aspirer les sécrétions.",
        "source": "Ord. 16, traitement 2"
      },
      {
        "id": "dz-epil-adulte",
        "indication": "Crise d'épilepsie — adulte",
        "type": "fixe",
        "texte": "10 à 20 mg en IM",
        "ageMin": 180,
        "note": "Puis phénobarbital en traitement de fond et référer pour bilan.",
        "source": "Togo Ord. 20, traitement 3"
      },
      {
        "id": "dz-avort",
        "indication": "Menace d'avortement — adulte",
        "type": "fixe",
        "texte": "5 mg : 1 comprimé matin et soir, ou 1 ampoule de 10 mg en IM matin et soir",
        "parJour": 2,
        "jours": 5,
        "ageMin": 180,
        "note": "Repos au lit. Si amélioration, continuer 5 jours ; sinon référer.",
        "source": "Togo Ord. 24 (traitement 3) et Ord. 25"
      },
      {
        "id": "dz-hernie",
        "indication": "Hernie étranglée, prééclampsie — adulte : avant transfert",
        "type": "fixe",
        "texte": "10 mg (1 ampoule) en IM, puis référer",
        "ageMin": 180,
        "source": "Togo Ord. 24 (traitement 12), Ord. 32 (traitement 4), Ord. 37 (traitement 9)"
      },
      {
        "id": "dz-alcool",
        "indication": "Intoxication alcoolique avec agitation ou convulsion — adulte",
        "type": "fixe",
        "texte": "10 mg en IM",
        "ageMin": 180,
        "source": "Togo Ord. 38, traitement 1"
      }
    ],
    "ci": [
      "Détresse respiratoire (préférer le phénobarbital chez l'enfant)"
    ],
    "precautions": [
      "Surveiller la respiration",
      "Matériel de ventilation à portée de main"
    ],
    "effets": [
      "Somnolence, dépression respiratoire"
    ]
  },
  {
    "id": "ceftriaxone",
    "nom": "Ceftriaxone",
    "classe": "Antibiotique injectable (céphalosporine)",
    "formes": [
      {
        "nom": "Flacon injectable (1 g)",
        "mg": 1000,
        "conv": false
      }
    ],
    "regimes": [
      {
        "id": "cef-pg-enf",
        "indication": "Pneumonie grave — enfant (dose avant transfert)",
        "type": "mgkg",
        "mgkg": 50,
        "parJour": null,
        "jours": null,
        "maxPrise": null,
        "ageMin": 2,
        "ageMax": 180,
        "note": "IV ou IM, puis référer.",
        "source": "Ord. 2, traitement 4"
      },
      {
        "id": "cef-men-enf",
        "indication": "Méningite — enfant (zone d'endémie)",
        "type": "mgkg",
        "mgkgJour": 100,
        "parJour": 1,
        "jours": 10,
        "maxPrise": 4000,
        "ageMin": 2,
        "ageMax": 180,
        "note": "IM ou IV, une fois par jour. Notifier. Référer.",
        "source": "Ord. 1, traitement 3"
      },
      {
        "id": "cef-typh-enf",
        "indication": "Fièvre typhoïde — enfant",
        "type": "mgkg",
        "mgkgJour": 50,
        "parJour": 1,
        "jours": 10,
        "maxPrise": 2000,
        "ageMin": 2,
        "ageMax": 180,
        "note": "10 à 15 jours, IV direct ou IM.",
        "source": "Ord. 1, traitement 4"
      },
      {
        "id": "cef-pg-adulte",
        "indication": "Pneumonie avec signes de gravité — adulte",
        "type": "fixe",
        "texte": "2 g en IM ou IV direct, dose unique avant transfert",
        "ageMin": 180,
        "source": "Ord. 17 et Ord. 19"
      },
      {
        "id": "cef-men-adulte",
        "indication": "Méningite (épidémie) — adulte, 1re dose",
        "type": "fixe",
        "texte": "1 g en IM ou IV direct, puis référer",
        "ageMin": 180,
        "note": "Notifier à l'échelon supérieur.",
        "source": "Ord. 16, traitement 3"
      },
      {
        "id": "cef-typh-adulte",
        "indication": "Fièvre typhoïde — adulte",
        "type": "fixe",
        "texte": "1 g, 2 fois par jour en IM ou IV",
        "parJour": 2,
        "jours": 10,
        "ageMin": 180,
        "note": "Relais par voie orale si amélioration après 3 jours. Fièvre persistante après le 7e jour : référer.",
        "source": "Ord. 16 (2 g en 2 inj/jour) et Ord. 18 (1 g, 2 fois/jour)"
      },
      {
        "id": "cef-nne",
        "indication": "Infection néonatale possible — nourrisson de moins de 2 mois",
        "type": "mgkg",
        "mgkgJour": 50,
        "parJour": 1,
        "ageMax": 2,
        "note": "En IV. Avec la gentamicine pendant 3 jours.",
        "source": "Décision du validateur"
      },
      {
        "id": "cef-ist",
        "indication": "IST (écoulement urétral ou vaginal, douleurs basses, ulcération, bubon, scrotum) — adulte",
        "type": "fixe",
        "texte": "1 g en IM, dose unique",
        "parJour": 1,
        "jours": 1,
        "ageMin": 180,
        "source": "Algorithme « Prise en charge des IST » (SANTÉ D'ABORD), joint le 11/10/2026"
      },
      {
        "id": "cef-conj-nn",
        "indication": "Conjonctivite du nouveau-né",
        "type": "mgkg",
        "mgkg": 50,
        "parJour": 1,
        "jours": 1,
        "maxPrise": 125,
        "ageMax": 2,
        "note": "IM, dose unique, sans dépasser 125 mg.",
        "source": "Algorithme « Prise en charge des IST » (SANTÉ D'ABORD), joint le 11/10/2026"
      },
      {
        "id": "cef-sept-enf",
        "indication": "Septicémie de l'enfant (convulsions) — dose avant transfert",
        "type": "mgkg",
        "mgkg": 100,
        "parJour": 1,
        "jours": 1,
        "ageMin": 2,
        "ageMax": 180,
        "note": "IV directe, puis référer immédiatement, avec la gentamicine.",
        "source": "Togo Ord. 5, traitement 3"
      },
      {
        "id": "cef-conj-mere",
        "indication": "Conjonctivite du nouveau-né : traitement de la mère",
        "type": "fixe",
        "texte": "250 mg en IM, dose unique",
        "parJour": 1,
        "jours": 1,
        "ageMin": 180,
        "note": "Traitement de la mère : 250 mg IM en dose unique (le 1 g des schémas IST concerne l'adulte traité pour une IST). Avec érythromycine 1 g, 2 fois par jour pendant 14 jours.",
        "source": "Togo Ord. 13 et 43"
      }
    ],
    "ci": [
      "Allergie aux céphalosporines ou antécédent de choc aux bêta-lactamines",
      "Nouveau-né ictérique (< 28 jours) : avis médical"
    ],
    "precautions": [
      "Ne pas mélanger avec des solutions contenant du calcium"
    ],
    "effets": [
      "Douleur au point d'injection",
      "Diarrhée, éruption"
    ]
  },
  {
    "id": "gentamicine",
    "nom": "Gentamicine",
    "classe": "Antibiotique (aminoside) injectable",
    "formes": [
      {
        "nom": "Ampoule injectable",
        "mg": 0,
        "conv": false
      }
    ],
    "regimes": [
      {
        "id": "genta-nne",
        "indication": "Infection néonatale possible — nourrisson de moins de 2 mois",
        "type": "mgkg",
        "mgkg": 4,
        "parJour": 1,
        "jours": 3,
        "ageMax": 2,
        "source": "Décision du validateur : 4 mg/kg par jour pendant 3 jours"
      },
      {
        "id": "genta-iu",
        "indication": "Infection urinaire — enfant",
        "type": "mgkg",
        "mgkg": 4,
        "parJour": 1,
        "jours": 3,
        "ageMin": 2,
        "ageMax": 180,
        "note": "Avec la ceftriaxone, puis relais par le céfixime.",
        "source": "Décision du validateur : 4 mg/kg par jour pendant 3 jours"
      }
    ],
    "ci": [
      "Allergie aux aminosides"
    ],
    "precautions": [
      "Risque rénal et auditif : respecter la durée",
      "Éviter en cas d'insuffisance rénale"
    ],
    "effets": [
      "Atteinte rénale, atteinte de l'oreille interne"
    ]
  },
  {
    "id": "cefixime",
    "nom": "Céfixime suspension",
    "classe": "Antibiotique (céphalosporine) oral",
    "formes": [
      {
        "nom": "Suspension buvable",
        "mg": 0,
        "conv": false
      }
    ],
    "regimes": [
      {
        "id": "cefix-iu",
        "indication": "Infection urinaire de l'enfant : relais par voie orale",
        "type": "mgkg",
        "mgkgJour": 8,
        "parJour": 2,
        "jours": 6,
        "ageMin": 2,
        "ageMax": 180,
        "note": "Après la ceftriaxone et la gentamicine.",
        "source": "Décision du validateur : 8 mg/kg/jour en 2 prises pendant 6 jours"
      }
    ],
    "ci": [
      "Allergie aux céphalosporines"
    ],
    "precautions": [
      "Allergie croisée possible avec les pénicillines"
    ],
    "effets": [
      "Diarrhée, nausées"
    ]
  },
  {
    "id": "ciprofloxacine",
    "nom": "Ciprofloxacine",
    "classe": "Antibiotique (fluoroquinolone)",
    "formes": [
      {
        "nom": "Comprimé 250 mg",
        "mg": 250
      },
      {
        "nom": "Comprimé 500 mg",
        "mg": 500
      }
    ],
    "regimes": [
      {
        "id": "cip-dys-enf",
        "indication": "Dysenterie bacillaire — enfant",
        "type": "mgkg",
        "parJour": 2,
        "jours": 5,
        "ageMax": 180,
        "note": "Revoir à 2 jours : s'il y a encore du sang dans les selles ou pas d'amélioration, référer.",
        "source": "Ord. 4, traitement 4 : 15 à 20 mg/kg/jour en 2 prises (texte du manuel, retenu par le validateur)",
        "mgkgJour": 15,
        "mgkgJourMax": 20,
        "maxJour": 1000
      },
      {
        "id": "cip-typh-enf",
        "indication": "Fièvre typhoïde — enfant > 6 mois",
        "type": "mgkg",
        "mgkgJour": 15,
        "mgkgJourMax": 20,
        "parJour": 2,
        "jours": 10,
        "maxJour": 1000,
        "ageMin": 6,
        "ageMax": 180,
        "source": "Ord. 1, traitement 4"
      },
      {
        "id": "cip-chol-enf",
        "indication": "Choléra — enfant (1re intention)",
        "type": "mgkg",
        "parJour": 2,
        "jours": 3,
        "ageMax": 180,
        "note": "Notifier. Réhydrater. Référer.",
        "source": "Ord. 4, traitement 8 : 15 à 20 mg/kg/jour en 2 prises (texte du manuel, retenu par le validateur)",
        "mgkgJour": 15,
        "mgkgJourMax": 20,
        "maxJour": 1000
      },
      {
        "id": "cip-dys-adulte",
        "indication": "Dysenterie bacillaire — adulte",
        "type": "fixe",
        "texte": "500 mg matin et soir",
        "parJour": 2,
        "jours": 10,
        "ageMin": 180,
        "note": "Alternative : cotrimoxazole 480 mg, 2 comprimés matin et soir pendant 10 jours.",
        "source": "Ord. 18, traitement 3"
      },
      {
        "id": "cip-typh-adulte",
        "indication": "Fièvre typhoïde — adulte",
        "type": "fixe",
        "texte": "500 mg matin et soir",
        "parJour": 2,
        "jours": 21,
        "ageMin": 180,
        "note": "15 à 21 jours. Fièvre persistante après le 7e jour : référer.",
        "source": "Ord. 16, traitement 4 et Ord. 18, traitement 5"
      },
      {
        "id": "cip-cystite",
        "indication": "Cystite — adulte",
        "type": "fixe",
        "texte": "500 mg : 1 comprimé matin et soir pendant 10 jours",
        "parJour": 2,
        "jours": 10,
        "ageMin": 180,
        "note": "Boire 2 à 3 litres d'eau par jour. Sans amélioration après 5 jours : référer.",
        "source": "Togo Ord. 23, traitement 8"
      },
      {
        "id": "cip-uret",
        "indication": "Écoulement urétral : 2e choix — adulte",
        "type": "fixe",
        "texte": "500 mg : 1 comprimé 2 fois par jour pendant 7 jours",
        "parJour": 2,
        "jours": 7,
        "ageMin": 180,
        "note": "Contre-indiquée chez la femme enceinte ou allaitante.",
        "source": "Algorithme « Prise en charge des IST » (SANTÉ D'ABORD), joint le 11/10/2026"
      },
      {
        "id": "cip-sip",
        "indication": "Douleurs basses / infection du pelvis : alternative à l'azithromycine — adulte",
        "type": "fixe",
        "texte": "500 mg en prise unique",
        "parJour": 1,
        "jours": 1,
        "ageMin": 180,
        "note": "Contre-indiquée chez la femme enceinte ou allaitante.",
        "source": "Algorithme « Prise en charge des IST » (SANTÉ D'ABORD), joint le 11/10/2026"
      },
      {
        "id": "cip-uro-adulte",
        "indication": "Pyélonéphrite, prostatite, orchite bactérienne — adulte",
        "type": "fixe",
        "texte": "500 mg : 1 comprimé matin et soir pendant 10 jours",
        "parJour": 2,
        "jours": 10,
        "ageMin": 180,
        "note": "Orchite : se reporter à l'algorithme IST si écoulement urétral.",
        "source": "Togo Ord. 31 (traitements 6, 7) et Ord. 32 (traitement 2)"
      },
      {
        "id": "cip-iu-enf",
        "indication": "Infection urinaire de l'enfant (alternative)",
        "type": "mgkg",
        "mgkgJour": 15,
        "mgkgJourMax": 20,
        "parJour": 2,
        "jours": 10,
        "maxJour": 1000,
        "ageMin": 6,
        "ageMax": 180,
        "note": "Pas d'amélioration : référer.",
        "source": "Togo Ord. 15"
      }
    ],
    "ci": [
      "Grossesse",
      "Allergie aux quinolones"
    ],
    "precautions": [
      "Enfant : utilisation justifiée par le manuel pour la dysenterie et la typhoïde",
      "Éviter l'exposition au soleil",
      "Tendinopathie : arrêter"
    ],
    "effets": [
      "Nausées, diarrhée",
      "Tendinopathie (rare)"
    ]
  },
  {
    "id": "metronidazole",
    "nom": "Métronidazole",
    "classe": "Antiparasitaire / antibiotique",
    "formes": [
      {
        "nom": "Suspension 125 mg/5 mL",
        "mg": 125,
        "ml": 5
      },
      {
        "nom": "Comprimé 250 mg",
        "mg": 250
      },
      {
        "nom": "Comprimé 500 mg",
        "mg": 500
      }
    ],
    "regimes": [
      {
        "id": "met-enf",
        "indication": "Dysenterie amibienne — enfant",
        "type": "mgkg",
        "mgkgJour": 30,
        "mgkgJourMax": 40,
        "parJour": 2,
        "jours": 7,
        "maxJour": 1500,
        "ageMin": 2,
        "ageMax": 180,
        "note": "Revoir après 3 jours : s'il y a encore du sang dans les selles, référer. 2e intention : tinidazole.",
        "source": "Ord. 4, traitement 5 ; 30 à 40 mg/kg/jour en 2 prises : décision du validateur"
      },
      {
        "id": "met-adulte",
        "indication": "Dysenterie amibienne — adulte",
        "type": "fixe",
        "texte": "500 mg, 3 fois par jour",
        "parJour": 3,
        "jours": 10,
        "ageMin": 180,
        "note": "Alternative : tinidazole 500 mg, 4 comprimés en prise unique par jour pendant 3 jours. Revoir après 3 jours.",
        "source": "Ord. 18, traitement 4"
      },
      {
        "id": "met-hp",
        "indication": "Éradication d'Helicobacter pylori — adulte (alternative à la clarithromycine)",
        "type": "fixe",
        "texte": "500 mg, 2 fois par jour pendant 14 jours, avec l'oméprazole et l'amoxicilline",
        "parJour": 2,
        "jours": 14,
        "ageMin": 180,
        "source": "RDC Méd. interne III.4 ; protocole retenu par le validateur"
      },
      {
        "id": "met-paras-enf",
        "indication": "Parasitoses intestinales (protozoaires) — enfant",
        "type": "mgkg",
        "mgkgJour": 40,
        "parJour": 3,
        "jours": 7,
        "ageMax": 180,
        "source": "Togo Ord. 14, traitement 2"
      },
      {
        "id": "met-abces-adulte",
        "indication": "Abcès cutané, en association à l'amoxicilline — adulte",
        "type": "fixe",
        "texte": "500 mg : 1 comprimé, 2 fois par jour pendant 10 jours",
        "parJour": 2,
        "jours": 10,
        "ageMin": 180,
        "source": "Togo Ord. 36, traitement 9"
      },
      {
        "id": "met-abces-enf",
        "indication": "Abcès cutané, en association à l'amoxicilline — enfant",
        "type": "mgkg",
        "mgkgJour": 30,
        "mgkgJourMax": 40,
        "parJour": 2,
        "jours": 10,
        "ageMax": 180,
        "source": "Togo Ord. 36, traitement 9"
      },
      {
        "id": "met-dent",
        "indication": "Infection dentaire — adulte",
        "type": "fixe",
        "texte": "250 mg : 2 comprimés, 3 fois par jour",
        "parJour": 3,
        "ageMin": 180,
        "source": "Togo Ord. 34, traitement 2"
      },
      {
        "id": "met-dent-enf",
        "indication": "Infection dentaire — enfant (dose pédiatrique)",
        "type": "mgkg",
        "mgkgJour": 30,
        "parJour": 2,
        "jours": 7,
        "maxJour": 1500,
        "ageMin": 2,
        "ageMax": 180,
        "note": "Avec l'amoxicilline et le paracétamol sirop ; référer si pas d'amélioration.",
        "source": "Dose retenue par le validateur : 30 mg/kg/jour en 2 prises, 7 jours"
      },
      {
        "id": "met-ist-pu",
        "indication": "IST (écoulement urétral ou vaginal, ulcération) — adulte",
        "type": "fixe",
        "texte": "500 mg : 4 comprimés (2 g) en prise unique",
        "parJour": 1,
        "jours": 1,
        "ageMin": 180,
        "source": "Algorithme « Prise en charge des IST » (SANTÉ D'ABORD), joint le 11/10/2026"
      },
      {
        "id": "met-sip",
        "indication": "Douleurs abdominales basses / infection du pelvis — adulte",
        "type": "fixe",
        "texte": "500 mg : 2 comprimés en prise unique, pendant 14 jours",
        "ageMin": 180,
        "source": "Algorithme « Prise en charge des IST » (SANTÉ D'ABORD), joint le 11/10/2026"
      },
      {
        "id": "met-vag-2",
        "indication": "Écoulement vaginal — moins de 15 ans, femme enceinte ou allaitante",
        "type": "fixe",
        "texte": "500 mg : 1 comprimé 2 fois par jour pendant 10 jours",
        "parJour": 2,
        "jours": 10,
        "source": "Algorithme « Prise en charge des IST » (SANTÉ D'ABORD), joint le 11/10/2026"
      },
      {
        "id": "met-endo",
        "indication": "Endométrite — adulte",
        "type": "fixe",
        "texte": "250 mg : 2 comprimés matin et soir pendant 10 jours",
        "parJour": 2,
        "jours": 10,
        "ageMin": 180,
        "source": "Togo Ord. 24, traitement 6"
      },
      {
        "id": "met-sein",
        "indication": "Mastite / abcès du sein — adulte",
        "type": "fixe",
        "texte": "500 mg : 1 comprimé matin, midi et soir pendant 10 jours",
        "parJour": 3,
        "jours": 10,
        "ageMin": 180,
        "source": "Togo Ord. 29, traitement 2"
      },
      {
        "id": "met-bouche",
        "indication": "Stomatite ulcéro-nécrotique — adulte",
        "type": "fixe",
        "texte": "250 mg : 2 comprimés matin et soir",
        "parJour": 2,
        "ageMin": 180,
        "note": "Référer.",
        "source": "Togo Ord. 42, traitement 6"
      }
    ],
    "ci": [
      "Premier trimestre de grossesse : avis médical",
      "Alcool pendant le traitement"
    ],
    "precautions": [
      "Goût métallique, nausées"
    ],
    "effets": [
      "Nausées, goût métallique",
      "Neuropathie si traitement prolongé"
    ]
  },
  {
    "id": "sro",
    "nom": "SRO (sels de réhydratation orale)",
    "classe": "Réhydratation",
    "formes": [
      {
        "nom": "Sachet SRO (1 sachet dans 1 L d'eau potable)",
        "mg": 0
      }
    ],
    "regimes": [
      {
        "id": "sro-b",
        "indication": "Signes évidents de déshydratation (Plan B) — 4 premières heures",
        "type": "totalkg",
        "dose": 75,
        "unit": "mL",
        "note": "À faire boire en 4 heures. Réévaluer après 4 h : amélioration partielle = continuer le plan B ; aggravation = plan C si possible, sinon référer.",
        "source": "Ord. 4 : SRO 75 mL/kg en 4 heures"
      },
      {
        "id": "sro-a",
        "indication": "Pas de déshydratation (Plan A) — après chaque selle liquide",
        "type": "fixe",
        "texte": "50 à 100 mL (¼ à ½ verre) après chaque selle liquide",
        "note": "Poursuivre l'alimentation et l'allaitement.",
        "source": "Ord. 4 (plan A)"
      }
    ],
    "ci": [
      "Déshydratation sévère / incapacité de boire : perfusion"
    ],
    "precautions": [
      "Préparer avec de l'eau potable, dans le volume indiqué sur le sachet",
      "Si vomissement : attendre 10 min puis reprendre plus lentement"
    ],
    "effets": [
      "Vomissements transitoires"
    ]
  },
  {
    "id": "zinc",
    "nom": "Zinc",
    "classe": "Complément — diarrhée",
    "formes": [
      {
        "nom": "Comprimé dispersible 20 mg",
        "mg": 20
      }
    ],
    "regimes": [
      {
        "id": "zinc-1",
        "indication": "Diarrhée — enfant jusqu'à 6 mois",
        "type": "fixe",
        "texte": "½ comprimé par jour, à dissoudre dans une cuillère d'eau ou de SRO",
        "parJour": 1,
        "jours": 10,
        "ageMax": 7,
        "note": "Dans tous les cas de diarrhée.",
        "source": "Ord. 4 ; durée de 10 jours retenue par le validateur"
      },
      {
        "id": "zinc-2",
        "indication": "Diarrhée — enfant de 7 mois et plus",
        "type": "fixe",
        "texte": "1 comprimé par jour, à dissoudre dans une cuillère d'eau ou de SRO",
        "parJour": 1,
        "jours": 14,
        "ageMin": 7,
        "ageMax": 180,
        "source": "Ord. 4"
      }
    ],
    "ci": [
      "Aucune connue aux doses usuelles"
    ],
    "precautions": [
      "Dissoudre dans un peu d'eau ou de SRO"
    ],
    "effets": [
      "Vomissements possibles (reprendre plus tard)"
    ]
  },
  {
    "id": "albendazole",
    "nom": "Albendazole",
    "classe": "Antihelminthique",
    "formes": [
      {
        "nom": "Comprimé 400 mg",
        "mg": 400
      }
    ],
    "regimes": [
      {
        "id": "alb-1",
        "indication": "Déparasitage — enfant 12 à 23 mois",
        "type": "fixe",
        "texte": "200 mg (½ comprimé de 400 mg), dose unique",
        "parJour": 1,
        "jours": 1,
        "ageMin": 12,
        "ageMax": 24,
        "source": "Ord. 9, traitement 1"
      },
      {
        "id": "alb-2",
        "indication": "Déparasitage — ≥ 24 mois",
        "type": "fixe",
        "texte": "400 mg (1 comprimé), dose unique",
        "parJour": 1,
        "jours": 1,
        "ageMin": 24,
        "source": "Ord. 9, traitement 1",
        "note": "Alternative : mébendazole 500 mg en une seule dose."
      },
      {
        "id": "alb-oxy",
        "indication": "Oxyurose — adulte",
        "type": "fixe",
        "texte": "400 mg (1 comprimé) en prise unique",
        "parJour": 1,
        "jours": 1,
        "ageMin": 180,
        "note": "Répéter le traitement après une semaine.",
        "source": "Togo Ord. 23, traitement 7.B"
      },
      {
        "id": "alb-anguil",
        "indication": "Anguillulose — adulte",
        "type": "fixe",
        "texte": "400 mg (1 comprimé) par jour pendant 3 jours",
        "parJour": 1,
        "jours": 3,
        "ageMin": 180,
        "source": "Togo Ord. 23, traitement 7.C"
      }
    ],
    "ci": [
      "Grossesse 1er trimestre",
      "Enfant < 12 mois"
    ],
    "precautions": [
      "Éviter si fièvre ou maladie aiguë sévère"
    ],
    "effets": [
      "Douleurs abdominales, nausées (rares)"
    ]
  },
  {
    "id": "vitamine-a",
    "nom": "Vitamine A",
    "classe": "Supplément — rougeole",
    "formes": [
      {
        "nom": "Capsule (selon dosage disponible)",
        "mg": 0
      }
    ],
    "regimes": [
      {
        "id": "vita-1",
        "indication": "Rougeole — enfant de 6 à 11 mois",
        "type": "fixe",
        "texte": "100 000 UI, dose unique",
        "ageMin": 6,
        "ageMax": 12,
        "source": "Ord. 1, traitement 8"
      },
      {
        "id": "vita-2",
        "indication": "Rougeole — enfant de 12 à 59 mois",
        "type": "fixe",
        "texte": "200 000 UI, dose unique",
        "ageMin": 12,
        "ageMax": 60,
        "source": "Ord. 1, traitement 8"
      }
    ],
    "ci": [
      "Aucune pour la dose unique"
    ],
    "precautions": [
      "Ne pas répéter sans avis"
    ],
    "effets": [
      "Vomissements, céphalées transitoires"
    ]
  },
  {
    "id": "salbutamol",
    "nom": "Salbutamol (spray)",
    "classe": "Bronchodilatateur",
    "formes": [
      {
        "nom": "Aérosol doseur (chambre d'inhalation de préférence)",
        "mg": 0
      }
    ],
    "regimes": [
      {
        "id": "sal-enf",
        "indication": "Crise d'asthme — enfant / nourrisson",
        "type": "fixe",
        "texte": "1 à 2 bouffées avec chambre d'inhalation, à renouveler toutes les 30 min à 1 h jusqu'à l'arrêt de la crise",
        "ageMax": 180,
        "note": "Détresse respiratoire : bétaméthasone IM (2 à 8 mg selon l'âge) et référer.",
        "source": "Ord. 2, traitement 5"
      },
      {
        "id": "sal-adulte",
        "indication": "Crise d'asthme — adulte",
        "type": "fixe",
        "texte": "1 à 2 bouffées avec chambre d'inhalation dès les premiers symptômes, à répéter si besoin après 15 min",
        "ageMin": 180,
        "note": "Crise persistante après 1 heure : référer en position demi-assise.",
        "source": "Ord. 17, traitement 6 et Ord. 19"
      },
      {
        "id": "sal-rdc-adulte",
        "indication": "Crise d'asthme légère à modérée — adulte",
        "type": "fixe",
        "texte": "2 bouffées toutes les 20 minutes pendant 1 heure",
        "ageMin": 180,
        "note": "Observation 1 à 2 heures ; si la crise persiste : corticoïde (prednisolone). Asthme sévère : nébulisation de salbutamol 5 mg si possible.",
        "source": "RDC Méd. interne I.2"
      }
    ],
    "ci": [
      "Aucune en urgence"
    ],
    "precautions": [
      "Tremblements, tachycardie possibles"
    ],
    "effets": [
      "Tremblements, palpitations"
    ]
  },
  {
    "id": "salbutamol-sirop",
    "nom": "Salbutamol sirop 2 mg/5 mL",
    "classe": "Bronchodilatateur — voie orale",
    "formes": [
      {
        "nom": "Sirop 2 mg/5 mL",
        "mg": 2,
        "ml": 5
      }
    ],
    "regimes": [
      {
        "id": "ssir-adulte",
        "indication": "Asthme — adulte et enfant de plus de 12 ans",
        "type": "fixe",
        "texte": "4 mg (10 mL de sirop), 3 fois par jour",
        "parJour": 3,
        "ageMin": 144,
        "source": "Décision du validateur (remplace le corticoïde inhalé)"
      },
      {
        "id": "ssir-6-12",
        "indication": "Asthme — enfant de 6 à 12 ans",
        "type": "fixe",
        "texte": "2 mg (5 mL de sirop), 3 fois par jour",
        "parJour": 3,
        "ageMin": 72,
        "ageMax": 144,
        "source": "Décision du validateur"
      },
      {
        "id": "ssir-2-6",
        "indication": "Asthme — enfant de 2 à 6 ans",
        "type": "fixe",
        "texte": "1 à 2 mg (2,5 à 5 mL de sirop), 3 fois par jour",
        "parJour": 3,
        "ageMin": 24,
        "ageMax": 72,
        "source": "Décision du validateur"
      },
      {
        "id": "ssir-0-2",
        "indication": "Asthme — enfant de moins de 2 ans",
        "type": "mgkg",
        "mgkg": 0.1,
        "parJour": 3,
        "ageMax": 24,
        "note": "Environ 0,1 mg/kg par prise, 3 fois par jour.",
        "source": "Décision du validateur"
      }
    ],
    "ci": [
      "Hypersensibilité au salbutamol"
    ],
    "precautions": [
      "Tremblements, tachycardie possibles",
      "Prudence en cas de cardiopathie ou d'hyperthyroïdie"
    ],
    "effets": [
      "Tremblements, palpitations, nervosité"
    ]
  },
  {
    "id": "omeprazole",
    "nom": "Oméprazole",
    "classe": "Antiulcéreux — inhibiteur de la pompe à protons",
    "formes": [
      {
        "nom": "Comprimé / gélule 20 mg",
        "mg": 20,
        "conv": false
      },
      {
        "nom": "Ampoule injectable 40 mg",
        "mg": 40,
        "conv": false
      }
    ],
    "regimes": [
      {
        "id": "ome-erad",
        "indication": "Gastrite / ulcère : éradication d'Helicobacter pylori (adulte)",
        "type": "fixe",
        "texte": "20 mg, 2 fois par jour, avec l'amoxicilline et la clarithromycine (ou le métronidazole)",
        "parJour": 2,
        "jours": 14,
        "ageMin": 180,
        "note": "Traitement de 14 jours. Puis oméprazole 20 mg, 1 fois par jour, si amélioration : 3 semaines (RDC, ulcère) à 30 jours (Togo). Sans amélioration : référer.",
        "source": "RDC Méd. interne III.3 et III.4 ; Togo Ord. 23, traitement 3 ; durée retenue par le validateur"
      },
      {
        "id": "ome-aine",
        "indication": "Ulcère lié aux AINS (adulte)",
        "type": "fixe",
        "texte": "40 mg en IV directe, puis 20 mg par voie orale 1 fois par jour pendant 4 semaines, 30 à 60 minutes avant le repas",
        "ageMin": 180,
        "note": "Arrêter l'AINS en cause. Associer un pansement gastrique (Alugel).",
        "source": "RDC Méd. interne III.4, ulcères liés aux AINS"
      },
      {
        "id": "ome-hemo",
        "indication": "Ulcère hémorragique (adulte) : avant le transfert",
        "type": "fixe",
        "texte": "80 mg par jour en IV directe (ou antisécrétoire IV : cimétidine 400 mg, 3 à 4 fois par jour)",
        "ageMin": 180,
        "note": "Traiter le choc hypovolémique, puis référer en urgence.",
        "source": "RDC Méd. interne III.4, ulcères compliqués (à référer)"
      }
    ],
    "ci": [
      "Allergie à l'oméprazole ou aux autres IPP"
    ],
    "precautions": [
      "Éliminer d'abord les signes d'alarme (âge > 50 ans, amaigrissement, difficulté à avaler, saignement, anémie) : référer pour endoscopie",
      "Pas de cicatrisation après 3 à 4 mois : avis chirurgical (risque de cancer gastrique méconnu)"
    ],
    "effets": [
      "Céphalées, nausées, diarrhée"
    ]
  },
  {
    "id": "clarithromycine",
    "nom": "Clarithromycine",
    "classe": "Antibiotique (macrolide)",
    "formes": [
      {
        "nom": "Comprimé 500 mg",
        "mg": 500
      }
    ],
    "regimes": [
      {
        "id": "clari-erad",
        "indication": "Éradication d'Helicobacter pylori (adulte)",
        "type": "fixe",
        "texte": "500 mg, 2 fois par jour, avec l'oméprazole et l'amoxicilline",
        "parJour": 2,
        "jours": 14,
        "ageMin": 180,
        "note": "Traitement de 14 jours (protocole retenu).",
        "source": "RDC Méd. interne III.3 et III.4 ; durée retenue par le validateur"
      }
    ],
    "ci": [
      "Allergie aux macrolides"
    ],
    "precautions": [
      "Grossesse : avis médical"
    ],
    "effets": [
      "Nausées, diarrhée, goût métallique"
    ]
  },
  {
    "id": "antiacides",
    "nom": "Antiacides (hydroxyde d'aluminium, trisilicate de magnésium)",
    "classe": "Pansement gastrique / antiacide",
    "formes": [
      {
        "nom": "Hydroxyde d'aluminium, comprimé à croquer 500 mg",
        "mg": 500,
        "conv": false
      },
      {
        "nom": "Trisilicate de magnésium, comprimé 500 mg",
        "mg": 500,
        "conv": false
      },
      {
        "nom": "Alugel, suspension buvable",
        "mg": 0
      }
    ],
    "regimes": [
      {
        "id": "anti-gastrite",
        "indication": "Gastrite aiguë : phase aiguë, 7 à 10 jours (adulte)",
        "type": "fixe",
        "texte": "Hydroxyde d'aluminium 500 mg : 1 comprimé à croquer, 3 fois par jour — ou trisilicate de magnésium 500 mg : 2 comprimés, 3 fois par jour pendant 10 jours",
        "ageMin": 180,
        "source": "RDC Méd. interne III.3"
      },
      {
        "id": "anti-douleur",
        "indication": "Ulcère / gastrite : au moment de la douleur (adulte)",
        "type": "fixe",
        "texte": "Faire sucer 2 comprimés d'hydroxyde d'aluminium au moment de la douleur",
        "ageMin": 180,
        "source": "Togo Ord. 23, traitement 3"
      },
      {
        "id": "anti-alugel",
        "indication": "Ulcère lié aux AINS (adulte)",
        "type": "fixe",
        "texte": "Alugel : 15 mL, 3 fois par jour, 30 à 60 minutes après le repas",
        "parJour": 3,
        "ageMin": 180,
        "source": "RDC Méd. interne III.4"
      },
      {
        "id": "anti-enf",
        "indication": "Douleurs abdominales (colite, ulcère / gastrite) — enfant",
        "type": "fixe",
        "texte": "Hydroxyde d'aluminium + hydroxyde de magnésium : 1 sachet ou 5 mL au moment des douleurs, 6 prises par jour au maximum, 1 h 30 après les repas",
        "ageMax": 180,
        "source": "Togo Ord. 14, traitements 4 et 7"
      }
    ],
    "ci": [
      "Insuffisance rénale sévère : avis médical"
    ],
    "precautions": [
      "Espacer des autres médicaments (ciprofloxacine, doxycycline…)"
    ],
    "effets": [
      "Constipation (aluminium), diarrhée (magnésium)"
    ]
  },
  {
    "id": "anti-h2",
    "nom": "Anti-H2 (cimétidine, ranitidine)",
    "classe": "Antisécrétoire gastrique",
    "formes": [
      {
        "nom": "Cimétidine, comprimé 200 mg",
        "mg": 200,
        "conv": false
      },
      {
        "nom": "Ranitidine, comprimé 150 mg",
        "mg": 150,
        "conv": false
      }
    ],
    "regimes": [
      {
        "id": "h2-gastrite",
        "indication": "Gastrite aiguë sans réponse aux antiacides (adulte)",
        "type": "fixe",
        "texte": "Cimétidine 200 à 400 mg toutes les 8 heures pendant 4 à 6 semaines — ou ranitidine 150 mg, 2 fois par jour",
        "ageMin": 180,
        "source": "RDC Méd. interne III.3"
      }
    ],
    "ci": [
      "Allergie connue"
    ],
    "precautions": [
      "Insuffisance rénale : adapter la dose"
    ],
    "effets": [
      "Céphalées, diarrhée, vertiges"
    ]
  },
  {
    "id": "glibenclamide",
    "nom": "Glibenclamide",
    "classe": "Antidiabétique oral (sulfamide hypoglycémiant)",
    "formes": [
      {
        "nom": "Comprimé 5 mg",
        "mg": 5,
        "conv": false
      }
    ],
    "regimes": [
      {
        "id": "glib-dt2",
        "indication": "Diabète de type 2 (adulte)",
        "type": "fixe",
        "texte": "Débuter à 5 mg le matin, 20 à 30 minutes avant le repas ; augmenter de 5 mg toutes les 2 semaines si la glycémie n'est pas normalisée ; maximum 15 mg par jour",
        "ageMin": 180,
        "note": "Si 15 mg sont insuffisants : ajouter la metformine. Ne jamais associer deux sulfamides. Ne pas associer à l'insuline (risque d'hypoglycémie).",
        "source": "RDC Méd. interne V.2, traitement du diabète de type 2"
      }
    ],
    "ci": [
      "Diabète de type 1",
      "Grossesse et allaitement",
      "Maladie hépatique",
      "Personne âgée ou insuffisance rénale (éviter : risque d'hypoglycémie prolongée)"
    ],
    "precautions": [
      "Hypoglycémie : éduquer le patient (repas réguliers, pas d'alcool à jeun)"
    ],
    "effets": [
      "Hypoglycémie",
      "Prise de poids"
    ]
  },
  {
    "id": "metformine",
    "nom": "Metformine",
    "classe": "Antidiabétique oral (biguanide)",
    "formes": [
      {
        "nom": "Comprimé 500 mg",
        "mg": 500,
        "conv": false
      }
    ],
    "regimes": [
      {
        "id": "met-dt2",
        "indication": "Diabète de type 2, surtout patient obèse (adulte)",
        "type": "fixe",
        "texte": "500 mg, 2 fois par jour, pendant ou après le repas ; augmenter de 500 mg toutes les 2 semaines jusqu'à normalisation de la glycémie ; maximum 2 g par jour",
        "parJour": 2,
        "ageMin": 180,
        "note": "Si la glycémie reste élevée : ajouter le glibenclamide (jusqu'à 15 mg/jour). En cas d'échec : insuline et arrêt du glibenclamide.",
        "source": "RDC Méd. interne V.2"
      }
    ],
    "ci": [
      "Diabète de type 1",
      "Grossesse et allaitement",
      "Insuffisance rénale ou atteinte hépatique",
      "Personne âgée (éviter)"
    ],
    "precautions": [
      "Acidose lactique rare mais grave : arrêter en cas de vomissements, déshydratation ou respiration rapide"
    ],
    "effets": [
      "Nausées, diarrhée, goût métallique"
    ]
  },
  {
    "id": "gluconate-calcium",
    "nom": "Gluconate de calcium 10 %",
    "classe": "Calcium injectable",
    "formes": [
      {
        "nom": "Ampoule 10 % (10 mL)",
        "mg": 0
      }
    ],
    "regimes": [
      {
        "id": "gca-enf",
        "indication": "Douleurs musculaires / spasmes (scorpion, araignée) — enfant",
        "type": "fixe",
        "texte": "5 mL en IV très lente (10 à 20 minutes)",
        "ageMax": 180,
        "source": "RDC Méd. interne I.6.2 et I.6.3"
      },
      {
        "id": "gca-adulte",
        "indication": "Douleurs musculaires / spasmes (scorpion, araignée) — adulte",
        "type": "fixe",
        "texte": "10 mL en IV très lente (10 à 20 minutes)",
        "ageMin": 180,
        "source": "RDC Méd. interne I.6.2 et I.6.3"
      }
    ],
    "ci": [
      "Patient sous digitaliques : avis médical"
    ],
    "precautions": [
      "Injection IV très lente uniquement"
    ],
    "effets": [
      "Bouffées de chaleur, bradycardie si trop rapide"
    ]
  },
  {
    "id": "daflon",
    "nom": "Daflon (fraction flavonoïque)",
    "classe": "Phlébotonique — hémorroïdes",
    "formes": [
      {
        "nom": "Comprimé 500 mg",
        "mg": 500,
        "conv": false
      }
    ],
    "regimes": [
      {
        "id": "daf-crise",
        "indication": "Crise hémorroïdaire (adulte)",
        "type": "fixe",
        "texte": "2 comprimés, 3 fois par jour pendant 4 jours, puis 2 comprimés, 2 fois par jour pendant 3 jours",
        "ageMin": 180,
        "note": "À associer aux bains de siège et aux suppositoires ou pommades antihémorroïdaires.",
        "source": "RDC Méd. interne III.9"
      }
    ],
    "ci": [
      "Aucune connue"
    ],
    "precautions": [
      "Hémorroïdes compliquées ou saignement abondant : référer en chirurgie"
    ],
    "effets": [
      "Troubles digestifs légers"
    ]
  },
  {
    "id": "allopurinol",
    "nom": "Allopurinol",
    "classe": "Antigoutteux — traitement de fond",
    "formes": [
      {
        "nom": "Comprimé 100 mg / 300 mg",
        "mg": 100,
        "conv": false
      }
    ],
    "regimes": [
      {
        "id": "allo-fond",
        "indication": "Goutte : traitement de fond (adulte)",
        "type": "fixe",
        "texte": "100 à 300 mg, 2 fois par jour, après le repas (dose moyenne 300 mg par jour)",
        "ageMin": 180,
        "note": "À débuter seulement quand la douleur est maîtrisée (environ 2 semaines après la crise). Réduire la dose en cas d'insuffisance rénale ou hépatique. Ne pas donner pendant la crise aiguë.",
        "source": "RDC Méd. interne V.4, goutte"
      }
    ],
    "ci": [
      "Crise de goutte aiguë en cours (ne pas débuter)"
    ],
    "precautions": [
      "Insuffisance rénale ou hépatique : réduire la dose"
    ],
    "effets": [
      "Éruption cutanée, troubles digestifs"
    ]
  },
  {
    "id": "indometacine",
    "nom": "Indométacine",
    "classe": "Anti-inflammatoire non stéroïdien",
    "formes": [
      {
        "nom": "Gélule / comprimé 25 mg ou 50 mg",
        "mg": 0
      }
    ],
    "regimes": [
      {
        "id": "indo-goutte",
        "indication": "Crise de goutte aiguë (adulte)",
        "type": "fixe",
        "texte": "50 mg toutes les 4 à 6 heures pendant 2 jours, puis 25 à 50 mg toutes les 8 heures pendant la durée de la crise",
        "ageMin": 180,
        "note": "Commencer par une dose élevée puis diminuer progressivement. Ne pas utiliser en traitement d'entretien.",
        "source": "RDC Méd. interne V.4, goutte"
      }
    ],
    "ci": [
      "Ulcère gastro-duodénal",
      "Insuffisance rénale",
      "Grossesse"
    ],
    "precautions": [
      "Prendre pendant les repas"
    ],
    "effets": [
      "Douleurs gastriques, céphalées, vertiges"
    ]
  },
  {
    "id": "diclofenac",
    "nom": "Diclofénac",
    "classe": "Anti-inflammatoire non stéroïdien",
    "formes": [
      {
        "nom": "Comprimé 25 mg / 50 mg",
        "mg": 50,
        "conv": false
      }
    ],
    "regimes": [
      {
        "id": "diclo-pr",
        "indication": "Arthrite rhumatoïde (adulte)",
        "type": "fixe",
        "texte": "50 mg, 3 fois par jour",
        "parJour": 3,
        "ageMin": 180,
        "note": "Référer tous les cas suspects pour le traitement de fond.",
        "source": "RDC Méd. interne VI.3, arthrite rhumatoïde"
      },
      {
        "id": "diclo-goutte",
        "indication": "Crise de goutte aiguë (adulte)",
        "type": "fixe",
        "texte": "25 à 50 mg toutes les 8 heures, après le repas",
        "ageMin": 180,
        "source": "RDC Méd. interne V.4, goutte"
      },
      {
        "id": "diclo-arthrose",
        "indication": "Arthrose compliquée (adulte)",
        "type": "fixe",
        "texte": "2 comprimés de 50 mg (100 mg) matin et soir, soit 200 mg par jour, après le repas",
        "parJour": 2,
        "ageMin": 180,
        "source": "RDC Méd. interne VI.3 ; dose retenue par le validateur",
        "note": "Éviter en cas d'ulcère ou de gastrite : remplacer par Parco Denk comprimé ou Klipal codéine 300 comprimé, 1 comprimé 3 fois par jour."
      }
    ],
    "ci": [
      "Ulcère gastro-duodénal",
      "Insuffisance rénale, cardiaque ou hépatique sévère",
      "Grossesse",
      "Allergie à l'aspirine / aux AINS"
    ],
    "precautions": [
      "Prendre pendant les repas",
      "Durée la plus courte possible"
    ],
    "effets": [
      "Douleurs gastriques, saignement digestif",
      "Insuffisance rénale si déshydratation"
    ]
  },
  {
    "id": "penicilline-v",
    "nom": "Pénicilline V (phénoxyméthylpénicilline)",
    "classe": "Antibiotique (pénicilline orale)",
    "formes": [
      {
        "nom": "Comprimé ou sirop (selon disponibilité)",
        "mg": 0
      }
    ],
    "regimes": [
      {
        "id": "pv-dr-1",
        "indication": "Drépanocytose : prophylaxie, de 2 mois à 2 ans",
        "type": "fixe",
        "texte": "125 mg, 2 fois par jour",
        "parJour": 2,
        "ageMin": 2,
        "ageMax": 36,
        "note": "Systématique jusqu'à l'âge de 15 ans (50 mg/kg/24 h en 2 à 3 prises). Allergie : érythromycine aux mêmes doses.",
        "source": "RDC Pédiatrie, drépanocytose"
      },
      {
        "id": "pv-dr-2",
        "indication": "Drépanocytose : prophylaxie, de 3 à 6 ans",
        "type": "fixe",
        "texte": "250 mg, 2 fois par jour",
        "parJour": 2,
        "ageMin": 36,
        "ageMax": 84,
        "note": "Systématique jusqu'à l'âge de 15 ans.",
        "source": "RDC Pédiatrie, drépanocytose"
      },
      {
        "id": "pv-dr-3",
        "indication": "Drépanocytose : prophylaxie, de 7 à 12 ans",
        "type": "fixe",
        "texte": "250 mg, 3 fois par jour",
        "parJour": 3,
        "ageMin": 84,
        "ageMax": 156,
        "note": "Systématique jusqu'à l'âge de 15 ans.",
        "source": "RDC Pédiatrie, drépanocytose"
      },
      {
        "id": "pv-dr-4",
        "indication": "Drépanocytose : prophylaxie, plus de 12 ans (jusqu'à 15 ans)",
        "type": "fixe",
        "texte": "500 mg, 2 fois par jour",
        "parJour": 2,
        "ageMin": 156,
        "ageMax": 180,
        "note": "Jusqu'à l'âge de 15 ans.",
        "source": "RDC Pédiatrie, drépanocytose"
      },
      {
        "id": "pv-raa-enf",
        "indication": "Rhumatisme articulaire aigu : éradication du streptocoque — enfant",
        "type": "tranches",
        "parJour": 2,
        "jours": 10,
        "ageMin": 12,
        "ageMax": 180,
        "tranches": [
          {
            "poidsMin": 0,
            "poidsMax": 27.01,
            "texte": "250 mg par prise"
          },
          {
            "poidsMin": 27.01,
            "poidsMax": 999,
            "texte": "500 mg par prise"
          }
        ],
        "note": "Enfant de 27 kg ou moins : 250 mg ; enfant de plus de 27 kg et adolescent : 500 mg. Allergie : érythromycine aux mêmes doses.",
        "source": "Dose retenue par le validateur ; durée de 10 jours : RDC Méd. interne VI.4"
      },
      {
        "id": "pv-raa-adulte",
        "indication": "Rhumatisme articulaire aigu : éradication du streptocoque — adulte",
        "type": "fixe",
        "texte": "500 mg, 2 fois par jour pendant 10 jours",
        "parJour": 2,
        "jours": 10,
        "ageMin": 180,
        "note": "Allergie à la pénicilline : érythromycine aux mêmes doses.",
        "source": "Même dose que l'adolescent (500 mg 2 fois par jour) ; durée : RDC Méd. interne VI.4"
      }
    ],
    "ci": [
      "Allergie aux pénicillines"
    ],
    "precautions": [
      "Rechercher une allergie avant la première dose"
    ],
    "effets": [
      "Diarrhée, éruption cutanée"
    ]
  },
  {
    "id": "benzathine-penicilline",
    "nom": "Benzathine pénicilline (Extencilline)",
    "classe": "Antibiotique (pénicilline retard, IM)",
    "formes": [
      {
        "nom": "Flacon injectable 600 000 UI / 1,2 MUI / 2,4 MUI (selon présentation)",
        "mg": 0
      }
    ],
    "regimes": [
      {
        "id": "bp-raa-1",
        "indication": "Rhumatisme articulaire aigu : prévention des rechutes, enfant de moins de 30 kg",
        "type": "fixe",
        "texte": "600 000 UI en IM, 1 fois par mois",
        "ageMax": 180,
        "poidsMax": 30,
        "note": "À continuer jusqu'à 21 ans, ou sans limite si atteinte valvulaire. Allergie : érythromycine par voie orale.",
        "source": "RDC Méd. interne VI.4"
      },
      {
        "id": "bp-raa-2",
        "indication": "Rhumatisme articulaire aigu : prévention des rechutes, enfant de plus de 30 kg",
        "type": "fixe",
        "texte": "900 000 UI en IM, 1 fois par mois",
        "ageMax": 180,
        "poidsMin": 30,
        "note": "À continuer jusqu'à 21 ans, ou sans limite si atteinte valvulaire.",
        "source": "RDC Méd. interne VI.4"
      },
      {
        "id": "bp-raa-3",
        "indication": "Rhumatisme articulaire aigu : prévention des rechutes, adulte",
        "type": "fixe",
        "texte": "1,2 million d'UI en IM, 1 fois par mois",
        "ageMin": 180,
        "note": "À continuer jusqu'à 21 ans, ou sans limite si atteinte valvulaire.",
        "source": "RDC Méd. interne VI.4"
      },
      {
        "id": "bp-syph",
        "indication": "Ulcération génitale ou ano-rectale (syphilis) — adulte",
        "type": "fixe",
        "texte": "2,4 millions d'UI en IM, dose unique",
        "ageMin": 180,
        "note": "Traiter le ou les partenaires ; préservatifs ; dépistage du VIH.",
        "source": "Algorithme « Prise en charge des IST » (SANTÉ D'ABORD), joint le 11/10/2026"
      },
      {
        "id": "bp-abces",
        "indication": "Abcès de l'amygdale : dose avant transfert, enfant de 5 ans et plus",
        "type": "fixe",
        "texte": "1,2 million d'UI en IM, dose unique",
        "ageMin": 60,
        "ageMax": 180,
        "note": "Puis référer.",
        "source": "Togo Ord. 11, traitement 2"
      },
      {
        "id": "bp-abces2",
        "indication": "Abcès de l'amygdale : dose avant transfert, enfant de moins de 5 ans",
        "type": "fixe",
        "texte": "600 000 UI en IM, dose unique",
        "ageMax": 60,
        "note": "Puis référer.",
        "source": "Togo Ord. 11, traitement 2"
      },
      {
        "id": "bp-abces-adu",
        "indication": "Abcès de l'amygdale : dose avant transfert, adulte",
        "type": "fixe",
        "texte": "2,4 millions d'UI en IM, dose unique",
        "ageMin": 180,
        "note": "Puis référer immédiatement.",
        "source": "Togo Ord. 40 (mal de gorge)"
      }
    ],
    "ci": [
      "Allergie aux pénicillines"
    ],
    "precautions": [
      "Injection IM profonde, jamais en IV",
      "Rechercher une allergie avant la première dose"
    ],
    "effets": [
      "Douleur au point d'injection",
      "Réaction allergique (rare)"
    ]
  },
  {
    "id": "acide-folique",
    "nom": "Acide folique",
    "classe": "Vitamine — anémie / drépanocytose",
    "formes": [
      {
        "nom": "Comprimé 5 mg",
        "mg": 5,
        "conv": false
      }
    ],
    "regimes": [
      {
        "id": "af-enf-1",
        "indication": "Drépanocytose / anémie : enfant de 2 mois à 5 ans",
        "type": "fixe",
        "texte": "1 comprimé de 5 mg par jour pendant 14 jours",
        "parJour": 1,
        "jours": 14,
        "ageMin": 2,
        "ageMax": 60,
        "source": "Togo Ord. 6, traitement 5"
      },
      {
        "id": "af-enf-2",
        "indication": "Drépanocytose / anémie : enfant de plus de 5 ans",
        "type": "fixe",
        "texte": "2 comprimés de 5 mg par jour pendant 14 jours",
        "parJour": 1,
        "jours": 14,
        "ageMin": 60,
        "ageMax": 180,
        "source": "Togo Ord. 6, traitement 5"
      },
      {
        "id": "af-adulte",
        "indication": "Crise drépanocytaire (adulte)",
        "type": "fixe",
        "texte": "1 comprimé de 5 mg le matin et le soir, aux repas",
        "parJour": 2,
        "ageMin": 180,
        "source": "Togo Ord. 21, traitement 6 et Ord. 23, traitement 11"
      },
      {
        "id": "af-rdc",
        "indication": "Drépanocytose : traitement de fond (phase entre les crises)",
        "type": "fixe",
        "texte": "1 comprimé de 5 mg par jour, 10 à 15 jours par mois ; 2 comprimés de 5 mg par jour pendant les crises",
        "source": "RDC Pédiatrie, drépanocytose"
      },
      {
        "id": "af-anemie-enf",
        "indication": "Anémie par carence — enfant (3 mois)",
        "type": "fixe",
        "texte": "1 comprimé de 5 mg par jour pendant 3 mois",
        "parJour": 1,
        "jours": 90,
        "ageMax": 180,
        "source": "Togo Ord. 9, traitement 1"
      },
      {
        "id": "af-anemie-adulte",
        "indication": "Anémie macrocytaire ou hémolyse simple — adulte",
        "type": "fixe",
        "texte": "1 à 3 comprimés de 5 mg par jour",
        "ageMin": 180,
        "note": "Hémolyse simple : pas de fer.",
        "source": "RDC Méd. interne II.1.4"
      }
    ],
    "ci": [
      "Aucune connue"
    ],
    "precautions": [
      "Drépanocytose : ne pas donner de fer"
    ],
    "effets": [
      "Très bien toléré"
    ]
  },
  {
    "id": "aspirine",
    "nom": "Aspirine (acide acétylsalicylique, AAS)",
    "classe": "Anti-inflammatoire / antalgique / antiagrégant",
    "formes": [
      {
        "nom": "Comprimé 500 mg",
        "mg": 500
      },
      {
        "nom": "Comprimé 100 mg (cardioaspirine)",
        "mg": 100
      }
    ],
    "regimes": [
      {
        "id": "aas-raa-1",
        "indication": "Rhumatisme articulaire aigu : phase initiale (enfant)",
        "type": "mgkg",
        "mgkgJour": 80,
        "parJour": 4,
        "jours": 14,
        "maxJour": 4000,
        "ageMax": 180,
        "note": "Environ 2 semaines. À donner pendant les repas, avec protection gastrique si nécessaire. Cardite : prednisolone, référer.",
        "source": "Schéma retenu par le validateur"
      },
      {
        "id": "aas-raa-2",
        "indication": "Rhumatisme articulaire aigu : phase de décroissance (enfant)",
        "type": "mgkg",
        "mgkgJour": 60,
        "parJour": 3,
        "maxJour": 4000,
        "ageMax": 180,
        "note": "Pendant 3 à 6 semaines, puis diminution progressive jusqu'à l'arrêt. Traitement total de 4 à 8 semaines selon l'évolution clinique et biologique (CRP, VS). Ne pas dépasser la dose adulte (environ 4 g par jour). Pendant les repas, avec protection gastrique si nécessaire.",
        "source": "Schéma retenu par le validateur"
      },
      {
        "id": "aas-arthrose",
        "indication": "Arthrose, cas simple (adulte)",
        "type": "fixe",
        "texte": "500 mg, 2 à 3 fois par jour, pendant les repas",
        "ageMin": 180,
        "source": "RDC Méd. interne VI.3, arthrose du genou"
      },
      {
        "id": "aas-diab",
        "indication": "Diabète : prévention des complications (adulte)",
        "type": "fixe",
        "texte": "Cardioaspirine 100 mg par jour, à vie",
        "ageMin": 180,
        "source": "RDC Méd. interne V.2"
      },
      {
        "id": "aas-cvo",
        "indication": "Crise drépanocytaire : antalgique (adulte)",
        "type": "fixe",
        "texte": "500 mg : 2 comprimés, 3 fois par jour",
        "parJour": 3,
        "ageMin": 180,
        "note": "En alternative au paracétamol. Acétylsalicylate de lysine injectable 1 g en IV directe, 2 fois par jour, si douleur forte.",
        "source": "Togo Ord. 21 et Ord. 23, traitement 11"
      },
      {
        "id": "aas-orl",
        "indication": "Otite — adulte",
        "type": "fixe",
        "texte": "1000 mg matin, midi et soir, pendant les repas",
        "parJour": 3,
        "ageMin": 180,
        "source": "Togo Ord. 35, traitement 1"
      },
      {
        "id": "aas-dent",
        "indication": "Infection dentaire / douleur dentaire — adulte",
        "type": "fixe",
        "texte": "500 mg : 2 comprimés, 3 fois par jour aux repas",
        "parJour": 3,
        "ageMin": 180,
        "note": "En cas de fracture : seulement s'il n'y a pas de saignement.",
        "source": "Togo Ord. 34, traitements 1, 2 et 4"
      },
      {
        "id": "aas-gorge-adu",
        "indication": "Angine — adulte",
        "type": "fixe",
        "texte": "500 mg : 2 comprimés matin, midi et soir",
        "parJour": 3,
        "ageMin": 180,
        "note": "Pendant les repas.",
        "source": "Togo Ord. 40 (mal de gorge)"
      }
    ],
    "ci": [
      "Ulcère gastro-duodénal",
      "Allergie aux AINS",
      "Grossesse",
      "Paludisme ou fièvre hémorragique suspecté, varicelle, grippe chez l'enfant (risque de syndrome de Reye)"
    ],
    "precautions": [
      "Prendre pendant les repas"
    ],
    "effets": [
      "Douleurs gastriques, saignement digestif"
    ]
  },
  {
    "id": "antihta",
    "nom": "Antihypertenseurs (adulte)",
    "classe": "Hypertension artérielle",
    "formes": [
      {
        "nom": "Selon le produit disponible",
        "mg": 0,
        "conv": false
      }
    ],
    "regimes": [
      {
        "id": "hta-amlo",
        "indication": "Amlodipine (inhibiteur calcique) — adulte",
        "type": "fixe",
        "texte": "5 mg le matin, jusqu'à 10 mg",
        "parJour": 1,
        "ageMin": 180,
        "note": "Œdèmes des chevilles, céphalées. Privilégié chez le sujet noir ou âgé.",
        "source": "Fiche « HTA de l'adulte au centre de santé » (11/10/2026)"
      },
      {
        "id": "hta-hctz",
        "indication": "Hydrochlorothiazide (thiazidique) — adulte",
        "type": "fixe",
        "texte": "12,5 à 25 mg le matin",
        "parJour": 1,
        "ageMin": 180,
        "note": "Hypokaliémie, goutte, déshydratation en cas de diarrhée ou de vomissements. Privilégié chez le sujet noir ou âgé.",
        "source": "Fiche « HTA de l'adulte au centre de santé » (11/10/2026)"
      },
      {
        "id": "hta-nifed",
        "indication": "Nifédipine LP (inhibiteur calcique) — adulte",
        "type": "fixe",
        "texte": "20 mg, 2 fois par jour (ne pas croquer)",
        "parJour": 2,
        "ageMin": 180,
        "source": "Fiche « HTA de l'adulte au centre de santé » (11/10/2026)"
      },
      {
        "id": "hta-capto",
        "indication": "Captopril (IEC) — adulte",
        "type": "fixe",
        "texte": "25 à 50 mg, 2 à 3 fois par jour",
        "ageMin": 180,
        "note": "Toux (passer à un sartan), angio-œdème. Contrôler créatinine et kaliémie 1 à 2 semaines après le début. Interdit pendant la grossesse.",
        "source": "Fiche « HTA de l'adulte au centre de santé » (11/10/2026)"
      },
      {
        "id": "hta-enala",
        "indication": "Énalapril (IEC) — adulte",
        "type": "fixe",
        "texte": "5 à 20 mg par jour, jusqu'à 40 mg",
        "ageMin": 180,
        "note": "Toux (passer à un sartan), angio-œdème. Contrôler créatinine et kaliémie 1 à 2 semaines après le début. Interdit pendant la grossesse.",
        "source": "Fiche « HTA de l'adulte au centre de santé » (11/10/2026)"
      },
      {
        "id": "hta-aten",
        "indication": "Aténolol (bêtabloquant) — adulte, pas en 1re intention",
        "type": "fixe",
        "texte": "50 à 100 mg par jour",
        "parJour": 1,
        "ageMin": 180,
        "note": "Contre-indiqué dans l'asthme, la bradycardie et le bloc auriculo-ventriculaire. Ne pas l'arrêter brutalement.",
        "source": "Fiche « HTA de l'adulte au centre de santé » (11/10/2026)"
      },
      {
        "id": "hta-gross",
        "indication": "HTA de la grossesse",
        "type": "fixe",
        "texte": "Méthyldopa (Aldomet) 250 mg, 2 à 3 fois par jour ; ou nifédipine",
        "ageMin": 180,
        "note": "Référer à la maternité.",
        "source": "Fiche « HTA de l'adulte au centre de santé » (11/10/2026)"
      }
    ],
    "ci": [
      "IEC et ARA II : interdits pendant la grossesse",
      "Ne jamais associer IEC + ARA II"
    ],
    "precautions": [
      "Revoir à 4 semaines ; objectif < 140/90 mmHg (< 130/80 chez le diabétique ou l'insuffisant rénal)",
      "Clonidine : l'arrêt brutal provoque un rebond hypertensif dangereux",
      "AINS et corticoïdes : à éviter chez l'hypertendu"
    ],
    "effets": [
      "IEC : toux, angio-œdème",
      "Amlodipine : œdèmes des chevilles",
      "Thiazidiques : hypokaliémie"
    ]
  },
  {
    "id": "azithromycine",
    "nom": "Azithromycine",
    "classe": "Antibiotique (macrolide) — IST",
    "formes": [
      {
        "nom": "Comprimé 500 mg (ou 250 mg)",
        "mg": 500,
        "conv": false
      }
    ],
    "regimes": [
      {
        "id": "azi-ist",
        "indication": "IST (écoulement, douleurs basses, ulcération, bubon, scrotum, conjonctivite : mère et partenaire) — adulte",
        "type": "fixe",
        "texte": "500 mg : 2 comprimés (1 g) en prise unique",
        "parJour": 1,
        "jours": 1,
        "ageMin": 180,
        "source": "Algorithme « Prise en charge des IST » (SANTÉ D'ABORD), joint le 11/10/2026",
        "note": "Traiter le ou les partenaires ; préservatifs ; dépistage du VIH."
      },
      {
        "id": "azi-gorge-adu",
        "indication": "Angine bactérienne — adulte",
        "type": "fixe",
        "texte": "500 mg : 1 comprimé par jour pendant 3 jours",
        "parJour": 1,
        "jours": 3,
        "ageMin": 180,
        "source": "Togo Ord. 40 (mal de gorge)"
      }
    ],
    "ci": [
      "Allergie aux macrolides"
    ],
    "precautions": [
      "Peut être utilisée chez la femme enceinte (avis médical)"
    ],
    "effets": [
      "Nausées, diarrhée, douleurs abdominales"
    ]
  },
  {
    "id": "tinidazole",
    "nom": "Tinidazole",
    "classe": "Antiparasitaire / antibactérien",
    "formes": [
      {
        "nom": "Comprimé 500 mg",
        "mg": 500
      }
    ],
    "regimes": [
      {
        "id": "tini-trich",
        "indication": "Trichomonase / vaginose / urétrite (adulte)",
        "type": "fixe",
        "texte": "4 comprimés de 500 mg (2 g) en prise unique",
        "ageMin": 180,
        "note": "Urétrite : associer l'azithromycine 1 g en prise unique. Traiter le ou les partenaires.",
        "source": "Togo Ord. 26, traitement 3 ; Ord. 31, traitement 5"
      },
      {
        "id": "tini-amib-adulte",
        "indication": "Dysenterie amibienne (adulte)",
        "type": "fixe",
        "texte": "4 comprimés de 500 mg en prise unique par jour pendant 3 jours",
        "parJour": 1,
        "jours": 3,
        "ageMin": 180,
        "note": "Revoir après 3 jours ; du sang encore présent dans les selles : référer.",
        "source": "Togo Ord. 18, traitement 4"
      },
      {
        "id": "tini-amib-enf",
        "indication": "Dysenterie amibienne (enfant), 2e intention",
        "type": "mgkg",
        "mgkg": 50,
        "mgkgMax": 70,
        "parJour": 1,
        "jours": 3,
        "maxPrise": 2000,
        "ageMax": 180,
        "note": "En une seule prise par jour. Revoir après 3 jours.",
        "source": "Togo Ord. 4, traitement 5"
      },
      {
        "id": "tini-paras-enf",
        "indication": "Parasitoses intestinales (protozoaires) — enfant",
        "type": "mgkg",
        "mgkgJour": 50,
        "mgkgJourMax": 70,
        "parJour": 1,
        "jours": 3,
        "ageMax": 180,
        "source": "Togo Ord. 14, traitement 2"
      }
    ],
    "ci": [
      "Premier trimestre de la grossesse",
      "Alcool pendant le traitement"
    ],
    "precautions": [
      "Goût métallique, nausées"
    ],
    "effets": [
      "Nausées, goût métallique"
    ]
  },
  {
    "id": "doxycycline",
    "nom": "Doxycycline",
    "classe": "Antibiotique (cycline)",
    "formes": [
      {
        "nom": "Comprimé 100 mg",
        "mg": 100
      }
    ],
    "regimes": [
      {
        "id": "doxy-gono",
        "indication": "Infection à chlamydia associée (arthrite gonococcique) (adulte)",
        "type": "fixe",
        "texte": "100 mg toutes les 12 heures pendant 14 jours",
        "parJour": 2,
        "jours": 14,
        "ageMin": 180,
        "source": "RDC Méd. interne VI.3, arthrite gonococcique",
        "note": "Contre-indiquée chez la femme enceinte et allaitante."
      },
      {
        "id": "doxy-chol",
        "indication": "Choléra — enfant de plus de 8 ans",
        "type": "mgkg",
        "mgkgJour": 4,
        "parJour": 1,
        "maxPrise": 200,
        "ageMin": 96,
        "ageMax": 180,
        "note": "En une prise par jour ; maximum 200 mg par jour.",
        "source": "Togo Ord. 4, traitement 8"
      },
      {
        "id": "doxy-ist-7",
        "indication": "IST : écoulement urétral ou vaginal — adulte",
        "type": "fixe",
        "texte": "200 mg : 1 comprimé par jour, au repas, pendant 7 jours",
        "parJour": 1,
        "jours": 7,
        "ageMin": 180,
        "note": "Contre-indiquée chez la femme enceinte ou allaitante et chez les moins de 15 ans.",
        "source": "Algorithme « Prise en charge des IST » (SANTÉ D'ABORD), joint le 11/10/2026"
      },
      {
        "id": "doxy-ist-21",
        "indication": "IST : douleurs basses, ulcération, bubon, scrotum — adulte",
        "type": "fixe",
        "texte": "200 mg : 1 comprimé par jour, au repas, pendant 21 jours",
        "parJour": 1,
        "jours": 21,
        "ageMin": 180,
        "note": "Contre-indiquée chez la femme enceinte ou allaitante et chez les moins de 15 ans.",
        "source": "Algorithme « Prise en charge des IST » (SANTÉ D'ABORD), joint le 11/10/2026"
      }
    ],
    "ci": [
      "Grossesse et allaitement",
      "Enfant de moins de 8 ans"
    ],
    "precautions": [
      "Prendre au repas avec un grand verre d'eau",
      "Éviter l'exposition au soleil"
    ],
    "effets": [
      "Nausées, photosensibilité"
    ]
  },
  {
    "id": "acyclovir",
    "nom": "Acyclovir",
    "classe": "Antiviral — herpès",
    "formes": [
      {
        "nom": "Comprimé 400 mg",
        "mg": 400
      }
    ],
    "regimes": [
      {
        "id": "acv-herpes",
        "indication": "Ulcération génitale ou ano-rectale (herpès) — adulte",
        "type": "fixe",
        "texte": "400 mg, 1 comprimé 2 fois par jour pendant 5 jours (Acyclovir Denk 200 mg : 2 comprimés 2 fois par jour pendant 5 jours)",
        "parJour": 2,
        "jours": 5,
        "ageMin": 180,
        "note": "Éosine aqueuse en application locale.",
        "source": "Algorithme « Prise en charge des IST » (SANTÉ D'ABORD), joint le 11/10/2026"
      }
    ],
    "ci": [
      "Allergie à l'acyclovir"
    ],
    "precautions": [
      "Bien s'hydrater",
      "Insuffisance rénale : adapter la dose"
    ],
    "effets": [
      "Nausées, céphalées"
    ]
  },
  {
    "id": "fluconazole",
    "nom": "Fluconazole",
    "classe": "Antifongique oral",
    "formes": [
      {
        "nom": "Gélule 150 mg",
        "mg": 150,
        "conv": false
      }
    ],
    "regimes": [
      {
        "id": "flu-ist",
        "indication": "Écoulement urétral ou vaginal (candidose) — adulte",
        "type": "fixe",
        "texte": "150 mg en prise unique",
        "parJour": 1,
        "jours": 1,
        "ageMin": 180,
        "source": "Algorithme « Prise en charge des IST » (SANTÉ D'ABORD), joint le 11/10/2026"
      }
    ],
    "ci": [
      "Grossesse (en 1er trimestre, avis médical)",
      "Allergie aux azolés"
    ],
    "precautions": [
      "Interactions médicamenteuses possibles"
    ],
    "effets": [
      "Nausées, maux de tête"
    ]
  },
  {
    "id": "ovules-vaginaux",
    "nom": "Ovules vaginaux (Polygynax, Gyflorine, clotrimazole)",
    "classe": "Traitement local vaginal",
    "formes": [
      {
        "nom": "Ovule",
        "mg": 0,
        "conv": false
      }
    ],
    "regimes": [
      {
        "id": "ovule-polygynax",
        "indication": "Écoulement vaginal : Polygynax B/6 ou Gyflorine",
        "type": "fixe",
        "texte": "1 ovule chaque soir au coucher (boîte de 6)",
        "parJour": 1,
        "source": "Algorithme « Prise en charge des IST » (SANTÉ D'ABORD), joint le 11/10/2026"
      },
      {
        "id": "ovule-clotri",
        "indication": "Écoulement vaginal : clotrimazole 500 mg",
        "type": "fixe",
        "texte": "1 ovule au coucher",
        "source": "Algorithme « Prise en charge des IST » (SANTÉ D'ABORD), joint le 11/10/2026"
      }
    ],
    "ci": [
      "Allergie connue"
    ],
    "precautions": [
      "Ne pas utiliser pendant les règles"
    ],
    "effets": [
      "Irritation locale"
    ]
  },
  {
    "id": "nystatine",
    "nom": "Nystatine",
    "classe": "Antifongique",
    "formes": [
      {
        "nom": "Comprimé 500 000 UI",
        "mg": 0
      },
      {
        "nom": "Comprimé / ovule vaginal, pommade",
        "mg": 0
      }
    ],
    "regimes": [
      {
        "id": "nys-vagin",
        "indication": "Vulvo-vaginite à candida (adulte)",
        "type": "fixe",
        "texte": "500 000 UI : 2 comprimés par voie orale, matin, midi et soir, pendant 10 jours",
        "parJour": 3,
        "jours": 10,
        "ageMin": 180,
        "note": "Toilette intime matin et soir pendant 7 jours (polyvidone iodée). Sans amélioration après 7 jours : ajouter le traitement de l'infection du pelvis.",
        "source": "Togo Ord. 26, traitement 2"
      },
      {
        "id": "nys-cervicite",
        "indication": "Cervicite : comprimé vaginal (adulte)",
        "type": "fixe",
        "texte": "1 comprimé vaginal, matin et soir, pendant 10 jours",
        "parJour": 2,
        "jours": 10,
        "ageMin": 180,
        "source": "Togo Ord. 26, traitement 4"
      },
      {
        "id": "nys-mycose",
        "indication": "Mycose cutanéo-muqueuse génitale (adulte)",
        "type": "fixe",
        "texte": "Pommade : 1 application locale, 3 fois par jour ; comprimés 500 000 UI : 2 comprimés, 3 fois par jour pendant 3 semaines ; ovule : 1 ovule, 2 fois par jour pendant 6 jours",
        "ageMin": 180,
        "note": "Hygiène corporelle et vestimentaire.",
        "source": "Togo Ord. 27, traitement 3"
      },
      {
        "id": "nys-bouche-adulte",
        "indication": "Candidose buccale — adulte",
        "type": "fixe",
        "texte": "500 000 UI : 2 comprimés écrasés, matin, midi, soir et au coucher (badigeonner la bouche puis avaler)",
        "parJour": 4,
        "jours": 7,
        "ageMin": 180,
        "note": "Avec un bain de bouche au bicarbonate de soude matin, midi et soir. Pas d'amélioration : référer.",
        "source": "Togo Ord. 42, traitement 3"
      },
      {
        "id": "nys-bouche-enf",
        "indication": "Candidose buccale — enfant",
        "type": "fixe",
        "texte": "500 000 UI : 1 comprimé écrasé, matin, midi, soir et au coucher (badigeonner la bouche puis avaler)",
        "parJour": 4,
        "jours": 7,
        "ageMax": 180,
        "source": "Togo Ord. 42, traitement 3"
      }
    ],
    "ci": [
      "Allergie connue"
    ],
    "precautions": [
      "Traiter aussi le partenaire en cas de récidive"
    ],
    "effets": [
      "Nausées légères"
    ]
  },
  {
    "id": "antihistaminique",
    "nom": "Antihistaminiques (dexchlorphéniramine, loratadine)",
    "classe": "Allergie / démangeaisons",
    "formes": [
      {
        "nom": "Dexchlorphéniramine comprimé 2 mg",
        "mg": 2,
        "conv": false
      },
      {
        "nom": "Loratadine comprimé 10 mg",
        "mg": 10,
        "conv": false
      }
    ],
    "regimes": [
      {
        "id": "ah-dex-adulte",
        "indication": "Dexchlorphéniramine (Polaramine) — adulte : eczéma, urticaire, prurigo, varicelle",
        "type": "fixe",
        "texte": "1 comprimé de 2 mg, 3 fois par jour",
        "parJour": 3,
        "ageMin": 180,
        "source": "Togo Ord. 36, traitements 3, 4, 5 et 11"
      },
      {
        "id": "ah-dex-enf",
        "indication": "Dexchlorphéniramine — enfant de 10 ans et plus : eczéma, urticaire, prurigo, varicelle",
        "type": "fixe",
        "texte": "1 cuillère à café (5 mL de sirop), 2 fois par jour",
        "parJour": 2,
        "ageMax": 180,
        "source": "Togo Ord. 36, traitements 3, 4, 5 et 11",
        "ageMin": 120,
        "note": "Avant 10 ans : utiliser le Primalan."
      },
      {
        "id": "ah-lora-adulte",
        "indication": "Loratadine — adulte et enfant de plus de 12 ans",
        "type": "fixe",
        "texte": "10 mg (1 comprimé), 1 fois par jour",
        "parJour": 1,
        "ageMin": 144,
        "source": "Togo Ord. 36, traitements 4, 5 et 11"
      },
      {
        "id": "ah-lora-1-5",
        "indication": "Loratadine sirop — enfant de 1 à 5 ans",
        "type": "fixe",
        "texte": "2,5 mL de sirop, 1 fois par jour",
        "parJour": 1,
        "ageMin": 12,
        "ageMax": 72,
        "source": "Togo Ord. 36, traitements 4, 5 et 11"
      },
      {
        "id": "ah-lora-6-12",
        "indication": "Loratadine sirop — enfant de 6 à 12 ans",
        "type": "fixe",
        "texte": "5 mL de sirop, 1 fois par jour",
        "parJour": 1,
        "ageMin": 72,
        "ageMax": 144,
        "source": "Togo Ord. 36, traitements 4, 5 et 11"
      }
    ],
    "ci": [
      "Allergie au produit"
    ],
    "precautions": [
      "Dexchlorphéniramine : somnolence ; prudence pour conduire un véhicule"
    ],
    "effets": [
      "Somnolence, bouche sèche"
    ]
  },
  {
    "id": "primalan",
    "nom": "Primalan (sirop et comprimé 5 mg)",
    "classe": "Antihistaminique — enfant de moins de 10 ans",
    "formes": [
      {
        "nom": "Sirop",
        "mg": 0,
        "conv": false
      },
      {
        "nom": "Comprimé 5 mg",
        "mg": 5,
        "conv": false
      }
    ],
    "regimes": [
      {
        "id": "prim-moins5",
        "indication": "Démangeaisons, eczéma, urticaire, prurigo, varicelle — enfant de moins de 5 ans",
        "type": "fixe",
        "texte": "Sirop (1,25 mg) : 2,5 mL par jour, de préférence le soir",
        "parJour": 1,
        "ageMax": 60,
        "source": "Décision du validateur"
      },
      {
        "id": "prim-5-10",
        "indication": "Démangeaisons, eczéma, urticaire, prurigo, varicelle — enfant de 5 à 10 ans (comprimé 5 mg)",
        "type": "fixe",
        "texte": "1 comprimé de 5 mg par jour",
        "parJour": 1,
        "ageMin": 60,
        "ageMax": 120,
        "source": "Décision du validateur"
      },
      {
        "id": "prim-moins2-nez",
        "indication": "Rhinite allergique, rhume — enfant de moins de 2 ans",
        "type": "fixe",
        "texte": "Sirop : 2,5 mL par jour",
        "parJour": 1,
        "ageMax": 24,
        "source": "Décision du validateur (Togo Ord. 41, enfant < 2 ans)"
      }
    ],
    "ci": [
      "Allergie connue au produit",
      "Glaucome à angle fermé, rétention urinaire"
    ],
    "precautions": [
      "Somnolence : prudence"
    ],
    "effets": [
      "Somnolence, bouche sèche"
    ]
  },
  {
    "id": "dermato-local",
    "nom": "Traitements locaux de la peau",
    "classe": "Dermatologie — application locale",
    "formes": [
      {
        "nom": "Selon le produit disponible",
        "mg": 0
      }
    ],
    "regimes": [
      {
        "id": "dl-gale",
        "indication": "Gale : benzoate de benzyle (Ascabiol)",
        "type": "fixe",
        "texte": "Badigeonner tout le corps sauf le visage, après la douche du soir, pendant 3 soirs successifs ; arrêter une semaine, puis recommencer 3 soirs",
        "source": "Togo Ord. 36, traitement 1",
        "note": "Pyréthrine en solution : pulvériser la literie et le linge enfermés pendant 24 heures. Nourrisson de moins de 2 ans : pas de benzoate de benzyle, référer.",
        "ageMin": 24
      },
      {
        "id": "dl-clotri",
        "indication": "Mycose localisée : clotrimazole crème",
        "type": "fixe",
        "texte": "2 applications par jour pendant 3 semaines",
        "parJour": 2,
        "jours": 21,
        "source": "Togo Ord. 36, traitement 6"
      },
      {
        "id": "dl-hydrocort",
        "indication": "Eczéma : hydrocortisone crème ou pommade",
        "type": "fixe",
        "texte": "1 application, 2 fois par jour pendant 5 jours",
        "parJour": 2,
        "jours": 5,
        "source": "Togo Ord. 36, traitement 4"
      },
      {
        "id": "dl-crotamiton",
        "indication": "Prurigo : crotamiton (Eurax) crème",
        "type": "fixe",
        "texte": "2 applications par jour pendant 5 jours",
        "parJour": 2,
        "jours": 5,
        "source": "Togo Ord. 36, traitement 11"
      },
      {
        "id": "dl-eosine",
        "indication": "Zona : éosine aqueuse 2 %",
        "type": "fixe",
        "texte": "Application locale",
        "source": "Togo Ord. 36, traitement 2"
      },
      {
        "id": "dl-polyvidone",
        "indication": "Érysipèle : polyvidone iodée",
        "type": "fixe",
        "texte": "Application locale, 2 fois par jour",
        "parJour": 2,
        "source": "Togo Ord. 36, traitement 13"
      }
    ],
    "ci": [
      "Ne pas appliquer sur une plaie profonde ou les muqueuses sans avis (selon le produit)"
    ],
    "precautions": [
      "Corticoïde local : pas sur une lésion infectée non traitée"
    ],
    "effets": [
      "Irritation locale"
    ]
  },
  {
    "id": "griseofulvine",
    "nom": "Griséofulvine",
    "classe": "Antifongique oral",
    "formes": [
      {
        "nom": "Comprimé 500 mg",
        "mg": 500
      }
    ],
    "regimes": [
      {
        "id": "gris-myc-enf",
        "indication": "Mycose étendue — enfant (3 semaines)",
        "type": "mgkg",
        "mgkgJour": 10,
        "parJour": 2,
        "jours": 21,
        "ageMax": 180,
        "source": "Togo Ord. 36, traitement 6"
      },
      {
        "id": "gris-myc-adulte",
        "indication": "Mycose étendue — adulte (3 semaines)",
        "type": "fixe",
        "texte": "500 mg (1 comprimé), 2 fois par jour pendant 3 semaines",
        "parJour": 2,
        "jours": 21,
        "ageMin": 180,
        "source": "Togo Ord. 36, traitement 6"
      },
      {
        "id": "gris-teigne-enf",
        "indication": "Teigne — enfant (6 semaines)",
        "type": "mgkg",
        "mgkgJour": 10,
        "parJour": 2,
        "jours": 42,
        "ageMax": 180,
        "source": "Togo Ord. 36, traitement 7"
      },
      {
        "id": "gris-teigne-adulte",
        "indication": "Teigne — adulte (6 semaines)",
        "type": "fixe",
        "texte": "500 mg (1 comprimé), 2 fois par jour pendant 6 semaines",
        "parJour": 2,
        "jours": 42,
        "ageMin": 180,
        "source": "Togo Ord. 36, traitement 7"
      }
    ],
    "ci": [
      "Grossesse",
      "Insuffisance hépatique"
    ],
    "precautions": [
      "Prendre pendant un repas gras"
    ],
    "effets": [
      "Nausées, maux de tête"
    ]
  },
  {
    "id": "cloxacilline",
    "nom": "Cloxacilline",
    "classe": "Antibiotique (staphylocoque)",
    "formes": [
      {
        "nom": "Gélule 500 mg",
        "mg": 500
      }
    ],
    "regimes": [
      {
        "id": "clox-abces-adulte",
        "indication": "Abcès cutané — adulte",
        "type": "fixe",
        "texte": "500 mg, 2 comprimés, 3 fois par jour pendant 10 jours",
        "parJour": 3,
        "jours": 10,
        "ageMin": 180,
        "source": "Togo Ord. 36, traitement 9"
      },
      {
        "id": "clox-eczema-adulte",
        "indication": "Eczéma surinfecté — adulte",
        "type": "fixe",
        "texte": "500 mg, 2 comprimés, 2 fois par jour pendant 8 jours",
        "parJour": 2,
        "jours": 8,
        "ageMin": 180,
        "source": "Togo Ord. 36, traitement 4"
      },
      {
        "id": "clox-enf",
        "indication": "Abcès cutané / eczéma surinfecté — enfant",
        "type": "mgkg",
        "mgkgJour": 50,
        "parJour": 2,
        "jours": 10,
        "ageMax": 180,
        "note": "10 jours pour l'abcès ; 8 jours pour l'eczéma surinfecté.",
        "source": "Togo Ord. 36, traitements 4 et 9"
      }
    ],
    "ci": [
      "Allergie aux pénicillines"
    ],
    "precautions": [],
    "effets": [
      "Troubles digestifs"
    ]
  },
  {
    "id": "fer",
    "nom": "Fer (sulfate ferreux, fer + acide folique)",
    "classe": "Anémie par carence en fer",
    "formes": [
      {
        "nom": "Selon le produit disponible (dose exprimée en fer)",
        "mg": 0
      }
    ],
    "regimes": [
      {
        "id": "fer-enf",
        "indication": "Anémie par carence — enfant (3 mois)",
        "type": "mgkg",
        "mgkgJour": 6,
        "parJour": 3,
        "jours": 90,
        "ageMax": 180,
        "note": "À prendre avant les repas. Dose exprimée en fer élément : vérifier la teneur du produit disponible.",
        "source": "Togo Ord. 9, traitement 1 ; dose 6 mg/kg/jour retenue par le validateur"
      },
      {
        "id": "fer-adulte-togo",
        "indication": "Anémie par carence — adulte (fer + acide folique)",
        "type": "fixe",
        "texte": "3 comprimés par jour, le matin à jeun, pendant 3 mois ; vitamine C 500 mg à 1 g le matin avec les comprimés",
        "parJour": 1,
        "jours": 90,
        "ageMin": 180,
        "note": "Pas d'amélioration après 14 jours, ou anémie décompensée : référer.",
        "source": "Togo Ord. 37, traitement 8"
      },
      {
        "id": "fer-adulte-rdc",
        "indication": "Anémie hypochrome par carence — adulte (sulfate de fer)",
        "type": "fixe",
        "texte": "1 comprimé, 2 fois par jour, pendant 1 à 3 mois",
        "parJour": 2,
        "jours": 90,
        "ageMin": 180,
        "source": "RDC Méd. interne II.1.4"
      }
    ],
    "ci": [
      "Anémie non liée à une carence en fer (hémolyse) : pas de fer"
    ],
    "precautions": [
      "Selles noires normales sous fer",
      "Chercher et traiter la cause (vers, saignement)"
    ],
    "effets": [
      "Troubles digestifs, constipation"
    ]
  },
  {
    "id": "vitamine-b12",
    "nom": "Vitamine B12 (hydroxocobalamine)",
    "classe": "Anémie macrocytaire",
    "formes": [
      {
        "nom": "Ampoule 1000 µg (1 mg)",
        "mg": 0
      }
    ],
    "regimes": [
      {
        "id": "b12-enf",
        "indication": "Carence en vitamine B12 — enfant",
        "type": "fixe",
        "texte": "1 ampoule de 1000 µg par jour pendant 3 semaines",
        "parJour": 1,
        "jours": 21,
        "ageMax": 180,
        "source": "Togo Ord. 9, traitement 1"
      },
      {
        "id": "b12-adulte",
        "indication": "Anémie macrocytaire — adulte",
        "type": "fixe",
        "texte": "1 ampoule de 1 mg en IM par jour (durée selon le bilan)",
        "ageMin": 180,
        "source": "Dose retenue par le validateur ; RDC Méd. interne II.1.4"
      }
    ],
    "ci": [
      "Allergie à la cobalamine"
    ],
    "precautions": [],
    "effets": [
      "Rares"
    ]
  },
  {
    "id": "mebendazole",
    "nom": "Mébendazole",
    "classe": "Antiparasitaire (vers)",
    "formes": [
      {
        "nom": "Comprimé 100 mg",
        "mg": 100,
        "conv": false
      },
      {
        "nom": "Comprimé 500 mg",
        "mg": 500,
        "conv": false
      }
    ],
    "regimes": [
      {
        "id": "mebe-enf",
        "indication": "Parasitoses intestinales / déparasitage — enfant d'au moins 9 mois",
        "type": "fixe",
        "texte": "500 mg en prise unique",
        "parJour": 1,
        "jours": 1,
        "ageMin": 9,
        "ageMax": 180,
        "note": "Ne pas déparasiter l'enfant de moins de 9 mois.",
        "source": "Togo Ord. 9, traitement 1 ; Ord. 14, traitement 2"
      },
      {
        "id": "mebe-oxy",
        "indication": "Oxyurose — adulte",
        "type": "fixe",
        "texte": "100 mg : 1 comprimé matin et soir pendant 3 jours",
        "parJour": 2,
        "jours": 3,
        "ageMin": 180,
        "note": "Répéter le traitement après une semaine. Se laver les mains avant les repas et après les toilettes.",
        "source": "Togo Ord. 23, traitement 7.B"
      }
    ],
    "ci": [
      "Grossesse (1er trimestre) : avis médical"
    ],
    "precautions": [],
    "effets": [
      "Douleurs abdominales, diarrhée"
    ]
  },
  {
    "id": "autres-vermifuges",
    "nom": "Autres vermifuges (niclosamide, praziquantel, pyrantel)",
    "classe": "Antiparasitaire (vers)",
    "formes": [
      {
        "nom": "Niclosamide comprimé 500 mg",
        "mg": 500,
        "conv": false
      },
      {
        "nom": "Pyrantel comprimé 125 mg",
        "mg": 125,
        "conv": false
      }
    ],
    "regimes": [
      {
        "id": "niclo",
        "indication": "Téniasis (ténia) — adulte : niclosamide",
        "type": "fixe",
        "texte": "4 comprimés de 500 mg en prise unique, à jeun",
        "parJour": 1,
        "jours": 1,
        "ageMin": 180,
        "note": "Repas liquide la veille et le jour du traitement.",
        "source": "Togo Ord. 23, traitement 6"
      },
      {
        "id": "prazi",
        "indication": "Téniasis (ténia) — adulte : praziquantel",
        "type": "mgkg",
        "mgkg": 10,
        "parJour": 1,
        "jours": 1,
        "ageMin": 180,
        "note": "Prise unique. Repas liquide la veille et le jour du traitement.",
        "source": "Togo Ord. 23, traitement 6 (Taenia saginata et solium)"
      },
      {
        "id": "pyrantel",
        "indication": "Oxyurose — adulte : pamoate de pyrantel",
        "type": "fixe",
        "texte": "750 mg (6 comprimés de 125 mg) en prise unique",
        "parJour": 1,
        "jours": 1,
        "ageMin": 180,
        "note": "Répéter le traitement après une semaine.",
        "source": "Togo Ord. 23, traitement 7.B"
      }
    ],
    "ci": [],
    "precautions": [],
    "effets": [
      "Troubles digestifs"
    ]
  },
  {
    "id": "trimebutine",
    "nom": "Trimébutine (Débridat)",
    "classe": "Antispasmodique digestif — enfant",
    "formes": [
      {
        "nom": "Suspension buvable",
        "mg": 0
      }
    ],
    "regimes": [
      {
        "id": "trime-enf",
        "indication": "Douleurs abdominales, coliques — enfant",
        "type": "totalkg",
        "dose": 1,
        "unit": "mL",
        "parJour": 3,
        "ageMax": 180,
        "note": "5 mL pour 5 kg et par jour, soit 1 mL/kg/jour, à répartir en 3 prises. Si la douleur persiste : référer.",
        "source": "Togo Ord. 14"
      }
    ],
    "ci": [],
    "precautions": [],
    "effets": [
      "Rares"
    ]
  },
  {
    "id": "metopimazine",
    "nom": "Métopimazine (Vogalène)",
    "classe": "Antiémétique — vomissements de la grossesse",
    "formes": [
      {
        "nom": "Solution injectable",
        "mg": 0,
        "conv": false
      }
    ],
    "regimes": [
      {
        "id": "meto-grossesse",
        "indication": "Vomissements de la grossesse",
        "type": "fixe",
        "texte": "10 mg, 2 fois par jour",
        "ageMin": 180,
        "source": "Décision du validateur",
        "parJour": 2,
        "note": "Gouttes ou suppositoire selon le produit disponible."
      }
    ],
    "ci": [
      "Suspicion d'occlusion : référer sans antiémétique"
    ],
    "precautions": [],
    "effets": [
      "Somnolence"
    ]
  },
  {
    "id": "metoclopramide",
    "nom": "Métoclopramide",
    "classe": "Antiémétique",
    "formes": [
      {
        "nom": "Ampoule injectable 10 mg",
        "mg": 10,
        "conv": false
      },
      {
        "nom": "Comprimé 10 mg",
        "mg": 10,
        "conv": false
      }
    ],
    "regimes": [
      {
        "id": "metoc-adulte",
        "indication": "Vomissements — adulte",
        "type": "fixe",
        "texte": "10 mg matin et soir, sans dépasser 30 mg par jour",
        "parJour": 2,
        "ageMin": 180,
        "source": "Dose retenue par le validateur"
      },
      {
        "id": "metoc-enf",
        "indication": "Vomissements — enfant",
        "type": "mgkg",
        "parJour": 2,
        "ageMax": 180,
        "note": "0,2 mg/kg par prise, 2 fois par jour, sans dépasser 0,5 mg/kg par jour. Réhydrater d'abord.",
        "source": "Dose retenue par le validateur",
        "mgkg": 0.2
      }
    ],
    "ci": [
      "Suspicion d'occlusion ou de saignement digestif"
    ],
    "precautions": [
      "Éviter chez l'enfant sans avis médical"
    ],
    "effets": [
      "Somnolence, agitation"
    ]
  },
  {
    "id": "prednisolone",
    "nom": "Prednisolone / prednisone",
    "classe": "Corticoïde oral",
    "formes": [
      {
        "nom": "Comprimé 5 mg",
        "mg": 5
      },
      {
        "nom": "Comprimé 20 mg",
        "mg": 20
      }
    ],
    "regimes": [
      {
        "id": "pred-asthme-adulte",
        "indication": "Crise d'asthme persistante (modérée) — adulte",
        "type": "mgkg",
        "mgkgJour": 1,
        "parJour": 3,
        "jours": 10,
        "maxJour": 60,
        "ageMin": 180,
        "note": "Ne jamais dépasser 60 mg par jour.",
        "source": "RDC Méd. interne I.2"
      },
      {
        "id": "pred-asthme-enf",
        "indication": "Crise d'asthme persistante (modérée) — enfant",
        "type": "mgkg",
        "mgkg": 1,
        "parJour": 2,
        "jours": 5,
        "ageMax": 180,
        "note": "1 mg/kg par prise, 2 fois par jour (RDC Pédiatrie : prednisolone aux mêmes doses que la méthylprednisolone).",
        "source": "RDC Pédiatrie, algorithme de la crise d'asthme"
      }
    ],
    "ci": [
      "Infection non traitée"
    ],
    "precautions": [
      "Éviter les corticoïdes en cas d'hypertension ou de diabète non contrôlés (phase aiguë)"
    ],
    "effets": [
      "Augmentation de la glycémie, de la tension"
    ]
  },
  {
    "id": "corticoide-inj",
    "nom": "Corticoïdes injectables",
    "classe": "Urgence : asthme, allergie",
    "formes": [
      {
        "nom": "Selon le produit disponible",
        "mg": 0,
        "conv": false
      }
    ],
    "regimes": [
      {
        "id": "cinj-asthme-enf",
        "indication": "Asthme avec détresse respiratoire — enfant : bétaméthasone",
        "type": "fixe",
        "texte": "2 à 8 mg en IM selon l'âge, puis référer",
        "ageMax": 180,
        "source": "Togo Ord. 2, traitement 5"
      },
      {
        "id": "cinj-asthme-adulte",
        "indication": "Asthme sévère — adulte : avant le transfert",
        "type": "fixe",
        "texte": "Première dose : hydrocortisone 200 mg en IV directe, ou dexaméthasone 4 mg en IV directe. Surveiller 45 minutes ; sans amélioration : référer",
        "ageMin": 180,
        "note": "Puis référer si pas d'amélioration.",
        "source": "RDC Méd. interne I.2"
      },
      {
        "id": "cinj-quincke",
        "indication": "Œdème de Quincke (gêne respiratoire) : corticoïde",
        "type": "fixe",
        "texte": "Hémisuccinate d'hydrocortisone 100 mg : 1 ampoule en IV ; ou bétaméthasone 4 mg : 1 ampoule pour 30 kg en IV directe ; puis référer",
        "source": "Togo Ord. 36, traitement 5"
      }
    ],
    "ci": [],
    "precautions": [],
    "effets": []
  },
  {
    "id": "ampicilline",
    "nom": "Ampicilline injectable",
    "classe": "Antibiotique",
    "formes": [
      {
        "nom": "Flacon injectable",
        "mg": 0,
        "conv": false
      }
    ],
    "regimes": [
      {
        "id": "amp-fracture",
        "indication": "Fracture des dents ou de la mâchoire — adulte",
        "type": "fixe",
        "texte": "2 g en IM, dose unique",
        "ageMin": 180,
        "note": "Bandage circulaire puis référer.",
        "source": "Togo Ord. 34, traitement 4"
      },
      {
        "id": "amp-hemo-enf",
        "indication": "Hémorragie externe abondante — enfant",
        "type": "mgkg",
        "mgkgJour": 50,
        "parJour": 1,
        "jours": 1,
        "ageMax": 180,
        "note": "En une injection, avec bandage compressif ; référer immédiatement.",
        "source": "Togo Ord. 9, traitement 6"
      },
      {
        "id": "amp-sept-enf",
        "indication": "Septicémie de l'enfant — 2e intention",
        "type": "mgkg",
        "mgkgJour": 200,
        "mgkgJourMax": 300,
        "parJour": 3,
        "jours": 1,
        "ageMin": 2,
        "ageMax": 180,
        "note": "IV directe en 2 ou 3 injections, avec la gentamicine, puis référer.",
        "source": "Togo Ord. 5, traitement 3"
      }
    ],
    "ci": [
      "Allergie aux pénicillines"
    ],
    "precautions": [],
    "effets": []
  },
  {
    "id": "chlorhexidine",
    "nom": "Chlorhexidine (bain de bouche)",
    "classe": "Antiseptique buccal",
    "formes": [
      {
        "nom": "Solution pour bain de bouche",
        "mg": 0
      }
    ],
    "regimes": [
      {
        "id": "chlorhex",
        "indication": "Infection dentaire / gingivale",
        "type": "fixe",
        "texte": "Bain de bouche, 4 fois par jour",
        "parJour": 4,
        "source": "Togo Ord. 34, traitement 2"
      }
    ],
    "ci": [],
    "precautions": [
      "Ne pas avaler"
    ],
    "effets": [
      "Coloration des dents, goût altéré"
    ]
  },
  {
    "id": "cotrimoxazole",
    "nom": "Cotrimoxazole (sulfaméthoxazole + triméthoprime)",
    "classe": "Antibiotique",
    "formes": [
      {
        "nom": "Sirop 240 mg/5 mL",
        "mg": 240,
        "ml": 5
      },
      {
        "nom": "Comprimé 480 mg",
        "mg": 480
      }
    ],
    "regimes": [
      {
        "id": "cotri-enf",
        "indication": "Enfant : infection à VIH (diarrhée, convulsions) — avant transfert",
        "type": "mgkg",
        "mgkgJour": 48,
        "parJour": 2,
        "jours": 5,
        "maxPrise": 960,
        "ageMin": 2,
        "ageMax": 180,
        "note": "Manuel : 1 mesure de 5 mL (240 mg) pour 5 kg de poids par jour, en 2 prises, 5 jours (soit 48 mg/kg/jour). Comprimé : ½ comprimé de 480 mg pour 5 kg par jour. Référer.",
        "source": "Togo Ord. 4 (traitement 6) et Ord. 5 (point 8)"
      },
      {
        "id": "cotri-gyn",
        "indication": "Après curage / AMIU, ou plaie vulvo-vaginale — adulte",
        "type": "fixe",
        "texte": "480 mg : 2 comprimés matin et soir pendant 7 jours",
        "parJour": 2,
        "jours": 7,
        "ageMin": 180,
        "note": "Alternative : amoxicilline 500 mg, 2 comprimés matin et soir, 7 jours. Éviter en cas d'allergie aux sulfamides.",
        "source": "Togo Ord. 24 (traitement 4), Ord. 25 (traitements 4 et 8)"
      },
      {
        "id": "cotri-pp",
        "indication": "Suites de couches (hémorragie du post-partum) — femme qui n'allaite pas",
        "type": "fixe",
        "texte": "480 mg : 2 comprimés matin et soir pendant 7 jours",
        "parJour": 2,
        "jours": 7,
        "ageMin": 180,
        "note": "Si la femme allaite : amoxicilline 1 g matin et soir pendant 7 jours.",
        "source": "Togo Ord. 30"
      },
      {
        "id": "cotri-uro",
        "indication": "Cystite, pyélonéphrite, prostatite — adulte (alternative à la ciprofloxacine)",
        "type": "fixe",
        "texte": "480 mg : 2 comprimés, 2 fois par jour pendant 10 jours",
        "parJour": 2,
        "jours": 10,
        "ageMin": 180,
        "source": "Togo Ord. 31 (traitements 6, 7, 8)"
      },
      {
        "id": "cotri-oeil",
        "indication": "Blessure de la cornée — adulte (alternative à l'amoxicilline)",
        "type": "fixe",
        "texte": "480 mg : 2 comprimés matin et soir",
        "parJour": 2,
        "ageMin": 180,
        "note": "Référer.",
        "source": "Togo Ord. 43 (traitement 4)"
      }
    ],
    "ci": [
      "Allergie aux sulfamides",
      "Insuffisance rénale ou hépatique sévère",
      "Nourrisson de moins de 6 semaines",
      "Déficit en G6PD"
    ],
    "precautions": [
      "Bien boire pendant le traitement",
      "Arrêter en cas d'éruption cutanée",
      "Grossesse : avis médical"
    ],
    "effets": [
      "Éruption cutanée, nausées",
      "Rarement : réactions cutanées graves"
    ]
  },
  {
    "id": "phenobarbital",
    "nom": "Phénobarbital",
    "classe": "Anticonvulsivant",
    "formes": [
      {
        "nom": "Comprimé 100 mg",
        "mg": 100
      },
      {
        "nom": "Ampoule injectable",
        "mg": 0
      }
    ],
    "regimes": [
      {
        "id": "phb-enf",
        "indication": "Convulsions de l'enfant : détresse respiratoire ou enfant à référer (à la place du diazépam)",
        "type": "mgkg",
        "mgkg": 15,
        "parJour": null,
        "jours": null,
        "maxPrise": null,
        "ageMax": 180,
        "note": "En injection intramusculaire, dose unique, puis référer. Surveiller la respiration.",
        "source": "Togo Ord. 5 et Ord. 6"
      },
      {
        "id": "phb-epil",
        "indication": "Épilepsie — adulte : traitement de fond après la crise",
        "type": "fixe",
        "texte": "100 mg (1 comprimé) le soir",
        "parJour": 1,
        "jours": null,
        "ageMin": 180,
        "note": "Traitement prolongé (2 à 3 ans) ; référer pour le bilan complet.",
        "source": "Togo Ord. 20, traitement 3"
      }
    ],
    "ci": [
      "Insuffisance respiratoire sévère",
      "Porphyrie"
    ],
    "precautions": [
      "Dépression respiratoire possible, surtout avec le diazépam",
      "Ne pas arrêter brutalement un traitement de fond"
    ],
    "effets": [
      "Somnolence, troubles de l'attention"
    ]
  },
  {
    "id": "furosemide",
    "nom": "Furosémide",
    "classe": "Diurétique de l'anse",
    "formes": [
      {
        "nom": "Ampoule 20 mg",
        "mg": 20
      },
      {
        "nom": "Comprimé 40 mg",
        "mg": 40
      }
    ],
    "regimes": [
      {
        "id": "furo-oap",
        "indication": "Œdème aigu du poumon — adulte",
        "type": "fixe",
        "texte": "20 mg : 2 ampoules (40 mg) en IV directe, puis référer",
        "ageMin": 180,
        "note": "Position demi-assise.",
        "source": "Togo Ord. 19, traitement 1"
      },
      {
        "id": "furo-ic",
        "indication": "Insuffisance cardiaque décompensée avec œdèmes — adulte et adolescent de plus de 12 ans",
        "type": "fixe",
        "texte": "20 mg/mL : 1 à 2 ampoules (20 à 40 mg) en IV lente (ou IM, SC), à répéter plusieurs fois par jour ; maximum 100 mg par 24 heures. Associer du chlorure de potassium 600 mg : 1 comprimé, puis référer",
        "source": "Togo Ord. 37, traitement 2",
        "ageMin": 144,
        "note": "Enfant de moins de 12 ans : référer."
      }
    ],
    "ci": [
      "Anurie",
      "Déshydratation sévère",
      "Allergie aux sulfamides"
    ],
    "precautions": [
      "Surveiller la tension",
      "Risque d'hypokaliémie"
    ],
    "effets": [
      "Hypotension, crampes, déshydratation"
    ]
  },
  {
    "id": "hydrochlorothiazide",
    "nom": "Hydrochlorothiazide",
    "classe": "Diurétique thiazidique",
    "formes": [
      {
        "nom": "Comprimé 25 mg",
        "mg": 25
      }
    ],
    "regimes": [
      {
        "id": "hctz-cirrhose",
        "indication": "Œdèmes / ascite de la cirrhose — adulte",
        "type": "fixe",
        "texte": "25 mg : 1 comprimé par jour, puis référer",
        "parJour": 1,
        "ageMin": 180,
        "source": "Togo Ord. 37, traitement 7"
      }
    ],
    "ci": [
      "Anurie",
      "Allergie aux sulfamides",
      "Grossesse"
    ],
    "precautions": [
      "Surveiller la tension et la diurèse"
    ],
    "effets": [
      "Hypokaliémie, hyponatrémie"
    ]
  },
  {
    "id": "vitamine-k",
    "nom": "Vitamine K1 (phytoménadione)",
    "classe": "Antidote / hémostatique",
    "formes": [
      {
        "nom": "Ampoule injectable",
        "mg": 0
      }
    ],
    "regimes": [
      {
        "id": "vitk-raticide",
        "indication": "Intoxication aux raticides (anti-vitamine K)",
        "type": "fixe",
        "texte": "1 à 3 ampoules par jour en IM",
        "parJour": 1,
        "ageMin": 0,
        "note": "Si hémorragie malgré le traitement : référer.",
        "source": "Togo Ord. 38, traitement 4"
      },
      {
        "id": "vitk-epistaxis",
        "indication": "Épistaxis qui persiste — adulte",
        "type": "fixe",
        "texte": "1 ampoule en IM, puis référer",
        "ageMin": 180,
        "source": "Togo Ord. 41, traitement 10"
      }
    ],
    "ci": [
      "Allergie à la vitamine K"
    ],
    "precautions": [
      "Injection IM : risque d'hématome si trouble de la coagulation"
    ],
    "effets": [
      "Rarement allergie"
    ]
  },
  {
    "id": "praziquantel",
    "nom": "Praziquantel",
    "classe": "Antiparasitaire (bilharziose)",
    "formes": [
      {
        "nom": "Comprimé 600 mg",
        "mg": 600
      }
    ],
    "regimes": [
      {
        "id": "pzq",
        "indication": "Bilharziose vésicale (zone d'endémie ou séjour récent) — enfant et adulte",
        "type": "mgkg",
        "mgkg": 40,
        "parJour": 1,
        "jours": 1,
        "maxPrise": null,
        "note": "Prise unique, au cours d'un repas.",
        "source": "Togo Ord. 15 (traitement 6) et Ord. 31 (traitement 11)"
      }
    ],
    "ci": [
      "Allergie au praziquantel"
    ],
    "precautions": [
      "Prendre avec un repas"
    ],
    "effets": [
      "Vertiges, douleurs abdominales, nausées"
    ]
  },
  {
    "id": "sulfate-magnesium",
    "nom": "Sulfate de magnésium (éclampsie)",
    "classe": "Anticonvulsivant obstétrical",
    "formes": [
      {
        "nom": "Solution à 20 %",
        "mg": 0
      }
    ],
    "regimes": [
      {
        "id": "mgso4-attaque",
        "indication": "Crise d'éclampsie : dose d'attaque",
        "type": "fixe",
        "texte": "4 g de sulfate de magnésium à 20 % en IV lente (en 5 minutes), puis 5 g en IM profonde dans chaque fesse (10 g au total), après avoir ajouté 1 mL de lidocaïne à 2 % dans la seringue",
        "ageMin": 180,
        "note": "Prévenir la patiente d'une sensation de chaleur lors de l'injection. Respecter l'asepsie.",
        "source": "Togo Ord. 20, traitement 5 (1re intention)"
      },
      {
        "id": "mgso4-entretien",
        "indication": "Crise d'éclampsie : dose d'entretien",
        "type": "fixe",
        "texte": "5 g de sulfate de magnésium + 1 mL de lidocaïne à 2 % en IM profonde, toutes les 4 heures, en alternant les fesses",
        "parJour": 6,
        "ageMin": 180,
        "note": "Poursuivre 24 heures après la dernière convulsion ou après l'accouchement (le dernier des deux). Avant chaque dose : vérifier la respiration, les réflexes rotuliens et la diurèse.",
        "source": "Togo Ord. 20, traitement 5"
      }
    ],
    "ci": [
      "Insuffisance rénale",
      "Fréquence respiratoire < 16/min",
      "Réflexes rotuliens abolis"
    ],
    "precautions": [
      "Gluconate de calcium disponible comme antidote en cas de surdosage",
      "Surveillance rapprochée"
    ],
    "effets": [
      "Sensation de chaleur, dépression respiratoire en cas de surdosage"
    ]
  },
  {
    "id": "ocytocine",
    "nom": "Ocytocine",
    "classe": "Utérotonique",
    "formes": [
      {
        "nom": "Ampoule injectable",
        "mg": 0
      }
    ],
    "regimes": [
      {
        "id": "ocy-ivd",
        "indication": "Rétention placentaire ou de cotylédons : après délivrance artificielle / révision utérine",
        "type": "fixe",
        "texte": "1 ampoule en IV directe",
        "ageMin": 180,
        "note": "Si l'hémorragie persiste : référer immédiatement.",
        "source": "Togo Ord. 30 (traitements 2 et 3)"
      },
      {
        "id": "ocy-perf",
        "indication": "Atonie utérine",
        "type": "fixe",
        "texte": "10 UI en perfusion dans 500 mL de sérum salé ou de SGI, avec massage utérin",
        "ageMin": 180,
        "note": "Faire d'abord la révision utérine. Si l'hémorragie persiste : garniture propre, sonde de Foley si possible, et référer immédiatement.",
        "source": "Togo Ord. 30 (traitement 4)"
      }
    ],
    "ci": [
      "Ne jamais injecter avant la naissance du bébé"
    ],
    "precautions": [
      "Surveiller la tension"
    ],
    "effets": [
      "Hypotension si injection trop rapide"
    ]
  },
  {
    "id": "pommade-ophtalmique",
    "nom": "Pommade / collyre antibiotique pour l'œil",
    "classe": "Antibiotique local",
    "formes": [
      {
        "nom": "Pommade ophtalmique (tétracycline)",
        "mg": 0
      },
      {
        "nom": "Collyre rifamycine",
        "mg": 0
      }
    ],
    "regimes": [
      {
        "id": "oph-enf",
        "indication": "Œil de l'enfant : conjonctivite, orgelet, blépharite, traumatisme, corps étranger",
        "type": "fixe",
        "texte": "Pommade ophtalmique antibiotique dans les deux yeux, 3 fois par jour (matin, midi et soir)",
        "parJour": 3,
        "ageMax": 180,
        "note": "Se laver les mains. Faire regarder l'enfant vers le haut, déposer une petite quantité de pommade entre la paupière inférieure et le globe en tirant la paupière vers le bas. Continuer jusqu'à disparition de la rougeur. Ne pas utiliser d'autres pommades ou collyres.",
        "source": "Togo Ord. 13"
      },
      {
        "id": "oph-adulte",
        "indication": "Œil de l'adulte : conjonctivite, orgelet, blépharite, traumatisme, corps étranger",
        "type": "fixe",
        "texte": "Pommade à la tétracycline : 1 application matin, midi et soir ; ou collyre à la rifamycine : 1 goutte matin, midi et soir",
        "parJour": 3,
        "ageMin": 180,
        "source": "Togo Ord. 43"
      }
    ],
    "ci": [
      "Allergie à l'un des composants"
    ],
    "precautions": [
      "Ne pas toucher l'œil avec l'embout",
      "Un tube par patient"
    ],
    "effets": [
      "Irritation passagère"
    ]
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
  {
    "id": "fievre_enf",
    "groupe": "Enfant",
    "titre": "Fièvre de l'enfant",
    "sous": "Ord. 1 — dès 2 mois ; température axillaire > 37,5 °C",
    "debut": "f0",
    "noeuds": {
      "f0": {
        "q": "Signes de GRAVITÉ du paludisme ou signes généraux de danger ?",
        "aide": "Vomissements importants · urines « coca-cola » · oligo-anurie · convulsions · coma ou léthargie · incapable de boire ou téter · pâleur palmaire sévère · détresse respiratoire.",
        "options": [
          {
            "t": "Oui, au moins un",
            "vers": "r_grave"
          },
          {
            "t": "Non",
            "vers": "f1"
          }
        ]
      },
      "f1": {
        "q": "Raideur de la nuque, fontanelle bombée, convulsion ou léthargie ?",
        "options": [
          {
            "t": "Oui",
            "vers": "r_mening"
          },
          {
            "t": "Non",
            "vers": "f2"
          }
        ]
      },
      "f2": {
        "q": "Âge de l'enfant ?",
        "options": [
          {
            "t": "Moins de 2 mois",
            "vers": "r_nne"
          },
          {
            "t": "2 mois ou plus",
            "vers": "f3"
          }
        ]
      },
      "f3": {
        "q": "Résultat du TDR / goutte épaisse (paludisme) ?",
        "options": [
          {
            "t": "Positif",
            "vers": "r_palu"
          },
          {
            "t": "Négatif",
            "vers": "f4"
          },
          {
            "t": "Non disponible / non réalisé",
            "vers": "r_tdr_nd"
          }
        ]
      },
      "f4": {
        "q": "Cherchez un foyer infectieux : lequel est présent ?",
        "aide": "Dévêtir l'enfant et l'examiner entièrement. Choisir le signe le plus net.",
        "options": [
          {
            "t": "Toux, respiration rapide ou difficile, tirage",
            "vers": "algo:toux_enf"
          },
          {
            "t": "Diarrhée",
            "vers": "algo:diarrhee_enf"
          },
          {
            "t": "Mal de gorge : gorge rouge, difficulté à avaler, ganglions",
            "vers": "algo:gorge_enf"
          },
          {
            "t": "Oreille : pleurs, écoulement, douleur, gonflement",
            "vers": "algo:oreille_enf"
          },
          {
            "t": "Éruption + (toux, nez qui coule ou yeux rouges), signe de Koplik",
            "vers": "r_rougeole"
          },
          {
            "t": "Petites bulles / pustules cutanées",
            "vers": "r_staph"
          },
          {
            "t": "Pleurs en urinant",
            "vers": "r_iu"
          },
          {
            "t": "Fièvre isolée > 7 jours, quotidienne, fatigue, douleur abdominale",
            "vers": "r_typhoide"
          },
          {
            "t": "Forte fièvre avec saignement, vomissement, diarrhée",
            "vers": "r_fhv"
          },
          {
            "t": "Fièvre persistante, diarrhée persistante, retard de croissance, mycose, otite chronique",
            "vers": "r_vih"
          },
          {
            "t": "Aucun foyer évident",
            "vers": "r_sans_foyer"
          }
        ]
      },
      "r_grave": {
        "res": {
          "niveau": "urgence",
          "titre": "Paludisme grave / maladie fébrile très grave",
          "resume": "Premiers soins puis transfert. Garder l'enfant si le transfert est impossible.",
          "conduite": [
            "SGH 10 % : 10 mL/kg en bolus (1 h) = {kg:10} mL (prévenir ou traiter l'hypoglycémie)",
            "Artésunate : 3 mg/kg si poids < 20 kg ({mg:3} mg) ; 2,4 mg/kg si poids ≥ 20 kg ({mg:2.4} mg), en IV direct ou IM (cuisse), à H0, H12, H24, puis 1 fois/jour (alternatives : artéméther 3,2 mg/kg IM, ou quinine)",
            "Antibiotique : ampicilline + gentamicine, ou ceftriaxone + gentamicine",
            "Prévenir ou traiter la déshydratation (voie orale)",
            "Convulsions : diazépam 0,5 à 1 mg/kg ; détresse respiratoire : phénobarbital 15 mg/kg IM",
            "Paracétamol si fièvre > 38 °C",
            "Transfert OBLIGATOIRE si : inconscience persistante après 2 jours, convulsions persistantes, urines rares ou absentes, pâleur palmaire sévère",
            "Pâleur sévère ou urines « coca-cola » (hémoglobinurie) : référer, ne pas donner de quinine"
          ],
          "meds": [
            "sgh10",
            "artesunate",
            "artemether-inj",
            "quinine-inj",
            "diazepam",
            "ceftriaxone",
            "paracetamol"
          ],
          "source": "Ord. 1, traitement 2 et tableau III"
        }
      },
      "r_mening": {
        "res": {
          "niveau": "urgence",
          "titre": "Méningite possible",
          "resume": "Antibiotique à haute dose puis transfert. Notifier.",
          "conduite": [
            "Ceftriaxone 100 mg/kg/jour IM ou IV (ou ampicilline 200 à 300 mg/kg/jour), 10 jours",
            "Faire le TDR : paludisme grave possible en même temps",
            "Glycémie ; diazépam si convulsions",
            "Paracétamol si fièvre",
            "Notifier à l'échelon supérieur (zone épidémique) et référer"
          ],
          "meds": [
            "ceftriaxone",
            "diazepam",
            "paracetamol"
          ],
          "source": "Ord. 1, traitement 3"
        }
      },
      "r_nne": {
        "res": {
          "niveau": "urgence",
          "titre": "Nourrisson de moins de 2 mois fébrile",
          "resume": "Infection bactérienne grave possible : référer.",
          "conduite": [
            "Garder au chaud, poursuivre l'allaitement",
            "Rechercher les signes d'une infection néonatale",
            "Faire le bilan AVANT tout traitement : NFS, CRP, goutte épaisse (GE)",
            "Puis démarrer l'antibiothérapie : ceftriaxone 50 mg/kg/jour en IV ({mg:50} mg par jour) et gentamicine 4 mg/kg ({mg:4} mg) en 1 injection par jour pendant 3 jours",
            "Paracétamol injectable 15 mg/kg ({mg:15} mg)",
            "Relais par voie orale si amélioration ; en cas de non-amélioration : référer",
            "Contrôler la glycémie"
          ],
          "meds": [
            "ceftriaxone",
            "gentamicine"
          ],
          "source": "Ord. 6 (infections néonatales) ; conduite retenue par le validateur"
        }
      },
      "r_palu": {
        "res": {
          "niveau": "attention",
          "titre": "Paludisme simple (TDR positif, sans signe de gravité)",
          "resume": "CTA pendant 3 jours + traitement de la fièvre.",
          "conduite": [
            "Artéméther-luméfantrine (AL) selon le poids — ou artésunate-amodiaquine",
            "Paracétamol si température ≥ 38 °C, toutes les 8 h ; ou ibuprofène sirop (Advil) selon le poids, 3 fois par jour",
            "Déshabiller l'enfant, faire boire beaucoup, envelopper dans un linge humide si possible",
            "Rechercher une autre infection associée",
            "Fièvre persistante après 3 jours de traitement correct : rechercher une autre cause, référer",
            "Revenir tout de suite si vomissements, convulsions, enfant qui ne boit plus"
          ],
          "meds": [
            "act-al",
            "asaq",
            "paracetamol",
            "ibuprofene"
          ],
          "source": "Ord. 1, traitement 1"
        }
      },
      "r_tdr_nd": {
        "res": {
          "niveau": "attention",
          "titre": "TDR non disponible",
          "resume": "Confirmer le paludisme avant tout traitement antipaludique.",
          "conduite": [
            "Faire la goutte épaisse (GE), la NFS ou la NB-TH, la CRP (envoyer l'enfant si impossible)",
            "Chercher un autre foyer infectieux",
            "Paracétamol si ≥ 38 °C",
            "Si l'enfant est stable et que les tests sont réellement impossibles : appliquer le protocole national du PNLP"
          ],
          "meds": [
            "paracetamol"
          ],
          "source": "Ord. 1, étape C : « faire un TDR pour rechercher le paludisme »"
        }
      },
      "r_rougeole": {
        "res": {
          "niveau": "attention",
          "titre": "Rougeole",
          "resume": "Vitamine A, soins des yeux, prévention de la surinfection. Notifier.",
          "conduite": [
            "Vitamine A : 100 000 UI (6-11 mois) ou 200 000 UI (12-59 mois)",
            "Prévenir l'infection de l'œil : pommade ophtalmique à la tétracycline (ou rifamycine collyre, auréomycine)",
            "Amoxicilline 100 mg/kg/jour en 2 prises, au moins 10 jours",
            "Calmer la toux (voir toux de l'enfant), paracétamol si fièvre",
            "Complication majeure (pus des yeux, ulcérations profondes de la bouche, opacité de la cornée, stridor) : référer",
            "Notifier (maladie à déclaration)"
          ],
          "meds": [
            "vitamine-a",
            "amoxicilline",
            "paracetamol"
          ],
          "source": "Ord. 1, traitement 8"
        }
      },
      "r_staph": {
        "res": {
          "niveau": "attention",
          "titre": "Staphylococcie cutanée",
          "resume": "Antibiotique oral et soins locaux.",
          "conduite": [
            "Cloxacilline 50 mg/kg/jour en 2 prises par voie orale, ou amoxicilline + acide clavulanique 50 mg/kg/jour en 3 prises",
            "Soins locaux : désinfection à la chlorhexidine",
            "Paracétamol si fièvre",
            "Pas d'amélioration : référer"
          ],
          "meds": [
            "amox-clav",
            "paracetamol"
          ],
          "source": "Ord. 1, traitement 9"
        }
      },
      "r_iu": {
        "res": {
          "niveau": "attention",
          "titre": "Infection urinaire possible",
          "resume": "Traitement selon le manuel ; référer en cas de récidive ou de douleurs abdominales.",
          "conduite": [
            "Bandelette urinaire si disponible",
            "Ceftriaxone 50 mg/kg/jour en IM ou IV pendant 3 à 5 jours ({mg:50} mg par jour)",
            "Gentamicine 4 mg/kg en 1 injection par jour pendant 3 jours ({mg:4} mg)",
            "Puis relais par voie orale : céfixime suspension 8 mg/kg/jour en 2 prises ({mg:8} mg par jour) pendant 6 jours, et métronidazole sirop 30 à 40 mg/kg/jour en 2 prises",
            "Hydratation, paracétamol si fièvre",
            "Récidive, douleurs abdominales associées ou échec : référer"
          ],
          "meds": [
            "ceftriaxone",
            "gentamicine",
            "cefixime",
            "metronidazole",
            "paracetamol"
          ],
          "source": "Ord. 1, traitement 10 ; schéma et doses retenus par le validateur"
        }
      },
      "r_typhoide": {
        "res": {
          "niveau": "attention",
          "titre": "Fièvre typhoïde possible",
          "resume": "Antibiotique 10 à 15 jours. Référer si doute ou échec.",
          "conduite": [
            "Ceftriaxone 50 mg/kg/jour en IV/IM pendant 10 à 15 jours",
            "ou ciprofloxacine 15-20 mg/kg/jour en 2 prises pendant 10 jours (enfant > 6 mois, max 1000 mg/jour)",
            "Hydratation, paracétamol si fièvre",
            "Fièvre persistante après 7 jours de traitement : référer"
          ],
          "meds": [
            "ceftriaxone",
            "ciprofloxacine",
            "paracetamol"
          ],
          "source": "Ord. 1, traitement 4"
        }
      },
      "r_fhv": {
        "res": {
          "niveau": "urgence",
          "titre": "Fièvre hémorragique virale possible",
          "resume": "Isoler, mesures d'hygiène, informer la hiérarchie, référer.",
          "conduite": [
            "Isoler le malade, mesures d'hygiène strictes (gants, protection)",
            "Informer immédiatement la hiérarchie sanitaire",
            "Ne pas donner d'AAS ni d'AINS",
            "Référer"
          ],
          "meds": [],
          "source": "Ord. 1, traitement 12"
        }
      },
      "r_vih": {
        "res": {
          "niveau": "attention",
          "titre": "Infection à VIH probable",
          "resume": "Cotrimoxazole puis référer.",
          "conduite": [
            "Cotrimoxazole : ½ comprimé de 480 mg pour 5 kg de poids par jour (ou 5 mL de sirop pour 5 kg/jour), en une prise",
            "Proposer le dépistage (enfant et mère)",
            "Référer pour prise en charge"
          ],
          "meds": [],
          "source": "Ord. 1, traitement 11"
        }
      },
      "r_sans_foyer": {
        "res": {
          "niveau": "attention",
          "titre": "Fièvre sans foyer, TDR négatif",
          "resume": "Traitement symptomatique et référence si besoin.",
          "conduite": [
            "Paracétamol si ≥ 38 °C, hydratation ; ou ibuprofène sirop (Advil) selon le poids, 3 fois par jour",
            "Faire la GE, la NFS ou la NB-TH, la CRP ; refaire le TDR si la fièvre persiste après 48 h",
            "Fièvre > 7 jours ou aggravation : référer",
            "Revenir immédiatement si apparition d'un signe de danger"
          ],
          "meds": [
            "paracetamol",
            "ibuprofene"
          ],
          "source": "Ord. 1 (« autres signes : référer »)"
        }
      }
    }
  },
  {
    "id": "toux_enf",
    "groupe": "Enfant",
    "titre": "Toux / difficultés respiratoires de l'enfant",
    "sous": "Ord. 2 et 3",
    "debut": "t0",
    "noeuds": {
      "t0": {
        "q": "Fièvre + signe de danger ou de lutte respiratoire ?",
        "aide": "Signes généraux de danger : incapable de boire ou de téter, ou vomit tout · léthargie, perte de conscience ou convulsions · cyanose centrale · malnutrition aiguë sévère associée · battement des ailes du nez, geignement expiratoire, tête qui dodeline. Pneumonie sévère : tirage sous-costal · stridor chez un enfant calme · saturation en O₂ < 90 %.",
        "options": [
          {
            "t": "Oui",
            "vers": "r_pneumo_grave"
          },
          {
            "t": "Non",
            "vers": "t1"
          }
        ]
      },
      "t1": {
        "q": "Respiration rapide ? (compter 1 minute complète, enfant calme)",
        "aide": "Pneumonie simple : toux ou difficulté respiratoire avec respiration rapide, sans signe de gravité. < 2 mois : ≥ 60 /min · 2 à 11 mois : ≥ 50 /min · 12 à 59 mois : ≥ 40 /min.",
        "options": [
          {
            "t": "Oui, sans signe de lutte respiratoire",
            "vers": "r_pneumo"
          },
          {
            "t": "Non",
            "vers": "t2"
          }
        ]
      },
      "t2": {
        "q": "Autres signes ?",
        "options": [
          {
            "t": "Difficulté respiratoire, antécédents, distension thoracique, sifflement",
            "vers": "r_asthme"
          },
          {
            "t": "Toux + voix rauque ou éteinte, inspiration bruyante (stridor)",
            "vers": "r_laryngite"
          },
          {
            "t": "Signe de Koplik et/ou éruption",
            "vers": "algo:fievre_enf#r_rougeole"
          },
          {
            "t": "Fièvre + écoulement nasal, pas de respiration rapide",
            "vers": "r_rhino"
          },
          {
            "t": "Expectorations + fièvre",
            "vers": "r_bronchite"
          },
          {
            "t": "Début brutal après un repas ou une régurgitation (corps étranger)",
            "vers": "r_corps"
          },
          {
            "t": "Toux depuis plus de 2 semaines, contage tuberculeux, fièvre prolongée",
            "vers": "r_tb"
          },
          {
            "t": "Autres signes",
            "vers": "r_ref"
          }
        ]
      },
      "r_pneumo_grave": {
        "res": {
          "niveau": "urgence",
          "titre": "Pneumonie grave",
          "resume": "Première dose d'antibiotique puis transfert.",
          "conduite": [
            "Libérer les voies aériennes, position semi-assise, oxygène si disponible",
            "Amoxicilline 50 mg/kg en 1 injection IM/IV, ou ceftriaxone 50 mg/kg IV, puis référer",
            "Abord veineux si possible ; faire le TDR (paludisme associé)"
          ],
          "meds": [
            "amoxicilline",
            "ceftriaxone"
          ],
          "source": "Ord. 2, traitement 4 et Ord. 3"
        }
      },
      "r_pneumo": {
        "res": {
          "niveau": "attention",
          "titre": "Pneumonie (non grave)",
          "resume": "Amoxicilline orale 5 jours, réévaluation à 2 jours.",
          "conduite": [
            "Amoxicilline 50 mg/kg/jour en 3 prises pendant 5 jours ({mg:50} mg par jour) (ou ampicilline)",
            "Allergie aux pénicillines : érythromycine 50 mg/kg/jour en 2 prises, 5 jours",
            "Paracétamol si température > 38 °C",
            "Désobstruer le nez ; apprendre à la mère les signes de retour immédiat (tirage, stridor)",
            "Après 2 jours : amélioration = continuer, sinon référer"
          ],
          "meds": [
            "amoxicilline",
            "erythromycine",
            "paracetamol"
          ],
          "source": "Ord. 2, traitement 3"
        }
      },
      "r_asthme": {
        "res": {
          "niveau": "attention",
          "titre": "Crise d'asthme du nourrisson / de l'enfant",
          "resume": "Bronchodilatateur en chambre d'inhalation.",
          "conduite": [
            "Salbutamol spray + chambre d'inhalation : 1 à 2 bouffées, à renouveler toutes les 30 min à 1 h jusqu'à l'arrêt de la crise",
            "Fièvre ou signes de pneumonie : érythromycine 50 mg/kg/jour en 2 prises, 5 jours",
            "Détresse respiratoire : bétaméthasone IM (2 à 8 mg selon l'âge), puis référer",
            "Traitement de fond par corticoïdes inhalés (selon niveau de gravité)"
          ],
          "meds": [
            "salbutamol",
            "erythromycine"
          ],
          "source": "Ord. 2, traitement 5"
        }
      },
      "r_laryngite": {
        "res": {
          "niveau": "urgence",
          "titre": "Laryngite avec stridor",
          "resume": "Traiter puis réévaluer à 1 heure ; référer si pas d'amélioration.",
          "conduite": [
            "Enfant < 6 mois : pénicilline G 50 000 UI/kg IM ; enfant > 6 mois : ceftriaxone 50 mg/kg/jour IV",
            "Bétaméthasone 4 mg IM (1 ampoule)",
            "Prométhazine 1 mg/kg IM",
            "Après 1 heure : amélioration = continuer l'antibiotique 6 jours ; sinon référer"
          ],
          "meds": [
            "ceftriaxone"
          ],
          "source": "Ord. 2, traitement 2"
        }
      },
      "r_rhino": {
        "res": {
          "niveau": "ok",
          "titre": "Rhinopharyngite",
          "resume": "Traitement symptomatique ; antibiotique selon le manuel.",
          "conduite": [
            "Paracétamol si température > 38 °C",
            "Désobstruer et désinfecter les narines au sérum physiologique",
            "Le manuel prescrit : amoxicilline ou érythromycine 50 mg/kg en 2 prises pendant 10 jours",
            "Apprendre à la mère quand revenir immédiatement (tirage, stridor) ; pas d'amélioration : référer"
          ],
          "meds": [
            "paracetamol",
            "erythromycine"
          ],
          "source": "Ord. 2, traitement 1"
        }
      },
      "r_bronchite": {
        "res": {
          "niveau": "attention",
          "titre": "Bronchite",
          "resume": "Fluidifiant et antibiotique selon le manuel.",
          "conduite": [
            "Bromhexine 0,5 mg/kg/jour, ou acétylcystéine (2 à 7 ans : 400 mg/j en 2 prises ; > 8 ans : 600 mg/j en 3 prises), 7 jours",
            "Amoxicilline 100 mg/kg en 3 prises/jour pendant 5 jours, ou érythromycine 50 mg/kg/jour en 2 prises, 5 jours",
            "Amélioration : continuer ; sinon référer"
          ],
          "meds": [
            "amoxicilline",
            "erythromycine"
          ],
          "source": "Ord. 2, traitement 6"
        }
      },
      "r_corps": {
        "res": {
          "niveau": "urgence",
          "titre": "Inhalation de corps étranger / fausse route",
          "resume": "Manœuvre de Heimlich, référer si détresse.",
          "conduite": [
            "Manœuvre de Heimlich",
            "Ne pas faire vomir, pas de lavage d'estomac",
            "Détresse respiratoire : référer",
            "Signes de pneumonie : traiter ; surveiller l'enfant"
          ],
          "meds": [],
          "source": "Ord. 2, traitement 7"
        }
      },
      "r_tb": {
        "res": {
          "niveau": "attention",
          "titre": "Toux prolongée : tuberculose possible",
          "resume": "Référer pour diagnostic.",
          "conduite": [
            "Rechercher un contage tuberculeux, un amaigrissement, une infection à VIH",
            "Référer pour bilan"
          ],
          "meds": [],
          "source": "Ord. 3 (tuberculose : référer)"
        }
      },
      "r_ref": {
        "res": {
          "niveau": "attention",
          "titre": "Autres signes : référer",
          "resume": "Pas de conduite spécifique dans le manuel.",
          "conduite": [
            "Référer pour avis médical"
          ],
          "meds": [],
          "source": "Ord. 2 (« autres signes : référer »)"
        }
      }
    }
  },
  {
    "id": "diarrhee_enf",
    "groupe": "Enfant",
    "titre": "Diarrhée de l'enfant",
    "sous": "Ord. 4 — évaluer toujours l'hydratation",
    "debut": "d0",
    "noeuds": {
      "d0": {
        "q": "Déshydratation SÉVÈRE ?",
        "aide": "Au moins 2 parmi : léthargie ou inconscience · yeux enfoncés · incapable de boire · pli cutané qui s'efface très lentement.",
        "options": [
          {
            "t": "Oui (≥ 2 signes) — Plan C",
            "vers": "d_spec",
            "memo": "Hydratation : déshydratation SÉVÈRE → Plan C"
          },
          {
            "t": "Non",
            "vers": "d1"
          }
        ]
      },
      "d1": {
        "q": "Signes ÉVIDENTS de déshydratation ?",
        "aide": "Au moins 2 parmi : agité ou irritable · yeux enfoncés · boit avec avidité, assoiffé · pli cutané qui s'efface lentement.",
        "options": [
          {
            "t": "Oui (≥ 2 signes) — Plan B",
            "vers": "d_spec",
            "memo": "Hydratation : signes évidents → Plan B (SRO 75 mL/kg en 4 h)"
          },
          {
            "t": "Non — Plan A",
            "vers": "d_spec",
            "memo": "Hydratation : pas de déshydratation → Plan A"
          }
        ]
      },
      "d_spec": {
        "q": "Autres caractéristiques ?",
        "options": [
          {
            "t": "Sang et/ou glaires dans les selles + fièvre (≥ 37,5 °C)",
            "vers": "r_bacillaire"
          },
          {
            "t": "Sang et/ou glaires dans les selles, sans fièvre",
            "vers": "r_amibienne"
          },
          {
            "t": "Selles « eau de riz » abondantes (choléra suspecté)",
            "vers": "r_cholera"
          },
          {
            "t": "Selles liquides depuis plus de 14 jours, amaigrissement, fièvre, mycose",
            "vers": "r_vih"
          },
          {
            "t": "Signes de malnutrition : amaigrissement, cheveux fins, œdèmes des pieds",
            "vers": "r_malnut"
          },
          {
            "t": "Aucune de ces caractéristiques",
            "vers": "r_simple"
          }
        ]
      },
      "r_simple": {
        "res": {
          "niveau": "attention",
          "titre": "Diarrhée aiguë : réhydratation + zinc",
          "resume": "Appliquer le plan de réhydratation retenu et donner le zinc.",
          "conduite": [
            "Plan A : SRO 50 à 100 mL après chaque selle liquide (domicile)",
            "Plan B : SRO 75 mL/kg en 4 h = {kg:75} mL ; réévaluer après 4 h",
            "Plan C (déshydratation sévère) : perfusion de Ringer lactate (à défaut sérum physiologique 0,9 %), 100 mL/kg en tout = {kg:100} mL. Moins de 12 mois : 30 mL/kg = {kg:30} mL en 1 heure. 12 mois et plus : 30 mL/kg = {kg:30} mL en 30 minutes. Puis le reste, 70 mL/kg = {kg:70} mL, en 1 heure. Si le pouls radial reste faible ou imperceptible : référer",
            "Zinc dans tous les cas : ½ cp/jour pendant 10 jours jusqu'à 6 mois ; 1 cp/jour pendant 14 jours dès 7 mois",
            "Poursuivre l'allaitement et l'alimentation ; pas d'antibiotique ni d'antidiarrhéique",
            "Revenir si boit mal, fièvre, sang dans les selles, aggravation"
          ],
          "meds": [
            "sro",
            "zinc"
          ],
          "source": "Ord. 4"
        }
      },
      "r_bacillaire": {
        "res": {
          "niveau": "attention",
          "titre": "Dysenterie bacillaire (shigellose)",
          "resume": "Ciprofloxacine 5 jours + réhydratation + zinc.",
          "conduite": [
            "Réhydratation selon le plan retenu (voir plus haut) ; SRO plan B = {kg:75} mL en 4 h",
            "Ciprofloxacine 15-20 mg/kg/jour en 2 prises pendant 5 jours (max 1000 mg/jour)",
            "Zinc 14 jours",
            "Revoir à 2 jours : sang encore présent ou pas d'amélioration → référer"
          ],
          "meds": [
            "ciprofloxacine",
            "sro",
            "zinc"
          ],
          "source": "Ord. 4, traitement 4"
        }
      },
      "r_amibienne": {
        "res": {
          "niveau": "attention",
          "titre": "Dysenterie amibienne",
          "resume": "Métronidazole 7 jours + réhydratation + zinc.",
          "conduite": [
            "Réhydratation selon le plan retenu ; SRO plan B = {kg:75} mL en 4 h",
            "Métronidazole 30-40 mg/kg/jour en 2 prises pendant 7 jours (2e intention : tinidazole 50-70 mg/kg en 1 prise par jour, 3 jours)",
            "Zinc 14 jours",
            "Revoir à 3 jours : sang encore présent → référer"
          ],
          "meds": [
            "metronidazole",
            "sro",
            "zinc"
          ],
          "source": "Ord. 4, traitement 5"
        }
      },
      "r_cholera": {
        "res": {
          "niveau": "urgence",
          "titre": "Choléra suspecté",
          "resume": "Réhydrater, antibiotique, isoler et notifier.",
          "conduite": [
            "Réhydratation rapide selon le degré (plan B/C) ; SRO plan B = {kg:75} mL en 4 h",
            "Ciprofloxacine 15-20 mg/kg/jour en 2 prises pendant 3 jours (1re intention)",
            "Enfant > 8 ans : doxycycline 4 mg/kg/jour en 1 prise (max 200 mg/jour)",
            "2e intention : érythromycine, 4 fois par jour pendant 3 jours",
            "Isoler, mesures d'hygiène, notifier immédiatement ; référer"
          ],
          "meds": [
            "ciprofloxacine",
            "erythromycine",
            "sro",
            "zinc"
          ],
          "source": "Ord. 4, traitement 8"
        }
      },
      "r_vih": {
        "res": {
          "niveau": "attention",
          "titre": "Diarrhée persistante : infection à VIH probable",
          "resume": "Réhydrater, cotrimoxazole, référer.",
          "conduite": [
            "Traiter la déshydratation selon le plan retenu",
            "Cotrimoxazole : ½ comprimé de 480 mg pour 5 kg/jour en 2 prises pendant 5 jours (sirop : 5 mL pour 5 kg/jour)",
            "Zinc 14 jours",
            "Référer en cas de persistance de la diarrhée"
          ],
          "meds": [
            "sro",
            "zinc"
          ],
          "source": "Ord. 4, traitement 6"
        }
      },
      "r_malnut": {
        "res": {
          "niveau": "attention",
          "titre": "Malnutrition associée",
          "resume": "Réhydrater prudemment et référer vers le centre nutritionnel.",
          "conduite": [
            "Traiter la déshydratation selon le plan retenu",
            "Malnutrition modérée : référer vers le CRENAM",
            "Malnutrition sévère : référer vers le CRENI / CRENAS",
            "Zinc 14 jours"
          ],
          "meds": [
            "sro",
            "zinc"
          ],
          "source": "Ord. 4, traitement 7"
        }
      }
    }
  },
  {
    "id": "gorge_enf",
    "groupe": "Enfant",
    "titre": "Mal de gorge de l'enfant",
    "sous": "Ord. 11",
    "debut": "g0",
    "noeuds": {
      "g0": {
        "q": "Que trouve-t-on à l'examen ?",
        "options": [
          {
            "t": "Gorge rouge, enduits blanchâtres, fièvre, difficulté à avaler",
            "vers": "r_angine"
          },
          {
            "t": "Fausses membranes, ganglions, grosse rate",
            "vers": "r_mono"
          },
          {
            "t": "Ouverture difficile de la bouche",
            "vers": "r_abces"
          },
          {
            "t": "Corps étranger visible ou suspecté",
            "vers": "r_corps"
          },
          {
            "t": "Nez qui coule ou bouché, fièvre, ganglions (rhinopharyngite)",
            "vers": "algo:toux_enf"
          },
          {
            "t": "Autres signes",
            "vers": "r_ref"
          }
        ]
      },
      "r_angine": {
        "res": {
          "niveau": "attention",
          "titre": "Angine bactérienne",
          "resume": "Amoxicilline 10 jours + antalgique.",
          "conduite": [
            "Amoxicilline (ou ampicilline) 100 mg/kg/jour en 3 prises par voie orale, 10 jours ; ou érythromycine 50 mg/kg/jour en 2 prises",
            "Antalgique : paracétamol, et anti-inflammatoire (ibuprofène) si besoin",
            "Continuer l'antibiotique 10 jours même sans douleur (RAA, glomérulonéphrite)",
            "Évolution défavorable : maintenir le traitement et référer"
          ],
          "meds": [
            "amoxicilline",
            "erythromycine",
            "paracetamol",
            "ibuprofene"
          ],
          "source": "Ord. 11, traitement 1"
        }
      },
      "r_mono": {
        "res": {
          "niveau": "attention",
          "titre": "Mononucléose infectieuse possible",
          "resume": "Référer.",
          "conduite": [
            "Référer pour avis médical"
          ],
          "meds": [],
          "source": "Ord. 11"
        }
      },
      "r_abces": {
        "res": {
          "niveau": "urgence",
          "titre": "Abcès de l'amygdale",
          "resume": "Première dose puis référer.",
          "conduite": [
            "Benzathine pénicilline en IM : enfant ≥ 5 ans 1,2 MUI ; enfant < 5 ans 600 000 UI",
            "Référer"
          ],
          "meds": [],
          "source": "Ord. 11, traitement 2"
        }
      },
      "r_corps": {
        "res": {
          "niveau": "urgence",
          "titre": "Corps étranger de la gorge",
          "resume": "Manœuvre de Heimlich ; référer rapidement si échec.",
          "conduite": [
            "Manœuvre de Heimlich",
            "Si échec : paracétamol injectable 15 mg/kg et amoxicilline injectable 50 mg/kg avant le transfert",
            "Référer rapidement"
          ],
          "meds": [],
          "source": "Ord. 11, traitement 3"
        }
      },
      "r_ref": {
        "res": {
          "niveau": "attention",
          "titre": "Autres signes : référer",
          "resume": "Pas de conduite spécifique.",
          "conduite": [
            "Référer pour avis médical"
          ],
          "meds": [],
          "source": "Ord. 11"
        }
      }
    }
  },
  {
    "id": "gorge_adu",
    "groupe": "Adulte",
    "titre": "Mal de gorge de l'adulte",
    "sous": "Togo Ord. 40 : douleur de gorge, difficulté à avaler (dysphagie)",
    "debut": "g0",
    "noeuds": {
      "g0": {
        "q": "Que trouve-t-on à l'examen ?",
        "aide": "Mal de gorge : sensation douloureuse de la gorge avec difficulté à avaler. Regarder la gorge avec une lampe et un abaisse-langue ; chercher fièvre (> 37,5 °C), enduits, fausses membranes, ganglions.",
        "options": [
          {
            "t": "Gorge rouge, avec ou sans dépôts blanchâtres faciles à enlever, fièvre > 37,5 °C",
            "vers": "r_angine"
          },
          {
            "t": "Fausses membranes",
            "vers": "r_membranes"
          },
          {
            "t": "Impossible d'avaler, ouverture de la bouche difficile (abcès de l'amygdale)",
            "vers": "r_abces"
          },
          {
            "t": "Sensation de corps étranger",
            "vers": "r_corps"
          },
          {
            "t": "Plaie dans la gorge avec saignement, ou notion de traumatisme",
            "vers": "r_trauma"
          },
          {
            "t": "Modification de la voix et/ou amaigrissement",
            "vers": "r_cancer"
          },
          {
            "t": "Nez qui coule ou bouché, toux, gorge irritée (rhinopharyngite)",
            "vers": "r_rhino"
          },
          {
            "t": "Autres signes",
            "vers": "r_ref"
          }
        ]
      },
      "r_angine": {
        "res": {
          "niveau": "attention",
          "titre": "Angine bactérienne",
          "resume": "Antibiotique + antalgique + gargarismes ; réévaluer à 3 jours.",
          "conduite": [
            "Antibiotique, un seul au choix : pénicilline V 50 000 UI/kg/jour = {n:50000} UI par jour pendant 10 jours ; ou amoxicilline 500 mg, 2 gélules matin et soir ; ou érythromycine 500 mg, 1 comprimé 3 fois par jour ; ou azithromycine 500 mg, 1 comprimé par jour pendant 3 jours",
            "Aspirine 500 mg : 2 comprimés matin, midi et soir (pendant les repas)",
            "Gargarisme à l'eau tiède salée matin, midi et soir",
            "Durée totale 10 jours (pénicilline V, amoxicilline, érythromycine). Après 3 jours : évolution bonne : poursuivre le traitement ; évolution défavorable : maintenir le traitement et référer",
            "Insister : continuer l'antibiotique après la disparition des douleurs (rhumatisme articulaire aigu, glomérulonéphrite, endocardite)"
          ],
          "meds": [
            "amoxicilline",
            "erythromycine",
            "azithromycine",
            "aspirine"
          ],
          "source": "Togo Ord. 40 (mal de gorge)"
        }
      },
      "r_membranes": {
        "res": {
          "niveau": "urgence",
          "titre": "Fausses membranes dans la gorge",
          "resume": "Diphtérie à éliminer d'abord ; mononucléose en diagnostic différentiel : 1re dose et référer.",
          "conduite": [
            "Diphtérie à suspecter et éliminer en premier : benzylpénicilline 50 000 UI/kg/jour en IM = {n:50000} UI par jour, et aspirine 500 mg 2 comprimés, puis référer",
            "Isoler le patient ; notifier si diphtérie suspectée",
            "Diagnostic différentiel : mononucléose infectieuse (aspirine, puis référer)",
            "Référer"
          ],
          "meds": [
            "aspirine"
          ],
          "source": "Togo Ord. 40 (mal de gorge)"
        }
      },
      "r_abces": {
        "res": {
          "niveau": "urgence",
          "titre": "Abcès de l'amygdale",
          "resume": "Première dose puis référer immédiatement.",
          "conduite": [
            "Benzathine pénicilline 2,4 MUI en IM, dose unique",
            "Référer immédiatement"
          ],
          "meds": [
            "benzathine-penicilline"
          ],
          "source": "Togo Ord. 40 (mal de gorge)"
        }
      },
      "r_corps": {
        "res": {
          "niveau": "urgence",
          "titre": "Corps étranger de la gorge",
          "resume": "Extraire si visible et accessible ; sinon référer.",
          "conduite": [
            "Si le corps étranger est visible et facilement accessible : le saisir avec une pince et l'extraire",
            "Puis donner : ibuprofène pendant 3 jours et amoxicilline",
            "Échec de l'extraction : référer"
          ],
          "meds": [
            "ibuprofene",
            "amoxicilline"
          ],
          "source": "Togo Ord. 40 (mal de gorge)"
        }
      },
      "r_trauma": {
        "res": {
          "niveau": "urgence",
          "titre": "Plaie de la gorge ou traumatisme",
          "resume": "Référer.",
          "conduite": [
            "Plaie dans la gorge avec saignement, ou notion de traumatisme : référer"
          ],
          "meds": [],
          "source": "Togo Ord. 40 (mal de gorge)"
        }
      },
      "r_cancer": {
        "res": {
          "niveau": "attention",
          "titre": "Cancer de la gorge possible",
          "resume": "Antalgique puis référer.",
          "conduite": [
            "Modification de la voix et/ou amaigrissement chez l'adulte : paracétamol 500 mg, 2 comprimés matin, midi et soir",
            "Référer pour bilan"
          ],
          "meds": [
            "paracetamol"
          ],
          "source": "Togo Ord. 40 (mal de gorge)"
        }
      },
      "r_rhino": {
        "res": {
          "niveau": "attention",
          "titre": "Rhinopharyngite",
          "resume": "Antalgique, antibiotique selon le manuel.",
          "conduite": [
            "Paracétamol ou aspirine",
            "Amoxicilline 500 mg, 2 gélules matin et soir, ou érythromycine, pendant 10 jours",
            "Pas d'amélioration : référer"
          ],
          "meds": [
            "paracetamol",
            "amoxicilline",
            "erythromycine"
          ],
          "source": "Togo Ord. 40 (mal de gorge)"
        }
      },
      "r_ref": {
        "res": {
          "niveau": "attention",
          "titre": "Autres signes : référer",
          "resume": "Référer.",
          "conduite": [
            "Référer pour avis médical"
          ],
          "meds": [],
          "source": "Togo Ord. 40 (mal de gorge)"
        }
      }
    }
  },
  {
    "id": "oreille_enf",
    "groupe": "Enfant",
    "titre": "Maladies de l'oreille de l'enfant",
    "sous": "Ord. 12",
    "debut": "o0",
    "noeuds": {
      "o0": {
        "q": "Que trouve-t-on à l'examen de l'oreille ?",
        "options": [
          {
            "t": "Tympan rouge, pas d'écoulement ou écoulement < 14 jours, fièvre",
            "vers": "r_oma"
          },
          {
            "t": "Écoulement d'oreille depuis plus de 14 jours",
            "vers": "r_omc"
          },
          {
            "t": "Douleur à la pression du tragus (furoncle du conduit)",
            "vers": "r_ext"
          },
          {
            "t": "Gonflement douloureux DERRIÈRE l'oreille",
            "vers": "r_mastoidite"
          },
          {
            "t": "Gonflement douloureux SOUS l'oreille (oreillons)",
            "vers": "r_parotidite"
          },
          {
            "t": "Écoulement de sang / traumatisme",
            "vers": "r_lesion"
          },
          {
            "t": "Corps étranger",
            "vers": "r_corps"
          },
          {
            "t": "Bouchon de cérumen",
            "vers": "r_cerumen"
          },
          {
            "t": "Baisse de l'audition, bourdonnements, vertiges",
            "vers": "r_ref"
          }
        ]
      },
      "r_oma": {
        "res": {
          "niveau": "attention",
          "titre": "Otite moyenne aiguë",
          "resume": "Amoxicilline + acide clavulanique, antalgique, réévaluer à 5 jours.",
          "conduite": [
            "Amoxicilline + acide clavulanique 50 mg/kg/jour (amoxicilline) en 3 prises, ou érythromycine 50 mg/kg/jour en 2 prises",
            "À 5 jours : bonne évolution = poursuivre encore 5 jours ; sinon ou rechute après 10 jours = référer",
            "Écoulement : assécher avec une mèche, ne rien mettre d'autre dans l'oreille",
            "Antalgique : paracétamol ou ibuprofène 30 mg/kg/jour en 3 prises pendant les repas"
          ],
          "meds": [
            "amox-clav",
            "erythromycine",
            "paracetamol",
            "ibuprofene"
          ],
          "source": "Ord. 12, traitement 1"
        }
      },
      "r_omc": {
        "res": {
          "niveau": "attention",
          "titre": "Otite moyenne chronique",
          "resume": "Assécher et gouttes de quinolone ; référer si pas d'amélioration à 5 jours.",
          "conduite": [
            "Assécher l'oreille avec une mèche, changer dès qu'elle est humide",
            "Quinolone en gouttes auriculaires",
            "Éviter que l'eau n'entre dans l'oreille (coton au moment de la toilette)",
            "Pas d'amélioration après 5 jours : référer"
          ],
          "meds": [],
          "source": "Ord. 12, traitement 2"
        }
      },
      "r_ext": {
        "res": {
          "niveau": "attention",
          "titre": "Otite externe / furoncle du conduit",
          "resume": "Même antibiotique que l'otite moyenne aiguë.",
          "conduite": [
            "Amoxicilline + acide clavulanique (voir otite moyenne aiguë)",
            "Antalgique"
          ],
          "meds": [
            "amox-clav",
            "paracetamol"
          ],
          "source": "Ord. 12, traitement 3"
        }
      },
      "r_mastoidite": {
        "res": {
          "niveau": "urgence",
          "titre": "Mastoïdite aiguë",
          "resume": "Première dose puis référer.",
          "conduite": [
            "Ampicilline 50 mg/kg + gentamicine 3 mg/kg en IM",
            "Référer"
          ],
          "meds": [],
          "source": "Ord. 12, traitement 4"
        }
      },
      "r_parotidite": {
        "res": {
          "niveau": "attention",
          "titre": "Parotidite aiguë / oreillons",
          "resume": "Repos et même attitude que l'otite moyenne aiguë.",
          "conduite": [
            "Vitamine C 500 mg par jour (enfant de plus de 5 ans)",
            "Repos au lit, éviction scolaire 7 jours",
            "Même traitement que l'otite moyenne aiguë",
            "Douleurs testiculaires : référer"
          ],
          "meds": [
            "amox-clav",
            "paracetamol"
          ],
          "source": "Ord. 12, traitement 5"
        }
      },
      "r_lesion": {
        "res": {
          "niveau": "urgence",
          "titre": "Lésion certaine de l'oreille",
          "resume": "Première dose puis référer.",
          "conduite": [
            "Mèche stérile dans l'oreille",
            "Ampicilline 50 mg/kg + gentamicine 3 mg/kg en IM",
            "Paracétamol 15 mg/kg en IV",
            "Référer"
          ],
          "meds": [],
          "source": "Ord. 12, traitement 6"
        }
      },
      "r_corps": {
        "res": {
          "niveau": "attention",
          "titre": "Corps étranger de l'oreille",
          "resume": "Extraction à la pince, pas de lavage.",
          "conduite": [
            "Tenter l'extraction avec une pince ; ne pas laver l'oreille",
            "Amoxicilline + acide clavulanique 7 jours",
            "Échec d'extraction : même traitement et référer"
          ],
          "meds": [
            "amox-clav"
          ],
          "source": "Ord. 12, traitement 7"
        }
      },
      "r_cerumen": {
        "res": {
          "niveau": "ok",
          "titre": "Bouchon de cérumen",
          "resume": "Lavage à l'eau tiède.",
          "conduite": [
            "Lavage à l'eau tiède avec une grosse seringue sans aiguille",
            "Le patient entend-il mieux ? Sinon référer",
            "Douleur après lavage : AAS ou ibuprofène 3 jours"
          ],
          "meds": [
            "ibuprofene"
          ],
          "source": "Ord. 12, traitement 9"
        }
      },
      "r_ref": {
        "res": {
          "niveau": "attention",
          "titre": "Référer",
          "resume": "Troubles cochléo-vestibulaires ou autres signes.",
          "conduite": [
            "Référer pour avis spécialisé"
          ],
          "meds": [],
          "source": "Ord. 12"
        }
      }
    }
  },
  {
    "id": "fievre_adu",
    "groupe": "Adulte",
    "titre": "Fièvre de l'adulte",
    "sous": "Ord. 16 — température > 37,5 °C",
    "debut": "a0",
    "noeuds": {
      "a0": {
        "q": "Signes de gravité ou vomissements importants ?",
        "aide": "Vomissements importants · convulsions · troubles de la conscience · ictère · urines foncées · détresse respiratoire · pâleur sévère · oligo-anurie.",
        "options": [
          {
            "t": "Oui",
            "vers": "r_grave"
          },
          {
            "t": "Non",
            "vers": "a1"
          }
        ]
      },
      "a1": {
        "q": "Raideur de la nuque, céphalées intenses, vomissements en jet, notion d'épidémie ?",
        "options": [
          {
            "t": "Oui",
            "vers": "r_mening"
          },
          {
            "t": "Non",
            "vers": "a2"
          }
        ]
      },
      "a2": {
        "q": "Vomissements noirâtres ou saignements de la peau et des muqueuses ?",
        "options": [
          {
            "t": "Oui",
            "vers": "r_fj"
          },
          {
            "t": "Non",
            "vers": "a3"
          }
        ]
      },
      "a3": {
        "q": "Résultat du TDR / goutte épaisse (frissons, courbatures, céphalées) ?",
        "options": [
          {
            "t": "Positif",
            "vers": "r_palu"
          },
          {
            "t": "Négatif ou non disponible",
            "vers": "a4"
          }
        ]
      },
      "a4": {
        "q": "Quel foyer ou syndrome oriente ?",
        "options": [
          {
            "t": "Toux, dyspnée, douleur thoracique, râles crépitants",
            "vers": "algo:toux_adu"
          },
          {
            "t": "Diarrhée",
            "vers": "algo:diarrhee_adu"
          },
          {
            "t": "Fièvre > 39 °C isolée depuis plus de 7 jours, fatigue, pouls dissocié",
            "vers": "r_typhoide"
          },
          {
            "t": "Écoulement nasal, toux, larmoiement, céphalées",
            "vers": "r_grippe"
          },
          {
            "t": "Ictère, nausées, douleur de l'hypocondre droit",
            "vers": "r_hepatite"
          },
          {
            "t": "Fièvre > 1 mois, sueurs nocturnes, amaigrissement, toux > 2 semaines",
            "vers": "r_tb"
          },
          {
            "t": "Mal de gorge, oreille, sinus",
            "vers": "r_orl"
          },
          {
            "t": "Autres signes",
            "vers": "r_ref"
          }
        ]
      },
      "r_grave": {
        "res": {
          "niveau": "urgence",
          "titre": "Paludisme grave / maladie fébrile grave",
          "resume": "1re dose puis transfert en urgence à l'hôpital.",
          "conduite": [
            "Artésunate injectable 2,4 mg/kg = {mg:2.4} mg en IV ou IM (3 mg/kg si poids < 20 kg), ou artéméther 160 mg IM, ou quinine injectable (15 mg/kg de sels en perfusion dans du SGI 5 % / 12,5 mg/kg base)",
            "Antibiotique : ampicilline 100 mg/kg IM, ou ceftriaxone 50 mg/kg IM",
            "Convulsions : diazépam 10 mg IM, patient sur le côté, aspirer les sécrétions",
            "Hypoglycémie : 100 mL d'eau sucrée si le patient peut boire, ou SGH 10 % 250 mL en perfusion",
            "Paracétamol ou AAS si fièvre ≥ 38,5 °C et pour les céphalées",
            "Référer d'urgence"
          ],
          "meds": [
            "artesunate",
            "artemether-inj",
            "quinine-inj",
            "ceftriaxone",
            "diazepam",
            "sgh10",
            "paracetamol"
          ],
          "source": "Ord. 16, traitement 2"
        }
      },
      "r_mening": {
        "res": {
          "niveau": "urgence",
          "titre": "Méningite possible",
          "resume": "Première dose de ceftriaxone, notifier, référer.",
          "conduite": [
            "Ceftriaxone 1 g IM ou IV direct (ou ampicilline 200 mg/kg IM/IV)",
            "Paracétamol ou AAS si fièvre",
            "Notifier à l'échelon supérieur",
            "Référer"
          ],
          "meds": [
            "ceftriaxone",
            "paracetamol"
          ],
          "source": "Ord. 16, traitement 3"
        }
      },
      "r_fj": {
        "res": {
          "niveau": "urgence",
          "titre": "Fièvre jaune ou fièvre hémorragique possible",
          "resume": "Alerter immédiatement l'échelon supérieur.",
          "conduite": [
            "Isoler le malade, mesures de protection",
            "SRO à boire à volonté, compresses froides",
            "Ne pas donner d'AAS",
            "Alerter l'échelon supérieur immédiatement et référer"
          ],
          "meds": [
            "sro"
          ],
          "source": "Ord. 16, traitement 9"
        }
      },
      "r_palu": {
        "res": {
          "niveau": "attention",
          "titre": "Paludisme simple",
          "resume": "CTA 3 jours + traitement de la fièvre.",
          "conduite": [
            "Artéméther-luméfantrine 20/120 mg : 4 comprimés matin et soir pendant 3 jours",
            "Paracétamol 500 mg : 2 comprimés x 3/jour (6 h d'intervalle)",
            "Eau à boire à volonté",
            "Fièvre persistante après 3 jours de traitement correct : rechercher d'autres affections, référer",
            "Femme enceinte : suivre le protocole du PNLP selon le trimestre"
          ],
          "meds": [
            "act-al",
            "paracetamol"
          ],
          "source": "Ord. 16, traitement 1"
        }
      },
      "r_typhoide": {
        "res": {
          "niveau": "attention",
          "titre": "Fièvre typhoïde possible",
          "resume": "Ciprofloxacine 15-21 jours ou ceftriaxone 10 jours.",
          "conduite": [
            "Ciprofloxacine 500 mg : 1 comprimé x 2/jour pendant 15 à 21 jours",
            "ou ceftriaxone 2 g/jour en 2 injections IM/IV pendant 10 jours (relais oral si amélioration après 3 jours)",
            "Fièvre persistante après le 7e jour : référer"
          ],
          "meds": [
            "ciprofloxacine",
            "ceftriaxone"
          ],
          "source": "Ord. 16, traitement 4"
        }
      },
      "r_grippe": {
        "res": {
          "niveau": "ok",
          "titre": "Syndrome grippal",
          "resume": "Traitement symptomatique.",
          "conduite": [
            "Paracétamol ou AAS",
            "Vitamine C 1000 mg le matin",
            "Repos, boissons chaudes, calmer la toux si besoin, antihistaminique"
          ],
          "meds": [
            "paracetamol"
          ],
          "source": "Ord. 16, traitement 5"
        }
      },
      "r_hepatite": {
        "res": {
          "niveau": "attention",
          "titre": "Hépatite possible",
          "resume": "Voir l'algorithme « Ictère de l'adulte ».",
          "conduite": [
            "Référer pour bilan",
            "Éviter les médicaments hépatotoxiques (paracétamol à dose réduite)"
          ],
          "meds": [],
          "source": "Ord. 16 → Ord. 21",
          "liens": [
            {
              "t": "Ictère de l'adulte",
              "vers": "algo:ictere_adu"
            }
          ]
        }
      },
      "r_tb": {
        "res": {
          "niveau": "attention",
          "titre": "Tuberculose / infection à VIH possible",
          "resume": "Suivre les directives des programmes nationaux.",
          "conduite": [
            "Référer pour examen de crachats et dépistage selon le PNLT et le PNLS"
          ],
          "meds": [],
          "source": "Ord. 16, traitement 7"
        }
      },
      "r_orl": {
        "res": {
          "niveau": "attention",
          "titre": "Affection ORL",
          "resume": "Voir les algorithmes mal de gorge, oreille et écoulement nasal.",
          "conduite": [
            "Examiner la gorge, les tympans et les sinus",
            "Paracétamol",
            "Antibiotique selon le manuel (amoxicilline ou érythromycine si angine bactérienne)",
            "Référer en cas de doute"
          ],
          "meds": [
            "paracetamol"
          ],
          "source": "Ord. 16, traitement 10 → Ord. 35, 40, 41",
          "liens": [
            {
              "t": "Mal de gorge de l'adulte",
              "vers": "algo:gorge_adu"
            },
            {
              "t": "Maladies de l'oreille de l'adulte",
              "vers": "algo:oreille_adu"
            },
            {
              "t": "Écoulement nasal",
              "vers": "algo:nez"
            }
          ]
        }
      },
      "r_ref": {
        "res": {
          "niveau": "attention",
          "titre": "Autres signes : référer",
          "resume": "Pas de conduite spécifique.",
          "conduite": [
            "Paracétamol",
            "Référer pour bilan"
          ],
          "meds": [
            "paracetamol"
          ],
          "source": "Ord. 16"
        }
      }
    }
  },
  {
    "id": "toux_adu",
    "groupe": "Adulte",
    "titre": "Toux de l'adulte",
    "sous": "Ord. 17 et 19",
    "debut": "u0",
    "noeuds": {
      "u0": {
        "q": "Fièvre > 1 mois, amaigrissement, sueurs nocturnes, toux > 15 jours ?",
        "options": [
          {
            "t": "Oui",
            "vers": "r_tb"
          },
          {
            "t": "Non",
            "vers": "u1"
          }
        ]
      },
      "u1": {
        "q": "Fièvre + dyspnée + douleur thoracique + râles crépitants ?",
        "options": [
          {
            "t": "Oui",
            "vers": "u1b"
          },
          {
            "t": "Non",
            "vers": "u2"
          }
        ]
      },
      "u1b": {
        "q": "Signes de gravité ?",
        "aide": "Détresse respiratoire · cyanose · confusion · fréquence respiratoire élevée · tension basse · incapacité à boire · tirage sous-costal · stridor · saturation en O₂ < 90 %.",
        "options": [
          {
            "t": "Oui",
            "vers": "r_pneumo_grave"
          },
          {
            "t": "Non",
            "vers": "r_pneumo"
          }
        ]
      },
      "u2": {
        "q": "Autres signes ?",
        "options": [
          {
            "t": "Fièvre, crachats jaunâtres",
            "vers": "r_bronchite"
          },
          {
            "t": "Fièvre, toux, voix rauque ou éteinte",
            "vers": "r_laryngite"
          },
          {
            "t": "Écoulement nasal, toux, larmoiement, céphalées",
            "vers": "r_grippe"
          },
          {
            "t": "Râles sibilants, dyspnée expiratoire",
            "vers": "r_asthme"
          },
          {
            "t": "Dyspnée de décubitus ou œdèmes des membres inférieurs",
            "vers": "r_ic"
          },
          {
            "t": "Crachat mousseux rosé, orthopnée, râles crépitants, HTA",
            "vers": "r_oap"
          },
          {
            "t": "Rougeur conjonctivale, larmoiement, prurit",
            "vers": "r_allergie"
          },
          {
            "t": "Autres signes",
            "vers": "r_ref"
          }
        ]
      },
      "r_tb": {
        "res": {
          "niveau": "attention",
          "titre": "Tuberculose possible",
          "resume": "Référer pour diagnostic et traitement selon le programme national.",
          "conduite": [
            "Référer pour examen de crachats et mise sous traitement selon le PNLT"
          ],
          "meds": [],
          "source": "Ord. 17"
        }
      },
      "r_pneumo": {
        "res": {
          "niveau": "attention",
          "titre": "Pneumonie (sans signe de gravité)",
          "resume": "Amoxicilline 10 jours, revoir à 5 jours.",
          "conduite": [
            "Amoxicilline 1 g par voie orale matin, midi et soir pendant 10 jours (ou ampicilline 1 g x 3/j)",
            "Alternative : érythromycine 1 g matin et soir pendant 7 jours",
            "Paracétamol ou AAS 1 g x 3/jour si température > 38,5 °C",
            "Pas d'amélioration après 5 jours : référer"
          ],
          "meds": [
            "amoxicilline",
            "erythromycine",
            "paracetamol"
          ],
          "source": "Ord. 17, traitement 2 et Ord. 16, traitement 6"
        }
      },
      "r_pneumo_grave": {
        "res": {
          "niveau": "urgence",
          "titre": "Pneumonie avec signes de gravité",
          "resume": "Ceftriaxone puis référer.",
          "conduite": [
            "Ceftriaxone 2 g IM ou IV direct, puis référer",
            "Position demi-assise, oxygène si disponible"
          ],
          "meds": [
            "ceftriaxone",
            "amox-clav"
          ],
          "source": "Ord. 17 et Ord. 19, traitement 5"
        }
      },
      "r_bronchite": {
        "res": {
          "niveau": "attention",
          "titre": "Bronchite aiguë",
          "resume": "Paracétamol, fluidifiant ; antibiotique si fièvre persistante.",
          "conduite": [
            "Paracétamol 500 mg : 2 comprimés matin et soir",
            "Expectorant",
            "Fièvre persistante après 5 jours : amoxicilline 1 g x 3/j pendant 10 jours (ou érythromycine 1 g x 2/j pendant 7 jours)",
            "Pas d'amélioration après 10 jours : référer"
          ],
          "meds": [
            "paracetamol",
            "amoxicilline",
            "erythromycine"
          ],
          "source": "Ord. 17, traitement 3"
        }
      },
      "r_laryngite": {
        "res": {
          "niveau": "attention",
          "titre": "Laryngite",
          "resume": "Antibiotique ; corticoïde puis référer si dyspnée.",
          "conduite": [
            "Amoxicilline 1 g x 3/j pendant 10 jours ou érythromycine 1 g x 2/j pendant 7 jours",
            "Noscapine 1 comprimé x 3/j ou bromhexine 2 comprimés x 2/j",
            "Dyspnée : corticoïde puis référer"
          ],
          "meds": [
            "amoxicilline",
            "erythromycine"
          ],
          "source": "Ord. 17, traitement 4"
        }
      },
      "r_grippe": {
        "res": {
          "niveau": "ok",
          "titre": "Syndrome grippal",
          "resume": "Traitement symptomatique.",
          "conduite": [
            "Paracétamol ou AAS 500 mg x 3/j",
            "Terpine codéine 300-600 mg x 3/j pendant 5 à 7 jours",
            "Vitamine C 500 mg : 2 comprimés le matin",
            "Repos, boissons chaudes, antihistaminique"
          ],
          "meds": [
            "paracetamol"
          ],
          "source": "Ord. 17, traitement 5"
        }
      },
      "r_asthme": {
        "res": {
          "niveau": "attention",
          "titre": "Crise d'asthme",
          "resume": "Salbutamol en chambre d'inhalation.",
          "conduite": [
            "Salbutamol aérosol 1 à 2 bouffées avec chambre d'inhalation dès les premiers symptômes, à répéter après 15 min si besoin",
            "Crise persistante après 1 heure : référer en position demi-assise",
            "Si la crise cède : corticoïde inhalé 1 à 2 bouffées pendant 30 jours"
          ],
          "meds": [
            "salbutamol"
          ],
          "source": "Ord. 17, traitement 6 et Ord. 19"
        }
      },
      "r_ic": {
        "res": {
          "niveau": "urgence",
          "titre": "Insuffisance cardiaque possible",
          "resume": "Référer ; voir aussi les algorithmes dyspnée et œdèmes.",
          "conduite": [
            "Position demi-assise",
            "Référer"
          ],
          "meds": [],
          "source": "Ord. 17 → Ord. 19 et 37",
          "liens": [
            {
              "t": "Dyspnée de l'adulte",
              "vers": "algo:dyspnee_adu"
            },
            {
              "t": "Œdèmes",
              "vers": "algo:oedemes"
            }
          ]
        }
      },
      "r_oap": {
        "res": {
          "niveau": "urgence",
          "titre": "Œdème aigu du poumon possible",
          "resume": "Furosémide IV puis référer.",
          "conduite": [
            "Position demi-assise",
            "Furosémide 20 mg : 2 ampoules en IV direct",
            "Référer d'urgence"
          ],
          "meds": [],
          "source": "Ord. 19, traitement 1"
        }
      },
      "r_allergie": {
        "res": {
          "niveau": "ok",
          "titre": "Allergie",
          "resume": "Antihistaminique.",
          "conduite": [
            "Polaramine 2 mg : 1 comprimé x 3/j, ou loratadine : 1 comprimé/jour",
            "Persistance : référer"
          ],
          "meds": [],
          "source": "Ord. 17, traitement 9"
        }
      },
      "r_ref": {
        "res": {
          "niveau": "attention",
          "titre": "Autres signes : référer",
          "resume": "Pas de conduite spécifique.",
          "conduite": [
            "Référer pour avis médical"
          ],
          "meds": [],
          "source": "Ord. 17"
        }
      }
    }
  },
  {
    "id": "diarrhee_adu",
    "groupe": "Adulte",
    "titre": "Diarrhée de l'adulte",
    "sous": "Ord. 18",
    "debut": "da0",
    "noeuds": {
      "da0": {
        "q": "Que présente le patient ?",
        "options": [
          {
            "t": "Selles profuses blanchâtres « eau de riz » + déshydratation",
            "vers": "r_cholera"
          },
          {
            "t": "Sang et/ou glaires, épreintes, ténesme, fièvre ≥ 37,5 °C",
            "vers": "r_bacillaire"
          },
          {
            "t": "Sang et/ou glaires sans fièvre",
            "vers": "r_amibienne"
          },
          {
            "t": "Vomissements après ingestion d'aliments ou de produits suspects",
            "vers": "r_intox"
          },
          {
            "t": "Diarrhée hémorragique + fièvre + vomissements (± sanglants)",
            "vers": "r_fhv"
          },
          {
            "t": "Fièvre, vomissements, pouls dissocié, durée > 15 jours",
            "vers": "r_typhoide"
          },
          {
            "t": "Amaigrissement, dermatose, fièvre, candidose buccale",
            "vers": "r_vih"
          },
          {
            "t": "Autres signes",
            "vers": "r_ref"
          }
        ]
      },
      "r_cholera": {
        "res": {
          "niveau": "urgence",
          "titre": "Choléra suspecté : référer",
          "resume": "Isoler, réhydrater, antibiotique, notifier, référer.",
          "conduite": [
            "Isoler le malade ; notifier à l'échelon supérieur",
            "Réhydrater en attendant le transfert (SRO et/ou Ringer lactate)",
            "Hygiène alimentaire et environnementale",
            "Référer"
          ],
          "meds": [
            "sro"
          ],
          "source": "Togo Ord. 18, traitement 1 ; antibiotique non donné en USP : décision du validateur"
        }
      },
      "r_bacillaire": {
        "res": {
          "niveau": "attention",
          "titre": "Dysenterie bacillaire",
          "resume": "Cotrimoxazole ou ciprofloxacine 10 jours.",
          "conduite": [
            "Cotrimoxazole 480 mg : 2 comprimés matin et soir pendant 10 jours, ou ciprofloxacine 500 mg matin et soir pendant 10 jours",
            "Déparasiter : tinidazole 500 mg, 4 comprimés en prise unique par jour pendant 3 jours",
            "Réhydrater (SRO)",
            "Amélioration : continuer jusqu'à l'arrêt de la dysenterie ; sinon référer"
          ],
          "meds": [
            "ciprofloxacine",
            "sro"
          ],
          "source": "Ord. 18, traitement 3"
        }
      },
      "r_amibienne": {
        "res": {
          "niveau": "attention",
          "titre": "Dysenterie amibienne",
          "resume": "Métronidazole 10 jours.",
          "conduite": [
            "Métronidazole 500 mg : 1 comprimé x 3/jour pendant 10 jours, ou tinidazole 500 mg : 4 comprimés en prise unique par jour pendant 3 jours",
            "Réhydrater (SRO)",
            "Revoir après 3 jours ; encore du sang dans les selles : référer"
          ],
          "meds": [
            "metronidazole",
            "sro"
          ],
          "source": "Ord. 18, traitement 4"
        }
      },
      "r_intox": {
        "res": {
          "niveau": "attention",
          "titre": "Intoxication alimentaire ou chimique",
          "resume": "Voir l'algorithme intoxication.",
          "conduite": [
            "Réhydrater",
            "Référer en cas de signes de gravité ou de produit toxique"
          ],
          "meds": [
            "sro"
          ],
          "source": "Ord. 18 → Ord. 38",
          "liens": [
            {
              "t": "Intoxication",
              "vers": "algo:intoxication"
            }
          ]
        }
      },
      "r_fhv": {
        "res": {
          "niveau": "urgence",
          "titre": "Fièvre hémorragique possible (Ebola…)",
          "resume": "Isoler et informer la hiérarchie.",
          "conduite": [
            "Isoler le malade, mesures de protection strictes",
            "Informer immédiatement la hiérarchie",
            "Référer"
          ],
          "meds": [],
          "source": "Ord. 18"
        }
      },
      "r_typhoide": {
        "res": {
          "niveau": "attention",
          "titre": "Fièvre typhoïde possible",
          "resume": "Ciprofloxacine 15-21 jours ou ceftriaxone 10 jours.",
          "conduite": [
            "Ciprofloxacine 500 mg : 1 comprimé x 2/jour pendant 15 à 21 jours",
            "ou ceftriaxone 1 g, 2 fois par jour pendant 10 jours (relais oral si amélioration à 3 jours)",
            "Fièvre persistante après le 7e jour : référer"
          ],
          "meds": [
            "ciprofloxacine",
            "ceftriaxone"
          ],
          "source": "Ord. 18, traitement 5"
        }
      },
      "r_vih": {
        "res": {
          "niveau": "attention",
          "titre": "VIH/SIDA suspecté",
          "resume": "Voir l'algorithme amaigrissement.",
          "conduite": [
            "Réhydrater",
            "Proposer le dépistage et référer selon le PNLS"
          ],
          "meds": [
            "sro"
          ],
          "source": "Ord. 18 → Ord. 22",
          "liens": [
            {
              "t": "Amaigrissement",
              "vers": "algo:amaigrissement"
            }
          ]
        }
      },
      "r_ref": {
        "res": {
          "niveau": "attention",
          "titre": "Autres signes : référer",
          "resume": "Pas de conduite spécifique.",
          "conduite": [
            "Réhydrater si besoin",
            "Référer"
          ],
          "meds": [
            "sro"
          ],
          "source": "Ord. 18"
        }
      }
    }
  },
  {
    "id": "ulcere_adu",
    "groupe": "Adulte",
    "titre": "Douleur d'estomac : gastrite / ulcère",
    "sous": "RDC Méd. interne III.3 et III.4 ; Togo Ord. 23 — adulte",
    "debut": "u0",
    "noeuds": {
      "u0": {
        "q": "Y a-t-il un signe de COMPLICATION ou d'alarme ?",
        "aide": "Vomissement de sang, selles noires (méléna), douleur brutale avec ventre dur « de bois », vomissements alimentaires répétés, amaigrissement, difficulté à avaler, pâleur/anémie, âge > 50 ans.",
        "options": [
          {
            "t": "Vomissement de sang ou selles noires",
            "vers": "r_hemo"
          },
          {
            "t": "Douleur brutale intense, ventre dur (perforation possible)",
            "vers": "r_perfo"
          },
          {
            "t": "Amaigrissement, difficulté à avaler, anémie, vomissements répétés ou âge > 50 ans",
            "vers": "r_alarme"
          },
          {
            "t": "Aucun de ces signes",
            "vers": "u1"
          }
        ]
      },
      "u1": {
        "q": "Le patient prend-il des AINS (diclofénac, ibuprofène, aspirine) ou des corticoïdes ?",
        "options": [
          {
            "t": "Oui",
            "vers": "r_aine"
          },
          {
            "t": "Non",
            "vers": "u2"
          }
        ]
      },
      "u2": {
        "q": "Quel est le type de douleur ?",
        "options": [
          {
            "t": "Brûlure épigastrique de début brutal, nausées / vomissements (alcool, épices, stress, médicament)",
            "vers": "r_gastrite"
          },
          {
            "t": "Douleur épigastrique périodique, calmée par le repas, réveil nocturne (faim douloureuse)",
            "vers": "r_ulcere"
          },
          {
            "t": "Douleur atypique (thorax, hypochondre droit, dos, après repas gras)",
            "vers": "r_atyp"
          }
        ]
      },
      "r_hemo": {
        "res": {
          "niveau": "urgence",
          "titre": "Ulcère hémorragique : à référer en urgence",
          "resume": "Traiter le choc, antisécrétoire IV, puis transfert.",
          "conduite": [
            "Poser une voie veineuse, traiter le choc hypovolémique (remplissage)",
            "Oméprazole 80 mg par jour en IV directe (ou cimétidine IV 400 mg, 3 à 4 fois par jour)",
            "À jeun strict",
            "Référer pour endoscopie et hémostase ; chirurgie si échec ou choc non contrôlé"
          ],
          "meds": [
            "omeprazole"
          ],
          "source": "RDC Méd. interne III.4 (UGD compliqués : à référer)"
        }
      },
      "r_perfo": {
        "res": {
          "niveau": "urgence",
          "titre": "Perforation possible : urgence chirurgicale",
          "resume": "Abdomen aigu : ne rien donner par la bouche, référer immédiatement.",
          "conduite": [
            "À jeun strict, voie veineuse",
            "Antalgique IV",
            "Référer en chirurgie en urgence (le traitement de l'ulcère perforé est chirurgical)"
          ],
          "meds": [],
          "source": "RDC Méd. interne III.4 ; Togo Ord. 23 (abdomen chirurgical : référer)"
        }
      },
      "r_alarme": {
        "res": {
          "niveau": "attention",
          "titre": "Signe d'alarme : référer pour endoscopie",
          "resume": "Risque de cancer gastrique ou de complication : ne pas se contenter d'un traitement d'essai.",
          "conduite": [
            "Référer pour gastroscopie avec biopsie",
            "NFS, recherche d'anémie",
            "En attendant : éviter alcool, tabac, AINS ; antiacide si douleur"
          ],
          "meds": [
            "antiacides"
          ],
          "source": "RDC Méd. interne III.3 et III.4"
        }
      },
      "r_aine": {
        "res": {
          "niveau": "attention",
          "titre": "Ulcère / gastrite liés aux AINS",
          "resume": "Arrêter l'AINS en cause et protéger l'estomac.",
          "conduite": [
            "ARRÊTER l'AINS (ou corticoïde) en cause",
            "Oméprazole 40 mg en IV directe puis 20 mg par voie orale par jour pendant 4 semaines, 30 à 60 min avant le repas",
            "Pansement gastrique : Alugel 3 × 15 mL par jour, 30 à 60 min après le repas",
            "Si stress : diazépam 10 mg par jour en 1 ou 2 prises",
            "Surveiller : vomissement de sang, selles noires, douleur brutale = référer",
            "Pas de cicatrisation après 3 à 4 mois : avis chirurgical"
          ],
          "meds": [
            "omeprazole",
            "antiacides"
          ],
          "source": "RDC Méd. interne III.4 (ulcères liés aux AINS)"
        }
      },
      "r_gastrite": {
        "res": {
          "niveau": "attention",
          "titre": "Gastrite aiguë",
          "resume": "Traiter le facteur déclenchant et soulager. Éradiquer H. pylori si besoin.",
          "conduite": [
            "Supprimer le facteur déclenchant : alcool, tabac, café, épices, AINS",
            "Antiacides pendant 7 à 10 jours",
            "Pas de réponse : anti-H2 (cimétidine ou ranitidine)",
            "Si Helicobacter pylori probable ou échec : oméprazole + amoxicilline + clarithromycine (ou métronidazole 500 mg 2 fois par jour), pendant 14 jours",
            "Vomissements : métoclopramide 10 mg en IM, jusqu'à 3 fois par jour",
            "Repas légers, fractionnés, peu chauds",
            "Pas d'amélioration ou signe d'alarme : référer"
          ],
          "meds": [
            "antiacides",
            "anti-h2",
            "omeprazole",
            "amoxicilline",
            "clarithromycine",
            "metronidazole"
          ],
          "source": "RDC Méd. interne III.3 ; Togo Ord. 23, traitement 3"
        }
      },
      "r_ulcere": {
        "res": {
          "niveau": "attention",
          "titre": "Ulcère gastro-duodénal probable",
          "resume": "Traitement d'éradication de H. pylori puis entretien par l'oméprazole.",
          "conduite": [
            "Oméprazole 20 mg 2 fois par jour + amoxicilline 1 g 2 fois par jour + clarithromycine 500 mg 2 fois par jour (ou métronidazole 500 mg 2 fois par jour), pendant 14 jours",
            "Puis oméprazole 20 mg par jour pendant 3 semaines (RDC) à 30 jours (Togo) si amélioration",
            "Antiacide (hydroxyde d'aluminium) à sucer au moment de la douleur",
            "Éviter tabac, alcool, AINS, stress ; repas légers toutes les 2 heures",
            "Pas d'amélioration : référer pour endoscopie"
          ],
          "meds": [
            "omeprazole",
            "amoxicilline",
            "clarithromycine",
            "metronidazole",
            "antiacides"
          ],
          "source": "RDC Méd. interne III.4 ; Togo Ord. 23, traitement 3"
        }
      },
      "r_atyp": {
        "res": {
          "niveau": "attention",
          "titre": "Douleur atypique : éliminer une autre cause",
          "resume": "Penser à l'infarctus, à la colique biliaire, à la pancréatite.",
          "conduite": [
            "Examiner : ECG si douleur thoracique ou épigastrique chez un sujet à risque",
            "Douleur de l'hypochondre droit, fièvre, ictère : cholécystite, référer",
            "Douleur transfixiante vers le dos : pancréatite, référer",
            "Dyspepsie sans signe d'alarme : traitement symptomatique (antiacide)"
          ],
          "meds": [
            "antiacides"
          ],
          "source": "RDC Méd. interne III.3 et III.4 (diagnostics différentiels)"
        }
      }
    }
  },
  {
    "id": "morsure",
    "groupe": "Tous",
    "titre": "Morsure ou piqûre d'animal",
    "sous": "RDC Méd. interne I.6 : chien, serpent, scorpion, araignée, abeille",
    "debut": "m0",
    "noeuds": {
      "m0": {
        "q": "Quel animal ?",
        "options": [
          {
            "t": "Chien, chat, singe, chauve-souris, autre animal mammifère (risque de rage)",
            "vers": "r_rage"
          },
          {
            "t": "Serpent",
            "vers": "m1"
          },
          {
            "t": "Scorpion",
            "vers": "m2"
          },
          {
            "t": "Araignée",
            "vers": "m3"
          },
          {
            "t": "Abeille, guêpe, frelon",
            "vers": "m4"
          }
        ]
      },
      "m1": {
        "q": "Signes d'envenimation du serpent ?",
        "aide": "Œdème qui s'étend, douleur intense, saignements, ptose des paupières, difficulté à avaler ou à respirer, hypotension, nécrose.",
        "options": [
          {
            "t": "Oui, au moins un signe",
            "vers": "r_serpent_env"
          },
          {
            "t": "Non : simples traces de crochets",
            "vers": "r_serpent_simple"
          }
        ]
      },
      "m2": {
        "q": "Signes généraux après la piqûre de scorpion ?",
        "aide": "Hypertension, salivation, sueurs, fièvre, vomissements, diarrhée, douleurs musculaires, difficulté à respirer, convulsions.",
        "options": [
          {
            "t": "Oui",
            "vers": "r_scorp_sev"
          },
          {
            "t": "Non : douleur, œdème ou rougeur locaux",
            "vers": "r_scorp_simple"
          }
        ]
      },
      "m3": {
        "q": "Quels signes ?",
        "options": [
          {
            "t": "Douleur musculaire intense, sueurs, tachycardie (type veuve noire)",
            "vers": "r_arai_neuro"
          },
          {
            "t": "Lésion locale qui se nécrose (type recluse)",
            "vers": "r_arai_necro"
          }
        ]
      },
      "m4": {
        "q": "Signes de réaction allergique grave ?",
        "aide": "Gonflement du visage ou de la gorge, difficulté à respirer, malaise, urticaire généralisée, chute de la tension.",
        "options": [
          {
            "t": "Oui",
            "vers": "r_anaph"
          },
          {
            "t": "Non : douleur et gonflement locaux",
            "vers": "r_hymeno_loc"
          }
        ]
      },
      "r_rage": {
        "res": {
          "niveau": "urgence",
          "titre": "Morsure par un mammifère : risque de rage",
          "resume": "Laver la plaie, vacciner (Zagreb) et orienter vers un centre antirabique. Rage déclarée : référer.",
          "conduite": [
            "Rage déclarée (hydrophobie, aérophobie, agitation, paralysie) : référer en urgence",
            "Laver immédiatement la plaie à l'eau et au savon (plusieurs minutes), rincer, antiseptique ; ne pas suturer",
            "Prophylaxie antitétanique (VAT) ; antibiotique si plaie infectée (amoxicilline + acide clavulanique)",
            "Chien suspect : vaccin antirabique, schéma de Zagreb (2-1-1) : J0 deux doses le même jour, une dans chaque deltoïde (face antéro-externe de la cuisse chez le jeune enfant, jamais dans la fesse) ; J7 une dose ; J21 une dose",
            "Animal vivant et sain : observation vétérinaire J0, J7, J14 ; suspendre la vaccination si l'animal reste sain",
            "Animal mort : envoyer le cerveau pour analyse",
            "Morsure grave par un animal suspect : référer (sérum antirabique : usage hospitalier)",
            "Référer vers un centre antirabique"
          ],
          "meds": [
            "amox-clav"
          ],
          "source": "Schéma de Zagreb et VAT : décision du validateur ; RDC Méd. interne I.6.5 (rage)"
        }
      },
      "r_serpent_simple": {
        "res": {
          "niveau": "attention",
          "titre": "Morsure de serpent sans signe d'envenimation",
          "resume": "Pas de venin injecté dans environ 50 % des cas : surveiller.",
          "conduite": [
            "Repos complet, immobiliser le membre avec une attelle",
            "Nettoyer la plaie",
            "Surveiller au moins 12 heures",
            "Prophylaxie antitétanique (vaccin et sérum antitétanique)",
            "Si apparition d'œdème, de saignement ou de signes nerveux : passer au traitement de l'envenimation et référer",
            "Absence de signes et de trouble de coagulation après 6 heures ou plus : rassurer, sortie après 12 heures"
          ],
          "meds": [],
          "source": "RDC Méd. interne I.6.1"
        }
      },
      "r_serpent_env": {
        "res": {
          "niveau": "urgence",
          "titre": "Envenimation par morsure de serpent",
          "resume": "Premiers gestes, voie veineuse et transfert : le sérum antivenimeux est réservé à l'hôpital.",
          "conduite": [
            "Repos complet, immobilisation du membre, nettoyer la plaie ; ne pas inciser, ne pas aspirer",
            "Poser une voie veineuse périphérique",
            "Sérum antivenimeux : usage hospitalier uniquement, ne pas retarder le transfert",
            "Œdème et douleur : antalgique / anti-inflammatoire par voie orale ou IV",
            "Surveiller la coagulation (tube sec) ; saignement ou anémie : transfusion de sang frais",
            "Choc : traitement du choc ; atteinte respiratoire : ventilation assistée",
            "Nécrose : mise à plat des phlyctènes, détersion, pansement quotidien non occlusif",
            "Infection patente seulement : drainage de l'abcès ; amoxicilline + acide clavulanique 7 à 10 jours en cas de cellulite",
            "Prophylaxie antitétanique",
            "Référer"
          ],
          "meds": [
            "amox-clav",
            "paracetamol"
          ],
          "source": "RDC Méd. interne I.6.1"
        }
      },
      "r_scorp_simple": {
        "res": {
          "niveau": "ok",
          "titre": "Piqûre de scorpion : envenimation simple",
          "resume": "Soins locaux et surveillance de 12 heures.",
          "conduite": [
            "Repos complet, nettoyer la plaie",
            "Antalgique par voie orale",
            "Douleur intense : lidocaïne 1 % en infiltration autour du point de piqûre",
            "Observer pendant 12 heures",
            "Prophylaxie antitétanique",
            "Enfant de moins de 5 ans : surveiller de près"
          ],
          "meds": [
            "paracetamol"
          ],
          "source": "RDC Méd. interne I.6.2.A"
        }
      },
      "r_scorp_sev": {
        "res": {
          "niveau": "urgence",
          "titre": "Piqûre de scorpion : envenimation sévère",
          "resume": "Traitement des symptômes et transfert.",
          "conduite": [
            "Sérum antivenimeux : usage hospitalier (efficacité discutée) : référer",
            "Vomissements, diarrhée, sueurs : prévenir la déshydratation (SRO)",
            "Douleur musculaire : gluconate de calcium 10 % en IV lente (10 à 20 minutes) : 5 mL enfant, 10 mL adulte",
            "Convulsions : diazépam avec précaution",
            "Surveiller la tension, la respiration, la conscience",
            "Référer"
          ],
          "meds": [
            "gluconate-calcium",
            "sro",
            "diazepam"
          ],
          "source": "RDC Méd. interne I.6.2.B"
        }
      },
      "r_arai_neuro": {
        "res": {
          "niveau": "attention",
          "titre": "Morsure d'araignée : syndrome neurologique",
          "resume": "Évolution favorable en quelques jours.",
          "conduite": [
            "Repos complet, nettoyer la plaie",
            "Antalgique par voie orale",
            "Spasme musculaire : gluconate de calcium 10 % en IV lente : 5 mL enfant, 10 mL adulte",
            "Prophylaxie antitétanique",
            "Les signes évoluent pendant 24 heures puis disparaissent en quelques jours"
          ],
          "meds": [
            "gluconate-calcium",
            "paracetamol"
          ],
          "source": "RDC Méd. interne I.6.3"
        }
      },
      "r_arai_necro": {
        "res": {
          "niveau": "attention",
          "titre": "Morsure d'araignée : syndrome nécrotique",
          "resume": "Soins locaux, ne pas inciser la nécrose.",
          "conduite": [
            "Repos, nettoyer la plaie",
            "Antalgique par voie orale",
            "Prophylaxie antitétanique",
            "Débridement ou incision de la nécrose : DÉCONSEILLÉS",
            "Ictère ou urines foncées (hémolyse) : référer en urgence"
          ],
          "meds": [
            "paracetamol"
          ],
          "source": "RDC Méd. interne I.6.3"
        }
      },
      "r_anaph": {
        "res": {
          "niveau": "urgence",
          "titre": "Réaction anaphylactique après piqûre",
          "resume": "Référer en urgence.",
          "conduite": [
            "Allonger le patient, jambes surélevées ; oxygène si disponible",
            "Référer en urgence",
            "Surveiller la respiration et la tension jusqu'au transfert"
          ],
          "meds": [],
          "source": "décision du validateur : référer"
        }
      },
      "r_hymeno_loc": {
        "res": {
          "niveau": "ok",
          "titre": "Piqûre d'abeille, de guêpe ou de frelon : réaction locale",
          "resume": "Soins locaux.",
          "conduite": [
            "Retirer le dard (abeille)",
            "Laver à l'eau et au savon",
            "Lotion à la calamine si démangeaison",
            "Antalgique par voie orale si besoin",
            "Surveiller 1 heure l'apparition de signes allergiques"
          ],
          "meds": [
            "paracetamol"
          ],
          "source": "RDC Méd. interne I.6.4"
        }
      }
    }
  },
  {
    "id": "diabete",
    "groupe": "Tous",
    "titre": "Diabète",
    "sous": "RDC Méd. interne V.2 ; Togo Ord. 31 (suspicion de diabète : référer)",
    "debut": "d0",
    "noeuds": {
      "d0": {
        "q": "Quelle est la situation ?",
        "options": [
          {
            "t": "Patient inconscient, convulsions, ou glycémie < 2,2 mmol/L (40 mg/dL)",
            "vers": "d_hypo_q"
          },
          {
            "t": "Vomissements, douleur abdominale, respiration ample et rapide, haleine acétonique, déshydratation",
            "vers": "r_acido"
          },
          {
            "t": "Sueurs, tremblements, vertiges chez un diabétique traité",
            "vers": "d_hypo_q"
          },
          {
            "t": "Soif, urines abondantes, amaigrissement, fatigue : suspicion de diabète",
            "vers": "d_diag"
          },
          {
            "t": "Diabète connu : suivi / traitement",
            "vers": "d_suivi"
          }
        ]
      },
      "d_hypo_q": {
        "q": "Le patient est-il conscient et capable d'avaler ?",
        "options": [
          {
            "t": "Oui",
            "vers": "r_hypo_cons"
          },
          {
            "t": "Non (inconscient ou convulsions)",
            "vers": "r_hypo_inc"
          }
        ]
      },
      "d_diag": {
        "q": "Glycémie disponible ?",
        "aide": "Diagnostic : glycémie à jeun ≥ 126 mg/dL (7 mmol/L) à 2 reprises, ou glycémie quelconque > 200 mg/dL (11,1 mmol/L) chez un patient symptomatique.",
        "options": [
          {
            "t": "Oui, glycémie ≥ seuil",
            "vers": "d_type"
          },
          {
            "t": "Oui, glycémie en dessous du seuil",
            "vers": "r_dnorm"
          },
          {
            "t": "Non disponible",
            "vers": "r_dnd"
          }
        ]
      },
      "d_type": {
        "q": "Quel type de patient ?",
        "options": [
          {
            "t": "Enfant, adolescent ou adulte jeune, maigre, début brutal (type 1)",
            "vers": "r_dt1"
          },
          {
            "t": "Adulte, souvent en surpoids, début progressif (type 2)",
            "vers": "d_suivi"
          }
        ]
      },
      "d_suivi": {
        "q": "Patient diabétique de type 2 : situation ?",
        "options": [
          {
            "t": "Traitement à débuter, patient non obèse",
            "vers": "r_dt2_glib"
          },
          {
            "t": "Traitement à débuter, patient obèse",
            "vers": "r_dt2_met"
          },
          {
            "t": "Glycémie non contrôlée sous 15 mg de glibenclamide",
            "vers": "r_dt2_assoc"
          },
          {
            "t": "Plaie du pied, infection, complication grave",
            "vers": "r_dcompl"
          }
        ]
      },
      "r_hypo_cons": {
        "res": {
          "niveau": "attention",
          "titre": "Hypoglycémie : patient conscient",
          "resume": "Sucre tout de suite, puis repas.",
          "conduite": [
            "Arrêter l'activité physique",
            "15 g de glucose : 3 à 4 morceaux de sucre, ou 2 à 3 cuillères à café de confiture, ou 1 verre de lait ou de jus de fruit, ou 1 cuillère à soupe de miel",
            "Puis un repas",
            "Rechercher la cause : dose excessive de sulfamide ou d'insuline, repas sauté, alcool, effort",
            "Revoir la dose du traitement et éduquer le patient"
          ],
          "meds": [],
          "source": "RDC Méd. interne, hypoglycémie (D.1)"
        }
      },
      "r_hypo_inc": {
        "res": {
          "niveau": "urgence",
          "titre": "Hypoglycémie : patient inconscient",
          "resume": "Glucose IV.",
          "conduite": [
            "Glycémie capillaire si possible, sans retarder le traitement",
            "Sérum glucosé 10 % IV 500 mL, puis perfusion de glucosé 5 % ou 10 % 500 mL toutes les 4 heures jusqu'à ce que le patient mange",
            "Alternative : glucagon 1 mg en IM ou sous-cutané",
            "Pas de voie veineuse : sonde nasogastrique d'alimentation",
            "Hospitaliser (surtout si sulfamide à longue durée d'action)"
          ],
          "meds": [
            "sgh10"
          ],
          "source": "RDC Méd. interne, hypoglycémie (D.1)"
        }
      },
      "r_acido": {
        "res": {
          "niveau": "urgence",
          "titre": "Acidocétose diabétique probable",
          "resume": "Urgence hospitalière : référer sans délai.",
          "conduite": [
            "Référer en urgence, accompagné",
            "Glycémie et bandelette urinaire (glycosurie, acétonurie) si disponible, avant le départ",
            "Ne pas démarrer l'insuline ni le potassium en USP : protocole hospitalier",
            "Rechercher le facteur déclenchant (infection, arrêt de l'insuline)"
          ],
          "meds": [],
          "source": "RDC Méd. interne, coma acido-cétosique (D.2) ; conduite retenue par le validateur : référer"
        }
      },
      "r_dt1": {
        "res": {
          "niveau": "urgence",
          "titre": "Diabète de type 1 probable",
          "resume": "L'insuline est toujours indiquée : référer.",
          "conduite": [
            "Débuter l'insuline (indiquée dans tous les cas de type 1)",
            "Référer pour mise en route du traitement et éducation",
            "Surveiller l'hypoglycémie"
          ],
          "meds": [],
          "source": "RDC Méd. interne, indications de l'insuline"
        }
      },
      "r_dnorm": {
        "res": {
          "niveau": "ok",
          "titre": "Glycémie sous le seuil diagnostique",
          "resume": "Contrôler si symptômes persistants.",
          "conduite": [
            "Répéter la glycémie à jeun si les symptômes persistent",
            "Conseils d'hygiène de vie",
            "Rechercher d'autres causes de soif et d'amaigrissement"
          ],
          "meds": [],
          "source": "RDC Méd. interne V.2"
        }
      },
      "r_dnd": {
        "res": {
          "niveau": "attention",
          "titre": "Suspicion de diabète sans glycémie",
          "resume": "Confirmer par une glycémie avant tout traitement.",
          "conduite": [
            "Faire la glycémie (laboratoire ou bandelette)",
            "Si impossible : référer",
            "Glycosurie à la bandelette : orientation seulement"
          ],
          "meds": [],
          "source": "RDC Méd. interne V.2 ; Togo Ord. 31 (suspicion de diabète : référer)"
        }
      },
      "r_dt2_glib": {
        "res": {
          "niveau": "attention",
          "titre": "Diabète de type 2 : patient non obèse",
          "resume": "Régime, activité physique et sulfamide.",
          "conduite": [
            "Régime et activité physique pour tous les patients",
            "Glibenclamide : débuter à 5 mg le matin, 20 à 30 min avant le repas ; augmenter de 5 mg toutes les 2 semaines ; maximum 15 mg par jour",
            "Éduquer sur l'hypoglycémie",
            "Aspirine à faible dose possible pour prévenir les complications cardiovasculaires (selon le guide)",
            "Contrôle de la glycémie régulier"
          ],
          "meds": [
            "glibenclamide",
            "aspirine"
          ],
          "source": "RDC Méd. interne V.2, traitement du type 2"
        }
      },
      "r_dt2_met": {
        "res": {
          "niveau": "attention",
          "titre": "Diabète de type 2 : patient obèse",
          "resume": "Régime, activité physique et metformine.",
          "conduite": [
            "Régime et activité physique",
            "Metformine : débuter à 500 mg 2 fois par jour, augmenter de 500 mg toutes les 2 semaines ; maximum 2 g par jour",
            "Contre-indiquée en cas d'insuffisance rénale ou hépatique",
            "Si insuffisant : ajouter le glibenclamide"
          ],
          "meds": [
            "metformine",
            "glibenclamide"
          ],
          "source": "RDC Méd. interne V.2, traitement du type 2"
        }
      },
      "r_dt2_assoc": {
        "res": {
          "niveau": "attention",
          "titre": "Diabète de type 2 non contrôlé",
          "resume": "Associer la metformine, puis l'insuline.",
          "conduite": [
            "Glibenclamide 15 mg par jour insuffisant : associer la metformine (débuter à 500 mg 2 fois par jour)",
            "Toujours insuffisant : insuline, avec arrêt du glibenclamide (ne pas associer à l'insuline)",
            "Insuline surtout chez le sujet âgé ou en cas d'insuffisance rénale ou hépatique",
            "Référer pour mise en route de l'insuline"
          ],
          "meds": [
            "metformine",
            "glibenclamide"
          ],
          "source": "RDC Méd. interne V.2"
        }
      },
      "r_dcompl": {
        "res": {
          "niveau": "attention",
          "titre": "Complication du diabète",
          "resume": "Référer ; infection : traiter et surveiller la glycémie.",
          "conduite": [
            "Plaie du pied : nettoyage, pansement, antibiotique si infection, ne pas marcher sur le pied",
            "Infection (urinaire, pulmonaire, cutanée) : traiter en surveillant la glycémie",
            "Signes de gravité (confusion, vomissements, déshydratation) : référer",
            "Rétinopathie, néphropathie, neuropathie : référer"
          ],
          "meds": [
            "amox-clav"
          ],
          "source": "RDC Méd. interne V.2 (complications)"
        }
      }
    }
  },
  {
    "id": "hta_adu",
    "groupe": "Adulte",
    "titre": "Hypertension artérielle",
    "sous": "Fiche « HTA de l'adulte au centre de santé » ; HAS 2005, ESH 2007",
    "debut": "h00",
    "noeuds": {
      "h00": {
        "q": "Femme enceinte ?",
        "aide": "La fiche traite l'HTA de l'adulte en dehors de la grossesse.",
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
        "q": "Valeur de la tension artérielle (patient assis, au repos 5 minutes, brassard adapté) ?",
        "aide": "HTA confirmée si PAS ≥ 140 et/ou PAD ≥ 90 mmHg lors d'au moins 2 consultations. Brassard trop serré : tension surestimée ; trop lâche : sous-estimée. Faire 2 à 3 mesures par consultation. Grades : légère 140-159/90-99, modérée 160-179/100-109, sévère ≥ 180/110.",
        "options": [
          {
            "t": "≥ 180 / 110 mmHg (sévère)",
            "vers": "h1"
          },
          {
            "t": "160-179 / 100-109 mmHg (modérée)",
            "vers": "hc"
          },
          {
            "t": "140-159 / 90-99 mmHg (légère)",
            "vers": "hc"
          },
          {
            "t": "Moins de 140 / 90 mmHg",
            "vers": "r_normal"
          }
        ]
      },
      "h1": {
        "q": "Signes viscéraux ?",
        "aide": "Céphalée intense, trouble de la conscience ou de la vision, déficit neurologique, douleur thoracique, essoufflement, œdème pulmonaire, convulsions, vomissements. Confirmer la mesure après 15 minutes de repos allongé.",
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
            "t": "Oui (hypertendu connu) : poussée sans symptôme grave",
            "vers": "r_poussee"
          },
          {
            "t": "Non (HTA découverte)",
            "vers": "hc"
          }
        ]
      },
      "hc": {
        "q": "La tension élevée est-elle confirmée ?",
        "aide": "Au moins 2 consultations.",
        "options": [
          {
            "t": "Oui, confirmée",
            "vers": "hp"
          },
          {
            "t": "Non, ou une seule mesure",
            "vers": "r_confirmer"
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
            "t": "Diabète",
            "vers": "r_diab"
          },
          {
            "t": "Insuffisance rénale (clairance < 30 mL/min)",
            "vers": "r_ir"
          },
          {
            "t": "Après infarctus, ou maladie coronaire",
            "vers": "r_coro"
          },
          {
            "t": "Insuffisance cardiaque",
            "vers": "r_ic"
          },
          {
            "t": "Après un AVC",
            "vers": "r_avc"
          },
          {
            "t": "Suspicion d'HTA secondaire, ou complication (cœur, rein, cerveau, œil), ou protéinurie importante",
            "vers": "r_sec"
          }
        ]
      },
      "r_normal": {
        "res": {
          "niveau": "ok",
          "titre": "Tension normale",
          "resume": "Pas de traitement.",
          "conduite": [
            "Conseils d'hygiène de vie",
            "Contrôle régulier de la tension"
          ],
          "meds": [],
          "source": "Fiche « HTA de l'adulte au centre de santé » (11/10/2026)"
        }
      },
      "r_confirmer": {
        "res": {
          "niveau": "attention",
          "titre": "HTA non confirmée",
          "resume": "Ne pas traiter sur une seule mesure : confirmer.",
          "conduite": [
            "Remesurer après 5 minutes de repos assis, avec un brassard adapté, à au moins 2 consultations (2 à 3 mesures par consultation)",
            "Conseils à tous les patients : sel moins de 6 g par jour (limiter bouillons cubes, poisson fumé, conserves ; ne pas resaler à table) ; alcool modéré, éviter la réglisse ; perdre du poids en cas de surpoids ; marche de 30 minutes, 3 fois par semaine ; arrêt complet du tabac",
            "Revoir pour confirmation, puis suivre ce schéma"
          ],
          "meds": [],
          "source": "Fiche « HTA de l'adulte au centre de santé » (11/10/2026)"
        }
      },
      "r_urg": {
        "res": {
          "niveau": "urgence",
          "titre": "Urgence hypertensive avec signes viscéraux",
          "resume": "Référer en urgence vers l'hôpital.",
          "conduite": [
            "Référer en urgence vers l'hôpital, patient allongé, sans baisser la PA brutalement",
            "Prendre les constantes avant le transfert et noter le traitement habituel"
          ],
          "meds": [],
          "source": "Fiche « HTA de l'adulte au centre de santé » (11/10/2026)"
        }
      },
      "r_poussee": {
        "res": {
          "niveau": "attention",
          "titre": "Poussée hypertensive sans symptôme grave",
          "resume": "Repos, pas de traitement d'urgence ; revoir le traitement de fond.",
          "conduite": [
            "Repos au calme, remesure après 15 minutes en position allongée",
            "Pas de traitement d'urgence : revoir le traitement de fond et chercher la cause (arrêt du traitement, douleur, AINS, stress)",
            "Apparition de céphalée intense, trouble de la conscience ou de la vision, déficit, douleur thoracique, essoufflement : référer en urgence"
          ],
          "meds": [],
          "source": "Fiche « HTA de l'adulte au centre de santé » (11/10/2026)"
        }
      },
      "r_nc": {
        "res": {
          "niveau": "attention",
          "titre": "HTA non compliquée",
          "resume": "Monothérapie à faible dose, réévaluation à 4 semaines.",
          "conduite": [
            "Bilan de base au centre : interrogatoire (tabac, alcool, diabète, antécédents familiaux, prise d'AINS ou de corticoïdes), poids, IMC, tour de taille, bandelette urinaire (protéinurie), glycémie capillaire. Si possible, sinon référer : créatinine, kaliémie, bilan lipidique, ECG",
            "Conseils à tous les patients : sel moins de 6 g par jour (limiter bouillons cubes, poisson fumé, conserves ; ne pas resaler à table) ; alcool modéré, éviter la réglisse ; perdre du poids en cas de surpoids ; marche de 30 minutes, 3 fois par semaine ; arrêt complet du tabac",
            "Étape 1 : monothérapie à faible dose. Amlodipine 5 mg le matin (jusqu'à 10 mg) ; hydrochlorothiazide 12,5 à 25 mg le matin ; nifédipine LP 20 mg 2 fois par jour (ne pas croquer) ; captopril 25 à 50 mg 2 à 3 fois par jour ; énalapril 5 à 20 mg par jour (jusqu'à 40 mg) ; aténolol 50 à 100 mg par jour (pas en 1re intention)",
            "Chez le sujet noir ou âgé : privilégier un inhibiteur calcique ou un thiazidique",
            "Étape 2, réévaluation à 4 semaines : objectif atteint et bien toléré : continuer ; effets secondaires gênants ou baisse de la PAS < 10 % : changer de classe ; réponse partielle mais bien tolérée : augmenter la dose ou passer à une bithérapie. Associations efficaces : amlodipine + thiazidique, amlodipine + IEC, IEC + thiazidique. Ne jamais associer IEC + ARA II",
            "Étape 3 : trithérapie (inhibiteur calcique + IEC + thiazidique) en l'absence d'insuffisance rénale. Étape 4 : HTA résistante (après 3 médicaments) : vérifier l'observance, chercher une cause secondaire, puis référer",
            "Objectif tensionnel : < 140/90 mmHg",
            "Précautions : IEC : toux fréquente (passer à un sartan), angio-œdème plus fréquent chez le patient noir (arrêter immédiatement), contrôler créatinine et kaliémie 1 à 2 semaines après le début ; amlodipine : œdèmes des chevilles, céphalées ; thiazidiques : hypokaliémie, goutte, déshydratation en cas de diarrhée ou de vomissements ; bêtabloquants : contre-indiqués dans l'asthme, la bradycardie et le bloc auriculo-ventriculaire, ne pas les arrêter brutalement ; clonidine : l'arrêt brutal provoque un rebond hypertensif dangereux ; AINS et corticoïdes : à éviter chez l'hypertendu",
            "Suivi : revoir à 4 semaines, puis tous les 3 à 6 mois une fois l'HTA contrôlée (à 4 semaines : PA, tolérance, observance, hypotension orthostatique chez le sujet âgé) ; bandelette urinaire 1 fois par an ; créatinine et kaliémie tous les 1 à 2 ans (et 7 à 15 jours après le début d'un diurétique ou d'un IEC / ARA II) ; glycémie et ECG tous les 3 ans. Rappeler à chaque visite que le traitement est à vie et qu'il ne faut pas l'arrêter quand les chiffres sont normaux"
          ],
          "meds": [
            "antihta"
          ],
          "source": "Fiche « HTA de l'adulte au centre de santé » (11/10/2026)"
        }
      },
      "r_diab": {
        "res": {
          "niveau": "attention",
          "titre": "HTA et diabète",
          "resume": "IEC (ou ARA II) ± diurétique ; objectif plus bas.",
          "conduite": [
            "Bilan de base au centre : interrogatoire (tabac, alcool, diabète, antécédents familiaux, prise d'AINS ou de corticoïdes), poids, IMC, tour de taille, bandelette urinaire (protéinurie), glycémie capillaire. Si possible, sinon référer : créatinine, kaliémie, bilan lipidique, ECG",
            "Conseils à tous les patients : sel moins de 6 g par jour (limiter bouillons cubes, poisson fumé, conserves ; ne pas resaler à table) ; alcool modéré, éviter la réglisse ; perdre du poids en cas de surpoids ; marche de 30 minutes, 3 fois par semaine ; arrêt complet du tabac",
            "Diabète : IEC (ou ARA II) ± diurétique",
            "Objectif tensionnel : < 130/80 mmHg",
            "Étape 1 : monothérapie à faible dose. Amlodipine 5 mg le matin (jusqu'à 10 mg) ; hydrochlorothiazide 12,5 à 25 mg le matin ; nifédipine LP 20 mg 2 fois par jour (ne pas croquer) ; captopril 25 à 50 mg 2 à 3 fois par jour ; énalapril 5 à 20 mg par jour (jusqu'à 40 mg) ; aténolol 50 à 100 mg par jour (pas en 1re intention)",
            "Étape 2, réévaluation à 4 semaines : objectif atteint et bien toléré : continuer ; effets secondaires gênants ou baisse de la PAS < 10 % : changer de classe ; réponse partielle mais bien tolérée : augmenter la dose ou passer à une bithérapie. Associations efficaces : amlodipine + thiazidique, amlodipine + IEC, IEC + thiazidique. Ne jamais associer IEC + ARA II",
            "Étape 3 : trithérapie (inhibiteur calcique + IEC + thiazidique) en l'absence d'insuffisance rénale. Étape 4 : HTA résistante (après 3 médicaments) : vérifier l'observance, chercher une cause secondaire, puis référer",
            "Précautions : IEC : toux fréquente (passer à un sartan), angio-œdème plus fréquent chez le patient noir (arrêter immédiatement), contrôler créatinine et kaliémie 1 à 2 semaines après le début ; amlodipine : œdèmes des chevilles, céphalées ; thiazidiques : hypokaliémie, goutte, déshydratation en cas de diarrhée ou de vomissements ; bêtabloquants : contre-indiqués dans l'asthme, la bradycardie et le bloc auriculo-ventriculaire, ne pas les arrêter brutalement ; clonidine : l'arrêt brutal provoque un rebond hypertensif dangereux ; AINS et corticoïdes : à éviter chez l'hypertendu",
            "Suivi : revoir à 4 semaines, puis tous les 3 à 6 mois une fois l'HTA contrôlée (à 4 semaines : PA, tolérance, observance, hypotension orthostatique chez le sujet âgé) ; bandelette urinaire 1 fois par an ; créatinine et kaliémie tous les 1 à 2 ans (et 7 à 15 jours après le début d'un diurétique ou d'un IEC / ARA II) ; glycémie et ECG tous les 3 ans. Rappeler à chaque visite que le traitement est à vie et qu'il ne faut pas l'arrêter quand les chiffres sont normaux"
          ],
          "meds": [
            "antihta"
          ],
          "source": "Fiche « HTA de l'adulte au centre de santé » (11/10/2026)"
        }
      },
      "r_ir": {
        "res": {
          "niveau": "attention",
          "titre": "HTA et insuffisance rénale",
          "resume": "Diurétique de l'anse ; éviter thiazidiques et spironolactone ; référer.",
          "conduite": [
            "Bilan de base au centre : interrogatoire (tabac, alcool, diabète, antécédents familiaux, prise d'AINS ou de corticoïdes), poids, IMC, tour de taille, bandelette urinaire (protéinurie), glycémie capillaire. Si possible, sinon référer : créatinine, kaliémie, bilan lipidique, ECG",
            "Insuffisance rénale (clairance < 30 mL/min) : diurétique de l'anse (furosémide) ; éviter les thiazidiques et la spironolactone",
            "Objectif tensionnel : < 130/80 mmHg",
            "Éviter les AINS ; référer pour le suivi néphrologique",
            "Étape 2, réévaluation à 4 semaines : objectif atteint et bien toléré : continuer ; effets secondaires gênants ou baisse de la PAS < 10 % : changer de classe ; réponse partielle mais bien tolérée : augmenter la dose ou passer à une bithérapie. Associations efficaces : amlodipine + thiazidique, amlodipine + IEC, IEC + thiazidique. Ne jamais associer IEC + ARA II",
            "Étape 3 : trithérapie (inhibiteur calcique + IEC + thiazidique) en l'absence d'insuffisance rénale. Étape 4 : HTA résistante (après 3 médicaments) : vérifier l'observance, chercher une cause secondaire, puis référer",
            "Précautions : IEC : toux fréquente (passer à un sartan), angio-œdème plus fréquent chez le patient noir (arrêter immédiatement), contrôler créatinine et kaliémie 1 à 2 semaines après le début ; amlodipine : œdèmes des chevilles, céphalées ; thiazidiques : hypokaliémie, goutte, déshydratation en cas de diarrhée ou de vomissements ; bêtabloquants : contre-indiqués dans l'asthme, la bradycardie et le bloc auriculo-ventriculaire, ne pas les arrêter brutalement ; clonidine : l'arrêt brutal provoque un rebond hypertensif dangereux ; AINS et corticoïdes : à éviter chez l'hypertendu",
            "Suivi : revoir à 4 semaines, puis tous les 3 à 6 mois une fois l'HTA contrôlée (à 4 semaines : PA, tolérance, observance, hypotension orthostatique chez le sujet âgé) ; bandelette urinaire 1 fois par an ; créatinine et kaliémie tous les 1 à 2 ans (et 7 à 15 jours après le début d'un diurétique ou d'un IEC / ARA II) ; glycémie et ECG tous les 3 ans. Rappeler à chaque visite que le traitement est à vie et qu'il ne faut pas l'arrêter quand les chiffres sont normaux"
          ],
          "meds": [
            "antihta"
          ],
          "source": "Fiche « HTA de l'adulte au centre de santé » (11/10/2026)"
        }
      },
      "r_coro": {
        "res": {
          "niveau": "attention",
          "titre": "HTA après infarctus ou avec maladie coronaire",
          "resume": "IEC + bêtabloquant, ou inhibiteur calcique ; avis médical.",
          "conduite": [
            "Bilan de base au centre : interrogatoire (tabac, alcool, diabète, antécédents familiaux, prise d'AINS ou de corticoïdes), poids, IMC, tour de taille, bandelette urinaire (protéinurie), glycémie capillaire. Si possible, sinon référer : créatinine, kaliémie, bilan lipidique, ECG",
            "Après infarctus, coronarien : IEC + bêtabloquant, ou inhibiteur calcique",
            "Objectif tensionnel : < 140/90 mmHg",
            "Avis médical pour la suite",
            "Étape 2, réévaluation à 4 semaines : objectif atteint et bien toléré : continuer ; effets secondaires gênants ou baisse de la PAS < 10 % : changer de classe ; réponse partielle mais bien tolérée : augmenter la dose ou passer à une bithérapie. Associations efficaces : amlodipine + thiazidique, amlodipine + IEC, IEC + thiazidique. Ne jamais associer IEC + ARA II",
            "Précautions : IEC : toux fréquente (passer à un sartan), angio-œdème plus fréquent chez le patient noir (arrêter immédiatement), contrôler créatinine et kaliémie 1 à 2 semaines après le début ; amlodipine : œdèmes des chevilles, céphalées ; thiazidiques : hypokaliémie, goutte, déshydratation en cas de diarrhée ou de vomissements ; bêtabloquants : contre-indiqués dans l'asthme, la bradycardie et le bloc auriculo-ventriculaire, ne pas les arrêter brutalement ; clonidine : l'arrêt brutal provoque un rebond hypertensif dangereux ; AINS et corticoïdes : à éviter chez l'hypertendu",
            "Suivi : revoir à 4 semaines, puis tous les 3 à 6 mois une fois l'HTA contrôlée (à 4 semaines : PA, tolérance, observance, hypotension orthostatique chez le sujet âgé) ; bandelette urinaire 1 fois par an ; créatinine et kaliémie tous les 1 à 2 ans (et 7 à 15 jours après le début d'un diurétique ou d'un IEC / ARA II) ; glycémie et ECG tous les 3 ans. Rappeler à chaque visite que le traitement est à vie et qu'il ne faut pas l'arrêter quand les chiffres sont normaux"
          ],
          "meds": [
            "antihta"
          ],
          "source": "Fiche « HTA de l'adulte au centre de santé » (11/10/2026)"
        }
      },
      "r_ic": {
        "res": {
          "niveau": "attention",
          "titre": "HTA et insuffisance cardiaque",
          "resume": "Diurétique + IEC + bêtabloquant : avis médical.",
          "conduite": [
            "Bilan de base au centre : interrogatoire (tabac, alcool, diabète, antécédents familiaux, prise d'AINS ou de corticoïdes), poids, IMC, tour de taille, bandelette urinaire (protéinurie), glycémie capillaire. Si possible, sinon référer : créatinine, kaliémie, bilan lipidique, ECG",
            "Insuffisance cardiaque : diurétique + IEC + bêtabloquant (avis médical)",
            "Référer pour la mise en route et l'adaptation du traitement",
            "Précautions : IEC : toux fréquente (passer à un sartan), angio-œdème plus fréquent chez le patient noir (arrêter immédiatement), contrôler créatinine et kaliémie 1 à 2 semaines après le début ; amlodipine : œdèmes des chevilles, céphalées ; thiazidiques : hypokaliémie, goutte, déshydratation en cas de diarrhée ou de vomissements ; bêtabloquants : contre-indiqués dans l'asthme, la bradycardie et le bloc auriculo-ventriculaire, ne pas les arrêter brutalement ; clonidine : l'arrêt brutal provoque un rebond hypertensif dangereux ; AINS et corticoïdes : à éviter chez l'hypertendu",
            "Suivi : revoir à 4 semaines, puis tous les 3 à 6 mois une fois l'HTA contrôlée (à 4 semaines : PA, tolérance, observance, hypotension orthostatique chez le sujet âgé) ; bandelette urinaire 1 fois par an ; créatinine et kaliémie tous les 1 à 2 ans (et 7 à 15 jours après le début d'un diurétique ou d'un IEC / ARA II) ; glycémie et ECG tous les 3 ans. Rappeler à chaque visite que le traitement est à vie et qu'il ne faut pas l'arrêter quand les chiffres sont normaux"
          ],
          "meds": [
            "antihta"
          ],
          "source": "Fiche « HTA de l'adulte au centre de santé » (11/10/2026)"
        }
      },
      "r_avc": {
        "res": {
          "niveau": "attention",
          "titre": "HTA après un AVC",
          "resume": "Thiazidique ± IEC.",
          "conduite": [
            "Bilan de base au centre : interrogatoire (tabac, alcool, diabète, antécédents familiaux, prise d'AINS ou de corticoïdes), poids, IMC, tour de taille, bandelette urinaire (protéinurie), glycémie capillaire. Si possible, sinon référer : créatinine, kaliémie, bilan lipidique, ECG",
            "Après AVC : thiazidique ± IEC",
            "Objectif tensionnel : < 140/90 mmHg",
            "Avis médical pour la suite",
            "Précautions : IEC : toux fréquente (passer à un sartan), angio-œdème plus fréquent chez le patient noir (arrêter immédiatement), contrôler créatinine et kaliémie 1 à 2 semaines après le début ; amlodipine : œdèmes des chevilles, céphalées ; thiazidiques : hypokaliémie, goutte, déshydratation en cas de diarrhée ou de vomissements ; bêtabloquants : contre-indiqués dans l'asthme, la bradycardie et le bloc auriculo-ventriculaire, ne pas les arrêter brutalement ; clonidine : l'arrêt brutal provoque un rebond hypertensif dangereux ; AINS et corticoïdes : à éviter chez l'hypertendu",
            "Suivi : revoir à 4 semaines, puis tous les 3 à 6 mois une fois l'HTA contrôlée (à 4 semaines : PA, tolérance, observance, hypotension orthostatique chez le sujet âgé) ; bandelette urinaire 1 fois par an ; créatinine et kaliémie tous les 1 à 2 ans (et 7 à 15 jours après le début d'un diurétique ou d'un IEC / ARA II) ; glycémie et ECG tous les 3 ans. Rappeler à chaque visite que le traitement est à vie et qu'il ne faut pas l'arrêter quand les chiffres sont normaux"
          ],
          "meds": [
            "antihta"
          ],
          "source": "Fiche « HTA de l'adulte au centre de santé » (11/10/2026)"
        }
      },
      "r_sec": {
        "res": {
          "niveau": "attention",
          "titre": "HTA à référer",
          "resume": "Suspicion d'HTA secondaire ou complication : référer.",
          "conduite": [
            "Suspicion d'HTA secondaire : sujet jeune, HTA brutale, hypokaliémie, souffle abdominal, insuffisance rénale",
            "Complications : insuffisance cardiaque, AVC, insuffisance rénale, rétinopathie ; ou protéinurie importante",
            "Référer au médecin ou au spécialiste"
          ],
          "meds": [],
          "source": "Fiche « HTA de l'adulte au centre de santé » (11/10/2026)"
        }
      },
      "r_gross": {
        "res": {
          "niveau": "attention",
          "titre": "HTA et grossesse",
          "resume": "Méthyldopa ou nifédipine, puis référer à la maternité.",
          "conduite": [
            "Tension ≥ 140/90 pendant la grossesse : référer à la maternité",
            "Méthyldopa (Aldomet) 250 mg, 2 à 3 fois par jour, ou nifédipine, puis référer",
            "IEC et ARA II (sartans) : interdits pendant la grossesse",
            "Céphalées, œdèmes, protéinurie, convulsions : urgence obstétricale, référer"
          ],
          "meds": [
            "antihta"
          ],
          "source": "Fiche « HTA de l'adulte au centre de santé » (11/10/2026)"
        }
      }
    }
  },
  {
    "id": "drepano",
    "groupe": "Tous",
    "titre": "Drépanocytose : crise douloureuse",
    "sous": "RDC Pédiatrie (drépanocytose) ; Togo Ord. 21 et 23 (adulte)",
    "debut": "s0",
    "noeuds": {
      "s0": {
        "q": "Signe de GRAVITÉ ?",
        "aide": "Pâleur brutale avec grosse rate (séquestration), anémie profonde, fièvre élevée, essoufflement ou douleur thoracique (syndrome thoracique aigu), déficit neurologique ou céphalée intense (AVC), érection douloureuse persistante (priapisme), urines rares.",
        "options": [
          {
            "t": "Oui, au moins un",
            "vers": "r_grave"
          },
          {
            "t": "Non",
            "vers": "s1"
          }
        ]
      },
      "s1": {
        "q": "Âge du patient ?",
        "options": [
          {
            "t": "Enfant (moins de 15 ans)",
            "vers": "r_cvo_enf"
          },
          {
            "t": "Adulte (15 ans et plus)",
            "vers": "r_cvo_adu"
          }
        ]
      },
      "r_grave": {
        "res": {
          "niveau": "urgence",
          "titre": "Crise drépanocytaire grave",
          "resume": "Premiers soins, antalgique et transfert (transfusion possible).",
          "conduite": [
            "Hydratation (boire ou perfusion), antalgique, diazépam si besoin",
            "Fièvre : antibiotique (ceftriaxone, ou amoxicilline + acide clavulanique), car infection fréquente",
            "Séquestration splénique ou anémie profonde : transfusion 20 mL de sang par kg sans dépasser 450 mL ; choc : sérum physiologique 20 mL/kg en 20 minutes = {kg:20} mL",
            "Syndrome thoracique ou douleur très forte non calmée : référer dans un hôpital",
            "Urines < 500 mL par 24 h chez l'adulte : référer"
          ],
          "meds": [
            "paracetamol",
            "ceftriaxone",
            "amox-clav",
            "diazepam"
          ],
          "source": "RDC Pédiatrie, drépanocytose (crises) ; Togo Ord. 21, traitement 6"
        }
      },
      "r_cvo_enf": {
        "res": {
          "niveau": "attention",
          "titre": "Crise vaso-occlusive de l'enfant, forme bénigne",
          "resume": "Antalgique par paliers, hydratation, chaleur locale.",
          "conduite": [
            "Paracétamol : 30 mg/kg en dose de charge ({mg:30} mg), puis 15 mg/kg toutes les 6 heures",
            "Douleur persistante après 30 à 45 minutes : ibuprofène 10 mg/kg par prise ({mg:10} mg), 3 prises par jour",
            "Douleur abdominale : antispasmodique",
            "Boire beaucoup d'eau ; bouillotte chaude ou massage de la zone douloureuse",
            "Acide folique : 2 comprimés par jour pendant la crise",
            "Pas d'amélioration : référer",
            "Entre les crises : pénicilline V jusqu'à 15 ans, acide folique, vaccin antipneumococcique"
          ],
          "meds": [
            "paracetamol",
            "ibuprofene",
            "acide-folique",
            "penicilline-v",
            "amoxicilline"
          ],
          "source": "RDC Pédiatrie, drépanocytose, crise vaso-occlusive bénigne"
        }
      },
      "r_cvo_adu": {
        "res": {
          "niveau": "attention",
          "titre": "Crise drépanocytaire de l'adulte",
          "resume": "Antalgique, acide folique, hydratation ; référer si anémie grave ou oligurie.",
          "conduite": [
            "Acide folique 5 mg : 2 comprimés par jour",
            "Paracétamol 1 g 3 fois par jour, ou aspirine 1 g 3 fois par jour",
            "Ibuprofène 400 mg : 2 comprimés matin et soir, après le repas",
            "Acétylsalicylate de lysine 1 g en IV directe 2 fois par jour, puis relais oral",
            "Réhydratation : boire beaucoup d'eau",
            "Anémie grave ou diurèse < 500 mL par 24 h, ou pas d'amélioration : référer",
            "Fièvre : rechercher une infection (paludisme, pneumonie) et traiter",
            "Entre les crises : acide folique, vaccin antipneumococcique"
          ],
          "meds": [
            "paracetamol",
            "aspirine",
            "acide-folique",
            "ibuprofene"
          ],
          "source": "Togo Ord. 21, traitement 6 et Ord. 23, traitement 11 ; ibuprofène : décision du validateur"
        }
      }
    }
  },
  {
    "id": "ist_adu",
    "groupe": "Adulte",
    "titre": "Infection sexuellement transmissible (IST)",
    "sous": "Algorithme « Prise en charge des IST » (SANTÉ D'ABORD)",
    "debut": "i0",
    "noeuds": {
      "i0": {
        "q": "Quel syndrome ?",
        "options": [
          {
            "t": "Écoulement urétral (homme)",
            "vers": "r_uret"
          },
          {
            "t": "Écoulement vaginal ou douleurs du bas-ventre (femme)",
            "vers": "i1"
          },
          {
            "t": "Ulcération génitale ou ano-rectale",
            "vers": "r_ulcere"
          },
          {
            "t": "Bubon inguinal",
            "vers": "r_bubon"
          },
          {
            "t": "Tuméfaction du scrotum",
            "vers": "r_scrotum"
          },
          {
            "t": "Conjonctivite du nouveau-né (traiter aussi la mère et le partenaire)",
            "vers": "r_conj"
          }
        ]
      },
      "i1": {
        "q": "Que présente la patiente ?",
        "options": [
          {
            "t": "Écoulement vaginal seul",
            "vers": "r_vag"
          },
          {
            "t": "Douleurs abdominales basses, ou syndrome inflammatoire pelvien (fièvre, douleur à la mobilisation de l'utérus)",
            "vers": "r_sip"
          },
          {
            "t": "Col ulcéré ou saignant au contact, saignement après la ménopause",
            "vers": "r_ref_ist"
          }
        ]
      },
      "r_uret": {
        "res": {
          "niveau": "attention",
          "titre": "Écoulement urétral",
          "resume": "Ceftriaxone + azithromycine + métronidazole + fluconazole.",
          "conduite": [
            "1er choix : ceftriaxone 1 g en IM unique ; azithromycine 500 mg, 2 comprimés en prise unique ; métronidazole 500 mg, 4 comprimés en prise unique ; fluconazole 150 mg en prise unique",
            "2e choix : ciprofloxacine 500 mg, 1 comprimé 2 fois par jour pendant 7 jours ; doxycycline 200 mg, 1 comprimé par jour au repas pendant 7 jours ; métronidazole 500 mg, 4 comprimés en prise unique",
            "Traiter le ou les partenaires ; préservatifs ; proposer le dépistage du VIH",
            "Pas d'amélioration : référer"
          ],
          "meds": [
            "ceftriaxone",
            "azithromycine",
            "metronidazole",
            "fluconazole",
            "ciprofloxacine",
            "doxycycline"
          ],
          "source": "Algorithme « Prise en charge des IST » (SANTÉ D'ABORD), joint le 11/10/2026"
        }
      },
      "r_vag": {
        "res": {
          "niveau": "attention",
          "titre": "Écoulement vaginal",
          "resume": "Ceftriaxone + doxycycline (ou azithromycine) + métronidazole + antifongique + ovule.",
          "conduite": [
            "1er choix : ceftriaxone 1 g en IM unique ; doxycycline 200 mg, 1 comprimé par jour au repas pendant 7 jours (ou azithromycine 500 mg, 2 comprimés en prise unique) ; métronidazole 500 mg, 4 comprimés en prise unique ; fluconazole 150 mg en prise unique",
            "Ovule : Polygynax B/6 ou Gyflorine, 1 ovule chaque soir au coucher ; ou clotrimazole 500 mg, 1 ovule au coucher",
            "Moins de 15 ans, femme enceinte ou allaitante (2e choix) : ceftriaxone 1 g en IM unique ; érythromycine 500 mg, 2 comprimés 2 fois par jour pendant 7 jours au repas ; métronidazole 500 mg, 1 comprimé 2 fois par jour pendant 10 jours ; ovule Polygynax B/6 ou Gyflorine, 1 ovule chaque soir au coucher",
            "Traiter le ou les partenaires ; préservatifs ; proposer le dépistage du VIH",
            "Pas d'amélioration : référer"
          ],
          "meds": [
            "ceftriaxone",
            "doxycycline",
            "azithromycine",
            "metronidazole",
            "fluconazole",
            "ovules-vaginaux",
            "erythromycine"
          ],
          "source": "Algorithme « Prise en charge des IST » (SANTÉ D'ABORD), joint le 11/10/2026"
        }
      },
      "r_sip": {
        "res": {
          "niveau": "attention",
          "titre": "Douleurs abdominales basses / syndrome inflammatoire pelvien",
          "resume": "Ceftriaxone + doxycycline + métronidazole + azithromycine.",
          "conduite": [
            "1er choix : ceftriaxone 1 g en IM unique ; doxycycline 200 mg, 1 comprimé par jour au repas pendant 21 jours ; métronidazole 500 mg, 2 comprimés en prise unique pendant 14 jours ; azithromycine 500 mg, 2 comprimés en prise unique (ou ciprofloxacine 500 mg en prise unique)",
            "2e choix : ceftriaxone 1 g en IM unique ; érythromycine 500 mg, 2 comprimés 2 fois par jour pendant 14 jours au repas ; métronidazole 500 mg, 2 comprimés en prise unique pendant 14 jours ; azithromycine 500 mg, 2 comprimés en prise unique",
            "Traiter le ou les partenaires ; préservatifs ; proposer le dépistage du VIH",
            "Pas d'amélioration ou signes de péritonite : référer"
          ],
          "meds": [
            "ceftriaxone",
            "doxycycline",
            "metronidazole",
            "azithromycine",
            "ciprofloxacine",
            "erythromycine"
          ],
          "source": "Algorithme « Prise en charge des IST » (SANTÉ D'ABORD), joint le 11/10/2026"
        }
      },
      "r_ulcere": {
        "res": {
          "niveau": "attention",
          "titre": "Ulcération génitale ou ano-rectale",
          "resume": "Benzathine pénicilline + azithromycine + métronidazole + aciclovir.",
          "conduite": [
            "1er choix : benzathine pénicilline 2,4 MUI en IM unique ; azithromycine 500 mg, 2 comprimés en prise unique ; métronidazole 500 mg, 4 comprimés en prise unique ; aciclovir 400 mg, 1 comprimé 2 fois par jour pendant 5 jours (Acyclovir Denk 200 mg : 2 comprimés 2 fois par jour pendant 5 jours)",
            "2e choix : ceftriaxone 1 g en IM unique ; doxycycline 200 mg, 1 comprimé par jour au repas pendant 21 jours (femme enceinte : érythromycine 500 mg, 2 comprimés 2 fois par jour pendant 21 jours) ; aciclovir 400 mg, 1 comprimé 2 fois par jour pendant 5 jours",
            "Traiter le ou les partenaires ; préservatifs ; proposer le dépistage du VIH",
            "Pas d'amélioration : référer"
          ],
          "meds": [
            "benzathine-penicilline",
            "azithromycine",
            "metronidazole",
            "acyclovir",
            "ceftriaxone",
            "doxycycline",
            "erythromycine"
          ],
          "source": "Algorithme « Prise en charge des IST » (SANTÉ D'ABORD), joint le 11/10/2026"
        }
      },
      "r_bubon": {
        "res": {
          "niveau": "attention",
          "titre": "Bubon inguinal",
          "resume": "Azithromycine + doxycycline.",
          "conduite": [
            "1er choix : azithromycine 500 mg, 2 comprimés en prise unique ; doxycycline 200 mg, 1 comprimé par jour au repas pendant 21 jours",
            "2e choix : ceftriaxone 1 g en IM unique ; érythromycine 500 mg, 2 comprimés 2 fois par jour pendant 21 jours au repas",
            "Traiter le ou les partenaires ; préservatifs ; proposer le dépistage du VIH",
            "Pas d'amélioration : référer"
          ],
          "meds": [
            "azithromycine",
            "doxycycline",
            "ceftriaxone",
            "erythromycine"
          ],
          "source": "Algorithme « Prise en charge des IST » (SANTÉ D'ABORD), joint le 11/10/2026"
        }
      },
      "r_scrotum": {
        "res": {
          "niveau": "attention",
          "titre": "Tuméfaction du scrotum",
          "resume": "Ceftriaxone + azithromycine + doxycycline.",
          "conduite": [
            "1er choix : ceftriaxone 1 g en IM unique ; azithromycine 500 mg, 2 comprimés en prise unique ; doxycycline 200 mg, 1 comprimé par jour au repas pendant 21 jours",
            "2e choix : ceftriaxone 1 g en IM unique ; azithromycine 500 mg, 2 comprimés en prise unique ; érythromycine 500 mg, 2 comprimés 2 fois par jour pendant 14 jours au repas",
            "Traiter le ou les partenaires ; préservatifs ; proposer le dépistage du VIH",
            "Douleur intense, fièvre ou pas d'amélioration : référer"
          ],
          "meds": [
            "ceftriaxone",
            "azithromycine",
            "doxycycline",
            "erythromycine"
          ],
          "source": "Algorithme « Prise en charge des IST » (SANTÉ D'ABORD), joint le 11/10/2026"
        }
      },
      "r_conj": {
        "res": {
          "niveau": "attention",
          "titre": "Conjonctivite du nouveau-né",
          "resume": "Traiter le nouveau-né, la mère et le partenaire.",
          "conduite": [
            "Nouveau-né : ceftriaxone 50 mg/kg en IM unique, sans dépasser 125 mg ; érythromycine sirop 50 mg/kg/jour en 4 prises pendant 14 jours",
            "La mère : ceftriaxone 1 g en IM unique ; azithromycine 500 mg, 2 comprimés en prise unique ; érythromycine 500 mg, 2 comprimés 2 fois par jour pendant 14 jours au repas (pas de 2e choix)",
            "Le partenaire de la mère : ceftriaxone 1 g en IM unique ; azithromycine 500 mg, 2 comprimés en prise unique",
            "Pas d'amélioration : référer"
          ],
          "meds": [
            "ceftriaxone",
            "azithromycine",
            "erythromycine"
          ],
          "source": "Algorithme « Prise en charge des IST » (SANTÉ D'ABORD), joint le 11/10/2026"
        }
      },
      "r_ref_ist": {
        "res": {
          "niveau": "attention",
          "titre": "Suspicion de cancer du col ou de l'endomètre",
          "resume": "Référer.",
          "conduite": [
            "Référer (tamponnement vaginal si hémorragie importante)"
          ],
          "meds": [],
          "source": "Togo Ord. 26, traitements 5 et 6"
        }
      }
    }
  },
  {
    "id": "hemorroides",
    "groupe": "Adulte",
    "titre": "Hémorroïdes",
    "sous": "RDC Méd. interne III.9 — adulte",
    "debut": "o0",
    "noeuds": {
      "o0": {
        "q": "Quels signes ?",
        "options": [
          {
            "t": "Saignement abondant, pâleur, malaise, ou thrombose très douloureuse, ou strangulation",
            "vers": "r_ocompl"
          },
          {
            "t": "Crise hémorroïdaire : pesanteur, chaleur anale, œdème, douleur modérée",
            "vers": "r_ocrise"
          },
          {
            "t": "Saignement discret en fin de selle, masse que le patient sent",
            "vers": "r_osimple"
          },
          {
            "t": "Douleur à la selle avec fissure, pus, ou masse permanente",
            "vers": "r_odiff"
          }
        ]
      },
      "r_ocompl": {
        "res": {
          "niveau": "attention",
          "titre": "Hémorroïdes compliquées",
          "resume": "Référer en chirurgie.",
          "conduite": [
            "Saignement profus, thrombose, strangulation, infection ou ulcération : référer en chirurgie",
            "NFS : rechercher une anémie",
            "En attendant : bain de siège antiseptique, antalgique"
          ],
          "meds": [
            "paracetamol"
          ],
          "source": "RDC Méd. interne III.9"
        }
      },
      "r_ocrise": {
        "res": {
          "niveau": "attention",
          "titre": "Crise hémorroïdaire",
          "resume": "Phlébotonique, soins locaux et règles de vie.",
          "conduite": [
            "Daflon : 3 × 2 comprimés par jour pendant 4 jours, puis 2 × 2 comprimés par jour pendant 3 jours",
            "Bain de siège avec un antiseptique",
            "Suppositoires ou pommade anti-hémorroïdaires (anti-inflammatoire, astringent, anesthésique local)",
            "Lutter contre la constipation : eau, fibres, fruits",
            "Éviter épices, alcool, café, sédentarité",
            "Échec du traitement médical ou complication : chirurgie"
          ],
          "meds": [
            "daflon",
            "paracetamol"
          ],
          "source": "RDC Méd. interne III.9"
        }
      },
      "r_osimple": {
        "res": {
          "niveau": "ok",
          "titre": "Maladie hémorroïdaire non compliquée",
          "resume": "Règles de vie et soins locaux.",
          "conduite": [
            "Boire beaucoup, régime riche en fibres et en fruits",
            "Éviter épices, alcool, café ; ne pas pousser aux selles",
            "Bain de siège antiseptique, pommade ou suppositoire",
            "Saignement répété ou pâleur : NFS et référer (éliminer un cancer du rectum)"
          ],
          "meds": [
            "daflon"
          ],
          "source": "RDC Méd. interne III.9"
        }
      },
      "r_odiff": {
        "res": {
          "niveau": "attention",
          "titre": "Autre cause anale possible",
          "resume": "Fissure, fistule ou cancer du rectum : référer.",
          "conduite": [
            "Fissure : douleur après la selle ; fistule : tuméfaction péri-anale permanente avec pus",
            "Toucher rectal et rectoscopie par un médecin",
            "Référer"
          ],
          "meds": [],
          "source": "RDC Méd. interne III.9 (diagnostics différentiels)"
        }
      }
    }
  },
  {
    "id": "rhumatisme",
    "groupe": "Tous",
    "titre": "Rhumatisme : douleurs des articulations",
    "sous": "RDC Méd. interne VI.3 à VI.5 (rhumatologie, goutte, RAA, lumbago)",
    "debut": "r0",
    "noeuds": {
      "r0": {
        "q": "Quel tableau ?",
        "options": [
          {
            "t": "Enfant ou adolescent, fièvre, articulations qui se succèdent, après une angine, avec palpitations",
            "vers": "r_raa"
          },
          {
            "t": "Début brutal, une articulation (gros orteil), rouge, très douloureuse, la nuit",
            "vers": "r_goutte"
          },
          {
            "t": "Plusieurs articulations, douleur nocturne, raideur matinale > 1 heure, gonflement",
            "vers": "r_ar"
          },
          {
            "t": "Douleur à l'effort qui cède au repos, fin de journée, raideur matinale < 30 min",
            "vers": "r_arthrose"
          },
          {
            "t": "Douleur lombaire brutale après un effort",
            "vers": "r_lumbago"
          },
          {
            "t": "Articulation chaude, fièvre élevée, ne peut pas bouger (arthrite septique)",
            "vers": "r_septique"
          }
        ]
      },
      "r_raa": {
        "res": {
          "niveau": "attention",
          "titre": "Rhumatisme articulaire aigu (RAA)",
          "resume": "Référer.",
          "conduite": [
            "Référer pour confirmation du diagnostic et mise en route du traitement",
            "Palpitations, essoufflement, douleur thoracique : cardite, référer en urgence"
          ],
          "meds": [],
          "source": "décision du validateur : référer"
        }
      },
      "r_goutte": {
        "res": {
          "niveau": "attention",
          "titre": "Crise de goutte aiguë",
          "resume": "Anti-inflammatoire ; la colchicine est du ressort du médecin : référer.",
          "conduite": [
            "Repos de l'articulation, froid local",
            "Indométacine ou diclofénac en crise, sauf en cas d'ulcère ou d'insuffisance rénale : pas d'AINS, référer",
            "Colchicine : référer",
            "Traitement de fond après la crise : allopurinol",
            "Boire beaucoup d'eau ; limiter alcool et abats",
            "Pas de diurétique thiazidique chez le goutteux"
          ],
          "meds": [
            "indometacine",
            "diclofenac",
            "allopurinol"
          ],
          "source": "RDC Méd. interne, goutte"
        }
      },
      "r_ar": {
        "res": {
          "niveau": "attention",
          "titre": "Arthrite rhumatoïde probable",
          "resume": "Anti-inflammatoire et avis spécialisé.",
          "conduite": [
            "Anti-inflammatoire : diclofénac, avec protection gastrique",
            "Antalgique : paracétamol",
            "Référer pour confirmation et traitement de fond",
            "Éviter les AINS en cas d'ulcère connu"
          ],
          "meds": [
            "diclofenac",
            "paracetamol",
            "omeprazole"
          ],
          "source": "RDC Méd. interne VI.3"
        }
      },
      "r_arthrose": {
        "res": {
          "niveau": "ok",
          "titre": "Arthrose",
          "resume": "Antalgique, repos relatif, éviter la surcharge.",
          "conduite": [
            "Cas simple : paracétamol ou aspirine",
            "Arthrose douloureuse compliquée : anti-inflammatoire de courte durée",
            "Éviter la surcharge de l'articulation, perdre du poids si besoin",
            "Kinésithérapie",
            "Anti-inflammatoire contre-indiqué en cas d'ulcère ou de gastrite : Parco Denk comprimé ou Klipal codéine 300 comprimé, 1 comprimé 3 fois par jour"
          ],
          "meds": [
            "paracetamol",
            "aspirine",
            "diclofenac"
          ],
          "source": "RDC Méd. interne VI.3 (arthrose)"
        }
      },
      "r_lumbago": {
        "res": {
          "niveau": "ok",
          "titre": "Lumbago",
          "resume": "Repos, anti-inflammatoire, kinésithérapie.",
          "conduite": [
            "Repos au lit (court)",
            "Anti-inflammatoire de courte durée avec protection de l'estomac",
            "Kinésithérapie",
            "Radiographie normale dans le lumbago",
            "Déficit moteur, trouble urinaire, fièvre : référer"
          ],
          "meds": [
            "paracetamol",
            "diclofenac"
          ],
          "source": "RDC Méd. interne VI.5"
        }
      },
      "r_septique": {
        "res": {
          "niveau": "urgence",
          "titre": "Arthrite septique possible",
          "resume": "Urgence : antibiotique et transfert.",
          "conduite": [
            "Ne pas retarder le transfert",
            "Drépanocytaire : penser à la salmonelle",
            "Référer en chirurgie / orthopédie"
          ],
          "meds": [
            "ceftriaxone"
          ],
          "source": "RDC Méd. interne VI.3 (arthrites septiques)"
        }
      }
    }
  },
  {
    "id": "peau",
    "groupe": "Tous",
    "titre": "Peau : éruption, prurit, lésions",
    "sous": "Togo Ord. 36 (affections de la peau)",
    "debut": "p0",
    "noeuds": {
      "p0": {
        "q": "Quel est l'aspect principal de la lésion ou des démangeaisons ?",
        "options": [
          {
            "t": "Démangeaisons surtout la nuit, boutons entre les doigts, plusieurs personnes de la famille touchées",
            "vers": "r_gale"
          },
          {
            "t": "Vésicules en bouquet, douloureuses, d'un seul côté du corps (zona)",
            "vers": "r_zona"
          },
          {
            "t": "Petites vésicules sur tout le corps, à différents stades, avec fièvre (varicelle)",
            "vers": "r_varicelle"
          },
          {
            "t": "Éruption avec fièvre, toux et yeux rouges (rougeole)",
            "vers": "r_rougeole"
          },
          {
            "t": "Croûtes jaunâtres, petites pustules (impétigo, folliculite)",
            "vers": "r_impetigo"
          },
          {
            "t": "Placard rouge, chaud, douloureux, avec fièvre (érysipèle)",
            "vers": "r_erysipele"
          },
          {
            "t": "Boule rouge, chaude, douloureuse, avec pus (abcès, furoncle)",
            "vers": "r_abces"
          },
          {
            "t": "Plaques rondes, squameuses, sur le corps ou dans les plis (mycose)",
            "vers": "r_mycose"
          },
          {
            "t": "Plaques squameuses du cuir chevelu avec cheveux qui cassent (teigne)",
            "vers": "r_teigne"
          },
          {
            "t": "Plaques rouges qui grattent, sèches ou suintantes (eczéma)",
            "vers": "r_eczema"
          },
          {
            "t": "Plaques en relief, passagères, qui grattent (urticaire)",
            "vers": "p_urt"
          },
          {
            "t": "Petits boutons qui grattent, après piqûres, surtout chez l'enfant (prurigo)",
            "vers": "r_prurigo"
          },
          {
            "t": "Tache décolorée insensible, ou nodules sous la peau avec démangeaisons (lèpre, onchocercose)",
            "vers": "r_lepre"
          },
          {
            "t": "Plaie ou ulcération des organes génitaux",
            "vers": "algo:ist_adu#r_ulcere"
          },
          {
            "t": "Autre aspect, ou lésion qui ne guérit pas",
            "vers": "r_ref"
          }
        ],
        "aide": "Si plusieurs aspects, choisir celui qui domine. Demander : depuis quand, fièvre, autres cas dans la famille, allergie connue."
      },
      "p_urt": {
        "q": "Gêne pour respirer, ou gonflement du visage, des lèvres ou de la langue ?",
        "options": [
          {
            "t": "Oui",
            "vers": "r_quincke"
          },
          {
            "t": "Non",
            "vers": "r_urticaire"
          }
        ]
      },
      "r_gale": {
        "res": {
          "niveau": "attention",
          "titre": "Gale",
          "resume": "Benzoate de benzyle en deux séries de 3 soirs ; linge et literie traités.",
          "conduite": [
            "Bain avec Cytéal ou Till solution (antiseptique)",
            "Ascabiol (benzoate de benzyle) : badigeonner tout le corps sauf le visage, après la douche du soir, 3 soirs de suite ; arrêter une semaine, puis recommencer 3 soirs",
            "Nourrisson de moins de 2 ans : ne pas utiliser le benzoate de benzyle, référer",
            "Linge et literie : pyréthrine en solution, pulvériser et laisser enfermés 24 heures",
            "Examiner et traiter l'entourage en même temps",
            {
              "g": "Adulte",
              "t": "Surinfection : amoxicilline 1 g toutes les 8 heures pendant 8 jours, ou érythromycine 1 g toutes les 12 heures pendant 8 jours"
            },
            {
              "g": "Enfant",
              "t": "Surinfection : amoxicilline 50 mg/kg/jour en 2 prises ({mg:50} mg par jour), ou érythromycine 50 mg/kg/jour en 2 prises, pendant 8 jours"
            }
          ],
          "meds": [
            "dermato-local",
            "amoxicilline",
            "erythromycine"
          ],
          "source": "Togo Ord. 36, traitement 1"
        }
      },
      "r_zona": {
        "res": {
          "niveau": "attention",
          "titre": "Zona",
          "resume": "Antalgique, vitamine C, éosine ; référer dans les situations à risque.",
          "conduite": [
            "Douleur : paracétamol, puis antalgique de palier supérieur si besoin",
            "Éviter les AINS en cas de déshydratation ou d'insuffisance rénale",
            "Vitamine C 500 mg par jour",
            "Éosine aqueuse en solution externe pour nettoyer les lésions, 1 fois par jour",
            "RÉFÉRER EN URGENCE si : zona de la branche ophtalmique (front, paupière, pointe du nez, œil rouge ou douloureux, baisse de la vue) ; zona de l'oreille ou paralysie faciale ; immunodépression connue ou suspectée (proposer un test VIH en cas de zona du sujet jeune ou de forme étendue) ; zona disséminé, nécrotique, hémorragique, ou signes neurologiques (confusion, déficit) ; femme enceinte, nouveau-né ou nourrisson"
          ],
          "meds": [
            "paracetamol",
            "dermato-local"
          ],
          "source": "Décision du validateur (Togo Ord. 36, traitement 2 modifié)"
        }
      },
      "r_varicelle": {
        "res": {
          "niveau": "attention",
          "titre": "Varicelle",
          "resume": "Fièvre et démangeaisons à calmer ; surinfection à surveiller.",
          "conduite": [
            "Bain avec Cytéal ou Till solution",
            "Paracétamol 60 mg/kg/jour en 3 prises, soit {mg:60} mg par jour pour ce patient",
            "Démangeaisons : dexchlorphéniramine (adulte 1 comprimé 3 fois par jour ; enfant de 10 ans et plus 1 cuillère à café 2 fois par jour ; avant 10 ans : Primalan sirop, 2,5 mL par jour de préférence le soir avant 5 ans, 1 comprimé de 5 mg par jour de 5 à 10 ans)",
            "Éviter les AINS et l'aspirine",
            {
              "g": "Adulte",
              "t": "Surinfection : amoxicilline 1 g toutes les 8 heures, ou érythromycine 1 g toutes les 12 heures, pendant 8 jours"
            },
            {
              "g": "Enfant",
              "t": "Surinfection : amoxicilline 50 mg/kg/jour en 2 prises, ou érythromycine 50 mg/kg/jour en 2 prises, pendant 8 jours"
            }
          ],
          "meds": [
            "paracetamol",
            "antihistaminique",
            "amoxicilline",
            "erythromycine",
            "primalan"
          ],
          "source": "Togo Ord. 36, traitement 3"
        }
      },
      "r_rougeole": {
        "res": {
          "niveau": "attention",
          "titre": "Rougeole possible",
          "resume": "Voir la fièvre de l'enfant (rougeole) ; vitamine A et surveillance.",
          "conduite": [
            "Voir « Fièvre de l'enfant » : rougeole (vitamine A, antibiotique contre la surinfection)",
            "Isoler l'enfant, bien l'hydrater, paracétamol si fièvre",
            "Complication (respiration difficile, convulsions, déshydratation) : référer"
          ],
          "meds": [
            "vitamine-a",
            "paracetamol",
            "amoxicilline"
          ],
          "source": "Togo Ord. 1 (rougeole)"
        }
      },
      "r_impetigo": {
        "res": {
          "niveau": "attention",
          "titre": "Impétigo ou folliculite",
          "resume": "Antibiotique oral pendant 10 jours et antiseptique local.",
          "conduite": [
            "Bain avec Cytéal ou Till solution",
            {
              "g": "Adulte",
              "t": "Amoxicilline 1 g, 3 fois par jour pendant 10 jours ; ou érythromycine 500 mg, 2 comprimés 2 fois par jour"
            },
            {
              "g": "Enfant",
              "t": "Amoxicilline 50 mg/kg/jour en 2 prises ({mg:50} mg par jour) pendant 10 jours ; ou érythromycine 50 mg/kg/jour en 2 prises"
            },
            "Nettoyer les lésions à l'eau et au savon, antiseptique local (polyvidone iodée)"
          ],
          "meds": [
            "amoxicilline",
            "erythromycine",
            "dermato-local"
          ],
          "source": "Togo Ord. 36, traitement 12"
        }
      },
      "r_erysipele": {
        "res": {
          "niveau": "attention",
          "titre": "Érysipèle",
          "resume": "Traitement antibiotique intensif ; hospitalisation si perfusion impossible.",
          "conduite": [
            "Pénicilline G 10 à 20 millions d'UI par jour en perfusion (traitement hospitalier) jusqu'à amélioration, ou amoxicilline + acide clavulanique matin et soir ; puis relais par voie orale pendant 10 à 15 jours",
            {
              "g": "Adulte",
              "t": "Amoxicilline + acide clavulanique 1 g matin et soir, associée à l'érythromycine 500 mg (2 comprimés) 2 fois par jour, ou au métronidazole 500 mg 2 fois par jour"
            },
            {
              "g": "Enfant",
              "t": "Amoxicilline + acide clavulanique 50 mg/kg/jour en 2 prises ({mg:50} mg par jour), associée à l'érythromycine 50 mg/kg/jour en 2 prises, ou au métronidazole 30 mg/kg/jour"
            },
            "Paracétamol 60 mg/kg/jour en 4 prises ({mg:60} mg par jour)",
            "Polyvidone iodée en application locale, 2 fois par jour ; repos au lit",
            "Vaccination antitétanique si elle n'est pas à jour",
            "Perfusion impossible sur place : référer"
          ],
          "meds": [
            "amox-clav",
            "erythromycine",
            "metronidazole",
            "paracetamol",
            "dermato-local"
          ],
          "source": "Togo Ord. 36, traitement 13 ; associations retenues par le validateur"
        }
      },
      "r_abces": {
        "res": {
          "niveau": "attention",
          "titre": "Abcès cutané ou furoncle",
          "resume": "Pansement, antibiotique ; incision si l'abcès est mûr.",
          "conduite": [
            "Abcès non collecté : pansement alcoolisé",
            "Abcès mûr (collecté) : incision et drainage",
            "Paracétamol 60 mg/kg/jour en 3 prises ({mg:60} mg par jour)",
            {
              "g": "Adulte",
              "t": "Cloxacilline 500 mg, 2 comprimés 3 fois par jour pendant 10 jours ; ou amoxicilline 500 mg, 2 comprimés 3 fois par jour, avec métronidazole 500 mg 2 fois par jour, 10 jours ; ou amoxicilline + acide clavulanique 500 mg, 2 comprimés 3 fois par jour, 10 jours"
            },
            {
              "g": "Enfant",
              "t": "Cloxacilline 50 mg/kg/jour ; ou amoxicilline 50 mg/kg/jour avec métronidazole 30 à 40 mg/kg/jour ; ou amoxicilline + acide clavulanique 50 mg/kg/jour ; pendant 10 jours"
            },
            "Vaccination antitétanique si elle n'est pas à jour"
          ],
          "meds": [
            "cloxacilline",
            "amoxicilline",
            "metronidazole",
            "amox-clav",
            "paracetamol"
          ],
          "source": "Togo Ord. 36, traitement 9"
        }
      },
      "r_mycose": {
        "res": {
          "niveau": "ok",
          "titre": "Mycose de la peau",
          "resume": "Antifongique local ; voie orale si la mycose est étendue.",
          "conduite": [
            "Mycose localisée : clotrimazole crème, 2 applications par jour pendant 3 semaines",
            {
              "g": "Adulte",
              "t": "Mycose étendue : griséofulvine 500 mg, 1 comprimé 2 fois par jour pendant 3 semaines"
            },
            {
              "g": "Enfant",
              "t": "Mycose étendue : griséofulvine 10 mg/kg/jour en 2 prises ({mg:10} mg par jour) pendant 3 semaines"
            },
            "Hygiène : sécher les plis, vêtements propres"
          ],
          "meds": [
            "dermato-local",
            "griseofulvine"
          ],
          "source": "Togo Ord. 36, traitement 6"
        }
      },
      "r_teigne": {
        "res": {
          "niveau": "attention",
          "titre": "Teigne",
          "resume": "Griséofulvine pendant 6 semaines.",
          "conduite": [
            {
              "g": "Adulte",
              "t": "Griséofulvine 500 mg, 1 comprimé 2 fois par jour pendant 6 semaines"
            },
            {
              "g": "Enfant",
              "t": "Griséofulvine 10 mg/kg/jour en 2 prises ({mg:10} mg par jour) pendant 6 semaines"
            },
            "Examiner la fratrie et les proches"
          ],
          "meds": [
            "griseofulvine"
          ],
          "source": "Togo Ord. 36, traitement 7"
        }
      },
      "r_eczema": {
        "res": {
          "niveau": "ok",
          "titre": "Eczéma",
          "resume": "Éviter l'allergène ; antihistaminique et corticoïde local.",
          "conduite": [
            "Éviter le contact avec ce qui déclenche (allergène)",
            "Antihistaminique : dexchlorphéniramine (adulte 1 comprimé 3 fois par jour ; enfant de 10 ans et plus 1 cuillère à café 2 fois par jour ; avant 10 ans : Primalan sirop, 2,5 mL par jour de préférence le soir avant 5 ans, 1 comprimé de 5 mg par jour de 5 à 10 ans) ou loratadine",
            "Hydrocortisone crème ou pommade : 1 application 2 fois par jour pendant 5 jours",
            "Surinfection : antiseptique local, et érythromycine ou cloxacilline pendant 8 jours (adulte 500 mg, 2 comprimés 2 fois par jour ; enfant 50 mg/kg/jour en 2 prises)"
          ],
          "meds": [
            "antihistaminique",
            "dermato-local",
            "erythromycine",
            "cloxacilline",
            "primalan"
          ],
          "source": "Togo Ord. 36, traitement 4"
        }
      },
      "r_urticaire": {
        "res": {
          "niveau": "ok",
          "titre": "Urticaire",
          "resume": "Antihistaminique ; chercher la cause.",
          "conduite": [
            "Dexchlorphéniramine (adulte 1 comprimé 3 fois par jour ; enfant de 10 ans et plus 1 cuillère à café 2 fois par jour ; avant 10 ans : Primalan sirop, 2,5 mL par jour de préférence le soir avant 5 ans, 1 comprimé de 5 mg par jour de 5 à 10 ans), ou loratadine (adulte et enfant de plus de 12 ans 10 mg par jour ; enfant de 1 à 5 ans 2,5 mL de sirop ; de 6 à 12 ans 5 mL de sirop)",
            "Chercher et éviter la cause (aliment, médicament, piqûre)",
            "Gonflement du visage ou gêne respiratoire : urgence (œdème de Quincke), référer"
          ],
          "meds": [
            "antihistaminique",
            "primalan"
          ],
          "source": "Togo Ord. 36, traitement 5"
        }
      },
      "r_quincke": {
        "res": {
          "niveau": "urgence",
          "titre": "Œdème de Quincke (gêne respiratoire)",
          "resume": "Corticoïde injectable et transfert en urgence.",
          "conduite": [
            "Hémisuccinate d'hydrocortisone 100 mg : 1 ampoule en IV ; ou bétaméthasone 4 mg : 1 ampoule pour 30 kg en IV directe",
            "Puis référer en urgence"
          ],
          "meds": [
            "corticoide-inj"
          ],
          "source": "Togo Ord. 36, traitement 5"
        }
      },
      "r_prurigo": {
        "res": {
          "niveau": "ok",
          "titre": "Prurigo (démangeaisons après piqûres)",
          "resume": "Antihistaminique et crème calmante.",
          "conduite": [
            "Dexchlorphéniramine (adulte 1 comprimé 3 fois par jour ; enfant de 10 ans et plus 1 cuillère à café 2 fois par jour ; avant 10 ans : Primalan sirop, 2,5 mL par jour de préférence le soir avant 5 ans, 1 comprimé de 5 mg par jour de 5 à 10 ans) ou loratadine",
            "Crotamiton (Eurax) crème : 2 applications par jour pendant 5 jours",
            "Couper les ongles de l'enfant pour éviter les surinfections"
          ],
          "meds": [
            "antihistaminique",
            "dermato-local",
            "primalan"
          ],
          "source": "Togo Ord. 36, traitement 11"
        }
      },
      "r_lepre": {
        "res": {
          "niveau": "attention",
          "titre": "Lèpre ou onchocercose possible",
          "resume": "Suivre les programmes nationaux.",
          "conduite": [
            "Lèpre : suivre les directives du programme national de lutte contre la lèpre",
            "Onchocercose : ivermectine selon les directives du programme national",
            "Référer pour confirmation et mise en route du traitement"
          ],
          "meds": [],
          "source": "Togo Ord. 36, traitements 8 et 10"
        }
      },
      "r_ref": {
        "res": {
          "niveau": "attention",
          "titre": "Lésion à faire examiner",
          "resume": "Référer.",
          "conduite": [
            "Référer pour avis spécialisé"
          ],
          "meds": [],
          "source": "Togo Ord. 36"
        }
      }
    }
  },
  {
    "id": "abdo_enf",
    "groupe": "Enfant",
    "titre": "Douleurs abdominales de l'enfant",
    "sous": "Togo Ord. 14",
    "debut": "a0",
    "noeuds": {
      "a0": {
        "q": "Signes d'un ventre chirurgical ?",
        "options": [
          {
            "t": "Oui, au moins un",
            "vers": "r_chir"
          },
          {
            "t": "Non",
            "vers": "a1"
          }
        ],
        "aide": "Ventre dur ou très douloureux au moindre contact, ballonnement important, vomissements verts, pas de selles ni de gaz, bourse ou testicule gonflé et douloureux, hernie douloureuse, grande pâleur, fièvre élevée avec mauvais état général."
      },
      "a1": {
        "q": "Quel est le tableau ?",
        "options": [
          {
            "t": "Enfant drépanocytaire connu, douleurs des mains, des pieds ou des articulations",
            "vers": "algo:drepano"
          },
          {
            "t": "Fièvre, frissons (paludisme possible)",
            "vers": "algo:fievre_enf"
          },
          {
            "t": "Brûlures en urinant, urines fréquentes ou troubles urinaires",
            "vers": "r_urin"
          },
          {
            "t": "Douleur autour du nombril, vers dans les selles, démangeaison anale, ballonnement",
            "vers": "r_paras"
          },
          {
            "t": "Douleurs avec selles glaireuses ou sanglantes",
            "vers": "r_colite"
          },
          {
            "t": "Douleur de l'estomac, brûlure, vomissements après les repas",
            "vers": "r_ulcere"
          },
          {
            "t": "Nourrisson qui pleure par crises, gaz, ventre ballonné (coliques)",
            "vers": "r_colique"
          },
          {
            "t": "Douleurs répétées avec constipation ou selles irrégulières",
            "vers": "r_tfi"
          },
          {
            "t": "Autres signes",
            "vers": "r_ref"
          }
        ]
      },
      "r_chir": {
        "res": {
          "niveau": "urgence",
          "titre": "Ventre chirurgical possible",
          "resume": "Appendicite, occlusion, hernie étranglée, torsion testiculaire ou péritonite : référer en urgence.",
          "conduite": [
            "Ne rien donner par la bouche",
            "Voie veineuse si possible",
            "Référer en urgence"
          ],
          "meds": [],
          "source": "Togo Ord. 14, point 5"
        }
      },
      "r_urin": {
        "res": {
          "niveau": "attention",
          "titre": "Infection urinaire possible",
          "resume": "Référer pour le traitement.",
          "conduite": [
            "Bandelette urinaire si disponible (leucocytes, nitrites)",
            "Boire beaucoup",
            "Référer pour le traitement : l'ordinogramme des troubles urinaires de l'enfant (Ord. 15) n'est pas intégré à l'application"
          ],
          "meds": [],
          "source": "Togo Ord. 14, point 9"
        }
      },
      "r_paras": {
        "res": {
          "niveau": "attention",
          "titre": "Parasitoses intestinales",
          "resume": "Vermifuge ; antiparasitaire si diarrhée.",
          "conduite": [
            "Mébendazole 500 mg en prise unique, ou albendazole 400 mg : ½ comprimé de 12 à 23 mois, 1 comprimé à partir de 24 mois (prise unique)",
            "Ne pas déparasiter l'enfant de moins de 9 mois",
            "Giardiase ou amibes (diarrhée avec glaires) : métronidazole 40 mg/kg/jour en 3 prises pendant 7 jours ({mg:40} mg par jour), ou tinidazole 50 à 70 mg/kg/jour en prise unique pendant 3 jours",
            "Lavage des mains avant les repas et après les toilettes",
            "Pas d'amélioration : référer"
          ],
          "meds": [
            "mebendazole",
            "albendazole",
            "metronidazole",
            "tinidazole",
            "trimebutine"
          ],
          "source": "Togo Ord. 14, traitement 2"
        }
      },
      "r_colite": {
        "res": {
          "niveau": "attention",
          "titre": "Colite inflammatoire possible",
          "resume": "Pansement intestinal et amoxicilline.",
          "conduite": [
            "Pansement intestinal (hydroxyde d'aluminium + hydroxyde de magnésium) : 1 sachet ou 5 mL au moment des douleurs, 6 prises par jour au maximum, 1 h 30 après les repas",
            "Amoxicilline 100 mg/kg/jour en 3 prises pendant 7 jours ({mg:100} mg par jour)",
            "Selles sanglantes avec fièvre : voir « Diarrhée de l'enfant » (dysenterie)",
            "Pas d'amélioration : référer"
          ],
          "meds": [
            "antiacides",
            "amoxicilline"
          ],
          "source": "Togo Ord. 14, traitement 4"
        }
      },
      "r_ulcere": {
        "res": {
          "niveau": "attention",
          "titre": "Ulcère ou gastrite de l'enfant",
          "resume": "Pansement gastrique puis référer.",
          "conduite": [
            "Pansement (hydroxyde d'aluminium + hydroxyde de magnésium) : 1 sachet ou 5 mL au moment des douleurs, 6 prises par jour au maximum, 1 h 30 après les repas",
            "Référer"
          ],
          "meds": [
            "antiacides"
          ],
          "source": "Togo Ord. 14, traitement 7"
        }
      },
      "r_colique": {
        "res": {
          "niveau": "ok",
          "titre": "Colique du nourrisson ou de l'enfant",
          "resume": "Traitement symptomatique ; rassurer.",
          "conduite": [
            "Rassurer les parents",
            "Trimébutine : 5 mL pour 5 kg et par jour en 3 prises, soit {kg:1} mL par jour pour ce patient",
            "Si la douleur persiste : référer"
          ],
          "meds": [
            "trimebutine"
          ],
          "source": "Togo Ord. 14, traitement 1"
        }
      },
      "r_tfi": {
        "res": {
          "niveau": "ok",
          "titre": "Troubles fonctionnels intestinaux",
          "resume": "Boissons, fibres, antispasmodique.",
          "conduite": [
            "Faire boire beaucoup d'eau (enfant de 6 mois et plus)",
            "Enfant sevré : éviter riz, pain, féculents, banane, haricot ; donner beaucoup de fibres (fruits, légumes)",
            "Trimébutine : 5 mL pour 5 kg et par jour en 3 prises, soit {kg:1} mL par jour pour ce patient",
            "Si la douleur persiste : référer"
          ],
          "meds": [
            "trimebutine"
          ],
          "source": "Togo Ord. 14, traitement 3"
        }
      },
      "r_ref": {
        "res": {
          "niveau": "attention",
          "titre": "Douleur abdominale à explorer",
          "resume": "Référer.",
          "conduite": [
            "Référer pour examen complémentaire"
          ],
          "meds": [],
          "source": "Togo Ord. 14"
        }
      }
    }
  },
  {
    "id": "abdo_adu",
    "groupe": "Adulte",
    "titre": "Douleurs abdominales de l'adulte",
    "sous": "Togo Ord. 23",
    "debut": "d0",
    "noeuds": {
      "d0": {
        "q": "Signes d'un ventre chirurgical ?",
        "options": [
          {
            "t": "Oui, au moins un",
            "vers": "r_chir"
          },
          {
            "t": "Non",
            "vers": "d1"
          }
        ],
        "aide": "Douleur très intense et permanente, ventre dur (contracture), vomissements répétés, arrêt des matières et des gaz, fièvre élevée, hernie douloureuse non réductible, douleur de la fosse iliaque droite ; chez la femme : retard de règles avec saignement et douleur d'un côté."
      },
      "d1": {
        "q": "Quel est le tableau ?",
        "options": [
          {
            "t": "Brûlure du creux de l'estomac, douleur à jeun ou après les repas",
            "vers": "algo:ulcere_adu"
          },
          {
            "t": "Fièvre prolongée, maux de tête, ventre douloureux, diarrhée ou constipation (typhoïde)",
            "vers": "algo:fievre_adu"
          },
          {
            "t": "Diarrhée avec glaires ou sang, douleurs, faux besoins (amibiase)",
            "vers": "r_amibe"
          },
          {
            "t": "Brûlures en urinant, envies fréquentes d'uriner (cystite)",
            "vers": "r_cystite"
          },
          {
            "t": "Douleur du flanc ou du dos irradiant vers les organes génitaux (colique néphrétique)",
            "vers": "r_colneph"
          },
          {
            "t": "Impossible d'uriner, bas-ventre gonflé et douloureux (rétention d'urine)",
            "vers": "r_retention"
          },
          {
            "t": "Vers ou anneaux dans les selles, démangeaison anale",
            "vers": "d2"
          },
          {
            "t": "Femme : douleur du bas-ventre, pertes, fièvre",
            "vers": "algo:ist_adu#i1"
          },
          {
            "t": "Drépanocytaire connu, en crise douloureuse",
            "vers": "algo:drepano"
          },
          {
            "t": "Autres signes (sueurs, tremblements, goitre ; vomissements permanents ; toux chronique avec sueurs nocturnes ; œdèmes)",
            "vers": "r_ref"
          }
        ]
      },
      "d2": {
        "q": "Quel type de ver ?",
        "options": [
          {
            "t": "Ténia (anneaux visibles dans les selles)",
            "vers": "r_tenia"
          },
          {
            "t": "Oxyures (démangeaison de l'anus, surtout la nuit)",
            "vers": "r_oxy"
          },
          {
            "t": "Anguillulose (démangeaisons, éruption rampante, diarrhée)",
            "vers": "r_anguil"
          }
        ]
      },
      "r_chir": {
        "res": {
          "niveau": "urgence",
          "titre": "Ventre chirurgical possible",
          "resume": "Appendicite, péritonite, occlusion, hernie étranglée, cholécystite, abcès du foie : référer en urgence.",
          "conduite": [
            "Ne rien donner par la bouche",
            "Voie veineuse si possible",
            "Femme avec retard de règles : penser à la grossesse extra-utérine",
            "Référer en urgence"
          ],
          "meds": [],
          "source": "Togo Ord. 23, point 1"
        }
      },
      "r_amibe": {
        "res": {
          "niveau": "attention",
          "titre": "Amibiase (dysenterie amibienne)",
          "resume": "Nitro-imidazolé ; revoir à 3 jours.",
          "conduite": [
            "Métronidazole 500 mg : 1 comprimé 3 fois par jour pendant 7 jours ; ou tinidazole 500 mg : 4 comprimés en prise unique par jour pendant 3 jours",
            "Revoir après 3 jours ; s'il y a encore du sang dans les selles : référer"
          ],
          "meds": [
            "metronidazole",
            "tinidazole"
          ],
          "source": "Togo Ord. 23, traitement 5"
        }
      },
      "r_cystite": {
        "res": {
          "niveau": "attention",
          "titre": "Cystite",
          "resume": "Ciprofloxacine 10 jours et boissons abondantes.",
          "conduite": [
            "Ciprofloxacine 500 mg : 1 comprimé matin et soir pendant 10 jours",
            "Boire 2 à 3 litres d'eau par jour",
            "Pas d'amélioration après 5 jours : référer",
            "Femme enceinte : ciprofloxacine contre-indiquée, avis médical"
          ],
          "meds": [
            "ciprofloxacine"
          ],
          "source": "Togo Ord. 23, traitement 8"
        }
      },
      "r_colneph": {
        "res": {
          "niveau": "urgence",
          "titre": "Colique néphrétique : référer",
          "resume": "Référer.",
          "conduite": [
            "Référer pour la prise en charge de la colique néphrétique"
          ],
          "meds": [],
          "source": "Togo Ord. 23, traitement 9 ; conduite retenue par le validateur : référer"
        }
      },
      "r_retention": {
        "res": {
          "niveau": "urgence",
          "titre": "Rétention aiguë d'urine",
          "resume": "Sonder puis référer.",
          "conduite": [
            "Sonder si possible, dans des conditions d'asepsie rigoureuse",
            "Référer"
          ],
          "meds": [],
          "source": "Togo Ord. 23, traitement 10"
        }
      },
      "r_tenia": {
        "res": {
          "niveau": "attention",
          "titre": "Téniasis (ténia)",
          "resume": "Vermifuge à jeun.",
          "conduite": [
            "Niclosamide 500 mg : 4 comprimés en prise unique, à jeun ; ou praziquantel 10 mg/kg en une prise ({mg:10} mg)",
            "Repas liquide la veille et le jour du traitement"
          ],
          "meds": [
            "autres-vermifuges"
          ],
          "source": "Togo Ord. 23, traitement 6"
        }
      },
      "r_oxy": {
        "res": {
          "niveau": "ok",
          "titre": "Oxyurose",
          "resume": "Vermifuge à répéter à 1 semaine.",
          "conduite": [
            "Mébendazole 100 mg : 1 comprimé matin et soir pendant 3 jours ; ou albendazole 400 mg en prise unique ; ou pyrantel 125 mg : 6 comprimés (750 mg) en prise unique",
            "Répéter le traitement après une semaine dans tous les cas",
            "Se laver les mains avant les repas et après les toilettes"
          ],
          "meds": [
            "mebendazole",
            "albendazole",
            "autres-vermifuges"
          ],
          "source": "Togo Ord. 23, traitement 7.B"
        }
      },
      "r_anguil": {
        "res": {
          "niveau": "attention",
          "titre": "Anguillulose",
          "resume": "Albendazole 3 jours.",
          "conduite": [
            "Albendazole 400 mg par jour pendant 3 jours",
            "Se laver les mains avant les repas et après les toilettes"
          ],
          "meds": [
            "albendazole"
          ],
          "source": "Togo Ord. 23, traitement 7.C"
        }
      },
      "r_ref": {
        "res": {
          "niveau": "attention",
          "titre": "Douleur abdominale à explorer",
          "resume": "Référer.",
          "conduite": [
            "Sueurs, tremblements, goitre, exophtalmie : hyperthyroïdie possible, référer",
            "Cheveux roux, œdèmes des jambes : malnutrition, référer",
            "Vomissements alimentaires permanents : sténose du pylore, référer",
            "Toux chronique, sueurs nocturnes, fièvre depuis plus d'un mois : tuberculose, suivre le programme national",
            "Autres signes : référer"
          ],
          "meds": [],
          "source": "Togo Ord. 23 (arbre de décision)"
        }
      }
    }
  },
  {
    "id": "vomissements",
    "groupe": "Tous",
    "titre": "Vomissements",
    "sous": "Togo Ord. 10 et 39 (enfant, adulte)",
    "debut": "v0",
    "noeuds": {
      "v0": {
        "q": "Signes de gravité ?",
        "options": [
          {
            "t": "Oui, au moins un",
            "vers": "r_urg"
          },
          {
            "t": "Non",
            "vers": "v1"
          }
        ],
        "aide": "Léthargie ou inconscience, convulsions, raideur de la nuque, fontanelle bombée, vomit tout / ne peut ni boire ni téter, sang dans les vomissements, vomissements verts (bile), ventre dur ou ballonné, vomissements en jet chez le nourrisson, déshydratation sévère."
      },
      "v1": {
        "q": "Quel patient ?",
        "options": [
          {
            "t": "Nourrisson ou enfant (moins de 15 ans)",
            "vers": "v2e"
          },
          {
            "t": "Adulte (15 ans et plus)",
            "vers": "v2a"
          }
        ]
      },
      "v2e": {
        "q": "Quelle cause est probable ?",
        "options": [
          {
            "t": "Fièvre (paludisme, infection, méningite)",
            "vers": "algo:fievre_enf"
          },
          {
            "t": "Toux ou respiration difficile",
            "vers": "algo:toux_enf"
          },
          {
            "t": "Diarrhée (gastro-entérite)",
            "vers": "algo:diarrhee_enf"
          },
          {
            "t": "Douleurs du ventre, vers",
            "vers": "algo:abdo_enf"
          },
          {
            "t": "Nourrisson qui régurgite après les repas (reflux)",
            "vers": "r_rgo"
          },
          {
            "t": "Après un changement d'alimentation ou de lait (erreur diététique)",
            "vers": "r_erreur"
          },
          {
            "t": "Autre cause, ou pas de cause évidente",
            "vers": "r_symp"
          }
        ]
      },
      "v2a": {
        "q": "Quelle cause est probable ?",
        "options": [
          {
            "t": "Fièvre (paludisme, typhoïde, méningite)",
            "vers": "algo:fievre_adu"
          },
          {
            "t": "Diarrhée",
            "vers": "algo:diarrhee_adu"
          },
          {
            "t": "Douleur abdominale",
            "vers": "algo:abdo_adu"
          },
          {
            "t": "Brûlure de l'estomac, gastrite",
            "vers": "algo:ulcere_adu"
          },
          {
            "t": "Femme enceinte (vomissements de grossesse)",
            "vers": "r_gravid"
          },
          {
            "t": "Diabétique avec soif, respiration ample et rapide, haleine acétonique",
            "vers": "r_acido"
          },
          {
            "t": "Intoxication (aliment, médicament, produit)",
            "vers": "r_intox"
          },
          {
            "t": "Autre cause, ou pas de cause évidente",
            "vers": "r_symp"
          }
        ]
      },
      "r_urg": {
        "res": {
          "niveau": "urgence",
          "titre": "Vomissements avec signe de gravité",
          "resume": "Recherche d'une urgence : référer.",
          "conduite": [
            "Chercher les signes de danger, une raideur de la nuque, une déshydratation",
            "Réhydrater si déshydratation (voir « Diarrhée »)",
            "Occlusion intestinale, sténose du pylore, paludisme grave, méningite, hémorragie digestive : référer en urgence",
            "Ne pas donner d'antiémétique si une occlusion est possible"
          ],
          "meds": [
            "sro"
          ],
          "source": "Togo Ord. 10 et 39"
        }
      },
      "r_rgo": {
        "res": {
          "niveau": "ok",
          "titre": "Reflux gastro-œsophagien du nourrisson",
          "resume": "Rassurer et adapter les repas.",
          "conduite": [
            "Rassurer les parents",
            "Surélever la tête, éviter de coucher le bébé juste après le repas",
            "Fractionner les repas",
            "Si cela persiste : référer"
          ],
          "meds": [],
          "source": "Togo Ord. 10, point 6"
        }
      },
      "r_erreur": {
        "res": {
          "niveau": "ok",
          "titre": "Erreur diététique",
          "resume": "Arrêter l'alimentation en cause.",
          "conduite": [
            "Arrêter toute alimentation artificielle si elle est la cause",
            "Réhydrater (SRO par petites gorgées)",
            "Si les vomissements persistent : référer"
          ],
          "meds": [
            "sro"
          ],
          "source": "Togo Ord. 10, traitement 8"
        }
      },
      "r_symp": {
        "res": {
          "niveau": "attention",
          "titre": "Vomissements : traitement symptomatique",
          "resume": "Réhydrater, adapter l'alimentation, antiémétique si besoin.",
          "conduite": [
            "Réhydratation selon le degré de déshydratation (voir « Diarrhée »)",
            "Repas fractionnés, éviter de se coucher juste après le repas",
            {
              "g": "Enfant",
              "t": "Métoclopramide : 0,2 mg/kg par prise, 2 fois par jour, soit {mg:0.2} mg par prise (sans dépasser 0,5 mg/kg par jour)"
            },
            {
              "g": "Adulte",
              "t": "Métoclopramide 10 mg matin et soir, sans dépasser 30 mg par jour"
            },
            "Les vomissements persistent : chercher la cause (paludisme, infection urinaire, intoxication) ou référer"
          ],
          "meds": [
            "sro",
            "metoclopramide"
          ],
          "source": "Togo Ord. 10 ; RDC Méd. interne III.3 ; doses retenues par le validateur"
        }
      },
      "r_gravid": {
        "res": {
          "niveau": "attention",
          "titre": "Vomissements de grossesse",
          "resume": "Rassurer, antiémétique, référer si importants.",
          "conduite": [
            "Soutien et explications à la patiente",
            "Métopimazine (Vogalène) 10 mg, 2 fois par jour (gouttes ou suppositoire)",
            "Déparasitage : albendazole à partir du 2e trimestre (pas au 1er)",
            "Vomissements incoercibles, perte de poids ou déshydratation : référer"
          ],
          "meds": [
            "metopimazine"
          ],
          "source": "Togo Ord. 39, traitement 11"
        }
      },
      "r_acido": {
        "res": {
          "niveau": "urgence",
          "titre": "Acidocétose diabétique possible",
          "resume": "Référer en urgence.",
          "conduite": [
            "Référer en urgence, accompagné",
            "Ne pas démarrer l'insuline en USP"
          ],
          "meds": [],
          "source": "Togo Ord. 39, point 12 ; conduite retenue : référer"
        }
      },
      "r_intox": {
        "res": {
          "niveau": "urgence",
          "titre": "Intoxication possible",
          "resume": "Référer.",
          "conduite": [
            "Noter le produit, la quantité et l'heure ; emporter l'emballage",
            "Référer (l'ordinogramme intoxication n'est pas intégré à l'application)"
          ],
          "meds": [],
          "source": "Togo Ord. 39, point 13"
        }
      }
    }
  },
  {
    "id": "dents",
    "groupe": "Tous",
    "titre": "Problèmes de dents",
    "sous": "Togo Ord. 34",
    "debut": "t0",
    "noeuds": {
      "t0": {
        "q": "Gonflement du visage qui s'étend, ou difficulté à avaler, à ouvrir la bouche ou à respirer ?",
        "options": [
          {
            "t": "Oui",
            "vers": "r_cell"
          },
          {
            "t": "Non",
            "vers": "t1"
          }
        ]
      },
      "t1": {
        "q": "Quel est le problème ?",
        "options": [
          {
            "t": "Douleur d'une dent, dent cariée",
            "vers": "r_carie"
          },
          {
            "t": "Joue ou gencive gonflée, rouge, chaude (abcès, cellulite)",
            "vers": "r_infect"
          },
          {
            "t": "Douleur de la mâchoire avec fièvre ou écoulement (ostéite)",
            "vers": "r_infect"
          },
          {
            "t": "Gencives qui saignent, dents qui bougent (parodontose)",
            "vers": "r_infect"
          },
          {
            "t": "Choc : dent cassée ou fracture de la mâchoire",
            "vers": "r_fract"
          },
          {
            "t": "Dent de sagesse, malformation, dent absente, autre",
            "vers": "r_ref"
          }
        ]
      },
      "r_carie": {
        "res": {
          "niveau": "ok",
          "titre": "Carie dentaire",
          "resume": "Antalgique et conseils ; consulter un dentiste.",
          "conduite": [
            {
              "g": "Adulte",
              "t": "Aspirine 500 mg ou paracétamol 500 mg : 2 comprimés matin, midi et soir"
            },
            {
              "g": "Enfant",
              "t": "Paracétamol sirop selon le poids ({mg:15} mg par prise, toutes les 8 heures)"
            },
            "Conseils d'hygiène bucco-dentaire, puis référer au dentiste"
          ],
          "meds": [
            "paracetamol",
            "aspirine"
          ],
          "source": "Togo Ord. 34, traitement 1"
        }
      },
      "r_infect": {
        "res": {
          "niveau": "attention",
          "titre": "Infection dentaire (abcès, cellulite, ostéite, parodontose)",
          "resume": "Antibiotique, antalgique, bain de bouche ; référer.",
          "conduite": [
            {
              "g": "Enfant",
              "t": "Amoxicilline à dose pédiatrique : 50 mg/kg/jour en 2 prises, soit {mg:50} mg par jour, pendant 7 jours"
            },
            {
              "g": "Enfant",
              "t": "Métronidazole à dose pédiatrique : 30 mg/kg/jour en 2 prises, soit {mg:30} mg par jour, pendant 7 jours"
            },
            {
              "g": "Enfant",
              "t": "Paracétamol sirop : 15 mg/kg par prise, soit {mg:15} mg toutes les 8 heures"
            },
            {
              "g": "Enfant",
              "t": "Pas d'amélioration : référer"
            },
            {
              "g": "Adulte",
              "t": "Amoxicilline 500 mg : 2 comprimés (1 g) matin et soir"
            },
            {
              "g": "Adulte",
              "t": "Métronidazole 250 mg : 2 comprimés matin, midi et soir"
            },
            {
              "g": "Adulte",
              "t": "Aspirine 500 mg : 2 comprimés, 3 fois par jour aux repas"
            },
            "Bain de bouche à la chlorhexidine, 4 fois par jour",
            "Conseils d'hygiène bucco-dentaire, puis référer au dentiste"
          ],
          "meds": [
            "amoxicilline",
            "metronidazole",
            "aspirine",
            "chlorhexidine",
            "paracetamol"
          ],
          "source": "Togo Ord. 34, traitements 2, 3 et 5"
        }
      },
      "r_cell": {
        "res": {
          "niveau": "urgence",
          "titre": "Cellulite du visage ou du cou possible",
          "resume": "Antibiotique et transfert en urgence.",
          "conduite": [
            "Premier traitement avant le transfert : amoxicilline + métronidazole (voir ci-dessous)",
            {
              "g": "Enfant",
              "t": "Amoxicilline à dose pédiatrique : 50 mg/kg/jour en 2 prises, soit {mg:50} mg par jour, pendant 7 jours"
            },
            {
              "g": "Enfant",
              "t": "Métronidazole à dose pédiatrique : 30 mg/kg/jour en 2 prises, soit {mg:30} mg par jour, pendant 7 jours"
            },
            {
              "g": "Enfant",
              "t": "Paracétamol sirop : 15 mg/kg par prise, soit {mg:15} mg toutes les 8 heures"
            },
            {
              "g": "Adulte",
              "t": "Amoxicilline 500 mg : 2 comprimés (1 g) matin et soir"
            },
            {
              "g": "Adulte",
              "t": "Métronidazole 250 mg : 2 comprimés matin, midi et soir"
            },
            "Référer en urgence"
          ],
          "meds": [
            "amoxicilline",
            "metronidazole",
            "paracetamol"
          ],
          "source": "Togo Ord. 34, traitement 2"
        }
      },
      "r_fract": {
        "res": {
          "niveau": "attention",
          "titre": "Fracture d'une dent ou de la mâchoire",
          "resume": "Antibiotique, antalgique, bandage, référer.",
          "conduite": [
            "Ampicilline 2 g en IM",
            "Aspirine 500 mg seulement s'il n'y a pas de saignement ; sinon paracétamol 500 mg : 2 comprimés matin, midi et soir",
            "Bandage circulaire, puis référer"
          ],
          "meds": [
            "ampicilline",
            "aspirine",
            "paracetamol"
          ],
          "source": "Togo Ord. 34, traitement 4"
        }
      },
      "r_ref": {
        "res": {
          "niveau": "attention",
          "titre": "Problème dentaire à confier au dentiste",
          "resume": "Référer.",
          "conduite": [
            "Complication de l'éruption d'une dent de sagesse, malformation, édentation : référer",
            "Conseils d'hygiène bucco-dentaire"
          ],
          "meds": [],
          "source": "Togo Ord. 34"
        }
      }
    }
  },
  {
    "id": "oreille_adu",
    "groupe": "Adulte",
    "titre": "Maladies de l'oreille de l'adulte",
    "sous": "Togo Ord. 35",
    "debut": "o0",
    "noeuds": {
      "o0": {
        "q": "Quel est le problème ?",
        "options": [
          {
            "t": "Douleur d'oreille avec fièvre, avec ou sans écoulement de pus (otite moyenne aiguë)",
            "vers": "r_oma"
          },
          {
            "t": "Écoulement ancien ou répété de l'oreille (otite chronique)",
            "vers": "r_omc"
          },
          {
            "t": "Douleur en touchant ou en tirant le pavillon, conduit rouge ou furoncle (otite externe)",
            "vers": "r_oe"
          },
          {
            "t": "Gonflement douloureux et rouge derrière l'oreille (mastoïdite)",
            "vers": "r_mast"
          },
          {
            "t": "Gonflement de la joue devant l'oreille, douleur en mâchant (oreillons)",
            "vers": "r_oreillons"
          },
          {
            "t": "Choc, plaie ou saignement de l'oreille",
            "vers": "r_trauma"
          },
          {
            "t": "Objet dans l'oreille",
            "vers": "r_corps"
          },
          {
            "t": "Baisse d'audition sans douleur, oreille bouchée",
            "vers": "r_cerumen"
          },
          {
            "t": "Vertiges, bourdonnements, surdité, ou masse suspecte",
            "vers": "r_ref"
          }
        ]
      },
      "r_oma": {
        "res": {
          "niveau": "attention",
          "titre": "Otite moyenne aiguë",
          "resume": "Antibiotique et antalgique ; revoir à 5 jours.",
          "conduite": [
            "Écoulement de pus : assécher avec une mèche changée dès qu'elle est humide ; ne rien mettre d'autre dans l'oreille",
            "Amoxicilline + acide clavulanique 1 g matin et soir",
            "Ibuprofène 800 mg matin et soir pendant les repas, ou aspirine 1000 mg matin, midi et soir pendant les repas",
            "Éviter les gouttes auriculaires ; éviter que l'eau entre dans l'oreille (coton au moment de la toilette)",
            "Après 5 jours : évolution bonne : poursuivre l'antibiotique 5 jours de plus ; sinon, ou si les signes reviennent après 10 jours : référer"
          ],
          "meds": [
            "amox-clav",
            "ibuprofene",
            "aspirine"
          ],
          "source": "Togo Ord. 35, traitement 1"
        }
      },
      "r_omc": {
        "res": {
          "niveau": "attention",
          "titre": "Otite moyenne chronique",
          "resume": "Même traitement et gouttes de quinolone.",
          "conduite": [
            "Amoxicilline + acide clavulanique 1 g matin et soir",
            "Ibuprofène 800 mg matin et soir pendant les repas, ou aspirine 1000 mg matin, midi et soir pendant les repas",
            "Gouttes auriculaires de quinolone",
            "Éviter que l'eau entre dans l'oreille (le tympan peut être perforé)",
            "Pas d'amélioration : référer"
          ],
          "meds": [
            "amox-clav",
            "ibuprofene",
            "aspirine"
          ],
          "source": "Togo Ord. 35, traitement 2"
        }
      },
      "r_oe": {
        "res": {
          "niveau": "attention",
          "titre": "Otite externe ou furoncle du conduit",
          "resume": "Antibiotique et antalgique.",
          "conduite": [
            "Amoxicilline + acide clavulanique 1 g matin et soir",
            "Ibuprofène 800 mg matin et soir pendant les repas, ou aspirine 1000 mg matin, midi et soir pendant les repas"
          ],
          "meds": [
            "amox-clav",
            "ibuprofene",
            "aspirine"
          ],
          "source": "Togo Ord. 35, traitement 3"
        }
      },
      "r_mast": {
        "res": {
          "niveau": "urgence",
          "titre": "Mastoïdite aiguë possible",
          "resume": "Premier traitement puis référer.",
          "conduite": [
            "Amoxicilline + acide clavulanique 1 g matin et soir",
            "Ibuprofène 800 mg matin et soir pendant les repas, ou aspirine 1000 mg matin, midi et soir pendant les repas",
            "Référer"
          ],
          "meds": [
            "amox-clav",
            "ibuprofene",
            "aspirine"
          ],
          "source": "Togo Ord. 35, traitement 4"
        }
      },
      "r_oreillons": {
        "res": {
          "niveau": "attention",
          "titre": "Oreillons (parotidite aiguë)",
          "resume": "Repos, antalgique ; éviction scolaire.",
          "conduite": [
            "Amoxicilline + acide clavulanique 1 g matin et soir",
            "Ibuprofène 800 mg matin et soir pendant les repas, ou aspirine 1000 mg matin, midi et soir pendant les repas",
            "Vitamine C 500 mg par jour",
            "Repos au lit et éviction scolaire pendant 7 jours",
            "Douleurs testiculaires : référer"
          ],
          "meds": [
            "amox-clav",
            "ibuprofene",
            "aspirine"
          ],
          "source": "Togo Ord. 35, traitement 5"
        }
      },
      "r_trauma": {
        "res": {
          "niveau": "attention",
          "titre": "Traumatisme de l'oreille",
          "resume": "Mèche, antibiotique et antalgique, référer.",
          "conduite": [
            "Saignement : placer une mèche dans l'oreille",
            "Amoxicilline + acide clavulanique 1 g matin et soir",
            "Ibuprofène 800 mg matin et soir pendant les repas, ou aspirine 1000 mg matin, midi et soir pendant les repas",
            "Référer"
          ],
          "meds": [
            "amox-clav",
            "ibuprofene",
            "aspirine"
          ],
          "source": "Togo Ord. 35, traitement 6"
        }
      },
      "r_corps": {
        "res": {
          "niveau": "attention",
          "titre": "Corps étranger de l'oreille",
          "resume": "Extraction prudente ; pas de lavage.",
          "conduite": [
            "Tenter l'extraction avec une pince adaptée ; ne pas laver l'oreille",
            "Saignement : assécher avec une mèche",
            "Amoxicilline + acide clavulanique 1 g matin et soir, et ibuprofène ou aspirine, pendant 7 jours",
            "Échec de l'extraction : même traitement, puis référer"
          ],
          "meds": [
            "amox-clav",
            "ibuprofene",
            "aspirine"
          ],
          "source": "Togo Ord. 35, traitement 7"
        }
      },
      "r_cerumen": {
        "res": {
          "niveau": "ok",
          "titre": "Bouchon de cérumen",
          "resume": "Lavage à l'eau tiède.",
          "conduite": [
            "Laver avec de l'eau tiède, avec une grosse seringue (10 mL ou plus) sans aiguille",
            "Si le bouchon est sorti : demander si le patient entend mieux ; sinon référer",
            "Douleur après le lavage : ibuprofène ou aspirine pendant 3 jours"
          ],
          "meds": [
            "ibuprofene",
            "aspirine"
          ],
          "source": "Togo Ord. 35, traitement 8"
        }
      },
      "r_ref": {
        "res": {
          "niveau": "attention",
          "titre": "Atteinte de l'oreille à confier au spécialiste",
          "resume": "Référer.",
          "conduite": [
            "Troubles de l'audition, de l'équilibre, vertiges, ou masse suspecte : référer à l'ORL"
          ],
          "meds": [],
          "source": "Togo Ord. 35, traitements 9 et 10"
        }
      }
    }
  },
  {
    "id": "asthme",
    "groupe": "Tous",
    "titre": "Asthme : crise et suivi",
    "sous": "RDC Méd. interne I.2 et Pédiatrie ; Togo Ord. 2, 17, 19",
    "debut": "s0",
    "noeuds": {
      "s0": {
        "q": "Signes d'arrêt respiratoire imminent ?",
        "options": [
          {
            "t": "Oui",
            "vers": "r_arret"
          },
          {
            "t": "Non",
            "vers": "s1"
          }
        ],
        "aide": "Pauses respiratoires, pouls lent, tension basse, somnolence ou convulsions, silence à l'auscultation (plus de sifflement), cyanose."
      },
      "s1": {
        "q": "Gravité de la crise ?",
        "options": [
          {
            "t": "Sévère : dyspnée au repos, ne dit que des mots, cyanose, tirage, agitation",
            "vers": "r_sev"
          },
          {
            "t": "Modérée : phrases entrecoupées, ne finit pas ses phrases",
            "vers": "r_mod"
          },
          {
            "t": "Légère : parle normalement, sifflement léger",
            "vers": "r_leg"
          },
          {
            "t": "Pas de crise en ce moment : suivi de l'asthmatique",
            "vers": "r_fond"
          }
        ],
        "aide": "Asthme sévère : fréquence respiratoire ≥ 30, pouls ≥ 120, agitation. Modéré : fréquence respiratoire ≥ 25, pouls ≥ 110."
      },
      "r_arret": {
        "res": {
          "niveau": "urgence",
          "titre": "Asthme : arrêt respiratoire imminent",
          "resume": "Référer en urgence.",
          "conduite": [
            "Position demi-assise ; oxygène 6 à 8 L/min si disponible",
            "Référer en urgence, sous surveillance"
          ],
          "meds": [],
          "source": "Décision du validateur : référer"
        }
      },
      "r_sev": {
        "res": {
          "niveau": "urgence",
          "titre": "Crise d'asthme sévère",
          "resume": "Bronchodilatateur, corticoïde, oxygène, transfert.",
          "conduite": [
            "Position demi-assise ; oxygène 6 à 8 L/min par intermittence si disponible",
            {
              "g": "Adulte",
              "t": "Salbutamol spray : 2 bouffées toutes les 20 minutes ; nébulisation de salbutamol 5 mg si possible"
            },
            {
              "g": "Enfant",
              "t": "Salbutamol spray + chambre d'inhalation : 1 à 2 bouffées, à renouveler toutes les 30 minutes à 1 heure"
            },
            {
              "g": "Adulte",
              "t": "Corticoïde, première dose : hydrocortisone 200 mg ou dexaméthasone 4 mg en IV directe ; surveiller 45 minutes, puis référer si pas d'amélioration"
            },
            {
              "g": "Enfant",
              "t": "Corticoïde avant le transfert : bétaméthasone 2 à 8 mg en IM selon l'âge"
            },
            "Fièvre ou signes d'infection : érythromycine (adulte 1,5 à 2 g par jour ; enfant 50 mg/kg/jour en 2 prises)",
            "Référer"
          ],
          "meds": [
            "salbutamol",
            "corticoide-inj",
            "erythromycine"
          ],
          "source": "RDC Méd. interne I.2 ; RDC Pédiatrie ; Togo Ord. 2"
        }
      },
      "r_mod": {
        "res": {
          "niveau": "attention",
          "titre": "Crise d'asthme modérée",
          "resume": "Salbutamol répété, corticoïde si la crise persiste.",
          "conduite": [
            {
              "g": "Adulte",
              "t": "Salbutamol spray : 2 bouffées toutes les 20 minutes pendant 1 heure"
            },
            {
              "g": "Enfant",
              "t": "Salbutamol spray + chambre d'inhalation : 1 à 2 bouffées, à renouveler toutes les 30 minutes à 1 heure jusqu'à l'arrêt de la crise"
            },
            "Observer 1 à 2 heures",
            {
              "g": "Adulte",
              "t": "Crise persistante : prednisolone 1 mg/kg/jour en 3 prises pendant 10 jours, sans dépasser 60 mg par jour"
            },
            {
              "g": "Enfant",
              "t": "Crise persistante : prednisolone 1 mg/kg par prise, 2 fois par jour, soit {mg:1} mg par prise"
            },
            "Fièvre ou signes de pneumonie : antibiotique (de préférence érythromycine)",
            "Pas d'amélioration après 1 heure : référer en position demi-assise"
          ],
          "meds": [
            "salbutamol",
            "prednisolone",
            "erythromycine"
          ],
          "source": "RDC Méd. interne I.2 ; RDC Pédiatrie ; Togo Ord. 2, 17 et 19"
        }
      },
      "r_leg": {
        "res": {
          "niveau": "ok",
          "titre": "Crise d'asthme légère",
          "resume": "Salbutamol dès les premiers symptômes.",
          "conduite": [
            "Salbutamol spray avec chambre d'inhalation : 1 à 2 bouffées dès les premiers symptômes, à renouveler après 15 minutes si besoin",
            "Chercher le facteur déclenchant (infection, fumée, poussière, effort, stress)",
            "Pas d'amélioration après 1 heure : référer en position demi-assise"
          ],
          "meds": [
            "salbutamol"
          ],
          "source": "Togo Ord. 17, 19 ; RDC Méd. interne I.2 ; corticoïde inhalé retiré (décision du validateur)"
        }
      },
      "r_fond": {
        "res": {
          "niveau": "ok",
          "titre": "Asthme : traitement de fond et prévention",
          "resume": "Salbutamol sirop, éviter les déclencheurs.",
          "conduite": [
            "Salbutamol sirop 2 mg/5 mL, 3 fois par jour : plus de 12 ans et adulte 4 mg (10 mL) ; 6 à 12 ans 2 mg (5 mL) ; 2 à 6 ans 1 à 2 mg (2,5 à 5 mL) ; moins de 2 ans environ 0,1 mg/kg par prise ({mg:0.1} mg)",
            "Éviter les déclencheurs : infections, fumée de cigarette, poussière, odeurs fortes, allergènes, effort, stress",
            "Éviter l'aspirine et les bêtabloquants chez l'asthmatique",
            "Référer pour la spirométrie (débit expiratoire de pointe) et l'ajustement du traitement de fond"
          ],
          "meds": [
            "salbutamol-sirop"
          ],
          "source": "RDC Méd. interne I.2 ; salbutamol sirop : décision du validateur (corticoïde inhalé retiré)"
        }
      }
    }
  },
  {
    "id": "anemie",
    "groupe": "Tous",
    "titre": "Anémies : pâleur",
    "sous": "Togo Ord. 9 et 37 ; RDC Méd. interne II.1 et Pédiatrie",
    "debut": "n0",
    "noeuds": {
      "n0": {
        "q": "Âge du patient ?",
        "options": [
          {
            "t": "Enfant (moins de 15 ans)",
            "vers": "ne1"
          },
          {
            "t": "Adulte (15 ans et plus)",
            "vers": "na1"
          }
        ],
        "aide": "Pâleur des paumes, des plantes des pieds, des conjonctives ou des muqueuses."
      },
      "ne1": {
        "q": "Signes de gravité ?",
        "options": [
          {
            "t": "Oui, au moins un",
            "vers": "r_grave_e"
          },
          {
            "t": "Non",
            "vers": "ne2"
          }
        ],
        "aide": "Léthargie, convulsions, vomit tout, incapable de boire ; respiration rapide avec pâleur palmaire sévère ; hémoglobine < 7 g/dL ; détresse respiratoire."
      },
      "ne2": {
        "q": "Quels autres signes ?",
        "options": [
          {
            "t": "Fièvre (faire le test de paludisme)",
            "vers": "algo:fievre_enf"
          },
          {
            "t": "Douleurs du ventre, troubles du transit, vers",
            "vers": "r_paras_e"
          },
          {
            "t": "Drépanocytaire connu, douleurs des mains et des pieds, ictère",
            "vers": "algo:drepano"
          },
          {
            "t": "Saignement (plaie, saignement de nez, selles noires, vomissement de sang)",
            "vers": "r_hemo_e"
          },
          {
            "t": "Infections répétées, muguet, ganglions partout, VIH chez la mère ou dans la fratrie",
            "vers": "r_vih_e"
          },
          {
            "t": "Ingestion de médicament, produit ou tisane ; urines foncées ; ictère",
            "vers": "r_hemolyse"
          },
          {
            "t": "Aucun autre signe : pâleur palmaire modérée",
            "vers": "r_carence_e"
          }
        ]
      },
      "r_grave_e": {
        "res": {
          "niveau": "urgence",
          "titre": "Anémie grave de l'enfant",
          "resume": "Référer immédiatement.",
          "conduite": [
            "Oxygène si possible",
            "Eau sucrée pour prévenir l'hypoglycémie",
            "Faire le test de paludisme (TDR ou goutte épaisse)",
            "Référer immédiatement (transfusion)"
          ],
          "meds": [],
          "source": "Togo Ord. 9 ; RDC Pédiatrie"
        }
      },
      "r_carence_e": {
        "res": {
          "niveau": "attention",
          "titre": "Anémie modérée (carence en fer probable)",
          "resume": "Fer, acide folique, déparasitage, alimentation.",
          "conduite": [
            "Sulfate ferreux 6 mg/kg/jour en 3 prises avant les repas pendant 3 mois, soit {mg:6} mg par jour",
            "Acide folique 5 mg par jour pendant 3 mois",
            "Si besoin vitamine B12 : 1 ampoule de 1000 µg par jour pendant 3 semaines",
            "Déparasitage : mébendazole 500 mg en prise unique, ou albendazole 400 mg (½ comprimé de 12 à 23 mois, 1 comprimé à partir de 24 mois) ; pas avant 9 mois",
            "Alimentation riche en fer (céréales, légumes, viande) ; encourager l'allaitement maternel",
            "Pas d'amélioration après 1 mois : référer"
          ],
          "meds": [
            "fer",
            "acide-folique",
            "vitamine-b12",
            "mebendazole",
            "albendazole"
          ],
          "source": "Togo Ord. 9, traitement 1 ; RDC Pédiatrie"
        }
      },
      "r_paras_e": {
        "res": {
          "niveau": "attention",
          "titre": "Anémie avec vers intestinaux",
          "resume": "Traiter les vers et l'anémie.",
          "conduite": [
            "Traiter la parasitose (voir « Douleurs abdominales de l'enfant »)",
            "Sulfate ferreux 6 mg/kg/jour en 3 prises avant les repas pendant 3 mois, soit {mg:6} mg par jour",
            "Acide folique 5 mg par jour pendant 3 mois",
            "Si besoin vitamine B12 : 1 ampoule de 1000 µg par jour pendant 3 semaines",
            "Déparasitage : mébendazole 500 mg en prise unique, ou albendazole 400 mg (½ comprimé de 12 à 23 mois, 1 comprimé à partir de 24 mois) ; pas avant 9 mois",
            "Pas d'amélioration après 1 mois : référer"
          ],
          "meds": [
            "fer",
            "acide-folique",
            "mebendazole",
            "albendazole",
            "metronidazole"
          ],
          "source": "Togo Ord. 9, traitements 1 et 4"
        }
      },
      "r_hemo_e": {
        "res": {
          "niveau": "attention",
          "titre": "Anémie avec saignement",
          "resume": "Arrêter le saignement ; référer si important.",
          "conduite": [
            "Hémorragie externe de petite abondance : tamponnement, fer, amoxicilline 50 mg/kg/jour en 2 prises pendant 6 jours ({mg:50} mg par jour)",
            "Hémorragie externe abondante : bandage compressif, ampicilline 50 mg/kg/jour en 1 injection, et référer immédiatement",
            "Hémorragie interne ou extériorisée (selles noires, vomissement de sang) : référer immédiatement"
          ],
          "meds": [
            "fer",
            "amoxicilline",
            "ampicilline"
          ],
          "source": "Togo Ord. 9, traitement 6"
        }
      },
      "r_vih_e": {
        "res": {
          "niveau": "attention",
          "titre": "Infection à VIH possible",
          "resume": "Traiter l'anémie et référer.",
          "conduite": [
            "Sulfate ferreux 6 mg/kg/jour en 3 prises avant les repas pendant 3 mois, soit {mg:6} mg par jour",
            "Acide folique 5 mg par jour pendant 3 mois",
            "Si besoin vitamine B12 : 1 ampoule de 1000 µg par jour pendant 3 semaines",
            "Référer pour le dépistage et la prise en charge du VIH"
          ],
          "meds": [
            "fer",
            "acide-folique"
          ],
          "source": "Togo Ord. 9, point 7"
        }
      },
      "r_hemolyse": {
        "res": {
          "niveau": "attention",
          "titre": "Hémolyse possible (toxique, médicamenteuse, déficit en G6PD, thalassémie)",
          "resume": "Référer.",
          "conduite": [
            "Arrêter le médicament ou le produit en cause",
            "Référer"
          ],
          "meds": [],
          "source": "Togo Ord. 9, points 8, 9 et 10"
        }
      },
      "na1": {
        "q": "Anémie mal tolérée ?",
        "options": [
          {
            "t": "Oui, au moins un signe",
            "vers": "r_grave_a"
          },
          {
            "t": "Non",
            "vers": "na2"
          }
        ],
        "aide": "Pâleur avec essoufflement, palpitations, vertiges, bourdonnements d'oreille, tachycardie, souffle cardiaque, œdèmes des jambes, malaise."
      },
      "na2": {
        "q": "Quel est le contexte ?",
        "options": [
          {
            "t": "Fièvre, frissons (paludisme possible)",
            "vers": "algo:fievre_adu"
          },
          {
            "t": "Drépanocytaire connu",
            "vers": "algo:drepano"
          },
          {
            "t": "Saignement : règles abondantes, selles noires, vomissement de sang, saignement après accouchement",
            "vers": "r_hemo_a"
          },
          {
            "t": "Urines très foncées (couleur coca-cola), ictère, après un médicament",
            "vers": "r_hemolyse_a"
          },
          {
            "t": "Perte de poids, fièvre prolongée, toux chronique, infections répétées",
            "vers": "r_ref_a"
          },
          {
            "t": "Pâleur et fatigue seules, sans autre signe",
            "vers": "r_carence_a"
          }
        ]
      },
      "r_grave_a": {
        "res": {
          "niveau": "urgence",
          "titre": "Anémie mal tolérée de l'adulte",
          "resume": "Référer pour transfusion.",
          "conduite": [
            "Position demi-assise si essoufflement",
            "Référer en urgence : la transfusion dépend de l'hémoglobine (1 culot si 6-7 g/dL, 2 si 4-5, 3 si moins de 4)",
            "Décompensation cardiaque : transfusion lente, avec furosémide sous avis médical"
          ],
          "meds": [],
          "source": "RDC Méd. interne II.1.4"
        }
      },
      "r_carence_a": {
        "res": {
          "niveau": "attention",
          "titre": "Anémie tolérée : carence en fer probable",
          "resume": "Fer + acide folique ; chercher la cause.",
          "conduite": [
            "Fer + acide folique : 3 comprimés par jour, le matin à jeun, pendant 3 mois",
            "Vitamine C 500 mg à 1 g le matin avec les comprimés de fer",
            "RDC : sulfate de fer 1 comprimé 2 fois par jour pendant 1 à 3 mois",
            "Chercher la cause : vers (albendazole 400 mg en dose unique), saignements, tuberculose, VIH",
            "Anémie par carence en folates ou en vitamine B12 : acide folique 5 mg par jour ; vitamine B12 : 1 ampoule de 1 mg en IM par jour",
            "Pas d'amélioration après 14 jours, ou anémie décompensée : référer",
            "Femme enceinte : avis médical"
          ],
          "meds": [
            "fer",
            "acide-folique",
            "vitamine-b12",
            "albendazole"
          ],
          "source": "Togo Ord. 37, traitement 8 ; RDC Méd. interne II.1.4"
        }
      },
      "r_hemo_a": {
        "res": {
          "niveau": "attention",
          "titre": "Anémie avec saignement",
          "resume": "Arrêter le saignement ; référer.",
          "conduite": [
            "Arrêter ou limiter le saignement (compression)",
            "Chercher la cause : référer",
            "Après un saignement du post-partum : fer + acide folique, 2 comprimés 2 fois par jour pendant 2 mois"
          ],
          "meds": [
            "fer",
            "acide-folique"
          ],
          "source": "Togo Ord. 30 et 37 ; RDC Méd. interne II.1"
        }
      },
      "r_hemolyse_a": {
        "res": {
          "niveau": "urgence",
          "titre": "Hémolyse possible",
          "resume": "Hydrater, éviter les oxydants, référer.",
          "conduite": [
            "Bien hydrater le patient",
            "Éviter les médicaments et aliments oxydants",
            "Hémolyse simple : pas de fer ; acide folique 5 mg, 1 à 3 comprimés par jour",
            "Urines très foncées, fièvre, douleurs : référer en urgence"
          ],
          "meds": [
            "acide-folique"
          ],
          "source": "RDC Méd. interne II.1.4"
        }
      },
      "r_ref_a": {
        "res": {
          "niveau": "attention",
          "titre": "Anémie avec signe général",
          "resume": "Référer pour la cause.",
          "conduite": [
            "Tuberculose possible (toux chronique, sueurs nocturnes) : suivre le programme national",
            "Référer pour le bilan complet (VIH, hémogramme, recherche de saignement)"
          ],
          "meds": [],
          "source": "RDC Méd. interne II.1.3"
        }
      }
    }
  },
  {
    "id": "dyspnee_enf",
    "groupe": "Enfant",
    "titre": "Difficultés respiratoires (dyspnée) de l'enfant",
    "sous": "Togo Ord. 3",
    "debut": "d0",
    "noeuds": {
      "d0": {
        "q": "Signes généraux de danger : léthargie, inconscience, vomit tout, incapable de boire ou de téter, convulsions ?",
        "options": [
          {
            "t": "Oui, au moins un",
            "vers": "r_danger"
          },
          {
            "t": "Non",
            "vers": "d1"
          }
        ],
        "aide": "Compter la respiration sur une minute complète, chercher un tirage sous-costal et un stridor (enfant déshabillé)."
      },
      "d1": {
        "q": "Quel tableau ?",
        "options": [
          {
            "t": "Vomissements, diarrhée, fièvre, yeux enfoncés, pli cutané qui s'efface lentement (déshydratation)",
            "vers": "algo:diarrhee_enf"
          },
          {
            "t": "Toux avec respiration rapide, tirage, fièvre (pneumonie), ou toux simple",
            "vers": "algo:toux_enf"
          },
          {
            "t": "Difficulté à expirer, sifflement (asthme)",
            "vers": "algo:asthme"
          },
          {
            "t": "Début brutal pendant un repas ou un gavage (corps étranger, fausse route)",
            "vers": "r_corps"
          },
          {
            "t": "Toux avec voix rauque ou éteinte, inspiration difficile et bruyante (laryngite)",
            "vers": "algo:toux_enf#r_laryngite"
          },
          {
            "t": "Pâleur palmaire sévère (anémie grave)",
            "vers": "algo:anemie#r_grave_e"
          },
          {
            "t": "Toux de plus de 2 semaines, contage tuberculeux, fièvre prolongée",
            "vers": "algo:toux_enf#r_tb"
          },
          {
            "t": "Autres signes",
            "vers": "r_ref"
          }
        ]
      },
      "r_danger": {
        "res": {
          "niveau": "urgence",
          "titre": "Détresse respiratoire avec signe de danger",
          "resume": "Premiers gestes puis transfert.",
          "conduite": [
            "Libérer les voies aériennes supérieures",
            "Position semi-assise",
            "Oxygène si disponible",
            "Poser une voie veineuse pour perfusion si possible",
            "Convulsions : diazépam 0,5 à 1 mg/kg ({mg:0.5} à {mg:1} mg) ; en cas de détresse respiratoire : phénobarbital 15 mg/kg IM ({mg:15} mg)",
            "Référer immédiatement"
          ],
          "meds": [
            "diazepam",
            "phenobarbital"
          ],
          "source": "Togo Ord. 3 et Ord. 5"
        }
      },
      "r_corps": {
        "res": {
          "niveau": "urgence",
          "titre": "Corps étranger dans les voies respiratoires / fausse route",
          "resume": "Manœuvre de désobstruction puis surveillance ou transfert.",
          "conduite": [
            "Faire la manœuvre de Heimlich (adaptée à l'âge de l'enfant)",
            "Ne pas faire vomir, ne pas faire de lavage d'estomac",
            "Détresse respiratoire : référer",
            "Signes de pneumonie : traiter (voir toux de l'enfant)",
            "Surveiller l'enfant"
          ],
          "meds": [],
          "source": "Togo Ord. 3 (point 5) et Ord. 5 (traitement 7)"
        }
      },
      "r_ref": {
        "res": {
          "niveau": "attention",
          "titre": "Référer pour avis spécialisé",
          "resume": "Le tableau ne correspond à aucun cas traité au centre de santé.",
          "conduite": [
            "Référer vers l'hôpital pour examen et bilan",
            "Avant le transfert : traiter la douleur ou la fièvre, hydrater, rassurer la famille"
          ],
          "meds": [
            "paracetamol"
          ],
          "source": "Togo Ord. 3"
        }
      }
    }
  },
  {
    "id": "convuls_enf",
    "groupe": "Enfant",
    "titre": "Convulsions de l'enfant",
    "sous": "Togo Ord. 5",
    "debut": "c0",
    "noeuds": {
      "c0": {
        "q": "L'enfant convulse-t-il en ce moment ?",
        "options": [
          {
            "t": "Oui, crise en cours",
            "vers": "r_crise"
          },
          {
            "t": "Non, la crise est terminée",
            "vers": "c1"
          }
        ]
      },
      "r_crise": {
        "res": {
          "niveau": "urgence",
          "titre": "Crise convulsive en cours",
          "resume": "Arrêter la crise, protéger les voies aériennes, puis chercher la cause.",
          "conduite": [
            "Mettre l'enfant en position latérale de sécurité, libérer les voies aériennes",
            "Diazépam : 0,5 à 1 mg/kg en intrarectal, IM ou IV lente, soit {mg:0.5} à {mg:1} mg",
            "Détresse respiratoire ou enfant à référer : pas de diazépam, phénobarbital 15 mg/kg IM, soit {mg:15} mg",
            "Si fièvre : dévêtir, envelopper dans un linge humide, paracétamol 15 mg/kg, soit {mg:15} mg",
            "Faire un TDR du paludisme et une glycémie capillaire",
            "Chercher ensuite la cause (bouton ci-dessous)"
          ],
          "meds": [
            "diazepam",
            "phenobarbital",
            "paracetamol"
          ],
          "source": "Togo Ord. 5 (conduite à tenir, A à C)",
          "liens": [
            {
              "t": "Chercher la cause des convulsions",
              "vers": "algo:convuls_enf#c1"
            }
          ]
        }
      },
      "c1": {
        "q": "Quel tableau ?",
        "options": [
          {
            "t": "Nouveau-né de moins de 28 jours : ombilic infecté, dyspnée, jaunisse, geignement, trouble de la conscience",
            "vers": "r_septic"
          },
          {
            "t": "Raideur de la nuque, trouble de la conscience, fontanelle bombée",
            "vers": "algo:fievre_enf#r_mening"
          },
          {
            "t": "Frissons, vomissements, urines foncées, trouble de la conscience, détresse respiratoire, coma, TDR ou goutte épaisse positif",
            "vers": "algo:fievre_enf#r_grave"
          },
          {
            "t": "Trismus ou crise provoquée par une stimulation, vaccination antitétanique absente ou douteuse (mère ou enfant)",
            "vers": "r_tetanos"
          },
          {
            "t": "Fièvre (température > 37,5 °C) sans signe ci-dessus",
            "vers": "algo:fievre_enf"
          },
          {
            "t": "Enfant de plus de 3 ans, crises répétées, chute brutale avec perte d'urine ou morsure de langue, antécédent de souffrance à la naissance",
            "vers": "r_epil"
          },
          {
            "t": "Dernier repas il y a plus de 6 heures, trouble de la conscience",
            "vers": "r_hypo"
          },
          {
            "t": "Crispation des doigts (main d'accoucheur) chez le grand enfant ; agitation, cris, tremblements chez le nouveau-né",
            "vers": "r_tetanie"
          },
          {
            "t": "Inhalation d'un corps étranger, fausse route",
            "vers": "algo:dyspnee_enf#r_corps"
          },
          {
            "t": "Infection à VIH connue ou suspectée",
            "vers": "r_vih"
          },
          {
            "t": "Autres signes",
            "vers": "r_ref"
          }
        ]
      },
      "r_septic": {
        "res": {
          "niveau": "urgence",
          "titre": "Septicémie néonatale possible",
          "resume": "Bilan rapide, antibiotiques, puis transfert immédiat.",
          "conduite": [
            "Si possible : NFS, CRP, goutte épaisse avant le traitement, sans retarder l'antibiotique",
            "Ceftriaxone 50 mg/kg/jour IV, soit {mg:50} mg par jour",
            "Gentamicine 4 mg/kg/jour en une injection pendant 3 jours, soit {mg:4} mg",
            "Paracétamol injectable 15 mg/kg si fièvre, soit {mg:15} mg",
            "Soigner la porte d'entrée (ombilic)",
            "Puis référer immédiatement"
          ],
          "meds": [
            "ceftriaxone",
            "gentamicine",
            "paracetamol"
          ],
          "source": "Togo Ord. 5 (traitement 3) ; schéma néonatal retenu par le validateur"
        }
      },
      "r_tetanos": {
        "res": {
          "niveau": "urgence",
          "titre": "Tétanos possible",
          "resume": "Tétanos possible : référer en urgence après les premiers gestes.",
          "conduite": [
            "Référer en urgence",
            "Avant le transfert : diazépam 0,5 à 1 mg/kg ({mg:0.5} à {mg:1} mg), pénicilline G 100 000 UI/kg/jour ({mg:100000} UI par jour)",
            "Soins de la porte d'entrée (ombilic chez le nouveau-né)",
            "VAT selon le calendrier vaccinal",
            "Le sérum antitétanique (SAT) et la perfusion continue de diazépam se font à l'hôpital"
          ],
          "meds": [
            "diazepam"
          ],
          "source": "Togo Ord. 5 (traitement 6)"
        }
      },
      "r_epil": {
        "res": {
          "niveau": "attention",
          "titre": "Épilepsie possible",
          "resume": "Arrêter la crise puis référer.",
          "conduite": [
            "Diazépam 0,5 à 1 mg/kg en IR, IM ou IV lente ({mg:0.5} à {mg:1} mg) ; détresse respiratoire : phénobarbital 15 mg/kg IM ({mg:15} mg)",
            "Référer pour bilan et traitement de fond"
          ],
          "meds": [
            "diazepam",
            "phenobarbital"
          ],
          "source": "Togo Ord. 5 (traitement 4)"
        }
      },
      "r_hypo": {
        "res": {
          "niveau": "urgence",
          "titre": "Hypoglycémie",
          "resume": "Sucre immédiatement.",
          "conduite": [
            "SGH 10 % : 10 mL/kg en bolus, soit {kg:10} mL",
            "Alimenter l'enfant dès que la voie orale est possible",
            "Contrôler la glycémie capillaire ; chercher la cause (paludisme, infection)"
          ],
          "meds": [
            "sgh10"
          ],
          "source": "Togo Ord. 5 (traitement 5)"
        }
      },
      "r_tetanie": {
        "res": {
          "niveau": "urgence",
          "titre": "Hypocalcémie (tétanie) possible",
          "resume": "Référer.",
          "conduite": [
            "Référer en urgence",
            "Crise en cours : diazépam 0,5 à 1 mg/kg ({mg:0.5} à {mg:1} mg)"
          ],
          "meds": [
            "diazepam"
          ],
          "source": "Togo Ord. 5 (point 7)"
        }
      },
      "r_vih": {
        "res": {
          "niveau": "attention",
          "titre": "Infection à VIH de l'enfant possible",
          "resume": "Cotrimoxazole puis transfert.",
          "conduite": [
            "Cotrimoxazole : 5 mL de sirop pour 5 kg par jour, en 2 prises, ou ½ comprimé de 480 mg pour 5 kg par jour",
            "Référer"
          ],
          "meds": [
            "cotrimoxazole"
          ],
          "source": "Togo Ord. 5 (point 8)"
        }
      },
      "r_ref": {
        "res": {
          "niveau": "urgence",
          "titre": "Référer en urgence",
          "resume": "Cas non traité au centre de santé.",
          "conduite": [
            "Référer immédiatement vers l'hôpital",
            "Mettre l'enfant en position confortable, le garder au chaud, surveiller la respiration"
          ],
          "meds": [],
          "source": "Togo Ord. 5"
        }
      }
    }
  },
  {
    "id": "ictere_enf",
    "groupe": "Enfant",
    "titre": "Ictère (jaunisse) du nouveau-né et de l'enfant",
    "sous": "Togo Ord. 6",
    "debut": "i0",
    "noeuds": {
      "i0": {
        "q": "Âge ?",
        "options": [
          {
            "t": "Nouveau-né (moins de 28 jours)",
            "vers": "i1"
          },
          {
            "t": "Enfant plus grand",
            "vers": "i2"
          }
        ],
        "aide": "Examiner l'enfant déshabillé : ombilic, respiration, pâleur palmaire, couleur des selles et des urines. Vérifier le groupe sanguin et le rhésus de la mère."
      },
      "i1": {
        "q": "Quel tableau chez le nouveau-né ?",
        "options": [
          {
            "t": "Température > 37,5 °C ou < 36 °C, ne tète pas, fièvre de la mère à l'accouchement, rupture prématurée des membranes, liquide amniotique anormal",
            "vers": "r_nn_inf"
          },
          {
            "t": "Ictère intense dès le 1er ou 2e jour, mère multipare de rhésus négatif",
            "vers": "r_nn_hemol"
          },
          {
            "t": "Ictère léger isolé apparu au 3e jour, l'enfant tète bien",
            "vers": "r_nn_phys"
          },
          {
            "t": "Autres signes",
            "vers": "r_ref"
          }
        ]
      },
      "i2": {
        "q": "Quel tableau chez l'enfant ?",
        "options": [
          {
            "t": "Température > 37,5 °C, vomissements importants, urines « coca-cola », détresse respiratoire, trouble de la conscience, TDR positif",
            "vers": "algo:fievre_enf#r_grave"
          },
          {
            "t": "Drépanocytaire connu (en crise ou non)",
            "vers": "algo:drepano"
          },
          {
            "t": "Fatigue, syndrome grippal, gros foie, démangeaisons, selles décolorées (hépatite)",
            "vers": "r_hepat"
          },
          {
            "t": "Antécédent de déficit en G6PD, ou autres signes",
            "vers": "r_ref"
          }
        ]
      },
      "r_nn_inf": {
        "res": {
          "niveau": "urgence",
          "titre": "Infection néonatale possible",
          "resume": "Antibiotiques puis transfert.",
          "conduite": [
            "Envelopper le nouveau-né pour qu'il ne prenne pas froid",
            "Si possible : NFS, CRP, goutte épaisse avant le traitement",
            "Ceftriaxone 50 mg/kg/jour IV, soit {mg:50} mg par jour",
            "Gentamicine 4 mg/kg/jour pendant 3 jours, soit {mg:4} mg",
            "Si fièvre : paracétamol injectable 15 mg/kg ({mg:15} mg)",
            "Soigner la porte d'entrée (ombilic)",
            "Convulsions : voir l'arbre « convulsions de l'enfant »",
            "Puis référer"
          ],
          "meds": [
            "ceftriaxone",
            "gentamicine",
            "paracetamol"
          ],
          "source": "Togo Ord. 6 (traitement 1) ; schéma néonatal retenu par le validateur"
        }
      },
      "r_nn_hemol": {
        "res": {
          "niveau": "urgence",
          "titre": "Ictère hémolytique du nouveau-né possible",
          "resume": "Référer sans délai.",
          "conduite": [
            "Envelopper le nouveau-né, le garder au chaud",
            "Photothérapie si disponible",
            "Référer immédiatement (incompatibilité sanguine)"
          ],
          "meds": [],
          "source": "Togo Ord. 6 (point 2)"
        }
      },
      "r_nn_phys": {
        "res": {
          "niveau": "ok",
          "titre": "Ictère physiologique probable",
          "resume": "Rassurer et revoir.",
          "conduite": [
            "Rassurer les parents : l'ictère va disparaître",
            "Allaiter souvent",
            "Revoir le nouveau-né au 8e et au 15e jour ; si l'ictère persiste : référer"
          ],
          "meds": [],
          "source": "Togo Ord. 6 (traitement 3)"
        }
      },
      "r_hepat": {
        "res": {
          "niveau": "attention",
          "titre": "Hépatite ou affection hépatobiliaire possible",
          "resume": "Référer.",
          "conduite": [
            "Référer pour bilan",
            "Hydratation, repos, éviter les médicaments non prescrits"
          ],
          "meds": [],
          "source": "Togo Ord. 6 (point 6)"
        }
      },
      "r_ref": {
        "res": {
          "niveau": "urgence",
          "titre": "Référer en urgence",
          "resume": "Cas non traité au centre de santé.",
          "conduite": [
            "Référer immédiatement vers l'hôpital",
            "Mettre l'enfant en position confortable, le garder au chaud, surveiller la respiration"
          ],
          "meds": [],
          "source": "Togo Ord. 6"
        }
      }
    }
  },
  {
    "id": "poids_enf",
    "groupe": "Enfant",
    "titre": "Poids anormal de l'enfant (maigreur ou obésité)",
    "sous": "Togo Ord. 7 et 8",
    "debut": "p0",
    "noeuds": {
      "p0": {
        "q": "Que présente l'enfant ?",
        "options": [
          {
            "t": "Poids trop faible, maigreur",
            "vers": "p1"
          },
          {
            "t": "Poids trop élevé (obésité)",
            "vers": "p_ob"
          }
        ]
      },
      "p1": {
        "q": "Mesures : poids/taille (Z-score), périmètre brachial (PB, dès 6 mois), œdèmes des deux pieds ?",
        "options": [
          {
            "t": "Dénutrition sévère : P/T < −3 DS, ou PB < 115 mm, ou œdèmes bilatéraux, amaigrissement visible sévère",
            "vers": "r_sev"
          },
          {
            "t": "Dénutrition modérée : P/T entre −3 DS et −2 DS",
            "vers": "r_mod"
          },
          {
            "t": "Poids bas avec d'autres signes : chercher la cause",
            "vers": "p2"
          }
        ],
        "aide": "Rechercher aussi la pâleur palmo-plantaire et les autres signes associés."
      },
      "p2": {
        "q": "Autres signes associés ?",
        "options": [
          {
            "t": "Infections répétées, parotidite, ganglions partout, gros foie ou rate, dermatose, VIH chez la mère ou la fratrie, candidose, diarrhée ou toux persistantes",
            "vers": "r_vih"
          },
          {
            "t": "Contage tuberculeux, ganglions indolores du cou",
            "vers": "r_tb"
          },
          {
            "t": "Soif, faim et urines abondantes (diabète)",
            "vers": "r_diab"
          },
          {
            "t": "Lait ou bouillie donnés avant la perte de poids (erreurs diététiques)",
            "vers": "r_diet"
          },
          {
            "t": "Diarrhée chronique, ventre ballonné (malabsorption)",
            "vers": "r_ref"
          },
          {
            "t": "Choc affectif, troubles psycho-socio-affectifs",
            "vers": "r_psy"
          },
          {
            "t": "Autres signes",
            "vers": "r_ref"
          }
        ]
      },
      "p_ob": {
        "q": "Z-score poids/taille ou IMC ?",
        "options": [
          {
            "t": "Entre +1 DS et +2 DS : risque de surpoids",
            "vers": "r_ob1"
          },
          {
            "t": "Entre +2 DS et +3 DS, ou plus de +3 DS : surpoids ou obésité",
            "vers": "r_ob2"
          }
        ],
        "aide": "Évaluer l'alimentation (aliments, horaires, boissons) et faire un TDR de la glycémie."
      },
      "r_sev": {
        "res": {
          "niveau": "urgence",
          "titre": "Dénutrition sévère",
          "resume": "Prévenir l'hypoglycémie et référer.",
          "conduite": [
            "Eau sucrée à 10 % : 4 morceaux de sucre dans 200 mL d'eau, à raison de 5 mL/kg par heure ({kg:5} mL par heure)",
            "Référer vers le CRENAS ou le CRENI",
            "Rechercher et traiter une infection associée"
          ],
          "meds": [],
          "source": "Togo Ord. 7"
        }
      },
      "r_mod": {
        "res": {
          "niveau": "attention",
          "titre": "Dénutrition modérée",
          "resume": "Conseils et référence au CRENAM.",
          "conduite": [
            "Prévenir l'hypoglycémie : eau sucrée à 10 %",
            "Référer vers le CRENAM",
            "Conseils nutritionnels aux parents"
          ],
          "meds": [],
          "source": "Togo Ord. 7"
        }
      },
      "r_vih": {
        "res": {
          "niveau": "attention",
          "titre": "Infection à VIH de l'enfant possible",
          "resume": "Référer.",
          "conduite": [
            "Référer pour dépistage et prise en charge selon le programme national"
          ],
          "meds": [],
          "source": "Togo Ord. 7"
        }
      },
      "r_tb": {
        "res": {
          "niveau": "attention",
          "titre": "Tuberculose possible",
          "resume": "Référer.",
          "conduite": [
            "Référer pour bilan et prise en charge selon le programme national"
          ],
          "meds": [],
          "source": "Togo Ord. 7"
        }
      },
      "r_diab": {
        "res": {
          "niveau": "attention",
          "titre": "Diabète de type 1 possible",
          "resume": "Référer.",
          "conduite": [
            "Faire un TDR de la glycémie",
            "Référer"
          ],
          "meds": [],
          "source": "Togo Ord. 7"
        }
      },
      "r_diet": {
        "res": {
          "niveau": "ok",
          "titre": "Erreurs diététiques",
          "resume": "Conseils nutritionnels.",
          "conduite": [
            "Conseils nutritionnels sur l'alimentation de l'enfant (allaitement, bouillie, repas équilibrés)",
            "Pas d'amélioration : référer"
          ],
          "meds": [],
          "source": "Togo Ord. 7 (traitement 6, annexe 8)"
        }
      },
      "r_psy": {
        "res": {
          "niveau": "attention",
          "titre": "Troubles psycho-socio-affectifs",
          "resume": "Rassurer et référer.",
          "conduite": [
            "Rassurer et conseiller les parents",
            "Référer"
          ],
          "meds": [],
          "source": "Togo Ord. 7"
        }
      },
      "r_ob1": {
        "res": {
          "niveau": "ok",
          "titre": "Risque de surpoids",
          "resume": "Conseils nutritionnels.",
          "conduite": [
            "Régime équilibré pauvre en sucres",
            "Repas principaux à heures fixes",
            "Activité sportive régulière",
            "Pas d'amélioration : référer"
          ],
          "meds": [],
          "source": "Togo Ord. 8"
        }
      },
      "r_ob2": {
        "res": {
          "niveau": "attention",
          "titre": "Surpoids ou obésité",
          "resume": "Référer au nutritionniste.",
          "conduite": [
            "Conseils : régime équilibré pauvre en sucres, repas à heures fixes, activité sportive",
            "Référer en pédiatrie, auprès du nutritionniste"
          ],
          "meds": [],
          "source": "Togo Ord. 8"
        }
      },
      "r_ref": {
        "res": {
          "niveau": "attention",
          "titre": "Référer pour avis spécialisé",
          "resume": "Le tableau ne correspond à aucun cas traité au centre de santé.",
          "conduite": [
            "Référer vers l'hôpital pour examen et bilan",
            "Avant le transfert : traiter la douleur ou la fièvre, hydrater, rassurer la famille"
          ],
          "meds": [
            "paracetamol"
          ],
          "source": "Togo Ord. 7"
        }
      }
    }
  },
  {
    "id": "oeil_enf",
    "groupe": "Enfant",
    "titre": "Affections de l'œil de l'enfant",
    "sous": "Togo Ord. 13",
    "debut": "o0",
    "noeuds": {
      "o0": {
        "q": "Quel tableau ?",
        "options": [
          {
            "t": "Douleur vive avec baisse brutale de la vue",
            "vers": "r_urg"
          },
          {
            "t": "Corps étranger dans l'œil",
            "vers": "r_co"
          },
          {
            "t": "Traumatisme ou produit projeté dans l'œil",
            "vers": "o1"
          },
          {
            "t": "Sécrétions purulentes, ou rougeur avec photophobie ou picotement (conjonctivite)",
            "vers": "o2"
          },
          {
            "t": "Furoncle douloureux à la base d'un cil (orgelet)",
            "vers": "r_org"
          },
          {
            "t": "Gonflement des paupières avec démangeaison (blépharite)",
            "vers": "r_bleph"
          },
          {
            "t": "Baisse progressive de la vue, œil qui sort (exophtalmie), tumeur, autres signes",
            "vers": "r_ref"
          }
        ]
      },
      "o1": {
        "q": "Que s'est-il passé ?",
        "options": [
          {
            "t": "Liquide caustique (produit chimique)",
            "vers": "r_caust"
          },
          {
            "t": "Blessure de la cornée ou plaie profonde avec baisse de la vue",
            "vers": "r_cornee"
          },
          {
            "t": "Traumatisme sans lésion ni trouble de la vue",
            "vers": "r_trauma"
          }
        ]
      },
      "o2": {
        "q": "Âge ?",
        "options": [
          {
            "t": "Nouveau-né (moins de 28 jours)",
            "vers": "algo:ist_adu#r_conj"
          },
          {
            "t": "Enfant",
            "vers": "r_conj"
          }
        ]
      },
      "r_urg": {
        "res": {
          "niveau": "urgence",
          "titre": "Glaucome aigu ou autre urgence oculaire",
          "resume": "Antalgique puis transfert.",
          "conduite": [
            "Paracétamol 15 mg/kg, soit {mg:15} mg",
            "Référer immédiatement"
          ],
          "meds": [
            "paracetamol"
          ],
          "source": "Togo Ord. 13 (point 10)"
        }
      },
      "r_co": {
        "res": {
          "niveau": "attention",
          "titre": "Corps étranger solide de l'œil",
          "resume": "Extraire s'il est visible et accessible.",
          "conduite": [
            "Si visible et accessible : l'extraire par lavage à l'eau propre",
            "Après expulsion : paracétamol ; pommade ophtalmique antibiotique 3 fois par jour pendant 3 jours",
            "Si amélioration : continuer 4 jours de plus ; sinon pansement occlusif protecteur et référer",
            "Échec de l'expulsion : paracétamol, pansement protecteur et référer"
          ],
          "meds": [
            "paracetamol",
            "pommade-ophtalmique"
          ],
          "source": "Togo Ord. 13 (traitement 2)"
        }
      },
      "r_caust": {
        "res": {
          "niveau": "urgence",
          "titre": "Projection de liquide caustique",
          "resume": "Laver abondamment.",
          "conduite": [
            "Laver à grande eau propre pendant 10 minutes",
            "Forte rougeur ou blessure : paracétamol, pommade antibiotique, pansement protecteur et référer",
            "Ni rougeur ni blessure : paracétamol, pommade 3 fois par jour et pansement protecteur pendant 3 jours ; si amélioration continuer 4 jours, sinon référer"
          ],
          "meds": [
            "paracetamol",
            "pommade-ophtalmique"
          ],
          "source": "Togo Ord. 13 (traitement 3)"
        }
      },
      "r_cornee": {
        "res": {
          "niveau": "attention",
          "titre": "Blessure de la cornée",
          "resume": "Pansement, antalgique, antibiotique, puis référer.",
          "conduite": [
            "Pansement protecteur",
            "Paracétamol 15 mg/kg ({mg:15} mg)",
            "Amoxicilline 50 mg/kg/jour en 2 prises ({mg:50} mg par jour)",
            "Référer"
          ],
          "meds": [
            "paracetamol",
            "amoxicilline"
          ],
          "source": "Togo Ord. 13 (traitement 4)"
        }
      },
      "r_trauma": {
        "res": {
          "niveau": "ok",
          "titre": "Traumatisme sans lésion",
          "resume": "Pommade et antalgique.",
          "conduite": [
            "Pommade ophtalmique antibiotique dans les deux yeux 3 fois par jour, et paracétamol, pendant 3 jours",
            "Si amélioration : continuer 4 jours de plus ; sinon référer avec le même traitement"
          ],
          "meds": [
            "pommade-ophtalmique",
            "paracetamol"
          ],
          "source": "Togo Ord. 13 (traitement 5)"
        }
      },
      "r_conj": {
        "res": {
          "niveau": "attention",
          "titre": "Conjonctivite de l'enfant",
          "resume": "Pommade antibiotique.",
          "conduite": [
            "Essuyer doucement le pus avec un tissu propre et humide",
            "Pommade ophtalmique antibiotique dans les deux yeux 3 fois par jour, jusqu'à disparition de la rougeur",
            "Ne rien mettre d'autre dans les yeux",
            "Amoxicilline 50 mg/kg/jour en 2 prises pendant 7 jours ({mg:50} mg par jour)",
            "Pas d'amélioration : référer"
          ],
          "meds": [
            "pommade-ophtalmique",
            "amoxicilline"
          ],
          "source": "Togo Ord. 13 (traitement 1)"
        }
      },
      "r_org": {
        "res": {
          "niveau": "attention",
          "titre": "Orgelet",
          "resume": "Pommade, antalgique, amoxicilline.",
          "conduite": [
            "Évacuer le pus avec une compresse",
            "Pommade ophtalmique antibiotique : 1 application matin, midi et soir",
            "Paracétamol pendant 5 jours",
            "Amoxicilline pendant 7 jours : 50 mg/kg/jour en 2 prises ({mg:50} mg par jour)",
            "Pas d'amélioration : maintenir le traitement et référer"
          ],
          "meds": [
            "pommade-ophtalmique",
            "paracetamol",
            "amoxicilline"
          ],
          "source": "Togo Ord. 13 (traitement 6)"
        }
      },
      "r_bleph": {
        "res": {
          "niveau": "attention",
          "titre": "Blépharite",
          "resume": "Pommade, antalgique, amoxicilline.",
          "conduite": [
            "Pommade ophtalmique antibiotique : 1 application matin, midi et soir",
            "Paracétamol pendant 5 jours",
            "Amoxicilline pendant 7 jours : 50 mg/kg/jour en 2 prises ({mg:50} mg par jour)",
            "Pas d'amélioration : référer avec le même traitement"
          ],
          "meds": [
            "pommade-ophtalmique",
            "paracetamol",
            "amoxicilline"
          ],
          "source": "Togo Ord. 13 (traitement 7)"
        }
      },
      "r_ref": {
        "res": {
          "niveau": "attention",
          "titre": "Référer pour avis spécialisé",
          "resume": "Le tableau ne correspond à aucun cas traité au centre de santé.",
          "conduite": [
            "Référer vers l'hôpital pour examen et bilan",
            "Avant le transfert : traiter la douleur ou la fièvre, hydrater, rassurer la famille"
          ],
          "meds": [
            "paracetamol"
          ],
          "source": "Togo Ord. 13"
        }
      }
    }
  },
  {
    "id": "urinaire_enf",
    "groupe": "Enfant",
    "titre": "Troubles urinaires et génitaux de l'enfant",
    "sous": "Togo Ord. 15",
    "debut": "u0",
    "noeuds": {
      "u0": {
        "q": "Quel problème ?",
        "options": [
          {
            "t": "Douleur ou brûlure en urinant, besoin fréquent, urines troubles, fièvre (infection urinaire)",
            "vers": "algo:fievre_enf#r_iu"
          },
          {
            "t": "Impossible d'uriner, ventre bombé (rétention)",
            "vers": "r_ret"
          },
          {
            "t": "Urines rouges en fin de miction, séjour en zone de bilharziose",
            "vers": "r_bilh"
          },
          {
            "t": "Prépuce impossible à décalotter, gonflement (phimosis)",
            "vers": "r_phim"
          },
          {
            "t": "Pas d'urines (anurie), fuites d'urine, pipi au lit (énurésie)",
            "vers": "r_ref"
          },
          {
            "t": "Urines colorées, gonflement des paupières, tension élevée (glomérulonéphrite)",
            "vers": "r_ref"
          },
          {
            "t": "Soif, faim, urines abondantes (diabète)",
            "vers": "r_ref"
          },
          {
            "t": "Malformation des organes génitaux ou des voies urinaires, vulvite, pertes",
            "vers": "r_ref"
          }
        ]
      },
      "r_ret": {
        "res": {
          "niveau": "urgence",
          "titre": "Rétention aiguë d'urine",
          "resume": "Sondage si possible puis transfert.",
          "conduite": [
            "Si possible : sondage vésical dans des conditions rigoureuses d'asepsie",
            "Calmer la douleur : paracétamol",
            "Référer"
          ],
          "meds": [
            "paracetamol"
          ],
          "source": "Togo Ord. 15 (point 2)"
        }
      },
      "r_bilh": {
        "res": {
          "niveau": "attention",
          "titre": "Bilharziose vésicale possible",
          "resume": "Praziquantel en prise unique.",
          "conduite": [
            "Praziquantel 40 mg/kg en prise unique, soit {mg:40} mg",
            "Prévention : éviter les baignades en eau douce stagnante"
          ],
          "meds": [
            "praziquantel"
          ],
          "source": "Togo Ord. 15 (traitement 6)"
        }
      },
      "r_phim": {
        "res": {
          "niveau": "attention",
          "titre": "Phimosis",
          "resume": "Circoncision.",
          "conduite": [
            "Si possible : circoncision dans des conditions rigoureuses d'asepsie",
            "Sinon référer",
            "Douleur : paracétamol"
          ],
          "meds": [
            "paracetamol"
          ],
          "source": "Togo Ord. 15 (traitement 7)"
        }
      },
      "r_ref": {
        "res": {
          "niveau": "attention",
          "titre": "Référer pour avis spécialisé",
          "resume": "Le tableau ne correspond à aucun cas traité au centre de santé.",
          "conduite": [
            "Référer vers l'hôpital pour examen et bilan",
            "Avant le transfert : traiter la douleur ou la fièvre, hydrater, rassurer la famille"
          ],
          "meds": [
            "paracetamol"
          ],
          "source": "Togo Ord. 15"
        }
      }
    }
  },
  {
    "id": "dyspnee_adu",
    "groupe": "Adulte",
    "titre": "Difficultés respiratoires (dyspnée) de l'adulte",
    "sous": "Togo Ord. 19",
    "debut": "d0",
    "noeuds": {
      "d0": {
        "q": "Quel tableau ?",
        "options": [
          {
            "t": "Dyspnée en position couchée, crachats mousseux rosés, râles crépitants (œdème aigu du poumon)",
            "vers": "r_oap"
          },
          {
            "t": "Notion de corps étranger, étouffement",
            "vers": "r_corps"
          },
          {
            "t": "Dyspnée d'effort, toux, hypertension, œdèmes des jambes, veines du cou gonflées (insuffisance cardiaque)",
            "vers": "r_ic"
          },
          {
            "t": "Dyspnée avec fièvre ≥ 38 °C, point de côté, râles crépitants (pneumonie)",
            "vers": "r_pneumo"
          },
          {
            "t": "Sifflements, râles sibilants (crise d'asthme)",
            "vers": "algo:asthme"
          },
          {
            "t": "Matité ou absence de murmure vésiculaire, point de côté (épanchement pleural)",
            "vers": "r_ref"
          },
          {
            "t": "Pâleur des muqueuses (anémie)",
            "vers": "r_ref"
          },
          {
            "t": "Autres signes",
            "vers": "r_ref"
          }
        ]
      },
      "r_oap": {
        "res": {
          "niveau": "urgence",
          "titre": "Œdème aigu du poumon",
          "resume": "Position, diurétique, transfert.",
          "conduite": [
            "Mettre le patient en position demi-assise",
            "Furosémide 20 mg : 2 ampoules en IV directe",
            "Oxygène si disponible",
            "Référer"
          ],
          "meds": [
            "furosemide"
          ],
          "source": "Togo Ord. 19 (traitement 1)"
        }
      },
      "r_corps": {
        "res": {
          "niveau": "urgence",
          "titre": "Corps étranger des voies respiratoires",
          "resume": "Manœuvre de Heimlich.",
          "conduite": [
            "Manœuvre de Heimlich : patient debout, pression brusque sur l'épigastre au moment de l'expiration",
            "Si le corps étranger ne sort pas : référer vers un centre ORL pour extraction"
          ],
          "meds": [],
          "source": "Togo Ord. 19 (traitement 2)"
        }
      },
      "r_ic": {
        "res": {
          "niveau": "urgence",
          "titre": "Insuffisance cardiaque possible",
          "resume": "Référer.",
          "conduite": [
            "Référer (insuffisance cardiaque décompensée ou non)",
            "Position demi-assise en attendant le transfert"
          ],
          "meds": [],
          "source": "Togo Ord. 19 (points 3 et 4)"
        }
      },
      "r_pneumo": {
        "res": {
          "niveau": "urgence",
          "titre": "Pneumonie avec signe de gravité",
          "resume": "Ceftriaxone puis transfert.",
          "conduite": [
            "Ceftriaxone 2 g en IM ou IV directe",
            "Paracétamol si fièvre",
            "Référer"
          ],
          "meds": [
            "ceftriaxone",
            "paracetamol"
          ],
          "source": "Togo Ord. 19 (traitement 5)"
        }
      },
      "r_ref": {
        "res": {
          "niveau": "urgence",
          "titre": "Référer en urgence",
          "resume": "Cas non traité au centre de santé.",
          "conduite": [
            "Référer immédiatement vers l'hôpital",
            "Poser une voie veineuse si possible, surveiller le pouls, la tension et la respiration"
          ],
          "meds": [],
          "source": "Togo Ord. 19"
        }
      }
    }
  },
  {
    "id": "convuls_adu",
    "groupe": "Adulte",
    "titre": "Convulsions de l'adulte",
    "sous": "Togo Ord. 20",
    "debut": "a0",
    "noeuds": {
      "a0": {
        "q": "Le patient convulse-t-il en ce moment ?",
        "options": [
          {
            "t": "Oui, crise en cours",
            "vers": "r_crise"
          },
          {
            "t": "Non, la crise est terminée",
            "vers": "a1"
          }
        ]
      },
      "r_crise": {
        "res": {
          "niveau": "urgence",
          "titre": "Crise convulsive en cours",
          "resume": "Protéger le patient, arrêter la crise, chercher la cause.",
          "conduite": [
            "Placer le patient sur le côté, tête en extension, ne rien mettre dans la bouche, aspirer les sécrétions",
            "Diazépam 10 mg en IM (10 à 20 mg si épilepsie connue)",
            "Glycémie capillaire et TDR du paludisme",
            "Chercher la cause (bouton ci-dessous)"
          ],
          "meds": [
            "diazepam"
          ],
          "source": "Togo Ord. 16 (traitement 2) et Ord. 20",
          "liens": [
            {
              "t": "Chercher la cause des convulsions",
              "vers": "algo:convuls_adu#a1"
            }
          ]
        }
      },
      "a1": {
        "q": "Quel tableau ?",
        "options": [
          {
            "t": "Raideur de la nuque, fièvre ≥ 38 °C, céphalées, vomissements",
            "vers": "algo:fievre_adu#r_mening"
          },
          {
            "t": "Trouble de la conscience, TDR ou goutte épaisse positif (paludisme grave)",
            "vers": "algo:fievre_adu#r_grave"
          },
          {
            "t": "Perte d'urine, morsure de langue, chute brutale (épilepsie)",
            "vers": "r_epil"
          },
          {
            "t": "Femme enceinte en fin de grossesse, en travail ou en suites de couches, avec tension élevée ou œdèmes (éclampsie)",
            "vers": "r_eclampsie"
          },
          {
            "t": "Hypoglycémie suspectée (sueurs, jeûne, diabétique traité)",
            "vers": "r_hypo"
          },
          {
            "t": "Prise de produit toxique, douleurs abdominales",
            "vers": "algo:intoxication"
          },
          {
            "t": "Crispation des doigts (main d'accoucheur), contractures douloureuses des mains",
            "vers": "r_hypocalc"
          },
          {
            "t": "Autres signes",
            "vers": "r_ref"
          }
        ]
      },
      "r_epil": {
        "res": {
          "niveau": "attention",
          "titre": "Épilepsie possible",
          "resume": "Arrêter la crise puis référer.",
          "conduite": [
            "Diazépam 10 à 20 mg en IM",
            "Traitement de fond : phénobarbital 100 mg, 1 comprimé le soir pendant 2 à 3 ans, après avis du médecin",
            "Référer pour bilan clinique et paraclinique complet"
          ],
          "meds": [
            "diazepam",
            "phenobarbital"
          ],
          "source": "Togo Ord. 20 (traitement 3)"
        }
      },
      "r_eclampsie": {
        "res": {
          "niveau": "urgence",
          "titre": "Éclampsie",
          "resume": "Sulfate de magnésium puis transfert.",
          "conduite": [
            "Allonger la femme dans un endroit calme, en décubitus latéral gauche ; maintenir les voies respiratoires dégagées ; mettre un rouleau de tissu propre entre les dents pour éviter la morsure de la langue (sans forcer)",
            "1re intention : sulfate de magnésium 4 g à 20 % en IV en 5 minutes, puis 5 g en IM profonde dans chaque fesse (10 g) avec 1 mL de lidocaïne à 2 %",
            "Entretien : 5 g IM profonde + 1 mL de lidocaïne toutes les 4 heures, en alternant les fesses, jusqu'à 24 heures après la dernière convulsion ou l'accouchement",
            "Avant chaque dose : respiration ≥ 16 par minute, réflexes rotuliens présents, diurèse conservée",
            "2e intention : diazépam 10 mg en IV directe pendant 2 minutes, puis perfusion de sérum glucosé isotonique contenant 3 ampoules de diazépam, et 1 ampoule de Catapressan (clonidine) 0,15 mg/mL, 1 mL en IM",
            "Rechercher les signes de travail : si le travail est avancé, accoucher puis référer ; sinon référer",
            "Dans tous les cas, référer"
          ],
          "meds": [
            "sulfate-magnesium",
            "diazepam"
          ],
          "source": "Togo Ord. 20 (traitement 5)"
        }
      },
      "r_hypo": {
        "res": {
          "niveau": "urgence",
          "titre": "Hypoglycémie",
          "resume": "Sucre immédiatement.",
          "conduite": [
            "Patient conscient : deux morceaux de sucre par la bouche",
            "Sinon : SGH 10 % 500 mL en perfusion rapide",
            "Surveiller la glycémie"
          ],
          "meds": [
            "sgh10"
          ],
          "source": "Togo Ord. 20 (traitement 4)"
        }
      },
      "r_hypocalc": {
        "res": {
          "niveau": "urgence",
          "titre": "Hypocalcémie (tétanie)",
          "resume": "Calcium puis transfert.",
          "conduite": [
            "Gluconate de calcium : 1 ampoule dans 20 mL de SGI en perfusion lente",
            "Référer"
          ],
          "meds": [
            "gluconate-calcium"
          ],
          "source": "Togo Ord. 20 (traitement 7)"
        }
      },
      "r_ref": {
        "res": {
          "niveau": "urgence",
          "titre": "Référer en urgence",
          "resume": "Cas non traité au centre de santé.",
          "conduite": [
            "Référer immédiatement vers l'hôpital",
            "Poser une voie veineuse si possible, surveiller le pouls, la tension et la respiration"
          ],
          "meds": [],
          "source": "Togo Ord. 20 (encéphalite, tumeur ou abcès cérébral possibles)"
        }
      }
    }
  },
  {
    "id": "ictere_adu",
    "groupe": "Adulte",
    "titre": "Ictère (jaunisse) de l'adulte",
    "sous": "Togo Ord. 21",
    "debut": "i0",
    "noeuds": {
      "i0": {
        "q": "Quel tableau ?",
        "options": [
          {
            "t": "Fièvre ≥ 38 °C, yeux injectés de sang, courbatures, peu ou pas d'urines, vomissements de sang noir, délire (fièvre jaune)",
            "vers": "r_jaune"
          },
          {
            "t": "Céphalées, frissons, courbatures, ± trouble de la conscience, TDR ou goutte épaisse positif (paludisme grave)",
            "vers": "algo:fievre_adu#r_grave"
          },
          {
            "t": "Fatigue, légère douleur sous les côtes à droite, syndrome grippal, vomissements (hépatite virale)",
            "vers": "r_hepat"
          },
          {
            "t": "Prise de quinine suivie d'urines « coca-cola », fièvre (fièvre bilieuse hémoglobinurique)",
            "vers": "r_fbh"
          },
          {
            "t": "Douleurs articulaires ou musculaires, antécédents de drépanocytose",
            "vers": "algo:drepano"
          },
          {
            "t": "Douleur très vive sous les côtes à droite (cholécystite, abcès du foie)",
            "vers": "r_ref"
          },
          {
            "t": "Ictère indolore, œdèmes des jambes, ascite (cirrhose)",
            "vers": "r_ref"
          },
          {
            "t": "Gros foie dur, altération de l'état général (cancer du foie)",
            "vers": "r_ref"
          },
          {
            "t": "Selles décolorées, démangeaisons intenses, altération de l'état général (cancer du pancréas)",
            "vers": "r_ref"
          },
          {
            "t": "Prise de sulfamides ou de produit toxique (hépatite toxique, hémolyse)",
            "vers": "r_ref"
          },
          {
            "t": "Autres signes (pancréatite…)",
            "vers": "r_ref"
          }
        ]
      },
      "r_jaune": {
        "res": {
          "niveau": "urgence",
          "titre": "Fièvre jaune possible",
          "resume": "Alerter, isoler, traitement symptomatique, transfert.",
          "conduite": [
            "Alerter immédiatement l'échelon supérieur",
            "Isoler le malade sous moustiquaire",
            "Traitement symptomatique : paracétamol (éviter l'aspirine, risque hémorragique), réhydratation",
            "Gluconate de calcium 1 à 2 g par jour en IV pour prévenir le risque hémorragique",
            "Mesures d'hygiène ; référer"
          ],
          "meds": [
            "paracetamol",
            "gluconate-calcium"
          ],
          "source": "Togo Ord. 21 (traitement 1)"
        }
      },
      "r_hepat": {
        "res": {
          "niveau": "attention",
          "titre": "Hépatite virale probable",
          "resume": "Mesures simples, surveillance quotidienne.",
          "conduite": [
            "Conseils d'hygiène : ne pas partager rasoirs, brosses à dents ni objets souillés de sang ; se laver les mains après les selles",
            "Repos au lit, bien manger (légumes, fruits)",
            "Proscrire l'alcool, les aliments gras et tout médicament non prescrit",
            "Vomissements plus de 3 fois par jour : métoclopramide 1 ampoule en IM ou IV, 2 à 3 fois par jour",
            "Vitamine C 1000 mg par jour",
            "Vomissements plus de 3 fois par jour : perfusion de SGI 500 mL, 2 flacons par jour, et 1 flacon de sérum salé par jour",
            "Revoir le malade tous les jours ; si amélioré après 7 jours, continuer 2 semaines ; sinon référer"
          ],
          "meds": [
            "metoclopramide"
          ],
          "source": "Togo Ord. 21 (traitement 3)"
        }
      },
      "r_fbh": {
        "res": {
          "niveau": "urgence",
          "titre": "Fièvre bilieuse hémoglobinurique",
          "resume": "Arrêter la quinine et transférer.",
          "conduite": [
            "Arrêter immédiatement la quinine et tout autre médicament",
            "Référer en urgence (hémolyse et insuffisance rénale aiguë)",
            "Expliquer au malade et à sa famille qu'il ne devra plus jamais prendre de quinine ; noter l'intolérance sur son carnet"
          ],
          "meds": [],
          "source": "Togo Ord. 21 (traitement 5)"
        }
      },
      "r_ref": {
        "res": {
          "niveau": "urgence",
          "titre": "Référer en urgence",
          "resume": "Cas non traité au centre de santé.",
          "conduite": [
            "Référer immédiatement vers l'hôpital",
            "Poser une voie veineuse si possible, surveiller le pouls, la tension et la respiration"
          ],
          "meds": [],
          "source": "Togo Ord. 21"
        }
      }
    }
  },
  {
    "id": "amaigrissement",
    "groupe": "Adulte",
    "titre": "Amaigrissement",
    "sous": "Togo Ord. 22",
    "debut": "m0",
    "noeuds": {
      "m0": {
        "q": "Quel tableau ?",
        "options": [
          {
            "t": "Boit beaucoup, urine beaucoup (plus de 3 fois la nuit), mange beaucoup (diabète)",
            "vers": "r_diab"
          },
          {
            "t": "Toux chronique, diarrhée chronique, démangeaisons généralisées, zona récidivant, sérologie VIH positive",
            "vers": "r_vih"
          },
          {
            "t": "Toux de plus de 2 semaines, crachats, sueurs nocturnes (tuberculose)",
            "vers": "r_tb"
          },
          {
            "t": "Palpitations, nervosité, exophtalmie (hyperthyroïdie)",
            "vers": "r_ref"
          },
          {
            "t": "Alimentation insuffisante, malnutrition, tristesse (dépression)",
            "vers": "r_ref"
          },
          {
            "t": "Vomissements après les repas (sténose du pylore)",
            "vers": "r_ref"
          },
          {
            "t": "Masse, altération de l'état général (cancer)",
            "vers": "r_ref"
          },
          {
            "t": "Autres signes",
            "vers": "r_ref"
          }
        ],
        "aide": "Perte de poids involontaire d'au moins 5 % du poids initial."
      },
      "r_diab": {
        "res": {
          "niveau": "attention",
          "titre": "Diabète possible",
          "resume": "Glycémie et transfert.",
          "conduite": [
            "Faire une glycémie capillaire",
            "Référer pour confirmation et prise en charge"
          ],
          "meds": [],
          "source": "Togo Ord. 22 (point 1)",
          "liens": [
            {
              "t": "Prise en charge du diabète",
              "vers": "algo:diabete"
            }
          ]
        }
      },
      "r_vih": {
        "res": {
          "niveau": "attention",
          "titre": "VIH/sida possible",
          "resume": "Dépistage et programme national.",
          "conduite": [
            "Proposer le dépistage VIH",
            "Prise en charge selon les directives du programme national de lutte contre le sida (PNLS)"
          ],
          "meds": [],
          "source": "Togo Ord. 22 (point 2)"
        }
      },
      "r_tb": {
        "res": {
          "niveau": "attention",
          "titre": "Tuberculose possible",
          "resume": "Programme national.",
          "conduite": [
            "Prise en charge selon les directives du programme national de lutte contre la tuberculose (PNLT)",
            "Orienter vers le centre de dépistage et de traitement de la tuberculose"
          ],
          "meds": [],
          "source": "Togo Ord. 22 (point 7)"
        }
      },
      "r_ref": {
        "res": {
          "niveau": "attention",
          "titre": "Référer pour avis spécialisé",
          "resume": "Le tableau ne correspond à aucun cas traité au centre de santé.",
          "conduite": [
            "Référer vers l'hôpital pour examen et bilan",
            "Avant le transfert : traiter la douleur ou la fièvre, hydrater, rassurer le patient"
          ],
          "meds": [
            "paracetamol"
          ],
          "source": "Togo Ord. 22"
        }
      }
    }
  },
  {
    "id": "bas_ventre_f",
    "groupe": "Adulte",
    "titre": "Douleurs du bas-ventre chez la femme",
    "sous": "Togo Ord. 24",
    "debut": "b0",
    "noeuds": {
      "b0": {
        "q": "Retard de règles ou saignement vaginal ?",
        "options": [
          {
            "t": "Oui",
            "vers": "b1"
          },
          {
            "t": "Non",
            "vers": "b5"
          }
        ],
        "aide": "Dans tous les cas : demander l'âge et la date des dernières règles, prendre le pouls et la tension."
      },
      "b1": {
        "q": "Quel tableau ?",
        "options": [
          {
            "t": "Ventre mou, « cri de l'ombilic », toucher vaginal très douloureux, état de choc (GEU rompue)",
            "vers": "r_geur"
          },
          {
            "t": "Col fermé, utérus petit, masse douloureuse mobile à côté de l'utérus (GEU non rompue)",
            "vers": "r_geu"
          },
          {
            "t": "Col plus ou moins fermé, utérus augmenté de volume (menace d'avortement)",
            "vers": "r_menace"
          },
          {
            "t": "Col entrouvert, œuf dans le col (avortement en cours, incomplet, ou tentative d'IVG)",
            "vers": "r_avort"
          },
          {
            "t": "Autre tableau",
            "vers": "b5"
          }
        ]
      },
      "b5": {
        "q": "Quel tableau ?",
        "options": [
          {
            "t": "Douleur de la fosse iliaque droite avec fièvre, défense (appendicite)",
            "vers": "r_ref_urg"
          },
          {
            "t": "Fièvre ≥ 38 °C, pertes malodorantes, utérus gros et mou (endométrite)",
            "vers": "r_endo"
          },
          {
            "t": "Défense du bas-ventre, fièvre (pelvipéritonite)",
            "vers": "r_ref_urg"
          },
          {
            "t": "Fièvre, fibrome connu, gros utérus irrégulier et douloureux (fibrome en nécrobiose)",
            "vers": "r_fibrome"
          },
          {
            "t": "Douleur vive et brutale, nausées, vomissements, masse douloureuse (torsion d'organe pelvien)",
            "vers": "r_ref_urg"
          },
          {
            "t": "Pas d'urines, globe vésical (rétention aiguë)",
            "vers": "r_ret"
          },
          {
            "t": "Douleur au niveau d'un orifice herniaire avec tuméfaction réductible",
            "vers": "r_hernie_ne"
          },
          {
            "t": "Douleur au niveau d'un orifice herniaire avec tuméfaction non réductible",
            "vers": "r_hernie_e"
          },
          {
            "t": "Brûlures en urinant, besoin fréquent (cystite)",
            "vers": "algo:urinaire_adu#r_cystite"
          },
          {
            "t": "Règles douloureuses (dysménorrhée)",
            "vers": "r_dysmen"
          },
          {
            "t": "Autres signes",
            "vers": "r_ref"
          }
        ]
      },
      "r_geur": {
        "res": {
          "niveau": "urgence",
          "titre": "Grossesse extra-utérine rompue",
          "resume": "Transfert immédiat.",
          "conduite": [
            "Poser un abord veineux (Ringer lactate ou sérum salé ; macromolécules si disponibles)",
            "Référer immédiatement"
          ],
          "meds": [],
          "source": "Togo Ord. 24 (traitement 1)"
        }
      },
      "r_geu": {
        "res": {
          "niveau": "urgence",
          "titre": "Grossesse extra-utérine non rompue",
          "resume": "Transfert.",
          "conduite": [
            "Référer, avec abord veineux si possible"
          ],
          "meds": [],
          "source": "Togo Ord. 24 (traitement 2)"
        }
      },
      "r_menace": {
        "res": {
          "niveau": "attention",
          "titre": "Menace d'avortement",
          "resume": "Repos et diazépam.",
          "conduite": [
            "Repos au lit, garniture propre",
            "Diazépam : 1 comprimé de 5 mg matin et soir, ou 1 ampoule de 10 mg en IM matin et soir",
            "Si amélioration : continuer 5 jours ; si les troubles persistent ou s'aggravent : référer"
          ],
          "meds": [
            "diazepam"
          ],
          "source": "Togo Ord. 24 (traitement 3)"
        }
      },
      "r_avort": {
        "res": {
          "niveau": "attention",
          "titre": "Avortement incomplet ou en cours",
          "resume": "Vider l'utérus si possible, sinon transférer.",
          "conduite": [
            "Curage digital si le col est assez ouvert, ou AMIU, ou curetage si faisable au centre",
            "Sinon : référer avec garniture propre, et abord veineux si tension basse (systolique < 100 mmHg)",
            "Rechercher des vésicules de môle dans le produit expulsé : si présentes, référer",
            "Référer aussi si l'hémorragie persiste après le geste",
            "Après le geste : amoxicilline 500 mg, 2 comprimés matin et soir pendant 7 jours, ou cotrimoxazole 480 mg, 2 comprimés matin et soir pendant 7 jours",
            "Paracétamol 1 g, 2 à 3 fois par jour si besoin",
            "Revoir après 24 heures"
          ],
          "meds": [
            "amoxicilline",
            "cotrimoxazole",
            "paracetamol"
          ],
          "source": "Togo Ord. 24 (traitement 4)"
        }
      },
      "r_endo": {
        "res": {
          "niveau": "attention",
          "titre": "Endométrite",
          "resume": "Antibiotiques et contrôle à 3 jours.",
          "conduite": [
            "Amoxicilline 500 mg : 2 comprimés matin et soir pendant 10 jours",
            "Métronidazole 250 mg : 2 comprimés matin et soir pendant 10 jours",
            "Ibuprofène 400 mg : 2 comprimés matin et soir au repas",
            "Revoir après 3 jours : si amélioré, poursuivre jusqu'au terme ; sinon référer"
          ],
          "meds": [
            "amoxicilline",
            "metronidazole",
            "ibuprofene"
          ],
          "source": "Togo Ord. 24 (traitement 6)"
        }
      },
      "r_fibrome": {
        "res": {
          "niveau": "attention",
          "titre": "Fibrome en nécrobiose",
          "resume": "Anti-inflammatoire, antispasmodique, glace, transfert.",
          "conduite": [
            "Ibuprofène 800 mg matin et soir au cours des repas",
            "Hyoscine ou autre antispasmodique, injectable ou oral, pour calmer la douleur",
            "Vessie de glace, puis référer"
          ],
          "meds": [
            "ibuprofene"
          ],
          "source": "Togo Ord. 24 (traitement 8)"
        }
      },
      "r_dysmen": {
        "res": {
          "niveau": "attention",
          "titre": "Dysménorrhée",
          "resume": "Antispasmodique et anti-inflammatoire.",
          "conduite": [
            "Pendant les règles : butylscopolamine 20 mg, 3 fois par jour pendant 3 jours",
            "Ibuprofène 800 mg matin et soir au cours des repas, pendant les 3 jours précédant les règles, pendant 3 mois",
            "Pas d'amélioration : référer"
          ],
          "meds": [
            "ibuprofene"
          ],
          "source": "Togo Ord. 24 (traitement 14)"
        }
      },
      "r_ret": {
        "res": {
          "niveau": "urgence",
          "titre": "Rétention aiguë d'urine",
          "resume": "Sondage si possible puis transfert.",
          "conduite": [
            "Si possible : sondage vésical dans des conditions rigoureuses d'asepsie",
            "Référer"
          ],
          "meds": [],
          "source": "Togo Ord. 24 (traitement 10)"
        }
      },
      "r_hernie_ne": {
        "res": {
          "niveau": "attention",
          "titre": "Hernie non étranglée",
          "resume": "Expliquer et conseiller la chirurgie.",
          "conduite": [
            "Donner des explications au patient et conseiller l'intervention chirurgicale",
            "Référer"
          ],
          "meds": [],
          "source": "Togo Ord. 24 (traitement 11)"
        }
      },
      "r_hernie_e": {
        "res": {
          "niveau": "urgence",
          "titre": "Hernie étranglée",
          "resume": "Diazépam puis transfert en urgence.",
          "conduite": [
            "Diazépam : 1 ampoule (10 mg) en IM",
            "Référer immédiatement"
          ],
          "meds": [
            "diazepam"
          ],
          "source": "Togo Ord. 24 (traitement 12)"
        }
      },
      "r_ref_urg": {
        "res": {
          "niveau": "urgence",
          "titre": "Urgence abdominale chirurgicale ou gynécologique",
          "resume": "Transfert en urgence.",
          "conduite": [
            "Référer immédiatement vers l'hôpital",
            "Poser une voie veineuse, ne rien donner par la bouche"
          ],
          "meds": [],
          "source": "Togo Ord. 24 (appendicite, pelvipéritonite, torsion)"
        }
      },
      "r_ref": {
        "res": {
          "niveau": "attention",
          "titre": "Référer pour avis spécialisé",
          "resume": "Le tableau ne correspond à aucun cas traité au centre de santé.",
          "conduite": [
            "Référer vers l'hôpital pour examen et bilan",
            "Avant le transfert : traiter la douleur ou la fièvre, hydrater, rassurer le patient"
          ],
          "meds": [
            "paracetamol"
          ],
          "source": "Togo Ord. 24"
        }
      }
    }
  },
  {
    "id": "saignement_vag",
    "groupe": "Adulte",
    "titre": "Saignement vaginal (écoulement vaginal rouge)",
    "sous": "Togo Ord. 25",
    "debut": "s0",
    "noeuds": {
      "s0": {
        "q": "Douleurs du bas-ventre avec retard de règles ?",
        "options": [
          {
            "t": "Oui",
            "vers": "algo:bas_ventre_f#b1"
          },
          {
            "t": "Non",
            "vers": "s1"
          }
        ],
        "aide": "Saignement en dehors des règles et en dehors de l'accouchement. Demander l'âge, la date des dernières règles, la durée et l'abondance ; prendre le pouls et la tension."
      },
      "s1": {
        "q": "Quel tableau ?",
        "options": [
          {
            "t": "Grossesse d'environ 6 mois, utérus dur en permanence et douloureux, ± sang noir (décollement placentaire)",
            "vers": "r_dppni"
          },
          {
            "t": "Grossesse avancée, utérus souple et indolore, sang rouge (placenta praevia)",
            "vers": "r_pp"
          },
          {
            "t": "Saignement provoqué par un rapport sexuel ou la toilette intime (cancer du col)",
            "vers": "r_cancer"
          },
          {
            "t": "Traumatisme, produit caustique dans le vagin, rapport sexuel violent, viol",
            "vers": "r_plaie"
          },
          {
            "t": "Femme ménopausée, pertes fétides (cancer de l'endomètre)",
            "vers": "r_cancer"
          },
          {
            "t": "Autres signes",
            "vers": "r_ref"
          }
        ]
      },
      "r_dppni": {
        "res": {
          "niveau": "urgence",
          "titre": "Décollement prématuré du placenta",
          "resume": "Transfert immédiat.",
          "conduite": [
            "Référer avec une garniture propre et un abord veineux si possible"
          ],
          "meds": [],
          "source": "Togo Ord. 25 (traitement 5)"
        }
      },
      "r_pp": {
        "res": {
          "niveau": "urgence",
          "titre": "Placenta praevia hémorragique",
          "resume": "Transfert, éviter les touchers répétés.",
          "conduite": [
            "Référer si le col est fermé ou les membranes inaccessibles",
            "Membranes accessibles : les rompre largement",
            "Éviter les touchers vaginaux répétés",
            "Si les saignements persistent : référer avec une garniture propre et un abord veineux"
          ],
          "meds": [],
          "source": "Togo Ord. 25 (traitement 6)"
        }
      },
      "r_cancer": {
        "res": {
          "niveau": "urgence",
          "titre": "Cancer du col ou de l'endomètre possible",
          "resume": "Transfert.",
          "conduite": [
            "Référer (tamponnement vaginal si hémorragie importante)"
          ],
          "meds": [],
          "source": "Togo Ord. 25 (traitements 7 et 9)"
        }
      },
      "r_plaie": {
        "res": {
          "niveau": "attention",
          "titre": "Plaie vulvo-vaginale ou perforation",
          "resume": "Suture, antibiotique, antalgique.",
          "conduite": [
            "Suture au fil résorbable si possible et soins locaux quotidiens ; sinon référer",
            "Amoxicilline 500 mg : 2 comprimés matin et soir pendant 7 jours, ou cotrimoxazole 480 mg : 2 comprimés matin et soir pendant 7 jours",
            "Ibuprofène 800 mg matin et soir au cours des repas pendant 5 jours",
            "Viol : référer (sérologie VIH, antigène HBs, prévention après exposition, contraception d'urgence, soutien psychosocial)",
            "Perforation du Douglas ou produit caustique : référer"
          ],
          "meds": [
            "amoxicilline",
            "cotrimoxazole",
            "ibuprofene"
          ],
          "source": "Togo Ord. 25 (traitement 8)"
        }
      },
      "r_ref": {
        "res": {
          "niveau": "urgence",
          "titre": "Référer en urgence",
          "resume": "Cas non traité au centre de santé.",
          "conduite": [
            "Référer immédiatement vers l'hôpital",
            "Poser une voie veineuse si possible, surveiller le pouls, la tension et la respiration"
          ],
          "meds": [],
          "source": "Togo Ord. 25"
        }
      }
    }
  },
  {
    "id": "regles",
    "groupe": "Adulte",
    "titre": "Troubles des règles",
    "sous": "Togo Ord. 28",
    "debut": "r0",
    "noeuds": {
      "r0": {
        "q": "Quel tableau ?",
        "options": [
          {
            "t": "Jamais eu de règles, moins de 17 ans",
            "vers": "r_amen"
          },
          {
            "t": "Jamais eu de règles, plus de 17 ans",
            "vers": "r_ref"
          },
          {
            "t": "Douleurs périodiques, masse au bas-ventre, hymen imperforé",
            "vers": "r_ref"
          },
          {
            "t": "Absence de règles depuis plus de 6 semaines avec signes de grossesse",
            "vers": "r_gross"
          },
          {
            "t": "Femme qui allaite, sans signe de grossesse",
            "vers": "r_pf"
          },
          {
            "t": "Femme sous contraceptifs",
            "vers": "r_pf"
          },
          {
            "t": "Femme de plus de 45 ans",
            "vers": "r_meno"
          },
          {
            "t": "Règles douloureuses (plus de 3 fois en 6 mois)",
            "vers": "r_dysmen"
          },
          {
            "t": "Règles de plus de 6 jours, très abondantes avec caillots (fibrome)",
            "vers": "r_ref"
          },
          {
            "t": "Saignement avec arrêt des règles et masse à côté de l'utérus (GEU)",
            "vers": "algo:bas_ventre_f#r_geu"
          },
          {
            "t": "Saignement sous contraceptifs hormonaux ou DIU, ou après la ménopause",
            "vers": "r_ref"
          },
          {
            "t": "Autres signes",
            "vers": "r_ref"
          }
        ]
      },
      "r_amen": {
        "res": {
          "niveau": "ok",
          "titre": "Aménorrhée primaire avant 17 ans",
          "resume": "Rassurer.",
          "conduite": [
            "Rassurer la patiente",
            "Revoir si les règles n'apparaissent pas après 17 ans"
          ],
          "meds": [],
          "source": "Togo Ord. 28 (traitement 1)"
        }
      },
      "r_gross": {
        "res": {
          "niveau": "ok",
          "titre": "Grossesse",
          "resume": "Consultation prénatale.",
          "conduite": [
            "Diriger vers la consultation prénatale (CPN)"
          ],
          "meds": [],
          "source": "Togo Ord. 28 (traitements 4 et 6)"
        }
      },
      "r_pf": {
        "res": {
          "niveau": "ok",
          "titre": "Allaitement ou contraception sans grossesse",
          "resume": "Planification familiale.",
          "conduite": [
            "Diriger vers le service de planification familiale"
          ],
          "meds": [],
          "source": "Togo Ord. 28 (traitements 5 et 7)"
        }
      },
      "r_meno": {
        "res": {
          "niveau": "ok",
          "titre": "Préménopause ou ménopause",
          "resume": "Rassurer.",
          "conduite": [
            "Conseiller et rassurer"
          ],
          "meds": [],
          "source": "Togo Ord. 28 (traitement 8)"
        }
      },
      "r_dysmen": {
        "res": {
          "niveau": "attention",
          "titre": "Dysménorrhée",
          "resume": "Antispasmodique et anti-inflammatoire.",
          "conduite": [
            "Butylscopolamine 20 mg, 3 fois par jour pendant la durée des règles",
            "Ibuprofène 800 mg matin et soir au cours des repas pendant 3 cycles",
            "Rendez-vous après 3 cycles : si amélioration, continuer ; sinon référer"
          ],
          "meds": [
            "ibuprofene"
          ],
          "source": "Togo Ord. 28 (traitement 9)"
        }
      },
      "r_ref": {
        "res": {
          "niveau": "attention",
          "titre": "Référer pour avis spécialisé",
          "resume": "Le tableau ne correspond à aucun cas traité au centre de santé.",
          "conduite": [
            "Référer vers l'hôpital pour examen et bilan",
            "Avant le transfert : traiter la douleur ou la fièvre, hydrater, rassurer le patient"
          ],
          "meds": [
            "paracetamol"
          ],
          "source": "Togo Ord. 28"
        }
      }
    }
  },
  {
    "id": "sein",
    "groupe": "Adulte",
    "titre": "Masse dans le sein",
    "sous": "Togo Ord. 29",
    "debut": "s0",
    "noeuds": {
      "s0": {
        "q": "Quel tableau ?",
        "options": [
          {
            "t": "Peau d'orange, gros ganglions sous l'aisselle, augmentation de volume, fièvre (mastite carcinomateuse)",
            "vers": "r_ref"
          },
          {
            "t": "Femme qui allaite, sein chaud, rouge, douloureux, ganglion (mastite non suppurée)",
            "vers": "r_mastite"
          },
          {
            "t": "Zone fluctuante, ganglion sous l'aisselle (mastite suppurée, abcès)",
            "vers": "r_abces"
          },
          {
            "t": "Boule isolée, indolore, ou autre signe (tumeur)",
            "vers": "r_ref"
          }
        ]
      },
      "r_mastite": {
        "res": {
          "niveau": "attention",
          "titre": "Mastite non suppurée",
          "resume": "Antibiotiques et vidange du sein.",
          "conduite": [
            "Amoxicilline 1 g par voie orale matin et soir pendant 10 jours",
            "Métronidazole 500 mg : 1 comprimé matin, midi et soir pendant 10 jours",
            "Paracétamol (ou aspirine 500 mg, 2 comprimés matin et soir pendant 3 jours)",
            "Vider le sein si la femme allaite",
            "Si amélioration après 3 jours : continuer ; sinon référer"
          ],
          "meds": [
            "amoxicilline",
            "metronidazole",
            "paracetamol"
          ],
          "source": "Togo Ord. 29 (traitement 2A)"
        }
      },
      "r_abces": {
        "res": {
          "niveau": "attention",
          "titre": "Mastite suppurée (abcès du sein)",
          "resume": "Drainage et antibiotiques.",
          "conduite": [
            "Incision et drainage",
            "Même traitement que pour la mastite non suppurée : amoxicilline 1 g matin et soir et métronidazole 500 mg 3 fois par jour pendant 10 jours, antalgique",
            "Vider le sein si la femme allaite",
            "Pas d'amélioration après 3 jours : référer"
          ],
          "meds": [
            "amoxicilline",
            "metronidazole",
            "paracetamol"
          ],
          "source": "Togo Ord. 29 (traitement 2B)"
        }
      },
      "r_ref": {
        "res": {
          "niveau": "attention",
          "titre": "Référer pour avis spécialisé",
          "resume": "Le tableau ne correspond à aucun cas traité au centre de santé.",
          "conduite": [
            "Référer vers l'hôpital pour examen et bilan",
            "Avant le transfert : traiter la douleur ou la fièvre, hydrater, rassurer le patient"
          ],
          "meds": [
            "paracetamol"
          ],
          "source": "Togo Ord. 29"
        }
      }
    }
  },
  {
    "id": "post_partum",
    "groupe": "Adulte",
    "titre": "Hémorragie après l'accouchement",
    "sous": "Togo Ord. 30",
    "debut": "h0",
    "noeuds": {
      "h0": {
        "q": "Que constate-t-on ?",
        "options": [
          {
            "t": "Placenta non expulsé, utérus gros et mou (rétention placentaire)",
            "vers": "r_ret_tot"
          },
          {
            "t": "Placenta expulsé mais incomplet : membranes ou cotylédons manquants",
            "vers": "r_ret_cot"
          },
          {
            "t": "Placenta expulsé, pas de globe de sécurité, utérus mou (atonie utérine)",
            "vers": "r_atonie"
          },
          {
            "t": "Utérus bien contracté mais saignement continu : déchirure du périnée, du col ou du vagin, plaie du clitoris, rupture utérine",
            "vers": "r_trauma"
          },
          {
            "t": "Saignement fluide, sans caillots, qui ne coagule pas (CIVD)",
            "vers": "r_civd"
          },
          {
            "t": "Autres signes",
            "vers": "r_ref"
          }
        ],
        "aide": "Dans tous les cas : prendre la tension et le pouls ; vider la vessie (sonde de Foley à demeure si possible) ; masser l'utérus ; si tension systolique < 100 mmHg : perfusion de Ringer lactate, de sérum salé ou de macromolécules. Après l'arrêt : garniture propre, surveiller 2 heures l'état général, la tension, le pouls, la garniture et le globe de sécurité."
      },
      "r_ret_tot": {
        "res": {
          "niveau": "urgence",
          "titre": "Rétention placentaire",
          "resume": "Délivrance artificielle puis ocytocine.",
          "conduite": [
            "Faire la délivrance artificielle et la révision utérine",
            "Ocytocine : 1 ampoule en IV directe",
            "Si l'hémorragie persiste : référer immédiatement",
            "Suites de couches : cotrimoxazole 480 mg, 2 comprimés matin et soir pendant 7 jours (si elle allaite : amoxicilline 1 g matin et soir pendant 7 jours)",
            "Fer + acide folique : 2 comprimés, 2 fois par jour pendant 2 mois"
          ],
          "meds": [
            "ocytocine",
            "cotrimoxazole",
            "amoxicilline"
          ],
          "source": "Togo Ord. 30 (traitement 2)"
        }
      },
      "r_ret_cot": {
        "res": {
          "niveau": "urgence",
          "titre": "Rétention de membranes ou de cotylédons",
          "resume": "Révision utérine puis ocytocine.",
          "conduite": [
            "Faire une révision utérine, puis ocytocine 1 ampoule en IV directe",
            "Si l'hémorragie persiste : référer immédiatement",
            "Suites de couches : cotrimoxazole 480 mg, 2 comprimés matin et soir pendant 7 jours (si elle allaite : amoxicilline 1 g matin et soir pendant 7 jours)",
            "Fer + acide folique : 2 comprimés, 2 fois par jour pendant 2 mois"
          ],
          "meds": [
            "ocytocine",
            "cotrimoxazole",
            "amoxicilline"
          ],
          "source": "Togo Ord. 30 (traitement 3)"
        }
      },
      "r_atonie": {
        "res": {
          "niveau": "urgence",
          "titre": "Atonie utérine",
          "resume": "Révision utérine, ocytocine, massage.",
          "conduite": [
            "Faire une révision utérine",
            "Ocytocine 10 UI en perfusion dans 500 mL de sérum salé ou de SGI",
            "Massage utérin",
            "Si l'hémorragie persiste : garniture propre, sonde de Foley si possible, et référer immédiatement",
            "Suites de couches : cotrimoxazole 480 mg, 2 comprimés matin et soir pendant 7 jours (si elle allaite : amoxicilline 1 g matin et soir pendant 7 jours)",
            "Fer + acide folique : 2 comprimés, 2 fois par jour pendant 2 mois"
          ],
          "meds": [
            "ocytocine",
            "cotrimoxazole",
            "amoxicilline"
          ],
          "source": "Togo Ord. 30 (traitement 4)"
        }
      },
      "r_trauma": {
        "res": {
          "niveau": "urgence",
          "titre": "Traumatisme des parties molles",
          "resume": "Suturer ou transférer.",
          "conduite": [
            "Rupture utérine, déchirure grave du col ou du périnée (2e et 3e degrés) : garniture propre et référer immédiatement",
            "Autres cas : suture au fil résorbable et soins locaux 2 fois par jour",
            "Suites de couches : cotrimoxazole 480 mg, 2 comprimés matin et soir pendant 7 jours (si elle allaite : amoxicilline 1 g matin et soir pendant 7 jours)",
            "Fer + acide folique : 2 comprimés, 2 fois par jour pendant 2 mois"
          ],
          "meds": [
            "cotrimoxazole",
            "amoxicilline"
          ],
          "source": "Togo Ord. 30 (traitement 1)"
        }
      },
      "r_civd": {
        "res": {
          "niveau": "urgence",
          "titre": "Coagulation intravasculaire disséminée",
          "resume": "Tamponnement et transfert immédiat.",
          "conduite": [
            "Tamponnement vaginal et référer immédiatement"
          ],
          "meds": [],
          "source": "Togo Ord. 30 (traitement 5)"
        }
      },
      "r_ref": {
        "res": {
          "niveau": "urgence",
          "titre": "Référer en urgence",
          "resume": "Cas non traité au centre de santé.",
          "conduite": [
            "Référer immédiatement vers l'hôpital",
            "Poser une voie veineuse si possible, surveiller le pouls, la tension et la respiration"
          ],
          "meds": [],
          "source": "Togo Ord. 30"
        }
      }
    }
  },
  {
    "id": "urinaire_adu",
    "groupe": "Adulte",
    "titre": "Troubles urinaires de l'adulte",
    "sous": "Togo Ord. 31",
    "debut": "u0",
    "noeuds": {
      "u0": {
        "q": "Quel tableau ?",
        "options": [
          {
            "t": "Globe vésical, impossible d'uriner (rétention aiguë)",
            "vers": "r_ret"
          },
          {
            "t": "Pas d'urines sans globe vésical (anurie)",
            "vers": "r_ref"
          },
          {
            "t": "Fuite continue après un accouchement difficile ou une opération du bassin (fistule), émission involontaire d'urine (incontinence)",
            "vers": "r_ref"
          },
          {
            "t": "Écoulement urétral, douleur en urinant (urétrite)",
            "vers": "algo:ist_adu"
          },
          {
            "t": "Fièvre ≥ 38 °C, urines troubles, douleur de la loge rénale (pyélonéphrite)",
            "vers": "r_pyelo"
          },
          {
            "t": "Homme de plus de 40 ans, se lève plus de 2 fois la nuit, pousse pour uriner (prostatite)",
            "vers": "r_prost"
          },
          {
            "t": "Brûlures en urinant, besoin fréquent (cystite)",
            "vers": "r_cystite"
          },
          {
            "t": "Traumatisme, sang dans les urines",
            "vers": "r_ref"
          },
          {
            "t": "Gonflement des paupières, fièvre (glomérulonéphrite)",
            "vers": "r_ref"
          },
          {
            "t": "Zone de bilharziose, urines sanglantes en fin de miction",
            "vers": "r_bilh"
          },
          {
            "t": "Gonflement du prépuce, difficulté à uriner (phimosis)",
            "vers": "r_phim"
          },
          {
            "t": "Soif, faim, urines abondantes, sucre dans les urines (diabète)",
            "vers": "r_ref"
          },
          {
            "t": "Autres signes",
            "vers": "r_ref"
          }
        ]
      },
      "r_ret": {
        "res": {
          "niveau": "urgence",
          "titre": "Rétention aiguë d'urine",
          "resume": "Sondage si possible puis transfert.",
          "conduite": [
            "Si possible : sondage vésical dans des conditions rigoureuses d'asepsie",
            "Référer"
          ],
          "meds": [],
          "source": "Togo Ord. 31 (traitement 1)"
        }
      },
      "r_pyelo": {
        "res": {
          "niveau": "attention",
          "titre": "Pyélonéphrite",
          "resume": "Antibiotique 10 jours.",
          "conduite": [
            "Ciprofloxacine 500 mg : 1 comprimé matin et soir pendant 10 jours, ou cotrimoxazole 480 mg : 2 comprimés, 2 fois par jour pendant 10 jours",
            "Paracétamol 1 g, 2 à 3 fois par jour",
            "Femme enceinte : référer",
            "Pas d'amélioration après 7 jours : référer"
          ],
          "meds": [
            "ciprofloxacine",
            "cotrimoxazole",
            "paracetamol"
          ],
          "source": "Togo Ord. 31 (traitement 6)"
        }
      },
      "r_prost": {
        "res": {
          "niveau": "attention",
          "titre": "Prostatite",
          "resume": "Antibiotique et anti-inflammatoire.",
          "conduite": [
            "Ciprofloxacine 500 mg : 1 comprimé matin et soir pendant 10 jours, ou cotrimoxazole 480 mg : 2 comprimés, 2 fois par jour pendant 10 jours",
            "Ibuprofène 800 mg matin et soir au cours des repas pendant 7 jours",
            "Pas d'amélioration : référer"
          ],
          "meds": [
            "ciprofloxacine",
            "cotrimoxazole",
            "ibuprofene"
          ],
          "source": "Togo Ord. 31 (traitement 7)"
        }
      },
      "r_cystite": {
        "res": {
          "niveau": "attention",
          "titre": "Cystite",
          "resume": "Antibiotique 10 jours.",
          "conduite": [
            "Ciprofloxacine 500 mg : 1 comprimé matin et soir pendant 10 jours, ou cotrimoxazole 480 mg : 2 comprimés, 2 fois par jour pendant 10 jours",
            "Ibuprofène 800 mg matin et soir au cours des repas pendant 7 jours (paracétamol si grossesse)",
            "Femme enceinte : référer",
            "Pas d'amélioration : référer"
          ],
          "meds": [
            "ciprofloxacine",
            "cotrimoxazole",
            "ibuprofene"
          ],
          "source": "Togo Ord. 31 (traitement 8)"
        }
      },
      "r_bilh": {
        "res": {
          "niveau": "attention",
          "titre": "Bilharziose vésicale possible",
          "resume": "Praziquantel en prise unique.",
          "conduite": [
            "Praziquantel 40 mg/kg en prise unique, soit {mg:40} mg",
            "Zone d'endémie ou séjour récent en zone d'endémie"
          ],
          "meds": [
            "praziquantel"
          ],
          "source": "Togo Ord. 31 (traitement 11)"
        }
      },
      "r_phim": {
        "res": {
          "niveau": "attention",
          "titre": "Phimosis",
          "resume": "Circoncision.",
          "conduite": [
            "Si possible : circoncision dans des conditions rigoureuses d'asepsie",
            "Sinon référer"
          ],
          "meds": [],
          "source": "Togo Ord. 31 (traitement 12)"
        }
      },
      "r_ref": {
        "res": {
          "niveau": "attention",
          "titre": "Référer pour avis spécialisé",
          "resume": "Le tableau ne correspond à aucun cas traité au centre de santé.",
          "conduite": [
            "Référer vers l'hôpital pour examen et bilan",
            "Avant le transfert : traiter la douleur ou la fièvre, hydrater, rassurer le patient"
          ],
          "meds": [
            "paracetamol"
          ],
          "source": "Togo Ord. 31"
        }
      }
    }
  },
  {
    "id": "oeil_adu",
    "groupe": "Adulte",
    "titre": "Affections de l'œil de l'adulte",
    "sous": "Togo Ord. 43",
    "debut": "o0",
    "noeuds": {
      "o0": {
        "q": "Quel tableau ?",
        "options": [
          {
            "t": "Douleur vive avec baisse brutale de la vue (glaucome aigu)",
            "vers": "r_glau"
          },
          {
            "t": "Corps étranger dans l'œil",
            "vers": "r_co"
          },
          {
            "t": "Traumatisme ou produit projeté dans l'œil",
            "vers": "o1"
          },
          {
            "t": "Sécrétions purulentes, rougeur avec photophobie ou picotement (conjonctivite)",
            "vers": "r_conj"
          },
          {
            "t": "Furoncle douloureux à la base d'un cil (orgelet)",
            "vers": "r_org"
          },
          {
            "t": "Gonflement des paupières avec démangeaison (blépharite)",
            "vers": "r_bleph"
          },
          {
            "t": "Baisse progressive de la vue, exophtalmie, palpitations, tumeur, autres signes",
            "vers": "r_ref"
          }
        ]
      },
      "o1": {
        "q": "Que s'est-il passé ?",
        "options": [
          {
            "t": "Liquide caustique (produit chimique)",
            "vers": "r_caust"
          },
          {
            "t": "Blessure de la cornée ou plaie profonde avec baisse de la vue",
            "vers": "r_cornee"
          },
          {
            "t": "Traumatisme sans lésion ni trouble de la vue",
            "vers": "r_trauma"
          }
        ]
      },
      "r_glau": {
        "res": {
          "niveau": "urgence",
          "titre": "Glaucome aigu",
          "resume": "Antalgique puis transfert.",
          "conduite": [
            "Aspirine 500 mg : 2 comprimés matin, midi et soir (ou paracétamol)",
            "Référer immédiatement"
          ],
          "meds": [
            "aspirine",
            "paracetamol"
          ],
          "source": "Togo Ord. 43 (traitement 1)"
        }
      },
      "r_co": {
        "res": {
          "niveau": "attention",
          "titre": "Corps étranger solide",
          "resume": "Extraire s'il est visible et accessible.",
          "conduite": [
            "Si visible et accessible : l'extraire par lavage à l'eau propre",
            "Après expulsion : antalgique ; pommade à la tétracycline matin et soir pendant 3 jours",
            "Si amélioration : continuer 4 jours de plus ; sinon pansement occlusif protecteur et référer",
            "Échec de l'expulsion : antalgique, pansement protecteur et référer"
          ],
          "meds": [
            "pommade-ophtalmique",
            "paracetamol"
          ],
          "source": "Togo Ord. 43 (traitement 2)"
        }
      },
      "r_caust": {
        "res": {
          "niveau": "urgence",
          "titre": "Projection de liquide caustique",
          "resume": "Laver abondamment.",
          "conduite": [
            "Laver à grande eau propre pendant 10 minutes",
            "Forte rougeur ou blessure : antalgique, pommade à la tétracycline, pansement protecteur et référer",
            "Ni rougeur ni blessure : antalgique, pommade matin et soir et pansement protecteur pendant 3 jours ; si amélioration continuer 4 jours, sinon référer"
          ],
          "meds": [
            "pommade-ophtalmique",
            "paracetamol"
          ],
          "source": "Togo Ord. 43 (traitement 3)"
        }
      },
      "r_cornee": {
        "res": {
          "niveau": "attention",
          "titre": "Blessure de la cornée",
          "resume": "Pansement, antalgique, antibiotique, puis référer.",
          "conduite": [
            "Pansement protecteur",
            "Antalgique (paracétamol ou aspirine 500 mg, 2 comprimés matin, midi et soir)",
            "Amoxicilline 500 mg : 2 gélules matin et soir, ou cotrimoxazole 480 mg : 2 comprimés matin et soir",
            "Référer"
          ],
          "meds": [
            "amoxicilline",
            "cotrimoxazole",
            "paracetamol"
          ],
          "source": "Togo Ord. 43 (traitement 4)"
        }
      },
      "r_trauma": {
        "res": {
          "niveau": "ok",
          "titre": "Traumatisme sans lésion",
          "resume": "Collyre et antalgique.",
          "conduite": [
            "Rifamycine collyre : 1 goutte matin, midi et soir, et antalgique, pendant 3 jours",
            "Si amélioration : continuer 4 jours de plus ; sinon référer avec le même traitement"
          ],
          "meds": [
            "pommade-ophtalmique",
            "paracetamol"
          ],
          "source": "Togo Ord. 43 (traitement 5)"
        }
      },
      "r_conj": {
        "res": {
          "niveau": "attention",
          "titre": "Conjonctivite",
          "resume": "Pommade ou collyre.",
          "conduite": [
            "Pommade à la tétracycline : 1 application matin, midi et soir, ou rifamycine collyre : 1 goutte matin, midi et soir",
            "Antalgique pendant 3 jours",
            "Si amélioration : continuer 4 jours de plus ; sinon référer",
            "Conjonctivite du nouveau-né : voir l'algorithme IST"
          ],
          "meds": [
            "pommade-ophtalmique",
            "paracetamol"
          ],
          "source": "Togo Ord. 43 (traitement 7)"
        }
      },
      "r_org": {
        "res": {
          "niveau": "attention",
          "titre": "Orgelet",
          "resume": "Pommade et antalgique.",
          "conduite": [
            "Évacuer le pus avec une compresse",
            "Pommade à la tétracycline : 1 application matin, midi et soir pendant 5 jours",
            "Antalgique",
            "Si amélioration : continuer 5 jours de plus ; sinon maintenir le traitement et référer"
          ],
          "meds": [
            "pommade-ophtalmique",
            "paracetamol"
          ],
          "source": "Togo Ord. 43 (traitement 8)"
        }
      },
      "r_bleph": {
        "res": {
          "niveau": "attention",
          "titre": "Blépharite",
          "resume": "Pommade et antalgique.",
          "conduite": [
            "Pommade à la tétracycline : 1 application matin, midi et soir",
            "Antalgique pendant 5 jours",
            "Si amélioration : continuer 5 jours de plus ; sinon référer avec le même traitement"
          ],
          "meds": [
            "pommade-ophtalmique",
            "paracetamol"
          ],
          "source": "Togo Ord. 43 (traitement 9)"
        }
      },
      "r_ref": {
        "res": {
          "niveau": "attention",
          "titre": "Référer pour avis spécialisé",
          "resume": "Le tableau ne correspond à aucun cas traité au centre de santé.",
          "conduite": [
            "Référer vers l'hôpital pour examen et bilan",
            "Avant le transfert : traiter la douleur ou la fièvre, hydrater, rassurer le patient"
          ],
          "meds": [
            "paracetamol"
          ],
          "source": "Togo Ord. 43"
        }
      }
    }
  },
  {
    "id": "bourse",
    "groupe": "Tous",
    "titre": "Grosse bourse (gonflement du scrotum)",
    "sous": "Togo Ord. 32",
    "debut": "b0",
    "noeuds": {
      "b0": {
        "q": "Quel tableau ?",
        "options": [
          {
            "t": "Début brutal, douleur vive, œdème du scrotum, testicule sensible (torsion testiculaire)",
            "vers": "r_torsion"
          },
          {
            "t": "Début progressif, douleur lancinante, fièvre ≥ 38 °C, avec écoulement urétral ou risque d'IST",
            "vers": "algo:ist_adu#r_scrotum"
          },
          {
            "t": "Début progressif, douleur lancinante, fièvre ≥ 38 °C, sans écoulement (orchite bactérienne)",
            "vers": "r_orchite"
          },
          {
            "t": "Gonflement devant ou derrière l'oreille (orchite ourlienne)",
            "vers": "r_ourl"
          },
          {
            "t": "Tuméfaction sensible, qui ne se réduit pas (hernie étranglée)",
            "vers": "r_hernie_e"
          },
          {
            "t": "Tuméfaction qui se réduit (hernie non étranglée)",
            "vers": "r_ref"
          },
          {
            "t": "Tumeur indolore, liquidienne, translucide (hydrocèle)",
            "vers": "r_ref"
          },
          {
            "t": "Éléphantiasis du scrotum, autres signes",
            "vers": "r_ref"
          }
        ]
      },
      "r_torsion": {
        "res": {
          "niveau": "urgence",
          "titre": "Torsion testiculaire",
          "resume": "Transfert chirurgical immédiat.",
          "conduite": [
            "Référer immédiatement : une intervention rapide (dans les heures qui suivent) conditionne la survie du testicule"
          ],
          "meds": [],
          "source": "Togo Ord. 32 (point 1)"
        }
      },
      "r_orchite": {
        "res": {
          "niveau": "attention",
          "titre": "Orchite bactérienne",
          "resume": "Antibiotique 10 jours.",
          "conduite": [
            {
              "g": "Adulte",
              "t": "Ciprofloxacine 500 mg : 1 comprimé matin et soir pendant 10 jours"
            },
            {
              "g": "Adulte",
              "t": "Ibuprofène 800 mg matin et soir au cours du repas"
            },
            {
              "g": "Enfant",
              "t": "Enfant : référer"
            },
            "Repos et port d'un suspensoir",
            "Conseiller le préservatif et traiter le ou les partenaires ; proposer le dépistage VIH",
            "Après 7 jours : si amélioration, continuer ; sinon référer"
          ],
          "meds": [
            "ciprofloxacine",
            "ibuprofene"
          ],
          "source": "Togo Ord. 32 (traitement 2)"
        }
      },
      "r_ourl": {
        "res": {
          "niveau": "attention",
          "titre": "Orchite ourlienne",
          "resume": "Repos et antalgique.",
          "conduite": [
            "Repos strict, port d'un suspensoir",
            "Paracétamol 15 mg/kg (enfant) ou 1 g (adulte), 3 fois par jour pendant 3 à 5 jours (le manuel propose l'aspirine 50 mg/kg/jour)",
            "Pas d'amélioration : référer"
          ],
          "meds": [
            "paracetamol"
          ],
          "source": "Togo Ord. 32 (traitement 3)"
        }
      },
      "r_hernie_e": {
        "res": {
          "niveau": "urgence",
          "titre": "Hernie inguino-scrotale étranglée",
          "resume": "Diazépam puis transfert.",
          "conduite": [
            {
              "g": "Adulte",
              "t": "Diazépam : 1 ampoule (10 mg) en IM"
            },
            {
              "g": "Enfant",
              "t": "Enfant : référer immédiatement"
            },
            "Référer immédiatement"
          ],
          "meds": [
            "diazepam"
          ],
          "source": "Togo Ord. 32 (traitement 4)"
        }
      },
      "r_ref": {
        "res": {
          "niveau": "attention",
          "titre": "Référer pour avis spécialisé",
          "resume": "Le tableau ne correspond à aucun cas traité au centre de santé.",
          "conduite": [
            "Référer vers l'hôpital pour examen et bilan",
            "Avant le transfert : traiter la douleur ou la fièvre, hydrater, rassurer le patient"
          ],
          "meds": [
            "paracetamol"
          ],
          "source": "Togo Ord. 32"
        }
      }
    }
  },
  {
    "id": "constipation",
    "groupe": "Tous",
    "titre": "Constipation",
    "sous": "Togo Ord. 33",
    "debut": "c0",
    "noeuds": {
      "c0": {
        "q": "Signes associés : douleurs importantes, vomissements, ventre ballonné, sang dans les selles, amaigrissement ?",
        "options": [
          {
            "t": "Oui",
            "vers": "r_ref"
          },
          {
            "t": "Non, constipation isolée",
            "vers": "r_const"
          }
        ]
      },
      "r_const": {
        "res": {
          "niveau": "ok",
          "titre": "Constipation",
          "resume": "Lavement si besoin et conseils.",
          "conduite": [
            {
              "g": "Enfant",
              "t": "Lavement évacuateur avec 200 mL d'eau tiède et 100 mL d'huile de paraffine"
            },
            {
              "g": "Adulte",
              "t": "Lavement évacuateur avec 1 à 1,5 litre d'eau tiède et 100 mL d'huile de paraffine"
            },
            "Si les selles ne sont pas évacuées : référer",
            "Manger plus de légumes et de fruits (papaye), pâte de farine non tamisée",
            "Boire 2 verres d'eau le matin à jeun et au moins 1,5 litre d'eau par jour",
            "Aller à la selle chaque jour à la même heure, de préférence après le repas principal",
            "Marcher, faire de l'activité physique",
            {
              "g": "Adulte",
              "t": "Au besoin : 1 à 2 cuillères à soupe d'huile de paraffine le soir au coucher"
            }
          ],
          "meds": [],
          "source": "Togo Ord. 33"
        }
      },
      "r_ref": {
        "res": {
          "niveau": "attention",
          "titre": "Référer pour avis spécialisé",
          "resume": "Le tableau ne correspond à aucun cas traité au centre de santé.",
          "conduite": [
            "Référer vers l'hôpital pour examen et bilan",
            "Avant le transfert : traiter la douleur ou la fièvre, hydrater, rassurer le patient"
          ],
          "meds": [
            "paracetamol"
          ],
          "source": "Togo Ord. 33 (fécalome, tumeur, mégacôlon à rechercher)"
        }
      }
    }
  },
  {
    "id": "oedemes",
    "groupe": "Tous",
    "titre": "Œdèmes (gonflements mous)",
    "sous": "Togo Ord. 37",
    "debut": "e0",
    "noeuds": {
      "e0": {
        "q": "Âge ?",
        "options": [
          {
            "t": "Enfant (moins de 15 ans)",
            "vers": "e1"
          },
          {
            "t": "Adulte (15 ans et plus)",
            "vers": "e2"
          }
        ],
        "aide": "Gonflement mou, diffus, indolore, qui garde le godet."
      },
      "e1": {
        "q": "Quel tableau chez l'enfant ?",
        "options": [
          {
            "t": "Cheveux défrisés et cassants, peau dépigmentée, œdèmes des pieds (kwashiorkor)",
            "vers": "r_ref"
          },
          {
            "t": "Essoufflement à l'effort, veines du cou gonflées, visage bouffi (insuffisance cardiaque)",
            "vers": "r_ic"
          },
          {
            "t": "Gonflement du visage, sang dans les urines",
            "vers": "r_ref"
          },
          {
            "t": "Pâleur marquée",
            "vers": "algo:anemie"
          },
          {
            "t": "Autres signes",
            "vers": "r_ref"
          }
        ]
      },
      "e2": {
        "q": "Quel tableau chez l'adulte ?",
        "options": [
          {
            "t": "Essoufflement à l'effort, veines du cou gonflées, visage bouffi (insuffisance cardiaque décompensée)",
            "vers": "r_ic"
          },
          {
            "t": "Essoufflement à l'effort, veines du cou gonflées, sans visage bouffi (insuffisance cardiaque droite)",
            "vers": "r_ref"
          },
          {
            "t": "Gonflement du visage et des jambes, urines rares (insuffisance rénale)",
            "vers": "r_ref"
          },
          {
            "t": "Ascite avec beaucoup de protéines dans les urines (syndrome néphrotique)",
            "vers": "r_ref"
          },
          {
            "t": "Ascite et ictère (cirrhose)",
            "vers": "r_cirr"
          },
          {
            "t": "Femme enceinte, tension ≥ 140/90, protéines dans les urines (prééclampsie)",
            "vers": "r_preecl"
          },
          {
            "t": "Pâleur des muqueuses (anémie)",
            "vers": "algo:anemie#na1"
          },
          {
            "t": "Autres signes",
            "vers": "r_ref"
          }
        ]
      },
      "r_ic": {
        "res": {
          "niveau": "urgence",
          "titre": "Insuffisance cardiaque globale décompensée",
          "resume": "Diurétique puis transfert.",
          "conduite": [
            {
              "g": "Adulte",
              "t": "Furosémide 20 mg/mL : 1 à 2 ampoules (20 à 40 mg) en IV lente, à répéter plusieurs fois par jour, maximum 100 mg par 24 heures, associée à du chlorure de potassium 600 mg : 1 comprimé"
            },
            {
              "g": "Enfant",
              "t": "Enfant de moins de 12 ans : référer sans diurétique ; adolescent de plus de 12 ans : même schéma que l'adulte"
            },
            "Puis référer"
          ],
          "meds": [
            "furosemide"
          ],
          "source": "Togo Ord. 37 (traitement 2)"
        }
      },
      "r_cirr": {
        "res": {
          "niveau": "attention",
          "titre": "Cirrhose",
          "resume": "Diurétique et transfert.",
          "conduite": [
            "Hydrochlorothiazide 25 mg : 1 comprimé par jour, puis référer"
          ],
          "meds": [
            "hydrochlorothiazide"
          ],
          "source": "Togo Ord. 37 (traitement 7)"
        }
      },
      "r_preecl": {
        "res": {
          "niveau": "urgence",
          "titre": "Prééclampsie",
          "resume": "Diazépam puis transfert.",
          "conduite": [
            "Diazépam 10 mg (1 ampoule) en IM, puis référer immédiatement",
            "Surveiller la tension et rechercher des signes d'éclampsie (maux de tête, troubles visuels, convulsions)"
          ],
          "meds": [
            "diazepam"
          ],
          "source": "Togo Ord. 37 (traitement 9)",
          "liens": [
            {
              "t": "Hypertension de la grossesse",
              "vers": "algo:hta_adu"
            }
          ]
        }
      },
      "r_ref": {
        "res": {
          "niveau": "attention",
          "titre": "Référer pour avis spécialisé",
          "resume": "Le tableau ne correspond à aucun cas traité au centre de santé.",
          "conduite": [
            "Référer vers l'hôpital pour examen et bilan",
            "Avant le transfert : traiter la douleur ou la fièvre, hydrater, rassurer le patient"
          ],
          "meds": [
            "paracetamol"
          ],
          "source": "Togo Ord. 37"
        }
      }
    }
  },
  {
    "id": "intoxication",
    "groupe": "Tous",
    "titre": "Intoxication",
    "sous": "Togo Ord. 38",
    "debut": "i0",
    "noeuds": {
      "i0": {
        "q": "Quel produit ?",
        "options": [
          {
            "t": "Haleine alcoolique (alcool)",
            "vers": "r_alcool"
          },
          {
            "t": "Prise abusive de médicaments, surdosage",
            "vers": "r_medic"
          },
          {
            "t": "Produit domestique caustique (acide, soude, eau de Javel, permanganate, détartrant)",
            "vers": "r_caust"
          },
          {
            "t": "Raticide",
            "vers": "r_rat"
          },
          {
            "t": "Pesticide ou insecticide",
            "vers": "r_pest"
          },
          {
            "t": "Pétrole",
            "vers": "r_petrole"
          },
          {
            "t": "Piles sèches",
            "vers": "r_piles"
          },
          {
            "t": "Aliments avariés, champignons, manioc toxique, anacardes (douleurs abdominales, vomissements, diarrhée)",
            "vers": "r_alim"
          },
          {
            "t": "Drogues, substances psychoactives",
            "vers": "r_ref"
          },
          {
            "t": "Autre produit",
            "vers": "r_autre"
          }
        ],
        "aide": "Toujours interroger la famille et chercher la boîte du produit. Si le malade est comateux : position latérale de sécurité, libérer les voies respiratoires, le réchauffer."
      },
      "r_alcool": {
        "res": {
          "niveau": "attention",
          "titre": "Intoxication alcoolique",
          "resume": "Vitamine B1 et glucose.",
          "conduite": [
            "Vitamine B1 : 3 ampoules de 100 mg en IM",
            "Puis perfusion de SGH 10 % 500 mL en 2 à 3 heures (ou SGI 500 mL, 2 flacons)",
            {
              "g": "Adulte",
              "t": "Agitation ou convulsion : diazépam 10 mg en IM"
            },
            {
              "g": "Enfant",
              "t": "Enfant : diazépam selon le poids (voir la fiche), adapter les perfusions au poids"
            },
            "Pas d'amélioration après 3 heures : référer en réanimation sous perfusion"
          ],
          "meds": [
            "diazepam",
            "sgh10"
          ],
          "source": "Togo Ord. 38 (traitement 1)"
        }
      },
      "r_medic": {
        "res": {
          "niveau": "urgence",
          "titre": "Intoxication médicamenteuse",
          "resume": "Identifier le produit et transférer.",
          "conduite": [
            "Chercher toujours à identifier le médicament et la dose",
            "Traitement symptomatique",
            "Référer"
          ],
          "meds": [],
          "source": "Togo Ord. 38 (traitement 2)"
        }
      },
      "r_caust": {
        "res": {
          "niveau": "urgence",
          "titre": "Ingestion de produit caustique",
          "resume": "Ne pas faire vomir.",
          "conduite": [
            "Ne pas faire vomir",
            "Traitement symptomatique (douleur, hydratation)",
            "Référer"
          ],
          "meds": [
            "paracetamol"
          ],
          "source": "Togo Ord. 38 (traitement 3)"
        }
      },
      "r_rat": {
        "res": {
          "niveau": "attention",
          "titre": "Intoxication au raticide (anti-vitamine K)",
          "resume": "Vitamine K.",
          "conduite": [
            "Vitamine K1 : 1 à 3 ampoules par jour en IM",
            "Si hémorragie malgré le traitement : référer"
          ],
          "meds": [
            "vitamine-k"
          ],
          "source": "Togo Ord. 38 (traitement 4)"
        }
      },
      "r_pest": {
        "res": {
          "niveau": "urgence",
          "titre": "Intoxication aux pesticides ou insecticides",
          "resume": "Atropine et transfert.",
          "conduite": [
            "Suivre la conduite à tenir écrite sur la boîte, si elle est retrouvée",
            {
              "g": "Adulte",
              "t": "Atropine injectable : 1 mg en IM ou IV toutes les 30 minutes"
            },
            {
              "g": "Enfant",
              "t": "Enfant : référer sans atropine"
            },
            "Référer"
          ],
          "meds": [],
          "source": "Togo Ord. 38 (traitement 5)"
        }
      },
      "r_petrole": {
        "res": {
          "niveau": "urgence",
          "titre": "Ingestion de pétrole",
          "resume": "Ne rien donner par la bouche.",
          "conduite": [
            "Ne pas faire vomir et ne rien donner par la bouche (ni œuf cru ni huile rouge)",
            "Benzylpénicilline 50 000 UI/kg/jour en IM, soit {mg:50000} UI par jour",
            "Détresse respiratoire : hydrocortisone 100 mg en IM et référer"
          ],
          "meds": [],
          "source": "Togo Ord. 38 (traitement 6)"
        }
      },
      "r_piles": {
        "res": {
          "niveau": "attention",
          "titre": "Ingestion de piles sèches",
          "resume": "Référer.",
          "conduite": [
            "Référer"
          ],
          "meds": [],
          "source": "Togo Ord. 38 (traitement 7)"
        }
      },
      "r_alim": {
        "res": {
          "niveau": "attention",
          "titre": "Intoxication alimentaire",
          "resume": "Traitement symptomatique.",
          "conduite": [
            "Traitement symptomatique : réhydratation (SRO), voir la diarrhée",
            "Référer selon la gravité"
          ],
          "meds": [
            "sro"
          ],
          "source": "Togo Ord. 38 (traitement 8)",
          "liens": [
            {
              "t": "Diarrhée de l'adulte",
              "vers": "algo:diarrhee_adu"
            },
            {
              "t": "Diarrhée de l'enfant",
              "vers": "algo:diarrhee_enf"
            }
          ]
        }
      },
      "r_autre": {
        "res": {
          "niveau": "attention",
          "titre": "Autre produit",
          "resume": "Suivre les indications du fabricant.",
          "conduite": [
            "Traitement symptomatique, ou selon les indications du fabricant si la boîte est retrouvée",
            "Référer selon la gravité"
          ],
          "meds": [],
          "source": "Togo Ord. 38 (traitement 10)"
        }
      },
      "r_ref": {
        "res": {
          "niveau": "urgence",
          "titre": "Référer en urgence",
          "resume": "Cas non traité au centre de santé.",
          "conduite": [
            "Référer immédiatement vers l'hôpital",
            "Surveiller le pouls, la tension et la respiration pendant le transfert"
          ],
          "meds": [],
          "source": "Togo Ord. 38 (substances psychoactives)"
        }
      }
    }
  },
  {
    "id": "nez",
    "groupe": "Tous",
    "titre": "Écoulement nasal et saignement de nez",
    "sous": "Togo Ord. 41",
    "debut": "n0",
    "noeuds": {
      "n0": {
        "q": "Quel écoulement ?",
        "options": [
          {
            "t": "Écoulement clair (séreux) avec fièvre > 37,5 °C",
            "vers": "r_rhino"
          },
          {
            "t": "Éternuements, nez bouché, démangeaisons",
            "vers": "r_allergie"
          },
          {
            "t": "Écoulement simple, sans fièvre (rhume)",
            "vers": "r_rhinite"
          },
          {
            "t": "Écoulement purulent jaune ou vert avec maux de tête, ou fétide",
            "vers": "n1"
          },
          {
            "t": "Déformation de la face (cancer du maxillaire supérieur)",
            "vers": "r_ref"
          },
          {
            "t": "Corps étranger dans la fosse nasale",
            "vers": "r_corps"
          },
          {
            "t": "Écoulement sanglant après un traumatisme de la face ou de la tête",
            "vers": "r_trauma"
          },
          {
            "t": "Saignement avec tension élevée (diastolique > 90, systolique > 140)",
            "vers": "algo:hta_adu"
          },
          {
            "t": "Saignement de nez isolé ou répété (épistaxis)",
            "vers": "r_epi"
          },
          {
            "t": "Autres signes",
            "vers": "r_ref"
          }
        ]
      },
      "n1": {
        "q": "Trou dans une molaire supérieure (origine dentaire) ?",
        "options": [
          {
            "t": "Oui",
            "vers": "r_sinus_dent"
          },
          {
            "t": "Non",
            "vers": "r_sinus"
          }
        ]
      },
      "r_rhino": {
        "res": {
          "niveau": "attention",
          "titre": "Rhinopharyngite",
          "resume": "Antibiotique et antipyrétique.",
          "conduite": [
            {
              "g": "Adulte",
              "t": "Amoxicilline 500 mg : 2 gélules ou comprimés matin et soir"
            },
            {
              "g": "Enfant",
              "t": "Amoxicilline : 50 mg/kg/jour en 2 prises, soit {mg:50} mg par jour"
            },
            "Paracétamol (15 mg/kg toutes les 8 heures chez l'enfant, 1 g 3 fois par jour chez l'adulte)",
            "Après 7 jours : si bonne évolution, continuer 3 jours ; si fièvre persistante, référer"
          ],
          "meds": [
            "amoxicilline",
            "paracetamol"
          ],
          "source": "Togo Ord. 41 (traitement 1)"
        }
      },
      "r_allergie": {
        "res": {
          "niveau": "ok",
          "titre": "Rhinite allergique",
          "resume": "Antihistaminique et conseils.",
          "conduite": [
            "Éviter la poussière, l'eau froide et ce qui déclenche les symptômes",
            "Antihistaminique : voir la fiche (adulte et enfant de plus de 2 ans)",
            {
              "g": "Enfant",
              "t": "Enfant de moins de 2 ans : Primalan sirop, 2,5 mL par jour"
            },
            "Rechutes trop rapprochées (plus de 3 fois par an) : référer"
          ],
          "meds": [
            "antihistaminique",
            "primalan"
          ],
          "source": "Togo Ord. 41 (traitement 2)"
        }
      },
      "r_rhinite": {
        "res": {
          "niveau": "ok",
          "titre": "Rhinite banale (rhume)",
          "resume": "Traitement symptomatique.",
          "conduite": [
            "Paracétamol pendant 4 jours",
            "Antihistaminique (voir la fiche)",
            {
              "g": "Enfant",
              "t": "Enfant de moins de 2 ans : Primalan sirop, 2,5 mL par jour"
            },
            {
              "g": "Adulte",
              "t": "Vitamine C 1000 mg par jour, et huile goménolée à 5 % : 2 gouttes matin, midi et soir dans chaque narine"
            },
            "Si l'écoulement devient purulent ou si la fièvre apparaît : traiter comme une rhinopharyngite",
            "Allergie à l'amoxicilline : érythromycine (adulte 500 mg, 2 comprimés matin et soir ; enfant 50 mg/kg/jour en 2 prises)"
          ],
          "meds": [
            "paracetamol",
            "antihistaminique",
            "erythromycine",
            "primalan"
          ],
          "source": "Togo Ord. 41 (traitement 3)"
        }
      },
      "r_sinus": {
        "res": {
          "niveau": "attention",
          "titre": "Sinusite",
          "resume": "Antibiotique 7 à 10 jours.",
          "conduite": [
            {
              "g": "Adulte",
              "t": "Amoxicilline 500 mg : 2 gélules ou comprimés matin et soir pendant 7 jours"
            },
            {
              "g": "Enfant",
              "t": "Amoxicilline : 50 mg/kg/jour en 2 prises pendant 7 jours, soit {mg:50} mg par jour"
            },
            "Paracétamol",
            "Si amélioration : continuer 3 jours ; si les signes persistent : référer"
          ],
          "meds": [
            "amoxicilline",
            "paracetamol"
          ],
          "source": "Togo Ord. 41 (traitement 5A)"
        }
      },
      "r_sinus_dent": {
        "res": {
          "niveau": "attention",
          "titre": "Sinusite d'origine dentaire",
          "resume": "Antibiotique et transfert.",
          "conduite": [
            {
              "g": "Adulte",
              "t": "Amoxicilline 500 mg : 2 gélules ou comprimés matin et soir"
            },
            {
              "g": "Enfant",
              "t": "Amoxicilline : 50 mg/kg/jour en 2 prises, soit {mg:50} mg par jour"
            },
            "Puis référer (dentiste)"
          ],
          "meds": [
            "amoxicilline"
          ],
          "source": "Togo Ord. 41 (traitement 5B)"
        }
      },
      "r_corps": {
        "res": {
          "niveau": "attention",
          "titre": "Corps étranger du nez",
          "resume": "Extraction ou transfert.",
          "conduite": [
            "Extraire avec une pince si le corps étranger est visible et facilement accessible",
            "Sinon référer"
          ],
          "meds": [],
          "source": "Togo Ord. 41 (traitement 6)"
        }
      },
      "r_trauma": {
        "res": {
          "niveau": "urgence",
          "titre": "Traumatisme cranio-facial",
          "resume": "Tamponnement et transfert.",
          "conduite": [
            "Faire un tamponnement nasal avec une mèche de compresse",
            "Paracétamol",
            "Amoxicilline systématique pour éviter la surinfection (adulte 500 mg, 2 comprimés matin et soir ; enfant 50 mg/kg/jour en 2 prises)",
            "Avant de référer : s'assurer que le patient n'est pas en état de choc (pouls, tension, conjonctives, conscience)"
          ],
          "meds": [
            "paracetamol",
            "amoxicilline"
          ],
          "source": "Togo Ord. 41 (traitement 7)"
        }
      },
      "r_epi": {
        "res": {
          "niveau": "attention",
          "titre": "Épistaxis",
          "resume": "Compression et tamponnement.",
          "conduite": [
            "Faire pencher la tête en avant",
            "Pincer le nez et respirer par la bouche pendant environ 10 minutes",
            "Tamponnement hémostatique, vessie de glace si possible",
            "Mesurer la tension : si élevée, voir l'algorithme HTA",
            {
              "g": "Adulte",
              "t": "Si le saignement persiste : vitamine K1 en IM et référer"
            }
          ],
          "meds": [
            "vitamine-k"
          ],
          "source": "Togo Ord. 41 (traitement 10)",
          "liens": [
            {
              "t": "Hypertension artérielle",
              "vers": "algo:hta_adu"
            }
          ]
        }
      },
      "r_ref": {
        "res": {
          "niveau": "attention",
          "titre": "Référer pour avis spécialisé",
          "resume": "Le tableau ne correspond à aucun cas traité au centre de santé.",
          "conduite": [
            "Référer vers l'hôpital pour examen et bilan",
            "Avant le transfert : traiter la douleur ou la fièvre, hydrater, rassurer le patient"
          ],
          "meds": [
            "paracetamol"
          ],
          "source": "Togo Ord. 41"
        }
      }
    }
  },
  {
    "id": "bouche",
    "groupe": "Tous",
    "titre": "Plaies dans la bouche",
    "sous": "Togo Ord. 42",
    "debut": "m0",
    "noeuds": {
      "m0": {
        "q": "Quel tableau ?",
        "options": [
          {
            "t": "Lésion des gencives, saignement des gencives (gingivite)",
            "vers": "r_gingi"
          },
          {
            "t": "Enduits blanchâtres dans la bouche (après antibiotiques prolongés, nourrisson)",
            "vers": "r_candi"
          },
          {
            "t": "Enduits blanchâtres avec fièvre prolongée ou amaigrissement (VIH possible)",
            "vers": "r_vih"
          },
          {
            "t": "Ulcérations douloureuses arrondies sur la face interne de la joue ou le bord de la langue (aphtes)",
            "vers": "r_aphte"
          },
          {
            "t": "Petites vésicules en grappes sur fond rouge (herpès labial ou buccal)",
            "vers": "r_herpes"
          },
          {
            "t": "Ulcération nécrotique, haleine très fétide (stomatite ulcéro-nécrotique)",
            "vers": "r_unec"
          },
          {
            "t": "Plaie de la lèvre, du plancher ou du palais qui ne guérit pas ; ulcération bourgeonnante, saignante, avec ganglion (cancer)",
            "vers": "r_cancer"
          },
          {
            "t": "Ingestion de produit chimique, œdème de la muqueuse (brûlure caustique)",
            "vers": "algo:intoxication#r_caust"
          },
          {
            "t": "Autres signes",
            "vers": "r_ref"
          }
        ]
      },
      "r_gingi": {
        "res": {
          "niveau": "ok",
          "titre": "Gingivite",
          "resume": "Bains de bouche et hygiène.",
          "conduite": [
            "Bain de bouche à la chlorhexidine ou à la polyvidone iodée",
            "Bain de bouche à l'eau tiède salée pendant 10 jours",
            "Conseils d'hygiène bucco-dentaire"
          ],
          "meds": [
            "chlorhexidine"
          ],
          "source": "Togo Ord. 42 (traitement 1)"
        }
      },
      "r_vih": {
        "res": {
          "niveau": "attention",
          "titre": "VIH/sida possible",
          "resume": "Dépistage.",
          "conduite": [
            "Proposer le dépistage VIH et suivre les directives du programme national (PNLS)"
          ],
          "meds": [],
          "source": "Togo Ord. 42 (point 2)"
        }
      },
      "r_candi": {
        "res": {
          "niveau": "attention",
          "titre": "Candidose buccale",
          "resume": "Nystatine et bain de bouche.",
          "conduite": [
            {
              "g": "Adulte",
              "t": "Nystatine 500 000 UI : 2 comprimés écrasés, matin, midi, soir et au coucher (badigeonner la bouche puis avaler)"
            },
            {
              "g": "Enfant",
              "t": "Nystatine 500 000 UI : 1 comprimé écrasé, matin, midi, soir et au coucher (badigeonner la bouche puis avaler)"
            },
            "Bain de bouche au bicarbonate de soude matin, midi et soir pendant 7 jours",
            "Pas d'amélioration : référer"
          ],
          "meds": [
            "nystatine"
          ],
          "source": "Togo Ord. 42 (traitement 3)"
        }
      },
      "r_aphte": {
        "res": {
          "niveau": "ok",
          "titre": "Aphtes",
          "resume": "Antalgique, vitamine C, bain de bouche.",
          "conduite": [
            "Paracétamol (le manuel propose l'aspirine 500 mg, 1 comprimé 3 fois par jour)",
            "Vitamine C 500 mg : 2 comprimés matin et midi pendant 15 jours",
            "Bain de bouche à la chlorhexidine 4 fois par jour pendant 10 jours",
            "Pas d'amélioration ou récidive : référer"
          ],
          "meds": [
            "paracetamol",
            "chlorhexidine"
          ],
          "source": "Togo Ord. 42 (traitement 4)"
        }
      },
      "r_herpes": {
        "res": {
          "niveau": "ok",
          "titre": "Herpès labial ou buccal",
          "resume": "Antalgique et glycérine iodée.",
          "conduite": [
            "Paracétamol (le manuel propose l'aspirine 500 mg, 2 comprimés matin et soir)",
            "Attouchement à la glycérine iodée pendant 7 jours",
            "Pas d'amélioration : référer"
          ],
          "meds": [
            "paracetamol"
          ],
          "source": "Togo Ord. 42 (traitement 5)"
        }
      },
      "r_unec": {
        "res": {
          "niveau": "urgence",
          "titre": "Stomatite ulcéro-nécrotique",
          "resume": "Antibiotiques et transfert.",
          "conduite": [
            {
              "g": "Adulte",
              "t": "Amoxicilline 500 mg : 2 comprimés matin et soir"
            },
            {
              "g": "Adulte",
              "t": "Métronidazole 250 mg : 2 comprimés matin et soir"
            },
            {
              "g": "Adulte",
              "t": "Paracétamol"
            },
            {
              "g": "Enfant",
              "t": "Enfant : amoxicilline 50 mg/kg/jour en 2 prises ({mg:50} mg), métronidazole 30 mg/kg/jour en 2 prises ({mg:30} mg)"
            },
            "Bain de bouche à la chlorhexidine matin, midi, soir et au coucher",
            "Référer"
          ],
          "meds": [
            "amoxicilline",
            "metronidazole",
            "chlorhexidine",
            "paracetamol"
          ],
          "source": "Togo Ord. 42 (traitement 6)"
        }
      },
      "r_cancer": {
        "res": {
          "niveau": "attention",
          "titre": "Cancer buccal possible",
          "resume": "Soins puis transfert.",
          "conduite": [
            {
              "g": "Adulte",
              "t": "Amoxicilline 500 mg : 2 comprimés matin et soir"
            },
            {
              "g": "Adulte",
              "t": "Paracétamol"
            },
            "Bain de bouche à la chlorhexidine matin, midi, soir et au coucher (s'il n'y a pas de saignement)",
            "Référer"
          ],
          "meds": [
            "amoxicilline",
            "chlorhexidine",
            "paracetamol"
          ],
          "source": "Togo Ord. 42 (traitement 7)"
        }
      },
      "r_ref": {
        "res": {
          "niveau": "attention",
          "titre": "Référer pour avis spécialisé",
          "resume": "Le tableau ne correspond à aucun cas traité au centre de santé.",
          "conduite": [
            "Référer vers l'hôpital pour examen et bilan",
            "Avant le transfert : traiter la douleur ou la fièvre, hydrater, rassurer le patient"
          ],
          "meds": [
            "paracetamol"
          ],
          "source": "Togo Ord. 42"
        }
      }
    }
  },
  {
    "id": "lymphoedeme",
    "groupe": "Tous",
    "titre": "Grosse jambe (lymphoedème, éléphantiasis)",
    "sous": "Togo Ord. 44",
    "debut": "l0",
    "noeuds": {
      "l0": {
        "q": "Quel tableau ?",
        "options": [
          {
            "t": "Œdème qui garde le godet (origine cardiaque, rénale ou hépatique)",
            "vers": "algo:oedemes"
          },
          {
            "t": "Rougeur, chaleur, fièvre, peau tendue (érysipèle)",
            "vers": "algo:peau"
          },
          {
            "t": "Gonflement qui ne garde pas le godet, réversible ou non, avec plis, nodules, plaies ou peau en « moquette » (lymphoedème)",
            "vers": "l1"
          }
        ]
      },
      "l1": {
        "q": "Crise aiguë (douleur, fièvre, rougeur, plaie infectée) ?",
        "options": [
          {
            "t": "Oui",
            "vers": "r_crise"
          },
          {
            "t": "Non",
            "vers": "r_auto"
          }
        ],
        "aide": "Stades : 1 œdème réversible le matin ; 2 œdème permanent ; 3 plis peu profonds ; 4 nodules ; 5 plis profonds ; 6 peau en moquette ; 7 difficulté à se déplacer."
      },
      "r_auto": {
        "res": {
          "niveau": "attention",
          "titre": "Lymphoedème : auto-prise en charge",
          "resume": "Hygiène, surélévation, exercices, chaussures.",
          "conduite": [
            "Hygiène : laver le membre à partir du genou vers le bas, avec de l'eau et du savon, en insistant sur les plis et entre les orteils, jusqu'à ce que l'eau de rinçage soit propre ; essuyer avec un linge propre. Laver les deux membres, en commençant par le sain",
            "Traiter les portes d'entrée : nettoyer avec Till solution ou Cytéal solution, puis pommade antibiotique ou antimycosique selon le cas",
            "Surélever le membre : assis, à hauteur de la hanche ; couché, plus haut que la tête",
            "Exercices : se lever sur la pointe des pieds, mouvements d'avant en arrière, rotation du pied, 10 à 20 fois, plusieurs fois par jour (pas pendant une crise)",
            "Porter des chaussures adaptées, pas trop serrées",
            "Revoir régulièrement pour évaluer le stade et encourager le patient"
          ],
          "meds": [],
          "source": "Togo Ord. 44 (traitement 4.1)"
        }
      },
      "r_crise": {
        "res": {
          "niveau": "attention",
          "titre": "Crise aiguë de lymphoedème",
          "resume": "Refroidir, repos, antibiotique si plaie infectée.",
          "conduite": [
            "Refroidir le membre dans de l'eau froide propre jusqu'à l'arrêt des douleurs",
            "Paracétamol en cas de fièvre",
            "Continuer à laver le membre comme d'habitude ; le garder au repos et surélevé",
            "Plaie infectée : amoxicilline par voie orale ou injection IM",
            "À ne pas faire : réchauffer le membre, scarifier ou gratter la peau, crever les ampoules, faire des exercices pendant la crise"
          ],
          "meds": [
            "paracetamol",
            "amoxicilline"
          ],
          "source": "Togo Ord. 44 (traitement 4.2 et 4.3)"
        }
      }
    }
  }
];

const MOTS_CLES = {
  "fievre_enf": [
    "fièvre",
    "fievre",
    "température",
    "temperature",
    "paludisme",
    "palu",
    "corps chaud",
    "frissons",
    "convulsion",
    "enfant chaud",
    "fébrile"
  ],
  "toux_enf": [
    "toux",
    "tousse",
    "respiration rapide",
    "difficulté respiratoire",
    "essoufflement",
    "pneumonie",
    "bronchite",
    "rhume",
    "nez qui coule",
    "sifflement",
    "bronchiolite",
    "enfant tousse"
  ],
  "diarrhee_enf": [
    "diarrhée",
    "diarrhee",
    "selles liquides",
    "selles molles",
    "dysenterie",
    "sang dans les selles",
    "choléra",
    "déshydratation",
    "ventre qui coule"
  ],
  "gorge_enf": [
    "mal de gorge",
    "douleur de gorge",
    "gorge",
    "dysphagie",
    "difficulté à avaler",
    "avaler",
    "angine",
    "amygdales",
    "amygdalite",
    "déglutition",
    "odynophagie",
    "gorge rouge",
    "corps étranger gorge",
    "pharyngite",
    "refuse de manger douleur"
  ],
  "oreille_enf": [
    "oreille",
    "otalgie",
    "écoulement oreille",
    "otite",
    "surdité",
    "bouchon cérumen",
    "cérumen",
    "oreillons",
    "parotide",
    "tire l'oreille"
  ],
  "fievre_adu": [
    "fièvre",
    "fievre",
    "température",
    "paludisme",
    "palu",
    "corps chaud",
    "frissons",
    "courbatures",
    "typhoïde",
    "méningite",
    "céphalées fièvre",
    "maux de tête fièvre"
  ],
  "toux_adu": [
    "toux",
    "tousse",
    "pneumonie",
    "bronchite",
    "rhume",
    "grippe",
    "crachats",
    "laryngite",
    "essoufflement",
    "difficulté à respirer",
    "douleur thoracique",
    "tuberculose",
    "voix rauque"
  ],
  "diarrhee_adu": [
    "diarrhée",
    "diarrhee",
    "selles liquides",
    "dysenterie",
    "sang dans les selles",
    "choléra",
    "typhoïde",
    "amibes"
  ],
  "gorge_adu": [
    "mal de gorge",
    "douleur de gorge",
    "gorge",
    "dysphagie",
    "difficulté à avaler",
    "avaler",
    "angine",
    "amygdales",
    "amygdalite",
    "déglutition",
    "odynophagie",
    "gorge rouge",
    "corps étranger gorge",
    "pharyngite",
    "voix changée",
    "enrouement"
  ],
  "ulcere_adu": [
    "estomac",
    "brûlure d'estomac",
    "brulure estomac",
    "épigastralgie",
    "gastrite",
    "ulcère",
    "creux de l'estomac",
    "acidité",
    "reflux",
    "pyrosis",
    "ballonnement",
    "pylori"
  ],
  "morsure": [
    "morsure",
    "piqûre",
    "piqure",
    "chien",
    "chat",
    "singe",
    "serpent",
    "scorpion",
    "araignée",
    "abeille",
    "guêpe",
    "frelon",
    "rage",
    "venin",
    "anaphylaxie",
    "allergie piqûre"
  ],
  "diabete": [
    "diabète",
    "diabete",
    "glycémie",
    "soif",
    "polyurie",
    "uriner souvent",
    "sucre",
    "hypoglycémie",
    "malaise sucre",
    "soif intense"
  ],
  "hta_adu": [
    "tension",
    "hypertension",
    "hta",
    "tension élevée",
    "céphalées",
    "vertiges",
    "bourdonnements",
    "maux de tête",
    "tension artérielle"
  ],
  "drepano": [
    "drépanocytose",
    "drepanocytose",
    "crise douloureuse",
    "douleur des os",
    "douleur osseuse",
    "mains pieds gonflés",
    "ictère",
    "jaunisse",
    "ss",
    "as"
  ],
  "ist_adu": [
    "ist",
    "écoulement urétral",
    "ecoulement uretral",
    "écoulement vaginal",
    "pertes vaginales",
    "gonocoque",
    "chaude-pisse",
    "syphilis",
    "chancre",
    "ulcération génitale",
    "bubon",
    "testicule gonflé",
    "scrotum",
    "brûlure en urinant",
    "démangeaisons génitales",
    "herpès",
    "pertes blanches",
    "infection sexuellement transmissible",
    "plaie génitale"
  ],
  "hemorroides": [
    "hémorroïdes",
    "hemorroides",
    "anus",
    "saignement anal",
    "douleur anale",
    "fissure",
    "rectorragie",
    "boule anale",
    "sang selles anus"
  ],
  "rhumatisme": [
    "articulations",
    "rhumatisme",
    "arthrose",
    "goutte",
    "lombalgie",
    "lumbago",
    "dos",
    "genou",
    "douleur articulaire",
    "raa",
    "gonflement articulation",
    "mal de dos",
    "douleur des jambes"
  ],
  "peau": [
    "peau",
    "démangeaisons",
    "demangeaisons",
    "prurit",
    "éruption",
    "eruption",
    "boutons",
    "gale",
    "urticaire",
    "eczéma",
    "mycose",
    "zona",
    "varicelle",
    "abcès",
    "furoncle",
    "érysipèle",
    "teigne",
    "impétigo",
    "plaie",
    "gratte"
  ],
  "abdo_enf": [
    "douleur abdominale",
    "ventre",
    "mal au ventre",
    "vers",
    "colique",
    "constipation",
    "ballonnement",
    "enfant ventre"
  ],
  "abdo_adu": [
    "douleur abdominale",
    "ventre",
    "mal au ventre",
    "colique",
    "constipation",
    "colique néphrétique",
    "douleur lombaire",
    "reins",
    "appendicite",
    "douleur du bas ventre"
  ],
  "vomissements": [
    "vomissements",
    "vomir",
    "vomit",
    "nausées",
    "nausee",
    "envie de vomir",
    "vomissements grossesse"
  ],
  "dents": [
    "dent",
    "dents",
    "carie",
    "gencive",
    "abcès dentaire",
    "mâchoire",
    "rage de dents",
    "joue gonflée",
    "douleur dentaire",
    "mal aux dents"
  ],
  "oreille_adu": [
    "oreille",
    "otalgie",
    "écoulement oreille",
    "otite",
    "surdité",
    "bouchon cérumen",
    "cérumen",
    "oreillons",
    "parotide",
    "bourdonnement",
    "acouphène"
  ],
  "asthme": [
    "asthme",
    "sifflement",
    "crise d'asthme",
    "dyspnée",
    "essoufflement",
    "étouffement",
    "oppression",
    "respiration sifflante"
  ],
  "anemie": [
    "anémie",
    "anemie",
    "pâleur",
    "paleur",
    "fatigue",
    "pâle",
    "asthénie",
    "paumes pâles",
    "faiblesse",
    "vertiges fatigue"
  ],
  "dyspnee_enf": [
    "difficulté à respirer",
    "difficultes respiratoires",
    "dyspnée",
    "dyspnee",
    "essoufflement",
    "respiration difficile",
    "respiration rapide",
    "détresse respiratoire",
    "étouffement",
    "etouffe",
    "tirage",
    "corps étranger gorge",
    "fausse route"
  ],
  "convuls_enf": [
    "convulsion",
    "convulsions",
    "crise convulsive",
    "crise",
    "épilepsie",
    "epilepsie",
    "spasmes",
    "raideur",
    "tétanos",
    "tetanos",
    "hypocalcémie",
    "tétanie",
    "yeux révulsés",
    "fièvre convulsion"
  ],
  "ictere_enf": [
    "ictère",
    "ictere",
    "jaunisse",
    "yeux jaunes",
    "jaune",
    "nouveau-né jaune",
    "hépatite",
    "hepatite",
    "urines foncées"
  ],
  "poids_enf": [
    "poids faible",
    "maigreur",
    "maigre",
    "amaigrissement",
    "malnutrition",
    "dénutrition",
    "denutrition",
    "obésité",
    "obesite",
    "trop gros",
    "surpoids",
    "retard de croissance",
    "kwashiorkor"
  ],
  "oeil_enf": [
    "œil",
    "oeil",
    "yeux",
    "rouge œil",
    "oeil rouge",
    "conjonctivite",
    "orgelet",
    "paupière",
    "vision",
    "larmoiement",
    "corps étranger œil",
    "pus oeil",
    "blépharite"
  ],
  "urinaire_enf": [
    "urines",
    "uriner",
    "urinaire",
    "pipi",
    "énurésie",
    "enurésie",
    "brûlure en urinant",
    "phimosis",
    "prépuce",
    "bilharziose",
    "sang dans les urines",
    "rétention urine",
    "organes génitaux"
  ],
  "dyspnee_adu": [
    "dyspnée",
    "dyspnee",
    "essoufflement",
    "difficulté à respirer",
    "respiration difficile",
    "souffle court",
    "œdème pulmonaire",
    "oedeme aigu poumon",
    "étouffement",
    "point de côté",
    "oppression"
  ],
  "convuls_adu": [
    "convulsion",
    "convulsions",
    "crise convulsive",
    "épilepsie",
    "epilepsie",
    "éclampsie",
    "eclampsie",
    "crise",
    "perte de connaissance",
    "mouvements involontaires",
    "hypoglycémie",
    "tétanie"
  ],
  "ictere_adu": [
    "ictère",
    "ictere",
    "jaunisse",
    "yeux jaunes",
    "jaune",
    "hépatite",
    "hepatite",
    "fièvre jaune",
    "cirrhose",
    "urines foncées",
    "foie"
  ],
  "amaigrissement": [
    "amaigrissement",
    "maigrir",
    "perte de poids",
    "poids perdu",
    "fonte musculaire",
    "maigreur",
    "je maigris"
  ],
  "bas_ventre_f": [
    "bas ventre",
    "bas-ventre",
    "douleur pelvienne",
    "douleurs pelviennes",
    "règles douloureuses",
    "femme enceinte douleur",
    "grossesse extra utérine",
    "avortement",
    "fausse couche",
    "appendicite",
    "hernie",
    "dysménorrhée",
    "dysmenorrhee",
    "endométrite",
    "fibrome"
  ],
  "saignement_vag": [
    "saignement vaginal",
    "saignement",
    "hémorragie vaginale",
    "hemorragie vaginale",
    "métrorragie",
    "metrorragie",
    "sang vagin",
    "perte de sang",
    "règles abondantes",
    "saigne",
    "placenta praevia"
  ],
  "regles": [
    "règles",
    "regles",
    "menstruations",
    "aménorrhée",
    "amenorrhee",
    "retard de règles",
    "absence de règles",
    "ménopause",
    "menopause",
    "dysménorrhée",
    "règles irrégulières",
    "cycle"
  ],
  "sein": [
    "sein",
    "seins",
    "masse sein",
    "boule sein",
    "mastite",
    "abcès sein",
    "abces du sein",
    "allaitement douleur",
    "nodule sein"
  ],
  "post_partum": [
    "accouchement",
    "après accouchement",
    "post-partum",
    "hémorragie du post-partum",
    "delivrance",
    "délivrance",
    "rétention placentaire",
    "atonie",
    "saignement après accouchement",
    "suites de couches"
  ],
  "urinaire_adu": [
    "urines",
    "uriner",
    "urinaire",
    "brûlure en urinant",
    "brulure mictionnelle",
    "cystite",
    "pyélonéphrite",
    "prostate",
    "prostatite",
    "rétention urine",
    "incontinence",
    "sang dans les urines",
    "phimosis",
    "bilharziose",
    "envie fréquente d'uriner",
    "pollakiurie"
  ],
  "oeil_adu": [
    "œil",
    "oeil",
    "yeux",
    "œil rouge",
    "conjonctivite",
    "orgelet",
    "paupière",
    "vision",
    "baisse de la vue",
    "glaucome",
    "larmoiement",
    "corps étranger œil",
    "blépharite"
  ],
  "bourse": [
    "bourse",
    "bourses",
    "scrotum",
    "testicule",
    "testicules",
    "orchite",
    "hydrocèle",
    "hydrocele",
    "hernie",
    "torsion testiculaire",
    "testicule gonflé"
  ],
  "constipation": [
    "constipation",
    "constipé",
    "selles dures",
    "pas de selles",
    "fécalome",
    "lavement",
    "ballonnement constipation"
  ],
  "oedemes": [
    "œdème",
    "oedème",
    "oedeme",
    "gonflement",
    "gonflé",
    "jambes gonflées",
    "pieds gonflés",
    "visage bouffi",
    "ascite",
    "kwashiorkor",
    "prééclampsie"
  ],
  "intoxication": [
    "intoxication",
    "empoisonnement",
    "poison",
    "ingestion",
    "avalé",
    "alcool",
    "ivresse",
    "raticide",
    "pesticide",
    "pétrole",
    "pile",
    "surdosage",
    "produit caustique",
    "eau de javel",
    "champignon"
  ],
  "nez": [
    "nez",
    "écoulement nasal",
    "ecoulement nasal",
    "nez qui coule",
    "nez bouché",
    "rhume",
    "rhinite",
    "sinusite",
    "épistaxis",
    "epistaxis",
    "saignement de nez",
    "éternuement",
    "allergie nez",
    "corps étranger nez",
    "rhinopharyngite"
  ],
  "bouche": [
    "bouche",
    "plaie bouche",
    "aphte",
    "aphtes",
    "gingivite",
    "gencive",
    "gencives",
    "muguet",
    "candidose",
    "herpès",
    "herpes",
    "stomatite",
    "langue",
    "lèvre",
    "ulcération bouche",
    "plaie dans la bouche"
  ],
  "lymphoedeme": [
    "grosse jambe",
    "lymphoedème",
    "lymphoedeme",
    "éléphantiasis",
    "elephantiasis",
    "filariose",
    "jambe gonflée",
    "gros pied",
    "jambe énorme"
  ]
};
