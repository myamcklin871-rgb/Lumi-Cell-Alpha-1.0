import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit: string;
  status?: 'nominal' | 'warning' | 'critical';
  icon: React.ReactNode;
  subValue?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, unit, status = 'nominal', icon, subValue }) => {
  const statusColors = {
    nominal: 'text-cyan-400',
    warning: 'text-amber-400',
    critical: 'text-rose-500'
  };

  const statusBg = {
    nominal: 'bg-cyan-500/10',
    warning: 'bg-amber-500/10',
    critical: 'bg-rose-500/10'
  };

  const statusBorder = {
    nominal: 'group-hover:border-cyan-500/50',
    warning: 'group-hover:border-amber-500/50',
    critical: 'group-hover:border-rose-500/50'
  };

  return (
    <div className={`relative overflow-hidden clinical-glass p-10 rounded-[48px] border border-white/5 group hover:bg-white/10 transition-all duration-700 cursor-default shadow-3xl hover:-translate-y-4 ${statusBorder[status]}`}>
      <div className="flex flex-col h-full justify-between gap-8">
        <div className="flex items-center gap-5">
          <div className={`p-4 rounded-[20px] transition-all group-hover:rotate-12 duration-700 shadow-2xl ${statusBg[status]} ${statusColors[status]}`}>
            {React.cloneElement(icon as React.ReactElement, { size: 28, strokeWidth: 2.5 })}
          </div>
          <span className="text-[12px] font-black text-slate-500 uppercase tracking-[0.3em] group-hover:text-slate-300 transition-colors">{label}</span>
        </div>
        
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline gap-4">
            <span className="text-5xl font-black outfit text-white tracking-tighter group-hover:translate-x-2 transition-transform">{value}</span>
            <span className="text-[13px] font-mono text-slate-600 font-black uppercase tracking-widest">{unit}</span>
          </div>
          {subValue && (
            <span className="text-[11px] mono text-slate-700 font-bold">{subValue}</span>
          )}
        </div>

        <div className="flex items-center justify-between mt-3 pt-6 border-t border-white/5">
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full shadow-[0_0_20px_currentColor] ${status === 'nominal' ? 'text-cyan-500 bg-cyan-500' : status === 'warning' ? 'text-amber-500 bg-amber-500' : 'text-rose-500 bg-rose-500'} ${status !== 'nominal' ? 'animate-pulse' : ''}`}></div>
            <span className="text-[11px] font-mono text-slate-600 font-black uppercase tracking-widest">
              {status === 'nominal' ? 'OPTIMAL' : status === 'warning' ? 'DEVIATION' : 'CRITICAL'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Dynamic Glow Gradient */}
      <div className={`absolute -bottom-16 -right-16 w-32 h-32 rounded-full opacity-10 blur-[50px] transition-all duration-1000 group-hover:scale-150 group-hover:opacity-40 ${status === 'nominal' ? 'bg-cyan-500' : status === 'warning' ? 'bg-amber-500' : 'bg-rose-500'}`}></div>
    </div>
  );
};