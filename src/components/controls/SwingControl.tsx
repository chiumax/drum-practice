'use client';

import { useTransportStore } from '@/lib/store/useTransportStore';

export function SwingControl() {
  const swing = useTransportStore((s) => s.swing);
  const setSwing = useTransportStore((s) => s.setSwing);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Swing</span>
        <span className="text-xs text-gray-400">{Math.round(swing * 100)}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={Math.round(swing * 100)}
        onChange={(e) => setSwing(parseInt(e.target.value, 10) / 100)}
        className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gray-400"
      />
    </div>
  );
}
