import React, { useState, useRef, useEffect } from 'react';
import { solveMathProblem } from '../services/geminiService';
import { Bot, X, Send, Sparkles, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown'; // Assuming standard handling if installed, but since we can't install, we'll do simple text rendering or assume pre-installed in environment. Wait, I must not use libraries I can't guarantee. I will implement a simple text renderer.

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResult: (expression: string, result: string) => void;
}

export const AIModal: React.FC<AIModalProps> = ({ isOpen, onClose, onResult }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResponse('');
    
    try {
      const result = await solveMathProblem(query);
      setResponse(result);
      onResult(query, "AI Solved");
    } catch (e) {
      setResponse("An error occurred while communicating with Gemini.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-indigo-500/30 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-indigo-950/30">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="text-indigo-400" /> 
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Gemini Math Tutor</span>
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {response ? (
            <div className="bg-zinc-800/50 rounded-xl p-6 border border-white/5 text-zinc-200 leading-relaxed overflow-x-auto">
               {/* Simple formatting for lines and bold text since we can't rely on react-markdown */}
               {response.split('\n').map((line, i) => (
                 <p key={i} className="mb-2 min-h-[1rem]">
                   {line.includes('**') ? 
                      line.split('**').map((part, idx) => 
                        idx % 2 === 1 ? <strong key={idx} className="text-indigo-300">{part}</strong> : part
                      ) 
                    : line}
                 </p>
               ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-zinc-500 text-center">
              <Bot size={48} className="mb-4 opacity-20" />
              <p>Ask a complex math question or word problem.</p>
              <p className="text-sm mt-2 opacity-60">"What is the derivative of x^2 * sin(x)?"</p>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-zinc-950 border-t border-white/10">
          <div className="relative">
            <textarea
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Gemini to solve..."
              className="w-full bg-zinc-900 text-white rounded-xl border border-zinc-700 p-4 pr-14 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none h-16 scrollbar-hide"
            />
            <button 
              onClick={handleSubmit}
              disabled={loading || !query.trim()}
              className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
