import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit: string;
  status?: 'nominal' | 'warning' | 'critical';
  icon: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, unit, status = 'nominal', icon }) => {
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

  return (
    <div className="clinical-glass p-5 rounded-3xl border border-white/5 group hover:bg-white/10 transition-all hover:-translate-y-1 shadow-xl flex flex-col h-full justify-between">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${statusBg[status]} ${statusColors[status]} transition-transform group-hover:scale-105`}>
          {React.cloneElement(icon as React.ReactElement, { size: 18 })}
        </div>
        <div className={`w-2 h-2 rounded-full ${status === 'nominal' ? 'bg-cyan-500' : status === 'warning' ? 'bg-amber-500' : 'bg-rose-500'} ${status !== 'nominal' ? 'animate-pulse' : ''} shadow-[0_0_10px_currentColor]`}></div>
      </div>
      
      <div className="flex flex-col gap-0.5 overflow-hidden">
        <span className="text-[8px] mono font-bold text-slate-500 uppercase tracking-widest truncate">{label}</span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-black outfit text-white tracking-tighter">{value}</span>
          <span className="text-[9px] mono font-bold text-slate-600 uppercase tracking-wider">{unit}</span>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between opacity-40">
        <span className="text-[7px] mono font-black uppercase tracking-widest">{status}</span>
        <div className="h-1 w-8 bg-slate-900 rounded-full overflow-hidden">
           <div className={`h-full ${status === 'nominal' ? 'bg-cyan-500' : 'bg-rose-500'} w-full`}></div>
        </div>
      </div>
    </div>
  );
};