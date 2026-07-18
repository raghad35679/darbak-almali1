import type { Transaction, Goal, Budget, Bill } from './supabase';
import { formatCurrency, arabicMonths } from './format';

export type FinancialAnalysis = {
  healthScore: number;
  scoreLabel: string;
  income: number;
  expenses: number;
  remaining: number;
  savingsRate: number;
  expenseCategories: { name: string; amount: number; percentage: number; color: string }[];
  predictedEndOfMonth: number;
  unusualSpending: { category: string; amount: number; expected: number; message: string }[];
  insights: { type: 'positive' | 'warning' | 'info' | 'danger'; title: string; message: string }[];
  budgetAllocation: { category: string; percentage: number; amount: number; color: string }[];
  risks: { level: 'high' | 'medium' | 'low'; title: string; description: string }[];
  recommendations: { title: string; description: string; impact: number; icon: string }[];
  weeklyComparison: { week: string; thisWeek: number; lastWeek: number }[];
  savingsPrediction: { month: string; amount: number }[];
};

const categoryColors: Record<string, string> = {
  'الإسكان': '#006C35',
  'الطعام': '#3A9E72',
  'المواصلات': '#5CB48B',
  'التسوق': '#D4C9A8',
  'الترفيه': '#92CDB0',
  'الصحة': '#005C2D',
  'التعليم': '#004A24',
  'الفواتير': '#C8E6D5',
  'أخرى': '#E5DDC9',
};

