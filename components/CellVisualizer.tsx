import React, { useMemo, useState, useEffect } from 'react';
import { Layers, Microscope, Zap, AlertCircle, Scan, Activity, Biohazard, BrainCircuit, TrendingUp } from 'lucide-react';
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
      setTime(prev => prev + 0.015);
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const theme = useMemo(() => {
    const isMalignant = state.includes('ONCOGENIC') || state.includes('AGGRESSIVE') || state.includes('FATE');
    const isToxic = state.includes('PROTEO') || state.includes('NEURO') || state.includes('STRESS') || state.includes('REDOX');
    const isMito = state.includes('MITO');
    const isAging = state.includes('SENESCENT') || state.includes('DRIFT');

    if (isMalignant) return { 
      color: '#f43f5e', glow: 'rgba(244,63,94,0.5)', bg: '#0d0202', 
      label: 'MALIGNANT_MORPHOLOGY', freq: 0.05, scale: 32, chaos: 2.2 
    };
    if (isToxic) return { 
      color: '#a855f7', glow: 'rgba(168,85,247,0.4)', bg: '#06020a', 
      label: 'CYTOTOXIC_INSTABILITY', freq: 0.06, scale: 28, chaos: 1.8 
    };
    if (isMito) return { 
      color: '#fbbf24', glow: 'rgba(251,191,36,0.3)', bg: '#0a0902', 
      label: 'METABOLIC_DECAY', freq: 0.03, scale: 20, chaos: 1.4 
    };
    if (isAging) return { 
      color: '#10b981', glow: 'rgba(16,185,129,0.3)', bg: '#020a06', 
      label: 'SENESCENT_DRIFT', freq: 0.02, scale: 15, chaos: 1.0 
    };
    return { 
      color: '#22d3ee', glow: 'rgba(34,211,238,0.3)', bg: '#01040f', 
      label: 'HOMEOSTATIC_EQUILIBRIUM', freq: 0.02, scale: 12, chaos: 0.6 
    };
  }, [state]);

  const isMitoStress = state.includes('MITO') || state.includes('REDOX');
  const isNeuroStress = state.includes('NEURONAL') || state.includes('SYNAPTIC') || state.includes('PROTEOTOXIC');
  const isOncoStress = state.includes('ONCOGENIC') || state.includes('AGGRESSIVE') || state.includes('FATE');

  const structures = useMemo(() => ({
    mito: Array.from({ length: 14 }).map((_, i) => ({
      id: `mito-${i}`, x: 60 + Math.random() * 280, y: 60 + Math.random() * 280,
      rx: 18 + Math.random() * 12, ry: 8 + Math.random() * 6,
      rot: Math.random() * 360, speed: 0.15 + Math.random() * 0.25
    })),
    ribosomes: Array.from({ length: 50 }).map((_, i) => ({
      id: `rb-${i}`, x: Math.random() * 400, y: Math.random() * 400,
      r: 1.0 + Math.random() * 1.5, speed: 0.1 + Math.random() * 0.2
    })),
    plaques: Array.from({ length: 8 }).map((_, i) => ({
      id: `pl-${i}`, x: 100 + Math.random() * 200, y: 100 + Math.random() * 200,
      r: 10 + Math.random() * 15, rot: Math.random() * 360
    }))
  }), []);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden transition-all duration-[2500ms]" style={{ backgroundColor: theme.bg }}>
      <div className="absolute inset-0 scanline z-40 pointer-events-none opacity-[0.12]"></div>
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(${theme.color} 2px, transparent 2px)`, backgroundSize: '65px 65px' }}></div>

      <svg className="w-[96%] h-[96%] drop-shadow-[0_0_120px_rgba(0,0,0,1.0)]" viewBox="0 0 400 400">
        <defs>
          <filter id="ultraDisplacement">
            <feTurbulence type="fractalNoise" baseFrequency={theme.freq} numOctaves="6" seed={Math.floor(time * 0.3)}>
              <animate attributeName="baseFrequency" values={`${theme.freq};${theme.freq * 1.8};${theme.freq}`} dur="30s" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" scale={theme.scale + (Math.sin(time * 0.3) * theme.chaos * 10)} />
          </filter>
          
          <radialGradient id="nucRadGlowCore">
            <stop offset="0%" stopColor={theme.color} stopOpacity="0.9" />
            <stop offset="40%" stopColor={theme.color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={theme.color} stopOpacity="0" />
          </radialGradient>

          <filter id="ultraGlow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Homeostatic Flow Background */}
        <circle cx="200" cy="200" r="185" fill={theme.glow} opacity="0.15" filter="url(#ultraGlow)" />

        {/* METABOLIC: ATP Flux Lines (Deterministic) */}
        {isMitoStress && (
          <g opacity="0.15" stroke="#fbbf24" strokeWidth="0.8" fill="none">
             {Array.from({length: 20}).map((_, i) => (
               <path key={i} d={`M${Math.sin(i + time*0.2)*400},${Math.cos(i + time*0.2)*400} L200,200`} />
             ))}
          </g>
        )}

        {/* NEURAL: Synaptic Interference Patterns */}
        {isNeuroStress && (
          <g opacity="0.1" fill="none" stroke="#a855f7" strokeWidth="1">
            {structures.plaques.map(p => (
              <circle key={p.id} cx={p.x} cy={p.y} r={p.r + Math.sin(time*2)*5} strokeDasharray="4 8" />
            ))}
          </g>
        )}

        {/* Outer Plasma Membrane (Deterministic Dynamic Filter) */}
        <g filter="url(#ultraDisplacement)">
          <path 
            d="M200,15 C370,15 395,100 395,200 C395,300 370,385 200,385 C30,385 5,300 5,200 C5,100 30,15 200,15" 
            fill="none" 
            stroke={theme.color} 
            strokeWidth="8" 
            strokeOpacity="0.25"
          />
          <path 
            d="M200,15 C370,15 395,100 395,200 C395,300 370,385 200,385 C30,385 5,300 5,200 C5,100 30,15 200,15" 
            fill="none" 
            stroke={theme.color} 
            strokeWidth="2.5" 
            strokeOpacity="0.9"
            strokeDasharray="2, 6"
          />
        </g>

        {/* Organelle Simulation: Mitochondria */}
        {structures.mito.map((o) => {
          const offsetX = Math.sin(time * o.speed) * (30 * theme.chaos);
          const offsetY = Math.cos(time * o.speed) * (30 * theme.chaos);
          const isFailing = metrics.atp < 1.0;
          const isHighlighted = showOverlays && isMitoStress;

          return (
            <g key={o.id} transform={`translate(${o.x + offsetX}, ${o.y + offsetY}) rotate(${o.rot + time * 4})`} opacity={isFailing ? 0.3 : 0.95}>
              {isHighlighted && (
                <ellipse cx="0" cy="0" rx={o.rx + 12} ry={o.ry + 12} fill="none" stroke="#fbbf24" strokeWidth="4" strokeOpacity={0.3 + Math.sin(time * 12) * 0.25} filter="url(#ultraGlow)" />
              )}
              <ellipse cx="0" cy="0" rx={o.rx} ry={o.ry} fill="none" stroke={isHighlighted ? '#fbbf24' : theme.color} strokeWidth={isHighlighted ? "3.5" : "2"} strokeOpacity="0.8" />
              {/* Internal Cristae - Detailed */}
              <path d={`M-${o.rx/1.2},0 C0,${o.ry} 0,${-o.ry} ${o.rx/1.2},0`} stroke={isHighlighted ? '#fbbf24' : theme.color} strokeWidth="1" fill="none" strokeOpacity="0.4" />
              <path d={`M-${o.rx/1.5},${o.ry/2} L${o.rx/1.5},${-o.ry/2}`} stroke={isHighlighted ? '#fbbf24' : theme.color} strokeWidth="0.5" fill="none" strokeOpacity="0.3" />
            </g>
          );
        })}

        {/* Ribosome Cloud */}
        {structures.ribosomes.map(r => (
          <circle 
            key={r.id} 
            cx={r.x + Math.sin(time * r.speed) * 40} 
            cy={r.y + Math.cos(time * r.speed) * 40} 
            r={r.r} 
            fill={theme.color} 
            opacity="0.25" 
          />
        ))}

        {/* ONCOGENIC: Chromatin Instability (Erratic Strands) */}
        {isOncoStress && (
          <g opacity="0.3" stroke="#f43f5e" strokeWidth="1.5">
            {Array.from({length: 12}).map((_, i) => (
              <path key={i} d={`M${200 + Math.sin(i + time)*40},${200 + Math.cos(i + time)*40} Q200,200 ${200 + Math.sin(i + 2 + time)*80},${200 + Math.cos(i + 2 + time)*80}`} fill="none" />
            ))}
          </g>
        )}

        {/* Central Nucleus Architecture */}
        <g transform={`translate(${200 + Math.sin(time * 0.5) * 8}, ${200 + Math.cos(time * 0.5) * 8})`}>
          {showOverlays && isOncoStress && (
             <circle r="95" fill="none" stroke="#f43f5e" strokeWidth="25" strokeOpacity={0.2 + Math.sin(time * 8) * 0.2} filter="url(#ultraGlow)" />
          )}
          {showOverlays && isNeuroStress && (
             <circle r="85" fill="none" stroke="#a855f7" strokeWidth="15" strokeOpacity={0.25 + Math.sin(time * 5) * 0.15} filter="url(#ultraGlow)" />
          )}

          <circle r="75" fill="url(#nucRadGlowCore)" />
          <circle 
            r="68" fill="none" 
            stroke={(showOverlays && isOncoStress) ? '#f43f5e' : (showOverlays && isNeuroStress) ? '#a855f7' : theme.color} 
            strokeWidth={showOverlays && (isOncoStress || isNeuroStress) ? "7" : "4"} 
            strokeDasharray={state === CellState.HOMEOSTASIS ? "none" : "12 6"} 
            strokeOpacity="0.85" 
          />
          
          <g opacity={isOncoStress ? 1 : 0.9}>
            <circle r="25" fill={theme.color} opacity={0.5}>
              <animate attributeName="r" values="22;28;22" dur="4s" repeatCount="indefinite" />
            </circle>
            <path d="M-22,0 Q0,22 22,0 Q0,-22 -22,0" fill="none" stroke={theme.color} strokeWidth="2.5" transform={`rotate(${time * 35})`} />
          </g>
        </g>

        {/* High-Precision UI Markers */}
        <g opacity="0.5" stroke={theme.color} strokeWidth="1.5" pointerEvents="none">
          <circle cx="200" cy="200" r="199" fill="none" strokeDasharray="5 25" />
          <line x1="200" y1="0" x2="200" y2="50" />
          <line x1="200" y1="350" x2="200" y2="400" />
          <line x1="0" y1="200" x2="50" y2="200" />
          <line x1="350" y1="200" x2="400" y2="200" />
        </g>
      </svg>

      {/* Optical Overlay Status */}
      <div className="absolute top-14 left-14 flex flex-col gap-6 z-50 animate-in fade-in slide-in-from-left-4 duration-700">
        <div className="flex items-center gap-6 bg-white/5 px-6 py-3 rounded-[24px] backdrop-blur-3xl border border-white/10 shadow-3xl">
          <Scan className={`w-6 h-6 text-${isOncoStress ? 'rose' : isMitoStress ? 'amber' : isNeuroStress ? 'purple' : 'cyan'}-400`} />
          <span className="text-[13px] font-black text-slate-400 uppercase tracking-[0.7em] outfit">Optical_Node_Sync</span>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4">
            {isOncoStress ? <Biohazard className="w-8 h-8 text-rose-500 animate-bounce" /> : 
             isMitoStress ? <Zap className="w-8 h-8 text-amber-500 animate-pulse" /> :
             isNeuroStress ? <BrainCircuit className="w-8 h-8 text-purple-500 animate-spin-slow" /> :
             <Activity className="w-8 h-8 text-cyan-400" />}
            <h2 className="text-4xl font-black text-white uppercase tracking-[0.1em] outfit drop-shadow-3xl">{theme.label}</h2>
          </div>
          <div className="flex items-center gap-6 text-slate-500 font-mono text-[12px] uppercase tracking-widest mt-2 bg-black/40 w-fit px-5 py-2 rounded-[16px] border border-white/5">
             <span className="flex items-center gap-2 text-cyan-400/90 font-black"><TrendingUp className="w-4 h-4" /> REFR_GAIN: 18.2dB</span>
             <span className="h-4 w-px bg-white/10" />
             <span className="flex items-center gap-2 text-green-500/90 font-black">LENS_STABILITY_100%</span>
          </div>
        </div>
      </div>

      {/* Pathology Report Markers */}
      <div className="absolute bottom-14 right-14 flex flex-col items-end gap-5 z-50">
        {showOverlays && (state !== CellState.HOMEOSTASIS) && (
          <div className="px-10 py-7 bg-black/95 border border-cyan-500/30 rounded-[48px] backdrop-blur-3xl mb-6 flex flex-col gap-6 items-end shadow-3xl animate-in fade-in slide-in-from-right-16 duration-1000">
            <div className="flex items-center gap-5 border-b border-white/10 pb-4 mb-2 w-full justify-end">
               <Layers className="w-6 h-6 text-cyan-400" />
               <span className="text-[13px] font-black text-cyan-400 uppercase tracking-[0.5em]">Phenotype_Detection</span>
            </div>
            {isMitoStress && <div className="text-amber-400 mono text-[11px] uppercase tracking-widest font-black flex items-center gap-4 bg-amber-500/5 px-6 py-2 rounded-full border border-amber-500/20"><span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse shadow-[0_0_15px_#fbbf24]" /> BIOENERGETIC_COLLAPSE_CONFIRMED</div>}
            {isNeuroStress && <div className="text-purple-400 mono text-[11px] uppercase tracking-widest font-black flex items-center gap-4 bg-purple-500/5 px-6 py-2 rounded-full border border-purple-500/20"><span className="w-3 h-3 rounded-full bg-purple-500 animate-pulse shadow-[0_0_15px_#a855f7]" /> PROTEOTOXIC_ANOMALY_CONFIRMED</div>}
            {isOncoStress && <div className="text-rose-500 mono text-[11px] uppercase tracking-widest font-black flex items-center gap-4 bg-rose-500/5 px-6 py-2 rounded-full border border-rose-500/20"><span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse shadow-[0_0_15px_#f43f5e]" /> MITOTIC_GATEWAY_FAIL_CRITICAL</div>}
          </div>
        )}
        <div className="px-10 py-4.5 bg-white/5 border border-white/10 rounded-[28px] backdrop-blur-3xl group hover:bg-white/10 transition-all cursor-default shadow-3xl border-l-8" style={{ borderColor: theme.color }}>
           <span className="text-[13px] font-mono text-slate-500 font-black uppercase tracking-widest">TEMPORAL_DRIFT_COEFFICIENT: <span className="text-white group-hover:text-cyan-400 transition-colors">{(metrics.mutationRisk * 100).toFixed(10)}%</span></span>
        </div>
      </div>
    </div>
  );
};