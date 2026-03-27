import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  action?: ReactNode;
}

export function Card({ children, className = '', title, action }: CardProps) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow ${className}`}>
      {(title || action) && (
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          {title && <h3 className="text-lg font-semibold text-slate-900 tracking-tight">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, icon, trend, className = '' }: StatCardProps) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
          {trend && (
            <p className={`mt-2 text-sm font-medium ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.positive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
          {icon}
        </div>
      </div>
    </div>
  );
}