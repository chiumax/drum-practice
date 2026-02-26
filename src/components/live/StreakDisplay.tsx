'use client';

import { useEffect, useState } from 'react';
import { useLivePracticeStore } from '@/lib/store/useLivePracticeStore';

export function StreakDisplay() {
  const streak = useLivePracticeStore((s) => s.stats.currentStreak);
  const streakBroken = useLivePracticeStore((s) => s.streakBroken);
  const clearStreakBroken = useLivePracticeStore((s) => s.clearStreakBroken);
  const isActive = useLivePracticeStore((s) => s.isActive);

  const [showBroken, setShowBroken] = useState(false);

  useEffect(() => {
    if (streakBroken) {
      setShowBroken(true);
      clearStreakBroken();
      const timer = setTimeout(() => setShowBroken(false), 800);
      return () => clearTimeout(timer);
    }
  }, [streakBroken, clearStreakBroken]);

  if (!isActive) return null;

  // Show broken flash
  if (showBroken) {
    return (
      <div className="flex items-center justify-center h-10">
        <span className="text-sm font-bold text-red-400 animate-streak-break">
          Streak Lost
        </span>
        <style>{`
          @keyframes streak-break {
            0% { opacity: 1; transform: scale(1.1); }
            100% { opacity: 0; transform: scale(0.9); }
          }
          .animate-streak-break {
            animation: streak-break 800ms ease-out forwards;
          }
        `}</style>
      </div>
    );
  }

  // Only show for streaks of 3+
  if (streak < 3) return <div className="h-10" />;

  let tier: string;
  let labelClass: string;
  let label: string;

  if (streak >= 20) {
    tier = 'text-orange-300 text-2xl';
    labelClass = 'text-orange-400';
    label = 'Unstoppable';
  } else if (streak >= 10) {
    tier = 'text-yellow-300 text-xl';
    labelClass = 'text-yellow-400';
    label = 'On Fire';
  } else {
    tier = 'text-green-300 text-lg';
    labelClass = 'text-green-400';
    label = 'Streak';
  }

  const glowClass = streak >= 20
    ? 'animate-streak-pulse-strong'
    : streak >= 10
      ? 'animate-streak-pulse'
      : '';

  return (
    <div className="flex items-center justify-center gap-2 h-10">
      <span className={`font-bold tabular-nums ${tier} ${glowClass}`}>
        {streak}
      </span>
      <span className={`text-xs font-medium uppercase tracking-wider ${labelClass}`}>
        {label}
      </span>
      <style>{`
        @keyframes streak-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes streak-pulse-strong {
          0%, 100% { opacity: 1; text-shadow: 0 0 8px rgba(251, 191, 36, 0.5); }
          50% { opacity: 0.8; text-shadow: 0 0 16px rgba(251, 191, 36, 0.8); }
        }
        .animate-streak-pulse {
          animation: streak-pulse 1s ease-in-out infinite;
        }
        .animate-streak-pulse-strong {
          animation: streak-pulse-strong 0.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
