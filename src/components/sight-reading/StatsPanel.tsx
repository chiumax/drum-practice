'use client';

import { useSightReadingStore } from '@/lib/store/useSightReadingStore';

export function StatsPanel() {
  const stats = useSightReadingStore((s) => s.stats);

  const accuracy =
    stats.totalAttempts > 0
      ? Math.round((stats.correct / stats.totalAttempts) * 100)
      : 0;

  const elapsed = stats.startTime
    ? Math.floor((Date.now() - stats.startTime) / 1000)
    : 0;
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  return (
    <div className="bg-[#1a1d27] rounded-xl p-4 border border-gray-800">
      <h3 className="text-sm font-medium text-gray-400 mb-3">Session Stats</h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-2xl font-bold">
            {stats.totalAttempts > 0 ? `${accuracy}%` : '--'}
          </div>
          <div className="text-xs text-gray-500">Accuracy</div>
        </div>
        <div>
          <div className="text-2xl font-bold">
            {stats.correct}/{stats.totalAttempts}
          </div>
          <div className="text-xs text-gray-500">Correct</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-amber-400">
            {stats.streak}
          </div>
          <div className="text-xs text-gray-500">
            Streak {stats.bestStreak > 0 && `(best: ${stats.bestStreak})`}
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold">
            {stats.correct > 0 ? `${Math.round(stats.avgResponseMs)}ms` : '--'}
          </div>
          <div className="text-xs text-gray-500">Avg Response</div>
        </div>
      </div>
      {stats.startTime && (
        <div className="mt-3 text-xs text-gray-500">
          Time: {minutes}:{seconds.toString().padStart(2, '0')}
        </div>
      )}
    </div>
  );
}
