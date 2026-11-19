'use client';

import React from 'react';
import { Layers, Printer, FileSpreadsheet, ShieldCheck, Database, Calendar } from 'lucide-react';

interface HeaderProps {
  currentDay: number;
  isReconciled: boolean;
  onPrint: () => void;
  onExportExcel: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDay,
  isReconciled,
  onPrint,
  onExportExcel,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* اللوجو والعنوان */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-forest-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-forest-500/20">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">
              نظام المحاكاة والتدقيق الفني والمالي لمشاريع الأغنام
            </h1>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
              <span>محرك تتبع الأفواج ومطابقة الجرد (Next.js + Supabase)</span>
              <span className="inline-block w-1 h-1 bg-slate-300 rounded-full"></span>
              <span className="text-forest-700 font-semibold flex items-center gap-1">
                <Database className="w-3 h-3 inline" /> قاعدة بيانات Supabase
              </span>
            </p>
          </div>
        </div>

        {/* مؤشر المرحلة الحالية وأزرار الإجراءات */}
        <div className="flex items-center gap-3">
          {/* شارة التدقيق الصفرية */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${
            isReconciled 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}>
            <ShieldCheck className="w-4 h-4" />
            <span>{isReconciled ? 'المطابقة الصفرية: ناجحة (0 عجز)' : 'تنبيه: يوجد خلل في التوازن!'}</span>
          </div>

          {/* شارة اليوم التشغيلي */}
          <div className="flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>اليوم الحالي: <strong className="text-forest-700">{currentDay}</strong> ({Math.round(currentDay / 30)} شهر)</span>
          </div>

          {/* زر تصدير إكسل */}
          <button
            onClick={onExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition border border-slate-300 shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>تصدير Excel</span>
          </button>

          {/* زر طباعة التقرير الفني والمالي */}
          <button
            onClick={onPrint}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-forest-700 hover:bg-forest-800 text-white text-xs font-semibold rounded-lg transition shadow-md shadow-forest-700/20"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة التقرير والدراسة الرسمية</span>
          </button>
        </div>
      </div>
    </header>
  );
};
