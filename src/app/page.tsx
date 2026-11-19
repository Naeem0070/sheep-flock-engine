'use client';

import React, { useState, useMemo } from 'react';
import { SheepSimulationEngine } from '../engine/simulationEngine';
import { DEFAULT_FLOCK_CONFIG, DEFAULT_ALFALFA_CONFIG } from '../engine/defaultParameters';
import { CustomFinancialItem } from '../types/sheep';
import { Header } from '../components/Header';
import { SimulationControls } from '../components/SimulationControls';
import { InventoryAuditCard } from '../components/InventoryAuditCard';
import { FinancialMetricsCard } from '../components/FinancialMetricsCard';
import { PrintableDossier } from '../components/PrintableDossier';
import { exportFeasibilityToExcel } from '../engine/export/excelExporter';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area 
} from 'recharts';
import { BarChart3, TrendingUp, Layers } from 'lucide-react';

export default function Home() {
  const [flockConfig, setFlockConfig] = useState(DEFAULT_FLOCK_CONFIG);
  const [alfalfaConfig, setAlfalfaConfig] = useState(DEFAULT_ALFALFA_CONFIG);
  const [currentDay, setCurrentDay] = useState(360);

  // إدارة البنود المالية المخصصة المضافة من المستخدم
  const [customItems, setCustomItems] = useState<CustomFinancialItem[]>([
    {
      id: 'cust-1',
      title: 'مبيعات منتجات ألبان وأجبان ريفية',
      amount: 1800,
      type: 'revenue',
    },
    {
      id: 'cust-2',
      title: 'إيجار أرض المراعي والحظائر',
      amount: 1200,
      type: 'expense',
    }
  ]);

  const handleAddCustomItem = (newItem: Omit<CustomFinancialItem, 'id'>) => {
    const item: CustomFinancialItem = {
      ...newItem,
      id: `cust-${Date.now()}`,
    };
    setCustomItems(prev => [...prev, item]);
  };

  const handleRemoveCustomItem = (id: string) => {
    setCustomItems(prev => prev.filter(i => i.id !== id));
  };

  const handleUpdateCustomItem = (id: string, newTitle: string, newAmount: number) => {
    setCustomItems(prev => prev.map(i => i.id === id ? { ...i, title: newTitle, amount: newAmount } : i));
  };

  // تشغيل المحرك الحسابي التفاعلي اللحظي
  const engine = useMemo(() => {
    return new SheepSimulationEngine(flockConfig, alfalfaConfig);
  }, [flockConfig, alfalfaConfig]);

  const report = useMemo(() => {
    return engine.simulateUntil(currentDay, customItems);
  }, [engine, currentDay, customItems]);

  // تجهيز بيانات الرسوم البيانية لتغطي كامل مدة المشروع الديناميكية
  const trajectoryData = useMemo(() => {
    const maxDays = Math.max(1080, flockConfig.totalProjectDurationDays);
    const step = maxDays <= 1440 ? 180 : 360;
    const daysArray: number[] = [];
    for (let d = step; d <= maxDays; d += step) {
      daysArray.push(d);
    }
    if (!daysArray.includes(maxDays)) {
      daysArray.push(maxDays);
    }

    return daysArray.map((d) => {
      const rep = engine.simulateUntil(d, customItems);
      return {
        day: `اليوم ${d} (${(d / 360).toFixed(1)} س)`,
        'نعاج بالغة ولودة': rep.inventory.parousMatureEwes,
        'فطائم نامية': rep.inventory.growingFemaleWeaners,
        'إجمالي القطيع الحي': rep.inventory.totalLiveFlock,
        'الإيرادات ($)': rep.financials.totalRevenue,
        'المصروفات ($)': rep.financials.totalOpex,
        'الأرباح EBITDA ($)': rep.financials.ebitda,
      };
    });
  }, [engine, flockConfig.totalProjectDurationDays, customItems]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    exportFeasibilityToExcel(report);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-arabic">
      {/* الشريط العلوي */}
      <Header
        currentDay={currentDay}
        isReconciled={report.inventory.isReconciled}
        onPrint={handlePrint}
        onExportExcel={handleExportExcel}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* عناصر التحكم في المعلمات ومدة المشروع */}
        <SimulationControls
          config={flockConfig}
          alfalfaConfig={alfalfaConfig}
          currentDay={currentDay}
          onConfigChange={setFlockConfig}
          onAlfalfaConfigChange={setAlfalfaConfig}
          onDayChange={setCurrentDay}
        />

        {/* بطاقة الجرد والمطابقة الصفرية مع تقسيم الإناث الثلاثي ونسبة الإجهاض */}
        <InventoryAuditCard inventory={report.inventory} />

        {/* بطاقة المؤشرات المالية واقتصاديات الوحدة مع إضافة وتعديل البنود */}
        <FinancialMetricsCard
          financials={report.financials}
          alfalfaBalance={report.alfalfaBalance}
          alfalfaConfig={alfalfaConfig}
          customItems={customItems}
          onAddCustomItem={handleAddCustomItem}
          onRemoveCustomItem={handleRemoveCustomItem}
          onUpdateCustomItem={handleUpdateCustomItem}
        />

        {/* التحليل البياني البصري لمسار سنوات المشروع كاملة (no-print) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 no-print">
          {/* رسم تطور تعداد القطيع عبر الزمن */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-forest-700" />
              منحنى نمو وتطور الرؤوس الحية وفئات الإناث (حتى اليوم {flockConfig.totalProjectDurationDays})
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trajectoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="نعاج بالغة ولودة" fill="#15803d" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="فطائم نامية" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="إجمالي القطيع الحي" fill="#0f172a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* رسم التدفقات المالية والأرباح عبر الزمن */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
              منحنى الإيرادات والمصروفات والأرباح التشغيلية ($)
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trajectoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Area type="monotone" dataKey="الإيرادات ($)" stroke="#16a34a" fill="#dcfce7" />
                  <Area type="monotone" dataKey="المصروفات ($)" stroke="#e11d48" fill="#ffe4e6" />
                  <Area type="monotone" dataKey="الأرباح EBITDA ($)" stroke="#4338ca" fill="#e0e7ff" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* التقرير والدراسة الفنية والمالية المطبوعة */}
        <div className="mt-8">
          <PrintableDossier report={report} />
        </div>
      </main>

      {/* الفوتر */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 no-print mt-auto">
        نظام دراسة وتدقيق قطعان الأغنام الفني والمالي &copy; {new Date().getFullYear()} - تم التطوير باستخدام Next.js 14 و Node.js وقاعدة بيانات Supabase.
      </footer>
    </div>
  );
}
