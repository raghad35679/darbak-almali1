import { useState, useMemo } from 'react';
import { useUserData } from '../lib/useData';
import { Card, SectionHeader, StatCard, BarChart, LineChart, DonutChart, CircularProgress, Badge } from '../components/ui';
import { formatCurrency, getMonthName, arabicMonths } from '../lib/format';
import { Receipt, TrendingUp, TrendingDown, PiggyBank, Download, Calendar, FileText, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function ReportsPage() {
  const { transactions, analysis, loading } = useUserData();
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear] = useState(now.getFullYear());

  const monthData = useMemo(() => {
    const monthTransactions = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() + 1 === selectedMonth && d.getFullYear() === selectedYear;
    });
    const income = monthTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expenses = monthTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const savings = income - expenses;
    const savingsRate = income > 0 ? (savings / income) * 100 : 0;

    const categoryMap: Record<string, number> = {};
    monthTransactions.filter(t => t.type === 'expense').forEach(t => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });
    const categories = Object.entries(categoryMap)
      .map(([name, amount]) => ({ name, amount, percentage: expenses > 0 ? (amount / expenses) * 100 : 0 }))
      .sort((a, b) => b.amount - a.amount);

    // Daily spending for the month
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const dailySpending: { label: string; value: number }[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dayExpenses = monthTransactions
        .filter(t => t.type === 'expense' && new Date(t.date).getDate() === d)
        .reduce((s, t) => s + t.amount, 0);
      dailySpending.push({ label: d.toString(), value: dayExpenses });
    }

    return { income, expenses, savings, savingsRate, categories, dailySpending, transactionCount: monthTransactions.length };
  }, [transactions, selectedMonth, selectedYear]);

  const last6MonthsData = useMemo(() => {
    const data: { label: string; income: number; expenses: number; savings: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const m = now.getMonth() + 1 - i;
      const month = m < 1 ? m + 12 : m;
      const year = m < 1 ? selectedYear - 1 : selectedYear;
      const monthTx = transactions.filter(t => {
        const d = new Date(t.date);
        return d.getMonth() + 1 === month && d.getFullYear() === year;
      });
      const income = monthTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const expenses = monthTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
      data.push({ label: arabicMonths[month - 1], income, expenses, savings: income - expenses });
    }
    return data;
  }, [transactions, selectedYear, now]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-saudi-200 border-t-saudi-500 rounded-full animate-spin" />
      </div>
    );
  }

  const reportScore = analysis?.healthScore || 0;
  const scoreColor = reportScore >= 65 ? '#006C35' : reportScore >= 50 ? '#3A9E72' : reportScore >= 35 ? '#D4A543' : '#DC2626';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">التقارير الشهرية</h1>
          <p className="text-gray-500 mt-1">تحليل مفصل لوضعك المالي الشهري</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-400" />
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(parseInt(e.target.value))}
            className="px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-saudi-400 outline-none bg-white text-sm font-semibold"
          >
            {arabicMonths.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Report summary card */}
      <Card className="overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-shrink-0">
            <CircularProgress
              value={reportScore}
              size={140}
              strokeWidth={12}
              color={scoreColor}
              label={reportScore.toString()}
              sublabel="الصحة المالية"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-saudi-500" />
              <h2 className="text-xl font-bold text-ink-900">تقرير {getMonthName(selectedMonth)} {selectedYear}</h2>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              {monthData.transactionCount} عملية - {monthData.categories.length} فئة إنفاق
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant={monthData.savings >= 0 ? 'success' : 'danger'}>
                {monthData.savings >= 0 ? 'فائض' : 'عجز'}: {formatCurrency(Math.abs(monthData.savings))}
              </Badge>
              <Badge variant="info">معدل الادخار: {monthData.savingsRate.toFixed(1)}%</Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Key metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={TrendingUp} label="إجمالي الدخل" value={formatCurrency(monthData.income)} color="saudi" />
        <StatCard icon={TrendingDown} label="إجمالي المصاريف" value={formatCurrency(monthData.expenses)} color="danger" />
        <StatCard icon={PiggyBank} label="صافي المدخرات" value={formatCurrency(monthData.savings)} color={monthData.savings >= 0 ? 'saudi' : 'danger'} />
        <StatCard icon={Receipt} label="عدد العمليات" value={monthData.transactionCount.toString()} color="beige" />
      </div>

      {/* 6-month trend */}
      <Card>
        <SectionHeader title="الاتجاه الشهري" subtitle="آخر 6 أشهر" icon={TrendingUp} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-500 mb-3">الدخل مقابل المصاريف</h4>
            <BarChart
              data={last6MonthsData.map(d => ({
                label: d.label,
                value: d.expenses,
                secondary: d.income,
                color: '#006C35',
              }))}
              height={200}
            />
            <div className="flex items-center justify-center gap-6 mt-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-saudi-500" /> المصاريف
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-beige-300" /> الدخل
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-500 mb-3">تطور المدخرات</h4>
            <LineChart data={last6MonthsData.map(d => ({ label: d.label, value: d.savings }))} height={200} />
          </div>
        </div>
      </Card>

      {/* Daily spending */}
      <Card>
        <SectionHeader title="الإنفاق اليومي" subtitle={getMonthName(selectedMonth)} icon={Calendar} />
        <BarChart
          data={monthData.dailySpending.slice(0, new Date().getDate()).map(d => ({
            label: d.label,
            value: d.value,
            color: '#3A9E72',
          }))}
          height={180}
        />
      </Card>

      {/* Category breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <SectionHeader title="توزيع المصاريف" icon={Receipt} />
          {monthData.categories.length > 0 ? (
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <DonutChart
                data={monthData.categories.map(c => ({
                  name: c.name,
                  value: c.amount,
                  color: ['#006C35', '#3A9E72', '#5CB48B', '#92CDB0', '#C8E6D5', '#D4C9A8', '#E5DDC9'][c.name.length % 7],
                }))}
                size={150}
              />
              <div className="flex-1 w-full space-y-2">
                {monthData.categories.slice(0, 6).map((c, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: ['#006C35', '#3A9E72', '#5CB48B', '#92CDB0', '#C8E6D5', '#D4C9A8'][i % 6] }} />
                      <span className="text-sm text-gray-600">{c.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-ink-900">{formatCurrency(c.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center py-8">لا توجد بيانات لهذا الشهر</p>
          )}
        </Card>

        <Card>
          <SectionHeader title="ملاحظات وتحليلات" icon={FileText} />
          <div className="space-y-3">
            {analysis?.insights.slice(0, 4).map((ins, i) => (
              <div key={i} className={`p-3 rounded-xl ${
                ins.type === 'positive' ? 'bg-saudi-50' :
                ins.type === 'warning' ? 'bg-amber-50' :
                ins.type === 'danger' ? 'bg-red-50' : 'bg-blue-50'
              }`}>
                <div className="flex items-start gap-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    ins.type === 'positive' ? 'bg-saudi-100 text-saudi-600' :
                    ins.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                    ins.type === 'danger' ? 'bg-red-100 text-red-500' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {ins.type === 'positive' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink-900">{ins.title}</p>
                    <p className="text-xs text-gray-600 mt-1">{ins.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Download report */}
      <Card className="text-center">
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="w-14 h-14 rounded-3xl bg-saudi-50 flex items-center justify-center">
            <Download className="w-7 h-7 text-saudi-500" />
          </div>
          <h3 className="font-bold text-ink-900">تصدير التقرير</h3>
          <p className="text-sm text-gray-500 max-w-md">احفظ تقريرك المالي لشهر {getMonthName(selectedMonth)} بصيغة PDF لمشاركته أو أرشفته</p>
          <button className="mt-2 px-6 py-3 rounded-2xl gradient-saudi text-white font-semibold text-sm flex items-center gap-2 hover:shadow-soft-lg transition-all">
            <Download className="w-4 h-4" /> تصدير PDF
          </button>
        </div>
      </Card>
    </div>
  );
}
