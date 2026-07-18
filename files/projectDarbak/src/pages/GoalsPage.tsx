import { useState } from 'react';
import { useUserData } from '../lib/useData';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { Card, SectionHeader, Button, Badge, ProgressBar, Modal, StatCard, EmptyState } from '../components/ui';
import { formatCurrency, daysUntil } from '../lib/format';
import { Target, Plus, Trophy, Shield, Plane, Car, Home, GraduationCap, Heart, TrendingUp, CheckCircle2, Award } from 'lucide-react';

const iconMap: Record<string, typeof Target> = {
  Shield, Plane, Car, Home, GraduationCap, Heart, Target, TrendingUp, Award,
};

export function GoalsPage() {
  const { user } = useAuth();
  const { goals, achievements, refetch, loading } = useUserData();
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [icon, setIcon] = useState('Target');
  const [category, setCategory] = useState('');

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');

  const handleSave = async () => {
    if (!user || !title || !targetAmount) return;
    await supabase.from('goals').insert({
      user_id: user.id,
      title,
      target_amount: parseFloat(targetAmount),
      current_amount: parseFloat(currentAmount) || 0,
      target_date: targetDate || null,
      icon,
      category: category || 'عام',
      status: 'active',
    });
    setShowAdd(false);
    setTitle(''); setTargetAmount(''); setCurrentAmount(''); setTargetDate(''); setIcon('Target'); setCategory('');
    refetch();
  };

  const handleUpdateProgress = async (id: string, current: number, target: number) => {
    const newAmount = Math.min(current + Math.round(target * 0.05), target);
    const status = newAmount >= target ? 'completed' : 'active';
    await supabase.from('goals').update({ current_amount: newAmount, status, updated_at: new Date().toISOString() }).eq('id', id);
    if (status === 'completed' && user) {
      await supabase.from('achievements').insert({
        user_id: user.id,
        title: 'تحقيق هدف',
        description: `حققت هدف "${title}" بنجاح!`,
        icon: 'Trophy',
        category: 'أهداف',
      });
    }
    refetch();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('goals').delete().eq('id', id);
    refetch();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-saudi-200 border-t-saudi-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">الأهداف المالية</h1>
          <p className="text-gray-500 mt-1">حدد أهدافك وتتبع تقدمك نحو تحقيقها</p>
        </div>
        <Button onClick={() => setShowAdd(true)}>
          <span className="flex items-center gap-2"><Plus className="w-4 h-4" /> هدف جديد</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Target} label="أهداف نشطة" value={activeGoals.length.toString()} color="saudi" />
        <StatCard icon={CheckCircle2} label="أهداف محققة" value={completedGoals.length.toString()} color="beige" />
        <StatCard icon={Trophy} label="إجمالي الإنجازات" value={achievements.length.toString()} color="saudi" />
        <StatCard icon={TrendingUp} label="إجمالي المدخرات" value={formatCurrency(goals.reduce((s, g) => s + g.current_amount, 0))} color="saudi" />
      </div>

      {/* Active goals */}
      <div>
        <SectionHeader title="الأهداف النشطة" icon={Target} />
        {activeGoals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeGoals.map(goal => {
              const Icon = iconMap[goal.icon] || Target;
              const pct = Math.min(100, (goal.current_amount / goal.target_amount) * 100);
              const remaining = goal.target_amount - goal.current_amount;
              const days = goal.target_date ? daysUntil(goal.target_date) : null;
              return (
                <Card key={goal.id}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-saudi-50 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-saudi-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-ink-900">{goal.title}</h3>
                        <p className="text-xs text-gray-400">{goal.category}</p>
                      </div>
                    </div>
                    <button onClick={() => handleDelete(goal.id)} className="text-gray-300 hover:text-red-500 text-sm">حذف</button>
                  </div>
                  <div className="flex items-center justify-between mb-2 text-sm">
                    <span className="text-gray-500">{formatCurrency(goal.current_amount)}</span>
                    <span className="text-gray-400">{formatCurrency(goal.target_amount)}</span>
                  </div>
                  <ProgressBar value={goal.current_amount} max={goal.target_amount} height="h-3" />
                  <div className="flex items-center justify-between mt-3">
                    <Badge variant={pct >= 75 ? 'success' : 'info'}>{pct.toFixed(0)}% مكتمل</Badge>
                    {days !== null && (
                      <span className="text-xs text-gray-400">
                        {days > 0 ? `باقي ${days} يوم` : 'موعد التحقيق'}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400">متبقي: {formatCurrency(remaining)}</span>
                    <Button variant="secondary" size="sm" onClick={() => handleUpdateProgress(goal.id, goal.current_amount, goal.target_amount)}>
                      إضافة مدخرات
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <EmptyState icon={Target} title="لا توجد أهداف نشطة" subtitle="ابدأ بإنشاء هدف مالي جديد لتحقيق طموحاتك" />
          </Card>
        )}
      </div>

      {/* Completed goals */}
      {completedGoals.length > 0 && (
        <div>
          <SectionHeader title="أهداف محققة" icon={CheckCircle2} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {completedGoals.map(goal => {
              const Icon = iconMap[goal.icon] || Target;
              return (
                <Card key={goal.id} className="bg-saudi-50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-saudi-100 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-saudi-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-ink-900 text-sm">{goal.title}</h3>
                      <Badge variant="success"><CheckCircle2 className="w-3 h-3" /> محقق</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{formatCurrency(goal.target_amount)}</p>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Achievements */}
      <div>
        <SectionHeader title="الإنجازات والشارات" subtitle="أوسمة تكافئ التزامك المالي" icon={Trophy} />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {achievements.map((ach, i) => {
            const Icon = iconMap[ach.icon] || Award;
            return (
              <Card key={i} className="text-center hover:scale-105 transition-transform">
                <div className="w-16 h-16 rounded-3xl gradient-saudi flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-ink-900 text-sm mb-1">{ach.title}</h3>
                <p className="text-xs text-gray-500">{ach.description}</p>
                <Badge variant="success" >{ach.category}</Badge>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Add Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="هدف مالي جديد">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-ink-800 mb-2">عنوان الهدف</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="مثال: صندوق الطوارئ" className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-saudi-400 focus:ring-2 focus:ring-saudi-100 outline-none bg-beige-50" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink-800 mb-2">المبلغ المستهدف (ر.س)</label>
            <input type="number" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} placeholder="50000" className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-saudi-400 focus:ring-2 focus:ring-saudi-100 outline-none bg-beige-50" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink-800 mb-2">المبلغ الحالي (ر.س)</label>
            <input type="number" value={currentAmount} onChange={e => setCurrentAmount(e.target.value)} placeholder="0" className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-saudi-400 focus:ring-2 focus:ring-saudi-100 outline-none bg-beige-50" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink-800 mb-2">تاريخ الاستهداف</label>
            <input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-saudi-400 focus:ring-2 focus:ring-saudi-100 outline-none bg-beige-50" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink-800 mb-2">الفئة</label>
            <input type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="ادخار" className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-saudi-400 focus:ring-2 focus:ring-saudi-100 outline-none bg-beige-50" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink-800 mb-2">الأيقونة</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(iconMap).map(([name, Ico]) => (
                <button key={name} type="button" onClick={() => setIcon(name)} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${icon === name ? 'gradient-saudi text-white' : 'bg-beige-50 text-gray-400 hover:bg-beige-100'}`}>
                  <Ico className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>
          <Button onClick={handleSave} className="w-full">إنشاء الهدف</Button>
        </div>
      </Modal>
    </div>
  );
}
