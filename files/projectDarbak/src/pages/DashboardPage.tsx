import { useUserData } from '../lib/useData';
import { Card, StatCard, CircularProgress, DonutChart, ProgressBar, Badge, SectionHeader, Button } from '../components/ui';
import { formatCurrency, formatShortDate, getMonthName, daysUntil } from '../lib/format';
import { Wallet, TrendingUp, TrendingDown, PiggyBank, Target, Bell, Calendar, Sparkles, AlertTriangle, CheckCircle2, Receipt, CreditCard } from 'lucide-react';
import type { Page } from '../components/AppShell';

export function DashboardPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { transactions, goals, budgets, bills, notifications, analysis, loading } = useUserData();
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-3 border-saudi-200 border-t-saudi-500 rounded-full animate-spin" /></div>;
  if (!analysis) return null;

  const scoreColor = analysis.healthScore >= 65 ? '#006C35' : analysis.healthScore >= 50 ? '#3A9E72' : analysis.healthScore >= 35 ? '#D4A543' : '#DC2626';
  const unreadNotifs = notifications.filter(n => !n.read);
  const upcomingBills = bills.filter(b => b.status === 'pending').slice(0, 4);
  const recentTransactions = transactions.slice(0, 6);
  const activeGoals = goals.filter(g => g.status === 'active').slice(0, 3);
  const monthBudgets = budgets.filter(b => b.month === currentMonth && b.year === currentYear);
  const overBudget = monthBudgets.filter(b => b.spent_amount > b.limit_amount);

  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth - 1, 1).getDay();
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);
  const today = now.getDate();
  const billDates = new Set(bills.map(b => new Date(b.due_date).getDate()));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-ink-900">لوحة التحكم</h1><p className="text-gray-500 mt-1">{getMonthName(currentMonth)} {currentYear} - نظرة عامة على وضعك المالي</p></div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => onNavigate('assistant')}><span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> المساعد الذكي</span></Button>
          <Button size="sm" onClick={() => onNavigate('reports')}><span className="flex items-center gap-2"><Receipt className="w-4 h-4" /> التقارير</span></Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={TrendingUp} label="الدخل الشهري" value={formatCurrency(analysis.income)} color="saudi" />
        <StatCard icon={TrendingDown} label="المصاريف" value={formatCurrency(analysis.expenses)} color="danger" />
        <StatCard icon={Wallet} label="المتبقي" value={formatCurrency(analysis.remaining)} color={analysis.remaining >= 0 ? 'saudi' : 'danger'} />
        <StatCard icon={PiggyBank} label="معدل الادخار" value={`${analysis.savingsRate.toFixed(1)}%`} color="beige" subtitle="الهدف: 20%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="flex flex-col items-center justify-center text-center">
          <h3 className="font-bold text-ink-900 mb-4">الصحة المالية</h3>
          <CircularProgress value={analysis.healthScore} size={140} strokeWidth={12} color={scoreColor} label={analysis.healthScore.toString()} sublabel={analysis.scoreLabel} />
          <div className="mt-4"><Badge variant={analysis.healthScore >= 65 ? 'success' : 'warning'}>{analysis.healthScore >= 65 ? 'وضع ممتاز' : 'يحتاج تحسين'}</Badge></div>
        </Card>
        <Card className="lg:col-span-2">
          <SectionHeader title="توزيع المصاريف" subtitle="حسب الفئة لهذا الشهر" icon={CreditCard} />
          {analysis.expenseCategories.length > 0 ? (
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <DonutChart data={analysis.expenseCategories.map(c => ({ name: c.name, value: c.amount, color: c.color }))} size={150} />
              <div className="flex-1 w-full space-y-2">
                {analysis.expenseCategories.slice(0, 6).map((c, i) => (
                  <div key={i} className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} /><span className="text-sm text-gray-600">{c.name}</span></div><div className="text-left"><span className="text-sm font-semibold text-ink-900">{formatCurrency(c.amount)}</span><span className="text-xs text-gray-400 mr-2">({c.percentage.toFixed(0)}%)</span></div></div>
                ))}
              </div>
            </div>
          ) : <p className="text-gray-400 text-sm text-center py-8">لا توجد بيانات</p>}
        </Card>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Target, label: 'الأهداف', page: 'goals' as Page, color: 'bg-saudi-50 text-saudi-500' },
          { icon: Wallet, label: 'الميزانية', page: 'budget' as Page, color: 'bg-amber-50 text-amber-500' },
          { icon: Sparkles, label: 'التوصيات', page: 'recommendations' as Page, color: 'bg-blue-50 text-blue-500' },
          { icon: Receipt, label: 'التقارير', page: 'reports' as Page, color: 'bg-teal-50 text-teal-500' },
        ].map((a, i) => (
          <button key={i} onClick={() => onNavigate(a.page)} className="premium-card p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${a.color}`}><a.icon className="w-6 h-6" /></div>
            <span className="text-sm font-semibold text-ink-800">{a.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <SectionHeader title="آخر العمليات" icon={Receipt} action={<button onClick={() => onNavigate('reports')} className="text-sm text-saudi-600 font-semibold">عرض الكل</button>} />
          <div className="space-y-3">
            {recentTransactions.map(tx => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-beige-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'income' ? 'bg-saudi-50 text-saudi-500' : 'bg-red-50 text-red-400'}`}>{tx.type === 'income' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}</div>
                  <div><p className="text-sm font-semibold text-ink-900">{tx.description}</p><p className="text-xs text-gray-400">{tx.merchant} - {formatShortDate(tx.date)}</p></div>
                </div>
                <span className={`text-sm font-bold ${tx.type === 'income' ? 'text-saudi-600' : 'text-red-500'}`}>{tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <SectionHeader title="رؤى ذكية" subtitle="من تحليل الذكاء الاصطناعي" icon={Sparkles} />
          <div className="space-y-3">
            {analysis.insights.slice(0, 4).map((ins, i) => (
              <div key={i} className={`p-3 rounded-xl ${ins.type === 'positive' ? 'bg-saudi-50' : ins.type === 'warning' ? 'bg-amber-50' : ins.type === 'danger' ? 'bg-red-50' : 'bg-blue-50'}`}>
                <div className="flex items-start gap-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${ins.type === 'positive' ? 'bg-saudi-100 text-saudi-600' : ins.type === 'warning' ? 'bg-amber-100 text-amber-600' : ins.type === 'danger' ? 'bg-red-100 text-red-500' : 'bg-blue-100 text-blue-600'}`}>
                    {ins.type === 'positive' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  </div>
                  <div><p className="text-sm font-semibold text-ink-900">{ins.title}</p><p className="text-xs text-gray-600 mt-1">{ins.message}</p></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <SectionHeader title="فواتير قادمة" icon={Calendar} />
          <div className="space-y-3">
            {upcomingBills.length > 0 ? upcomingBills.map(bill => {
              const days = daysUntil(bill.due_date);
              return (
                <div key={bill.id} className="flex items-center justify-between p-3 rounded-xl bg-beige-50">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${days <= 3 ? 'bg-red-50 text-red-500' : 'bg-saudi-50 text-saudi-500'}`}><Receipt className="w-5 h-5" /></div>
                    <div><p className="text-sm font-semibold text-ink-900">{bill.name}</p><p className="text-xs text-gray-400">{days <= 0 ? 'مستحقة اليوم' : `بعد ${days} يوم`}</p></div>
                  </div>
                  <span className="text-sm font-bold text-ink-900">{formatCurrency(bill.amount)}</span>
                </div>
              );
            }) : <p className="text-gray-400 text-sm text-center py-6">لا توجد فواتير قادمة</p>}
          </div>
        </Card>
        <Card>
          <SectionHeader title="تقدم الأهداف" icon={Target} action={<button onClick={() => onNavigate('goals')} className="text-sm text-saudi-600 font-semibold">عرض الكل</button>} />
          <div className="space-y-4">
            {activeGoals.length > 0 ? activeGoals.map(goal => {
              const pct = Math.min(100, (goal.current_amount / goal.target_amount) * 100);
              return (
                <div key={goal.id}>
                  <div className="flex items-center justify-between mb-2"><span className="text-sm font-semibold text-ink-900">{goal.title}</span><span className="text-xs text-gray-500">{pct.toFixed(0)}%</span></div>
                  <ProgressBar value={goal.current_amount} max={goal.target_amount} />
                  <div className="flex items-center justify-between mt-1"><span className="text-xs text-gray-400">{formatCurrency(goal.current_amount)}</span><span className="text-xs text-gray-400">{formatCurrency(goal.target_amount)}</span></div>
                </div>
              );
            }) : <p className="text-gray-400 text-sm text-center py-6">لا توجد أهداف نشطة</p>}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <SectionHeader title="التقويم المالي" subtitle={getMonthName(currentMonth)} icon={Calendar} />
          <div className="grid grid-cols-7 gap-1 mb-2">{['أحد', 'إثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'].map(d => <div key={d} className="text-center text-xs text-gray-400 font-semibold py-1">{d}</div>)}</div>
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((d, i) => (
              <div key={i} className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm relative ${d === today ? 'gradient-saudi text-white font-bold' : d && billDates.has(d) ? 'bg-amber-50 text-amber-600' : d ? 'bg-beige-50 text-gray-600 hover:bg-beige-100' : ''}`}>
                {d}{d && billDates.has(d) && d !== today && <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-amber-400" />}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs text-gray-400"><div className="flex items-center gap-1"><span className="w-3 h-3 rounded gradient-saudi" /> اليوم</div><div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-50" /> فاتورة مستحقة</div></div>
        </Card>
        <Card>
          <SectionHeader title="الميزانية" icon={Wallet} />
          <div className="space-y-3">
            {monthBudgets.slice(0, 5).map(b => {
              const over = b.spent_amount > b.limit_amount;
              return (
                <div key={b.id}>
                  <div className="flex items-center justify-between mb-1"><span className="text-sm text-gray-600">{b.category}</span><span className={`text-xs font-semibold ${over ? 'text-red-500' : 'text-saudi-600'}`}>{formatCurrency(b.spent_amount)} / {formatCurrency(b.limit_amount)}</span></div>
                  <ProgressBar value={b.spent_amount} max={b.limit_amount} color={over ? 'bg-red-400' : 'bg-saudi-500'} height="h-1.5" />
                </div>
              );
            })}
            {overBudget.length > 0 && <div className="mt-3 p-2 rounded-xl bg-red-50 text-red-500 text-xs flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> تجاوزت {overBudget.length} ميزانيات هذا الشهر</div>}
          </div>
        </Card>
      </div>

      {unreadNotifs.length > 0 && (
        <Card>
          <SectionHeader title="إشعارات ذكية" icon={Bell} action={<button onClick={() => onNavigate('notifications')} className="text-sm text-saudi-600 font-semibold">عرض الكل</button>} />
          <div className="space-y-2">
            {unreadNotifs.slice(0, 3).map(n => (
              <div key={n.id} className="flex items-start gap-3 p-3 rounded-xl bg-beige-50">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${n.type === 'warning' ? 'bg-amber-100 text-amber-600' : n.type === 'success' ? 'bg-saudi-100 text-saudi-600' : n.type === 'danger' ? 'bg-red-100 text-red-500' : 'bg-blue-100 text-blue-600'}`}><Bell className="w-4 h-4" /></div>
                <div><p className="text-sm font-semibold text-ink-900">{n.title}</p><p className="text-xs text-gray-500 mt-0.5">{n.message}</p></div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
