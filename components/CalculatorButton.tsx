import React from 'react';

interface CalculatorButtonProps {
  label: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'danger';
  className?: string;
  span?: number;
}

export const CalculatorButton: React.FC<CalculatorButtonProps> = ({ 
  label, 
  onClick, 
  variant = 'default',
  className = '',
  span = 1
}) => {
  
  const baseStyles = "relative h-16 rounded-xl text-xl font-semibold transition-all duration-200 active:scale-95 flex items-center justify-center shadow-lg select-none overflow-hidden group";
  
  const variants = {
    default: "bg-zinc-800 text-zinc-200 hover:bg-zinc-700 active:bg-zinc-600 border border-zinc-700/50",
    primary: "bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700 shadow-indigo-900/20 border border-indigo-500/50",
    secondary: "bg-zinc-700/50 text-zinc-300 hover:bg-zinc-700 active:bg-zinc-600 border border-zinc-600/30",
    accent: "bg-emerald-600 text-white hover:bg-emerald-500 active:bg-emerald-700 shadow-emerald-900/20 border border-emerald-500/50",
    danger: "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 active:bg-rose-500/30 border border-rose-500/20"
  };

  const spanClass = span === 2 ? 'col-span-2' : 'col-span-1';

  return (
    <button 
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${spanClass} ${className}`}
    >
      <span className="relative z-10">{label}</span>
      {/* Subtle shine effect on hover */}
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </button>
  );
};
