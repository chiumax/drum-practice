'use client';

import React from 'react';
import { Track } from '@/lib/patterns/types';
import { BeatCell } from './BeatCell';

interface TrackRowProps {
  track: Track;
  trackIndex: number;
  currentStep: number;
  stepsPerBeat: number;
  onToggleStep: (trackIndex: number, stepIndex: number) => void;
  onToggleMute: (trackIndex: number) => void;
}

export const TrackRow = React.memo(function TrackRow({
  track,
  trackIndex,
  currentStep,
  stepsPerBeat,
  onToggleStep,
  onToggleMute,
}: TrackRowProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onToggleMute(trackIndex)}
        className={`
          w-20 sm:w-24 text-xs sm:text-sm font-medium text-left truncate px-2 py-1 rounded cursor-pointer
          ${track.muted ? 'text-gray-600 line-through' : 'text-gray-200'}
          hover:bg-gray-700/50 transition-colors
        `}
      >
        {track.label}
      </button>
      <div className="flex gap-0.5 sm:gap-1">
        {track.steps.map((step, stepIndex) => {
          const isDownbeat = stepIndex % stepsPerBeat === 0;
          return (
            <BeatCell
              key={stepIndex}
              active={step.active}
              accent={step.accent}
              isCurrent={currentStep === stepIndex}
              isDownbeat={isDownbeat}
              instrumentId={track.instrumentId}
              onClick={() => onToggleStep(trackIndex, stepIndex)}
            />
          );
        })}
      </div>
    </div>
  );
});
