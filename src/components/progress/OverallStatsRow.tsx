'use client';

import { usePracticeHistoryStore, getTotalPracticeMs, getPracticedDays } from '@/lib/store/usePracticeHistoryStore';

function formatDuration(ms: number): string {
  const hours = Math.floor(ms / 3_600_000);
  const minutes = Math.floor((ms % 3_600_000) / 60_000);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function computeStreak(practicedDays: Set<string>): number {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (practicedDays.has(key)) streak++;
    else break;
  }
  return streak;
}

export function OverallStatsRow() {
  const sessions = usePracticeHistoryStore((s) => s.sessions);

  const totalMs = getTotalPracticeMs();
  const days = getPracticedDays();
  const streak = computeStreak(days);
  const uniquePatterns = new Set(sessions.map((s) => s.patternId)).size;

  // Average accuracy across live sessions
  const liveSessions = sessions.filter((s) => s.accuracy !== null);
  const avgAccuracy = liveSessions.length > 0
    ? Math.round(liveSessions.reduce((sum, s) => sum + s.accuracy!, 0) / liveSessions.length)
    : null;

  const tiles = [
    { label: 'Total Time', value: sessions.length > 0 ? formatDuration(totalMs) : '--' },
    { label: 'Sessions', value: sessions.length.toString() },
    { label: 'Patterns', value: uniquePatterns.toString() },
    { label: 'Day Streak', value: streak > 0 ? `${streak}d` : '--' },
    { label: 'Avg Accuracy', value: avgAccuracy !== null ? `${avgAccuracy}%` : '--' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      {tiles.map((tile) => (
        <div
          key={tile.label}
          className="bg-[#1a1d27] rounded-xl p-4 border border-gray-800 text-center"
        >
          <div className="text-2xl font-bold text-white">{tile.value}</div>
          <div className="text-xs text-gray-500 mt-1">{tile.label}</div>
        </div>
      ))}
    </div>
  );
}
