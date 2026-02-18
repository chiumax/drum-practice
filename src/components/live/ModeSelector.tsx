'use client';

import { usePatternStore } from '@/lib/store/usePatternStore';
import { useLivePracticeStore } from '@/lib/store/useLivePracticeStore';
import { LiveMode } from '@/lib/live-practice/types';
import { InstrumentId } from '@/lib/patterns/types';

const modes: { id: LiveMode; label: string; description: string }[] = [
  { id: 'full-kit', label: 'Full Kit', description: 'Play all instruments' },
  { id: 'single-track', label: 'Single Track', description: 'Focus on one instrument' },
];

export function ModeSelector() {
  const mode = useLivePracticeStore((s) => s.mode);
  const setMode = useLivePracticeStore((s) => s.setMode);
  const focusedTrack = useLivePracticeStore((s) => s.focusedTrack);
  const setFocusedTrack = useLivePracticeStore((s) => s.setFocusedTrack);
  const tracks = usePatternStore((s) => s.currentPattern.tracks);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => {
              setMode(m.id);
              if (m.id === 'single-track' && !focusedTrack && tracks.length > 0) {
                setFocusedTrack(tracks[0].instrumentId);
              }
            }}
            className={`
              px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer
              ${mode === m.id
                ? 'bg-white text-gray-900'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
              }
            `}
            title={m.description}
          >
            {m.label}
          </button>
        ))}
      </div>

      {mode === 'single-track' && (
        <div className="flex flex-wrap gap-1">
          {tracks.map((track) => (
            <button
              key={track.instrumentId}
              onClick={() => setFocusedTrack(track.instrumentId as InstrumentId)}
              className={`
                px-2 py-1 rounded text-xs transition-all cursor-pointer
                ${focusedTrack === track.instrumentId
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-800 text-gray-500 hover:text-gray-300'
                }
              `}
            >
              {track.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
