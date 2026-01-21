import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SignalData } from '../types';

interface SignalChartProps {
  data: SignalData[];
  color: string;
}

export const SignalChart: React.FC<SignalChartProps> = ({ data, color }) => {
  return (
    <div className="h-48 w-full bg-slate-900/30 rounded-lg p-2 border border-slate-800/50">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="time" hide />
          <YAxis hide domain={[0, 100]} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', fontSize: '10px' }}
            itemStyle={{ color: color }}
          />
          <Line 
            type="monotone" 
            dataKey="amplitude" 
            stroke={color} 
            strokeWidth={2} 
            dot={false} 
            isAnimationActive={false}
          />
          <Line 
            type="monotone" 
            dataKey="noise" 
            stroke="#475569" 
            strokeWidth={1} 
            dot={false} 
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};