'use client';

import React, { useState } from 'react';
import { 
  BaselineFlockConfig, 
  AlfalfaFieldConfig, 
  ReproductionSystem, 
  FemaleRetentionStrategy,
  BreedType,
  MatingProtocol
} from '../types/sheep';
import { 
  Sliders, 
  HeartHandshake, 
  Calendar, 
  TrendingUp, 
  Wheat, 
  AlertTriangle,
  Clock,
  Sparkles
} from 'lucide-react';

interface SimulationControlsProps {
  config: BaselineFlockConfig;
  alfalfaConfig: AlfalfaFieldConfig;
  currentDay: number;
  onConfigChange: (newConfig: BaselineFlockConfig) => void;
  onAlfalfaConfigChange: (newAlfalfaConfig: AlfalfaFieldConfig) => void;
  onDayChange: (newDay: number) => void;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  config,
  alfalfaConfig,
  currentDay,
  onConfigChange,
  onAlfalfaConfigChange,
  onDayChange,
}) => {
  const [activeTab, setActiveTab] = useState<'flock' | 'reproduction' | 'mortality' | 'alfalfa' | 'duration'>('duration');

  const updateConfig = (key: keyof BaselineFlockConfig, value: any) => {
    onConfigChange({ ...config, [key]: value });
  };

  const updateAlfalfa = (key: keyof AlfalfaFieldConfig, value: any) => {
    onAlfalfaConfigChange({ ...alfalfaConfig, [key]: value });
  };

  // محطات سريعة تتكيف مع مدة المشروع الإجمالية
  const quickMilestones = [
    { day: 360, label: 'سنة 1' },
    { day: 720, label: 'سنة 2 (تبديل الفحول)' },
    { day: 1080, label: 'سنة 3' },
    { day: 1440, label: 'سنة 4 (تبديل الفحول)' },
    { day: 1800, label: 'سنة 5' },
    { day: 2520, label: 'سنة 7' },
    { day: 3600, label: 'سنة 10' },
  ].filter(m => m.day <= Math.max(1080, config.totalProjectDurationDays));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden no-print">
      {/* شريط اختيار المحطات السريعة وتحريك الأيام الديناميكي */}
      <div className="bg-slate-900 text-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-forest-400" />
            <span className="font-bold text-sm">محطات الجرد والتقييم الدوري:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {quickMilestones.map((m) => (
              <button
                key={m.day}
                onClick={() => onDayChange(m.day)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  currentDay === m.day
                    ? 'bg-forest-600 text-white shadow-md shadow-forest-600/30 ring-2 ring-forest-400'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span>اليوم {m.day}</span>
                <span className="text-[10px] opacity-75 font-normal">({m.label})</span>
              </button>
            ))}
          </div>

          {/* محرك تحريك الأيام المخصص غير المحدود */}
          <div className="flex items-center gap-3 w-full lg:w-auto mt-2 lg:mt-0">
            <span className="text-xs text-slate-400">يوم التقييم:</span>
            <input
              type="range"
              min="30"
              max={Math.max(1080, config.totalProjectDurationDays)}
              step="30"
              value={currentDay}
              onChange={(e) => onDayChange(Number(e.target.value))}
              className="w-40 accent-forest-500 cursor-pointer"
            />
            <span className="text-xs font-mono font-bold bg-slate-800 px-2.5 py-1 rounded text-forest-400 min-w-16 text-center">
              {currentDay} يوم
            </span>
          </div>
        </div>
      </div>

      {/* تبويبات الإعدادات مع تبويب مدة المشروع الديناميكية */}
      <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600 overflow-x-auto">
        <button
          onClick={() => setActiveTab('duration')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 transition whitespace-nowrap ${
            activeTab === 'duration'
              ? 'border-forest-600 text-forest-800 bg-white font-bold'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4 text-forest-600" />
          <span>مدة المشروع (ديناميكية)</span>
        </button>

        <button
          onClick={() => setActiveTab('flock')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 transition whitespace-nowrap ${
            activeTab === 'flock'
              ? 'border-forest-600 text-forest-800 bg-white font-bold'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Sliders className="w-4 h-4 text-forest-600" />
          <span>1. القطيع التأسيسي</span>
        </button>

        <button
          onClick={() => setActiveTab('reproduction')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 transition whitespace-nowrap ${
            activeTab === 'reproduction'
              ? 'border-forest-600 text-forest-800 bg-white font-bold'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <HeartHandshake className="w-4 h-4 text-rose-600" />
          <span>2. التناسل ومواعيد الولادات</span>
        </button>

        <button
          onClick={() => setActiveTab('mortality')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 transition whitespace-nowrap ${
            activeTab === 'mortality'
              ? 'border-forest-600 text-forest-800 bg-white font-bold'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-amber-600" />
          <span>3. الاحتفاظ بالإناث والنفوق</span>
        </button>

        <button
          onClick={() => setActiveTab('alfalfa')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 transition whitespace-nowrap ${
            activeTab === 'alfalfa'
              ? 'border-forest-600 text-forest-800 bg-white font-bold'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Wheat className="w-4 h-4 text-emerald-600" />
          <span>4. أرض الفصة المعمرة والدريس</span>
        </button>
      </div>

      {/* محتويات التبويبات */}
      <div className="p-5">
        {/* التبويب 0: مدة المشروع الديناميكية */}
        {activeTab === 'duration' && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-forest-700" />
                  تحديد أفق ومدة المحاكاة الزمنية للمشروع (غير مقيدة بـ 3 سنوات)
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  يمكنك تمديد عمر المشروع إلى 5 أو 7 أو 10 سنوات لملاحظة نمو القطيع وتجديد الفحول كل سنتين
                </p>
              </div>

              <div className="flex items-center gap-2">
                {[
                  { years: 3, days: 1080 },
                  { years: 5, days: 1800 },
                  { years: 7, days: 2520 },
                  { years: 10, days: 3600 },
                ].map((opt) => (
                  <button
                    key={opt.years}
                    onClick={() => {
                      updateConfig('totalProjectDurationDays', opt.days);
                      if (currentDay > opt.days) onDayChange(opt.days);
                    }}
                    className={`px-3 py-1 rounded text-xs font-bold transition border ${
                      config.totalProjectDurationDays === opt.days
                        ? 'bg-forest-700 text-white border-forest-800'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {opt.years} سنوات ({opt.days} يوم)
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  المدة الإجمالية للمشروع بالأيام
                </label>
                <input
                  type="number"
                  min="360"
                  max="7200"
                  step="180"
                  value={config.totalProjectDurationDays}
                  onChange={(e) => updateConfig('totalProjectDurationDays', Math.max(360, Number(e.target.value)))}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  المدة المحسوبة بالسنوات
                </label>
                <div className="p-2.5 bg-white border border-slate-300 rounded-lg font-mono font-bold text-slate-800">
                  {(config.totalProjectDurationDays / 360).toFixed(1)} سنة تشغيلية
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  دورات استبدال الفحول المجدولة
                </label>
                <div className="p-2.5 bg-white border border-slate-300 rounded-lg text-emerald-800 font-semibold flex items-center gap-1.5">
                  <span>كل سنتين إلزامي (إجمالي {Math.floor(config.totalProjectDurationDays / 720)} مرات تبديل)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* التبويب 1: القطيع التأسيسي */}
        {activeTab === 'flock' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                سلالة الأغنام (Breed)
              </label>
              <select
                value={config.breed}
                onChange={(e) => updateConfig('breed', e.target.value as BreedType)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-forest-500 focus:outline-none"
              >
                <option value="awassi">عواسي أصيل (Awassi)</option>
                <option value="naimi">نعيمي بلدي (Naimi)</option>
                <option value="najdi">نجدي (Najdi)</option>
                <option value="barbari">بربري (Barbari)</option>
                <option value="romanov">رومانوف عالي التوائم (Romanov)</option>
                <option value="crossbred">سلالة مهجنة محسنة (Crossbred)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                عدد النعاج البالغة التأسيسية (Ewes)
              </label>
              <input
                type="number"
                min="10"
                max="5000"
                value={config.adultEwesCount}
                onChange={(e) => updateConfig('adultEwesCount', Math.max(1, Number(e.target.value)))}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-forest-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                عدد الفحول الكباش (Rams)
              </label>
              <input
                type="number"
                min="1"
                max="200"
                value={config.breedingRamsCount}
                onChange={(e) => updateConfig('breedingRamsCount', Math.max(1, Number(e.target.value)))}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-forest-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                سعر شراء النعجة التأسيسية ($)
              </label>
              <input
                type="number"
                value={config.ewePurchasePrice}
                onChange={(e) => updateConfig('ewePurchasePrice', Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-forest-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                سعر شراء فحل الكبش ($)
              </label>
              <input
                type="number"
                value={config.ramPurchasePrice}
                onChange={(e) => updateConfig('ramPurchasePrice', Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-forest-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                الطاقة الاستيعابية القصوى للحظائر (رأس)
              </label>
              <input
                type="number"
                value={config.maxHousingCapacity}
                onChange={(e) => updateConfig('maxHousingCapacity', Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-forest-500"
              />
            </div>
          </div>
        )}

        {/* التبويب 2: التناسل والولادات والإجهاض */}
        {activeTab === 'reproduction' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                نظام دورة التناسل (Reproduction System)
              </label>
              <select
                value={config.reproductionSystem}
                onChange={(e) => updateConfig('reproductionSystem', e.target.value as ReproductionSystem)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-forest-500 focus:outline-none"
              >
                <option value="annual">نظام سنوي تقليدي (ولادة كل 12 شهراً)</option>
                <option value="accelerated_8month">نظام مكثف مسرّع (3 ولادات كل سنتين / كل 8 أشهر)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                بروتوكول التلقيح (Mating Protocol)
              </label>
              <select
                value={config.matingProtocol}
                onChange={(e) => updateConfig('matingProtocol', e.target.value as MatingProtocol)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-forest-500 focus:outline-none"
              >
                <option value="natural_controlled">تلقيح طبيعي مقيد (كبش لكل 25 نعجة)</option>
                <option value="natural_open">تلقيح طبيعي حر في المرعى</option>
                <option value="hormonal_synchronized">تلقيح هرموني متزامن CIDR (كبش لكل 10 نعاج)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                نسبة الخصوبة وعقد الحمل (% Fertility)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.01"
                  min="0.60"
                  max="0.99"
                  value={config.fertilityRate}
                  onChange={(e) => updateConfig('fertilityRate', Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-forest-500"
                />
                <span className="text-xs text-slate-500 font-bold">%</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                معدل التوائم (Prolificacy: حمل/ولادة)
              </label>
              <input
                type="number"
                step="0.05"
                min="1.0"
                max="2.5"
                value={config.prolificacyFactor}
                onChange={(e) => updateConfig('prolificacyFactor', Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-forest-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                نسبة الإجهاض الطبيعية (% Abortion)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.01"
                  min="0.00"
                  max="0.15"
                  value={config.abortionRate}
                  onChange={(e) => updateConfig('abortionRate', Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-forest-500"
                />
                <span className="text-xs text-slate-500 font-bold">%</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                استبدال الفحول (Rams Replacement)
              </label>
              <div className="p-2.5 bg-slate-100 rounded-lg text-xs font-bold text-slate-800 border border-slate-200">
                كل سنتين إلزامي (لمنع زواج الأقارب)
              </div>
            </div>
          </div>
        )}

        {/* التبويب 3: الاحتفاظ بالإناث والنفوق */}
        {activeTab === 'mortality' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                سياسة الاحتفاظ بالإناث (Retention Policy)
              </label>
              <select
                value={config.femaleRetentionStrategy}
                onChange={(e) => updateConfig('femaleRetentionStrategy', e.target.value as FemaleRetentionStrategy)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-forest-500 focus:outline-none"
              >
                <option value="retain_half">الاحتفاظ بنصف الإناث (50%) وتسمين الباقي للبيع</option>
                <option value="growth_max">نمط التوسع الأقصى (احتفاظ بكل الإناث الصالحة)</option>
                <option value="steady_state">نمط التثبيت المستقر (تعويض المستبعد والنافق فقط)</option>
                <option value="commercial_selling">نمط تجاري سريع (بيع معظم الإناث للحم)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                نفوق مرحلة الرضاعة 0-60 يوم (% Pre-Weaning)
              </label>
              <input
                type="number"
                step="0.01"
                value={config.preWeaningMortalityRate}
                onChange={(e) => updateConfig('preWeaningMortalityRate', Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-forest-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                نفوق مرحلة التسمين 60-180 يوم (% Post-Weaning)
              </label>
              <input
                type="number"
                step="0.005"
                value={config.postWeaningMortalityRate}
                onChange={(e) => updateConfig('postWeaningMortalityRate', Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-forest-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                نفوق النعاج البالغة السنوي (% Adult Mortality)
              </label>
              <input
                type="number"
                step="0.01"
                value={config.adultAnnualMortalityRate}
                onChange={(e) => updateConfig('adultAnnualMortalityRate', Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-forest-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                نسبة استبعاد النعاج السنوية (% Adult Cull)
              </label>
              <input
                type="number"
                step="0.01"
                value={config.adultAnnualCullRate}
                onChange={(e) => updateConfig('adultAnnualCullRate', Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-forest-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                سعر بيع خروف التسمين ($)
              </label>
              <input
                type="number"
                value={config.fattenedMaleSellingPrice}
                onChange={(e) => updateConfig('fattenedMaleSellingPrice', Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-forest-500"
              />
            </div>
          </div>
        )}

        {/* التبويب 4: أرض الفصة المعمرة والدريس */}
        {activeTab === 'alfalfa' && (
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Wheat className="w-5 h-5 text-emerald-600" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    تفعيل وحدة زراعة الفصة المعمرة وإنتاج الدريس
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    التحول لنظام المزرعة المتكاملة لتخفيض تكلفة العلف وتحقيق الاكتفاء الذاتي
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={alfalfaConfig.enabled}
                  onChange={(e) => updateAlfalfa('enabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {alfalfaConfig.enabled ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    المساحة المزروعة (هكتار)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={alfalfaConfig.areaHectares}
                    onChange={(e) => updateAlfalfa('areaHectares', Number(e.target.value))}
                    className="w-full text-xs p-2 rounded border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    عدد الحشات سنوياً
                  </label>
                  <input
                    type="number"
                    value={alfalfaConfig.cutsPerYear}
                    onChange={(e) => updateAlfalfa('cutsPerYear', Number(e.target.value))}
                    className="w-full text-xs p-2 rounded border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    إنتاج الحشة (طن دريس/هكتار)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={alfalfaConfig.hayYieldPerCutTonsPerHa}
                    onChange={(e) => updateAlfalfa('hayYieldPerCutTonsPerHa', Number(e.target.value))}
                    className="w-full text-xs p-2 rounded border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    تكلفة التشغيل السنوية ($/هكتار)
                  </label>
                  <input
                    type="number"
                    value={alfalfaConfig.annualOpexPerHa}
                    onChange={(e) => updateAlfalfa('annualOpexPerHa', Number(e.target.value))}
                    className="w-full text-xs p-2 rounded border border-slate-300"
                  />
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  موديول زراعة الفصة معطل حالياً. يعتمد النظام على شراء الدريس بالكامل من السوق.
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
