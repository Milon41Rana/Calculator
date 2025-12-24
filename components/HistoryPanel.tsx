import React from 'react';
import { HistoryItem } from '../types';
import { Clock, Trash2, Bot } from 'lucide-react';

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect, onClear, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-zinc-900/95 backdrop-blur-xl border-l border-white/10 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col">
      <div className="p-6 border-b border-white/10 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Clock size={20} /> History
        </h2>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {history.length === 0 ? (
          <div className="text-zinc-500 text-center py-10">No history yet</div>
        ) : (
          history.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className="w-full text-left p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all group"
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs text-zinc-500 font-mono">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </span>
                {item.type === 'ai' && <Bot size={14} className="text-indigo-400" />}
              </div>
              <div className="text-zinc-400 text-sm font-mono truncate mb-1">{item.expression}</div>
              <div className="text-emerald-400 font-bold text-lg truncate">= {item.result}</div>
            </button>
          ))
        )}
      </div>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={onClear}
          className="w-full py-3 flex items-center justify-center gap-2 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors font-medium"
        >
          <Trash2 size={18} /> Clear History
        </button>
      </div>
    </div>
  );
};