export function analyzeFinances(
  monthlyIncome: number,
  transactions: Transaction[],
  goals: Goal[],
  budgets: Budget[],
  bills: Bill[]
): FinancialAnalysis {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const expenses = monthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const income = monthlyIncome;
  const remaining = income - expenses;
  const savingsRate = income > 0 ? (remaining / income) * 100 : 0;

  const categoryMap: Record<string, number> = {};
  monthTransactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });

  const expenseCategories = Object.entries(categoryMap)
    .map(([name, amount]) => ({
      name,
      amount,
      percentage: expenses > 0 ? (amount / expenses) * 100 : 0,
      color: categoryColors[name] || '#E5DDC9',
    }))
    .sort((a, b) => b.amount - a.amount);

  let healthScore = 50;
  if (savingsRate >= 20) healthScore += 25;
  else if (savingsRate >= 10) healthScore += 15;
  else if (savingsRate >= 0) healthScore += 5;
  else healthScore -= 15;

  if (expenses < income * 0.7) healthScore += 15;
  else if (expenses < income * 0.9) healthScore += 5;
  else healthScore -= 10;

  if (goals.length > 0) healthScore += 5;
  if (budgets.length > 0) healthScore += 5;
  if (remaining > 0) healthScore += 5;

  healthScore = Math.max(0, Math.min(100, Math.round(healthScore)));

  const scoreLabel =
    healthScore >= 80 ? 'ممتاز' :
    healthScore >= 65 ? 'جيد جداً' :
    healthScore >= 50 ? 'جيد' :
    healthScore >= 35 ? 'يحتاج تحسين' : 'مخاطر';

  const dayOfMonth = now.getDate();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const dailyRate = dayOfMonth > 0 ? expenses / dayOfMonth : 0;
  const projectedExpenses = dailyRate * daysInMonth;
  const predictedEndOfMonth = income - projectedExpenses;

  const unusualSpending: FinancialAnalysis['unusualSpending'] = [];
  const lastMonthTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    return d.getMonth() === lastMonth && d.getFullYear() === lastYear && t.type === 'expense';
  });

  Object.keys(categoryMap).forEach(cat => {
    const thisMonth = categoryMap[cat];
    const lastMonth = lastMonthTransactions
      .filter(t => t.category === cat)
      .reduce((s, t) => s + t.amount, 0);
    const expected = lastMonth > 0 ? lastMonth : thisMonth * 0.7;
    if (lastMonth > 0 && thisMonth > expected * 1.4) {
      unusualSpending.push({
        category: cat,
        amount: thisMonth,
        expected,
        message: `إنفاقك في "${cat}" هذا الشهر أعلى بنسبة ${Math.round(((thisMonth - expected) / expected) * 100)}% من الشهر الماضي`,
      });
    }
  });

  const insights: FinancialAnalysis['insights'] = [];
  if (savingsRate >= 20) {
    insights.push({ type: 'positive', title: 'معدل ادخار ممتاز', message: `أنت تدخر ${savingsRate.toFixed(1)}% من دخلك، وهذا أعلى من المعدل الموصى به (20%). استمر!` });
  } else if (savingsRate >= 10) {
    insights.push({ type: 'info', title: 'معدل ادخار جيد', message: `أنت تدخر ${savingsRate.toFixed(1)}% من دخلك. حاول الوصول إلى 20% لضمان مستقبل مالي أفضل.` });
  } else if (savingsRate >= 0) {
    insights.push({ type: 'warning', title: 'معدل ادخار منخفض', message: `أنت تدخر ${savingsRate.toFixed(1)}% فقط من دخلك. راجع مصاريفك لزيادة المدخرات.` });
  } else {
    insights.push({ type: 'danger', title: 'الإنفاق يتجاوز الدخل', message: 'مصاريفك تتجاوز دخلك هذا الشهر. يجب اتخاذ إجراءات فورية لخفض الإنفاق.' });
  }

  if (predictedEndOfMonth < 0) {
    insights.push({ type: 'danger', title: 'توقع عجز في نهاية الشهر', message: `بناءً على معدل إنفاقك الحالي، قد تواجه عجزاً قدره ${formatCurrency(Math.abs(predictedEndOfMonth))} بنهاية الشهر.` });
  } else if (predictedEndOfMonth > income * 0.2) {
    insights.push({ type: 'positive', title: 'توقع فائض جيد', message: `من المتوقع أن يتبقى لديك ${formatCurrency(predictedEndOfMonth)} بنهاية الشهر. فكر في توجيهها للادخار.` });
  }

  unusualSpending.forEach(u => {
    insights.push({ type: 'warning', title: `إنفاق مرتفع: ${u.category}`, message: u.message });
  });

  if (goals.length > 0) {
    const activeGoals = goals.filter(g => g.status === 'active');
    if (activeGoals.length > 0) {
      insights.push({ type: 'info', title: 'أهداف نشطة', message: `لديك ${activeGoals.length} أهداف مالية نشطة. حافظ على التزامك للوصول إليها.` });
    }
  }

  const budgetAllocation = [
    { category: 'الاحتياجات الأساسية', percentage: 50, amount: income * 0.5, color: '#006C35' },
    { category: 'الرغبات', percentage: 30, amount: income * 0.3, color: '#3A9E72' },
    { category: 'الادخار والاستثمار', percentage: 20, amount: income * 0.2, color: '#92CDB0' },
  ];

  const risks: FinancialAnalysis['risks'] = [];
  if (remaining < 0) {
    risks.push({ level: 'high', title: 'عجز مالي شهري', description: 'مصاريفك تتجاوز دخلك الشهري. هذا غير مستدام على المدى الطويل.' });
  }
  if (savingsRate < 10) {
    risks.push({ level: 'medium', title: 'معدل ادخار منخفض', description: 'معدل ادخارك أقل من 10%. قد لا يكون كافياً للطوارئ.' });
  }
  const housingRatio = (categoryMap['الإسكان'] || 0) / income;
  if (housingRatio > 0.4) {
    risks.push({ level: 'medium', title: 'نسبة إسكان مرتفعة', description: 'إنفاقك على الإسكان يتجاوز 40% من دخلك، وهو أعلى من الموصى به.' });
  }
  const upcomingBills = bills.filter(b => {
    const d = new Date(b.due_date);
    const diff = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7 && b.status === 'pending';
  });
  if (upcomingBills.length > 0) {
    const total = upcomingBills.reduce((s, b) => s + b.amount, 0);
    risks.push({ level: 'low', title: 'فواتير مستحقة قريباً', description: `لديك ${upcomingBills.length} فواتير بقيمة ${formatCurrency(total)} مستحقة خلال 7 أيام.` });
  }
  if (risks.length === 0) {
    risks.push({ level: 'low', title: 'لا توجد مخاطر كبيرة', description: 'وضعك المالي مستقر. استمر في مراقبة مصاريفك.' });
  }

  const recommendations: FinancialAnalysis['recommendations'] = [];
  if (savingsRate < 20) {
    recommendations.push({
      title: 'زيادة معدل الادخار',
      description: 'حاول تخصيص 20% على الأقل من دخلك للادخار. ابدأ بتحويل مبلغ ثابت شهرياً.',
      impact: Math.round((20 - savingsRate) * income / 100),
      icon: 'PiggyBank',
    });
  }
  if (categoryMap['الطعام'] && categoryMap['الطعام'] > income * 0.15) {
    recommendations.push({
      title: 'تحسين إنفاق الطعام',
      description: 'إنفاقك على الطعام مرتفع. جرب الطبخ في المنزل والتخطيط للوجبات لتوفير حتى 30%.',
      impact: Math.round(categoryMap['الطعام'] * 0.3),
      icon: 'UtensilsCrossed',
    });
  }
  if (categoryMap['التسوق'] && categoryMap['التسوق'] > income * 0.1) {
    recommendations.push({
      title: 'تقليل التسوق',
      description: 'إنفاقك على التسوق مرتفع. طبّق قاعدة الانتظار 48 ساعة قبل الشراء غير الضروري.',
      impact: Math.round(categoryMap['التسوق'] * 0.4),
      icon: 'ShoppingBag',
    });
  }
  if (goals.length === 0) {
    recommendations.push({
      title: 'تحديد أهداف مالية',
      description: 'ليس لديك أهداف مالية محددة. ابدأ بتحديد هدف ادخار طويل المدى لتحفيز نفسك.',
      impact: 0,
      icon: 'Target',
    });
  }
  recommendations.push({
    title: 'إنشاء صندوق طوارئ',
    description: 'خصص مبلغاً يعادل 3-6 أشهر من مصاريفك كصندوق طوارئ للحالات غير المتوقعة.',
    impact: Math.round(expenses * 3),
    icon: 'Shield',
  });

  const weeklyComparison: FinancialAnalysis['weeklyComparison'] = [];
  for (let w = 3; w >= 0; w--) {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - w * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    const thisWeekExpenses = transactions
      .filter(t => {
        const d = new Date(t.date);
        return d >= weekStart && d <= weekEnd && t.type === 'expense';
      })
      .reduce((s, t) => s + t.amount, 0);
    const prevWeekStart = new Date(weekStart);
    prevWeekStart.setDate(weekStart.getDate() - 7);
    const prevWeekEnd = new Date(prevWeekStart);
    prevWeekEnd.setDate(prevWeekStart.getDate() + 6);
    const lastWeekExpenses = transactions
      .filter(t => {
        const d = new Date(t.date);
        return d >= prevWeekStart && d <= prevWeekEnd && t.type === 'expense';
      })
      .reduce((s, t) => s + t.amount, 0);
    weeklyComparison.push({
      week: w === 0 ? 'هذا الأسبوع' : `قبل ${w} أسابيع`,
      thisWeek: thisWeekExpenses,
      lastWeek: lastWeekExpenses,
    });
  }

  const savingsPrediction: FinancialAnalysis['savingsPrediction'] = [];
  for (let m = 0; m < 6; m++) {
    const monthIdx = (currentMonth + m) % 12;
    const projectedSavings = Math.max(0, remaining * (1 + m * 0.03));
    savingsPrediction.push({
      month: arabicMonths[monthIdx],
      amount: Math.round(projectedSavings),
    });
  }

  return {
    healthScore,
    scoreLabel,
    income,
    expenses,
    remaining,
    savingsRate,
    expenseCategories,
    predictedEndOfMonth,
    unusualSpending,
    insights,
    budgetAllocation,
    risks,
    recommendations,
    weeklyComparison,
    savingsPrediction,
  };
}

