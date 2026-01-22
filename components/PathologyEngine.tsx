import React, { useMemo } from 'react';
import { CellState, AdvancedMetrics } from '../types';
import { ClipboardCheck, Activity, Database, Info } from 'lucide-react';

interface PathologyEngineProps {
  state: CellState;
  metrics: AdvancedMetrics;
}

export const PathologyEngine: React.FC<PathologyEngineProps> = ({ state, metrics }) => {
  const diagnostic = useMemo(() => {
    switch (state) {
      case CellState.ONCOGENIC_DYSPLASIA:
        return { 
          title: 'Oncogenic Progression', 
          desc: 'Hyperchromasia and nuclear enlargement detected. High-rate genomic instability identified via fractal mapping.',
          color: 'rose', pathways: [92, 45, 18, 12] 
        };
      case CellState.METASTATIC_BLEBBING:
        return { 
          title: 'Metastatic Plasticity', 
          desc: 'High-frequency membrane blebbing. Rho-ROCK signaling hyperactivation suggests incipient invasive transition.',
          color: 'rose', pathways: [98, 30, 10, 5] 
        };
      case CellState.MITO_FRAGMENTATION:
        return { 
          title: 'Metabolic Collapse', 
          desc: 'Network fragmentation identified. ATP synthesis efficiency decoupled from proton motive force.',
          color: 'amber', pathways: [12, 10, 42, 65] 
        };
      case CellState.OXIDATIVE_PEROXIDATION:
        return { 
          title: 'Reactive Stress', 
          desc: 'Superoxide species exceeding buffer threshold. Radical propagation confirmed in lipid membrane bilayer.',
          color: 'purple', pathways: [28, 40, 15, 52] 
        };
      case CellState.PROTEOTOXIC_AGGREGATION:
        return { 
          title: 'Proteostatic Arrest', 
          desc: 'Chaperone saturation reached. Ubiquitin-tagged misfolded aggregates disrupting cytosolic traffic.',
          color: 'purple', pathways: [18, 55, 8, 40] 
        };
      case CellState.FILAMENTARY_COLLAPSE:
        return { 
          title: 'Structural Atrophy', 
          desc: 'Rapid depolymerization of actin-tubulin network. Internal vesicular transport systems rendered inoperative.',
          color: 'blue', pathways: [8, 62, 38, 75] 
        };
      case CellState.EPIGENETIC_REMODELING:
        return { 
          title: 'Chromatin Remodel', 
          desc: 'Widespread H3K27me3 drift. Stochastic transcriptional noise indicates loss of phenotypic lineage fidelity.',
          color: 'green', pathways: [52, 44, 28, 25] 
        };
      case CellState.SENESCENT_HYPERTROPHY:
        return { 
          title: 'Senescent Shift', 
          desc: 'Stable G0/G1 arrest. Pro-inflammatory secretome (SASP) active with significant nuclear expansion.',
          color: 'teal', pathways: [5, 22, 88, 92] 
        };
      default:
        return { 
          title: 'Steady State', 
          desc: 'Baseline homeostatic parameters confirmed. Molecular flux and bioenergetic throughput within 1σ physiological limits.',
          color: 'cyan', pathways: [42, 90, 68, 98] 
        };
    }
  }, [state]);

  const colorHex: any = { rose: '#f43f5e', amber: '#fbbf24', purple: '#a855f7', blue: '#3b82f6', green: '#10b981', teal: '#14b8a6', cyan: '#22d3ee' };

  return (
    <div className="clinical-glass rounded-[32px] p-6 flex flex-col h-full border-t-4 transition-all duration-700 overflow-hidden" style={{ borderTopColor: colorHex[diagnostic.color] }}>
      <div className="flex items-center gap-4 mb-4 shrink-0">
        <div className="p-3 bg-white/5 rounded-2xl">
          <ClipboardCheck size={20} style={{ color: colorHex[diagnostic.color] }} />
        </div>
        <div className="flex flex-col min-w-0">
          <h3 className="text-[10px] mono font-bold text-slate-500 uppercase tracking-[0.3em]">Phenotypic_Report</h3>
          <span className="text-lg font-black outfit text-white tracking-tight truncate">{diagnostic.title}</span>
        </div>
      </div>

      <div className="flex-1 min-h-0 space-y-6 overflow-y-auto custom-scrollbar pr-2">
        <p className="text-xs font-medium text-slate-400 leading-relaxed italic">
          "{diagnostic.desc}"
        </p>

        <div className="space-y-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 text-[9px] mono font-bold text-slate-500 uppercase tracking-widest">
            <Activity size={10} /> Pathway_Analysis
          </div>
          {['mTOR Signal', 'OXPHOS Eff.', 'Autophagy', 'Genome Fid.'].map((label, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                <span>{label}</span>
                <span className="text-white">{diagnostic.pathways[i]}%</span>
              </div>
              <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-1000 ease-out shadow-[0_0_10px_currentColor]" 
                  style={{ width: `${diagnostic.pathways[i]}%`, backgroundColor: colorHex[diagnostic.color] }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center opacity-40 shrink-0">
        <div className="flex items-center gap-2">
          <Database size={10} className="text-slate-500" />
          <span className="text-[8px] mono font-bold uppercase tracking-widest">Reg_V1.2</span>
        </div>
        <Info size={12} className="text-slate-500 hover:text-cyan-400 cursor-help" />
      </div>
    </div>
  );
};