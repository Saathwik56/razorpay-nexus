import React from 'react';
import { Sparkles, Bot } from 'lucide-react';

interface AskRayWidgetProps {
  onClick: () => void;
}

export const AskRayWidget: React.FC<AskRayWidgetProps> = ({ onClick }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={onClick}
        className="flex items-center space-x-2.5 px-4 py-2.5 rounded-full bg-white border-2 border-emerald-400 text-slate-900 font-bold text-xs shadow-2xl hover:shadow-emerald-500/20 hover:border-emerald-500 transition-all transform hover:scale-105 group"
      >
        <div className="w-5 h-5 rounded-md bg-emerald-500 text-white flex items-center justify-center font-black">
          <Sparkles className="w-3.5 h-3.5 fill-white text-white group-hover:rotate-12 transition-transform" />
        </div>
        <span className="font-['Plus_Jakarta_Sans'] text-slate-900 tracking-tight text-xs font-extrabold">
          Ask RAY (Agent AI)
        </span>
      </button>
    </div>
  );
};
