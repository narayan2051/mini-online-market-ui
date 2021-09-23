export const CURRENT_OFFICE = "currentOffice";
export const OTHER_OFFICE = "otherOffice";
export const MALE = "MALE";
export const FEMALE = "FEMALE";
export const NEW_PATIENT = "NEW_PATIENT";
export const PREVIOUS_PATIENT = "PREVIOUS_PATIENT";
export const MUL_DARTA_NUMBERS_LIST = "MUL_DARTA_NUMBERS_LIST";
export const VILLAGE_DARTA_NUMBERS_LIST = "VILLAGE_DARTA_NUMBERS_LIST";
export const INPATIENT_NUMBERS_LIST = "INPATIENT_NUMBER_LIST";
export const DEFAULT = "DEFAULT";
export const OTHER = "OTHER";
export const HEALTH_POST = "HEALTH_POST";
export const GENERAL = "GENERAL";
export const DANGER = "DANGER";
export const CRITICAL = "CRITICAL";
export const FIRST_DOSE = "FIRST_DOSE";
export const SECOND_DOSE = "SECOND_DOSE";
export const THIRD_DOSE = "THIRD_DOSE";
export const FOURTH_DOSE = "FOURTH_DOSE";
export const FIFTH_DOSE = "FIFTH_DOSE";
export const SIXTH_DOSE = "SIXTH_DOSE";
export const SEVENTH_DOSE = "SEVENTH_DOSE";
export const GRANTED = "GRANTED";
export const NOT_GRANTED = "NOT_GRANTED";
export const NEPALI_MONTH_LIST = ["SHRAWAN", "BHADAU", "ASWIN", "KARTIK", "MANSIR", "POUSH", "MAGH", "FALGUN", "CHAITRA", "BAISHAKH", "JESTHA", "ASAR"];
export const GENTAMYCIN_DOSES = [FIRST_DOSE, SECOND_DOSE, THIRD_DOSE, FOURTH_DOSE, FIFTH_DOSE, SIXTH_DOSE, SEVENTH_DOSE];
export const OTHER_LOCATION = "OTHER_LOCATION";
export const OUT_PATIENT_MAIN_REGISTER_SERVICE_CODE = "1";
export const IMCI_MAIN_REGISTER_SERVICE_CODE = "2";
export const BALBALIKA_POSAN_MAIN_REGISTER_SERVICE_CODE = "3";
export const SAFE_MOTHERHOOD_MAIN_REGISTER_SERVICE_CODE = "4";
export const PARIWAAR_NIYOJAN_MAIN_REGISTER_SERVICE_CODE = "5";
export const TUBERCULOSIS_MAIN_REGISTER_SERVICE_CODE = "6";
export const LEPROSY_MAIN_REGISTER_SERVICE_CODE = "7";
export const KEETJANYA_ROG_MAIN_REGISTER_SERVICE_CODE = "8";
export const BALBALIKA_POSAN_VILLAGE_CLINIC_SERVICE_CODE = "2";
export const PARIWAAR_NIYOJAN_VILLAGE_CLINIC_SERVICE_CODE = "4";
export const PRATHAAMIK_UPACHAR_VILLAGE_CLINIC_SERVICE_CODE = "5";
export const SAFE_MOTHERHOOD_VILLAGE_CLINIC_SERVICE_CODE = "3";
export const ANTIBIOTIC = "ANTIBIOTIC";
export const VALID_AGE_FOR_CHILDREN = "बालरोग व्यवस्थापनको लागि उमेर ५९ महिना भन्दा कम हुनुपर्दछ";
export const POSITIVE = "POSITIVE";
export const NEGATIVE = "NEGATIVE";

export const VACCINE_TYPES = [
  { value: "BCG_VACCINE", label: "बि.सि.जि" },
  { value: "DPT_HEPABI_HIB_VACCINE", label: "डि.पि.टि./हेप बि/हिब" },
  { value: "POLIO_VACCINE", label: "पोलियो(OPV)" },
  { value: "PCV_VACCINE", label: "पि.सि.भि.(PCV)" },
  { value: "ROTA_VACCINE", label: "रोटा" },
  { value: "FIPV_VACCINE", label: "एफ.आई.पि.भि." },
  { value: "DADURA_RUBELA_VACCINE", label: "दादुरा/रुबेला" },
  { value: "JE_VACCINE", label: "जे.ई." },
  { value: "TD_VACCINE", label: "टी.डी." }
];

export const BREAST_FEEDING_BEFORE_AND_ABOVE_SIX_MONTH = [
  { value: "YES", label: "गराएको" },
  { value: "NO", label: "नगराएको" }
]

export const AGE_CATEGORY = [
  { value: "LESS_THAN_OR_EQUAL_TO_28_DAYS", label: "<= 28 Days" },
  { value: "BETWEEN_1_AND_11_MONTH", label: "1-11 Months" },
  { value: "MORE_THAN_ONE_YEAR", label: "> 1 Year" },
];

export const SOURCE_OF_ADMISSION = [
  { value: "EMERGENCY_DEPARTMENT", label: "आकस्मित विभाग(१)" },
  { value: "OPD_DEPARTMENT", label: "बहिरंग विभाग(२)" },
  { value: OTHER, label: "अन्य(३)" },
];

export const SON_OR_DAUGHTER = [
  { value: "MALE", label: "छोरा" },
  { value: "FEMALE", label: "छोरी" }
];

export const CHILD_CONDITION = [
  { value: "NORMAL", label: "Normal" },
  { value: "ASPHYXIATED", label: "Asphyxiated" },
  { value: "HYPOHTERMIA", label: "Hypohtermia" },
  { value: "JAUNDICE", label: "Jaundice" }
];

export const NEPALI_MONTHS = [
  { value: "BAISHAKH", label: "बैशाख" },
  { value: "JESTHA", label: "जेठ" },
  { value: "ASAR", label: "असार" },
  { value: "SHRAWAN", label: "श्रावण" },
  { value: "BHADAU", label: "भदौ" },
  { value: "ASWIN", label: "आश्विन" },
  { value: "KARTIK", label: "कार्तिक" },
  { value: "MANSIR", label: "मंसिर" },
  { value: "POUSH", label: "पुष" },
  { value: "MAGH", label: "माघ" },
  { value: "FALGUN", label: "फाल्गुन" },
  { value: "CHAITRA", label: "चैत्र" }
];

export const SEWA_CATEGORY = [
  { value: "PATHOLOGY", label: "प्याथोलोजी" },
  { value: "RADIOLOGY", label: "रेडियोलोजी" },
  { value: "EMERGENCY", label: "इमरजेन्सि" },
  { value: "OPD", label: "ओ.पी.डी" },
];

export const KhakarParikshanKaran = [
  { value: "ROGNIDAN", label: "रोग निदान" },
  { value: "isRRTBMDR", label: "RR TB/MDR हो" },
  { value: "notRRTBMDR", label: "RR TB/MDR होइन" }
];

export const KhakarParikshanPahilaLiyekoNaLiyeko = [
  { value: "PAHILALIYEKO", label: "पहिले लिएको" },
  { value: "PAHILANALIYEKO", label: "पहिले नलिएको" },
  { value: "THAHANAVAYEKO", label: "थाहा नभएको" }
];

export const PRESAN_OPTIONS = [
  { value: "P", label: "निजी स्वास्थ्य संस्था (P)" },
  { value: "C", label: "समुदाय(C)" },
  { value: "T", label: "सम्पर्क परीक्षण (T)" }
];

export const TB_ROG_OPTIONS = [
  { value: "PBC", label: "PBC" },
  { value: "PCD", label: "PCD" },
  { value: "EP", label: "EP" }
];

export const TB_PATIENT_ENTRY_CATEGORIES = [
  { value: "NEW", label: "New" },
  { value: "RELAPSE", label: "Relapse" },
  { value: "TREATMENT_AFTER_FAILURE", label: "Treatment After Failure" },
  { value: "TREATMENT_AFTER_LOST_TO_FOLLOW_UP", label: "Treatment After Lost to Follow‐up" },
  { value: "OTHERS_PREVIOUSLY_TREATED", label: "Others Previously Treated" },
  { value: "PREVIOUS_TREATMENT_HISTORY_UNKNOWN", label: "Previous Treatment History Unknown" }
];

export const BASIS_OF_ADMISSION = [
  { value: "MUAC", label: "एम.यु.ए.सि(मि.मि.)" },
  { value: "Z_SCORE", label: "उ.अ. तौल(Z-Score)" },
  { value: "BOTH_LEGS_SWOLLEN", label: "दुवै खुट्टा सुन्निएको" }
]

export const COUNSELLING_TO_MOTHER_FOR_CHILD_ABOVE_TWO_MONTH = [
  { value: "REGULAR_FOLLOW_UP", label: "Regular Follow up" },
  { value: "IMMEDIATE_VISIT", label: "Immediate Visit" },
  { value: "FLUID", label: "Fluid" },
  { value: "FOOD", label: "Food" },
];

export const COUNSELLING_TO_MOTHER_FOR_CHILD_BELOW_TWO_MONTH = [
  { value: "REGULAR_FOLLOW_UP", label: "Regular Follow up" },
  { value: "IMMEDIATE_VISIT", label: "Immediate Visit" },
  { value: "KEEP_WARM", label: "Keep Warm" },
  { value: "BREAST_FEEDING", label: "Breast Feeding" }
]

