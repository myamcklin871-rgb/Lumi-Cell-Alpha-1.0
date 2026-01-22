import React, { useMemo, useState, useEffect } from 'react';
import { Microscope, Activity, Target, Zap, Waves } from 'lucide-react';
import { CellState, AdvancedMetrics } from '../types';

interface CellVisualizerProps {
  state: CellState;
  metrics: AdvancedMetrics;
  showOverlays?: boolean;
}

export const CellVisualizer: React.FC<CellVisualizerProps> = ({ state, metrics, showOverlays = false }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let frameId: number;
    const animate = () => {
      setTime(prev => prev + 0.01);
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const config = useMemo(() => {
    switch (state) {
      case CellState.ONCOGENIC_DYSPLASIA:
        return { color: '#f43f5e', label: 'MALIGNANT_MORPHOLOGY', scale: 28, nucSize: 95, turbulence: 0.02, chaos: 1.6 };
      case CellState.METASTATIC_BLEBBING:
        return { color: '#e11d48', label: 'INVASIVE_PLASTICITY', scale: 55, nucSize: 75, turbulence: 0.1, chaos: 3.5 };
      case CellState.MITO_FRAGMENTATION:
        return { color: '#fbbf24', label: 'METABOLIC_FAILURE', scale: 18, nucSize: 62, turbulence: 0.015, chaos: 1.2 };
      case CellState.OXIDATIVE_PEROXIDATION:
        return { color: '#a855f7', label: 'OXIDATIVE_FLUX', scale: 14, nucSize: 58, turbulence: 0.18, chaos: 0.9 };
      case CellState.PROTEOTOXIC_AGGREGATION:
        return { color: '#8b5cf6', label: 'PROTEOSTATIC_STRESS', scale: 22, nucSize: 82, turbulence: 0.035, chaos: 1.4 };
      case CellState.FILAMENTARY_COLLAPSE:
        return { color: '#3b82f6', label: 'STRUCTURAL_ATROPHY', scale: 45, nucSize: 72, turbulence: 0.01, chaos: 2.2 };
      case CellState.EPIGENETIC_REMODELING:
        return { color: '#10b981', label: 'GENOMIC_DRIFT', scale: 16, nucSize: 78, turbulence: 0.06, chaos: 2.8 };
      case CellState.SENESCENT_HYPERTROPHY:
        return { color: '#14b8a6', label: 'SENESCENT_EXPANSION', scale: 10, nucSize: 115, turbulence: 0.008, chaos: 0.4 };
      default:
        return { color: '#22d3ee', label: 'HOMEOSTATIC_STEADY', scale: 14, nucSize: 68, turbulence: 0.012, chaos: 0.7 };
    }
  }, [state]);

  const structures = useMemo(() => ({
    mito: Array.from({ length: 20 }).map((_, i) => ({
      id: `m-${i}`, x: 80 + Math.random() * 240, y: 80 + Math.random() * 240,
      rx: 24 + Math.random() * 10, ry: 10 + Math.random() * 5,
      rot: Math.random() * 360, speed: 0.07 + Math.random() * 0.12
    })),
    aggregates: Array.from({ length: 14 }).map((_, i) => ({
      id: `a-${i}`, x: 100 + Math.random() * 200, y: 100 + Math.random() * 200,
      r: 3 + Math.random() * 8, speed: 0.05 + Math.random() * 0.1
    })),
    filaments: Array.from({ length: 12 }).map((_, i) => ({
      id: `f-${i}`, angle: Math.random() * 360, len: 140 + Math.random() * 60
    }))
  }), []);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden transition-all duration-1000 bg-[#00040a]">
      {/* HUD Optics Information Overlay */}
      <div className="absolute top-8 left-8 z-30 flex flex-col gap-3 pointer-events-none">
        <div className="flex items-center gap-3 px-4 py-1.5 bg-black/60 border border-white/10 rounded-xl backdrop-blur-md">
          <Microscope size={14} className="text-cyan-400" />
          <span className="text-[9px] mono font-bold text-slate-400 tracking-[0.3em] uppercase">LumiCell_Optics_5.4</span>
        </div>
        <div className="flex flex-col">
          <h2 className="text-3xl font-black outfit text-white tracking-tight leading-none uppercase">{config.label}</h2>
          <div className="flex items-center gap-4 mt-2 text-slate-500 text-[9px] mono tracking-widest uppercase font-bold">
            <span className="flex items-center gap-1.5"><Target size={12} className="text-cyan-500" /> SCAN: 0.12nm</span>
            <span className="opacity-20">|</span>
            <span className="flex items-center gap-1.5 text-green-500/80"><Activity size={12} /> LIVE_NODE</span>
          </div>
        </div>
      </div>

      <svg className="w-[92%] h-[92%] drop-shadow-[0_0_100px_rgba(0,0,0,1)]" viewBox="0 0 400 400">
        <defs>
          <filter id="membraneFilterHUD">
            <feTurbulence type="fractalNoise" baseFrequency={config.turbulence} numOctaves="4" seed={Math.floor(time * 0.5)}>
              <animate attributeName="baseFrequency" values={`${config.turbulence};${config.turbulence * 1.6};${config.turbulence}`} dur="18s" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" scale={config.scale + Math.sin(time) * 3} />
          </filter>
          <filter id="glowHUD">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <radialGradient id="organelleGlowHUD">
            <stop offset="0%" stopColor={config.color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={config.color} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Inner Cytosol Glow */}
        <circle cx="200" cy="200" r="185" fill={config.color} opacity="0.06" filter="url(#glowHUD)" />

        {/* Structural Filaments (Depolymerized in Collapse) */}
        {state !== CellState.FILAMENTARY_COLLAPSE && (
          <g opacity="0.08" stroke={config.color} strokeWidth="1" fill="none">
            {structures.filaments.map(f => (
              <line key={f.angle} x1="200" y1="200" 
                    x2={200 + Math.cos(f.angle + time * 0.02) * f.len} 
                    y2={200 + Math.sin(f.angle + time * 0.02) * f.len} 
                    strokeDasharray="4 8" />
            ))}
          </g>
        )}

        {/* Cellular Membrane Interface */}
        <g filter="url(#membraneFilterHUD)">
          <path 
            d="M200,25 C365,25 385,100 385,200 C385,300 365,375 200,375 C35,375 15,300 15,200 C15,100 35,25 200,25" 
            fill="none" stroke={config.color} strokeWidth="5" strokeOpacity="0.25"
          />
          <path 
            d="M200,25 C365,25 385,100 385,200 C385,300 365,375 200,375 C35,375 15,300 15,200 C15,100 35,25 200,25" 
            fill="none" stroke={config.color} strokeWidth="1.5" strokeOpacity="0.75" strokeDasharray="3, 10"
          />
        </g>

        {/* Organelle Simulation: Mitochondria */}
        <g>
          {structures.mito.map((m) => {
            const isFrag = state === CellState.MITO_FRAGMENTATION;
            const sizeMod = isFrag ? 0.35 : 1.0;
            const offsetX = Math.sin(time * m.speed) * 12 * config.chaos;
            const offsetY = Math.cos(time * m.speed) * 12 * config.chaos;
            return (
              <g key={m.id} transform={`translate(${m.x + offsetX}, ${m.y + offsetY}) rotate(${m.rot + time * 10})`} opacity={isFrag ? 0.3 : 0.8}>
                <ellipse cx="0" cy="0" rx={m.rx * sizeMod} ry={m.ry * sizeMod} fill="none" stroke={config.color} strokeWidth="1.2" strokeOpacity="0.6" />
                <path d={`M-${(m.rx * sizeMod) / 1.5},0 Q0,${m.ry * sizeMod} ${(m.rx * sizeMod) / 1.5},0`} stroke={config.color} strokeWidth="0.4" fill="none" strokeOpacity="0.3" />
              </g>
            );
          })}
        </g>

        {/* Pathology-Specific: Protein Aggregates */}
        {state === CellState.PROTEOTOXIC_AGGREGATION && (
          <g opacity="0.5" fill={config.color} filter="url(#glowHUD)">
            {structures.aggregates.map(a => (
              <circle key={a.id} cx={a.x + Math.sin(time * a.speed) * 15} cy={a.y + Math.cos(time * a.speed) * 15} r={a.r} />
            ))}
          </g>
        )}

        {/* Nucleus: Central Intelligence Node */}
        <g transform={`translate(${200 + Math.sin(time * 0.35) * 4}, ${200 + Math.cos(time * 0.35) * 4})`}>
          <circle r={config.nucSize} fill={config.color} opacity="0.12" filter="url(#glowHUD)" />
          <circle r={config.nucSize - 10} fill="none" stroke={config.color} strokeWidth="3" strokeOpacity="0.65" strokeDasharray={state === CellState.HOMEOSTASIS ? "none" : "10 10"} />
          <circle r="30" fill={config.color} opacity="0.7">
            <animate attributeName="r" values="26;34;26" dur={state === CellState.EPIGENETIC_REMODELING ? "1.2s" : "5s"} repeatCount="indefinite" />
          </circle>
          <path d="M-20,0 Q0,20 20,0 Q0,-20 -20,0" fill="none" stroke={config.color} strokeWidth="1.8" transform={`rotate(${time * 42})`} opacity="0.5" />
        </g>

        {/* UI Scope Marker Overlay */}
        <g opacity="0.15" stroke={config.color} strokeWidth="0.8" pointerEvents="none">
          <circle cx="200" cy="200" r="199" fill="none" strokeDasharray="1 18" />
          <line x1="200" y1="0" x2="200" y2="45" />
          <line x1="200" y1="355" x2="200" y2="400" />
          <line x1="0" y1="200" x2="45" y2="200" />
          <line x1="355" y1="200" x2="400" y2="200" />
        </g>
      </svg>

      {/* Floating HUD Tags */}
      <div className="absolute bottom-8 right-8 flex flex-col items-end gap-3 z-30 pointer-events-none">
        <div className="px-5 py-2.5 clinical-glass rounded-xl flex items-center gap-3 shadow-2xl">
           <Zap size={14} className="text-cyan-400" />
           <span className="text-[10px] mono font-bold text-slate-400">FLUX: <span className="text-white">{metrics.membranePotential.toFixed(2)} mV</span></span>
        </div>
        <div className="px-5 py-2.5 clinical-glass rounded-xl flex items-center gap-3 border-t border-white/10" style={{ borderTopColor: config.color }}>
           <Waves size={14} className="text-slate-500" />
           <span className="text-[10px] mono font-bold text-slate-400">DRIFT: <span className="text-white">{(metrics.mutationRisk * 100).toFixed(6)}%</span></span>
        </div>
      </div>
    </div>
  );
};