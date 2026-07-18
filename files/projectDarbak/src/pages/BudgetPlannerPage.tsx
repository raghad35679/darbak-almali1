import { useState } from 'react';
import { useUserData } from '../lib/useData';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { Card, SectionHeader, Button, Badge, ProgressBar, Modal, StatCard } from '../components/ui';
import { formatCurrency, getMonthName } from '../lib/format';
import { Wallet, Plus, AlertTriangle, CheckCircle2, TrendingDown, Target, Edit3, Trash2 } from 'lucide-react';

export function BudgetPlannerPage() {
  const { user } = useAuth();
  const { budgets, analysis, refetch, loading } = useUserData();
  const now = new Date();
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [spent, setSpent] = useState('');

  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const monthBudgets = budgets.filter(b => b.month === currentMonth && b.year === currentYear);
  const totalLimit = monthBudgets.reduce((s, b) => s + b.limit_amount, 0);
  const totalSpent = monthBudgets.reduce((s, b) => s + b.spent_amount, 0);
  const totalRemaining = totalLimit - totalSpent;
  const overBudgetCount = monthBudgets.filter(b => b.spent_amount > b.limit_amount).length;

  const handleSave = async () => {
    if (!user || !category || !limit) return;
    const limitNum = parseFloat(limit);
    const spentNum = parseFloat(spent) || 0;
    if (editId) {
      await supabase.from('budgets').update({ category, limit_amount: limitNum, spent_amount: spentNum }).eq('id', editId);
    } else {
      await supabase.from('budgets').insert({ user_id: user.id, category, limit_amount: limitNum, spent_amount: spentNum, month: currentMonth, year: currentYear });
    }
    setShowAdd(false); setEditId(null); setCategory(''); setLimit(''); setSpent('');
    refetch();
  };

  const handleEdit = (b: typeof budgets[0]) => {
    setEditId(b.id); setCategory(b.category); setLimit(b.limit_amount.toString()); setSpent(b.spent_amount.toString()); setShowAdd(true);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('budgets').delete().eq('id', id);
    refetch();
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-3 border-saudi-200 border-t-saudi-500 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-ink-900">مخطط الميزانية</h1><p className="text-gray-500 mt-1">{getMonthName(currentMonth)} {currentYear}</p></div>
        <Button onClick={() => { setEditId(null); setCategory(''); setLimit(''); setSpent(''); setShowAdd(true); }}><span className="flex items-center gap-2"><Plus className="w-4 h-4" /> إضافة ميزانية</span></Button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Wallet} label="إجمالي الميزانية" value={formatCurrency(totalLimit)} color="saudi" />
        <StatCard icon={TrendingDown} label="المصروف" value={formatCurrency(totalSpent)} color="danger" />
        <StatCard icon={Target} label="المتبقي" value={formatCurrency(totalRemaining)} color={totalRemaining >= 0 ? 'saudi' : 'danger'} />
        <StatCard icon={AlertTriangle} label="ميزانيات متجاوزة" value={overBudgetCount.toString()} color={overBudgetCount > 0 ? 'warning' : 'saudi'} />
      </div>
      <Card>
        <SectionHeader title="نظرة عامة على الميزانية" icon={Wallet} />
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2"><span className="text-sm text-gray-500">إجمالي الإنفاق من الميزانية</span><span className="text-sm font-bold text-ink-900">{formatCurrency(totalSpent)} / {formatCurrency(totalLimit)}</span></div>
          <ProgressBar value={totalSpent} max={totalLimit} height="h-4" />
          <div className="flex items-center justify-between mt-2 text-xs text-gray-400"><span>{((totalSpent / (totalLimit || 1)) * 100).toFixed(0)}% مستخدم</span><span>{((totalRemaining / (totalLimit || 1)) * 100).toFixed(0)}% متبقي</span></div>
        </div>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {monthBudgets.map(b => {
          const pct = (b.spent_amount / b.limit_amount) * 100;
          const over = b.spent_amount > b.limit_amount;
          const remaining = b.limit_amount - b.spent_amount;
          return (
            <Card key={b.id}>
              <div className="flex items-start justify-between mb-3">
                <div><h3 className="font-bold text-ink-900">{b.category}</h3><p className="text-xs text-gray-400 mt-0.5">{over ? 'تجاوز الميزانية' : `متبقي ${formatCurrency(remaining)}`}</p></div>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(b)} className="w-8 h-8 rounded-lg hover:bg-beige-100 flex items-center justify-center text-gray-400"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(b.id)} className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="flex items-center justify-between mb-2 text-sm"><span className="text-gray-500">{formatCurrency(b.spent_amount)}</span><span className="text-gray-400">{formatCurrency(b.limit_amount)}</span></div>
              <ProgressBar value={b.spent_amount} max={b.limit_amount} color={over ? 'bg-red-400' : pct > 80 ? 'bg-amber-400' : 'bg-saudi-500'} height="h-3" />
              <div className="mt-2">{over ? <Badge variant="danger"><AlertTriangle className="w-3 h-3" /> تجاوز بمقدار {formatCurrency(Math.abs(remaining))}</Badge> : pct > 80 ? <Badge variant="warning">قارب على التجاوز</Badge> : <Badge variant="success"><CheckCircle2 className="w-3 h-3" /> ضمن الميزانية</Badge>}</div>
            </Card>
          );
        })}
      </div>
      {analysis && (
        <Card>
          <SectionHeader title="توزيع الميزانية الموصى به" subtitle="قاعدة 50/30/20" icon={Target} />
          <div className="space-y-4">
            {analysis.budgetAllocation.map((b, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2"><span className="font-semibold text-ink-800">{b.category}</span><span className="text-sm text-gray-500">{formatCurrency(b.amount)} ({b.percentage}%)</span></div>
                <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all duration-1000" style={{ width: `${b.percentage}%`, backgroundColor: b.color }} /></div>
              </div>
            ))}
          </div>
        </Card>
      )}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title={editId ? 'تعديل الميزانية' : 'إضافة ميزانية جديدة'}>
        <div className="space-y-4">
          <div><label className="block text-sm font-semibold text-ink-800 mb-2">الفئة</label><input type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="مثال: الطعام" className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-saudi-400 focus:ring-2 focus:ring-saudi-100 outline-none bg-beige-50" /></div>
          <div><label className="block text-sm font-semibold text-ink-800 mb-2">حد الميزانية (ر.س)</label><input type="number" value={limit} onChange={e => setLimit(e.target.value)} placeholder="2000" className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-saudi-400 focus:ring-2 focus:ring-saudi-100 outline-none bg-beige-50" /></div>
          <div><label className="block text-sm font-semibold text-ink-800 mb-2">المصروف الحالي (ر.س)</label><input type="number" value={spent} onChange={e => setSpent(e.target.value)} placeholder="0" className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-saudi-400 focus:ring-2 focus:ring-saudi-100 outline-none bg-beige-50" /></div>
          <Button onClick={handleSave} className="w-full">{editId ? 'حفظ التعديلات' : 'إضافة الميزانية'}</Button>
        </div>
      </Modal>
    </div>
  );
}
