import { supabase } from './supabase';

const expenseCategories = ['الإسكان', 'الطعام', 'المواصلات', 'التسوق', 'الترفيه', 'الصحة', 'الفواتير', 'التعليم', 'أخرى'];

const merchants: Record<string, string[]> = {
  'الطعام': ['مرسول', 'هنقرستيشن', 'كارفور', 'تموين', 'الفرع'],
  'المواصلات': ['أوبر', 'كريم', 'أرامكو', 'بترومين'],
  'التسوق': ['نون', 'أمازون', 'جرير', 'إكسترا', 'ستاربكس'],
  'الترفيه': ['سينما', 'مقهى', 'نادي رياضي', 'بولينج'],
  'الصحة': ['صيدلية النهد', 'مستشفى', 'عيادة'],
  'الفواتير': ['كهرباء', 'مياه', 'اتصالات', 'إنترنت'],
  'الإسكان': ['الإيجار', 'الصيانة'],
  'التعليم': ['رسوم تعليم', 'دورات'],
  'أخرى': ['متفرقات'],
};

const descriptions: Record<string, string[]> = {
  'الطعام': ['طلب طعام', 'بقالة', 'مطعم', 'قهوة'],
  'المواصلات': ['وقود', 'مواصلات', 'توصيل'],
  'التسوق': ['ملابس', 'إلكترونيات', 'منزل'],
  'الترفيه': ['تذاكر', 'اشتراك', 'خروج'],
  'الصحة': ['دواء', 'فحص', 'مستلزمات'],
  'الفواتير': ['فاتورة', 'رسوم'],
  'الإسكان': ['إيجار شهري', 'صيانة'],
  'التعليم': ['دورة', 'كتب'],
  'أخرى': ['مصروف'],
};

