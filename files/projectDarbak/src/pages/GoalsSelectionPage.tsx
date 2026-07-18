import { useState } from 'react';
import { useAuth } from '../lib/auth';
import { Button } from '../components/ui';
import { Wallet, Target, PiggyBank, Plane, Car, Home, GraduationCap, Heart, Shield, TrendingUp, ArrowLeft, Check } from 'lucide-react';

const goalOptions = [
  { id: 'emergency', label: 'صندوق الطوارئ', icon: Shield, desc: 'ادخر للمواقف غير المتوقعة', color: 'bg-red-50 text-red-500' },
  { id: 'savings', label: 'زيادة المدخرات', icon: PiggyBank, desc: 'بناء ثقل مالي للمستقبل', color: 'bg-saudi-50 text-saudi-500' },
  { id: 'travel', label: 'السفر والسياحة', icon: Plane, desc: 'ادخر لرحلة أحلامك', color: 'bg-blue-50 text-blue-500' },
  { id: 'car', label: 'شراء سيارة', icon: Car, desc: 'وفّر لسيارتك الجديدة', color: 'bg-amber-50 text-amber-500' },
  { id: 'home', label: 'شراء منزل', icon: Home, desc: 'ابدأ رحلة التملك', color: 'bg-teal-50 text-teal-500' },
  { id: 'education', label: 'التعليم', icon: GraduationCap, desc: 'استثمر في تعليمك', color: 'bg-cyan-50 text-cyan-500' },
  { id: 'invest', label: 'الاستثمار', icon: TrendingUp, desc: 'نمّ أموالك بذكاء', color: 'bg-emerald-50 text-emerald-500' },
  { id: 'debt', label: 'سداد الديون', icon: Target, desc: 'تخلص من الديون نهائياً', color: 'bg-orange-50 text-orange-500' },
  { id: 'family', label: 'تأسيس عائلة', icon: Heart, desc: 'استعد لمرحلة جديدة', color: 'bg-pink-50 text-pink-500' },
];

export function GoalsSelectionPage({ onNext }: { onNext: () => void }) {
  const { updateProfile } = useAuth();
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    await updateProfile({ goals_selected: true });
    onNext();
  };

  return (
    <div className="min-h-screen bg-beige-100 flex items-center justify-center p-4 lg:p-8">
      <div className="w-full max-w-3xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl gradient-saudi flex items-center justify-center">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-saudi-500">دربك المالي</h1>
            <p className="text-xs text-gray-500">الخطوة 2 من 3 - اختيار الأهداف</p>
          </div>
        </div>
        <div className="flex gap-2 mb-8">
          <div className="flex-1 h-2 rounded-full gradient-saudi" />
          <div className="flex-1 h-2 rounded-full gradient-saudi" />
          <div className="flex-1 h-2 rounded-full bg-gray-200" />
        </div>
        <div className="premium-card p-8 lg:p-10 animate-scale-in">
          <h2 className="text-2xl font-bold text-ink-900 mb-2">ما هي أهدافك المالية؟</h2>
          <p className="text-gray-500 mb-8">اختر الأهداف التي تهمك، وسنخصص لك توصيات ونصائح مالية تناسب طموحاتك</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {goalOptions.map((goal) => {
              const isSelected = selected.includes(goal.id);
              return (
                <button key={goal.id} onClick={() => toggle(goal.id)} className={`relative p-5 rounded-2xl border-2 transition-all duration-300 text-right ${isSelected ? 'border-saudi-500 bg-saudi-50 shadow-soft-lg' : 'border-gray-200 bg-beige-50 hover:border-saudi-200'}`}>
                  {isSelected && (
                    <div className="absolute top-3 left-3 w-6 h-6 rounded-full gradient-saudi flex items-center justify-center animate-scale-in">
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    </div>
                  )}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 ${goal.color}`}>
                    <goal.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-ink-900 mb-1">{goal.label}</h3>
                  <p className="text-xs text-gray-500">{goal.desc}</p>
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{selected.length === 0 ? 'لم تختر أي أهداف بعد' : `${selected.length} أهداف مختارة`}</p>
            <Button onClick={handleSubmit} size="lg" disabled={loading || selected.length === 0}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري المعالجة...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  التالي - تحليل الذكاء الاصطناعي
                  <ArrowLeft className="w-5 h-5" />
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
