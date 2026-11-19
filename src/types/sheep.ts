/**
 * Sheep Flock Technical & Financial Simulation Engine Types
 * أنواع ونماذج البيانات لمحرك المحاكاة الفنية والمالية لقطعان الأغنام
 */

export type BreedType = 'awassi' | 'naimi' | 'najdi' | 'barbari' | 'romanov' | 'crossbred';

export type ReproductionSystem = 'annual' | 'accelerated_8month';

export type MatingProtocol = 'natural_open' | 'natural_controlled' | 'hormonal_synchronized';

// سياسات الاحتفاظ بالإناث بما فيها خيار الاحتفاظ بنصف الإناث
export type FemaleRetentionStrategy = 
  | 'growth_max'          // نمط التوسع الأقصى
  | 'steady_state'        // نمط التثبيت المستقر (تعويض المستبعد والنافق)
  | 'retain_half'         // الاحتفاظ بنصف الإناث (50%) وإدخال الباقي في التسمين
  | 'commercial_selling'; // بيع معظم الإناث للحم

export type AnimalSex = 'male' | 'female';

export type AnimalStage = 
  | 'suckling_lamb'                // رضيع (0-60 يوم)
  | 'weaned_growing_male'          // طلي تسمين نامي
  | 'growing_female_weaner'        // فطيمة نامية (2 - 11 شهر)
  | 'first_parity_pregnant_hogget' // فطيمة حاملة لأول مرة (11 - 16 شهر)
  | 'parous_mature_ewe'            // نعجة بالغة من بعد أول ولادة
  | 'fattening_male'               // خروف تسمين معد للبيع
  | 'surplus_female_sale'          // أنثى فائضة مخصصة للبيع
  | 'cull_ewe'                     // نعجة مستبعدة للتسمين والبيع
  | 'breeding_ram'                 // فحل كبش عامل
  | 'culled_ram';                  // فحل مستبدل للبيع

export type PhysiologicalState = 
  | 'dry_empty'           // جافة / فارغة
  | 'flushing_mating'     // دفع غذائي وتلقيح
  | 'early_gestation'     // عشار أول 3.5 شهر
  | 'late_gestation'      // دافع (أواخر الحمل)
  | 'lactating_single'    // مرضعة مولود مفرد
  | 'lactating_twins'     // مرضعة توائم
  | 'creep_lamb'          // رضيع يتغذى على العلف البادئ
  | 'intensive_fattening' // تسمين مكثف
  | 'active_ram';         // كبش نشط

/** بند مالي مخصص إضافي للإيرادات والمصروفات */
export interface CustomFinancialItem {
  id: string;
  title: string;
  amount: number;
  type: 'revenue' | 'expense';
  note?: string;
}

/** مواصفات القطيع التأسيسي */
export interface BaselineFlockConfig {
  breed: BreedType;
  reproductionSystem: ReproductionSystem;
  matingProtocol: MatingProtocol;
  femaleRetentionStrategy: FemaleRetentionStrategy;
  
  // أعداد ورؤوس القطيع التأسيسي
  adultEwesCount: number;         // عدد النعاج البالغة التأسيسية
  breedingRamsCount: number;       // عدد الفحول المشتراة
  ewePurchasePrice: number;        // سعر شراء النعجة التأسيسية
  ramPurchasePrice: number;        // سعر شراء الكبش

  // المعايير البيولوجية للسلالة
  fertilityRate: number;           // نسبة الخصوبة (0.85 - 0.95)
  abortionRate: number;            // نسبة الإجهاض (0.02 - 0.05)
  prolificacyFactor: number;       // معدل التوائم (1.15 - 1.80)
  gestationDays: number;           // مدة الحمل (افتراضي 150)
  lactationDays: number;           // مدة الرضاعة (افتراضي 60)
  matingWindowDays: number;        // نافذة التلقيح (35 - 42 يوماً)

