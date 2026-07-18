import { useState } from 'react';
import { useAuth } from '../lib/auth';
import { Button } from '../components/ui';
import { Wallet, User, Briefcase, Users, MapPin, Calendar, ArrowLeft } from 'lucide-react';

export function FinancialInfoPage({ onNext }: { onNext: () => void }) {
  const { updateProfile } = useAuth();
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [employmentStatus, setEmploymentStatus] = useState('');
  const [dependents, setDependents] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const employmentOptions = [
    { value: 'موظف', label: 'موظف' },
    { value: 'موظف حكومي', label: 'موظف حكومي' },
    { value: 'أعمال حرة', label: 'أعمال حرة' },
    { value: 'متقاعد', label: 'متقاعد' },
    { value: 'طالب', label: 'طالب' },
    { value: 'بدون عمل', label: 'بدون عمل' },
  ];

  const saudiCities = ['الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة', 'الدمام', 'الخبر', 'الظهران', 'أبها', 'تبوك', 'بريدة', 'حائل', 'نجران', 'جازان', 'ينبع', 'الأحساء'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const income = parseFloat(monthlyIncome) || 0;
    if (income <= 0) {
      setError('الرجاء إدخل دخلاً شهرياً صحيحاً');
      setLoading(false);
      return;
    }
    const { error } = await updateProfile({
      full_name: fullName,
      age: parseInt(age) || 0,
      monthly_income: income,
      employment_status: employmentStatus,
      dependents: parseInt(dependents) || 0,
      city,
      financial_info_completed: true,
    });
    if (error) {
      setError(error);
      setLoading(false);
    } else {
      onNext();
    }
  };

  return (
    <div className="min-h-screen bg-beige-100 flex items-center justify-center p-4 lg:p-8">
      <div className="w-full max-w-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl gradient-saudi flex items-center justify-center">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-saudi-500">دربك المالي</h1>
            <p className="text-xs text-gray-500">الخطوة 1 من 3 - المعلومات المالية</p>
          </div>
        </div>
        <div className="flex gap-2 mb-8">
          <div className="flex-1 h-2 rounded-full gradient-saudi" />
          <div className="flex-1 h-2 rounded-full bg-gray-200" />
          <div className="flex-1 h-2 rounded-full bg-gray-200" />
        </div>
        <div className="premium-card p-8 lg:p-10 animate-scale-in">
          <h2 className="text-2xl font-bold text-ink-900 mb-2">معلوماتك المالية</h2>
          <p className="text-gray-500 mb-8">أدخل معلوماتك المالية الأساسية لنتمكن من تقديم تحليل دقيق وتوصيات مخصصة لك</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-ink-800 mb-2">الاسم الكامل</label>
              <div className="relative">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required placeholder="أدخل اسمك الكامل" className="w-full pr-12 pl-4 py-3.5 rounded-2xl border border-gray-200 focus:border-saudi-400 focus:ring-2 focus:ring-saudi-100 outline-none transition-all bg-beige-50" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-ink-800 mb-2">العمر</label>
                <div className="relative">
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="number" value={age} onChange={e => setAge(e.target.value)} required min={18} max={100} placeholder="25" className="w-full pr-12 pl-4 py-3.5 rounded-2xl border border-gray-200 focus:border-saudi-400 focus:ring-2 focus:ring-saudi-100 outline-none transition-all bg-beige-50" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink-800 mb-2">عدد المعالين</label>
                <div className="relative">
                  <Users className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="number" value={dependents} onChange={e => setDependents(e.target.value)} min={0} placeholder="0" className="w-full pr-12 pl-4 py-3.5 rounded-2xl border border-gray-200 focus:border-saudi-400 focus:ring-2 focus:ring-saudi-100 outline-none transition-all bg-beige-50" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink-800 mb-2">الدخل الشهري (ريال سعودي)</label>
              <div className="relative">
                <Wallet className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="number" value={monthlyIncome} onChange={e => setMonthlyIncome(e.target.value)} required min={0} placeholder="8000" className="w-full pr-12 pl-4 py-3.5 rounded-2xl border border-gray-200 focus:border-saudi-400 focus:ring-2 focus:ring-saudi-100 outline-none transition-all bg-beige-50" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink-800 mb-2">الوضع الوظيفي</label>
              <div className="relative">
                <Briefcase className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <select value={employmentStatus} onChange={e => setEmploymentStatus(e.target.value)} required className="w-full pr-12 pl-4 py-3.5 rounded-2xl border border-gray-200 focus:border-saudi-400 focus:ring-2 focus:ring-saudi-100 outline-none transition-all bg-beige-50 appearance-none">
                  <option value="">اختر الوضع الوظيفي</option>
                  {employmentOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink-800 mb-2">المدينة</label>
              <div className="relative">
                <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <select value={city} onChange={e => setCity(e.target.value)} required className="w-full pr-12 pl-4 py-3.5 rounded-2xl border border-gray-200 focus:border-saudi-400 focus:ring-2 focus:ring-saudi-100 outline-none transition-all bg-beige-50 appearance-none">
                  <option value="">اختر مدينتك</option>
                  {saudiCities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            {error && <div className="bg-red-50 text-red-500 text-sm p-3 rounded-xl animate-fade-in">{error}</div>}
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري الحفظ...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  التالي - اختيار الأهداف
                  <ArrowLeft className="w-5 h-5" />
                </span>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