export const TB_TREATMENT_CATEGORY = [
  { value: "FIRST_LINE_DRUG_CAT_I", label: "First Line Drugs (Cat I)" },
  { value: "RE_TREATMENT_FIRST_LINE_DRUG_CAT_II", label: "Retreatment First Line Drugs (Cat II)" },
  { value: "CAT_I", label: "Cat I" },
  { value: "CAT_II", label: "Cat II" },
  { value: "CAT_III", label: "Cat III" },
  { value: "SECOND_LINE_TREATMENT_REGIMEN", label: "Second Line Treatment Regimen" }
];

export const tbTreatmentOutcomeOptions = [
  { value: "CURED", label: "Cured" },
  { value: "TREATMENT_COMPLETED", label: "Treatment Completed" },
  { value: "TREATMENT_FAILURE", label: "Treatment Failure" },
  { value: "DIED", label: "Died" },
  { value: "LOST_TO_FOLLOW_UP", label: "Loss to follow up" },
  { value: "NOT_EVALUATED", label: "Not Evaluated" },
];

export const EMERGENCY_SERVICE_OUTCOME_OPTIONS = [
  { value: "RECOVERED", label: "Recovered (1)" },
  { value: "NOT_IMPROVED", label: "Not Improved (2)" },
  { value: "REFERRED", label: "Reffered (3)" },
  { value: "DOR_OR_LAMA_OR_DAMA", label: "DOR/LAMA/DAMA (4)" },
  { value: "ABSCONDED", label: "Absconded (5)" },
  { value: "ADMITTED_IN_INTIMATE_ROOM", label: "Admitted in Intimate Room (6)" },
  { value: "DEATH", label: "Death (7)" }
];

export const INVESTIGATION_MONTH = [
  { value: "AFTER_TWO_MONTHS", label: "दोस्रो महिना" },
  { value: "AFTER_THREE_MONTHS", label: "तेस्रो महिना" },
  { value: "AFTER_FIVE_MONTHS", label: "पाचौ महिना" },
  { value: "AT_LAST", label: "अन्त्यमा" }
];

export const smearCultureXpert = [
  { value: "Smear", label: "Smear" },
  { value: "Culture", label: "Culture" },
  { value: "Xpert", label: "Xpert" }
];

export const STATUS_KNOWN = [
  { value: "YES", label: "भएको" },
  { value: "NO", label: "नभएको" },
  { value: "UNKNOWN", label: "थाहा नभएको" }
];

// TODO: Sandeep - YES_NO_OPTIONS constant is already present in the constants/index.js. Since labels are different we have to add this one too. Once the YES_NO_OPTION component is made, the single constant will remain.
export const YES_OR_NO_OPTION = [
  { value: "YES", label: "हो" },
  { value: "NO", label: "होइन" },
];

export const CONGENITAL_ANOMALIES = [
  { value: "mastiskakoPuraBhagNabhayeko", label: "मस्तिष्कको पुरा भाग नभएको" },
  { value: "othKhude", label: "ओठ खुँडे हुनु" },
  { value: "taluKhude", label: "तालु खुँडे हुनु" },
  { value: "othAndTaluKhude", label: "ओठ र तालु खुँडे हुनु" },
  { value: "bandaGudadwar", label: "बन्द गुदद्वार" },
  { value: "ghodeKhude", label: "घोडे खुँडे" },
  { value: "moningomailosil", label: "मोनिङ्गोमाइलोसिल" },
  { value: "hydrokefalas", label: "हाइड्रोकेफालस" }
];

export const LEPROSY_TYPES = [
  { value: "MB", label: "कुष्ठरोग एम.वि" },
  { value: "PB", label: "कुष्ठरोग पी.वि" }
];

export const DISEASE_DETECTED_METHODS = [
  { value: "VOLUNTARILY", label: "Voluntarily" },
  { value: "REFERRED", label: "Refer" },
  { value: "CONTACT_EXAMINATION", label: "Contact Examination" },
  { value: OTHER, label: "Others" }
];

export const KUSTHAROG_PATIENT_TYPES = [
  { value: "NEW", label: "New Patient" },
  { value: "RELAPSE", label: "Relapse" },
  { value: "RE_STARTER", label: "Re-starter" },
  { value: "TRANSFER_IN", label: "Transfer in" },
  { value: "CLASSIFICATION_CHANGE", label: "Classification change" }
];

export const KUSTHAROG_UNCOOPERATION_LEVEL = [
  { value: "0", label: "0" },
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "NOT_CHECKED", label: "नाजाँचेको" }
];

export const KUSTHAROG_PATIENT_REMOVAL_OPTIONS = [
  { value: "RFT", label: "Release From Treatment-RFT" },
  { value: "TO", label: "Transfer Out-TO" },
  { value: "DF", label: "Defaulter- DF" },
  { value: "OD", label: "Other Deduction-OD" }
];

export const KUSTHAROG_SMEAR_RESULTS = [
  { value: "ONE_PLUS", label: "+" },
  { value: "TWO_PLUS", label: "++" },
  { value: "THREE_PLUS", label: "+++" },
  { value: "FOUR_PLUS", label: "++++" },
  { value: "FIVE_PLUS", label: "+++++" },
  { value: "SIX_PLUS", label: "++++++" },
  { value: "NEGATIVE", label: "-ve" }
];

export const MOTHER_SITUATION = [
  { value: "garbhawastha", label: "गर्भावस्था" },
  { value: "sutkeri", label: "सुत्केरी अवस्था" },
  { value: "prasuti", label: " प्रसूती अवस्था" }
];

export const HIV_STATUS = [
  { value: "POSITIVE", label: "+ve" },
  { value: "NEGATIVE", label: "-ve" },
  { value: "UNKNOWN", label: "UNKNOWN" }
]

export const IUCD_IMPLANT_CONDITION_DURING_TOOL_PLACEMENT = [
  { value: "WITHIN_FORTY_EIGHT_HOURS_OF_DELIVERY", label: "सुत्केरी भएको ४८ घण्टा भित्र" },
  { value: OTHER, label: "अन्य" }
]

export const PLACED_ORGANIZATION = [
  { label: "यहि", value: CURRENT_OFFICE },
  { label: "अन्य", value: OTHER_OFFICE }
]

export const SEWA_TYPES = [
  { label: "IUCD", value: "iucd" },
  { label: "Implant", value: "implant" }
]

export const ORGANIZATION_TYPE = [
  { label: "सरकारी", value: "GOVERNMENTAL" },
  { label: "गैर सरकारी", value: "NON_GOVERNMENTAL" }
]

export const SERVICE_PROVIDERS = [
  { label: "संस्था", value: "ORGANIZATION" },
  { label: "शिविर", value: "CAMP" }
]

export const TB_LAB_RESULT_TIME_PERIOD = [
  { label: "At The Beginning", value: "At The Beginning" },
  { label: "2 or 3 Months", value: "2 or 3 Months" },
  { label: "5 Months", value: "5 Months" },
  { label: "At The End", value: "At The End" }
]

export const FREE_SERVICE_CODE = [
  { label: "अति गरिव/गरिव (१)", value: "1" },
  { label: "असहाय (२)", value: "2" },
  { label: "आपङ्ग (३)", value: "3" },
  { label: "जेष्ठ नागरिक (४)", value: "4" },
  { label: "म.स्वा.स्व.से (५)", value: "5" },
  { label: "अन्य (६)", value: "6" }
]


