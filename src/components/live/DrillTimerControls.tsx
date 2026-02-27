'use client';

import { useLivePracticeStore } from '@/lib/store/useLivePracticeStore';

const presets = [
  { label: 'No Timer', ms: null },
  { label: '1 min', ms: 60_000 },
  { label: '2 min', ms: 120_000 },
  { label: '5 min', ms: 300_000 },
  { label: '10 min', ms: 600_000 },
];

export function DrillTimerSelector() {
  const drillDurationMs = useLivePracticeStore((s) => s.drillDurationMs);
  const setDrillDuration = useLivePracticeStore((s) => s.setDrillDuration);
  const isActive = useLivePracticeStore((s) => s.isActive);

  return (
    <div>
      <div className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2">
        Drill Timer
      </div>
      <div className="flex flex-wrap gap-1">
        {presets.map((p) => (
          <button
            key={p.label}
            onClick={() => setDrillDuration(p.ms)}
            disabled={isActive}
            className={`px-2 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
              drillDurationMs === p.ms
                ? 'bg-white text-gray-900'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            } ${isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function DrillCountdown() {
  const remainingMs = useLivePracticeStore((s) => s.drillRemainingMs);
  const isActive = useLivePracticeStore((s) => s.isActive);

  if (!isActive || remainingMs === null) return null;

  const totalSeconds = Math.ceil(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const isLow = remainingMs < 10_000;

  return (
    <div className={`text-2xl font-bold tabular-nums ${
      isLow ? 'text-red-400 animate-pulse' : 'text-white'
    }`}>
      {minutes}:{String(seconds).padStart(2, '0')}
    </div>
  );
}
