'use client';

import { useLivePracticeStore } from '@/lib/store/useLivePracticeStore';
import { usePatternStore } from '@/lib/store/usePatternStore';
import { InstrumentId } from '@/lib/patterns/types';

function getDotColor(absOffset: number): string {
  if (absOffset < 15) return 'bg-green-400';
  if (absOffset < 30) return 'bg-lime-400';
  if (absOffset < 50) return 'bg-yellow-400';
  return 'bg-orange-400';
}

function TrackTimingRow({ instrumentId, label }: { instrumentId: InstrumentId; label: string }) {
  const data = useLivePracticeStore((s) => s.perTrackOffset[instrumentId]);

  if (!data || data.grade === 'miss') {
    return (
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-gray-600 w-14 truncate">{label}</span>
        <div className="relative flex-1 h-4">
          <div className="absolute inset-y-0 left-0 right-0 flex items-center">
            <div className="w-full h-0.5 bg-gray-800 rounded-full" />
          </div>
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gray-700" />
        </div>
      </div>
    );
  }

  const offsetMs = data.offset * 1000;
  const clamped = Math.max(-100, Math.min(100, offsetMs));
  const position = (clamped + 100) / 200;
  const dotColor = getDotColor(Math.abs(clamped));
  const offsetLabel = Math.round(offsetMs);

  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-gray-500 w-14 truncate">{label}</span>
      <div className="relative flex-1 h-4">
        <div className="absolute inset-y-0 left-0 right-0 flex items-center">
          <div className="w-full h-0.5 bg-gray-800 rounded-full" />
        </div>
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gray-700" />
        <div
          className={`absolute top-1/2 w-2.5 h-2.5 rounded-full ${dotColor} transition-all duration-75`}
          style={{
            left: `${position * 100}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>
      <span className="text-[9px] text-gray-600 w-10 text-right tabular-nums">
        {offsetLabel > 0 ? '+' : ''}{offsetLabel}ms
      </span>
    </div>
  );
}

export function TimingIndicator() {
  const isActive = useLivePracticeStore((s) => s.isActive);
  const stats = useLivePracticeStore((s) => s.stats);
  const tracks = usePatternStore((s) => s.currentPattern.tracks);
  const mode = useLivePracticeStore((s) => s.mode);
  const focusedTrack = useLivePracticeStore((s) => s.focusedTrack);

  if (!isActive && stats.totalExpected === 0) return null;

  const visibleTracks = mode === 'single-track' && focusedTrack
    ? tracks.filter((t) => t.instrumentId === focusedTrack)
    : tracks;

  return (
    <div className="bg-[#1a1d27] rounded-lg px-3 py-2 border border-gray-800">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] text-gray-600">Timing</span>
        <div className="flex items-center gap-3 text-[9px] text-gray-600">
          <span>Early</span>
          <span>Late</span>
        </div>
      </div>
      <div className="space-y-1">
        {visibleTracks.map((track) => (
          <TrackTimingRow
            key={track.instrumentId}
            instrumentId={track.instrumentId}
            label={track.label}
          />
        ))}
      </div>
    </div>
  );
}