export const ICD_CODE_OPTIONS = [
  {
    label: "A. Communicable, Immunizable",
    options: [
      { label: "Measles", value: "B05.9" },
      { label: "Diptheria", value: "A36.9" },
      { label: "Whooping Cough", value: "A37.9" },
      { label: "Neonatal Tetanus", value: "A33" },
      { label: "Tetanus", value: "A35" },
      { label: "Tuberculosis", value: "A16.9" },
      { label: "Acute Flaccid Paralysis (AFP)", value: "G83" },
      { label: "Rubella", value: "B06.9" },
      { label: "Mumps", value: "B26.9" },
      { label: "Chicken Pox", value: "B01.9" },
      { label: "Hepatitis B", value: "B16.9" }
    ]
  },
  {
    label: "B. Communicable, Vector Borne",
    options: [
      { label: "Acute Encephalitis like Syndrome (AES)", value: "A86" },
      { label: "Filariasis", value: "B74.9" },
      { label: "Clinical Malaria", value: "B54" },
      { label: "Malaria (Plasmodium Falciparum)", value: "B50.9" },
      { label: "Malaria (Plasmodium Vivax)", value: "B51.9" },
      { label: "Dengue Fever", value: "A90" },
      { label: "Kala‐azar/Leshmaniasis", value: "B55.9" }
    ]
  }
  ,
  {
    label: "C. Communicable, Water/Food Borne",
    options: [
      { label: "Typhoid (Enteric Fever)", value: "A01.0" },
      { label: "Acute gastro‐enteritis (AGE)", value: "A09" },
      { label: "Ameobic Dysentery/Amoebiasis", value: "A06.9" },
      { label: "Bacillary Dysentery/Shigellosis", value: "A03.9" },
      { label: "Presumed non‐infectious diarrhoea", value: "K52.9" },
      { label: "Cholera", value: "A00.9" },
      { label: "Intestinal Worms", value: "B82.9" },
      { label: "Jaundice", value: "R17" },
      { label: "Hepatitis A", value: "B15.9" },
      { label: "Hepatitis E", value: "B17" },
      { label: "Volume Depletion (Dehydration)", value: "E86" }
    ]
  },
  {
    label: "D. Other Communicable Diseases",
    options: [
      { label: "Leprosy", value: "A30.9" },
      { label: "Meningitis", value: "G03.9" }
    ]
  },
  {
    label: "E. HIV/STI",
    options: [
      { label: "HIV Infection", value: "B20" },
      { label: "Urethral Discharge Syndrome (UDS) Gonococal", value: "A54" },
      { label: "Scrotal Swelling Syndrome (SSS)", value: "N49" },
      { label: "Vaginal Discharge Syndrome (VDS)", value: "N89.8" },
      { label: "Lower Abdominal Pain Syndrome (LAPS)", value: "N74" },
      { label: "Neonatal Conjuctive Syndrome (NCS)", value: "A54.3" },
      { label: "Genital User Disease Syndrome (GUDS) ‐ female", value: "N76.6" },
      { label: "Genital User Disease Syndrome (GUDS) ‐ male", value: "N50.8" },
      { label: "Inguinal Bubo Syndrome (IBS)", value: "A55" },
      { label: "Syphilis", value: "A51" }
    ]
  },
  {
    label: "F. Other Infected Diseases",
    options: [
      { label: "ARI/Lower respiratory tract infection (LRTI)", value: "J22" },
      { label: "Upper respiratory tract infection (URTI)", value: "J06" },
      { label: "Pneumonia", value: "J18" },
      { label: "Severe pneumonia", value: "J15" },
      { label: "Bronchitis (Acute & chronic)", value: "J40" },
      { label: "Urinary Tract Infection (UTI)", value: "N39" },
      { label: "Viral Influenza", value: "J11" },
      { label: "Reproductive Tract Infection (RTI) ‐ Female", value: "N99" },
      { label: "Reproductive Tract Infection (RTI) ‐ Male", value: "N51*" }
    ]
  },
  {
    label: "G. Nutritional & Metabolic Disorder",
    options: [
      { label: "Goitre, Cretinism", value: "E04" },
      { label: "Diabetes Mellitus (DM)", value: "E14" },
      { label: "Malnutrition", value: "E46" },
      { label: "Avitaminoses & other nutrient deficiency", value: "E50" },
      { label: "Obesity", value: "E66" },
      { label: "Anaemia/Polyneuropathy", value: "D64" },
      { label: "Polyneuritis", value: "G62" }
    ]
  },
  {
    label: "H. Skin Diseases",
    options: [
      { label: "Acne", value: "L70" },
      { label: "Warts", value: "B07" },
      { label: "Chloasma/ melasma", value: "L81.1" },
      { label: "Urticaria", value: "L50" },
      { label: "Dermatitis/Eczema", value: "L30.9" },
      { label: "Alopecia", value: "L65" },
      { label: "Vitiligo", value: "L80" },
      { label: "Albinism", value: "E70.3" },
      { label: "Herpes simplex", value: "B00" },
      { label: "Herpes zoster", value: "B02" },
      { label: "Erythroderma", value: "L53.9" },
      { label: "Impetigo", value: "L01.0" },
      { label: "Boils", value: "L02" },
      { label: "Abscess", value: "L02.0" },
      { label: "Furunculosis", value: "L02.9" },
      { label: "Fungal infection (Lichen planus)", value: "L43" },
      { label: "Scabies", value: "B86" },
      { label: "Leukoderma", value: "L81.5" },
      { label: "Psoriasis", value: "L40" },
      { label: "Acute Lymphadenitis", value: "L04" }
    ]
  },
  {
    label: "I. Ear, Nose and Throat Infection",
    options: [
      { label: "Acute Suppurative Otitis Media", value: "H66.0" },
      { label: "Chronic Suppurative Otitis Media", value: "H66.1" },
      { label: "Sinusitis", value: "J32" },
      { label: "Acute Tonsilitis", value: "J03" },
      { label: "Pharyngitis/Sore throat", value: "J02" },
      { label: "Foreign body in ear", value: "T16" },
      { label: "Foreign body in nose", value: "T17.1" },
      { label: "Foreign body in throat", value: "T17.2" },
      { label: "Wax", value: "H61.2" },
      { label: "Nasal Polyps", value: "J33" },
      { label: "Deviated nasal septum (DNS)", value: "J34.2" },
      { label: "Rhinitis", value: "J31" },
      { label: "Otitis externa", value: "H60" },
      { label: "Reflux laryngitis", value: "K21.0" }
    ]
  },
  {
    label: "J. Oral Health Related Problems",
    options: [
      { label: "Dental caries", value: "K02" },
      { label: "Toothache", value: "K08.8" },
      { label: "Periodontal disease (gum disease)", value: "K05" },
      { label: "Other disorder of teeth", value: "K08.9" },
      { label: "Oral ulcer (Aphthous & herpetic)", value: "K12" },
      { label: "Tooth impaction", value: "K01.1" },
      { label: "Hypoplasia", value: "K00.4" },
      { label: "Leukoplakia", value: "K13.2" },
      { label: "Fungal infection (candidiasis)", value: "B37" },
      { label: "Oral space infection & abscess", value: "K04" }
    ]
  },
  {
    label: "K. Eye Problems",
    options: [
      { label: "Conjunctivitis", value: "H10" },
      { label: "Trachoma", value: "A71" },
      { label: "Cataract", value: "H26" },
      { label: "Blindness", value: "H54" },
      { label: "Refractive error", value: "H52" },
      { label: "Glaucoma", value: "H40" },
      { label: "Colour blindness", value: "H53.5" },
      { label: "Exophthalmos", value: "H05.2" },
      { label: "Sty", value: "H00.0" },
      { label: "Chalazion", value: "H00.1" },
      { label: "Pterygium", value: "H11.0" },
      { label: "Diabetic retinopathy", value: "E14.3†" },
      { label: "Hypertensive retinopathy", value: "H35" },
      { label: "Entropion", value: "H02" },
      { label: "Ectropion", value: "H02.1" },
      { label: "Traumatic eye disease", value: "H26.1" },
      { label: "Uveitis", value: "H20" },
      { label: "Macular degeneration (age related)", value: "H35.3" },
      { label: "Amblyopia (Lazy eye)", value: "H53.0" },
      { label: "Squint", value: "H50" },
      { label: "Retinitis pigmentosa", value: "H35.5" },
      { label: "Nightblindness/visual disturbance", value: "H53.6" },
      { label: "Retinoblastoma", value: "C69.2" }
    ]
  },
  {
    label: "L. Obstetrics Complications",
    options: [
      { label: "Ectopic Pregnancy", value: "O00" },
      { label: "Abortion Complication", value: "O08" },
      { label: "Pregnancy Induced Hypertension (PIH)", value: "O13" },
      { label: "Severe/ Pre‐eclampsia", value: "O14" },
      { label: "Antepartum Eclampsia", value: "O15.0" },
      { label: "Intrapartum Eclampsia", value: "O15.1" },
      { label: "Postpartum Eclampsia", value: "O15.2" },
      { label: "Hyperemesis Grivadarum", value: "O21" },
      { label: "Antepartum Haemorrhage", value: "O46" },
      { label: "Prolonged labour", value: "O63" },
      { label: "Obstructed Labor", value: "O64‐O66" },
      { label: "Ruptured Uterus", value: "S37" },
      { label: "Postpartum Haemorrhage", value: "O72" },
      { label: "Retained Placenta", value: "O73" },
      { label: "Other Complications of labor and delivery", value: "O75" },
      { label: "Pueperal Sepsis", value: "O85" }
    ]
  },
  {
    label: "M. Gynae Problems",
    options: [
      { label: "Pelvic Inflammatory Disease (PID)", value: "N73" },
      { label: "Prolapsed uterus", value: "N81.4" },
      { label: "Menstrual disorder", value: "N92" },
      { label: "Disfunctional Uterine Bleeding (DUB)", value: "N93" },
      { label: "Sub‐ fertility (Female)", value: "N97" },
      { label: "Sub‐ fertility/ infertility (Male)", value: "N46" }
    ]
  },
  {
    label: "N. Mental Health related problems",
    options: [
      { label: "Dementia", value: "F03" },
      { label: "Addiction (ch. acoholisim, Dipsomania, drug)", value: "F10" },
      { label: "Schizophrenia", value: "F20" },
      { label: "Psychosis", value: "F29" },
      { label: "Bipolar affective disorder", value: "F31" },
      { label: "Depression", value: "F32" },
      { label: "Phobic Anxiety", value: "F40" },
      { label: "Other Anxiety", value: "F41" },
      { label: "Obsessive ‐ compulsive disorder", value: "F42" },
      { label: "Conversive disorder (Hysteria)", value: "F44" },
      { label: "Neurosis", value: "F48" },
      { label: "Mental retardation", value: "F79" },
      { label: "Epilepsy", value: "G40" },
      { label: "Migraine", value: "G43" },
      { label: "Mental illness (mental disorder)", value: "F99" }
    ]
  },
  {
    label: "O. Malignancy",
    options: [
      { label: "Breast cancer", value: "C50" },
      { label: "Cervical/ uteri cancer", value: "C53" },
      { label: "Lung/ brunchial Cancer", value: "C34" },
      { label: "Oesophagus cancer", value: "C15" },
      { label: "Stomach cancer", value: "C16" },
      { label: "Thyroid cancer", value: "C73" },
      { label: "Liver cancer", value: "C22" },
      { label: "Pancreatic cancer", value: "C25" },
      { label: "Bone/ bone marrow cancer", value: "C79.5" },
      { label: "Gall bladder cancer", value: "C23" },
      { label: "Colorectal (colon with rectum) cancer", value: "C19" },
      { label: "Oral cancer", value: "C06" },
      { label: "Lymphoma cancer", value: "C85" },
      { label: "Ovary cancer", value: "C56" },
      { label: "Urinary bladder cancer", value: "C67" },
      { label: "Nasopharyngeal cancer", value: "C11" },
      { label: "Head & neck cancer", value: "C49.0" },
      { label: "Other Cancer", value: "C80" }
    ]
  },
  {
    label: "P. Cardiovascular & Respiratory Related Problems",
    options: [
      { label: "Hypertension", value: "I10" },
      { label: "Congestive heart failure", value: "I50.0" },
      { label: "Cardiac heart failure", value: "I50.9" },
      { label: "Chronic Obstructive Pulmonary Disease (COPD)", value: "J44" },
      { label: "Acute rheumatic fever", value: "I01" },
      { label: "Rheumatic heart disease (RHD)", value: "I09" },
      { label: "Ischemic heart disease", value: "I24" },
      { label: "Other cardiovascular problems", value: "I52*" },
      { label: "Bronchial asthma", value: "J45" }
    ]
  },
  {
    label: "Q. Other Diseases & Injuries",
    options: [
      { label: "Acute Renal failure", value: "N17" },
      { label: "Chronic Renal failure", value: "N18" },
      { label: "Nephritis", value: "N05" },
      { label: "Nephrotic syndrome", value: "N04" },
      { label: "Headache", value: "R51" },
      { label: "Pyrexia of Unknown Origin (PUO)", value: "R50" },
      { label: "Gastritis (APD)", value: "K29" },
      { label: "Insect/Wasp bite", value: "W57" },
      { label: "Abdominal Pain", value: "R10" },
      { label: "Cirrhosis of liver", value: "K74" },
      { label: "Burns and Scalds", value: "T30" },
      { label: "Toxic Effect", value: "T65" },
      { label: "Dog Bite", value: "W54" },
      { label: "Other rabies susceptible animal bite", value: "A82" },
      { label: "Snake bite: Poisonous", value: "T63.0" },
      { label: "Snake bite: Non‐poisonous", value: "W59" },
      { label: "Physical Disability (Disabled Person)", value: "Z73" }
    ]
  },
  {
    label: "R. Orthopaedic Problems",
    options: [
      { label: "Falls/ injuries/ fractures", value: "T14" },
      { label: "Road Traffic Accident (RTA)", value: "V89" },
      { label: "Rheumatoid arthritis", value: "M06" },
      { label: "Arthritis", value: "M13" },
      { label: "Osteo arthrosis", value: "M19" },
      { label: "Back ache (musculo‐ skeletal pain)", value: "M54.9" }
    ]
  },
  {
    label: "S. Surgical Problems",
    options: [
      { label: "Acid peptic disorders", value: "K27" },
      { label: "Anal Fissure", value: "K60.2" },
      { label: "Anal fistula", value: "K60.3" },
      { label: "Fistula of Intestine", value: "K63.2" },
      { label: "Renal stones", value: "N20.0" },
      { label: "Breast lumps (adenoma)", value: "N63" },
      { label: "Mastitis (Ignored breast)/breast abscess", value: "N61" },
      { label: "Mastalgia breast", value: "N64.4" },
      { label: "Lumps (lipoma)", value: "D17" },
      { label: "Sebaceous cyst", value: "L72.1" },
      { label: "Pilonidal sinus", value: "L05" },
      { label: "Appendicitis", value: "K37" },
      { label: "Cholecystitis", value: "K81" },
      { label: "Cholelithiasis (gall stone)", value: "K80" },
      { label: "Hernia", value: "K46" },
      { label: "Hydrocoele", value: "N43" },
      { label: "Phimosis/para‐phimosis", value: "N47" },
      { label: "Haemorrhoids/Piles", value: "I84" },
      { label: "Epididymitis/ Orchitis", value: "N45" },
      { label: "Prostatism (BEP/BPH)", value: "N41" },
      { label: "Not mentioned above and other", value: "R69" }
    ]
  }
];

