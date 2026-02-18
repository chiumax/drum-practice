'use client';

import { usePatternStore } from '@/lib/store/usePatternStore';
import { useLivePracticeStore } from '@/lib/store/useLivePracticeStore';
import { TapMatcher } from '@/lib/live-practice/TapMatcher';
import { TapPad } from './TapPad';

interface TapPadPanelProps {
  tapMatcher: TapMatcher | null;
  isActive: boolean;
}

export function TapPadPanel({ tapMatcher, isActive }: TapPadPanelProps) {
  const tracks = usePatternStore((s) => s.currentPattern.tracks);
  const keyMappings = useLivePracticeStore((s) => s.keyMappings);
  const mode = useLivePracticeStore((s) => s.mode);
  const focusedTrack = useLivePracticeStore((s) => s.focusedTrack);

  // In single-track mode, only show the focused track's pad
  const visibleTracks = mode === 'single-track' && focusedTrack
    ? tracks.filter((t) => t.instrumentId === focusedTrack)
    : tracks;

  return (
    <div className="bg-[#1a1d27] rounded-xl p-4 border border-gray-800">
      <div className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-3">
        Tap Pads
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {visibleTracks.map((track) => {
          const mapping = keyMappings.find(
            (m) => m.instrumentId === track.instrumentId
          );
          return (
            <TapPad
              key={track.instrumentId}
              instrumentId={track.instrumentId}
              label={track.label}
              keyLabel={mapping?.label ?? ''}
              tapMatcher={tapMatcher}
              isActive={isActive}
            />
          );
        })}
      </div>
    </div>
  );
}