function randomAmount(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

export async function seedUserData(userId: string, monthlyIncome: number) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const transactions: { user_id: string; amount: number; type: string; category: string; description: string; merchant: string; date: string }[] = [];

  transactions.push({
    user_id: userId,
    amount: monthlyIncome,
    type: 'income',
    category: 'راتب',
    description: 'الراتب الشهري',
    merchant: 'الشركة',
    date: new Date(currentYear, currentMonth, 1).toISOString().split('T')[0],
  });

  const numExpenses = 35 + Math.floor(Math.random() * 15);
  for (let i = 0; i < numExpenses; i++) {
    const cat = expenseCategories[Math.floor(Math.random() * expenseCategories.length)];
    const merchantList = merchants[cat] || ['متجر'];
    const descList = descriptions[cat] || ['مصروف'];
    const day = 1 + Math.floor(Math.random() * Math.min(daysInMonth, now.getDate()));
    let amount: number;
    switch (cat) {
      case 'الإسكان': amount = randomAmount(2000, 5000); break;
      case 'الطعام': amount = randomAmount(30, 300); break;
      case 'المواصلات': amount = randomAmount(50, 200); break;
      case 'التسوق': amount = randomAmount(100, 800); break;
      case 'الترفيه': amount = randomAmount(50, 400); break;
      case 'الصحة': amount = randomAmount(50, 500); break;
      case 'الفواتير': amount = randomAmount(100, 600); break;
      case 'التعليم': amount = randomAmount(200, 1000); break;
      default: amount = randomAmount(20, 200);
    }
    transactions.push({
      user_id: userId,
      amount,
      type: 'expense',
      category: cat,
      description: descList[Math.floor(Math.random() * descList.length)],
      merchant: merchantList[Math.floor(Math.random() * merchantList.length)],
      date: new Date(currentYear, currentMonth, day).toISOString().split('T')[0],
    });
  }

  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const lastDaysInMonth = new Date(lastYear, lastMonth + 1, 0).getDate();
  const lastNumExpenses = 30 + Math.floor(Math.random() * 10);
  for (let i = 0; i < lastNumExpenses; i++) {
    const cat = expenseCategories[Math.floor(Math.random() * expenseCategories.length)];
    const merchantList = merchants[cat] || ['متجر'];
    const descList = descriptions[cat] || ['مصروف'];
    const day = 1 + Math.floor(Math.random() * lastDaysInMonth);
    let amount: number;
    switch (cat) {
      case 'الإسكان': amount = randomAmount(2000, 5000); break;
      case 'الطعام': amount = randomAmount(30, 250); break;
      case 'المواصلات': amount = randomAmount(50, 180); break;
      case 'التسوق': amount = randomAmount(100, 600); break;
      case 'الترفيه': amount = randomAmount(50, 350); break;
      case 'الصحة': amount = randomAmount(50, 400); break;
      case 'الفواتير': amount = randomAmount(100, 500); break;
      case 'التعليم': amount = randomAmount(200, 800); break;
      default: amount = randomAmount(20, 150);
    }
    transactions.push({
      user_id: userId,
      amount,
      type: 'expense',
      category: cat,
      description: descList[Math.floor(Math.random() * descList.length)],
      merchant: merchantList[Math.floor(Math.random() * merchantList.length)],
      date: new Date(lastYear, lastMonth, day).toISOString().split('T')[0],
    });
  }

  const { error: txError } = await supabase.from('transactions').insert(transactions);
  if (txError) console.error('Seed transactions error:', txError);

  const goals = [
    { user_id: userId, title: 'صندوق الطوارئ', target_amount: 50000, current_amount: 18500, category: 'ادخار', target_date: new Date(now.getFullYear() + 1, now.getMonth()).toISOString().split('T')[0], status: 'active', icon: 'Shield' },
    { user_id: userId, title: 'السفر إلى ماليزيا', target_amount: 20000, current_amount: 7200, category: 'سفر', target_date: new Date(now.getFullYear(), now.getMonth() + 6).toISOString().split('T')[0], status: 'active', icon: 'Plane' },
    { user_id: userId, title: 'شراء سيارة', target_amount: 80000, current_amount: 25000, category: 'أصول', target_date: new Date(now.getFullYear() + 1, now.getMonth()).toISOString().split('T')[0], status: 'active', icon: 'Car' },
  ];
  const { error: goalError } = await supabase.from('goals').insert(goals);
  if (goalError) console.error('Seed goals error:', goalError);

  const budgets = [
    { user_id: userId, category: 'الإسكان', limit_amount: 5000, spent_amount: 4500, month: currentMonth + 1, year: currentYear },
    { user_id: userId, category: 'الطعام', limit_amount: 2000, spent_amount: 1650, month: currentMonth + 1, year: currentYear },
    { user_id: userId, category: 'المواصلات', limit_amount: 800, spent_amount: 920, month: currentMonth + 1, year: currentYear },
    { user_id: userId, category: 'التسوق', limit_amount: 1500, spent_amount: 1100, month: currentMonth + 1, year: currentYear },
    { user_id: userId, category: 'الترفيه', limit_amount: 600, spent_amount: 480, month: currentMonth + 1, year: currentYear },
    { user_id: userId, category: 'الفواتير', limit_amount: 700, spent_amount: 520, month: currentMonth + 1, year: currentYear },
  ];
  const { error: budgetError } = await supabase.from('budgets').insert(budgets);
  if (budgetError) console.error('Seed budgets error:', budgetError);

  const bills = [
    { user_id: userId, name: 'إيجار المنزل', amount: 4500, due_date: new Date(currentYear, currentMonth, 28).toISOString().split('T')[0], category: 'الإسكان', status: 'pending', recurring: true },
    { user_id: userId, name: 'فاتورة الكهرباء', amount: 350, due_date: new Date(currentYear, currentMonth, now.getDate() + 3).toISOString().split('T')[0], category: 'الفواتير', status: 'pending', recurring: true },
    { user_id: userId, name: 'اشتراك الإنترنت', amount: 300, due_date: new Date(currentYear, currentMonth, now.getDate() + 5).toISOString().split('T')[0], category: 'الفواتير', status: 'pending', recurring: true },
    { user_id: userId, name: 'فاتورة الجوال', amount: 150, due_date: new Date(currentYear, currentMonth, now.getDate() + 7).toISOString().split('T')[0], category: 'الفواتير', status: 'pending', recurring: true },
    { user_id: userId, name: 'قسط السيارة', amount: 1200, due_date: new Date(currentYear, currentMonth, 15).toISOString().split('T')[0], category: 'أقساط', status: 'pending', recurring: true },
  ];
  const { error: billError } = await supabase.from('bills').insert(bills);
  if (billError) console.error('Seed bills error:', billError);

  const monthNames = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  const notifications = [
    { user_id: userId, type: 'warning', title: 'تجاوز ميزانية المواصلات', message: 'لقد تجاوزت ميزانية المواصلات بنسبة 15% هذا الشهر. راجع مصاريفك.', read: false, icon: 'AlertTriangle' },
    { user_id: userId, type: 'info', title: 'فواتير مستحقة قريباً', message: 'لديك 3 فواتير مستحقة الدفع خلال الأسبوع القادم بقيمة 800 ر.س', read: false, icon: 'Bell' },
    { user_id: userId, type: 'success', title: 'تحقيق 37% من هدفك', message: 'أنت على الطريق الصحيح لتحقيق هدف صندوق الطوارئ. أحسنت!', read: false, icon: 'Trophy' },
    { user_id: userId, type: 'info', title: 'تقرير شهر جديد', message: 'تقريرك المالي لشهر ' + monthNames[currentMonth] + ' جاهز للمراجعة.', read: true, icon: 'FileText' },
    { user_id: userId, type: 'warning', title: 'إنفاق غير معتاد', message: 'رصدنا ارتفاعاً في إنفاق التسوق مقارنة بالشهر الماضي بنسبة 40%.', read: false, icon: 'TrendingUp' },
  ];
  const { error: notifError } = await supabase.from('notifications').insert(notifications);
  if (notifError) console.error('Seed notifications error:', notifError);

  const achievements = [
    { user_id: userId, title: 'أول خطوة', description: 'أكملت إعداد ملفك المالي', icon: 'Footprints', category: 'بداية' },
    { user_id: userId, title: 'مستكشف الميزانية', description: 'أنشأت أول ميزانية لك', icon: 'Compass', category: 'ميزانية' },
    { user_id: userId, title: 'صاحب الهدف', description: 'حددت أول هدف مالي لك', icon: 'Target', category: 'أهداف' },
  ];
  const { error: achError } = await supabase.from('achievements').insert(achievements);
  if (achError) console.error('Seed achievements error:', achError);
}
