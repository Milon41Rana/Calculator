export const APP_NAME = "Nebula Calc";

// Gemini Model Configuration
export const GEMINI_MODEL_FLASH = 'gemini-3-flash-preview';
export const GEMINI_MODEL_PRO = 'gemini-3-pro-preview';

export const MAX_HISTORY_ITEMS = 50;

export const SCIENTIFIC_KEYS = [
  { label: 'sin', value: 'sin(', type: 'function' },
  { label: 'cos', value: 'cos(', type: 'function' },
  { label: 'tan', value: 'tan(', type: 'function' },
  { label: 'ln', value: 'log(', type: 'function' }, // Math.log is natural log
  { label: 'log', value: 'log10(', type: 'function' },
  { label: 'π', value: 'PI', type: 'number' },
  { label: 'e', value: 'E', type: 'number' },
  { label: '√', value: 'sqrt(', type: 'function' },
  { label: '^', value: '^', type: 'operator' },
  { label: '(', value: '(', type: 'operator' },
  { label: ')', value: ')', type: 'operator' },
  { label: '!', value: '!', type: 'operator' },
];
