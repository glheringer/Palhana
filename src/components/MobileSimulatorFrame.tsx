import React from 'react';
import { PalhanasBadge } from './BrandGraphics';
import { Wifi, Battery, Signal, Sparkles, Smartphone } from 'lucide-react';

interface MobileSimulatorFrameProps {
  children: React.ReactNode;
  activeTabTitle: string;
}

export const MobileSimulatorFrame: React.FC<MobileSimulatorFrameProps> = ({
  children,
  activeTabTitle,
}) => {
  // Current time for status bar
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
    now.getMinutes()
  ).padStart(2, '0')}`;

  return (
    <div className="py-4 sm:py-8 flex flex-col items-center justify-center">
      {/* Mobile Device Mockup Frame */}
      <div className="relative w-full max-w-[420px] bg-[#1F1612] rounded-[48px] p-3.5 shadow-2xl border-4 border-[#3D261A] ring-1 ring-white/10">
        
        {/* Hardware side buttons visual */}
        <div className="absolute -left-[7px] top-24 w-[3px] h-10 bg-[#3D261A] rounded-l-md" />
        <div className="absolute -left-[7px] top-38 w-[3px] h-12 bg-[#3D261A] rounded-l-md" />
        <div className="absolute -left-[7px] top-54 w-[3px] h-12 bg-[#3D261A] rounded-l-md" />
        <div className="absolute -right-[7px] top-32 w-[3px] h-16 bg-[#3D261A] rounded-r-md" />

        {/* Screen Bezel & Container */}
        <div className="w-full bg-[#F5EDE3] rounded-[38px] overflow-hidden flex flex-col relative border border-[#D79A61]/30 min-h-[740px] max-h-[85vh]">
          
          {/* iOS / Android Native Status Bar */}
          <div className="bg-[#4B2E20] text-white px-6 pt-3 pb-2 flex items-center justify-between text-xs font-semibold select-none flex-shrink-0 z-30">
            <span>{timeStr}</span>

            {/* Dynamic Island Pill */}
            <div className="w-24 h-4 bg-black rounded-full flex items-center justify-center gap-1.5 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-[#1F1612]" />
              <span className="w-1.5 h-1.5 rounded-full bg-blue-950/80" />
            </div>

            <div className="flex items-center gap-1.5 text-white/90">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-4 h-4 text-[#D79A61]" />
            </div>
          </div>

          {/* Top Mobile App Header */}
          <div className="bg-[#4B2E20] text-[#F5EDE3] px-4 py-2 flex items-center justify-between border-b border-[#D79A61]/30 flex-shrink-0">
            <div className="flex items-center gap-2">
              <PalhanasBadge size={28} />
              <div>
                <span className="font-serif-brand font-black text-sm text-white tracking-tight block leading-none">
                  PALHANAS
                </span>
                <span className="text-[8px] uppercase tracking-widest text-[#D79A61] font-bold">
                  {activeTabTitle}
                </span>
              </div>
            </div>

            <div className="inline-flex items-center gap-1 bg-[#D88A8A]/20 px-2 py-0.5 rounded-full text-[9px] font-bold text-[#D88A8A] border border-[#D88A8A]/40">
              <Sparkles className="w-2.5 h-2.5" />
              <span>React Native</span>
            </div>
          </div>

          {/* Scrollable Screen Content */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 no-scrollbar pb-24">
            {children}
          </div>

          {/* Native Home Indicator Bar */}
          <div className="absolute bottom-1 inset-x-0 flex justify-center pointer-events-none z-50">
            <div className="w-32 h-1 bg-[#4B2E20]/30 rounded-full" />
          </div>
        </div>
      </div>

      {/* Simulator Caption */}
      <div className="mt-3 flex items-center gap-2 text-xs text-[#7A4A2E]">
        <Smartphone className="w-4 h-4 text-[#D79A61]" />
        <span>
          Simulador de Aplicativo Mobile (React Native / Expo). Experimente todas as abas no rodapé.
        </span>
      </div>
    </div>
  );
};
