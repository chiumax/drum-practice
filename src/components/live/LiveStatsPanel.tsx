'use client';

import { useLivePracticeStore } from '@/lib/store/useLivePracticeStore';
import { GRADE_TEXT_COLORS } from '@/lib/live-practice/types';

export function LiveStatsPanel() {
  const stats = useLivePracticeStore((s) => s.stats);
  const lastGrade = useLivePracticeStore((s) => s.lastTapGrade);
  const isActive = useLivePracticeStore((s) => s.isActive);

  const accuracy = stats.totalExpected > 0
    ? Math.round((stats.totalHits / stats.totalExpected) * 100)
    : 0;

  const avgOffsetMs = Math.round(stats.averageOffset * 1000);
  const offsetLabel = avgOffsetMs === 0
    ? 'On beat'
    : avgOffsetMs > 0
      ? `+${avgOffsetMs}ms (late)`
      : `${avgOffsetMs}ms (early)`;

  if (!isActive && stats.totalExpected === 0) return null;

  return (
    <div className="bg-[#1a1d27] rounded-xl p-4 border border-gray-800">
      <div className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-3">
        Stats
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Accuracy */}
        <div>
          <div className="text-2xl font-bold text-white">{accuracy}%</div>
          <div className="text-xs text-gray-500">Accuracy</div>
        </div>

        {/* Streak */}
        <div>
          <div className="text-2xl font-bold text-white">{stats.currentStreak}</div>
          <div className="text-xs text-gray-500">
            Streak {stats.bestStreak > 0 && `(best: ${stats.bestStreak})`}
          </div>
        </div>

        {/* Timing */}
        <div>
          <div className="text-sm font-medium text-gray-300">{offsetLabel}</div>
          <div className="text-xs text-gray-500">Avg timing</div>
        </div>

        {/* Last grade */}
        <div>
          {lastGrade && (
            <div className={`text-sm font-bold uppercase ${GRADE_TEXT_COLORS[lastGrade]}`}>
              {lastGrade}
            </div>
          )}
          <div className="text-xs text-gray-500">Last tap</div>
        </div>
      </div>

      {/* Grade breakdown */}
      {stats.totalExpected > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-800">
          <div className="flex gap-3 text-xs">
            <span className="text-green-400">{stats.perfectCount} perfect</span>
            <span className="text-lime-400">{stats.greatCount} great</span>
            <span className="text-yellow-400">{stats.goodCount} good</span>
            <span className="text-orange-400">{stats.earlyLateCount} off</span>
            <span className="text-red-500">{stats.totalMisses} miss</span>
          </div>
        </div>
      )}
    </div>
  );
}
