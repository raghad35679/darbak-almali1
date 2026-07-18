import { Card, SectionHeader, Badge, Button } from '../components/ui';
import { BookOpen, GraduationCap, PiggyBank, TrendingUp, Shield, Target, Wallet, CreditCard, Calculator, ArrowLeft, Clock, BookMarked } from 'lucide-react';
import type { Page } from '../components/AppShell';

const courses = [
  {
    id: 1,
    title: 'أساسيات إدارة المال',
    desc: 'تعلم كيف تدير أموالك بفعالية وتبني أساساً مالياً قوياً',
    icon: Wallet,
    lessons: 8,
    duration: '45 دقيقة',
    level: 'مبتدئ',
    color: 'bg-saudi-50 text-saudi-500',
    topics: ['الميزانية الشخصية', 'تتبع المصاريف', 'الفرق بين الحاجات والرغبات'],
  },
  {
    id: 2,
    title: 'فن الادخار الذكي',
    desc: 'استراتيجيات عملية لزيادة مدخراتك وتحقيق أهدافك المالية',
    icon: PiggyBank,
    lessons: 6,
    duration: '35 دقيقة',
    level: 'مبتدئ',
    color: 'bg-amber-50 text-amber-500',
    topics: ['قاعدة 50/30/20', 'صندوق الطوارئ', 'الادخار التلقائي'],
  },
  {
    id: 3,
    title: 'الاستثمار للمبتدئين',
    desc: 'دليلك الشامل لبدء رحلة الاستثمار في السوق السعودي',
    icon: TrendingUp,
    lessons: 10,
    duration: '60 دقيقة',
    level: 'متوسط',
    color: 'bg-blue-50 text-blue-500',
    topics: ['الأسهم والسندات', 'الصناديق الاستثمارية', 'إدارة المخاطر'],
  },
  {
    id: 4,
    title: 'التخطيط المالي للمستقبل',
    desc: 'كيف تخطط لمستقبلك المالي وتؤمن تقاعدك',
    icon: Target,
    lessons: 7,
    duration: '50 دقيقة',
    level: 'متوسط',
    color: 'bg-teal-50 text-teal-500',
    topics: ['التقاعد المبكر', 'التأمينات', 'الاستثمار طويل المدى'],
  },
  {
    id: 5,
    title: 'إدارة الديون',
    desc: 'استراتيجيات للتخلص من الديون وعدم العودة إليها',
    icon: CreditCard,
    lessons: 5,
    duration: '30 دقيقة',
    level: 'مبتدئ',
    color: 'bg-red-50 text-red-500',
    topics: ['أنواع الديون', 'طريقة كرة الثلج', 'إعادة الهيكلة'],
  },
  {
    id: 6,
    title: 'الحماية المالية والأمن',
    desc: 'كيف تحمي أموالك من الاحتيال والمخاطر المالية',
    icon: Shield,
    lessons: 6,
    duration: '40 دقيقة',
    level: 'متوسط',
    color: 'bg-indigo-50 text-indigo-500',
    topics: ['الاحتيال المالي', 'الأمن الرقمي', 'التأمين'],
  },
];

const articles = [
  { title: 'كيف تبني ميزانية شهرية ناجحة', read: '5 دقائق', icon: Calculator },
  { title: '10 عادات مالية للنجاح', read: '7 دقائق', icon: BookMarked },
  { title: 'فهم الراتب والمستحقات في السعودية', read: '6 دقائق', icon: Wallet },
  { title: 'دليل صندوق الطوارئ: كم تدخر وكيف', read: '4 دقائق', icon: Shield },
];

export function LearningCenterPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">مركز التعلم المالي</h1>
        <p className="text-gray-500 mt-1">دروس ومقالات لزيادة وعيك المالي وتحسين مهاراتك</p>
      </div>

      {/* Featured banner */}
      <Card className="overflow-hidden gradient-saudi text-white">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-3xl bg-white/15 flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div className="flex-1 text-center sm:text-right">
            <h2 className="text-xl font-bold mb-1">ابدأ رحلتك التعليمية</h2>
            <p className="text-white/70 text-sm">اكتشف دورات تفاعلية ومقالات عملية تساعدك على إتقان إدارة أموالك</p>
          </div>
          <Button variant="secondary" size="sm" className="bg-white text-saudi-600 hover:bg-white/90">
            ابدأ التعلم
          </Button>
        </div>
      </Card>

      {/* Courses */}
      <div>
        <SectionHeader title="الدورات التعليمية" subtitle={`${courses.length} دورات متاحة`} icon={BookOpen} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map(course => (
            <Card key={course.id} className="hover:scale-[1.02] transition-transform cursor-pointer">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${course.color}`}>
                <course.icon className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-ink-900 mb-1">{course.title}</h3>
              <p className="text-sm text-gray-500 mb-3 leading-relaxed">{course.desc}</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {course.topics.map((t, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded-lg bg-beige-50 text-gray-500">{t}</span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {course.lessons} دروس</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.duration}</span>
                </div>
                <Badge variant={course.level === 'مبتدئ' ? 'success' : 'info'}>{course.level}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Articles */}
      <div>
        <SectionHeader title="مقالات مالية" subtitle="قراءات سريعة ومفيدة" icon={BookMarked} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {articles.map((article, i) => (
            <Card key={i} className="flex items-center gap-4 hover:bg-beige-50 transition-colors cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-saudi-50 flex items-center justify-center flex-shrink-0">
                <article.icon className="w-6 h-6 text-saudi-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-ink-900 text-sm">{article.title}</h3>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {article.read} قراءة
                </p>
              </div>
              <ArrowLeft className="w-5 h-5 text-gray-300" />
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Card className="text-center bg-beige-50">
        <h3 className="font-bold text-ink-900 mb-2">هل أنت جاهز لاختبار معرفتك؟</h3>
        <p className="text-sm text-gray-500 mb-4">اختبر فهمك للمواد التعليمية واحصل على شهادة إتمام</p>
        <Button onClick={() => onNavigate('assistant')} variant="secondary">
          اسأل المساعد عن الدروس
        </Button>
      </Card>
    </div>
  );
}
