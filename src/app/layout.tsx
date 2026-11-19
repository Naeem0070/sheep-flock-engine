import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'نظام دراسة وتدقيق قطعان الأغنام الفني والمالي',
  description: 'محرك محاكاة فني ومالي لقطعان الأغنام وجرد ومطابقة الأعداد (الأيام 360، 720، 1080) مع موديول دريس الفصة المعمرة',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased font-arabic min-h-screen flex flex-col bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
