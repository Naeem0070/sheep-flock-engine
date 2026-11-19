'use client';

import React from 'react';
import { InventorySnapshot } from '../types/sheep';
import { 
  ShieldCheck, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  Activity, 
  Baby, 
  HeartCrack 
} from 'lucide-react';

interface InventoryAuditCardProps {
  inventory: InventorySnapshot;
}

export const InventoryAuditCard: React.FC<InventoryAuditCardProps> = ({ inventory }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      {/* عنوان البطاقة وشارة المطابقة */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-forest-50 text-forest-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              بوابة الجرد والمطابقة الصفرية (Zero-Discrepancy Gateway)
            </h3>
            <p className="text-xs text-slate-500">
              {inventory.periodLabel} - تدقيق توازن حركة الرؤوس وتصنيف الإناث التناسلي
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* مؤشر نسبة الإجهاض المعتمد */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200">
            <HeartCrack className="w-4 h-4 text-amber-600" />
            <span>
              نسبة الإجهاض: <strong>{(inventory.configuredAbortionRate * 100).toFixed(1)}%</strong> ({inventory.cumulativeAbortedFetuses} جنين مجهض)
            </span>
          </div>

          {/* شارة المطابقة الصفرية */}
          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold border ${
            inventory.isReconciled 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
              : 'bg-rose-50 text-rose-800 border-rose-300'
          }`}>
            {inventory.isReconciled ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>المطابقة الصفرية معتمدة: العجز = 0 رأس</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>يوجد انحراف حسابي: {inventory.discrepancy} رأس!</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* الرؤوس الحية القائمة في الحظائر - تفصيل الإناث الثلاثي الصارم */}
      <div className="mb-4">
        <span className="text-xs font-bold text-slate-800 block mb-2.5">
          تصنيف إناث القطيع الفسيولوجي (أ، ب، ج) والرؤوس الحية:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5">
          {/* أ* فطائم نامية من عمر شهرين الى عمر 11 شهر */}
          <div className="bg-indigo-50/70 p-3.5 rounded-xl border border-indigo-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-indigo-950">أ* فطائم نامية</span>
              <span className="px-1.5 py-0.5 rounded bg-indigo-200/60 text-[9px] font-bold text-indigo-800">2 - 11 شهر</span>
            </div>
            <span className="text-2xl font-black text-indigo-900 font-mono">{inventory.growingFemaleWeaners}</span>
            <span className="text-[10px] text-indigo-700 block mt-0.5">فطائم تحت الإعداد للتلقيح</span>
          </div>

          {/* ب* فطائم حاملة لاول مرة */}
          <div className="bg-purple-50/70 p-3.5 rounded-xl border border-purple-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-purple-950">ب* فطائم حاملة أول مرة</span>
              <span className="px-1.5 py-0.5 rounded bg-purple-200/60 text-[9px] font-bold text-purple-800">بكائر عشار</span>
            </div>
            <span className="text-2xl font-black text-purple-900 font-mono">{inventory.firstParityPregnantHoggets}</span>
            <span className="text-[10px] text-purple-700 block mt-0.5">حمل أولي في طور الإنجاز</span>
          </div>

          {/* ج* نعاج بالغة من بعد اول ولادة */}
          <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-emerald-950">ج* نعاج بالغة ولودة</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-200/60 text-[9px] font-bold text-emerald-800">بعد أول ولادة</span>
            </div>
            <span className="text-2xl font-black text-emerald-900 font-mono">{inventory.parousMatureEwes}</span>
            <span className="text-[10px] text-emerald-700 block mt-0.5">أمهات إنتاج رئيسية</span>
          </div>

          {/* فحول كباش عاملة */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-600 block mb-1">فحول كباش عاملة</span>
            <span className="text-2xl font-black text-slate-800 font-mono">{inventory.breedingRams}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">تبديل كل سنتين</span>
          </div>

          {/* مواليد رضع قائمة */}
          <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200">
            <span className="text-[11px] font-semibold text-amber-900 block mb-1">مواليد رضع (0-60 يوم)</span>
            <span className="text-2xl font-black text-amber-800 font-mono">{inventory.sucklingLambs}</span>
            <span className="text-[10px] text-amber-700 block mt-0.5">رضاعة وحليب بادئ</span>
          </div>

          {/* ذكور تسمين قائمة */}
          <div className="bg-sky-50/70 p-3.5 rounded-xl border border-sky-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-sky-950">ذكور تسمين قائمة</span>
              <span className="px-1.5 py-0.5 rounded bg-sky-200/60 text-[9px] font-bold text-sky-800">طليان ذكور</span>
            </div>
            <span className="text-2xl font-black text-sky-900 font-mono">{inventory.fatteningMales}</span>
            <span className="text-[10px] text-sky-700 block mt-0.5">خراف لحم / أضاحي</span>
          </div>

          {/* إناث تسمين قائمة */}
          <div className="bg-rose-50/70 p-3.5 rounded-xl border border-rose-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-rose-950">إناث تسمين قائمة</span>
              <span className="px-1.5 py-0.5 rounded bg-rose-200/60 text-[9px] font-bold text-rose-800">رخال تسمين</span>
            </div>
            <span className="text-2xl font-black text-rose-900 font-mono">{inventory.fatteningFemales}</span>
            <span className="text-[10px] text-rose-700 block mt-0.5">فائضة مخصصة للبيع</span>
          </div>
        </div>
      </div>

      {/* شريط الإجمالي والمجموع */}
      <div className="p-3 bg-slate-900 text-white rounded-xl mb-6 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <Activity className="w-4 h-4 text-forest-400" />
          <span>
            إجمالي إناث القطيع (أ + ب + ج): <strong className="text-forest-400 text-sm font-mono font-bold">{inventory.matureEwesTotal} أنثى</strong>
          </span>
          <span className="text-slate-500">|</span>
          <span>
            إجمالي المواليد الحية المتراكمة: <strong className="text-emerald-400 font-mono font-bold">+{inventory.cumulativeViableBirths} رأس</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span>إجمالي الرؤوس الحية الفعلية في المزرعة:</span>
          <span className="text-base font-black font-mono text-emerald-400 bg-slate-800 px-3 py-1 rounded-lg">
            {inventory.totalLiveFlock} رأس
          </span>
        </div>
      </div>

      {/* ميزان حركة الرؤوس الرياضي الصارم */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-xs text-right">
          <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
            <tr>
              <th className="p-3">عنصر حركة الرؤوس</th>
              <th className="p-3">نوع الحركة</th>
              <th className="p-3">العدد التراكمي (رأس)</th>
              <th className="p-3">التفصيل والتحقق الميداني</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            <tr>
              <td className="p-3 font-bold text-slate-800">القطيع التأسيسي + مشتريات الإحلال</td>
              <td className="p-3 text-emerald-700 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> دخول رأسمالي
              </td>
              <td className="p-3 font-mono font-bold text-slate-900">{inventory.cumulativePurchases}</td>
              <td className="p-3 text-slate-500">
                يشمل القطيع التأسيسي الأصلي ({inventory.cumulativeBaselineHeads}) + استبدال الفحول كل سنتين
              </td>
            </tr>

            <tr className="bg-emerald-50/40">
              <td className="p-3 font-bold text-slate-800">إجمالي المواليد الحية المنتجة</td>
              <td className="p-3 text-emerald-700 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> إضافة بيولوجية (+)
              </td>
              <td className="p-3 font-mono font-bold text-emerald-800">+{inventory.cumulativeBirths}</td>
              <td className="p-3 text-slate-500">
                صافي المواليد الحية بعد استبعاد {inventory.cumulativeAbortedFetuses} حالة إجهاض (نسبة {(inventory.configuredAbortionRate * 100).toFixed(1)}%)
              </td>
            </tr>

            <tr className="bg-rose-50/40">
              <td className="p-3 font-bold text-slate-800">إجمالي النفوق في كافة المراحل الحيوية</td>
              <td className="p-3 text-rose-700 flex items-center gap-1">
                <ArrowDownRight className="w-3.5 h-3.5" /> خسارة بيولوجية (-)
              </td>
              <td className="p-3 font-mono font-bold text-rose-800">-{inventory.cumulativeMortality}</td>
              <td className="p-3 text-slate-500">رضاعة + تسمين + فطائم نامية + أمهات بالغة</td>
            </tr>

            <tr className="bg-amber-50/40">
              <td className="p-3 font-bold text-slate-800">إجمالي المبيعات التجارية والأضاحي والفحول</td>
              <td className="p-3 text-amber-700 flex items-center gap-1">
                <ArrowDownRight className="w-3.5 h-3.5" /> خروج نقدي مبيعات (-)
              </td>
              <td className="p-3 font-mono font-bold text-amber-800">-{inventory.cumulativeSold}</td>
              <td className="p-3 text-slate-500">ذكور تسمين + إناث مسمنة للبيع + نعاج استبعاد + فحول مسنة مستبدلة</td>
            </tr>

            <tr className="bg-slate-900 text-white font-bold">
              <td className="p-3.5">الرصيد الدفتري المتوقع vs الرصيد الحي الفعلي</td>
              <td className="p-3.5 text-forest-300">مطابقة الميزان النهائي</td>
              <td className="p-3.5 font-mono text-sm text-forest-400">
                {inventory.expectedEndCount} متوقع = {inventory.totalLiveFlock} فعلي
              </td>
              <td className="p-3.5 text-xs text-forest-200">
                المعادلة الصفرية: ({inventory.cumulativePurchases} + {inventory.cumulativeBirths} - {inventory.cumulativeMortality} - {inventory.cumulativeSold}) = {inventory.totalLiveFlock} (الانحراف = {inventory.discrepancy})
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
