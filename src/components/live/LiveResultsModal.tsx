'use client';

import { useLivePracticeStore } from '@/lib/store/useLivePracticeStore';
import { usePatternStore } from '@/lib/store/usePatternStore';
import { usePracticeHistoryStore, getLastLiveSessionForPattern } from '@/lib/store/usePracticeHistoryStore';
import { GRADE_TEXT_COLORS } from '@/lib/live-practice/types';
import { TimingBreakdownBar } from '@/components/progress/TimingBreakdownBar';

interface LiveResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
}

export function LiveResultsModal({ isOpen, onClose, onRetry }: LiveResultsModalProps) {
  const stats = useLivePracticeStore((s) => s.stats);
  const patternId = usePatternStore((s) => s.currentPattern.id);
  const card = usePracticeHistoryStore((s) => s.cards[patternId]);

  if (!isOpen || stats.totalExpected === 0) return null;

  const accuracy = Math.round((stats.totalHits / stats.totalExpected) * 100);
  const avgOffsetMs = Math.round(stats.averageOffset * 1000);

  // Previous session comparison
  const prevSession = getLastLiveSessionForPattern(patternId);
  const prevAccuracy = prevSession?.accuracy ?? null;
  const accuracyDelta = prevAccuracy !== null ? accuracy - prevAccuracy : null;

  let overallGrade: string;
  let gradeColor: string;
  if (accuracy >= 90) { overallGrade = 'Excellent'; gradeColor = 'text-green-400'; }
  else if (accuracy >= 75) { overallGrade = 'Great'; gradeColor = 'text-lime-400'; }
  else if (accuracy >= 60) { overallGrade = 'Good'; gradeColor = 'text-yellow-400'; }
  else if (accuracy >= 40) { overallGrade = 'Keep Practicing'; gradeColor = 'text-orange-400'; }
  else { overallGrade = 'Try Slower'; gradeColor = 'text-red-400'; }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#1a1d27] rounded-2xl p-6 border border-gray-700 max-w-sm w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold text-center mb-1">Session Complete</h2>
        <div className={`text-center text-2xl font-bold mb-4 ${gradeColor}`}>
          {overallGrade}
        </div>

        {/* Big accuracy number */}
        <div className="text-center mb-1">
          <div className="text-5xl font-bold text-white">{accuracy}%</div>
          <div className="text-sm text-gray-500 mt-1">
            {stats.totalHits}/{stats.totalExpected} hits
          </div>
        </div>

        {/* vs Previous session */}
        {accuracyDelta !== null && (
          <div className="text-center mb-4">
            <span className={`text-sm font-medium ${accuracyDelta > 0 ? 'text-green-400' : accuracyDelta < 0 ? 'text-red-400' : 'text-gray-400'}`}>
              {accuracyDelta > 0 ? `+${accuracyDelta}%` : accuracyDelta < 0 ? `${accuracyDelta}%` : '='} from last session
            </span>
          </div>
        )}
        {accuracyDelta === null && <div className="mb-4" />}

        {/* Timing distribution bar */}
        <div className="mb-4">
          <TimingBreakdownBar stats={stats} />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-800/50 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-white">{stats.bestStreak}</div>
            <div className="text-xs text-gray-500">Best Streak</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-white">
              {avgOffsetMs > 0 ? '+' : ''}{avgOffsetMs}ms
            </div>
            <div className="text-xs text-gray-500">Avg Timing</div>
          </div>
        </div>

        {/* Grade breakdown */}
        <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
          <div className="grid grid-cols-5 gap-1 text-center text-xs">
            <div>
              <div className={`font-bold ${GRADE_TEXT_COLORS.perfect}`}>{stats.perfectCount}</div>
              <div className="text-gray-600">Perfect</div>
            </div>
            <div>
              <div className={`font-bold ${GRADE_TEXT_COLORS.great}`}>{stats.greatCount}</div>
              <div className="text-gray-600">Great</div>
            </div>
            <div>
              <div className={`font-bold ${GRADE_TEXT_COLORS.good}`}>{stats.goodCount}</div>
              <div className="text-gray-600">Good</div>
            </div>
            <div>
              <div className={`font-bold ${GRADE_TEXT_COLORS.early}`}>{stats.earlyLateCount}</div>
              <div className="text-gray-600">Off</div>
            </div>
            <div>
              <div className={`font-bold ${GRADE_TEXT_COLORS.miss}`}>{stats.totalMisses}</div>
              <div className="text-gray-600">Miss</div>
            </div>
          </div>
        </div>

        {/* Bar-by-bar trend */}
        {stats.barHistory.length > 1 && (
          <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
            <div className="text-[10px] text-gray-500 mb-2">Bar-by-Bar Accuracy</div>
            <div className="flex items-end gap-0.5 h-8">
              {stats.barHistory.map((bar, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm transition-all"
                  style={{
                    height: `${Math.max(10, bar.accuracy)}%`,
                    backgroundColor: bar.accuracy >= 80 ? '#4ade80'
                      : bar.accuracy >= 60 ? '#eab308'
                      : bar.accuracy >= 40 ? '#f97316'
                      : '#ef4444',
                    opacity: 0.5 + (bar.accuracy / 200),
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Next review info */}
        {card && (
          <div className="text-xs text-gray-500 text-center mb-3">
            Session saved. Next review in{' '}
            {card.intervalDays === 1 ? '1 day' : `${card.intervalDays} days`}.
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onRetry}
            className="flex-1 h-10 rounded-lg bg-white text-gray-900 font-medium text-sm
                       hover:bg-gray-200 active:scale-95 transition-all cursor-pointer"
          >
            Try Again
          </button>
          <button
            onClick={onClose}
            className="flex-1 h-10 rounded-lg bg-gray-700 text-gray-300 font-medium text-sm
                       hover:bg-gray-600 active:scale-95 transition-all cursor-pointer"
          >
            Back to Patterns
          </button>
        </div>
      </div>
    </div>
  );
}
