import React, { useEffect, useRef } from 'react';

interface DisplayProps {
  input: string;
  result: string;
  isAiProcessing?: boolean;
}

export const Display: React.FC<DisplayProps> = ({ input, result, isAiProcessing }) => {
  const displayRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to end of input
  useEffect(() => {
    if (displayRef.current) {
      displayRef.current.scrollLeft = displayRef.current.scrollWidth;
    }
  }, [input]);

  return (
    <div className="w-full h-40 bg-black/40 rounded-2xl p-6 flex flex-col justify-end items-end mb-4 border border-white/10 shadow-inner backdrop-blur-sm relative overflow-hidden">
      
      {/* AI Processing Indicator */}
      {isAiProcessing && (
        <div className="absolute top-4 left-4 flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-widest animate-pulse">
          <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
          Gemini Thinking...
        </div>
      )}

      {/* Input Expression */}
      <div 
        ref={displayRef}
        className="w-full text-zinc-400 text-xl font-mono overflow-x-auto whitespace-nowrap scrollbar-hide text-right mb-2"
      >
        {input || '0'}
      </div>

      {/* Main Result */}
      <div className="w-full text-white text-5xl font-bold font-sans tracking-tight text-right overflow-hidden text-ellipsis whitespace-nowrap">
        {result || (input ? '...' : '0')}
      </div>
    </div>
  );
};
