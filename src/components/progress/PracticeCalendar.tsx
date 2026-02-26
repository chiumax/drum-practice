'use client';

import { usePracticeHistoryStore } from '@/lib/store/usePracticeHistoryStore';

function dateToKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getIntensityClass(minutesPracticed: number): string {
  if (minutesPracticed === 0) return 'bg-gray-800';
  if (minutesPracticed < 5) return 'bg-green-900';
  if (minutesPracticed < 15) return 'bg-green-700';
  return 'bg-green-500';
}

const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

export function PracticeCalendar() {
  const sessions = usePracticeHistoryStore((s) => s.sessions);

  // Build daily totals
  const dailyMinutes = new Map<string, number>();
  sessions.forEach((s) => {
    const key = dateToKey(new Date(s.startedAt));
    dailyMinutes.set(key, (dailyMinutes.get(key) ?? 0) + s.durationMs / 60_000);
  });

  // Generate 12 weeks of dates ending today
  const today = new Date();
  const cells: { date: Date; key: string }[] = [];

  // Start from 83 days ago (12 weeks - 1)
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 83);
  // Adjust to Monday
  const dayOfWeek = startDate.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  startDate.setDate(startDate.getDate() + mondayOffset);

  for (let i = 0; i < 84; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    cells.push({ date: d, key: dateToKey(d) });
  }

  return (
    <div className="bg-[#1a1d27] rounded-xl p-4 border border-gray-800">
      <h3 className="text-sm font-medium text-gray-400 mb-3">Practice Calendar</h3>
      <div className="flex gap-1">
        {/* Day labels */}
        <div className="flex flex-col gap-1 mr-1">
          {DAY_LABELS.map((label, i) => (
            <div key={i} className="w-6 h-3 text-[9px] text-gray-600 flex items-center">
              {label}
            </div>
          ))}
        </div>

        {/* Grid: 12 columns (weeks) x 7 rows (days) */}
        <div className="grid grid-rows-7 grid-flow-col gap-1">
          {cells.map((cell) => {
            const minutes = dailyMinutes.get(cell.key) ?? 0;
            const isFuture = cell.date > today;
            return (
              <div
                key={cell.key}
                className={`w-3 h-3 rounded-sm ${isFuture ? 'bg-gray-900' : getIntensityClass(minutes)}`}
                title={`${cell.key}: ${minutes > 0 ? `${Math.round(minutes)}min` : 'No practice'}`}
              />
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3 text-[9px] text-gray-600">
        <span>Less</span>
        <div className="w-3 h-3 rounded-sm bg-gray-800" />
        <div className="w-3 h-3 rounded-sm bg-green-900" />
        <div className="w-3 h-3 rounded-sm bg-green-700" />
        <div className="w-3 h-3 rounded-sm bg-green-500" />
        <span>More</span>
      </div>
    </div>
  );
}
