import { StageFeasibilityReport } from '../../types/sheep';

/**
 * دالة توليد وتصدير ملف إكسل تفاعلي للدراسة مع التفاصيل المعدلة
 */
export function exportFeasibilityToExcel(report: StageFeasibilityReport) {
  const { flockConfig, inventory, financials, alfalfaBalance, day } = report;

  const rows: string[][] = [
    ['دراسة فنية ومالية لمشروع قطيع الأغنام ومحضر مطابقة الجرد المعتمد'],
    [`محطة التقييم: اليوم ${day} (${Math.round(day / 30)} شهراً / ${(day / 360).toFixed(1)} سنة)`],
    [`سلالة القطيع: ${flockConfig.breed.toUpperCase()}`],
    [`استبدال الفحول: كل سنتين إلزامي`],
    [`سياسة الاحتفاظ بالإناث: ${flockConfig.femaleRetentionStrategy}`],
    [`تاريخ الإصدار: ${new Date().toLocaleDateString('ar-EG')}`],
    [''],
    ['=== 1. تعداد الرؤوس الحية القائمة في الحظائر وتصنيف الإناث ==='],
    ['الفئة الفسيولوجية', 'العدد القائم (رأس)', 'الحالة والوصف'],
    ['أ* فطائم نامية (عمر شهرين إلى 11 شهر)', `${inventory.growingFemaleWeaners}`, 'فطائم تحت الإعداد'],
    ['ب* فطائم حاملة لأول مرة', `${inventory.firstParityPregnantHoggets}`, 'بكائر عشار'],
    ['ج* نعاج بالغة من بعد أول ولادة', `${inventory.parousMatureEwes}`, 'أمهات إنتاج رئيسية'],
    ['إجمالي إناث القطيع (أ + ب + ج)', `${inventory.matureEwesTotal}`, 'إجمالي الإناث'],
    ['فحول كباش عاملة للتلقيح', `${inventory.breedingRams}`, 'تستبدل كل سنتين'],
    ['مواليد رضع (0-60 يوماً)', `${inventory.sucklingLambs}`, 'رضاعة'],
    ['ذكور تسمين قائمة (خراف أضاحي ولحم)', `${inventory.fatteningMales}`, 'تسمين ذكور'],
    ['إناث تسمين قائمة (رخال تسمين تجاري للبيع)', `${inventory.fatteningFemales}`, 'تسمين إناث فائضة'],
    ['إجمالي الرؤوس الحية الفعلية في المزرعة', `${inventory.totalLiveFlock}`, 'مطابق 100%'],
    [''],
    ['=== 2. ميزان التدفق والحفظ العددي للقطيع (المعادلة الصفرية) ==='],
    ['عنصر حركة الرؤوس', 'العدد التراكمي (رأس)', 'ملاحظة'],
    ['القطيع التأسيسي والمشتريات (شامل استبدال الفحول)', `${inventory.cumulativePurchases}`, 'دخول رأسمالي'],
    ['إجمالي المواليد الحية المنتجة', `+${inventory.cumulativeBirths}`, `صافي المواليد بعد خصم ${inventory.cumulativeAbortedFetuses} جنين مجهض (${(inventory.configuredAbortionRate * 100).toFixed(1)}%)`],
    ['إجمالي النافق في كافة المراحل', `-${inventory.cumulativeMortality}`, 'خسارة بيولوجية (-)'],
    ['إجمالي المبيعات التجارية والأضاحي والفحول', `-${inventory.cumulativeSold}`, 'خروج بيع (-)'],
    ['الرصيد الدفتري المتوقع', `${inventory.expectedEndCount}`, 'الميزان النهائي'],
    ['الانحراف الحسابي (Discrepancy)', `${inventory.discrepancy}`, inventory.isReconciled ? 'مطابقة صفرية ناجحة 100%' : 'يوجد تباين'],
    [''],
    ['=== 3. القوائم والمؤشرات المالية التراكمية ($) ==='],
    ['البند المالي', 'القيمة ($)', 'الملاحظة'],
    ['إجمالي الإيرادات المحققة', `${financials.totalRevenue}`, `تشمل ${financials.customRevenueTotal}$ بنود مخصصة`],
    ['إجمالي التكاليف التشغيلية (OPEX)', `${financials.totalOpex}`, `تشمل ${financials.customExpenseTotal}$ بنود مخصصة`],
    ['الأرباح التشغيلية (EBITDA)', `${financials.ebitda}`, `هامش ${financials.totalRevenue > 0 ? Math.round((financials.ebitda / financials.totalRevenue) * 100) : 0}%`],
    ['تقييم الأصول البيولوجية (IAS 41)', `${financials.biologicalAssetValueIAS41}`, 'القيمة السوقية للقطيع القائم'],
    ['تكلفة إنتاج الكيلوجرام القائم', `${financials.costPerKgLiveWeight}$/كجم`, 'اقتصاديات الوحدة'],
    ['الرصيد النقدي التراكمي', `${financials.cashBalance}$`, 'السيولة الصافية'],
    [''],
    ['=== 4. ميزان دريس الفصة المعمرة ==='],
    ['إنتاج الأرض من الدريس (طن)', `${alfalfaBalance.totalHayProducedTons}`],
    ['استهلاك القطيع من الدريس (طن)', `${alfalfaBalance.totalHayConsumedTons}`],
    ['فائض الدريس المتاح للبيع (طن)', `${alfalfaBalance.haySurplusTons}`],
    ['عجز الدريس المشترى من السوق (طن)', `${alfalfaBalance.hayDeficitTons}`],
    ['نسبة الاكتفاء الذاتي العلفي (%)', `${alfalfaBalance.selfSufficiencyPercent}%`],
  ];

  if (financials.customRevenueItems.length > 0 || financials.customExpenseItems.length > 0) {
    rows.push(['']);
    rows.push(['=== 5. البنود المالية المخصصة المضافة من المستخدم ===']);
    rows.push(['اسم البند', 'النوع', 'المبلغ ($)']);
    financials.customRevenueItems.forEach(item => {
      rows.push([item.title, 'إيراد (+)', `${item.amount}`]);
    });
    financials.customExpenseItems.forEach(item => {
      rows.push([item.title, 'مصروف (-)', `${item.amount}`]);
    });
  }

  const csvContent = '\uFEFF' + rows.map(e => e.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Sheep_Flock_Study_Day_${day}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
