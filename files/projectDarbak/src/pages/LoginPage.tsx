import { useState } from 'react';
import { useAuth } from '../lib/auth';
import { Button } from '../components/ui';
import { Wallet, Mail, Lock, User, ArrowLeft, Sparkles, Shield, TrendingUp } from 'lucide-react';

export function LoginPage() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = mode === 'login'
      ? await signIn(email, password)
      : await signUp(email, password, fullName);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 gradient-saudi relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-white blur-3xl animate-float" />
          <div className="absolute bottom-32 left-20 w-48 h-48 rounded-full bg-white blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>
        <div className="relative z-10 flex flex-col justify-center p-16 text-white">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-14 h-14 rounded-3xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
              <Wallet className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">دربك المالي</h1>
              <p className="text-sm text-white/70">مساعدك المالي الذكي</p>
            </div>
          </div>
          <h2 className="text-4xl font-bold leading-tight mb-4">
            رحلتك المالية<br />
            <span className="text-white/80">تبدأ من هنا</span>
          </h2>
          <p className="text-white/70 text-lg leading-relaxed mb-12 max-w-md">
            منصة مالية ذكية تعتمد الذكاء الاصطناعي لمساعدتك في إدارة أموالك، تتبع مصاريفك، وتحقيق أهدافك المالية.
          </p>
          <div className="space-y-4">
            {[
              { icon: Sparkles, title: 'تحليل ذكي بالذكاء الاصطناعي', desc: 'فهم عميق لوضعك المالي' },
              { icon: Shield, title: 'أمان وحماية كاملة', desc: 'بياناتك مشفرة ومحمية' },
              { icon: TrendingUp, title: 'توصيات مالية مخصصة', desc: 'نصائح تناسب وضعك' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-4 animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold">{f.title}</p>
                  <p className="text-sm text-white/60">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-16 bg-beige-100">
        <div className="w-full max-w-md animate-scale-in">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl gradient-saudi flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-saudi-500">دربك المالي</h1>
              <p className="text-xs text-gray-500">مساعدك المالي الذكي</p>
            </div>
          </div>
          <div className="premium-card p-8">
            <h2 className="text-2xl font-bold text-ink-900 mb-2">
              {mode === 'login' ? 'مرحباً بعودتك' : 'إنشاء حساب جديد'}
            </h2>
            <p className="text-gray-500 mb-8">
              {mode === 'login' ? 'سجل دخولك للمتابعة إلى حسابك' : 'ابدأ رحلتك المالية الذكية اليوم'}
            </p>
            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-semibold text-ink-800 mb-2">الاسم الكامل</label>
                  <div className="relative">
                    <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required placeholder="أدخل اسمك الكامل" className="w-full pr-12 pl-4 py-3.5 rounded-2xl border border-gray-200 focus:border-saudi-400 focus:ring-2 focus:ring-saudi-100 outline-none transition-all bg-beige-50" />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-ink-800 mb-2">البريد الإلكتروني</label>
                <div className="relative">
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="example@email.com" className="w-full pr-12 pl-4 py-3.5 rounded-2xl border border-gray-200 focus:border-saudi-400 focus:ring-2 focus:ring-saudi-100 outline-none transition-all bg-beige-50" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink-800 mb-2">كلمة المرور</label>
                <div className="relative">
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} placeholder="••••••••" className="w-full pr-12 pl-4 py-3.5 rounded-2xl border border-gray-200 focus:border-saudi-400 focus:ring-2 focus:ring-saudi-100 outline-none transition-all bg-beige-50" />
                </div>
              </div>
              {error && (
                <div className="bg-red-50 text-red-500 text-sm p-3 rounded-xl animate-fade-in">{error}</div>
              )}
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    جاري المعالجة...
                  </span>
                ) : mode === 'login' ? 'تسجيل الدخول' : 'إنشاء الحساب'}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); }} className="text-sm text-saudi-600 font-semibold hover:underline flex items-center justify-center gap-1">
                {mode === 'login' ? 'ليس لديك حساب؟ أنشئ حساباً جديداً' : 'لديك حساب بالفعل؟ سجل دخولك'}
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-center text-xs text-gray-400 mt-6">باستخدامك للمنصة، فإنك توافق على الشروط والأحكام وسياسة الخصوصية</p>
        </div>
      </div>
    </div>
  );
}
