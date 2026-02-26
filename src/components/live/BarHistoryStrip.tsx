'use client';

import { useLivePracticeStore } from '@/lib/store/useLivePracticeStore';

function getBarColor(accuracy: number): string {
  if (accuracy >= 80) return 'bg-green-500';
  if (accuracy >= 60) return 'bg-yellow-500';
  if (accuracy >= 40) return 'bg-orange-500';
  return 'bg-red-500';
}

export function BarHistoryStrip() {
  const barHistory = useLivePracticeStore((s) => s.barHistory);
  const isActive = useLivePracticeStore((s) => s.isActive);
  const stats = useLivePracticeStore((s) => s.stats);

  if (!isActive && stats.totalExpected === 0) return null;
  if (barHistory.length === 0) return null;

  // Show last 12 bars
  const visible = barHistory.slice(-12);

  return (
    <div className="bg-[#1a1d27] rounded-lg px-3 py-2 border border-gray-800">
      <div className="text-[10px] text-gray-600 mb-1.5">Bar History</div>
      <div className="flex gap-1 items-end">
        {visible.map((bar, i) => (
          <div
            key={barHistory.length - visible.length + i}
            className="group relative flex-1"
          >
            <div
              className={`h-4 rounded-sm ${getBarColor(bar.accuracy)} transition-all duration-200`}
              style={{ opacity: 0.4 + (bar.accuracy / 100) * 0.6 }}
            />
            <div className="text-[9px] text-gray-500 text-center mt-0.5 tabular-nums">
              {bar.accuracy}%
            </div>
          </div>
        ))}
        {/* Empty slots to maintain layout */}
        {Array.from({ length: Math.max(0, 8 - visible.length) }).map((_, i) => (
          <div key={`empty-${i}`} className="flex-1">
            <div className="h-4 rounded-sm bg-gray-800/50" />
            <div className="text-[9px] text-transparent mt-0.5">&nbsp;</div>
          </div>
        ))}
      </div>
    </div>
  );
}
