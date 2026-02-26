'use client';

import { useLivePracticeStore } from '@/lib/store/useLivePracticeStore';

export function TimingIndicator() {
  const lastOffset = useLivePracticeStore((s) => s.lastTapOffset);
  const lastGrade = useLivePracticeStore((s) => s.lastTapGrade);
  const isActive = useLivePracticeStore((s) => s.isActive);
  const stats = useLivePracticeStore((s) => s.stats);

  if (!isActive && stats.totalExpected === 0) return null;
  if (!lastGrade || lastGrade === 'miss') return null;

  // Clamp offset to ±100ms for display, map to -1..1 range
  const offsetMs = lastOffset * 1000;
  const clamped = Math.max(-100, Math.min(100, offsetMs));
  const position = (clamped + 100) / 200; // 0 = -100ms (early), 1 = +100ms (late)

  // Color based on distance from center
  const absOffset = Math.abs(clamped);
  let dotColor: string;
  if (absOffset < 15) dotColor = 'bg-green-400';
  else if (absOffset < 30) dotColor = 'bg-lime-400';
  else if (absOffset < 50) dotColor = 'bg-yellow-400';
  else dotColor = 'bg-orange-400';

  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-gray-600 w-8 text-right">Early</span>
      <div className="relative flex-1 h-5 max-w-[200px]">
        {/* Track */}
        <div className="absolute inset-y-0 left-0 right-0 flex items-center">
          <div className="w-full h-1 bg-gray-800 rounded-full" />
        </div>
        {/* Center tick */}
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gray-600" />
        {/* Quarter ticks */}
        <div className="absolute top-1.5 bottom-1.5 left-1/4 w-px bg-gray-800" />
        <div className="absolute top-1.5 bottom-1.5 left-3/4 w-px bg-gray-800" />
        {/* Dot */}
        <div
          className={`absolute top-1/2 w-3 h-3 rounded-full ${dotColor} shadow-lg transition-all duration-75`}
          style={{
            left: `${position * 100}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>
      <span className="text-[10px] text-gray-600 w-8">Late</span>
    </div>
  );
}