export const GENE_EXPERT_RESULTS = [
  { label: "MTB Detected RIF Sensitive", value: "MTB_DETECTED_RIF_SENSITIVE" },
  { label: "MTB Detected RIF Resistant", value: "MTB_DETECTED_RIF_RESISTANT" },
  { label: "MTB Not Detected", value: "MTB_NOT_DETECTED" },
  { label: "Invalid/Errors/No result", value: "NO_RESULT" },
  { label: "Test Indeterminate", value: "TEST_INDETERMINATE" }
];

export const RESISTIVITY_LEVEL_OPTIONS = [
  { label: "उच्च जोखिम क्षेत्र (१)", value: "HIGH_RISK" },
  { label: "मध्य जोखिम क्षेत्र (२)", value: "MODERATE_RISK" },
  { label: "न्युन जोखिम क्षेत्र (३)", value: "NOMINAL_RISK" },
  { label: "जोखिम नभएको (४)", value: "NO_RISK" }
];

export const SAMPLE_SOURCE_FOR_MALARIA_OPTIONS = [
  { label: "ACD", value: "ACD" },
  { label: "PCD", value: "PCD" }
];
export const MALARIA_KALAAZAR_TREATMENT_OPTIONS = [
  { label: "सम्भावित", value: "PRESUMPTIVE" },
  { label: "Microscopy", value: "MICROSCOPY" },
  { label: "RDT", value: "RDT" },
  { label: "rk-39", value: "RK_39" }
];

export const KALAAZAR_TESTS = [
  { label: "BM", value: "BM" },
  { label: "SP", value: "SP" },
  { label: "Other", value: "OTHER" },
]

export const MALARIA_TYPE = [
  { label: "Pv", value: "Pv" },
  { label: "Pf", value: "Pf" },
];

export const MALARIA_CATEGORY_CODES = [
  { label: "Indigenous(1)", value: "INDIGENOUS" },
  { label: "Imported(2)", value: "IMPORTED" }
];
export const MALARIA_MEDICATIONS = [
  { label: "Chloroquine", value: "CHLOROQUINE" },
  { label: "Primaquine", value: "PRAMIQUINE" },
  { label: "Coartem", value: "COARTEM" },
  { label: "Artesunate", value: "ARTESUNATE" },
  { label: "Other(specify)", value: OTHER }
];
export const KALAAZAR_MEDICATIONS = [
  { label: "Lipsomal amphotericin B/Miltefosine", value: "LIPSOMAL_AMPHOTERICIN_B_MILTEFOSINE" },
  { label: "Other(specify)", value: OTHER }
];

export const SEVERE_MALARIA_PATIENT_OPTIONS = [
  { label: "सम्भावित", value: "SPECULATED" },
  { label: "प्रमाणित", value: "PROVEN" }
];

