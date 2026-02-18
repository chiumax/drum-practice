'use client';

import { useCallback, useRef, useState } from 'react';
import { useTransportStore } from '@/lib/store/useTransportStore';

export function BpmControl() {
  const bpm = useTransportStore((s) => s.bpm);
  const setBpm = useTransportStore((s) => s.setBpm);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const tapTimesRef = useRef<number[]>([]);

  const handleTap = useCallback(() => {
    const now = Date.now();
    const taps = tapTimesRef.current;

    // Reset if last tap was more than 2 seconds ago
    if (taps.length > 0 && now - taps[taps.length - 1] > 2000) {
      tapTimesRef.current = [];
    }

    taps.push(now);

    // Keep last 6 taps
    if (taps.length > 6) taps.shift();

    if (taps.length >= 2) {
      const intervals: number[] = [];
      for (let i = 1; i < taps.length; i++) {
        intervals.push(taps[i] - taps[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const tapBpm = Math.round(60000 / avgInterval);
      setBpm(tapBpm);
    }
  }, [setBpm]);

  const handleEditStart = () => {
    setIsEditing(true);
    setEditValue(String(bpm));
  };

  const handleEditEnd = () => {
    setIsEditing(false);
    const val = parseInt(editValue, 10);
    if (!isNaN(val)) setBpm(val);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* BPM display */}
      <div className="text-center">
        {isEditing ? (
          <input
            type="number"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleEditEnd}
            onKeyDown={(e) => e.key === 'Enter' && handleEditEnd()}
            className="w-24 text-center text-3xl font-bold bg-transparent border-b-2 border-white text-white outline-none"
            min={40}
            max={240}
            autoFocus
          />
        ) : (
          <button
            onClick={handleEditStart}
            className="text-3xl font-bold text-white cursor-pointer hover:text-gray-300 transition-colors"
          >
            {bpm}
          </button>
        )}
        <div className="text-xs text-gray-500 mt-0.5">BPM</div>
      </div>

      {/* Slider */}
      <input
        type="range"
        min={40}
        max={240}
        value={bpm}
        onChange={(e) => setBpm(parseInt(e.target.value, 10))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-white"
      />

      {/* Controls row */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setBpm(bpm - 1)}
          className="w-8 h-8 rounded bg-gray-700 text-gray-300 flex items-center justify-center
                     hover:bg-gray-600 active:scale-95 transition-all cursor-pointer text-lg font-bold"
        >
          -
        </button>
        <button
          onClick={handleTap}
          className="px-4 h-8 rounded bg-gray-700 text-gray-300 text-xs font-medium
                     hover:bg-gray-600 active:scale-95 transition-all cursor-pointer uppercase tracking-wider"
        >
          Tap
        </button>
        <button
          onClick={() => setBpm(bpm + 1)}
          className="w-8 h-8 rounded bg-gray-700 text-gray-300 flex items-center justify-center
                     hover:bg-gray-600 active:scale-95 transition-all cursor-pointer text-lg font-bold"
        >
          +
        </button>
      </div>
    </div>
  );
}
