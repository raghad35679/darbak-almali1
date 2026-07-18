import { useUserData } from '../lib/useData';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { Card, SectionHeader, Button, EmptyState } from '../components/ui';
import { formatTime, formatDate } from '../lib/format';
import { Bell, AlertTriangle, CheckCircle2, Info, Trophy, TrendingUp, BellOff, CheckCheck } from 'lucide-react';

const iconMap: Record<string, typeof Bell> = {
  Bell, AlertTriangle, CheckCircle2, Info, Trophy, TrendingUp,
};

export function NotificationsPage() {
  const { user } = useAuth();
  const { notifications, setNotifications, loading } = useUserData();
  const unread = notifications.filter(n => !n.read);
  const read = notifications.filter(n => n.read);

  const handleMarkRead = async (id: string) => {
    await supabase.from('notifications').update({ read: true }).eq('id', id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllRead = async () => {
    if (!user) return;
    await supabase.from('notifications').update({ read: true }).eq('user_id', user.id).eq('read', false);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleDelete = async (id: string) => {
    await supabase.from('notifications').delete().eq('id', id);
    setNotifications(prev => prev.filter(n => n.id !== id));
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
          <h1 className="text-2xl font-bold text-ink-900">الإشعارات</h1>
          <p className="text-gray-500 mt-1">{unread.length} إشعار غير مقروء</p>
        </div>
        {unread.length > 0 && (
          <Button variant="secondary" size="sm" onClick={handleMarkAllRead}>
            <span className="flex items-center gap-2"><CheckCheck className="w-4 h-4" /> تعليم الكل كمقروء</span>
          </Button>
        )}
      </div>

      {/* Unread */}
      {unread.length > 0 && (
        <div>
          <SectionHeader title="غير مقروءة" icon={Bell} />
          <div className="space-y-3">
            {unread.map(n => {
              const Icon = iconMap[n.icon] || Bell;
              return (
                <Card key={n.id} className="border-r-4 border-r-saudi-500">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      n.type === 'warning' ? 'bg-amber-50 text-amber-500' :
                      n.type === 'success' ? 'bg-saudi-50 text-saudi-500' :
                      n.type === 'danger' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h3 className="font-bold text-ink-900">{n.title}</h3>
                        <span className="text-xs text-gray-400">{formatTime(n.created_at)}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <button onClick={() => handleMarkRead(n.id)} className="text-xs text-saudi-600 font-semibold hover:underline">
                          تعليم كمقروء
                        </button>
                        <span className="text-gray-200">|</span>
                        <button onClick={() => handleDelete(n.id)} className="text-xs text-gray-400 hover:text-red-500">
                          حذف
                        </button>
                      </div>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-saudi-500 flex-shrink-0 mt-2" />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Read */}
      {read.length > 0 && (
        <div>
          <SectionHeader title="مقروءة" icon={CheckCircle2} />
          <div className="space-y-3">
            {read.map(n => {
              const Icon = iconMap[n.icon] || Bell;
              return (
                <Card key={n.id} className="opacity-60">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      n.type === 'warning' ? 'bg-amber-50 text-amber-500' :
                      n.type === 'success' ? 'bg-saudi-50 text-saudi-500' :
                      n.type === 'danger' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-ink-900">{n.title}</h3>
                        <span className="text-xs text-gray-400">{formatDate(n.created_at)}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{n.message}</p>
                      <button onClick={() => handleDelete(n.id)} className="text-xs text-gray-400 hover:text-red-500 mt-2">
                        حذف
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {notifications.length === 0 && (
        <Card>
          <EmptyState icon={BellOff} title="لا توجد إشعارات" subtitle="ستظهر هنا إشعاراتك المالية الذكية" />
        </Card>
      )}
    </div>
  );
}
