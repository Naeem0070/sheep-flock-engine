import { SheepSimulationEngine } from '../simulationEngine';
import { DEFAULT_FLOCK_CONFIG, DEFAULT_ALFALFA_CONFIG } from '../defaultParameters';
import { CustomFinancialItem } from '../../types/sheep';

console.log('================================================================');
console.log('🧪 بدء اختبار المحاكاة المحدثة بعد التعديلات الستة:');
console.log('1. استبدال الفحول كل سنتين');
console.log('2. إظهار نسبة الإجهاض في بوابة الجرد');
console.log('3. تقسيم الإناث: (أ) فطائم نامية، (ب) فطائم حاملة أول مرة، (ج) نعاج بالغة');
console.log('4. البنود المالية المخصصة القابلة للتعديل');
console.log('5. مدة المشروع الديناميكية (اختبار حتى 5 سنوات = 1800 يوم)');
console.log('6. سياسة الاحتفاظ بنصف الإناث (50%)');
console.log('================================================================\n');

const testCustomItems: CustomFinancialItem[] = [
  { id: '1', title: 'مبيعات حليب وجبن', amount: 2000, type: 'revenue' },
  { id: '2', title: 'إيجار مراعي', amount: 1500, type: 'expense' }
];

const engine = new SheepSimulationEngine(DEFAULT_FLOCK_CONFIG, DEFAULT_ALFALFA_CONFIG);

const milestones = [360, 720, 1080, 1440, 1800];

let allPassed = true;

for (const day of milestones) {
  const report = engine.simulateUntil(day, testCustomItems);
  const inv = report.inventory;
  const fin = report.financials;

  console.log(`📌 محطة اليوم ${day} (${(day / 360).toFixed(1)} سنة):`);
  console.log(`   - إجمالي الرؤوس الحية الفعلية: ${inv.totalLiveFlock} رأس`);
  console.log(`   - تصنيف الإناث الثلاثي:`);
  console.log(`     * (أ) فطائم نامية (2-11 شهر): ${inv.growingFemaleWeaners}`);
  console.log(`     * (ب) فطائم حاملة لأول مرة: ${inv.firstParityPregnantHoggets}`);
  console.log(`     * (ج) نعاج بالغة بعد أول ولادة: ${inv.parousMatureEwes}`);
  console.log(`     * إجمالي إناث القطيع: ${inv.matureEwesTotal} أنثى`);
  console.log(`   - برنامج التسمين المفصول:`);
  console.log(`     * ذكور تسمين قائمة: ${inv.fatteningMales} خروف`);
  console.log(`     * إناث تسمين قائمة: ${inv.fatteningFemales} رخال`);
  console.log(`     * إجمالي التسمين: ${inv.fatteningLambsTotal} رأس`);
  console.log(`   - فحول كباش عاملة: ${inv.breedingRams} (دورة تبديل كل سنتين)`);
  console.log(`   - نسبة الإجهاض المعتمدة: ${(inv.configuredAbortionRate * 100).toFixed(1)}% | أجنة مجهضة: ${inv.cumulativeAbortedFetuses}`);
  console.log(`   - مواليد حية: ${inv.cumulativeBirths} | نافق: ${inv.cumulativeMortality} | مباع: ${inv.cumulativeSold} | مشتريات (شامل استبدال الفحول): ${inv.cumulativePurchases}`);
  console.log(`   - فحص المعادلة الصفرية (Discrepancy Check): ${inv.discrepancy === 0 ? '✅ 0 (مطابق 100%)' : `❌ ${inv.discrepancy} (يوجد خطأ!)`}`);
  console.log(`   - الإيرادات الكلية: ${fin.totalRevenue.toLocaleString()}$ (شامل بنود مخصصة: ${fin.customRevenueTotal}$)`);
  console.log(`   - التكاليف الكلية OPEX: ${fin.totalOpex.toLocaleString()}$ (شامل بنود مخصصة: ${fin.customExpenseTotal}$)`);
  console.log(`   - الأرباح التشغيلية EBITDA: ${fin.ebitda.toLocaleString()}$`);
  console.log('----------------------------------------------------------------');

  if (!inv.isReconciled || inv.discrepancy !== 0) {
    allPassed = false;
  }
}

if (allPassed) {
  console.log('\n🎉 نجا الاختبار بنجاح تام لجميع المحطات (حتى 5 سنوات) مع تحقق المطابقة الصفرية 100%!');
} else {
  console.error('\n❌ فشل الاختبار: يوجد تباين في مطابقة الأعداد!');
  process.exit(1);
}
