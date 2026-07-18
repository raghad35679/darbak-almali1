import { type ReactNode } from 'react';
import { type LucideIcon } from 'lucide-react';

export function Card({ children, className = '', onClick, style }: { children: ReactNode; className?: string; onClick?: () => void; style?: React.CSSProperties }) {
  return (
    <div
      onClick={onClick}
      style={style}
      className={`premium-card p-6 ${className} ${onClick ? 'cursor-pointer' : ''}`}
    >
      {children}
    </div>
  );
}

export function StatCard({
  icon: Icon,
  label,
  value,
  subtitle,
  color = 'saudi',
  trend,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  subtitle?: string;
  color?: 'saudi' | 'beige' | 'white' | 'danger' | 'warning';
  trend?: { value: string; positive: boolean };
}) {
  const colorClasses = {
    saudi: 'bg-saudi-50 text-saudi-500',
    beige: 'bg-beige-100 text-saudi-600',
    white: 'bg-gray-50 text-saudi-500',
    danger: 'bg-red-50 text-red-500',
    warning: 'bg-amber-50 text-amber-500',
  };

  return (
    <Card>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" strokeWidth={2} />
        </div>
        {trend && (
          <span className={`text-sm font-semibold px-2 py-1 rounded-lg ${trend.positive ? 'bg-saudi-50 text-saudi-600' : 'bg-red-50 text-red-500'}`}>
            {trend.value}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-ink-900">{value}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </Card>
  );
}

export function ProgressBar({ value, max, color = 'bg-saudi-500', height = 'h-2' }: { value: number; max: number; color?: string; height?: string }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={`w-full ${height} bg-gray-100 rounded-full overflow-hidden`}>
      <div
        className={`${color} ${height} rounded-full transition-all duration-700 ease-out`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function Badge({ children, variant = 'default' }: { children: ReactNode; variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' }) {
  const variants = {
    default: 'bg-gray-100 text-gray-600',
    success: 'bg-saudi-50 text-saudi-600',
    warning: 'bg-amber-50 text-amber-600',
    danger: 'bg-red-50 text-red-500',
    info: 'bg-blue-50 text-blue-600',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${variants[variant]}`}>
      {children}
    </span>
  );
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}) {
  const variants = {
    primary: 'gradient-saudi text-white shadow-soft-lg hover:shadow-soft-xl',
    secondary: 'bg-saudi-50 text-saudi-600 hover:bg-saudi-100',
    ghost: 'text-saudi-600 hover:bg-saudi-50',
    outline: 'border-2 border-saudi-200 text-saudi-600 hover:bg-saudi-50',
  };
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-2xl font-semibold transition-all duration-300 ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className} no-tap-highlight`}
    >
      {children}
    </button>
  );
}

export function SectionHeader({ title, subtitle, icon: Icon, action }: { title: string; subtitle?: string; icon?: LucideIcon; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="w-10 h-10 rounded-2xl bg-saudi-50 flex items-center justify-center">
            <Icon className="w-5 h-5 text-saudi-500" />
          </div>
        )}
        <div>
          <h2 className="text-xl font-bold text-ink-900">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

export function CircularProgress({ value, size = 120, strokeWidth = 10, color = '#006C35', label, sublabel }: { value: number; size?: number; strokeWidth?: number; color?: string; label?: string; sublabel?: string }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5DDC9"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {label && <span className="text-3xl font-bold text-ink-900">{label}</span>}
        {sublabel && <span className="text-xs text-gray-500 mt-1">{sublabel}</span>}
      </div>
    </div>
  );
}

export function DonutChart({ data, size = 160 }: { data: { name: string; value: number; color: string }[]; size?: number }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const radius = size / 2;
  const strokeWidth = size / 4;
  const innerRadius = radius - strokeWidth;
  const circumference = 2 * Math.PI * innerRadius;
  let offset = 0;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={radius} cy={radius} r={innerRadius} fill="none" stroke="#F0EBE0" strokeWidth={strokeWidth} />
        {data.map((d, i) => {
          const pct = (d.value / total) * 100;
          const dash = (pct / 100) * circumference;
          const circle = (
            <circle
              key={i}
              cx={radius}
              cy={radius}
              r={innerRadius}
              fill="none"
              stroke={d.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              className="transition-all duration-700 ease-out"
            />
          );
          offset += dash;
          return circle;
        })}
      </svg>
    </div>
  );
}

export function BarChart({ data, height = 200 }: { data: { label: string; value: number; color?: string; secondary?: number }[]; height?: number }) {
  const max = Math.max(...data.map(d => Math.max(d.value, d.secondary ?? 0)), 1);

  return (
    <div className="flex items-end justify-between gap-2" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          <div className="w-full flex items-end justify-center gap-1 flex-1">
            {d.secondary !== undefined && (
              <div
                className="flex-1 rounded-t-lg bg-beige-300 transition-all duration-700 ease-out"
                style={{ height: `${(d.secondary / max) * 100}%`, minHeight: '4px' }}
                title={`الشهر الماضي: ${d.secondary}`}
              />
            )}
            <div
              className="flex-1 rounded-t-lg transition-all duration-700 ease-out"
              style={{ height: `${(d.value / max) * 100}%`, minHeight: '4px', backgroundColor: d.color || '#006C35' }}
              title={d.value.toString()}
            />
          </div>
          <span className="text-xs text-gray-500 whitespace-nowrap">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export function LineChart({ data, height = 200, color = '#006C35' }: { data: { label: string; value: number }[]; height?: number; color?: string }) {
  const max = Math.max(...data.map(d => d.value), 1);
  const min = Math.min(...data.map(d => d.value), 0);
  const range = max - min || 1;
  const width = 100;
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1 || 1)) * width;
    const y = height - ((d.value - min) / range) * (height - 20) - 10;
    return { x, y, value: d.value, label: d.label };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }} preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#lineGradient)" />
        <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="1.5" fill={color} />
        ))}
      </svg>
      <div className="flex justify-between mt-2">
        {data.map((d, i) => (
          <span key={i} className="text-xs text-gray-400">{d.label}</span>
        ))}
      </div>
    </div>
  );
}

export function Modal({ open, onClose, children, title }: { open: boolean; onClose: () => void; children: ReactNode; title?: string }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-soft-xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-ink-900">{title}</h3>
            <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400 text-xl">×</span>
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, subtitle }: { icon: LucideIcon; title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-3xl bg-beige-100 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-saudi-400" />
      </div>
      <h3 className="text-lg font-bold text-ink-900 mb-1">{title}</h3>
      {subtitle && <p className="text-sm text-gray-500 max-w-sm">{subtitle}</p>}
    </div>
  );
}
