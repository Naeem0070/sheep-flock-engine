import { BaselineFlockConfig, AlfalfaFieldConfig } from '../types/sheep';

export const DEFAULT_FLOCK_CONFIG: BaselineFlockConfig = {
  breed: 'awassi',
  reproductionSystem: 'annual',
  matingProtocol: 'natural_controlled',
  femaleRetentionStrategy: 'retain_half', // الافتراضي: الاحتفاظ بنصف الإناث وتسمين الباقي
  
  // أعداد ورؤوس القطيع التأسيسي
  adultEwesCount: 100,
  breedingRamsCount: 4,
  ewePurchasePrice: 280,      // دولار
  ramPurchasePrice: 500,

  // المعايير البيولوجية للسلالة
  fertilityRate: 0.90,        // 90%
  abortionRate: 0.03,         // 3% نسبة الإجهاض
  prolificacyFactor: 1.30,    // 1.3 مولود / نعجة والدة
  gestationDays: 150,
  lactationDays: 60,
  matingWindowDays: 42,

  // نسب النفوق المرحلية الدقيقة
  preWeaningMortalityRate: 0.08,  // 8% في الرضاعة
  postWeaningMortalityRate: 0.02, // 2% في التسمين
  hoggetMortalityRate: 0.015,     // 1.5% في الرخال النامية
  adultAnnualMortalityRate: 0.04, // 4% في الأمهات سنوياً

  // سياسة الاستبعاد والإحلال
  adultAnnualCullRate: 0.15,      // 15% استبعاد سنوي
  ramReplacementYears: 2,         // استبدال الفحول كل سنتين إلزامي
  maxHousingCapacity: 1000,       // سعة الحظائر القصوى

  // مدة المشروع بالأيام (افتراضي 1080 يوماً = 3 سنوات، وقابلة للتمديد حتى 10 سنوات وأكثر)
  totalProjectDurationDays: 1080,

  // أسعار المبيعات السوقية
  fattenedMaleSellingPrice: 240,
  surplusFemaleSellingPrice: 200,
  culledEweSellingPrice: 150,
  culledRamSellingPrice: 250,
  manureBagSellingPrice: 3.5,
  woolPerHeadPrice: 2.0,
};

export const DEFAULT_ALFALFA_CONFIG: AlfalfaFieldConfig = {
  enabled: true,
  areaHectares: 3.0,               // 3 هكتارات فصة
  establishmentCostPerHa: 2200,    // تكلفة شبكة الري والتجهيز
  lifespanYears: 5,                // عمر الفصة 5 سنوات
  cutsPerYear: 7,                  // 7 حشات سنوياً
  hayYieldPerCutTonsPerHa: 2.0,    // 2 طن/هكتار لكل حشة
  annualOpexPerHa: 900,            // تشغيل، ري، وتسميد
  marketHayPricePerTon: 220,       // سعر شراء الطن من السوق
  surplusHaySellingPricePerTon: 200, // سعر بيع الطن الفائض
  feedShrinkagePercent: 0.06,      // 6% هدر
};
