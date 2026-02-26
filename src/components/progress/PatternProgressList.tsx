'use client';

import { useState } from 'react';
import { usePracticeHistoryStore, getSessionsForPattern } from '@/lib/store/usePracticeHistoryStore';
import { PatternAccuracySparkline } from './PatternAccuracySparkline';
import { TimingBreakdownBar } from './TimingBreakdownBar';
import { getMasteryLevel, getMasteryColor } from '@/lib/spaced-repetition/sm2';

export function PatternProgressList() {
  const sessions = usePracticeHistoryStore((s) => s.sessions);
  const cards = usePracticeHistoryStore((s) => s.cards);
  const [expandedPattern, setExpandedPattern] = useState<string | null>(null);

  // Group sessions by pattern
  const patternIds = Array.from(new Set(sessions.map((s) => s.patternId)));

  if (patternIds.length === 0) {
    return (
      <div className="bg-[#1a1d27] rounded-xl p-4 border border-gray-800 text-center text-sm text-gray-500">
        No practice sessions yet. Start practicing to see progress!
      </div>
    );
  }

  return (
    <div className="bg-[#1a1d27] rounded-xl border border-gray-800">
      <h3 className="text-sm font-medium text-gray-400 p-4 pb-2">Pattern Progress</h3>
      <div className="divide-y divide-gray-800">
        {patternIds.map((patternId) => {
          const patternSessions = getSessionsForPattern(patternId);
          const patternName = patternSessions[0]?.patternName ?? patternId;
          const card = cards[patternId];
          const reps = card?.repetitions ?? 0;

          // Accuracy values for sparkline (live sessions only, oldest first)
          const accuracyValues = patternSessions
            .filter((s) => s.accuracy !== null)
            .reverse()
            .slice(-10)
            .map((s) => s.accuracy!);

          const bestAccuracy = accuracyValues.length > 0
            ? Math.max(...accuracyValues)
            : null;

          const isExpanded = expandedPattern === patternId;

          return (
            <div key={patternId}>
              <button
                onClick={() => setExpandedPattern(isExpanded ? null : patternId)}
                className="w-full flex items-center gap-3 p-3 px-4 hover:bg-gray-800/30 transition-colors cursor-pointer text-left"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-200 truncate">
                    {patternName}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${getMasteryColor(reps)}`}>
                      {getMasteryLevel(reps)}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {patternSessions.length} session{patternSessions.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {accuracyValues.length > 0 && (
                    <PatternAccuracySparkline values={accuracyValues} />
                  )}
                  {bestAccuracy !== null && (
                    <span className="text-xs text-green-400 font-medium w-10 text-right">
                      {bestAccuracy}%
                    </span>
                  )}
                  <svg
                    width="12" height="12" viewBox="0 0 12 12"
                    className={`text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  >
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  </svg>
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-3">
                  <div className="text-[10px] text-gray-600 grid grid-cols-5 gap-2 mb-1 px-2">
                    <span>Date</span>
                    <span>Mode</span>
                    <span>BPM</span>
                    <span>Accuracy</span>
                    <span>Trend</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-0.5">
                    {patternSessions.slice(0, 20).map((session, idx) => {
                      const date = new Date(session.startedAt);
                      const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
                      const duration = Math.round(session.durationMs / 1000);
                      // Compare to next (older) session of same mode
                      const nextSession = patternSessions[idx + 1];
                      const delta = session.accuracy !== null && nextSession?.accuracy !== null
                        ? session.accuracy - nextSession.accuracy
                        : null;
                      return (
                        <div key={session.id}>
                          <div className="text-xs text-gray-400 grid grid-cols-5 gap-2 px-2 py-1 rounded hover:bg-gray-800/50">
                            <span>{dateStr}</span>
                            <span>{session.mode}</span>
                            <span>{session.bpm}</span>
                            <span>
                              {session.accuracy !== null ? (
                                <span className={session.accuracy >= 70 ? 'text-green-400' : session.accuracy >= 50 ? 'text-yellow-400' : 'text-red-400'}>
                                  {session.accuracy}%
                                </span>
                              ) : (
                                <span className="text-gray-600">{duration}s</span>
                              )}
                            </span>
                            <span>
                              {delta !== null && delta !== 0 && (
                                <span className={delta > 0 ? 'text-green-400' : 'text-red-400'}>
                                  {delta > 0 ? `+${delta}` : delta}
                                </span>
                              )}
                            </span>
                          </div>
                          {session.stats && (
                            <div className="px-2 mt-0.5 mb-1">
                              <TimingBreakdownBar stats={session.stats} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
