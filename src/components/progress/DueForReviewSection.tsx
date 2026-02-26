'use client';

import { useRouter } from 'next/navigation';
import { getDuePatterns, usePracticeHistoryStore } from '@/lib/store/usePracticeHistoryStore';
import { usePatternStore } from '@/lib/store/usePatternStore';
import { useTransportStore } from '@/lib/store/useTransportStore';
import { allPatterns } from '@/lib/patterns';
import { getMasteryLevel, getMasteryColor } from '@/lib/spaced-repetition/sm2';

export function DueForReviewSection() {
  const cards = usePracticeHistoryStore((s) => s.cards);
  const loadPattern = usePatternStore((s) => s.loadPattern);
  const setBpm = useTransportStore((s) => s.setBpm);
  const stop = useTransportStore((s) => s.stop);
  const router = useRouter();

  const dueIds = getDuePatterns();
  const duePatterns = dueIds
    .map((id) => allPatterns.find((p) => p.id === id))
    .filter(Boolean)
    .slice(0, 10); // Show at most 10

  if (duePatterns.length === 0) {
    return (
      <div className="bg-[#1a1d27] rounded-xl p-4 border border-gray-800 text-center text-sm text-gray-500">
        All caught up! No patterns due for review.
      </div>
    );
  }

  const handlePractice = (patternId: string) => {
    const pattern = allPatterns.find((p) => p.id === patternId);
    if (!pattern) return;
    stop();
    loadPattern(pattern);
    setBpm(pattern.defaultBpm);
    router.push('/live');
  };

  return (
    <div className="bg-[#1a1d27] rounded-xl p-4 border border-gray-800">
      <h3 className="text-sm font-medium text-gray-400 mb-3">
        Due for Review ({dueIds.length})
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {duePatterns.map((pattern) => {
          if (!pattern) return null;
          const card = cards[pattern.id];
          const reps = card?.repetitions ?? 0;
          const lastAcc = card?.lastAccuracy;
          const daysOverdue = card?.nextReviewAt
            ? Math.max(0, Math.floor((Date.now() - card.nextReviewAt) / 86_400_000))
            : null;

          return (
            <button
              key={pattern.id}
              onClick={() => handlePractice(pattern.id)}
              className="flex-shrink-0 w-44 bg-gray-800/50 rounded-lg p-3 border border-gray-700
                         hover:border-gray-500 transition-colors cursor-pointer text-left"
            >
              <div className="flex items-start justify-between mb-1">
                <span className="text-xs font-medium text-gray-200 truncate">
                  {pattern.name}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mb-2">
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${getMasteryColor(reps)}`}>
                  {getMasteryLevel(reps)}
                </span>
                {daysOverdue !== null && daysOverdue > 0 && (
                  <span className="text-[10px] text-orange-400">
                    {daysOverdue}d overdue
                  </span>
                )}
              </div>
              {lastAcc !== null && lastAcc !== undefined && (
                <div className="text-xs text-gray-500">
                  Last: {lastAcc}%
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