export const FCHV_ACTIVITIES = [
  {
    label: "(क) गर्भवति सेवा",
    options: [
      { label: "१. आफ्नो क्षेत्रमा भेट गरिएका गर्भवति महिलाहरुको संख्या (जना)", value: "AAFNO_CHHETRAMA_BHET_GARIYEKA_GARBHAWATI_MAHILA_COUNT" },
      { label: "२. गर्भ जाचँको लागि स्वास्थ संस्थामा प्रेषण गरेको महिलाहरुको संख्या (जना)", value: "GHARBHA_JACHAKO_LAGI_SWASTHYA_SASTHAMA_PRESAN_GAREKO_MAHILA_COUNT" },
      { label: "३. आमावाट बच्चामा सर्ने एचआइभि सम्बन्धी सुचना दिएका गर्भवति महिलालाई रक्त परीक्षणका लागि रेफर गरेको संख्या (जना)", value: "HIV_RAKTAPARIKHSYANKA_LAGI_REFER_FEMALE_COUNT" },
      { label: "४. पहिलो पटक स्वास्थ संस्थामा गर्भ जाचँ गरेको सुनिश्चित गरेको महिलाहरुको संख्या (जना)", value: "PAHILO_PATAK_SWASTHYA_SASTHAMA_GARBHA_JACH_GAREKA_MAHILA_COUNT" },
      { label: "५. दोहोर्याइ आएको वेला आइरन चक्की वितरण गरेको गर्भवति महिलाहरुको संख्या (जना)", value: "DOHORYAI_AAYEKO_BELA_IRON_CHAKKI_WITARAN_GAREKO_GARBHAWATI_MAHILA_COUNT" },
      { label: "६. प्रसूति सेवाको लागि स्वास्थ संस्थामा प्रेषण गरेको गर्भवति महिलाहरुको संख्या (जना)", value: "PRASUTI_SEWAKA_LAGI_SWASTHYA_SASTHAMA_PRESHAN_GAREKO_GARBHAWATI_MAHILA_COUNT" },
      { label: "७. स्वास्थकर्मी बिना घरमै सुत्केरी भई मातृसुरक्षा चक्की ( मिसोप्रोस्टोल ) खाएको सुनिश्चित गरेको महिलाहरुको संख्या (जना)", value: "SWASTHYAKARMI_BINA_GHARAMAI_SUTKERI_BHAI_MATRISURAKHSYA_CHAKKI_KHAYEKA_MAHILAKO_COUNT" }
    ]
  },
  {
    label: "(ख) घरमा जन्मेका शिशुहरुको जन्म अवस्था",
    options: [
      { label: "८. जिवित जन्म भएका शिशुहरु (जना)", value: "JIWIT_JANMA_BHAYEKA_SHISHUHARU" },
      { label: "९. मृत जन्म भएका शिशुहरु (जना)", value: "MRITA_JANMA_BHAYEKA_SHISHUHARU" },
      { label: "१०. जन्मेको २४ घण्टासम्म ननुहाएको सुनिश्चित गरिएको नवजात शिशुहरुको संख्या (जना)", value: "JANMEKO_24_GHANTASAMMA_NANUHAYEKO_NAWAJAAT_SHISHUKO_SANKHYAA" },
      { label: "११. शिशु तथा बाल्यकालिन पोषण व्यवहार सम्बन्धी सल्लाह दिएको आमाहरुको संख्या (जना)", value: "SHISHU_TATHA_BALLYAKALIN_POSHAN_WYAWAHAR_SAMBANDHI_SALLAHA_DIYEKO_AAMAHARUKO_COUNT)" },
      { label: "१२. सुत्केरी जाचँको लागि प्रेषण गरेको महिलाहरुको संख्या (जना)", value: "SUTKERI_JACHAKO_LAGI_PRESHAN_GAREKO_MAHILA_COUNT" },
      { label: "१३. घरमा प्रसुती भएका सुत्केरीलाई ४५ वटा आइरन चक्की वितरण गरेको महिलाहरुको संख्या (जना)", value: "GHARAMA_PRASUTI_BHAYEKA_SUTKERILAI_45_IRON_CHAKKI_WITARAN_GAREKO_MAHILA_COUNT" },
      { label: "१४. भिटामिन ए दिएको सुत्केरी महिलाहरुको संख्या (जना)", value: "VITAMIN_A_DIYEKO_SUTKERI_MAHILA_COUNT" }
    ]
  },
  {
    label: "(घ) खोप कार्यक्रम",
    options: [
      { label: "१५. खोप क्लिनिकमा सहभागी भई सघाएको (पटक)", value: "KHOP_CLINICMA_SAHABHAGI_BHAI_SAGHAYEKO" },
      { label: "१६. बि. सी. जी. खोप लगाएको सुनिश्चित गरिएका बच्चाहरुको संख्या (जना)", value: "BCG_KHOP_LAGAYEKO_BACHCHAHARUKO_COUNT" },
      { label: "१७. दादुरा र रुबेलाको खोप लगाएको सुनिश्चित गरिएका बच्चाहरुको संख्या (जना)", value: "DADURA_RUBELAKO_KHOP_LAGAKEKO_BACHCHAHARUKO_COUNT" },
      { label: "१८. गाउँघर क्लिनिकमा सहभागी भई सघाएको (पटक)", value: "GHAUGHAR_CLINICMA_SAHABHAGI_BHAI_SAGHAYEKO)" }
    ]
  },
  {
    label: "(ङ) २ महिना मुनिको बिरामी शिशुको उपचार तथा प्रेषण",
    options: [
      { label: "१९. २८ दिन सम्ममा बिरामी शिशुहरुको संख्या (जना)", value: "28_DIN_SAMMAKA_BIRAMI_SHISHUHARUKO_COUNT" },
      { label: "२०. २९-५९ दिन सम्ममा बिरामी शिशुहरुको संख्या (जना)", value: "29_TO_59_SAMMAKA_BIRAMI_SHISHUHARUKO_COUNT" },
      { label: "२१. संक्रमण भई कोट्रिमबाट उपचार गरी स्वास्थ संस्थामा प्रेषण गरेको २८ दिन सम्मका नवजात शिशुहरुको संख्या (जना)", value: "SANKRAMAN_BHAI_KOTRIM_BATA_UPACHAR_GARI_SWASTHYA_SASTHAMA_PRESHAN_GAREKO_28_DIN_SAMMAKA_NAWAJAT_SHISHUHARUKO_COUNT" },
      { label: "२२. संक्रमण भई कोट्रिमबाट उपचार गरी स्वास्थ संस्थामा प्रेषण गरेको २९-५९ दिन सम्मका नवजात शिशुहरुको संख्या (जना)", value: "SANKRAMAN_BHAI_KOTRIM_BATA_UPACHAR_GARI_SWASTHYA_SASTHAMA_PRESHAN_GAREKO_29_TO_59_DIN_SAMMAKA_NAWAJAT_SHISHUHARUKO_COUNT" },
      { label: "२३. २८ औ दिन भित्र मृत्यु भएका नवजात शिशु संख्या (जना)", value: "28_DIN_BHITRA_MRITU_BHAYEKA_NAWAJAT_SHISHU_COUNT" }
    ]
  },
  {
    label: "(च) २-५९ महिना सम्मका बिरामी शिशुको उपचार तथा प्रेषण: झाडापखाला",
    options: [
      { label: "२४. झाडापखाला लागेका २ महिनादेखी ५ वर्षमुनिका जम्मा बिरामी बच्चाहरुको संख्या (जना)", value: "JHADAPAKHALA_LAGEKA_2_DEKHI_5_BARSHAMUNIKA_JAMMA_BACHCHAHARUKO_COUNT" },
      { label: "२५. पुनर्जलीय झोलबाट मात्र उपचार गरेको बच्चाहरुको संख्या (जना)", value: "PUNARJALIYA_JHOLBATA_MATRA_UPACHAR_GAREKO_BACHCHAHARUKO_COUNT" },
      { label: "२६. पुनर्जलीय झोल र जिंक चक्कीबाट उपचार गरेका बच्चाहरुको संख्या (जना) ", value: "PUNARJALIYA_JHOL_RA_JINK_CHAKKIBATA_UPACHAR_GAREKO_BACHCHAHARUKO_COUNT" },
      { label: "२७. ५ वर्षमुनिका बच्चाहरुलाई वितरण गरेको पुनर्जलीय झोलको पुरिया संख्या (प्याकेट)", value: "5_BARSAMUNIKA_BACHCHAHARULAI_WITARAN_GAREKO_PUNARJALIYA_JHOLAKO_PURIYA_COUNT" },
      { label: "२८. ५ वर्ष भन्दा माथिका मानिसहरुलाई वितरण गरेको पुनर्जलीय झोलको पुरिया संख्या (प्याकेट)", value: "5_BARSA_BHANDA_MATHIKA_MANISHHARULAI_WITARAN_GARIYEKO_PUNARJALIYA_JHOLAKO_PURIYA_COUNT" },
      { label: "२९. वितरण गरेको जिंक चक्की संख्या (ट्याब्लेट)", value: "WITARAN_GAREKO_JINK_CHAKKI_COUNT" },
      { label: "३०. झाडापखाला लागेका २ महिनादेखी ५ वर्षसम्मका बिरामी बच्चाहरुलाई प्रेषण गरेको संख्या (जना)", value: "JHADAPAKHALA_LAGEKO_2_MAHINADEKHI_5_BARSHASAMMAKA_BIRAMI_BACHCHAHARULAI_PRESHAN_GAREKO_COUNT" }
    ]
  },
  {
    label: "(छ) २-५९ महिना सम्मका बिरामी शिशुको उपचार तथा प्रेषण: श्वासप्रश्वास रोग",
    options: [
      { label: "३१. श्वासप्रश्वास रोग लागेका २ देखी ५९ महिनाका बिरामी बच्चाहरुको संख्या (जना)", value: "SWASPRASWAS_ROG_LAGEKA_2_DEKHI_59_MAHINAKA_BIRAMI_BACHCHAHARUKO_COUNT" },
      { label: "३२. निमोनिया नभएको ( रुघाखोकी भएका ) ५ वर्ष मुनिका बच्चालाई घरेलु उपचार सल्लाह दिएको बच्चाहरुको संख्या (जना)", value: "NIMONIYA_NABHAYEKO_5_BARSA_MUNIKA_BACHCHALAI_GHARELU_UPACHAR_SALLAHA_DIYEKO_BACHCHAHARUKO_COUNT" },
      { label: "३३. श्वासप्रश्वास रोग भई स्वास्थ संस्थामा प्रेषण गरिएका २ देखी ५९ महिनाका बालबालिकाहरुको संख्या (जना)", value: "SWASPRASWAS_ROG_BHAI_SWASTHYA_SASTHAMA_PRESHAN_GARIYEKA_2_DEKHI_59_MAHINAKA_BAALBAALIKAHARUKO_COUNT" }
    ]
  },
  {
    label: "(ज) प्रेषण",
    options: [
      { label: "३४. सुरक्षित गर्भपतनको लागी स्वास्थ संस्थामा प्रेषण गरेका महिलाहरुको संख्या (जना)", value: "SURAKSHIT_GARBHAPATANKO_LAGI_SWASTHYA_SASTHAMA_PRESHAN_GAREKA_MAHILA_COUNT" },
      { label: "३५. स्वास्थ संस्थामा सेवा लिन प्रेषण गरिएका किशोर कीशोरीहरुको संख्या (जना)", value: "SWASTHYA_SASTHAMA_SEWA_LINA_PRESHAN_GARIYEKA_KISOR_KISORIHARUKO_COUNT" },
      { label: "३६. लगातार २ हप्तासम्म खोकी लागी स्वास्थ संस्थामा प्रेषण गरेका बिरामीहरुको संख्या (जना)", value: "LAGATAR_2_HAPTASAMMA_KHOKI_LAGI_SWASTHYA_SASTHAMA_PRESHAN_GAREKA_BIRAMIHARUKO_COUNT" },
      { label: "३७. प्राथमिक उपचार गरेको (जना)", value: "PRATHAMIK_UPACHAR_GAREKO" },
      { label: "३८. प्राथमिक उपचारको क्रममा प्रेषण गरेको बिरामीहरुको संख्या (जना)", value: "PRATHAMIK_UPACHARAKO_KRAMAMAA_PRESHAN_GAREKO_BIRAMIHARUKO_COUNT" }

    ]
  },
  {
    label: "(झ) परिवार नियोजन",
    options: [
      { label: "३९. खाने चक्की पिल्स वितरण गरिएका महिलाहरुको संख्या (जना)", value: "KHANE_CHAKKI_PILLS_WITARAN_GARIYEKA_FEMALE_COUNT" },
      { label: "४०. वितरण गरेको खाने चक्की पिल्स (साइकल)", value: "WITARAN_GAREKO_KHANE_CHAKKI_PILLS_COUNT" },
      { label: "४१. कण्डम वितरण गरेको (जना)", value: "CONDOM_WITARAN_GAREKO" },
      { label: "४२. वितरण गरेको कण्डमको संख्या (गोटा)", value: "WITARAN_GAREKO_CONDOM_COUNT" },
      { label: "४३. परिवार नियोजन सेवाको लागी स्वास्थ संस्थामा प्रेषण गरेको दम्पतिहरुको संख्या", value: "PARIWAR_NIYOJAN_SEWAKO_LAGI_SWASTHYA_SASTHAMA_PRESAN_GAREKO_DAMPATIHARUKO_COUNT" }

    ]
  },
  {
    label: "(ञ) शिघ्र कुपोषणको  एकीकृत व्यवस्थापन एम. यु. ए. सी. छनौट",
    options: [
      { label: "४४. हरियो हिस्टपुस्ट (जना) खुशी परिवार", value: "HARIYO_HRISTAPUSTA_KHUSI_PARIWAAR" },
      { label: "४५. पहेलो मध्यम शिघ्र कुपोषण (जना) घरमा महिला स्वास्थ स्वयंसेवीकाद्वारा परामर्श ", value: "PAHELO_MADHYAM_SHIGRA_KUPOSHAN_GHARAMA_MAHILA_SWASTHYA_SWAIM_SEWIKA_DWARA_PARAMARSA" },
      { label: "४६. रातो अति कडा (जना) स्वास्थ संस्थामा प्रेषण", value: "RATO_ATI_KADA_SWASTHYA_SASTHAMA_PRESHAN" },
      { label: "४७. फुकेनास (जना) स्वास्थ संस्थामा प्रेषण", value: "FUKENAS_SWASTHYA_SASTHAMA_PRESHAN" }
    ]
  },
  {
    label: "(ट) शिघ्र कुपोषणको  एकीकृत व्यवस्थापन: घरभेट र अनुगमन",
    options: [
      { label: "४८. रातो कडा शिघ्र कुपोषित बच्चा (जना) उपचार पछी निको भएको", value: "RATO_KADA_SHIGRA_KUPOSHIT_BACHCHA_UPACHAR_PACHHI_NIKO_BHAYEKO" },
      { label: "४९. रातो कडा शिघ्र कुपोषित बच्चा (जना) उपचार गरिरहदा पनि तौल वृद्धि नभएको", value: "RATO_KADA_SHIGRA_KUPOSHIT_BACHCHA_UPACHAR_GARIRAHADA_PANI_TAUL_BRIDHI_NABHAYEKO" },
      { label: "५०. रातो कडा शिघ्र कुपोषित बच्चा (जना) उपचार गर्दा गर्दै स्वास्थ संस्था जान छाडेका ", value: "RATO_KADA_SHIGRA_KUPOSHIT_BACHCHA_UPACHAR_GARDA_GARDAI_SWASTHYA_SASTHA_JANA_CHHADEKHA" }
    ]
  }
];

