import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../lib/auth';
import { supabase, type Transaction, type Goal, type Budget, type Bill } from '../lib/supabase';
import { analyzeFinances, type FinancialAnalysis } from '../lib/ai';
import { seedUserData } from '../lib/seed';
import { Card, CircularProgress, DonutChart, BarChart, LineChart, Button, Badge } from '../components/ui';
import { formatCurrency } from '../lib/format';
import { Wallet, Sparkles, Brain, TrendingUp, TrendingDown, AlertTriangle, Shield, Target, PiggyBank, UtensilsCrossed, ShoppingBag, ArrowLeft, CheckCircle2, Info, Zap } from 'lucide-react';

const loadingSteps = [
  'جمع البيانات المالية...',
  'تحليل مصادر الدخل والمصاريف...',
  'حساب نسبة الادخار...',
  'كشف أنماط الإنفاق غير المعتادة...',
  'تقييم الصحة المالية...',
  'إنشاء توصيات مخصصة...',
  'تحديد المخاطر المالية...',
  'إعداد التقرير النهائي...',
];

export function AIAnalysisPage({ onComplete }: { onComplete: () => void }) {
  const { user, profile, updateProfile } = useAuth();
  const [phase, setPhase] = useState<'loading' | 'results'>('loading');
  const [stepIndex, setStepIndex] = useState(0);
  const [analysis, setAnalysis] = useState<FinancialAnalysis | null>(null);
  const [seeding, setSeeding] = useState(false);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    const runAnalysis = async () => {
      if (user) {
        setSeeding(true);
        await seedUserData(user.id, profile?.monthly_income || 8000);
        setSeeding(false);
      }
      for (let i = 0; i < loadingSteps.length; i++) {
        setStepIndex(i);
        await new Promise(r => setTimeout(r, 500 + Math.random() * 400));
      }
      if (!user) return;
      const [txRes, goalRes, budgetRes, billRes] = await Promise.all([
        supabase.from('transactions').select('*').eq('user_id', user.id),
        supabase.from('goals').select('*').eq('user_id', user.id),
        supabase.from('budgets').select('*').eq('user_id', user.id),
        supabase.from('bills').select('*').eq('user_id', user.id),
      ]);
      const result = analyzeFinances(profile?.monthly_income || 8000, (txRes.data || []) as Transaction[], (goalRes.data || []) as Goal[], (budgetRes.data || []) as Budget[], (billRes.data || []) as Bill[]);
      setAnalysis(result);
      await updateProfile({ analysis_completed: true, health_score: result.healthScore });
      await new Promise(r => setTimeout(r, 300));
      setPhase('results');
    };
    runAnalysis();
  }, [user, profile, updateProfile]);

  if (phase === 'loading') return <LoadingView stepIndex={stepIndex} seeding={seeding} />;
  if (!analysis) return null;
  return <ResultsView analysis={analysis} onComplete={onComplete} />;
}

