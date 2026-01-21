import React, { useMemo } from 'react';
import { CellState, AdvancedMetrics } from '../types';
import { Activity, ClipboardCheck, Database, Info, TrendingUp, Zap, Biohazard, BrainCircuit, Target } from 'lucide-react';

interface PathologyEngineProps {
  state: CellState;
  metrics: AdvancedMetrics;
}

export const PathologyEngine: React.FC<PathologyEngineProps> = ({ state, metrics }) => {
  const pathologyData = useMemo(() => {
    // Deterministic scientific rules mapping state to pathway activity
    const isHomeo = state === CellState.HOMEOSTASIS;
    const isMalignant = state.includes('ONCOGENIC') || state.includes('AGGRESSIVE') || state.includes('FATE');
    const isMito = state.includes('MITO') || state.includes('REDOX');
    const isNeuro = state.includes('NEURO') || state.includes('PROTEO') || state.includes('SYNAPTIC');

    return {
      title: isHomeo ? 'Homeostatic Baseline' : 
             isMalignant ? 'Oncogenic Progression' : 
             isMito ? 'Metabolic Dysfunction' : 
             isNeuro ? 'Neuro-Proteotoxic Stress' : 'Anomalous Variant',
      color: isHomeo ? 'cyan' : isMalignant ? 'rose' : isMito ? 'amber' : isNeuro ? 'purple' : 'slate',
      pathways: [
        { name: 'mTOR Signaling', val: isMalignant ? 95 : isHomeo ? 42 : 15, unit: '%' },
        { name: 'Oxidative Phos.', val: isMito ? 12 : isHomeo ? 88 : 45, unit: '%' },
        { name: 'Autophagy Rate', val: isNeuro ? 8 : isHomeo ? 60 : 35, unit: '%' },
        { name: 'Genomic Repair', val: isMalignant ? 5 : isHomeo ? 98 : 75, unit: '%' }
      ],
      description: isHomeo ? "Cellular metabolism is operating within optimal thermodynamic boundaries. ATP/ADP ratio and genomic fidelity are within 1-sigma deviation." :
                   isMalignant ? "Genomic instability threshold breached. Telomerase activation and p53 pathway suppression confirmed via spectral drift analysis." :
                   isMito ? "Bioenergetic collapse signature detected. Mitochondrial fission-fusion equilibrium shifted toward fragmentation with reactive species leakage." :
                   isNeuro ? "Proteotoxic stress confirmed. Accumulation of misfolded protein aggregates impacting synaptic integrity and kinesin-mediated transport." :
                   "Non-standard phenotypic shift. Data points suggest idiopathic differentiation drift and epigenetic noise accumulation."
    };
  }, [state]);

  const labColor = pathologyData.color;

  return (
    <div className={`clinical-glass rounded-[72px] p-16 border transition-all duration-[2000ms] relative overflow-hidden flex flex-col min-h-[480px] shadow-3xl
      ${labColor === 'cyan' ? 'border-cyan-500/20' : `border-${labColor}-500/30 bg-${labColor}-500/5 shadow-${labColor}-500/5`}`}>
      
      {/* Background Graphic */}
      <div className={`absolute top-0 right-0 p-12 opacity-[0.04] pointer-events-none transition-colors`}>
        <Target className={`w-40 h-40 text-${labColor}-500 animate-pulse`} />
      </div>

      <div className="flex items-center gap-6 mb-12 relative z-10">
        <div className={`p-4 rounded-[28px] transition-colors ${labColor === 'cyan' ? 'bg-cyan-500/20 text-cyan-500' : `bg-${labColor}-500/20 text-${labColor}-500`}`}>
          <ClipboardCheck className="w-8 h-8" />
        </div>
        <div className="flex flex-col">
          <h3 className={`text-[15px] font-black uppercase tracking-[0.6em] outfit text-${labColor}-400`}>Pathology_Signature</h3>
          <span className="text-[10px] mono text-slate-600 font-bold uppercase tracking-widest mt-1">Deterministic Processing Unit</span>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col justify-center space-y-12 relative z-10">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
             <div className={`w-3 h-3 rounded-full bg-${labColor}-500 animate-pulse`} />
             <span className="text-[11px] mono text-slate-500 font-black uppercase tracking-[0.4em]">Environmental_Report</span>
          </div>
          <p className="text-white text-3xl font-black leading-[1.6] outfit tracking-tight animate-in fade-in duration-1000">
            {pathologyData.description}
          </p>
        </div>

        <div className="pt-10 border-t border-white/10 space-y-8">
          <div className="flex items-center justify-between opacity-80">
             <div className="flex items-center gap-4">
                <TrendingUp className={`w-5 h-5 text-${labColor}-500`} />
                <span className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-400">Molecular_Pathway_Index</span>
             </div>
             <span className="text-[10px] mono text-slate-600 font-bold uppercase tracking-widest">Real-time Flux</span>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            {pathologyData.pathways.map((p, idx) => (
              <div key={idx} className="space-y-3 group cursor-default">
                <div className="flex justify-between items-end">
                  <span className="text-[11px] mono text-slate-500 uppercase font-black tracking-widest group-hover:text-slate-300 transition-colors">{p.name}</span>
                  <span className={`text-sm font-black text-white outfit`}>{p.val}{p.unit}</span>
                </div>
                <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className={`h-full transition-all duration-1000 bg-${labColor}-500 shadow-[0_0_15px_rgba(34,211,238,0.3)]`} 
                    style={{ 
                      width: `${p.val}%`, 
                      backgroundColor: labColor === 'cyan' ? '#22d3ee' : labColor === 'rose' ? '#f43f5e' : labColor === 'amber' ? '#fbbf24' : '#a855f7' 
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-14 pt-10 border-t border-white/5 flex justify-between items-center opacity-40 hover:opacity-100 transition-all group">
         <div className="flex items-center gap-3">
            <Database className="w-4 h-4" />
            <span className="text-[11px] mono text-slate-500 uppercase tracking-[0.3em] font-black">LumiCore_Registry_2.4.0</span>
         </div>
         <Info className="w-6 h-6 text-slate-500 hover:text-cyan-400 cursor-help transition-colors" />
      </div>
    </div>
  );
};