export const AEFI_WARGIKARAN_OPTIONS = [
  { value: "SIMPLE", label: "सामान्य" },
  { value: "RISK", label: "कडा" }
]

export const BAAL_VITA_PROVIDERS = [
  { value: "HEALTH_POST", label: "स्वास्थ संस्था" },
  { value: "FEMALE_HEALTH_VOLUNTEER", label: "महिला स्वास्थ स्वयम सेविका" }
]

export const PILLS_DEPO_TAKEN_FISCAL_YEAR = [
  { value: "FIRST", label: "पहिलो" },
  { value: "SECOND", label: "दोस्रो" },
  { value: "THIRD", label: "तेस्रो" }
];

export const SAFE_ABORTION_PROCEDURE_CODES = [
  { value: "MVA", label: "Manual Vacuum Aspiration (1)" },
  { value: "EVA", label: "Electric Vacuum Aspiration (2)" },
  { value: "MA", label: "Medical Abortion(3)" },
  { value: "MI", label: "Medical Induction (4)" },
  { value: "D_AND_E", label: "Dilatation and Evacuation (5)" },
  { value: "OTHER", label: "Misoprostol for incomplete abortion (6)" },
];

export const SAFE_ABORTION_PAC_CLIENTS_DIAGNOSIS_CODES = [
  { value: "1", label: "Bleeding requiring more than 1 pint of I.V. fluid (1)" },
  { value: "2", label: "Bleeding requiring Blood transfusion (2)" },
  { value: "3", label: "Incomplete abortion requiring repeat procedure (3)" }
];

export const SAFE_ABORTION_ACCEPTED_FP_METHODS_CODES = [
  { value: "1", label: "Condom (1)" },
  { value: "2", label: "Pills (2)" },
  { value: "3", label: "Depo Provera (3)" },
  { value: "4", label: "Female Sterilization (4)" },
  { value: "5", label: "Male Sterilization (5)" },
  { value: "6", label: "Implant (6)" },
  { value: "7", label: "IUCD (7)" },
];

export const SAFE_ABORTION_REFERRED_FROM_CODES = [
  { value: "1", label: "Referred from FCHV (1)" },
  { value: "2", label: "Referred from Health Care Providers (2)" },
  { value: "3", label: "Referred by others (3)" },
];

export const SAFE_ABORTION_CAC_PAC = [
  { value: "REFERRED_OUT", label: "Referred Out" },
  { value: "NORMAL", label: "Normal" },
  { value: "LAMA", label: "LAMA" },
  { value: "DEATH", label: "Death" },
];

export const AGE_UNITS = [
  { value: "YEAR", label: "वर्ष" },
  { value: "MONTH", label: "महिना" },
  { value: "DAY", label: "दिन" }
];

export const TREATMENT_MEDICINE_OPTIONS = [
  { value: "VITAMIN_A", label: "भिटामिन ए" },
  { value: "AMOXICILLIN", label: "एमोक्सिसिलिन" },
  { value: "MALARIA_TREATMENT", label: "औलोको उपचार" },
  { value: "ALBENDAZOLE", label: "अल्बेन्डाजोल(एम.जि.)" },
  { value: "RUTF", label: "RUTF" },
  { value: OTHER, label: "अन्य औषधी" }
];

export const MEDICINE_OPTIONS = [
  { value: "PARACETAMOL", label: "प्यारासिटामोल" },
  { value: "AMOXICILLIN", label: "Amoxicillin" },
  { value: "IV_FLUID", label: "IV Fluid" },
  { value: "ZINC", label: "Zinc" },
  { value: "ORS", label: "ORS" },
  { value: "ALBENDAZOLE", label: "Albendazole" },
  { value: "VITAMIN_A", label: "Vitamin A" },
  { value: "IRON_TABLET", label: "आइरन चक्की" },
  { value: "IV_AMPICILLIN", label: "IV Ampicillin" },
  { value: "HOME_TREATMENT", label: "घरेलु उपचार" },
  { value: ANTIBIOTIC, label: "Other Antibiotic" },
  { value: OTHER, label: "Other Medicine" },
];

export const MEDICINE_OPTIONS_FOR_CHILD_BELOW_TWO_MONTHS = [
  { value: "AMOXICILLIN", label: "Amoxicillin" },
  { value: "AMPICILLIN", label: "Ampicillin" },
  { value: ANTIBIOTIC, label: "Other Antibiotic" },
  { value: OTHER, label: "Other Medicine" }
];

export const MEDICINE_UNIT_OPTIONS = [
  { value: "PACKETS", label: "Packets" },
  { value: "TABLET", label: "Tablet" },
  { value: "CAPSULE", label: "Capsule" },
  { value: "BOTTLE", label: "Bottle" },
  { value: "TUBE", label: "Tube" },
  { value: "PHIAL", label: "Phial" },
  { value: "VIAL", label: "Vial" },
  { value: "AMPOULE", label: "Ampoule" }
];

