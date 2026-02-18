'use client';

import React from 'react';
import { InstrumentId } from '@/lib/patterns/types';
import { TimingGrade } from '@/lib/live-practice/types';

const instrumentColors: Record<InstrumentId, string> = {
  'kick': 'bg-red-500',
  'snare': 'bg-yellow-400',
  'hihat-closed': 'bg-cyan-400',
  'hihat-open': 'bg-cyan-300',
  'tom-high': 'bg-purple-400',
  'tom-mid': 'bg-purple-500',
  'tom-low': 'bg-purple-600',
  'crash': 'bg-orange-400',
  'ride': 'bg-green-400',
};

const gradeOverlayColors: Record<TimingGrade, string> = {
  perfect: 'ring-green-400 bg-green-400/30',
  great: 'ring-lime-400 bg-lime-400/20',
  good: 'ring-yellow-400 bg-yellow-400/20',
  early: 'ring-orange-400 bg-orange-400/20',
  late: 'ring-orange-400 bg-orange-400/20',
  miss: 'ring-red-500 bg-red-500/30',
};

interface BeatCellProps {
  active: boolean;
  accent: boolean;
  isCurrent: boolean;
  isDownbeat: boolean;
  instrumentId: InstrumentId;
  onClick: () => void;
  accuracyGrade?: TimingGrade | null;
}

export const BeatCell = React.memo(function BeatCell({
  active,
  accent,
  isCurrent,
  isDownbeat,
  instrumentId,
  onClick,
  accuracyGrade,
}: BeatCellProps) {
  const color = instrumentColors[instrumentId];
  const gradeOverlay = accuracyGrade ? gradeOverlayColors[accuracyGrade] : '';

  return (
    <button
      onClick={onClick}
      className={`
        relative w-9 h-9 sm:w-10 sm:h-10 rounded-md border transition-all duration-75 cursor-pointer
        ${isDownbeat ? 'border-gray-600' : 'border-gray-700/50'}
        ${isCurrent ? 'ring-2 ring-white/80 scale-105' : ''}
        ${active
          ? `${color} ${accent ? 'brightness-125 shadow-lg' : 'opacity-80'}`
          : isDownbeat
            ? 'bg-gray-800/80'
            : 'bg-gray-800/40'
        }
        ${accuracyGrade && !isCurrent ? `ring-2 ${gradeOverlay}` : ''}
        hover:brightness-125 active:scale-95
      `}
      aria-label={`${active ? 'Disable' : 'Enable'} step`}
    />
  );
});
