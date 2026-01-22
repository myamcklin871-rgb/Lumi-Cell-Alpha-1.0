
export enum CellState {
  HOMEOSTASIS = 'HOMEOSTASIS',
  ONCOGENIC_DYSPLASIA = 'ONCOGENIC_DYSPLASIA',
  METASTATIC_BLEBBING = 'METASTATIC_BLEBBING',
  MITO_FRAGMENTATION = 'MITO_FRAGMENTATION',
  OXIDATIVE_PEROXIDATION = 'OXIDATIVE_PEROXIDATION',
  PROTEOTOXIC_AGGREGATION = 'PROTEOTOXIC_AGGREGATION',
  FILAMENTARY_COLLAPSE = 'FILAMENTARY_COLLAPSE',
  EPIGENETIC_REMODELING = 'EPIGENETIC_REMODELING',
  SENESCENT_HYPERTROPHY = 'SENESCENT_HYPERTROPHY'
}

export interface AdvancedMetrics {
  temperature: number;
  ph: number;
  atp: number;
  ros: number;
  ca2: number;
  membranePotential: number;
  mutationRisk: number;
  glucoseUptake: number;
  proteinMisfolding: number;
  cytosolicViscosity: number;
  mitochondrialFractal: number;
}

export interface SignalData {
  time: string;
  amplitude: number;
  noise: number;
  frequency: number;
}