export const PATIENT_ADMISSION_TYPES = [
  { value: "NEW_ADMISSION", label: "नँया भर्ना" },
  { value: "RE_ADMISSION", label: "पुन: दर्ता भएको (२ महिना भित्र)" },
  { value: "REFERRED_ADMISSION", label: "बाहिरबाट आएको (बहिरङ्ग/विशेष उपचारकक्ष/पोषण पुनःस्थापना गृह बाट)" },
  { value: "AFTER_DEFAULTER_ADMISSION", label: "डिफल्टर पछी भर्ना" }
];

export const PRESAN_TYPES = [
  { value: "SELF", label: "आफै/स्वंम प्रेषण" },
  { value: "SPECIAL_TREATMENT_ROOM", label: "विशेष उपचार कक्ष" },
  { value: "VILLAGE_CLINIC", label: "गाउँघर क्लिनिक" },
  { value: "WOMEN_VOLUNTEER", label: "म.स्वा.स्वं.से." },
  { value: "NUTRITION_RE_ESTABLISHMENT_CENTER", label: "पोषण पुन:स्थापना केन्द्र" },
  { value: "OTHER_HEALTH_OFFICE", label: "अन्य स्वास्थ्य संस्था" }
];

export const PLUS_SYMBOL_INDICATORS = [
  { value: "+", label: "+" },
  { value: "++", label: "++" },
  { value: "+++", label: "+++" },
  { value: "NO", label: "छैन" }
];

export const TB_TEST_TYPE = [
  { value: "DIAGNOSIS", label: "निदान" },
  { value: "FOLLOW_UP", label: "अनुगमन" }
];

export const LAB_RESULT_OPTIONS = [
  { value: "NEGATIVE", label: "Negative" },
  { value: "POSITIVE", label: "Positive" },
  { value: "DIED", label: "Died" },
  { value: "LOST_TO_FOLLOW_UP", label: "Loss to follow up" },
  { value: "NOT_EVALUATED", label: "Not Evaluated" }
];

export const SMEAR_LAB_RESULT_OPTIONS = [
  { value: "NEGATIVE", label: "Negative" },
  { value: "POSITIVE", label: "Positive" }
];

export const KALAAZAR_REPORT = [
  { value: "NEGATIVE", label: "Negative" },
  { value: "POSITIVE", label: "Positive" }
]

export const TYPE_OF_CARE = [
  { value: "GENERAL_MEDICINE", label: "General Medicine(1)" },
  { value: "GENERAL_SURGERY", label: "General Surgery(2)" },
  { value: "PAEDIATRICS", label: "Paediatrics(3)" },
  { value: "OBSTETRIC", label: "Obstetric(4)" },
  { value: "GYNECOLOGY", label: "Gynecology(5)" },
  { value: "ENT", label: "ENT(6)" },
  { value: "ORTHOPEDICS", label: "Orthopedics(7)" },
  { value: "PSYCHIATRIC", label: "Psychiatric(8)" },
  { value: "DENTAL", label: "Dental(9)" },
  { value: OTHER, label: "Others(10)" },
];

export const TYPE_OF_SURGERY = [
  { value: "MAJOR", label: "Major(1)" },
  { value: "INTERMEDIATE", label: "Intermediate(2)" },
  { value: "MINOR", label: "Minor(3)" },
];

export const OUTCOME_CODE = [
  { value: "RECOVERED_CURED", label: "Recovered/Cured(1)" },
  { value: "NOT_IMPROVED", label: "Not Improved(2)" },
  { value: "REFERRED", label: "Referred(3)" },
  { value: "DOR_LAMA_DAMA", label: "DOR/LAMA/DAMA(4)" },
  { value: "ABSCONDED", label: "Absconded(5)" },
  { value: "DEATH", label: "Death(6)" },
];

export const DISCHARGE_PATIENT_TYPE = [
  { value: "ULTRA_POOR_OR_DESTITUTE", label: "अति गरिब वा असहाय(१)" },
  { value: "POOR", label: "गरिब(२)" },
  { value: "DISABLED", label: "अपाङ्ग(३)" },
  { value: "SENIOR_CITIZEN", label: "ज्यष्ठ नागरिक > ६० वर्ष(४)" },
  { value: "FCHV", label: "म.स्वा.स्व.से.(५)" },
  { value: OTHER, label: "अन्य(६)" },
];

// Lab Module Constats Start Here
export const REPORT_DEFAULT_TEMPLATES = [
  { value: "BIOCHEMICAL_TEST", label: "Biochemical Test" },
  { value: "DIRECT_SMEAR_TEST", label: "Direct Smear Test" },
  { value: "HEMATOLOGICAL_TEST", label: "Hematological Test" },
  { value: "SEMEN_TEST", label: "Semen Test" },
  { value: "SEROLOGICAL_TEST", label: "Serological Test" },
  { value: "STOOL_TEST", label: "Stool Test" },
  { value: "URINE_TEST", label: "Urine Test" }
]
// Lab Module Constats Ends Here

export const SERVICES_AVAILABLE = [
  { value: "BIRTHING_CENTRE", label: "Birthing Centre" },
  { value: "BEOC_SITE", label: "BEOC Site" },
  { value: "SAFE_ABORTION_LISTED_SITE", label: "Safe Abortion Listed Site" },
  { value: "IUCD_SERVICE_SITE", label: "IUCD Service Site" },
  { value: "IMPLANT_SERVICE_SITE", label: "Implant Service Site" },
  { value: "ADOLESCENT_FRIENDLY_SITE", label: "Adolescent Friendly Site" },
  { value: "OTC_SITE", label: "OTC Site" },
  { value: "DOTS_CENTRE", label: "DOTS Centre" },
  { value: "MICROSCOPY_SITE", label: "Microscopy Site" },
  { value: "LABORATORY_SERVICE", label: "Laboratory Service" },
  { value: "HTC_SITE", label: "HTC Site" },
  { value: "PMTCT_SITE", label: "PMTCT Site" },
  { value: "ART_SITE", label: "ART Site" },
]

export const MALARIA_KAALAZAR_REGISTER_TYPE = [
  { value: "MALARIA", label: "औलो" },
  { value: "LEPROSY", label: "कुष्ठ" },
  { value: "KALAAZAR", label: "कालाजार" },
]

export const MALARIA_KAALAZAR_TREATMENT_REGISTER_TYPE = [
  { value: "ALL", label: "सबै" },
  { value: "MALARIA", label: "औलो" },
  { value: "KALAAZAR", label: "कालाजार" },
]

export const TB_TREATMENT_REFER = [
  { value: "SELF", label: "Self" },
  { value: "PRIVATE", label: "Private" },
  { value: "COMMUNITY", label: "Community" },
  { value: "CONTACT_INVEST", label: "Contact Invest" }
]

export const TB_TREATMENT_REGIMEN = [
  { value: "2HRZE_PLUS_4HR", label: "2HRZE + 4HR" },
  { value: "2HRZE_PLUS_7HRE", label: "2HRZE + 7HRE" },
  { value: "6HRZE", label: "6HRZE" },
  { value: "6HRZE_PLUS_Lfx", label: "6HRZE + Lfx" },
]

export const DST_STATUS = [
  { value: "XPERT_MTB_OR_RIF", label: "Xpert MTB/RIF" },
  { value: "LPA", label: "LPA" }
]

export const SMOKING_STATUS = [
  { value: "CURRENT_SMOKER", label: "Current Smoker(S)" },
  { value: "RELAPSED_SMOKER", label: "Relapsed Smoker(R)" },
  { value: "QUITTER", label: "Quitter(Q)" }
]

export const HIV_RESULT = [
  { value: "REACTIVE", label: "Reactive" },
  { value: "NON_REACTIVE", label: "Non Reactive" }
]

export const TEST_POSITIVE_REPORT_GRADE = [
  { value: "ONE_PLUS", label: "1+" },
  { value: "TWO_PLUS", label: "2+" },
  { value: "THREE_PLUS", label: "3+" },
  { value: "FOUR_PLUS", label: "4+" },
  { value: "FIVE_PLUS", label: "5+" }
]
export const SKIN_BLEMISHES = [
  { value: "ONE_TO_FIVE_BLEMISHES", label: "स्पर्श शक्ति हराएको १ देखि ५ वटा दाग/दागहरु" },
  { value: "SIX_OR_MORE_BLEMISHES", label: "स्पर्श शक्ति हराएको ६ वा शो भन्दा बढी दाग/दागहरु" },
]

export const SKIN_SMEAR_GERMS = [
  { value: "NO_GERMS_IN_SKIN_SMEAR", label: "स्किन स्मयरमा किटाणु नदेखिएको" },
  { value: "GERMS_IN_SKIN_SMEAR", label: "स्किन स्मयरमा किटाणु देखिएका" },
]

export const NERVES_AFFECTED = [
  { value: "ONE_NERVE_AFFECTED", label: "कुनै एक स्नायु प्रभावित भई क्षमतामा भएको" },
  { value: "TWO_OR_MORE_NERVE_AFFECTED", label: "२ वा सो भन्दा बढी स्नायु प्रभावित भई क्षमतामा भएको" },
]

export const PRESUMPTIVE_TB_TYPE = [
  { value: "SPUTUM", label: "Sputum" },
  { value: "PATIENT_REFEREE", label: "Patient Referee" },
]

export const CONTACT_INVESTIGATION_OUTCOME = [
  { value: "COMPLETED", label: "Completed" },
  { value: "DISCONTINUE", label: "Discontinue" },
  { value: "DIED", label: "Died" },
  { value: "NOT_EVALUATED", label: "Not Evaluated" }
]