  // نسب النفوق المرحلية
  preWeaningMortalityRate: number; // نفوق الرضاعة 0-60 يوم (0.05 - 0.12)
  postWeaningMortalityRate: number;// نفوق الفطام والتسمين 60-180 يوم (0.02 - 0.04)
  hoggetMortalityRate: number;     // نفوق الرخال النامية 6-14 شهر (0.01 - 0.02)
  adultAnnualMortalityRate: number;// نفوق النعاج البالغة السنوي (0.03 - 0.05)

  // سياسة الاستبعاد والإحلال
  adultAnnualCullRate: number;     // نسبة استبعاد النعاج السنوية (0.15 - 0.20)
  ramReplacementYears: number;     // استبدال الفحول كل سنتين إلزامي
  maxHousingCapacity: number;      // سعة الحظائر القصوى

  // مدة المشروع بالأيام (دايناميكي غير محدود بثلاث سنوات)
  totalProjectDurationDays: number;// مثلاً 360، 720، 1080، 1800 (5 سنوات)، 2520 (7 سنوات)، 3600 (10 سنوات)

  // أسعار السوق للمبيعات
  fattenedMaleSellingPrice: number;// سعر بيع خروف التسمين
  surplusFemaleSellingPrice: number; // سعر بيع أنثى النتاج الفائضة
  culledEweSellingPrice: number;   // سعر بيع نعجة الاستبعاد
  culledRamSellingPrice: number;   // سعر بيع الكبش المستبدل
  manureBagSellingPrice: number;   // سعر كيس السماد العضوي
  woolPerHeadPrice: number;        // عائد جز الصوف لكل رأس
}

/** معلمات وحدة زراعة الفصة المعمرة */
export interface AlfalfaFieldConfig {
  enabled: boolean;                // تفعيل الموديول
  areaHectares: number;            // المساحة بالهكتار
  establishmentCostPerHa: number;  // تكلفة التأسيس الرأسمالية للهكتار
  lifespanYears: number;           // عمر المحصول الاقتصادي (4-5 سنوات)
  cutsPerYear: number;             // عدد الحشات سنوياً (6-8)
  hayYieldPerCutTonsPerHa: number; // إنتاج الحشة الواحدة (طن دريس/هكتار)
  annualOpexPerHa: number;         // تكلفة التشغيل السنوية للهكتار (ري، أسمدة، حش، كبس)
  marketHayPricePerTon: number;    // سعر شراء الدريس من السوق المفتوح (في حال العجز)
  surplusHaySellingPricePerTon: number; // سعر بيع طن الدريس الفائض للسوق
  feedShrinkagePercent: number;    // نسبة هدر العلف والتخزين (0.05 - 0.08)
}

/** سجل فوج المواليد */
export interface Cohort {
  id: string;
  birthDay: number;                // يوم الولادة في المحاكاة
  cycleIndex: number;              // رقم دورة الإنتاج
  initialBirths: number;           // إجمالي المواليد الحية
  initialMales: number;            // عدد الذكور
  initialFemales: number;          // عدد الإناث
  abortedFetuses: number;          // الأجنة المجهضة للفوج
  
  // مسارات الذكور
  sucklingDeadMales: number;
  weanedMales: number;
  fatteningDeadMales: number;
  marketSoldMales: number;
  
  // مسارات الإناث
  sucklingDeadFemales: number;
  weanedFemales: number;
  fatteningDeadFemales: number;
  retainedReplacementFemales: number;
  marketSoldFemales: number;
  
  currentStage: AnimalStage;
}

/** لقطة جرد ومطابقة القطيع في لحظة زمنية معينة */
export interface InventorySnapshot {
  day: number;                     // 360, 720, 1080 أو أي يوم حتى نهاية المشروع
  periodLabel: string;             // "الموقف التشغيلي عند اليوم 360"
  
  // تعداد الرؤوس الحية القائمة - تفصيل الإناث الثلاثي
  growingFemaleWeaners: number;        // أ* فطائم نامية من عمر شهرين إلى 11 شهر
  firstParityPregnantHoggets: number;  // ب* فطائم حاملة لأول مرة
  parousMatureEwes: number;            // ج* نعاج بالغة من بعد أول ولادة
  
