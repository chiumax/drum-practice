'use client';

import { useEffect, useState } from 'react';
import { usePracticeStore } from '@/lib/store/usePracticeStore';
import { useTransportStore } from '@/lib/store/useTransportStore';

export function PracticeStats() {
  const barsPlayed = usePracticeStore((s) => s.barsPlayed);
  const sessionStartTime = usePracticeStore((s) => s.sessionStartTime);
  const playState = useTransportStore((s) => s.playState);
  const bpm = useTransportStore((s) => s.bpm);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (playState !== 'playing' || !sessionStartTime) return;

    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - sessionStartTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [playState, sessionStartTime]);

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  if (playState === 'stopped' && barsPlayed === 0) return null;

  return (
    <div className="flex items-center gap-4 text-xs text-gray-400">
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
        <span>{timeStr}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span>Bars: {barsPlayed}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span>{bpm} BPM</span>
      </div>
    </div>
  );
}
