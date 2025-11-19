import React from 'react';
import { Step, QuickOption } from '../types';
import { STEPS_DATA } from '../constants';
import { ChevronRight, CheckCircle, Circle, Sparkles } from 'lucide-react';

interface WizardSidebarProps {
  currentStep: Step;
  onOptionSelect: (option: QuickOption) => void;
}

const WizardSidebar: React.FC<WizardSidebarProps> = ({ currentStep, onOptionSelect }) => {
  const steps = Object.values(Step).filter((v) => !isNaN(Number(v))) as Step[];
  const activeConfig = STEPS_DATA[currentStep];

  return (
    <div className="hidden md:flex flex-col w-80 border-r border-studio-700 bg-studio-800 h-full flex-shrink-0">
      {/* Header */}
      <div className="p-6 border-b border-studio-700 flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-studio-accent to-blue-600 flex items-center justify-center shadow-lg shadow-studio-accent/20">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
            <h1 className="text-lg font-bold text-white tracking-tight leading-none">Visual Prompt</h1>
            <span className="text-[10px] text-studio-400 uppercase tracking-widest">视觉工坊</span>
        </div>
      </div>

      {/* Progress List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="space-y-1">
           <h3 className="text-xs font-semibold text-studio-500 uppercase tracking-wider mb-4 pl-1">创作流程 (Workflow)</h3>
           {steps.slice(0, 6).map((s) => {
             const isCompleted = s < currentStep;
             const isActive = s === currentStep;
             const data = STEPS_DATA[s];

             return (
               <div 
                key={s} 
                className={`flex items-center space-x-3 py-2.5 px-2 rounded-lg transition-all ${isActive ? 'bg-studio-700/50 text-white translate-x-1' : isCompleted ? 'text-studio-300' : 'text-studio-600'}`}
               >
                 {isCompleted ? (
                   <CheckCircle className="w-5 h-5 text-studio-accent" />
                 ) : isActive ? (
                   <div className="relative flex items-center justify-center w-5 h-5">
                     <span className="absolute w-full h-full rounded-full bg-studio-accent opacity-20 animate-ping"></span>
                     <Circle className="w-5 h-5 text-studio-accent fill-current" />
                   </div>
                 ) : (
                   <Circle className="w-5 h-5" />
                 )}
                 <span className={`text-sm font-medium transition-colors`}>
                   {data.title}
                 </span>
               </div>
             );
           })}
        </div>

        {/* Active Step Options */}
        {activeConfig && currentStep < Step.DONE && (
          <div className="mt-8 animate-in slide-in-from-bottom-4 fade-in duration-500">
             <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-studio-accent uppercase tracking-wider">
                    当前步骤
                </h3>
                <span className="text-[10px] bg-studio-accent/10 text-studio-accent px-2 py-0.5 rounded-full">
                    Step {Number(currentStep) + 1}
                </span>
             </div>
             <p className="text-xs text-studio-300 mb-4 leading-relaxed">
               {activeConfig.description}
             </p>
             
             <div className="grid gap-2">
               {activeConfig.options.map((opt, idx) => (
                 <button
                   key={idx}
                   onClick={() => onOptionSelect(opt)}
                   className="group flex items-center justify-between w-full p-3 bg-studio-700 hover:bg-studio-600 rounded-lg border border-transparent hover:border-studio-500 transition-all text-left shadow-sm"
                 >
                   <div className="flex items-center space-x-3">
                     <span className="text-xl">{opt.icon}</span>
                     <div className="flex flex-col">
                       <span className="text-sm font-medium text-gray-200 group-hover:text-white">{opt.label}</span>
                     </div>
                   </div>
                   <ChevronRight className="w-4 h-4 text-studio-500 group-hover:text-studio-accent opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                 </button>
               ))}
             </div>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-studio-700 text-[10px] text-studio-500 text-center tracking-wide">
        POWERED BY GEMINI 3 PRO
      </div>
    </div>
  );
};

export default WizardSidebar;