  matureEwesTotal: number;             // إجمالي النعاج الإناث (أ + ب + ج)
  breedingRams: number;                // فحول كباش عاملة
  sucklingLambs: number;               // مواليد رضع قائمة (ذكور وإناث)
  
  // فصل برنامج التسمين بين الذكور والإناث
  fatteningMales: number;              // ذكور تسمين قائمة (خراف لحم / أضاحي)
  fatteningFemales: number;            // إناث تسمين قائمة (رخال تسمين تجاري للبيع)
  fatteningLambsTotal: number;         // إجمالي طليان التسمين (ذكور + إناث)
  
  totalLiveFlock: number;              // إجمالي الرؤوس الحية الفعلي في الحظائر

  // مؤشرات الإجهاض والتناسل
  configuredAbortionRate: number;      // نسبة الإجهاض المعتمدة (%)
  cumulativeAbortedFetuses: number;    // إجمالي الأجنة المجهضة المحتسبة
  cumulativeViableBirths: number;      // إجمالي المواليد الحية المولودة

  // ميزان الحركة التراكمي (معادلة حفظ الرؤوس)
  cumulativeBaselineHeads: number;     // الرؤوس التأسيسية
  cumulativeBirths: number;            // إجمالي المواليد الحية
  cumulativePurchases: number;         // إجمالي المشتريات (تأسيسي + استبدال فحول كل سنتين)
  cumulativeMortality: number;         // إجمالي النافق في كافة المراحل
  cumulativeSold: number;              // إجمالي المباع (تسمين + استبعاد + فحول مسنة)
  
  // فحص المعادلة الصفرية
  expectedEndCount: number;
  discrepancy: number;                 // يجب أن يساوي صفر تماماً!
  isReconciled: boolean;
}

/** التقرير المالي المترابط في اللحظة الزمنية مع البنود المخصصة القابلة للتعديل */
export interface FinancialSnapshot {
  day: number;
  
  // الإيرادات التراكمية الأساسية
  maleLambsRevenue: number;
  surplusFemalesRevenue: number;
  culledEwesRevenue: number;
  culledRamsRevenue: number;
  manureRevenue: number;
  woolRevenue: number;
  surplusHayRevenue: number;
  
  // بنود الإيرادات المخصصة
  customRevenueItems: CustomFinancialItem[];
  customRevenueTotal: number;

  totalRevenue: number;
  
  // التكاليف التشغيلية التراكمية (OPEX)
  concentrateFeedCost: number;     // علف مركز
  forageHayCost: number;           // دريس / علف مالئ
  veterinaryHealthCost: number;    // بيطرة وتحصينات
  laborCost: number;               // عمالة
  utilitiesMaintenanceCost: number;// محروقات وصيانة
  
  // بنود المصروفات المخصصة
  customExpenseItems: CustomFinancialItem[];
  customExpenseTotal: number;

  totalOpex: number;

  // الاستثمار الرأسمالي والإهلاك
  biologicalInitialCapex: number;  // رأس مال شراء القطيع الأصلي
  alfalfaCapex: number;            // رأس مال تأسيس حقل الفصة
  cumulativeDepreciation: number;  // الإهلاك المتراكم
  
  // مؤشرات الربحية
  ebitda: number;                  // الأرباح التشغيلية
  netProfit: number;               // صافي الربح بعد الإهلاك
  biologicalAssetValueIAS41: number; // القيمة العادلة للقطيع القائم في الحظائر
  costPerKgLiveWeight: number;     // تكلفة الكيلوجرام القائم المنتج
  cashBalance: number;             // رصيد السيولة النقدية المتراكم
}

/** الموقف الكامل للدراسة في أي مرحلة */
export interface StageFeasibilityReport {
  timestamp: string;
  day: number;
  flockConfig: BaselineFlockConfig;
  alfalfaConfig: AlfalfaFieldConfig;
  inventory: InventorySnapshot;
  financials: FinancialSnapshot;
  alfalfaBalance: {
    totalHayProducedTons: number;
    totalHayConsumedTons: number;
    haySurplusTons: number;
    hayDeficitTons: number;
    selfSufficiencyPercent: number;
  };
  cohortsSummary: Cohort[];
}
