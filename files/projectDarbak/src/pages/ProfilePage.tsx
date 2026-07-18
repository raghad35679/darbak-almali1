import { useUserData } from '../lib/useData';
import { Card, SectionHeader, StatCard, Badge, ProgressBar, Button } from '../components/ui';
import { formatCurrency } from '../lib/format';
import { useAuth } from '../lib/auth';
import { MapPin, Briefcase, Calendar, Users, Wallet, Trophy, Target, TrendingUp, Award, Edit3 } from 'lucide-react';
import type { Page } from '../components/AppShell';

export function ProfilePage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { profile } = useAuth();
  const { goals, achievements, analysis, loading } = useUserData();

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-saudi-200 border-t-saudi-500 rounded-full animate-spin" />
      </div>
    );
  }

  const totalSaved = goals.reduce((s, g) => s + g.current_amount, 0);
  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const memberSince = new Date(profile.created_at).getFullYear();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">الملف الشخصي</h1>
        <p className="text-gray-500 mt-1">معلوماتك المالية وإنجازاتك</p>
      </div>

      {/* Profile header */}
      <Card className="overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl gradient-saudi flex items-center justify-center text-white text-3xl font-bold">
              {profile.full_name?.charAt(0) || 'م'}
            </div>
            <div className="absolute -bottom-1 -left-1 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-soft">
              <div className="w-3 h-3 rounded-full bg-saudi-500" />
            </div>
          </div>
          <div className="flex-1 text-center sm:text-right">
            <h2 className="text-2xl font-bold text-ink-900">{profile.full_name || 'مستخدم'}</h2>
            <p className="text-gray-500 mt-1">{profile.city} - {profile.employment_status}</p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              <Badge variant="success">عضو منذ {memberSince}</Badge>
              <Badge variant="info">الصحة المالية: {analysis?.healthScore || 0}/100</Badge>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={() => onNavigate('settings')}>
            <span className="flex items-center gap-2"><Edit3 className="w-4 h-4" /> تعديل</span>
          </Button>
        </div>
      </Card>

      {/* Financial info */}
      <div>
        <SectionHeader title="المعلومات المالية" icon={Wallet} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-saudi-50 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-saudi-500" />
              </div>
              <span className="text-sm text-gray-500">الدخل الشهري</span>
            </div>
            <p className="text-xl font-bold text-ink-900">{formatCurrency(profile.monthly_income)}</p>
          </Card>
          <Card>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-amber-500" />
              </div>
              <span className="text-sm text-gray-500">الوضع الوظيفي</span>
            </div>
            <p className="text-xl font-bold text-ink-900">{profile.employment_status || 'غير محدد'}</p>
          </Card>
          <Card>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-sm text-gray-500">العمر</span>
            </div>
            <p className="text-xl font-bold text-ink-900">{profile.age || 'غير محدد'} سنة</p>
          </Card>
          <Card>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                <Users className="w-5 h-5 text-teal-500" />
              </div>
              <span className="text-sm text-gray-500">المعالين</span>
            </div>
            <p className="text-xl font-bold text-ink-900">{profile.dependents || 0}</p>
          </Card>
          <Card>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-indigo-500" />
              </div>
              <span className="text-sm text-gray-500">المدينة</span>
            </div>
            <p className="text-xl font-bold text-ink-900">{profile.city || 'غير محدد'}</p>
          </Card>
          <Card>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-saudi-50 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-saudi-500" />
              </div>
              <span className="text-sm text-gray-500">معدل الادخار</span>
            </div>
            <p className="text-xl font-bold text-ink-900">{analysis?.savingsRate.toFixed(1) || '0'}%</p>
          </Card>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Target} label="إجمالي الأهداف" value={totalGoals.toString()} color="saudi" />
        <StatCard icon={Trophy} label="أهداف محققة" value={completedGoals.toString()} color="beige" />
        <StatCard icon={Wallet} label="إجمالي المدخرات" value={formatCurrency(totalSaved)} color="saudi" />
        <StatCard icon={Award} label="الإنجازات" value={achievements.length.toString()} color="saudi" />
      </div>

      {/* Achievements */}
      <div>
        <SectionHeader title="الإنجازات" subtitle="شارات تكافئ التزامك" icon={Trophy} />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {achievements.map((ach, i) => (
            <Card key={i} className="text-center">
              <div className="w-14 h-14 rounded-3xl gradient-saudi flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-ink-900 text-sm mb-1">{ach.title}</h3>
              <p className="text-xs text-gray-500">{ach.description}</p>
              <Badge variant="success">{ach.category}</Badge>
            </Card>
          ))}
        </div>
      </div>

      {/* Goals progress */}
      <div>
        <SectionHeader title="تقدم الأهداف" icon={Target} />
        <div className="space-y-3">
          {goals.map(goal => {
            const pct = Math.min(100, (goal.current_amount / goal.target_amount) * 100);
            return (
              <Card key={goal.id}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-ink-900">{goal.title}</span>
                  <span className="text-sm text-gray-500">{pct.toFixed(0)}%</span>
                </div>
                <ProgressBar value={goal.current_amount} max={goal.target_amount} height="h-2.5" />
                <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                  <span>{formatCurrency(goal.current_amount)}</span>
                  <span>{formatCurrency(goal.target_amount)}</span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
