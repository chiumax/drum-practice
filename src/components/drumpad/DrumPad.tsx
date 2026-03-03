'use client';

import React, { useCallback } from 'react';
import { PadConfig, PadVoiceId, PAD_COLORS } from '@/lib/drumpad/types';
import { audioEngine } from '@/lib/audio/AudioEngine';

interface DrumPadProps {
  config: PadConfig;
  isActive: boolean;
  onTrigger: (padId: PadVoiceId) => void;
}

export const DrumPad = React.memo(function DrumPad({
  config,
  isActive,
  onTrigger,
}: DrumPadProps) {
  const colors = PAD_COLORS[config.color];

  const handleTrigger = useCallback(() => {
    audioEngine.init();
    onTrigger(config.id);
  }, [config.id, onTrigger]);

  return (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        handleTrigger();
      }}
      onTouchStart={(e) => {
        e.preventDefault();
        handleTrigger();
      }}
      className={`
        relative flex flex-col items-center justify-center
        aspect-square rounded-xl border-2 cursor-pointer
        bg-gray-800/80 select-none
        transition-all duration-75
        ${colors.border}
        ${isActive
          ? `${colors.activeBg} shadow-lg ${colors.glow} scale-95 border-opacity-100`
          : 'hover:bg-gray-700/60'
        }
      `}
      style={{ touchAction: 'none' }}
    >
      <span className="text-xs sm:text-sm font-medium text-gray-200 leading-tight text-center">
        {config.label}
      </span>
      <span className="text-[10px] text-gray-500 mt-0.5">{config.keyLabel}</span>
    </button>
  );
});
