export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
  type: 'standard' | 'ai';
}

export enum CalculatorMode {
  STANDARD = 'STANDARD',
  SCIENTIFIC = 'SCIENTIFIC',
  AI_SOLVER = 'AI_SOLVER'
}

export interface ButtonConfig {
  label: string;
  value: string;
  type: 'number' | 'operator' | 'function' | 'action' | 'clear';
  span?: number; // Grid column span
  highlight?: boolean;
}
