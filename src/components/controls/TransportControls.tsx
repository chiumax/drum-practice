'use client';

import { useTransportStore } from '@/lib/store/useTransportStore';

export function TransportControls() {
  const playState = useTransportStore((s) => s.playState);
  const play = useTransportStore((s) => s.play);
  const pause = useTransportStore((s) => s.pause);
  const stop = useTransportStore((s) => s.stop);

  return (
    <div className="flex items-center gap-3">
      {/* Play / Pause */}
      <button
        onClick={playState === 'playing' ? pause : play}
        className="w-14 h-14 rounded-full bg-white text-gray-900 flex items-center justify-center
                   hover:bg-gray-200 active:scale-95 transition-all cursor-pointer shadow-lg"
        aria-label={playState === 'playing' ? 'Pause' : 'Play'}
      >
        {playState === 'playing' ? (
          // Pause icon
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <rect x="4" y="2" width="4" height="16" rx="1" />
            <rect x="12" y="2" width="4" height="16" rx="1" />
          </svg>
        ) : (
          // Play icon
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 3.5L16.5 10L5 16.5V3.5Z" />
          </svg>
        )}
      </button>

      {/* Stop */}
      <button
        onClick={stop}
        disabled={playState === 'stopped'}
        className="w-10 h-10 rounded-full bg-gray-700 text-gray-300 flex items-center justify-center
                   hover:bg-gray-600 active:scale-95 transition-all cursor-pointer
                   disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Stop"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
          <rect x="1" y="1" width="12" height="12" rx="2" />
        </svg>
      </button>
    </div>
  );
}
