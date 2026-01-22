import React, { useState, useEffect, useMemo } from 'react';
import { 
  Thermometer, FlaskConical, ShieldAlert, Dna, Settings, 
  RefreshCw, Zap, Microscope, ChevronRight, BarChart3, Binary, Waves, Biohazard, BrainCircuit, Activity, Database, FlaskRound
} from 'lucide-react';
import { CellState, AdvancedMetrics, SignalData } from './types';
import { MetricCard as MC } from './components/MetricCard';
import { SignalChart as SC } from './components/SignalChart';
import { CellVisualizer as CV } from './components/CellVisualizer';
import { PathologyEngine } from './components/PathologyEngine';

const App: React.FC = () => {
  const [state, setState] = useState<CellState>(CellState.HOMEOSTASIS);
  const [metrics, setMetrics] = useState<AdvancedMetrics>({
    temperature: 37.05, ph: 7.38, atp: 4.2, ros: 1.1, ca2: 102.5, membranePotential: -155.0,
    mutationRisk: 0.005, glucoseUptake: 2.1, proteinMisfolding: 0.02,
    cytosolicViscosity: 1.2, mitochondrialFractal: 1.88
  });

  const [signalHistory, setSignalHistory] = useState<SignalData[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => {
        const isStressed = state !== CellState.HOMEOSTASIS;
        return {
          ...prev,
          temperature: 37.0 + (Math.random() - 0.5) * (isStressed ? 0.3 : 0.05),
          atp: Math.max(0.1, prev.atp + (isStressed ? -0.05 : (Math.random() - 0.5) * 0.02)),
          ros: Math.max(0.1, prev.ros + (state === CellState.OXIDATIVE_PEROXIDATION ? 0.3 : isStressed ? 0.12 : (Math.random() - 0.5) * 0.04)),
          mutationRisk: Math.min(1.0, prev.mutationRisk + (state === CellState.ONCOGENIC_DYSPLASIA ? 0.01 : 0.0001))
        };
      });

      setSignalHistory(prev => {
        const newData = {
          time: new Date().toLocaleTimeString(),
          amplitude: 45 + Math.random() * (state === CellState.HOMEOSTASIS ? 15 : 55),
          noise: 5 + Math.random() * (state === CellState.OXIDATIVE_PEROXIDATION ? 35 : 12),
          frequency: 1.0
        };
        const next = [...prev, newData];
        return next.length > 25 ? next.slice(1) : next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [state]);

  const labs = [
    { 
      name: 'Oncology', 
      icon: <Biohazard size={14} className="text-rose-500" />,
      items: [
        { label: 'Oncogenic Dysplasia', state: CellState.ONCOGENIC_DYSPLASIA },
        { label: 'Metastatic Blebbing', state: CellState.METASTATIC_BLEBBING }
      ]
    },
    { 
      name: 'Metabolism', 
      icon: <Zap size={14} className="text-amber-500" />,
      items: [
        { label: 'Mito Fragmentation', state: CellState.MITO_FRAGMENTATION },
        { label: 'Oxidative Damage', state: CellState.OXIDATIVE_PEROXIDATION }
      ]
    },
    { 
      name: 'Structure', 
      icon: <BrainCircuit size={14} className="text-purple-500" />,
      items: [
        { label: 'Proteotoxic Stress', state: CellState.PROTEOTOXIC_AGGREGATION },
        { label: 'Cytoskeletal Collapse', state: CellState.FILAMENTARY_COLLAPSE }
      ]
    },
    { 
      name: 'Genetics', 
      icon: <Dna size={14} className="text-emerald-500" />,
      items: [
        { label: 'Epigenetic Remodel', state: CellState.EPIGENETIC_REMODELING },
        { label: 'Senescent Drift', state: CellState.SENESCENT_HYPERTROPHY }
      ]
    }
  ];

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#01030d] text-slate-100 font-['Inter']">
      {/* HUD Header - Fixed Height */}
      <header className="h-20 shrink-0 px-8 flex items-center justify-between border-b border-white/5 bg-slate-950/90 backdrop-blur-xl z-[100] shadow-xl">
        <div className="flex items-center gap-6">
          <div className="p-2.5 bg-cyan-600 rounded-xl shadow-[0_0_25px_rgba(8,145,178,0.4)]">
            <Microscope className="text-white w-6 h-6" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-xl font-black outfit uppercase tracking-tight leading-none">
              Lumi<span className="text-cyan-400">Cell</span> <span className="text-slate-500 font-light ml-1">Analytical Core</span>
            </h1>
            <div className="flex items-center gap-3 text-[9px] mono text-slate-500 font-bold uppercase tracking-[0.3em] mt-1">
              <span>Station: Lab_Unit_04-X</span>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-green-600">Sync_Active</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end mr-4">
            <span className="text-[9px] mono text-slate-500 uppercase font-black tracking-widest mb-0.5">Imaging_Mode</span>
            <div className="px-4 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] mono font-bold text-cyan-400 tracking-wider">
              QUANTUM_SPECTRAL_v3
            </div>
          </div>
          <button 
            onClick={() => setState(CellState.HOMEOSTASIS)}
            className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all hover:scale-105 active:scale-95 group"
          >
            <RefreshCw className="group-hover:rotate-180 transition-transform duration-700" size={18} />
          </button>
        </div>
      </header>

      {/* Main Grid - Flexible Height */}
      <main className="flex-1 min-h-0 w-full p-6 grid grid-cols-12 gap-6">
        
        {/* Left Col: Lab Selector - Scrollable if needed */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-6 min-h-0">
          <div className="clinical-glass rounded-[32px] p-6 flex flex-col gap-6 h-full overflow-hidden border border-white/5">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4 shrink-0">
              <FlaskRound size={16} className="text-slate-400" />
              <h3 className="text-[11px] mono font-bold text-slate-500 uppercase tracking-[0.3em]">Protocol_Input</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-1 space-y-6 custom-scrollbar">
              {labs.map((lab, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex items-center gap-2 px-1">
                    {lab.icon}
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{lab.name}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {lab.items.map((item) => (
                      <button 
                        key={item.state}
                        onClick={() => setState(item.state)}
                        className={`text-left py-2.5 px-4 rounded-2xl border text-[10px] font-bold transition-all flex items-center justify-between group
                          ${state === item.state ? 'bg-white text-slate-950 border-white shadow-lg scale-[1.02]' : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10 hover:border-white/20'}`}
                      >
                        <span className="truncate pr-2">{item.label}</span>
                        <ChevronRight size={12} className={`shrink-0 transition-transform ${state === item.state ? 'translate-x-1' : 'group-hover:translate-x-1 opacity-50'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div className="pt-2">
                 <button 
                    onClick={() => setState(CellState.HOMEOSTASIS)}
                    className={`w-full text-left py-2.5 px-4 rounded-2xl border text-[10px] font-bold transition-all flex items-center justify-between group
                      ${state === CellState.HOMEOSTASIS ? 'bg-white text-slate-950 border-white shadow-lg scale-[1.02]' : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10 hover:border-white/20'}`}
                  >
                    <span>Homeostatic Baseline</span>
                    <Activity size={12} />
                  </button>
              </div>
            </div>
          </div>
        </div>

        {/* Center Col: Visualizer & Metrics */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-6 min-h-0">
          <div className="flex-1 relative rounded-[40px] border border-white/10 overflow-hidden shadow-2xl bg-black min-h-[300px]">
            <CV state={state} metrics={metrics} showOverlays={true} />
            <div className="absolute top-6 right-6 z-30">
              <div className="clinical-glass px-5 py-3 rounded-2xl flex items-center gap-4 border border-white/10 shadow-xl">
                <Activity size={14} className="text-rose-500" />
                <div className="flex flex-col">
                  <span className="text-[8px] mono font-bold text-slate-500 uppercase tracking-widest">Stability_Idx</span>
                  <span className="text-xs font-black text-white mono">{(100 - metrics.mutationRisk * 100).toFixed(3)}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 shrink-0">
            <MC label="Thermal" value={metrics.temperature.toFixed(2)} unit="°C" icon={<Thermometer />} />
            <MC label="pH" value={metrics.ph.toFixed(2)} unit="pH" icon={<FlaskConical />} />
            <MC label="ATP" value={metrics.atp.toFixed(2)} unit="mM" icon={<Zap />} status={metrics.atp < 2.0 ? 'critical' : 'nominal'} />
            <MC label="Oxidation" value={metrics.ros.toFixed(2)} unit="idx" icon={<ShieldAlert />} status={metrics.ros > 6.0 ? 'critical' : metrics.ros > 3.0 ? 'warning' : 'nominal'} />
          </div>
        </div>

        {/* Right Col: Diagnostics & Waves */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-6 min-h-0">
          <div className="flex-[3] min-h-0 overflow-hidden">
            <PathologyEngine state={state} metrics={metrics} />
          </div>
          
          <div className="flex-[2] clinical-glass rounded-[32px] p-6 flex flex-col gap-4 min-h-0">
            <div className="flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <BarChart3 className="text-slate-500 w-4 h-4" />
                <h3 className="text-[11px] mono font-bold text-slate-500 uppercase tracking-[0.3em]">Signal_Waves</h3>
              </div>
              <div className="px-3 py-0.5 bg-green-500/10 border border-green-500/20 rounded-full text-[9px] mono font-black text-green-500 uppercase">Live</div>
            </div>
            <div className="flex-1 min-h-0">
              <SC data={signalHistory} color="#22d3ee" />
            </div>
            <div className="grid grid-cols-2 gap-3 shrink-0">
              <div className="p-3 bg-slate-900/40 rounded-xl border border-white/5">
                <span className="text-[8px] mono text-slate-500 block mb-0.5 uppercase tracking-widest font-bold">Flux_v</span>
                <span className="text-sm font-black text-white outfit tracking-tighter">42.8 <span className="text-[8px] text-slate-600">μV</span></span>
              </div>
              <div className="p-3 bg-slate-900/40 rounded-xl border border-white/5">
                <span className="text-[8px] mono text-slate-500 block mb-0.5 uppercase tracking-widest font-bold">Ent_Drift</span>
                <span className="text-sm font-black text-white outfit tracking-tighter">0.02 <span className="text-[8px] text-slate-600">δ</span></span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Fixed Height */}
      <footer className="h-16 shrink-0 border-t border-white/5 flex items-center justify-center bg-slate-950/50 backdrop-blur-md px-12">
        <p className="text-[10px] mono text-slate-600 font-bold uppercase tracking-[1em] text-center w-full truncate">
          TSA Competition // LumiCell Analytical Core // Unit Alpha-9-Twin
        </p>
      </footer>
    </div>
  );
};

export default App;