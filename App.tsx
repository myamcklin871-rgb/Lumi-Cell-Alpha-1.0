import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, Thermometer, FlaskConical, ShieldAlert, Dna, Settings, 
  RefreshCw, Zap, Microscope, AlertCircle, ChevronRight, BarChart3, Binary, Waves, Atom,
  Layers, Info, Database, ClipboardCheck, History, TrendingUp, Cpu, Network, Biohazard, BrainCircuit
} from 'lucide-react';
import { CellState, AdvancedMetrics, SignalData } from './types';
import { MetricCard as MC } from './components/MetricCard';
import { SignalChart as SC } from './components/SignalChart';
import { CellVisualizer as CV } from './components/CellVisualizer';
import { PathologyEngine } from './components/PathologyEngine';

const App: React.FC = () => {
  const [state, setState] = useState<CellState>(CellState.HOMEOSTASIS);
  const [showOverlays, setShowOverlays] = useState(true);
  const [metrics, setMetrics] = useState<AdvancedMetrics>({
    temperature: 37.05, ph: 7.38, atp: 4.2, ros: 1.1, ca2: 102.5, membranePotential: -155.0,
    mutationRisk: 0.005, glucoseUptake: 2.1, proteinMisfolding: 0.02,
    cytosolicViscosity: 1.2, mitochondrialFractal: 1.88
  });

  const [signalHistory, setSignalHistory] = useState<SignalData[]>([]);

  // Simulation Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => {
        const isStressed = state !== CellState.HOMEOSTASIS;
        const factor = state.includes('ONCOGENIC') ? 3.5 : state.includes('MITO') ? 0.7 : 1.3;
        return {
          ...prev,
          temperature: 37.0 + (Math.random() - 0.5) * (isStressed ? 0.7 : 0.08),
          atp: Math.max(0.1, prev.atp + (isStressed ? -0.07 * factor : (Math.random() - 0.5) * 0.05)),
          ros: Math.max(0.1, prev.ros + (isStressed ? 0.28 * factor : (Math.random() - 0.5) * 0.07)),
          mutationRisk: Math.min(1.0, prev.mutationRisk + (state.includes('ONCOGENIC') ? 0.018 : 0.0001)),
          proteinMisfolding: Math.min(1.0, prev.proteinMisfolding + (state.includes('PROTEO') ? 0.02 : 0.0005))
        };
      });

      setSignalHistory(prev => {
        const newData = {
          time: new Date().toLocaleTimeString(),
          amplitude: 50 + (Math.random() - 0.5) * (state === CellState.HOMEOSTASIS ? 18 : 95),
          noise: 12 + Math.random() * 35,
          frequency: 1.0
        };
        const next = [...prev, newData];
        return next.length > 30 ? next.slice(1) : next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [state]);

  const labCategories = [
    { 
      name: 'Oncogenic Suite', 
      icon: <Biohazard className="w-5 h-5 text-rose-500" />,
      color: 'rose',
      states: [CellState.EARLY_ONCOGENIC, CellState.AGGRESSIVE_SUBCLONE, CellState.FATE_INSTABILITY] 
    },
    { 
      name: 'Metabolic Decay', 
      icon: <Zap className="w-5 h-5 text-amber-500" />,
      color: 'amber',
      states: [CellState.MITO_FAILURE, CellState.REDOX_IMBALANCE, CellState.MITO_RESILIENCE_DROP] 
    },
    { 
      name: 'Neural Stress', 
      icon: <BrainCircuit className="w-5 h-5 text-purple-500" />,
      color: 'purple',
      states: [CellState.NEURONAL_INSTABILITY, CellState.PROTEOTOXIC_STRESS, CellState.SYNAPTIC_BREAKDOWN] 
    },
  ];

  const currentLab = useMemo(() => {
    if (state.includes('ONCOGENIC') || state.includes('AGGRESSIVE') || state.includes('FATE')) return labCategories[0];
    if (state.includes('MITO') || state.includes('REDOX')) return labCategories[1];
    if (state.includes('NEURO') || state.includes('PROTEO') || state.includes('SYNAPTIC')) return labCategories[2];
    return { name: 'Homeostasis Lab', color: 'cyan', icon: <Microscope className="w-5 h-5 text-cyan-500" /> };
  }, [state]);

  return (
    <div className={`min-h-screen transition-all duration-[2000ms] font-['Inter'] relative ${
      currentLab.color === 'rose' ? 'bg-[#0f0202]' : 
      currentLab.color === 'amber' ? 'bg-[#0b0801]' : 
      currentLab.color === 'purple' ? 'bg-[#080210]' : 'bg-[#01040e]'
    }`}>
      
      {/* Dynamic Background Fog based on Lab */}
      <div className={`fixed inset-0 pointer-events-none transition-opacity duration-[3000ms] opacity-20 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] ${
        currentLab.color === 'rose' ? 'shadow-[inset_0_0_500px_rgba(244,63,94,0.1)]' : 
        currentLab.color === 'amber' ? 'shadow-[inset_0_0_500px_rgba(251,191,36,0.1)]' : 
        currentLab.color === 'purple' ? 'shadow-[inset_0_0_500px_rgba(168,85,247,0.1)]' : ''
      }`} />

      {/* Header HUD */}
      <header className="border-b border-white/5 bg-slate-950/95 backdrop-blur-3xl h-28 px-16 flex items-center justify-between sticky top-0 z-[100] shadow-[0_10px_60px_rgba(0,0,0,0.9)]">
        <div className="flex items-center gap-10">
          <div className={`p-4 rounded-[28px] transition-all duration-1000 ${
            currentLab.color === 'rose' ? 'bg-rose-600 shadow-[0_0_40px_rgba(225,29,72,0.7)]' : 
            currentLab.color === 'amber' ? 'bg-amber-600 shadow-[0_0_40px_rgba(251,191,36,0.7)]' : 
            currentLab.color === 'purple' ? 'bg-purple-600 shadow-[0_0_40px_rgba(168,85,247,0.7)]' : 
            'bg-cyan-600 shadow-[0_0_40px_rgba(8,145,178,0.7)]'
          }`}>
            <Microscope className="w-8 h-8 text-white" />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold outfit uppercase tracking-tight">Lumi<span className="text-cyan-400">Cell</span> <span className="text-slate-500 font-light ml-1 italic">Diagnostic Core</span></h1>
            <div className="flex items-center gap-5">
              <span className="text-[11px] mono text-slate-500 uppercase tracking-[0.4em] font-bold">Research Unit: 04-X Alpha</span>
              <div className="h-1.5 w-1.5 rounded-full bg-slate-700"></div>
              <span className={`text-[11px] mono font-black uppercase tracking-widest ${
                state === CellState.HOMEOSTASIS ? 'text-green-500' : 'text-rose-500 animate-pulse'
              }`}>
                {state === CellState.HOMEOSTASIS ? 'SYSTEM_OPTIMAL' : 'PATHOLOGY_DETECTED'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-10">
          <div className="flex flex-col items-end gap-1.5">
             <span className="text-[10px] mono text-slate-600 uppercase tracking-[0.5em] font-black">Environmental_Filter</span>
             <div className="flex items-center gap-3">
               <button 
                onClick={() => setShowOverlays(!showOverlays)}
                className={`flex items-center gap-4 px-10 py-3.5 border rounded-[28px] transition-all uppercase tracking-[0.3em] text-[11px] mono font-black shadow-2xl ${
                  showOverlays 
                    ? `bg-${currentLab.color}-500/10 border-${currentLab.color}-500/50 text-${currentLab.color}-400 ring-8 ring-${currentLab.color}-500/5` 
                    : 'bg-white/5 border-white/10 text-slate-600'
                }`}
              >
                <Layers className={`w-5 h-5 ${showOverlays ? 'animate-pulse' : ''}`} />
                {showOverlays ? 'ACTIVE' : 'OFFLINE'}
              </button>
             </div>
          </div>
          <button 
            onClick={() => setState(CellState.HOMEOSTASIS)} 
            className="p-5 border border-white/10 bg-white/5 rounded-[32px] text-slate-500 hover:text-white transition-all hover:bg-white/10 hover:scale-110 active:scale-90 shadow-2xl group"
          >
            <RefreshCw className="w-8 h-8 group-hover:rotate-180 transition-transform duration-1000" />
          </button>
        </div>
      </header>

      <main className="max-w-[2400px] mx-auto p-16 grid grid-cols-12 gap-16 relative">
        
        {/* Left Section: Visualizer and Deterministic Analysis */}
        <div className="col-span-12 xl:col-span-9 space-y-16">
          <div className="grid grid-cols-12 gap-16">
            
            {/* Laboratory Control Center */}
            <div className="col-span-12 lg:col-span-3 clinical-glass rounded-[72px] p-12 border border-white/10 flex flex-col gap-10 overflow-y-auto max-h-[850px] shadow-2xl scrollbar-hide order-2 lg:order-1">
              <div className="flex items-center gap-5 border-b border-white/5 pb-8 mb-4">
                <Database className="w-7 h-7 text-slate-500" />
                <h3 className="text-[14px] font-black text-slate-500 uppercase tracking-[0.6em]">Lab_Protocols</h3>
              </div>
              
              {labCategories.map((cat, idx) => (
                <div key={idx} className="space-y-6">
                  <div className="flex items-center gap-4 pl-4 border-l-4" style={{ borderColor: `var(--tw-${cat.color}-500)` }}>
                    {cat.icon}
                    <p className="text-[13px] font-black text-slate-400 uppercase tracking-widest">{cat.name}</p>
                  </div>
                  <div className="flex flex-col gap-4">
                    {cat.states.map((s) => (
                      <button 
                        key={s} 
                        onClick={() => setState(s)} 
                        className={`text-left py-6 px-8 rounded-[36px] border text-[12px] font-black uppercase tracking-widest transition-all flex items-center justify-between group active:scale-95 ${
                          state === s 
                            ? 'bg-white text-slate-950 border-white shadow-[0_0_60px_rgba(255,255,255,0.4)] scale-[1.05]' 
                            : 'bg-white/5 border-white/5 text-slate-600 hover:bg-white/10 hover:text-slate-100 hover:border-white/20'
                        }`}
                      >
                        {s.replace(/_/g, ' ')} <ChevronRight className={`w-5 h-5 transition-transform ${state === s ? 'translate-x-1' : 'group-hover:translate-x-2 opacity-50'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Microscopic Visualization Node */}
            <div className="col-span-12 lg:col-span-9 h-[850px] rounded-[84px] overflow-hidden border border-white/10 shadow-[0_0_150px_rgba(0,0,0,0.8)] bg-black relative order-1 lg:order-2">
              <CV state={state} metrics={metrics} showOverlays={showOverlays} />
              
              <div className="absolute top-12 right-12 flex flex-col gap-8 items-end z-30">
                <div className="clinical-glass px-8 py-5 rounded-[32px] flex items-center gap-8 border border-white/10 shadow-3xl hover:border-cyan-500/50 transition-all cursor-crosshair">
                  <Waves className="w-6 h-6 text-cyan-400" />
                  <div className="flex flex-col">
                    <span className="text-[11px] mono font-black text-slate-600 uppercase tracking-widest">Membrane_Flux</span>
                    <span className="text-xl mono font-black text-white">{metrics.membranePotential.toFixed(3)} mV</span>
                  </div>
                </div>
                <div className="clinical-glass px-8 py-5 rounded-[32px] flex items-center gap-8 border border-white/10 shadow-3xl hover:border-rose-500/50 transition-all cursor-crosshair">
                  <Biohazard className="w-6 h-6 text-rose-500" />
                  <div className="flex flex-col">
                    <span className="text-[11px] mono font-black text-slate-600 uppercase tracking-widest">Mutation_Risk</span>
                    <span className="text-xl mono font-black text-white">{(metrics.mutationRisk * 100).toFixed(6)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Precision Telemetry Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12">
            <MC label="Thermal Feed" value={metrics.temperature.toFixed(3)} unit="°C" icon={<Thermometer />} />
            <MC label="pH Gradient" value={metrics.ph.toFixed(3)} unit="pH" icon={<FlaskConical />} />
            <MC label="ATP Metabolism" value={metrics.atp.toFixed(3)} unit="mM" icon={<Zap />} status={metrics.atp < 1.5 ? 'critical' : 'nominal'} />
            <MC label="Oxidative Flux" value={metrics.ros.toFixed(3)} unit="idx" icon={<ShieldAlert />} status={metrics.ros > 6.0 ? 'critical' : 'nominal'} />
            <MC label="DNA Instability" value={(metrics.mutationRisk * 100).toFixed(4)} unit="%" icon={<Dna />} status={metrics.mutationRisk > 0.1 ? 'warning' : 'nominal'} />
          </div>
        </div>

        {/* Right Dashboard Sidebar: Molecular Pathology Engine */}
        <div className="col-span-12 xl:col-span-3 space-y-16">
          <PathologyEngine state={state} metrics={metrics} />
          
          {/* Signal Telemetry - Detailed */}
          <div className="clinical-glass rounded-[72px] p-16 border border-white/10 space-y-12 shadow-2xl relative overflow-hidden group">
            <div className={`absolute inset-0 opacity-[0.03] transition-colors duration-1000 bg-${currentLab.color}-500`} />
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-6">
                <BarChart3 className="w-8 h-8 text-slate-500" />
                <h3 className="text-[14px] font-black text-slate-500 uppercase tracking-[0.7em]">Wave_Sync</h3>
              </div>
              <div className="flex items-center gap-4 bg-green-500/10 px-5 py-2.5 rounded-full border border-green-500/40">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                <span className="text-[11px] mono text-green-500 font-black uppercase">LINK_STABLE</span>
              </div>
            </div>
            <SC data={signalHistory} color={state === CellState.HOMEOSTASIS ? '#22d3ee' : '#f43f5e'} />
            <div className="grid grid-cols-1 gap-8 relative z-10">
              <div className="p-8 bg-white/5 rounded-[40px] border border-white/10 flex items-center justify-between group-hover:bg-white/10 transition-colors">
                <div className="flex flex-col gap-2">
                  <p className="text-[11px] mono text-slate-600 uppercase tracking-widest font-bold">Signal_Resolution</p>
                  <p className="text-3xl font-black text-white outfit tracking-tighter">162.8 <span className="text-[14px] text-slate-600 ml-1 font-mono uppercase">μV/Hz</span></p>
                </div>
                <TrendingUp className="w-10 h-10 text-cyan-500/30" />
              </div>
            </div>
          </div>

          {/* Event History / Scientific Log */}
          <div className="p-12 clinical-glass rounded-[72px] border border-white/5 flex flex-col gap-8 shadow-2xl opacity-90 hover:opacity-100 transition-opacity">
               <div className="flex items-center gap-5 border-b border-white/5 pb-6">
                  <History className="w-5 h-5 text-slate-500" />
                  <span className="text-[12px] font-black text-slate-500 uppercase tracking-[0.6em]">Telemetry_Log</span>
               </div>
               <div className="flex flex-col gap-5 max-h-[200px] overflow-y-auto pr-4 scrollbar-hide">
                  <div className="flex items-center justify-between text-[11px] mono border-l-2 border-cyan-500/40 pl-4 py-1">
                    <span className="text-cyan-500/80 font-bold">0.00ms</span>
                    <span className="text-slate-500 uppercase">Handshake_Init_Complete</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] mono border-l-2 border-cyan-500/40 pl-4 py-1">
                    <span className="text-cyan-500/80 font-bold">482ms</span>
                    <span className="text-slate-500 uppercase">Optic_Sync_100%_Accuracy</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] mono border-l-2 border-rose-500/40 pl-4 py-1 animate-pulse">
                    <span className="text-rose-500/80 font-bold">NOW</span>
                    <span className="text-slate-300 uppercase font-black">Scanning_Phenotype: {state}</span>
                  </div>
               </div>
          </div>
        </div>
      </main>

      <footer className="p-24 border-t border-white/5 text-center mt-24 bg-slate-950/40 backdrop-blur-3xl">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all cursor-default">
             <div className="flex items-center gap-3"><Cpu className="w-6 h-6" /><span className="text-[11px] mono uppercase font-bold tracking-[0.5em]">LumiCore_Engine</span></div>
             <div className="flex items-center gap-3"><Atom className="w-6 h-6" /><span className="text-[11px] mono uppercase font-bold tracking-[0.5em]">Quantum_Optics</span></div>
             <div className="flex items-center gap-3"><Network className="w-6 h-6" /><span className="text-[11px] mono uppercase font-bold tracking-[0.5em]">Neural_Processing</span></div>
          </div>
          <span className="text-[14px] font-black text-slate-800 uppercase tracking-[3.5em] block hover:text-slate-600 transition-colors cursor-default">TSA Engineering Design</span>
          <p className="text-[11px] mono text-slate-800 uppercase tracking-widest font-bold">© 2026 LumiCell Bio-Systems Node. Proprietary Engineering Digital Twin.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;