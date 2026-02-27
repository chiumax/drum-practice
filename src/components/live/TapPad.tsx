'use client';

import React, { useCallback, useRef, useState } from 'react';
import { InstrumentId } from '@/lib/patterns/types';
import { audioEngine } from '@/lib/audio/AudioEngine';
import { playInstrument } from '@/lib/audio/DrumSynth';
import { TapMatcher } from '@/lib/live-practice/TapMatcher';
import { useLivePracticeStore } from '@/lib/store/useLivePracticeStore';
import { useSettingsStore } from '@/lib/store/useSettingsStore';
import { TimingGrade, GRADE_COLORS } from '@/lib/live-practice/types';

const instrumentPadColors: Record<InstrumentId, string> = {
  kick: 'border-red-500/50 hover:border-red-500',
  snare: 'border-yellow-400/50 hover:border-yellow-400',
  'hihat-closed': 'border-cyan-400/50 hover:border-cyan-400',
  'hihat-open': 'border-cyan-300/50 hover:border-cyan-300',
  'tom-high': 'border-purple-400/50 hover:border-purple-400',
  'tom-mid': 'border-purple-500/50 hover:border-purple-500',
  'tom-low': 'border-purple-600/50 hover:border-purple-600',
  crash: 'border-orange-400/50 hover:border-orange-400',
  ride: 'border-green-400/50 hover:border-green-400',
};

interface TapPadProps {
  instrumentId: InstrumentId;
  label: string;
  keyLabel: string;
  tapMatcher: TapMatcher | null;
  isActive: boolean;
}

export const TapPad = React.memo(function TapPad({
  instrumentId,
  label,
  keyLabel,
  tapMatcher,
  isActive,
}: TapPadProps) {
  const [flash, setFlash] = useState<TimingGrade | null>(null);
  const flashTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTap = useCallback(() => {
    if (!tapMatcher || !isActive) return;

    const tapTime = audioEngine.currentTime;
    if (!useSettingsStore.getState().muteDrumSounds) {
      playInstrument(instrumentId, tapTime, 0.8, 0.8);
    }

    const tapEvent = tapMatcher.processTap(tapTime, instrumentId);
    const store = useLivePracticeStore.getState();
    store.recordTap(tapEvent);
    if (tapEvent.matchedStep !== null) {
      store.setStepAccuracy(
        tapEvent.matchedStep,
        instrumentId,
        tapEvent.grade,
        tapEvent.offset
      );
    }

    // Visual flash
    setFlash(tapEvent.grade);
    if (flashTimeout.current) clearTimeout(flashTimeout.current);
    flashTimeout.current = setTimeout(() => setFlash(null), 200);
  }, [instrumentId, tapMatcher, isActive]);

  const padColor = instrumentPadColors[instrumentId];
  const flashColor = flash ? GRADE_COLORS[flash] : '';

  return (
    <button
      onMouseDown={(e) => { e.preventDefault(); handleTap(); }}
      onTouchStart={(e) => { e.preventDefault(); handleTap(); }}
      className={`
        relative flex flex-col items-center justify-center
        w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 cursor-pointer
        bg-gray-800/80 transition-all duration-75 select-none
        active:scale-90
        ${padColor}
        ${flash ? `${flashColor} scale-95` : ''}
      `}
    >
      <span className="text-xs sm:text-sm font-medium text-gray-200">{label}</span>
      <span className="text-[10px] text-gray-500 mt-0.5">{keyLabel}</span>
    </button>
  );
});
