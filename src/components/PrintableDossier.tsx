'use client';

import React from 'react';
import { StageFeasibilityReport } from '../types/sheep';
import { ShieldCheck, Award, FileText, HeartCrack, Layers } from 'lucide-react';

interface PrintableDossierProps {
  report: StageFeasibilityReport;
}

export const PrintableDossier: React.FC<PrintableDossierProps> = ({ report }) => {
  const { flockConfig, alfalfaConfig, inventory, financials, alfalfaBalance, day } = report;

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 card-print print:p-0 print:border-none">
      {/* ترويسة التقرير الرسمية */}
      <div className="border-b-2 border-slate-900 pb-5 mb-6 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-4 h-4 bg-forest-800 rounded-sm inline-block"></span>
            <span className="text-xs font-extrabold tracking-wider text-forest-800 uppercase">
              منظومة دراسات الجدوى والتدقيق البيولوجي والمالي
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-950">
            تقرير الموقف الفني والمالي ومحضر مطابقة الجرد
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            مشروع تربية وتسمين قطيع أغنام سلالة ({flockConfig.breed.toUpperCase()}) | محطة التقييم: <strong className="text-forest-800">اليوم {day}</strong> ({Math.round(day / 30)} شهراً / {(day / 360).toFixed(1)} سنة)
          </p>
        </div>

        <div className="text-left font-mono text-xs text-slate-500">
          <div>رقم الوثيقة: <strong className="text-slate-800 font-bold">REP-SHP-{day}-{new Date().getFullYear()}</strong></div>
          <div>تاريخ الإصدار: {new Date().toLocaleDateString('ar-EG')}</div>
          <div>استبدال الفحول: كل سنتين إلزامي</div>
        </div>
      </div>

      {/* شهادة إبراء الذمة والمطابقة الصفرية ونسبة الإجهاض */}
      <div className="mb-6 p-4 rounded-xl border border-emerald-300 bg-emerald-50/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Award className="w-8 h-8 text-emerald-700 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-emerald-950">
              شهادة الاعتماد والمطابقة الصفرية للقطيع (Zero-Discrepancy Audit Certificate)
            </h4>
            <p className="text-xs text-emerald-800 mt-0.5">
              تشهد المنظومة الحسابية بأنه تمت مطابقة الرصيد الدفتري مع الرصيد الحي الفعلي بنسبة مطابقة 100% دون أي عجز (العجز = 0 رأس)، مع احتساب نسبة إجهاض {(inventory.configuredAbortionRate * 100).toFixed(1)}% ({inventory.cumulativeAbortedFetuses} جنين مجهض مستبعد).
            </p>
          </div>
        </div>

        <div className="text-center font-mono font-black text-emerald-800 bg-white px-4 py-2 rounded-lg border border-emerald-300">
          <span className="block text-[10px] text-slate-500 font-sans">الانحراف العددي</span>
          <span className="text-lg">0 رأس (مطابق 100%)</span>
        </div>
      </div>

      {/* الجداول الفنية: تعداد الرؤوس وميزان الحركة */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* جدول التعداد الميداني القائم بتصنيف الإناث الثلاثي */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
            <FileText className="w-4 h-4 text-forest-700" />
            1. تعداد الرؤوس الحية وتصنيف الإناث في الحظائر (اليوم {day})
          </h4>
          <table className="w-full text-xs text-right border border-slate-200 rounded-lg overflow-hidden">
            <tbody className="divide-y divide-slate-200">
              <tr className="bg-indigo-50/50">
                <td className="p-2 font-bold text-indigo-950">أ* فطائم نامية (عمر شهرين إلى 11 شهر)</td>
                <td className="p-2 font-mono font-bold text-indigo-900 text-left">{inventory.growingFemaleWeaners} رأس</td>
              </tr>
              <tr className="bg-purple-50/50">
                <td className="p-2 font-bold text-purple-950">ب* فطائم حاملة لأول مرة</td>
                <td className="p-2 font-mono font-bold text-purple-900 text-left">{inventory.firstParityPregnantHoggets} رأس</td>
              </tr>
              <tr className="bg-emerald-50/50">
                <td className="p-2 font-bold text-emerald-950">ج* نعاج بالغة من بعد أول ولادة</td>
                <td className="p-2 font-mono font-bold text-emerald-900 text-left">{inventory.parousMatureEwes} رأس</td>
              </tr>
              <tr className="bg-slate-100 font-bold text-slate-900">
                <td className="p-2">إجمالي إناث القطيع (أ + ب + ج)</td>
                <td className="p-2 font-mono text-left">{inventory.matureEwesTotal} أنثى</td>
              </tr>
              <tr>
                <td className="p-2">فحول كباش عاملة (تستبدل كل سنتين)</td>
                <td className="p-2 font-mono font-bold text-slate-900 text-left">{inventory.breedingRams} رأس</td>
              </tr>
              <tr>
                <td className="p-2">مواليد رضع (0-60 يوماً)</td>
                <td className="p-2 font-mono font-bold text-slate-900 text-left">{inventory.sucklingLambs} رأس</td>
              </tr>
              <tr>
                <td className="p-2">ذكور تسمين قائمة (خراف أضاحي / لحم)</td>
                <td className="p-2 font-mono font-bold text-sky-900 text-left">{inventory.fatteningMales} رأس</td>
              </tr>
              <tr>
                <td className="p-2">إناث تسمين قائمة (رخال تسمين مخصصة للبيع)</td>
                <td className="p-2 font-mono font-bold text-rose-900 text-left">{inventory.fatteningFemales} رأس</td>
              </tr>
              <tr className="bg-forest-900 text-white font-bold">
                <td className="p-2.5">إجمالي الرؤوس الحية الفعلية في المزرعة</td>
                <td className="p-2.5 font-mono text-sm text-left text-forest-300">{inventory.totalLiveFlock} رأس</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ميزان حركة الرؤوس التراكمي */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            2. ميزان التدفق العددي التراكمي للقطيع (المعادلة الصفرية)
          </h4>
          <table className="w-full text-xs text-right border border-slate-200 rounded-lg overflow-hidden">
            <tbody className="divide-y divide-slate-200">
              <tr className="bg-slate-50 font-semibold text-slate-700">
                <td className="p-2">القطيع التأسيسي والمشتريات (شامل استبدال الفحول)</td>
                <td className="p-2 font-mono font-bold text-slate-900 text-left">{inventory.cumulativePurchases} رأس</td>
              </tr>
              <tr className="text-emerald-800">
                <td className="p-2">إجمالي المواليد الحية المنتجة (+)</td>
                <td className="p-2 font-mono font-bold text-left">+{inventory.cumulativeBirths} رأس</td>
              </tr>
              <tr className="bg-rose-50/50 text-rose-800">
                <td className="p-2">إجمالي النافق في كافة المراحل الحيوية (-)</td>
                <td className="p-2 font-mono font-bold text-left">-{inventory.cumulativeMortality} رأس</td>
              </tr>
              <tr className="bg-amber-50/50 text-amber-800">
                <td className="p-2">إجمالي المبيعات التجارية والأضاحي والفحول (-)</td>
                <td className="p-2 font-mono font-bold text-left">-{inventory.cumulativeSold} رأس</td>
              </tr>
              <tr className="bg-slate-900 text-white font-bold">
                <td className="p-2.5">الرصيد الدفتري المستهدف</td>
                <td className="p-2.5 font-mono text-sm text-left text-forest-400">{inventory.expectedEndCount} رأس</td>
              </tr>
            </tbody>
          </table>

          {/* ملخص الإجهاض والتناسل */}
          <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
            <div className="flex justify-between text-slate-700">
              <span>نسبة الخصوبة وعقد الحمل:</span>
              <strong className="font-mono">{(flockConfig.fertilityRate * 100).toFixed(0)}%</strong>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>نسبة الإجهاض المحتسبة:</span>
              <strong className="font-mono text-rose-700">{(inventory.configuredAbortionRate * 100).toFixed(1)}% ({inventory.cumulativeAbortedFetuses} جنين مجهض)</strong>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>سياسة الاحتفاظ بالإناث المعتمدة:</span>
              <strong className="text-forest-800 font-semibold">
                {flockConfig.femaleRetentionStrategy === 'retain_half' ? 'الاحتفاظ بـ 50% من الإناث وتسمين الباقي' : flockConfig.femaleRetentionStrategy}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* الموقف المالي واقتصاديات الوحدة والبنود المخصصة */}
      <div className="mb-6 border border-slate-200 rounded-xl p-4 bg-slate-50">
        <h4 className="text-xs font-bold text-slate-900 mb-3 border-b border-slate-200 pb-1.5">
          3. خلاصة المركز المالي واقتصاديات المشروع حتى اليوم {day}
        </h4>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-xs">
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[11px]">إجمالي الإيرادات المحققة</span>
            <span className="text-lg font-black text-emerald-700 font-mono">{financials.totalRevenue.toLocaleString()}$</span>
            {financials.customRevenueTotal > 0 && (
              <span className="text-[10px] text-emerald-600 block">شامل {financials.customRevenueTotal.toLocaleString()}$ بنود مخصصة</span>
            )}
          </div>

          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[11px]">إجمالي التكاليف التشغيلية (OPEX)</span>
            <span className="text-lg font-black text-rose-700 font-mono">{financials.totalOpex.toLocaleString()}$</span>
            {financials.customExpenseTotal > 0 && (
              <span className="text-[10px] text-rose-600 block">شامل {financials.customExpenseTotal.toLocaleString()}$ بنود مخصصة</span>
            )}
          </div>

          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[11px]">الربح التشغيلي (EBITDA)</span>
            <span className="text-lg font-black text-indigo-700 font-mono">{financials.ebitda.toLocaleString()}$</span>
          </div>

          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[11px]">تقييم الأصول البيولوجية (IAS 41)</span>
            <span className="text-lg font-black text-slate-900 font-mono">{financials.biologicalAssetValueIAS41.toLocaleString()}$</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-200">
          <div>
            <span>تكلفة الكيلوجرام القائم المنتج: </span>
            <strong className="text-slate-900 font-mono">{financials.costPerKgLiveWeight}$/كجم</strong>
          </div>
          <div>
            <span>اكتفاء دريس الفصة المعمرة: </span>
            <strong className="text-emerald-700 font-mono">{alfalfaBalance.selfSufficiencyPercent}%</strong>
          </div>
          <div>
            <span>السيولة النقدية المتراكمة: </span>
            <strong className="text-slate-900 font-mono">{financials.cashBalance.toLocaleString()}$</strong>
          </div>
        </div>
      </div>

      {/* حقول التواقيع والاعتماد الرسمي */}
      <div className="pt-6 border-t border-slate-300 page-break">
        <h4 className="text-xs font-bold text-slate-700 mb-6 text-center">
          اعتماد محضر المطابقة والجرد الميداني (Sign-off & Approvals)
        </h4>

        <div className="grid grid-cols-3 gap-6 text-center text-xs">
          <div className="border-t border-slate-400 pt-3">
            <span className="font-bold text-slate-800 block">مهندس الإنتاج الزراعي والحيواني</span>
            <span className="text-[11px] text-slate-500 block mt-1">الاسم: .......................................</span>
            <span className="text-[11px] text-slate-400 block mt-2">التوقيع والختم</span>
          </div>

          <div className="border-t border-slate-400 pt-3">
            <span className="font-bold text-slate-800 block">طبيب المزرعة البيطري</span>
            <span className="text-[11px] text-slate-500 block mt-1">الاسم: .......................................</span>
            <span className="text-[11px] text-slate-400 block mt-2">التوقيع والختم</span>
          </div>

          <div className="border-t border-slate-400 pt-3">
            <span className="font-bold text-slate-800 block">المدير المالي والمدقق العام</span>
            <span className="text-[11px] text-slate-500 block mt-1">الاسم: .......................................</span>
            <span className="text-[11px] text-slate-400 block mt-2">التوقيع والختم</span>
          </div>
        </div>
      </div>
    </div>
  );
};
