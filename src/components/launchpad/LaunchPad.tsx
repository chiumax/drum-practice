'use client';

import React, { useCallback } from 'react';
import { PAD_KEY_LABELS, GRID_COLS } from '@/lib/launchpad/types';
import { ALL_PACKS } from '@/lib/launchpad/packs';
import { useLaunchpadStore } from '@/lib/store/useLaunchpadStore';
import { audioEngine } from '@/lib/audio/AudioEngine';

const Pad = React.memo(function Pad({
  padIndex,
  sampleId,
  isActive,
  onTrigger,
  onRelease,
}: {
  padIndex: number;
  sampleId: string;
  isActive: boolean;
  onTrigger: (padIndex: number) => void;
  onRelease: (padIndex: number) => void;
}) {
  const keyLabel = PAD_KEY_LABELS[padIndex];
  const isEmpty = !sampleId;

  return (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        if (!isEmpty) {
          audioEngine.init();
          onTrigger(padIndex);
        }
      }}
      onMouseUp={() => onRelease(padIndex)}
      onMouseLeave={() => onRelease(padIndex)}
      onTouchStart={(e) => {
        e.preventDefault();
        if (!isEmpty) {
          audioEngine.init();
          onTrigger(padIndex);
        }
      }}
      onTouchEnd={(e) => {
        e.preventDefault();
        onRelease(padIndex);
      }}
      disabled={isEmpty}
      className={`
        relative flex flex-col items-center justify-center
        aspect-square rounded-md border cursor-pointer select-none
        transition-all duration-75
        ${isEmpty
          ? 'bg-gray-900/40 border-gray-800/30 cursor-default'
          : isActive
            ? 'bg-orange-500/80 border-orange-400 shadow-lg shadow-orange-500/30 scale-95'
            : 'bg-gray-800/80 border-gray-700/50 hover:bg-gray-700/60 hover:border-gray-600/60'
        }
      `}
      style={{ touchAction: 'none' }}
    >
      {!isEmpty && (
        <span className="text-[9px] sm:text-[10px] text-gray-400 font-mono">
          {keyLabel}
        </span>
      )}
    </button>
  );
});

export function LaunchPadGrid() {
  const currentPackIndex = useLaunchpadStore((s) => s.currentPackIndex);
  const currentChain = useLaunchpadStore((s) => s.currentChain);
  const activePads = useLaunchpadStore((s) => s.activePads);
  const triggerPad = useLaunchpadStore((s) => s.triggerPad);
  const releasePad = useLaunchpadStore((s) => s.releasePad);

  const pack = ALL_PACKS[currentPackIndex];
  const mappings = pack.mappings[currentChain];

  // Render 4 rows of 12
  const rows: number[][] = [];
  for (let r = 0; r < 4; r++) {
    const row: number[] = [];
    for (let c = 0; c < GRID_COLS; c++) {
      row.push(r * GRID_COLS + c);
    }
    rows.push(row);
  }

  return (
    <div className="space-y-1 sm:space-y-1.5">
      {rows.map((row, r) => (
        <div key={r} className="grid grid-cols-12 gap-1 sm:gap-1.5">
          {row.map((padIndex) => (
            <Pad
              key={padIndex}
              padIndex={padIndex}
              sampleId={mappings[padIndex]}
              isActive={activePads.has(padIndex)}
              onTrigger={triggerPad}
              onRelease={releasePad}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function LaunchPadControls() {
  const currentPackIndex = useLaunchpadStore((s) => s.currentPackIndex);
  const currentChain = useLaunchpadStore((s) => s.currentChain);
  const isLoading = useLaunchpadStore((s) => s.isLoading);
  const setPack = useLaunchpadStore((s) => s.setPack);
  const setChain = useLaunchpadStore((s) => s.setChain);

  const chainLabels = ['Chain 1', 'Chain 2', 'Chain 3', 'Chain 4'];
  const chainArrows = ['←', '↑', '→', '↓'];

  return (
    <div className="space-y-4">
      {/* Sound pack selector */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {ALL_PACKS.map((pack, i) => (
          <button
            key={pack.id}
            onClick={() => setPack(i)}
            className={`
              px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
              ${currentPackIndex === i
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50 border border-transparent'
              }
            `}
          >
            {pack.songName.split(' - ')[1] || pack.songName}
          </button>
        ))}
      </div>

      {/* Chain selector */}
      <div className="flex items-center justify-center gap-2">
        {chainLabels.map((label, i) => (
          <button
            key={i}
            onClick={() => setChain(i)}
            className={`
              px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
              ${currentChain === i
                ? 'bg-gray-700 text-white'
                : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'
              }
            `}
          >
            <span className="mr-1 text-gray-600">{chainArrows[i]}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <p className="text-center text-xs text-orange-400 animate-pulse">
          Loading samples...
        </p>
      )}

      {/* Pack info */}
      <p className="text-center text-xs text-gray-600">
        {ALL_PACKS[currentPackIndex].songName} &middot; {ALL_PACKS[currentPackIndex].bpm} BPM
      </p>
    </div>
  );
}
