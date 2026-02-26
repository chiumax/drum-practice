'use client';

import { SessionStats } from '@/lib/live-practice/types';

interface TimingBreakdownBarProps {
  stats: SessionStats;
}

export function TimingBreakdownBar({ stats }: TimingBreakdownBarProps) {
  const total = stats.totalExpected;
  if (total === 0) return null;

  const segments = [
    { count: stats.perfectCount, color: 'bg-green-400', label: 'Perfect' },
    { count: stats.greatCount, color: 'bg-lime-400', label: 'Great' },
    { count: stats.goodCount, color: 'bg-yellow-400', label: 'Good' },
    { count: stats.earlyLateCount, color: 'bg-orange-400', label: 'Off' },
    { count: stats.totalMisses, color: 'bg-red-500', label: 'Miss' },
  ].filter((s) => s.count > 0);

  return (
    <div>
      <div className="flex h-2 rounded-full overflow-hidden bg-gray-800">
        {segments.map((seg) => (
          <div
            key={seg.label}
            className={`${seg.color}`}
            style={{ width: `${(seg.count / total) * 100}%` }}
          />
        ))}
      </div>
      <div className="flex gap-2 mt-1 flex-wrap">
        {segments.map((seg) => (
          <span key={seg.label} className="text-[9px] text-gray-500">
            <span className={`inline-block w-1.5 h-1.5 rounded-full ${seg.color} mr-0.5`} />
            {seg.label} {Math.round((seg.count / total) * 100)}%
          </span>
        ))}
      </div>
    </div>
  );
}