function LoadingView({ stepIndex, seeding }: { stepIndex: number; seeding: boolean }) {
  return (
    <div className="min-h-screen bg-beige-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg text-center">
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full gradient-saudi animate-pulse-soft" />
          <div className="absolute inset-2 rounded-full bg-beige-100 flex items-center justify-center">
            <div className="relative">
              <Brain className="w-16 h-16 text-saudi-500 animate-pulse-soft" />
              <div className="absolute -top-1 -right-1">
                <Sparkles className="w-6 h-6 text-saudi-400 animate-float" />
              </div>
            </div>
          </div>
          <div className="absolute inset-0 animate-spin-slow">
            <div className="absolute top-0 left-1/2 w-3 h-3 rounded-full bg-saudi-400 -translate-x-1/2" />
            <div className="absolute bottom-0 left-1/2 w-2 h-2 rounded-full bg-saudi-300 -translate-x-1/2" />
            <div className="absolute top-1/2 right-0 w-2.5 h-2.5 rounded-full bg-saudi-500 -translate-y-1/2" />
            <div className="absolute top-1/2 left-0 w-2 h-2 rounded-full bg-saudi-400 -translate-y-1/2" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-ink-900 mb-2">جاري التحليل المالي الذكي</h2>
        <p className="text-gray-500 mb-8">ذكاءنا الاصطناعي يحلل بياناتك المالية ويستعد لتقديم توصيات مخصصة</p>
        <div className="premium-card p-6 text-right">
          <div className="space-y-3">
            {loadingSteps.map((step, i) => (
              <div key={i} className={`flex items-center gap-3 transition-all duration-300 ${i < stepIndex ? 'opacity-50' : i === stepIndex ? 'opacity-100' : 'opacity-30'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${i < stepIndex ? 'bg-saudi-500' : i === stepIndex ? 'bg-saudi-100' : 'bg-gray-100'}`}>
                  {i < stepIndex ? <CheckCircle2 className="w-4 h-4 text-white" /> : i === stepIndex ? <span className="w-3 h-3 border-2 border-saudi-500 border-t-transparent rounded-full animate-spin" /> : <span className="w-2 h-2 rounded-full bg-gray-300" />}
                </div>
                <span className={`text-sm font-medium ${i === stepIndex ? 'text-saudi-600' : 'text-gray-500'}`}>{step}</span>
              </div>
            ))}
          </div>
          {seeding && <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400 text-center">جاري إعداد بياناتك المالية الأولية...</div>}
        </div>
        <div className="mt-6 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full gradient-saudi rounded-full transition-all duration-500 ease-out" style={{ width: `${((stepIndex + 1) / loadingSteps.length) * 100}%` }} />
        </div>
      </div>
    </div>
  );
}

function ResultsView({ analysis, onComplete }: { analysis: FinancialAnalysis; onComplete: () => void }) {
  const scoreColor = analysis.healthScore >= 65 ? '#006C35' : analysis.healthScore >= 50 ? '#3A9E72' : analysis.healthScore >= 35 ? '#D4A543' : '#DC2626';
  return (
    <div className="min-h-screen bg-beige-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl gradient-saudi flex items-center justify-center"><Wallet className="w-6 h-6 text-white" /></div>
          <div><h1 className="text-xl font-bold text-saudi-500">دربك المالي</h1><p className="text-xs text-gray-500">الخطوة 3 من 3 - نتائج التحليل</p></div>
        </div>
        <div className="flex gap-2 mb-8"><div className="flex-1 h-2 rounded-full gradient-saudi" /><div className="flex-1 h-2 rounded-full gradient-saudi" /><div className="flex-1 h-2 rounded-full gradient-saudi" /></div>
        <Card className="mb-6 overflow-hidden animate-slide-up">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-shrink-0"><CircularProgress value={analysis.healthScore} size={160} strokeWidth={14} color={scoreColor} label={analysis.healthScore.toString()} sublabel={analysis.scoreLabel} /></div>
            <div className="flex-1 text-center lg:text-right">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-3"><Sparkles className="w-5 h-5 text-saudi-500" /><h2 className="text-2xl font-bold text-ink-900">نتيجة التحليل المالي</h2></div>
              <p className="text-gray-500 mb-4">بناءً على تحليلنا لبياناتك المالية، إليك تقييمنا لوضعك المالي الحالي مع توصيات مخصصة لتحسينه</p>
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                <Badge variant={analysis.healthScore >= 65 ? 'success' : 'warning'}>معدل الادخار: {analysis.savingsRate.toFixed(1)}%</Badge>
                <Badge variant="info">المتبقي: {formatCurrency(analysis.remaining)}</Badge>
                <Badge variant={analysis.predictedEndOfMonth >= 0 ? 'success' : 'danger'}>توقع نهاية الشهر: {formatCurrency(analysis.predictedEndOfMonth)}</Badge>
              </div>
            </div>
          </div>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="animate-slide-up"><div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-xl bg-saudi-50 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-saudi-500" /></div><span className="text-sm text-gray-500">الدخل الشهري</span></div><p className="text-2xl font-bold text-ink-900">{formatCurrency(analysis.income)}</p></Card>
          <Card className="animate-slide-up"><div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center"><TrendingDown className="w-5 h-5 text-red-500" /></div><span className="text-sm text-gray-500">المصاريف</span></div><p className="text-2xl font-bold text-ink-900">{formatCurrency(analysis.expenses)}</p></Card>
          <Card className="animate-slide-up"><div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center"><Wallet className="w-5 h-5 text-amber-500" /></div><span className="text-sm text-gray-500">المتبقي</span></div><p className={`text-2xl font-bold ${analysis.remaining >= 0 ? 'text-saudi-600' : 'text-red-500'}`}>{formatCurrency(analysis.remaining)}</p></Card>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <Card className="animate-slide-up">
            <h3 className="font-bold text-ink-900 mb-4">تحليل الإنفاق حسب الفئة</h3>
            {analysis.expenseCategories.length > 0 ? (
              <div className="flex items-center gap-6">
                <DonutChart data={analysis.expenseCategories.map(c => ({ name: c.name, value: c.amount, color: c.color }))} size={140} />
                <div className="flex-1 space-y-2">
                  {analysis.expenseCategories.slice(0, 5).map((c, i) => (
                    <div key={i} className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} /><span className="text-sm text-gray-600">{c.name}</span></div><span className="text-sm font-semibold text-ink-900">{c.percentage.toFixed(0)}%</span></div>
                  ))}
                </div>
              </div>
            ) : <p className="text-gray-400 text-sm text-center py-8">لا توجد بيانات إنفاق</p>}
          </Card>
          <Card className="animate-slide-up">
            <h3 className="font-bold text-ink-900 mb-4">توزيع الميزانية الموصى به</h3>
            <div className="space-y-4">
              {analysis.budgetAllocation.map((b, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2"><span className="text-sm font-semibold text-ink-800">{b.category}</span><span className="text-sm text-gray-500">{formatCurrency(b.amount)} ({b.percentage}%)</span></div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${b.percentage}%`, backgroundColor: b.color }} /></div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-4">قاعدة 50/30/20 - الاحتياجات الأساسية / الرغبات / الادخار</p>
          </Card>
        </div>
        <Card className="mb-6 animate-slide-up"><h3 className="font-bold text-ink-900 mb-4">توقع المدخرات للأشهر القادمة</h3><LineChart data={analysis.savingsPrediction.map(s => ({ label: s.month, value: s.amount }))} height={180} /></Card>
        <Card className="mb-6 animate-slide-up">
          <h3 className="font-bold text-ink-900 mb-1">مقارنة الإنفاق الأسبوعي</h3>
          <p className="text-xs text-gray-400 mb-4">مقارنة هذا الأسبوع مع الأسبوع السابق</p>
          <BarChart data={analysis.weeklyComparison.map(w => ({ label: w.week, value: w.thisWeek, secondary: w.lastWeek, color: '#006C35' }))} height={160} />
          <div className="flex items-center justify-center gap-6 mt-4"><div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-saudi-500" /><span className="text-xs text-gray-500">الأسبوع الحالي</span></div><div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-beige-300" /><span className="text-xs text-gray-500">الأسبوع السابق</span></div></div>
        </Card>
        <Card className="mb-6 animate-slide-up">
          <div className="flex items-center gap-2 mb-4"><AlertTriangle className="w-5 h-5 text-amber-500" /><h3 className="font-bold text-ink-900">كشف المخاطر</h3></div>
          <div className="space-y-3">
            {analysis.risks.map((r, i) => (
              <div key={i} className={`p-4 rounded-2xl ${r.level === 'high' ? 'bg-red-50' : r.level === 'medium' ? 'bg-amber-50' : 'bg-saudi-50'}`}>
                <div className="flex items-start gap-3"><div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${r.level === 'high' ? 'bg-red-500' : r.level === 'medium' ? 'bg-amber-500' : 'bg-saudi-500'}`} /><div><p className="font-semibold text-ink-900 text-sm">{r.title}</p><p className="text-sm text-gray-600 mt-1">{r.description}</p></div></div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="mb-6 animate-slide-up">
          <div className="flex items-center gap-2 mb-4"><Info className="w-5 h-5 text-saudi-500" /><h3 className="font-bold text-ink-900">رؤى مالية مخصصة</h3></div>
          <div className="space-y-3">
            {analysis.insights.map((ins, i) => (
              <div key={i} className={`p-4 rounded-2xl ${ins.type === 'positive' ? 'bg-saudi-50' : ins.type === 'warning' ? 'bg-amber-50' : ins.type === 'danger' ? 'bg-red-50' : 'bg-blue-50'}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${ins.type === 'positive' ? 'bg-saudi-100 text-saudi-600' : ins.type === 'warning' ? 'bg-amber-100 text-amber-600' : ins.type === 'danger' ? 'bg-red-100 text-red-500' : 'bg-blue-100 text-blue-600'}`}>
                    {ins.type === 'positive' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  </div>
                  <div><p className="font-semibold text-ink-900 text-sm">{ins.title}</p><p className="text-sm text-gray-600 mt-1">{ins.message}</p></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="mb-6 animate-slide-up">
          <div className="flex items-center gap-2 mb-4"><Zap className="w-5 h-5 text-saudi-500" /><h3 className="font-bold text-ink-900">توصيات ذكية مخصصة</h3></div>
          <div className="space-y-3">
            {analysis.recommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-beige-50 hover:bg-beige-100 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-saudi-50 flex items-center justify-center flex-shrink-0">
                  {rec.icon === 'PiggyBank' ? <PiggyBank className="w-5 h-5 text-saudi-500" /> : rec.icon === 'UtensilsCrossed' ? <UtensilsCrossed className="w-5 h-5 text-saudi-500" /> : rec.icon === 'ShoppingBag' ? <ShoppingBag className="w-5 h-5 text-saudi-500" /> : rec.icon === 'Target' ? <Target className="w-5 h-5 text-saudi-500" /> : <Shield className="w-5 h-5 text-saudi-500" />}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-ink-900">{rec.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                  {rec.impact > 0 && <span className="inline-block mt-2 text-xs font-semibold text-saudi-600 bg-saudi-50 px-2 py-1 rounded-lg">الأثر المتوقع: توفير {formatCurrency(rec.impact)} سنوياً</span>}
                </div>
              </div>
            ))}
          </div>
        </Card>
        <div className="text-center mb-8"><Button onClick={onComplete} size="lg" className="px-12"><span className="flex items-center gap-2">الانتقال إلى لوحة التحكم<ArrowLeft className="w-5 h-5" /></span></Button></div>
      </div>
    </div>
  );
}
