import { useUserData } from '../lib/useData';
import { Card, SectionHeader, Button, Badge, ProgressBar } from '../components/ui';
import { formatCurrency } from '../lib/format';
import { Zap, PiggyBank, UtensilsCrossed, ShoppingBag, Target, Shield, TrendingUp, Lightbulb, Sparkles } from 'lucide-react';
import type { Page } from '../components/AppShell';

const iconMap: Record<string, typeof PiggyBank> = { PiggyBank, UtensilsCrossed, ShoppingBag, Target, Shield };

export function RecommendationsPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { analysis, loading } = useUserData();
  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-3 border-saudi-200 border-t-saudi-500 rounded-full animate-spin" /></div>;
  if (!analysis) return null;
  const totalImpact = analysis.recommendations.reduce((s, r) => s + r.impact, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-bold text-ink-900">التوصيات الذكية</h1><p className="text-gray-500 mt-1">توصيات مخصصة من الذكاء الاصطناعي لتحسين وضعك المالي</p></div>
      <Card className="overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-3xl gradient-saudi flex items-center justify-center flex-shrink-0"><Sparkles className="w-10 h-10 text-white" /></div>
          <div className="flex-1 text-center sm:text-right"><h2 className="text-xl font-bold text-ink-900 mb-1">توصيات مخصصة لك</h2><p className="text-gray-500 text-sm">بناءً على تحليل {analysis.recommendations.length} جوانب من وضعك المالي</p></div>
          {totalImpact > 0 && <div className="text-center"><p className="text-3xl font-bold text-saudi-600">{formatCurrency(totalImpact)}</p><p className="text-xs text-gray-400">إجمالي التوفير المتوقع سنوياً</p></div>}
        </div>
      </Card>
      <div className="space-y-4">
        {analysis.recommendations.map((rec, i) => {
          const Icon = iconMap[rec.icon] || Lightbulb;
          return (
            <Card key={i} className="animate-slide-up">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-14 h-14 rounded-2xl bg-saudi-50 flex items-center justify-center flex-shrink-0"><Icon className="w-7 h-7 text-saudi-500" /></div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2"><h3 className="font-bold text-ink-900 text-lg">{rec.title}</h3>{rec.impact > 0 && <Badge variant="success">+{formatCurrency(rec.impact)} / سنة</Badge>}</div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{rec.description}</p>
                  <div className="flex items-center gap-3"><Button variant="secondary" size="sm" onClick={() => onNavigate('budget')}>تطبيق التوصية</Button><Button variant="ghost" size="sm" onClick={() => onNavigate('assistant')}>اسأل المساعد</Button></div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      <Card>
        <SectionHeader title="فرص الادخار" subtitle="مجالات يمكنك توفير المال فيها" icon={PiggyBank} />
        <div className="space-y-4">
          {analysis.expenseCategories.filter(c => c.percentage > 15).map((c, i) => (
            <div key={i} className="p-4 rounded-2xl bg-beige-50">
              <div className="flex items-center justify-between mb-2"><span className="font-semibold text-ink-900">{c.name}</span><Badge variant="warning">{c.percentage.toFixed(0)}% من المصاريف</Badge></div>
              <p className="text-sm text-gray-600 mb-3">يمكنك توفير ما يصل إلى {formatCurrency(Math.round(c.amount * 0.2))} شهرياً بتقليل الإنفاق في هذه الفئة بنسبة 20%</p>
              <ProgressBar value={c.amount * 0.8} max={c.amount} color="bg-saudi-400" height="h-1.5" />
            </div>
          ))}
        </div>
      </Card>
      {analysis.unusualSpending.length > 0 && (
        <Card>
          <SectionHeader title="إنفاق غير معتاد" subtitle="مجالات تحتاج مراجعة" icon={Zap} />
          <div className="space-y-3">
            {analysis.unusualSpending.map((u, i) => (
              <div key={i} className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0"><TrendingUp className="w-4 h-4" /></div>
                  <div className="flex-1"><p className="font-semibold text-ink-900">{u.category}</p><p className="text-sm text-gray-600 mt-1">{u.message}</p><div className="flex items-center gap-4 mt-2 text-xs"><span className="text-amber-600">هذا الشهر: {formatCurrency(u.amount)}</span><span className="text-gray-400">المتوقع: {formatCurrency(u.expected)}</span></div></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
      <Card>
        <SectionHeader title="مقارنة الإنفاق الأسبوعي" icon={TrendingUp} />
        <div className="space-y-3">
          {analysis.weeklyComparison.map((w, i) => {
            const diff = w.thisWeek - w.lastWeek;
            const pctChange = w.lastWeek > 0 ? (diff / w.lastWeek) * 100 : 0;
            return (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-beige-50">
                <span className="text-sm font-semibold text-ink-900">{w.week}</span>
                <div className="flex items-center gap-4"><span className="text-sm text-gray-500">{formatCurrency(w.thisWeek)}</span><Badge variant={diff <= 0 ? 'success' : 'danger'}>{diff <= 0 ? '↓' : '↑'} {Math.abs(pctChange).toFixed(0)}%</Badge></div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
