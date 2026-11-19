'use client';

import React, { useState } from 'react';
import { FinancialSnapshot, AlfalfaFieldConfig, CustomFinancialItem } from '../types/sheep';
import { 
  DollarSign, 
  TrendingUp, 
  CircleDollarSign, 
  Wheat, 
  Scale, 
  Wallet, 
  BadgePercent,
  PlusCircle,
  Trash2,
  Edit3,
  Check,
  X
} from 'lucide-react';

interface FinancialMetricsCardProps {
  financials: FinancialSnapshot;
  alfalfaBalance: {
    totalHayProducedTons: number;
    totalHayConsumedTons: number;
    haySurplusTons: number;
    hayDeficitTons: number;
    selfSufficiencyPercent: number;
  };
  alfalfaConfig: AlfalfaFieldConfig;
  customItems: CustomFinancialItem[];
  onAddCustomItem: (item: Omit<CustomFinancialItem, 'id'>) => void;
  onRemoveCustomItem: (id: string) => void;
  onUpdateCustomItem: (id: string, newTitle: string, newAmount: number) => void;
}

export const FinancialMetricsCard: React.FC<FinancialMetricsCardProps> = ({
  financials,
  alfalfaBalance,
  alfalfaConfig,
  customItems,
  onAddCustomItem,
  onRemoveCustomItem,
  onUpdateCustomItem,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState<number | ''>('');
  const [newType, setNewType] = useState<'revenue' | 'expense'>('revenue');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAmount, setEditAmount] = useState<number>(0);

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || newAmount === '' || Number(newAmount) <= 0) return;
    onAddCustomItem({
      title: newTitle.trim(),
      amount: Number(newAmount),
      type: newType,
    });
    setNewTitle('');
    setNewAmount('');
    setShowAddModal(false);
  };

  const startEdit = (item: CustomFinancialItem) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditAmount(item.amount);
  };

  const saveEdit = (id: string) => {
    if (!editTitle.trim() || editAmount < 0) return;
    onUpdateCustomItem(id, editTitle.trim(), Number(editAmount));
    setEditingId(null);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              المؤشرات المالية التراكمية واقتصاديات الوحدة
            </h3>
            <p className="text-xs text-slate-500">
              الأرباح التشغيلية، تقييم الأصول البيولوجية IAS 41، وإدارة البنود المخصصة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* زر إضافة بند مالي مخصص */}
          <button
            onClick={() => setShowAddModal(!showAddModal)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-bold rounded-xl transition no-print"
          >
            <PlusCircle className="w-4 h-4 text-indigo-600" />
            <span>إضافة بند مالي مخصص</span>
          </button>

          <div className="flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold">
            <Wallet className="w-4 h-4 text-slate-500" />
            <span>السيولة النقدية: <strong className="text-emerald-700 font-mono font-bold">{financials.cashBalance.toLocaleString()}$</strong></span>
          </div>
        </div>
      </div>

      {/* نموذج إضافة بند مالي جديد */}
      {showAddModal && (
        <form onSubmit={handleCreateItem} className="mb-6 p-4 bg-indigo-50/60 border border-indigo-200 rounded-xl no-print">
          <h4 className="text-xs font-bold text-indigo-950 mb-3 flex items-center gap-1.5">
            <PlusCircle className="w-4 h-4 text-indigo-700" />
            إضافة بند مالي مخصص جديد (إيراد أو مصروف)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">اسم البند</label>
              <input
                type="text"
                placeholder="مثال: مبيعات ألبان / إيجار حظائر"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">المبلغ التراكمي ($)</label>
              <input
                type="number"
                min="1"
                placeholder="0"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">نوع البند</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as 'revenue' | 'expense')}
                className="w-full p-2 rounded-lg border border-slate-300 bg-white"
              >
                <option value="revenue">إيراد إضافي (+)</option>
                <option value="expense">مصروف تشغيلي إضافي (-)</option>
              </select>
            </div>

            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="w-full py-2 bg-indigo-700 hover:bg-indigo-800 text-white font-bold rounded-lg transition"
              >
                حفظ وإدراج
              </button>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="py-2 px-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg"
              >
                إلغاء
              </button>
            </div>
          </div>
        </form>
      )}

      {/* المؤشرات الأربعة الرئيسية */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-4 rounded-xl border border-emerald-200">
          <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5 mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            إجمالي الإيرادات المحققة
          </span>
          <span className="text-2xl font-black text-emerald-950 font-mono">
            {financials.totalRevenue.toLocaleString()}$
          </span>
          <span className="text-[10px] text-emerald-700 block mt-1">
            {financials.customRevenueTotal > 0 && `(يشمل ${financials.customRevenueTotal.toLocaleString()}$ بنود مخصصة)`}
          </span>
        </div>

        <div className="bg-gradient-to-br from-rose-50 to-rose-100/50 p-4 rounded-xl border border-rose-200">
          <span className="text-xs font-semibold text-rose-800 flex items-center gap-1.5 mb-1">
            <CircleDollarSign className="w-4 h-4 text-rose-600" />
            التكاليف التشغيلية (OPEX)
          </span>
          <span className="text-2xl font-black text-rose-950 font-mono">
            {financials.totalOpex.toLocaleString()}$
          </span>
          <span className="text-[10px] text-rose-700 block mt-1">
            {financials.customExpenseTotal > 0 && `(يشمل ${financials.customExpenseTotal.toLocaleString()}$ بنود مخصصة)`}
          </span>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 p-4 rounded-xl border border-indigo-200">
          <span className="text-xs font-semibold text-indigo-800 flex items-center gap-1.5 mb-1">
            <BadgePercent className="w-4 h-4 text-indigo-600" />
            الربح التشغيلي (EBITDA)
          </span>
          <span className="text-2xl font-black text-indigo-950 font-mono">
            {financials.ebitda.toLocaleString()}$
          </span>
          <span className="text-[10px] text-indigo-700 block mt-1">
            هامش ربح تشغيلي: {financials.totalRevenue > 0 ? Math.round((financials.ebitda / financials.totalRevenue) * 100) : 0}%
          </span>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 p-4 rounded-xl border border-amber-200">
          <span className="text-xs font-semibold text-amber-800 flex items-center gap-1.5 mb-1">
            <Scale className="w-4 h-4 text-amber-600" />
            تقييم الأصول البيولوجية (IAS 41)
          </span>
          <span className="text-2xl font-black text-amber-950 font-mono">
            {financials.biologicalAssetValueIAS41.toLocaleString()}$
          </span>
          <span className="text-[10px] text-amber-700 block mt-1">
            القيمة السوقية العادلة للقطيع القائم
          </span>
        </div>
      </div>

      {/* تفاصيل التكاليف ومؤشر الفصة */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        {/* تفكيك التكاليف التشغيلية */}
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
          <h4 className="text-xs font-bold text-slate-800 mb-3 flex items-center justify-between">
            <span>تفكيك التكاليف التشغيلية التراكمية</span>
            <span className="text-[11px] font-normal text-slate-500">
              تكلفة الكيلوجرام القائم: <strong className="text-slate-900 font-mono">{financials.costPerKgLiveWeight}$/كجم</strong>
            </span>
          </h4>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-600">
              <span>الأعلاف المركزة:</span>
              <span className="font-mono font-bold text-slate-800">{financials.concentrateFeedCost.toLocaleString()}$</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>الدريس والأعلاف المالئة:</span>
              <span className="font-mono font-bold text-slate-800">{financials.forageHayCost.toLocaleString()}$</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>الرعاية البيطرية والتحصينات:</span>
              <span className="font-mono font-bold text-slate-800">{financials.veterinaryHealthCost.toLocaleString()}$</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>العمالة المباشرة والإشراف:</span>
              <span className="font-mono font-bold text-slate-800">{financials.laborCost.toLocaleString()}$</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>المحروقات، المرافق، والصيانة:</span>
              <span className="font-mono font-bold text-slate-800">{financials.utilitiesMaintenanceCost.toLocaleString()}$</span>
            </div>
            {financials.customExpenseTotal > 0 && (
              <div className="flex justify-between items-center text-rose-800 font-semibold bg-rose-50 p-1.5 rounded">
                <span>مصروفات مخصصة مضافة:</span>
                <span className="font-mono font-bold">{financials.customExpenseTotal.toLocaleString()}$</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-200 flex justify-between items-center font-bold text-slate-900">
              <span>إجمالي المصروفات (OPEX):</span>
              <span className="font-mono text-rose-700">{financials.totalOpex.toLocaleString()}$</span>
            </div>
          </div>
        </div>

        {/* كفاءة موديول الفصة المعمرة */}
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
          <h4 className="text-xs font-bold text-slate-800 mb-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Wheat className="w-4 h-4 text-emerald-600" />
              ميزان الاكتفاء الذاتي لدريس الفصة
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              alfalfaBalance.selfSufficiencyPercent >= 100 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'bg-amber-100 text-amber-800'
            }`}>
              اكتفاء ذاتي: {alfalfaBalance.selfSufficiencyPercent}%
            </span>
          </h4>

          {alfalfaConfig.enabled ? (
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-600">
                <span>إنتاج الأرض من الدريس:</span>
                <span className="font-mono font-bold text-emerald-700">{alfalfaBalance.totalHayProducedTons} طن</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>احتياج واستهلاك القطيع:</span>
                <span className="font-mono font-bold text-slate-800">{alfalfaBalance.totalHayConsumedTons} طن</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>فائض الدريس المتاح للبيع:</span>
                <span className="font-mono font-bold text-emerald-700">+{alfalfaBalance.haySurplusTons} طن</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>إيرادات بيع بالات الفصة الفائضة:</span>
                <span className="font-mono font-bold text-emerald-800">+{financials.surplusHayRevenue.toLocaleString()}$</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center font-bold text-slate-900">
                <span>عجز الدريس (المشترى من السوق):</span>
                <span className="font-mono text-rose-700">{alfalfaBalance.hayDeficitTons} طن</span>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-xs text-slate-500">
              موديول زراعة الفصة غير مفعل. يتم شراء {alfalfaBalance.totalHayConsumedTons} طن دريس بالكامل من السوق بتكلفة {financials.forageHayCost.toLocaleString()}$.
            </div>
          )}
        </div>
      </div>

      {/* جدول البنود المالية المخصصة المضافة مع إمكانية التعديل والحذف */}
      {customItems.length > 0 && (
        <div className="border border-indigo-200 bg-indigo-50/30 rounded-xl p-4">
          <h4 className="text-xs font-bold text-indigo-950 mb-3 flex items-center justify-between">
            <span>البنود المالية المخصصة المضافة ({customItems.length} بنود)</span>
            <span className="text-[11px] text-slate-500 font-normal">يمكنك تعديل القيم مباشرة بنقرة واحدة</span>
          </h4>

          <div className="divide-y divide-indigo-100 text-xs">
            {customItems.map((item) => (
              <div key={item.id} className="py-2 flex items-center justify-between gap-3">
                {editingId === item.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="p-1 rounded border border-indigo-300 text-xs w-48 bg-white"
                    />
                    <input
                      type="number"
                      value={editAmount}
                      onChange={(e) => setEditAmount(Number(e.target.value))}
                      className="p-1 rounded border border-indigo-300 text-xs w-28 bg-white"
                    />
                    <button
                      onClick={() => saveEdit(item.id)}
                      className="p-1 text-emerald-700 hover:bg-emerald-100 rounded"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1 text-slate-500 hover:bg-slate-200 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${item.type === 'revenue' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      <span className="font-semibold text-slate-800">{item.title}</span>
                      <span className="text-[10px] text-slate-500">({item.type === 'revenue' ? 'إيراد' : 'مصروف'})</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`font-mono font-bold ${item.type === 'revenue' ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {item.type === 'revenue' ? '+' : '-'}{item.amount.toLocaleString()}$
                      </span>
                      <button
                        onClick={() => startEdit(item)}
                        className="text-slate-400 hover:text-indigo-600 no-print p-1"
                        title="تعديل"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onRemoveCustomItem(item.id)}
                        className="text-slate-400 hover:text-rose-600 no-print p-1"
                        title="حذف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