export const DS_OR_DRTB = [
  { value: "DS", label: "DS" },
  { value: "DRTB", label: "DRTB" }
]

export const OPD_OR_PRESUMPTIVE = [
  { value: "OPD", label: "OPD" },
  { value: "PRESUMPTIVE", label: "Presumptive" }
]

export const CURRENT_TREATMENT = [
  { value: "NEW", label: "New" },
  { value: "RETREAT", label: "Retreat" }
]

export const PURPOSE_OF_XPERT_TEST = [
  { value: "DIAGNOSIS", label: "Diagnosis" },
  { value: "RR_DETECTION", label: "RR Detection" }
]

export const XPERT_SPECIMEN_TYPE = [
  { value: "SPUTUM", label: "खकार" },
  { value: "OTHER", label: "अन्य" }
]

export const TEST_RESULT_MTB = [
  { value: "DETECTED", label: "Detected" },
  { value: "NOT_DETECTED", label: "Not Detected" },
  { value: "INVALID_NO_RESULT", label: "Invalid / No result" },
  { value: "ERROR_CODE", label: "Error Code" }
]

export const RIF_RESISTANCE_TEST_RESULT = [
  { value: "DETECTED", label: "Detected" },
  { value: "NOT_DETECTED", label: "Not Detected" },
  { value: "INDETERMINATE", label: "Indeterminate" }
]

export const SCREENED_BY = [
  { value: "X_RAY", label: "X-Ray विधिबाट" },
  { value: "SYMPTOMS", label: "लक्षणको आधारमा" }
]

export const REQUESTED_FOR_DIAGNOSIS = [
  { value: "MICROSCOPY", label: "Microscopy परीक्षणलाई पठाइएको" },
  { value: "XPERT_MTB_OR_RIF", label: "Xpert MTB/RIF परीक्षणलाई पठाइएको" },
  { value: "CULTURE", label: "Culture परीक्षणलाई पठाइएको" },
  { value: "LPA", label: "LPA परीक्षणलाई पठाइएको" },
]

export const TB_DIAGNOSIS = [
  { value: "PBC", label: "PBC" },
  { value: "PCD", label: "PCD" },
  { value: "EP", label: "EP" },
  { value: "DR_TB", label: "DR TB" },
]

export const TREATMENT_STATUS = [
  { value: "ENROLLED", label: "निदान भएकै संस्थामा दर्ता भएको" },
  { value: "REFERRED", label: "अन्यत्र प्रेषण गरिएको" }
]

export const KUSTHAROG_SPECIMEN_TYPES = [
  { value: "ONE_PLUS", label: "1+" },
  { value: "TWO_PLUS", label: "2+" },
  { value: "THREE_PLUS", label: "3+" },
  { value: "FOUR_PLUS", label: "4+" },
  { value: "FIVE_PLUS", label: "5+" },
  { value: "SIX_PLUS", label: "6+" },
  { value: "NEGATIVE", label: "-ve" },
]
export const USUAL_SIGNS_OF_DANGER = [
  { value: "POTENTIALLY_SERIOUS_BACTERIAL_INFECTION", label: "व्याक्टेरियाको सम्भावित गम्भिर संक्रमण" },
  { value: "LOCAL_INFECTION_OF_BACTERIA", label: "व्याक्टेरियाको स्थानिय संक्रमण" },
  { value: "NO_BACTERIAL_INFECTION", label: "व्याक्टेरियाको संक्रमण नभएको" },
]

export const JAUNDICE = [
  { value: "SEVERE_JAUNDICE", label: "कडा जण्डिस (कमलपित्त)" },
  { value: "JAUNDICE", label: "जण्डिस (कमलपित्त)" }
]

export const SITAANGA = [
  { value: "SEVERE_SITAANGA", label: "कडा सिताङ्ग" },
  { value: "SITAANGA", label: "सिताङ्ग" }
]

export const BREASTFEEDING_PROBLEMS_OR_LOW_BIRTH_WEIGHT = [
  { value: "BREASTFEEDING_PROBLEMS", label: "स्तनपान सम्बन्धी समस्या वा कम तौल" },
  { value: "NO_BREASTFEEDING_PROBLEMS", label: "स्तनपान सम्बन्धी समस्या नभएको" }
]

export const NUTRITION_RELATED = [
  { value: "SEVERE_ACUTE_MALNUTRITION", label: "कडा शिघ्र कुपोषण" },
  { value: "MODERATE_ACUTE_MALNUTRITION", label: "मध्यम शिघ्र कुपोषण" },
  { value: "NO_MALNUTRITION", label: "कुपोषण नभएको" },
  { value: "SEVERE_ANEMIA", label: "कडा रक्तअल्पता" },
  { value: "ANEMIA", label: "रक्तअल्पता" },
  { value: "NO_ANEMIA", label: "रक्तअल्पता नभएको" }
]

export const EAR_RELATED = [
  { value: "MASTOIDITIS", label: "मास्टोईडाइटिस" },
  { value: "ACUTE_EAR_INFECTIONS", label: "कानको एक्युट संक्रमण" },
  { value: "CHRONIC_EAR_INFECTIONS", label: "कानको दिर्घ संक्रमण" },
  { value: "NO_EAR_INFECTIONS", label: "कानको संक्रमण नभएको" },

]

export const MEASLES_RELATED = [
  { value: "SEVERE_COMPLEX_MEASLES", label: "कडा जटिल दादुरा" },
  { value: "MEASLES_WITH_EYE_AND_MOUTH_COMPLICATIONS", label: "आँखा मुखको जटिलता सहितका दादुरा" },
  { value: "DISEASES_LIKE_MEASLES", label: "दादुरा जस्तै रोग" }
]

export const MALARIA_RELATED = [
  { value: "SEVERE_FEVER_OR_SEVERE_MALARIA", label: "धेरै कडा ज्वरो जन्य रोग वा कडा जटिल औलो" },
  { value: "FALCIPARUM_MALARIA", label: "फाल्सीपेरम औलो" },
  { value: "MALARIA_WITHOUT_FALCIPARUM", label: "फाल्सीपेरम नभएको औलो" },
  { value: "NO_POSSIBILITY_OF_MALARIA", label: "ज्वरो: औलोको संभावना नभएको" },
  { value: "FEVER", label: "ज्वरो" }
]


export const DIARRHEA_RELATED = [
  { value: "STRICT_HYDROELECTRICITY", label: "कडा जलवीयोजन" },
  { value: "SOME_HYDRATION", label: "केही जलवीयोजन" },
  { value: "NO_HYDROELECTRICITY", label: "जलवीयोजना नभएको" },
  { value: "AUN_BLOOD", label: "आँउ रगत" },
  { value: "CHRONIC_DIARRHOEA", label: "दीर्घ झाडापखाला" },
]

export const BREATHING_RELATED = [
  { value: "SEVERE_PNEUMONIA", label: "कडा न्युमोनिया" },
  { value: "VERY_SEVERE_DISEASE", label: "धेरै कडा रोग" },
  { value: "PNEUMONIA", label: "न्युमोनिया" },
  { value: "NO_PNEUMONIA_COLD", label: "न्युमोनिया नभएको :रुघाखोकी" }
];

export const MAJOR_CLASSIFICATIONS_FOR_BELOW_TWO_MONTH = [
  { label: "समान्यतया देखिने खतराका चिन्हहरु अनुसार", options: USUAL_SIGNS_OF_DANGER },
  { label: "जण्डिस", options: JAUNDICE },
  { label: "सिताङ्ग", options: SITAANGA },
  { label: "स्तनपान सम्बन्धी समस्या वा कम तौल", options: BREASTFEEDING_PROBLEMS_OR_LOW_BIRTH_WEIGHT },
  { label: "झाडापखाला", options: DIARRHEA_RELATED }
];

export const MAJOR_CLASSIFICATIONS_FOR_ABOVE_TWO_MONTH = [
  { label: "पोषण सम्बन्धी", options: NUTRITION_RELATED },
  { label: "कान सम्बन्धी", options: EAR_RELATED },
  { label: "दादुरा सम्बन्धी", options: MEASLES_RELATED },
  { label: "औलो सम्बन्धी", options: MALARIA_RELATED },
  { label: "झाडापखाला", options: DIARRHEA_RELATED },
  { label: "श्वासप्रश्वास", options: BREATHING_RELATED }
];

export const DISCHARGE_RESULT = [
  { value: "RECOVERED", label: "निको भएको" },
  { value: "NOT_RECOVERED", label: "निको नभएको" },
  { value: "DEFAULTER", label: "डिफल्टर" },
  { value: "PRESAN", label: "प्रेषण(अस्पताल)" },
  { value: "DIED", label: "मृत्यु" },
  { value: "TRANSFERRED_TO_ANOTHER_PLACE", label: "स्थानान्तरण भइ अन्यत्र गएको" },
]

export const ORDINAL_NUMBERS = [
  { value: 1, label: "पहिलो" },
  { value: 2, label: "दोस्रो" },
  { value: 3, label: "तेस्रो" },
  { value: 4, label: "चौथो" },
  { value: 5, label: "पाँचौं" },
  { value: 6, label: "छैठौं" },
  { value: 7, label: "सातौं" },
  { value: 8, label: "आठौं" },
  { value: 9, label: "नवौं" },
]