export function generateAIResponse(message: string, analysis: FinancialAnalysis | null): string {
  const lower = message.toLowerCase();

  if (lower.includes('ادخار') || lower.includes('توفير') || lower.includes('save')) {
    if (analysis) {
      return `بناءً على تحليل وضعك المالي:\n\n• معدل ادخارك الحالي: ${analysis.savingsRate.toFixed(1)}%\n• المتبقي شهرياً: ${formatCurrency(analysis.remaining)}\n\nنصائح لزيادة الادخار:\n1. خصص 20% من دخلك للادخار أولاً قبل أي مصروف\n2. راجع اشتراكاتك الشهرية وألغِ غير الضرورية\n3. استخدم تطبيق ميزانية لتتبع كل ريال تصرفه\n4. حوّل المبلغ تلقائياً لحساب ادخار عند استلام الراتب`;
    }
    return 'للادخار بفعالية، اتبع قاعدة 50/30/20: 50% للاحتياجات، 30% للرغبات، و20% للادخار. ابدأ بتحويل مبلغ ثابت شهرياً لحساب ادخار منفصل.';
  }

  if (lower.includes('ميزانية') || lower.includes('budget')) {
    return `إعداد ميزانية ذكية:\n\n1. احسب دخلك الشهري الإجمالي\n2. حدد المصاريف الثابتة (إيجار، فواتير)\n3. خصص مبلغاً للمتغيرات (طعام، ترفيه)\n4. اترك 20% للادخار والطوارئ\n5. راجع ميزانيتك أسبوعياً\n\nاستخدم ميزانية الصفر: كل ريال يجب أن يكون له وظيفة محددة.`;
  }

  if (lower.includes('استثمار') || lower.includes('invest')) {
    return `الاستثمار للمبتدئين في السعودية:\n\n1. ابدأ بصندوق الطوارئ أولاً (3-6 أشهر مصاريف)\n2. استخدم منصة "أصيل" أو "تمرة" للاستثمار الميسر\n3. فكر في الصناديق المتوازية للمبتدئين\n4. لا تستثمر مالاً تحتاجه خلال 3 سنوات\n5. diversify - لا تضع كل مبلغك في استثمار واحد\n\nتنبيه: الاستثمار ينطوي على مخاطر، ابدأ بمبالغ صغيرة.`;
  }

  if (lower.includes('دين') || lower.includes('قرض') || lower.includes('debt')) {
    return `إدارة الديون بذكاء:\n\n1. رتّب ديونك من الأعلى فائدة للأقل\n2. استخدم طريقة "كرة الثلج": ابدأ بأصغر دين\n3. ادفع أكثر من الحد الأدنى شهرياً\n4. لا تأخذ ديناً جديداً لسداد القديم\n5. فاوض على معدلات الفائدة مع البنوك\n\nالهدف: التخلص من الديون عالية الفائدة أولاً.`;
  }

  if (lower.includes('هدف') || lower.includes('goal')) {
    return `تحديد أهداف مالية بذكاء (نظام SMART):\n\n• محدد: "أدخر 50,000 ر.س" وليس "أدخر مالاً"\n• قابل للقياس: حدد المبلغ بالضبط\n• قابل للتحقيق: بناءً على دخلك\n• واقعي: لا تضغط على نفسك أكثر من اللازم\n• محدد بوقت: "خلال 12 شهراً"\n\nقسّم الهدف الكبير إلى خطوات شهرية صغيرة.`;
  }

  if (lower.includes('إنفاق') || lower.includes('مصاريف') || lower.includes('spend')) {
    if (analysis && analysis.expenseCategories.length > 0) {
      const top = analysis.expenseCategories[0];
      return `أعلى فئة إنفاق لديك هي "${top.name}" بنسبة ${top.percentage.toFixed(1)}% من إجمالي مصاريفك (${formatCurrency(top.amount)}).\n\nنصائح لتقليل الإنفاق:\n1. تتبع كل مصروف يومياً\n2. استخدم قاعدة 48 ساعة قبل الشراء\n3. ابحث عن بدائل أرخص\n4. قارن الأسعار قبل الشراء`;
    }
    return 'لتقليل الإنفاق: تتبع مصاريفك يومياً، ميز بين الحاجات والرغبات، استخدم قاعدة الانتظار 48 ساعة قبل الشراء غير الضروري.';
  }

  if (lower.includes('تقاعد') || lower.includes('retire')) {
    return `التخطيط للتقاعد في السعودية:\n\n1. اشترك في نظام التأمينات الاجتماعية مبكراً\n2. ادخر 15% من دخلك للتقاعد\n3. استثمر في صناديق التقاعد\n4. فكر في عقارات للدخل السلبي\n5. لا تعتمد على مصدر دخل واحد فقط\n\nالقاعدة: كلما بدأت مبكراً، احتجت مبلغاً أقل شهرياً.`;
  }

  if (lower.includes('صحة') && lower.includes('مال')) {
    return `الصحة المالية تعني:\n• القدرة على تغطية المصاريف الشهرية\n• وجود صندوق طوارئ\n• معدل ادخار 20%+\n• عدم وجود ديون عالية\n• التخطيط للمستقبل\n\nحافظ على صحتك المالية بمراجعة دورية لتقييمك.`;
  }

  return `أنا مساعدك المالي الذكي. يمكنني مساعدتك في:\n\n• تحليل إنفاقك وتوفير المال\n• إعداد ميزانية شخصية\n• نصائح الاستثمار والادخار\n• إدارة الديون\n• تحديد أهداف مالية\n• التخطيط للتقاعد\n\nاطرح سؤالك بتفاصيل أكثر وسأقدم لك نصائح مخصصة بناءً على وضعك المالي.`;
}
