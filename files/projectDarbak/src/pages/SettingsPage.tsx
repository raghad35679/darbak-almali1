import { useState } from 'react';
import { useAuth } from '../lib/auth';
import { Card, SectionHeader, Button, Badge } from '../components/ui';
import { Bell, Moon, Globe, Shield, LogOut, User, Wallet, Lock, Mail, Check } from 'lucide-react';

export function SettingsPage() {
  const { profile, signOut } = useAuth();
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [billReminders, setBillReminders] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('ar');
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">الإعدادات</h1>
        <p className="text-gray-500 mt-1">تخصيص تجربتك في دربك المالي</p>
      </div>

      {/* Notifications settings */}
      <Card>
        <SectionHeader title="الإشعارات" icon={Bell} />
        <div className="space-y-4">
          {[
            { label: 'تفعيل الإشعارات', desc: 'استلام إشعارات مالية عامة', value: notifEnabled, setter: setNotifEnabled },
            { label: 'تنبيهات الميزانية', desc: 'إشعار عند تجاوز حد الميزانية', value: budgetAlerts, setter: setBudgetAlerts },
            { label: 'التقرير الأسبوعي', desc: 'ملخص أسبوعي لوضعك المالي', value: weeklyReport, setter: setWeeklyReport },
            { label: 'تذكير الفواتير', desc: 'تذكير قبل استحقاق الفواتير', value: billReminders, setter: setBillReminders },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-beige-50">
              <div>
                <p className="font-semibold text-ink-900 text-sm">{item.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
              <button
                onClick={() => item.setter(!item.value)}
                className={`relative w-12 h-7 rounded-full transition-all ${item.value ? 'gradient-saudi' : 'bg-gray-200'}`}
              >
                <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${item.value ? 'left-1' : 'right-1'}`} />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Appearance */}
      <Card>
        <SectionHeader title="المظهر" icon={Moon} />
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-beige-50">
            <div>
              <p className="font-semibold text-ink-900 text-sm">الوضع الداكن</p>
              <p className="text-xs text-gray-500 mt-0.5">تغيير مظهر التطبيق</p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative w-12 h-7 rounded-full transition-all ${darkMode ? 'gradient-saudi' : 'bg-gray-200'}`}
            >
              <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${darkMode ? 'left-1' : 'right-1'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-beige-50">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-semibold text-ink-900 text-sm">اللغة</p>
                <p className="text-xs text-gray-500 mt-0.5">لغة التطبيق</p>
              </div>
            </div>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold outline-none focus:border-saudi-400"
            >
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Account info */}
      <Card>
        <SectionHeader title="معلومات الحساب" icon={User} />
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-beige-50">
            <User className="w-5 h-5 text-gray-400" />
            <div className="flex-1">
              <p className="text-xs text-gray-400">الاسم</p>
              <p className="font-semibold text-ink-900 text-sm">{profile?.full_name || 'غير محدد'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-beige-50">
            <Wallet className="w-5 h-5 text-gray-400" />
            <div className="flex-1">
              <p className="text-xs text-gray-400">الدخل الشهري</p>
              <p className="font-semibold text-ink-900 text-sm">{profile?.monthly_income || 0} ر.س</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Security */}
      <Card>
        <SectionHeader title="الأمان والخصوصية" icon={Shield} />
        <div className="space-y-3">
          <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-beige-50 hover:bg-beige-100 transition-colors text-right">
            <Lock className="w-5 h-5 text-gray-400" />
            <span className="flex-1 text-sm font-semibold text-ink-900">تغيير كلمة المرور</span>
          </button>
          <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-beige-50 hover:bg-beige-100 transition-colors text-right">
            <Shield className="w-5 h-5 text-gray-400" />
            <span className="flex-1 text-sm font-semibold text-ink-900">المصادقة الثنائية</span>
            <Badge variant="info">قريباً</Badge>
          </button>
          <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-beige-50 hover:bg-beige-100 transition-colors text-right">
            <Mail className="w-5 h-5 text-gray-400" />
            <span className="flex-1 text-sm font-semibold text-ink-900">إدارة البريد الإلكتروني</span>
          </button>
        </div>
      </Card>

      {/* Save & Logout */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={handleSave} className="flex-1">
          {saved ? <span className="flex items-center justify-center gap-2"><Check className="w-5 h-5" /> تم الحفظ</span> : 'حفظ الإعدادات'}
        </Button>
        <Button variant="outline" onClick={signOut} className="flex-1 text-red-500 border-red-200 hover:bg-red-50">
          <span className="flex items-center justify-center gap-2"><LogOut className="w-5 h-5" /> تسجيل الخروج</span>
        </Button>
      </div>

      <p className="text-center text-xs text-gray-400 pb-4">
        دربك المالي - الإصدار 1.0.0
      </p>
    </div>
  );
}
