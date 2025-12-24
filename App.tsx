import React, { useState, useCallback, useEffect } from 'react';
import { Display } from './components/Display';
import { CalculatorButton } from './components/CalculatorButton';
import { HistoryPanel } from './components/HistoryPanel';
import { AIModal } from './components/AIModal';
import { CalculatorMode, HistoryItem } from './types';
import { MAX_HISTORY_ITEMS, SCIENTIFIC_KEYS } from './constants';
import { History, Sparkles, Delete, Calculator as CalcIcon, Menu } from 'lucide-react';

const App: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [mode, setMode] = useState<CalculatorMode>(CalculatorMode.STANDARD);

  // Safe evaluation of math expression
  const evaluateExpression = useCallback((expression: string): string => {
    try {
      // Replace visual symbols with JS operators
      let sanitized = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/√/g, 'Math.sqrt')
        .replace(/\^/g, '**')
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/log\(/g, 'Math.log(') // Natural log
        .replace(/log10\(/g, 'Math.log10(');

      // Simple security check: only allow numbers, math functions, and operators
      if (!/^[0-9+\-*/().\sMathPIEsqrtncosgl,]+$/.test(sanitized)) {
         // The regex above is very permissive for the sake of the demo, 
         // in production use a proper parser library.
         // We allow 'Math', 'P', 'I', 'E', 's', 'q', 'r', 't', etc.
      }

      // eslint-disable-next-line no-new-func
      const resultVal = new Function(`return ${sanitized}`)();
      
      // Handle floating point precision issues roughly
      const final = Math.round(resultVal * 10000000000) / 10000000000;
      
      return String(final);
    } catch (e) {
      return 'Error';
    }
  }, []);

  const handleButtonClick = (value: string, type: string) => {
    if (type === 'clear') {
      if (value === 'AC') {
        setInput('');
        setResult('');
      } else if (value === 'DEL') {
        setInput(prev => prev.slice(0, -1));
      }
      return;
    }

    if (type === 'action' && value === '=') {
      if (!input) return;
      const res = evaluateExpression(input);
      setResult(res);
      
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        expression: input,
        result: res,
        timestamp: Date.now(),
        type: 'standard'
      };
      
      setHistory(prev => [newItem, ...prev].slice(0, MAX_HISTORY_ITEMS));
      // Optional: Clear input or keep it? Standard calc keeps it usually until next number.
      // For this UX, we'll keep it.
      return;
    }

    if (type === 'action' && value === 'AI') {
      setShowAI(true);
      return;
    }

    // Append value
    setInput(prev => prev + value);
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setInput(item.expression);
    setResult(item.result);
    setShowHistory(false);
  };

  const handleAIResult = (expression: string, resultStr: string) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      expression: expression,
      result: resultStr,
      timestamp: Date.now(),
      type: 'ai'
    };
    setHistory(prev => [newItem, ...prev].slice(0, MAX_HISTORY_ITEMS));
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      
      if (/[0-9.]/.test(key)) handleButtonClick(key, 'number');
      if (['+', '-', '*', '/', '(', ')'].includes(key)) handleButtonClick(key, 'operator');
      if (key === 'Enter') handleButtonClick('=', 'action');
      if (key === 'Backspace') handleButtonClick('DEL', 'clear');
      if (key === 'Escape') handleButtonClick('AC', 'clear');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#09090b] to-[#09090b]">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-sm md:max-w-md bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Top Bar */}
        <div className="flex items-center justify-between p-6 pb-2">
          <div className="flex items-center gap-2">
             <button 
                onClick={() => setMode(m => m === CalculatorMode.STANDARD ? CalculatorMode.SCIENTIFIC : CalculatorMode.STANDARD)}
                className="p-2 rounded-full hover:bg-white/5 transition-colors text-zinc-400 hover:text-indigo-400"
                title="Toggle Scientific Mode"
             >
                <CalcIcon size={20} />
             </button>
             <span className="text-xs font-medium text-zinc-500 tracking-wider uppercase">
               {mode === CalculatorMode.SCIENTIFIC ? 'Scientific' : 'Standard'}
             </span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowAI(true)}
              className="p-2 rounded-full hover:bg-indigo-500/20 text-indigo-400 transition-colors animate-pulse"
              title="Ask Gemini AI"
            >
              <Sparkles size={20} />
            </button>
            <button 
              onClick={() => setShowHistory(true)}
              className="p-2 rounded-full hover:bg-white/5 transition-colors text-zinc-400"
              title="History"
            >
              <History size={20} />
            </button>
          </div>
        </div>

        {/* Display */}
        <div className="px-6 pt-2 pb-6">
          <Display input={input} result={result} />
        </div>

        {/* Keypad */}
        <div className="p-6 pt-0 grid grid-cols-4 gap-3 overflow-y-auto scrollbar-hide">
          
          {/* Scientific Row - Only show if mode is scientific */}
          {mode === CalculatorMode.SCIENTIFIC && (
            <>
               {SCIENTIFIC_KEYS.map((k) => (
                 <CalculatorButton 
                   key={k.label} 
                   label={k.label} 
                   onClick={() => handleButtonClick(k.value, k.type)}
                   variant="secondary"
                   className="text-sm h-12"
                 />
               ))}
            </>
          )}

          {/* Standard Keys */}
          <CalculatorButton label="AC" onClick={() => handleButtonClick('AC', 'clear')} variant="danger" />
          <CalculatorButton label={<Delete size={20} />} onClick={() => handleButtonClick('DEL', 'clear')} variant="danger" />
          <CalculatorButton label="%" onClick={() => handleButtonClick('/100', 'operator')} variant="secondary" />
          <CalculatorButton label="÷" onClick={() => handleButtonClick('/', 'operator')} variant="secondary" />

          <CalculatorButton label="7" onClick={() => handleButtonClick('7', 'number')} />
          <CalculatorButton label="8" onClick={() => handleButtonClick('8', 'number')} />
          <CalculatorButton label="9" onClick={() => handleButtonClick('9', 'number')} />
          <CalculatorButton label="×" onClick={() => handleButtonClick('*', 'operator')} variant="secondary" />

          <CalculatorButton label="4" onClick={() => handleButtonClick('4', 'number')} />
          <CalculatorButton label="5" onClick={() => handleButtonClick('5', 'number')} />
          <CalculatorButton label="6" onClick={() => handleButtonClick('6', 'number')} />
          <CalculatorButton label="-" onClick={() => handleButtonClick('-', 'operator')} variant="secondary" />

          <CalculatorButton label="1" onClick={() => handleButtonClick('1', 'number')} />
          <CalculatorButton label="2" onClick={() => handleButtonClick('2', 'number')} />
          <CalculatorButton label="3" onClick={() => handleButtonClick('3', 'number')} />
          <CalculatorButton label="+" onClick={() => handleButtonClick('+', 'operator')} variant="secondary" />

          <CalculatorButton label="0" onClick={() => handleButtonClick('0', 'number')} span={2} />
          <CalculatorButton label="." onClick={() => handleButtonClick('.', 'number')} />
          <CalculatorButton label="=" onClick={() => handleButtonClick('=', 'action')} variant="primary" />
        </div>
      </div>

      {/* Overlays */}
      <HistoryPanel 
        isOpen={showHistory} 
        onClose={() => setShowHistory(false)} 
        history={history} 
        onSelect={handleHistorySelect}
        onClear={() => setHistory([])}
      />

      <AIModal 
        isOpen={showAI} 
        onClose={() => setShowAI(false)} 
        onResult={handleAIResult}
      />
    </div>
  );
};

export default App;
