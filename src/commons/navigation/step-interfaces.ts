export interface Substep {
  id: string | number;
  label: string;
  icon: string;
  disabled?: boolean;
  unselectable?: boolean;
  parentLabel?: string;
  message?: string;
  status: 'EMPTY' | 'ERROR' | 'SUCCESS' | 'TODO' | 'WARNING';
}

export interface Step extends Substep {
  sublabel?: string;
  substeps?: Step[];
}
