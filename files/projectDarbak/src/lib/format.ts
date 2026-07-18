export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ar-SA', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(amount) + ' ر.س';
}

export function formatNumber(amount: number): string {
  return new Intl.NumberFormat('ar-SA', {
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat('ar-SA', {
    style: 'percent',
    maximumFractionDigits: 1,
  }).format(value / 100);
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ar-SA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

export function formatShortDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ar-SA', {
    day: 'numeric',
    month: 'short',
  }).format(d);
}

export function formatTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ar-SA', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export const arabicMonths = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

export function getMonthName(month: number): string {
  return arabicMonths[month - 1] || '';
}

export function daysUntil(date: string | Date): number {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diff = d.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
