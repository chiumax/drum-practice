'use client';

import React from 'react';
import { usePatternStore } from '@/lib/store/usePatternStore';
import { useTransportStore } from '@/lib/store/useTransportStore';
import { TimingGrade } from '@/lib/live-practice/types';
import { TrackRow } from './TrackRow';

function getStepsPerBeat(subdivision: string): number {
  switch (subdivision) {
    case '16th': return 4;
    case 'triplet': return 3;
    default: return 2; // 8th
  }
}

interface BeatGridProps {
  stepAccuracies?: Record<string, TimingGrade>;
}

export function BeatGrid({ stepAccuracies }: BeatGridProps) {
  const currentPattern = usePatternStore((s) => s.currentPattern);
  const toggleStep = usePatternStore((s) => s.toggleStep);
  const toggleTrackMute = usePatternStore((s) => s.toggleTrackMute);
  const currentStep = useTransportStore((s) => s.currentStep);

  const stepsPerBeat = getStepsPerBeat(currentPattern.subdivision);

  return (
    <div className="bg-gray-900/50 rounded-xl p-4 sm:p-6 border border-gray-800">
      {/* Sticking labels for rudiments */}
      {currentPattern.sticking && (
        <div className="flex items-center gap-2 mb-2">
          <div className="w-20 sm:w-24" />
          <div className="flex gap-0.5 sm:gap-1">
            {currentPattern.sticking.map((hand, i) => (
              <div
                key={i}
                className={`
                  w-9 h-5 sm:w-10 sm:h-6 flex items-center justify-center text-xs font-bold rounded
                  ${hand === 'R' ? 'text-blue-400' : 'text-green-400'}
                `}
              >
                {hand}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Beat number indicators */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-20 sm:w-24" />
        <div className="flex gap-0.5 sm:gap-1">
          {Array.from({ length: currentPattern.totalSteps }).map((_, i) => {
            const isDownbeat = i % stepsPerBeat === 0;
            const beatNumber = Math.floor(i / stepsPerBeat) + 1;
            return (
              <div
                key={i}
                className={`
                  w-9 h-5 sm:w-10 sm:h-6 flex items-center justify-center text-xs rounded
                  ${isDownbeat ? 'text-gray-400 font-bold' : 'text-gray-600'}
                `}
              >
                {isDownbeat ? beatNumber : i % stepsPerBeat === 1 ? '&' : ''}
              </div>
            );
          })}
        </div>
      </div>

      {/* Track rows */}
      <div className="flex flex-col gap-1.5">
        {currentPattern.tracks.map((track, trackIndex) => (
          <TrackRow
            key={`${currentPattern.id}-${trackIndex}`}
            track={track}
            trackIndex={trackIndex}
            currentStep={currentStep}
            stepsPerBeat={stepsPerBeat}
            onToggleStep={toggleStep}
            onToggleMute={toggleTrackMute}
            stepAccuracies={stepAccuracies}
          />
        ))}
      </div>
    </div>
  );
}
